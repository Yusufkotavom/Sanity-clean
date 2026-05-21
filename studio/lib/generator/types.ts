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
  slugPattern?: string;
  slug?: SlugValue;
  title?: string;
  ref?: ReferenceValue;
  dataset?: GeneratorDatasetLite;
  defaultSeoPattern?: {
    title?: string;
    description?: string;
  };
};

export type GeneratorTemplateLite = {
  _id: string;
  title: string;
  designFamily: string;
  visualPreset?: string;
  motionPreset?: string;
  styleNotes?: string;
  ref?: ReferenceValue;
  tokenDefinitions?: GeneratorTokenDefinitionLite[];
  blocks?: Array<Record<string, unknown>>;
};

export type GeneratorSlugInput = {
  routeBase: string;
  service?: string;
  city?: string;
  primaryKeyword: string;
  slugPattern?: string;
};

export type GeneratorTokenMap = Record<string, string>;

export type GeneratedPageDraft = {
  _type: "page";
  title: string;
  slug: {
    _type: "slug";
    current: string;
  };
  meta?: {
    title?: string;
    description?: string;
    focusKeyword?: string;
    secondaryKeywords?: string[];
    noindex?: boolean;
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

export type GeneratorQaSeverity = "ready" | "warning" | "blocked";

export type GeneratorQaIssue = {
  severity: GeneratorQaSeverity;
  code: string;
  message: string;
};

export type GeneratorQaResult = {
  severity: GeneratorQaSeverity;
  issues: GeneratorQaIssue[];
};
