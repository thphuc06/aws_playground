import type {LocalRepository,RepositoryMutation,RepositoryRecord} from '../workspaceDatabase';
import {validateLearningProgress,mergeLearningProgress} from './learningBackup';
import {LEGACY_PROGRESS_KEY,migrateLegacyProgress} from './progressMigration';
import type {LearningProgress} from './questionTypes';
export const LEARNING_RECORD_KEY='learning-v2';
export type LearningRecord=RepositoryRecord<LearningProgress>;
export async function loadLearningProgress(repository:LocalRepository,legacy:Pick<Storage,'getItem'>):Promise<LearningRecord>{
 const existing=await repository.read(LEARNING_RECORD_KEY);
 if(existing){const result=validateLearningProgress(existing.value);if(!result.ok)throw new Error(result.error);return {...existing,value:result.value};}
 const progress=migrateLegacyProgress(legacy.getItem(LEGACY_PROGRESS_KEY));
 const records=await repository.commit([{key:LEARNING_RECORD_KEY,value:progress,expectedRevision:null}]);return records[0] as LearningRecord;
}
export async function saveLearningProgress(repository:LocalRepository,current:LearningRecord,progress:LearningProgress):Promise<LearningRecord>{
 const checked=validateLearningProgress(progress);if(!checked.ok)throw new Error(checked.error);
 return (await repository.commit([{key:LEARNING_RECORD_KEY,value:checked.value,expectedRevision:current.revision}]))[0] as LearningRecord;
}
export function prepareLearningImport(current:LearningRecord|null,incoming:unknown,mode:'merge'|'replace',recoveryId:string):{progress:LearningProgress;mutations:RepositoryMutation[]}{
 const checked=validateLearningProgress(incoming);if(!checked.ok)throw new Error(checked.error);
 const progress=mode==='merge'&&current?mergeLearningProgress(current.value,checked.value):checked.value;
 return {progress,mutations:[...(current?[{key:'learning-recovery:'+recoveryId,value:current.value,expectedRevision:null}]:[]),{key:LEARNING_RECORD_KEY,value:progress,expectedRevision:current?.revision??null}]};
}
