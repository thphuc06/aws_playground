import {configurationFields} from '../configurationRegistry';
import type {ConfigField, JsonValue} from '../configurationTypes';
import {canvasCatalog} from '../serviceCatalog';
import {architectureProfilesData} from '../architectureProfilesData';
import {getServiceDetail} from '../serviceDetails';
import {configurationPracticeCases, codePracticeCases} from '../configurationPractice';
import {configurationKnowledgeChecks} from '../configurationKnowledgeChecks';
import {configurationSkills} from '../configurationSkills';
import {configurationTheoryLinks} from '../configurationTheoryLinks';
import {chapters} from '../content';
import {questionBank} from './questionRegistry';
import {serviceExercises} from './serviceExercises';
import {labDefinitions} from './labs/definitions';
import type {StudyQuestion} from './questionTypes';
import {claimEvidenceRegistry, validateClaimEvidence} from './evidenceRegistry';
import type {FieldDisposition, FieldSurface, ServiceSurfaceManifest, SkillEvidence} from './evidenceTypes';

/** Additive contract agreed with the configuration lane; absent data stays unknown. */
type FieldWithEvidence = ConfigField & {
  semantics?: Exclude<FieldDisposition, 'unclassified'>;
  documentation?: {purpose?: string; whenToUse?: string; omission?: string; effects?: string[]; examples?: {value: JsonValue; explanation: string; valid?: boolean}[]; relatedLessons?: string[]};
  evidence?: {operation?: string; apiPath?: string; sourceIds?: string[]; checked?: string; scope?: string; status: 'reference-only' | 'checked' | 'needs-context' | 'unsupported'};
};

/** Editorial interpretation of the existing field help, not an AWS API mapping. */
const intentFields: Record<string, string[]> = {
  kiro: ['verificationChecks', 'reviewGeneratedDiff', 'allowedTools.approvalRequired'],
  agentcore: ['memoryPolicy', 'outboundTools.humanApproval'],
  bedrock: ['inputBoundary'],
  quick: ['sensitiveDataPolicy'],
  'secrets-manager': ['cacheTtlSeconds'],
  amplify: ['deploymentChecks'],
  cloudshell: ['task'],
  codeartifact: ['packageVersions', 'promotion'],
};

export function flattenConfigurationFields(fields: ConfigField[], parent = ''): {path: string; field: FieldWithEvidence}[] {
  return fields.flatMap(field => [{path: parent + field.key, field}, ...flattenConfigurationFields(field.itemFields ?? [], parent + field.key + '.')]);
}

export function describeFieldSurface(serviceId: string, path: string, field: FieldWithEvidence): FieldSurface {
  const editorialIntent = intentFields[serviceId]?.includes(path) ?? false;
  const documentation = field.documentation;
  return {
    path, label: field.label, kind: field.kind, section: field.section,
    disposition: field.semantics ?? (editorialIntent ? 'application-intent' : 'unclassified'),
    dispositionBasis: field.semantics ? 'declared-metadata' : editorialIntent ? 'editorial-classification' : 'not-classified',
    ...(editorialIntent && !field.semantics ? {dispositionNote: 'The current editor help describes an application/developer decision. No AWS API property or executed control is asserted.'} : {}),
    help: field.help,
    ...(field.documentationSource ? {documentationReference:{title:field.documentationSource.title,url:field.documentationSource.url,declaredChecked:field.documentationSource.verified,relationship:'reference' as const}} : {}),
    ...(field.evidence?.scope ? {documentationScope:field.evidence.scope} : {}),
    ...(field.source ? {reference: {title: field.source.title, url: field.source.url, declaredChecked: field.source.verified, relationship: 'reference' as const}} : {}),
    ...(field.audit ? {existingAudit: {...field.audit}} : {}),
    apiBinding: field.evidence?.operation && field.evidence.apiPath ? {status: 'declared-unreviewed', operation: field.evidence.operation, path: field.evidence.apiPath} : {status: 'not-mapped'},
    claimIds: claimEvidenceRegistry.filter(claim => claim.serviceId === serviceId && claim.fieldPaths.includes(path)).map(claim => claim.id),
    documentation: {
      purpose: !!documentation?.purpose?.trim(), whenToUse: !!documentation?.whenToUse?.trim(), omission: !!documentation?.omission?.trim(),
      effects: !!documentation?.effects?.some(value => value.trim()), examples: !!documentation?.examples?.some(value => value.explanation.trim()), relatedLessons: !!documentation?.relatedLessons?.length,
    },
    hasDeclaredDefault: field.defaultValue !== undefined, hasQuotaMetadata: field.awsLimit !== undefined,
    ...(field.when ? {condition: {field: field.when.field, values: [...field.when.values]}} : {}),
  };
}

const briefSections = ['useCases', 'examFocus', 'configuration', 'security', 'reliability', 'observability', 'misconceptions', 'caveats'] as const;
/** A chapter mention or multi-skill question is not a primary scenario for every skill. */
export function isPrimarySkillQuestion(question:StudyQuestion):boolean {
  return ['configuration','authored'].includes(question.origin)&&question.examVersions.includes('DVA-C03')&&question.skillRefs.length===1&&configurationSkills.some(skill=>question.skillRefs[0]===`DVA-C03:${skill.id}`);
}
export function buildServiceSurfaceManifest(): ServiceSurfaceManifest[] {
  return canvasCatalog.map(service => {
    const detail = getServiceDetail(service.id), profile = architectureProfilesData[service.id];
    const fields = configurationFields[service.id] ?? [];
    return {
      serviceId: service.id, name: service.name, category: service.category,
      catalogScope: ['appsync', 'q-developer'].includes(service.id) ? 'legacy-compatibility' : 'C03-named-service',
      scope: profile?.purpose ?? service.purpose,
      surfaceStatus: 'editor-inventory-only', apiCompleteness: 'not-assessed',
      fields: flattenConfigurationFields(fields).map(({path, field}) => describeFieldSurface(service.id, path, field)), rootFieldCount: fields.length,
      limitations: [...(profile?.limitations ?? []), 'This manifest enumerates the application editor. It does not enumerate every property of an AWS API, account feature or service variant.'],
      study: {structuredBrief: !!detail, ...(detail ? {declaredReviewStatus: detail.reviewStatus} : {}), sectionsMissing: [...briefSections.filter(key => !detail?.[key]?.length), ...(!detail?.example?.trim() ? ['example'] : []), ...(!detail?.sources?.length ? ['sources'] : [])]},
      practice: {
        configurationCaseIds: configurationPracticeCases.filter(item => item.serviceIds.includes(service.id)).map(item => item.id),
        knowledgeCheckIds: configurationKnowledgeChecks.filter(item => item.serviceIds.includes(service.id)).map(item => item.id),
        questionIds: questionBank.filter(item=>item.serviceIds.includes(service.id)).map(item=>item.id),
        standaloneExercises:serviceExercises.filter(item=>item.serviceId===service.id).map(({id,kind,scopeLabel})=>({id,kind,scopeLabel})),
      },
      labIds:labDefinitions.filter(lab=>lab.serviceIds.includes(service.id)).map(lab=>lab.id),
    };
  });
}

export function buildSkillEvidence(): SkillEvidence[] {
  return configurationSkills.map(skill => ({
    id: skill.id, examVersion: 'DVA-C03', title: skill.title, learningMode: skill.learningMode,
    source: {title: 'Official skill context', url: skill.sourceUrl, declaredChecked: skill.verified, relationship: 'reference'},
    // Exact skill IDs only. Task-level metadata is not silently expanded to every child skill.
    fieldMappings: Object.entries(configurationFields).flatMap(([serviceId, fields]) => flattenConfigurationFields(fields).filter(({field}) => field.objectives?.includes(skill.id)).map(({path}) => ({serviceId, path}))),
    theoryLinks: (configurationTheoryLinks[skill.id] ?? []).map(link => ({...link, resolves: !!chapters.find(chapter => chapter.id === link.chapter && chapter.examVersions?.includes('DVA-C03'))?.sections.some(section => section.id === link.section)})),
    configurationCaseIds: configurationPracticeCases.filter(item => item.skills.includes(skill.id)).map(item => item.id),
    knowledgeCheckIds: configurationKnowledgeChecks.filter(item => item.skillId === skill.id).map(item => item.id),
    codeCaseIds: codePracticeCases.filter(item => item.skills.includes(skill.id)).map(item => item.id),
    questionIds:questionBank.filter(item=>item.examVersions.includes('DVA-C03')&&item.skillRefs.includes(`DVA-C03:${skill.id}`)).map(item=>item.id),
    primarySkillQuestionIds:questionBank.filter(item=>isPrimarySkillQuestion(item)&&item.skillRefs[0]===`DVA-C03:${skill.id}`).map(item=>item.id),
    completeness: 'not-assessed',
  }));
}

export function validateServiceSurfaceManifest(manifest: ServiceSurfaceManifest[]): string[] {
  const issues: string[] = [], seen = new Set<string>();
  for (const service of manifest) {
    if (seen.has(service.serviceId)) issues.push('Duplicate service: ' + service.serviceId);
    seen.add(service.serviceId);
    if (!canvasCatalog.some(item => item.id === service.serviceId)) issues.push('Unknown service: ' + service.serviceId);
    const expected = flattenConfigurationFields(configurationFields[service.serviceId] ?? []).map(item => item.path).sort();
    const actual = service.fields.map(field => field.path).sort();
    if (JSON.stringify(expected) !== JSON.stringify(actual)) issues.push(service.serviceId + ': missing, extra or duplicate field paths');
  }
  for (const service of canvasCatalog) if (!seen.has(service.id)) issues.push('Missing service: ' + service.id);
  issues.push(...validateClaimEvidence(claimEvidenceRegistry, new Map(manifest.map(service => [service.serviceId, new Set(service.fields.map(field => field.path))]))));
  return issues;
}
