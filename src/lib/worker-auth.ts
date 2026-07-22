import { timingSafeEqual } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

const WORKER_SECRET_HEADER = "x-worker-secret";

let warnedAboutMissingSecret = false;

function timingSafeMatches(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);

  // timingSafeEqual throws on length mismatch; guard so the comparison itself
  // never leaks length via an exception path.
  if (aBuf.length !== bBuf.length) {
    return false;
  }

  return timingSafeEqual(aBuf, bBuf);
}

/**
 * Authenticates a callback from the generation worker.
 *
 * Returns a 401 NextResponse when WORKER_CALLBACK_SECRET is configured and the
 * request's `x-worker-secret` header does not match it (timing-safe compare).
 *
 * Backward-compat: if WORKER_CALLBACK_SECRET is unset/empty, the request is
 * allowed and a one-time warning is logged, so existing deployments keep working
 * until the env var is rolled out to both services.
 */
export function verifyWorkerRequest(req: NextRequest): NextResponse | null {
  const secret = process.env.WORKER_CALLBACK_SECRET;

  if (!secret) {
    if (!warnedAboutMissingSecret) {
      warnedAboutMissingSecret = true;
      console.warn(
        "WORKER_CALLBACK_SECRET is not set; worker callback routes are unauthenticated. Set it on both the web and worker services to enable verification."
      );
    }
    return null;
  }

  const provided = req.headers.get(WORKER_SECRET_HEADER) ?? "";

  if (!timingSafeMatches(provided, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
