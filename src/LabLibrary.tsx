import {useState} from 'react';
import type {ExamVersionId} from './examVersions';
import {labDefinitions} from './learning/labs/definitions';
import './learningLabs.css';
export default function LabLibrary({exam,onOpen}:{exam:ExamVersionId;onOpen:(labId:string)=>void}){
 const [query,setQuery]=useState('');const labs=labDefinitions.filter(l=>l.examVersions.includes(exam)&&`${l.title} ${l.summary} ${l.serviceIds.join(' ')}`.toLowerCase().includes(query.toLowerCase().trim()));
 return <section className="lab-library"><div className="page-heading"><div className="eyebrow">PREDICT · REPAIR · VERIFY</div><h1>Isolated practice labs</h1><p>Inspect supplied evidence, change a copied fixture and check the stated invariants. Your personal architecture and AI drafts are never changed.</p></div><label>Find a lab<input aria-label="Search labs" type="search" placeholder="SQS, authorization, rollback…" value={query} onChange={e=>setQuery(e.target.value)}/></label><p role="status">{labs.length} labs for {exam} · synthetic local exercises</p><div className="lab-library-grid">{labs.map(l=><article key={l.id}><small>{l.serviceIds.join(' · ')}</small><h2>{l.title}</h2><p>{l.summary}</p><span>{l.objectives.length} fixture objectives · version {l.version}</span><button onClick={()=>onOpen(l.id)}>Open lab</button></article>)}</div>{!labs.length&&<p>No matching labs. Try a service name or clear the search.</p>}</section>;
}
