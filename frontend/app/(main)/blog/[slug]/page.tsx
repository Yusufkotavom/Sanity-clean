import { notFound } from "next/navigation";
import Blocks from "@/components/blocks";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PostHero from "@/components/blocks/post-hero";
import PortableTextRenderer from "@/components/portable-text-renderer";
import BlogTableOfContents from "@/components/ui/blog-table-of-contents";
import TaxonomyBadgeList from "@/components/ui/taxonomy-badge-list";
import GlobalWhatsAppPanel from "@/components/global-whatsapp-panel";
import { extractTableOfContents } from "@/lib/table-of-contents";
import {
  fetchSanityPostBySlug,
  fetchSanityPostsStaticParams,
  fetchSanitySeoSettings,
} from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import JsonLd from "@/components/seo/json-ld";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildAffiliateItemJsonLd,
} from "@/lib/seo-jsonld";
import AffiliateProductCard from "@/components/ui/affiliate-product-card";
import StarRating from "@/components/ui/star-rating";

type BreadcrumbLink = {
  label: string;
  href: string;
};

export async function generateStaticParams() {
  const posts = await fetchSanityPostsStaticParams();

  return posts.map((post) => ({
    slug: post.slug?.current,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = await fetchSanityPostBySlug({ slug: params.slug });

  if (!post) {
    notFound();
  }

  return await generatePageMetadata({
    page: post,
    slug: `blog/${params.slug}`,
    pageType: "article",
  });
}

export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const [post, seo] = await Promise.all([
    fetchSanityPostBySlug(params),
    fetchSanitySeoSettings(),
  ]);
  const siteUrl = (seo as any)?.siteUrl;

  if (!post) {
    notFound();
  }

  const links: BreadcrumbLink[] = post
    ? [
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Blog",
          href: "/blog",
        },
        {
          label: post.title as string,
          href: "#",
        },
      ]
    : [];

  const tocItems = extractTableOfContents(post.body);
  const headingIdMap = Object.fromEntries(
    tocItems.map((item) => [item.key, item.id]),
  );
  const postPath = `/blog/${params.slug}`;
  const postExcerpt = (post as any)?.excerpt;
  const articleJsonLd = buildArticleJsonLd({
    title: post.title || "",
    description: post.meta?.description || postExcerpt,
    path: postPath,
    image: post.meta?.image || post.image,
    datePublished: post._createdAt || undefined,
    dateModified: post._updatedAt || undefined,
    authorName: post.author?.name || undefined,
    siteUrl,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title || "Post", path: postPath },
  ], { siteUrl });

  // Auto-detect affiliate items
  const affiliateItems = (post as any)?.affiliateItems || [];

  return (
    <section>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {/* Auto-detected affiliate/review JSON-LD */}
      {affiliateItems.length > 1 && (
        <JsonLd data={buildItemListJsonLd(affiliateItems, post.title || undefined, { siteUrl })} />
      )}
      {affiliateItems.length === 1 && (
        <JsonLd data={buildAffiliateItemJsonLd(affiliateItems[0])} />
      )}
      <div className="container py-16 xl:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="max-w-3xl">
            <Breadcrumbs links={links} />
            <PostHero {...post} />
            <TaxonomyBadgeList
              items={(post as any)?.categories}
              baseHref="/blog/category"
              className="mb-6"
            />
            <BlogTableOfContents items={tocItems} variant="mobile" />
            {post.body && (
              <PortableTextRenderer value={post.body} headingIdMap={headingIdMap} />
            )}

            {/* Sanity Page Blocks */}
            {(post as any)?.blocks?.length > 0 && (
              <div className="mt-10">
                <Blocks blocks={(post as any).blocks} pageTitle={post.title} />
              </div>
            )}

            {/* Affiliate Items Section (auto-detected) */}
            {affiliateItems.length > 0 && (
              <div className="mt-10 border-t border-border/40 pt-8">
                <h2 className="mb-6 text-2xl font-bold">
                  {affiliateItems.length === 1
                    ? `Review: ${affiliateItems[0].name}`
                    : `${affiliateItems.length} Item yang Direkomendasikan`}
                </h2>
                {(post as any).overallRating && (
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground/70">Rating Keseluruhan:</span>
                    <StarRating rating={(post as any).overallRating} size="md" />
                  </div>
                )}
                <div className={affiliateItems.length > 1 ? "grid gap-6 sm:grid-cols-2" : ""}>
                  {affiliateItems.map((item: any, idx: number) => (
                    <AffiliateProductCard key={item._key || idx} item={item} />
                  ))}
                </div>
                {(post as any).verdict && (
                  <div className="mt-6 rounded-xl bg-muted/50 p-5">
                    <h3 className="mb-2 font-semibold">Kesimpulan</h3>
                    <p className="text-foreground/80">{(post as any).verdict}</p>
                  </div>
                )}
              </div>
            )}

            <GlobalWhatsAppPanel
              title="Butuh bantuan menerapkan insight ini?"
              description="Bahas kebutuhan bisnis Anda via WhatsApp. Tim kami bisa bantu menjembatani insight dari artikel ini menjadi langkah implementasi yang lebih konkret."
              secondaryHref="/services"
              secondaryLabel="Lihat Layanan"
            />
          </article>
          <BlogTableOfContents items={tocItems} variant="desktop" />
        </div>
      </div>
    </section>
  );
}
