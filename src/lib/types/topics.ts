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
    weightage: "easy" | "medium" | "hard";
    subtopics: string[];
    numericals: string[];
    formulas: boolean;
    examples: boolean;
    completed: boolean;
    tryCount: number;
  }[];
};
