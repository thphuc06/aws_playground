import {legacyGraphKey,previousWorkspaceKey,workspaceKey,readWorkspace,parseWorkspaceValue,type ArchitectureWorkspace} from './architectureWorkspace';
import {createWorkspaceArchive,validateEditorRecovery,type WorkspaceArchive,type WorkspaceImportPreview} from './workspaceArchive';
import type {LocalRepository,RepositoryMutation,RepositoryRecord} from './workspaceDatabase';

export const ACTIVE_WORKSPACE_KEY='workspace-active';
export interface SavedWorkspace {id:string;name:string;workspace:ArchitectureWorkspace;retainedFacets?:Pick<WorkspaceArchive['facets'],'learning'|'editorRecovery'>;source?:'legacy'|'import'|'copy'}
export interface WorkspaceSession {record:RepositoryRecord<SavedWorkspace>;pointerRevision:number}
export interface RecoveryPayload {label:string;raw:string}
export type WorkspaceRepositoryLoad={kind:'ready';session:WorkspaceSession}|{kind:'recovery';error:string;payloads:RecoveryPayload[]};
const id=()=>globalThis.crypto.randomUUID();
const keyFor=(workspaceId:string)=>'workspace:'+workspaceId;
export function legacyRecoveryPayloads(storage:Pick<Storage,'getItem'>):RecoveryPayload[]{
 const payloads:RecoveryPayload[]=[];for(const key of [workspaceKey,previousWorkspaceKey,legacyGraphKey]){try{const raw=storage.getItem(key);if(raw!==null)payloads.push({label:key,raw});}catch{/* A blocked key has no readable bytes to export. */}}return payloads;
}
function checkSaved(record:RepositoryRecord<SavedWorkspace>):RepositoryRecord<SavedWorkspace>{
 if(!record.value||typeof record.value.id!=='string'||record.key!==keyFor(record.value.id)||typeof record.value.name!=='string'||!record.value.name.trim()||record.value.name.length>120)throw new Error('Saved workspace metadata cannot be read safely.');
 if(record.value.retainedFacets?.editorRecovery!==undefined)validateEditorRecovery(record.value.retainedFacets.editorRecovery);
 return {...record,value:{...record.value,workspace:parseWorkspaceValue(record.value.workspace)}};
}
export async function loadWorkspaceRepository(repository:LocalRepository,storage:Pick<Storage,'getItem'|'setItem'>):Promise<WorkspaceRepositoryLoad>{
 const payloads=legacyRecoveryPayloads(storage);
 try{
  const active=await repository.read<{id:string}>(ACTIVE_WORKSPACE_KEY);
  if(active){
   payloads.unshift({label:ACTIVE_WORKSPACE_KEY,raw:JSON.stringify(active.value)});
   if(typeof active.value?.id!=='string')throw new Error('The active workspace pointer is invalid.');
   const stored=await repository.read<SavedWorkspace>(keyFor(active.value.id));
   if(!stored)throw new Error('The active workspace record is missing. Previous records have not been deleted.');
   payloads.unshift({label:stored.key,raw:JSON.stringify(stored.value)});
   return {kind:'ready',session:{record:checkSaved(stored),pointerRevision:active.revision}};
  }
  const workspace=readWorkspace(storage),workspaceId=id(),value:SavedWorkspace={id:workspaceId,name:'My architecture',workspace,source:'legacy'};
  // Pointer + initial copy commit together; legacy bytes are never overwritten.
  const written=await repository.commit([{key:keyFor(workspaceId),value,expectedRevision:null},{key:ACTIVE_WORKSPACE_KEY,value:{id:workspaceId},expectedRevision:null}]);
  return {kind:'ready',session:{record:written.find(r=>r.key===keyFor(workspaceId)) as RepositoryRecord<SavedWorkspace>,pointerRevision:written.find(r=>r.key===ACTIVE_WORKSPACE_KEY)!.revision}};
 }catch(error){return {kind:'recovery',error:error instanceof Error?error.message:'Browser storage could not be read.',payloads};}
}
export async function saveWorkspaceSession(repository:LocalRepository,session:WorkspaceSession,workspace:ArchitectureWorkspace):Promise<WorkspaceSession>{
 const value={...session.record.value,workspace:parseWorkspaceValue(workspace)};
 const written=await repository.commit([{key:session.record.key,value,expectedRevision:session.record.revision},{key:ACTIVE_WORKSPACE_KEY,value:{id:value.id},expectedRevision:session.pointerRevision}]);
 return {record:written.find(r=>r.key===session.record.key) as RepositoryRecord<SavedWorkspace>,pointerRevision:written.find(r=>r.key===ACTIVE_WORKSPACE_KEY)!.revision};
}
export async function importWorkspaceCopy(repository:LocalRepository,preview:WorkspaceImportPreview,name:string,additionalMutations:RepositoryMutation[]=[]):Promise<WorkspaceSession>{
 if(additionalMutations.some(m=>m.key===ACTIVE_WORKSPACE_KEY||m.key.startsWith('workspace:')))throw new Error('An optional facet cannot overwrite architecture records.');
 const active=await repository.read<{id:string}>(ACTIVE_WORKSPACE_KEY),workspaceId=id();
 const value:SavedWorkspace={id:workspaceId,name:name.trim().slice(0,120)||'Imported workspace',workspace:parseWorkspaceValue(preview.archive.facets.workspace),source:'import',retainedFacets:{...(preview.archive.facets.learning!==undefined?{learning:preview.archive.facets.learning}:{}),...(preview.archive.facets.editorRecovery?{editorRecovery:preview.archive.facets.editorRecovery}:{})}};
 const written=await repository.commit([{key:keyFor(workspaceId),value,expectedRevision:null},...(active?[{key:'workspace-pointer-recovery:'+workspaceId,value:active,expectedRevision:null}]:[]),{key:ACTIVE_WORKSPACE_KEY,value:{id:workspaceId},expectedRevision:active?.revision??null},...additionalMutations]);
 return {record:written.find(r=>r.key===keyFor(workspaceId)) as RepositoryRecord<SavedWorkspace>,pointerRevision:written.find(r=>r.key===ACTIVE_WORKSPACE_KEY)!.revision};
}
export async function listWorkspaceCopies(repository:LocalRepository){return (await repository.list('workspace:')).map(record=>{try{return checkSaved(record as RepositoryRecord<SavedWorkspace>);}catch{return null;}}).filter((record):record is RepositoryRecord<SavedWorkspace>=>!!record).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));}
export async function activateWorkspaceCopy(repository:LocalRepository,workspaceId:string):Promise<WorkspaceSession>{
 const record=await repository.read<SavedWorkspace>(keyFor(workspaceId));if(!record)throw new Error('Workspace copy no longer exists.');
 const checked=checkSaved(record),active=await repository.read(ACTIVE_WORKSPACE_KEY),written=await repository.commit([{key:ACTIVE_WORKSPACE_KEY,value:{id:workspaceId},expectedRevision:active?.revision??null}]);
 return {record:checked,pointerRevision:written[0].revision};
}
export async function copyMemoryWorkspace(repository:LocalRepository,workspace:ArchitectureWorkspace,name:string,facets:SavedWorkspace['retainedFacets']={}):Promise<WorkspaceSession>{
 const archive=createWorkspaceArchive(workspace,{reportsIncluded:true,...facets});
 return importWorkspaceCopy(repository,{archive,sourceVersion:3,warnings:[],counts:{original:{nodes:workspace.original.nodes.length,connections:workspace.original.edges.length,resources:workspace.original.network?.resources.length??0},draft:null,checkpoint:null}},name);
}
