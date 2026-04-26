import Link from "next/link";
import { fetchSanityCategories, fetchSanitySeoSettings } from "@/sanity/lib/fetch";
import { generateBasicMetadata } from "@/sanity/lib/metadata";
import JsonLd from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd } from "@/lib/seo-jsonld";

export async function generateMetadata() {
  const seo = (await fetchSanitySeoSettings()) as
    | { noIndexBlogCategories?: boolean }
    | null;

  return await generateBasicMetadata({
    title: "Kategori Blog – Kotacom",
    description: "Jelajahi artikel blog Kotacom berdasarkan kategori: website, software, percetakan, teknologi, dan panduan bisnis IT.",
    slug: "blog/category",
    noindex: Boolean(seo?.noIndexBlogCategories),
  });
}

export default async function BlogCategoriesPage() {
  const [categories, seo] = await Promise.all([
    fetchSanityCategories(),
    fetchSanitySeoSettings(),
  ]);
  const siteUrl = (seo as any)?.siteUrl;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Kategori", path: "/blog/category" },
  ], { siteUrl });

  const collectionJsonLd = buildCollectionPageJsonLd({
    name: "Kategori Blog – Kotacom",
    description: "Daftar kategori artikel blog seputar IT, website, software, dan percetakan dari Kotacom.",
    url: "/blog/category",
    siteUrl,
    items: (categories as any[])
      .filter((c: any) => c.title && c.slug?.current)
      .map((c: any) => ({
        name: c.title,
        url: `/blog/category/${c.slug.current}`,
      })),
  });

  return (
    <section>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionJsonLd} />
      <div className="container py-16 xl:py-20">
        <div className="mb-10">
          <h1 className="text-4xl font-bold md:text-5xl">Kategori</h1>
          <p className="mt-3 max-w-2xl text-foreground/70">
            Pilih kategori untuk melihat artikel seputar IT, website, software, dan percetakan dari Kotacom.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(categories as any[]).map((category: any) => (
            <Link
              key={category._id}
              href={`/blog/category/${category.slug?.current}`}
              className="rounded-2xl border p-5 transition hover:border-primary"
            >
              <h2 className="text-xl font-semibold">{category.title}</h2>
              {category.description && (
                <p className="mt-2 text-sm text-foreground/70">{category.description}</p>
              )}
              <p className="mt-3 text-sm text-foreground/60">
                {category.postCount || 0} artikel
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
