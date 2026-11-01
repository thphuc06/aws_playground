# AWS Developer Playground — Configuration Coverage

Generated from `src/configurationCoverage.ts` on **2026-11-01**.

## What completion means

All **47 catalog services** have a source-reviewed, bounded configuration lesson or focused preview in this version. This is **not complete AWS configuration coverage**, a full DVA-C02 curriculum, a production architecture validator, or an AWS deployment. Source-review dates identify the documentation review, not an AWS compatibility guarantee.

- Editable settings drive local validation, conditional findings, or an explicit explanatory trace within each stated slice.
- The API, Lambda, and EventBridge previews have dedicated typed engines. The other 44 services use independent service lessons; their settings do **not** configure canvas integrations or change AWS resources.
- Browser-only examples use synthetic values and asserted prerequisites. They do not execute user code, commands, queries, infrastructure, IAM changes, or AI requests.
- Permission switches represent narrow declared grants under stated assumptions; they do not parse policies or prove effective AWS authorization.
- Each entry below records scope, settings, exam mapping, source-review dates, examples, check categories, and omissions. Exam mappings are instructional relevance, not claims that every service feature is tested on the exam.
- Automated checks verify selected happy paths, failures, boundaries, field handling, and persistence. They do not prove every production behavior or replace browser QA and AWS documentation.

## Coverage index

| Service | Category | Coverage status |
| --- | --- | --- |
| Amazon Athena (`athena`) | Analytics | source-reviewed slice |
| Amazon Kinesis (`kinesis`) | Analytics | source-reviewed slice |
| Amazon OpenSearch Service (`opensearch`) | Analytics | source-reviewed slice |
| AWS AppSync (`appsync`) | Application Integration | source-reviewed slice |
| Amazon EventBridge (`eventbridge`) | Application Integration | source-reviewed slice |
| Amazon Simple Notification Service (Amazon SNS) (`sns`) | Application Integration | source-reviewed slice |
| Amazon Simple Queue Service (Amazon SQS) (`sqs`) | Application Integration | source-reviewed slice |
| AWS Step Functions (`step-functions`) | Application Integration | source-reviewed slice |
| Amazon EC2 (`ec2`) | Compute | source-reviewed slice |
| AWS Elastic Beanstalk (`elastic-beanstalk`) | Compute | source-reviewed slice |
| AWS Lambda (`lambda`) | Compute | source-reviewed slice |
| Amazon Elastic Container Registry (Amazon ECR) (`ecr`) | Containers | source-reviewed slice |
| Amazon Elastic Container Service (Amazon ECS) (`ecs`) | Containers | source-reviewed slice |
| Amazon Elastic Kubernetes Service (Amazon EKS) (`eks`) | Containers | source-reviewed slice |
| Amazon Aurora (`aurora`) | Database | source-reviewed slice |
| Amazon DynamoDB (`dynamodb`) | Database | source-reviewed slice |
| Amazon ElastiCache (`elasticache`) | Database | source-reviewed slice |
| Amazon RDS (`rds`) | Database | source-reviewed slice |
| AWS Amplify (`amplify`) | Developer Tools | source-reviewed slice |
| AWS CloudShell (`cloudshell`) | Developer Tools | source-reviewed slice |
| AWS CodeArtifact (`codeartifact`) | Developer Tools | source-reviewed slice |
| AWS CodeBuild (`codebuild`) | Developer Tools | source-reviewed slice |
| AWS CodeDeploy (`codedeploy`) | Developer Tools | source-reviewed slice |
| AWS CodePipeline (`codepipeline`) | Developer Tools | source-reviewed slice |
| AWS X-Ray (`xray`) | Developer Tools | source-reviewed slice |
| Amazon Q Developer (`q-developer`) | Developer Tools | source-reviewed slice |
| AWS AppConfig (`appconfig`) | Management and Governance | source-reviewed slice |
| AWS Cloud Development Kit (AWS CDK) (`cdk`) | Management and Governance | source-reviewed slice |
| AWS CloudFormation (`cloudformation`) | Management and Governance | source-reviewed slice |
| AWS CloudTrail (`cloudtrail`) | Management and Governance | source-reviewed slice |
| Amazon CloudWatch (`cloudwatch`) | Management and Governance | source-reviewed slice |
| AWS Command Line Interface (AWS CLI) (`cli`) | Management and Governance | source-reviewed slice |
| AWS Systems Manager (`systems-manager`) | Management and Governance | source-reviewed slice |
| Amazon API Gateway (`api`) | Networking and Content Delivery | source-reviewed slice |
| Amazon CloudFront (`cloudfront`) | Networking and Content Delivery | source-reviewed slice |
| Elastic Load Balancing (`elb`) | Networking and Content Delivery | source-reviewed slice |
| Amazon Route 53 (`route53`) | Networking and Content Delivery | source-reviewed slice |
| Amazon VPC (`vpc`) | Networking and Content Delivery | source-reviewed slice |
| Amazon Cognito (`cognito`) | Security, Identity, and Compliance | source-reviewed slice |
| AWS Identity and Access Management (IAM) (`iam`) | Security, Identity, and Compliance | source-reviewed slice |
| AWS Key Management Service (AWS KMS) (`kms`) | Security, Identity, and Compliance | source-reviewed slice |
| AWS Secrets Manager (`secrets-manager`) | Security, Identity, and Compliance | source-reviewed slice |
| AWS Security Token Service (AWS STS) (`sts`) | Security, Identity, and Compliance | source-reviewed slice |
| AWS WAF (`waf`) | Security, Identity, and Compliance | source-reviewed slice |
| Amazon Elastic Block Store (Amazon EBS) (`ebs`) | Storage | source-reviewed slice |
| Amazon Elastic File System (Amazon EFS) (`efs`) | Storage | source-reviewed slice |
| Amazon S3 (`s3`) | Storage | source-reviewed slice |

## Amazon Athena — `athena`

**Category:** Analytics · **Status:** source-reviewed slice

### Implemented slice

S3-backed SQL query planning with an illustrative scan count; SQL parsing and managed-result mode are excluded.

### Settings

- Query and source-data access
- Read the S3 result object
- Results use a customer-managed KMS key
- Required result-key permissions
- Illustrative scanned data
- Per-query scan cutoff

### DVA-C02 relevance

- [DVA-C02 development: Practice development concepts through this bounded service-specific lesson; not an exhaustive task mapping.](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [Athena query results](https://docs.aws.amazon.com/athena/latest/ug/querying.html) — reviewed **2026-11-01**
- [Scan controls](https://docs.aws.amazon.com/athena/latest/ug/workgroups-setting-control-limits-cloudwatch.html) — reviewed **2026-11-01**
- [API cutoff minimum](https://docs.aws.amazon.com/athena/latest/APIReference/API_WorkGroupConfiguration.html) — reviewed **2026-11-01**

### Examples

- Working lesson setup
- Find and repair the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- This is a configuration/reasoning lesson, not a full service emulator or IAM policy evaluator.
- Customer-owned S3 result path only; managed results, Lake Formation, SQL validity and billing calculations are not evaluated.

## Amazon Kinesis — `kinesis`

**Category:** Analytics · **Status:** source-reviewed slice

### Implemented slice

Data Streams producer/consumer replay lesson; record rate, shard capacity and global ordering are not simulated.

### Settings

- Partition key
- Producer write permission
- Consumer read permission
- Retention window
- Illustrative consumer lag
- Checkpoint after successful processing
- Duplicate-safe side effect

### DVA-C02 relevance

- [DVA-C02 development: Practice development concepts through this bounded service-specific lesson; not an exhaustive task mapping.](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [Stream concepts](https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html) — reviewed **2026-11-01**
- [Duplicate records](https://docs.aws.amazon.com/streams/latest/dev/kinesis-record-processor-duplicates.html) — reviewed **2026-11-01**
- [Retention API](https://docs.aws.amazon.com/kinesis/latest/APIReference/API_IncreaseStreamRetentionPeriod.html) — reviewed **2026-11-01**

### Examples

- Working lesson setup
- Find and repair the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- This is a configuration/reasoning lesson, not a full service emulator or IAM policy evaluator.
- Data Streams only, not all Kinesis-branded products; checkpoint storage and KCL internals are not implemented.

## Amazon OpenSearch Service — `opensearch`

**Category:** Analytics · **Status:** source-reviewed slice

### Implemented slice

An IAM-authenticated request to a provisioned OpenSearch domain with fine-grained access enabled.

### Settings

- Data operation
- Network can reach the domain
- Domain policy permits the request
- Request signed with SigV4
- Fine-grained role permits the index action
- HTTPS transport

### DVA-C02 relevance

- [DVA-C02 security: Practice security concepts through this bounded service-specific lesson; not an exhaustive task mapping.](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain2.html)

### Official sources and review dates

- [Access policies](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ac.html) — reviewed **2026-11-01**
- [Fine-grained access](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/fgac.html) — reviewed **2026-11-01**

### Examples

- Working lesson setup
- Find and repair the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- This is a configuration/reasoning lesson, not a full service emulator or IAM policy evaluator.
- No query syntax, index mappings, capacity sizing, OpenSearch Serverless or actual HTTP request.

## AWS AppSync — `appsync`

**Category:** Application Integration · **Status:** source-reviewed slice

### Implemented slice

One GraphQL field using API_KEY or AWS_IAM, backed by a declared DynamoDB resolver.

### Settings

- Client authorization
- Credential valid
- IAM GraphQL field allowed
- Resolver attached
- Resolver role GetItem allowed
- Contains private user data

### DVA-C02 relevance

- [1.1.6: Develop and maintain APIs](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)
- [1.1.9: Interact with AWS service APIs](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [AWS official documentation](https://docs.aws.amazon.com/appsync/latest/devguide/security-authz.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/appsync/latest/devguide/attaching-a-data-source.html) — reviewed **2026-11-01**

### Examples

- Working configuration
- Find the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- No schema execution, resolver code, subscriptions, ownership rules or AppSync Events. IAM field grant is only checked in IAM mode.
- Independent local lesson; settings do not change canvas edge permissions or create AWS resources.
- Declared permissions represent a narrowly scoped allow with no overriding denies; not a complete IAM, network or service emulator.
- Coverage: this reviewed vertical slice only. Other APIs, quotas, regional/version differences, billing and production operations remain unmodeled.

## Amazon EventBridge — `eventbridge`

**Category:** Application Integration · **Status:** source-reviewed slice

### Implemented slice

One Classic bus rule: exact-pattern matching and up to five Lambda/SQS target-readiness assertions.

### Settings

- Default/custom bus
- Enabled rule
- Pattern JSON
- Sample event JSON
- Target attachment
- Target resource policy

### DVA-C02 relevance

- [1.1.12: Event-driven application patterns with EventBridge](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [bus](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_CreateEventBus.html) — reviewed **2026-11-01**
- [pattern](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-pattern.html) — reviewed **2026-11-01**
- [arrays](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns-arrays.html) — reviewed **2026-11-01**
- [permissions](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-use-resource-based.html) — reviewed **2026-11-01**
- [targets](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutTargets.html) — reviewed **2026-11-01**

### Examples

- Pattern match
- Filtered sample
- Unsupported pattern
- Missing target permission

### Checks

AND/OR/nesting/array/null cases, unsupported and malformed JSON, target limits, persistence and instance isolation.

### Explicit gaps and assumptions

- Local rule preview only; no PutEvents, deployments, permission changes, charges, or downstream Lambda execution.
- One Classic enabled/disabled rule on a default or custom bus; same-account, same-Region Lambda or standard SQS targets only. Bus and service labels do not change matching.
- Pattern subset: source, detail-type, and nested detail. Keys are AND; exact string, boolean, or null alternatives in nonempty leaf arrays are OR. Event-array matching uses intersection.
- Numeric pattern values, operators, dotted keys, duplicate JSON keys, and arrays of objects are rejected rather than approximated. Numeric event values may exist but cannot be selected by this subset.
- Sample input accepts only source, detail-type, and detail. Actual AWS event envelopes also contain fields such as id, time, account, region, and resources; remove these for this reduced preview, not for real AWS events.
- JSON input is limited to 10,000 characters and depth 10. Missing fields fail a match. Strings match case-sensitively, without normalization.
- This preview chooses target resource policies without an EventBridge target execution role. AWS also supports target execution roles; those are distinct from a Lambda function execution role. Resource-policy assertions model EventBridge invocation/send grants. IAM policy parsing, publisher permissions, retries, DLQs, Scheduler, Pipes, FIFO, and real delivery are not modeled.

## Amazon Simple Notification Service (Amazon SNS) — `sns`

**Category:** Application Integration · **Status:** source-reviewed slice

### Implemented slice

One standard topic to one same-account SQS queue; exact string category filter.

### Settings

- Filter scope
- Accepted category
- Attribute category
- Body category
- Publisher sns:Publish allowed
- Queue allows topic

### DVA-C02 relevance

- [1.1.8: Use messaging services](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [AWS official documentation](https://docs.aws.amazon.com/sns/latest/dg/sns-subscription-filter-policies.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/sns/latest/dg/subscribe-sqs-queue-to-sns-topic.html) — reviewed **2026-11-01**

### Examples

- Working configuration
- Find the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- Subscription assumed confirmed; no retry clock, raw-delivery envelope, FIFO or filter operators. Filter edits can take up to 15 minutes in AWS; local preview applies immediately.
- Independent local lesson; settings do not change canvas edge permissions or create AWS resources.
- Declared permissions represent a narrowly scoped allow with no overriding denies; not a complete IAM, network or service emulator.
- Coverage: this reviewed vertical slice only. Other APIs, quotas, regional/version differences, billing and production operations remain unmodeled.

## Amazon Simple Queue Service (Amazon SQS) — `sqs`

**Category:** Application Integration · **Status:** source-reviewed slice

### Implemented slice

One standard-queue receive, with optional redrive threshold; manual consumer rather than Lambda polling.

### Settings

- Visibility seconds
- Processing seconds
- Receive and delete allowed
- Processing succeeds
- Delete after success
- Idempotent handler
- Receive count
- DLQ max receive count

### DVA-C02 relevance

- [1.1.8: Use messaging services](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)
- [1.1.5: Build resilient applications](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [AWS official documentation](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-api-permissions-reference.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SetQueueAttributes.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_DeleteMessage.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues-at-least-once-delivery.html) — reviewed **2026-11-01**

### Examples

- Working configuration
- Find the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- No guarantee of exactly-once delivery; expiry equality is conservatively treated as overlap. DLQ policy/retention assumed configured; no timing of real redrive, FIFO, encryption or Lambda batch semantics.
- Independent local lesson; settings do not change canvas edge permissions or create AWS resources.
- Declared permissions represent a narrowly scoped allow with no overriding denies; not a complete IAM, network or service emulator.
- Coverage: this reviewed vertical slice only. Other APIs, quotas, regional/version differences, billing and production operations remain unmodeled.

## AWS Step Functions — `step-functions`

**Category:** Application Integration · **Status:** source-reviewed slice

### Implemented slice

One Standard workflow Lambda Task with exact TransientError retry and optional fallback.

### Settings

- Task role can invoke Lambda
- Transient failures before success
- Maximum retries
- Initial retry seconds
- Backoff rate
- Catch TransientError

### DVA-C02 relevance

- [1.1.1: Architectural orchestration patterns](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)
- [1.1.5: Build resilient applications](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [AWS official documentation](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/step-functions/latest/dg/procedure-create-iam-role.html) — reviewed **2026-11-01**

### Examples

- Working configuration
- Find the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- No ASL execution, jitter, parallel/map, Express, timeouts or States.ALL claims. Task side effects require idempotency; retries are not transactions.
- Independent local lesson; settings do not change canvas edge permissions or create AWS resources.
- Declared permissions represent a narrowly scoped allow with no overriding denies; not a complete IAM, network or service emulator.
- Coverage: this reviewed vertical slice only. Other APIs, quotas, regional/version differences, billing and production operations remain unmodeled.

## Amazon EC2 — `ec2`

**Category:** Compute · **Status:** source-reviewed slice

### Implemented slice

An instance application uses an SDK to call PutItem. Separate credentials, authorization and outbound network reachability.

### Settings

- Credential source
- Role permission
- DynamoDB endpoint reachable
- Dependency response time
- SDK request budget
- Log safe request IDs

### DVA-C02 relevance

- [2.1: Implement application authentication and authorization](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain2.html)
- [1.1: Develop code for applications hosted on AWS](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [EC2 instance roles](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html) — reviewed **2026-11-01**
- [SDK retries](https://docs.aws.amazon.com/sdkref/latest/guide/feature-retry-behavior.html) — reviewed **2026-11-01**

### Examples

- Working baseline
- Broken scenario

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- Local deterministic teaching checks only: no AWS APIs, deployment, credentials, network traffic or real security validation. Other AWS settings and service quotas are intentionally omitted.
- Assumes a running instance, trusted EC2 role and existing table. Does not model provisioning, resource policies, IMDS settings or actual retry timing.

## AWS Elastic Beanstalk — `elastic-beanstalk`

**Category:** Compute · **Status:** source-reviewed slice

### Implemented slice

An EC2-based environment changes application version; compare rolling capacity with immutable replacement.

### Settings

- Deployment strategy
- Current instances
- Rolling batch size
- Required serving capacity
- New version passes health checks
- Version artifact and permissions available

### DVA-C02 relevance

- [3.4: Deploy versions and use deployment strategies](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain3.html)

### Official sources and review dates

- [Beanstalk deployment policies](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.rolling-version-deploy.html) — reviewed **2026-11-01**

### Examples

- Working baseline
- Broken scenario

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- Local deterministic teaching checks only: no AWS APIs, deployment, credentials, network traffic or real security validation. Other AWS settings and service quotas are intentionally omitted.
- Only EC2 rolling and immutable behavior is represented. No Beanstalk Cluster, scaling, additional-batch, traffic splitting, cost, provisioning or automatic rollback guarantees.

## AWS Lambda — `lambda`

**Category:** Compute · **Status:** source-reviewed slice

### Implemented slice

Function timeout and declared handler-duration preview, API invocation grants and per-outgoing DynamoDB/SQS execution-role assertions.

### Settings

- Function timeout
- Mock handler duration
- API invocation resource permissions
- Downstream execution-role permissions

### DVA-C02 relevance

- [1.2: Develop code for AWS Lambda](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)
- [2.1: Authentication and authorization for applications and AWS services](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain2.html)

### Official sources and review dates

- [lambdaTimeout](https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html) — reviewed **2026-11-01**
- [lambdaRole](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html) — reviewed **2026-11-01**
- [dynamodb](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/iam-policy-specific-table-indexes.html) — reviewed **2026-11-01**
- [sqs](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-api-permissions-reference.html) — reviewed **2026-11-01**
- [stages](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-stages.html) — reviewed **2026-11-01**
- [routes](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html) — reviewed **2026-11-01**
- [integration](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html) — reviewed **2026-11-01**
- [permission](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html) — reviewed **2026-11-01**
- [limits](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-quotas.html) — reviewed **2026-11-01**

### Examples

- Complete before timeout
- Timeout before completion
- Missing downstream role grant

### Checks

Timeout bounds/deadlines, independent permissions, persistence and browser inspector checks.

### Explicit gaps and assumptions

- Local teaching previews only: no code execution, AWS requests, deployment, or policy changes. A completed mock is not proof that real handler code succeeds.
- Ordinary Lambda Event Functions only: Lambda models timeout and declared mock duration, plus DynamoDB PutItem / SQS SendMessage execution-role assertions on outgoing edges. It does not model memory, concurrency, retries, startup, networking, encryption, or full IAM evaluation.
- Timeout equality is treated conservatively as timeout in this deterministic teaching model, not a guarantee about real scheduling. No timeout proves the absence or rollback of earlier side effects.
- The deployed switch describes the current route configuration. Earlier deployment snapshots and auto-deployment are not modeled; an undeployed edit does not prove a real existing endpoint stopped serving.
- HTTP API models GET/POST exact literal paths, payload format 2.0, auth NONE, and the $default stage. This intentionally unauthenticated example is not a production security recommendation.
- Path parameters, greedy variables, wildcards, $default routes, query strings, URL encoding, request bodies, CORS, authorizers, response mapping, and custom domains are outside this preview.
- One sample HTTP request selects at most one exact route and one Lambda target. Whole-graph dependency walkthroughs are separate and do not represent HTTP fan-out.
- The preview assumes the HTTP API maximum integration timeout of 30 seconds; a configured lower timeout is not modeled. An HTTP timeout does not imply Lambda was cancelled. Incoming API invocation permission is a Lambda resource policy, separate from its execution role.

## Amazon Elastic Container Registry (Amazon ECR) — `ecr`

**Category:** Containers · **Status:** source-reviewed slice

### Implemented slice

A build pushes an image tag; inspect permission, overwrite behavior and release identity.

### Settings

- Image tag
- Tag already exists
- Tag policy
- Publisher can push
- Scan configured
- Deployment reference

### DVA-C02 relevance

- [3.1: Prepare application artifacts for deployment](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain3.html)

### Official sources and review dates

- [ECR tag mutability](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html) — reviewed **2026-11-01**
- [ECR overview](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html) — reviewed **2026-11-01**

### Examples

- Working baseline
- Broken scenario

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- Local deterministic teaching checks only: no AWS APIs, deployment, credentials, network traffic or real security validation. Other AWS settings and service quotas are intentionally omitted.
- No actual registry, image scanning or vulnerability detection. Current AWS supports mutability exceptions; this deliberately models plain mutable/immutable only.

## Amazon Elastic Container Service (Amazon ECS) — `ecs`

**Category:** Containers · **Status:** source-reviewed slice

### Implemented slice

Separate image/log startup permissions from application API permissions, then inspect container memory.

### Settings

- Execution role can pull image
- Task role can write table
- Container memory limit
- Application memory demand
- Application health check passes
- Execution role can deliver configured logs

### DVA-C02 relevance

- [2.1: Implement application authentication and authorization](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain2.html)
- [3.4: Deploy versions and use deployment strategies](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain3.html)

### Official sources and review dates

- [ECS task role](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html) — reviewed **2026-11-01**
- [ECS execution role](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html) — reviewed **2026-11-01**
- [ECS task definition memory settings](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html) — reviewed **2026-11-01**

### Examples

- Working baseline
- Broken scenario

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- Local deterministic teaching checks only: no AWS APIs, deployment, credentials, network traffic or real security validation. Other AWS settings and service quotas are intentionally omitted.
- Not an ECS scheduler or complete task-definition validator. Assumes valid compute sizing, networking, trust and image; no actual memory allocation.

## Amazon Elastic Kubernetes Service (Amazon EKS) — `eks`

**Category:** Containers · **Status:** source-reviewed slice

### Implemented slice

A checklist for one Pod using EKS Pod Identity; this is not a Kubernetes simulator or IRSA validator.

### Settings

- Credential approach
- Pod service account
- Associated service account
- Pod Identity agent and supported SDK ready
- Associated role allows required API
- Pod readiness succeeds
- Audit diagnostics available

### DVA-C02 relevance

- [2.1: Implement application authentication and authorization](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain2.html)
- [1.1: Develop code for applications hosted on AWS](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [EKS Pod Identity](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html) — reviewed **2026-11-01**
- [EKS control-plane logs](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html) — reviewed **2026-11-01**

### Examples

- Working baseline
- Broken scenario

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- Local deterministic teaching checks only: no AWS APIs, deployment, credentials, network traffic or real security validation. Other AWS settings and service quotas are intentionally omitted.
- No scheduling, Kubernetes API execution, RBAC evaluation, IRSA/OIDC or network-policy simulation. Assumes same cluster/namespace and otherwise valid trust; security groups/routes remain independent.

## Amazon Aurora — `aurora`

**Category:** Database · **Status:** source-reviewed slice

### Implemented slice

One Aurora provisioned cluster connection and SELECT or write; no SQL execution.

### Settings

- Endpoint
- Available reader replicas
- SQL intent
- Network reachable
- Database login valid
- SQL privilege granted

### DVA-C02 relevance

- [1.3.6: Use, manage, and maintain data stores](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [AWS official documentation](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Connecting.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Endpoints.Reader.html) — reviewed **2026-11-01**

### Examples

- Working configuration
- Find the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- No failover timing, DNS caching, transaction replay, global database or Serverless variants. No replica freshness guarantee; this is endpoint selection only.
- Independent local lesson; settings do not change canvas edge permissions or create AWS resources.
- Declared permissions represent a narrowly scoped allow with no overriding denies; not a complete IAM, network or service emulator.
- Coverage: this reviewed vertical slice only. Other APIs, quotas, regional/version differences, billing and production operations remain unmodeled.

## Amazon DynamoDB — `dynamodb`

**Category:** Database · **Status:** source-reviewed slice

### Implemented slice

One Query on a table or GSI using a supplied equality partition key.

### Settings

- Query target
- Strongly consistent
- Partition-key equality
- Query permission
- Items evaluated
- Items passing filter

### DVA-C02 relevance

- [1.3.2: Database consistency](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)
- [1.3.3: Query versus scan](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)
- [1.3.4: DynamoDB keys and indexes](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [AWS official documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.KeyConditionExpressions.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/iam-policy-example-data-crud.html) — reviewed **2026-11-01**

### Examples

- Working configuration
- Find the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- Synthetic counts, not capacity-unit estimates. No full expressions, pagination, conditional writes, global tables or SDK calls; real Query pages are limited before filters.
- Independent local lesson; settings do not change canvas edge permissions or create AWS resources.
- Declared permissions represent a narrowly scoped allow with no overriding denies; not a complete IAM, network or service emulator.
- Coverage: this reviewed vertical slice only. Other APIs, quotas, regional/version differences, billing and production operations remain unmodeled.

## Amazon ElastiCache — `elasticache`

**Category:** Database · **Status:** source-reviewed slice

### Implemented slice

Application-managed lazy loading with a single cached key and TTL.

### Settings

- Cache reachable
- Key in cache
- Entry age seconds
- TTL seconds
- Database changed since fill
- Database read authorized

### DVA-C02 relevance

- [1.3.8: Use caching services](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [AWS official documentation](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/accessing-elasticache.html) — reviewed **2026-11-01**

### Examples

- Working configuration
- Find the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- Memcached cache-aside only, not Valkey/Redis commands, TLS/auth variants, eviction or high availability. Network is a declared precondition, not full security evaluation.
- Independent local lesson; settings do not change canvas edge permissions or create AWS resources.
- Declared permissions represent a narrowly scoped allow with no overriding denies; not a complete IAM, network or service emulator.
- Coverage: this reviewed vertical slice only. Other APIs, quotas, regional/version differences, billing and production operations remain unmodeled.

## Amazon RDS — `rds`

**Category:** Database · **Status:** source-reviewed slice

### Implemented slice

A new PostgreSQL IAM-authenticated connection on a supported RDS configuration.

### Settings

- DB network reachable
- IAM DB auth enabled
- Database user has rds_iam
- rds-db:connect granted
- Token age seconds
- TLS verified

### DVA-C02 relevance

- [1.3.6: Use, manage, and maintain data stores](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [AWS official documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.DBAccounts.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.IAMPolicy.html) — reviewed **2026-11-01**

### Examples

- Working configuration
- Find the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- No token generation, SQL privileges, RDS Proxy, network route evaluation or engine-version matrix. Expiry equality is conservatively treated as expired; existing sessions intentionally not simulated.
- Independent local lesson; settings do not change canvas edge permissions or create AWS resources.
- Declared permissions represent a narrowly scoped allow with no overriding denies; not a complete IAM, network or service emulator.
- Coverage: this reviewed vertical slice only. Other APIs, quotas, regional/version differences, billing and production operations remain unmodeled.

## AWS Amplify — `amplify`

**Category:** Developer Tools · **Status:** source-reviewed slice

### Implemented slice

A Git-connected static Amplify Hosting build plan; backend provisioning and SSR runtime are omitted.

### Settings

- Planned build command
- Directory the build produces
- Configured artifact directory
- Illustrative build succeeds
- Illustrative checks pass
- Frontend secret handling

### DVA-C02 relevance

- [DVA-C02 deployment: Practice deployment concepts through this bounded service-specific lesson; not an exhaustive task mapping.](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain3.html)

### Official sources and review dates

- [Hosting build settings](https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html) — reviewed **2026-11-01**
- [Hosting overview](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html) — reviewed **2026-11-01**

### Examples

- Working lesson setup
- Find and repair the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- This is a configuration/reasoning lesson, not a full service emulator or IAM policy evaluator.
- No command execution, Git connection, framework validation, deployment role evaluator or hosting deployment.

## AWS CloudShell — `cloudshell`

**Category:** Developer Tools · **Status:** source-reviewed slice

### Implemented slice

CloudShell environment and caller checks; no terminal is opened and no command is sent.

### Settings

- Environment type
- Need files after environment termination
- Console identity permits the intended API
- Target API reachable
- Intended Region
- Command Region

### DVA-C02 relevance

- [DVA-C02 security: Practice security concepts through this bounded service-specific lesson; not an exhaustive task mapping.](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain2.html)

### Official sources and review dates

- [CloudShell environment](https://docs.aws.amazon.com/cloudshell/latest/userguide/welcome.html) — reviewed **2026-11-01**
- [CloudShell security](https://docs.aws.amazon.com/cloudshell/latest/userguide/security.html) — reviewed **2026-11-01**

### Examples

- Working lesson setup
- Find and repair the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- This is a configuration/reasoning lesson, not a full service emulator or IAM policy evaluator.
- No credential inspection, terminal execution or actual network connectivity test.

## AWS CodeArtifact — `codeartifact`

**Category:** Developer Tools · **Status:** source-reviewed slice

### Implemented slice

Authorization-token and repository-access checks for a package-manager request.

### Settings

- Domain name
- Can obtain authorization token
- Repository package operation allowed
- Package manager uses intended endpoint
- Token lifetime
- Elapsed token age

### DVA-C02 relevance

- [DVA-C02 security: Practice security concepts through this bounded service-specific lesson; not an exhaustive task mapping.](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain2.html)

### Official sources and review dates

- [Token authentication](https://docs.aws.amazon.com/codeartifact/latest/ug/tokens-authentication.html) — reviewed **2026-11-01**
- [Repository concepts](https://docs.aws.amazon.com/codeartifact/latest/ug/welcome.html) — reviewed **2026-11-01**

### Examples

- Working lesson setup
- Find and repair the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- This is a configuration/reasoning lesson, not a full service emulator or IAM policy evaluator.
- No package download, dependency integrity scan, package-manager execution or cross-account policy parser.

## AWS CodeBuild — `codebuild`

**Category:** Developer Tools · **Status:** source-reviewed slice

### Implemented slice

A supplied buildspec/artifact scenario, not an execution of commands or a full YAML parser.

### Settings

- Buildspec selected
- Commands and tests succeed
- Produced artifact directory
- Configured artifact directory
- Sensitive build values
- Build role permits required resources
- Build logs available

### DVA-C02 relevance

- [DVA-C02 deployment: Practice deployment concepts through this bounded service-specific lesson; not an exhaustive task mapping.](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain3.html)

### Official sources and review dates

- [Buildspec reference](https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html) — reviewed **2026-11-01**
- [Build service overview](https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html) — reviewed **2026-11-01**

### Examples

- Working lesson setup
- Find and repair the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- This is a configuration/reasoning lesson, not a full service emulator or IAM policy evaluator.
- No YAML validation, runtime/image availability check, real tests, VPC build networking or billing.

## AWS CodeDeploy — `codedeploy`

**Category:** Developer Tools · **Status:** source-reviewed slice

### Implemented slice

A deployment-group reasoning exercise with supplied health outcomes, not a real rollout.

### Settings

- Compute platform
- Revision/AppSpec matches platform
- Lifecycle validation succeeds
- Health alarm configured
- Automatic rollback enabled
- Candidate produces modeled errors

### DVA-C02 relevance

- [DVA-C02 deployment: Practice deployment concepts through this bounded service-specific lesson; not an exhaustive task mapping.](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain3.html)

### Official sources and review dates

- [Deployment platforms](https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html) — reviewed **2026-11-01**
- [Rollback semantics](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html) — reviewed **2026-11-01**

### Examples

- Working lesson setup
- Find and repair the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- This is a configuration/reasoning lesson, not a full service emulator or IAM policy evaluator.
- No traffic percentages, real hook execution, target-group configuration or reversal of database side effects.

## AWS CodePipeline — `codepipeline`

**Category:** Developer Tools · **Status:** source-reviewed slice

### Implemented slice

A single source/build/approval/deploy pipeline plan; no pipeline action runs.

### Settings

- Source revision label
- Action artifact names connect
- Pipeline/action roles permit resources
- Manual approval gate
- Approval granted
- Execution mode

### DVA-C02 relevance

- [DVA-C02 deployment: Practice deployment concepts through this bounded service-specific lesson; not an exhaustive task mapping.](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain3.html)

### Official sources and review dates

- [Pipeline concepts](https://docs.aws.amazon.com/codepipeline/latest/userguide/concepts.html) — reviewed **2026-11-01**
- [Service role](https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-custom-role.html) — reviewed **2026-11-01**

### Examples

- Working lesson setup
- Find and repair the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- This is a configuration/reasoning lesson, not a full service emulator or IAM policy evaluator.
- No provider connection, actual approval, execution queue, artifact encryption validation or deployment.

## AWS X-Ray — `xray`

**Category:** Developer Tools · **Status:** source-reviewed slice

### Implemented slice

Instrumentation and telemetry-path checks for one supplied request; no trace is collected.

### Settings

- Request instrumentation enabled
- Exporter can send telemetry
- This request is sampled
- Trace context propagated downstream
- Instrumentation choice
- Telemetry contains secrets

### DVA-C02 relevance

- [DVA-C02 troubleshooting: Practice troubleshooting concepts through this bounded service-specific lesson; not an exhaustive task mapping.](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain4.html)

### Official sources and review dates

- [Tracing overview](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) — reviewed **2026-11-01**
- [OpenTelemetry migration](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-migration.html) — reviewed **2026-11-01**

### Examples

- Working lesson setup
- Find and repair the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- This is a configuration/reasoning lesson, not a full service emulator or IAM policy evaluator.
- No real trace sampling probability, exporter runtime, latency calculation or complete telemetry policy evaluation.

## Amazon Q Developer — `q-developer`

**Category:** Developer Tools · **Status:** source-reviewed slice

### Implemented slice

A safe review workflow checklist, not an AI response generator or service availability check.

### Settings

- Assistance task
- Context may be shared under project policy
- Prompt includes secrets
- Developer reviews the proposal
- Relevant supplied tests pass
- Security/permissions reviewed

### DVA-C02 relevance

- [DVA-C02 development: Practice development concepts through this bounded service-specific lesson; not an exhaustive task mapping.](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [Q Developer capabilities](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/what-is.html) — reviewed **2026-11-01**
- [Security responsibilities](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/security.html) — reviewed **2026-11-01**

### Examples

- Working lesson setup
- Find and repair the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- This is a configuration/reasoning lesson, not a full service emulator or IAM policy evaluator.
- No model calls, generated code, billing, subscription inspection or claim that these checkboxes prove correct code.

## AWS AppConfig — `appconfig`

**Category:** Management and Governance · **Status:** source-reviewed slice

### Implemented slice

Direct data-plane polling after session start; the recommended Agent can handle this protocol for real applications.

### Settings

- Configuration session started
- Retrieval role permitted
- Use the most recent returned token
- Planned poll interval
- Server-required next interval
- Required decryption permitted
- Server has a newer configuration

### DVA-C02 relevance

- [DVA-C02 development: Practice development concepts through this bounded service-specific lesson; not an exhaustive task mapping.](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [AppConfig data plane](https://docs.aws.amazon.com/appconfig/latest/userguide/about-data-plane.html) — reviewed **2026-11-01**
- [AppConfig safety controls](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html) — reviewed **2026-11-01**

### Examples

- Working lesson setup
- Find and repair the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- This is a configuration/reasoning lesson, not a full service emulator or IAM policy evaluator.
- No actual Agent, config deployment, schema validator, targeting, rollback alarm or encrypted data.

## AWS Cloud Development Kit (AWS CDK) — `cdk`

**Category:** Management and Governance · **Status:** source-reviewed slice

### Implemented slice

A CDK synthesis/deployment-readiness plan, not execution of an app, bootstrap or CloudFormation.

### Settings

- Target account label
- Target Region
- Synthesis succeeds
- Stack publishes assets
- Target bootstrap supports this stack
- Generated changes reviewed
- Deployment permissions reviewed

### DVA-C02 relevance

- [DVA-C02 deployment: Practice deployment concepts through this bounded service-specific lesson; not an exhaustive task mapping.](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain3.html)

### Official sources and review dates

- [CDK synthesis architecture](https://docs.aws.amazon.com/cdk/v2/guide/home.html) — reviewed **2026-11-01**
- [Environment bootstrapping](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping-env.html) — reviewed **2026-11-01**

### Examples

- Working lesson setup
- Find and repair the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- This is a configuration/reasoning lesson, not a full service emulator or IAM policy evaluator.
- No code synthesis, bootstrap, IAM parser, asset upload or CloudFormation deployment; successful planning does not guarantee deployment.

## AWS CloudFormation — `cloudformation`

**Category:** Management and Governance · **Status:** source-reviewed slice

### Implemented slice

A supplied stack-update review scenario emphasizing replacement risk and runtime failure.

### Settings

- Template passes supplied checks
- Change set prepared
- Changes explicitly reviewed
- Proposal replaces a stateful resource
- Data-retention/backup plan reviewed
- Resource-specific runtime check passes
- Deployment role permitted

### DVA-C02 relevance

- [DVA-C02 deployment: Practice deployment concepts through this bounded service-specific lesson; not an exhaustive task mapping.](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain3.html)

### Official sources and review dates

- [Stack concepts](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html) — reviewed **2026-11-01**
- [Change-set review](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html) — reviewed **2026-11-01**

### Examples

- Working lesson setup
- Find and repair the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- This is a configuration/reasoning lesson, not a full service emulator or IAM policy evaluator.
- No template parser, resource provisioning, deletion-policy execution, drift detection or rollback engine.

## AWS CloudTrail — `cloudtrail`

**Category:** Management and Governance · **Status:** source-reviewed slice

### Implemented slice

Management-versus-data-event evidence planning; no account logs are queried.

### Settings

- Investigated event
- Matching S3 data events were selected
- Age of investigated event
- A suitable trail/store retained the event
- Investigator may read evidence
- Correct event Region investigated

### DVA-C02 relevance

- [DVA-C02 troubleshooting: Practice troubleshooting concepts through this bounded service-specific lesson; not an exhaustive task mapping.](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain4.html)

### Official sources and review dates

- [CloudTrail overview](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) — reviewed **2026-11-01**
- [Data-event selection](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html) — reviewed **2026-11-01**

### Examples

- Working lesson setup
- Find and repair the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- This is a configuration/reasoning lesson, not a full service emulator or IAM policy evaluator.
- No event search, delivery-delay calculation, event-selector parser or complete logging-coverage guarantee.

## Amazon CloudWatch — `cloudwatch`

**Category:** Management and Governance · **Status:** source-reviewed slice

### Implemented slice

A static three-sample threshold lesson; real CloudWatch missing-data and evaluation-window behavior is intentionally simplified.

### Settings

- Three metric samples
- Strict greater-than threshold
- Breaching periods required
- Metric is available
- Notification action configured
- Notification destination permitted

### DVA-C02 relevance

- [DVA-C02 troubleshooting: Practice troubleshooting concepts through this bounded service-specific lesson; not an exhaustive task mapping.](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain4.html)

### Official sources and review dates

- [Alarm semantics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Alarms.html) — reviewed **2026-11-01**
- [CloudWatch overview](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html) — reviewed **2026-11-01**

### Examples

- Working lesson setup
- Find and repair the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- This is a configuration/reasoning lesson, not a full service emulator or IAM policy evaluator.
- Only complete three-period samples and one initial state transition; no missing-data treatment, percentile metrics, repeated Auto Scaling actions or real notification.

## AWS Command Line Interface (AWS CLI) — `cli`

**Category:** Management and Governance · **Status:** source-reviewed slice

### Implemented slice

A CLI v2 command-planning exercise with supplied transient outcomes; no command or API is executed.

### Settings

- Intended profile label
- Resolved caller has permission
- Initial response scenario
- Maximum total attempts
- Transient failures before success
- Operation safe to repeat

### DVA-C02 relevance

- [DVA-C02 development: Practice development concepts through this bounded service-specific lesson; not an exhaustive task mapping.](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [CLI retry behavior](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-retries.html) — reviewed **2026-11-01**
- [CLI overview](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) — reviewed **2026-11-01**

### Examples

- Working lesson setup
- Find and repair the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- This is a configuration/reasoning lesson, not a full service emulator or IAM policy evaluator.
- No credential resolution, shell execution, exact backoff timings, service-specific retry classifier or real idempotency proof.

## AWS Systems Manager — `systems-manager`

**Category:** Management and Governance · **Status:** source-reviewed slice

### Implemented slice

Parameter Store retrieval/type/decryption reasoning, not the whole Systems Manager operations suite.

### Settings

- Parameter path
- Parameter type
- Parameter read permitted
- Request plaintext decryption
- Applicable KMS decrypt permission
- Needs automatic credential rotation

### DVA-C02 relevance

- [DVA-C02 security: Practice security concepts through this bounded service-specific lesson; not an exhaustive task mapping.](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain2.html)

### Official sources and review dates

- [Parameter Store types and tradeoffs](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) — reviewed **2026-11-01**
- [Systems Manager overview](https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html) — reviewed **2026-11-01**

### Examples

- Working lesson setup
- Find and repair the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- This is a configuration/reasoning lesson, not a full service emulator or IAM policy evaluator.
- No parameter values, real secrets, SSM Agent, Run Command, Session Manager, cache implementation or key-policy parsing.

## Amazon API Gateway — `api`

**Category:** Networking and Content Delivery · **Status:** source-reviewed slice

### Implemented slice

HTTP API only: exact GET/POST route selection, deployment/integration/invoke grant and Lambda versus HTTP deadline preview.

### Settings

- Per-connection method/path
- Current route deployed
- Lambda proxy integration
- Invocation resource policy
- Sample method/path

### DVA-C02 relevance

- [1.1.6: Develop and maintain APIs](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)
- [1.2.5: Integrate Lambda functions with AWS services](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [lambdaTimeout](https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html) — reviewed **2026-11-01**
- [lambdaRole](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html) — reviewed **2026-11-01**
- [dynamodb](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/iam-policy-specific-table-indexes.html) — reviewed **2026-11-01**
- [sqs](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-api-permissions-reference.html) — reviewed **2026-11-01**
- [stages](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-stages.html) — reviewed **2026-11-01**
- [routes](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html) — reviewed **2026-11-01**
- [integration](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html) — reviewed **2026-11-01**
- [permission](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html) — reviewed **2026-11-01**
- [limits](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-quotas.html) — reviewed **2026-11-01**

### Examples

- One route → one target
- No matching route
- Undeployed or unauthorized route
- HTTP integration deadline

### Checks

Exact/duplicate route selection, permission separation, redeployment invalidation, timeout boundary tests.

### Explicit gaps and assumptions

- Local teaching previews only: no code execution, AWS requests, deployment, or policy changes. A completed mock is not proof that real handler code succeeds.
- Ordinary Lambda Event Functions only: Lambda models timeout and declared mock duration, plus DynamoDB PutItem / SQS SendMessage execution-role assertions on outgoing edges. It does not model memory, concurrency, retries, startup, networking, encryption, or full IAM evaluation.
- Timeout equality is treated conservatively as timeout in this deterministic teaching model, not a guarantee about real scheduling. No timeout proves the absence or rollback of earlier side effects.
- The deployed switch describes the current route configuration. Earlier deployment snapshots and auto-deployment are not modeled; an undeployed edit does not prove a real existing endpoint stopped serving.
- HTTP API models GET/POST exact literal paths, payload format 2.0, auth NONE, and the $default stage. This intentionally unauthenticated example is not a production security recommendation.
- Path parameters, greedy variables, wildcards, $default routes, query strings, URL encoding, request bodies, CORS, authorizers, response mapping, and custom domains are outside this preview.
- One sample HTTP request selects at most one exact route and one Lambda target. Whole-graph dependency walkthroughs are separate and do not represent HTTP fan-out.
- The preview assumes the HTTP API maximum integration timeout of 30 seconds; a configured lower timeout is not modeled. An HTTP timeout does not imply Lambda was cancelled. Incoming API invocation permission is a Lambda resource policy, separate from its execution role.

## Amazon CloudFront — `cloudfront`

**Category:** Networking and Content Delivery · **Status:** source-reviewed slice

### Implemented slice

Two requests differ by a query value. Predict cache reuse without confusing forwarding with cache-key variation.

### Settings

- First request language
- Second request language
- Include language in cache key
- Cached object lifetime
- Time between requests
- Origin access authorized

### DVA-C02 relevance

- [1.3: Use data stores and caching in application development](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [CloudFront cache key](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html) — reviewed **2026-11-01**
- [Origin versus cache policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html) — reviewed **2026-11-01**

### Examples

- Working baseline
- Broken scenario

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- Local deterministic teaching checks only: no AWS APIs, deployment, credentials, network traffic or real security validation. Other AWS settings and service quotas are intentionally omitted.
- Effective TTL is provided directly; Cache-Control, minimum TTL overrides, eviction, stale serving, invalidation, authorization and signed URLs are not modeled.

## Elastic Load Balancing — `elb`

**Category:** Networking and Content Delivery · **Status:** source-reviewed slice

### Implemented slice

Evaluate two target health statuses and one configured health-check path; not a load-balancer implementation.

### Settings

- Health-check path
- Application readiness path
- Target A otherwise healthy
- Target B otherwise healthy
- Health-check network path allowed
- Listener protocol

### DVA-C02 relevance

- [1.1: Develop code for applications hosted on AWS](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [ALB target health checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html) — reviewed **2026-11-01**
- [ALB concepts](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html) — reviewed **2026-11-01**

### Examples

- Working baseline
- Broken scenario

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- Local deterministic teaching checks only: no AWS APIs, deployment, credentials, network traffic or real security validation. Other AWS settings and service quotas are intentionally omitted.
- Assumes steady-state health after thresholds; no timing, listener routing rules, TLS verification, NLB or Gateway Load Balancer behavior.

## Amazon Route 53 — `route53`

**Category:** Networking and Content Delivery · **Status:** source-reviewed slice

### Implemented slice

Compute relative weights for two healthy records and show why DNS caching delays a change.

### Settings

- Record A weight
- Record B weight
- Cached answer TTL
- Seconds since cached answer
- Identity can change records
- Both endpoints healthy

### DVA-C02 relevance

- [1.1: Develop code for applications hosted on AWS](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [Weighted DNS routing](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-weighted.html) — reviewed **2026-11-01**

### Examples

- Working baseline
- Broken scenario

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- Local deterministic teaching checks only: no AWS APIs, deployment, credentials, network traffic or real security validation. Other AWS settings and service quotas are intentionally omitted.
- No authoritative DNS calls, random sampling, alias rules, health-check fallback or real resolver cache. The two records are assumed to share name/type.

## Amazon VPC — `vpc`

**Category:** Networking and Content Delivery · **Status:** source-reviewed slice

### Implemented slice

A private IPv4 application reaches S3 or an external HTTPS API through an explicitly selected route.

### Settings

- Dependency
- Selected route
- Security group permits HTTPS
- Network ACL permits request and return
- DNS resolution works
- Application API authorization granted

### DVA-C02 relevance

- [1.1: Develop code for applications hosted on AWS](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)
- [2.1: Implement application authentication and authorization](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain2.html)

### Official sources and review dates

- [VPC route examples](https://docs.aws.amazon.com/vpc/latest/userguide/route-table-options.html) — reviewed **2026-11-01**
- [VPC security controls](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html) — reviewed **2026-11-01**

### Examples

- Working baseline
- Broken scenario

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- Local deterministic teaching checks only: no AWS APIs, deployment, credentials, network traffic or real security validation. Other AWS settings and service quotas are intentionally omitted.
- No actual IP packets, longest-prefix routing table, NAT capacity, IPv6, endpoint policy or complete IAM evaluation. External API authentication is outside this slice.

## Amazon Cognito — `cognito`

**Category:** Security, Identity, and Compliance · **Status:** source-reviewed slice

### Implemented slice

Validate a synthetic token description, not a real JWT. Focus on issuer, token use, expiration, signature and authorization.

### Settings

- Expected issuer
- Token issuer
- Token use
- Remaining lifetime
- Signature verification succeeded
- Required API scope present
- Resource owner matches caller

### DVA-C02 relevance

- [2.1: Implement application authentication and authorization](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain2.html)

### Official sources and review dates

- [Cognito JWT verification](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html) — reviewed **2026-11-01**

### Examples

- Working baseline
- Broken scenario

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- Local deterministic teaching checks only: no AWS APIs, deployment, credentials, network traffic or real security validation. Other AWS settings and service quotas are intentionally omitted.
- No JWT parsing/signing, JWKS, audience/client-id validation, refresh flow, identity pool or real user authentication. Those remain required in production.

## AWS Identity and Access Management (IAM) — `iam`

**Category:** Security, Identity, and Compliance · **Status:** source-reviewed slice

### Implemented slice

One same-account identity policy, one action/resource match, optional boundary and explicit deny; not the full AWS evaluator.

### Settings

- Requested action
- Identity-policy action
- Requested table
- Allowed table
- Permissions boundary allows request
- Applicable explicit deny

### DVA-C02 relevance

- [2.1: Implement application authentication and authorization](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain2.html)

### Official sources and review dates

- [IAM policy evaluation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html) — reviewed **2026-11-01**

### Examples

- Working baseline
- Broken scenario

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- Local deterministic teaching checks only: no AWS APIs, deployment, credentials, network traffic or real security validation. Other AWS settings and service quotas are intentionally omitted.
- Excludes resource-based policies, role-session grants, conditions, SCP/RCP, cross-account requests and service-specific authorization. Not a production policy simulator.

## AWS Key Management Service (AWS KMS) — `kms`

**Category:** Security, Identity, and Compliance · **Status:** source-reviewed slice

### Implemented slice

A same-account symmetric key uses the key-policy-enables-IAM path; evaluate decrypt permission and matching context.

### Settings

- Key state
- Key policy enables IAM authorization
- Caller IAM permits Decrypt
- Applicable explicit deny
- Stored encryption context
- Decrypt encryption context

### DVA-C02 relevance

- [2.2: Implement encryption using AWS services](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain2.html)

### Official sources and review dates

- [KMS key policies](https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html) — reviewed **2026-11-01**
- [Encryption context](https://docs.aws.amazon.com/kms/latest/developerguide/encrypt_context.html) — reviewed **2026-11-01**

### Examples

- Working baseline
- Broken scenario

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- Local deterministic teaching checks only: no AWS APIs, deployment, credentials, network traffic or real security validation. Other AWS settings and service quotas are intentionally omitted.
- No cryptography, ciphertext validation, grants, cross-account/multi-Region keys, asymmetric keys or complete key lifecycle. Context is not a secret.

## AWS Secrets Manager — `secrets-manager`

**Category:** Security, Identity, and Compliance · **Status:** source-reviewed slice

### Implemented slice

A database password rotates; compare stored, database and cached versions without entering actual secrets.

### Settings

- Current stored version label
- Version accepted by database
- Application cached version
- Cache age
- Application cache TTL
- Secret retrieval and key access granted
- Database network path available

### DVA-C02 relevance

- [2.3: Manage sensitive data in application code](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain2.html)

### Official sources and review dates

- [Secrets rotation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html) — reviewed **2026-11-01**
- [Caching and access best practices](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html) — reviewed **2026-11-01**

### Examples

- Working baseline
- Broken scenario

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- Local deterministic teaching checks only: no AWS APIs, deployment, credentials, network traffic or real security validation. Other AWS settings and service quotas are intentionally omitted.
- Not a rotation Lambda or connection pool. No actual secrets, staging-label transitions, concurrency, automatic retry-on-auth-failure or managed-service rotation protocol.

## AWS Security Token Service (AWS STS) — `sts`

**Category:** Security, Identity, and Compliance · **Status:** source-reviewed slice

### Implemented slice

Cross-account AssumeRole with caller/trust gates, role/session permissions and time-limited credentials.

### Settings

- Caller may AssumeRole
- Target trust accepts caller
- Requested session duration
- Role maximum duration
- Elapsed since issuance
- Role permits downstream action
- Session policy permits action

### DVA-C02 relevance

- [2.1: Implement application authentication and authorization](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain2.html)

### Official sources and review dates

- [AssumeRole API](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html) — reviewed **2026-11-01**

### Examples

- Working baseline
- Broken scenario

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- Local deterministic teaching checks only: no AWS APIs, deployment, credentials, network traffic or real security validation. Other AWS settings and service quotas are intentionally omitted.
- No credential generation, federation, MFA/external-ID conditions, role chaining, resource policies or endpoint routing. API duration requirements beyond this slice need official reference.

## AWS WAF — `waf`

**Category:** Security, Identity, and Compliance · **Status:** source-reviewed slice

### Implemented slice

Two matching-rule candidates evaluate a synthetic request; show Count continuing and Allow/Block terminating.

### Settings

- First rule action
- First rule matches request
- Second rule action
- Second rule matches request
- Web ACL default
- Web ACL associated with supported resource
- Request logs enabled

### DVA-C02 relevance

- [2.1: Implement application authentication and authorization](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain2.html)
- [1.1: Develop code for applications hosted on AWS](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [WAF actions and priority](https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-rule-actions.html) — reviewed **2026-11-01**
- [WAF logging](https://docs.aws.amazon.com/waf/latest/developerguide/logging.html) — reviewed **2026-11-01**

### Examples

- Working baseline
- Broken scenario

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- Local deterministic teaching checks only: no AWS APIs, deployment, credentials, network traffic or real security validation. Other AWS settings and service quotas are intentionally omitted.
- No payload inspection, rate aggregation, rule groups, labels, CAPTCHA/Challenge, actual attacks or resource association calls. A Block result is expected protection, not itself a configuration error.

## Amazon Elastic Block Store (Amazon EBS) — `ebs`

**Category:** Storage · **Status:** source-reviewed slice

### Implemented slice

One ordinary single-attach Linux EBS data volume, existing filesystem assumed.

### Settings

- Volume AZ
- Instance AZ
- Volume available
- AttachVolume authorized
- Filesystem mounted
- OS write permission

### DVA-C02 relevance

- [1.3.6: Use, manage, and maintain data stores](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [AWS official documentation](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-attaching-volume.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-using-volumes.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/ebs/latest/userguide/security_iam_id-based-policy-examples.html) — reviewed **2026-11-01**

### Examples

- Working configuration
- Find the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- No formatting commands, encryption/KMS, snapshots, Multi-Attach, IOPS or actual disks. Existing filesystem and compatible instance/device assumed.
- Independent local lesson; settings do not change canvas edge permissions or create AWS resources.
- Declared permissions represent a narrowly scoped allow with no overriding denies; not a complete IAM, network or service emulator.
- Coverage: this reviewed vertical slice only. Other APIs, quotas, regional/version differences, billing and production operations remain unmodeled.

## Amazon Elastic File System (Amazon EFS) — `efs`

**Category:** Storage · **Status:** source-reviewed slice

### Implemented slice

One non-root NFS client using EFS mount helper IAM authorization.

### Settings

- NFS reachable
- IAM mount helper enabled
- TLS mount enabled
- ClientMount allowed
- ClientWrite allowed
- POSIX user may write

### DVA-C02 relevance

- [1.3.6: Use, manage, and maintain data stores](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [AWS official documentation](https://docs.aws.amazon.com/efs/latest/ug/iam-access-control-nfs-efs.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/efs/latest/ug/mounting-IAM-option.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/efs/latest/ug/network-access.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/efs/latest/ug/accessing-fs-nfs-permissions.html) — reviewed **2026-11-01**

### Examples

- Working configuration
- Find the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- Non-IAM anonymous mounts can exist in AWS but are outside this secure lesson. No root squashing, access-point identity overrides, throughput or full policy evaluation.
- Independent local lesson; settings do not change canvas edge permissions or create AWS resources.
- Declared permissions represent a narrowly scoped allow with no overriding denies; not a complete IAM, network or service emulator.
- Coverage: this reviewed vertical slice only. Other APIs, quotas, regional/version differences, billing and production operations remain unmodeled.

## Amazon S3 — `s3`

**Category:** Storage · **Status:** source-reviewed slice

### Implemented slice

One existing object in a general-purpose bucket: simple delete then read current or previous version.

### Settings

- Versioning enabled
- s3:DeleteObject allowed
- Read selection
- Read permission granted
- Issue simple delete
- TLS request

### DVA-C02 relevance

- [1.3.7: Manage data lifecycles](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)
- [1.3.6: Manage data stores](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html)

### Official sources and review dates

- [AWS official documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeleteMarker.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeletingObjectVersions.html) — reviewed **2026-11-01**
- [AWS official documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-with-s3-policy-actions.html) — reviewed **2026-11-01**

### Examples

- Working configuration
- Find the failure

### Checks

Per-model happy/broken/boundary cases and shared field/persistence guards; local preview only.

### Explicit gaps and assumptions

- No suspended versioning, Object Lock, lifecycle expiry, encryption/KMS or data mutation. Fixed initial object and policy assumptions; no claim versioning is a complete backup.
- Independent local lesson; settings do not change canvas edge permissions or create AWS resources.
- Declared permissions represent a narrowly scoped allow with no overriding denies; not a complete IAM, network or service emulator.
- Coverage: this reviewed vertical slice only. Other APIs, quotas, regional/version differences, billing and production operations remain unmodeled.
