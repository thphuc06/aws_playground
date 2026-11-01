# DVA-C03 architecture configuration coverage

Reviewed 2026-11-01. The registry contains **58 profiles and 326 fields**: the
56 named C03 services plus AppSync and Q Developer for legacy C02 graph support.
AWS describes its named-service list as non-exhaustive and subject to change.
The two legacy entries are not silently claimed to be named C03 services.

This is a bounded application-design study model, not a replica of AWS Console,
an exhaustive exam course, or a deployable infrastructure specification. Every
profile has 4–8 service-specific fields. A missing value remains unknown; there
are no inferred/default permissions, network grants or workload requirements.
Text fields describe intent and can reference graph node IDs; they must never
contain actual keys, tokens or confidential account configuration.

## Evidence and mapping

- [Current C03 named-service list](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/dva-03-in-scope-services.html)
- [Domain 1: development](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/developer-associate-03-domain1.html)
- [Domain 2: security](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/developer-associate-03-domain2.html)
- [Domain 3: testing and deployment](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/developer-associate-03-domain3.html)
- [Domain 4: troubleshooting and optimization](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/developer-associate-03-domain4.html)

The named list and all four task pages were directly opened during this update.
Task IDs below are **C03 task-level mappings**, not assertions that AWS tests
every field or option. Fields are original educational abstractions, not copied
console forms or comprehensive service API schemas.

The 47 existing service profiles reuse the first two source references from the
previously reviewed service briefs. Those references remain dated 2026-11-01;
they were not all independently re-opened for this update. New C03 profiles and
the HTTP/private API Gateway integration sources were opened directly. A source
link establishes relevant documentation context, not that every setting has
been exercised in AWS or that an AI has consulted that source in a given run.

## Architectural boundaries

- EC2 describes an application role, ingress, instance profile, availability,
  secrets and observability. It does not assume the application writes DynamoDB.
- API Gateway describes Lambda, HTTP and private integrations, with API-type
  caveats. A private integration's VPC link is distinct from AWS PrivateLink.
- Lambda architectural timeout/memory settings are separate from mocked duration
  or simulated permission assertions in the older learning lesson.
- Development tools such as CLI, CDK, SAM and Kiro are planning/deployment nodes,
  not traffic-serving application resources. Their fields do not execute tools.
- Bedrock/AgentCore/Quick/Kiro cover integration and applying existing controls
  within DVA scope. They do not claim foundation-model selection, full RAG design
  or enterprise AI governance-framework coverage.
- Graph/schema checks and declared controls cannot prove IAM policy evaluation,
  endpoint reachability, certificate issuance, regional feature availability,
  production security, cost or runtime behavior.
- Legacy AppSync and Q Developer profiles support old saved graphs and label the
  distinction between compatibility and the current named C03 list.

## Profile matrix

| Service ID | C03 tasks | Configuration fields | Official references |
| --- | --- | --- | --- |
| athena | 1.3, 2.1, 4.3 | Data source; Data format; Partition strategy; Workgroup controls; Query permissions | [Athena managed query results](https://docs.aws.amazon.com/athena/latest/ug/managed-results.html); [Athena workgroup settings](https://docs.aws.amazon.com/athena/latest/ug/creating-workgroups.html) |
| kinesis | 1.1, 4.3 | Capacity mode; Partition key strategy; Consumer model; Checkpoint and retry strategy; Retention requirement; Producer/consumer permissions | [Kinesis key concepts](https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html); [Duplicate records](https://docs.aws.amazon.com/streams/latest/dev/kinesis-record-processor-duplicates.html) |
| opensearch | 1.3, 2.1, 4.2 | Deployment; Index and mapping; Network access; Access policy; Ingestion and retry; Audit/slow-log plan | [Fine-grained access control](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/fgac.html); [Domain metrics](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-cloudwatchmetrics.html) |
| appsync | 1.1, 2.1 | GraphQL schema; Authorization; Resolver/data source mapping; Field permissions; Resolver failure handling | [AppSync overview](https://docs.aws.amazon.com/appsync/latest/devguide/what-is-appsync.html); [Authorization](https://docs.aws.amazon.com/appsync/latest/devguide/security-authz.html) |
| eventbridge | 1.1, 2.1, 4.2 | Event bus; Event selection; Target references; Target permissions; Retry and DLQ; Idempotent consumers | [Rule retries](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-retry-policy.html); [Target permissions](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-use-resource-based.html) |
| sns | 1.1, 2.1, 4.3 | Topic type; Subscribers; Subscription filters; Publish and subscription permissions; Delivery failure handling; Ordering/deduplication strategy | [SNS overview](https://docs.aws.amazon.com/sns/latest/dg/welcome.html); [Retry policies](https://docs.aws.amazon.com/sns/latest/dg/sns-message-delivery-retries.html) |
| sqs | 1.1, 4.3 | Queue type; Visibility timeout (seconds); Long-poll wait (seconds); DLQ/redrive plan; Consumer concurrency; Idempotent processing; Queue access | [SQS overview](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html); [Lambda SQS configuration](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-configure.html) |
| step-functions | 1.1, 4.1 | Workflow type; State flow; Task integrations; Retry and catch rules; Execution role permissions; Payload handling | [Workflow overview](https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html); [Error handling](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html) |
| ec2 | 1.1, 2.1, 3.3, 4.3 | Workload role; Network exposure; Instance profile permissions; Application listener and ingress; Availability and scaling; Secret/config retrieval; Application observability | [EC2 concepts](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html); [IAM roles and instance profiles](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html) |
| elastic-beanstalk | 3.1, 3.3, 4.1 | Environment tier; Platform/runtime; Deployment policy; Environment configuration; Health and scaling; Application instance role | [Beanstalk overview](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html); [Deployment policies](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.rolling-version-deploy.html) |
| lambda | 1.2, 2.1, 3.3, 4.3 | Invocation model; Function timeout (seconds); Memory allocation (MB); Execution-role permissions; Concurrency controls; Failure handling; Network dependencies; Configuration and secrets | [Lambda retries](https://docs.aws.amazon.com/lambda/latest/dg/invocation-retries.html); [Execution role](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html) |
| ecr | 3.1, 2.1 | Repository visibility; Deployment identity; Image scanning; Image retention; Push/pull permissions | [ECR overview and features](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html); [ECR identity and access](https://docs.aws.amazon.com/AmazonECR/latest/userguide/security-iam.html) |
| ecs | 1.1, 3.1, 3.3, 4.2 | Compute option; Task definition; Task role; Execution role; Service networking; Service rollout; Secrets and logs | [Task IAM role](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html); [Task execution role](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html) |
| eks | 1.1, 3.1, 3.3, 4.2 | Workload manifest; AWS workload identity; Health probes; Requests and limits; Secret delivery; Rollout and observability | [EKS overview](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html); [EKS Pod Identity](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html) |
| aurora | 1.3, 2.2, 4.3 | Engine compatibility; Capacity model; Read/write endpoints; Connections; Authentication and secrets; Availability and recovery | [Aurora overview](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html); [Connecting to Aurora](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Connecting.html) |
| dynamodb | 1.3, 2.1, 4.3 | Access patterns; Partition/sort key design; Secondary indexes; Capacity mode; Read consistency; Write safety; Streams and expiration | [DynamoDB overview](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html); [Read consistency](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html) |
| elasticache | 1.3, 4.3 | Engine; Cache pattern; TTL and invalidation; Network and authentication; Cache failure behavior; Availability requirements | [ElastiCache overview](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html); [Caching strategies](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html) |
| rds | 1.3, 2.2, 4.3 | Database engine; Network exposure; Authentication and secret rotation; Connection reuse; Availability and read scaling; Backup and encryption | [RDS overview](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html); [IAM database authentication](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html) |
| amplify | 3.1, 3.2, 3.3 | Source and branch; Build settings; Public environment configuration; Preview environments; Hosting routing; Deployment checks | [Hosting overview](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html); [Build settings](https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html) |
| cloudshell | 2.1, 3.1 | Development task; Effective identity; Target Region; Environment; Artifact handling | [CloudShell overview](https://docs.aws.amazon.com/cloudshell/latest/userguide/welcome.html); [Security and monitoring topics](https://docs.aws.amazon.com/cloudshell/latest/userguide/security.html) |
| codeartifact | 3.1, 2.1 | Package ecosystem; Domain/repository relationship; Build authentication; Version selection; Upstream policy | [CodeArtifact concepts](https://docs.aws.amazon.com/codeartifact/latest/ug/welcome.html); [Token authentication](https://docs.aws.amazon.com/codeartifact/latest/ug/tokens-authentication.html) |
| codebuild | 3.1, 3.2, 2.1 | Build phases; Build runtime/image; Build role permissions; Secret inputs; Artifacts and test reports; Build cache | [CodeBuild overview](https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html); [Buildspec reference](https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html) |
| codedeploy | 3.3, 4.1 | Compute platform; Revision artifact; Traffic shift; Lifecycle validation; Rollback conditions; Deployment permissions | [CodeDeploy overview and platforms](https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html); [Rollback behavior](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html) |
| codepipeline | 3.1, 3.2, 3.3 | Source trigger; Stages and artifacts; Quality gates; Environment promotion; Pipeline/action roles; Failure handling | [Pipeline concepts](https://docs.aws.amazon.com/codepipeline/latest/userguide/concepts.html); [Service role](https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-custom-role.html) |
| xray | 4.1, 4.2 | Instrumentation; Trace propagation; Sampling strategy; Annotations and metadata; Trace publishing permissions | [X-Ray overview](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html); [OpenTelemetry migration](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-migration.html) |
| q-developer | 1.1, 2.3, 3.2 | Development task; Allowed context; Action permissions; Generated-output validation | [Q Developer overview and lifecycle notice](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/what-is.html); [Q security](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/security.html) |
| appconfig | 3.1, 3.3, 4.1 | Configuration profile; Validation; Rollout strategy; Rollback alarms; Application retrieval | [AppConfig overview](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html); [Data-plane retrieval](https://docs.aws.amazon.com/appconfig/latest/userguide/about-data-plane.html) |
| cdk | 3.1, 3.2, 3.3 | Stack boundaries; Target account/Region context; Synthesis and dependencies; Infrastructure tests; Change review and deployment | [CDK overview](https://docs.aws.amazon.com/cdk/v2/guide/home.html); [Bootstrapping](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping-env.html) |
| cloudformation | 3.1, 3.2, 3.3 | Template and parameters; Resource dependencies; Change-set review; Rollback behavior; Resource retention; Execution role | [CloudFormation overview](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html); [Change sets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html) |
| cloudtrail | 2.1, 4.1 | Event scope; Resource selectors; Evidence destination; Evidence protection; Investigation questions | [CloudTrail overview](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html); [Data events](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html) |
| cloudwatch | 4.1, 4.2, 4.3 | Metrics and dimensions; Alarm conditions; Alarm actions; Dashboards; Custom instrumentation | [CloudWatch overview](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html); [Alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Alarms.html) |
| cli | 1.1, 2.1, 3.1 | Operation; Credential source; Profile/Region selection; Pagination and output; Retry/idempotency | [CLI overview](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html); [CLI retry modes](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-retries.html) |
| systems-manager | 3.1, 2.2, 4.1 | Application use; Parameter hierarchy; Parameter type; Runtime retrieval; Operational permissions | [Systems Manager overview](https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html); [Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) |
| api | 1.1, 2.1, 3.1 | API type; Integration type; Routes and methods; Authorization; Backend target; Private integration connection; Stage, throttling and errors | [HTTP proxy integrations](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-http.html); [Private integrations and VPC links](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-private.html); [Lambda proxy integrations](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html) |
| cloudfront | 1.1, 2.1, 4.3 | Origins; Cache behaviors; Cache key and TTL; Origin access; Viewer security; Content updates | [Cache keys and policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html); [S3 origin access control](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html) |
| elb | 1.1, 4.2, 4.3 | Load balancer type; Scheme; Listener protocol/port; Target group; Routing rules; Availability and draining | [Application Load Balancer concepts](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html); [Target health checks and fail-open behavior](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html) |
| route53 | 1.1, 4.1 | Hosted-zone type; Record target; Routing policy; Health evaluation; TTL and rollout | [Routing policies](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html); [Health checks and DNS failover](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html) |
| vpc | 1.1, 2.1, 4.1 | Subnet placement; Application ingress; Outbound service access; VPC endpoints; DNS requirements; Network diagnostics | [VPC traffic controls and flow logs](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html); [Routing examples](https://docs.aws.amazon.com/vpc/latest/userguide/route-table-options.html) |
| cognito | 2.1 | Identity purpose; App client and flow; Token validation; Application authorization; Federation and MFA | [Cognito components and use cases](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html); [JWT verification](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html) |
| iam | 2.1 | Principal type; Trust relationship; Actions and resources; Resource-based permissions; Effective-permission limits | [Policy evaluation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html); [IAM best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html) |
| kms | 2.2 | Key management; Cryptographic use; Key policy and IAM; Encryption context; Rotation and lifecycle | [KMS key ownership and control](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html); [KMS key policies](https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html) |
| secrets-manager | 2.2, 3.1 | Secret purpose; Retrieval identity; Client caching; Rotation workflow; Failure handling | [Secrets Manager best practices](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html); [Rotation mechanisms](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html) |
| sts | 2.1 | Session method; Trusted principal; Session scope; Credential refresh; Cross-account controls | [Temporary credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html); [AssumeRole API](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html) |
| waf | 2.1, 4.2 | Protected resource; Rule groups; Rule actions and rollout; Rate-based protection; Request visibility | [AWS WAF concepts and supported resources](https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html); [WAF traffic logging](https://docs.aws.amazon.com/waf/latest/developerguide/logging.html) |
| ebs | 1.3, 2.2, 4.3 | Application data; Volume type; Performance requirement; Encryption and key access; Snapshots and lifecycle | [EBS overview](https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html); [Volume attachment](https://docs.aws.amazon.com/en_en/ebs/latest/userguide/ebs-attaching-volume.html) |
| efs | 1.3, 2.1, 4.3 | Filesystem clients; Mount targets and networking; Access points and POSIX permissions; Encryption and IAM authorization; Throughput and lifecycle | [EFS overview](https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html); [Monitoring](https://docs.aws.amazon.com/efs/latest/ug/monitoring-cloudwatch.html) |
| s3 | 1.3, 2.1, 2.2 | Object access pattern; Access controls; Encryption; Versioning and lifecycle; Object notifications; Presigned access | [S3 overview](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html); [Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html) |
| firehose | 1.1, 2.1, 4.2 | Source; Delivery destination; Buffering requirements; Transformation; Delivery permissions; Failed delivery | [Data Firehose data flow](https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html) |
| bedrock | 1.1, 2.3, 4.2 | Application use; Approved model/inference profile; Invocation permissions; Input and privacy controls; Output validation; Timeout, quotas and retry; Safe telemetry | [Amazon Bedrock application integration](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html) |
| agentcore | 1.1, 2.3, 4.2 | Inbound authentication; Outbound tool identity; Allowed tool actions; Human approval policy; Session and memory isolation; Safe agent observability | [AgentCore inbound and outbound authorization](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-oauth.html) |
| quick | 1.1, 2.3 | Application/development use; Approved data sources; Knowledge-base access; Sharing boundary; Output review | [Amazon Quick knowledge-base and data-source permissions](https://docs.aws.amazon.com/quick/latest/userguide/sharing-kb-datasources.html) |
| kiro | 1.1, 2.3, 3.2 | Specification; Project steering; Context boundary; Tool permissions; Verification workflow | [Kiro project steering](https://kiro.dev/docs/steering/) |
| cloudwatch-logs | 4.1, 4.2, 2.2 | Log sources; Log class; Structured event fields; Retention; Sensitive-data handling; Queries and alerts | [CloudWatch Logs capabilities](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) |
| sam | 3.1, 3.2, 3.3 | SAM template; Build and dependencies; Local and integration tests; Environment parameters; Deployment and rollback | [AWS SAM framework and CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) |
| privatelink | 1.1, 2.1, 4.1 | Target service/resource; Endpoint placement; Private DNS; Network access; Endpoint/service policies | [AWS PrivateLink and VPC endpoints](https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html) |
| acm | 2.2 | Certificate source; Domain names; Public certificate validation; Certificate attachment; Renewal ownership | [AWS Certificate Manager overview](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html) |
| private-ca | 2.2 | CA role; Certificate use; Issuance permissions; Trust distribution; Revocation and renewal | [AWS Private CA overview](https://docs.aws.amazon.com/privateca/latest/userguide/PcaWelcome.html) |
| glacier | 1.3, 2.2 | Archive storage class; Retrieval requirement; Lifecycle transition; Restore workflow; Retention and access | [S3 Glacier storage classes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/glacier-storage-classes.html) |
