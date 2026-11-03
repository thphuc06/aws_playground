import {ArrowUpRight} from 'lucide-react';
import {LearningGlossary} from './LearningReferenceTools';
import {TheoryCoverage,TheoryResources} from './TheoryIndex';
import ConfigurationCoverage from './ConfigurationCoveragePanel';
import ExamSelector from './ExamSelector';
import {examVersions,type ExamVersionId} from './examVersions';
import {chapters,sources} from './content';

export default function CoveragePage({exam,onExam,onChapter}:{exam:ExamVersionId;onExam:(exam:ExamVersionId)=>void;onChapter:(id:string)=>void}) {
 return <><div className="page-heading"><div className="eyebrow"><span/> AN HONEST MAP</div><h1>Know what you've covered.</h1><p>Configuration lessons and theory have separate coverage; this is not a complete exam course. Keep the official guide as your source of truth.</p></div><ExamSelector value={exam} onChange={onExam}/><div className="domain-grid">{examVersions.find(e=>e.id===exam)!.domains.map(({name:title,weight},i)=><div className="domain-card" key={title}><span>DOMAIN 0{i+1}</span><b>{weight}<small>%</small></b><h3>{title}</h3><div className="progress-track"><span style={{width:weight+'%'}}/></div></div>)}</div><ConfigurationCoverage/><TheoryCoverage chapters={chapters} exam={exam} onOpen={onChapter}/><TheoryResources/><section className="sources-panel"><h2>Official sources & verification</h2><p>Lessons synthesize these sources in original language. Service behavior can change; follow the linked documentation for current details.</p>{sources.map(source=><a className="source-row" href={source.url} key={source.id} target="_blank" rel="noreferrer"><div><strong>{source.title}</strong><small>AWS · Verified {source.verified}</small></div><ArrowUpRight size={18}/></a>)}</section><LearningGlossary/></>;
}
