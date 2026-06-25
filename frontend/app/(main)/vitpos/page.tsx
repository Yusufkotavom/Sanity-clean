import type { Metadata } from "next";
import PageHybridShell from "@/components/hybrid/page-hybrid-shell";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import {
  generateBasicMetadata,
  generatePageMetadata,
} from "@/sanity/lib/metadata";
import VitposMiddleSection from "@/components/hybrid/generated/vitpos-middle-section";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchSanityPageBySlug({ slug: "vitpos" });

  if (page) {
    return generatePageMetadata({
      page,
      slug: "vitpos",
    });
  }

  return generateBasicMetadata({
    title: "Vitpos | Hybrid Landing Page",
    description:
      "Vitpos memakai pola hybrid: block Sanity di atas dan bawah, dengan middle section code-owned yang tetap menjaga struktur halaman utama.",
    slug: "vitpos",
  });
}

export default async function VitposPage() {
  return (
    <PageHybridShell slug="vitpos">
      <VitposMiddleSection />
    </PageHybridShell>
  );
}
