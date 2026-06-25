import type { Metadata } from "next";
import PageHybridShell from "@/components/hybrid/page-hybrid-shell";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import {
  generateBasicMetadata,
  generatePageMetadata,
} from "@/sanity/lib/metadata";
import BugFixesMiddleSection from "@/components/hybrid/generated/bug-fixes-middle-section";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchSanityPageBySlug({ slug: "bug-fixes" });

  if (page) {
    return generatePageMetadata({
      page,
      slug: "bug-fixes",
    });
  }

  return generateBasicMetadata({
    title: "Bug Fixes | Hybrid Landing Page",
    description:
      "Bug Fixes memakai pola hybrid: block Sanity di atas dan bawah, dengan middle section code-owned yang tetap menjaga struktur halaman utama.",
    slug: "bug-fixes",
  });
}

export default async function BugFixesPage() {
  return (
    <PageHybridShell slug="bug-fixes">
      <BugFixesMiddleSection />
    </PageHybridShell>
  );
}
