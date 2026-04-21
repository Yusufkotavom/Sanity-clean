import { notFound } from "next/navigation";
import Blocks from "@/components/blocks";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/sanity/lib/image";
import ArchiveCategoryFilter from "@/components/ui/archive-category-filter";
import ServiceGrid from "@/components/services/service-grid";
import InlineMetaList from "@/components/ui/inline-meta-list";
import TaxonomyBadgeList from "@/components/ui/taxonomy-badge-list";
import GlobalWhatsAppPanel from "@/components/global-whatsapp-panel";
import GlobalWhatsAppButton from "@/components/global-whatsapp-button";
import {
  fetchSanityCategoryBySlug,
  fetchSanitySeoSettings,
  fetchSanityServiceBySlug,
  fetchSanityServiceCategories,
  fetchSanityServicesByCategorySlug,
  fetchSanityServicesStaticParams,
} from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import JsonLd from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, buildServiceJsonLd, resolveAggregateRating } from "@/lib/seo-jsonld";
import ReviewsSection from "@/components/ui/reviews-section";

type BreadcrumbLink = {
  label: string;
  href: string;
};

export async function generateStaticParams() {
  const [services, categories] = await Promise.all([
    fetchSanityServicesStaticParams(),
    fetchSanityServiceCategories(),
  ]);

  const slugs = new Set<string>();

  for (const service of services as any[]) {
    if (service?.slug?.current) slugs.add(service.slug.current);
  }
  for (const category of categories as any[]) {
    if (category?.slug?.current) slugs.add(category.slug.current);
  }
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const [categories, service, seo] = await Promise.all([
    fetchSanityServiceCategories(),
    fetchSanityServiceBySlug({ slug: params.slug }),
    fetchSanitySeoSettings(),
  ]);

  const isServiceCategory = (categories as any[]).some(
    (item) => item?.slug?.current === params.slug,
  );

  if (isServiceCategory) {
    const category = await fetchSanityCategoryBySlug({ slug: params.slug });
    if (!category) notFound();
    return await generatePageMetadata({
      page: {
        title: `${category.title} | Service Category`,
        excerpt: category.description || `Services in ${category.title}`,
        meta: {
          ...(category.meta || {}),
          noindex: Boolean(category.meta?.noindex || (seo as any)?.noIndexServiceCategories),
        },
      },
      slug: `services/${params.slug}`,
    });
  }

  if (service) {
    return await generatePageMetadata({ page: service, slug: `services/${params.slug}` });
  }

  notFound();
}

export default async function ServiceSlugPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const [categories, service] = await Promise.all([
    fetchSanityServiceCategories(),
    fetchSanityServiceBySlug({ slug: params.slug }),
  ]);

  const isServiceCategory = (categories as any[]).some(
    (item) => item?.slug?.current === params.slug,
  );

  if (isServiceCategory) {
    const [category, services] = await Promise.all([
      fetchSanityCategoryBySlug({ slug: params.slug }),
      fetchSanityServicesByCategorySlug({ slug: params.slug }),
    ]);
    if (!category) notFound();

    const categoryPath = `/services/${params.slug}`;
    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: category.title || "Category", path: categoryPath },
    ]);

    return (
      <section>
        <JsonLd data={breadcrumbJsonLd} />
        <div className="container py-16 xl:py-20">
          <div className="mb-10">
            <h1 className="text-4xl font-bold md:text-5xl">{category.title}</h1>
            {category.description && (
              <p className="mt-3 max-w-2xl text-foreground/70">{category.description}</p>
            )}
            <div className="mt-4">
              <ArchiveCategoryFilter
                currentValue={`/services/${params.slug}`}
                allValue="/services"
                options={(categories as any[]).map((item: any) => ({
                  label: item.title,
                  value: `/services/${item.slug?.current}`,
                }))}
              />
            </div>
          </div>
          <ServiceGrid services={services as any[]} />
        </div>
      </section>
    );
  }

  if (!service) {
    notFound();
  }

  const links: BreadcrumbLink[] = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: service.title as string, href: "#" },
  ];
  const servicePath = `/services/${params.slug}`;
  const seo = await fetchSanitySeoSettings();
  const resolvedRating = resolveAggregateRating(
    service.aggregateRating,
    service.reviews,
    (seo as any)?.defaultAggregateRating,
  );
  const serviceJsonLd = buildServiceJsonLd({
    title: service.title || "",
    description: service.meta?.description || service.excerpt,
    path: servicePath,
    image: service.meta?.image || service.image,
    startingPrice: service.startingPrice,
    currency: service.currency,
    aggregateRating: resolvedRating,
    reviews: service.reviews,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.title || "Service", path: servicePath },
  ]);

  return (
    <section>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <div className="container py-16 xl:py-20">
        <article className="mx-auto max-w-4xl">
          <Breadcrumbs links={links} />
          <h1 className="mb-4 text-3xl lg:text-5xl">{service.title}</h1>
          {service.excerpt && (
            <p className="mb-6 text-lg text-foreground/75">{service.excerpt}</p>
          )}
          {service.image?.asset?._id && (
            <div className="mb-6 overflow-hidden rounded-2xl">
              <Image
                src={urlFor(service.image).width(960).quality(75).url()}
                alt={service.image.alt || ""}
                width={service.image.asset?.metadata?.dimensions?.width || 1200}
                height={service.image.asset?.metadata?.dimensions?.height || 720}
                placeholder={service.image?.asset?.metadata?.lqip ? "blur" : undefined}
                blurDataURL={service.image?.asset?.metadata?.lqip || ""}
                quality={75}
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
              />
            </div>
          )}
          <InlineMetaList
            className="mb-6"
            items={[
              service.duration,
              typeof service.startingPrice === "number"
                ? `From ${service.currency || "IDR"} ${service.startingPrice}`
                : undefined,
            ]}
          />
          <TaxonomyBadgeList
            items={service.categories}
            baseHref="/services"
            className="mb-6"
          />

          {Array.isArray(service.deliverables) && service.deliverables.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-xl font-semibold">Deliverables</h2>
              <ul className="list-disc space-y-2 pl-6 text-foreground/80">
                {service.deliverables.map((item: string, idx: number) => (
                  <li key={`${item}-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {service.body && <PortableTextRenderer value={service.body} />}

          {/* Sanity Page Blocks */}
          {(service as any)?.blocks?.length > 0 && (
            <div className="mt-10">
              <Blocks blocks={(service as any).blocks} pageTitle={service.title} />
            </div>
          )}
          <GlobalWhatsAppPanel
            title={`Diskusikan ${service.title} via WhatsApp`}
            description="Jelaskan kebutuhan, target, dan kendala utama Anda. Tim kami akan bantu mengarahkan scope, estimasi, dan langkah implementasi yang paling masuk akal."
            secondaryHref={service.cta?.href || undefined}
            secondaryLabel={service.cta?.title || undefined}
          />
          {service.cta?.href ? (
            <div className="mt-4">
              <GlobalWhatsAppButton
                fallbackHref={service.cta.href}
                fallbackLabel={service.cta.title || "Konsultasi via WhatsApp"}
              />
            </div>
          ) : null}
        </article>

        {/* Reviews Section */}
        <div className="mx-auto max-w-4xl">
          <ReviewsSection
            reviews={service.reviews || []}
            aggregateRating={resolvedRating}
          />
        </div>
      </div>
    </section>
  );
}
