import {describe,it,expect} from 'vitest';
import {configurationFields,checkField} from '../configurationRegistry';
import type {ConfigField} from '../configurationTypes';
import {chapters} from '../content';
import {deliveryServiceNotes,deliveryNoteSources} from './deliveryServices';
const flatten=(fields:ConfigField[],parent=''):{path:string;field:ConfigField}[]=>fields.flatMap(field=>[{path:parent+field.key,field},...flatten(field.itemFields??[],parent+field.key+'.')]);
describe('delivery and observability decision notes',()=>{
 it('covers every current field and nested column across all fifteen assigned services',()=>{
  expect(Object.keys(deliveryServiceNotes).sort()).toEqual(['amplify','cloudshell','codeartifact','codebuild','codedeploy','codepipeline','appconfig','cdk','cloudformation','cli','sam','xray','cloudtrail','cloudwatch','cloudwatch-logs'].sort());let count=0;
  for(const [service,notes]of Object.entries(deliveryServiceNotes)){
   const fields=flatten(configurationFields[service]);count+=fields.length;expect(Object.keys(notes).sort(),service).toEqual(fields.map(f=>f.path).sort());
   for(const {path,field}of fields){const note=notes[path],d=note.documentation,id=service+'.'+path;expect(d.purpose.length,id).toBeGreaterThan(12);expect(d.whenToUse,id).not.toBe(d.purpose);expect(d.omission.length,id).toBeGreaterThan(12);expect(d.effects[0]?.length,id).toBeGreaterThan(12);expect(d.examples.length,id).toBeGreaterThan(0);
    for(const ex of d.examples){expect(checkField(field,ex.value,false),id+' example shape only').toEqual([]);expect(ex.explanation.length,id).toBeGreaterThan(12)}
    expect(d.relatedLessons.length,id).toBeGreaterThan(0);for(const lesson of d.relatedLessons)expect(chapters.some(c=>c.id===lesson&&c.examVersions?.includes('DVA-C03')),id+' lesson').toBe(true);
    expect(note.source.verified).toBe('2026-11-03');expect(note.source.url).toMatch(/^https:\/\/docs\.aws\.amazon\.com\//);expect(note.evidence.scope.length,id).toBeGreaterThan(20);for(const sourceId of note.evidence.sourceIds)expect(deliveryNoteSources[sourceId as keyof typeof deliveryNoteSources],id+' source').toBeDefined();expect(note.evidence.sourceIds.some(sourceId=>deliveryNoteSources[sourceId as keyof typeof deliveryNoteSources].url===note.source.url),id+' primary source').toBe(true);
    expect(['reference-only','needs-context']).toContain(note.evidence.status);expect(note).not.toHaveProperty('defaultValue');expect(JSON.stringify(note)).not.toContain('\uFFFD');
   }
  }
  expect(count).toBe(266);
 });
 it('separates developer workflow, synthetic inputs and telemetry from native resource settings',()=>{
  for(const note of Object.values(deliveryServiceNotes.cdk))expect(note.semantics).toBe('application-intent');for(const note of Object.values(deliveryServiceNotes.cli))expect(note.semantics).toBe('application-intent');
  expect(deliveryServiceNotes.sam.testEvent.semantics).toBe('exercise-input');expect(deliveryServiceNotes.amplify['environmentVariables.type'].semantics).toBe('application-intent');expect(deliveryServiceNotes.cloudtrail.retentionDays.semantics).toBe('application-intent');expect(deliveryServiceNotes.xray.activeTracing.semantics).toBe('application-intent');
  expect(deliveryServiceNotes['cloudwatch-logs'].logFormat.semantics).toBe('application-intent');expect(deliveryServiceNotes.cloudwatch.customMetrics.semantics).toBe('application-intent');
 });
 it('preserves provider, permission and evidence boundaries',()=>{
  expect(deliveryServiceNotes.amplify.environmentVariables.documentation.effects[0]).toMatch(/string map.*not CodeBuild/);
  expect(deliveryServiceNotes.cloudshell.artifactHandling.documentation.effects[0]).toMatch(/ephemeral/);
  expect(deliveryServiceNotes.codebuild.timeoutMinutes.documentation.effects[0]).toMatch(/Lambda compute does not support/);
  expect(deliveryServiceNotes.codepipeline.stages.documentation.effects[0]).toMatch(/not the complete pipeline JSON/);
  expect(deliveryServiceNotes.cloudformation.stackPolicy.documentation.effects[0]).toMatch(/not an IAM/);
  expect(deliveryServiceNotes.sam.alias.documentation.effects[0]).toMatch(/AutoPublishAlias/);
  expect(deliveryServiceNotes.cli.query.documentation.effects[0]).toMatch(/not automatically server-side/);
  expect(deliveryServiceNotes.appconfig.retrievalRole.documentation.effects[0]).toMatch(/source access.*own identity/);
  expect(deliveryServiceNotes['cloudwatch-logs'].logClass.evidence.status).toBe('needs-context');expect(deliveryServiceNotes['cloudwatch-logs'].logClass.evidence.scope).toMatch(/one day.*two days/);
  expect(deliveryServiceNotes.cloudtrail.investigation.documentation.effects[0]).toMatch(/do not replace application request logs/);
  expect(deliveryServiceNotes.cloudwatch.customMetrics.documentation.effects[0]).toMatch(/does not publish/);
  expect(deliveryServiceNotes['cloudwatch-logs'].resourcePolicy.documentation.effects[0]).toMatch(/not a general IAM-user/);
 });
 it('keeps structured artifacts coherent without executing them',()=>{
  const build=JSON.parse(deliveryServiceNotes.codebuild.buildspec.documentation.examples[0].value as string);expect(build.artifacts['base-directory']).toBe('dist');expect(build.phases.build.commands).toContain('npm test');
  const template=JSON.parse(deliveryServiceNotes.sam.template.documentation.examples[0].value as string);expect(template.Transform).toBe('AWS::Serverless-2016-10-31');expect(template.Resources.OrdersHandler.Properties.AutoPublishAlias).toBe(deliveryServiceNotes.sam.alias.documentation.examples[0].value);
  const event=JSON.parse(deliveryServiceNotes.sam.testEvent.documentation.examples[0].value as string);expect(JSON.parse(event.body)).toEqual({item:'book'});
  const policy=JSON.parse(deliveryServiceNotes['cloudwatch-logs'].dataProtectionPolicy.documentation.examples[0].value as string);expect(policy.Statement[0].DataIdentifier).toEqual(policy.Statement[1].DataIdentifier);expect(policy.Statement[1].Operation.Deidentify.MaskConfig).toEqual({});
  const dashboard=JSON.parse(deliveryServiceNotes.cloudwatch.dashboard.documentation.examples[0].value as string);expect(dashboard.widgets[0].properties.metrics[0].slice(0,2)).toEqual(['Study/Orders','Latency']);
 });
});
