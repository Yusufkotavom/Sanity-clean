import type { GeneratorSlugInput } from "./types";

const MAX_SLUG_LENGTH = 96;

const slugifySegment = (value?: string) =>
  (value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeRouteBase = (routeBase: string) => slugifySegment(routeBase.replace(/^\/+|\/+$/g, "").replace(/\//g, "-"));

const joinSegments = (parts: string[]) =>
  parts
    .filter((part) => part.length > 0)
    .join("-")
    .replace(/-+/g, "-")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/^-+|-+$/g, "");

export const buildGeneratorSlug = ({ routeBase, service, city, primaryKeyword }: GeneratorSlugInput) => {
  const segments = [
    normalizeRouteBase(routeBase),
    slugifySegment(service),
    slugifySegment(city),
    slugifySegment(primaryKeyword),
  ];

  const fallback = slugifySegment(primaryKeyword) || "generated-page";
  return joinSegments(segments) || fallback;
};

export const buildGeneratedPagePath = (slug: string) => `/${slug.replace(/^\/+/, "")}`;
