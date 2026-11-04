import type {JsonValue} from './configurationTypes';
/**
 * Row conversions from a legacy VPC service node into network resources.
 * Shared by the v1→v2 canonical migration and the VPC node → frame conversion
 * so both preserve the same rows and report the same unclassified ones.
 */
type Row=Record<string,JsonValue>;
export const rows=(v:unknown):Row[]=>Array.isArray(v)?v.filter(x=>!!x&&typeof x==='object'&&!Array.isArray(x)) as Row[]:[];
export const routeTargetTypes=['internet-gateway','nat-gateway','gateway-endpoint','local'] as const;
/** Routes grouped by their subnetId ('' when unspecified). */
export function groupRoutesBySubnet(value:unknown):Map<string,Row[]>{const groups=new Map<string,Row[]>();for(const row of rows(value)){const key=typeof row.subnetId==='string'?row.subnetId:'';groups.set(key,[...groups.get(key)??[],row]);}return groups;}
/** Supported route rows; `resolveTarget` maps a non-local targetId to the caller's reference form. */
export function mapRouteRows(group:Row[],resolveTarget:(targetType:string,id:string)=>JsonValue|undefined):{routes:Row[];excluded:number}{
 const routes:Row[]=[];let excluded=0;
 for(const row of group){const targetType=String(row.targetType??'');if(!(routeTargetTypes as readonly string[]).includes(targetType)){excluded++;continue;}const converted:Row={targetType};if(row.destination!==undefined)converted.destination=row.destination;if(typeof row.targetId==='string'&&row.targetId.trim()){const target=targetType==='local'?row.targetId:resolveTarget(targetType,row.targetId);if(target!==undefined)converted.target=target;}routes.push(converted);}
 return {routes,excluded};
}
const direction=(row:Row)=>row.direction==='ingress'?'inbound':row.direction==='egress'?'outbound':undefined;
/** NACL rows split into inbound/outbound; rows without a direction are counted, not guessed. */
export function mapAclRows(value:unknown):{values:{inbound:Row[];outbound:Row[]};excluded:number}{
 const values={inbound:[] as Row[],outbound:[] as Row[]};let excluded=0;
 for(const row of rows(value)){const side=direction(row);if(!side){excluded++;continue;}const converted:Row={};if(row.ruleNumber!==undefined)converted.number=row.ruleNumber;if(row.action!==undefined)converted.action=row.action;if(typeof row.protocol==='string')converted.protocol=row.protocol.toUpperCase();if(row.portRange!==undefined)converted.ports=row.portRange;if(row.cidr!==undefined)converted.peer=row.cidr;values[side].push(converted);}
 return {values,excluded};
}
/** Inline security rules as a security-group's inbound/outbound rules; `resolvePeer` maps group/prefix-list peers. */
export function mapSecurityRuleRows(value:unknown,resolvePeer:(peerType:string,id:string)=>JsonValue|undefined):{values:{inbound:Row[];outbound:Row[]};unclassified:number}{
 const values={inbound:[] as Row[],outbound:[] as Row[]};let unclassified=0;
 for(const row of rows(value)){const side=direction(row);if(!side){unclassified++;continue;}const rule:Row={};if(typeof row.protocol==='string')rule.protocol=row.protocol.toUpperCase();if(typeof row.fromPort==='number'){const icmp=String(row.protocol??'').startsWith('icmp');rule.ports=String(row.fromPort)+(row.toPort!==undefined&&(icmp||row.toPort!==row.fromPort)?(icmp?'/':'-')+row.toPort:'');}if(typeof row.peer==='string'){rule.peerType=['cidr-ipv4','cidr-ipv6'].includes(String(row.peerType))?'CIDR':String(row.peerType??'CIDR');rule.peer=['security-group','prefix-list'].includes(String(row.peerType))?resolvePeer(String(row.peerType),row.peer) as JsonValue:row.peer;}else if(typeof row.cidr==='string'){rule.peerType='CIDR';rule.peer=row.cidr;}if(typeof row.description==='string')rule.description=row.description;values[side].push(rule);}
 return {values,unclassified};
}
