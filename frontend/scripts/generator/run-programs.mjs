import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertGeneratorDatasetTarget,
  createSanityReadClient,
  loadSanityEnv,
  resolveSanityDataset,
} from "../lib/sanity-page-guards.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.resolve(__dirname, "../../tmp/generated-pages.ndjson");

function resolveBlockTokens(block, tokens) {
  if (!block) return block;
  if (Array.isArray(block)) return block.map(b => resolveBlockTokens(b, tokens));
  if (typeof block === 'object') {
    const next = { ...block };
    for (const key of Object.keys(next)) {
      if (typeof next[key] === 'string') {
        let text = next[key];
        for (const token of tokens) {
          const val = token.values[0] || "";
          text = text.replace(new RegExp(`\\{\\{${token.name}\\}\\}`, 'g'), val);
        }
        next[key] = text;
      } else {
        next[key] = resolveBlockTokens(next[key], tokens);
      }
    }
    return next;
  }
  return block;
}

function resolveTokens(text, tokens) {
  let res = text || "";
  for (const token of tokens) {
    const val = token.values[0] || "";
    res = res.replace(new RegExp(`\\{\\{${token.name}\\}\\}`, 'g'), val);
  }
  return res;
}

function makeUniqueKeys(block, suffix) {
  if (!block) return block;
  if (Array.isArray(block)) return block.map(b => makeUniqueKeys(b, suffix));
  if (typeof block === 'object') {
    const next = { ...block };
    if (next._key) next._key = `${next._key}-${suffix}`.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 64);
    for (const key of Object.keys(next)) {
      if (key !== '_key' && typeof next[key] === 'object') {
        next[key] = makeUniqueKeys(next[key], suffix);
      }
    }
    return next;
  }
  return block;
}

async function main() {
  const env = await loadSanityEnv();
  const dataset = resolveSanityDataset(env);
  assertGeneratorDatasetTarget(dataset);
  const client = await createSanityReadClient({ dataset });
  const programs = await client.fetch(`*[_type=="generatorProgram"]{
    _id,
    template->,
    dataset->{ rows }
  }`);

  const docs = [];
  const seen = new Set();

  for (const p of programs) {
    if (!p.template || !p.dataset || !p.dataset.rows) continue;
    for (const row of p.dataset.rows) {
      const tokens = row.tokens || [];
      const routeToken = tokens.find(t => t.name === "pagePath");
      const route = routeToken ? routeToken.values[0] : "";
      const slugStr = resolveTokens(p.template.slugPattern, tokens).replace(/\/$/, "");
      const finalRoute = route || slugStr;
      const finalSlug = finalRoute.replace(/^\//, "");

      if (!finalSlug) continue;
      const docId = `page-${finalSlug.replace(/\//g, "-")}`;
      
      if (seen.has(docId)) continue;
      seen.add(docId);
      
      const blocks = p.template.blocks.map(b => {
        const resolved = resolveBlockTokens(b, tokens);
        return makeUniqueKeys(resolved, row.key.slice(0, 10));
      });

      docs.push({
        _id: docId,
        _type: "page",
        title: resolveTokens(p.template.title, tokens),
        slug: { _type: "slug", current: finalSlug },
        route: `/${finalSlug}`,
        blocks: blocks,
        meta: {
          title: resolveTokens(p.template.seoMeta?.titlePattern, tokens),
          description: resolveTokens(p.template.seoMeta?.descriptionPattern, tokens),
          focusKeyword: resolveTokens(p.template.seoMeta?.focusKeywordToken, tokens),
          noindex: false,
        }
      });
    }
  }

  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
  await fs.writeFile(OUT_PATH, docs.map(d => JSON.stringify(d)).join('\n') + '\n', 'utf8');
  console.log(`Generated ${docs.length} documents from dataset=${dataset}. Ready for import: ${OUT_PATH}`);
}

main().catch(e => {
  console.error(e);
  process.exitCode = 1;
});
