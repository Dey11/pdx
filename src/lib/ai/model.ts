import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const model = google("gemini-2.0-flash-001");

export const MAX_TOKENS = 8192;
