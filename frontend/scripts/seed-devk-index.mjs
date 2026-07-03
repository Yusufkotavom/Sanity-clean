import { createSanityWriteClient, loadSanityEnv } from "./lib/sanity-page-guards.mjs";

const DOC_ID = "page-index";

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
    throw new Error("Missing site URL.");
  }

  const normalizedSiteUrl = siteUrl.trim().replace(/\/+$/, "");

  const pageDoc = {
    _id: DOC_ID,
    _type: "page",
    title: "DEVK STUDIO — One-Stop Software Solution di Surabaya & Sidoarjo",
    slug: { _type: "slug", current: "index" },
    blocks: [
      {
        _key: "hero-main",
        _type: "hero-1",
        tagLine: "DEVK STUDIO",
        title: "Your Code, Your System, Running Flawlessly.",
        body: portableText(
          "Dari pembuatan custom web apps hingga instalasi OS dan perbaikan bug server yang rumit. DevK Studio memastikan teknologi bekerja untuk Anda, bukan sebaliknya. Berbasis di Surabaya & Sidoarjo."
        ),
        links: [
          {
            _key: "hero-link-1",
            _type: "link",
            title: "Jelajahi Layanan",
            isExternal: false,
            href: "/services",
            target: false,
            buttonVariant: "default",
          },
          {
            _key: "hero-link-2",
            _type: "link",
            title: "Konsultasi Gratis",
            isExternal: false,
            href: "/contact",
            target: false,
            buttonVariant: "outline",
          },
        ],
      },
      {
        _key: "grid-services",
        _type: "grid-row",
        gridColumns: "grid-cols-3",
        columns: [
          {
            _key: "col-software",
            _type: "grid-card",
            title: "Software Development",
            excerpt: "Pembuatan aplikasi web, sistem kasir (POS), dan ERP UMKM kustom yang dirancang sesuai workflow bisnis Anda.",
            link: {
              _key: "link-software",
              _type: "link",
              title: "Pelajari Lebih Lanjut",
              href: "/software-development",
              isExternal: false
            }
          },
          {
            _key: "col-os",
            _type: "grid-card",
            title: "OS & Installation",
            excerpt: "Jasa instalasi Windows, macOS, Linux, dan dual-boot tanpa takut kehilangan data. Layanan on-site dan remote.",
            link: {
              _key: "link-os",
              _type: "link",
              title: "Pelajari Lebih Lanjut",
              href: "/os-installation",
              isExternal: false
            }
          },
          {
            _key: "col-bug",
            _type: "grid-card",
            title: "Bug Fixes & Setup",
            excerpt: "Penyelesaian error server, perbaikan dependency, dan troubleshooting bug di level kode yang menghambat operasional.",
            link: {
              _key: "link-bug",
              _type: "link",
              title: "Pelajari Lebih Lanjut",
              href: "/bug-fixes",
              isExternal: false
            }
          }
        ]
      },
      {
        _key: "problem-block",
        _type: "problem-solution-block",
        title: "Software Lambat & Infrastruktur Bermasalah?",
        problems: [
          "Aplikasi bisnis berjalan lambat dan tidak bisa menyesuaikan workflow unik Anda.",
          "Sering terjadi error server (bug) yang membuat operasional terhenti berjam-jam.",
          "Proses instalasi OS dan setup environment development selalu membuang waktu produktif."
        ],
        solutionTitle: "Solusi dari DevK Studio",
        solution: "Kami tidak hanya mahir menulis baris kode yang bersih, tapi juga ahli dalam mengkonfigurasi server dan sistem operasi. Mulai dari merancang arsitektur aplikasi skala menengah hingga troubleshooting error membandel, kami selesaikan hingga ke akarnya."
      },
      {
        _key: "value-props-main",
        _type: "value-props-block",
        title: "Mengapa Memilih DevK Studio?",
        description: "Pendekatan teknis yang berfokus pada stabilitas dan performa jangka panjang.",
        valueProps: [
          {
            _key: "vp-1",
            icon: "01",
            title: "Clean Code & Modern Stack",
            description: "Pengembangan menggunakan React, Next.js, dan arsitektur modern yang skalabel dan mudah dikembangkan di masa depan."
          },
          {
            _key: "vp-2",
            icon: "02",
            title: "Reliability First",
            description: "Kami menjamin konfigurasi server dan instalasi sistem operasi berjalan lancar tanpa risiko kehilangan data Anda."
          },
          {
            _key: "vp-3",
            icon: "03",
            title: "No-Nonsense Problem Solving",
            description: "Root cause analysis yang mendalam. Kami menyelesaikan bug di akarnya, bukan sekadar menutupinya sementara."
          }
        ]
      },
      {
        _key: "logo-cloud-main",
        _type: "logo-cloud-1",
        title: "Dipercaya oleh Berbagai Bisnis",
        description: "Dari UMKM hingga perusahaan skala menengah telah mempercayakan sistem mereka pada DevK Studio."
      },
      {
        _key: "testimonials-main",
        _type: "testimonials-block",
        title: "Apa Kata Klien DevK Studio",
        description: "Ulasan dari mereka yang sudah merasakan langsung perubahan pada performa sistem dan operasional bisnisnya.",
        category: "software"
      },
      {
        _key: "faq-main",
        _type: "faqs",
        title: "Pertanyaan yang Sering Ditanyakan",
        description: "Jawaban cepat untuk membantu Anda memutuskan langkah selanjutnya.",
        category: "software"
      },
      {
        _key: "cta-final",
        _type: "cta-1",
        tagLine: "Mulai Sekarang",
        title: "Butuh Bantuan Teknis atau Ingin Membangun Aplikasi Custom?",
        body: portableText(
          "Tim ahli kami di Surabaya dan Sidoarjo siap mendiagnosis masalah Anda dan memberikan solusi IT terbaik.",
          "pt-cta"
        ),
        links: [
          {
            _key: "cta-link-1",
            _type: "link",
            title: "Hubungi Tim Kami",
            isExternal: false,
            href: "/contact",
            target: false,
            buttonVariant: "default",
          }
        ],
      },
    ],
    meta: {
      title: "DEVK STUDIO — Your Code, Your System, Running Flawlessly",
      description: "Dari pembuatan custom web apps hingga instalasi OS dan perbaikan bug server. DevK Studio adalah One-Stop Software Solution di Surabaya & Sidoarjo.",
      canonicalUrl: `${normalizedSiteUrl}/`,
      noindex: false,
    },
  };

  if (!write) {
    console.log("DRY RUN: index landing payload prepared");
    return;
  }

  await client.createOrReplace(pageDoc);
  console.log("✅ Upserted page-index (/)");
}

run().catch((error) => {
  console.error("❌ Failed to seed /:", error);
  process.exitCode = 1;
});
