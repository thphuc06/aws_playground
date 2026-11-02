import {IDBFactory,IDBObjectStore} from 'fake-indexeddb';
import {describe,it,expect,vi} from 'vitest';
import {openLocalRepository,RepositoryConflictError} from './workspaceDatabase';

describe('IndexedDB transaction repository',()=>{
 it('persists across independent connections and rejects stale concurrent writes',async()=>{
  const factory=new IDBFactory(),a=await openLocalRepository(factory,'concurrent'),b=await openLocalRepository(factory,'concurrent');
  try{await a.commit([{key:'workspace:a',value:{name:'Original'},expectedRevision:null}]);const stale=await b.read('workspace:a');await a.commit([{key:'workspace:a',value:{name:'First tab'},expectedRevision:1}]);await expect(b.commit([{key:'workspace:a',value:{name:'Second tab'},expectedRevision:stale!.revision}])).rejects.toBeInstanceOf(RepositoryConflictError);expect((await b.read('workspace:a'))?.value).toEqual({name:'First tab'});}finally{a.close();b.close();}
 });
 it('rolls back the whole workspace/learning transaction when any expected revision conflicts',async()=>{
  const db=await openLocalRepository(new IDBFactory(),'atomic-conflict');try{await db.commit([{key:'workspace-active',value:{id:'old'},expectedRevision:null},{key:'learning-v2',value:{attempts:2},expectedRevision:null}]);await expect(db.commit([{key:'workspace:new',value:{name:'Imported'},expectedRevision:null},{key:'workspace-active',value:{id:'new'},expectedRevision:1},{key:'learning-v2',value:{attempts:0},expectedRevision:99}])).rejects.toBeInstanceOf(RepositoryConflictError);expect(await db.read('workspace:new')).toBeNull();expect((await db.read('workspace-active'))?.value).toEqual({id:'old'});expect((await db.read('learning-v2'))?.value).toEqual({attempts:2});}finally{db.close();}
 });
 it('rolls back writes on a data-clone error, preserving the old active pointer',async()=>{
  const db=await openLocalRepository(new IDBFactory(),'clone-error');try{await db.commit([{key:'workspace-active',value:{id:'old'},expectedRevision:null}]);await expect(db.commit([{key:'workspace-active',value:{id:'new'},expectedRevision:1},{key:'bad',value:{fn:()=>{}},expectedRevision:null}])).rejects.toThrow();expect((await db.read('workspace-active'))?.value).toEqual({id:'old'});expect(await db.read('bad')).toBeNull();}finally{db.close();}
 });
 it('propagates a quota failure and aborts the transaction instead of claiming a save',async()=>{
  const db=await openLocalRepository(new IDBFactory(),'quota-error');await db.commit([{key:'workspace:a',value:'original',expectedRevision:null}]);const original=IDBObjectStore.prototype.put;const fault=vi.spyOn(IDBObjectStore.prototype,'put').mockImplementation(function(this:IDBObjectStore,value:unknown,key?:IDBValidKey){if((value as {key:string}).key==='learning-v2')throw new DOMException('Quota exceeded','QuotaExceededError');return original.call(this,value,key);});
  try{await expect(db.commit([{key:'workspace:a',value:'changed',expectedRevision:1},{key:'learning-v2',value:{attempts:[]},expectedRevision:null}])).rejects.toMatchObject({name:'QuotaExceededError'});expect((await db.read('workspace:a'))?.value).toBe('original');}finally{fault.mockRestore();db.close();}
 });
 it('rejects duplicate keys before opening a partial transaction',async()=>{const db=await openLocalRepository(new IDBFactory(),'duplicate');try{await expect(db.commit([{key:'x',value:1,expectedRevision:null},{key:'x',value:2,expectedRevision:null}])).rejects.toThrow('duplicate');expect(await db.read('x')).toBeNull();}finally{db.close();}});
});
