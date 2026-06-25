import type { Metadata } from "next";
import PageHybridShell from "@/components/hybrid/page-hybrid-shell";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import {
  generateBasicMetadata,
  generatePageMetadata,
} from "@/sanity/lib/metadata";
import AboutMiddleSection from "@/components/hybrid/generated/about-middle-section";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchSanityPageBySlug({ slug: "about" });

  if (page) {
    return generatePageMetadata({
      page,
      slug: "about",
    });
  }

  return generateBasicMetadata({
    title: "About Us | Hybrid Landing Page",
    description:
      "About Us memakai pola hybrid: block Sanity di atas dan bawah, dengan middle section code-owned yang tetap menjaga struktur halaman utama.",
    slug: "about",
  });
}

export default async function AboutPage() {
  return (
    <PageHybridShell slug="about">
      <AboutMiddleSection />
    </PageHybridShell>
  );
}
