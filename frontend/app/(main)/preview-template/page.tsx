import { notFound } from "next/navigation";
import { fetchGeneratorTemplateById } from "@/sanity/lib/fetch";
import Blocks from "@/components/blocks";
import { draftMode } from "next/headers";

export default async function PreviewTemplatePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { isEnabled } = await draftMode();
  const { id } = await searchParams;

  if (!isEnabled || !id) {
    notFound();
  }

  const template = await fetchGeneratorTemplateById({ id });

  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground p-8 text-center">
        Template not found or draft mode error. Wait for changes to sync.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-muted text-muted-foreground text-xs p-2 text-center border-b">
        <strong>Live Preview:</strong> {template.title || "Untitled Template"} ({template.routeBase || "No Route Base"})
      </div>
      <Blocks blocks={template.blocks || []} />
    </div>
  );
}
