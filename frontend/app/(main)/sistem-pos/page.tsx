import Blocks from "@/components/blocks";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const page = await fetchSanityPageBySlug({ slug: "sistem-pos" });
  if (page) return generatePageMetadata({ page, slug: "sistem-pos" });
  return generatePageMetadata({ page: { title: "Sistem POS" }, slug: "sistem-pos" });
}

export default async function SistemPosPage() {
  const page = await fetchSanityPageBySlug({ slug: "sistem-pos" });
  if (page) return <Blocks blocks={page?.blocks ?? []} pageTitle={page.title} />;

  notFound();
}
