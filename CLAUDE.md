# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **PNPM monorepo** containing a Next.js frontend with Sanity CMS backend, designed as a Schema UI starter template. The project uses a composable block-based architecture where content is structured as reusable blocks in Sanity and rendered as React components.

## Workspace Structure

- `frontend/` - Next.js 16 application with App Router
- `studio/` - Sanity Studio v5 for content management  
- `worker/` - Cloudflare Worker for SEO operations
- `packages/` - Shared packages (if any)

## Development Commands

### Root Level Commands
```bash
# Install all dependencies
pnpm install

# Run all apps in parallel
pnpm dev

# Run specific workspace
pnpm dev:frontend
pnpm dev:studio

# Type generation and checking
pnpm typegen        # Generate Sanity types
pnpm typecheck      # Check TypeScript

# Export Sanity data
pnpm export
```

### Frontend Commands (from root or frontend/)
```bash
# Development
pnpm dev            # Start dev server on port 3000
pnpm build          # Production build
pnpm start          # Start production server
pnpm lint           # ESLint

# Content operations
pnpm docs:scrape    # Scrape SchemaUI docs
pnpm sanity:pages:audit         # Audit page arrays
pnpm sanity:pages:normalize     # Normalize page arrays
pnpm sanity:seed:example        # Seed example data
pnpm sanity:bulk:delete         # Bulk delete by query
pnpm hybrid:create              # Create hybrid page
pnpm page:to-post              # Convert page to post

# Testing
pnpm test:templates # Test template resolver contracts

# SEO/Performance
pnpm psi:batch      # PageSpeed Insights batch analysis
```

### Studio Commands (from root or studio/)
```bash
pnpm dev            # Start Studio dev server
pnpm build          # Build Studio
pnpm deploy         # Deploy to Sanity hosting
pnpm typegen        # Generate TypeScript types
```

### Worker Commands (from worker/)
```bash
pnpm dev            # Start Cloudflare Worker dev
pnpm deploy         # Deploy to Cloudflare
```

## Architecture

### Block-Based Content System

The project uses a composable block architecture:

1. **Schema Definition**: Each block is defined as a Sanity schema type in `studio/schemas/blocks/`
2. **Component Mapping**: React components in `frontend/components/blocks/` correspond to schema types
3. **Dynamic Rendering**: Parent blocks use `componentMap` objects to render child components dynamically
4. **Type Safety**: TypeScript ensures type safety between Sanity queries and React components

### Key Patterns

**Component Map Pattern**:
```tsx
const componentMap: {
  [K in ChildType["_type"]]: React.ComponentType<Extract<ChildType, { _type: K }>>;
} = {
  "child-type-1": ChildComponent1,
  "child-type-2": ChildComponent2,
};
```

**Query Composition**: GROQ queries are modular, with separate fragments for each block type that compose into main page queries.

**Schema Organization**: 
- `schemas/blocks/` - Block components (hero, grid, split, etc.)
- `schemas/documents/` - Document types (page, post, etc.)
- `schemas/objects/` - Reusable object types
- `schemas/shared/` - Shared schema utilities

### Frontend Structure

- `app/(main)/` - Main site routes using Next.js App Router
- `components/blocks/` - Block components matching Sanity schemas
- `sanity/` - Sanity client configuration and queries
- `lib/` - Utility functions and shared logic

### Content Types

Primary document types:
- `page` - Static pages with block-based content
- `post` - Blog posts
- `product` - Product pages
- `service` - Service pages
- `settings` - Site-wide settings (singleton)
- `navigation` - Navigation structure (singleton)

## Environment Setup

Copy environment templates:
```bash
cp frontend/.env.example frontend/.env
cp studio/.env.example studio/.env
```

Key environment variables:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Dataset name (production/development)
- `SANITY_API_READ_TOKEN` - Read token for draft content
- `REVALIDATE_SECRET` - Webhook revalidation secret

## Deployment

### Cloudflare Pages (Recommended)
- **Frontend**: Build command `pnpm build`, output `.next`, root `frontend/`
- **Studio**: Build command `pnpm build`, output `dist`, root `studio/`

### Netlify Alternative
- Uses `netlify.toml` configuration
- Deploys frontend by default
- Requires Next.js Runtime plugin

## Schema UI Conventions

### Schema Types
- Use `defineType`, `defineField`, `defineArrayMember` helpers
- Include Lucide React icons for all types
- Implement custom `preview` properties
- Use `groups` for complex schemas
- Avoid boolean fields - use string fields with options.list
- Always use arrays for references, never single reference fields

### GROQ Queries
- Use SCREAMING_SNAKE_CASE for query variables
- Tag with `groq` function from next-sanity
- Write modular query fragments for each block type
- Use parameters instead of string interpolation
- Include asset metadata for images

### Component Implementation
- Match schema types exactly with TypeScript
- Use `stegaClean` from next-sanity for values
- Implement componentMap pattern for dynamic rendering
- Extract types from Sanity query results

## Content Management

### Bulk Operations
Scripts available for content management:
- Page array normalization
- Template conversion
- Navigation migration
- Bulk deletion by GROQ query

### SEO Operations
- SEO dashboard at `/dashboard/seo/`
- Automated indexing via Cloudflare Worker
- Google Search Console integration
- PageSpeed Insights batch analysis

## Testing

- Template resolver contract tests in `tests/`
- Run with `pnpm test:templates`
- Uses tsx for TypeScript execution

## Important Files

- `frontend/next.config.mjs` - Next.js configuration with Sanity redirects
- `studio/sanity.config.ts` - Studio configuration with plugins
- `pnpm-workspace.yaml` - Workspace definition
- `.cursor/rules/` - Development guidelines and patterns