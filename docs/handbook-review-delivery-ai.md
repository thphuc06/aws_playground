# Independent accuracy review: delivery, developer tools and AI handbooks

Review date: 2026-11-03. Scope: all 19 complete entries in `src/serviceHandbookDeliveryAI.ts`, their corresponding pre-existing overview entries in `src/serviceDeepDiveTools.ts`, the handbook schema, and the author's research record. This was a separate reading and source-verification round, not acceptance of the author's citation list or a link/syntax-only check.

Disposition: approved for the site's instructional scope after the corrections below. No remaining publication-blocking factual issue was identified in these 19 entries. This conclusion is limited to the documented examples and claims reviewed on this date; it is not a guarantee for every account, Region, framework version, model, runtime or future service change.

## Method and evidence

The reviewer read every new entry, including all example code, explanations, configuration tradeoffs, diagnostic steps and security boundaries, and all 19 corresponding old entries. All 95 original new-handbook source URLs were independently opened, as were the seven additional references now cited by the corrected handbooks. Each service has at least three independently opened official pages. The source inventory below records those actual opened URLs; additional official API, pricing and lifecycle pages used to check the older notes and emerging-product claims are recorded separately.

Relevant sections were read beyond page introductions and navigation where needed. Examples were compared with official API fields and service contracts, rather than inferred valid because their YAML or JSON parsed. A source opening does not mean every unrelated section of that document was reviewed. No AWS resources, model calls, paid providers or deployment commands were executed for this audit.

## Corrections made in the new handbooks

1. **Bedrock tool execution scope.** The original general statement assigned tool execution to application code. That is accurate for the illustrated Converse client-side workflow, but current Bedrock documentation also describes server-side tool execution through Responses. The operating model now names those separate contracts, and the example cites the client-side tool request/result documentation. Business ownership checks remain required regardless of the execution path.
2. **AgentCore compute and persistence scope.** A generic ephemeral-session description could hide current Instances and persistent filesystem options. The handbook now distinguishes terminated microVM in-memory state, compute choice, configured persistent filesystems and conversational Memory. It explicitly labels managed microVM session storage as Preview. The troubleshooting path checks storage expiration/reset and version changes, not only session termination. Authoritative business state remains a separate application responsibility.
3. **CodeDeploy callback completion.** The Lambda AppSpec now explains the required `PutLifecycleEventHookExecutionStatus` call, original deployment/hook identifiers, `Succeeded`/`Failed` outcome and CodeDeploy's one-hour result deadline. Configuration guidance distinguishes that deadline from EC2 script and Lambda function timeouts. The complete official Lambda AppSpec example confirms the uppercase `Resources` and `Hooks` fields used in the sample.
4. **Systems Manager diagnostic output.** The invocation query previously requested `--details` but omitted plugin data from its displayed projection. The query now displays each plugin's name, status and response code, directly supporting the instruction to inspect per-node and plugin results. Its added CLI reference documents those fields and pagination.
5. **CDK example evidence.** Added the actual S3 Bucket API reference for `blockPublicAccess`, `versioned` and `removalPolicy`, in addition to the existing conceptual guides. This is an evidence improvement, not a change to the valid sample's behavior.

## Corresponding overview corrections

These changes were passed to the root agent because this reviewer was not authorized to edit the shared `serviceDeepDiveTools.ts` file. Root confirmed applying all five corrections during the audit, including the final Bedrock mental-model wording and its direct source. All are resolved.

- **CodePipeline:** describe a release candidate that can include revisions from multiple source actions, rather than implying exactly one source revision per execution.
- **Quick:** use plan-specific infrastructure fees rather than implying only Enterprise has an infrastructure fee; the current pricing page also lists one for Professional.
- **AgentCore:** describe compute-specific pricing, including microVM consumption and Instances cost plus management fees, rather than only CPU/memory metering.
- **Bedrock walkthrough:** explicitly scope application-executed tools to the Converse client-side path.
- **Bedrock mental model:** explain that different API paths have different conversation-state and tool-execution contracts, with the client-side/server-side tool reference added. Applied complete wording: “Bedrock provides managed model inference through several API contracts. In a Converse client-side tool workflow, the application manages conversation messages, validates proposed actions and executes authorized tools. Other paths, including Responses server-side tools, have different state and execution contracts; business authorization remains an application responsibility.”

## Service-by-service coverage

The source sets in the final inventory are part of each row's evidence. “Approved” means approved within the scope and limitations above, after any listed correction.

| Service | Example and consequential claims independently checked | Disposition |
| --- | --- | --- |
| Amplify | `amplify.yml` version and frontend phases/artifact shape; repository settings precedence; static Vite `dist` contract; optional npm-cache limitation; redirects versus SPA rewrites; client-visible environment values; SSR framework support and runtime access. | Approved. Static example is explicitly not a universal SSR recipe. |
| CloudShell | Read-only identity commands; regional home retention versus ephemeral paths; VPC environments lack persistent home storage; no automatic public IP; public-subnet placement alone does not provide internet connectivity; interactive inactivity and credential boundaries. | Approved. Environment type matters to both persistence and networking. |
| CodeArtifact | npm repository URL/trailing slash; login/token workflow; `codeartifact:GetAuthorizationToken` and `sts:GetServiceBearerToken`; role-session token lifetime behavior; upstream/package-source policy versus provenance; token exposure. | Approved. Current default token behavior is not equated to role-session lifetime. |
| CodeBuild | Buildspec `0.2` phases and shell behavior, artifacts/reports, test-command prerequisites, environment precedence; project service role; VPC NAT needs; host-local caching restrictions including Docker/VPC limits. | Approved. The test command is conditioned on the repository's test tool accepting the option. |
| CodeDeploy | Lambda AppSpec resource/alias/version fields and field casing; lifecycle hook names and callback identifiers/status; one-hour callback deadline; compute-platform differences; rollback is a new deployment; stopping on alarms versus configured automatic rollback. | Approved after callback/deadline clarification and direct example citation. |
| CodePipeline | Artifact lineage worksheet is expressly not pipeline JSON; multiple source actions; V2 requirement for QUEUED/PARALLEL; PARALLEL rollback restrictions; superseding behavior; manual approval window and same-Region SNS; service/action/artifact permissions. | Approved. Root corrected the older single-source implication. |
| X-Ray | Sampling and parent/child trace interpretation; OpenTelemetry migration; SDK/daemon maintenance beginning February 25, 2026; security-only maintenance and absence of an announced end date in the reviewed timeline. | Approved. Timeline applies to SDKs/daemon and is not presented as X-Ray service retirement. |
| Q Developer | Context/review worksheet rather than a fabricated API; explicit file/folder context, workspace-context deprecation, code-reference behavior and permission/data boundaries; current IDE-plugin support notice. | Approved. April 30, 2027 applies to the documented IDE plugins, not all Q-branded products. |
| AppConfig | Validator/deployment worksheet; JSON Schema and Lambda validation boundaries; deployment strategy versus bake time; alarm-based rollback; Agent polling/cache; application retrieval separate from successful deployment. | Approved. Validation is not confused with business correctness or instant fleet adoption. |
| CDK | JavaScript ESM imports and Bucket properties; synthesis versus deployment; bootstrap/account/Region prerequisites; logical IDs and replacement; cached context; generated IAM; retention is not a backup plan. | Approved. Added specific Bucket API evidence. |
| CloudFormation | Template lifecycle attributes; `DeletionPolicy: Retain` for removal/deletion versus `UpdateReplacePolicy` for the old replacement resource; change sets and current pre-deployment validation limits; supported drift checks; service-role authority and `iam:PassRole` boundary. | Approved. Retention/replacement semantics are distinguished correctly. |
| AWS CLI | `GetCallerIdentity` shape and permissions; profiles/SSO/Region selection; `--no-cli-pager` versus `--no-paginate`; page size versus total result limit; query/filter boundaries; retry attempts include the initial request; generated skeleton instability. | Approved. The example is read-only and does not imply pagination guarantees from disabling the display pager. |
| Systems Manager | Managed-node/session prerequisites and operating-system user; Run Command command/invocation/plugin semantics and eventual consistency; CLI detail fields; aggregate success limitations; SSH/port-forwarding transcript limits; Parameter Store boundaries; legacy console-page transition. | Approved after projecting plugin results in the example. December 31, 2026 concerns the legacy page, not service shutdown. |
| Firehose | Direct PUT/Kinesis transformation envelope; record ID preservation; `Ok`, `Dropped`, `ProcessingFailed`; `data` versus MSK `kafkaRecordValue`; base64 newline payload; partial batch failures; separate transformation/delivery buffering; partition cardinality; destination-specific retries. | Approved. Local decoding confirms `{"ok":true}` plus newline. `Dropped` is correctly treated as successful intentional removal. |
| Bedrock | Converse message/tool schema and `maxTokens`; model/profile compatibility; Prompt management ARN field restrictions; inference permission; tool-result loop; stop reasons; guardrail/version boundaries; invocation logging scope; current server-side tool path. | Approved after client/server execution scope correction. Placeholder model is not claimed universally compatible. |
| AgentCore | Runtime configuration versions/endpoints versus platform versions; microVM lifecycle; Instances and filesystem alternatives; Preview status; Gateway interfaces/authentication; Identity credentials versus record ownership; Memory scope; identity/recovery worksheet expressly not an API payload. | Approved after compute/storage correction. No universal session lifetime or blanket persistence claim remains. |
| Quick | Product/capability distinction from Q Developer and Bedrock; integration versus available knowledge base; linked-resource permissions versus directly uploaded space files; connector confirmation options; interactive versus service credentials; plan pricing categories. | Approved. Root corrected the older plan-fee wording. The worksheet is not a synthetic Quick API. |
| Kiro | Specs/steering/hooks/MCP contracts; current YAML permission capability/effect/match shape; rule precedence; user/workspace settings locations; shell/sandbox limits; web-surface difference; CLI/version distinctions; current credit model. | Approved. Example requires the actual supported version/scope and does not claim that an IDE permission rule universally governs separately approved shell activity. |
| SAM | `AWS::Serverless` transform and Function YAML; ZIP/default packaging, `CodeUri`, `app.handler`, Python 3.13 support, memory/timeout example values; build/native-dependency needs; local-test limits; config precedence; HttpApi payload/route behavior; absence of a public event in sample. | Approved. No public endpoint or runtime IAM policy is implied by the minimal function declaration. |

## Local verification

- Node 22: `node_modules/vitest/vitest.mjs run src/serviceHandbooks.test.ts` passed: 1 file, 4 tests. This checks all 58 handbook entries for catalog coverage, required fields, citation resolution and JSON/YAML syntax. It is not AWS schema or deployment validation.
- Node 22: TypeScript `tsc --noEmit --target ES2022 --module ESNext --moduleResolution bundler --skipLibCheck src/serviceHandbookDeliveryAI.ts` passed.
- Transpiled and loaded the corrected delivery/AI module in a local isolated JavaScript context: 19 entries and 102 unique cited source URLs. Parsed the actual Firehose example and decoded its payload to confirm the claimed JSON and newline; inspected the actual Bedrock tool schema. No provider was called.
- The SSM JMESPath projection was checked against the documented response shape. No local JMESPath interpreter was available, so its execution against an AWS response was not claimed.

## Remaining limits

Examples are bounded teaching artifacts: several are review worksheets, while code snippets require project files, dependencies, identifiers, access and service configuration that the page intentionally does not provision. This review did not execute infrastructure changes, synthesize the CDK example with an installed CDK dependency, invoke models, test managed runtime storage, or exercise an AWS account. The site must continue to label these as illustrative material.

No fixed price quote or universal quota was introduced. Pricing categories were checked only to correct misleading scope in the old overviews. Model, framework, runtime, Region and permission compatibility still requires checking the linked current contract for a real implementation. Emerging-product support and Preview status should be rechecked during later maintenance.

## Additional official pages opened

These supplement the complete cited-source inventory below. Pricing pages were used to check billing dimensions in the old overviews, not to publish dollar amounts. Some pricing pages have dynamically rendered tables; no unsupported table values were inferred from missing extraction.

- [Converse inference workflow](https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html)
- [AgentCore Instances and capacity providers](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-instances.html)
- [AgentCore lifecycle settings](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-lifecycle-settings.html)
- [AgentCore Identity overview](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity-overview.html)
- [Firehose dynamic-partitioning buffering](https://docs.aws.amazon.com/firehose/latest/dev/buffering.html)
- [Amplify pricing](https://aws.amazon.com/amplify/pricing/)
- [CodeArtifact pricing](https://aws.amazon.com/codeartifact/pricing/)
- [CodeBuild pricing](https://aws.amazon.com/codebuild/pricing/)
- [CodeDeploy pricing](https://aws.amazon.com/codedeploy/pricing/)
- [CodePipeline pricing](https://aws.amazon.com/codepipeline/pricing/)
- [Q Developer pricing](https://aws.amazon.com/q/developer/pricing/)
- [CloudFormation pricing](https://aws.amazon.com/cloudformation/pricing/)
- [Bedrock pricing](https://aws.amazon.com/bedrock/pricing/)
- [AgentCore pricing by component and compute type](https://aws.amazon.com/bedrock/agentcore/pricing/)
- [Quick pricing by plan](https://aws.amazon.com/quick/pricing/)
- [Kiro billing and credit model](https://kiro.dev/docs/billing/)
- [Firehose pricing](https://aws.amazon.com/firehose/pricing/)
- [Systems Manager pricing](https://aws.amazon.com/systems-manager/pricing/)
- [CloudWatch pricing](https://aws.amazon.com/cloudwatch/pricing/)

## Complete opened source inventory

Every URL in the following inventory was independently opened during this review. It includes the original 95 cited sources and the seven added during correction. It is grouped by service so the minimum three-page coverage and example support can be inspected directly.

### amplify (5 opened pages)

- [How Amplify selects build settings](https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html)
- [Amplify build specification fields](https://docs.aws.amazon.com/amplify/latest/userguide/yml-specification-syntax.html)
- [Amplify environment variables and secret guidance](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html)
- [Redirects, rewrites and rule ordering](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html)
- [Server rendering and framework adapters](https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html)

### cloudshell (5 opened pages)

- [CloudShell identity, tooling and service model](https://docs.aws.amazon.com/cloudshell/latest/userguide/welcome.html)
- [CloudShell storage and session restrictions](https://docs.aws.amazon.com/cloudshell/latest/userguide/limits.html)
- [CloudShell VPC environment networking and storage](https://docs.aws.amazon.com/cloudshell/latest/userguide/using-cshell-in-vpc.html)
- [CloudShell identity and access management](https://docs.aws.amazon.com/cloudshell/latest/userguide/security-iam.html)
- [CloudShell Regions, files and shell concepts](https://docs.aws.amazon.com/cloudshell/latest/userguide/working-with-aws-cloudshell.html)

### codeartifact (4 opened pages)

- [CodeArtifact authorization tokens and role sessions](https://docs.aws.amazon.com/codeartifact/latest/ug/tokens-authentication.html)
- [npm endpoints, login and authentication checks](https://docs.aws.amazon.com/codeartifact/latest/ug/npm-auth.html)
- [CodeArtifact upstream repositories and external connections](https://docs.aws.amazon.com/codeartifact/latest/ug/repos-upstream.html)
- [Repository policies and permission boundaries](https://docs.aws.amazon.com/codeartifact/latest/ug/repo-policies.html)

### codebuild (4 opened pages)

- [CodeBuild phases, variables, artifacts and reports](https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html)
- [CodeBuild VPC networking and limitations](https://docs.aws.amazon.com/codebuild/latest/userguide/vpc-support.html)
- [Local cache modes and restrictions](https://docs.aws.amazon.com/codebuild/latest/userguide/caching-local.html)
- [CodeBuild service-role permissions](https://docs.aws.amazon.com/codebuild/latest/userguide/setting-up-service-role.html)

### codedeploy (5 opened pages)

- [Platform-specific CodeDeploy AppSpec contract](https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file.html)
- [Complete Lambda AppSpec example and field casing](https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-example.html)
- [Lifecycle hooks and validation callbacks](https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html)
- [Rollback creates a new deployment](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html)
- [Deployment-group alarms and rollback options](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-groups-configure-advanced-options.html)

### codepipeline (4 opened pages)

- [CodePipeline executions, actions and artifacts](https://docs.aws.amazon.com/codepipeline/latest/userguide/concepts.html)
- [Execution modes, concurrency and rollback constraints](https://docs.aws.amazon.com/codepipeline/latest/userguide/concepts-how-it-works.html)
- [Manual approval behavior and notifications](https://docs.aws.amazon.com/codepipeline/latest/userguide/approvals.html)
- [Pipeline identity and role boundaries](https://docs.aws.amazon.com/codepipeline/latest/userguide/security-iam.html)

### xray (4 opened pages)

- [X-Ray segments, traces, annotations and errors](https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html)
- [Central and local sampling behavior](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-sampling.html)
- [Migrating X-Ray instrumentation to OpenTelemetry](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-migration.html)
- [X-Ray SDK and daemon maintenance timeline](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-daemon-timeline.html)

### q-developer (7 opened pages)

- [Q Developer capabilities and access surfaces](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/what-is.html)
- [Explicit and automatic IDE context](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/ide-chat-context.html)
- [Workspace-context deprecation notice](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/workspace-context.html)
- [Code-reference information and controls](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/code-reference.html)
- [Q Developer data-protection considerations](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/data-protection.html)
- [Shared security responsibilities for Q Developer](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/security.html)
- [IDE plugin support ends April 30, 2027](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/q-developer-ide-end-of-support.html)

### appconfig (4 opened pages)

- [JSON Schema and Lambda validation contracts](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-configuration-and-profile-validators.html)
- [Gradual rollout, growth and bake time](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-deployment-strategy.html)
- [AppConfig permissions and automatic rollback setup](https://docs.aws.amazon.com/appconfig/latest/userguide/setting-up-appconfig.html)
- [Agent cache, polling and first retrieval](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-agent.html)

### cdk (5 opened pages)

- [Construct levels and generated resources](https://docs.aws.amazon.com/cdk/v2/guide/constructs.html)
- [Bucket construct properties and retention example](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.Bucket.html)
- [Account/Region bootstrapping and deployment resources](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html)
- [Cached lookup context and reproducible synthesis](https://docs.aws.amazon.com/cdk/v2/guide/context.html)
- [CDK lifecycle, identity and application practices](https://docs.aws.amazon.com/cdk/v2/guide/best-practices.html)

### cloudformation (5 opened pages)

- [Change sets, replacement review and validation limits](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html)
- [Supported-resource drift detection](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/detect-drift-stack.html)
- [DeletionPolicy removal and retention behavior](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-deletionpolicy.html)
- [UpdateReplacePolicy lifecycle behavior](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-updatereplacepolicy.html)
- [CloudFormation service-role authority](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-servicerole.html)

### cli (6 opened pages)

- [Profiles, files and configuration precedence](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
- [IAM Identity Center token-provider configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html)
- [Retrieval pagination and the display pager](https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-pagination.html)
- [Server and client filtering boundaries](https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-filter.html)
- [AWS CLI retry modes and attempt settings](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-retries.html)
- [GetCallerIdentity behavior and global options](https://docs.aws.amazon.com/cli/latest/reference/sts/get-caller-identity.html)

### systems-manager (7 opened pages)

- [Session Manager access model and console transition](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html)
- [Agent, OS and session-user prerequisites](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-prerequisites.html)
- [Run Command and eventual consistency](https://docs.aws.amazon.com/systems-manager/latest/userguide/run-command.html)
- [Command, invocation and plugin result semantics](https://docs.aws.amazon.com/systems-manager/latest/userguide/monitor-commands.html)
- [CLI invocation details, plugin fields and pagination](https://docs.aws.amazon.com/cli/latest/reference/ssm/list-command-invocations.html)
- [Session logging and tunnel limitations](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-logging.html)
- [Parameter Store types and service boundaries](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)

### firehose (7 opened pages)

- [Destination-specific delivery and S3 delimiters](https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html)
- [Lambda transformation and buffering stages](https://docs.aws.amazon.com/firehose/latest/dev/data-transformation.html)
- [Transformation record identifiers and result contract](https://docs.aws.amazon.com/firehose/latest/dev/data-transformation-status-model.html)
- [Dynamic S3 partitioning](https://docs.aws.amazon.com/firehose/latest/dev/dynamic-partitioning.html)
- [Delivery and transformation error logging](https://docs.aws.amazon.com/firehose/latest/dev/monitoring-with-cloudwatch-logs.html)
- [Partial batch failures, retries and retention](https://docs.aws.amazon.com/firehose/latest/dev/troubleshooting.html)
- [Producer, destination and cross-account permissions](https://docs.aws.amazon.com/firehose/latest/dev/controlling-access.html)

### bedrock (7 opened pages)

- [Converse request fields, permissions and response contract](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html)
- [Model-specific capability references](https://docs.aws.amazon.com/bedrock/latest/userguide/model-cards.html)
- [Tool-use application boundary](https://docs.aws.amazon.com/bedrock/latest/userguide/tool-use.html)
- [Client-side Converse tool-use request and result loop](https://docs.aws.amazon.com/bedrock/latest/userguide/tool-use-client-side.html)
- [Responses API server-side tool execution contract](https://docs.aws.amazon.com/bedrock/latest/userguide/tool-use-server-side.html)
- [Guardrail features, versions and supported checks](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html)
- [Model invocation logging contents and destinations](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html)

### agentcore (7 opened pages)

- [AgentCore modular service overview](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html)
- [MicroVM runtime versions, endpoints and session lifecycle](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-how-it-works.html)
- [Runtime microVM and Instances compute choices](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html)
- [Persistent filesystem types, Preview status and lifecycle](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-filesystem-configurations.html)
- [Gateway tool interfaces and authentication boundaries](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html)
- [Agent workload identity and credential management](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html)
- [Short-term and long-term agent memory](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html)

### quick (5 opened pages)

- [Amazon Quick capability and product overview](https://docs.aws.amazon.com/quick/latest/userguide/what-is.html)
- [Data integrations and connected knowledge bases](https://docs.aws.amazon.com/quick/latest/userguide/data-access-integrations.html)
- [Space sharing and uploaded-file visibility](https://docs.aws.amazon.com/quick/latest/userguide/working-with-spaces.html)
- [Connector ownership and tool permission controls](https://docs.aws.amazon.com/quick/latest/userguide/connections-desktop.html)
- [Interactive versus automated identity and oversight](https://docs.aws.amazon.com/quick/latest/userguide/sec-agentic-security.html)

### kiro (5 opened pages)

- [Kiro requirements, design and task workflow](https://kiro.dev/docs/specs/)
- [Workspace/global steering and supported surfaces](https://kiro.dev/docs/steering/)
- [Hook triggers and automatic command actions](https://kiro.dev/docs/hooks/)
- [MCP tools, context and connection configuration](https://kiro.dev/docs/mcp/)
- [Capability permissions and web-surface differences](https://kiro.dev/docs/permissions/)

### sam (6 opened pages)

- [SAM function properties and generated resources](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html)
- [SAM build outputs and package types](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-build.html)
- [Local invoke and HTTP testing boundaries](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli-local.html)
- [SAM configuration environments and precedence](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-config.html)
- [HttpApi event routes and payload format](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-httpapi.html)
- [Lambda event-function runtime support](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html)
