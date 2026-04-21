/**
 * Local Astro fallback catalog is intentionally disabled.
 * Sanity is the only source of truth for public routes.
 */

export type LegacyAstroPage = {
  route: string;
  section: string;
  slug: string;
  sourceFile: string;
  title: string;
  migrationStatus: "draft" | string;
};

const pages: LegacyAstroPage[] = [];

const SECTION_SLUG_ALIASES: Record<string, Record<string, string>> = {};

export function getLegacyRoute(route: string): LegacyAstroPage | null {
  return pages.find((item) => item.route === route) ?? null;
}

export function getLegacySectionIndex(section: string): LegacyAstroPage | null {
  return getLegacyRoute(`/${section}`);
}

export function getLegacySectionChildren(section: string): LegacyAstroPage[] {
  return pages.filter(
    (item) =>
      item.section === section &&
      item.route.startsWith(`/${section}/`) &&
      item.route.split("/").filter(Boolean).length === 2,
  );
}

export function getLegacySectionDescendants(section: string): LegacyAstroPage[] {
  return pages.filter(
    (item) => item.section === section && item.route.startsWith(`/${section}/`),
  );
}

export function getLegacySectionSlug(
  section: string,
  slug: string,
): LegacyAstroPage | null {
  const direct = getLegacyRoute(`/${section}/${slug}`);
  if (direct) return direct;

  const aliasedSlug = SECTION_SLUG_ALIASES[section]?.[slug];
  if (!aliasedSlug) return null;

  return getLegacyRoute(`/${section}/${aliasedSlug}`);
}

export function getLegacySinglePage(section: string): LegacyAstroPage | null {
  return getLegacyRoute(`/${section}`);
}

export function getLegacyRoutesByPrefix(prefix: string): LegacyAstroPage[] {
  return pages.filter((item) => item.route.startsWith(prefix));
}

export function getLegacySectionRouteBySegments(
  section: string,
  segments: string[],
): LegacyAstroPage | null {
  if (segments.length === 0) return getLegacySectionIndex(section);
  if (segments.length === 1) return getLegacySectionSlug(section, segments[0]);
  return getLegacyRoute(`/${section}/${segments.join("/")}`);
}

export function getLegacySectionAliasSlugs(section: string): string[] {
  return Object.keys(SECTION_SLUG_ALIASES[section] || {});
}

export function getLegacySections() {
  return Array.from(new Set(pages.map((item) => item.section))).sort();
}
