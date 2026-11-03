import type {ConfigField,ConfigSource} from '../configurationTypes';
import {eventServiceNotes,eventNoteSources,type EventServiceNote} from './eventServices';
import {platformServiceNotes,platformNoteSources} from './platformServices';
import {dataServiceNotes,dataNoteSources} from './dataServices';
import {deliveryServiceNotes,deliveryNoteSources} from './deliveryServices';
import {securityAiServiceNotes,securityAiNoteSources} from './securityAiServices';
export const configurationNoteGroups:{notes:Record<string,Record<string,EventServiceNote>>;sources:Record<string,ConfigSource>}[]=[
 {notes:eventServiceNotes,sources:eventNoteSources},{notes:platformServiceNotes,sources:platformNoteSources},
 {notes:dataServiceNotes,sources:dataNoteSources},{notes:deliveryServiceNotes,sources:deliveryNoteSources},
 {notes:securityAiServiceNotes,sources:securityAiNoteSources},
];
export const configurationDecisionNotes=Object.assign({},...configurationNoteGroups.map(group=>group.notes)) as Record<string,Record<string,EventServiceNote>>;

/** Enrich help without replacing the original validator/audit's source or constraints. */
export function applyConfigurationNotes(registry:Record<string,ConfigField[]>):Record<string,ConfigField[]>{
 const visit=(service:string,fields:ConfigField[],parent=''):ConfigField[]=>fields.map(field=>{
  const path=parent+field.key,note=configurationDecisionNotes[service]?.[path];
  const group=configurationNoteGroups.find(group=>group.notes[service]);
  const references=note?[...new Map([note.source,...note.evidence.sourceIds.map(id=>group?.sources[id]).filter((source):source is ConfigSource=>!!source)].map(source=>[source.url,source])).values()]:[];
  const next:ConfigField=note?{...field,semantics:note.semantics,documentation:note.documentation,evidence:note.evidence,documentationSource:note.source,documentationReferences:references}:field;
  return field.itemFields?{...next,itemFields:visit(service,field.itemFields,path+'.')}:next;
 });
 return Object.fromEntries(Object.entries(registry).map(([service,fields])=>[service,visit(service,fields)]));
}
