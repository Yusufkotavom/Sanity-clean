import {
  fetchSanityNavigation,
  fetchSanityPosts,
  fetchSanityProducts,
  fetchSanityProjects,
  fetchSanitySeoSettings,
  fetchSanityServices,
  fetchSanitySettings,
} from "@/sanity/lib/fetch";

type LinkItem = {
  title?: string | null;
  href?: string | null;
  children?: Array<{
    title?: string | null;
    href?: string | null;
  }> | null;
};

function normalizeSiteUrl(siteUrl?: string | null) {
  return siteUrl?.replace(/\/+$/, "") || "";
}

function makeAbsoluteUrl(siteUrl: string, href?: string | null) {
  if (!href) return null;
  if (/^https?:\/\//i.test(href)) return href;
  if (!siteUrl) return href.startsWith("/") ? href : `/${href}`;
  return `${siteUrl}${href.startsWith("/") ? href : `/${href}`}`;
}

function asPlainText(value?: string | null) {
  return value?.replace(/\s+/g, " ").trim() || "";
}

function pickSummary(item: any) {
  return (
    asPlainText(item?.meta?.description) ||
    asPlainText(item?.excerpt) ||
    asPlainText(item?.description) ||
    ""
  );
}

function mapNavLinks(links: LinkItem[] | null | undefined, siteUrl: string) {
  return (links || [])
    .flatMap((link) => {
      const rows: Array<{ title: string; url: string }> = [];
      const href = makeAbsoluteUrl(siteUrl, link?.href);
      if (link?.title && href) rows.push({ title: link.title, url: href });

      for (const child of link?.children || []) {
        const childHref = makeAbsoluteUrl(siteUrl, child?.href);
        if (child?.title && childHref) {
          rows.push({ title: child.title, url: childHref });
        }
      }

      return rows;
    })
    .filter((item, index, array) => array.findIndex((entry) => entry.url === item.url) === index);
}

export async function buildLlmsText({ full = false }: { full?: boolean } = {}) {
  const [settings, seo, navigation, services, products, projects, posts] = await Promise.all([
    fetchSanitySettings(),
    fetchSanitySeoSettings(),
    fetchSanityNavigation(),
    fetchSanityServices(),
    fetchSanityProducts(),
    fetchSanityProjects(),
    fetchSanityPosts(),
  ]);

  const siteUrl = normalizeSiteUrl(seo?.siteUrl);
  const siteName = settings?.siteName || settings?.brandName || seo?.companyInfo?.name || "Schema UI";
  const description = asPlainText(seo?.defaultDescription);
  const companyName = seo?.companyInfo?.name || siteName;
  const email = seo?.companyInfo?.email || "";
  const phone = seo?.companyInfo?.phone || seo?.companyInfo?.whatsapp || "";
  const address = asPlainText(seo?.companyInfo?.address);
  const serviceAreas = (seo?.companyInfo?.serviceAreas || []).filter(Boolean).join(", ");

  const navLinks = mapNavLinks((navigation as any)?.links, siteUrl).slice(0, full ? 20 : 8);
  const topServices = (services as any[])
    .filter((item: any) => item?.title && item?.slug?.current)
    .slice(0, full ? 12 : 4)
    .map((item: any) => ({
      title: item.title as string,
      url: makeAbsoluteUrl(siteUrl, `/services/${item.slug.current}`) || `/services/${item.slug.current}`,
      summary: pickSummary(item),
    }));
  const topProducts = (products as any[])
    .filter((item: any) => item?.title && item?.slug?.current)
    .slice(0, full ? 8 : 3)
    .map((item: any) => ({
      title: item.title as string,
      url: makeAbsoluteUrl(siteUrl, `/products/${item.slug.current}`) || `/products/${item.slug.current}`,
      summary: pickSummary(item),
    }));
  const topProjects = (projects as any[])
    .filter((item: any) => item?.title && item?.slug?.current)
    .slice(0, full ? 8 : 3)
    .map((item: any) => ({
      title: item.title as string,
      url: makeAbsoluteUrl(siteUrl, `/projects/${item.slug.current}`) || `/projects/${item.slug.current}`,
      summary: pickSummary(item),
    }));
  const topPosts = (posts as any[])
    .filter((item: any) => item?.title && item?.slug?.current)
    .slice(0, full ? 10 : 4)
    .map((item: any) => ({
      title: item.title as string,
      url: makeAbsoluteUrl(siteUrl, `/blog/${item.slug.current}`) || `/blog/${item.slug.current}`,
      summary: pickSummary(item),
    }));

  const lines: string[] = [];

  lines.push(`# ${siteName}`);
  if (description) lines.push(description);
  lines.push("");
  if (siteUrl) lines.push(`Website: ${siteUrl}`);
  lines.push(`Organization: ${companyName}`);
  if (email) lines.push(`Email: ${email}`);
  if (phone) lines.push(`Phone: ${phone}`);
  if (address) lines.push(`Address: ${address}`);
  if (serviceAreas) lines.push(`Service Areas: ${serviceAreas}`);
  lines.push("");

  if (navLinks.length > 0) {
    lines.push("## Key Pages");
    for (const item of navLinks) {
      lines.push(`- [${item.title}](${item.url})`);
    }
    lines.push("");
  }

  if (topServices.length > 0) {
    lines.push("## Services");
    for (const item of topServices) {
      lines.push(
        `- [${item.title}](${item.url})${item.summary ? `: ${item.summary}` : ""}`,
      );
    }
    lines.push("");
  }

  if (topProducts.length > 0) {
    lines.push("## Products");
    for (const item of topProducts) {
      lines.push(
        `- [${item.title}](${item.url})${item.summary ? `: ${item.summary}` : ""}`,
      );
    }
    lines.push("");
  }

  if (topProjects.length > 0) {
    lines.push("## Projects");
    for (const item of topProjects) {
      lines.push(
        `- [${item.title}](${item.url})${item.summary ? `: ${item.summary}` : ""}`,
      );
    }
    lines.push("");
  }

  if (topPosts.length > 0) {
    lines.push("## Articles");
    for (const item of topPosts) {
      lines.push(
        `- [${item.title}](${item.url})${item.summary ? `: ${item.summary}` : ""}`,
      );
    }
    lines.push("");
  }

  if (full) {
    lines.push("## Notes");
    lines.push(
      "This machine-readable summary is generated from the live Sanity content model and global SEO settings.",
    );
    lines.push(
      "Canonical URL policy, robots policy, sitemap policy, and structured-data URL behavior are managed through Sanity SEO settings.",
    );
    lines.push("");
  }

  return `${lines.join("\n").trim()}\n`;
}
