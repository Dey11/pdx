import { array, boolean, number, object, string, z } from "zod";

export const signInSchema = object({
  email: string().min(1, "Email is required").email("Invalid email"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const waitlistSchema = object({
  email: string()
    .email(
      "We won't bombard you with marketing mails, please enter a valid email :)"
    )
    .min(1, "Email is required"),
  name: string().min(3, "Name must be at least 3 characters"),
});

const generationWeightageSchema = z.enum(["auto", "short", "long", "medium"]);

const generateTopicsShape = {
  language: string().optional(),
  subject: string().min(1, "Subject is required"),
  syllabus: string().min(3, "Syllabus is required"),
  complexity: z.enum(["beginner", "intermediate", "advanced"]),
  exam: string().optional(),
  course: string().optional(),
};

export const generateTopicsSchema = z.discriminatedUnion("type", [
  object({
    ...generateTopicsShape,
    type: z.literal("theory"),
    weightage: generationWeightageSchema.optional(),
  }),
  object({
    ...generateTopicsShape,
    type: z.literal("qbank"),
    weightage: generationWeightageSchema,
  }),
]);

const normalizedTopicSchema = object({
  id: string(),
  name: string(),
  weightage: z.enum(["low", "medium", "high"]),
  subtopics: array(
    object({
      id: string(),
      title: string(),
    })
  ),
  numericals: array(
    object({
      id: string(),
      title: string(),
    })
  ),
  formulas: boolean(),
  examples: boolean(),
  completed: boolean(),
  tryCount: number(),
});

const topicsShape = {
  moduleName: string().min(1, "Module name is required"),
  instruction: string().min(1, "Instruction is required"),
  complexity: z.enum(["beginner", "intermediate", "advanced"]),
  exam: string().optional(),
  course: string().optional(),
  subject: string(),
  language: string().optional(),
  topics: array(normalizedTopicSchema),
};

export const topicsSchema = z.discriminatedUnion("type", [
  object({
    ...topicsShape,
    type: z.literal("theory"),
    weightage: generationWeightageSchema.optional(),
  }),
  object({
    ...topicsShape,
    type: z.literal("qbank"),
    weightage: generationWeightageSchema,
  }),
]);
