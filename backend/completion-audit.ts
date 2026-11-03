import {purposeRequirements,configurationInventory,emptyFrames,nodeValues,specified,type CompletionAudit,type DesignEvidence,type RequirementCheck,type FrameCheck} from '../src/completionAudit';
import {fingerprintGraph,type Graph} from '../src/architectureReview';

const text=(v:unknown)=>typeof v==='string'&&!!v.trim()&&v.length<=3000;
function referencesFrame(graph:Graph,frameId:string,rows:DesignEvidence[]):boolean {
 const frames=graph.network?.frames??[],ids=new Set([frameId]);
 for(let i=0;i<frames.length;i++)for(const f of frames)if(f.parentId&&ids.has(f.parentId))ids.add(f.id);
 const references=new Set([...ids,...Object.entries(graph.network?.registry?.frameBindings??{}).filter(([id])=>ids.has(id)).map(([,ref])=>ref.id),...frames.filter(f=>ids.has(f.id)).flatMap(f=>[f.availabilityZone,f.cidr].filter((v):v is string=>!!v))]);
 const contains=(v:unknown):boolean=>typeof v==='string'?references.has(v):Array.isArray(v)?v.some(contains):!!v&&typeof v==='object'?Object.values(v).some(contains):false;
 return rows.some(e=>e.kind==='node'&&e.fields.some(key=>contains(nodeValues(graph,e.id)[key])));
}
function evidence(graph:Graph,rows:any):DesignEvidence[]{
 if(!Array.isArray(rows)||rows.length>50)throw new Error('Provide up to 50 evidence references.');
 for(const e of rows){if(!e||!Array.isArray(e.fields)||e.fields.length>30||e.fields.some((k:unknown)=>typeof k!=='string'))throw new Error('Invalid evidence fields.');
  const value=e.kind==='node'?graph.nodes.find(n=>n.id===e.id):e.kind==='edge'?graph.edges.find(n=>n.id===e.id):e.kind==='frame'?graph.network?.frames.find(n=>n.id===e.id):e.kind==='resource'?(graph.network?.registry?.resources.find(n=>n.id===e.id)??graph.network?.resources.find(n=>n.id===e.id)):e.kind==='role'?graph.securityLibrary?.roles.find(n=>n.id===e.id):e.kind==='policy'?graph.securityLibrary?.policies.find(n=>n.id===e.id):undefined;
  if(!value)throw new Error('Evidence references an absent draft object: '+e.id);
  const canonical=e.kind==='resource'?graph.network?.registry?.resources.find(r=>r.id===e.id):undefined;const fields:Record<string,unknown>=e.kind==='node'?nodeValues(graph,e.id):canonical?{...canonical.values,...(canonical.owner?{owner:canonical.owner}:{}),context:canonical.context}:e.kind==='resource'?(value as any).values:value as unknown as Record<string,unknown>;
  if(e.fields.some((key:string)=>!Object.hasOwn(fields,key)||!specified(fields[key])))throw new Error('Evidence references an unspecified field on '+e.id+'. Use actual top-level configuration field keys, or mark the requirement as missing/needs-verification.');
 }
 return structuredClone(rows);
}
export function auditCompletion(graph:Graph,purpose:string,checks:any,frames:any):CompletionAudit{
 const requirements=purposeRequirements(purpose),empty=emptyFrames(graph);
 if(!Array.isArray(checks)||checks.length!==requirements.length||new Set(checks.map(c=>c?.requirementId)).size!==requirements.length)throw new Error('Assess every requirement exactly once using the requirement IDs from validate_draft.');
 for(const c of checks){if(!requirements.some(r=>r.id===c?.requirementId)||!['implemented','partial','missing','needs-verification'].includes(c.status)||!text(c.explanation))throw new Error('Invalid requirement assessment.');evidence(graph,c.evidence);if(['implemented','partial'].includes(c.status)&&!c.evidence.length)throw new Error('Implemented/partial requirements need evidence in the actual draft.');}
 if(!Array.isArray(frames)||frames.length!==empty.length||new Set(frames.map(f=>f?.frameId)).size!==empty.length)throw new Error('Explain every empty frame exactly once using the IDs from validate_draft.');
 for(const f of frames){if(!empty.some(e=>e.id===f?.frameId)||!['intentional','represented-by-service','missing'].includes(f.disposition)||!text(f.explanation))throw new Error('Invalid empty-frame assessment.');evidence(graph,f.evidence);if(f.disposition==='represented-by-service'&&!referencesFrame(graph,f.frameId,f.evidence))throw new Error('A shared service representation needs actual configuration referencing this frame or a descendant by logical ID, CIDR or explicit Availability Zone. Unrelated fields and service names are insufficient.');}
 const configuration=configurationInventory(graph);
 const gaps=checks.some((c:RequirementCheck)=>['partial','missing'].includes(c.status))||frames.some((f:FrameCheck)=>f.disposition==='missing')||configuration.some(c=>!c.configuredFields.length);
 return {status:gaps?'gaps':checks.some((c:RequirementCheck)=>c.status==='needs-verification')?'needs-verification':'addressed',requirements,checks:structuredClone(checks),emptyFrames:structuredClone(frames),configuration,graphFingerprint:fingerprintGraph(graph)};
}
