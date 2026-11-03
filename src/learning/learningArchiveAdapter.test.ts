import 'fake-indexeddb/auto';
import {describe,it,expect} from 'vitest';
import {openLocalRepository} from '../workspaceDatabase';
import {createLearningArchiveAdapter} from './learningArchiveAdapter';
import {emptyLearningProgress} from './questionTypes';
import {LEARNING_RECORD_KEY} from './learningRepository';

describe('architecture and learning archive integration',()=>{
 it('prepares a merge without changing stored history until the whole transaction commits',async()=>{
  const database='archive-learning-'+crypto.randomUUID(),factory=()=>openLocalRepository(indexedDB,database),repository=await factory();
  const current={...emptyLearningProgress(),read:['dev-lambda']};
  await repository.commit([{key:LEARNING_RECORD_KEY,value:current,expectedRevision:null}]);
  const adapter=createLearningArchiveAdapter(factory,{getItem:()=>null});
  const candidate={...emptyLearningProgress(),bookmarks:['security-iam-sts']};
  const mutations=await adapter.prepareImport(candidate);
  expect((await repository.read<typeof current>(LEARNING_RECORD_KEY))?.value.bookmarks).toEqual([]);
  await repository.commit([{key:'workspace:example',value:{fixture:true},expectedRevision:null},...mutations]);
  const restored=await adapter.export() as typeof current;
  expect(restored.read).toEqual(['dev-lambda']);expect(restored.bookmarks).toEqual(['security-iam-sts']);
  expect((await repository.list('learning-recovery:'))).toHaveLength(1);repository.close();
 });
 it('rejects malformed learning data before preparing any workspace transaction',async()=>{
  const adapter=createLearningArchiveAdapter(async()=>{throw new Error('Database should not be opened');},{getItem:()=>null});
  expect(()=>adapter.validate({schemaVersion:99})).toThrow('Unsupported learning backup');
 });
});
