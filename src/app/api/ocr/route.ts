import { GenerativeModel, GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const geminiApiKey = process.env.GOOGLE_API_KEY || "";

if (!geminiApiKey) {
  throw new Error("Missing GOOGLE_API_KEY environment variable");
}

const generationConfig = {
  temperature: 0.4,
  topP: 1,
  topK: 32,
  maxOutputTokens: 4096,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

async function extractSyllabusTopics(base64Image: string): Promise<string[]> {
  try {
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig, safetySettings });

    const prompt = "Extract the syllabus topics from this image. Return a list of topics. If there is no syllabus topics, return empty list at all costs.";

    const result = await model.generateContent([prompt, { inlineData: { mimeType: "image/png", data: base64Image } }]);
    const response = result.response;
    const text = response.text();

    // Split the text into topics, removing any extra whitespace or numbering
    const topics = text.split("\\n")
      .map(topic => topic.replace(/^\\d+\\.\\s*/, "").trim())
      .filter(topic => topic !== "");

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
