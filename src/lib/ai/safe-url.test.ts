import { describe, expect, test } from "bun:test";

import { assertSafeProviderBaseUrl } from "./safe-url";

const publicResolver = async () => ["8.8.8.8"];

describe("custom provider URL policy", () => {
  test("accepts a public HTTPS endpoint", async () => {
    await expect(
      assertSafeProviderBaseUrl("https://api.example.com/v1", publicResolver)
    ).resolves.toBe("https://api.example.com/v1");
  });

  test.each([
    "http://api.example.com/v1",
    "https://user:pass@example.com/v1",
    "https://example.com/v1?secret=yes",
    "https://example.com/v1#fragment",
    "https://localhost/v1",
    "https://127.0.0.1/v1",
    "https://[::1]/v1",
    "https://[::ffff:7f00:1]/v1",
    "https://169.254.169.254/latest/meta-data",
  ])("rejects unsafe URL %s", async (url) => {
    await expect(
      assertSafeProviderBaseUrl(url, publicResolver)
    ).rejects.toThrow();
  });

  test("rejects hostnames resolving to private networks", async () => {
    await expect(
      assertSafeProviderBaseUrl("https://api.example.com/v1", async () => [
        "10.0.0.8",
      ])
    ).rejects.toThrow("public IP");
  });
});
