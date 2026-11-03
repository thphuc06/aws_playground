/** Evidence is about a bounded claim, never an accuracy percentage for AWS. */
export type FieldDisposition = 'aws-setting' | 'application-intent' | 'exercise-input' | 'observed-output' | 'unclassified';
export type EvidenceReviewStatus = 'unreviewed' | 'reviewed';
export interface EvidenceSource {
  title: string;
  url: string;
  /** A date copied from existing metadata is not a fresh source review. */
  declaredChecked?: string;
  relationship: 'reference' | 'claim-support';
  section?: string;
}
export interface EvidenceTest {
  file: string;
  case: string;
  kind: 'positive' | 'negative' | 'boundary' | 'unknown-context';
}
export interface ClaimEvidence {
  id: string;
  serviceId: string;
  fieldPaths: string[];
  statement: string;
  applicability: string;
  assumptions: string[];
  exceptions: string[];
  sources: EvidenceSource[];
  review: {status: EvidenceReviewStatus; reviewer?: string; checked?: string};
  /** A documented statement may have no corresponding local validator. */
  enforcement: 'guidance-only' | 'local-rule';
  ruleId?: string;
  tests: EvidenceTest[];
  testExemptions?: Partial<Record<EvidenceTest['kind'], string>>;
}
export interface FieldSurface {
  path: string;
  label: string;
  kind: string;
  section: string;
  disposition: FieldDisposition;
  dispositionBasis: 'declared-metadata' | 'editorial-classification' | 'not-classified';
  dispositionNote?: string;
  help: string;
  reference?: EvidenceSource;
  documentationReference?: EvidenceSource;
  /** Imported audit scope remains separate from reviewed ClaimEvidence. */
  existingAudit?: {checked: string; scope: string};
  apiBinding: {status: 'not-mapped' | 'declared-unreviewed'; operation?: string; path?: string};
  claimIds: string[];
  documentation: {
    purpose: boolean; whenToUse: boolean; omission: boolean;
    effects: boolean; examples: boolean; relatedLessons: boolean;
  };
  hasDeclaredDefault: boolean;
  hasQuotaMetadata: boolean;
  condition?: {field: string; values: (string | number | boolean)[]};
}
export interface ServiceSurfaceManifest {
  serviceId: string;
  name: string;
  catalogScope: 'C03-named-service' | 'legacy-compatibility';
  scope: string;
  surfaceStatus: 'editor-inventory-only';
  apiCompleteness: 'not-assessed';
  fields: FieldSurface[];
  rootFieldCount: number;
  limitations: string[];
  study: {structuredBrief: boolean; declaredReviewStatus?: string; sectionsMissing: string[]};
  practice: {configurationCaseIds: string[]; knowledgeCheckIds: string[]};
}
export interface SkillEvidence {
  id: string;
  examVersion: 'DVA-C03';
  title: string;
  learningMode: string;
  source: EvidenceSource;
  fieldMappings: {serviceId: string; path: string}[];
  theoryLinks: {chapter: string; section: string; resolves: boolean}[];
  configurationCaseIds: string[];
  knowledgeCheckIds: string[];
  codeCaseIds: string[];
  completeness: 'not-assessed';
}
