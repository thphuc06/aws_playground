import {createContext,useContext,useEffect,useId,useMemo,useRef,type ReactNode} from 'react';
import {fingerprintGraph,type Graph} from './architectureReview';
import type {ArchitectureWorkspace} from './architectureWorkspace';
import type {EditorRecoveryEntry,EditorRecoveryFacet} from './workspaceArchive';

type Scope=EditorRecoveryEntry['scope'];
export interface RecoveryBinding {workspaceId:string;baseRevision:number;graphSchema:1|2;configurationSchema:2;baseSignature:string}
type Sink=(key:string,entry:EditorRecoveryEntry|null)=>void;
const RecoveryContext=createContext<{scope:Scope;binding:RecoveryBinding;publish:Sink}|null>(null);
// A compact change marker, not an authentication or integrity guarantee.
export function recoverySignature(graph:Graph):string {
 let hash=2166136261;for(const char of fingerprintGraph(graph))hash=Math.imul(hash^char.charCodeAt(0),16777619);
 return 'graph-'+(hash>>>0).toString(16);
}
export function EditorRecoveryProvider({scope,workspaceId,baseRevision,graph,publish,children}:{scope:Scope;workspaceId:string;baseRevision:number;graph:Graph;publish:Sink;children:ReactNode}){
 const signature=useMemo(()=>recoverySignature(graph),[graph]);
 const value=useMemo(()=>({scope,publish,binding:{workspaceId,baseRevision,graphSchema:graph.version,configurationSchema:2 as const,baseSignature:signature}}),[scope,publish,workspaceId,baseRevision,graph.version,signature]);
 return <RecoveryContext.Provider value={value}>{children}</RecoveryContext.Provider>;
}
/** Snapshot only. No recovery reader is exposed to live editors, so imported text cannot replay. */
export function useEditorRecovery(dirty:boolean,value:unknown,target:{fieldPath:string;nodeId?:string;resourceId?:string}){
 const context=useContext(RecoveryContext),key=useId(),binding=useRef<RecoveryBinding|null>(null);
 const identity=useRef('');
 const raw=dirty?JSON.stringify(value):'',{fieldPath,nodeId,resourceId}=target;
 const publish=context?.publish,scope=context?.scope,currentBinding=context?.binding;
 useEffect(()=>{
  if(!publish||!scope||!currentBinding)return;
  if(!dirty){binding.current=null;publish(key,null);return;}
  const targetKey=JSON.stringify([scope,currentBinding.workspaceId,fieldPath,nodeId,resourceId]);
  if(identity.current!==targetKey){identity.current=targetKey;binding.current=null;}
  binding.current??=currentBinding;
  publish(key,{...binding.current,scope,fieldPath,...(nodeId?{nodeId}:{}),...(resourceId?{resourceId}:{}),format:'json',raw});
 },[dirty,raw,fieldPath,nodeId,resourceId,key,publish,scope,currentBinding]);
 useEffect(()=>()=>{publish?.(key,null)},[publish,key]);
}
export function combineEditorRecovery(...facets:(EditorRecoveryFacet|undefined)[]):EditorRecoveryFacet|undefined {
 const entries=facets.flatMap(f=>f?.entries??[]);return entries.length?{version:1,entries}:undefined;
}
export function recoveryEntryContext(entry:EditorRecoveryEntry,workspace:ArchitectureWorkspace,workspaceId?:string):string {
 const graph=entry.scope==='original'?workspace.original:entry.scope==='draft'?workspace.draft:workspace.checkpoint?.draft;
 if(!graph)return 'Orphaned: this diagram scope is unavailable.';
 if(entry.nodeId&&!graph.nodes.some(n=>n.id===entry.nodeId))return 'Orphaned: the service no longer exists in this scope.';
 if(entry.resourceId&&!graph.network?.registry?.resources.some(r=>r.id===entry.resourceId)&&!graph.network?.resources.some(r=>r.id===entry.resourceId)&&!graph.network?.frames.some(f=>f.id===entry.resourceId)&&!graph.securityLibrary?.policies.some(p=>p.id===entry.resourceId)&&!graph.securityLibrary?.roles.some(r=>r.id===entry.resourceId))return 'Orphaned or new resource: no saved resource has this identity.';
 if(!entry.workspaceId||!entry.baseSignature)return 'Legacy recovery: workspace and revision binding are unavailable.';
 if(workspaceId&&entry.workspaceId!==workspaceId)return 'Historical recovery from another workspace copy; inspect before manually copying text.';
 if(entry.graphSchema!==graph.version||entry.baseSignature!==recoverySignature(graph))return 'Stale: the saved diagram changed since editing began.';
 return 'Matches the captured diagram snapshot. Text still requires manual review.';
}
