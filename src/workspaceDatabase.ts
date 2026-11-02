/** Shared local persistence boundary. One database and transaction for all backup facets. */
export const DATABASE_NAME='aws-playground-data';
export const DATABASE_VERSION=1;
export const RECORD_STORE='records';
export interface RepositoryRecord<T=unknown>{key:string;value:T;revision:number;updatedAt:string}
export interface RepositoryMutation{key:string;value:unknown;expectedRevision:number|null}
export class RepositoryConflictError extends Error {
 constructor(public key:string){super('This data changed in another tab. Reload it or save your work as a separate copy.');this.name='RepositoryConflictError';}
}
export interface LocalRepository {
 read<T=unknown>(key:string):Promise<RepositoryRecord<T>|null>;
 list(prefix:string):Promise<RepositoryRecord[]>;
 commit(mutations:RepositoryMutation[]):Promise<RepositoryRecord[]>;
 close():void;
}
const requestError=(error:DOMException|null)=>error??new Error('Browser storage is unavailable. Export your work before closing this tab.');
export function openLocalRepository(factory:IDBFactory=globalThis.indexedDB,databaseName=DATABASE_NAME):Promise<LocalRepository>{
 return new Promise((resolve,reject)=>{
  if(!factory){reject(new Error('IndexedDB is unavailable. Your existing browser data is preserved; export a backup or enable browser storage.'));return;}
  const opening=factory.open(databaseName,DATABASE_VERSION);let settled=false;
  opening.onupgradeneeded=()=>{if(!opening.result.objectStoreNames.contains(RECORD_STORE))opening.result.createObjectStore(RECORD_STORE,{keyPath:'key'});};
  opening.onerror=()=>{settled=true;reject(requestError(opening.error));};
  opening.onblocked=()=>{settled=true;reject(new Error('A different tab is blocking the storage upgrade. Close that tab, then retry.'));};
  opening.onsuccess=()=>{
   const db=opening.result;if(settled){db.close();return;}
   db.onversionchange=()=>db.close();
   const repository:LocalRepository={
    read<T>(key:string){return new Promise<RepositoryRecord<T>|null>((done,fail)=>{try{const tx=db.transaction(RECORD_STORE,'readonly'),request=tx.objectStore(RECORD_STORE).get(key);let result:RepositoryRecord<T>|null=null;request.onsuccess=()=>{result=request.result??null;};tx.oncomplete=()=>done(result);tx.onabort=()=>fail(requestError(tx.error));tx.onerror=()=>{};}catch(e){fail(e);}});},
    list(prefix:string){return new Promise<RepositoryRecord[]>((done,fail)=>{try{const tx=db.transaction(RECORD_STORE,'readonly'),request=tx.objectStore(RECORD_STORE).getAll(),result:RepositoryRecord[]=[];request.onsuccess=()=>result.push(...(request.result as RepositoryRecord[]).filter(record=>record.key.startsWith(prefix)));tx.oncomplete=()=>done(result);tx.onabort=()=>fail(requestError(tx.error));tx.onerror=()=>{};}catch(e){fail(e);}});},
    commit(mutations){return new Promise((done,fail)=>{
     if(!mutations.length){done([]);return;}
     if(mutations.some(m=>typeof m.key!=='string'||!m.key||m.key.length>250||m.expectedRevision!==null&&(!Number.isInteger(m.expectedRevision)||m.expectedRevision<1))||new Set(mutations.map(m=>m.key)).size!==mutations.length){fail(new Error('Invalid or duplicate storage mutation.'));return;}
     try{
      const tx=db.transaction(RECORD_STORE,'readwrite'),store=tx.objectStore(RECORD_STORE);let failure:unknown;const result:RepositoryRecord[]=[];const now=new Date().toISOString();
      tx.oncomplete=()=>done(result);tx.onabort=()=>fail(failure??requestError(tx.error));tx.onerror=()=>{};
      for(const mutation of mutations){const read=store.get(mutation.key);read.onsuccess=()=>{
       if(failure)return;const existing=read.result as RepositoryRecord|undefined;
       if((existing?.revision??null)!==mutation.expectedRevision){failure=new RepositoryConflictError(mutation.key);tx.abort();return;}
       try{const next={key:mutation.key,value:mutation.value,revision:(existing?.revision??0)+1,updatedAt:now};store.put(next);result.push(next);}catch(e){failure=e;tx.abort();}
      };}
     }catch(e){fail(e);}
    });},
    close(){db.close();},
   };resolve(repository);
  };
 });
}
