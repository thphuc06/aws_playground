import type {Chapter} from '../content';
import type {ConfigurationKnowledgeCheck} from '../configurationKnowledgeChecks';
import type {StudyQuestion} from './questionTypes';
import {legacyQuestionAliases,legacyNamedQuestionRevisions} from './legacyQuestionAliases';
import {getConfigurationOptionExplanations,getCodeOptionExplanations} from './legacyOptionExplanations';

/** Compatibility fingerprint, not a cryptographic security check. */
export function legacyQuestionFingerprint(value: unknown): string {
  let hash=2166136261;
  for(const character of JSON.stringify(value)){hash=Math.imul(hash^character.charCodeAt(0),16777619);}
  return (hash>>>0).toString(16).padStart(8,'0');
}
export function adaptChapterQuestions(chapter: Chapter, sourceUrl: (id:string)=>string|undefined):StudyQuestion[] {
  return chapter.checks.map(check=>{
    const fingerprint=legacyQuestionFingerprint(check);
    const alias=legacyQuestionAliases.find(a=>a.chapterId===chapter.id&&a.fingerprint===fingerprint);
    if(!alias)throw new Error(`Question revision needs an explicit compatibility update: ${chapter.id}.`);
    return {id:alias.questionId,revision:1,examVersions:chapter.examVersions??['DVA-C02'],skillRefs:[],chapterIds:[chapter.id],serviceIds:chapter.serviceIds??[],kind:'single-choice',prompt:check.question,
      options:check.options.map((text,i)=>({id:'choice-'+i,text,explanation:check.explanations[i]})),correctOptionIds:['choice-'+check.answer],explanation:check.explanations[check.answer],
      sourceUrls:[...new Set(chapter.sections.flatMap(s=>s.sourceIds).map(sourceUrl).filter((url):url is string=>!!url))],origin:'chapter'};
  });
}
export function adaptConfigurationQuestion(check:ConfigurationKnowledgeCheck):StudyQuestion {
  assertNamedRevision('configuration:'+check.id,check);
  const explanations=getConfigurationOptionExplanations(check);
  return {id:'configuration:'+check.id,revision:1,examVersions:['DVA-C03'],skillRefs:[`DVA-C03:${check.skillId}`],chapterIds:[],serviceIds:check.serviceIds,kind:'single-choice',prompt:check.question,options:check.choices.map((text,i)=>({id:'choice-'+i,text,explanation:explanations[i]})),correctOptionIds:['choice-'+check.answer],explanation:check.explanation,sourceUrls:[check.sourceUrl],snippet:check.snippet,origin:'configuration'};
}
export function adaptCodeQuestion(check:{id:string;skills:string[];title:string;code:string;question:string;choices:string[];answer:number;explanation:string;sourceUrl:string}):StudyQuestion {
  assertNamedRevision('code:'+check.id,check);
  const explanations=getCodeOptionExplanations(check);
  return {id:'code:'+check.id,revision:1,examVersions:['DVA-C03'],skillRefs:check.skills.map(s=>`DVA-C03:${s}` as const),chapterIds:[],serviceIds:[],kind:'single-choice',prompt:check.question,options:check.choices.map((text,i)=>({id:'choice-'+i,text,explanation:explanations[i]})),correctOptionIds:['choice-'+check.answer],explanation:check.explanation,sourceUrls:[check.sourceUrl],snippet:check.code,origin:'code'};
}
function assertNamedRevision(id:string,value:unknown){if(!legacyNamedQuestionRevisions.some(r=>r.questionId===id&&r.fingerprint===legacyQuestionFingerprint(value)))throw new Error('Question revision needs an explicit compatibility update: '+id);}
