import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getCliOption,
  loadSanityEnv,
  resolveSanityTokenSource,
} from "../lib/sanity-page-guards.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url));

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

const slug = (s) => `${s || ""}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

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
    label: title,
    service: service,
    city: slug(city) || "indonesia",
    primaryKeyword: pk,
    secondaryKeywords: (doc.meta?.secondaryKeywords || doc.structured?.secondaryKeywords || []).join(", "),
    industry,
    offer: cta,
    localCondition: localCond,
    token_pagePath: route,
    token_routeBase: cfg.routeBase,
    token_title: title,
    token_location: loc,
    token_ctaLabel: cta,
    token_ctaHref: "/contact",
    token_headline: headlineLocal,
    token_subheadline: subLocal,
    token_problem: problemLocal,
    token_solution: cfg.solution,
    token_price: cfg.price,
    token_timeline: cfg.timeline,
    token_metaTitle: metaTitle,
    token_metaDescription: metaDesc
  };
}

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
    if (f) {
        const row = rowFor(doc, F[f]);
        grouped[f].push(row);
    }
  }

  // Ensure tmp directory exists
  const outDir = path.resolve(DIR, "../../tmp");
  await fs.mkdir(outDir, { recursive: true });

  for (const key of Object.keys(grouped)) {
    const rows = grouped[key];
    if (rows.length === 0) continue;
    
    let csvContent = HEADERS.join(",") + "\\n";
    for (const row of rows) {
        const csvRow = HEADERS.map(h => escapeCSV(row[h])).join(",");
        csvContent += csvRow + "\\n";
    }
    
    const outPath = path.join(outDir, `sales-dataset-${key}.csv`);
    await fs.writeFile(outPath, csvContent);
    console.log(`Generated ${outPath} with ${rows.length} rows`);
  }

  console.log(`Exported sales CSVs from dataset=${sourceDataset} tokenSource=${tokenSource}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
