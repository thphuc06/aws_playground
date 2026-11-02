import type {LearningPath} from './types';

/** Advises learning order; never gates reading or infers completion of prerequisites. */
export const lessonPrerequisites:Record<string,string[]>={
 'iam':[],'serverless':['iam'],'cicd':['serverless'],
 'dev-application':[],'security-iam-sts':['dev-application'],
 'dev-events':['dev-application'],'dev-lambda':['dev-application','security-iam-sts'],
 'dev-dynamodb':['dev-application'],'dev-data-safety':['dev-dynamodb'],
 'dev-objects':['security-iam-sts'],'security-cognito':['security-iam-sts'],
 'security-kms':['security-iam-sts'],'security-sensitive-data':['security-iam-sts','security-kms'],
 'release-artifacts':['dev-application'],'layered-testing':['dev-application'],
 'release-environments':['release-artifacts'],'build-pipelines':['release-artifacts','layered-testing'],
 'progressive-release':['release-environments','layered-testing'],
 'observe-debug':['dev-application'],'measure-optimize':['observe-debug'],
 'dev-ai-integration':['dev-application','security-iam-sts'],
 'security-ai-controls':['dev-ai-integration','security-sensitive-data'],
 'study-source-judgment':[],
};
const step=(lessonId:string,why:string)=>({lessonId,why});
export const learningPaths:LearningPath[]=[
 {id:'c03-application',title:'C03: from request to a diagnosable application',description:'A suggested sequence through the C03 application lessons. Reading progress and practice evidence remain separate.',examVersions:['DVA-C03'],steps:[
  step('dev-application','Start with the API contract and observable failure boundaries.'),step('security-iam-sts','Identify who performs each operation before granting access.'),step('dev-lambda','Connect invocation, execution and downstream permissions.'),step('dev-dynamodb','Make reads and writes match explicit data requirements.'),step('dev-data-safety','Protect business invariants against retries and concurrent writes.'),step('dev-events','Move work asynchronously without losing failure ownership.'),step('dev-objects','Add object access and lifecycle deliberately.'),step('security-cognito','Separate user authentication from individual operation authorization.'),step('security-kms','Explain key access and encrypted data separately.'),step('security-sensitive-data','Trace sensitive data across transport, storage and logs.'),step('release-artifacts','Produce an identifiable deployment candidate.'),step('layered-testing','Choose the evidence each test layer can establish.'),step('release-environments','Preserve environment and artifact boundaries.'),step('build-pipelines','Follow the artifact through build and delivery stages.'),step('progressive-release','Promote traffic using health and rollback evidence.'),step('observe-debug','Use logs and traces to locate the first failing boundary.'),step('measure-optimize','Measure the bottleneck before selecting an optimization.'),step('dev-ai-integration','Add bounded inference and tool-use contracts.'),step('security-ai-controls','Review AI data, action and identity boundaries.'),step('study-source-judgment','Check the scope and provenance of future study material.'),
 ]},
 {id:'c02-foundation',title:'C02: foundations and application practice',description:'Preserves the original foundation entry points and continues into shared lessons without silently adding C03-only tasks.',examVersions:['DVA-C02'],steps:[
  step('iam','Start with identity and permission basics.'),step('serverless','Follow the original request and queue examples.'),step('cicd','Introduce artifact and rollout vocabulary.'),step('dev-application','Deepen API contracts and SDK behavior.'),step('security-iam-sts','Extend policy and temporary-session reasoning.'),step('dev-lambda','Study invocation boundaries.'),step('dev-dynamodb','Practice data operations.'),step('dev-data-safety','Reason about safe writes.'),step('dev-events','Compare asynchronous failure ownership.'),step('dev-objects','Study object access.'),step('security-cognito','Distinguish tokens and credentials.'),step('security-kms','Study keys and encryption.'),step('security-sensitive-data','Protect the full data path.'),step('release-artifacts','Identify the artifact to deploy.'),step('layered-testing','Choose meaningful tests.'),step('release-environments','Separate environments.'),step('build-pipelines','Read pipeline evidence.'),step('progressive-release','Review rollout and rollback.'),step('observe-debug','Diagnose with evidence.'),step('measure-optimize','Measure optimization outcomes.'),step('study-source-judgment','Review older source material critically.'),
 ]},
 {id:'diagnose-request',title:'Focused path: explain a failing request',description:'A short review path for identifying identity, execution and observation boundaries.',examVersions:['DVA-C02','DVA-C03'],steps:[
  step('dev-application','State the expected request and result.'),step('security-iam-sts','Identify the principal for the failing operation.'),step('dev-lambda','Distinguish accepted invocation from completed work.'),step('observe-debug','Connect the relevant evidence.'),step('measure-optimize','Check whether the repair improved the intended behavior.'),
 ]},
];
