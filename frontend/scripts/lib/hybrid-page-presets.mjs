const DEFAULT_WHATSAPP_URL = "https://wa.me/6281335275219";

export const HYBRID_ELIGIBLE_SLUGS = new Set([
  "about",
  "bug-fixes",
  "contact",
  "home-pepar",
  "index",
  "layanan",
  "os-installation",
  "pembuatan-website",
  "percetakan",
  "services",
  "sistem-pos",
  "software",
  "software-development",
  "vitpos",
]);

function createPortableTextBlock(text, keyPrefix) {
  return [
    {
      _key: `${keyPrefix}-block-0`,
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [
        {
          _key: `${keyPrefix}-span-0`,
          _type: "span",
          marks: [],
          text,
        },
      ],
    },
  ];
}

function createLink({ key, title, href, isExternal, buttonVariant = "link" }) {
  const resolvedIsExternal =
    typeof isExternal === "boolean" ? isExternal : /^https?:\/\//i.test(href);

  return {
    _key: key,
    _type: "link",
    title,
    isExternal: resolvedIsExternal,
    href,
    buttonVariant,
  };
}

function createSectionHeader({ key, tagLine, title, description }) {
  return {
    _key: key,
    _type: "section-header",
    colorVariant: "background",
    sectionWidth: "default",
    stackAlign: "left",
    tagLine,
    title,
    description,
  };
}

function createGridRow({ key, columns, gridColumns = "grid-cols-3" }) {
  return {
    _key: key,
    _type: "grid-row",
    colorVariant: "background",
    gridColumns,
    columns: columns.map((column, index) => ({
      _key: `${key}-column-${index}`,
      _type: "grid-card",
      title: column.title,
      excerpt: column.excerpt,
      link: createLink({
        key: `${key}-column-link-${index}`,
        title: column.linkTitle || "Lihat detail",
        href: column.href,
        buttonVariant: "link",
      }),
    })),
  };
}

function createCta({ key, tagLine, title, body, primaryHref, primaryTitle, secondaryHref, secondaryTitle }) {
  return {
    _key: key,
    _type: "cta-1",
    colorVariant: "primary",
    sectionWidth: "default",
    stackAlign: "left",
    tagLine,
    title,
    body: createPortableTextBlock(body, `${key}-body`),
    links: [
      createLink({
        key: `${key}-link-primary`,
        title: primaryTitle,
        href: primaryHref,
        isExternal: true,
        buttonVariant: "default",
      }),
      createLink({
        key: `${key}-link-secondary`,
        title: secondaryTitle,
        href: secondaryHref,
        buttonVariant: "outline",
      }),
    ],
  };
}

function titleFromSlug(slug) {
  if (slug === "index") return "Homepage";
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function landingColumns(slug) {
  return [
    {
      title: "Support Layer",
      excerpt:
        "Gunakan bagian atas untuk proof ringan, framing layanan, atau context yang membantu pengunjung memahami posisi halaman ini.",
      href: `/${slug}`,
      linkTitle: "Lihat halaman",
    },
    {
      title: "Code-Owned Shell",
      excerpt:
        "Bagian inti funnel tetap hidup di code agar struktur, internal linking, dan ritme konversi tidak mudah drift saat editor bereksperimen.",
      href: "/test-page-hybrid",
      linkTitle: "Lihat blueprint",
    },
    {
      title: "Conversion Layer",
      excerpt:
        "Gunakan bagian bawah untuk CTA, FAQ, atau proof lanjutan tanpa harus memindahkan seluruh page utama menjadi full CMS.",
      href: "/contact",
      linkTitle: "Diskusikan kebutuhan",
    },
  ];
}

function buildMainLandingPreset({ slug, title }) {
  const pageTitle = title || titleFromSlug(slug);

  return {
    title: pageTitle,
    topBlockCount: 2,
    blocks: [
      createSectionHeader({
        key: "hybrid-header",
        tagLine: "Hybrid Support Layer",
        title: `${pageTitle} tetap punya shell stabil, tetapi konten support bisa bergerak lebih cepat.`,
        description:
          "Preset ini memberi susunan awal yang aman untuk page utama: proof ringan di atas, shell code-owned di tengah, dan CTA follow-up di bawah.",
      }),
      createGridRow({
        key: "hybrid-grid",
        columns: landingColumns(slug),
      }),
      createCta({
        key: "hybrid-cta",
        tagLine: "Conversion Layer",
        title: `Sempurnakan ${pageTitle} tanpa kehilangan kontrol struktur halaman.`,
        body:
          "Edit block Sanity untuk support copy dan proof, lalu biarkan shell utama tetap mengurus positioning, internal links, dan ritme konversi.",
        primaryHref: DEFAULT_WHATSAPP_URL,
        primaryTitle: "Konsultasi via WhatsApp",
        secondaryHref: `/${slug}`,
        secondaryTitle: "Review halaman",
      }),
    ],
  };
}

function buildHomepagePreset() {
  return {
    title: "Homepage",
    topBlockCount: 2,
    blocks: [
      createSectionHeader({
        key: "home-header",
        tagLine: "Homepage Hybrid",
        title: "Atur blok pembuka dan penutup homepage dari Sanity tanpa melepas positioning inti di tengah.",
        description:
          "Preset homepage menjaga section tengah tetap code-owned sambil memberi ruang untuk eksperimen hero/support/CTA melalui satu array blocks.",
      }),
      createGridRow({
        key: "home-grid",
        columns: [
          {
            title: "Website",
            excerpt: "Jelaskan lane website, company profile, landing page, dan support marketing digital dari blok atas homepage.",
            href: "/pembuatan-website",
            linkTitle: "Buka lane",
          },
          {
            title: "Software",
            excerpt: "Tambahkan bukti kemampuan otomasi, dashboard, dan sistem operasional tanpa mengubah shell homepage.",
            href: "/software",
            linkTitle: "Buka lane",
          },
          {
            title: "Percetakan",
            excerpt: "Jaga narasi end-to-end delivery dengan tetap memberi ruang untuk proof produk cetak dan CTA lintas layanan.",
            href: "/percetakan",
            linkTitle: "Buka lane",
          },
        ],
      }),
      createCta({
        key: "home-cta",
        tagLine: "Bottom Zone",
        title: "Gunakan penutup homepage untuk mendorong langkah berikutnya tanpa mengacaukan struktur utama.",
        body:
          "CTA bawah cocok untuk eksperimen message dan follow-up offer, sedangkan shell inti homepage tetap menjaga positioning Kotacom di level produk dan layanan.",
        primaryHref: DEFAULT_WHATSAPP_URL,
        primaryTitle: "Hubungi tim",
        secondaryHref: "/services",
        secondaryTitle: "Jelajahi layanan",
      }),
    ],
  };
}

export const HYBRID_PRESET_BUILDERS = {
  "main-landing": buildMainLandingPreset,
  homepage: buildHomepagePreset,
};

export function listHybridPresetNames() {
  return Object.keys(HYBRID_PRESET_BUILDERS).sort();
}

export function buildHybridPreset({ preset, slug, title }) {
  const builder = HYBRID_PRESET_BUILDERS[preset];

  if (!builder) {
    throw new Error(
      `Unknown hybrid preset "${preset}". Available presets: ${listHybridPresetNames().join(", ")}.`,
    );
  }

  return preset === "homepage" ? builder({ slug, title }) : builder({ slug, title });
}

export function buildSafePageId(slug) {
  return `page-${slug}`.replace(/[^a-z0-9-]/gi, "-").replace(/-+/g, "-");
}
