import { z } from "zod";

export const jobSchema = z.object({
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
});

export const qbankSchema = z.object({
  instruction: z.string(),
  complexity: z.enum(["beginner", "intermediate", "advanced"]),
  language: z.string().optional(),
  course: z.string().optional(),
  exam: z.string().optional(),
  subject: z.string(),
  weightage: z.enum(["auto", "short", "long", "medium"]),
  type: z.enum(["qbank"]),
  // topics: z.array(
  //   z.object({
  //     id: z.string(), // {id: 'topic-0-12dd8be1-9002-4cb2-b075-ad0adb8aada4',
  //     materialId: z.string(), // {id: 'topic-0-12dd8be1-9002-4cb2-b075-ad0adb8aada4',
  //     name: z.string(), // name: 'History and Overview of C++',
  //     weightage: z.enum(["low", "medium", "high"]), // weightage: 'low',
  //     subtopics: z.array(z.object({ id: z.string(), title: z.string() })), // subtopics: [ [Object], [Object], [Object], [Object], [Object] ],
  //     numericals: z.array(z.object({ id: z.string(), title: z.string() })), // numericals: [ [Object] ],
  //     formulas: z.boolean(), // formulas: false,
  //     examples: z.boolean(), // examples: true,
  //     completed: z.boolean(), // completed: false,
  //     tryCount: z.number(), // tryCount: 0
  //   })
  // ),
  topics: z.array(
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
        numericals: z.array(z.object({ id: z.string(), title: z.string() })), // numericals: [ [Object] ],
        formulas: z.boolean(), // formulas: false,
        examples: z.boolean(), // examples: true,
        completed: z.boolean(), // completed: false,
        tryCount: z.number(), // tryCount: 0
      }),
    })
  ),
});

export interface R2Object {
  Key: string;
  Bucket: string;
}
