/** Deterministic teaching model. No AWS calls or real-time scheduling. Times are virtual seconds. */
export type MissionId = 'serverless' | 'queue' | 'deployment';
export interface Config {
  permission: boolean; timeout: boolean; poison: boolean; idempotent: boolean;
  partialBatch: boolean; visibility: number; maxReceives: number; canary: number;
  faultyVersion: boolean; rollback: boolean;
}
export interface SimEvent {
  id: number; time: number; node: string; title: string; detail: string;
  status: 'success' | 'error' | 'warning' | 'info';
  payload?: string; metrics?: Record<string, number>;
}
export const defaultConfig: Config = {
  permission: true, timeout: false, poison: false, idempotent: true,
  partialBatch: true, visibility: 30, maxReceives: 3, canary: 10,
  faultyVersion: false, rollback: true,
};
export const assumptions: Record<MissionId, string[]> = {
  serverless: [
    'One valid POST /tasks request uses a synchronous Lambda integration. IAM is simplified to one required execution-role action, not the complete AWS policy evaluator.',
    'The timeout occurs before the modeled write. In real systems a client timeout does not prove a downstream write did not happen.',
    'The Lambda function catches AccessDenied and returns a deliberate 500 response. This is not a universal API Gateway error mapping.',
    'Query targets a partition key; Scan reads a broader dataset. This run demonstrates a strongly consistent GetItem on a table, not a GSI or a performance benchmark.',
  ],
  queue: [
    'A standard SQS queue and Lambda event source mapping are modeled, not FIFO or Lambda asynchronous invocation retries.',
    'A two-record batch contains a valid task and a task that fails once, or permanently when poison mode is enabled. A duplicate copy is deliberately injected to demonstrate at-least-once delivery.',
    'The virtual visibility window starts when messages are received. Polling backoff, concurrent consumers, batching windows, retention, and real AWS timing are omitted.',
    'The redrive boundary is modeled after maxReceiveCount unsuccessful receives when another delivery would exceed that limit. Actual redrive timing is asynchronous.',
    'Partial response mode assumes ReportBatchItemFailures is enabled and the handler returns failed message IDs without throwing. Idempotency assumes an atomic durable operation-key check with the side effect.',
  ],
  deployment: [
    'This is a simplified CodeDeploy-controlled Lambda alias rollout. An alias alone does not evaluate alarms or automatically roll back.',
    'A deterministic 100-request teaching cohort exactly follows the selected percentage. Actual weighted-alias routing is probabilistic, so small samples differ.',
    'The configured error alarm fires when at least one modeled v2 error occurs. Real alarms require explicit thresholds, periods, missing-data behavior, and deployment configuration.',
    'All latency, traffic, and metrics here are illustrative. No deployment or CloudWatch alarm is created.',
  ],
};
export const engineSources = [
  'https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html',
  'https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html',
  'https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-configure.html',
  'https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html',
];
const clamp = (n: number, min: number, max: number, fallback: number) => Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
export function simulate(mission: MissionId, config: Config): SimEvent[] {
  const c = { ...defaultConfig, ...config, visibility: clamp(config.visibility, 1, 300, 30), maxReceives: clamp(config.maxReceives, 1, 10, 3), canary: clamp(config.canary, 0, 100, 10) };
  const events: SimEvent[] = [];
  let time = 0;
  const emit = (node: string, title: string, detail: string, status: SimEvent['status'] = 'info', payload?: unknown, metrics?: Record<string, number>, advance = 1) => {
    time += advance;
    events.push({ id: events.length + 1, time, node, title, detail, status, ...(payload === undefined ? {} : {payload: JSON.stringify(payload, null, 2)}), ...(metrics ? {metrics} : {}) });
  };
  if (mission === 'serverless') {
    emit('api', 'Request received', 'API Gateway receives a valid request with a correlation ID. The example rejects missing titles before writing.', 'info', { method: 'POST', path: '/tasks', requestId: 'req-001', body: {title: 'Study IAM'} });
    emit('lambda', 'Validate input', 'The handler checks that title is a non-empty string and uses an allowlist of accepted fields.', 'success', {valid: true, requestId: 'req-001'});
    emit('lambda', 'Check execution role', 'The Lambda execution role, not the caller’s identity, supplies permission for this downstream DynamoDB action.', c.permission ? 'success' : 'error', {action: 'dynamodb:PutItem', resource: 'Tasks', allowed: c.permission});
    if (!c.permission) {
      emit('lambda', 'Write blocked', 'AccessDenied stops the write. Repair the narrowly scoped execution-role policy; do not grant AdministratorAccess.', 'error', {error: 'AccessDeniedException'}, {writes: 0, errors: 1});
      emit('api', 'Error response', 'The sample handler maps this caught application failure to HTTP 500. No item was created in this model.', 'error', {statusCode: 500, requestId: 'req-001'});
      return events;
    }
    if (c.timeout) {
      emit('lambda', 'Function timed out', 'The simulated dependency delay exhausts the function timeout before the write. Investigate duration, downstream calls, and retry safety.', 'error', {error: 'Task timed out', requestId: 'req-001'}, {writes: 0, errors: 1}, 3);
      emit('api', 'Integration failed', 'The client receives an integration error. API Gateway behavior depends on API and integration configuration; a client retry must be safe.', 'error');
      return events;
    }
    emit('dynamo', 'Persist task', 'PutItem stores the validated task. A production create flow should protect its operation key with a condition to avoid an unintended overwrite.', 'success', {PK: 'USER#demo', SK: 'TASK#001', title: 'Study IAM'}, {writes: 1, errors: 0});
    emit('dynamo', 'Read by key', 'GetItem with ConsistentRead=true verifies the table item. Query uses partition-key conditions for collections; Scan is not a replacement for a well-designed access pattern.', 'success', {operation: 'GetItem', ConsistentRead: true});
    emit('api', 'Created response', 'The handler returns the created identifier and correlation ID. Structured logs correlate the request without recording secrets.', 'success', {statusCode: 201, taskId: '001', requestId: 'req-001'}, {writes: 1, errors: 0});
  } else if (mission === 'queue') {
    let writes = 0; let deleted = 0; let dlq = 0; let duplicateSent = false;
    const applied = new Set<string>();
    let pending = ['task-A', 'task-B'];
    emit('producer', 'Enqueue tasks', 'The producer sends two records. A is valid; B has a transient dependency failure, or a permanent malformed payload in poison mode.', 'success', {messages: pending, queueType: 'standard'}, {visible: 2, inFlight: 0, writes});
    if (c.visibility < 6) emit('queue', 'Short visibility warning', 'This lesson assumes a one-second function timeout. AWS recommends visibility of at least six times that timeout plus any batching window; too-short visibility risks overlapping deliveries.', 'warning');
    for (let receive = 1; receive <= c.maxReceives && pending.length; receive++) {
      const batch = [...pending];
      const receiveTime = time + 1;
      emit('queue', 'Receive batch', `Receive ${receive}: records become invisible until virtual t=${receiveTime + c.visibility}. Receiving does not delete them.`, 'info', {messages: batch, ApproximateReceiveCount: receive, visibilityTimeout: c.visibility}, {visible: 0, inFlight: batch.length, writes, deleted, dlq});
      const failures: string[] = [];
      for (const id of batch) {
        const fails = id === 'task-B' && (c.poison || receive === 1);
        if (fails) {
          failures.push(id);
          emit('worker', 'Record failed', `${id}: ${c.poison ? 'permanent payload failure' : 'transient downstream failure'}. The record is not acknowledged as successful.`, 'error', {messageId: id, receiveCount: receive});
        } else {
          if (c.idempotent && applied.has(id)) {
            emit('dynamo', 'Duplicate suppressed', `${id} already has a durable operation key. Acknowledge the delivery without applying its effect again.`, 'success', {operationKey: id}, {writes, deleted, dlq});
          } else {
            writes++; applied.add(id);
            emit('dynamo', 'Apply task once', `${id}: the operation is applied${c.idempotent ? ' with an atomic idempotency guard' : ' without an idempotency guard; repeated delivery can apply it again'}.`, c.idempotent ? 'success' : 'warning', {operationKey: id}, {writes, deleted, dlq});
          }
        }
      }
      const acknowledged = failures.length === 0 ? batch : c.partialBatch ? batch.filter(id => !failures.includes(id)) : [];
      if (acknowledged.length) {
        deleted += acknowledged.length;
        emit('queue', 'Delete successful records', 'After a successful response, the Lambda event source mapping deletes acknowledged records. Partial responses must identify only failed records.', 'success', {deleted: acknowledged, batchItemFailures: failures.map(itemIdentifier => ({itemIdentifier}))}, {writes, deleted, inFlight: batch.length - acknowledged.length, dlq});
      }
      pending = failures.length === 0 ? [] : c.partialBatch ? failures : batch;
      if (failures.length && !c.partialBatch) emit('worker', 'Whole batch retries', 'Without partial batch reporting, the failed batch leaves even successfully processed records unacknowledged. Their side effects may already have happened.', 'warning', {retry: pending});
      if (!duplicateSent && applied.has('task-A')) {
        duplicateSent = true;
        emit('queue', 'Duplicate delivery', 'An injected duplicate copy of task-A demonstrates standard-queue at-least-once delivery. Deletion does not replace idempotent processing.', 'warning', {messageId: 'copy-A', operationKey: 'task-A'});
        if (c.idempotent) emit('dynamo', 'Duplicate suppressed', 'The duplicate copy carries the same operation key; it produces no second side effect.', 'success', {operationKey: 'task-A'}, {writes, deleted, dlq});
        else { writes++; emit('dynamo', 'Duplicate applied again', 'Without the operation-key guard, the same logical task causes another side effect.', 'error', {operationKey: 'task-A'}, {writes, deleted, dlq}); }
        deleted++;
        emit('queue', 'Delete duplicate copy', 'The successfully handled duplicate delivery is acknowledged and deleted.', 'success', {messageId: 'copy-A'}, {writes, deleted, dlq});
      }
      if (pending.length) {
        time = Math.max(time, receiveTime + c.visibility);
        emit('queue', 'Visibility expires', 'Unacknowledged records can be received again. Expiry is not deletion or an immediate guarantee that a consumer runs.', 'warning', {available: pending}, {visible: pending.length, inFlight: 0, writes, deleted, dlq}, 0);
        if (receive === c.maxReceives) {
          dlq += pending.length;
          emit('dlq', 'Redrive to DLQ', 'The configured unsuccessful-receive budget is exhausted; the model moves remaining records to the DLQ before another source-queue delivery. Inspect and fix the cause before replay.', 'error', {messages: pending, maxReceiveCount: c.maxReceives}, {visible: 0, inFlight: 0, writes, deleted, dlq});
          pending = [];
        }
      }
    }
    emit('worker', 'Queue run complete', 'Compare side effects, acknowledgments, and DLQ records. Retries belong to this SQS event-source model, not a universal Lambda retry policy.', dlq ? 'warning' : 'success', {idempotent: c.idempotent, partialBatch: c.partialBatch}, {writes, deleted, dlq, visible: 0, inFlight: 0});
  } else {
    emit('source', 'Commit selected', 'A versioned commit starts the illustrative delivery workflow; no real repository or cloud resource is changed.', 'info', {commit: 'demo-c02'});
    emit('build', 'Build and test', 'Dependencies are installed from a lockfile; unit tests and infrastructure validation pass before packaging the same immutable artifact for promotion.', 'success', {checks: ['unit tests', 'template validation', 'package']});
    emit('v2', 'Publish candidate version', 'Lambda version 2 is immutable. Staging validation has passed in this simplified scenario; deployment still needs production observation.', 'success', {version: '2'});
    emit('alias', 'Shift canary traffic', `The live alias initially routes ${100 - c.canary}% to v1 and ${c.canary}% to v2. The deployment controller observes alarms.`, 'info', {v1Weight: 100 - c.canary, v2Weight: c.canary});
    if (c.canary < 100) emit('v1', 'Stable version responses', 'Version 1 succeeds for its deterministic cohort.', 'success', {version: '1', requestId: 'request-v1-001'}, {requests: 100 - c.canary, errors: 0});
    const errors = c.faultyVersion ? c.canary : 0;
    if (c.canary > 0) emit('v2', c.faultyVersion ? 'Candidate requests fail' : 'Candidate requests succeed', c.faultyVersion ? 'Structured logs identify a missing environment variable in v2. Trace and request IDs connect the failure to the candidate version.' : 'Version 2 succeeds in its deterministic cohort. This is evidence for the observation window, not proof of all future behavior.', c.faultyVersion ? 'error' : 'success', {version: '2', requestId: 'request-v2-001', traceId: 'trace-demo-002', ...(c.faultyVersion ? {error: 'Missing TASKS_TABLE configuration'} : {})}, {requests: c.canary, errors});
    if (errors > 0) {
      emit('monitor', 'Alarm enters ALARM', 'The deliberately simplified error alarm detects candidate failures. Real CloudWatch alarm periods and thresholds must be configured.', 'error', {version: '2', state: 'ALARM'}, {requests: 100, errors, errorRate: errors});
      if (c.rollback) emit('alias', 'Rollback to stable', 'The configured deployment controller stops the release and restores the alias to 100% v1. Rollback restores traffic, not data side effects.', 'success', {v1Weight: 100, v2Weight: 0, deployment: 'rolled-back'}, {v1Weight: 100, v2Weight: 0, errors});
      else emit('alias', 'Manual intervention required', 'Automatic rollback is disabled in this lesson. Candidate traffic remains at the selected weight; an operator must stop or repair the release.', 'warning', {v1Weight: 100 - c.canary, v2Weight: c.canary, deployment: 'held'}, {v1Weight: 100 - c.canary, v2Weight: c.canary, errors});
    } else if (c.canary === 0) {
      emit('monitor', 'No candidate evidence', 'A 0% candidate weight sends no requests to v2. The lesson holds the release rather than claiming the candidate was validated.', 'warning', {deployment: 'held', v1Weight: 100, v2Weight: 0}, {v1Weight: 100, v2Weight: 0, errors: 0});
    } else {
      emit('monitor', 'Observation window healthy', 'The configured window completes with no modeled errors. Real deployment decisions should include service-specific health signals.', 'success', {state: 'OK'}, {requests: 100, errors: 0});
      emit('alias', 'Promote candidate', 'The deployment controller finishes the simulated rollout to v2. Continue monitoring after promotion.', 'success', {v1Weight: 0, v2Weight: 100, deployment: 'succeeded'}, {v1Weight: 0, v2Weight: 100, errors: 0});
    }
  }
  return events;
}
