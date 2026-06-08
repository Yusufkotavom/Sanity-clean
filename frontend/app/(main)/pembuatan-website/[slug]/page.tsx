import RewritePageShell from "@/components/ui/rewrite/page-shell";
import Blocks from "@/components/blocks";
import {
  getLegacySectionAliasSlugs,
  getLegacySectionChildren,
  getLegacySectionSlug,
} from "@/lib/legacy-pages/astro-static";
import { generateLegacyPageMetadata } from "@/lib/legacy-pages/metadata";
import {
  fetchTemplatePageByRoute,
  fetchTemplatePageRoutes,
  fetchSanityPageBySlug,
} from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { resolveTemplateMeta } from "@/lib/templates/resolve-template";
import { notFound } from "next/navigation";
import type { LegacyAstroPage } from "@/lib/legacy-pages/astro-static";

export async function generateStaticParams() {
  const directSlugs = getLegacySectionChildren("pembuatan-website").map(
    (item) => item.slug,
  );
  const aliasSlugs = getLegacySectionAliasSlugs("pembuatan-website");
  const templateRoutes = await fetchTemplatePageRoutes();
  const templateSlugs = templateRoutes
    .map((item) => item.route || "")
    .filter((route) => route.startsWith("/pembuatan-website/"))
    .map((route) => route.replace(/^\/pembuatan-website\//, ""))
    .filter((slug) => slug && !slug.includes("/"));

  return Array.from(
    new Set([...directSlugs, ...aliasSlugs, ...templateSlugs]),
  ).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const route = `/pembuatan-website/${params.slug}`;
  const templatePage = await fetchTemplatePageByRoute({ route });
  if (templatePage) {
    const meta = resolveTemplateMeta({
      page: templatePage.meta || null,
      template: templatePage.template?.metaDefaults || null,
    });
    return await generatePageMetadata({
      page: {
        title: templatePage.title || params.slug,
        excerpt: templatePage.structured?.description,
        meta: meta || undefined,
      },
      slug: route.replace(/^\/+/, ""),
    });
  }

  const sanityPage = await fetchSanityPageBySlug({ slug: `pembuatan-website/${params.slug}` });
  if (sanityPage) {
    return await generatePageMetadata({ page: sanityPage, slug: `pembuatan-website/${params.slug}` });
  }

  return generateLegacyPageMetadata(
    getLegacySectionSlug("pembuatan-website", params.slug),
  );
}

export default async function PembuatanWebsiteDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const route = `/pembuatan-website/${params.slug}`;
  const templatePage = await fetchTemplatePageByRoute({ route });
  if (templatePage) {
    const virtualPage: LegacyAstroPage = {
      route,
      section: "pembuatan-website",
      slug: params.slug,
      sourceFile: "sanity-template",
      title: templatePage.title || params.slug,
      migrationStatus: "draft",
    };
    return (
      <RewritePageShell
        page={virtualPage}
        siblings={getLegacySectionChildren("pembuatan-website")}
      />
    );
  }

  const sanityPage = await fetchSanityPageBySlug({ slug: `pembuatan-website/${params.slug}` });
  if (sanityPage) {
    return <Blocks blocks={sanityPage?.blocks ?? []} pageTitle={sanityPage.title} />;
  }

  const page = getLegacySectionSlug("pembuatan-website", params.slug);
  if (!page) notFound();

  return (
    <RewritePageShell
      page={page}
      siblings={getLegacySectionChildren("pembuatan-website")}
    />
  );
}
