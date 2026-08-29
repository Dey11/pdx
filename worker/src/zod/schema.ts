import { z } from "zod";

export const jobSchema = z
  .object({
    instruction: z.string(),
    complexity: z.enum(["beginner", "intermediate", "advanced"]),
    language: z.string().optional(),
    course: z.string().optional(),
    exam: z.string().optional(),
    subject: z.string(),
    type: z.enum(["qbank", "theory"]),
    topic: z.object({
      id: z.string(),
      materialId: z.string(),
      topic: z.string(),
      status: z.enum(["pending", "inprogress", "completed", "failed"]),
      tokensUsed: z.number(),
      partialResultUrl: z.string().optional().nullable(),
      createdAt: z.string(),
      updatedAt: z.string(),
      currIndex: z.number(),
      totalIndex: z.number(),
      data: z.object({
        id: z.string(), // {id: 'topic-0-12dd8be1-9002-4cb2-b075-ad0adb8aada4',
        name: z.string(), // name: 'History and Overview of C++',
        weightage: z.enum(["low", "medium", "high"]), // weightage: 'low',
        subtopics: z.array(z.object({ id: z.string(), title: z.string() })), // subtopics: [ [Object], [Object], [Object], [Object], [Object] ],
        numericals: z.array(z.object({ id: z.string(), title: z.string() })), // numericals: [ [Object] ],
        formulas: z.boolean(), // formulas: false,
        examples: z.boolean(), // examples: true,
        completed: z.boolean(), // completed: false,
        tryCount: z.number(), // tryCount: 0
      }),
    }),
  })
  .strict();

export const qbankSchema = z
  .object({
    instruction: z.string(),
    complexity: z.enum(["beginner", "intermediate", "advanced"]),
    language: z.string().optional(),
    course: z.string().optional(),
    exam: z.string().optional(),
    subject: z.string(),
    weightage: z.enum(["auto", "short", "long", "medium"]),
    type: z.enum(["qbank"]),
    topics: z
      .array(
        z.object({
          id: z.string(),
          materialId: z.string(),
          topic: z.string(),
          status: z.enum(["pending", "inprogress", "completed", "failed"]),
          tokensUsed: z.number(),
          partialResultUrl: z.string().optional().nullable(),
          createdAt: z.string(),
          updatedAt: z.string(),
          currIndex: z.number(),
          totalIndex: z.number(),
          data: z.object({
            id: z.string(), // {id: 'topic-0-12dd8be1-9002-4cb2-b075-ad0adb8aada4',
            name: z.string(), // name: 'History and Overview of C++',
            weightage: z.enum(["low", "medium", "high"]), // weightage: 'low',
            subtopics: z.array(z.object({ id: z.string(), title: z.string() })), // subtopics: [ [Object], [Object], [Object], [Object], [Object] ],
            numericals: z.array(
              z.object({ id: z.string(), title: z.string() })
            ), // numericals: [ [Object] ],
            formulas: z.boolean(), // formulas: false,
            examples: z.boolean(), // examples: true,
            completed: z.boolean(), // completed: false,
            tryCount: z.number(), // tryCount: 0
          }),
        })
      )
      .min(1),
  })
  .strict();

export const completionJobSchema = z
  .object({
    materialId: z.string(),
    taskId: z.string(),
    type: z.enum(["theory", "qbank"]),
    key: z.string(),
    usage: z.number().nonnegative(),
    success: z.boolean(),
    nextQuestionNumber: z.number().int().positive().optional(),
  })
  .strict();

export const generationStateSchema = z
  .object({
    terminalTasks: z.array(
      z
        .object({
          id: z.string(),
          nextQuestionNumber: z.number().int().positive().nullable(),
        })
        .strict()
    ),
  })
  .strict();

export const mergeJobSchema = z
  .object({
    materialId: z.string(),
    type: z.enum(["theory", "qbank"]),
    arrOfKeys: z.array(
      z.object({ Key: z.string(), Bucket: z.string() }).strict()
    ),
  })
  .strict();

export interface R2Object {
  Key: string;
  Bucket: string;
}
