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
  type: z.enum(["qna", "theory"]),
  exam: string().optional(),
  course: string().optional(),
});

export const topicsSchema = object({
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
