import type { GeneratorRow, GeneratorTemplateLite } from "./types";

type SelectTemplateForRowInput = {
  programId: string;
  row: GeneratorRow;
  templates: GeneratorTemplateLite[];
};

const stableHash = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const getRowSeed = (row: GeneratorRow) =>
  row.key || row._key || row.primaryKeyword || row.city || row.service || "row";

export const selectTemplateForRow = ({ programId, row, templates }: SelectTemplateForRowInput) => {
  if (templates.length === 0) return null;
  if (templates.length === 1) return templates[0] ?? null;

  const hash = stableHash(`${programId}:${getRowSeed(row)}`);
  return templates[hash % templates.length] ?? null;
};
