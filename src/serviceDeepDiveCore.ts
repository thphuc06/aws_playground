import type {ServiceDeepDive} from './serviceDeepDiveTypes';

// Original study scenarios. Sources were checked for the stated concepts and billing
// dimensions; no scenario was deployed and no price or production-readiness promise is made.
const source = (title: string, url: string) => ({title, url, verified: '2026-11-03'});

export const coreDeepDives: ServiceDeepDive[] = [
  {
    serviceId: 'lambda',
    mentalModel: 'For event-driven Lambda functions, an invocation runs inside an execution environment that may be reused. Reuse is an optimization, not durable storage or a promise that the next request sees the same process.',
    decision: {
      useWhen: 'Choose event functions for bounded handlers whose traffic arrives through supported events and whose state can live in a database or object store.',
      avoidWhen: 'For a persistent worker needing host control or a long-running container process, compare ECS or EC2. Compare the exact Lambda function type rather than applying event-function assumptions to every variant.',
      alternativeIds: ['ecs', 'ec2'],
    },
    walkthrough: {
      title: 'Investigate a slow thumbnail handler',
      steps: [
        'Separate initialization time from handler duration using recorded invocation evidence.',
        'Move reusable SDK clients outside the handler, while keeping user-specific state out of shared process variables.',
        'Benchmark representative image sizes at several memory settings; measure both latency and billed duration.',
        'Replay the same object event and verify that the output operation remains safe to repeat.',
      ],
      expectedOutcome: 'A measured configuration choice and a duplicate-safe handler, with persistent output outside the execution environment.',
      failureMode: 'A warm invocation hides expensive initialization, or a process-level cache accidentally returns one user’s data to another.',
    },
    costDrivers: [
      'For ordinary on-demand event functions, request count and configured memory multiplied by billed execution duration drive compute charges.',
      'Provisioned concurrency, additional ephemeral storage, logs and downstream services can add charges; reducing memory alone may increase runtime.',
    ],
    productionChecks: [
      'Exercise initialization, timeout, throttling and duplicate-delivery cases with representative payloads.',
      'Bound concurrency against downstream capacity and keep reusable connections tolerant of expiry.',
    ],
    sources: [
      source('Lambda event-function best practices', 'https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html'),
      source('Lambda pricing dimensions', 'https://aws.amazon.com/lambda/pricing/'),
    ],
  },
  {
    serviceId: 'sqs',
    mentalModel: 'A queue owns the message until deletion. Receiving gives a worker a temporary processing opportunity through visibility timeout; it does not transfer permanent ownership or prove that the business action completed.',
    decision: {
      useWhen: 'Use SQS when jobs need buffering and consumers should control their own processing rate.',
      avoidWhen: 'If independent subscribers each need a copy, compare SNS fan-out. If consumers need a retained stream to replay independently, compare Kinesis.',
      alternativeIds: ['sns', 'kinesis'],
    },
    walkthrough: {
      title: 'Recover a worker that crashes after charging an order',
      steps: [
        'Use an order operation ID to make the external business action idempotent.',
        'Receive the job and record processing evidence without deleting it before completion.',
        'Simulate a crash after the action, then let the message become visible again.',
        'On redelivery, consult the durable operation record and acknowledge the completed job without repeating the charge.',
      ],
      expectedOutcome: 'A retry repairs acknowledgement without duplicating the business side effect.',
      failureMode: 'Visibility expires before processing completes, allowing overlapping attempts; a long timeout can also delay recovery after a crash.',
    },
    costDrivers: [
      'Request volume, queue type and payload-size billing units matter; repeated empty receives can increase request usage.',
      'Batching and long polling can reduce request overhead. KMS usage or S3-backed oversized payloads have separate charges.',
    ],
    productionChecks: [
      'Measure processing duration, visibility extensions and in-flight backlog together.',
      'Define who investigates the DLQ and how corrected messages are safely replayed.',
    ],
    sources: [
      source('SQS visibility timeout and failure handling', 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html'),
      source('SQS requests and additional costs', 'https://aws.amazon.com/sqs/pricing/'),
    ],
  },
  {
    serviceId: 'dynamodb',
    mentalModel: 'DynamoDB performance starts with the access key. A large table with evenly distributed items can still have a hot key if most activity targets one item or partition-key value.',
    decision: {
      useWhen: 'Use it for known key-based access patterns, conditional updates and operational records that benefit from managed scaling.',
      avoidWhen: 'If the central requirement is flexible relational joins or evolving ad-hoc queries across many entities, compare RDS or Aurora before forcing every question into a key design.',
      alternativeIds: ['rds', 'aurora'],
    },
    walkthrough: {
      title: 'Diagnose a popular customer becoming a hot key',
      steps: [
        'List the exact reads and writes for the customer, including secondary-index access.',
        'Compare request distribution by key rather than looking only at table-wide consumed capacity.',
        'Evaluate a more distributed key or sharded write design and document how readers reconstruct the result.',
        'Load-test the skewed workload and verify correctness when throttled writes are retried.',
      ],
      expectedOutcome: 'A key design justified by both access patterns and traffic distribution.',
      failureMode: 'Increasing total capacity fails to fix concentrated demand, or write sharding makes the required read prohibitively complex.',
    },
    costDrivers: [
      'On-demand read/write usage or provisioned capacity, item size, consistency and indexes affect request costs.',
      'Stored data, backups, restores and replicated writes add costs independently of the primary application request.',
    ],
    productionChecks: [
      'Benchmark hot keys and each index, including unusually large items.',
      'Treat a conditional-check failure differently from retryable throttling; verify all batch outcomes.',
    ],
    sources: [
      source('DynamoDB partition-key design', 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html'),
      source('DynamoDB capacity and feature pricing', 'https://aws.amazon.com/dynamodb/pricing/'),
    ],
  },
  {
    serviceId: 'eventbridge',
    mentalModel: 'An event bus routes a statement that something happened. Rule matching, delivery to a target and successful business processing are three separate outcomes with different evidence.',
    decision: {
      useWhen: 'Use event routing to let producers publish domain events without maintaining every consumer address.',
      avoidWhen: 'For a worker-controlled backlog, add or choose SQS. For an explicitly ordered business process with compensating steps, compare Step Functions.',
      alternativeIds: ['sqs', 'step-functions'],
    },
    walkthrough: {
      title: 'Recover a rule whose target permission was removed',
      steps: [
        'Publish a synthetic order event and check whether it matched the intended rule.',
        'Inspect failed delivery and the target DLQ, including the reported error context.',
        'Repair the target permission and verify the DLQ itself permits EventBridge to send messages.',
        'Replay only the affected events through an application-controlled, duplicate-safe recovery process.',
      ],
      expectedOutcome: 'An explanation of where delivery failed and a recoverable event trail.',
      failureMode: 'Some configuration or permission errors go directly to the DLQ without retries; an inaccessible DLQ cannot preserve the event.',
    },
    costDrivers: [
      'Event origin, destination, payload-size billing units and cross-Region transfer affect event-bus costs.',
      'Archives, replay, Pipes and Scheduler have distinct billing dimensions; target processing is billed separately.',
    ],
    productionChecks: [
      'Alarm on both failed target delivery and failure to send to the DLQ.',
      'Test matching with realistic event envelopes and document a replay owner.',
    ],
    sources: [
      source('EventBridge target dead-letter queues', 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-dlq.html'),
      source('EventBridge pricing by feature', 'https://aws.amazon.com/eventbridge/pricing/'),
    ],
  },
  {
    serviceId: 'appsync',
    mentalModel: 'A GraphQL selection set becomes work performed by resolvers. One client request can trigger many downstream reads, so a compact API response shape does not guarantee a cheap or fast execution plan.',
    decision: {
      useWhen: 'Choose AppSync GraphQL when clients need typed, selective data access and the team can design resolver and authorization boundaries.',
      avoidWhen: 'For a straightforward HTTP resource API without GraphQL needs, compare API Gateway. AppSync Events and GraphQL have separate programming contracts.',
      alternativeIds: ['api'],
    },
    walkthrough: {
      title: 'Find an N+1 resolver pattern',
      steps: [
        'Request a list of articles together with each article’s author field.',
        'Count downstream resolver calls as the list grows rather than measuring only the client request count.',
        'Where the chosen integration supports it, evaluate batching and preserve the mapping between input items and outputs.',
        'Test one failed item and verify that errors and user ownership remain correctly scoped.',
      ],
      expectedOutcome: 'A bounded resolver plan that returns the required fields without uncontrolled downstream fan-out.',
      failureMode: 'A query that works for one article triggers many backend calls for a large list, or a batch returns results in the wrong order.',
    },
    costDrivers: [
      'GraphQL query/mutation operations, real-time updates and connected minutes are separate usage dimensions.',
      'Dedicated caches, data transfer and invoked data sources such as Lambda or DynamoDB add their own charges.',
    ],
    productionChecks: [
      'Test field-level authorization and partial-error behavior, not just successful top-level responses.',
      'Measure resolver fan-out and bound expensive query patterns.',
    ],
    sources: [
      source('AppSync Lambda resolvers, errors and batching', 'https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-lambda-resolvers.html'),
      source('AppSync GraphQL and Events pricing', 'https://aws.amazon.com/appsync/pricing/'),
    ],
  },
  {
    serviceId: 'sns',
    mentalModel: 'A topic distributes a publication to subscriptions. Each subscription has its own delivery and filtering behavior; successful publication does not mean every downstream consumer processed the message.',
    decision: {
      useWhen: 'Use SNS when several independently managed subscribers need notifications from one producer.',
      avoidWhen: 'Choose SQS for a shared worker backlog, or compare EventBridge when richer event routing and service integration are the main requirement.',
      alternativeIds: ['sqs', 'eventbridge'],
    },
    walkthrough: {
      title: 'Explain why a filtered order notification is missing',
      steps: [
        'Check whether the subscription filters message attributes or the JSON message body.',
        'Compare the actual property name, value type and filter conditions with the published event.',
        'Send controlled matching and nonmatching examples after allowing for filter-policy propagation.',
        'Inspect subscription delivery failures separately from intentionally filtered messages.',
      ],
      expectedOutcome: 'A reproducible distinction between filtering, delivery failure and consumer failure.',
      failureMode: 'The publisher supplies a body property while the subscription evaluates attributes, so an otherwise valid message never reaches that subscriber.',
    },
    costDrivers: [
      'Topic type, request volume, payload units and delivery protocol affect the bill.',
      'SMS destinations, data transfer and optional payload-based filtering or archival features have their own dimensions.',
    ],
    productionChecks: [
      'Test filter changes with the actual publisher schema and account for eventual propagation.',
      'Give each critical subscription an appropriate failure and recovery strategy.',
    ],
    sources: [
      source('SNS subscription filtering semantics', 'https://docs.aws.amazon.com/sns/latest/dg/sns-subscription-filter-policies.html'),
      source('SNS topic and delivery pricing', 'https://aws.amazon.com/sns/pricing/'),
    ],
  },
  {
    serviceId: 'step-functions',
    mentalModel: 'A state machine makes coordination explicit: what runs next, what data it receives and which failures can recover. Workflow execution semantics do not replace idempotency in the external systems a task calls.',
    decision: {
      useWhen: 'Use a workflow for visible branching, retries, parallel work and waiting across service boundaries.',
      avoidWhen: 'If one short function can complete the operation cleanly, orchestration may add unnecessary transitions. A queue alone may suffice for independent jobs.',
      alternativeIds: ['lambda', 'sqs'],
    },
    walkthrough: {
      title: 'Choose a workflow for a human approval',
      steps: [
        'Record how long approval may take and whether a callback integration is required.',
        'Select Standard for a supported callback-based design; Express does not support the callback integration pattern.',
        'Define timeout and rejected-approval branches rather than leaving the request waiting indefinitely.',
        'Make the post-approval action duplicate-safe if its task has a retry policy.',
      ],
      expectedOutcome: 'A workflow type chosen from duration and integration needs, with an explicit path for no response.',
      failureMode: 'Choosing Express because it is high throughput fails the callback requirement, or retrying a payment task repeats a side effect.',
    },
    costDrivers: [
      'Standard charges depend on executed state transitions, including transitions repeated through retries.',
      'Express uses request and duration-based charging; downstream compute, logging and storage remain separate.',
    ],
    productionChecks: [
      'Review the selected integration pattern and execution semantics before choosing a workflow type.',
      'Exercise timeout, retry exhaustion and compensation with synthetic failures.',
    ],
    sources: [
      source('Step Functions workflow types and guarantees', 'https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html'),
      source('Step Functions billing dimensions', 'https://aws.amazon.com/step-functions/pricing/'),
    ],
  },
  {
    serviceId: 'ec2',
    mentalModel: 'An EC2 instance is replaceable compute with an operating-system lifecycle. Instance identity, attached storage and the application’s durable state have different lifetimes.',
    decision: {
      useWhen: 'Choose EC2 when the workload needs operating-system control, specific host software or a custom long-running process.',
      avoidWhen: 'If a managed container or event function meets the requirements, compare ECS or Lambda before accepting host patching and recovery work.',
      alternativeIds: ['ecs', 'lambda'],
    },
    walkthrough: {
      title: 'Rehearse replacing an application instance',
      steps: [
        'List state stored on EBS, instance store and external services before changing the instance.',
        'Create a replacement from the documented image and configuration instead of hand-repairing the old host.',
        'Verify its workload role, application health and access to durable data.',
        'Move traffic only after readiness checks and retain a tested recovery path.',
      ],
      expectedOutcome: 'The service can recover by replacing compute without depending on undocumented host changes.',
      failureMode: 'A stop/start loses instance-store data, or an application depends on a manually installed package absent from the replacement.',
    },
    costDrivers: [
      'Instance type, operating system, purchase model and running duration determine compute charges.',
      'EBS volumes, snapshots, public IPv4 addresses and data transfer can remain billable independently; stopping compute does not remove storage costs.',
    ],
    productionChecks: [
      'Test replacement from automation and document storage deletion-on-termination choices.',
      'Monitor application readiness separately from instance running state.',
    ],
    sources: [
      source('EC2 lifecycle, storage and billing states', 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html'),
      source('EC2 On-Demand pricing components', 'https://aws.amazon.com/ec2/pricing/on-demand/'),
    ],
  },
  {
    serviceId: 'elastic-beanstalk',
    mentalModel: 'Beanstalk coordinates an application version and its environment. Deployment policy controls how old and new capacity overlap; it cannot automatically make a database migration compatible with both versions.',
    decision: {
      useWhen: 'Use a supported Beanstalk platform when a managed application environment fits the deployment workflow.',
      avoidWhen: 'If workload orchestration needs exceed the platform model, compare ECS or EKS. Review Standard and Cluster environment capabilities separately.',
      alternativeIds: ['ecs', 'eks'],
    },
    walkthrough: {
      title: 'Plan an immutable deployment in Beanstalk Standard',
      steps: [
        'Verify the application can run concurrently with the previous version against the same data.',
        'Choose an immutable deployment and budget for temporary replacement capacity.',
        'Inspect the new instances’ health and version before the deployment completes.',
        'Rehearse failure recovery and verify that rolling back code does not require reversing incompatible database writes.',
      ],
      expectedOutcome: 'A release strategy whose availability, temporary capacity and data compatibility are understood.',
      failureMode: 'New instances pass a shallow health check while application requests fail, or schema changes prevent the old version from recovering.',
    },
    costDrivers: [
      'Beanstalk itself has no additional service charge; the environment’s EC2, load balancing, storage and other resources are billed.',
      'Additional deployment capacity, retained environments and optional CloudWatch logs or metrics increase the total.',
    ],
    productionChecks: [
      'Confirm that the selected environment supports the deployment policy; immutable deployment is a Standard-specific choice.',
      'Keep application versions, environment settings and migration steps reproducible.',
    ],
    sources: [
      source('Beanstalk deployment policy comparison', 'https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.deploy-existing-version.html'),
      source('Beanstalk resource and observability costs', 'https://aws.amazon.com/elasticbeanstalk/pricing/'),
    ],
  },
  {
    serviceId: 'aurora',
    mentalModel: 'Aurora endpoints are connection-routing choices over a cluster. The reader endpoint balances connections, not individual SQL statements, so a long-lived connection pool can concentrate work.',
    decision: {
      useWhen: 'Choose Aurora for an application needing supported MySQL/PostgreSQL-compatible relational behavior and Aurora’s cluster architecture.',
      avoidWhen: 'For another SQL engine compare RDS; for a key-based workload without relational requirements compare DynamoDB.',
      alternativeIds: ['rds', 'dynamodb'],
    },
    walkthrough: {
      title: 'Separate writes, reads and failover recovery',
      steps: [
        'Route writes through the cluster writer endpoint and select an appropriate read endpoint for read-only work.',
        'Observe connection distribution rather than assuming every query reaches a different replica.',
        'Exercise a failover and make clients reconnect using the cluster endpoint instead of a pinned instance address.',
        'Resolve uncertain transaction outcomes before retrying a mutating operation.',
      ],
      expectedOutcome: 'The application reconnects to the current cluster role and avoids blind duplicate transactions.',
      failureMode: 'A client pins an instance endpoint or holds stale connections, so a healthy cluster still appears unavailable.',
    },
    costDrivers: [
      'Provisioned instance capacity or Serverless capacity usage, replicas and database storage are separate dimensions.',
      'Aurora Standard and I/O-Optimized treat I/O charges differently; backups, transfer and optional features also affect cost.',
    ],
    productionChecks: [
      'Rehearse reconnect behavior and verify endpoint selection for each connection pool.',
      'Benchmark read distribution and choose capacity from actual workload evidence.',
    ],
    sources: [
      source('Aurora endpoint behavior and failover', 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.Endpoints.html'),
      source('Aurora compute, storage and I/O pricing', 'https://aws.amazon.com/rds/aurora/pricing/'),
    ],
  },
  {
    serviceId: 'rds',
    mentalModel: 'An RDS read replica is another database endpoint receiving asynchronous changes from its source. Read scaling and immediate visibility of a just-committed write are different requirements.',
    decision: {
      useWhen: 'Choose RDS for supported relational engines when managed database operations fit the application’s SQL and transaction needs.',
      avoidWhen: 'Do not add a read replica solely to obtain immediate read-after-write consistency. Compare Aurora’s cluster behavior or route consistency-sensitive reads to the writer.',
      alternativeIds: ['aurora', 'dynamodb'],
    },
    walkthrough: {
      title: 'Explain an order that disappears immediately after creation',
      steps: [
        'Trace the write endpoint and the endpoint used by the following page refresh.',
        'Check whether that read used an asynchronously updated replica.',
        'Send consistency-sensitive reads to the writer, or explicitly design the UI for delayed visibility.',
        'Measure replication lag and test the chosen read policy under write load.',
      ],
      expectedOutcome: 'A read-routing policy aligned with user-visible consistency requirements.',
      failureMode: 'A successful commit is followed by a stale replica read and the application wrongly reports that the order was lost.',
    },
    costDrivers: [
      'Engine, instance class, deployment configuration and running time drive database compute cost.',
      'Read replicas are separately billed instances; storage, provisioned performance, backups and cross-Region replication can add costs.',
    ],
    productionChecks: [
      'Separate failover requirements from read-scaling requirements for the chosen RDS deployment type.',
      'Test connection limits, replica lag and backup restoration with the actual engine.',
    ],
    sources: [
      source('RDS asynchronous read replicas', 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html'),
      source('RDS pricing by engine and deployment', 'https://aws.amazon.com/rds/pricing/'),
    ],
  },
  {
    serviceId: 'elasticache',
    mentalModel: 'In a cache-aside design, the database remains the source of truth and the application populates the cache on demand. Cache freshness, eviction and refill behavior are application design decisions.',
    decision: {
      useWhen: 'Use caching when repeated reads can reuse a result for a defined freshness window and the application can tolerate cache loss.',
      avoidWhen: 'Do not move the only copy of critical data into an ordinary cache to make reads faster. Choose a durable store such as DynamoDB or RDS for authoritative records.',
      alternativeIds: ['dynamodb', 'rds'],
    },
    walkthrough: {
      title: 'Control the load after a popular cache entry expires',
      steps: [
        'Define the allowed age of a product response and the database fallback.',
        'Simulate many concurrent requests after the cache entry expires.',
        'Evaluate coalescing duplicate refreshes or spreading expirations, then measure database pressure.',
        'Update the product and verify that invalidation or expiry produces the documented freshness behavior.',
      ],
      expectedOutcome: 'A cache strategy with a measured fallback load and an explicit stale-data policy.',
      failureMode: 'Many misses hit the database together, or a write succeeds but users continue to receive a stale cached value.',
    },
    costDrivers: [
      'Serverless charges depend on stored data and processing units; node-based deployments are charged by selected node capacity and duration.',
      'Engine, replicas, retention and applicable transfer costs influence total cost; cache misses also consume downstream database capacity.',
    ],
    productionChecks: [
      'Test empty-cache startup, expiration and cache unavailability without overwhelming the database.',
      'Verify authentication, encryption and connectivity for the exact engine and deployment mode.',
    ],
    sources: [
      source('Cache population, expiry and tradeoffs', 'https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html'),
      source('ElastiCache serverless and node pricing', 'https://aws.amazon.com/elasticache/pricing/'),
    ],
  },
  {
    serviceId: 'ebs',
    mentalModel: 'An EBS snapshot captures blocks written to the volume, not unsaved application memory. A successful storage snapshot is therefore different from a verified application-consistent backup.',
    decision: {
      useWhen: 'Choose block storage for an instance filesystem or application that needs attached block-device semantics.',
      avoidWhen: 'For shared file access compare EFS; for objects accessed through APIs compare S3. Attaching a block device to several writers is not a general shared-filesystem design.',
      alternativeIds: ['efs', 's3'],
    },
    walkthrough: {
      title: 'Validate a backup before a schema migration',
      steps: [
        'Flush or quiesce application writes using the database’s supported backup procedure.',
        'Create the required volume or multi-volume snapshot and track its completion.',
        'Restore into an isolated recovery environment and start the application against the restored data.',
        'Check application-level integrity and record restoration time before relying on the backup.',
      ],
      expectedOutcome: 'Evidence that the captured blocks can restore the application, not merely that a snapshot exists.',
      failureMode: 'Buffered data never reached the volume, or related volumes were captured without a consistent application boundary.',
    },
    costDrivers: [
      'Provisioned capacity, volume type and paid IOPS or throughput determine volume cost, even when the filesystem is mostly empty.',
      'Snapshot storage and optional restoration features add costs independently of instance running time.',
    ],
    productionChecks: [
      'Document application consistency and test restoration before destructive changes.',
      'Verify KMS access and retention policies for both volumes and snapshots.',
    ],
    sources: [
      source('EBS snapshot consistency considerations', 'https://docs.aws.amazon.com/ebs/latest/userguide/ebs-creating-snapshot.html'),
      source('EBS volume and snapshot pricing', 'https://aws.amazon.com/ebs/pricing/'),
    ],
  },
  {
    serviceId: 'efs',
    mentalModel: 'An EFS mount target provides the network path, while an access point provides an application-specific filesystem view and identity. Neither substitutes for the other.',
    decision: {
      useWhen: 'Use EFS when compatible compute clients need shared files and filesystem operations across multiple workers.',
      avoidWhen: 'If the application can use object APIs, compare S3. If it needs one instance’s attached block device, compare EBS.',
      alternativeIds: ['s3', 'ebs'],
    },
    walkthrough: {
      title: 'Separate two applications sharing one filesystem',
      steps: [
        'Create an application-specific access-point design with the intended root directory and POSIX identity.',
        'Verify a reachable mount target and its security-group rules.',
        'Mount using the intended access point with encryption in transit and the required IAM authorization.',
        'Test both allowed file operations and attempts to access another application’s directory.',
      ],
      expectedOutcome: 'Each application sees its intended filesystem subtree through a permitted network path.',
      failureMode: 'A correctly configured access point still times out because no mount target is reachable, or POSIX permissions reject file access.',
    },
    costDrivers: [
      'Used storage and its storage class determine storage cost; lower-cost classes have access and tiering considerations.',
      'Elastic or provisioned throughput, backups, replication and applicable data transfer add separate dimensions.',
    ],
    productionChecks: [
      'Test network, IAM and POSIX permissions independently rather than treating a successful mount as complete authorization.',
      'Measure the workload’s throughput and validate recovery for the chosen storage topology.',
    ],
    sources: [
      source('EFS access points and mount targets', 'https://docs.aws.amazon.com/efs/latest/ug/efs-access-points.html'),
      source('EFS storage and throughput pricing', 'https://aws.amazon.com/efs/pricing/'),
    ],
  },
  {
    serviceId: 's3',
    mentalModel: 'Lifecycle rules are automated data-management actions over selected objects and versions. They change retention and storage class independently of the application code that originally wrote the data.',
    decision: {
      useWhen: 'Choose S3 for object-based content, uploads, datasets and backups that can be addressed through object APIs.',
      avoidWhen: 'For shared filesystem behavior compare EFS; for low-latency keyed application updates compare DynamoDB. Storage-class selection must match retrieval needs.',
      alternativeIds: ['efs', 'dynamodb'],
    },
    walkthrough: {
      title: 'Design retention for uploaded reports',
      steps: [
        'Define which reports remain active, which can be archived and which may be deleted.',
        'Scope lifecycle rules by the intended prefix or tags and consider current versus noncurrent versions.',
        'Estimate transition requests and retrieval needs before selecting a lower-cost class.',
        'Test retrieving a representative retained report and review what expiration would remove.',
      ],
      expectedOutcome: 'A retention policy that matches business retrieval requirements and includes the cost of accessing older data.',
      failureMode: 'A broad rule expires needed reports, or archived data cannot be retrieved within the application’s expected response time.',
    },
    costDrivers: [
      'Stored bytes, storage class, requests, retrieval and data transfer are independent cost dimensions.',
      'Lifecycle transitions, retained noncurrent versions and minimum-duration charges can offset apparent storage savings.',
    ],
    productionChecks: [
      'Review lifecycle scope and version handling before enabling deletion.',
      'Test access policies and restoration with realistic clients; a lifecycle rule is not an authorization control.',
    ],
    sources: [
      source('S3 lifecycle transitions and expiration', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html'),
      source('S3 storage, request and retrieval pricing', 'https://aws.amazon.com/s3/pricing/'),
    ],
  },
  {
    serviceId: 'athena',
    mentalModel: 'Athena interprets a table definition over data rather than copying all of that data into a transactional database. Query cost and speed depend heavily on which files and columns the query must read.',
    decision: {
      useWhen: 'Choose Athena for SQL exploration and reporting over supported data sources, especially datasets already stored in S3.',
      avoidWhen: 'For serving many small transactional reads and writes, compare RDS or DynamoDB instead of treating an analytical query engine as the application database.',
      alternativeIds: ['rds', 'dynamodb'],
    },
    walkthrough: {
      title: 'Reduce a daily log query’s scan',
      steps: [
        'Record the data scanned by the original query over an unpartitioned log dataset.',
        'Organize a representative copy by a useful partition key such as event date and register or project the partitions correctly.',
        'Add a filter on that partition key and verify that the query reads only the intended data.',
        'Compare scan size and correctness, including late-arriving records and missing partitions.',
      ],
      expectedOutcome: 'The query returns the same intended result while reading a smaller, explicitly selected dataset.',
      failureMode: 'A partition exists in S3 but is absent from table metadata, so the query appears successful while omitting records.',
    },
    costDrivers: [
      'SQL queries can be charged by data scanned or reserved compute; Spark uses its compute pricing model.',
      'S3 data and result storage, requests, transfer and Glue Data Catalog usage can add charges.',
    ],
    productionChecks: [
      'Enforce appropriate workgroup scan limits and protect query-result storage.',
      'Validate partition discovery, schema changes and late data instead of checking only query completion.',
    ],
    sources: [
      source('Athena data partitioning', 'https://docs.aws.amazon.com/athena/latest/ug/partitions.html'),
      source('Athena query and associated-service costs', 'https://aws.amazon.com/athena/pricing/'),
    ],
  },
  {
    serviceId: 'kinesis',
    mentalModel: 'Kinesis Data Streams is a retained sequence of records divided into shards. Consumers maintain their own progress; reading a record does not delete it for other consumers.',
    decision: {
      useWhen: 'Use a data stream when multiple consumers need to process and potentially replay a flow of records within the retention window.',
      avoidWhen: 'For independent jobs deleted after successful processing, compare SQS. For primarily delivering data into managed destinations, compare Data Firehose.',
      alternativeIds: ['sqs', 'firehose'],
    },
    walkthrough: {
      title: 'Replay telemetry after a consumer outage',
      steps: [
        'Choose partition keys from the required ordering and traffic distribution.',
        'Record consumer checkpoints and monitor how far processing falls behind ingestion.',
        'Pause a synthetic consumer, then resume from the intended retained position.',
        'Verify that replayed records do not duplicate durable business effects.',
      ],
      expectedOutcome: 'A consumer can recover within the retention window without preventing other consumers from progressing.',
      failureMode: 'A hot partition key concentrates traffic, or a consumer falls beyond retained history before it recovers.',
    },
    costDrivers: [
      'Capacity mode determines whether charges center on provisioned resources or data ingested and retrieved; review the selected on-demand variant.',
      'Extended retention and enhanced fan-out can add costs, as can consumer compute and downstream storage.',
    ],
    productionChecks: [
      'Load-test skewed partition keys and track consumer lag against retention.',
      'Test checkpoint and duplicate-handling behavior across consumer restarts.',
    ],
    sources: [
      source('Kinesis Data Streams records, shards and consumers', 'https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html'),
      source('Kinesis capacity and retention pricing', 'https://aws.amazon.com/kinesis/data-streams/pricing/'),
    ],
  },
  {
    serviceId: 'opensearch',
    mentalModel: 'A search index is a structure optimized for finding and aggregating documents. In a design that indexes data from another system, ingestion freshness and the ability to rebuild the index become explicit responsibilities.',
    decision: {
      useWhen: 'Choose OpenSearch for search and analytical queries that need indexing, relevance or aggregation over documents.',
      avoidWhen: 'If the requirement is a few primary-key lookups, compare DynamoDB. For occasional SQL over S3 logs, compare Athena before operating a search workload.',
      alternativeIds: ['dynamodb', 'athena'],
    },
    walkthrough: {
      title: 'Diagnose an index that stopped accepting writes',
      steps: [
        'Inspect the exact write error and cluster health rather than replaying all rejected writes immediately.',
        'Check storage pressure, shard distribution and the documented write-block conditions.',
        'Address the underlying capacity or index-management problem using the chosen deployment’s procedures.',
        'Replay retained source events with stable document identifiers and verify search results.',
      ],
      expectedOutcome: 'Indexing resumes with a known recovery boundary and without silently dropping rejected documents.',
      failureMode: 'A storage-related block persists while aggressive retries increase load and hide the original cause.',
    },
    costDrivers: [
      'Managed domains use instance, storage and transfer dimensions; Serverless meters compute capacity and storage separately.',
      'Replica count, retention, indexing volume and query complexity influence the capacity the workload needs.',
    ],
    productionChecks: [
      'Set alarms for cluster health, free storage and rejected operations appropriate to the deployment.',
      'Test snapshot or source-based rebuild recovery and protect both search and administration access.',
    ],
    sources: [
      source('OpenSearch troubleshooting and cluster blocks', 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/handling-errors.html'),
      source('OpenSearch managed and Serverless pricing', 'https://aws.amazon.com/opensearch-service/pricing/'),
    ],
  },
  {
    serviceId: 'ecr',
    mentalModel: 'ECR stores versioned container artifacts; a runtime such as ECS or EKS executes them. Image retention must account for deployments that may need an older artifact during rollback or replacement.',
    decision: {
      useWhen: 'Use a container registry to distribute build artifacts to authorized deployment systems and runtimes.',
      avoidWhen: 'Do not choose ECR as the compute service. Compare ECS or EKS for running the image; S3 is a different artifact-storage interface.',
      alternativeIds: ['ecs', 'eks', 's3'],
    },
    walkthrough: {
      title: 'Avoid deleting the rollback image',
      steps: [
        'Identify images referenced by active releases and the rollback window.',
        'Draft lifecycle rules that separate retained releases from temporary build artifacts.',
        'Run lifecycle preview and inspect every image selected for expiration before applying the policy.',
        'Rehearse pulling the retained release from the deployment account.',
      ],
      expectedOutcome: 'Repository cleanup reduces unused storage while preserving recoverable release artifacts.',
      failureMode: 'A count-based rule expires an older image that a replacement task still needs to pull.',
    },
    costDrivers: [
      'Stored image and artifact data is charged to the repository owner; unnecessary retained layers increase storage usage.',
      'Applicable outbound data transfer and separately enabled enhanced scanning or related services can add costs.',
    ],
    productionChecks: [
      'Preview retention changes and verify release references before deleting artifacts.',
      'Test pull permissions and artifact availability from the actual runtime account and Region.',
    ],
    sources: [
      source('ECR lifecycle evaluation and preview', 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html'),
      source('ECR storage and transfer pricing', 'https://aws.amazon.com/ecr/pricing/'),
    ],
  },
  {
    serviceId: 'ecs',
    mentalModel: 'ECS schedules tasks, while a task definition describes what to run. The task execution role supports the platform’s startup work; the task role authorizes AWS calls made by the application.',
    decision: {
      useWhen: 'Choose ECS for managed container orchestration when the application does not require the Kubernetes API ecosystem.',
      avoidWhen: 'If Kubernetes compatibility is a core requirement, compare EKS. If a bounded event handler is enough, compare Lambda.',
      alternativeIds: ['eks', 'lambda'],
    },
    walkthrough: {
      title: 'Separate an image-pull failure from application AccessDenied',
      steps: [
        'Inspect whether the task failed before startup or whether a running container failed on an AWS API call.',
        'For startup failures, inspect the execution role, image reference and required network path.',
        'For a running application denied S3 access, inspect its task role and the relevant resource policy.',
        'Retest using scoped permissions and verify the actual task identity in audit evidence.',
      ],
      expectedOutcome: 'The permission change targets the correct role instead of granting both roles broad access.',
      failureMode: 'Giving S3 access only to the execution role does not authorize application code inside the task.',
    },
    costDrivers: [
      'Fargate uses requested compute and storage for task duration; EC2-backed tasks use the underlying instance and storage resources.',
      'Load balancing, logs and networking add costs. ECS Managed Instances has a management fee, unlike ordinary ECS orchestration.',
    ],
    productionChecks: [
      'Scope task and execution roles separately and test image startup plus application dependencies.',
      'Validate deployment health, replacement capacity and graceful task termination.',
    ],
    sources: [
      source('ECS task role versus execution role', 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html'),
      source('ECS compute options and charges', 'https://aws.amazon.com/ecs/pricing/'),
    ],
  },
  {
    serviceId: 'eks',
    mentalModel: 'EKS manages a Kubernetes control plane, but workload identity, deployment configuration and many data-plane choices still require design. A Kubernetes service account and an IAM role are related through an explicit integration.',
    decision: {
      useWhen: 'Choose EKS when the workload or team needs Kubernetes APIs, tooling and deployment conventions.',
      avoidWhen: 'If the application only needs to run a few containers and has no Kubernetes dependency, compare ECS before accepting the operational surface.',
      alternativeIds: ['ecs', 'ec2'],
    },
    walkthrough: {
      title: 'Give one workload access to its S3 data',
      steps: [
        'Choose a supported workload-identity mechanism and a narrowly scoped IAM role.',
        'For EKS Pod Identity, associate that role with the intended cluster, namespace and service account.',
        'Run the pod with that service account and a supported SDK credential provider.',
        'Test a permitted read and a denied read outside the workload’s scope; verify that node credentials are not an unintended fallback.',
      ],
      expectedOutcome: 'The workload receives its intended temporary identity without shipping static keys in the image.',
      failureMode: 'A namespace or service-account mismatch leaves the pod without the expected role, or another credential source takes precedence.',
    },
    costDrivers: [
      'Cluster charges depend on the selected offering and Kubernetes version support; extended support changes the cost.',
      'Worker compute, storage, networking and optional EKS capabilities or Auto Mode add to control-plane cost.',
    ],
    productionChecks: [
      'Check identity-mechanism prerequisites, SDK support and credential isolation.',
      'Plan Kubernetes and add-on upgrades before the current version’s support window changes.',
    ],
    sources: [
      source('EKS Pod Identity operation and prerequisites', 'https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html'),
      source('EKS cluster and data-plane pricing', 'https://aws.amazon.com/eks/pricing/'),
    ],
  },
  {
    serviceId: 'api',
    mentalModel: 'API Gateway is a managed API boundary whose capabilities depend on the API product chosen. HTTP API and REST API are not interchangeable settings on one feature-complete endpoint.',
    decision: {
      useWhen: 'Choose API Gateway when clients need a managed API entry point with supported authorization and backend integrations.',
      avoidWhen: 'If the requirement is GraphQL field resolution compare AppSync; for application load balancing compare ALB. Choose REST versus HTTP API from required features.',
      alternativeIds: ['appsync', 'elb'],
    },
    walkthrough: {
      title: 'Choose an API product before building a partner endpoint',
      steps: [
        'Write down requirements such as JWT authorization, request validation, usage plans or a private API endpoint.',
        'Check each requirement against the REST/HTTP API feature matrix rather than assuming support.',
        'Prototype authorization and integration separately, including backend invocation permission.',
        'Test rejected credentials, throttling, malformed input and backend failure responses.',
      ],
      expectedOutcome: 'An API product selected from concrete requirements and a traceable failure at each boundary.',
      failureMode: 'A team builds an HTTP API and later discovers that a required REST-only capability changes the design.',
    },
    costDrivers: [
      'API product, received calls and applicable data transfer determine core API costs.',
      'WebSocket messages and connection minutes, REST API caching and connected backend services have additional dimensions.',
    ],
    productionChecks: [
      'Verify the current feature matrix and deployment configuration for the chosen API type.',
      'Distinguish API authentication from backend invocation and downstream application authorization.',
    ],
    sources: [
      source('API Gateway REST and HTTP feature matrix', 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html'),
      source('API Gateway product pricing', 'https://aws.amazon.com/api-gateway/pricing/'),
    ],
  },
  {
    serviceId: 'cloudfront',
    mentalModel: 'A cache key declares which requests are allowed to share a response. Improving cache reuse is useful only after confirming that the shared response is correct for every matching viewer.',
    decision: {
      useWhen: 'Choose CloudFront for edge delivery in front of supported origins with deliberately designed cache behavior.',
      avoidWhen: 'Do not cache personalized responses under a shared key merely to improve hit rate. API Gateway or ALB still owns different API or application-routing responsibilities.',
      alternativeIds: ['api', 'elb'],
    },
    walkthrough: {
      title: 'Prevent one language version from overwriting another',
      steps: [
        'Identify the request field that selects a localized response from the origin.',
        'Decide whether that field belongs in the cache key or whether the response should bypass caching.',
        'Request two languages in alternating order and inspect cache hits and returned content.',
        'Remove irrelevant key inputs only after verifying they do not change the response.',
      ],
      expectedOutcome: 'Correct response variation with a measurable cache-hit benefit.',
      failureMode: 'The origin receives a response-varying header but the cache key omits it, so viewers receive another variant.',
    },
    costDrivers: [
      'Under pay-as-you-go pricing, viewer requests, outbound transfer and enabled edge features affect cost.',
      'Flat-rate plans bundle capabilities differently; evaluate the selected plan and origin-side work instead of applying one pricing model universally.',
    ],
    productionChecks: [
      'Test cache behavior with cookies, headers and query strings that influence authorization or content.',
      'Review TTLs, invalidation/versioning and origin access independently.',
    ],
    sources: [
      source('CloudFront cache-key policies', 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html'),
      source('CloudFront pay-as-you-go dimensions', 'https://aws.amazon.com/cloudfront/pricing/pay-as-you-go/'),
      source('CloudFront flat-rate plans', 'https://aws.amazon.com/cloudfront/pricing/'),
    ],
  },
  {
    serviceId: 'elb',
    mentalModel: 'For an Application Load Balancer, listeners select a target group and target-group health checks inform routing. Passing a health check proves only what the configured path and matcher actually tested.',
    decision: {
      useWhen: 'Use ALB for supported application-layer routing across instance, container or other supported targets; choose another load-balancer family member for different transport requirements.',
      avoidWhen: 'For API-management features compare API Gateway; for edge caching compare CloudFront. A load balancer does not replace those responsibilities.',
      alternativeIds: ['api', 'cloudfront'],
    },
    walkthrough: {
      title: 'Diagnose healthy hosts marked unhealthy by ALB',
      steps: [
        'Read each target’s health reason code and identify whether the failure is a timeout, connection or response mismatch.',
        'Check the configured health path, port and success-code matcher against the application.',
        'Verify the load-balancer-to-target network path and application readiness behavior.',
        'Retest failure behavior when one target and then all targets fail.',
      ],
      expectedOutcome: 'The health signal reflects application readiness and its routing consequence is understood.',
      failureMode: 'All registered targets become unhealthy and ALB fails open; health checks must not be used as a security boundary.',
    },
    costDrivers: [
      'Running load-balancer time and the selected family’s capacity units are separate billing dimensions.',
      'Connection patterns, processed traffic and enabled routing behavior influence capacity usage; transfer and related resources may add costs.',
    ],
    productionChecks: [
      'Keep readiness checks meaningful and verify them during deployment and dependency failures.',
      'Inspect target health and access evidence rather than assuming a running instance is a healthy application.',
    ],
    sources: [
      source('ALB target health and fail-open behavior', 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html'),
      source('Elastic Load Balancing pricing', 'https://aws.amazon.com/elasticloadbalancing/pricing/'),
    ],
  },
  {
    serviceId: 'route53',
    mentalModel: 'Route 53 changes DNS answers; it does not move an already-established application connection. Endpoint health, resolver caching and client reconnect behavior jointly determine the recovery users experience.',
    decision: {
      useWhen: 'Use Route 53 for authoritative DNS and supported routing policies that select application endpoints.',
      avoidWhen: 'For per-request application routing compare ALB; for cached content delivery compare CloudFront. DNS failover alone cannot repair application data or sessions.',
      alternativeIds: ['elb', 'cloudfront'],
    },
    walkthrough: {
      title: 'Rehearse DNS failover for an application',
      steps: [
        'Define a primary and secondary endpoint that can both serve the required application data.',
        'Choose an appropriate health signal and associate it with the failover record design.',
        'Simulate primary failure and observe authoritative answers, resolver-cached answers and client reconnects separately.',
        'Verify the secondary’s capacity and recovery behavior before declaring the test successful.',
      ],
      expectedOutcome: 'A measured recovery time that includes both DNS behavior and actual client traffic.',
      failureMode: 'The health check succeeds against a shallow endpoint while the application is broken, or clients retain old answers.',
    },
    costDrivers: [
      'Hosted zones, applicable DNS queries and record usage contribute to authoritative DNS cost.',
      'Health checks, domain registration and Resolver-related features have separate pricing; eligible alias-target queries have exceptions.',
    ],
    productionChecks: [
      'Test the selected health-check type and observe real client recovery.',
      'Verify secondary data readiness and protect hosted-zone change permissions.',
    ],
    sources: [
      source('Route 53 health checks and failover', 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html'),
      source('Route 53 DNS and optional-feature pricing', 'https://aws.amazon.com/route53/pricing/'),
    ],
  },
  {
    serviceId: 'vpc',
    mentalModel: 'A successful connection needs name resolution, a route in the required direction and traffic allowed by each applicable control. An IAM policy cannot create a missing network path.',
    decision: {
      useWhen: 'Use VPC networking to organize supported resources, route traffic and control access to private application dependencies.',
      avoidWhen: 'Do not add network complexity solely because a service appears in an architecture diagram. Compare a supported endpoint or managed-service connection against broad internet egress.',
      alternativeIds: ['privatelink', 'api'],
    },
    walkthrough: {
      title: 'Trace a private worker’s failed outbound request',
      steps: [
        'Resolve the destination and identify whether the request should use a service endpoint or internet egress.',
        'Inspect the worker subnet’s route table and the selected next hop.',
        'Check security groups, network ACLs and the return path for the chosen connection.',
        'After connectivity succeeds, diagnose any service authorization error as a separate boundary.',
      ],
      expectedOutcome: 'A specific failed network hop or policy is identified before permissions are broadened.',
      failureMode: 'A route points to a NAT gateway but the surrounding egress path is incomplete, so SDK retries only repeat timeouts.',
    },
    costDrivers: [
      'NAT gateway availability and processed data can be charged independently of the application’s compute.',
      'Public IPv4, endpoints, network-analysis features and applicable cross-AZ or cross-Region transfer can add costs.',
    ],
    productionChecks: [
      'Document intended paths for each dependency, including DNS and return traffic.',
      'Review single-AZ dependencies and use observed network evidence to validate the chosen topology.',
    ],
    sources: [
      source('VPC routing examples', 'https://docs.aws.amazon.com/vpc/latest/userguide/route-table-options.html'),
      source('VPC networking pricing dimensions', 'https://aws.amazon.com/vpc/pricing/'),
    ],
  },
  {
    serviceId: 'cognito',
    mentalModel: 'A signed token conveys claims for a specific issuer, client and token purpose. Authenticating the user still leaves the application responsible for deciding which records that user may access.',
    decision: {
      useWhen: 'Use a user pool for application sign-in and tokens; add an identity pool when trusted clients genuinely need temporary AWS credentials.',
      avoidWhen: 'For backend workload permissions use IAM roles rather than making workloads sign in as users. Do not exchange user tokens for broad AWS credentials by default.',
      alternativeIds: ['iam', 'sts'],
    },
    walkthrough: {
      title: 'Reject a valid token used for the wrong purpose',
      steps: [
        'Verify the token signature with a maintained verifier and the intended user-pool keys.',
        'Check issuer, expiry, intended client and token_use; validate required API scopes as appropriate.',
        'Send a token from another client or of the wrong token type and confirm rejection.',
        'Apply record-ownership checks after token validation and define how early revocation is handled.',
      ],
      expectedOutcome: 'Only the intended identity context reaches application authorization.',
      failureMode: 'Decoding or checking the signature alone accepts a token issued for a different client or use; offline validation alone does not detect revocation.',
    },
    costDrivers: [
      'User-pool tier, monthly active users and federation choices determine core user-authentication pricing.',
      'Machine-to-machine tokens, higher quotas and SMS or email delivery can have separate charges.',
    ],
    productionChecks: [
      'Test expired, wrong-issuer, wrong-client and wrong-purpose tokens without logging their contents.',
      'Define refresh, logout and revocation behavior explicitly for every client type.',
    ],
    sources: [
      source('Cognito token verification', 'https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html'),
      source('Cognito token revocation and offline-validation limits', 'https://docs.aws.amazon.com/cognito/latest/developerguide/token-revocation.html'),
      source('Cognito tiers and authentication pricing', 'https://aws.amazon.com/cognito/pricing/'),
    ],
  },
  {
    serviceId: 'iam',
    mentalModel: 'Authorization is a decision about one principal performing one action on one resource in a request context. Trust, granted permissions and restrictive guardrails participate differently; a role name alone explains none of them.',
    decision: {
      useWhen: 'Use IAM roles and policies to authorize AWS workloads and federated identities with narrowly scoped temporary access.',
      avoidWhen: 'For customer sign-in and application sessions compare Cognito. STS issues role-session credentials but is not a replacement for the underlying permissions.',
      alternativeIds: ['cognito', 'sts'],
    },
    walkthrough: {
      title: 'Investigate AccessDenied without AdministratorAccess',
      steps: [
        'Identify the actual caller session, denied action, resource ARN and relevant request conditions.',
        'Inspect applicable identity and resource policies, then boundaries and organizational controls where relevant.',
        'Look for an explicit deny and distinguish role-assumption failure from denial after assumption.',
        'Validate a narrowly scoped policy change and retest both the allowed operation and a deliberately forbidden operation.',
      ],
      expectedOutcome: 'A specific authorization explanation and a minimal change with a negative test.',
      failureMode: 'An additional Allow cannot override an explicit Deny, and a trust-policy edit does not grant arbitrary downstream permissions.',
    },
    costDrivers: [
      'Core IAM identities and permission management are offered without an additional IAM charge; permitted workloads still incur their service costs.',
      'Some Access Analyzer capabilities and associated audit services are separately priced; check the enabled feature rather than assuming every access-analysis operation is free.',
    ],
    productionChecks: [
      'Retain negative authorization tests and review resource-policy as well as identity-policy exposure.',
      'Use access analysis and observed activity to reduce permissions without treating a simulator result as a complete production proof.',
    ],
    sources: [
      source('IAM policy evaluation logic', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html'),
      source('IAM service and pricing FAQ', 'https://aws.amazon.com/iam/faqs/'),
      source('Access Analyzer capabilities and pricing scope', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html'),
    ],
  },
  {
    serviceId: 'kms',
    mentalModel: 'KMS manages cryptographic keys and controlled operations; it is not a store for the application’s encrypted files. A service’s data-access permission and permission to use its encryption key are separate checks.',
    decision: {
      useWhen: 'Choose a supported KMS integration when the application needs controlled key use, audit visibility or customer-managed key policy.',
      avoidWhen: 'For storing and rotating application credentials compare Secrets Manager. Choosing a customer-managed key adds lifecycle responsibilities and is not automatically required for every encrypted service.',
      alternativeIds: ['secrets-manager', 's3'],
    },
    walkthrough: {
      title: 'Explain why an encrypted object cannot be read',
      steps: [
        'Identify the exact object encryption key and the caller’s effective identity.',
        'Check storage access separately from KMS authorization, including the key’s policy and state.',
        'Verify that the request uses the expected key and Region rather than a similarly named alias elsewhere.',
        'Retest with the intended role and ensure an unrelated role remains denied.',
      ],
      expectedOutcome: 'The storage and cryptographic authorization boundaries are both understood.',
      failureMode: 'The caller can retrieve an object but lacks the required key authorization, or the key was disabled while encrypted data still depends on it.',
    },
    costDrivers: [
      'Customer-managed keys have recurring key charges; key ownership and rotation choices affect which charges apply.',
      'Cryptographic API usage, algorithm choice and optional custom key-store infrastructure affect additional cost.',
    ],
    productionChecks: [
      'Inventory dependent data before disabling or scheduling deletion of a key.',
      'Separate key administration from data use and verify recovery access under the chosen policy.',
    ],
    sources: [
      source('KMS key ownership, hierarchy and lifecycle', 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html'),
      source('KMS key and operation pricing', 'https://aws.amazon.com/kms/pricing/'),
    ],
  },
];
