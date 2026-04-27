---
name: sanity-studio-post-ops
description: Gunakan saat perlu membaca/menulis konten Sanity Studio dari repo ini untuk post-like types (post, service, product, project, page), termasuk otomasi create/upsert dari JSON eksternal dengan guardrails key/link/id dan token dev-first.
---

# Sanity Studio Post Ops

Skill ini dipakai untuk komunikasi operasional dengan Sanity Studio pada repo ini untuk content type berikut:

- `post`
- `service`
- `product`
- `project`
- `page`
- `category`
- `pageTemplate`
- `redirect`

## Kapan Skill Ini Dipakai

- User minta create/update/publish konten Sanity secara otomatis dari sistem luar.
- User minta semua field schema harus bisa diakomodasi (tanpa mapping sempit).
- User minta SOP write Sanity yang aman dan konsisten.

## Sumber Kebenaran Contract

- Studio schemas:
  - `studio/schemas/documents/post.ts`
  - `studio/schemas/documents/service.ts`
  - `studio/schemas/documents/product.ts`
  - `studio/schemas/documents/project.ts`
  - `studio/schemas/documents/page.ts`
  - `studio/schemas/documents/category.ts`
  - `studio/schemas/documents/page-template.ts`
  - `studio/schemas/documents/redirect.ts`
- Ringkasan mapping: `docs/sanity-post-types-map.md`

## Token dan Environment

Wajib dev-first:

1. `SANITY_DEV`
2. fallback `SANITY_AUTH_TOKEN`

Environment minimum:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- optional `NEXT_PUBLIC_SANITY_API_VERSION`

## Workflow Standar (Multi-Type)

1. Siapkan payload JSON sesuai type target.
2. Jalankan dry-run (tanpa `--write`).
3. Validasi output `nextDocument`.
4. Jalankan write (`--write`).
5. Verifikasi public read (jika bukan draft).

Command:

```bash
pnpm --filter frontend run sanity:content:create -- --type=post --input=./payload.json
pnpm --filter frontend run sanity:content:create -- --type=service --input=./payload.json
pnpm --filter frontend run sanity:content:create -- --type=product --input=./payload.json
pnpm --filter frontend run sanity:content:create -- --type=project --input=./payload.json
pnpm --filter frontend run sanity:content:create -- --type=page --input=./payload.json
pnpm --filter frontend run sanity:content:create -- --type=category --input=./payload.json
pnpm --filter frontend run sanity:content:create -- --type=pageTemplate --input=./payload.json
pnpm --filter frontend run sanity:content:create -- --type=redirect --input=./payload.json
```

Write nyata:

```bash
pnpm --filter frontend run sanity:content:create -- --type=post --input=./payload.json --write
```

Upsert dan draft:

```bash
pnpm --filter frontend run sanity:content:create -- --type=service --input=./payload.json --mode=upsert --write
pnpm --filter frontend run sanity:content:create -- --type=product --input=./payload.json --draft --write
```

## Akomodasi Semua Field

`frontend/scripts/create-content-from-json.mjs` mengakomodasi semua field payload dengan pendekatan pass-through:

- seluruh top-level dan nested field payload tetap dibawa ke dokumen final
- script hanya override `_id`, `_type`, dan `slug.current`
- script menambahkan safety-normalization untuk array key dan link object

## Guardrails Konten Publik

- Public `_id` tidak boleh mengandung `.`.
- Semua object item di array harus punya `_key`.
- Link object (`_type: "link"`) dinormalisasi agar `isExternal` konsisten.
- Internal link gunakan `isExternal: false`; external link gunakan `isExternal: true` + `href`.

## Referensi Payload

- `references/post-payload.example.json`
- `references/service-payload.example.json`
- `references/product-payload.example.json`
- `references/project-payload.example.json`
- `references/page-payload.example.json`
- `references/category-payload.example.json`
- `references/page-template-payload.example.json`
- `references/redirect-payload.example.json`

## File Operasional

- Multi-type create: `frontend/scripts/create-content-from-json.mjs`
- Page -> post conversion: `frontend/scripts/convert-page-to-post.mjs`

## Verifikasi Cepat (Disarankan)

1. Jalankan `--help`:
   - `pnpm --filter frontend run sanity:content:create -- --help`
2. Dry-run per type:
   - `post`, `service`, `product`, `project`, `page`
3. Write ke `draft` untuk smoke test integrasi env/token.
4. Audit hasil dengan GROQ `perspective: "raw"` agar draft terbaca.
