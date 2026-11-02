# Ma trận audit configuration — 2026-11-02

Đã rà inventory/schema của toàn bộ catalog. Cột audit là số field có hồ sơ kiểm chứng mới và phạm vi cụ thể trong metadata, **không phải phần trăm tương thích AWS**. Các quy tắc liên-field và kiểm tra cũ không được quy đổi thành tỷ lệ. Các khoảng trống là đề xuất cần điều tra/triển khai, không phải khẳng định cấu hình hiện tại bị AWS từ chối.

| Service | Field chính / cả cột | Field có audit mới | Đánh giá và việc cần làm kỹ hơn |
|---|---:|---:|---|
| lambda | 34 / 57 | 2 | Đã có timeout/memory và kiểm tra SQS liên kết; bổ sung batch/window. Còn cần ma trận runtime–architecture–package, SnapStart theo runtime/version, quota concurrency theo account và toàn bộ event source. |
| api | 30 / 65 | 0 | Bổ sung trần HTTP integration timeout; đã phân biệt một số HTTP/REST authorizer và deployment. Còn route matching, VPC link/ALB/NLB, authorizer TTL, throttling/account quota, REST timeout tăng quota và mapping templates. |
| dynamodb | 27 / 43 | 0 | Đã có tên bảng, GSI consistency/GetItem và một số document checks. Còn key schema đầy đủ, capacity của từng index, projection, LSI/GSI lifecycle, global-table consistency mode và transaction limits. |
| s3 | 28 / 55 | 0 | Đã có tên bucket, Ownership/ACL, Object Lock/versioning và Bucket Key checks. Cần phân biệt directory/general-purpose bucket theo từng field, lifecycle transition combinations, replication IAM/KMS, presigned URL credential lifetime. |
| glacier | 10 / 10 | 0 | Schema thể hiện archival intent. Cần kiểm chứng ma trận storage class–retrieval tier–restore request; tránh áp restoreDays cho lớp truy cập trực tiếp. Phần lớn vẫn là mô tả. |
| sqs | 26 / 29 | 2 | Bổ sung batch/window; FIFO/window/visibility đã có. Cần DLQ type/account/Region consistency, FIFO throughput/deduplication scope, KMS permissions, maxReceiveCount evidence và concurrency theo mapping. |
| sns | 14 / 22 | 0 | Có topic/subscription settings và document checks. Cần ma trận standard/FIFO topic–protocol–subscriber, filter policy scopes/complexity, raw delivery, DLQ và retry policy theo protocol. |
| eventbridge | 13 / 32 | 2 | Bổ sung retry count/event age của target. Cần event-bus permissions, target-specific role/resource policy, input transformer validation, pattern operators và archive/replay compatibility. Legacy preview chỉ exact-match subset. |
| step-functions | 18 / 38 | 0 | Bổ sung workflow duration, heartbeat/timeout và Express integration patterns. ASL document checks còn giới hạn; cần state-specific grammar, JSONata/JSONPath, Map mode/concurrency, service integration matrix và payload-size validation. |
| ec2 | 26 / 39 | 11 | Bổ sung IMDS range, capacity order, subnet picker, VPC frame reference và shared SG assignments. AMI/instance type/architecture, ENI limits, instance-profile object và EBS AZ compatibility chưa được xác nhận đầy đủ. |
| elastic-beanstalk | 22 / 32 | 7 | Có environment/deployment intent và điều kiện traffic split. Cần platform-specific option namespaces, worker/web compatibility, deployment batch semantics, instance profile/service role và supported runtime branches. |
| ecr | 13 / 14 | 0 | Có scanning, mutability, policy và lifecycle documents. Cần kiểm tra repository-name grammar, exclusion combinations, registry-level vs repository-level scanning, policy action compatibility và lifecycle rule semantics. |
| ecs | 29 / 52 | 8 | Bổ sung Fargate CPU/RAM/OS matrix và container health interval. Cần platformVersion, container resource sums, port mapping/network mode, deployment controller constraints, capacity providers và task-vs-execution role resolution. |
| eks | 23 / 33 | 0 | Schema gồm Kubernetes application intent. Cần kiểm chứng đúng Kubernetes version/schema, probes, replica/PDB/HPA relations, service account IAM/Pod Identity, node mode và cluster/network settings. Không coi arbitrary YAML là valid Kubernetes. |
| aurora | 27 / 34 | 8 | Bổ sung backup retention. Cần engine/version-specific Serverless v2 ACU bounds, auto-pause support, promotion tiers, endpoint routing, parameter group family và IAM auth eligibility. |
| rds | 24 / 34 | 8 | Bổ sung backup retention và replica/Multi-AZ-cluster restrictions. Cần engine/deployment-specific auth/log exports/storage/port/parameter combinations, subnet group/AZ coverage và instance classes. |
| elasticache | 22 / 29 | 7 | Schema phân biệt deployment/engine nhưng chưa kiểm chứng đầy đủ tổ hợp. Cần Memcached vs Valkey/Redis settings, auth/TLS/version, shard/replica constraints, serverless restrictions và cache-specific TTL behavior. |
| ebs | 14 / 14 | 3 | Bổ sung regional volume-size ranges, IOPS/size và gp3 throughput ratios. Cần Outposts context, actual instance/Nitro limits, Multi-Attach eligibility, same-AZ attachment, encryption/KMS and snapshot lineage. |
| efs | 14 / 30 | 8 | Bổ sung Max I/O incompatibilities và lifecycle day enums. Cần mount target per AZ, POSIX UID/GID/path permissions, access point requirements, lifecycle ordering, Region throughput quota và archive eligibility. |
| cloudfront | 14 / 36 | 1 | Bổ sung origin connection timeout, duplicate origin IDs, S3 website protocol. Cần behavior-to-origin references, cache policy min/default/max hierarchy, viewer cert Region, allowed/cached method subsets và custom error status enums. |
| elb | 12 / 41 | 7 | Đã kiểm tra một số ALB/NLB listener/action differences. Cần target type/VPC/port compatibility, listener protocol/TLS certificate matrix, health-check ranges theo type, rule priorities và NLB attribute variants. |
| route53 | 6 / 25 | 2 | Bổ sung weight và failure-threshold bounds. Cần alias-vs-record TTL, record-type grammar, routing-policy-specific fields, private zone associations và health-check type applicability. |
| vpc | 9 / 30 | 10 | Bổ sung CIDR syntax/prefix/containment/overlap trong node và frame, SG/NACL checks. Còn multiple CIDR/dual stack/IPAM/BYOIP, route target validity, actual reachability, cross-account/Region and SG VPC associations. |
| privatelink | 11 / 20 | 7 | Có endpoint variant fields; shared interface endpoint bổ sung DNS prerequisites và một subnet/AZ. Cần service-specific endpoint types/policy support, endpoint service acceptance, DNS conflicts và subnet IP family support. |
| amplify | 13 / 19 | 0 | Schema chủ yếu là build/hosting intent. Cần framework/platform compatibility, buildspec grammar, monorepo paths, rewrite rules and SSR IAM/runtime support; không chạy build thật. |
| cloudshell | 12 / 13 | 0 | Đã có VPC persistence incompatibility. Cần kiểm chứng availability theo Region, VPC subnet/SG refs, timeout/resource behavior và nhận diện field nào chỉ là kế hoạch thao tác. |
| codeartifact | 12 / 13 | 0 | Đã có token duration/special zero case. Cần package format/source support, repository/domain naming, upstream ordering/cycles, origin controls và permission contexts. |
| codebuild | 17 / 23 | 1 | Bổ sung timeout và Lambda compute incompatibilities. Cần toàn bộ environment–compute–image–Region matrix, fleet rules, VPC/privileged/local-cache combinations, buildspec phase schema và report/artifact contracts. |
| codedeploy | 16 / 21 | 0 | Schema có platform và AppSpec documents. Cần platform-specific deploymentType/traffic strategy/lifecycle hooks, hook deadlines, EC2 vs ECS vs Lambda AppSpec schema, alarms và rollback consistency. |
| codepipeline | 13 / 23 | 0 | Schema có stages/artifacts và execution choices. Cần action provider/version/category/Region matrix, artifact name/reference graph, runOrder, V1/V2 feature compatibility và pipeline-level role behavior. |
| xray | 10 / 16 | 3 | Bổ sung sampling fraction/priority/reservoir integer checks. Cần field name lengths, sampling match specificity, trace payload/annotation boundaries và instrumentation support. Không suy ra mọi request đều có trace. |
| appconfig | 15 / 17 | 3 | Bổ sung growth factor/deploy duration/bake time. Cần validators vs profile type, deployment strategy behavior, environment monitors/roles và actual rollback prerequisites. |
| cdk | 12 / 12 | 0 | Field phần lớn là developer workflow intent. Cần tách khỏi AWS console settings; không thể xác nhận synth/deploy chỉ từ checkbox. Cần artifact-level synth/assertions/template evidence ở đợt tiếp theo. |
| cloudformation | 14 / 17 | 0 | Có bounded document parsing/checks. Cần resource schemas theo version, intrinsic resolution, dependency cycles, update/replacement semantics và capability constraints. Không coi JSON parse thành công là template deploy được. |
| cloudtrail | 12 / 15 | 0 | Có trail/event selectors intent. Cần phân biệt trail S3 retention với Lake retention, selector grammar, organization/multi-Region prerequisites, KMS/bucket policies và management/data event coverage. |
| cloudwatch | 18 / 23 | 4 | Sửa threshold âm/thập phân; thêm period/M-N/evaluation duration. Cần metric-math/alarm type compatibility, missing-data/statistic behavior, action support, dimensions and dynamic thresholds. |
| cloudwatch-logs | 12 / 21 | 1 | Bổ sung retention dropdown đúng enum. Đã phân biệt một số log-class features. Cần subscriptions/metric filter quotas, destination/KMS permissions, log name grammar và current class-specific features. |
| cli | 15 / 15 | 0 | Nhiều field là workflow/application choices. Cần tách global CLI options khỏi service API limits; không áp một pageSize/retry maximum cho mọi command. Cần command-specific validation nếu muốn chạy lệnh. |
| systems-manager | 14 / 14 | 0 | Schema tập trung Parameter Store. Cần standard/advanced parameter sizes, data type/tier policies, name/hierarchy grammar, SecureString/KMS và parameter vs application-cache semantics. |
| sam | 14 / 18 | 0 | Có template/build/deploy intent. Cần SAM transform-specific schemas, event-source variants, Globals inheritance, local-vs-cloud differences và template validation without execution. |
| athena | 16 / 16 | 0 | Có workgroup/query intent. Cần bytes-scanned cutoff, result reuse, engine version, S3 output/encryption permissions, catalog/workgroup enforcement và query parameter validation. |
| kinesis | 15 / 15 | 1 | Bổ sung retention range. Cần consumer-specific batch limits, on-demand/provisioned transitions, per-shard/request quotas, enhanced fan-out and partition-key constraints. |
| firehose | 15 / 15 | 0 | Buffer/retry fields phụ thuộc destination. Cần destination-specific ranges, transform-Lambda contract, dynamic partitioning and backup/error paths. Không đặt một trần buffer chung cho mọi destination. |
| opensearch | 15 / 19 | 0 | Schema có managed/serverless variants. Cần engine/deployment-specific node/index fields, fine-grained access prerequisites, TLS/KMS requirements, instance/storage compatibility và supported index settings. |
| iam | 16 / 21 | 1 | Bổ sung maximum role session duration; policy library có bounded evaluator. Cần actual IAM identity naming/attachment quotas, complete condition semantics, SCP/RCP and cross-account evaluation; local role ≠ full instance profile. |
| sts | 15 / 17 | 0 | Bổ sung duration theo operation và linked-role maximum. Cần explicit caller type/root duration, operation-specific session policies/tags/MFA/externalId, federation name grammar and packed-policy context. |
| cognito | 19 / 37 | 0 | Có user/identity-pool distinction. Cần OAuth flow/client-secret combinations, callback URL grammar, token unit conversion and API/console minimum discrepancies, password/MFA prerequisites và identity-provider mapping. |
| kms | 16 / 19 | 3 | Bổ sung deletion/rotation ranges và automatic-rotation spec/usage/origin checks. Cần ownership/rotation matrix đầy đủ, multi-Region primary/replica states, grant conditions và full KMS authorization. Range hợp lệ không đủ xác nhận rotation được hỗ trợ. |
| secrets-manager | 16 / 18 | 0 | Có reference/rotation/cache intent. Cần rotation schedule/window grammar, managed vs Lambda rotation, version staging constraints, replica Region/KMS relations và policy/action checks. Không lưu secret literal. |
| acm | 11 / 15 | 0 | Schema có public/private/imported certificate intent. Cần certificate Region theo integration, domain/SAN grammar, validation modes, key algorithms and renewal eligibility. Không xác nhận DNS ownership từ form. |
| private-ca | 12 / 12 | 0 | Có CA type/mode/algorithm intent. Cần signing/key algorithm compatibility, certificate template/validity/parent limits, CRL/OCSP requirements và short-lived mode semantics. |
| waf | 12 / 22 | 2 | Bổ sung rate limit và một số linked resource variant/scope checks (kể cả Amplify). Cần Region compatibility, priority uniqueness, rate evaluation windows, statement JSON schema, WCU and action/rule-group restrictions. |
| bedrock | 16 / 18 | 0 | Nhiều field là app policy, không phải AWS control-plane settings. Cần model/API-specific inference parameter schemas, model/Region availability and invocation-resource permissions; không có universal maxTokens/temperature cap. |
| agentcore | 11 / 18 | 0 | Phần lớn là architecture intent. Cần runtime schema/version-specific session/auth/network limits, identity integration, memory semantics và tool authorization boundaries; không suy ra isolation chỉ từ dropdown. |
| quick | 10 / 13 | 0 | Profile phục vụ học và mô tả governance. Cần đối chiếu khả năng source/admin/owner sharing theo sản phẩm hiện hành. Không dùng như một generic runtime traffic service hoặc assertion of actual data access. |
| kiro | 10 / 17 | 0 | Profile là kế hoạch developer workflow. Cần kiểm chứng steering metadata và tool capability theo version; test/review checkboxes là yêu cầu, không phải bằng chứng đã chạy. |
| appsync | 8 / 12 | 0 | Legacy compatibility profile. Cần auth-mode combinations, resolver runtime/data-source matrix, cache settings and GraphQL schema evidence. Không validate SDL như JSON policy. |
| q-developer | 7 / 7 | 0 | Legacy developer-assistance profile. Các lựa chọn biểu diễn intent; chưa xác nhận account features, context policies hoặc provider retention. Không trình bày checkbox như thao tác AWS đã hoàn tất. |

## Field số cần đánh giá theo ngữ cảnh

Không có maximum không đồng nghĩa bug: quota có thể điều chỉnh, giới hạn có thể phụ thuộc variant/account, hoặc đây là application setting. Danh sách này dùng làm hàng đợi rà soát; không được tự chuyển thành lỗi.

- **lambda**: `reservedConcurrency`, `provisionedConcurrency`, `eventSourceMappings.maximumConcurrency`
- **api**: `authorizers.cacheTtlSeconds`, `cors.maxAgeSeconds`, `throttling.rateLimit`, `throttling.burstLimit`, `usagePlans.quota`, `cacheTtlSeconds`, `integrationTimeoutMs`
- **dynamodb**: `globalSecondaryIndexes.readCapacity`, `globalSecondaryIndexes.writeCapacity`, `readCapacityUnits`, `writeCapacityUnits`
- **s3**: `lifecycleRules.transitionDays`, `lifecycleRules.expirationDays`, `lifecycleRules.noncurrentExpirationDays`, `lifecycleRules.abortMultipartDays`, `retentionDays`, `corsRules.maxAgeSeconds`, `presignedAccess.expiresSeconds`
- **glacier**: `restoreDays`, `transitionAgeDays`
- **sqs**: `maxReceiveCount`, `maximumConcurrency`
- **eventbridge**: `archives.retentionDays`
- **step-functions**: `tasks.timeoutSeconds`, `tasks.heartbeatSeconds`, `retryPolicies.intervalSeconds`, `retryPolicies.maxAttempts`, `retryPolicies.backoffRate`, `retryPolicies.maxDelaySeconds`, `timeoutSeconds`, `mapParallelControls.maxConcurrency`
- **ec2**: `minInstances`, `desiredInstances`, `maxInstances`
- **elastic-beanstalk**: `batchSize`, `minInstances`, `maxInstances`
- **ecs**: `taskCpu`, `taskMemoryMb`, `containers.cpu`, `containers.memoryMb`, `desiredCount`, `healthGraceSeconds`, `minTasks`, `maxTasks`
- **eks**: `replicas`, `probes.initialDelaySeconds`, `probes.periodSeconds`, `probes.failureThreshold`, `maxUnavailable`
- **aurora**: `readerInstances`, `promotionTier`, `minCapacityAcu`, `maxCapacityAcu`, `poolMaxConnections`, `connectionTimeoutMs`, `queryTimeoutMs`
- **rds**: `poolMaxConnections`, `connectionTimeoutMs`, `queryTimeoutMs`
- **elasticache**: `ttlSeconds`, `shards`, `replicasPerShard`, `connectTimeoutMs`, `poolSize`
- **ebs**: `sizeGib`, `iops`, `throughputMib`
- **efs**: `provisionedThroughputMib`, `accessPoints.uid`, `accessPoints.gid`
- **cloudfront**: `minTtlSeconds`, `defaultTtlSeconds`, `maxTtlSeconds`, `customErrors.status`, `customErrors.errorTtlSeconds`
- **elb**: `targetGroups.healthIntervalSeconds`, `targetGroups.deregistrationDelaySeconds`, `routingRules.priority`, `idleTimeoutSeconds`
- **route53**: `records.ttlSeconds`
- **codedeploy**: `lifecycleHooks.timeout`
- **codepipeline**: `stages.runOrder`
- **xray**: `samplingRules.reservoirSize`
- **cloudtrail**: `retentionDays`
- **cloudwatch**: `periodSeconds`, `evaluationPeriods`, `datapointsToAlarm`, `threshold`
- **cli**: `pageSize`, `maxItems`, `maxAttempts`
- **systems-manager**: `cacheTtlSeconds`
- **athena**: `bytesScannedCutoff`
- **kinesis**: `shardCount`, `batchSize`
- **firehose**: `bufferSizeMb`, `bufferIntervalSeconds`, `retryDurationSeconds`
- **opensearch**: `indexes.primaryShards`, `indexes.replicas`
- **sts**: `durationSeconds`
- **cognito**: `appClients.accessTokenMinutes`, `appClients.refreshTokenDays`
- **secrets-manager**: `cacheTtlSeconds`
- **private-ca**: `certificateValidityDays`
- **waf**: `rules.priority`
- **bedrock**: `modelParameters.value`, `requestTimeoutSeconds`, `maxAttempts`
- **agentcore**: `sessionIdleTimeoutSeconds`

Xem CONFIG-FIELD-INVENTORY.json để tra từng đường dẫn field, help, kind, min/max, nguồn, điều kiện áp dụng và scope audit.
