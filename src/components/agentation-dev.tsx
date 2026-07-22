"use client";

import dynamic from "next/dynamic";

// agentation.dev — a visual feedback toolbar for AI coding agents. It is a
// development-only aid: loaded client-side (browser-only APIs) and never
// rendered in production, so it stays out of the shipped bundle at runtime.
const Agentation = dynamic(
  () => import("agentation").then((mod) => mod.Agentation),
  { ssr: false },
);

export function AgentationDev() {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return <Agentation />;
}
