/** Expected DVA-C03 study mapping, not a claim that a form or scenario is implemented. */
export interface ConfigurationSkill {
  id:string;
  /** Concise original paraphrase; consult sourceUrl for the official wording. */
  title:string;
  serviceIds:string[];
  topics:string[];
  learningMode:'configuration'|'code'|'concept'|'mixed';
  sourceUrl:string;
  verified:string;
}

const skill=(id:string,title:string,serviceIds:string[],topics:string[],learningMode:ConfigurationSkill['learningMode']):ConfigurationSkill=>({
  id,title,serviceIds,topics,learningMode,
  sourceUrl:`https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/developer-associate-03-domain${id[0]}.html`,
  verified:'2026-11-01',
});

export const configurationSkills:ConfigurationSkill[]=[
  skill('1.1.1','Decouple application components',['sqs','sns','eventbridge','step-functions'],['coupling','failure boundaries','buffering','fan-out','workflow ownership'],'mixed'),
  skill('1.1.2','Choose request or event processing',['api','lambda','sqs','eventbridge'],['synchronous invocation','asynchronous processing','event source mappings','response ownership'],'mixed'),
  skill('1.1.3','Build resilient application behavior',['lambda','sqs','step-functions','cli'],['retry ownership','backoff and jitter','idempotency','graceful degradation','bounded deadlines'],'mixed'),
  skill('1.1.4','Maintain API request and response contracts',['api','lambda'],['routes and methods','request validation','payload versions','request and response transformations','error contracts'],'mixed'),
  skill('1.1.5','Call service APIs through SDKs',['cli','lambda','sts','iam'],['credential resolution','Region and endpoint','request signing','pagination','SDK error handling'],'mixed'),
  skill('1.1.6','Process streaming application records',['kinesis','firehose','lambda'],['partition keys','consumer throughput','checkpoints','replay','record processing failures'],'mixed'),
  skill('1.1.7','Serialize service-boundary payloads',['lambda','api','dynamodb','s3'],['serialization','deserialization','schema evolution','binary and JSON values','contract tests'],'code'),
  skill('1.1.8','Implement event-driven service interactions',['eventbridge','s3','sqs','sns','lambda'],['event contracts','filtering','delivery failure','duplicate delivery','consumer behavior'],'mixed'),
  skill('1.1.9','Review AI-assisted development artifacts',['kiro'],['repository guidance','spec-driven changes','code review','generated-test review','security review'],'mixed'),
  skill('1.1.10','Integrate approved managed AI capabilities',['bedrock','agentcore','quick','lambda'],['typed inference calls','model and Region availability','request limits','output handling','agent versus inference responsibilities'],'mixed'),
  skill('1.2.1','Connect functions to private resources',['lambda','vpc','privatelink','rds','secrets-manager'],['subnets','security groups','routes and endpoints','DNS assumptions','execution-role permissions'],'configuration'),
  skill('1.2.2','Set function runtime and resource configuration',['lambda'],['runtime and handler','memory and timeout','environment variables','layers and extensions','concurrency'],'configuration'),
  skill('1.2.3','Handle function invocation failures',['lambda','sqs','sns','eventbridge'],['invocation mode','event age and retries','destinations','dead-letter queues','partial batch handling'],'mixed'),
  skill('1.2.4','Connect function code, triggers and destinations',['lambda','api','dynamodb','sqs','s3','eventbridge'],['integration permissions','event source mappings','event filtering','polling and batch settings','destination contracts'],'mixed'),
  skill('1.3.1','Manage application-data retention',['s3','glacier','dynamodb','cloudwatch-logs'],['lifecycle transitions','versioned object retention','TTL','log retention','retrieval tradeoffs'],'mixed'),
  skill('1.3.2','Match data stores to application access',['dynamodb','s3','rds','aurora','elasticache','opensearch'],['access patterns','operation shape','latency and freshness','query requirements','connection behavior'],'concept'),
  skill('1.3.3','Choose an appropriate application cache',['elasticache','dynamodb','cloudfront'],['cache location','cache keys','TTL','invalidation','DAX versus application caching'],'mixed'),
  skill('1.3.4','Configure DynamoDB application access',['dynamodb'],['partition and sort keys','attribute types','GSI and LSI','read consistency','Query versus Scan','pagination and capacity'],'mixed'),

  skill('2.1.1','Use federated application identities',['cognito','sts','iam'],['user pool versus identity pool','OIDC and SAML','role mapping','temporary credentials','trust relationships'],'mixed'),
  skill('2.1.2','Apply caller access controls',['cognito','api','iam','sts'],['JWT validation','authorization scopes','fine-grained access','MFA','token lifecycle'],'mixed'),
  skill('2.1.3','Configure development-time AWS credentials',['cli','cloudshell','sts','iam'],['credential provider chain','profiles','temporary credentials','Region selection','credential hygiene'],'mixed'),
  skill('2.1.4','Delegate short-lived signed access',['s3','cloudfront'],['presigned requests','expiration','signed URLs and cookies','signer permissions','URL handling'],'mixed'),
  skill('2.1.5','Authenticate application service requests',['iam','sts','lambda','ecs','ec2','cli'],['SigV4','execution and task roles','instance profiles','credential refresh','service endpoints'],'mixed'),
  skill('2.1.6','Define principal and resource permissions',['iam','lambda','s3','sqs','kms'],['identity policy','resource policy','trust policy','actions and resource scope','conditions','explicit deny'],'mixed'),
  skill('2.1.7','Assume scoped temporary roles',['sts','iam','cognito'],['caller permission','trust policy','session duration','session policy','external ID and MFA context'],'mixed'),
  skill('2.2.1','Protect stored and transmitted application data',['kms','s3','rds','aurora','efs','ebs','acm'],['encryption at rest','TLS','service encryption configuration','key access','client connection settings'],'configuration'),
  skill('2.2.2','Use managed application certificates',['acm','private-ca','api','cloudfront','elb'],['certificate names','public and private trust','validation','attachment compatibility','renewal responsibility'],'mixed'),
  skill('2.2.3','Choose encryption placement',['kms','s3','lambda'],['client-side encryption','server-side encryption','envelope encryption','key custody','application decryption boundary'],'mixed'),
  skill('2.2.4','Use keys for application cryptography',['kms','s3','secrets-manager'],['Encrypt and Decrypt','data keys','encryption context','key policy and grants','permissions chain'],'mixed'),
  skill('2.2.5','Create development certificates and key pairs',['acm','private-ca','ec2'],['certificate request workflow','public and private key handling','SSH development keys','trust validation','safe storage'],'mixed'),
  skill('2.2.6','Minimize exposure of sensitive content',['lambda','api','s3','cloudwatch-logs','bedrock'],['data classification','masking and redaction','input and output validation','tenant access boundaries','log minimization'],'mixed'),
  skill('2.2.7','Retrieve sensitive configuration safely',['secrets-manager','systems-manager','kms','lambda','ecs'],['secret references','rotation','runtime retrieval','cache and refresh','decryption permission'],'mixed'),
  skill('2.3.1','Authorize access to managed AI',['bedrock','agentcore','iam'],['service availability','invocation actions','resource scope','approved model access','request identity'],'mixed'),
  skill('2.3.2','Apply AI data-transfer privacy controls',['bedrock','agentcore','privatelink','vpc','quick'],['private connectivity','provider data-use controls','approved data sources','transport versus retention','sensitive request minimization'],'mixed'),
  skill('2.3.3','Apply existing AI input and output controls',['bedrock','agentcore','quick','kiro'],['existing guardrail configuration','content filtering','sensitive-data redaction','prompt injection boundaries','output validation'],'mixed'),
  skill('2.3.4','Constrain agent sessions and tool actions',['agentcore','bedrock','iam','kiro'],['inbound versus outbound identity','tool authorization','session isolation','approval gates','action allowlists'],'mixed'),
  skill('2.3.5','Protect AI-related operational telemetry',['cloudwatch-logs','cloudwatch','xray','bedrock','agentcore'],['safe metadata','prompt and response logging controls','access and retention','trace redaction','audit usefulness'],'mixed'),

  skill('3.1.1','Package code dependencies and configuration',['lambda','codebuild','ecr','systems-manager','secrets-manager'],['dependency locking','build versus runtime configuration','environment variables','artifact contents','container images'],'mixed'),
  skill('3.1.2','Build and retain deployment images',['ecr','codebuild','ecs','eks'],['Dockerfile review','build context','image tags and digests','registry permissions','image lifecycle'],'mixed'),
  skill('3.1.3','Connect source revisions to deployment',['codepipeline','codebuild','amplify'],['source repository connection','branch and commit identity','source artifacts','repository credentials','revision traceability'],'mixed'),
  skill('3.1.4','Manage configuration across environments',['appconfig','systems-manager','secrets-manager','api','lambda'],['environment-specific values','configuration validation','secret references','parameter versions','safe configuration rollout'],'configuration'),
  skill('3.1.5','Use API deployment stages and endpoints',['api'],['API product differences','stage-specific URLs','deployment snapshots','auto-deployment','stage configuration'],'configuration'),
  skill('3.2.1','Develop and validate application tests',['sam','cdk','cloudformation','lambda','codebuild'],['unit and integration seams','template assertions','test validation','deployed-environment checks','mock versus live evidence'],'mixed'),
  skill('3.2.2','Mock external service boundaries',['api','lambda','sam','codebuild'],['dependency injection','request and response fixtures','mock API behavior','error-path tests','unsupported conclusions'],'mixed'),
  skill('3.2.3','Construct representative event fixtures',['lambda','api','eventbridge','sqs','s3'],['event source envelopes','payload versions','batch events','malformed input cases','serialization tests'],'code'),
  skill('3.2.4','Configure versioned test environments',['lambda','ecr','ecs','eks','amplify','api'],['function aliases','image digests and tags','frontend branches','API stages','environment identity','Copilot environment concepts'],'configuration'),
  skill('3.2.5','Validate AI-assisted testing workflows',['kiro','codebuild'],['generated test review','regression coverage','test execution','result analysis','human-owned acceptance criteria'],'mixed'),
  skill('3.3.1','Package Lambda releases efficiently',['lambda','sam','codebuild','ecr'],['ZIP packages','container packaging','layers','dependency size','runtime compatibility'],'mixed'),
  skill('3.3.2','Roll out containerized applications',['ecs','eks','ecr','codebuild'],['task definitions','Kubernetes manifests','Fargate compatibility','health probes','rolling updates'],'mixed'),
  skill('3.3.3','Deploy reviewed application templates',['cloudformation','sam','cdk'],['template parameters','references and outputs','change review','deployment permissions','rollback behavior'],'mixed'),
  skill('3.3.4','Deploy platform-specific revisions',['codedeploy','lambda','ec2','ecs'],['revision artifacts','AppSpec','lifecycle hooks','deployment groups','health checks'],'configuration'),
  skill('3.3.5','Orchestrate approved delivery stages',['codepipeline','codebuild','codedeploy'],['action ordering','artifact handoff','multiple environments','manual approval','stage roles'],'configuration'),
  skill('3.3.6','Choose controlled release strategies',['codedeploy','lambda','ecs','elastic-beanstalk','api'],['blue-green','canary','rolling','traffic shifting','platform-specific support'],'mixed'),
  skill('3.3.7','Configure and execute release rollback',['cloudformation','codedeploy','cloudwatch','appconfig'],['rollback triggers','alarm evaluation','previous revision identity','rollback prerequisites','failed-release evidence'],'mixed'),
  skill('3.3.8','Track source versions through a release',['codepipeline','codebuild','amplify','ecr'],['branches and tags','immutable revision identifiers','artifact provenance','promotion consistency','release labels'],'mixed'),
  skill('3.3.9','Review AI-supported delivery decisions',['kiro','codepipeline','codebuild','cloudformation'],['reviewable generated changes','approval ownership','environment provisioning review','post-deployment validation','safe failure handling'],'mixed'),

  skill('4.1.1','Locate code and integration defects',['lambda','api','cloudwatch-logs','xray','codebuild'],['first failed boundary','contract and permission errors','representative events','deployment packaging defects','debugging hypotheses'],'mixed'),
  skill('4.1.2','Interpret operational evidence',['cloudwatch','cloudwatch-logs','xray'],['metrics versus logs versus traces','latency decomposition','error correlation','representative samples','causality limits'],'mixed'),
  skill('4.1.3','Query logs to test a hypothesis',['cloudwatch-logs'],['Logs Insights query','structured fields','time range','correlation IDs','query limitations'],'code'),
  skill('4.1.4','Diagnose deployment failures from logs',['codebuild','codedeploy','codepipeline','cloudformation','cloudwatch-logs'],['build output','lifecycle-hook output','stack events','artifact handoff','first failure versus later symptoms'],'mixed'),
  skill('4.1.5','Check AI-generated troubleshooting advice',['kiro','quick','cloudwatch-logs','cloudwatch'],['sanitized evidence','evidence-linked hypotheses','verification steps','privacy controls','unsupported certainty'],'mixed'),
  skill('4.2.1','Emit useful and safe structured logs',['cloudwatch-logs','lambda','api','ecs'],['event schema','log levels','correlation IDs','redaction','retention and access'],'mixed'),
  skill('4.2.2','Emit application-specific metrics',['cloudwatch','cloudwatch-logs','lambda'],['PutMetricData','embedded metric format','dimensions','units','cardinality and aggregation'],'code'),
  skill('4.2.3','Configure actionable operational alerts',['cloudwatch','sns','codedeploy','codepipeline'],['alarm thresholds','evaluation periods','missing-data handling','notification actions','quota and release events'],'configuration'),
  skill('4.2.4','Instrument distributed request traces',['xray','lambda','api','ecs'],['trace context','instrumentation','sampling','segments and subsegments','safe annotations'],'mixed'),
  skill('4.2.5','Monitor application readiness and health',['elb','ecs','eks','elastic-beanstalk','cloudwatch'],['health-check endpoints','liveness versus readiness','unhealthy targets','deployment health','monitoring scope'],'mixed'),
  skill('4.3.1','Apply workload concurrency controls',['lambda','ec2','ecs','rds','aurora'],['reserved versus provisioned concurrency','Auto Scaling','worker and thread pools','connection pooling','downstream capacity'],'mixed'),
  skill('4.3.2','Tune compute resources using evidence',['lambda','ec2','ecs','eks','cloudwatch'],['memory and compute settings','profiling','duration and throughput','resource limits','measurement before tuning'],'mixed'),
  skill('4.3.3','Improve messaging efficiency without losing correctness',['sqs','sns','lambda','eventbridge'],['batching','fan-out','polling','ordering requirements','idempotency','duplicate processing'],'mixed'),
  skill('4.3.4','Apply service-aware caching',['elasticache','dynamodb','cloudfront'],['DAX','cache-aside','cache keys','freshness and TTL','invalidation','failure behavior'],'mixed'),
  skill('4.3.5','Find the measured performance bottleneck',['cloudwatch','cloudwatch-logs','xray','lambda','dynamodb'],['latency and saturation','throttles','hot partitions','query evidence','dependency timings'],'mixed'),
  skill('4.3.6','Validate AI-suggested optimizations',['kiro','quick','cloudwatch','xray'],['baseline measurements','proposed changes','resource-usage evidence','regression checks','post-change verification'],'mixed'),
];
