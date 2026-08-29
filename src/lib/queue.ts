import { Queue } from "bullmq";
import { z } from "zod";

import {
  MERGE_PDF_QUEUE_NAME,
  QBANK_QUEUE_NAME,
  THEORY_QUEUE_NAME,
} from "./constants";
import { prisma } from "./db";
import { topicsSchema } from "./zod";

// Producer side of the generation pipeline. The colocated worker (worker/src/*)
// is the consumer.
//
// Producer -> worker contract:
//   - "theory" materials fan out: one MaterialTask row and one theoryQueue job
//     per topic, generated and merged independently.
//   - "qbank" materials enqueue a SINGLE qbankQueue job carrying every topic;
//     the worker iterates topics itself.
//   - Every MaterialTask carries currIndex/totalIndex (1-based). Worker submits
//     its terminal task outcome through /api/generation/progress. Web derives
//     completedParts from task rows and triggers mergePdf() once all are terminal.
//
// Queues are created lazily per call (getXxxQueue()) rather than as module-level
// singletons: this module is imported by Next.js route handlers, and deferring
// construction avoids opening Redis connections at build/import time (and keeps
// each serverless invocation from leaking a long-lived connection).

const redisConnection = () => {
  return {
    host: process.env.REDIS_HOST || "localhost",
    password: process.env.REDIS_PASSWORD || undefined,
    port: Number.parseInt(process.env.REDIS_PORT || "6379", 10),
  };
};

const getTheoryQueue = () =>
  new Queue(THEORY_QUEUE_NAME, {
    connection: redisConnection(),
    defaultJobOptions: {
      attempts: 5,
      backoff: { type: "fixed", delay: 30_000 },
      // Keep deterministic IDs long enough for the database outbox to
      // reconcile an enqueue whose Redis acknowledgement was lost.
      removeOnComplete: { count: 100_000 },
    },
  });

const getQbankQueue = () =>
  new Queue(QBANK_QUEUE_NAME, {
    connection: redisConnection(),
    defaultJobOptions: {
      attempts: 5,
      backoff: { type: "fixed", delay: 30_000 },
      removeOnComplete: { count: 100_000 },
    },
  });

const getMergePdfQueue = () =>
  new Queue(MERGE_PDF_QUEUE_NAME, {
    connection: redisConnection(),
    defaultJobOptions: {
      attempts: 100_000,
      backoff: { type: "fixed", delay: 30_000 },
      removeOnComplete: { count: 100_000 },
    },
  });

export async function enqueue(
  jobs: z.infer<typeof topicsSchema>,
  materialId: string
) {
  try {
    const tasks = await prisma.materialTask.findMany({
      where: { materialId },
      orderBy: { currIndex: "asc" },
    });
    if (tasks.length !== jobs.topics.length) {
      throw new Error("Material task count does not match its dispatch");
    }

    if (jobs.type === "theory") {
      const queue = getTheoryQueue();
      let added = false;
      try {
        await queue.addBulk(
          tasks.map((element) => ({
            name: "theory",
            opts: { jobId: `theory-${element.id}` },
            data: {
              instruction: jobs.instruction,
              complexity: jobs.complexity,
              language: jobs.language,
              course: jobs.course,
              exam: jobs.exam,
              subject: jobs.subject,
              topic: element,
              type: jobs.type,
            },
          }))
        );
        added = true;
      } finally {
        await queue.close().catch(() => {
          if (!added) throw new Error("Theory queue connection failed");
        });
      }
    } else if (jobs.type === "qbank") {
      const queue = getQbankQueue();
      let added = false;
      try {
        await queue.add(
          "qbank",
          {
            instruction: jobs.instruction,
            complexity: jobs.complexity,
            language: jobs.language,
            course: jobs.course,
            exam: jobs.exam,
            subject: jobs.subject,
            topics: tasks,
            type: jobs.type,
            weightage: jobs.weightage,
          },
          { jobId: `qbank-${materialId}` }
        );
        added = true;
      } finally {
        await queue.close().catch(() => {
          if (!added) throw new Error("Question-bank queue connection failed");
        });
      }
    }
    return true;
  } catch {
    console.error("Failed to enqueue generation jobs");
    return false;
  }
}

type ArrOfKeysType = {
  Key: string;
  Bucket: string;
};

export async function mergePdf(jobs: { materialId: string; type: string }) {
  const queue = getMergePdfQueue();
  try {
    const materials = await prisma.materialTask.findMany({
      where: {
        materialId: jobs.materialId,
        status: "completed",
      },
      orderBy: {
        currIndex: "asc",
      },
    });

    const arrOfKeys: ArrOfKeysType[] = materials.map((element) => {
      return {
        Key: element.partialResultUrl!,
        Bucket: process.env.BUCKET_NAME!,
      };
    });

    await queue.add(
      "mergePdf",
      {
        materialId: jobs.materialId,
        type: jobs.type,
        arrOfKeys,
      },
      { jobId: `merge-${jobs.materialId}` }
    );
    return true;
  } catch {
    console.error("Failed to enqueue PDF merge");
    return false;
  } finally {
    await queue.close().catch(() => undefined);
  }
}
