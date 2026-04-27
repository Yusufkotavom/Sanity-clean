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
  pnpm --filter frontend run sanity:content:create -- --type=post --read --slug=my-slug
  pnpm --filter frontend run sanity:content:create -- --type=post --read --list --limit=20

Options:
  --type=<${Array.from(SUPPORTED_TYPES).join("|")}>
  --input=<path>       Read JSON payload from file
  --stdin              Read JSON payload from stdin
  --read               Read/check mode (no write)
  --slug=<value>       Lookup by slug in read mode
  --source=<value>     Lookup by source (redirect read mode)
  --doc-id=<value>     Lookup by _id in read mode
  --list               List documents by type in read mode
  --limit=<n>          List size (default 20, max 200)
  --offset=<n>         List offset (default 0)
  --order=<key>        List order key:
                       updated-desc|updated-asc|created-desc|created-asc|title-asc|title-desc|slug-asc|slug-desc|source-asc|source-desc
  --perspective=<published|raw>  Read perspective (default: published)
  --full               Print full document in read mode
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
    read: false,
    perspective: "published",
    full: false,
    list: false,
    limit: 20,
    offset: 0,
    order: "updated-desc",
  };

  for (const arg of argv) {
    if (arg === "--write") args.write = true;
    else if (arg === "--stdin") args.useStdin = true;
    else if (arg === "--draft") args.draft = true;
    else if (arg === "--read") args.read = true;
    else if (arg === "--full") args.full = true;
    else if (arg === "--list") args.list = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg.startsWith("--input=")) args.input = arg.slice("--input=".length).trim();
    else if (arg.startsWith("--mode=")) args.mode = arg.slice("--mode=".length).trim();
    else if (arg.startsWith("--id=")) args.id = arg.slice("--id=".length).trim();
    else if (arg.startsWith("--type=")) args.type = arg.slice("--type=".length).trim();
    else if (arg.startsWith("--slug=")) args.slug = arg.slice("--slug=".length).trim();
    else if (arg.startsWith("--source=")) args.source = arg.slice("--source=".length).trim();
    else if (arg.startsWith("--doc-id=")) args.docId = arg.slice("--doc-id=".length).trim();
    else if (arg.startsWith("--perspective="))
      args.perspective = arg.slice("--perspective=".length).trim();
    else if (arg.startsWith("--limit=")) args.limit = Number(arg.slice("--limit=".length).trim());
    else if (arg.startsWith("--offset="))
      args.offset = Number(arg.slice("--offset=".length).trim());
    else if (arg.startsWith("--order=")) args.order = arg.slice("--order=".length).trim();
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

  if (!["published", "raw"].includes(args.perspective)) {
    throw new Error('Invalid --perspective. Use "published" or "raw".');
  }

  if (args.read && args.write) {
    throw new Error("Cannot combine --read and --write.");
  }

  if (!Number.isFinite(args.limit) || args.limit < 1 || args.limit > 200) {
    throw new Error("Invalid --limit. Use an integer between 1 and 200.");
  }

  if (!Number.isFinite(args.offset) || args.offset < 0) {
    throw new Error("Invalid --offset. Use an integer >= 0.");
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

async function readBySlug(client, type, slug) {
  return client.fetch(
    `*[_type == $type && slug.current == $slug][0]`,
    { type, slug },
  );
}

async function readBySource(client, source) {
  return client.fetch(
    `*[_type == "redirect" && source == $source][0]`,
    { source },
  );
}

async function readById(client, id) {
  return client.fetch(
    `*[_id == $id][0]`,
    { id },
  );
}

const ORDER_MAP = {
  "updated-desc": "_updatedAt desc",
  "updated-asc": "_updatedAt asc",
  "created-desc": "_createdAt desc",
  "created-asc": "_createdAt asc",
  "title-asc": "title asc",
  "title-desc": "title desc",
  "slug-asc": "slug.current asc",
  "slug-desc": "slug.current desc",
  "source-asc": "source asc",
  "source-desc": "source desc",
};

async function listByType(client, type, { limit, offset, order, full }) {
  const orderExpr = ORDER_MAP[order];
  if (!orderExpr) {
    throw new Error(
      `Invalid --order. Use one of: ${Object.keys(ORDER_MAP).join(", ")}`,
    );
  }

  const total = await client.fetch(`count(*[_type == $type])`, { type });

  const projection = full
    ? "..."
    : `_id, _type, title, "slug": slug.current, source, _createdAt, _updatedAt`;

  const docs = await client.fetch(
    `*[_type == $type] | order(${orderExpr}) [$offset...$end] { ${projection} }`,
    {
      type,
      offset,
      end: offset + limit,
    },
  );

  return { total, docs };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  validateArgs(args);

  if (args.read) {
    const readClient = (await createSanityReadClient()).withConfig({
      perspective: args.perspective,
    });

    let lookup = {};
    let doc = null;

    if (args.list) {
      const { total, docs } = await listByType(readClient, args.type, {
        limit: args.limit,
        offset: args.offset,
        order: args.order,
        full: args.full,
      });

      console.log(
        JSON.stringify(
          {
            ok: true,
            mode: "read-list",
            type: args.type,
            perspective: args.perspective,
            list: {
              total,
              limit: args.limit,
              offset: args.offset,
              order: args.order,
              count: Array.isArray(docs) ? docs.length : 0,
            },
            items: docs,
          },
          null,
          2,
        ),
      );
      return;
    }

    if (args.docId) {
      lookup = { by: "docId", value: args.docId };
      doc = await readById(readClient, args.docId);
    } else if (args.type === "redirect" && args.source) {
      lookup = { by: "source", value: args.source };
      doc = await readBySource(readClient, args.source);
    } else if (args.slug) {
      lookup = { by: "slug", value: args.slug };
      doc = await readBySlug(readClient, args.type, args.slug);
    } else {
      throw new Error(
        'Read mode requires one lookup: --doc-id=<id> OR --slug=<slug> (or --source=<source> for redirect).',
      );
    }

    console.log(
      JSON.stringify(
        {
          ok: true,
          mode: "read",
          type: args.type,
          perspective: args.perspective,
          lookup,
          exists: Boolean(doc),
          summary: doc
            ? {
                _id: doc._id,
                _type: doc._type,
                title: doc.title || null,
                slug: doc.slug?.current || null,
                source: doc.source || null,
                _updatedAt: doc._updatedAt || null,
              }
            : null,
          document: args.full ? doc : undefined,
        },
        null,
        2,
      ),
    );
    return;
  }

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
