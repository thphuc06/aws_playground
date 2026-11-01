import {describe,it,expect} from 'vitest';
import {serviceCatalog} from './serviceCatalog';
import {serviceLearningModels} from './serviceLearningModels';
import {configurationCoverage} from './configurationCoverage';
import {evaluateLearningModel,validateLearningFields} from './learningModel';
describe('complete bounded configuration coverage',()=>{
 it('reconciles all 47 catalog entries with 44 generic and 3 custom models',()=>{expect(serviceCatalog).toHaveLength(47);expect(serviceLearningModels).toHaveLength(44);expect(new Set(serviceLearningModels.map(m=>m.serviceId)).size).toBe(44);expect(configurationCoverage).toHaveLength(47);expect(configurationCoverage.every(c=>c.status==='source-reviewed slice')).toBe(true);expect(new Set([...serviceLearningModels.map(m=>m.serviceId),'api','lambda','eventbridge'])).toEqual(new Set(serviceCatalog.map(s=>s.id)));});
 for(const m of serviceLearningModels)it(`${m.serviceId}: coherent defaults, actionable failure, sources and boundaries`,()=>{expect(m.fields.length).toBeGreaterThanOrEqual(4);expect(new Set(m.fields.map(f=>f.key)).size).toBe(m.fields.length);expect(validateLearningFields(m,m.defaults)).toEqual([]);expect(evaluateLearningModel(m,m.defaults).findings.filter(f=>f.level==='error')).toEqual([]);expect(m.examples.length).toBeGreaterThanOrEqual(2);expect(m.examples.some(e=>evaluateLearningModel(m,{...m.defaults,...e.values}).findings.some(f=>f.level==='error'))).toBe(true);expect(m.sources.length).toBeGreaterThan(0);expect(m.sources.every(s=>new URL(s.url).hostname==='docs.aws.amazon.com'&&s.verified==='2026-11-01')).toBe(true);expect(m.examSkills.length).toBeGreaterThan(0);expect(m.limitations.length).toBeGreaterThan(0);expect(m.fields.every(f=>f.help.length>10)).toBe(true);});
});
