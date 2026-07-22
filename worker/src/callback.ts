import { WORKER_CALLBACK_SECRET } from "./constants";

// Headers attached to every callback POST to the web app (/api/generation/*).
// The `x-worker-secret` value is verified by src/lib/worker-auth.ts. When the
// secret is unset the header is simply omitted, matching the web side's
// backward-compatible "allow if unconfigured" behavior.
export function workerCallbackHeaders(): Record<string, string> {
  if (!WORKER_CALLBACK_SECRET) {
    return {};
  }

  return { "x-worker-secret": WORKER_CALLBACK_SECRET };
}
