import type {LearningArchiveAdapter} from '../workspaceArchive';
import {openLocalRepository,type LocalRepository} from '../workspaceDatabase';
import {loadLearningProgress,prepareLearningImport,LEARNING_RECORD_KEY,type LearningRecord} from './learningRepository';
import {validateLearningProgress} from './learningBackup';

/** Imports are prepared here and committed together with the workspace by its repository. */
export function createLearningArchiveAdapter(factory:()=>Promise<LocalRepository>=()=>openLocalRepository(),legacy:Pick<Storage,'getItem'>=localStorage):LearningArchiveAdapter{
 return {
  async export(){const repository=await factory();try{return (await loadLearningProgress(repository,legacy)).value;}finally{repository.close();}},
  validate(value){const result=validateLearningProgress(value);if(!result.ok)throw new Error(result.error);},
  async prepareImport(value){
   const repository=await factory();
   try{
    const current=await repository.read(LEARNING_RECORD_KEY) as LearningRecord|null;
    // Merge only identical immutable records. A conflicting history is never replaced silently.
    return prepareLearningImport(current,value,'merge',crypto.randomUUID()).mutations;
   }finally{repository.close();}
  },
  onImported(){window.dispatchEvent(new Event('learning-progress-changed'));},
 };
}
