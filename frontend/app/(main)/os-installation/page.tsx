import type { Metadata } from "next";
import PageHybridShell from "@/components/hybrid/page-hybrid-shell";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import {
  generateBasicMetadata,
  generatePageMetadata,
} from "@/sanity/lib/metadata";
import OsInstallationMiddleSection from "@/components/hybrid/generated/os-installation-middle-section";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchSanityPageBySlug({ slug: "os-installation" });

  if (page) {
    return generatePageMetadata({
      page,
      slug: "os-installation",
    });
  }

  return generateBasicMetadata({
    title: "OS Installation | Hybrid Landing Page",
    description:
      "OS Installation memakai pola hybrid: block Sanity di atas dan bawah, dengan middle section code-owned yang tetap menjaga struktur halaman utama.",
    slug: "os-installation",
  });
}

export default async function OsInstallationPage() {
  return (
    <PageHybridShell slug="os-installation">
      <OsInstallationMiddleSection />
    </PageHybridShell>
  );
}
