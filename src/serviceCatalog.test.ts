import {describe,it,expect} from 'vitest';
import {serviceCatalog,catalogCategoryCounts,catalogSources,catalogVerified} from './serviceCatalog';
const expectedIds=['athena','kinesis','opensearch','appsync','eventbridge','sns','sqs','step-functions','ec2','elastic-beanstalk','lambda','ecr','ecs','eks','aurora','dynamodb','elasticache','rds','amplify','cloudshell','codeartifact','codebuild','codedeploy','codepipeline','xray','q-developer','appconfig','cdk','cloudformation','cloudtrail','cloudwatch','cli','systems-manager','api','cloudfront','elb','route53','vpc','cognito','iam','kms','secrets-manager','sts','waf','ebs','efs','s3'];
describe('official in-scope catalog snapshot',()=>{
 it('reconciles all 47 published entries without duplicate IDs or names',()=>{expect(serviceCatalog).toHaveLength(47);expect(serviceCatalog.map(s=>s.id).sort()).toEqual([...expectedIds].sort());expect(new Set(serviceCatalog.map(s=>s.id)).size).toBe(47);expect(new Set(serviceCatalog.map(s=>s.name)).size).toBe(47)});
 it('reconciles 10 official categories and their counts',()=>{const counts:Record<string,number>={};for(const service of serviceCatalog)counts[service.category]=(counts[service.category]||0)+1;expect(counts).toEqual(catalogCategoryCounts);expect(Object.keys(counts)).toHaveLength(10);expect(Object.values(counts).reduce((a,b)=>a+b,0)).toBe(47)});
 it('does not imply all placeable nodes are modeled',()=>{expect(serviceCatalog.filter(s=>s.modeled).map(s=>s.id).sort()).toEqual(['api','dynamodb','lambda','sqs']);expect(serviceCatalog.find(s=>s.id==='eventbridge')?.modeled).toBe(false)});
 it('has concise purpose and relevance text plus dated official provenance',()=>{for(const s of serviceCatalog){expect(s.purpose.length).toBeGreaterThan(15);expect(s.relevance.length).toBeGreaterThan(15)}expect(catalogVerified).toBe('2026-11-01');expect(catalogSources[0].url).toContain('dva-02-in-scope-services.html');expect(catalogSources.every(s=>s.url.startsWith('https://docs.aws.amazon.com/'))).toBe(true)});
});

// Every published-list entry is accepted by graph schema without pretending its runtime is modeled.
import {validateGraph} from './builderRules';
it('recognizes every published catalog identifier in graph validation',()=>{
 for(const service of serviceCatalog){const findings=validateGraph([{id:service.id,service:service.id,label:service.name}],[],{});expect(findings.some(f=>f.title==='Unknown service')).toBe(false);expect(findings.some(f=>f.title==='Reference-only service')).toBe(!service.modeled&&service.id!=='eventbridge')}
});
it('can place the entire 47-entry catalog within the canvas bound',()=>{
 const nodes=serviceCatalog.map(service=>({id:service.id,service:service.id,label:service.name}));
 expect(validateGraph(nodes,[],{}).some(f=>f.title==='Teaching canvas limit')).toBe(false);
});
