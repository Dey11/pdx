import {
  type OpenAICompatibleProviderSettings,
  createOpenAICompatible,
} from "@ai-sdk/openai-compatible";
import axios from "axios";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { z } from "zod";

import { workerCallbackHeaders } from "../callback";

const credentialSchema = z.object({
  provider: z.enum(["openai", "openrouter", "deepseek", "groq", "custom"]),
  baseUrl: z.string().url(),
  modelId: z.string().min(1),
  apiKey: z.string().min(1),
});

const nativeStructuredOutputProviders = new Set([
  "openai",
  "openrouter",
  "groq",
]);

export const MAX_OUTPUT_TOKENS = Number(
  process.env.AI_GENERATION_MAX_OUTPUT_TOKENS ?? 8192
);

const isPrivateAddress = (address: string): boolean => {
  if (isIP(address) === 4) {
    const [a, b] = address.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 0) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19)) ||
      a >= 224
    );
  }

  const normalized = address.toLowerCase();
  if (normalized.startsWith("::ffff:")) {
    const mapped = normalized.slice("::ffff:".length);
    if (isIP(mapped) === 4) return isPrivateAddress(mapped);
    const [high, low] = mapped.split(":").map((part) => parseInt(part, 16));
    if (Number.isFinite(high) && Number.isFinite(low)) {
      return isPrivateAddress(
        `${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`
      );
    }
    return true;
  }
  return (
    isIP(address) !== 6 ||
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("::") ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe") ||
    normalized.startsWith("ff")
  );
};

const assertSafeUrl = async (value: string): Promise<void> => {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error("Unsafe provider URL");
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = isIP(hostname)
    ? [hostname]
    : (await lookup(hostname, { all: true, verbatim: true })).map(
        ({ address }) => address
      );
  if (addresses.length === 0 || addresses.some(isPrivateAddress)) {
    throw new Error("Unsafe provider address");
  }
};

const limitResponseBody = (response: Response): Response => {
  const maximumBytes = 10 * 1024 * 1024;
  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maximumBytes) {
    throw new Error("Provider response exceeded the size limit");
  }
  if (!response.body) return response;

  let receivedBytes = 0;
  const reader = response.body.getReader();
  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const chunk = await reader.read();
      if (chunk.done) {
        controller.close();
        return;
      }
      receivedBytes += chunk.value.byteLength;
      if (receivedBytes > maximumBytes) {
        await reader.cancel();
        controller.error(
          new Error("Provider response exceeded the size limit")
        );
        return;
      }
      controller.enqueue(chunk.value);
    },
    cancel(reason) {
      return reader.cancel(reason);
    },
  });

  return new Response(body, response);
};

type ProviderFetch = NonNullable<OpenAICompatibleProviderSettings["fetch"]>;

const safeProviderFetch = (baseUrl: string): ProviderFetch => {
  const origin = new URL(baseUrl).origin;

  const safeFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(
      typeof input === "string" || input instanceof URL ? input : input.url
    );
    if (url.origin !== origin) throw new Error("Provider origin changed");
    await assertSafeUrl(url.origin);

    const timeout = AbortSignal.timeout(60_000);
    const signal = init?.signal
      ? AbortSignal.any([init.signal, timeout])
      : timeout;
    const response = await fetch(input, {
      ...init,
      redirect: "error",
      signal,
    });
    return limitResponseBody(response);
  };

  return Object.assign(safeFetch, { preconnect: () => undefined });
};

/** Resolves a material owner's key just-in-time; the key never enters Redis. */
export const getGenerationModel = async (materialId: string) => {
  const response = await axios.get(
    `${process.env.BACKEND_URL}/api/internal/ai-credentials/${materialId}`,
    {
      headers: workerCallbackHeaders(),
      timeout: 15_000,
    }
  );
  const credential = credentialSchema.parse(response.data);
  await assertSafeUrl(credential.baseUrl);

  const provider = createOpenAICompatible({
    name: `pdx-${credential.provider}`,
    baseURL: credential.baseUrl,
    apiKey: credential.apiKey,
    supportsStructuredOutputs: nativeStructuredOutputProviders.has(
      credential.provider
    ),
    fetch: safeProviderFetch(credential.baseUrl),
  });

  return provider.chatModel(credential.modelId);
};
