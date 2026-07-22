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
//   - Every MaterialTask carries currIndex/totalIndex (1-based). The worker
//     echoes these back through /api/generation/update-task so the web app can
//     track per-part progress; /api/generation/progress increments
//     completedParts until it reaches totalParts and triggers mergePdf().
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
      attempts: 1,
      removeOnComplete: true,
    },
  });

const getQbankQueue = () =>
  new Queue(QBANK_QUEUE_NAME, {
    connection: redisConnection(),
    defaultJobOptions: {
      attempts: 1,
      removeOnComplete: true,
    },
  });

const getMergePdfQueue = () =>
  new Queue(MERGE_PDF_QUEUE_NAME, {
    connection: redisConnection(),
    defaultJobOptions: {
      attempts: 2,
      removeOnComplete: true,
    },
  });

type MaterialTask = {
  materialId: string;
  topic: string;
  data: z.infer<typeof topicsSchema>["topics"][0];
};

export async function enqueue(
  jobs: z.infer<typeof topicsSchema>,
  materialId: string
) {
  try {
    const dbInsertableArr: MaterialTask[] = [];
    jobs.topics.forEach((element, index) => {
      const temp = {
        materialId,
        topic: element.name,
        data: element,
        currIndex: index + 1,
        totalIndex: jobs.topics.length,
      };
      dbInsertableArr.push(temp);
    });

    const res = await prisma.materialTask.createManyAndReturn({
      data: dbInsertableArr,
    });

    if (jobs.type === "theory") {
      res.forEach(async (element) => {
        await getTheoryQueue().add("theory", {
          instruction: jobs.instruction,
          complexity: jobs.complexity,
          language: jobs.language,
          course: jobs.course,
          exam: jobs.exam,
          subject: jobs.subject,
          topic: element,
          type: jobs.type,
        });
      });
    } else if (jobs.type === "qbank") {
      await getQbankQueue().add("qbank", {
        instruction: jobs.instruction,
        complexity: jobs.complexity,
        language: jobs.language,
        course: jobs.course,
        exam: jobs.exam,
        subject: jobs.subject,
        topics: res,
        type: jobs.type,
        weightage: jobs.weightage,
      });
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

type ArrOfKeysType = {
  Key: string;
  Bucket: string;
};

export async function mergePdf(jobs: { materialId: string; type: string }) {
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

    await getMergePdfQueue().add("mergePdf", {
      materialId: jobs.materialId,
      type: jobs.type,
      arrOfKeys,
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
