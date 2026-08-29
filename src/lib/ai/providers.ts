export const providerIds = [
  "openai",
  "openrouter",
  "deepseek",
  "groq",
  "nebius",
  "custom",
] as const;

export type AiProviderId = (typeof providerIds)[number];

export type AiProviderConfig = {
  id: AiProviderId;
  label: string;
  baseUrl: string | null;
  defaultModel: string;
};

export const providerConfigs: Record<AiProviderId, AiProviderConfig> = {
  openai: {
    id: "openai",
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-5-mini",
  },
  openrouter: {
    id: "openrouter",
    label: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    defaultModel: "openai/gpt-5-mini",
  },
  deepseek: {
    id: "deepseek",
    label: "DeepSeek",
    baseUrl: "https://api.deepseek.com",
    defaultModel: "deepseek-v4-flash",
  },
  groq: {
    id: "groq",
    label: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    defaultModel: "openai/gpt-oss-20b",
  },
  nebius: {
    id: "nebius",
    label: "Nebius Token Factory",
    baseUrl: "https://api.tokenfactory.nebius.com/v1",
    defaultModel: "deepseek-ai/DeepSeek-V4-Flash-0731",
  },
  custom: {
    id: "custom",
    label: "Custom endpoint",
    baseUrl: null,
    defaultModel: "",
  },
};

export const getProviderConfig = (provider: AiProviderId): AiProviderConfig =>
  providerConfigs[provider];

export const isAiProviderId = (value: string): value is AiProviderId =>
  providerIds.some((provider) => provider === value);
