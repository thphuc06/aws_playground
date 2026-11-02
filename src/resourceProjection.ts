import type {Graph} from './architectureReview';
import type {NetworkTopology,NetworkResource,NetworkFrame} from './networkTopology';
import {networkFindings} from './networkValidation';
import type {ConfigurationFinding,JsonValue} from './configurationTypes';
import {isResourceRef,resourceVpc,resourceValuesForLegacy,resourceResolutionIssues} from './resourceRegistry';
import type {ResourceRegistry,CanonicalResource,ResourceRef} from './resourceTypes';

const local=(ref:ResourceRef|undefined)=>ref?.type==='local'?ref.id:undefined;
const refs=(value:JsonValue|undefined)=>Array.isArray(value)?value:[];
/** A temporary semantic view for existing bounded checks. It never changes visual geometry. */
export function canonicalValidationTopology(registry:ResourceRegistry):NetworkTopology {
 const frames:NetworkFrame[]=registry.resources.filter(r=>r.kind==='vpc'||r.kind==='subnet').map((r,i)=>({id:r.id,kind:r.kind as 'vpc'|'subnet',name:r.name,x:i*900,y:0,width:800,height:600,...(r.kind==='subnet'&&local(resourceVpc(registry,r.owner))?{parentId:local(resourceVpc(registry,r.owner))}:{}),...(typeof r.values.cidr==='string'?{cidr:r.values.cidr}:{}),...(typeof r.context.region==='string'?{region:r.context.region}:{}),...(typeof r.context.availabilityZone==='string'?{availabilityZone:r.context.availabilityZone}:{}),...Object.fromEntries(['dnsSupport','dnsHostnames','autoAssignPublicIpv4'].filter(k=>typeof r.values[k]==='boolean').map(k=>[k,r.values[k]]))}));
 const membership=Object.fromEntries(Object.entries(registry.serviceBindings).flatMap(([node,b])=>{const ref=b.subnets.find(s=>s.type==='local')??b.vpc;return ref?.type==='local'?[[node,ref.id]]:[];}));
 const resources:NetworkResource[]=registry.resources.filter(r=>r.kind!=='vpc'&&r.kind!=='subnet').map(r=>{
  const values=resourceValuesForLegacy(r.values) as Record<string,JsonValue>;delete values.attachments;
  const own=r.owner?.type==='local'?registry.resources.find(x=>x.id===r.owner!.id):undefined;const ownerId=own?.kind==='subnet'||own?.kind==='vpc'?own.id:local(resourceVpc(registry,r.owner));
  const assigned=new Set<string>(refs(r.values.attachments).flatMap(ref=>ref&&typeof ref==='object'&&!Array.isArray(ref)&&typeof ref.id==='string'&&(ref.type==='local'||ref.type==='service')?[ref.id]:[]));
  if(r.kind==='security-group')for(const [node,b]of Object.entries(registry.serviceBindings))if(b.securityGroups.some(ref=>ref.type==='local'&&ref.id===r.id))assigned.add(node);
  if(r.kind==='network-interface')for(const [node,b]of Object.entries(registry.serviceBindings))if(b.networkInterfaces.some(ref=>ref.type==='local'&&ref.id===r.id))assigned.add(node);
  return {id:r.id,kind:r.kind as NetworkResource['kind'],name:r.name,...(ownerId?{frameId:ownerId}:{}),assignedTo:[...assigned],values};
 });return {version:1,frames,membership,resources};
}
export function canonicalNetworkFindings(t:NetworkTopology,nodes:{id:string;service:string;label:string}[]):ConfigurationFinding[]{
 const registry=t.registry!;const findings=networkFindings(canonicalValidationTopology(registry),nodes);
 for(const issue of resourceResolutionIssues(registry))findings.push({ruleId:'resource.reference.'+issue.status,field:issue.id+'.'+issue.path,level:issue.status==='external'?'info':'error',category:issue.status==='external'?'unknown':'structure',title:issue.status==='external'?'Needs context':'Resource reference',detail:issue.message,context:{id:issue.id,path:issue.path}});
 for(const [node,b]of Object.entries(registry.serviceBindings)){
  const declared=[...(b.vpc?[b.vpc]:[]),...b.subnets.map(ref=>resourceVpc(registry,ref)).filter((ref):ref is ResourceRef=>!!ref)];const ids=[...new Set(declared.filter(ref=>ref.type==='local').map(ref=>ref.id))];if(ids.length>1)findings.push({ruleId:'resource.binding.vpc-conflict',field:node+'.subnets',level:'error',category:'design',title:'Conflicting declared VPCs',detail:'The selected subnet resources and explicit VPC describe different local VPCs. Resolve the placement rather than inferring it from diagram position.',context:{vpcs:ids.sort()}});
 }
 for(const c of registry.migration?.conflicts??[])if(c.status==='unresolved')findings.push({ruleId:'resource.migration.'+c.kind,field:'migration.'+c.id,level:'warning',category:'unknown',title:'Migration decision pending',detail:c.message,context:{conflict:c.id}});
 return findings;
}
/** `resources` is a checked compatibility projection. Registry data is authoritative. */
export function synchronizeResourceViews(topology:NetworkTopology):NetworkTopology {
 if(!topology.registry)return topology;const registry=topology.registry,validation=canonicalValidationTopology(registry);
 const frames=topology.frames.map(frame=>{
  const {cidr,region,availabilityZone,dnsSupport,dnsHostnames,autoAssignPublicIpv4,...visual}=frame;const ref=registry.frameBindings[frame.id],resource=ref?.type==='local'?registry.resources.find(r=>r.id===ref.id):undefined;
  if(!resource)return visual;
  return {...visual,name:resource.name,...(typeof resource.values.cidr==='string'?{cidr:resource.values.cidr}:{}),...resource.context.region?{region:resource.context.region}:{},...resource.context.availabilityZone?{availabilityZone:resource.context.availabilityZone}:{},...Object.fromEntries(['dnsSupport','dnsHostnames','autoAssignPublicIpv4'].filter(k=>typeof resource.values[k]==='boolean').map(k=>[k,resource.values[k]]))};
 });
 return {...topology,version:2,frames,resources:validation.resources};
}
export function withResourceRegistry(graph:Graph,registry:ResourceRegistry):Graph {
 const next=structuredClone(graph);next.version=2;next.network=synchronizeResourceViews({...next.network??{version:1,frames:[],resources:[],membership:{}},registry,version:2});return next;
}
export function boundResourceForNode(graph:Pick<Graph,'network'>,nodeId:string):CanonicalResource|undefined {const r=graph.network?.registry,ref=r?.serviceBindings[nodeId]?.resource;return ref?.type==='local'?r?.resources.find(x=>x.id===ref.id):undefined;}
export function registryResourceForVisualFrame(topology:NetworkTopology,frameId:string):CanonicalResource|undefined {const ref=topology.registry?.frameBindings[frameId];return ref?.type==='local'?topology.registry?.resources.find(r=>r.id===ref.id):undefined;}
