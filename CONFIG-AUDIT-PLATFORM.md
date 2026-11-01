# Platform configuration audit — DVA-C03

Reviewed 2026-11-01. This data module expands the developer-facing settings for
15 services without introducing an AWS account, provisioning workflow or network
administration simulator. Values are not assumed and no AWS defaults are inserted.

`src/configurationPlatformFields.ts` contains **266 top-level fields, 463 fields
including table columns, 38 repeatable tables and 8 JSON/YAML document editors**.
Every field and table column carries an objective mapping and official source.
These counts measure implementation structure, not exam readiness or all Console
options. Existing incompatible text values must be retained as migration notes.

| Service | Top fields | Added developer configuration coverage |
| --- | ---: | --- |
| EC2 | 26 | AMI/runtime architecture, instance profile/IMDS, VPC/subnet/ingress, environment and secret references, EBS attachments, scaling capacity, health, rollout and guest/application telemetry |
| Elastic Beanstalk | 22 | Tier/type/platform, application version, deployment policy/batches/traffic split, configuration files, environment/secret references, separate roles, networking, health/scaling/logs/maintenance |
| ECR | 13 | Visibility, tag mutability/exclusions, digest identity, scanning, encryption/key, repository policy, build role, lifecycle document and promotion |
| ECS | 29 | Task runtime/size/network, separate task/execution roles, container table with ports/environment/health/logs, secrets, subnet/SG/target bindings, desired/scaling counts and rollout/rollback |
| EKS | 23 | Workload/namespace/image/replicas, ConfigMap and secret references, service account with Pod Identity/IRSA, exposure/ports, startup/readiness/liveness table, requests/limits, rollout and manifest |
| Aurora | 27 | Engine/capacity, writer/reader endpoint choice, replicas/promotion, Serverless v2 range intent, application authentication/TLS/pools/reconnect, network/key/backup and logs |
| RDS | 24 | Engine/version, instance/cluster failover type, endpoints/read replica table, authentication/TLS/proxy/pools, network/key/backup, deletion protection and logs |
| ElastiCache | 22 | Engine/deployment, cache pattern/TTL/invalidation/fallback, stampede protection, topology/failover, supported auth/TLS/key/network, client timeout/pooling and slow logs |
| EBS | 14 | Volume type/size/IOPS/throughput, encryption/key, AZ/instance attachment/device, termination lifecycle, Multi-Attach, snapshot reference and recovery/performance |
| EFS | 14 | Availability/performance/throughput, encryption/TLS/IAM, mount-target table, NFS rules, access-point POSIX identity table, filesystem policy, lifecycle and backup |
| CloudFront | 14 | Origin/behavior tables, S3 REST vs website/OAC distinctions, methods/protocol/policies, cache-key and TTL fields, aliases/TLS/WAF, custom errors, rollout and logs |
| ELB | 12 | ALB/NLB variant, scheme/VPC/subnets, listener/target-group/rule tables, TLS/certificates, health/draining, network rules, cross-zone/deletion/logs/idle timeout |
| Route 53 | 6 | Public/private zone, resource links, repeatable records with alias/routing/TTL/health, repeatable health checks, rollout/cache caveats |
| VPC | 9 | Application-scoped CIDR/DNS, subnet and route tables, SG allow rules, NACL troubleshooting table, Flow Logs metadata/destination |
| PrivateLink | 11 | Endpoint/service/Region/VPC/subnets, DNS/address family, endpoint network rules/policy, provider acceptance and troubleshooting |

## Sources directly opened

- [EC2 metadata](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html), [EC2 IAM roles](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html), [Auto Scaling capacity](https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-capacity-limits.html).
- [Beanstalk deployments](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.deploy-existing-version.html), [environment management](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.managing.html).
- [ECR repositories](https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-create.html), [lifecycle](https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html), [scanning](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html).
- [ECS task definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html), [IAM roles](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html), [rolling deployments](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html).
- [EKS workload IAM service account](https://docs.aws.amazon.com/eks/latest/userguide/pod-configuration.html), [Pod Identity](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html).
- [Aurora endpoints](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.Endpoints.html).
- [RDS connection](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToInstance.html), [IAM auth](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html), [network controls](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.RDSSecurityGroups.html), [backups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html).
- [ElastiCache products](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html), [TLS constraints](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/in-transit-encryption.html).
- [EBS types](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html).
- [EFS mounting](https://docs.aws.amazon.com/efs/latest/ug/mounting-fs.html), [client IAM/resource authorization](https://docs.aws.amazon.com/efs/latest/ug/iam-access-control-nfs-efs.html).
- [CloudFront behaviors](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistValuesCacheBehavior.html), [S3 origin access](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html).
- [ALB listeners](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html), [NLB listeners](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html).
- [Route 53 routing](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html), [health checks](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html).
- [VPC security groups](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html), [interface endpoints](https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html).

The attempted broad RDS common-tasks URL and one EKS Auto Mode health URL were
unavailable through the documentation tool; they are not used as evidence. More
specific RDS sources above were used instead. Generic field references provide
feature documentation context, not a claim that every variant/version has been
independently exercised. Kubernetes probe/resource/manifest fields are developer
study structure, not a comprehensive Kubernetes API schema.

## Required validation boundaries

- Enforce ECS Fargate/awsvpc and supported task CPU/memory/OS combinations; keep
  task-role application permissions distinct from task execution permissions.
- Restrict ALB/NLB listeners, actions, target types and health options to the
  selected variant. One combined table is data structure, not permission to use
  every listed protocol/action with every load balancer.
- Reject OAC/OAI on CloudFront S3 website origins; check minimum/default/maximum
  TTL relationships and personalized cache keys.
- IAM database authentication depends on engine/version/Region. Do not infer it
  works for Oracle/SQL Server/Db2 because an enum offers a learning choice.
- Private DNS requires compatible endpoint service and VPC DNS attributes;
  endpoint policy is not a replacement for identity/resource authorization.
- Topology/auth/encryption settings for ElastiCache must be checked by selected
  engine/deployment. Do not treat Memcached like a Redis replication group.
- Check ASG/task capacity ordering, listener/target ports, subnet references and
  cross-service reachability assumptions. Missing context remains unknown.
- Resource-specific quotas are classified as dependent where no exact universal
  number was verified. No artificial max instance size, ACU, IOPS, throughput,
  pool allowance, shard allowance or Region availability is invented.

## Verification

Standalone strict TypeScript compilation passed against `configurationTypes.ts`.
In-memory esbuild import verified15 IDs, unique field keys at every nesting level,
nonempty select enums, nonempty table schemas and source/objective metadata on
all463 fields. `git diff --check` passed for the owned module. No AWS call, console
deployment, paid model call, whole-app UI verification or IAM evaluation was
performed by this research/data task. Main integration owns runtime validators,
compatibility rules, migration, practice scenarios and full application tests.
