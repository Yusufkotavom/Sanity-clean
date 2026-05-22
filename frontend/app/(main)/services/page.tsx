import ArchiveCategoryFilter from "@/components/ui/archive-category-filter";
import ServiceGrid from "@/components/services/service-grid";
import {
  fetchSanityPageBySlug,
  fetchSanitySeoSettings,
  fetchSanityServiceCategories,
  fetchSanityServices,
} from "@/sanity/lib/fetch";
import {
  generateBasicMetadata,
  generatePageMetadata,
} from "@/sanity/lib/metadata";
import JsonLd from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd } from "@/lib/seo-jsonld";
import PageHybridShell from "@/components/hybrid/page-hybrid-shell";

const SLUG = "services";

export async function generateMetadata() {
  const page = await fetchSanityPageBySlug({ slug: SLUG });
  if (page) {
    return generatePageMetadata({
      page,
      slug: SLUG,
    });
  }

  return await generateBasicMetadata({
    title: "Layanan Digital DEVK STUDIO",
    description: "Jelajahi layanan pembuatan website, software custom, IT support, dan percetakan profesional dari DEVK STUDIO.",
    slug: SLUG,
  });
}

export default async function ServicesPage() {
  const [services, categories, seo] = await Promise.all([
    fetchSanityServices(),
    fetchSanityServiceCategories(),
    fetchSanitySeoSettings(),
  ]);
  const siteUrl = (seo as any)?.siteUrl;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Layanan", path: "/services" },
  ], { siteUrl });

  const allServiceItems = [
    ...(services as any[]).filter((s: any) => s.title && s.slug?.current).map((s: any) => ({
      name: s.title,
      url: `/services/${s.slug.current}`,
    })),
  ];

  const collectionJsonLd = buildCollectionPageJsonLd({
    name: "Layanan Digital – DEVK STUDIO",
    description: "Katalog layanan website, software, IT support, dan percetakan dari DEVK STUDIO.",
    url: "/services",
    siteUrl,
    items: allServiceItems,
  });

  return (
    <PageHybridShell slug={SLUG}>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionJsonLd} />
      <section>
        <div className="container py-16 xl:py-20">
          <div className="mb-10">
            <h1 className="text-4xl font-bold md:text-5xl">Layanan</h1>
            <p className="mt-3 max-w-2xl text-foreground/70">
              Jelajahi layanan IT, website, software, dan percetakan kami serta pilih yang paling sesuai untuk bisnis Anda.
            </p>
            <div className="mt-4">
              <ArchiveCategoryFilter
                currentValue="/services"
                allValue="/services"
                options={categories.map((category: any) => ({
                  label: category.title,
                  value: `/services/${category.slug?.current}`,
                }))}
              />
            </div>
          </div>
          <ServiceGrid services={services as any[]} />
        </div>
      </section>
    </PageHybridShell>
  );
}
