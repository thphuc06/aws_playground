/** EventBridge exact-value preview. Pure local evaluation, never event delivery. */
export interface EventBridgeTargetSettings { attached: boolean; permission: boolean }
export interface EventBridgeConfig { busName: string; enabled: boolean; rulePattern: string; sampleEvent: string; targets: Record<string, EventBridgeTargetSettings> }
export interface EventBridgeTarget { edgeId: string; service: string; label: string }
export interface EventBridgeFinding { severity: 'error'|'warning'|'info'; title: string; detail: string; sourceUrl: string }
export interface EventBridgeTargetResult { edgeId: string; label: string; status: 'ready'|'permission-missing'|'unsupported'|'detached'; detail: string }
export interface EventBridgeResult { status: 'matched'|'filtered'|'disabled'|'config-error'; matched: boolean|null; findings: EventBridgeFinding[]; targets: EventBridgeTargetResult[] }
export const eventBridgeSources = {
 bus:'https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_CreateEventBus.html',
 pattern:'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-pattern.html',
 arrays:'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns-arrays.html',
 permissions:'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-use-resource-based.html',
 targets:'https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutTargets.html',
};
export const defaultEventBridgeConfig: EventBridgeConfig = {
 busName:'default', enabled:true,
 rulePattern: JSON.stringify({source:['study.orders'],'detail-type':['OrderCreated'],detail:{status:['paid']}},null,2),
 sampleEvent: JSON.stringify({source:'study.orders','detail-type':'OrderCreated',detail:{status:'paid',orderId:'demo-001'}},null,2), targets:{},
};
export const eventBridgeLimitations = [
 'Local rule preview only; no PutEvents, deployments, permission changes, charges, or downstream Lambda execution.',
 'One Classic enabled/disabled rule on a default or custom bus; same-account, same-Region Lambda or standard SQS targets only. Bus and service labels do not change matching.',
 'Pattern subset: source, detail-type, and nested detail. Keys are AND; exact string, boolean, or null alternatives in nonempty leaf arrays are OR. Event-array matching uses intersection.',
 'Numeric pattern values, operators, dotted keys, duplicate JSON keys, and arrays of objects are rejected rather than approximated. Numeric event values may exist but cannot be selected by this subset.',
 'Sample input accepts only source, detail-type, and detail. Actual AWS event envelopes also contain fields such as id, time, account, region, and resources; remove these for this reduced preview, not for real AWS events.',
 'JSON input is limited to 10,000 characters and depth 10. Missing fields fail a match. Strings match case-sensitively, without normalization.',
 'This preview chooses target resource policies without an EventBridge target execution role. AWS also supports target execution roles; those are distinct from a Lambda function execution role. Resource-policy assertions model EventBridge invocation/send grants. IAM policy parsing, publisher permissions, retries, DLQs, Scheduler, Pipes, FIFO, and real delivery are not modeled.',
];
type Json = null | boolean | number | string | Json[] | {[key:string]:Json};
const object = (v: unknown): v is Record<string,unknown> => v !== null && typeof v === 'object' && !Array.isArray(v);
/** Strict bounded parser rejects duplicate object keys before JSON.parse could discard them. */
export function parseEventBridgeJson(input: string): Json {
 if (typeof input !== 'string' || input.length > 10000) throw new Error('JSON must be a string of at most 10,000 characters.');
 let p=0;
 const ws=()=>{while(/[\x20\t\r\n]/.test(input[p]??'') && p<input.length)p++};
 const str=():string=>{const start=p++;while(p<input.length){const c=input[p++];if(c==='"')return JSON.parse(input.slice(start,p)) as string;if(c==='\\')p++;}throw new Error('Unterminated JSON string.')};
 const read=(depth:number):Json=>{
  ws(); if(depth>10)throw new Error('JSON nesting exceeds the depth-10 teaching limit.');
  const c=input[p];
  if(c==='"')return str();
  if(c==='{'){p++;ws();const out:{[key:string]:Json}=Object.create(null);const keys=new Set<string>();if(input[p]==='}'){p++;return out;}while(true){ws();if(input[p]!=='"')throw new Error('Expected a quoted JSON object key.');const key=str();if(keys.has(key))throw new Error(`Duplicate JSON key: ${key}.`);keys.add(key);ws();if(input[p++]!==':')throw new Error('Expected colon after JSON key.');out[key]=read(depth+1);ws();const end=input[p++];if(end==='}')return out;if(end!==',')throw new Error('Expected comma or closing brace.');}}
  if(c==='['){p++;ws();const out:Json[]=[];if(input[p]===']'){p++;return out;}while(true){out.push(read(depth+1));ws();const end=input[p++];if(end===']')return out;if(end!==',')throw new Error('Expected comma or closing bracket.');}}
  const token=/^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(input.slice(p));
  if(!token)throw new Error('Invalid JSON value.');p+=token[0].length;const value:Json=JSON.parse(token[0]);if(typeof value==='number'&&!Number.isFinite(value))throw new Error('Non-finite JSON numbers are not modeled.');return value;
 };
 const value=read(0);ws();if(p!==input.length)throw new Error('Unexpected trailing JSON content.');return value;
}
export function isEventBridgeConfig(value: unknown): value is EventBridgeConfig {
 if(!object(value)||typeof value.busName!=='string'||value.busName.length>256||typeof value.enabled!=='boolean'||typeof value.rulePattern!=='string'||value.rulePattern.length>10000||typeof value.sampleEvent!=='string'||value.sampleEvent.length>10000||!object(value.targets))return false;
 const entries=Object.entries(value.targets);return entries.length<=40 && entries.every(([id,s])=>id.length>0&&id.length<=256&&object(s)&&typeof s.attached==='boolean'&&typeof s.permission==='boolean');
}
function checkPattern(value:Json,root=true):void {
 if(!object(value)||!Object.keys(value).length)throw new Error('Pattern must contain at least one supported field.');
 for(const [key,v] of Object.entries(value)){
  if(key.includes('.')||key.startsWith('$'))throw new Error('Dotted keys and operator keys are not modeled.');
  if(root&&!['source','detail-type','detail'].includes(key))throw new Error(`Top-level pattern field ${key} is outside the source/detail-type/detail subset.`);
  if(Array.isArray(v)) {if(root&&key!=='detail'&&v.some(x=>typeof x!=='string'))throw new Error('source and detail-type patterns must contain exact strings.');if(!v.length)throw new Error('Pattern leaf arrays must not be empty.');for(const choice of v)if(choice!==null&&typeof choice!=='string'&&typeof choice!=='boolean')throw new Error('Only exact string, boolean, or null alternatives are modeled; numeric patterns and operators are rejected.');if(root&&key==='detail')throw new Error('Pattern detail must be a nested object.');}
  else if(object(v)&&(!root||key==='detail')) checkPattern(v as Json,false);
  else throw new Error('Pattern leaves must be arrays of exact alternatives.');
 }
}
function checkEvent(value:Json):void {
 if(!object(value)||typeof value.source!=='string'||typeof value['detail-type']!=='string'||!object(value.detail))throw new Error('Sample event requires string source, string detail-type, and an object detail.');
 if(Object.keys(value).some(k=>!['source','detail-type','detail'].includes(k)))throw new Error('Sample event supports only source, detail-type, and detail; remove other envelope fields for this preview.');
 const visit=(v:unknown):void=>{if(Array.isArray(v)){if(v.some(x=>object(x)||Array.isArray(x)))throw new Error('Arrays of objects or arrays are outside this preview.');}else if(object(v)){for(const [k,x]of Object.entries(v)){if(k.includes('.'))throw new Error('Dotted event keys are not modeled.');visit(x);}}};visit(value.detail);
}
function matches(pattern:Record<string,unknown>,event:Record<string,unknown>):boolean {
 return Object.entries(pattern).every(([key,condition])=>{
  if(!Object.hasOwn(event,key))return false;const actual=event[key];
  if(Array.isArray(condition)){const values=Array.isArray(actual)?actual:[actual];return condition.some(choice=>values.some(value=>value===choice));}
  return object(condition)&&object(actual)&&matches(condition,actual);
 });
}
export function evaluateEventBridge(config:EventBridgeConfig, outgoingTargets: readonly EventBridgeTarget[]):EventBridgeResult {
 const findings:EventBridgeFinding[]=[], targets:EventBridgeTargetResult[]=[];
 const add=(severity:EventBridgeFinding['severity'],title:string,detail:string,sourceUrl=eventBridgeSources.pattern)=>findings.push({severity,title,detail,sourceUrl});
 if(!isEventBridgeConfig(config)){add('error','Invalid saved configuration','Reset EventBridge settings; saved data does not match the bounded configuration schema.');return {status:'config-error',matched:null,findings,targets};}
 if(!/^[A-Za-z0-9_.-]{1,256}$/.test(config.busName))add('error','Invalid bus name','Use default or a custom bus name with letters, numbers, dot, underscore, or hyphen. ARNs and partner buses are outside this preview. The name default selects the existing default bus; it does not create a custom bus.',eventBridgeSources.bus);
 let pattern:Json|undefined,event:Json|undefined;
 try{pattern=parseEventBridgeJson(config.rulePattern);checkPattern(pattern);}catch(e){add('error','Fix rule pattern',e instanceof Error?e.message:'Invalid pattern.');}
 try{event=parseEventBridgeJson(config.sampleEvent);checkEvent(event);}catch(e){add('error','Fix sample event',e instanceof Error?e.message:'Invalid sample event.');}
 if(outgoingTargets.length>40)add('error','Preview target limit','At most 40 outgoing canvas connections can be inspected.');
 const ids=new Set<string>();let attached=0;
 for(const target of outgoingTargets.slice(0,40)) {
  if(ids.has(target.edgeId)||!target.edgeId)add('error','Invalid target connection','Each target connection must have a unique nonempty edge ID.');ids.add(target.edgeId);
  const setting=config.targets[target.edgeId];
  if(!setting?.attached){targets.push({...target,status:'detached',detail:'Connected on the canvas but not attached to this rule; no delivery is previewed.'});continue;}
  attached++;
  if(target.service!=='lambda'&&target.service!=='sqs'){targets.push({...target,status:'unsupported',detail:'This app models Lambda and standard SQS targets only; this does not imply AWS lacks other integrations.'});add('error','Target not modeled',`${target.label}: choose Lambda or standard SQS, or detach this target.`,eventBridgeSources.targets);continue;}
  const detail=target.service==='lambda'?'For this resource-policy model (no target execution role), the Lambda resource policy must allow events.amazonaws.com to call lambda:InvokeFunction, scoped to this rule ARN.':'For this resource-policy model (no target execution role), the SQS queue resource policy must allow events.amazonaws.com to call sqs:SendMessage, scoped to this rule ARN.';
  if(!setting.permission){targets.push({...target,status:'permission-missing',detail});add('error','Target resource permission missing',detail+' This is not the Lambda execution role.',eventBridgeSources.permissions);}
  else targets.push({...target,status:'ready',detail:'Attachment and resource-policy assertions are ready; actual permissions and delivery are not verified.'});
 }
 if(attached>5)add('error','Too many rule targets','EventBridge allows at most 5 targets per rule. Detach targets until at most 5 remain.',eventBridgeSources.targets);
 if(findings.some(f=>f.severity==='error'))return {status:'config-error',matched:null,findings,targets};
 if(!config.enabled){add('info','Rule disabled','No sample event is evaluated for delivery while this rule is disabled.');return {status:'disabled',matched:null,findings,targets};}
 const matched=matches(pattern as Record<string,unknown>,event as Record<string,unknown>);
 if(!attached)add('warning','No attached targets','You can test pattern matching, but attach a target and assert its resource policy to preview a destination.',eventBridgeSources.targets);
 add('info',matched?'Pattern matched':'Event filtered',matched?'All specified fields matched. Ready targets are eligible for a modeled delivery, not proof of execution. Lambda acceptance is asynchronous and does not prove handler success.':'At least one specified field is absent or has no exact matching alternative. Check source, detail-type, nested values, and letter case.');
 return {status:matched?'matched':'filtered',matched,findings,targets};
}
