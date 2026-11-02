import {describe, expect, it} from 'vitest';
import {configurationFields, checkField} from '../configurationRegistry';
import type {ConfigField} from '../configurationTypes';
import {chapters} from '../content';
import {eventServiceNotes, eventNoteSources} from './eventServices';

const flatten = (fields: ConfigField[], parent = ''): {path: string; field: ConfigField}[] => fields.flatMap(field => [{path: parent + field.key, field}, ...flatten(field.itemFields ?? [], parent + field.key + '.')]);

describe('event-service decision notes', () => {
  it('covers exactly the 258 existing paths in the seven assigned services, including table children', () => {
    expect(Object.keys(eventServiceNotes).sort()).toEqual(['api', 'eventbridge', 'kinesis', 'lambda', 'sns', 'sqs', 'step-functions'].sort());
    let count = 0;
    for (const [service, notes] of Object.entries(eventServiceNotes)) {
      const fields = flatten(configurationFields[service]);
      expect(Object.keys(notes).sort(), service).toEqual(fields.map(item => item.path).sort());
      count += fields.length;
      for (const {path, field} of fields) {
        const note = notes[path];
        const documentation = note.documentation;
        expect(documentation.purpose.trim(), service + ':' + path).not.toBe('');
        expect(documentation.whenToUse).not.toBe(documentation.purpose);
        expect(documentation.omission.trim()).not.toBe('');
        expect(documentation.effects.length).toBeGreaterThan(0);
        expect(documentation.examples.length).toBeGreaterThan(0);
        for (const example of documentation.examples) {
          // Shape/parse compatibility only: never a claim of deployed AWS validity.
          expect(checkField(field, example.value, false), service + ':' + path).toEqual([]);
          expect(example.explanation.trim()).not.toBe('');
        }
        for (const lesson of documentation.relatedLessons) expect(chapters.some(chapter => chapter.id === lesson && chapter.examVersions?.includes('DVA-C03')), service + ':' + path + ' -> ' + lesson).toBe(true);
        expect(note.evidence.scope.trim()).not.toBe('');
        for (const sourceId of note.evidence.sourceIds) expect(eventNoteSources[sourceId as keyof typeof eventNoteSources]).toEqual(note.source);
      }
    }
    expect(count).toBe(258);
  });

  it('distinguishes observed confirmation and test inputs from application decisions and service settings', () => {
    expect(eventServiceNotes.sns['subscriptions.confirmed'].semantics).toBe('observed-output');
    for (const [service, path] of [['api', 'testRequest'], ['eventbridge', 'sampleEvent'], ['eventbridge', 'patternTestMode'], ['step-functions', 'syntheticInput']]) expect(eventServiceNotes[service][path].semantics).toBe('exercise-input');
    for (const [service, path] of [['lambda', 'idempotencyStrategy'], ['sqs', 'idempotentProcessing'], ['sns', 'deduplicationId'], ['kinesis', 'checkpointing'], ['api', 'authorizers.scopes']]) expect(eventServiceNotes[service][path].semantics).toBe('application-intent');
    expect(eventServiceNotes.lambda.memoryMb.semantics).toBe('aws-setting');
  });

  it('preserves important product and ownership boundaries instead of suggesting universal settings', () => {
    expect(eventServiceNotes.lambda.snapStart.evidence.scope).toMatch(/container/);
    expect(eventServiceNotes.lambda.timeoutSeconds.evidence.scope).toMatch(/Managed Instances/);
    expect(eventServiceNotes.lambda.fileSystems.evidence.scope).toMatch(/S3 Files/);
    expect(eventServiceNotes.api['stages.autoDeploy'].documentation.effects.join(' ')).toMatch(/REST/);
    expect(eventServiceNotes.api['authorizers.scopes'].documentation.whenToUse).toMatch(/routes/);
    expect(eventServiceNotes.sqs.batchWindowSeconds.documentation.effects.join(' ')).toMatch(/FIFO does not support/);
    expect(eventServiceNotes['step-functions']['tasks.integrationPattern'].evidence.scope).toMatch(/Express supports request-response/);
    expect(eventServiceNotes['step-functions']['catchPolicies.resultPath'].evidence.scope).toMatch(/JSONPath/);
    expect(eventServiceNotes.eventbridge.targets.evidence.scope).toMatch(/Classic/);
  });

  it('keeps nested JSON examples parseable at both envelope and embedded-document levels', () => {
    const filter = JSON.parse(eventServiceNotes.lambda['eventSourceMappings.filterCriteria'].documentation.examples[0].value as string);
    expect(JSON.parse(filter.Filters[0].Pattern)).toEqual({body: {kind: ['invoice']}});
    const transform = JSON.parse(eventServiceNotes.eventbridge['targets.inputTransformer'].documentation.examples[0].value as string);
    expect(transform.InputPathsMap).toEqual({invoice: '$.detail.invoiceId'});
    expect(transform.InputTemplate).toBe('{"invoiceId":<invoice>}');
    const queuePolicy = JSON.parse(eventServiceNotes.sqs.accessPolicy.documentation.examples[0].value as string);
    expect(queuePolicy.Statement[0].Principal).toEqual({Service: 'sns.amazonaws.com'});
    expect(queuePolicy.Statement[0].Condition.ArnEquals['aws:SourceArn']).toContain(':invoice-events');
  });

  it('does not turn a documentation pass into rule approval or implicit defaults', () => {
    for (const notes of Object.values(eventServiceNotes)) for (const note of Object.values(notes)) {
      expect(['reference-only', 'needs-context']).toContain(note.evidence.status);
      expect(note).not.toHaveProperty('defaultValue');
      expect(note).not.toHaveProperty('min');
      expect(note).not.toHaveProperty('max');
      expect(note.evidence).not.toHaveProperty('checked');
      expect(new URL(note.source.url).hostname).toBe('docs.aws.amazon.com');
      expect(note.source.verified).toBe('2026-11-03');
    }
  });
});
