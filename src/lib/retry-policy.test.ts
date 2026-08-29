import { describe, expect, test } from "bun:test";

import { isPermanentGenerationError } from "../../worker/src/retry-policy";

describe("generation retry policy", () => {
  test.each([400, 401, 402, 403, 404, 413, 422])(
    "does not retry permanent HTTP %s failures",
    (statusCode) => {
      expect(isPermanentGenerationError({ statusCode })).toBe(true);
    }
  );

  test.each([408, 429, 500, 502, 503])(
    "retries transient HTTP %s failures",
    (statusCode) => {
      expect(isPermanentGenerationError({ statusCode })).toBe(false);
    }
  );

  test("finds a permanent status in a wrapped error", () => {
    expect(
      isPermanentGenerationError(new Error("generation failed", { cause: { status: 401 } }))
    ).toBe(true);
  });
});
