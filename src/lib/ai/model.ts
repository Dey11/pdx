import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModel } from "ai";

import type { AiProviderId } from "./providers";
import { createSafeProviderFetch } from "./safe-url";

export type ResolvedAiCredential = {
  provider: AiProviderId;
  baseUrl: string;
  modelId: string;
  apiKey: string;
};

const providersWithNativeStructuredOutputs = new Set<AiProviderId>([
  "openai",
  "openrouter",
  "groq",
]);

export const MAX_OUTPUT_TOKENS = Number(
  process.env.AI_GENERATION_MAX_OUTPUT_TOKENS ?? 8192
);

/** Builds one OpenAI-compatible model from a user's resolved BYOK configuration. */
export const createGenerationModel = (
  credential: ResolvedAiCredential
): LanguageModel => {
  const provider = createOpenAICompatible({
    name: `pdx-${credential.provider}`,
    baseURL: credential.baseUrl,
    apiKey: credential.apiKey,
    supportsStructuredOutputs: providersWithNativeStructuredOutputs.has(
      credential.provider
    ),
    fetch: createSafeProviderFetch(credential.baseUrl),
  });

  return provider.chatModel(credential.modelId);
};
