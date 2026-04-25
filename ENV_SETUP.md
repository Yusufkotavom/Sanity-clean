# Environment Setup Guide

This repo is a pnpm workspace with:
- `frontend` (Next.js app)
- `studio` (Sanity Studio)

## 1) Local setup

1. Copy env templates:
```bash
cp frontend/.env.example frontend/.env
cp studio/.env.example studio/.env
```

2. Fill the values in both files using your existing Sanity/Vercel/Resend credentials.

3. Install dependencies:
```bash
pnpm install
```

4. Run both apps:
```bash
pnpm dev
```

## 2) Variables used by `frontend/.env`

`NEXT_PUBLIC_SITE_URL`
- Public site URL.
- Local: `http://localhost:3000`
- Production: your public domain.

`NEXT_PUBLIC_STUDIO_URL`
- Studio URL used by preview/edit links.

`NEXT_PUBLIC_SITE_ENV`
- Optional environment marker (`development`, `production`, etc.).

`RESEND_API_KEY`
- API key for newsletter/email endpoint.

`NEXT_RESEND_TO_EMAIL`, `NEXT_RESEND_FROM_EMAIL`
- Destination and sender identity for outgoing emails.

`NEXT_PUBLIC_SANITY_API_VERSION`
- Sanity API version used by frontend queries.

`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
- Public Sanity project settings.

`SANITY_API_READ_TOKEN`
- Required by `frontend/sanity/lib/token.ts` for live/draft fetch.

`SANITY_STUDIO_*` + `SANITY_AUTH_TOKEN`
- Shared values for preview/deploy integration paths used in this starter.

`SANITY_DEV`, `SANITY_DEPLOY`
- Optional flags for your local scripts/flows.

`SEO_SESSION_SECRET`
- Session signing secret for SEO dashboard cookie.

`SANITY_AUTH_TOKEN`
- Needed when saving SEO Ops settings from dashboard into Sanity.

`SEO_SETTINGS_ENCRYPTION_KEY` (optional but recommended)
- Dedicated key for encrypting dashboard secrets. If missing, fallback uses `SEO_SESSION_SECRET`.

`SEO_*` indexing vars (Google/IndexNow, batch, retry, dashboard password)
- Optional legacy fallback if you do not set values in dashboard.

`SEO_GSC_PRIORITY_CSV_PATH`
- Path to `gsc-pages-priority.csv` used by migration priority dashboard.

## 3) Variables used by `studio/.env`

`SANITY_STUDIO_PREVIEW_URL`
- Frontend URL used by Presentation tool.

`SANITY_STUDIO_API_VERSION`
- Sanity API version for Studio and Vision.

`SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`
- Main Sanity project config.

`SANITY_STUDIO_HOSTNAME`
- Studio hostname for deployment.

`SANITY_STUDIO_APP_ID`
- Sanity deployed studio app id.

`SANITY_AUTH_TOKEN`
- Required for `sanity deploy`, `dataset import`, and CI deploy steps.

`SANITY_DEV`, `SANITY_DEPLOY`
- Optional flags.

## 4) GitHub Actions secrets/vars

For `.github/workflows/deploy-studio.yml`, configure:

Repository/Environment **Variables**:
- `SANITY_STUDIO_PREVIEW_URL`
- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`
- `SANITY_STUDIO_HOSTNAME`
- `SANITY_STUDIO_API_VERSION`
- `SANITY_STUDIO_APP_ID`

Repository/Environment **Secrets**:
- `SANITY_AUTH_TOKEN`
- `SANITY_STUDIO_VERCEL_BYPASS_SECRET` (if you use Vercel protection bypass)

## 5) Vercel env mapping

Set these in Vercel project settings for frontend deployment:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_STUDIO_URL`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN`
- `RESEND_API_KEY`
- `NEXT_RESEND_TO_EMAIL`
- `NEXT_RESEND_FROM_EMAIL`
- `REVALIDATE_SECRET`
- `SEO_SESSION_SECRET`
- `SANITY_AUTH_TOKEN`
- `SEO_SETTINGS_ENCRYPTION_KEY` (optional, recommended)
- Optional legacy fallback: `SEO_DASHBOARD_PASSWORD`/`SEO_DASHBOARD_PASSWORD_SHA256`, `SEO_GOOGLE_*`, `SEO_INDEXNOW_*`, `SEO_INDEXING_*`
- `SEO_GSC_PRIORITY_CSV_PATH`

For Studio if deployed separately, set all `SANITY_STUDIO_*` + `SANITY_AUTH_TOKEN`.

## 6) Security notes

- `.env` files are ignored by git.
- Never commit real API keys or tokens.
- Only commit `.env.example` templates.

## 7) Sanity webhook for instant updates

To make newly published content appear without redeploy, create a Sanity webhook:

- URL:
  - `https://your-frontend-domain.com/api/revalidate?secret=YOUR_REVALIDATE_SECRET`
- Trigger:
  - document create, update, delete
- Filter:
  - `_type in ["post","product","service","category","page","settings","navigation"]`
- Projection (recommended):
```json
{
  "_type": _type,
  "slug": slug,
  "path": select(
    _type == "post" && defined(slug.current) => "/blog/" + slug.current,
    _type == "product" && defined(slug.current) => "/products/" + slug.current,
    _type == "service" && defined(slug.current) => "/services/" + slug.current,
    _type == "category" && defined(slug.current) => "/blog/category/" + slug.current,
    _type == "page" && slug.current == "index" => "/",
    _type == "page" && defined(slug.current) => "/" + slug.current,
    null
  )
}
```

This project already includes:
- `frontend/app/api/revalidate/route.ts`
- `frontend/app/dashboard/seo/*` (SEO Ops dashboard)
- `frontend/app/api/seo/*` (SEO Ops APIs)

Detailed explanation:
- `RENDERING_CACHE_REVALIDATION.md`

Additional references:
- `docs/env-reference.md`
- `docs/gsc-priority-export.md`
