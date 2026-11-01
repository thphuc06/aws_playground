import {describe,it,expect} from 'vitest';
import {toolsModels} from './learningModelsTools';
import {evaluateLearningModel,type LearningValues} from './learningModel';
const error=(id:string,patch:LearningValues={})=>{const model=toolsModels.find(m=>m.serviceId===id)!;return evaluateLearningModel(model,{...model.defaults,...patch})};
const boundaries:Record<string,{patch:LearningValues;errors:boolean;fragment:string}>={
 athena:{patch:{scannedMiB:100,limitMiB:100},errors:false,fragment:'100 MiB'},
 kinesis:{patch:{lagHours:24,retentionHours:24},errors:true,fragment:'Replay window exhausted'},
 opensearch:{patch:{network:false},errors:true,fragment:'Domain unreachable'},
 amplify:{patch:{buildCommand:''},errors:true,fragment:'Build command missing'},
 cloudshell:{patch:{environment:'vpc',persistentWork:true},errors:true,fragment:'Persistence assumption fails'},
 codeartifact:{patch:{ageHours:12,lifetimeHours:12},errors:true,fragment:'Token expired'},
 codebuild:{patch:{buildspecPresent:false},errors:true,fragment:'Buildspec missing'},
 codedeploy:{patch:{fault:true,rollback:false},errors:false,fragment:'No automatic recovery configured'},
 codepipeline:{patch:{approvalRequired:true,approved:false},errors:true,fragment:'Waiting for approval'},
 xray:{patch:{sampled:false},errors:false,fragment:'No sampled trace expected'},
 'q-developer':{patch:{testsPass:false},errors:true,fragment:'Test evidence does not pass'},
 appconfig:{patch:{pollSeconds:59,requiredSeconds:60},errors:true,fragment:'Polling too soon'},
 cdk:{patch:{assets:false,bootstrap:false},errors:false,fragment:'synth'},
 cloudformation:{patch:{runtimeConstraint:false},errors:true,fragment:'Runtime resource failure'},
 cloudtrail:{patch:{ageDays:91,durableTrail:false},errors:true,fragment:'History window insufficient'},
 cloudwatch:{patch:{samples:'5,5,5',threshold:5},errors:false,fragment:'0/3'},
 cli:{patch:{failures:3,maxAttempts:3},errors:true,fragment:'Retry budget exhausted'},
 'systems-manager':{patch:{type:'String',keyAllowed:false},errors:false,fragment:'plaintext parameter'}
};
describe.each(toolsModels)('$serviceId learning slice',model=>{
 it('has a coherent working example and deterministic output',()=>{const values=model.examples[0].values;const before=JSON.stringify(values);const result=evaluateLearningModel(model,values);expect(result.findings.filter(f=>f.level==='error')).toEqual([]);expect(result.trace.length).toBeGreaterThan(2);expect(evaluateLearningModel(model,values)).toEqual(result);expect(JSON.stringify(values)).toBe(before)});
 it('explains and blocks the deliberately broken example',()=>{const result=evaluateLearningModel(model,model.examples[1].values);expect(result.findings.some(f=>f.level==='error')).toBe(true);expect(result.findings.every(f=>f.title.length>5&&f.detail.length>15)).toBe(true)});
 it('handles a service-specific boundary or conditional prerequisite',()=>{const boundary=boundaries[model.serviceId];const result=error(model.serviceId,boundary.patch);expect(result.findings.some(f=>f.level==='error')).toBe(boundary.errors);expect(JSON.stringify(result)).toContain(boundary.fragment)});
 it('provides usable fields, sources and scope without silent invalid values',()=>{expect(model.fields.length).toBeGreaterThanOrEqual(4);expect(model.fields.length).toBeLessThanOrEqual(8);expect(new Set(model.fields.map(f=>f.key)).size).toBe(model.fields.length);for(const field of model.fields){expect(model.defaults).toHaveProperty(field.key);expect(field.help.length).toBeGreaterThan(30)}expect(model.sources.length).toBeGreaterThanOrEqual(2);expect(model.sources.every(s=>s.url.startsWith('https://docs.aws.amazon.com/')&&s.verified==='2026-11-01')).toBe(true);const field=model.fields[0];const invalid={...model.defaults,[field.key]:field.kind==='boolean'?'true':field.kind==='select'?'not-an-option':field.kind==='number'?Infinity:false};expect(evaluateLearningModel(model,invalid).findings.some(f=>f.level==='error')).toBe(true)});
});
it('covers exactly the assigned eighteen services',()=>expect(toolsModels.map(m=>m.serviceId).sort()).toEqual(Object.keys(boundaries).sort()));
it('keeps AI lesson success separate from proof of generated-code correctness',()=>{expect(error('q-developer').trace.join(' ')).toContain('no correctness guarantee');expect(toolsModels.find(m=>m.serviceId==='q-developer')!.limitations.join(' ')).toContain('No model calls')});
it('does not call a healthy no-data trace an application failure',()=>expect(error('xray',{sampled:false}).findings.some(f=>f.level==='error')).toBe(false));
it('does not confuse CloudWatch absent telemetry with OK',()=>{const r=error('cloudwatch',{metricPublished:false});expect(r.trace.join(' ')).toContain('do not interpret it as OK');expect(r.findings.some(f=>f.title.includes('INSUFFICIENT_DATA'))).toBe(true)});
it('blocks fractional alarm periods and retry budgets',()=>{expect(error('cloudwatch',{required:1.5}).findings.some(f=>f.level==='error')).toBe(true);expect(error('cli',{maxAttempts:2.5}).findings.some(f=>f.level==='error')).toBe(true)});
it('requires separately retained CloudTrail data events even inside 90 days',()=>{expect(error('cloudtrail',{eventKind:'s3-object',dataEvents:true,durableTrail:false,ageDays:2}).findings.some(f=>f.title==='Retained data-event evidence missing')).toBe(true)});
it('does not claim success after failed prerequisites',()=>{expect(error('cli',{callerAllowed:false,errorKind:'success'}).trace.join(' ')).not.toContain('first call succeeds');expect(error('cloudformation',{reviewed:false}).trace.join(' ')).not.toContain('Proposal passes');expect(error('appconfig',{session:false}).trace.join(' ')).toContain('Retrieval is blocked')});
it('applies researched cutoff and integer retention bounds',()=>{for(const cutoff of [1,9,10.5])expect(error('athena',{limitMiB:cutoff}).findings.some(f=>f.level==='error')).toBe(true);expect(error('athena',{limitMiB:10,scannedMiB:10}).findings.some(f=>f.level==='error')).toBe(false);expect(error('kinesis',{retentionHours:24.5}).findings.some(f=>f.level==='error')).toBe(true)});
it('explains the distinct CodePipeline execution-mode consequences',()=>{expect(error('codepipeline',{mode:'QUEUED'}).trace.join(' ')).toContain('wait in order');expect(error('codepipeline',{mode:'SUPERSEDED'}).trace.join(' ')).toContain('supersede eligible');expect(error('codepipeline',{mode:'PARALLEL'}).trace.join(' ')).toContain('proceed independently')});
