import { buildLlmsText } from "@/lib/llms-text";

export const revalidate = 604800;

export async function GET() {
  const body = await buildLlmsText({ full: true });

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
