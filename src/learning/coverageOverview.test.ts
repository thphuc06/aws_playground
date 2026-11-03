import {describe,expect,it} from 'vitest';
import {buildCoverageOverview,currentCoverageInputs,filterCoverageRows,hasScopedDecisionGuide,type CoverageInputs} from './coverageOverview';
import {isPrimarySkillQuestion} from './serviceSurfaceManifest';

describe('learning inventory dimensions',()=>{
 it('reconciles current catalog, question bank, standalone exercises, editor cases and labs independently',()=>{
  const inputs=currentCoverageInputs(),overview=buildCoverageOverview('DVA-C03',inputs),t=overview.totals;
  expect(t.services).toBe(58);expect(t.structuredBriefs).toBe(58);expect(t.fieldPaths).toBe(1405);
  expect(t.scopedGuides).toBe(inputs.services.flatMap(service=>service.fields).filter(hasScopedDecisionGuide).length);
  expect(t.questionBank).toBe(297);expect(t.selectedExamQuestions).toBe(inputs.questions.filter(question=>question.examVersions.includes('DVA-C03')).length);
  expect(t.c03PrimaryQuestions).toBe(216);expect(t.c03SkillsWithPrimaryQuestions).toBe(72);
  expect(t.standaloneExercises).toBe(58);expect(t.standaloneConfigurationExercises).toBe(47);expect(t.standaloneDecisionExercises).toBe(11);
  expect(t.editorConfigurationCases).toBe(18);expect(t.legacyLessonSlices).toBe(47);expect(t.labs).toBe(12);
  expect(t.reviewedClaims).toBe(0);
  for(const skill of overview.skills)expect(skill.primarySkillQuestionIds).toHaveLength(3);
 });

 it('does not promote classifications, partial documentation, chapter mentions or related labs to independent verification',()=>{
  const source=currentCoverageInputs(),service=structuredClone(source.services.find(item=>item.serviceId==='lambda')!);
  service.fields=service.fields.slice(0,2);service.rootFieldCount=2;
  service.fields[0].documentation={purpose:true,whenToUse:true,omission:true,effects:true,examples:true,relatedLessons:true};
  service.fields[0].existingAudit={checked:'2026-11-02',scope:'Historical fixture'};
  expect(hasScopedDecisionGuide({...service.fields[0],documentationScope:undefined})).toBe(false);
  expect(hasScopedDecisionGuide({...service.fields[0],reference:undefined,documentationReference:undefined})).toBe(false);
  service.fields[1].documentation={...service.fields[0].documentation,examples:false};service.fields[1].disposition='unclassified';delete service.fields[1].existingAudit;
  const base=source.questions.find(isPrimarySkillQuestion)!;
  const inputs:CoverageInputs={services:[service],skills:source.skills.filter(skill=>skill.id==='1.1.1'),
   questions:[{...base,id:'primary',serviceIds:['lambda'],skillRefs:['DVA-C03:1.1.1']},{...base,id:'chapter-mention',origin:'chapter',serviceIds:['lambda'],skillRefs:[],examVersions:['DVA-C02']},{...base,id:'multi-skill',origin:'code',serviceIds:['lambda'],skillRefs:['DVA-C03:1.1.1','DVA-C03:1.1.2']}],
   exercises:[{id:'standalone',serviceId:'lambda',kind:'decision'}],editorCases:[{id:'editor',serviceIds:['lambda']}],legacySlices:[{serviceId:'lambda',status:'source-reviewed slice'}],
   labs:[{id:'old',title:'Old guide fixture',examVersions:['DVA-C02'],serviceIds:['lambda']},{id:'new',title:'New guide fixture',examVersions:['DVA-C03'],serviceIds:['lambda']}],
   claims:[{serviceId:'lambda',review:{status:'unreviewed'},enforcement:'local-rule'}],
  };
  const overview=buildCoverageOverview('DVA-C03',inputs);
  expect(overview.totals).toMatchObject({scopedGuides:1,fieldPaths:2,questionBank:3,selectedExamQuestions:2,c03PrimaryQuestions:1,standaloneExercises:1,editorConfigurationCases:1,legacyLessonSlices:1,labs:2,selectedExamLabs:1,priorAuditScopes:1,reviewedClaims:0});
  expect(overview.rows[0].labs.map(lab=>lab.id)).toEqual(['new']);
  expect(overview.rows[0].questionIds).toEqual(['primary','multi-skill']);
  expect(overview.totals.c03SkillsWithPrimaryQuestions).toBe(1);
 });

 it('respects selected-exam questions/labs and searches field paths without hiding additional catalog references',()=>{
  const inputs=currentCoverageInputs(),c03=buildCoverageOverview('DVA-C03',inputs),c02=buildCoverageOverview('DVA-C02',inputs);
  expect(filterCoverageRows(c03.rows,'',true)).toHaveLength(56);
  expect(filterCoverageRows(c02.rows,'',true)).toHaveLength(47);
  expect(filterCoverageRows(c03.rows,'busName').map(row=>row.serviceId)).toEqual(['eventbridge']);
  expect(filterCoverageRows(c03.rows,'no-such-service-fixture')).toEqual([]);
  expect(filterCoverageRows(c03.rows,'AWS Private CA')[0].serviceId).toBe('private-ca');
  expect(filterCoverageRows(c03.rows,'q-developer',true)).toEqual([]);
  expect(filterCoverageRows(c03.rows,'q-developer')).toHaveLength(1);
  expect(c02.totals.selectedExamQuestions).toBe(inputs.questions.filter(question=>question.examVersions.includes('DVA-C02')).length);
  expect(c02.totals.selectedExamLabs).toBe(inputs.labs.filter(lab=>lab.examVersions.includes('DVA-C02')).length);
 });
});
