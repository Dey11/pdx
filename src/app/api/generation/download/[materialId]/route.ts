import { NextResponse } from "next/server";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { S3 } from "@/lib/object-storage/r2";
import { ratelimit } from "@/lib/rate-limit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ materialId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { success } = await ratelimit.limit(session.user.id!);

    if (!success) {
      return NextResponse.json({ error: "Rate Limited", status: 429 });
    }

    const { materialId } = await params;

    const materialInDb = await prisma.material.findFirst({
      where: {
        id: materialId,
      },
    });

    if (materialInDb?.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate signed URL
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: materialInDb?.pdfUrl!,
    });

    const url = await getSignedUrl(S3, command, { expiresIn: 3600 }); // 1 hour expiration

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate download URL" },
      { status: 500 }
    );
  }
}
