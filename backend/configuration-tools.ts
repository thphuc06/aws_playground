import {configurationFields,fieldJsonSchema,migrateConfiguration,normalizeToolValue,validateConfiguration,isConfigurationDocument,configurationGraphFindings} from '../src/configurationRegistry';
import {emptySecurityLibrary,type JsonValue} from '../src/configurationTypes';
import {validateSecurityLibrary} from '../src/securityLibrary';
import {managedPolicySnapshots} from '../src/managedPolicySnapshots';
import {validateReviewGraph,type Graph} from '../src/architectureReview';
const record=(properties:Record<string,unknown>)=>({type:'object',properties,required:Object.keys(properties),additionalProperties:false});
const str={type:'string'},strings={type:'array',items:str},nullable=(s:unknown)=>({anyOf:[s,{type:'null'}]});
export function strictSchemaMetrics(schema:any){let properties=0,enums=0,depth=0,stringLength=0;const visit=(s:any,level=0)=>{if(!s||typeof s!=='object')return;const next=level+(['object','array'].includes(s.type)?1:0);depth=Math.max(depth,next);if(s.properties){properties+=Object.keys(s.properties).length;stringLength+=Object.keys(s.properties).join('').length;Object.values(s.properties).forEach(v=>visit(v,next));}if(s.enum){enums+=s.enum.length;stringLength+=s.enum.map(String).join('').length;}if(s.items)visit(s.items,next);for(const k of ['anyOf','oneOf'])s[k]?.forEach((v:any)=>visit(v,next));};visit(schema);return {properties,enums,depth,stringLength};}
export class ConfigurationTools {
 private loaded:string[]=[];
 constructor(private getGraph:()=>Graph,private setGraph:(graph:Graph)=>void){}
 load(ids:string[]){if(!Array.isArray(ids)||ids.some(id=>!Object.hasOwn(configurationFields,id)))throw new Error('Unknown service schema.');for(const id of ids){this.loaded=this.loaded.filter(x=>x!==id);this.loaded.push(id);}this.loaded=this.loaded.slice(-12);while(this.loaded.length>1){const schema=this.definitions().find(t=>t.name==='configure_resources')?.parameters;const m=strictSchemaMetrics(schema);if(m.properties<=4500&&m.enums<=950&&m.depth<=10&&m.stringLength<=110000)break;this.loaded.shift();}return {configurationTool:'configure_resources',securityTool:'update_security_library',loadedServiceIds:[...this.loaded],note:'Only loaded schemas are available for typed configuration; reload a service if it was evicted to respect provider schema limits.'};}
 definitions(){
  const variants=this.loaded.filter(id=>configurationFields[id]).map(service=>record({service:{type:'string',enum:[service]},nodeId:str,clearFields:{type:'array',items:{type:'string',enum:configurationFields[service].map(f=>f.key)}},values:record(Object.fromEntries(configurationFields[service].map(f=>[f.key,nullable(fieldJsonSchema(f,true))])))}));
  return [...(variants.length?[{type:'function',name:'configure_resources',description:'Atomically configure one or more draft nodes with the loaded service schemas. Null means leave unchanged; clearFields explicitly removes fields. Nested rows may use null for unspecified columns. Key-value data uses key/value entries. JSON/YAML documents are text validated by the app. Configuration values are architectural intent, not verified AWS state.',strict:true,parameters:record({updates:{type:'array',items:variants.length===1?variants[0]:{anyOf:variants}}})}]:[]),
   {type:'function',name:'update_security_library',description:'Atomically upsert learning-only roles/policies in the draft, never AWS IAM. Managed snapshots are dated references, not least-privilege defaults. Custom policies need complete JSON. Roles refer to library policy IDs; configurations refer to roles as {type:"role",id:"..."}. Preserve existing attachments unless a change is justified.',strict:true,parameters:record({policies:{type:'array',items:record({id:str,name:str,kind:{type:'string',enum:['identity','trust','resource','kms','endpoint','session','boundary']},managedPolicyId:nullable({type:'string',enum:managedPolicySnapshots.map(p=>p.id)}),document:nullable(str)})},roles:{type:'array',items:record({id:str,name:str,trustPolicyId:nullable(str),policyIds:strings,boundaryPolicyId:nullable(str),sessionPolicyIds:strings})}})},
  ];
 }
 configure(args:any){
  if(!Array.isArray(args.updates)||args.updates.length<1||args.updates.length>25)throw new Error('Use 1–25 node updates.');
  const graph=structuredClone(this.getGraph());graph.architecture??={nodes:{},relationships:{}};const changed:string[]=[];
  for(const update of args.updates){const node=graph.nodes.find(n=>n.id===update.nodeId&&n.service===update.service);const fields=configurationFields[update.service];if(!node||!fields||!this.loaded.includes(update.service))throw new Error('Load the matching service schema and use an existing node ID.');
   if(!update.values||typeof update.values!=='object'||Array.isArray(update.values)||!Array.isArray(update.clearFields))throw new Error('Invalid typed configuration update.');
   const document=migrateConfiguration(node.service,graph.architecture.nodes[node.id]??{});
   for(const [key,value]of Object.entries(update.values)){const field=fields.find(f=>f.key===key);if(!field)throw new Error('Unknown field: '+key);if(value!==null)document.values[key]=normalizeToolValue(field,value);}
   for(const key of update.clearFields){if(!fields.some(f=>f.key===key))throw new Error('Unknown field to clear.');delete document.values[key];}
   const errors=validateConfiguration(node.service,document).filter(f=>f.level==='error');if(errors.length)throw new Error(errors.map(f=>f.title+': '+f.detail).join(' '));
   graph.architecture.nodes[node.id]=document as unknown as Record<string,JsonValue>;changed.push('Configure '+node.label);
  }
  const structural=validateReviewGraph(graph);if(!structural.ok)throw new Error(structural.error);
  for(const update of args.updates){const d=graph.architecture.nodes[update.nodeId];if(isConfigurationDocument(d)){const errors=configurationGraphFindings(update.service,d,graph).filter(f=>f.level==='error');if(errors.length)throw new Error(errors.map(f=>f.detail).join(' '));}}
  this.setGraph(graph);return {changes:changed,nodeCount:graph.nodes.length,edgeCount:graph.edges.length,configuredNodes:args.updates.map((u:any)=>u.nodeId)};
 }
 security(args:any){
  if(!Array.isArray(args.policies)||!Array.isArray(args.roles)||args.policies.length>25||args.roles.length>25)throw new Error('Invalid library batch.');const graph=structuredClone(this.getGraph()),lib=graph.securityLibrary??emptySecurityLibrary();
  for(const p of args.policies){let policy:any;if(p.managedPolicyId){const snapshot=managedPolicySnapshots.find(s=>s.id===p.managedPolicyId);if(!snapshot||p.kind!=='identity')throw new Error('Managed snapshot must be a known identity policy.');policy={id:p.id,name:p.name,kind:'identity',document:JSON.stringify(snapshot.document,null,2),managedPolicyId:snapshot.id,source:{title:snapshot.name,url:snapshot.sourceUrl,verified:snapshot.verified}};}else{if(typeof p.document!=='string')throw new Error('Custom policy requires JSON text.');policy={id:p.id,name:p.name,kind:p.kind,document:p.document};}
   const i=lib.policies.findIndex(x=>x.id===p.id);if(i<0)lib.policies.push(policy);else lib.policies[i]=policy;
  }
  for(const r of args.roles){const role={id:r.id,name:r.name,policyIds:r.policyIds,sessionPolicyIds:r.sessionPolicyIds,...(r.trustPolicyId?{trustPolicyId:r.trustPolicyId}:{}),...(r.boundaryPolicyId?{boundaryPolicyId:r.boundaryPolicyId}:{})};const i=lib.roles.findIndex(x=>x.id===r.id);if(i<0)lib.roles.push(role);else lib.roles[i]=role;}
  const errors=validateSecurityLibrary(lib);if(errors.length)throw new Error(errors.join(' '));graph.securityLibrary=lib;const checked=validateReviewGraph(graph);if(!checked.ok)throw new Error(checked.error);this.setGraph(graph);return {changes:['Update security library: '+args.policies.length+' policies, '+args.roles.length+' roles'],nodeCount:graph.nodes.length,edgeCount:graph.edges.length};
 }
}
