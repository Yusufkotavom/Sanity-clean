import { promises as fs } from "node:fs";
import path from "node:path";

export type JsonUsahaMetric = {
  value: string;
  label: string;
};

export type JsonUsahaItem = {
  title: string;
  description?: string;
  href?: string;
  features?: string[];
  badge?: string;
  price?: string;
};

export type JsonUsahaFaq = {
  question: string;
  answer: string;
};

export type JsonUsahaTestimonial = {
  name: string;
  role?: string;
  quote: string;
};

export type JsonUsahaPage = {
  slug: string;
  sourceFile: string;
  title: string;
  description: string;
  badge?: string;
  heroImage?: string;
  businessType?: string;
  businessAddress?: string;
  businessPhone?: string;
  heroCta?: {
    label: string;
    href: string;
  } | null;
  metrics: JsonUsahaMetric[];
  features: JsonUsahaItem[];
  services: JsonUsahaItem[];
  reasons: JsonUsahaItem[];
  deliverables: JsonUsahaItem[];
  pricing: JsonUsahaItem[];
  testimonials: JsonUsahaTestimonial[];
  faqs: JsonUsahaFaq[];
  contentSections: { title?: string; body: string }[];
  finalCta?: {
    title: string;
    description?: string;
    primaryLabel?: string;
    primaryHref?: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  } | null;
};

const ROOT = path.join(
  process.cwd(),
  "content",
  "astro-local",
  "json-usaha",
);
const LOCAL_JSON_USAHA_DISABLED = true;
const DEFAULT_CONTACT = "/contact";
const MIN_FAQ_ITEMS = 4;

function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-");
}

type JsonUsahaIntentProfile = {
  keyword: string;
  challenge: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  finalCtaTitle: string;
  finalCtaDescription: string;
  faqSeeds: JsonUsahaFaq[];
};

function inferIntentProfile(
  slug: string,
  title: string,
  businessType?: string,
): JsonUsahaIntentProfile {
  const text = `${slug} ${title} ${businessType || ""}`.toLowerCase();

  if (
    text.includes("izin") ||
    text.includes("perizinan") ||
    text.includes("pkp")
  ) {
    return {
      keyword: businessType || "jasa perizinan bisnis",
      challenge: "proses dokumen yang sering berulang dan memakan waktu",
      primaryCtaLabel: "Konsultasi Dokumen",
      secondaryCtaLabel: "Minta Estimasi Proses",
      finalCtaTitle: "Siap Urus Perizinan Bisnis Tanpa Proses Berbelit?",
      finalCtaDescription:
        "Tim kami bantu audit dokumen, susun checklist, dan dampingi proses sampai izin terbit agar operasional bisnis Anda tidak tertunda.",
      faqSeeds: [
        {
          question: "Dokumen apa yang perlu disiapkan di awal proses perizinan?",
          answer:
            "Umumnya dibutuhkan data legalitas perusahaan, identitas pengurus, dan dokumen pendukung usaha. Kami bantu petakan detailnya sesuai jenis izin agar pengajuan lebih lancar.",
        },
        {
          question: "Apakah ada pendampingan sampai izin selesai terbit?",
          answer:
            "Ya. Kami dampingi dari tahap verifikasi berkas, pengajuan, monitoring progres, hingga tindak lanjut jika ada revisi dari instansi terkait.",
        },
      ],
    };
  }

  if (
    text.includes("agency") ||
    text.includes("digital") ||
    text.includes("website")
  ) {
    return {
      keyword: businessType || "layanan digital agency",
      challenge: "website dan funnel yang belum konsisten menghasilkan lead",
      primaryCtaLabel: "Jadwalkan Discovery Call",
      secondaryCtaLabel: "Minta Audit Funnel",
      finalCtaTitle: "Siap Ubah Traffic Menjadi Lead Berkualitas?",
      finalCtaDescription:
        "Kami bantu susun prioritas channel, perbaikan halaman, dan eksperimen CTA agar anggaran pemasaran lebih efisien dan terukur.",
      faqSeeds: [
        {
          question: "Apakah layanan ini cocok untuk bisnis yang baru mulai scale?",
          answer:
            "Cocok. Strategi kami disusun bertahap mulai dari channel prioritas dan quick wins agar dampak bisnis bisa dirasakan tanpa harus menunggu roadmap panjang selesai.",
        },
        {
          question: "Bagaimana cara mengukur hasil kampanye dan website secara nyata?",
          answer:
            "Kami tetapkan KPI sejak awal seperti lead qualified, conversion rate, dan biaya akuisisi, lalu melakukan review berkala agar keputusan optimasi berbasis data.",
        },
      ],
    };
  }

  return {
    keyword: businessType || title,
    challenge: "alur eksekusi layanan yang belum terstruktur",
    primaryCtaLabel: "Konsultasi Kebutuhan",
    secondaryCtaLabel: "Minta Penawaran",
    finalCtaTitle: `Siap Optimalkan ${businessType || "Layanan Bisnis Anda"}?`,
    finalCtaDescription:
      "Diskusikan target, timeline, dan ruang lingkup layanan bersama tim kami untuk mendapatkan rencana implementasi yang realistis dan terukur.",
    faqSeeds: [
      {
        question: "Bagaimana alur kerja setelah konsultasi awal?",
        answer:
          "Kami mulai dari pemetaan kebutuhan, dilanjutkan rekomendasi scope prioritas, estimasi waktu, lalu eksekusi bertahap dengan update progres yang jelas.",
      },
      {
        question: "Apakah layanan dapat disesuaikan dengan budget bisnis?",
        answer:
          "Bisa. Kami susun opsi paket atau scope kerja bertahap agar implementasi tetap berjalan sesuai prioritas bisnis dan kemampuan anggaran.",
      },
    ],
  };
}

function normalizeHeroTitle(rawTitle: string, profile: JsonUsahaIntentProfile) {
  const lower = rawTitle.toLowerCase();
  if (
    lower.includes("more than an agency of record") ||
    lower.includes("agency of progress")
  ) {
    return "Agency Digital untuk Meningkatkan Lead dan Pertumbuhan Bisnis";
  }
  return rawTitle || profile.keyword;
}

function enrichDescription(
  baseDescription: string,
  profile: JsonUsahaIntentProfile,
) {
  const clean = baseDescription.replace(/\s+/g, " ").trim();
  if (!clean) {
    return `Layanan ${profile.keyword} untuk membantu bisnis mengatasi ${profile.challenge} dengan eksekusi terstruktur dan pendampingan yang jelas.`;
  }
  if (clean.length >= 130) return clean;
  return `${clean} Fokus layanan kami pada ${profile.challenge} agar bisnis Anda dapat bergerak lebih cepat dengan risiko eksekusi yang lebih rendah.`;
}

function normalizeCtaLabel(rawLabel: string, fallback: string) {
  const label = rawLabel.replace(/\s+/g, " ").trim();
  if (!label) return fallback;

  const lower = label.toLowerCase();
  if (lower === "let's talk" || lower === "lets talk") return fallback;
  if (lower === "learn more") return "Pelajari Layanan";
  if (label.length < 4) return fallback;
  return label;
}

function mergeFaqs(
  sourceFaqs: JsonUsahaFaq[],
  profile: JsonUsahaIntentProfile,
): JsonUsahaFaq[] {
  const merged = [...sourceFaqs, ...profile.faqSeeds];
  const dedup = new Set<string>();
  const normalized = merged.filter((faq) => {
    const key = faq.question.toLowerCase().trim();
    if (!faq.question || !faq.answer || dedup.has(key)) return false;
    dedup.add(key);
    return true;
  });

  return normalized.slice(0, Math.max(MIN_FAQ_ITEMS, normalized.length));
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeMetric(item: unknown): JsonUsahaMetric | null {
  const source = asObject(item);
  const value = asString(source.point || source.number || source.value);
  const label = asString(
    source.description || source.label || source.title || source.name,
  );
  if (!value || !label) return null;
  return { value, label };
}

function normalizeItem(item: unknown): JsonUsahaItem | null {
  const source = asObject(item);
  const title = asString(source.title || source.name);
  const description = asString(source.description);
  const href = asString(
    source.link ||
      source.url ||
      asObject(source.cta).url ||
      asObject(source.link).url,
  );
  const badge = asString(source.badge);
  const price = asString(source.price);
  const features = asArray<unknown>(source.feature || source.features || source.benefits)
    .map((entry) => asString(entry))
    .filter(Boolean);

  if (!title && !description) return null;
  return {
    title: title || description,
    description: description || undefined,
    href: href || undefined,
    features: features.length ? features : undefined,
    badge: badge || undefined,
    price: price || undefined,
  };
}

function normalizeFaq(item: unknown): JsonUsahaFaq | null {
  const source = asObject(item);
  const question = asString(source.question || source.title);
  const answer = asString(source.answer || source.description);
  if (!question || !answer) return null;
  return { question, answer };
}

function normalizeTestimonial(item: unknown): JsonUsahaTestimonial | null {
  const source = asObject(item);
  const quote = asString(
    source.quote || source.description || source.content || source.testimonial,
  );
  const name = asString(source.name || source.title || source.client);
  const role = asString(source.role || source.position || source.company);
  if (!quote) return null;
  return {
    name: name || "Client",
    role: role || undefined,
    quote,
  };
}

function normalizeContentSections(data: Record<string, unknown>) {
  const content = asObject(data.content);
  const sections = asArray<unknown>(content.sections || content.content)
    .map((item) => {
      if (typeof item === "string") {
        const body = item.trim();
        return body ? { body } : null;
      }
      const source = asObject(item);
      const title = asString(source.title);
      const body = asString(source.description || source.content || source.body);
      if (!title && !body) return null;
      return {
        title: title || undefined,
        body: body || title,
      };
    })
    .filter(Boolean) as { title?: string; body: string }[];

  const fallback = [
    asString(content.description),
    asString(asObject(data.local).description),
    asString(asObject(data.business).description),
  ]
    .filter(Boolean)
    .map((body) => ({ body }));

  return sections.length ? sections : fallback;
}

function normalizeJsonUsaha(data: Record<string, unknown>, sourceFile: string): JsonUsahaPage {
  const fileBase = path.basename(sourceFile, ".json");
  const slug = slugify(fileBase);
  const hero = asObject(data.hero);
  const business = asObject(data.business);
  const features = asObject(data.features);
  const services = asObject(data.services);
  const whyUs = asObject(data.why_us);
  const whatYouGet = asObject(data.what_you_get);
  const pricing = asObject(data.pricing);
  const testimonials = asObject(data.testimonials);
  const faq = asObject(data.faq);
  const finalCta = asObject(data.final_cta);

  const baseTitle = asString(hero.title) || slug;
  const baseDescription =
    asString(hero.subtitle) ||
    asString(business.description) ||
    asString(asObject(data.content).subtitle) ||
    "Layanan bisnis code-driven dari source JSON Astro.";
  const profile = inferIntentProfile(
    slug,
    baseTitle,
    asString(business.type) || undefined,
  );
  const title = normalizeHeroTitle(baseTitle, profile);
  const description = enrichDescription(baseDescription, profile);
  const sourceFaqs = asArray<unknown>(faq.points || faq.questions)
    .map(normalizeFaq)
    .filter(Boolean) as JsonUsahaFaq[];

  return {
    slug,
    sourceFile,
    title,
    description,
    badge: asString(hero.badge_text || features.badge_text) || undefined,
    heroImage: asString(hero.image_url || hero.background_image) || undefined,
    businessType: asString(business.type) || undefined,
    businessAddress: asString(business.address) || undefined,
    businessPhone: asString(business.phone) || undefined,
    heroCta: (() => {
      const label = normalizeCtaLabel(
        asString(hero.cta_text) ||
          asString(finalCta.primary_cta && asObject(finalCta.primary_cta).text),
        profile.primaryCtaLabel,
      );
      const href =
        asString(hero.cta_url) ||
        asString(finalCta.primary_cta && asObject(finalCta.primary_cta).url) ||
        DEFAULT_CONTACT;
      return label ? { label, href } : null;
    })(),
    metrics: [
      ...asArray<unknown>(hero.feature).map(normalizeMetric),
      ...asArray<unknown>(asObject(data.stats).stats).map(normalizeMetric),
    ].filter(Boolean) as JsonUsahaMetric[],
    features: asArray<unknown>(features.point || features.items)
      .map(normalizeItem)
      .filter(Boolean) as JsonUsahaItem[],
    services: asArray<unknown>(services.point || services.services)
      .map(normalizeItem)
      .filter(Boolean) as JsonUsahaItem[],
    reasons: asArray<unknown>(whyUs.point || whyUs.reasons)
      .map(normalizeItem)
      .filter(Boolean) as JsonUsahaItem[],
    deliverables: asArray<unknown>(whatYouGet.points)
      .map(normalizeItem)
      .filter(Boolean) as JsonUsahaItem[],
    pricing: asArray<unknown>(pricing.plan || pricing.plans)
      .map(normalizeItem)
      .filter(Boolean) as JsonUsahaItem[],
    testimonials: asArray<unknown>(testimonials.card || testimonials.testimonials)
      .map(normalizeTestimonial)
      .filter(Boolean) as JsonUsahaTestimonial[],
    faqs: mergeFaqs(sourceFaqs, profile),
    contentSections: normalizeContentSections(data),
    finalCta: (() => {
      const ctaTitle = asString(finalCta.title) || asString(hero.title);
      const ctaDescription =
        asString(finalCta.description || finalCta.subtitle) || description;
      const primary = asObject(finalCta.primary_cta);
      const secondary = asObject(finalCta.secondary_cta);
      return ctaTitle
        ? {
            title: ctaTitle === title ? profile.finalCtaTitle : ctaTitle,
            description: ctaDescription || undefined,
            primaryLabel:
              normalizeCtaLabel(
                asString(primary.text) || asString(hero.cta_text),
                profile.primaryCtaLabel,
              ) || "Hubungi Tim",
            primaryHref:
              asString(primary.url) || asString(hero.cta_url) || DEFAULT_CONTACT,
            secondaryLabel:
              normalizeCtaLabel(asString(secondary.text), profile.secondaryCtaLabel) ||
              undefined,
            secondaryHref: asString(secondary.url) || DEFAULT_CONTACT,
          }
        : {
            title: profile.finalCtaTitle,
            description: profile.finalCtaDescription,
            primaryLabel: profile.primaryCtaLabel,
            primaryHref: DEFAULT_CONTACT,
            secondaryLabel: profile.secondaryCtaLabel,
            secondaryHref: DEFAULT_CONTACT,
          };
    })(),
  };
}

async function readAllJsonUsahaFiles() {
  if (LOCAL_JSON_USAHA_DISABLED) {
    return [];
  }

  let entries;
  try {
    entries = await fs.readdir(ROOT, { withFileTypes: true });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }

    throw error;
  }

  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort();

  const pages = await Promise.all(
    files.map(async (fileName) => {
      const raw = await fs.readFile(path.join(ROOT, fileName), "utf8");
      const data = JSON.parse(raw) as Record<string, unknown>;
      return normalizeJsonUsaha(data, fileName);
    }),
  );

  return pages.sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function getJsonUsahaPages() {
  return readAllJsonUsahaFiles();
}

export async function getJsonUsahaPageBySlug(slug: string) {
  const pages = await readAllJsonUsahaFiles();
  return pages.find((page) => page.slug === slug) || null;
}

export async function getJsonUsahaStaticParams() {
  const pages = await readAllJsonUsahaFiles();
  return pages.map((page) => ({ slug: page.slug }));
}
