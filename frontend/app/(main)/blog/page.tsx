import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ArchiveCategoryFilter from "@/components/ui/archive-category-filter";
import PostGrid from "@/components/posts/post-grid";
import { fetchSanityBlogCategories, fetchSanityPosts, fetchSanitySeoSettings } from "@/sanity/lib/fetch";
import { generateBasicMetadata } from "@/sanity/lib/metadata";
import JsonLd from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd } from "@/lib/seo-jsonld";

export async function generateMetadata() {
  return await generateBasicMetadata({
    title: "Blog & Artikel IT",
    description:
      "Baca artikel, tips, dan panduan terbaru seputar teknologi, pengembangan website, software, dan percetakan dari tim Kotacom.",
    slug: "blog",
  });
}

export default async function BlogPage() {
  const [posts, categories, seo] = await Promise.all([
    fetchSanityPosts(),
    fetchSanityBlogCategories(),
    fetchSanitySeoSettings(),
  ]);
  const siteUrl = (seo as any)?.siteUrl;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ], { siteUrl });

  const collectionJsonLd = buildCollectionPageJsonLd({
    name: "Blog & Artikel IT – Kotacom",
    description:
      "Kumpulan artikel teknologi, tips IT, panduan website, software, dan percetakan dari tim Kotacom.",
    url: "/blog",
    siteUrl,
    items: (posts as any[])
      .filter((p: any) => p.title && p.slug?.current)
      .map((p: any) => ({
        name: p.title,
        url: `/blog/${p.slug.current}`,
      })),
  });

  return (
    <section>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionJsonLd} />
      <div className="container py-16 xl:py-20">
        <div className="mb-10">
          <h1 className="text-4xl font-bold md:text-5xl">Blog</h1>
          <p className="mt-3 max-w-2xl text-foreground/70">
            Artikel, tips, dan panduan seputar web, software, dan percetakan dari tim Kotacom.
          </p>
          <Link
            href="/blog/category"
            className={cn(buttonVariants({ variant: "outline" }), "mt-4")}
          >
            Lihat berdasarkan kategori
          </Link>
          <div className="mt-4">
            <ArchiveCategoryFilter
              currentValue="/blog"
              allValue="/blog"
              options={categories.map((category: any) => ({
                label: category.title,
                value: `/blog/category/${category.slug?.current}`,
              }))}
            />
          </div>
        </div>

        <PostGrid posts={posts} />
      </div>
    </section>
  );
}
