# Sanity Post-Like Types Map & Automation Contract

Dokumen ini memetakan semua content type "post-like" di repo ini dan kontrak otomasi write agar seluruh field schema bisa diakomodasi.

## 1. Semua Document Type di Studio

Sumber: `studio/schema-types.ts` + `studio/schemas/documents/*`

- `page`
- `post`
- `product`
- `service`
- `serviceType`
- `project`
- `author`
- `category`
- `faq`
- `testimonial`
- `navigation`
- `settings`
- `themeSettings`
- `seoSettings`
- `pageTemplate`
- `pageLocation`
- `serviceLocation`
- `location`
- `seoOpsSettings`
- `redirect`
- `reusableSection`
- `legacyPage`

## 2. Types yang Disupport Script Otomasi

- `post` -> route `'/blog/[slug]'`
- `service` -> route `'/services/[slug]'`
- `product` -> route `'/products/[slug]'`
- `project` -> route `'/projects/[slug]'`
- `page` -> route dinamis/catch-all sesuai slug/segments
- `category`
- `pageTemplate`
- `redirect`

Tidak disupport saat ini:

- `tag` (schema `tag` tidak ada di Studio saat ini)

### Routing Intent -> Type (Wajib)

- Blog/article/tutorial -> `post`
- Service/layanan jual -> `service`
- Portfolio/case study -> `project`
- Product/paket produk -> `product`
- Static company page (home/about/contact/privacy/terms) -> `page`
- Category taxonomy -> `category`
- Template generator -> `pageTemplate`
- Redirect mapping -> `redirect`

Rule penting:

- `service` dan `project` tidak boleh diturunkan menjadi `page` hanya karena butuh landing slug.
- Jika butuh halaman shell statis, tetap simpan entity inti di type domain-nya (`service`/`project`) agar query listing/detail tetap konsisten.

## 3. Field Map Lengkap per Type

### 3.1 `post` (`studio/schemas/documents/post.ts`)

- Wajib: `title`, `slug`
- Field:
  - `excerpt`
  - `author`
  - `image`
  - `categories[]`
  - `body`
  - `blocks`
  - `affiliateItems[]`
  - `overallRating`
  - `verdict`
  - `aggregateRating`
  - `meta`

### 3.2 `service` (`studio/schemas/documents/service.ts`)

- Wajib: `title`, `slug`
- Field:
  - `excerpt`
  - `body`
  - `blocks`
  - `image`
  - `deliverables[]`
  - `duration`
  - `startingPrice`
  - `currency`
  - `featured`
  - `categories[]`
  - `cta`
  - `reviews[]`
  - `aggregateRating`
  - `meta`

### 3.3 `product` (`studio/schemas/documents/product.ts`)

- Wajib: `title`, `slug`
- Field:
  - `excerpt`
  - `body`
  - `blocks`
  - `image`
  - `gallery[]`
  - `price`
  - `currency`
  - `availability`
  - `featured`
  - `categories[]`
  - `cta`
  - `reviews[]`
  - `aggregateRating`
  - `meta`

### 3.4 `project` (`studio/schemas/documents/project.ts`)

- Wajib: `title`, `slug`
- Field:
  - `excerpt`
  - `body`
  - `blocks`
  - `image`
  - `clientName`
  - `industry`
  - `completionYear`
  - `projectType`
  - `repositoryUrl`
  - `previewUrl`
  - `projectUrl`
  - `featured`
  - `categories[]`
  - `cta`
  - `meta`

### 3.5 `page` (`studio/schemas/documents/page.ts`)

- Wajib: `slug`
- Field:
  - `title`
  - `thumbnail`
  - `blocks`
  - `topBlockCount`
  - `aggregateRating`
  - `meta`
  - `orderRank`

### 3.6 `category` (`studio/schemas/documents/category.ts`)

- Wajib: `title`, `slug`
- Field:
  - `description`
  - `meta`
  - `orderRank`

### 3.7 `pageTemplate` (`studio/schemas/documents/page-template.ts`)

- Wajib: `title`, `slug`
- Field penting:
  - `variant`
  - `lane`
  - `trustMode`
  - `sourcePolicy`
  - `isHybrid`
  - `shellId`
  - `topBlockCountDefault`
  - `heroEyebrow`
  - `heroImage`
  - `structured`
  - `blocks`
  - `metaDefaults`
  - `orderRank`

### 3.8 `redirect` (`studio/schemas/documents/redirect.ts`)

- Wajib: `source`, `destination`
- Field:
  - `permanent`
  - `isEnabled`

## 4. Frontend Contract yang Mengonsumsi `post`

- Query utama: `frontend/sanity/queries/post.ts`
- Fetch helper: `frontend/sanity/lib/fetch.ts`
- Blog detail: `frontend/app/(main)/blog/[slug]/page.tsx`
- Blog listing: `frontend/app/(main)/blog/page.tsx`
- Blog category: `frontend/app/(main)/blog/category/[slug]/page.tsx`

Catatan integrasi:

- `post.meta` dipakai untuk metadata lewat `generatePageMetadata`.
- `affiliateItems`, `overallRating`, `aggregateRating`, `verdict` dipakai di halaman detail + JSON-LD.

## 5. Tooling Otomasi yang Dipakai

### Skill operasional repo

- `skills/sanity-studio-post-ops/SKILL.md`

### Script CLI

- Single source of truth (multi-type):
  - `frontend/scripts/create-content-from-json.mjs`
  - Command:
    - `pnpm --filter frontend run sanity:content:create -- --type=post --input=./payload.json`
    - `pnpm --filter frontend run sanity:content:create -- --type=service --input=./payload.json`
    - `pnpm --filter frontend run sanity:content:create -- --type=product --input=./payload.json`
    - `pnpm --filter frontend run sanity:content:create -- --type=project --input=./payload.json`
    - `pnpm --filter frontend run sanity:content:create -- --type=page --input=./payload.json`
    - `pnpm --filter frontend run sanity:content:create -- --type=category --input=./payload.json`
    - `pnpm --filter frontend run sanity:content:create -- --type=pageTemplate --input=./payload.json`
    - `pnpm --filter frontend run sanity:content:create -- --type=redirect --input=./payload.json`

### Struktur Final (Yang Dipakai Aktif)

```text
skills/sanity-studio-post-ops/
  SKILL.md
  references/
    post-payload.example.json
    service-payload.example.json
    product-payload.example.json
    project-payload.example.json
    page-payload.example.json

frontend/scripts/
  create-content-from-json.mjs   <- canonical write path
  convert-page-to-post.mjs       <- workflow konversi khusus page -> post
```

## 6. Jaminan Akomodasi Semua Field

Untuk script multi-type (`create-content-from-json.mjs`):

- Payload object dipass-through apa adanya ke document final.
- Script hanya meng-override field sistem berikut:
  - `_id`
  - `_type`
  - `slug.current`
- Selain itu, seluruh top-level dan nested field payload tetap ikut ditulis.
- Normalisasi safety otomatis:
  - menambah `_key` pada item array object yang belum punya key
  - normalisasi object `_type: "link"` agar `isExternal` konsisten
  - validasi `_id` publik tidak boleh mengandung `.`

## 7. Mode Eksekusi

- Dry run default (tanpa `--write`)
- Write nyata: `--write`
- Create mode: `--mode=create` (fail jika slug sudah ada)
- Upsert mode: `--mode=upsert`
- Draft write: `--draft`
- Read single check: `--read --slug=...` / `--read --source=...` / `--read --doc-id=...`
- Read listing: `--read --list --limit=... --offset=... --order=...`

## 8. Referensi Payload per Type

- `skills/sanity-studio-post-ops/references/post-payload.example.json`
- `skills/sanity-studio-post-ops/references/service-payload.example.json`
- `skills/sanity-studio-post-ops/references/product-payload.example.json`
- `skills/sanity-studio-post-ops/references/project-payload.example.json`
- `skills/sanity-studio-post-ops/references/page-payload.example.json`
- `skills/sanity-studio-post-ops/references/category-payload.example.json`
- `skills/sanity-studio-post-ops/references/page-template-payload.example.json`
- `skills/sanity-studio-post-ops/references/redirect-payload.example.json`

## 9. Rekomendasi Integrasi Eksternal

- Simpan payload JSON per dokumen di sistem eksternal.
- Jalankan command `sanity:content:create` dari worker/scheduler.
- Gunakan `--mode=upsert` untuk sinkronisasi berkala.
- Gunakan `--draft` untuk approval manual sebelum publish.

## 10. Verifikasi Nyata (Menggunakan Env Lokal)

Verifikasi dijalankan dengan env aktif di workspace ini pada tanggal `2026-04-27`:

1. Dry-run untuk semua type:
   - `post`, `service`, `product`, `project`, `page`, `category`, `pageTemplate`, `redirect`
2. Write draft untuk semua type:
   - `drafts.qa-post-automation`
   - `drafts.qa-service-automation`
   - `drafts.qa-product-automation`
   - `drafts.qa-project-automation`
   - `drafts.qa-page-automation`
   - `drafts.qa-category-automation`
   - `drafts.qa-pageTemplate-automation`
   - `drafts.qa-redirect-automation`
3. Audit hasil write memakai query `perspective: "raw"` dan pembandingan key payload vs key dokumen.
4. Hasil audit:
   - semua draft ditemukan
   - `missingFromDoc` kosong pada semua type
   - artinya key payload pada contoh per-type seluruhnya masuk ke dokumen.

## 11. Read/Listing Command (Untuk Konfirmasi)

- Read by slug:
  - `pnpm --filter frontend run sanity:content:create -- --type=post --read --slug=<slug> --perspective=raw`
- Read by source (redirect):
  - `pnpm --filter frontend run sanity:content:create -- --type=redirect --read --source=/path --perspective=raw`
- Read by doc id:
  - `pnpm --filter frontend run sanity:content:create -- --type=page --read --doc-id=<id> --perspective=raw`
- Listing:
  - `pnpm --filter frontend run sanity:content:create -- --type=post --read --list --limit=20 --offset=0 --order=updated-desc`
