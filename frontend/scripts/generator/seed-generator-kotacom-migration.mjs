import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createSanityReadClient, loadSanityEnv } from "../lib/sanity-page-guards.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR = path.resolve(__dirname, "..", "..");
const OUTPUT_PATH = path.join(FRONTEND_DIR, "tmp", "generator-kotacom-migration.ndjson");
const SUMMARY_PATH = path.join(FRONTEND_DIR, "tmp", "generator-kotacom-migration-summary.json");

const PAGE_TEMPLATES_QUERY = `*[_type == "pageTemplate"] | order(lane asc, title asc){
  _id,
  title,
  lane,
  variant,
  trustMode,
  shellId,
  sourcePolicy,
  structured,
  metaDefaults,
  "slug": slug.current
}`;

const PAGE_LOCATIONS_QUERY = `*[_type == "pageLocation"] | order(route asc){
  _id,
  title,
  route,
  routePattern,
  contentStatus,
  topBlockCount,
  structured,
  meta,
  "slug": slug.current,
  template->{
    _id,
    title,
    lane,
    variant,
    shellId,
    "slug": slug.current
  },
  location->{
    _id,
    title,
    "slug": slug.current,
    province,
    region,
    overview,
    highlights
  }
}`;

const SERVICE_LOCATIONS_QUERY = `*[_type == "serviceLocation"] | order(route asc){
  _id,
  title,
  route,
  routePattern,
  contentStatus,
  topBlockCount,
  structured,
  meta,
  "slug": slug.current,
  template->{
    _id,
    title,
    lane,
    variant,
    shellId,
    "slug": slug.current
  },
  service->{
    _id,
    title,
    "slug": slug.current
  },
  serviceType->{
    _id,
    title,
    category,
    description,
    "slug": slug.current
  },
  location->{
    _id,
    title,
    "slug": slug.current,
    province,
    region,
    overview,
    highlights
  }
}`;

const FAMILY_CONFIG = {
  generic: {
    routeBase: "/layanan",
    titlePrefix: "Company",
    datasetId: "generator-dataset-kotacom-generic",
    programId: "generator-program-kotacom-generic",
    templateId: "generator-template-kotacom-generic",
    audience: "pemilik bisnis yang butuh partner digital dan operasional yang responsif",
    promise: "membantu bisnis bergerak lebih cepat tanpa menambah beban koordinasi teknis",
    proof: "tim yang bisa menangani kebutuhan website, software, dan materi promosi dalam satu alur kerja",
  },
  website: {
    routeBase: "/pembuatan-website",
    titlePrefix: "Website",
    datasetId: "generator-dataset-kotacom-website",
    programId: "generator-program-kotacom-website",
    templateId: "generator-template-kotacom-website",
    audience: "bisnis yang butuh website yang jelas, cepat dimuat, dan siap menerima lead",
    promise: "mengubah halaman jasa jadi aset penjualan, bukan brosur online pasif",
    proof: "struktur copy, CTA, dan proof yang dirancang untuk intent komersial lokal",
  },
  printing: {
    routeBase: "/percetakan",
    titlePrefix: "Printing",
    datasetId: "generator-dataset-kotacom-printing",
    programId: "generator-program-kotacom-printing",
    templateId: "generator-template-kotacom-printing",
    audience: "tim marketing, sekolah, instansi, dan bisnis yang butuh hasil cetak rapi dan repeatable",
    promise: "membuat keputusan produksi lebih cepat dengan brief, spesifikasi, dan CTA yang jelas",
    proof: "angle kualitas hasil, konsultasi bahan, dan kesiapan produksi untuk berbagai kebutuhan cetak",
  },
  software: {
    routeBase: "/software",
    titlePrefix: "Software",
    datasetId: "generator-dataset-kotacom-software",
    programId: "generator-program-kotacom-software",
    templateId: "generator-template-kotacom-software",
    audience: "owner dan operator yang ingin alur kerja lebih rapi tanpa software generik yang memaksa",
    promise: "menerjemahkan proses bisnis jadi sistem yang lebih mudah dipakai tim sehari-hari",
    proof: "narrative berbasis workflow, bottleneck operasional, dan langkah implementasi yang realistis",
  },
};

const TOKEN_DEFINITIONS = [
  { _key: "token-page-path", name: "pagePath", label: "Page Path", sourceField: "pagePath", required: true },
  { _key: "token-route-base", name: "routeBase", label: "Route Base", sourceField: "routeBase", required: true },
  { _key: "token-title", name: "title", label: "Page Title", sourceField: "title", required: true },
  { _key: "token-primary-keyword", name: "primaryKeyword", label: "Primary Keyword", sourceField: "primaryKeyword", required: true },
  { _key: "token-service", name: "service", label: "Service", sourceField: "service", required: true },
  { _key: "token-city", name: "city", label: "City", sourceField: "city" },
  { _key: "token-location", name: "location", label: "Location", sourceField: "location", required: true },
  { _key: "token-industry", name: "industry", label: "Industry", sourceField: "industry", required: true },
  { _key: "token-offer", name: "offer", label: "Offer", sourceField: "offer", required: true },
  { _key: "token-local-condition", name: "localCondition", label: "Local Condition", sourceField: "localCondition", required: true },
  { _key: "token-audience", name: "audience", label: "Audience", sourceField: "audience", required: true },
  { _key: "token-problem", name: "problem", label: "Problem", sourceField: "problem", required: true },
  { _key: "token-agitate", name: "agitate", label: "Agitate", sourceField: "agitate", required: true },
  { _key: "token-outcome", name: "outcome", label: "Outcome", sourceField: "outcome", required: true },
  { _key: "token-proof", name: "proof", label: "Proof", sourceField: "proof", required: true },
  { _key: "token-differentiator", name: "differentiator", label: "Differentiator", sourceField: "differentiator", required: true },
  { _key: "token-cta-label", name: "ctaLabel", label: "CTA Label", sourceField: "ctaLabel", required: true },
  { _key: "token-meta-title", name: "metaTitle", label: "Meta Title", sourceField: "metaTitle", required: true },
  { _key: "token-meta-description", name: "metaDescription", label: "Meta Description", sourceField: "metaDescription", required: true },
  { _key: "token-faq-title", name: "faqTitle", label: "FAQ Title", sourceField: "faqTitle", required: true },
  { _key: "token-related-label-1", name: "relatedLabel1", label: "Related Label 1", sourceField: "relatedLabel1", required: true },
  { _key: "token-related-href-1", name: "relatedHref1", label: "Related Href 1", sourceField: "relatedHref1", required: true },
  { _key: "token-related-label-2", name: "relatedLabel2", label: "Related Label 2", sourceField: "relatedLabel2", required: true },
  { _key: "token-related-href-2", name: "relatedHref2", label: "Related Href 2", sourceField: "relatedHref2", required: true },
  { _key: "token-related-label-3", name: "relatedLabel3", label: "Related Label 3", sourceField: "relatedLabel3", required: true },
  { _key: "token-related-href-3", name: "relatedHref3", label: "Related Href 3", sourceField: "relatedHref3", required: true },
];

function slugify(value) {
  return `${value || ""}`
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCaseSlug(value) {
  return `${value || ""}`
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function makeKey(prefix, value) {
  const slug = slugify(value || prefix) || prefix;
  return `${prefix}-${slug}`.slice(0, 96);
}

function toBlock(text, key) {
  return {
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
  };
}

function familyFromDoc(doc) {
  return doc?.template?.lane || "generic";
}

function collectRouteBases(docs) {
  const map = new Map();
  for (const doc of docs) {
    const family = familyFromDoc(doc);
    if (!map.has(family)) map.set(family, new Set());
    const route = `${doc.route || ""}`.trim();
    if (!route.startsWith("/")) continue;
    const parts = route.split("/").filter(Boolean);
    if (parts.length > 0) map.get(family).add(`/${parts[0]}`);
  }
  return map;
}

function buildRelatedLinks(routeBase, family) {
  const baseLabel = titleCaseSlug(routeBase.replace(/^\//, "")) || "Layanan";
  return [
    { title: `${baseLabel} utama`, href: routeBase },
    { title: `${baseLabel} untuk Surabaya`, href: `${routeBase}/surabaya` },
    {
      title: family === "printing" ? "Lihat layanan cetak terkait" : family === "software" ? "Lihat use case software lain" : "Lihat halaman layanan terkait",
      href: "/layanan",
    },
  ];
}

function deriveRow(doc, family, routeBases) {
  const config = FAMILY_CONFIG[family] || FAMILY_CONFIG.generic;
  const route = `${doc.route || ""}`.trim();
  const routeParts = route.split("/").filter(Boolean);
  const routeBase = routeParts.length ? `/${routeParts[0]}` : config.routeBase;
  const tail = routeParts.slice(1);
  const locationName = doc.location?.title || titleCaseSlug(doc.location?.slug) || (tail.length === 1 && !route.includes("/about") ? titleCaseSlug(tail[0]) : "Indonesia");
  const cityValue = doc.location?.slug || (doc.location?.title ? slugify(doc.location.title) : tail.length === 1 ? slugify(tail[0]) : "indonesia");
  const serviceTitle = doc.serviceType?.title || doc.service?.title || doc.title;
  const serviceSlug = doc.serviceType?.slug || doc.service?.slug || (tail.length > 0 ? tail[0] : slugify(serviceTitle));
  const primaryKeyword = doc.structured?.primaryKeyword || doc.meta?.focusKeyword || doc.title;
  const metaTitle = doc.meta?.title || `${primaryKeyword} | KOTACOM`;
  const metaDescription = doc.meta?.description || doc.structured?.description || `${serviceTitle} untuk ${locationName} dengan pendekatan yang lebih jelas, siap jalan, dan mudah ditindaklanjuti.`;
  const localCondition = doc.location?.overview || doc.location?.region || doc.location?.province || `kebutuhan pasar ${locationName}`;
  const audience = config.audience;
  const offer = doc.structured?.ctaLabel || config.promise;
  const industry = family === "printing" ? "tim marketing, sekolah, dan bisnis yang butuh hasil cetak konsisten" : family === "software" ? "tim operasional yang mulai kewalahan dengan proses manual" : family === "website" ? "bisnis yang ingin lead masuk lebih terarah" : "pemilik bisnis yang ingin vendor yang bisa diajak jalan cepat";
  const problem = family === "printing"
    ? `Vendor cetak sering terasa lambat, spesifikasi tidak jelas, dan hasil akhir sulit diprediksi untuk ${locationName}.`
    : family === "software"
      ? `Tim di ${locationName} sering terjebak spreadsheet, chat, dan approval yang tersebar sehingga keputusan operasional melambat.`
      : family === "website"
        ? `Banyak bisnis di ${locationName} punya website, tapi halaman layanannya tidak cukup meyakinkan untuk mengubah trafik jadi inquiry.`
        : `Bisnis di ${locationName} sering butuh partner yang bisa mengeksekusi digital dan materi promosi tanpa lempar-lempar koordinasi.`;
  const agitate = family === "printing"
    ? `Akhirnya revisi berulang, deadline mepet, biaya ikut bengkak, dan tim harus menjelaskan ulang kebutuhan dari nol.`
    : family === "software"
      ? `Akibatnya follow-up molor, data dobel, dan owner tidak punya pandangan yang rapi untuk mengambil keputusan.`
      : family === "website"
        ? `Akibatnya budget promosi habis untuk trafik yang tidak jadi percakapan, sementara pengunjung masih bingung harus lanjut ke mana.`
        : `Akibatnya pesan brand terasa pecah, prioritas kerja kacau, dan tim internal harus menutup celah koordinasi sendiri.`;
  const outcome = family === "printing"
    ? `Anda butuh halaman yang membantu calon klien paham scope, kualitas, dan langkah order tanpa tarik-ulur yang melelahkan.`
    : family === "software"
      ? `Anda butuh halaman yang menjelaskan alur, hasil, dan langkah implementasi sehingga pembeli lebih siap berdiskusi konkret.`
      : family === "website"
        ? `Anda butuh halaman yang langsung menjawab intent lokal, membangun trust, dan mengarahkan visitor ke CTA yang tepat.`
        : `Anda butuh narasi yang lebih utuh, menjual, dan tetap mudah dipahami saat calon klien membandingkan vendor.`;
  const proof = config.proof;
  const differentiator = family === "printing"
    ? `Kami menekankan brief yang jelas, opsi bahan yang relevan, dan alur produksi yang bisa diprediksi sebelum order naik.`
    : family === "software"
      ? `Kami menurunkan proses bisnis ke requirement yang lebih realistis, bukan langsung melempar istilah teknis yang bikin keputusan mandek.`
      : family === "website"
        ? `Kami menggabungkan struktur landing page, SEO intent, dan CTA komersial supaya halaman tidak berhenti di tampilan.`
        : `Kami menghubungkan kebutuhan brand, operasional, dan digital dalam satu cerita yang lebih mudah dicerna calon klien.`;
  const faqTitle = family === "printing" ? `Pertanyaan sebelum order ${serviceTitle}` : family === "software" ? `Pertanyaan sebelum mulai ${serviceTitle}` : `Pertanyaan sebelum memilih ${serviceTitle}`;
  const related = buildRelatedLinks(routeBase, family);
  const row = {
    _key: makeKey("row", doc._id),
    key: doc._id,
    label: doc.title,
    service: serviceTitle,
    city: cityValue,
    primaryKeyword,
    secondaryKeywords: doc.meta?.secondaryKeywords || doc.structured?.secondaryKeywords || [],
    industry,
    offer,
    localCondition,
    tokens: [
      { _key: makeKey("tok", "pagePath"), name: "pagePath", values: [route] },
      { _key: makeKey("tok", "routeBase"), name: "routeBase", values: [routeBase] },
      { _key: makeKey("tok", "title"), name: "title", values: [doc.title] },
      { _key: makeKey("tok", "location"), name: "location", values: [locationName] },
      { _key: makeKey("tok", "audience"), name: "audience", values: [audience] },
      { _key: makeKey("tok", "problem"), name: "problem", values: [problem] },
      { _key: makeKey("tok", "agitate"), name: "agitate", values: [agitate] },
      { _key: makeKey("tok", "outcome"), name: "outcome", values: [outcome] },
      { _key: makeKey("tok", "proof"), name: "proof", values: [proof] },
      { _key: makeKey("tok", "differentiator"), name: "differentiator", values: [differentiator] },
      { _key: makeKey("tok", "ctaLabel"), name: "ctaLabel", values: [offer] },
      { _key: makeKey("tok", "metaTitle"), name: "metaTitle", values: [metaTitle] },
      { _key: makeKey("tok", "metaDescription"), name: "metaDescription", values: [metaDescription] },
      { _key: makeKey("tok", "faqTitle"), name: "faqTitle", values: [faqTitle] },
      { _key: makeKey("tok", "relatedLabel1"), name: "relatedLabel1", values: [related[0].title] },
      { _key: makeKey("tok", "relatedHref1"), name: "relatedHref1", values: [related[0].href] },
      { _key: makeKey("tok", "relatedLabel2"), name: "relatedLabel2", values: [related[1].title] },
      { _key: makeKey("tok", "relatedHref2"), name: "relatedHref2", values: [related[1].href] },
      { _key: makeKey("tok", "relatedLabel3"), name: "relatedLabel3", values: [related[2].title] },
      { _key: makeKey("tok", "relatedHref3"), name: "relatedHref3", values: [related[2].href] },
    ],
  };
  return row;
}

function buildTemplateDoc(family, docs) {
  const config = FAMILY_CONFIG[family] || FAMILY_CONFIG.generic;
  const routeBases = [...new Set(docs.map((doc) => `/${`${doc.route || ""}`.split("/").filter(Boolean)[0] || config.routeBase.replace(/^\//, "")}`))].filter(Boolean);
  const mainRouteBase = routeBases[0] || config.routeBase;
  return {
    _id: config.templateId,
    _type: "generatorTemplate",
    title: `KOTACOM ${config.titlePrefix} Conversion Template`,
    slug: { _type: "slug", current: `${family}-conversion-template` },
    description: `Generator template hasil migrasi legacy ${family}. Fokus pada copy lebih dalam, intent lokal, dan CTA komersial yang lebih jelas.`,
    outputType: "page",
    routeBase: mainRouteBase,
    slugPattern: "{{pagePath}}",
    programType: family === "generic" ? "landing-pages" : "location-pages",
    blockTokenReference: "{{pagePath}}\n{{routeBase}}\n{{title}}\n{{primaryKeyword}}\n{{service}}\n{{city}}\n{{location}}\n{{industry}}\n{{offer}}\n{{localCondition}}\n{{audience}}\n{{problem}}\n{{agitate}}\n{{outcome}}\n{{proof}}\n{{differentiator}}\n{{ctaLabel}}\n{{metaTitle}}\n{{metaDescription}}\n{{faqTitle}}",
    blocks: [
      {
        _type: "hero-1",
        _key: makeKey("block", `${family}-hero`),
        tagLine: "{{primaryKeyword}}",
        title: "{{title}}",
        body: [
          toBlock("{{problem}} {{agitate}} {{outcome}}", `${family}-hero-body`),
        ],
        links: [
          { _key: `${family}-hero-link-1`, _type: "link", title: "{{ctaLabel}}", href: "{{pagePath}}", isExternal: true, buttonVariant: "default" },
          { _key: `${family}-hero-link-2`, _type: "link", title: "Lihat halaman terkait", href: "/layanan", isExternal: true, buttonVariant: "outline" },
        ],
      },
      {
        _type: "section-header",
        _key: makeKey("block", `${family}-problem`),
        tagLine: "Masalah yang paling sering menghambat",
        title: "Kenapa halaman {{service}} untuk {{location}} sering gagal mengubah minat jadi percakapan",
        description: "{{problem}} {{agitate}}",
        colorVariant: "background",
        sectionWidth: "default",
        stackAlign: "left",
      },
      {
        _type: "value-props-block",
        _key: makeKey("block", `${family}-value`),
        colorVariant: "card",
        title: "Apa yang membuat pendekatan {{service}} ini lebih meyakinkan",
        intro: "{{differentiator}}",
        items: [
          { _key: `${family}-value-1`, title: "Pesan lebih relevan", description: "Salin intent lokal dari {{location}} ke struktur copy yang lebih spesifik, bukan ganti nama kota saja." },
          { _key: `${family}-value-2`, title: "CTA lebih jelas", description: "Arahkan visitor ke langkah berikutnya dengan penawaran yang terasa konkret dan mudah dipahami." },
          { _key: `${family}-value-3`, title: "Proof lebih cepat terbaca", description: "Masukkan alasan percaya, pembeda, dan konteks keputusan sebelum calon klien kehilangan fokus." },
        ],
      },
      {
        _type: "section-header",
        _key: makeKey("block", `${family}-highlights`),
        colorVariant: "muted",
        title: "Apa yang dicari calon klien saat membuka halaman ini",
        points: [
          "Apakah layanan {{service}} ini relevan untuk {{audience}}?",
          "Apakah konteks {{localCondition}} sudah dipahami dengan benar?",
          "Apakah langkah lanjut setelah membaca halaman ini terasa aman dan jelas?",
        ],
      },
      {
        _type: "faqs",
        _key: makeKey("block", `${family}-process-faq`),
        colorVariant: "background",
        processTitle: "Bagaimana halaman generator ini harus bekerja",
        processSteps: [
          "Buka dengan {{primaryKeyword}} dan konteks {{location}} supaya intent langsung ketemu.",
          "Jelaskan masalah, risiko, dan hasil yang ingin dicapai tanpa copy generik.",
          "Masukkan proof, pembeda, dan CTA yang relevan untuk {{audience}}.",
        ],
        faqTitle: "{{faqTitle}}",
        faqs: [
          { _key: `${family}-faq-1`, question: "Apakah halaman ini hanya ganti nama kota?", answer: "Tidak. Dataset harus membawa problem, audience, offer, dan local condition yang relevan supaya tiap halaman punya alasan eksis sendiri." },
          { _key: `${family}-faq-2`, question: "Bagaimana menjaga URL lama tetap hidup?", answer: "Generator ini memakai {{pagePath}} sebagai slugPattern sehingga route lama tetap bisa dipertahankan saat halaman dibangun ulang." },
          { _key: `${family}-faq-3`, question: "Apa yang harus diperkuat setelah migrasi?", answer: "Tambahkan proof spesifik, contoh pekerjaan, dan CTA yang makin sempit per family agar conversion intent naik." },
        ],
      },
      {
        _type: "section-header",
        _key: makeKey("block", `${family}-related`),
        colorVariant: "card",
        title: "Jelajahi jalur berikutnya",
        links: [
          { _key: `${family}-related-1`, title: "{{relatedLabel1}}", href: "{{relatedHref1}}" },
          { _key: `${family}-related-2`, title: "{{relatedLabel2}}", href: "{{relatedHref2}}" },
          { _key: `${family}-related-3`, title: "{{relatedLabel3}}", href: "{{relatedHref3}}" },
        ],
      },
      {
        _type: "cta-1",
        _key: makeKey("block", `${family}-cta`),
        title: "{{ctaLabel}}",
        body: [
          toBlock("{{proof}} {{differentiator}}", `${family}-cta-body`),
        ],
        links: [
          { _key: `${family}-cta-link`, _type: "link", title: "{{ctaLabel}}", href: "{{pagePath}}", isExternal: true, buttonVariant: "default" },
        ],
      },
    ],
    designFamily: family,
    seoMeta: {
      titlePattern: "{{metaTitle}}",
      descriptionPattern: "{{metaDescription}}",
      focusKeywordToken: "{{primaryKeyword}}",
      secondaryKeywordsSource: "secondaryKeywords",
    },
    aggregateRatingDefaults: {
      ratingValue: 4.9,
      reviewCount: family === "printing" ? 127 : family === "software" ? 62 : 84,
      bestRating: 5,
      ratingSource: "internal",
    },
    status: "ready",
    tokenDefinitions: TOKEN_DEFINITIONS,
    devOnly: false,
  };
}

function buildDatasetDoc(family, rows) {
  const config = FAMILY_CONFIG[family] || FAMILY_CONFIG.generic;
  return {
    _id: config.datasetId,
    _type: "generatorDataset",
    title: `KOTACOM ${config.titlePrefix} Dataset`,
    slug: { _type: "slug", current: `${family}-dataset` },
    rows,
    importMode: "manual",
    dedupePolicy: "skip-existing-slug",
    status: "ready",
  };
}

function buildProgramDoc(family, rows) {
  const config = FAMILY_CONFIG[family] || FAMILY_CONFIG.generic;
  return {
    _id: config.programId,
    _type: "generatorProgram",
    title: `KOTACOM ${config.titlePrefix} Program`,
    slug: { _type: "slug", current: `${family}-program` },
    template: { _type: "reference", _ref: config.templateId },
    dataset: { _type: "reference", _ref: config.datasetId },
    generationMode: rows.length > 20 ? "batch" : "preview",
    status: "ready",
    aiMode: "prepared",
  };
}

async function main() {
  const env = await loadSanityEnv();
  const client = await createSanityReadClient();
  const [templates, pageLocations, serviceLocations] = await Promise.all([
    client.fetch(PAGE_TEMPLATES_QUERY),
    client.fetch(PAGE_LOCATIONS_QUERY),
    client.fetch(SERVICE_LOCATIONS_QUERY),
  ]);

  const allDocs = [...pageLocations, ...serviceLocations];
  const routeBases = collectRouteBases(allDocs);
  const docsByFamily = new Map();
  for (const doc of allDocs) {
    const family = familyFromDoc(doc);
    if (!docsByFamily.has(family)) docsByFamily.set(family, []);
    docsByFamily.get(family).push(doc);
  }

  const generatedDocs = [];
  const summary = {
    ok: true,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET || null,
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || null,
    counts: {
      legacyTemplates: templates.length,
      pageLocations: pageLocations.length,
      serviceLocations: serviceLocations.length,
    },
    families: {},
  };

  for (const [family, docs] of [...docsByFamily.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const rows = docs.map((doc) => deriveRow(doc, family, routeBases));
    generatedDocs.push(buildTemplateDoc(family, docs));
    generatedDocs.push(buildDatasetDoc(family, rows));
    generatedDocs.push(buildProgramDoc(family, rows));
    summary.families[family] = {
      legacyDocCount: docs.length,
      routeBases: [...(routeBases.get(family) || [])],
      sampleRoutes: docs.slice(0, 5).map((doc) => doc.route),
      generatorIds: {
        templateId: (FAMILY_CONFIG[family] || FAMILY_CONFIG.generic).templateId,
        datasetId: (FAMILY_CONFIG[family] || FAMILY_CONFIG.generic).datasetId,
        programId: (FAMILY_CONFIG[family] || FAMILY_CONFIG.generic).programId,
      },
    };
  }

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${generatedDocs.map((doc) => JSON.stringify(doc)).join("\n")}\n`, "utf8");
  await fs.writeFile(SUMMARY_PATH, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ ok: true, outputPath: OUTPUT_PATH, summaryPath: SUMMARY_PATH, docs: generatedDocs.length, families: Object.keys(summary.families) }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
