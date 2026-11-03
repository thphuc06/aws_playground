import {describe,it,expect} from 'vitest';
import {configurationSkills} from '../configurationSkills';
import {questionBank} from './questionRegistry';
import {availableSkillOptions,availableServiceOptions,matchesPracticeContext,skillPracticeEvidence} from './practiceEngine';
import {createLearningSession,eligibleQuestions,submitSessionAnswer} from './sessionEngine';
import {emptyLearningProgress,type LearningExam,type LearningProgress,type StudyQuestion} from './questionTypes';
const question=(id:string,overrides:Partial<StudyQuestion>={}):StudyQuestion=>({id,revision:1,examVersions:['DVA-C03'],skillRefs:['DVA-C03:1.2.2'],chapterIds:['dev-lambda'],serviceIds:['lambda'],kind:'single-choice',prompt:'Synthetic configuration contract',options:[{id:'a',text:'Correct boundary'},{id:'b',text:'Incorrect boundary'}],correctOptionIds:['a'],explanation:'Synthetic logic fixture.',sourceUrls:[],origin:'authored',...overrides});
const date=(day:number)=>new Date(`2026-01-${String(day).padStart(2,'0')}T10:00:00.000Z`);
function answer(progress:LearningProgress,q:StudyQuestion,id:string,selected:string[],day:number,exam:LearningExam='DVA-C03'){
 const next={...progress,sessions:[...progress.sessions,createLearningSession([q],exam,'learn',5,id,date(day))]};return submitSessionAnswer(next,id,selected,date(day));
}
describe('direct skill and service practice filters',()=>{
 it('offers exactly72 qualified C03 skills, while C02 includes only actual full skill references',()=>{
  const options=availableSkillOptions(questionBank,'DVA-C03',configurationSkills);expect(options).toHaveLength(72);expect(new Set(options.map(o=>o.id)).size).toBe(72);expect(options.every(o=>o.id.startsWith('DVA-C03:')&&o.questionCount>=3)).toBe(true);
  expect(availableSkillOptions(questionBank,'DVA-C02',configurationSkills)).toEqual([]);
  const bank=[question('shared',{examVersions:['DVA-C02','DVA-C03']}),question('c02-direct',{examVersions:['DVA-C02'],skillRefs:['DVA-C02:1.1.1']}),question('c02-task',{examVersions:['DVA-C02'],skillRefs:['DVA-C02:1.1']})];
  expect(availableSkillOptions(bank,'DVA-C02',configurationSkills).map(o=>o.id)).toEqual(['DVA-C02:1.1.1']);
 });
 it('intersects exam, chapter, exact skill and direct service tags without task expansion',()=>{
  const expected=question('lambda'),otherService=question('sqs',{serviceIds:['sqs']}),unmapped=question('unmapped',{skillRefs:[]}),otherExam=question('c02',{examVersions:['DVA-C02'],skillRefs:['DVA-C02:1.2.2']});const bank=[expected,otherService,unmapped,otherExam,expected];
  expect(eligibleQuestions(bank,emptyLearningProgress(),'DVA-C03','learn',{chapter:'dev-lambda',skill:'DVA-C03:1.2.2',service:'lambda'},date(3)).map(q=>q.id)).toEqual(['lambda']);
  expect(matchesPracticeContext(expected,'DVA-C03',{skill:'DVA-C03:1.2'})).toBe(false);expect(matchesPracticeContext(expected,'DVA-C03',{skill:'DVA-C02:1.2.2'})).toBe(false);expect(matchesPracticeContext(unmapped,'DVA-C03',{skill:'DVA-C03:1.2.2'})).toBe(false);
  expect(availableServiceOptions(bank,'DVA-C03',[{id:'lambda',name:'Lambda'},{id:'sqs',name:'SQS'}])).toEqual([{id:'lambda',title:'Lambda',questionCount:2},{id:'sqs',title:'SQS',questionCount:1}]);
 });
 it('filters due and unresolved-mistake pools using pinned metadata and never duplicates a session item',()=>{
  const lambda=question('lambda'),sqs=question('sqs',{serviceIds:['sqs']});let p=answer(emptyLearningProgress(),lambda,'lambda-wrong',['b'],1);p=answer(p,sqs,'sqs-wrong',['b'],1);
  const filtered=eligibleQuestions([lambda,sqs],p,'DVA-C03','mistakes',{service:'lambda',skill:'DVA-C03:1.2.2'},date(3));expect(filtered.map(q=>q.id)).toEqual(['lambda']);expect(eligibleQuestions([lambda,sqs],p,'DVA-C03','due-review',{service:'sqs'},date(3)).map(q=>q.id)).toEqual(['sqs']);
  expect(createLearningSession([...filtered,...filtered],'DVA-C03','mistakes',10,'dedup',date(3)).items).toHaveLength(1);
 });
});
describe('per-skill practice evidence',()=>{
 it('keeps first independent answers, assisted work, skips and legacy acknowledgements separate',()=>{
  const shared=question('shared',{examVersions:['DVA-C02','DVA-C03'],skillRefs:['DVA-C02:1.1.1','DVA-C03:1.2.2']});
  let p=answer(emptyLearningProgress(),shared,'c02-correct',['a'],1,'DVA-C02');p=answer(p,shared,'first-wrong',['b'],2);p=answer(p,shared,'assisted-correct',['a'],2);p=answer(p,shared,'skip',[],3);p=answer(p,shared,'later-correct',['a'],4);
  p=answer(p,question('chapter-only',{skillRefs:[]}), 'unmapped',['a'],4);p.legacyAcknowledgements.push({legacyKey:'old-mark',questionId:shared.id,provenance:'exam-and-time-unknown'});
  const [row]=skillPracticeEvidence([shared],p,'DVA-C03',['DVA-C03:1.2.2'],{},date(6));
  expect(row).toMatchObject({availableQuestions:1,distinctIndependentQuestions:1,firstIndependentCorrect:0,firstIndependentTotal:1,independentAnswers:2,assistedAnswers:1,skipped:1,latestIndependentAt:date(4).toISOString(),dueQuestions:1,unresolvedRevisions:0});
  expect(skillPracticeEvidence([shared],p,'DVA-C02',['DVA-C02:1.1.1'],{},date(6))[0]).toMatchObject({firstIndependentCorrect:1,firstIndependentTotal:1,assistedAnswers:0});
 });
 it('retains historical service/skill context instead of reclassifying it from a newer bank revision',()=>{
  const old=question('changed'),current=question('changed',{revision:2,serviceIds:['sqs'],skillRefs:['DVA-C03:1.2.3']});const p=answer(emptyLearningProgress(),old,'old-version',['b'],1);
  const lambda=skillPracticeEvidence([current],p,'DVA-C03',['DVA-C03:1.2.2','DVA-C03:1.2.3'],{service:'lambda'},date(3));expect(lambda[0]).toMatchObject({availableQuestions:0,distinctIndependentQuestions:1,firstIndependentTotal:1,unresolvedRevisions:1,dueQuestions:0});expect(lambda[1].firstIndependentTotal).toBe(0);
  const sqs=skillPracticeEvidence([current],p,'DVA-C03',['DVA-C03:1.2.3'],{service:'sqs'},date(3))[0];expect(sqs).toMatchObject({availableQuestions:1,firstIndependentTotal:0,latestIndependentAt:undefined});
 });
 it('excludes future, cross-exam, task-only and legacy-only records from current skill credit',()=>{
  const q=question('future');const p=answer(emptyLearningProgress(),q,'future-attempt',['a'],9);p.legacyAcknowledgements.push({legacyKey:'legacy-success',questionId:q.id,provenance:'exam-and-time-unknown'});
  expect(skillPracticeEvidence([q],p,'DVA-C03',['DVA-C03:1.2.2','DVA-C03:1.2','DVA-C02:1.2.2'],{},date(3))).toEqual([expect.objectContaining({skill:'DVA-C03:1.2.2',firstIndependentTotal:0,dueQuestions:0,latestIndependentAt:undefined})]);
 });
});
