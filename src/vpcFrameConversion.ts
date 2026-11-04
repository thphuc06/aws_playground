import type {Graph} from './architectureReview';
import {validateReviewGraph} from './architectureReview';
import type {ConfigField,JsonValue} from './configurationTypes';
import {configurationFields,isConfigurationDocument,migrateConfiguration} from './configurationRegistry';
import {emptyTopology,type NetworkFrame,type NetworkResource} from './networkTopology';
import type {ResourceRef} from './resourceTypes';
import {synchronizeResourceViews} from './resourceProjection';
import {rows,groupRoutesBySubnet,mapRouteRows,mapAclRows,mapSecurityRuleRows} from './vpcRowMapping';
/**
 * Convert a legacy Amazon VPC service node into a VPC frame. A VPC is a network
 * boundary, not a request target, so the canvas models it as a frame (graph v1)
 * or a frame bound to a canonical VPC resource (graph v2).
 *
 * Nothing is merged silently: a conversion into an existing frame is blocked
 * while any setting differs, and rows that cannot be classified are reported.
 */
export interface VpcConversionTarget {frameId:string}
export interface VpcConversionPreview {
 nodeId:string;label:string;canonical:boolean;
 target:{kind:'new'}|{kind:'existing';frameId:string;name:string};
 frame:{name:string;cidr?:string;dnsSupport?:boolean;dnsHostnames?:boolean;flowLogs?:boolean;flowLogDestination?:NetworkFrame['flowLogDestination']};
 subnets:{name:string;cidr?:string;availabilityZone?:string}[];
 resources:{kind:'route-table'|'security-group'|'network-acl';name:string;detail:string}[];
 references:{nodeId:string;label:string;field:string}[];
 removedConnections:string[];
 existingCandidates:{id:string;name:string}[];
 conflicts:string[];notes:string[];
}
type Doc=Record<string,JsonValue>;
const isRecord=(v:unknown):v is Record<string,JsonValue>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const frameSettings=['cidr','dnsSupport','dnsHostnames','flowLogs','flowLogDestination'] as const;
const vpcFields=(f:ConfigField)=>f.kind==='resource'&&!!f.resourceServices?.includes('vpc');
/** Rewrite every VPC-capable resource reference to `from` (including inside table rows). */
function rewriteReferences(fields:ConfigField[],values:Doc,from:string,to:JsonValue,path='',hits:string[]=[]):Doc{
 let out=values;
 for(const f of fields){const value=values[f.key];if(value===undefined)continue;
  if(vpcFields(f)&&isRecord(value)&&value.type==='node'&&value.id===from){out=out===values?{...values}:out;out[f.key]=to;hits.push(path+f.key);}
  else if(f.kind==='table'&&Array.isArray(value)){let changed=false;const next=value.map((row,i)=>{if(!isRecord(row))return row;const r=rewriteReferences(f.itemFields??[],row,from,to,path+f.key+'.'+i+'.',hits);if(r!==row)changed=true;return r});if(changed){out=out===values?{...values}:out;out[f.key]=next;}}
 }
 return out;
}
const uniqueId=(base:string,taken:Set<string>)=>{let id=base,i=2;while(taken.has(id))id=base+'-'+i++;taken.add(id);return id};
function plan(graph:Graph,nodeId:string,target?:VpcConversionTarget){
 const node=graph.nodes.find(n=>n.id===nodeId);if(!node||node.service!=='vpc')throw new Error('Select a VPC service node to convert.');
 const t=graph.network??emptyTopology(),canonical=!!t.registry;
 const doc=migrateConfiguration('vpc',graph.architecture?.nodes[nodeId]??{}),v=doc.values as Doc;
 const label=node.label,notes:string[]=[],conflicts:string[]=[];
 const destination=isRecord(v.logDestination)&&(v.logDestination.type==='node'||v.logDestination.type==='external')&&typeof v.logDestination.id==='string'?{type:v.logDestination.type as 'node'|'external',id:v.logDestination.id}:undefined;
 const frame:VpcConversionPreview['frame']={name:label,...(typeof v.cidr==='string'?{cidr:v.cidr}:{}),...(typeof v.dnsSupport==='boolean'?{dnsSupport:v.dnsSupport}:{}),...(typeof v.dnsHostnames==='boolean'?{dnsHostnames:v.dnsHostnames}:{}),...(typeof v.flowLogs==='boolean'?{flowLogs:v.flowLogs}:{}),...(destination?{flowLogDestination:destination}:{})};
 if(isRecord(v.logDestination)&&!destination)notes.push('The log destination reference type is not carried to the frame; set it again in frame settings.');
 // Only a VPC frame that visually contains the node is offered for an explicit merge.
 const ownerFrames:NetworkFrame[]=[];let id:string|undefined=t.membership[nodeId];const seen=new Set<string>();while(id&&!seen.has(id)){seen.add(id);const f=t.frames.find(x=>x.id===id);if(!f)break;if(f.kind==='vpc')ownerFrames.push(f);id=f.parentId;}
 const existing=target?t.frames.find(f=>f.id===target.frameId):undefined;
 if(target&&(!existing||existing.kind!=='vpc'||!ownerFrames.some(f=>f.id===existing.id)))throw new Error('Choose a VPC frame that contains this node.');
 if(existing){
  for(const key of frameSettings){const a=(frame as Record<string,unknown>)[key],b=(existing as unknown as Record<string,unknown>)[key];if(a!==undefined&&b!==undefined&&JSON.stringify(a)!==JSON.stringify(b))conflicts.push(`${key}: node has ${JSON.stringify(a)}, frame "${existing.name}" has ${JSON.stringify(b)}. Make them match (or clear one) before merging.`);}
  if(canonical){const nodeRef=t.registry!.serviceBindings[nodeId]?.resource,frameRef=t.registry!.frameBindings[existing.id];if(nodeRef&&frameRef&&JSON.stringify(nodeRef)!==JSON.stringify(frameRef))conflicts.push('The node and the frame represent different canonical VPC resources. Resolve that in Canonical network resources first.');}
 }
 const subnetRows=rows(v.subnets),subnets=subnetRows.map((row,i)=>({name:[typeof row.id==='string'&&row.id.trim()?row.id:'Subnet '+(i+1),typeof row.purpose==='string'&&row.purpose?'('+row.purpose+')':''].filter(Boolean).join(' ').slice(0,120),...(typeof row.cidr==='string'?{cidr:row.cidr}:{}),...(typeof row.availabilityZone==='string'?{availabilityZone:row.availabilityZone}:{})}));
 const resources:VpcConversionPreview['resources']=[];
 if(canonical){if(subnetRows.length||rows(v.routes).length||rows(v.securityRules).length||rows(v.networkAclRules).length)notes.push('In a canonical workspace, subnet/route/rule rows were already migrated to canonical resources; they are not duplicated.');}
 else{
  for(const [subnetId,group]of groupRoutesBySubnet(v.routes)){const mapped=mapRouteRows(group,(_type,targetId)=>targetId);resources.push({kind:'route-table',name:`${label} routes${subnetId?' · '+subnetId:''}`,detail:`${mapped.routes.length} routes${subnetId?', associated with subnet '+subnetId:', no subnet association'}${mapped.excluded?`; ${mapped.excluded} unsupported rows are not carried over`:''}`});}
  const sg=mapSecurityRuleRows(v.securityRules,(_type,peer)=>peer);if(sg.values.inbound.length+sg.values.outbound.length+sg.unclassified)resources.push({kind:'security-group',name:`${label} rules (review)`,detail:`${sg.values.inbound.length} inbound, ${sg.values.outbound.length} outbound; not attached to any workload${sg.unclassified?`; ${sg.unclassified} rows without a direction are not carried over`:''}`});
  const acl=mapAclRows(v.networkAclRules);if(acl.values.inbound.length+acl.values.outbound.length+acl.excluded)resources.push({kind:'network-acl',name:`${label} NACL (review)`,detail:`${acl.values.inbound.length} inbound, ${acl.values.outbound.length} outbound; choose subnet associations yourself${acl.excluded?`; ${acl.excluded} rows without a direction are not carried over`:''}`});
 }
 const references:VpcConversionPreview['references']=[];
 for(const n of graph.nodes){if(n.id===nodeId)continue;const raw=graph.architecture?.nodes[n.id];if(!isConfigurationDocument(raw))continue;const hits:string[]=[];rewriteReferences(configurationFields[n.service]??[],raw.values as Doc,nodeId,null,'',hits);for(const field of hits)references.push({nodeId:n.id,label:n.label,field});}
 const name=(id:string)=>graph.nodes.find(n=>n.id===id)?.label??id;
 const removedConnections=graph.edges.filter(e=>e.source===nodeId||e.target===nodeId).map(e=>name(e.source)+' → '+name(e.target));
 if(removedConnections.length)notes.push('A VPC is not a request target, so connections to it are removed. Attach workloads to subnets and security groups instead.');
 if(t.resources.some(r=>r.assignedTo.includes(nodeId)))notes.push('Network resource assignments to this node are removed.');
 return {node,t,canonical,doc,v,existing,ownerFrames,preview:{nodeId,label,canonical,target:existing?{kind:'existing' as const,frameId:existing.id,name:existing.name}:{kind:'new' as const},frame,subnets,resources,references,removedConnections,existingCandidates:ownerFrames.map(f=>({id:f.id,name:f.name})),conflicts,notes}};
}
export function previewVpcConversion(graph:Graph,nodeId:string,target?:VpcConversionTarget):VpcConversionPreview{return plan(graph,nodeId,target).preview}
export function convertVpcNode(graph:Graph,nodeId:string,target?:VpcConversionTarget):Graph{
 const {node,t,canonical,v,existing,ownerFrames,preview}=plan(graph,nodeId,target);
 if(preview.conflicts.length)throw new Error(preview.conflicts.join(' '));
 const next=structuredClone(graph),topology=structuredClone(t);next.network=topology;
 const taken=new Set([...graph.nodes.map(n=>n.id),...topology.frames.map(f=>f.id),...topology.resources.map(r=>r.id),...(topology.registry?.resources.map(r=>r.id)??[])]);
 // 1. The VPC frame: reuse the chosen one or create one where the node was.
 const cols=2,subnetW=300,subnetH=200,gap=40,rowsNeeded=Math.ceil(preview.subnets.length/cols);
 let vpcFrame:NetworkFrame;
 if(existing){vpcFrame=topology.frames.find(f=>f.id===existing.id)!;for(const key of frameSettings){const value=(preview.frame as Record<string,unknown>)[key];if(value!==undefined&&(vpcFrame as unknown as Record<string,unknown>)[key]===undefined)(vpcFrame as unknown as Record<string,unknown>)[key]=value;}}
 else{
  const parent=t.frames.find(f=>f.id===t.membership[nodeId]&&!['vpc','subnet'].includes(f.kind));
  const {name:_name,...settings}=preview.frame;
  vpcFrame={id:uniqueId('frame-vpc-'+nodeId,taken),kind:'vpc',name:preview.label.slice(0,120)||'Application VPC',x:node.position.x,y:node.position.y,width:Math.max(700,cols*subnetW+(cols+1)*gap),height:Math.max(460,90+rowsNeeded*(subnetH+gap)+gap),...(parent?{parentId:parent.id}:{}),...(canonical?{}:settings)};
  topology.frames.push(vpcFrame);
 }
 // 2. Canonical: the frame shows the same VPC resource the node represented.
 if(canonical){const registry=topology.registry!;const binding=registry.serviceBindings[nodeId];let ref:ResourceRef|undefined=binding?.resource?.kind==='vpc'?binding.resource:undefined;
  if(!ref&&existing)ref=registry.frameBindings[existing.id];
  if(!ref){const id=uniqueId('resource-vpc-'+nodeId,taken);registry.resources.push({id,kind:'vpc',name:preview.label,values:{...(typeof v.cidr==='string'?{cidr:v.cidr}:{})},context:{}} as never);ref={type:'local',id,kind:'vpc'};}
  registry.frameBindings[vpcFrame.id]=ref!;delete registry.serviceBindings[nodeId];
 }else{
  // 3. Legacy rows become subnet frames and reviewable network resources.
  const subnetIds=new Map<string,string>();
  rows(v.subnets).forEach((row,i)=>{const s=preview.subnets[i],id=uniqueId('frame-subnet-'+nodeId+'-'+(i+1),taken);if(typeof row.id==='string'&&row.id.trim())subnetIds.set(row.id,id);topology.frames.push({id,kind:'subnet',name:s.name,x:vpcFrame.x+gap+(i%cols)*(subnetW+gap),y:vpcFrame.y+70+Math.floor(i/cols)*(subnetH+gap),width:subnetW,height:subnetH,parentId:vpcFrame.id,...(s.cidr?{cidr:s.cidr}:{}),...(s.availabilityZone?{availabilityZone:s.availabilityZone}:{})});});
  const add=(kind:NetworkResource['kind'],name:string,values:Record<string,JsonValue>,assignedTo:string[]=[])=>topology.resources.push({id:uniqueId(kind+'-'+nodeId,taken),kind,name:name.slice(0,120),frameId:vpcFrame.id,assignedTo,values});
  for(const [subnetId,group]of groupRoutesBySubnet(v.routes)){const mapped=mapRouteRows(group,(_type,targetId)=>targetId),subnet=subnetIds.get(subnetId)??topology.frames.find(f=>f.kind==='subnet'&&f.id===subnetId)?.id;add('route-table',`${preview.label} routes${subnetId?' · '+subnetId:''}`,{routes:mapped.routes},subnet?[subnet]:[]);}
  const sg=mapSecurityRuleRows(v.securityRules,(_type,peer)=>peer);if(sg.values.inbound.length+sg.values.outbound.length)add('security-group',`${preview.label} rules (review)`,sg.values);
  const acl=mapAclRows(v.networkAclRules);if(acl.values.inbound.length+acl.values.outbound.length)add('network-acl',`${preview.label} NACL (review)`,acl.values);
 }
 // 4. Remove the node, its connections and per-node state; repoint references.
 const removed=new Set(graph.edges.filter(e=>e.source===nodeId||e.target===nodeId).map(e=>e.id));
 next.nodes=next.nodes.filter(n=>n.id!==nodeId);next.edges=next.edges.filter(e=>!removed.has(e.id));
 for(const id of removed){delete next.configs[id];if(next.edgeLayouts)delete next.edgeLayouts[id];if(next.architecture)delete next.architecture.relationships[id];}
 for(const map of ['lambdaConfigs','apiConfigs','eventBridgeConfigs','learningConfigs'] as const)if(next[map])delete (next[map] as Record<string,unknown>)[nodeId];
 delete topology.membership[nodeId];for(const r of topology.resources)r.assignedTo=r.assignedTo.filter(id=>id!==nodeId);
 if(next.architecture){delete next.architecture.nodes[nodeId];
  const to:JsonValue=canonical?{type:'canonical',id:(topology.registry!.frameBindings[vpcFrame.id] as {id:string}).id}:{type:'frame',id:vpcFrame.id};
  for(const n of next.nodes){const raw=next.architecture.nodes[n.id];if(!isConfigurationDocument(raw))continue;const values=rewriteReferences(configurationFields[n.service]??[],raw.values as Doc,nodeId,to);if(values!==raw.values)next.architecture.nodes[n.id]={...raw,values} as typeof raw;}
 }
 void ownerFrames;
 // Canonical views (frames/resources projected from the registry) must be refreshed atomically.
 if(canonical)next.network=synchronizeResourceViews(topology);
 const checked=validateReviewGraph(next,'stored-editable');if(!checked.ok)throw new Error('The converted diagram did not pass validation: '+checked.error);
 return checked.graph;
}
