import type { Metadata } from "next";
import PageHybridShell from "@/components/hybrid/page-hybrid-shell";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import {
  generateBasicMetadata,
  generatePageMetadata,
} from "@/sanity/lib/metadata";
import SoftwareMiddleSection from "@/components/hybrid/generated/software-middle-section";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchSanityPageBySlug({ slug: "software" });

  if (page) {
    return generatePageMetadata({
      page,
      slug: "software",
    });
  }

  return generateBasicMetadata({
    title: "Software | Hybrid Landing Page",
    description:
      "Software memakai pola hybrid: block Sanity di atas dan bawah, dengan middle section code-owned yang tetap menjaga struktur halaman utama.",
    slug: "software",
  });
}

export default async function SoftwarePage() {
  return (
    <PageHybridShell slug="software">
      <SoftwareMiddleSection />
    </PageHybridShell>
  );
}
