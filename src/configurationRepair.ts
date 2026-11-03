import type {ConfigField,ConfigurationFinding,JsonValue} from './configurationTypes';
import {configurationGraphFindings,isConfigurationDocument,fieldApplicable,checkField,type ConfigurationGraph} from './configurationRegistry';
import {networkFindings} from './networkValidation';
import {networkResourceFields} from './networkTopology';

/** Identity must never depend on explanatory wording or the number of findings. */
export function diagnosticKey(f:ConfigurationFinding):string|undefined {
 return f.ruleId?JSON.stringify([f.resourceId??'',f.ruleId,f.path??f.field??'',f.level]):undefined;
}
export function introducedFindings(before:ConfigurationFinding[],after:ConfigurationFinding[]):ConfigurationFinding[]{
 const fingerprint=(f:ConfigurationFinding)=>{const key=diagnosticKey(f);return key===undefined?undefined:key+':'+stable(f.context)};
 const previous=new Set(before.map(fingerprint).filter((key):key is string=>key!==undefined));
 return after.filter(f=>{const key=fingerprint(f);return key===undefined||!previous.has(key)});
}
function graphFindings(graph:ConfigurationGraph):ConfigurationFinding[]{
 const nodes=graph.nodes.flatMap(node=>{const doc=graph.architecture?.nodes[node.id];return isConfigurationDocument(doc)?configurationGraphFindings(node.service,doc,graph).map(f=>({...f,resourceId:node.id,path:f.path??f.field})):[]});
 const network=networkFindings(graph.network,graph.nodes).map(f=>{
  const ids=[...(graph.network?.frames??[]),...(graph.network?.resources??[]),...(graph.network?.registry?.resources??[])].map(r=>r.id).sort((a,b)=>b.length-a.length);
  return {...f,resourceId:ids.find(id=>f.field===id||f.field?.startsWith(id+'.')),path:f.path??f.field};
 });
 const shape=(graph.network?.resources??[]).flatMap(resource=>Object.entries(resource.values).flatMap(([key,value])=>{
  const field=networkResourceFields[resource.kind]?.find(f=>f.key===key);if(!field)return [];
  return checkField(field,value).map(detail=>({ruleId:'network.field-shape',resourceId:resource.id,field:resource.id+'.'+key,path:resource.id+'.'+key,level:'error' as const,category:'structure' as const,title:'Check '+field.label,detail}));
 }));
 return [...nodes,...network,...shape];
}
const stable=(value:unknown):string=>JSON.stringify(value,(_key,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);
const networkResourceState=(resource:Record<string,unknown>)=>Object.fromEntries(Object.entries(resource).filter(([key])=>!['x','y','width','height','name'].includes(key)));
/** Shared by the editor and AI tools. Untouched legacy errors remain visible, not blocking. */
export function assessConfigurationMutation(before:ConfigurationGraph,after:ConfigurationGraph,editedNodeIds:readonly string[]=[]){
 const baseline=graphFindings(before),findings=graphFindings(after),introduced=introducedFindings(baseline,findings);
 const touched=new Set(editedNodeIds);
 for(const node of after.nodes)if(stable(before.architecture?.nodes[node.id])!==stable(after.architecture?.nodes[node.id]))touched.add(node.id);
 const oldNetwork=[...(before.network?.frames??[]),...(before.network?.registry?.resources??before.network?.resources??[])];
 for(const r of [...(after.network?.frames??[]),...(after.network?.registry?.resources??after.network?.resources??[])]){
  const previous=oldNetwork.find(p=>p.id===r.id);
  if(!previous||stable(networkResourceState(previous as unknown as Record<string,unknown>))!==stable(networkResourceState(r as unknown as Record<string,unknown>)))touched.add(r.id);
 }
 for(const [id,binding]of Object.entries(after.network?.registry?.serviceBindings??{}))if(stable(before.network?.registry?.serviceBindings[id])!==stable(binding))touched.add(id);
 const newKeys=new Set(introduced.map(diagnosticKey));
 const blocking=findings.filter(f=>f.level==='error'&&(touched.has(f.resourceId??'')||!f.ruleId||newKeys.has(diagnosticKey(f))));
 return {findings,introduced,blocking,existing:findings.filter(f=>!introduced.includes(f))};
}
export function hasMeaningfulValue(value:unknown):boolean {
 if(value===undefined||value===null)return false;
 if(typeof value==='string')return value.trim().length>0;
 if(Array.isArray(value))return value.some(hasMeaningfulValue);
 if(typeof value==='object')return Object.values(value).some(hasMeaningfulValue);
 return true; // false and zero are explicit values.
}
export function configurationCompleteness(fields:ConfigField[],values:Record<string,JsonValue>){
 const applicable=fields.filter(f=>fieldApplicable(f,values)===true);
 const populated=applicable.filter(f=>hasMeaningfulValue(values[f.key]));
 const emptyRows=fields.filter(f=>f.kind==='table').reduce((n,f)=>n+(Array.isArray(values[f.key])?(values[f.key] as JsonValue[]).filter(row=>!hasMeaningfulValue(row)).length:0),0);
 return {populated:populated.length,applicable:applicable.length,emptyRows,needsContext:fields.filter(f=>fieldApplicable(f,values)===undefined).length};
}
export function fillMissingDefaults(fields:ConfigField[],values:Record<string,JsonValue>):Record<string,JsonValue>{
 const result={...values};
 for(const f of fields)if(result[f.key]===undefined&&f.defaultValue!==undefined&&fieldApplicable(f,result)===true)result[f.key]=structuredClone(f.defaultValue);
 return result;
}
