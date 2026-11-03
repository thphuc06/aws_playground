import {IDBFactory,IDBObjectStore} from 'fake-indexeddb';
import {describe,it,expect,vi} from 'vitest';
import {openLocalRepository,RepositoryConflictError} from '../../workspaceDatabase';
import {getLabDefinition} from './definitions';
import {createLabSession,runLabAttempt} from './labEngine';
import {loadLabSession,startLabSession,saveLabSession,saveNewLabSession,exportLabSession,parseLabArchive,importLabSession,LabRecoveryError,LAB_ARCHIVE_MAX_BYTES} from './labRepository';
describe('isolated lab persistence',()=>{
 it('roundtrips sessions without touching personal architecture, and imports as a new copy',async()=>{
  const factory=new IDBFactory(),db=await openLocalRepository(factory,'lab-roundtrip');try{await db.commit([{key:'workspace:personal',value:{secretFixture:'preserve'},expectedRevision:null}]);const first=await startLabSession(db,getLabDefinition('sqs-batch')!),changed=runLabAttempt({...first.record.value,values:{...first.record.value.values,visibilitySeconds:60}}),saved=await saveLabSession(db,first,changed);const raw=exportLabSession(saved.record.value);expect(parseLabArchive(raw)).toEqual(saved.record.value);const imported=await importLabSession(db,raw,'sqs-batch');expect(imported.record.value.id).not.toBe(first.record.value.id);expect(imported.record.value.values).toEqual(changed.values);expect((await db.read('workspace:personal'))?.value).toEqual({secretFixture:'preserve'});expect(await db.read('workspace-active')).toBeNull();expect(await db.read(first.record.key)).not.toBeNull();expect((await loadLabSession(db,'sqs-batch'))?.record.value.id).toBe(imported.record.value.id)}finally{db.close()}
 });
 it('detects concurrent edits instead of overwriting another tab',async()=>{
  const factory=new IDBFactory(),a=await openLocalRepository(factory,'lab-concurrent'),b=await openLocalRepository(factory,'lab-concurrent');try{const first=await startLabSession(a,getLabDefinition('api-authorization')!),stale=(await loadLabSession(b,'api-authorization'))!;await saveLabSession(a,first,{...first.record.value,values:{...first.record.value.values,timeoutSeconds:60}});await expect(saveLabSession(b,stale,{...stale.record.value,values:{...stale.record.value.values,timeoutSeconds:30}})).rejects.toBeInstanceOf(RepositoryConflictError);expect((await loadLabSession(b,'api-authorization'))?.record.value.values.timeoutSeconds).toBe(60)}finally{a.close();b.close()}
 });
 it('does not activate a partial new copy when storage fails',async()=>{
  const db=await openLocalRepository(new IDBFactory(),'lab-atomic');const original=await startLabSession(db,getLabDefinition('api-authorization')!);const put=IDBObjectStore.prototype.put;const fault=vi.spyOn(IDBObjectStore.prototype,'put').mockImplementation(function(this:IDBObjectStore,value:any,key?:IDBValidKey){if(value.key==='lab-active:api-authorization')throw new DOMException('Quota fixture','QuotaExceededError');return put.call(this,value,key)});
  try{await expect(saveNewLabSession(db,original.record.value)).rejects.toMatchObject({name:'QuotaExceededError'});expect((await db.list('lab-session:'))).toHaveLength(1);expect((await loadLabSession(db,'api-authorization'))?.record.key).toBe(original.record.key)}finally{fault.mockRestore();db.close()}
 });
 it('preserves raw corrupt records for recovery and rejects unknown definitions and oversized imports',async()=>{
  const db=await openLocalRepository(new IDBFactory(),'lab-corrupt');try{await db.commit([{key:'lab-active:sqs-batch',value:{id:'broken'},expectedRevision:null},{key:'lab-session:broken',value:{schemaVersion:77},expectedRevision:null}]);try{await loadLabSession(db,'sqs-batch');expect.fail('expected recovery')}catch(error){expect(error).toBeInstanceOf(LabRecoveryError);expect((error as LabRecoveryError).raw).toContain('77')};expect((await db.read('lab-session:broken'))?.value).toEqual({schemaVersion:77});const session=createLabSession(getLabDefinition('sqs-batch')!);expect(()=>parseLabArchive(JSON.stringify({format:'aws-playground-lab',archiveVersion:1,session:{...session,definitionVersion:2}}))).toThrow('version');expect(()=>parseLabArchive(' '.repeat(LAB_ARCHIVE_MAX_BYTES+1))).toThrow('8 MiB')}finally{db.close()}
 });
 it('recomputes imported results and refuses substituted starting evidence',()=>{
  const definition=getLabDefinition('sqs-batch')!,session=runLabAttempt(createLabSession(definition)),archive=JSON.parse(exportLabSession(session));archive.session.attempts[0].result={status:'objectives-met',checks:[]};expect(parseLabArchive(JSON.stringify(archive)).attempts[0].result.status).toBe('needs-repair');archive.session.startingFixture.artifacts[0].body='changed';expect(()=>parseLabArchive(JSON.stringify(archive))).toThrow('starting fixture');
 });
});
