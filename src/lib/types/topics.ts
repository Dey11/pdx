export type TopicsType = {
  moduleName: string;
  instruction: string;
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
