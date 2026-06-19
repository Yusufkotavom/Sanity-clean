import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompts } = await req.json();

    if (!Array.isArray(prompts) || prompts.length === 0) {
      return NextResponse.json({ error: "prompts array is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
    }

    const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1/chat/completions";
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    // Execute in parallel
    const results = await Promise.all(
      prompts.map(async (prompt) => {
        try {
          const response = await fetch(baseUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model,
              messages: [
                { 
                  role: "system", 
                  content: "You are an automated content generator. Output ONLY the EXACT requested content. Do NOT include any conversational filler, intro, outro, or multiple options. Do not say 'Here is the result' or 'Tentu, ini beberapa pilihan'. Be extremely direct and to the point. If asked for 1 sentence, output exactly 1 sentence." 
                },
                { role: "user", content: prompt }
              ],
              temperature: 0.7,
              max_tokens: 1000,
            }),
          });

          if (!response.ok) {
            const err = await response.text();
            console.error("AI API error:", err);
            return `[AI Error: ${response.statusText}]`;
          }

          const data = await response.json();
          return data.choices?.[0]?.message?.content?.trim() || "[Empty Output]";
        } catch (err) {
          console.error("Fetch error:", err);
          return "[AI Error: Network/Parse]";
        }
      })
    );

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
