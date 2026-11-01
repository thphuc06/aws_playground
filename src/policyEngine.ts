import {managedPolicySnapshots} from './managedPolicySnapshots';
import {parseConfigurationDocument} from './configurationDocuments';
import type {PolicyRecord} from './configurationTypes';
export type PolicyKind=PolicyRecord['kind'];
type Statement={Sid?:string;Effect:'Allow'|'Deny';Action?:string|string[];NotAction?:string|string[];Resource?:string|string[];NotResource?:string|string[];Principal?:unknown;NotPrincipal?:unknown;Condition?:Record<string,Record<string,unknown>>};
export interface PolicyDocument {Version?:string;Id?:string;Statement:Statement|Statement[]}
export interface PolicyValidation {document?:PolicyDocument;errors:string[];warnings:string[];visualSupported:boolean;characters:number}
const record=(v:unknown):v is Record<string,any>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const strings=(v:unknown)=>typeof v==='string'&&v.length>0||Array.isArray(v)&&v.length>0&&v.every(x=>typeof x==='string'&&x.length>0);
const list=(v:unknown):string[]=>typeof v==='string'?[v]:Array.isArray(v)?v:[];
export function validatePolicyDocument(text:string,kind:PolicyKind='identity'):PolicyValidation{
 const parsed=parseConfigurationDocument(text);const result:PolicyValidation={errors:[...parsed.errors],warnings:[],visualSupported:true,characters:0};if(parsed.errors.length)return {...result,visualSupported:false};
 const d=parsed.value as Record<string,any>;if(!record(d)){result.errors.push('Policy must be a JSON object.');return {...result,visualSupported:false};}
 result.characters=JSON.stringify(d).length;
 for(const key of Object.keys(d))if(!['Version','Id','Statement'].includes(key)){result.errors.push('Unknown top-level policy element: '+key);result.visualSupported=false;}
 if(d.Version!==undefined&&!['2012-10-17','2008-10-17'].includes(d.Version))result.errors.push('Unrecognized policy language version.');
 if(d.Version!=='2012-10-17')result.warnings.push('Use Version 2012-10-17 for current policy language features.');
 const statements=Array.isArray(d.Statement)?d.Statement:[d.Statement];
 if(!statements.length||statements.length>200)result.errors.push('Use 1–200 statements (200 is an app guardrail).');
 for(const [i,s]of statements.entries()){
  const prefix='Statement '+(i+1)+': ';if(!record(s)){result.errors.push(prefix+'expected an object.');continue;}
  for(const key of Object.keys(s))if(!['Sid','Effect','Action','NotAction','Resource','NotResource','Principal','NotPrincipal','Condition'].includes(key)){result.errors.push(prefix+'unknown element '+key);result.visualSupported=false;}
  if(!['Allow','Deny'].includes(s.Effect))result.errors.push(prefix+'Effect must be Allow or Deny.');
  if(s.Sid!==undefined&&typeof s.Sid!=='string')result.errors.push(prefix+'Sid must be text.');
  for(const [a,b]of [['Action','NotAction'],['Resource','NotResource'],['Principal','NotPrincipal']])if(s[a]!==undefined&&s[b]!==undefined)result.errors.push(prefix+a+' and '+b+' are mutually exclusive.');
  if(!strings(s.Action??s.NotAction))result.errors.push(prefix+'Action or NotAction must contain nonempty action strings.');
  if(['resource','kms'].includes(kind)&&s.Principal===undefined&&s.NotPrincipal===undefined)result.errors.push(prefix+'resource/key policy requires Principal.');
  if(kind==='trust'){
   if(s.Resource!==undefined||s.NotResource!==undefined)result.errors.push(prefix+'trust policies do not specify Resource.');
   if(s.Principal===undefined&&s.NotPrincipal===undefined)result.errors.push(prefix+'trust policy requires Principal.');
  }else if(!strings(s.Resource??s.NotResource))result.errors.push(prefix+'Resource or NotResource must contain nonempty strings.');
  if(['identity','session','boundary'].includes(kind)&&(s.Principal!==undefined||s.NotPrincipal!==undefined))result.errors.push(prefix+'identity/session/boundary policies do not contain Principal.');
  for(const element of ['Principal','NotPrincipal'])if(s[element]!==undefined&&s[element]!=='*'&&(!record(s[element])||Object.entries(s[element]).some(([k,v])=>!['AWS','Service','Federated','CanonicalUser'].includes(k)||!strings(v))))result.errors.push(prefix+'invalid '+element+' structure.');
  if(record(s.Principal)&&(Object.keys(s.Principal).length!==1||Object.values(s.Principal).some(Array.isArray)||Object.keys(s.Principal).some(k=>!['AWS','Service','Federated'].includes(k))))result.visualSupported=false;
  if(s.Condition!==undefined&&(!record(s.Condition)||Object.values(s.Condition).some(x=>!record(x))))result.errors.push(prefix+'Condition must map operators to condition keys/values.');
  if(s.NotAction!==undefined||s.NotResource!==undefined||s.NotPrincipal!==undefined){result.visualSupported=false;result.warnings.push(prefix+'Not* elements are preserved in JSON; local evaluation does not support them.');}
  if(s.Condition){if(Object.keys(s.Condition).length!==1||Object.values(s.Condition).some(v=>!record(v)||Object.keys(v).length!==1))result.visualSupported=false;for(const op of Object.keys(s.Condition)){if(!['StringEquals','StringLike','ArnEquals','ArnLike','Bool','Null'].includes(op)){result.visualSupported=false;result.warnings.push(prefix+'operator '+op+' is preserved but not evaluated locally.');}}}
  if(list(s.Action).includes('*')||list(s.Action).some(a=>a.endsWith(':*')))result.warnings.push(prefix+'broad actions: review least privilege.');
  if(list(s.Resource).includes('*')&&kind!=='trust')result.warnings.push(prefix+'wildcard resource may be required for some actions; check service authorization documentation.');
 }
 if(!result.errors.length)result.document=d as unknown as PolicyDocument;
 return result;
}
export interface PolicyRequestContext {action:string;resource:string;principal:string;conditions:Record<string,string|string[]|boolean>;sameAccount:boolean;completeContext:boolean}
export interface PolicyEvaluation {decision:'allowed'|'explicit-deny'|'implicit-deny'|'not-evaluated';explanation:string[];matchedStatements:string[]}
const match=(pattern:string,value:string,caseSensitive=true)=>{if(!caseSensitive){pattern=pattern.toLowerCase();value=value.toLowerCase();}let p=0,v=0,star=-1,retry=0;while(v<value.length){if(pattern[p]==='?'||pattern[p]===value[v]){p++;v++;}else if(pattern[p]==='*'){star=p++;retry=v;}else if(star>=0){p=star+1;v=++retry;}else return false;}while(pattern[p]==='*')p++;return p===pattern.length};
function statementMatches(s:Statement,ctx:PolicyRequestContext,kind:PolicyKind):boolean|'unknown'{
 if(s.NotAction||s.NotResource||s.NotPrincipal)return 'unknown';if([...list(s.Action),...list(s.Resource)].some(x=>x.length>2048)||ctx.resource.length>4096)return 'unknown';
 if(!list(s.Action).some(a=>match(a,ctx.action,false)))return false;
 if(kind!=='trust'&&!list(s.Resource).some(r=>r.includes('${')?false:match(r,ctx.resource)))return list(s.Resource).some(r=>r.includes('${'))?'unknown':false;
 if(s.Principal!==undefined){const principals=s.Principal==='*'?['*']:record(s.Principal)?Object.values(s.Principal).flatMap(list):[];if(!principals.some(p=>p===ctx.principal||p==='*'))return principals.some(p=>p.includes('*')||/^\d{12}$/.test(p)||p.endsWith(':root'))?'unknown':false;}
 if(s.Condition)for(const [op,conditions]of Object.entries(s.Condition)){
  if(!['StringEquals','StringLike','ArnEquals','ArnLike','Bool','Null'].includes(op))return 'unknown';
  for(const [key,expected]of Object.entries(conditions)){
   const actualEntry=Object.entries(ctx.conditions).find(([k])=>k.toLowerCase()===key.toLowerCase());
   if(!actualEntry&&!ctx.completeContext)return 'unknown';
   const present=!!actualEntry,actual=present?actualEntry![1]:undefined;
   if(record(expected)||Array.isArray(expected)&&expected.some(record))return 'unknown';const wanted=Array.isArray(expected)?expected.map(String):[String(expected)];
   if(wanted.some(x=>x.includes('${')))return 'unknown';
   if(op==='Null'){if(!wanted.includes(String(!present)))return false;continue;}
   if(!present)return false;if(Array.isArray(actual)||!['string','boolean'].includes(typeof actual))return 'unknown';
   if(!wanted.some(w=>op==='StringLike'||op==='ArnLike'?match(w,String(actual)):w===String(actual)))return false;
  }
 }
 return true;
}
export function evaluatePolicyScenario(policies:PolicyRecord[],ctx:PolicyRequestContext,mode:'identity'|'trust'|'resource'|'kms'='identity'):PolicyEvaluation{
 const explanation:string[]=[],matchedStatements:string[]=[];let allow=false,deny=false,unknown=false;
 if(!ctx.action||!ctx.principal||mode!=='trust'&&!ctx.resource)return {decision:'not-evaluated',explanation:['Supply action, resource and principal for the declared local scenario.'],matchedStatements:[]};
 if(!ctx.sameAccount)return {decision:'not-evaluated',explanation:['Cross-account effective authorization is outside this local evaluator.'],matchedStatements:[]};
 const knownActions=new Set([...managedPolicySnapshots.flatMap(p=>{const d=p.document as PolicyDocument;return (Array.isArray(d.Statement)?d.Statement:[d.Statement]).flatMap(s=>list(s.Action));}),'s3:GetObject','s3:PutObject','s3:DeleteObject','s3:ListBucket','dynamodb:PutItem','dynamodb:GetItem','dynamodb:UpdateItem','dynamodb:DeleteItem','dynamodb:Query','dynamodb:Scan','dynamodb:TransactWriteItems','lambda:InvokeFunction','sqs:SendMessage','sns:Publish','events:PutEvents','states:StartExecution','secretsmanager:GetSecretValue','ssm:GetParameter','ssm:GetParameters','kms:Decrypt','kms:Encrypt','kms:GenerateDataKey','sts:AssumeRole','sts:AssumeRoleWithWebIdentity','rds-db:connect','s3:GetObjectVersion','s3:ListBucketVersions','dynamodb:BatchWriteItem','dynamodb:BatchGetItem','dynamodb:DescribeTable','sqs:SendMessageBatch','bedrock:InvokeModel','bedrock:InvokeModelWithResponseStream'].map(a=>a.toLowerCase()));
 if(!knownActions.has(ctx.action.toLowerCase()))return {decision:'not-evaluated',explanation:['This request action is not in the reviewed local action catalog. The policy remains editable; service authorization was not approximated.'],matchedStatements:[]};
 if(/^s3:(GetObject|PutObject|DeleteObject)$/i.test(ctx.action)&&!/^arn:[^:]+:s3:::[^/]+\/.+/.test(ctx.resource))return {decision:'not-evaluated',explanation:['This object operation needs an object ARN in the declared request, not a bucket ARN.'],matchedStatements:[]};
 if(/^s3:ListBucket$/i.test(ctx.action)&&!/^arn:[^:]+:s3:::[^/]+$/.test(ctx.resource))return {decision:'not-evaluated',explanation:['ListBucket uses a bucket ARN in this modeled scenario.'],matchedStatements:[]};
 const grants=policies.filter(p=>mode==='identity'?p.kind==='identity':p.kind===mode);
 const restrictions=mode==='identity'?policies.filter(p=>p.kind==='boundary'||p.kind==='session'):[];if(restrictions.filter(p=>p.kind==='session').length>1){unknown=true;explanation.push('Multiple session-policy combination is not evaluated by this bounded simulator. Inspect the STS scenario and effective-permission documentation.');}if(restrictions.filter(p=>p.kind==='boundary').length>1){unknown=true;explanation.push('Only one permissions boundary can apply to the modeled identity.');}
 if(mode==='identity'&&policies.some(p=>['resource','trust','kms','endpoint'].includes(p.kind)))return {decision:'not-evaluated',explanation:['Use separate trust/resource/KMS scenarios. This identity scenario does not approximate mixed resource-policy or role-session exceptions.'],matchedStatements:[]};
 const inspect=(p:PolicyRecord)=>{const v=validatePolicyDocument(p.document,p.kind);if(!v.document){unknown=true;explanation.push(p.name+': invalid policy.');return false;}let granted=false;const ss=Array.isArray(v.document.Statement)?v.document.Statement:[v.document.Statement];ss.forEach((s,i)=>{const m=statementMatches(s,ctx,p.kind);if(m==='unknown'){unknown=true;return;}if(m){matchedStatements.push(p.name+' / '+(s.Sid??'statement '+(i+1)));if(s.Effect==='Deny')deny=true;else granted=true;}});return granted;};
 for(const p of grants)if(inspect(p))allow=true;
 for(const p of restrictions)if(!inspect(p)){allow=false;explanation.push(p.name+' does not grant the requested action within its restriction.');}
 if(deny)return {decision:'explicit-deny',explanation:[...explanation,'A matching explicit Deny overrides local Allows.'],matchedStatements};
 if(unknown)return {decision:'not-evaluated',explanation:[...explanation,'Unsupported elements or missing context could change the result; no effective permission is asserted.'],matchedStatements};
 if(mode==='kms'&&allow)return {decision:'not-evaluated',explanation:['Key-policy statement matches, but IAM delegation, grants and key state require separate context. This is not complete KMS authorization.'],matchedStatements};
 return {decision:allow?'allowed':'implicit-deny',explanation:[...explanation,allow?'Allowed only in this declared local scenario. AWS authorization was not executed.':'No applicable local Allow remains after supported restrictions.'],matchedStatements};
}
