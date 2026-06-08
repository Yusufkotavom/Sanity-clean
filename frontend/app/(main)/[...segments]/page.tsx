import RewritePageShell from "@/components/ui/rewrite/page-shell";
import Blocks from "@/components/blocks";
import { fetchTemplatePageByRoute, fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { resolveTemplateMeta } from "@/lib/templates/resolve-template";
import { notFound } from "next/navigation";
import type { LegacyAstroPage } from "@/lib/legacy-pages/astro-static";
import { getLegacySectionChildren } from "@/lib/legacy-pages/astro-static";

export async function generateMetadata(props: {
  params: Promise<{ segments: string[] }>;
}) {
  const params = await props.params;
  const route = `/${(params.segments || []).join("/")}`;
  const slug = (params.segments || []).join("/");
  const templatePage = await fetchTemplatePageByRoute({ route });
  if (templatePage) {
    const meta = resolveTemplateMeta({
      page: templatePage.meta || null,
      template: templatePage.template?.metaDefaults || null,
    });
    return await generatePageMetadata({
      page: {
        title: templatePage.title || params.segments.at(-1),
        excerpt: templatePage.structured?.description,
        meta: meta || undefined,
      },
      slug: route.replace(/^\/+/, ""),
    });
  }

  const sanityPage = await fetchSanityPageBySlug({ slug });
  if (sanityPage) {
    return await generatePageMetadata({ page: sanityPage, slug });
  }

  return {};
}

export default async function TemplateRoutePage(props: {
  params: Promise<{ segments: string[] }>;
}) {
  const params = await props.params;
  const segments = params.segments || [];
  if (segments.length === 0) notFound();
  const route = `/${segments.join("/")}`;
  const slug = segments.join("/");
  const templatePage = await fetchTemplatePageByRoute({ route });
  
  if (templatePage) {
    const templateShellId = templatePage.template?.shellId || segments[0];
    const virtualPage: LegacyAstroPage = {
      route,
      section: templateShellId,
      slug: segments.at(-1) || "",
      sourceFile: "sanity-template",
      title: templatePage.title || segments.at(-1) || "Template Page",
      migrationStatus: "draft",
    };

    const siblings = getLegacySectionChildren(templateShellId);
    return <RewritePageShell page={virtualPage} siblings={siblings} />;
  }

  const sanityPage = await fetchSanityPageBySlug({ slug });
  if (sanityPage) {
    return <Blocks blocks={sanityPage?.blocks ?? []} pageTitle={sanityPage.title} />;
  }

  notFound();
}
