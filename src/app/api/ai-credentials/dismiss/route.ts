import { NextResponse } from "next/server";

import { dismissAiSetupPrompt } from "@/lib/ai/credential-service";
import { auth } from "@/lib/auth";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dismissAiSetupPrompt(session.user.id);
  return new NextResponse(null, { status: 204 });
}
