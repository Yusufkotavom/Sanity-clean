import { createSanityWriteClient, loadSanityEnv } from "./lib/sanity-page-guards.mjs";

const DOC_ID = "showcase-sanity-components";
const ICON_STAR =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.8l-5.3 2.8 1-5.8L3.5 9.2l5.9-.9L12 3z"/></svg>';
const ICON_SHIELD =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v6c0 5 3.5 8.7 7 9.9 3.5-1.2 7-4.9 7-9.9V6l-7-3z"/><path d="m9.5 12 2 2 3-3"/></svg>';
const ICON_BLOCKS =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>';

async function run() {
  const write = process.argv.includes("--write");
  const client = await createSanityWriteClient();
  const env = await loadSanityEnv();

  const pageDoc = {
    _id: DOC_ID,
    _type: "page",
    title: "Sanity Component Showcase",
    slug: { _type: "slug", current: "showcase-sanity-components" },
    blocks: [
      {
        _key: "hero-vercel-main",
        _type: "hero-vercel",
        tagLine: "Next.js on Vercel style",
        title: "Satu design language untuk semua block Sanity",
        description:
          "Contoh hero untuk menyelaraskan komponen berbasis Sanity agar visual, CTA, dan card pattern tetap konsisten.",
        ctaPrimary: {
          _key: "hero-cta-primary",
          _type: "link",
          isExternal: true,
          title: "Lihat Semua Block",
          href: "/sanity-blocks",
          target: false,
          buttonVariant: "default",
        },
        ctaSecondary: {
          _key: "hero-cta-secondary",
          _type: "link",
          isExternal: true,
          title: "Buka Route Alias",
          href: "/sanity-block",
          target: false,
          buttonVariant: "outline",
        },
        cards: [
          {
            _key: "hero-card-theme",
            _type: "hero-feature-card",
            uiIcon: { provider: "lu", name: "Sparkles", svg: ICON_STAR },
            title: "Theme Consistency",
            description: "Semua section bisa pakai style morpglass yang sama.",
          },
          {
            _key: "hero-card-cta",
            _type: "hero-feature-card",
            uiIcon: { provider: "lu", name: "ShieldCheck", svg: ICON_SHIELD },
            title: "CTA Clarity",
            description: "Primary dan secondary CTA selalu jelas di atas fold.",
          },
          {
            _key: "hero-card-scale",
            _type: "hero-feature-card",
            uiIcon: { provider: "lu", name: "Blocks", svg: ICON_BLOCKS },
            title: "Scalable Blocks",
            description: "Pattern block reusable untuk page service/product/project.",
          },
        ],
      },
      {
        _key: "grid-row-vercel-cards",
        _type: "grid-row",
        padding: "py-14",
        colorVariant: "background",
        gridColumns: "grid-cols-3",
        columns: [
          {
            _key: "grid-card-1",
            _type: "grid-card",
            cardStyle: "vercel",
            uiIcon: { provider: "lu", name: "Sparkles", svg: ICON_STAR },
            title: "Fast Iteration",
            excerpt:
              "Block card dengan icon di atas, body ringkas, dan CTA di bawah untuk hierarchy yang konsisten.",
            link: {
              _key: "grid-card-link-1",
              _type: "link",
              isExternal: true,
              title: "Explore Pattern",
              href: "/sanity-blocks",
              target: false,
              buttonVariant: "outline",
            },
          },
          {
            _key: "grid-card-2",
            _type: "grid-card",
            cardStyle: "vercel",
            uiIcon: { provider: "lu", name: "ShieldCheck", svg: ICON_SHIELD },
            title: "Stable Contract",
            excerpt:
              "Schema, GROQ, dan renderer dijaga sinkron supaya editor tidak bingung saat scale komponen.",
            link: {
              _key: "grid-card-link-2",
              _type: "link",
              isExternal: true,
              title: "Review Contract",
              href: "/sanity-block",
              target: false,
              buttonVariant: "outline",
            },
          },
          {
            _key: "grid-card-3",
            _type: "grid-card",
            cardStyle: "vercel",
            uiIcon: { provider: "lu", name: "Blocks", svg: ICON_BLOCKS },
            title: "Composable UI",
            excerpt:
              "Setiap card tetap fleksibel untuk icon, copy, dan CTA tanpa pecah dari design system.",
            link: {
              _key: "grid-card-link-3",
              _type: "link",
              isExternal: true,
              title: "Open Showcase",
              href: "/showcase-sanity-components",
              target: false,
              buttonVariant: "outline",
            },
          },
        ],
      },
    ],
    meta: {
      title: "Sanity Component Showcase",
      description:
        "Contoh halaman publik untuk review keseragaman komponen block Sanity dengan hero dan grid card style Vercel.",
      canonicalUrl: `${env.NEXT_PUBLIC_SITE_URL || "https://www.kotacom.id"}/showcase-sanity-components`,
      noindex: false,
    },
  };

  if (!write) {
    console.log("DRY RUN: document payload prepared");
    console.log(JSON.stringify({ id: DOC_ID, slug: pageDoc.slug.current, blockCount: pageDoc.blocks.length }, null, 2));
    console.log("Run with --write to upsert the document.");
    return;
  }

  await client.createOrReplace(pageDoc);
  console.log(`✅ Upserted public page: ${DOC_ID} (/showcase-sanity-components)`);
}

run().catch((error) => {
  console.error("❌ Failed to seed showcase page:", error);
  process.exitCode = 1;
});
