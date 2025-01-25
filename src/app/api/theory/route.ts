import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { prisma } from "@/lib/db";

const bodySchema = z.object({
  materialId: z.string(),
  id: z.string(),
  currIndex: z.number(),
  totalIndex: z.number(),
  usage: z.number(),
  key: z.string().optional(),
  success: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = bodySchema.safeParse(body);
    if (!res.success) {
      console.error(res.error);
      return NextResponse.json({ status: 400 });
    }

    await prisma.materialTask.update({
      where: {
        id: res.data.id,
      },
      data: {
        status: res.data.success ? "completed" : "failed",
        partialResultUrl: res.data.key || "",
        tokensUsed: res.data.usage || 0, // DO SOMETHING FOR CALCULATING THE TOKENS USED
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        success: false,
      },
      { status: 500 }
    );
  }
}
