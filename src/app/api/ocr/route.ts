import { generateText } from 'ai';
import { NextRequest, NextResponse } from "next/server.js";
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const geminiApiKey = process.env.GOOGLE_API_KEY || "";

if (!geminiApiKey) {
  throw new Error("Missing GOOGLE_API_KEY environment variable");
}

const google = createGoogleGenerativeAI({
  apiKey: geminiApiKey
});

const readonlySafetySettings = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
] as const;

const safetySettings = [...readonlySafetySettings];


async function extractSyllabusTopics(base64Image: string): Promise<string[]> {
  try {
    const model = google('gemini-1.5-flash', {safetySettings: safetySettings});

    const result = await generateText({
      model: model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract the syllabus topics from this image. Return a list of topics. Do not say anything else. If there is no syllabus topics, return empty list at all costs.',
            },
            {
              type: 'image',
              image: base64Image,
            },
          ],
        },
      ],
    });

    const topics: string[] = result.text.split("\n")
    .map((topic) => topic.replace(/^\d+\.\s*/, "").trim())
    .filter((topic) => topic !== "");


    return topics;
  } catch (error: any) {
    console.error("Gemini API error:", error);
    throw new Error(`Gemini API error: ${error.message}`);
  }
}


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as Blob | null;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    const topics = await extractSyllabusTopics(base64Image);

    return NextResponse.json({ topics });

  } catch (error: any) {
    console.error("Error processing image:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
