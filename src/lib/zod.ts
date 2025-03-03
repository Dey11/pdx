import { array, boolean, number, object, string, z } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
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

export const generateTopicsSchema = object({
  language: string().optional(),
  subject: string().min(1, "Subject is required"),
  syllabus: string().min(3, "Syllabus is required"),
  complexity: z.enum(["beginner", "intermediate", "advanced"]),
  type: z.enum(["theory", "qbank"]),
  weightage: z.enum(["auto", "short", "long", "medium"]).optional(),
  exam: string().optional(),
  course: string().optional(),
});

export const topicsSchema = object({
  type: z.enum(["theory", "qbank"]),
  weightage: z.enum(["auto", "short", "long", "medium"]).optional(),
  credits: number().positive("Credits must be a positive number"),
  moduleName: string().min(1, "Module name is required"),
  instruction: string().min(1, "Instruction is required"),
  complexity: z.enum(["beginner", "intermediate", "advanced"]),
  exam: string().optional(),
  course: string().optional(),
  subject: string(),
  language: string().optional(),
  topics: array(
    object({
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
    })
  ),
});
