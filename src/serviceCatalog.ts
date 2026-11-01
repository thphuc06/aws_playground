/** Snapshot of the official published DVA-C02 in-scope list, not an exhaustive exam guarantee. */
export const catalogVerified = '2026-11-01';
export const catalogSources = [
  {id:'scope',title:'DVA-C02 in-scope services and features',url:'https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/dva-02-in-scope-services.html',verified:catalogVerified},
  ...[ ['development','Development with AWS Services',1], ['security','Security',2], ['deployment','Deployment',3], ['troubleshooting','Troubleshooting and Optimization',4] ].map(([id,title,domain])=>({id:String(id),title:`DVA-C02: ${title}`,url:`https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain${domain}.html`,verified:catalogVerified})),
];
export const catalogScopeNote = 'All 47 entries in the published AWS in-scope list are included in this snapshot. AWS says that list is non-exhaustive and may change. Placement is not integration validation or simulation. Purpose and study notes are concise learning guidance, not an exhaustive configuration syllabus.';
export interface CatalogService { id:string; name:string; category:string; purpose:string; relevance:string; modeled:boolean }
export const catalogCategoryCounts:Record<string,number>={
 'Analytics':3,'Application Integration':5,'Compute':3,'Containers':3,'Database':4,'Developer Tools':8,'Management and Governance':7,'Networking and Content Delivery':5,'Security, Identity, and Compliance':6,'Storage':3,
};
type Row=[string,string,string,string];
const groups:Record<string,Row[]>={
 'Analytics':[
  ['athena','Amazon Athena','Query data using SQL without managing query servers.','Study querying stored application data and operational evidence.'],
  ['kinesis','Amazon Kinesis','Collect and process streaming data.','Study stream producers, consumers and application processing patterns.'],
  ['opensearch','Amazon OpenSearch Service','Managed search and analytics for indexed data.','Study search-backed applications and log analysis.'],
 ],
 'Application Integration':[
  ['appsync','AWS AppSync','Managed APIs for application data and real-time interactions.','Study API integration, authorization and application data access.'],
  ['eventbridge','Amazon EventBridge','Route events between applications and services.','Study event-driven patterns; select this node for a bounded exact-pattern and target-readiness preview; it does not execute a real event bus.'],
  ['sns','Amazon Simple Notification Service (Amazon SNS)','Publish notifications to subscribed destinations.','Study publish/subscribe, fan-out and filtering.'],
  ['sqs','Amazon Simple Queue Service (Amazon SQS)','Buffer messages between producers and consumers.','Study asynchronous processing, retries and consumer permissions.'],
  ['step-functions','AWS Step Functions','Coordinate workflow steps using state machines.','Study orchestration, retries and error paths.'],
 ],
 'Compute':[
  ['ec2','Amazon EC2','Run applications on configurable virtual machines.','Study application runtime, instance roles and deployment context.'],
  ['elastic-beanstalk','AWS Elastic Beanstalk','Deploy applications into managed application environments.','Study environment configuration, application versions and deployment health.'],
  ['lambda','AWS Lambda','Run event-driven function code without managing servers.','Study handlers, execution roles, triggers, configuration and failures.'],
 ],
 'Containers':[
  ['ecr','Amazon Elastic Container Registry (Amazon ECR)','Store and distribute container images.','Study image artifacts, tags and deployment dependencies.'],
  ['ecs','Amazon Elastic Container Service (Amazon ECS)','Run and manage containerized applications.','Study task configuration, application roles and container deployments.'],
  ['eks','Amazon Elastic Kubernetes Service (Amazon EKS)','Run applications on managed Kubernetes control planes.','Study container deployment, application health and observability concepts.'],
 ],
 'Database':[
  ['aurora','Amazon Aurora','Managed relational database compatible with MySQL or PostgreSQL.','Study relational application access and connection behavior.'],
  ['dynamodb','Amazon DynamoDB','Store key-value and document data in managed tables.','Study keys, access patterns and scoped data permissions; this model uses PutItem.'],
  ['elasticache','Amazon ElastiCache','Provide managed in-memory caching.','Study cache strategies and application performance.'],
  ['rds','Amazon RDS','Operate managed relational database instances.','Study database access, credentials and application connections.'],
 ],
 'Developer Tools':[
  ['amplify','AWS Amplify','Build and deploy web and mobile application experiences.','Study application environments and deployment workflows.'],
  ['cloudshell','AWS CloudShell','Provide a browser-based shell for AWS tooling.','Study authenticated command-line development workflows.'],
  ['codeartifact','AWS CodeArtifact','Store and share software dependency packages.','Study dependency management and build artifact access.'],
  ['codebuild','AWS CodeBuild','Build and test application code in managed build environments.','Study build configuration, tests and packaged artifacts.'],
  ['codedeploy','AWS CodeDeploy','Automate application deployments to supported compute targets.','Study deployment strategies, health checks and rollback.'],
  ['codepipeline','AWS CodePipeline','Coordinate stages in software delivery pipelines.','Study CI/CD stages, approvals and artifact flow.'],
  ['xray','AWS X-Ray','Collect and analyze distributed application traces.','Study tracing, annotations and diagnosing service calls.'],
  ['q-developer','Amazon Q Developer','Assist developers with software development tasks.','Study development assistance and generated tests; no AI requests run here.'],
 ],
 'Management and Governance':[
  ['appconfig','AWS AppConfig','Manage and deploy application configuration changes.','Study environment-specific configuration and controlled rollout.'],
  ['cdk','AWS Cloud Development Kit (AWS CDK)','Define cloud infrastructure using programming languages.','Study infrastructure-as-code application deployment workflows.'],
  ['cloudformation','AWS CloudFormation','Provision resources from infrastructure templates.','Study stack updates and deployment templates.'],
  ['cloudtrail','AWS CloudTrail','Record AWS account activity and API events.','Study identifying callers and investigating service activity.'],
  ['cloudwatch','Amazon CloudWatch','Collect metrics and logs and evaluate alarms.','Study instrumentation, dashboards, log queries and alerts.'],
  ['cli','AWS Command Line Interface (AWS CLI)','Call AWS service APIs from the command line.','Study programmatic access and repeatable developer operations.'],
  ['systems-manager','AWS Systems Manager','Provide operational tooling and application parameter management.','Study configuration retrieval and managed operational workflows.'],
 ],
 'Networking and Content Delivery':[
  ['api','Amazon API Gateway','Expose managed API endpoints and route requests.','Study API integrations, stages, authorization and responses.'],
  ['cloudfront','Amazon CloudFront','Deliver content through a distributed edge network.','Study caching behavior and application content delivery.'],
  ['elb','Elastic Load Balancing','Distribute traffic across application targets.','Study routing, target health and application availability.'],
  ['route53','Amazon Route 53','Manage DNS resolution and traffic-routing records.','Study application endpoint names and routing context.'],
  ['vpc','Amazon VPC','Provide logically isolated networking for AWS resources.','Study application access to private resources; not full network design.'],
 ],
 'Security, Identity, and Compliance':[
  ['cognito','Amazon Cognito','Manage application user identity and federated access.','Study application authentication, tokens and authorization.'],
  ['iam','AWS Identity and Access Management (IAM)','Control identities, roles and AWS permissions.','Study least privilege, principal permissions and role access.'],
  ['kms','AWS Key Management Service (AWS KMS)','Manage encryption keys and cryptographic operations.','Study encryption permissions and key use in applications.'],
  ['secrets-manager','AWS Secrets Manager','Store, retrieve and rotate application secrets.','Study secure secret access and sensitive configuration.'],
  ['sts','AWS Security Token Service (AWS STS)','Issue temporary credentials for AWS access.','Study role assumption and temporary application credentials.'],
  ['waf','AWS WAF','Filter web requests using application-layer rules.','Study protecting application endpoints from unwanted requests.'],
 ],
 'Storage':[
  ['ebs','Amazon Elastic Block Store (Amazon EBS)','Provide block storage volumes for compute instances.','Study application persistence and storage requirements.'],
  ['efs','Amazon Elastic File System (Amazon EFS)','Provide shared file storage for supported compute clients.','Study shared file access and application storage choices.'],
  ['s3','Amazon S3','Store objects accessed through service APIs.','Study object operations, access permissions and application data storage.'],
 ],
};
export const serviceCatalog:CatalogService[]=Object.entries(groups).flatMap(([category,rows])=>rows.map(([id,name,purpose,relevance])=>({id,name,category,purpose,relevance,modeled:['api','lambda','dynamodb','sqs'].includes(id)})));
