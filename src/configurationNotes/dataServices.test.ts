import {describe, expect, it} from 'vitest';
import {configurationFields, checkField} from '../configurationRegistry';
import type {ConfigField} from '../configurationTypes';
import {chapters} from '../content';
import {dataServiceNotes, dataNoteSources} from './dataServices';

const flatten = (fields: ConfigField[], parent = ''): {path: string; field: ConfigField}[] => fields.flatMap(field => [{path: parent + field.key, field}, ...flatten(field.itemFields ?? [], parent + field.key + '.')]);

describe('data-service decision notes', () => {
  it('reconciles all 299 paths in the 11 assigned services, including nested fields', () => {
    expect(Object.keys(dataServiceNotes).sort()).toEqual(['athena', 'aurora', 'dynamodb', 'ebs', 'efs', 'elasticache', 'firehose', 'glacier', 'opensearch', 'rds', 's3'].sort());
    let count = 0;
    for (const [service, notes] of Object.entries(dataServiceNotes)) {
      const fields = flatten(configurationFields[service]);
      expect(Object.keys(notes).sort(), service).toEqual(fields.map(item => item.path).sort());
      count += fields.length;
      for (const {path, field} of fields) {
        const note = notes[path], docs = note.documentation;
        expect(docs.purpose.trim(), service + ':' + path).not.toBe('');
        expect(docs.whenToUse).not.toBe(docs.purpose);
        expect(docs.omission.trim()).not.toBe('');
        expect(docs.effects.length).toBeGreaterThan(0);
        expect(docs.examples.length).toBeGreaterThan(0);
        for (const example of docs.examples) {
          // Structure and parsing only. Samples are not complete deployable AWS resources.
          expect(checkField(field, example.value, false), service + ':' + path).toEqual([]);
          expect(example.explanation.trim()).not.toBe('');
        }
        for (const lesson of docs.relatedLessons) expect(chapters.some(chapter => chapter.id === lesson && chapter.examVersions?.includes('DVA-C03')), service + ':' + path + ' -> ' + lesson).toBe(true);
        for (const sourceId of note.evidence.sourceIds) expect(dataNoteSources[sourceId as keyof typeof dataNoteSources]).toEqual(note.source);
      }
    }
    expect(count).toBe(299);
  });

  it('keeps application behavior and observed endpoints separate from service settings', () => {
    const intents = [['elasticache', 'stampedeProtection'], ['elasticache', 'ttlSeconds'], ['rds', 'queryTimeoutMs'], ['aurora', 'poolMaxConnections'], ['dynamodb', 'retryAndUnprocessedItems'], ['s3', 'presignedAccess.keyPattern'], ['opensearch', 'bulkFailures'], ['firehose', 'formatConversion']];
    for (const [service, path] of intents) expect(dataServiceNotes[service][path].semantics, service + ':' + path).toBe('application-intent');
    expect(dataServiceNotes.rds.writerEndpoint.semantics).toBe('observed-output');
    expect(dataServiceNotes.dynamodb.streamViewType.semantics).toBe('aws-setting');
  });

  it('explains storage and database variants rather than declaring universal defaults', () => {
    expect(dataServiceNotes.dynamodb.ttlAttribute.evidence.scope).toMatch(/asynchronous cleanup/);
    expect(dataServiceNotes.dynamodb.readConsistency.documentation.effects.join(' ')).toMatch(/GSI.*not offer strongly consistent/);
    expect(dataServiceNotes.s3.bucketType.documentation.effects.join(' ')).toMatch(/directory bucket/);
    expect(dataServiceNotes.s3.presignedAccess.evidence.scope).toMatch(/reusable/);
    expect(dataServiceNotes.glacier.restoreDays.documentation.effects.join(' ')).toMatch(/not.*GLACIER_IR/);
    expect(dataServiceNotes.rds.deploymentType.evidence.scope).toMatch(/standby does not serve reads/);
    expect(dataServiceNotes.aurora.minCapacityAcu.documentation.effects.join(' ')).toMatch(/cannot be assumed/);
    expect(dataServiceNotes.efs['lifecycle.transition'].documentation.effects.join(' ')).toMatch(/no inactive-day/);
    expect(dataServiceNotes.opensearch.accessPolicy.evidence.scope).toMatch(/not a Serverless policy schema/);
    expect(dataServiceNotes.firehose.bufferSizeMb.evidence.scope).toMatch(/destination-specific/);
  });

  it('uses service-appropriate network examples and preserves protocol-dependent interpretation', () => {
    for (const [service, port] of [['rds', 5432], ['aurora', 5432], ['elasticache', 6379], ['efs', 2049]] as const) {
      const notes = dataServiceNotes[service];
      expect(notes['securityRules.fromPort'].documentation.examples[0].value).toBe(port);
      expect(notes['securityRules.toPort'].documentation.examples[0].value).toBe(port);
      expect(notes['securityRules.fromPort'].evidence.scope).toMatch(/ICMP.*type\/code/);
      expect(notes.securityRules.semantics).toBe('application-intent');
      expect(notes['securityRules.peer'].documentation.effects.join(' ')).toMatch(/does not attach/);
    }
  });

  it('keeps policy examples scoped and query/mapping documents syntactically meaningful', () => {
    const bucketPolicy = JSON.parse(dataServiceNotes.s3.bucketPolicy.documentation.examples[0].value as string);
    expect(bucketPolicy.Statement[0].Action).toBe('s3:GetObject');
    expect(bucketPolicy.Statement[0].Resource).toMatch(/\/reports\/\*$/);
    expect(bucketPolicy.Statement[0].Principal.AWS).toMatch(/:role\/study-worker$/);
    const condition = JSON.parse(dataServiceNotes.dynamodb.keyCondition.documentation.examples[0].value as string);
    expect(condition.ExpressionAttributeValues[':tenant']).toEqual({S: 'demo-tenant'});
    const mapping = JSON.parse(dataServiceNotes.opensearch['indexes.mapping'].documentation.examples[0].value as string);
    expect(mapping.properties.reportId.type).toBe('keyword');
    expect(mapping.properties.title.type).toBe('text');
  });

  it('does not add hidden validation bounds, applied defaults or independent approval labels', () => {
    for (const notes of Object.values(dataServiceNotes)) for (const note of Object.values(notes)) {
      expect(['reference-only', 'needs-context']).toContain(note.evidence.status);
      expect(note.evidence.scope.trim()).not.toBe('');
      for (const key of ['defaultValue', 'min', 'max', 'allowedNumbers', 'when']) expect(note).not.toHaveProperty(key);
      expect(note.evidence).not.toHaveProperty('checked');
      expect(new URL(note.source.url).hostname).toBe('docs.aws.amazon.com');
      expect(note.source.verified).toBe('2026-11-03');
    }
  });
});
