# Astro + Sanity Fresh Foundation (No Page Migration)

Date: 2026-05-12
Mode: New project (not compatibility layer)

## Scope Saat Ini

Fokus hanya ke fondasi:
- Sanity data contracts
- SEO core resolver
- Redirect ingestion pipeline

Tidak termasuk:
- porting halaman Next.js
- fallback renderer legacy
- adapter kompatibilitas migrasi

## Arsitektur

- App baru: `web-astro/`
- Sanity tetap source of truth untuk konten + redirect specific path
- Structural wildcard redirect tetap di code (`STATIC_REDIRECTS`)

## Data Contract Rules

- Semua payload Sanity yang dikonsumsi Astro harus divalidasi schema (`zod`)
- Data minimum yang dipakai fase ini:
  - `seoSettings` (global fallback)
  - `redirect` (source, destination, permanent, enabled)

## SEO Rules

- Metadata resolver wajib fallback:
  1. per-document meta
  2. global `seoSettings`
  3. hard default (minimal)
- Canonical dibangun absolut berbasis `siteUrl`
- JSON-LD dibangun dari metadata final, bukan hardcoded route text

## Redirect Rules

- Specific redirects: dari Sanity `redirect` docs
- Structural redirects: hardcoded di `STATIC_REDIRECTS`
- Build redirect final harus dedupe source->destination
- Redirect invalid/shape mismatch harus fail-fast

## Operational Notes

- Untuk script agent-driven Sanity write/read, prioritas token:
  1. `SANITY_DEV`
  2. `SANITY_AUTH_TOKEN`
- Jangan print nilai token ke log.

## Next Milestone

1. Tambah integration tests untuk validasi contract (`seoSettings`, `redirect`).
2. Tambah endpoint debug internal untuk melihat merged redirect map.
3. Baru lanjut ke route rendering Astro setelah fondasi ini stabil.
