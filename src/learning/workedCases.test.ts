import {describe,it,expect} from 'vitest';
import {chapters} from '../content';
import {canvasCatalog} from '../serviceCatalog';
import {workedCases,getWorkedCaseForChapter,type BilingualText} from './workedCases';

describe('bilingual chapter worked cases',()=>{
 it('provides one supplement for every C03 chapter without changing legacy chapter IDs',()=>{
  const expected=chapters.filter(c=>c.examVersions?.includes('DVA-C03')).map(c=>c.id).sort();
  expect(workedCases).toHaveLength(20);
  expect(workedCases.map(c=>c.chapterId).sort()).toEqual(expected);
  expect(new Set(workedCases.map(c=>c.id)).size).toBe(workedCases.length);
  expect(getWorkedCaseForChapter('not-a-chapter')).toBeUndefined();
  expect(getWorkedCaseForChapter('iam')).toBeUndefined();
 });
 it('keeps version and service references valid and does not imply actual cloud execution',()=>{
  for(const c of workedCases){
   const chapter=chapters.find(ch=>ch.id===c.chapterId)!;
   for(const exam of c.examVersions)expect(chapter.examVersions).toContain(exam);
   for(const id of c.serviceIds)expect(canvasCatalog.some(s=>s.id===id),`${c.id}: ${id}`).toBe(true);
   expect(c.executionStatus).toBe('illustrative');
   expect(c.limitations.some(l=>l.en.includes('not observations from an AWS account'))).toBe(true);
  }
 });
 it('has complete, distinct EN/VI guidance for the diagnostic cycle and transfer question',()=>{
  const text=(value:BilingualText)=>{expect(value.en.trim().length).toBeGreaterThan(10);expect(value.vi.trim().length).toBeGreaterThan(10);expect(value.vi).not.toBe(value.en)};
  for(const c of workedCases){
   for(const field of [c.assumptions,c.expectedObservations,c.diagnosis,c.repair,c.verification]){expect(field.length,`${c.id} missing a reasoning step`).toBeGreaterThanOrEqual(2);field.forEach(text)}
   [c.title,c.input.description,c.failure,c.transferQuestion.question,c.transferQuestion.answer,...c.limitations].forEach(text);
   expect(c.input.code.length).toBeGreaterThan(50);
  }
 });
 it('supplies parseable JSON fixtures and primary sources with explicit review scope',()=>{
  for(const c of workedCases){
   if(c.input.language==='json')expect(()=>JSON.parse(c.input.code),c.id).not.toThrow();
   expect(c.sources.length).toBeGreaterThan(0);
   for(const source of c.sources){const url=new URL(source.url);expect(url.protocol).toBe('https:');expect(url.hostname).toBe('docs.aws.amazon.com');expect(source.scope.length).toBeGreaterThan(15);expect(source.verified).toMatch(/^\d{4}-\d{2}-\d{2}$/)}
  }
 });
 it('uses internally consistent boundary fixtures rather than unexplained answer labels',()=>{
  const canary=JSON.parse(getWorkedCaseForChapter('progressive-release')!.input.code);
  const candidateRate=100*canary.candidate.errors/canary.candidate.requests;
  const overallRate=100*(canary.candidate.errors+canary.stable.errors)/(canary.candidate.requests+canary.stable.requests);
  expect(candidateRate).toBe(10);expect(overallRate).toBe(2);expect(candidateRate).toBeGreaterThan(canary.candidateStopPercent);expect(overallRate).toBeLessThan(canary.candidateStopPercent);
  const batch=JSON.parse(getWorkedCaseForChapter('dev-events')!.input.code);
  expect(batch.handlerResponse.batchItemFailures.map((f:{itemIdentifier:string})=>f.itemIdentifier)).toEqual(batch.records.filter((r:{outcome:string})=>r.outcome!=='stored').map((r:{messageId:string})=>r.messageId));
  const link=JSON.parse(getWorkedCaseForChapter('dev-objects')!.input.code);
  expect(link.requestAtMinute).toBeLessThan(link.requestedLinkMinutes);expect(link.requestAtMinute).toBeGreaterThan(link.signerSessionRemainingMinutes);
 });
 it('uses the declared full item key in both conditional-create attempts and in the condition',()=>{
  const fixture=JSON.parse(getWorkedCaseForChapter('dev-data-safety')!.input.code);
  const partitionKey=fixture.tableKeySchema.partitionKey;
  expect(fixture.tableKeySchema.sortKey).toBeNull();
  const conditionAttribute=/^attribute_not_exists\((\w+)\)$/.exec(fixture.proposedCondition)?.[1];
  expect(conditionAttribute).toBe(partitionKey);
  for(const attempt of [fixture.attemptA,fixture.attemptB]){
   expect(Object.hasOwn(attempt,partitionKey)).toBe(true);
   expect(typeof attempt[partitionKey]).toBe('string');
   expect(attempt[partitionKey].length).toBeGreaterThan(0);
  }
  expect(fixture.attemptA[partitionKey]).toBe(fixture.attemptB[partitionKey]);
  expect(fixture.attemptA.owner).not.toBe(fixture.attemptB.owner);
 });
});
