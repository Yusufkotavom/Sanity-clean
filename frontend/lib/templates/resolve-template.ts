import type { LegacyRewriteCopy } from "@/lib/legacy-pages/rewrite-content";
import { urlFor } from "@/sanity/lib/image";
import type {
  TemplateCtaLink,
  TemplateContentVariant,
  TemplateLane,
  TemplateLink,
  TemplateMeta,
  TemplatePageDoc,
  TemplateRouteKind,
  TemplateSourceMode,
  TemplateSourcePolicy,
  TemplateStructured,
  TemplateTrustMode,
} from "@/types/template";

const LOCATION_TOKEN_REGEX = /\{(lokasi|location|city)\}/gi;
const SERVICE_TOKEN_REGEX = /\{(layanan|service|serviceName)\}/gi;
const SPACE_BEFORE_PUNCTUATION_REGEX = /\s+([,.;:!?])/g;
const MULTI_SPACE_REGEX = /\s{2,}/g;

const LANE_KEYWORDS: Record<TemplateLane, string[]> = {
  website: [
    "website",
    "landing page",
    "company profile",
    "toko online",
    "ecommerce",
    "e-commerce",
    "domain",
    "hosting",
    "seo",
    "cms",
    "redesign",
  ],
  software: [
    "software",
    "sistem",
    "aplikasi",
    "dashboard",
    "workflow",
    "integrasi",
    "operasional",
    "mvp",
    "erp",
    "crm",
    "otomasi",
    "automation",
    "deployment",
  ],
  printing: [
    "cetak",
    "percetakan",
    "printing",
    "brosur",
    "banner",
    "buku",
    "stiker",
    "kemasan",
    "offset",
    "pod",
    "proofing",
    "finishing",
    "material",
  ],
  generic: [],
};

const SLOT_INTENT_BY_ROUTE_KIND: Record<TemplateRouteKind, "commercial" | "decision"> = {
  base: "commercial",
  city: "commercial",
  service: "decision",
  "service-city": "decision",
};

export type ResolvedTemplateExperience = {
  lane: TemplateLane;
  routeKind: TemplateRouteKind;
  variant: string;
  trustMode: TemplateTrustMode;
  sourcePolicy: Required<TemplateSourcePolicy>;
  contextTags: string[];
};

const defaultSourcePolicy: Required<TemplateSourcePolicy> = {
  pricingSource: "page-first",
  proofSource: "page-first",
  testimonialSource: "page-first",
  maxQuickLinks: 2,
};

const DEFAULT_VARIANT_BY_LANE: Record<TemplateLane, string> = {
  website: "service-hero",
  printing: "pricing-focus",
  software: "local-proof",
  generic: "generic-company",
};

const slugifyTag = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const pickString = (value: string | null | undefined, fallback = "") => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const normalizeText = (value: string) =>
  value
    .replace(LOCATION_TOKEN_REGEX, " ")
    .replace(SERVICE_TOKEN_REGEX, " ")
    .replace(SPACE_BEFORE_PUNCTUATION_REGEX, "$1")
    .replace(MULTI_SPACE_REGEX, " ")
    .replace(/\(\s*\)/g, "")
    .trim();

const applyContextTokens = (
  value: string,
  {
    locationName,
    serviceName,
  }: {
    locationName?: string | null;
    serviceName?: string | null;
  } = {},
) => {
  const withLocation = locationName
    ? value.replace(LOCATION_TOKEN_REGEX, locationName)
    : value.replace(LOCATION_TOKEN_REGEX, " ");
  const replaced = serviceName
    ? withLocation.replace(SERVICE_TOKEN_REGEX, serviceName)
    : withLocation.replace(SERVICE_TOKEN_REGEX, " ");
  return normalizeText(replaced);
};

const applyContextTokensArray = (
  items: string[],
  context?: {
    locationName?: string | null;
    serviceName?: string | null;
  },
) =>
  items
    .map((item) => applyContextTokens(item, context))
    .filter(Boolean);

const pickArray = <T>(value: T[] | null | undefined, fallback: T[]): T[] => {
  if (Array.isArray(value) && value.length > 0) return value;
  return fallback;
};

const resolveImageUrl = (image?: any) => {
  if (!image || !image.asset) return undefined;
  try {
    return urlFor(image).width(1600).url();
  } catch {
    return undefined;
  }
};

const resolveLinkHref = (link?: TemplateLink | null) => {
  if (!link) return undefined;
  return link.href || undefined;
};

const dedupeByText = <T>(items: T[], getKey: (item: T) => string) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = normalizeText(getKey(item).toLowerCase());
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const selectBySourceMode = <T>(
  mode: TemplateSourceMode | null | undefined,
  pageItems: T[] | null | undefined,
  templateItems: T[] | null | undefined,
  baseItems: T[],
) => {
  const pageHasItems = Array.isArray(pageItems) && pageItems.length > 0;
  const templateHasItems = Array.isArray(templateItems) && templateItems.length > 0;

  switch (mode) {
    case "template-first":
      return templateHasItems ? templateItems! : pageHasItems ? pageItems! : baseItems;
    case "template-only":
      return templateHasItems ? templateItems! : baseItems;
    case "page-only":
      return pageHasItems ? pageItems! : baseItems;
    case "base-only":
      return baseItems;
    case "page-first":
    default:
      return pageHasItems ? pageItems! : templateHasItems ? templateItems! : baseItems;
  }
};

const resolveCtaLinks = (
  items: TemplateCtaLink[] | null | undefined,
  fallback: LegacyRewriteCopy["ctaLinks"],
  locationName?: string | null,
  serviceName?: string | null,
  maxQuickLinks = 2,
) => {
  const source = items && items.length > 0 ? items : [];
  const resolved = source
    .map((item) => {
      const href = resolveLinkHref(item.link || undefined);
      const label = applyContextTokens(pickString(item.label), {
        locationName,
        serviceName,
      });
      if (!label || !href) return null;
      return { label, href };
    })
    .filter(Boolean) as Array<{ label: string; href: string }>;

  const deduped = dedupeByText(
    resolved.length > 0 ? resolved : fallback || [],
    (item) => `${item.label} ${item.href}`,
  );

  return deduped.slice(0, Math.max(0, Math.min(maxQuickLinks, 2)));
};

const inferLaneFromRoute = (route?: string | null): TemplateLane => {
  const normalized = route || "";
  if (normalized.includes("/software")) return "software";
  if (
    normalized.includes("/percetakan") ||
    normalized.includes("/cetak-") ||
    normalized.includes("/jasa-cetak-")
  ) {
    return "printing";
  }
  if (normalized.includes("/pembuatan-website")) return "website";
  return "generic";
};

export const resolveTemplateExperience = ({
  page,
  template,
}: {
  page?: TemplatePageDoc | null;
  template?: TemplatePageDoc["template"] | null;
}): ResolvedTemplateExperience => {
  const routeKind: TemplateRouteKind = page?.location
    ? page?.service || page?.serviceType
      ? "service-city"
      : "city"
    : page?.service || page?.serviceType
      ? "service"
      : "base";

  const lane =
    template?.lane ||
    (page?.template?.lane as TemplateLane | null) ||
    inferLaneFromRoute(page?.route);
  const variant = DEFAULT_VARIANT_BY_LANE[lane] || template?.variant || "service-hero";
  const trustMode = template?.trustMode || "aggressive";
  const sourcePolicy = {
    ...defaultSourcePolicy,
    ...(template?.sourcePolicy || {}),
  };

  const contextTags = [
    routeKind,
    lane,
    page?.location ? "location" : "no-location",
    page?.service || page?.serviceType ? "service" : "no-service",
    variant,
    ...(page?.service?.slug?.current ? [page.service.slug.current] : []),
    ...(page?.serviceType?.slug?.current ? [page.serviceType.slug.current] : []),
    ...(page?.serviceType?.category ? [slugifyTag(page.serviceType.category)] : []),
    ...(page?.service?.title ? [slugifyTag(page.service.title)] : []),
    ...(page?.serviceType?.title ? [slugifyTag(page.serviceType.title)] : []),
  ];

  return { lane, routeKind, variant, trustMode, sourcePolicy, contextTags };
};

const matchesVariantContext = ({
  item,
  lane,
  routeKind,
  trustMode,
  hasLocation,
  hasService,
  contextTags,
}: {
  item: TemplateContentVariant;
  lane: TemplateLane;
  routeKind: TemplateRouteKind;
  trustMode: TemplateTrustMode;
  hasLocation: boolean;
  hasService: boolean;
  contextTags: string[];
}) => {
  if (!item.text || !item.slot) return false;
  if (item.lane && item.lane !== lane) return false;
  if (item.requiresLocation && !hasLocation) return false;
  if (item.requiresService && !hasService) return false;
  if (item.routeKinds?.length && !item.routeKinds.includes(routeKind)) return false;
  if (trustMode === "safe" && item.strength === "aggressive") return false;
  if (
    item.disallowedContexts?.some((context) => contextTags.includes(context))
  ) {
    return false;
  }
  return true;
};

const resolveVariantText = ({
  slot,
  pageVariants,
  templateVariants,
  fallback,
  lane,
  routeKind,
  trustMode,
  locationName,
  serviceName,
  contextTags,
}: {
  slot: NonNullable<TemplateContentVariant["slot"]>;
  pageVariants?: TemplateContentVariant[] | null;
  templateVariants?: TemplateContentVariant[] | null;
  fallback: string;
  lane: TemplateLane;
  routeKind: TemplateRouteKind;
  trustMode: TemplateTrustMode;
  locationName?: string | null;
  serviceName?: string | null;
  contextTags: string[];
}) => {
  const candidates = [...(pageVariants || []), ...(templateVariants || [])];
  const match = candidates.find((item) =>
    item.slot === slot &&
    matchesVariantContext({
      item,
      lane,
      routeKind,
      trustMode,
      hasLocation: Boolean(locationName),
      hasService: Boolean(serviceName),
      contextTags,
    }),
  );

  return applyContextTokens(match?.text || fallback, {
    locationName,
    serviceName,
  });
};

const containsKeywords = (value: string, keywords: string[]) => {
  const normalized = value.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword));
};

const isRelevantToLane = (value: string, lane: TemplateLane) => {
  if (lane === "generic") return true;
  const ownKeywords = LANE_KEYWORDS[lane];
  if (containsKeywords(value, ownKeywords)) return true;

  const otherLanes = (Object.keys(LANE_KEYWORDS) as TemplateLane[]).filter(
    (entry) => entry !== lane && entry !== "generic",
  );
  const hasOtherLaneSignal = otherLanes.some((entry) =>
    containsKeywords(value, LANE_KEYWORDS[entry]),
  );

  return !hasOtherLaneSignal;
};

const applyLocationEeatPoints = (
  items: Array<{ title?: string | null; description?: string | null }>,
  context?: {
    locationName?: string | null;
    serviceName?: string | null;
  },
) =>
  items
    .map((item) => ({
      title: applyContextTokens(item.title || "", context),
      description: applyContextTokens(item.description || "", context),
    }))
    .filter((item) => item.title && item.description);

export const resolveTemplateCopy = ({
  base,
  page,
  template,
}: {
  base: LegacyRewriteCopy;
  page?: TemplatePageDoc | null;
  template?: TemplatePageDoc["template"] | null;
}): LegacyRewriteCopy => {
  const locationName = page?.location?.title || null;
  const serviceName = page?.serviceType?.title || page?.service?.title || null;
  const experience = resolveTemplateExperience({ page, template });
  const pageStructured = page?.structured || null;
  const templateStructured = template?.structured || null;

  let primaryKeyword = resolveVariantText({
    slot: "primaryKeyword",
    pageVariants: pageStructured?.contentVariants,
    templateVariants: templateStructured?.contentVariants,
    fallback: pickString(
      pageStructured?.primaryKeyword ?? templateStructured?.primaryKeyword,
      base.primaryKeyword,
    ),
    lane: experience.lane,
    routeKind: experience.routeKind,
    trustMode: experience.trustMode,
    locationName,
    serviceName,
    contextTags: experience.contextTags,
  });

  if (
    locationName &&
    experience.routeKind !== "base" &&
    !primaryKeyword.toLowerCase().includes(locationName.toLowerCase())
  ) {
    primaryKeyword = normalizeText(`${primaryKeyword} ${locationName}`);
  }

  const secondaryKeywords = applyContextTokensArray(
    pickArray(
      pageStructured?.secondaryKeywords ?? templateStructured?.secondaryKeywords,
      base.secondaryKeywords,
    ),
    { locationName, serviceName },
  );

  const locationAwareKeywords =
    locationName && experience.routeKind !== "base"
      ? dedupeByText(
          [...secondaryKeywords, `${primaryKeyword} ${locationName}`],
          (item) => item,
        )
      : secondaryKeywords;

  const description = resolveVariantText({
    slot: "description",
    pageVariants: pageStructured?.contentVariants,
    templateVariants: templateStructured?.contentVariants,
    fallback: pickString(
      pageStructured?.description ?? templateStructured?.description,
      base.description,
    ),
    lane: experience.lane,
    routeKind: experience.routeKind,
    trustMode: experience.trustMode,
    locationName,
    serviceName,
    contextTags: experience.contextTags,
  });

  const intro = resolveVariantText({
    slot: "intro",
    pageVariants: pageStructured?.contentVariants,
    templateVariants: templateStructured?.contentVariants,
    fallback: pickString(
      pageStructured?.intro ?? templateStructured?.intro,
      base.intro,
    ),
    lane: experience.lane,
    routeKind: experience.routeKind,
    trustMode: experience.trustMode,
    locationName,
    serviceName,
    contextTags: experience.contextTags,
  });

  const highlights = dedupeByText(
    applyContextTokensArray(
      pickArray(pageStructured?.highlights ?? templateStructured?.highlights, base.highlights),
      { locationName, serviceName },
    ),
    (item) => item,
  ).slice(0, 4);

  const eeatPoints = applyLocationEeatPoints(
    pickArray(pageStructured?.eeatPoints ?? templateStructured?.eeatPoints, []),
    { locationName, serviceName },
  ).filter((item) =>
    isRelevantToLane(`${item.title} ${item.description}`, experience.lane),
  );

  const process = dedupeByText(
    applyContextTokensArray(
      pickArray(pageStructured?.process ?? templateStructured?.process, base.process),
      { locationName, serviceName },
    ),
    (item) => item,
  ).slice(0, 4);

  const faqs = dedupeByText(
    pickArray(pageStructured?.faqs ?? templateStructured?.faqs, base.faqs)
      .map((item) => ({
        question: applyContextTokens(pickString(item.question), {
          locationName,
          serviceName,
        }),
        answer: applyContextTokens(pickString(item.answer), {
          locationName,
          serviceName,
        }),
      }))
      .filter(
        (item) =>
          item.question &&
          item.answer &&
          !item.question.includes("{") &&
          isRelevantToLane(`${item.question} ${item.answer}`, experience.lane),
      ),
    (item) => `${item.question} ${item.answer}`,
  ).slice(0, 4);

  const ctaLabel = resolveVariantText({
    slot: "ctaLabel",
    pageVariants: pageStructured?.contentVariants,
    templateVariants: templateStructured?.contentVariants,
    fallback: pickString(
      pageStructured?.ctaLabel ?? templateStructured?.ctaLabel,
      base.ctaLabel,
    ),
    lane: experience.lane,
    routeKind: experience.routeKind,
    trustMode: experience.trustMode,
    locationName,
    serviceName,
    contextTags: experience.contextTags,
  });
  const ctaHref =
    resolveLinkHref(pageStructured?.ctaLink) ||
    resolveLinkHref(templateStructured?.ctaLink) ||
    base.ctaHref;

  const ctaLinks = resolveCtaLinks(
    pageStructured?.ctaLinks ?? templateStructured?.ctaLinks,
    base.ctaLinks,
    locationName,
    serviceName,
    experience.sourcePolicy.maxQuickLinks ?? undefined,
  );

  const serviceTypes = dedupeByText(
    pickArray(
      pageStructured?.serviceTypes ?? templateStructured?.serviceTypes,
      base.serviceTypes || [],
    )
      .map((item) => ({
        title: applyContextTokens(pickString(item.title), {
          locationName,
          serviceName,
        }),
        description: applyContextTokens(pickString(item.description), {
          locationName,
          serviceName,
        }),
        image: resolveImageUrl(item.image),
        href: resolveLinkHref(item.link),
      }))
      .filter(
        (item) =>
          item.title &&
          item.description &&
          isRelevantToLane(`${item.title} ${item.description}`, experience.lane),
      ),
    (item) => `${item.title} ${item.description}`,
  ).slice(0, 6);

  const pricingPlans = dedupeByText(
    selectBySourceMode(
      experience.sourcePolicy.pricingSource,
      pageStructured?.pricingPlans,
      templateStructured?.pricingPlans,
      base.pricingPlans || [],
    )
      .map((item) => ({
        name: applyContextTokens(pickString(item.name ?? "", ""), {
          locationName,
          serviceName,
        }),
        price: pickString(item.price ?? "", ""),
        description: applyContextTokens(
          pickString(item.description ?? "", ""),
          { locationName, serviceName },
        ),
        items: dedupeByText(
          applyContextTokensArray(pickArray(item.items || [], []), {
            locationName,
            serviceName,
          }),
          (entry) => entry,
        ),
        recommended: Boolean(item.recommended),
      }))
      .filter(
        (item) =>
          item.name &&
          item.price &&
          item.items.length > 0 &&
          isRelevantToLane(`${item.name} ${item.description} ${item.items.join(" ")}`, experience.lane),
      ),
    (item) => `${item.name} ${item.price}`,
  ).slice(0, 3);

  const features = dedupeByText(
    pickArray(pageStructured?.features ?? templateStructured?.features, base.features || [])
      .map((item) => ({
        title: applyContextTokens(pickString(item.title ?? "", ""), {
          locationName,
          serviceName,
        }),
        description: applyContextTokens(
          pickString(item.description ?? "", ""),
          { locationName, serviceName },
        ),
        icon: item.icon || undefined,
      }))
      .filter(
        (item) =>
          item.title &&
          item.description &&
          isRelevantToLane(`${item.title} ${item.description}`, experience.lane),
      ),
    (item) => `${item.title} ${item.description}`,
  ).slice(0, 6);

  const proofItems = dedupeByText(
    selectBySourceMode(
      experience.sourcePolicy.proofSource,
      pageStructured?.proofItems,
      templateStructured?.proofItems,
      base.proofItems || [],
    )
      .map((item) => ({
        title: applyContextTokens(pickString(item.title ?? "", ""), {
          locationName,
          serviceName,
        }),
        description: applyContextTokens(
          pickString(item.description ?? "", ""),
          { locationName, serviceName },
        ),
        image: resolveImageUrl(item.image),
        href: resolveLinkHref(item.link),
      }))
      .filter(
        (item) =>
          item.title &&
          item.description &&
          isRelevantToLane(`${item.title} ${item.description}`, experience.lane),
      ),
    (item) => `${item.title} ${item.description}`,
  ).slice(0, 4);

  const testimonials = dedupeByText(
    selectBySourceMode(
      experience.sourcePolicy.testimonialSource,
      pageStructured?.testimonials,
      templateStructured?.testimonials,
      base.testimonials || [],
    )
      .map((item) => ({
        name: applyContextTokens(pickString(item.name ?? "", ""), {
          locationName,
          serviceName,
        }),
        role: applyContextTokens(pickString(item.role ?? "", ""), {
          locationName,
          serviceName,
        }),
        quote: applyContextTokens(pickString(item.quote ?? "", ""), {
          locationName,
          serviceName,
        }),
      }))
      .filter(
        (item) =>
          item.name &&
          item.quote &&
          isRelevantToLane(`${item.role} ${item.quote}`, experience.lane),
      ),
    (item) => `${item.name} ${item.quote}`,
  ).slice(0, 3);

  const longGuide = dedupeByText(
    pickArray(pageStructured?.longGuide ?? templateStructured?.longGuide, base.longGuide || [])
      .map((item) => ({
        title: applyContextTokens(pickString(item.title ?? "", ""), {
          locationName,
          serviceName,
        }),
        description: applyContextTokens(
          pickString(item.description ?? "", ""),
          { locationName, serviceName },
        ),
      }))
      .filter(
        (item) =>
          item.title &&
          item.description &&
          isRelevantToLane(`${item.title} ${item.description}`, experience.lane),
      ),
    (item) => `${item.title} ${item.description}`,
  ).slice(0, 4);

  const finalCtaTitle = resolveVariantText({
    slot: "finalCtaTitle",
    pageVariants: pageStructured?.contentVariants,
    templateVariants: templateStructured?.contentVariants,
    fallback: pickString(
      pageStructured?.finalCtaTitle ?? templateStructured?.finalCtaTitle,
      base.finalCtaTitle || "",
    ),
    lane: experience.lane,
    routeKind: experience.routeKind,
    trustMode: experience.trustMode,
    locationName,
    serviceName,
    contextTags: experience.contextTags,
  });

  const finalCtaDescription = resolveVariantText({
    slot: "finalCtaDescription",
    pageVariants: pageStructured?.contentVariants,
    templateVariants: templateStructured?.contentVariants,
    fallback: pickString(
      pageStructured?.finalCtaDescription ?? templateStructured?.finalCtaDescription,
      base.finalCtaDescription || "",
    ),
    lane: experience.lane,
    routeKind: experience.routeKind,
    trustMode: experience.trustMode,
    locationName,
    serviceName,
    contextTags: experience.contextTags,
  });

  return {
    primaryKeyword,
    secondaryKeywords: locationAwareKeywords,
    description,
    intro,
    highlights: highlights.length > 0 ? highlights : base.highlights,
    eeatPoints,
    process: process.length > 0 ? process : base.process,
    faqs: faqs.length > 0 ? faqs : base.faqs,
    ctaLabel,
    ctaHref,
    ctaLinks,
    serviceTypes: serviceTypes.length > 0 ? serviceTypes : base.serviceTypes,
    pricingPlans: pricingPlans.length > 0 ? pricingPlans : base.pricingPlans,
    features: features.length > 0 ? features : base.features,
    proofItems: proofItems.length > 0 ? proofItems : base.proofItems,
    testimonials: testimonials.length > 0 ? testimonials : base.testimonials,
    longGuide: longGuide.length > 0 ? longGuide : base.longGuide,
    finalCtaTitle,
    finalCtaDescription,
  };
};

export const resolveTemplateMeta = ({
  page,
  template,
}: {
  page?: TemplateMeta | null;
  template?: TemplateMeta | null;
}): TemplateMeta | null => {
  const pageHasMeta =
    Boolean(page?.title) ||
    Boolean(page?.description) ||
    Boolean(page?.canonicalUrl) ||
    Boolean(page?.focusKeyword) ||
    Boolean(page?.secondaryKeywords?.length) ||
    typeof page?.noindex === "boolean" ||
    Boolean(page?.image);
  const templateHasMeta =
    Boolean(template?.title) ||
    Boolean(template?.description) ||
    Boolean(template?.canonicalUrl) ||
    Boolean(template?.focusKeyword) ||
    Boolean(template?.secondaryKeywords?.length) ||
    typeof template?.noindex === "boolean" ||
    Boolean(template?.image);
  if (pageHasMeta) return page || null;
  if (templateHasMeta) return template || null;
  return page || template || null;
};

export const resolveTemplateHero = ({
  page,
  template,
}: {
  page?: TemplatePageDoc | null;
  template?: TemplatePageDoc["template"] | null;
}) => ({
  eyebrow: page?.heroEyebrow || template?.heroEyebrow || undefined,
  image: page?.heroImage || template?.heroImage || undefined,
});

export const resolvePrimaryHeroEyebrow = ({
  page,
  template,
}: {
  page?: TemplatePageDoc | null;
  template?: TemplatePageDoc["template"] | null;
}) => {
  const experience = resolveTemplateExperience({ page, template });
  const locationName = page?.location?.title || null;
  const serviceName = page?.serviceType?.title || page?.service?.title || null;

  return resolveVariantText({
    slot: "heroEyebrow",
    pageVariants: page?.structured?.contentVariants,
    templateVariants: template?.structured?.contentVariants,
    fallback: pickString(page?.heroEyebrow ?? template?.heroEyebrow, ""),
    lane: experience.lane,
    routeKind: experience.routeKind,
    trustMode: experience.trustMode,
    locationName,
    serviceName,
    contextTags: experience.contextTags,
  });
};

export const resolveNarrativeSections = ({
  page,
  template,
  copy,
}: {
  page?: TemplatePageDoc | null;
  template?: TemplatePageDoc["template"] | null;
  copy: LegacyRewriteCopy;
}) => {
  const experience = resolveTemplateExperience({ page, template });
  const locationSectionEnabled = Boolean(page?.location?.overview || page?.location?.highlights?.length);
  const hasQuickLinks = Boolean(copy.ctaLinks?.length);
  const hasServiceTypes = Boolean(copy.serviceTypes?.length);
  const hasPricing = Boolean(copy.pricingPlans?.length);
  const hasFeatures = Boolean(copy.features?.length);
  const hasProof = Boolean(copy.proofItems?.length);
  const hasTestimonials = Boolean(copy.testimonials?.length);
  const hasGuide = Boolean(copy.longGuide?.length);
  const hasEeat = Boolean(copy.eeatPoints?.length);

  const sectionOrderByLane: Record<TemplateLane, string[]> = {
    website: [
      "utility",
      "highlights",
      "serviceTypes",
      "features",
      "proof",
      "pricing",
      "testimonials",
      "eeat",
      "processFaq",
      "longGuide",
      "finalCta",
      "relatedLinks",
    ],
    printing: [
      "utility",
      "highlights",
      "serviceTypes",
      "pricing",
      "features",
      "proof",
      "testimonials",
      "processFaq",
      "longGuide",
      "finalCta",
      "relatedLinks",
    ],
    software: [
      "utility",
      "location",
      "highlights",
      "serviceTypes",
      "proof",
      "features",
      "pricing",
      "testimonials",
      "eeat",
      "processFaq",
      "longGuide",
      "finalCta",
      "relatedLinks",
    ],
    generic: [
      "utility",
      "serviceTypes",
      "features",
      "proof",
      "processFaq",
      "finalCta",
      "relatedLinks",
    ],
  };

  const requested =
    sectionOrderByLane[experience.lane] || sectionOrderByLane.generic;
  return requested.filter((section) => {
    switch (section) {
      case "utility":
        return hasQuickLinks || hasServiceTypes || hasPricing || hasProof || hasTestimonials || hasGuide;
      case "location":
        return locationSectionEnabled;
      case "serviceTypes":
        return hasServiceTypes;
      case "pricing":
        return hasPricing;
      case "features":
        return hasFeatures;
      case "proof":
        return hasProof;
      case "testimonials":
        return hasTestimonials;
      case "eeat":
        return hasEeat;
      case "longGuide":
        return hasGuide;
      default:
        return true;
    }
  });
};
