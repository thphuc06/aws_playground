// Diagnostic rule IDs are persistent. Add new IDs; never renumber existing producers.
import {documentConfigurationFindings} from './configurationDocumentRules';
import {policyFieldQuotaIssues,policyLimitData} from './policyQuotaChecks';
import {semanticConfigurationFindings} from './configurationRules';
import {applyAuditMetadata} from './configurationAuditMetadata';
import {auditedConfigurationFindings} from './configurationAuditRules';
import type {NetworkTopology} from './networkTopology';
import {architectureProfilesData} from './architectureProfilesData';
import {configurationCoreFields} from './configurationCoreFields';
import {configurationPlatformFields} from './configurationPlatformFields';
import {configurationDeliveryFields} from './configurationDeliveryFields';
import {configurationSecurityFields} from './configurationSecurityFields';
import {parseConfigurationDocument} from './configurationDocuments';
import {validatePolicyDocument} from './policyEngine';
import type {ConfigField,ConfigurationDocument,JsonValue,ConfigurationFinding,SecurityLibrary} from './configurationTypes';
export const configurationFields:Record<string,ConfigField[]>=applyAuditMetadata({...configurationCoreFields,...configurationPlatformFields,...configurationDeliveryFields,...configurationSecurityFields});

export const isRecord=(v:unknown):v is Record<string,any>=>!!v&&typeof v==='object'&&!Array.isArray(v);
export function isConfigurationDocument(v:unknown):v is ConfigurationDocument{return isRecord(v)&&v.schemaVersion===2&&isRecord(v.values)&&isRecord(v.legacyNotes)}
export function fieldApplicable(field:ConfigField,values:Record<string,JsonValue>):boolean|undefined {if(!field.when)return true;if(values[field.when.field]===undefined)return undefined;return field.when.values.includes(values[field.when.field] as string|number|boolean)}
export function fieldJsonSchema(field:ConfigField,strictTool=false):any{
 let schema:any;
 if(field.kind==='number')schema={type:field.integer?'integer':'number',...(field.min!==undefined?{minimum:field.min}:{}),...(field.max!==undefined?{maximum:field.max}:{}),...(field.allowedNumbers?{enum:field.allowedNumbers}:{})};
 else if(field.kind==='boolean')schema={type:'boolean'};
 else if(field.kind==='select')schema={type:'string',enum:field.options??[]};
 else if(field.kind==='multi-select')schema={type:'array',items:{type:'string',...(field.options?{enum:field.options}:{})},maxItems:100,...(!strictTool?{uniqueItems:true}:{})};
 else if(field.kind==='key-value')schema=strictTool?{type:'array',items:{type:'object',properties:{key:{type:'string',maxLength:512},value:{type:'string',maxLength:8192}},required:['key','value'],additionalProperties:false}}:{type:'object',maxProperties:100,additionalProperties:{type:'string',maxLength:8192}};
 else if(field.kind==='resource')schema={type:'object',properties:{type:{type:'string',enum:resourceReferenceTypes(field)},id:{type:'string',minLength:1,maxLength:512}},required:['type','id'],additionalProperties:false};
 else if(field.kind==='table'){const fields=field.itemFields??[];schema={type:'array',maxItems:100,items:{type:'object',properties:Object.fromEntries(fields.map(f=>[f.key,strictTool?{anyOf:[fieldJsonSchema(f,true),{type:'null'}]}:fieldJsonSchema(f)])),required:strictTool?fields.map(f=>f.key):[],additionalProperties:false}};}
 else schema={type:'string',maxLength:field.maxLength??(['json','yaml'].includes(field.kind)?262144:2000)};
 return schema;
}
export function resourceReferenceTypes(field:ConfigField){return ['node','external',...(!field.resourceServices?.length||field.resourceServices.includes('iam')?['role']:[]),...(field.resourceServices?.includes('vpc')?['frame']:[])];}
export function checkField(field:ConfigField,value:unknown,enforceBounds=true):string[]{
 const invalid=(message:string)=>[field.label+': '+message];
 if(field.kind==='number'){if(typeof value!=='number'||!Number.isFinite(value)||enforceBounds&&(field.min!==undefined&&value<field.min||field.max!==undefined&&value>field.max||field.integer&&!Number.isInteger(value)||field.allowedNumbers&&!field.allowedNumbers.includes(value)))return invalid(field.allowedNumbers?'choose a documented value: '+field.allowedNumbers.join(', ')+'.':'use a finite '+(field.integer?'whole number':'number')+' within '+(field.min??'the minimum')+'–'+(field.max??'the supported maximum')+'.');}
 else if(field.kind==='boolean'){if(typeof value!=='boolean')return invalid('choose true/false, or clear to unknown.');}
 else if(field.kind==='select'){if(typeof value!=='string'||!field.options?.includes(value))return invalid('choose a supported option.');}
 else if(field.kind==='multi-select'){if(!Array.isArray(value)||value.length>100||new Set(value).size!==value.length||value.some(v=>typeof v!=='string'||field.options&&!field.options.includes(v)))return invalid('use unique supported options.');}
 else if(field.kind==='resource'){if(!isRecord(value)||Object.keys(value).some(k=>!['type','id'].includes(k))||!resourceReferenceTypes(field).includes(value.type)||typeof value.id!=='string'||!value.id||value.id.length>512)return invalid('select a compatible resource reference or clear to unknown.');}
 else if(field.kind==='key-value'){if(!isRecord(value)||Object.keys(value).length>100||Object.entries(value).some(([k,v])=>k.length>512||['__proto__','prototype','constructor'].includes(k)||typeof v!=='string'||v.length>8192))return invalid('use at most100 nonsecret string entries.');}
 else if(field.kind==='table'){if(!Array.isArray(value)||value.length>100||value.some(row=>!isRecord(row)||Object.keys(row).some(k=>!field.itemFields?.some(f=>f.key===k))))return invalid('use a table of supported row fields (app limit100).');}
 else if(typeof value!=='string'||value.length>((enforceBounds?field.maxLength:undefined)??(['json','yaml'].includes(field.kind)?262144:2000)))return invalid('invalid document/text value or size limit exceeded.');
 if(field.kind==='json'||field.kind==='yaml'){
  const parsed=parseConfigurationDocument(value as string,field.kind==='yaml'?'yaml':'json');if(parsed.errors.length)return parsed.errors;
  if(['policy','trust-policy','resource-policy','kms-policy'].includes(field.documentType??''))return validatePolicyDocument(value as string,field.documentType==='trust-policy'?'trust':field.documentType==='resource-policy'?'resource':field.documentType==='kms-policy'?'kms':'identity').errors;
 }
 if(field.kind==='table')return (value as Record<string,unknown>[]).flatMap((row,i)=>(field.itemFields??[]).filter(f=>row[f.key]!==undefined).flatMap(f=>checkField(f,row[f.key],enforceBounds).map(e=>'Row '+(i+1)+': '+e)));
 return [];
}
export function validateConfiguration(service:string,input:unknown,enforceBounds=true):ConfigurationFinding[]{
 const fields=configurationFields[service];const findings:ConfigurationFinding[]=[];
 const error=(ruleId:string,field:string,title:string,detail:string)=>findings.push({ruleId,field,title,detail,level:'error',category:'structure'});
 if(!fields||!isConfigurationDocument(input)){error('shape.001','','Invalid configuration','Expected version2 values and legacyNotes.');return findings;}
 for(const k of Object.keys(input))if(!['schemaVersion','values','legacyNotes'].includes(k))error('shape.002',k,'Unknown document field',k);
 for(const [key,value]of Object.entries(input.values)){
  const field=fields.find(f=>f.key===key);if(!field){error('shape.003',key,'Unknown configuration field','Unknown configuration field: '+key);continue;}
  if(typeof value==='string'&&field.kind==='json')for(const issue of policyFieldQuotaIssues(service,key,value))error('shape.004',key,'Policy document quota',issue);
  for(const issue of checkField(field,value,enforceBounds))error('shape.005',key,'Check '+field.label,issue);
  const applicable=fieldApplicable(field,input.values);if(applicable===false)error('shape.006',key,'Option unavailable for this variant',field.label+' is not applicable to the selected '+field.when!.field+'. Clear it or choose the compatible variant.');
 }
 if(Object.keys(input.legacyNotes).length)findings.push({ruleId:'shape.direct.1',level:'info',title:'Legacy notes preserved',detail:'Old prose was not assumed to be configured permissions or network state.',category:'unknown'});
 return findings;
}
export function migrateConfiguration(service:string,input:Record<string,JsonValue>):ConfigurationDocument{
 if(isConfigurationDocument(input))return structuredClone(input);
 const fields=configurationFields[service]??[],old=architectureProfilesData[service]?.fields??[];const values:Record<string,JsonValue>={},legacyNotes:Record<string,JsonValue>={};
 for(const [key,value]of Object.entries(input)){
  const field=fields.find(f=>f.key===key),previous=old.find(f=>f.key===key);
  // A prose note is never promoted to an assertion just because the new field is text.
  if(field&&previous&&previous.kind!=='text'&&!checkField(field,value).length)values[key]=structuredClone(value);else legacyNotes[key]=structuredClone(value);
 }
 return {schemaVersion:2,values,legacyNotes};
}
export function configurationDocument(values:Record<string,JsonValue>={}):ConfigurationDocument{return {schemaVersion:2,values,legacyNotes:{}}}
export function normalizeToolValue(field:ConfigField,value:any):JsonValue{
 if(field.kind==='key-value'&&Array.isArray(value)){const out:Record<string,JsonValue>=Object.create(null);for(const row of value){if(!row||typeof row.key!=='string'||Object.hasOwn(out,row.key)||['__proto__','constructor','prototype'].includes(row.key))throw new Error('Invalid or duplicate key-value entry.');out[row.key]=row.value;}return out;}
 if(field.kind==='table'&&Array.isArray(value))return value.map(row=>Object.fromEntries(Object.entries(row).filter(([,x])=>x!==null).map(([k,v])=>[k,normalizeToolValue(field.itemFields?.find(f=>f.key===k)??(()=>{throw new Error('Unknown table column: '+k)})(),v)])));
 return value;
}
export function configurationSources(service:string){const walk=(fields:ConfigField[]):NonNullable<ConfigField['source']>[]=>fields.flatMap(f=>[...(f.source?[f.source]:[]),...(f.awsLimit?[{title:f.label+' limits',url:f.awsLimit.sourceUrl,verified:f.source?.verified??'2026-11-02'}]:[]),...walk(f.itemFields??[])]);const sources=[...walk(configurationFields[service]??[]),...policyLimitData.filter(q=>q.service===service).map(q=>({title:'Policy quota: '+q.field,url:q.sourceUrl,verified:q.verified}))];return sources.filter((s,i)=>sources.findIndex(x=>x.url===s.url)===i)}
export function configurationSections(service:string){return [...new Set((configurationFields[service]??[]).map(f=>f.section))]}
export interface ConfigurationGraph {nodes:{id:string;service:string;label:string}[];architecture?:{nodes:Record<string,Record<string,JsonValue>>};securityLibrary?:SecurityLibrary;network?:NetworkTopology}
export function configurationGraphFindings(service:string,document:ConfigurationDocument,graph?:ConfigurationGraph):ConfigurationFinding[]{
 const findings=[...validateConfiguration(service,document),...semanticConfigurationFindings(service,document,graph),...auditedConfigurationFindings(service,document,graph),...documentConfigurationFindings(service,document.values)];if(!graph)return findings;
 const visit=(fields:ConfigField[],values:Record<string,JsonValue>,path='')=>{for(const f of fields){const value=values[f.key];if(value===undefined)continue;
  if(f.kind==='resource'&&isRecord(value)){const ref=value as Record<string,JsonValue>;
   const exists=ref.type==='node'?graph.nodes.some(n=>n.id===ref.id&&(!f.resourceServices?.length||f.resourceServices.includes(n.service))):ref.type==='role'?graph.securityLibrary?.roles.some(r=>r.id===ref.id):ref.type==='frame'?graph.network?.frames.some(frame=>frame.id===ref.id&&frame.kind==='vpc'):true;
   if(exists&&ref.type==='node'&&/role/i.test(f.key)){const target=graph.nodes.find(n=>n.id===ref.id);const targetConfig=target?graph.architecture?.nodes[target.id]:undefined;if(target?.service==='iam'&&isConfigurationDocument(targetConfig)&&targetConfig.values.principalType!==undefined&&targetConfig.values.principalType!=='role')findings.push({ruleId:'shape.direct.2',level:'error',field:path+f.key,context:{principalType:targetConfig.values.principalType},title:'A role reference is required',detail:f.label+' points to an IAM identity explicitly configured as something other than a role.',category:'design'});}
   if(!exists)findings.push({ruleId:'shape.direct.3',level:'error',field:path+f.key,title:'Unresolved resource reference',detail:f.label+' points to a missing/incompatible resource. Relink it; no permission or connectivity is assumed.',category:'design'});
  }if(f.kind==='table'&&Array.isArray(value))value.forEach((row,i)=>{if(isRecord(row))visit(f.itemFields??[],row as Record<string,JsonValue>,path+f.key+'.'+i+'.')});
 }};visit(configurationFields[service]??[],document.values);return findings;
}
