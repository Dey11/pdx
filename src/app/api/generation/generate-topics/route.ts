import { NextRequest, NextResponse } from "next/server";

import { generateObject } from "ai";
import { z } from "zod";

import { model } from "@/lib/ai/model";
import { MAX_TOKENS } from "@/lib/ai/model";
import { systemPrompt } from "@/lib/ai/prompts/system";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ratelimit } from "@/lib/rate-limit";
import { generateTopicsSchema } from "@/lib/zod";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { success } = await ratelimit.limit(session.user.id!);

    if (!success) {
      return NextResponse.json({ error: "Rate Limited", status: 429 });
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

    const { object, usage } = await generateObject({
      model,
      maxRetries: 0,
      maxTokens: MAX_TOKENS,
      system: `${systemPrompt}. The language should be in ${body.language}. Subject: ${body.subject}.
        The difficulty is set to ${body.complexity}. It will be a ${body.type} material.
        The exam is ${body.exam}. The course is ${body.course}.
      `,
      schema: z.object({
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
            formulas: z
              .boolean()
              .describe("Whether this submodule has formulas"),
            examples: z
              .boolean()
              .describe("Whether this submodule has examples"),
            completed: z.boolean().describe("Keep this false, always"),
            tryCount: z.number().describe("Keep this 0, always"),
          })
        ),
      }),
      prompt: body.syllabus,
    });

    const easyTopics = object.submodules.filter(
      (obj) => obj.weightage === "low"
    );
    const mediumTopics = object.submodules.filter(
      (obj) => obj.weightage === "medium"
    );
    const hardTopics = object.submodules.filter(
      (obj) => obj.weightage === "high"
    );

    const credits =
      easyTopics.length * 4 +
      mediumTopics.length * 7 +
      hardTopics.length * 10 +
      usage.totalTokens / 1000;

    return new NextResponse(
      JSON.stringify({ data: object, credits: Math.round(credits) }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({
        error: "Something went wrong",
      }),
      {
        status: 500,
      }
    );
  }
}
