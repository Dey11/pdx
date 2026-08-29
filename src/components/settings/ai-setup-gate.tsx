"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { KeyRound } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AiCredentialStatus } from "@/lib/ai/credential-contract";
import { AI_SETUP_EVENT } from "@/lib/ai/setup-events";

import { AiCredentialForm } from "./ai-credential-form";

export const AiSetupGate = ({
  initialStatus,
}: {
  initialStatus: AiCredentialStatus;
}) => {
  const [status, setStatus] = useState(initialStatus);
  const [open, setOpen] = useState(
    !initialStatus.configured && !initialStatus.dismissed
  );
  const savedRef = useRef(false);

  useEffect(() => {
    setStatus(initialStatus);
    if (!initialStatus.configured) savedRef.current = false;
  }, [initialStatus]);

  useEffect(() => {
    const showSetup = () => setOpen(true);
    window.addEventListener(AI_SETUP_EVENT, showSetup);
    return () => window.removeEventListener(AI_SETUP_EVENT, showSetup);
  }, []);

  const changeOpen = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen && !status.configured && !savedRef.current) {
      setStatus((current) => ({ ...current, dismissed: true }));
      void fetch("/api/ai-credentials/dismiss", { method: "POST" });
    }
  };

  const saved = (nextStatus: AiCredentialStatus) => {
    savedRef.current = true;
    setStatus(nextStatus);
    setOpen(false);
  };

  return (
    <>
      {!status.configured && (
        <div className="border-brand-yellow/20 bg-brand-yellow/10 text-brand-heading border-b px-4 py-2 text-center text-sm">
          <KeyRound className="text-brand-yellow mr-2 inline size-4" />
          Add your AI provider to generate material.{" "}
          <Link
            href="/settings"
            className="text-brand-yellow font-medium underline underline-offset-4"
          >
            Open settings
          </Link>
        </div>
      )}

      <Dialog open={open} onOpenChange={changeOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-balance">
              Connect your AI provider
            </DialogTitle>
            <DialogDescription className="leading-relaxed text-pretty">
              PDX is free to use. Add a key from your preferred
              OpenAI-compatible provider to generate study material.
            </DialogDescription>
          </DialogHeader>
          <AiCredentialForm initialStatus={status} onSaved={saved} compact />
        </DialogContent>
      </Dialog>
    </>
  );
};
