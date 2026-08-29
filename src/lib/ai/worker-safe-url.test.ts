import { describe, expect, test } from "bun:test";

import { assertSafeUrl } from "../../../worker/src/ai/models";

describe("worker provider URL policy", () => {
  test("accepts a public HTTPS address", async () => {
    await expect(assertSafeUrl("https://1.1.1.1/v1")).resolves.toBeUndefined();
  });

  test.each([
    "http://1.1.1.1/v1",
    "https://127.0.0.1/v1",
    "https://192.0.2.1/v1",
    "https://[::1]/v1",
    "https://169.254.169.254/latest/meta-data",
  ])("rejects unsafe address %s", async (url) => {
    await expect(assertSafeUrl(url)).rejects.toThrow();
  });
});
