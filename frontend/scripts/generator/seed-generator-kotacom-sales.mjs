import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getCliOption,
  loadSanityEnv,
  resolveSanityTokenSource,
} from "../lib/sanity-page-guards.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(DIR, "../../tmp/generator-kotacom-sales.ndjson");
const SUMMARY = path.resolve(DIR, "../../tmp/generator-kotacom-sales-summary.json");

const QUERY = `*[_type in ["pageLocation","serviceLocation"] && defined(route)]|order(route asc){
  _id,_type,title,route,routePattern,structured,meta,
  template->{lane,title,shellId},
  serviceType->{title,category,"slug":slug.current,description},
  service->{title,"slug":slug.current},
  location->{title,"slug":slug.current,province,region,overview,highlights}
}`;

const F = {
  printing: {
    id: "printing", title: "Percetakan", routeBase: "/percetakan", category: "printing", metric: "10+", metricLabel: "Tahun melayani kebutuhan cetak korporat dan sekolah", price: "Mulai dari simulasi jumlah & ukuran", timeline: "Tergantung antrean, bahan, dan jumlah cetak", cta: "Tanya Harga & Estimasi Selesai",
    headline: "Cetak lebih rapi, warna akurat, tanpa bolak-balik salah spesifikasi",
    sub: "Kirim file Anda, tim kami bantu cek margin, resolusi, dan bahan yang paling cocok. Mulai produksi dengan tenang dan deadline yang pasti.",
    problems: ["Bingung kertas apa yang cocok dan apakah file PDF sudah siap naik cetak.", "Takut harga melonjak karena biaya tersembunyi atau finishing yang salah hitung.", "Vendor lambat merespon saat deadline acara atau deadline distribusi sudah dekat.", "Khawatir ongkos kirim ke kota Anda mahal atau buku rusak di jalan."],
    solution: "KOTACOM memberikan simulasi harga transparan, file check sebelum naik cetak, opsi bahan lengkap, dan kontrol kualitas hingga barang dikirim.",
    values: [["Check File Gratis", "Kami pastikan resolusi, bleed, dan margin aman sebelum dicetak agar hasil tidak terpotong."], ["Simulasi Harga Transparan", "Bebas diskusi untuk menyesuaikan ukuran, bahan, dan jumlah cetak agar pas dengan budget."], ["QC & Packing Aman", "Setiap buku, kalender, atau materi promosi dipacking rapi agar aman sampai tujuan."]],
    services: [["Cetak Buku & Modul", "Untuk penulis, sekolah, kampus, dan perusahaan. Siap dari file PDF.", ["Softcover / Hardcover", "HVS / Bookpaper / Artpaper", "Lem Panas / Spiral"], "Mulai dari simulasi jumlah", "Sesuai antrean", "Best Seller"], ["Cetak Buku Kenangan & Yasin", "Untuk acara komunitas, sekolah, pesantren, dan keluarga.", ["Desain bisa dibantu ringan", "Pilihan laminasi Doff/Glossy", "Opsi Poli/Emboss"], "Mulai dari cek file", "Mengikuti jumlah", "Komunitas"], ["Materi Promosi & Packaging", "Kalender, brosur, stiker, kartu nama, dan kemasan produk.", ["Warna akurat", "Potongan presisi", "Sanggup partai besar"], "Mulai dari konsultasi bahan", "Bisa lebih cepat", "Cepat"]],
    faq: [["Apakah file PDF saya sudah aman untuk dicetak?", "Kirimkan ke WhatsApp kami. Tim pra-cetak akan bantu cek resolusi, margin aman, dan format warna (CMYK) sebelum memberikan quote."], ["Bisakah saya cetak satuan (on-demand)?", "Tentu, kami melayani print on demand (POD) maupun cetak offset partai besar. Harga satuan akan berbeda dengan harga grosir."], ["Kenapa harga tidak langsung dipajang satu angka?", "Harga cetak sangat dipengaruhi dimensi, jumlah halaman, jenis kertas, laminasi, dan quantity. Simulasi harga kami pastikan akurat dan tidak berubah-ubah."], ["Apakah melayani pengiriman ke luar Surabaya/luar pulau?", "Ya, kami sering melayani pengiriman ke seluruh Indonesia menggunakan kargo cargo darat/laut yang aman dan terjangkau."]],
  },
  website: {
    id: "website", title: "Website", routeBase: "/pembuatan-website", category: "website", metric: "Berjalan 24/7", metricLabel: "Menangkap leads dan inquiry bisnis Anda", price: "Mulai dari Rp 1,5 Juta", timeline: "Mulai 7 - 14 Hari Kerja", cta: "Konsultasi Website Gratis",
    headline: "Website profesional yang cepat dimuat dan siap menerima calon pelanggan",
    sub: "Jangan biarkan bisnis Anda terlihat tidak meyakinkan. Bangun company profile, toko online, atau web sekolah yang responsif, modern, dan mudah dikelola.",
    problems: ["Punya website tapi lambat dibuka dan susah diakses lewat HP.", "Tampilan website terlihat jadul, tidak mewakili kualitas bisnis Anda saat ini.", "Pernah pakai jasa web tapi ditinggal kabur dan tidak diajari cara update konten.", "Takut biaya perpanjangan domain dan hosting tahunan yang tidak transparan."],
    solution: "KOTACOM membangun website dengan struktur rapi, hosting cepat, keamanan terjaga, dan dukungan teknis (maintenance) yang jelas.",
    values: [["Desain Responsif", "Tampilan menyesuaikan otomatis di HP, tablet, maupun laptop."], ["Akses Kontrol Penuh", "Anda mendapatkan akses login admin untuk update teks dan foto kapan saja."], ["Support & Maintenance", "Tidak perlu khawatir jika ada error. Kami bantu kelola hosting, domain, dan perbaikan."]],
    services: [["Company Profile", "Untuk perusahaan, jasa profesional, dan B2B yang butuh profil kredibel.", ["Halaman layanan jelas", "CTA WhatsApp terarah", "Email bisnis (nama@domain.com)"], "Mulai Rp 1,5 Juta", "7 - 14 Hari Kerja", "Populer"], ["Toko Online / Katalog", "Untuk retail dan UMKM yang ingin katalog produk rapi di luar marketplace.", ["Katalog produk", "Keranjang belanja", "Integrasi WA / Payment"], "Mulai Rp 2,5 Juta", "14 - 21 Hari Kerja", "Commerce"], ["Website Instansi / Sekolah", "Untuk sekolah, kampus, klinik, dan NGO yang butuh publikasi informasi.", ["Sistem berita / artikel", "Pendaftaran online", "Galeri foto kegiatan"], "Mulai dari diskusi fitur", "Menyesuaikan kompleksitas", "Instansi"]],
    faq: [["Apakah saya harus menyiapkan desain sendiri?", "Tidak. Cukup siapkan logo, foto produk/kantor, dan profil singkat. Tim kami yang akan merancang layout-nya."], ["Apakah harga sudah termasuk domain dan hosting?", "Ya, paket pembuatan awal kami biasanya sudah bundel dengan domain (.com / .id / .co.id) dan hosting untuk 1 tahun pertama."], ["Bagaimana dengan perpanjangan tahun berikutnya?", "Biaya perpanjangan akan diinfokan transparan sejak awal, umumnya mencakup biaya domain dan langganan server tahunan."], ["Apakah website ini nanti bisa masuk halaman 1 Google?", "Website dibuat ramah mesin pencari (SEO friendly). Namun untuk garansi halaman 1, butuh optimasi SEO berkelanjutan di luar paket pembuatan standar."]],
  },
  software: {
    id: "software", title: "Software & POS", routeBase: "/software", category: "software", metric: "Support Penuh", metricLabel: "Pendampingan dari instalasi hingga tim bisa pakai", price: "Sesuai Scope Fitur", timeline: "Estimasi setelah mapping alur kerja", cta: "Minta Demo / Diskusi Sistem",
    headline: "Sistem operasional dan kasir yang mengikuti cara kerja bisnis Anda",
    sub: "Tinggalkan laporan manual dan data tersebar di Excel. Rapikan stok, transaksi, dan kontrol karyawan dengan software yang mudah dipakai.",
    problems: ["Pemilik usaha kewalahan memantau stok, uang masuk, dan kinerja cabang.", "Data sering dobel atau salah input karena masih menggunakan Excel dan buku tulis.", "Takut beli aplikasi mahal tapi fitur terlalu rumit dan karyawan malas memakainya.", "Butuh laporan otomatis setiap tutup toko tanpa harus menghitung manual berjam-jam."],
    solution: "Kami bantu audit proses bisnis Anda, merekomendasikan modul prioritas (POS, stok, laporan), lalu melakukan implementasi bertahap agar tim cepat adaptasi.",
    values: [["Alur Kerja Realistis", "Kami tidak memaksakan fitur rumit. Kami dengar proses Anda, lalu kami buatkan alur sistemnya."], ["Laporan Real-Time", "Pantau omset, laba kotor, dan sisa stok dari mana saja tanpa harus ada di lokasi."], ["Training & Pendampingan", "Aplikasi sebagus apapun percuma jika tim tidak bisa pakai. Kami pandu dari awal sampai lancar."]],
    services: [["Aplikasi POS & Kasir", "Untuk toko retail, minimarket, resto, dan apotek yang butuh transaksi cepat.", ["Stok barang", "Laporan shift kasir", "Support barcode"], "Mulai dari setup awal", "Cepat diimplementasi", "Operasional"], ["Software Custom", "Untuk bisnis jasa, manufaktur, atau distributor dengan alur kerja unik.", ["Discovery process", "Modul spesifik", "Hak akses kustom"], "Mulai dari mapping", "Sesuai kerumitan fitur", "Custom"], ["Implementasi & Integrasi", "Bantuan instalasi software, migrasi data lama, dan jaringan lokal toko.", ["Setup database", "Migrasi Excel lama", "Training admin"], "Sesuai kebutuhan", "Bertahap", "Support"]],
    faq: [["Apakah software ini bisa dipakai di banyak cabang?", "Bisa. Kami akan merekomendasikan arsitektur cloud atau server pusat agar data antar cabang tersinkronisasi otomatis."], ["Bagaimana jika karyawan saya gaptek?", "Antarmuka (UI) dirancang agar sesederhana mungkin. Kami juga menyediakan sesi training hingga karyawan terbiasa menginput data dengan benar."], ["Apakah bayarnya langganan bulanan atau beli putus?", "Bergantung pada model sistem yang disepakati (Custom vs SaaS lokal). Skema lisensi, maintenance, dan server akan dijelaskan rinci di awal."], ["Bisa tidak data stok lama di Excel dimasukkan ke sistem baru?", "Sangat bisa. Pada tahap implementasi, kami bantu format ulang data Excel Anda agar bisa di-import langsung ke dalam sistem."]],
  },
};

const ids = (f) => ({ template: `generator-template-sales-${f}`, dataset: `generator-dataset-sales-${f}`, program: `generator-program-sales-${f}` });
const slug = (s) => `${s || ""}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const block = (text, key) => ({ _key: key, _type: "block", style: "normal", markDefs: [], children: [{ _key: `${key}-s`, _type: "span", marks: [], text }] });
const link = (title, href, key) => ({ _key: key, _type: "link", title, href, isExternal: /^https?:\/\//.test(`${href}`), target: false, buttonVariant: "default" });
const icon = (name) => name;
const padding = { _type: "section-padding", top: true, bottom: true };

function family(doc) {
  const lane = doc.template?.lane;
  if (lane === "printing") return "printing";
  if (lane === "website") return "website";
  if (lane === "software") return "software";
  
  const route = `${doc.route || ""}`;
  if (route.startsWith("/jasa-cetak-buku") || route.startsWith("/percetakan")) return "printing";
  if (route.startsWith("/pembuatan-website")) return "website";
  if (route.startsWith("/software") || route.startsWith("/sistem-pos")) return "software";
  return null;
}

function cityFrom(doc) {
  if (doc.location?.title) return doc.location.title;
  const route = `${doc.route || ""}`;
  const parts = route.split("/").filter(Boolean);
  if (route.startsWith("/jasa-cetak-buku-")) {
    const raw = route.replace(/^\/jasa-cetak-buku-/, "");
    return raw.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }
  if (parts.length >= 3 && doc._type === "serviceLocation") return parts.at(-1).split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  if (parts.length <= 2 && !doc.location) return "Indonesia";
  return parts.length > 1 ? parts.at(-1).split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Indonesia";
}

function rowFor(doc, cfg) {
  const city = cityFrom(doc);
  const route = `${doc.route || ""}`;
  const parts = route.split("/").filter(Boolean);
  const isServicePage = parts.length >= 2 && !doc.location;
  const service = doc.serviceType?.title || doc.service?.title || doc.title;
  const pk = doc.structured?.primaryKeyword || doc.meta?.focusKeyword || doc.title;
  const cta = doc.structured?.ctaLabel || cfg.cta;
  const title = doc.title;
  const loc = city === "Indonesia" ? "Indonesia" : city;
  const headlineLocal = loc !== "Indonesia" ? `${cfg.headline.replace(/\?$/, "")} di ${loc}` : cfg.headline;
  const subLocal = loc !== "Indonesia" ? `${cfg.sub} Kami juga melayani pengiriman dan konsultasi untuk wilayah ${loc}.` : cfg.sub;
  const problemLocal = loc !== "Indonesia" ? cfg.problems[0].replace(/\.$/, ` di ${loc}.`) : cfg.problems[0];
  const metaTitle = doc.meta?.title || (loc !== "Indonesia" ? `${service} ${loc} | KOTACOM` : `${pk} | KOTACOM`);
  const metaDesc = doc.meta?.description || doc.structured?.description || (loc !== "Indonesia" ? `${service} untuk ${loc}. ${cfg.sub}` : cfg.sub);
  const localCond = doc.location?.overview || doc.location?.province || (loc !== "Indonesia" ? `kebutuhan pelanggan di ${loc}` : "kebutuhan pelanggan di seluruh Indonesia");
  const industry = cfg.category === "printing" ? "bisnis, sekolah, komunitas, dan instansi" : cfg.category === "website" ? "UMKM, jasa profesional, sekolah, toko online, dan perusahaan lokal" : "owner toko, admin operasional, retail, dan apotek";
  return {
    _key: `row-${slug(doc._id)}`,
    key: doc._id,
    label: title,
    service,
    city: slug(city) || "indonesia",
    primaryKeyword: pk,
    secondaryKeywords: doc.meta?.secondaryKeywords || doc.structured?.secondaryKeywords || [],
    industry,
    offer: cta,
    localCondition: localCond,
    tokens: [
      ["pagePath", route], ["routeBase", cfg.routeBase], ["title", title], ["location", loc], ["ctaLabel", cta], ["ctaHref", "/contact"],
      ["headline", headlineLocal], ["subheadline", subLocal], ["problem", problemLocal], ["solution", cfg.solution],
      ["price", cfg.price], ["timeline", cfg.timeline], ["metaTitle", metaTitle], ["metaDescription", metaDesc],
      ["primaryKeyword", pk], ["service", service]
    ].map(([name, value]) => ({ _key: `tok-${slug(name)}`, name, values: [value] })),
  };
}

function websiteVisualBlocks() {
  return [
    { _type: "split-row", _key: "website-visual-split", padding, colorVariant: "card", noGap: false, splitColumns: [
      { _key: "website-split-content", _type: "split-content", sticky: true, colorVariant: "background", tagLine: "Conversion flow", title: "Dari visitor bingung jadi lead yang siap chat", body: [block("Website promosi harus memandu pengunjung: paham jasa, percaya vendor, lihat paket, lalu klik WhatsApp. Bukan cuma layout cantik yang berhenti di tampilan.", "website-split-body")], link: link("Audit kebutuhan website", "{{ctaHref}}", "website-split-link") },
      { _key: "website-info-list", _type: "split-info-list", list: [
        { _key: "website-info-1", _type: "split-info", title: "1. Message match", body: [block("Headline dan subheadline mengikuti intent: company profile, toko online, sekolah, klinik, ekspedisi, atau kota tertentu.", "website-info-1-body")], tags: ["Intent", "SEO", "Headline"] },
        { _key: "website-info-2", _type: "split-info", title: "2. Trust before price", body: [block("Tampilkan proses, paket, proof, dan FAQ sebelum calon pelanggan merasa biaya website terlalu abu-abu.", "website-info-2-body")], tags: ["Proof", "Paket", "FAQ"] },
        { _key: "website-info-3", _type: "split-info", title: "3. CTA route", body: [block("Setiap section punya jalur ke konsultasi: audit, paket, contoh, atau WhatsApp brief.", "website-info-3-body")], tags: ["CTA", "WhatsApp", "Lead"] },
      ] },
    ] },
    { _type: "grid-row", _key: "website-product-grid", padding, colorVariant: "background", textAlign: "left", cardStyle: "vertical", gridColumns: "grid-cols-3", columns: [
      { _key: "website-product-company", _type: "grid-card", uiIcon: icon("Building2"), title: "Company Profile", excerpt: "Untuk bisnis yang butuh halaman kredibel, layanan jelas, dan CTA WhatsApp yang tidak tersembunyi.", link: link("Tanya company profile", "{{ctaHref}}", "website-company-link") },
      { _key: "website-product-store", _type: "grid-card", uiIcon: icon("ShoppingCart"), title: "Toko Online", excerpt: "Untuk katalog produk, landing promosi, dan jalur inquiry/order yang lebih rapi.", link: link("Diskusi toko online", "{{ctaHref}}", "website-store-link") },
      { _key: "website-product-local", _type: "grid-card", uiIcon: icon("MapPin"), title: "Local SEO Page", excerpt: "Untuk halaman kota atau area layanan yang tidak cuma ganti lokasi, tapi punya intent dan CTA jelas.", link: link("Bahas SEO lokal", "{{ctaHref}}", "website-local-link") },
      { _key: "website-product-clinic", _type: "grid-card", uiIcon: icon("Stethoscope"), title: "Klinik & Dokter", excerpt: "Untuk layanan kesehatan yang butuh trust, jadwal, lokasi, dan ajakan konsultasi yang tenang.", link: link("Tanya website klinik", "{{ctaHref}}", "website-clinic-link") },
      { _key: "website-product-school", _type: "grid-card", uiIcon: icon("GraduationCap"), title: "Sekolah & NGO", excerpt: "Untuk profil lembaga, program, pendaftaran, publikasi, dan informasi yang mudah diperbarui.", link: link("Tanya website sekolah", "{{ctaHref}}", "website-school-link") },
      { _key: "website-product-migrate", _type: "grid-card", uiIcon: icon("RefreshCcw"), title: "Migrasi WordPress", excerpt: "Untuk website lama yang perlu dipindah, dirapikan, dipercepat, atau disiapkan ulang strukturnya.", link: link("Cek migrasi", "{{ctaHref}}", "website-migrate-link") },
    ] },
    { _type: "highlights-block", _key: "website-visual-highlights", padding, colorVariant: "muted", eyebrow: "Visual conversion checklist", title: "Yang harus terlihat di landing page website", description: "Visitor perlu cepat melihat alasan untuk percaya dan langkah untuk mulai.", items: ["Hero dengan benefit jelas", "Paket dan scope yang tidak abu-abu", "Proof dan proses sebelum harga", "FAQ untuk biaya, timeline, revisi, maintenance", "CTA WhatsApp yang muncul di momen tepat"] },
    { _type: "quote-spotlight-block", _key: "website-quote", padding, colorVariant: "card", eyebrow: "Marketing note", quote: "Website yang bagus bukan yang paling ramai animasi. Website yang bagus membuat orang yang tepat paham, percaya, lalu menghubungi Anda.", author: "KOTACOM Digital Team", role: "Landing Page & SEO Workflow", highlights: ["Clear offer", "Trust", "Lead"] },
  ];
}

function softwareVisualBlocks() {
  return [
    { _type: "split-row", _key: "software-visual-split", padding, colorVariant: "card", noGap: false, splitColumns: [
      { _key: "software-split-content", _type: "split-content", sticky: true, colorVariant: "background", tagLine: "Workflow map", title: "Sebelum bicara fitur, petakan dulu alur kerja", body: [block("Software custom gagal saat fitur dibuat dari asumsi. Landing page harus menjelaskan problem operasional, hasil bisnis, tahap discovery, dan risiko yang dikurangi.", "software-split-body")], link: link("Diskusi workflow", "{{ctaHref}}", "software-split-link") },
      { _key: "software-info-list", _type: "split-info-list", list: [
        { _key: "software-info-1", _type: "split-info", title: "1. Masalah proses", body: [block("Data tersebar, laporan lambat, approval manual, stok tidak sinkron, atau tim bergantung pada Excel.", "software-info-1-body")], tags: ["Excel", "Data", "Approval"] },
        { _key: "software-info-2", _type: "split-info", title: "2. Modul prioritas", body: [block("Mulai dari modul yang paling berdampak: POS, stok, laporan, dashboard, user role, atau integrasi.", "software-info-2-body")], tags: ["POS", "Stok", "Laporan"] },
        { _key: "software-info-3", _type: "split-info", title: "3. Implementasi bertahap", body: [block("Scope dipecah supaya biaya, timeline, migrasi data, dan training lebih mudah dikontrol.", "software-info-3-body")], tags: ["MVP", "Training", "Support"] },
      ] },
    ] },
    { _type: "grid-row", _key: "software-product-grid", padding, colorVariant: "background", textAlign: "left", cardStyle: "vertical", gridColumns: "grid-cols-3", columns: [
      { _key: "software-product-pos", _type: "grid-card", uiIcon: icon("MonitorSmartphone"), title: "Sistem POS", excerpt: "Untuk transaksi, stok, laporan, kasir, dan kebutuhan operasional toko yang ingin lebih rapi.", link: link("Tanya POS", "{{ctaHref}}", "software-pos-link") },
      { _key: "software-product-custom", _type: "grid-card", uiIcon: icon("Workflow"), title: "Software Custom", excerpt: "Untuk proses bisnis yang tidak cocok dengan aplikasi generik dan butuh alur khusus.", link: link("Bahas custom", "{{ctaHref}}", "software-custom-link") },
      { _key: "software-product-dashboard", _type: "grid-card", uiIcon: icon("LayoutDashboard"), title: "Dashboard & Laporan", excerpt: "Untuk owner yang butuh visibility lebih cepat terhadap penjualan, stok, operasional, atau performa tim.", link: link("Tanya dashboard", "{{ctaHref}}", "software-dashboard-link") },
      { _key: "software-product-apotek", _type: "grid-card", uiIcon: icon("Pill"), title: "Software Apotek", excerpt: "Untuk kebutuhan stok obat, transaksi, laporan, dan alur kerja apotek yang lebih terkontrol.", link: link("Diskusi apotek", "{{ctaHref}}", "software-apotek-link") },
      { _key: "software-product-implementation", _type: "grid-card", uiIcon: icon("Rocket"), title: "Implementasi Software", excerpt: "Untuk setup, migrasi data, training tim, dan pendampingan agar sistem benar-benar dipakai.", link: link("Tanya implementasi", "{{ctaHref}}", "software-implementation-link") },
      { _key: "software-product-integration", _type: "grid-card", uiIcon: icon("Cable"), title: "Integrasi & Automasi", excerpt: "Untuk mengurangi kerja manual antar sistem, spreadsheet, form, dan laporan.", link: link("Bahas integrasi", "{{ctaHref}}", "software-integration-link") },
    ] },
    { _type: "highlights-block", _key: "software-visual-highlights", padding, colorVariant: "muted", eyebrow: "Implementation checklist", title: "Yang harus jelas sebelum software dibangun", description: "Calon klien butuh rasa aman bahwa sistem tidak akan jadi proyek mahal yang tidak dipakai.", items: ["Problem operasional yang spesifik", "Modul prioritas dan MVP", "Estimasi timeline bertahap", "Migrasi data dan training", "Support setelah go-live"] },
    { _type: "quote-spotlight-block", _key: "software-quote", padding, colorVariant: "card", eyebrow: "Product note", quote: "Software custom yang baik bukan daftar fitur panjang. Ia harus mengurangi kerja manual, mempercepat keputusan, dan bisa dipakai tim setiap hari.", author: "KOTACOM Software Team", role: "Discovery & Implementation Workflow", highlights: ["Workflow", "MVP", "Adoption"] },
  ];
}

function printingVisualBlocks() {
  return [
    { _type: "split-row", _key: "printing-visual-split", padding, colorVariant: "card", noGap: false, splitColumns: [
      { _key: "printing-split-content", _type: "split-content", sticky: true, colorVariant: "background", tagLine: "Visual order flow", title: "Dari file PDF sampai buku siap kirim", body: [block("Tunjukkan alur produksi seperti sales deck visual: file dicek, spesifikasi dikunci, quote dikirim, produksi berjalan, lalu hasil dikirim. Calon pelanggan tidak perlu menebak proses.", "printing-split-body")], link: link("Kirim file untuk dicek", "{{ctaHref}}", "printing-split-link") },
      { _key: "printing-info-list", _type: "split-info-list", list: [
        { _key: "printing-info-1", _type: "split-info", title: "1. File check", body: [block("Cek PDF, ukuran, margin, resolusi, jumlah halaman, dan kesiapan cover sebelum masuk quote.", "printing-info-1-body")], tags: ["PDF", "Margin", "Cover"] },
        { _key: "printing-info-2", _type: "split-info", title: "2. Kunci spesifikasi", body: [block("Pilih kertas, warna, jilid, laminasi, quantity, dan deadline agar harga tidak berubah-ubah.", "printing-info-2-body")], tags: ["Kertas", "Jilid", "Deadline"] },
        { _key: "printing-info-3", _type: "split-info", title: "3. Produksi & kirim", body: [block("Setelah spesifikasi aman, produksi berjalan sesuai prioritas dan hasil bisa dibahas untuk pengiriman.", "printing-info-3-body")], tags: ["Produksi", "QC", "Kirim"] },
      ] },
    ] },
    { _type: "grid-row", _key: "printing-product-grid", padding, colorVariant: "background", textAlign: "left", cardStyle: "vertical", gridColumns: "grid-cols-3", columns: [
      { _key: "printing-product-book", _type: "grid-card", uiIcon: icon("BookOpen"), title: "Buku, Modul, Novel", excerpt: "Untuk penulis, sekolah, komunitas, dan bisnis. Cocok untuk PDF siap cetak maupun file yang masih perlu dicek teknis.", link: link("Tanya cetak buku", "{{ctaHref}}", "printing-book-link") },
      { _key: "printing-product-yasin", _type: "grid-card", uiIcon: icon("BookHeart"), title: "Yasin & Buku Kenangan", excerpt: "Untuk acara keluarga, sekolah, pesantren, komunitas, dan kebutuhan dokumentasi yang harus rapi serta mudah dibaca.", link: link("Cek opsi yasin", "{{ctaHref}}", "printing-yasin-link") },
      { _key: "printing-product-promo", _type: "grid-card", uiIcon: icon("Megaphone"), title: "Kalender, Brosur, Banner", excerpt: "Untuk campaign promosi, event, toko, dan brand lokal yang butuh materi visual cepat dengan spesifikasi jelas.", link: link("Tanya materi promosi", "{{ctaHref}}", "printing-promo-link") },
      { _key: "printing-product-packaging", _type: "grid-card", uiIcon: icon("PackageCheck"), title: "Kemasan & Stiker", excerpt: "Untuk produk yang butuh label, stiker, atau packaging sederhana agar tampil lebih siap jual.", link: link("Diskusi packaging", "{{ctaHref}}", "printing-packaging-link") },
      { _key: "printing-product-card", _type: "grid-card", uiIcon: icon("BadgeCheck"), title: "Kartu Nama & Company Profile", excerpt: "Untuk sales kit, meeting, proposal, dan kebutuhan corporate identity yang harus terlihat profesional.", link: link("Cek sales kit", "{{ctaHref}}", "printing-card-link") },
      { _key: "printing-product-custom", _type: "grid-card", uiIcon: icon("Sparkles"), title: "Request Custom", excerpt: "Punya kebutuhan cetak berbeda? Kirim contoh, ukuran, jumlah, dan deadline. Tim bantu pecah spesifikasinya.", link: link("Kirim request custom", "{{ctaHref}}", "printing-custom-link") },
    ] },
    { _type: "highlights-block", _key: "printing-visual-highlights", padding, colorVariant: "muted", eyebrow: "Visual proof points", title: "Bukan cuma kata 'murah'. Tampilkan alasan orang percaya.", description: "Halaman printing butuh bukti visual dan indikator praktis agar visitor yakin sebelum chat.", items: ["Checklist file sebelum cetak", "Pilihan bahan dan finishing", "Estimasi timeline sesuai deadline", "Contoh use case: buku ajar, yasin, company profile, promosi", "CTA WhatsApp di setiap titik keputusan"] },
    { _type: "quote-spotlight-block", _key: "printing-quote", padding, colorVariant: "card", eyebrow: "Sales note", quote: "Halaman cetak yang bagus tidak memaksa orang langsung beli. Ia membuat calon pelanggan tahu apa yang harus dikirim agar quote bisa cepat dan jelas.", author: "KOTACOM Printing Team", role: "Sales & Production Workflow", highlights: ["File check", "Quote jelas", "Produksi aman"] },
  ];
}

function template(cfg) {
  const id = cfg.id;
  const visualBlocks = id === "printing" ? printingVisualBlocks() : id === "website" ? websiteVisualBlocks() : id === "software" ? softwareVisualBlocks() : [];
  return {
    _id: ids(id).template, _type: "generatorTemplate", title: `Sales Landing Page - ${cfg.title}`, slug: { _type: "slug", current: `sales-${id}` },
    description: `Promotional landing page sales-first untuk ${cfg.title}. Dibuat berdasarkan audit kompetitor: hero jelas, harga/scope, proof, FAQ objection, WhatsApp CTA.`,
    outputType: "page", routeBase: cfg.routeBase, slugPattern: "{{pagePath}}", programType: "location-pages", designFamily: id, status: "ready", devOnly: false,
    blockTokenReference: "{{headline}}\n{{subheadline}}\n{{primaryKeyword}}\n{{service}}\n{{location}}\n{{ctaLabel}}\n{{ctaHref}}\n{{price}}\n{{timeline}}\n{{problem}}\n{{solution}}",
    seoMeta: { titlePattern: "{{metaTitle}}", descriptionPattern: "{{metaDescription}}", focusKeywordToken: "{{primaryKeyword}}", secondaryKeywordsSource: "secondaryKeywords" },
    aggregateRatingDefaults: { ratingValue: 4.9, reviewCount: id === "printing" ? 127 : id === "website" ? 84 : 42, bestRating: 5, ratingSource: "internal" },
    tokenDefinitions: ["headline","subheadline","primaryKeyword","service","location","ctaLabel","ctaHref","price","timeline","problem","solution","metaTitle","metaDescription","pagePath","routeBase"].map((name) => ({ _key: `def-${name}`, name, label: name, sourceField: name, required: true })),
    blocks: [
      { _type: "hero-1", _key: `${id}-hero`, tagLine: "{{primaryKeyword}}", title: "{{headline}}", body: [block("{{subheadline}}", `${id}-hero-body`)], links: [link("{{ctaLabel}}", "{{ctaHref}}", `${id}-hero-cta`), link("Lihat Paket & Proses", "#paket", `${id}-hero-secondary`)] },
      { _type: "micro-badges-block", _key: `${id}-badges`, padding, colorVariant: "background", badges: [{ _key: `${id}-b1`, label: "Fast response", description: "Langsung arahkan inquiry ke WhatsApp" }, { _key: `${id}-b2`, label: "Scope jelas", description: "Harga dan timeline dibahas dari brief" }, { _key: `${id}-b3`, label: "Sales-ready", description: "Halaman dibuat untuk lead, bukan pajangan" }] },
      { _type: "problem-solution-block", _key: `${id}-problem`, padding, colorVariant: "muted", title: "Sebelum beli, calon pelanggan biasanya ragu di sini", problems: cfg.problems, solutionTitle: "Solusi KOTACOM", solution: cfg.solution },
      { _type: "value-props-block", _key: `${id}-value`, padding, colorVariant: "background", title: "Mengapa Bisnis Memilih KOTACOM?", description: "Fokus pada pertumbuhan bisnis Anda. Urusan teknis, dari desain hingga produksi, biar kami yang selesaikan.", valueProps: cfg.values.map((v, i) => ({ _key: `${id}-vp-${i}`, icon: `0${i + 1}`, title: v[0], description: v[1] })) },
      ...visualBlocks,
      { _type: "features-package-block", _key: `${id}-features`, padding, colorVariant: "card", cardStyle: "grid", title: "Keuntungan Bekerja Bersama KOTACOM", subtitle: "Layanan All-in-One Tanpa Repot", description: "Mulai dari perencanaan hingga hasil akhir, kami pastikan setiap langkah transparan dan sesuai target Anda.", features: [{ _key: `${id}-f1`, icon: "01", title: "Konsultasi Kebutuhan", description: "Bahas target dan masalah bisnis Anda secara langsung bersama tim.", badge: "Gratis" }, { _key: `${id}-f2`, icon: "02", title: "Harga Transparan", description: "Estimasi harga detail tanpa biaya tersembunyi di akhir proyek.", badge: "Aman" }, { _key: `${id}-f3`, icon: "03", title: "Eksekusi Tepat Waktu", description: "Tim bekerja dengan timeline pasti agar operasional Anda tidak terhambat.", badge: "Cepat" }], cta: link("Klaim Konsultasi Gratis Sekarang", "/contact", `${id}-features-cta`) },
      { _type: "service-types-block", _key: `${id}-services`, padding, colorVariant: "background", title: `Paket & Layanan ${cfg.title} Kami`, description: "Pilih layanan yang paling sesuai dengan kondisi bisnis Anda saat ini.", services: cfg.services.map((s, i) => ({ _key: `${id}-svc-${i}`, title: s[0], description: s[1], features: s[2], price: s[3], timeline: s[4], badge: s[5], link: link("Ambil Penawaran Ini", "/contact", `${id}-svc-link-${i}`) })) },
      { _type: "metrics-rail-block", _key: `${id}-metrics`, padding, colorVariant: "primary", items: [{ _key: `${id}-m1`, value: cfg.metric, label: cfg.metricLabel, brand: "Pengalaman" }, { _key: `${id}-m2`, value: "4.9/5", label: "Rating rata-rata dari klien", brand: "Kepercayaan" }, { _key: `${id}-m3`, value: "100%", label: "Komitmen hasil terbaik", brand: "Garansi" }] },
      { _type: "process-faq-block", _key: `${id}-faq`, padding, colorVariant: "background", processTitle: "Cara Mudah Memulai Kolaborasi", processSteps: ["Hubungi via WhatsApp & ceritakan kebutuhan.", "Dapatkan estimasi biaya dan timeline jelas.", "Proyek dikerjakan dan di-update berkala hingga selesai."], faqTitle: "Pertanyaan yang Sering Diajukan", faqs: cfg.faq.map((x, i) => ({ _key: `${id}-faq-${i}`, question: x[0], answer: [block(x[1], `${id}-faq-${i}-ans`)] })) },
      { _type: "eeat-block", _key: `${id}-eeat`, padding, colorVariant: "muted", eyebrow: "Kredibilitas", title: "Dikerjakan oleh Tim Berpengalaman", description: "Kami bukan perantara. Seluruh proses teknis dan produksi dikelola oleh in-house team KOTACOM.", points: [{ _key: `${id}-e1`, title: "Workshop & Kantor Jelas", description: "Alamat fisik kami terbuka untuk dikunjungi kapan saja." }, { _key: `${id}-e2`, title: "Legalitas Resmi", description: "Berbadan hukum resmi untuk keamanan transaksi B2B." }, { _key: `${id}-e3`, title: "Support After-Sales", description: "Tanggung jawab kami tidak berhenti setelah barang / project diserahkan." }] },
      { _type: "whatsapp-cta", _key: `${id}-wa`, padding, colorVariant: "primary", sectionWidth: "default", stackAlign: "left", tagLine: "Jangan Tunda Lagi", title: "Amankan Antrean Project Anda Hari Ini", body: [block("Hubungi kami via WhatsApp sekarang. Ceritakan kebutuhan Anda, dan tim kami akan segera merespon dengan solusi terbaik.", `${id}-wa-body`)], secondaryLink: link("Lihat Layanan Lainnya", "/layanan", `${id}-wa-secondary`) },
    ],
  };
}

async function main() {
  const env = await loadSanityEnv();
  const { token, source: tokenSource } = resolveSanityTokenSource(env);
  const sourceDataset = getCliOption(process.argv.slice(2), "--source-dataset") || env.SANITY_SOURCE_DATASET || "legacy-backup";

  if (!token) {
    throw new Error("Missing Sanity read token. Expected SANITY_DEV or SANITY_AUTH_TOKEN.");
  }

  const { createClient } = await import("next-sanity");
  const client = createClient({
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || "rtpa6pgc",
    dataset: sourceDataset,
    apiVersion: "2024-03-23",
    useCdn: false,
    token,
  });
  const docs = await client.fetch(QUERY);
  const grouped = { printing: [], website: [], software: [] };
  for (const doc of docs) {
    const f = family(doc);
    if (f) grouped[f].push(rowFor(doc, F[f]));
  }
  const out = [];
  for (const key of Object.keys(grouped)) {
    const cfg = F[key];
    out.push(template(cfg));
    out.push({ _id: ids(key).dataset, _type: "generatorDataset", title: `Sales Dataset - ${cfg.title}`, slug: { _type: "slug", current: `sales-${key}` }, rows: grouped[key], importMode: "manual", dedupePolicy: "skip-existing-slug", status: "ready" });
    out.push({ _id: ids(key).program, _type: "generatorProgram", title: `Sales Program - ${cfg.title}`, slug: { _type: "slug", current: `sales-${key}` }, template: { _type: "reference", _ref: ids(key).template }, dataset: { _type: "reference", _ref: ids(key).dataset }, generationMode: grouped[key].length > 20 ? "batch" : "preview", status: "ready", aiMode: "prepared" });
  }
  await fs.writeFile(OUT, out.map(JSON.stringify).join("\n") + "\n");
  await fs.writeFile(SUMMARY, JSON.stringify({ projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: env.NEXT_PUBLIC_SANITY_DATASET, sourceDataset, tokenSource, counts: Object.fromEntries(Object.entries(grouped).map(([k, v]) => [k, v.length])), docs: out.length }, null, 2));
  console.log(JSON.stringify({ ok: true, out: OUT, summary: SUMMARY, counts: Object.fromEntries(Object.entries(grouped).map(([k, v]) => [k, v.length])), docs: out.length }, null, 2));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
