import {describe,it,expect} from 'vitest';
import {configurationKnowledgeChecks} from '../configurationKnowledgeChecks';
import {codePracticeCases} from '../configurationPractice';
import {getConfigurationOptionExplanations,getCodeOptionExplanations,legacyOptionExplanationCoverage,legacyOptionExplanationFingerprints,legacyOptionExplanationFingerprint} from './legacyOptionExplanations';

describe('per-choice rationale for frozen legacy questions',()=>{
 it('covers exactly all 72 configuration checks and 3 code cases without adding options',()=>{
  expect(configurationKnowledgeChecks).toHaveLength(72);expect(codePracticeCases).toHaveLength(3);
  expect(Object.keys(legacyOptionExplanationFingerprints.configuration).sort()).toEqual(configurationKnowledgeChecks.map(c=>c.skillId).sort());
  expect(Object.keys(legacyOptionExplanationFingerprints.code).sort()).toEqual(codePracticeCases.map(c=>c.id).sort());
  expect(legacyOptionExplanationCoverage).toMatchObject({configurationChecks:72,codeChecks:3,authoredDistractorRationales:222});
  for(const check of configurationKnowledgeChecks){expect(check.choices).toHaveLength(4);expect(getConfigurationOptionExplanations(check)).toHaveLength(4)}
  for(const check of codePracticeCases){expect(check.choices).toHaveLength(3);expect(getCodeOptionExplanations(check)).toHaveLength(3)}
 });
 it('reuses each correct rationale and supplies distinct specific text for every distractor without mutating snapshots',()=>{
  const before=JSON.stringify([configurationKnowledgeChecks,codePracticeCases]);
  const pairs=[...configurationKnowledgeChecks.map(check=>({check,explanations:getConfigurationOptionExplanations(check)})),...codePracticeCases.map(check=>({check,explanations:getCodeOptionExplanations(check)}))];
  for(const {check,explanations} of pairs){
   expect(explanations[check.answer],check.id).toBe(check.explanation);
   expect(new Set(explanations).size,check.id).toBe(check.choices.length);
   for(const explanation of explanations)expect(explanation.trim().length,check.id).toBeGreaterThan(30);
  }
  expect(JSON.stringify([configurationKnowledgeChecks,codePracticeCases])).toBe(before);
 });
 it('aligns rationale after the rotating correct-answer insertion at all four positions',()=>{
  expect(new Set(configurationKnowledgeChecks.map(c=>c.answer))).toEqual(new Set([0,1,2,3]));
  const cases=[
   {skill:'1.1.1',choice:'Increase the synchronous request timeout until fulfillment returns.',reason:'longer synchronous wait'},
   {skill:'1.1.2',choice:'A resource policy automatically converts queue processing into an HTTP response.',reason:'resource policy authorizes access'},
   {skill:'1.1.3',choice:'Generate a fresh order identifier for every retry.',reason:'fresh identifier'},
   {skill:'1.1.4',choice:'Increase the function memory without changing payload parsing.',reason:'More memory'},
  ];
  for(const sample of cases){const check=configurationKnowledgeChecks.find(c=>c.skillId===sample.skill)!;const index=check.choices.indexOf(sample.choice);expect(index).toBeGreaterThanOrEqual(0);expect(getConfigurationOptionExplanations(check)[index]).toContain(sample.reason)}
  const code=codePracticeCases.find(c=>c.id==='serialization')!;
  expect(getCodeOptionExplanations(code)[code.choices.indexOf('string')]).toContain('not a quoted string');
  expect(getCodeOptionExplanations(code)[code.choices.indexOf('undefined')]).toContain('property exists');
 });
 it('freezes original prompt, options, answer, explanation, source and snippet fingerprints',()=>{
  for(const check of configurationKnowledgeChecks)expect(legacyOptionExplanationFingerprint(check),check.id).toBe(legacyOptionExplanationFingerprints.configuration[check.skillId]);
  for(const check of codePracticeCases)expect(legacyOptionExplanationFingerprint(check),check.id).toBe(legacyOptionExplanationFingerprints.code[check.id]);
 });
 it('rejects reordered, changed or unknown snapshots instead of silently assigning stale reasoning',()=>{
  const config=configurationKnowledgeChecks[0];
  expect(()=>getConfigurationOptionExplanations({...config,choices:[...config.choices].reverse()})).toThrow(/changed/);
  expect(()=>getConfigurationOptionExplanations({...config,answer:1})).toThrow(/changed/);
  expect(()=>getConfigurationOptionExplanations({...config,question:config.question+' Changed assumption.'})).toThrow(/changed/);
  expect(()=>getConfigurationOptionExplanations({...config,skillId:'9.9.9'})).toThrow(/No reviewed/);
  const code=codePracticeCases[0];
  expect(()=>getCodeOptionExplanations({...code,code:code.code+'\n// changed'})).toThrow(/changed/);
  expect(()=>getCodeOptionExplanations({...code,id:'unreviewed-code'})).toThrow(/No reviewed/);
 });
});
