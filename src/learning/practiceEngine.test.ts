import {describe,it,expect} from 'vitest';
import {chapters} from '../content';
import {questionBank} from './questionRegistry';
import {adaptChapterQuestions} from './questionAdapters';
import {emptyLearningProgress,type StudyQuestion,type LearningProgress} from './questionTypes';
import {scoreQuestion,reviewState,progressEvidence,mistakeQuestions,unresolvedMistakeRevisions} from './practiceEngine';
import {advanceSession,createLearningSession,submitSessionAnswer,eligibleQuestions,revealSessionFeedback} from './sessionEngine';
import {migrateLegacyProgress} from './progressMigration';
import {exportLearningBackup,mergeLearningProgress,parseLearningBackup,validateLearningProgress} from './learningBackup';
export const sampleQuestion:StudyQuestion={id:'test:multi',revision:1,examVersions:['DVA-C03'],skillRefs:['DVA-C03:2.1.1'],chapterIds:[],serviceIds:['iam'],kind:'multiple-response',prompt:'Which two controls apply?',options:[{id:'a',text:'Trust policy'},{id:'b',text:'Caller permission'},{id:'c',text:'Resource name alone'}],correctOptionIds:['a','b'],explanation:'Check both the trust relationship and caller authorization in this bounded scenario.',sourceUrls:['https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html'],origin:'authored'};
const now=new Date('2026-11-03T00:00:00.000Z');
function initial(id='test-session'):LearningProgress{return {...emptyLearningProgress(),sessions:[createLearningSession([sampleQuestion],'DVA-C03','learn',5,id,now)]};}
describe('stable question adapters and learning evidence',()=>{
 it('adapts all153 existing items without changing the legacy objects',()=>{expect(questionBank).toHaveLength(153);expect(new Set(questionBank.map(q=>q.id)).size).toBe(153);expect(questionBank.every(q=>q.correctOptionIds.every(id=>q.options.some(o=>o.id===id)))).toBe(true);expect(questionBank.filter(q=>q.origin==='configuration')).toHaveLength(72)});
 it('keeps frozen chapter aliases after display reorder and rejects an unreviewed revision',()=>{const chapter=structuredClone(chapters[0]);const original=adaptChapterQuestions(chapter,()=>undefined);chapter.checks.reverse();expect(adaptChapterQuestions(chapter,()=>undefined).map(q=>q.id)).toEqual(original.map(q=>q.id).reverse());chapter.checks[0].question+=' edited';expect(()=>adaptChapterQuestions(chapter,()=>undefined)).toThrow('compatibility update')});
 it('requires the exact response set, rejects duplicates and scores skipped questions separately',()=>{expect(scoreQuestion(sampleQuestion,['b','a'])).toBe('correct');expect(scoreQuestion(sampleQuestion,['a'])).toBe('incorrect');expect(scoreQuestion(sampleQuestion,['a','b','c'])).toBe('incorrect');expect(scoreQuestion(sampleQuestion,[])).toBe('unanswered');expect(()=>scoreQuestion(sampleQuestion,['a','a'])).toThrow();expect(()=>scoreQuestion(sampleQuestion,['missing'])).toThrow()});
 it('pins question revisions, deduplicates Submit and preserves order when exported',()=>{let p=initial();const order=p.sessions[0].items[0].optionOrder;p=submitSessionAnswer(p,'test-session',['b','a'],now);expect(submitSessionAnswer(p,'test-session',['c'],now)).toBe(p);expect(p.attempts).toHaveLength(1);p=advanceSession(p,'test-session',now);expect(p.sessions[0].status).toBe('completed');expect(parseLearningBackup(exportLearningBackup(p))).toEqual(p);expect(p.attempts[0].optionOrder).toEqual(order);expect(validateLearningProgress(p).ok).toBe(true)});
 it('does not award independent evidence for a same-day repeat after seeing feedback',()=>{let p=submitSessionAnswer(initial(),'test-session',['c'],now);p=advanceSession(p,'test-session',now);p.sessions.push(createLearningSession([sampleQuestion],'DVA-C03','learn',5,'repeat',now));p=submitSessionAnswer(p,'repeat',['a','b'],now);expect(p.attempts[1].assistance).toBe('answer-revealed');expect(progressEvidence(p,'DVA-C03',now)).toMatchObject({distinctQuestions:1,firstCorrect:0});expect(progressEvidence(p,'DVA-C02',now).attempts).toBe(0)});
 it('tracks feedback across exams while keeping independent evidence exam-scoped',()=>{
  const shared:StudyQuestion={...sampleQuestion,examVersions:['DVA-C02','DVA-C03'],skillRefs:['DVA-C02:2.1.1','DVA-C03:2.1.1']};
  let p:LearningProgress={...emptyLearningProgress(),sessions:[createLearningSession([shared],'DVA-C02','learn',5,'c02',now)]};
  p=submitSessionAnswer(p,'c02',['c'],now);p.sessions.push(createLearningSession([shared],'DVA-C03','learn',5,'c03',now));p=submitSessionAnswer(p,'c03',['a','b'],now);
  expect(p.attempts[1]).toMatchObject({exam:'DVA-C03',assistance:'answer-revealed',skillRefs:['DVA-C03:2.1.1']});expect(progressEvidence(p,'DVA-C03',now).attempts).toBe(0);expect(progressEvidence(p,'DVA-C02',now).attempts).toBe(1);
 });
 it('uses the actual mixed-session reveal day rather than the previous submission day',()=>{
  const answeredAt=new Date('2026-11-03T23:00:00.000Z'),revealedAt=new Date('2026-11-04T00:30:00.000Z');
  let p:LearningProgress={...emptyLearningProgress(),sessions:[createLearningSession([sampleQuestion],'DVA-C03','mixed',5,'mixed',answeredAt)]};
  p=submitSessionAnswer(p,'mixed',['c'],answeredAt);expect(p.feedbackExposures).toEqual([]);p=advanceSession(p,'mixed',revealedAt);expect(p.feedbackExposures[0].revealedAt).toBe(revealedAt.toISOString());
  p.sessions.push(createLearningSession([sampleQuestion],'DVA-C03','learn',5,'repeat-mixed',revealedAt));p=submitSessionAnswer(p,'repeat-mixed',['a','b'],revealedAt);expect(p.attempts[1].assistance).toBe('answer-revealed');
 });
 it('refreshes exposure when completed feedback is reopened on a later day',()=>{
  let p=advanceSession(submitSessionAnswer(initial(),'test-session',['c'],now),'test-session',now);const reopened=new Date('2026-11-06T03:00:00.000Z');p=revealSessionFeedback(p,'test-session',reopened);
  p.sessions.push(createLearningSession([sampleQuestion],'DVA-C03','learn',5,'after-review',reopened));p=submitSessionAnswer(p,'after-review',['a','b'],reopened);expect(p.attempts[1].assistance).toBe('answer-revealed');expect(p.feedbackExposures.some(e=>e.revealedAt===reopened.toISOString())).toBe(true);
 });
 it('uses explicit UTC days across local midnight and ignores future feedback',()=>{
  const localEvening=new Date('2026-11-03T23:59:00+07:00'),localNextDay=new Date('2026-11-04T00:01:00+07:00');
  let p:LearningProgress={...emptyLearningProgress(),sessions:[createLearningSession([sampleQuestion],'DVA-C03','learn',5,'evening',localEvening)]};p=submitSessionAnswer(p,'evening',['c'],localEvening);
  p.sessions.push(createLearningSession([sampleQuestion],'DVA-C03','learn',5,'after-midnight',localNextDay));p=submitSessionAnswer(p,'after-midnight',['a','b'],localNextDay);expect(p.attempts[1].assistance).toBe('answer-revealed');
  const before=new Date('2026-11-03T00:00:00.000Z');p.sessions.push(createLearningSession([sampleQuestion],'DVA-C03','learn',5,'clock-before',before));p=submitSessionAnswer(p,'clock-before',['a','b'],before);expect(p.attempts[2].assistance).toBe('none');
 });
 it('keeps independent mistakes through skips and assisted correctness until an independent same-revision success',()=>{
  let p=submitSessionAnswer(initial(),'test-session',['c'],now);
  p.sessions.push(createLearningSession([sampleQuestion],'DVA-C03','learn',5,'assisted',now));p=submitSessionAnswer(p,'assisted',['a','b'],now);expect(eligibleQuestions([sampleQuestion],p,'DVA-C03','mistakes',undefined,now)).toHaveLength(1);
  const tomorrow=new Date('2026-11-04T00:00:00.000Z');p.sessions.push(createLearningSession([sampleQuestion],'DVA-C03','learn',5,'skip',tomorrow));p=submitSessionAnswer(p,'skip',[],tomorrow);expect(mistakeQuestions([sampleQuestion],p,'DVA-C03',tomorrow)).toHaveLength(1);
  const later=new Date('2026-11-05T00:00:00.000Z');p.sessions.push(createLearningSession([sampleQuestion],'DVA-C03','learn',5,'independent',later));p=submitSessionAnswer(p,'independent',['a','b'],later);expect(mistakeQuestions([sampleQuestion],p,'DVA-C03',later)).toEqual([]);
 });
 it('does not let a different revision or exam resolve an earlier independent mistake',()=>{
  let p=submitSessionAnswer(initial(),'test-session',['c'],now);const revised={...sampleQuestion,revision:2},later=new Date('2026-11-04T00:00:00.000Z');p.sessions.push(createLearningSession([revised],'DVA-C03','learn',5,'revision2',later));p=submitSessionAnswer(p,'revision2',['a','b'],later);
  expect(unresolvedMistakeRevisions(p.attempts,later)).toEqual([1]);expect(mistakeQuestions([revised],p,'DVA-C03',later)[0].revision).toBe(1);expect(mistakeQuestions([revised],p,'DVA-C02',later)).toEqual([]);expect(validateLearningProgress(p).ok).toBe(true);
 });
 it('preserves early schema2 history without fabricating feedback times and rejects forged exposure references',()=>{
  const p=submitSessionAnswer(initial(),'test-session',['c'],now),old:Record<string,unknown>={...structuredClone(p)};delete old.feedbackExposures;const checked=validateLearningProgress(old);expect(checked.ok).toBe(true);if(checked.ok){expect(checked.value.feedbackExposures).toEqual([]);expect(checked.value.attempts).toEqual(p.attempts)}
  const bad=structuredClone(p);bad.feedbackExposures[0].questionRevision=99;expect(validateLearningProgress(bad).ok).toBe(false);expect(parseLearningBackup(exportLearningBackup(p)).feedbackExposures).toEqual(p.feedbackExposures);
 });
 it('preserves historical success marks without inventing exam, date or attempts',()=>{const p=migrateLegacyProgress(JSON.stringify({version:1,read:['iam'],bookmarks:['unknown-older-chapter'],missions:['queue'],checks:['iam0','retired99']}));expect(p.attempts).toEqual([]);expect(p.legacyAcknowledgements[0]).toEqual({legacyKey:'iam0',questionId:'chapter:iam:001',provenance:'exam-and-time-unknown'});expect(p.legacyAcknowledgements[1].questionId).toBeUndefined();expect(p.bookmarks).toEqual(['unknown-older-chapter']);expect(()=>migrateLegacyProgress('{')).toThrow('recovery');expect(()=>migrateLegacyProgress('{"version":100}')).toThrow('unsupported')});
 it('spaces review without advancing on same-day repeats or future timestamps',()=>{let p=submitSessionAnswer(initial(),'test-session',['a','b'],now);const first=p.attempts[0];expect(reviewState([first],new Date('2026-11-03T23:59:59.000Z')).due).toBe(false);expect(reviewState([first],new Date('2026-11-04T00:00:00.000Z')).due).toBe(true);const next={...first,id:'next',submittedAt:'2026-11-04T00:00:00.000Z'};expect(reviewState([first,next],new Date('2026-11-04T00:00:00.000Z'))).toMatchObject({streak:2,dueAt:'2026-11-07T00:00:00.000Z'});expect(reviewState([next],now)).toEqual({due:false,streak:0});expect(progressEvidence({...p,attempts:[next]},'DVA-C03',now).attempts).toBe(0)});
 it('filters exam and revision queues without duplicating an undersized pool',()=>{const p=submitSessionAnswer(initial(),'test-session',['c'],now);expect(eligibleQuestions([sampleQuestion],p,'DVA-C03','mistakes',undefined,now)).toHaveLength(1);expect(eligibleQuestions([sampleQuestion],p,'DVA-C02','mistakes',undefined,now)).toEqual([]);expect(createLearningSession([sampleQuestion,sampleQuestion],'DVA-C03','learn',20,'dedup',now).items).toHaveLength(1)});
 it('rejects corrupted grading evidence and conflicting imported records',()=>{const p=submitSessionAnswer(initial(),'test-session',['c'],now),bad=structuredClone(p);bad.attempts[0].outcome='correct';expect(validateLearningProgress(bad).ok).toBe(false);const changed=structuredClone(p);changed.sessions[0].startedAt='2026-11-03T01:00:00.000Z';expect(()=>mergeLearningProgress(p,changed)).toThrow('Conflicting');expect(mergeLearningProgress(p,p).attempts).toHaveLength(1);expect(()=>parseLearningBackup('{"schemaVersion":3}')).toThrow('Unsupported')});
});
