import RewritePageShell from "@/components/ui/rewrite/page-shell";
import Blocks from "@/components/blocks";
import {
  getLegacyRoutesByPrefix,
  getLegacySectionChildren,
  getLegacySectionDescendants,
  getLegacySectionRouteBySegments,
} from "@/lib/legacy-pages/astro-static";
import { generateLegacyPageMetadata } from "@/lib/legacy-pages/metadata";
import {
  fetchTemplatePageByRoute,
  fetchSanityPageBySlug,
} from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { resolveTemplateMeta } from "@/lib/templates/resolve-template";
import { notFound } from "next/navigation";
import type { LegacyAstroPage } from "@/lib/legacy-pages/astro-static";

const SECTION = "percetakan";
const CALENDAR_PREFIX = "/percetakan/cetak-kalender/";

type RouteParams = {
  segments: string[];
};

export function generateStaticParams() {
  return getLegacySectionDescendants(SECTION).map((item) => ({
    segments: item.route.replace("/percetakan/", "").split("/"),
  }));
}

export async function generateMetadata(props: { params: Promise<RouteParams> }) {
  const params = await props.params;
  const route = `/percetakan/${params.segments.join("/")}`;
  const slug = `percetakan/${params.segments.join("/")}`;

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

  return generateLegacyPageMetadata(
    getLegacySectionRouteBySegments(SECTION, params.segments),
  );
}

function resolveSiblings(pageRoute: string) {
  if (pageRoute.startsWith(CALENDAR_PREFIX)) {
    return getLegacyRoutesByPrefix(CALENDAR_PREFIX).slice(0, 25);
  }

  return getLegacySectionChildren(SECTION);
}

export default async function PercetakanCatchAllPage(props: {
  params: Promise<RouteParams>;
}) {
  const params = await props.params;
  const route = `/percetakan/${params.segments.join("/")}`;
  const slug = `percetakan/${params.segments.join("/")}`;

  const templatePage = await fetchTemplatePageByRoute({ route });
  if (templatePage) {
    const virtualPage: LegacyAstroPage = {
      route,
      section: "percetakan",
      slug: params.segments.at(-1) || "",
      sourceFile: "sanity-template",
      title: templatePage.title || params.segments.at(-1) || "Template Page",
      migrationStatus: "draft",
    };
    return <RewritePageShell page={virtualPage} siblings={resolveSiblings(route)} />;
  }

  const sanityPage = await fetchSanityPageBySlug({ slug });
  if (sanityPage) {
    return <Blocks blocks={sanityPage?.blocks ?? []} pageTitle={sanityPage.title} />;
  }

  const page = getLegacySectionRouteBySegments(SECTION, params.segments);
  if (!page) notFound();

  return <RewritePageShell page={page} siblings={resolveSiblings(page.route)} />;
}
