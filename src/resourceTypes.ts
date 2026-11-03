import type {JsonValue} from './configurationTypes';
export const canonicalResourceKinds=['vpc','subnet','security-group','route-table','network-acl','internet-gateway','nat-gateway','interface-endpoint','gateway-endpoint','egress-only-gateway','vpn-connection','customer-gateway','virtual-private-gateway','transit-gateway','prefix-list','elastic-ip','network-interface'] as const;
export type CanonicalResourceKind=typeof canonicalResourceKinds[number];
export interface ResourceContext {partition?:string;accountId?:string;region?:string;availabilityZone?:string}
export type ResourceRef={type:'local';kind:CanonicalResourceKind;id:string}|{type:'external';kind:CanonicalResourceKind;id:string;context?:ResourceContext};
export type ResourceAssociation=ResourceRef|{type:'service';id:string};
export interface CanonicalResource {id:string;kind:CanonicalResourceKind;name:string;context:ResourceContext;owner?:ResourceRef;values:Record<string,JsonValue>;associations?:ResourceAssociation[];sourceKey?:string}
export interface ServiceResourceBinding {resource?:ResourceRef;vpc?:ResourceRef;subnets:ResourceRef[];securityGroups:ResourceRef[];networkInterfaces:ResourceRef[]}
export interface ResourceMigrationConflict {id:string;kind:'possible-duplicate'|'placement'|'inline-security-group'|'unresolved-reference';message:string;resourceIds:string[];nodeId?:string;field?:'vpc'|'subnets';candidates?:ResourceRef[];status:'unresolved'|'kept-separate'|'resolved';resolution?:string}
export interface ResourceMigration {version:1;sourceGraph:unknown;conflicts:ResourceMigrationConflict[];notes:string[]}
export interface ResourceRegistry {version:1;resources:CanonicalResource[];serviceBindings:Record<string,ServiceResourceBinding>;frameBindings:Record<string,ResourceRef>;migration?:ResourceMigration}
export interface ResourceUsage {subject:'resource'|'service'|'frame';id:string;path:string;label:string}
export const emptyResourceRegistry=():ResourceRegistry=>({version:1,resources:[],serviceBindings:{},frameBindings:{}});
export const emptyServiceBinding=():ServiceResourceBinding=>({subnets:[],securityGroups:[],networkInterfaces:[]});
export const localResourceRef=(resource:Pick<CanonicalResource,'kind'|'id'>):ResourceRef=>({type:'local',kind:resource.kind,id:resource.id});

export const canonicalPlacementServices=['ec2','lambda','ecs','eks','elb','rds','aurora','elasticache','efs','opensearch','elastic-beanstalk','cloudshell','codebuild','privatelink'];
