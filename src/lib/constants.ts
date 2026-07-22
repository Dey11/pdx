// BullMQ queue names shared by the producers in src/lib/queue.ts. These are the
// literal Redis queue identifiers, so they MUST match worker/src/constants.ts
// (the worker mirrors them under the names QUEUE_NAME / QNA_QUEUE_NAME /
// MERGE_PDF_QUEUE_NAME / the inline "completionQueue"). Never rename without
// updating the worker in lockstep, or in-flight jobs will be orphaned.
export const THEORY_QUEUE_NAME = "theoryQueue";
export const QBANK_QUEUE_NAME = "qbankQueue";
export const MERGE_PDF_QUEUE_NAME = "mergePdfQueue";
export const COMPLETION_QUEUE_NAME = "completionQueue";

export const EMAIL = "support@noteformula.com";
export const INSTAGRAM = "https://www.instagram.com/use.pdx/";
export const TWITTER = "https://x.com/usepdx_";
export const TOTAL_GOAL = 50;
export const YOUTUBE_LINK = "https://youtu.be/4v5jtOGYQuU";
export const DISCORD_LINK = "https://discord.gg/8SxEwduF";

export const testProducts = [
  {
    id: "pdt_F3OWI0Dfd2dQUZG9v2wtV",
    name: "Starter",
    credits: 150,
  },
  {
    id: "",
    name: "Plus",
    credits: 700,
  },
  {
    id: "",
    name: "Pro",
    credits: 1500,
  },
];

export const products = [
  {
    id: "pdt_6Ur1L7TW0mPezV4OKcz65",
    name: "Starter",
    credits: 150,
  },
  {
    id: "pdt_pr6A5MafSVQEa5CvdCHA3",
    name: "Plus",
    credits: 700,
  },
  {
    id: "pdt_N1R2rJr8MF5TceJMg9g7q",
    name: "Pro",
    credits: 1500,
  },
];
