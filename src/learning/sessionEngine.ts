import type {LearningExam,LearningProgress,LearningSession,PracticeMode,StudyQuestion} from './questionTypes';
import {matchesPracticeContext,mistakeQuestions,questionAttempts,reviewState,scoreQuestion,type PracticeContext} from './practiceEngine';

export function eligibleQuestions(bank:StudyQuestion[],progress:LearningProgress,exam:LearningExam,mode:PracticeMode,filter?:string|PracticeContext,now=new Date()):StudyQuestion[]{
 const context=typeof filter==='string'?{chapter:filter}:filter??{};
 const pool=mode==='mistakes'?mistakeQuestions(bank,progress,exam,now):bank;
 return [...new Map(pool.filter(q=>matchesPracticeContext(q,exam,context)).map(q=>[q.id,q])).values()].filter(q=>{
  const attempts=questionAttempts(progress,exam,q.id).filter(a=>a.questionRevision===q.revision);
  if(mode==='due-review')return reviewState(attempts,now).due;
  return true;
 });
}
export function createLearningSession(questions:StudyQuestion[],exam:LearningExam,mode:PracticeMode,count:number,id:string,now=new Date()):LearningSession{
 if(!questions.length)throw new Error('No questions match this practice selection.');
 if(!Number.isInteger(count)||count<1||count>50)throw new Error('Choose 1–50 questions.');
 const distinct=[...new Map(questions.filter(q=>q.examVersions.includes(exam)).map(q=>[q.id,q])).values()];
 if(!distinct.length)throw new Error('No questions support this exam version.');
 let seed=[...id].reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,17);
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const shuffle=<T,>(items:T[])=>{const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;};
 return {id,exam,mode,startedAt:now.toISOString(),status:'active',currentItem:0,items:shuffle(distinct).slice(0,count).map(question=>({question:structuredClone(question),optionOrder:shuffle(question.options.map(o=>o.id))}))};
}
export function submitSessionAnswer(progress:LearningProgress,sessionId:string,selected:string[],now=new Date()):LearningProgress{
 const session=progress.sessions.find(s=>s.id===sessionId);if(!session||session.status!=='active')throw new Error('This practice session is not active.');
 const item=session.items[session.currentItem];if(!item)throw new Error('Practice question is unavailable.');
 const attemptId=`${session.id}:${session.currentItem}`;
 if(progress.attempts.some(a=>a.id===attemptId))return progress;
 const revealedToday=(progress.feedbackExposures??[]).some(exposure=>exposure.questionId===item.question.id&&exposure.questionRevision===item.question.revision&&exposure.revealedAt.slice(0,10)===now.toISOString().slice(0,10)&&Date.parse(exposure.revealedAt)<=now.getTime());
 const answered:LearningProgress={...progress,attempts:[...progress.attempts,{id:attemptId,sessionId,exam:session.exam,questionId:item.question.id,questionRevision:item.question.revision,skillRefs:item.question.skillRefs.filter(s=>s.startsWith(session.exam+':')),selectedOptionIds:[...selected],optionOrder:[...item.optionOrder],submittedAt:now.toISOString(),outcome:scoreQuestion(item.question,selected),assistance:revealedToday?'answer-revealed':'none'}]};
 return session.mode==='mixed'?answered:recordFeedbackExposure(answered,sessionId,item.question.id,now);
}
export function advanceSession(progress:LearningProgress,sessionId:string,now=new Date()):LearningProgress{
 const session=progress.sessions.find(s=>s.id===sessionId);if(!session||session.status!=='active')return progress;
 if(!progress.attempts.some(a=>a.id===`${session.id}:${session.currentItem}`))throw new Error('Submit or skip this question before continuing.');
 const done=session.currentItem+1>=session.items.length;
 const advanced:LearningProgress={...progress,sessions:progress.sessions.map(s=>s.id!==sessionId?s:{...s,currentItem:done?s.currentItem:s.currentItem+1,status:done?'completed':'active',...(done?{completedAt:now.toISOString()}:{})})};
 return done?revealSessionFeedback(advanced,sessionId,now):advanced;
}
export function recordFeedbackExposure(progress:LearningProgress,sessionId:string,questionId:string,now=new Date()):LearningProgress{
 const session=progress.sessions.find(s=>s.id===sessionId),item=session?.items.find(i=>i.question.id===questionId);
 if(!session||!item||!progress.attempts.some(a=>a.sessionId===sessionId&&a.questionId===questionId)||session.mode==='mixed'&&session.status!=='completed')return progress;
 const revealedAt=now.toISOString(),id=`${sessionId}:${questionId}:${item.question.revision}:${revealedAt}`;
 if((progress.feedbackExposures??[]).some(exposure=>exposure.id===id))return progress;
 return {...progress,feedbackExposures:[...(progress.feedbackExposures??[]),{id,sessionId,questionId,questionRevision:item.question.revision,revealedAt}]};
}
export function revealSessionFeedback(progress:LearningProgress,sessionId:string,now=new Date()):LearningProgress{
 const session=progress.sessions.find(s=>s.id===sessionId);if(!session||session.status!=='completed')return progress;
 return session.items.reduce((next,item)=>recordFeedbackExposure(next,sessionId,item.question.id,now),progress);
}
