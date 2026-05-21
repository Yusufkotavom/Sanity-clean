import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const required = [
  ["generatorTemplate", "../schemas/documents/generator-template.ts"],
  ["generatorProgram", "../schemas/documents/generator-program.ts"],
  ["generatorDataset", "../schemas/documents/generator-dataset.ts"],
  ["generatorTokenDefinition", "../schemas/objects/generator-token-definition.ts"],
  ["generatorKeywordSet", "../schemas/objects/generator-keyword-set.ts"],
  ["generatorRow", "../schemas/objects/generator-row.ts"],
  ["generatorPageMeta", "../schemas/objects/generator-page-meta.ts"],
];

const scriptDir = dirname(fileURLToPath(import.meta.url));
const schemaTypesPath = resolve(scriptDir, "../schema-types.ts");
const source = readFileSync(schemaTypesPath, "utf8");

const imports = new Set(
  [...source.matchAll(/import\s+([A-Za-z0-9_$]+)\s+from\s+["'][^"']+["'];?/g)].map((match) => match[1]),
);
const schemaTypesMatch = source.match(/export\s+const\s+schemaTypes\s*=\s*\[([\s\S]*?)\];/);
const registered = new Set(
  [...(schemaTypesMatch?.[1] ?? "").matchAll(/\b([A-Za-z_$][A-Za-z0-9_$]*)\b/g)].map((match) => match[1]),
);
const fileNameRegex = /name:\s*["']([A-Za-z0-9_$-]+)["']/;
const missing = required
  .filter(([name]) => !imports.has(name) || !registered.has(name))
  .map(([name]) => name);
const mismatchedFiles = required
  .filter(([name, relativePath]) => {
    const fileSource = readFileSync(resolve(scriptDir, relativePath), "utf8");
    const fileSchemaName = fileSource.match(fileNameRegex)?.[1];
    return fileSchemaName !== name;
  })
  .map(([name]) => name);

if (missing.length > 0) {
  console.error("Missing generator schema types:", missing.join(", "));
  process.exit(1);
}

if (mismatchedFiles.length > 0) {
  console.error("Generator schema files expose unexpected names:", mismatchedFiles.join(", "));
  process.exit(1);
}

console.log("Generator schema types registered");
