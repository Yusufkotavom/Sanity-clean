# SEO & Repository Updates Log

## 2026-05-22 (2) — Layout SSG Fix

**Changed files:**
- `frontend/app/(main)/layout.tsx`
- `frontend/components/draft-mode-tools.tsx` (new)
- `frontend/components/reusable-slot-client.tsx` (new)
- `frontend/components/portable-text-renderer.tsx`
- `frontend/sanity/lib/image.ts`
- `frontend/sanity/lib/metadata.ts`

**Summary:**
Removed `draftMode()` and `headers()` calls from the main layout, which were forcing ALL routes to be dynamically rendered. Replaced with:
- `DraftModeTools` — server component wrapped in `<Suspense>` that only renders draft UI when draft mode cookie is active
- `ReusableSlotClient` — client component using `usePathname()` instead of `headers()` for route-based section filtering

Also fixed null asset crashes exposed by SSG pre-rendering:
- `PortableTextRenderer`: added null guard for `value.asset` in image block type
- `urlFor`: returns empty builder when `source.asset` is null
- `metadata.ts`: checks `?.asset` before calling `urlFor`

**SEO/Integration impact:** MAJOR. Nearly all routes changed from Dynamic (ƒ) to Static (○) or SSG (●). Pages are now pre-rendered at build time — faster TTFB, better Core Web Vitals, reduced server load. Blog, products, services, projects all SSG.

**Verification:** Build passes (58/58 static pages generated). TypeScript zero errors.

---

## 2026-05-22 (1) — Grid Row Layout Options

**Changed files:**
- `studio/schemas/blocks/grid/grid-row.ts`
- `frontend/sanity/queries/grid/grid-row.ts`
- `frontend/components/blocks/grid/grid-row.tsx`
- `frontend/components/blocks/grid/grid-card.tsx`
- `frontend/sanity.types.ts`

**Summary:**
Added `textAlign` (left/center) and `cardLayout` (vertical/horizontal) fields to the `grid-row` Sanity schema block. The GridRow component now passes these props to child components. GridCard supports:
- `textAlign: "center"` — centers text, icon, and CTA button
- `cardLayout: "horizontal"` — renders icon on the left with text on the right (flex row)

**SEO/Integration impact:** No direct SEO impact. UI-only layout options for content editors.

**Verification:** TypeScript compiles with zero errors (`tsc --noEmit` passes).
