import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { verifyWorkerRequest } from "@/lib/worker-auth";

export const dynamic = "force-dynamic";

/** Returns terminal task IDs so generation retries never repeat paid AI work. */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ materialId: string }> }
) {
  const unauthorized = verifyWorkerRequest(request);
  if (unauthorized) return unauthorized;

  const { materialId } = await context.params;
  const material = await prisma.material.findUnique({
    where: { id: materialId },
    select: {
      Task: {
        where: { status: { in: ["completed", "failed"] } },
        select: { id: true, nextQuestionNumber: true },
      },
    },
  });

  if (!material) {
    return NextResponse.json({ error: "Material not found" }, { status: 404 });
  }

  return NextResponse.json(
    { terminalTasks: material.Task },
    { headers: { "Cache-Control": "no-store" } }
  );
}
