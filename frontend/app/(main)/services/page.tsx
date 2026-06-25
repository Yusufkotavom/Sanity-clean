import type { Metadata } from "next";
import PageHybridShell from "@/components/hybrid/page-hybrid-shell";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import {
  generateBasicMetadata,
  generatePageMetadata,
} from "@/sanity/lib/metadata";
import ServicesMiddleSection from "@/components/hybrid/generated/services-middle-section";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchSanityPageBySlug({ slug: "services" });

  if (page) {
    return generatePageMetadata({
      page,
      slug: "services",
    });
  }

  return generateBasicMetadata({
    title: "Layanan Kami | Hybrid Landing Page",
    description:
      "Layanan Kami memakai pola hybrid: block Sanity di atas dan bawah, dengan middle section code-owned yang tetap menjaga struktur halaman utama.",
    slug: "services",
  });
}

export default async function ServicesPage() {
  return (
    <PageHybridShell slug="services">
      <ServicesMiddleSection />
    </PageHybridShell>
  );
}
