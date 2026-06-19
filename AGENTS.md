# AGENTS.md

This file provides guidance to the AI agent when working with code in this repository.

## Project

pnpm monorepo (pnpm 10.19.0): `frontend/` (Next.js 16 App Router, webpack mode) + `studio/` (Sanity Studio v5).

## Build & Dev

```bash
pnpm install          # install all workspaces
pnpm dev              # both apps in parallel
pnpm dev:frontend     # Next.js only (:3000)
pnpm dev:studio       # Sanity Studio only (:3333)
pnpm typegen          # regenerate Sanity TypeScript types
pnpm typecheck        # TypeScript check (frontend)
```

Frontend uses `--webpack` flag for dev and build (not Turbopack).

## Studio ↔ Frontend Sync

Every change to a Studio schema, GROQ query, or block type must be reflected in the matching frontend query fragment, component, and metadata logic in the same task. Layers:
- Studio schemas: `studio/schemas/` (blocks, documents, objects, singletons)
- GROQ queries: `frontend/sanity/queries/`
- Block components: `frontend/components/blocks/`
- Metadata/SEO: `frontend/sanity/lib/`

## Sanity Content Guardrails

When writing, seeding, importing, or patching Sanity documents:
- Document `_id` values must NOT contain dots (`.`).
- Every array item must include `_key`.
- Every `link` object must set `isExternal`: `false` + `internalLink` for internal, `true` + `href` for external.
- Use dev credentials first for writes: `SANITY_DEV` (token string, not boolean) > `SANITY_AUTH_TOKEN`. Never target production tokens by default.
- Never print raw token values in logs.
- After public writes, audit with public-read access (not only token-authenticated).

## UI Components

Use Shadcn UI components from `frontend/components/ui/`. If a needed component is missing: `cd frontend && npx shadcn@latest add [component]`. Never use raw `<select>`, `<button>`, or `<input>` when a Shadcn equivalent exists.

## Redirects

- Path-to-path: managed in Sanity via `redirect` document type.
- Structural wildcards: `STATIC_REDIRECTS` array in `frontend/next.config.mjs`.
- Validate destination URLs exist before creating redirects.
- Scripts: `frontend/scripts/import-approved-redirects.mjs` (CSV→Sanity), `frontend/scripts/update-curation-with-sanity.mjs` (audit).

## Hybrid Pages

Landing pages use a hybrid pattern: code-owned route shell + optional Sanity `page` document. `topBlockCount` splits `blocks[]` into top/bottom zones around the code-owned middle. Review `skills/hybrid-content-page-workflow/SKILL.md` and `docs/sanity-seed-guardrails.md` before adding one.

## SEO Tasks

- Log every repo change in `docs/seo-updates.md` (date, files, summary, SEO impact, verification status).
- For SEO audit/technical tasks, review vendored skills under `skills/claude-seo/` first.
- Preserve `seoSettings` global fallback when per-document SEO meta is empty.
- For migration/redesign tasks, also update checklist status in `docs/astro-migration-megaplan.md`.

## AI Generator Integration

The AI shortcode feature (`[aigen:...]`) for the Template Generator is fully documented at `docs/ai-generator-shortcodes.md`. Read it before modifying generator template logic.
