import Blocks from "@/components/blocks";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { notFound } from "next/navigation";

const SLUG = "about";

export async function generateMetadata() {
  const page = await fetchSanityPageBySlug({ slug: SLUG });
  if (page) return generatePageMetadata({ page, slug: SLUG });
  return generatePageMetadata({ page: { title: "Tentang Kami" }, slug: SLUG });
}

export default async function AboutPage() {
  const page = await fetchSanityPageBySlug({ slug: SLUG });
  if (page) return <Blocks blocks={page?.blocks ?? []} pageTitle={page.title} />;

  notFound();
}
