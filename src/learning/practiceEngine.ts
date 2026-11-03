import type {LearningAttempt,LearningExam,LearningProgress,StudyQuestion} from './questionTypes';

export interface PracticeContext {chapter?:string;skill?:string;service?:string}
export interface PracticeFilterOption {id:string;title:string;questionCount:number}
const isSkillRef=(value:string,exam:LearningExam)=>value.startsWith(exam+':')&&/^DVA-C0[23]:\d+\.\d+\.\d+$/.test(value);
/** Exact metadata matching only: task IDs never expand to all their child skills. */
export function matchesPracticeContext(question:StudyQuestion,exam:LearningExam,context:PracticeContext={}):boolean {
  return question.examVersions.includes(exam)
    &&(!context.chapter||question.chapterIds.includes(context.chapter))
    &&(!context.service||question.serviceIds.includes(context.service))
    &&(!context.skill||isSkillRef(context.skill,exam)&&question.skillRefs.some(ref=>ref===context.skill));
}
export function availableSkillOptions(bank:StudyQuestion[],exam:LearningExam,c03Skills:{id:string;title:string}[]):PracticeFilterOption[]{
  const declared=exam==='DVA-C03'?c03Skills.map(skill=>({id:`DVA-C03:${skill.id}`,title:skill.title})):
    [...new Set(bank.filter(q=>q.examVersions.includes(exam)).flatMap(q=>q.skillRefs.filter(ref=>isSkillRef(ref,exam))))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})).map(id=>({id,title:'Directly mapped skill'}));
  return declared.map(skill=>({...skill,questionCount:new Set(bank.filter(q=>matchesPracticeContext(q,exam,{skill:skill.id})).map(q=>q.id)).size}));
}
export function availableServiceOptions(bank:StudyQuestion[],exam:LearningExam,catalog:{id:string;name:string}[]):PracticeFilterOption[]{
  const ids=new Set(bank.filter(q=>q.examVersions.includes(exam)).flatMap(q=>q.serviceIds));
  return [...ids].map(id=>({id,title:catalog.find(service=>service.id===id)?.name??id,questionCount:new Set(bank.filter(q=>matchesPracticeContext(q,exam,{service:id})).map(q=>q.id)).size})).sort((a,b)=>a.title.localeCompare(b.title));
}
export interface SkillPracticeEvidence {
  skill:string;
  availableQuestions:number;
  distinctIndependentQuestions:number;
  firstIndependentCorrect:number;
  firstIndependentTotal:number;
  independentAnswers:number;
  assistedAnswers:number;
  skipped:number;
  latestIndependentAt?:string;
  dueQuestions:number;
  nextReviewAt?:string;
  unresolvedRevisions:number;
}
export function skillPracticeEvidence(bank:StudyQuestion[],progress:LearningProgress,exam:LearningExam,skills:string[],context:PracticeContext={},now=new Date()):SkillPracticeEvidence[]{
  const snapshotKey=(session:string,question:string,revision:number)=>`${session}\u0000${question}\u0000${revision}`;
  const snapshots=new Map(progress.sessions.flatMap(session=>session.items.map(item=>[snapshotKey(session.id,item.question.id,item.question.revision),item.question] as const)));
  const history=progress.attempts.filter(attempt=>{
    const submitted=Date.parse(attempt.submittedAt);
    if(attempt.exam!==exam||!Number.isFinite(submitted)||submitted>now.getTime())return false;
    const question=snapshots.get(snapshotKey(attempt.sessionId,attempt.questionId,attempt.questionRevision));
    return !!question&&matchesPracticeContext(question,exam,context);
  }).sort((a,b)=>a.submittedAt.localeCompare(b.submittedAt));
  const pool=[...new Map(bank.filter(question=>matchesPracticeContext(question,exam,context)).map(q=>[q.id,q])).values()];
  return skills.filter(skill=>isSkillRef(skill,exam)&&(!context.skill||context.skill===skill)).map(skill=>{
    const attempts=history.filter(attempt=>attempt.skillRefs.some(ref=>ref===skill));
    const independent=attempts.filter(attempt=>attempt.assistance==='none'&&attempt.outcome!=='unanswered');
    const first=new Map<string,LearningAttempt>();
    for(const attempt of independent)if(!first.has(attempt.questionId))first.set(attempt.questionId,attempt);
    const relevant=pool.filter(q=>q.skillRefs.some(ref=>ref===skill));
    const schedules=relevant.map(question=>reviewState(attempts.filter(a=>a.questionId===question.id&&a.questionRevision===question.revision),now));
    const nextReview=schedules.flatMap(schedule=>schedule.dueAt?[schedule.dueAt]:[]).sort()[0];
    const byQuestion=new Map<string,LearningAttempt[]>();for(const attempt of attempts){const list=byQuestion.get(attempt.questionId);if(list)list.push(attempt);else byQuestion.set(attempt.questionId,[attempt]);}
    return {skill,availableQuestions:relevant.length,distinctIndependentQuestions:new Set(independent.map(a=>a.questionId)).size,
      firstIndependentCorrect:[...first.values()].filter(a=>a.outcome==='correct').length,firstIndependentTotal:first.size,
      independentAnswers:independent.length,assistedAnswers:attempts.filter(a=>a.assistance==='answer-revealed'&&a.outcome!=='unanswered').length,
      skipped:attempts.filter(a=>a.outcome==='unanswered').length,latestIndependentAt:independent.at(-1)?.submittedAt,
      dueQuestions:schedules.filter(schedule=>schedule.due).length,nextReviewAt:nextReview,
      unresolvedRevisions:[...byQuestion.values()].reduce((count,items)=>count+unresolvedMistakeRevisions(items,now).length,0)};
  });
}

export function scoreQuestion(question:StudyQuestion,selected:string[]):LearningAttempt['outcome'] {
  if(new Set(selected).size!==selected.length||selected.some(id=>!question.options.some(o=>o.id===id)))throw new Error('Unsupported or repeated answer option.');
  if(!selected.length)return 'unanswered';
  if(question.kind==='single-choice'&&selected.length!==1)throw new Error('Choose one answer.');
  return selected.length===question.correctOptionIds.length&&selected.every(id=>question.correctOptionIds.includes(id))?'correct':'incorrect';
}
export function questionAttempts(progress:LearningProgress,exam:LearningExam,id:string){return progress.attempts.filter(a=>a.exam===exam&&a.questionId===id).sort((a,b)=>a.submittedAt.localeCompare(b.submittedAt));}
/** Only an independent, answered attempt can resolve an earlier independent mistake. */
export function unresolvedMistakeRevisions(attempts:LearningAttempt[],now=new Date()):number[]{
  const latest=new Map<number,LearningAttempt>();
  for(const a of [...attempts].sort((a,b)=>a.submittedAt.localeCompare(b.submittedAt))){
    if(a.assistance!=='none'||a.outcome==='unanswered'||Date.parse(a.submittedAt)>now.getTime())continue;
    latest.set(a.questionRevision,a);
  }
  return [...latest.values()].filter(a=>a.outcome==='incorrect').map(a=>a.questionRevision);
}
export function mistakeQuestions(bank:StudyQuestion[],progress:LearningProgress,exam:LearningExam,now=new Date()):StudyQuestion[]{
  return bank.filter(q=>q.examVersions.includes(exam)).flatMap(question=>{
    const revision=unresolvedMistakeRevisions(questionAttempts(progress,exam,question.id),now)[0];
    if(revision===undefined)return [];
    if(revision===question.revision)return [question];
    // An answer to a different revision must not silently clear an older mistake.
    const pinned=progress.sessions.filter(s=>s.exam===exam).flatMap(s=>s.items).find(item=>item.question.id===question.id&&item.question.revision===revision)?.question;
    return pinned?[pinned]:[];
  });
}
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
  const attempts=progress.attempts.filter(a=>a.exam===exam&&a.assistance==='none'&&a.outcome!=='unanswered'&&Date.parse(a.submittedAt)<=now.getTime());
  const first=new Map<string,LearningAttempt>();for(const a of [...attempts].sort((a,b)=>a.submittedAt.localeCompare(b.submittedAt)))if(!first.has(a.questionId))first.set(a.questionId,a);
  return {attempts:attempts.length,distinctQuestions:first.size,firstCorrect:[...first.values()].filter(a=>a.outcome==='correct').length,legacy:progress.legacyAcknowledgements.length};
}
