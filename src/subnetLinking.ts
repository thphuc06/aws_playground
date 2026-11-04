import type {Graph} from './architectureReview';
import {parseCidr,overlaps,containsCidr,ownerVpc} from './networkValidation';
const ipv4=(value:bigint)=>[24n,16n,8n,0n].map(shift=>String(value>>shift&255n)).join('.');
/**
 * First free IPv4 block inside a VPC range that does not overlap existing
 * subnets: /24 for /16–/20 VPCs, otherwise two bits smaller (never past /28).
 * IPv6 and invalid ranges return undefined; the user then enters a CIDR.
 */
export function suggestSubnetCidr(vpcCidr:unknown,taken:readonly unknown[]):string|undefined{
 const vpc=parseCidr(vpcCidr);if(!vpc||vpc.family!==4||vpc.prefix>26)return;
 const prefix=vpc.prefix<=20?24:Math.min(28,vpc.prefix+2),size=1n<<BigInt(32-prefix),used=taken.map(parseCidr).filter((c):c is NonNullable<typeof c>=>!!c);
 const blocks=Math.min(4096,2**(prefix-vpc.prefix));
 for(let i=0;i<blocks;i++){const first=vpc.first+BigInt(i)*size,candidate=parseCidr(ipv4(first)+'/'+prefix)!;if(containsCidr(vpc,candidate)&&!used.some(c=>overlaps(c,candidate)))return candidate.canonical;}
}
/**
 * When a subnet frame is newly placed inside a VPC frame (directly or through an
 * AZ frame), keep that link visible and give an empty subnet a CIDR from the VPC
 * range. Existing CIDRs are never rewritten; mismatches stay validation findings.
 * Canonical (registry) workspaces bind resources explicitly, so they are untouched.
 */
export function linkSubnetsToVpc(before:Graph,after:Graph):{graph:Graph;notes:string[]}{
 const t=after.network;if(!t||t.registry)return {graph:after,notes:[]};
 const old=before.network,notes:string[]=[];let frames=t.frames;
 for(const subnet of t.frames){
  if(subnet.kind!=='subnet')continue;
  const vpcId=ownerVpc(t,subnet.parentId);if(!vpcId||old&&!old.registry&&ownerVpc(old,old.frames.find(f=>f.id===subnet.id)?.parentId)===vpcId)continue;
  const vpc=t.frames.find(f=>f.id===vpcId)!;
  if(subnet.cidr){notes.push(`${subnet.name} is now in ${vpc.name}.`);continue;}
  const siblings=frames.filter(f=>f.kind==='subnet'&&f.id!==subnet.id&&ownerVpc(t,f.parentId)===vpcId).map(f=>f.cidr);
  const cidr=suggestSubnetCidr(vpc.cidr,siblings);
  if(!cidr){notes.push(`${subnet.name} is now in ${vpc.name}.${vpc.cidr?'':' Set the VPC CIDR to suggest subnet ranges.'}`);continue;}
  frames=frames.map(f=>f.id===subnet.id?{...f,cidr}:f);notes.push(`${subnet.name} is now in ${vpc.name} and uses ${cidr} from ${vpc.cidr}. Edit it in frame settings if needed.`);
 }
 return {graph:frames===t.frames?after:{...after,network:{...t,frames}},notes};
}
/** Name of the VPC that owns a frame, for showing the link on the canvas. */
export function owningVpcName(g:Graph,frameId:string):string|undefined{const t=g.network;if(!t)return;const frame=t.frames.find(f=>f.id===frameId);if(!frame||frame.kind==='vpc')return;const id=ownerVpc(t,frame.parentId);return id?t.frames.find(f=>f.id===id)?.name:undefined}
