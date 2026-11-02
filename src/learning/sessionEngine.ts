import type {LearningExam,LearningProgress,LearningSession,PracticeMode,StudyQuestion} from './questionTypes';
import {questionAttempts,reviewState,scoreQuestion} from './practiceEngine';

export function eligibleQuestions(bank:StudyQuestion[],progress:LearningProgress,exam:LearningExam,mode:PracticeMode,chapter?:string,now=new Date()):StudyQuestion[]{
 return bank.filter(q=>q.examVersions.includes(exam)&&(!chapter||q.chapterIds.includes(chapter))).filter(q=>{
  const attempts=questionAttempts(progress,exam,q.id);
  if(mode==='mistakes')return attempts.at(-1)?.outcome==='incorrect';
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
 const previous=progress.attempts.filter(a=>a.exam===session.exam&&a.questionId===item.question.id);
 const revealedToday=previous.some(a=>a.questionRevision===item.question.revision&&a.submittedAt.slice(0,10)===now.toISOString().slice(0,10)&&progress.sessions.some(s=>s.id===a.sessionId&&(s.mode!=='mixed'||s.status==='completed')));
 return {...progress,attempts:[...progress.attempts,{id:attemptId,sessionId,exam:session.exam,questionId:item.question.id,questionRevision:item.question.revision,skillRefs:item.question.skillRefs.filter(s=>s.startsWith(session.exam+':')),selectedOptionIds:[...selected],optionOrder:[...item.optionOrder],submittedAt:now.toISOString(),outcome:scoreQuestion(item.question,selected),assistance:revealedToday?'answer-revealed':'none'}]};
}
export function advanceSession(progress:LearningProgress,sessionId:string,now=new Date()):LearningProgress{
 const session=progress.sessions.find(s=>s.id===sessionId);if(!session||session.status!=='active')return progress;
 if(!progress.attempts.some(a=>a.id===`${session.id}:${session.currentItem}`))throw new Error('Submit or skip this question before continuing.');
 const done=session.currentItem+1>=session.items.length;
 return {...progress,sessions:progress.sessions.map(s=>s.id!==sessionId?s:{...s,currentItem:done?s.currentItem:s.currentItem+1,status:done?'completed':'active',...(done?{completedAt:now.toISOString()}:{})})};
}
