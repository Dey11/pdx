import { APICallError } from "ai";
import { describe, expect, test } from "bun:test";

import { getCredentialValidationMessage } from "./credential-errors";

const apiError = (statusCode: number, responseBody = "") =>
  new APICallError({
    message: "Provider request failed",
    url: "https://provider.example/v1/chat/completions",
    requestBodyValues: {},
    statusCode,
    responseBody,
  });

describe("credential validation errors", () => {
  test("distinguishes an unknown model from an unknown endpoint", () => {
    expect(
      getCredentialValidationMessage(
        apiError(
          404,
          JSON.stringify({ error: { message: "model not found" } })
        )
      )
    ).toBe("The provider does not recognize that model ID.");
    expect(getCredentialValidationMessage(apiError(404))).toBe(
      "The provider endpoint was not found."
    );
  });

  test("does not reflect a provider response into the message", () => {
    expect(
      getCredentialValidationMessage(apiError(500, "secret provider body"))
    ).toBe("The provider endpoint is unavailable or could not be reached.");
  });
});
