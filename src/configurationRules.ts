import type {ConfigurationDocument,ConfigurationFinding,JsonValue} from './configurationTypes';
import type {ConfigurationGraph} from './configurationRegistry';
const rec=(v:unknown):v is Record<string,JsonValue>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const rows=(v:JsonValue|undefined)=>Array.isArray(v)?v.filter(rec):[];
export function semanticConfigurationFindings(service:string,document:ConfigurationDocument,graph?:ConfigurationGraph):ConfigurationFinding[]{
 const v=document.values,out:ConfigurationFinding[]=[];
 const add=(field:string,title:string,detail:string,level:'error'|'warning'|'info'='error')=>out.push({field,title,detail,level,category:'design'});
 const number=(key:string)=>typeof v[key]==='number'?v[key] as number:undefined;
 const order=(a:string,b:string)=>{const x=number(a),y=number(b);if(x!==undefined&&y!==undefined&&x>y)add(b,'Inconsistent numeric settings',a+' must not exceed '+b+'.');};
 for(const [key,value]of Object.entries(v))if(typeof value==='number'&&/(Seconds|Days|Count|Attempts|Mb|KiB|Bytes|Concurrency|CapacityUnits)$/.test(key)&&!Number.isInteger(value))add(key,'Whole-number setting required','This setting is modeled as a whole number; use its declared unit.');
 order('minInstances','maxInstances');order('minTasks','maxTasks');order('minTtlSeconds','defaultTtlSeconds');order('defaultTtlSeconds','maxTtlSeconds');order('datapointsToAlarm','evaluationPeriods');
 if(service==='lambda'){
  if(rec(v.environmentVariables)){const entries=Object.entries(v.environmentVariables);if(entries.some(([k])=>!/^[A-Za-z][A-Za-z0-9_]+$/.test(k)))add('environmentVariables','Environment variable key invalid','Use the documented Lambda variable-name format; reserved runtime keys are not application configuration.');const bytes=entries.reduce((n,[k,x])=>n+new TextEncoder().encode(k+String(x)).byteLength,0);if(bytes>4096)add('environmentVariables','Lambda environment size exceeded','The combined keys/values exceed the documented4KB total. Put large/sensitive content in an appropriate external configuration/secret store.');}

  if(v.packageType==='Image'&&rows(v.layers).length)add('layers','Layers are not attached to container-image functions','Package the dependencies in the image; do not combine ZIP layer configuration with image deployment.');
  if(v.snapStart===true&&(number('provisionedConcurrency')??0)>0)add('snapStart','Incompatible cold-start controls','SnapStart and provisioned concurrency cannot be configured together on the same function version.');
  if(v.invocationType==='synchronous'&&(v.destinations!==undefined||v.maximumRetryAttempts!==undefined||v.maximumEventAgeSeconds!==undefined))add('invocationType','Invocation lifecycle mismatch','Async retry/age/destinations are not the retry behavior of a synchronous caller. Keep those settings on the matching invocation path.');
  for(const row of rows(v.eventSourceMappings))if(row.source&&rec(row.source)&&row.source.type==='node'){
   const source=row.source as {type:string;id:string};const queue=graph?.nodes.find(n=>n.id===source.id&&n.service==='sqs');if(queue){const q=graph?.architecture?.nodes[queue.id] as unknown as ConfigurationDocument|undefined;if(q?.schemaVersion===2)checkQueue(q.values,row);}
  }
 }
 function checkQueue(q:Record<string,JsonValue>,mapping:Record<string,JsonValue>={}){
  const timeout=service==='lambda'?number('timeoutSeconds'):undefined,visibility=typeof q.visibilitySeconds==='number'?q.visibilitySeconds:undefined;
  const size=typeof mapping.batchSize==='number'?mapping.batchSize:typeof q.batchSize==='number'?q.batchSize:undefined;
  const window=typeof mapping.batchWindowSeconds==='number'?mapping.batchWindowSeconds:typeof q.batchWindowSeconds==='number'?q.batchWindowSeconds:0;
  if(q.queueType==='fifo'&&size!==undefined&&size>10)add('eventSourceMappings','FIFO Lambda batch size exceeds supported range','A FIFO SQS Lambda event-source mapping supports at most 10 messages per batch.');
  if(q.queueType==='fifo'&&window>0)add('eventSourceMappings','FIFO batching window unsupported','Use zero batching window for an SQS FIFO Lambda event-source mapping.');
  if(q.queueType==='standard'&&size!==undefined&&size>10&&window<1)add('eventSourceMappings','Large SQS batch needs a window','For an SQS Lambda batch size above 10, configure a batching window of at least 1 second.');
  if(timeout!==undefined&&visibility!==undefined){if(visibility<timeout)add('eventSourceMappings','Visibility shorter than function timeout','The queue visibility timeout must not be shorter than the Lambda function timeout.');else if(visibility<6*timeout+window)add('eventSourceMappings','Review visibility headroom','AWS recommends at least six times the Lambda timeout plus the batch window. This recommendation is distinct from the hard minimum.','warning');}
 }
 if(service==='sqs'){checkQueue(v);if(typeof v.queueName==='string'){const name=v.queueName,base=name.endsWith('.fifo')?name.slice(0,-5):name;if(name.length>80||!base||!/^[A-Za-z0-9_-]+$/.test(base)||v.queueType==='fifo'&&!name.endsWith('.fifo')||v.queueType==='standard'&&name.endsWith('.fifo'))add('queueName','Queue name/type mismatch','Use a supported name up to80 characters; a FIFO queue name ends with .fifo and its type cannot be converted in place.');}}
 if(service==='api'){
  if(v.apiType==='http'&&v.endpointType!==undefined&&v.endpointType!=='REGIONAL')add('endpointType','HTTP API endpoint type mismatch','A private integration does not make the HTTP API endpoint a private API.');
  if(v.apiType!=='rest'&&v.integration==='mock')add('integration','Mock integration is REST-specific','Select the API product that supports this feature.');
  for(const row of rows(v.routes))if(v.apiType==='http'&&row.apiKeyRequired===true)add('routes','HTTP API does not use REST usage-plan API keys','Use the supported HTTP API authorizer; an API key is not user authentication.');
  for(const row of rows(v.authorizers))if(v.apiType==='http'&&['TOKEN','COGNITO_USER_POOLS'].includes(String(row.type)))add('authorizers','HTTP API authorizer mismatch','Use a JWT authorizer for Cognito tokens, or the supported Lambda REQUEST authorizer.');else if(v.apiType==='rest'&&row.type==='JWT')add('authorizers','REST API authorizer mismatch','REST APIs use Cognito user-pool or Lambda authorizers; the native JWT authorizer is an HTTP API feature.');
  for(const row of rows(v.cors))if(row.allowCredentials===true&&row.allowOrigin==='*')add('cors','Credentialed CORS cannot use wildcard origin','Specify the intended frontend origin for credentialed browser requests.');
  for(const row of rows(v.stages))if(v.apiType==='rest'&&row.autoDeploy===true)add('stages','REST stages do not use HTTP auto-deploy','Use an explicit deployment for the REST API stage.');
 }
 if(service==='dynamodb'){
  if(typeof v.tableName==='string'&&!/^[A-Za-z0-9_.-]{3,255}$/.test(v.tableName))add('tableName','Table name invalid','Use3–255 characters from letters, digits, underscore, hyphen and period.');

  if(v.readTarget==='gsi'&&v.readConsistency==='strong')add('readConsistency','GSI reads cannot be strongly consistent','Select eventual consistency for a global secondary index.');
  if(v.readTarget==='gsi'&&v.readOperation==='GetItem')add('readOperation','GetItem does not read an index','Use Query or Scan against an index; GetItem targets the table key.');
  if(v.readOperation==='Query'&&typeof v.keyCondition==='string'&&!v.keyCondition.trim())add('keyCondition','Query needs a partition-key condition','An arbitrary filter does not replace the partition-key equality condition.');
 }
 if(service==='s3'){
  if(v.bucketType!=='directory'&&typeof v.bucketName==='string'){const name=v.bucketName;if(!/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(name)||name.includes('..')||/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(name)||['xn--','sthree-','amzn-s3-demo-'].some(p=>name.startsWith(p))||['-s3alias','--ol-s3','.mrap','--x-s3','--table-s3'].some(s=>name.endsWith(s)))add('bucketName','General-purpose bucket name invalid','Review the documented3–63-character lowercase naming rules and reserved prefixes/suffixes. Availability and namespace uniqueness are not checked.');if(v.transferAcceleration===true&&name.includes('.'))add('bucketName','Transfer Acceleration name restriction','A bucket used with Transfer Acceleration cannot contain periods.');}

  if(v.objectOwnership==='BucketOwnerEnforced'&&v.acl!==undefined)add('acl','ACL configuration is disabled by Object Ownership','Bucket-owner-enforced ownership disables ACLs. Use IAM/bucket policy for access control.');
  if(v.objectLockEnabled===true&&v.versioning!==undefined&&v.versioning!=='Enabled')add('versioning','Object Lock requires versioning','Keep versioning enabled for an Object Lock bucket.');
  if(v.bucketKeyEnabled===true&&v.encryption!=='SSE-KMS')add('bucketKeyEnabled','Bucket Key encryption mismatch','S3 Bucket Keys are used with SSE-KMS, not DSSE-KMS or SSE-S3.');
 }
 if(service==='ecs'&&v.compute==='fargate'&&v.networkMode!==undefined&&v.networkMode!=='awsvpc')add('networkMode','Fargate requires awsvpc','Use task networking compatible with Fargate.');
 if(service==='elb'){
  for(const l of rows(v.listeners)){if(v.loadBalancerType==='application'&&l.protocol!==undefined&&!['HTTP','HTTPS'].includes(String(l.protocol)))add('listeners','ALB listener protocol mismatch','Application Load Balancers use HTTP/HTTPS listeners.');if(v.loadBalancerType==='network'&&l.defaultAction!==undefined&&l.defaultAction!=='forward')add('listeners','NLB action mismatch','HTTP redirects/fixed responses are ALB actions.');}
  if(v.loadBalancerType==='network'&&rows(v.routingRules).length)add('routingRules','HTTP content routing is ALB-specific','Use an ALB for host/path routing requirements.');
 }
 if(service==='cloudfront'){
  for(const origin of rows(v.origins))if(origin.type==='s3-website'&&origin.originAccess!==undefined&&origin.originAccess!=='none')add('origins','S3 website origins do not use OAC/OAI','A website endpoint is a custom HTTP origin, not the S3 REST origin access path.');
  for(const b of rows(v.behaviors))if(Array.isArray(b.allowedMethods)){const set=new Set(b.allowedMethods);if(!set.has('GET')||!set.has('HEAD')||![2,3,7].includes(set.size)||(set.size===3&&!set.has('OPTIONS')))add('behaviors','Unsupported allowed-methods combination','Choose GET/HEAD, GET/HEAD/OPTIONS, or all seven supported methods.');}
 }
 if(service==='privatelink'&&v.privateDns===true&&rec(v.vpc)&&v.vpc.type==='node'){
  const target=graph?.architecture?.nodes[String(v.vpc.id)] as unknown as ConfigurationDocument|undefined;
  if(target?.schemaVersion===2&&(target.values.dnsSupport===false||target.values.dnsHostnames===false))add('privateDns','VPC DNS prerequisites missing','Private DNS requires compatible VPC DNS support and DNS hostname settings.');
 }
 if(service==='cloudshell'&&v.environment==='vpc'&&v.persistentHomeRequired===true)add('persistentHomeRequired','VPC CloudShell storage is ephemeral','Do not depend on the persistent standard-environment home directory in a VPC environment.');
 if(service==='codeartifact'){
  const duration=number('tokenDurationSeconds');if(duration!==undefined&&duration!==0&&(duration<900||duration>43200))add('tokenDurationSeconds','Authorization-token duration invalid','Use 900–43200 seconds, or zero for the supported assumed-role session case.');
  if(duration===0)add('tokenDurationSeconds','Assumed-role context required','Zero uses the remaining assumed-role session duration; verify the caller session.','warning');
 }
 if(service==='cloudwatch-logs'){
  if(v.logClass!=='STANDARD'&&v.logClass!==undefined&&(rows(v.metricFilters).length||rows(v.subscriptions).length))add('logClass','Log-class feature mismatch','Metric filters and subscription filters are modeled only for Standard log groups.');
  if(v.logClass==='DELIVERY'&&(v.query!==undefined||v.retentionDays!==undefined&&v.retentionDays!==2))add('logClass','Delivery log-class limits','Delivery log groups have two-day retention and do not support Logs Insights queries.');
 }
 if(service==='kms'){
  if(v.keySpec==='HMAC_256'&&v.keyUsage!==undefined&&v.keyUsage!=='GENERATE_VERIFY_MAC')add('keyUsage','HMAC key usage mismatch','Choose GENERATE_VERIFY_MAC for the modeled HMAC key.');
  if(v.keySpec==='SYMMETRIC_DEFAULT'&&v.keyUsage!==undefined&&v.keyUsage!=='ENCRYPT_DECRYPT')add('keyUsage','Symmetric encryption key usage mismatch','Use ENCRYPT_DECRYPT for this key specification.');
 }
 if(service==='sts'){const arns=rows(v.managedSessionPolicyArns).map(r=>String(r.arn??''));if(arns.length>10)add('managedSessionPolicyArns','Too many session policy ARNs','STS permits at most10 managed-policy ARN references in this request.');const chars=String(v.sessionPolicy??'').length+arns.reduce((n,a)=>n+a.length,0);if(chars>2048)add('sessionPolicy','Combined STS policy size exceeded','Inline JSON plus managed-policy ARN strings exceed2048 characters; whitespace is not excluded. Packed session-token limits are separate.');if(v.roleChaining===true&&typeof v.durationSeconds==='number'&&v.durationSeconds>3600)add('durationSeconds','Role chaining session limit','The modeled AssumeRole role-chaining session is limited to one hour.');}
 if(service==='cognito'&&v.identityPurpose==='user-pool'&&v.allowUnauthenticatedIdentities===true)add('allowUnauthenticatedIdentities','Identity Pool setting on User Pool','Guest AWS credentials are an Identity Pool concern; a User Pool authenticates users and issues tokens.');
 return out;
}
