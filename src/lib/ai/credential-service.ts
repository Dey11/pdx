import { generateObject } from "ai";
import { z } from "zod";

import { prisma } from "@/lib/db";

import type { AiCredentialStatus } from "./credential-contract";
import {
  decryptApiKey,
  encryptApiKey,
  getApiKeyHint,
} from "./credential-crypto";
import { type ResolvedAiCredential, createGenerationModel } from "./model";
import { getProviderConfig, isAiProviderId, providerIds } from "./providers";
import { assertSafeProviderBaseUrl } from "./safe-url";

export const aiCredentialInputSchema = z.object({
  provider: z.enum(providerIds),
  apiKey: z.string().trim().min(8, "Enter a valid API key").max(4096),
  modelId: z.string().trim().min(1, "Model is required").max(200),
  baseUrl: z.string().trim().max(2048).optional(),
});

export type AiCredentialInput = z.infer<typeof aiCredentialInputSchema>;

export class AiCredentialRequiredError extends Error {
  readonly code = "AI_CREDENTIAL_REQUIRED";

  constructor() {
    super("Add and verify an AI provider before generating material.");
  }
}

export class CredentialChangeBlockedError extends Error {
  constructor() {
    super(
      "Wait for your current generation to finish before changing the provider."
    );
  }
}

const getEncryptionKey = (): string => {
  const key = process.env.BYOK_ENCRYPTION_KEY;
  if (!key) throw new Error("BYOK_ENCRYPTION_KEY is required");
  return key;
};

const hasActiveMaterial = async (userId: string): Promise<boolean> => {
  const material = await prisma.material.findFirst({
    where: { userId, status: { in: ["pending", "inprogress"] } },
    select: { id: true },
  });
  return Boolean(material);
};

const resolveInput = async (
  input: AiCredentialInput
): Promise<ResolvedAiCredential> => {
  const preset = getProviderConfig(input.provider);
  const baseUrl = await assertSafeProviderBaseUrl(
    input.provider === "custom" ? (input.baseUrl ?? "") : (preset.baseUrl ?? "")
  );

  return {
    provider: input.provider,
    baseUrl,
    modelId: input.modelId,
    apiKey: input.apiKey,
  };
};

/** Makes a small structured request so invalid keys, URLs, and model IDs fail before save. */
const verifyCredential = async (
  credential: ResolvedAiCredential
): Promise<void> => {
  await generateObject({
    model: createGenerationModel(credential),
    schema: z.object({ ok: z.literal(true) }),
    prompt: `Return only this JSON object: ${JSON.stringify({ ok: true })}`,
    maxRetries: 0,
    // Reasoning models count hidden reasoning against this limit before they
    // emit the visible JSON response. A 32-token cap was intermittently empty.
    maxOutputTokens: 256,
    abortSignal: AbortSignal.timeout(65_000),
  });
};

const toResolvedCredential = (credential: {
  provider: string;
  baseUrl: string;
  modelId: string;
  encryptedKey: string;
}): ResolvedAiCredential => {
  if (!isAiProviderId(credential.provider)) {
    throw new Error("Stored AI provider is not supported");
  }

  return {
    provider: credential.provider,
    baseUrl: credential.baseUrl,
    modelId: credential.modelId,
    apiKey: decryptApiKey(credential.encryptedKey, getEncryptionKey()),
  };
};

export const getAiCredentialStatus = async (
  userId: string
): Promise<AiCredentialStatus> => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      aiSetupPromptDismissedAt: true,
      aiCredential: {
        select: {
          provider: true,
          baseUrl: true,
          modelId: true,
          keyHint: true,
          verifiedAt: true,
        },
      },
    },
  });

  return {
    configured: Boolean(user.aiCredential),
    dismissed: Boolean(user.aiSetupPromptDismissedAt),
    credential: user.aiCredential
      ? {
          ...user.aiCredential,
          verifiedAt: user.aiCredential.verifiedAt.toISOString(),
        }
      : null,
  };
};

export const saveAiCredential = async (
  userId: string,
  input: AiCredentialInput
) => {
  if (await hasActiveMaterial(userId)) throw new CredentialChangeBlockedError();

  const credential = await resolveInput(input);
  await verifyCredential(credential);
  const encryptedKey = encryptApiKey(input.apiKey, getEncryptionKey());
  const verifiedAt = new Date();

  await prisma.$transaction(
    async (transaction) => {
      const activeMaterial = await transaction.material.findFirst({
        where: { userId, status: { in: ["pending", "inprogress"] } },
        select: { id: true },
      });
      if (activeMaterial) throw new CredentialChangeBlockedError();

      await transaction.aiCredential.upsert({
        where: { userId },
        create: {
          userId,
          provider: credential.provider,
          baseUrl: credential.baseUrl,
          modelId: credential.modelId,
          encryptedKey,
          keyHint: getApiKeyHint(input.apiKey),
          verifiedAt,
        },
        update: {
          provider: credential.provider,
          baseUrl: credential.baseUrl,
          modelId: credential.modelId,
          encryptedKey,
          keyHint: getApiKeyHint(input.apiKey),
          verifiedAt,
        },
      });
      await transaction.user.update({
        where: { id: userId },
        data: { aiSetupPromptDismissedAt: null },
      });
    },
    { isolationLevel: "Serializable" }
  );

  return getAiCredentialStatus(userId);
};

export const deleteAiCredential = async (userId: string): Promise<void> => {
  await prisma.$transaction(
    async (transaction) => {
      const activeMaterial = await transaction.material.findFirst({
        where: { userId, status: { in: ["pending", "inprogress"] } },
        select: { id: true },
      });
      if (activeMaterial) throw new CredentialChangeBlockedError();
      await transaction.aiCredential.deleteMany({ where: { userId } });
    },
    { isolationLevel: "Serializable" }
  );
};

export const dismissAiSetupPrompt = async (userId: string): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data: { aiSetupPromptDismissedAt: new Date() },
  });
};

export const resolveAiCredentialForUser = async (
  userId: string
): Promise<ResolvedAiCredential> => {
  const credential = await prisma.aiCredential.findUnique({
    where: { userId },
  });
  if (!credential) throw new AiCredentialRequiredError();
  await assertSafeProviderBaseUrl(credential.baseUrl);
  return toResolvedCredential(credential);
};

export const resolveAiCredentialForMaterial = async (
  materialId: string
): Promise<ResolvedAiCredential> => {
  const material = await prisma.material.findUnique({
    where: { id: materialId },
    select: { user: { select: { aiCredential: true } } },
  });
  const credential = material?.user.aiCredential;
  if (!credential) throw new AiCredentialRequiredError();
  await assertSafeProviderBaseUrl(credential.baseUrl);
  return toResolvedCredential(credential);
};
