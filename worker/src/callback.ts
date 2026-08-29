import axios from "axios";

import { WORKER_CALLBACK_SECRET } from "./constants";
import { generationStateSchema } from "./zod/schema";

// Headers attached to every callback POST to the web app (/api/generation/*).
// The `x-worker-secret` value is verified by src/lib/worker-auth.ts. Worker
// startup and Web verification both fail closed when the secret is absent.
export function workerCallbackHeaders(): Record<string, string> {
  if (!WORKER_CALLBACK_SECRET) {
    return {};
  }

  return { "x-worker-secret": WORKER_CALLBACK_SECRET };
}

/** Posts an authenticated worker callback with a bounded request time. */
export async function postWorkerCallback(
  path: string,
  data: unknown
): Promise<void> {
  await axios.post(`${process.env.BACKEND_URL}${path}`, data, {
    headers: workerCallbackHeaders(),
    timeout: 15_000,
  });
}

/** Reads terminal task state before a retry can spend the user's API budget. */
export async function getTerminalTaskState(
  materialId: string
): Promise<Map<string, number | null>> {
  const response = await axios.get(
    `${process.env.BACKEND_URL}/api/internal/generation-state/${encodeURIComponent(materialId)}`,
    {
      headers: workerCallbackHeaders(),
      timeout: 15_000,
    }
  );
  const state = generationStateSchema.parse(response.data);
  return new Map(
    state.terminalTasks.map((task) => [task.id, task.nextQuestionNumber])
  );
}
