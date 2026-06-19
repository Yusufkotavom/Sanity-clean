import { client } from "@/sanity/lib/client";
import { PAGE_QUERY, PAGES_QUERY, PAGES_SLUGS_QUERY } from "@/sanity/queries/page";
import { NAVIGATION_QUERY } from "@/sanity/queries/navigation";
import { SETTINGS_QUERY } from "@/sanity/queries/settings";
import { SEO_SETTINGS_QUERY } from "@/sanity/queries/seo-settings";
import { OG_SETTINGS_QUERY } from "@/sanity/queries/og-settings";
import { THEME_SETTINGS_QUERY } from "@/sanity/queries/theme-settings";
import { REUSABLE_SECTIONS_QUERY } from "@/sanity/queries/reusable-section";
import { LEGACY_PAGE_OVERRIDE_QUERY } from "@/sanity/queries/legacy-page";
import { BLOCKS_SHOWCASE_QUERY } from "@/sanity/queries/blocks-showcase";
import {
  TEMPLATE_PAGE_BY_ROUTE_QUERY,
  TEMPLATE_PAGE_BY_PATTERN_QUERY,
  TEMPLATE_PAGE_ROUTES_QUERY,
} from "@/sanity/queries/template-page";
import { GENERATOR_TEMPLATE_BY_ID_QUERY } from "@/sanity/queries/generator-template";
import {
  SEO_OPS_SETTINGS_PRIVATE_QUERY,
  SEO_OPS_SETTINGS_PUBLIC_QUERY,
} from "@/sanity/queries/seo-ops-settings";
import {
  BLOG_CATEGORIES_QUERY,
  CATEGORIES_QUERY,
  CATEGORY_QUERY,
  CATEGORIES_SLUGS_QUERY,
  PRODUCT_CATEGORIES_QUERY,
  SERVICE_CATEGORIES_QUERY,
} from "@/sanity/queries/category";
import {
  PRODUCT_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
  PRODUCTS_QUERY,
  PRODUCTS_HOME_QUERY,
  PRODUCTS_SLUGS_QUERY,
  RELATED_PRODUCTS_QUERY,
} from "@/sanity/queries/product";
import {
  SERVICE_QUERY,
  SERVICES_BY_CATEGORY_QUERY,
  SERVICES_QUERY,
  SERVICES_HOME_QUERY,
  SERVICES_SLUGS_QUERY,
  RELATED_SERVICES_QUERY,
} from "@/sanity/queries/service";
import {
  PROJECT_QUERY,
  PROJECTS_QUERY,
  PROJECTS_HOME_QUERY,
  PROJECTS_SLUGS_QUERY,
} from "@/sanity/queries/project";
import { isAllowedTemplateRoute } from "@/lib/templates/route-policy";
import {
  POST_QUERY,
  POSTS_BY_CATEGORY_QUERY,
  POSTS_QUERY,
  POSTS_HOME_QUERY,
  POSTS_SLUGS_QUERY,
  RELATED_POSTS_QUERY,
} from "@/sanity/queries/post";
import {
  PAGE_QUERY_RESULT,
  PAGES_SLUGS_QUERY_RESULT,
  POST_QUERY_RESULT,
  POSTS_QUERY_RESULT,
  POSTS_SLUGS_QUERY_RESULT,
  NAVIGATION_QUERY_RESULT,
  SETTINGS_QUERY_RESULT,
} from "@/sanity.types";
import type { TemplatePageDoc } from "@/types/template";

export type PageBlock = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];
export type PageGeneratorDebug = {
  programId?: string | null;
  templateId?: string | null;
  datasetId?: string | null;
  rowKey?: string | null;
  keywordKey?: string | null;
  generatedAt?: string | null;
  version?: string | null;
  aiUsed?: boolean | null;
};
export type PageWithGeneratorDebug = PAGE_QUERY_RESULT & {
  generator?: PageGeneratorDebug | null;
};
export type ReusablePlacementSlot =
  | "beforeHeader"
  | "afterHeader"
  | "beforeMainContent"
  | "afterMainContent"
  | "afterHero"
  | "beforeFinalCta"
  | "beforeFooter"
  | "afterFooter";
export type ReusableSectionItem = {
  _id: string;
  title?: string;
  priority?: number;
  placements?: ReusablePlacementSlot[];
  routeMode?: "all" | "selected";
  routeSlugs?: string[];
  blocks?: PageBlock[];
};

type BlocksShowcaseSource = {
  _id: string;
  _type: string;
  title?: string | null;
  slug?: string | null;
  blocks?: PageBlock[] | null;
};

export type BlocksShowcaseData = {
  blocks: PageBlock[];
  blockTypes: string[];
  sourceCount: number;
};

const fetchPublished = async <T>({
  query,
  params,
}: {
  query: string;
  params?: Record<string, unknown>;
}): Promise<T> => {
  return client.fetch(query, params || {}, {
    perspective: "published",
    stega: false,
  });
};

// Cached fetch for rarely-changing global data (settings, navigation, theme)
// Revalidates every 2592000s (1 month) and uses tags for on-demand revalidation
const fetchPublishedCached = async <T>({
  query,
  params,
  tags,
  revalidate = 2592000,
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
  revalidate?: number;
}): Promise<T> => {
  let isDraft = false;
  try {
    const { draftMode } = await import("next/headers");
    isDraft = (await draftMode()).isEnabled;
  } catch {
    // Not in a server component context (e.g. build time generateStaticParams)
  }

  if (isDraft) {
    return client.fetch(query, params || {}, {
      perspective: "drafts",
      useCdn: false,
      stega: true,
      token: process.env.SANITY_API_READ_TOKEN,
      next: { revalidate: 0 },
    });
  }

  return client.fetch(query, params || {}, {
    perspective: "published",
    stega: false,
    next: { revalidate, tags },
  });
};

export const fetchSanityPageBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<PAGE_QUERY_RESULT> => {
  const data = await fetchPublishedCached<PAGE_QUERY_RESULT>({
    query: PAGE_QUERY,
    params: { slug },
    tags: ["pages", `page:${slug}`],
    revalidate: 2592000,
  });

  return data;
};

export const fetchSanityPageGeneratorDebugBySlug = async ({
  slug,
  includeDrafts = false,
}: {
  slug: string;
  includeDrafts?: boolean;
}): Promise<PageWithGeneratorDebug | null> => {
  const data = await client.fetch<PageWithGeneratorDebug | null>(
    PAGE_QUERY,
    { slug },
    {
      perspective: includeDrafts ? "drafts" : "published",
      stega: false,
      useCdn: false,
    },
  );

  return data || null;
};

export const fetchSanityPageBySlugBuildOnly = async ({
  slug,
}: {
  slug: string;
}): Promise<PAGE_QUERY_RESULT> => {
  const data = await fetchPublished<PAGE_QUERY_RESULT>({
    query: PAGE_QUERY,
    params: { slug },
  });

  return data;
};

export const fetchGeneratorTemplateById = async ({
  id,
}: {
  id: string;
}): Promise<any | null> => {
  const data = await client.fetch<any | null>(
    GENERATOR_TEMPLATE_BY_ID_QUERY,
    { id: id.replace('drafts.', '') },
    {
      perspective: "drafts",
      stega: false,
      useCdn: false,
      token: process.env.SANITY_API_READ_TOKEN,
    },
  );

  return data || null;
};

export const fetchLegacyPageOverrideByRoute = async ({
  route,
}: {
  route: string;
}): Promise<any | null> => {
  const data = await fetchPublished<any | null>({
    query: LEGACY_PAGE_OVERRIDE_QUERY,
    params: { route },
  });

  return data || null;
};

export const fetchTemplatePageByRoute = async ({
  route,
}: {
  route: string;
}): Promise<TemplatePageDoc | null> => {
  if (!isAllowedTemplateRoute(route)) return null;
  const isDev = process.env.NODE_ENV === "development";
  const data = isDev
    ? await fetchPublished<TemplatePageDoc | null>({
        query: TEMPLATE_PAGE_BY_ROUTE_QUERY,
        params: { route },
      })
    : await fetchPublishedCached<TemplatePageDoc | null>({
        query: TEMPLATE_PAGE_BY_ROUTE_QUERY,
        params: { route },
        tags: ["template-pages", `template-page:${route}`],
        revalidate: 2592000,
      });

  if (data) return data;

  // Try pattern matching with multiple token support
  const segments = route.split("/").filter(Boolean);
  if (segments.length < 2) return null;

  // Try different pattern combinations
  const patterns = [
    // 3-level: /{category}/{service}/{lokasi}
    segments.length >= 3
      ? {
          pattern: `/${segments[0]}/{service}/{lokasi}`,
          service: segments[1],
          city: segments[2],
        }
      : null,
    // 2-level: /{category}/{lokasi}
    {
      pattern: `/${segments.slice(0, -1).join("/")}/{lokasi}`,
      service: undefined,
      city: segments.at(-1) || "",
    },
  ].filter(Boolean) as Array<{
    pattern: string;
    service?: string;
    city: string;
  }>;

  for (const { pattern, service, city } of patterns) {
    const params: Record<string, string | null> = {
      pattern,
      city,
      service: service || null,
    };

    const fallback = isDev
      ? await fetchPublished<TemplatePageDoc | null>({
          query: TEMPLATE_PAGE_BY_PATTERN_QUERY,
          params,
        })
      : await fetchPublishedCached<TemplatePageDoc | null>({
          query: TEMPLATE_PAGE_BY_PATTERN_QUERY,
          params,
          tags: [
            "template-pages",
            `template-page:${pattern}:${service || ""}:${city}`,
          ],
          revalidate: 2592000,
        });

    if (fallback) return fallback;
  }

  return null;
};

export const fetchTemplatePageRoutes = async (): Promise<
  Array<{ route?: string | null }>
> => {
  const data = await fetchPublished<Array<{ route?: string | null }>>({
    query: TEMPLATE_PAGE_ROUTES_QUERY,
  });

  return (data || []).filter((item) => isAllowedTemplateRoute(item.route));
};

export const fetchSanityPagesStaticParams =
  async (): Promise<PAGES_SLUGS_QUERY_RESULT> => {
    const data = await client
      .withConfig({ useCdn: false })
      .fetch(PAGES_SLUGS_QUERY, {}, {
        perspective: "published",
        stega: false,
      });

    return data;
  };

export const fetchSanityPages = async (): Promise<any[]> => {
  const data = await fetchPublished<any[]>({
    query: PAGES_QUERY,
  });

  return data || [];
};

export const fetchSanityBlocksShowcase = async (): Promise<BlocksShowcaseData> => {
  const sources = await fetchPublished<BlocksShowcaseSource[]>({
    query: BLOCKS_SHOWCASE_QUERY,
  });

  const seen = new Set<string>();
  const blocks: PageBlock[] = [];

  for (const source of sources || []) {
    for (const block of source.blocks || []) {
      if (!block?._type || seen.has(block._type)) continue;
      seen.add(block._type);
      blocks.push({
        ...(block as any),
        _key: `showcase-${block._type}-${blocks.length}`,
      } as PageBlock);
    }
  }

  return {
    blocks,
    blockTypes: Array.from(seen),
    sourceCount: (sources || []).length,
  };
};

export const fetchSanityPosts = async (): Promise<POSTS_QUERY_RESULT> => {
  const data = await fetchPublished<POSTS_QUERY_RESULT>({
    query: POSTS_QUERY,
  });

  return data;
};

export const fetchSanityHomePosts = async (): Promise<any[]> => {
  const data = await fetchPublishedCached<any[]>({
    query: POSTS_HOME_QUERY,
    tags: ["posts", "home-posts"],
  });

  return data || [];
};

export const fetchSanityPostBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<POST_QUERY_RESULT> => {
  const data = await fetchPublishedCached<POST_QUERY_RESULT>({
    query: POST_QUERY,
    params: { slug },
    tags: ["posts", `post:${slug}`],
    revalidate: 2592000,
  });

  return data;
};

export const fetchSanityPostsByCategorySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<any[]> => {
  const data = await fetchPublished<any[]>({
    query: POSTS_BY_CATEGORY_QUERY,
    params: { slug },
  });

  return data || [];
};

export const fetchSanityPostsStaticParams =
  async (): Promise<POSTS_SLUGS_QUERY_RESULT> => {
    const data = await client
      .withConfig({ useCdn: false })
      .fetch(POSTS_SLUGS_QUERY, {}, {
        perspective: "published",
        stega: false,
      });

    return data;
  };

export const fetchSanityNavigation =
  async (): Promise<NAVIGATION_QUERY_RESULT> => {
    const data = await fetchPublishedCached<NAVIGATION_QUERY_RESULT>({
      query: NAVIGATION_QUERY,
      tags: ["navigation"],
    });

    return data;
  };

export const fetchSanitySettings = async (): Promise<SETTINGS_QUERY_RESULT> => {
  const data = await fetchPublishedCached<SETTINGS_QUERY_RESULT>({
    query: SETTINGS_QUERY,
    tags: ["settings"],
  });

  return data;
};

export const fetchSanitySeoSettings = async (): Promise<any | null> => {
  const isDev = process.env.NODE_ENV === "development";
  const data = isDev
    ? await fetchPublished<any | null>({
        query: SEO_SETTINGS_QUERY,
      })
    : await fetchPublishedCached<any | null>({
        query: SEO_SETTINGS_QUERY,
        tags: ["seo-settings"],
      });

  return data;
};

export const fetchSanityOgSettings = async (): Promise<any | null> => {
  const isDev = process.env.NODE_ENV === "development";
  const data = isDev
    ? await fetchPublished<any | null>({
        query: OG_SETTINGS_QUERY,
      })
    : await fetchPublishedCached<any | null>({
        query: OG_SETTINGS_QUERY,
        tags: ["og-settings"],
      });

  return data;
};

// Alias for consistency
export const fetchSeoSettings = fetchSanitySeoSettings;

export const fetchSanityThemeSettings = async (): Promise<{
  themeColors?: {
    themePreset?: string;
    lightPrimary?: string;
    lightPrimaryForeground?: string;
    lightAccent?: string;
    lightRing?: string;
    darkPrimary?: string;
    darkPrimaryForeground?: string;
    darkAccent?: string;
    darkRing?: string;
  } | null;
} | null> => {
  const data = await fetchPublishedCached<{
    themeColors?: {
      themePreset?: string;
      lightPrimary?: string;
      lightPrimaryForeground?: string;
      lightAccent?: string;
      lightRing?: string;
      darkPrimary?: string;
      darkPrimaryForeground?: string;
      darkAccent?: string;
      darkRing?: string;
    } | null;
  } | null>({
    query: THEME_SETTINGS_QUERY,
    tags: ["theme-settings"],
  });

  return data;
};

export const fetchSanitySeoOpsSettings = async (): Promise<{
  googleEnabled?: boolean;
  googleAggressiveMode?: boolean;
  indexNowEnabled?: boolean;
  indexNowHost?: string;
  indexNowEndpoint?: string;
  indexNowKeyLocation?: string;
  autoSubmitOnRevalidate?: boolean;
  maxBatchSize?: number;
  retryAttempts?: number;
  notes?: string;
} | null> => {
  const data = await fetchPublished<{
    googleEnabled?: boolean;
    googleAggressiveMode?: boolean;
    indexNowEnabled?: boolean;
    indexNowHost?: string;
    indexNowEndpoint?: string;
    indexNowKeyLocation?: string;
    autoSubmitOnRevalidate?: boolean;
    maxBatchSize?: number;
    retryAttempts?: number;
    notes?: string;
  } | null>({
    query: SEO_OPS_SETTINGS_PUBLIC_QUERY,
  });

  return data;
};

export const fetchSanitySeoOpsSettingsPrivate = async (): Promise<{
  googleEnabled?: boolean;
  googleAggressiveMode?: boolean;
  googleServiceAccountEncrypted?: string;
  indexNowEnabled?: boolean;
  indexNowHost?: string;
  indexNowEndpoint?: string;
  indexNowKeyEncrypted?: string;
  indexNowKeyLocation?: string;
  autoSubmitOnRevalidate?: boolean;
  maxBatchSize?: number;
  retryAttempts?: number;
  dashboardPasswordHash?: string;
  notes?: string;
} | null> => {
  const data = await fetchPublished<{
    googleEnabled?: boolean;
    googleAggressiveMode?: boolean;
    googleServiceAccountEncrypted?: string;
    indexNowEnabled?: boolean;
    indexNowHost?: string;
    indexNowEndpoint?: string;
    indexNowKeyEncrypted?: string;
    indexNowKeyLocation?: string;
    autoSubmitOnRevalidate?: boolean;
    maxBatchSize?: number;
    retryAttempts?: number;
    dashboardPasswordHash?: string;
    notes?: string;
  } | null>({
    query: SEO_OPS_SETTINGS_PRIVATE_QUERY,
  });

  return data;
};

export const fetchSanityReusableSections = async (): Promise<ReusableSectionItem[]> => {
  const data = await fetchPublishedCached<ReusableSectionItem[]>({
    query: REUSABLE_SECTIONS_QUERY,
    tags: ["reusable-sections"],
  });

  return data || [];
};

export const fetchSanityCategories = async (): Promise<any[]> => {
  const data = await fetchPublished<any[]>({
    query: CATEGORIES_QUERY,
  });

  return data || [];
};

export const fetchSanityBlogCategories = async (): Promise<any[]> => {
  const data = await fetchPublished<any[]>({
    query: BLOG_CATEGORIES_QUERY,
  });

  return data || [];
};

export const fetchSanityProductCategories = async (): Promise<any[]> => {
  const data = await fetchPublished<any[]>({
    query: PRODUCT_CATEGORIES_QUERY,
  });

  return data || [];
};

export const fetchSanityServiceCategories = async (): Promise<any[]> => {
  const data = await fetchPublished<any[]>({
    query: SERVICE_CATEGORIES_QUERY,
  });

  return data || [];
};

export const fetchSanityCategoryBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<any | null> => {
  const data = await fetchPublished<any | null>({
    query: CATEGORY_QUERY,
    params: { slug },
  });

  return data;
};

export const fetchSanityCategoriesStaticParams = async (): Promise<any[]> => {
  const data = await client
    .withConfig({ useCdn: false })
    .fetch(CATEGORIES_SLUGS_QUERY, {}, {
      perspective: "published",
      stega: false,
    });

  return data || [];
};

export const fetchSanityProducts = async (): Promise<any[]> => {
  const data = await fetchPublished<any[]>({
    query: PRODUCTS_QUERY,
  });

  return data || [];
};

export const fetchSanityHomeProducts = async (): Promise<any[]> => {
  const data = await fetchPublishedCached<any[]>({
    query: PRODUCTS_HOME_QUERY,
    tags: ["products", "home-products"],
  });

  return data || [];
};

export const fetchSanityProductsByCategorySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<any[]> => {
  const data = await fetchPublished<any[]>({
    query: PRODUCTS_BY_CATEGORY_QUERY,
    params: { slug },
  });

  return data || [];
};

export const fetchSanityProductBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<any | null> => {
  const data = await fetchPublishedCached<any | null>({
    query: PRODUCT_QUERY,
    params: { slug },
    tags: ["products", `product:${slug}`],
    revalidate: 2592000,
  });

  return data;
};

export const fetchSanityProductsStaticParams = async (): Promise<any[]> => {
  const data = await client
    .withConfig({ useCdn: false })
    .fetch(PRODUCTS_SLUGS_QUERY, {}, {
      perspective: "published",
      stega: false,
    });

  return data || [];
};

export const fetchSanityRelatedProducts = async ({
  slug,
  categoryIds,
}: {
  slug: string;
  categoryIds: string[];
}): Promise<any[]> => {
  const data = await fetchPublished<any[]>({
    query: RELATED_PRODUCTS_QUERY,
    params: { slug, categoryIds },
  });

  return data || [];
};

export const fetchSanityServices = async (): Promise<any[]> => {
  const data = await fetchPublished<any[]>({
    query: SERVICES_QUERY,
  });

  return data || [];
};

export const fetchSanityHomeServices = async (): Promise<any[]> => {
  const data = await fetchPublishedCached<any[]>({
    query: SERVICES_HOME_QUERY,
    tags: ["services", "home-services"],
  });

  return data || [];
};

export const fetchSanityServicesByCategorySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<any[]> => {
  const data = await fetchPublished<any[]>({
    query: SERVICES_BY_CATEGORY_QUERY,
    params: { slug },
  });

  return data || [];
};

export const fetchSanityServiceBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<any | null> => {
  const data = await fetchPublishedCached<any | null>({
    query: SERVICE_QUERY,
    params: { slug },
    tags: ["services", `service:${slug}`],
    revalidate: 2592000,
  });

  return data;
};

export const fetchSanityServicesStaticParams = async (): Promise<any[]> => {
  const data = await client
    .withConfig({ useCdn: false })
    .fetch(SERVICES_SLUGS_QUERY, {}, {
      perspective: "published",
      stega: false,
    });

  return data || [];
};

export const fetchSanityProjects = async (): Promise<any[]> => {
  const data = await fetchPublished<any[]>({
    query: PROJECTS_QUERY,
  });

  return data || [];
};

export const fetchSanityHomeProjects = async (): Promise<any[]> => {
  const data = await fetchPublishedCached<any[]>({
    query: PROJECTS_HOME_QUERY,
    tags: ["projects", "home-projects"],
  });

  return data || [];
};

export const fetchSanityProjectBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<any | null> => {
  const data = await fetchPublishedCached<any | null>({
    query: PROJECT_QUERY,
    params: { slug },
    tags: ["projects", `project:${slug}`],
    revalidate: 2592000,
  });

  return data;
};

export const fetchSanityProjectsStaticParams = async (): Promise<any[]> => {
  const data = await client
    .withConfig({ useCdn: false })
    .fetch(PROJECTS_SLUGS_QUERY, {}, {
      perspective: "published",
      stega: false,
    });

  return data || [];
};
