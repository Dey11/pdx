import { describe, expect, test } from "bun:test";

import { retrySerializableTransaction } from "./transaction-retry";

describe("serializable transaction retry", () => {
  test("retries a PostgreSQL serialization conflict", async () => {
    let attempts = 0;
    const result = await retrySerializableTransaction(async () => {
      attempts += 1;
      if (attempts === 1) throw { code: "P2034" };
      return "committed";
    });

    expect(result).toBe("committed");
    expect(attempts).toBe(2);
  });

  test("does not retry unrelated failures", async () => {
    let attempts = 0;
    await expect(
      retrySerializableTransaction(async () => {
        attempts += 1;
        throw new Error("database unavailable");
      })
    ).rejects.toThrow("database unavailable");
    expect(attempts).toBe(1);
  });
});
