import { WORKER_CALLBACK_SECRET } from "./constants";

// Headers attached to every callback POST to the web app (/api/generation/*).
// The `x-worker-secret` value is verified by src/lib/worker-auth.ts. Worker
// startup and Web verification both fail closed when the secret is absent.
export function workerCallbackHeaders(): Record<string, string> {
  if (!WORKER_CALLBACK_SECRET) {
    return {};
  }

  return { "x-worker-secret": WORKER_CALLBACK_SECRET };
}
