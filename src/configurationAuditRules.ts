// Diagnostic rule IDs are persistent. Add new IDs; never renumber existing producers.
import type {ConfigurationDocument,ConfigurationFinding,JsonValue} from './configurationTypes';
import type {ConfigurationGraph} from './configurationRegistry';
import {cidrError,containsCidr,overlaps,parseCidr,trafficRuleErrors,networkEvidence,ownerVpc} from './networkValidation';
const rec=(v:unknown):v is Record<string,JsonValue>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const rows=(v:unknown):Record<string,JsonValue>[]=>Array.isArray(v)?v.filter(rec):[];
const range=(min:number,max:number,step=1)=>Array.from({length:(max-min)/step+1},(_,i)=>min+i*step);
export const fargateMemory:Record<number,number[]>={256:[512,1024,2048],512:[1024,2048,3072,4096],1024:range(2,8).map(x=>x*1024),2048:range(4,16).map(x=>x*1024),4096:range(8,30).map(x=>x*1024),8192:range(16,60,4).map(x=>x*1024),16384:range(32,120,8).map(x=>x*1024),32768:[60,120,244].map(x=>x*1024)};
export function auditedConfigurationFindings(service:string,doc:ConfigurationDocument,graph?:ConfigurationGraph):ConfigurationFinding[]{
 const v=doc.values,out:ConfigurationFinding[]=[];
 const add=(ruleId:string,field:string,detail:string,sourceUrl:string,level:ConfigurationFinding['level']='error',context?:JsonValue)=>out.push({ruleId,field,title:'Configuration constraint',detail,sourceUrl,level,category:'design',...(context!==undefined?{context}:{})});
 const order=(a:string,b:string,url:string)=>{if(typeof v[a]==='number'&&typeof v[b]==='number'&&v[a]>v[b])add('audit.001',b,a+' must not exceed '+b+'.',url)};
 for(const [i,row]of rows(v.securityRules).entries())for(const message of trafficRuleErrors(row))add('audit.002','securityRules.'+i,message,networkEvidence.sg);
 const vpcRef=rec(v.vpc)?v.vpc:undefined;
 const subnets=[...(typeof v.subnetId==='string'?[{subnetId:v.subnetId}]:[]),...rows(v.subnets),...rows(v.networkInterfaces),...rows(v.mountTargets)];
 for(const row of subnets){const subnet=graph?.network?.frames.find(f=>f.id===row.subnetId);if(subnet){if(subnet.kind!=='subnet')add('audit.003','subnetId','The selected local resource is not a subnet.',networkEvidence.subnet);const vp=ownerVpc(graph!.network!,subnet.parentId);if(vpcRef?.type==='frame'&&vp&&vpcRef.id!==vp)add('audit.004','subnetId','Selected subnet is not inside the selected VPC frame.',networkEvidence.subnet,'error',{selected:vpcRef.id,owner:vp??null,subnet:subnet.id});if(row.availabilityZone&&subnet.availabilityZone&&row.availabilityZone!==subnet.availabilityZone)add('audit.005','subnets','Subnet Availability Zone conflicts with the declared subnet frame.',networkEvidence.subnet,'error',{declared:row.availabilityZone,actual:subnet.availabilityZone,subnet:subnet.id});}}
 if(service==='vpc'){
  if(v.cidr!==undefined){const issue=cidrError(v.cidr,'vpc');if(issue)add('audit.006','cidr',issue,networkEvidence.vpc);else if(parseCidr(v.cidr)?.family!==4)add('audit.007','cidr','This field represents the primary IPv4 CIDR; IPv6 allocation must be modeled separately.',networkEvidence.vpc);}
  const declared=rows(v.subnets),parent=parseCidr(v.cidr);
  for(const [i,row]of declared.entries()){const c=parseCidr(row.cidr);if(row.cidr!==undefined){const issue=cidrError(row.cidr,'subnet');if(issue)add('audit.008','subnets.'+i,issue,networkEvidence.subnet);if(c&&parent&&c.family===parent.family&&!containsCidr(parent,c))add('audit.009','subnets.'+i,'Subnet CIDR falls outside the declared VPC range.',networkEvidence.subnet);}for(let j=0;j<i;j++){const previous=parseCidr(declared[j].cidr);if(c&&previous&&overlaps(c,previous))add('audit.010','subnets.'+i,'Declared subnet CIDRs overlap.',networkEvidence.subnet);}}
  const ruleNumbers=new Set<string>();for(const [i,row]of rows(v.networkAclRules).entries()){for(const message of trafficRuleErrors(row,true))add('audit.011','networkAclRules.'+i,message,networkEvidence.nacl);if(row.ruleNumber!==undefined){const key=row.direction+':'+row.ruleNumber;if(row.direction!==undefined&&ruleNumbers.has(key))add('audit.012','networkAclRules.'+i,'NACL rule numbers must be unique within a direction.',networkEvidence.nacl);ruleNumbers.add(key);}}
 }
 if(service==='ec2'){
  const url='https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-capacity-limits.html';order('minInstances','desiredInstances',url);order('desiredInstances','maxInstances',url);
 }
 if(service==='ecs'&&v.compute==='fargate'){
  const url='https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-cpu-memory-error.html';
  if(typeof v.taskCpu==='number'){
   if(!fargateMemory[v.taskCpu])add('audit.013','taskCpu','Choose a supported Fargate CPU value in CPU units: '+Object.keys(fargateMemory).join(', ')+'.',url);
   else if(typeof v.taskMemoryMb==='number'&&!fargateMemory[v.taskCpu].includes(v.taskMemoryMb))add('audit.014','taskMemoryMb','For '+v.taskCpu+' CPU units, supported memory (MiB): '+fargateMemory[v.taskCpu].join(', ')+'.',url);
   if(v.operatingSystem==='windows'&&![1024,2048,4096].includes(v.taskCpu))add('audit.015','taskCpu','The modeled Windows Fargate sizes support 1024, 2048 or 4096 CPU units.',url);
   if(v.taskCpu>=8192)add('audit.016','taskCpu','This size requires Linux platform 1.4.0 or later; platform availability is not verified.',url,'warning');
  }
 }
 if(service==='api'&&v.apiType==='http'&&typeof v.integrationTimeoutMs==='number'&&v.integrationTimeoutMs>30000)add('audit.017','integrationTimeoutMs','HTTP API integration timeout cannot exceed 30000 ms. REST API quotas have different rules.','https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-quotas.html');
 if(service==='step-functions'){
  const url='https://docs.aws.amazon.com/step-functions/latest/dg/service-quotas.html',limit=v.workflowType==='EXPRESS'?300:v.workflowType==='STANDARD'?31536000:undefined;
  if(limit&&typeof v.timeoutSeconds==='number'&&v.timeoutSeconds>limit)add('audit.018','timeoutSeconds','Selected workflow execution limit is '+limit+' seconds.',url);
  for(const [i,row]of rows(v.tasks).entries()){
   if(typeof row.heartbeatSeconds==='number'&&typeof row.timeoutSeconds==='number'&&row.heartbeatSeconds>=row.timeoutSeconds)add('audit.019','tasks.'+i,'Task heartbeat must be less than task timeout.','https://docs.aws.amazon.com/step-functions/latest/dg/state-task.html');
   if(v.workflowType==='EXPRESS'&&row.integrationPattern!==undefined&&row.integrationPattern!=='request-response')add('audit.020','tasks.'+i,'Express workflows support request-response integrations; .sync and callback patterns require Standard.','https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html');
  }
 }
 if(service==='codebuild'){
  const lambda=typeof v.environmentType==='string'&&v.environmentType.includes('LAMBDA'),url='https://docs.aws.amazon.com/codebuild/latest/userguide/lambda.html';
  if(lambda){if(v.timeoutMinutes!==undefined)add('audit.021','timeoutMinutes','Lambda compute does not support custom build timeouts. Clear this setting; its runtime limit is 15 minutes.',url);if(v.privilegedMode===true)add('audit.022','privilegedMode','Lambda compute does not support privileged mode.',url);if(v.cache!==undefined&&v.cache!=='NO_CACHE')add('audit.023','cache','Lambda compute does not support build caching.',url);}
  if(typeof v.environmentType==='string'&&typeof v.computeType==='string'&&lambda!==v.computeType.startsWith('BUILD_LAMBDA_'))add('audit.024','computeType','Lambda environment and Lambda compute size must be selected together. Other compute compatibility still requires an account/Region check.','https://docs.aws.amazon.com/codebuild/latest/APIReference/API_ProjectEnvironment.html');
 }
 if(service==='rds'&&v.backupRetentionDays===0&&(v.deploymentType==='multi-az-cluster'||rows(v.readReplicas).length))add('audit.025','backupRetentionDays','Read-replica sources and Multi-AZ DB clusters cannot disable automated backups.','https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_ModifyDBInstance.html');
 if(service==='cloudfront'){
  const ids=new Set<string>();for(const [i,row]of rows(v.origins).entries()){if(typeof row.id==='string'){if(ids.has(row.id))add('audit.026','origins.'+i,'Origin IDs must be unique within the distribution.','https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_Origin.html');ids.add(row.id);}if(row.type==='s3-website'&&row.originProtocol!==undefined&&row.originProtocol!=='http-only')add('audit.027','origins.'+i,'S3 website endpoints support HTTP origin connections. Use an S3 REST origin for the corresponding private-origin design.','https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistS3AndCustomOrigins.html');}
 }
 if(service==='cloudwatch'&&v.alarmType!=='composite'){
  const url='https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutMetricAlarm.html',period=v.periodSeconds;
  if(typeof period==='number'){if(![10,20,30].includes(period)&&period%60!==0)add('audit.028','periodSeconds','Use 10, 20, 30 or a multiple of 60 seconds.',url);if(period<60)add('audit.029','periodSeconds','Sub-minute alarms require high-resolution metric data; the data resolution is not verified.',url,'warning');if(typeof v.evaluationPeriods==='number'&&period*v.evaluationPeriods>(period<3600?86400:604800))add('audit.030','evaluationPeriods','Total evaluation duration exceeds '+(period<3600?'one day for periods below one hour.':'seven days.'),url);}
 }
 if(service==='sts'&&typeof v.durationSeconds==='number'&&typeof v.sessionMethod==='string'){
  const method=v.sessionMethod,maximum=method.startsWith('AssumeRole')?43200:129600,url='https://docs.aws.amazon.com/STS/latest/APIReference/API_'+method+'.html';
  if(v.durationSeconds<900||v.durationSeconds>maximum||!Number.isInteger(v.durationSeconds))add('audit.031','durationSeconds','For '+method+', request an integer 900–'+maximum+' seconds; principal/role limits can lower the effective maximum.',url);
  if(rec(v.targetRole)&&v.targetRole.type==='node'){
   const target=graph?.architecture?.nodes[String(v.targetRole.id)],values=target?.schemaVersion===2&&rec(target.values)?target.values:undefined;
   if(method.startsWith('AssumeRole')&&typeof values?.maxSessionDurationSeconds==='number'&&v.durationSeconds>values.maxSessionDurationSeconds)add('audit.032','durationSeconds','Requested session duration exceeds the linked role maximum.',url,'error',{requested:v.durationSeconds,maximum:values.maxSessionDurationSeconds});
  }
 }
 if(service==='kms'&&v.rotationEnabled===true){
  const url='https://docs.aws.amazon.com/kms/latest/APIReference/API_EnableKeyRotation.html';
  if(v.keySpec!==undefined&&v.keySpec!=='SYMMETRIC_DEFAULT'||v.keyUsage!==undefined&&v.keyUsage!=='ENCRYPT_DECRYPT'||v.keyOrigin!==undefined&&v.keyOrigin!=='AWS_KMS')add('audit.033','rotationEnabled','Automatic rotation requires a supported symmetric encryption key with AWS-generated material; imported, asymmetric, HMAC and custom-key-store keys do not support this setting.',url);
 }
 if(service==='waf'&&rec(v.protectedResource)&&v.protectedResource.type==='node'){
  const targetId=v.protectedResource.id,target=graph?.nodes.find(n=>n.id===targetId),raw=target?graph?.architecture?.nodes[target.id]:undefined,tv=raw?.schemaVersion===2&&rec(raw.values)?raw.values:{},url='https://docs.aws.amazon.com/waf/latest/developerguide/how-aws-waf-works-resources.html';
  if(target){const global=['cloudfront','amplify'].includes(target.service);if(v.scope!==undefined&&(global?v.scope!=='CLOUDFRONT':v.scope!=='REGIONAL'))add('audit.034','scope','WAF scope does not match the protected resource. CloudFront and Amplify use the Global CloudFront scope.',url,'error',{resourceType:target.service,scope:v.scope});
   if(target.service==='api'&&tv.apiType!==undefined&&tv.apiType!=='rest')add('audit.035','protectedResource','WAF supports API Gateway REST APIs, not the selected API variant.',url,'error',{apiType:tv.apiType});
   if(target.service==='elb'&&tv.loadBalancerType==='network')add('audit.036','protectedResource','WAF protects an Application Load Balancer, not a Network Load Balancer.',url,'error',{loadBalancerType:tv.loadBalancerType});
   if(target.service==='cognito'&&tv.identityPurpose==='identity-pool')add('audit.037','protectedResource','WAF protects a Cognito user pool, not an identity pool.',url,'error',{identityPurpose:tv.identityPurpose});
   if(target.service==='agentcore')add('audit.038','protectedResource','AWS WAF supports AgentCore Gateway. This node does not distinguish Gateway from Runtime; verify the actual resource.',url,'warning');
  }
 }
 if(service==='efs'){
  const url='https://docs.aws.amazon.com/efs/latest/ug/performance.html';if(v.performanceMode==='max-io'&&(v.availability==='one-zone'||v.throughputMode==='elastic'))add('audit.039','performanceMode','Max I/O is not supported with One Zone or Elastic throughput.',url);
  for(const [i,row]of rows(v.lifecycle).entries())if(row.transition==='to-primary-on-access'&&row.inactiveDays!==undefined)add('audit.040','lifecycle.'+i,'Return to primary storage occurs on access; clear the inactivity-day value.','https://docs.aws.amazon.com/efs/latest/APIReference/API_LifecyclePolicy.html');
 }
 if(service==='ebs'){
  const type=String(v.volumeType),size=v.sizeGib,iops=v.iops,throughput=v.throughputMib,url='https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html';
  const sizes:Record<string,[number,number]>={gp3:[1,65536],gp2:[1,16384],io1:[4,16384],io2:[4,65536],st1:[125,16384],sc1:[125,16384]};
  if(sizes[type]&&typeof size==='number'&&(size<sizes[type][0]||size>sizes[type][1]))add('audit.041','sizeGib',type+' volume size must be '+sizes[type].join('–')+' GiB in the modeled regional configuration.',url);
  if(typeof iops==='number'&&['gp3','io1','io2'].includes(type)){
   const [min,max,ratio]=type==='gp3'?[3000,80000,500]:type==='io1'?[100,64000,50]:[100,256000,1000];
   if(iops<min||iops>max)add('audit.042','iops',type+' provisioned IOPS must be '+min+'–'+max+'.',url);
   if(typeof size==='number'&&iops>Math.max(type==='gp3'?3000:0,size*ratio))add('audit.043','iops','Provisioned IOPS exceed the supported IOPS-to-size ratio.',url);
  }
  if(type==='gp3'&&typeof throughput==='number'){
   if(throughput<125||throughput>2000)add('audit.044','throughputMib','Regional gp3 throughput must be 125–2000 MiB/s. Outposts has different limits.','https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html');
   if(typeof iops==='number'&&throughput>iops*.25)add('audit.045','throughputMib','gp3 throughput cannot exceed 0.25 MiB/s per provisioned IOPS.','https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html');
  }
 }
 return out;
}
