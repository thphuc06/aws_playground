import {describe,it,expect} from 'vitest';
import {configurationFields,checkField} from '../configurationRegistry';
import type {ConfigField} from '../configurationTypes';
import {chapters} from '../content';
import {platformServiceNotes,platformNoteSources} from './platformServices';
const flatten=(fields:ConfigField[],parent=''):{path:string;field:ConfigField}[]=>fields.flatMap(field=>[{path:parent+field.key,field},...flatten(field.itemFields??[],parent+field.key+'.')]);

describe('platform service decision notes',()=>{
 it('covers exactly all 337 current field and table-column paths in its eleven services',()=>{
  expect(Object.keys(platformServiceNotes).sort()).toEqual(['ec2','elastic-beanstalk','ecr','ecs','eks','elb','cloudfront','route53','vpc','privatelink','acm'].sort());let count=0;
  for(const [service,notes]of Object.entries(platformServiceNotes)){
   const fields=flatten(configurationFields[service]);count+=fields.length;expect(Object.keys(notes).sort(),service).toEqual(fields.map(f=>f.path).sort());
   for(const {path,field}of fields){const note=notes[path],d=note.documentation,id=service+'.'+path;
    expect(d.purpose.length,id).toBeGreaterThan(12);expect(d.whenToUse,id).not.toBe(d.purpose);expect(d.omission.length,id).toBeGreaterThan(12);expect(d.effects[0]?.length,id).toBeGreaterThan(12);
    for(const ex of d.examples){expect(checkField(field,ex.value,false),id+' example shape only').toEqual([]);expect(ex.explanation.length,id).toBeGreaterThan(12)}
    expect(d.examples.length,id).toBeGreaterThan(0);expect(d.relatedLessons.length,id).toBeGreaterThan(0);for(const lesson of d.relatedLessons)expect(chapters.some(c=>c.id===lesson&&c.examVersions?.includes('DVA-C03')),id+' lesson').toBe(true);
    expect(note.source.verified).toBe('2026-11-03');expect(note.source.url).toMatch(/^https:\/\/(docs\.aws\.amazon\.com|kubernetes\.io)\//);expect(note.evidence.scope.length,id).toBeGreaterThan(20);
    for(const sourceId of note.evidence.sourceIds)expect(platformNoteSources[sourceId as keyof typeof platformNoteSources],id+' source').toEqual(note.source);
    expect(['reference-only','needs-context']).toContain(note.evidence.status);expect(note).not.toHaveProperty('defaultValue');expect(JSON.stringify(note)).not.toContain('\uFFFD');
   }
  }
  expect(count).toBe(337);
 });
 it('separates application requirements, Kubernetes desired state and returned certificate evidence',()=>{
  for(const key of ['workloadRole','architecture','environmentVariables','autoScaling','deploymentStrategy','cloudWatchAgent','healthEndpoint'])expect(platformServiceNotes.ec2[key].semantics,key).toBe('application-intent');
  for(const key of ['namespace','workloadKind','replicas','probes','cpuLimit','manifest'])expect(platformServiceNotes.eks[key].semantics,key).toBe('application-intent');
  for(const key of ['dnsValidationRecords','dnsValidationRecords.name','dnsValidationRecords.type','dnsValidationRecords.value'])expect(platformServiceNotes.acm[key].semantics,key).toBe('observed-output');
  expect(platformServiceNotes.privatelink.acceptanceRequired.semantics).toBe('application-intent');expect(platformServiceNotes.acm.renewalOwnership.semantics).toBe('application-intent');
 });
 it('makes deployment and network variant boundaries visible',()=>{
  expect(platformServiceNotes['elastic-beanstalk'].environmentTier.evidence.scope).toMatch(/Standard.*Cluster/);
  expect(platformServiceNotes.ecr.repositoryVisibility.documentation.effects[0]).toMatch(/separate API/);
  expect(platformServiceNotes.ecs.taskMemoryMb.evidence.scope).toMatch(/Linux Fargate/);
  expect(platformServiceNotes.ecs.executionRole.documentation.effects[0]).toMatch(/not the application/);
  expect(platformServiceNotes.elb['listeners.protocol'].evidence.scope).toMatch(/QUIC/);
  expect(platformServiceNotes.eks.cpuLimit.documentation.effects[0]).toMatch(/throttle/);
  expect(platformServiceNotes.cloudfront['origins.type'].documentation.effects[0]).toMatch(/website.*REST/);
  expect(platformServiceNotes.route53['records.ttlSeconds'].documentation.effects[0]).toMatch(/Alias TTL/);
  expect(platformServiceNotes.privatelink.endpointPolicy.documentation.effects[0]).toMatch(/does not replace/);
  expect(platformServiceNotes.acm.renewalOwnership.documentation.effects[0]).toMatch(/Imported.*not eligible/);
 });
 it('keeps example cross-references and structured artifacts internally coherent',()=>{
  const origins=platformServiceNotes.cloudfront.origins.documentation.examples[0].value as any[],behaviors=platformServiceNotes.cloudfront.behaviors.documentation.examples[0].value as any[];
  expect(behaviors[0].originId).toBe(origins[0].id);
  const task=JSON.parse(platformServiceNotes.ecs.taskDefinitionDocument.documentation.examples[0].value as string);expect(task.containerDefinitions[0].name).toBe(platformServiceNotes.ecs.targetContainerName.documentation.examples[0].value);expect(task.containerDefinitions[0].portMappings[0].containerPort).toBe(platformServiceNotes.ecs.targetContainerPort.documentation.examples[0].value);
  const policy=JSON.parse(platformServiceNotes.cloudfront.originAccessPolicy.documentation.examples[0].value as string);expect(policy.Statement[0].Condition.StringEquals['AWS:SourceArn']).toContain(':distribution/');
  const endpointPolicy=JSON.parse(platformServiceNotes.privatelink.endpointPolicy.documentation.examples[0].value as string);expect(endpointPolicy.Statement[0].Action).toBe('secretsmanager:GetSecretValue');
 });
});
