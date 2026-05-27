import { Queue } from "bullmq";
import { z } from "zod";

import { prisma } from "./db";
import { topicsSchema } from "./zod";

const redisConnection = () => {
  return {
    host: process.env.REDIS_HOST || "localhost",
    password: process.env.REDIS_PASSWORD || undefined,
    port: Number.parseInt(process.env.REDIS_PORT || "6379", 10),
  };
};

const getTheoryQueue = () =>
  new Queue("theoryQueue", {
    connection: redisConnection(),
    defaultJobOptions: {
      attempts: 1,
      removeOnComplete: true,
    },
  });

const getQbankQueue = () =>
  new Queue("qbankQueue", {
    connection: redisConnection(),
    defaultJobOptions: {
      attempts: 1,
      removeOnComplete: true,
    },
  });

const getMergePdfQueue = () =>
  new Queue("mergePdfQueue", {
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
