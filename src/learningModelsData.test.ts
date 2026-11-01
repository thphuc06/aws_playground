import {describe,it,expect} from 'vitest';
import {dataModels} from './learningModelsData';
import {evaluateLearningModel,type LearningValues} from './learningModel';
const get=(id:string)=>dataModels.find(m=>m.serviceId===id)!;
const run=(id:string,values:LearningValues={})=>evaluateLearningModel(get(id),{...get(id).defaults,...values});
const errors=(id:string,values:LearningValues={})=>run(id,values).findings.filter(f=>f.level==='error');
const effects:Record<string,Record<string,LearningValues>>={
 appsync:{mode:{mode:'API_KEY'},credentialValid:{credentialValid:false},clientAllowed:{clientAllowed:false},resolver:{resolver:false},dataAllowed:{dataAllowed:false},privateData:{mode:'API_KEY',privateData:false}},
 sns:{scope:{scope:'MessageBody'},wanted:{wanted:'billing'},attribute:{attribute:'billing'},body:{scope:'MessageBody',body:'orders'},publishAllowed:{publishAllowed:false},queueAllowed:{queueAllowed:false}},
 sqs:{visibility:{visibility:5},duration:{duration:31},consumerAllowed:{consumerAllowed:false},success:{success:false},delete:{delete:false},idempotent:{idempotent:false},receives:{receives:4},maxReceives:{receives:2,maxReceives:1}},
 'step-functions':{invokeAllowed:{invokeAllowed:false},failures:{failures:1},retries:{retries:0},interval:{interval:2},backoff:{backoff:3},catch:{failures:4,catch:false}},
 aurora:{endpoint:{endpoint:'writer'},replicas:{replicas:0},operation:{operation:'WRITE'},network:{network:false},login:{login:false},sqlGrant:{sqlGrant:false}},
 dynamodb:{target:{target:'GSI'},strong:{strong:false},partitionKey:{partitionKey:'customer-8'},queryAllowed:{queryAllowed:false},evaluated:{evaluated:11},returned:{returned:3}},
 elasticache:{network:{network:false},present:{present:false},age:{age:60},ttl:{ttl:5},dbChanged:{dbChanged:true},dbAllowed:{present:false,dbAllowed:false}},
 rds:{network:{network:false},iamEnabled:{iamEnabled:false},dbUser:{dbUser:false},connectAllowed:{connectAllowed:false},tokenAge:{tokenAge:900},tls:{tls:false}},
 ebs:{volumeAZ:{volumeAZ:'zone-b'},instanceAZ:{instanceAZ:'zone-b'},available:{available:false},attachAllowed:{attachAllowed:false},mounted:{mounted:false},writable:{writable:false}},
 efs:{network:{network:false},iamMount:{iamMount:false},tls:{tls:false},clientMount:{clientMount:false},clientWrite:{clientWrite:false},posix:{posix:false}},
 s3:{versioning:{versioning:false},deleteAllowed:{deleteAllowed:false},read:{read:'current'},getAllowed:{getAllowed:false},deleteRequest:{deleteRequest:false},tls:{tls:false}}
};
// Branch-dependent controls are tested with their branch selected in BOTH baseline and mutation.
const contexts:Record<string,Record<string,LearningValues>>={appsync:{privateData:{mode:'API_KEY'}},sns:{body:{scope:'MessageBody'}},sqs:{maxReceives:{receives:2}},'step-functions':{catch:{failures:4}},elasticache:{dbAllowed:{present:false}}};
describe('eleven data/application service lessons',()=>{
 it('has exact unique catalog identities and dated official evidence',()=>{expect(dataModels.map(m=>m.serviceId).sort()).toEqual(['appsync','sns','sqs','step-functions','aurora','dynamodb','elasticache','rds','ebs','efs','s3'].sort());for(const m of dataModels){expect(m.fields.length).toBeGreaterThanOrEqual(4);expect(m.fields.length).toBeLessThanOrEqual(8);expect(m.sources.every(s=>s.verified==='2026-11-01'&&s.url.startsWith('https://docs.aws.amazon.com/'))).toBe(true);expect(m.limitations.length).toBeGreaterThan(2);}});
 for(const m of dataModels)describe(m.serviceId,()=>{
  it('working example has no errors',()=>expect(errors(m.serviceId,m.examples[0].values)).toEqual([]));
  it('broken example has an actionable error',()=>expect(errors(m.serviceId,m.examples[1].values).length).toBeGreaterThan(0));
  it('every field changes findings or meaningful trace in its applicable branch',()=>{for(const f of m.fields){const delta=effects[m.serviceId][f.key];expect(delta,`${m.serviceId}.${f.key} test supplied`).toBeDefined();expect(run(m.serviceId,delta),`${m.serviceId}.${f.key}`).not.toEqual(run(m.serviceId,contexts[m.serviceId]?.[f.key]??{}));}});
  it('rejects invalid field shapes rather than claiming success',()=>{const field=m.fields[0];const invalid=field.kind==='boolean'?'yes':field.kind==='number'?NaN:field.kind==='select'?'not-modeled':false;expect(errors(m.serviceId,{[field.key]:invalid}).length).toBeGreaterThan(0);});
 });
 it('SQS visibility0 expires immediately and redrive threshold is exceeded, not met',()=>{expect(run('sqs',{visibility:0}).findings.some(f=>f.title.includes('Visibility'))).toBe(true);expect(run('sqs',{receives:3}).trace.join()).not.toContain('threshold exceeded');expect(run('sqs',{receives:4}).trace.join()).toContain('threshold exceeded');expect(errors('sqs',{visibility:1.5})).not.toEqual([]);});
 it('Step Functions retry count excludes initial attempt and catch runs after exhaustion',()=>{expect(run('step-functions',{failures:3,retries:3}).trace.at(-1)).toContain('succeeds');expect(run('step-functions',{failures:4,retries:3}).trace.at(-1)).toContain('Catch');expect(errors('step-functions',{interval:1.5})).not.toEqual([]);});
 it('numeric strings from editor drafts behave like validated numbers',()=>{expect(errors('sqs',{receives:'1',visibility:'30'})).toEqual([]);expect(errors('step-functions',{failures:'2',interval:'1'})).toEqual([]);expect(errors('aurora',{replicas:'1'})).toEqual([]);expect(errors('dynamodb',{evaluated:'10'})).toEqual([]);});
 it('Aurora reader endpoint with no replicas reaches writer, not read-only rejection',()=>{expect(errors('aurora',{replicas:0,operation:'WRITE'})).toEqual([]);expect(errors('aurora',{replicas:1,operation:'WRITE'})).not.toEqual([]);});
 it('DynamoDB strong GSI and missing key rejected; empty results valid',()=>{expect(errors('dynamodb',{target:'GSI',strong:true})).not.toEqual([]);expect(errors('dynamodb',{partitionKey:''})).not.toEqual([]);expect(errors('dynamodb',{returned:0})).toEqual([]);});
 it('cache TTL equality is miss and a hit does not require a DB call',()=>{expect(run('elasticache',{age:60}).trace.join()).toContain('expired');expect(errors('elasticache',{dbAllowed:false})).toEqual([]);expect(errors('elasticache',{present:false,dbAllowed:false})).not.toEqual([]);});
 it('RDS token boundary affects new connections',()=>{expect(errors('rds',{tokenAge:899})).toEqual([]);expect(errors('rds',{tokenAge:900})).not.toEqual([]);});
 it('S3 delete marker hides current view while original version remains readable',()=>{expect(run('s3',{read:'current'}).trace.join()).toContain('not found');expect(run('s3').trace.join()).toContain('original bytes');expect(errors('s3',{versioning:false,read:'original-version'})).not.toEqual([]);});
 it('SNS unmatched filter never attempts delivery permission check',()=>{expect(errors('sns',{attribute:'other',queueAllowed:false})).toEqual([]);expect(run('sns',{attribute:'other'}).trace.join()).toContain('no queue delivery');});
});

it('does not promise deletion using a possibly stale SQS receipt after visibility expiry',()=>{expect(run('sqs',{duration:30,visibility:30}).trace.join()).toContain('deletion is not guaranteed');expect(run('sqs',{duration:31,visibility:30}).trace.join()).not.toContain('removes this received message');expect(run('sqs',{duration:10,visibility:30}).trace.join()).toContain('removes this received message');});
