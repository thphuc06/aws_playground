/** Bounded, browser-only teaching model. Never an AWS deployment validator. */
import {canvasCatalog as serviceCatalog} from './serviceCatalog';
export type ServiceType = string;
export interface BuilderNode { id: string; service: ServiceType; label: string }
export interface BuilderEdge { id: string; source: string; target: string; label?: string }
export interface EdgeConfig { integration: boolean; permission: boolean; eventSource: boolean; visibility: number; functionTimeout: number; partialBatch: boolean }
export interface Finding { severity: 'error' | 'warning' | 'info'; edgeId?: string; nodeId?: string; title: string; detail: string; sourceUrl: string }
export interface BuilderEvent { id: string; nodeId: string; edgeId?: string; title: string; detail: string }
export interface IntegrationRule { id: string; source: ServiceType; target: ServiceType; label: string; permissionLabel: string; requirements: string[]; sourceUrl: string; examSkills: string[] }
export const defaultEdgeConfig: Readonly<EdgeConfig> = Object.freeze({ integration: false, permission: false, eventSource: false, visibility: 30, functionTimeout: 5, partialBatch: false });
export const palette: {service: ServiceType; label: string; description: string}[] = [
  { service: 'api', label: 'API Gateway', description: 'HTTP API route and Lambda proxy integration' },
  { service: 'lambda', label: 'Lambda', description: 'Function handler and execution-role permissions' },
  { service: 'dynamodb', label: 'DynamoDB', description: 'A table receiving a modeled PutItem request' },
  { service: 'sqs', label: 'SQS', description: 'Standard queue with a Lambda polling consumer' },
];
const urls = {
  api: 'https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html',
  route: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html',
  ddb: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/iam-policy-specific-table-indexes.html',
  send: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-api-permissions-reference.html',
  poll: 'https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-configure.html',
  role: 'https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html',
  consumer: 'https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AWSLambdaSQSQueueExecutionRole.html',
  exam: 'https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html',
  security: 'https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain2.html',
};
export const builderSources = Object.entries(urls).map(([id, url]) => ({ id, url, title: ({api:'API Gateway invocation permissions',route:'HTTP API Lambda proxy integration',ddb:'Table-scoped DynamoDB permissions',send:'SQS action/resource permissions',poll:'SQS event source configuration',role:'Lambda execution role',consumer:'SQS consumer actions',exam:'DVA-C02 development objectives',security:'DVA-C02 security objectives'} as Record<string,string>)[id], verified: '2026-11-01' }));
export const builderLimitations = [
  'Browser simulation only: no AWS credentials, network requests to AWS, resources, or charges.',
  'The catalog represents a dated snapshot of the published in-scope list, which AWS says is non-exhaustive. All entries are placeable; the whole-graph walkthrough checks four directional integrations. EventBridge has a separate selected-node exact-pattern and target-readiness preview, not a downstream runtime. Unsupported here does not mean impossible in AWS. Graphs are limited to 100 nodes, 200 edges, and no cycles.',
  'Permission switches assert correctly scoped policies; this is not a policy parser or a complete IAM evaluation. Execution roles, Lambda trust, valid handler code, and same-account/same-Region resources are assumed.',
  'API Gateway means HTTP API with a deployed route and payload format 2.0. DynamoDB models PutItem only. SQS means a standard queue, zero batch window, and no customer-managed KMS key.',
  'VPC networking, cross-account policies, authorization, encryption, quotas, retries, duplicate deliveries, DLQs, deployment, and cost are not validated. Production designs need independent review.',
  'Trace is a deterministic dependency-order walkthrough, not distributed runtime timing. Each incoming edge represents a separate illustrative event; multiple sources do not imply a join.',
];
export const integrationRules: IntegrationRule[] = [
  { id:'api-lambda', source:'api', target:'lambda', label:'Invoke function', permissionLabel:'Lambda resource policy: allow API Gateway lambda:InvokeFunction, scoped to this API', requirements:['integration','permission'], sourceUrl:urls.api, examSkills:['1.1.6','2.1.8'] },
  { id:'lambda-dynamodb', source:'lambda', target:'dynamodb', label:'Write item', permissionLabel:'Lambda execution role: dynamodb:PutItem on this table ARN', requirements:['permission'], sourceUrl:urls.ddb, examSkills:['1.3','2.1.6'] },
  { id:'lambda-sqs', source:'lambda', target:'sqs', label:'Send message', permissionLabel:'Lambda execution role: sqs:SendMessage on this queue ARN', requirements:['permission'], sourceUrl:urls.send, examSkills:['1.1.8','2.1.6'] },
  { id:'sqs-lambda', source:'sqs', target:'lambda', label:'Poll and invoke', permissionLabel:'Consumer Lambda execution role: sqs:ReceiveMessage, sqs:DeleteMessage, sqs:GetQueueAttributes on this queue', requirements:['permission','eventSource','visibility','functionTimeout','partialBatch'], sourceUrl:urls.poll, examSkills:['1.1.8','2.1.6'] },
];
export function getIntegrationRule(source: ServiceType, target: ServiceType): IntegrationRule | undefined { return integrationRules.find(r => r.source === source && r.target === target); }
function topological(nodes: readonly BuilderNode[], edges: readonly BuilderEdge[]): BuilderNode[] {
  const degree = new Map(nodes.map(n => [n.id, 0]));
  edges.forEach(e => degree.set(e.target, (degree.get(e.target) ?? 0) + 1));
  const ready = nodes.filter(n => degree.get(n.id) === 0), result: BuilderNode[] = [];
  for (let i = 0; i < ready.length; i++) { const n = ready[i]; result.push(n); for (const e of edges.filter(e => e.source === n.id)) { degree.set(e.target, degree.get(e.target)! - 1); if (degree.get(e.target) === 0) { const next = nodes.find(n => n.id === e.target); if (next) ready.push(next); } } }
  return result;
}
export function validateGraph(nodes: readonly BuilderNode[], edges: readonly BuilderEdge[], configs: Record<string, EdgeConfig>): Finding[] {
  const out: Finding[] = [];
  const add = (severity: Finding['severity'], title: string, detail: string, edgeId?: string, sourceUrl = urls.exam, nodeId?: string) => out.push({ severity, title, detail, edgeId, sourceUrl, nodeId });
  if (!nodes.length) add('error','Add a service','Start with the service palette.');
  if (!edges.length) add('error','Connect your services','At least one supported integration is needed to run this teaching model.');
  if (nodes.length > 100 || edges.length > 200) add('error','Teaching canvas limit','Use at most 100 nodes and 200 edges. This is an app limit, not an AWS quota.');
  const ids = new Set<string>();
  for (const n of nodes) {
    if (!n.id || ids.has(n.id)) add('error','Duplicate or empty node ID','Each node needs a unique non-empty identifier.',undefined,urls.exam,n.id);
    ids.add(n.id);
    const catalogEntry=serviceCatalog.find(p=>p.id===n.service);
    if(!catalogEntry)add('error','Unknown service','Choose a service from the official published-list catalog.',undefined,urls.exam,n.id);
    else if(n.service==='eventbridge')add('error','EventBridge has a separate rule preview',`${n.label} has exam-scoped pattern and target-readiness checks in its selected-node inspector. It is not part of this four-integration whole-graph walkthrough. Select the EventBridge node to preview it.`,undefined,urls.exam,n.id);
    else if(!catalogEntry.modeled)add('error','Reference-only service',`${n.label} is placeable for diagramming, but its configuration and runtime are not modeled. This graph cannot run as a validated simulation.`,undefined,urls.exam,n.id);
    if (!edges.some(e => e.source === n.id || e.target === n.id)) add('warning','Disconnected service',`${n.label} is not part of the walkthrough.`,undefined,urls.exam,n.id);
  }
  const edgeIds = new Set<string>(), pairs = new Set<string>();
  for (const e of edges) {
    if (!e.id || edgeIds.has(e.id)) add('error','Duplicate or empty connection ID','Each connection needs a unique non-empty identifier.',e.id);
    edgeIds.add(e.id);
    const pair = JSON.stringify([e.source,e.target]);
    if (pairs.has(pair)) add('error','Duplicate connection','One connection per service pair is modeled.',e.id);
    pairs.add(pair);
    const from = nodes.find(n => n.id === e.source), to = nodes.find(n => n.id === e.target);
    if (!from || !to) { add('error','Missing endpoint','Remove or reconnect this dangling connection.',e.id); continue; }
    if (from.id === to.id) { add('error','Self connection not modeled','Connect two different services.',e.id); continue; }
    const rule = getIntegrationRule(from.service,to.service);
    if (!rule && from.service==='eventbridge' && ['lambda','sqs'].includes(to.service)) { add('error','Use EventBridge target preview',`${from.label} → ${to.label} can be checked in the EventBridge node inspector. This whole-graph walkthrough does not execute EventBridge delivery or downstream behavior.`,e.id); continue; }
    if (!rule) { add('error','Diagram-only relationship',`${from.label} → ${to.label} is an unvalidated diagram-only relationship, not necessarily impossible in AWS. Keep it for architecture notes; it cannot execute in this teaching simulation.`,e.id); continue; }
    const c = { ...defaultEdgeConfig, ...configs[e.id] };
    if (c.permission !== true) add('error','Permission required',rule.permissionLabel + '. This is separate from the route or trigger configuration.',e.id,rule.sourceUrl);
    if (rule.id === 'api-lambda' && c.integration !== true) add('error','HTTP route integration required','Configure a deployed HTTP API route targeting this Lambda with payload format 2.0. Execution-role permissions do not grant API Gateway invocation access.',e.id,urls.route);
    if (rule.id === 'sqs-lambda') {
      if (c.eventSource !== true) add('error','Event source mapping required','Enable a Lambda event source mapping for this queue. Lambda polls SQS; SQS does not directly push an invocation.',e.id,urls.poll);
      if (!Number.isFinite(c.visibility) || !Number.isFinite(c.functionTimeout) || c.visibility <= 0 || c.functionTimeout <= 0) add('error','Invalid timeout','Enter finite positive timeout values in seconds.',e.id,urls.poll);
      else if (c.visibility < c.functionTimeout) add('error','Visibility is shorter than function timeout','AWS rejects this event source mapping: queue visibility must be at least the function timeout.',e.id,urls.poll);
      else if (c.visibility < 6 * c.functionTimeout) add('warning','Increase visibility for retry headroom',`AWS recommends at least ${6*c.functionTimeout}s here (6 × function timeout; modeled batch window is 0s).`,e.id,urls.poll);
      if (!c.partialBatch) add('info','Whole-batch retry behavior','On a handler batch failure, successful records can be retried too. Partial batch responses require both the mapping setting and handler failure reporting.',e.id,urls.poll);
      else add('info','Partial batch responses modeled','Assumes ReportBatchItemFailures and handler code returning failed item identifiers. This reduces retries of successful items; it does not guarantee exactly-once delivery.',e.id,urls.poll);
    }
  }
  const existing = edges.filter(e => ids.has(e.source) && ids.has(e.target));
  if (topological(nodes,existing).length < nodes.length) add('error','Cycle not modeled','This teaching walkthrough requires a directed acyclic graph. This is not a claim that all cycles are invalid AWS architectures.');
  return out;
}
export function simulateGraph(nodes: readonly BuilderNode[], edges: readonly BuilderEdge[], configs: Record<string, EdgeConfig>): {valid: boolean; findings: Finding[]; events: BuilderEvent[]} {
  const findings = validateGraph(nodes,edges,configs);
  if (findings.some(f => f.severity === 'error')) return { valid:false, findings, events:[] };
  const events: BuilderEvent[] = [];
  const push = (nodeId: string,title: string,detail: string,edgeId?: string) => events.push({id:`event-${events.length+1}`,nodeId,edgeId,title,detail});
  for (const n of topological(nodes,edges)) {
    if (!edges.some(e => e.target === n.id) && edges.some(e => e.source === n.id)) push(n.id,`Seed ${n.label}`, n.service === 'api' ? 'A mock HTTP request reaches the configured route.' : n.service === 'sqs' ? 'A sample message is placed in this queue by an external producer.' : 'An external mock invocation starts this function.');
    for (const e of edges.filter(e => e.target === n.id)) {
      const from = nodes.find(n => n.id === e.source)!;
      const rule = getIntegrationRule(from.service,n.service)!;
      const detail: Record<string,string> = {
        'api-lambda':'The route targets Lambda; its resource-based policy permits API Gateway. A synchronous proxy invocation is illustrated.',
        'lambda-dynamodb':'The function uses its execution role for a table-scoped PutItem. A mock item is accepted; no real table is accessed.',
        'lambda-sqs':'The function uses its execution role to send a mock message to the target queue. Acceptance is not proof of downstream processing.',
        'sqs-lambda':'The enabled event source mapping polls with the consumer execution role and invokes Lambda with a mock batch. Successful processing allows message deletion.',
      };
      push(n.id,`${from.label} → ${n.label}: ${rule.label}`,detail[rule.id],e.id);
    }
  }
  return {valid:true,findings,events};
}
