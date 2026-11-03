# Compute and data handbook research

Research date: 2026-11-03. This is the author's source-research record, not an
independent-review certificate or an executed AWS validation.

## Delivered scope

src/serviceHandbookComputeData.ts contains 20 original English handbooks:
15,191 words of displayed guidance/example text, excluding source metadata and
citation identifiers. The entries range from 731 to 812 words. They supplement
the existing field notes rather than replace the shorter service summaries.

Each entry includes three operating-model notes, four setup steps, three
configuration decisions and tradeoffs, two security controls, one example with
two outcome checks, three diagnostic cases and two pitfalls. All displayed
sections have entry-local source identifiers. There are 92 distinct linked
primary documentation pages; all linked pages below were opened in the browser
research pass.

## Factual checkpoints and scope decisions

| Service ID | Source-checked distinction included in the handbook |
| --- | --- |
| lambda | Event Functions and event source mappings are explicit scope; invocation contracts differ. SQS partial batch reporting requires mapping configuration and the correct message-ID response; escaping exceptions still fail a complete batch. FIFO failure handling preserves order. Reserved concurrency is not pre-initialized capacity. |
| sqs | Standard delivery can duplicate and reorder. FIFO ordering is per message group. Polling wait and processing visibility are separate. Standard DLQ retention uses original enqueue time; a FIFO DLQ can affect sequence expectations. |
| dynamodb | GSIs are eventually consistent; supported table/LSI reads can request strong consistency. Conditions guard a write atomically. Transactions have an account/Region scope and do not atomically include an external payment system. |
| eventbridge | Examples explicitly use rule-based Custom Event Bus - Classic behavior. Current documentation distinguishes newer subscriber configuration. Lambda/SNS/SQS targets can use supported execution roles or resource policies; CloudWatch Logs targets must not specify RoleArn. Ingestion and consumer completion are separate. |
| appsync | APPSYNC_JS is a constrained runtime, not Node.js. Unit/pipeline resolver contracts differ. API authentication does not replace object ownership. GraphQL subscriptions depend on mutation selections; AppSync Events is a distinct API model. |
| sns | Filters and redrive policies belong to subscriptions. Filter scope selects attributes or JSON body. Raw delivery changes the envelope. SNS delivery DLQs do not handle worker failures after successful SQS delivery. |
| step-functions | Standard, asynchronous Express and synchronous Express have different execution semantics. The workflow type is immutable. Request-response, job waiting and callback integration patterns differ. Explicit retries still need side-effect reconciliation. The example uses JSONPath consistently. |
| ec2 | Running compute is not application health. Automatically assigned public IPv4 can change after stop/start. Instance roles avoid embedded credentials; requiring IMDSv2 can expose old client incompatibility. Storage/network resources can remain billable when compute stops. |
| elastic-beanstalk | The example is explicitly Beanstalk Standard, not Cluster mode. Current docs distinguish Cluster deployment namespaces. The historical default EC2 instance profile is no longer automatically created in new environments/accounts. Rolling policy can expose mixed versions. |
| aurora | Reader endpoints balance connections, not individual statements. Reader freshness differs from the writer path. Serverless ranges and auto-pause are version/configuration dependent. Backup restoration and replica failover solve different failures. |
| rds | Multi-AZ DB instance standbys do not serve reads; Multi-AZ DB cluster standbys can. Read replicas are asynchronous. Parameter changes must be checked for actual application and restart requirements. Network connectivity and SQL authorization are distinct. |
| elasticache | Cache-aside, invalidation and TTL describe application correctness. Replication/IAM notes are scoped to supported Valkey/Redis OSS configurations, not every engine. Current durability choices are not generalized into an assertion that every cache has identical persistence. |
| ebs | Attached block devices still require filesystem/mount work. Existing filesystems must not be blindly formatted. Volume and instance performance can each limit I/O. Snapshots require an intentional backup schedule and application-level restore validation. |
| efs | Mount targets are network entry points; access points enforce identity/root-directory behavior. Regional and One Zone placement differ. Numeric UID/GID, POSIX modes, IAM and network reachability remain distinct checks. |
| s3 | The guide is scoped to general-purpose object buckets. Versions/delete markers are not immutable retention. Presigned URLs can be reused and can expire with the signing credentials. Effective Block Public Access has multiple scopes. Strong object consistency is not a multi-object transaction. |
| athena | Partition pruning requires a partition contract, not only folder names. Managed and customer-owned results are distinguished. Per-query scan controls cancel; aggregate workgroup alerts do not automatically cancel queries. Result-object permissions must be reviewed separately. |
| kinesis | Scope is Data Streams, not Firehose. PutRecords can partially fail; retries do not imply global ordering. Current KCL guidance replaces legacy 1.x/2.x setup. Metadata and metric permissions depend on the selected KCL deployment. |
| opensearch | Scope is managed domains, not Serverless collections. Shards add overhead and replicas add storage. Domain reachability/policy/fine-grained roles are different layers. The example's tenant filter is explicitly not an authorization policy. |
| ecr | Login token authority follows the issuing principal. Tag immutability can have exclusions. Basic/enhanced scanning coverage differs and archived images require restoration before scanning. Lifecycle preview must be checked against rollback references. |
| ecs | Execution and application task roles are distinct. Fargate awsvpc tasks still require working dependency paths. A new task-definition revision does not update a service by itself. Circuit-breaker rollback requires a completed deployment. |

## Research corrections and limits

- The guessed Athena workgroup URL redirected to the guide root; it was excluded
  and replaced with the opened workgroups-manage-queries-control-costs.html.
- The legacy KCL shared-throughput page explicitly describes outdated library
  generations. The linked handbook uses the current kcl.html and current
  permission guidance instead.
- The ECR immutability page has a broad introductory sentence followed by
  explicit supported exclusion modes. The handbook follows the detailed
  exclusion configuration and does not repeat the overly broad sentence.
- A guessed Kinesis IAM page was inaccessible and was excluded. The linked
  security and KCL permission pages were opened successfully instead.
- Numeric quotas, service prices, fixed scaling promises and universal version
  support were intentionally not asserted. Engine, Region, mode and account
  configuration still need checking for an actual implementation.
- Security notes combine documented service boundaries with original proposed
  implementation checks; they are not complete IAM policies or a security audit.
- JSON snippets were parsed locally. CLI examples are read-only illustrations;
  no AWS commands, cloud resource provisioning or paid provider calls were run.
- AWS API schemas were not live-tested. Pseudocode is explicitly labeled, and
  partial configuration examples state their prerequisites and omissions.

## Local structural validation

- Bounded TypeScript check of the module and its schema passed with Node 22.
- Exactly 20 unique assigned service IDs were confirmed.
- Every section's source identifier resolves to a source in its own entry.
- Every JSON example parses successfully.
- git diff --check passed for the module.

## Opened primary references

The list below is generated from the same sources rendered by the application.

### lambda

- [Lambda event source mappings and delivery contracts](https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html) - mapping; checked 2026-11-03.
- [Lambda memory and CPU allocation](https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html) - memory; checked 2026-11-03.
- [Lambda execution role and permissions](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html) - role; checked 2026-11-03.
- [Lambda SQS partial batch failure handling](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html) - batch; checked 2026-11-03.
- [Reserved concurrency for Lambda Event Functions](https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html) - concurrency; checked 2026-11-03.

### sqs

- [SQS standard queue delivery semantics](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html) - standard; checked 2026-11-03.
- [SQS FIFO message groups and delivery logic](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-understanding-logic.html) - fifo; checked 2026-11-03.
- [SQS short and long polling](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html) - polling; checked 2026-11-03.
- [SQS dead-letter queue retention and policies](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html) - dlq; checked 2026-11-03.
- [SQS least privilege and encryption practices](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-security-best-practices.html) - security; checked 2026-11-03.

### dynamodb

- [DynamoDB read consistency by resource type](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html) - consistency; checked 2026-11-03.
- [DynamoDB conditional write expressions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html) - conditions; checked 2026-11-03.
- [DynamoDB global secondary index behavior](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html) - indexes; checked 2026-11-03.
- [DynamoDB transaction semantics and scope](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis.html) - transactions; checked 2026-11-03.
- [DynamoDB IAM actions, resources and conditions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/security_iam_service-with-iam.html) - security; checked 2026-11-03.

### eventbridge

- [EventBridge event pattern matching](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html) - patterns; checked 2026-11-03.
- [PutEvents entry results and failure handling](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-putevents.html) - publish; checked 2026-11-03.
- [EventBridge targets and Classic-versus-subscriber scope](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-targets.html) - targets; checked 2026-11-03.
- [EventBridge target authorization mechanisms](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-use-resource-based.html) - permissions; checked 2026-11-03.

### appsync

- [AppSync JavaScript unit and pipeline resolvers](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-reference-overview-js.html) - resolvers; checked 2026-11-03.
- [AppSync API and field authorization](https://docs.aws.amazon.com/appsync/latest/devguide/security-authz.html) - auth; checked 2026-11-03.
- [AppSync GraphQL subscriptions and mutation selections](https://docs.aws.amazon.com/appsync/latest/devguide/aws-appsync-real-time-data.html) - subscriptions; checked 2026-11-03.
- [AppSync DynamoDB JavaScript resolver contracts](https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-dynamodb-resolvers-js.html) - tutorial; checked 2026-11-03.

### sns

- [SNS subscription message filtering and scope](https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html) - filter; checked 2026-11-03.
- [SNS raw message delivery contracts](https://docs.aws.amazon.com/sns/latest/dg/sns-large-payload-raw-message-delivery.html) - raw; checked 2026-11-03.
- [SNS subscription dead-letter queues](https://docs.aws.amazon.com/sns/latest/dg/sns-dead-letter-queues.html) - dlq; checked 2026-11-03.
- [SNS-to-SQS subscriptions and queue authorization](https://docs.aws.amazon.com/sns/latest/dg/subscribe-sqs-queue-to-sns-topic.html) - fanout; checked 2026-11-03.

### step-functions

- [Step Functions Standard and Express workflow semantics](https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html) - types; checked 2026-11-03.
- [Step Functions Retry, Catch and error categories](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html) - errors; checked 2026-11-03.
- [Step Functions request, job and callback integrations](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html) - integration; checked 2026-11-03.
- [Step Functions Task fields and query languages](https://docs.aws.amazon.com/step-functions/latest/dg/state-task.html) - tasks; checked 2026-11-03.

### ec2

- [EC2 private and public addressing behavior](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-instance-addressing.html) - addressing; checked 2026-11-03.
- [EC2 instance profiles and temporary role credentials](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html) - roles; checked 2026-11-03.
- [EC2 instance metadata and user data](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html) - metadata; checked 2026-11-03.
- [EC2 lifecycle states and associated charges](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html) - lifecycle; checked 2026-11-03.
- [EC2 IMDSv2 request and token behavior](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html) - imds; checked 2026-11-03.

### elastic-beanstalk

- [Beanstalk application concepts and Standard/Cluster modes](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.html) - concepts; checked 2026-11-03.
- [Beanstalk deployment policies and mode-specific settings](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.rolling-version-deploy.html) - deployment; checked 2026-11-03.
- [Beanstalk environment and software properties](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/environments-cfg-softwaresettings.html) - settings; checked 2026-11-03.
- [Beanstalk Standard EC2 instance profiles](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/iam-instanceprofile.html) - profile; checked 2026-11-03.

### aurora

- [Aurora writer, reader and instance endpoints](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.Endpoints.html) - endpoints; checked 2026-11-03.
- [Aurora read replicas and replication roles](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Replication.html) - replication; checked 2026-11-03.
- [Aurora serverless capacity ranges and parameter effects](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.setting-capacity.html) - capacity; checked 2026-11-03.
- [Aurora backups, snapshots and restoration](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Backups.html) - backups; checked 2026-11-03.
- [Aurora TLS certificate and identity verification](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/UsingWithRDS.SSL.html) - tls; checked 2026-11-03.

### rds

- [RDS Multi-AZ instance and cluster deployment differences](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html) - multiaz; checked 2026-11-03.
- [RDS read replicas and asynchronous replication](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html) - replicas; checked 2026-11-03.
- [RDS parameter groups and engine settings](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithParamGroups.html) - parameters; checked 2026-11-03.
- [RDS subnet groups and VPC connectivity](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html) - network; checked 2026-11-03.
- [RDS TLS encryption and certificate verification](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html) - tls; checked 2026-11-03.

### elasticache

- [ElastiCache cache population, write-through and TTL strategies](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html) - strategy; checked 2026-11-03.
- [ElastiCache Valkey and Redis OSS replication groups](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Replication.html) - replication; checked 2026-11-03.
- [ElastiCache IAM authentication prerequisites and lifecycle](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/auth-iam.html) - auth; checked 2026-11-03.
- [ElastiCache network and connection troubleshooting](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/TroubleshootingConnections.html) - connections; checked 2026-11-03.

### ebs

- [EBS volume types and performance dimensions](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html) - types; checked 2026-11-03.
- [Preparing and mounting an EBS block device](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-using-volumes.html) - mount; checked 2026-11-03.
- [EBS snapshot behavior and backup responsibility](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html) - snapshots; checked 2026-11-03.
- [EBS encryption and KMS dependencies](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-encryption.html) - encryption; checked 2026-11-03.

### efs

- [EFS mount targets and Availability Zone placement](https://docs.aws.amazon.com/efs/latest/ug/accessing-fs.html) - mounts; checked 2026-11-03.
- [EFS access point identity and root directory behavior](https://docs.aws.amazon.com/efs/latest/ug/efs-access-points.html) - access; checked 2026-11-03.
- [EFS throughput and performance configuration](https://docs.aws.amazon.com/efs/latest/ug/performance.html) - performance; checked 2026-11-03.
- [EFS IAM client actions and filesystem policies](https://docs.aws.amazon.com/efs/latest/ug/iam-access-control-nfs-efs.html) - iam; checked 2026-11-03.
- [EFS numeric users, groups and file permissions](https://docs.aws.amazon.com/efs/latest/ug/accessing-fs-nfs-permissions.html) - posix; checked 2026-11-03.

### s3

- [S3 object model and data consistency](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) - overview; checked 2026-11-03.
- [S3 versions, delete markers and retention](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html) - versioning; checked 2026-11-03.
- [S3 presigned URL authority and expiration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html) - presigned; checked 2026-11-03.
- [S3 Block Public Access evaluation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html) - public; checked 2026-11-03.

### athena

- [Athena partition registration and pruning](https://docs.aws.amazon.com/athena/latest/ug/partitions.html) - partitions; checked 2026-11-03.
- [Athena workgroup access and enforced configuration](https://docs.aws.amazon.com/athena/latest/ug/workgroups-manage-queries-control-costs.html) - workgroups; checked 2026-11-03.
- [Athena customer-owned and managed query results](https://docs.aws.amazon.com/athena/latest/ug/querying.html) - results; checked 2026-11-03.
- [Athena source, catalog and API permissions](https://docs.aws.amazon.com/athena/latest/ug/security-iam-athena.html) - security; checked 2026-11-03.
- [Athena per-query cancellation and aggregate alerts](https://docs.aws.amazon.com/athena/latest/ug/workgroups-setting-control-limits-cloudwatch.html) - limits; checked 2026-11-03.

### kinesis

- [Kinesis Data Streams shards, partition keys and retention](https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html) - concepts; checked 2026-11-03.
- [Kinesis producer API and partial batch handling](https://docs.aws.amazon.com/streams/latest/dev/developing-producers-with-sdk.html) - producer; checked 2026-11-03.
- [Current Kinesis Client Library responsibilities](https://docs.aws.amazon.com/streams/latest/dev/kcl.html) - kcl; checked 2026-11-03.
- [Kinesis enhanced fan-out consumer behavior](https://docs.aws.amazon.com/streams/latest/dev/enhanced-consumers.html) - fanout; checked 2026-11-03.
- [Kinesis least privilege and producer/consumer roles](https://docs.aws.amazon.com/streams/latest/dev/security-best-practices.html) - security; checked 2026-11-03.
- [KCL metadata and monitoring permissions](https://docs.aws.amazon.com/streams/latest/dev/kcl-iam-permissions.html) - kcl-iam; checked 2026-11-03.

### opensearch

- [OpenSearch Service fine-grained authorization layers](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/fgac.html) - security; checked 2026-11-03.
- [OpenSearch domain sizing and representative testing](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/sizing-domains.html) - sizing; checked 2026-11-03.
- [OpenSearch primary and replica shard sizing](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/bp-sharding.html) - shards; checked 2026-11-03.
- [OpenSearch allocation, pressure and access troubleshooting](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/handling-errors.html) - errors; checked 2026-11-03.
- [OpenSearch Service supported API operations](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/supported-operations.html) - operations; checked 2026-11-03.

### ecr

- [ECR registry authentication and token authority](https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html) - auth; checked 2026-11-03.
- [ECR tag immutability and exclusions](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html) - tags; checked 2026-11-03.
- [ECR basic and enhanced vulnerability scanning](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html) - scanning; checked 2026-11-03.
- [ECR lifecycle policy evaluation and preview](https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html) - lifecycle; checked 2026-11-03.

### ecs

- [ECS task definitions and container configuration](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) - tasks; checked 2026-11-03.
- [ECS task execution role and startup permissions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html) - execution; checked 2026-11-03.
- [ECS application task role and isolation boundaries](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html) - role; checked 2026-11-03.
- [ECS deployment circuit breaker and rollback prerequisites](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-circuit-breaker.html) - deployment; checked 2026-11-03.
- [Fargate task networking and dependency paths](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html) - network; checked 2026-11-03.
