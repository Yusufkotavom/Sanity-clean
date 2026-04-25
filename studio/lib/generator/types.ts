export type SlugValue = {
  _type?: "slug";
  current?: string;
};

export type ReferenceValue = {
  _type: "reference";
  _ref: string;
  _weak?: boolean;
};

export type GeneratorTokenDefinitionLite = {
  _key?: string;
  name: string;
  label?: string;
  sourceField?: string;
  fallbackValue?: string;
  required?: boolean;
};

export type GeneratorKeywordSet = {
  _key?: string;
  key?: string;
  label?: string;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  angle?: string;
};

export type GeneratorRow = {
  _key?: string;
  key?: string;
  label?: string;
  service?: string;
  city?: string;
  industry?: string;
  offer?: string;
};

export type GeneratorDatasetLite = {
  _id: string;
  slug?: SlugValue;
  title?: string;
  ref?: ReferenceValue;
};

export type GeneratorProgramLite = {
  _id: string;
  routeBase: string;
  slug?: SlugValue;
  title?: string;
  ref?: ReferenceValue;
  dataset?: GeneratorDatasetLite;
  defaultSeoPattern?: {
    title?: string;
    description?: string;
  };
};

export type GeneratorSectionVariantLite = {
  _key?: string;
  key: string;
  title: string;
  sectionType?: string;
  copy?: string;
  requiredTokens?: string[];
  optional?: boolean;
};

export type GeneratorTemplateLite = {
  _id: string;
  title: string;
  designFamily: string;
  ref?: ReferenceValue;
  tokenDefinitions?: GeneratorTokenDefinitionLite[];
  baseSections?: string[];
  optionalSections?: string[];
  variationRules?: string[];
  sectionVariants?: GeneratorSectionVariantLite[];
};

export type GeneratorSlugInput = {
  routeBase: string;
  service?: string;
  city?: string;
  primaryKeyword: string;
};

export type GeneratorTokenMap = Record<string, string>;

export type GeneratorSectionPlan = {
  key: string;
  sectionType: string;
  title: string;
  copy: string;
  optional: boolean;
  requiredTokens: string[];
};

export type GeneratedPageDraft = {
  _type: "page";
  title: string;
  slug: {
    _type: "slug";
    current: string;
  };
  topBlockCount: number;
  blocks: Array<Record<string, unknown>>;
  generator: {
    programId: string;
    program?: ReferenceValue;
    templateId: string;
    template?: ReferenceValue;
    datasetId?: string;
    dataset?: ReferenceValue;
    rowKey: string;
    keywordKey: string;
    version: string;
    aiUsed: false;
    generatedAt?: string;
  };
};

export type BuildGeneratedPageDraftInput = {
  program: GeneratorProgramLite;
  template: GeneratorTemplateLite;
  keywordSet: GeneratorKeywordSet;
  row: GeneratorRow;
  generatedAt?: string;
};

export type ExistingPageLike = {
  _id?: string;
  title?: string;
  slug?: SlugValue | null;
  generator?: {
    programId?: string;
    datasetId?: string;
    rowKey?: string;
    keywordKey?: string;
  } | null;
};

export type DuplicateMatch = {
  reason: "slug" | "lineage";
  existing: ExistingPageLike;
};
