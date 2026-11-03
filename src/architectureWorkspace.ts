import {migrateConfiguration,isConfigurationDocument,configurationGraphFindings} from './configurationRegistry';
import {networkFindings} from './networkValidation';
import {fingerprintGraph,validateReviewGraph,type Graph} from './architectureReview';
import type {AssistantCheckpoint,AssistantResult,Priority} from './assistantContract';
export const workspaceKey='aws-playground-workspace-v3',previousWorkspaceKey='aws-playground-workspace-v2',legacyGraphKey='aws-playground-builder-v1';
export const emptyGraph=():Graph=>({version:1,nodes:[],edges:[],configs:{}});
export interface ArchitectureWorkspace {checkpoint?:AssistantCheckpoint;lastAttempt?:{status:'running'|'succeeded'|'failed'|'canceled';purpose:string;startedAt:string;error?:string};version:3;original:Graph;draft:Graph|null;draftBase:string|null;purpose:string;priority:Priority;protectedNodeIds:string[];review:AssistantResult|null;proposal:AssistantResult|null}
export function createWorkspace(original=emptyGraph()):ArchitectureWorkspace{return {version:3,original,draft:null,draftBase:null,purpose:'',priority:'balanced',protectedNodeIds:original.nodes.filter(n=>['ec2','lambda','ecs','eks','rds','aurora','dynamodb','s3','elasticache','opensearch'].includes(n.service)).map(n=>n.id),review:null,proposal:null}}
const object=(v:unknown):v is Record<string,any>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const strings=(v:unknown):v is string[]=>Array.isArray(v)&&v.every(x=>typeof x==='string');
const count=(v:unknown)=>typeof v==='number'&&Number.isSafeInteger(v)&&v>=0;
const usageValid=(v:unknown)=>object(v)&&['inputTokens','outputTokens','responses','searches'].every(k=>count(v[k]))&&typeof v.estimatedUsd==='number'&&Number.isFinite(v.estimatedUsd)&&v.estimatedUsd>=0&&typeof v.incomplete==='boolean'&&(v.toolCalls===undefined||count(v.toolCalls));
function sourceValid(value:unknown):boolean {
 if(!object(value)||!['id','title','url','verified'].every(k=>typeof value[k]==='string')||!['curated','live'].includes(value.kind))return false;
 try{const url=new URL(value.url);return url.protocol==='https:'&&!url.username&&!url.password;}catch{return false;}
}
const sourcesValid=(value:unknown)=>Array.isArray(value)&&value.every(sourceValid);
function activityValid(value:unknown):boolean {
 if(!object(value)||typeof value.id!=='string'||typeof value.title!=='string'||!strings(value.details)||!['running','completed','failed','interrupted'].includes(value.status)||typeof value.startedAt!=='number'||!Number.isFinite(value.startedAt)||value.startedAt<0)return false;
 if(value.finishedAt!==undefined&&(typeof value.finishedAt!=='number'||!Number.isFinite(value.finishedAt)||value.finishedAt<value.startedAt))return false;
 if(value.sources!==undefined&&!sourcesValid(value.sources))return false;
 if(value.graph!==undefined&&(!object(value.graph)||!count(value.graph.nodes)||!count(value.graph.edges)))return false;
 return true;
}
function evidenceValid(value:unknown):boolean {
 return Array.isArray(value)&&value.every(e=>object(e)&&['node','edge','frame','resource','role','policy'].includes(e.kind)&&typeof e.id==='string'&&strings(e.fields));
}
function completionValid(c:unknown):boolean {
 return object(c)&&['gaps','needs-verification','addressed'].includes(c.status)&&typeof c.graphFingerprint==='string'
  &&Array.isArray(c.requirements)&&c.requirements.every((x:unknown)=>object(x)&&typeof x.id==='string'&&typeof x.text==='string')
  &&Array.isArray(c.checks)&&c.checks.every((x:unknown)=>object(x)&&typeof x.requirementId==='string'&&typeof x.explanation==='string'&&['implemented','partial','missing','needs-verification'].includes(x.status)&&evidenceValid(x.evidence))
  &&Array.isArray(c.emptyFrames)&&c.emptyFrames.every((x:unknown)=>object(x)&&typeof x.frameId==='string'&&typeof x.explanation==='string'&&['intentional','represented-by-service','missing'].includes(x.disposition)&&evidenceValid(x.evidence))
  &&Array.isArray(c.configuration)&&c.configuration.every((x:unknown)=>object(x)&&typeof x.nodeId==='string'&&typeof x.label==='string'&&strings(x.configuredFields)&&strings(x.unspecifiedFields));
}
/** Every nested collection rendered by a persisted report is checked before import/storage. */
function validateStoredReport(r:unknown){
 if(r===null)return;
 const bad=():never=>{throw new Error('Saved report cannot be read safely. Export the original bytes before repairing it.');};
 if(!object(r))return bad();
 if(!['review','design'].includes(r.mode)||typeof r.baseFingerprint!=='string'||typeof r.summary!=='string'||!strings(r.assumptions)||!Array.isArray(r.findings)||!sourcesValid(r.sources)||!usageValid(r.usage))bad();
 if(r.findings.some((f:unknown)=>!object(f)||!strings(f.nodeIds)||!strings(f.edgeIds)||!strings(f.sourceIds)||!['info','warning','error'].includes(f.severity)||typeof f.title!=='string'||typeof f.detail!=='string'||f.scope!==undefined&&!['current','proposal'].includes(f.scope)))bad();
 if(r.draft!==null&&!validateReviewGraph(r.draft,'stored-editable').ok)bad();
 if(r.requestContext!==undefined&&(!object(r.requestContext)||!['purpose','completedAt'].every(k=>typeof r.requestContext[k]==='string')||!['balanced','simplicity','cost','reliability'].includes(r.requestContext.priority)||!strings(r.requestContext.protectedNodeIds)))bad();
 if(r.proposalStatus!==undefined&&!['changed','unchanged','edit_failed'].includes(r.proposalStatus))bad();
 if(r.serviceExplanations!==undefined&&(!Array.isArray(r.serviceExplanations)||r.serviceExplanations.some((e:unknown)=>!object(e)||!['nodeId','role','reason'].every(k=>typeof e[k]==='string')||!strings(e.configurationNotes)||!strings(e.sourceIds))))bad();
 if(r.activity!==undefined&&(!Array.isArray(r.activity)||!r.activity.every(activityValid)))bad();
 if(r.completion!==undefined&&!completionValid(r.completion))bad();
}
export function readWorkspace(storage:Pick<Storage,'getItem'|'setItem'>):ArchitectureWorkspace{
 const saved=storage.getItem(workspaceKey)??storage.getItem(previousWorkspaceKey);
 if(saved)return parseWorkspaceValue(JSON.parse(saved));
 const legacy=storage.getItem(legacyGraphKey);if(!legacy)return createWorkspace();
 const g=validateReviewGraph(JSON.parse(legacy),'stored-editable');if(!g.ok)throw new Error('Existing diagram could not be migrated safely.');
 // Original key remains intact. A failed write must not discard the diagram.
 return createWorkspace(migrateGraphConfiguration(g.graph));
}
/** Validates portable or stored data without changing browser storage. */
export function parseWorkspaceValue(value:unknown):ArchitectureWorkspace {
 const parsed=value as ArchitectureWorkspace;const g=validateReviewGraph(parsed?.original,'stored-editable');if(!([2,3].includes(parsed?.version))||!g.ok||typeof parsed.purpose!=='string'||!['balanced','simplicity','cost','reliability'].includes(parsed.priority)||!strings(parsed.protectedNodeIds)||!(parsed.draftBase===null||typeof parsed.draftBase==='string'))throw new Error('Saved workspace cannot be read. Export/recover it before replacing it.');const d=parsed.draft===null?null:validateReviewGraph(parsed.draft,'stored-editable');if(d&&!d.ok)throw new Error('Saved AI draft cannot be read.');for(const r of [parsed.review,parsed.proposal])validateStoredReport(r);if(parsed.checkpoint!==undefined){const cp=validateReviewGraph(parsed.checkpoint?.draft,'stored-editable');if(!cp.ok||typeof parsed.checkpoint.baseFingerprint!=='string'||typeof parsed.checkpoint.purpose!=='string'||!strings(parsed.checkpoint.protectedNodeIds)||typeof parsed.checkpoint.summary!=='string'||typeof parsed.checkpoint.updatedAt!=='string'||!usageValid(parsed.checkpoint.usage)||!['balanced','simplicity','cost','reliability'].includes(parsed.checkpoint.priority))throw new Error('Saved unfinished draft cannot be read safely.');}if(parsed.lastAttempt&&(!['running','succeeded','failed','canceled'].includes(parsed.lastAttempt.status)||typeof parsed.lastAttempt.purpose!=='string'||typeof parsed.lastAttempt.startedAt!=='string'||parsed.lastAttempt.error!==undefined&&typeof parsed.lastAttempt.error!=='string'))throw new Error('Saved attempt metadata cannot be read safely.');return {...createWorkspace(g.graph),...parsed,version:3,original:migrateGraphConfiguration(g.graph),draft:d&&d.ok?migrateGraphConfiguration(d.graph):null};
}
export function saveWorkspace(storage:Pick<Storage,'setItem'>,workspace:ArchitectureWorkspace){storage.setItem(workspaceKey,JSON.stringify(workspace))}
/** Historical evidence never bypasses today's bounded checks at adoption time. */
export function strictDraftErrors(graph:Graph):string[]{
 const checked=validateReviewGraph(graph);if(!checked.ok)return [checked.error];
 return [...graph.nodes.flatMap(node=>{const doc=graph.architecture?.nodes[node.id];return isConfigurationDocument(doc)?configurationGraphFindings(node.service,doc,graph).filter(f=>f.level==='error').map(f=>node.label+': '+f.detail):[];}),...networkFindings(graph.network,graph.nodes).filter(f=>f.level==='error').map(f=>f.detail)];
}
export function acceptAssistantResult(workspace:ArchitectureWorkspace,result:AssistantResult):ArchitectureWorkspace {
 if(result.mode==='review')return {...workspace,review:result};
 if(result.proposalStatus==='edit_failed')return {...workspace,proposal:result};
 const parsed=validateReviewGraph(result.draft);if(!parsed.ok)throw new Error('AI draft failed client validation.');
 return {...workspace,checkpoint:undefined,draft:parsed.graph,draftBase:result.baseFingerprint,proposal:result};
}
export function completionNotice(mode:'review'|'design',stale:boolean){
 if(stale)return mode==='design'?'AI proposal created for an older snapshot. Rerun before adopting.':'Review completed for an older snapshot. Rerun to assess your latest changes.';
 return mode==='design'?'Assessment and AI proposal ready. Read the explanation and inspect the editable diagram below.':'Review complete. Findings are in the combined result tab. Choose Review & build proposal to also generate a diagram.';
}
export function isDraftStale(workspace:ArchitectureWorkspace){const c=workspace.proposal?.requestContext;return workspace.draftBase!==fingerprintGraph(workspace.original)||!!workspace.proposal&&(!c||c.purpose!==workspace.purpose||c.priority!==workspace.priority||JSON.stringify([...c.protectedNodeIds].sort())!==JSON.stringify([...workspace.protectedNodeIds].sort()))}
const stable=(v:unknown):string=>{if(Array.isArray(v))return '['+v.map(stable).join(',')+']';if(v&&typeof v==='object')return '{'+Object.entries(v).sort(([a],[b])=>a.localeCompare(b)).map(([k,x])=>JSON.stringify(k)+':'+stable(x)).join(',')+'}';return JSON.stringify(v)??'unknown'};
export function graphChanges(before:Graph,after:Graph):string[]{
 const networkMeaning=(g:Graph)=>g.network?.registry?{resources:g.network.registry.resources,serviceBindings:g.network.registry.serviceBindings}:g.network?{...g.network,frames:g.network.frames.map(({x,y,width,height,...frame})=>frame)}:null;
 const changes:string[]=[];if(stable(networkMeaning(before))!==stable(networkMeaning(after)))changes.push('Update frames, memberships or shared network resources');const decisions=(g:Graph)=>g.network?.registry?.migration?.conflicts.map(({id,status,resolution})=>({id,status,resolution}))??[];if(stable(decisions(before))!==stable(decisions(after)))changes.push('Record canonical resource migration decisions');
 for(const n of before.nodes)if(!after.nodes.some(x=>x.id===n.id))changes.push('Remove service: '+n.label);
 for(const n of after.nodes){const old=before.nodes.find(x=>x.id===n.id);if(!old)changes.push('Add service: '+n.label);else if(old.service!==n.service||old.label!==n.label)changes.push('Change service: '+old.label+' → '+n.label);
  for(const map of ['architecture','lambdaConfigs','apiConfigs','eventBridgeConfigs','learningConfigs'] as const){const rawA=map==='architecture'?before.architecture?.nodes[n.id]:before[map]?.[n.id],rawB=map==='architecture'?after.architecture?.nodes[n.id]:after[map]?.[n.id];const a=map==='architecture'?(isConfigurationDocument(rawA)?rawA.values:migrateConfiguration(n.service,rawA as any??{}).values):rawA,b=map==='architecture'?(isConfigurationDocument(rawB)?rawB.values:migrateConfiguration(n.service,rawB as any??{}).values):rawB;if(stable(a??{})!==stable(b??{})){const keys=[...new Set([...Object.keys(a??{}),...Object.keys(b??{})])].filter(k=>stable((a as any)?.[k])!==stable((b as any)?.[k]));changes.push('Configure '+n.label+': '+keys.join(', '));}}
 }
 const label=(g:Graph,id:string)=>g.nodes.find(n=>n.id===id)?.label??id;
 for(const e of before.edges)if(!after.edges.some(x=>x.id===e.id))changes.push('Remove connection: '+label(before,e.source)+' → '+label(before,e.target));
 for(const e of after.edges){const old=before.edges.find(x=>x.id===e.id);const name=label(after,e.source)+' → '+label(after,e.target);if(!old)changes.push('Add connection: '+name);else{if(old.source!==e.source||old.target!==e.target||old.label!==e.label)changes.push('Change connection: '+name);if(stable(before.configs[e.id]??{})!==stable(after.configs[e.id]??{}))changes.push('Configure connection: '+name);if((before.architecture?.relationships[e.id]??'unspecified')!==(after.architecture?.relationships[e.id]??'unspecified'))changes.push('Change relationship type: '+name);}}
 const policyContent=(p:NonNullable<Graph['securityLibrary']>['policies'][number])=>{let document:unknown=p.document;try{document=JSON.parse(p.document)}catch{}return {name:p.name,kind:p.kind,document,managedPolicyId:p.managedPolicyId}};
 for(const p of before.securityLibrary?.policies??[])if(!after.securityLibrary?.policies.some(x=>x.id===p.id))changes.push('Remove policy: '+p.name);
 for(const p of after.securityLibrary?.policies??[]){const old=before.securityLibrary?.policies.find(x=>x.id===p.id);if(!old)changes.push('Add policy: '+p.name);else if(stable(policyContent(old))!==stable(policyContent(p)))changes.push('Update policy: '+p.name);}
 for(const r of before.securityLibrary?.roles??[])if(!after.securityLibrary?.roles.some(x=>x.id===r.id))changes.push('Remove role: '+r.name);
 for(const r of after.securityLibrary?.roles??[]){const old=before.securityLibrary?.roles.find(x=>x.id===r.id);if(!old)changes.push('Add role: '+r.name);else if(stable(old)!==stable(r))changes.push('Update role permissions/trust: '+r.name);}
 return changes;
}

export function migrateGraphConfiguration(graph:Graph):Graph {const next=structuredClone(graph);if(next.architecture)for(const node of next.nodes){const old=next.architecture.nodes[node.id];if(old)next.architecture.nodes[node.id]=migrateConfiguration(node.service,old) as unknown as typeof old;}return next;}

export function checkpointMatches(workspace:ArchitectureWorkspace):boolean{const c=workspace.checkpoint;return !!c&&c.baseFingerprint===fingerprintGraph(workspace.original)&&c.purpose===workspace.purpose&&c.priority===workspace.priority&&JSON.stringify([...c.protectedNodeIds].sort())===JSON.stringify([...workspace.protectedNodeIds].sort())}
export function acceptCheckpoint(workspace:ArchitectureWorkspace,checkpoint:AssistantCheckpoint):ArchitectureWorkspace{const parsed=validateReviewGraph(checkpoint.draft,'stored-editable');if(!parsed.ok)throw new Error('Invalid draft checkpoint.');if(typeof checkpoint.baseFingerprint!=='string'||typeof checkpoint.purpose!=='string'||!['balanced','simplicity','cost','reliability'].includes(checkpoint.priority)||!Array.isArray(checkpoint.protectedNodeIds)||checkpoint.protectedNodeIds.some(id=>typeof id!=='string')||typeof checkpoint.updatedAt!=='string'||typeof checkpoint.summary!=='string')throw new Error('Invalid checkpoint metadata.');return {...workspace,checkpoint:{...checkpoint,draft:parsed.graph}};}
