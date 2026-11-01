# Configuration coverage matrix

Generated from the registry with node scripts/configuration-coverage.mjs. Snapshot: 2026-11-02.

56 current C03 services plus 2 legacy IDs; 925 top-level fields, 1405 fields including table columns. 191 distinct field/quota source URLs. 72 mapped skills and 72 original knowledge checks.

This is a bounded learning model, not the entire AWS Console, an AWS validator, or a guarantee of exam readiness. A field is not evidence of implemented application code. Skill associations and theory links indicate study routes, not complete competency. Unset values remain unknown; displayed defaults are not silently applied. Generic schema exercises are labeled separately from domain-specific valid/invalid scenarios.

## Service forms

| Service | Root / all fields | Sections | Input types | Domain cases | Sources |
|---|---:|---|---|---|---:|
| Amazon Athena (athena) | 16 / 16 | configuration, permissions, reliability, monitoring | text, select, resource, boolean, number | Schema exercise only | 1 |
| Amazon Kinesis (kinesis) | 15 / 15 | configuration, reliability, permissions, monitoring | select, number, text, boolean, resource, multi-select | Schema exercise only | 1 |
| Amazon OpenSearch Service (opensearch) | 15 / 19 | configuration, networking, permissions, reliability, monitoring | select, text, resource, boolean, json, table, number, multi-select | Schema exercise only | 1 |
| AWS AppSync (appsync) | 8 / 12 | configuration, permissions, reliability, monitoring | select, multi-select, text, table, resource, boolean | Schema exercise only | 1 |
| Amazon EventBridge (eventbridge) | 13 / 32 | configuration, permissions, reliability, monitoring | select, text, json, table, boolean, resource, number | Schema exercise only | 6 |
| Amazon Simple Notification Service (Amazon SNS) (sns) | 14 / 22 | configuration, permissions, reliability, monitoring | select, text, table, resource, boolean, json, number | Schema exercise only | 7 |
| Amazon Simple Queue Service (Amazon SQS) (sqs) | 26 / 29 | configuration, reliability, permissions, monitoring | select, text, number, resource, json, boolean, table | sqs-fifo | 14 |
| AWS Step Functions (step-functions) | 18 / 38 | configuration, permissions, reliability, monitoring, deployment | select, json, resource, table, text, number, boolean | Schema exercise only | 12 |
| Amazon EC2 (ec2) | 26 / 39 | configuration, deployment, permissions, networking, reliability, monitoring | text, select, resource, number, boolean, table, key-value | Schema exercise only | 4 |
| AWS Elastic Beanstalk (elastic-beanstalk) | 22 / 32 | configuration, deployment, permissions, networking, monitoring, reliability | select, text, number, key-value, table, resource, yaml, boolean | Schema exercise only | 2 |
| AWS Lambda (lambda) | 34 / 57 | deployment, configuration, permissions, reliability, networking, monitoring | select, text, number, key-value, resource, json, table, boolean | lambda-timeout, lambda-package | 22 |
| Amazon Elastic Container Registry (Amazon ECR) (ecr) | 13 / 14 | configuration, deployment, permissions | text, select, table, boolean, resource, json | Schema exercise only | 3 |
| Amazon Elastic Container Service (Amazon ECS) (ecs) | 29 / 52 | configuration, networking, permissions, reliability, deployment | text, select, number, resource, table, boolean, key-value, json | fargate-network | 3 |
| Amazon Elastic Kubernetes Service (Amazon EKS) (eks) | 23 / 33 | configuration, deployment, reliability, permissions, networking, monitoring | text, select, number, key-value, table, resource, boolean, yaml | Schema exercise only | 1 |
| Amazon Aurora (aurora) | 27 / 34 | configuration, reliability, permissions, networking, monitoring | select, number, resource, boolean, text, table, multi-select | Schema exercise only | 1 |
| Amazon DynamoDB (dynamodb) | 27 / 43 | configuration, reliability, permissions, monitoring | text, table, select, number, boolean, json, resource | ddb-gsi, ddb-index-read | 10 |
| Amazon ElastiCache (elasticache) | 22 / 29 | configuration, reliability, permissions, networking, monitoring | select, number, text, boolean, resource, table | Schema exercise only | 2 |
| Amazon RDS (rds) | 24 / 34 | configuration, reliability, permissions, networking, monitoring | select, text, table, boolean, resource, number, multi-select | Schema exercise only | 4 |
| AWS Amplify (amplify) | 13 / 19 | configuration, deployment, networking, permissions, monitoring | text, select, yaml, table, boolean, resource | Schema exercise only | 1 |
| AWS CloudShell (cloudshell) | 12 / 13 | configuration, permissions, networking, reliability, deployment | select, text, resource, table, boolean | cloudshell-vpc | 2 |
| AWS CodeArtifact (codeartifact) | 12 / 13 | configuration, permissions, deployment | select, text, table, number, resource, json | artifact-token | 1 |
| AWS CodeBuild (codebuild) | 17 / 23 | deployment, configuration, reliability, permissions, networking, monitoring | select, text, yaml, boolean, table, resource, number | Schema exercise only | 2 |
| AWS CodeDeploy (codedeploy) | 16 / 21 | deployment, permissions, monitoring, reliability, networking | select, yaml, json, text, table, number, resource, boolean | Schema exercise only | 1 |
| AWS CodePipeline (codepipeline) | 13 / 23 | deployment, permissions, configuration, reliability, monitoring | select, table, text, number, resource, boolean, key-value | Schema exercise only | 1 |
| AWS X-Ray (xray) | 10 / 16 | monitoring, permissions, networking | select, boolean, table, text, number, key-value, json, resource | Schema exercise only | 1 |
| Amazon Q Developer (q-developer) | 7 / 7 | configuration, permissions, deployment, monitoring | select, multi-select, boolean | Schema exercise only | 1 |
| AWS AppConfig (appconfig) | 15 / 17 | configuration, deployment, reliability, permissions | text, select, json, resource, number, table | Schema exercise only | 1 |
| AWS Cloud Development Kit (AWS CDK) (cdk) | 12 / 12 | configuration, deployment, permissions, reliability | select, text, json, boolean, resource | Schema exercise only | 1 |
| AWS CloudFormation (cloudformation) | 14 / 17 | deployment, permissions, reliability, monitoring | yaml, json, key-value, text, resource, multi-select, boolean, table, select | Schema exercise only | 1 |
| AWS CloudTrail (cloudtrail) | 12 / 15 | monitoring, permissions, reliability | select, boolean, table, text, resource, number | Schema exercise only | 1 |
| Amazon CloudWatch (cloudwatch) | 18 / 23 | monitoring | select, text, table, number, resource, json, boolean | cw-m-of-n | 1 |
| AWS Command Line Interface (AWS CLI) (cli) | 15 / 15 | permissions, configuration, reliability, networking | select, text, boolean, number | Schema exercise only | 1 |
| AWS Systems Manager (systems-manager) | 14 / 14 | configuration, permissions, deployment, reliability, monitoring | select, text, resource, boolean, json, number, yaml | Schema exercise only | 1 |
| Amazon API Gateway (api) | 30 / 65 | configuration, networking, permissions, deployment, reliability, monitoring | select, table, text, resource, boolean, number, json, key-value | api-jwt, api-cors | 17 |
| Amazon CloudFront (cloudfront) | 14 / 36 | configuration, permissions, reliability, deployment, monitoring | table, text, select, resource, number, multi-select, boolean, json | cdn-ttl | 2 |
| Elastic Load Balancing (elb) | 12 / 41 | configuration, networking, reliability, monitoring | select, resource, table, text, number, boolean | alb-protocol | 1 |
| Amazon Route 53 (route53) | 6 / 25 | configuration, networking, monitoring, deployment | select, text, resource, table, boolean, number | Schema exercise only | 2 |
| Amazon VPC (vpc) | 9 / 30 | networking, monitoring | text, boolean, table, select, number, resource | Schema exercise only | 1 |
| Amazon Cognito (cognito) | 19 / 37 | configuration, permissions, reliability, monitoring | select, multi-select, json, table, text, boolean, number, key-value, resource | cognito-pools | 4 |
| AWS Identity and Access Management (IAM) (iam) | 16 / 21 | configuration, permissions, monitoring | select, text, json, multi-select, table, number, boolean, key-value | Schema exercise only | 3 |
| AWS Key Management Service (AWS KMS) (kms) | 16 / 19 | configuration, permissions, reliability, networking, monitoring | select, text, json, table, multi-select, key-value, boolean, number, resource | kms-usage | 3 |
| AWS Secrets Manager (secrets-manager) | 16 / 18 | configuration, permissions, reliability, networking, monitoring | select, text, resource, json, number, boolean, table | Schema exercise only | 3 |
| AWS Security Token Service (AWS STS) (sts) | 15 / 17 | configuration, permissions, networking, reliability, monitoring | select, resource, text, number, key-value, table, json, boolean | Schema exercise only | 1 |
| AWS WAF (waf) | 12 / 22 | configuration, reliability, deployment, monitoring | select, resource, table, text, number, json, key-value, boolean | Schema exercise only | 2 |
| Amazon Elastic Block Store (Amazon EBS) (ebs) | 14 / 14 | configuration, permissions, networking, reliability, deployment, monitoring | select, number, boolean, resource, text | Schema exercise only | 1 |
| Amazon Elastic File System (Amazon EFS) (efs) | 14 / 30 | configuration, permissions, networking, reliability | select, number, boolean, resource, table, text, json | Schema exercise only | 2 |
| Amazon S3 (s3) | 28 / 55 | configuration, permissions, reliability, networking, monitoring | text, select, boolean, json, resource, table, key-value, number | s3-ownership, s3-lock | 20 |
| Amazon Data Firehose (firehose) | 15 / 15 | configuration, reliability, monitoring, permissions, networking | select, resource, number, text, boolean | Schema exercise only | 1 |
| Amazon Bedrock (bedrock) | 16 / 18 | configuration, permissions, reliability, networking, monitoring | select, text, resource, json, table, number, boolean | Schema exercise only | 1 |
| Amazon Bedrock AgentCore (agentcore) | 11 / 18 | configuration, permissions, reliability, networking, monitoring | text, select, resource, table, boolean, number | Schema exercise only | 1 |
| Amazon Quick (quick) | 10 / 13 | configuration, permissions, monitoring | text, select, boolean, table | Schema exercise only | 1 |
| Kiro (kiro) | 10 / 17 | configuration, permissions, deployment, monitoring | select, table, text, boolean, key-value, multi-select | Schema exercise only | 1 |
| Amazon CloudWatch Logs (cloudwatch-logs) | 12 / 21 | monitoring, reliability, permissions | text, select, number, resource, json, table, boolean | logs-class | 2 |
| AWS SAM (sam) | 14 / 18 | deployment, permissions, monitoring | yaml, select, table, text, boolean, json, multi-select, resource | Schema exercise only | 1 |
| AWS PrivateLink (privatelink) | 11 / 20 | networking, permissions, configuration, monitoring | select, text, resource, table, boolean, number, json | Schema exercise only | 1 |
| AWS Certificate Manager (ACM) (acm) | 11 / 15 | configuration, permissions, reliability, monitoring | select, table, text, resource, boolean | Schema exercise only | 2 |
| AWS Private CA (private-ca) | 12 / 12 | configuration, permissions, reliability, monitoring | select, text, json, number, resource, boolean | Schema exercise only | 1 |
| Amazon S3 Glacier (glacier) | 10 / 10 | configuration, reliability, permissions, monitoring | resource, select, text, number | Schema exercise only | 3 |

## Skill traceability

Exact skill annotations are listed separately from task-level context annotations. These counts are metadata associations, not a measure of depth. All skills have a sourced original multiple-choice scenario; code skills also have a snippet. Domain cases run bounded configuration checks. Theory links open existing learning sections.

| Skill | Study objective | Mode | Exact annotated fields | Task context fields | Domain cases | Knowledge check / code | Theory routes |
|---|---|---|---:|---:|---|---|---|
| 1.1.1 | Decouple application components | mixed | 0 | 321 | — | Yes | dev-application#dev-application-s1 |
| 1.1.2 | Choose request or event processing | mixed | 54 | 321 | — | Yes | dev-application#dev-application-s1, dev-lambda#dev-lambda-s3 |
| 1.1.3 | Build resilient application behavior | mixed | 61 | 321 | — | Yes | dev-application#dev-application-s4 |
| 1.1.4 | Maintain API request and response contracts | mixed | 63 | 321 | api-cors, alb-protocol | Yes | dev-application#dev-application-s2, dev-application#dev-application-s3 |
| 1.1.5 | Call service APIs through SDKs | mixed | 1 | 321 | — | Yes | dev-application#dev-application-s4 |
| 1.1.6 | Process streaming application records | mixed | 0 | 321 | — | Yes | dev-events#dev-events-s5 |
| 1.1.7 | Serialize service-boundary payloads | code | 3 | 321 | — | Yes / snippet | dev-data-safety#dev-data-safety-s3 |
| 1.1.8 | Implement event-driven service interactions | mixed | 102 | 321 | sqs-fifo | Yes | dev-events#dev-events-s3, dev-objects#dev-objects-s6 |
| 1.1.9 | Review AI-assisted development artifacts | mixed | 24 | 321 | — | Yes | dev-ai-integration#dev-ai-integration-s6 |
| 1.1.10 | Integrate approved managed AI capabilities | mixed | 49 | 321 | — | Yes | dev-ai-integration#dev-ai-integration-s2, dev-ai-integration#dev-ai-integration-s3, dev-ai-integration#dev-ai-integration-s4, dev-ai-integration#dev-ai-integration-s5 |
| 1.2.1 | Connect functions to private resources | configuration | 2 | 0 | — | Yes | dev-lambda#dev-lambda-s5 |
| 1.2.2 | Set function runtime and resource configuration | configuration | 34 | 0 | lambda-timeout | Yes | dev-lambda#dev-lambda-s1, dev-lambda#dev-lambda-s2, dev-lambda#dev-lambda-s4 |
| 1.2.3 | Handle function invocation failures | mixed | 7 | 0 | — | Yes | dev-lambda#dev-lambda-s3, dev-lambda#dev-lambda-s4 |
| 1.2.4 | Connect function code, triggers and destinations | mixed | 3 | 0 | — | Yes | dev-events#dev-events-s2, dev-lambda#dev-lambda-s5 |
| 1.3.1 | Manage application-data retention | mixed | 56 | 212 | s3-lock | Yes | dev-objects#dev-objects-s4, dev-data-safety#dev-data-safety-s3 |
| 1.3.2 | Match data stores to application access | concept | 7 | 212 | — | Yes | dev-data-safety#dev-data-safety-s4 |
| 1.3.3 | Choose an appropriate application cache | mixed | 1 | 212 | — | Yes | dev-data-safety#dev-data-safety-s6 |
| 1.3.4 | Configure DynamoDB application access | mixed | 35 | 212 | ddb-gsi, ddb-index-read | Yes | dev-dynamodb#dev-dynamodb-s1, dev-dynamodb#dev-dynamodb-s2, dev-dynamodb#dev-dynamodb-s3, dev-dynamodb#dev-dynamodb-s4 |
| 2.1.1 | Use federated application identities | mixed | 57 | 485 | cognito-pools | Yes | security-cognito#choice, security-cognito#federation |
| 2.1.2 | Apply caller access controls | mixed | 96 | 485 | api-jwt, api-cors | Yes | security-cognito#federation, security-cognito#verification, security-cognito#scopes |
| 2.1.3 | Configure development-time AWS credentials | mixed | 17 | 485 | artifact-token | Yes | security-iam-sts#principal |
| 2.1.4 | Delegate short-lived signed access | mixed | 1 | 485 | — | Yes | security-iam-sts#signed-access, dev-objects#dev-objects-s2 |
| 2.1.5 | Authenticate application service requests | mixed | 69 | 485 | — | Yes | security-iam-sts#principal |
| 2.1.6 | Define principal and resource permissions | mixed | 81 | 485 | s3-ownership | Yes | security-iam-sts#policies, security-iam-sts#conditions |
| 2.1.7 | Assume scoped temporary roles | mixed | 39 | 485 | — | Yes | security-iam-sts#assume |
| 2.2.1 | Protect stored and transmitted application data | configuration | 101 | 267 | — | Yes | security-sensitive-data#storage, security-kms#layers |
| 2.2.2 | Use managed application certificates | mixed | 28 | 267 | — | Yes | security-sensitive-data#certificates |
| 2.2.3 | Choose encryption placement | mixed | 20 | 267 | — | Yes | security-sensitive-data#storage |
| 2.2.4 | Use keys for application cryptography | mixed | 27 | 267 | kms-usage | Yes | security-kms#envelope, security-kms#authorization |
| 2.2.5 | Create development certificates and key pairs | mixed | 27 | 267 | — | Yes | security-sensitive-data#certificates |
| 2.2.6 | Minimize exposure of sensitive content | mixed | 20 | 267 | — | Yes | security-sensitive-data#classification, security-sensitive-data#masking, security-sensitive-data#tenants |
| 2.2.7 | Retrieve sensitive configuration safely | mixed | 18 | 267 | — | Yes | security-sensitive-data#secrets |
| 2.3.1 | Authorize access to managed AI | mixed | 49 | 20 | — | Yes | security-ai-controls#access |
| 2.3.2 | Apply AI data-transfer privacy controls | mixed | 38 | 20 | — | Yes | security-ai-controls#privacy |
| 2.3.3 | Apply existing AI input and output controls | mixed | 35 | 20 | — | Yes | security-ai-controls#filter |
| 2.3.4 | Constrain agent sessions and tool actions | mixed | 42 | 20 | — | Yes | security-ai-controls#agent |
| 2.3.5 | Protect AI-related operational telemetry | mixed | 49 | 20 | — | Yes | security-ai-controls#monitor |
| 3.1.1 | Package code dependencies and configuration | mixed | 0 | 354 | artifact-token, cloudshell-vpc | Yes | release-artifacts#zip-image |
| 3.1.2 | Build and retain deployment images | mixed | 0 | 354 | — | Yes | release-artifacts#container-artifact |
| 3.1.3 | Connect source revisions to deployment | mixed | 0 | 354 | — | Yes | build-pipelines#chain |
| 3.1.4 | Manage configuration across environments | configuration | 18 | 354 | — | Yes | release-environments#config-selection |
| 3.1.5 | Use API deployment stages and endpoints | configuration | 52 | 354 | api-jwt | Yes | release-environments#stages |
| 3.2.1 | Develop and validate application tests | mixed | 0 | 112 | — | Yes | layered-testing#unit-example, layered-testing#deployed-tests |
| 3.2.2 | Mock external service boundaries | mixed | 1 | 112 | — | Yes | layered-testing#ai-workflow, layered-testing#unit-example |
| 3.2.3 | Construct representative event fixtures | code | 2 | 112 | — | Yes / snippet | layered-testing#fixtures |
| 3.2.4 | Configure versioned test environments | configuration | 2 | 112 | — | Yes | release-environments#aliases, release-environments#identity |
| 3.2.5 | Validate AI-assisted testing workflows | mixed | 24 | 112 | — | Yes | layered-testing#ai-workflow |
| 3.3.1 | Package Lambda releases efficiently | mixed | 2 | 283 | lambda-package | Yes | release-artifacts#zip-image, release-artifacts#resources |
| 3.3.2 | Roll out containerized applications | mixed | 0 | 283 | fargate-network | Yes | progressive-release#containers-c03 |
| 3.3.3 | Deploy reviewed application templates | mixed | 0 | 283 | — | Yes | release-artifacts#sam-build, release-artifacts#iac-review |
| 3.3.4 | Deploy platform-specific revisions | configuration | 0 | 283 | — | Yes | progressive-release#platforms |
| 3.3.5 | Orchestrate approved delivery stages | configuration | 0 | 283 | — | Yes | build-pipelines#ordering |
| 3.3.6 | Choose controlled release strategies | mixed | 2 | 283 | — | Yes | progressive-release#strategy-contract, progressive-release#platforms |
| 3.3.7 | Configure and execute release rollback | mixed | 0 | 283 | — | Yes | progressive-release#rollback |
| 3.3.8 | Track source versions through a release | mixed | 0 | 283 | — | Yes | release-environments#aliases |
| 3.3.9 | Review AI-supported delivery decisions | mixed | 0 | 283 | — | Yes | build-pipelines#ai-ci |
| 4.1.1 | Locate code and integration defects | mixed | 0 | 402 | — | Yes | release-artifacts#artifact-exercise, observe-debug#query |
| 4.1.2 | Interpret operational evidence | mixed | 6 | 402 | — | Yes | observe-debug#trace |
| 4.1.3 | Query logs to test a hypothesis | code | 0 | 402 | logs-class | Yes / snippet | observe-debug#query |
| 4.1.4 | Diagnose deployment failures from logs | mixed | 0 | 402 | — | Yes | build-pipelines#failure-evidence |
| 4.1.5 | Check AI-generated troubleshooting advice | mixed | 0 | 402 | — | Yes | observe-debug#current-ai |
| 4.2.1 | Emit useful and safe structured logs | mixed | 31 | 306 | logs-class | Yes | observe-debug#structured |
| 4.2.2 | Emit application-specific metrics | code | 0 | 306 | — | Yes / snippet | measure-optimize#emf-example |
| 4.2.3 | Configure actionable operational alerts | configuration | 5 | 306 | cw-m-of-n | Yes | measure-optimize#alarm |
| 4.2.4 | Instrument distributed request traces | mixed | 3 | 306 | — | Yes | observe-debug#trace |
| 4.2.5 | Monitor application readiness and health | mixed | 1 | 306 | — | Yes | observe-debug#deploy-health |
| 4.3.1 | Apply workload concurrency controls | mixed | 5 | 439 | — | Yes | measure-optimize#concurrency-profile |
| 4.3.2 | Tune compute resources using evidence | mixed | 2 | 439 | — | Yes | release-artifacts#resources, measure-optimize#concurrency-profile |
| 4.3.3 | Improve messaging efficiency without losing correctness | mixed | 41 | 439 | sqs-fifo | Yes | measure-optimize#messaging-ai |
| 4.3.4 | Apply service-aware caching | mixed | 3 | 439 | cdn-ttl | Yes | measure-optimize#cache |
| 4.3.5 | Find the measured performance bottleneck | mixed | 2 | 439 | — | Yes | observe-debug#trace, observe-debug#query, measure-optimize#log-bottlenecks |
| 4.3.6 | Validate AI-suggested optimizations | mixed | 0 | 439 | — | Yes | measure-optimize#messaging-ai |

## Boundaries and evidence

- Source details and dated limits are available beside fields. The four CONFIG-AUDIT documents record service-specific decisions and unmodeled details. Reachability checks do not prove every AWS feature has been exercised.
- IAM evaluation supports a documented subset only. Unsupported conditions, cross-account authorization, KMS full authorization and incomplete context return not-evaluated. No AWS IAM simulator or deployment is invoked.
- JSON/YAML parsing and static ASL/template checks do not execute SDK code, deploy templates or evaluate intrinsic expressions.
- Application guardrails (document size, row counts, graph/workflow limits) are distinct from AWS hard, adjustable and contextual quotas. Kilobytes, characters, UTF-8 bytes and aggregate limits are not interchangeable.
- Domain practice intentionally covers selected high-value misconceptions; other services offer schema exercises and sourced knowledge checks. Use the current AWS exam guide and hands-on labs to cover runtime and code skills.
