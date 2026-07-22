import { Job, Worker } from "bullmq";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { jobSchema, qbankSchema } from "./zod/schema";
import { generateTheoryAction } from "./ai/theory-generator";
import { generatePdfFromMarkdown } from "./lib/generate-pdf";
import { mergePdfsFromR2, uploadPdfToR2 } from "./object-storage";
import {
  BUCKET_NAME,
  MERGE_PDF_QUEUE_NAME,
  QNA_QUEUE_NAME,
  QUEUE_NAME,
} from "./constants";
import axios from "axios";
import { Queue } from "bullmq";
import { generateQnaAction } from "./ai/qna-generator";
import { workerCallbackHeaders } from "./callback";
import { validateWorkerEnv } from "./env";

dotenv.config();
validateWorkerEnv();

// Four BullMQ workers wire up the generation pipeline:
//   1. theoryQueue   -> generate one topic's PDF, upload to R2, then POST
//                       /api/generation/update-task (success or failure).
//   2. qbankQueue    -> generateQnaAction handles all topics of one material
//                       and posts update-task per topic itself.
//   3. completionQueue -> POST /api/generation/progress to bump completedParts.
//   4. mergePdfQueue -> merge all part PDFs and POST /api/generation/complete.
//
// Completion protocol: the theory worker's finally block ALWAYS enqueues a
// completionQueue job regardless of success or failure, so every finished part
// (even a failed one) advances material progress and the material can never
// stall. (The qbank worker enqueues completion per topic inside
// generateQnaAction for the same reason.)
//
// Callback state machine per material:
//   update-task (per part) -> progress (per part, increments completedParts)
//   -> when completedParts === totalParts the web app enqueues mergePdf
//   -> mergePdf -> complete (finalizes material + settles credits).

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
    attempts: 1,
    removeOnComplete: true,
  },
});

new Worker(
  QUEUE_NAME,
  async (job: Job) => {
    try {
      const res = jobSchema.safeParse(job.data);
      if (!res.success) {
        console.error(res.error);
        throw new Error("Invalid job data");
      }

      // Generate markdown content
      const [theoryMarkdown, usage] = await generateTheoryAction(res.data);

      // Generate temporary PDF file path
      const tempDir = path.join(__dirname, "../temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }
      const timestamp = Date.now().toString();
      const tempFilePath = path.join(tempDir, `${timestamp}.pdf`);

      // Convert markdown to PDF
      await generatePdfFromMarkdown(theoryMarkdown as string, tempFilePath);

      // Upload to R2
      await uploadPdfToR2(
        tempFilePath,
        BUCKET_NAME,
        `theory/topics/${res.data.topic.materialId}/${timestamp}.pdf`,
        {
          materialId: String(res.data.topic.materialId),
          id: String(res.data.topic.id),
          currindex: String(res.data.topic.currIndex),
          totalIndex: String(res.data.topic.totalIndex),
        }
      );

      await axios.post(
        `${process.env.BACKEND_URL}/api/generation/update-task`,
        {
          materialId: res.data.topic.materialId,
          id: res.data.topic.id,
          currIndex: res.data.topic.currIndex,
          totalIndex: res.data.topic.totalIndex,
          key: `theory/topics/${res.data.topic.materialId}/${timestamp}.pdf`,
          usage: usage,
          success: true,
        },
        { headers: workerCallbackHeaders() }
      );
    } catch (err) {
      console.error(err);
      await axios.post(
        `${process.env.BACKEND_URL}/api/generation/update-task`,
        {
          materialId: job.data.topic.materialId,
          id: job.data.topic.id,
          currIndex: job.data.topic.currIndex,
          totalIndex: job.data.topic.totalIndex,
          key: "",
          usage: 0,
          success: false,
        },
        { headers: workerCallbackHeaders() }
      );
    } finally {
      await completionQueue.add("completion", {
        materialId: job.data.topic.materialId,
        type: "theory",
      });
    }
  },
  {
    connection,
    concurrency: 3,
    removeOnComplete: {
      age: 3600, // keep up to 1 hour
      count: 200, // keep up to 1000 jobs
    },
  }
);

new Worker(
  QNA_QUEUE_NAME,
  async (job: Job) => {
    try {
      const res = qbankSchema.safeParse(job.data);
      if (!res.success) {
        console.error(res.error);
        throw new Error("Invalid job data");
      }

      await generateQnaAction(res.data);
    } catch (err) {
      console.error(err);
    }
  },
  {
    connection,
    concurrency: 2,
    removeOnComplete: {
      age: 3600, // keep up to 1 hour
      count: 60, // keep up to 1000 jobs
    },
  }
);

new Worker(
  "completionQueue",
  async (job: Job) => {
    try {
      await axios.post(
        `${process.env.BACKEND_URL}/api/generation/progress`,
        {
          materialId: job.data.materialId,
          type: job.data.type,
        },
        { headers: workerCallbackHeaders() }
      );
    } catch (err) {
      console.error(err);
    }
  },
  { connection }
);

new Worker(
  MERGE_PDF_QUEUE_NAME,
  async (job: Job) => {
    try {
      const materialId = job.data.materialId as string;

      const outputKey = await mergePdfsFromR2(
        job.data.arrOfKeys,
        BUCKET_NAME,
        job.data.type
      );
      await axios.post(
        `${process.env.BACKEND_URL}/api/generation/complete`,
        {
          materialId: materialId,
          key: outputKey,
        },
        { headers: workerCallbackHeaders() }
      );
    } catch (err) {
      console.error("Error in mergePdfWorker:", err);
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
