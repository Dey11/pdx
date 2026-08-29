import {
  type OpenAICompatibleProviderSettings,
  createOpenAICompatible,
} from "@ai-sdk/openai-compatible";
import axios from "axios";
import { lookup } from "node:dns/promises";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";
import { z } from "zod";

import { workerCallbackHeaders } from "../callback";

const credentialSchema = z.object({
  provider: z.enum([
    "openai",
    "openrouter",
    "deepseek",
    "groq",
    "nebius",
    "custom",
  ]),
  baseUrl: z.string().url(),
  modelId: z.string().min(1),
  apiKey: z.string().min(1),
});

const nativeStructuredOutputProviders = new Set([
  "openai",
  "openrouter",
  "groq",
  "nebius",
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

const resolveSafeAddresses = async (hostname: string): Promise<string[]> => {
  const addresses = isIP(hostname)
    ? [hostname]
    : (await lookup(hostname, { all: true, verbatim: true })).map(
        ({ address }) => address
      );
  if (addresses.length === 0 || addresses.some(isPrivateAddress)) {
    throw new Error("Unsafe provider address");
  }
  return addresses;
};

const responseHeaders = (
  headers: Record<string, string | string[] | undefined>
): Headers => {
  const result = new Headers();
  for (const [name, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      for (const item of value) result.append(name, item);
    } else if (value !== undefined) {
      result.set(name, value);
    }
  }
  return result;
};

const pinnedHttpsFetch = async (
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  pinnedAddress: string,
  maximumResponseBytes: number
): Promise<Response> => {
  const normalizedRequest = new Request(input, init);
  const url = new URL(normalizedRequest.url);
  const method = normalizedRequest.method;
  const body =
    method === "GET" || method === "HEAD"
      ? undefined
      : Buffer.from(await normalizedRequest.arrayBuffer());

  return new Promise((resolve, reject) => {
    let settled = false;
    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };

    const request = httpsRequest(
      url,
      {
        method,
        headers: Object.fromEntries(normalizedRequest.headers.entries()),
        signal: AbortSignal.any([
          normalizedRequest.signal,
          AbortSignal.timeout(60_000),
        ]),
        lookup: (_hostname, lookupOptions, callback) => {
          const family = isIP(pinnedAddress);
          if (lookupOptions.all) {
            callback(null, [{ address: pinnedAddress, family }]);
            return;
          }
          callback(null, pinnedAddress, family);
        },
      },
      (incoming) => {
        const status = incoming.statusCode ?? 500;
        if (status >= 300 && status < 400) {
          incoming.resume();
          fail(new Error("Provider redirects are not allowed"));
          return;
        }

        const chunks: Buffer[] = [];
        let receivedBytes = 0;
        incoming.on("data", (chunk: Buffer) => {
          receivedBytes += chunk.byteLength;
          if (receivedBytes > maximumResponseBytes) {
            incoming.destroy();
            fail(new Error("Provider response exceeded the size limit"));
            return;
          }
          chunks.push(chunk);
        });
        incoming.on("error", fail);
        incoming.on("end", () => {
          if (settled) return;
          settled = true;
          resolve(
            new Response(Buffer.concat(chunks), {
              status,
              statusText: incoming.statusMessage,
              headers: responseHeaders(incoming.headers),
            })
          );
        });
      }
    );

    request.on("error", fail);
    request.end(body);
  });
};

export const assertSafeUrl = async (value: string): Promise<void> => {
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
  await resolveSafeAddresses(hostname);
};

type ProviderFetch = NonNullable<OpenAICompatibleProviderSettings["fetch"]>;

const safeProviderFetch = (baseUrl: string): ProviderFetch => {
  const origin = new URL(baseUrl).origin;
  const maximumResponseBytes = 10 * 1024 * 1024;

  const safeFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(
      typeof input === "string" || input instanceof URL ? input : input.url
    );
    if (url.origin !== origin) throw new Error("Provider origin changed");
    await assertSafeUrl(url.origin);
    const hostname = url.hostname.replace(/^\[|\]$/g, "");
    const addresses = await resolveSafeAddresses(hostname);
    const pinnedAddress = addresses[0];
    return pinnedHttpsFetch(input, init, pinnedAddress, maximumResponseBytes);
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
