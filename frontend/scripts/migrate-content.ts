import { config } from "dotenv";
import { createClient } from "@sanity/client";

// Load environment variables
config();

// Create client with write permissions
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-31",
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
});

// Hardcoded content from the original files
const siteSettingsData = {
  _type: "siteSettings",
  title: "Kotacom - Partner Eksekusi Digital",
  description: "Website, software, IT support, dan percetakan dalam satu jalur kerja untuk bisnis yang butuh partner eksekusi.",
  companyName: "Kotacom",
  companyTagline: "Partner Eksekusi Digital",
  companyDescription: "Kami membantu bisnis bergerak dari brief ke implementasi dengan scope yang jelas, timeline realistis, dan pendampingan sampai sistem benar-benar dipakai.",
  foundedYear: 2008,
  projectsCompleted: 150,
  location: "Surabaya",
  coverage: "Jangkauan Nasional",
  whatsapp: "6281335275219",
  techStack: [
    "React",
    "Next.js",
    "Astro.js",
    "Node.js",
    "Laravel",
    "Python",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Google Cloud",
    "Flutter",
    "Docker",
  ],
};

const homeContentData = {
  _type: "homeContent",
  heroEyebrow: "Partner Eksekusi Digital",
  heroTitle: "Website, software, IT support, dan percetakan dalam satu jalur kerja.",
  heroDescription: "Kami membantu bisnis bergerak dari brief ke implementasi dengan scope yang jelas, timeline realistis, dan pendampingan sampai sistem benar-benar dipakai.",
  heroPrimaryCta: {
    label: "Lihat Solusi untuk Bisnis Anda",
    href: "/services",
  },
  heroSecondaryCta: {
    label: "Diskusikan Kebutuhan Anda",
    href: "https://wa.me/6281335275219",
  },
  foundedYear: 2008,
  projectsCompleted: 150,
  location: "Surabaya",
  coverage: "Jangkauan Nasional",
  servicesEyebrow: "Layanan Utama Kotacom",
  servicesTitle: "Empat layanan utama yang saling melengkapi untuk membantu bisnis bergerak lebih rapi.",
  servicesDescription: "Mulai dari website, software, support, hingga percetakan, setiap layanan dirancang agar bisa berdiri sendiri atau digabung menjadi sistem kerja yang lebih utuh.",
  workflowTitle: "Cara kami bekerja",
  workflowSteps: [
    {
      title: "Pahami kebutuhan bisnis",
      description: "Kami mulai dari tujuan, hambatan operasional, dan target yang ingin dicapai agar solusi yang dibuat benar-benar relevan.",
    },
    {
      title: "Susun solusi yang realistis",
      description: "Setelah arahnya jelas, kami bantu memetakan prioritas, scope kerja, timeline, dan bentuk implementasi yang paling masuk akal.",
    },
    {
      title: "Eksekusi dan pendampingan",
      description: "Pekerjaan tidak berhenti saat rilis. Kami lanjutkan dengan support, evaluasi, dan penyesuaian agar hasilnya tetap berguna di lapangan.",
    },
  ],
  closingTitle: "Bangun solusi yang lebih rapi, lebih stabil, dan lebih siap dipakai untuk tumbuh.",
  closingDescription: "Jika bisnis Anda butuh partner untuk website, software, support, atau percetakan, Kotacom siap membantu memetakan kebutuhan dan menyiapkan langkah yang paling relevan.",
  assurancePoints: [
    {
      label: "Pendekatan terarah",
      value: "Kami bantu dari pemetaan kebutuhan sampai implementasi yang realistis.",
    },
    {
      label: "Eksekusi lintas layanan",
      value: "Website, software, support, dan percetakan bisa disusun sebagai satu alur kerja yang utuh.",
    },
    {
      label: "Siap ditindaklanjuti",
      value: "Konsultasi awal, penawaran, dan langkah mulai dirancang agar prospek bisa bergerak tanpa kebingungan.",
    },
  ],
};

const faqData = [
  {
    _type: "faq",
    question: "Berapa lama waktu pembuatan website?",
    answer: "Tergantung kompleksitas project, umumnya website company profile membutuhkan waktu 2-4 minggu, website toko online 4-6 minggu, dan aplikasi custom 6-12 minggu. Timeline pasti akan kami diskusikan di awal project setelah memahami kebutuhan detail Anda.",
    category: "website",
    isActive: "active",
  },
  {
    _type: "faq",
    question: "Apakah ada garansi untuk layanan IT support?",
    answer: "Ya, kami memberikan garansi untuk setiap pekerjaan yang kami lakukan sesuai dengan scope yang disepakati. Untuk hardware, garansi mengikuti garansi distributor. Untuk software dan konfigurasi, kami memberikan garansi 30 hari setelah serah terima.",
    category: "support",
    isActive: "active",
  },
  {
    _type: "faq",
    question: "Apakah Kotacom melayani klien di luar Surabaya?",
    answer: "Ya, kami melayani klien di seluruh Indonesia. Untuk area Jawa Timur (Surabaya, Sidoarjo, Gresik, Malang), kami bisa melakukan kunjungan on-site. Untuk area lain, kami melayani dengan sistem remote support dan koordinasi online yang efektif.",
    category: "general",
    isActive: "active",
  },
  {
    _type: "faq",
    question: "Berapa biaya pembuatan website dan software?",
    answer: "Biaya bervariasi tergantung kebutuhan dan kompleksitas. Website company profile mulai dari 5 juta, website toko online mulai dari 10 juta, dan software custom mulai dari 15 juta. Hubungi kami untuk konsultasi gratis dan penawaran yang sesuai dengan budget Anda.",
    category: "pricing",
    isActive: "active",
  },
  {
    _type: "faq",
    question: "Apakah website yang dibuat mobile-friendly?",
    answer: "Ya, semua website yang kami buat sudah responsive dan mobile-friendly. Kami menggunakan teknologi modern seperti Next.js dan Tailwind CSS yang memastikan website tampil optimal di semua perangkat (desktop, tablet, dan mobile).",
    category: "website",
    isActive: "active",
  },
  {
    _type: "faq",
    question: "Apakah saya bisa update konten website sendiri?",
    answer: "Ya, kami menggunakan Sanity CMS yang user-friendly sehingga Anda bisa update konten website sendiri tanpa perlu coding. Kami juga akan memberikan training singkat cara menggunakan CMS setelah website selesai.",
    category: "website",
    isActive: "active",
  },
];

const whyChooseReasonsData = [
  {
    _type: "whyChooseReason",
    title: "Berpengalaman Sejak 2008",
    description: "Lebih dari 15 tahun melayani bisnis di Surabaya dan sekitarnya dengan track record yang terbukti.",
    icon: "award",
    order: 1,
    isActive: "active",
  },
  {
    _type: "whyChooseReason",
    title: "One-Stop Solution",
    description: "Tidak perlu koordinasi dengan banyak vendor. Semua kebutuhan IT dan digital dalam satu partner terpercaya.",
    icon: "heart-handshake",
    order: 2,
    isActive: "active",
  },
  {
    _type: "whyChooseReason",
    title: "Support Berkelanjutan",
    description: "Kami tidak hanya build dan pergi. Tim kami siap support jangka panjang untuk memastikan sistem Anda tetap optimal.",
    icon: "trending-up",
    order: 3,
    isActive: "active",
  },
  {
    _type: "whyChooseReason",
    title: "Harga Transparan",
    description: "Tidak ada biaya tersembunyi. Semua dijelaskan di awal sebelum project dimulai dengan penawaran yang jelas.",
    icon: "shield",
    order: 4,
    isActive: "active",
  },
];

const serviceLanesData = [
  {
    _type: "serviceLane",
    key: "website",
    eyebrow: "Website Development",
    title: "Website profesional yang jelas, cepat, dan siap mendukung penjualan.",
    description: "Untuk company profile, landing page, sekolah, toko online, dan kebutuhan promosi yang perlu struktur informasi rapi serta alur konversi yang kuat.",
    href: "/pembuatan-website",
    bullets: ["Company profile", "Landing page", "Toko online"],
    order: 1,
    isActive: "active",
  },
  {
    _type: "serviceLane",
    key: "software",
    eyebrow: "Software Development",
    title: "Software custom untuk proses bisnis yang tidak bisa diselesaikan template umum.",
    description: "Cocok untuk dashboard bisnis, POS, CRM, otomasi operasional, dan integrasi proses yang membutuhkan sistem kerja sendiri.",
    href: "/software",
    bullets: ["POS & dashboard", "CRM & operasional", "Integrasi proses"],
    order: 2,
    isActive: "active",
  },
  {
    _type: "serviceLane",
    key: "support",
    eyebrow: "IT Support & Infra",
    title: "Support teknis dan infrastruktur agar operasional tetap stabil setiap hari.",
    description: "Layanan support, network setup, administrasi server, dan konsultasi teknis untuk menjaga ritme kerja tim tetap lancar.",
    href: "/services",
    bullets: ["IT support", "Network setup", "System administration"],
    order: 3,
    isActive: "active",
  },
  {
    _type: "serviceLane",
    key: "printing",
    eyebrow: "Printing & Design",
    title: "Percetakan dan materi promosi yang siap dipakai untuk membangun trust dan distribusi.",
    description: "Buku, brosur, kalender, seminar kit, dan materi promosi lain yang dirancang untuk kebutuhan bisnis, event, dan branding.",
    href: "/percetakan",
    bullets: ["Cetak buku", "Brosur & kalender", "Materi promosi"],
    order: 4,
    isActive: "active",
  },
];

const serviceClustersData = [
  {
    _type: "serviceCluster",
    title: "Dukungan IT Profesional",
    description: "Layanan support yang membantu bisnis menjaga perangkat, jaringan, server, dan kebutuhan teknis tetap siap dipakai tanpa mengganggu ritme kerja.",
    href: "/services",
    priceHint: "Mulai dari support insidental hingga maintenance rutin",
    bullets: ["Macbook & Windows service", "Server maintenance", "Pengadaan alat IT"],
    order: 1,
    isActive: "active",
  },
  {
    _type: "serviceCluster",
    title: "Jasa Pembuatan Website & Software",
    description: "Website dan software kami susun sebagai lane utama untuk bisnis yang ingin memperbaiki cara presentasi, cara kerja, dan alur penjualan sekaligus.",
    href: "/pembuatan-website",
    priceHint: "Mulai dari website bisnis hingga aplikasi custom",
    bullets: ["Website sekolah & perusahaan", "Custom web apps", "CRM, CMS, aplikasi bisnis"],
    order: 2,
    isActive: "active",
  },
  {
    _type: "serviceCluster",
    title: "Layanan Percetakan",
    description: "Percetakan kami posisikan sebagai pelengkap trust dan distribusi materi bisnis, mulai dari buku, seminar kit, sampai kebutuhan promosi offline.",
    href: "/percetakan",
    priceHint: "Untuk buku, kalender, seminar kit, dan materi promosi",
    bullets: ["Jasa cetak buku", "Kalender & seminar kit", "Map, brosur, dan lainnya"],
    order: 3,
    isActive: "active",
  },
];

async function seedContent() {
  try {
    console.log("🌱 Starting content migration to Sanity...");

    // Create site settings
    console.log("📝 Creating site settings...");
    const siteSettings = await client.create(siteSettingsData);
    console.log("✅ Site settings created:", siteSettings._id);

    // Create home content
    console.log("🏠 Creating home content...");
    const homeContent = await client.create(homeContentData);
    console.log("✅ Home content created:", homeContent._id);

    // Create FAQs
    console.log("❓ Creating FAQs...");
    for (const faq of faqData) {
      const createdFaq = await client.create(faq);
      console.log("✅ FAQ created:", createdFaq._id);
    }

    // Create why choose reasons
    console.log("🏆 Creating why choose reasons...");
    for (const reason of whyChooseReasonsData) {
      const createdReason = await client.create(reason);
      console.log("✅ Why choose reason created:", createdReason._id);
    }

    // Create service lanes
    console.log("🛣️ Creating service lanes...");
    for (const lane of serviceLanesData) {
      const createdLane = await client.create(lane);
      console.log("✅ Service lane created:", createdLane._id);
    }

    // Create service clusters
    console.log("📦 Creating service clusters...");
    for (const cluster of serviceClustersData) {
      const createdCluster = await client.create(cluster);
      console.log("✅ Service cluster created:", createdCluster._id);
    }

    console.log("🎉 Content migration completed successfully!");
    console.log("📋 Summary:");
    console.log("- 1 site settings document");
    console.log("- 1 home content document");
    console.log(`- ${faqData.length} FAQ documents`);
    console.log(`- ${whyChooseReasonsData.length} why choose reason documents`);
    console.log(`- ${serviceLanesData.length} service lane documents`);
    console.log(`- ${serviceClustersData.length} service cluster documents`);

  } catch (error) {
    console.error("❌ Error during content migration:", error);
    process.exit(1);
  }
}

// Run the migration
seedContent();