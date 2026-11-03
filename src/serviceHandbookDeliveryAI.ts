import type {HandbookNote, ServiceHandbook} from './serviceHandbookTypes';

const n = (title: string, detail: string, ...sourceIds: string[]): HandbookNote => ({title, detail, sourceIds});
const c = (name: string, choice: string, tradeoff: string, ...sourceIds: string[]) => ({name, choice, tradeoff, sourceIds});
const t = (symptom: string, likelyCause: string, check: string, resolution: string, ...sourceIds: string[]) => ({symptom, likelyCause, check, resolution, sourceIds});
const s = (id: string, title: string, url: string) => ({id, title, url, verified: '2026-11-03'});

/** Original implementation notes. Snippets are reading examples, never executed by this application. */
export const deliveryAIHandbooks: ServiceHandbook[] = [
  {
    serviceId: 'amplify',
    operatingModel: [
      n('A branch is a release boundary', 'Hosting connects a source branch to a build and publication workflow. Repository build settings can override console settings, so review the effective amplify.yml alongside the commit. A successful installation step is only one part of producing the directory that Hosting publishes.', 'build', 'spec'),
      n('Static and server-rendered output differ', 'A static site publishes browser assets. An SSR application also needs a supported server rendering integration and compatible build output. Some frameworks use adapters; verify the exact framework version and supported features instead of copying a static-site artifact directory into an SSR project.', 'ssr'),
      n('Hosting is separate from backend generation', 'Amplify Hosting can host a frontend independently of an Amplify-generated backend. Gen 1 and Gen 2 backend workflows have different configuration and secret-management paths. A frontend environment variable becoming encrypted at rest does not keep it secret after the build places it in client JavaScript.', 'environment'),
    ],
    setup: [
      n('Record the output contract', 'Identify the package manager, lockfile, runtime, build command and output directory from a clean local build. For a monorepo, also record the application root. Keep this checklist beside the branch configuration so a green build cannot silently publish a different package.', 'build', 'spec'),
      n('Create an isolated preview', 'Connect the intended non-production branch and give it non-production API endpoints. Verify the effective build specification in the job log. Use synthetic data for review, and make promotion depend on the source revision rather than a screenshot from an unrelated deployment.', 'build', 'environment'),
      n('Test routes at the hosted URL', 'Open a nested route directly, refresh it and request a missing asset. Place specific redirect rules before broad rules. A SPA rewrite should let the client router handle application routes while preserving correct responses for JavaScript, images and genuinely missing resources.', 'redirects'),
      n('Check the server boundary', 'For SSR, exercise a server-rendered request and inspect runtime logs as well as build logs. Confirm that the runtime can obtain its required configuration. Test the deployed result before connecting the production domain; local development may hide adapter or runtime differences.', 'ssr'),
    ],
    configuration: [
      c('Build specification location', 'Keep amplify.yml in version control when build behavior should follow the reviewed revision.', 'Console configuration is convenient, but a repository file changes which configuration wins. Investigations should compare both rather than assuming the console display is the effective source.', 'build'),
      c('artifacts.baseDirectory and files', 'Point these at the output produced by the selected frontend build; the example below is for a static Vite application.', 'Publishing the repository root may expose unintended files. Publishing the wrong output directory can produce a successful deployment with missing application assets.', 'spec'),
      c('Redirect status and ordering', 'Use a rewrite when the visible URL must remain unchanged; use a redirect when the browser should navigate to a different URL.', 'An overly broad early rule can capture later exceptions. Permanent redirects can persist in clients, so validate routing on a preview first.', 'redirects'),
    ],
    security: [
      n('Separate public configuration from credentials', 'Assume values compiled into the frontend are readable by visitors. Keep private tokens in the appropriate backend secret mechanism for the actual Amplify generation. Confirm which code executes in the browser before deciding that a variable belongs in Hosting settings.', 'environment'),
      n('Scope SSR service access', 'Review the IAM service role used by the hosting integration and its logging permissions. An SSR route should authorize the application user before retrieving sensitive data; a working server-side credential is not evidence that the caller may access every record.', 'ssr'),
    ],
    example: {
      title: 'Static Vite build contract in amplify.yml', language: 'yaml',
      code: `version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - .npm/**/*`,
      explanation: 'This is a static frontend example, not an SSR manifest or backend deployment. The project must provide a committed lockfile and a build script that writes dist. The optional cache path only helps if npm is configured to use that directory; build correctness must not depend on a warm cache.',
      checks: ['Inspect the published output for index.html and its referenced asset paths from the same revision.', 'Request a nested application route and a missing JavaScript file separately; the missing asset must not silently return HTML.'], sourceIds: ['spec', 'redirects'],
    },
    troubleshooting: [
      t('Build passes but the page is blank', 'The published directory or asset base path does not match the generated application.', 'Compare artifacts.baseDirectory with actual build output and inspect browser network responses for script requests.', 'Correct the output contract and rebuild the same candidate; do not mask missing files with a catch-all rewrite.', 'spec', 'redirects'),
      t('Navigation works but a refresh fails', 'The hosting layer has no appropriate rule for the client-side route.', 'Request the nested URL directly and inspect redirect ordering and returned status.', 'Add a narrowly tested SPA rewrite or correct the SSR route integration, according to the application type.', 'redirects', 'ssr'),
      t('Only the deployed SSR request fails', 'A framework feature, adapter output or runtime configuration differs from the local environment.', 'Correlate the failing request with SSR logs and the supported-feature documentation for that framework.', 'Use the supported adapter/runtime path, repair missing configuration and rerun the deployed route check.', 'ssr', 'environment'),
    ],
    pitfalls: [
      n('Build-time values are not live configuration', 'Changing an environment value does not retroactively rewrite an already published browser bundle. Check which revision and configuration produced the artifact before debugging the API, and rebuild when the frontend embeds configuration during compilation.', 'environment'),
      n('A universal manifest is misleading', 'A static Vite output directory, a Next.js build and an adapter-based SSR bundle have different contracts. Keep examples labeled by hosting mode so readers do not assume one successful YAML file covers every supported framework.', 'ssr', 'spec'),
    ],
    sources: [
      s('build', 'How Amplify selects build settings', 'https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html'),
      s('spec', 'Amplify build specification fields', 'https://docs.aws.amazon.com/amplify/latest/userguide/yml-specification-syntax.html'),
      s('environment', 'Amplify environment variables and secret guidance', 'https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html'),
      s('redirects', 'Redirects, rewrites and rule ordering', 'https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html'),
      s('ssr', 'Server rendering and framework adapters', 'https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html'),
    ],
  },
  {
    serviceId: 'cloudshell',
    operatingModel: [
      n('Console identity becomes shell authority', 'CloudShell supplies a browser terminal and preconfigured AWS tooling under the signed-in identity. The shell is convenient because credentials are already available, not because permissions are restricted to diagnostic commands. A pasted command has the same consequences as the corresponding API request.', 'overview', 'iam'),
      n('Storage depends on environment type', 'A standard regional environment preserves the user home directory between sessions subject to retention rules. Files outside that home directory are ephemeral. CloudShell VPC environments do not provide persistent home storage, so treat them as disposable investigation sessions.', 'limits'),
      n('VPC connectivity is a separate choice', 'A VPC environment uses the selected subnet and security groups. It does not receive a public IP by default; placing it in a public subnet with an internet-gateway route does not by itself provide internet access. Plan the actual private-subnet egress or service endpoint path.', 'vpc'),
    ],
    setup: [
      n('Confirm account and Region', 'Before inspecting resources, check the current caller and explicit target Region. Record these identifiers in the investigation notes. Switching the console Region changes the CloudShell environment context; a familiar filename or shell prompt is not a reliable account check.', 'overview', 'concepts'),
      n('Choose public or VPC execution', 'Use the standard environment for supported public-endpoint administration. Choose a VPC environment when the task needs private connectivity, and review subnet routes, endpoint access and security groups before debugging the application credentials.', 'vpc'),
      n('Prepare a reproducible command', 'Put repeated diagnostics in a reviewed script with explicit resource identifiers and output fields. Start with a read-only request. Save sanitized command inputs and results so another engineer can reproduce the investigation without inheriting the original interactive terminal.', 'overview', 'concepts'),
      n('Export the evidence deliberately', 'Decide which files must outlive the session and where they are allowed to be stored. Standard upload/download controls are not available for VPC environments; use an approved reachable destination when necessary. Review files for credentials before retaining or sharing them.', 'limits', 'vpc'),
    ],
    configuration: [
      c('Environment type', 'Select a standard or VPC environment according to the resource network boundary.', 'The VPC option enables private reachability but changes storage and transfer behavior. It should not be selected merely because the task involves an AWS service.', 'vpc'),
      c('Shell and installed tool versions', 'Inspect the shell and CLI version before reusing a script, especially when switching between Bash and PowerShell.', 'Quoting and expansion differ by shell. A command copied from a guide can change meaning before the AWS CLI sees its arguments.', 'overview', 'concepts'),
      c('Session lifecycle', 'Keep long-running and scheduled work in an appropriate execution service, and make interactive diagnostics restartable.', 'An active process is not sufficient to keep an otherwise inactive CloudShell session alive. A successful terminal start is not a durability guarantee.', 'limits'),
    ],
    security: [
      n('Grant shell access and workload access separately', 'Review permissions to create and use CloudShell independently from permissions to the target services. Prefer a federated diagnostic role with the specific read operations required. Allowing a shell should not silently become permission to alter the entire account.', 'iam'),
      n('Treat downloads and pasted commands as code', 'Review multiline commands, local scripts and package installation instructions before execution. The preauthenticated environment makes accidental execution particularly consequential. Do not paste access keys into shell history or retain command output containing secrets as ordinary incident evidence.', 'overview', 'iam'),
    ],
    example: {
      title: 'A read-only session identity check', language: 'bash',
      code: `aws --version
aws configure list
aws sts get-caller-identity \
  --query '{Account:Account,Arn:Arn}' \
  --output json \
  --no-cli-pager`,
      explanation: 'These commands inspect tooling, configuration and caller identity. They do not create a resource or prove access to a particular target. Review the account and role before preparing a separate service-specific command. Keep credential values out of any saved transcript.',
      checks: ['The returned account and role match the intended investigation account, rather than an administrator session left open earlier.', 'The configured Region and any explicit --region on later commands agree with the resource being investigated.'], sourceIds: ['overview', 'concepts', 'iam'],
    },
    troubleshooting: [
      t('Private database cannot be reached', 'The standard environment is being used, or the VPC environment lacks the required network path.', 'Check environment type, subnet, target security group and name resolution from the actual session.', 'Use an approved VPC environment and repair routing or security-group rules before changing database credentials.', 'vpc'),
      t('A script or package vanished', 'It was outside persistent home storage, in another Region, or in an ephemeral VPC environment.', 'Compare the current environment and file location with the original session record.', 'Restore from the controlled script repository; keep durable artifacts outside ephemeral session storage.', 'limits', 'concepts'),
      t('Session ends while a command runs', 'The interactive session reached its inactivity or lifetime boundary.', 'Review session timing and whether there was user interaction rather than merely a background process.', 'Move the sustained job to a service designed for it and make retries inspect prior side effects.', 'limits'),
    ],
    pitfalls: [
      n('sudo does not grant AWS IAM permissions', 'Local operating-system privilege and AWS API authorization are different layers. Installing a utility as root inside the environment cannot repair a denied service API action. Diagnose the caller policy and request context rather than changing the shell user.', 'iam', 'overview'),
      n('No shell fee does not mean no cloud cost', 'Commands can create resources or move billable data even though the shell service itself has no additional charge. Record intentional resources and transfer destinations in the task plan, especially when experimenting with copied setup scripts.', 'overview'),
    ],
    sources: [
      s('overview', 'CloudShell identity, tooling and service model', 'https://docs.aws.amazon.com/cloudshell/latest/userguide/welcome.html'),
      s('limits', 'CloudShell storage and session restrictions', 'https://docs.aws.amazon.com/cloudshell/latest/userguide/limits.html'),
      s('vpc', 'CloudShell VPC environment networking and storage', 'https://docs.aws.amazon.com/cloudshell/latest/userguide/using-cshell-in-vpc.html'),
      s('iam', 'CloudShell identity and access management', 'https://docs.aws.amazon.com/cloudshell/latest/userguide/security-iam.html'),
      s('concepts', 'CloudShell Regions, files and shell concepts', 'https://docs.aws.amazon.com/cloudshell/latest/userguide/working-with-aws-cloudshell.html'),
    ],
  },
  {
    serviceId: 'codeartifact',
    operatingModel: [
      n('Domain, repository and package are different scopes', 'A domain is an administrative boundary containing repositories. The package manager talks to a repository endpoint for its format. Recording only the package name is insufficient for reproducibility: also record the domain owner, repository, namespace and exact version used by the build.', 'upstreams', 'npm'),
      n('A token is not repository authorization', 'A CodeArtifact authorization token enables package-manager authentication. The caller still needs the appropriate repository operations. Token retrieval requires both codeartifact:GetAuthorizationToken and sts:GetServiceBearerToken; a repository resource policy cannot independently grant the latter STS permission.', 'tokens', 'policies'),
      n('Upstreams form a resolution path', 'A repository can resolve packages through upstream repositories; external connections connect to supported public registries. Treat this as a dependency supply path with ownership and trust decisions. A successful package install is evidence of resolution, not evidence that the package contents were reviewed.', 'upstreams'),
    ],
    setup: [
      n('Identify the package namespace', 'Choose the package format and naming convention first, including scoped npm names where appropriate. Document which team owns publication and which repositories consume the package. This prevents a private dependency from being resolved unexpectedly through an unrelated public source.', 'npm', 'upstreams'),
      n('Connect the exact repository', 'Obtain the format-specific endpoint for the intended domain, owner and repository. Configure the package manager through the documented login flow or equivalent explicit settings. Review the resulting registry configuration because changing the default registry affects subsequent installs.', 'npm'),
      n('Use a short-lived build identity', 'Give CI token retrieval and package read permissions without publication rights unless that stage actually publishes. Obtain a token at job start and keep it out of build logs, artifacts and committed configuration. Review token lifetime relative to assumed-role sessions.', 'tokens', 'policies'),
      n('Prove a repeatable resolution', 'Install from a committed lockfile in a clean environment and inspect the selected package version and repository endpoint. Repeat without a developer cache. Retain the resolved dependency metadata with the application artifact so a later incident can reproduce what was built.', 'npm', 'upstreams'),
    ],
    configuration: [
      c('Authorization token duration', 'Select a duration appropriate to the job; when assuming a role, the documented duration-seconds value of 0 ties token lifetime to the remaining role session.', 'The ordinary token lifetime is independent of the assumed-role duration. A token can therefore outlive the credential session unless you choose the matching behavior.', 'tokens'),
      c('Upstream relationships', 'Document the approved upstream chain and the public registry connection used for external packages.', 'Convenient fallback can make package origin harder to reason about. Keep private package ownership and public dependency intake explicit.', 'upstreams'),
      c('Package-manager registry scope', 'Use the intended repository endpoint and inspect whether configuration applies to every package or only a namespace.', 'A global registry change can affect unrelated projects. Expired tokens or a missing trailing slash in an endpoint are configuration problems, not proof that the package was removed.', 'npm'),
    ],
    security: [
      n('Separate publishing from consuming', 'Grant readers only the package retrieval operations they need. Restrict package publication to reviewed release identities and appropriate package resources. Cross-account access needs compatible identity and resource policies, with domain access considered separately from repository permissions.', 'policies'),
      n('Keep tokens out of reusable artifacts', 'Treat generated package-manager credentials as secrets. Inject them during the build, avoid echoing them and exclude credential files from the output artifact and image layers. A cached dependency directory can be reusable without caching an authorization token beside it.', 'tokens', 'npm'),
    ],
    example: {
      title: 'Inspect the endpoint before configuring a package manager', language: 'bash',
      code: `aws codeartifact get-repository-endpoint \
  --domain example-team \
  --domain-owner 123456789012 \
  --repository app-packages \
  --format npm \
  --region us-east-1 \
  --query repositoryEndpoint \
  --output text \
  --no-cli-pager`,
      explanation: 'This read-only example returns an npm repository endpoint for placeholder identifiers. It does not print an authorization token or modify npm configuration. Use an approved login process separately and verify which registry settings that process changes.',
      checks: ['The endpoint names the expected domain owner, Region and repository.', 'A clean installation resolves the locked private version from that endpoint, while an identity without publish permission cannot publish it.'], sourceIds: ['npm', 'tokens', 'policies'],
    },
    troubleshooting: [
      t('npm reports an authentication failure', 'The package-manager token expired or belongs to a different endpoint configuration.', 'Inspect the registry URL and token issue time without printing the token itself.', 'Refresh credentials through the approved login path and retry the same locked dependency set.', 'tokens', 'npm'),
      t('Token retrieval succeeds but installation is denied', 'The principal can authenticate but lacks repository read access or cross-account resource permission.', 'Compare the repository ARN and effective read policy with the actual caller and domain owner.', 'Grant the missing narrowly scoped repository permission rather than adding broad administrative rights.', 'policies', 'tokens'),
      t('A developer build works but clean CI cannot find a package', 'The machines use different repositories, upstream paths or cached package versions.', 'Compare lockfiles, scope registry settings and the upstream chain from a clean install.', 'Align the approved resolution path and publish or promote the intended immutable version through the release process.', 'upstreams', 'npm'),
    ],
    pitfalls: [
      n('Authentication does not establish package provenance', 'The registry can deliver the requested bytes while the selected version is still unsuitable or malicious. Retain package review, dependency scanning and lockfile review as separate controls rather than treating a private registry as a complete supply-chain guarantee.', 'upstreams', 'policies'),
      n('A role session and package token can expire differently', 'Document both expiry boundaries in CI troubleshooting. Reassuming the role does not automatically update a token already written to the package-manager configuration, and refreshing a token does not repair the wrong repository or package name.', 'tokens', 'npm'),
    ],
    sources: [
      s('tokens', 'CodeArtifact authorization tokens and role sessions', 'https://docs.aws.amazon.com/codeartifact/latest/ug/tokens-authentication.html'),
      s('npm', 'npm endpoints, login and authentication checks', 'https://docs.aws.amazon.com/codeartifact/latest/ug/npm-auth.html'),
      s('upstreams', 'CodeArtifact upstream repositories and external connections', 'https://docs.aws.amazon.com/codeartifact/latest/ug/repos-upstream.html'),
      s('policies', 'Repository policies and permission boundaries', 'https://docs.aws.amazon.com/codeartifact/latest/ug/repo-policies.html'),
    ],
  },
  {
    serviceId: 'codebuild',
    operatingModel: [
      n('The project defines the execution envelope', 'The build project selects source, environment, compute and service role; the buildspec defines commands and outputs. Keep these two layers together during review. Changing a build image or role can alter behavior even when the source commit and buildspec remain unchanged.', 'buildspec', 'role'),
      n('Artifacts are an explicit contract', 'Buildspec phases run work; artifacts and reports describe what gets retained. A passing command does not prove the output directory contains the intended application. Validate artifact contents and test reports before downstream deployment consumes them.', 'buildspec'),
      n('Network placement changes dependency access', 'A VPC build environment can reach private dependencies through its configured network. It still needs an outbound path to public package sources when those are required. CodeBuild does not solve that by assigning its VPC network interfaces public IP addresses.', 'vpc'),
    ],
    setup: [
      n('Make the build reproducible', 'Choose a supported image and runtime, commit dependency lockfiles and record the source revision. Run installation from that lockfile. Separate a deterministic package step from any deployment action so the same tested artifact can later be promoted.', 'buildspec'),
      n('Define failure behavior', 'Make tests return a nonzero exit status on failure and verify the shell does not swallow that status. Decide which cleanup commands belong in finally blocks. Read phase-level errors rather than concluding that the last line in the log is the original failure.', 'buildspec'),
      n('Provision narrow build access', 'Give the project role only its source, artifact, log and explicitly required service permissions. Keep runtime application permissions in a different role. Confirm secret retrieval access independently from permission to upload the resulting artifact.', 'role'),
      n('Exercise a cold build', 'Test with an empty cache and inspect the downloadable output. Then compare a cached run for correctness and performance. If the project needs private dependencies, verify network reachability from the build environment before tuning package-manager retries.', 'cache', 'vpc'),
    ],
    configuration: [
      c('Buildspec version and phases', 'Use a supported buildspec version and make install, test, package and cleanup boundaries explicit.', 'Commands that seem independent can share shell state in version 0.2. Treat working-directory and exported-variable changes as part of the build contract.', 'buildspec'),
      c('Cache mode', 'Choose cache contents that can be safely regenerated, and account for the documented local-cache restrictions.', 'A local cache is an optimization tied to build infrastructure, not a guaranteed artifact store. Docker layer caching requires additional considerations such as privileged mode and platform support.', 'cache'),
      c('VPC subnets and egress', 'Select subnets and security groups that can reach the exact private services and package sources required.', 'A public-subnet label does not provide internet access to the build. NAT and endpoints have different availability, permission and cost implications.', 'vpc'),
    ],
    security: [
      n('Untrusted source executes under the build role', 'A pull request can modify build scripts as well as application code. Decide which untrusted contributions may start a build with credentials, and prevent them from reaching production secrets or release permissions. Review build-role changes as security-sensitive code.', 'role', 'buildspec'),
      n('Inject secrets without publishing them', 'Use supported secret references rather than plain secret literals in build commands. Avoid echoing secret values, writing them into application bundles or including credential files in artifacts. Log masking is a secondary defense, not permission to print sensitive data.', 'buildspec', 'role'),
    ],
    example: {
      title: 'A buildspec that tests before packaging', language: 'yaml',
      code: `version: 0.2
phases:
  install:
    commands:
      - npm ci
  build:
    commands:
      - npm test -- --run
      - npm run build
artifacts:
  base-directory: dist
  files:
    - '**/*'`,
      explanation: 'This illustrative project uses a test command that supports --run and a build script producing dist. Adapt both to the actual toolchain. The image/runtime and source configuration are project settings, not supplied by this snippet. No deployment command is included.',
      checks: ['Introduce a known failing fixture and confirm that the build fails before a release artifact is accepted.', 'Inspect the artifact for the expected entry point and revision; repeat once without cache to expose hidden dependencies.'], sourceIds: ['buildspec', 'cache'],
    },
    troubleshooting: [
      t('A private build times out downloading dependencies', 'The VPC build environment has no route to the package source or its network policy blocks it.', 'Inspect DNS, subnet routes, security groups and whether the endpoint is public or private.', 'Provide the required approved egress or endpoint path; increasing the build timeout does not create connectivity.', 'vpc'),
      t('Tests fail in logs but the build is green', 'A wrapper script ignored the failing exit code or a command explicitly suppressed it.', 'Run the exact test wrapper with a deliberately failing fixture and inspect the phase status.', 'Propagate failure and require the appropriate report or artifact checks before allowing downstream release.', 'buildspec'),
      t('Only a warm-cache build passes', 'The cache contains undeclared dependencies or stale generated files.', 'Compare clean and cached output and verify the lockfile and artifact glob.', 'Declare all inputs, regenerate output and keep cache restoration optional for correctness.', 'cache', 'buildspec'),
    ],
    pitfalls: [
      n('Privileged mode is a deliberate capability', 'Do not enable it simply because an unrelated tutorial uses Docker. Review whether the selected build actually needs it and what source can run in that project. Cache speed must not become the reason untrusted code receives a stronger execution environment.', 'cache', 'role'),
      n('A green build is not a completed release', 'The project can finish while a later deployment fails or publishes a different artifact. Carry source and artifact identity into the pipeline and verify the serving application separately. Keep build, deployment and runtime evidence as distinct outcomes.', 'buildspec'),
    ],
    sources: [
      s('buildspec', 'CodeBuild phases, variables, artifacts and reports', 'https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html'),
      s('vpc', 'CodeBuild VPC networking and limitations', 'https://docs.aws.amazon.com/codebuild/latest/userguide/vpc-support.html'),
      s('cache', 'Local cache modes and restrictions', 'https://docs.aws.amazon.com/codebuild/latest/userguide/caching-local.html'),
      s('role', 'CodeBuild service-role permissions', 'https://docs.aws.amazon.com/codebuild/latest/userguide/setting-up-service-role.html'),
    ],
  },
  {
    serviceId: 'codedeploy',
    operatingModel: [
      n('The compute platform changes the release contract', 'EC2/on-premises deployments install application revisions with host lifecycle scripts. Lambda deployments shift an alias between published versions. ECS deployments use a replacement task set and traffic-routing configuration. Select the target model before reading an AppSpec example.', 'appspec'),
      n('Validation hooks are executable release gates', 'Hooks run at defined lifecycle points, with different names and execution mechanisms for each compute platform. EC2 uses scripts; Lambda and ECS use Lambda validation functions. A hook must report a meaningful result, not merely start an asynchronous check that nobody awaits.', 'hooks'),
      n('Rollback is another deployment', 'A rollback installs a previously deployed revision through a new deployment with its own ID and possible errors. It can restore code or traffic selection, but it does not reverse every database migration or external side effect performed by the failed version.', 'rollback'),
    ],
    setup: [
      n('Define the revision and target', 'Record the application, compute platform, deployment group and immutable candidate revision. Verify that the AppSpec structure matches that platform. For EC2, validate the file location and name in the revision bundle instead of assuming the deployment system will discover it anywhere.', 'appspec'),
      n('Choose useful lifecycle validation', 'Place readiness checks at the point where the candidate can actually be exercised. For traffic-shifting deployments, validate the candidate path rather than sending every test to the old version. Give validation functions only the access required to inspect and report their result.', 'hooks'),
      n('Connect observable rollback conditions', 'Create alarms that reflect customer-visible errors or latency, then associate them with the deployment group. Review what happens when alarm status cannot be retrieved. Configure automatic rollback explicitly and rehearse the trigger in a non-production environment.', 'alarms'),
      n('Rehearse incompatible-change recovery', 'Deploy a synthetic faulty revision, inspect the failed deployment and follow the rollback deployment to completion. Confirm which revision serves requests afterward. Test data compatibility across both versions so restoring code does not create a second failure.', 'rollback', 'hooks'),
    ],
    configuration: [
      c('AppSpec resource target', 'For Lambda, specify the function, alias and current/target versions; for ECS, specify the task definition and traffic target details.', 'A correctly formatted file can still reference the wrong application. Compare the target identifiers with the intended deployment group before release.', 'appspec'),
      c('Hook location and completion deadline', 'Use the lifecycle event appropriate to the platform. EC2 script timeouts and Lambda function timeouts are distinct from the CodeDeploy validation callback deadline.', 'For Lambda validation hooks, CodeDeploy fails the hook if it receives no result within one hour. A successful function invocation without the required callback does not complete the hook.', 'hooks'),
      c('Alarm and automatic rollback options', 'Choose which failures stop a deployment and which initiate a rollback, including behavior when alarm polling fails.', 'Stopping and restoring are different actions. The presence of a CloudWatch alarm alone does not establish that a previous revision will be redeployed.', 'alarms', 'rollback'),
    ],
    security: [
      n('Deployment permissions and application permissions differ', 'Separate the identity that orchestrates a deployment from the permissions used by the deployed application and validation hook. Review access to artifacts and target resources at each boundary, rather than making the runtime role powerful enough to perform deployment administration.', 'appspec', 'hooks'),
      n('Treat lifecycle scripts as privileged release code', 'A host hook may modify the serving environment, while a validation Lambda can access its own configured resources. Review scripts, artifact provenance and hook execution identity together. Do not place credentials or secret values directly in an AppSpec bundle.', 'hooks'),
    ],
    example: {
      title: 'Lambda AppSpec targeting a published version', language: 'yaml',
      code: `version: 0.0
Resources:
  - OrderFunction:
      Type: AWS::Lambda::Function
      Properties:
        Name: example-order-handler
        Alias: live
        CurrentVersion: '7'
        TargetVersion: '8'
Hooks:
  - BeforeAllowTraffic: example-validate-candidate`,
      explanation: 'The names and versions are illustrative and must exist in the deployment account. The deployment group selects traffic shifting. After checking the candidate, the validation function must call PutLifecycleEventHookExecutionStatus with the incoming DeploymentId and LifecycleEventHookExecutionId and a Succeeded or Failed status. This YAML does not implement that callback; CodeDeploy fails the hook if no result arrives within one hour.',
      checks: ['Confirm that the live alias initially resolves to version 7 and that the validation code explicitly tests candidate version 8.', 'In a rehearsal, a failed validation prevents acceptance of the candidate, and the deployment/rollback records explain the final alias state.'], sourceIds: ['appspec', 'appspec-example', 'hooks', 'rollback'],
    },
    troubleshooting: [
      t('The deployment never reaches traffic shifting', 'The target revision or an earlier lifecycle hook is invalid.', 'Inspect the first failed lifecycle event and compare its AppSpec fields with the compute platform.', 'Repair the target or hook and create a traceable deployment of the corrected revision.', 'appspec', 'hooks'),
      t('Validation Lambda ran but the hook timed out', 'The validation function did not report the lifecycle outcome correctly.', 'Correlate its logs with the deployment ID and hook execution ID.', 'Implement the expected success/failure callback and test both paths without relying on an invocation-success status.', 'hooks'),
      t('An alarm stopped the release but old behavior did not return', 'Automatic rollback was not configured, failed, or restored code while data remained incompatible.', 'Inspect rollback settings, new deployment IDs and the actual serving revision.', 'Complete recovery with a known compatible revision and address database or external effects separately.', 'alarms', 'rollback'),
    ],
    pitfalls: [
      n('Do not reuse hooks across platforms blindly', 'A host script lifecycle event is not interchangeable with a Lambda validation event. Read the platform-specific AppSpec and hook sequence, especially when moving a service from EC2 to ECS or Lambda.', 'appspec', 'hooks'),
      n('A rollback label is not recovery evidence', 'Verify the new rollback deployment and serving traffic. Preserve the failed candidate evidence before cleanup so an apparently successful restoration does not erase the information needed to diagnose the original release.', 'rollback'),
    ],
    sources: [
      s('appspec', 'Platform-specific CodeDeploy AppSpec contract', 'https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file.html'),
      s('appspec-example', 'Complete Lambda AppSpec example and field casing', 'https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-example.html'),
      s('hooks', 'Lifecycle hooks and validation callbacks', 'https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html'),
      s('rollback', 'Rollback creates a new deployment', 'https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html'),
      s('alarms', 'Deployment-group alarms and rollback options', 'https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-groups-configure-advanced-options.html'),
    ],
  },
  {
    serviceId: 'codepipeline',
    operatingModel: [
      n('An execution carries a release candidate', 'A pipeline definition describes stages and actions; an execution is a particular run through that definition. Trace the source revision, action execution and artifact together. Two green actions from different executions do not prove that one coherent candidate passed the complete release process.', 'concepts'),
      n('Artifact names connect actions', 'An action receives named input artifacts and may produce output artifacts consumed later. Those names describe a flow, not merely labels in a diagram. A deployment that reads SourceOutput while tests validate BuildOutput can bypass the packaged application that was actually tested.', 'concepts'),
      n('Concurrency is a release policy', 'SUPERSEDED, QUEUED and PARALLEL modes behave differently. QUEUED and PARALLEL require V2 pipelines; parallel executions can overlap independent runs. The current documentation excludes stage rollback and rollback failure conditions in PARALLEL mode, so choose mode alongside the recovery plan.', 'execution'),
    ],
    setup: [
      n('Name a single candidate', 'Start with an immutable source revision and define which build output is the releasable artifact. Include a revision marker or manifest in that output. Require downstream test and deploy actions to refer to that same output rather than rebuilding implicitly.', 'concepts'),
      n('Map action permissions', 'List the pipeline service role, any action roles and the roles used inside CodeBuild or deployment services. Verify artifact storage and encryption access across accounts. A pipeline-level permission does not automatically grant every downstream process access to the same resource.', 'iam'),
      n('Design approval evidence', 'Place a manual approval after the checks a reviewer needs and provide an execution-specific review URL. The approver should identify the candidate, its tests and intended target. A notification is only a request for review; it is not the approval record.', 'approval'),
      n('Rehearse two close commits', 'Trigger two synthetic revisions close together in a test pipeline. Observe which waits, supersedes or overlaps according to the selected mode. Confirm the eventual production candidate and recovery behavior before enabling the normal source trigger.', 'execution'),
    ],
    configuration: [
      c('Pipeline type and execution mode', 'Choose V2 when the release needs QUEUED or PARALLEL execution, and document the consequences for rollback.', 'Serial release intent is not enforced merely by drawing actions in order. Parallel runs can still deploy to the same external target unless the delivery design prevents it.', 'execution'),
      c('Action runOrder and artifact wiring', 'Use ordering and named input/output artifacts to express actual dependencies within and between stages.', 'Parallel actions can shorten feedback time, but a dependent action must not consume an unrelated artifact or assume another action has already completed.', 'concepts'),
      c('Approval notification and timeout', 'Use an SNS topic in the pipeline Region and define who may approve or reject the action.', 'The action fails if approval is rejected or not supplied within its documented window. Build an escalation path instead of assuming a paused release waits indefinitely.', 'approval'),
    ],
    security: [
      n('Separate who can release from what can deploy', 'Restrict pipeline edits, execution control and approval to the intended identities. Scope service and action roles to required artifacts and targets. Someone who can modify a pipeline with a powerful role can affect what that role is instructed to do.', 'iam'),
      n('Review the artifact boundary across accounts', 'For cross-account delivery, check both IAM and the artifact bucket/key permissions used by the participating action. Keep credentials out of artifacts and variables. Diagnose denied artifact reads at their real boundary rather than granting broad permissions to every role.', 'iam', 'concepts'),
    ],
    example: {
      title: 'An artifact lineage review before approval', language: 'text',
      code: `Execution: candidate-42
Source revision: reviewed commit A
Source action -> SourceOutput
Build action: SourceOutput -> BuildOutput
Test action: BuildOutput -> test evidence for A
Approval: candidate-42 + test evidence + preview URL
Deploy action: BuildOutput -> staging application
Verification: serving revision A`,
      explanation: 'This is a release-review worksheet, not a pipeline JSON definition. Fill it with the actual execution and artifact identifiers. Its purpose is to reveal a common wiring mistake: approving one candidate while deploying a source archive or a later rebuild.',
      checks: ['Follow every artifact name through the actual execution and confirm the tested artifact is the deployment input.', 'Start another execution during approval and verify the configured mode does not silently change the candidate being reviewed.'], sourceIds: ['concepts', 'execution', 'approval'],
    },
    troubleshooting: [
      t('The wrong revision is deployed after approval', 'Artifact wiring or concurrent execution behavior differs from the assumed release flow.', 'Compare source revisions and action execution IDs within the approved execution.', 'Correct artifact inputs and execution policy, then repeat with two distinguishable synthetic revisions.', 'concepts', 'execution'),
      t('A deployment action cannot read its input', 'The action identity lacks bucket or encryption-key access to the artifact location.', 'Inspect the failed action role, artifact location and corresponding resource permissions.', 'Repair the specific cross-service or cross-account permission and rerun the affected candidate.', 'iam'),
      t('Approval notifications arrive but the pipeline fails later', 'Nobody supplied a valid approval outcome before the action expired, or the action was rejected.', 'Inspect the manual approval action state rather than the SNS delivery status.', 'Assign an approver and escalation window, and restart only after confirming that the candidate remains current.', 'approval'),
    ],
    pitfalls: [
      n('Disabling a transition is not a durable FIFO queue', 'In superseded flow, waiting executions can be overtaken while a stage transition is disabled. If every candidate must be processed in order, choose and test a suitable execution mode rather than relying on a paused transition.', 'concepts', 'execution'),
      n('Pipeline rollback does not undo every side effect', 'Review the action providers and target recovery behavior. Application data changes and external actions may require separate reconciliation even when an earlier artifact can be redeployed successfully.', 'execution'),
    ],
    sources: [
      s('concepts', 'CodePipeline executions, actions and artifacts', 'https://docs.aws.amazon.com/codepipeline/latest/userguide/concepts.html'),
      s('execution', 'Execution modes, concurrency and rollback constraints', 'https://docs.aws.amazon.com/codepipeline/latest/userguide/concepts-how-it-works.html'),
      s('approval', 'Manual approval behavior and notifications', 'https://docs.aws.amazon.com/codepipeline/latest/userguide/approvals.html'),
      s('iam', 'Pipeline identity and role boundaries', 'https://docs.aws.amazon.com/codepipeline/latest/userguide/security-iam.html'),
    ],
  },
  {
    serviceId: 'xray',
    operatingModel: [
      n('A trace is a connected timing record', 'Participating components emit timed work that X-Ray groups by trace identity. Parent-child relationships distinguish work performed by the application from calls to dependencies. A service-map edge without detailed instrumentation is not equivalent to a complete explanation of the remote operation.', 'concepts'),
      n('Sampling defines the evidence available', 'Sampling controls which requests are recorded. A low-volume incident may have few examples, and a missing trace can mean the request was not sampled. Use logs and metrics alongside traces; never treat an empty trace search as proof that no request or error occurred.', 'sampling'),
      n('Instrumentation lifecycle differs from service lifecycle', 'The X-Ray SDKs and daemon entered maintenance mode on February 25, 2026, with security-focused releases and no new feature enhancements. AWS recommends OpenTelemetry-based instrumentation. This notice concerns instrumentation components, not an announced shutdown of the X-Ray service.', 'timeline', 'migration'),
    ],
    setup: [
      n('Choose one request boundary', 'Start with a request path that crosses an application and a dependency. Name the service consistently and record a safe correlation identifier. Define the investigation question first, such as whether checkout latency comes from application work or the payment dependency.', 'concepts'),
      n('Instrument with a supported OTel path', 'Select the OpenTelemetry distribution or collector integration appropriate to the runtime. Confirm incoming-request instrumentation, outgoing client instrumentation and export configuration separately. The collector receiving telemetry is an intermediate step, not proof that X-Ray received and assembled it.', 'migration'),
      n('Make propagation explicit', 'Trace a request through HTTP boundaries and asynchronous handoffs where supported. Compare the parent and child trace identities at any gap. Avoid inventing parentage for unrelated work merely to make the service map look continuous.', 'concepts', 'migration'),
      n('Validate sampling with a synthetic request', 'Use a controlled request and inspect the relevant sampling rule behavior. Verify a healthy response, an application error and a slow dependency. Keep the expected trace shape as evidence for future instrumentation changes.', 'sampling'),
    ],
    configuration: [
      c('Central sampling criteria', 'Choose rules matching the intended service and request categories, and verify that the instrumentation supports centralized sampling.', 'A local per-instance reservoir can produce a different overall sample rate as instances scale. Record which component owns sampling rather than assuming every SDK uses identical rules.', 'sampling'),
      c('Indexed annotations versus metadata', 'Use a small set of safe, useful dimensions for indexed annotations and keep additional diagnostic context in appropriate metadata.', 'High-cardinality identifiers and sensitive values make telemetry harder to govern. Trace attributes are an observability design, not a place to copy the full request.', 'concepts'),
      c('Collector/exporter migration', 'Map legacy segment concepts, propagation and sampling to the chosen OpenTelemetry instrumentation.', 'Running overlapping instrumentation can duplicate spans or change topology. Migrate one measured path and compare traces before removing the old components.', 'migration'),
    ],
    security: [
      n('Collect the minimum diagnostic context', 'Do not record tokens, credentials, request bodies or personal details simply because the instrumentation can capture them. Review exception messages and attributes too. A safe correlation ID can connect evidence without turning tracing into a copy of the business payload.', 'concepts'),
      n('Separate telemetry export from telemetry reading', 'Give the workload or collector the required export permissions and grant trace investigation access to the appropriate operators. Review migration configuration so a debug exporter or new collector destination does not send application context somewhere unintended.', 'migration'),
    ],
    example: {
      title: 'A trace shape to test during migration', language: 'text',
      code: `Synthetic request: GET /checkout/preview
checkout-api server span
  validate-cart internal span
  inventory HTTP client span
    inventory-api server span
  totals internal span

Record: status, durations, safe request ID
Exclude: authorization header, payment details
Verify: parent linkage and error status`,
      explanation: 'This is an instrumentation acceptance sketch, not an X-Ray segment document. Implement the spans with the supported OpenTelemetry libraries for the application. Use it to compare legacy and migrated tracing without requiring every production request to be sampled.',
      checks: ['A controlled inventory delay appears in the inventory client/server span path rather than only as unexplained parent duration.', 'An error carries useful status and correlation evidence without exposing sensitive request fields.'], sourceIds: ['concepts', 'migration', 'sampling'],
    },
    troubleshooting: [
      t('A request has no visible trace', 'It was not sampled, export failed, or the investigation is using the wrong Region/time interval.', 'Check sampling and exporter evidence before changing application logic.', 'Repair the actual instrumentation/export boundary and validate with a controlled sampled request.', 'sampling', 'migration'),
      t('The service map has a disconnected component', 'Trace context was not propagated or was replaced at an integration boundary.', 'Compare trace and parent identifiers on both sides of the handoff.', 'Use the supported propagation integration and retest the same request path.', 'concepts', 'migration'),
      t('Trace volume rises after scaling the application', 'Local sampling reservoirs are being applied independently by multiple instances.', 'Compare local sampling configuration with centralized rule behavior and instance count.', 'Use an appropriate centralized strategy or account for per-instance sampling deliberately.', 'sampling'),
    ],
    pitfalls: [
      n('Do not confuse maintenance with service retirement', 'The published timeline limits SDK/daemon development. Keep existing service support decisions and instrumentation migration plans separate, and avoid telling users that all X-Ray traces or APIs disappear because an SDK entered maintenance.', 'timeline'),
      n('A trace explains observations, not business truth', 'A successful downstream span can coexist with an application-level rejection or a later compensation. Confirm durable business state before replaying work; traces alone are not a transaction ledger.', 'concepts'),
    ],
    sources: [
      s('concepts', 'X-Ray segments, traces, annotations and errors', 'https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html'),
      s('sampling', 'Central and local sampling behavior', 'https://docs.aws.amazon.com/xray/latest/devguide/xray-console-sampling.html'),
      s('migration', 'Migrating X-Ray instrumentation to OpenTelemetry', 'https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-migration.html'),
      s('timeline', 'X-Ray SDK and daemon maintenance timeline', 'https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-daemon-timeline.html'),
    ],
  },
  {
    serviceId: 'q-developer',
    operatingModel: [
      n('A development assistant uses selected context', 'Q Developer can explain and propose changes using the context available in its current surface. A confident answer does not prove it inspected the right repository, branch or AWS account. Ask for the specific files or resource evidence supporting a recommendation.', 'overview', 'context'),
      n('Context selection is part of correctness', 'Explicit file, folder and code context helps bound a task. The workspace-context page now marks @workspace as deprecated and directs users to explicit alternatives. Inspect the response context list rather than assuming that every relevant file was included automatically.', 'context', 'workspace'),
      n('IDE plugin support has a dated boundary', 'AWS announces support ending for Q Developer IDE plugins on April 30, 2027 and points users toward Kiro for similar capabilities. This is a plugin-specific notice. It does not state that every Q Developer capability or AWS console integration ends on that date.', 'lifecycle', 'overview'),
    ],
    setup: [
      n('Select the actual product surface', 'Identify whether the task uses an IDE plugin or an AWS application/website integration, then verify the appropriate sign-in and permissions. Keep the Q Developer task separate from Amazon Quick business workflows and from a custom Bedrock inference application.', 'overview'),
      n('Give a bounded change request', 'Include the failing behavior, expected result, relevant files and an example input. State which externally visible behavior should remain stable. Ask the assistant to explain its assumptions before broad changes so missing context is visible during review.', 'context'),
      n('Review data handling before adding context', 'Check the organization subscription, data-protection settings and which source material is allowed to be sent. Remove credentials and customer payloads from examples. A file being local to the developer machine does not make its content appropriate for every assistant workflow.', 'data'),
      n('Verify the proposed diff independently', 'Inspect changed code, dependencies and configuration, then run a regression that reproduces the original problem. Review any code reference information associated with suggestions. A generated test that only repeats the new implementation does not validate the user-facing requirement.', 'references', 'context'),
    ],
    configuration: [
      c('Explicit context selection', 'Attach the smallest useful set of files, folders or symbols and inspect what the response actually used.', 'Too little context encourages incorrect assumptions; indiscriminately adding the repository increases noise and may expose unrelated sensitive material.', 'context', 'workspace'),
      c('Reference handling', 'Review source-reference information for suggestions similar to public code and apply the repository licensing policy.', 'Suppressing suggestions with references changes what is offered, but the absence of a reference is not a complete originality or license audit.', 'references'),
      c('Plugin lifecycle planning', 'For an existing IDE deployment, track the April 30, 2027 support boundary and evaluate a migration before it becomes urgent.', 'Do not translate an IDE notice into a universal product shutdown or assume all replacement surfaces have identical permission and context behavior.', 'lifecycle'),
    ],
    security: [
      n('Context access is a data decision', 'Apply the organization data-protection policy to prompts, source code and diagnostic logs. Check the settings and subscription in use instead of assuming every Q Developer plan handles customer content identically. Synthetic fixtures usually communicate a bug without exposing real records.', 'data'),
      n('Generated code still needs application authorization', 'Review proposed IAM policies, SQL queries, network rules and tool calls as ordinary security-sensitive changes. The assistant describing an operation as safe is not evidence that the operation is authorized for the current end user or production environment.', 'security', 'overview'),
    ],
    example: {
      title: 'A reviewable request for an idempotency fix', language: 'text',
      code: `Context: order-handler.ts and order-handler.test.ts
Observed: retrying the same operation ID inserts two orders.
Required: return the existing result for a completed operation.
Preserve: authorization and validation errors.
Please identify the race boundary, propose a small change,
and add a test with concurrent requests for the same ID.
Do not replace the database adapter or broaden IAM access.`,
      explanation: 'This prompt is an original example of a bounded development task, not a product command or a guarantee of the resulting implementation. Attach the actual relevant code with supported context controls, then review whether the proposed test truly exercises concurrent execution.',
      checks: ['The regression fails against the original implementation and passes after the fix without relaxing its assertions.', 'The diff preserves ownership checks and handles an uncertain write outcome rather than merely suppressing duplicate error messages.'], sourceIds: ['context', 'security'],
    },
    troubleshooting: [
      t('The answer references nonexistent files or functions', 'The assistant lacks current context or inferred a structure from a different task.', 'Inspect the selected context and response context list against the current branch.', 'Supply the exact files/symbols and ask for a corrected proposal before applying edits.', 'context'),
      t('The team cannot find @workspace behavior from an older tutorial', 'The workspace feature has been deprecated in the current documentation.', 'Read the current workspace notice and the available context picker.', 'Use explicit file, folder or code context and update the team workflow.', 'workspace'),
      t('A suggestion includes a code reference the team did not expect', 'The generated recommendation resembles publicly available code.', 'Open the reference information and compare the source/license with repository policy.', 'Review, rewrite or exclude the suggestion through the supported controls as appropriate.', 'references'),
    ],
    pitfalls: [
      n('Passing generated tests is limited evidence', 'A test can agree with a faulty implementation because both were produced from the same mistaken assumption. Include independently chosen boundary inputs, failure cases and concurrency behavior that come from the requirement rather than the generated code.', 'context', 'security'),
      n('A console answer is not a deployed change', 'Distinguish an explanation, a proposed command and an operation actually executed under an authorized identity. Verify the target state through the relevant service before recording the task as complete.', 'overview'),
    ],
    sources: [
      s('overview', 'Q Developer capabilities and access surfaces', 'https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/what-is.html'),
      s('context', 'Explicit and automatic IDE context', 'https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/ide-chat-context.html'),
      s('workspace', 'Workspace-context deprecation notice', 'https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/workspace-context.html'),
      s('references', 'Code-reference information and controls', 'https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/code-reference.html'),
      s('data', 'Q Developer data-protection considerations', 'https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/data-protection.html'),
      s('security', 'Shared security responsibilities for Q Developer', 'https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/security.html'),
      s('lifecycle', 'IDE plugin support ends April 30, 2027', 'https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/q-developer-ide-end-of-support.html'),
    ],
  },
  {
    serviceId: 'appconfig',
    operatingModel: [
      n('A saved version is not yet deployed behavior', 'An application groups configuration profiles and environments. A profile defines the configuration source and validation; a deployment releases a selected version into an environment using a strategy. The application must retrieve and apply that configuration before user-visible behavior changes.', 'strategy', 'agent'),
      n('Validation and observation catch different failures', 'A validator can reject malformed or semantically invalid input before release. It cannot prove that the configuration improves live business outcomes. A monitored rollout adds observation and rollback based on configured alarms, covering failures a schema cannot express.', 'validators', 'setup'),
      n('Clients usually read a local cache', 'AppConfig Agent retrieves configuration using its IAM identity, caches it locally and polls for updates. The application reads the agent endpoint. This reduces repeated data-plane calls, but a first fetch, stale cache or disconnected network still needs explicit application behavior.', 'agent'),
    ],
    setup: [
      n('Define the configuration contract', 'Specify allowed keys, types, ranges and the application behavior when a key is missing. Choose free-form configuration or feature flags deliberately. Use a JSON Schema for free-form structural checks and a Lambda validator when additional semantic checks are required.', 'validators'),
      n('Separate deployment environments', 'Create environment-specific monitoring and release ownership. Confirm the application requests the intended application, environment and profile identifiers. A correct configuration in staging does not help a client polling a production profile by mistake.', 'strategy', 'agent'),
      n('Choose meaningful rollout alarms', 'Select a metric that changes when the configuration harms users, and give AppConfig the required permission to inspect it. Test a known failing configuration and confirm rollback rather than only checking that an alarm exists in the console.', 'setup'),
      n('Test cached and first-fetch behavior', 'Start the application without a warm cache, then repeat with an existing configuration while the network is unavailable. Define safe defaults or startup failure behavior according to the business requirement. Measure propagation using the version actually read by the client.', 'agent'),
    ],
    configuration: [
      c('Validator type', 'Use JSON Schema for free-form shape/range checks and Lambda for additional semantics; feature flags have their own built-in schema validation.', 'Schema-valid does not mean operationally safe. A Lambda validator also needs correct invocation permissions and must fail explicitly when validation fails.', 'validators'),
      c('Growth and deployment duration', 'Choose linear or exponential gradual rollout appropriate to the blast radius and observation time.', 'A fast rollout reduces waiting but provides less evidence before broader exposure. Deployment duration is a rollout window, not the application request timeout.', 'strategy'),
      c('Bake time and client polling', 'Allow a post-rollout observation window and understand the agent polling cadence.', 'A deployment can reach all targets before its final monitoring period ends. Client cache refresh timing means the control-plane state is not a precise timestamp for every user seeing the value.', 'strategy', 'agent'),
    ],
    security: [
      n('Separate configuration writers from readers', 'Restrict who can create versions and start deployments. Give the application or agent only the data-retrieval access needed for its configuration. A feature flag can change authorization-sensitive behavior, so it deserves change review even without a code deployment.', 'setup', 'agent'),
      n('Keep monitoring and validation permissions narrow', 'Review the validator invocation permission and the role AppConfig uses for alarm-based rollback. Do not embed secret credentials in ordinary feature settings; validate and log configuration identifiers without dumping sensitive values into deployment diagnostics.', 'validators', 'setup'),
    ],
    example: {
      title: 'A free-form schema for a bounded retry setting', language: 'json',
      code: `{
  "type": "object",
  "required": ["retryLimit", "checkoutEnabled"],
  "additionalProperties": false,
  "properties": {
    "retryLimit": {"type": "integer", "minimum": 0, "maximum": 4},
    "checkoutEnabled": {"type": "boolean"}
  }
}`,
      explanation: 'This illustrative JSON Schema validates an application-owned free-form configuration. The retry range is a design choice for this example, not an AWS quota or recommended universal value. The consuming code must still implement bounded retries and authorize checkout operations correctly.',
      checks: ['Reject a string retryLimit, an out-of-range value and an unexpected key before deployment.', 'Deploy a schema-valid but deliberately harmful test value and confirm the configured alarm/rollback path detects the operational problem.'], sourceIds: ['validators', 'setup'],
    },
    troubleshooting: [
      t('The deployment completed but the application uses old values', 'The client reads a different profile/environment or has not refreshed its cached configuration.', 'Inspect the retrieval identifiers and the version observed at the application boundary.', 'Correct the lookup and polling integration; avoid repeatedly creating identical configuration versions.', 'agent', 'strategy'),
      t('A bad configuration passes validation', 'The validator checks syntax but not the business constraint that was violated.', 'Reproduce the bad input against the actual registered validator.', 'Add the missing semantic check and retain live rollout monitoring for failures that cannot be predicted offline.', 'validators', 'setup'),
      t('An alarm fires without the expected rollback', 'The alarm is not associated correctly, permissions are missing, or the event falls outside the monitored deployment period.', 'Compare deployment timeline, bake time, alarm configuration and role permissions.', 'Repair the monitoring integration and rehearse rollback with a controlled failing release.', 'setup', 'strategy'),
    ],
    pitfalls: [
      n('A feature flag is not an authorization policy', 'Use flags to control rollout or product behavior, while retaining server-side identity and ownership checks. A disabled interface element or a stale local flag does not prevent a caller from sending the underlying API request.', 'agent', 'validators'),
      n('Agent caching is not permanent offline configuration', 'The first request must obtain usable configuration, and a cached value has freshness implications. Define startup and outage behavior explicitly instead of interpreting local caching as an unlimited availability or consistency promise.', 'agent'),
    ],
    sources: [
      s('validators', 'JSON Schema and Lambda validation contracts', 'https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-configuration-and-profile-validators.html'),
      s('strategy', 'Gradual rollout, growth and bake time', 'https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-deployment-strategy.html'),
      s('setup', 'AppConfig permissions and automatic rollback setup', 'https://docs.aws.amazon.com/appconfig/latest/userguide/setting-up-appconfig.html'),
      s('agent', 'Agent cache, polling and first retrieval', 'https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-agent.html'),
    ],
  },
  {
    serviceId: 'cdk',
    operatingModel: [
      n('Application code synthesizes infrastructure declarations', 'A CDK app builds a construct tree, then synthesis produces a cloud assembly containing CloudFormation templates and assets. The programming language describes infrastructure; it is not the runtime of the deployed application. Review the generated resources as well as the source abstraction.', 'constructs', 'practices'),
      n('Construct levels trade convenience for explicit detail', 'L1 constructs map closely to CloudFormation resources, while higher-level constructs supply defaults and helper APIs. A small amount of source can therefore create several resources or permissions. Use the level that fits the need, then inspect what it synthesizes.', 'constructs'),
      n('Bootstrap resources support deployment', 'A target account/Region environment needs bootstrap resources such as asset storage and deployment roles. Bootstrapping is itself a CloudFormation deployment. An app synthesizing successfully on a laptop does not establish that the target environment is bootstrapped or that the caller may deploy there.', 'bootstrap'),
    ],
    setup: [
      n('Make the target environment explicit', 'Record the intended account, Region and stack ownership. Keep development and production deployment identities distinct. Confirm the bootstrap configuration and trust model for every target rather than assuming one bootstrap action prepares all accounts and Regions.', 'bootstrap'),
      n('Pin the infrastructure inputs', 'Commit dependency lockfiles and review context values used by lookups. Keep cached environment context under version control when required for reproducible synthesis. Updating a lookup can change the proposed infrastructure even when the main construct code barely changes.', 'context', 'practices'),
      n('Inspect the synthesized change', 'Run synthesis and inspect the resulting resource types, policies and lifecycle attributes. Compare the intended change before deployment, particularly replacements of stateful resources. Unit assertions on templates complement a diff; neither proves runtime behavior in the target account.', 'practices'),
      n('Exercise removal and recovery decisions', 'Decide how stateful resources should behave when removed or replaced. Document retained-resource ownership, backups and migration steps. Keep application release tests separate from infrastructure synthesis so a valid template is not mistaken for a working application.', 'practices'),
    ],
    configuration: [
      c('Construct identity and logical IDs', 'Keep construct paths stable when refactoring resources that should retain their identity.', 'A seemingly cosmetic refactor can alter generated logical IDs and propose replacement. Review the synthesized diff instead of judging risk only by the source-line count.', 'practices'),
      c('Context lookup cache', 'Review cdk.context.json changes deliberately and use the CDK context commands to refresh managed cached values.', 'Refreshing all context can introduce unrelated infrastructure changes. Manually editing cached lookup values can obscure their provenance and intended environment.', 'context'),
      c('Bootstrap permissions and trust', 'Choose bootstrap roles and trusted deployment identities appropriate to the organization.', 'A convenient shared deployment path can grant more authority than a single application needs. Treat bootstrap customization as infrastructure security work, not a one-time prerequisite to ignore.', 'bootstrap'),
    ],
    security: [
      n('Read generated IAM policies', 'Higher-level grant helpers reduce boilerplate but still produce real permissions. Inspect resource scope and the identity receiving access. Review custom and third-party constructs as code that runs during synthesis and can generate resources beyond their short public API.', 'constructs', 'practices'),
      n('Separate synthesis credentials from runtime secrets', 'Do not place secrets in context files, source or synthesized templates. Limit the credentials available to a synthesis process, especially for untrusted contributions. A language program can run arbitrary local code before it produces a CloudFormation template.', 'context', 'practices'),
    ],
    example: {
      title: 'A small CDK app with explicit data-retention intent', language: 'javascript',
      code: `import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import { Bucket, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';

const app = new App();
const stack = new Stack(app, 'ExampleArchive');
new Bucket(stack, 'Records', {
  blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
  versioned: true,
  removalPolicy: RemovalPolicy.RETAIN,
});
app.synth();`,
      explanation: 'This illustrative app declares a private, versioned bucket and expresses retention intent. It does not configure the deployment account, bootstrap resources, application permissions or backup/recovery policy. Inspect the synthesized template before any separately authorized deployment.',
      checks: ['The template contains the expected bucket, public-access settings and retention-related lifecycle attributes.', 'Renaming or moving the construct in a trial refactor is reviewed for logical-ID and replacement changes rather than accepted as a cosmetic edit.'], sourceIds: ['constructs', 'bucket-api', 'practices', 'bootstrap'],
    },
    troubleshooting: [
      t('Synthesis works but asset publication fails', 'The target environment bootstrap resources or deployment permissions are missing or mismatched.', 'Check the actual account/Region, bootstrap stack and asset publishing role.', 'Repair the intended bootstrap or role configuration instead of deploying to a different account by accident.', 'bootstrap'),
      t('The same code synthesizes an unexpected infrastructure change', 'Dependencies or cached lookup context changed.', 'Compare the lockfile, context file and generated assembly with the prior revision.', 'Review the new inputs explicitly and isolate unrelated context refreshes from the application change.', 'context', 'practices'),
      t('A refactor proposes replacing a database or bucket', 'The construct path or logical identity changed, or a replacement-requiring property changed.', 'Inspect the synthesized logical IDs and resource-level diff.', 'Preserve identity where appropriate or design an explicit data migration before executing the change.', 'practices'),
    ],
    pitfalls: [
      n('High-level defaults are still design decisions', 'A construct can choose behavior that is reasonable in general but wrong for the application lifecycle. Review networking, encryption, retention and permission output instead of assuming that a concise API call expresses every production requirement.', 'constructs'),
      n('Retained resources need an owner', 'Retention prevents automatic removal in the applicable lifecycle, but does not eliminate cost or establish a recovery process. Track retained resources and define how they are reused, imported or deliberately removed later.', 'practices'),
    ],
    sources: [
      s('constructs', 'Construct levels and generated resources', 'https://docs.aws.amazon.com/cdk/v2/guide/constructs.html'),
      s('bucket-api', 'Bucket construct properties and retention example', 'https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.Bucket.html'),
      s('bootstrap', 'Account/Region bootstrapping and deployment resources', 'https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html'),
      s('context', 'Cached lookup context and reproducible synthesis', 'https://docs.aws.amazon.com/cdk/v2/guide/context.html'),
      s('practices', 'CDK lifecycle, identity and application practices', 'https://docs.aws.amazon.com/cdk/v2/guide/best-practices.html'),
    ],
  },
  {
    serviceId: 'cloudformation',
    operatingModel: [
      n('A stack tracks declared resource identity', 'CloudFormation compares a desired template and parameters with the managed stack, then performs resource operations. Resource logical IDs are part of that identity. A change that looks small in YAML can replace a physical resource, so review resource-level effects rather than the number of edited lines.', 'changesets'),
      n('Change sets describe a proposal before execution', 'A change set shows additions, modifications, deletions and replacement implications before they are applied. Current pre-deployment validation can catch several common failures, but a successfully created change set still does not guarantee that runtime resource operations or custom logic will succeed.', 'changesets'),
      n('Declared state and observed state can diverge', 'Drift detection compares supported managed resources with the expected template configuration. It reports differences; it is not an automatic repair operation or a universal audit of every resource property. Review unsupported resources and unchecked details separately.', 'drift'),
    ],
    setup: [
      n('Identify stateful resources first', 'List resources containing data, their owners and recovery requirements. Decide what should happen when they are removed from the template, the stack is deleted or a property update requires replacement. These are different lifecycle events with different protection settings.', 'deletion', 'replacement'),
      n('Choose the execution role', 'Create a service role scoped to the stack needs and review who may operate that stack. Supplying a role changes the authority CloudFormation uses for later operations, so inspect stack-operation permissions and role permissions together.', 'role'),
      n('Review a change set', 'Create a candidate from the exact template and parameters intended for the release. Inspect replacements and removals, then link those changes to backup or migration plans. Keep review evidence tied to that candidate rather than a template edited after approval.', 'changesets'),
      n('Observe execution and reconcile drift', 'After an authorized execution, inspect stack events and physical resource outcomes. For ongoing maintenance, run drift detection and decide whether to restore declared intent or intentionally update it. Do not blindly overwrite an emergency change without understanding why it was made.', 'drift', 'changesets'),
    ],
    configuration: [
      c('DeletionPolicy', 'Choose Retain or supported Snapshot behavior when data must survive stack deletion or removal from the template.', 'Retained resources leave stack management and can continue to incur charges. DeletionPolicy alone does not govern the old physical resource during an update replacement.', 'deletion'),
      c('UpdateReplacePolicy', 'Set an explicit policy for the old physical resource when an update replaces it.', 'Retaining the old resource supports recovery but does not migrate its data into the replacement. Confirm that the new application points to the intended resource.', 'replacement'),
      c('Service role association', 'Associate a least-privilege role and restrict who can perform operations on the stack.', 'Once associated, the role is used for stack operations; users who can operate the stack can use that authority even without separately passing the role again.', 'role'),
    ],
    security: [
      n('Stack access can expose role authority', 'Review cloudformation operation permissions together with the associated service role. A user unable to call an underlying service directly may still cause CloudFormation to act through that role. Scope both the operator and role instead of relying only on iam:PassRole checks.', 'role'),
      n('Treat template changes as executable infrastructure intent', 'Review resource policies, custom resources and changes to identity boundaries before execution. A change-set preview helps identify impact but does not establish that the intended design is secure. Keep sensitive values out of ordinary outputs and review material.', 'changesets', 'role'),
    ],
    example: {
      title: 'Separate removal and replacement retention', language: 'yaml',
      code: `AWSTemplateFormatVersion: '2010-09-09'
Resources:
  RecordsBucket:
    Type: AWS::S3::Bucket
    DeletionPolicy: Retain
    UpdateReplacePolicy: Retain
    Properties:
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        IgnorePublicAcls: true
        BlockPublicPolicy: true
        RestrictPublicBuckets: true`,
      explanation: 'This learning example expresses two separate retention decisions for a bucket. It does not implement a backup, lifecycle policy, application access policy or data migration. A retained bucket remains a resource with an owner and potential cost after it is no longer managed by the stack.',
      checks: ['Review a trial change set and identify which events invoke DeletionPolicy versus UpdateReplacePolicy.', 'Record how a retained old bucket would be identified and accessed if a replacement occurs; verify data movement separately.'], sourceIds: ['deletion', 'replacement', 'changesets'],
    },
    troubleshooting: [
      t('An update unexpectedly replaces a resource', 'A replacement-requiring property or logical identity changed.', 'Inspect the resource entry in the change set and compare logical IDs and properties.', 'Preserve identity when appropriate, or plan an explicit migration and retention strategy before execution.', 'changesets', 'replacement'),
      t('A retained resource remains after stack deletion', 'Retain deliberately preserved the physical resource outside stack management.', 'Compare the deletion policy and final stack events with the retained resource identifier.', 'Assign ownership and decide whether to reuse, import or separately remove it through the approved lifecycle.', 'deletion'),
      t('A drift check reports differences after an emergency console edit', 'Observed configuration no longer matches the declared template.', 'Inspect the reported property differences and the incident change record.', 'Choose whether the template or the emergency setting is now authoritative, then reconcile deliberately.', 'drift'),
    ],
    pitfalls: [
      n('A preview is not an execution guarantee', 'Some failures depend on runtime state, custom resources or service-specific conditions that cannot be fully established when the change set is created. Keep event monitoring and recovery procedures even after pre-deployment validation succeeds.', 'changesets'),
      n('Snapshot and retention are not the same control', 'Snapshot only applies to supporting resource types and preserves a recovery artifact; Retain preserves the resource itself. Neither promises a tested restoration path or automatic application reconnection.', 'deletion', 'replacement'),
    ],
    sources: [
      s('changesets', 'Change sets, replacement review and validation limits', 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html'),
      s('drift', 'Supported-resource drift detection', 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/detect-drift-stack.html'),
      s('deletion', 'DeletionPolicy removal and retention behavior', 'https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-deletionpolicy.html'),
      s('replacement', 'UpdateReplacePolicy lifecycle behavior', 'https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-updatereplacepolicy.html'),
      s('role', 'CloudFormation service-role authority', 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-servicerole.html'),
    ],
  },
  {
    serviceId: 'cli',
    operatingModel: [
      n('A command resolves configuration before sending requests', 'The CLI combines command options, environment settings and profile configuration to select credentials, Region and behavior. The default profile is only one possible input. Inspect the resolved configuration when a command targets the wrong account rather than assuming the visible profile file always wins.', 'config'),
      n('Pagination and display are independent', 'Many list commands retrieve multiple service pages automatically. --no-paginate limits retrieval to the first page, while --no-cli-pager only disables the terminal display program. Confusing these can make an inventory look complete while silently omitting resources.', 'pagination'),
      n('Filtering can happen on different sides of the request', 'Service-specific filters are evaluated by the API where supported. --query applies a JMESPath expression to data returned to the client. A short displayed response therefore does not necessarily mean the service scanned or returned only that subset.', 'filter'),
    ],
    setup: [
      n('Use a named human-access profile', 'Configure the supported IAM Identity Center token-provider flow for interactive access where the organization uses it. Sign in with the intended session and role. Prefer temporary credentials over copying long-lived access keys into scripts or shared shell configuration.', 'sso'),
      n('Check identity before selecting resources', 'Run the read-only caller-identity operation and compare account and role with the task. Set the target Region explicitly for resource investigations. Caller identity confirms who signed the request, not whether that identity may perform a later operation.', 'identity', 'config'),
      n('Choose stable machine-readable output', 'For automation, prefer a structured output format and inspect exit status before parsing. Select the required fields intentionally. Test empty, multiple-page and error responses so a script does not turn a failed request into an apparently valid empty inventory.', 'filter', 'pagination'),
      n('Bound retry and timeout behavior', 'Use the retry mode and attempt settings appropriate to the operation, then inspect the service outcome if a write times out. Retrying a client request is not the same as proving that its earlier side effect did not happen.', 'retries'),
    ],
    configuration: [
      c('Named profile and explicit Region', 'Pass the intended profile and Region in repeatable diagnostic commands, and inspect inherited environment settings.', 'Multiple credential sources are useful but can hide a stale shell configuration. Keep production and test profiles visibly distinct.', 'config'),
      c('--page-size versus --max-items', 'Use page size to control individual service requests and max-items to bound the CLI output with a continuation token.', 'A smaller page size does not by itself limit the total number of retrieved records. Resume using the appropriate token rather than assuming the first response is complete.', 'pagination'),
      c('Retry mode and max attempts', 'Choose the documented retry mode and treat maximum attempts as a total request budget for the configured setting.', 'More retries can increase latency and load. Authorization failures or malformed requests need correction, while uncertain writes may require reconciliation before manual replay.', 'retries'),
    ],
    security: [
      n('Profiles are configuration, not a secret vault', 'Protect shared credential files and temporary session caches, and keep them out of repositories and artifacts. Use the supported SSO or role provider path so credentials can refresh rather than hardcoding a copied temporary tuple into a script.', 'config', 'sso'),
      n('Review output and debug evidence before sharing', 'A response can include confidential identifiers or data even when a command is read-only. Select only required fields and sanitize diagnostic logs. Do not disable certificate verification to make an unexplained connection problem disappear.', 'filter', 'identity'),
    ],
    example: {
      title: 'A deliberate caller check with explicit configuration', language: 'bash',
      code: `aws sts get-caller-identity \
  --profile example-readonly \
  --region us-east-1 \
  --query '{Account:Account,Arn:Arn}' \
  --output json \
  --no-cli-pager`,
      explanation: 'Replace the placeholder profile with an existing approved profile. This operation reports the caller and does not test permissions for a target service. The output query hides unnecessary fields for this investigation; it does not change the underlying identity or its authorization.',
      checks: ['The account and role match the task before any resource-specific command is prepared.', 'A later list command is tested with enough data to span pages, and its completion/token behavior is handled explicitly.'], sourceIds: ['identity', 'config', 'filter', 'pagination'],
    },
    troubleshooting: [
      t('A command succeeds in the wrong account', 'An inherited credential source or different profile was selected.', 'Inspect aws configure list and the caller identity in the same shell.', 'Remove the unintended override or select the correct approved profile, then recheck identity before continuing.', 'config', 'identity'),
      t('A script reports only part of an inventory', 'Pagination was disabled or a continuation token was ignored.', 'Compare --no-paginate, --max-items and response token handling with the command reference.', 'Process all required pages or label the deliberately bounded result as partial.', 'pagination'),
      t('An SSO profile worked yesterday but now fails', 'The interactive session expired or the cached session no longer authorizes the selected role.', 'Inspect the selected SSO session/profile and the login result without printing cached tokens.', 'Authenticate through the supported login flow and verify the assigned account/role again.', 'sso'),
    ],
    pitfalls: [
      n('Client-side filtering is not access control', 'A --query expression changes what is displayed after the response arrives. It cannot prevent the caller from requesting other permitted data and does not replace IAM policies or service-level filtering.', 'filter'),
      n('A generated skeleton is not a stable API contract', 'The CLI reference warns that generated skeleton structure can change between versions. Review the actual operation reference and pin automation inputs rather than treating a previously generated sample as a permanent schema.', 'identity'),
    ],
    sources: [
      s('config', 'Profiles, files and configuration precedence', 'https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html'),
      s('sso', 'IAM Identity Center token-provider configuration', 'https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html'),
      s('pagination', 'Retrieval pagination and the display pager', 'https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-pagination.html'),
      s('filter', 'Server and client filtering boundaries', 'https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-filter.html'),
      s('retries', 'AWS CLI retry modes and attempt settings', 'https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-retries.html'),
      s('identity', 'GetCallerIdentity behavior and global options', 'https://docs.aws.amazon.com/cli/latest/reference/sts/get-caller-identity.html'),
    ],
  },
  {
    serviceId: 'systems-manager',
    operatingModel: [
      n('Managed-node access depends on an agent path', 'Session Manager and Run Command operate on nodes configured for Systems Manager. Agent installation, node permissions and service connectivity are prerequisites. Avoid opening inbound SSH merely because a node is absent from the managed-node view; first diagnose registration and outbound service reachability.', 'prerequisites', 'session'),
      n('Interactive sessions and fleet commands differ', 'Session Manager gives an authorized operator an interactive connection. Run Command distributes document-driven work to selected nodes and reports command, invocation and plugin states. The aggregate command result is not a substitute for examining every intended target.', 'session', 'command', 'status'),
      n('Parameter Store is another capability, not a shell feature', 'Parameter Store holds named configuration values, including encrypted SecureString values. Choose it for configuration needs and compare AppConfig for controlled rollout or Secrets Manager for secret lifecycle management. Access to a managed node does not automatically establish access to every parameter.', 'parameters'),
    ],
    setup: [
      n('Verify the node prerequisites', 'Check supported OS, SSM Agent version, node role and network connectivity required for the selected session feature. Different capabilities require appropriate agent versions. Record the managed-node identifier and Region before writing a fleet-targeting command.', 'prerequisites'),
      n('Separate operator and node authority', 'Give operators only the session/document actions and target scope they need. Give the node role its required service access. Review the operating-system identity used by an interactive session as well as the IAM identity allowed to start it.', 'session', 'prerequisites'),
      n('Test one node before scaling out', 'Use a harmless diagnostic document on a test node, inspect its output and verify the actual exit status. Then define concurrency and error controls for larger target sets. Confirm that targeting selects the intended nodes and excludes unrelated environments.', 'command', 'status'),
      n('Choose evidence retention', 'Configure supported session logging and command output destinations with suitable access and retention. Test the logging path before an incident. Account for the documented absence of session-content logging for SSH and port-forwarding sessions.', 'logging'),
    ],
    configuration: [
      c('Document version and targets', 'Use an intentional document version and narrow node IDs or reviewed tags for Run Command.', 'Broad tags can expand the target set as a fleet changes. A command succeeding on the nodes it reached does not prove it reached every node you intended.', 'command', 'status'),
      c('max-concurrency and max-errors', 'Choose limits according to the impact of the operation and the acceptable partial-failure behavior.', 'These settings influence execution and aggregate status. Inspect per-node results before declaring a fleet-wide change complete.', 'status'),
      c('Parameter type and retrieval permissions', 'Use String, StringList or SecureString according to the data contract, with KMS access considered for encrypted values.', 'Encryption at rest does not authorize every consumer. Secret rotation and configuration rollout are separate requirements that may call for different services.', 'parameters'),
    ],
    security: [
      n('Starting a session can grant powerful OS access', 'Review the default session user and any configured run-as behavior. Limit which identities may start sessions on which nodes, and protect documents that influence command execution. Closing network ports does not remove the need to authorize administrative access.', 'prerequisites', 'session'),
      n('Do not assume every tunnel produces command logs', 'Session Manager cannot record SSH or port-forwarded session content in the same way as supported interactive shell sessions. Design endpoint/application logging and access review for those paths, and avoid typing secrets into sessions that intentionally record output.', 'logging'),
    ],
    example: {
      title: 'Inspect invocation outcomes for an existing command', language: 'bash',
      code: `aws ssm list-command-invocations \
  --command-id 11111111-2222-3333-4444-555555555555 \
  --details \
  --query 'CommandInvocations[].{Node:InstanceId,Status:Status,Details:StatusDetails,Plugins:CommandPlugins[].{Name:Name,Status:Status,Code:ResponseCode}}' \
  --output json \
  --region us-east-1 \
  --no-cli-pager`,
      explanation: 'This read-only example inspects a placeholder command ID after a separately authorized command has run. It includes per-plugin status and response codes. Compare the invocation list with the intended target inventory. Inspect the full plugin output if a result is unclear; the command-level summary alone is insufficient.',
      checks: ['Every intended node has an explained outcome, including unreachable or timed-out nodes.', 'A synthetic failing script produces a failure visible in invocation/plugin evidence rather than being hidden by a later successful command.'], sourceIds: ['status', 'command', 'invocations'],
    },
    troubleshooting: [
      t('The node is not available for a session', 'Agent, registration, node-role permissions or service connectivity is missing.', 'Inspect SSM Agent state, selected Region and required endpoint reachability.', 'Repair the specific prerequisite and verify node registration before changing operator privileges.', 'prerequisites'),
      t('A fleet command is green but some machines are unchanged', 'The aggregate status hides target or invocation differences.', 'Compare the intended inventory with per-node and plugin results.', 'Correct targeting or failed invocations and verify application state on the affected nodes.', 'status'),
      t('There are no command transcripts for a port-forwarding session', 'That session type does not support session-content logging.', 'Check the session document/type and the documented logging limitations.', 'Use appropriate endpoint audit evidence and a supported logged workflow when transcript capture is required.', 'logging'),
    ],
    pitfalls: [
      n('Eventual consistency affects immediate status reads', 'Run Command APIs may not immediately expose a newly submitted operation to every subsequent read. Poll with bounded retries and distinguish a temporary visibility gap from a completed command or an invalid identifier.', 'command'),
      n('The legacy console page is not the capability', 'The current Session Manager documentation notes a legacy-page deprecation on December 31, 2026 while retaining capabilities in the unified Systems Manager experience. Update navigation instructions without describing the underlying session service as discontinued.', 'session'),
    ],
    sources: [
      s('session', 'Session Manager access model and console transition', 'https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html'),
      s('prerequisites', 'Agent, OS and session-user prerequisites', 'https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-prerequisites.html'),
      s('command', 'Run Command and eventual consistency', 'https://docs.aws.amazon.com/systems-manager/latest/userguide/run-command.html'),
      s('status', 'Command, invocation and plugin result semantics', 'https://docs.aws.amazon.com/systems-manager/latest/userguide/monitor-commands.html'),
      s('invocations', 'CLI invocation details, plugin fields and pagination', 'https://docs.aws.amazon.com/cli/latest/reference/ssm/list-command-invocations.html'),
      s('logging', 'Session logging and tunnel limitations', 'https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-logging.html'),
      s('parameters', 'Parameter Store types and service boundaries', 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html'),
    ],
  },
  {
    serviceId: 'firehose',
    operatingModel: [
      n('Delivery is buffered, destination-specific work', 'Firehose accepts or reads records, buffers them and delivers to the configured destination. For S3 it can concatenate records into objects; destinations such as OpenSearch have their own delivery requirements. Producer acceptance and final analytical availability are different milestones.', 'delivery'),
      n('Transformation has an input/output contract', 'An optional Lambda transform receives a buffered batch and must return the expected record identifiers, statuses and encoded payloads. Direct PUT/Kinesis Data Streams records and MSK records have different output payload fields. A Lambda invocation succeeding does not prove each transformed record was valid.', 'transform', 'contract'),
      n('Partitioning improves queries but changes buffering', 'Dynamic partitioning groups S3 output by extracted keys. That can reduce downstream query scanning, but a high-cardinality key creates many groups and changes delivery behavior. Design partitions around actual analytical filters, not merely whichever identifier is easiest to extract.', 'partition'),
    ],
    setup: [
      n('Define the source and destination format', 'Choose Direct PUT or the supported source integration, then document record encoding, delimiters and destination schema. For newline-delimited JSON, confirm where the newline is added. Concatenated JSON objects without delimiters are not automatically a valid JSON-lines file.', 'delivery'),
      n('Test transformation with mixed records', 'Prepare valid, intentionally dropped and malformed fixtures. Check that output preserves each record ID and uses the correct status and payload field for the source. Validate both the decoded content and the complete response envelope before enabling transformation.', 'contract'),
      n('Prepare destination and recovery access', 'Grant Firehose the required destination, encryption and optional transformation permissions. Configure the appropriate backup/error location and verify it can receive records. A primary-destination failure is much harder to recover if the backup path is also denied.', 'access', 'troubleshoot'),
      n('Measure end-to-end delivery lag', 'Send distinguishable synthetic records and observe acceptance, transformation, destination arrival and query visibility. Monitor error logs and record metrics. Use the observed lag and object sizes to tune buffering instead of assuming every accepted record is immediately queryable.', 'delivery', 'logs'),
    ],
    configuration: [
      c('Buffering hints', 'Choose size and interval hints according to destination requirements and the latency/object-size tradeoff.', 'Smaller buffers can lower delivery delay but increase object or request overhead. Transformation and destination buffering are separate stages.', 'transform', 'delivery'),
      c('Dynamic partition keys', 'Use stable keys aligned with common S3 query predicates, and test missing or malformed key values.', 'Excessive cardinality or extraction errors can disrupt expected delivery. Partitioning is not a substitute for a well-defined event schema.', 'partition'),
      c('Retry and backup behavior', 'Review the configured destination retry window and backup semantics, including what happens when S3 delivery itself fails.', 'Different sources and destinations have different retention/retry behavior. Recovery must complete within the applicable retention boundary rather than relying on indefinite buffering.', 'troubleshoot'),
    ],
    security: [
      n('Separate producer access from delivery access', 'The producer needs permission to write to the stream; the Firehose role needs permission to read its source and write to the actual destination as applicable. Review KMS and cross-account resource policies independently from the producer identity.', 'access'),
      n('Treat error output as potentially sensitive data', 'Failed-record storage and transformation logs can contain the original payload. Protect and retain those destinations deliberately. Avoid printing full customer events simply to debug one malformed field; use safe identifiers and controlled fixtures.', 'logs', 'access'),
    ],
    example: {
      title: 'A valid Direct PUT transformation response shape', language: 'json',
      code: `{
  "records": [
    {
      "recordId": "record-id-from-input",
      "result": "Ok",
      "data": "eyJvayI6dHJ1ZX0K"
    }
  ]
}`,
      explanation: 'The base64 value decodes to {"ok":true} followed by a newline. The recordId must come from the actual input record, not this placeholder. This example is for Direct PUT/Kinesis Data Streams transformation; the MSK contract uses kafkaRecordValue instead of data.',
      checks: ['Decode the output and assert the expected JSON and delimiter; preserve the input record ID exactly.', 'Include a deliberately invalid record and verify it becomes ProcessingFailed or an intentional Dropped result according to the transformation policy.'], sourceIds: ['contract', 'delivery'],
    },
    troubleshooting: [
      t('PutRecordBatch returns successfully but some events never arrive', 'Individual records failed even though the batch request completed.', 'Inspect FailedPutCount and per-record outcomes together with incoming-record metrics.', 'Retry the failed records using bounded backoff and retain business identifiers for duplicate handling.', 'troubleshoot'),
      t('Lambda succeeds but transformation errors are logged', 'The returned envelope, record IDs, status or base64 payload violates the source-specific contract.', 'Compare a captured synthetic input/output pair with the required parameters.', 'Fix the transformation response and replay controlled failed fixtures before resuming ordinary traffic.', 'contract', 'logs'),
      t('Records accumulate while destination objects are absent', 'Delivery permissions, destination configuration or buffering behavior differs from expectations.', 'Inspect delivery error logs, destination metrics and the selected buffering/partition settings.', 'Repair the failed boundary and confirm both primary delivery and recovery storage are usable.', 'delivery', 'logs', 'access'),
    ],
    pitfalls: [
      n('Dropped is an intentional successful processing result', 'A transform returning Dropped is not asking Firehose to retry that record. Use it only for records the business explicitly permits discarding, and measure that decision so filtering mistakes do not silently remove valid events.', 'contract'),
      n('Acceptance is not a replay archive', 'Firehose has source- and destination-specific retry/retention behavior. If the business requires long-term independent replay, design that durable source or archive explicitly and test restoration instead of treating delivery buffering as permanent event storage.', 'troubleshoot'),
    ],
    sources: [
      s('delivery', 'Destination-specific delivery and S3 delimiters', 'https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html'),
      s('transform', 'Lambda transformation and buffering stages', 'https://docs.aws.amazon.com/firehose/latest/dev/data-transformation.html'),
      s('contract', 'Transformation record identifiers and result contract', 'https://docs.aws.amazon.com/firehose/latest/dev/data-transformation-status-model.html'),
      s('partition', 'Dynamic S3 partitioning', 'https://docs.aws.amazon.com/firehose/latest/dev/dynamic-partitioning.html'),
      s('logs', 'Delivery and transformation error logging', 'https://docs.aws.amazon.com/firehose/latest/dev/monitoring-with-cloudwatch-logs.html'),
      s('troubleshoot', 'Partial batch failures, retries and retention', 'https://docs.aws.amazon.com/firehose/latest/dev/troubleshooting.html'),
      s('access', 'Producer, destination and cross-account permissions', 'https://docs.aws.amazon.com/firehose/latest/dev/controlling-access.html'),
    ],
  },
  {
    serviceId: 'bedrock',
    operatingModel: [
      n('A common API does not erase model differences', 'Converse gives supported models a shared message interface, but capabilities, modalities and accepted parameters remain model-specific. Choose a model or inference profile that supports the required features in the intended deployment context, then evaluate the actual request/response contract.', 'converse', 'models'),
      n('Tool execution depends on the API path', 'For client-side tool use through Converse, the application validates model-proposed arguments, authorizes the user, executes an allowed operation and returns the tool result. The Responses API also supports server-side tool execution with a separate contract. Either path needs business authorization: a generated order ID does not establish ownership.', 'tools', 'client-tools', 'server-tools'),
      n('Safety controls and factual correctness are separate', 'Guardrails can apply configured content and other supported checks, with versioned configuration. They do not remove the need to evaluate answer quality, check business rules or authorize tools. Test both useful allowed answers and blocked/fallback behavior for the selected configuration.', 'guardrails'),
    ],
    setup: [
      n('Define measurable acceptance cases', 'Create synthetic examples covering correct answers, missing evidence, unauthorized record requests and dependency failure. Decide the fallback response before choosing prompt wording. Measure quality and latency on those cases so a model change is a reviewable behavior change.', 'converse', 'models'),
      n('Select a supported request shape', 'Check the model card and API reference for messages, tool support and inference parameters. Keep a direct model request separate from a Prompt management ARN request, which has restrictions on fields such as system, toolConfig and inferenceConfig.', 'converse', 'models'),
      n('Bound the application tool loop', 'Give each tool a narrow schema, validate returned arguments and set an application-level limit on repeated tool rounds. Use durable operation identifiers for side effects. Stop and reconcile an uncertain write instead of letting an assistant repeat it until a confident answer appears.', 'tools'),
      n('Decide what telemetry may contain', 'Record safe request identifiers, latency, token usage and outcome categories. If model invocation logging is enabled, review the possibility of full request/response content in configured destinations and their access/retention. Logging is a separate data-handling choice, not a harmless debugging toggle.', 'logging'),
    ],
    configuration: [
      c('modelId and inference profile', 'Select the documented model or profile identifier and verify feature/Region support for the workload.', 'Changing the identifier can change capability, latency, cost and output behavior even when the client code still compiles. Repeat the evaluation set after a switch.', 'models', 'converse'),
      c('Output budget and stop handling', 'Set a suitable maxTokens budget where supported and inspect stopReason and returned content blocks.', 'A truncated or tool-request response is not a completed user answer. Do not parse every response as a single unrestricted text string.', 'converse'),
      c('Guardrail version and logging', 'Pin the intended guardrail version and enable only the telemetry needed for the approved investigation.', 'A draft or changed policy can alter refusals; full-content logging can duplicate sensitive context into another storage boundary.', 'guardrails', 'logging'),
    ],
    security: [
      n('Authorize inference and downstream actions independently', 'Converse requires the relevant Bedrock inference permission, while a tool needs its own application and service authorization. Scope both. A backend role able to query many customers should still enforce the caller ownership boundary before each lookup.', 'converse', 'tools'),
      n('Treat retrieved content as data', 'Keep instructions from users and application policy separate from text found in documents or tool results. Evaluate adversarial content in tests, validate generated output before using it as code or a command, and keep secrets out of prompts unless the approved use case requires them.', 'guardrails', 'tools'),
    ],
    example: {
      title: 'Converse SDK input with a bounded read tool', language: 'json',
      code: `{
  "modelId": "MODEL_OR_INFERENCE_PROFILE_ID",
  "messages": [{"role": "user", "content": [{"text": "Find the status of order demo-42."}]}],
  "inferenceConfig": {"maxTokens": 300},
  "toolConfig": {
    "tools": [{"toolSpec": {
      "name": "lookup_order",
      "description": "Read status for an order the caller may access.",
      "inputSchema": {"json": {
        "type": "object",
        "properties": {"orderId": {"type": "string"}},
        "required": ["orderId"],
        "additionalProperties": false
      }}
    }}]
  }
}`,
      explanation: 'This is an illustrative SDK request object for a model supporting these fields, not an executable request from the page. Replace the model placeholder after checking support. The tool description does not enforce access: application code must authorize demo-42 against the authenticated caller before retrieving it.',
      checks: ['A permitted synthetic order returns a validated tool result; a different user cannot retrieve that order by changing the generated argument.', 'Handle tool-use, truncation, guardrail intervention and service errors explicitly instead of reporting all of them as a successful answer.'], sourceIds: ['converse', 'client-tools', 'guardrails'],
    },
    troubleshooting: [
      t('A request fails after switching models', 'The new model or selected invocation path does not support the supplied fields or capabilities.', 'Compare the model card and API validation error with the actual payload.', 'Use the supported request shape and reevaluate behavior rather than silently dropping required safeguards.', 'models', 'converse'),
      t('The response asks for a tool but the user sees no answer', 'The application treated a tool-use stop as final text or failed to return the tool result.', 'Inspect stopReason, content blocks and the tool-call correlation identifier.', 'Implement the authorized tool-result round trip with bounded retries and explicit failure handling.', 'tools', 'converse'),
      t('Sensitive prompts appear in a logging destination', 'Model invocation logging was enabled with full-content collection.', 'Inspect the account/Region logging configuration and destination access.', 'Apply the approved logging policy, restrict destination access and address retained data through the incident process.', 'logging'),
    ],
    pitfalls: [
      n('Structured output is not verified truth', 'A response can satisfy a JSON shape while containing invented identifiers or unsupported claims. Check the meaning against authorized sources and business rules before taking action, and preserve an explicit unknown outcome when evidence is missing.', 'converse', 'guardrails'),
      n('One inference call is not the whole cost', 'A user task can include repeated model rounds, retrieval, tools, logging and guardrail evaluation. Track the complete workflow when estimating usage, and avoid promising that a short final answer implies a cheap request.', 'tools', 'logging'),
    ],
    sources: [
      s('converse', 'Converse request fields, permissions and response contract', 'https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html'),
      s('models', 'Model-specific capability references', 'https://docs.aws.amazon.com/bedrock/latest/userguide/model-cards.html'),
      s('tools', 'Tool-use application boundary', 'https://docs.aws.amazon.com/bedrock/latest/userguide/tool-use.html'),
      s('client-tools', 'Client-side Converse tool-use request and result loop', 'https://docs.aws.amazon.com/bedrock/latest/userguide/tool-use-client-side.html'),
      s('server-tools', 'Responses API server-side tool execution contract', 'https://docs.aws.amazon.com/bedrock/latest/userguide/tool-use-server-side.html'),
      s('guardrails', 'Guardrail features, versions and supported checks', 'https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html'),
      s('logging', 'Model invocation logging contents and destinations', 'https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html'),
    ],
  },
  {
    serviceId: 'agentcore',
    operatingModel: [
      n('AgentCore is a set of operational components', 'Runtime, Gateway, Identity, Memory and other capabilities can be adopted together or independently. Start by mapping the missing operational responsibility in the application. Adding every component does not automatically produce a safer or more understandable agent workflow.', 'overview'),
      n('Compute lifetime and persisted state are separate', 'A terminated microVM loses in-memory state; reusing a session identifier can provision new compute. Runtime also offers Instances and explicit persistent filesystem options, each with its own lifecycle. Managed microVM session storage is currently Preview. Choose persistence deliberately and keep authoritative business records separate from conversational Memory.', 'runtime', 'compute', 'storage', 'memory'),
      n('Tool reachability and authority are different', 'Gateway can expose tools and route supported agentic traffic; Identity handles workload identity and credentials. The application must still decide whether the current user may act on a specific record. Valid ingress authentication does not grant unrestricted access to every tool target.', 'gateway', 'identity'),
    ],
    setup: [
      n('Draw the identity path', 'Identify the end user, runtime identity, gateway caller and downstream credential used for each tool. Mark which decisions are per-user and which use shared service authority. This exposes confused-deputy risks before a successful demo hides them behind one administrator account.', 'identity', 'gateway'),
      n('Choose compute and a versioned runtime target', 'Select microVMs or Instances and review their lifecycle, storage and security contracts before packaging the agent. Record the runtime configuration version addressed by the endpoint; it differs from the platform version. The automatically updated DEFAULT endpoint is not a pinned release.', 'runtime', 'compute', 'storage'),
      n('Define memory scope and retention', 'Choose which short-term events or longer-term extracted context are useful. Scope retrieval to the intended actor/session and verify deletion or retention requirements. Conversational memory should not become the authoritative ledger for orders, payments or permission decisions.', 'memory'),
      n('Rehearse tool and session failure', 'Test a denied cross-user lookup, an expired downstream credential, an unavailable tool and a terminated session. Verify the user-visible fallback and durable operation state. A restarted agent must not repeat an uncertain write merely because its local context disappeared.', 'runtime', 'identity'),
    ],
    configuration: [
      c('Runtime endpoint and version', 'Record the specific runtime version intended for each environment and how endpoint updates are promoted.', 'The DEFAULT endpoint follows runtime updates according to the documented behavior. A stable endpoint name is not proof that it always serves the same implementation.', 'runtime'),
      c('Gateway targets and schemas', 'Expose narrowly described tools with validated input/output contracts and explicit downstream authentication.', 'A broad generic tool makes policy review and outcome validation harder. Gateway connectivity does not replace business ownership checks in the target.', 'gateway'),
      c('Memory strategy and namespace', 'Store and retrieve context under the correct user/session scope using the chosen memory design.', 'More retained context can improve continuity while increasing privacy and stale-assumption risks. Keep authoritative application state and permissions in their owning systems.', 'memory'),
    ],
    security: [
      n('Enforce user scope at the action boundary', 'Authenticate the incoming request, bind it to the authorized user/session and recheck record access in each consequential tool. Do not let a prompt-supplied customer ID substitute for that binding. Shared runtime or service credentials need especially careful target-side authorization.', 'identity', 'gateway'),
      n('Limit retained context and credential exposure', 'Use managed credential mechanisms for downstream access and avoid storing bearer tokens in conversational memory. Review what the agent records and retrieves across sessions. Isolation of runtime compute does not automatically prove that the application chose correct memory keys.', 'identity', 'memory'),
    ],
    example: {
      title: 'An identity and recovery contract for an order assistant', language: 'text',
      code: `Caller: authenticated synthetic user user-A
Session: application maps session-42 to user-A
Runtime endpoint: reviewed production version
Tool: read_order(orderId)
Target check: order.owner == authenticated user-A
Memory: user-A namespace; no credentials or payment data
Write extension: require operation ID and recorded outcome
Recovery: reconcile operation before retry after timeout`,
      explanation: 'This is an application design worksheet, not an AgentCore API payload. Implement the mapping and authorization with the actual framework and selected components. Its purpose is to make the principal used at each boundary and the uncertain-write recovery rule reviewable.',
      checks: ['A second synthetic user cannot reuse session-42 or retrieve user-A memory/order data.', 'After runtime termination, the restarted workflow consults durable operation state before repeating a side effect.'], sourceIds: ['runtime', 'gateway', 'identity', 'memory'],
    },
    troubleshooting: [
      t('The runtime is reachable but a tool is denied', 'Ingress succeeded while gateway or downstream credential authorization failed.', 'Trace the request through runtime, gateway and target identity evidence.', 'Repair the exact role, credential provider or target policy without broadening every component.', 'gateway', 'identity'),
      t('Conversation context disappears after a long pause', 'The process held context only in memory, or configured storage expired or reset.', 'Compare the compute lifecycle, filesystem configuration and Memory integration; check version changes and storage retention rules.', 'Restore only authorized persisted context and keep business state in its authoritative store.', 'runtime', 'storage', 'memory'),
      t('A new release changes behavior despite an unchanged endpoint name', 'The endpoint now resolves to a newer runtime configuration version.', 'Inspect the endpoint-to-version association and deployment history.', 'Promote or restore the intended version deliberately and verify behavior with the release evaluation set.', 'runtime'),
    ],
    pitfalls: [
      n('Managed runtime isolation is not application authorization', 'A correctly isolated session can still call an overpowered downstream tool. Test record ownership and tool arguments independently from compute isolation and prompt instructions.', 'runtime', 'identity'),
      n('Memory is not an audit log', 'Extracted or summarized context can omit details and may evolve with the configured strategy. Preserve durable business events and operation outcomes in an appropriate system when exact history or reconciliation matters.', 'memory'),
    ],
    sources: [
      s('overview', 'AgentCore modular service overview', 'https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html'),
      s('runtime', 'MicroVM runtime versions, endpoints and session lifecycle', 'https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-how-it-works.html'),
      s('compute', 'Runtime microVM and Instances compute choices', 'https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html'),
      s('storage', 'Persistent filesystem types, Preview status and lifecycle', 'https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-filesystem-configurations.html'),
      s('gateway', 'Gateway tool interfaces and authentication boundaries', 'https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html'),
      s('identity', 'Agent workload identity and credential management', 'https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html'),
      s('memory', 'Short-term and long-term agent memory', 'https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html'),
    ],
  },
  {
    serviceId: 'quick',
    operatingModel: [
      n('Quick combines several business capabilities', 'Amazon Quick includes conversational work, research, analytics and workflow capabilities. Quick Sight is its analytics feature; Quick is not Q Developer and is not a replacement name for a custom Bedrock model API. Pick the capability matching the task before comparing configuration options.', 'overview'),
      n('Connected knowledge and connected actions differ', 'A data access integration establishes authentication and a source connection; a connected knowledge base makes selected content available for analysis. Action connectors can call external applications. Connecting documents for research does not automatically justify enabling tools that modify those applications.', 'data', 'connectors'),
      n('A space has its own sharing consequences', 'A space groups relevant resources and uploaded files. Linked Quick resources retain their access requirements, while files uploaded directly to a space are available to everyone with space access. Review these two paths separately when assembling a team knowledge collection.', 'spaces'),
    ],
    setup: [
      n('Define the question and allowed sources', 'Choose a bounded business task, such as explaining changes in a synthetic incident report. Identify the source owner, freshness requirement and information the intended users may access. A large connected corpus is less useful than a relevant, governed set of sources.', 'data', 'overview'),
      n('Connect and verify ingestion', 'Create the appropriate data integration and knowledge base, select the intended content and wait for the documented available state. Test retrieval with a known fact from an accessible document before asking for broad conclusions across the collection.', 'data'),
      n('Review space membership', 'Add resources and uploads only after checking their sharing behavior. Test with a representative viewer, not only an owner. Confirm that linked resources remain inaccessible where intended and that direct uploads are suitable for everyone who can enter the space.', 'spaces'),
      n('Introduce actions separately', 'For any connector action, identify the credential used, target application and confirmation behavior on the actual surface. Start with read-only operations and synthetic records. If automating the workflow, review the service-level authority and configure human review where the operation needs it.', 'connectors', 'security'),
    ],
    configuration: [
      c('Knowledge-base content selection', 'Choose the folders, sites or other source subsets relevant to the task, then monitor synchronization state.', 'A connected integration alone is not queryable knowledge. Stale or incomplete ingestion can produce plausible but incomplete summaries.', 'data'),
      c('Space owner versus viewer access', 'Give maintenance/sharing privileges only to owners who need them and verify what viewers can read or download.', 'Sharing a space does not automatically grant access to every linked resource, but direct uploads have broader space-wide visibility.', 'spaces'),
      c('Connector tool permission', 'Inspect owner-enforced settings and user preferences for each tool, including Always Ask/Disable and the available user choices.', 'A consent prompt is configuration- and surface-dependent. Do not assume every write always asks, especially when moving from an interactive task to automation.', 'connectors', 'security'),
    ],
    security: [
      n('Review unattended identity explicitly', 'The documented automated-workflow model uses service-level authentication rather than an individual interactive user. Limit what that credential can reach and consider a human-in-the-loop step for consequential actions. A workflow creator identity is not necessarily the action identity.', 'security'),
      n('Treat external content as an input, not authority', 'Connected pages, files and tool results can contain misleading instructions. Verify material claims against accessible evidence and prevent retrieved text from silently expanding action scope. An instruction inside a document cannot substitute for authorization to change an external record.', 'security'),
    ],
    example: {
      title: 'A source-grounded incident brief with a separate action proposal', language: 'text',
      code: `Task: summarize the synthetic checkout incident in this space.
For each material claim, identify the supporting document.
Separate confirmed facts, unresolved questions and hypotheses.
List proposed follow-up tickets with owner and evidence.
Do not create or modify tickets as part of the summary.
Before any later action, show the exact target and proposed fields.`,
      explanation: 'This is a task template for reviewing research and proposed changes, not a universal product permission setting. Configure connector controls independently. Validate the final summary against the documents and inspect any later action result in the target application.',
      checks: ['A viewer receives only the facts supported by sources that viewer can access, with uncertainty stated when evidence is missing.', 'The research result and any separately authorized ticket change remain distinguishable, including the actual target-system record identifier.'], sourceIds: ['data', 'spaces', 'connectors', 'security'],
    },
    troubleshooting: [
      t('A connected source does not appear in answers', 'The integration lacks an available knowledge base, selected content has not synced, or the user lacks access.', 'Inspect connection, knowledge-base status and permissions as separate stages.', 'Repair the missing stage and test one known accessible fact before widening the query.', 'data'),
      t('A teammate can open the space but not a linked dashboard', 'The linked resource retains its own access control.', 'Compare the viewer permissions on the space and on the dashboard.', 'Grant only the intended resource access or remove the misleading link; do not broaden the whole space unnecessarily.', 'spaces'),
      t('A workflow can reach records beyond the interactive user scope', 'It uses service-level credentials with a wider permission set.', 'Identify the workflow action identity and target credential scope.', 'Narrow that credential and add the required review gate before enabling unattended execution.', 'security'),
    ],
    pitfalls: [
      n('A citation is a place to verify, not a correctness certificate', 'Open the cited source and check whether it supports the actual claim, time period and subject. A relevant document can still be misread or combined into an unsupported conclusion.', 'data', 'security'),
      n('Direct uploads change the audience boundary', 'Do not assume a file uploaded to a team space retains every permission rule from the system it came from. Review the space audience before uploading sensitive content and test the resulting visibility with the intended user roles.', 'spaces'),
    ],
    sources: [
      s('overview', 'Amazon Quick capability and product overview', 'https://docs.aws.amazon.com/quick/latest/userguide/what-is.html'),
      s('data', 'Data integrations and connected knowledge bases', 'https://docs.aws.amazon.com/quick/latest/userguide/data-access-integrations.html'),
      s('spaces', 'Space sharing and uploaded-file visibility', 'https://docs.aws.amazon.com/quick/latest/userguide/working-with-spaces.html'),
      s('connectors', 'Connector ownership and tool permission controls', 'https://docs.aws.amazon.com/quick/latest/userguide/connections-desktop.html'),
      s('security', 'Interactive versus automated identity and oversight', 'https://docs.aws.amazon.com/quick/latest/userguide/sec-agentic-security.html'),
    ],
  },
  {
    serviceId: 'kiro',
    operatingModel: [
      n('Specs preserve the path from intent to implementation', 'Kiro specs separate requirements or bug analysis, design and implementation tasks. These artifacts make assumptions reviewable and help explain why a code change exists. A completed task list still needs evidence that the implementation satisfies the acceptance criteria.', 'specs'),
      n('Steering supplies reusable project context', 'Workspace steering describes product, technology and structure conventions; global steering applies more broadly where supported. Keep instructions specific and consistent with the actual repository. Steering guides model behavior but is not an operating-system or service authorization boundary.', 'steering'),
      n('Tools, hooks and surfaces have different execution contracts', 'MCP adds tool/context providers, while hooks can trigger commands or prompts on supported surfaces. Current IDE/CLI permissions use capability rules; the web surface uses its managed sandbox model instead. Consult the surface/version matrix before copying a configuration from another client.', 'hooks', 'mcp', 'permissions'),
    ],
    setup: [
      n('Write an observable acceptance condition', 'Describe the failing input, expected behavior and behavior that must remain unchanged. Choose a feature or bugfix spec as appropriate. Reject requirements that merely say improve reliability without an example showing how the result will be measured.', 'specs'),
      n('Add only useful steering', 'Record the existing stack, test commands, file organization and key domain constraints in project steering. Keep it versioned and review changes like other repository instructions. Remove obsolete rules that could steer new work toward an abandoned architecture.', 'steering'),
      n('Review tool and hook reach', 'Inspect MCP server provenance, credentials and exposed operations before enabling them. For hooks, read the trigger, matcher and action together. A file-save event can run a shell command automatically, so treat hook configuration as executable development tooling.', 'mcp', 'hooks'),
      n('Validate a bounded implementation', 'Ask for a small change tied to the spec, inspect the diff and run independent regression cases. Include unauthorized, malformed and concurrent inputs where relevant. Check the final workspace state rather than relying on the assistant narrative or task checkboxes.', 'specs'),
    ],
    configuration: [
      c('Steering scope and inclusion', 'Use workspace steering for repository-specific conventions and verify which inclusion features the selected client version supports.', 'A global preference can be unsuitable for one codebase. Excessive or contradictory instructions make important requirements harder to apply consistently.', 'steering'),
      c('Capability permissions', 'On supported IDE/CLI surfaces, use explicit allow, ask and deny rules for the capabilities the workflow needs.', 'Permission precedence and network rules have documented distinctions. A rule for one tool is not a universal guarantee about every command that another allowed tool can execute.', 'permissions'),
      c('Hook trigger and matcher', 'Choose a narrow event/matcher and an action that is safe to run repeatedly.', 'Automatic formatting or generation can create loops or unexpected edits if triggers are broad. Verify the hook runs on the intended files and respects the chosen execution controls.', 'hooks'),
    ],
    security: [
      n('Permissions must be enforced outside prose', 'Use the actual permission and sandbox settings for tool access; do not rely on a steering sentence to protect credentials or production resources. Review the specific surface because web sessions and local IDE/CLI sessions do not use identical approval mechanisms.', 'permissions'),
      n('MCP servers extend the trust boundary', 'A server can return content and expose operations under its configured credentials. Review both the data it can read and the changes it can make. Treat server instructions and retrieved content as inputs to evaluate, not permission to expand the user task.', 'mcp'),
    ],
    example: {
      title: 'An illustrative local capability review policy', language: 'yaml',
      code: `rules:
  - capability: shell
    effect: ask
  - capability: mcp
    effect: ask
  - capability: fs_write
    match: ['**/.env*', '**/*.pem']
    effect: deny`,
      explanation: 'This small example uses the current documented IDE/CLI permissions schema; it is not a complete security policy and does not apply to the web sandbox model. Review the documented scope/location and other effective rules. Filesystem-tool rules alone do not describe all filesystem effects of approved shell commands.',
      checks: ['A shell or MCP operation receives the intended review behavior on the actual supported client.', 'A blocked direct write is denied, and separately approved shell operations are reviewed for their own file/network effects rather than assumed harmless.'], sourceIds: ['permissions'],
    },
    troubleshooting: [
      t('Generated code ignores a project convention', 'The steering file is missing, out of scope, outdated or contradictory.', 'Inspect the active workspace and effective steering rules against the repository.', 'Repair the specific instruction and rerun a small representative task before generating a broad change.', 'steering'),
      t('A hook runs repeatedly or changes unrelated files', 'Its matcher/action is too broad or its output triggers another execution.', 'Trace the hook event, matched file and command result.', 'Narrow the trigger and make the action idempotent; test it on one controlled edit.', 'hooks'),
      t('A permissions example behaves differently on web', 'The configuration was copied from an IDE/CLI permission model that the web surface does not use.', 'Check the current capability matrix and sandbox documentation for the chosen surface.', 'Configure the actual available controls rather than assuming a local permissions.yaml is enforced in every environment.', 'permissions'),
    ],
    pitfalls: [
      n('Specs can formalize the wrong assumption', 'A detailed design is only useful if the acceptance criteria describe the real user problem. Reproduce the original failure and include an independent counterexample before trusting generated implementation and generated tests that agree with one another.', 'specs'),
      n('A connected server is not automatically appropriate', 'Confirm why each MCP tool is needed, what identity it uses and where its data goes. Remove unnecessary operations from the workflow so a routine coding task does not inherit unrelated external write capabilities.', 'mcp'),
    ],
    sources: [
      s('specs', 'Kiro requirements, design and task workflow', 'https://kiro.dev/docs/specs/'),
      s('steering', 'Workspace/global steering and supported surfaces', 'https://kiro.dev/docs/steering/'),
      s('hooks', 'Hook triggers and automatic command actions', 'https://kiro.dev/docs/hooks/'),
      s('mcp', 'MCP tools, context and connection configuration', 'https://kiro.dev/docs/mcp/'),
      s('permissions', 'Capability permissions and web-surface differences', 'https://kiro.dev/docs/permissions/'),
    ],
  },
  {
    serviceId: 'sam',
    operatingModel: [
      n('SAM expands declarations into CloudFormation', 'Serverless resource types describe functions and related integrations concisely. During deployment, the SAM transform produces underlying CloudFormation resources, including permissions and event integrations where applicable. Review the transformed intent rather than assuming a short function declaration creates only one resource.', 'function'),
      n('Build output becomes the next testing input', 'sam build collects code and dependencies into the expected artifact layout. Zip and image package types have different build contracts. A local invocation may use built output, so editing source without rebuilding can leave the test exercising a stale artifact.', 'build'),
      n('Local testing covers selected boundaries', 'sam local invoke runs a local invocation, while start-api exposes local HTTP routes for supported function integrations. These tools help exercise handler behavior, but they do not prove deployed IAM, networking or every managed-service integration. Local code can still make real network calls if configured to do so.', 'local'),
    ],
    setup: [
      n('Specify the function and event contract', 'Choose the package type, supported runtime, handler and event source. For HTTP APIs, identify the method, path and event payload format expected by the code. Avoid testing a REST API event against a handler that assumes an HTTP API payload.', 'function', 'http', 'runtimes'),
      n('Build from the reviewed revision', 'Commit dependency manifests/lockfiles and build the current code before local checks. Use the build mode appropriate to dependencies and target architecture. Record which artifact was tested so a later package step does not silently substitute different code.', 'build'),
      n('Run synthetic boundary fixtures', 'Exercise valid, malformed, unauthorized and duplicate inputs against the handler. Stub external services for a disconnected unit check. If local execution uses actual AWS credentials or network endpoints, treat those calls as real service access requiring separate authorization.', 'local'),
      n('Review deployment configuration separately', 'Select the intended configuration environment, account, Region and stack. Inspect the change set and generated permissions before an authorized deployment. After deployment, verify the real endpoint, identity boundary and logs that local testing could not establish.', 'config', 'function'),
    ],
    configuration: [
      c('PackageType and runtime', 'Choose Zip or Image and verify that runtime, dependencies and architecture match the selected build path.', 'A successful build on the developer machine does not prove native dependencies match the deployed runtime. Runtime identifiers also have lifecycle/support boundaries.', 'build', 'runtimes'),
      c('Event path, method and payload format', 'Define the intended HttpApi route explicitly and match the handler parser to its integration payload.', 'Implicit defaults can create broader routing than intended. Authentication and route behavior need review in the actual generated API.', 'http'),
      c('samconfig environment and precedence', 'Use named configuration environments for deliberate command defaults and inspect explicit CLI overrides.', 'A local config file can silently select a stack or deployment option from a previous task. Confirm effective values rather than trusting the file name alone.', 'config'),
    ],
    security: [
      n('Inspect generated execution and invocation permissions', 'When SAM generates an execution role, review the resulting policies and their resource scope. Separate who may invoke the function from what the function may access after invocation. A local successful handler test does not verify either deployed permission boundary.', 'function'),
      n('Keep local fixtures disconnected by design', 'Use synthetic event files and stub adapters when the purpose is an offline check. Do not assume a Docker-based local runtime blocks AWS access. Keep real credentials, secrets and production endpoints out of ordinary fixture configuration and committed samconfig values.', 'local', 'config'),
    ],
    example: {
      title: 'A minimal handler template without an exposed API', language: 'yaml',
      code: `AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Resources:
  PreviewFunction:
    Type: AWS::Serverless::Function
    Properties:
      Runtime: python3.13
      Handler: app.handler
      CodeUri: src/
      MemorySize: 256
      Timeout: 5`,
      explanation: 'This illustrative template assumes src/app.py defines handler and that the selected runtime remains supported. Memory and timeout are example workload choices, not general recommendations. No public API event or downstream data-access policy is included; add those only after defining their authorization and event contracts.',
      checks: ['After sam build, a local invocation with a synthetic fixture exercises the freshly built handler and asserts its response.', 'Review any later event/policy addition in the transformed deployment, then test real invocation authorization separately from the offline fixture.'], sourceIds: ['function', 'build', 'local', 'runtimes'],
    },
    troubleshooting: [
      t('A source fix has no effect in local testing', 'The local command is using an older built artifact.', 'Compare source and build output and confirm the template/artifact path selected by the command.', 'Rebuild the reviewed revision and rerun the same fixture before changing application logic again.', 'build', 'local'),
      t('The handler works locally but rejects deployed requests', 'The deployed integration event shape or permissions differ from the local fixture.', 'Inspect the real API type/payload format and safe request metadata.', 'Correct the fixture and handler contract, then validate deployment-specific authorization separately.', 'http', 'function'),
      t('A deployment command targets an unexpected stack', 'samconfig environment defaults or CLI overrides select a different target.', 'Inspect the selected configuration environment, command options, account and Region.', 'Correct the effective configuration and review the intended change set before executing it.', 'config'),
    ],
    pitfalls: [
      n('A local HTTP server is not a full AWS emulator', 'Use it to test the supported routing and handler boundary, then record which integration semantics remain unverified. Do not claim that a passing local request proves production network access, scaling or IAM policy correctness.', 'local'),
      n('Convenient generated roles still need review', 'A concise policy template or implicit resource can create broader access than a reader expects. Inspect resource-level permissions and event wiring rather than assuming the abstraction has already captured the application ownership rules.', 'function'),
    ],
    sources: [
      s('function', 'SAM function properties and generated resources', 'https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html'),
      s('build', 'SAM build outputs and package types', 'https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-build.html'),
      s('local', 'Local invoke and HTTP testing boundaries', 'https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli-local.html'),
      s('config', 'SAM configuration environments and precedence', 'https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-config.html'),
      s('http', 'HttpApi event routes and payload format', 'https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-httpapi.html'),
      s('runtimes', 'Lambda event-function runtime support', 'https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html'),
    ],
  },
];
