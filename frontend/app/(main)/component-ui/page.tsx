import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionIntro, SectionPanel, SectionShell, SplitVisualPanel } from "@/components/ui/section-shell";
import RewriteHero from "@/components/ui/rewrite/hero";
import MetricsRail from "@/components/ui/rewrite/metrics-rail";
import InlinePhraseStrip from "@/components/ui/rewrite/inline-phrase-strip";
import ProductStage from "@/components/ui/rewrite/product-stage";
import RewriteLandingSections from "@/components/ui/rewrite/landing-sections";
import QuoteSpotlight from "@/components/ui/rewrite/quote-spotlight";
import LogoWall from "@/components/ui/rewrite/logo-wall";
import MicroBadges from "@/components/micro-badges";
import RewriteHighlights from "@/components/ui/rewrite/highlights";
import RewriteProcessFaq from "@/components/ui/rewrite/process-faq";
import RewriteRelatedLinks from "@/components/ui/rewrite/related-links";
import type { LegacyAstroPage } from "@/lib/legacy-pages/astro-static";
import type { LegacyRewriteCopy } from "@/lib/legacy-pages/rewrite-content";
import type { StrategicLink } from "@/lib/legacy-pages/internal-links";
import { generateBasicMetadata } from "@/sanity/lib/metadata";
import { kotacomSplitIllustrations } from "@/lib/illustrations/kotacom-split";

export async function generateMetadata() {
  return await generateBasicMetadata({
    title: "Component UI",
    description:
      "Internal UI component canvas for rewrite primitives, visual panels, and Vercel-inspired section patterns.",
    slug: "component-ui",
    noindex: true,
  });
}

const metrics = [
  { value: "4", label: "primitive utama baru untuk alur visual-driven", brand: "UI kit" },
  { value: "2", label: "jalur CTA utama yang dijaga tetap fokus", brand: "Conversion" },
  { value: "1", label: "bahasa visual yang dipakai lintas section", brand: "System" },
  { value: "0", label: "target untuk card generik yang tidak punya peran jelas", brand: "Cleanup" },
];

const productStages = [
  {
    eyebrow: "Hero stage",
    title: "Centered hero dengan surface tipis dan CTA yang lebih dekat ke closing.",
    description:
      "Section ini dipakai untuk menguji ritme intro, visual panel, dan fokus conversion sebelum diterapkan ke halaman layanan lain.",
    image: kotacomSplitIllustrations.hero.cetakBukuV2,
    bullets: [
      "Headline lebih terstruktur",
      "Deskripsi masuk panel",
      "CTA primer tetap dominan",
    ],
  },
  {
    eyebrow: "Section stage",
    title: "Text dan visual dibangun sebagai satu scene, bukan dua elemen terpisah.",
    description:
      "Pola split panel ini jadi fondasi untuk layanan, pricing, proof, testimonial, dan closeout CTA.",
    image: kotacomSplitIllustrations.ui.processWorkflow,
    bullets: [
      "Separator lebih jelas",
      "Gradient tipis saling nyambung",
      "Frame konsisten lintas block",
    ],
  },
];

const demoPage: LegacyAstroPage = {
  route: "/component-ui",
  section: "pembuatan-website",
  slug: "component-ui",
  sourceFile: "internal/component-ui/page.tsx",
  title: "Component UI",
  migrationStatus: "draft",
};

const demoCopy: LegacyRewriteCopy = {
  primaryKeyword: "Jasa Pembuatan Website untuk Lead dan Penjualan",
  secondaryKeywords: [
    "landing page konversi",
    "struktur halaman komersial",
    "CTA WhatsApp",
  ],
  description:
    "Halaman audit untuk komponen rewrite yang dipakai pada layanan komersial.",
  intro:
    "Halaman ini kami pakai untuk mengaudit komponen rewrite satu per satu. Fokusnya bukan konten SEO, tetapi kualitas primitive, ritme visual, dan kesiapan section untuk dipakai ulang lintas landing page.",
  highlights: [
    "Visual lebih terarah",
    "Proof lebih cepat terbaca",
    "CTA lebih fokus",
    "Section lebih mudah diulang",
  ],
  process: [
    "Identifikasi komponen yang dipakai di halaman komersial.",
    "Uji hirarki visual, separator, dan CTA per section.",
    "Tentukan mana yang stable dan mana yang masih experimental.",
    "Turunkan ke halaman produksi setelah lolos audit.",
  ],
  faqs: [
    {
      question: "Kenapa halaman ini dibuat noindex?",
      answer:
        "Karena fungsinya untuk audit internal komponen, bukan untuk menjadi halaman publik yang ditargetkan ke pencarian.",
    },
    {
      question: "Apakah semua primitive rewrite akan diuji di sini?",
      answer:
        "Ya. Tujuannya supaya evaluasi dilakukan dari level komponen, bukan per halaman produksi.",
    },
  ],
  ctaLabel: "Diskusi UI Rewrite",
  ctaHref: "/contact",
  ctaLinks: [
    { label: "Audit Hero", href: "#component-rewrite-hero" },
    { label: "Audit Landing Sections", href: "#component-rewrite-landing" },
    { label: "Audit FAQ", href: "#component-rewrite-process-faq" },
    { label: "Lihat Style Guide", href: "/style-guide" },
  ],
  serviceTypes: [
    {
      title: "Hero & CTA",
      description: "Komponen pembuka untuk mengontrol headline, intro, dan arah CTA utama.",
      href: "#component-rewrite-hero",
      image: kotacomSplitIllustrations.services.website.tokoOnline,
    },
    {
      title: "Narrative Sections",
      description: "Komponen split panel untuk service, pricing, proof, dan testimonial.",
      href: "#component-rewrite-landing",
      image: kotacomSplitIllustrations.ui.processWorkflow,
    },
    {
      title: "Closeout & Support",
      description: "Komponen highlight, FAQ, related links, dan CTA closeout.",
      href: "#component-rewrite-highlights",
      image: kotacomSplitIllustrations.ui.ctaConsultation,
    },
  ],
  pricingPlans: [
    {
      name: "Stable",
      price: "Ready to reuse",
      description: "Komponen siap dipakai lintas halaman dengan perubahan data minimal.",
      items: ["Sudah punya pattern visual", "Sudah dipakai di shell", "Mudah dipahami tim"],
      recommended: true,
    },
    {
      name: "Experimental",
      price: "Need tuning",
      description: "Komponen sudah ada tetapi masih perlu penyetelan density atau data contract.",
      items: ["Masih hardcoded", "Perlu audit mobile", "Belum punya CMS contract"],
    },
    {
      name: "Future",
      price: "Next pass",
      description: "Komponen baru yang akan masuk setelah fondasi rewrite stabil.",
      items: ["Variasi media frame", "Interactive stage", "Dense proof rails"],
    },
  ],
  features: [
    {
      title: "Centered Hero",
      description: "Untuk headline komersial dengan dua CTA utama dan supporting keywords.",
      icon: "conversion",
    },
    {
      title: "Section Shell",
      description: "Untuk separator, rhythm, dan panel tipis yang nyambung antar section.",
      icon: "design",
    },
    {
      title: "Split Visual Panel",
      description: "Untuk pasangan text dan visual dalam satu scene.",
      icon: "speed",
    },
    {
      title: "Quote & Proof",
      description: "Untuk trust layer yang lebih kuat daripada card testimoni biasa.",
      icon: "support",
    },
  ],
  proofItems: [
    {
      title: "Hero Rewrite",
      description: "Pembuka halaman komersial dengan headline, intro, dan CTA fokus.",
      image: kotacomSplitIllustrations.hero.cetakBukuV2,
    },
    {
      title: "Landing Sections Rewrite",
      description: "Rangkaian service, pricing, features, proof, testimonial, dan CTA.",
      image: kotacomSplitIllustrations.ui.processWorkflow,
    },
    {
      title: "Supporting Primitives",
      description: "Metrics rail, phrase strip, quote spotlight, dan logo wall.",
      image: kotacomSplitIllustrations.proof.testimonial,
    },
  ],
  testimonials: [
    {
      name: "Internal Review",
      role: "UI Audit Pass",
      quote:
        "Dengan halaman ini, pembacaan komponen jadi jauh lebih mudah karena setiap section menunjukkan bentuk final dan fungsi komponennya.",
    },
  ],
  longGuide: [
    {
      title: "Audit dari level primitive",
      description: "Lebih efisien menilai komponen di satu tempat daripada membedah banyak halaman produksi.",
    },
    {
      title: "Pemisahan stable vs experimental",
      description: "Komponen bisa diberi status dan prioritas sebelum masuk ke shell utama.",
    },
  ],
  finalCtaTitle: "Siap audit komponen rewrite berikutnya?",
  finalCtaDescription:
    "Gunakan halaman ini sebagai referensi internal sebelum mendorong perubahan ke landing page publik.",
};

const demoRelatedPages: LegacyAstroPage[] = [
  {
    route: "/pembuatan-website/jasa-pembuatan-website-toko-online",
    section: "pembuatan-website",
    slug: "jasa-pembuatan-website-toko-online",
    sourceFile: "demo/rewrite",
    title: "Rewrite Website Toko Online",
    migrationStatus: "draft",
  },
  {
    route: "/jasa-cetak-buku-surabaya",
    section: "percetakan",
    slug: "jasa-cetak-buku-surabaya",
    sourceFile: "demo/city",
    title: "City Shell Cetak Buku",
    migrationStatus: "draft",
  },
];

const demoStrategicLinks: StrategicLink[] = [
  { title: "Style Guide", href: "/style-guide" },
  { title: "Rewrite Example", href: "/pembuatan-website/jasa-pembuatan-website-toko-online" },
  { title: "Component UI", href: "/component-ui" },
];

function ComponentMeta({
  title,
  file,
  purpose,
}: {
  title: string;
  file: string;
  purpose: string;
}) {
  return (
    <div className="container py-6">
      <div className="rounded-[1.35rem] border border-black/8 bg-white/70 p-4 backdrop-blur dark:border-white/10 dark:bg-white/5 md:p-5">
        <p className="text-ui-label text-foreground/55">Komponen Section</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          <span className="font-medium text-foreground/78">File:</span> {file}
        </p>
        <p className="mt-1 text-sm leading-7 text-muted-foreground">
          <span className="font-medium text-foreground/78">Fungsi:</span> {purpose}
        </p>
      </div>
    </div>
  );
}

export default function ComponentUiPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="container py-16 md:py-20">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-ui-label text-foreground/55">Internal UI Canvas</p>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight md:text-6xl">
              Component UI sandbox untuk primitive visual-driven.
            </h1>
            <div className="mx-auto mt-6 max-w-3xl rounded-[1.4rem] border border-black/8 bg-white/70 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/5 md:p-6">
              <p className="text-ui-body leading-8 text-foreground/72">
                Halaman ini khusus audit internal. Fungsinya untuk mengecek ritme section,
                tinted panel, split visual, metrics, quote spotlight, dan logo wall tanpa
                ikut masuk index.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/style-guide">
                  Buka Style Guide
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/pembuatan-website/jasa-pembuatan-website-toko-online">
                  Lihat Rewrite Page
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <MetricsRail items={metrics} />
      <InlinePhraseStrip
        phrases={[
          "Section lebih jelas",
          "Visual lebih terarah",
          "Component lebih siap dipakai ulang",
        ]}
      />

      <SectionShell className="py-10">
        <SectionIntro
          eyebrow="Catalogue"
          title="Daftar komponen yang sedang dipakai di sistem rewrite."
          description="Saya rapikan katalog ini agar lebih dekat ke bentuk produksi: lebih padat, lebih sedikit section yang patah, dan lebih mudah discan per primitive."
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[
            "RewriteHero",
            "MetricsRail",
            "InlinePhraseStrip",
            "SectionShell / SectionPanel / SplitVisualPanel",
            "ProductStage",
            "RewriteLandingSections",
            "MicroBadges",
            "QuoteSpotlight",
            "LogoWall",
            "RewriteHighlights",
            "RewriteProcessFaq",
            "RewriteRelatedLinks",
          ].map((item, index) => (
            <SectionPanel
              key={item}
              tone={index % 4 === 0 ? "neutral" : index % 4 === 1 ? "sky" : index % 4 === 2 ? "amber" : "emerald"}
              className="rounded-[1.2rem] px-4 py-4"
            >
              <p className="text-sm font-medium text-foreground">{item}</p>
            </SectionPanel>
          ))}
        </div>
      </SectionShell>

      <div id="component-rewrite-hero">
        <ComponentMeta
          title="RewriteHero"
          file="frontend/components/ui/rewrite/hero.tsx"
          purpose="Komponen pembuka untuk headline, intro, CTA primer, CTA sekunder, dan visual hero."
        />
        <RewriteHero
          page={demoPage}
          copy={demoCopy}
          sectionLabel="pembuatan website"
          sectionHref="/pembuatan-website"
          heroImage={{
            src: kotacomSplitIllustrations.hero.cetakBukuV2,
            alt: "Rewrite hero preview",
          }}
        />
      </div>

      <div id="component-metrics-rail">
        <ComponentMeta
          title="MetricsRail"
          file="frontend/components/ui/rewrite/metrics-rail.tsx"
          purpose="Komponen proof strip untuk angka cepat, value, dan short trust statements setelah hero."
        />
        <MetricsRail items={metrics} />
      </div>

      <div id="component-inline-phrase-strip">
        <ComponentMeta
          title="InlinePhraseStrip"
          file="frontend/components/ui/rewrite/inline-phrase-strip.tsx"
          purpose="Komponen heading phrase-strip untuk transisi besar antar area, terinspirasi dari treatment headline Vercel."
        />
        <InlinePhraseStrip
          phrases={[
            "Section lebih jelas",
            "Visual lebih terarah",
            "Component lebih siap dipakai ulang",
          ]}
        />
      </div>

      <ComponentMeta
        title="SectionShell / SectionPanel / SplitVisualPanel"
        file="frontend/components/ui/section-shell.tsx"
        purpose="Primitive dasar untuk separator, panel tipis bertint, dan pasangan text + visual dalam satu scene."
      />
      <SectionShell>
        <SectionIntro
          eyebrow="Surface"
          title="Primitive dasar untuk panel, split section, dan separator."
          description="Bagian ini dipakai untuk melihat bahasa visual utama tanpa distraksi data halaman produksi."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <SectionPanel tone="neutral" className="rounded-[1.5rem] p-5">
            <h2 className="text-lg font-semibold">Neutral panel</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Basis untuk section yang butuh tampilan tenang dan netral.
            </p>
          </SectionPanel>
          <SectionPanel tone="sky" className="rounded-[1.5rem] p-5">
            <h2 className="text-lg font-semibold">Sky panel</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Cocok untuk product stage, CTA sekunder, dan tech-story blocks.
            </p>
          </SectionPanel>
          <SectionPanel tone="amber" className="rounded-[1.5rem] p-5">
            <h2 className="text-lg font-semibold">Amber panel</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Cocok untuk closeout CTA, highlights, dan conversion focus area.
            </p>
          </SectionPanel>
        </div>
      </SectionShell>

      <SectionShell>
        <SplitVisualPanel
          tone="emerald"
          content={
            <>
              <p className="text-ui-label text-foreground/55">Split Visual Panel</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">
                Komponen ini jadi fondasi section ala Vercel di project ini.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
                Tujuannya bukan meniru layout mentah, tapi membuat sistem reusable
                untuk section yang selalu punya teks, visual, dan separator yang jelas.
              </p>
            </>
          }
          visual={
            <Image
              src={kotacomSplitIllustrations.services.website.tokoOnline}
              alt="Split panel preview"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 45vw, 100vw"
            />
          }
        />
      </SectionShell>

      <div id="component-product-stage">
        <ComponentMeta
          title="ProductStage"
          file="frontend/components/ui/rewrite/product-stage.tsx"
          purpose="Komponen scene bertahap untuk product narrative atau workflow yang perlu beberapa stage visual."
        />
      </div>
      <ProductStage
        title="Stage komponen untuk product narrative."
        description="Dipakai untuk menguji apakah halaman bisa terasa seperti product story, bukan sekadar katalog layanan."
        items={productStages}
      />

      <div id="component-rewrite-landing">
        <ComponentMeta
          title="RewriteLandingSections"
          file="frontend/components/ui/rewrite/landing-sections.tsx"
          purpose="Komponen section utama yang sekarang dipadatkan menjadi lane grids dan utility strip yang lebih rapat untuk layanan, pricing, proof, testimonial, dan CTA closeout."
        />
        <RewriteLandingSections page={demoPage} copy={demoCopy} />
      </div>

      <div id="component-micro-badges">
        <ComponentMeta
          title="MicroBadges"
          file="frontend/components/micro-badges.tsx"
          purpose="Komponen badge visual kecil untuk trust/support layer yang lebih ringan dari proof section besar."
        />
        <MicroBadges />
      </div>

      <div id="component-quote-spotlight">
        <ComponentMeta
          title="QuoteSpotlight"
          file="frontend/components/ui/rewrite/quote-spotlight.tsx"
          purpose="Komponen spotlight quote untuk customer story atau testimoni utama yang perlu tampil dominan."
        />
      </div>
      <QuoteSpotlight
        quote="Sistem komponen seperti ini membuat kita bisa audit UI dari level primitive, bukan tambal sulam per halaman."
        author="Internal Review"
        role="Design System Pass"
      />

      <div id="component-logo-wall">
        <ComponentMeta
          title="LogoWall"
          file="frontend/components/ui/rewrite/logo-wall.tsx"
          purpose="Komponen trust wall untuk stack, partner labels, capability tags, atau kategori trusted lanes."
        />
      </div>
      <LogoWall
        title="Trust wall versi rewrite."
        description="Bisa dipakai untuk stack, capability tags, partner labels, atau trusted lanes."
        items={[
          "Hero",
          "Panel",
          "Metrics",
          "Quote",
          "Logos",
          "CTA",
          "Proof",
          "FAQ",
          "Split",
          "Shell",
        ]}
      />

      <div id="component-rewrite-highlights">
        <ComponentMeta
          title="RewriteHighlights"
          file="frontend/components/ui/rewrite/highlights.tsx"
          purpose="Komponen highlight grid untuk menegaskan value utama layanan dengan CTA pendukung di bawahnya."
        />
        <RewriteHighlights copy={demoCopy} />
      </div>

      <div id="component-rewrite-process-faq">
        <ComponentMeta
          title="RewriteProcessFaq"
          file="frontend/components/ui/rewrite/process-faq.tsx"
          purpose="Komponen gabungan proses eksekusi dan FAQ dalam satu panel dua kolom."
        />
        <RewriteProcessFaq copy={demoCopy} />
      </div>

      <div id="component-rewrite-related-links">
        <ComponentMeta
          title="RewriteRelatedLinks"
          file="frontend/components/ui/rewrite/related-links.tsx"
          purpose="Komponen tautan strategis dan related links untuk menjaga eksplorasi internal setelah konten utama selesai."
        />
        <RewriteRelatedLinks
          page={demoPage}
          related={demoRelatedPages}
          strategicLinks={demoStrategicLinks}
        />
      </div>
    </>
  );
}
