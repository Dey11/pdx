import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { prisma } from "@/lib/db";
import { mergePdf } from "@/lib/queue";
import { retrySerializableTransaction } from "@/lib/transaction-retry";
import { verifyWorkerRequest } from "@/lib/worker-auth";

const bodySchema = z
  .object({
    materialId: z.string(),
    taskId: z.string(),
    type: z.enum(["theory", "qbank"]),
    key: z.string(),
    usage: z.number().nonnegative(),
    success: z.boolean(),
    nextQuestionNumber: z.number().int().positive().optional(),
  })
  .strict();

export async function POST(req: NextRequest) {
  try {
    const unauthorized = verifyWorkerRequest(req);
    if (unauthorized) {
      return unauthorized;
    }

    const body = await req.json();
    const res = bodySchema.safeParse(body);
    if (!res.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const outcome = await retrySerializableTransaction(() =>
      prisma.$transaction(
        async (transaction) => {
          const material = await transaction.material.findUnique({
            where: { id: res.data.materialId },
          });
          if (!material) return null;
          if (material.status === "completed" || material.status === "failed") {
            return { material, shouldMerge: false };
          }

          const task = await transaction.materialTask.findUnique({
            where: {
              id: res.data.taskId,
              materialId: res.data.materialId,
            },
          });
          if (!task) return null;

          // The first terminal outcome wins. A retried generation job cannot
          // downgrade a part that was already persisted successfully.
          if (task.status !== "completed" && task.status !== "failed") {
            await transaction.materialTask.update({
              where: { id: task.id },
              data: {
                status: res.data.success ? "completed" : "failed",
                partialResultUrl: res.data.key,
                tokensUsed: res.data.usage,
                nextQuestionNumber: res.data.nextQuestionNumber,
              },
            });
          }

          const [completedParts, failedParts] = await Promise.all([
            transaction.materialTask.count({
              where: { materialId: material.id, status: "completed" },
            }),
            transaction.materialTask.count({
              where: { materialId: material.id, status: "failed" },
            }),
          ]);
          const terminalParts = completedParts + failedParts;
          const allPartsFailed =
            terminalParts >= material.totalParts && completedParts === 0;
          const updatedMaterial = await transaction.material.update({
            where: { id: material.id },
            data: {
              completedParts: terminalParts,
              status: allPartsFailed ? "failed" : "inprogress",
            },
          });

          return {
            material: updatedMaterial,
            shouldMerge:
              terminalParts >= material.totalParts && completedParts > 0,
          };
        },
        { isolationLevel: "Serializable" }
      )
    );

    if (!outcome) {
      return NextResponse.json(
        { error: "Material or task not found" },
        { status: 404 }
      );
    }

    if (outcome.shouldMerge) {
      const mergeQueued = await mergePdf({
        materialId: outcome.material.id,
        type: res.data.type,
      });
      if (!mergeQueued) {
        throw new Error("Failed to enqueue the final PDF merge");
      }
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
