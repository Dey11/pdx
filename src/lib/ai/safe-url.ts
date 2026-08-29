import type { OpenAICompatibleProviderSettings } from "@ai-sdk/openai-compatible";
import { lookup } from "node:dns/promises";
import { request as httpsRequest } from "node:https";
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
    (a === 192 && b === 0) ||
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

const resolveSafeAddresses = async (
  hostname: string,
  resolver: AddressResolver
): Promise<string[]> => {
  const addresses = isIP(hostname) ? [hostname] : await resolver(hostname);
  if (addresses.length === 0 || addresses.some(isForbiddenAddress)) {
    throw new Error("Provider URL must resolve only to public IP addresses");
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
  timeoutMs: number,
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
          AbortSignal.timeout(timeoutMs),
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

  await resolveSafeAddresses(hostname, resolver);

  return url.toString().replace(/\/$/, "");
};

/** Creates a fetch boundary that pins validated DNS, rejects redirects, and caps time and size. */
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
    const resolver = options.resolver ?? resolveAddresses;
    await assertSafeProviderBaseUrl(requestUrl.origin, resolver);
    const hostname = requestUrl.hostname.replace(/^\[|\]$/g, "");
    const addresses = await resolveSafeAddresses(hostname, resolver);
    const pinnedAddress = addresses[0];
    return pinnedHttpsFetch(
      input,
      init,
      pinnedAddress,
      timeoutMs,
      maximumResponseBytes
    );
  };

  return Object.assign(safeFetch, { preconnect: () => undefined });
};
