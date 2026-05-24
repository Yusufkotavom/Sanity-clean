import type { Metadata } from "next";
import { cache } from "react";
import { urlFor } from "@/sanity/lib/image";
import {
  fetchSanityOgSettings,
  fetchSanitySeoSettings,
  fetchSanitySettings,
} from "@/sanity/lib/fetch";
import { PAGE_QUERY_RESULT, POST_QUERY_RESULT } from "@/sanity.types";
import { KOTACOM_SPLIT_DEFAULT_SEO_IMAGE } from "@/lib/illustrations/kotacom-split";
import { normalizeSeoDescription, normalizeSeoTitle } from "@/lib/seo-normalize";
const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

type MetaCompatiblePage = {
  title?: string | null;
  excerpt?: string | null;
  image?: any;
  meta?: {
    title?: string | null;
    description?: string | null;
    canonicalUrl?: string | null;
    focusKeyword?: string | null;
    secondaryKeywords?: string[] | null;
    noindex?: boolean | null;
    image?: any;
  } | null;
};

type SeoSettings = {
  titleSuffix?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultNoIndex?: boolean;
  siteUrl?: string;
  siteSearchPath?: string;
  twitterHandle?: string;
  defaultImage?: {
    asset?: {
      metadata?: {
        dimensions?: {
          width?: number;
          height?: number;
        };
      };
    };
  };
};

type OgSettings = {
  ogBaseUrl?: string;
};

const getSeoSettings = cache(async (): Promise<SeoSettings | null> => {
  return (await fetchSanitySeoSettings()) || null;
});

const getSiteName = cache(async (): Promise<string> => {
  const settings = (await fetchSanitySettings()) as {
    siteName?: string | null;
    brandName?: string | null;
  } | null;

  return settings?.siteName || settings?.brandName || "DEVK STUDIO";
});

const getOgSettings = cache(async (): Promise<OgSettings | null> => {
  return (await fetchSanityOgSettings()) || null;
});

const normalizeBaseUrl = (value?: string | null) => {
  const cleaned = value?.trim()?.replace(/\/+$/, "");
  if (!cleaned) return "";
  return cleaned.startsWith("http") ? cleaned : `https://${cleaned}`;
};

const getSiteUrl = (seo?: SeoSettings | null) =>
  normalizeBaseUrl(seo?.siteUrl) ||
  normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
  normalizeBaseUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  normalizeBaseUrl(process.env.VERCEL_URL) ||
  "";

const getMetadataBaseUrl = (seo?: SeoSettings | null) => {
  const primary =
    normalizeBaseUrl(seo?.siteUrl) ||
    normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    normalizeBaseUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    normalizeBaseUrl(process.env.VERCEL_URL) ||
    getSiteUrl(seo);
  if (primary) {
    try {
      return new URL(primary);
    } catch {
      // fall through
    }
  }

  const devPort = process.env.PORT || "3000";
  return new URL(`http://localhost:${devPort}`);
};

const getCanonicalUrl = (slug?: string, seo?: SeoSettings | null) => {
  const baseUrl = getSiteUrl(seo);
  if (!baseUrl) return slug && slug !== "index" ? `/${slug.replace(/^\/+/, "")}` : "/";
  if (!slug || slug === "index") return `${baseUrl}/`;
  return `${baseUrl}/${slug.replace(/^\/+/, "")}`;
};

const resolveImage = (
  page?: MetaCompatiblePage | null,
  seo?: SeoSettings | null,
  og?: OgSettings | null,
  options?: {
    dynamicTitle?: string;
    dynamicBadge?: string;
    dynamicDescription?: string;
  },
) => {
  if (page?.meta?.image?.asset) {
    return {
      url: urlFor(page.meta.image).quality(85).url(),
      width: page.meta.image.asset?.metadata?.dimensions?.width || 1200,
      height: page.meta.image.asset?.metadata?.dimensions?.height || 630,
    };
  }

  if (page?.image?.asset) {
    return {
      url: urlFor(page.image).quality(85).url(),
      width: page.image.asset?.metadata?.dimensions?.width || 1200,
      height: page.image.asset?.metadata?.dimensions?.height || 630,
    };
  }

  if (seo?.defaultImage?.asset) {
    return {
      url: urlFor(seo.defaultImage).quality(85).url(),
      width: seo.defaultImage.asset?.metadata?.dimensions?.width || 1200,
      height: seo.defaultImage.asset?.metadata?.dimensions?.height || 630,
    };
  }

  if (options?.dynamicTitle) {
    const params = new URLSearchParams({
      title: options.dynamicTitle,
    });
    if (options.dynamicBadge) {
      params.set("badge", options.dynamicBadge);
    }
    if (options.dynamicDescription) {
      params.set("description", options.dynamicDescription);
    }
    const ogBaseUrl =
      normalizeBaseUrl(og?.ogBaseUrl) ||
      getSiteUrl(seo);
    return {
      url: ogBaseUrl ? `${ogBaseUrl}/api/og?${params.toString()}` : `/api/og?${params.toString()}`,
      width: 1200,
      height: 630,
    };
  }

  const siteUrl = getSiteUrl(seo);
  return {
    url: siteUrl ? `${siteUrl}${KOTACOM_SPLIT_DEFAULT_SEO_IMAGE}` : KOTACOM_SPLIT_DEFAULT_SEO_IMAGE,
    width: 1200,
    height: 630,
  };
};

const buildMetadata = ({
  title,
  description,
  noindex,
  slug,
  canonicalUrl,
  openGraphType = "website",
  page,
  seo,
  siteName,
  og,
}: {
  title?: string;
  description?: string;
  noindex?: boolean;
  slug?: string;
  canonicalUrl?: string;
  openGraphType?: "website" | "article";
  page?: MetaCompatiblePage | null;
  seo?: SeoSettings | null;
  siteName: string;
  og?: OgSettings | null;
}): Metadata => {
  const resolvedTitle = normalizeSeoTitle(title || seo?.defaultTitle || siteName);
  const normalizedDescription = normalizeSeoDescription(
    description || seo?.defaultDescription || "",
  );
  const resolvedDescription = normalizedDescription || undefined;
  const image = resolveImage(page, seo, og, {
    dynamicTitle: resolvedTitle,
    dynamicBadge: openGraphType === "article" ? "Blog" : undefined,
    dynamicDescription: normalizedDescription || undefined,
  });
  const resolvedCanonical = canonicalUrl || getCanonicalUrl(slug, seo);
  const siteUrl = getSiteUrl(seo);
  const robotsValue =
    !isProduction || noindex || seo?.defaultNoIndex ? "noindex, nofollow" : "index, follow";

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    openGraph: {
      title: resolvedTitle || undefined,
      description: resolvedDescription || undefined,
      siteName: siteName || undefined,
      images: [image],
      locale: "id_ID",
      type: openGraphType,
      url: resolvedCanonical,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle || undefined,
      description: resolvedDescription || undefined,
      images: [image.url],
      creator: seo?.twitterHandle || undefined,
    },
    robots: robotsValue,
    alternates: {
      canonical: resolvedCanonical,
      ...(siteUrl
        ? {
            languages: {
              "id-ID": `${siteUrl}/`,
            },
          }
        : {}),
    },
  };
};

export async function generateRootMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const og = await getOgSettings();
  const siteName = await getSiteName();
  const suffix = seo?.titleSuffix || siteName;

  return {
    metadataBase: getMetadataBaseUrl(seo),
    title: {
      template: `%s | ${suffix}`,
      default: seo?.defaultTitle || siteName,
    },
    description: seo?.defaultDescription || undefined,
    openGraph: {
      ...buildMetadata({ seo, siteName, og }).openGraph,
    },
    twitter: {
      ...buildMetadata({ seo, siteName, og }).twitter,
    },
    robots: !isProduction || seo?.defaultNoIndex ? "noindex, nofollow" : "index, follow",
  };
}

export async function generatePageMetadata({
  page,
  slug,
  pageType = "website",
}: {
  page: PAGE_QUERY_RESULT | POST_QUERY_RESULT | MetaCompatiblePage | null;
  slug: string;
  pageType?: "website" | "article";
}): Promise<Metadata> {
  const seo = await getSeoSettings();
  const og = await getOgSettings();
  const siteName = await getSiteName();
  const compatiblePage = page as MetaCompatiblePage | null;

  return buildMetadata({
    page: compatiblePage,
    slug,
    title: compatiblePage?.meta?.title || compatiblePage?.title || undefined,
    description:
      compatiblePage?.meta?.description || compatiblePage?.excerpt || undefined,
    canonicalUrl: compatiblePage?.meta?.canonicalUrl || undefined,
    noindex: compatiblePage?.meta?.noindex || undefined,
    openGraphType: pageType,
    seo,
    og,
    siteName,
  });
}

export async function generateBasicMetadata({
  title,
  description,
  slug,
  noindex,
}: {
  title?: string;
  description?: string;
  slug: string;
  noindex?: boolean;
}): Promise<Metadata> {
  const seo = await getSeoSettings();
  const og = await getOgSettings();
  const siteName = await getSiteName();

  return buildMetadata({
    title,
    description,
    slug,
    noindex,
    seo,
    og,
    siteName,
  });
}
