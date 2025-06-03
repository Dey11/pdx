import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const model = google("gemini-2.0-flash-lite-preview-02-05");

export const MAX_TOKENS = 8192;
