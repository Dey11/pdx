import { NextRequest, NextResponse } from "next/server";

import { timingSafeEqual } from "node:crypto";

const WORKER_SECRET_HEADER = "x-worker-secret";

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
 * Returns a 401 response when the shared secret is missing or does not match.
 * This always fails closed because the same boundary can return decrypted
 * provider credentials.
 */
export function verifyWorkerRequest(req: NextRequest): NextResponse | null {
  const secret = process.env.WORKER_CALLBACK_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const provided = req.headers.get(WORKER_SECRET_HEADER) ?? "";

  if (!timingSafeMatches(provided, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
