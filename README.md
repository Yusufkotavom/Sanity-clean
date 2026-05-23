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

## License

Private. All rights reserved.
