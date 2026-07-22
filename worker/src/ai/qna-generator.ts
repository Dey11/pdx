import { generateText } from "ai";
import { qnaGeneratorSystemPrompt } from "../prompts/generator";
import { qbankSchema } from "../zod/schema";
import { z } from "zod";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { generatePdfFromMarkdown } from "../lib/generate-pdf";
import { uploadPdfToR2 } from "../object-storage";
import { BUCKET_NAME } from "../constants";
import axios from "axios";
import { workerCallbackHeaders } from "../callback";
import { completionQueue } from "..";
import { getGenerationModelCandidates, MAX_OUTPUT_TOKENS } from "./models";

dotenv.config();

export const generateQnaAction = async (state: z.infer<typeof qbankSchema>) => {
  const materialId = state.topics[0].materialId;
  const tempDir = path.join(__dirname, `../../${materialId}`);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const allTopics = state.topics;
  let numbering = 1;

  for (const topic of allTopics) {
    const modelCandidates = getGenerationModelCandidates();
    let generationError: unknown;

    try {
      let generatedText = "";
      let totalTokens = 0;

      for (const candidate of modelCandidates) {
        try {
          const { text, usage } = await generateText({
            model: candidate.model,
            providerOptions: candidate.providerOptions,
            maxOutputTokens: MAX_OUTPUT_TOKENS,
            system: qnaGeneratorSystemPrompt,
            maxRetries: 2,
            messages: [
              {
                role: "system",
                content: `Instruction: ${state.instruction}. Course: ${state.course}.
          Exam: ${state.exam}. Language: ${state.language}. Subject: ${state.subject}.
          Start the current numbering from ${numbering}. Weightage in general should be more on ${state.weightage} type questions.
          If it is auto, feel free to choose yourself. If it is long, try to keep long type questions but keep them minimal. 
          Complexity should be ${state.complexity}.`,
              },
              {
                role: "user",
                content: JSON.stringify(topic.data),
              },
            ],
          });

          if (!text.trim()) {
            throw new Error(`Empty generation response from ${candidate.label}`);
          }

          generatedText = text;
          totalTokens = usage.totalTokens ?? 0;
          break;
        } catch (err) {
          generationError = err;
          console.error(`Qbank generation failed with ${candidate.label}`, err);
        }
      }

      if (!generatedText) {
        throw generationError ?? new Error("Qbank generation failed");
      }

      const formatDoc = generatedText.split("QNAEND");
      numbering = 1 + parseInt(formatDoc[1]);

      const newTime = Date.now().toString();
      const tempFilePath = path.join(tempDir, `${newTime}.pdf`);

      await generatePdfFromMarkdown(formatDoc[0], tempFilePath);

      await uploadPdfToR2(
        tempFilePath,
        BUCKET_NAME,
        `qbank/topics/${materialId}/${newTime}.pdf`,
        {
          materialId,
          id: String(topic.id),
        }
      );

      await axios.post(
        `${process.env.BACKEND_URL}/api/generation/update-task`,
        {
          materialId: materialId,
          id: topic.id,
          currIndex: topic.currIndex,
          totalIndex: topic.totalIndex,
          key: `qbank/topics/${materialId}/${newTime}.pdf`,
          usage: totalTokens,
          success: true,
        },
        { headers: workerCallbackHeaders() }
      );
    } catch (error) {
      console.error(error);
      await axios.post(
        `${process.env.BACKEND_URL}/api/generation/update-task`,
        {
          materialId: materialId,
          id: topic.id,
          currIndex: topic.currIndex,
          totalIndex: topic.totalIndex,
          key: "",
          usage: 0,
          success: false,
        },
        { headers: workerCallbackHeaders() }
      );
    }
    await completionQueue.add("completion", {
      materialId: materialId,
      type: "qbank",
    });
  }
};
