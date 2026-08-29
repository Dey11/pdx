import { generateText } from "ai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { z } from "zod";

import { completionQueue } from "..";
import { getTerminalTaskState } from "../callback";
import { BUCKET_NAME, WORKER_TEMP_DIR } from "../constants";
import { generatePdfFromMarkdown } from "../lib/generate-pdf";
import { uploadPdfToR2 } from "../object-storage";
import { qnaGeneratorSystemPrompt } from "../prompts/generator";
import { parseNextQuestionNumber } from "../question-numbering";
import { questionBankPartKey } from "../storage-keys";
import { completionJobSchema, qbankSchema } from "../zod/schema";
import { MAX_OUTPUT_TOKENS, getGenerationModel } from "./models";

dotenv.config();

export const generateQnaAction = async (state: z.infer<typeof qbankSchema>) => {
  const materialId = state.topics[0].materialId;
  const tempDir = path.join(WORKER_TEMP_DIR, materialId);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const allTopics = state.topics;
  const terminalTaskState = await getTerminalTaskState(materialId);
  let modelPromise: ReturnType<typeof getGenerationModel> | undefined;
  let numbering = 1;

  for (const topic of allTopics) {
    const pendingCompletion = await completionQueue.getJob(
      `completion-${topic.id}`
    );
    const pendingOutcome = pendingCompletion
      ? completionJobSchema.safeParse(pendingCompletion.data)
      : null;
    const pendingTaskOutcome = pendingOutcome?.success
      ? pendingOutcome.data
      : null;
    const persistedNextNumber = terminalTaskState.get(topic.id);
    if (terminalTaskState.has(topic.id) || pendingTaskOutcome) {
      const nextNumber =
        pendingTaskOutcome?.nextQuestionNumber ?? persistedNextNumber;
      if (nextNumber) numbering = nextNumber;
      continue;
    }

    modelPromise ??= getGenerationModel(materialId);
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
    if (formatDoc.length !== 2) {
      throw new Error("AI provider returned invalid question numbering");
    }
    numbering = parseNextQuestionNumber(formatDoc[1], numbering);

    const newTime = Date.now().toString();
    const tempFilePath = path.join(tempDir, `${newTime}.pdf`);
    const objectKey = questionBankPartKey(materialId, topic.id);

    await generatePdfFromMarkdown(formatDoc[0], tempFilePath);

    await uploadPdfToR2(tempFilePath, BUCKET_NAME, objectKey, {
      materialId,
      id: String(topic.id),
    });

    const completion = {
      materialId,
      taskId: topic.id,
      type: "qbank" as const,
      key: objectKey,
      usage: usage.totalTokens ?? 0,
      success: true,
      nextQuestionNumber: numbering,
    };
    await completionQueue.add("completion", completion, {
      jobId: `completion-${topic.id}`,
    });
  }
};
