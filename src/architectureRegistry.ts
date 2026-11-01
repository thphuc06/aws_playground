import {canvasCatalog} from './serviceCatalog';
import {architectureProfilesData} from './architectureProfilesData';
export type ArchitectureValue=string|number|boolean;
export type ArchitectureSettings=Record<string,ArchitectureValue>;
export const relationshipKinds=['request','data','network','identity','deployment','observability','unspecified'] as const;
export type RelationshipKind=typeof relationshipKinds[number];
export type ArchitectureData={nodes:Record<string,ArchitectureSettings>;relationships:Record<string,RelationshipKind>};
export function getArchitectureProfile(service:string){return architectureProfilesData[service]}
export function validateArchitectureSettings(service:string,value:unknown):string[]{
 const profile=getArchitectureProfile(service);
 if(!profile||!value||typeof value!=='object'||Array.isArray(value))return ['Unknown service or invalid settings record.'];
 const errors:string[]=[];
 for(const [key,v] of Object.entries(value)){
  const field=profile.fields.find(f=>f.key===key);
  if(!field){errors.push('Unknown configuration field: '+key);continue}
  if(field.kind==='boolean'?typeof v!=='boolean':field.kind==='number'?typeof v!=='number'||!Number.isFinite(v)||(field.min!==undefined&&v<field.min)||(field.max!==undefined&&v>field.max):typeof v!=='string'||v.length>2000||(field.kind==='select'&&!field.options?.includes(v)))errors.push('Invalid value for '+key);
 }
 return errors;
}
export function architectureSchema(service:string){
 const profile=getArchitectureProfile(service);if(!profile)return null;
 return {service,name:canvasCatalog.find(s=>s.id===service)?.name,...profile,unknownPolicy:'Omitted fields are unknown, not asserted defaults. These are educational design choices, not verified deployment state.'};
}
