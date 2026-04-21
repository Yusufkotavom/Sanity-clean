import { promises as fs } from "node:fs";
import path from "node:path";

export type AstroLocalContentItem = {
  type: "post" | "service" | "product" | "project";
  title: string;
  href: string;
  filePath: string;
  source: "repo-local";
};

const REPO_LOCAL_ROOT = path.join(
  process.cwd(),
  "content",
  "astro-local",
  "pages",
);
const LOCAL_ASTRO_CATALOG_DISABLED = true;

const CONTENT_ROOTS = ["posts", "services", "products", "projects"] as const;

const TYPE_MAP: Record<(typeof CONTENT_ROOTS)[number], AstroLocalContentItem["type"]> = {
  posts: "post",
  services: "service",
  products: "product",
  projects: "project",
};

function titleCaseFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parseFrontmatterTitle(content: string): string | null {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;
  const titleMatch = fmMatch[1].match(/^\s*title:\s*["']?(.+?)["']?\s*$/m);
  return titleMatch ? titleMatch[1].trim() : null;
}

function toHref(root: (typeof CONTENT_ROOTS)[number], relFile: string): string | null {
  if (relFile.includes("[")) return null;

  const ext = path.extname(relFile);
  const withoutExt = relFile.slice(0, -ext.length);
  const normalized = withoutExt.replace(/\\/g, "/");

  if (normalized.endsWith("/index")) {
    const dirPath = normalized.replace(/\/index$/, "");
    return dirPath ? `/${root === "posts" ? "blog" : root}/${dirPath}` : `/${root === "posts" ? "blog" : root}`;
  }

  return `/${root === "posts" ? "blog" : root}/${normalized}`;
}

async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function walk(dirPath: string): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const resolved = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(resolved)));
      continue;
    }
    files.push(resolved);
  }

  return files;
}

async function collectFromRoot(
  rootPath: string,
): Promise<AstroLocalContentItem[]> {
  const items: AstroLocalContentItem[] = [];

  for (const contentRoot of CONTENT_ROOTS) {
    const scopedRoot = path.join(rootPath, contentRoot);
    if (!(await pathExists(scopedRoot))) continue;

    const files = await walk(scopedRoot);
    for (const absFile of files) {
      const ext = path.extname(absFile).toLowerCase();
      if (![".md", ".mdx", ".astro"].includes(ext)) continue;

      const rel = path.relative(scopedRoot, absFile).replace(/\\/g, "/");
      const href = toHref(contentRoot, rel);
      if (!href) continue;

      const raw = await fs.readFile(absFile, "utf8");
      const title =
        parseFrontmatterTitle(raw) ||
        titleCaseFromSlug(path.basename(rel, ext).replace(/^index$/, contentRoot));

      items.push({
        type: TYPE_MAP[contentRoot],
        title,
        href,
        filePath: absFile,
        source: "repo-local",
      });
    }
  }

  return items;
}

export async function getAstroLocalCatalog(): Promise<AstroLocalContentItem[]> {
  if (LOCAL_ASTRO_CATALOG_DISABLED) {
    return [];
  }

  const repoLocalItems = (await pathExists(REPO_LOCAL_ROOT))
    ? await collectFromRoot(REPO_LOCAL_ROOT)
    : [];

  const dedup = new Map<string, AstroLocalContentItem>();
  for (const item of repoLocalItems) {
    if (!dedup.has(item.href)) dedup.set(item.href, item);
  }

  return Array.from(dedup.values()).sort((a, b) => a.href.localeCompare(b.href));
}
