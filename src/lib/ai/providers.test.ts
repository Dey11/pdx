import { describe, expect, test } from "bun:test";

import { getProviderConfig, providerIds } from "./providers";

describe("AI provider registry", () => {
  test("defines each supported preset", () => {
    expect(providerIds).toEqual([
      "openai",
      "openrouter",
      "deepseek",
      "groq",
      "nebius",
      "custom",
    ]);
  });

  test("uses current OpenAI-compatible endpoints and editable defaults", () => {
    expect(getProviderConfig("openai")).toMatchObject({
      baseUrl: "https://api.openai.com/v1",
      defaultModel: "gpt-5-mini",
    });
    expect(getProviderConfig("deepseek")).toMatchObject({
      baseUrl: "https://api.deepseek.com",
      defaultModel: "deepseek-v4-flash",
    });
    expect(getProviderConfig("groq")).toMatchObject({
      baseUrl: "https://api.groq.com/openai/v1",
      defaultModel: "openai/gpt-oss-20b",
    });
    expect(getProviderConfig("nebius")).toMatchObject({
      baseUrl: "https://api.tokenfactory.nebius.com/v1",
      defaultModel: "deepseek-ai/DeepSeek-V4-Flash-0731",
    });
  });
});
