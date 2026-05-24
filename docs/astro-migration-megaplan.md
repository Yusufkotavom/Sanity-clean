# Astro Migration Megaplan

## Current Status Snapshot (Already Done)
- [x] Synced `features-package-block` query contract with Studio schema for `cardStyle`.
- [x] Synced `features-package-block` query contract with Studio schema for `cta`.
- [x] Confirmed renderer path `frontend/components/blocks/seo/features-package-block.tsx` already consumes both fields.
- [x] Fixed `grid-row` column class generation by replacing dynamic Tailwind interpolation with static mapping.
- [x] Extended `grid-row` alignment/style behavior to additional card types used in mixed rows.
- [x] Added missing query coverage for `eeat-block`, `metrics-rail-block`, `highlights-block`, `reviews-block`, and `micro-badges-block`.
- [x] Unified block projections across shared, reusable-section, and legacy-page query entry-points.
- [x] Fixed Studio runtime plugin registration for markdown schema (`markdownSchema()`), removing boot-time `is not a function` crash.

## Workstream TODO
- [x] Fix mismatch that forced `Features / Value Props` layout to always render as grid.
- [x] Fix missing CTA payload for `Features / Value Props` block.
- [x] Run full frontend build/test verification after query sync.
- [x] Re-run frontend build after multi-query block coverage updates.
- [x] Re-run Studio build after markdown plugin registration fix.

## Blockers
- None.
