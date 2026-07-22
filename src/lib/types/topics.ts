// Shape of the topic plan returned by POST /api/generation/generate-topics.
// Mirrors the inline `topicSchema` in
// src/app/api/generation/generate-topics/route.ts (the raw AI-generated plan
// the editor components consume). This is the pre-enqueue representation;
// src/lib/zod.ts's `topicsSchema` is the normalized form sent to the worker.
export type TopicsType = {
  type: "theory" | "qbank";
  moduleName: string;
  instruction: string;
  complexity: "beginner" | "intermediate" | "advanced";
  subject: string;
  exam: string;
  course: string;
  language: string;
  weightage?: "auto" | "short" | "medium" | "long";
  submodules: {
    name: string;
    weightage: "high" | "medium" | "low";
    subtopics: string[];
    numericals: string[];
    formulas: boolean;
    examples: boolean;
    completed: boolean;
    tryCount: number;
  }[];
};
