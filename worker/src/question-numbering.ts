/** Validates the model's QNAEND marker and returns the next question number. */
export const parseNextQuestionNumber = (
  marker: string | undefined,
  currentQuestionNumber: number
): number => {
  const normalized = marker?.trim() ?? "";
  if (!/^[1-9]\d*$/.test(normalized)) {
    throw new Error("AI provider returned invalid question numbering");
  }

  const lastQuestionNumber = Number(normalized);
  if (
    !Number.isSafeInteger(lastQuestionNumber) ||
    lastQuestionNumber < currentQuestionNumber
  ) {
    throw new Error("AI provider returned invalid question numbering");
  }

  return lastQuestionNumber + 1;
};
