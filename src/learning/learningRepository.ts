import {RepositoryConflictError,type LocalRepository,type RepositoryMutation,type RepositoryRecord} from '../workspaceDatabase';
import {validateLearningProgress,mergeLearningProgress} from './learningBackup';
import {LEGACY_PROGRESS_KEY,migrateLegacyProgress} from './progressMigration';
import type {LearningProgress} from './questionTypes';
export const LEARNING_RECORD_KEY='learning-v2';
export const LEARNING_PROGRESS_CHANGED_EVENT='learning-progress-changed';
export function notifyLearningProgressChanged(){if(typeof window!=='undefined')window.dispatchEvent(new window.Event(LEARNING_PROGRESS_CHANGED_EVENT));}
export type LearningRecord=RepositoryRecord<LearningProgress>;
export async function loadLearningProgress(repository:LocalRepository,legacy:Pick<Storage,'getItem'>):Promise<LearningRecord>{
 const existing=await repository.read(LEARNING_RECORD_KEY);
 if(existing){const result=validateLearningProgress(existing.value);if(!result.ok)throw new Error(result.error);return {...existing,value:result.value};}
 const progress=migrateLegacyProgress(legacy.getItem(LEGACY_PROGRESS_KEY));
 try{const records=await repository.commit([{key:LEARNING_RECORD_KEY,value:progress,expectedRevision:null}]);return records[0] as LearningRecord;}
 catch(error){
  if(!(error instanceof RepositoryConflictError))throw error;
  // Another mounted reader/tab may have migrated v1 between our read and commit.
  const winner=await repository.read(LEARNING_RECORD_KEY);if(!winner)throw error;
  const checked=validateLearningProgress(winner.value);if(!checked.ok)throw new Error(checked.error);
  return {...winner,value:checked.value};
 }
}
export async function saveLearningProgress(repository:LocalRepository,current:LearningRecord,progress:LearningProgress):Promise<LearningRecord>{
 const checked=validateLearningProgress(progress);if(!checked.ok)throw new Error(checked.error);
 const saved=(await repository.commit([{key:LEARNING_RECORD_KEY,value:checked.value,expectedRevision:current.revision}]))[0] as LearningRecord;
 notifyLearningProgressChanged();return saved;
}
export function prepareLearningImport(current:LearningRecord|null,incoming:unknown,mode:'merge'|'replace',recoveryId:string):{progress:LearningProgress;mutations:RepositoryMutation[]}{
 const checked=validateLearningProgress(incoming);if(!checked.ok)throw new Error(checked.error);
 const progress=mode==='merge'&&current?mergeLearningProgress(current.value,checked.value):checked.value;
 return {progress,mutations:[...(current?[{key:'learning-recovery:'+recoveryId,value:current.value,expectedRevision:null}]:[]),{key:LEARNING_RECORD_KEY,value:progress,expectedRevision:current?.revision??null}]};
}
