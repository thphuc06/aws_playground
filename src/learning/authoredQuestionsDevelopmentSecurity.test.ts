import {describe,it,expect} from 'vitest';
import {authoredDevelopmentSecurityQuestions as questions,authoredDevelopmentSecurityReview} from './authoredQuestionsDevelopmentSecurity';
import {configurationSkills} from '../configurationSkills';
import {chapters} from '../content';
import {canvasCatalog} from '../serviceCatalog';
import {scoreQuestion} from './practiceEngine';

describe('original C03 development/security question bank',()=>{
 it('has exactly two stable authored questions for all 37 primary skills',()=>{
  const skills=configurationSkills.filter(s=>s.id.startsWith('1.')||s.id.startsWith('2.'));
  expect(skills).toHaveLength(37);expect(questions).toHaveLength(74);
  expect(new Set(questions.map(q=>q.id)).size).toBe(74);
  for(const skill of skills){
   const matched=questions.filter(q=>q.skillRefs.includes(`DVA-C03:${skill.id}`));
   expect(matched.map(q=>q.id).sort(),skill.id).toEqual(['a','b'].map(v=>`authored-c03-${skill.id.replaceAll('.','-')}-${v}`));
   expect(matched[0].prompt).not.toBe(matched[1].prompt);expect(matched[0].explanation).not.toBe(matched[1].explanation);
  }
 });
 it('uses the shared registry contract and resolves chapter/service references without claiming extra primary skills',()=>{
  const skillIds=new Set(configurationSkills.map(s=>'DVA-C03:'+s.id));
  for(const q of questions){
   expect(q.origin).toBe('authored');expect(q.revision).toBe(1);expect(q.examVersions).toEqual(['DVA-C03']);expect(q.skillRefs).toHaveLength(1);expect(skillIds.has(q.skillRefs[0])).toBe(true);
   expect(q.chapterIds.length).toBeGreaterThan(0);for(const id of q.chapterIds)expect(chapters.find(c=>c.id===id)?.examVersions,id).toContain('DVA-C03');
   expect(q.serviceIds.length).toBeGreaterThan(0);for(const id of q.serviceIds)expect(canvasCatalog.some(s=>s.id===id),id).toBe(true);
  }
 });
 it('explains every distinct choice and supplies the appropriate answer-set shape',()=>{
  for(const q of questions){
   expect(new Set(q.options.map(o=>o.id)).size,q.id).toBe(q.options.length);expect(new Set(q.options.map(o=>o.text)).size,q.id).toBe(q.options.length);
   expect(new Set(q.correctOptionIds).size,q.id).toBe(q.correctOptionIds.length);
   for(const id of q.correctOptionIds)expect(q.options.some(o=>o.id===id),q.id+':'+id).toBe(true);
   for(const option of q.options)expect(option.explanation?.trim().length,q.id+':'+option.id).toBeGreaterThan(20);
   if(q.kind==='single-choice'){expect(q.options,q.id).toHaveLength(4);expect(q.correctOptionIds,q.id).toHaveLength(1)}else{expect(q.options.length,q.id).toBeGreaterThanOrEqual(5);expect(q.correctOptionIds.length,q.id).toBeGreaterThanOrEqual(2);expect(q.correctOptionIds.length).toBeLessThan(q.options.length);expect(q.prompt).toContain('Select two.')}
  }
  for(const domain of ['1.','2.'])expect(questions.some(q=>q.skillRefs[0].startsWith('DVA-C03:'+domain)&&q.kind==='multiple-response')).toBe(true);
 });
 it('scores full and partial selections using the production engine rather than position-dependent answer labels',()=>{
  for(const q of questions){
   const reordered={...q,options:[...q.options].reverse()};
   expect(scoreQuestion(reordered,[...q.correctOptionIds].reverse()),q.id).toBe('correct');
   expect(scoreQuestion(q,[]),q.id).toBe('unanswered');
   const incorrect=q.options.find(o=>!q.correctOptionIds.includes(o.id))!.id;
   expect(scoreQuestion(q,[incorrect]),q.id).toBe('incorrect');
   expect(()=>scoreQuestion(q,[q.correctOptionIds[0],q.correctOptionIds[0]]),q.id).toThrow();
   if(q.kind==='multiple-response'){
    expect(scoreQuestion(q,q.correctOptionIds.slice(1)),q.id).toBe('incorrect');
    expect(scoreQuestion(q,[...q.correctOptionIds,incorrect]),q.id).toBe('incorrect');
   }
  }
 });
 it('retains primary source links and an explicit author-review boundary',()=>{
  for(const q of questions){
   expect(q.sourceUrls.length,q.id).toBeGreaterThan(0);
   for(const value of q.sourceUrls){const url=new URL(value);expect(url.protocol,q.id).toBe('https:');expect(['docs.aws.amazon.com','kiro.dev']).toContain(url.hostname)}
  }
  expect(authoredDevelopmentSecurityReview.reviewed).toBe('2026-11-03');
  expect(authoredDevelopmentSecurityReview.limitations.some(x=>x.includes('independent editorial review'))).toBe(true);
 });
});
