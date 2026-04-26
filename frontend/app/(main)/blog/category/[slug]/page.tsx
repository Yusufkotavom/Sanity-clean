import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ArchiveCategoryFilter from "@/components/ui/archive-category-filter";
import PostGrid from "@/components/posts/post-grid";
import {
  fetchSanityCategoryBySlug,
  fetchSanityBlogCategories,
  fetchSanityCategoriesStaticParams,
  fetchSanityPostsByCategorySlug,
  fetchSanitySeoSettings,
} from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import JsonLd from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd } from "@/lib/seo-jsonld";

export async function generateStaticParams() {
  const categories = await fetchSanityCategoriesStaticParams();
  return categories.map((category: any) => ({
    slug: category.slug?.current,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const [category, seo] = await Promise.all([
    fetchSanityCategoryBySlug({ slug: params.slug }),
    fetchSanitySeoSettings(),
  ]);

  if (!category) notFound();

  return await generatePageMetadata({
    page: {
      title: category.title,
      excerpt: category.description,
      meta: {
        ...(category.meta || {}),
        noindex: Boolean(category.meta?.noindex || (seo as any)?.noIndexBlogCategories),
      },
    },
    slug: `blog/category/${params.slug}`,
  });
}

export default async function BlogCategoryDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const [category, seo] = await Promise.all([
    fetchSanityCategoryBySlug({ slug: params.slug }),
    fetchSanitySeoSettings(),
  ]);
  const siteUrl = (seo as any)?.siteUrl;
  if (!category) notFound();

  const categories = await fetchSanityBlogCategories();
  const posts = await fetchSanityPostsByCategorySlug({ slug: params.slug });

  const categoryPath = `/blog/category/${params.slug}`;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: category.title || "Kategori", path: categoryPath },
  ], { siteUrl });

  const collectionJsonLd = buildCollectionPageJsonLd({
    name: `${category.title || "Kategori Blog"} – Kotacom`,
    description: category.description || `Artikel kategori ${category.title || ""} dari tim Kotacom.`,
    url: categoryPath,
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
          <Link
            href="/blog/category"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Kembali ke kategori
          </Link>
          <div className="mt-4">
            <ArchiveCategoryFilter
              currentValue={`/blog/category/${params.slug}`}
              allValue="/blog"
              options={categories.map((item: any) => ({
                label: item.title,
                value: `/blog/category/${item.slug?.current}`,
              }))}
            />
          </div>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">{category.title}</h1>
          {category.description && (
            <p className="mt-3 max-w-2xl text-foreground/70">{category.description}</p>
          )}
        </div>

        <PostGrid posts={posts as any[]} />
      </div>
    </section>
  );
}
