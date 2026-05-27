import { generateText } from "ai";
import { theoryGeneratorSystemPrompt } from "../prompts/generator";
import { jobSchema } from "../zod/schema";
import { z } from "zod";
import dotenv from "dotenv";
import { getGenerationModelCandidates, MAX_OUTPUT_TOKENS } from "./models";

dotenv.config();

export const generateTheoryAction = async (
  state: z.infer<typeof jobSchema>
) => {
  const modelCandidates = getGenerationModelCandidates();
  let generationError: unknown;

  try {
    for (const candidate of modelCandidates) {
      try {
        const { text, usage } = await generateText({
          model: candidate.model,
          providerOptions: candidate.providerOptions,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          system: theoryGeneratorSystemPrompt,
          maxRetries: 2,
          messages: [
            {
              role: "system",
              content: `Instruction: ${state.instruction}. Course: ${state.course}.
          Exam: ${state.exam}. Language: ${state.language}. Subject: ${state.subject}`,
            },
            {
              role: "user",
              content: JSON.stringify(state.topic.data),
            },
          ],
        });

        if (text.trim()) {
          return [text, usage.totalTokens ?? 0];
        }

        throw new Error(`Empty generation response from ${candidate.label}`);
      } catch (err) {
        generationError = err;
        console.error(`Theory generation failed with ${candidate.label}`, err);
      }
    }

    throw generationError ?? new Error("Theory generation failed");
  } catch (err) {
    console.error(err);
    return ["", 0];
    // throw new Error("Failed to generate theory");
  }
};
