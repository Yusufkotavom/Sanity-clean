import { createSanityWriteClient, loadSanityEnv } from "./lib/sanity-page-guards.mjs";

const DOC_ID = "page-home-sanity";

function portableText(text, key = "pt-1") {
  return [
    {
      _key: key,
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [
        {
          _key: `${key}-span-1`,
          _type: "span",
          marks: [],
          text,
        },
      ],
    },
  ];
}

async function run() {
  const write = process.argv.includes("--write");
  const client = await createSanityWriteClient();
  const env = await loadSanityEnv();
  const siteUrl =
    env.NEXT_PUBLIC_SITE_URL || env.SANITY_STUDIO_FRONTEND_URL || env.SANITY_STUDIO_PREVIEW_URL;

  if (!siteUrl) {
    throw new Error(
      "Missing site URL. Set NEXT_PUBLIC_SITE_URL (preferred) or SANITY_STUDIO_FRONTEND_URL/SANITY_STUDIO_PREVIEW_URL before seeding /home-sanity.",
    );
  }

  const normalizedSiteUrl = siteUrl.trim().replace(/\/+$/, "");

  const pageDoc = {
    _id: DOC_ID,
    _type: "page",
    title: "DEVK STUDIO — Jasa Pembuatan Software & Website",
    slug: { _type: "slug", current: "home-sanity" },
    blocks: [
      {
        _key: "hero-main",
        _type: "hero-1",
        tagLine: "DEVK STUDIO",
        title: "Jasa Pembuatan Software dan Website untuk Bisnis yang Siap Naik Level",
        body: portableText(
          "Kami bantu Anda merancang, membangun, dan menjalankan software custom serta website bisnis dengan scope jelas, timeline realistis, dan fokus hasil."
        ),
        links: [
          {
            _key: "hero-link-1",
            _type: "link",
            title: "Konsultasi Gratis",
            isExternal: true,
            href: "/contact",
            target: false,
            buttonVariant: "default",
          },
          {
            _key: "hero-link-2",
            _type: "link",
            title: "Lihat Layanan",
            isExternal: true,
            href: "/services",
            target: false,
            buttonVariant: "outline",
          },
        ],
      },
      {
        _key: "problem-block",
        _type: "problem-solution-block",
        title: "Masih Pusing dengan Proses Bisnis yang Berantakan?",
        problems: [
          "Website lama sulit menghasilkan leads karena struktur halaman tidak meyakinkan.",
          "Proses operasional masih manual dan bikin tim lambat ambil keputusan.",
          "Vendor sebelumnya membuat proyek melebar tanpa prioritas yang jelas.",
        ],
        solutionTitle: "Solusi dari DEVK STUDIO",
        solution:
          "Kami bangun website dan software berdasarkan kebutuhan bisnis nyata, bukan template generik. Hasilnya: proses kerja lebih rapi, tim lebih cepat, dan konversi lebih terukur.",
      },
      {
        _key: "value-props-main",
        _type: "value-props-block",
        title: "Kenapa Bisnis Memilih DEVK STUDIO",
        description: "Pendekatan kerja yang fokus pada hasil, bukan hanya deliverable teknis.",
        valueProps: [
          {
            _key: "value-prop-1",
            icon: "01",
            title: "Strategi Sebelum Eksekusi",
            description: "Kami mulai dari audit kebutuhan dan prioritas agar proyek tidak melebar.",
          },
          {
            _key: "value-prop-2",
            icon: "02",
            title: "Build Bertahap dan Terukur",
            description: "Setiap milestone punya output jelas sehingga progres mudah dipantau tim Anda.",
          },
          {
            _key: "value-prop-3",
            icon: "03",
            title: "Pendampingan Pasca Rilis",
            description: "Kami bantu optimasi setelah go-live supaya sistem benar-benar dipakai dan berkembang.",
          },
        ],
      },
      {
        _key: "features-main",
        _type: "features-package-block",
        title: "Yang Anda Dapatkan",
        subtitle: "Bukan Sekadar Coding",
        description: "Satu rangkaian implementasi dari discovery sampai stabilisasi.",
        features: [
          {
            _key: "feature-1",
            icon: "🧭",
            title: "Discovery dan Solution Mapping",
            description: "Menerjemahkan kebutuhan bisnis menjadi roadmap fitur yang realistis.",
            badge: "Planning",
          },
          {
            _key: "feature-2",
            icon: "🛠️",
            title: "Website & Software Development",
            description: "Pengembangan terstruktur untuk frontend, backend, dashboard, dan integrasi proses.",
            badge: "Implementation",
          },
          {
            _key: "feature-3",
            icon: "✅",
            title: "Testing, Launch, dan Iterasi",
            description: "Validasi kualitas sebelum rilis dan improvement berkelanjutan setelah live.",
            badge: "Go-Live",
          },
        ],
      },
      {
        _key: "pricing-main",
        _type: "pricing-block",
        title: "Paket Pengerjaan",
        description: "Pilih jalur implementasi yang sesuai target bisnis Anda.",
        category: "software",
      },
      {
        _key: "testimonials-main",
        _type: "testimonials-block",
        title: "Apa Kata Klien DEVK STUDIO",
        description: "Ulasan klien yang sudah menjalankan website dan software bersama tim kami.",
        category: "software",
      },
      {
        _key: "faq-main",
        _type: "faqs",
        title: "Pertanyaan yang Sering Ditanyakan",
        description: "Jawaban cepat untuk membantu Anda memutuskan langkah berikutnya.",
        category: "software",
      },
      {
        _key: "cta-final",
        _type: "cta-1",
        tagLine: "Siap Mulai?",
        title: "Mari Bangun Website atau Software yang Benar-Benar Dipakai Tim Anda",
        body: portableText(
          "Jadwalkan konsultasi awal bersama DEVK STUDIO. Kami bantu petakan kebutuhan, estimasi scope, dan prioritas implementasi paling masuk akal untuk bisnis Anda.",
          "pt-final"
        ),
        links: [
          {
            _key: "cta-link-1",
            _type: "link",
            title: "Jadwalkan Konsultasi",
            isExternal: true,
            href: "/contact",
            target: false,
            buttonVariant: "default",
          },
          {
            _key: "cta-link-2",
            _type: "link",
            title: "Lihat Portfolio Proyek",
            isExternal: true,
            href: "/projects",
            target: false,
            buttonVariant: "outline",
          },
        ],
      },
    ],
    meta: {
      title: "DEVK STUDIO — Jasa Pembuatan Software & Website",
      description:
        "Landing page DEVK STUDIO untuk jasa pembuatan software custom dan website bisnis dengan pendekatan strategis, eksekusi terukur, dan pendampingan pasca rilis.",
      canonicalUrl: `${normalizedSiteUrl}/home-sanity`,
      noindex: false,
    },
  };

  if (!write) {
    console.log("DRY RUN: home-sanity landing payload prepared");
    console.log(
      JSON.stringify(
        {
          id: DOC_ID,
          slug: pageDoc.slug.current,
          blockCount: pageDoc.blocks.length,
        },
        null,
        2
      )
    );
    console.log("Run with --write to upsert the document.");
    return;
  }

  await client.createOrReplace(pageDoc);
  console.log("✅ Upserted page-home-sanity (/home-sanity)");
}

run().catch((error) => {
  console.error("❌ Failed to seed /home-sanity:", error);
  process.exitCode = 1;
});
