import type {LocalRepository,RepositoryRecord} from '../../workspaceDatabase';
import {getLabDefinition} from './definitions';
import {createLabSession,evaluateLab} from './labEngine';
import type {LabDefinition,LabSession,LabValues} from './types';
export const LAB_ARCHIVE_MAX_BYTES=8*1024*1024;
export interface StoredLabSession {record:RepositoryRecord<LabSession>;pointerRevision:number}
export class LabRecoveryError extends Error {constructor(message:string,public raw:string){super(message);this.name='LabRecoveryError'}}
const record=(value:unknown):value is Record<string,any>=>!!value&&typeof value==='object'&&!Array.isArray(value);
const validId=(value:unknown):value is string=>typeof value==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(value);
const iso=(value:unknown):value is string=>typeof value==='string'&&value.length<=40&&/^\d{4}-\d{2}-\d{2}T/.test(value)&&Number.isFinite(Date.parse(value));
const stable=(v:any):string=>JSON.stringify(v&&typeof v==='object'?(Array.isArray(v)?v.map(x=>JSON.parse(stable(x))):Object.fromEntries(Object.keys(v).sort().map(k=>[k,JSON.parse(stable(v[k]))]))):v);
export function validateLabValues(definition:LabDefinition,input:unknown):LabValues {
 if(!record(input)||Object.keys(input).length>definition.fields.length)throw new Error('Invalid lab values object.');
 for(const [key,value]of Object.entries(input)){const field=definition.fields.find(f=>f.key===key);if(!field)throw new Error('Unknown lab field: '+key);if(field.kind==='number'){if(typeof value!=='number'||!Number.isFinite(value))throw new Error('Expected a finite number for '+key);}else if(typeof value!=='string'||value.length>16000||field.kind==='choice'&&value!==''&&!field.options?.some(o=>o.value===value))throw new Error('Invalid text/choice for '+key);}
 return structuredClone(input) as LabValues;
}
export function validateLabSession(input:unknown):LabSession {
 if(!record(input)||input.schemaVersion!==1||!validId(input.id)||typeof input.labId!=='string'||!iso(input.startedAt)||!iso(input.updatedAt)||!Array.isArray(input.attempts)||input.attempts.length>100)throw new Error('Invalid or unsupported lab session.');
 const definition=getLabDefinition(input.labId);if(!definition||input.definitionVersion!==definition.version)throw new Error('The saved lab definition version is not supported. Export it before creating a new session.');
 if(stable(input.startingFixture)!==stable(definition.fixture))throw new Error('The saved starting fixture differs from its versioned definition. It has not been overwritten.');
 const ids=new Set<string>();const attempts=input.attempts.map((a:unknown)=>{if(!record(a)||!validId(a.id)||!iso(a.at)||ids.has(a.id))throw new Error('Invalid or duplicate lab attempt.');ids.add(a.id);const values=validateLabValues(definition,a.values);return {id:a.id,at:a.at,values,result:evaluateLab(definition,values)}});
 return {schemaVersion:1,id:input.id,labId:input.labId,definitionVersion:definition.version,startedAt:input.startedAt,updatedAt:input.updatedAt,startingFixture:structuredClone(definition.fixture),values:validateLabValues(definition,input.values),attempts};
}
export function exportLabSession(session:LabSession):string {return JSON.stringify({format:'aws-playground-lab',archiveVersion:1,session:validateLabSession(session)},null,2)}
export function parseLabArchive(raw:string):LabSession {if(new TextEncoder().encode(raw).byteLength>LAB_ARCHIVE_MAX_BYTES)throw new Error('Lab archive exceeds the 8 MiB local limit.');const parsed=JSON.parse(raw);if(!record(parsed)||parsed.format!=='aws-playground-lab'||parsed.archiveVersion!==1)throw new Error('Not a supported lab archive.');return validateLabSession(parsed.session)}
const sessionKey=(id:string)=>'lab-session:'+id;
const pointerKey=(labId:string)=>'lab-active:'+labId;
function checkedRecord(stored:RepositoryRecord):RepositoryRecord<LabSession>{const value=validateLabSession(stored.value);if(stored.key!==sessionKey(value.id))throw new Error('Session key does not match the saved lab ID.');return {...stored,value}}
export async function loadLabSession(repository:LocalRepository,labId:string):Promise<StoredLabSession|null>{
 const pointer=await repository.read<{id:string}>(pointerKey(labId));if(!pointer)return null;let stored:RepositoryRecord|null=null;
 try{if(!validId(pointer.value?.id))throw new Error('Invalid active lab-session pointer.');stored=await repository.read(sessionKey(pointer.value.id));if(!stored)throw new Error('The active lab session is missing.');const checked=checkedRecord(stored);if(checked.value.labId!==labId)throw new Error('The active session belongs to a different lab.');return {record:checked,pointerRevision:pointer.revision}}catch(error){throw new LabRecoveryError(error instanceof Error?error.message:'Lab session cannot be read.',JSON.stringify({pointer,session:stored},null,2))}
}
export async function saveNewLabSession(repository:LocalRepository,session:LabSession):Promise<StoredLabSession>{
 const checked=validateLabSession(session),pointer=await repository.read(pointerKey(checked.labId)),newId=globalThis.crypto.randomUUID(),value={...checked,id:newId,updatedAt:new Date().toISOString()};
 const records=await repository.commit([{key:sessionKey(newId),value,expectedRevision:null},...(pointer?[{key:'lab-recovery:'+newId,value:{priorPointer:pointer},expectedRevision:null}]:[]),{key:pointerKey(value.labId),value:{id:newId},expectedRevision:pointer?.revision??null}]);
 return {record:records.find(r=>r.key===sessionKey(newId)) as RepositoryRecord<LabSession>,pointerRevision:records.find(r=>r.key===pointerKey(value.labId))!.revision};
}
export async function startLabSession(repository:LocalRepository,definition:LabDefinition){return saveNewLabSession(repository,createLabSession(definition))}
export async function saveLabSession(repository:LocalRepository,previous:StoredLabSession,session:LabSession):Promise<StoredLabSession>{
 const value=validateLabSession(session);if(previous.record.key!==sessionKey(value.id)||previous.record.value.labId!==value.labId)throw new Error('Save requires the loaded lab session identity.');
 const records=await repository.commit([{key:sessionKey(value.id),value,expectedRevision:previous.record.revision},{key:pointerKey(value.labId),value:{id:value.id},expectedRevision:previous.pointerRevision}]);
 return {record:records.find(r=>r.key===sessionKey(value.id)) as RepositoryRecord<LabSession>,pointerRevision:records.find(r=>r.key===pointerKey(value.labId))!.revision};
}
export async function importLabSession(repository:LocalRepository,raw:string,expectedLabId?:string){const session=parseLabArchive(raw);if(expectedLabId&&session.labId!==expectedLabId)throw new Error('This archive belongs to a different lab. Open that lab to import it.');return saveNewLabSession(repository,session)}
export async function listLabSessions(repository:LocalRepository,labId:string){return (await repository.list('lab-session:')).flatMap(r=>{if((r.value as any)?.labId!==labId)return [];try{return [checkedRecord(r)]}catch{return []}}).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));}
export async function activateLabSession(repository:LocalRepository,id:string,labId:string){const record=await repository.read(sessionKey(id));if(!record)throw new Error('Saved lab session not found.');const checked=checkedRecord(record);if(checked.value.labId!==labId)throw new Error('Session belongs to another lab.');const pointer=await repository.read(pointerKey(labId)),records=await repository.commit([{key:pointerKey(labId),value:{id},expectedRevision:pointer?.revision??null}]);return {record:checked,pointerRevision:records[0].revision};}
