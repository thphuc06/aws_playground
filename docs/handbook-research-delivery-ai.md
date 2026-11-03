# Delivery, operations and AI handbook research

Research date: 2026-11-03. Scope: 19 services in `src/serviceHandbookDeliveryAI.ts`.

This records authoring research, not the subsequent independent review. All 95 distinct primary URLs listed below were opened through the research browser on the stated date. Failed guessed URLs and landing-page-only redirects were replaced with readable topic pages; the list contains the actual references used in the content. The checked date records access, not the publication date of an AWS feature.

The added content is original instructional synthesis and original diagnostic examples. It distinguishes documented service behavior from suggested implementation/review practices. Examples are inert reading material: no cloud resources were provisioned and no paid provider calls were made.

## Coverage and local validation

- 19 entries; 16,171 words across visible handbook strings (including headings and example code, excluding service IDs, source IDs, language tags and reference metadata).
- 95 source references / 95 distinct primary URLs.
- Per entry: 3 operating-model notes, 4 setup steps, 3 configuration decisions, 2 security notes, 1 worked example with 2 checks, 3 troubleshooting cases and 2 pitfalls.
- Every section/example source ID resolves to its entry-local source list.
- All JSON examples parse and all YAML examples parse with the repository YAML parser.
- A focused TypeScript check of the data module passed.
- No snippets were executed against AWS; parsing or typechecking does not validate deployed behavior or every narrative claim.

## Research findings and evidence

### amplify

Checked repository/console build-setting precedence, static versus adapter/SSR output, redirect ordering, and the Gen 1/Gen 2 distinction in secret handling. The example is explicitly a static Vite build; it does not claim to be an SSR deployment manifest.

- [How Amplify selects build settings](https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html) ? checked 2026-11-03.
- [Amplify build specification fields](https://docs.aws.amazon.com/amplify/latest/userguide/yml-specification-syntax.html) ? checked 2026-11-03.
- [Amplify environment variables and secret guidance](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html) ? checked 2026-11-03.
- [Redirects, rewrites and rule ordering](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html) ? checked 2026-11-03.
- [Server rendering and framework adapters](https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html) ? checked 2026-11-03.

### cloudshell

Checked console-identity inheritance, regional home storage, ephemeral VPC storage, lack of an automatically assigned public IP for VPC environments, and session expiration despite running processes. The example only inspects identity/configuration.

- [CloudShell identity, tooling and service model](https://docs.aws.amazon.com/cloudshell/latest/userguide/welcome.html) ? checked 2026-11-03.
- [CloudShell storage and session restrictions](https://docs.aws.amazon.com/cloudshell/latest/userguide/limits.html) ? checked 2026-11-03.
- [CloudShell VPC environment networking and storage](https://docs.aws.amazon.com/cloudshell/latest/userguide/using-cshell-in-vpc.html) ? checked 2026-11-03.
- [CloudShell identity and access management](https://docs.aws.amazon.com/cloudshell/latest/userguide/security-iam.html) ? checked 2026-11-03.
- [CloudShell Regions, files and shell concepts](https://docs.aws.amazon.com/cloudshell/latest/userguide/working-with-aws-cloudshell.html) ? checked 2026-11-03.

### codeartifact

Checked GetAuthorizationToken and STS bearer-token permission requirements, repository authorization, assumed-role/token lifetime distinction, npm endpoint configuration and upstream resolution. The endpoint example does not expose a token.

- [CodeArtifact authorization tokens and role sessions](https://docs.aws.amazon.com/codeartifact/latest/ug/tokens-authentication.html) ? checked 2026-11-03.
- [npm endpoints, login and authentication checks](https://docs.aws.amazon.com/codeartifact/latest/ug/npm-auth.html) ? checked 2026-11-03.
- [CodeArtifact upstream repositories and external connections](https://docs.aws.amazon.com/codeartifact/latest/ug/repos-upstream.html) ? checked 2026-11-03.
- [Repository policies and permission boundaries](https://docs.aws.amazon.com/codeartifact/latest/ug/repo-policies.html) ? checked 2026-11-03.

### codebuild

Checked buildspec 0.2 phases/artifacts, local-cache restrictions, build service-role scope and VPC internet-access limitations. The npm test example is labeled as requiring a toolchain that supports --run.

- [CodeBuild phases, variables, artifacts and reports](https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html) ? checked 2026-11-03.
- [CodeBuild VPC networking and limitations](https://docs.aws.amazon.com/codebuild/latest/userguide/vpc-support.html) ? checked 2026-11-03.
- [Local cache modes and restrictions](https://docs.aws.amazon.com/codebuild/latest/userguide/caching-local.html) ? checked 2026-11-03.
- [CodeBuild service-role permissions](https://docs.aws.amazon.com/codebuild/latest/userguide/setting-up-service-role.html) ? checked 2026-11-03.

### codedeploy

Checked different AppSpec/hook contracts across EC2, ECS and Lambda, hook result callbacks, alarm/rollback configuration and the fact that rollback creates a new deployment. The Lambda example uses existing placeholder versions and requires a separately implemented validation function.

- [Platform-specific CodeDeploy AppSpec contract](https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file.html) ? checked 2026-11-03.
- [Lifecycle hooks and validation callbacks](https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html) ? checked 2026-11-03.
- [Rollback creates a new deployment](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html) ? checked 2026-11-03.
- [Deployment-group alarms and rollback options](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-groups-configure-advanced-options.html) ? checked 2026-11-03.

### codepipeline

Checked execution/artifact identity, V2 requirements for QUEUED/PARALLEL modes, PARALLEL rollback limitations, approval expiry and SNS Region constraints. The example is a lineage worksheet, not a fabricated pipeline API payload.

- [CodePipeline executions, actions and artifacts](https://docs.aws.amazon.com/codepipeline/latest/userguide/concepts.html) ? checked 2026-11-03.
- [Execution modes, concurrency and rollback constraints](https://docs.aws.amazon.com/codepipeline/latest/userguide/concepts-how-it-works.html) ? checked 2026-11-03.
- [Manual approval behavior and notifications](https://docs.aws.amazon.com/codepipeline/latest/userguide/approvals.html) ? checked 2026-11-03.
- [Pipeline identity and role boundaries](https://docs.aws.amazon.com/codepipeline/latest/userguide/security-iam.html) ? checked 2026-11-03.

### xray

Checked segment/trace concepts, local versus centralized sampling and the SDK/daemon maintenance timeline. February 25, 2026 applies to SDK/daemon maintenance, with no end date stated on the timeline; the handbook does not claim X-Ray service retirement.

- [X-Ray segments, traces, annotations and errors](https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html) ? checked 2026-11-03.
- [Central and local sampling behavior](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-sampling.html) ? checked 2026-11-03.
- [Migrating X-Ray instrumentation to OpenTelemetry](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-migration.html) ? checked 2026-11-03.
- [X-Ray SDK and daemon maintenance timeline](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-daemon-timeline.html) ? checked 2026-11-03.

### q-developer

Checked IDE context, code-reference controls, data protection and the April 30, 2027 IDE-plugin support notice. The workspace-context page contains a top-level @workspace deprecation notice while retaining old instructions lower down; the handbook follows the notice and recommends explicit file/folder/code context.

- [Q Developer capabilities and access surfaces](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/what-is.html) ? checked 2026-11-03.
- [Explicit and automatic IDE context](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/ide-chat-context.html) ? checked 2026-11-03.
- [Workspace-context deprecation notice](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/workspace-context.html) ? checked 2026-11-03.
- [Code-reference information and controls](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/code-reference.html) ? checked 2026-11-03.
- [Q Developer data-protection considerations](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/data-protection.html) ? checked 2026-11-03.
- [Shared security responsibilities for Q Developer](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/security.html) ? checked 2026-11-03.
- [IDE plugin support ends April 30, 2027](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/q-developer-ide-end-of-support.html) ? checked 2026-11-03.

### appconfig

Checked free-form JSON Schema versus Lambda validators, feature-flag schema behavior, growth/bake-time semantics, alarm rollback permissions and agent cache/first-fetch behavior. The example retry limit is labeled an application design choice rather than an AWS limit.

- [JSON Schema and Lambda validation contracts](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-configuration-and-profile-validators.html) ? checked 2026-11-03.
- [Gradual rollout, growth and bake time](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-deployment-strategy.html) ? checked 2026-11-03.
- [AppConfig permissions and automatic rollback setup](https://docs.aws.amazon.com/appconfig/latest/userguide/setting-up-appconfig.html) ? checked 2026-11-03.
- [Agent cache, polling and first retrieval](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-agent.html) ? checked 2026-11-03.

### cdk

Checked L1/higher-level constructs, per-environment bootstrap resources, cached context, construct identity and lifecycle review. The example illustrates retention intent and requires inspection of generated CloudFormation; it is not a deployment or backup guarantee.

- [Construct levels and generated resources](https://docs.aws.amazon.com/cdk/v2/guide/constructs.html) ? checked 2026-11-03.
- [Account/Region bootstrapping and deployment resources](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html) ? checked 2026-11-03.
- [Cached lookup context and reproducible synthesis](https://docs.aws.amazon.com/cdk/v2/guide/context.html) ? checked 2026-11-03.
- [CDK lifecycle, identity and application practices](https://docs.aws.amazon.com/cdk/v2/guide/best-practices.html) ? checked 2026-11-03.

### cloudformation

Checked current change-set documentation, including new pre-deployment validation wording, drift support boundaries, DeletionPolicy versus UpdateReplacePolicy and continuing service-role authority. Avoided the outdated absolute claim that change sets do not check quotas or other constraints.

- [Change sets, replacement review and validation limits](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html) ? checked 2026-11-03.
- [Supported-resource drift detection](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/detect-drift-stack.html) ? checked 2026-11-03.
- [DeletionPolicy removal and retention behavior](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-deletionpolicy.html) ? checked 2026-11-03.
- [UpdateReplacePolicy lifecycle behavior](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-updatereplacepolicy.html) ? checked 2026-11-03.
- [CloudFormation service-role authority](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-servicerole.html) ? checked 2026-11-03.

### cli

Checked named profiles/configuration precedence, Identity Center token-provider setup, client filtering versus service filtering, --no-paginate versus --no-cli-pager, and retry settings. GetCallerIdentity is correctly described as identity evidence rather than an authorization probe.

- [Profiles, files and configuration precedence](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) ? checked 2026-11-03.
- [IAM Identity Center token-provider configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html) ? checked 2026-11-03.
- [Retrieval pagination and the display pager](https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-pagination.html) ? checked 2026-11-03.
- [Server and client filtering boundaries](https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-filter.html) ? checked 2026-11-03.
- [AWS CLI retry modes and attempt settings](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-retries.html) ? checked 2026-11-03.
- [GetCallerIdentity behavior and global options](https://docs.aws.amazon.com/cli/latest/reference/sts/get-caller-identity.html) ? checked 2026-11-03.

### systems-manager

Checked node prerequisites, session OS privileges, aggregate versus invocation/plugin outcomes, eventual consistency, Parameter Store boundaries and absence of session-content logging for SSH/port-forwarding. The December 31, 2026 notice concerns a legacy console page, not Session Manager capability retirement.

- [Session Manager access model and console transition](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html) ? checked 2026-11-03.
- [Agent, OS and session-user prerequisites](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-prerequisites.html) ? checked 2026-11-03.
- [Run Command and eventual consistency](https://docs.aws.amazon.com/systems-manager/latest/userguide/run-command.html) ? checked 2026-11-03.
- [Command, invocation and plugin result semantics](https://docs.aws.amazon.com/systems-manager/latest/userguide/monitor-commands.html) ? checked 2026-11-03.
- [Session logging and tunnel limitations](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-logging.html) ? checked 2026-11-03.
- [Parameter Store types and service boundaries](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) ? checked 2026-11-03.

### firehose

Checked destination buffering, S3 delimiter behavior, Direct PUT/Kinesis versus MSK transform fields, Ok/Dropped/ProcessingFailed semantics, partial PutRecordBatch failure and destination/backup access. The JSON example has valid base64 encoding of a newline-terminated object.

- [Destination-specific delivery and S3 delimiters](https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html) ? checked 2026-11-03.
- [Lambda transformation and buffering stages](https://docs.aws.amazon.com/firehose/latest/dev/data-transformation.html) ? checked 2026-11-03.
- [Transformation record identifiers and result contract](https://docs.aws.amazon.com/firehose/latest/dev/data-transformation-status-model.html) ? checked 2026-11-03.
- [Dynamic S3 partitioning](https://docs.aws.amazon.com/firehose/latest/dev/dynamic-partitioning.html) ? checked 2026-11-03.
- [Delivery and transformation error logging](https://docs.aws.amazon.com/firehose/latest/dev/monitoring-with-cloudwatch-logs.html) ? checked 2026-11-03.
- [Partial batch failures, retries and retention](https://docs.aws.amazon.com/firehose/latest/dev/troubleshooting.html) ? checked 2026-11-03.
- [Producer, destination and cross-account permissions](https://docs.aws.amazon.com/firehose/latest/dev/controlling-access.html) ? checked 2026-11-03.

### bedrock

Checked the current Converse API fields and permissions, model-specific capability references, tool-use boundary, guardrail versions and invocation logging. Old Converse pages redirected to current references; final sources use the actual current pages. No fixed model choice or universal modality guarantee is made.

- [Converse request fields, permissions and response contract](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html) ? checked 2026-11-03.
- [Model-specific capability references](https://docs.aws.amazon.com/bedrock/latest/userguide/model-cards.html) ? checked 2026-11-03.
- [Tool-use application boundary](https://docs.aws.amazon.com/bedrock/latest/userguide/tool-use.html) ? checked 2026-11-03.
- [Guardrail features, versions and supported checks](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html) ? checked 2026-11-03.
- [Model invocation logging contents and destinations](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html) ? checked 2026-11-03.

### agentcore

Checked modular components, runtime versions/endpoints, default-endpoint updates, ephemeral session state, memory scope and workload credentials. The example is an application identity/recovery worksheet, avoiding invented AgentCore API fields or a claim that managed isolation replaces authorization.

- [AgentCore modular service overview](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html) ? checked 2026-11-03.
- [Runtime versions, endpoints and session lifecycle](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-how-it-works.html) ? checked 2026-11-03.
- [Gateway tool interfaces and authentication boundaries](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html) ? checked 2026-11-03.
- [Agent workload identity and credential management](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html) ? checked 2026-11-03.
- [Short-term and long-term agent memory](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html) ? checked 2026-11-03.

### quick

Checked current product identity, data integration versus connected knowledge base, connector permission levels, direct-upload space visibility and interactive versus service-level automated identity. Approval behavior is explicitly surface/configuration dependent.

- [Amazon Quick capability and product overview](https://docs.aws.amazon.com/quick/latest/userguide/what-is.html) ? checked 2026-11-03.
- [Data integrations and connected knowledge bases](https://docs.aws.amazon.com/quick/latest/userguide/data-access-integrations.html) ? checked 2026-11-03.
- [Space sharing and uploaded-file visibility](https://docs.aws.amazon.com/quick/latest/userguide/working-with-spaces.html) ? checked 2026-11-03.
- [Connector ownership and tool permission controls](https://docs.aws.amazon.com/quick/latest/userguide/connections-desktop.html) ? checked 2026-11-03.
- [Interactive versus automated identity and oversight](https://docs.aws.amazon.com/quick/latest/userguide/sec-agentic-security.html) ? checked 2026-11-03.

### kiro

Checked current specs, steering, hooks, MCP and capability permissions documentation. The YAML example is limited to documented IDE/CLI permissions; the web surface uses its managed sandbox model. The text explicitly avoids claiming that filesystem-tool rules constrain every separately approved shell operation.

- [Kiro requirements, design and task workflow](https://kiro.dev/docs/specs/) ? checked 2026-11-03.
- [Workspace/global steering and supported surfaces](https://kiro.dev/docs/steering/) ? checked 2026-11-03.
- [Hook triggers and automatic command actions](https://kiro.dev/docs/hooks/) ? checked 2026-11-03.
- [MCP tools, context and connection configuration](https://kiro.dev/docs/mcp/) ? checked 2026-11-03.
- [Capability permissions and web-surface differences](https://kiro.dev/docs/permissions/) ? checked 2026-11-03.

### sam

Checked transform/function properties, build artifacts, local command boundaries, named configuration environments, HttpApi event shape and current Lambda runtime support. The example deliberately exposes no public API and marks memory/timeout as illustrative values.

- [SAM function properties and generated resources](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html) ? checked 2026-11-03.
- [SAM build outputs and package types](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-build.html) ? checked 2026-11-03.
- [Local invoke and HTTP testing boundaries](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli-local.html) ? checked 2026-11-03.
- [SAM configuration environments and precedence](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-config.html) ? checked 2026-11-03.
- [HttpApi event routes and payload format](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-httpapi.html) ? checked 2026-11-03.
- [Lambda event-function runtime support](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) ? checked 2026-11-03.

## Remaining scope limits

- Region, model, runtime, framework and client-version availability can change. The guides direct readers to the current feature-specific references instead of freezing mutable quotas or prices into the prose.
- Q Developer, Quick, AgentCore and Kiro are evolving products. Lifecycle notices are scoped to the component named by the source; documentation navigation and compatibility should be rechecked when applying the guide.
- Some official overview pages contain broad marketing language. The handbooks use concrete contracts and explicitly label application-level authorization, validation, retention and recovery recommendations instead of treating marketing statements as end-to-end guarantees.
- Source review establishes support for documented concepts. It is not an executed integration test, security certification, licensing determination or claim of production readiness.
