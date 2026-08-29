const isSerializationFailure = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === "P2034";

/** Retries a PostgreSQL serializable transaction after a write conflict. */
export async function retrySerializableTransaction<T>(
  operation: () => Promise<T>,
  maximumAttempts = 4
): Promise<T> {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (!isSerializationFailure(error) || attempt >= maximumAttempts) {
        throw error;
      }
    }
  }
}
