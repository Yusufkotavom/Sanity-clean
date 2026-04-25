# 🚀 Deployment Guide: Cloudflare & Netlify

This project is a **PNPM Monorepo**. Each application can be deployed as a separate site.

---

## 🌥️ Cloudflare Pages (Recommended for Frontend)

### 1. Setup on Cloudflare Dashboard
1. Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select your repository.
3. Configure the following for each app:

| Application | Build command | Build output directory | Root directory |
| :--- | :--- | :--- | :--- |
| **Frontend** | `pnpm build` | `.next` | `frontend` |
| **Sanity Studio** | `pnpm build` | `dist` | `studio` |

### 2. Environment Variables (Required)
Add these to **Settings > Functions > Environment variables**:
*   `NEXT_PUBLIC_SANITY_PROJECT_ID`
*   `NEXT_PUBLIC_SANITY_DATASET`
*   `SANITY_API_READ_TOKEN` (for redirects)
*   `REVALIDATE_SECRET` (for webhooks)

---

## 🇳 Netlify (Alternative)

### 1. Automatic Deployment
We have included a `netlify.toml` in the root. By default, it will deploy the **Frontend**.

### 2. Multi-site deployment
If you want to deploy multiple apps from the same repo:
1. Create a new site on Netlify.
2. Under **Build settings**, set the **Base directory** to `frontend` or `studio`.
3. Set **Build command** to `pnpm build`.
4. Set **Publish directory** to `.next` (for Next.js) or `dist` (for Sanity Studio).

### 3. Required Plugin
Netlify will automatically detect Next.js, but make sure the **Next.js Runtime** plugin is enabled in the dashboard.

---

## 🛠️ Cloudflare Workers (SEO Ops Worker)

The worker in `worker/` handles cron jobs for SEO.
To deploy it manually:
```bash
cd worker
pnpm wrangler deploy
```

---

## 🔑 Common Environment Variables

Ensure these are set in your CI/CD provider:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=https://www.kotacom.id
REVALIDATE_SECRET=your-secret-here
```
