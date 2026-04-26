import ArchiveCategoryFilter from "@/components/ui/archive-category-filter";
import ProductGrid from "@/components/products/product-grid";
import {
  fetchSanityProductCategories,
  fetchSanityProducts,
  fetchSanitySeoSettings,
} from "@/sanity/lib/fetch";
import { generateBasicMetadata } from "@/sanity/lib/metadata";
import JsonLd from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd } from "@/lib/seo-jsonld";

export async function generateMetadata() {
  return await generateBasicMetadata({
    title: "Produk IT & Percetakan Kotacom",
    description:
      "Temukan produk-produk IT, perlengkapan kantor, dan hasil percetakan berkualitas dari Kotacom Surabaya. Harga transparan, pengiriman nasional.",
    slug: "products",
  });
}

export default async function ProductsPage() {
  const [products, categories, seo] = await Promise.all([
    fetchSanityProducts(),
    fetchSanityProductCategories(),
    fetchSanitySeoSettings(),
  ]);
  const siteUrl = (seo as any)?.siteUrl;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Produk", path: "/products" },
  ], { siteUrl });

  const collectionJsonLd = buildCollectionPageJsonLd({
    name: "Produk IT & Percetakan – Kotacom",
    description:
      "Katalog produk IT, perlengkapan kantor, dan percetakan dari Kotacom Surabaya.",
    url: "/products",
    siteUrl,
    items: (products as any[])
      .filter((p: any) => p.title && p.slug?.current)
      .map((p: any) => ({
        name: p.title,
        url: `/products/${p.slug.current}`,
      })),
  });

  return (
    <section>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionJsonLd} />
      <div className="container py-16 xl:py-20">
        <div className="mb-10">
          <h1 className="text-4xl font-bold md:text-5xl">Produk</h1>
          <p className="mt-3 max-w-2xl text-foreground/70">
            Jelajahi produk IT, perlengkapan kantor, dan percetakan pilihan kami lengkap dengan detail dan harga terbaru.
          </p>
          <div className="mt-4">
            <ArchiveCategoryFilter
              currentValue="/products"
              allValue="/products"
              options={categories.map((category: any) => ({
                label: category.title,
                value: `/products/${category.slug?.current}`,
              }))}
            />
          </div>
        </div>
        <ProductGrid products={products as any[]} />
      </div>
    </section>
  );
}
