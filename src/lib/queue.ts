import { Queue } from "bullmq";
import { z } from "zod";

import { prisma } from "./db";
import { topicsSchema } from "./zod";

const theoryQueue = new Queue("theoryQueue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT as unknown as number,
    password: process.env.REDIS_PASSWORD,
    tls: {},
  },
  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: true,
  },
});

const qnaQueue = new Queue("qnaQueue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT as unknown as number,
    password: process.env.REDIS_PASSWORD,
    tls: {},
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
    tls: {},
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

export async function addJobs(
  jobs: z.infer<typeof topicsSchema>,
  materialId: string
) {
  try {
    var dbInsertableArr: MaterialTask[] = [];
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
    } else {
      res.forEach(async (element) => {
        await qnaQueue.add("question", {
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
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function mergePdf(jobs: { materialId: string }) {
  try {
    await mergePdfQueue.add("mergePdf", { materialId: jobs.materialId });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
