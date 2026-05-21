import type { GeneratorKeywordSet, GeneratorRow, GeneratorTemplateLite, GeneratorTokenDefinitionLite, GeneratorTokenMap } from "./types";

export const normalizeAngle = (angle?: string) => {
  const normalized = (angle ?? "").trim().toLowerCase();
  if (!normalized) {
    return "default";
  }
  if (normalized.includes("price") || normalized.includes("murah") || normalized.includes("hemat")) {
    return "price";
  }
  if (normalized.includes("speed") || normalized.includes("fast") || normalized.includes("cepat")) {
    return "speed";
  }
  if (normalized.includes("quality") || normalized.includes("premium") || normalized.includes("kualitas")) {
    return "quality";
  }
  return normalized;
};

const cleanTokenValue = (value: unknown) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

const titleCase = (value: string) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const buildDerivedTokenSource = (keywordSet: GeneratorKeywordSet, row: GeneratorRow) => {
  const primaryKeyword = cleanTokenValue(keywordSet.primaryKeyword);
  const secondaryKeywords = (keywordSet.secondaryKeywords ?? []).map(cleanTokenValue).filter(Boolean).join(", ");
  const angle = normalizeAngle(keywordSet.angle);
  const service = cleanTokenValue(row.service) || primaryKeyword;
  const city = cleanTokenValue(row.city);
  const location = city || service || "target utama";
  const offer = cleanTokenValue(row.offer) || `Konsultasi ${service}`;
  const industry = cleanTokenValue(row.industry) || "bisnis lokal";
  const label = cleanTokenValue(row.label) || cleanTokenValue(keywordSet.label) || titleCase(service.replace(/-/g, " "));

  return {
    ...keywordSet,
    ...row,
    primaryKeyword,
    secondaryKeywords,
    angle,
    service,
    city,
    location,
    offer,
    industry,
    label,
  };
};

const resolveTokenDefinition = (definition: GeneratorTokenDefinitionLite, source: Record<string, unknown>): string => {
  const fromSource = definition.sourceField ? cleanTokenValue(source[definition.sourceField]) : "";
  if (fromSource) {
    return fromSource;
  }

  return cleanTokenValue(definition.fallbackValue);
};

export const buildGeneratorTokens = (
  template: GeneratorTemplateLite,
  keywordSet: GeneratorKeywordSet,
  row: GeneratorRow,
): GeneratorTokenMap => {
  const source = buildDerivedTokenSource(keywordSet, row);
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
