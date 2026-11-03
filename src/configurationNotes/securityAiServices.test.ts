import {describe,it,expect} from 'vitest';
import {parse} from 'yaml';
import {configurationFields,checkField} from '../configurationRegistry';
import type {ConfigField} from '../configurationTypes';
import {chapters} from '../content';
import {securityAiServiceNotes as notes,securityAiNoteSources as sources} from './securityAiServices';
const flatten=(fields:ConfigField[],parent=''):{path:string;field:ConfigField}[]=>fields.flatMap(field=>[{path:parent+field.key,field},...flatten(field.itemFields??[],parent+field.key+'.')]);
describe('identity, security and AI per-field guidance',()=>{
 it('covers exactly245 current paths across14 services, including every table column',()=>{
  expect(Object.keys(notes).sort()).toEqual(['iam','sts','cognito','kms','secrets-manager','private-ca','waf','systems-manager','bedrock','agentcore','quick','kiro','appsync','q-developer'].sort());let count=0;
  for(const [service,entries]of Object.entries(notes)){
   const fields=flatten(configurationFields[service]);expect(Object.keys(entries).sort(),service).toEqual(fields.map(f=>f.path).sort());count+=fields.length;
   for(const {path,field}of fields){const note=entries[path],d=note.documentation;expect(d.purpose.trim(),service+'.'+path).not.toBe('');expect(d.whenToUse).not.toBe(d.purpose);expect(d.omission.trim()).not.toBe('');expect(d.effects.length).toBeGreaterThan(0);expect(d.examples.length).toBeGreaterThan(0);
    for(const example of d.examples){expect(checkField(field,example.value,false),service+'.'+path).toEqual([]);expect(example.explanation.trim()).not.toBe('')}
    for(const lesson of d.relatedLessons)expect(chapters.some(c=>c.id===lesson&&c.examVersions?.includes('DVA-C03')),service+'.'+path+' -> '+lesson).toBe(true);
    expect(note.evidence.scope.trim()).not.toBe('');for(const id of note.evidence.sourceIds)expect(sources[id as keyof typeof sources]).toEqual(note.source);
   }
  }expect(count).toBe(245);
 });
 it('keeps requirements, exercises and observed setup separate from native settings',()=>{
  expect(notes.iam.analysisMode.semantics).toBe('exercise-input');expect(notes.sts.mfaContextProvided.semantics).toBe('exercise-input');expect(notes.sts.roleChaining.semantics).toBe('observed-output');expect(notes.quick.adminManaged.semantics).toBe('observed-output');
  for(const [service,path]of [['iam','requireMfa'],['cognito','appClients.pkce'],['bedrock','requestTimeoutSeconds'],['bedrock','safeTelemetry'],['agentcore','outboundTools.humanApproval'],['agentcore','sessionIsolation'],['kiro','reviewGeneratedDiff'],['q-developer','requireApproval']])expect(notes[service][path].semantics,service+'.'+path).toBe('application-intent');
  expect(notes.kms.keySpec.semantics).toBe('aws-setting');expect(notes.cognito['appClients.accessTokenMinutes'].semantics).toBe('aws-setting');
 });
 it('states the nontrivial product and authorization boundaries',()=>{
  expect(notes.waf.scope.evidence.scope).toContain('Amplify requires Global CloudFront');expect(notes.waf.protectedResource.documentation.effects.join(' ')).toContain('Gateway');expect(notes.waf.redactedFields.documentation.effects.join(' ')).toContain('sampled requests');
  expect(notes['secrets-manager'].rotationFunction.evidence.scope).toContain('Managed rotation does not use a Lambda');expect(notes.kms.encryptionContext.evidence.scope).toContain('not asymmetric/HMAC');expect(notes.kms.rotationEnabled.evidence.scope).toContain('does not re-encrypt');
  expect(notes.agentcore.jwtConfiguration.documentation.effects.join(' ')).toContain('not create multiple native authorizers');expect(notes.agentcore['outboundTools.humanApproval'].documentation.effects.join(' ')).toContain('does not mean approval');expect(notes.quick.knowledgeAccess.evidence.scope).toContain('admin-managed SharePoint/Google Drive');expect(notes['q-developer'].redactTelemetry.documentation.effects.join(' ')).toContain('cannot guarantee zero');
 });
 it('uses parseable examples without confusing artifact formats or applying permissions',()=>{
  const trust=JSON.parse(notes.iam.trustPolicy.documentation.examples[0].value as string);expect(trust.Statement[0]).toMatchObject({Principal:{Service:'lambda.amazonaws.com'},Action:'sts:AssumeRole'});expect(trust.Statement[0].Resource).toBeUndefined();
  const keyPolicy=JSON.parse(notes.kms.keyPolicy.documentation.examples[0].value as string);expect(keyPolicy.Statement[0].Action).toBe('kms:Decrypt');expect(keyPolicy.Statement[0].Resource).toBe('*');
  const doc=parse(notes['systems-manager'].document.documentation.examples[0].value as string);expect(doc.schemaVersion).toBe('2.2');expect(doc.mainSteps[0].action).toBe('aws:runShellScript');
  const guardrail=JSON.parse(notes.bedrock.guardrailConfiguration.documentation.examples[0].value as string);expect(guardrail.guardrailVersion).toBe('1');expect(notes.appsync.schemaReference.documentation.examples[0].value).toBe('graphql/schema.graphql');
 });
 it('adds reference guidance without changing schema constraints or implying exhaustive verification',()=>{
  for(const service of Object.values(notes))for(const note of Object.values(service)){
   expect(['reference-only','needs-context']).toContain(note.evidence.status);expect(note).not.toHaveProperty('defaultValue');expect(note).not.toHaveProperty('min');expect(note).not.toHaveProperty('max');expect(note.evidence).not.toHaveProperty('checked');expect(note.source.verified).toBe('2026-11-03');expect(['docs.aws.amazon.com','kiro.dev']).toContain(new URL(note.source.url).hostname);
  }
 });
});
