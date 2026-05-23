#!/usr/bin/env node
/**
 * DEVK Studio — Production Dataset Seed Script
 * Populates a fresh Sanity dataset with all required documents.
 * Usage: SANITY_TOKEN=xxx node scripts/seed-production.mjs
 */

const PROJECT_ID = "ww3aejg2";
const DATASET = "production";
const API_VERSION = "2026-04-21";

const TOKEN = process.env.SANITY_TOKEN || process.env.SANITY_AUTH_TOKEN;
if (!TOKEN) { console.error("Set SANITY_TOKEN env"); process.exit(1); }

const mutate = async (mutations) => {
  const res = await fetch(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations }),
  });
  const data = await res.json();
  if (data.error) throw new Error(JSON.stringify(data.error));
  return data;
};

const block = (key, text, style = "normal") => ({
  _key: key, _type: "block", style, markDefs: [],
  children: [{ _key: `${key}-s`, _type: "span", marks: [], text }],
});

const link = (key, title, href, variant = "default") => ({
  _key: key, _type: "link", isExternal: true, title, href, buttonVariant: variant, target: false,
});

// ============ TASK 1: SINGLETONS ============
const settings = {
  _id: "settings",
  _type: "settings",
  siteName: "DEVK Studio",
  brandName: "DEVK Studio",
  siteDescription: "Jasa pembuatan website dan software custom untuk bisnis yang ingin tumbuh lebih cepat.",
  whatsappNumber: "6285799520350",
  whatsappDefaultMessage: "Halo DEVK Studio, saya ingin konsultasi tentang pembuatan website/software.",
  enableWhatsapp: true,
};

const seoSettings = {
  _id: "seoSettings",
  _type: "seoSettings",
  siteUrl: "https://devk.my.id",
  defaultTitle: "DEVK Studio — Jasa Pembuatan Website & Software Custom",
  defaultDescription: "Partner teknologi untuk bisnis yang butuh website profesional dan software custom. Dari konsep hingga launch, kami handle semuanya.",
  defaultNoIndex: false,
  companyInfo: {
    foundedYear: 2018,
    totalClients: 200,
    totalProjects: 350,
    phone: "+62 857-9952-0350",
    email: "hello@devk.my.id",
    operatingHours: "Senin-Jumat 09:00-17:00 WIB",
    addressSidoarjo: "Graha Indraprasta G7/15, Tulangan, Sidoarjo 61273, Jawa Timur",
    addressSurabaya: "Jl. Tenggilis Mulya 76, Surabaya 60292, Jawa Timur",
    serviceAreas: ["Surabaya", "Sidoarjo", "Jakarta", "Bandung", "Semarang", "Seluruh Indonesia (Remote)"],
  },
};

const ogSettings = {
  _id: "ogSettings",
  _type: "ogSettings",
  brandName: "DEVK Studio",
  ctaText: "WA 085799520350 · devk.my.id",
  showDescription: true,
  showCta: true,
  images: [],
};

const themeSettings = {
  _id: "themeSettings",
  _type: "themeSettings",
  defaultTheme: "system",
  enableThemeToggle: true,
};

const navigation = {
  _id: "navigation",
  _type: "navigation",
  links: [
    { _key: "nav-home", _type: "link", isExternal: true, title: "Home", href: "/", navLocation: "primary", showInHeader: true, showInFooter: true, buttonVariant: "ghost" },
    { _key: "nav-services", _type: "link", isExternal: true, title: "Layanan", href: "/services", navLocation: "primary", showInHeader: true, showInFooter: true, buttonVariant: "ghost",
      children: [
        { _key: "c1", _type: "navigation-link-child", isExternal: true, title: "Pembuatan Website", href: "/pembuatan-website", description: "Website profesional untuk bisnis Anda", group: "Core" },
        { _key: "c2", _type: "navigation-link-child", isExternal: true, title: "Software Custom", href: "/software", description: "Aplikasi custom sesuai kebutuhan bisnis", group: "Core" },
        { _key: "c3", _type: "navigation-link-child", isExternal: true, title: "Konsultasi Digital", href: "/services/konsultasi-digital", description: "Diskusi kebutuhan teknologi bisnis Anda", group: "Layanan" },
      ],
    },
    { _key: "nav-projects", _type: "link", isExternal: true, title: "Portfolio", href: "/projects", navLocation: "primary", showInHeader: true, showInFooter: true, buttonVariant: "ghost" },
    { _key: "nav-products", _type: "link", isExternal: true, title: "Produk", href: "/products", navLocation: "primary", showInHeader: true, showInFooter: true, buttonVariant: "ghost" },
    { _key: "nav-blog", _type: "link", isExternal: true, title: "Blog", href: "/blog", navLocation: "primary", showInHeader: true, showInFooter: true, buttonVariant: "ghost" },
    { _key: "nav-about", _type: "link", isExternal: true, title: "Tentang", href: "/about", navLocation: "utility", showInHeader: true, showInFooter: true, buttonVariant: "ghost" },
    { _key: "nav-contact", _type: "link", isExternal: true, title: "Kontak", href: "/contact", navLocation: "utility", showInHeader: true, showInFooter: true, buttonVariant: "ghost" },
  ],
  headerCta: { _type: "link", _key: "hcta", isExternal: true, title: "Konsultasi Gratis", href: "https://wa.me/6285799520350?text=Halo%20DEVK%20Studio", buttonVariant: "default", target: true, showInHeader: true },
};

console.log("Task 1: Seeding singletons...");
await mutate([
  { createOrReplace: settings },
  { createOrReplace: seoSettings },
  { createOrReplace: ogSettings },
  { createOrReplace: themeSettings },
  { createOrReplace: navigation },
]);
console.log("  ✓ settings, seoSettings, ogSettings, themeSettings, navigation");

// ============ TASK 2: PAGES ============
console.log("Task 2: Seeding pages...");

const pages = [
  {
    _id: "page-index", _type: "page", title: "Home", slug: { _type: "slug", current: "index" },
    blocks: [
      { _key: "h1", _type: "hero-1", tagLine: "DEVK Studio", title: "Website & Software untuk Bisnis yang Ingin Tumbuh Lebih Cepat",
        body: [block("hb1", "Kami membantu bisnis membangun website profesional dan software custom yang langsung bisa dipakai untuk menghasilkan lead, meningkatkan efisiensi, dan memperkuat kredibilitas digital.")],
        links: [link("hl1", "Konsultasi Gratis", "https://wa.me/6285799520350"), link("hl2", "Lihat Portfolio", "/projects", "outline")],
      },
      { _key: "gr1", _type: "grid-row", gridColumns: "grid-cols-3", textAlign: "left", cardStyle: "vertical",
        columns: [
          { _key: "gc1", _type: "grid-card", title: "Website Development", excerpt: "Website company profile, landing page, dan toko online yang cepat, responsif, dan siap konversi." },
          { _key: "gc2", _type: "grid-card", title: "Software Custom", excerpt: "Aplikasi web dan mobile yang dirancang khusus untuk alur kerja dan kebutuhan operasional bisnis Anda." },
          { _key: "gc3", _type: "grid-card", title: "Konsultasi Digital", excerpt: "Diskusi kebutuhan teknologi, audit website, dan roadmap digital yang realistis untuk bisnis Anda." },
        ],
      },
      { _key: "cta1", _type: "cta-1", title: "Siap Mulai Proyek Digital Anda?",
        body: [block("cb1", "Ceritakan kebutuhan bisnis Anda. Kami bantu petakan solusi yang paling realistis — tanpa komitmen.")],
        links: [link("cl1", "Hubungi via WhatsApp", "https://wa.me/6285799520350"), link("cl2", "Lihat Layanan", "/services", "outline")],
      },
    ],
    meta: { title: "DEVK Studio — Jasa Pembuatan Website & Software Custom", description: "Partner teknologi untuk bisnis yang butuh website profesional dan software custom. Konsultasi gratis." },
  },
  {
    _id: "page-about", _type: "page", title: "Tentang DEVK Studio", slug: { _type: "slug", current: "about" },
    blocks: [
      { _key: "h1", _type: "hero-2", tagLine: "Tentang Kami", title: "Tim Kecil, Dampak Besar",
        body: [block("ab1", "DEVK Studio adalah tim pengembang website dan software yang fokus membantu bisnis lokal dan UMKM membangun kehadiran digital yang profesional. Kami percaya teknologi yang tepat bisa mengubah cara bisnis beroperasi dan berkembang.")],
      },
      { _key: "ci1", _type: "company-info", title: "DEVK Studio", description: "Partner teknologi bisnis sejak 2018" },
    ],
    meta: { title: "Tentang DEVK Studio — Tim Website & Software", description: "Kenali tim di balik DEVK Studio. Kami membantu bisnis membangun website dan software yang benar-benar dipakai." },
  },
  {
    _id: "page-contact", _type: "page", title: "Hubungi Kami", slug: { _type: "slug", current: "contact" },
    blocks: [
      { _key: "h1", _type: "hero-2", tagLine: "Kontak", title: "Mari Diskusi Kebutuhan Anda",
        body: [block("cb1", "Punya ide proyek atau butuh konsultasi? Hubungi kami via WhatsApp untuk respons tercepat, atau kirim email untuk diskusi yang lebih detail.")],
        links: [link("cl1", "WhatsApp", "https://wa.me/6285799520350"), link("cl2", "Email", "mailto:hello@devk.my.id", "outline")],
      },
    ],
    meta: { title: "Hubungi DEVK Studio — Konsultasi Website & Software", description: "Hubungi DEVK Studio untuk konsultasi pembuatan website dan software. WhatsApp: 085799520350." },
  },
  {
    _id: "page-privacy", _type: "page", title: "Kebijakan Privasi", slug: { _type: "slug", current: "privacy" },
    blocks: [
      { _key: "h1", _type: "section-header", title: "Kebijakan Privasi", description: "Terakhir diperbarui: Mei 2026" },
      { _key: "rc1", _type: "legacy-rich-content", body: [
        block("p1", "Kebijakan Privasi", "h2"),
        block("p2", "DEVK Studio (devk.my.id) menghormati privasi pengunjung. Halaman ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda."),
        block("p3", "Informasi yang Kami Kumpulkan", "h3"),
        block("p4", "Kami mengumpulkan informasi yang Anda berikan secara sukarela melalui formulir kontak, WhatsApp, atau email — seperti nama, nomor telepon, dan detail kebutuhan proyek."),
        block("p5", "Penggunaan Informasi", "h3"),
        block("p6", "Informasi digunakan untuk merespons pertanyaan, menyusun penawaran, dan meningkatkan layanan kami. Kami tidak menjual data Anda ke pihak ketiga."),
        block("p7", "Kontak", "h3"),
        block("p8", "Jika ada pertanyaan tentang kebijakan ini, hubungi kami di hello@devk.my.id."),
      ]},
    ],
    meta: { title: "Kebijakan Privasi — DEVK Studio", description: "Kebijakan privasi DEVK Studio tentang pengumpulan dan penggunaan data pengunjung.", noindex: true },
  },
  {
    _id: "page-pembuatan-website", _type: "page", title: "Jasa Pembuatan Website", slug: { _type: "slug", current: "pembuatan-website" },
    blocks: [
      { _key: "h1", _type: "hero-1", tagLine: "Website Development", title: "Website Profesional yang Siap Menghasilkan untuk Bisnis Anda",
        body: [block("wb1", "Dari company profile hingga toko online — kami bangun website yang cepat, responsif, SEO-ready, dan dirancang untuk konversi. Bukan sekadar tampil online, tapi benar-benar bekerja untuk bisnis Anda.")],
        links: [link("wl1", "Konsultasi Gratis", "https://wa.me/6285799520350?text=Halo%2C%20saya%20ingin%20diskusi%20pembuatan%20website"), link("wl2", "Lihat Portfolio", "/projects", "outline")],
      },
      { _key: "fp1", _type: "features-package-block", title: "Yang Anda Dapatkan", subtitle: "Setiap website yang kami buat mencakup:",
        features: [
          { _key: "f1", title: "Desain Responsif", description: "Tampil sempurna di semua perangkat" },
          { _key: "f2", title: "SEO On-Page", description: "Meta tag, heading, dan schema markup siap dari hari pertama" },
          { _key: "f3", title: "Loading Cepat", description: "Optimasi performa untuk skor PageSpeed tinggi" },
          { _key: "f4", title: "CMS Mudah", description: "Update konten sendiri tanpa developer" },
        ],
      },
      { _key: "cta1", _type: "cta-1", title: "Mulai Proyek Website Anda",
        body: [block("wcb1", "Diskusikan kebutuhan website bisnis Anda. Konsultasi awal gratis, tanpa komitmen.")],
        links: [link("wcl1", "Hubungi via WhatsApp", "https://wa.me/6285799520350")],
      },
    ],
    meta: { title: "Jasa Pembuatan Website Profesional — DEVK Studio", description: "Jasa pembuatan website company profile, toko online, dan landing page. Cepat, responsif, SEO-ready. Konsultasi gratis.", focusKeyword: "jasa pembuatan website" },
  },
  {
    _id: "page-software", _type: "page", title: "Software Custom", slug: { _type: "slug", current: "software" },
    blocks: [
      { _key: "h1", _type: "hero-1", tagLine: "Software Development", title: "Software Custom yang Dirancang untuk Cara Kerja Bisnis Anda",
        body: [block("sb1", "Bukan software generik yang dipaksakan ke alur kerja Anda. Kami bangun aplikasi yang mengikuti proses bisnis yang sudah berjalan — lebih efisien, lebih terkontrol, lebih scalable.")],
        links: [link("sl1", "Diskusi Kebutuhan", "https://wa.me/6285799520350?text=Halo%2C%20saya%20ingin%20diskusi%20software%20custom"), link("sl2", "Lihat Portfolio", "/projects", "outline")],
      },
      { _key: "fp1", _type: "features-package-block", title: "Kapabilitas Kami", subtitle: "Jenis software yang bisa kami bangun:",
        features: [
          { _key: "f1", title: "Web Application", description: "Dashboard, portal, dan sistem internal berbasis web" },
          { _key: "f2", title: "Mobile App", description: "Aplikasi Android/iOS untuk operasional atau customer-facing" },
          { _key: "f3", title: "API & Integration", description: "Koneksi antar sistem, payment gateway, dan third-party services" },
          { _key: "f4", title: "Automation", description: "Otomasi workflow, reporting, dan proses repetitif" },
        ],
      },
      { _key: "cta1", _type: "cta-1", title: "Punya Ide Software?",
        body: [block("scb1", "Ceritakan proses bisnis yang ingin Anda digitalkan. Kami bantu petakan scope dan estimasi yang realistis.")],
        links: [link("scl1", "Konsultasi via WhatsApp", "https://wa.me/6285799520350")],
      },
    ],
    meta: { title: "Jasa Pembuatan Software Custom — DEVK Studio", description: "Software custom untuk bisnis: web app, mobile app, API integration, dan automation. Dirancang sesuai alur kerja Anda.", focusKeyword: "software custom" },
  },
];

await mutate(pages.map(p => ({ createOrReplace: p })));
console.log(`  ✓ ${pages.length} pages created`);

// ============ TASK 3: CONTENT ============
console.log("Task 3: Seeding content...");

const categories = [
  { _id: "cat-web-development", _type: "category", title: "Web Development", slug: { _type: "slug", current: "web-development" } },
  { _id: "cat-software", _type: "category", title: "Software", slug: { _type: "slug", current: "software" } },
  { _id: "cat-digital", _type: "category", title: "Digital", slug: { _type: "slug", current: "digital" } },
];

const posts = [
  {
    _id: "post-website-bisnis-2026", _type: "post", title: "Kenapa Bisnis Anda Butuh Website di 2026",
    slug: { _type: "slug", current: "kenapa-bisnis-butuh-website-2026" },
    excerpt: "Di era dimana 80% konsumen riset online sebelum membeli, tidak punya website profesional sama dengan kehilangan peluang setiap hari.",
    body: [
      block("b1", "Kenapa Bisnis Anda Butuh Website di 2026", "h2"),
      block("b2", "Konsumen modern tidak lagi mencari bisnis di Yellow Pages. Mereka Google. Mereka cek website. Mereka bandingkan. Jika bisnis Anda tidak muncul — atau muncul dengan website yang lambat dan tidak profesional — Anda kalah sebelum bertanding."),
      block("b3", "Website Bukan Sekadar Kartu Nama Digital", "h3"),
      block("b4", "Website yang dirancang dengan benar adalah mesin lead generation 24/7. Ia menjelaskan layanan Anda, membangun kepercayaan lewat portfolio dan testimoni, dan mengarahkan pengunjung ke tindakan — WhatsApp, form, atau pembelian."),
      block("b5", "Mulai dari Mana?", "h3"),
      block("b6", "Tidak perlu langsung sempurna. Mulai dari 5 halaman inti: Home, About, Services, Portfolio, Contact. Pastikan mobile-friendly, loading cepat, dan CTA jelas. Sisanya bisa dikembangkan bertahap."),
    ],
    categories: [{ _type: "reference", _ref: "cat-web-development", _key: "cr1" }],
    meta: { title: "Kenapa Bisnis Butuh Website di 2026 — DEVK Studio", description: "Alasan bisnis perlu website profesional di 2026 dan cara memulai yang realistis." },
  },
  {
    _id: "post-memilih-tech-stack", _type: "post", title: "Cara Memilih Tech Stack untuk Proyek Software",
    slug: { _type: "slug", current: "cara-memilih-tech-stack-software" },
    excerpt: "Next.js, Laravel, atau Flutter? Pemilihan tech stack yang tepat menentukan kecepatan development, biaya maintenance, dan skalabilitas jangka panjang.",
    body: [
      block("b1", "Cara Memilih Tech Stack untuk Proyek Software", "h2"),
      block("b2", "Tech stack bukan soal mana yang paling populer di Twitter. Ini soal mana yang paling cocok untuk kebutuhan proyek, kemampuan tim, dan budget maintenance jangka panjang."),
      block("b3", "Pertimbangan Utama", "h3"),
      block("b4", "Tiga faktor kunci: kompleksitas fitur (apakah butuh real-time, offline-first, atau CRUD sederhana), timeline delivery (MVP 2 bulan vs enterprise 6 bulan), dan siapa yang akan maintain setelah launch."),
      block("b5", "Rekomendasi Kami", "h3"),
      block("b6", "Untuk web app bisnis: Next.js + Sanity CMS. Untuk mobile: React Native atau Flutter. Untuk backend heavy: Node.js atau Go. Yang penting: pilih yang tim Anda bisa maintain, bukan yang paling shiny."),
    ],
    categories: [{ _type: "reference", _ref: "cat-software", _key: "cr1" }],
    meta: { title: "Cara Memilih Tech Stack Software — DEVK Studio", description: "Panduan memilih tech stack yang tepat untuk proyek software bisnis. Next.js, Laravel, Flutter — mana yang cocok?" },
  },
  {
    _id: "post-seo-website-baru", _type: "post", title: "SEO Dasar untuk Website Baru: Checklist Lengkap",
    slug: { _type: "slug", current: "seo-dasar-website-baru-checklist" },
    excerpt: "Website baru tidak otomatis muncul di Google. Ini checklist SEO dasar yang harus dipasang sejak hari pertama launch.",
    body: [
      block("b1", "SEO Dasar untuk Website Baru", "h2"),
      block("b2", "Banyak bisnis launch website lalu heran kenapa tidak muncul di Google setelah sebulan. Jawabannya: SEO bukan magic, tapi proses. Dan prosesnya harus dimulai sejak website dibangun."),
      block("b3", "Checklist Teknis", "h3"),
      block("b4", "SSL aktif (HTTPS), sitemap.xml, robots.txt, meta title unik per halaman, heading hierarchy (H1-H2-H3), alt text gambar, loading speed di bawah 3 detik, dan mobile-responsive."),
      block("b5", "Checklist Konten", "h3"),
      block("b6", "Setiap halaman punya 1 focus keyword, meta description yang mengundang klik, internal linking antar halaman, dan konten yang menjawab pertanyaan target audiens."),
    ],
    categories: [{ _type: "reference", _ref: "cat-digital", _key: "cr1" }],
    meta: { title: "SEO Dasar Website Baru: Checklist — DEVK Studio", description: "Checklist SEO lengkap untuk website baru. Teknis dan konten yang harus ada sejak hari pertama." },
  },
];

const services = [
  {
    _id: "service-website-development", _type: "service", title: "Website Development",
    slug: { _type: "slug", current: "website-development" },
    excerpt: "Website profesional yang cepat, responsif, dan dirancang untuk menghasilkan lead — bukan sekadar tampil online.",
    featured: true,
    meta: { title: "Jasa Website Development — DEVK Studio", description: "Pembuatan website company profile, toko online, dan landing page. Cepat, SEO-ready, mobile-first." },
  },
  {
    _id: "service-software-development", _type: "service", title: "Software Development",
    slug: { _type: "slug", current: "software-development" },
    excerpt: "Aplikasi custom yang mengikuti alur kerja bisnis Anda — web app, mobile app, dan integrasi sistem.",
    featured: true,
    meta: { title: "Jasa Software Development — DEVK Studio", description: "Software custom untuk bisnis: dashboard, mobile app, API integration, dan automation tools." },
  },
  {
    _id: "service-konsultasi-digital", _type: "service", title: "Konsultasi Digital",
    slug: { _type: "slug", current: "konsultasi-digital" },
    excerpt: "Diskusi kebutuhan teknologi bisnis Anda — audit website, roadmap digital, dan rekomendasi solusi yang realistis.",
    featured: false,
    meta: { title: "Konsultasi Digital — DEVK Studio", description: "Konsultasi teknologi untuk bisnis: audit website, roadmap digital, dan rekomendasi tech stack." },
  },
];

const projects = [
  {
    _id: "project-ecommerce-platform", _type: "project", title: "E-Commerce Platform Fashion Retail",
    slug: { _type: "slug", current: "ecommerce-platform-fashion" },
    excerpt: "Platform toko online custom dengan inventory management, payment gateway, dan dashboard analytics untuk brand fashion lokal.",
    projectType: "website",
    meta: { title: "E-Commerce Fashion — Portfolio DEVK Studio" },
  },
  {
    _id: "project-crm-system", _type: "project", title: "CRM System untuk Agency Digital",
    slug: { _type: "slug", current: "crm-system-agency" },
    excerpt: "Sistem CRM custom dengan pipeline management, client portal, dan automated reporting untuk agency dengan 50+ klien aktif.",
    projectType: "software",
    meta: { title: "CRM System Agency — Portfolio DEVK Studio" },
  },
  {
    _id: "project-company-profile", _type: "project", title: "Website Company Profile Manufaktur",
    slug: { _type: "slug", current: "company-profile-manufaktur" },
    excerpt: "Website bilingual (ID/EN) untuk perusahaan manufaktur dengan katalog produk, sertifikasi, dan inquiry form untuk buyer internasional.",
    projectType: "website",
    meta: { title: "Company Profile Manufaktur — Portfolio DEVK Studio" },
  },
];

const products = [
  {
    _id: "product-nextjs-starter", _type: "product", title: "Next.js Business Starter Template",
    slug: { _type: "slug", current: "nextjs-business-starter" },
    excerpt: "Template website bisnis siap pakai dengan Sanity CMS, SEO built-in, dan komponen yang bisa dikustomisasi.",
    price: 450000, currency: "IDR", stock: "in_stock",
    meta: { title: "Next.js Business Starter — DEVK Studio" },
  },
  {
    _id: "product-pos-template", _type: "product", title: "Point of Sale System Template",
    slug: { _type: "slug", current: "pos-system-template" },
    excerpt: "Template sistem POS untuk retail dan F&B dengan manajemen produk, transaksi, dan laporan penjualan.",
    price: 750000, currency: "IDR", stock: "in_stock",
    meta: { title: "POS System Template — DEVK Studio" },
  },
  {
    _id: "product-invoice-generator", _type: "product", title: "Invoice & Quotation Generator",
    slug: { _type: "slug", current: "invoice-quotation-generator" },
    excerpt: "Aplikasi web untuk generate invoice dan quotation profesional dengan branding custom dan export PDF.",
    price: 350000, currency: "IDR", stock: "in_stock",
    meta: { title: "Invoice Generator — DEVK Studio" },
  },
];

await mutate([
  ...categories.map(c => ({ createOrReplace: c })),
  ...posts.map(p => ({ createOrReplace: p })),
  ...services.map(s => ({ createOrReplace: s })),
  ...projects.map(p => ({ createOrReplace: p })),
  ...products.map(p => ({ createOrReplace: p })),
]);
console.log(`  ✓ ${categories.length} categories, ${posts.length} posts, ${services.length} services, ${projects.length} projects, ${products.length} products`);

console.log("\n✅ Seed complete! Dataset populated with DEVK Studio content.");
console.log("   Next: Run OG image generation separately, then export.");
