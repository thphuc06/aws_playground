import {it,expect,describe} from 'vitest';
import {previewVpcConversion,convertVpcNode} from './vpcFrameConversion';
import {validateReviewGraph,type Graph} from './architectureReview';
import {validateTopology} from './networkTopology';
const doc=(values:Record<string,unknown>)=>({schemaVersion:2,values,legacyNotes:{}});
function legacy(extra:Partial<Graph>={}):Graph{
 return {version:1,configs:{},
  nodes:[{id:'net',service:'vpc',label:'Shop VPC',position:{x:100,y:100}},{id:'fn',service:'lambda',label:'Orders',position:{x:900,y:100}}],
  edges:[{id:'e1',source:'fn',target:'net'}],
  architecture:{relationships:{e1:'network'},nodes:{
   net:doc({cidr:'10.0.0.0/16',dnsSupport:true,flowLogs:true,
    subnets:[{id:'app',cidr:'10.0.1.0/24',availabilityZone:'us-east-1a',purpose:'private'},{id:'web',cidr:'10.0.2.0/24'}],
    routes:[{subnetId:'app',destination:'0.0.0.0/0',targetType:'nat-gateway',targetId:'nat-1'},{subnetId:'app',destination:'192.0.2.0/24',targetType:'vpc-peering',targetId:'pcx-1'}],
    securityRules:[{direction:'ingress',protocol:'tcp',fromPort:443,toPort:443,peerType:'cidr-ipv4',peer:'0.0.0.0/0'},{protocol:'tcp',fromPort:22}],
    networkAclRules:[{ruleNumber:100,direction:'ingress',action:'allow',cidr:'0.0.0.0/0',protocol:'tcp',portRange:'443'}]}),
   fn:doc({vpc:{type:'node',id:'net'}})}} as any,
  ...extra};
}
describe('VPC node → frame conversion',()=>{
 it('previews every carried setting, generated resource, rewritten reference and removed connection',()=>{
  const p=previewVpcConversion(legacy(),'net');
  expect(p.target).toEqual({kind:'new'});expect(p.frame).toEqual({name:'Shop VPC',cidr:'10.0.0.0/16',dnsSupport:true,flowLogs:true});
  expect(p.subnets).toEqual([{name:'app (private)',cidr:'10.0.1.0/24',availabilityZone:'us-east-1a'},{name:'web',cidr:'10.0.2.0/24'}]);
  expect(p.resources.map(r=>r.kind)).toEqual(['route-table','security-group','network-acl']);
  expect(p.resources[0].detail).toContain('1 unsupported rows');expect(p.resources[1].detail).toContain('1 rows without a direction');
  expect(p.references).toEqual([{nodeId:'fn',label:'Orders',field:'vpc'}]);expect(p.removedConnections).toEqual(['Orders → Shop VPC']);expect(p.conflicts).toEqual([]);
 });
 it('creates a VPC frame with nested subnets and reviewable resources, repoints references and removes the node',()=>{
  const before=legacy(),g=convertVpcNode(before,'net');
  expect(g.nodes.map(n=>n.id)).toEqual(['fn']);expect(g.edges).toEqual([]);expect(g.architecture!.nodes.net).toBeUndefined();expect(g.architecture!.relationships.e1).toBeUndefined();
  const t=g.network!,vpc=t.frames.find(f=>f.kind==='vpc')!;
  expect(vpc).toMatchObject({name:'Shop VPC',cidr:'10.0.0.0/16',dnsSupport:true,flowLogs:true,x:100,y:100});
  const subnets=t.frames.filter(f=>f.kind==='subnet');expect(subnets.map(s=>[s.name,s.cidr,s.parentId])).toEqual([['app (private)','10.0.1.0/24',vpc.id],['web','10.0.2.0/24',vpc.id]]);
  for(const s of subnets){expect(s.x).toBeGreaterThanOrEqual(vpc.x);expect(s.x+s.width).toBeLessThanOrEqual(vpc.x+vpc.width);expect(s.y+s.height).toBeLessThanOrEqual(vpc.y+vpc.height);}
  const routes=t.resources.find(r=>r.kind==='route-table')!;expect(routes.assignedTo).toEqual([subnets[0].id]);expect(routes.values.routes).toEqual([{targetType:'nat-gateway',destination:'0.0.0.0/0',target:'nat-1'}]);
  expect(t.resources.find(r=>r.kind==='security-group')).toMatchObject({assignedTo:[],values:{inbound:[{protocol:'TCP',ports:'443',peerType:'CIDR',peer:'0.0.0.0/0'}],outbound:[]}});
  expect(t.resources.find(r=>r.kind==='network-acl')).toMatchObject({assignedTo:[],values:{inbound:[{number:100,action:'allow',protocol:'TCP',ports:'443',peer:'0.0.0.0/0'}]}});
  expect((g.architecture!.nodes.fn as any).values.vpc).toEqual({type:'frame',id:vpc.id});
  expect(validateReviewGraph(g,'stored-editable').ok).toBe(true);expect(validateTopology(g.network,g.nodes.map(n=>n.id))).toEqual([]);
  expect(before.nodes).toHaveLength(2);
 });
 it('merges into a containing VPC frame only on request and blocks while settings differ',()=>{
  const frame={id:'main',kind:'vpc' as const,name:'Main',x:0,y:0,width:900,height:700,cidr:'10.9.0.0/16'};
  const g=legacy({network:{version:1,frames:[frame],membership:{net:'main'},resources:[]}});
  expect(previewVpcConversion(g,'net').existingCandidates).toEqual([{id:'main',name:'Main'}]);
  const blocked=previewVpcConversion(g,'net',{frameId:'main'});expect(blocked.conflicts[0]).toContain('cidr');expect(()=>convertVpcNode(g,'net',{frameId:'main'})).toThrow('cidr');
  const open=legacy({network:{version:1,frames:[{...frame,cidr:undefined}],membership:{net:'main'},resources:[]}});
  const merged=convertVpcNode(open,'net',{frameId:'main'});expect(merged.network!.frames.filter(f=>f.kind==='vpc')).toHaveLength(1);expect(merged.network!.frames[0]).toMatchObject({id:'main',cidr:'10.0.0.0/16',flowLogs:true});
  expect(merged.network!.frames.filter(f=>f.parentId==='main'&&f.kind==='subnet')).toHaveLength(2);
  expect(()=>convertVpcNode(legacy(),'net',{frameId:'main'})).toThrow('contains this node');expect(()=>convertVpcNode(legacy(),'fn')).toThrow('VPC service node');
 });
 it('binds the new frame to the canonical VPC resource the node represented',()=>{
  const g=legacy({version:2 as any,architecture:{relationships:{},nodes:{fn:doc({})}} as any,network:{version:2,frames:[],membership:{},resources:[],registry:{version:1,resources:[{id:'vpc-1',kind:'vpc',name:'Shop VPC',values:{cidr:'10.0.0.0/16'},context:{}}],serviceBindings:{net:{resource:{type:'local',id:'vpc-1',kind:'vpc'},subnets:[],securityGroups:[],networkInterfaces:[]} as any},frameBindings:{}}} as any});
  const p=previewVpcConversion(g,'net');expect(p.canonical).toBe(true);expect(p.resources).toEqual([]);
  const out=convertVpcNode(g,'net'),registry=out.network!.registry!,frame=out.network!.frames.find(f=>f.kind==='vpc')!;
  expect(registry.frameBindings[frame.id]).toEqual({type:'local',id:'vpc-1',kind:'vpc'});expect(registry.serviceBindings.net).toBeUndefined();expect(registry.resources).toHaveLength(1);
  // v2 placement lives in registry bindings, so service configuration has no VPC field to repoint.
  expect(out.nodes.map(n=>n.id)).toEqual(['fn']);expect(validateReviewGraph(out,'stored-editable').ok).toBe(true);
 });
});
