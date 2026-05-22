import { buildLlmsText } from "@/lib/llms-text";

export const revalidate = 2592000;

export async function GET() {
  const body = await buildLlmsText();

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
