import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT_CSV = path.resolve(DIR, "../../tmp/sales-dataset-wifi.csv");
const OUT_NDJSON = path.resolve(DIR, "../../tmp/generator-wifi.ndjson");

const CITIES_JATIM = [
  "Surabaya", "Malang", "Sidoarjo", "Gresik", "Mojokerto", "Pasuruan", "Kediri", "Madiun", "Blitar", "Probolinggo", "Batu", "Banyuwangi", "Jember", "Jombang", "Lamongan", "Tuban", "Bojonegoro", "Nganjuk", "Ngawi", "Magetan", "Ponorogo", "Pacitan", "Trenggalek", "Tulungagung", "Lumajang", "Bondowoso", "Situbondo", "Sampang", "Pamekasan", "Sumenep", "Bangkalan"
];

const cfg = {
  id: "wifi",
  title: "Jasa Pasang WiFi",
  routeBase: "/jasa-pasang-wifi",
  category: "wifi",
  metric: "24/7",
  metricLabel: "Proses cepat tanpa antre panjang",
  price: "Mulai Rp 200rb/Bulan",
  timeline: "Pemasangan 1x24 Jam",
  cta: "Cek Coverage Lokasi Sekarang",
  headline: "Pasang WiFi Cepat & Stabil Tanpa Ribet Antre Teknisi",
  sub: "Pilihan provider lengkap (Indihome, First Media, Biznet, MyRepublic). Kami bantu cek coverage, urus pendaftaran resmi, hingga teknisi datang hari ini juga.",
  problems: [
    "Pusing memilih provider WiFi yang sinyalnya benar-benar bagus di area rumah/kantor.",
    "Malas ribet isi form pendaftaran panjang dan harus menunggu jadwal teknisi berhari-hari.",
    "Takut tertipu calo atau tagihan bulanan tiba-tiba membengkak tanpa penjelasan di awal.",
    "Butuh koneksi cepat hari ini tapi antrean call center terlalu lama."
  ],
  solution: "KOTACOM membantu Anda memilih paket WiFi paling stabil di lokasi Anda, pendaftaran lewat jalur prioritas, pembayaran resmi ke provider, dan 100% tanpa biaya admin tambahan.",
  values: [
    ["Cek Coverage Instan", "Cukup kirim ShareLoc via WhatsApp, kami cek provider apa saja yang sudah masuk ke jaringan rumah Anda."],
    ["Bebas Biaya Admin / Calo", "Anda hanya membayar harga promo resmi provider langsung ke Virtual Account mereka. Kami bantu gratis."],
    ["Prioritas Jadwal Teknisi", "Kami memiliki koneksi partner yang membuat jadwal pemasangan teknisi di lokasi Anda bisa jauh lebih cepat."]
  ],
  services: [
    ["Indihome (Telkomsel)", "Jangkauan terluas hingga ke pelosok kecamatan.", ["Gratis biaya pasang*", "Sewa Router Modem", "Opsi bundling UseeTV"], "Mulai Rp 200rb-an", "Hari ini/besok", "Paling Luas"],
    ["First Media", "Internet kabel tanpa FUP (Fair Usage Policy).", ["Unlimited sejati", "Termasuk TV Kabel", "Speed Booster"], "Mulai Rp 250rb-an", "Sesuai Jadwal", "Best Value"],
    ["Biznet / MyRepublic", "Kecepatan simetris untuk gaming dan WFH.", ["Upload = Download", "Ping sangat kecil", "Stabil saat hujan"], "Mulai Rp 300rb-an", "Sesuai Jadwal", "Gaming & Bisnis"]
  ],
  faq: [
    ["Apakah bayar pendaftarannya ke Kotacom?", "Tidak sama sekali. Pembayaran pertama maupun tagihan bulanan dibayarkan langsung ke Virtual Account resmi milik provider (Indihome/FirstMedia/dll). Kami murni membantu proses registrasinya."],
    ["Syarat pasang apa saja?", "Sangat mudah. Anda hanya perlu menyiapkan foto KTP asli, alamat pemasangan lengkap (Shareloc), nomor HP/WA aktif, dan email. Sisanya akan tim kami yang urus di sistem."],
    ["Berapa lama teknisi akan datang?", "Biasanya dalam 1x24 jam setelah proses registrasi berhasil divalidasi. Namun, bisa saja lebih cepat (hari H) tergantung kepadatan jadwal teknisi di wilayah pemasangan Anda."],
    ["Apakah rumah kontrak / kos / ruko bisa dipasang WiFi?", "Bisa. Pastikan saja Anda sudah memiliki izin dari pemilik kontrakan atau kos untuk pemasangan kabel baru. Syarat administratifnya tetap sama, menggunakan KTP penyewa."]
  ]
};

const slug = (s) => `${s || ""}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const block = (text, key) => ({ _key: key, _type: "block", style: "normal", markDefs: [], children: [{ _key: `${key}-s`, _type: "span", marks: [], text }] });
const link = (title, href, key) => ({ _key: key, _type: "link", title, href, isExternal: /^https?:\/\//.test(`${href}`), target: false, buttonVariant: "default" });
const icon = (name) => name;
const padding = { _type: "section-padding", top: true, bottom: true };

function escapeCSV(str) {
  if (str == null) return '""';
  const s = String(str);
  if (s.includes('"') || s.includes(',') || s.includes('\\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

const HEADERS = [
  "label", "service", "city", "primaryKeyword", "secondaryKeywords", "industry", 
  "offer", "localCondition", "token_pagePath", "token_routeBase", "token_title", 
  "token_location", "token_ctaLabel", "token_ctaHref", "token_headline", 
  "token_subheadline", "token_problem", "token_solution", "token_price", 
  "token_timeline", "token_metaTitle", "token_metaDescription"
];

function generateRows() {
  return CITIES_JATIM.map(city => {
    const loc = city;
    const title = `Pasang WiFi ${city}`;
    const route = `/jasa-pasang-wifi/${slug(city)}`;
    const pk = `Pasang WiFi ${city}`;
    const secondaryKeywords = [`pasang indihome ${city}`, `wifi murah ${city}`, `first media ${city}`, `pasang internet ${city}`];
    
    return {
      label: title,
      service: "Pemasangan WiFi",
      city: slug(city),
      primaryKeyword: pk,
      secondaryKeywords: secondaryKeywords.join(", "),
      industry: "rumah tangga, kos, kafe, sekolah, dan kantor",
      offer: cfg.cta,
      localCondition: `kebutuhan internet pelanggan di wilayah ${loc} dan sekitarnya`,
      token_pagePath: route,
      token_routeBase: cfg.routeBase,
      token_title: title,
      token_location: loc,
      token_ctaLabel: cfg.cta,
      token_ctaHref: "https://wa.me/6281234567890", // Example WA
      token_headline: `${cfg.headline} di ${loc}`,
      token_subheadline: `${cfg.sub} Kami juga melayani pengecekan coverage langsung untuk wilayah ${loc} tanpa biaya.`,
      token_problem: cfg.problems[0].replace(/\\.$/, ` di ${loc}.`),
      token_solution: cfg.solution,
      token_price: cfg.price,
      token_timeline: cfg.timeline,
      token_metaTitle: `Jasa Pasang WiFi ${loc} Murah (Indihome, First Media, dll)`,
      token_metaDescription: `Layanan pasang WiFi murah di ${loc}. Kami bantu cek coverage Indihome, First Media, Biznet di area ${loc}. Pendaftaran resmi, teknisi cepat datang.`
    };
  });
}

function wifiVisualBlocks() {
  return [
    { _type: "split-row", _key: "wifi-visual-split", padding, colorVariant: "card", noGap: false, splitColumns: [
      { _key: "wifi-split-content", _type: "split-content", sticky: true, colorVariant: "background", tagLine: "Workflow Cepat", title: "Cukup 3 Langkah Sampai Internet Menyala", body: [block("Tidak perlu pergi ke Plaza Telkom atau kantor provider. Cukup dari WhatsApp, semuanya beres.", "wifi-split-body")], link: link("Kirim Shareloc Anda", "{{ctaHref}}", "wifi-split-link") },
      { _key: "wifi-info-list", _type: "split-info-list", list: [
        { _key: "wifi-info-1", _type: "split-info", title: "1. Cek Jaringan", body: [block("Kami cek ketersediaan tiang ODP atau FAT provider di sekitar lokasi Anda.", "wifi-info-1-body")], tags: ["Shareloc", "Cek Sinyal", "Gratis"] },
        { _key: "wifi-info-2", _type: "split-info", title: "2. Pilih Paket & Registrasi", body: [block("Anda memilih paket speed (20Mbps - 100Mbps) dan mengirim syarat foto KTP.", "wifi-info-2-body")], tags: ["Pilih Paket", "KTP", "Resmi"] },
        { _key: "wifi-info-3", _type: "split-info", title: "3. Instalasi Teknisi", body: [block("Teknisi provider datang, menarik kabel, mensetting router, dan koneksi langsung bisa dipakai.", "wifi-info-3-body")], tags: ["Pasang", "Router", "Aktif"] },
      ] },
    ] },
    { _type: "grid-row", _key: "wifi-product-grid", padding, colorVariant: "background", textAlign: "left", cardStyle: "vertical", gridColumns: "grid-cols-3", columns: [
      { _key: "wifi-product-home", _type: "grid-card", uiIcon: icon("Home"), title: "WiFi Rumah / Keluarga", excerpt: "Speed 20-30 Mbps. Cukup untuk kebutuhan browsing, YouTube, Netflix, dan anak sekolah.", link: link("Tanya paket rumah", "{{ctaHref}}", "wifi-home-link") },
      { _key: "wifi-product-gaming", _type: "grid-card", uiIcon: icon("Gamepad2"), title: "WiFi Gaming", excerpt: "Speed 50 Mbps dengan koneksi simetris dan ping kecil agar tidak lag saat mabar.", link: link("Diskusi paket gaming", "{{ctaHref}}", "wifi-gaming-link") },
      { _key: "wifi-product-business", _type: "grid-card", uiIcon: icon("Briefcase"), title: "WiFi Kantor / Kafe", excerpt: "Speed 100 Mbps up. Dirancang untuk dibagi ke puluhan user tanpa berebut bandwidth.", link: link("Tanya paket bisnis", "{{ctaHref}}", "wifi-business-link") },
    ] }
  ];
}

function template() {
  const id = cfg.id;
  return {
    _id: `generator-template-${id}`, _type: "generatorTemplate", title: `Landing Page - ${cfg.title}`, slug: { _type: "slug", current: `sales-${id}` },
    description: `Landing page jasa pemasangan WiFi untuk berbagai provider. Fokus pada lead WhatsApp dan shareloc.`,
    outputType: "page", routeBase: cfg.routeBase, slugPattern: "{{pagePath}}", programType: "location-pages", designFamily: "website", status: "ready", devOnly: false,
    blockTokenReference: "{{headline}}\\n{{subheadline}}\\n{{primaryKeyword}}\\n{{location}}\\n{{ctaLabel}}\\n{{ctaHref}}\\n{{price}}\\n{{timeline}}\\n{{problem}}\\n{{solution}}",
    seoMeta: { titlePattern: "{{metaTitle}}", descriptionPattern: "{{metaDescription}}", focusKeywordToken: "{{primaryKeyword}}", secondaryKeywordsSource: "secondaryKeywords" },
    aggregateRatingDefaults: { ratingValue: 4.8, reviewCount: 254, bestRating: 5, ratingSource: "internal" },
    tokenDefinitions: ["headline","subheadline","primaryKeyword","location","ctaLabel","ctaHref","price","timeline","problem","solution","metaTitle","metaDescription","pagePath","routeBase"].map((name) => ({ _key: `def-${name}`, name, label: name, sourceField: name, required: true })),
    blocks: [
      { _type: "hero-1", _key: `${id}-hero`, tagLine: "{{primaryKeyword}}", title: "{{headline}}", body: [block("{{subheadline}}", `${id}-hero-body`)], links: [link("{{ctaLabel}}", "{{ctaHref}}", `${id}-hero-cta`), link("Lihat Pilihan Provider", "#paket", `${id}-hero-secondary`)] },
      { _type: "section-header", _key: `${id}-badges`, padding, colorVariant: "background", badges: [{ _key: `${id}-b1`, label: "Resmi 100%", description: "Pembayaran ke VA Provider" }, { _key: `${id}-b2`, label: "Proses Instan", description: "Cek coverage cuma 5 menit" }, { _key: `${id}-b3`, label: "Beragam Pilihan", description: "Indihome, FirstMedia, dll" }] },
      { _type: "problem-solution-block", _key: `${id}-problem`, padding, colorVariant: "muted", title: "Hambatan yang sering dialami calon pelanggan WiFi", problems: cfg.problems, solutionTitle: "Solusi Cerdas dari KOTACOM", solution: cfg.solution },
      { _type: "value-props-block", _key: `${id}-value`, padding, colorVariant: "background", title: "Mengapa Mendaftar Lewat Kami?", description: "Kami mengurus seluruh proses birokrasinya. Anda cukup memantau dari WhatsApp rumah.", valueProps: cfg.values.map((v, i) => ({ _key: `${id}-vp-${i}`, icon: `0${i + 1}`, title: v[0], description: v[1] })) },
      ...wifiVisualBlocks(),
      { _type: "service-types-block", _key: `${id}-services`, padding, colorVariant: "card", title: `Rekomendasi Provider WiFi`, description: "Pilih provider yang jaringannya paling sesuai dengan lokasi Anda.", services: cfg.services.map((s, i) => ({ _key: `${id}-svc-${i}`, title: s[0], description: s[1], features: s[2], price: s[3], timeline: s[4], badge: s[5], link: link("Cek Coverage Provider Ini", "{{ctaHref}}", `${id}-svc-link-${i}`) })) },
      { _type: "service-types-block", _key: `${id}-metrics`, padding, colorVariant: "primary", items: [{ _key: `${id}-m1`, value: cfg.metric, label: cfg.metricLabel, brand: "Pengalaman" }, { _key: `${id}-m2`, value: "4.8/5", label: "Rating kepuasan pelayanan", brand: "Kepercayaan" }, { _key: `${id}-m3`, value: "0 Rupiah", label: "Biaya administrasi calo", brand: "Transparan" }] },
      { _type: "faqs", _key: `${id}-faq`, padding, colorVariant: "background", processTitle: "Pertanyaan Seputar Pemasangan", processSteps: [], faqTitle: "FAQ", faqs: cfg.faq.map((x, i) => ({ _key: `${id}-faq-${i}`, question: x[0], answer: [block(x[1], `${id}-faq-${i}-ans`)] })) },
      { _type: "whatsapp-cta", _key: `${id}-wa`, padding, colorVariant: "primary", sectionWidth: "default", stackAlign: "left", tagLine: "Tunggu Apa Lagi?", title: "Internet Stabil Segera Hadir di Ruang Anda", body: [block("Kirim Shareloc Anda via WhatsApp sekarang. Teknisi siap merapat untuk instalasi.", `${id}-wa-body`)], secondaryLink: link("Minta Brosur Harga", "{{ctaHref}}", `${id}-wa-secondary`) },
    ],
  };
}

async function main() {
  const rows = generateRows();
  let csvContent = HEADERS.join(",") + "\\n";
  for (const row of rows) {
    const csvRow = HEADERS.map(h => escapeCSV(row[h])).join(",");
    csvContent += csvRow + "\\n";
  }
  
  await fs.mkdir(path.dirname(OUT_CSV), { recursive: true });
  await fs.writeFile(OUT_CSV, csvContent);
  console.log(`Generated CSV: ${OUT_CSV} with ${rows.length} rows`);

  const tpl = template();
  const datasetDoc = {
    _id: `generator-dataset-${cfg.id}`, _type: "generatorDataset", title: `Dataset - ${cfg.title} Jatim`, slug: { _type: "slug", current: `sales-${cfg.id}` }, 
    rows: rows.map((r, i) => ({
      _key: `row-${r.city}-${Date.now()}-${i}`,
      key: `row-${r.city}`,
      label: r.label,
      service: r.service,
      city: r.city,
      primaryKeyword: r.primaryKeyword,
      secondaryKeywords: r.secondaryKeywords.split(',').map(s=>s.trim()),
      industry: r.industry,
      offer: r.offer,
      localCondition: r.localCondition,
      tokens: Object.keys(r).filter(k => k.startsWith('token_')).map(k => ({
        _key: `tok-${k}`, name: k.replace('token_', ''), values: [r[k]]
      }))
    })), 
    importMode: "manual", dedupePolicy: "skip-existing-slug", status: "ready"
  };

  const programDoc = {
    _id: `generator-program-${cfg.id}`, _type: "generatorProgram", title: `Program - ${cfg.title} Jatim`, slug: { _type: "slug", current: `sales-${cfg.id}` }, 
    template: { _type: "reference", _ref: tpl._id }, 
    dataset: { _type: "reference", _ref: datasetDoc._id }, 
    generationMode: "batch", status: "ready", aiMode: "prepared"
  };

  const ndjsonContent = [tpl, datasetDoc, programDoc].map(x => JSON.stringify(x)).join("\n") + "\n";
  await fs.writeFile(OUT_NDJSON, ndjsonContent);
  console.log(`Generated NDJSON: ${OUT_NDJSON} for import`);
}

main().catch(console.error);
