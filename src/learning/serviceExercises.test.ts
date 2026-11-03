import {describe,it,expect} from 'vitest';
import {canvasCatalog,serviceCatalog} from '../serviceCatalog';
import {validateLearningFields} from '../learningModel';
import {serviceLearningModels} from '../serviceLearningModels';
import {scoreQuestion} from './practiceEngine';
import {serviceExercises,getServiceExercise,createServiceExerciseValues,evaluateServiceExercise,type ServiceConfigurationExercise} from './serviceExercises';

describe('standalone service exercise coverage and isolation',()=>{
 it('provides exactly one substantive exercise for every one of the 58 catalog services',()=>{
  expect(serviceExercises).toHaveLength(58);expect(new Set(serviceExercises.map(e=>e.id)).size).toBe(58);
  expect(serviceExercises.map(e=>e.serviceId).sort()).toEqual(canvasCatalog.map(s=>s.id).sort());
  expect(serviceExercises.filter(e=>e.kind==='configuration')).toHaveLength(47);expect(serviceExercises.filter(e=>e.kind==='decision')).toHaveLength(11);
  expect(getServiceExercise('not-a-service')).toBeUndefined();
 });
 it('starts every configuration lesson with a semantic failure, not an invalid enum/type template',()=>{
  for(const exercise of serviceExercises){if(exercise.kind!=='configuration')continue;
   const values=createServiceExerciseValues(exercise);
   expect(validateLearningFields(exercise.model,values).filter(f=>f.level==='error'),exercise.serviceId).toEqual([]);
   const initial=evaluateServiceExercise(exercise,values),repaired=evaluateServiceExercise(exercise,exercise.repairValues);
   expect(initial.findings.some(f=>f.level==='error'),exercise.serviceId).toBe(true);
   expect(repaired.findings.filter(f=>f.level==='error'),exercise.serviceId).toEqual([]);
   expect(exercise.expectedReasoning.length,exercise.serviceId).toBeGreaterThan(1);
  }
  const cloudwatch=getServiceExercise('cloudwatch') as ServiceConfigurationExercise;
  expect(cloudwatch.initialValues.samples).toBe('2,8,9');expect(cloudwatch.initialValues.actionAllowed).toBe(false);
 });
 it('clones editable values and leaves the original shared lesson registries untouched',()=>{
  const snapshot=JSON.stringify(serviceLearningModels);
  for(const exercise of serviceExercises){if(exercise.kind!=='configuration')continue;
   const values=createServiceExerciseValues(exercise);const original=JSON.stringify(exercise.initialValues);
   const key=exercise.model.fields[0].key;values[key]='edited only in this isolated attempt';
   evaluateServiceExercise(exercise,values);
   expect(JSON.stringify(exercise.initialValues),exercise.serviceId).toBe(original);
  }
  expect(JSON.stringify(serviceLearningModels)).toBe(snapshot);
 });
 it('retains specific core behavior instead of inventing a whole-graph simulation',()=>{
  const lambda=getServiceExercise('lambda') as ServiceConfigurationExercise;
  const missing=evaluateServiceExercise(lambda,lambda.initialValues);
  expect(missing.findings.some(f=>f.title.includes('execution-role grant'))).toBe(true);
  const slow=evaluateServiceExercise(lambda,{...lambda.repairValues,mockDurationMs:4000});expect(slow.trace.join(' ')).toContain('timed-out');
  const api=getServiceExercise('api') as ServiceConfigurationExercise;
  expect(evaluateServiceExercise(api,{...api.repairValues,samplePath:'/different'}).trace.join(' ')).toContain('no-route');
  const events=getServiceExercise('eventbridge') as ServiceConfigurationExercise;
  expect(evaluateServiceExercise(events,{...events.repairValues,rulePattern:'{"detail":{"size":[42]}}'}).findings.some(f=>f.level==='error')).toBe(true);
 });
 it('gives each additional C03 service a real scenario, explanations and primary sources',()=>{
  const originalIds=new Set(serviceCatalog.map(s=>s.id));
  const additions=serviceExercises.filter(e=>!originalIds.has(e.serviceId));
  expect(additions).toHaveLength(11);
  for(const exercise of additions){
   expect(exercise.kind).toBe('decision');if(exercise.kind!=='decision')continue;
   expect(exercise.question.serviceIds).toContain(exercise.serviceId);
   expect(exercise.question.prompt.length).toBeGreaterThan(100);
   expect(exercise.question.options.length).toBeGreaterThanOrEqual(4);
   for(const option of exercise.question.options)expect(option.explanation?.length).toBeGreaterThan(30);
   expect(scoreQuestion(exercise.question,exercise.question.correctOptionIds)).toBe('correct');
   expect(exercise.sources.length).toBeGreaterThan(0);expect(exercise.expectedReasoning.length).toBeGreaterThan(0);
  }
 });
 it('keeps C02-origin evidence and model limits visible rather than relabeling them as exhaustive C03 validation',()=>{
  expect(getServiceExercise('appsync')?.scopeLabel).toContain('Legacy C02');expect(getServiceExercise('q-developer')?.scopeLabel).toContain('Legacy C02');
  for(const exercise of serviceExercises){expect(exercise.limitations.some(l=>l.includes('do not read or change your architecture'))).toBe(true);for(const reference of exercise.sources){expect(new URL(reference.url).protocol).toBe('https:');expect(reference.verified).toMatch(/^\d{4}-\d{2}-\d{2}$/)}}
 });
});
