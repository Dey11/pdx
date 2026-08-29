import { NextResponse } from "next/server";

import { APICallError } from "ai";

import {
  CredentialChangeBlockedError,
  aiCredentialInputSchema,
  deleteAiCredential,
  getAiCredentialStatus,
  saveAiCredential,
} from "@/lib/ai/credential-service";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const findApiCallError = (error: unknown): APICallError | null => {
  let current = error;
  while (current) {
    if (APICallError.isInstance(current)) return current;
    if (typeof current !== "object" || !("cause" in current)) return null;
    current = current.cause;
  }
  return null;
};

const validationMessage = (error: unknown): string => {
  const apiError = findApiCallError(error);
  if (apiError?.statusCode === 401 || apiError?.statusCode === 403) {
    return "The provider rejected this API key.";
  }
  if (apiError?.statusCode === 404) {
    return "The provider could not find that model or endpoint.";
  }
  if (apiError?.statusCode === 429) {
    return "The provider rate-limited the verification request. Try again shortly.";
  }
  if (error instanceof DOMException && error.name === "TimeoutError") {
    return "The provider did not respond before verification timed out.";
  }
  if (error instanceof Error && error.message.startsWith("Provider URL")) {
    return error.message;
  }
  return "The provider did not return compatible structured output. Check the endpoint and model.";
};

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

  const parsed = aiCredentialInputSchema.safeParse(await request.json());
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
        error: validationMessage(error),
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
