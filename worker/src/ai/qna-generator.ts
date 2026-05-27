import { createGoogleGenerativeAI } from "@ai-sdk/google";
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
import { completionQueue } from "..";

dotenv.config();

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});
const model1 = google("gemini-2.5-flash");

const MAX_TOKENS = 8000;

export const generateQnaAction = async (state: z.infer<typeof qbankSchema>) => {
  const materialId = state.topics[0].materialId;
  const tempDir = path.join(__dirname, `../../${materialId}`);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const allTopics = state.topics;
  let numbering = 1;

  for (const topic of allTopics) {
    try {
      const { text, usage } = await generateText({
        model: model1,
        maxOutputTokens: MAX_TOKENS,
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

      const formatDoc = text.split("QNAEND");
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
        }
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
        }
      );
    }
    await completionQueue.add("completion", {
      materialId: materialId,
      type: "qbank",
    });
  }
};
