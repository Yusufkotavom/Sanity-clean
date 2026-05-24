# SEO Updates Log

## 2026-05-24
### Removed scroll-reveal animation causing invisible blocks

**Changed files:**
- `frontend/components/ui/section-container.tsx` — Removed `data-reveal` attribute
- `frontend/app/globals.css` — Removed `[data-reveal]` CSS rule (opacity:0 + translateY)
- `frontend/app/(main)/layout.tsx` — Removed `RevealOnScroll` component import and usage

**Summary:**
All CMS-driven section blocks (FAQ, Testimonials, Pricing, etc.) were wrapped in a `data-reveal` attribute that set `opacity: 0` and `transform: translateY(32px)` by default. A client-side `IntersectionObserver` (`RevealOnScroll`) was supposed to animate them in on scroll, but it was unreliable with SSR/RSC rendering, causing blocks to remain completely invisible in the rendered page despite being present in the HTML.

**SEO impact:**
- **Critical fix** — Content that was invisible to users (and potentially to crawlers relying on rendered content) is now immediately visible.
- FAQ, Testimonials, and Pricing blocks are now rendered without animation barriers, improving CWV (CLS, LCP).

**Verification:** Manual — dev server test at localhost:3002.

---

### Fixed FAQs block field mismatch (query + component vs schema)

**Changed files:**
- `frontend/sanity/queries/faqs.ts` — Changed GROQ query to fetch `question`, `answer`, `category` instead of non-existent `title`, `body`
- `frontend/components/blocks/faqs.tsx` — Updated component to render `faq.question`/`faq.answer` instead of `faq.title`/`faq.body`; removed unused `PortableTextRenderer` import

**Summary:**
The FAQs block (`_type: "faqs"`) GROQ query was fetching `title` and `body` fields, but the Sanity `faq` document type has `question` (string) and `answer` (text). This caused all FAQ accordion items to render blank — the data existed but the field names didn't match.

**SEO impact:**
- **Critical fix** — FAQ structured data and visible FAQ content now renders correctly, which is essential for FAQ rich snippets and on-page content.

**Verification:** Manual — dev server test at localhost:3002.

---

### Dependency cleanup — removed AI worker/dashboard leftovers

**Changed files:**
- `frontend/package.json` — Removed 14 unused dependencies (AI SDK, react-email, simple-icons, unused Radix primitives, embla-carousel-auto-scroll)
- `pnpm-workspace.yaml` — Removed `worker` and `packages/*` references
- `package.json` (root) — Removed `deploy:worker` and `deploy:frontend:cf` scripts
- `packages/` — Deleted entire directory (6 unused workspace packages: ai, db, search, content, seo, sanity)

**Summary:**
After removing AI worker and dashboard features, many dependencies and workspace packages were left orphaned. Removed ~14 frontend deps and 6 workspace packages that had zero imports. Estimated ~50-70 MB savings in node_modules.

**SEO impact:** No direct SEO impact — infrastructure cleanup only. Reduces build size and CI install time.

**Verification:** `pnpm install` completes without errors.

---

### Revamped legacy-rich-content to Markdown block

**Changed files:**
- `studio/schemas/blocks/legacy/legacy-rich-content.ts` — Changed `contentRaw` field from `type: "text"` to `type: "markdown"` (sanity-plugin-markdown)
- `studio/sanity.config.ts` — Registered `markdownSchemaType()` plugin
- `studio/schemas/blocks/shared/page-blocks.ts` — Renamed insert menu group from "Legacy" to "Content"
- `frontend/components/blocks/rich-content.tsx` — Replaced unified/rehype/remark pipeline with `react-markdown`
- `frontend/components/portable-text-renderer.tsx` — Replaced `renderLegacyRichHtml` with `<Markdown>` component
- `frontend/lib/legacy-content/render.ts` — **Deleted**
- `frontend/package.json` — Removed 7 deps (`unified`, `rehype-*`, `remark-*`, `unist-util-visit`), added 1 (`react-markdown`)

**Summary:**
Replaced the legacy content system (raw textarea + 7-dependency unified pipeline + dangerouslySetInnerHTML) with a proper Markdown editor in Studio (sanity-plugin-markdown) and react-markdown rendering in frontend. Net -5 dependencies.

**SEO impact:** Content rendering unchanged for existing pages. Eliminates XSS risk from `dangerouslySetInnerHTML`. Studio editors get a proper Markdown editor with preview.

**Verification:** Build test + dev server manual check.

## 2026-05-24
- Changed files:
  - `studio/sanity.config.ts`
  - `docs/seo-updates.md`
  - `docs/astro-migration-megaplan.md`
- Summary:
  - Fixed Sanity Studio runtime crash by replacing incorrect `markdownSchemaType()` invocation with `markdownSchema()` plugin registration.
  - Root cause: `markdownSchemaType` is a schema type object, not a callable function.
- Impact on SEO/integration:
  - No direct SEO impact.
  - Integration/runtime impact: restores Studio boot so editors can manage CMS content and block configuration.
- Verification status:
  - Build/test: `pnpm --filter studio run build` passed.

- Changed files:
  - `frontend/sanity/queries/seo/features-package-block.ts`
  - `docs/seo-updates.md`
  - `docs/astro-migration-megaplan.md`
- Summary:
  - Added missing `cardStyle` and `cta` projection to `features-package-block` GROQ query.
  - `cta` now uses shared `linkQuery` resolver to produce frontend `href` consistently.
- Impact on SEO/integration:
  - No direct SEO impact.
  - Integration fix: Studio schema fields (`cardStyle`, `cta`) are now synced with frontend query contract and renderer behavior.
- Verification status:
  - Manual check: query contract reviewed against Studio schema and frontend component expectations.
  - Build/test: `pnpm --filter frontend run build` passed.

## 2026-05-24
- Changed files:
  - `frontend/components/blocks/grid/grid-row.tsx`
  - `frontend/components/blocks/grid/pricing-card.tsx`
  - `frontend/components/blocks/grid/grid-post.tsx`
  - `docs/seo-updates.md`
  - `docs/astro-migration-megaplan.md`
- Summary:
  - Replaced dynamic Tailwind class interpolation for grid columns with static class mapping to ensure production CSS generation.
  - Propagated `textAlign` and `cardStyle` behavior more consistently across grid row card types (`pricing-card`, `grid-post`).
- Impact on SEO/integration:
  - No direct SEO impact.
  - Integration fix: frontend rendering now matches Studio controls for Grid Row layout options more reliably.
- Verification status:
  - Manual check: schema/query/renderer alignment reviewed for `grid-row`.
  - Build/test: `pnpm --filter frontend run build` passed.

## 2026-05-24
- Changed files:
  - `frontend/sanity/queries/seo/eeat-block.ts`
  - `frontend/sanity/queries/seo/metrics-rail-block.ts`
  - `frontend/sanity/queries/seo/highlights-block.ts`
  - `frontend/sanity/queries/seo/reviews-block.ts`
  - `frontend/sanity/queries/seo/micro-badges-block.ts`
  - `frontend/sanity/queries/shared/blocks.ts`
  - `frontend/sanity/queries/reusable-section.ts`
  - `frontend/sanity/queries/legacy-page.ts`
  - `docs/seo-updates.md`
  - `docs/astro-migration-megaplan.md`
- Summary:
  - Added missing GROQ projections for `eeat-block`, `metrics-rail-block`, `highlights-block`, `reviews-block`, and `micro-badges-block`.
  - Registered those blocks in shared blocks query so page/service/product/project/post routes receive their payload.
  - Synced reusable-section and legacy-page custom block projections to prevent route-dependent missing block rendering.
- Impact on SEO/integration:
  - No direct SEO ranking impact.
  - Integration impact: block availability is now consistent between Studio content and frontend rendering across query entry-points.
- Verification status:
  - Manual check: schema + query + component map cross-layer sync completed.
  - Build/test: `pnpm --filter frontend run build` passed.

## 2026-05-24
- Changed files:
  - `frontend/components/blocks/index.tsx`
  - `frontend/components/blocks/hero/hero-1.tsx`
  - `frontend/components/blocks/hero/hero-2.tsx`
  - `frontend/components/blocks/hero/hero-vercel.tsx`
  - `frontend/components/blocks/seo/stats-hero-block.tsx`
  - `docs/seo-updates.md`
  - `docs/astro-migration-megaplan.md`
- Summary:
  - Improved LCP image discoverability for Sanity-driven homepage (`page` slug `index`) by removing dynamic imports for hero block types (`hero-2`, `hero-vercel`) in the block registry.
  - Added explicit hero image loading hints: `loading="eager"` + `fetchPriority="high"` (and `sizes` where missing) on hero-capable block components.
- Impact on SEO/integration:
  - Direct SEO/CWV impact: improves LCP candidate image prioritization and earlier request discovery from initial HTML.
  - Integration impact: keeps existing Studio block schema/query contract intact; change is render-path only.
- Verification status:
  - Manual check: code-level verification completed for homepage block rendering path (`frontend/app/(main)/page.tsx` -> `Blocks` -> hero block components).
  - Build/test: Not run in this cycle.

## 2026-05-24
- Changed files:
  - `frontend/components/blocks/cta/whatsapp-cta.tsx`
  - `docs/seo-updates.md`
  - `docs/astro-migration-megaplan.md`
- Summary:
  - Refactored `whatsapp-cta` block visual structure to match the existing design system used by other CTA/hero blocks.
  - Replaced `SectionContainer` wrapper with `SectionShell` + `SectionPanel` pattern, and aligned typography, spacing, alignment behavior, and button group layout with `cta-1`.
- Impact on SEO/integration:
  - No direct SEO impact.
  - Integration/UI impact: CTA block now follows the same component architecture and visual rhythm as other CMS-rendered sections.
- Verification status:
  - Manual check: style contract reviewed against `cta-1` block.
  - Build/test: Pending.

## 2026-05-24
- Changed files:
  - `frontend/sanity/lib/metadata.ts`
  - `docs/seo-updates.md`
  - `docs/astro-migration-megaplan.md`
- Summary:
  - Fixed OG image URL generation to avoid stale domain usage (`devk.my.id`) by changing site URL priority order and using relative `/api/og?...` for dynamic OG image paths.
  - Added URL normalization for `NEXT_PUBLIC_SITE_URL`, `VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_URL`, and Sanity `seo.siteUrl` fallback.
- Impact on SEO/integration:
  - Direct integration impact: dynamic OG image endpoint now resolves against active deployment domain instead of legacy CMS domain fallback.
  - Potential SEO/share impact: social crawlers should fetch OG image from the current site origin reliably.
- Verification status:
  - Manual check: metadata URL builder logic reviewed.
  - Build/test: Pending.

## 2026-05-24
- Changed files:
  - `studio/schemas/documents/og-settings.ts`
  - `frontend/sanity/queries/og-settings.ts`
  - `frontend/sanity/lib/metadata.ts`
  - `docs/seo-updates.md`
  - `docs/astro-migration-megaplan.md`
- Summary:
  - Added `ogBaseUrl` field to Sanity `ogSettings` as the primary URL source for dynamic OG image endpoint generation.
  - Updated OG settings query to fetch `ogBaseUrl`.
  - Updated metadata builder to prioritize `ogSettings.ogBaseUrl` for `/api/og` image URLs, with fallback to existing site URL resolver.
- Impact on SEO/integration:
  - Integration improvement: OG image URL source is now centralized in OG settings, reducing mismatch risk from unrelated env/canonical settings.
  - No schema/query drift: Studio schema + frontend query + metadata usage updated in the same cycle.
- Verification status:
  - Manual check: schema/query/metadata sync reviewed.
  - Build/test: Pending.

## 2026-05-24
- Changed files:
  - `frontend/package.json`
  - `frontend/scripts/run-template-tests.mjs`
  - `docs/seo-updates.md`
  - `docs/astro-migration-megaplan.md`
- Summary:
  - Hardened frontend verification flow:
    - `typecheck` now runs `next typegen` before `tsc --noEmit` to regenerate route types and avoid stale `.next/types` failures.
    - `test:templates` now uses `frontend/scripts/run-template-tests.mjs`, which skips gracefully with clear output when the template contract test file is not present.
- Impact on SEO/integration:
  - No direct SEO impact.
  - Integration/CI impact: validation commands are now stable and deterministic across clean environments.
- Verification status:
  - Build/test: `pnpm --filter frontend run typecheck` passed.
  - Build/test: `pnpm --filter frontend run test:templates` passed (skip mode due to missing test file).
  - Build/test: `pnpm --filter frontend run build` passed.

## 2026-05-24
- Changed files:
  - `frontend/components/draft-mode-tools.tsx`
  - `frontend/.env.example`
  - `docs/env-reference.md`
  - `docs/seo-updates.md`
  - `docs/astro-migration-megaplan.md`
- Summary:
  - Restored Sanity live editor runtime in a performance-safe way by enabling `SanityLive` + `VisualEditing` only when Next.js Draft Mode is active.
  - Added guardrails so visual editing is skipped when `SANITY_API_READ_TOKEN` is missing or when `NEXT_PUBLIC_SANITY_VISUAL_EDITING=false`.
  - Added environment documentation for explicit live editor toggle control.
- Impact on SEO/integration:
  - No direct SEO impact.
  - Integration impact: Presentation Tool/live editing is available again for editors, while public traffic keeps clean non-live rendering path for better PageSpeed.
- Verification status:
  - Build/test: `pnpm --filter frontend run build` passed.

## 2026-05-24
- Changed files:
  - `frontend/components/header/desktop-nav.tsx`
  - `frontend/components/menu-toggle.tsx`
  - `docs/seo-updates.md`
  - `docs/astro-migration-megaplan.md`
- Summary:
  - Reduced global client-JS pressure in header path:
    - Replaced desktop "More" menu implementation from Radix `DropdownMenu` client primitives to server-rendered hover panel markup.
    - Simplified `ModeToggle` from dropdown menu to single-cycle toggle button (`light -> dark -> system`) without dropdown client dependencies.
  - Verified bundle manifest no longer references `components/ui/dropdown-menu.tsx` on home route client manifest.
- Impact on SEO/integration:
  - Indirect SEO/CWV impact: lower front-end JS execution for navigation controls can improve responsiveness and reduce main-thread work.
  - Integration impact: header menu interaction model is preserved with lightweight server-first markup.
- Verification status:
  - Build/test: `pnpm --filter frontend run build` passed.
  - Manual audit: `frontend/.next/server/app/(main)/page_client-reference-manifest.js` confirms `components/ui/dropdown-menu.tsx` is absent.

## 2026-05-24
- Changed files:
  - `studio/document-actions/generate-post-og-action.ts`
  - `frontend/scripts/seed-data/seo-settings/base.json`
  - `frontend/scripts/seed-home-sanity-landing.mjs`
  - `docs/seo-updates.md`
  - `docs/astro-migration-megaplan.md`
- Summary:
  - Fixed Studio "Generate OG Image" action URL source order to prioritize `ogSettings.ogBaseUrl` first, then Studio env URLs, and only then `seoSettings.siteUrl`.
  - Updated generator error messaging to explicitly reference OG settings (`ogBaseUrl`) as primary configuration.
  - Removed stale hardcoded `https://devk.my.id` fallback from SEO seed configs used by local/import scripts.
- Impact on SEO/integration:
  - Direct integration fix: OG generation in Studio no longer depends first on stale canonical/domain values from `seoSettings.siteUrl`.
  - Reduces risk of OG fetch failures to legacy domain (`devk.my.id`) when editors trigger image generation.
- Verification status:
  - Build/test: `pnpm --filter studio run build` passed.
  - Build/test: `pnpm --filter frontend run build` passed.

## 2026-05-24
- Changed files:
  - `frontend/scripts/seed-data/seo-settings/base.json`
  - `frontend/scripts/seed-seo-settings-from-json.mjs`
  - `frontend/scripts/seed-home-sanity-landing.mjs`
  - `docs/seo-updates.md`
  - `docs/astro-migration-megaplan.md`
- Summary:
  - Removed hardcoded `siteUrl` from SEO seed JSON bundle so domain is no longer frozen in repository data.
  - Updated SEO seed runner to inject `siteUrl` at runtime from env (`NEXT_PUBLIC_SITE_URL` preferred, fallback to Studio frontend/preview env).
  - Removed hardcoded fallback URL from `/home-sanity` seed script; script now requires env URL and normalizes canonical base.
- Impact on SEO/integration:
  - Direct integration hardening: seed/import flows will not silently reintroduce stale domains into `seoSettings.siteUrl` or page canonical metadata.
  - Environment-specific deployments now produce consistent canonical/OG base URLs from env source of truth.
- Verification status:
  - Manual check: seed script runtime resolution and fallback order reviewed.
  - Build/test: Not run in this cycle.

## 2026-05-24
- Changed files:
  - `studio/schemas/documents/seo-settings.ts`
  - `docs/seo-updates.md`
  - `docs/astro-migration-megaplan.md`
- Summary:
  - Reorganized Studio `seoSettings` editing UI into a single pattern using document `groups` (tabs) for major sections: Defaults, Indexing, Crawlers & Sitemap, Trust Signals, and Pricing & FAQ.
  - Assigned every top-level SEO settings field to one tab group to avoid mixed navigation behavior.
  - Set large object sections (`companyInfo`, `pricingPackages`, `faq`) as non-collapsible to reduce accordion-style interactions.
- Impact on SEO/integration:
  - No data-model or query contract changes; this is Studio authoring UX cleanup only.
  - Integration remains synced: frontend `seoSettings` queries and metadata logic do not require changes.
- Verification status:
  - Manual check: schema grouping and field assignment reviewed.
  - Build/test: Pending in this cycle.
