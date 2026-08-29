import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { enqueue } from "@/lib/queue";
import { verifyWorkerRequest } from "@/lib/worker-auth";
import { topicsSchema } from "@/lib/zod";

/** Drains a bounded batch of the database queue outbox into BullMQ. */
export async function POST(request: NextRequest) {
  const unauthorized = verifyWorkerRequest(request);
  if (unauthorized) return unauthorized;

  const dispatches = await prisma.generationDispatch.findMany({
    orderBy: { createdAt: "asc" },
    take: 10,
  });
  let dispatched = 0;

  for (const dispatch of dispatches) {
    const payload = topicsSchema.safeParse(dispatch.payload);
    if (!payload.success) {
      console.error("Stored generation dispatch is invalid");
      continue;
    }

    if (!(await enqueue(payload.data, dispatch.materialId))) continue;
    await prisma.generationDispatch.deleteMany({
      where: { materialId: dispatch.materialId },
    });
    dispatched += 1;
  }

  return NextResponse.json({ inspected: dispatches.length, dispatched });
}
