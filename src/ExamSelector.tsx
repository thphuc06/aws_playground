import ContextHelp from './ContextHelp';
import {examVersions,type ExamVersionId} from './examVersions';
import './theory.css';

/** Kept independent of lesson bodies, glossary and practice data for Home. */
export default function ExamSelector({value,onChange}:{value:ExamVersionId;onChange:(v:ExamVersionId)=>void}) {
 const exam=examVersions.find(e=>e.id===value)!;
 return <section className="exam-selector"><label>Exam version<select aria-label="Exam version" value={value} onChange={e=>onChange(e.target.value as ExamVersionId)}><option>DVA-C02</option><option>DVA-C03</option></select></label><div><b>{exam.label}</b><ContextHelp label="Exam dates & guide"><p>{exam.availability}</p><a href={exam.guideUrl} target="_blank" rel="noreferrer">Official guide ↗</a><small>Snapshot checked {exam.verified}. Verify booking dates with AWS.</small></ContextHelp></div></section>;
}
