const readStatusCode = (error: unknown): number | undefined => {
  if (typeof error !== "object" || error === null) return undefined;

  const candidate = error as {
    cause?: unknown;
    response?: { status?: unknown };
    status?: unknown;
    statusCode?: unknown;
  };
  const status = candidate.statusCode ?? candidate.status ?? candidate.response?.status;
  if (typeof status === "number") return status;
  return candidate.cause ? readStatusCode(candidate.cause) : undefined;
};

const readMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return `${error.message} ${readMessage(error.cause)}`.trim();
  }
  return "";
};

/** Permanent configuration/auth failures should not repeat paid AI requests. */
export const isPermanentGenerationError = (error: unknown): boolean => {
  const status = readStatusCode(error);
  if (status && [400, 401, 402, 403, 404, 413, 422].includes(status)) {
    return true;
  }

  return /unsafe provider|provider origin changed|stored ai provider is not supported/i.test(
    readMessage(error)
  );
};
