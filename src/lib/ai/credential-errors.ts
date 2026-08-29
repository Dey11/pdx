import { APICallError, NoObjectGeneratedError } from "ai";

const findApiCallError = (error: unknown): APICallError | null => {
  let current = error;
  while (current) {
    if (APICallError.isInstance(current)) return current;
    if (typeof current !== "object" || !("cause" in current)) return null;
    current = current.cause;
  }
  return null;
};

const hasErrorName = (error: unknown, name: string): boolean => {
  let current = error;
  while (current) {
    if (current instanceof Error && current.name === name) return true;
    if (typeof current !== "object" || !("cause" in current)) return false;
    current = current.cause;
  }
  return false;
};

/** Converts provider failures into specific messages without reflecting their body. */
export const getCredentialValidationMessage = (error: unknown): string => {
  const apiError = findApiCallError(error);
  const responseBody = apiError?.responseBody ?? "";
  if (apiError?.statusCode === 401 || apiError?.statusCode === 403) {
    return "The provider rejected this API key.";
  }
  if (
    (apiError?.statusCode === 400 || apiError?.statusCode === 404) &&
    /model.{0,80}(not found|does not exist|unknown|invalid)/i.test(responseBody)
  ) {
    return "The provider does not recognize that model ID.";
  }
  if (apiError?.statusCode === 404) {
    return "The provider endpoint was not found.";
  }
  if (apiError?.statusCode === 429) {
    return "The provider rate-limited the verification request. Try again shortly.";
  }
  if (hasErrorName(error, "TimeoutError")) {
    return "The provider did not respond before verification timed out.";
  }
  if (error instanceof Error && error.message.startsWith("Provider URL")) {
    return error.message;
  }
  if (NoObjectGeneratedError.isInstance(error)) {
    return "That model did not return compatible structured output.";
  }
  if (!apiError?.statusCode || apiError.statusCode >= 500) {
    return "The provider endpoint is unavailable or could not be reached.";
  }
  return "The provider did not return compatible structured output. Check the endpoint and model.";
};
