import type { Metadata } from "next";
import PageHybridShell from "@/components/hybrid/page-hybrid-shell";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import {
  generateBasicMetadata,
  generatePageMetadata,
} from "@/sanity/lib/metadata";
import PercetakanMiddleSection from "@/components/hybrid/generated/percetakan-middle-section";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchSanityPageBySlug({ slug: "percetakan" });

  if (page) {
    return generatePageMetadata({
      page,
      slug: "percetakan",
    });
  }

  return generateBasicMetadata({
    title: "Percetakan | Hybrid Landing Page",
    description:
      "Percetakan memakai pola hybrid: block Sanity di atas dan bawah, dengan middle section code-owned yang tetap menjaga struktur halaman utama.",
    slug: "percetakan",
  });
}

export default async function PercetakanPage() {
  return (
    <PageHybridShell slug="percetakan">
      <PercetakanMiddleSection />
    </PageHybridShell>
  );
}
