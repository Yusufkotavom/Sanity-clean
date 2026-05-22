import type { GeneratorRow, GeneratorTemplateLite, GeneratorTokenDefinitionLite, GeneratorTokenMap } from "./types";

export const normalizeAngle = (angle?: string) => {
  const normalized = (angle ?? "").trim().toLowerCase();
  if (!normalized) return "default";
  if (normalized.includes("price") || normalized.includes("murah") || normalized.includes("hemat")) return "price";
  if (normalized.includes("speed") || normalized.includes("fast") || normalized.includes("cepat")) return "speed";
  if (normalized.includes("quality") || normalized.includes("premium") || normalized.includes("kualitas")) return "quality";
  return normalized;
};

const cleanTokenValue = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const titleCase = (value: string) =>
  value.split(/\s+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");

const resolveCustomTokens = (tokens?: Array<{ name: string; values: string[] }>): Record<string, string> => {
  if (!tokens?.length) return {};
  const result: Record<string, string> = {};
  for (const token of tokens) {
    if (token.name && token.values?.length) {
      // Pick first value for deterministic output; engine can rotate later
      result[token.name] = token.values[0];
    }
  }
  return result;
};

const buildDerivedTokenSource = (row: GeneratorRow): Record<string, string> => {
  const primaryKeyword = cleanTokenValue(row.primaryKeyword);
  const secondaryKeywords = (row.secondaryKeywords ?? []).map(cleanTokenValue).filter(Boolean).join(", ");
  const service = cleanTokenValue(row.service) || primaryKeyword;
  const city = cleanTokenValue(row.city);
  const location = city || service || "target utama";
  const offer = cleanTokenValue(row.offer) || `Konsultasi ${service}`;
  const industry = cleanTokenValue(row.industry) || "bisnis lokal";
  const localCondition = cleanTokenValue(row.localCondition);
  const label = cleanTokenValue(row.label) || titleCase(service.replace(/-/g, " "));
  const customTokens = resolveCustomTokens(row.tokens);

  return {
    ...customTokens,
    primaryKeyword,
    secondaryKeywords,
    service,
    city,
    location,
    offer,
    industry,
    localCondition,
    label,
  };
};

const resolveTokenDefinition = (definition: GeneratorTokenDefinitionLite, source: Record<string, unknown>): string => {
  const fromSource = definition.sourceField ? cleanTokenValue(source[definition.sourceField]) : "";
  if (fromSource) return fromSource;
  return cleanTokenValue(definition.fallbackValue);
};

export const buildGeneratorTokens = (
  template: GeneratorTemplateLite,
  row: GeneratorRow,
): GeneratorTokenMap => {
  const source = buildDerivedTokenSource(row);
  const declared = template.tokenDefinitions ?? [];

  if (declared.length === 0) {
    return Object.fromEntries(
      Object.entries(source)
        .map(([key, value]) => [key, cleanTokenValue(value)])
        .filter(([, value]) => value.length > 0),
    );
  }

  return declared.reduce<GeneratorTokenMap>((accumulator, definition) => {
    const resolved = resolveTokenDefinition(definition, source);
    if (resolved) {
      accumulator[definition.name] = resolved;
    }
    return accumulator;
  }, {});
};
