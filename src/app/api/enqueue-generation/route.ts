import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { topicsSchema } from "@/lib/zod";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const res = topicsSchema.safeParse(body);

    if (!res.success) {
      console.error(res.error);
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    return NextResponse.json({ message: "Success" });
  } catch (err) {
    return NextResponse.json(
      { error: "Some error occured. Please try again later." },
      { status: 500 }
    );
  }
}
