import { describe, expect, test } from "bun:test";

import { jobSchema } from "../../worker/src/zod/schema";

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
});
