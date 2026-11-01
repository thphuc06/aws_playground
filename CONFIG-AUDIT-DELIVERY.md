# Delivery, developer tooling, analytics and observability configuration audit

Reviewed 2026-11-01. This data module covers **20 assigned services, 280 top-level fields and 345 fields including table columns**. It does not execute shell, queries, deployments or AWS requests. Fields without user values remain unknown. There are no invented AWS defaults. Numeric lower bounds such as nonnegative duration are local structural constraints unless separately marked with an AWS limit source.

## Coverage

| Service | Top-level fields | Sections | Principal reference |
| --- | ---: | --- | --- |
| amplify | 13 | configuration, deployment, networking, permissions, monitoring | [AWS guide](https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html) |
| cloudshell | 12 | configuration, permissions, networking, reliability, deployment | [AWS guide](https://docs.aws.amazon.com/cloudshell/latest/userguide/vm-specs.html) |
| codeartifact | 12 | configuration, permissions, deployment | [AWS guide](https://docs.aws.amazon.com/codeartifact/latest/ug/tokens-authentication.html) |
| codebuild | 17 | deployment, configuration, reliability, permissions, networking, monitoring | [AWS guide](https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html) |
| codedeploy | 16 | deployment, permissions, monitoring, reliability, networking | [AWS guide](https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file.html) |
| codepipeline | 13 | deployment, permissions, configuration, reliability, monitoring | [AWS guide](https://docs.aws.amazon.com/codepipeline/latest/userguide/pipelines.html) |
| xray | 10 | monitoring, permissions, networking | [AWS guide](https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html) |
| appconfig | 15 | configuration, deployment, reliability, permissions | [AWS guide](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-deployment-strategy.html) |
| cdk | 12 | configuration, deployment, permissions, reliability | [AWS guide](https://docs.aws.amazon.com/cdk/v2/guide/testing.html) |
| cloudformation | 14 | deployment, permissions, reliability, monitoring | [AWS guide](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html) |
| cloudtrail | 12 | monitoring, permissions, reliability | [AWS guide](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) |
| cloudwatch | 18 | monitoring | [AWS guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Alarms.html) |
| cloudwatch-logs | 12 | monitoring, reliability, permissions | [AWS guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html) |
| cli | 15 | permissions, configuration, reliability, networking | [AWS guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) |
| systems-manager | 14 | configuration, permissions, deployment, reliability, monitoring | [AWS guide](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) |
| sam | 14 | deployment, permissions, monitoring | [AWS guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-specification.html) |
| athena | 16 | configuration, permissions, reliability, monitoring | [AWS guide](https://docs.aws.amazon.com/athena/latest/ug/creating-workgroups.html) |
| kinesis | 15 | configuration, reliability, permissions, monitoring | [AWS guide](https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html) |
| firehose | 15 | configuration, reliability, monitoring, permissions, networking | [AWS guide](https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html) |
| opensearch | 15 | configuration, networking, permissions, reliability, monitoring | [AWS guide](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/createupdatedomains.html) |

## Important design distinctions

- Amplify public browser environment values are separate from build/runtime secret references. Repository amplify.yml and console settings have precedence behavior.
- CloudShell standard and VPC environments differ in storage and reachability. VPC home storage must not be assumed persistent; its subnet/SG fields are conditional.
- CodeArtifact tokens require authorization permissions; duration zero is a special assumed-role option, otherwise900–43200 seconds. A token lifetime does not automatically equal role-session duration.
- CodeBuild has structured environment variables/report groups and a YAML buildspec. Environment and compute enum values come from ProjectEnvironment, but Region/compute compatibility still needs contextual validation.
- CodeDeploy AppSpec format, hook lifecycle and deployment strategy depend on Server/Lambda/ECS. Code rollback is not a rollback of application data.
- CodePipeline stage/action/artifact tables distinguish orchestration/action/runtime roles. Pipeline type, execution mode and rollback support must be validated together.
- CDK assertions and snapshots are different evidence. CloudFormation change sets preview changes but do not guarantee successful execution. Retention and execution permission are separate.
- AppConfig deployment duration differs from final bake time; monitoring can roll back after reaching100%. Validators and retrieval/session/cache behavior are modeled separately.
- CloudTrail event history does not include every data event. Select category/resource scope and protect destinations/integrity.
- CloudWatch models statistic, period, M-out-of-N, missing data and action targets separately. Composite alarms cannot perform EC2/Auto Scaling actions. Negative thresholds can be valid.
- Logs Standard/Infrequent Access/Delivery have different supported features. Metric/subscription filters are Standard-only; Delivery retention is fixed and has no Insights query support.
- X-Ray annotations are searchable while ordinary metadata is not. Sampling/instrumentation does not guarantee every request is captured.
- Athena SQL and Spark workgroups are not interchangeable. Workgroup override controls effective result location/encryption. The current profile models customer S3 query-result settings, not every newer result-management option.
- Kinesis ordering scope follows partition keys. A retention window does not store consumer checkpoints; replay/duplicate processing needs explicit handling.
- Firehose buffering is a hint and destination-dependent. Transformation failures, destination retries and S3 backup are distinct.
- OpenSearch managed-domain controls are not Serverless controls; selected domain-specific fields are conditional. Bulk item failures must be checked even after an HTTP success.

## Source verification and boundaries

Official AWS pages for all20 services were directly opened during this audit. Specific CodeBuild ProjectEnvironment, CodeArtifact token lifetime, CloudShell VPC, Athena override and CloudWatch log-class pages were additionally opened. Sources are attached to all top-level fields and inherited table columns. A per-service principal guide can link to feature-specific documentation; metadata does not mean every option was exercised against AWS.

Field/UI/schema integrity passed: strict TypeScript for the data module, esbuild in-memory import, unique top-level keys, and source/objective metadata on every nested field. No account/Region availability or live AWS behavior was tested. Enum lists describe supported study choices, not a claim to list every AWS Console/API option. Dynamic quotas, compute/Region compatibility, alarm period restrictions and document semantics need framework validation or an explicit not-evaluated finding.

Newer/advanced capabilities such as CloudWatch PromQL/log alarms, CodeBuild reserved fleet attributes, Athena Spark notebooks/managed query-result storage and full pipeline provider configuration are not exhaustively modeled. They must not be mislabeled as completed core exam simulators.

These are configuration data definitions. The parent implementation owns the shared validation, policy engine, editor rendering, practice cases, migration and release checks.
