import {useMemo,useState} from 'react';
import {configurationFields} from './configurationRegistry';
import type {ConfigField} from './configurationTypes';
import './serviceConfigurationReference.css';
import {chapterNavigation} from './chapterNavigation';

function flatten(fields:ConfigField[],parent=''):{path:string;field:ConfigField}[]{
 return fields.flatMap(field=>[{path:parent+field.key,field},...flatten(field.itemFields??[],parent+field.key+'.')]);
}
/** Read-only reference: opening a service never creates a node or changes its saved configuration. */
export default function ServiceConfigurationReference({serviceId}:{serviceId:string}){
 const [query,setQuery]=useState(''),[section,setSection]=useState('all');
 const all=useMemo(()=>flatten(configurationFields[serviceId]??[]),[serviceId]);
 const visible=all.filter(({path,field})=>(section==='all'||field.section===section)&&`${path} ${field.label} ${field.help} ${field.documentation?.whenToUse??''}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
 return <details className="service-config-reference"><summary>Configuration reference · {all.length} fields including table columns</summary>
  <p>Explore the editor's supported settings before adding a service. This reference is read-only. Declared settings and local checks do not establish live AWS deployment state.</p>
  <div className="service-config-reference-filters"><label>Find a configuration field<input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Name, parameter key or concept"/></label><label>Configuration section<select value={section} onChange={event=>setSection(event.target.value)}><option value="all">All sections</option>{[...new Set(all.map(({field})=>field.section))].map(value=><option key={value} value={value}>{value}</option>)}</select></label></div>
  <p role="status">{visible.length} matching fields</p>
  {visible.map(({path,field})=><details key={path} className="service-reference-field"><summary><strong>{field.label}</strong><code>{path}</code></summary>
   <p>{field.documentation?.purpose??field.help}</p><p className="service-reference-meta">{field.section} · {field.kind} · {field.tier??'supporting'}{field.semantics?' · '+field.semantics.replaceAll('-',' '):''}</p>
   {field.documentation?.whenToUse&&<p><b>When to use:</b> {field.documentation.whenToUse}</p>}
   {field.documentation?.omission&&<p><b>When omitted:</b> {field.documentation.omission}</p>}
   {field.when&&<p><b>Prerequisite:</b> <code>{field.when.field}</code> must be {field.when.values.map(String).join(' or ')}. Missing prerequisite values leave applicability unknown.</p>}
   {field.options&&<p><b>Editor choices:</b> {field.options.map(value=><code className="service-reference-option" key={value}>{value}</code>)}</p>}
   {field.kind==='number'&&<p><b>Declared numeric domain:</b> {field.allowedNumbers?.join(', ')??`${field.min??'no declared minimum'} to ${field.max??'no declared maximum'}`}{field.unit?' '+field.unit:''}{field.integer?' (whole numbers)':''}.</p>}
   {field.defaultValue!==undefined&&<p><b>Documented default:</b> <code>{JSON.stringify(field.defaultValue)}</code>. The editor applies it only when requested.</p>}
   {field.awsLimit&&<p><b>{field.awsLimit.kind==='hard'?'Hard limit':field.awsLimit.kind==='adjustable'?'Adjustable quota':'Context-dependent limit'}:</b> {field.awsLimit.description} <a href={field.awsLimit.sourceUrl} target="_blank" rel="noreferrer">Limit reference ↗</a></p>}
   {!!field.documentation?.effects?.length&&<ul>{field.documentation.effects.map(effect=><li key={effect}>{effect}</li>)}</ul>}
   {field.documentation?.examples?.map((example,index)=><div className="service-reference-example" key={index}><b>{example.valid===false?'Counterexample':'Example'}</b><pre>{JSON.stringify(example.value,null,2)}</pre><p>{example.explanation}</p></div>)}
   {(field.documentationReferences??(field.documentationSource?[field.documentationSource]:[])).map(source=><p key={source.url}><a href={source.url} target="_blank" rel="noreferrer">Decision guide: {source.title} · {source.verified} ↗</a></p>)}
   {field.documentation?.relatedLessons?.map(id=><p key={id}><a href={'?view=learn&exam=DVA-C03&chapter='+encodeURIComponent(id)} target="_blank" rel="noreferrer">Study: {chapterNavigation.find(chapter=>chapter.id===id)?.title??id} ↗</a></p>)}
   {field.audit&&<p><b>Recorded check:</b> {field.audit.scope} · {field.audit.checked}</p>}
   {field.evidence&&<p><b>Evidence scope:</b> {field.evidence.status.replaceAll('-',' ')}. {field.evidence.scope}</p>}
   {field.source&&<a href={field.source.url} target="_blank" rel="noreferrer">{field.source.title} · source review {field.source.verified} ↗</a>}
  </details>)}
  {!visible.length&&<button onClick={()=>{setQuery('');setSection('all')}}>Clear configuration filters</button>}
 </details>;
}
