import {chapters} from './content';
import {canvasCatalog} from './serviceCatalog';
import {supportsExam} from './appRoutes';
import type {ExamVersionId} from './examVersions';
export type LearningSearchResult={id:string;kind:'lesson'|'section'|'service';title:string;context:string;chapter?:string;section?:string;service?:string};
const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const index:({text:string;exam?:ExamVersionId[]}&LearningSearchResult)[]=[
 ...chapters.flatMap(c=>[{id:'lesson-'+c.id,kind:'lesson' as const,title:c.title,context:c.summary,chapter:c.id,text:normalize(c.title+' '+c.summary+' '+c.objectives.join(' ')),exam:(['DVA-C02','DVA-C03'] as const).filter(e=>supportsExam(c,e))},...c.sections.map(s=>({id:'section-'+c.id+'-'+s.id,kind:'section' as const,title:s.title,context:c.title,chapter:c.id,section:s.id,text:normalize(s.title+' '+s.body.join(' ')),exam:(['DVA-C02','DVA-C03'] as const).filter(e=>supportsExam(c,e))}))]),
 ...canvasCatalog.map(s=>({id:'service-'+s.id,kind:'service' as const,title:s.name,context:s.category+' · '+s.purpose,service:s.id,text:normalize(s.id+' '+s.name+' '+s.purpose+' '+s.category)}))
];
export function searchLearning(query:string,exam:ExamVersionId,limit=12):LearningSearchResult[]{
 const terms=normalize(query).split(/\s+/).filter(Boolean);if(!terms.length)return [];
 return index.filter(item=>(!item.exam||item.exam.includes(exam))&&terms.every(t=>item.text.includes(t))).sort((a,b)=>Number(terms.every(t=>normalize(b.title).includes(t)))-Number(terms.every(t=>normalize(a.title).includes(t)))||a.kind.localeCompare(b.kind)).slice(0,limit).map(({text,exam,...result})=>result);
}
