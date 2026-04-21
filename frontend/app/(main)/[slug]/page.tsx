import Blocks from "@/components/blocks";
import {
  fetchSanityPageBySlug,
  fetchSanityPagesStaticParams,
  fetchTemplatePageByRoute,
  fetchTemplatePageRoutes,
} from "@/sanity/lib/fetch";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import RewritePageShell from "@/components/ui/rewrite/page-shell";
import type { LegacyAstroPage } from "@/lib/legacy-pages/astro-static";
import { resolveTemplateMeta } from "@/lib/templates/resolve-template";

export async function generateStaticParams() {
  const pages = await fetchSanityPagesStaticParams();
  const templateRoutes = await fetchTemplatePageRoutes();

  const sanityParams = pages.map((page) => ({
    slug: page.slug?.current,
  }));
  const templateParams = templateRoutes
    .map((item) => item.route || "")
    .map((route) => route.replace(/^\/+/, ""))
    .filter((route) => route && !route.includes("/"))
    .map((slug) => ({ slug }));

  const dedup = new Map<string, { slug: string }>();
  for (const item of [...sanityParams, ...templateParams]) {
    if (!item?.slug) continue;
    if (!dedup.has(item.slug)) dedup.set(item.slug, { slug: item.slug });
  }

  return Array.from(dedup.values());
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const route = `/${params.slug}`;
  const templatePage = await fetchTemplatePageByRoute({ route });
  if (templatePage) {
    const meta = resolveTemplateMeta({
      page: templatePage.meta || null,
      template: templatePage.template?.metaDefaults || null,
    });
    const page = {
      title: templatePage.title || params.slug,
      excerpt: templatePage.structured?.description,
      meta: meta || undefined,
    };
    return await generatePageMetadata({ page, slug: params.slug });
  }
  const page = await fetchSanityPageBySlug({ slug: params.slug });

  if (page) {
    return await generatePageMetadata({ page, slug: params.slug });
  }

  if (!page) {
    notFound();
  }
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const route = `/${params.slug}`;
  const templatePage = await fetchTemplatePageByRoute({ route });
  if (templatePage) {
    const templateShellId = templatePage.template?.shellId || params.slug;
    const virtualPage: LegacyAstroPage = {
      route,
      section: templateShellId,
      slug: params.slug,
      sourceFile: "sanity-template",
      title: templatePage.title || params.slug,
      migrationStatus: "draft",
    };
    return <RewritePageShell page={virtualPage} />;
  }
  const page = await fetchSanityPageBySlug({ slug: params.slug });

  if (page) {
    return <Blocks blocks={page?.blocks ?? []} pageTitle={page.title} />;
  }

  if (!page) {
    notFound();
  }
}
