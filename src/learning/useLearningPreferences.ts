import {useEffect,useRef,useState,type Dispatch,type SetStateAction} from 'react';
import {openLocalRepository,RepositoryConflictError,type LocalRepository} from '../workspaceDatabase';
import {exportLearningBackup,validateLearningProgress} from './learningBackup';
import {LEARNING_PROGRESS_CHANGED_EVENT,LEARNING_RECORD_KEY,loadLearningProgress,saveLearningProgress,type LearningRecord} from './learningRepository';
import {LEGACY_PROGRESS_KEY} from './progressMigration';
import {emptyLearningProgress,type LearningProgress} from './questionTypes';

export interface LearningPreferences {version:1;read:string[];bookmarks:string[];missions:string[];checks:string[]}
type PreferenceKey='read'|'bookmarks'|'missions';
export type PreferenceChange=Record<PreferenceKey,{add:string[];remove:string[]}>;
const keys:PreferenceKey[]=['read','bookmarks','missions'];
export function preferencesFromLearning(progress:LearningProgress):LearningPreferences {
 return {version:1,read:[...progress.read],bookmarks:[...progress.bookmarks],missions:[...progress.missions],checks:progress.legacyAcknowledgements.map(a=>a.legacyKey)};
}
export function preferenceChange(before:LearningPreferences,after:LearningPreferences):PreferenceChange {
 if(!after||after.version!==1||!keys.every(k=>Array.isArray(after[k])&&after[k].every(value=>typeof value==='string')))throw new Error('Reading preferences must contain string lists.');
 return Object.fromEntries(keys.map(key=>[key,{add:[...new Set(after[key].filter(id=>!before[key].includes(id)))],remove:before[key].filter(id=>!after[key].includes(id))}])) as PreferenceChange;
}
/** Apply only the intended reading changes to the newest record; attempts remain untouched. */
export function applyPreferenceChange(progress:LearningProgress,change:PreferenceChange):LearningProgress {
 const next={...progress};
 for(const key of keys)next[key]=[...new Set([...progress[key].filter(id=>!change[key].remove.includes(id)),...change[key].add])];
 return next;
}
const errorText=(error:unknown)=>error&&typeof error==='object'&&'message' in error&&typeof error.message==='string'?error.message:'Learning preferences could not be saved. Export recovery data before closing this page.';

export interface LearningPreferencesController {
 progress:LearningPreferences;
 /** Only read/bookmarks/missions are mutable. checks remains legacy evidence, never new attempts. */
 setProgress:Dispatch<SetStateAction<LearningPreferences>>;
 loading:boolean;
 error:string;
 pending:boolean;
 dirty:boolean;
 retry:()=>Promise<void>;
 refresh:()=>Promise<void>;
 getLearningSnapshot:()=>LearningProgress|null;
 exportRecovery:()=>string;
}
export function useLearningPreferences(options:{repositoryFactory?:()=>Promise<LocalRepository>}={}):LearningPreferencesController {
 const factory=options.repositoryFactory??openLocalRepository;
 const [progress,setView]=useState(()=>preferencesFromLearning(emptyLearningProgress()));
 const [loading,setLoading]=useState(true),[error,setError]=useState(''),[pending,setPending]=useState(false),[dirty,setDirty]=useState(false);
 const repository=useRef<LocalRepository|null>(null),opening=useRef<Promise<LocalRepository>|null>(null),saved=useRef<LearningRecord|null>(null);
 const view=useRef(progress),changes=useRef<PreferenceChange[]>([]),processing=useRef(false),mounted=useRef(false),rawStored=useRef<unknown>(null);

 const getLearningSnapshot=()=>saved.current?changes.current.reduce(applyPreferenceChange,saved.current.value):null;
 const publish=()=>{
  const snapshot=getLearningSnapshot();if(snapshot)view.current=preferencesFromLearning(snapshot);
  if(mounted.current){setView({...view.current});setPending(processing.current);setDirty(processing.current||changes.current.length>0);}
 };
 const accept=(record:LearningRecord)=>{if(!saved.current||record.revision>=saved.current.revision)saved.current=record;publish();};
 const connect=async()=>{
  if(repository.current)return repository.current;
  if(!opening.current)opening.current=factory();
  try{const connection=await opening.current;if(!mounted.current){connection.close();throw new Error('Learning preferences view was closed.');}repository.current=connection;return connection;}finally{opening.current=null;}
 };
 const refresh=async()=>{
  try{
   const repo=await connect();const current=await repo.read(LEARNING_RECORD_KEY);rawStored.current=current?.value??null;
   if(current){const validated=validateLearningProgress(current.value);if(!validated.ok)throw new Error(validated.error);accept({...current,value:validated.value});}
   else if(saved.current)throw new Error('Saved learning progress is missing. Export the current reading changes before recovery.');
   else accept(await loadLearningProgress(repo,localStorage));
   if(mounted.current&&!changes.current.length)setError('');
  }catch(e){if(mounted.current)setError(errorText(e));}
 };
 const processChanges=async()=>{
  if(processing.current||!repository.current||!changes.current.length)return;
  processing.current=true;publish();
  try{
   while(changes.current.length&&mounted.current){
    const change=changes.current[0];let committed=false;
    for(let retry=0;retry<3&&!committed;retry++){
     const record=await repository.current.read(LEARNING_RECORD_KEY);if(!record)throw new Error('Saved learning progress is missing. Retry after recovering it.');
     const checked=validateLearningProgress(record.value);if(!checked.ok)throw new Error(checked.error);
     try{
      const updated=await saveLearningProgress(repository.current,{...record,value:checked.value},applyPreferenceChange(checked.value,change));
      changes.current.shift();accept(updated);committed=true;
     }catch(e){if(!(e instanceof RepositoryConflictError)||retry===2)throw e;}
    }
   }
   if(mounted.current)setError('');
  }catch(e){if(mounted.current)setError(errorText(e));}
  finally{processing.current=false;publish();}
 };
 const setProgress:Dispatch<SetStateAction<LearningPreferences>>=update=>{
  try{
   const next=typeof update==='function'?update(structuredClone(view.current)):update;
   const change=preferenceChange(view.current,next);if(keys.every(key=>!change[key].add.length&&!change[key].remove.length))return;
   changes.current.push(change);
   // Optimistic view is kept even if opening or writing storage fails.
   view.current={...view.current,...Object.fromEntries(keys.map(key=>[key,[...next[key]]]))};
   publish();void processChanges();
  }catch(e){if(mounted.current)setError(errorText(e));}
 };
 const retry=async()=>{await refresh();await processChanges();};
 const exportRecovery=()=>{
  const current=getLearningSnapshot();if(current)return exportLearningBackup(current);
  let legacyRaw:string|null=null;try{legacyRaw=localStorage.getItem(LEGACY_PROGRESS_KEY);}catch{/* Include available in-memory changes if browser storage is blocked. */}
  return JSON.stringify({format:'aws-playground-learning-preferences-recovery',rawStored:rawStored.current,legacyRaw,pendingReadingChanges:changes.current},null,2);
 };
 useEffect(()=>{
  mounted.current=true;let closing=false;
  void (async()=>{await refresh();if(!closing){setLoading(false);await processChanges();}})();
  const changed=()=>void refresh(),warn=(event:BeforeUnloadEvent)=>{if(processing.current||changes.current.length){event.preventDefault();event.returnValue='';}};
  window.addEventListener(LEARNING_PROGRESS_CHANGED_EVENT,changed);window.addEventListener('focus',changed);window.addEventListener('beforeunload',warn);
  return()=>{closing=true;mounted.current=false;repository.current?.close();repository.current=null;window.removeEventListener(LEARNING_PROGRESS_CHANGED_EVENT,changed);window.removeEventListener('focus',changed);window.removeEventListener('beforeunload',warn);};
 },[factory]);
 return {progress,setProgress,loading,error,pending,dirty,retry,refresh,getLearningSnapshot,exportRecovery};
}
export default useLearningPreferences;
