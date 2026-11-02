import {canvasCatalog,serviceCatalog} from '../../serviceCatalog';
import type {ServiceLearningMetadata} from './types';

type Row=[serviceId:string,focus:string,lessonIds:string[],prerequisiteLessonIds:string[],comparisonIds:string[]];
/** Editorial navigation, not a declaration that every topic in a service is taught or simulated. */
const rows:Row[]=[
 ['api','Trace authentication, route selection, integration permissions and the response deadline.',['dev-application','dev-lambda'],['security-iam-sts'],['request-entry']],
 ['lambda','Explain invocation ownership and connect function configuration to downstream side effects.',['dev-lambda','dev-events'],['dev-application','security-iam-sts'],['async-choice']],
 ['sqs','Follow receive, processing, deletion and redrive while preserving idempotent business behavior.',['dev-events','dev-lambda'],['dev-application'],['async-choice']],
 ['sns','Separate publication, subscriber filtering and each subscriber’s delivery outcome.',['dev-events'],['dev-application'],['async-choice']],
 ['eventbridge','Distinguish an event match, target delivery and downstream completion.',['dev-events'],['dev-application','security-iam-sts'],['async-choice']],
 ['step-functions','Locate retry, catch and compensation ownership in an explicit workflow.',['dev-events','layered-testing'],['dev-application'],['async-choice']],
 ['appsync','Explain resolver/data-source authorization for a GraphQL application.',['dev-application','security-cognito'],['security-iam-sts'],['request-entry']],
 ['kinesis','Connect partition-key ordering and consumer checkpoints to replay behavior.',['dev-events','measure-optimize'],['dev-application'],['async-choice']],
 ['firehose','Separate record acceptance, transformation and destination delivery evidence.',['dev-events','observe-debug'],['dev-application'],['async-choice']],
 ['dynamodb','Choose access operations and diagnose conditions, indexes and throttling from evidence.',['dev-dynamodb','dev-data-safety'],['dev-application'],['data-access']],
 ['s3','Explain object ownership, scoped access and lifecycle without confusing it with a file system.',['dev-objects','security-sensitive-data'],['security-iam-sts'],['storage-interface']],
 ['glacier','Design pending, restored and expired-availability states for an archived-object workflow.',['dev-objects'],['security-iam-sts'],['storage-interface']],
 ['rds','Trace database authentication, connections and application transaction failures.',['dev-data-safety','measure-optimize'],['dev-application','security-sensitive-data'],['data-access']],
 ['aurora','Distinguish application connection behavior from storage and deployment choices.',['dev-data-safety','measure-optimize'],['dev-application'],['data-access']],
 ['elasticache','Explain cache misses, expiry and invalidation without treating a cache as durable truth.',['dev-data-safety','measure-optimize'],['dev-application'],['data-access']],
 ['opensearch','Follow indexing and search access separately from the authoritative business write.',['dev-data-safety','observe-debug'],['dev-application'],['data-access']],
 ['athena','Connect query scope, stored-data layout and permissions to query evidence.',['dev-data-safety','measure-optimize'],['dev-objects'],['data-access']],
 ['ebs','Distinguish block-volume attachment, persistence and snapshot recovery requirements.',['dev-data-safety','release-artifacts'],['dev-application'],['storage-interface']],
 ['efs','Explain shared-file access through the application’s network and identity context.',['dev-data-safety','dev-lambda'],['security-iam-sts'],['storage-interface']],
 ['iam','Trace principal, action, resource and conditions before changing a permission.',['security-iam-sts'],['dev-application'],['identity-boundaries']],
 ['sts','Distinguish assuming a role from using the resulting temporary session.',['security-iam-sts'],['dev-application'],['identity-boundaries']],
 ['cognito','Choose application tokens or temporary AWS credentials for the actual consumer.',['security-cognito'],['security-iam-sts'],['identity-boundaries']],
 ['kms','Separate encrypted data, key permissions, grants and key lifecycle.',['security-kms','security-sensitive-data'],['security-iam-sts'],['identity-boundaries']],
 ['secrets-manager','Connect secret retrieval, rotation and caching to application access.',['security-sensitive-data'],['security-iam-sts','security-kms'],['identity-boundaries']],
 ['waf','Explain request filtering separately from caller identity and business authorization.',['security-sensitive-data','dev-application'],['security-iam-sts'],['request-entry']],
 ['acm','Trace certificate names, endpoint placement and renewal eligibility.',['security-sensitive-data'],['dev-application'],['certificate-lifecycle']],
 ['private-ca','Explain issued identity, client trust and revocation for a private certificate.',['security-sensitive-data'],['security-iam-sts'],['certificate-lifecycle']],
 ['ec2','Connect runtime identity, application readiness and persistent dependencies.',['release-artifacts','measure-optimize'],['security-iam-sts'],['storage-interface']],
 ['elastic-beanstalk','Identify application version, environment configuration and rollout evidence.',['release-environments','progressive-release'],['release-artifacts'],['infrastructure-authoring']],
 ['ecs','Separate image artifact, task identity, execution identity and traffic readiness.',['release-artifacts','progressive-release'],['security-iam-sts'],['infrastructure-authoring']],
 ['eks','Review workload manifests and readiness without confusing them with ECS task definitions.',['release-artifacts','progressive-release'],['security-iam-sts'],['infrastructure-authoring']],
 ['ecr','Trace an image digest from build to the workload that runs it.',['release-artifacts','build-pipelines'],['dev-application'],['infrastructure-authoring']],
 ['vpc','Separate DNS, routing and network rules from API authorization.',['security-sensitive-data','observe-debug'],['dev-application'],['request-entry']],
 ['privatelink','Diagnose endpoint DNS and connectivity before evaluating a service permission denial.',['security-sensitive-data','observe-debug'],['security-iam-sts'],['request-entry']],
 ['elb','Relate target health and listener routing to application readiness.',['progressive-release','observe-debug'],['dev-application'],['request-entry']],
 ['cloudfront','Explain cache/origin behavior and viewer TLS as separate configuration boundaries.',['dev-objects','measure-optimize'],['dev-application'],['request-entry','certificate-lifecycle']],
 ['route53','Distinguish DNS answers from actual endpoint availability and application success.',['security-sensitive-data','observe-debug'],['dev-application'],['request-entry']],
 ['amplify','Trace environment-specific application builds and approved releases.',['release-environments','build-pipelines'],['release-artifacts'],['infrastructure-authoring']],
 ['cloudshell','Identify the caller, Region and effect of a command before executing it.',['layered-testing','security-iam-sts'],['dev-application'],['infrastructure-authoring']],
 ['codeartifact','Review package source, version and access in the build dependency chain.',['release-artifacts','build-pipelines'],['security-iam-sts'],['infrastructure-authoring']],
 ['codebuild','Distinguish build phases, test results and exported artifacts.',['build-pipelines','layered-testing'],['release-artifacts'],['infrastructure-authoring']],
 ['codedeploy','Choose rollout and rollback evidence appropriate to the target platform.',['progressive-release'],['release-artifacts','layered-testing'],['infrastructure-authoring']],
 ['codepipeline','Trace input/output artifact ownership and sequencing between actions.',['build-pipelines','release-environments'],['release-artifacts'],['infrastructure-authoring']],
 ['cdk','Review synthesized infrastructure and application artifacts from a code-based definition.',['release-artifacts','layered-testing'],['dev-application'],['infrastructure-authoring']],
 ['cloudformation','Explain the relationship between a template, a change and deployed resource state.',['release-artifacts','progressive-release'],['security-iam-sts'],['infrastructure-authoring']],
 ['cli','Choose command-specific input, credentials and verification rather than assuming dry-run is universal.',['layered-testing','security-iam-sts'],['dev-application'],['infrastructure-authoring']],
 ['systems-manager','Separate ordinary configuration values from protected application secrets.',['security-sensitive-data','release-environments'],['security-iam-sts'],['identity-boundaries']],
 ['sam','Distinguish local handler evidence from deployed IAM and integration behavior.',['release-artifacts','layered-testing'],['dev-lambda'],['infrastructure-authoring']],
 ['appconfig','Connect configuration validation, rollout and rollback to measured application behavior.',['release-environments','progressive-release'],['layered-testing'],['infrastructure-authoring']],
 ['cloudwatch','Define the metric, dimensions, evaluation and intended alarm response together.',['measure-optimize'],['observe-debug'],['operational-evidence']],
 ['cloudwatch-logs','Locate a failure using safe structured events and an explicit query scope.',['observe-debug'],['dev-application'],['operational-evidence']],
 ['xray','Follow trace context across boundaries and identify a failing downstream operation.',['observe-debug'],['dev-application'],['operational-evidence']],
 ['cloudtrail','Identify which recorded API actor and operation explain a resource change.',['observe-debug','security-iam-sts'],['dev-application'],['operational-evidence']],
 ['bedrock','Validate inference and tool outcomes separately from application authorization.',['dev-ai-integration','security-ai-controls'],['dev-application','security-iam-sts'],['ai-responsibilities']],
 ['agentcore','Map runtime, gateway/tool, identity, memory and observation responsibilities.',['dev-ai-integration','security-ai-controls'],['security-iam-sts','observe-debug'],['ai-responsibilities']],
 ['quick','Separate connected-information access from business actions in the chosen capability.',['dev-ai-integration','security-ai-controls'],['security-sensitive-data'],['ai-responsibilities']],
 ['kiro','Connect generated implementation tasks to reviewed requirements and independent tests.',['dev-ai-integration','layered-testing'],['dev-application'],['ai-responsibilities']],
 ['q-developer','Review generated code and tests in the selected development workflow.',['dev-application','layered-testing'],['security-iam-sts'],['ai-responsibilities']],
];
const existing=new Set(serviceCatalog.map(s=>s.id));
export const serviceLearningMetadata:ServiceLearningMetadata[]=rows.map(([serviceId,focus,lessonIds,prerequisiteLessonIds,comparisonIds])=>{
 const service=canvasCatalog.find(s=>s.id===serviceId);
 if(!service)throw new Error('Unknown service learning ID: '+serviceId);
 const legacy=['appsync','q-developer'].includes(serviceId);
 return {serviceId,name:service.name,category:service.category,scope:legacy?'legacy':'exam',examVersions:legacy?['DVA-C02']:existing.has(serviceId)?['DVA-C02','DVA-C03']:['DVA-C03'],focus,lessonIds,prerequisiteLessonIds,comparisonIds,learningOutcomes:[focus,`Explain the permission and failure boundaries in the ${service.name} worked example.`,`Identify which ${service.name} assumptions need documentation or account evidence before deployment.`]};
});
export const getServiceLearningMetadata=(serviceId:string)=>serviceLearningMetadata.find(s=>s.serviceId===serviceId);
