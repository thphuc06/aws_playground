import type {ServiceDetail} from './serviceDetailTypes';

export const toolsDetails:ServiceDetail[] = [
  {
    "serviceId": "amplify",
    "reviewStatus": "reviewed",
    "summary": "Amplify combines frontend hosting workflows with tools for building application backends. Hosting and backend-generation concepts are related but not interchangeable.",
    "useCases": [
      "Deploy a web frontend from a Git branch; preview changes before promoting them."
    ],
    "examFocus": [
      "Relate branch environments, build artifacts and deployment troubleshooting to the Deployment domain."
    ],
    "configuration": [
      "Hosting detects framework settings from package.json; a repository amplify.yml can override console build settings.",
      "Gen 2 backend definitions use TypeScript; do not mix Gen 1 CLI instructions with Gen 2 without checking the guide."
    ],
    "security": [
      "SSR hosting uses a service role; its CloudWatch log permissions must be present.",
      "Review generated backend authorization; publishing a frontend does not make embedded secrets safe."
    ],
    "reliability": [
      "Atomic hosting publication avoids partially uploaded app versions; application correctness still needs tests."
    ],
    "observability": [
      "SSR runtime logs are delivered to CloudWatch Logs when the service role permits it."
    ],
    "example": "Learning exercise: draw branch → build → hosting, and list which artifact directory the build publishes. No deployment is performed here.",
    "misconceptions": [
      "Amplify Hosting is not simply another name for an entire generated backend."
    ],
    "caveats": [
      "Framework and generation support changes; use the matching current documentation."
    ],
    "coverageNote": "Bounded exam-oriented review, not exhaustive product coverage. Framework-specific SSR limits and full Gen 2 authorization recipes are not covered.",
    "sources": [
      {
        "title": "Hosting overview",
        "url": "https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html",
        "verified": "2026-11-01"
      },
      {
        "title": "Build settings",
        "url": "https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html",
        "verified": "2026-11-01"
      },
      {
        "title": "SSR log permissions",
        "url": "https://docs.aws.amazon.com/amplify/latest/userguide/cloudwatch-logs-role.html",
        "verified": "2026-11-01"
      }
    ]
  },
  {
    "serviceId": "cloudshell",
    "reviewStatus": "reviewed",
    "summary": "CloudShell is a browser shell with AWS CLI v2 and development tools, using the credentials of the console session.",
    "useCases": [
      "Inspect AWS resources or run authorized CLI commands without installing a local toolchain."
    ],
    "examFocus": [
      "Understand temporary authenticated tooling, Region selection and permission-denied troubleshooting."
    ],
    "configuration": [
      "Standard environments retain files in $HOME; other environment files can be recycled.",
      "VPC environments inherit selected subnet/security-group networking and do not retain home storage across environment termination."
    ],
    "security": [
      "The shell does not elevate the signed-in identity’s AWS permissions.",
      "Treat uploaded files and shell history as potentially sensitive; never paste production secrets into examples."
    ],
    "reliability": [
      "Do not rely on a shell session as a long-running application host; environment lifecycle can interrupt work."
    ],
    "observability": [
      "Use CloudShell logging/monitoring guidance and underlying service audit records to investigate actions; shell output is not an application monitoring system."
    ],
    "example": "Conceptual check: an AccessDenied from an AWS CLI command requires examining the caller and policy, not reinstalling the CLI.",
    "misconceptions": [
      "Pre-authenticated does not mean administrator access."
    ],
    "caveats": [
      "Persistent-storage behavior differs for standard and VPC environments."
    ],
    "coverageNote": "Bounded exam-oriented review, not exhaustive product coverage. Detailed storage-retention limits and VPC connectivity troubleshooting are left to linked docs.",
    "sources": [
      {
        "title": "CloudShell overview",
        "url": "https://docs.aws.amazon.com/cloudshell/latest/userguide/welcome.html",
        "verified": "2026-11-01"
      },
      {
        "title": "Security and monitoring topics",
        "url": "https://docs.aws.amazon.com/cloudshell/latest/userguide/security.html",
        "verified": "2026-11-01"
      }
    ]
  },
  {
    "serviceId": "codeartifact",
    "reviewStatus": "reviewed",
    "summary": "CodeArtifact manages software dependency packages in repositories grouped into domains.",
    "useCases": [
      "Share private packages and cache dependencies obtained through upstream repositories or external connections."
    ],
    "examFocus": [
      "Recognize dependency repositories versus source repositories and deployment artifacts."
    ],
    "configuration": [
      "Configure the package manager with the repository endpoint and authorization token; login supports selected package managers.",
      "Repositories can share packages through upstream relationships within a domain."
    ],
    "security": [
      "Publishing and consuming packages require authentication; repositories are not public package endpoints.",
      "GetAuthorizationToken permissions are separate from package operations; root users cannot obtain this token."
    ],
    "reliability": [
      "Expired tokens require renewal; default token lifetime is 12 hours. Role-session-bound lifetime can be requested with duration-seconds 0."
    ],
    "observability": [
      "For a failed install, distinguish token expiry, repository endpoint and package-version resolution errors before changing IAM."
    ],
    "example": "Learning exercise: draw CodeBuild → CodeArtifact for dependency download, separately from CodeBuild → artifact storage for its output.",
    "misconceptions": [
      "A package authorization token is not the same as a Git credential or a permanent AWS access key."
    ],
    "caveats": [
      "Package-manager support and token settings are version-dependent."
    ],
    "coverageNote": "Bounded exam-oriented review, not exhaustive product coverage. Package-specific policies and cross-account domain policies need separate review.",
    "sources": [
      {
        "title": "CodeArtifact concepts",
        "url": "https://docs.aws.amazon.com/codeartifact/latest/ug/welcome.html",
        "verified": "2026-11-01"
      },
      {
        "title": "Token authentication",
        "url": "https://docs.aws.amazon.com/codeartifact/latest/ug/tokens-authentication.html",
        "verified": "2026-11-01"
      }
    ]
  },
  {
    "serviceId": "codebuild",
    "reviewStatus": "reviewed",
    "summary": "CodeBuild runs managed builds and tests and produces deployment artifacts; it does not itself orchestrate an entire release pipeline.",
    "useCases": [
      "Compile an application, run unit tests and package immutable build output."
    ],
    "examFocus": [
      "Read buildspec phases, environment settings and artifact configuration; distinguish build failure from deployment failure."
    ],
    "configuration": [
      "The default repository build definition is buildspec.yml; project or start-build settings can override its location.",
      "Buildspec 0.2 supports install, pre_build, build and post_build phases plus artifact/report settings."
    ],
    "security": [
      "Use Parameter Store or Secrets Manager references for sensitive values rather than plaintext buildspec variables.",
      "The build service role needs narrowly scoped access to required inputs, outputs and referenced secrets."
    ],
    "reliability": [
      "Treat nonzero build commands and failed tests as actionable failures; a retry does not repair deterministic code errors.",
      "Buildspec on-failure behavior has compute-mode restrictions; check the reference before assuming every build can retry identically."
    ],
    "observability": [
      "Inspect build phase status, command logs and test reports; do not print secret values while debugging."
    ],
    "example": "Educational build plan: install locked dependencies, run tests, then publish only the generated package directory.",
    "misconceptions": [
      "A successful build proves its configured checks passed, not that the application was deployed or is healthy."
    ],
    "caveats": [
      "Supported runtimes/images evolve; pin and review build environment choices."
    ],
    "coverageNote": "Bounded exam-oriented review, not exhaustive product coverage. Full buildspec syntax, fleet scaling and every network setup are omitted.",
    "sources": [
      {
        "title": "CodeBuild overview",
        "url": "https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html",
        "verified": "2026-11-01"
      },
      {
        "title": "Buildspec reference",
        "url": "https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html",
        "verified": "2026-11-01"
      }
    ]
  },
  {
    "serviceId": "codedeploy",
    "reviewStatus": "reviewed",
    "summary": "CodeDeploy rolls application revisions onto supported EC2/on-premises, Lambda and ECS targets.",
    "useCases": [
      "Shift traffic to a Lambda version or deploy a server application with controlled health checks."
    ],
    "examFocus": [
      "Compare in-place and blue/green strategies, lifecycle hooks, traffic shifting and rollback."
    ],
    "configuration": [
      "Deployment application, compute platform, deployment group and revision must match the target.",
      "AppSpec describes platform-specific deployment content and hooks; it is not a CodeBuild buildspec."
    ],
    "security": [
      "Keep deployment-service permissions distinct from the runtime role used by the deployed application."
    ],
    "reliability": [
      "Automatic rollback must be configured for deployment failure or a monitored threshold.",
      "A rollback redeploys a prior revision as a new deployment with a new ID; it is not a universal reversal of external side effects."
    ],
    "observability": [
      "Inspect deployment status, lifecycle failures and configured health alarms before promoting traffic."
    ],
    "example": "Scenario: a candidate version triggers the configured alarm; explain why rollback needs both an alarm and a rollback setting.",
    "misconceptions": [
      "A traffic alias alone does not configure automatic CodeDeploy rollback."
    ],
    "caveats": [
      "Deployment types and supported hooks differ by compute platform."
    ],
    "coverageNote": "Bounded exam-oriented review, not exhaustive product coverage. Every AppSpec hook and platform-specific IAM recipe needs its own reference.",
    "sources": [
      {
        "title": "CodeDeploy overview and platforms",
        "url": "https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html",
        "verified": "2026-11-01"
      },
      {
        "title": "Rollback behavior",
        "url": "https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html",
        "verified": "2026-11-01"
      }
    ]
  },
  {
    "serviceId": "codepipeline",
    "reviewStatus": "reviewed",
    "summary": "CodePipeline coordinates software-release stages and actions, passing artifacts between specialized tools.",
    "useCases": [
      "Connect source, build, test, approval and deploy steps into a release workflow."
    ],
    "examFocus": [
      "Understand stage/action boundaries, artifact flow, action permissions and failed-execution diagnosis."
    ],
    "configuration": [
      "Stages contain actions that can run serially or in parallel using runOrder.",
      "Source revisions, triggers, execution modes and stage conditions affect which changes are released."
    ],
    "security": [
      "The pipeline service role must permit each configured action; adding a provider can require a policy update.",
      "S3 artifacts use encryption; CodePipeline supports symmetric, not asymmetric, KMS keys for this purpose."
    ],
    "reliability": [
      "Inspect the failing action before retrying; rerunning a pipeline can repeat externally visible operations.",
      "Execution/concurrency behavior depends on pipeline mode; do not generalize one superseded execution example to all modes."
    ],
    "observability": [
      "Use execution and action IDs to correlate artifact revisions with downstream build/deployment records."
    ],
    "example": "Trace source artifact → CodeBuild output artifact → approval → deployment; identify which role accesses each bucket.",
    "misconceptions": [
      "CodePipeline orchestrates builds; CodeBuild performs the build commands."
    ],
    "caveats": [
      "Current action providers and pipeline type capabilities can exceed the core exam examples."
    ],
    "coverageNote": "Bounded exam-oriented review, not exhaustive product coverage. Cross-account releases and complete condition syntax are not fully covered.",
    "sources": [
      {
        "title": "Pipeline concepts",
        "url": "https://docs.aws.amazon.com/codepipeline/latest/userguide/concepts.html",
        "verified": "2026-11-01"
      },
      {
        "title": "Service role",
        "url": "https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-custom-role.html",
        "verified": "2026-11-01"
      },
      {
        "title": "Artifact protection",
        "url": "https://docs.aws.amazon.com/codepipeline/latest/userguide/data-protection.html",
        "verified": "2026-11-01"
      }
    ]
  },
  {
    "serviceId": "xray",
    "reviewStatus": "reviewed",
    "summary": "X-Ray collects distributed traces so developers can investigate latency and downstream dependencies for individual requests.",
    "useCases": [
      "Find a slow downstream call hidden inside an otherwise successful API request."
    ],
    "examFocus": [
      "Understand request correlation, instrumentation, segments and trace maps rather than treating a trace as a log file."
    ],
    "configuration": [
      "Instrument incoming and outgoing operations; supported AWS integrations can contribute trace data.",
      "For new instrumentation, AWS recommends OpenTelemetry rather than beginning with legacy X-Ray SDKs."
    ],
    "security": [
      "Avoid including secrets or unnecessary personal data in trace attributes; grant exporters only required telemetry permissions."
    ],
    "reliability": [
      "Tracing is diagnostic, not a delivery/retry mechanism; missing telemetry does not prove that no application call happened."
    ],
    "observability": [
      "Compare downstream latency and error evidence in the trace map with application logs and metrics."
    ],
    "example": "Exercise: annotate a mock request path and identify whether time is spent in the handler or a downstream database call.",
    "misconceptions": [
      "Instrumenting only the entry service does not guarantee detailed visibility inside every dependency."
    ],
    "caveats": [
      "AWS documents X-Ray SDK/daemon maintenance mode from February 25, 2026; this is not a shutdown of the X-Ray service."
    ],
    "coverageNote": "Bounded exam-oriented review, not exhaustive product coverage. SDK-specific sampling and exporter policies require additional configuration review.",
    "sources": [
      {
        "title": "X-Ray overview",
        "url": "https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html",
        "verified": "2026-11-01"
      },
      {
        "title": "OpenTelemetry migration",
        "url": "https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-migration.html",
        "verified": "2026-11-01"
      }
    ]
  },
  {
    "serviceId": "q-developer",
    "reviewStatus": "reviewed",
    "summary": "Amazon Q Developer provides AI assistance for understanding, building and operating AWS applications.",
    "useCases": [
      "Ask for code explanations, suggested tests, debugging help or security findings, then review the results."
    ],
    "examFocus": [
      "Recognize developer assistance as a tool in the published service list, not a replacement for understanding AWS behavior."
    ],
    "configuration": [
      "Supported access paths include AWS web/console experiences and development tools; identity and entitlement depend on the access path."
    ],
    "security": [
      "Review sensitive-data handling, organization policies and required permissions before submitting code or resource context.",
      "Generated code still needs human review, tests and least-privilege checks."
    ],
    "reliability": [
      "AI answers can be incomplete or wrong; validate recommendations against authoritative documentation and a controlled test."
    ],
    "observability": [
      "Evaluate suggested changes using test results, security findings and review evidence rather than fluency of the explanation."
    ],
    "example": "Offline exercise: ask what evidence would be needed before accepting an AI-generated IAM policy. This app makes no AI requests.",
    "misconceptions": [
      "Q Developer is not Q Business, and an AI-generated answer is not an exam authority."
    ],
    "caveats": [
      "Current docs announce IDE-plugin support ends April 30, 2027; this does not mean every Q Developer capability ends."
    ],
    "coverageNote": "Bounded exam-oriented review, not exhaustive product coverage. Entitlement details, data controls and evolving IDE replacements must be checked before real use.",
    "sources": [
      {
        "title": "Q Developer overview and lifecycle notice",
        "url": "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/what-is.html",
        "verified": "2026-11-01"
      },
      {
        "title": "Q security",
        "url": "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/security.html",
        "verified": "2026-11-01"
      }
    ]
  },
  {
    "serviceId": "appconfig",
    "reviewStatus": "reviewed",
    "summary": "AppConfig manages validated, controlled rollouts of feature flags and dynamic application configuration without a code redeployment.",
    "useCases": [
      "Gradually enable a feature or change an operational threshold with monitoring and rollback."
    ],
    "examFocus": [
      "Distinguish storing configuration from safely deploying it; connect validation, rollout strategy and health alarms."
    ],
    "configuration": [
      "Organize application, environment and configuration profile; choose validators and a deployment strategy.",
      "The recommended Agent caches/polls configuration. Direct clients use StartConfigurationSession and GetLatestConfiguration with successive tokens."
    ],
    "security": [
      "Runtime roles need data-plane retrieval permissions; encrypted configurations can also require kms:Decrypt."
    ],
    "reliability": [
      "Configured CloudWatch alarms can trigger automatic rollback.",
      "Direct polling must use the returned next token and polling interval; an empty response can mean no newer configuration."
    ],
    "observability": [
      "Monitor deployment health and Agent/retrieval errors; an accepted configuration is not automatically safe for every workload."
    ],
    "example": "Exercise: design a gradual rollout of a new checkout flag with an error-rate alarm and explain the rollback trigger.",
    "misconceptions": [
      "Parameter Store versioning alone is not the same as AppConfig validation and staged rollout."
    ],
    "caveats": [
      "Latest experimentation capabilities are product context, not a claim that every feature is examined."
    ],
    "coverageNote": "Bounded exam-oriented review, not exhaustive product coverage. Advanced targeting and experiment statistics are outside this review.",
    "sources": [
      {
        "title": "AppConfig overview",
        "url": "https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html",
        "verified": "2026-11-01"
      },
      {
        "title": "Data-plane retrieval",
        "url": "https://docs.aws.amazon.com/appconfig/latest/userguide/about-data-plane.html",
        "verified": "2026-11-01"
      },
      {
        "title": "Agent runtime permissions",
        "url": "https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-integration-ec2.html",
        "verified": "2026-11-01"
      }
    ]
  },
  {
    "serviceId": "cdk",
    "reviewStatus": "reviewed",
    "summary": "AWS CDK defines infrastructure with programming-language constructs and deploys synthesized templates through CloudFormation.",
    "useCases": [
      "Reuse tested infrastructure constructs across application environments."
    ],
    "examFocus": [
      "Connect constructs, stacks, synthesis and deployment; review generated infrastructure rather than only source code."
    ],
    "configuration": [
      "Use cdk synth to inspect generated templates and cdk diff before an authorized deployment.",
      "Bootstrap each target account/Region environment as needed; bootstrapping creates deployment support resources."
    ],
    "security": [
      "Review bootstrap trust and execution permissions; convenience does not justify unlimited deployment privileges.",
      "Generated role grants still need workload-specific least-privilege review."
    ],
    "reliability": [
      "Deployment behavior and rollback depend on CloudFormation and resource update semantics.",
      "A successfully synthesized template is not proof that every resource can be created."
    ],
    "observability": [
      "Inspect CDK output and CloudFormation stack events when deployment fails."
    ],
    "example": "Educational workflow: define a queue and function, synthesize locally, then inspect the resulting permissions without deploying.",
    "misconceptions": [
      "CDK is not a separate cloud provisioning engine that bypasses CloudFormation."
    ],
    "caveats": [
      "Library, CLI and bootstrap versions evolve; check compatibility and update notices."
    ],
    "coverageNote": "Bounded exam-oriented review, not exhaustive product coverage. Language-specific construct APIs and complete bootstrap trust designs are omitted.",
    "sources": [
      {
        "title": "CDK overview",
        "url": "https://docs.aws.amazon.com/cdk/v2/guide/home.html",
        "verified": "2026-11-01"
      },
      {
        "title": "Bootstrapping",
        "url": "https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping-env.html",
        "verified": "2026-11-01"
      }
    ]
  },
  {
    "serviceId": "cloudformation",
    "reviewStatus": "reviewed",
    "summary": "CloudFormation manages related infrastructure resources as stacks defined by templates.",
    "useCases": [
      "Create repeatable application environments and review infrastructure updates as code."
    ],
    "examFocus": [
      "Understand templates, dependencies, stack updates, replacements and change-set review."
    ],
    "configuration": [
      "Prepare a change set to preview added, changed or deleted resources; execution is a separate action.",
      "Review replacement-sensitive resources and stateful data before accepting an update."
    ],
    "security": [
      "Treat the identity performing deployment and the permissions required by provisioned workloads as separate concerns.",
      "Never embed reusable credentials in a template or its source repository."
    ],
    "reliability": [
      "A change set does not guarantee a successful update; runtime and service-specific failures can still occur.",
      "Plan data protection independently of rolling back a template."
    ],
    "observability": [
      "Use stack/resource events to identify the first failing resource rather than only the final stack status."
    ],
    "example": "Exercise: review a proposed database replacement and explain why a preview must be checked before execution.",
    "misconceptions": [
      "Creating a change set does not immediately update the resources."
    ],
    "caveats": [
      "New change-set validation features do not eliminate all runtime failure modes."
    ],
    "coverageNote": "Bounded exam-oriented review, not exhaustive product coverage. Nested stacks, custom resources, service-role policies and retention-policy syntax require deeper review.",
    "sources": [
      {
        "title": "CloudFormation overview",
        "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html",
        "verified": "2026-11-01"
      },
      {
        "title": "Change sets",
        "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html",
        "verified": "2026-11-01"
      }
    ]
  },
  {
    "serviceId": "cloudtrail",
    "reviewStatus": "reviewed",
    "summary": "CloudTrail records AWS API and account activity for audit and investigation.",
    "useCases": [
      "Identify which principal changed a resource and when the change occurred."
    ],
    "examFocus": [
      "Distinguish management events, data events and application logs; choose evidence suited to an authorization investigation."
    ],
    "configuration": [
      "Event history contains the previous 90 days of regional management events.",
      "Configure trails or event data stores for intended events and retention; data events need explicit selection."
    ],
    "security": [
      "Restrict audit-data access and protect delivery/storage destinations; sensitive event content must not be exposed publicly."
    ],
    "reliability": [
      "Do not assume unconfigured data events were captured; an absence in event history is not proof that an S3 object operation never occurred."
    ],
    "observability": [
      "Correlate principal, event name, resource and time with application evidence. Trails can deliver to S3 and optionally monitoring integrations."
    ],
    "example": "Question: a user reports an unexpected PutObject. Explain why management-event history alone is insufficient and which data events must be enabled.",
    "misconceptions": [
      "CloudTrail is not a substitute for an application stack trace or latency metric."
    ],
    "caveats": [
      "Data-event logging and extended storage/query options can incur charges."
    ],
    "coverageNote": "Bounded exam-oriented review, not exhaustive product coverage. Organization-wide trail policies and all event selectors are not enumerated.",
    "sources": [
      {
        "title": "CloudTrail overview",
        "url": "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html",
        "verified": "2026-11-01"
      },
      {
        "title": "Data events",
        "url": "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html",
        "verified": "2026-11-01"
      }
    ]
  },
  {
    "serviceId": "cloudwatch",
    "reviewStatus": "reviewed",
    "summary": "CloudWatch collects operational telemetry and evaluates configured alarms for applications and infrastructure.",
    "useCases": [
      "Investigate error spikes, query application logs and alert on unhealthy behavior."
    ],
    "examFocus": [
      "Relate logs, metrics, dashboards and alarms; choose meaningful thresholds and monitored dimensions."
    ],
    "configuration": [
      "Publish custom metrics with PutMetricData or supported telemetry paths; services also emit native metrics.",
      "A metric alarm evaluates a metric/expression over periods; a composite alarm combines alarm states."
    ],
    "security": [
      "Scope telemetry publishing and reading permissions; avoid placing secrets in logs or dimensions."
    ],
    "reliability": [
      "An alarm only performs configured actions; it does not automatically repair every application fault.",
      "Most actions occur on state change; Auto Scaling alarm actions have different repeated-action behavior."
    ],
    "observability": [
      "Use correlated logs and request IDs with metrics; a dashboard alone is not an alerting policy."
    ],
    "example": "Exercise: specify an error-rate alarm and its response, then explain how a deploy controller would consume it for rollback.",
    "misconceptions": [
      "CloudWatch operational metrics and CloudTrail API audit events answer different questions."
    ],
    "caveats": [
      "Latest docs include newer Omni and telemetry features; this review focuses on established exam-relevant observability concepts."
    ],
    "coverageNote": "Bounded exam-oriented review, not exhaustive product coverage. All query languages, retention options and alarm missing-data semantics need additional study.",
    "sources": [
      {
        "title": "CloudWatch overview",
        "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html",
        "verified": "2026-11-01"
      },
      {
        "title": "Alarms",
        "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Alarms.html",
        "verified": "2026-11-01"
      }
    ]
  },
  {
    "serviceId": "cli",
    "reviewStatus": "reviewed",
    "summary": "AWS CLI provides scriptable access to AWS service APIs from a shell.",
    "useCases": [
      "Perform repeatable authorized operations and inspect resource state without console navigation."
    ],
    "examFocus": [
      "Understand caller credentials, Region/profile selection, API errors and repeatable command workflows."
    ],
    "configuration": [
      "Use the current supported CLI major version and explicit profiles/Regions where ambiguity is risky.",
      "Command families often map directly to service APIs; some offer higher-level operations."
    ],
    "security": [
      "Use role-based temporary credentials rather than embedding access keys in scripts.",
      "Commands act with the caller’s permissions; a shell tool does not bypass IAM."
    ],
    "reliability": [
      "CLI v2 standard retry mode defaults to three total attempts for eligible failures; max_attempts changes this.",
      "Retries use backoff for transient/throttling failures, not a guarantee that unsafe repeated writes are harmless."
    ],
    "observability": [
      "Inspect exit status and service error messages; debug output can expose sensitive context and should be handled carefully."
    ],
    "example": "Educational command: aws sts get-caller-identity helps verify the intended caller before any authorized change. Do not run cloud commands from this site.",
    "misconceptions": [
      "A retried request and an idempotent business operation are not automatically the same thing."
    ],
    "caveats": [
      "Adaptive retry mode is documented as experimental; CLI v1 defaults differ from v2."
    ],
    "coverageNote": "Bounded exam-oriented review, not exhaustive product coverage. Shell quoting, pagination, credential precedence and each service command require separate practice.",
    "sources": [
      {
        "title": "CLI overview",
        "url": "https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html",
        "verified": "2026-11-01"
      },
      {
        "title": "CLI retry modes",
        "url": "https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-retries.html",
        "verified": "2026-11-01"
      }
    ]
  },
  {
    "serviceId": "systems-manager",
    "reviewStatus": "reviewed",
    "summary": "Systems Manager combines operational tooling for managed nodes with application configuration capabilities such as Parameter Store.",
    "useCases": [
      "Retrieve named configuration values or manage authorized instances through SSM tooling."
    ],
    "examFocus": [
      "Focus on application configuration retrieval, secure values and diagnosing inaccessible managed nodes."
    ],
    "configuration": [
      "Parameter Store supports String, StringList and KMS-encrypted SecureString values.",
      "Managed-node features require SSM Agent and network communication with the service; that prerequisite is separate from reading Parameter Store through an SDK."
    ],
    "security": [
      "Scope parameter access and encryption-key permissions to the application.",
      "Current guidance recommends Secrets Manager for credentials needing purpose-built secret controls such as automatic rotation."
    ],
    "reliability": [
      "Updating a parameter takes effect on the next read; it does not provide AppConfig-style validation, gradual rollout or automatic revert.",
      "Choose cache freshness and failure behavior deliberately rather than reading configuration on every business operation."
    ],
    "observability": [
      "For node operations, inspect managed-node status and Agent connectivity; for configuration, distinguish retrieval denial from bad values."
    ],
    "example": "Exercise: choose Parameter Store for a static endpoint and AppConfig for a risky feature rollout; explain when a secret belongs in Secrets Manager.",
    "misconceptions": [
      "Systems Manager is broader than Parameter Store, and SecureString alone does not implement automatic secret rotation."
    ],
    "caveats": [
      "Advanced parameter tiers/throughput have different limits and costs."
    ],
    "coverageNote": "Bounded exam-oriented review, not exhaustive product coverage. Run Command documents, Session Manager policies and fleet operations are not exhaustively covered.",
    "sources": [
      {
        "title": "Systems Manager overview",
        "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html",
        "verified": "2026-11-01"
      },
      {
        "title": "Parameter Store",
        "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html",
        "verified": "2026-11-01"
      }
    ]
  }
];
