import type {CompletionAudit,DesignEvidence} from './completionAudit';
import {fingerprintGraph,type Graph} from './architectureReview';

export default function CompletionSummary({audit,graph}:{audit?:CompletionAudit;graph:Graph|null}){
 if(!audit)return <p className="review-stale">This older result has no requirement-by-requirement assessment. Its schema validation does not establish completeness.</p>;
 const names=new Map([...graph?.nodes.map(n=>[n.id,n.label] as const)??[],...graph?.network?.frames.map(f=>[f.id,f.name] as const)??[],...graph?.network?.resources.map(r=>[r.id,r.name] as const)??[]]);
 const label=(e:DesignEvidence)=>`${names.get(e.id)??e.id}${e.fields.length?' · '+e.fields.join(', '):' · topology reference'}`;
 const count=(status:string)=>audit.checks.filter(c=>c.status===status).length;
 const stale=!!graph&&fingerprintGraph(graph)!==audit.graphFingerprint;
 return <section className={'completion-summary '+audit.status} aria-label="Requirement coverage">
  <h3>{audit.status==='gaps'?'Draft saved with gaps':audit.status==='needs-verification'?'Draft saved — verification required':'Requirements assessed in the draft'}</h3>
  <p>{count('implemented')} represented · {count('partial')} partial · {count('missing')} missing · {count('needs-verification')} need verification</p>
  <small>AI assessment with checked object/field references. This is not independent proof of AWS behavior or production readiness.</small>
  {stale&&<p className="review-stale">The diagram has changed since this assessment. These checks describe the saved result.</p>}
  <details open={audit.status!=='addressed'}><summary>Requirements and evidence ({audit.requirements.length})</summary><ul className="completion-checks">{audit.requirements.map(r=>{const c=audit.checks.find(c=>c.requirementId===r.id);return <li key={r.id}><strong>{r.text}</strong><span className="completion-status">{c?.status==='implemented'?'Represented in draft':c?.status.replaceAll('-',' ')??'Not assessed'}</span><p>{c?.explanation}</p>{!!c?.evidence.length&&<details><summary>Draft evidence ({c.evidence.length})</summary><ul>{c.evidence.map((e,i)=><li key={i}>{label(e)}</li>)}</ul></details>}</li>})}</ul></details>
  {!!audit.emptyFrames.length&&<details><summary>Empty frames explained ({audit.emptyFrames.length})</summary><ul className="completion-checks">{audit.emptyFrames.map(f=><li key={f.frameId}><strong>{names.get(f.frameId)??f.frameId}</strong><span className="completion-status">{f.disposition.replaceAll('-',' ')}</span><p>{f.explanation}</p>{!!f.evidence.length&&<ul>{f.evidence.map((e,i)=><li key={i}>{label(e)}</li>)}</ul>}</li>)}</ul></details>}
  <details><summary>Recorded configuration by service</summary><p>Unspecified fields are not automatically required. This inventory counts top-level fields; nested settings and applicability still need review.</p><ul className="completion-checks">{audit.configuration.map(c=><li key={c.nodeId}><strong>{c.label}</strong><p>{c.configuredFields.length} fields recorded · {c.unspecifiedFields.length} applicable/conditional fields unspecified</p><details><summary>Field inventory</summary><p>Recorded: {c.configuredFields.join(', ')||'None'}</p><p>Unspecified: {c.unspecifiedFields.join(', ')||'None'}</p></details></li>)}</ul></details>
 </section>;
}
