import Blocks from "@/components/blocks";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const page = await fetchSanityPageBySlug({ slug: "privacy" });
  if (page) return generatePageMetadata({ page, slug: "privacy" });
  return generatePageMetadata({ page: { title: "Kebijakan Privasi" }, slug: "privacy" });
}

export default async function PrivacyPage() {
  const page = await fetchSanityPageBySlug({ slug: "privacy" });
  if (page) return <Blocks blocks={page?.blocks ?? []} pageTitle={page.title} />;

  notFound();
}
