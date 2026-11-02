import {describe, expect, it} from 'vitest';
import {canvasCatalog} from '../serviceCatalog';
import {configurationFields} from '../configurationRegistry';
import type {ConfigField} from '../configurationTypes';
import {buildServiceSurfaceManifest, buildSkillEvidence, describeFieldSurface, flattenConfigurationFields, validateServiceSurfaceManifest} from './serviceSurfaceManifest';
import {validateClaimEvidence} from './evidenceRegistry';
import type {ClaimEvidence} from './evidenceTypes';

describe('bounded learning surface inventory', () => {
  it('reconciles every catalog service and every nested editor field without equating that with AWS completeness', () => {
    const manifest = buildServiceSurfaceManifest();
    expect(manifest).toHaveLength(58);
    expect(new Set(manifest.map(service => service.serviceId))).toEqual(new Set(canvasCatalog.map(service => service.id)));
    expect(manifest.filter(service => service.catalogScope === 'C03-named-service')).toHaveLength(56);
    // This baseline is a minimum: new fields must be inventoried, not rejected for expanding the app.
    expect(manifest.flatMap(service => service.fields).length).toBeGreaterThanOrEqual(1405);
    expect(validateServiceSurfaceManifest(manifest)).toEqual([]);
    for (const service of manifest) {
      expect(service.apiCompleteness).toBe('not-assessed');
      expect(service.fields.map(field => field.path)).toEqual(flattenConfigurationFields(configurationFields[service.serviceId]).map(item => item.path));
    }
  });

  it('detects a missing nested path, duplicate service and unknown service rather than trusting totals', () => {
    const manifest = buildServiceSurfaceManifest();
    const service = manifest.find(item => item.fields.some(field => field.path.includes('.')))!;
    const index = service.fields.findIndex(field => field.path.includes('.'));
    service.fields.splice(index, 1);
    expect(validateServiceSurfaceManifest(manifest)).toContain(service.serviceId + ': missing, extra or duplicate field paths');
    manifest.push(structuredClone(manifest[0]));
    expect(validateServiceSurfaceManifest(manifest).some(issue => issue.startsWith('Duplicate service:'))).toBe(true);
    manifest[0].serviceId = 'invented-service';
    expect(validateServiceSurfaceManifest(manifest)).toContain('Unknown service: invented-service');
  });

  it('keeps inherited source references and imported audit scopes separate from independent claim review', () => {
    const field: ConfigField = {key: 'limit', label: 'Limit', kind: 'number', section: 'configuration', help: 'A bounded example.', source: {title: 'Overview', url: 'https://docs.aws.amazon.com/example', verified: '2026-11-01'}, audit: {checked: '2026-11-02', scope: 'An existing scoped check.'}};
    const result = describeFieldSurface('synthetic', 'limit', field);
    expect(result.disposition).toBe('unclassified');
    expect(result.apiBinding.status).toBe('not-mapped');
    expect(result.reference?.relationship).toBe('reference');
    expect(result.existingAudit?.scope).toBe(field.audit?.scope);
    expect(result.claimIds).toEqual([]);
  });

  it('supports explicit application intent without presenting a checkbox as an AWS API setting', () => {
    const field = configurationFields.kiro.find(item => item.key === 'reviewGeneratedDiff')!;
    const result = describeFieldSurface('kiro', field.key, field);
    expect(result.disposition).toBe('application-intent');
    expect(result.apiBinding.status).toBe('not-mapped');
    const declared = describeFieldSurface('synthetic', 'intent', {...field, semantics: 'exercise-input', documentation: {purpose: 'Practice only', omission: 'No practice input supplied'}, evidence: {status: 'checked', operation: 'Example', apiPath: 'Example.Input'}});
    expect(declared.disposition).toBe('exercise-input');
    expect(declared.apiBinding.status).toBe('declared-unreviewed');
    expect(declared.documentation).toMatchObject({purpose: true, omission: true, whenToUse: false, examples: false});
    expect(declared.claimIds).toEqual([]);
  });

  it('records all 72 C03 skills with independent theory, field and practice dimensions', () => {
    const skills = buildSkillEvidence();
    expect(skills).toHaveLength(72);
    expect(new Set(skills.map(skill => skill.examVersion + ':' + skill.id)).size).toBe(72);
    for (const skill of skills) {
      expect(skill.completeness).toBe('not-assessed');
      expect(skill.knowledgeCheckIds.length).toBeGreaterThan(0);
      expect(skill.theoryLinks.length).toBeGreaterThan(0);
      expect(skill.theoryLinks.every(link => link.resolves), skill.id).toBe(true);
      for (const mapping of skill.fieldMappings) expect(flattenConfigurationFields(configurationFields[mapping.serviceId]).find(item => item.path === mapping.path)?.field.objectives).toContain(skill.id);
    }
    // A question and a theory link do not invent a configuration exercise for that skill.
    expect(skills.some(skill => skill.knowledgeCheckIds.length > 0 && skill.configurationCaseIds.length === 0)).toBe(true);
  });
});

describe('claim review admission', () => {
  const paths = new Map([['lambda', new Set(['timeoutSeconds'])]]);
  const claim = (): ClaimEvidence => ({id: 'fixture-deadline', serviceId: 'lambda', fieldPaths: ['timeoutSeconds'], statement: 'Synthetic claim for validator testing, not an AWS fact.', applicability: 'Synthetic context', assumptions: [], exceptions: [], sources: [{title: 'Reference', url: 'https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html', relationship: 'reference'}], review: {status: 'reviewed'}, enforcement: 'local-rule', tests: []});
  it('rejects a reviewed rule without reviewer, actual claim support or meaningful test evidence', () => {
    const issues = validateClaimEvidence([claim()], paths);
    expect(issues).toContain('fixture-deadline: reviewer and review date required');
    expect(issues).toContain('fixture-deadline: a reference link alone does not support the reviewed claim');
    expect(issues.filter(issue => issue.includes('missing test evidence'))).toHaveLength(4);
  });
  it('accepts a structurally evidenced record while making no automated factual-verification claim', () => {
    const item = claim();
    item.review = {status: 'reviewed', reviewer: 'Synthetic test fixture', checked: '2026-11-02'};
    item.ruleId = 'fixture-rule';
    item.sources[0] = {...item.sources[0], relationship: 'claim-support', section: 'Synthetic review pointer'};
    item.tests = [{file: 'src/example.test.ts', case: 'accepts the bounded fixture', kind: 'positive'}, {file: 'src/example.test.ts', case: 'rejects invalid fixture', kind: 'negative'}];
    item.testExemptions = {boundary: 'No numeric boundary in the synthetic claim.', 'unknown-context': 'Synthetic contract has no external context.'};
    expect(validateClaimEvidence([item], paths)).toEqual([]);
    expect(validateClaimEvidence([item, item], paths)).toContain('fixture-deadline: missing or duplicate claim ID');
    item.sources[0].url = 'https://docs.aws.amazon.com.evil.example/fake';
    expect(validateClaimEvidence([item], paths)).toContain('fixture-deadline: source must be an official HTTPS reference');
    item.fieldPaths = ['missing'];
    expect(validateClaimEvidence([item], paths)).toContain('fixture-deadline: unknown field missing');
  });
});
