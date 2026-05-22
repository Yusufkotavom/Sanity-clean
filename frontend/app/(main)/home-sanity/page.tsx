import Blocks from "@/components/blocks";
import { fetchSanityPageBySlugBuildOnly } from "@/sanity/lib/fetch";
import { generateBasicMetadata, generatePageMetadata } from "@/sanity/lib/metadata";
import { notFound } from "next/navigation";

const SLUG = "home-sanity";

export async function generateMetadata() {
  const page = await fetchSanityPageBySlugBuildOnly({ slug: SLUG });
  if (page) {
    return generatePageMetadata({ page, slug: SLUG });
  }

  return generateBasicMetadata({
    slug: SLUG,
    title: "DEVK STUDIO — Jasa Pembuatan Software & Website",
    description:
      "Landing page DEVK STUDIO berbasis 100% Sanity blocks untuk jasa pembuatan software custom dan website bisnis.",
  });
}

export default async function HomeSanityPage() {
  const page = await fetchSanityPageBySlugBuildOnly({ slug: SLUG });
  if (!page) notFound();

  return <Blocks blocks={page.blocks ?? []} pageTitle={page.title} />;
}
