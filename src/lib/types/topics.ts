export type TopicsType = {
  type: "theory" | "qna";
  moduleName: string;
  instruction: string;
  complexity: "beginner" | "intermediate" | "advanced";
  subject: string;
  exam: string;
  course: string;
  language: string;
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
