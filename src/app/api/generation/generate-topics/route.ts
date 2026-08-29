import { NextRequest, NextResponse } from "next/server";

import { generateObject } from "ai";
import { z } from "zod";

import {
  AiCredentialRequiredError,
  resolveAiCredentialForUser,
} from "@/lib/ai/credential-service";
import { MAX_OUTPUT_TOKENS, createGenerationModel } from "@/lib/ai/model";
import { systemPrompt } from "@/lib/ai/prompts/system";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateTopicsSchema } from "@/lib/zod";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const materialInDb = await prisma.material.findMany({
      where: {
        userId: session.user.id,
      },
    });

    const isPending = materialInDb.some(
      (material) =>
        material.status === "pending" || material.status === "inprogress"
    );

    if (isPending) {
      return NextResponse.json(
        { error: "You have a pending material" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const res = generateTopicsSchema.safeParse(body);

    if (!res.success) {
      console.error(res.error);
      return NextResponse.json({ error: res.error }, { status: 400 });
    }

    const topicSchema = z.object({
      moduleName: z.string().describe("The name of the module"),
      instruction: z
        .string()
        .describe(
          "The instruction for generating content, specific to the subject or module."
        ),
      submodules: z.array(
        z.object({
          name: z.string().describe("The name of the submodule"),
          weightage: z
            .enum(["high", "medium", "low"])
            .describe(
              "The weightage of the submodule. How in depth this needs to be covered"
            ),
          subtopics: z
            .array(z.string())
            .describe("The subtopics in this submodule that must be covered"),
          numericals: z.array(z.string()).describe(
            `Whether this submodule has numericals. If true, mention the numerical topics on which study material has to be generated.
               If no numericals are present, mention \"no numericals\"`
          ),
          formulas: z.boolean().describe("Whether this submodule has formulas"),
          examples: z.boolean().describe("Whether this submodule has examples"),
          completed: z.boolean().describe("Keep this false, always"),
          tryCount: z.number().describe("Keep this 0, always"),
        })
      ),
    });

    const credential = await resolveAiCredentialForUser(session.user.id);
    const { object } = await generateObject({
      model: createGenerationModel(credential),
      maxRetries: 0,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      system: `${systemPrompt}. The language should be in ${body.language}. Subject: ${body.subject}.
        The difficulty is set to ${body.complexity}. It will be a ${body.type} material.
        The exam is ${body.exam}. The course is ${body.course}.
        Respond as strict JSON that matches the requested schema.
      `,
      schema: topicSchema,
      prompt: body.syllabus,
    });

    return NextResponse.json({ data: object });
  } catch (err) {
    if (err instanceof AiCredentialRequiredError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: 409 }
      );
    }
    console.error("Topic planning failed");
    return NextResponse.json(
      { error: "Topic planning failed" },
      { status: 502 }
    );
  }
}
