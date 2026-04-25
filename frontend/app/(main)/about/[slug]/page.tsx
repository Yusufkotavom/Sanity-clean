import Blocks from "@/components/blocks";
import { getLegacySectionChildren, getLegacySectionSlug } from "@/lib/legacy-pages/astro-static";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import RewritePageShell from "@/components/ui/rewrite/page-shell";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getLegacySectionChildren("about").map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const page = getLegacySectionSlug("about", slug);
  return generatePageMetadata({
    page: { title: page?.title || slug },
    slug: `about/${slug}`,
  });
}

export default async function AboutDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const page = getLegacySectionSlug("about", slug);
  if (!page) notFound();
  return <RewritePageShell page={page} siblings={getLegacySectionChildren("about")} />;
}
