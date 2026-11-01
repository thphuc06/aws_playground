# Core configuration research — DVA-C03

Reviewed 2026-11-01. This audit covers the new `configurationCoreFields` data,
not execution of AWS APIs or proof of complete AWS Console parity.

## Delivered coverage

| Service | Top-level fields | Repeated-row child fields | Main additions |
| --- | ---: | ---: | --- |
| Lambda | 34 | 23 | Package/runtime/handler/architecture, memory/deadline/scratch storage, environment, role/resource policy/KMS, layers/extensions/SnapStart, VPC/EFS, concurrency, event mappings, async failure controls, aliases, logs/tracing/alarms |
| API Gateway | 30 | 35 | API-product variants, endpoint, routes/integrations, JWT/Cognito/Lambda/IAM authorization, REST policy/key/usage-plan/cache/model/VTL options, CORS, stages, private integration, deadlines, safe logs and WebSocket-specific notes |
| DynamoDB | 27 | 16 | Key types, GSI/LSI/projection, capacity/scaling, read target/consistency, Query/Scan, expressions/transactions/pagination, TTL, Streams, KMS/policy/roles, recovery/retries/cache/alarms |
| S3 | 28 | 27 | Ownership/BPA/policy/ACL, encryption/KMS, versioning/lifecycle/Object Lock, notifications/EventBridge, CORS, presigned operations, multipart, replication, acceleration, endpoint/logging/retry considerations |
| Glacier | 10 | 0 | Storage class, owning bucket, restore tier/copy lifetime, lifecycle, KMS and restore/read permissions, retention and completion notifications |
| SQS | 26 | 3 | Standard/FIFO, queue timing/size/retention, DLQ/redrive, policy/encryption, groups/dedup/high-throughput controls, Lambda mapping/batching/partial failure/concurrency, idempotency and receipt handles |
| SNS | 14 | 8 | Topic variants, subscription protocol/endpoint/confirmation/raw delivery/filter scope/policy/DLQ, access/KMS, attributes/FIFO identity, protocol retry/log feedback and alarms |
| EventBridge | 13 | 19 | Bus/policy, repeated rules and targets, patterns/input transformation, target roles, delivery retry/age/DLQ, event tests, archives/replay, encryption and monitoring |
| Step Functions | 18 | 20 | Standard/Express, ASL and query language, role, task integrations, Retry/Catch, deadlines, data flow/Choice/Map, idempotency, logs/tracing/versions and synthetic input |

Total: **200 top-level fields and 151 repeated-row child fields**. Every field
receives official-source metadata and C03 skill mappings. Missing values have no
implicit configuration/default. Fields are tagged core/supporting/advanced.

The source array is a reviewed educational configuration vocabulary. An AWS
API/console feature can still have more fields and variant-specific restrictions.
No fixed field count is used as a claim that exam or service coverage is complete.

## Important distinctions for validation and practice

- **Lambda timeout:** this profile's 1–900 second setting describes the ordinary
  Event Function slice. Current Lambda documentation includes additional compute
  modes with different limits; do not apply this bound globally to every mode.
- **SQS -> Lambda:** function timeout must not exceed visibility timeout. AWS's
  recommendation to provide at least six times the function timeout (and account
  for batching) must be presented as a recommendation, not confused with the
  minimum API validation rule.
- **Lambda errors:** asynchronous maximum age/retry/destinations/DLQ are not the
  SQS event-source mapping's retry/redrive mechanism. A partial-batch checkbox
  cannot establish that the handler implements the required response contract.
- **Execution role vs invocation permission:** a downstream SDK permission does
  not authorize API Gateway to invoke a function, and vice versa.
- **API products:** HTTP API is not REST API with a different label. REST-only
  fields are conditionally displayed. Integrations, native authorizer types,
  caching, API keys, usage plans, body mapping, execution logs, X-Ray and WAF
  support must be evaluated against the selected product. A private backend
  integration does not make an HTTP API endpoint a private REST API endpoint.
- **DynamoDB:** GSI/stream reads cannot request strong consistency. LSI creation
  is tied to table creation; a new table and an existing table are different
  modification contexts. Query key conditions, filter expressions and pagination
  solve different problems. TTL expiry is not immediate deletion.
- **S3:** ACLs are not IAM policies and are disabled under BucketOwnerEnforced.
  Object Lock requires versioning and protects versions. CORS grants no object
  access. Presigned access cannot exceed signer authority/credential lifetime.
  Lifecycle, billing minimum duration, Object Lock and application retention are
  separate considerations. Live replication is not retroactive Batch Replication.
- **SQS FIFO:** ordering is scoped by message group. Content-based deduplication
  hashes the body, not message attributes. Consumer idempotency is still needed.
  Receipt handles are tied to each receipt and are not message IDs.
- **SNS:** filtering is per subscription and may target attributes or the JSON
  body. A deliberately filtered message is not a failed delivery/DLQ event.
  Subscription protocols, raw delivery and retry controls depend on topic/protocol.
- **EventBridge:** patterns select event fields and operators; not every AWS
  operator is necessarily evaluated locally. Target input mode, resource policy,
  execution role, retry and DLQ must be checked for the actual target service.
- **Step Functions:** Standard and Express differ in guarantees, integration
  support, execution history and duration. Retry may repeat external side effects.
  The service's official IAM feature table says **resource-based policies: No**;
  no generic state-machine resource-policy editor was added. Trust/caller/task
  permissions belong to the appropriate IAM role/identity policy instead.

## Exact numeric settings/defaults included

Verified queue console parameters: visibility 0–43,200 seconds (default30),
receive wait 0–20 seconds (default0), retention60–1,209,600 seconds (default345,600),
delay0–900 seconds (default0), maximum message size1–1024 KiB (default1024).
Lambda memory default128 MB and async event age60–21,600 seconds/default21,600
and retry range0–2/default2 were also verified in the specific feature/API docs.
Defaults are metadata for an explicit preset action, not values silently asserted
in an existing user's graph. Lambda memory and /tmp ranges are documented; no
arbitrary account concurrency default is assumed.

## Evidence directly opened during this task

- [Lambda configuration index](https://docs.aws.amazon.com/lambda/latest/dg/lambda-functions.html)
- [Lambda quotas](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html)
- [Lambda/SQS mapping](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-configure.html)
- [Lambda memory](https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html)
- [Lambda ephemeral storage](https://docs.aws.amazon.com/lambda/latest/dg/configuration-ephemeral-storage.html)
- [Lambda async configuration API](https://docs.aws.amazon.com/lambda/latest/api/API_PutFunctionEventInvokeConfig.html)
- [SnapStart](https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html)
- [API product comparison](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)
- [DynamoDB indexes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html)
- [DynamoDB consistency](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html)
- [S3 bucket naming](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html)
- [S3 bucket overview](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingBucket.html)
- [S3 lifecycle](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)
- [S3 Object Lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html)
- [S3 replication](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html)
- [SQS queue parameters](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-configure-queue-parameters.html)
- [SQS visibility](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html)
- [SQS receipt identifiers](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-queue-message-identifiers.html)
- [SNS filtering](https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html)
- [EventBridge patterns](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-pattern.html)
- [Step Functions states](https://docs.aws.amazon.com/step-functions/latest/dg/workflow-states.html)
- [Workflow types](https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html)
- [Step Functions IAM support](https://docs.aws.amazon.com/step-functions/latest/dg/security_iam_service-with-iam.html)

Each field also links its relevant feature guide. Not every linked subpage was
individually re-opened during this bounded task, and no AWS console/deployment was
executed. This distinction must remain visible in any overall coverage report.

## Verification

Standalone strict TypeScript compilation succeeds against `configurationTypes`.
An in-memory esbuild import confirmed all9 profiles, counts, unique top/row keys,
source metadata and objective metadata. `git diff --check` passes. Framework/UI,
cross-field behavior and full application tests are owned by the main task.
