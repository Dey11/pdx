import { NextRequest, NextResponse } from "next/server";

import {
  AiCredentialRequiredError,
  resolveAiCredentialForMaterial,
} from "@/lib/ai/credential-service";
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
  } catch (error) {
    if (error instanceof AiCredentialRequiredError) {
      return NextResponse.json(
        { error: "AI credential not available" },
        { status: 404 }
      );
    }
    console.error("Failed to resolve the material AI credential");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
