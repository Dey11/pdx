import { NextRequest, NextResponse } from "next/server";

import { resolveAiCredentialForMaterial } from "@/lib/ai/credential-service";
import { verifyWorkerRequest } from "@/lib/worker-auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ materialId: string }> }
) {
  const unauthorized = verifyWorkerRequest(request);
  if (unauthorized) return unauthorized;

  const { materialId } = await context.params;
  try {
    return NextResponse.json(await resolveAiCredentialForMaterial(materialId), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "AI credential not available" },
      { status: 404 }
    );
  }
}
