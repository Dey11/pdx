import { generateText } from "ai";
import dotenv from "dotenv";
import { z } from "zod";

import { theoryGeneratorSystemPrompt } from "../prompts/generator";
import { jobSchema } from "../zod/schema";
import { MAX_OUTPUT_TOKENS, getGenerationModel } from "./models";

dotenv.config();

export const generateTheoryAction = async (
  state: z.infer<typeof jobSchema>
) => {
  const model = await getGenerationModel(state.topic.materialId);
  const { text, usage } = await generateText({
    model,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    system: `${theoryGeneratorSystemPrompt}\nInstruction: ${state.instruction}. Course: ${state.course}.
Exam: ${state.exam}. Language: ${state.language}. Subject: ${state.subject}.`,
    maxRetries: 2,
    prompt: JSON.stringify(state.topic.data),
  });

  if (!text.trim()) throw new Error("AI provider returned an empty response");
  return [text, usage.totalTokens ?? 0] as const;
};
