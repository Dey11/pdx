import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { prisma } from "@/lib/db";
import { mergePdf } from "@/lib/queue";

const bodySchema = z.object({
  materialId: z.string(),
  type: z.enum(["theory", "qbank"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = bodySchema.safeParse(body);
    if (!res.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const materialInDb = await prisma.material.findFirst({
      where: {
        id: res.data.materialId,
      },
    });

    if (!materialInDb) {
      return NextResponse.json(
        { error: "Material not found" },
        { status: 404 }
      );
    }

    const updatedMaterial = await prisma.material.update({
      where: {
        id: res.data.materialId,
      },
      data: {
        completedParts: materialInDb.completedParts + 1,
        status:
          materialInDb.completedParts + 1 >= materialInDb.totalParts
            ? "completed"
            : "inprogress",
      },
    });

    if (updatedMaterial.completedParts === updatedMaterial.totalParts) {
      mergePdf({ materialId: materialInDb.id, type: res.data.type });
    }

    return NextResponse.json({ message: "Material updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
