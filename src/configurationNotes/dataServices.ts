import type {ConfigSource, JsonValue} from '../configurationTypes';
import type {EventServiceNote} from './eventServices';

/** Pure, explicitly authored field documentation. It never imports or mutates the registry. */
export type DataServiceNote = EventServiceNote;
const checked = '2026-11-03';
const ref = (title: string, url: string): ConfigSource => ({title, url, verified: checked});
const D = 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/', S = 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/', R = 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/', U = 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/', C = 'https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/', B = 'https://docs.aws.amazon.com/ebs/latest/userguide/', F = 'https://docs.aws.amazon.com/efs/latest/', A = 'https://docs.aws.amazon.com/athena/latest/ug/', O = 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/', H = 'https://docs.aws.amazon.com/firehose/latest/dev/';
export const dataNoteSources = {
  ddbKeys: ref('DynamoDB keys and attributes', D + 'HowItWorks.CoreComponents.html'),
  gsi: ref('DynamoDB global secondary indexes', D + 'GSI.html'),
  lsi: ref('DynamoDB local secondary indexes', D + 'LSI.html'),
  projection: ref('DynamoDB index projection', 'https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Projection.html'),
  capacity: ref('DynamoDB capacity modes', D + 'capacity-mode.html'),
  consistency: ref('DynamoDB read consistency', D + 'HowItWorks.ReadConsistency.html'),
  query: ref('DynamoDB key conditions', D + 'Query.KeyConditionExpressions.html'),
  conditions: ref('DynamoDB conditional operations', D + 'Expressions.ConditionExpressions.html'),
  transaction: ref('DynamoDB transactions', D + 'transactions.html'),
  pagination: ref('DynamoDB query pagination', D + 'Query.Pagination.html'),
  ttl: ref('DynamoDB TTL', D + 'TTL.html'),
  streams: ref('DynamoDB Streams', D + 'Streams.html'),
  ddbPolicy: ref('DynamoDB resource policies', D + 'access-control-resource-based.html'),
  ddbBackup: ref('DynamoDB point-in-time recovery', D + 'Point-in-time-recovery.html'),
  ddbErrors: ref('DynamoDB errors and retries', D + 'Programming.Errors.html'),
  ddbMetrics: ref('DynamoDB alarm dimensions', D + 'Monitoring-metrics-creating-cloudwatch-alarms.html'),
  ddbEncryption: ref('DynamoDB encryption at rest', D + 'EncryptionAtRest.html'),
  bucketNames: ref('General-purpose bucket naming', S + 'bucketnamingrules.html'),
  buckets: ref('S3 bucket types and configuration', S + 'UsingBucket.html'),
  ownership: ref('S3 Object Ownership', S + 'about-object-ownership.html'),
  publicAccess: ref('S3 Block Public Access', S + 'access-control-block-public-access.html'),
  bucketPolicy: ref('S3 bucket policies', S + 'bucket-policies.html'),
  acl: ref('S3 ACL overview', S + 'acl-overview.html'),
  objectEncryption: ref('S3 default encryption', S + 'bucket-encryption.html'),
  bucketKey: ref('S3 Bucket Keys', S + 'bucket-key.html'),
  versioning: ref('S3 object versioning', S + 'Versioning.html'),
  lifecycle: ref('S3 lifecycle management', S + 'object-lifecycle-mgmt.html'),
  transition: ref('S3 lifecycle transition considerations', S + 'lifecycle-transition-general-considerations.html'),
  objectLock: ref('S3 Object Lock', S + 'object-lock.html'),
  notifications: ref('S3 event notifications', S + 'EventNotifications.html'),
  eventbridge: ref('S3 events through EventBridge', S + 'EventBridge.html'),
  cors: ref('S3 browser CORS', S + 'cors.html'),
  presigned: ref('S3 presigned access', S + 'using-presigned-url.html'),
  multipart: ref('S3 multipart upload', S + 'mpuoverview.html'),
  replication: ref('S3 object replication', S + 'replication.html'),
  acceleration: ref('S3 Transfer Acceleration', S + 'transfer-acceleration.html'),
  accessLogs: ref('S3 server access log destinations', S + 'ServerLogs.html'),
  storageClasses: ref('S3 storage classes', S + 'storage-class-intro.html'),
  restore: ref('Restoring archived S3 objects', S + 'restoring-objects.html'),
  dataEvents: ref('S3 operations in CloudTrail', S + 'cloudtrail-logging-s3-info.html'),
  s3Endpoint: ref('S3 VPC gateway endpoints', 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html'),
  s3Performance: ref('S3 performance and retries', S + 'optimizing-performance-guidelines.html'),
  auroraEndpoints: ref('Aurora endpoint roles', U + 'Aurora.Overview.Endpoints.html'),
  auroraCapacity: ref('Aurora Serverless v2 capacity settings', U + 'aurora-serverless-v2.setting-capacity.html'),
  auroraBackup: ref('Aurora backup and restore', U + 'Aurora.Managing.Backups.html'),
  auroraReplicas: ref('Aurora replica and failover roles', U + 'Aurora.Replication.html'),
  auroraConnect: ref('Connecting to Aurora', U + 'Aurora.Connecting.html'),
  auroraIam: ref('Aurora IAM database authentication', U + 'UsingWithRDS.IAMDBAuth.html'),
  rdsCreate: ref('RDS engine and instance creation parameters', 'https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_CreateDBInstance.html'),
  rdsModify: ref('RDS variant-specific modification parameters', 'https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_ModifyDBInstance.html'),
  rdsConnect: ref('Connecting to an RDS instance', R + 'USER_ConnectToInstance.html'),
  rdsIam: ref('RDS IAM database authentication', R + 'UsingWithRDS.IAMDBAuth.html'),
  databaseTls: ref('RDS TLS connections', R + 'UsingWithRDS.SSL.html'),
  proxy: ref('RDS Proxy connection management', R + 'rds-proxy.html'),
  multiAz: ref('RDS Multi-AZ instance versus cluster', R + 'Concepts.MultiAZ.html'),
  rdsReplicas: ref('RDS read replicas', R + 'USER_ReadRepl.html'),
  dbEncryption: ref('RDS encryption ownership', R + 'Overview.Encryption.html'),
  enhancedMonitoring: ref('RDS Enhanced Monitoring', R + 'USER_Monitoring.OS.html'),
  dbLogs: ref('Engine-specific RDS logs', R + 'USER_LogAccess.html'),
  dbNetwork: ref('Database security-group access', R + 'Overview.RDSSecurityGroups.html'),
  securityGroups: ref('Security-group rule semantics', 'https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html'),
  ipPermission: ref('Protocol-specific security-group fields', 'https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_IpPermission.html'),
  cacheTypes: ref('ElastiCache engines and deployment modes', C + 'WhatIs.html'),
  cachePattern: ref('Application cache maintenance strategies', C + 'Strategies.html'),
  cacheConnections: ref('Cache client connection behavior', C + 'BestPractices.Clients.Redis.Connections.html'),
  cacheTls: ref('ElastiCache encryption in transit', C + 'in-transit-encryption.html'),
  cacheEncryption: ref('ElastiCache encryption at rest', C + 'at-rest-encryption.html'),
  cacheIam: ref('ElastiCache IAM authentication', C + 'auth-iam.html'),
  cacheCluster: ref('Node-based Valkey/Redis replication-group creation', 'https://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_CreateReplicationGroup.html'),
  cacheFailover: ref('ElastiCache automatic failover', C + 'AutoFailover.html'),
  cacheLogs: ref('ElastiCache log delivery', C + 'Log_Delivery.html'),
  volumeTypes: ref('EBS volume performance models', B + 'ebs-volume-types.html'),
  volumeEncryption: ref('EBS encryption', B + 'ebs-encryption.html'),
  volumeAttach: ref('EBS volume attachment', B + 'ebs-attaching-volume.html'),
  multiAttach: ref('EBS Multi-Attach requirements', B + 'ebs-volumes-multi.html'),
  termination: ref('EC2 termination and EBS retention', 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-termination-works.html'),
  snapshots: ref('EBS snapshots and recovery', B + 'ebs-snapshots.html'),
  volumeMetrics: ref('EBS I/O characteristics and monitoring', B + 'ebs-io-characteristics.html'),
  filesystemPerformance: ref('EFS performance and throughput modes', F + 'ug/performance.html'),
  filesystemMount: ref('EFS mounts and mount targets', F + 'ug/mounting-fs.html'),
  accessPoints: ref('EFS application access points', F + 'ug/efs-access-points.html'),
  filesystemIam: ref('EFS IAM client authorization', F + 'ug/iam-access-control-nfs-efs.html'),
  filesystemLifecycle: ref('EFS lifecycle transition fields', F + 'APIReference/API_LifecyclePolicy.html'),
  filesystemEncryption: ref('EFS encryption at rest', F + 'ug/encryption-at-rest.html'),
  filesystemBackup: ref('EFS automatic backup policy', F + 'ug/automatic-backups.html'),
  workgroup: ref('Athena workgroup engine choices', A + 'creating-workgroups.html'),
  results: ref('Athena query result location', A + 'query-results-specify-location-workgroup.html'),
  override: ref('Athena client-setting override', A + 'workgroups-settings-override.html'),
  scanBudget: ref('Athena query and workgroup data controls', A + 'workgroups-setting-control-limits-cloudwatch.html'),
  partitions: ref('Athena dataset partitioning', A + 'partitions.html'),
  columnar: ref('Athena columnar storage', A + 'columnar-storage.html'),
  queryAccess: ref('Athena IAM access', A + 'security-iam-athena.html'),
  queryEncryption: ref('Athena encryption choices', A + 'encryption.html'),
  searchDomain: ref('OpenSearch managed domain configuration', O + 'createupdatedomains.html'),
  searchServerless: ref('OpenSearch Serverless collections', O + 'serverless.html'),
  fineGrained: ref('OpenSearch fine-grained access', O + 'fgac.html'),
  searchNetwork: ref('OpenSearch VPC access', O + 'vpc.html'),
  searchTransport: ref('OpenSearch node-to-node encryption', O + 'ntn.html'),
  searchEncryption: ref('OpenSearch encryption at rest', O + 'encryption-at-rest.html'),
  indexing: ref('OpenSearch indexing behavior', O + 'indexing.html'),
  searchOperations: ref('OpenSearch shard and ingestion operations', O + 'bp.html'),
  searchLogs: ref('OpenSearch slow and error logs', O + 'createdomain-configure-slow-logs.html'),
  delivery: ref('Firehose destination delivery contracts', H + 'basic-deliver.html'),
  deliverySettings: ref('Firehose destination-specific settings', H + 'create-destination.html'),
  transformation: ref('Firehose Lambda transformation', H + 'data-transformation.html'),
  format: ref('Firehose record-format conversion', H + 'record-format-conversion.html'),
  deliveryAccess: ref('Firehose source/destination permissions', H + 'controlling-access.html'),
  deliveryLogs: ref('Firehose delivery error logs', H + 'monitoring-with-cloudwatch-logs.html'),
} as const;
type SourceId = keyof typeof dataNoteSources;
type Row = [path: string, purpose: string, when: string, omission: string, effect: string, value: JsonValue, reason: string, semantics?: DataServiceNote['semantics']];
const notes = (source: SourceId, lesson: string, scope: string, rows: Row[]): Record<string, DataServiceNote> => Object.fromEntries(rows.map(([path, purpose, whenToUse, omission, effect, value, explanation, semantics = 'aws-setting']) => [path, {semantics, documentation: {purpose, whenToUse, omission, effects: [effect], examples: [{value, explanation}], relatedLessons: [lesson]}, evidence: {status: semantics === 'aws-setting' ? 'reference-only' : 'needs-context', sourceIds: [source], scope}, source: dataNoteSources[source]}]));
const local = (id: string): JsonValue => ({type: 'node', id});
const role = (id: string): JsonValue => ({type: 'role', id});
const policy = (action: string, resource: string): string => JSON.stringify({Version: '2012-10-17', Statement: [{Effect: 'Allow', Principal: {AWS: 'arn:aws:iam::111122223333:role/study-worker'}, Action: action, Resource: resource}]});

/** These four services share the same SG row contract, not generated per-label guidance. */
const securityNotes = (port: number, workload: string): Record<string, DataServiceNote> => ({
  ...notes('securityGroups', 'security-iam-sts', 'Inline rule intent must be reconciled with the actual shared security group and attachment; it is not IAM authorization.', [
    ['securityRules', 'Describe narrowly scoped network access.', 'Identify the shared group that owns each rule.', 'Traffic access is unspecified.', 'A rule table does not establish a resource attachment.', [{direction: 'ingress', protocol: 'tcp', fromPort: port, toPort: port, peerType: 'security-group', peer: 'client-sg'}], workload + ' client-access example; resolve the actual group.', 'application-intent'],
    ['securityRules.direction', 'Choose ingress or egress.', 'Use ingress for incoming client connections.', 'Rule direction is unknown.', 'Direction determines whether peer means source or destination.', 'ingress', 'Allow the intended client to connect.'],
    ['securityRules.peerType', 'Choose the network peer identity.', 'Prefer the appropriate client group or bounded address range.', 'Peer interpretation is unresolved.', 'Group references and CIDRs have different ownership context.', 'security-group', 'Reference workload clients without exposing a broad CIDR.'],
    ['securityRules.peer', 'Identify the allowed peer.', 'Match the selected peer type and reachable topology.', 'No allowed peer is declared.', 'A peer group reference does not attach that group.', 'client-sg', 'Resolve this logical client group before deployment.'],
    ['securityRules.description', 'Explain why access is needed.', 'Record the application operation and owner.', 'Access rationale is undocumented.', 'Reviewers can identify rules that outlive their workload.', workload + ' application connection', 'Keep the description free of credentials.'],
  ]),
  ...notes('ipPermission', 'security-iam-sts', 'TCP/UDP use ports; ICMP uses type/code; all-protocol selection cannot be narrowed by a port range.', [
    ['securityRules.protocol', 'Choose the traffic protocol.', 'Match the actual database/cache/filesystem client transport.', 'Protocol is unspecified.', 'Selecting all protocols broadens access beyond the port example.', 'tcp', 'A TCP client-access example.'],
    ['securityRules.fromPort', 'Choose start port or ICMP type.', 'Interpret this field using the selected protocol.', 'The lower bound/type is unresolved.', 'ICMP type is not a TCP port.', port, 'TCP example; use the actual listening port.'],
    ['securityRules.toPort', 'Choose end port or ICMP code.', 'For one TCP service, match the start port.', 'The upper bound/code is unresolved.', 'A wide range permits more services than intended.', port, 'Single-port TCP access rather than an arbitrary range.'],
  ]),
});

/** RDS/Aurora share client concerns; engine/Region eligibility remains explicit. */
const databaseClientNotes = (engine: 'rds' | 'aurora'): Record<string, DataServiceNote> => ({
  ...notes(engine === 'aurora' ? 'auroraIam' : 'rdsIam', 'security-iam-sts', 'Authentication eligibility depends on actual engine/version/Region and database-user setup; IAM tokens are not stored here.', [
    ['authentication', 'Choose the database login mechanism.', 'Check supported engine and client behavior before selecting IAM.', 'Authentication is undecided.', 'IAM login does not replace database privileges.', 'password-from-secret', 'An application login backed by a separately managed secret.'],
    ['credentialsSecret', 'Identify the credential reference.', 'Use a managed secret reference where password login is needed.', 'No credential source is selected.', 'The application needs retrieval permission and rotation handling.', local('database-secret'), 'Never paste a password into this workspace.'],
    ['clientRole', 'Identify the calling workload identity.', 'Review secret access or database-connect permission for the chosen login.', 'Caller authorization is unknown.', 'IAM access and SQL privileges are separate.', role('database-client'), 'Resolve the workload role rather than a database administrator identity.', 'application-intent'],
  ]),
  ...notes('databaseTls', 'security-sensitive-data', 'TLS enforcement and driver certificate options are engine/client-specific, not one universal database flag.', [
    ['tlsRequired', 'Require encrypted client connections.', 'Choose supported server parameters and client SSL mode together.', 'Transport protection is unspecified.', 'Encryption alone does not establish server identity.', true, 'A requirement to implement for the selected engine.', 'application-intent'],
    ['certificateValidation', 'Verify database server identity.', 'Configure the driver with approved CA trust and hostname checks.', 'Server authentication is unproven.', 'Disabling validation can accept an unintended server.', true, 'Test certificate rotation without bypassing validation.', 'application-intent'],
  ]),
  ...notes('proxy', 'measure-optimize', 'RDS Proxy availability is engine/Region dependent; strategy selection does not provision a proxy or configure a driver pool.', [
    ['connectionManagement', 'Choose connection reuse ownership.', 'Compare client pooling and a supported proxy with workload concurrency.', 'Connection reuse is undecided.', 'A connection storm can exhaust database capacity.', 'client-pool', 'A client-side strategy needing explicit implementation.', 'application-intent'],
    ['poolMaxConnections', 'Budget application connections.', 'Account for every process/replica pool, not just one instance.', 'Pool capacity is unspecified.', 'Many small pools can exceed the database connection budget.', 10, 'Ten connections per client process must fit the aggregate budget.', 'application-intent'],
  ]),
  ...notes(engine === 'aurora' ? 'auroraConnect' : 'rdsConnect', 'dev-data-safety', 'Timeout and reconnect values belong to the actual client library; server parameters use separate contracts.', [
    ['connectionTimeoutMs', 'Bound client connection establishment.', 'Fit DNS, network and authentication into the request deadline.', 'Connection waiting is unbounded by this design.', 'A connection timeout does not cancel an earlier committed query.', 3000, 'A three-second client candidate to measure.', 'application-intent'],
    ['queryTimeoutMs', 'Bound application query waiting.', 'Coordinate client cancellation with engine statement-timeout behavior.', 'Query waiting policy is unspecified.', 'A timed-out client cannot assume rollback.', 5000, 'Test ambiguous write outcomes before retrying.', 'application-intent'],
    ['reconnectStrategy', 'Recover after failover or broken sessions.', 'Refresh endpoint resolution and discard invalid pooled connections.', 'Failover recovery is undocumented.', 'Reconnecting can leave an uncertain previous transaction outcome.', 'Reconnect with backoff; reconcile transaction outcome before retry', 'Application logic requiring a failover test.', 'application-intent'],
  ]),
  ...notes('dbNetwork', 'security-iam-sts', 'VPC/subnet-group ownership, routes and attached security groups determine connectivity; drawing placement is not proof.', [
    ['vpc', 'Identify database network ownership.', 'Select the network reachable by approved application clients.', 'Network placement is unresolved.', 'VPC selection alone does not create a subnet group.', local('database-vpc'), 'Review subnet/AZ coverage separately.'],
    ['publiclyAccessible', 'Plan external endpoint exposure.', 'Choose according to the approved client connectivity path.', 'Public reachability is not asserted.', 'A public setting does not bypass routes, security groups or authentication.', false, 'Private application-access candidate requiring actual network reachability.'],
  ]),
  ...securityNotes(5432, engine === 'aurora' ? 'Aurora PostgreSQL example' : 'RDS PostgreSQL example'),
  ...notes('dbEncryption', 'security-kms', 'Encryption migration and key eligibility depend on instance/cluster/replica context; no in-place conversion is assumed.', [
    ['storageEncrypted', 'Plan database encryption at rest.', 'Choose at the appropriate creation/restore boundary.', 'Encryption intent is unknown.', 'Existing resources may need a migration rather than a toggle.', true, 'Verify storage, snapshots and replicas in the actual deployment.'],
    ['kmsKey', 'Identify the database encryption key.', 'Review ownership and key availability over the recovery period.', 'No customer-managed key is specified.', 'Key access failures can affect database availability.', local('database-key'), 'A logical key reference requiring actual policy review.'],
  ]),
  ...notes('rdsModify', 'dev-data-safety', 'Deletion protection is instance/cluster-specific and does not prevent all data loss.', [
    ['deletionProtection', 'Guard against resource deletion.', 'Enable on the actual protected instance or cluster boundary.', 'Deletion protection is not asserted.', 'It does not prevent accidental SQL updates or replace backups.', true, 'A lifecycle guard to verify on the deployed resource.'],
  ]),
  ...notes('dbLogs', 'observe-debug', 'Available log types and enabling parameters depend on engine/version; the enum is a union, not universal support.', [
    ['logExports', 'Select useful engine log exports.', 'Choose only logs supported and enabled by the actual engine.', 'No log export is selected.', 'Logs can contain sensitive statements and incur storage cost.', ['postgresql'], 'PostgreSQL example; do not copy to an unrelated engine.'],
  ]),
  ...notes('enhancedMonitoring', 'observe-debug', 'Enhanced Monitoring needs supported database context, interval and monitoring-role configuration beyond this flag.', [
    ['enhancedMonitoring', 'Plan operating-system metrics.', 'Use when OS/process evidence helps diagnose database load.', 'Enhanced Monitoring is not asserted.', 'This differs from ordinary CloudWatch database metrics.', true, 'Specify the actual monitoring role and interval separately.'],
  ]),
});

export const dataServiceNotes: Record<string, Record<string, DataServiceNote>> = {
  athena: {
    ...notes('workgroup', 'dev-data-safety', 'Athena SQL and Spark workgroups have different engine/identity configuration; a workgroup does not grant source-data access.', [
      ['workgroupName', 'Identify the query governance boundary.', 'Separate workloads with different owners or data policies.', 'No workgroup is selected.', 'Clients must actually submit work to the intended workgroup.', 'study-analytics', 'A synthetic workload boundary, not an access grant.'],
      ['engineType', 'Choose SQL or Spark processing.', 'Match query/notebook execution to the supported workgroup type.', 'Execution engine is undecided.', 'Engine type is not interchangeable after creation.', 'athena-sql', 'Use the SQL query contract for this example.'],
      ['engineVersionPolicy', 'Choose engine-upgrade management.', 'Review compatibility before automatic or explicit version selection.', 'Upgrade behavior is unspecified.', 'Explicit policy still needs an actual supported version.', 'automatic', 'Run compatibility tests as the engine changes.'],
      ['catalog', 'Identify the metadata catalog.', 'Match table definitions and connectors used by queries.', 'Metadata resolution is unspecified.', 'A catalog name does not authorize underlying data.', 'AwsDataCatalog', 'An illustrative Glue catalog reference.'],
      ['database', 'Identify the query namespace.', 'Use the database containing the intended table definitions.', 'Default query namespace is unresolved.', 'A namespace is not a relational database server.', 'study_events', 'Resolve real tables and data locations separately.'],
    ]),
    ...notes('queryAccess', 'security-iam-sts', 'Athena SQL caller access spans workgroup, catalog, data and result storage; Spark execution-role context differs.', [
      ['dataSource', 'Identify the queried resource.', 'Review dataset/connector ownership and access.', 'Source data is unresolved.', 'A graph reference does not create a table or connector.', local('analytics-bucket'), 'An S3 source needing schema and partition metadata.', 'application-intent'],
      ['queryRole', 'Identify query execution identity.', 'For SQL, review the calling principal across every data boundary.', 'Caller permissions are unknown.', 'Workgroup access alone is insufficient for S3/KMS data access.', role('analytics-reader'), 'For Spark, resolve the appropriate execution-role contract separately.', 'application-intent'],
    ]),
    ...notes('results', 'dev-data-safety', 'These fields cover customer-managed S3 query-result output; other result-management modes are not modeled here.', [
      ['resultBucket', 'Choose query-result storage.', 'Use an approved destination with suitable ownership and retention.', 'No customer-managed output bucket is selected.', 'Query output can expose sensitive derived data.', local('query-results'), 'Review permissions separately from the input bucket.'],
      ['resultPrefix', 'Organize query result keys.', 'Separate workload/environment outputs deliberately.', 'No result prefix is selected.', 'Prefix naming does not enforce user isolation.', 'study-results/', 'A logical namespace to pair with actual access policy.'],
    ]),
    ...notes('override', 'security-sensitive-data', 'Workgroup enforcement changes how client-provided output/encryption settings are handled.', [
      ['overrideClientSettings', 'Enforce the workgroup result configuration.', 'Use when clients must share approved storage/encryption rules.', 'Override behavior is unspecified.', 'Existing automation may look in the wrong output location after changes.', true, 'Update clients to read actual query result metadata.'],
    ]),
    ...notes('queryEncryption', 'security-kms', 'Result encryption depends on query mode, destination and supported encryption options.', [
      ['resultEncryption', 'Choose query-output protection.', 'Match the approved result storage and key policy.', 'Result encryption choice is undecided.', 'Protecting inputs does not automatically protect all derived outputs.', 'SSE_KMS', 'Verify actual workgroup enforcement and KMS permissions.'],
      ['resultKey', 'Identify result encryption ownership.', 'Use only with a compatible KMS result mode.', 'No result key is selected.', 'Readers need applicable result-bucket and key access.', local('results-key'), 'A logical key distinct from input-data encryption.'],
    ]),
    ...notes('scanBudget', 'measure-optimize', 'Per-query cancellation differs from aggregate workgroup alerting; canceled queries can still incur charges and leave output.', [
      ['bytesScannedCutoff', 'Limit per-query scanned data.', 'Choose a workload budget in bytes.', 'No scan cutoff is selected.', 'This is not a total account spending cap.', 1073741824, 'A one-GiB candidate to compare with expected partition scans.'],
      ['publishMetrics', 'Plan workgroup query evidence.', 'Observe scan volume, errors and performance by workload.', 'Metrics publication is not asserted.', 'Metrics need interpretation and response ownership.', true, 'Pair with actionable query-budget monitoring.'],
    ]),
    ...notes('partitions', 'measure-optimize', 'Partition design belongs to dataset/table organization; this text does not reorganize objects.', [
      ['partitioning', 'Plan selective data access.', 'Align partitions with common query predicates.', 'Dataset pruning is undocumented.', 'A filter cannot prune partitions absent matching metadata/layout.', 'Partition events by day and query bounded date ranges', 'Validate actual scanned bytes, not only query syntax.', 'application-intent'],
    ]),
    ...notes('columnar', 'measure-optimize', 'File format must match actual stored data and table serialization; selecting an enum does not convert files.', [
      ['fileFormat', 'Describe dataset encoding.', 'Choose a supported format aligned with analytical access.', 'Data format is unspecified.', 'Columnar layout can reduce scanned data for selective columns.', 'parquet', 'Requires genuinely Parquet data and correct table metadata.', 'application-intent'],
    ]),
  },
  opensearch: {
    ...notes('searchServerless', 'dev-data-safety', 'Managed domains and Serverless collections use different capacity, security and feature models.', [
      ['deployment', 'Choose the search deployment model.', 'Compare supported APIs, capacity management and governance.', 'Deployment semantics are unresolved.', 'Domain-only settings cannot be assumed valid for a collection.', 'managed-domain', 'A candidate requiring domain-specific configuration.'],
    ]),
    ...notes('searchDomain', 'measure-optimize', 'Managed-domain version and availability choices depend on supported Region, engine and node configuration.', [
      ['engineVersion', 'Choose the domain engine release.', 'Check client/API/plugin compatibility before upgrades.', 'Engine version is unresolved.', 'A family label is not an automatically supported upgrade target.', 'OpenSearch_2.17', 'Illustrative identifier; confirm current regional support before deployment.'],
      ['multiAz', 'Plan supported domain resilience.', 'Review AZ placement, node count and standby topology.', 'Availability topology is unspecified.', 'This boolean cannot represent every domain or Serverless configuration.', true, 'Translate the intent into a supported concrete domain topology.'],
    ]),
    ...notes('searchNetwork', 'security-iam-sts', 'Domain VPC access differs from Serverless network policies; public reachability is not anonymous authorization.', [
      ['networkAccess', 'Choose the network exposure boundary.', 'Use approved private or restricted public access.', 'Exposure is undecided.', 'Network and data authorization are independent checks.', 'vpc', 'Review client reachability and the actual endpoint policy model.'],
      ['vpc', 'Identify private search placement.', 'Select the network reachable by approved clients.', 'VPC context is unresolved.', 'A VPC reference does not establish subnet or security-group configuration.', local('search-vpc'), 'Resolve compatible private-domain topology.'],
    ]),
    ...notes('fineGrained', 'security-iam-sts', 'Fine-grained domain roles differ from Serverless data-access policies; the current IAM policy editor is not a Serverless policy schema.', [
      ['fineGrainedAccess', 'Plan index/document-level authorization.', 'Use a supported domain setup with mapped user/backend roles.', 'Fine-grained access is not asserted.', 'A domain access policy alone does not configure internal role mappings.', true, 'Review identity-to-role mapping before trusting the flag.'],
      ['accessPolicy', 'Describe managed-domain resource access.', 'Scope the intended principal and HTTP API actions.', 'No domain grant is asserted.', 'Serverless collections need their distinct access-policy model.', policy('es:ESHttpGet', 'arn:aws:es:us-east-1:111122223333:domain/study-search/*'), 'Synthetic managed-domain grant, not a Serverless data policy.'],
    ]),
    ...notes('searchTransport', 'security-sensitive-data', 'Node-to-node encryption is a managed-domain feature; client HTTPS is a separate transport boundary.', [
      ['httpsRequired', 'Require encrypted client transport.', 'Configure the supported endpoint enforcement and client verification.', 'Client transport protection is unspecified.', 'HTTPS does not authenticate an index-level operation.', true, 'Verify both the endpoint and client TLS behavior.'],
      ['nodeToNodeEncryption', 'Protect domain internal transport.', 'Use with supported managed-domain configuration.', 'Internal encryption is not asserted.', 'This does not replace client-facing HTTPS.', true, 'Check the actual domain encryption settings.'],
    ]),
    ...notes('searchEncryption', 'security-kms', 'At-rest key choices have deployment/version constraints; Serverless encryption policies are a separate surface.', [
      ['encryptionKey', 'Identify search-data encryption ownership.', 'Resolve the appropriate key configuration for the deployment.', 'No encryption key is selected.', 'KMS policy and lifecycle affect data availability.', local('search-key'), 'A logical reference requiring domain/collection-specific resolution.'],
    ]),
    ...notes('indexing', 'dev-data-safety', 'Index settings and mappings require the actual deployment/API version; this editor does not create indexes.', [
      ['indexes', 'Describe searchable data sets.', 'Separate schemas and access requirements intentionally.', 'No index contract is planned.', 'Incorrect mapping can reject documents or change query behavior.', [{name: 'reports', mapping: '{"properties":{"title":{"type":"text"}}}', primaryShards: 1, replicas: 1}], 'A managed-domain planning example requiring capacity review.'],
      ['indexes.name', 'Identify the target index.', 'Keep producer and query clients on the same naming contract.', 'Index routing is unresolved.', 'An unintended index name can create fragmented data.', 'reports', 'A synthetic index identifier.'],
      ['indexes.mapping', 'Define searchable field types.', 'Match actual document values and required query behavior.', 'Field interpretation is unspecified.', 'Changing existing field types can require reindexing.', '{"properties":{"title":{"type":"text"},"reportId":{"type":"keyword"}}}', 'Separate full-text search from exact identity matching.'],
      ['indexes.primaryShards', 'Plan supported index partitioning.', 'Review data size, request patterns and deployment restrictions.', 'Shard topology is unspecified.', 'More shards add overhead and are not a universal speed improvement.', 1, 'A small managed-domain index candidate.'],
      ['indexes.replicas', 'Plan index redundancy/read capacity.', 'Fit replica placement to the actual domain topology.', 'Replica settings are unknown.', 'Unassignable replicas do not provide resilience.', 1, 'Validate allocation and deployment support.'],
    ]),
    ...notes('searchOperations', 'dev-data-safety', 'Ingestion and retry correctness are application behavior, not index settings.', [
      ['ingestion', 'Plan document update identity.', 'Choose deterministic IDs and schema/version handling.', 'Write ownership is undocumented.', 'Retries with new IDs can duplicate logical documents.', 'Use reportId as document ID; validate mapping before bulk ingest', 'An ingestion contract requiring implementation.', 'application-intent'],
      ['bulkFailures', 'Handle each bulk-operation outcome.', 'Inspect per-item failures even when the HTTP request succeeds.', 'Partial failure recovery is undefined.', 'Treating a batch HTTP success as universal success can lose records.', 'Retry eligible failed items; isolate mapping failures', 'Preserve failed record IDs and reasons.', 'application-intent'],
      ['clientRetry', 'Bound client retry pressure.', 'Retry transient failures with a request budget.', 'Retry behavior is undocumented.', 'Unbounded concurrent retries can worsen an overloaded domain.', 'Back off transient failures; do not retry invalid mappings unchanged', 'Test mixed permanent and temporary failures.', 'application-intent'],
    ]),
    ...notes('searchLogs', 'observe-debug', 'Log types, thresholds and access permissions are deployment/version-specific; not every error appears in logs.', [
      ['logPublishing', 'Select actionable search logs.', 'Choose slow/error/audit evidence needed for investigations.', 'No log publication is selected.', 'Sensitive query content and delivery cost require review.', ['SEARCH_SLOW_LOGS'], 'Set supported thresholds and destination permissions separately.'],
    ]),
  },
  firehose: {
    ...notes('delivery', 'dev-events', 'Source and destination contracts differ; the catalog is a subset of currently supported Firehose targets.', [
      ['sourceType', 'Choose the delivery-stream ingestion path.', 'Match direct producer calls, Kinesis or supported MSK source behavior.', 'Ingress ownership is undecided.', 'Source choice changes permissions and ingestion behavior.', 'KinesisStreamAsSource', 'A stream-backed example requiring source configuration.'],
      ['destinationType', 'Choose the delivered data system.', 'Review its record format, retry and backup contract.', 'Delivery behavior is unresolved.', 'One generic buffer or compression rule cannot describe every destination.', 's3', 'An S3 delivery example, not a destination-independent default.'],
      ['sourceStream', 'Identify the source stream.', 'Use when the selected source type consumes a modeled stream.', 'Source identity is unresolved.', 'A reference does not grant Firehose read permission.', local('input-stream'), 'Resolve the actual Kinesis source and role.'],
      ['destination', 'Identify the receiving resource.', 'Match the target to the selected destination type.', 'No delivery target is chosen.', 'A bucket and an OpenSearch domain require different configuration.', local('delivery-bucket'), 'S3 destination reference needing prefix and encryption review.'],
    ]),
    ...notes('deliverySettings', 'measure-optimize', 'Buffering, compression and retry bounds are destination-specific; these are hints/configuration, not end-to-end latency guarantees.', [
      ['bufferSizeMb', 'Plan delivery aggregation size.', 'Use the selected destination limits and expected record sizes.', 'Buffer size is unspecified.', 'Larger batches can delay sparse traffic.', 5, 'An S3-oriented candidate requiring current destination validation.'],
      ['bufferIntervalSeconds', 'Plan maximum buffering wait intent.', 'Review destination buffering behavior and arrival rate.', 'Buffer waiting is unspecified.', 'Delivery retries and processing can add further latency.', 60, 'A one-minute candidate, not a delivery SLA.'],
      ['compression', 'Choose supported output compression.', 'Match downstream readers and destination support.', 'Compression is undecided.', 'Not every listed format applies to every destination.', 'GZIP', 'An S3 text-output candidate compatible with the chosen reader.'],
      ['backupBucket', 'Choose failed/all-data backup storage.', 'Review the destination-specific backup mode and recovery workflow.', 'No backup bucket is selected.', 'A bucket reference alone does not define what gets backed up.', local('delivery-backup'), 'Specify how failed records will be investigated and redriven.'],
      ['retryDurationSeconds', 'Budget destination retry time.', 'Choose according to destination support and recovery needs.', 'Retry duration is unspecified.', 'Exhausted delivery requires a viable backup/recovery path.', 300, 'A five-minute candidate to check for the actual destination.'],
    ]),
    ...notes('transformation', 'dev-events', 'Lambda transformation buffering and contract differ from destination buffering; the handler is not executed here.', [
      ['transformFunction', 'Identify a record transformer.', 'Use only when the source records need a deliberate transformation.', 'No transformer is selected.', 'The response must preserve required record identifiers/status/data shape.', local('record-transformer'), 'Test mixed good/bad records and transformation payload limits.'],
    ]),
    ...notes('format', 'dev-data-safety', 'Format conversion requires supported input, schema and serializer; compression is a different operation.', [
      ['formatConversion', 'Plan analytical output encoding.', 'Choose compatible JSON deserialization and schema-backed Parquet/ORC output.', 'No conversion contract is defined.', 'A declared format does not fix malformed or incompatible records.', 'Validated JSON with Glue schema to Parquet', 'A planning note requiring actual conversion configuration.', 'application-intent'],
    ]),
    ...notes('deliveryAccess', 'security-iam-sts', 'Source, destination, transformation and encryption boundaries have separate permissions and network prerequisites.', [
      ['serviceRole', 'Identify the Firehose service identity.', 'Grant only required source-read and destination-write actions.', 'Service access is unknown.', 'Destination resource policies may also be required.', role('firehose-delivery'), 'Review trust and permissions for the exact delivery path.'],
      ['kmsKey', 'Identify an encryption dependency.', 'Specify whether the key protects the stream or destination objects.', 'Encryption ownership is ambiguous.', 'One key reference cannot prove every encryption layer is configured.', local('delivery-key'), 'Document the exact layer and its required grants.'],
      ['networkAccess', 'Plan destination/source connectivity.', 'Review supported private/public endpoint paths and access controls.', 'Reachability is undocumented.', 'IAM permission does not establish network reachability.', 'Private destination with approved subnet and security-group access', 'A network plan requiring concrete compatible settings.', 'application-intent'],
    ]),
    ...notes('deliveryLogs', 'observe-debug', 'Delivery error logging requires destination/stream permissions; high-error conditions may be sampled.', [
      ['deliveryLogging', 'Plan delivery-failure evidence.', 'Capture transformation and destination errors with an investigation owner.', 'Logging is not asserted.', 'Logs are not guaranteed to account for every failed record.', true, 'Review failure metrics and backup records alongside logs.'],
    ]),
  },
  elasticache: {
    ...securityNotes(6379, 'Valkey/Redis example'),
    ...notes('cacheTypes', 'measure-optimize', 'Valkey, Redis OSS and Memcached have different capabilities; serverless and node-based settings are not interchangeable.', [
      ['engine', 'Choose the cache protocol/engine.', 'Match required data structures and supported client behavior.', 'Engine compatibility is undecided.', 'Do not apply Redis replication controls universally to Memcached.', 'valkey', 'A candidate requiring version and client compatibility review.'],
      ['deployment', 'Choose cache capacity management.', 'Compare serverless management with explicit node topology.', 'Deployment behavior is unresolved.', 'Node-only controls may be inapplicable to serverless.', 'serverless', 'Review supported engine features rather than copying node settings.'],
    ]),
    ...notes('cachePattern', 'measure-optimize', 'Caching is application logic; engine/client expiry behavior still needs review.', [
      ['cachePattern', 'Choose population and update ownership.', 'Compare cache-aside with write-through consistency needs.', 'Cache maintenance is undocumented.', 'Selecting a pattern does not implement it.', 'cache-aside', 'Load authoritative data on a controlled cache miss.', 'application-intent'],
      ['ttlSeconds', 'Plan cached-entry freshness.', 'Choose from business staleness tolerance and engine expiry semantics.', 'No entry-expiry policy is defined.', 'This is not a universal cache-wide AWS TTL switch.', 300, 'Five minutes for one data family, not every cached key.', 'application-intent'],
      ['invalidation', 'Define stale-entry removal.', 'Coordinate database writes and cache updates.', 'Stale-data handling is unspecified.', 'A successful database write can leave old cached values.', 'Invalidate affected keys after durable write', 'Test failure between the write and invalidation.', 'application-intent'],
      ['missBehavior', 'Choose how missing data is obtained.', 'Protect the authoritative store during cold-cache periods.', 'Miss handling is undefined.', 'Serving stale data requires explicit business approval.', 'load-from-source', 'Use bounded source access rather than unlimited parallel loads.', 'application-intent'],
      ['stampedeProtection', 'Plan simultaneous-miss coordination.', 'Use when many clients can rebuild the same entry.', 'Rebuild coordination is unproven.', 'This checkbox does not install locking or request coalescing.', true, 'Implement and test bounded duplicate-load suppression.', 'application-intent'],
    ]),
    ...notes('cacheCluster', 'measure-optimize', 'These topology fields describe supported node-based Valkey/Redis replication-group variants, not every cache engine.', [
      ['clusterMode', 'Choose supported partitioned topology.', 'Review client cluster-awareness and engine requirements.', 'Partitioning mode is undecided.', 'A non-cluster-aware client may route requests incorrectly.', true, 'Node-based Valkey/Redis candidate requiring compatible clients.'],
      ['shards', 'Plan data partitions.', 'Match capacity and key distribution to the supported topology.', 'Shard capacity is unspecified.', 'More shards do not repair every hot-key pattern.', 2, 'A topology candidate to load-test.'],
      ['replicasPerShard', 'Plan replica capacity.', 'Review read and availability goals for the chosen engine.', 'Replica capacity is unspecified.', 'Replicas need placement and failover policies.', 1, 'One replica per shard as a studied availability option.'],
    ]),
    ...notes('cacheFailover', 'dev-data-safety', 'Multi-AZ and automatic failover require compatible replication topology; they are not universal Memcached controls.', [
      ['multiAz', 'Plan replica availability-zone placement.', 'Use with a supported highly available node-based topology.', 'Cross-AZ redundancy is unspecified.', 'A checkbox does not establish actual node placement.', true, 'Review replica count and AZ distribution.'],
      ['automaticFailover', 'Plan managed primary replacement.', 'Use only with supported engine/topology prerequisites.', 'Failover behavior is unspecified.', 'Clients still need connection and endpoint recovery.', true, 'Test recovery without assuming cached state is authoritative.'],
    ]),
    ...notes('cacheIam', 'security-iam-sts', 'Authentication mode depends on engine/version/deployment; a network allow rule is not user authentication.', [
      ['authentication', 'Choose supported cache authentication.', 'Check IAM, user-group or token eligibility before selection.', 'Client authentication is undecided.', 'Permissions must match supported users and commands.', 'iam', 'A candidate only for supported engine/version context.'],
      ['credentialsSecret', 'Identify a non-IAM credential source.', 'Use a managed reference when the selected login needs credentials.', 'No credential source is selected.', 'Rotation must be coordinated with clients.', local('cache-secret'), 'Never store a token value in the graph.'],
    ]),
    ...notes('cacheTls', 'security-sensitive-data', 'Transit encryption support and client requirements depend on cache engine/version/deployment.', [
      ['transitEncryption', 'Protect cache traffic.', 'Configure compatible TLS clients and server settings together.', 'TLS intent is unknown.', 'TLS must not be treated as command authorization.', true, 'Test handshake and certificate validation for the actual client.'],
    ]),
    ...notes('cacheEncryption', 'security-kms', 'Encryption-at-rest choices and key eligibility are deployment-specific.', [
      ['atRestEncryption', 'Plan encryption for persisted cache data.', 'Review actual engine and deployment storage behavior.', 'Storage encryption intent is unspecified.', 'Encryption does not make cached data a backup.', true, 'Validate support before interpreting the toggle.'],
      ['kmsKey', 'Identify the cache encryption key.', 'Choose only where a customer-managed key is supported.', 'Custom key use is unresolved.', 'Key lifecycle can affect service operations.', local('cache-key'), 'Resolve supported key ownership and permission context.'],
    ]),
    ...notes('cacheConnections', 'measure-optimize', 'These values belong to the cache client/network plan, not universal ElastiCache service defaults.', [
      ['vpc', 'Identify cache network ownership.', 'Select a network reachable by approved clients.', 'Network ownership is unspecified.', 'The VPC reference does not configure a subnet group.', local('cache-vpc'), 'Review subnets and attached shared groups separately.'],
      ['connectTimeoutMs', 'Bound cache connection establishment.', 'Fit the cache attempt into the request fallback budget.', 'Client wait time is unspecified.', 'A long timeout can make a cache outage become an application outage.', 1000, 'A one-second client candidate requiring workload testing.', 'application-intent'],
      ['poolSize', 'Budget reused client connections.', 'Account for every process and replica sharing the cache.', 'Connection pressure is unknown.', 'Large aggregate pools can consume cache capacity.', 10, 'Per-client planning value, not a service quota.', 'application-intent'],
    ]),
    ...notes('cacheLogs', 'observe-debug', 'Slow-log availability, thresholds and delivery destinations depend on engine and version.', [
      ['slowLogs', 'Plan slow-operation evidence.', 'Use a supported logging path to investigate costly commands.', 'Slow-log capture is not asserted.', 'Logs can contain application data and add delivery cost.', true, 'Configure destination, permissions and privacy handling separately.'],
    ]),
  },
  ebs: {
    ...notes('volumeTypes', 'measure-optimize', 'Regional volume performance settings differ by type; instance/Outposts context can impose additional limits.', [
      ['volumeType', 'Choose block-storage performance behavior.', 'Match random/sequential I/O and latency requirements.', 'Volume behavior is undecided.', 'Changing type does not change the instance attachment bottleneck.', 'gp3', 'A general-purpose SSD candidate to measure.'],
      ['sizeGib', 'Allocate block capacity.', 'Include filesystem growth and actual volume-type constraints.', 'Storage capacity is unspecified.', 'Provisioned space and usable filesystem space differ.', 100, 'A synthetic capacity requirement, not a recommended default.'],
      ['iops', 'Plan supported provisioned I/O rate.', 'Use only for compatible volume types and workload sizes.', 'IOPS requirements are unspecified.', 'Instance bandwidth and application I/O shape still constrain results.', 3000, 'A gp3 planning value requiring an end-to-end test.'],
      ['throughputMib', 'Plan gp3 transfer throughput.', 'Compare request sizes, IOPS and supported ratios.', 'Throughput provisioning is unspecified.', 'High throughput alone does not improve tiny random I/O.', 125, 'A gp3 candidate, not a guaranteed observed transfer rate.'],
    ]),
    ...notes('volumeEncryption', 'security-kms', 'Volume/snapshot encryption and key inheritance depend on the actual creation/restore path.', [
      ['encrypted', 'Plan encrypted block storage.', 'Choose before creating or restoring the volume.', 'Encryption intent is unknown.', 'Do not assume existing plaintext storage changes in place.', true, 'Verify the resulting volume and snapshot encryption state.'],
      ['kmsKey', 'Identify the volume encryption key.', 'Review grants needed by the attaching workload and recovery path.', 'No customer-managed key is selected.', 'An inaccessible key can prevent attachment or restore.', local('volume-key'), 'Resolve actual key identity and lifecycle.'],
    ]),
    ...notes('volumeAttach', 'dev-data-safety', 'Volume and instance attachment requires compatible AZ and device handling; the guest name may differ from the API name.', [
      ['availabilityZone', 'Place the volume with its instance.', 'Choose the compatible Availability Zone for attachment.', 'Attachment locality is unresolved.', 'A volume cannot be treated as a cross-AZ shared disk.', 'us-east-1a', 'Synthetic AZ; verify actual instance placement.'],
      ['attachedInstance', 'Identify the compute consumer.', 'Select the instance owning this filesystem/device lifecycle.', 'No attachment target is selected.', 'A graph reference does not format or mount the volume.', local('application-instance'), 'Review instance compatibility and mount procedure.'],
      ['deviceName', 'Plan the attachment device label.', 'Use a supported API name and stable guest mount identifiers.', 'Guest device handling is unspecified.', 'NVMe discovery can expose a different device name.', '/dev/sdf', 'API-side example; identify the actual guest device safely.'],
    ]),
    ...notes('termination', 'dev-data-safety', 'Delete-on-termination belongs to the instance block-device mapping and needs deliberate lifecycle review.', [
      ['deleteOnTermination', 'Choose volume retention after instance termination.', 'Separate replaceable scratch data from durable application data.', 'Termination retention is undecided.', 'An unintended true value can delete needed data.', false, 'Retain the volume while managing cleanup intentionally.'],
    ]),
    ...notes('multiAttach', 'dev-data-safety', 'Multi-Attach has specific volume/instance/AZ support and requires write coordination; it is not a shared-filesystem service.', [
      ['multiAttach', 'Plan supported multi-instance access.', 'Use only with a cluster-aware storage/application design.', 'Shared attachment is not asserted.', 'Uncoordinated writes can corrupt a filesystem.', false, 'Keep single-owner storage unless coordination is designed and tested.'],
    ]),
    ...notes('snapshots', 'dev-data-safety', 'Snapshots are recovery resources, distinct from a live application-consistent transaction boundary.', [
      ['sourceSnapshotId', 'Identify a volume restore source.', 'Use a reviewed recovery point with compatible encryption/Region access.', 'No restore source is chosen.', 'Snapshot age determines which writes are recoverable.', 'snap-example', 'Synthetic identifier requiring actual snapshot evidence.'],
      ['backupPlan', 'Plan recurring recovery points.', 'Define schedule, retention and restore testing.', 'No automatic backup is established.', 'EBS persistence does not provide an automatic backup plan.', 'Daily snapshots with an exercised restore procedure', 'Application recovery intent requiring DLM/AWS Backup or equivalent configuration.', 'application-intent'],
    ]),
    ...notes('volumeMetrics', 'observe-debug', 'Volume and instance metric availability differs; this flag is a monitoring plan, not a complete alarm.', [
      ['performanceMonitoring', 'Plan block-I/O diagnosis.', 'Observe latency, queueing and throughput against workload demand.', 'Monitoring ownership is unspecified.', 'Provisioned values alone do not prove observed performance.', true, 'Choose actual metrics/dimensions and response thresholds.', 'application-intent'],
    ]),
  },
  efs: {
    ...securityNotes(2049, 'EFS NFS mount'),
    ...notes('filesystemPerformance', 'measure-optimize', 'Availability, performance and throughput choices have compatibility rules; not all combinations are supported.', [
      ['availability', 'Choose filesystem resilience scope.', 'Compare regional and One Zone recovery requirements.', 'Availability scope is undecided.', 'One Zone needs an explicit AZ-loss recovery plan.', 'regional', 'A multi-AZ resilience candidate.'],
      ['performanceMode', 'Choose the supported performance profile.', 'Review latency needs and throughput/availability compatibility.', 'Performance mode is unspecified.', 'Max I/O is not universally compatible with other choices.', 'general-purpose', 'A latency-oriented candidate to validate with representative operations.'],
      ['throughputMode', 'Choose throughput management.', 'Compare variable demand, provisioned rate and burst behavior.', 'Throughput policy is undecided.', 'Throughput settings do not fix every client-side bottleneck.', 'elastic', 'Check performance-mode compatibility before adoption.'],
      ['provisionedThroughputMib', 'Budget explicit throughput.', 'Use only with provisioned throughput mode.', 'No provisioned rate is selected.', 'Provisioning can add cost even when demand is low.', 10, 'A workload candidate requiring measurement.'],
    ]),
    ...notes('filesystemEncryption', 'security-kms', 'Encryption is a filesystem creation/replication choice; toggling a saved note does not convert an existing filesystem.', [
      ['encrypted', 'Plan stored-file encryption.', 'Choose the supported creation or migration path.', 'Encryption intent is unknown.', 'Existing unencrypted filesystems need an explicit migration approach.', true, 'Verify the resulting resource, not only this design value.'],
      ['kmsKey', 'Identify the filesystem data key.', 'Review supported ownership and lifecycle requirements.', 'Custom key identity is unresolved.', 'Key-access loss can affect file availability.', local('filesystem-key'), 'A logical reference requiring actual KMS policy review.'],
    ]),
    ...notes('filesystemIam', 'security-iam-sts', 'IAM client authorization, TLS and POSIX permissions are distinct layers.', [
      ['tlsMount', 'Protect client mount traffic.', 'Use an appropriate EFS mount-helper TLS configuration.', 'Transport protection is unspecified.', 'TLS alone does not assign POSIX ownership.', true, 'A client mount requirement to implement.', 'application-intent'],
      ['iamAuthorization', 'Plan IAM-aware NFS access.', 'Use the supported mount-helper identity path.', 'IAM client authorization is not asserted.', 'Filesystem policy and POSIX checks still affect access.', true, 'Verify actual client identity and allowed actions.'],
      ['filesystemPolicy', 'Describe filesystem client grants.', 'Scope mount/write/root actions to intended identities and conditions.', 'No custom client policy is declared.', 'Network access is not sufficient evidence of least privilege.', policy('elasticfilesystem:ClientMount', 'arn:aws:elasticfilesystem:us-east-1:111122223333:file-system/fs-example'), 'Synthetic read-only mount grant requiring full policy review.'],
    ]),
    ...notes('filesystemMount', 'dev-data-safety', 'Mount targets supply network entry points; AZ/subnet compatibility and actual target existence remain context.', [
      ['mountTargets', 'Plan reachable filesystem endpoints.', 'Match application AZ placement and supported filesystem availability.', 'Mount connectivity is unresolved.', 'A filesystem node alone provides no client mount path.', [{subnetId: 'private-a', availabilityZone: 'us-east-1a'}], 'A partial mount-target plan requiring security groups.'],
      ['mountTargets.subnetId', 'Select target network placement.', 'Use a compatible subnet owned by the intended VPC.', 'No target subnet is selected.', 'Routing and available addresses affect creation/connectivity.', 'private-a', 'A logical subnet reference to resolve.'],
      ['mountTargets.availabilityZone', 'Record the target AZ context.', 'Derive from the actual subnet rather than inventing a conflicting value.', 'AZ ownership is unknown.', 'Mismatched subnet/AZ notes cannot establish a target.', 'us-east-1a', 'Synthetic AZ that must match private-a.', 'application-intent'],
    ]),
    ...notes('accessPoints', 'security-iam-sts', 'Access points supply application identity/root-directory context; POSIX IDs are not IAM principal IDs.', [
      ['accessPoints', 'Define application file boundaries.', 'Use a deliberate root path and POSIX identity.', 'No access-point boundary is described.', 'An access point does not replace network/IAM permissions.', [{name: 'reports', path: '/reports', uid: 1000, gid: 1000, permissions: '750'}], 'An application-specific POSIX view.'],
      ['accessPoints.name', 'Label the application access point.', 'Use a name matching workload ownership.', 'The access point is unidentified.', 'A label is not an AWS-issued access-point ARN.', 'reports', 'Resolve the actual access-point identity separately.'],
      ['accessPoints.path', 'Choose the application root directory.', 'Limit the filesystem view to needed content.', 'The application root is unspecified.', 'Directory creation/ownership must match the intended access.', '/reports', 'Keep unrelated application files outside this view.'],
      ['accessPoints.uid', 'Choose the enforced POSIX user.', 'Match file ownership and the application access model.', 'POSIX user identity is unresolved.', 'Numeric UID does not grant IAM permission.', 1000, 'A non-root application identity example.'],
      ['accessPoints.gid', 'Choose the enforced POSIX group.', 'Match group-based directory/file permissions.', 'POSIX group identity is unresolved.', 'Group mismatch can deny otherwise reachable files.', 1000, 'Pair with deliberate group ownership.'],
      ['accessPoints.permissions', 'Plan root-directory mode bits.', 'Use appropriate owner/group/other access.', 'Creation permissions are unspecified.', 'World-write permissions can broaden access unexpectedly.', '750', 'Owner/group-oriented example; review actual workload needs.'],
    ]),
    ...notes('filesystemLifecycle', 'dev-data-safety', 'EFS lifecycle uses supported transitions; return to primary is access-triggered, not a day count.', [
      ['lifecycle', 'Plan storage-class movement.', 'Choose compatible transitions for file access patterns.', 'No lifecycle behavior is declared.', 'One transition entry is distinct from an arbitrary combined policy.', [{transition: 'to-ia', inactiveDays: 30}], 'A thirty-day inactive-file candidate.'],
      ['lifecycle.transition', 'Choose movement direction.', 'Distinguish cold storage movement from return-on-access.', 'Transition behavior is unspecified.', 'to-primary-on-access has no inactive-day setting.', 'to-primary-on-access', 'Use the access-triggered contract rather than a duration.'],
      ['lifecycle.inactiveDays', 'Choose a supported inactivity interval.', 'Use only for applicable IA/Archive transitions.', 'No cold-transition interval is selected.', 'Metadata listings are not equivalent to file data access.', 30, 'A supported example for an applicable cold transition.'],
    ]),
    ...notes('filesystemBackup', 'dev-data-safety', 'Automatic backup policy needs retention and restore planning; a checkbox is not restore evidence.', [
      ['automaticBackups', 'Plan managed filesystem backups.', 'Review backup-plan retention and recovery objectives.', 'Backup protection is not asserted.', 'Filesystem availability and backup recoverability are different.', true, 'Test recovery of the files the application actually needs.'],
    ]),
  },
  aurora: {
    ...databaseClientNotes('aurora'),
    ...notes('auroraEndpoints', 'dev-data-safety', 'Aurora endpoints have routing roles; reader selection does not promise replica freshness.', [
      ['engine', 'Choose the Aurora compatibility family.', 'Match SQL dialect, drivers and application extensions.', 'Engine compatibility is undecided.', 'Engine-specific features and versions require separate review.', 'aurora-postgresql', 'A PostgreSQL-compatible candidate, not an engine-version selection.'],
      ['writeEndpoint', 'Choose the write connection target.', 'Prefer the supported writer entry point for application writes.', 'Write routing is unresolved.', 'An instance endpoint does not follow writer ownership like a cluster endpoint.', 'cluster-writer', 'Use failover-aware connection handling.'],
      ['readEndpoint', 'Choose read routing behavior.', 'Review consistency needs before sending traffic to readers.', 'Read routing is undecided.', 'Reader endpoint routing is connection-level, not per-query balancing.', 'cluster-reader', 'Use only for reads tolerant of the selected replica behavior.'],
    ]),
    ...notes('auroraReplicas', 'dev-data-safety', 'Aurora replicas have read and promotion roles; placement and actual readiness are not inferred from counts.', [
      ['readerInstances', 'Plan read/failover instances.', 'Relate count to read load and recovery requirements.', 'Reader capacity is unspecified.', 'A number does not establish cross-AZ placement.', 1, 'A reader candidate requiring instance/AZ configuration.'],
      ['promotionTier', 'Plan failover promotion preference.', 'Prioritize a suitable replica for taking writer responsibility.', 'Promotion preference is unknown.', 'Preference does not prove the candidate is healthy or sufficiently sized.', 1, 'Review tier relative to the other cluster members.'],
    ]),
    ...notes('auroraCapacity', 'measure-optimize', 'Serverless v2 ACU bounds and auto-pause depend on engine/version/platform; this editor does not query eligibility.', [
      ['capacity', 'Choose provisioned or Serverless v2 compute.', 'Compare workload variability and supported engine requirements.', 'Compute management is undecided.', 'Storage and connection behavior still need separate review.', 'serverless-v2', 'A candidate requiring a compatible cluster/version.'],
      ['minCapacityAcu', 'Plan the Serverless v2 floor.', 'Check supported minimum and cold/resume behavior for the version.', 'The capacity floor is unspecified.', 'Zero/auto-pause support cannot be assumed for every version.', 1, 'A nonzero example; tune from workload evidence.'],
      ['maxCapacityAcu', 'Plan the Serverless v2 ceiling.', 'Keep capacity within supported bounds and downstream budgets.', 'The capacity ceiling is unspecified.', 'A ceiling can constrain bursts even when demand grows.', 8, 'An example requiring min/max and version compatibility review.'],
    ]),
    ...notes('auroraBackup', 'dev-data-safety', 'Aurora cluster backup retention differs from RDS instance disable-backup semantics.', [
      ['backupRetentionDays', 'Choose the recovery-point window.', 'Match accidental-change recovery requirements.', 'Retention is unspecified.', 'An available backup still needs a tested restore/cutover plan.', 7, 'A one-week candidate; do not use zero to disable Aurora automated backups.'],
    ]),
  },
  rds: {
    ...databaseClientNotes('rds'),
    ...notes('rdsCreate', 'dev-data-safety', 'Editor engine names are families; actual API values, editions, versions and Region/class combinations require resolution.', [
      ['engine', 'Choose the database engine family.', 'Match application SQL and operational requirements.', 'Engine compatibility is undecided.', 'The editor label may differ from the exact API engine identifier.', 'postgresql', 'Resolve PostgreSQL to the correct API value/version before deployment.'],
      ['engineVersion', 'Plan the supported engine version.', 'Check driver, extension and upgrade compatibility.', 'The engine version is unresolved.', 'Availability and upgrade paths vary by Region/deployment.', '16', 'A major-family placeholder requiring an actual supported release.'],
    ]),
    ...notes('multiAz', 'dev-data-safety', 'A Multi-AZ DB instance standby does not serve reads; Multi-AZ DB cluster readers are a different deployment.', [
      ['deploymentType', 'Choose availability topology.', 'Compare single-AZ, Multi-AZ instance and supported cluster behavior.', 'Failover topology is undecided.', 'Do not treat every Multi-AZ standby as a read replica.', 'multi-az-instance', 'Failover-oriented example without readable standby traffic.'],
    ]),
    ...notes('rdsConnect', 'dev-data-safety', 'An endpoint is a deployment output/reference, not a hostname created by this text field.', [
      ['writerEndpoint', 'Record the database connection endpoint.', 'Use the actual writer endpoint and engine port.', 'Write connection identity is unresolved.', 'Hardcoded addresses can break failover handling.', 'database.example.internal', 'Synthetic reference; do not mistake it for an AWS-issued endpoint.', 'observed-output'],
    ]),
    ...notes('rdsReplicas', 'dev-data-safety', 'Read replica support, cross-Region options and promotion behavior depend on engine/deployment.', [
      ['readReplicas', 'Plan read-capacity replicas.', 'Route read-only work that can tolerate replica behavior.', 'No read replica is declared.', 'A replica is not the Multi-AZ instance standby.', [{name: 'reporting', region: 'us-east-1', readTraffic: true}], 'A reporting candidate requiring an actual supported replica.'],
      ['readReplicas.name', 'Identify a replica workload.', 'Use an operationally meaningful label.', 'Replica identity is missing.', 'The application needs the correct replica endpoint separately.', 'reporting', 'A workload label, not a connection hostname.'],
      ['readReplicas.region', 'Choose replica Region.', 'Review data locality, supported replication and transfer implications.', 'Replica Region is unspecified.', 'Cross-Region latency and lag affect application reads.', 'us-east-1', 'Synthetic Region selection requiring engine availability review.'],
      ['readReplicas.readTraffic', 'Plan application read routing.', 'Use for queries compatible with read-only replica state.', 'No traffic-routing plan is asserted.', 'Creating a replica does not redirect application reads automatically.', true, 'Change and test the client routing contract explicitly.', 'application-intent'],
    ]),
    ...notes('rdsModify', 'dev-data-safety', 'Backup retention constraints depend on DB instance, read-replica source and Multi-AZ cluster context.', [
      ['backupRetentionDays', 'Choose automated backup retention.', 'Review the deployed variant before reducing or disabling backups.', 'Recovery history is unspecified.', 'Zero is not permitted or equivalent across every deployment context.', 7, 'A one-week example requiring restore testing.'],
    ]),
  },
  s3: {
    ...notes('bucketNames', 'dev-objects', 'Naming depends on bucket type and namespace; this editor does not check ownership or availability.', [
      ['bucketName', 'Identify the storage bucket.', 'Use nonsecret naming appropriate to the chosen namespace.', 'No bucket identity is selected.', 'A syntactically valid name may already be unavailable.', 'study-orders-111122223333', 'Synthetic general-purpose name, not a reserved resource.'],
    ]),
    ...notes('buckets', 'dev-objects', 'The general-purpose/directory selector is only the modeled subset of S3 bucket offerings.', [
      ['bucketType', 'Choose the supported bucket family.', 'Review feature and endpoint compatibility before other settings.', 'Bucket-specific applicability is unknown.', 'Do not copy general-purpose settings blindly to a directory bucket.', 'general-purpose', 'Use for the general-purpose examples in this guide.'],
    ]),
    ...notes('ownership', 'security-iam-sts', 'Object Ownership changes ACL behavior; directory-bucket and existing-object context require separate review.', [
      ['objectOwnership', 'Choose ownership and ACL behavior.', 'Prefer policy-based access where ACLs are unnecessary.', 'Ownership policy is unspecified.', 'BucketOwnerEnforced disables ACL-based grants.', 'BucketOwnerEnforced', 'Align upload clients with the disabled-ACL contract.'],
    ]),
    ...notes('publicAccess', 'security-iam-sts', 'Account, bucket and access-point public-access controls combine; toggles do not create or prove permissions.', [
      ['blockPublicAcls', 'Reject new public ACLs.', 'Use when public ACL grants must not be introduced.', 'This control is not asserted.', 'It does not itself remove existing ACLs.', true, 'Combine with ownership and effective access review.'],
      ['ignorePublicAcls', 'Ignore public ACL permissions.', 'Use to suppress public access through existing ACL grants.', 'ACL ignoring is unspecified.', 'Stored ACLs and effective permissions are different.', true, 'Review policy access separately.'],
      ['blockPublicPolicy', 'Reject qualifying public policies.', 'Use to prevent introducing broad public resource policies.', 'Policy rejection is unspecified.', 'It is not a replacement for authoring narrow statements.', true, 'Keep intended private grants explicit.'],
      ['restrictPublicBuckets', 'Restrict access when policy is public.', 'Review cross-account effects before enabling on an existing bucket.', 'Restriction state is unknown.', 'Legitimate cross-account access may require policy redesign.', true, 'A private-bucket candidate requiring effective-access review.'],
    ]),
    ...notes('bucketPolicy', 'security-iam-sts', 'Bucket policy actions need appropriate bucket/object ARNs and actual caller context.', [
      ['bucketPolicy', 'Describe resource-level object access.', 'Scope actions and prefixes to the calling workload.', 'No bucket-policy grant is asserted.', 'Bucket and object operations use different resource scopes.', policy('s3:GetObject', 'arn:aws:s3:::study-orders-111122223333/reports/*'), 'Synthetic read grant for one prefix.'],
    ]),
    ...notes('acl', 'security-iam-sts', 'ACL documents apply only where ACLs are enabled; this playground does not resolve canonical user ownership.', [
      ['acl', 'Describe an enabled-ACL ownership grant.', 'Use only when the ownership mode and use case require ACLs.', 'No ACL grant is declared.', 'An ACL document conflicts with disabled-ACL ownership mode.', '{"Owner":{"ID":"synthetic-owner"},"Grants":[]}', 'A structural teaching document, not a valid real owner identity.'],
    ]),
    ...notes('objectEncryption', 'security-kms', 'Default encryption applies to object writes; bucket type, algorithm and KMS context can restrict choices.', [
      ['encryption', 'Choose object encryption ownership.', 'Select the algorithm required by the data policy and bucket type.', 'The encryption choice is unknown in the design.', 'Default encryption does not authorize object access.', 'SSE-KMS', 'A candidate requiring KMS permissions and supported bucket context.'],
      ['kmsKey', 'Identify the object encryption key.', 'Use for the selected compatible KMS encryption mode.', 'No custom key is identified.', 'Readers/writers need applicable key permission as well as S3 access.', local('object-key'), 'Resolve a supported key in the relevant Region.'],
    ]),
    ...notes('bucketKey', 'security-kms', 'S3 Bucket Keys have encryption-mode-specific applicability; do not generalize to DSSE-KMS.', [
      ['bucketKeyEnabled', 'Plan reduced KMS request overhead.', 'Use only with a supported SSE-KMS configuration.', 'Bucket Key use is unspecified.', 'It changes encryption context and cost behavior, not caller authorization.', true, 'Review policy conditions before changing an existing workload.'],
    ]),
    ...notes('versioning', 'dev-objects', 'Versioning preserves object versions; suspension does not delete existing versions.', [
      ['versioning', 'Choose object-version retention behavior.', 'Use when overwrite/deletion recovery needs prior versions.', 'Versioning state is unknown.', 'Lifecycle and storage cost must account for noncurrent versions.', 'Enabled', 'Pair with explicit recovery and noncurrent-retention policies.'],
    ]),
    ...notes('lifecycle', 'dev-objects', 'Lifecycle filters and expiration require bucket-type and versioning context; these rows are not executed.', [
      ['lifecycleRules', 'Plan object age-based actions.', 'Separate data sets with different retention requirements.', 'No lifecycle policy is declared.', 'Conflicting rules can change retention unexpectedly.', [{id: 'reports', prefix: 'reports/', expirationDays: 365}], 'A synthetic data-retention rule to review before deployment.'],
      ['lifecycleRules.id', 'Identify one lifecycle rule.', 'Use a stable name for audit and updates.', 'The rule lacks a review identity.', 'A label does not determine rule priority.', 'reports-retention', 'Describe purpose without implying execution order.'],
      ['lifecycleRules.prefix', 'Select object-key prefixes.', 'Match the actual producer key layout.', 'No prefix filter is chosen.', 'A broad or empty filter can affect unrelated objects.', 'reports/', 'Limit the example to report objects.'],
      ['lifecycleRules.tags', 'Select objects by tags.', 'Use where the bucket and lifecycle action support tag filtering.', 'No tag filter is declared.', 'Missing/misapplied tags can exclude intended objects.', {retention: 'annual'}, 'Ensure writers apply this classification consistently.'],
      ['lifecycleRules.expirationDays', 'Plan current-object expiration.', 'Align with business retention and legal holds.', 'Current-object expiration is unspecified.', 'Versioned buckets have distinct delete-marker/version behavior.', 365, 'A requirement to validate, not a recommended universal duration.'],
      ['lifecycleRules.noncurrentExpirationDays', 'Plan old-version cleanup.', 'Use with versioning and a deliberate recovery window.', 'Old-version retention is unspecified.', 'Removing noncurrent versions reduces rollback history.', 90, 'A synthetic recovery window for historical versions.'],
    ]),
    ...notes('transition', 'dev-objects', 'Transitions depend on class, object size, age and minimum-storage considerations; a valid number is insufficient.', [
      ['lifecycleRules.transitionDays', 'Choose when storage class changes.', 'Compare access decay with supported transition combinations.', 'Transition timing is undecided.', 'Early transitions can incur costs without useful savings.', 90, 'A candidate for objects that become cold after three months.'],
      ['lifecycleRules.storageClass', 'Choose the transition destination.', 'Match retrieval latency and availability requirements.', 'No colder storage class is selected.', 'Some archive classes require restore before reads.', 'GLACIER', 'Flexible Retrieval candidate for infrequent, delay-tolerant access.'],
    ]),
    ...notes('multipart', 'dev-objects', 'Multipart upload recovery is application behavior; unfinished parts require intentional cleanup.', [
      ['lifecycleRules.abortMultipartDays', 'Clean up abandoned multipart uploads.', 'Set a cleanup window longer than legitimate upload workflows.', 'No incomplete-upload cleanup is planned.', 'Abandoned parts can continue consuming storage.', 7, 'A one-week candidate for a resumable-upload workflow.'],
      ['multipartUpload', 'Plan large-object upload handling.', 'Track upload IDs, completed parts, retries and abort paths.', 'Resumable upload behavior is undocumented.', 'Successful part uploads do not mean the object is completed.', 'Retry failed parts; complete after checks; abort abandoned uploads', 'Application logic requiring interrupted-upload tests.', 'application-intent'],
    ]),
    ...notes('objectLock', 'dev-objects', 'Object Lock protects versions and requires compatible versioning/bucket context; legal holds and retention differ.', [
      ['objectLockEnabled', 'Plan protected object versions.', 'Use when retention controls must resist premature deletion.', 'Object Lock use is not asserted.', 'Protected versions can outlive lifecycle deletion intent.', true, 'Review operational recovery and retention requirements before enabling.'],
      ['retentionMode', 'Choose retention enforcement mode.', 'Compare governance permissions with compliance requirements.', 'Retention enforcement is undecided.', 'Do not assume a protected version can always be deleted by an administrator.', 'GOVERNANCE', 'An example requiring explicit bypass-permission policy.'],
      ['retentionDays', 'Choose the retention period.', 'Translate approved retention requirements into version protection.', 'No retention duration is supplied.', 'This is not the same as lifecycle expiration.', 30, 'A synthetic protected period, not legal advice or a default.'],
    ]),
    ...notes('notifications', 'dev-events', 'S3 notifications are at-least-once; destination support, filter overlap and resource permissions need review.', [
      ['eventNotifications', 'Describe object-event consumers.', 'Select useful events without creating write-trigger loops.', 'No event consumer is declared.', 'Consumers must handle duplicates and ordering assumptions.', [{id: 'new-reports', events: 's3:ObjectCreated:*', prefix: 'incoming/', destination: local('upload-worker')}], 'Process incoming objects while writing outputs elsewhere.'],
      ['eventNotifications.id', 'Identify the notification configuration.', 'Use a stable label for operational changes.', 'The notification lacks an identifier.', 'Duplicate intent can produce multiple processing paths.', 'new-reports', 'A descriptive configuration identity.'],
      ['eventNotifications.events', 'Select object event types.', 'Match creation/removal/restore events to consumer responsibility.', 'No event types are selected.', 'Different event types carry different business meaning.', 's3:ObjectCreated:*', 'Test upload and multipart-completion cases.'],
      ['eventNotifications.prefix', 'Limit events by key prefix.', 'Separate incoming and generated output key spaces.', 'Prefix filtering is unspecified.', 'An overly broad trigger can recursively process outputs.', 'incoming/', 'Keep generated results under a different prefix.'],
      ['eventNotifications.suffix', 'Limit events by key suffix.', 'Use when a particular file family owns this processing path.', 'No suffix filter is declared.', 'Filename filtering does not validate file content.', '.json', 'The handler still must validate JSON and business schema.'],
      ['eventNotifications.destination', 'Identify the event destination.', 'Choose a supported endpoint and its permission path.', 'No consumer target is selected.', 'A graph reference does not install a resource policy.', local('upload-worker'), 'Resolve the supported function/queue/topic configuration.', 'application-intent'],
    ]),
    ...notes('eventbridge', 'dev-events', 'Bucket EventBridge publishing and downstream rule filtering are separate steps.', [
      ['eventBridgeEnabled', 'Plan S3 events through EventBridge.', 'Use when event routing needs EventBridge rules/targets.', 'Bus delivery is not asserted.', 'Rules still need event selection and target permissions.', true, 'Configure a deliberate downstream rule rather than assuming all targets receive events.'],
    ]),
    ...notes('cors', 'dev-objects', 'CORS controls browser visibility; S3 authorization still applies.', [
      ['corsRules', 'Describe browser object access.', 'Use for approved cross-origin upload/download clients.', 'Browser CORS policy is unspecified.', 'CORS does not make private objects public.', [{allowedOrigins: 'https://study.example', allowedMethods: 'GET,PUT'}], 'A synthetic client contract.'],
      ['corsRules.allowedOrigins', 'Identify approved frontend origins.', 'Match actual scheme/host/port.', 'No origin is selected.', 'Broad origins expose responses to more browser contexts.', 'https://study.example', 'A specific synthetic origin.'],
      ['corsRules.allowedMethods', 'Choose browser request methods.', 'Include only operations the client performs.', 'Methods are unspecified.', 'Allowing PUT here does not grant s3:PutObject.', 'GET,PUT', 'Read/upload browser methods.'],
      ['corsRules.allowedHeaders', 'Permit required request headers.', 'Include headers used by signing/checksum/content contracts.', 'Required-header compatibility is unresolved.', 'Preflight can reject otherwise authorized requests.', 'content-type', 'Review any additional signed headers.'],
      ['corsRules.exposeHeaders', 'Expose useful response headers.', 'Choose metadata the browser application must read.', 'Extra exposed headers are unspecified.', 'Exposing a header does not change object permissions.', 'ETag', 'An opaque response value, not always a content MD5.'],
      ['corsRules.maxAgeSeconds', 'Choose preflight-cache lifetime.', 'Balance policy changes and repeated browser preflights.', 'Cache duration is undecided.', 'Cached decisions can delay policy-change visibility.', 300, 'A five-minute example to test with the client.'],
    ]),
    ...notes('presigned', 'dev-objects', 'Presigning is application-side delegation; URLs are reusable until effective expiry and must not be stored here.', [
      ['presignedAccess', 'Plan temporary object operations.', 'Bind each grant to a specific operation, key and caller authorization.', 'No delegated access contract is planned.', 'Signing cannot grant more than the signer can perform.', [{operation: 'PutObject', keyPattern: 'uploads/{owner}/{id}', expiresSeconds: 300}], 'A design pattern, not a signed URL.', 'application-intent'],
      ['presignedAccess.operation', 'Choose the delegated API operation.', 'Separate uploads from downloads and their authorization rules.', 'Delegated operation is unspecified.', 'Changing HTTP/API operation invalidates the intended signature contract.', 'PutObject', 'A single-object upload operation.'],
      ['presignedAccess.keyPattern', 'Plan object ownership boundaries.', 'Derive the exact key from authorized server-side context.', 'Object-scope authorization is undefined.', 'A pattern is not a wildcard presigned URL.', 'uploads/{owner}/{id}', 'Resolve one exact key before signing.', 'application-intent'],
      ['presignedAccess.expiresSeconds', 'Limit requested access lifetime.', 'Fit transfer needs while considering signer credential expiry.', 'No lifetime is selected.', 'Temporary credentials can expire before the requested URL duration.', 300, 'Five minutes of requested access, not guaranteed validity.'],
      ['presignedAccess.constraints', 'Specify request constraints.', 'Match signed headers and server-side ownership checks.', 'Additional controls are undocumented.', 'A URL is not inherently single-use.', 'Authorize owner; sign exact key and content headers', 'Application enforcement requirements, not an S3 toggle.', 'application-intent'],
    ]),
    ...notes('replication', 'dev-objects', 'Replication requires compatible source/destination configuration, permissions and encryption; live replication is not a historical backfill.', [
      ['replicationRules', 'Plan asynchronous object copies.', 'Use for approved recovery or locality requirements.', 'No replica route is declared.', 'Replication is distinct from a restore-tested backup.', [{id: 'reports-copy', destination: local('replica-bucket'), role: role('replication-role')}], 'A partial route needing filters and prerequisites.'],
      ['replicationRules.id', 'Identify a replication policy.', 'Use a stable operational label.', 'The rule is unidentified.', 'Changes need source/destination review.', 'reports-copy', 'An audit-friendly rule name.'],
      ['replicationRules.destination', 'Select the replica bucket.', 'Check ownership, Region, versioning and data policy.', 'The replica destination is unresolved.', 'Cross-account copies require destination-side permission.', local('replica-bucket'), 'Resolve the actual destination configuration.'],
      ['replicationRules.role', 'Identify replication service permissions.', 'Grant only the source reads and destination writes required.', 'Replication authorization is unknown.', 'KMS grants may be needed in addition to S3 permissions.', role('replication-role'), 'Keep separate from application upload permissions.'],
      ['replicationRules.filter', 'Select the copied object set.', 'Translate a deliberate prefix/tag selection into the supported rule schema.', 'Replication scope is unspecified.', 'Excluded historical data is not copied by declaring this note.', 'prefix=reports/', 'Planning text requiring exact replication filter encoding.', 'application-intent'],
      ['replicationRules.deleteMarkerReplication', 'Choose delete-marker propagation.', 'Review supported rule/filter combinations and recovery expectations.', 'Deletion propagation is undecided.', 'Replicated deletions can change apparent data availability.', false, 'A candidate requiring explicit source deletion behavior review.'],
    ]),
    ...notes('acceleration', 'measure-optimize', 'Transfer Acceleration depends on supported general-purpose bucket naming, Region and client endpoint use.', [
      ['transferAcceleration', 'Plan accelerated long-distance transfers.', 'Measure representative client locations before enabling.', 'Acceleration is not asserted.', 'It can add transfer cost without helping every route.', false, 'Keep standard endpoints until measurements justify a change.'],
    ]),
    ...notes('s3Endpoint', 'security-iam-sts', 'A gateway endpoint uses routing and endpoint-policy context; it is not automatic permission to every bucket.', [
      ['vpcEndpoint', 'Identify a private S3 access path.', 'Review endpoint type, routes and bucket/endpoint policies.', 'Private routing is unresolved.', 'Network reachability and S3 authorization remain separate.', local('s3-endpoint'), 'Logical reference requiring compatible endpoint details.', 'application-intent'],
    ]),
    ...notes('accessLogs', 'observe-debug', 'This field covers S3-bucket log delivery; current AWS also offers other log destinations. Delivery is best effort.', [
      ['accessLogBucket', 'Choose the bucket for access logs.', 'Separate logs from application objects and review destination permissions.', 'No bucket log destination is selected.', 'Logs can be delayed, duplicated or absent.', local('access-log-bucket'), 'Review same-account/Region constraints for this bucket-delivery path.'],
    ]),
    ...notes('dataEvents', 'observe-debug', 'CloudTrail data-event selectors are configured on a trail/event data store, not by this bucket note.', [
      ['cloudTrailDataEvents', 'Plan object-operation audit evidence.', 'Select relevant read/write events and retention.', 'Object-level audit coverage is undocumented.', 'Management-event history does not imply object data events are recorded.', 'Capture writes under reports/ with approved retention', 'Operational intent requiring real selector configuration.', 'application-intent'],
    ]),
    ...notes('s3Performance', 'dev-data-safety', 'Client retry and timeout behavior must match the operation and SDK.', [
      ['applicationRetries', 'Plan bounded object-operation recovery.', 'Distinguish transient errors from denied or invalid requests.', 'Retry behavior is undocumented.', 'Repeated uploads may overwrite or create additional versions.', 'Retry transient failures with backoff; preserve operation identity', 'Test ambiguous completion rather than blindly resending.', 'application-intent'],
    ]),
  },
  glacier: {
    ...notes('storageClasses', 'dev-objects', 'This node models S3 Glacier storage classes, not the separate legacy Glacier vault API.', [
      ['bucket', 'Identify the containing S3 bucket.', 'Use the bucket that owns the archived object versions.', 'Archive ownership is unresolved.', 'The class belongs to objects, not a separate data copy node.', local('archive-bucket'), 'A logical S3 bucket reference.', 'application-intent'],
      ['storageClass', 'Choose archival access behavior.', 'Compare immediate reads with restore-based classes.', 'Retrieval behavior is unknown.', 'GLACIER_IR provides direct access unlike Flexible Retrieval/Deep Archive.', 'GLACIER_IR', 'Do not configure a restore window for this direct-access example.'],
      ['accessRequirement', 'Record acceptable retrieval delay.', 'Start from business recovery needs before class selection.', 'Access urgency is unspecified.', 'The cheapest storage rate may not satisfy recovery time.', 'Reports may wait for an approved restore workflow', 'A requirement to compare with class behavior.', 'application-intent'],
    ]),
    ...notes('restore', 'dev-objects', 'Restore tier and temporary-copy duration apply only to supporting archive classes and request variants.', [
      ['retrievalTier', 'Choose a supported restore service tier.', 'Match the archived class and required retrieval urgency.', 'Restore speed/cost choice is undecided.', 'Not every tier applies to every archive class.', 'Standard', 'A restore candidate requiring class-specific review.'],
      ['restoreDays', 'Choose temporary restored-copy availability.', 'Use for applicable restore requests after planning consumption.', 'No temporary-access window is selected.', 'This is not archive retention or a GLACIER_IR setting.', 2, 'Two days to consume the restored copy.'],
      ['restorePermissions', 'Plan who may restore and read.', 'Review restore, object-read and applicable KMS permissions.', 'Recovery authorization is unknown.', 'Starting a restore does not necessarily authorize reading its data.', 'Recovery role can restore approved prefix and read completed objects', 'Application access intent requiring exact policies.', 'application-intent'],
      ['restoreNotifications', 'Plan restore completion handling.', 'Use an event/status workflow instead of assuming immediate access.', 'Completion handling is undocumented.', 'Restore initiation is not completion.', 'Wait for restore-completed evidence before processing', 'Test retries and duplicate completion events.', 'application-intent'],
    ]),
    ...notes('transition', 'dev-objects', 'Lifecycle transition and minimum-storage considerations differ by archival class.', [
      ['transitionAgeDays', 'Plan when objects become archival.', 'Match cooling access patterns and supported transition rules.', 'Transition timing is undecided.', 'Early movement/deletion can incur minimum-storage charges.', 180, 'A candidate for six-month-old reports.'],
      ['retentionAndDeletion', 'Document archival disposal policy.', 'Coordinate business retention, Object Lock and lifecycle.', 'Deletion authority is undocumented.', 'Restored-copy expiry does not delete the archived original.', 'Retain source versions under approved lifecycle; review lock status before deletion', 'A policy note, not an executed delete.', 'application-intent'],
    ]),
    ...notes('objectEncryption', 'security-kms', 'The archived object retains its encryption context; this node does not independently re-encrypt it.', [
      ['kmsKey', 'Identify the object encryption dependency.', 'Review key availability throughout the retention period.', 'The relevant key is unresolved.', 'Losing key access can prevent later recovery.', local('archive-key'), 'Match the actual archived object encryption key.'],
    ]),
  },
  dynamodb: {
    ...notes('ddbKeys', 'dev-dynamodb', 'Current editor exposes a single partition/sort-key slice. Attribute definitions describe keys, not every item field.', [
      ['tableName', 'Identify the application table.', 'Use stable environment/workload naming.', 'No table identity is selected.', 'Name availability depends on account and Region.', 'StudyOrders', 'Synthetic name; no table is created.'],
      ['attributes', 'Declare key attribute types.', 'Include attributes used by table and index keys.', 'Key types are unresolved.', 'Do not list every non-key item property as a schema requirement.', [{name: 'tenantId', type: 'S'}], 'A string key definition.'],
      ['attributes.name', 'Name a key attribute.', 'Match the item property used by a key definition.', 'The key attribute is unidentified.', 'Spelling and case must match writes and queries.', 'tenantId', 'Use consistently in the partition key and item.'],
      ['attributes.type', 'Choose the key scalar type.', 'Match serialized values written to this key.', 'Key type is undecided.', 'A numeric string is not a numeric key value.', 'S', 'String identifiers preserve their literal identity.'],
      ['partitionKey', 'Choose the primary lookup grouping.', 'Start from frequent access patterns and traffic distribution.', 'Primary item access is undefined.', 'A concentrated key can create a hot workload partition.', 'tenantId', 'Evaluate skew between tenants, not just tenant count.'],
      ['sortKey', 'Order and distinguish items within a partition.', 'Use when queries need ranges or multiple items per partition key.', 'No sort key is declared.', 'Composite item identity requires both key values.', 'orderId', 'An order identifier within a tenant grouping.'],
    ]),
    ...notes('gsi', 'dev-dynamodb', 'GSI key/capacity choices; current single-key fields do not represent every newer multi-attribute key variant.', [
      ['globalSecondaryIndexes', 'Add alternate query access paths.', 'Use when a required lookup cannot use the table key.', 'No alternate GSI access path is planned.', 'Indexes add write/storage work and require capacity review.', [{name: 'ByStatus', partitionKey: 'status', sortKey: 'createdAt', projection: 'KEYS_ONLY'}], 'A status lookup requiring skew and consistency review.'],
      ['globalSecondaryIndexes.name', 'Identify a GSI in requests.', 'Use a stable name for the query contract.', 'Index selection is unresolved.', 'Queries must name the intended index.', 'ByStatus', 'A name distinct from the base table.'],
      ['globalSecondaryIndexes.partitionKey', 'Group the alternate query.', 'Check value distribution and the query equality predicate.', 'GSI grouping is undefined.', 'A few status values can concentrate traffic.', 'status', 'Useful only after reviewing expected status skew.'],
      ['globalSecondaryIndexes.sortKey', 'Order the GSI results.', 'Choose a range/sort dimension needed by the access pattern.', 'No alternate ordering is specified.', 'Sort-key format affects range comparisons.', 'createdAt', 'Use an encoding whose order matches intended time queries.'],
      ['globalSecondaryIndexes.readCapacity', 'Budget provisioned GSI reads.', 'For provisioned mode, size from index read traffic.', 'Index read capacity is unknown.', 'Table read capacity does not substitute for GSI capacity.', 5, 'A measured starting candidate, not an on-demand setting.'],
      ['globalSecondaryIndexes.writeCapacity', 'Budget provisioned GSI updates.', 'Account for table writes affecting the index.', 'Index write capacity is unknown.', 'Insufficient index capacity can affect write throughput.', 5, 'Review the actual indexed write rate.'],
    ]),
    ...notes('projection', 'dev-dynamodb', 'Index projection controls copied attributes; INCLUDE lists are explicit and keys are already projected.', [
      ['globalSecondaryIndexes.projection', 'Choose GSI stored attributes.', 'Include only data needed by the alternate query.', 'Projection is undecided.', 'More projected data increases index storage/write work.', 'INCLUDE', 'Pair with a deliberate non-key attribute list.'],
      ['globalSecondaryIndexes.nonKeyAttributes', 'List additional GSI fields.', 'Use only with INCLUDE projection.', 'No additional fields are selected.', 'This text list must become an attribute-name array.', 'total,currency', 'Fields returned alongside projected keys.'],
      ['localSecondaryIndexes.projection', 'Choose LSI copied attributes.', 'Match the result data needed by local-index queries.', 'Projection is unspecified.', 'Projection affects storage and read behavior.', 'KEYS_ONLY', 'A narrow index requiring access-pattern review.'],
      ['localSecondaryIndexes.nonKeyAttributes', 'List extra LSI result fields.', 'Use for INCLUDE projection, not ALL or KEYS_ONLY.', 'Extra fields are not specified.', 'Repeated projected attributes count across indexes.', 'total,currency', 'Two explicit non-key attributes to review.'],
    ]),
    ...notes('lsi', 'dev-dynamodb', 'LSIs share the table partition key and have creation/lifecycle constraints distinct from GSIs.', [
      ['localSecondaryIndexes', 'Add another sort order within a partition.', 'Plan at table creation when the same grouping needs alternate ordering.', 'No local-index access path is declared.', 'Do not assume an LSI can be added later like a GSI.', [{name: 'ByCreated', sortKey: 'createdAt', projection: 'KEYS_ONLY'}], 'A tenant-local chronological lookup.'],
      ['localSecondaryIndexes.name', 'Identify the LSI used by queries.', 'Use a name reflecting the alternate sort order.', 'The local index is unidentified.', 'Client queries need the exact index name.', 'ByCreated', 'A descriptive local-index name.'],
      ['localSecondaryIndexes.sortKey', 'Select the alternate partition ordering.', 'Choose a typed attribute present in the intended items.', 'Alternate ordering is undefined.', 'The table partition key still bounds the query.', 'createdAt', 'A time-ordered attribute within each tenant.'],
    ]),
    ...notes('capacity', 'measure-optimize', 'Capacity mode and provisioned policies require workload/account context; no universal throughput guarantee is inferred.', [
      ['capacity', 'Choose throughput management.', 'Compare variable demand with a measured provisioned workload.', 'Capacity strategy is undecided.', 'Mode changes management and charging behavior.', 'PAY_PER_REQUEST', 'An on-demand candidate still subject to relevant limits.'],
      ['readCapacityUnits', 'Budget provisioned table reads.', 'Use only with PROVISIONED mode and known read sizes/consistency.', 'Read provisioning is unspecified.', 'Different operation shapes consume different capacity.', 5, 'A synthetic capacity candidate to load-test.'],
      ['writeCapacityUnits', 'Budget provisioned table writes.', 'Use with measured item sizes and update patterns.', 'Write provisioning is unspecified.', 'Indexes add their own capacity considerations.', 5, 'Review base-table writes and affected indexes together.'],
      ['autoScaling', 'Plan provisioned capacity adjustment.', 'Define targets and min/max policies rather than relying on this boolean.', 'No scaling policy is specified.', 'Checking a box does not create scaling resources.', true, 'A proposal requiring explicit policy configuration.', 'application-intent'],
    ]),
    ...notes('consistency', 'dev-dynamodb', 'Read-operation choices belong to application requests; target capabilities differ.', [
      ['readConsistency', 'Choose read freshness requirements.', 'Use strong reads only on supporting targets and operations.', 'Freshness is unspecified.', 'GSI reads do not offer strongly consistent mode.', 'eventual', 'A GSI-compatible choice with application staleness handling.'],
      ['readTarget', 'Choose table or index access.', 'Align the query with the available key and consistency needs.', 'The read boundary is unresolved.', 'Streams are not interchangeable with table read APIs.', 'gsi', 'An alternate lookup whose consistency differs from the table.', 'application-intent'],
      ['readOperation', 'Choose the actual data access operation.', 'Use Query for key-based sets; GetItem requires a table primary key.', 'The read request contract is undefined.', 'Scan is not a substitute for a designed key lookup.', 'Query', 'A key-based result set requiring pagination.', 'application-intent'],
    ]),
    ...notes('query', 'dev-dynamodb', 'KeyConditionExpression applies to Query; this JSON field records a request fragment, not table configuration.', [
      ['keyCondition', 'Describe key-based query selection.', 'Provide partition equality and an applicable sort-key condition.', 'No query key condition is supplied.', 'A filter expression cannot replace the required partition lookup.', '{"KeyConditionExpression":"tenantId = :tenant","ExpressionAttributeValues":{":tenant":{"S":"demo-tenant"}}}', 'Low-level request fragment for a string partition key.', 'application-intent'],
    ]),
    ...notes('conditions', 'dev-data-safety', 'Conditional writes protect application invariants; the stored document is not executed.', [
      ['conditionExpression', 'Guard a write against current state.', 'Use for uniqueness, optimistic concurrency or expected-state transitions.', 'No conditional-write guard is planned.', 'A failed condition is not a transient error to retry blindly.', '{"ConditionExpression":"attribute_not_exists(orderId)"}', 'A partial create-only write contract requiring key/value context.', 'application-intent'],
    ]),
    ...notes('transaction', 'dev-data-safety', 'Transaction request shape and supported operation/context must be reviewed separately.', [
      ['transaction', 'Describe an atomic multi-item operation.', 'Use when multiple data changes form one invariant.', 'No transaction boundary is specified.', 'A transaction does not make external side effects atomic.', '{"TransactItems":[{"ConditionCheck":{"TableName":"StudyOrders","Key":{"tenantId":{"S":"demo"},"orderId":{"S":"1"}},"ConditionExpression":"attribute_exists(orderId)"}}]}', 'A synthetic condition-check fragment, not a submitted request.', 'application-intent'],
    ]),
    ...notes('pagination', 'dev-dynamodb', 'Pagination is client logic using the returned continuation key.', [
      ['pagination', 'Define continuation handling.', 'Continue while LastEvaluatedKey is present.', 'Complete-result retrieval is unproven.', 'An empty filtered page does not necessarily end iteration.', 'Pass LastEvaluatedKey as ExclusiveStartKey until absent', 'Preserve query identity between pages.', 'application-intent'],
    ]),
    ...notes('ttl', 'dev-dynamodb', 'TTL is asynchronous cleanup, not immediate application expiry enforcement.', [
      ['ttlAttribute', 'Identify the expiry timestamp attribute.', 'Use a supported epoch-seconds numeric value.', 'No TTL cleanup attribute is declared.', 'Application reads must enforce expiry when correctness depends on it.', 'expiresAt', 'Keep business expiration checks separate from background deletion.'],
    ]),
    ...notes('streams', 'dev-events', 'Stream contents and consumer delivery are separate controls.', [
      ['streamViewType', 'Select captured change content.', 'Choose keys or images according to consumer needs.', 'No stream content is selected.', 'Images can expose more application data to consumers.', 'NEW_AND_OLD_IMAGES', 'Compare before/after state while reviewing sensitive fields.'],
      ['streamConsumer', 'Identify downstream change processing.', 'Use a compatible consumer with checkpoint and retry handling.', 'No consumer is connected.', 'A reference does not establish an event source mapping.', local('change-worker'), 'Plan permissions and duplicate-safe processing separately.', 'application-intent'],
    ]),
    ...notes('ddbPolicy', 'security-iam-sts', 'Table/index/stream resource access is distinct from the workload identity and full request evaluation.', [
      ['resourcePolicy', 'Describe resource-level access.', 'Scope a principal to the intended table/index operations.', 'No resource grant is asserted.', 'Cross-account access requires both sides and surrounding controls reviewed.', policy('dynamodb:GetItem', 'arn:aws:dynamodb:us-east-1:111122223333:table/StudyOrders'), 'Synthetic single-operation table grant.'],
      ['applicationRole', 'Identify the calling workload.', 'Match its actions to table/index/stream request paths.', 'Caller permissions are unknown.', 'A role reference is not proof of effective access.', role('table-client'), 'Review the actual request principal.', 'application-intent'],
    ]),
    ...notes('ddbEncryption', 'security-kms', 'DynamoDB encrypts stored data; selecting a customer-managed key changes ownership, not whether authorization is needed.', [
      ['kmsKey', 'Identify a customer-managed encryption key.', 'Use when a separately managed key policy is required.', 'No custom key is chosen, not a claim of unencrypted storage.', 'Key lifecycle can affect availability.', local('table-key'), 'Resolve the actual supported key and access context.'],
    ]),
    ...notes('ddbBackup', 'dev-data-safety', 'PITR restores data to a new table; restore readiness needs more than a boolean.', [
      ['pointInTimeRecovery', 'Plan continuous recovery points.', 'Choose for accidental-write/deletion recovery objectives.', 'Continuous recovery is not asserted.', 'Restoration needs a cutover and permissions plan.', true, 'Require a tested restore and application reconnection procedure.'],
    ]),
    ...notes('ddbErrors', 'dev-data-safety', 'SDK retries, unprocessed batch items and ambiguous writes require distinct handling.', [
      ['retryAndUnprocessedItems', 'Define bounded retry behavior.', 'Retry eligible errors and only unprocessed batch entries.', 'Failure recovery is undocumented.', 'Blindly resending completed work can duplicate effects.', 'Retry UnprocessedItems with backoff; investigate conditional failures', 'Keep an end-to-end deadline and stable operation identity.', 'application-intent'],
      ['cacheStrategy', 'Plan data freshness outside the table.', 'Use caching only with explicit consistency and invalidation requirements.', 'No cache behavior is declared.', 'Cached reads can remain stale after successful writes.', 'Cache catalog reads briefly; bypass cache for confirmation reads', 'Application behavior needing independent tests.', 'application-intent'],
    ]),
    ...notes('ddbMetrics', 'observe-debug', 'Alarm rows describe monitoring intent, not deployed CloudWatch alarms.', [
      ['alarms', 'Plan table/index health signals.', 'Separate capacity, throttling and application failure evidence.', 'No operational alarm plan is recorded.', 'An index bottleneck can be hidden by table-only metrics.', [{metric: 'ReadThrottleEvents', resource: 'StudyOrders', threshold: 'Sustained throttling'}], 'Add actual dimensions, periods and actions before deployment.', 'application-intent'],
      ['alarms.metric', 'Choose a diagnostic metric.', 'Match the suspected operation and resource bottleneck.', 'No metric is selected.', 'Different metrics need different units/statistics.', 'ReadThrottleEvents', 'Inspect read throttling rather than inferring it from latency alone.', 'application-intent'],
      ['alarms.resource', 'Identify the metric dimensions.', 'Distinguish base table from a specific index.', 'Alarm resource scope is ambiguous.', 'Missing dimensions can prevent observing the intended series.', 'StudyOrders / ByStatus', 'Planning notation to translate into actual dimensions.', 'application-intent'],
      ['alarms.threshold', 'Describe an actionable condition.', 'Include duration and response ownership in the actual alarm.', 'No evaluation policy is defined.', 'A prose threshold is not evaluated locally.', 'Investigate sustained read throttling', 'Tie the alert to a workload objective.', 'application-intent'],
    ]),
  },
};
