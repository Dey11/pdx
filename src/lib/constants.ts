// BullMQ queue names shared by the producers in src/lib/queue.ts. These are the
// literal Redis queue identifiers, so they MUST match worker/src/constants.ts
// (the worker mirrors them under the names QUEUE_NAME / QNA_QUEUE_NAME /
// MERGE_PDF_QUEUE_NAME / the inline "completionQueue"). Never rename without
// updating the worker in lockstep, or in-flight jobs will be orphaned.
export const THEORY_QUEUE_NAME = "theoryQueue";
export const QBANK_QUEUE_NAME = "qbankQueue";
export const MERGE_PDF_QUEUE_NAME = "mergePdfQueue";
export const COMPLETION_QUEUE_NAME = "completionQueue";

export const EMAIL = "deydevelops@gmail.com";
export const INSTAGRAM = "https://www.instagram.com/use.pdx/";
export const TWITTER = "https://x.com/usepdx_";
export const TOTAL_GOAL = 50;
export const YOUTUBE_LINK = "https://youtu.be/4v5jtOGYQuU";
export const DISCORD_LINK = "https://discord.gg/8SxEwduF";
