import { Queue } from "bullmq";
import { z } from "zod";

import { prisma } from "./db";
import { topicsSchema } from "./zod";

const theoryQueue = new Queue("theoryQueue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT as unknown as number,
    password: process.env.REDIS_PASSWORD,
    // tls: {},
  },
  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: true,
  },
});

const qbankQueue = new Queue("qbankQueue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT as unknown as number,
    password: process.env.REDIS_PASSWORD,
    // tls: {},
  },
  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: true,
  },
});

const mergePdfQueue = new Queue("mergePdfQueue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT as unknown as number,
    password: process.env.REDIS_PASSWORD,
    // tls: {},
  },
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
        await theoryQueue.add("theory", {
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
      await qbankQueue.add("qbank", {
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

    let arrOfKeys: ArrOfKeysType[] = [];

    materials.forEach((element) => {
      arrOfKeys.push({
        Key: element.partialResultUrl!,
        Bucket: process.env.BUCKET_NAME!,
      });
    });

    await mergePdfQueue.add("mergePdf", {
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
