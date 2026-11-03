import {canvasCatalog,serviceCatalog} from '../serviceCatalog';
import {serviceLearningModels} from '../serviceLearningModels';
import {evaluateLearningModel,numeric,type LearningField,type LearningResult,type LearningSource,type LearningValues,type ServiceLearningModel} from '../learningModel';
import {evaluateLambda,evaluateHTTPApi,coreServiceSources,coreServiceLimitations} from '../coreServiceConfig';
import {evaluateEventBridge,defaultEventBridgeConfig,eventBridgeSources,eventBridgeLimitations} from '../eventBridge';
import {authoredDevelopmentSecurityQuestions} from './authoredQuestionsDevelopmentSecurity';
import type {StudyQuestion} from './questionTypes';

interface ExerciseBase {
 id:string;revision:1;serviceId:string;title:string;scope:string;scopeLabel:string;
 sources:LearningSource[];limitations:string[];expectedReasoning:string[];
}
export interface ServiceConfigurationExercise extends ExerciseBase {
 kind:'configuration';model:ServiceLearningModel;initialValues:LearningValues;repairValues:LearningValues;
}
export interface ServiceDecisionExercise extends ExerciseBase {kind:'decision';question:StudyQuestion}
export type ServiceExercise=ServiceConfigurationExercise|ServiceDecisionExercise;
const isolated='Independent practice only. Values, answers and results stay in this panel; they do not read or change your architecture, credentials or saved learning progress.';
const assertionLimit='Permission switches and supplied outcomes are lesson assertions, not a policy evaluator or evidence from AWS. The trace is a local explanation, not network traffic.';
const f=(key:string,label:string,kind:LearningField['kind'],help:string,extra:Partial<LearningField>={}):LearningField=>({key,label,kind,help,...extra});
const source=(title:string,url:string,verified='2026-11-01'):LearningSource=>({title,url,verified});
const convertFindings=(findings:{severity:'error'|'warning'|'info';title:string;detail:string}[])=>findings.map(({severity,...rest})=>({level:severity,...rest}));

/** Fixed synthetic targets adapt the existing pure core engines; no personal graph is accepted. */
const coreModels:ServiceLearningModel[]=[
 {
  serviceId:'lambda',version:1,title:'Separate invocation permission from the function role',
  scope:'One ordinary Lambda Event Function and a synthetic DynamoDB PutItem target; mock duration is supplied, not measured.',examSkills:[],
  sources:[source('Function timeout',coreServiceSources.lambdaTimeout),source('Function execution role',coreServiceSources.lambdaRole)],
  fields:[f('timeoutSeconds','Function timeout','number','Declared whole-second timeout for this ordinary-function lesson.',{min:1,max:900,unit:'seconds'}),f('mockDurationMs','Supplied work duration','number','Synthetic work duration; changing this is a scenario change, not an AWS setting.',{min:0,unit:'ms'}),f('downstreamPermission','Function role may write the example table','boolean','Assertion of the narrowly scoped DynamoDB PutItem grant; incoming invocation permission is a separate boundary.')],
  defaults:{timeoutSeconds:3,mockDurationMs:100,downstreamPermission:true},
  examples:[{title:'Worked repair',description:'The declared downstream role grant is present.',values:{timeoutSeconds:3,mockDurationMs:100,downstreamPermission:true}},{title:'Find the failure',description:'The handler is invoked, but its table write is not authorized.',values:{timeoutSeconds:3,mockDurationMs:100,downstreamPermission:false}}],
  evaluate(values){const result=evaluateLambda({timeoutSeconds:numeric(values.timeoutSeconds),mockDurationMs:numeric(values.mockDurationMs)},[{edgeId:'practice-table',service:'dynamodb',label:'Example table',permission:values.downstreamPermission===true}]);return {findings:convertFindings(result.findings),trace:[`Local outcome: ${result.status}.`,...result.targets.map(target=>target.detail)]}},
  limitations:[...coreServiceLimitations,assertionLimit],
 },
 {
  serviceId:'api',version:1,title:'An HTTP route needs its own invocation grant',
  scope:'One exact POST /practice route on a synthetic HTTP API ($default stage, payload 2.0, no authorizer) targeting an ordinary Lambda function.',examSkills:[],
  sources:[source('HTTP routes',coreServiceSources.routes),source('Lambda invocation permission',coreServiceSources.permission)],
  fields:[f('samplePath','Sample request path','text','This bounded preview supports an exact literal path. The configured route is POST /practice.'),f('deployed','Current route configuration deployed','boolean','A supplied assertion for this route; the preview does not manage deployment snapshots.'),f('integration','Lambda integration configured','boolean','A declared proxy integration for the fixed synthetic function.'),f('invokePermission','API may invoke the function','boolean','Assertion of the function resource policy; it does not grant downstream function-role access.')],
  defaults:{samplePath:'/practice',deployed:true,integration:true,invokePermission:true},
  examples:[{title:'Worked repair',description:'Route, integration and invocation grant agree.',values:{samplePath:'/practice',deployed:true,integration:true,invokePermission:true}},{title:'Find the failure',description:'The exact route exists, but the function has no invocation grant for this API.',values:{samplePath:'/practice',deployed:true,integration:true,invokePermission:false}}],
  evaluate(values){const result=evaluateHTTPApi({routes:{'practice-function':{method:'POST',path:'/practice',deployed:values.deployed===true}},sampleMethod:'POST',samplePath:String(values.samplePath)},[{edgeId:'practice-function',service:'lambda',label:'Practice handler',integration:values.integration===true,permission:values.invokePermission===true,lambdaConfig:{timeoutSeconds:3,mockDurationMs:100}}]);return {findings:convertFindings(result.findings),trace:[`Local request outcome: ${result.status}.`,'The example handler has a supplied 100ms duration and a 3-second timeout. No HTTP request is sent.']}},
  limitations:[...coreServiceLimitations,assertionLimit],
 },
 {
  serviceId:'eventbridge',version:1,title:'Matching an event is separate from target permission',
  scope:'One Classic rule, a reduced sample event and one synthetic standard SQS target using the resource-policy path.',examSkills:[],
  sources:[source('Event patterns',eventBridgeSources.pattern),source('Target resource policies',eventBridgeSources.permissions)],
  fields:[f('rulePattern','Rule pattern','textarea','Exact-value subset only; retain the explicit limits below.'),f('sampleEvent','Reduced sample event','textarea','Contains source, detail-type and detail; this is not a full AWS event envelope.'),f('enabled','Rule enabled','boolean','Supplied rule state for this local case.'),f('targetPermission','Queue permits this rule to send','boolean','Assertion of a queue resource policy for events.amazonaws.com scoped to the intended rule.')],
  defaults:{rulePattern:defaultEventBridgeConfig.rulePattern,sampleEvent:defaultEventBridgeConfig.sampleEvent,enabled:true,targetPermission:true},
  examples:[{title:'Worked repair',description:'The matching rule has its scoped target permission.',values:{targetPermission:true}},{title:'Find the failure',description:'The event shape matches, but the target resource grant is absent.',values:{targetPermission:false}}],
  evaluate(values){const result=evaluateEventBridge({busName:'default',enabled:values.enabled===true,rulePattern:String(values.rulePattern),sampleEvent:String(values.sampleEvent),targets:{'practice-queue':{attached:true,permission:values.targetPermission===true}}},[{edgeId:'practice-queue',service:'sqs',label:'Practice queue'}]);return {findings:convertFindings(result.findings),trace:[`Local rule outcome: ${result.status}.`,...result.targets.map(target=>target.detail)]}},
  limitations:[...eventBridgeLimitations,assertionLimit],
 },
];

function adaptConfiguration(model:ServiceLearningModel):ServiceConfigurationExercise {
 // CloudWatch's old broken preset is a parser exercise. Start here with a meaningful alarm-action failure instead.
 const initialValues=model.serviceId==='cloudwatch'?{...model.defaults,actionAllowed:false}:{...model.defaults,...model.examples[1]?.values};
 const initialResult=evaluateLearningModel(model,initialValues),repairResult=evaluateLearningModel(model,model.defaults);
 return {
  id:`service-${model.serviceId}-configuration-1`,revision:1,serviceId:model.serviceId,kind:'configuration',title:model.title,scope:model.scope,
  scopeLabel:['appsync','q-developer'].includes(model.serviceId)?'Legacy C02 service lesson':'C02-origin bounded lesson · review the selected C03 configuration separately',
  model,initialValues:structuredClone(initialValues),repairValues:structuredClone(model.defaults),sources:model.sources.map(s=>({...s})),
  expectedReasoning:[...initialResult.findings.filter(f=>f.level==='error').map(f=>`${f.title}: ${f.detail}`),...repairResult.trace],
  limitations:[isolated,assertionLimit,...model.limitations],
 };
}

const samQuestion:StudyQuestion={
 id:'service-sam-decision-1',revision:1,examVersions:['DVA-C03'],skillRefs:['DVA-C03:3.2.1'],chapterIds:['layered-testing','release-artifacts'],serviceIds:['sam','lambda'],kind:'single-choice',origin:'authored',
 prompt:'A SAM application passes a local invocation using a fake database client. A release note claims the deployed function role and private database path are verified. Which evidence should replace that claim?',
 options:[
  {id:'local-and-cloud',text:'Keep the local handler result, and separately verify the deployed identity/network integration in an authorized environment.',explanation:'Local runtime/handler evidence and deployed IAM/network evidence cover different boundaries.'},
  {id:'repeat-local',text:'Repeat the same local invocation with more identical fake responses and mark the cloud path verified.',explanation:'Repeating a fake-based test does not add a real deployed identity or network path.'},
  {id:'template-is-runtime',text:'Treat successful parsing of the SAM template as proof of the actual database connection.',explanation:'A valid declaration is not observation of a running application connection.'},
  {id:'credentials-in-fixture',text:'Place permanent AWS keys in the fixture so its previous fake result counts as a cloud test.',explanation:'Exposing credentials does not retroactively change what the test executed; use a separately authorized test with an appropriate identity.'},
 ],correctOptionIds:['local-and-cloud'],
 explanation:'SAM local helps test local application behavior. Record exactly what ran and what was replaced; keep untested deployment/authorization behavior unverified.',
 sourceUrls:['https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli-local.html'],
};
const decisionMappings:[serviceId:string,questionId:string][]=[
 ['firehose','authored-c03-1-1-6-b'],['bedrock','authored-c03-1-1-10-b'],['agentcore','authored-c03-2-3-4-b'],
 ['quick','authored-c03-2-3-2-b'],['kiro','authored-c03-1-1-9-b'],['cloudwatch-logs','authored-c03-2-2-6-a'],
 ['privatelink','authored-c03-1-2-1-a'],['acm','authored-c03-2-2-2-a'],['private-ca','authored-c03-2-2-5-b'],['glacier','authored-c03-1-3-1-b'],
];
function decision(serviceId:string,question:StudyQuestion):ServiceDecisionExercise {
 const service=canvasCatalog.find(s=>s.id===serviceId)!;
 return {id:`service-${serviceId}-decision-1`,revision:1,serviceId,kind:'decision',title:`${service.name}: reason through the boundary`,scope:question.prompt,scopeLabel:'C03 scenario · original reasoning exercise',question:structuredClone(question),expectedReasoning:[question.explanation],sources:question.sourceUrls.map(url=>source('Primary reference for this scenario',url,'2026-11-03')),limitations:[isolated,'Original scenario, not an exam question or an executed AWS experiment. The declared assumptions determine the answer.','A correct answer establishes only this exercise result; it does not prove full service knowledge or deployment validity.']};
}
const decisions=decisionMappings.map(([serviceId,id])=>{
 const question=authoredDevelopmentSecurityQuestions.find(q=>q.id===id);
 if(!question)throw new Error('Missing standalone service question: '+id);
 return decision(serviceId,question);
});
export const serviceExercises:ServiceExercise[]=[...serviceLearningModels.map(adaptConfiguration),...coreModels.map(adaptConfiguration),...decisions,decision('sam',samQuestion)];
export const getServiceExercise=(serviceId:string)=>serviceExercises.find(exercise=>exercise.serviceId===serviceId);
export const createServiceExerciseValues=(exercise:ServiceConfigurationExercise):LearningValues=>structuredClone(exercise.initialValues);
export function evaluateServiceExercise(exercise:ServiceConfigurationExercise,values:LearningValues):LearningResult {
 return evaluateLearningModel(exercise.model,structuredClone(values));
}
export const serviceExerciseCoverage={services:serviceExercises.length,legacyCatalog:serviceCatalog.length,meaning:'One standalone bounded exercise per catalog entry, not full service simulation or mastery.'};
