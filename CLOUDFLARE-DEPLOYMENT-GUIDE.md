# Cloudflare Deployment Guide

Panduan ini sekarang fokus ke deployment `frontend`, `studio`, dan `worker`.

## Scope yang aktif
- `frontend` (Cloudflare Pages)
- `studio` (Cloudflare Pages atau Sanity-hosted studio)
- `worker` (Cloudflare Workers)

## Catatan penting
- Aplikasi `seo-dashboard` sudah dihapus dari monorepo pada 2026-04-22.
- Semua instruksi deployment yang sebelumnya memakai root directory `seo-dashboard` sudah tidak berlaku.

## Deploy Worker
```bash
cd worker
pnpm wrangler deploy
```

## Deploy Frontend via Cloudflare Pages
- Root directory: `frontend`
- Build command: `pnpm build`
- Build output directory: `.next`

## Deploy Studio via Cloudflare Pages
- Root directory: `studio`
- Build command: `pnpm build`
- Build output directory: `dist`
