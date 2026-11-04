import type {Graph} from './architectureReview';
import type {ApprovedPlan,AssistantSource,PlannedChange,PlannedChangeKind} from './assistantContract';
export const plannedChangeKinds:readonly PlannedChangeKind[]=['add-service','remove-service','connect','configure','network','security','layout'];
export const PLAN_LIMITS={changes:30,sources:40,id:80,title:200,rationale:1500,nodeIds:20,serviceIds:10,sourceIds:10};
const text=(value:unknown,max:number):value is string=>typeof value==='string'&&value.trim().length>0&&value.length<=max;
const ids=(value:unknown,max:number):value is string[]=>Array.isArray(value)&&value.length<=max&&value.every(id=>text(id,PLAN_LIMITS.id));
export interface PlanContext {graph:Graph;protectedNodeIds:readonly string[];serviceIds:readonly string[];sourceIds?:readonly string[]}
/**
 * Plans come from a model or back from the browser, so both are untrusted:
 * keep only known fields and, with a context, reject references the graph
 * does not contain or protected services the plan would remove.
 */
export function parsePlannedChanges(value:unknown,context?:PlanContext):PlannedChange[]{
 if(!Array.isArray(value)||value.length>PLAN_LIMITS.changes)throw new Error('A plan lists at most '+PLAN_LIMITS.changes+' changes.');
 const seen=new Set<string>();
 return value.map(raw=>{
  const c=raw as Record<string,unknown>;
  if(!c||typeof c!=='object'||!text(c.id,PLAN_LIMITS.id)||seen.has(c.id))throw new Error('Planned changes need unique IDs.');seen.add(c.id);
  if(!text(c.title,PLAN_LIMITS.title)||!text(c.rationale,PLAN_LIMITS.rationale)||!plannedChangeKinds.includes(c.kind as PlannedChangeKind))throw new Error('Invalid planned change text or kind.');
  if(!ids(c.nodeIds,PLAN_LIMITS.nodeIds)||!ids(c.serviceIds,PLAN_LIMITS.serviceIds)||!ids(c.sourceIds,PLAN_LIMITS.sourceIds))throw new Error('Invalid planned change references.');
  if(context){
   if(c.nodeIds.some(id=>!context.graph.nodes.some(n=>n.id===id)))throw new Error('A planned change references an unknown node.');
   if(c.serviceIds.some(id=>!context.serviceIds.includes(id)))throw new Error('A planned change references an unknown service.');
   if(c.kind==='remove-service'&&c.nodeIds.some(id=>context.protectedNodeIds.includes(id)))throw new Error('A plan cannot remove a protected service.');
   if(context.sourceIds&&c.sourceIds.some(id=>!context.sourceIds!.includes(id)))throw new Error('A planned change cites an unknown source.');
  }
  return {id:c.id,title:c.title,rationale:c.rationale,kind:c.kind as PlannedChangeKind,nodeIds:[...c.nodeIds],serviceIds:[...c.serviceIds],sourceIds:[...c.sourceIds]};
 });
}
const sourceShape=(s:unknown):s is AssistantSource=>{if(!s||typeof s!=='object')return false;const v=s as Record<string,unknown>;if(!text(v.id,PLAN_LIMITS.id)||!text(v.title,PLAN_LIMITS.title)||typeof v.url!=='string'||v.url.length>2000||typeof v.verified!=='string'||v.verified.length>40||!['curated','live'].includes(v.kind as string))return false;try{const u=new URL(v.url);return u.protocol==='https:'&&!u.username&&!u.password}catch{return false}};
/** An approved plan carries its own sources so citations survive into a separate build request. */
export function parseApprovedPlan(value:unknown,context?:PlanContext):ApprovedPlan{
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Invalid approved plan.');
 const v=value as Record<string,unknown>;if(Object.keys(v).some(k=>!['changes','sources'].includes(k)))throw new Error('Invalid approved plan fields.');
 if(!Array.isArray(v.sources)||v.sources.length>PLAN_LIMITS.sources||!v.sources.every(sourceShape))throw new Error('Invalid approved plan sources.');
 const sources=(v.sources as AssistantSource[]).map(({id,title,url,verified,kind})=>({id,title,url,verified,kind}));
 const changes=parsePlannedChanges(v.changes,context);
 // Citations must resolve within the plan itself, with or without a graph context.
 if(changes.some(c=>c.sourceIds.some(id=>!sources.some(s=>s.id===id))))throw new Error('A planned change cites an unknown source.');
 return {changes,sources};
}
/** Selects approved changes from a review result together with only the sources they cite. */
export function approvedPlanFrom(changes:readonly PlannedChange[],sources:readonly AssistantSource[]):ApprovedPlan{
 const cited=new Set(changes.flatMap(c=>c.sourceIds));
 return {changes:changes.map(c=>({...c,nodeIds:[...c.nodeIds],serviceIds:[...c.serviceIds],sourceIds:[...c.sourceIds]})),sources:sources.filter(s=>cited.has(s.id)).map(s=>({...s}))};
}
