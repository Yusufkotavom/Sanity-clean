# Sanity + Next.js Starter

Full-stack website with Sanity CMS, Next.js 15, and a page generator engine for programmatic SEO.

## Stack

- **Frontend**: Next.js 15 (App Router, SSG, ISR)
- **CMS**: Sanity v3 (Studio + Content Lake)
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Set environment variables
cp frontend/.env.example frontend/.env
# Edit with your Sanity project ID, dataset, and tokens

# 3. Import seed dataset
./scripts/seed-import.sh <project-id> production

# 4. Run development
cd frontend && pnpm dev      # Next.js on :3000
cd studio && pnpm dev        # Sanity Studio on :3333
```

## Project Structure

```
├── frontend/          Next.js application
│   ├── app/           App Router pages
│   ├── components/    UI + block components
│   ├── sanity/        Queries, fetch, metadata
│   └── scripts/       OG generation, bulk ops
├── studio/            Sanity Studio
│   ├── schemas/       Document + block schemas
│   ├── lib/generator/ Page generator engine
│   └── components/    Custom Studio components
└── scripts/           Seed & import scripts
```

## Documentation

- [Sanity Blocks Reference](docs/sanity-blocks-reference.md) — Payload JSON schemas and setup rules for Sanity blocks and page generation.
- [AI Generator Shortcodes](docs/ai-generator-shortcodes.md) — Documentation on prompt injection directly from CMS.
- [Hybrid Page Workflow](docs/hybrid-page-cli-workflow.md) — Hybrid page architecture setup.

## Features

- **Block-based pages** — Compose pages from 30+ block types in Studio
- **Block Presets** — Save and reuse block collections across documents
- **Page Generator** — Template + Dataset → bulk generate location/service pages
- **SEO** — Auto breadcrumbs, JSON-LD, OG images, meta from CMS
- **OG Image API** — Dynamic split-card OG images with category-matched visuals
- **Draft Mode** — Live preview without breaking SSG
- **Revalidation** — Webhook-based per-path ISR (30-day default)

## Environment Variables

### Frontend (.env)

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
SANITY_API_READ_TOKEN=
SANITY_AUTH_TOKEN=
```

### Studio (.env)

```
SANITY_STUDIO_PROJECT_ID=
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_PREVIEW_URL=https://your-frontend.vercel.app
```

## Scripts

| Script | Description |
|--------|-------------|
| `scripts/seed-import.sh` | Import starter dataset to fresh project |
| `scripts/seed-production.mjs` | Generate seed data via API |
| `frontend/scripts/bulk-og-generate.mjs` | Bulk generate OG images for all docs |

## Generator System

Create hundreds of SEO pages from templates:

1. **Template** — Block layout + SEO patterns + route config
2. **Dataset** — Rows of per-page data (1 row = 1 page)
3. **Program** — Connects template + dataset, runs generation

```
Template (blocks + seoMeta + routeBase)
  + Dataset (394 rows with city, keywords, localCondition)
  = 394 unique pages generated
```

## ⚠️ Deployment Note (2026-08-06): Sanity-clean vs sanity-nextjs-kotacom

This repo is a fork of [`sanity-nextjs-kotacom`](https://github.com/Yusufkotavom/sanity-nextjs-kotacom)
(HEAD `8f7bbad` is an ancestor of this repo's `main`). During cleanup, the legacy
local-routing subsystem was intentionally removed, which means this build does **not**
ship the same page set as the parent repo.

### What was removed

- `LOCAL_JASA_CETAK_BUKU_CITY_DISABLED = true` in `frontend/lib/local-content/jasa-cetak-buku-kota.ts`
  (added in commit `9df9371` "chore: remove local fallback runtime sources"). All
  `jasa-cetak-buku-*` city fallbacks are disabled.
- Dynamic routes (deleted from `frontend/app/`):
  `about/[slug]`, `pembuatan-website/[slug]`, `percetakan/[...segments]`,
  `services/[slug]`, `services/category/[slug]`, `software/[slug]`,
  plus `component-ui`, `home`, `style-guide`, `test-page-hybrid`.
- City shell components: `components/ui/jasa-cetak-buku-city-shell.tsx` and the whole
  `components/archive/legacy-rewrite-v0/` subsystem.
- `products/[slug]` renders as a dynamic route (ƒ) instead of SSG, so
  `/products/cetak-buku*` and `/products/hardisk-*` are not prebuilt.

### Measured impact (build comparison, same env, same Sanity project)

| Metric | sanity-nextjs-kotacom | Sanity-clean |
|---|---|---|
| Total static pages | 1278 | 1010 |
| `jasa-cetak-buku-<kota>` pages | 412 | 403 |
| Software pages (`*software*`) | 37 | 23 |

Missing vs parent: 5 local-only `jasa-cetak-buku-*` pages (novel-murah, yasin-surabaya,
dari-pdf-surabaya, edisi-terbatas-untuk-komunitas-merchandise, satuan-terdekat),
`/percetakan/*`, `/products/cetak-buku*`, `/software/*`, `/services/[slug]`,
`/pembuatan-website/[slug]`, `/about/[slug]`.

> Note: Sanity-backed per-city pages still render (403 pages). Only the local-code
> fallback pages and the nested dynamic routes are missing.

### How to restore parity

1. Set `LOCAL_JASA_CETAK_BUKU_CITY_DISABLED` to `false` (or remove the guard) in
   `frontend/lib/local-content/jasa-cetak-buku-kota.ts`.
2. Re-add `cityPages` + `JasaCetakBukuCityShell` fallback in `frontend/app/(main)/[slug]/page.tsx`
   (see the parent repo for reference).
3. Restore the deleted dynamic routes and the `legacy-rewrite-v0` subsystem from git
   history (`git log --diff-filter=D`).

## License

Private. All rights reserved.
