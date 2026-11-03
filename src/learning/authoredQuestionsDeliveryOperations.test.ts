import {describe,it,expect} from 'vitest';
import {chapters} from '../content';
import {canvasCatalog} from '../serviceCatalog';
import {configurationSkills} from '../configurationSkills';
import {authoredDeliveryOperationsQuestions as questions} from './authoredQuestionsDeliveryOperations';
import {deliveryOperationsSources,deliveryOperationsSourceReview} from './authoredQuestionsDeliveryOperations.sources';
const item=(skill:string,variant:string)=>questions.find(q=>q.id===`authored-c03-${skill.replaceAll('.','-')}-${variant}`)!;
const selectedText=(skill:string,variant:string)=>{const q=item(skill,variant);return q.options.filter(o=>q.correctOptionIds.includes(o.id)).map(o=>o.text).join(' ')};

describe('authored delivery and operations question inventory',()=>{
 it('adds exactly two stable primary-skill questions for all35 Domain3/4 skills',()=>{
  const skills=configurationSkills.filter(s=>s.id.startsWith('3.')||s.id.startsWith('4.'));expect(skills).toHaveLength(35);expect(questions).toHaveLength(70);expect(new Set(questions.map(q=>q.id)).size).toBe(70);
  for(const skill of skills){const pair=questions.filter(q=>q.skillRefs.includes(`DVA-C03:${skill.id}`));expect(pair.map(q=>q.id).sort()).toEqual(['a','b'].map(v=>`authored-c03-${skill.id.replaceAll('.','-')}-${v}`));expect(pair[0].prompt).not.toBe(pair[1].prompt);}
  for(const question of questions){expect(question.skillRefs).toHaveLength(1);expect(question.examVersions).toEqual(['DVA-C03']);expect(question.revision).toBe(1);expect(question.origin).toBe('authored');}
 });
 it('has complete distinct choices, appropriate answer cardinality and resolvable source/content links',()=>{
  const reviewedUrls=new Set<string>(Object.values(deliveryOperationsSources).map(s=>s[0]));
  for(const question of questions){
   expect(question.options.length).toBe(question.kind==='single-choice'?4:5);expect(new Set(question.options.map(o=>o.id)).size).toBe(question.options.length);expect(new Set(question.options.map(o=>o.text)).size).toBe(question.options.length);
   expect(question.correctOptionIds.length).toBeGreaterThanOrEqual(question.kind==='single-choice'?1:2);expect(question.correctOptionIds.length).toBeLessThan(question.options.length);if(question.kind==='single-choice')expect(question.correctOptionIds).toHaveLength(1);
   for(const option of question.options)expect(option.explanation?.trim().length,question.id+'/'+option.id).toBeGreaterThan(20);
   for(const id of question.correctOptionIds)expect(question.options.some(o=>o.id===id),question.id).toBe(true);
   for(const id of question.chapterIds)expect(chapters.some(c=>c.id===id&&c.examVersions?.includes('DVA-C03')),question.id+'/'+id).toBe(true);
   for(const id of question.serviceIds)expect(canvasCatalog.some(s=>s.id===id),question.id+'/'+id).toBe(true);
   expect(question.sourceUrls.length).toBeGreaterThan(0);for(const url of question.sourceUrls){expect(reviewedUrls.has(url),question.id+'/'+url).toBe(true);expect(['docs.aws.amazon.com','kiro.dev']).toContain(new URL(url).hostname);}
  }
  expect(deliveryOperationsSourceReview.checked).toBe('2026-11-03');expect(deliveryOperationsSourceReview.status).toContain('independent editorial review');
 });
 it('includes concrete fixtures for both questions in each explicitly code-focused skill',()=>{
  for(const skill of ['3.2.3','4.1.3','4.2.2'])for(const variant of ['a','b'])expect(item(skill,variant).snippet?.length,skill+variant).toBeGreaterThan(80);
 });
});

describe('discriminating scenario fixture checks',()=>{
 it('makes the incomplete HTTPv2 event fail at its absent metadata, not at body parsing',()=>{
  const raw=item('3.2.3','a').snippet!.split('// Incomplete fixture:\n')[1],fixture=JSON.parse(raw);
  expect(fixture.version).toBe('2.0');expect(JSON.parse(fixture.body)).toEqual({title:'demo'});
  const method=(event:any)=>event.requestContext.http.method;expect(()=>method(fixture)).toThrow();expect(()=>method({...fixture,httpMethod:'POST'})).toThrow();expect(method({...fixture,requestContext:{http:{method:'POST'}}})).toBe('POST');expect(selectedText('3.2.3','a')).toContain('requestContext.http.method');
 });
 it('identifies only the failed SQS record and tests normal partial-response return',()=>{
  const lines=item('3.2.3','b').snippet!.split('\n'),event=JSON.parse(lines[0].slice('Input: '.length)),response=JSON.parse(lines[1].slice('Expected: '.length));
  expect(event.Records.map((r:any)=>r.messageId)).toEqual(['m-1','m-2']);expect(response.batchItemFailures).toEqual([{itemIdentifier:'m-2'}]);expect(selectedText('3.2.3','b')).toContain('returns normally');
 });
 it('exposes the EMF root-reference and type issue in a parseable original event',()=>{
  const event=JSON.parse(item('4.2.2','a').snippet!),definition=event._aws.CloudWatchMetrics[0];expect(definition.Dimensions).toEqual([['Service']]);expect(definition.Metrics[0].Name).toBe('Latency');expect(event.Service).toBeUndefined();expect(event.Latency).toBeUndefined();
  const fixed={...event,Service:event.detail.Service,Latency:event.detail.Latency};expect(typeof fixed.Service).toBe('string');expect(typeof fixed.Latency).toBe('number');expect(selectedText('4.2.2','a')).toContain('at the root');
 });
 it('keeps the memory tradeoff a transparent usage calculation rather than a price claim',()=>{
  expect(1*.400).toBe(.4);expect(2*.250).toBe(.5);expect(selectedText('4.3.2','a')).toContain('0.40 to 0.50');expect(item('4.3.2','a').prompt).toContain('Ignore request charges and pricing tiers');
 });
 it('keeps initialization, build and trace-timing counterexamples distinct',()=>{
  expect(item('4.1.1','a').snippet).toContain('Runtime.ImportModuleError');expect(selectedText('4.1.1','a')).toContain('package paths');
  expect(item('4.1.4','a').snippet!.indexOf('INSTALL:')).toBeLessThan(item('4.1.4','a').snippet!.indexOf('UPLOAD_ARTIFACTS:'));expect(selectedText('4.1.4','a')).toContain('dependency-install error');
  expect(selectedText('4.1.2','a')).toContain('do not imply 1,400 ms');expect(selectedText('4.3.6','b')).toContain('premature 201');
 });
});
