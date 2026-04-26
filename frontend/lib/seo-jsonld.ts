import { urlFor } from "@/sanity/lib/image";
import { KOTACOM_SPLIT_DEFAULT_SEO_IMAGE } from "@/lib/illustrations/kotacom-split";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

const normalizeSiteUrl = (siteUrl?: string | null) =>
  siteUrl?.replace(/\/+$/, "") || SITE_URL;

const toAbsoluteUrl = (path: string, siteUrl?: string | null) =>
  `${normalizeSiteUrl(siteUrl)}${path.startsWith("/") ? path : `/${path}`}`;

const resolveImageUrl = (
  image: any,
  fallback = KOTACOM_SPLIT_DEFAULT_SEO_IMAGE,
  siteUrl?: string | null,
) => {
  if (image) {
    try {
      return urlFor(image).quality(100).url();
    } catch {
      return toAbsoluteUrl(fallback, siteUrl);
    }
  }
  return toAbsoluteUrl(fallback, siteUrl);
};

// ---------- Types ----------

export type AggregateRatingData = {
  ratingValue?: number;
  reviewCount?: number;
  bestRating?: number;
  ratingSource?: string;
  sourceUrl?: string;
} | null;

export type ReviewItemData = {
  reviewerName?: string;
  reviewerRole?: string;
  reviewerImage?: any;
  rating?: number;
  reviewBody?: string;
  datePublished?: string;
  source?: string;
  sourceUrl?: string;
  verified?: boolean;
};

export type AffiliateItemData = {
  _key?: string;
  itemType?: string;
  name?: string;
  brand?: string;
  image?: any;
  description?: string;
  pros?: string[];
  cons?: string[];
  rating?: number;
  price?: number;
  currency?: string;
  affiliateUrl?: string;
  affiliateLabel?: string;
  availability?: string;
  sku?: string;
  position?: number;
  verdict?: string;
};

// ---------- Helpers ----------

const ITEM_TYPE_MAP: Record<string, string> = {
  product: "Product",
  software: "SoftwareApplication",
  service: "Service",
  webapp: "WebApplication",
  mobileapp: "MobileApplication",
};

const AVAILABILITY_MAP: Record<string, string> = {
  "in-stock": "InStock",
  "out-of-stock": "OutOfStock",
  "pre-order": "PreOrder",
  free: "InStock",
  freemium: "InStock",
};

function buildAggregateRatingBlock(rating: AggregateRatingData | undefined) {
  if (!rating?.ratingValue || !rating?.reviewCount) return undefined;
  return {
    "@type": "AggregateRating",
    ratingValue: rating.ratingValue,
    reviewCount: rating.reviewCount,
    bestRating: rating.bestRating || 5,
  };
}

function buildReviewBlocks(reviews: ReviewItemData[] | undefined) {
  if (!reviews?.length) return undefined;
  return reviews
    .filter((r) => r.reviewerName && r.rating)
    .map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.reviewerName },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
      },
      reviewBody: r.reviewBody || undefined,
      datePublished: r.datePublished || undefined,
    }));
}

/**
 * Resolve aggregate rating with fallback chain:
 * 1. Document-level aggregateRating (manual override)
 * 2. Auto-calculated from reviews[]
 * 3. Global default from SEO settings
 */
export function resolveAggregateRating(
  docRating: AggregateRatingData,
  reviews: ReviewItemData[] | undefined,
  defaultRating: AggregateRatingData,
): AggregateRatingData {
  // 1. Document-level override
  if (docRating?.ratingValue && docRating?.reviewCount) return docRating;
  // 2. Auto-calculate from reviews
  if (reviews?.length) {
    const rated = reviews.filter((r) => typeof r.rating === "number");
    if (rated.length > 0) {
      const avg = rated.reduce((sum, r) => sum + (r.rating || 0), 0) / rated.length;
      return {
        ratingValue: Math.round(avg * 10) / 10,
        reviewCount: rated.length,
        bestRating: 5,
        ratingSource: "calculated",
      };
    }
  }
  // 3. Global default
  if (defaultRating?.ratingValue && defaultRating?.reviewCount) return defaultRating;
  return null;
}

// ---------- Builders ----------

export const buildBreadcrumbJsonLd = (
  items: Array<{ name: string; path: string }>,
  options?: { siteUrl?: string | null },
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    name: item.name,
    item: toAbsoluteUrl(item.path, options?.siteUrl),
  })),
});

export const buildArticleJsonLd = ({
  title,
  description,
  path,
  image,
  datePublished,
  dateModified,
  authorName,
  siteUrl,
}: {
  title: string;
  description?: string | null;
  path: string;
  image?: any;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  siteUrl?: string | null;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description: description || undefined,
  image: resolveImageUrl(image, KOTACOM_SPLIT_DEFAULT_SEO_IMAGE, siteUrl),
  mainEntityOfPage: toAbsoluteUrl(path, siteUrl),
  datePublished: datePublished || undefined,
  dateModified: dateModified || undefined,
  author: authorName
    ? {
        "@type": "Person",
        name: authorName,
      }
    : undefined,
});

export const buildProductJsonLd = ({
  title,
  description,
  path,
  image,
  price,
  currency,
  availability,
  aggregateRating,
  reviews,
  siteUrl,
}: {
  title: string;
  description?: string | null;
  path: string;
  image?: any;
  price?: number;
  currency?: string;
  availability?: string;
  aggregateRating?: AggregateRatingData;
  reviews?: ReviewItemData[];
  siteUrl?: string | null;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: title,
  description: description || undefined,
  image: resolveImageUrl(image, KOTACOM_SPLIT_DEFAULT_SEO_IMAGE, siteUrl),
  url: toAbsoluteUrl(path, siteUrl),
  offers:
    typeof price === "number"
      ? {
          "@type": "Offer",
          price,
          priceCurrency: currency || "IDR",
          availability: availability
            ? `https://schema.org/${AVAILABILITY_MAP[availability] || "InStock"}`
            : undefined,
        }
      : undefined,
  aggregateRating: buildAggregateRatingBlock(aggregateRating),
  review: buildReviewBlocks(reviews),
});

export const buildServiceJsonLd = ({
  title,
  description,
  path,
  image,
  startingPrice,
  currency,
  aggregateRating,
  reviews,
  siteUrl,
}: {
  title: string;
  description?: string | null;
  path: string;
  image?: any;
  startingPrice?: number;
  currency?: string;
  aggregateRating?: AggregateRatingData;
  reviews?: ReviewItemData[];
  siteUrl?: string | null;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: title,
  description: description || undefined,
  image: resolveImageUrl(image, KOTACOM_SPLIT_DEFAULT_SEO_IMAGE, siteUrl),
  url: toAbsoluteUrl(path, siteUrl),
  offers:
    typeof startingPrice === "number"
      ? {
          "@type": "Offer",
          price: startingPrice,
          priceCurrency: currency || "IDR",
        }
      : undefined,
  aggregateRating: buildAggregateRatingBlock(aggregateRating),
  review: buildReviewBlocks(reviews),
});

export const buildFaqJsonLd = (
  faqs: Array<{ question: string; answer: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});

// ---------- New Builders for Blog Review/Listicle ----------

/**
 * Build JSON-LD for a single affiliate item being reviewed in a blog post
 */
export const buildAffiliateItemJsonLd = (item: AffiliateItemData) => {
  const schemaType = ITEM_TYPE_MAP[item.itemType || "product"] || "Product";
  const base: any = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: item.name,
    description: item.description || undefined,
    image: item.image ? resolveImageUrl(item.image) : undefined,
    url: item.affiliateUrl || undefined,
  };

  if (item.brand) {
    base.brand = { "@type": "Brand", name: item.brand };
  }
  if (item.sku) {
    base.sku = item.sku;
  }
  if (typeof item.price === "number") {
    base.offers = {
      "@type": "Offer",
      price: item.price,
      priceCurrency: item.currency || "IDR",
      availability: item.availability
        ? `https://schema.org/${AVAILABILITY_MAP[item.availability] || "InStock"}`
        : undefined,
    };
  }
  if (typeof item.rating === "number") {
    base.review = {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: item.rating,
        bestRating: 5,
      },
      reviewBody: item.verdict || undefined,
    };
  }
  // For software types
  if (["software", "webapp", "mobileapp"].includes(item.itemType || "")) {
    base.applicationCategory = "BusinessApplication";
    if (item.availability === "free" || item.availability === "freemium") {
      base.offers = {
        "@type": "Offer",
        price: 0,
        priceCurrency: item.currency || "IDR",
      };
    }
  }

  return base;
};

/**
 * Build ItemList JSON-LD for listicle blog posts (multiple affiliate items)
 */
export const buildItemListJsonLd = (
  items: AffiliateItemData[],
  listName?: string,
  options?: { siteUrl?: string | null },
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: listName || undefined,
  numberOfItems: items.length,
  itemListElement: items.map((item, idx) => ({
    "@type": "ListItem",
    position: item.position || idx + 1,
    item: buildAffiliateItemJsonLd(item),
  })),
});

// ---------- Collection/Listing Page Builders ----------

export type CollectionItemData = {
  name: string;
  url: string;
  description?: string;
  image?: any;
};

/**
 * Build ItemList JSON-LD for listing/archive pages (blog, products, services, projects).
 * Uses simple ListItem → Thing (or subtypes) pattern without affiliate-specific fields.
 */
export const buildCollectionPageJsonLd = ({
  name,
  description,
  url,
  items,
  siteUrl,
}: {
  name: string;
  description?: string;
  url: string;
  items: CollectionItemData[];
  siteUrl?: string | null;
}) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name,
  description: description || undefined,
  url: toAbsoluteUrl(url, siteUrl),
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.slice(0, 20).map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : toAbsoluteUrl(item.url, siteUrl),
    })),
  },
});
