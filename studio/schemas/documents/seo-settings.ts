import { defineField, defineType } from "sanity";
import { SearchCheck } from "lucide-react";

export default defineType({
  name: "seoSettings",
  title: "SEO Settings",
  type: "document",
  icon: SearchCheck,
  fields: [
    defineField({
      name: "titleSuffix",
      title: "Title Suffix",
      type: "string",
      description: "Suffix used in title template. Example: Schema UI",
      initialValue: "Schema UI",
    }),
    defineField({
      name: "defaultTitle",
      title: "Default Meta Title",
      type: "string",
      initialValue: "Schema UI",
      description:
        "Fallback default meta title. If empty in rendering logic, brand name from Settings is used.",
      validation: (Rule) => Rule.required().error("Default title is required"),
    }),
    defineField({
      name: "defaultDescription",
      title: "Default Meta Description",
      type: "text",
      rows: 3,
      initialValue:
        "Modern website powered by Next.js and Sanity with scalable content management.",
      validation: (Rule) => Rule.required().error("Default description is required"),
    }),
    defineField({
      name: "defaultNoIndex",
      title: "Default No Index",
      type: "boolean",
      initialValue: false,
      description: "Applied when a page does not define its own noindex setting.",
    }),
    defineField({
      name: "siteUrl",
      title: "Canonical Site URL",
      type: "url",
      initialValue: "https://www.kotacom.id",
      description:
        "Canonical production site URL used for metadata, robots, sitemap, and structured data.",
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "siteSearchPath",
      title: "Site Search Path",
      type: "string",
      initialValue: "/search",
      description:
        "Optional search route used in WebSite SearchAction structured data. Must start with '/'.",
      validation: (Rule) =>
        Rule.custom((value: string | undefined) => {
          if (!value) return true;
          return value.startsWith("/") ? true : "Search path must start with '/'.";
        }),
    }),
    defineField({
      name: "noIndexBlogCategories",
      title: "No Index Blog Category Pages",
      type: "boolean",
      initialValue: false,
      description:
        "When enabled, all pages under /blog/category/[slug] are marked noindex and excluded from sitemap.",
    }),
    defineField({
      name: "noIndexProductCategories",
      title: "No Index Product Category Pages",
      type: "boolean",
      initialValue: false,
      description:
        "When enabled, all category listings under /products/[slug] are marked noindex and excluded from sitemap.",
    }),
    defineField({
      name: "noIndexServiceCategories",
      title: "No Index Service Category Pages",
      type: "boolean",
      initialValue: false,
      description:
        "When enabled, all category listings under /services/[slug] are marked noindex and excluded from sitemap.",
    }),
    defineField({
      name: "robotsDisallowPaths",
      title: "Robots Disallow Paths",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Optional list of path prefixes blocked in robots.txt, e.g. /internal or /preview.",
      validation: (Rule) =>
        Rule.custom((paths: string[] | undefined) => {
          if (!paths?.length) return true;
          const invalid = paths.find((path) => !path || !path.startsWith("/"));
          return invalid ? "Each disallow path must start with '/'" : true;
        }),
    }),
    defineField({
      name: "aiCrawlerAllowlist",
      title: "AI Crawler Allowlist",
      type: "array",
      of: [{ type: "string" }],
      initialValue: [
        "GPTBot",
        "ChatGPT-User",
        "ClaudeBot",
        "PerplexityBot",
        "Google-Extended",
        "Applebot-Extended",
        "Bytespider",
        "CCBot",
        "anthropic-ai",
        "FacebookBot",
        "Amazonbot",
      ],
      description:
        "User-agent names that should receive explicit allow rules in robots.txt.",
    }),
    defineField({
      name: "sitemapStaticRoutes",
      title: "Sitemap Static Routes",
      type: "array",
      of: [{ type: "string" }],
      initialValue: [
        "/about",
        "/contact",
        "/privacy",
        "/pembuatan-website",
        "/percetakan",
        "/software",
        "/sistem-pos",
        "/blog",
        "/products",
        "/projects",
        "/services",
      ],
      description:
        "Static routes that should always be included in the sitemap even when they are not backed by a Sanity page document.",
      validation: (Rule) =>
        Rule.custom((paths: string[] | undefined) => {
          if (!paths?.length) return true;
          const invalid = paths.find((path) => !path || !path.startsWith("/"));
          return invalid ? "Each sitemap static route must start with '/'" : true;
        }),
    }),
    defineField({
      name: "includeTemplateRoutesInSitemap",
      title: "Include Template Routes in Sitemap",
      type: "boolean",
      initialValue: true,
      description:
        "When enabled, template-backed routes from legacy location documents are included in sitemap output.",
    }),
    defineField({
      name: "twitterHandle",
      title: "Twitter/X Handle",
      type: "string",
      description: "Example: @schemaui",
    }),
    defineField({
      name: "defaultImage",
      title: "Default Open Graph Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "defaultAggregateRating",
      title: "Default Aggregate Rating (Global Fallback)",
      type: "aggregateRating",
      description:
        "Global default rating applied to all pages/products/services that don't have their own rating. Set this to your Google Maps or platform-verified rating.",
    }),
    // E-E-A-T & Trust Signals
    defineField({
      name: "companyInfo",
      title: "Company Information",
      type: "object",
      description: "Company trust signals for E-E-A-T",
      fields: [
        defineField({ name: "name", type: "string", title: "Company Name" }),
        defineField({ name: "foundedYear", type: "number", title: "Founded Year" }),
        defineField({ name: "address", type: "text", title: "Address" }),
        defineField({ name: "phone", type: "string", title: "Phone" }),
        defineField({ name: "whatsapp", type: "string", title: "WhatsApp" }),
        defineField({ name: "email", type: "string", title: "Email" }),
        defineField({ name: "operatingHours", type: "string", title: "Operating Hours" }),
        defineField({ name: "totalClients", type: "number", title: "Total Clients" }),
        defineField({ name: "totalProjects", type: "number", title: "Total Projects" }),
        defineField({
          name: "serviceAreas",
          type: "array",
          title: "Service Areas",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "certifications",
          type: "array",
          title: "Certifications",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "awards",
          type: "array",
          title: "Awards",
          of: [{ type: "string" }],
        }),
      ],
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      description: "Real testimonials with E-E-A-T signals",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", type: "string", title: "Name" }),
            defineField({ name: "position", type: "string", title: "Position" }),
            defineField({ name: "company", type: "string", title: "Company" }),
            defineField({ name: "industry", type: "string", title: "Industry" }),
            defineField({ name: "rating", type: "number", title: "Rating", validation: (rule) => rule.min(1).max(5) }),
            defineField({ name: "quote", type: "text", title: "Quote" }),
            defineField({
              name: "results",
              type: "object",
              title: "Results",
              fields: [
                defineField({ name: "metric", type: "string", title: "Metric" }),
                defineField({ name: "value", type: "string", title: "Value" }),
                defineField({ name: "timeframe", type: "string", title: "Timeframe" }),
              ],
            }),
            defineField({ name: "date", type: "date", title: "Date" }),
            defineField({ name: "verified", type: "boolean", title: "Verified" }),
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "company",
            },
          },
        },
      ],
    }),
    defineField({
      name: "pricingPackages",
      title: "Pricing Packages",
      type: "object",
      description: "Transparent pricing for all services",
      fields: [
        defineField({
          name: "website",
          type: "array",
          title: "Website Packages",
          of: [{ type: "pricingPackage" }],
        }),
        defineField({
          name: "software",
          type: "array",
          title: "Software Packages",
          of: [{ type: "pricingPackage" }],
        }),
        defineField({
          name: "printing",
          type: "array",
          title: "Printing Packages",
          of: [{ type: "pricingPackage" }],
        }),
      ],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "object",
      description: "Frequently asked questions by category",
      fields: [
        defineField({
          name: "website",
          type: "array",
          title: "Website FAQ",
          of: [{ type: "faqItem" }],
        }),
        defineField({
          name: "software",
          type: "array",
          title: "Software FAQ",
          of: [{ type: "faqItem" }],
        }),
        defineField({
          name: "printing",
          type: "array",
          title: "Printing FAQ",
          of: [{ type: "faqItem" }],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "defaultTitle",
      media: "defaultImage",
    },
    prepare({ title, media }) {
      return {
        title: title || "SEO Settings",
        subtitle: "Global SEO fallback configuration",
        media,
      };
    },
  },
});
