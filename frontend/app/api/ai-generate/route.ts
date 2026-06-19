import { NextResponse } from "next/server";
import { generateAll } from "./lib/ai-provider";

export async function POST(req: Request) {
  try {
    const { prompts } = await req.json();

    if (!Array.isArray(prompts) || prompts.length === 0) {
      return NextResponse.json({ error: "prompts array is required" }, { status: 400 });
    }

    const results = await generateAll(prompts);
    return NextResponse.json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI generation failed";
    console.error("AI Generate API Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
