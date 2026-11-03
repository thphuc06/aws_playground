import type {ExamVersionId} from '../examVersions';
import {serviceCatalog,c03CanvasCatalog} from '../serviceCatalog';
import {configurationCoverage} from '../configurationCoverage';
import {configurationPracticeCases} from '../configurationPractice';
import {questionBank} from './questionRegistry';
import {serviceExercises} from './serviceExercises';
import {labDefinitions} from './labs/definitions';
import {claimEvidenceRegistry} from './evidenceRegistry';
import {buildServiceSurfaceManifest,buildSkillEvidence,isPrimarySkillQuestion} from './serviceSurfaceManifest';
import type {FieldSurface,ServiceSurfaceManifest,SkillEvidence} from './evidenceTypes';
import type {StudyQuestion} from './questionTypes';

export function hasScopedDecisionGuide(field:FieldSurface):boolean {
 return Object.values(field.documentation).every(Boolean)&&!!field.documentationScope?.trim()&&!!(field.documentationReference?.url||field.reference?.url);
}
export interface CoverageInputs {
 services:ServiceSurfaceManifest[];skills:SkillEvidence[];questions:StudyQuestion[];
 exercises:{id:string;serviceId:string;kind:'configuration'|'decision';scopeLabel?:string}[];
 labs:{id:string;title:string;examVersions:ExamVersionId[];serviceIds:string[]}[];
 editorCases:{id:string;serviceIds:string[]}[];
 legacySlices:{serviceId:string;status:string}[];
 claims:{serviceId:string;review:{status:string};enforcement:string}[];
}
export function currentCoverageInputs():CoverageInputs {
 return {services:buildServiceSurfaceManifest(),skills:buildSkillEvidence(),questions:questionBank,exercises:serviceExercises,labs:labDefinitions,editorCases:configurationPracticeCases,legacySlices:configurationCoverage,claims:claimEvidenceRegistry};
}
export function buildCoverageOverview(exam:ExamVersionId,inputs:CoverageInputs=currentCoverageInputs()) {
 const questions=inputs.questions.filter(question=>question.examVersions.includes(exam)),labs=inputs.labs.filter(lab=>lab.examVersions.includes(exam));
 const primary=inputs.questions.filter(isPrimarySkillQuestion),fields=inputs.services.flatMap(service=>service.fields);
 const examServices=new Set((exam==='DVA-C02'?serviceCatalog:c03CanvasCatalog).map(service=>service.id));
 const rows=inputs.services.map(service=>({
  serviceId:service.serviceId,name:service.name,category:service.category,scope:service.scope,namedForExam:examServices.has(service.serviceId),
  fieldCount:service.fields.length,guideCount:service.fields.filter(hasScopedDecisionGuide).length,
  briefPresent:service.study.structuredBrief,briefGaps:service.study.sectionsMissing,
  classifiedCount:service.fields.filter(field=>field.disposition!=='unclassified').length,
  priorAuditCount:service.fields.filter(field=>field.existingAudit).length,
  reviewedClaimCount:inputs.claims.filter(claim=>claim.serviceId===service.serviceId&&claim.review.status==='reviewed').length,
  questionIds:questions.filter(question=>question.serviceIds.includes(service.serviceId)).map(question=>question.id),
  standaloneExercises:inputs.exercises.filter(exercise=>exercise.serviceId===service.serviceId).map(({id,kind,scopeLabel})=>({id,kind,scopeLabel})),
  editorCaseIds:inputs.editorCases.filter(item=>item.serviceIds.includes(service.serviceId)).map(item=>item.id),
  labs:labs.filter(lab=>lab.serviceIds.includes(service.serviceId)),
  searchText:[service.serviceId,service.name,service.category,service.scope,...service.fields.flatMap(field=>[field.path,field.label])].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(),
 }));
 return {exam,rows,skills:inputs.skills,totals:{
  services:inputs.services.length,namedServices:rows.filter(row=>row.namedForExam).length,
  structuredBriefs:inputs.services.filter(service=>service.study.structuredBrief).length,
  rootFields:inputs.services.reduce((total,service)=>total+service.rootFieldCount,0),fieldPaths:fields.length,scopedGuides:fields.filter(hasScopedDecisionGuide).length,
  classifiedFields:fields.filter(field=>field.disposition!=='unclassified').length,
  questionBank:inputs.questions.length,selectedExamQuestions:questions.length,selectedExamMultipleResponse:questions.filter(question=>question.kind==='multiple-response').length,
  c03PrimaryQuestions:primary.length,c03Skills:inputs.skills.length,c03SkillsWithPrimaryQuestions:inputs.skills.filter(skill=>primary.some(question=>question.skillRefs[0]===`DVA-C03:${skill.id}`)).length,
  standaloneExercises:inputs.exercises.length,standaloneConfigurationExercises:inputs.exercises.filter(exercise=>exercise.kind==='configuration').length,standaloneDecisionExercises:inputs.exercises.filter(exercise=>exercise.kind==='decision').length,
  editorConfigurationCases:inputs.editorCases.length,legacyLessonSlices:inputs.legacySlices.length,
  labs:inputs.labs.length,selectedExamLabs:labs.length,
  priorAuditScopes:fields.filter(field=>field.existingAudit).length,reviewedClaims:inputs.claims.filter(claim=>claim.review.status==='reviewed').length,
 }};
}
export type CoverageOverview=ReturnType<typeof buildCoverageOverview>;
export function filterCoverageRows(rows:CoverageOverview['rows'],query:string,namedOnly=false) {
 const normalized=query.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim(),terms=normalized.split(/\s+/).filter(Boolean);
 const rank=(row:CoverageOverview['rows'][number])=>row.serviceId===normalized?3:row.name.toLowerCase().includes(normalized)?2:terms.every(term=>row.name.toLowerCase().includes(term))?1:0;
 return rows.filter(row=>(!namedOnly||row.namedForExam)&&terms.every(term=>row.searchText.includes(term))).sort((a,b)=>rank(b)-rank(a));
}
