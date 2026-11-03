import {createWorkspace,parseWorkspaceValue,type ArchitectureWorkspace} from './architectureWorkspace';
import {validateReviewGraph} from './architectureReview';
import type {RepositoryMutation} from './workspaceDatabase';

export const ARCHIVE_FORMAT='aws-developer-playground-workspace';
export const ARCHIVE_MAX_BYTES=32*1024*1024;
export interface EditorRecoveryEntry {scope:'original'|'draft'|'checkpoint';nodeId?:string;resourceId?:string;workspaceId?:string;baseRevision?:number;graphSchema?:1|2;configurationSchema?:2;baseSignature?:string;fieldPath:string;format:'json'|'yaml'|'text';raw:string}
export interface EditorRecoveryFacet {version:1;entries:EditorRecoveryEntry[]}
export interface WorkspaceArchive {
 format:typeof ARCHIVE_FORMAT;archiveVersion:1;exportedAt:string;
 facets:{workspace:ArchitectureWorkspace;learning?:unknown;editorRecovery?:EditorRecoveryFacet};
 options:{reportsIncluded:boolean;editorDraftsIncluded:boolean};
}
export interface WorkspaceImportPreview {
 archive:WorkspaceArchive;sourceVersion:number;warnings:string[];
 counts:{original:{nodes:number;connections:number;resources:number};draft:{nodes:number;connections:number;resources:number}|null;checkpoint:{nodes:number;connections:number;resources:number}|null};
}
/** The learning lane owns validation and produces writes for the same transaction. */
export interface LearningArchiveAdapter {
 export():Promise<unknown>;
 validate(value:unknown):void;
 prepareImport(value:unknown):Promise<RepositoryMutation[]>;
 /** UI refresh only, after the architecture + learning transaction has committed. */
 onImported?():void;
}
const record=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
function safeArchive(value:unknown,depth=0):void {
 if(depth>32)throw new Error('Backup exceeds the app nesting limit (32).');
 if(typeof value==='number'&&!Number.isFinite(value))throw new Error('Backup contains a non-finite number.');
 if(!value||typeof value!=='object')return;
 if(Array.isArray(value)){if(value.length>10000)throw new Error('Backup array exceeds the app limit (10,000).');for(const item of value)safeArchive(item,depth+1);return;}
 if(Object.getPrototypeOf(value)!==Object.prototype&&Object.getPrototypeOf(value)!==null)throw new Error('Backup must contain plain JSON records.');
 for(const [key,item] of Object.entries(value)){if(['__proto__','prototype','constructor'].includes(key))throw new Error('Backup contains an unsafe property.');safeArchive(item,depth+1);}
}
export function validateEditorRecovery(value:unknown):asserts value is EditorRecoveryFacet {
 if(!record(value)||value.version!==1||!Array.isArray(value.entries)||value.entries.length>100||Object.keys(value).some(k=>!['version','entries'].includes(k)))throw new Error('Invalid editor recovery facet.');
 for(const e of value.entries){if(!record(e)||!['original','draft','checkpoint'].includes(String(e.scope))||!['json','yaml','text'].includes(String(e.format))||typeof e.raw!=='string'||e.raw.length>ARCHIVE_MAX_BYTES||typeof e.fieldPath!=='string'||e.fieldPath.length>512||e.nodeId!==undefined&&(typeof e.nodeId!=='string'||e.nodeId.length>128)||Object.keys(e).some(k=>!['scope','nodeId','resourceId','workspaceId','baseRevision','graphSchema','configurationSchema','baseSignature','fieldPath','format','raw'].includes(k)))throw new Error('Invalid editor recovery entry.');for(const key of ['resourceId','workspaceId','baseSignature'])if(e[key]!==undefined&&(typeof e[key]!=='string'||(e[key] as string).length>512))throw new Error('Invalid editor recovery binding.');if(e.baseRevision!==undefined&&(!Number.isSafeInteger(e.baseRevision)||Number(e.baseRevision)<0)||e.graphSchema!==undefined&&![1,2].includes(e.graphSchema as number)||e.configurationSchema!==undefined&&e.configurationSchema!==2)throw new Error('Invalid editor recovery schema or revision.');}
}
function portableWorkspace(input:ArchitectureWorkspace,reportsIncluded:boolean):ArchitectureWorkspace {
 const w=parseWorkspaceValue(input);
 // Explicit allowlist prevents unrelated browser settings/authentication from entering a backup.
 return structuredClone({version:3,original:w.original,draft:w.draft,draftBase:w.draftBase,purpose:w.purpose,priority:w.priority,protectedNodeIds:w.protectedNodeIds,review:reportsIncluded?w.review:null,proposal:reportsIncluded?w.proposal:null,...(w.checkpoint?{checkpoint:w.checkpoint}:{}),...(w.lastAttempt?{lastAttempt:w.lastAttempt}:{})});
}
export function createWorkspaceArchive(workspace:ArchitectureWorkspace,options:{reportsIncluded?:boolean;learning?:unknown;editorRecovery?:EditorRecoveryFacet}={}):WorkspaceArchive {
 const reportsIncluded=options.reportsIncluded??false;if(options.editorRecovery)validateEditorRecovery(options.editorRecovery);
 const archive:WorkspaceArchive={format:ARCHIVE_FORMAT,archiveVersion:1,exportedAt:new Date().toISOString(),facets:{workspace:portableWorkspace(workspace,reportsIncluded),...(options.learning!==undefined?{learning:structuredClone(options.learning)}:{}),...(options.editorRecovery?{editorRecovery:structuredClone(options.editorRecovery)}:{})},options:{reportsIncluded,editorDraftsIncluded:!!options.editorRecovery?.entries.length}};
 safeArchive(archive);return archive;
}
export function serializeWorkspaceArchive(archive:WorkspaceArchive){const text=JSON.stringify(archive,null,2);if(new TextEncoder().encode(text).byteLength>ARCHIVE_MAX_BYTES)throw new Error('Backup exceeds the 32 MiB app limit. Try excluding saved AI reports. No data was removed.');return text;}
export function prepareWorkspaceImport(text:string,learning?:LearningArchiveAdapter):WorkspaceImportPreview {
 if(new TextEncoder().encode(text).byteLength>ARCHIVE_MAX_BYTES)throw new Error('Backup exceeds the 32 MiB app import limit. The current workspace was not changed.');
 let input:unknown;try{input=JSON.parse(text);}catch{throw new Error('This file is not valid JSON. The current workspace was not changed.');}safeArchive(input);
 let archive:WorkspaceArchive;let sourceVersion=3;const warnings:string[]=[];
 if(record(input)&&input.format===ARCHIVE_FORMAT){
  if(input.archiveVersion!==1)throw new Error('This backup version is not supported. Keep the original file; no downgrade was attempted.');
  if(Object.keys(input).some(k=>!['format','archiveVersion','exportedAt','facets','options'].includes(k))||!record(input.facets)||Object.keys(input.facets).some(k=>!['workspace','learning','editorRecovery'].includes(k))||typeof input.exportedAt!=='string'||!Number.isFinite(Date.parse(input.exportedAt))||!record(input.options)||typeof input.options.reportsIncluded!=='boolean'||typeof input.options.editorDraftsIncluded!=='boolean')throw new Error('Invalid backup envelope.');
  sourceVersion=Number((input.facets.workspace as {version?:number})?.version);const workspace=parseWorkspaceValue(input.facets.workspace);
  if(input.facets.editorRecovery!==undefined)validateEditorRecovery(input.facets.editorRecovery);
  if(input.facets.learning!==undefined){if(learning)learning.validate(input.facets.learning);else warnings.push('Learning data will be retained with this copy but will not replace your learning progress.');}
  archive={format:ARCHIVE_FORMAT,archiveVersion:1,exportedAt:input.exportedAt,facets:{workspace,...(input.facets.learning!==undefined?{learning:input.facets.learning}:{}),...(input.facets.editorRecovery!==undefined?{editorRecovery:input.facets.editorRecovery as EditorRecoveryFacet}:{})},options:{reportsIncluded:input.options.reportsIncluded,editorDraftsIncluded:input.options.editorDraftsIncluded}};
 }else if(record(input)&&(input.version===2||input.version===3)){
  sourceVersion=input.version;archive=createWorkspaceArchive(parseWorkspaceValue(input),{reportsIncluded:true});warnings.push('Legacy workspace imported by copy; the original file is unchanged.');
 }else if(record(input)&&input.version===1){
  const graph=validateReviewGraph(input,'stored-editable');if(!graph.ok)throw new Error(graph.error);sourceVersion=1;archive=createWorkspaceArchive(createWorkspace(graph.graph));warnings.push('Legacy graph has no separate proposal or learning history.');
 }else throw new Error('Unknown workspace format or version. The current workspace was not changed.');
 const workspace=archive.facets.workspace;
 if(workspace.review||workspace.proposal)warnings.push('Saved AI reports are historical evidence. Importing does not revalidate them against AWS.');
 if(workspace.checkpoint)warnings.push('The unfinished AI checkpoint is retained; importing does not resume or complete an AI request.');
 if(archive.facets.editorRecovery?.entries.length)warnings.push('Editor recovery text is retained separately. It is never applied to saved configuration automatically.');
 if(sourceVersion!==3)warnings.push('Configuration migration may make old reviews or checkpoints stale. No review fingerprint is rewritten.');
 const count=(g:ArchitectureWorkspace['original'])=>({nodes:g.nodes.length,connections:g.edges.length,resources:g.network?.resources.length??0});
 return {archive,sourceVersion,warnings,counts:{original:count(workspace.original),draft:workspace.draft?count(workspace.draft):null,checkpoint:workspace.checkpoint?count(workspace.checkpoint.draft):null}};
}
