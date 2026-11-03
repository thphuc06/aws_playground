import {ArrowUpRight} from 'lucide-react';
import {LearningGlossary} from './LearningReferenceTools';
import {TheoryCoverage,TheoryResources} from './TheoryIndex';
import ConfigurationCoverage from './ConfigurationCoveragePanel';
import ExamSelector from './ExamSelector';
import {examVersions,type ExamVersionId} from './examVersions';
import {chapters,sources} from './content';
import LearningCoverageOverview,{type LearningCoverageNavigation} from './LearningCoverageOverview';
import {configurationCoverage} from './configurationCoverage';

export default function CoveragePage({exam,onExam,onChapter,onService,onPractice,onLab}:{exam:ExamVersionId;onExam:(exam:ExamVersionId)=>void;onChapter:(id:string)=>void}&LearningCoverageNavigation) {
 return <><div className="page-heading"><div className="eyebrow"><span/> AN HONEST MAP</div><h1>Explore learning coverage.</h1><p>Browse available guides, exercises and scoped local checks. These inventory counts do not measure your knowledge or AWS deployment validity.</p></div><ExamSelector value={exam} onChange={onExam}/><LearningCoverageOverview exam={exam} onService={onService} onPractice={onPractice} onLab={onLab}/><div className="domain-grid">{examVersions.find(e=>e.id===exam)!.domains.map(({name:title,weight},i)=><div className="domain-card" key={title}><span>DOMAIN 0{i+1}</span><b>{weight}<small>%</small></b><h3>{title}</h3><div className="progress-track"><span style={{width:weight+'%'}}/></div></div>)}</div><details className="coverage-panel"><summary>Legacy C02-origin local lesson slices ({configurationCoverage.length})</summary><p>This historical lesson inventory is separate from the expanded catalog and the new standalone exercise/lab inventories above.</p><ConfigurationCoverage/></details><TheoryCoverage chapters={chapters} exam={exam} onOpen={onChapter}/><TheoryResources/><section className="sources-panel"><h2>Official sources & verification</h2><p>Lessons synthesize these sources in original language. Service behavior can change; follow the linked documentation for current details.</p>{sources.map(source=><a className="source-row" href={source.url} key={source.id} target="_blank" rel="noreferrer"><div><strong>{source.title}</strong><small>AWS · Verified {source.verified}</small></div><ArrowUpRight size={18}/></a>)}</section><LearningGlossary/></>;
}
