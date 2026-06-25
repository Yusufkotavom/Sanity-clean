import type { Metadata } from "next";
import PageHybridShell from "@/components/hybrid/page-hybrid-shell";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import {
  generateBasicMetadata,
  generatePageMetadata,
} from "@/sanity/lib/metadata";
import PembuatanWebsiteMiddleSection from "@/components/hybrid/generated/pembuatan-website-middle-section";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchSanityPageBySlug({ slug: "pembuatan-website" });

  if (page) {
    return generatePageMetadata({
      page,
      slug: "pembuatan-website",
    });
  }

  return generateBasicMetadata({
    title: "Pembuatan Website | Hybrid Landing Page",
    description:
      "Pembuatan Website memakai pola hybrid: block Sanity di atas dan bawah, dengan middle section code-owned yang tetap menjaga struktur halaman utama.",
    slug: "pembuatan-website",
  });
}

export default async function PembuatanWebsitePage() {
  return (
    <PageHybridShell slug="pembuatan-website">
      <PembuatanWebsiteMiddleSection />
    </PageHybridShell>
  );
}
