import type {ConfigField} from '../configurationTypes';
import {eventServiceNotes} from './eventServices';
import {platformServiceNotes} from './platformServices';
import {dataServiceNotes} from './dataServices';
export const configurationDecisionNotes={...eventServiceNotes,...platformServiceNotes,...dataServiceNotes};

/** Enrich help without replacing the original validator/audit's source or constraints. */
export function applyConfigurationNotes(registry:Record<string,ConfigField[]>):Record<string,ConfigField[]>{
 const visit=(service:string,fields:ConfigField[],parent=''):ConfigField[]=>fields.map(field=>{
  const path=parent+field.key,note=configurationDecisionNotes[service]?.[path];
  const next:ConfigField=note?{...field,semantics:note.semantics,documentation:note.documentation,evidence:note.evidence,documentationSource:note.source}:field;
  return field.itemFields?{...next,itemFields:visit(service,field.itemFields,path+'.')}:next;
 });
 return Object.fromEntries(Object.entries(registry).map(([service,fields])=>[service,visit(service,fields)]));
}
