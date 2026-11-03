import {it,expect} from 'vitest';
import {configurationSkills} from '../configurationSkills';
import {chapters} from '../content';
import {questionBank} from './questionRegistry';
it('registers three different primary-skill scenarios for every C03 skill',()=>{
 const primary=questionBank.filter(q=>q.origin==='configuration'||q.origin==='authored');
 expect(primary).toHaveLength(216);expect(questionBank).toHaveLength(297);
 expect(questionBank.every(question=>question.options.every(option=>!!option.explanation?.trim()))).toBe(true);
 for(const skill of configurationSkills){
  const items=primary.filter(q=>q.skillRefs.length===1&&q.skillRefs[0]===`DVA-C03:${skill.id}`);
  expect(items,skill.id).toHaveLength(3);expect(new Set(items.map(q=>q.prompt)).size,skill.id).toBe(3);
 }
 for(const question of questionBank.filter(q=>q.origin==='authored')){
  for(const chapter of question.chapterIds)expect(chapters.some(c=>c.id===chapter&&c.examVersions?.includes('DVA-C03')),question.id+' chapter '+chapter).toBe(true);
  expect(question.options.every(option=>option.explanation?.trim()),question.id).toBe(true);
 }
});
