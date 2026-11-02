import {describe,it,expect} from 'vitest';
import {canvasCatalog,c03CanvasCatalog,serviceCatalog} from '../../serviceCatalog';
import {chapters} from '../../content';
import {getServiceDetail} from '../../serviceDetails';
import {serviceLearningMetadata,getServiceLearningMetadata,learningGlossary,serviceComparisons,learningPaths,lessonPrerequisites} from './index';

const serviceIds=new Set(canvasCatalog.map(s=>s.id));
const lessonIds=new Set(chapters.map(c=>c.id));
const comparisonIds=new Set(serviceComparisons.map(c=>c.id));
describe('service learning navigation integrity',()=>{
 it('covers each service once and keeps C02/C03 names distinct',()=>{
  expect(serviceLearningMetadata.map(s=>s.serviceId).sort()).toEqual([...serviceIds].sort());
  for(const [exam,expected] of [['DVA-C02',serviceCatalog],['DVA-C03',c03CanvasCatalog]] as const){expect(serviceLearningMetadata.filter(s=>s.examVersions.includes(exam)).map(s=>s.serviceId).sort()).toEqual(expected.map(s=>s.id).sort())}
  expect(getServiceLearningMetadata('q-developer')?.scope).toBe('legacy');expect(getServiceLearningMetadata('quick')?.scope).toBe('exam');expect(getServiceLearningMetadata('not-real')).toBeUndefined();
 });
 it('links every service to actual lessons, comparisons and a full brief',()=>{
  for(const s of serviceLearningMetadata){expect(getServiceDetail(s.serviceId)).toBeDefined();expect(s.focus.length).toBeGreaterThan(30);expect(s.lessonIds.length).toBeGreaterThan(0);for(const id of [...s.lessonIds,...s.prerequisiteLessonIds])expect(lessonIds.has(id),`${s.serviceId}: ${id}`).toBe(true);for(const id of s.comparisonIds)expect(comparisonIds.has(id),id).toBe(true)}
 });
 it('uses only real resources and dated evidence in decision comparisons',()=>{
  expect(comparisonIds.size).toBe(serviceComparisons.length);
  for(const c of serviceComparisons){expect(c.criteria.length).toBeGreaterThan(0);for(const id of c.serviceIds)expect(serviceIds.has(id),id).toBe(true);for(const criterion of c.criteria)for(const choice of criterion.choices){expect(c.serviceIds).toContain(choice.serviceId);expect(choice.guidance.length).toBeGreaterThan(20)}expect(c.scenario.requirement.length).toBeGreaterThan(30);expect(c.scenario.reasoning.length).toBeGreaterThan(60);expect(c.sources.length).toBeGreaterThan(0);for(const source of c.sources){expect(new URL(source.url).protocol).toBe('https:');expect(source.verified).toMatch(/^\d{4}-\d{2}-\d{2}$/)}}
 });
});
describe('learning prerequisites and bilingual terminology',()=>{
 it('has a resolvable acyclic prerequisite graph without mandatory navigation gates',()=>{
  expect(Object.keys(lessonPrerequisites).sort()).toEqual([...lessonIds].sort());
  const visited=new Set<string>();const visit=(id:string,active:Set<string>)=>{expect(active.has(id),`prerequisite cycle at ${id}`).toBe(false);if(visited.has(id))return;expect(lessonIds.has(id),id).toBe(true);for(const parent of lessonPrerequisites[id]??[])visit(parent,new Set([...active,id]));visited.add(id)};
  for(const id of Object.keys(lessonPrerequisites))visit(id,new Set());
 });
 it('keeps suggested paths within the selected version and resolves prerequisite order',()=>{
  expect(new Set(learningPaths.map(p=>p.id)).size).toBe(learningPaths.length);
  for(const path of learningPaths){expect(new Set(path.steps.map(s=>s.lessonId)).size).toBe(path.steps.length);for(const exam of path.examVersions){const seen=new Set<string>();for(const step of path.steps){const c=chapters.find(c=>c.id===step.lessonId);expect(c,step.lessonId).toBeDefined();expect(c?.examVersions??['DVA-C02']).toContain(exam);for(const prereq of lessonPrerequisites[step.lessonId]??[])if(path.steps.some(s=>s.lessonId===prereq))expect(seen.has(prereq),`${path.id}: ${step.lessonId} precedes ${prereq}`).toBe(true);seen.add(step.lessonId)}}}
 });
 it('provides distinct VI and EN explanations with stable term IDs and working study links',()=>{
  expect(new Set(learningGlossary.map(g=>g.id)).size).toBe(learningGlossary.length);
  for(const g of learningGlossary){expect(g.en.length).toBeGreaterThan(30);expect(g.vi.length).toBeGreaterThan(30);expect(g.vi).not.toBe(g.en);expect(g.aliases.length).toBeGreaterThan(0);for(const id of g.serviceIds)expect(serviceIds.has(id),id).toBe(true);for(const id of g.lessonIds)expect(lessonIds.has(id),id).toBe(true)}
  expect(learningGlossary.find(g=>g.id==='visibility-timeout')?.vi).toContain('không có nghĩa là xóa');
 });
});
