import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user) {
      const userInDb = await prisma.user.findFirst({
        where: {
          id: session.user.id,
        },
      });
      const plan = userInDb?.subscriptionType;
      return NextResponse.json({
        plan,
      });
    }

    return NextResponse.json({
      plan: "Student",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      plan: "Student",
      error: "Something went wrong",
      status: 500,
    });
  }
}
