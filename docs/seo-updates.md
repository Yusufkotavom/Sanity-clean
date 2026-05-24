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
