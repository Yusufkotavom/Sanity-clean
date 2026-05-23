import Blocks from "@/components/blocks";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import { generateBasicMetadata, generatePageMetadata } from "@/sanity/lib/metadata";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const page = await fetchSanityPageBySlug({ slug: "index" });
  if (page) {
    return generatePageMetadata({ page, slug: "index" });
  }
  return generateBasicMetadata({ slug: "index" });
}

export default async function IndexPage() {
  const page = await fetchSanityPageBySlug({ slug: "index" });
  if (!page) notFound();

  return <Blocks blocks={page.blocks ?? []} pageTitle={page.title} />;
}
