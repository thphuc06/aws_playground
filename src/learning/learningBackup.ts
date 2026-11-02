import {scoreQuestion} from './practiceEngine';
import {isLearningExam,type LearningProgress,type StudyQuestion} from './questionTypes';
const record=(v:unknown):v is Record<string,any>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const strings=(v:unknown):v is string[]=>Array.isArray(v)&&v.every(x=>typeof x==='string');
const unique=(v:string[])=>new Set(v).size===v.length;
const date=(v:unknown)=>typeof v==='string'&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString()===v;
function validQuestion(q:unknown):q is StudyQuestion {
 if(!record(q)||typeof q.id!=='string'||!q.id||!Number.isInteger(q.revision)||q.revision<1||!Array.isArray(q.examVersions)||!q.examVersions.length||!q.examVersions.every(isLearningExam)||!strings(q.skillRefs)||!q.skillRefs.every(s=>/^DVA-C0[23]:\d+(\.\d+)+$/.test(s))||!strings(q.chapterIds)||!strings(q.serviceIds)||!['single-choice','multiple-response'].includes(q.kind)||typeof q.prompt!=='string'||typeof q.explanation!=='string'||!Array.isArray(q.options)||q.options.length<2||q.options.length>20)return false;
 if(!q.options.every((o:unknown)=>record(o)&&typeof o.id==='string'&&!!o.id&&typeof o.text==='string'&&(o.explanation===undefined||typeof o.explanation==='string'))||!unique(q.options.map((o:any)=>o.id))||!strings(q.correctOptionIds)||!unique(q.correctOptionIds)||!q.correctOptionIds.length||q.correctOptionIds.some(id=>!q.options.some((o:any)=>o.id===id))||q.kind==='single-choice'&&q.correctOptionIds.length!==1||q.kind==='multiple-response'&&q.correctOptionIds.length<2)return false;
 return strings(q.sourceUrls)&&q.sourceUrls.every(url=>{try{return new URL(url).protocol==='https:';}catch{return false;}})&&(q.snippet===undefined||typeof q.snippet==='string')&&['chapter','configuration','code','authored'].includes(q.origin);
}
export function validateLearningProgress(input:unknown):{ok:true;value:LearningProgress}|{ok:false;error:string}{
 if(!record(input)||input.schemaVersion!==2)return {ok:false,error:'Unsupported learning backup version. Existing data has not been changed.'};
 const p=input;
 if(!['read','bookmarks','missions'].every(k=>strings(p[k])&&unique(p[k]))||p.legacyRaw!==undefined&&typeof p.legacyRaw!=='string'||!Array.isArray(p.legacyAcknowledgements)||!Array.isArray(p.attempts)||!Array.isArray(p.sessions))return {ok:false,error:'Learning backup has invalid lists.'};
 if(!p.legacyAcknowledgements.every((a:unknown)=>record(a)&&typeof a.legacyKey==='string'&&(a.questionId===undefined||typeof a.questionId==='string')&&a.provenance==='exam-and-time-unknown')||!unique(p.legacyAcknowledgements.map((a:any)=>a.legacyKey)))return {ok:false,error:'Legacy learning records are invalid.'};
 for(const s of p.sessions){
  if(!record(s)||typeof s.id!=='string'||!s.id||!isLearningExam(s.exam)||!['learn','mixed','mistakes','due-review'].includes(s.mode)||!['active','completed','abandoned'].includes(s.status)||!date(s.startedAt)||s.completedAt!==undefined&&!date(s.completedAt)||!Array.isArray(s.items)||!s.items.length||s.items.length>50||!Number.isInteger(s.currentItem)||s.currentItem<0||s.currentItem>=s.items.length)return {ok:false,error:'A saved practice session is invalid.'};
  for(const item of s.items){if(!record(item)||!validQuestion(item.question)||!item.question.examVersions.includes(s.exam)||!strings(item.optionOrder)||!unique(item.optionOrder)||item.optionOrder.length!==item.question.options.length||item.optionOrder.some(id=>!item.question.options.some((o:any)=>o.id===id)))return {ok:false,error:'A pinned question or option order is invalid.'};}
  if(!unique(s.items.map((item:any)=>item.question.id)))return {ok:false,error:'A session repeats a question.'};
 }
 if(!unique(p.sessions.map((s:any)=>s.id))||!unique(p.attempts.map((a:any)=>a?.id)))return {ok:false,error:'Duplicate attempt or session IDs in learning backup.'};
 for(const a of p.attempts){
  if(!record(a)||typeof a.id!=='string'||!isLearningExam(a.exam)||!date(a.submittedAt)||!strings(a.selectedOptionIds)||!strings(a.optionOrder)||!strings(a.skillRefs)||!['none','answer-revealed'].includes(a.assistance))return {ok:false,error:'A saved practice attempt is invalid.'};
  const s:any=p.sessions.find((session:any)=>session.id===a.sessionId);const index:number=s?.items.findIndex((i:any)=>i.question.id===a.questionId)??-1;const item:any=s?.items[index];
  if(!s||!item||a.id!==`${s.id}:${index}`||a.exam!==s.exam||a.questionRevision!==item.question.revision||JSON.stringify(a.optionOrder)!==JSON.stringify(item.optionOrder)||JSON.stringify(a.skillRefs)!==JSON.stringify(item.question.skillRefs.filter((v:string)=>v.startsWith(a.exam+':'))))return {ok:false,error:'An attempt does not match its pinned question revision.'};
  if(s.status!=='completed'&&index>s.currentItem)return {ok:false,error:'A session contains an answer ahead of its current question.'};
  try{if(scoreQuestion(item.question,a.selectedOptionIds)!==a.outcome)return {ok:false,error:'An imported score does not match the submitted answers.'};}catch{return {ok:false,error:'An imported answer is invalid.'};}
 }
 for(const s of p.sessions){
  const required=s.status==='completed'?s.items.length:s.currentItem;
  if(Array.from({length:required},(_,i)=>`${s.id}:${i}`).some(id=>!p.attempts.some((a:any)=>a.id===id)))return {ok:false,error:'A session is missing earlier submitted attempts.'};
  if(s.status==='completed'&&(s.currentItem!==s.items.length-1||!s.completedAt))return {ok:false,error:'Completed session metadata is incomplete.'};
 }
 return {ok:true,value:structuredClone(input) as LearningProgress};
}
export const LEARNING_BACKUP_LIMIT=10*1024*1024;
export function parseLearningBackup(text:string):LearningProgress {
 if(new TextEncoder().encode(text).length>LEARNING_BACKUP_LIMIT)throw new Error('Learning backup exceeds the 10 MiB application import limit.');
 let parsed:unknown;try{parsed=JSON.parse(text);}catch{throw new Error('Learning backup is not valid JSON.');}
 if(record(parsed)&&parsed.format==='aws-playground-learning'&&parsed.version!==1)throw new Error('Unsupported learning archive version.');
 const result=validateLearningProgress(record(parsed)&&parsed.format==='aws-playground-learning'?parsed.learning:parsed);if(!result.ok)throw new Error(result.error);return result.value;
}
export function exportLearningBackup(progress:LearningProgress){return JSON.stringify({format:'aws-playground-learning',version:1,learning:progress},null,2);}
export function mergeLearningProgress(current:LearningProgress,incoming:LearningProgress):LearningProgress {
 const validate=validateLearningProgress(incoming);if(!validate.ok)throw new Error(validate.error);
 const mergeById=<T,>(a:T[],b:T[],key:(item:T)=>string):T[]=>{const map=new Map(a.map(v=>[key(v),v]));for(const v of b){const old=map.get(key(v));if(old&&JSON.stringify(old)!==JSON.stringify(v))throw new Error('Conflicting learning record: '+key(v)+'. Choose a separate backup or deliberate replacement.');map.set(key(v),v);}return [...map.values()];};
 const result:LearningProgress={...current,read:[...new Set([...current.read,...incoming.read])],bookmarks:[...new Set([...current.bookmarks,...incoming.bookmarks])],missions:[...new Set([...current.missions,...incoming.missions])],legacyAcknowledgements:mergeById(current.legacyAcknowledgements,incoming.legacyAcknowledgements,a=>a.legacyKey),attempts:mergeById(current.attempts,incoming.attempts,a=>a.id),sessions:mergeById(current.sessions,incoming.sessions,s=>s.id)};
 const checked=validateLearningProgress(result);if(!checked.ok)throw new Error(checked.error);return checked.value;
}
