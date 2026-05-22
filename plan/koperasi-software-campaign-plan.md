# Plan — Koperasi Software Campaign

## Tujuan
Membuat paket campaign konten untuk layanan `jasa pembuatan software koperasi` yang terdiri dari:
1. 1 landing page utama
2. 10 promotion post
3. siap direview di live preview

## Opsi Eksekusi
### Opsi A — Di repo ini (`/home/ubuntu/sanity-nextjs-kotacom`)
- Keunggulan:
  - Sudah ada blok Sanity + renderer lengkap
  - Alur MCP + script seeding sudah berjalan
  - Cepat untuk publish konten marketing
- Konsekuensi:
  - Konten koperasi bercampur dengan tema Kotacom umum

### Opsi B — Di `/home/ubuntu/koperasi-pinjam`
- Keunggulan:
  - Domain konteks koperasi lebih tepat
  - Branding dan CTA bisa lebih spesifik produk koperasi
- Konsekuensi:
  - Perlu cek readiness schema/route/renderer konten marketing
  - Bisa butuh adaptasi komponen dulu

## Scope Deliverable Konten
### 1) Landing page (1 halaman)
- Slug target: `jasa-pembuatan-software-koperasi`
- Struktur minimum:
  - Hero (value proposition + 2 CTA)
  - Problem-solution block (pain point koperasi)
  - Benefits/value props
  - Feature/package highlights
  - Testimonial/proof section
  - FAQ
  - Final CTA / WhatsApp CTA
- SEO meta:
  - title, description, focus keyword, secondary keywords, OG image

### 2) Promotion posts (10 artikel)
- Format: `post`
- Masing-masing berisi:
  - title, slug, excerpt, body markdown/portable text
  - meta (title, description, focus/secondary keywords, image)
- Topik rencana:
  1. Kenapa Koperasi Butuh Software Terintegrasi
  2. Checklist Digitalisasi Operasional Koperasi
  3. Cara Memilih Vendor Software Koperasi
  4. Modul Wajib Aplikasi Simpan Pinjam
  5. Strategi Migrasi Data Koperasi ke Sistem Baru
  6. Contoh Workflow Persetujuan Pinjaman Digital
  7. Pengurangan Risiko Human Error dengan Otomasi
  8. Dashboard KPI Pengurus Koperasi
  9. Keamanan Data Anggota dan Audit Trail
  10. Estimasi Biaya Implementasi Software Koperasi

## Tahapan Implementasi
1. Finalisasi lokasi eksekusi (Opsi A atau B)
2. Validasi schema + route rendering + query contract
3. Buat/seed landing page draft
4. Buat 10 post draft
5. Generate/assign image + OG image
6. QA di live preview
7. Revisi copy dan visual
8. Publish bertahap

## Verifikasi
- Konten tampil di route target tanpa error
- Metadata terbaca (title/description/OG)
- Block renderer sesuai theme
- Internal link CTA valid

## Catatan Operasional
- Prioritaskan pembuatan sebagai draft dulu
- Publish setelah approval copy/visual
- Gunakan satu style komponen yang konsisten antar landing page dan post
