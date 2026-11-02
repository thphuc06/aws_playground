import type {ConfigSource, JsonValue} from '../configurationTypes';

/** Additive ConfigField contract; kept local so this data module never imports the registry it enriches. */
export interface EventServiceNote {
  semantics: 'aws-setting' | 'application-intent' | 'exercise-input' | 'observed-output';
  documentation: {purpose: string; whenToUse: string; omission: string; effects: string[]; examples: {value: JsonValue; explanation: string}[]; relatedLessons: string[]};
  evidence: {status: 'reference-only' | 'needs-context'; sourceIds: string[]; scope: string};
  source: ConfigSource;
}
const checked = '2026-11-03';
const ref = (title: string, url: string): ConfigSource => ({title, url, verified: checked});
const L = 'https://docs.aws.amazon.com/lambda/latest/', A = 'https://docs.aws.amazon.com/apigateway/latest/developerguide/', Q = 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/', N = 'https://docs.aws.amazon.com/sns/latest/', E = 'https://docs.aws.amazon.com/eventbridge/latest/', F = 'https://docs.aws.amazon.com/step-functions/latest/', K = 'https://docs.aws.amazon.com/streams/latest/dev/';
/** Sources were read for this bounded note pass. They are not independent rule sign-off. */
export const eventNoteSources = {
  functionCreate: ref('Lambda deployment package and function contract', L + 'api/API_CreateFunction.html'),
  functionConfig: ref('Lambda version-specific configuration', L + 'api/API_UpdateFunctionConfiguration.html'),
  memory: ref('Lambda Event Function memory', L + 'dg/configuration-memory.html'),
  timeout: ref('Lambda timeout and compute variants', L + 'dg/configuration-timeout.html'),
  environment: ref('Lambda environment variables', L + 'dg/configuration-envvars.html'),
  temporary: ref('Lambda ephemeral storage', L + 'dg/configuration-ephemeral-storage.html'),
  vpc: ref('Lambda VPC connectivity', L + 'dg/configuration-vpc.html'),
  filesystem: ref('Lambda filesystem types', L + 'dg/configuration-filesystem.html'),
  concurrency: ref('Lambda concurrency controls', L + 'dg/lambda-concurrency.html'),
  mapping: ref('Event source mapping parameters', L + 'api/API_CreateEventSourceMapping.html'),
  sqsMapping: ref('SQS-specific Lambda mapping parameters', L + 'dg/services-sqs-parameters.html'),
  sqsConsumer: ref('Lambda SQS polling behavior', L + 'dg/with-sqs.html'),
  sqsScaling: ref('Lambda SQS mapping concurrency', L + 'dg/services-sqs-scaling.html'),
  sqsFailures: ref('Lambda SQS partial batch failures', L + 'dg/services-sqs-errorhandling.html'),
  destination: ref('Lambda asynchronous destinations and DLQs', L + 'dg/invocation-async-retain-records.html'),
  asyncErrors: ref('Lambda asynchronous retry ownership', L + 'dg/invocation-async-error-handling.html'),
  functionPractices: ref('Lambda application best practices', L + 'dg/best-practices.html'),
  functionMetrics: ref('Lambda CloudWatch metrics', L + 'dg/monitoring-metrics.html'),
  logs: ref('Lambda structured logs', L + 'dg/monitoring-cloudwatchlogs-logformat.html'),
  layers: ref('Lambda ZIP layers', L + 'dg/chapter-layers.html'),
  snapstart: ref('SnapStart supported formats and compatibility', L + 'dg/snapstart.html'),
  aliases: ref('Lambda versions and aliases', L + 'dg/configuration-aliases.html'),
  apiProducts: ref('HTTP and REST API feature differences', A + 'http-api-vs-rest.html'),
  routes: ref('API Gateway V2 routes', 'https://docs.aws.amazon.com/apigatewayv2/latest/api-reference/apis-apiid-routes.html'),
  integrations: ref('API Gateway V2 integrations', 'https://docs.aws.amazon.com/apigatewayv2/latest/api-reference/apis-apiid-integrations.html'),
  lambdaProxy: ref('HTTP API Lambda proxy payload contract', A + 'http-api-develop-integrations-lambda.html'),
  jwt: ref('HTTP API JWT authorizers', A + 'http-api-jwt-authorizer.html'),
  lambdaAuthorizer: ref('HTTP API Lambda authorizers', A + 'http-api-lambda-authorizer.html'),
  cors: ref('HTTP API CORS', A + 'http-api-cors.html'),
  stages: ref('HTTP API stages', A + 'http-api-stages.html'),
  usage: ref('REST usage plans', A + 'api-gateway-api-usage-plans.html'),
  validation: ref('REST request validation', A + 'api-gateway-method-request-validation.html'),
  parameters: ref('HTTP parameter mapping', A + 'http-api-parameter-mapping.html'),
  templates: ref('REST models and mappings', A + 'models-mappings.html'),
  cache: ref('REST API caching', A + 'api-gateway-caching.html'),
  privateIntegration: ref('HTTP private integration and VPC links', A + 'http-api-develop-integrations-private.html'),
  throttle: ref('API throttling targets', A + 'api-gateway-request-throttling.html'),
  apiLogs: ref('HTTP access logging', A + 'http-api-logging.html'),
  websocket: ref('WebSocket route and connection model', A + 'apigateway-websocket-api-overview.html'),
  queueAttributes: ref('SQS queue attributes', Q + 'APIReference/API_SetQueueAttributes.html'),
  queueCreate: ref('SQS queue identity and creation', Q + 'APIReference/API_CreateQueue.html'),
  queueDelay: ref('SQS delivery delay', Q + 'SQSDeveloperGuide/sqs-delay-queues.html'),
  polling: ref('SQS long and short polling', Q + 'SQSDeveloperGuide/sqs-short-and-long-polling.html'),
  fifoThroughput: ref('SQS high-throughput FIFO', Q + 'SQSDeveloperGuide/high-throughput-fifo.html'),
  queueEncryption: ref('SQS encryption at rest', Q + 'SQSDeveloperGuide/sqs-server-side-encryption.html'),
  visibility: ref('SQS processing visibility', Q + 'SQSDeveloperGuide/sqs-visibility-timeout.html'),
  queueDlq: ref('SQS dead-letter queues', Q + 'SQSDeveloperGuide/sqs-dead-letter-queues.html'),
  sendMessage: ref('SQS message identity and delay', Q + 'APIReference/API_SendMessage.html'),
  deleteMessage: ref('SQS receipt handles and deletion', Q + 'APIReference/API_DeleteMessage.html'),
  queueMetrics: ref('SQS CloudWatch metrics', Q + 'SQSDeveloperGuide/sqs-monitoring-using-cloudwatch.html'),
  subscription: ref('SNS subscription attributes', N + 'api/API_SetSubscriptionAttributes.html'),
  subscribe: ref('SNS subscription protocol and confirmation', N + 'api/API_Subscribe.html'),
  topicStatus: ref('SNS delivery-status logging', N + 'dg/sns-topic-attributes.html'),
  topicEncryption: ref('SNS encryption at rest', N + 'dg/sns-server-side-encryption.html'),
  topicMetrics: ref('SNS CloudWatch metrics', N + 'dg/sns-monitoring-using-cloudwatch.html'),
  topic: ref('SNS topic attributes', N + 'api/API_SetTopicAttributes.html'),
  publish: ref('SNS publish contract', N + 'api/API_Publish.html'),
  delivery: ref('SNS protocol-specific retries', N + 'dg/sns-message-delivery-retries.html'),
  subscriptionDlq: ref('SNS subscription DLQs', N + 'dg/sns-dead-letter-queues.html'),
  rule: ref('EventBridge Classic rule API', E + 'APIReference/API_PutRule.html'),
  target: ref('EventBridge Classic targets', E + 'APIReference/API_PutTargets.html'),
  targetRetry: ref('EventBridge target retry policy', E + 'APIReference/API_RetryPolicy.html'),
  archive: ref('EventBridge archive API', E + 'APIReference/API_CreateArchive.html'),
  bus: ref('EventBridge event bus configuration', E + 'APIReference/API_UpdateEventBus.html'),
  transformer: ref('EventBridge input transformations', E + 'userguide/eb-transform-target-input.html'),
  busPolicy: ref('Event bus permissions', E + 'userguide/eb-event-bus-perms.html'),
  eventMetrics: ref('EventBridge Classic monitoring', E + 'userguide/eb-monitoring.html'),
  pattern: ref('EventBridge event pattern syntax', E + 'userguide/eb-create-pattern.html'),
  workflow: ref('Standard and Express workflows', F + 'dg/choosing-workflow-type.html'),
  task: ref('Step Functions Task state', F + 'dg/state-task.html'),
  errors: ref('Step Functions error handling', F + 'dg/concepts-error-handling.html'),
  errorExample: ref('Step Functions error routing example', F + 'dg/tutorial-handling-error-conditions.html'),
  resultPath: ref('Step Functions JSONPath result placement', F + 'dg/input-output-resultpath.html'),
  integrationPatterns: ref('Step Functions integration-pattern support', F + 'dg/connect-to-resource.html'),
  jsonata: ref('Step Functions JSONata', F + 'dg/transforming-data.html'),
  inputOutput: ref('Step Functions JSONPath processing', F + 'dg/input-output-inputpath-params.html'),
  choice: ref('Step Functions Choice state', F + 'dg/state-choice.html'),
  map: ref('Step Functions Map modes', F + 'dg/state-map.html'),
  workflowLogs: ref('Step Functions execution logging', F + 'dg/cw-logs.html'),
  stateMachine: ref('CreateStateMachine contract', F + 'apireference/API_CreateStateMachine.html'),
  execution: ref('StartExecution idempotency and identity', F + 'apireference/API_StartExecution.html'),
  stream: ref('Kinesis stream and consumer concepts', K + 'key-concepts.html'),
  kcl: ref('Kinesis Client Library consumers', K + 'developing-consumers-with-kcl.html'),
  streamCreate: ref('CreateStream capacity model', 'https://docs.aws.amazon.com/kinesis/latest/APIReference/API_CreateStream.html'),
  iterator: ref('Kinesis shard iterator position', 'https://docs.aws.amazon.com/kinesis/latest/APIReference/API_GetShardIterator.html'),
  retention: ref('Kinesis record retention', K + 'kinesis-extended-retention.html'),
  streamMetrics: ref('Kinesis stream and shard metrics', K + 'monitoring-with-cloudwatch.html'),
  streamEncryption: ref('Kinesis data protection', K + 'server-side-encryption.html'),
} as const;
type SourceId = keyof typeof eventNoteSources;
type Row = [path: string, purpose: string, when: string, omission: string, effect: string, value: JsonValue, exampleReason: string, semantics?: EventServiceNote['semantics']];
const notes = (source: SourceId, lesson: string, scope: string, rows: Row[]): Record<string, EventServiceNote> => Object.fromEntries(rows.map(([path, purpose, whenToUse, omission, effect, value, explanation, semantics = 'aws-setting']) => [path, {semantics, documentation: {purpose, whenToUse, omission, effects: [effect], examples: [{value, explanation}], relatedLessons: [lesson]}, evidence: {status: semantics === 'aws-setting' ? 'reference-only' : 'needs-context', sourceIds: [source], scope}, source: eventNoteSources[source]}]));
const local = (id: string): JsonValue => ({type: 'node', id});
const role = (id: string): JsonValue => ({type: 'role', id});
const grant = (principal: JsonValue, action: string, resource: string, sourceArn?: string): string => JSON.stringify({Version: '2012-10-17', Statement: [{Effect: 'Allow', Principal: principal, Action: action, Resource: resource, ...(sourceArn ? {Condition: {ArnEquals: {'aws:SourceArn': sourceArn}}} : {})}]});

/** Every row is authored for its field; the helper only packages explicit content. */
export const eventServiceNotes: Record<string, Record<string, EventServiceNote>> = {
  lambda: {
    ...notes('functionCreate', 'dev-lambda', 'Ordinary Event Function package contract; this editor does not create functions.', [
      ['packageType', 'Select the deployment artifact format.', 'Choose before Runtime, Handler, layers or image overrides.', 'Artifact format remains undecided.', 'ZIP and image packaging require different build outputs.', 'Zip', 'Use a ZIP artifact when deploying handler files and compatible dependencies.'],
      ['runtime', 'Identify the managed language environment.', 'For ZIP packages, check current support and dependency compatibility.', 'No runtime is selected by the editor.', 'An unsupported runtime can block a real deployment.', 'python3.12', 'An illustrative identifier; verify its lifecycle for the deployment date.'],
      ['handler', 'Locate the function entry point.', 'Match the packaged module and callable for the chosen runtime.', 'The ZIP entry point is unresolved.', 'A filename or callable mismatch produces invocation failures.', 'app.handler', 'Names a handler callable in an app module for a Python ZIP example.'],
      ['architecture', 'Choose the instruction set.', 'Check native libraries and layers before switching architecture.', 'Compatibility has not been established.', 'Rebuild native dependencies for the selected target.', 'arm64', 'Use only with an artifact built and tested for this instruction set.'],
      ['imageUri', 'Identify the deployable image.', 'For Image packages, use an approved ECR artifact.', 'No image artifact is identified.', 'Changing a tag elsewhere does not document which artifact was reviewed.', '111122223333.dkr.ecr.us-east-1.amazonaws.com/worker:reviewed', 'Synthetic repository reference; record the resolved digest in release evidence.'],
    ]),
    ...notes('memory', 'measure-optimize', 'Memory guidance for ordinary Event Functions; account capacity is not queried.', [
      ['memoryMb', 'Allocate function memory and associated CPU.', 'Compare representative duration and memory use before choosing.', 'Memory remains unknown, not an asserted default.', 'A larger allocation can change both duration and billed resource use.', 512, 'A measurement candidate, not a universal optimum.'],
    ]),
    ...notes('timeout', 'dev-lambda', 'Ordinary Event Functions use the modeled deadline; Managed Instances have separate limits and invocation conditions.', [
      ['timeoutSeconds', 'Bound the function execution deadline.', 'Fit realistic processing plus downstream deadlines into the caller contract.', 'No deadline decision is recorded.', 'Timing out does not roll back completed external side effects.', 30, 'Compare against measured tail latency and the upstream integration timeout.'],
    ]),
    ...notes('temporary', 'dev-lambda', 'Temporary /tmp storage, not persistent application state.', [
      ['ephemeralStorageMb', 'Allocate temporary working space.', 'Size for downloaded files, decompression and intermediate output.', 'Scratch-space demand has not been assessed.', 'Do not depend on later invocations reusing local files.', 1024, 'A one-GiB workspace candidate for a measured file-processing task.'],
    ]),
    ...notes('environment', 'security-sensitive-data', 'Version-specific literal environment strings; do not enter secrets in the playground.', [
      ['environmentVariables', 'Pass nonsecret runtime configuration.', 'Use for flags and logical references read by application code.', 'No environment map is declared.', 'Values are literal strings; code must perform any parsing.', {APP_ENV: 'study'}, 'Separates deployment context without embedding credentials.'],
      ['environmentKmsKey', 'Select a customer-managed encryption key.', 'Choose when the environment encryption ownership policy requires it.', 'Customer-managed key use is not asserted.', 'Key authorization and lifecycle can affect function operation.', local('environment-key'), 'A logical key reference; actual permissions still need review.'],
    ]),
    ...notes('functionConfig', 'security-iam-sts', 'Configuration intent and role/resource-policy boundaries; references are not deployed ARNs.', [
      ['executionRole', 'Select the identity used by function code.', 'Trace each downstream API call to its required action and resource.', 'Downstream permissions remain unknown.', 'This role does not itself grant an external caller invocation permission.', role('worker-role'), 'Attach only the permissions the worker code needs.'],
      ['resourcePolicy', 'Describe who may invoke the function.', 'Review service or cross-account callers independently from execution permissions.', 'Caller grants are not assumed.', 'A canvas connection does not authorize invocation.', grant({Service: 'apigateway.amazonaws.com'}, 'lambda:InvokeFunction', 'arn:aws:lambda:us-east-1:111122223333:function:worker', 'arn:aws:execute-api:us-east-1:111122223333:example/test/POST/orders'), 'Synthetic invocation grant; replace and review the exact source and function ARNs.'],
      ['imageConfig', 'Record image entry-point overrides.', 'Use only when the reviewed image needs command or working-directory changes.', 'No overrides are declared.', 'The editor map is not the typed ImageConfig array structure.', {Command: 'app.handler'}, 'Planning representation only; translate and validate the actual image configuration.', 'application-intent'],
      ['tracingMode', 'Choose trace sampling behavior.', 'Use Active when the workload should initiate supported tracing.', 'Trace initiation mode is unresolved.', 'Trace delivery also depends on permissions and instrumentation.', 'Active', 'Plan useful trace context without assuming every invocation is sampled.'],
    ]),
    ...notes('layers', 'release-artifacts', 'ZIP layer references and packaging decisions; image dependencies belong in the image.', [
      ['layers', 'List versioned shared ZIP dependencies.', 'Use when multiple ZIP functions consume an approved package.', 'No layer attachments are asserted.', 'Layer compatibility follows runtime and architecture.', [{versionArn: 'arn:aws:lambda:us-east-1:111122223333:layer:shared:3', purpose: 'Pinned utilities'}], 'Synthetic versioned layer example; package and permissions must be checked.'],
      ['layers.versionArn', 'Pin the exact layer version.', 'Record the version reviewed with the function artifact.', 'The layer dependency cannot be reproduced.', 'A different version can change behavior without changing handler code.', 'arn:aws:lambda:us-east-1:111122223333:layer:shared:3', 'Includes a version suffix rather than an unversioned layer name.'],
      ['layers.purpose', 'Explain why this dependency is attached.', 'Record ownership and what the layer supplies.', 'The dependency rationale is missing.', 'Reviewers can spot redundant or obsolete packages.', 'Shared serialization helpers', 'A maintenance note, not an AWS layer attribute.', 'application-intent'],
      ['extensions', 'Describe runtime extension dependencies.', 'Document telemetry/security extensions and packaging ownership.', 'No extension plan is recorded.', 'Extensions add work and must fit resource budgets.', 'Telemetry extension packaged with the approved artifact', 'Review overhead alongside handler latency.', 'application-intent'],
    ]),
    ...notes('snapstart', 'dev-lambda', 'Check current runtime, package, Region and feature combinations; supported container formats exist in current documentation.', [
      ['snapStart', 'Plan snapshot-assisted startup.', 'Check supported runtime/format and initialization uniqueness before enabling.', 'Snapshot behavior is undecided.', 'Restored state needs uniqueness review; do not combine unsupported features.', true, 'A proposal requiring compatibility review, not proof that snapshots exist.'],
    ]),
    ...notes('vpc', 'dev-lambda', 'VPC configuration for private-resource access; row pairs are an editor representation, not user-managed Lambda ENIs.', [
      ['vpc', 'Identify private network ownership.', 'Use when the function must reach resources inside a VPC.', 'Private connectivity is not asserted.', 'VPC attachment alone does not provide internet egress.', local('application-vpc'), 'Choose the VPC that owns the intended private destination.'],
      ['networkInterfaces', 'Describe subnet and security-group attachments.', 'Choose network reachability for private dependencies.', 'No subnet/security-group combination is declared.', 'Lambda manages networking resources; this table does not create an ENI.', [{subnetReference: 'private-a', securityGroupReference: 'worker-sg'}], 'Review subnet routes and the shared security group together.', 'application-intent'],
      ['networkInterfaces.subnetReference', 'Identify a subnet for function networking.', 'Use a compatible subnet in the selected VPC.', 'Subnet placement remains unresolved.', 'Address capacity and routes affect connectivity.', 'private-a', 'A logical subnet ID, not a statement that the subnet exists.'],
      ['networkInterfaces.securityGroupReference', 'Identify the attached security group.', 'Select rules that permit the intended dependency traffic.', 'No traffic allowance is asserted.', 'Attachment is distinct from referencing another group as a rule peer.', 'worker-sg', 'Reuse a shared group instead of copying its rules.'],
    ]),
    ...notes('filesystem', 'dev-lambda', 'Current editor exposes an EFS planning slice; S3 Files is a separate supported AWS type outside this picker.', [
      ['fileSystems', 'Describe shared filesystem mounts.', 'Use for files that must be shared beyond one temporary environment.', 'No filesystem mount is declared.', 'Filesystem type, access identity and networking require separate validation.', [{fileSystem: local('shared-efs'), localMountPath: '/mnt/shared'}], 'EFS planning example; resolve an appropriate access point before deployment.'],
      ['fileSystems.fileSystem', 'Reference the shared filesystem.', 'Select the EFS dependency and identify the actual access point separately.', 'The mounted resource is unknown.', 'A filesystem node alone is not the access-point ARN expected by deployment.', local('shared-efs'), 'A design reference requiring deployment-specific resolution.'],
      ['fileSystems.localMountPath', 'Choose the runtime mount location.', 'Keep application file paths consistent with the mount.', 'Code cannot assume a configured mount path.', 'Distinguish shared files from ephemeral /tmp data.', '/mnt/shared', 'Use this same path in the application file-access configuration.'],
    ]),
    ...notes('concurrency', 'measure-optimize', 'Reserved and provisioned concurrency are different controls; account capacity and alias context remain external.', [
      ['reservedConcurrency', 'Reserve and cap function concurrency.', 'Use to isolate capacity and protect bounded downstream resources.', 'No function reservation is asserted.', 'Zero is operationally significant and stops ordinary processing.', 10, 'Compare ten concurrent workers with downstream connection capacity.'],
      ['provisionedConcurrency', 'Plan pre-initialized execution capacity.', 'Use for a qualified version/alias with a measured latency requirement.', 'No warm capacity is asserted.', 'This adds capacity cost and is not an execution concurrency cap.', 5, 'The editor still needs the intended alias/version context.'],
    ]),
    ...notes('mapping', 'dev-events', 'Event source mapping fields depend on source type; this table is not a complete mapping request.', [
      ['invocationType', 'Identify invocation and retry ownership.', 'Choose direct, asynchronous or polling integration.', 'Retry ownership is unresolved.', 'Invocation paths need different failure controls.', 'event-source-mapping', 'For configured queue or stream polling.', 'application-intent'],
      ['eventSourceMappings', 'List poll-based event integrations.', 'Connect each supported source to its consumer configuration.', 'No poller is declared.', 'A graph arrow alone does not create a mapping.', [{source: local('work-queue'), enabled: true}], 'A partial queue mapping that still needs batch and permission review.'],
      ['eventSourceMappings.source', 'Select the polled source.', 'Resolve the queue, stream or other supported source ARN.', 'The mapping has no source.', 'Source type controls allowed batch and retry fields.', local('work-queue'), 'Use the existing queue instance to retain dependency identity.'],
      ['eventSourceMappings.enabled', 'Choose whether the mapping polls.', 'Separate deployment of a mapping from activation.', 'Enabled state is unknown in this editor.', 'Disabling polling is different from deleting retained messages.', false, 'Pause this source while repairing the consumer.'],
      ['eventSourceMappings.filterCriteria', 'Select records before handler invocation.', 'Define filters using the source event envelope.', 'No filter is declared.', 'Filtered-record treatment depends on the source integration.', JSON.stringify({Filters: [{Pattern: JSON.stringify({body: {kind: ['invoice']}})}]}), 'SQS-body illustration; do not reuse the envelope for a stream source.'],
      ['eventSourceMappings.startingPosition', 'Choose a stream starting point.', 'Use only for source types that support this parameter.', 'Initial replay position is unresolved.', 'Starting later can skip retained historical work.', 'TRIM_HORIZON', 'Stream example; this is not an SQS setting.'],
    ]),
    ...notes('sqsMapping', 'dev-events', 'SQS mapping slice: standard/FIFO constraints differ; handler implementation is still required.', [
      ['eventSourceMappings.batchSize', 'Bound records delivered per invocation.', 'Choose after queue type, payload size and processing cost.', 'The mapping batch choice is unknown.', 'A larger batch can increase duration and failure impact.', 10, 'Fits the modeled FIFO batch bound; payload constraints still apply.'],
      ['eventSourceMappings.batchWindowSeconds', 'Allow collection time before invocation.', 'For supported standard-queue batching; FIFO has no batching window.', 'No waiting-window choice is asserted.', 'Waiting trades invocation efficiency for delivery latency.', 1, 'A standard-queue example, not a FIFO configuration.'],
    ]),
    ...notes('sqsFailures', 'dev-events', 'Partial-batch response behavior needs matching handler implementation and FIFO ordering review.', [
      ['eventSourceMappings.reportBatchItemFailures', 'Enable partial-batch response handling.', 'Pair with a handler that reports failed message IDs correctly.', 'Partial failure reporting is not asserted.', 'A checkbox cannot implement the response contract.', true, 'Add handler tests for mixed success and failure in one batch.'],
    ]),
    ...notes('sqsScaling', 'dev-events', 'Maximum concurrency is a mapping control; it cannot be combined with provisioned polling mode.', [
      ['eventSourceMappings.maximumConcurrency', 'Limit this SQS mapping concurrency.', 'Coordinate with function reservation and other event sources.', 'Source-level concurrency remains unspecified.', 'An excessive value can overload downstream processing.', 5, 'A source budget within the intended function capacity.'],
    ]),
    ...notes('asyncErrors', 'dev-events', 'Asynchronous retries are separate from SQS redrive and stream retry policies.', [
      ['maximumEventAgeSeconds', 'Bound asynchronous event age.', 'Choose the oldest work that remains useful to the application.', 'The intended discard age is unknown.', 'Stale work may need investigation rather than further execution.', 3600, 'A one-hour business freshness budget for asynchronous requests.'],
      ['maximumRetryAttempts', 'Bound asynchronous function-error retries.', 'Use when retrying a function error may recover safely.', 'No retry-count decision is recorded.', 'Duplicate side effects still require application protection.', 1, 'Allow one retry for the modeled asynchronous path.'],
    ]),
    ...notes('destination', 'dev-events', 'Asynchronous invocation outcome routing; separate from SQS redrive and stream mapping retry policies.', [
      ['destinations', 'Retain asynchronous outcome records.', 'Choose separate success/failure routing where needed.', 'No destination is declared.', 'Outcome records carry more context than a DLQ original event.', [{condition: 'OnFailure', target: local('failure-queue')}], 'Failure investigation route; destination permissions remain necessary.'],
      ['destinations.condition', 'Select the outcome to route.', 'Choose OnFailure for exhausted attempts or OnSuccess for completed processing.', 'Destination condition is unresolved.', 'Success logging and failure recovery serve different needs.', 'OnFailure', 'Capture exhausted asynchronous work for diagnosis.'],
      ['destinations.target', 'Select a supported destination.', 'Check destination type, permissions and payload handling.', 'The outcome record has nowhere declared to go.', 'Delivery to the destination can fail independently.', local('failure-queue'), 'A standard queue planning reference, not a delivery guarantee.'],
      ['deadLetterQueue', 'Retain discarded original asynchronous events.', 'Choose when the original event is the recovery artifact.', 'No asynchronous DLQ is declared.', 'Do not confuse this with the queue source own redrive policy.', local('async-dlq'), 'Compare DLQ content with the richer destination record before choosing.'],
    ]),
    ...notes('functionPractices', 'dev-data-safety', 'Application logic is not configured or executed by saving these notes.', [
      ['idempotencyStrategy', 'Prevent repeated business side effects.', 'Define a stable operation key and durable outcome handling.', 'Duplicate-processing safety is unproven.', 'Retries can repeat external actions even with delivery controls.', 'Persist invoiceId with a conditional outcome write', 'An application design requiring implementation and failure tests.', 'application-intent'],
    ]),
    ...notes('aliases', 'progressive-release', 'Alias/version rollout intent; no publication or traffic shift occurs in the playground.', [
      ['versionsAndAliases', 'Describe stable deployment entry points.', 'Connect callers to a reviewed alias/version strategy.', 'No release reference is recorded.', 'Changing an alias can change traffic without changing callers.', [{alias: 'live', version: '7'}], 'A synthetic published-version target.'],
      ['versionsAndAliases.alias', 'Name the caller-facing alias.', 'Use a stable environment/release name.', 'Callers have no chosen alias.', 'Keep invocation grants aligned with the qualified target.', 'live', 'A stable alias name distinct from a numeric function version.'],
      ['versionsAndAliases.version', 'Select the primary published version.', 'Use the immutable artifact that passed verification.', 'The release target is unresolved.', 'A version reference must correspond to a real published artifact.', '7', 'Illustrative version identifier, not a publication result.'],
      ['versionsAndAliases.additionalVersionWeight', 'Plan a secondary traffic fraction.', 'Use for a supported weighted-alias rollout.', 'No secondary weight is asserted.', 'Observe errors and latency for both versions during rollout.', 0.1, 'A ten-percent candidate allocation, not a guaranteed request count.'],
      ['versionsAndAliases.additionalVersion', 'Select the secondary release candidate.', 'Pair with a deliberate traffic weight and rollback plan.', 'No secondary version is identified.', 'The candidate needs independent compatibility verification.', '8', 'A synthetic next version alongside primary version 7.'],
    ]),
    ...notes('logs', 'observe-debug', 'Log format/filter guidance; runtime/logging-library support and permissions remain context.', [
      ['logGroup', 'Identify the log destination.', 'Choose retention and access alongside the function logs.', 'The destination is not asserted.', 'Logging permissions and destination ownership still matter.', local('worker-logs'), 'A shared graph log-group reference.'],
      ['logFormat', 'Choose structured or text logs.', 'Prefer a format supported by the runtime and analysis tools.', 'No format choice is recorded.', 'Structured fields improve queries but do not remove sensitive data.', 'JSON', 'Test parsing and safe fields in the log consumer.'],
      ['applicationLogLevel', 'Choose application log filtering.', 'Use with supported JSON logging and runtime methods.', 'No filtering level is asserted.', 'Overly restrictive filtering can hide diagnostic evidence.', 'INFO', 'A baseline to compare with targeted debugging needs.'],
    ]),
    ...notes('functionMetrics', 'observe-debug', 'These monitoring design rows are not CloudWatch alarm resources.', [
      ['alarms', 'Describe actionable function signals.', 'Choose symptoms tied to a response owner.', 'No monitoring response is planned.', 'A metric list without evaluation and actions is not a deployed alarm.', [{metric: 'Errors', condition: 'Investigate sustained errors', notification: local('ops-topic')}], 'A monitoring design requiring a concrete CloudWatch alarm.', 'application-intent'],
      ['alarms.metric', 'Identify the signal to investigate.', 'Separate errors, duration, throttling and destination delivery failures.', 'The alarm signal is unspecified.', 'Choose dimensions that isolate the intended workload.', 'Errors', 'Pair with invocation volume before interpreting severity.', 'application-intent'],
      ['alarms.condition', 'Describe the response threshold.', 'State period, statistic and missing-data intent in the actual alarm.', 'No evaluation condition is defined.', 'A prose condition is not a CloudWatch expression.', 'Sustained error rate above the service objective', 'Turn this intent into a tested alarm configuration.', 'application-intent'],
      ['alarms.notification', 'Identify the response destination.', 'Route actionable findings to the responsible workflow.', 'No response owner is connected.', 'An unused notification target does not provide recovery.', local('ops-topic'), 'A logical notification route to verify separately.', 'application-intent'],
    ]),
  },
  api: {
    ...notes('apiProducts', 'dev-application', 'HTTP, REST and WebSocket are separate products; product selection is not a universal API property.', [
      ['apiType', 'Choose the API product.', 'Start with authentication, management and connection requirements.', 'Product-specific compatibility cannot be assessed.', 'Changing product changes available integrations and controls.', 'http', 'Choose only after checking required REST-only features.'],
      ['endpointType', 'Choose REST endpoint exposure.', 'Distinguish Regional, edge-optimized and private REST endpoints.', 'REST endpoint exposure is undecided.', 'A private backend integration is a different boundary.', 'REGIONAL', 'A Regional REST endpoint is not an HTTP API product choice.'],
      ['resourcePolicy', 'Define REST resource access.', 'Scope the caller/account boundary.', 'No resource grant is asserted.', 'Not native HTTP API authorization.', grant({AWS: 'arn:aws:iam::111122223333:role/api-client'}, 'execute-api:Invoke', 'arn:aws:execute-api:us-east-1:111122223333:example/test/GET/orders'), 'Synthetic REST grant; review identity permissions too.'],
      ['wafWebAcl', 'Identify supported web-request filtering.', 'For the modeled REST API association, review Web ACL scope.', 'No WAF association is asserted.', 'Filtering does not replace caller authorization.', local('api-web-acl'), 'REST planning reference; do not apply directly to an HTTP API.'],
      ['xrayTracing', 'Plan supported API tracing.', 'Use the REST tracing feature and downstream trace propagation.', 'Tracing is not assumed.', 'HTTP API access logs do not become X-Ray tracing through this switch.', true, 'REST example requiring appropriate tracing configuration.'],
    ]),
    ...notes('routes', 'dev-application', 'HTTP route concepts; REST requires resource/method configuration and separate deployment mapping.', [
      ['routes', 'List client-facing operations.', 'Model routes separately when backend or authorization differs.', 'The request surface is undefined.', 'An integration without a matching deployed route is insufficient.', [{routeKey: 'POST /orders', backendResource: local('order-worker')}], 'A partial HTTP route needing integration and authorization review.'],
      ['routes.routeKey', 'Match a request to an operation.', 'For HTTP, combine method and path; review catch-all routes deliberately.', 'No route selector is defined.', 'A typo or wrong method can bypass the intended integration.', 'POST /orders', 'Test this operation separately from GET /orders.'],
      ['routes.authorizer', 'Associate route authorization.', 'Resolve the authorizer identity for this operation.', 'No route authorizer is selected.', 'Creating an authorizer alone does not protect every route.', 'customer-jwt', 'The editor name must resolve to the intended deployed authorizer.'],
      ['httpAuthorization', 'Plan HTTP route authorization mode.', 'Apply the chosen mechanism to each protected route.', 'The HTTP authorization policy remains undecided.', 'A top-level editor choice is not proof of deployed route settings.', 'JWT', 'Use with issuer/audience configuration and route-level requirements.', 'application-intent'],
      ['restAuthorization', 'Plan REST method authorization mode.', 'Select IAM, Cognito or custom logic for each method.', 'The REST authorization policy remains undecided.', 'REST Cognito authorization differs from HTTP native JWT authorizers.', 'COGNITO_USER_POOLS', 'Resolve the user pool and method requirements separately.', 'application-intent'],
    ]),
    ...notes('integrations', 'dev-application', 'Integration mapping requires the selected API product and backend contract; graph references need deployment resolution.', [
      ['integration', 'Choose the backend integration family.', 'Compare proxy, service and private integration requirements.', 'The backend family is undecided.', 'This summary does not replace per-route integration settings.', 'lambda', 'Plan Lambda request/response and invocation permissions.', 'application-intent'],
      ['routes.backendUri', 'Identify the deployment integration endpoint.', 'Use the product-specific URI or ARN form.', 'No actual integration endpoint is declared.', 'An arbitrary URL is not valid for every integration type.', 'https://backend.example/orders', 'Synthetic HTTP backend example, not a Lambda integration ARN.'],
      ['routes.integrationType', 'Choose proxy or non-proxy behavior.', 'Match the product and who owns request/response transformation.', 'Integration semantics remain unresolved.', 'A REST integration enum cannot be assumed valid for HTTP.', 'AWS_PROXY', 'An HTTP Lambda-proxy candidate requiring the corresponding backend URI.'],
      ['integrationRole', 'Identify an assumed integration identity.', 'Use only where the integration supports or requires credentials.', 'No role-based integration grant is asserted.', 'Lambda invocation resource policy is a different authorization path.', role('gateway-integration'), 'Resolve the actual integration role rather than reusing the function role.'],
      ['integrationTimeoutMs', 'Bound gateway waiting time.', 'Check product, integration and applicable quota before choosing.', 'No gateway deadline is selected.', 'Gateway timeout does not establish rollback of backend work.', 10000, 'A ten-second caller budget independent of function timeout.'],
    ]),
    ...notes('lambdaProxy', 'dev-application', 'HTTP API Lambda proxy input and output contracts; not a universal REST payload setting.', [
      ['routes.backendResource', 'Identify the logical backend.', 'Prefer a graph reference when the backend is modeled.', 'The route target is unresolved.', 'Resource identity alone does not create an integration URI.', local('order-worker'), 'Preserves the intended worker when labels change.', 'application-intent'],
      ['routes.payloadFormatVersion', 'Select the Lambda proxy envelope.', 'Align handler parsing and responses with HTTP API format.', 'Handler compatibility is unknown.', 'Versions 2.0 and 1.0 expose different event shapes.', '2.0', 'Test the handler with this actual envelope.'],
    ]),
    ...notes('jwt', 'security-cognito', 'Native HTTP JWT authorizers; route scopes are modeled as intent under this editor authorizer table.', [
      ['authorizers', 'Define reusable caller checks.', 'Create distinct authorizers for distinct trust boundaries.', 'No authorizer definition is supplied.', 'Each protected route must refer to the intended definition.', [{name: 'customer-jwt', type: 'JWT', issuer: 'https://identity.example', audience: 'study-app'}], 'Synthetic HTTP JWT setup; the issuer must actually support the contract.'],
      ['authorizers.name', 'Label the authorization definition.', 'Choose a name reflecting the identity provider or policy boundary.', 'Route references cannot identify this definition.', 'Renaming requires reviewing logical references.', 'customer-jwt', 'A descriptive lookup label, not an authorization grant.'],
      ['authorizers.issuer', 'Identify the trusted JWT issuer.', 'Match tokens from the intended identity provider.', 'Issuer trust is unspecified.', 'A valid signature from another issuer is insufficient.', 'https://identity.example', 'Synthetic issuer; deployment needs the actual configured issuer.'],
      ['authorizers.audience', 'Identify intended token recipients.', 'Use approved API/client audience identifiers.', 'Accepted audience is unspecified.', 'Tokens intended for a different application must not be accepted accidentally.', 'study-app', 'A synthetic application audience for the token contract.'],
      ['authorizers.scopes', 'Plan route access requirements.', 'Apply required scopes on routes, not as an authorizer-global allowlist.', 'No scope requirement is documented.', 'Use access-token semantics appropriate to the provider.', 'orders:write', 'Attach this requirement to the write route during deployment.', 'application-intent'],
    ]),
    ...notes('lambdaAuthorizer', 'security-iam-sts', 'Lambda authorizer payload and caching vary by HTTP/REST; token values never belong in this configuration.', [
      ['authorizers.type', 'Select an authorizer mechanism.', 'Choose a type supported by the selected API product.', 'Authorizer processing remains unknown.', 'JWT, Cognito, REQUEST and TOKEN are not interchangeable.', 'REQUEST', 'An HTTP Lambda-authorizer example requiring a matching payload contract.'],
      ['authorizers.identitySource', 'Locate caller identity input.', 'Declare the header/expression the authorizer uses.', 'The caller input location is unresolved.', 'Missing required identity input can prevent authorization processing.', '$request.header.Authorization', 'HTTP expression identifying a header, not an actual bearer token.'],
      ['authorizers.lambdaAuthorizer', 'Identify authorization code.', 'Use for custom caller checks beyond native provider validation.', 'No authorizer function is linked.', 'API Gateway needs permission to invoke this function.', local('auth-worker'), 'Keep this identity separate from the business handler.'],
      ['authorizers.cacheTtlSeconds', 'Control authorization-result reuse.', 'Review cache keys and stale-permission tolerance.', 'Authorization caching intent is unspecified.', 'A result reused across routes can be broader than intended.', 0, 'A no-result-cache candidate when each request needs fresh evaluation.'],
    ]),
    ...notes('cors', 'dev-application', 'Browser CORS is separate from authentication; HTTP API CORS is API-level and table rows are an editor representation.', [
      ['cors', 'Describe browser cross-origin access.', 'Use when frontend and API origins differ.', 'No browser CORS policy is declared.', 'CORS does not restrict non-browser clients.', [{allowOrigin: 'https://study.example', allowMethods: 'GET,POST', allowHeaders: 'content-type'}], 'A synthetic browser client contract.'],
      ['cors.allowOrigin', 'Identify an allowed frontend origin.', 'Include scheme, host and relevant port.', 'No origin allowance is specified.', 'Credentialed access needs an appropriately scoped origin.', 'https://study.example', 'A specific synthetic frontend origin.'],
      ['cors.allowMethods', 'List browser-allowed methods.', 'Match the actual frontend requests and preflight needs.', 'Allowed methods are undecided.', 'A CORS method allowance does not create a route.', 'GET,POST', 'Review both methods against deployed routes.'],
      ['cors.allowHeaders', 'List allowed browser request headers.', 'Include headers used by the approved frontend contract.', 'Required-header support is unresolved.', 'A preflight can fail before the application request is sent.', 'content-type,authorization', 'Header names only; never store credentials here.'],
      ['cors.allowCredentials', 'Plan credentialed browser requests.', 'Enable only when the frontend actually requires credentials.', 'Credential handling is unspecified.', 'Coordinate this with origin selection and client behavior.', false, 'A candidate for a frontend that does not send browser credentials.'],
      ['cors.maxAgeSeconds', 'Plan preflight response caching.', 'Balance repeated preflight overhead with policy-change propagation.', 'Preflight-cache duration is undecided.', 'Browsers can continue using cached preflight decisions.', 300, 'A five-minute candidate to review against policy rollout needs.'],
    ]),
    ...notes('stages', 'release-environments', 'HTTP stages and automatic deployment differ from REST deployments.', [
      ['stages', 'Describe deployment environments.', 'Separate callable stage names and rollout ownership.', 'No deployed stage is represented.', 'Saved route edits are not a completed deployment.', [{name: 'test', autoDeploy: false}], 'A controlled HTTP test stage.'],
      ['stages.name', 'Name the callable stage.', 'Use a stable environment name or supported $default stage.', 'No stage name is selected.', 'Stage choice affects endpoint and integration path context.', 'test', 'A named stage whose URL and backend path should be tested.'],
      ['stages.autoDeploy', 'Choose HTTP automatic deployment.', 'Enable only when route edits may publish without a separate deployment action.', 'Deployment mode is unknown.', 'Do not apply this HTTP feature as a REST stage switch.', false, 'Keep an explicit release step for the example stage.'],
      ['stages.stageVariables', 'Pass nonsecret stage references.', 'Use only where the product/integration consumes those values.', 'No stage-variable map is declared.', 'Variables do not store or fetch secret values safely by themselves.', {environment: 'test'}, 'A nonsecret selector to resolve deliberately in the integration.'],
      ['stages.deploymentId', 'Select a deployment snapshot.', 'Record the deployment intended for the stage.', 'The published snapshot is unresolved.', 'An identifier in the editor does not prove deployment success.', 'deployment-example', 'A synthetic reference requiring a real deployment result.'],
    ]),
    ...notes('throttle', 'measure-optimize', 'Rate and burst are best-effort throttling targets, not guaranteed spending or security ceilings.', [
      ['throttling', 'Describe scoped request-rate controls.', 'Choose stage/method/route scope for the selected API product.', 'No rate-control plan is recorded.', 'Account and service controls also apply.', [{route: 'POST /orders', rateLimit: 20, burstLimit: 40}], 'A workload budget to compare with backend capacity.'],
      ['throttling.route', 'Identify the throttle scope.', 'Use the exact operation or supported default scope.', 'The override target is ambiguous.', 'The same rate applied at another scope changes its impact.', 'POST /orders', 'Protect the write operation separately from cheap reads.'],
      ['throttling.rateLimit', 'Plan sustained request rate.', 'Relate rate to measured dependency capacity.', 'No sustained-rate target is chosen.', 'Clients need bounded handling for throttled responses.', 20, 'Twenty requests/second is a test candidate, not a guaranteed maximum.'],
      ['throttling.burstLimit', 'Plan short request bursts.', 'Choose spare capacity for short-lived spikes.', 'Burst handling is unspecified.', 'A burst can exhaust backend concurrency despite modest average traffic.', 40, 'Validate this burst against the worker concurrency budget.'],
    ]),
    ...notes('usage', 'dev-application', 'REST usage plans meter client use; API keys are not user authentication.', [
      ['routes.apiKeyRequired', 'Require a usage-plan key on the REST method.', 'Use alongside real authentication where client metering is needed.', 'A usage-plan key requirement is not asserted.', 'A supplied key alone does not establish user identity.', true, 'REST metering example, not native HTTP API protection.'],
      ['usagePlans', 'Describe REST consumer usage plans.', 'Group stage access with agreed rate/quota targets.', 'No usage plan is declared.', 'Quotas are not a strict billing cap.', [{name: 'study-tier', quota: 1000, period: 'DAY'}], 'A synthetic metering tier requiring actual key/stage association.'],
      ['usagePlans.name', 'Identify the consumer tier.', 'Use a recognizable stable name.', 'Plan identity is missing.', 'Names do not enforce isolation.', 'study-tier', 'A descriptive label.'],
      ['usagePlans.apiKeyReference', 'Refer to a managed key identity.', 'Use an ID/reference without entering the key value.', 'No key association is described.', 'Keep client secrets outside workspace exports.', 'key-id-example', 'A synthetic reference, not an authentication token.'],
      ['usagePlans.quota', 'Plan a request allowance.', 'Choose a quota with its aggregation period and client agreement.', 'No usage allowance is specified.', 'Treat metering limits as best-effort targets.', 1000, 'A daily example when paired with period DAY.'],
      ['usagePlans.period', 'Choose quota aggregation period.', 'Match the quota to the intended consumer interval.', 'The quota interval is unresolved.', 'The same count has different meaning per day versus month.', 'DAY', 'Interpret quota 1000 as the selected daily target.'],
    ]),
    ...notes('validation', 'dev-application', 'REST request validation is a boundary check, not application-level authorization or business validation.', [
      ['requestValidation', 'Plan gateway request checks.', 'Use to reject malformed declared bodies/parameters early.', 'No gateway validator is asserted.', 'Application code still owns business invariants.', true, 'Enable only with models/parameters attached to the intended method.'],
      ['requestModels', 'Describe request-body schemas.', 'Associate the right model with the expected content type.', 'Body structure requirements remain undefined.', 'A model declaration alone does not attach validation to a method.', '{"type":"object","required":["title"],"properties":{"title":{"type":"string"}}}', 'A teaching schema; verify the REST model dialect and method association.'],
    ]),
    ...notes('parameters', 'dev-application', 'HTTP API parameter transformations; unsupported headers and product-specific syntax require review.', [
      ['parameterMappings', 'Adapt integration parameters.', 'Use when boundary headers/query/path need an explicit translation.', 'No parameter transformation is declared.', 'Mapping is not general business-body validation.', '{"overwrite:path":"$request.path"}', 'HTTP private-integration example removing stage-path forwarding.'],
    ]),
    ...notes('templates', 'dev-application', 'REST body transformations use mapping templates; the playground does not execute VTL.', [
      ['mappingTemplates', 'Describe REST body transformations.', 'Use for a deliberately non-proxy request/response contract.', 'No template mapping is declared.', 'Template behavior needs representative integration tests.', [{contentType: 'application/json', template: '$input.json("$")'}], 'A small JSON pass-through teaching template.'],
      ['mappingTemplates.contentType', 'Select the template media type.', 'Match the request/response content type and passthrough behavior.', 'Template selection is unresolved.', 'A mismatched type may follow another mapping path.', 'application/json', 'Test missing and alternative Content-Type values too.'],
      ['mappingTemplates.template', 'Record the transformation body.', 'Keep the template aligned with the documented payload contract.', 'No body transformation is supplied.', 'Complex transformations can hide schema errors.', '$input.json("$")', 'Illustrative VTL retained as text, never evaluated locally.'],
      ['errorResponses', 'Plan safe public error contracts.', 'Distinguish validation, authorization and dependency failures.', 'Caller-visible error behavior is undocumented.', 'A success status must not hide failed writes.', '400 invalid input; 403 forbidden; 503 temporary dependency failure', 'Application/integration intent requiring product-specific implementation.', 'application-intent'],
    ]),
    ...notes('cache', 'measure-optimize', 'REST stage/method cache; no equivalent native HTTP API cache toggle is asserted.', [
      ['cacheEnabled', 'Plan gateway response caching.', 'Use only for responses safe under the chosen cache key.', 'Caching is not asserted.', 'A missing caller dimension can mix personalized responses.', false, 'Start uncached until identity and invalidation behavior are reviewed.'],
      ['cacheTtlSeconds', 'Set acceptable cached-response age.', 'Relate freshness requirements to update/invalidation behavior.', 'No freshness budget is selected.', 'Longer TTL can reduce backend calls but serve stale data.', 60, 'A one-minute candidate for a nonpersonalized read endpoint.'],
    ]),
    ...notes('privateIntegration', 'dev-application', 'Private backend integration is distinct from private API endpoint exposure; link generation and product matter.', [
      ['vpcLink', 'Identify private backend connectivity.', 'Use a compatible VPC link for the selected integration.', 'Private integration connectivity is unresolved.', 'A link does not authorize the public caller.', local('backend-link'), 'Logical connectivity reference needing deployment-specific link identity.'],
      ['loadBalancer', 'Identify the private backend listener.', 'Resolve a compatible listener and verify routes/security groups.', 'The private endpoint target is unknown.', 'A load-balancer node alone is not a listener ARN.', local('application-alb'), 'Record the intended listener separately before deployment.'],
    ]),
    ...notes('apiLogs', 'observe-debug', 'HTTP access logging uses a stage destination and safe format; REST execution logs are a separate feature.', [
      ['accessLogs', 'Describe API request evidence.', 'Choose safe structured fields needed for diagnosis.', 'No access-log destination/format is declared.', 'Avoid storing tokens or sensitive request bodies.', [{logGroup: local('api-logs'), format: '{"requestId":"$context.requestId","status":"$context.status"}'}], 'A small correlated access-log record.'],
      ['accessLogs.logGroup', 'Choose the access-log destination.', 'Coordinate retention, ownership and logging permissions.', 'Request evidence storage is unspecified.', 'The stage needs a supported destination and permission path.', local('api-logs'), 'Graph reference that must resolve to the destination ARN.'],
      ['accessLogs.format', 'Choose emitted request metadata.', 'Include request IDs and outcome signals useful to investigation.', 'Log fields are not selected.', 'Unbounded payload logging can expose private data.', '{"requestId":"$context.requestId","status":"$context.status"}', 'A synthetic format using safe correlation and outcome fields.'],
      ['executionLogging', 'Plan REST integration execution logs.', 'Use for REST troubleshooting with explicit data-trace privacy review.', 'Execution logging is not asserted.', 'Execution logs differ from HTTP access logs.', false, 'Leave sensitive execution detail disabled until its purpose is reviewed.'],
    ]),
    ...notes('apiProducts', 'release-environments', 'Custom-domain requirements vary by API product, endpoint and certificate context.', [
      ['customDomain', 'Plan the public domain mapping.', 'Coordinate DNS, certificate and stage/API mapping.', 'No domain mapping is declared.', 'A hostname alone does not prove TLS or DNS ownership.', 'api.study.example', 'Synthetic hostname needing the correct certificate and mapping.', 'application-intent'],
    ]),
    ...notes('websocket', 'dev-application', 'WebSocket connection lifecycle is separate from HTTP route testing.', [
      ['webSocketRoutes', 'Describe connection and message routes.', 'Use $connect, $disconnect and custom message selection deliberately.', 'Connection lifecycle behavior is undocumented.', 'Backend callbacks require connection identity and authorization.', '$connect authenticates; submit handles action=submit; $disconnect cleans state', 'Planning text that needs actual route definitions.', 'application-intent'],
      ['testRequest', 'Preserve a synthetic request fixture.', 'Choose the correct HTTP or WebSocket event shape for the selected API.', 'No local request fixture is supplied.', 'A fixture cannot establish deployed authentication or delivery.', '{"method":"POST","path":"/orders","body":{"orderId":"demo-1"}}', 'A nonsecret HTTP teaching request, not a universal AWS event.', 'exercise-input'],
    ]),
  },
  sqs: {
    ...notes('queueCreate', 'dev-events', 'Queue creation choices; changing the editor type is not an in-place conversion of a deployed queue.', [
      ['queueType', 'Choose message-delivery semantics.', 'Use FIFO when per-group ordering fits the workload.', 'Queue type is unknown in the workspace.', 'A deployed queue cannot be converted by toggling its type.', 'fifo', 'Plan migration and producer changes if replacing a standard queue.'],
      ['queueName', 'Identify the queue.', 'Use a stable workload name with the FIFO suffix where applicable.', 'No deployment queue name is chosen.', 'The name is scoped by account and Region.', 'invoice-work.fifo', 'Synthetic FIFO queue name aligned with queueType.'],
    ]),
    ...notes('visibility', 'dev-events', 'Visibility applies after receipt; it is neither deletion nor initial delivery delay.', [
      ['visibilitySeconds', 'Budget exclusive processing time after receipt.', 'Allow realistic processing and deletion time; review Lambda mapping recommendations separately.', 'The processing visibility budget is undecided.', 'Expiry can expose work for another receive.', 180, 'A candidate for a short worker; test slow paths and retry recovery.'],
      ['idempotentProcessing', 'Plan duplicate-safe business effects.', 'Persist a stable operation identity when delivery or processing can repeat.', 'Duplicate safety is unproven.', 'Visibility does not guarantee a business action occurs only once.', true, 'Require a replay test; this flag alone changes no application code.', 'application-intent'],
    ]),
    ...notes('polling', 'measure-optimize', 'Queue receive wait is separate from Lambda batching and client HTTP deadlines.', [
      ['receiveWaitSeconds', 'Choose queue long-poll waiting.', 'Use when waiting for messages is preferable to repeated empty responses.', 'Polling behavior is unspecified.', 'The client timeout must accommodate the receive wait.', 20, 'A long-poll candidate for an idle-tolerant worker.'],
    ]),
    ...notes('queueAttributes', 'dev-events', 'Queue attribute choices; reduction of retention can affect messages already stored.', [
      ['maximumMessageSizeBytes', 'Bound accepted message-body size.', 'Fit serialized payloads within producer and consumer limits.', 'No message-size budget is declared.', 'A queue limit does not replace the Lambda invocation payload limit.', 262144, 'A deliberate smaller payload budget, not the current AWS maximum.'],
      ['retentionSeconds', 'Keep unprocessed messages for recovery.', 'Match outage duration and recovery obligations.', 'The retained recovery window is unknown.', 'Reducing retention can expire existing older messages.', 345600, 'A four-day candidate to compare with the operational recovery target.'],
      ['accessPolicy', 'Describe queue resource access.', 'Scope producer/consumer principals and service-source conditions.', 'No resource-policy grant is asserted.', 'A broad queue policy can widen access independently from a role.', grant({Service: 'sns.amazonaws.com'}, 'sqs:SendMessage', 'arn:aws:sqs:us-east-1:111122223333:invoice-work', 'arn:aws:sns:us-east-1:111122223333:invoice-events'), 'Synthetic topic-to-queue grant scoped to a specific source.'],
    ]),
    ...notes('queueDelay', 'dev-events', 'Initial queue delay differs from visibility timeout and per-message scheduling.', [
      ['deliveryDelaySeconds', 'Delay initial availability.', 'Use when newly enqueued work must wait briefly before consumption.', 'No initial delay is selected.', 'FIFO and standard queues differ when changing existing queue delay.', 30, 'A short queue-wide delay; do not use it as a worker processing timeout.'],
    ]),
    ...notes('queueDlq', 'dev-events', 'Source-queue redrive and DLQ admission are separate policies; review ordering, retention and ownership.', [
      ['deadLetterQueue', 'Identify exhausted-work storage.', 'Choose a compatible DLQ and an investigation/redrive owner.', 'No DLQ is linked.', 'Moving failed FIFO work aside can disrupt business ordering.', local('invoice-dlq'), 'Review queue type, account, Region and retention before deployment.'],
      ['maxReceiveCount', 'Choose the failed-receive threshold.', 'Allow useful retries without indefinitely hiding poison work.', 'Redrive threshold is unknown.', 'Too low a threshold can exile recoverable transient failures.', 5, 'A candidate to test with transient and permanent failure fixtures.'],
      ['redriveAllowPolicy', 'Control which queues may use this DLQ.', 'Set this on the intended DLQ, separately from source redrive settings.', 'DLQ admission is not described.', 'Restricting admission does not itself configure source retries.', '{"redrivePermission":"denyAll"}', 'A closed teaching example; use byQueue with reviewed source ARNs when enabling.'],
    ]),
    ...notes('queueEncryption', 'security-kms', 'SSE-SQS and SSE-KMS have different key ownership; encryption does not grant queue access.', [
      ['encryption', 'Select encryption-key management.', 'Use SSE-KMS when the workload requires the corresponding KMS controls.', 'Encryption intent is unspecified, not a claim of plaintext storage.', 'KMS permissions can affect producer and consumer access.', 'SSE-SQS', 'SQS-managed encryption example without a customer-managed key reference.'],
      ['kmsKey', 'Identify the SSE-KMS key.', 'Choose only in an applicable SSE-KMS context.', 'No KMS key is selected.', 'Review key policy and service-principal access independently.', local('queue-key'), 'Resolve the logical key and its Region before deployment.'],
    ]),
    ...notes('sendMessage', 'dev-events', 'Message-level producer choices are recorded as application intent, not constant queue-wide message values.', [
      ['messageGroupId', 'Define producer grouping.', 'For FIFO, choose the business ordering boundary.', 'Message-group strategy is undefined.', 'One heavily used group can serialize substantial work.', 'invoice-account-42', 'Synthetic group value; derive the actual value per message.', 'application-intent'],
      ['deduplicationId', 'Define retry identity for published work.', 'Reuse the same identity for retries of one logical send.', 'Producer deduplication identity is not planned.', 'A new identity on every retry defeats duplicate-send recognition.', 'invoice-123-create', 'Stable synthetic operation identity, not a global queue constant.', 'application-intent'],
      ['contentBasedDeduplication', 'Plan FIFO body-based deduplication.', 'Use when identical bodies reliably identify duplicate publishes.', 'No content-based choice is recorded.', 'Review whether important uniqueness is only in message attributes.', false, 'Use explicit per-operation deduplication IDs in this example.'],
    ]),
    ...notes('fifoThroughput', 'measure-optimize', 'FIFO throughput settings must be reviewed together with deduplication scope and message-group distribution.', [
      ['deduplicationScope', 'Choose FIFO duplicate-identity scope.', 'Review whether identity is unique per queue or message group.', 'Deduplication scope is undecided.', 'Scope changes how producers must manage duplicate identifiers.', 'messageGroup', 'A candidate when identities are managed within each group.'],
      ['fifoThroughputLimit', 'Choose the FIFO throughput mode.', 'Coordinate with the required deduplication-scope setting.', 'No FIFO throughput choice is declared.', 'More throughput still requires useful distribution across groups.', 'perMessageGroupId', 'Review together with messageGroup deduplication and workload traffic.'],
    ]),
    ...notes('sqsConsumer', 'dev-events', 'These controls belong to queue-to-Lambda consumption, not general SQS queue attributes.', [
      ['lambdaConsumer', 'Identify the polled-queue consumer.', 'Use when Lambda owns receiving and acknowledgement.', 'No Lambda mapping target is selected.', 'The function role still needs queue and applicable key permissions.', local('invoice-worker'), 'A graph link requiring a real event source mapping.'],
      ['batchSize', 'Choose the mapping batch size.', 'Compare standard/FIFO behavior, processing time and payload size.', 'No consumer batch choice is asserted.', 'A large batch can increase failure recovery cost.', 10, 'An example fitting the modeled FIFO limit.'],
    ]),
    ...notes('sqsMapping', 'dev-events', 'SQS-specific batching options; FIFO does not support a batching window.', [
      ['batchWindowSeconds', 'Plan standard-queue batching latency.', 'Use only for supported non-FIFO batching.', 'No batching delay is selected.', 'FIFO does not support this batching window.', 1, 'A standard-queue candidate; do not carry it into FIFO settings.'],
    ]),
    ...notes('sqsFailures', 'dev-events', 'Partial-batch response handling needs a tested handler contract.', [
      ['reportBatchItemFailures', 'Plan partial-batch acknowledgement.', 'Enable together with the correct handler response implementation.', 'Per-item failure reporting is unproven.', 'Returning the wrong failed IDs can repeat successful work.', true, 'Test a batch containing both good and poison messages.'],
    ]),
    ...notes('sqsScaling', 'dev-events', 'Source concurrency must be coordinated with reserved concurrency; provisioned polling mode is a separate choice.', [
      ['maximumConcurrency', 'Budget this mapping concurrent work.', 'Account for other sources and function reserved concurrency.', 'Consumer parallelism is unspecified.', 'Downstream capacity can fail before queue throughput does.', 5, 'A measured workload budget, not an account quota.'],
    ]),
    ...notes('deleteMessage', 'dev-events', 'Receipt handles belong to receive attempts; the playground never deletes queue messages.', [
      ['receiptHandleHandling', 'Specify acknowledgement correctness.', 'Delete using the latest receive handle only after successful work.', 'Safe acknowledgement is undocumented.', 'A message ID is not the receipt handle required for deletion.', 'Retain the current receipt handle; delete after durable commit', 'Application logic needing duplicate and stale-handle tests.', 'application-intent'],
    ]),
    ...notes('queueMetrics', 'observe-debug', 'Queue monitoring plan; these rows do not instantiate CloudWatch alarms.', [
      ['alarms', 'Plan backlog and failure signals.', 'Choose age, visible backlog and DLQ signals with an owner.', 'No operational alert plan is recorded.', 'Queue metrics describe work accumulation, not business completion.', [{metric: 'ApproximateAgeOfOldestMessage', threshold: 'Above processing objective', notification: local('ops-topic')}], 'Turn the plan into actual alarms with periods and actions.', 'application-intent'],
      ['alarms.metric', 'Choose a backlog diagnostic.', 'Use message age when latency matters more than raw queue length.', 'No signal is selected.', 'Approximate queue metrics need workload context.', 'ApproximateAgeOfOldestMessage', 'Compare age to the user-visible processing objective.', 'application-intent'],
      ['alarms.threshold', 'Record the operational trigger.', 'Specify an actionable objective rather than an arbitrary count.', 'No alert condition is defined.', 'A prose threshold is not an evaluated alarm.', 'Oldest message exceeds two minutes for sustained periods', 'Translate into period/statistic/missing-data settings.', 'application-intent'],
      ['alarms.notification', 'Identify the incident response path.', 'Connect the team or recovery workflow responsible for backlog.', 'There is no declared response destination.', 'Alerts without ownership do not resolve poison work.', local('ops-topic'), 'A synthetic notification reference to validate.', 'application-intent'],
    ]),
  },
  sns: {
    ...notes('topic', 'dev-events', 'SNS topic configuration; subscriber capabilities must match the selected topic type.', [
      ['topicType', 'Choose fan-out delivery semantics.', 'Review ordering and subscriber protocols before choosing FIFO.', 'Topic type is undecided.', 'FIFO and standard topic capabilities differ.', 'standard', 'A broad fan-out example that still needs endpoint-specific review.'],
      ['topicName', 'Identify the publishing channel.', 'Choose a business-event name with the required FIFO suffix when applicable.', 'No topic name is selected.', 'Avoid encoding private information into resource names.', 'invoice-events', 'A synthetic standard-topic name.'],
      ['accessPolicy', 'Control topic resource access.', 'Scope publishers and subscription-management actions.', 'No resource grant is asserted.', 'Publishing permission and subscriber authorization are distinct.', grant({AWS: 'arn:aws:iam::111122223333:role/invoice-producer'}, 'sns:Publish', 'arn:aws:sns:us-east-1:111122223333:invoice-events'), 'Synthetic grant for a named producer and topic.'],
      ['contentBasedDeduplication', 'Choose FIFO body-based send deduplication.', 'Use only when body identity matches the duplicate-send contract.', 'No content-based decision is recorded.', 'Consumer side effects still require duplicate-safe processing.', false, 'An example using explicit producer deduplication IDs.'],
    ]),
    ...notes('subscribe', 'dev-events', 'Subscription endpoints and confirmation depend on protocol and ownership; this app sends no notifications.', [
      ['subscriptions', 'List independently delivered subscribers.', 'Configure each endpoint and its failure boundary separately.', 'No fan-out destination is declared.', 'One subscriber failure should be investigated independently.', [{protocol: 'sqs', resource: local('invoice-queue')}], 'A queue subscriber needing endpoint resource permissions.'],
      ['subscriptions.protocol', 'Select the endpoint delivery protocol.', 'Check protocol support for the topic type and target.', 'Endpoint interpretation is unresolved.', 'The required endpoint format changes with protocol.', 'sqs', 'Use the queue ARN contract rather than an HTTPS URL.'],
      ['subscriptions.resource', 'Identify a modeled subscriber.', 'Prefer a graph reference for a supported AWS endpoint.', 'No modeled target is selected.', 'A reference does not install the target policy.', local('invoice-queue'), 'Resolve queue identity and delivery permissions together.', 'application-intent'],
      ['subscriptions.endpoint', 'Record an external subscription endpoint.', 'Use a synthetic address in exercises; match the protocol.', 'No external destination is supplied.', 'Some endpoints require owner confirmation.', 'https://subscriber.example/events', 'A synthetic HTTPS endpoint, not an actual delivery destination.'],
      ['subscriptions.confirmed', 'Record a subscription observation.', 'Use only as a study assertion about a confirmed endpoint.', 'Confirmation is unknown.', 'Toggling this does not execute ConfirmSubscription.', false, 'An unconfirmed scenario to investigate; no real status is fetched.', 'observed-output'],
    ]),
    ...notes('subscription', 'dev-events', 'Filtering and raw delivery are subscription-level choices, with protocol-specific applicability.', [
      ['subscriptions.rawMessageDelivery', 'Choose the delivered envelope.', 'Align a supported subscriber parser with raw or SNS-wrapped content.', 'Envelope choice is unspecified.', 'A parser expecting SNS metadata can fail on raw delivery.', true, 'SQS subscriber example with a handler expecting the original body.'],
      ['subscriptions.filterPolicyScope', 'Choose the filter input.', 'Match whether publishers place selectors in attributes or JSON body.', 'The filter source is unresolved.', 'A filter applied to the wrong location can drop intended notifications.', 'MessageBody', 'Use with a valid JSON body carrying the selected keys.'],
      ['subscriptions.filterPolicy', 'Select messages for this subscriber.', 'Keep criteria tied to a documented event contract.', 'No subscription filter is declared.', 'Filtering out work is different from a delivery failure.', '{"kind":["invoice.created"]}', 'Body-filter example when kind exists at the chosen scope.'],
    ]),
    ...notes('subscriptionDlq', 'dev-events', 'SNS redrive captures failed subscription delivery, not successful consumer processing or deliberately filtered messages.', [
      ['subscriptions.deadLetterQueue', 'Retain undeliverable notifications.', 'Choose a compatible SQS destination and review its permissions.', 'No subscription recovery destination is declared.', 'The target consumer may still fail after SNS delivery succeeds.', local('subscriber-dlq'), 'A recovery queue for this specific subscriber boundary.'],
    ]),
    ...notes('topicEncryption', 'security-kms', 'SNS server-side encryption protects message bodies; key access and transport protection remain separate.', [
      ['encryption', 'Plan stored-message encryption.', 'Choose key management according to the workload data policy.', 'No encryption choice is recorded in the design.', 'Encryption does not authorize publishers or subscribers.', 'SSE-KMS', 'Review the KMS policy alongside topic access.'],
      ['kmsKey', 'Identify the topic encryption key.', 'Use a supported encryption key and intended Region.', 'The key is unresolved.', 'A correct topic policy cannot compensate for missing key permission.', local('topic-key'), 'A synthetic customer-managed-key reference.'],
    ]),
    ...notes('publish', 'dev-events', 'Per-message publisher contracts are application intent; they are not constant topic-wide values.', [
      ['messageAttributes', 'Define typed publisher metadata.', 'Document selectors used by subscribers and their serialization.', 'The attribute contract is unspecified.', 'Attribute/body mismatches can change filtering behavior.', 'kind: String; schemaVersion: Number', 'A publisher schema note requiring actual Publish request encoding.', 'application-intent'],
      ['messageGroupId', 'Define FIFO ordering groups.', 'Choose the business sequence that must remain ordered.', 'The producer grouping strategy is missing.', 'Different groups can progress independently.', 'account-42', 'A synthetic group derived per message.', 'application-intent'],
      ['deduplicationId', 'Define logical publish identity.', 'Reuse identity when retrying the same intended event.', 'Duplicate-send handling is undocumented.', 'New IDs on each retry can duplicate business work.', 'invoice-123-created', 'A stable event identity to pair with replay-safe consumers.', 'application-intent'],
    ]),
    ...notes('delivery', 'dev-events', 'Delivery retry policy is protocol-specific, especially configurable HTTP/S handling.', [
      ['deliveryPolicy', 'Plan retry behavior for endpoint delivery.', 'Choose supported retry controls for the subscriber protocol.', 'No custom delivery policy is declared.', 'Retry tuning cannot repair permanently incorrect authorization.', '{"healthyRetryPolicy":{"numRetries":3}}', 'A partial HTTP/S teaching policy, not a universal policy for all protocols.'],
    ]),
    ...notes('topicStatus', 'observe-debug', 'Delivery-status logging has supported endpoint-specific attributes; one editor field cannot represent every protocol role.', [
      ['deliveryStatusRole', 'Identify feedback logging permissions.', 'Resolve the role for the chosen endpoint feedback integration.', 'Delivery-status logging permission is unspecified.', 'Logging success does not imply subscriber business success.', role('sns-feedback'), 'A logical role requiring the correct protocol-specific attribute.'],
      ['successFeedbackSampleRate', 'Plan successful-delivery sampling.', 'Choose enough visibility without logging every successful delivery unnecessarily.', 'Success sampling is undecided.', 'Sampling omits some successful delivery records.', 10, 'A ten-percent candidate for a supported feedback endpoint.'],
    ]),
    ...notes('topicMetrics', 'observe-debug', 'Monitor the publish/delivery boundary independently from subscriber processing.', [
      ['failureAlarms', 'Plan actionable fan-out monitoring.', 'Separate failed deliveries, filtered messages and subscriber backlog.', 'No failure response is documented.', 'Publish count alone does not prove all subscribers processed work.', 'Investigate delivery failures and DLQ growth; inspect subscriber backlog separately', 'Application monitoring intent requiring real alarm configuration.', 'application-intent'],
    ]),
  },
  eventbridge: {
    ...notes('bus', 'dev-events', 'EventBridge event-bus planning; the current rules/targets editor models the Classic rule surface, not every bus generation.', [
      ['busType', 'Choose the event ingress boundary.', 'Distinguish AWS default events, custom publishers and partner sources.', 'Bus ownership and ingress are undecided.', 'Do not assume a partner or newer bus feature uses identical rule configuration.', 'custom', 'A custom Classic-bus planning example.'],
      ['busName', 'Identify the bus used by publishers and rules.', 'Keep producer destination and rule ownership consistent.', 'The event destination is unresolved.', 'A rule on another bus will not inspect these events.', 'study-events', 'Use the same logical bus identity across producer and routing configuration.'],
      ['encryption', 'Choose event-bus key ownership.', 'Review customer-managed-key requirements and feature compatibility.', 'Key ownership is unspecified.', 'Schema discovery has compatibility constraints with customer-managed keys.', 'AWS-owned-key', 'A key-ownership choice, not a statement that encryption was deployed.'],
      ['kmsKey', 'Identify the bus customer-managed key.', 'Use only with the corresponding encryption choice.', 'No customer-managed key is selected.', 'Key policy and archive encryption need separate review.', local('event-key'), 'Resolve the actual key and supported bus configuration.'],
    ]),
    ...notes('busPolicy', 'security-iam-sts', 'Publisher identity and receiving-bus resource policy are separate authorization boundaries.', [
      ['busPolicy', 'Describe event-bus resource access.', 'Scope permitted callers/actions and cross-account conditions.', 'No receiving-bus resource grant is asserted.', 'Granting publish access does not grant arbitrary target invocation.', grant({AWS: 'arn:aws:iam::111122223333:role/event-producer'}, 'events:PutEvents', 'arn:aws:events:us-east-1:111122223333:event-bus/study-events'), 'Synthetic publisher grant; cross-account access needs both sides reviewed.'],
      ['producerRole', 'Identify the publishing workload identity.', 'Grant the intended producer access to the selected bus.', 'Producer authorization remains unspecified.', 'A target execution role does not authorize the publisher.', role('event-producer'), 'Keep publishing and target-execution identities distinct.', 'application-intent'],
    ]),
    ...notes('rule', 'dev-events', 'Classic PutRule concepts; this editor omits other rule state variants and does not deploy rules.', [
      ['rules', 'Describe event routing rules.', 'Separate event selection from target delivery settings.', 'No event selection rule is declared.', 'Matching an event is not proof of successful target execution.', [{name: 'invoice-created', enabled: true, eventPattern: '{"source":["study.billing"]}'}], 'A partial rule needing an explicit target configuration.'],
      ['rules.name', 'Identify a rule within its bus.', 'Choose a stable name for target association and operations.', 'Targets cannot reliably identify their owning rule.', 'Name collisions and wrong bus context can misdirect configuration.', 'invoice-created', 'Pair with the intended study-events bus.'],
      ['rules.enabled', 'Choose whether the rule routes events.', 'Use explicit enablement during staged changes.', 'Rule activation is unknown.', 'The boolean editor is only a subset of AWS rule state choices.', false, 'Keep routing paused while reviewing target permissions.'],
      ['rules.description', 'Explain routing ownership.', 'Record the event contract and intended consumer responsibility.', 'The routing rationale is undocumented.', 'Useful descriptions make obsolete rules easier to identify.', 'Routes invoice-created events to ledger processing', 'A description, not a matching expression.'],
    ]),
    ...notes('pattern', 'dev-events', 'AWS pattern syntax is broader than the playground exact-match preview; unsupported operators stay unevaluated locally.', [
      ['rules.eventPattern', 'Select relevant event fields.', 'Match the actual envelope and test both accepted and rejected examples.', 'No matching criteria are declared.', 'An overly broad pattern can route unrelated work.', '{"source":["study.billing"],"detail-type":["InvoiceCreated"]}', 'A synthetic envelope match with two explicit selectors.'],
      ['sampleEvent', 'Provide a local pattern fixture.', 'Include the event envelope used by the selected rule.', 'There is no example for local matching.', 'A matching fixture does not establish live publishing or permission.', '{"source":"study.billing","detail-type":"InvoiceCreated","detail":{"invoiceId":"demo-1"}}', 'Nonsecret sample matching the illustrated selectors.', 'exercise-input'],
      ['patternTestMode', 'Choose the scope of local inspection.', 'Use exact-subset only for supported local matching behavior.', 'The intended test scope is unresolved.', 'Preserving a full AWS pattern does not imply local evaluation.', 'aws-pattern-document', 'Retain broader syntax as a document for independent AWS verification.', 'exercise-input'],
      ['schemaAndVersioning', 'Define the event evolution contract.', 'Specify stable envelope keys and compatible payload changes.', 'Consumers have no documented versioning agreement.', 'Schema discovery does not enforce business invariants.', 'detail.schemaVersion=1; add optional fields before requiring them', 'An application contract to test across producers and consumers.', 'application-intent'],
    ]),
    ...notes('target', 'dev-events', 'Classic target attachment concepts; target service and authorization method determine applicability.', [
      ['targets', 'Describe rule delivery destinations.', 'Give each target its own identity, input and recovery decisions.', 'No rule destination is declared.', 'Targets can fail independently after the same rule matches.', [{ruleName: 'invoice-created', targetId: 'ledger', resource: local('ledger-worker')}], 'A logical target requiring permission and payload review.'],
      ['targets.ruleName', 'Identify the owning rule.', 'Match the intended bus and rule.', 'Rule owner is unresolved.', 'PutTargets needs this rule context.', 'invoice-created', 'Rule name, not function name.'],
      ['targets.targetId', 'Identify one rule destination.', 'Keep stable IDs for updates/removal.', 'Target identity is missing.', 'Changed IDs can leave old targets.', 'ledger', 'Distinct from the target ARN.'],
      ['targets.resource', 'Select the destination workload.', 'Check support for the resource type and payload contract.', 'The destination is unresolved.', 'A canvas reference does not verify a deployed supported target.', local('ledger-worker'), 'A function node reference to resolve during deployment.', 'application-intent'],
      ['targets.role', 'Identify target execution permissions.', 'Choose the authorization path required by that target.', 'No execution-role grant is asserted.', 'This is not the target Lambda function execution role.', role('event-target-role'), 'Use only for an applicable target execution-role path.'],
    ]),
    ...notes('transformer', 'dev-events', 'Input selection and transformation are mutually coordinated target choices; no arbitrary transformation code runs here.', [
      ['targets.inputMode', 'Choose what the destination receives.', 'Compare full event, selected path, constant JSON and template.', 'The target payload contract is undecided.', 'Removing envelope fields can remove needed correlation context.', 'input-path', 'Select a deliberate event subset for a compatible consumer.'],
      ['targets.inputPath', 'Select a supported event JSONPath.', 'Use only with path-based target input.', 'No input selection path is specified.', 'A missing field can produce an unexpected target payload.', '$.detail', 'Pass the detail object when the consumer expects that shape.'],
      ['targets.constantInput', 'Provide a fixed target payload.', 'Use only when the original event contents are unnecessary.', 'No constant payload is supplied.', 'Constant input discards dynamic event information.', '{"operation":"refresh-summary"}', 'A fixed action contract, not an event-pattern expression.'],
      ['targets.inputTransformer', 'Map selected values into a target payload.', 'Use supported paths and verify template substitution/quoting.', 'No transformation is defined.', 'Missing paths and type assumptions can break consumers.', JSON.stringify({InputPathsMap: {invoice: '$.detail.invoiceId'}, InputTemplate: '{"invoiceId":<invoice>}'}), 'A small template to test with representative event data.'],
    ]),
    ...notes('targetRetry', 'dev-events', 'Delivery retries end when either the retry count or event-age budget is reached.', [
      ['targets.maximumRetryAttempts', 'Budget delivery retry attempts.', 'Choose how long transient target failures should be retried with the age budget.', 'No retry count is selected.', 'Retry attempts can repeat target-visible work.', 5, 'A bounded candidate requiring duplicate-safe consumer behavior.'],
      ['targets.maximumEventAgeSeconds', 'Limit target delivery age.', 'Match event usefulness and recovery requirements.', 'Delivery freshness is unspecified.', 'Old events can be discarded before the retry count is exhausted.', 3600, 'A one-hour target-delivery budget.'],
    ]),
    ...notes('target', 'dev-events', 'Target DLQ handling is separate from retries inside the destination application.', [
      ['targets.deadLetterQueue', 'Retain events that cannot be delivered.', 'Choose a supported SQS DLQ and its required queue policy.', 'No target-delivery recovery destination is declared.', 'DLQ delivery can itself fail because of permissions.', local('event-dlq'), 'Review rule-scoped queue permission and failure monitoring.'],
    ]),
    ...notes('archive', 'dev-events', 'Archives retain selected events; replay is a separate operation with duplicate-processing implications.', [
      ['archives', 'Describe retained event history.', 'Choose what must be available for investigation or replay.', 'No archive is planned.', 'Retention adds storage and replay responsibilities.', [{name: 'billing-history', eventPattern: '{"source":["study.billing"]}', retentionDays: 30}], 'A scoped history slice rather than all bus traffic.'],
      ['archives.name', 'Identify the retained event collection.', 'Use a name tied to event ownership and retention purpose.', 'The archive has no logical identity.', 'Operators need the correct archive when planning replay.', 'billing-history', 'A synthetic archive name.'],
      ['archives.eventPattern', 'Select events to retain.', 'Keep the archive selection aligned with recovery requirements.', 'The archive filter is not declared.', 'Excluded events cannot be recovered from this archive.', '{"source":["study.billing"]}', 'Retain the selected publisher family for later investigation.'],
      ['archives.retentionDays', 'Choose available history duration.', 'Balance replay needs with retention policy and cost.', 'No archive retention decision is recorded.', 'Review zero/indefinite semantics before using zero.', 30, 'A thirty-day history requirement, not an asserted default.'],
      ['archives.replayWindow', 'Plan the replay time boundary.', 'Specify a deliberate event-time range and destination.', 'No replay operation is planned.', 'Replay can repeat actions already completed by consumers.', 'Replay the investigated incident interval after consumer repair', 'Operational intent; this text does not start replay.', 'application-intent'],
    ]),
    ...notes('eventMetrics', 'observe-debug', 'Metric namespace and dimensions depend on Classic versus newer bus generation; metrics are best-effort evidence.', [
      ['failureMonitoring', 'Plan routing and delivery diagnosis.', 'Separate no matches, failed delivery, throttling and DLQ delivery failures.', 'No operational investigation path is documented.', 'A missing metric point is not proof that no event existed.', 'Inspect matched events, target failures and failed DLQ sends', 'Choose actual namespace/dimensions for the deployed bus generation.', 'application-intent'],
    ]),
  },
  'step-functions': {
    ...notes('workflow', 'dev-events', 'Standard and Express differ in duration, execution behavior and integration support.', [
      ['workflowType', 'Choose the workflow execution model.', 'Compare duration, audit history and delivery semantics.', 'The execution model is undecided.', 'A deployed state machine cannot change workflow type in place.', 'STANDARD', 'A durable orchestration candidate requiring supported task integrations.'],
      ['timeoutSeconds', 'Bound whole-workflow duration.', 'Set a business deadline within the selected workflow limits.', 'The workflow deadline is unknown.', 'Task-level deadlines do not replace this overall bound.', 300, 'A five-minute workflow budget chosen independently of each task.'],
    ]),
    ...notes('stateMachine', 'dev-events', 'ASL definition is the deployable artifact; editor planning tables do not automatically rewrite it.', [
      ['definition', 'Describe executable workflow states.', 'Use a validated ASL document matching the chosen language and integrations.', 'No deployable state-machine definition is supplied.', 'JSON parsing alone does not prove valid ASL or permissions.', '{"StartAt":"Done","States":{"Done":{"Type":"Succeed"}}}', 'A minimal teaching workflow, not the full application process.'],
      ['executionRole', 'Identify workflow service permissions.', 'Grant the state machine access to the resources its tasks use.', 'Task authorization is unresolved.', 'The workflow role differs from a Lambda task execution role.', role('workflow-role'), 'Resolve every integration action and resource before deployment.'],
      ['tracingEnabled', 'Plan supported workflow tracing.', 'Coordinate traces with downstream task instrumentation.', 'No tracing behavior is asserted.', 'Tracing needs correct permissions and does not replace execution history.', true, 'An observability proposal to verify for the chosen workflow.'],
      ['versionsAndAliases', 'Plan controlled workflow publication.', 'Name immutable definitions and caller-facing rollout references.', 'The release reference strategy is undocumented.', 'A text plan does not publish a state-machine version.', 'Promote reviewed version through live alias; retain rollback target', 'Deployment intent requiring explicit version/alias operations.', 'application-intent'],
    ]),
    ...notes('jsonata', 'dev-events', 'JSONPath and JSONata use different transformation fields; this editor does not convert expressions automatically.', [
      ['queryLanguage', 'Choose state data-transformation syntax.', 'Use one deliberate language strategy and review per-state overrides.', 'The intended expression language is unspecified.', 'JSONPath Parameters/ResultPath cannot simply be pasted into JSONata states.', 'JSONata', 'Use the corresponding Arguments/Output contract rather than .$ key syntax.'],
    ]),
    ...notes('task', 'dev-events', 'Task planning rows must be reconciled with ASL; task Resource may be an integration ARN, not the linked workload ARN.', [
      ['tasks', 'Document task boundaries and ownership.', 'Describe each external action represented in the ASL definition.', 'The task review map is missing.', 'These rows do not generate or modify ASL automatically.', [{stateName: 'ProcessInvoice', resource: local('invoice-worker'), integrationPattern: 'request-response'}], 'Cross-check the planned row against the actual state definition.', 'application-intent'],
      ['tasks.stateName', 'Identify the corresponding ASL state.', 'Match spelling and case in the definition.', 'The planning row has no state association.', 'A renamed state can leave stale review notes.', 'ProcessInvoice', 'Use the exact state key from States.', 'application-intent'],
      ['tasks.resource', 'Identify the task dependency.', 'Resolve the actual service integration and payload parameters.', 'The task target is unresolved.', 'A linked Lambda node does not fully specify lambda:invoke ASL.', local('invoice-worker'), 'A dependency reference to reconcile with Resource and Parameters/Arguments.', 'application-intent'],
      ['tasks.timeoutSeconds', 'Bound one task duration.', 'Choose a deadline appropriate to the integration contract.', 'No task deadline is planned.', 'A workflow deadline can still expire earlier.', 60, 'Compare one-minute task work with the overall workflow budget.'],
      ['tasks.heartbeatSeconds', 'Plan liveness signals for long work.', 'Use where the integration can send meaningful heartbeat progress.', 'Heartbeat behavior is unspecified.', 'Heartbeat expiry differs from total task duration.', 15, 'A callback/activity candidate requiring heartbeat implementation.'],
    ]),
    ...notes('integrationPatterns', 'dev-events', 'Express supports request-response; supported Standard integrations may additionally wait for jobs or callbacks.', [
      ['tasks.integrationPattern', 'Choose completion ownership.', 'Check request-response, job-wait or callback support for this service/workflow.', 'Task completion behavior is undecided.', 'An accepted service request may not mean the business job completed.', 'request-response', 'Use when the service response is the intended task completion boundary.'],
    ]),
    ...notes('errorExample', 'dev-events', 'Retry planning must be reconciled with ordered ASL Retry entries; these rows do not execute recovery.', [
      ['retryPolicies', 'Describe recoverable task failures.', 'Retry transient conditions rather than every business rejection.', 'No explicit retry policy is planned.', 'Retries can repeat side effects and consume the execution budget.', [{stateName: 'ProcessInvoice', errorEquals: 'TransientDependency', intervalSeconds: 2, maxAttempts: 3}], 'A custom-error example requiring the actual task error name.', 'application-intent'],
      ['retryPolicies.stateName', 'Associate retry intent with a state.', 'Use the exact task/map/parallel state being reviewed.', 'The retry policy has no target state.', 'Applying recovery at the wrong level can replay excessive work.', 'ProcessInvoice', 'Match the definition before translating this row to Retry.', 'application-intent'],
      ['retryPolicies.errorEquals', 'Select retryable error names.', 'Match emitted errors and review wildcard behavior deliberately.', 'No retry selection is specified.', 'An overly broad retry can prolong permanent failures.', 'TransientDependency', 'A synthetic custom error requiring matching application behavior.'],
    ]),
    ...notes('errors', 'dev-events', 'ASL retry pacing and limits; review the selected state and actual error conditions.', [
      ['retryPolicies.intervalSeconds', 'Choose the initial retry delay.', 'Allow a transient dependency time to recover.', 'Retry pacing is unspecified.', 'Immediate repeat calls can worsen overload.', 2, 'A two-second initial wait to combine with backoff.'],
      ['retryPolicies.maxAttempts', 'Bound retry count.', 'Choose a finite recovery budget appropriate to the operation.', 'No retry-count decision is recorded.', 'More attempts can repeat already-applied effects.', 3, 'A bounded candidate, not a guarantee of eventual success.'],
      ['retryPolicies.backoffRate', 'Scale delays across retries.', 'Use when repeated immediate retries would overload the dependency.', 'Delay growth is unspecified.', 'Backoff affects total workflow duration.', 2, 'A doubling factor to assess against the overall deadline.'],
      ['retryPolicies.maxDelaySeconds', 'Cap retry waiting intervals.', 'Use when backoff should not exceed an operational pause budget.', 'No maximum delay is selected.', 'Capping delay does not limit the count of retries.', 10, 'Bound waiting while keeping maxAttempts separately explicit.'],
      ['retryPolicies.jitterStrategy', 'Distribute retry timing.', 'Use jitter when many executions can fail simultaneously.', 'Retry synchronization behavior is unspecified.', 'Jitter can reduce correlated retry bursts.', 'FULL', 'A pacing choice, not a substitute for a retry limit.'],
      ['catchPolicies.errorEquals', 'Select fallback error categories.', 'Separate recoverable business outcomes from unexpected failures.', 'No error routing condition is supplied.', 'Review specific error behavior rather than assuming States.ALL catches everything.', 'BusinessRejected', 'A synthetic business error with an intentional fallback.'],
    ]),
    ...notes('resultPath', 'dev-events', 'Catch routes errors after applicable retries; preserve needed recovery input with the correct JSONPath result placement.', [
      ['catchPolicies', 'Describe fallback transitions.', 'Choose an explicit recovery or compensation state.', 'No fallback path is planned.', 'Catching an error does not undo side effects.', [{stateName: 'ProcessInvoice', errorEquals: 'BusinessRejected', next: 'RecordFailure', resultPath: '$.error'}], 'JSONPath planning example to reconcile with the ASL Catch array.', 'application-intent'],
      ['catchPolicies.stateName', 'Identify the state whose failure is handled.', 'Place the catcher at the intended work boundary.', 'The fallback has no owning state.', 'A top-level workflow failure needs a different handling boundary.', 'ProcessInvoice', 'Match the task state that emits the failure.', 'application-intent'],
      ['catchPolicies.next', 'Choose the fallback state.', 'Reference a real state that handles the error contract.', 'The failure route is incomplete.', 'A missing next state makes the intended workflow invalid.', 'RecordFailure', 'The definition must contain this state and its recovery behavior.'],
    ]),
    ...notes('inputOutput', 'dev-events', 'JSONPath state processing; reconcile table notes with the actual ASL expression language.', [
      ['catchPolicies.resultPath', 'Place caught error information.', 'For JSONPath, preserve the input fields needed by recovery.', 'The error/input merge decision is unknown.', 'Replacing the entire input can discard correlation and compensation data.', '$.error', 'Preserve original input and attach error details under a dedicated key.'],
      ['inputOutputProcessing', 'Plan state payload boundaries.', 'Describe which data each state receives, passes and retains.', 'Data-flow ownership is undocumented.', 'Unbounded payload growth can break later states.', 'Pass invoiceId and approved fields; retain requestId for recovery', 'A design note requiring real JSONPath/JSONata expressions.', 'application-intent'],
      ['syntheticInput', 'Provide a nonsecret execution fixture.', 'Include the fields used by the chosen definition.', 'No input example is available for local review.', 'The fixture is not executed against AWS.', '{"invoiceId":"demo-1","requestId":"request-demo"}', 'Use matching success, missing-field and failure fixtures in tests.', 'exercise-input'],
    ]),
    ...notes('choice', 'dev-events', 'Choice conditions differ between JSONPath and JSONata; free text is a planning note.', [
      ['choiceRules', 'Explain branching decisions.', 'Specify expected types, unmatched cases and the default path.', 'Branch behavior is not documented.', 'A missing fallback can fail on unanticipated input.', 'If approved, process; otherwise record rejection; handle missing approval explicitly', 'Translate this intent into the selected language and test every branch.', 'application-intent'],
    ]),
    ...notes('map', 'dev-events', 'Map mode and concurrency are not generic Parallel-state properties; workflow support and child execution context matter.', [
      ['mapParallelControls', 'Plan parallel work boundaries.', 'Identify which rows describe Map iteration versus a separate Parallel state.', 'Parallelism and failure ownership are undocumented.', 'This combined editor table does not make every option valid for both state types.', [{stateName: 'ProcessItems', mode: 'INLINE', maxConcurrency: 5}], 'A Map planning row that must match the ASL state.', 'application-intent'],
      ['mapParallelControls.stateName', 'Identify the parallel-work state.', 'Match the actual Map or Parallel state in the definition.', 'The control row has no state association.', 'Renaming a state requires reviewing its planning references.', 'ProcessItems', 'An exact ASL state key, not a child execution name.', 'application-intent'],
      ['mapParallelControls.mode', 'Choose a Map processing mode.', 'Compare Inline and Distributed requirements for the selected workflow.', 'Map execution mode is undecided.', 'Do not assign a Map mode to an arbitrary Parallel state.', 'INLINE', 'A local iteration model to validate against input size and workflow support.'],
      ['mapParallelControls.maxConcurrency', 'Budget concurrent iteration work.', 'Relate parallel work to downstream capacity and mode-specific behavior.', 'No iteration budget is selected.', 'More parallelism can overload a database or external API.', 5, 'A conservative workload candidate to measure and tune.'],
      ['mapParallelControls.failureHandling', 'Plan partial-work failure recovery.', 'Decide which completed items must be retained, retried or compensated.', 'Partial completion behavior is unspecified.', 'Failing an orchestration does not reverse completed tasks.', 'Record completed item IDs; retry only unfinished safe work', 'Application recovery intent, not an automatic rollback policy.', 'application-intent'],
    ]),
    ...notes('execution', 'dev-data-safety', 'StartExecution idempotency depends on workflow type, name/input and execution state.', [
      ['executionNameAndIdempotency', 'Plan repeat-start behavior.', 'Use stable business identity and handle already-running/completed work deliberately.', 'Duplicate execution-start handling is undocumented.', 'An execution name is not universal exactly-once business processing.', 'Derive execution identity from invoiceId; persist business outcome separately', 'Review Standard/Express start semantics before using name-based retry logic.', 'application-intent'],
    ]),
    ...notes('workflowLogs', 'observe-debug', 'Execution logging differs from execution history and can contain sensitive state payloads.', [
      ['logGroup', 'Choose workflow log storage.', 'Coordinate destination access, retention and workflow type.', 'No log destination is declared.', 'Logs are not an automatic durable business audit record.', local('workflow-logs'), 'A graph log-group reference to resolve and authorize.'],
      ['loggingLevel', 'Choose execution log detail.', 'Select the evidence needed for troubleshooting and privacy constraints.', 'Log detail is unspecified.', 'Verbose logging increases data volume and exposure.', 'ERROR', 'A failure-focused candidate; verify it supports the investigation needs.'],
      ['includeExecutionData', 'Choose whether state data is logged.', 'Review inputs/outputs for sensitive values before inclusion.', 'Payload logging consent is not assumed.', 'Execution data can expose application content in logs.', false, 'Keep payloads excluded while retaining available metadata.'],
    ]),
  },
  kinesis: {
    ...notes('streamCreate', 'dev-events', 'Kinesis Data Streams capacity planning; Region/account limits are not queried.', [
      ['capacityMode', 'Choose stream capacity management.', 'Compare variable demand with planned shard capacity.', 'Capacity management remains undecided.', 'Mode choice changes operational tuning responsibilities.', 'PROVISIONED', 'Use when shard capacity is explicitly planned and monitored.'],
      ['shardCount', 'Plan provisioned shard capacity.', 'Use only with PROVISIONED mode and a measured partition distribution.', 'No provisioned capacity is declared.', 'More shards do not correct a persistently hot partition key.', 2, 'A synthetic starting point requiring throughput measurement.'],
    ]),
    ...notes('stream', 'dev-events', 'Stream delivery and partition concepts; client integrations own their batch settings.', [
      ['partitionKey', 'Define record grouping.', 'Choose a stable business dimension without concentrating all traffic.', 'Ordering and distribution intent are unresolved.', 'Hot keys can concentrate load despite overall spare capacity.', 'customerId', 'A grouping strategy whose distribution should be measured.', 'application-intent'],
      ['consumerMode', 'Choose shared or dedicated consumer delivery.', 'Compare consumer isolation and consumption needs.', 'Consumer transport is undecided.', 'Enhanced fan-out involves registered consumers, not a stream-wide speed toggle.', 'enhanced-fan-out', 'Plan an identified consumer and its delivery permissions.'],
      ['batchSize', 'Budget records per consumer operation.', 'Choose according to KCL, Lambda or another actual consumer.', 'The consumer integration has no batch decision.', 'This is not a universal Kinesis stream configuration field.', 100, 'A processing candidate; validate the selected consumer API and payload.', 'application-intent'],
    ]),
    ...notes('iterator', 'dev-events', 'Initial stream reads; timestamp start needs timestamp context not represented by this single selector.', [
      ['iteratorStart', 'Choose where new consumption begins.', 'Distinguish fresh-only processing from replay of retained records.', 'The initial replay boundary is unknown.', 'LATEST intentionally omits older retained records.', 'TRIM_HORIZON', 'Read from the oldest retained data when rebuilding derived state.'],
    ]),
    ...notes('retention', 'dev-events', 'Retention controls available replay history, not consumer checkpoint correctness.', [
      ['retentionHours', 'Keep records available for recovery.', 'Match outage recovery and replay requirements.', 'The replay window is not chosen.', 'Longer retention adds cost; lag must stay within available history.', 48, 'A two-day recovery requirement to compare with consumer lag.'],
    ]),
    ...notes('kcl', 'dev-events', 'Consumer application responsibilities; no checkpoint or duplicate guard is executed here.', [
      ['checkpointing', 'Record durable processing progress.', 'Advance only after the intended work is safely completed.', 'Restart behavior is undocumented.', 'A checkpoint before completion can lose work; late checkpoints can replay it.', 'Checkpoint after durable output commit', 'Specify handling of a crash between commit and checkpoint.', 'application-intent'],
      ['idempotentConsumer', 'Plan replay-safe side effects.', 'Use stable record/business identity when repeats are possible.', 'Replay safety is unknown.', 'Checking this box does not implement deduplication.', true, 'Require tests that replay the same logical work.', 'application-intent'],
      ['failureHandling', 'Define poison-record and outage recovery.', 'Choose retry, investigation and replay behavior for the consumer framework.', 'No recovery policy is documented.', 'A stalled consumer can age past retention.', 'Retry transient failures; isolate poison records with source identifiers', 'Keep enough evidence to replay after repair.', 'application-intent'],
    ]),
    ...notes('streamEncryption', 'security-kms', 'Kinesis encryption/key access; graph references are not real key permissions.', [
      ['encryption', 'Choose encryption-key ownership.', 'Compare AWS-managed and customer-managed key requirements.', 'Key ownership is undecided.', 'Encryption does not authorize producers or readers.', 'customer-managed-key', 'Use when the workload requires a separately managed key policy.'],
      ['kmsKey', 'Identify the customer-managed key.', 'Resolve the correct Region/key policy for the stream.', 'No specific key is asserted.', 'Key access can fail independently from stream permissions.', local('stream-key'), 'Review producer and consumer key usage separately.'],
      ['producerRole', 'Identify the publishing workload role.', 'Grant only the stream actions used by the producer.', 'Publisher authorization is unspecified.', 'The role must also satisfy applicable encryption permissions.', role('stream-producer'), 'A design role reference, not verified access.'],
      ['consumerRole', 'Identify the reading workload role.', 'Match polling or enhanced-fan-out actions to the actual consumer.', 'Reader authorization is unspecified.', 'A producer role is not automatically suitable for reading.', role('stream-reader'), 'Review consumer identity and encryption access together.'],
    ]),
    ...notes('streamMetrics', 'measure-optimize', 'Enhanced metrics are shard-level monitoring choices, not workload processing controls.', [
      ['enhancedMonitoring', 'Select shard-level diagnostic signals.', 'Use when aggregate stream metrics hide hot shards or lag.', 'No enhanced metrics are selected in this design.', 'Extra metric visibility can incur monitoring cost.', ['IteratorAgeMilliseconds', 'WriteProvisionedThroughputExceeded'], 'Watch both reader lag and producer capacity pressure.'],
    ]),
  },
};
