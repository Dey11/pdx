import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const {
      code,
      description = "",
      credits,
      maxRedemptions,
      isActive,
      secretKey,
    } = await req.json();

    if (secretKey !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newCode = await prisma.couponCode.create({
      data: {
        code,
        credits,
        description,
        isActive,
        maxRedemptions,
      },
    });

    return NextResponse.json({
      message: "Coupon code created successfully",
      code: newCode.code,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
