import { describe, expect, test } from "bun:test";

import {
  completionJobSchema,
  generationStateSchema,
  jobSchema,
  mergeJobSchema,
} from "../../worker/src/zod/schema";
import { topicsSchema } from "./zod";

const theoryJob = {
  instruction: "Cover the syllabus",
  complexity: "advanced" as const,
  language: "english",
  course: "Physics",
  exam: "Final",
  subject: "Mechanics",
  type: "theory" as const,
  topic: {
    id: "task-1",
    materialId: "material-1",
    topic: "Motion",
    status: "pending" as const,
    tokensUsed: 0,
    partialResultUrl: null,
    createdAt: "2026-08-29T00:00:00.000Z",
    updatedAt: "2026-08-29T00:00:00.000Z",
    currIndex: 1,
    totalIndex: 1,
    data: {
      id: "topic-1",
      name: "Motion",
      weightage: "high" as const,
      subtopics: [{ id: "subtopic-1", title: "Velocity" }],
      numericals: [],
      formulas: true,
      examples: true,
      completed: false,
      tryCount: 0,
    },
  },
};

describe("generation queue contract", () => {
  test("accepts the intended theory payload", () => {
    expect(jobSchema.safeParse(theoryJob).success).toBe(true);
  });

  test.each(["apiKey", "encryptedKey"])(
    "rejects a queued %s field",
    (field) => {
      expect(
        jobSchema.safeParse({ ...theoryJob, [field]: "must-not-enter-redis" })
          .success
      ).toBe(false);
    }
  );

  test("requires weightage before dispatching a question bank", () => {
    const qbankDispatch = {
      type: "qbank",
      moduleName: "Mechanics",
      instruction: "Create a balanced question bank",
      complexity: "advanced",
      subject: "Physics",
      topics: [theoryJob.topic.data],
    };

    expect(topicsSchema.safeParse(qbankDispatch).success).toBe(false);
    expect(
      topicsSchema.safeParse({ ...qbankDispatch, weightage: "auto" }).success
    ).toBe(true);
  });

  test("accepts idempotent completion and merge payloads", () => {
    expect(
      completionJobSchema.safeParse({
        materialId: "material-1",
        taskId: "task-1",
        type: "theory",
        key: "theory/topics/material-1/task-1.pdf",
        usage: 10,
        success: true,
        nextQuestionNumber: 12,
      }).success
    ).toBe(true);
    expect(
      generationStateSchema.safeParse({
        terminalTasks: [{ id: "task-1", nextQuestionNumber: 12 }],
      }).success
    ).toBe(true);
    expect(
      mergeJobSchema.safeParse({
        materialId: "material-1",
        type: "theory",
        arrOfKeys: [
          {
            Key: "theory/topics/material-1/task-1.pdf",
            Bucket: "materials",
          },
        ],
      }).success
    ).toBe(true);
  });

  test.each(["apiKey", "encryptedKey"])(
    "rejects a completion %s field",
    (field) => {
      expect(
        completionJobSchema.safeParse({
          materialId: "material-1",
          taskId: "task-1",
          type: "theory",
          key: "theory/topics/material-1/task-1.pdf",
          usage: 10,
          success: true,
          [field]: "must-not-enter-redis",
        }).success
      ).toBe(false);
    }
  );
});
