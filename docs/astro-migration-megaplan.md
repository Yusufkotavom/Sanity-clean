# Astro -> Next.js + Sanity Mega Plan

Date: 2026-04-01
Scope: Migration + per-URL curation + SEO rewrite optimization + UI redesign/refactor

## Goal

Migrate legacy Astro source into current Next.js + Sanity stack with:
- stable URL architecture
- SEO parity/improvement (technical + metadata + content quality)
- modernized UI system
- phased low-risk rollout (no ranking collapse)

## Success Metrics (Definition of Success)

- Build stability:
  - [x] `pnpm --filter frontend run build` green
  - [x] `pnpm --filter studio run build` green
- SEO technical:
  - [x] `http_status_not_200` issue count reduced >= 80%
  - [x] missing title/description/canonical/OG = 0 on canonical pages
  - [x] sitemap + robots valid for target routes
- Migration coverage:
  - [x] top 1000 auto-redirect mapped and deployed in staged wave
  - [x] top 300 manual legacy URLs curated one-by-one
  - [x] content parity for core templates (blog/service/product/project)
- UX redesign:
  - [x] new design system applied to key templates
  - [ ] mobile + desktop verified for header/nav/CTA/content pages

## Current Status Snapshot (Already Done)

- [x] A new dev-only `Sanity Generator V2` design direction is now documented: future programmatic page generation will move to a Studio-native workflow (`generatorTemplate` + `generatorProgram` + `generatorDataset`) that outputs standard `page` documents, preserves manual edits, supports bulk keyword and row-based variation, and freezes the current legacy templating engine as migration source material instead of continuing to expand it.
- [x] Dormant migration-era component artifacts have been pruned without changing active render paths: archived `legacy-rewrite-v0` components, an unused hybrid middle-section variant, an unused rewrite city shell, and tracked Studio session/runtime artifacts were removed, while active legacy contracts such as `legacyPage` and `legacy-rich-content` were intentionally kept because frontend/runtime still depends on them.
- [x] `seo-dashboard` workspace app has been fully retired and removed from the repository; root monorepo scripts/workspace entries and frontend revalidate webhook forwarding were cleaned so runtime no longer depends on dashboard indexing endpoints.
- [x] Sanity Studio AI authoring surface has been retired from the main CMS flow: `AI Rewrite/AI Extend` document actions were removed, `aiWriterSettings` is no longer part of Studio schema/desk singletons, and Studio env/setup docs were cleaned to avoid stale AI action secret configuration.
- [x] Homepage lane card layout has been normalized to a 2x2 scan pattern on larger screens (`sm:grid-cols-2`), replacing the previous XL 4-column spread for better readability.
- [x] Homepage hybrid middle shell has been polished with clearer above-the-fold copy/CTA hierarchy and safer trust messaging; static testimonial-persona quotes were replaced by operational proof cards, and homepage article CTAs now point to the valid `/blog` route instead of `/posts`.
- [x] Example Sanity seed baseline is now available and executed for development dataset (`ww3aejg2/development`) via `frontend/scripts/seed-example-db.mjs`, covering singleton + core content types (`settings`, `seoSettings`, `navigation`, `category`, `page`, `post`, `product`, `service`, `project`).
- [x] Local runtime fallback sources have been fully disabled in frontend (`legacy-pages/astro-static`, `local-content/json-usaha`, `local-content/astro-catalog`, and `jasa-cetak-buku-kota`), and explicit local fallback hooks were removed from `/services/[slug]`, `/services`, and `sitemap.xml` generation.
- [x] Dependabot automation has been disabled by removing `.github/dependabot.yml`, so dependency/GitHub Actions update PRs are no longer auto-opened by Dependabot.
- [x] **GSC MIGRATION 100% DONE:** All Top 300 manual curations + Top 1000 auto-redirects fully synced, seeded, and mapped via Sanity and Next.js wildcards.
- [x] Repo-local `json_usaha` source pack has been restored from the Astro source tree into `frontend/content/astro-local/json-usaha`, and `/services/[slug]` static generation is green again for `agency-landing`, `biro-jasa-perizinan`, and `jasa-pengukuhan-pkp`.
- [x] `/services` now follows the repo hybrid-page pattern: the route remains code-owned for the service catalog shell, while Sanity `page` blocks and metadata for slug `services` are rendered again through `PageHybridShell`.
- [x] SEO dashboard manual Indexing API submissions now wait for execution and DB logging before returning, and the Search Submissions filters now match the actual stored provider/type values (`google`, `bing`, `indexnow`, `google_sitemap`, `indexing_manual`, `sitemap_submit`, `update`).
- [x] SEO dashboard Search Submissions table now exposes the stored response/error message, so failed indexing requests can be diagnosed directly from the UI without checking the database manually.
- [x] SEO dashboard indexing settings now accept the repo's existing legacy env contract as fallback: Google can derive service-account JSON from `GSC_CLIENT_EMAIL` + `GSC_PRIVATE_KEY`, and IndexNow can derive from `INDEXNOW_*` plus `NEXT_PUBLIC_SITE_URL` when `SEO_*` keys are absent.
- [x] SEO dashboard Search page now includes a direct `Inspect URL` action that calls the Google URL Inspection API and persists the result into `index_status_checks`, so operators can populate the Index Inspections panel without curl or worker triggers.
- [x] SEO dashboard Search has now been upgraded into a full ops console: `Inspect URL` supports sitemap ingestion, both submissions and inspections tables include URL-focused detail columns, table-level filters, and row-level retry actions (`retry submission` / `retry inspection`) for faster recheck loops.
- [x] Review rich-result schema cleanup shipped: `Service` and global `LocalBusiness` JSON-LD no longer emit `aggregateRating/review` snippets that were triggering GSC "invalid object type", while product/affiliate schema now enforce safer `name` fallback to reduce "name missing" validation errors.
- [x] Rich-snippet rollback applied per operator request: `Service` and global `LocalBusiness` review/aggregateRating output restored to previous behavior while preserving build/type stability.
- [x] SEO dashboard analytics ingestion is now resilient to URL-contract drift: `pull-analytics` auto-creates placeholder `content_items` for unmatched GSC URLs instead of silently dropping rows, preventing empty analytics panels when URL normalization differs.
- [x] SEO dashboard manual GA4 trigger no longer crashes with HTTP 500 when `runReport` fails: GA4 request parameters were corrected and errors are now returned as controlled API responses (`ok: false`) for faster ops diagnosis.
- [x] Dashboard GA4 env contract corrected for property scope: local ops env now points `GA4_PROPERTY_ID` to the actual GA4 Property ID (not Data Stream ID), and verification now reaches permission check against the intended property.
- [x] Analytics dashboard no longer hard-depends on GSC rows for rendering: `/dashboard/analytics` now falls back to `analytics_ga4_daily` when `analytics_daily` is empty, so GA4 session/conversion visibility remains available during early GSC sync gaps.
- [x] Template rewrite architecture upgraded to lane-aware conversion shells: `pageTemplate` now carries explicit `lane`, `trustMode`, and source-of-truth policy; structured copy supports rule-based content variants; and rewrite pages render one clear variant-driven narrative instead of stacking duplicate hero/pricing/proof layers.
- [x] All 4 live `pageTemplate` documents have now been patched to the new conversion model in Sanity, including lane-specific pricing/proof/testimonial content, capped quick CTAs, and city-aware support-copy variants for location routes.
- [x] Obsolete one-off template patch scripts have been removed from `frontend/scripts`, leaving a single maintained upgrade path for live template conversion content and reducing accidental rollback risk.
- [x] Template-backed location override documents now also have a normalization path for legacy field-shape drift, and the known `jasa-cetak-buku-surabaya` override has been brought in line with the active testimonial contract.
- [x] Template-backed `pageLocation` and `serviceLocation` documents have been brought out of legacy `draft/noindex` state, so active money pages and location-route descendants now align with the public indexing intent of the new rewrite architecture.
- [x] Template resolver guardrails now have direct frontend contract coverage for token stripping, lane filtering, trust-mode copy selection, source-policy precedence, and route-kind inference.
- [x] Template spinner/content model is now service-aware as well as location-aware: `{layanan}` tokens, `requiresService` guardrails, route-specific CTA labels, and stronger service/service-city copy variants are wired across Studio, GROQ, resolver, and template-upgrade script.
- [x] The active Sanity `pageTemplate` dataset has now been rewritten with those service-aware variants, so service and service-city descendants can consume the upgraded conversion copy immediately instead of waiting for a later content sync.
- [x] Public template backbone is now locked by lane instead of editor-controlled variant order, so template-backed money pages keep one stable conversion spine and only swap `service + kota` relevance.
- [x] Lane template sections are now enriched beyond headline swaps: service-fit, pricing, proof, testimonials, and final CTA blocks receive lane-aware framing plus route-kind-aware messaging for `city`, `service`, and `service-city` descendants.
- [x] Template closeout flow now reflects buying stage more clearly with lane-specific CTA journey framing instead of one generic follow-up path across all lanes.
- [x] Lower-page template content is now more conversion-aligned: `longGuide` behaves as decision support, process/FAQ blocks have lane-owned intros, and stale internal CTA anchors in the closing section have been corrected.
- Verification note (2026-04-12): full frontend build is green again with network-enabled Sanity redirect fetch, so the recent template backbone and enrichment passes are now confirmed against production-style build flow.
- [x] `CollectionPage` + `BreadcrumbList` JSON-LD added to all major listing/archive pages (`/blog`, `/blog/category/[slug]`, `/products`, `/projects`, `/services`). Reusable `buildCollectionPageJsonLd` builder added to `frontend/lib/seo-jsonld.ts`. English hardcoded UI strings localized to Bahasa Indonesia on all affected listing pages.
- [x] SEO Ops automation hardening completed: manual indexing now uses real queue jobs, GSC daily pull now aggregates page/query/country/device, and GA4 imports are persisted in DB for dashboard joins.
- [x] SEO Opportunity Board added in operations dashboard with quick wins (high impressions + low CTR), decay detection, and indexing blocker monitoring.
- [x] Seo-dashboard Netlify build hardening completed: Sanity/env-sensitive API imports are now lazy-loaded to prevent `Failed to collect page data` crashes during production build.
- [x] Frontend instrumentation pass completed for GA4 + WhatsApp conversion tracking: root GA loader, route page_view dispatch, and shared WA click events now wired across floating/header/rewrite/SEO block CTA surfaces.
- [x] Default GA4 measurement ID now set to `G-P0DQM5CH0D` with env override support (`NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_GA_ID`) to simplify deployment activation.
- [x] Netlify prerender blocker resolved for GA4 instrumentation: root tracker no longer uses `useSearchParams`, preventing suspense-boundary errors on `/_not-found` and dynamic slug pages.
- [x] Netlify edge bundling blocker mitigated by removing unused frontend `proxy.ts`, preventing generation of `___netlify-edge-handler-node-middleware` artifact that crashed plugin bundling on Next.js 16.1.7.
- [x] SEO dashboard operations UX now includes functional manual `Run Audit` input form (URL batch enqueue), and internal worker cron now supports `pull-ga4` for GA4-to-DB daily sync automation.
- [x] Frontend manual trigger bridge now available for internal worker jobs (`/api/seo/ops/trigger` + dashboard Analytics trigger panel), so ops can run GA4/GSC/audit pipelines on-demand in addition to scheduled cron.
- [x] Internal cron worker now returns actionable API feedback for queue-misconfiguration cases: `type=drain-queues` no longer collapses into opaque `500` when Upstash env is missing, improving production schedule diagnostics.
- [x] Internal cron worker now also handles Upstash Redis quota exhaustion with explicit `429` responses, and AI prompt-template resolver now includes `topic` alias/fallback handling to reduce scheduled generation failures from variable-name mismatch.
- [x] Schedule edit contract is now hardened across UI/API/manager: normalized `scheduleType` handling on create, nested payload merge safety on update, and edit-save payload preservation to prevent configuration loss after edits.
- [x] Schedule create/edit contract now keeps ideation context end-to-end (`ideationInput`, `ideationKeywords`) and exposes previously hidden AI schedule options (`autoPublish`, `generateOgImage`, `promptTemplateId`, `tags`) in edit UI to avoid perceived data disappearance.
- [x] Upstash Redis env values are now synced across workspace runtime env files (`/.env`, `frontend/.env`) to keep queue/cron integration targets aligned with `seo-dashboard` env configuration.
- [x] New keyword-focused schedule workflow shipped (`keyword_pipeline`) with per-run keyword batching, `articlesPerKeyword` support (>1 variants), and persisted keyword cursor progression for long keyword lists.
- [x] Flexible AI model routing is now enabled across schedules and ideation: global quality profiles (`economy/standard/high`) + per-flow provider/model overrides, including split model-quality controls for keyword-pipeline outline vs full-content stages.
- [x] `/dashboard/ai-settings` is now fully wired to runtime config APIs (`/api/ai/config/status` + `/api/ai/config/save`) with editable global mode/default models, quality profiles (`economy/standard/high`), and full prompt set including body-extend variants; Sanity schema/query/fetch contracts were synced with new `modelProfiles` fields.
- [x] Cross-layer AI runtime contract sync completed for follow-up iteration: frontend Sanity query, shared `packages/ai` exports, dashboard schedule/config APIs, and Studio `aiWriterSettings` schema were aligned for model/profile settings (later retired from Studio desk schema on 2026-04-22).
- [x] Ops env contract now includes explicit GA4/GSC vars required by automated tasks (`GA4_PROPERTY_ID`, optional GA4 creds, `GSC_SITEMAP_URL`) to reduce runtime misconfiguration risk.
- [x] Real env sync completed for GA4/GSC/Sitemap across root + frontend + seo-dashboard + studio examples (`G-P0DQM5CH0D`, `https://www.kotacom.id`, `https://www.kotacom.id/sitemap.xml`, stream/property value `2168616948`) to keep tracking and import flows aligned.
- [x] Added root-level unified env template (`.env.all-in-one.example`) as a single source of config truth for frontend, studio, and seo-dashboard setup.
- [x] Netlify frontend deploy env has been trimmed via `netlify.toml` overrides to prevent AWS Lambda 4KB environment overflow during function upload.
- [x] SEO dashboard Vercel build typing break fixed for GA4 cron import path (`googleapis` runReport request contract updated), and local `seo-dashboard` build is green again.
- [x] Netlify runtime module-resolution hardening applied at root workspace (`next/react/react-dom` root dependencies) to address `Cannot find module 'next/dist/server/lib/start-server.js'` crash after deploy.
- [x] Added Netlify function bundling guard (`external_node_modules` for `next/react/react-dom`) to ensure Next runtime packages are present in deployed server function bundle.
- [x] Netlify Next.js adapter is now explicitly pinned in workspace dependencies (`@netlify/plugin-nextjs@5.13.3`) to avoid runtime drift with platform default plugin versions.
- [x] Netlify config now uses auto-detected Next.js runtime path by removing explicit `[[plugins]]` adapter block from `netlify.toml` for compatibility testing.
- [x] Netlify function packaging now includes explicit fallback includes for `___netlify-server-handler` (`next/react/react-dom`) to reduce runtime module resolution failures.
- [x] Migration closeout doc cleanup completed: obsolete migration-only docs removed from `docs/` to keep active documentation focused on operational workflows.
- [x] Post-migration documentation prune wave 2 completed: stale SEO dashboard phase summaries removed and dead doc references in legacy README/script paths replaced with active/archive links.
- [x] Removed the 8-item validation cap from navigation submenus in the Sanity schema (`link.ts`), permitting expanded menu structures.
- [x] Standardized `surface-panel` global CSS utility to enforce a unified transparent glassmorphism background across all components (Hero, CTA, Grid Cards, Split Panels).
- [x] Fixed `cta-1` block layout: buttons are now fully encapsulated by the section panel background and are properly centered alongside the text content.
- [x] GSC export + migration curation pipeline built
- [x] metadata audit script built and executed
- [x] URL inspection script built (quota-aware caveat)
- [x] sitemap-driven export run with `sitemap-0.xml`
- [x] Astro source repository discovered and inventoried
- [x] baseline migration blueprint documented
- [x] route contract v1 published (`docs/archive/2026-04-historical-plans/astro-next-route-contract.md`)
- [x] top-300 manual curation worklist initialized (`docs/curation/manual-top300-worklist-v1.csv`)
- [x] Astro static-page clusters scaffolded in Next.js (code-driven placeholder routes, non-Sanity)
- [x] Legacy route rewrite shell v1 applied with reusable components for service/trust clusters (`pembuatan-website`, `percetakan`, `software`, `layanan`, `about`, `contact`, `privacy`, `sistem-pos`)
- [x] 3-worker rewrite orchestration contract published (`docs/archive/2026-04-historical-plans/rewrite-worker-orchestration.md`)
- [x] Legacy route metadata moved to centralized helper with `seoSettings` global fallback; hardcoded `noindex` removed from rewrite clusters
- [x] Footer social area aligned to shared icon-only reusable pattern (`frontend/components/footer.tsx`)
- [x] Worker 2 contract hardening shipped for navigation links (Studio schema validation + frontend query fallback sync)
- [x] Worker 1 UI shell pass applied for header/nav action layout and reusable icon-action patterns (`frontend/components/header/**`, `frontend/components/footer.tsx`, `frontend/app/(main)/style-guide/page.tsx`)
- [x] Worker 3 content rewrite pass applied to legacy service clusters via centralized copy mapping (`frontend/lib/legacy-pages/rewrite-content.ts`)
- [x] Tracked top-priority rewrite gaps closed for `/pembuatan-website/portfolio` and `/pembuatan-website/sidoarjo` with route coverage + rewrite content handling
- [x] Legacy rewrite shell now includes strategic internal-link slots to canonical clusters (services/blog/contact) as crawl-support fallback
- [x] Worker 3 content rewrite pass v2 expanded to slug-specific copy variants (website services, printing details, software details, `about/ai-statement`)
- [x] Worker 3 content rewrite pass v3 closed remaining generic-route backlog in Wave 1 clusters (`TOTAL_GENERIC 0`)
- [x] Legacy landing v4 sections added for rewrite routes (TOC, pricing, feature icons, portfolio visuals, testimonials, final CTA, FAQ schema)
- [x] Sanity legacy template overrides added for rewrite routes (hero/highlights/FAQ/section order/custom blocks) with build-only fetch and metadata sync.
- [x] Sanity template documents (`pageTemplate`, `pageLocation`, `serviceLocation`) and structured rewrite copy wired into rewrite shell + metadata with hybrid block support.
- [x] Sample seed script added for template documents and location-based pages to bootstrap CMS editing.
- [x] Studio desk structure now exposes template/location document types for editing.
- [x] Page template ordering enabled via orderable rank field.
- [x] Location overview field added + nested template routing enabled for `/software/{city}` and `/pembuatan-website/{city}`.
- [x] Dev-mode template fetch now bypasses cache to prevent stale 404s during editing.
- [x] Location overview/highlights now render on template-backed pages when location is linked.
- [x] Location token replacement added to template copy for auto city injection.
- [x] Catch-all template routing added for arbitrary nested paths via `pageLocation/serviceLocation`.
- [x] Route pattern matching (`/parent/{lokasi}`) added with fallback lookup.
- [x] Studio auto-route input added (routePattern + slug -> route) and slug clarified as non-routing.
- [x] E-E-A-T points rendered in rewrite template + Generic Company template variant added.
- [x] `/toc` content index locked to repository-local sources only (no external copy/fetch, no Sanity dependency in TOC runtime)
- [x] Studio shared `link` schema now hides navigation-only fields outside `navigation` documents to avoid editor noise in post/product/service content
- [x] Metadata resolver now falls back to content thumbnail image when SEO `meta.image` is empty (`meta.image` -> `page.image` -> global default image)
- [x] Project contract implemented end-to-end: Studio `project` schema + frontend query/fetch + `/projects` and `/projects/[slug]` routes + sitemap integration
- [x] Percetakan rewrite template enriched from exported `jasa-cetak-buku-*` cluster pattern (399-post structure) with expanded long-form guide and stronger FAQ/CTA blocks
- [x] Root-slug adapter enabled for deduplicated `jasa-cetak-buku-kota` static dataset (`template.mdx` + `cities.json`) via `/(main)/[slug]` route fallback
- [x] Root-slug coverage parity restored to full export set (`399/399`) by including non-city variant slugs in static params + runtime fallback
- [x] CTA parity for `jasa-cetak-buku-(kota)` aligned to export pattern via reusable quick-action CTA block (Hubungi/Tanya/Penawaran/Chat)
- [x] Vercel-style UI shell pass applied across global surfaces and shared primitives (header desktop/mobile, footer, section wrappers, legacy landing sections) while preserving existing CMS and root-slug contracts
- [x] AI writer ops foundation added: Studio singleton settings + encrypted key pools + gateway/direct generation API for controlled rewrite workflows
- [x] AI writer production hardening completed for operations: dashboard UI, gateway model validation, prompt guardrails, and go-live checklist docs
- [x] AI rewrite apply flow completed in earlier phase via Studio document action, then intentionally retired from Studio surface on 2026-04-22 as part of CMS cleanup.
- [x] AI writer documentation consolidated into production-focused runbook; irrelevant/duplicated setup notes removed
- [x] SEO Ops dashboard stack split into a standalone Next.js app (`seo-dashboard`) with dedicated scripts, Sanity fetch layer, and auth middleware
- [x] Frontend revalidate webhook now supports optional indexing submission via the dashboard webhook when configured
- [x] Ops dashboard MVP scaffolding shipped: shared packages (db/ai/search/seo/content/sanity), worker cron scheduler, ops API endpoints, and shadcn/Geist UI for Jobs/Templates/AI/SEO/Search/Analytics.
- [x] Critical import behavior confirmed: dotted document IDs (example `post.import.*`, `page.legacy.*`) are visible in authenticated reads but can be missing in public published reads used by frontend build/runtime
- [x] Shared `legacy-rich-content` block contract added for Markdown/HTML raw rendering and wired to both `page.blocks` and `post.body` (`block-content`)
- [x] Sanity import smoke test completed with safe ID strategy (no dots): 2 pages + 2 posts published and visible in both public and authenticated published reads
- [x] Legacy content renderer finetuned with parser/sanitizer pipeline plus `legacy-prose` styles so HTML/Markdown lists, numbering, tables, and headings render consistently
- [x] Dedicated hybrid preview route `/home-pepar` now exists as a homepage-preparation surface, so the next live home iteration can be tested with real Sanity top/bottom zones before replacing `/`
- [x] `/home-pepar` now carries a fuller homepage-candidate middle section aligned to the live `kotacom.id` information architecture, giving the migration a realistic rehearsal surface instead of a scaffold placeholder
- [x] `/home-pepar` has now been polished into a more realistic live-candidate flow: one CMS hero above the shell, a less repetitive code-owned middle section, and CMS proof/CTA blocks below with preview-safe metadata
- [x] Next.js dev tooling warnings reduced by setting explicit Turbopack root and migrating `middleware.ts` to `proxy.ts`
- [x] Netlify proxy runtime compatibility fix applied: `frontend/proxy.ts` now pins runtime to `edge` to avoid node-middleware edge bundling crash on Next.js 16 builds.
- [x] Environment contract sync completed for frontend/studio examples + deploy env templates (missing keys added, AI Writer action secret parity documented)
- [x] Footer navigation visual cleanup shipped by removing card container style for a cleaner flat footer link section
- [x] Turbopack monorepo root issue fixed by setting `turbopack.root` to workspace root (prevent `frontend/app` Next package resolution failure)
- [x] Mobile navigation upgraded to full accordion view (open-by-default groups, collapsible sections, right-aligned link icons)
- [x] Mobile navigation render loop fixed (`Maximum update depth exceeded`) via memoized nav collections + guarded state update in effect
- [x] Mobile navigation loop hard-fix applied by removing effect-driven state init and moving open-group initialization to `onOpenChange`
- [x] Global Vercel-style grid background utility added and applied to main layout wrapper for consistent cross-page visual shell
- [x] Turbopack package boundary fix applied by reverting `turbopack.root` to frontend directory for correct `next`/`tailwindcss` resolution
- [x] Local frontend dev server stabilized by switching `frontend` dev script to `next dev --webpack` (Turbopack inference issue bypass)
- [x] Sticky WhatsApp CTA now uses WhatsApp brand-style icon for clearer visual intent
- [x] Shared UI consolidation pass completed for rewrite + block rendering (`legacy` naming reduced in runtime path), with shadcn-aligned breadcrumb composition and backward-compatible Sanity block mapping (`legacy-rich-content` + `rich-content`)
- [x] Product listing UX upgraded with reusable grid adapter: 2-column mobile / 4-column desktop plus progressive "Show more products" loading (initial 16 items) for `/products` and `/products/[category]`
- [x] Product listing card compactness pass applied for desktop readability: smaller product-card typography, tighter spacing, shorter media block, and excerpt clamping for denser grids
- [x] Archive listing reusable system shipped across `post`/`product`/`service`/`project`: shared card primitives, shared load-more grid, and shared taxonomy/meta rows adopted by listing and detail surfaces
- [x] Lazy-load pagination adapter extended to post/project/service archives (initial 16 + progressive show-more) without changing existing archive grid layout contracts
- [x] Rewrite visual enrichment shipped for percetakan/city templates with reusable local illustration assets and component-level color accents (minimal large-surface background tint) to improve long-form engagement
- [x] Universal branded vector hero integrated for `jasa-cetak-buku-(kota)` template through shared rewrite hero contract and city-shell adapter
- [x] `jasa-cetak-buku` visual intent alignment completed: hero and service visuals now specifically represent book-printing workflows with flat gradient brand style and per-service illustrations
- [x] Master documentation for flat illustration system completed (shark mascot art direction, page/use-case mapping, and detailed generation prompts) to guide consistent cross-template visual rollout
- [x] Flat illustration documentation expanded with quick-scan coverage for additional `jasa` clusters and per-service detailed generation prompts (website/software/percetakan variants)
- [x] Illustration roadmap refined with explicit business priority lock (`jasa-cetak-buku` first), logo-reference alignment, and remodeling directive for conversion-focused visual rollout
- [x] Unified `/style-guide` page now serves as single-page visual system review surface, with priority `jasa-cetak-buku` illustration batch and hero/CTA/social-proof variations
- [x] Official Kotacom logo integration shipped as frontend default brand asset (with Sanity logo override fallback preserved) and documented in internal style-guide brand section
- [x] Priority-1 shark illustration files generated for `jasa-cetak-buku` pack (hero, POD, offset, finishing, CTA) under `frontend/public/images/illustrations/`
- [x] Prompt consistency hardening shipped in illustration master doc (`Consistency Prompt Lock v2`) and priority-1 pack regenerated as `*-v2` assets for higher cross-scene mascot/style consistency
- [x] `kotacom-split-production-ready.zip` extracted into normalized production folder (`frontend/public/images/kotacom-split-production-ready`) with manifest-ready categorized assets
- [x] Production-ready split asset pack wired into active rewrite surfaces (`jasa-cetak-buku` hero + service/proof cards + style-guide gallery) replacing older static percetakan illustration paths
- [x] Centralized split-asset mapping implemented (`frontend/lib/illustrations/kotacom-split.ts`) and adopted across rewrite/legacy/style-guide components so ZIP assets are the single source for illustration consumers
- [x] About/contact/404 visual enrichment completed using split-pack assets (section hero mapping + 404 state illustration + reusable micro-badge strip on rewrite/legacy flows)
- [x] Rewrite hero v2 shipped with centered Vercel-inspired composition, two-CTA focus, and Sanity-driven WhatsApp primary CTA behavior shared with the floating WhatsApp surface
- [x] Rewrite section foundation v1 shipped: reusable visual section primitives now drive quick-nav, service split panels, highlights, process/FAQ, and related-link surfaces with clearer separators and connected gradient-tint framing
- [x] Rewrite section foundation v2 completed the visual-first pass across remaining commercial sections: hero intro panel, pricing, features, testimonials, and closeout CTA now follow the same split-panel rhythm
- [x] Missing Vercel-pattern primitives v1 added to rewrite system: metrics rail, inline phrase strip, product stage, quote spotlight, and rewrite logo wall are now available and wired into the shared rewrite page shell
- [x] Public rewrite routes no longer mount `SanityLive` outside Draft Mode, avoiding live-preview client errors on public city landing pages while preserving draft visual editing flows
- [x] Internal `/component-ui` route added as a noindex UI canvas for auditing rewrite primitives and visual-system components without affecting search index coverage
- [x] Reusable Sanity Studio `ui-icon` system is now integrated via icon-picker plugin with Lucide + Simple Icons support, legacy-nav fallback fields, and frontend SVG/icon resolution for CMS-driven navigation surfaces
- [x] Navigation overflow handling is now formalized with a desktop `More` lane, Studio warning for >8 primary items, and a completed dev-dataset migration from legacy nav icon tokens to `uiIcon`
- [x] Hero and CTA blocks now expose reusable `uiIcon` fields and render icon-aware eyebrow rows plus icon-aware CTA buttons through the shared Sanity icon contract
- [x] Grid and split card/list blocks now expose reusable `uiIcon` fields, with icon-aware card headings and button labels wired through the shared Sanity icon renderer
- [x] Public rewrite shell cleanup completed: internal/demo hero copy and visual-system explanation blocks were removed from commercial pages so business routes render only user-facing content
- [x] Selected rewrite modules were reintegrated for the public `percetakan` route with percetakan-specific business copy, replacing the earlier generic/demo messaging
- [x] Metadata and JSON-LD fallback images switched from legacy `/images/og-image.jpg` to centralized split-pack SEO fallback asset for consistent brand imagery in link previews and structured data
- [x] Rewrite content SEO power layer implemented: semantic keyword expansion, conversion-oriented intro/description strengthening, FAQ enrichment, and section-level long-guide defaults applied centrally through `buildLegacyRewriteCopy`
- [x] Intent-based rewrite SEO enrichment shipped (slug-pattern keyword packs, intent FAQ packs, default quick CTA link set, and final CTA normalization) for stronger commercial search alignment on high-intent routes
- [x] Live-site comparison pass completed for priority rewrite money pages (`pembuatan-website`, `software`, `sistem-pos`, `percetakan`, `company-profile`, `cetak-buku`) and source rewrite copy was extended with stronger geo/commercial intent plus deeper FAQ/guide coverage
- [x] Live-site comparison pass v2 completed for city/detail commercial routes (`website` city pages, `cetak-brosur`, `cetak-company-profile`, `pembuatan-software`, `implementasi-software`) with extended geo intent and richer supporting rewrite coverage
- [x] Astro repo MDX content import completed for missing database items only: `posts` (20), `services` (3), `projects` (12), `products` (1), plus required taxonomy categories (89)
- [x] Legacy `layanan/[slug]` Astro JSON-business pages are now covered by a code-driven Next route backed by repo-local `json_usaha` source copies (`3/3` slug coverage)
- [x] Repo-local Astro source pack for `jasa-cetak-buku-(kota)` imported into Sanity `page` documents via idempotent importer, with root-slug route now preferring CMS docs over local fallback
- [x] Priority money-page rewrite overrides shipped for 10 high-intent slugs (printing/website/software) plus legacy metadata description length guard (target ~120-155 chars)
- [x] Metadata guard finalized with bidirectional normalization (title and description both normalized for short/long edge cases) to keep rewrite-route snippets consistently within SEO-friendly ranges
- [x] Content quality pass v2 completed for 16 money pages with manual intent rewrite (headline/intro/CTA/FAQ) plus final-CTA label reuse in shared rewrite/legacy landing sections
- [x] City money-page pass completed for `jasa-cetak-buku-*` top 20 GSC cities with manual intent overrides and city-shell content/metadata sync to rewrite source
- [x] Frontend CTA density enhancement shipped for rewrite/legacy landing templates (quick CTA + mid CTA + enriched final CTA action set) with centralized default CTA-link expansion in rewrite content engine
- [x] Live SEO metadata audit rerun on 120 priority URLs with unrestricted network completed (`frontend/tmp/seo-pass-front-20260402-escalated`)
- [x] Unified frontend SEO metadata normalization utility shipped and applied to legacy + basic metadata builders (`frontend/lib/seo-normalize.ts`) with money-route + city-route length-pass verification
- [x] Content quality pass v3 shipped for JSON-usaha money pages (`/layanan/[slug]`): intent-based headline/description/CTA normalization, FAQ enrichment, and higher CTA density in frontend renderer
- [x] Astro header navigation snapshot normalized and imported into the live Sanity `navigation` document, including grouped submenu migration, legacy-route sanitization, and GSC-informed/live-page submenu curation
- [x] Navigation contract now supports footer-only top-level links via Studio-controlled `showInHeader` + `showInFooter` flags, and header rendering respects that split
- [x] Header navigation interaction tightened: submenu descriptions removed for cleaner information density and mobile accordion now opens in fully collapsed state by default
- [x] Header IA split from broad “Services” bucket into specific top-level entries (`Home`, `Web Dev`, `IT Service`, `Percetakan`, `Portfolio`, `Produk`, `About`, `Contact`) with `Blog` retained as footer-only support link
- [x] Manual money-page rewrite pass v4 shipped for additional commercial slugs (`pembuatan-website` + `percetakan` details) with intent-specific intro/CTA/final CTA/FAQ overrides beyond rule-based enrichment
- [x] Software funnel pass completed: stage-specific CTA links added for `software`/`pembuatan-software`/`implementasi-software`/`instalasi-software`/`sistem-pos` plus reusable CTA blocks in rewrite highlights and process-FAQ sections
- [x] Override-safe SEO enrichment fix shipped: priority slug overrides now merge before enrichment so FAQ/CTA coverage stays consistent (`99/99` commercial routes pass source-level coverage checks)
- [x] Agent communication policy now enforces Sanity dev-first credential usage (`SANITY_DEV` -> `SANITY_AUTH_TOKEN`) and env documentation/examples are aligned for safer CMS automation
- [x] Redirect rollout hardening added: build-time Next.js redirect loader now supports authenticated Sanity fetch for private `redirect` documents, plus diagnostics to expose redirect count/token mode in deployment logs
- [x] Root homepage `/` no longer relies on a full-Sanity body render; it now uses the shared hybrid shell with Sanity-managed top/bottom block zones around a code-owned middle section, while `/home` and `/product-home` remain redirect aliases to `/`
- [x] Sanity block schema defaults now include `_key` values for object-array `initialValue` payloads, preventing Studio `Missing keys` editor errors on seeded CTA/hero/grid/split/timeline blocks
- [x] Sanity agent-toolkit skills have been vendored into the repository under `skills/` so CMS/content-modeling guidance is versioned alongside the codebase
- [x] Claude SEO has been vendored locally under `skills/claude-seo`, so repo-level SEO audits and planning can use pinned local skills, agents, scripts, references, and docs instead of machine-global installs
- [x] `hero-2` now supports soft binding to `page.title`: when the block title is empty, frontend resolves the displayed heading from the parent page document instead of requiring duplicated CMS content
- [x] `hero-1` and `section-header` now follow the same soft binding pattern to `page.title`, so three core heading blocks can inherit the page title without duplicating CMS fields
- [x] Header and mobile navigation now expose a dedicated WhatsApp CTA sourced from global `settings.whatsApp`, while the existing `navigation.headerCta` remains available as a separate action from the navigation document
- [x] Post, product, service, project, rewrite, legacy, and JSON-usaha CTA surfaces now aggressively prioritize the global WhatsApp CTA contract, and a dedicated `whatsapp-cta` Sanity block is available for CMS-driven placement
- [x] Sanity Studio theme color overrides now use visual swatch pickers in `settings.themeColors`, so editors can choose brand colors without relying on raw HEX knowledge
- [x] Sanity Studio `Theme Colors` now also includes an embedded usage guide, preset preview cards, and recommended combinations so non-technical editors can understand the visual impact before editing tokens
- [x] Theme configuration is now isolated in a dedicated singleton `Theme Settings` document instead of the general `Settings` document, reducing editor confusion while preserving the same `themeColors` contract for frontend consumption
- [x] Rewrite hero CTA now uses explicit WhatsApp branding when the primary CTA resolves to WhatsApp, and the hero visual background has been consolidated so the image panel no longer carries a separate large gradient layer
- [x] Rewrite hero image frame has been reduced to a single background treatment, removing the remaining layered glow panel so the visual block reads cleaner and lighter
- [x] The `/pembuatan-website` cluster copy has been cleaned of internal editorial/process language and refocused on public-facing lead, trust, inquiry, and sales messaging across the core page, city template, company profile, toko online, and shared landing defaults
- [x] The `/pembuatan-website` specialist descendants (`harga`, `migrasi-wordpress`, `dokter-klinik`, `expedisi`, `sekolah`, `konstruksi`, `komunitas-ngo`, `template`) now also carry richer page-specific keyword, FAQ, process, and CTA copy instead of relying on thinner generic website-page defaults
- [x] The same public-copy cleanup has now been extended into the `software` and `percetakan` rewrite clusters, removing internal/editorial language from shared generators, specialist overrides, and money-page presets while strengthening customer-facing value and CTA messaging
- [x] The core `percetakan` money pages (`/percetakan`, `cetak-buku`, `cetak-company-profile`, `cetak-brosur`) now carry sharper print-intent keyword sets, more specific process/FAQ guidance, and CTA copy aligned to actual print decisions such as POD vs offset, material choice, and campaign distribution
- [x] A repo-wide public-content sweep has now cleaned additional internal/editorial wording from homepage local-content and shared rewrite generators, leaving internal-only surfaces such as `component-ui`, `test-page-hybrid`, and SEO dashboard pages as the primary remaining matches in local scans
- [x] Rewrite landing sections have been compacted from long stacked split scenes into denser lane/grid compositions, and `/component-ui` now documents the updated, less fragmented section pattern
- [x] Rewrite landing sections have been split into focused modules under `components/ui/rewrite/landing-sections/*`, keeping the public component entry stable while making the section system easier to maintain
- [x] Legacy rewrite content architecture split into modular registry-based content sources (`content/core`, `website`, `printing`, `software`, `misc`, `registry`) so route discovery, shared SEO enrichment, and per-cluster copy no longer depend on a single monolithic generator file
- [x] Priority slug override source also split by cluster (`website-overrides`, `printing-overrides`, `software-overrides`) so page-specific tuning is no longer stored in one mixed override map
- [x] Percetakan anchor pages (`/percetakan`, `/percetakan/cetak-buku`, `/percetakan/cetak-brosur`, `/percetakan/cetak-company-profile`) now resolve through dedicated page modules under `content/printing-pages/*` instead of living only as branches inside the cluster builder
- [x] Remaining `percetakan` detail presets and `cetak-buku` city-intent overrides are now stored in dedicated `printing-pages/*` modules, leaving `printing.ts` as a smaller resolver/fallback orchestrator
- [x] Software anchor pages (`/software`, `/software/pembuatan-software`, `/software/implementasi-software`, `/software/instalasi-software`, `/sistem-pos`) now resolve through dedicated `content/software-pages/*` modules, with `software.ts` reduced to shared fallback logic and overrides partially moved into page-focused modules
- [x] `pembuatan-website` anchor pages (`/pembuatan-website`, `/pembuatan-website/harga`, `/pembuatan-website/jasa-pembuatan-website-company-profile`, `/pembuatan-website/jasa-pembuatan-website-toko-online`) now resolve through dedicated `content/website-pages/*` modules, with website-specific overrides starting to move out of the mixed cluster file
- [x] Remaining non-city `pembuatan-website` service routes (`jasa-migrasi-wordpress`, `dokter-klinik`, `expedisi`, `komunitas-ngo`, `konstruksi`, `sekolah`, `template`) now also use dedicated `content/website-pages/*` modules, leaving city routes as the primary parametric fallback path
- [x] Slow parity pass started for `pembuatan-website` page modules by comparing Astro source against Next page-content modules; `company-profile` and `toko-online` now carry more of their original enterprise/e-commerce intent instead of generic website-copy fallback
- [x] Hybrid delivery pattern is now demonstrated end-to-end on `/test-page-hybrid`: code-driven route shell plus Sanity `page` blocks (`hero`, proof via `grid-row`, `cta`, `faqs`) seeded through dev-first credentials for concrete evaluation before applying the model to money pages
- [x] Sanity page-array guardrails are now scripted: page audits detect missing `_key` and missing `link.isExternal`, while a normalizer can patch legacy `page` documents in place to keep Studio editing safe
- [x] Hybrid demo public-read issue resolved: `/test-page-hybrid` now uses public-safe hyphenated document IDs for the `page` and referenced `faq` docs, and the FAQ renderer skips null dereference results instead of crashing if a referenced document is unavailable
- [x] Repo-level execution guidance now codifies public Sanity guardrails in `AGENTS.md` and a reusable `skills/sanity-public-content-guardrails` skill, so future agent-driven seed/import work follows the same public-read-safe rules by default
- [x] `/test-page-hybrid` now uses a clearer blueprint layout: code-owned intro/source diagnostics, separated Sanity hero/proof and conversion zones, explicit ownership mapping, and a fallback-oriented explanation section that is closer to the intended money-page hybrid pattern
- [x] Hybrid demo now supports page-level split control via `topBlockCount`, allowing editors to keep one freeform `blocks[]` array while choosing how many blocks render before the code-owned middle section
- [x] `/pembuatan-website` main route now has a real hybrid wrapper: top and bottom Sanity `page` blocks are split by `topBlockCount` around the existing rewrite shell, and a seeded public `page` document provides an initial support/proof + CTA layer without replacing the live local funnel logic
- [x] The main-route hybrid pattern is now reusable: `pembuatan-website`, `percetakan`, and `software` use a shared `PageHybridShell`, seeded public `page` documents exist for all three slugs, and repo guidance includes a dedicated hybrid-content workflow skill
- [x] The shared hybrid shell now also covers `/` and `/layanan`: homepage keeps a code-owned positioning layer between Sanity zones, and `layanan` now follows the same editable top/bottom block contract around its legacy rewrite shell
- [x] Sanity Studio now surfaces a lightweight list-level indicator for hybrid `page` documents (`Hybrid · Top N`), so editors can identify hybrid main pages and their current split without opening each record
- [x] Hybrid rollout now has a preset-based CLI scaffold (`hybrid:create`) that can dry-run or write public-safe `page` documents with verified `topBlockCount` and seed blocks, reducing friction when converting additional main routes to the shared hybrid contract
- [x] Hybrid rollout now has a dedicated operational doc (`docs/hybrid-page-cli-workflow.md`), so page conversion no longer depends on reading source scripts or skill files to understand modes, presets, and safety rules
- [x] Hybrid rollout now also has an anti-duplicate route bootstrap generator (`hybrid:route:create`) that can scaffold repo files plus Sanity seed flow in one dry-run-first workflow for newly hybridized main pages
- [x] Hybrid rollout no longer depends on CLI alone: Sanity Studio now exposes an `Apply Hybrid Preset` action on eligible hybrid `page` documents, allowing editors to seed or refresh draft hybrid blocks without terminal access
- [x] Hybrid rollout terminology and operational coverage are now sharper: the workflow uses the clearer `supported hybrid slug` concept, and smoke tests have validated unsupported-slug rejection, dry-run behavior, bootstrap writes, duplicate protection, and cleanup
- [x] Root-page blog backlog now has a dedicated `page -> post` conversion CLI with documented dry-run/write workflow, allowing temporary `page` articles to be copied into the `post` schema and `/blog/[slug]` routes without destructive type changes
- [x] Root-page blog backlog no longer depends on CLI only: Sanity Studio now exposes a draft-safe `Convert Page to Post` action so editors can bootstrap post documents from page documents directly inside Studio
- [x] Rewrite is now more clearly the active visual reference: unused pre-rewrite duplicate shells have been archived, and the core Sanity block components used by generic pages have been restyled toward the rewrite section/panel language
- [x] Universal trust badge strip now uses icon-led glass cards instead of text-in-image artwork, bringing the shared rewrite shell closer to the current shadcn/Vercel visual direction and removing duplicated badge wording
- [x] Universal trust badge cards have been compacted further so icon + title sit on one line and the supporting copy stays ultra-short, improving density without falling back to image-based labels
- [x] `project` documents now include `categories` again in the Studio schema and frontend query contract, resolving Sanity `Unknown field found` warnings on legacy project docs that still store category references
- [x] Printing products catalog is now populated in Sanity CMS using 10 custom generated high-quality visuals, ensuring proper product coverage and visual continuity on `/products` routes
- [x] Global PageSpeed pass applied: Sanity CDN defaulted for production, homepage data queries capped and cached, main layout revalidation set to 10 minutes, icon imports tree-shaken, and portable-text images compressed for faster LCP.
- [x] Block rendering now code-split via dynamic imports and detail-page Sanity fetches cache with 10-minute revalidation for faster TTFB/LCP on all content templates.
- [x] Detail-page hero LCP tuned: product/service/project hero images now use CDN width hints, quality 85, and priority + sizes; rewrite/post icons are tree-shaken.
- [x] CWV batch tuning pass: Sanity image default quality set to 75, grid/card imagery constrained to width hints, detail hero images now include LQIP blur, and grid image preloads reduced to the first item to limit LCP contention.
- [x] Build fix: Lucide icon imports reverted to package entry points to avoid ESM subpath resolution failures on Vercel.
- [x] Consolidated `/layanan` into `/services` with richer service catalog content and removed the `/layanan` routes (sitemap/TOC/internal links updated).
- [x] `seo-dashboard` OG endpoint now uses a split-layout visual style and resolves related preview imagery from published Sanity content (`post/service/project/product/page`) with safe fallback chaining.
- [x] `seo-dashboard` OG endpoint now applies Geist typography (best-effort font loading for `next/og`) plus transparent line-grid background overlay to match the active visual direction.
- [x] `seo-dashboard` OG font pipeline compatibility fix shipped: Geist loader switched from WOFF2 to TTF after local runtime `wOF2` signature failures.
- [x] `seo-dashboard` OG footer label now includes WhatsApp contact (`WA 085799520350`) alongside domain branding for clearer social card contact CTA.
- [x] `seo-dashboard` OG footer label styling now uses black badge + white text, and line-grid overlays were strengthened (global + left panel) to ensure visible striped background.
- [x] `seo-dashboard` OG WA badge final polish shipped: moved slightly lower and switched from rounded-pill style to flat square box per final visual direction.
- [x] AI Ideas content generation no longer fails on template naming mismatch (`target_audience` vs `audience`): template renderer now supports alias resolution + fallback, and single/bulk generate routes send expanded alias variables.
- [x] `seo-dashboard` OG image source simplified per operator request: related-image lookup from Sanity disabled; route now uses explicit `image` query param or direct fallback image only.
- [x] `seo-dashboard` OG upload pipeline now resolves base URL correctly for local dev ports (prefers `PORT`, supports `OG_BASE_URL` override), eliminating recurring `/api/og` 404 fetch failures during AI content generation.
- [x] `seo-dashboard` OG upload now has permission guardrails: prefers `SANITY_DEV` token first and disables repeated asset-upload attempts after detecting `403 create permission` errors.
- [x] `seo-dashboard` OG layout overflow hardening shipped: long title/description now capped with adaptive type scale and overflow guards so WA footer badge no longer gets clipped.
- [x] `seo-dashboard` mobile UI remap shipped for AI operations pages (`History`, `Templates`, `Generate`, `Content Ideas`): mobile card/list patterns and stacked action controls now replace cramped desktop layouts on small screens.
## Workstream A - Platform & Data Foundation

### A1. CMS Contract Freeze
- [ ] Finalize document contracts for `post`, `service`, `product`, `project`, `category`, `seoSettings`, `redirect`.
- [ ] Remove/disable unused Supabase dependencies in migration path.
- [ ] Confirm frontend query contracts mirror studio schema exactly.
- [x] Navigation link contract synced: `link`/`navigation-link-child` destination validation + `category` reference support aligned with frontend query mapping.
- [x] `project` document contract shipped across Studio schema, frontend GROQ/fetch layer, and route rendering.
- [x] Env/deploy contract synced for AI Writer + SEO Ops required keys across `frontend/.env.example`, `studio/.env.example`, and deploy env templates.
- [x] SEO Ops dashboard moved to standalone app package to decouple operations tooling from the main frontend runtime.
- [x] Ops dashboard MVP groundwork complete (shared packages, worker cron scheduler, core ops API + UI screens).
- Blocker note (2026-04-02): Full A1 closure still pending audit for remaining document contracts (`project`, `redirect`) outside Worker 2 navigation scope.

### A2. Route Contract Freeze
- [x] Publish canonical target route map:
  - `/blog/[slug]`
  - `/blog/category/[slug]`
  - `/services/[slug]`
  - `/products/[slug]`
  - `/projects/[slug]`
- [x] Mark exceptions for legacy pages to keep as dedicated landing pages.
  - Done in rewrite orchestration contract for non-blog static clusters (`about`, `contact`, `privacy`, `layanan`, `pembuatan-website`, `percetakan`, `software`, `sistem-pos`).
- [x] Identify routes to be redirected only.
- [x] Remove local runtime fallback route generation/sourcing so canonical routes resolve from Sanity/query contracts only.

### A3. Import Pipeline
- [x] Define extractor from Astro source content (MDX/frontmatter/static data) to import payload.
- [x] Import high-priority content first (GSC weighted).
- [x] Validate slug uniqueness and canonical mapping.
  - Added import safety note: avoid dotted `_id` patterns for page/post imports to ensure visibility in unauthenticated published API reads.
  - 2026-04-02 execution: imported missing repo-Astro MDX documents only, leaving local fallback pack `frontend/content/astro-local/jasa-cetak-buku-kota` untouched.
- [x] Repo-local Astro source pack (`frontend/content/astro-local/jasa-cetak-buku-kota`) now has a reusable importer that creates missing Sanity `page` docs and preserves slug/canonical parity for root-slug routes.
- [x] Added reusable example seed pipeline for empty/dev Sanity environments (`frontend/scripts/seed-example-db.mjs`) and validated successful write on `development` dataset.

## Workstream B - Per-URL Curation (One by One)

### B1. Manual Queue Execution (Top 300)
- [x] Process `gsc-manual-priority-top300.csv` line-by-line.
- Note: v3 one-by-one curation completed for top-300 with explicit final decision per URL; 32 items remain `keep_or_redirect` pending CMS content existence validation.
- Progress snapshot (2026-04-01):
  - `approved_redirect`: 268
  - `approved_keep_or_redirect`: 32
  - `pending_manual_intent`: 0
  - Output files: `docs/curation/manual-top300-worklist-v3.csv`, `docs/curation/manual-top300-approved-redirect-v3.csv`, `docs/curation/manual-top300-keep-or-redirect-review.csv`, `docs/curation/manual-top300-pending-manual-intent-v3.csv`
- [x] For each URL, assign:
  - keep (migrate as page)
  - redirect (301 target)
- [x] Add explicit reason code per mapping decision.

### B2. Auto Queue QA (Top 1000)
- [x] Validate `gsc-redirect-auto-top1000.csv` for false positives.
- [x] Spot check by intent similarity (topic, keyword, business intent).
- [x] Approve for wave-based deployment.

### B3. Long-tail Backlog
- [x] Continue remaining manual queue (750 total manual candidates).
- [x] Archive low-value URLs (noindex/410 strategy candidate list).
  - 2026-04-02 execution: finalized `28` spam/judi + blog-template root URLs as explicit `410 Gone` candidates and enforced them in frontend `proxy` to prevent redirect dilution and soft-404 behavior.

## Workstream C - SEO Rewrite & Optimization

### C1. Metadata Rewrite Program
- [x] Rewrite title/meta for high-impression URLs with quality guardrails.
- [ ] Enforce length policy:
  - title target 50-60 chars
  - [x] meta description target 120-155 chars
- [ ] Ensure canonical consistency for paginated and variant pages.
- [x] Legacy rewrite copy hardening completed for service/trust clusters to reduce boilerplate and improve intent-specific keyword coverage.
- [x] Legacy rewrite templates now accept Sanity override documents to control hero/highlights/FAQ/section order/custom blocks with build-only fetch.
- [x] Centralized SEO enrichment pass added to rewrite content pipeline (keyword dedupe/expansion, FAQ intent coverage, and long-guide fallback generation for main clusters).
- [x] Slug-intent SEO pass added (pricing/migration/cetak-buku/ecommerce/implementasi intent signals) with reusable enrichment rules in rewrite content engine.
- [x] Manual money-page rewrite v2 shipped for 16 high-intent slugs (`pembuatan-website`, `harga`, `jasa-migrasi-wordpress`, `jasa-pembuatan-website-*` selected pages, `template`, `percetakan` selected pages, `software`, `pembuatan-software`, `implementasi-software`, `instalasi-software`, `sistem-pos`) with conversion-focused headline/intro/CTA/FAQ tuning.
- [x] Manual city rewrite v1 shipped for top 20 `jasa-cetak-buku-<kota>` routes (based on local GSC priority file) through centralized city override map in rewrite content engine.
- [x] Money-page SEO length pass confirmed on frontend source layer (14 money routes + top 20 city routes; title 30-60 and description 120-155 after normalization, `TOTAL_FAIL=0`).
- [x] Manual money-page rewrite v4 completed for 12 additional high-intent slugs in `pembuatan-website` and `percetakan` clusters with tailored conversion copy (headline/intro/CTA/final CTA/FAQ).
- [x] Live-vs-local rewrite alignment pass completed on priority money pages to capture stronger `Surabaya` geo intent and expand decision-stage SEO support content in rewrite source.
- [x] Live-vs-local rewrite alignment pass v2 completed on city/detail commercial pages to capture stronger local-intent and service-variant query coverage in rewrite source.
- [x] Repo-level SEO operations guidance now points future agents at the vendored Claude SEO toolkit in `skills/claude-seo`, keeping audit workflows versioned with the codebase instead of depending on home-directory skill installs.
- [x] `/pembuatan-website` and key descendants now use cleaner customer-facing copy, with internal notes such as "rewritten from live site", editorial intent phrasing, and overly internal system language removed from public messaging.
- [x] `/pembuatan-website` specialist pages now also expose stronger SEO-supporting section copy (secondary keywords, highlights, process steps, and FAQs) for price, migration, vertical-specific, and template routes.
- [x] `software` and `percetakan` rewrite pages now also avoid internal/editorial phrasing and have cleaner public-facing descriptions, helping the broader rewrite cluster align better with real visitor intent.
- [x] Local homepage/public content sources now also avoid internal editorial notes such as upstream rewrite references and internal QA wording, so the remaining scan hits are concentrated in intentional internal tools and debug surfaces.
- [x] `seo-dashboard/app/api/og` visual refresh shipped with content-related Sanity image selection + explicit external fallback image, improving social preview relevance for generated OG assets.
- [x] `seo-dashboard/app/api/og` typography/styling pass shipped: Geist font family and transparent grid background overlay now applied for consistent branded OG appearance.
- [x] `seo-dashboard/app/api/og` runtime hardening shipped: Geist font source changed to TTF so OG endpoint no longer fails with `Unsupported OpenType signature wOF2`.
- [x] `seo-dashboard/app/api/og` footer copy now includes direct WhatsApp number (`085799520350`) for stronger contact signaling in shared previews.
- [x] `seo-dashboard/app/api/og` footer CTA strip now renders as high-contrast black badge with white text, and grid-pattern visibility has been increased to avoid missing line background.
- [x] `seo-dashboard/app/api/og` footer CTA strip spacing/shape adjusted again: badge lowered slightly and rendered as flat (non-rounded) box.
- [x] `seo-dashboard` AI ideas pipeline hardening shipped: template variable aliases (`audience/target_audience`, `keyword/target_keyword`, `word_count/length`, `location/target_location`) and fallback defaults now prevent false-required-variable 500 errors in single and bulk content generation.
- [x] `seo-dashboard/app/api/og` no longer fetches related images from Sanity at runtime; visual image selection is now fallback-only unless explicit `image` URL is provided in query params.
- [x] `seo-dashboard/lib/ai-writer/og-image-generator` now resolves local OG base URL using explicit envs and active dev port, preventing misrouted `127.0.0.1:3000` calls when dashboard runs on other ports.
- [x] `seo-dashboard/lib/ai-writer/og-image-generator` now handles Sanity write-permission failures defensively (403 guard + skip repeated uploads) and follows dev-token-first auth priority.
- [x] `seo-dashboard/app/api/og` text rendering now applies overflow bounds (title + description + content wrapper) and safer sizing so the contact strip stays fully visible in long-copy scenarios.
- [x] `seo-dashboard` responsive UX pass completed: AI tab navigation, filters, history, template management, generate form, and content-idea action clusters now adapt for mobile-first readability and tap targets.
- Blocker note (2026-04-02): Live SEO sample audit (`120` URLs) still reports unresolved issues outside migrated frontend scope (`meta_description_too_long: 106`, `title_too_long: 22`, `http_status_not_200: 10`) dominated by legacy live pages/redirect gaps; requires content import/redirect wave plus metadata cleanup on production routes.

### C2. Structured Data
- [x] CollectionPage + BreadcrumbList JSON-LD added to all 5 listing/archive routes (`/blog`, `/blog/category/[slug]`, `/products`, `/projects`, `/services`).
- [x] `buildCollectionPageJsonLd` reusable builder added to `frontend/lib/seo-jsonld.ts`.
- [x] Review snippet stabilization pass (2026-04-12): removed review snippets from `Service` and root `LocalBusiness` schema surfaces, and hardened product/affiliate schema with reliable `name` fallback for GSC validation compatibility.
- [x] Review snippet rollback pass (2026-04-12): reverted prior stabilization changes for `Service` and root `LocalBusiness` to match requested production behavior.
- [ ] Align JSON-LD by template (Article, BreadcrumbList, ItemList, Organization, WebSite) — remaining: paginated/category archives.
- [ ] Ensure fallback global SEO data always available.
- [ ] Validate no schema duplication/conflict.

### C3. Technical SEO Fixes
- [x] Resolve non-200 target pages prioritized by traffic.
- [x] Remove orphan/no-value thin pages from index strategy.
- [ ] Rebuild sitemap coverage by canonical route set.
- [x] Core Web Vitals pass: enable Sanity CDN in production, cache homepage query slices, add AVIF/WebP output, and set 10-minute route revalidation for main pages.
- [x] Template performance pass: dynamic-import block renderers plus cached detail fetches (page/post/product/service/project) to reduce JS and TTFB.
- [x] Detail-page hero images optimized (quality 85, width hints, priority on project hero) and hero icon imports tree-shaken to reduce LCP/JS cost.
- [x] Batch CWV tuning (2026-04-06): reduced Sanity image default quality, capped grid/card image widths, added LQIP blur to detail hero images, and limited preload priority in archive grids.
- [x] SEO Ops analytics enrichment shipped (2026-04-11): GSC pull upgraded to multi-dimension aggregation (`page/query/country/device`) and stored `topQueries/topCountries/topDevices` in `analytics_daily`.
- [x] SEO Ops conversion analytics persistence shipped (2026-04-11): GA4 imports now persist to `analytics_ga4_daily` and are surfaced in dashboard analytics joins.
- [x] SEO Ops opportunity workflow shipped (2026-04-11): dedicated board for quick wins, decay pages, and indexing blockers.

## Workstream D - UI Redesign + Refactor

### D1. Design System Alignment
- [x] Define reusable primitives: typography, spacing, button variants, card patterns, nav behavior.
- [x] Harmonize with current header/nav architecture and CMS-driven menus.
  - 2026-04-02 execution: added Astro navigation importer, sanitized legacy header routes (`/posts` -> `/blog`, `/categories/percetakan` -> `/percetakan`, generic archive placeholders to canonical archive roots), and synced grouped submenu structure into the active Sanity `navigation` document.
  - 2026-04-02 execution update: enriched submenu with live dataset-backed `project`/`product` links plus GSC-priority pages (`jasa-cetak-buku-surabaya`, `jasa-instal-aplikasi-surabaya`, `jasa-install-software-macbook`, `jasa-recovery-data-surabaya`, `service-komputer-surabaya-panggilan`, and high-traffic PC guide posts) so the header reflects current demand instead of Astro placeholder-only links.
  - 2026-04-02 execution update: added footer-only support for top-level navigation through Studio flags, and moved lower-priority top-level links (`About`, `Contact`) out of the header while preserving them in the footer.
  - 2026-04-02 execution update: removed submenu description text from header UI and changed mobile nav to keep all accordion groups closed when the sheet opens.
  - 2026-04-03 execution update: replaced the generic top-level `Services`/`Portfolio`/`Produk` IA with a more explicit split around business intent (`Home`, `Web Dev`, `IT Service`, `Percetakan`, `Portfolio`, `Produk`, `About`, `Contact`), while keeping `Blog` available as footer-only navigation.
  - 2026-04-03 execution update: rewrote the shared rewrite hero into a centered Vercel-inspired layout with exactly two primary actions and routed the lead CTA through Sanity-configured WhatsApp behavior so conversion handling stays aligned with the sticky WhatsApp surface.
  - 2026-04-03 execution update: introduced reusable section-shell primitives for visual-driven rewrite pages and migrated quick navigation, service sections, proof sections, highlights, FAQ/process, and related-link surfaces to connected thin-frame/tinted-panel patterns with clearer separators.
  - 2026-04-03 execution update: extended the new visual-first rewrite system into the remaining high-intent blocks so pricing, features, testimonials, final CTA, and the hero description area now share the same panel/separator language.
  - 2026-04-03 execution update: closed several remaining component gaps versus the Vercel reference set by adding reusable metrics/proof rail, phrase-strip heading, product-stage scene, quote spotlight, and logo-wall modules to the rewrite shell.
  - 2026-04-03 execution update: added a dedicated header/mobile WhatsApp CTA sourced from `settings.whatsApp`, sharing the same client-side link builder used by the floating WhatsApp widget and leaving `navigation.headerCta` as a separate navigation-managed action.
  - 2026-04-03 execution update: rolled the same global WhatsApp CTA contract into post/product/service/project detail surfaces plus rewrite, legacy, and JSON-usaha CTA buttons, and added a dedicated `whatsapp-cta` page-builder block so editors can place a WhatsApp-first CTA without hardcoding phone links.
  - 2026-04-03 execution update: improved `settings.themeColors` editing in Studio with a swatch-based color picker, keeping the same HEX-backed contract while making the brand color UI easier for non-technical editors.
  - 2026-04-03 execution update: expanded the `Theme Colors` Studio UI again with an embedded explanation of each color token, preview cards for existing presets, and a short list of recommended brand combinations.
  - 2026-04-03 execution update: split theme configuration into its own singleton `Theme Settings` document and updated the frontend theme-settings query to read from that dedicated source instead of the broader `Settings` singleton.
  - 2026-04-03 execution update: replaced the universal trust badge image strip with icon-led glass cards and concise supporting copy so the section matches the newer shadcn/Vercel treatment used across the rewrite shell.
  - 2026-04-03 execution update: tightened the trust badge cards again so icon and label share one compact row, with only 3-4 words of supporting copy per badge.
  - 2026-04-03 execution update: removed the last code-owned root homepage fallback so `/` now hard-depends on the Sanity `index` page document and the orphaned `ui/home` component has been deleted.
  - 2026-04-03 execution update: restored the missing `project.categories` field in both Studio schema and frontend project queries so legacy project documents no longer surface category references as unknown fields in Studio.
  - 2026-04-03 execution update: split `RewriteLandingSections` into a folder-based module set (`utility-strip`, `service-types`, `pricing-plans`, `features`, `proof`, `testimonials`, `long-guide`, `final-cta`, shared defaults/types) while preserving the existing public import path.
  - 2026-04-03 execution update: constrained `SanityLive` to Draft Mode only in the main layout so public landing pages stop hitting client-side live-preview parsing failures during dev/runtime.
  - 2026-04-03 execution update: created a dedicated noindex `/component-ui` route to review the current rewrite primitive set in one place without polluting production indexable navigation.
- [x] Apply shared icon-only social pattern for footer/navigation shell using reusable component contract.
- [x] Apply compact sticky header rhythm with single CTA focus and icon actions (dark mode + social) across desktop/mobile shell.
- [x] Apply Vercel-like visual shell tokens and reusable surface/separator utilities across shared layout blocks (`globals.css`, header, footer, section container, legacy landing shell).
- [x] Integrate official Kotacom brand logo asset as default UI logo fallback and expose brand preview/reference in `/style-guide`.
- [x] Public commercial rewrite pages no longer expose internal component-demo messaging; shell output is trimmed to business-facing hero and content sections only.

### D2. Template Refactor Priority
- [ ] Homepage
- [x] Homepage conversion polish pass (copy hierarchy + CTA clarity + valid blog route links) applied on hybrid middle shell (`home-pepar`) for safer live-home readiness.
- [x] Product-led homepage promoted to `/` using shared UI primitives; `/home` and `/product-home` now act as redirect aliases instead of separate preview destinations
- [x] Root homepage route restored to CMS-first behavior by resolving Sanity `page:index` before the local product-led fallback view, keeping `/home` and `/product-home` as aliases only
- [ ] Blog detail/list/category
- [ ] Service detail/list
- [x] Product detail/list
- [ ] Project detail/list
- [x] Legacy Astro static service/trust clusters switched to reusable rewrite template shell (Wave 1)
- [x] Template-backed money pages now use variant-driven section ordering with lane-specific proof/pricing/testimonial filtering and deterministic support-copy selection from Sanity content variants.
- [x] Root slug static generation expanded for `jasa-cetak-buku-<kota>` pages using deduplicated local dataset adapter
- [x] `layanan/[slug]` legacy Astro JSON pages now served from code-driven local adapter route with normalized section renderer (`agency-landing`, `biro-jasa-perizinan`, `jasa-pengukuhan-pkp`)
- Blocker note (2026-04-02): Remaining template refactors depend on final shared UI shell lock from orchestration (`docs/archive/2026-04-historical-plans/rewrite-worker-orchestration.md`) before broader homepage/blog/product rollout.

### D3. Content UX Upgrade
- [x] Improve readability modules (TOC, CTA in-content, related links, FAQ blocks).
  - Done for legacy rewrite clusters via reusable template sections (CTA, related links, FAQ, process/highlights). TOC remains pending for blog/product/service long-form templates.
- [x] Improve content differentiation across legacy clusters with slug-specific rewrite mapping (Wave 1 service-focused routes).
- [x] Complete rewrite coverage for previously generic route templates in legacy Wave 1 service/printing clusters.
- [x] Add richer conversion-oriented landing sections with iconography and visual proof blocks for legacy rewrite pages.
- [x] Add reusable long-guide section for rewrite pages to preserve and develop long-form legacy knowledge blocks (enabled for `cetak-buku`).
- [x] Add reusable micro-badge visual strip (`fast response`, `secure process`, `guarantee`, `nationwide delivery`, `custom request`) sourced from split pack and embedded in rewrite/legacy page shells.
- [x] Final CTA button label now reuses per-page copy (`copy.ctaLabel`) in both rewrite and legacy landing sections to keep UI/message parity across migrated money pages.
- [x] Rewrite/legacy landing sections now include additional mid-page conversion CTA block (`#cta-mid`) and expanded final CTA action set to increase action opportunities on commercial pages.
- [x] JSON-usaha service templates now include stronger conversion CTA placement (hero, service cards, mid CTA, pricing cards, FAQ closeout, final CTA fallback) plus intent-based copy normalization from local source parser.
- [x] Rewrite shared sections now include extra CTA placements in `highlights` and `process-faq` to reinforce conversion paths on money pages using reusable UI blocks.
- [x] Legacy rewrite content source is now registry-driven and split by cluster, reducing single-file coupling while preserving existing route/render contracts.
- [x] Legacy rewrite override maps are now separated per cluster so high-intent page tuning can be maintained without cross-domain merge noise.
- [x] `percetakan` cluster has started moving from cluster-branch content to page-specific modules for top anchor routes, establishing the per-page pattern for the next migration wave.
- [x] `percetakan` cluster now uses a split submodule layout for anchor pages, remaining detail presets, and city-intent overrides, reducing cluster-level file size and coupling.
- [x] `software` cluster now follows the same per-page module pattern for anchor routes and `sistem-pos`, with registry-level page resolution and a thinner cluster fallback builder.
- [x] `pembuatan-website` cluster has started following the same per-page module pattern for key money pages, with registry-level route resolution for anchor/index pages and a new `website-pages/*` content layer.
- [x] `pembuatan-website` non-city service routes are now almost fully page-module driven, so the cluster fallback is largely reserved for city templates and unforeseen slugs.
- [x] `pembuatan-website` parity refinement has begun at the content level, with page modules gradually absorbing Astro-specific business intent instead of only generic rewrite scaffolding.
- [x] Hybrid code-plus-Sanity pattern has a live demo route and a seeded Sanity page document, reducing ambiguity before deciding whether main cluster pages should stay code-owned, CMS-owned, or hybrid.
- [x] Homepage and primary landing shells now share one hybrid rendering contract (`/`, `/layanan`, `/pembuatan-website`, `/percetakan`, `/software`), reducing route-level divergence while keeping code-owned funnel sections where needed.
- [x] Main-route hybrid setup is now operationalized through a CLI scaffold with `main-landing` and `homepage` presets, making it faster to convert eligible routes without hand-crafting every Sanity page seed.
- [x] Homepage migration can now be rehearsed on a dedicated `/home-pepar` hybrid route seeded from the `homepage` preset, reducing pressure on the live `/` path during theme/content convergence.
- [x] Archive guidance is now explicit at `frontend/components/archive/README.md`, so the rewrite/hybrid stack remains the visible active source while historical component sets stay documented but quarantined.
- [x] Hybrid preset helpers now default internal links to `isExternal: false`, keeping generated Sanity data aligned with Studio link expectations during broader homepage and landing-page rollout.
- [x] GitHub Actions workflows now opt JavaScript actions into Node 24, reducing CI/deploy noise while the hybrid homepage and Studio schema rollout continues on `main`.
- [x] Core GitHub Actions references have also been moved forward (`actions/checkout@v6`, `actions/setup-node@v6`, `dorny/paths-filter@v4`) so the remaining CI warnings should be limited to vendor actions that have not yet published newer runtimes.
- [x] Existing Sanity `page` documents can now be audited and normalized for `_key` and `isExternal` consistency, and the current dataset has been brought back to zero findings after running the normalizer.
- [x] Custom Studio page document actions no longer rely on `useClient()`, reducing coupling to editor-only React contexts and preventing Task UI crashes while hybrid/page-to-post tools remain enabled.
- [x] `page`-specific Studio actions are temporarily rolled back from the active action registry so Task creation and core editing flows stay stable while the custom action API mismatch is debugged separately.
- [x] Studio core packages are now upgraded to `5.19.0`, so the hosted Studio can pick up newer Task/document runtime fixes after the custom-action rollback proved insufficient on its own.
- [x] `page`-specific Studio actions are now re-enabled on top of the upgraded `5.19.0` runtime, restoring the hybrid preset and page-to-post conversion workflow in Studio.
- [x] Historical migration planning docs and worker prompt files are now moved under `docs/archive/`, leaving `docs/` focused on current operational guidance and active workflows.
- [x] Rewrite landing sections now have stronger service/pricing interaction polish, and pricing cards can route package-specific WhatsApp leads through the shared global WhatsApp settings path.
- [x] Rewrite template UX now enforces a single CTA hierarchy and lane-aware closeout flow: quick links are capped to two, final CTA secondary actions are lane-specific, and raw location tokens are stripped from non-location routes before render.
- [x] Template-backed location/service route indexing state is now operationally normalized via a dedicated Sanity script, and the current active set has been patched from legacy `draft/noindex` flags to public `index` state.
- [x] The lane-aware template resolver now has an executable contract test entrypoint in `frontend`, reducing reliance on manual QA for pricing/proof/token guardrails after future schema or copy changes.
- [x] Reusable template copy is now better aligned to buyer-stage objections for website, printing, and software lanes, and service-intent descendants can use specific headline/intro/CTA/final-CTA wording instead of falling back to city/base messaging.
- [x] Legacy page override section-order customizations no longer reshape template-backed public pages, reducing structural drift between route descendants while preserving copy-level overrides.
- [x] `/home-pepar` has been rewritten away from prototype/internal explanatory language and now reads as a customer-facing homepage candidate that is materially closer to live use.
- [x] Printing rewrite modules are back to a deployable state after restoring the missing `buildGenericCopy` import for the company profile page module.
- [x] Netlify edge bundling compatibility hardening applied for Next proxy by explicitly setting proxy runtime to `edge`, avoiding `___netlify-edge-handler-node-middleware` CJS/ESM crash during build.
- [ ] Ensure internal linking slots are CMS-configurable.
- Blocker note (2026-04-02): Priority-1 illustration assets are generated but integration into live page sections/routes is still pending.
- Blocker note (2026-04-02): Regenerated `v2` assets are ready, but final selection/approval and route-level wiring are still pending.

## Workstream E - Redirect Deployment Strategy

### E1. Wave Rollout
- [ ] Wave 1: top traffic redirects only (safe subset).
- [ ] Wave 2: remaining validated auto redirects.
- [ ] Wave 3: curated manual redirects.
- Note: redirect rollout explicitly deferred until rewrite coverage for legacy Astro clusters is completed.

### E2. Post-wave Monitoring
- [ ] Check 404/redirect-chain loops.
- [ ] Check GSC coverage/index trend after each wave.
- [ ] Rollback rules prepared for bad mappings.

## Content Movement Mega Plan

### Source Buckets
- [x] Astro `posts/*.mdx` -> Sanity `post`
- [x] Astro `services/*.mdx` -> Sanity `service`
- [x] Astro `projects/*.mdx` -> Sanity `project`
- [ ] Legacy landing trees (`pembuatan-website`, `percetakan`, `software`, `layanan`) ->
  - keep-as-page OR merge-into-canonical OR redirect-only
- [x] Repo-local root-slug Astro pack `jasa-cetak-buku-kota` -> Sanity `page`

### Movement Checklist Per Item
- [ ] Normalize slug
- [ ] Set canonical target route
- [ ] Map category/taxonomy
- [ ] Rewrite title + meta + OG
- [ ] Add schema blocks needed
- [ ] Add internal links to canonical cluster
- [ ] Mark redirect old URL

## Execution Cadence

### Sprint 1 (Foundation)
- [ ] Freeze schema/query/route contracts
- [x] Start top-300 manual curation
- [x] Fix highest-impact non-200 pages

### Sprint 2 (Template + Metadata)
- [ ] Complete core template parity
- [x] Add Sanity template documents + template resolver for rewrite shells (hybrid-ready)
- [ ] Rewrite high-impression metadata batch
- [x] Deploy redirect wave 1

### Sprint 3 (Scale + Cleanup)
- [ ] Expand content movement long-tail
- [x] Deploy redirect wave 2-3
- [ ] Stabilize index coverage and remove residual gaps

## Risks & Controls

- Risk: redirect ke halaman intent tidak cocok -> Control: mandatory intent QA for high-impression URLs.
- Risk: schema/query mismatch after refactor -> Control: studio/frontend sync check in each PR.
- Risk: quota limits for URL inspection -> Control: schedule inspection in batches and cache results.

## Tracking Files

- Migration mapping data:
  - `frontend/tmp/gsc-kotacom-full-sitemap0/gsc-migration-curation.csv`
  - `frontend/tmp/gsc-kotacom-full-sitemap0/gsc-redirect-auto-top1000.csv`
  - `frontend/tmp/gsc-kotacom-full-sitemap0/gsc-manual-priority-top300.csv`
- Plan and execution docs:
  - `docs/archive/2026-04-historical-plans/astro-to-next-migration-plan.md`
  - `docs/astro-migration-megaplan.md`
  - `docs/seo-updates.md`

- [x] **Template System Complete (2026-04-05):**
  - Template base structure with E-E-A-T section
  - Auto location injection via {lokasi} token in all content fields
  - Auto route generation from routePattern + location.slug
  - Generic Company template variant added
  - Complete seed data with production-ready content (all fields filled)
  - All links use isExternal format (prevents validation errors)
  - SEO keyword clustering (4-5 location-aware variations per template)
  - Auto WA CTA buttons distributed in Pricing, Features, and Proof sections
  - Editors can use templates immediately without filling from scratch
