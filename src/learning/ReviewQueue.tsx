import type {PracticeContext} from './practiceEngine';
import {eligibleQuestions} from './sessionEngine';
import type {LearningExam,LearningProgress,PracticeMode,StudyQuestion} from './questionTypes';
export default function ReviewQueue({bank,progress,exam,context={},busy=false,onStart}:{bank:StudyQuestion[];progress:LearningProgress;exam:LearningExam;context?:PracticeContext;busy?:boolean;onStart:(mode:PracticeMode)=>void}){
 const due=eligibleQuestions(bank,progress,exam,'due-review',context);const mistakes=eligibleQuestions(bank,progress,exam,'mistakes',context);
 return <section className="learning-review" aria-label="Review queue"><h2>Your next review</h2><p>{due.length} due for review · {mistakes.length} questions with unresolved independent mistakes in the selected filters</p><div className="learning-actions"><button disabled={busy||!due.length} onClick={()=>onStart('due-review')}>Practice due questions</button><button disabled={busy||!mistakes.length} onClick={()=>onStart('mistakes')}>Review mistakes</button></div><small>Mistakes stay here until a later independent correct answer to the same revision. Skips and assisted answers do not clear them. Review intervals: 1, 3, 7 and 14 days after independent practice, measured in UTC. Same-day repeats do not advance the interval. This is a study aid, not an exam-readiness score.</small></section>;
}
