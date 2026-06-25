import type { Metadata } from "next";
import PageHybridShell from "@/components/hybrid/page-hybrid-shell";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import {
  generateBasicMetadata,
  generatePageMetadata,
} from "@/sanity/lib/metadata";
import ContactMiddleSection from "@/components/hybrid/generated/contact-middle-section";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchSanityPageBySlug({ slug: "contact" });

  if (page) {
    return generatePageMetadata({
      page,
      slug: "contact",
    });
  }

  return generateBasicMetadata({
    title: "Contact Us | Hybrid Landing Page",
    description:
      "Contact Us memakai pola hybrid: block Sanity di atas dan bawah, dengan middle section code-owned yang tetap menjaga struktur halaman utama.",
    slug: "contact",
  });
}

export default async function ContactPage() {
  return (
    <PageHybridShell slug="contact">
      <ContactMiddleSection />
    </PageHybridShell>
  );
}
