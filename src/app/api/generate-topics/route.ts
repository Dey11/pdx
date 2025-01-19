import { NextRequest, NextResponse } from "next/server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { systemPrompt } from "@/lib/prompts/system";
import { generateTopicsSchema } from "@/lib/zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const model = google("gemini-2.0-flash-exp");

const MAX_TOKENS = 8192;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const body = await req.json();

    const res = generateTopicsSchema.safeParse(body);

    if (!res.success) {
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

    return new NextResponse(JSON.stringify({ data: object }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new NextResponse(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
