import type {
  GeneratorKeywordSet,
  GeneratorRow,
  GeneratorSectionPlan,
  GeneratorTemplateLite,
  GeneratorTokenDefinitionLite,
  GeneratorTokenMap,
} from "./types";

const DEFAULT_SECTION_TYPES: Record<string, string> = {
  hero: "hero-1",
  benefits: "value-props-block",
  differentiators: "value-props-block",
  problems: "problem-solution-block",
  faq: "faq-block",
};

const DEFAULT_ANGLE_SECTION_MAP: Record<string, string[]> = {
  price: ["benefits", "faq"],
  speed: ["problems", "faq"],
  quality: ["benefits", "differentiators", "faq"],
  default: ["benefits", "faq"],
};

const ANGLE_GATED_SECTION_KEYS = new Set(
  Object.values(DEFAULT_ANGLE_SECTION_MAP).flatMap((keys) => keys),
);

const titleCase = (value: string) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

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

const pickCategory = (designFamily: string, service?: string) => {
  const source = `${designFamily} ${service ?? ""}`.toLowerCase();
  if (source.includes("print") || source.includes("cetak")) {
    return "printing";
  }
  if (source.includes("software") || source.includes("app")) {
    return "software";
  }
  return "website";
};

const cleanTokenValue = (value: unknown) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

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

const resolveTokenDefinition = (
  definition: GeneratorTokenDefinitionLite,
  source: Record<string, unknown>,
): string => {
  const fromSource = definition.sourceField ? cleanTokenValue(source[definition.sourceField]) : "";
  if (fromSource) {
    return fromSource;
  }

  return cleanTokenValue(definition.fallbackValue);
};

const interpolateTokens = (value: string, tokens: GeneratorTokenMap) =>
  value.replace(/\{\{\s*([a-zA-Z0-9_:-]+)\s*\}\}/g, (_match, tokenName: string) => tokens[tokenName] ?? "").trim();

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

const hasAllRequiredTokens = (requiredTokens: string[], tokens: GeneratorTokenMap) =>
  requiredTokens.every((tokenName) => cleanTokenValue(tokens[tokenName]).length > 0);

export const selectSectionKeysForAngle = (template: GeneratorTemplateLite, angle?: string) => {
  const baseSections = template.baseSections ?? [];
  const optionalSections = template.optionalSections ?? [];
  const usesAngleSelection = (template.variationRules ?? []).includes("angle-selects-optional-sections");

  if (!usesAngleSelection) {
    return [...baseSections, ...optionalSections];
  }

  const normalizedAngle = normalizeAngle(angle);
  const wantedOptional = new Set(DEFAULT_ANGLE_SECTION_MAP[normalizedAngle] ?? DEFAULT_ANGLE_SECTION_MAP.default);

  return [
    ...baseSections,
    ...optionalSections.filter((key) => wantedOptional.has(key) || !ANGLE_GATED_SECTION_KEYS.has(key)),
  ];
};

export const buildSectionPlan = (
  template: GeneratorTemplateLite,
  keywordSet: GeneratorKeywordSet,
  row: GeneratorRow,
): GeneratorSectionPlan[] => {
  const tokens = buildGeneratorTokens(template, keywordSet, row);
  const selectedKeys = selectSectionKeysForAngle(template, keywordSet.angle);
  const variants = new Map((template.sectionVariants ?? []).map((section) => [section.key, section]));
  const optionalKeys = new Set(template.optionalSections ?? []);

  return selectedKeys.flatMap((key) => {
    const variant = variants.get(key);
    const requiredTokens = variant?.requiredTokens ?? [];

    if (!hasAllRequiredTokens(requiredTokens, tokens)) {
      return [];
    }

    const sectionType = variant?.sectionType ?? DEFAULT_SECTION_TYPES[key] ?? "section-header";
    const titleBase = interpolateTokens(variant?.title ?? titleCase(key.replace(/-/g, " ")), tokens);
    const copyBase = cleanTokenValue(variant?.copy)
      ? interpolateTokens(variant?.copy ?? "", tokens)
      : `Fokus ${tokens.angle ?? normalizeAngle(keywordSet.angle)} untuk ${tokens.primaryKeyword ?? keywordSet.primaryKeyword} di ${tokens.location ?? "target utama"} dengan penawaran ${tokens.offer ?? "konsultasi"}.`;

    return [
      {
        key,
        sectionType,
        title: titleBase,
        copy: copyBase,
        colorVariant: variant?.colorVariant,
        optional: optionalKeys.has(key) || Boolean(variant?.optional),
        requiredTokens,
      },
    ];
  });
};

export const buildFaqCategory = (template: GeneratorTemplateLite, row: GeneratorRow) =>
  pickCategory(template.designFamily, row.service);
