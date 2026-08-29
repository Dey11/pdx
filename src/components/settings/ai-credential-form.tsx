"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { KeyRound, Loader2, ShieldCheck, Trash2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type AiCredentialStatus,
  aiCredentialStatusSchema,
} from "@/lib/ai/credential-contract";
import {
  type AiProviderId,
  getProviderConfig,
  isAiProviderId,
  providerConfigs,
  providerIds,
} from "@/lib/ai/providers";

type AiCredentialFormProps = {
  initialStatus: AiCredentialStatus;
  onSaved?: (status: AiCredentialStatus) => void;
  compact?: boolean;
};

const initialProvider = (status: AiCredentialStatus): AiProviderId => {
  const saved = status.credential?.provider;
  return providerIds.find((provider) => provider === saved) ?? "openai";
};

export const AiCredentialForm = ({
  initialStatus,
  onSaved,
  compact = false,
}: AiCredentialFormProps) => {
  const router = useRouter();
  const startingProvider = initialProvider(initialStatus);
  const [provider, setProvider] = useState<AiProviderId>(startingProvider);
  const [baseUrl, setBaseUrl] = useState(
    initialStatus.credential?.baseUrl ??
      getProviderConfig(startingProvider).baseUrl ??
      ""
  );
  const [modelId, setModelId] = useState(
    initialStatus.credential?.modelId ??
      getProviderConfig(startingProvider).defaultModel
  );
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);

  const changeProvider = (nextProvider: AiProviderId) => {
    const config = getProviderConfig(nextProvider);
    setProvider(nextProvider);
    setBaseUrl(config.baseUrl ?? "");
    setModelId(config.defaultModel);
    setError("");
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/ai-credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, baseUrl, modelId, apiKey }),
      });
      const body = await response.json();
      if (!response.ok) {
        setError(body.error ?? "Provider verification failed.");
        return;
      }

      const status = aiCredentialStatusSchema.safeParse(body);
      if (!status.success) {
        setError("The server returned an invalid credential status.");
        return;
      }

      setApiKey("");
      onSaved?.(status.data);
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async () => {
    setError("");
    setIsDeleting(true);

    try {
      const response = await fetch("/api/ai-credentials", { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json();
        setError(body.error ?? "Could not remove the provider.");
        return;
      }
      router.refresh();
      setShowRemoveConfirmation(false);
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form
      onSubmit={save}
      className={compact ? "space-y-4" : "max-w-2xl space-y-5"}
    >
      {initialStatus.credential && (
        <Alert className="border-brand-green/30 bg-brand-green/5">
          <ShieldCheck className="text-brand-green size-4" />
          <AlertTitle>Verified provider</AlertTitle>
          <AlertDescription>
            {providerConfigs[initialProvider(initialStatus)].label} ·{" "}
            {initialStatus.credential.modelId} ·{" "}
            {initialStatus.credential.keyHint} · verified{" "}
            {initialStatus.credential.verifiedAt.slice(0, 10)}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-2">
        <Label htmlFor="ai-provider">Provider</Label>
        <Select
          value={provider}
          onValueChange={(value) => {
            if (isAiProviderId(value)) changeProvider(value);
          }}
        >
          <SelectTrigger id="ai-provider" className="h-10 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {providerIds.map((id) => (
              <SelectItem key={id} value={id}>
                {providerConfigs[id].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {provider === "custom" && (
        <div className="grid gap-2">
          <Label htmlFor="ai-base-url">HTTPS base URL</Label>
          <Input
            id="ai-base-url"
            type="url"
            inputMode="url"
            placeholder="https://api.example.com/v1"
            value={baseUrl}
            onChange={(event) => setBaseUrl(event.target.value)}
            required
          />
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="ai-model">Model</Label>
        <Input
          id="ai-model"
          value={modelId}
          onChange={(event) => setModelId(event.target.value)}
          placeholder="Model ID"
          autoComplete="off"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ai-api-key">
          {initialStatus.configured ? "New API key" : "API key"}
        </Label>
        <Input
          id="ai-api-key"
          type="password"
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
          placeholder="Paste your provider key"
          autoComplete="new-password"
          required
        />
        <p className="text-muted-foreground text-xs leading-relaxed text-pretty">
          Your key is encrypted at rest, never shown again, and used only for
          generation. Your prompts and generated content are sent to the
          provider you select.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Could not save provider</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="submit"
          className="h-10"
          disabled={isSaving || isDeleting}
        >
          {isSaving ? <Loader2 className="animate-spin" /> : <KeyRound />}
          {isSaving ? "Verifying…" : "Verify and save"}
        </Button>
        {initialStatus.configured && !compact && (
          <Button
            type="button"
            variant="outline"
            className="text-destructive hover:text-destructive h-10"
            disabled={isSaving || isDeleting}
            onClick={() => setShowRemoveConfirmation(true)}
          >
            {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
            Remove provider
          </Button>
        )}
      </div>

      <AlertDialog
        open={showRemoveConfirmation}
        onOpenChange={setShowRemoveConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this AI provider?</AlertDialogTitle>
            <AlertDialogDescription>
              Generation will stay unavailable until you verify another
              provider.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault();
                void remove();
              }}
            >
              {isDeleting ? "Removing…" : "Remove provider"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
};
