import { notFound } from "next/navigation";
import Blocks from "@/components/blocks";
import Image from "next/image";
import Link from "next/link";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/sanity/lib/image";
import ArchiveCategoryFilter from "@/components/ui/archive-category-filter";
import ProductGrid from "@/components/products/product-grid";
import InlineMetaList from "@/components/ui/inline-meta-list";
import TaxonomyBadgeList from "@/components/ui/taxonomy-badge-list";
import GlobalWhatsAppButton from "@/components/global-whatsapp-button";
import GlobalWhatsAppPanel from "@/components/global-whatsapp-panel";
import AffiliateLinks from "@/components/ui/affiliate-links";
import {
  fetchSanityCategoryBySlug,
  fetchSanityProductBySlug,
  fetchSanityProductCategories,
  fetchSanityProductsByCategorySlug,
  fetchSanityProductsStaticParams,
  fetchSanityRelatedProducts,
  fetchSanitySeoSettings,
  fetchSanityProducts,
} from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import JsonLd from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, buildProductJsonLd, resolveAggregateRating } from "@/lib/seo-jsonld";
import ReviewsSection from "@/components/ui/reviews-section";

type BreadcrumbLink = {
  label: string;
  href: string;
};

export async function generateStaticParams() {
  const [products, categories] = await Promise.all([
    fetchSanityProductsStaticParams(),
    fetchSanityProductCategories(),
  ]);

  const slugs = new Set<string>();

  for (const product of products as any[]) {
    if (product?.slug?.current) slugs.add(product.slug.current);
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
  const [categories, product, seo] = await Promise.all([
    fetchSanityProductCategories(),
    fetchSanityProductBySlug({ slug: params.slug }),
    fetchSanitySeoSettings(),
  ]);

  const isProductCategory = (categories as any[]).some(
    (item) => item?.slug?.current === params.slug,
  );

  if (isProductCategory) {
    const category = await fetchSanityCategoryBySlug({ slug: params.slug });
    if (!category) notFound();
    return await generatePageMetadata({
      page: {
        title: `${category.title} | Product Category`,
        excerpt: category.description || `Products in ${category.title}`,
        meta: {
          ...(category.meta || {}),
          noindex: Boolean(category.meta?.noindex || (seo as any)?.noIndexProductCategories),
        },
      },
      slug: `products/${params.slug}`,
    });
  }

  if (!product) notFound();
  return await generatePageMetadata({ page: product, slug: `products/${params.slug}` });
}

export default async function ProductSlugPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const [categories, product, seo] = await Promise.all([
    fetchSanityProductCategories(),
    fetchSanityProductBySlug({ slug: params.slug }),
    fetchSanitySeoSettings(),
  ]);
  const siteUrl = (seo as any)?.siteUrl;

  const isProductCategory = (categories as any[]).some(
    (item) => item?.slug?.current === params.slug,
  );

  if (isProductCategory) {
    const [category, products] = await Promise.all([
      fetchSanityCategoryBySlug({ slug: params.slug }),
      fetchSanityProductsByCategorySlug({ slug: params.slug }),
    ]);
    if (!category) notFound();

    const categoryPath = `/products/${params.slug}`;
    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: category.title || "Category", path: categoryPath },
    ], { siteUrl });

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
                currentValue={`/products/${params.slug}`}
                allValue="/products"
                options={(categories as any[]).map((item: any) => ({
                  label: item.title,
                  value: `/products/${item.slug?.current}`,
                }))}
              />
            </div>
          </div>
          <ProductGrid products={products as any[]} />
        </div>
      </section>
    );
  }

  if (!product) notFound();

  const categoryIds = (product.categories || [])
    .map((cat: any) => cat?._id)
    .filter(Boolean);

  let relatedProducts = categoryIds.length > 0
    ? await fetchSanityRelatedProducts({
        slug: params.slug,
        categoryIds,
      })
    : [];

  if (relatedProducts.length < 4) {
    const allProducts = await fetchSanityProducts();
    const existingIds = new Set([product._id, ...relatedProducts.map((p: any) => p._id)]);
    const fallbackPool = allProducts.filter((p: any) => p._id !== product._id && !existingIds.has(p._id));
    
    // Shuffle the fallback pool
    for (let i = fallbackPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fallbackPool[i], fallbackPool[j]] = [fallbackPool[j], fallbackPool[i]];
    }

    const needed = 4 - relatedProducts.length;
    relatedProducts = [...relatedProducts, ...fallbackPool.slice(0, needed)];
  }

  const links: BreadcrumbLink[] = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: product.title as string, href: "#" },
  ];
  const productPath = `/products/${params.slug}`;
  const resolvedRating = resolveAggregateRating(
    product.aggregateRating,
    product.reviews,
    (seo as any)?.defaultAggregateRating,
  );
  const productJsonLd = buildProductJsonLd({
    title: product.title || "",
    description: product.meta?.description || product.excerpt,
    path: productPath,
    image: product.meta?.image || product.image,
    price: product.price,
    currency: product.currency,
    availability: product.availability,
    aggregateRating: resolvedRating,
    reviews: product.reviews,
    siteUrl,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: product.title || "Product", path: productPath },
  ], { siteUrl });

  return (
    <section>
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <div className="container py-16 xl:py-20">
        <article className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-3xl lg:text-5xl">{product.title}</h1>
          {product.excerpt && (
            <p className="mb-6 text-lg text-foreground/75">{product.excerpt}</p>
          )}
          {product.image?.asset?._id && (
            <div className="mb-6 overflow-hidden rounded-2xl">
              <Image
                src={urlFor(product.image).width(960).quality(75).url()}
                alt={product.image.alt || ""}
                width={product.image.asset?.metadata?.dimensions?.width || 1200}
                height={product.image.asset?.metadata?.dimensions?.height || 720}
                placeholder={product.image?.asset?.metadata?.lqip ? "blur" : undefined}
                blurDataURL={product.image?.asset?.metadata?.lqip || ""}
                quality={75}
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
              />
            </div>
          )}
          <InlineMetaList
            className="mb-6"
            items={[
              typeof product.price === "number"
                ? `${product.currency || "IDR"} ${product.price}`
                : undefined,
              product.availability,
            ]}
          />
          {(product as any).affiliateLinks?.length > 0 && (
            <div className="mb-6">
              <AffiliateLinks links={(product as any).affiliateLinks} />
            </div>
          )}
          <TaxonomyBadgeList
            items={product.categories}
            baseHref="/products"
            className="mb-6"
          />

          {product.body && <PortableTextRenderer value={product.body} />}

          {/* Sanity Page Blocks */}
          {(product as any)?.blocks?.length > 0 && (
            <div className="mt-10">
              <Blocks blocks={(product as any).blocks} pageTitle={product.title} />
            </div>
          )}
          <GlobalWhatsAppPanel
            title={`Tanya detail ${product.title} via WhatsApp`}
            description="Cocok untuk cek ketersediaan, harga terbaru, kebutuhan custom, atau rekomendasi produk sebelum Anda ambil keputusan."
            secondaryHref={product.cta?.href || undefined}
            secondaryLabel={product.cta?.title || undefined}
            predefinedText={`Halo, saya tertarik dengan produk *${product.title}*. Boleh minta info detail dan harganya?`}
            sourceUrl={productPath}
          />
          {product.cta?.href ? (
            <div className="mt-4">
              <GlobalWhatsAppButton
                fallbackHref={product.cta.href}
                fallbackLabel={product.cta.title || "Tanya Produk"}
                predefinedText={`Halo, saya tertarik dengan produk *${product.title}*.`}
                sourceUrl={productPath}
              />
            </div>
          ) : null}
        </article>

        {relatedProducts.length > 0 && (
          <div className="mx-auto mt-16 max-w-6xl">
            <h2 className="mb-6 text-2xl font-bold lg:text-3xl">Produk Terkait</h2>
            <ProductGrid products={relatedProducts} initialCount={4} step={4} />
          </div>
        )}

        {/* Reviews Section */}
        <div className="mx-auto max-w-4xl">
          <ReviewsSection
            reviews={product.reviews || []}
            aggregateRating={resolvedRating}
          />
        </div>
      </div>
    </section>
  );
}
