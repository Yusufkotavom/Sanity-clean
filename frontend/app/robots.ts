import { MetadataRoute } from "next";
import { fetchSanitySeoSettings } from "@/sanity/lib/fetch";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = (await fetchSanitySeoSettings()) as
    | {
        defaultNoIndex?: boolean;
        siteUrl?: string;
        robotsDisallowPaths?: string[] | null;
        aiCrawlerAllowlist?: string[] | null;
      }
    | null;
  const siteUrl = seo?.siteUrl?.trim()?.replace(/\/+$/, "") || "";
  const disallowPaths = (seo?.robotsDisallowPaths || []).filter(
    (path): path is string => typeof path === "string" && path.startsWith("/"),
  );
  const aiCrawlers = (seo?.aiCrawlerAllowlist || []).filter(
    (crawler): crawler is string => typeof crawler === "string" && crawler.trim().length > 0,
  );
  const siteWideNoIndex = Boolean(seo?.defaultNoIndex);

  const rules: MetadataRoute.Robots["rules"] = [
    {
      userAgent: "*",
      ...(siteWideNoIndex ? { disallow: "/" } : { allow: "/" }),
    },
  ];

  if (!siteWideNoIndex && disallowPaths.length) {
    rules.push({
      userAgent: "*",
      disallow: disallowPaths,
    });
  }

  aiCrawlers.forEach((crawler) => {
    rules.push({
      userAgent: crawler,
      allow: "/",
    });
  });

  return {
    rules,
    sitemap: siteUrl ? [`${siteUrl}/sitemap.xml`] : [],
  };
}
