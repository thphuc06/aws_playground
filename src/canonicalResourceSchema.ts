import type {ConfigField} from './configurationTypes';
import type {CanonicalResourceKind} from './resourceTypes';
import {networkResourceFields} from './networkTopology';
export function canonicalFields(kind:CanonicalResourceKind):ConfigField[]{
 if(kind!=='vpc'&&kind!=='subnet')return networkResourceFields[kind].filter(field=>kind!=='elastic-ip'||field.key!=='association');
 const field=(key:string,label:string,type:ConfigField['kind'],help:string,url?:string):ConfigField=>({key,label,kind:type,section:'networking',help,source:{title:'VPC and subnet configuration',url:url??'https://docs.aws.amazon.com/vpc/latest/userguide/'+(kind==='vpc'?'vpc-cidr-blocks.html':'subnet-sizing.html'),verified:'2026-11-02'}});
 return [field('cidr','CIDR','text','Declared primary address range. Existing bounded CIDR/containment checks apply; secondary CIDRs, IPAM and actual account state are not inferred.'),...(kind==='vpc'?[field('dnsSupport','DNS resolution','boolean','Declared VPC DNS resolution setting; unknown does not imply enabled.','https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns-updating.html'),field('dnsHostnames','DNS hostnames','boolean','Declared VPC DNS hostnames setting.','https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns-updating.html')]:[field('autoAssignPublicIpv4','Auto-assign public IPv4','boolean','A subnet launch preference does not by itself create internet routing.','https://docs.aws.amazon.com/vpc/latest/userguide/subnet-public-ip.html')])];
}
export const canonicalTypedReferencePaths={
 'security-group':['inbound[].peer / outbound[].peer when peerType is security-group or prefix-list'],
 'network-interface':['securityGroups[].id'],
 'interface-endpoint':['securityGroups[].id'],
 'nat-gateway':['elasticIps[].allocationId'],
 'route-table':['routes[].target for a modeled targetType'],
 'vpn-connection':['customerGateway','targetGateway'],
 'transit-gateway':['attachments[].resourceId','attachments[].routeTableId'],
 common:['owner','associations[]','serviceBindings.*','frameBindings.*'],
};
