import { readFileSync } from "node:fs";
import path from "node:path";
import cities from "@/content/astro-local/jasa-cetak-buku-kota/cities.json";
import excludedSlugs from "@/content/astro-local/jasa-cetak-buku-kota/excluded-non-city.json";

export type JasaCetakBukuCityItem = {
  slug: string;
  citySlug: string;
  city: string;
  sourceId: string;
  title: string;
  excerpt: string;
  coverImage: string;
  status: string;
};

const CITY_ITEMS: JasaCetakBukuCityItem[] = cities as JasaCetakBukuCityItem[];
const CITY_MAP = new Map<string, JasaCetakBukuCityItem>(
  CITY_ITEMS.map((item) => [item.slug, item]),
);
const EXCLUDED_SLUGS: string[] = (excludedSlugs as Array<{ slug: string }>).map(
  (item) => item.slug,
);

let templateCache: string | null = null;
const LOCAL_JASA_CETAK_BUKU_CITY_DISABLED = true;

export function getJasaCetakBukuCityBySlug(slug: string) {
  if (LOCAL_JASA_CETAK_BUKU_CITY_DISABLED) return null;
  return CITY_MAP.get(slug) || null;
}

function toCityName(citySlug: string) {
  return citySlug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getJasaCetakBukuCityBySlugOrFallback(slug: string) {
  if (LOCAL_JASA_CETAK_BUKU_CITY_DISABLED) return null;
  const matched = getJasaCetakBukuCityBySlug(slug);
  if (matched) return matched;

  if (!slug.startsWith("jasa-cetak-buku-")) return null;
  const citySlug = slug.replace(/^jasa-cetak-buku-/, "").trim();
  if (!citySlug) return null;

  const city = toCityName(citySlug);
  return {
    slug,
    citySlug,
    city,
    sourceId: "",
    title: `Jasa cetak buku ${city} Terbaik`,
    excerpt: `Layanan pencetakan buku profesional di ${city} untuk penulis, penerbit, komunitas, serta lembaga dengan kualitas cetak terukur dan pengiriman nasional.`,
    coverImage: "",
    status: "published",
  } satisfies JasaCetakBukuCityItem;
}

export function getJasaCetakBukuCityStaticParams() {
  if (LOCAL_JASA_CETAK_BUKU_CITY_DISABLED) return [];
  const slugs = new Set<string>([
    ...CITY_ITEMS.map((item) => item.slug),
    ...EXCLUDED_SLUGS,
  ]);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export function getJasaCetakBukuCityTemplate() {
  if (LOCAL_JASA_CETAK_BUKU_CITY_DISABLED) return "";
  if (templateCache) return templateCache;

  const templatePath = path.join(
    process.cwd(),
    "content",
    "astro-local",
    "jasa-cetak-buku-kota",
    "template.mdx",
  );

  templateCache = readFileSync(templatePath, "utf8");
  return templateCache;
}
