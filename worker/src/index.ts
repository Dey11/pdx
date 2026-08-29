import { Job, Worker } from "bullmq";
import { Queue } from "bullmq";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import { generateQnaAction } from "./ai/qna-generator";
import { generateTheoryAction } from "./ai/theory-generator";
import { getTerminalTaskState, postWorkerCallback } from "./callback";
import {
  BUCKET_NAME,
  MERGE_PDF_QUEUE_NAME,
  QNA_QUEUE_NAME,
  QUEUE_NAME,
  WORKER_TEMP_DIR,
} from "./constants";
import { validateWorkerEnv } from "./env";
import { generatePdfFromMarkdown } from "./lib/generate-pdf";
import { mergePdfsFromR2, uploadPdfToR2 } from "./object-storage";
import { isPermanentGenerationError } from "./retry-policy";
import { theoryPartKey } from "./storage-keys";
import {
  completionJobSchema,
  jobSchema,
  mergeJobSchema,
  qbankSchema,
} from "./zod/schema";

dotenv.config();
validateWorkerEnv();

// Four BullMQ workers wire up the generation pipeline:
//   1. theoryQueue   -> generate one topic's PDF and upload it to R2.
//   2. qbankQueue    -> generateQnaAction handles all topics of one material
//                       itself.
//   3. completionQueue -> persist each terminal task and recalculate progress.
//   4. mergePdfQueue -> merge all part PDFs and POST /api/generation/complete.
//
// Completion protocol: successful generation enqueues an idempotent completion
// job. Exhausted or discarded generation jobs remain in Redis until the failure
// reconciler durably publishes their terminal outcomes. Web derives progress
// from terminal task rows, so callback retries cannot double-count progress.
//
// Callback state machine per material:
//   progress (per part, persists outcome) -> when all tasks are terminal
//   the web app enqueues mergePdf
//   -> mergePdf -> complete (finalizes the material).

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  // TLS removed for self-hosted Redis - enable only if using TLS
  ...(process.env.REDIS_TLS === "true" && { tls: {} }),
};

export const completionQueue = new Queue("completionQueue", {
  connection,
  defaultJobOptions: {
    attempts: 100_000,
    backoff: { type: "fixed", delay: 30_000 },
    removeOnComplete: { count: 100_000 },
  },
});
const failedTheoryQueue = new Queue(QUEUE_NAME, { connection });
const failedQbankQueue = new Queue(QNA_QUEUE_NAME, { connection });

const theoryWorker = new Worker(
  QUEUE_NAME,
  async (job: Job) => {
    const res = jobSchema.safeParse(job.data);
    if (!res.success) {
      job.discard();
      console.error("Invalid theory job data");
      throw new Error("Invalid job data");
    }

    const completionJobId = `completion-${res.data.topic.id}`;

    try {
      const [terminalTaskState, pendingCompletion] = await Promise.all([
        getTerminalTaskState(res.data.topic.materialId),
        completionQueue.getJob(completionJobId),
      ]);
      if (terminalTaskState.has(res.data.topic.id) || pendingCompletion) return;

      // Generate markdown content
      const [theoryMarkdown, usage] = await generateTheoryAction(res.data);

      // Generate temporary PDF file path
      const tempDir = WORKER_TEMP_DIR;
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }
      const timestamp = Date.now().toString();
      const tempFilePath = path.join(tempDir, `${timestamp}.pdf`);
      const objectKey = theoryPartKey(
        res.data.topic.materialId,
        res.data.topic.id
      );

      // Convert markdown to PDF
      await generatePdfFromMarkdown(theoryMarkdown as string, tempFilePath);

      // Upload to R2
      await uploadPdfToR2(tempFilePath, BUCKET_NAME, objectKey, {
        materialId: String(res.data.topic.materialId),
        id: String(res.data.topic.id),
        currindex: String(res.data.topic.currIndex),
        totalIndex: String(res.data.topic.totalIndex),
      });

      const completion = {
        materialId: res.data.topic.materialId,
        taskId: res.data.topic.id,
        type: "theory" as const,
        key: objectKey,
        usage,
        success: true,
      };

      await completionQueue.add("completion", completion, {
        jobId: completionJobId,
      });
    } catch (error) {
      if (isPermanentGenerationError(error)) job.discard();
      console.error("Theory generation attempt failed");
      throw new Error("Theory generation attempt failed");
    }
  },
  {
    connection,
    concurrency: 3,
    removeOnComplete: { count: 100_000 },
  }
);

const qbankWorker = new Worker(
  QNA_QUEUE_NAME,
  async (job: Job) => {
    const res = qbankSchema.safeParse(job.data);
    if (!res.success) {
      job.discard();
      console.error("Invalid question-bank job data");
      throw new Error("Invalid job data");
    }

    try {
      await generateQnaAction(res.data);
    } catch (error) {
      if (isPermanentGenerationError(error)) job.discard();
      console.error("Question-bank generation attempt failed");
      throw new Error("Question-bank generation attempt failed");
    }
  },
  {
    connection,
    concurrency: 2,
    removeOnComplete: { count: 100_000 },
  }
);

const enqueueFailureCompletion = async (
  taskId: string,
  materialId: string,
  type: "theory" | "qbank"
) => {
  const jobId = `completion-${taskId}`;
  if (await completionQueue.getJob(jobId)) return;

  await completionQueue.add(
    "completion",
    { materialId, taskId, type, key: "", usage: 0, success: false },
    { jobId }
  );
};

let isReconcilingFailures = false;
const reconcileFailedGenerationJobs = async () => {
  if (isReconcilingFailures) return;
  isReconcilingFailures = true;

  try {
    const [theoryJobs, qbankJobs] = await Promise.all([
      failedTheoryQueue.getJobs(["failed"], 0, 99, true),
      failedQbankQueue.getJobs(["failed"], 0, 99, true),
    ]);

    for (const job of theoryJobs) {
      const payload = jobSchema.safeParse(job.data);
      if (!payload.success) {
        await job.remove();
        continue;
      }

      const topic = payload.data.topic;
      const terminalTaskState = await getTerminalTaskState(topic.materialId);
      if (!terminalTaskState.has(topic.id)) {
        await enqueueFailureCompletion(topic.id, topic.materialId, "theory");
      }
      await job.remove();
    }

    for (const job of qbankJobs) {
      const payload = qbankSchema.safeParse(job.data);
      if (!payload.success) {
        await job.remove();
        continue;
      }

      const materialId = payload.data.topics[0].materialId;
      const terminalTaskState = await getTerminalTaskState(materialId);
      for (const topic of payload.data.topics) {
        if (!terminalTaskState.has(topic.id)) {
          await enqueueFailureCompletion(topic.id, materialId, "qbank");
        }
      }
      await job.remove();
    }
  } catch {
    console.error("Failed generation reconciliation will retry");
  } finally {
    isReconcilingFailures = false;
  }
};

const progressWorker = new Worker(
  "completionQueue",
  async (job: Job) => {
    const completion = completionJobSchema.safeParse(job.data);
    if (!completion.success) {
      job.discard();
      throw new Error("Invalid completion job data");
    }
    try {
      await postWorkerCallback("/api/generation/progress", completion.data);
    } catch {
      console.error("Progress callback failed");
      throw new Error("Progress callback failed");
    }
  },
  { connection }
);

const mergeWorker = new Worker(
  MERGE_PDF_QUEUE_NAME,
  async (job: Job) => {
    const merge = mergeJobSchema.safeParse(job.data);
    if (!merge.success) {
      job.discard();
      throw new Error("Invalid merge job data");
    }
    try {
      const materialId = merge.data.materialId;

      const outputKey = await mergePdfsFromR2(
        merge.data.arrOfKeys,
        BUCKET_NAME,
        merge.data.type,
        materialId
      );
      await postWorkerCallback("/api/generation/complete", {
        materialId,
        key: outputKey,
      });
    } catch {
      console.error("PDF merge or completion callback failed");
      throw new Error("PDF merge or completion callback failed");
    }
  },
  {
    connection,
    concurrency: 1,
    removeOnComplete: {
      age: 3600, // keep up to 1 hour
      count: 10, // keep up to 1000 jobs
    },
  }
);

let isDispatching = false;
const retryPendingDispatches = async () => {
  if (isDispatching) return;
  isDispatching = true;
  try {
    await postWorkerCallback("/api/internal/generation-dispatch", {});
  } catch {
    console.error("Generation dispatch retry failed");
  } finally {
    isDispatching = false;
  }
};
const dispatchRetryInterval = setInterval(
  () => void retryPendingDispatches(),
  30_000
);
void retryPendingDispatches();
const failureReconciliationInterval = setInterval(
  () => void reconcileFailedGenerationJobs(),
  30_000
);
void reconcileFailedGenerationJobs();

let isShuttingDown = false;
const shutdown = async (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  clearInterval(dispatchRetryInterval);
  clearInterval(failureReconciliationInterval);
  console.info(`Received ${signal}; waiting for generation workers to close`);

  await Promise.all([
    theoryWorker.close(),
    qbankWorker.close(),
    progressWorker.close(),
    mergeWorker.close(),
    failedTheoryQueue.close(),
    failedQbankQueue.close(),
  ]);
  await completionQueue.close();
  process.exit(0);
};

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
