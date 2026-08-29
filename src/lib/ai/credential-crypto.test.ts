import { describe, expect, test } from "bun:test";

import {
  decryptApiKey,
  encryptApiKey,
  getApiKeyHint,
} from "./credential-crypto";

const encryptionKey = Buffer.alloc(32, 7).toString("base64");

describe("API key encryption", () => {
  test("round-trips a key without storing it in plaintext", () => {
    const plaintext = "sk-a-secret-key";
    const envelope = encryptApiKey(plaintext, encryptionKey);

    expect(envelope).not.toContain(plaintext);
    expect(decryptApiKey(envelope, encryptionKey)).toBe(plaintext);
  });

  test("rejects a tampered envelope", () => {
    const envelope = encryptApiKey("sk-a-secret-key", encryptionKey);
    const tampered = `${envelope.slice(0, -1)}${envelope.endsWith("a") ? "b" : "a"}`;

    expect(() => decryptApiKey(tampered, encryptionKey)).toThrow();
  });

  test("requires a 32-byte base64 key", () => {
    expect(() => encryptApiKey("secret", "not-base64")).toThrow(
      "BYOK_ENCRYPTION_KEY"
    );
  });

  test("returns a non-secret key hint", () => {
    expect(getApiKeyHint("sk-example-123456")).toBe("••••3456");
  });
});
