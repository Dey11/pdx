// Keep in sync with src/lib/ai/model.ts — the web app and the worker have
// separate tsconfig roots, so this factory is intentionally duplicated. Any
// change to the fallback-chain parsing, provider inference, provider options,
// or MAX_OUTPUT_TOKENS must be mirrored there.
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { SharedV3ProviderOptions } from "@ai-sdk/provider";
import type { LanguageModel } from "ai";

type SupportedProvider = "deepseek" | "google";

export type GenerationModelCandidate = {
  id: string;
  label: string;
  model: LanguageModel;
  provider: SupportedProvider;
  providerOptions?: SharedV3ProviderOptions;
};

const DEFAULT_GENERATION_MODELS =
  "deepseek:deepseek-v4-flash,deepseek:deepseek-chat,google:gemini-2.5-flash";

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const MAX_OUTPUT_TOKENS = Number(
  process.env.AI_GENERATION_MAX_OUTPUT_TOKENS ?? 8192
);

// The fallback chain is priority-ordered: candidates are tried left-to-right
// and the first one that succeeds wins. Each entry is either "provider:modelId"
// or a bare "modelId" whose provider is inferred (gemini-* => google, otherwise
// deepseek). DeepSeek models disable reasoning ("thinking") to keep generation
// fast and cheap.
function inferProvider(modelId: string): SupportedProvider {
  if (modelId.startsWith("gemini-")) {
    return "google";
  }

  return "deepseek";
}

function parseModelEntry(entry: string) {
  const trimmedEntry = entry.trim();
  const [maybeProvider, ...modelParts] = trimmedEntry.split(":");

  if (modelParts.length === 0) {
    return {
      provider: inferProvider(trimmedEntry),
      modelId: trimmedEntry,
    };
  }

  return {
    provider: maybeProvider as SupportedProvider,
    modelId: modelParts.join(":"),
  };
}

function createModelCandidate(entry: string): GenerationModelCandidate {
  const { provider, modelId } = parseModelEntry(entry);

  if (provider === "google") {
    return {
      id: modelId,
      label: `${provider}:${modelId}`,
      model: google(modelId),
      provider,
    };
  }

  if (provider === "deepseek") {
    return {
      id: modelId,
      label: `${provider}:${modelId}`,
      model: deepseek(modelId),
      provider,
      providerOptions: {
        deepseek: {
          thinking: { type: "disabled" },
        },
      },
    };
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
}

// Providers actually referenced by the configured model list. The worker's env
// validation uses this to require only the API keys that will be used, so
// switching providers is a pure env change (AI_GENERATION_MODELS + its key).
export function getReferencedProviders(): Set<SupportedProvider> {
  const configuredModels =
    process.env.AI_GENERATION_MODELS ?? DEFAULT_GENERATION_MODELS;

  return new Set(
    configuredModels
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => parseModelEntry(entry).provider)
  );
}

export function getGenerationModelCandidates(): GenerationModelCandidate[] {
  const configuredModels =
    process.env.AI_GENERATION_MODELS ?? DEFAULT_GENERATION_MODELS;

  const candidates = configuredModels
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map(createModelCandidate);

  if (candidates.length === 0) {
    throw new Error("AI_GENERATION_MODELS must include at least one model.");
  }

  return candidates;
}
