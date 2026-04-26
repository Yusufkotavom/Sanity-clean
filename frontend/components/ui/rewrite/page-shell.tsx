import { Fragment } from "react";
import type { LegacyAstroPage } from "@/lib/legacy-pages/astro-static";
import { buildLegacyRewriteCopy } from "@/lib/legacy-pages/rewrite-content";
import {
  applyLegacyCopyOverrides,
  resolveSectionOrder,
  type LegacyPageOverride,
} from "@/lib/legacy-pages/legacy-overrides";
import JsonLd from "@/components/seo/json-ld";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildServiceJsonLd,
} from "@/lib/seo-jsonld";
import { getStrategicLinks } from "@/lib/legacy-pages/internal-links";
import RewriteHero from "@/components/ui/rewrite/hero";
import RewriteHighlights from "@/components/ui/rewrite/highlights";
import RewriteEeatSection from "@/components/ui/rewrite/eeat-section";
import RewriteProcessFaq from "@/components/ui/rewrite/process-faq";
import RewriteRelatedLinks from "@/components/ui/rewrite/related-links";
import MicroBadges from "@/components/micro-badges";
import { kotacomSplitIllustrations } from "@/lib/illustrations/kotacom-split";
import { urlFor } from "@/sanity/lib/image";
import { fetchLegacyPageOverrideByRoute, fetchSanitySeoSettings, fetchTemplatePageByRoute } from "@/sanity/lib/fetch";
import {
  resolveNarrativeSections,
  resolveTemplateCopy,
  resolveTemplateExperience,
  resolveTemplateHero,
  resolvePrimaryHeroEyebrow,
} from "@/lib/templates/resolve-template";
import { SectionPanel, SectionShell } from "@/components/ui/section-shell";
import { UtilityStrip } from "@/components/ui/rewrite/landing-sections/utility-strip";
import { ServiceTypesSection } from "@/components/ui/rewrite/landing-sections/service-types-section";
import { PricingPlansSection } from "@/components/ui/rewrite/landing-sections/pricing-plans-section";
import { FeaturesSection } from "@/components/ui/rewrite/landing-sections/features-section";
import { ProofSection } from "@/components/ui/rewrite/landing-sections/proof-section";
import { TestimonialsSection } from "@/components/ui/rewrite/landing-sections/testimonials-section";
import { LongGuideSection } from "@/components/ui/rewrite/landing-sections/long-guide-section";
import { FinalCtaSection } from "@/components/ui/rewrite/landing-sections/final-cta-section";

type RewritePageShellProps = {
  page: LegacyAstroPage;
  siblings?: LegacyAstroPage[];
  children?: React.ReactNode;
  routeOverride?: string;
  sectionHrefOverride?: string;
  sectionLabelOverride?: string;
};

export default async function RewritePageShell({
  page,
  siblings = [],
  children,
  routeOverride,
  sectionHrefOverride,
  sectionLabelOverride,
}: RewritePageShellProps) {
  const resolvedRoute = routeOverride ?? page.route;
  const resolvedSectionHref =
    sectionHrefOverride ?? (page.section ? `/${page.section}` : resolvedRoute);
  const resolvedSectionLabel =
    sectionLabelOverride ?? page.section.replace(/-/g, " ");
  const [templatePage, seo, override] = await Promise.all([
    fetchTemplatePageByRoute({ route: resolvedRoute }),
    fetchSanitySeoSettings(),
    fetchLegacyPageOverrideByRoute({
      route: resolvedRoute,
    }) as Promise<LegacyPageOverride>,
  ]);
  const siteUrl = (seo as any)?.siteUrl;
  const baseCopy = buildLegacyRewriteCopy(page);
  const templateCopy = resolveTemplateCopy({
    base: baseCopy,
    page: templatePage,
    template: templatePage?.template || null,
  });
  const copy = applyLegacyCopyOverrides(templateCopy, override);
  const templateExperience = resolveTemplateExperience({
    page: templatePage,
    template: templatePage?.template || null,
  });
  const related = siblings
    .filter((item) => item.route !== page.route)
    .slice(0, 12);
  const strategicLinks = getStrategicLinks(page);
  const breadcrumbParts = resolvedRoute.split("/").filter(Boolean);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    ...breadcrumbParts.map((segment, index) => ({
      name: segment
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      path: `/${breadcrumbParts.slice(0, index + 1).join("/")}`,
    })),
  ], { siteUrl });
  const showServiceSchema = [
    "pembuatan-website",
    "percetakan",
    "software",
    "sistem-pos",
    "layanan",
  ].includes(page.section);
  const serviceJsonLd = showServiceSchema
    ? buildServiceJsonLd({
        title: copy.primaryKeyword,
        description: copy.description,
        path: resolvedRoute,
        siteUrl,
      })
    : null;
  const faqJsonLd = copy.faqs.length > 0 ? buildFaqJsonLd(copy.faqs) : null;
  const heroImageBySection = (() => {
    if (page.route === "/contact" || page.section === "contact") {
      return {
        src: kotacomSplitIllustrations.contact.support,
        alt: `${copy.primaryKeyword} - KOTACOM`,
      };
    }
    if (page.section === "about") {
      return {
        src: kotacomSplitIllustrations.about.team,
        alt: `${copy.primaryKeyword} - KOTACOM`,
      };
    }
    if (page.section === "pembuatan-website") {
      return {
        src: kotacomSplitIllustrations.services.website.tokoOnline,
        alt: `${copy.primaryKeyword} - KOTACOM`,
      };
    }
    if (page.section === "percetakan") {
      return {
        src: "/images/products/cetak_percetakan_thumb_1775318012761.png",
        alt: `${copy.primaryKeyword} - KOTACOM`,
      };
    }
    if (page.section === "software") {
      return {
        src: kotacomSplitIllustrations.services.it.softwareCustom,
        alt: `${copy.primaryKeyword} - KOTACOM`,
      };
    }
    if (page.section === "layanan") {
      return {
        src: kotacomSplitIllustrations.ui.processWorkflow,
        alt: `${copy.primaryKeyword} - KOTACOM`,
      };
    }
    if (page.section === "sistem-pos") {
      return {
        src: kotacomSplitIllustrations.services.it.itSupport,
        alt: `${copy.primaryKeyword} - KOTACOM`,
      };
    }
    return undefined;
  })();
  const heroImageOverride = override?.heroOverride?.image?.asset
    ? {
        src: urlFor(override.heroOverride.image).width(1600).url(),
        alt:
          override.heroOverride.image?.alt ||
          `${copy.primaryKeyword} - KOTACOM`,
      }
    : null;
  const templateHero = resolveTemplateHero({
    page: templatePage,
    template: templatePage?.template || null,
  });
  const resolvedHeroEyebrow = resolvePrimaryHeroEyebrow({
    page: templatePage,
    template: templatePage?.template || null,
  });
  const templateHeroImage = templateHero?.image?.asset
    ? {
        src: urlFor(templateHero.image).width(1600).url(),
        alt:
          templateHero.image?.alt ||
          `${copy.primaryKeyword} - KOTACOM`,
      }
    : null;
  const heroImage = templateHeroImage || heroImageOverride || heroImageBySection;
  const locationOverview = templatePage?.location?.overview;
  const locationHighlights = templatePage?.location?.highlights || [];

  const utilityItems = [
    copy.serviceTypes?.length ? { id: "layanan", label: "Layanan" } : null,
    copy.pricingPlans?.length ? { id: "paket", label: "Paket" } : null,
    copy.features?.length ? { id: "fitur", label: "Fitur" } : null,
    copy.proofItems?.length ? { id: "portfolio", label: "Bukti Kerja" } : null,
    copy.testimonials?.length ? { id: "testimoni", label: "Testimoni" } : null,
    copy.longGuide?.length ? { id: "panduan", label: "Panduan" } : null,
    copy.faqs?.length ? { id: "faq", label: "FAQ" } : null,
  ].filter(Boolean) as Array<{ id: string; label: string }>;

  const laneSectionCopy = {
    website: {
      utilityTitle: "Eksplorasi layanan",
      utilityCtaTitle: "Mulai proyek",
      highlightsEyebrow: "Tantangan Utama",
      highlightsTitle: "Kendala utamanya seringkali bukan traffic, tetapi pesan website yang gagal meyakinkan pengunjung",
      highlightsDescription:
        "Jika website Anda tidak langsung menjawab 'apa manfaatnya untuk pengunjung', maka lalu lintas pengunjung yang Anda bayar mahal hanya akan mampir tanpa menjadi prospek. Kami merapikan struktur halaman dan CTA agar website benar-benar meningkatkan konversi.",
      servicesTitle: "Solusi website yang dirancang untuk fase bisnis spesifik Anda",
      servicesDescription:
        "Baik untuk validasi kredibilitas awal melalui company profile, maupun untuk mesin penjual harian berupa situs layanan terautomasi. Pilih arah pengembangan fungsional yang pas untuk mendukung bisnis Anda bertumbuh stabil hari ini.",
      pricingTitle: "Estimasi pengembangan yang proporsional",
      pricingDescription:
        "Pastikan biaya sesuai dengan target yang ingin dicapai. Anda dapat membandingkan paket di bawah sebagai fondasi awal kebutuhan kecepatan, fitur e-commerce, maupun tingkat keutuhan struktur konten nantinya.",
      featuresTitle: "Kapasitas inti yang menentukan performa website di mata pengguna",
      featuresDescription:
        "Desain menawan tidak cukup. Kami mengedepankan keamanan aset data, optimasi rasio tayang sempurna di HP pengunjung, dan struktur teknikal ramah penelusuran search engine organik untuk jangka panjang.",
      proofTitle: "Portofolio studi kasus",
      proofDescription:
        "Amati bagaimana cara kami menerjemahkan setiap masalah di berbagai model bisnis unik menjadi landing page persuasif dengan konversi prospek nyata terkendali.",
      testimonialsDescription:
        "Pelajari langsung pengalaman pebisnis di Indonesia dalam memperoleh kenyamanan serah terima pengerjaan tepat batas waktu dari layanan solusi kami sesudahnya tanpa ribet stres perpanjang revisi.",
      processEyebrow: "Cara Kerja Terukur",
      processTitle: "Metodologi kami melancarkan ide dari konsep awal agar segera siap rilis",
      processDescription:
        "Dengan tahapan yang kohesif, pengembangan halaman website akan berlangsung serempak. Memastikan penyesuaian fungsional tanpa banyak drama, dan menghindari fitur tertunda di fase live.",
      faqEyebrow: "Tanya Jawab Layanan",
      faqTitle: "Pertanyaan yang paling sering muncul sebelum pengerjaan proyek",
      faqDescription:
        "Memulai pengembangan platform butuh jawaban kepastian keamanan. Jangan cemas, komitmen terkait domain kepemilikan hosting, layanan update setelah tayang, dan retensi dukungan terjawab tuntas bagi Anda.",
      supportPrompt:
        "Ada pertanyaan mengenai opsi penambahan fasilitas keranjang checkout mandiri atau integrasi CRM terbaru?",
      supportCtaLabel: "Konsultasikan Kebutuhan Web Anda",
      supportLinkLabel: "Buka tahapan diskusi cepat kami",
      servicesEyebrow: "Pilihan Eksekusi",
      servicesBadgeLabel: "Pendekatan Solusi",
      servicesLinkLabel: "Rincian detail spesifikasi peluncuran",
      pricingEyebrow: "Porsi Anggaran",
      pricingRecommendedLabel: "Standard Industri Handal",
      pricingButtonLabelPrefix: "Lanjut pakai porsi ",
      proofEyebrow: "Catatan Kesuksesan Rilis Website",
      proofBadgeLabel: "Hasil lapangan",
      testimonialsEyebrow: "Tanggapan Mutu Kelancaran Serah Terima",
      testimonialsBadgeLabel: "Suara riil ulasan eksekutif partner kami",
      finalCtaEyebrow: "Ambil Momentum Digital",
      finalJourneyTitle: "Apa yang Anda lalui selepas menghubungi tim kami hari ini",
      guideEyebrow: "Panduan Evaluasi",
      guideDescription:
        "Lalui fase pertama perancangan digitalisasi mandiri dengan memahami apa saja pilar fungsional penentu harga jasa web dengan pedoman ringkas komprehensif berikut secara objektif aman menghindari kemahalan kelak.",
      guideCardEyebrow: "Prinsip Ceklis",
      guideHeading: `Persiapan kritis menajamkan instrumen ${copy.primaryKeyword}`,
    },
    software: {
      utilityTitle: "Eksplorasi modul perangkat lunak",
      utilityCtaTitle: "Diskusi arsitektur",
      highlightsEyebrow: "Hambatan Operasional",
      highlightsTitle: "Beralihlah saat pemrosesan pekerjaan rutin tanpa alat khusus jadi terlalu merugikan",
      highlightsDescription:
        "Beban tim untuk melakukan administrasi pembukuan berulang merupakan kebocoran profit tersembunyi. Kami hadir merapikan manajemen antrian proses sehingga data Anda tersinkron kilat di bawah naungan proteksi akses khusus.",
      servicesTitle: "Deret sistem terapan memecah kerumitan harian spesifik ruang kerja staf operasional",
      servicesDescription:
        "Segenap skenario kerumitan yang terus tumbuh akan diurai tuntas. Cermati penawaran sistem integratif pemeliharaan mesin, dashboard manajemen karyawan, hingga alur fakturisasi digital andalan terpadu instan.",
      pricingTitle: "Basis anggaran pengembangan software yang adil tanpa risiko mengejutkan dompet perusahaan",
      pricingDescription:
        "Ditinjau melalui kacamata investasi adopsi modul terkendali, tarif tertera membantalan langkah validasi dasar. Tak ada kewajiban menyewa porsi besar untuk sistem awal uji coba berjangka di lapangan produksi akhir.",
      featuresTitle: "Kenyamanan laju aktivitas pengguna yang mendukung pertumbuhan kinerja operasional otomatisasi",
      featuresDescription:
        "Membangun perangkat canggih dengan orientasi mudah dicerna. Kehandalan sistem tercermin dari waktu akses singkat di perangkat pengguna langsung tanpa error layar putih tak terduga yang menjengkelkan menghambat roda produktivitas internal.",
      proofTitle: "Dokumentasi nyata proyek software yang sudah berjalan di lapangan",
      proofDescription:
        "Lihat bagaimana sistem yang kami bangun mempersingkat alur kerja klien, mengurangi human error, dan meningkatkan efisiensi operasional secara terukur.",
      testimonialsDescription:
        "Dengar langsung dari pengguna bisnis kami yang mengalami transformasi nyata setelah menggunakan sistem yang kami kembangkan.",
      processEyebrow: "Alur Kerja Kami",
      processTitle: "Pengembangan terstruktur dengan komunikasi transparan di setiap sprint",
      processDescription:
        "Setiap fitur dipetakan bersama, divalidasi dalam prototype, lalu dikembangkan secara iteratif. Anda selalu tahu progres proyeknya tanpa perlu menebak-nebak.",
      faqEyebrow: "Pertanyaan Umum",
      faqTitle: "Hal yang sering ditanyakan sebelum memulai proyek software",
      faqDescription:
        "Jawaban atas pertanyaan seputar hak kepemilikan source code, jaminan maintenance, keamanan data, dan proses handover setelah proyek selesai.",
      supportPrompt:
        "Ada sistem lama yang perlu diintegrasikan atau API khusus yang belum pernah kami tangani? Ceritakan tantangannya dan kami siap mencari solusinya bersama.",
      supportCtaLabel: "Diskusi Teknis via WhatsApp",
      supportLinkLabel: "Lihat panduan evaluasi vendor software",
      servicesEyebrow: "Layanan Kami",
      servicesBadgeLabel: "Siap diimplementasikan",
      servicesLinkLabel: "Lihat detail modul ini",
      pricingEyebrow: "Investasi Pengembangan",
      pricingRecommendedLabel: "Paling banyak dipilih",
      pricingButtonLabelPrefix: "Diskusikan paket ini",
      proofEyebrow: "Hasil Nyata",
      proofBadgeLabel: "Terverifikasi dari klien",
      testimonialsEyebrow: "Kata Pengguna Sistem Kami",
      testimonialsBadgeLabel: "Ulasan langsung dari klien",
      finalCtaEyebrow: "Mulai Proyek Anda",
      finalJourneyTitle: "Langkah-langkah setelah Anda menghubungi tim pengembang kami",
      guideEyebrow: "Panduan Evaluasi",
      guideDescription:
        "Pelajari kriteria penting memilih vendor software yang tepat: dari pengalaman integrasi, model harga, hingga jaminan support jangka panjang.",
      guideCardEyebrow: "Checklist Evaluasi Vendor Software",
      guideHeading: `Panduan memilih jasa pengembangan ${copy.primaryKeyword} yang tepat`,
    },
    printing: {
      utilityTitle: "Jelajahi layanan percetakan kami",
      utilityCtaTitle: "Minta penawaran cetak",
      highlightsEyebrow: "Kualitas Cetak yang Bisa Anda Andalkan",
      highlightsTitle: "Hasil cetakan yang tepat spesifikasi, tepat waktu, dan tidak menguras anggaran",
      highlightsDescription:
        "Kesalahan cetak bukan hanya soal buang uang — ini soal reputasi brand Anda di mata klien. Kami menggunakan proses quality check ketat di setiap tahap produksi, dari proof digital hingga finishing, agar setiap lembar yang keluar dari mesin benar-benar sesuai ekspektasi awal.",
      servicesTitle: "Layanan percetakan lengkap untuk kebutuhan bisnis dan promosi",
      servicesDescription:
        "Dari cetak kartu nama, brosur, banner, hingga kalender dan kemasan produk — semua dikerjakan dengan mesin modern dan tim berpengalaman yang paham detail kebutuhan bisnis Anda.",
      pricingTitle: "Harga transparan, tanpa biaya tersembunyi",
      pricingDescription:
        "Setiap penawaran kami disertai rincian harga per item, termasuk pilihan kertas, finishing, dan estimasi waktu pengerjaan. Semakin besar kuantitas, semakin efisien harga per satuannya.",
      featuresTitle: "Teknologi cetak presisi dengan quality control ketat",
      featuresDescription:
        "Kami menggunakan mesin offset dan digital terkini dengan kalibrasi warna akurat. Setiap batch produksi melalui pengecekan dummy sebelum masuk produksi massal, memastikan tidak ada pergeseran warna atau presisi potong yang mengecewakan.",
      proofTitle: "Portofolio hasil cetak nyata dari berbagai klien bisnis",
      proofDescription:
        "Lihat dokumentasi hasil pengerjaan kami — mulai dari kemasan produk UMKM, buku tahunan sekolah, kalender perusahaan, hingga baliho event skala besar. Kualitas berbicara sendiri.",
      testimonialsDescription:
        "Dengar langsung dari pelanggan kami — dari UKM hingga perusahaan besar — yang mempercayakan kebutuhan cetak mereka dan mendapatkan hasil tepat waktu sesuai spesifikasi.",
      processEyebrow: "Cara Kerja Kami",
      processTitle: "Proses cetak yang terstruktur dari konsultasi hingga pengiriman",
      processDescription:
        "Mulai dari diskusi spesifikasi, approval proof digital, produksi, hingga quality check akhir sebelum dikirim. Setiap tahapan transparan dan dapat Anda pantau.",
      faqEyebrow: "Pertanyaan Umum",
      faqTitle: "Hal yang sering ditanyakan seputar layanan cetak kami",
      faqDescription:
        "Temukan jawaban atas pertanyaan umum seputar minimum order, waktu produksi, pilihan finishing, dan kebijakan revisi atau retur.",
      supportPrompt:
        "Ada kebutuhan cetak khusus yang belum Anda temukan di sini? Ceritakan spesifikasi Anda dan tim kami siap memberikan solusi terbaik.",
      supportCtaLabel: "Konsultasi Gratis via WhatsApp",
      supportLinkLabel: "Lihat panduan persiapan file cetak",
      servicesEyebrow: "Layanan Kami",
      servicesBadgeLabel: "Tersedia untuk bisnis Anda",
      servicesLinkLabel: "Lihat detail layanan ini",
      pricingEyebrow: "Paket & Harga",
      pricingRecommendedLabel: "Paling diminati",
      pricingButtonLabelPrefix: "Pesan paket ini",
      proofEyebrow: "Hasil Pengerjaan",
      proofBadgeLabel: "Diverifikasi klien",
      testimonialsEyebrow: "Kata Pelanggan Kami",
      testimonialsBadgeLabel: "Ulasan terverifikasi",
      finalCtaEyebrow: "Mulai Sekarang",
      finalJourneyTitle: "Langkah selanjutnya setelah Anda menghubungi kami",
      guideEyebrow: "Panduan Praktis",
      guideDescription:
        "Pelajari cara menyiapkan file cetak yang benar, memilih jenis kertas yang tepat, dan memastikan hasil cetakan sesuai kebutuhan brand Anda.",
      guideCardEyebrow: "Checklist Persiapan File Cetak",
      guideHeading: `Panduan memilih jasa cetak ${copy.primaryKeyword} yang tepat`,
    },
    generic: {
      utilityTitle: "Eksplorasi utilitas layanan strategis",
      utilityCtaTitle: "Mulai kolaborasi bisnis",
      highlightsEyebrow: "Tantangan Pengembangan",
      highlightsTitle: "Kami siap mendengarkan kerumitan masalah Anda demi memastikan penanganan yang efisien, lugas, dan tak salah sasaran",
      highlightsDescription:
        "Memilih mitra pendamping eksekusi sering berujung pemborosan lantaran arah prioritas kerja tidak sinkron sejak pertama. Kami mengunci ekspektasi target Anda agar langkah strategi benar-benar menyentuh sumbu penyelesaian efektif riil di operasional bisnis nyata komprehensif logis hemat waktu presisi cepat.",
      servicesTitle: "Spektrum pelayanan utama yang siap menopang eskalasi kesuksesan organisasi perusahaan mumpuni tervalidasi",
      servicesDescription:
        "Pilih cakupan layanan yang paling relevan dengan kebutuhan bisnis Anda saat ini, dari konsultasi IT, pengembangan sistem, hingga percetakan — semuanya dapat dikombinasikan sesuai kebutuhan.",
      pricingTitle: "Harga yang wajar, transparan, dan sesuai nilai yang diberikan",
      pricingDescription:
        "Kami tidak menyembunyikan biaya. Setiap paket disertai rincian lingkup kerja yang jelas, sehingga Anda tahu persis apa yang didapatkan dari setiap investasi.",
      featuresTitle: "Kemampuan yang relevan untuk berbagai kebutuhan bisnis",
      featuresDescription:
        "Dari solusi cepat hingga implementasi jangka panjang, kami menyesuaikan pendekatan dengan skala dan prioritas bisnis Anda saat ini.",
      proofTitle: "Rekam jejak proyek nyata dari berbagai industri",
      proofDescription:
        "Dokumentasi penyelesaian proyek dari berbagai klien menjadi landasan kepercayaan. Bukan janji, tapi bukti konkret kualitas yang bisa Anda verifikasi sendiri.",
      testimonialsDescription:
        "Dengar langsung dari pelanggan yang sudah bekerja sama dengan kami dan rasakan sendiri perbedaan yang kami berikan pada bisnis mereka.",
      processEyebrow: "Cara Kerja Kami",
      processTitle: "Alur kerja yang terstruktur dan komunikatif dari awal hingga selesai",
      processDescription:
        "Setiap proyek dimulai dengan pemahaman kebutuhan yang mendalam, diikuti proposal yang terukur, eksekusi terfokus, dan serah terima yang bersih.",
      faqEyebrow: "Pertanyaan Umum",
      faqTitle: "Pertanyaan yang sering muncul sebelum memulai kerja sama",
      faqDescription:
        "Temukan jawaban atas pertanyaan umum seputar garansi kualitas, revisi, timeline, dan dukungan purna layanan.",
      supportPrompt:
        "Belum yakin layanan mana yang paling sesuai untuk bisnis Anda? Tim kami siap membantu mengidentifikasi prioritas terbaik.",
      supportCtaLabel: "Konsultasi Gratis via WhatsApp",
      supportLinkLabel: "Pelajari layanan kami lebih lanjut",
      servicesEyebrow: "Layanan Kami",
      servicesBadgeLabel: "Tersedia untuk bisnis Anda",
      servicesLinkLabel: "Lihat detail layanan",
      pricingEyebrow: "Paket & Harga",
      pricingRecommendedLabel: "Paling banyak dipilih",
      pricingButtonLabelPrefix: "Pilih paket ini",
      proofEyebrow: "Portofolio",
      proofBadgeLabel: "Terverifikasi",
      testimonialsEyebrow: "Kata Pelanggan Kami",
      testimonialsBadgeLabel: "Ulasan nyata",
      finalCtaEyebrow: "Mulai Kerja Sama",
      finalJourneyTitle: "Langkah-langkah setelah Anda menghubungi kami",
      guideEyebrow: "Panduan",
      guideDescription:
        "Pelajari hal-hal penting yang perlu dipertimbangkan sebelum memilih mitra layanan IT atau percetakan untuk bisnis Anda.",
      guideCardEyebrow: "Checklist Sebelum Memulai",
      guideHeading: `Panduan memilih mitra ${copy.primaryKeyword} yang tepat untuk bisnis Anda`,
    },
  }[templateExperience.lane];

  const serviceContextName =
    templatePage?.serviceType?.title ||
    templatePage?.service?.title ||
    "";
  const locationContextName = templatePage?.location?.title || "";

  const routeAwareAddon = (() => {
    switch (templateExperience.routeKind) {
      case "city":
        return {
          services:
            locationContextName
              ? ` Kami sudah membantu bisnis di ${locationContextName} menemukan solusi yang tepat, efisien, dan sesuai kebutuhan spesifik area mereka.`
              : "",
          pricing:
            locationContextName
              ? ` Untuk bisnis di ${locationContextName}, harga kami dirancang kompetitif tanpa mengorbankan kualitas hasil kerja.`
              : "",
          proof:
            locationContextName
              ? ` Lihat proyek-proyek nyata yang sudah kami selesaikan untuk klien di wilayah ${locationContextName}.`
              : "",
          testimonials:
            locationContextName
              ? ` Dengar pengalaman langsung dari pelanggan kami di ${locationContextName} yang sudah merasakan manfaatnya.`
              : "",
          finalDescription:
            locationContextName
              ? ` Mulai transformasi bisnis Anda di ${locationContextName} bersama tim kami yang sudah berpengalaman di area ini.`
              : "",
          finalJourneySteps: [
            "Ceritakan kebutuhan spesifik bisnis Anda dan tantangan yang sedang dihadapi",
            "Kami petakan solusi terbaik dan kirimkan proposal yang jelas dan terukur",
            "Proyek berjalan sesuai timeline yang disepakati, dengan komunikasi terbuka di setiap tahap",
          ],
        };
      case "service":
        return {
          services:
            serviceContextName
              ? ` Layanan ${serviceContextName} kami dirancang untuk menyelesaikan hambatan operasional nyata yang kerap memperlambat pertumbuhan bisnis.`
              : "",
          pricing:
            serviceContextName
              ? ` Paket ${serviceContextName} ini menawarkan nilai terbaik dengan transparansi biaya yang jelas sejak awal.`
              : "",
          proof:
            serviceContextName
              ? ` Dokumentasi proyek ${serviceContextName} kami membuktikan kualitas yang konsisten di berbagai jenis klien.`
              : "",
          testimonials:
            serviceContextName
              ? ` Pelanggan yang menggunakan ${serviceContextName} kami melaporkan peningkatan efisiensi yang terukur dan signifikan.`
              : "",
          finalDescription:
            serviceContextName
              ? ` Ambil langkah pertama untuk mengoptimalkan ${serviceContextName} bisnis Anda bersama tim ahli kami.`
              : "",
          finalJourneySteps: [
            "Konsultasi awal untuk memahami scope kebutuhan dan prioritas Anda",
            "Proposal solusi yang spesifik, terukur, dan sesuai anggaran",
            "Eksekusi proyek dengan serah terima tepat waktu sesuai kesepakatan",
          ],
        };
      case "service-city":
        return {
          services:
            serviceContextName && locationContextName
              ? ` Layanan ${serviceContextName} kami di ${locationContextName} dihadirkan dengan pemahaman mendalam atas dinamika bisnis lokal di area tersebut.`
              : "",
          pricing:
            serviceContextName && locationContextName
              ? ` Harga ${serviceContextName} untuk klien di ${locationContextName} dirancang kompetitif dan sesuai standar pasar setempat.`
              : "",
          proof:
            serviceContextName && locationContextName
              ? ` Portfolio ${serviceContextName} kami di ${locationContextName} mencakup berbagai skala klien dengan hasil yang terverifikasi.`
              : "",
          testimonials:
            serviceContextName && locationContextName
              ? ` Pelaku bisnis di ${locationContextName} yang menggunakan ${serviceContextName} kami mengonfirmasi kepuasan atas kualitas dan ketepatan waktu pengerjaan.`
              : "",
          finalDescription:
            serviceContextName && locationContextName
              ? ` Mulai kerja sama ${serviceContextName} Anda di ${locationContextName} hari ini dengan konsultasi gratis bersama tim kami.`
              : "",
          finalJourneySteps: [
            "Sampaikan kebutuhan dan konteks bisnis Anda di area ini",
            "Kami kirimkan proposal yang disesuaikan dengan kondisi dan prioritas lokal Anda",
            "Proyek dimulai dengan timeline yang disepakati dan komunikasi yang transparan",
          ],
        };
      case "base":
      default:
        return {
          services: "",
          pricing: "",
          proof: "",
          testimonials: "",
          finalDescription: "",
          finalJourneySteps: [],

        };
    }
  })();

  const finalCtaCopy = {
    ...copy,
    finalCtaDescription:
      routeAwareAddon.finalDescription ||
      copy.finalCtaDescription,
  };

  const sectionMap = new Map<string, React.ReactNode>();
  sectionMap.set(
    "utility",
    <UtilityStrip
      tocItems={utilityItems}
      ctaLinks={copy.ctaLinks}
      ctaLabel={copy.ctaLabel}
      ctaHref={copy.ctaHref}
      title={laneSectionCopy.utilityTitle}
      ctaTitle={laneSectionCopy.utilityCtaTitle}
    />,
  );
  sectionMap.set(
    "highlights",
    <RewriteHighlights
      copy={copy}
      eyebrow={laneSectionCopy.highlightsEyebrow}
      title={laneSectionCopy.highlightsTitle}
      description={laneSectionCopy.highlightsDescription}
      secondaryCtaLabel={laneSectionCopy.supportCtaLabel}
    />,
  );
  sectionMap.set(
    "serviceTypes",
    copy.serviceTypes?.length ? (
      <ServiceTypesSection
        serviceTypes={copy.serviceTypes}
        eyebrow={laneSectionCopy.servicesEyebrow}
        title={laneSectionCopy.servicesTitle}
        description={`${laneSectionCopy.servicesDescription}${routeAwareAddon.services}`}
        badgeLabel={laneSectionCopy.servicesBadgeLabel}
        linkLabel={laneSectionCopy.servicesLinkLabel}
      />
    ) : null,
  );
  sectionMap.set(
    "pricing",
    copy.pricingPlans?.length ? (
      <PricingPlansSection
        pricingPlans={copy.pricingPlans}
        serviceTitle={page.title}
        eyebrow={laneSectionCopy.pricingEyebrow}
        title={laneSectionCopy.pricingTitle}
        description={`${laneSectionCopy.pricingDescription}${routeAwareAddon.pricing}`}
        recommendedLabel={laneSectionCopy.pricingRecommendedLabel}
        buttonLabelPrefix={laneSectionCopy.pricingButtonLabelPrefix}
      />
    ) : null,
  );
  sectionMap.set(
    "features",
    copy.features?.length ? (
      <FeaturesSection
        features={copy.features}
        title={laneSectionCopy.featuresTitle}
        description={laneSectionCopy.featuresDescription}
      />
    ) : null,
  );
  sectionMap.set(
    "proof",
    copy.proofItems?.length ? (
      <ProofSection
        proofItems={copy.proofItems}
        eyebrow={laneSectionCopy.proofEyebrow}
        title={laneSectionCopy.proofTitle}
        description={`${laneSectionCopy.proofDescription}${routeAwareAddon.proof}`}
        badgeLabel={laneSectionCopy.proofBadgeLabel}
      />
    ) : null,
  );
  sectionMap.set(
    "testimonials",
    copy.testimonials?.length ? (
      <TestimonialsSection
        testimonials={copy.testimonials}
        eyebrow={laneSectionCopy.testimonialsEyebrow}
        description={`${laneSectionCopy.testimonialsDescription}${routeAwareAddon.testimonials}`}
        badgeLabel={laneSectionCopy.testimonialsBadgeLabel}
      />
    ) : null,
  );
  sectionMap.set(
    "longGuide",
    copy.longGuide?.length ? (
      <LongGuideSection
        title={page.title}
        longGuide={copy.longGuide}
        eyebrow={laneSectionCopy.guideEyebrow}
        heading={laneSectionCopy.guideHeading}
        description={laneSectionCopy.guideDescription}
        cardEyebrow={laneSectionCopy.guideCardEyebrow}
      />
    ) : null,
  );
  if (copy.eeatPoints && copy.eeatPoints.length > 0) {
    sectionMap.set("eeat", <RewriteEeatSection copy={copy} />);
  }
  if (locationOverview) {
    sectionMap.set(
      "location",
      <SectionShell id="lokasi" className="py-10 md:py-12">
        <SectionPanel
          tone="sky"
          className="rounded-[1.75rem] p-6 md:p-8"
        >
          <p className="text-ui-label text-foreground/55">Lokasi</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            {templatePage?.location?.title || "Konteks Lokal"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
            {locationOverview}
          </p>
          {locationHighlights.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2 text-sm text-foreground/75">
              {locationHighlights.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border/60 px-3 py-1"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </SectionPanel>
      </SectionShell>,
    );
  }
  sectionMap.set(
    "process-faq",
    <RewriteProcessFaq
      copy={copy}
      processEyebrow={laneSectionCopy.processEyebrow}
      processTitle={laneSectionCopy.processTitle}
      processDescription={laneSectionCopy.processDescription}
      faqEyebrow={laneSectionCopy.faqEyebrow}
      faqTitle={laneSectionCopy.faqTitle}
      faqDescription={laneSectionCopy.faqDescription}
      supportPrompt={laneSectionCopy.supportPrompt}
      supportCtaLabel={laneSectionCopy.supportCtaLabel}
      supportLinkLabel={laneSectionCopy.supportLinkLabel}
    />,
  );
  sectionMap.set(
    "finalCta",
    <FinalCtaSection
      copy={finalCtaCopy}
      lane={templateExperience.lane}
      eyebrow={laneSectionCopy.finalCtaEyebrow}
      journeyTitle={laneSectionCopy.finalJourneyTitle}
      journeySteps={routeAwareAddon.finalJourneySteps}
    />,
  );
  if (related.length > 0 || strategicLinks.length > 0) {
    sectionMap.set(
      "related-links",
      <RewriteRelatedLinks
        page={page}
        related={related}
        strategicLinks={strategicLinks}
      />,
    );
  }
  sectionMap.set("micro-badges", <MicroBadges />);
  const baseOrder = [
    ...resolveNarrativeSections({
      page: templatePage,
      template: templatePage?.template || null,
      copy,
    }),
    "micro-badges",
  ];
  const requestedOrder = templatePage?.template ? baseOrder : resolveSectionOrder(override, baseOrder);
  const orderedIds: string[] = [];
  const seen = new Set<string>();
  requestedOrder.forEach((id) => {
    if (sectionMap.has(id) && !seen.has(id)) {
      orderedIds.push(id);
      seen.add(id);
    }
  });
  baseOrder.forEach((id) => {
    if (sectionMap.has(id) && !seen.has(id)) {
      orderedIds.push(id);
      seen.add(id);
    }
  });

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      {serviceJsonLd ? <JsonLd data={serviceJsonLd} /> : null}
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}

      <RewriteHero
        page={page}
        copy={copy}
        sectionLabel={resolvedSectionLabel}
        sectionHref={resolvedSectionHref}
        eyebrow={resolvedHeroEyebrow || override?.heroOverride?.eyebrow || undefined}
        heroImage={heroImage}
      />
      {children}
      {orderedIds.map((id) => (
        <Fragment key={id}>{sectionMap.get(id)}</Fragment>
      ))}
    </>
  );
}
