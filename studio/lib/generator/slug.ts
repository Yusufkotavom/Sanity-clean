import type { GeneratorSlugInput } from "./types";

const MAX_SLUG_LENGTH = 160;
const TOKEN_PATTERN = /\{\{\s*([a-zA-Z0-9_:-]+)\s*\}\}/g;

const slugifySegment = (value?: string) =>
  (value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeRouteBasePath = (routeBase: string) =>
  routeBase
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .map((segment) => slugifySegment(segment))
    .filter(Boolean)
    .join("/");

const normalizePath = (value: string) => {
  const cleaned = value
    .replace(/\{\{[^}]+\}\}/g, "")
    .split("/")
    .map((segment) => slugifySegment(segment))
    .filter(Boolean)
    .join("/")
    .replace(/\/+/g, "/")
    .replace(/^\/+|\/+$/g, "");

  return cleaned.slice(0, MAX_SLUG_LENGTH).replace(/^\/+|\/+$/g, "");
};

const interpolatePattern = (pattern: string, values: Record<string, string>) =>
  pattern.replace(TOKEN_PATTERN, (_match, tokenName: string) => values[tokenName] ?? "");

export const buildGeneratorSlug = ({ routeBase, service, city, primaryKeyword, slugPattern }: GeneratorSlugInput) => {
  const routeBasePath = normalizeRouteBasePath(routeBase);
  const serviceValue = slugifySegment(service);
  const cityValue = slugifySegment(city);
  const keywordValue = slugifySegment(primaryKeyword);

  const template = (slugPattern || "{{routeBase}}-{{service}}-{{city}}-{{primaryKeyword}}")
    .trim()
    .replace(/^\/+/, "");

  const composed = interpolatePattern(template, {
    routeBase: routeBasePath,
    service: serviceValue,
    city: cityValue,
    primaryKeyword: keywordValue,
  });

  const normalized = normalizePath(composed);
  const fallback = keywordValue || serviceValue || cityValue || "generated-page";

  return normalized || fallback;
};

export const buildGeneratedPagePath = (slug: string) => `/${slug.replace(/^\/+/, "")}`;
