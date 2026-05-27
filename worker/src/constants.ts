import "dotenv/config";

export const QUEUE_NAME = "theoryQueue";
export const QNA_QUEUE_NAME = "qbankQueue";
export const BUCKET_NAME = process.env.BUCKET_NAME ?? "test";
export const MERGE_PDF_QUEUE_NAME = "mergePdfQueue";
