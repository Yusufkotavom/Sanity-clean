#!/usr/bin/env node
/**
 * Bulk OG Image Generator
 * Finds pages/posts without feature images, generates OG images, uploads to Sanity.
 *
 * Usage:
 *   node scripts/bulk-og-generate.mjs [--write] [--type post] [--limit 10]
 *
 * Flags:
 *   --write   Actually upload and patch (dry-run by default)
 *   --type    Filter by document type (post, page, product, service, project)
 *   --limit   Max documents to process
 */

import { createClient } from "@sanity/client";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ww3aejg2";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "development";
const TOKEN = process.env.SANITY_EDITOR_TOKEN || process.env.SANITY_AUTH_TOKEN || process.env.SANITY_DEV;
const SITE_URL = process.env.SITE_URL || "https://sanity-nextjs-kotacom.vercel.app";

if (!TOKEN) {
  console.error("Missing SANITY_AUTH_TOKEN or SANITY_DEV env var");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2026-04-21",
  token: TOKEN,
  useCdn: false,
});

const args = process.argv.slice(2);
const write = args.includes("--write");
const typeIdx = args.indexOf("--type");
const limitIdx = args.indexOf("--limit");
const filterType = typeIdx !== -1 ? args[typeIdx + 1] : null;
const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : 50;

const TYPES = ["post", "page", "product", "service", "project"];
const targetTypes = filterType ? [filterType] : TYPES;

async function findDocsWithoutImage(types) {
  const filter = types.map((t) => `_type == "${t}"`).join(" || ");
  const query = `*[(${filter}) && defined(slug.current) && !defined(image.asset)][0...${limit}]{
    _id, _type, title, "slug": slug.current
  }`;
  return client.fetch(query);
}

async function generateOgImage(title, badge) {
  const params = new URLSearchParams({ title });
  if (badge) params.set("badge", badge);
  const url = `${SITE_URL}/api/og?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`OG gen failed: ${res.status} for "${title}"`);
  return Buffer.from(await res.arrayBuffer());
}

async function uploadAndPatch(doc, imageBuffer) {
  const filename = `og-${doc._type}-${doc.slug || doc._id}.png`;

  const asset = await client.assets.upload("image", imageBuffer, {
    filename,
    contentType: "image/png",
  });

  await client
    .patch(doc._id)
    .set({
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: doc.title || "",
      },
    })
    .commit();

  return asset._id;
}

async function main() {
  console.log(`Mode: ${write ? "WRITE" : "DRY-RUN"}`);
  console.log(`Types: ${targetTypes.join(", ")} | Limit: ${limit}\n`);

  const docs = await findDocsWithoutImage(targetTypes);
  console.log(`Found ${docs.length} documents without feature image.\n`);

  if (docs.length === 0) return;

  for (const doc of docs) {
    const badge = doc._type === "post" ? "Blog" : doc._type;
    const title = doc.title || doc.slug || "Untitled";

    if (!write) {
      console.log(`[DRY] ${doc._type} | ${doc.slug} | "${title}"`);
      continue;
    }

    try {
      console.log(`Generating: ${doc._type} | ${doc.slug}...`);
      const buffer = await generateOgImage(title, badge);
      const assetId = await uploadAndPatch(doc, buffer);
      console.log(`  ✓ Uploaded ${assetId} → patched ${doc._id}`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
