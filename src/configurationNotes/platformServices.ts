import type {ConfigSource,JsonValue} from '../configurationTypes';
/** Static authored notes: no registry import, generated defaults or AWS validity assertion. */
export interface PlatformServiceNote {
 semantics:'aws-setting'|'application-intent'|'exercise-input'|'observed-output';
 documentation:{purpose:string;whenToUse:string;omission:string;effects:string[];examples:{value:JsonValue;explanation:string}[];relatedLessons:string[]};
 evidence:{status:'reference-only'|'needs-context';sourceIds:string[];scope:string};source:ConfigSource;
}
const date='2026-11-03';
const source=(title:string,url:string):ConfigSource=>({title,url,verified:date});
export const platformNoteSources={
 ec2:source('EC2 launch parameters','https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RunInstances.html'),
 imds:source('EC2 metadata options','https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_ModifyInstanceMetadataOptions.html'),
 instanceRole:source('EC2 IAM roles and instance profiles','https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html'),
 userData:source('EC2 user data interpretation','https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html'),
 asg:source('Auto Scaling capacity bounds','https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-capacity-limits.html'),
 cwAgent:source('CloudWatch agent collection','https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html'),
 eb:source('Beanstalk Standard configuration namespaces','https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-general.html'),
 ebDeploy:source('Beanstalk deployment policy compatibility','https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.deploy-existing-version.html'),
 ebSoftware:source('Beanstalk application environment settings','https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/environments-cfg-softwaresettings.html'),
 ebRole:source('Beanstalk service-role responsibilities','https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/iam-servicerole.html'),
 ecr:source('ECR private repository configuration','https://docs.aws.amazon.com/AmazonECR/latest/APIReference/API_CreateRepository.html'),
 ecrTags:source('ECR mutability and exclusion settings','https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html'),
 ecrScan:source('ECR scanning modes','https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html'),
 ecrLifecycle:source('ECR lifecycle preview and image retention','https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html'),
 ecrPolicy:source('ECR repository authorization','https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-policies.html'),
 task:source('ECS task-definition contract','https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_RegisterTaskDefinition.html'),
 container:source('ECS container-definition fields','https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_ContainerDefinition.html'),
 service:source('ECS service configuration','https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_CreateService.html'),
 taskSize:source('ECS task CPU and memory compatibility','https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-cpu-memory-error.html'),
 executionRole:source('ECS task execution role','https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html'),
 ecsSecrets:source('ECS secret delivery options','https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html'),
 ecsHealth:source('ECS container health checks','https://docs.aws.amazon.com/AmazonECS/latest/developerguide/healthcheck.html'),
 ecsBreaker:source('ECS deployment circuit breaker','https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-circuit-breaker.html'),
 ecsScale:source('ECS service automatic scaling','https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-auto-scaling.html'),
 podIdentity:source('EKS Pod Identity','https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html'),
 irsa:source('EKS IAM roles for service accounts','https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html'),
 eksSecrets:source('EKS Secrets and Configuration Provider','https://docs.aws.amazon.com/eks/latest/userguide/manage-secrets.html'),
 kubeDeployment:source('Kubernetes Deployment behavior','https://kubernetes.io/docs/concepts/workloads/controllers/deployment/'),
 kubeProbes:source('Kubernetes workload probes','https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/'),
 kubeResources:source('Kubernetes resource requests and limits','https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/'),
 listener:source('Load balancer listener configuration','https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_CreateListener.html'),
 target:source('Load balancer target group configuration','https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_CreateTargetGroup.html'),
 nlb:source('Network Load Balancer listener capabilities','https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html'),
 albRules:source('Application Load Balancer rule evaluation','https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-rules.html'),
 albAttributes:source('Application Load Balancer attributes','https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-load-balancer-attributes.html'),
 cfOrigin:source('CloudFront origin settings','https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistValuesOrigin.html'),
 cfBehavior:source('CloudFront cache behavior settings','https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistValuesCacheBehavior.html'),
 cfCache:source('CloudFront managed cache policies','https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html'),
 cfTls:source('CloudFront TLS integration requirements','https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html'),
 cfLogs:source('CloudFront standard access logging','https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/AccessLogs.html'),
 cfRealtime:source('CloudFront real-time log delivery','https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/real-time-logs.html'),
 dnsRecord:source('Route 53 resource record sets','https://docs.aws.amazon.com/Route53/latest/APIReference/API_ResourceRecordSet.html'),
 dnsHealth:source('Route 53 health-check configuration','https://docs.aws.amazon.com/Route53/latest/APIReference/API_HealthCheckConfig.html'),
 dnsRouting:source('Route 53 routing policies','https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html'),
 privateZone:source('Route 53 private hosted zones','https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-private.html'),
 cidr:source('VPC CIDR allocation scope','https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html'),
 dns:source('VPC DNS attributes','https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html'),
 routes:source('Subnet route-table associations','https://docs.aws.amazon.com/vpc/latest/userguide/subnet-route-tables.html'),
 sg:source('Security-group rule components','https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html'),
 nacl:source('Subnet network ACL behavior','https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html'),
 flowLogs:source('VPC flow-log delivery','https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html'),
 endpoint:source('VPC endpoint request variants','https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateVpcEndpoint.html'),
 interfaceEndpoint:source('Interface endpoint prerequisites','https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html'),
 endpointPolicy:source('Endpoint policy authorization boundary','https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-access.html'),
 endpointService:source('Endpoint service acceptance and permissions','https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html'),
 certificate:source('ACM certificate request','https://docs.aws.amazon.com/acm/latest/APIReference/API_RequestCertificate.html'),
 certProperties:source('ACM public certificate characteristics','https://docs.aws.amazon.com/acm/latest/userguide/acm-certificate-characteristics.html'),
 certDns:source('ACM DNS validation records','https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html'),
 certRenewal:source('ACM managed-renewal eligibility','https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html'),
 certImport:source('ACM imported certificate lifecycle','https://docs.aws.amazon.com/acm/latest/userguide/import-certificate.html'),
} as const;
type SourceId=keyof typeof platformNoteSources;
type Semantics=PlatformServiceNote['semantics'];
const deployment='release-artifacts',security='security-iam-sts',network='observe-debug',performance='measure-optimize',rollout='progressive-release';
const scopes:Partial<Record<SourceId,string>>={
 eb:'Beanstalk Standard on EC2 only. The newer Beanstalk Cluster EKS namespaces are a different configuration surface.',
 ebDeploy:'Deployment choice depends on Standard environment capacity, load balancer and platform. This note does not configure Beanstalk Cluster.',
 ecr:'Private ECR API reference. Public repository capabilities require their separate API; dropdown choices are not a universal contract.',
 taskSize:'Task-size example assumes Linux Fargate and a compatible platform version; account, Region and operating-system support remain context.',
 kubeDeployment:'Kubernetes workload intent, not EKS control-plane settings. Verify the cluster Kubernetes version and resource kind before applying a manifest.',
 kubeProbes:'Kubernetes probe behavior; this reduced form does not express every handler, timing option or version-specific feature.',
 kubeResources:'Kubernetes quantities and Linux resource behavior; namespace admission defaults and actual allocatable capacity are not queried.',
 cfBehavior:'This editor summarizes behavior settings and custom-cache intent. It does not resolve managed policy IDs or evaluate viewer authorization.',
 listener:'Listener settings depend on ALB/NLB and protocol. A linked certificate or target group is a declaration, not proof of deployment.',
 target:'Target-group options are conditional on protocol, target type and load-balancer product; generic controls do not establish compatibility.',
 sg:'Inline rule intent does not modify a selected shared security-group object. Actual attachments, routes and authorization are separate.',
 endpoint:'The editor exposes interface and Gateway Load Balancer endpoint intent only; S3/DynamoDB gateway endpoints use a different resource path.',
 certProperties:'Certificate source and consuming service determine supported algorithms and trust. No private key or live certificate is loaded.',
};
function n(src:SourceId,lesson:string,value:JsonValue,text:[string,string,string,string,string],semantics:Semantics='aws-setting',scope?:string):PlatformServiceNote {
 const [purpose,whenToUse,omission,effect,explanation]=text;
 return {semantics,documentation:{purpose,whenToUse,omission,effects:[effect],examples:[{value,explanation}],relatedLessons:[lesson]},evidence:{status:scope?'needs-context':'reference-only',sourceIds:[src],scope:scope??scopes[src]??platformNoteSources[src].title+' is the reference scope; the example is educational and no cloud operation is executed.'},source:platformNoteSources[src]};
}
const external=(id:string):JsonValue=>({type:'external',id});
const role=(id:string):JsonValue=>({type:'role',id});
const json=(value:JsonValue)=>JSON.stringify(value,null,2);
const sgRow:JsonValue={direction:'ingress',protocol:'tcp',fromPort:443,toPort:443,peerType:'security-group',peer:'frontend-sg',description:'TLS from the frontend'};
function sgNotes(use:string):Record<string,PlatformServiceNote>{return {
 securityRules:n('sg',network,[sgRow],['Describe the allowed network conversations for '+use+'.','Review the caller, destination and protocol together.','No inline rules are declared; selected shared groups remain separate.','Opening a port does not create a route or authenticate the caller.','Illustrates a narrow frontend-to-service TLS conversation.'],'application-intent'),
 'securityRules.direction':n('sg',network,'ingress',['Choose which side of a conversation this allow rule describes.','Use ingress for new inbound traffic; egress for new outbound traffic.','The direction is unresolved, so the row cannot identify its enforcement side.','Stateful security-group response handling differs from stateless NACL rules.','The frontend initiates this inbound connection.']),
 'securityRules.protocol':n('sg',network,'tcp',['Select the protocol to which the rule applies.','Read port numbers as TCP/UDP ports and ICMP fields as type/code.','Protocol is unknown; the same numbers can mean different things.','ALL widens the permitted protocol set and does not use port bounds.','TLS in this example runs over TCP.']),
 'securityRules.fromPort':n('sg',network,443,['Set the start port, or ICMP type for an ICMP rule.','Interpret this field after choosing the protocol.','The lower boundary or ICMP type remains unspecified.','For TCP/UDP the start must not exceed the end; ICMP is not a port range.','443 paired with end 443 describes one HTTPS port.']),
 'securityRules.toPort':n('sg',network,443,['Set the end port, or ICMP code for an ICMP rule.','Pair with start port for TCP/UDP, or type for ICMP.','The upper boundary or ICMP code remains unspecified.','An ICMP all-types selection must use the compatible all-codes value.','Matching start and end avoids exposing additional ports.']),
 'securityRules.peerType':n('sg',network,'security-group',['Choose how the traffic peer is identified.','Distinguish an address range from a referenced group or prefix list.','The peer value cannot be interpreted confidently.','A referenced security group is a traffic peer, not a group attachment.','The rule trusts traffic associated with the frontend group.']),
 'securityRules.peer':n('sg',network,'frontend-sg',['Identify the allowed source or destination.','Supply a CIDR or group/prefix-list reference matching peer type.','No peer boundary has been declared.','A logical name must resolve to the intended resource before deployment.','Synthetic group identity explains the dependency without a broad internet range.']),
 'securityRules.description':n('sg',network,'TLS from frontend tier',['Record why this exception exists.','Explain the workload relationship when adding a rule.','Traffic behavior is unchanged, but review rationale is missing.','Descriptions improve audits; they do not constrain packets.','The rationale helps reviewers remove an obsolete frontend dependency.']),
};}
function secretNotes(src:SourceId,delivery:string,semantics:Semantics):Record<string,PlatformServiceNote>{return {
 secrets:n(src,security,[{name:'DB_PASSWORD',source:external('database-credentials'),version:'AWSCURRENT'}],['Declare secret references for '+delivery+'.','Choose the supported retrieval or injection mechanism before mapping variables.','The workload secret-delivery path remains unspecified.','Naming a secret neither retrieves its value nor grants KMS or secret access.','References identify the dependency while keeping credential values out of the workspace.'],semantics),
 'secrets.name':n(src,security,'DB_PASSWORD',['Name the application-side secret binding.','Match the variable or file contract expected by '+delivery+'.','The application cannot know which configured binding to read.','Changing the binding name requires corresponding application configuration.','The name is a contract label, not a stored password.'],semantics),
 'secrets.source':n(src,security,external('database-credentials'),['Select the secret or parameter supplying this binding.','Resolve the reference under the workload retrieval identity.','The secret source is unresolved rather than empty or public.','Source IAM, encryption and delivery permissions must all be considered.','Use a synthetic reference until an authorized deployment resolves the resource.'],semantics),
 'secrets.version':n(src,security,'AWSCURRENT',['Choose whether delivery follows rotation or a pinned version.','Review refresh behavior for '+delivery+' before pinning a value.','No version-selection policy is asserted by this editor.','A pinned version can outlive rotation; injected values may require workload refresh.','AWSCURRENT illustrates a stage name; verify that the selected provider supports it.'],semantics),
};}
