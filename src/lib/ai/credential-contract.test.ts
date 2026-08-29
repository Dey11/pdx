import { describe, expect, test } from "bun:test";

import { aiCredentialStatusSchema } from "./credential-contract";

const safeStatus = {
  configured: true,
  dismissed: false,
  credential: {
    provider: "openai",
    baseUrl: "https://api.openai.com/v1",
    modelId: "gpt-5-mini",
    keyHint: "••••1234",
    verifiedAt: "2026-08-29T00:00:00.000Z",
  },
};

describe("AI credential response contract", () => {
  test("accepts safe credential metadata", () => {
    expect(aiCredentialStatusSchema.parse(safeStatus)).toEqual(safeStatus);
  });

  test.each(["apiKey", "encryptedKey"])("rejects a leaked %s", (field) => {
    expect(
      aiCredentialStatusSchema.safeParse({
        ...safeStatus,
        credential: { ...safeStatus.credential, [field]: "must-not-leak" },
      }).success
    ).toBe(false);
  });
});
