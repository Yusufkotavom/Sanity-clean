import fs from "node:fs/promises";
import path from "node:path";
import { createSanityWriteClient, loadSanityEnv } from "./lib/sanity-page-guards.mjs";

const DATA_DIR = path.resolve(process.cwd(), "scripts/seed-data/seo-settings");
const FILES = [
  "base.json",
  "pricing-packages.json",
  "testimonials.json",
  "faq.json",
];

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeDeep(target, source) {
  const output = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (Array.isArray(value)) {
      output[key] = value;
      continue;
    }
    if (isObject(value) && isObject(output[key])) {
      output[key] = mergeDeep(output[key], value);
      continue;
    }
    output[key] = value;
  }
  return output;
}

function withKeysForArray(items, prefix) {
  return (items || []).map((item, index) => ({
    _key: item?._key || `${prefix}-${index + 1}`,
    ...item,
  }));
}

function normalizeSeoPayload(payload) {
  const next = { ...payload };

  if (Array.isArray(next.testimonials)) {
    next.testimonials = withKeysForArray(next.testimonials, "testimonial");
  }

  if (isObject(next.pricingPackages)) {
    next.pricingPackages = {
      website: withKeysForArray(next.pricingPackages.website, "pricing-website"),
      software: withKeysForArray(next.pricingPackages.software, "pricing-software"),
      printing: withKeysForArray(next.pricingPackages.printing, "pricing-printing"),
    };
  }

  if (isObject(next.faq)) {
    next.faq = {
      website: withKeysForArray(next.faq.website, "faq-website"),
      software: withKeysForArray(next.faq.software, "faq-software"),
      printing: withKeysForArray(next.faq.printing, "faq-printing"),
    };
  }

  return next;
}

function normalizeSiteUrl(value) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\/+$/, "");
}

async function loadJson(file) {
  const filePath = path.join(DATA_DIR, file);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function run() {
  const write = process.argv.includes("--write");
  const client = await createSanityWriteClient();
  const env = await loadSanityEnv();

  let merged = {};
  for (const file of FILES) {
    const data = await loadJson(file);
    merged = mergeDeep(merged, data);
  }

  const payload = normalizeSeoPayload(merged);
  const resolvedSiteUrl = normalizeSiteUrl(
    env.NEXT_PUBLIC_SITE_URL || env.SANITY_STUDIO_FRONTEND_URL || env.SANITY_STUDIO_PREVIEW_URL,
  );

  if (resolvedSiteUrl) {
    payload.siteUrl = resolvedSiteUrl;
  } else {
    delete payload.siteUrl;
    console.warn(
      "⚠️ siteUrl not set: define NEXT_PUBLIC_SITE_URL (preferred) or SANITY_STUDIO_FRONTEND_URL/SANITY_STUDIO_PREVIEW_URL.",
    );
  }

  if (!write) {
    console.log("DRY RUN: seoSettings payload prepared");
    console.log(
      JSON.stringify(
        {
          files: FILES,
          resolvedSiteUrl: payload.siteUrl || null,
          keys: Object.keys(payload),
          testimonials: payload.testimonials?.length || 0,
          pricing: {
            website: payload.pricingPackages?.website?.length || 0,
            software: payload.pricingPackages?.software?.length || 0,
            printing: payload.pricingPackages?.printing?.length || 0,
          },
          faq: {
            website: payload.faq?.website?.length || 0,
            software: payload.faq?.software?.length || 0,
            printing: payload.faq?.printing?.length || 0,
          },
        },
        null,
        2
      )
    );
    console.log("Run with --write to upsert seoSettings.");
    return;
  }

  const docId = "seoSettings";

  await client
    .transaction()
    .createIfNotExists({
      _id: docId,
      _type: "seoSettings",
    })
    .patch(docId, {
      set: payload,
    })
    .commit();

  console.log(`✅ Upserted seoSettings (${docId}) from JSON bundle`);
}

run().catch((error) => {
  console.error("❌ Failed to seed seoSettings from JSON:", error);
  process.exitCode = 1;
});
