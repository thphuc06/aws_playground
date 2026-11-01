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
 const parsed=validateReviewGraph(result.draft);if(!parsed.ok)throw new Error('AI draft failed client validation.');
 return {...workspace,draft:parsed.graph,draftBase:result.baseFingerprint,proposal:result};
}
export function completionNotice(mode:'review'|'design',stale:boolean){
 if(stale)return mode==='design'?'AI proposal created for an older snapshot. Rerun before adopting.':'Review completed for an older snapshot. Rerun to assess your latest changes.';
 return mode==='design'?'AI proposal created. The editable diagram is in the AI proposal tab below.':'Review complete. Findings are in AI review. To generate a separate diagram, choose Build AI proposal.';
}
export function isDraftStale(workspace:ArchitectureWorkspace){return workspace.draftBase!==fingerprintGraph(workspace.original)}
export function graphChanges(before:Graph,after:Graph):string[]{
 const changes:string[]=[];for(const n of before.nodes)if(!after.nodes.some(x=>x.id===n.id))changes.push('Remove '+n.label);
 for(const n of after.nodes){const old=before.nodes.find(x=>x.id===n.id);if(!old)changes.push('Add '+n.label);else if(JSON.stringify(old)!==JSON.stringify(n))changes.push('Update '+n.label);if(JSON.stringify(before.architecture?.nodes[n.id]??{})!==JSON.stringify(after.architecture?.nodes[n.id]??{}))changes.push('Configure '+n.label);}
 for(const e of before.edges)if(!after.edges.some(x=>x.id===e.id))changes.push('Remove connection '+e.id);
 for(const e of after.edges)if(!before.edges.some(x=>x.id===e.id))changes.push('Add connection '+e.id);
 return changes;
}
