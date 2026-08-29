import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { prisma } from "@/lib/db";
import { verifyWorkerRequest } from "@/lib/worker-auth";

const bodySchema = z.object({
  materialId: z.string(),
  key: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const unauthorized = verifyWorkerRequest(req);
    if (unauthorized) {
      return unauthorized;
    }

    const body = await req.json();
    const res = bodySchema.safeParse(body);

    if (!res.success) {
      return NextResponse.json({ status: 400 });
    }

    await prisma.material.update({
      where: { id: res.data.materialId },
      data: {
        id: res.data?.materialId,
        status: "completed",
        pdfUrl: res.data?.key,
      },
    });

    return NextResponse.json({ status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 500 });
  }
}
