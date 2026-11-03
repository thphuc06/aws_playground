# Independent compute and data handbook review

Reviewed 2026-11-03 by a fresh reviewer, independently of the author. Scope:
all 20 entries in `src/serviceHandbookComputeData.ts` and the corresponding
20 existing entries in `src/serviceDeepDiveCore.ts`. The schema and author
research record were read, but the author's verification claims were not used
as evidence. Every new section and example, and every old scenario and cost
driver, was read. The primary pages listed below were independently opened.

Outcome: the new handbook module is approved as source-backed learning material
after the corrections below. The release owner applied all four requested
precision changes to the shared old core; this reviewer inspected the resulting
text and confirmed the additional EventBridge scope reference. No factual
blocker remains in the assigned material. The owner retains the release decision.
This review does not certify a deployed AWS implementation. No cloud resources,
AWS CLI calls, provider calls, provisioning, or paid experiments were executed.

## Coverage and example review

Every row includes at least three independently opened official AWS
documentation pages; pricing pages are additional. Exact URLs appear in the
per-service evidence list. The two OpenSearch query pages are also primary
documentation, published by OpenSearch itself.

| Service | Important distinctions independently checked | Example semantics and outcome |
| --- | --- | --- |
| lambda | At-least-once mappings; SQS partial responses require both configuration and message IDs; uncaught errors fail a batch; FIFO stops after failure; reserved versus provisioned concurrency. | Response object matches the documented contract. Added explicit reminder that acknowledgement does not remove the general duplicate-processing requirement. |
| sqs | Standard duplicates and ordering; FIFO grouping; polling versus visibility; original standard-DLQ enqueue age; expiry and redrive. | Envelope is application data, not an API call. Corrected the completion-record explanation: external side effects require provider idempotency/reconciliation, while a local ledger must commit atomically with the business change. Added duplicates within visibility timeout. |
| dynamodb | Supported strong reads versus eventual GSIs; index projection and write costs; conditional writes; transaction account/Region boundary; key skew. | PutItem's typed attributes and attribute_not_exists(pk) match a table with pk as its only key. CLAIMED is explicitly not completion; crash recovery remains application work. No claim that all global-table modes have identical consistency was introduced. |
| eventbridge | Current Classic rule targets versus Custom bus subscribers; per-entry PutEvents outcomes; pattern types; Lambda/SNS/SQS execution-role or resource-policy support; CloudWatch Logs RoleArn restriction; target DLQ boundary. | Pattern arrays, nested detail and numeric schemaVersion are consistent with the routing contract. Matching does not prove consumer completion. The release owner added explicit Classic scope to the old rule scenario. |
| appsync | Unit/pipeline contracts; constrained APPSYNC_JS; API and object authorization; mutation selection sets drive GraphQL subscription payloads. | GetItem request and util.dynamodb.toMapValues match the API reference. Added the default eventual-read behavior. Ownership logic remains explicitly omitted, so the snippet is not a protected resolver implementation. |
| sns | Subscription-scoped filters and DLQs; raw envelope; filtering scope; SNS delivery failure versus SQS worker failure; policy propagation. | Filter properties are ANDed and allowed values match within each property. Added propagation prerequisite before evaluating test deliveries. |
| step-functions | Standard versus asynchronous/synchronous Express semantics; retry/catch limits; callback/job-wait support; no distributed transaction guarantee. | Corrected raised exception versus successful JSON rejection. Explained three retries after the initial attempt, execution-role permission and optimized Lambda Payload envelope. No live ASL validation or function execution occurred. |
| ec2 | Lifecycle versus application health; private/public address behavior; instance roles; IMDSv2; retained resource charges. | MetadataOptions fragment requires token-authenticated metadata access, and is explicitly incomplete. Compatibility of actual AMI/bootstrap clients remains a deployment check. |
| elastic-beanstalk | Current Standard/Cluster modes; immutable policy support; mixed versions; historical default instance profile no longer created; underlying Cluster fees. | YAML namespace and Immutable value are documented. Added console/EB CLI override precedence, since a correct configuration file can otherwise appear ineffective. |
| aurora | Connection rather than statement balancing; replica lag; no-replica writer fallback; version-sensitive serverless capacity; restore versus failover. | Routing plan is conceptually valid. Added reader-endpoint fallback to writer and clarified that its name is not a read-only permission boundary. |
| rds | Multi-AZ instance standby versus readable cluster standbys; asynchronous independent replicas; engine-specific unreadable standby/mounted replicas; parameters. | CLI response fields match DescribeDBInstances. Added explicit JSON output and API reference; the MultiAZ flag is still not a complete cluster-topology view. Added Db2/Oracle replica-mode qualifications. |
| elasticache | Cache-aside and TTL; supported Valkey/Redis replication and durability choices; IAM token/connection lifecycle and required TLS. | Corrected the strict-freshness implication: delayed fills can repopulate stale values after invalidation. The example now requires an explicit version/coordination policy for a strict bound and tests that race. |
| ebs | Block device versus mounted filesystem; zone-local attachment; instance and volume performance limits; snapshots omit buffered data; KMS dependencies; Multi-Attach coordination. | Read-only Linux device checks are suitable inspection commands, not format/restore instructions. Added same-zone attachment and Multi-Attach filesystem/write-coordination constraints. |
| efs | Mount target versus access point; Regional/One Zone placement; numeric POSIX identities; IAM and network layers; default anonymous policy; root creation. | JSON fields match CreateAccessPoint. Added omitted required request fields and the fact that CreationInfo does not overwrite an existing directory's permissions. Negative checks now include direct/alternate mount bypass under a complete filesystem policy. |
| s3 | General-purpose object model; strong object consistency versus transactions; versions/delete markers; reusable/credential-limited presigned URLs; effective public-access controls. | Version-listing command matches the CLI and is read-only. Added ListBucketVersions versus GetObjectVersion permissions, JSON output and delete-marker VersionId. Prefix matching is explicitly not exact-key matching. |
| athena | Partition metadata/projection versus folders; results storage modes; source/catalog/result permissions; query cancellation versus aggregate alerts. | SQL predicates the declared string partition key. Scan reduction depends on real catalog/data state; row counts and bytes were not fabricated or measured. |
| kinesis | Data Streams scope; partition distribution; PutRecords per-position failures and ordering limits; KCL at-least-once checkpoints and support resources; EFO differences. | Pseudocode correctly retries failed positions and checkpoints durable work. It is not an implementation of external-effect atomicity or every ambiguous-network retry path. |
| opensearch | Managed-domain scope; shard overhead; network/policy/fine-grained layers; disk/JVM pressure; primary/replica allocation. | Bool must/filter shape is valid. Added match's default OR semantics and direct query references. The tenant filter is expressly not authorization; actual role enforcement must be configured separately. |
| ecr | Principal-scoped token authority; mutability exclusions; Basic/enhanced scan coverage; archived-image restrictions; lifecycle preview. | DescribeImages fields match the CLI. Added JSON output and API reference. Corrected guidance to use DescribeImageScanFindings for current Basic scanning instead of deprecated DescribeImages summary/status fields. |
| ecs | Task definition/task/service; execution versus task roles; Fargate dependency routes; circuit-breaker completed-deployment prerequisite. | 512 CPU / 1024 MiB is a supported Linux combination, awsvpc and role fields match the reference. Added the exact parameter source. Image, roles, network and service are placeholders/omitted, not a runnable deployment. |

## Substantive corrections and reasoning

- SQS: an operation ID by itself does not atomically link an invoice API with a
  local completion row. The revised example states the transaction/provider
  idempotency requirement and separately tests the gap before completion is
  recorded. This is application-design reasoning from the documented duplicate
  delivery contract, not a claim that SQS supplies a ledger.
- Step Functions: an ordinary Lambda JSON result containing a business error
  does not raise a task error. The example now says when a Choice state is needed
  and identifies the optimized integration's result wrapper.
- Aurora: a reader endpoint with no replicas reaches the writer. The reader
  endpoint is not a security boundary and does not always reject writes.
- ElastiCache: a read begun before an update can complete after invalidation and
  refill stale data. TTL starts at that insertion. The counterexample follows
  directly from the pseudocode's operation order; the revision does not claim
  that an AWS documentation page proves this particular application race.
- EFS: the original test involving a changed username was too weak. Access
  depends on numeric identity and policy, and alternate mounts must be denied.
  Existing directory modes are not replaced by CreationInfo.
- EBS: added zone-local attachment and Multi-Attach coordination to avoid
  interpreting an attached block device as a general shared filesystem.
- Beanstalk: configuration precedence is necessary to interpret the YAML
  example's result. S3, RDS and ECR CLI examples now pin JSON output so a user's
  configured text mode does not change pagination/query presentation.
- AppSync, SNS, RDS, OpenSearch and ECR received the consistency, propagation,
  variant, query-operator and scan-API qualifications detailed in the table.

## Shared old-core changes resolved by the release owner

The reviewer did not edit `src/serviceDeepDiveCore.ts` to avoid concurrent writes.
The owner applied the following requests, and the reviewer inspected the final
wording. All four are resolved.

1. **SQS mental model and external-charge walkthrough:** qualify retention expiry,
   and state provider idempotency or outcome reconciliation when the external
   action succeeded before the local completion record was written. Suggested
   opening: "SQS retains a message until deletion or retention expiry; receiving
   it does not remove it." A completion lookup alone does not close that gap.
2. **EventBridge mental model/walkthrough:** explicitly scope rules and target
   DLQs to rule-based/Classic buses, because current Custom buses use subscribers.
3. **Beanstalk costs:** add that Cluster mode incurs EKS cluster and EKS Auto Mode
   management charges. The statement that Beanstalk itself has no platform fee
   remains supported; the omission concerns underlying Cluster cost drivers.
4. **EFS walkthrough:** require policy enforcement of the intended principal and
   access point, and test alternate/direct mounts rather than assuming creation
   of an access point prevents those paths.

All other assigned old scenarios were consistent with the reviewed service
contracts. Their qualitative cost drivers were checked against the respective
current pricing pages; no numerical price, quota, savings or free-tier promise
was added or certified.

## Validation and limits

- Scoped TypeScript validation of the changed module/schema passed with the
  repository's Node 22 binary and TypeScript compiler (`--noEmit --strict`,
  ES2022, ESNext, bundler resolution, skipLibCheck).
- JSON/YAML and global structure tests belong to the release owner's existing
  validation round. This review did not create redundant implementation tests.
- Example review was semantic/documentary: API-shaped fields, runtime contracts,
  authorization prerequisites, successful outcomes and failure counterexamples.
  CLI examples were not run against AWS; SQL, ASL, resolvers and task definitions
  were not deployed. Actual permissions, account/Region support, engine versions,
  workload performance and recovery results remain environment-specific.
- The attempted `fargate-task-definition.html` URL was unavailable. The opened
  `task_definition_parameters.html` page supplied the actual Fargate fields and
  CPU/memory compatibility evidence. The EFS CreateAccessPoint URL redirected to
  its APIReference URL, which is the canonical reference retained below.
- No unresolved factual blocker remains in the assigned new or old content after
  these edits. The release owner's whole-application checks remain separate from
  this documentary review.

## Independently opened evidence

The list below records only pages opened by this reviewer, not every link from
the author's bibliography. It includes the current pricing page and old-core
scenario references for each assigned service: 118 distinct pages in total,
comprising 96 AWS documentation pages, 20 AWS pricing pages and two OpenSearch
query-reference pages. Every service has at least three AWS documentation pages.

### lambda

- [Lambda event source mappings and delivery contracts](https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html)
- [Lambda SQS partial batch failure handling](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html)
- [Reserved concurrency for Lambda Event Functions](https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html)
- [Lambda event-function best practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [Lambda pricing dimensions](https://aws.amazon.com/lambda/pricing/)

### sqs

- [SQS standard queue delivery semantics](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html)
- [SQS FIFO message groups and delivery logic](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-understanding-logic.html)
- [SQS short and long polling](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html)
- [SQS dead-letter queue retention and policies](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html)
- [SQS visibility timeout and duplicate delivery](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html)
- [SQS requests and additional costs](https://aws.amazon.com/sqs/pricing/)

### dynamodb

- [DynamoDB read consistency by resource type](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html)
- [DynamoDB conditional write expressions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html)
- [DynamoDB global secondary index behavior](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html)
- [DynamoDB transaction semantics and scope](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis.html)
- [DynamoDB partition-key design](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html)
- [DynamoDB capacity and feature pricing](https://aws.amazon.com/dynamodb/pricing/)

### eventbridge

- [EventBridge event pattern matching](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html)
- [PutEvents entry results and failure handling](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-putevents.html)
- [EventBridge targets and Classic-versus-subscriber scope](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-targets.html)
- [EventBridge target authorization mechanisms](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-use-resource-based.html)
- [EventBridge target dead-letter queues](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-dlq.html)
- [Rule-based buses and the Custom Event Bus model](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-bus.html)
- [EventBridge pricing by feature](https://aws.amazon.com/eventbridge/pricing/)

### appsync

- [AppSync JavaScript unit and pipeline resolvers](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-reference-overview-js.html)
- [AppSync API and field authorization](https://docs.aws.amazon.com/appsync/latest/devguide/security-authz.html)
- [AppSync GraphQL subscriptions and mutation selections](https://docs.aws.amazon.com/appsync/latest/devguide/aws-appsync-real-time-data.html)
- [AppSync DynamoDB JavaScript resolver contracts](https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-dynamodb-resolvers-js.html)
- [AppSync GetItem request fields and consistency default](https://docs.aws.amazon.com/appsync/latest/devguide/js-aws-appsync-resolver-reference-dynamodb-getitem.html)
- [AppSync Lambda resolvers, errors and batching](https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-lambda-resolvers.html)
- [AppSync GraphQL and Events pricing](https://aws.amazon.com/appsync/pricing/)

### sns

- [SNS subscription message filtering and scope](https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html)
- [SNS raw message delivery contracts](https://docs.aws.amazon.com/sns/latest/dg/sns-large-payload-raw-message-delivery.html)
- [SNS subscription dead-letter queues](https://docs.aws.amazon.com/sns/latest/dg/sns-dead-letter-queues.html)
- [SNS filter matching and propagation](https://docs.aws.amazon.com/sns/latest/dg/sns-subscription-filter-policies.html)
- [SNS topic and delivery pricing](https://aws.amazon.com/sns/pricing/)

### step-functions

- [Step Functions Standard and Express workflow semantics](https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html)
- [Step Functions Retry, Catch and error categories](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html)
- [Step Functions optimized Lambda integration results and failures](https://docs.aws.amazon.com/step-functions/latest/dg/connect-lambda.html)
- [Step Functions billing dimensions](https://aws.amazon.com/step-functions/pricing/)

### ec2

- [EC2 private and public addressing behavior](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-instance-addressing.html)
- [EC2 lifecycle states and associated charges](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html)
- [EC2 IMDSv2 request and token behavior](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html)
- [EC2 On-Demand pricing components](https://aws.amazon.com/ec2/pricing/on-demand/)

### elastic-beanstalk

- [Beanstalk application concepts and Standard/Cluster modes](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.html)
- [Beanstalk deployment policies and mode-specific settings](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.rolling-version-deploy.html)
- [Beanstalk Standard EC2 instance profiles](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/iam-instanceprofile.html)
- [Beanstalk deployment policy comparison](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.deploy-existing-version.html)
- [Beanstalk resource and observability costs](https://aws.amazon.com/elasticbeanstalk/pricing/)

### aurora

- [Aurora writer, reader and instance endpoints](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.Endpoints.html)
- [Aurora read replicas and replication roles](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Replication.html)
- [Aurora serverless capacity ranges and parameter effects](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.setting-capacity.html)
- [Aurora backups, snapshots and restoration](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Backups.html)
- [Aurora reader endpoint balancing and writer fallback](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Endpoints.Reader.html)
- [Aurora compute, storage and I/O pricing](https://aws.amazon.com/rds/aurora/pricing/)

### rds

- [RDS Multi-AZ instance and cluster deployment differences](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html)
- [RDS read replicas and asynchronous replication](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html)
- [RDS parameter groups and engine settings](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithParamGroups.html)
- [RDS describe-db-instances CLI fields and output](https://docs.aws.amazon.com/cli/latest/reference/rds/describe-db-instances.html)
- [RDS pricing by engine and deployment](https://aws.amazon.com/rds/pricing/)

### elasticache

- [ElastiCache cache population, write-through and TTL strategies](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html)
- [ElastiCache Valkey and Redis OSS replication groups](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Replication.html)
- [ElastiCache IAM authentication prerequisites and lifecycle](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/auth-iam.html)
- [ElastiCache serverless and node pricing](https://aws.amazon.com/elasticache/pricing/)

### ebs

- [EBS volume types and performance dimensions](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html)
- [Preparing and mounting an EBS block device](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-using-volumes.html)
- [EBS snapshot behavior and backup responsibility](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html)
- [EBS encryption and KMS dependencies](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-encryption.html)
- [EBS attachment and Availability Zone constraints](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-attaching-volume.html)
- [EBS Multi-Attach and concurrent writer requirements](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes-multi.html)
- [EBS snapshot consistency considerations](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-creating-snapshot.html)
- [EBS volume and snapshot pricing](https://aws.amazon.com/ebs/pricing/)

### efs

- [EFS mount targets and Availability Zone placement](https://docs.aws.amazon.com/efs/latest/ug/accessing-fs.html)
- [EFS access point identity and root directory behavior](https://docs.aws.amazon.com/efs/latest/ug/efs-access-points.html)
- [EFS IAM client actions and filesystem policies](https://docs.aws.amazon.com/efs/latest/ug/iam-access-control-nfs-efs.html)
- [EFS numeric users, groups and file permissions](https://docs.aws.amazon.com/efs/latest/ug/accessing-fs-nfs-permissions.html)
- [EFS CreateAccessPoint API request](https://docs.aws.amazon.com/efs/latest/APIReference/API_CreateAccessPoint.html)
- [EFS access-point root creation and existing permissions](https://docs.aws.amazon.com/efs/latest/ug/enforce-root-directory-access-point.html)
- [EFS storage and throughput pricing](https://aws.amazon.com/efs/pricing/)

### s3

- [S3 object model and data consistency](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)
- [S3 versions, delete markers and retention](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html)
- [S3 presigned URL authority and expiration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html)
- [S3 Block Public Access evaluation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html)
- [S3 list-object-versions CLI permissions and output](https://docs.aws.amazon.com/cli/latest/reference/s3api/list-object-versions.html)
- [S3 current and historical object read permissions](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html)
- [S3 lifecycle transitions and expiration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)
- [S3 storage, request and retrieval pricing](https://aws.amazon.com/s3/pricing/)

### athena

- [Athena partition registration and pruning](https://docs.aws.amazon.com/athena/latest/ug/partitions.html)
- [Athena workgroup access and enforced configuration](https://docs.aws.amazon.com/athena/latest/ug/workgroups-manage-queries-control-costs.html)
- [Athena customer-owned and managed query results](https://docs.aws.amazon.com/athena/latest/ug/querying.html)
- [Athena source, catalog and API permissions](https://docs.aws.amazon.com/athena/latest/ug/security-iam-athena.html)
- [Athena per-query cancellation and aggregate alerts](https://docs.aws.amazon.com/athena/latest/ug/workgroups-setting-control-limits-cloudwatch.html)
- [Athena query and associated-service costs](https://aws.amazon.com/athena/pricing/)

### kinesis

- [Kinesis Data Streams shards, partition keys and retention](https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html)
- [Kinesis producer API and partial batch handling](https://docs.aws.amazon.com/streams/latest/dev/developing-producers-with-sdk.html)
- [Current Kinesis Client Library responsibilities](https://docs.aws.amazon.com/streams/latest/dev/kcl.html)
- [Kinesis enhanced fan-out consumer behavior](https://docs.aws.amazon.com/streams/latest/dev/enhanced-consumers.html)
- [KCL metadata and monitoring permissions](https://docs.aws.amazon.com/streams/latest/dev/kcl-iam-permissions.html)
- [Kinesis capacity and retention pricing](https://aws.amazon.com/kinesis/data-streams/pricing/)

### opensearch

- [OpenSearch Service fine-grained authorization layers](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/fgac.html)
- [OpenSearch primary and replica shard sizing](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/bp-sharding.html)
- [OpenSearch allocation, pressure and access troubleshooting](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/handling-errors.html)
- [OpenSearch Service supported API operations](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/supported-operations.html)
- [OpenSearch Boolean must and filter semantics](https://docs.opensearch.org/latest/query-dsl/compound/bool/)
- [OpenSearch match query analysis and default operator](https://docs.opensearch.org/latest/query-dsl/full-text/match/)
- [OpenSearch managed and Serverless pricing](https://aws.amazon.com/opensearch-service/pricing/)

### ecr

- [ECR registry authentication and token authority](https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html)
- [ECR tag immutability and exclusions](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html)
- [ECR basic and enhanced vulnerability scanning](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html)
- [ECR lifecycle policy evaluation and preview](https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html)
- [ECR describe-images CLI fields and image identifiers](https://docs.aws.amazon.com/cli/latest/reference/ecr/describe-images.html)
- [ECR storage and transfer pricing](https://aws.amazon.com/ecr/pricing/)

### ecs

- [ECS task execution role and startup permissions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html)
- [ECS application task role and isolation boundaries](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html)
- [ECS deployment circuit breaker and rollback prerequisites](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-circuit-breaker.html)
- [Fargate task networking and dependency paths](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html)
- [Fargate task-definition fields and CPU/memory combinations](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html)
- [ECS compute options and charges](https://aws.amazon.com/ecs/pricing/)
