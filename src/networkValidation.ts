import type {NetworkTopology} from './networkTopology';
import type {ConfigurationFinding,JsonValue} from './configurationTypes';

export const networkEvidence={
 vpc:'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html',
 subnet:'https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html',
 sg:'https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html',
 nacl:'https://docs.aws.amazon.com/vpc/latest/userguide/nacl-rules.html',
 eni:'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html',
 route:'https://docs.aws.amazon.com/vpc/latest/userguide/subnet-route-tables.html',
};
export interface Cidr {family:4|6;prefix:number;first:bigint;last:bigint;canonical:string}
function ipv4(value:string):bigint|undefined {
 const parts=value.split('.');if(parts.length!==4||parts.some(p=>! /^(0|[1-9]\d{0,2})$/.test(p)||Number(p)>255))return;
 return parts.reduce((n,p)=>(n<<8n)+BigInt(p),0n);
}
function ipv6(value:string):bigint|undefined {
 if(value.includes('%')||!value.includes(':'))return;
 let s=value.toLowerCase();if(s.includes('.')){const i=s.lastIndexOf(':'),v=ipv4(s.slice(i+1));if(v===undefined)return;s=s.slice(0,i+1)+(v>>16n).toString(16)+':'+(v&65535n).toString(16);}
 const halves=s.split('::');if(halves.length>2)return;
 const left=halves[0]?halves[0].split(':'):[],right=halves.length===2&&halves[1]?halves[1].split(':'):[];
 if([...left,...right].some(p=>!/^[a-f0-9]{1,4}$/.test(p)))return;
 const count=left.length+right.length;if(halves.length===1&&count!==8||halves.length===2&&count>=8)return;
 return [...left,...Array(8-count).fill('0'),...right].reduce((n,p)=>(n<<16n)+BigInt('0x'+p),0n);
}
export function parseCidr(value:unknown):Cidr|undefined {
 if(typeof value!=='string')return;const parts=value.trim().split('/');if(parts.length!==2||! /^(0|[1-9]\d{0,2})$/.test(parts[1]))return;
 const family=parts[0].includes(':')?6:4,bits=family===4?32:128,prefix=Number(parts[1]);if(prefix>bits)return;
 const address=family===4?ipv4(parts[0]):ipv6(parts[0]);if(address===undefined)return;
 const size=1n<<BigInt(bits-prefix),first=address/size*size,last=first+size-1n;
 const canonical=family===4?[24n,16n,8n,0n].map(shift=>String(first>>shift&255n)).join('.')+'/'+prefix:Array.from({length:8},(_,i)=>(first>>BigInt((7-i)*16)&65535n).toString(16)).join(':')+'/'+prefix;
 return {family,prefix,first,last,canonical};
}
export const overlaps=(a:Cidr,b:Cidr)=>a.family===b.family&&a.first<=b.last&&b.first<=a.last;
export const containsCidr=(a:Cidr,b:Cidr)=>a.family===b.family&&a.first<=b.first&&a.last>=b.last;
export function cidrError(value:unknown,scope:'vpc'|'subnet'|'peer'='peer'):string|undefined {
 const c=parseCidr(value);if(!c)return 'Enter a valid IPv4 or IPv6 CIDR with a prefix length.';
 if(scope!=='peer'){
  if(c.family===4&&(c.prefix<16||c.prefix>28))return 'AWS VPC/subnet IPv4 CIDR prefixes must be /16 through /28.';
  if(c.family===6&&(c.prefix<44||c.prefix>(scope==='vpc'?60:64)||c.prefix%4!==0))return 'IPv6 '+scope+' allocation uses /44 through /'+(scope==='vpc'?60:64)+' in increments of 4; allocation source must also support the size.';
  if(scope==='vpc'&&c.family===4&&['0.0.0.0/8','127.0.0.0/8','169.254.0.0/16','224.0.0.0/4'].some(x=>overlaps(c,parseCidr(x)!)))return 'This IPv4 range is excluded from VPC CIDR allocation by AWS.';
 }
}
export function ownerVpc(t:NetworkTopology,id:string|undefined):string|undefined {
 const visited=new Set<string>();while(id&&!visited.has(id)){visited.add(id);const frame=t.frames.find(f=>f.id===id);if(!frame)return;if(frame.kind==='vpc')return frame.id;id=frame.parentId;}
}
const records=(value:unknown):Record<string,JsonValue>[]=>Array.isArray(value)?value.filter(x=>!!x&&typeof x==='object'&&!Array.isArray(x)):[];
export function trafficRuleErrors(row:Record<string,JsonValue>,nacl=false):string[]{
 const errors:string[]=[],protocol=String(row.protocol??'').toLowerCase(),peerType=String(row.peerType??'').toLowerCase();
 const peer=row.peer??row.cidr;if(peer!==undefined&&(nacl||['cidr','cidr-ipv4','cidr-ipv6'].includes(peerType))){const c=parseCidr(peer);if(!c)errors.push('Peer must be a valid CIDR (IPv4 /0–/32 or IPv6 /0–/128).');else if(peerType==='cidr-ipv4'&&c.family!==4||peerType==='cidr-ipv6'&&c.family!==6)errors.push('Peer CIDR family does not match the selected peer type.');}
 let from=row.fromPort,to=row.toPort;
 const raw=row.ports??row.portRange;if(typeof raw==='string'&&raw.trim()&&protocol!=='all'){
  const match=/^(-?\d+)(?:\s*[-,:/]\s*(-?\d+))?$/.exec(raw.trim());if(!match)errors.push('Use one port or start-end; for ICMP use type/code, with -1 for all.');else {from=Number(match[1]);to=match[2]===undefined?from:Number(match[2]);}
 }
 if(['tcp','udp'].includes(protocol)){
  for(const x of [from,to])if(x!==undefined&&(typeof x!=='number'||!Number.isInteger(x)||x<0||x>65535))errors.push('TCP/UDP ports must be integers from 0 through 65535.');
  if(typeof from==='number'&&typeof to==='number'&&from>to)errors.push('Port range start must not exceed its end.');
 }else if(['icmp','icmpv6'].includes(protocol)){
  for(const x of [from,to])if(x!==undefined&&(typeof x!=='number'||!Number.isInteger(x)||x< -1||x>255))errors.push('ICMP type and code must be integers from -1 through 255.');
  if(from===-1&&to!==undefined&&to!==-1)errors.push('All ICMP types (-1) require all codes (-1).');
 }
 if(!nacl&&typeof row.description==='string'&&(row.description.length>255||!/^[a-zA-Z0-9 ._\-:/()#,@\[\]+=;{}!$*]*$/.test(row.description)))errors.push('Security-group rule descriptions allow up to 255 characters from the documented AWS character set.');
 return [...new Set(errors)];
}
export function networkFindings(t:NetworkTopology|undefined,nodes:{id:string;service:string;label:string}[]=[]):ConfigurationFinding[]{
 if(!t)return [];const out:ConfigurationFinding[]=[];
 const add=(field:string,detail:string,sourceUrl:string,level:ConfigurationFinding['level']='error')=>out.push({field,title:'Network configuration',detail,sourceUrl,level,category:'design'});
 for(const f of t.frames){
  if(f.cidr){const issue=cidrError(f.cidr,f.kind==='vpc'?'vpc':f.kind==='subnet'?'subnet':'peer');if(issue)add(f.id,f.name+': '+issue,f.kind==='vpc'?networkEvidence.vpc:networkEvidence.subnet);}
  if(f.kind==='subnet'&&f.cidr){const vpc=t.frames.find(v=>v.id===ownerVpc(t,f.parentId)),child=parseCidr(f.cidr),parent=parseCidr(vpc?.cidr);if(child&&parent&&child.family===parent.family&&!containsCidr(parent,child))add(f.id,f.name+': subnet CIDR is outside '+vpc!.name+'.',networkEvidence.subnet);if(!vpc)add(f.id,f.name+': VPC context is unknown; subnet containment cannot be checked.',networkEvidence.subnet,'warning');}
 }
 const subnets=t.frames.filter(f=>f.kind==='subnet'&&f.cidr);
 for(let i=0;i<subnets.length;i++)for(let j=i+1;j<subnets.length;j++){const a=subnets[i],b=subnets[j],vpc=ownerVpc(t,a.parentId),ca=parseCidr(a.cidr),cb=parseCidr(b.cidr);if(vpc&&vpc===ownerVpc(t,b.parentId)&&ca&&cb&&overlaps(ca,cb))add(b.id,a.name+' and '+b.name+': subnet CIDRs overlap in the same VPC.',networkEvidence.subnet);}
 for(const r of t.resources){
  if(['security-group','network-acl'].includes(r.kind))for(const direction of ['inbound','outbound']){
   const seen=new Set<number>();for(const [i,row]of records(r.values[direction]).entries()){
    const path=r.id+'.'+direction+'.'+i;for(const message of trafficRuleErrors(row,r.kind==='network-acl'))add(path,r.name+': '+message,r.kind==='network-acl'?networkEvidence.nacl:networkEvidence.sg);
    if(r.kind==='network-acl'&&row.number!==undefined){const num=row.number;if(typeof num!=='number'||!Number.isInteger(num)||num<1||num>32766)add(path,r.name+': NACL rule number must be an integer from 1 through 32766.',networkEvidence.nacl);else {if(seen.has(num))add(path,r.name+': duplicate '+direction+' NACL rule number '+num+'.',networkEvidence.nacl);seen.add(num);}}
   }
  }
  if(r.kind==='route-table')for(const [i,row]of records(r.values.routes).entries())if(row.destination!==undefined&&!parseCidr(row.destination)&&!/^pl-[a-zA-Z0-9_-]+$/.test(String(row.destination))&&!t.resources.some(p=>p.kind==='prefix-list'&&p.id===row.destination))add(r.id+'.routes.'+i,r.name+': route destination must be a CIDR or prefix-list reference.',networkEvidence.route);
  if(r.kind==='prefix-list')for(const row of records(r.values.entries)){const c=parseCidr(row.cidr);if(row.cidr!==undefined&&(!c||r.values.addressFamily==='IPv4'&&c.family!==4||r.values.addressFamily==='IPv6'&&c.family!==6))add(r.id,r.name+': entry must match the prefix-list address family.',networkEvidence.sg);}
  const rvpc=ownerVpc(t,r.frameId);
  if(r.kind==='nat-gateway'){
   if(r.values.connectivity==='private'&&records(r.values.elasticIps).length)add(r.id,r.name+': a private NAT gateway cannot have Elastic IP allocations.','https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html');
   if(r.values.connectivity==='private'&&r.values.availabilityMode==='regional')add(r.id,r.name+': regional NAT supports public connectivity only.','https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html');
  }
  if(r.kind==='elastic-ip'&&r.assignedTo.length>1)add(r.id,r.name+': one Elastic IP cannot be associated with multiple targets simultaneously.','https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html');
  if(r.kind==='interface-endpoint'){
   const vpc=t.frames.find(f=>f.id===rvpc);if(r.values.privateDns===true&&(vpc?.dnsSupport===false||vpc?.dnsHostnames===false))add(r.id,r.name+': private DNS requires VPC DNS resolution and DNS hostnames.','https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html');
   const zones=new Set<string>();for(const id of r.assignedTo){const subnet=t.frames.find(f=>f.id===id&&f.kind==='subnet');if(subnet?.availabilityZone){if(zones.has(subnet.availabilityZone))add(r.id,r.name+': select at most one endpoint subnet per Availability Zone.','https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html');zones.add(subnet.availabilityZone);}}
  }
  for(const row of records(r.values.securityGroups)){if(typeof row.id==='string'&&t.resources.some(x=>x.id===row.id&&x.kind!=='security-group'))add(r.id,r.name+': security-group reference points to a different resource kind.',networkEvidence.sg);}
  for(const targetId of r.assignedTo){
   const target=t.resources.find(x=>x.id===targetId),node=nodes.find(n=>n.id===targetId),frame=t.frames.find(f=>f.id===targetId);
   const targetVpc=ownerVpc(t,target?.frameId??(frame?.id||t.membership[targetId]));
   if(['route-table','network-acl','gateway-endpoint','interface-endpoint'].includes(r.kind)&&rvpc&&targetVpc&&rvpc!==targetVpc)add(r.id,r.name+': association must stay within the same VPC.',networkEvidence.route);
   if(r.kind==='security-group'){
    if(node&&!['ec2','lambda','ecs','eks','elb','rds','aurora','elasticache','efs','opensearch'].includes(node.service)||target&&!['network-interface','interface-endpoint'].includes(target.kind))add(r.id,r.name+': incompatible security-group attachment target.',networkEvidence.eni);
    if(rvpc&&targetVpc&&rvpc!==targetVpc)out.push({field:r.id,title:'Unmodeled VPC association',detail:r.name+': attachment crosses VPCs. AWS requires a supported Security Group VPC Association; this editor cannot represent that association. Keep the assignment within its declared VPC.',sourceUrl:'https://docs.aws.amazon.com/vpc/latest/userguide/security-group-assoc.html',level:'error',category:'app-limit'});
   }
  }
 }
 return out;
}
