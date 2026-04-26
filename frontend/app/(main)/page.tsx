import type { Metadata } from "next";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import { generateBasicMetadata } from "@/sanity/lib/metadata";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import PageHybridShell from "@/components/hybrid/page-hybrid-shell";
import HomePeparMiddleSection from "@/components/hybrid/generated/home-pepar-middle-section";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchSanityPageBySlug({ slug: "index" });

  if (page) {
    return generatePageMetadata({
      page,
      slug: "index",
    });
  }

  return generateBasicMetadata({ slug: "index" });
}

export default async function IndexPage() {
  return (
    <PageHybridShell slug="index">
      <HomePeparMiddleSection />
    </PageHybridShell>
  );
}
