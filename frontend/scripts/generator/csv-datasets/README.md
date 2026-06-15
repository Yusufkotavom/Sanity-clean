# Generator CSV Datasets

Folder ini berisi file-file CSV (Comma Separated Values) yang digunakan sebagai dataset ringan untuk menginjeksi (import) data secara massal ke dalam Sanity CMS Generator Kotacom.

Menggunakan file CSV sangat dianjurkan untuk dataset dengan jumlah besar (seperti >500 lokasi), karena jauh lebih ringan dan mencegah masalah performa atau memori *(crash)* di dashboard Sanity Studio yang sering terjadi saat merender ratusan baris data di dalam *Array field*.

## Daftar Dataset

- `sales-dataset-printing.csv` (Dataset Percetakan, ~446 lokasi)
- `sales-dataset-website.csv` (Dataset Pembuatan Website, ~45 lokasi)
- `sales-dataset-software.csv` (Dataset Software/Sistem POS, ~5 lokasi)

## Format dan Struktur Kolom

Dataset di dalam folder ini mencakup seluruh kombinasi *Payload Dasar* dan *Template Tokens* yang dibutuhkan oleh *engine* landing page. Kolom dibagi menjadi dua bagian:

1. **Kolom Dasar (Data Indentifikasi & SEO):**
   - `label`, `service`, `city`, `primaryKeyword`, `secondaryKeywords`, `industry`, `offer`, `localCondition`.
2. **Kolom Tokens (Teks yang Diinjeksi ke UI):**
   - Diawali dengan awalan `token_`. Contohnya: `token_pagePath`, `token_headline`, `token_problem`, `token_metaTitle`, dll.

## Skrip Regenerasi

Jika terjadi perubahan master data, penyesuaian strategi *copywriting*, atau penambahan daerah operasional di CMS yang lama, file CSV ini bisa diregenerasi ulang (ditimpa secara otomatis) menggunakan skrip berikut:

\`\`\`bash
cd frontend
node scripts/generator/export-sales-to-csv.mjs
\`\`\`

*(Pastikan Anda berada di direktori `Sanity-clean` atau di `Sanity-clean/frontend` lalu sesuaikan path skripnya saat menjalankan perintah di atas)*.
