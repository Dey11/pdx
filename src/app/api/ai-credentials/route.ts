import { NextResponse } from "next/server";

import {
  CredentialChangeBlockedError,
  aiCredentialInputSchema,
  deleteAiCredential,
  getAiCredentialStatus,
  saveAiCredential,
} from "@/lib/ai/credential-service";
import { getCredentialValidationMessage } from "@/lib/ai/credential-errors";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await getAiCredentialStatus(session.user.id), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = aiCredentialInputSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid provider settings" },
      { status: 400 }
    );
  }

  try {
    return NextResponse.json(
      await saveAiCredential(session.user.id, parsed.data)
    );
  } catch (error) {
    if (error instanceof CredentialChangeBlockedError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json(
      {
        error: getCredentialValidationMessage(error),
      },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await deleteAiCredential(session.user.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof CredentialChangeBlockedError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    throw error;
  }
}
