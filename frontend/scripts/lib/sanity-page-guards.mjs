import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR = path.resolve(SCRIPT_DIR, "..", "..");

function parseEnvFile(raw) {
  const parsed = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    parsed[key] = value;
  }

  return parsed;
}

async function loadEnvFrom(paths) {
  const merged = {};

  for (const filePath of paths) {
    try {
      const raw = await fs.readFile(filePath, "utf8");
      Object.assign(merged, parseEnvFile(raw));
    } catch {
      // Ignore missing env files.
    }
  }

  return merged;
}

export async function loadSanityEnv() {
  const envFromFiles = await loadEnvFrom([
    path.join(FRONTEND_DIR, ".env"),
    path.join(FRONTEND_DIR, ".env.local"),
  ]);

  return {
    ...envFromFiles,
    ...process.env,
  };
}

export async function createSanityWriteClient() {
  const env = await loadSanityEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-23";
  const token = env.SANITY_DEV || env.SANITY_AUTH_TOKEN;

  if (!projectId || !dataset || !token) {
    throw new Error(
      "Missing Sanity write config. Expected NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and a write token via SANITY_DEV or SANITY_AUTH_TOKEN.",
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}

export async function createSanityReadClient() {
  const env = await loadSanityEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-23";

  if (!projectId || !dataset) {
    throw new Error(
      "Missing Sanity read config. Expected NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.",
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
  });
}

export function resolveSanityReadToken(env) {
  return env.SANITY_DEV || env.SANITY_AUTH_TOKEN || undefined;
}

export async function createSanityReadClientWithDraftAccess() {
  const env = await loadSanityEnv();
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-23";
  const token = resolveSanityReadToken(env);

  if (!projectId || !dataset) {
    throw new Error(
      "Missing Sanity read config. Expected NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.",
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    perspective: token ? "drafts" : "published",
    token,
    useCdn: false,
  });
}

export function normalizeLinkObject(link, fallbackKey) {
  if (!link || typeof link !== "object" || Array.isArray(link)) return link;

  const nextLink = { ...link };

  if (!nextLink._key) {
    nextLink._key = fallbackKey;
  }

  if (typeof nextLink.isExternal !== "boolean") {
    const href = `${nextLink.href || ""}`.trim();
    nextLink.isExternal = /^https?:\/\//i.test(href);
  }

  return nextLink;
}

function normalizePortableBlocks(blocks = [], prefix) {
  return blocks.map((block, blockIndex) => ({
    ...block,
    _key: block?._key || `${prefix}-block-${blockIndex}`,
    markDefs: Array.isArray(block?.markDefs)
      ? block.markDefs.map((markDef, markIndex) =>
          markDef?._type === "link"
            ? normalizeLinkObject(markDef, `${prefix}-mark-${blockIndex}-${markIndex}`)
            : {
                ...markDef,
                _key: markDef?._key || `${prefix}-mark-${blockIndex}-${markIndex}`,
              },
        )
      : [],
    children: Array.isArray(block?.children)
      ? block.children.map((child, childIndex) => ({
          ...child,
          _key: child?._key || `${prefix}-child-${blockIndex}-${childIndex}`,
        }))
      : [],
  }));
}

export function normalizePageBlock(block, blockIndex) {
  const nextBlock = {
    ...block,
    _key: block?._key || `block-${blockIndex}`,
  };

  if (Array.isArray(block?.body)) {
    nextBlock.body = normalizePortableBlocks(block.body, `body-${blockIndex}`);
  }

  if (Array.isArray(block?.links)) {
    nextBlock.links = block.links.map((link, linkIndex) =>
      normalizeLinkObject(link, `link-${blockIndex}-${linkIndex}`),
    );
  }

  if (Array.isArray(block?.columns)) {
    nextBlock.columns = block.columns.map((column, columnIndex) => {
      const nextColumn = {
        ...column,
        _key: column?._key || `column-${blockIndex}-${columnIndex}`,
      };

      if (column?.link) {
        nextColumn.link = normalizeLinkObject(
          column.link,
          `column-link-${blockIndex}-${columnIndex}`,
        );
      }

      return nextColumn;
    });
  }

  if (Array.isArray(block?.faqs)) {
    nextBlock.faqs = block.faqs.map((faqRef, faqIndex) => ({
      ...faqRef,
      _key: faqRef?._key || `faq-ref-${blockIndex}-${faqIndex}`,
    }));
  }

  if (block?.link) {
    nextBlock.link = normalizeLinkObject(block.link, `single-link-${blockIndex}`);
  }

  return nextBlock;
}

function collectPortableIssues(blocks, prefix, issues) {
  blocks.forEach((block, blockIndex) => {
    if (!block?._key) {
      issues.push(`${prefix}.body[${blockIndex}] missing _key`);
    }

    if (Array.isArray(block?.markDefs)) {
      block.markDefs.forEach((markDef, markIndex) => {
        if (!markDef?._key) {
          issues.push(
            `${prefix}.body[${blockIndex}].markDefs[${markIndex}] missing _key`,
          );
        }
        if (markDef?._type === "link" && typeof markDef?.isExternal !== "boolean") {
          issues.push(
            `${prefix}.body[${blockIndex}].markDefs[${markIndex}] link missing isExternal`,
          );
        }
      });
    }

    if (Array.isArray(block?.children)) {
      block.children.forEach((child, childIndex) => {
        if (!child?._key) {
          issues.push(`${prefix}.body[${blockIndex}].children[${childIndex}] missing _key`);
        }
      });
    }
  });
}

export function collectPageIssues(page) {
  const issues = [];
  const blocks = Array.isArray(page?.blocks) ? page.blocks : [];

  blocks.forEach((block, blockIndex) => {
    const prefix = `blocks[${blockIndex}]`;

    if (!block?._key) {
      issues.push(`${prefix} missing _key`);
    }

    if (Array.isArray(block?.body)) {
      collectPortableIssues(block.body, prefix, issues);
    }

    if (Array.isArray(block?.links)) {
      block.links.forEach((link, linkIndex) => {
        if (!link?._key) {
          issues.push(`${prefix}.links[${linkIndex}] missing _key`);
        }
        if (typeof link?.isExternal !== "boolean") {
          issues.push(`${prefix}.links[${linkIndex}] missing isExternal`);
        }
      });
    }

    if (Array.isArray(block?.columns)) {
      block.columns.forEach((column, columnIndex) => {
        if (!column?._key) {
          issues.push(`${prefix}.columns[${columnIndex}] missing _key`);
        }
        if (column?.link) {
          if (!column.link?._key) {
            issues.push(`${prefix}.columns[${columnIndex}].link missing _key`);
          }
          if (typeof column.link?.isExternal !== "boolean") {
            issues.push(`${prefix}.columns[${columnIndex}].link missing isExternal`);
          }
        }
      });
    }

    if (Array.isArray(block?.faqs)) {
      block.faqs.forEach((faqRef, faqIndex) => {
        if (!faqRef?._key) {
          issues.push(`${prefix}.faqs[${faqIndex}] missing _key`);
        }
      });
    }

    if (block?.link) {
      if (!block.link?._key) {
        issues.push(`${prefix}.link missing _key`);
      }
      if (typeof block.link?.isExternal !== "boolean") {
        issues.push(`${prefix}.link missing isExternal`);
      }
    }
  });

  return issues;
}

export async function fetchSanityPages(client, slug) {
  return client.fetch(
    `*[_type == "page"${slug ? " && slug.current == $slug" : ""}]{
      _id,
      _type,
      title,
      slug,
      topBlockCount,
      blocks
    } | order(_updatedAt desc)`,
    slug ? { slug } : {},
  );
}
