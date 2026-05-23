import type { Metadata } from "next";
import { cache } from "react";
import { urlFor } from "@/sanity/lib/image";
import { fetchSanitySeoSettings, fetchSanitySettings } from "@/sanity/lib/fetch";
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

const getSiteUrl = (seo?: SeoSettings | null) =>
  process.env.NEXT_PUBLIC_SITE_URL?.trim()?.replace(/\/+$/, "") ||
  seo?.siteUrl?.trim()?.replace(/\/+$/, "") || "";

const getMetadataBaseUrl = (seo?: SeoSettings | null) => {
  const primary =
    getSiteUrl(seo) ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim()?.replace(/\/+$/, "") ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()?.replace(/\/+$/, "");
  if (primary) {
    const withProtocol = primary.startsWith("http") ? primary : `https://${primary}`;
    try {
      return new URL(withProtocol);
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

  const siteUrl = getSiteUrl(seo);
  if (siteUrl && options?.dynamicTitle) {
    const params = new URLSearchParams({
      title: options.dynamicTitle,
    });
    if (options.dynamicBadge) {
      params.set("badge", options.dynamicBadge);
    }
    if (options.dynamicDescription) {
      params.set("description", options.dynamicDescription);
    }
    return {
      url: `${siteUrl}/api/og?${params.toString()}`,
      width: 1200,
      height: 630,
    };
  }

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
}): Metadata => {
  const resolvedTitle = normalizeSeoTitle(title || seo?.defaultTitle || siteName);
  const normalizedDescription = normalizeSeoDescription(
    description || seo?.defaultDescription || "",
  );
  const resolvedDescription = normalizedDescription || undefined;
  const image = resolveImage(page, seo, {
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
      ...buildMetadata({ seo, siteName }).openGraph,
    },
    twitter: {
      ...buildMetadata({ seo, siteName }).twitter,
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
  const siteName = await getSiteName();

  return buildMetadata({
    title,
    description,
    slug,
    noindex,
    seo,
    siteName,
  });
}
