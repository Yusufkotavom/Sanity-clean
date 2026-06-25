import type { Metadata } from "next";
import PageHybridShell from "@/components/hybrid/page-hybrid-shell";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import {
  generateBasicMetadata,
  generatePageMetadata,
} from "@/sanity/lib/metadata";
import SistemPosMiddleSection from "@/components/hybrid/generated/sistem-pos-middle-section";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchSanityPageBySlug({ slug: "sistem-pos" });

  if (page) {
    return generatePageMetadata({
      page,
      slug: "sistem-pos",
    });
  }

  return generateBasicMetadata({
    title: "Sistem Pos | Hybrid Landing Page",
    description:
      "Sistem Pos memakai pola hybrid: block Sanity di atas dan bawah, dengan middle section code-owned yang tetap menjaga struktur halaman utama.",
    slug: "sistem-pos",
  });
}

export default async function SistemPosPage() {
  return (
    <PageHybridShell slug="sistem-pos">
      <SistemPosMiddleSection />
    </PageHybridShell>
  );
}
