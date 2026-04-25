import { createSanityWriteClient, loadSanityEnv } from "./lib/sanity-page-guards.mjs";

const args = new Set(process.argv.slice(2));
const shouldWrite = args.has("--write");
const dryRun = !shouldWrite;

const key = (value) => value.replace(/[^a-z0-9]/gi, "-").toLowerCase();

const docs = [
  {
    _id: "seed-example-seo-settings",
    _type: "seoSettings",
    defaultTitle: "Kotacom Example",
    defaultDescription:
      "Contoh data seed untuk environment development Kotacom.",
    defaultNoIndex: false,
    noIndexBlogCategories: false,
    noIndexProductCategories: false,
    noIndexServiceCategories: false,
  },
  {
    _id: "seed-example-settings",
    _type: "settings",
    brandName: "Kotacom Example",
    whatsApp: {
      enabled: true,
      phoneNumber: "6285799520350",
      predefinedText: "Halo, saya ingin konsultasi layanan.",
      ctaText: "Chat via WhatsApp",
      enableAnimation: true,
    },
  },
  {
    _id: "seed-example-navigation",
    _type: "navigation",
    links: [
      {
        _key: "nav-home",
        _type: "link",
        title: "Home",
        isExternal: false,
        target: false,
        buttonVariant: "ghost",
        internalLink: { _type: "reference", _ref: "seed-example-page-home" },
      },
      {
        _key: "nav-services",
        _type: "link",
        title: "Services",
        isExternal: false,
        target: false,
        buttonVariant: "ghost",
        href: "/services",
      },
      {
        _key: "nav-blog",
        _type: "link",
        title: "Blog",
        isExternal: false,
        target: false,
        buttonVariant: "ghost",
        href: "/blog",
      },
    ],
    headerCta: {
      _type: "link",
      title: "Konsultasi",
      isExternal: false,
      target: false,
      buttonVariant: "default",
      href: "/contact",
    },
  },
  {
    _id: "seed-example-category-website",
    _type: "category",
    title: "Website",
    slug: { _type: "slug", current: "website" },
    description: "Kategori layanan dan konten website.",
  },
  {
    _id: "seed-example-category-software",
    _type: "category",
    title: "Software",
    slug: { _type: "slug", current: "software" },
    description: "Kategori layanan dan konten software.",
  },
  {
    _id: "seed-example-page-home",
    _type: "page",
    title: "Home Example",
    slug: { _type: "slug", current: "index" },
    topBlockCount: 2,
  },
  {
    _id: "seed-example-service-landing-page",
    _type: "service",
    title: "Jasa Landing Page",
    slug: { _type: "slug", current: "jasa-landing-page" },
    excerpt: "Pembuatan landing page cepat, ringan, dan fokus konversi.",
    duration: "7-14 hari",
    startingPrice: 4500000,
    currency: "IDR",
    featured: true,
    categories: [
      {
        _key: "service-cat-website",
        _type: "reference",
        _ref: "seed-example-category-website",
      },
    ],
    cta: {
      _type: "link",
      title: "Minta Penawaran",
      isExternal: false,
      target: false,
      buttonVariant: "default",
      href: "/contact",
    },
  },
  {
    _id: "seed-example-product-template-bundle",
    _type: "product",
    title: "Template Bundle Bisnis",
    slug: { _type: "slug", current: "template-bundle-bisnis" },
    excerpt: "Kumpulan template siap pakai untuk kebutuhan promosi digital.",
    price: 299000,
    currency: "IDR",
    availability: "in-stock",
    featured: true,
    categories: [
      {
        _key: "product-cat-website",
        _type: "reference",
        _ref: "seed-example-category-website",
      },
    ],
    cta: {
      _type: "link",
      title: "Beli Sekarang",
      isExternal: false,
      target: false,
      buttonVariant: "default",
      href: "/products/template-bundle-bisnis",
    },
  },
  {
    _id: "seed-example-project-kotacom-redesign",
    _type: "project",
    title: "Kotacom Website Redesign",
    slug: { _type: "slug", current: "kotacom-website-redesign" },
    excerpt: "Redesign website korporat Kotacom dengan fokus UX dan SEO.",
    clientName: "Kotacom",
    industry: "Digital Agency",
    completionYear: 2026,
    projectType: "website",
    projectUrl: "https://www.kotacom.id",
    featured: true,
    categories: [
      {
        _key: "project-cat-website",
        _type: "reference",
        _ref: "seed-example-category-website",
      },
    ],
    cta: {
      _type: "link",
      title: "Lihat Detail",
      isExternal: false,
      target: false,
      buttonVariant: "default",
      href: "/projects/kotacom-website-redesign",
    },
  },
  {
    _id: "seed-example-post-panduan-seo-teknis",
    _type: "post",
    title: "Panduan SEO Teknis untuk Website Bisnis",
    slug: { _type: "slug", current: "panduan-seo-teknis-website-bisnis" },
    excerpt:
      "Checklist SEO teknis dasar untuk meningkatkan crawlability, indexability, dan performa.",
    categories: [
      {
        _key: "post-cat-website",
        _type: "reference",
        _ref: "seed-example-category-website",
      },
      {
        _key: "post-cat-software",
        _type: "reference",
        _ref: "seed-example-category-software",
      },
    ],
  },
];

async function main() {
  const env = await loadSanityEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) {
    throw new Error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in env.",
    );
  }

  console.log(`Sanity target: project=${projectId}, dataset=${dataset}`);
  console.log(`Mode: ${dryRun ? "DRY RUN" : "WRITE"}`);

  const client = await createSanityWriteClient();

  if (dryRun) {
    for (const doc of docs) {
      console.log(`- would upsert ${doc._type} (${doc._id})`);
    }
    console.log(`Total docs prepared: ${docs.length}`);
    return;
  }

  const tx = client.transaction();
  for (const doc of docs) {
    tx.createOrReplace(doc);
  }
  await tx.commit({ autoGenerateArrayKeys: true });

  const counts = await client.fetch(`
    {
      "page": count(*[_id in $ids && _type == "page"]),
      "post": count(*[_id in $ids && _type == "post"]),
      "product": count(*[_id in $ids && _type == "product"]),
      "service": count(*[_id in $ids && _type == "service"]),
      "project": count(*[_id in $ids && _type == "project"]),
      "category": count(*[_id in $ids && _type == "category"]),
      "settings": count(*[_id in $ids && _type == "settings"]),
      "seoSettings": count(*[_id in $ids && _type == "seoSettings"]),
      "navigation": count(*[_id in $ids && _type == "navigation"])
    }
  `, {
    ids: docs.map((doc) => doc._id),
  });

  console.log("Seed commit complete.");
  console.log("Inserted/updated counts:", counts);
}

main().catch((err) => {
  console.error("Seed failed:", err?.message || err);
  process.exit(1);
});
