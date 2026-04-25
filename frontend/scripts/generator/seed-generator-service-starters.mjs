import { createSanityWriteClient, loadSanityEnv } from "../lib/sanity-page-guards.mjs";

const WRITE_MODE = process.argv.includes("--write");

const SERVICE_STARTERS = [
  {
    key: "website",
    templateId: "generator-template-website-starter-dev",
    datasetId: "generator-dataset-website-starter-dev",
    programId: "generator-program-website-starter-dev",
    template: {
      title: "Starter Jasa Website",
      slug: "website-service-starter",
      description: "Starter generator template for high-intent website service pages.",
      designFamily: "website",
      baseSections: ["hero", "benefits", "proof"],
      optionalSections: ["problems", "faq", "cta"],
      sectionVariants: [
        {
          _key: "website-hero",
          key: "hero",
          title: "{{primaryKeyword}} untuk {{location}}",
          sectionType: "hero-1",
          copy: "Sorot manfaat utama {{service}} dengan CTA {{offer}} yang spesifik untuk {{industry}}.",
          requiredTokens: ["primaryKeyword", "location", "service", "offer"],
        },
        {
          _key: "website-benefits",
          key: "benefits",
          title: "Kenapa {{service}} ini relevan",
          sectionType: "value-props-block",
          copy: "Uraikan manfaat yang membuat halaman terasa organik untuk intent {{primaryKeyword}}.",
          requiredTokens: ["service", "primaryKeyword"],
        },
        {
          _key: "website-proof",
          key: "proof",
          title: "Bukti kesiapan untuk {{location}}",
          sectionType: "value-props-block",
          copy: "Masukkan proof dan trust signal yang selaras dengan kebutuhan {{industry}}.",
          requiredTokens: ["location", "industry"],
        },
        {
          _key: "website-problems",
          key: "problems",
          title: "Masalah umum sebelum {{service}} ditata benar",
          sectionType: "problem-solution-block",
          copy: "Tunjukkan friksi yang relevan agar halaman tidak terasa template kosong.",
          requiredTokens: ["service"],
          optional: true,
        },
        {
          _key: "website-faq",
          key: "faq",
          title: "FAQ {{primaryKeyword}}",
          sectionType: "faq-block",
          copy: "FAQ harus menjawab keberatan yang nyata, bukan mengulang keyword.",
          requiredTokens: ["primaryKeyword"],
          optional: true,
        },
        {
          _key: "website-cta",
          key: "cta",
          sectionType: "value-props-block",
          title: "Langkah berikutnya untuk {{location}}",
          copy: "Akhiri dengan CTA {{offer}} yang konkret dan tidak generik.",
          requiredTokens: ["location", "offer"],
          optional: true,
        },
      ],
    },
    dataset: {
      title: "Dataset Jasa Website",
      slug: "website-service-dataset",
      keywordSets: [
        {
          _key: "kw-company-profile",
          key: "kw-company-profile",
          label: "Company Profile",
          primaryKeyword: "jasa pembuatan website company profile",
          secondaryKeywords: ["website company profile", "jasa website bisnis"],
          angle: "credibility",
        },
        {
          _key: "kw-landing-page",
          key: "kw-landing-page",
          label: "Landing Page",
          primaryKeyword: "jasa landing page bisnis",
          secondaryKeywords: ["landing page konversi", "jasa bikin landing page"],
          angle: "conversion",
        },
      ],
      rows: [
        {
          _key: "row-website-jakarta",
          key: "row-website-jakarta",
          label: "Jakarta",
          service: "pembuatan website",
          city: "jakarta",
          industry: "bisnis jasa",
          offer: "audit struktur halaman",
        },
        {
          _key: "row-website-bandung",
          key: "row-website-bandung",
          label: "Bandung",
          service: "pembuatan website",
          city: "bandung",
          industry: "usaha lokal",
          offer: "diskusi kebutuhan website",
        },
      ],
      seo: {
        title: "Jasa Website",
        description: "Halaman jasa website yang tetap selaras, organik, dan siap diverifikasi di development dataset.",
      },
      routeBase: "/pembuatan-website",
    },
  },
  {
    key: "software",
    templateId: "generator-template-software-starter-dev",
    datasetId: "generator-dataset-software-starter-dev",
    programId: "generator-program-software-starter-dev",
    template: {
      title: "Starter Jasa Software",
      slug: "software-service-starter",
      description: "Starter generator template for custom software service pages.",
      designFamily: "software",
      baseSections: ["hero", "benefits", "problems"],
      optionalSections: ["proof", "faq", "cta"],
      sectionVariants: [
        {
          _key: "software-hero",
          key: "hero",
          title: "{{primaryKeyword}} untuk {{industry}} di {{location}}",
          sectionType: "hero-1",
          copy: "Tarik intent komersial tanpa kehilangan konteks operasional {{service}}.",
          requiredTokens: ["primaryKeyword", "industry", "location", "service"],
        },
        {
          _key: "software-benefits",
          key: "benefits",
          title: "Hasil yang dicari sebelum membangun {{service}}",
          sectionType: "value-props-block",
          copy: "Tekankan outcome, integrasi, dan kejelasan scope agar copy tidak duplicate.",
          requiredTokens: ["service"],
        },
        {
          _key: "software-problems",
          key: "problems",
          title: "Hambatan sebelum {{service}} ditata",
          sectionType: "problem-solution-block",
          copy: "Bangun narasi masalah yang berbeda untuk setiap angle {{angle}}.",
          requiredTokens: ["service", "angle"],
        },
        {
          _key: "software-proof",
          key: "proof",
          title: "Pembuktian untuk {{industry}}",
          sectionType: "value-props-block",
          copy: "Beri kerangka proof yang realistis untuk implementasi {{service}}.",
          requiredTokens: ["industry", "service"],
          optional: true,
        },
        {
          _key: "software-faq",
          key: "faq",
          title: "FAQ {{primaryKeyword}}",
          sectionType: "faq-block",
          copy: "Jawab keberatan seputar scope, timeline, dan integrasi.",
          requiredTokens: ["primaryKeyword"],
          optional: true,
        },
        {
          _key: "software-cta",
          key: "cta",
          title: "Mulai evaluasi {{service}}",
          sectionType: "value-props-block",
          copy: "Tutup dengan CTA {{offer}} yang sesuai tahap bisnis.",
          requiredTokens: ["service", "offer"],
          optional: true,
        },
      ],
    },
    dataset: {
      title: "Dataset Jasa Software",
      slug: "software-service-dataset",
      keywordSets: [
        {
          _key: "kw-software-custom",
          key: "kw-software-custom",
          label: "Software Custom",
          primaryKeyword: "jasa pembuatan software custom",
          secondaryKeywords: ["software custom perusahaan", "developer software bisnis"],
          angle: "operations",
        },
        {
          _key: "kw-sistem-internal",
          key: "kw-sistem-internal",
          label: "Sistem Internal",
          primaryKeyword: "jasa pembuatan sistem internal",
          secondaryKeywords: ["sistem operasional bisnis", "aplikasi internal perusahaan"],
          angle: "efficiency",
        },
      ],
      rows: [
        {
          _key: "row-software-surabaya",
          key: "row-software-surabaya",
          label: "Surabaya",
          service: "pembuatan software",
          city: "surabaya",
          industry: "operasional bisnis",
          offer: "review alur kerja",
        },
        {
          _key: "row-software-semarang",
          key: "row-software-semarang",
          label: "Semarang",
          service: "software custom",
          city: "semarang",
          industry: "tim internal",
          offer: "diskusi blueprint sistem",
        },
      ],
      seo: {
        title: "Jasa Software",
        description: "Halaman jasa software yang unik per intent, tetap konsisten secara desain, dan aman untuk development-only generation.",
      },
      routeBase: "/software",
    },
  },
  {
    key: "printing",
    templateId: "generator-template-printing-starter-dev",
    datasetId: "generator-dataset-printing-starter-dev",
    programId: "generator-program-printing-starter-dev",
    template: {
      title: "Starter Jasa Percetakan",
      slug: "printing-service-starter",
      description: "Starter generator template for printing service pages.",
      designFamily: "printing",
      baseSections: ["hero", "benefits", "proof"],
      optionalSections: ["pricing", "faq", "cta"],
      sectionVariants: [
        {
          _key: "printing-hero",
          key: "hero",
          title: "{{primaryKeyword}} {{location}}",
          sectionType: "hero-1",
          copy: "Buka dengan penawaran {{offer}} yang masuk akal untuk {{service}}.",
          requiredTokens: ["primaryKeyword", "location", "offer", "service"],
        },
        {
          _key: "printing-benefits",
          key: "benefits",
          title: "Nilai utama {{service}}",
          sectionType: "value-props-block",
          copy: "Jelaskan kualitas, kecepatan, dan relevansi output untuk {{industry}}.",
          requiredTokens: ["service", "industry"],
        },
        {
          _key: "printing-proof",
          key: "proof",
          title: "Kenapa {{location}} memilih {{service}}",
          sectionType: "value-props-block",
          copy: "Bentuk proof yang tidak generik dan tidak hanya mengulang kata kunci.",
          requiredTokens: ["location", "service"],
        },
        {
          _key: "printing-pricing",
          key: "pricing",
          title: "Pertimbangan sebelum memilih {{service}}",
          sectionType: "pricing-block",
          copy: "Bantu user memahami ruang lingkup, bukan sekadar angka harga.",
          requiredTokens: ["service"],
          optional: true,
        },
        {
          _key: "printing-faq",
          key: "faq",
          title: "FAQ {{primaryKeyword}}",
          sectionType: "faq-block",
          copy: "Jawab pertanyaan file, finishing, jumlah, dan timeline.",
          requiredTokens: ["primaryKeyword"],
          optional: true,
        },
        {
          _key: "printing-cta",
          key: "cta",
          title: "Lanjut ke {{offer}}",
          sectionType: "value-props-block",
          copy: "Akhiri dengan CTA yang membuat langkah berikutnya terasa ringan.",
          requiredTokens: ["offer"],
          optional: true,
        },
      ],
    },
    dataset: {
      title: "Dataset Jasa Percetakan",
      slug: "printing-service-dataset",
      keywordSets: [
        {
          _key: "kw-cetak-buku",
          key: "kw-cetak-buku",
          label: "Cetak Buku",
          primaryKeyword: "jasa cetak buku",
          secondaryKeywords: ["percetakan buku", "cetak buku cepat"],
          angle: "quality",
        },
        {
          _key: "kw-cetak-company-profile",
          key: "kw-cetak-company-profile",
          label: "Cetak Company Profile",
          primaryKeyword: "jasa cetak company profile",
          secondaryKeywords: ["cetak company profile", "percetakan company profile"],
          angle: "presentation",
        },
      ],
      rows: [
        {
          _key: "row-printing-yogyakarta",
          key: "row-printing-yogyakarta",
          label: "Yogyakarta",
          service: "percetakan",
          city: "yogyakarta",
          industry: "brand lokal",
          offer: "estimasi cetak cepat",
        },
        {
          _key: "row-printing-malang",
          key: "row-printing-malang",
          label: "Malang",
          service: "cetak buku",
          city: "malang",
          industry: "komunitas dan bisnis",
          offer: "konsultasi bahan cetak",
        },
      ],
      seo: {
        title: "Jasa Percetakan",
        description: "Halaman jasa percetakan yang unik per keyword set dan kota, tetapi tetap satu bahasa desain di generator dev-only.",
      },
      routeBase: "/percetakan",
    },
  },
];

const TOKEN_DEFINITIONS = [
  { _key: "token-primary-keyword", name: "primaryKeyword", label: "Primary Keyword", sourceField: "primaryKeyword", required: true },
  { _key: "token-service", name: "service", label: "Service", sourceField: "service", required: true },
  { _key: "token-city", name: "city", label: "City", sourceField: "city" },
  { _key: "token-location", name: "location", label: "Location", sourceField: "city", fallbackValue: "indonesia", required: true },
  { _key: "token-offer", name: "offer", label: "Offer", sourceField: "offer", fallbackValue: "konsultasi cepat", required: true },
  { _key: "token-industry", name: "industry", label: "Industry", sourceField: "industry", fallbackValue: "bisnis lokal", required: true },
  { _key: "token-angle", name: "angle", label: "Angle", sourceField: "angle", fallbackValue: "default", required: true },
];

function buildDocs() {
  return SERVICE_STARTERS.flatMap((starter) => [
    {
      _id: starter.templateId,
      _type: "generatorTemplate",
      title: starter.template.title,
      slug: { _type: "slug", current: starter.template.slug },
      description: starter.template.description,
      designFamily: starter.template.designFamily,
      outputType: "page",
      tokenDefinitions: TOKEN_DEFINITIONS,
      baseSections: starter.template.baseSections,
      optionalSections: starter.template.optionalSections,
      variationRules: ["angle-selects-optional-sections", "service-family-starter"],
      sectionVariants: starter.template.sectionVariants,
      status: "ready",
      devOnly: true,
    },
    {
      _id: starter.datasetId,
      _type: "generatorDataset",
      title: starter.dataset.title,
      slug: { _type: "slug", current: starter.dataset.slug },
      keywordSets: starter.dataset.keywordSets,
      rows: starter.dataset.rows,
      importMode: "manual",
      dedupePolicy: "skip-existing-slug",
      status: "ready",
      devOnly: true,
    },
    {
      _id: starter.programId,
      _type: "generatorProgram",
      title: `${starter.template.title} Program`,
      slug: { _type: "slug", current: `${starter.key}-service-program` },
      template: { _type: "reference", _ref: starter.templateId },
      dataset: { _type: "reference", _ref: starter.datasetId },
      programType: "location-pages",
      generationMode: "batch",
      routeBase: starter.dataset.routeBase,
      defaultSeoPattern: starter.dataset.seo,
      status: "ready",
      aiMode: "prepared",
      devOnly: true,
    },
  ]);
}

async function main() {
  const env = await loadSanityEnv();
  const dataset = `${env.NEXT_PUBLIC_SANITY_DATASET || ""}`.trim().toLowerCase();
  const tokenSource = env.SANITY_DEV ? "SANITY_DEV" : env.SANITY_AUTH_TOKEN ? "SANITY_AUTH_TOKEN" : null;

  if (dataset !== "development") {
    throw new Error(`Generator starter seeding is development-only. Received dataset: ${dataset || "<empty>"}.`);
  }

  if (!tokenSource) {
    throw new Error("Missing Sanity write token. Expected SANITY_DEV or SANITY_AUTH_TOKEN.");
  }

  const docs = buildDocs();

  if (WRITE_MODE) {
    const client = await createSanityWriteClient();
    for (const doc of docs) {
      await client.createOrReplace(doc);
    }
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        writeMode: WRITE_MODE,
        dataset,
        tokenSource,
        starterFamilies: SERVICE_STARTERS.map((item) => item.key),
        upsertedIds: docs.map((doc) => doc._id),
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
