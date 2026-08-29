import type { OpenAICompatibleProviderSettings } from "@ai-sdk/openai-compatible";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export type AddressResolver = (hostname: string) => Promise<string[]>;
type ProviderFetch = NonNullable<OpenAICompatibleProviderSettings["fetch"]>;

const resolveAddresses: AddressResolver = async (hostname) => {
  const addresses = await lookup(hostname, { all: true, verbatim: true });
  return addresses.map(({ address }) => address);
};

const isForbiddenIpv4 = (address: string): boolean => {
  const [a, b] = address.split(".").map(Number);

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
};

const isForbiddenIpv6 = (address: string): boolean => {
  const normalized = address.toLowerCase();

  if (normalized.startsWith("::ffff:")) {
    const mappedAddress = normalized.slice("::ffff:".length);
    if (isIP(mappedAddress) === 4) return isForbiddenIpv4(mappedAddress);

    const [high, low] = mappedAddress
      .split(":")
      .map((part) => parseInt(part, 16));
    if (Number.isFinite(high) && Number.isFinite(low)) {
      return isForbiddenIpv4(
        `${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`
      );
    }
    return true;
  }

  return (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("::") ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe") ||
    normalized.startsWith("ff")
  );
};

const isForbiddenAddress = (address: string): boolean => {
  const version = isIP(address);
  return (
    version === 0 ||
    (version === 4 && isForbiddenIpv4(address)) ||
    (version === 6 && isForbiddenIpv6(address))
  );
};

/** Validates an OpenAI-compatible base URL against SSRF-sensitive destinations. */
export const assertSafeProviderBaseUrl = async (
  value: string,
  resolver: AddressResolver = resolveAddresses
): Promise<string> => {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Provider URL must be a valid absolute URL");
  }

  if (url.protocol !== "https:") {
    throw new Error("Provider URL must use HTTPS");
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new Error(
      "Provider URL cannot include credentials, a query, or a fragment"
    );
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".localhost")) {
    throw new Error("Provider URL must resolve to a public IP address");
  }

  const addresses = isIP(hostname) ? [hostname] : await resolver(hostname);
  if (addresses.length === 0 || addresses.some(isForbiddenAddress)) {
    throw new Error("Provider URL must resolve only to public IP addresses");
  }

  return url.toString().replace(/\/$/, "");
};

const limitResponseBody = (
  response: Response,
  maximumBytes: number
): Response => {
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

/** Creates a fetch boundary that rechecks DNS, rejects redirects, and caps time and size. */
export const createSafeProviderFetch = (
  expectedBaseUrl: string,
  options: {
    resolver?: AddressResolver;
    timeoutMs?: number;
    maximumResponseBytes?: number;
  } = {}
): ProviderFetch => {
  const baseOrigin = new URL(expectedBaseUrl).origin;
  const timeoutMs = options.timeoutMs ?? 60_000;
  const maximumResponseBytes = options.maximumResponseBytes ?? 10 * 1024 * 1024;

  const safeFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const requestUrl =
      typeof input === "string" || input instanceof URL
        ? new URL(input)
        : new URL(input.url);

    if (requestUrl.origin !== baseOrigin) {
      throw new Error("Provider request escaped its configured origin");
    }
    await assertSafeProviderBaseUrl(requestUrl.origin, options.resolver);

    const timeoutSignal = AbortSignal.timeout(timeoutMs);
    const signal = init?.signal
      ? AbortSignal.any([init.signal, timeoutSignal])
      : timeoutSignal;
    const response = await fetch(input, {
      ...init,
      redirect: "error",
      signal,
    });

    return limitResponseBody(response, maximumResponseBytes);
  };

  return Object.assign(safeFetch, { preconnect: () => undefined });
};
