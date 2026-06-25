import { createSanityWriteClient, loadSanityEnv } from "./lib/sanity-page-guards.mjs";
import fs from "fs";
import path from "path";

function portableText(text, key = "pt-1") {
  return [
    {
      _key: key,
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [
        {
          _key: `${key}-span`,
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
  const siteUrl = env.NEXT_PUBLIC_SITE_URL || "https://dev.kotacom.id";

  const pages = [
    {
      _id: "page-about",
      _type: "page",
      title: "Tentang Kami — DEVK STUDIO",
      slug: { _type: "slug", current: "about" },
      topBlockCount: 99,
      blocks: [
        {
          _key: "hero-about",
          _type: "hero-1",
          tagLine: "Misi Kami",
          title: "Menjembatani Kesenjangan Antara Kode dan Sistem.",
          body: portableText("DevK Studio lahir dari keresahan melihat banyaknya proyek IT yang gagal bukan karena kodenya buruk, melainkan karena infrastruktur yang tidak siap. Kami hadir di Surabaya & Sidoarjo untuk memastikan teknologi Anda bekerja untuk Anda."),
          links: [
            {
              _key: "link-about",
              _type: "link",
              title: "Mulai Konsultasi",
              isExternal: false,
              href: "/contact",
              buttonVariant: "default"
            }
          ]
        },
        {
          _key: "vp-about",
          _type: "value-props-block",
          title: "Pendekatan Kami",
          description: "Kami tidak menggunakan pendekatan 'satu solusi untuk semua'.",
          valueProps: [
            {
              _key: "vp-1",
              icon: "01",
              title: "End-to-End Expertise",
              description: "Dari baris kode hingga konfigurasi server produksi."
            },
            {
              _key: "vp-2",
              icon: "02",
              title: "Reliability First",
              description: "Sistem yang stabil dan aman adalah prioritas utama kami."
            }
          ]
        }
      ],
      meta: { title: "Tentang Kami — DevK Studio", description: "Tentang DevK Studio" }
    },
    {
      _id: "page-contact",
      _type: "page",
      title: "Hubungi Kami — DEVK STUDIO",
      slug: { _type: "slug", current: "contact" },
      topBlockCount: 99,
      blocks: [
        {
          _key: "hero-contact",
          _type: "section-header",
          colorVariant: "background",
          sectionWidth: "default",
          stackAlign: "center",
          title: "Hubungi Tim DevK",
          description: "Punya masalah server? Butuh aplikasi custom? Atau ingin setup Linux di kantor Anda? Kami siap mendengar dan memberikan solusi."
        },
        {
          _key: "grid-contact",
          _type: "grid-row",
          gridColumns: "grid-cols-3",
          columns: [
            {
              _key: "col-1",
              _type: "grid-card",
              title: "WhatsApp / Chat",
              excerpt: "Respons tercepat untuk keluhan error atau konsultasi awal.",
              link: { _key: "l1", _type: "link", title: "Chat Sekarang", href: "#", isExternal: true }
            },
            {
              _key: "col-2",
              _type: "grid-card",
              title: "Email Bisnis",
              excerpt: "Untuk pengajuan proposal proyek software development skala menengah-besar. (hello@devk.my.id)",
              link: { _key: "l2", _type: "link", title: "Kirim Email", href: "mailto:hello@devk.my.id", isExternal: true }
            },
            {
              _key: "col-3",
              _type: "grid-card",
              title: "Lokasi Kami",
              excerpt: "Berbasis di Surabaya & Sidoarjo. Menerima panggilan on-site untuk instalasi.",
            }
          ]
        }
      ],
      meta: { title: "Hubungi Kami — DevK Studio", description: "Kontak DevK Studio" }
    },
    {
      _id: "page-services",
      _type: "page",
      title: "Layanan — DEVK STUDIO",
      slug: { _type: "slug", current: "services" },
      topBlockCount: 99,
      blocks: [
        {
          _key: "hero-services",
          _type: "hero-1",
          tagLine: "Layanan Kami",
          title: "Solusi Digital Komprehensif",
          body: portableText("DevK Studio memposisikan diri sebagai 'One-Stop Software Solution'. Kami tidak hanya menulis kode, tapi kami memastikan infrastruktur pendukungnya berjalan sempurna.")
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
              excerpt: "Pembuatan aplikasi custom, web app, sistem kasir (POS), dan ERP UMKM dengan arsitektur modern.",
              link: { _key: "ls", _type: "link", title: "Pelajari", href: "/software-development", isExternal: false }
            },
            {
              _key: "col-os",
              _type: "grid-card",
              title: "OS & Installation",
              excerpt: "Jasa instalasi Windows, macOS, Linux, dan dual-boot tanpa takut kehilangan data.",
              link: { _key: "lo", _type: "link", title: "Pelajari", href: "/os-installation", isExternal: false }
            },
            {
              _key: "col-bug",
              _type: "grid-card",
              title: "Bug Fixes & Setup",
              excerpt: "Penyelesaian error server, perbaikan bug di level kode, dan setup local development environment.",
              link: { _key: "lb", _type: "link", title: "Pelajari", href: "/bug-fixes", isExternal: false }
            }
          ]
        }
      ],
      meta: { title: "Layanan — DevK Studio", description: "Layanan DevK Studio" }
    },
    {
      _id: "page-software",
      _type: "page",
      title: "Software Development — DEVK STUDIO",
      slug: { _type: "slug", current: "software" },
      topBlockCount: 99,
      blocks: [
        {
          _key: "hero-sd",
          _type: "hero-1",
          title: "Jasa Pembuatan Software Custom & Web App Terpercaya",
          body: portableText("Dari ide hingga deployment, kami membangun sistem yang skalabel untuk bisnis Anda di seluruh Indonesia. Tidak menggunakan template, murni dirancang untuk workflow unik Anda."),
          links: [
            { _key: "l-sd", _type: "link", title: "Diskusikan Kebutuhan", href: "/contact", isExternal: false, buttonVariant: "default" }
          ]
        },
        {
          _key: "ps-sd",
          _type: "problem-solution-block",
          title: "Software Lambat & Tidak Sesuai Kebutuhan?",
          problems: [
            "Banyak perusahaan terjebak dengan aplikasi mahal yang sulit dimodifikasi.",
            "DevK menggunakan arsitektur modern dan kode bersih memastikan aplikasi Anda cepat dan aman."
          ],
          solutionTitle: "Keunggulan Kami",
          solution: "Web Application Development (React, Next.js, Vue), Sistem Kasir (POS) Custom, ERP Ringan untuk Manajemen UMKM, dan API Development & Integration."
        },
        {
          _key: "vp-sd",
          _type: "value-props-block",
          title: "Nilai Lebih",
          description: "Struktur rapi yang memudahkan tim Anda.",
          valueProps: [
            { _key: "v1", icon: "01", title: "Clean Code", description: "Struktur rapi yang memudahkan tim Anda di masa depan." },
            { _key: "v2", icon: "02", title: "High Performance", description: "Skor audit maksimal, loading di bawah 1 detik." },
            { _key: "v3", icon: "03", title: "Scalable", description: "Siap menampung ribuan user bersamaan." }
          ]
        }
      ],
      meta: { title: "Software Development — DevK Studio", description: "Software Development DevK Studio" }
    },
    {
      _id: "page-os-installation",
      _type: "page",
      title: "OS & Installation — DEVK STUDIO",
      slug: { _type: "slug", current: "os-installation" },
      topBlockCount: 99,
      blocks: [
        {
          _key: "hero-os",
          _type: "hero-1",
          tagLine: "Layanan On-site & Remote",
          title: "Jasa Install OS Windows, macOS & Linux",
          body: portableText("Dual-boot gagal? Laptop lambat? Serahkan instalasi dan konfigurasi sistem operasi Anda kepada ahlinya tanpa takut kehilangan data. Khusus area Surabaya & Sidoarjo."),
          links: [
            { _key: "l-os", _type: "link", title: "Jadwalkan Instalasi", href: "/contact", isExternal: false, buttonVariant: "default" }
          ]
        },
        {
          _key: "vp-os",
          _type: "value-props-block",
          title: "Jaminan Kami",
          description: "Data Anda adalah prioritas utama kami.",
          valueProps: [
            { _key: "v1", icon: "01", title: "Garansi Data Aman", description: "Prosedur backup ketat sebelum melakukan format atau partisi ulang." },
            { _key: "v2", icon: "02", title: "Bebas Bloatware", description: "Instalasi bersih. Kami menghapus aplikasi bawaan yang tidak berguna." },
            { _key: "v3", icon: "03", title: "Dukungan Lintas OS", description: "Ahli dalam setup Windows 11, optimasi macOS tua, hingga konfigurasi Linux murni." }
          ]
        }
      ],
      meta: { title: "OS & Installation — DevK Studio", description: "OS Installation DevK Studio" }
    },
    {
      _id: "page-bug-fixes",
      _type: "page",
      title: "Bug Fixes & Setup — DEVK STUDIO",
      slug: { _type: "slug", current: "bug-fixes" },
      topBlockCount: 99,
      blocks: [
        {
          _key: "hero-bug",
          _type: "hero-1",
          title: "Perbaikan Bug & Troubleshooting Environment",
          body: portableText("Stuck berhari-hari karena error server atau dependency yang bentrok? Tim DevK siap mendiagnosis dan memperbaiki environment kerja Anda sampai tuntas ke akar masalah."),
          links: [
            { _key: "l-bug", _type: "link", title: "Bantu Saya Perbaiki Error", href: "/contact", isExternal: false, buttonVariant: "default" }
          ]
        },
        {
          _key: "vp-bug",
          _type: "value-props-block",
          title: "Layanan Teknis Kami",
          description: "Diagnosa 24 jam. Root cause diselesaikan tuntas.",
          valueProps: [
            { _key: "v1", icon: "01", title: "Konfigurasi Server", description: "Setup Docker, Nginx, Apache, Node.js" },
            { _key: "v2", icon: "02", title: "Dependency Fix", description: "NPM/Yarn conflict, Python pip errors" },
            { _key: "v3", icon: "03", title: "Refactoring & Database", description: "Membersihkan legacy code & Query lambat." }
          ]
        }
      ],
      meta: { title: "Bug Fixes & Setup — DevK Studio", description: "Bug Fixes DevK Studio" }
    }
  ];

  if (!write) {
    console.log("DRY RUN: 6 pages payload prepared");
    return;
  }

  for (const page of pages) {
    await client.createOrReplace(page);
    console.log(`✅ Upserted ${page._id}`);
  }

  // Update TSX files to return null
  const COMP_DIR = path.join(process.cwd(), "frontend/components/hybrid/generated");
  const files = {
    "about": "About",
    "contact": "Contact",
    "services": "Services",
    "software": "Software",
    "os-installation": "OsInstallation",
    "bug-fixes": "BugFixes"
  };

  for (const [slug, name] of Object.entries(files)) {
    const content = `export default function ${name}MiddleSection() {\n  return null;\n}\n`;
    fs.writeFileSync(`components/hybrid/generated/${slug}-middle-section.tsx`, content);
    console.log(`✅ Cleared ${slug}-middle-section.tsx`);
  }
}

run().catch((error) => {
  console.error("❌ Failed to seed pages:", error);
  process.exitCode = 1;
});
