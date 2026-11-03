import {configurationDocument,configurationGraphFindings} from '../../configurationRegistry';
import {parseConfigurationDocument} from '../../configurationDocuments';
import {evaluatePolicyScenario,validatePolicyDocument} from '../../policyEngine';
import {evaluateEventBridge} from '../../eventBridge';
import {trafficRuleErrors} from '../../networkValidation';
import {simulate,defaultConfig} from '../../engine';
import {approvedDigest,getLabDefinition,labArns} from './definitions';
import type {LabDefinition,LabValues,LabResult,LabObjectiveResult,LabCheckStatus,LabTraceEntry,LabSession,LabAttempt} from './types';
const scope='Local synthetic fixture only. No AWS authorization, deployment, runtime execution or personal architecture changes were performed.';
const json=(value:unknown):any=>{if(typeof value!=='string')throw new Error('Provide JSON text.');const parsed=parseConfigurationDocument(value,'json');if(parsed.errors.length)throw new Error(parsed.errors.join(' '));return parsed.value};
const strings=(value:unknown):string[]=>{const parsed=json(value);if(!Array.isArray(parsed)||parsed.some(x=>typeof x!=='string')||new Set(parsed).size!==parsed.length)throw new Error('Use a JSON array of distinct strings.');return parsed};
const outcome=(ok:boolean,success:string,failure:string)=>({status:ok?'pass' as const:'fail' as const,explanation:ok?success:failure});
function policy(value:unknown,action:string,resource:string){
 if(typeof value!=='string')throw new Error('Supply an identity-policy document.');const validation=validatePolicyDocument(value,'identity');if(validation.errors.length)throw new Error(validation.errors.join(' '));
 const context={action,resource,principal:labArns.role,conditions:{'aws:PrincipalArn':labArns.role},sameAccount:true,completeContext:false};
 const evaluate=(document:string)=>evaluatePolicyScenario([{id:'lab-policy',name:'Lab application policy',kind:'identity' as const,document}],context);
 const result=evaluate(value),missingKeys=new Set<string>();
 // Missing metadata is unknown, not a claim that the key is absent in AWS.
 // Inspect only statements the shared evaluator cannot already rule out.
 if(result.decision==='not-evaluated'&&validation.document){const statements=Array.isArray(validation.document.Statement)?validation.document.Statement:[validation.document.Statement];for(const statement of statements){if(evaluate(JSON.stringify({Version:validation.document.Version,Statement:[statement]})).decision!=='not-evaluated')continue;for(const [operator,conditions]of Object.entries(statement.Condition??{})){if(!['StringEquals','StringLike','ArnEquals','ArnLike','Bool','Null'].includes(operator))continue;for(const key of Object.keys(conditions))if(!Object.keys(context.conditions).some(known=>known.toLowerCase()===key.toLowerCase()))missingKeys.add(key)}}}
 return {...result,uncertainty:missingKeys.size?'needs-context' as const:'unsupported' as const,missingKeys:[...missingKeys]};
}
const inconclusivePolicy=(result:ReturnType<typeof policy>)=>({status:result.uncertainty,explanation:result.missingKeys.length?'The fixture does not supply condition context for '+result.missingKeys.join(', ')+'. No AWS denial is inferred.':result.explanation.join(' ')});
function permission(value:unknown,action:string,resource:string,denyAction?:string){
 const result=policy(value,action,resource);if(result.decision==='not-evaluated')return inconclusivePolicy(result);
 if(result.decision!=='allowed')return {status:'fail' as const,explanation:`The declared identity-policy fixture does not allow ${action} on the supplied resource: ${result.decision}.`};
 if(denyAction){const other=policy(value,denyAction,resource);if(other.decision==='not-evaluated')return inconclusivePolicy(other);if(other.decision==='allowed')return {status:'fail' as const,explanation:`The policy also grants ${denyAction}; that exceeds this fixture's scoped operation requirement.`};}
 return {status:'pass' as const,explanation:`${action} is allowed by the supported identity-policy subset for this supplied context. Other AWS authorization layers remain assumptions.`};
}
function queryOnlyPermission(value:unknown){
 const required=permission(value,'dynamodb:Query',labArns.table);if(required.status!=='pass')return required;
 const doc=validatePolicyDocument(String(value),'identity').document!,statements=Array.isArray(doc.Statement)?doc.Statement:[doc.Statement];
 const list=(v:unknown):string[]=>typeof v==='string'?[v]:Array.isArray(v)?v:[];
 let unbounded=false,uncertain:ReturnType<typeof inconclusivePolicy>|undefined;
 for(const statement of statements.filter(s=>s.Effect==='Allow')){
  const actions=list(statement.Action),resources=list(statement.Resource);const wildcardAction=actions.some(a=>/[?*]/.test(a)),wildcardResource=resources.some(r=>/[?*]/.test(r));unbounded ||=wildcardAction||wildcardResource;
  const actionProbes=[...new Set([...actions.filter(a=>!/[?*]/.test(a)),...(wildcardAction?['dynamodb:Query','dynamodb:GetItem','dynamodb:PutItem','dynamodb:UpdateItem','dynamodb:DeleteItem','dynamodb:Scan']:[])])];
  const resourceProbes=[...new Set([...resources.filter(r=>!/[?*]/.test(r)),...(wildcardResource?[labArns.table,labArns.table+'-other','arn:aws:dynamodb:us-east-1:111122223333:table/OtherOrders']:[])])];
  for(const action of actionProbes)for(const resource of resourceProbes){if(action.toLowerCase()==='dynamodb:query'&&resource===labArns.table)continue;const result=policy(value,action,resource);if(result.decision==='allowed')return {status:'fail' as const,explanation:`Within the modeled subset, the supplied policy also allows ${action} on ${resource}. This fixture requires only Query on the Orders table.`};if(result.decision==='not-evaluated')uncertain=inconclusivePolicy(result);}
 }
 if(uncertain)return uncertain;
 if(unbounded)return {status:'unsupported' as const,explanation:'No extra permission was established by the bounded probes, but wildcard action/resource domains cannot be proved Query-only by this lab. Use explicit scoped resources or review the unsupported policy outside this exercise.'};
 return {status:'pass' as const,explanation:'The required Query is allowed, and the finite explicit action/resource grants do not permit other operations or resources in the supplied principal context. This is not a complete AWS authorization assessment.'};
}
function exactPatternBoundary(value:unknown):string|undefined{
 if(typeof value==='string'&&value.length>10000)return 'Pattern exceeds this exact-match preview’s 10,000-character boundary.';
 const parsed=json(value);
 const visit=(node:any,root=false,depth=0):boolean=>{
  if(depth>10)return true;
  if(Array.isArray(node))return node.some(item=>typeof item==='number'||!!item&&typeof item==='object');
  if(node&&typeof node==='object')return Object.entries(node).some(([key,item])=>key.includes('.')||key.startsWith('$')||root&&!['source','detail-type','detail'].includes(key)||root&&['source','detail-type'].includes(key)&&Array.isArray(item)&&item.some(v=>typeof v!=='string')||visit(item,false,depth+1));
  return false;
 };
 return visit(parsed,true)?'This syntactically valid JSON uses pattern features outside the local exact-value subset (for example prefix/numeric operators or additional envelope fields). It is not classified as an AWS-invalid pattern.':undefined;
}
const configErrors=(service:string,values:Record<string,any>)=>configurationGraphFindings(service,configurationDocument(values)).filter(f=>f.level==='error').map(f=>f.detail);
export function evaluateLab(definition:LabDefinition,values:LabValues):LabResult {
 const checks:LabObjectiveResult[]=[],trace:LabTraceEntry[]=[];
 const check=(id:string,fields:string[],run:()=>{status:LabCheckStatus;explanation:string})=>{
  const missing=fields.filter(k=>values[k]===undefined||values[k]===''||values[k]==='unknown');if(missing.length){checks.push({id,fields,status:'needs-context',explanation:'Supply the missing fixture context: '+missing.join(', ')+'. This is not an AWS-invalid verdict.'});return;}
  for(const key of fields){const field=definition.fields.find(f=>f.key===key),value=values[key];if(!field||(field.kind==='number'?(typeof value!=='number'||!Number.isFinite(value)):typeof value!=='string'||(field.kind==='choice'&&!field.options?.some(o=>o.value===value)))){checks.push({id,fields,status:'fail',explanation:'The lab input '+key+' has the wrong type or a choice outside this exercise.'});return;}}
  try{checks.push({id,fields,...run()})}catch(error){checks.push({id,fields,status:'fail',explanation:'Could not inspect the supplied artifact: '+(error instanceof Error?error.message:'invalid input')})}
 };
 switch(definition.id){
  case 'api-authorization':
   check('invocation',['invokePrincipal','invokeScope'],()=>outcome(values.invokePrincipal==='apigateway.amazonaws.com'&&values.invokeScope==='route-arn','The selected API service principal and route scope match the invocation boundary.','Caller authentication and the function execution role do not supply the scoped API Gateway invocation grant.'));
   check('write',['executionPolicy'],()=>permission(values.executionPolicy,'dynamodb:PutItem',labArns.table,'dynamodb:DeleteItem'));
   check('deadline',['timeoutSeconds'],()=>{const errors=configErrors('lambda',{timeoutSeconds:values.timeoutSeconds});return outcome(!errors.length&&Number.isInteger(values.timeoutSeconds)&&Number(values.timeoutSeconds)>=3,'The declared timeout accommodates the 3-second fixture operation within the local ordinary-function range.',errors.join(' ')||'Use a whole-second timeout that fits the 3-second operation. Increasing it is not a guarantee of downstream success.')});break;
  case 'sqs-batch':{
   check('batch',['responseMode','failedMessageIds'],()=>{const ids=strings(values.failedMessageIds);return outcome(values.responseMode==='partial'&&ids.length===1&&ids[0]==='m-2','The mapping response contract retries m-2 while acknowledging the successful record.','Enable the partial response contract and return only the failed SQS message ID m-2, not order-2 or every record. The supplied top-level throw must be removed as part of that contract.')});
   check('duplicates',['idempotency'],()=>outcome(['conditional-write','transaction-ledger'].includes(String(values.idempotency)),'A durable atomic operation guard is selected; equivalent conditional and transactional strategies both satisfy this fixture.','Worker memory is not a durable, shared guard against duplicate business side effects.'));
   check('visibility',['visibilitySeconds'],()=>outcome(Number.isInteger(values.visibilitySeconds)&&Number(values.visibilitySeconds)>=6&&Number(values.visibilitySeconds)<=43200,'The selected window meets this fixture’s six-times recommendation and the supported SQS range.','Use an integer visibility of at least 6 seconds for this 1-second fixture and no more than the supported queue maximum. The six-times criterion is a lab recommendation goal.'));
   if(checks.every(c=>!['needs-context','unsupported'].includes(c.status))&&Number(values.visibilitySeconds)<=300)trace.push(...simulate('queue',{...defaultConfig,idempotent:['conditional-write','transaction-ledger'].includes(String(values.idempotency)),partialBatch:checks.find(c=>c.id==='batch')?.status==='pass',visibility:Number(values.visibilitySeconds)||1}).map(e=>({title:e.title,detail:e.detail+(e.metrics?' · '+JSON.stringify(e.metrics):''),status:e.status})));break;
  }
  case 'event-routing':{
   const evaluate=(kind:'positive'|'negative')=>{const events=json(definition.fixture.artifacts.find(a=>a.id===kind)!.body) as unknown[];return events.map(event=>evaluateEventBridge({busName:'default',enabled:true,rulePattern:String(values.pattern),sampleEvent:JSON.stringify(event),targets:{}},[]))};
   for(const kind of ['positive','negative'] as const)check(kind,['pattern'],()=>{const outside=exactPatternBoundary(values.pattern);if(outside)return {status:'unsupported',explanation:outside};const results=evaluate(kind),bad=results.find(r=>r.status==='config-error');if(bad)return {status:'fail',explanation:bad.findings.map(f=>f.detail).join(' ')};return outcome(results.every(r=>kind==='positive'?r.matched===true:r.matched===false),kind==='positive'?'Both intended events match.':'Both excluded events remain filtered.',kind==='positive'?'At least one intended paid order is filtered. Read exact source, detail-type and nested status.':'The pattern is too broad for at least one negative fixture.')});
   check('target',['targetGrant'],()=>outcome(values.targetGrant==='scoped-resource-policy','The selected target policy grants the EventBridge service principal access scoped to this rule.','The selected resource-policy path must scope invocation to the rule; the Lambda execution role is a different boundary.'));break;
  }
  case 'dynamodb-access':
   check('write',['writeGuard'],()=>outcome(['not-exists','transaction-ledger'].includes(String(values.writeGuard)),'The selected atomic strategy protects creation against the supplied concurrent attempts.','Reading first and then writing unconditionally can race. The create invariant must be enforced with the write.'));
   check('access',['readTarget','readOperation'],()=>outcome(values.readOperation==='Query','A key-based Query serves the collection lookup on either supplied design.','The fixture asks for a customer collection: GetItem is one table item; scanning everything does not meet the keyed access objective.'));
   check('consistency',['readTarget','readOperation','readConsistency'],()=>{const errors=configErrors('dynamodb',{readTarget:values.readTarget,readOperation:values.readOperation,readConsistency:values.readConsistency});return outcome(!errors.length,'The selected read contract passes the existing bounded DynamoDB checks.',errors.join(' '))});break;
  case 's3-kms':
   check('object',['identityPolicy'],()=>permission(values.identityPolicy,'s3:GetObject',labArns.object));
   check('decrypt',['identityPolicy','keyContext'],()=>values.keyContext!=='provided-delegation'?{status:'fail',explanation:'Bucket encryption does not establish key permission. Use the explicit supplied key-policy context or leave this Needs context.'}:permission(values.identityPolicy,'kms:Decrypt',labArns.key));
   check('scope',['identityPolicy'],()=>{const result=policy(values.identityPolicy,'s3:GetObject',labArns.otherObject);return result.decision==='not-evaluated'?inconclusivePolicy(result):outcome(result.decision!=='allowed','The unrelated private object is not allowed by this supplied identity policy.','The repair also exposes the excluded private object. Narrow the object resources or add a suitable explicit restriction.')} );break;
  case 'cognito-sts':
   check('federation',['credentialPath'],()=>outcome(['identity-pool','web-identity'].includes(String(values.credentialPath)),'A supplied configured federation path obtains a temporary AWS session.','A user-pool JWT is an identity token, not the AWS access key/secret/session-token credential set.'));
   check('signing',['requestAuth','refresh'],()=>outcome(values.requestAuth==='sigv4'&&values.refresh==='provider','The SDK signs requests with a refreshed temporary session.','The AWS API needs the selected signing/session contract; extending a user token does not refresh copied AWS credentials.'));
   check('permission',['rolePolicy'],()=>queryOnlyPermission(values.rolePolicy));break;
  case 'private-connectivity':
   check('dns',['privateDns','vpcDns'],()=>outcome(values.privateDns==='enabled'&&values.vpcDns==='both','The chosen private DNS path has both VPC prerequisites declared.','For the supplied standard service hostname path, enable endpoint private DNS and both VPC DNS prerequisites.'));
   check('network',['fromPort','toPort','source'],()=>{const errors=trafficRuleErrors({protocol:'tcp',fromPort:values.fromPort,toPort:values.toPort});return outcome(!errors.length&&values.fromPort===443&&values.toPort===443&&values.source==='app-sg','The rule matches the fixture’s scoped HTTPS ingress requirement.',errors.join(' ')||'Use TCP 443 from the supplied application group; open internet ingress or port 80 does not meet this requirement.')});
   check('authorization',['authorization'],()=>outcome(values.authorization==='supplied-scoped','The separate supplied identity/endpoint authorization fixture is acknowledged. Actual permission was not queried.','A private network path is not an authorization grant. Inspect the caller and endpoint-policy evidence.'));break;
  case 'ecs-artifact':
   check('runtime',['networkMode','taskCpu','taskMemoryMb'],()=>{if(Number(values.taskCpu)>4096)return {status:'unsupported',explanation:'This lab uses the reviewed small Linux Fargate size subset up to 4096 CPU units. Larger platform-specific sizes are not graded here.'};const errors=configErrors('ecs',{compute:'fargate',operatingSystem:'linux',networkMode:values.networkMode,taskCpu:values.taskCpu,taskMemoryMb:values.taskMemoryMb});return outcome(!errors.length&&Number(values.taskCpu)>=256&&Number(values.taskMemoryMb)>=512,'The selected task shape satisfies the existing bounded Fargate checks and fixture minimums.',errors.join(' ')||'The selected task shape does not meet this fixture’s minimum resources.')});
   check('artifact',['image'],()=>outcome(values.image===approvedDigest||values.image==='111122223333.dkr.ecr.us-east-1.amazonaws.com/study-app@'+approvedDigest,'The image identifies the tested digest from the supplied build receipt.','A mutable tag or another digest does not identify the bytes approved by this fixture.'));
   check('identity',['executionRole','taskPolicy'],()=>values.executionRole!=='pull-logs'?{status:'fail',explanation:'The execution role needs its supplied image/log permissions independently of the task-role data permission.'}:permission(values.taskPolicy,'dynamodb:PutItem',labArns.table,'dynamodb:DeleteItem'));break;
  case 'pipeline-artifact':
   check('wiring',['deploymentInput'],()=>outcome(values.deploymentInput==='BuildOutput','The deployment consumes the producer’s named build artifact.','SourceOutput and a test report are not the build artifact emitted for deployment.'));
   check('bytes',['deployedDigest','promotion'],()=>outcome(values.deployedDigest===approvedDigest&&values.promotion==='reuse-artifact','The tested digest is promoted unchanged; no new build is substituted.','The supplied contract requires the approved bytes, not merely the same branch, commit or a newly resolved tag.'));
   check('manifest',['manifest'],()=>{const m=json(values.manifest);return outcome(m&&typeof m==='object'&&!Array.isArray(m)&&m.artifactName==='BuildOutput'&&m.digest===approvedDigest&&m.sourceRevision==='commit-demo-42','The receipt reconciles artifact name, approved digest and source revision. Extra metadata is allowed.','Reconcile all three identifiers with the approved build receipt. Formatting, property order and extra metadata do not affect this invariant.')});break;
  case 'rollout-rollback':{
   check('exposure',['canary','alarmScope'],()=>outcome(Number.isInteger(values.canary)&&Number(values.canary)>0&&Number(values.canary)<=25&&values.alarmScope==='candidate','Candidate evidence exists within the declared nonzero exposure budget.','Use a nonzero whole canary percentage no greater than the application’s 25% budget, and candidate-specific alarm evidence. Zero traffic provides no candidate observation.'));
   check('rollback',['rollback','canary','alarmScope'],()=>outcome(values.rollback==='enabled'&&values.alarmScope==='candidate'&&Number(values.canary)>0&&Number(values.canary)<=100,'The supplied deployment controller restores traffic to stable version 1 after the modeled candidate alarm.','An alias or an alarm alone does not perform the required restore action. The candidate must receive traffic to exercise this fixture.'));
   check('data',['dataPlan'],()=>outcome(values.dataPlan==='reconcile','A separate data compatibility/reconciliation plan remains required after traffic restoration.','Traffic rollback does not reverse durable business writes.'));
   if(typeof values.canary==='number'&&Number.isInteger(values.canary)&&values.canary>=0&&values.canary<=100)trace.push(...simulate('deployment',{...defaultConfig,faultyVersion:true,canary:values.canary,rollback:values.rollback==='enabled'&&values.alarmScope==='candidate'}).map(e=>({title:e.title,detail:e.detail+(e.metrics?' · '+JSON.stringify(e.metrics):''),status:e.status})));break;
  }
  case 'telemetry':
   check('diagnosis',['diagnosis','correlation'],()=>outcome(values.diagnosis==='dependency-throttle'&&values.correlation==='propagate','The supplied storage throttle is correlated through the request’s trace context.','The authorizer already succeeded; matching service names or unrelated IDs cannot connect these operations.'));
   check('privacy',['logFields'],()=>{const fields=strings(values.logFields),allowed=['requestId','traceId','service','environment','errorCode'];return outcome(fields.includes('errorCode')&&(fields.includes('requestId')||fields.includes('traceId'))&&fields.every(f=>allowed.includes(f)),'The projection retains correlation/error evidence and excludes the sensitive Authorization field.','Retain an error category plus requestId or traceId. Emit only supplied non-sensitive fields; Authorization is excluded.')});
   check('alarm',['metricDimension','evaluationPeriods','datapointsToAlarm'],()=>{const errors=configErrors('cloudwatch',{periodSeconds:60,evaluationPeriods:values.evaluationPeriods,datapointsToAlarm:values.datapointsToAlarm});return outcome(values.metricDimension==='service-environment'&&!errors.length,'The bounded dimensions and M/N alarm contract pass the local check.',errors.join(' ')||'Use bounded service/environment dimensions for this aggregate metric, not per-request or sensitive values.')});break;
  case 'ai-tool-boundary':
   check('authority',['authority'],()=>outcome(values.authority==='caller-policy','Authenticated caller and policy context remain authoritative; retrieved text is data.','External text or model confidence cannot grant caller privileges.'));
   check('tool',['allowedTools','tenantCheck','approval'],()=>{const tools=strings(values.allowedTools);return outcome(tools.length===1&&tools[0]==='readOrder'&&values.tenantCheck==='enforce'&&values.approval==='required','The refund proposal is denied by tool scope, tenant mismatch and absent independent approval.','Preserve the supplied readOrder-only caller policy, enforce tenant ownership and require independent approval. Editing policy text is not evidence that a human approved this refund.')});
   check('output',['outputHandling'],()=>outcome(values.outputHandling==='validate-reject','The string amount violates the supplied numeric schema; output is rejected before side effects.','JSON parsing alone does not establish the required types or business constraints.'));break;
  default: return {status:'unsupported',checks:[],trace:[],scope:'This lab definition has no local evaluator.'};
 }
 for(const objective of definition.objectives)if(!checks.some(c=>c.id===objective.id))checks.push({id:objective.id,status:'unsupported',fields:[],explanation:'No local invariant is registered for this objective.'});
 if(!trace.length)trace.push(...checks.map(c=>({title:definition.objectives.find(o=>o.id===c.id)?.title??c.id,detail:c.explanation,status:c.status==='pass'?'success' as const:c.status==='fail'?'error' as const:'warning' as const})));
 const status=checks.every(c=>c.status==='pass')?'objectives-met':checks.some(c=>c.status==='fail')?'needs-repair':checks.some(c=>c.status==='unsupported')?'unsupported':'needs-context';
 return {status,checks,trace,scope};
}
export function createLabSession(definition:LabDefinition,id:string=globalThis.crypto.randomUUID(),now=new Date().toISOString()):LabSession{return {schemaVersion:1,id,labId:definition.id,definitionVersion:definition.version,startedAt:now,updatedAt:now,startingFixture:structuredClone(definition.fixture),values:structuredClone(definition.fixture.values),attempts:[]}}
export function runLabAttempt(session:LabSession,now=new Date().toISOString()):LabSession {
 const definition=getLabDefinition(session.labId);if(!definition||definition.version!==session.definitionVersion)throw new Error('This session belongs to a different lab definition version. Export it before starting a new session.');
 if(session.attempts.length>=100)throw new Error('This session reached the local 100-attempt limit. Export it and start a new session.');
 const attempt:LabAttempt={id:globalThis.crypto.randomUUID(),at:now,values:structuredClone(session.values),result:evaluateLab(definition,session.values)};
 return {...session,updatedAt:now,attempts:[...session.attempts,attempt]};
}
