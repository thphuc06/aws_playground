import {useState,type ChangeEvent} from 'react';
import type {ArchitectureWorkspace} from './architectureWorkspace';
import {ARCHIVE_MAX_BYTES,createWorkspaceArchive,prepareWorkspaceImport,serializeWorkspaceArchive,type EditorRecoveryFacet,type LearningArchiveAdapter,type WorkspaceImportPreview} from './workspaceArchive';
import type {RepositoryMutation} from './workspaceDatabase';
import './workspaceTransfer.css';

export function downloadWorkspaceText(text:string,name:string){
 const url=URL.createObjectURL(new Blob([text],{type:'application/json;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function readBackupFile(file:File):Promise<string>{
 if(typeof file.text==='function')return file.text();
 return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(reader.error??new Error('Backup file could not be read.'));reader.readAsText(file);});
}
interface Props {
 workspace:ArchitectureWorkspace;busy:boolean;dirty:boolean;storageReady:boolean;loading?:boolean;
 learning?:LearningArchiveAdapter;editorRecovery?:EditorRecoveryFacet;
 retainedLearning?:unknown;
 onImport:(preview:WorkspaceImportPreview,name:string,mutations:RepositoryMutation[])=>Promise<void>;
 listCopies?:()=>Promise<{id:string;name:string;updatedAt:string}[]>;
 onActivate?:(id:string)=>Promise<void>;
}
export default function WorkspaceTransfer({workspace,busy,dirty,storageReady,loading=false,learning,editorRecovery,retainedLearning,onImport,listCopies,onActivate}:Props){
 const [reports,setReports]=useState(false),[includeLearning,setIncludeLearning]=useState(false),[applyLearning,setApplyLearning]=useState(false),[preview,setPreview]=useState<WorkspaceImportPreview|null>(null),[name,setName]=useState('Imported workspace'),[notice,setNotice]=useState(''),[working,setWorking]=useState(false),[copies,setCopies]=useState<{id:string;name:string;updatedAt:string}[]>([]);
 const blocked=busy||dirty||working||!storageReady;
 const exportData=async()=>{setWorking(true);try{const learningValue=includeLearning?(learning?await learning.export():retainedLearning):undefined;const archive=createWorkspaceArchive(workspace,{reportsIncluded:reports,...(learningValue!==undefined?{learning:learningValue}:{}),...(editorRecovery?{editorRecovery}:{})});downloadWorkspaceText(serializeWorkspaceArchive(archive),'aws-playground-'+new Date().toISOString().slice(0,10)+'.json');setNotice(dirty?'Saved diagram exported. Unsaved editor changes are excluded unless listed in the separate recovery facet.':'Workspace exported. The file stays on your device.');}catch(error){setNotice((error as Error).message);}finally{setWorking(false);}};
 const chooseFile=async(event:ChangeEvent<HTMLInputElement>)=>{const file=event.target.files?.[0];event.target.value='';setPreview(null);setApplyLearning(false);if(!file)return;setWorking(true);try{if(file.size>ARCHIVE_MAX_BYTES)throw new Error('Backup exceeds the 32 MiB app import limit.');const text=await readBackupFile(file);const next=prepareWorkspaceImport(text,learning);setPreview(next);setName(file.name.replace(/\.json$/i,'').slice(0,120)||'Imported workspace');setNotice('Preview only. Nothing has been imported.');}catch(error){setNotice((error as Error).message);}finally{setWorking(false);}};
 const apply=async()=>{if(!preview||blocked)return;setWorking(true);try{const mutations=applyLearning&&learning&&preview.archive.facets.learning!==undefined?await learning.prepareImport(preview.archive.facets.learning):[];await onImport(preview,name,mutations);if(mutations.length)learning?.onImported?.();setPreview(null);setNotice('Imported as a new workspace. Previous workspace copies are retained.');}catch(error){setNotice((error as Error).message);}finally{setWorking(false);}};
 return <details className="workspace-transfer"><summary>Workspace backup &amp; recovery</summary><div className="workspace-transfer-body">
  <p>Back up your architecture, independent proposal, IAM library and shared resources. This is a playground backup, not a deployable AWS template.</p>
  <p>Export contains your saved diagram state, including changes still in this tab after a storage failure. It excludes backend credentials and browser authentication. Review any sensitive text you entered before sharing the file.</p>
  {dirty&&<p className="workspace-warning" role="status">An inspector has unsaved edits. Export saves the committed diagram; those editor changes are not included unless captured as recovery text. Save or cancel the editor before importing or switching copies.</p>}
  {busy&&<p className="workspace-warning">An AI request is active. You may export its current snapshot, but import and switching stay disabled until the request finishes or cancellation completes.</p>}
  <label><input type="checkbox" checked={reports} onChange={e=>setReports(e.target.checked)}/> Include saved AI reports</label>
  {learning&&<label><input type="checkbox" checked={includeLearning} onChange={e=>setIncludeLearning(e.target.checked)}/> Include learning progress</label>}
  {retainedLearning!==undefined&&!learning&&<p>Learning data retained in this workspace backup is included unchanged; it has not replaced current progress.</p>}
  {editorRecovery?.entries.length? <p>{editorRecovery.entries.length} editor recovery text entries will be included separately.</p>:null}
  <button disabled={working||loading} onClick={()=>void exportData()}>Export {dirty?'saved diagram':'workspace'} JSON</button>
  <label className="workspace-file">Preview a backup<input aria-label="Choose workspace backup" type="file" accept=".json,application/json" disabled={blocked} onChange={e=>void chooseFile(e)}/></label>
  {!storageReady&&<p>Import requires available transactional browser storage. You can still export the current diagram.</p>}
  {preview&&<section className="workspace-import-preview" aria-label="Workspace import preview"><h3>Review before importing</h3><dl>{Object.entries(preview.counts).map(([scope,count])=><div key={scope}><dt>{scope}</dt><dd>{count?`${count.nodes} services · ${count.connections} connections · ${count.resources} shared resources`:'Not included'}</dd></div>)}</dl><p>Source workspace version: {preview.sourceVersion}. The existing workspace will be kept as a separate copy.</p>{preview.warnings.length>0&&<ul>{preview.warnings.map(w=><li key={w}>{w}</li>)}</ul>}<label>Name for this copy<input maxLength={120} value={name} onChange={e=>setName(e.target.value)}/></label>{learning&&preview.archive.facets.learning!==undefined&&<label><input type="checkbox" checked={applyLearning} onChange={e=>setApplyLearning(e.target.checked)}/> Also import learning progress, with its recovery backup, in the same transaction</label>}<button disabled={blocked||!name.trim()} onClick={()=>void apply()}>Import as new workspace</button><button disabled={working} onClick={()=>{setPreview(null);setNotice('Import canceled. Current workspace preserved.');}}>Cancel import</button></section>}
  {listCopies&&onActivate&&<section><button disabled={blocked} onClick={async()=>{try{setCopies(await listCopies());}catch(e){setNotice((e as Error).message);}}}>Show retained workspace copies</button>{copies.length>0&&<ul className="workspace-copy-list">{copies.map(copy=><li key={copy.id}><span>{copy.name}<small>{new Date(copy.updatedAt).toLocaleString()}</small></span><button disabled={blocked} onClick={async()=>{setWorking(true);try{await onActivate(copy.id);setPreview(null);setNotice('Workspace copy opened. Other copies are retained.');}catch(e){setNotice((e as Error).message);}finally{setWorking(false);}}}>Open {copy.name}</button></li>)}</ul>}</section>}
  <p role="status" aria-live="polite">{notice}</p>
 </div></details>;
}
