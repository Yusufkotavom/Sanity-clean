#!/usr/bin/env node
import fs from "node:fs/promises";
import {
  createSanityReadClient,
  createSanityWriteClient,
  normalizeLinkObject,
} from "./lib/sanity-page-guards.mjs";

const TYPE_CONFIG = {
  post: { requireSlug: true, requireTitle: true },
  service: { requireSlug: true, requireTitle: true },
  product: { requireSlug: true, requireTitle: true },
  project: { requireSlug: true, requireTitle: true },
  page: { requireSlug: true, requireTitle: false },
  category: { requireSlug: true, requireTitle: true },
  pageTemplate: { requireSlug: true, requireTitle: true },
  redirect: { requireSlug: false, requireTitle: false, requireSource: true },
};

const SUPPORTED_TYPES = new Set(Object.keys(TYPE_CONFIG));

function printHelp() {
  console.log(`Usage:
  pnpm --filter frontend run sanity:content:create -- --type=post --input=./payload.json
  pnpm --filter frontend run sanity:content:create -- --type=service --stdin

Options:
  --type=<${Array.from(SUPPORTED_TYPES).join("|")}>
  --input=<path>       Read JSON payload from file
  --stdin              Read JSON payload from stdin
  --write              Actually write to Sanity (default dry-run)
  --mode=<create|upsert>  create: fail when slug exists, upsert: overwrite existing doc
  --draft              Write to draft id (drafts.<id>)
  --id=<doc-id>        Override target _id (public id cannot contain dots)
  --help               Show this help
`);
}

function parseArgs(argv) {
  const args = {
    write: false,
    mode: "create",
    useStdin: false,
    draft: false,
  };

  for (const arg of argv) {
    if (arg === "--write") args.write = true;
    else if (arg === "--stdin") args.useStdin = true;
    else if (arg === "--draft") args.draft = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg.startsWith("--input=")) args.input = arg.slice("--input=".length).trim();
    else if (arg.startsWith("--mode=")) args.mode = arg.slice("--mode=".length).trim();
    else if (arg.startsWith("--id=")) args.id = arg.slice("--id=".length).trim();
    else if (arg.startsWith("--type=")) args.type = arg.slice("--type=".length).trim();
  }

  return args;
}

async function readStdin() {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

function hasDot(value) {
  return typeof value === "string" && value.includes(".");
}

function toSlugCurrent(rawSlug) {
  if (typeof rawSlug === "string") return rawSlug.trim();
  if (rawSlug && typeof rawSlug === "object" && typeof rawSlug.current === "string") {
    return rawSlug.current.trim();
  }
  return "";
}

function buildSafeId(type, slug) {
  const normalized = `${slug || ""}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!normalized) {
    throw new Error(`Cannot build ${type} id: slug is empty after normalization.`);
  }

  return `${type}-${normalized}`;
}

function buildSafeRedirectId(source) {
  const normalized = `${source || ""}`
    .toLowerCase()
    .replace(/^\//, "")
    .replace(/[^a-z0-9-/_]/g, "-")
    .replace(/[\/_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!normalized) {
    throw new Error("Cannot build redirect id: source is empty after normalization.");
  }

  return `redirect-${normalized}`;
}

function cleanUndefined(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => cleanUndefined(item))
      .filter((item) => item !== undefined);
  }

  if (value && typeof value === "object") {
    const next = {};
    for (const [k, v] of Object.entries(value)) {
      const cleaned = cleanUndefined(v);
      if (cleaned !== undefined) next[k] = cleaned;
    }
    return next;
  }

  if (value === undefined) return undefined;
  return value;
}

function normalizeForSanity(value, path = "root") {
  if (Array.isArray(value)) {
    return value.map((item, index) => {
      if (item == null || typeof item !== "object" || Array.isArray(item)) {
        return normalizeForSanity(item, `${path}[${index}]`);
      }

      const normalizedItem = normalizeForSanity(item, `${path}[${index}]`);
      if (normalizedItem && typeof normalizedItem === "object") {
        if (!normalizedItem._key) {
          normalizedItem._key = `${path.replace(/[^a-zA-Z0-9]/g, "-")}-${index}`;
        }
      }
      return normalizedItem;
    });
  }

  if (value && typeof value === "object") {
    const next = {};
    for (const [key, raw] of Object.entries(value)) {
      next[key] = normalizeForSanity(raw, `${path}.${key}`);
    }

    if (next._type === "link") {
      return normalizeLinkObject(next, `${path.replace(/[^a-zA-Z0-9]/g, "-")}-link`);
    }

    return next;
  }

  return value;
}

function validateArgs(args) {
  if (!SUPPORTED_TYPES.has(args.type)) {
    throw new Error(
      `Unsupported --type. Use one of: ${Array.from(SUPPORTED_TYPES).join(", ")}.`,
    );
  }

  if (!["create", "upsert"].includes(args.mode)) {
    throw new Error('Invalid --mode. Use "create" or "upsert".');
  }
}

async function loadPayload(args) {
  if (args.useStdin) {
    const raw = await readStdin();
    if (!raw.trim()) throw new Error("STDIN is empty.");
    return JSON.parse(raw);
  }

  if (!args.input) {
    throw new Error("Missing payload source. Use --input=<file> or --stdin.");
  }

  const raw = await fs.readFile(args.input, "utf8");
  return JSON.parse(raw);
}

function buildDocument({ payload, args }) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Payload must be a JSON object.");
  }

  const config = TYPE_CONFIG[args.type];
  const slugCurrent = toSlugCurrent(payload.slug);
  if (config.requireSlug && !slugCurrent) {
    throw new Error(`Missing required field: slug (string or { current }) for type "${args.type}".`);
  }

  const title = `${payload.title || ""}`.trim();
  if (config.requireTitle && !title) {
    throw new Error(`Missing required field: title for type "${args.type}".`);
  }

  if (config.requireSource && !`${payload.source || ""}`.trim()) {
    throw new Error('Missing required field: source for type "redirect".');
  }

  let requestedId = args.id || payload._id;
  if (!requestedId) {
    if (args.type === "redirect") {
      requestedId = buildSafeRedirectId(payload.source);
    } else {
      requestedId = buildSafeId(args.type, slugCurrent);
    }
  }
  const cleanId = `${requestedId}`.replace(/^drafts\./, "").trim();

  if (!cleanId) {
    throw new Error("Invalid _id after normalization.");
  }

  if (hasDot(cleanId)) {
    throw new Error('Public document id cannot contain dots (".").');
  }

  const targetId = args.draft ? `drafts.${cleanId}` : cleanId;

  const normalizedPayload = normalizeForSanity(payload);

  const nextDocument = {
    ...normalizedPayload,
    _id: targetId,
    _type: args.type,
  };

  if (config.requireSlug) {
    nextDocument.slug = {
      _type: "slug",
      current: slugCurrent,
    };
  }

  if (title) {
    nextDocument.title = title;
  }

  return cleanUndefined(nextDocument);
}

async function fetchExistingBySlug(client, type, slug) {
  return client.fetch(
    `*[_type == $type && slug.current == $slug][0]{
      _id,
      _type,
      title,
      "slug": slug.current
    }`,
    { type, slug },
  );
}

async function fetchExistingBySource(client, source) {
  return client.fetch(
    `*[_type == "redirect" && source == $source][0]{
      _id,
      _type,
      source
    }`,
    { source },
  );
}

async function fetchPublicBySlug(client, type, slug) {
  return client.fetch(
    `*[_type == $type && slug.current == $slug][0]{
      _id,
      _type,
      title,
      "slug": slug.current,
      _updatedAt
    }`,
    { type, slug },
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  validateArgs(args);

  const payload = await loadPayload(args);
  const nextDocument = buildDocument({ payload, args });

  const writeClient = await createSanityWriteClient();
  const readClient = await createSanityReadClient();

  const lookupSlug = nextDocument.slug?.current || null;
  const lookupSource = args.type === "redirect" ? `${nextDocument.source || ""}`.trim() : null;
  const existing = lookupSource
    ? await fetchExistingBySource(writeClient, lookupSource)
    : await fetchExistingBySlug(writeClient, args.type, lookupSlug);

  if (existing && args.mode === "create") {
    throw new Error(
      `${args.type} target already exists as ${existing._id}. Use --mode=upsert to update it.`,
    );
  }

  if (existing && args.mode === "upsert" && !args.id && !payload._id) {
    nextDocument._id = existing._id;
  }

  let writeResult = null;
  if (args.write) {
    writeResult = await writeClient.createOrReplace(nextDocument);
  }

  const publicRead =
    args.write && !args.draft && lookupSlug
      ? await fetchPublicBySlug(readClient, args.type, lookupSlug)
      : null;

  console.log(
    JSON.stringify(
      {
        ok: true,
        writeMode: args.write,
        mode: args.mode,
        draft: args.draft,
        type: args.type,
        existing,
        nextDocument: {
          _id: nextDocument._id,
          _type: nextDocument._type,
          title: nextDocument.title || null,
          slug: lookupSlug,
          source: lookupSource,
          topLevelKeys: Object.keys(nextDocument),
        },
        writeResult: writeResult
          ? {
              _id: writeResult._id,
              _rev: writeResult._rev,
            }
          : null,
        publicRead,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        ok: false,
        message: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
});
