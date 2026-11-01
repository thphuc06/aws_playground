import {fingerprintGraph,validateReviewGraph,type Graph} from './architectureReview';
import type {AssistantResult,Priority} from './assistantContract';
export const workspaceKey='aws-playground-workspace-v2',legacyGraphKey='aws-playground-builder-v1';
export const emptyGraph=():Graph=>({version:1,nodes:[],edges:[],configs:{}});
export interface ArchitectureWorkspace {version:2;original:Graph;draft:Graph|null;draftBase:string|null;purpose:string;priority:Priority;protectedNodeIds:string[];review:AssistantResult|null;proposal:AssistantResult|null}
export function createWorkspace(original=emptyGraph()):ArchitectureWorkspace{return {version:2,original,draft:null,draftBase:null,purpose:'',priority:'balanced',protectedNodeIds:original.nodes.filter(n=>['ec2','lambda','ecs','eks','rds','aurora','dynamodb','s3','elasticache','opensearch'].includes(n.service)).map(n=>n.id),review:null,proposal:null}}
export function readWorkspace(storage:Pick<Storage,'getItem'|'setItem'>):ArchitectureWorkspace{
 const saved=storage.getItem(workspaceKey);
 if(saved){const parsed=JSON.parse(saved);const g=validateReviewGraph(parsed?.original);if(parsed?.version!==2||!g.ok||typeof parsed.purpose!=='string'||!['balanced','simplicity','cost','reliability'].includes(parsed.priority)||!Array.isArray(parsed.protectedNodeIds)||parsed.protectedNodeIds.some((id:unknown)=>typeof id!=='string')||!(parsed.draftBase===null||typeof parsed.draftBase==='string'))throw new Error('Saved workspace cannot be read. Export/recover it before replacing it.');const d=parsed.draft===null?null:validateReviewGraph(parsed.draft);if(d&&!d.ok)throw new Error('Saved AI draft cannot be read.');for(const r of [parsed.review,parsed.proposal])if(r!==null&&(!r||typeof r.summary!=='string'||!Array.isArray(r.findings)||!Array.isArray(r.assumptions)||!Array.isArray(r.sources)||!r.usage))throw new Error('Saved report cannot be read.');return {...createWorkspace(g.graph),...parsed,original:g.graph,draft:d&&d.ok?d.graph:null};}
 const legacy=storage.getItem(legacyGraphKey);if(!legacy)return createWorkspace();
 const g=validateReviewGraph(JSON.parse(legacy));if(!g.ok)throw new Error('Existing diagram could not be migrated safely.');
 // Original key remains intact. A failed write must not discard the diagram.
 return createWorkspace(g.graph);
}
export function saveWorkspace(storage:Pick<Storage,'setItem'>,workspace:ArchitectureWorkspace){storage.setItem(workspaceKey,JSON.stringify(workspace))}
export function acceptAssistantResult(workspace:ArchitectureWorkspace,result:AssistantResult):ArchitectureWorkspace {
 if(result.mode==='review')return {...workspace,review:result};
 if(result.proposalStatus==='edit_failed')return {...workspace,proposal:result};
 const parsed=validateReviewGraph(result.draft);if(!parsed.ok)throw new Error('AI draft failed client validation.');
 return {...workspace,draft:parsed.graph,draftBase:result.baseFingerprint,proposal:result};
}
export function completionNotice(mode:'review'|'design',stale:boolean){
 if(stale)return mode==='design'?'AI proposal created for an older snapshot. Rerun before adopting.':'Review completed for an older snapshot. Rerun to assess your latest changes.';
 return mode==='design'?'Assessment and AI proposal ready. Read the explanation and inspect the editable diagram below.':'Review complete. Findings are in the combined result tab. Choose Review & build proposal to also generate a diagram.';
}
export function isDraftStale(workspace:ArchitectureWorkspace){return workspace.draftBase!==fingerprintGraph(workspace.original)}
const stable=(v:unknown):string=>{if(Array.isArray(v))return '['+v.map(stable).join(',')+']';if(v&&typeof v==='object')return '{'+Object.entries(v).sort(([a],[b])=>a.localeCompare(b)).map(([k,x])=>JSON.stringify(k)+':'+stable(x)).join(',')+'}';return JSON.stringify(v)??'unknown'};
export function graphChanges(before:Graph,after:Graph):string[]{
 const changes:string[]=[];
 for(const n of before.nodes)if(!after.nodes.some(x=>x.id===n.id))changes.push('Remove service: '+n.label);
 for(const n of after.nodes){const old=before.nodes.find(x=>x.id===n.id);if(!old)changes.push('Add service: '+n.label);else if(old.service!==n.service||old.label!==n.label)changes.push('Change service: '+old.label+' → '+n.label);
  for(const map of ['architecture','lambdaConfigs','apiConfigs','eventBridgeConfigs','learningConfigs'] as const){const a=map==='architecture'?before.architecture?.nodes[n.id]:before[map]?.[n.id],b=map==='architecture'?after.architecture?.nodes[n.id]:after[map]?.[n.id];if(stable(a??{})!==stable(b??{})){const keys=[...new Set([...Object.keys(a??{}),...Object.keys(b??{})])].filter(k=>stable((a as any)?.[k])!==stable((b as any)?.[k]));changes.push('Configure '+n.label+': '+keys.join(', '));}}
 }
 const label=(g:Graph,id:string)=>g.nodes.find(n=>n.id===id)?.label??id;
 for(const e of before.edges)if(!after.edges.some(x=>x.id===e.id))changes.push('Remove connection: '+label(before,e.source)+' → '+label(before,e.target));
 for(const e of after.edges){const old=before.edges.find(x=>x.id===e.id);const name=label(after,e.source)+' → '+label(after,e.target);if(!old)changes.push('Add connection: '+name);else{if(old.source!==e.source||old.target!==e.target||old.label!==e.label)changes.push('Change connection: '+name);if(stable(before.configs[e.id]??{})!==stable(after.configs[e.id]??{}))changes.push('Configure connection: '+name);if((before.architecture?.relationships[e.id]??'unspecified')!==(after.architecture?.relationships[e.id]??'unspecified'))changes.push('Change relationship type: '+name);}}
 return changes;
}
