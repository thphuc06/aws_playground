import {it,expect} from 'vitest';
import {configurationFields} from '../configurationRegistry';
import {applyConfigurationNotes,configurationDecisionNotes,configurationNoteGroups} from './index';
import type {ConfigField} from '../configurationTypes';

it('enriches exactly the scoped paths without replacing audited bounds or rule sources',()=>{
 const audited:ConfigField={key:'timeoutSeconds',label:'Timeout',kind:'number',section:'configuration',help:'Original constraint help',min:1,max:900,source:{title:'Constraint reference',url:'https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html',verified:'2026-11-02'},audit:{checked:'2026-11-02',scope:'Event Function timeout range'}};
 const enriched=applyConfigurationNotes({lambda:[audited]}).lambda[0];
 expect(enriched.min).toBe(1);expect(enriched.max).toBe(900);expect(enriched.source).toEqual(audited.source);expect(enriched.audit).toEqual(audited.audit);
 expect(enriched.documentation?.whenToUse).toBeTruthy();expect(enriched.documentationSource?.verified).toBe('2026-11-03');expect(audited.documentation).toBeUndefined();
});
it('connects nested decision guidance to real fields rather than a detached inventory',()=>{
 expect(Object.keys(configurationDecisionNotes)).toHaveLength(58);
 expect(Object.values(configurationDecisionNotes).reduce((count,notes)=>count+Object.keys(notes).length,0)).toBe(1405);
 for(const group of configurationNoteGroups)for(const [service,notes] of Object.entries(group.notes))for(const [path,note] of Object.entries(notes))for(const id of note.evidence.sourceIds)expect(group.sources[id],service+'.'+path+' source '+id).toBeDefined();
 const fields=(items:ConfigField[],parent=''):{path:string;field:ConfigField}[]=>items.flatMap(field=>[{path:parent+field.key,field},...fields(field.itemFields??[],parent+field.key+'.')]);
 for(const [service,notes] of Object.entries(configurationDecisionNotes)){
  const actual=new Map(fields(configurationFields[service]).map(value=>[value.path,value.field]));
  for(const [path,note] of Object.entries(notes)){expect(actual.get(path)?.documentation,service+'.'+path).toEqual(note.documentation);expect(actual.get(path)?.documentationSource).toEqual(note.source);}
 }
 const logClass=configurationFields['cloudwatch-logs'].find(field=>field.key==='logClass')!;
 expect(logClass.documentationReferences?.length).toBeGreaterThanOrEqual(2);
});
