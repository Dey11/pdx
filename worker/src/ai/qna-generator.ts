import { generateText } from "ai";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { z } from "zod";

import { completionQueue } from "..";
import { workerCallbackHeaders } from "../callback";
import { BUCKET_NAME, WORKER_TEMP_DIR } from "../constants";
import { generatePdfFromMarkdown } from "../lib/generate-pdf";
import { uploadPdfToR2 } from "../object-storage";
import { qnaGeneratorSystemPrompt } from "../prompts/generator";
import { qbankSchema } from "../zod/schema";
import { MAX_OUTPUT_TOKENS, getGenerationModel } from "./models";

dotenv.config();

export const generateQnaAction = async (state: z.infer<typeof qbankSchema>) => {
  const materialId = state.topics[0].materialId;
  const tempDir = path.join(WORKER_TEMP_DIR, materialId);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const allTopics = state.topics;
  const modelPromise = getGenerationModel(materialId);
  let numbering = 1;

  for (const topic of allTopics) {
    try {
      const model = await modelPromise;
      const { text: generatedText, usage } = await generateText({
        model,
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        system: `${qnaGeneratorSystemPrompt}\nInstruction: ${state.instruction}. Course: ${state.course}.
Exam: ${state.exam}. Language: ${state.language}. Subject: ${state.subject}.
Start the current numbering from ${numbering}. Weightage should favor ${state.weightage} questions.
If it is auto, choose the mix. Keep long questions limited. Complexity: ${state.complexity}.`,
        maxRetries: 2,
        prompt: JSON.stringify(topic.data),
      });

      if (!generatedText.trim()) {
        throw new Error("AI provider returned an empty response");
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
          usage: usage.totalTokens ?? 0,
          success: true,
        },
        { headers: workerCallbackHeaders() }
      );
    } catch {
      console.error(`Question generation failed for task ${topic.id}`);
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
