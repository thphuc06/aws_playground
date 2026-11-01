/** Small local execution previews, not AWS deployments or a full runtime emulator. */
export interface CoreFinding {severity:'error'|'warning'|'info';title:string;detail:string;sourceUrl:string;edgeId?:string}
export interface LambdaConfig {timeoutSeconds:number;mockDurationMs:number}
export interface LambdaTarget {edgeId:string;service:string;label:string;permission:boolean}
export interface LambdaResult {status:'completed'|'timed-out'|'config-error';findings:CoreFinding[];targets:{edgeId:string;status:'ready'|'permission-missing'|'unmodeled';detail:string}[]}
export type HTTPMethod='GET'|'POST';
export interface HTTPRoute {method:HTTPMethod;path:string;deployed:boolean}
export interface HTTPApiConfig {routes:Record<string,HTTPRoute>;sampleMethod:HTTPMethod;samplePath:string}
export interface HTTPApiTarget {edgeId:string;service:string;label:string;integration:boolean;permission:boolean;lambdaConfig?:LambdaConfig}
export interface HTTPApiResult {status:'completed'|'no-route'|'undeployed'|'integration-timeout'|'lambda-timeout'|'config-error';edgeId?:string;targetLabel?:string;findings:CoreFinding[]}
export const defaultLambdaConfig: Readonly<LambdaConfig>=Object.freeze({timeoutSeconds:3,mockDurationMs:100});
export const defaultHTTPRoute: Readonly<HTTPRoute>=Object.freeze({method:'POST',path:'/tasks',deployed:false});
export const defaultHTTPApiConfig:HTTPApiConfig={routes:{},sampleMethod:'POST',samplePath:'/tasks'};
export const coreServiceSources={
 lambdaTimeout:'https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html',
 lambdaRole:'https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html',
 dynamodb:'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/iam-policy-specific-table-indexes.html',
 sqs:'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-api-permissions-reference.html',
 stages:'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-stages.html',
 routes:'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html',
 integration:'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html',
 permission:'https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html',
 limits:'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-quotas.html',
};
export const coreServiceLimitations=[
 'Local teaching previews only: no code execution, AWS requests, deployment, or policy changes. A completed mock is not proof that real handler code succeeds.',
 'Ordinary Lambda Event Functions only: Lambda models timeout and declared mock duration, plus DynamoDB PutItem / SQS SendMessage execution-role assertions on outgoing edges. It does not model memory, concurrency, retries, startup, networking, encryption, or full IAM evaluation.',
 'Timeout equality is treated conservatively as timeout in this deterministic teaching model, not a guarantee about real scheduling. No timeout proves the absence or rollback of earlier side effects.',
 'The deployed switch describes the current route configuration. Earlier deployment snapshots and auto-deployment are not modeled; an undeployed edit does not prove a real existing endpoint stopped serving.',
 'HTTP API models GET/POST exact literal paths, payload format 2.0, auth NONE, and the $default stage. This intentionally unauthenticated example is not a production security recommendation.',
 'Path parameters, greedy variables, wildcards, $default routes, query strings, URL encoding, request bodies, CORS, authorizers, response mapping, and custom domains are outside this preview.',
 'One sample HTTP request selects at most one exact route and one Lambda target. Whole-graph dependency walkthroughs are separate and do not represent HTTP fan-out.',
 'The preview assumes the HTTP API maximum integration timeout of 30 seconds; a configured lower timeout is not modeled. An HTTP timeout does not imply Lambda was cancelled. Incoming API invocation permission is a Lambda resource policy, separate from its execution role.',
];
const obj=(v:unknown):v is Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v);
export function isLambdaConfig(v:unknown):v is LambdaConfig{return obj(v)&&typeof v.timeoutSeconds==='number'&&Number.isFinite(v.timeoutSeconds)&&typeof v.mockDurationMs==='number'&&Number.isFinite(v.mockDurationMs)}
export function isHTTPApiConfig(v:unknown):v is HTTPApiConfig{
 if(!obj(v)||!obj(v.routes)||!['GET','POST'].includes(v.sampleMethod as string)||typeof v.samplePath!=='string'||v.samplePath.length>256)return false;
 const entries=Object.entries(v.routes);return entries.length<=40&&entries.every(([id,r])=>id.length>0&&id.length<=256&&obj(r)&&['GET','POST'].includes(r.method as string)&&typeof r.path==='string'&&r.path.length<=256&&typeof r.deployed==='boolean');
}
function lambdaFindings(config:LambdaConfig):CoreFinding[]{
 const findings:CoreFinding[]=[];
 if(!isLambdaConfig(config)||!Number.isInteger(config.timeoutSeconds)||config.timeoutSeconds<1||config.timeoutSeconds>900)findings.push({severity:'error',title:'Invalid Lambda timeout',detail:'Set a whole-number timeout from 1 to 900 seconds; the AWS default is 3 seconds.',sourceUrl:coreServiceSources.lambdaTimeout});
 if(!isLambdaConfig(config)||!Number.isSafeInteger(config.mockDurationMs)||config.mockDurationMs<0)findings.push({severity:'error',title:'Invalid mock duration',detail:'Set a nonnegative safe whole-number duration in milliseconds. This is a teaching input, not an AWS setting.',sourceUrl:coreServiceSources.lambdaTimeout});
 return findings;
}
export function evaluateLambda(config:LambdaConfig,outgoingTargets:readonly LambdaTarget[]):LambdaResult{
 const findings=lambdaFindings(config),targets:LambdaResult['targets']=[];
 if(outgoingTargets.length>40)findings.push({severity:'error',title:'Preview connection limit',detail:'At most 40 outgoing connections can be inspected.',sourceUrl:coreServiceSources.lambdaRole});
 const seen=new Set<string>();
 for(const t of outgoingTargets.slice(0,40)){
  if(!t.edgeId||seen.has(t.edgeId))findings.push({severity:'error',title:'Duplicate or empty connection ID',detail:'Every outgoing connection needs a unique nonempty ID.',sourceUrl:coreServiceSources.lambdaRole});seen.add(t.edgeId);
  if(!['dynamodb','sqs'].includes(t.service)){const detail=`${t.label}: downstream behavior is outside this Lambda preview, not necessarily unsupported by AWS.`;targets.push({edgeId:t.edgeId,status:'unmodeled',detail});findings.push({severity:'warning',title:'Downstream integration not modeled',detail,edgeId:t.edgeId,sourceUrl:coreServiceSources.lambdaRole});continue;}
  const action=t.service==='dynamodb'?'dynamodb:PutItem on this table ARN':'sqs:SendMessage on this queue ARN';
  const detail=`Lambda execution role must allow ${action}. API Gateway invocation permission does not grant this downstream access.`;
  targets.push({edgeId:t.edgeId,status:t.permission===true?'ready':'permission-missing',detail:t.permission===true?`Declared execution-role grant permits ${action}; no actual AWS policy or operation is tested.`:detail});
  if(t.permission!==true)findings.push({severity:'error',title:'Downstream execution-role grant missing',detail,edgeId:t.edgeId,sourceUrl:t.service==='dynamodb'?coreServiceSources.dynamodb:coreServiceSources.sqs});
 }
 if(findings.some(f=>f.severity==='error'))return {status:'config-error',findings,targets};
 const timedOut=config.mockDurationMs>=config.timeoutSeconds*1000;
 findings.push({severity:timedOut?'warning':'info',title:timedOut?'Mock invocation timed out':'Mock invocation completed',detail:timedOut?`Declared work takes ${config.mockDurationMs}ms and reaches the ${config.timeoutSeconds}s function limit. No real code was run.`:`Declared ${config.mockDurationMs}ms work finishes before the ${config.timeoutSeconds}s limit. Downstream targets are configuration assertions, not executed operations.`,sourceUrl:coreServiceSources.lambdaTimeout});
 return {status:timedOut?'timed-out':'completed',findings,targets};
}
const literalPath=(path:string)=>/^\/[A-Za-z0-9/_.~-]*$/.test(path)&&path.length<=256;
export function evaluateHTTPApi(config:HTTPApiConfig,outgoingTargets:readonly HTTPApiTarget[]):HTTPApiResult{
 const findings:CoreFinding[]=[];
 const add=(severity:CoreFinding['severity'],title:string,detail:string,sourceUrl=coreServiceSources.routes,edgeId?:string)=>findings.push({severity,title,detail,sourceUrl,edgeId});
 if(!isHTTPApiConfig(config)){add('error','Invalid HTTP API configuration','Restore a GET/POST request and a bounded route map with string paths and deployment switches.');return {status:'config-error',findings};}
 if(!literalPath(config.samplePath))add('error','Unsupported sample path','Use a literal path beginning with / (letters, numbers, /, underscore, dot, tilde, hyphen). Empty paths, parameters, wildcard routes, encoding, and query strings are not modeled.');
 if(outgoingTargets.length>40)add('error','Preview connection limit','At most 40 outgoing connections can be inspected.');
 const routes:{target:HTTPApiTarget;route:HTTPRoute}[]=[],ids=new Set<string>(),keys=new Set<string>();
 for(const target of outgoingTargets.slice(0,40)){
  if(!target.edgeId||ids.has(target.edgeId))add('error','Duplicate or empty connection ID','Each target connection needs a unique nonempty ID.');ids.add(target.edgeId);
  if(target.service!=='lambda'){add('warning','HTTP integration outside this preview',`${target.label}: only Lambda proxy targets are modeled here; AWS may support other integrations.`,coreServiceSources.integration,target.edgeId);continue;}
  const route=config.routes[target.edgeId];if(!route)continue;
  if(!literalPath(route.path))add('error','Unsupported route path','Use an exact literal path beginning with /. Path parameters, greedy paths, wildcard/$default routes, encoding, and query strings are outside this model.',coreServiceSources.routes,target.edgeId);
  const key=JSON.stringify([route.method,route.path]);if(keys.has(key))add('error','Duplicate route','A method and literal path can select only one target. Give each connection a distinct route or remove it.',coreServiceSources.routes,target.edgeId);keys.add(key);routes.push({target,route});
 }
 if(findings.some(f=>f.severity==='error'))return {status:'config-error',findings};
 const selected=routes.find(({route})=>route.method===config.sampleMethod&&route.path===config.samplePath);
 if(!selected){add('info','No matching route','No configured Lambda route exactly matches this method and path. Check spelling, case, trailing slash, method, and route attachment.');return {status:'no-route',findings};}
 const {target,route}=selected,ref={edgeId:target.edgeId,targetLabel:target.label};
 if(!route.deployed){add('error','Selected route is undeployed','Mark the current route configuration deployed to the teaching $default stage before previewing it. Earlier deployment snapshots are not modeled.',coreServiceSources.stages,target.edgeId);return {status:'undeployed',...ref,findings};}
 if(target.integration!==true)add('error','Lambda proxy integration missing','Configure this route’s Lambda integration with payload format 2.0.',coreServiceSources.integration,target.edgeId);
 if(target.permission!==true)add('error','API invocation resource permission missing','The target Lambda resource policy must grant API Gateway lambda:InvokeFunction scoped to this API. The Lambda execution role cannot replace this grant.',coreServiceSources.permission,target.edgeId);
 const lambda=target.lambdaConfig??defaultLambdaConfig;findings.push(...lambdaFindings(lambda));
 if(findings.some(f=>f.severity==='error'))return {status:'config-error',...ref,findings};
 const lambdaEnd=Math.min(lambda.mockDurationMs,lambda.timeoutSeconds*1000);
 if(lambdaEnd>=30000){add('warning','HTTP integration timed out','The response reaches the modeled 30-second HTTP API ceiling. This does not imply Lambda was cancelled or prove whether its later work succeeded.',coreServiceSources.limits,target.edgeId);return {status:'integration-timeout',...ref,findings};}
 if(lambda.mockDurationMs>=lambda.timeoutSeconds*1000){add('warning','Target Lambda timed out',`The function reaches its ${lambda.timeoutSeconds}s timeout before the HTTP API limit. No successful application response is modeled.`,coreServiceSources.lambdaTimeout,target.edgeId);return {status:'lambda-timeout',...ref,findings};}
 add('info','One route completed',`${route.method} ${route.path} selects ${target.label} only. Its declared ${lambda.mockDurationMs}ms mock finishes within both time limits; no real handler, request body, or response mapping was executed.`,coreServiceSources.integration,target.edgeId);
 return {status:'completed',...ref,findings};
}
