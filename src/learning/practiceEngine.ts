import type {LearningAttempt,LearningExam,LearningProgress,StudyQuestion} from './questionTypes';

export function scoreQuestion(question:StudyQuestion,selected:string[]):LearningAttempt['outcome'] {
  if(new Set(selected).size!==selected.length||selected.some(id=>!question.options.some(o=>o.id===id)))throw new Error('Unsupported or repeated answer option.');
  if(!selected.length)return 'unanswered';
  if(question.kind==='single-choice'&&selected.length!==1)throw new Error('Choose one answer.');
  return selected.length===question.correctOptionIds.length&&selected.every(id=>question.correctOptionIds.includes(id))?'correct':'incorrect';
}
export function questionAttempts(progress:LearningProgress,exam:LearningExam,id:string){return progress.attempts.filter(a=>a.exam===exam&&a.questionId===id).sort((a,b)=>a.submittedAt.localeCompare(b.submittedAt));}
/** A transparent revision heuristic, not a prediction of exam performance. */
export function reviewState(attempts:LearningAttempt[],now=new Date()):{due:boolean;dueAt?:string;streak:number} {
  if(!attempts.length)return {due:false,streak:0};
  let streak=0,lastTime:number|undefined;
  for(const a of [...attempts].sort((x,y)=>x.submittedAt.localeCompare(y.submittedAt))){
    if(a.assistance!=='none')continue;
    const time=Date.parse(a.submittedAt);if(!Number.isFinite(time)||time>now.getTime())continue;
    // Repeated submissions on one calendar day do not advance spaced review.
    if(a.outcome!=='correct')streak=0;
    else if(lastTime===undefined||new Date(lastTime).toISOString().slice(0,10)!==a.submittedAt.slice(0,10))streak++;
    lastTime=time;
  }
  if(lastTime===undefined)return {due:false,streak:0};
  const interval=[1,1,3,7,14][Math.min(streak,4)];
  const dueAt=new Date(lastTime+interval*86400000).toISOString();
  return {due:Date.parse(dueAt)<=now.getTime(),dueAt,streak};
}
export function progressEvidence(progress:LearningProgress,exam:LearningExam,now=new Date()){
  const attempts=progress.attempts.filter(a=>a.exam===exam&&a.assistance==='none'&&Date.parse(a.submittedAt)<=now.getTime());
  const first=new Map<string,LearningAttempt>();for(const a of [...attempts].sort((a,b)=>a.submittedAt.localeCompare(b.submittedAt)))if(!first.has(a.questionId))first.set(a.questionId,a);
  return {attempts:attempts.length,distinctQuestions:first.size,firstCorrect:[...first.values()].filter(a=>a.outcome==='correct').length,legacy:progress.legacyAcknowledgements.length};
}
