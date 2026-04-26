import { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { fetchSanitySeoSettings } from "@/sanity/lib/fetch";

type SitemapItem = {
  _type: "page" | "post" | "product" | "service" | "project";
  slug?: { current?: string | null } | null;
  _updatedAt?: string;
};

type TemplateSitemapItem = {
  route?: string | null;
  _updatedAt?: string;
};

type CategorySitemapItem = {
  slug?: { current?: string | null } | null;
  _updatedAt?: string;
  postCount?: number;
  productCount?: number;
  serviceCount?: number;
};

const CONTENT_SITEMAP_QUERY = groq`
  *[
    _type in ["page", "post", "product", "service", "project"]
    && meta.noindex != true
    && defined(slug.current)
  ]{
    _type,
    slug,
    _updatedAt
  }
`;

const CATEGORY_SITEMAP_QUERY = groq`
  *[
    _type == "category"
    && meta.noindex != true
    && defined(slug.current)
  ]{
    slug,
    _updatedAt,
    "postCount": count(*[_type == "post" && references(^._id)]),
    "productCount": count(*[_type == "product" && references(^._id)]),
    "serviceCount": count(*[_type == "service" && references(^._id)])
  }
`;

const TEMPLATE_SITEMAP_QUERY = groq`
  *[
    _type in ["pageLocation", "serviceLocation"]
    && meta.noindex != true
    && defined(route)
  ]{
    route,
    _updatedAt
  }
`;

function makeAbsoluteUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

function mapContentPath(item: SitemapItem): string | null {
  const slug = item.slug?.current;
  if (!slug) return null;
  if (item._type === "page") return slug === "index" ? "/" : `/${slug}`;
  if (item._type === "post") return `/blog/${slug}`;
  if (item._type === "product") return `/products/${slug}`;
  if (item._type === "service") return `/services/${slug}`;
  if (item._type === "project") return `/projects/${slug}`;
  return null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = (await fetchSanitySeoSettings()) as
    | {
        defaultNoIndex?: boolean;
        siteUrl?: string;
        noIndexBlogCategories?: boolean;
        noIndexProductCategories?: boolean;
        noIndexServiceCategories?: boolean;
        sitemapStaticRoutes?: string[] | null;
        includeTemplateRoutesInSitemap?: boolean;
      }
    | null;
  const baseUrl = seo?.siteUrl?.trim()?.replace(/\/+$/, "") || "";
  if (!baseUrl) return [];

  if (seo?.defaultNoIndex) return [];

  const [
    { data: contentData }, 
    { data: categoryData },
    { data: templateData },
  ] = await Promise.all([
    sanityFetch({ query: CONTENT_SITEMAP_QUERY }),
    sanityFetch({ query: CATEGORY_SITEMAP_QUERY }),
    sanityFetch({ query: TEMPLATE_SITEMAP_QUERY }),
  ]);

  const contentItems = (contentData || []) as SitemapItem[];
  const categoryItems = (categoryData || []) as CategorySitemapItem[];
  const templateItems = (templateData || []) as TemplateSitemapItem[];

  const entries: MetadataRoute.Sitemap = [];
  const addedUrls = new Set<string>();

  const addEntry = (entry: MetadataRoute.Sitemap[number]) => {
    if (!addedUrls.has(entry.url)) {
      addedUrls.add(entry.url);
      entries.push(entry);
    }
  };

  for (const item of contentItems) {
    const path = mapContentPath(item);
    if (!path) continue;
    addEntry({
      url: makeAbsoluteUrl(baseUrl, path),
      lastModified: item._updatedAt || undefined,
      changeFrequency: item._type === "page" ? "daily" : "weekly",
      priority: item._type === "page" && item.slug?.current === "index" ? 1 : 0.7,
    });
  }

  for (const category of categoryItems) {
    const slug = category.slug?.current;
    if (!slug) continue;

    if ((category.postCount || 0) > 0 && !seo?.noIndexBlogCategories) {
      addEntry({
        url: makeAbsoluteUrl(baseUrl, `/blog/category/${slug}`),
        lastModified: category._updatedAt || undefined,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
    if ((category.productCount || 0) > 0 && !seo?.noIndexProductCategories) {
      addEntry({
        url: makeAbsoluteUrl(baseUrl, `/products/${slug}`),
        lastModified: category._updatedAt || undefined,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
    if ((category.serviceCount || 0) > 0 && !seo?.noIndexServiceCategories) {
      addEntry({
        url: makeAbsoluteUrl(baseUrl, `/services/${slug}`),
        lastModified: category._updatedAt || undefined,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  if (seo?.includeTemplateRoutesInSitemap !== false) {
    for (const template of templateItems) {
      if (!template.route || !template.route.startsWith("/")) continue;
      addEntry({
        url: makeAbsoluteUrl(baseUrl, template.route),
        lastModified: template._updatedAt || undefined,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  const staticRoutes = (seo?.sitemapStaticRoutes || []).filter(
    (route): route is string => typeof route === "string" && route.startsWith("/"),
  );

  for (const route of staticRoutes) {
    addEntry({
      url: makeAbsoluteUrl(baseUrl, route),
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return entries.sort((a, b) => a.url.localeCompare(b.url));
}
