import "dotenv/config";

// BullMQ queue names. These mirror src/lib/constants.ts on the web side
// (THEORY_QUEUE_NAME / QBANK_QUEUE_NAME / MERGE_PDF_QUEUE_NAME /
// COMPLETION_QUEUE_NAME) and MUST stay in sync — they are the literal Redis
// identifiers shared by the producer and this consumer.
export const QUEUE_NAME = "theoryQueue";
export const QNA_QUEUE_NAME = "qbankQueue";
export const BUCKET_NAME = process.env.BUCKET_NAME ?? "test";
export const MERGE_PDF_QUEUE_NAME = "mergePdfQueue";

// Shared secret sent as the `x-worker-secret` header on every callback POST to
// the web app. Verified there by src/lib/worker-auth.ts. Kept in sync via the
// WORKER_CALLBACK_SECRET env var configured on both services.
export const WORKER_CALLBACK_SECRET = process.env.WORKER_CALLBACK_SECRET ?? "";
