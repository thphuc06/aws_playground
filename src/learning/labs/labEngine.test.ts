import {describe,it,expect} from 'vitest';
import {labDefinitions,getLabDefinition,labArns,approvedDigest} from './definitions';
import {evaluateLab,createLabSession,runLabAttempt} from './labEngine';
import type {LabValues} from './types';
const policy=(actions:string[],resources:string[])=>JSON.stringify({Version:'2012-10-17',Statement:[{Effect:'Allow',Action:actions,Resource:resources}]});
export const repairs:Record<string,LabValues>={
 'api-authorization':{invokePrincipal:'apigateway.amazonaws.com',invokeScope:'route-arn',executionPolicy:policy(['dynamodb:PutItem'],[labArns.table]),timeoutSeconds:30},
 'sqs-batch':{responseMode:'partial',failedMessageIds:'["m-2"]',idempotency:'conditional-write',visibilitySeconds:30},
 'event-routing':{pattern:JSON.stringify({source:['study.orders'],'detail-type':['OrderCreated'],detail:{status:['paid']}}),targetGrant:'scoped-resource-policy'},
 'dynamodb-access':{writeGuard:'not-exists',readTarget:'gsi',readOperation:'Query',readConsistency:'eventual'},
 's3-kms':{identityPolicy:policy(['s3:GetObject','kms:Decrypt'],[labArns.object,labArns.key]),keyContext:'provided-delegation'},
 'cognito-sts':{credentialPath:'identity-pool',requestAuth:'sigv4',refresh:'provider',rolePolicy:policy(['dynamodb:Query'],[labArns.table])},
 'private-connectivity':{privateDns:'enabled',vpcDns:'both',fromPort:443,toPort:443,source:'app-sg',authorization:'supplied-scoped'},
 'ecs-artifact':{networkMode:'awsvpc',taskCpu:256,taskMemoryMb:512,image:approvedDigest,executionRole:'pull-logs',taskPolicy:policy(['dynamodb:PutItem'],[labArns.table])},
 'pipeline-artifact':{deploymentInput:'BuildOutput',deployedDigest:approvedDigest,promotion:'reuse-artifact',manifest:JSON.stringify({artifactName:'BuildOutput',digest:approvedDigest,sourceRevision:'commit-demo-42'})},
 'rollout-rollback':{canary:10,alarmScope:'candidate',rollback:'enabled',dataPlan:'reconcile'},
 'telemetry':{diagnosis:'dependency-throttle',correlation:'propagate',logFields:'["requestId","errorCode"]',metricDimension:'service-environment',evaluationPeriods:3,datapointsToAlarm:2},
 'ai-tool-boundary':{authority:'caller-policy',allowedTools:'["readOrder"]',tenantCheck:'enforce',approval:'required',outputHandling:'validate-reject'},
};
const grade=(id:string,values:LabValues)=>evaluateLab(getLabDefinition(id)!,values);
describe('twelve isolated invariant labs',()=>{
 it('starts with meaningful failures and supports a complete repair for each fixture',()=>{expect(labDefinitions).toHaveLength(12);for(const lab of labDefinitions){const broken=grade(lab.id,lab.fixture.values);expect(broken.status,lab.id).not.toBe('objectives-met');const fixed=grade(lab.id,repairs[lab.id]);expect(fixed.checks,lab.id).toHaveLength(lab.objectives.length);expect(fixed.status,JSON.stringify({id:lab.id,checks:fixed.checks})).toBe('objectives-met');expect(lab.objectives.every(o=>o.sourceIds.every(id=>lab.sources.some(s=>s.id===id)))).toBe(true)}});
 it('accepts alternative valid repairs rather than comparing one gold answer object',()=>{
  for(const timeoutSeconds of [3,60,900])expect(grade('api-authorization',{...repairs['api-authorization'],timeoutSeconds}).status).toBe('objectives-met');
  for(const visibilitySeconds of [6,60,43200])expect(grade('sqs-batch',{...repairs['sqs-batch'],visibilitySeconds,idempotency:'transaction-ledger'}).status).toBe('objectives-met');
  expect(grade('dynamodb-access',{...repairs['dynamodb-access'],writeGuard:'transaction-ledger',readTarget:'table',readConsistency:'strong'}).status).toBe('objectives-met');
  for(const pair of [[256,1024],[512,4096],[1024,2048]])expect(grade('ecs-artifact',{...repairs['ecs-artifact'],taskCpu:pair[0],taskMemoryMb:pair[1],image:'111122223333.dkr.ecr.us-east-1.amazonaws.com/study-app@'+approvedDigest}).status).toBe('objectives-met');
  expect(grade('cognito-sts',{...repairs['cognito-sts'],credentialPath:'web-identity'}).status).toBe('objectives-met');
  for(const canary of [1,5,25])expect(grade('rollout-rollback',{...repairs['rollout-rollback'],canary}).status).toBe('objectives-met');
 });
 it('discriminates incorrect repairs and risky broadening',()=>{
  expect(grade('api-authorization',{...repairs['api-authorization'],timeoutSeconds:901}).status).toBe('needs-repair');
  expect(grade('api-authorization',{...repairs['api-authorization'],executionPolicy:policy(['dynamodb:*'],['*'])}).status).toBe('needs-repair');
  expect(grade('sqs-batch',{...repairs['sqs-batch'],failedMessageIds:'["order-2"]'}).checks.find(c=>c.id==='batch')?.status).toBe('fail');
  expect(grade('event-routing',{...repairs['event-routing'],pattern:'{"source":["study.orders"]}'}).checks.find(c=>c.id==='negative')?.status).toBe('fail');
  expect(grade('s3-kms',{...repairs['s3-kms'],identityPolicy:policy(['s3:GetObject','kms:Decrypt'],['*'])}).checks.find(c=>c.id==='scope')?.status).toBe('fail');
  expect(grade('ecs-artifact',{...repairs['ecs-artifact'],taskMemoryMb:4096}).checks.find(c=>c.id==='runtime')?.status).toBe('fail');
  expect(grade('telemetry',{...repairs.telemetry,logFields:'["errorCode","requestId","Authorization"]'}).checks.find(c=>c.id==='privacy')?.status).toBe('fail');
  expect(grade('ai-tool-boundary',{...repairs['ai-tool-boundary'],allowedTools:'["readOrder","refund"]'}).checks.find(c=>c.id==='tool')?.status).toBe('fail');
 });
 it('does not convert absent context or unsupported semantics into AWS-invalid claims',()=>{
  for(const lab of labDefinitions)expect(grade(lab.id,{}).checks.every(c=>c.status==='needs-context'),lab.id).toBe(true);
  expect(grade('s3-kms',{...repairs['s3-kms'],keyContext:'unknown'}).checks.find(c=>c.id==='decrypt')?.status).toBe('needs-context');
  expect(grade('event-routing',{...repairs['event-routing'],pattern:'{"detail":{"amount":[{"numeric":[">",10]}]}}'}).checks.find(c=>c.id==='positive')?.status).toBe('unsupported');
  expect(grade('ecs-artifact',{...repairs['ecs-artifact'],taskCpu:8192,taskMemoryMb:16384}).checks.find(c=>c.id==='runtime')?.status).toBe('unsupported');
 });
 it('uses bounded queue/rollback traces while preserving fixture and session isolation',()=>{
  const lab=getLabDefinition('sqs-batch')!,original=JSON.stringify(lab),a=createLabSession(lab,'session-a'),b=createLabSession(lab,'session-b');a.values.idempotency='transaction-ledger';a.values={...a.values,...repairs[lab.id]};const run=runLabAttempt(a);expect(run.attempts).toHaveLength(1);expect(a.attempts).toHaveLength(0);expect(run.attempts[0].result.trace.some(t=>t.title==='Queue run complete')).toBe(true);expect(b.values).toEqual(lab.fixture.values);expect(JSON.stringify(lab)).toBe(original);
  const rollback=grade('rollout-rollback',repairs['rollout-rollback']);expect(rollback.trace.some(t=>t.title==='Rollback to stable')).toBe(true);expect(grade('rollout-rollback',{...repairs['rollout-rollback'],canary:0}).status).toBe('needs-repair');
 });
});
