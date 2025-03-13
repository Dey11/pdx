import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { prisma } from "@/lib/db";

const bodySchema = z.object({
  materialId: z.string(),
  key: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = bodySchema.safeParse(body);

    if (!res.success) {
      return NextResponse.json({ status: 400 });
    }

    const materialsInDb = await prisma.materialTask.findMany({
      where: { materialId: res.data.materialId },
    });

    let credits = 0;
    materialsInDb.map((material) => {
      credits += Math.round(material.tokensUsed / 1000);
    });

    const updateMaterial = await prisma.material.update({
      where: { id: res.data.materialId },
      data: {
        id: res.data?.materialId,
        status: "completed",
        pdfUrl: res.data?.key,
      },
    });

    const userInDb = await prisma.user.findFirst({
      where: { id: updateMaterial.userId },
    });

    await prisma.user.update({
      where: { id: updateMaterial.userId },
      data: {
        reservedCredits: 0,
        credits: userInDb?.credits! - credits,
      },
    });

    return NextResponse.json({ status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 500 });
  }
}
