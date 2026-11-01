# DVA-C03 skill-to-configuration research map

Verified against the four official domain pages on **2026-11-01**. This task
provides an expected coverage map only. It does not certify that any editor,
validator, scenario or theory chapter fully implements a skill or establishes
exam readiness. Titles in `src/configurationSkills.ts` are concise original
paraphrases; the official wording remains at each row's source URL.

## Inventory and review method

- **72 unique skill IDs**: Domain 1 has 18; Domain 2 has 19; Domain 3 has 19;
  Domain 4 has 16. All four official pages were opened directly.
- Service IDs use the current canvas registry. They identify relevant study
  contexts, not an assertion that every associated service is required to pass
  a skill. Named service lists are non-exhaustive.
- `topics` specify expected configuration/code/reasoning coverage. They are
  original audit targets, not a copied console schema or an implementation claim.
- `learningMode` prevents code and troubleshooting skills being counted as
  covered merely because a service has a form. `configuration` still requires
  meaningful validation/scenario evidence, not just the presence of a field.
- Theory locations below were read from the current C03 section of
  `THEORY-COVERAGE.md`. They are **expected navigation links**, not newly verified
  instructional sufficiency. The separate theory worktree owns those files;
  this task has not edited or re-reviewed their lesson bodies.
- No AWS credentials, model calls, deployment or live-cloud validation were used.

Official sources:

1. [Domain 1: Development](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/developer-associate-03-domain1.html)
2. [Domain 2: Security](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/developer-associate-03-domain2.html)
3. [Domain 3: Testing and Deployment](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/developer-associate-03-domain3.html)
4. [Domain 4: Troubleshooting and Optimization](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/developer-associate-03-domain4.html)

## Mapping and acceptance evidence still required

Every row below is **Not assessed for implementation in this research task**.
The integrating code must calculate actual field/practice coverage separately.

| Mode | Evidence needed before treating a row as implemented |
| --- | --- |
| configuration | Relevant typed fields, variant/dependency validation, sources and a failure scenario |
| code | Reviewable application/SDK/query/test code and explanation of expected behavior |
| concept | A reasoned comparison or scenario, including constraints and tradeoffs |
| mixed | Coordinated configuration and code/scenario evidence; neither one alone is sufficient |

| Skill | Expected mode | Relevant service IDs | Expected existing theory locations |
| --- | --- | --- | --- |
| 1.1.1 | mixed | `sqs`, `sns`, `eventbridge`, `step-functions` | `dev-application#dev-application-s1` |
| 1.1.2 | mixed | `api`, `lambda`, `sqs`, `eventbridge` | `dev-application#dev-application-s1`; `dev-lambda#dev-lambda-s3` |
| 1.1.3 | mixed | `lambda`, `sqs`, `step-functions`, `cli` | `dev-application#dev-application-s4` |
| 1.1.4 | mixed | `api`, `lambda` | `dev-application#dev-application-s2`; `dev-application#dev-application-s3` |
| 1.1.5 | mixed | `cli`, `lambda`, `sts`, `iam` | `dev-application#dev-application-s4` |
| 1.1.6 | mixed | `kinesis`, `firehose`, `lambda` | `dev-events#dev-events-s5` |
| 1.1.7 | code | `lambda`, `api`, `dynamodb`, `s3` | `dev-data-safety#dev-data-safety-s3` |
| 1.1.8 | mixed | `eventbridge`, `s3`, `sqs`, `sns`, `lambda` | `dev-events#dev-events-s3`; `dev-objects#dev-objects-s6` |
| 1.1.9 | mixed | `kiro` | `dev-ai-integration#dev-ai-integration-s6` |
| 1.1.10 | mixed | `bedrock`, `agentcore`, `quick`, `lambda` | `dev-ai-integration#dev-ai-integration-s2`; `dev-ai-integration#dev-ai-integration-s3`; `dev-ai-integration#dev-ai-integration-s4`; `dev-ai-integration#dev-ai-integration-s5` |
| 1.2.1 | configuration | `lambda`, `vpc`, `privatelink`, `rds`, `secrets-manager` | `dev-lambda#dev-lambda-s5` |
| 1.2.2 | configuration | `lambda` | `dev-lambda#dev-lambda-s1`; `dev-lambda#dev-lambda-s2`; `dev-lambda#dev-lambda-s4` |
| 1.2.3 | mixed | `lambda`, `sqs`, `sns`, `eventbridge` | `dev-lambda#dev-lambda-s3`; `dev-lambda#dev-lambda-s4` |
| 1.2.4 | mixed | `lambda`, `api`, `dynamodb`, `sqs`, `s3`, `eventbridge` | `dev-events#dev-events-s2`; `dev-lambda#dev-lambda-s5` |
| 1.3.1 | mixed | `s3`, `glacier`, `dynamodb`, `cloudwatch-logs` | `dev-objects#dev-objects-s4`; `dev-data-safety#dev-data-safety-s3` |
| 1.3.2 | concept | `dynamodb`, `s3`, `rds`, `aurora`, `elasticache`, `opensearch` | `dev-data-safety#dev-data-safety-s4` |
| 1.3.3 | mixed | `elasticache`, `dynamodb`, `cloudfront` | `dev-data-safety#dev-data-safety-s6` |
| 1.3.4 | mixed | `dynamodb` | `dev-dynamodb#dev-dynamodb-s1`; `dev-dynamodb#dev-dynamodb-s2`; `dev-dynamodb#dev-dynamodb-s3`; `dev-dynamodb#dev-dynamodb-s4` |
| 2.1.1 | mixed | `cognito`, `sts`, `iam` | `security-cognito#choice`; `security-cognito#federation` |
| 2.1.2 | mixed | `cognito`, `api`, `iam`, `sts` | `security-cognito#federation`; `security-cognito#verification`; `security-cognito#scopes` |
| 2.1.3 | mixed | `cli`, `cloudshell`, `sts`, `iam` | `security-iam-sts#principal` |
| 2.1.4 | mixed | `s3`, `cloudfront` | `security-iam-sts#signed-access`; `dev-objects#dev-objects-s2` |
| 2.1.5 | mixed | `iam`, `sts`, `lambda`, `ecs`, `ec2`, `cli` | `security-iam-sts#principal` |
| 2.1.6 | mixed | `iam`, `lambda`, `s3`, `sqs`, `kms` | `security-iam-sts#policies`; `security-iam-sts#conditions` |
| 2.1.7 | mixed | `sts`, `iam`, `cognito` | `security-iam-sts#assume` |
| 2.2.1 | configuration | `kms`, `s3`, `rds`, `aurora`, `efs`, `ebs`, `acm` | `security-sensitive-data#storage`; `security-kms#layers` |
| 2.2.2 | mixed | `acm`, `private-ca`, `api`, `cloudfront`, `elb` | `security-sensitive-data#certificates` |
| 2.2.3 | mixed | `kms`, `s3`, `lambda` | `security-sensitive-data#storage` |
| 2.2.4 | mixed | `kms`, `s3`, `secrets-manager` | `security-kms#envelope`; `security-kms#authorization` |
| 2.2.5 | mixed | `acm`, `private-ca`, `ec2` | `security-sensitive-data#certificates` |
| 2.2.6 | mixed | `lambda`, `api`, `s3`, `cloudwatch-logs`, `bedrock` | `security-sensitive-data#classification`; `security-sensitive-data#masking`; `security-sensitive-data#tenants` |
| 2.2.7 | mixed | `secrets-manager`, `systems-manager`, `kms`, `lambda`, `ecs` | `security-sensitive-data#secrets` |
| 2.3.1 | mixed | `bedrock`, `agentcore`, `iam` | `security-ai-controls#access` |
| 2.3.2 | mixed | `bedrock`, `agentcore`, `privatelink`, `vpc`, `quick` | `security-ai-controls#privacy` |
| 2.3.3 | mixed | `bedrock`, `agentcore`, `quick`, `kiro` | `security-ai-controls#filter` |
| 2.3.4 | mixed | `agentcore`, `bedrock`, `iam`, `kiro` | `security-ai-controls#agent` |
| 2.3.5 | mixed | `cloudwatch-logs`, `cloudwatch`, `xray`, `bedrock`, `agentcore` | `security-ai-controls#monitor` |
| 3.1.1 | mixed | `lambda`, `codebuild`, `ecr`, `systems-manager`, `secrets-manager` | `release-artifacts#zip-image` |
| 3.1.2 | mixed | `ecr`, `codebuild`, `ecs`, `eks` | `release-artifacts#container-artifact` |
| 3.1.3 | mixed | `codepipeline`, `codebuild`, `amplify` | `build-pipelines#chain` |
| 3.1.4 | configuration | `appconfig`, `systems-manager`, `secrets-manager`, `api`, `lambda` | `release-environments#config-selection` |
| 3.1.5 | configuration | `api` | `release-environments#stages` |
| 3.2.1 | mixed | `sam`, `cdk`, `cloudformation`, `lambda`, `codebuild` | `layered-testing#unit-example`; `layered-testing#deployed-tests` |
| 3.2.2 | mixed | `api`, `lambda`, `sam`, `codebuild` | `layered-testing#ai-workflow`; `layered-testing#unit-example` |
| 3.2.3 | code | `lambda`, `api`, `eventbridge`, `sqs`, `s3` | `layered-testing#fixtures` |
| 3.2.4 | configuration | `lambda`, `ecr`, `ecs`, `eks`, `amplify`, `api` | `release-environments#aliases`; `release-environments#identity` |
| 3.2.5 | mixed | `kiro`, `codebuild` | `layered-testing#ai-workflow` |
| 3.3.1 | mixed | `lambda`, `sam`, `codebuild`, `ecr` | `release-artifacts#zip-image`; `release-artifacts#resources` |
| 3.3.2 | mixed | `ecs`, `eks`, `ecr`, `codebuild` | `progressive-release#containers-c03` |
| 3.3.3 | mixed | `cloudformation`, `sam`, `cdk` | `release-artifacts#sam-build`; `release-artifacts#iac-review` |
| 3.3.4 | configuration | `codedeploy`, `lambda`, `ec2`, `ecs` | `progressive-release#platforms` |
| 3.3.5 | configuration | `codepipeline`, `codebuild`, `codedeploy` | `build-pipelines#ordering` |
| 3.3.6 | mixed | `codedeploy`, `lambda`, `ecs`, `elastic-beanstalk`, `api` | `progressive-release#strategy-contract`; `progressive-release#platforms` |
| 3.3.7 | mixed | `cloudformation`, `codedeploy`, `cloudwatch`, `appconfig` | `progressive-release#rollback` |
| 3.3.8 | mixed | `codepipeline`, `codebuild`, `amplify`, `ecr` | `release-environments#aliases` |
| 3.3.9 | mixed | `kiro`, `codepipeline`, `codebuild`, `cloudformation` | `build-pipelines#ai-ci` |
| 4.1.1 | mixed | `lambda`, `api`, `cloudwatch-logs`, `xray`, `codebuild` | `release-artifacts#artifact-exercise`; `observe-debug#query` |
| 4.1.2 | mixed | `cloudwatch`, `cloudwatch-logs`, `xray` | `observe-debug#trace` |
| 4.1.3 | code | `cloudwatch-logs` | `observe-debug#query` |
| 4.1.4 | mixed | `codebuild`, `codedeploy`, `codepipeline`, `cloudformation`, `cloudwatch-logs` | `build-pipelines#failure-evidence` |
| 4.1.5 | mixed | `kiro`, `quick`, `cloudwatch-logs`, `cloudwatch` | `observe-debug#current-ai` |
| 4.2.1 | mixed | `cloudwatch-logs`, `lambda`, `api`, `ecs` | `observe-debug#structured` |
| 4.2.2 | code | `cloudwatch`, `cloudwatch-logs`, `lambda` | `measure-optimize#emf-example` |
| 4.2.3 | configuration | `cloudwatch`, `sns`, `codedeploy`, `codepipeline` | `measure-optimize#alarm` |
| 4.2.4 | mixed | `xray`, `lambda`, `api`, `ecs` | `observe-debug#trace` |
| 4.2.5 | mixed | `elb`, `ecs`, `eks`, `elastic-beanstalk`, `cloudwatch` | `observe-debug#deploy-health` |
| 4.3.1 | mixed | `lambda`, `ec2`, `ecs`, `rds`, `aurora` | `measure-optimize#concurrency-profile` |
| 4.3.2 | mixed | `lambda`, `ec2`, `ecs`, `eks`, `cloudwatch` | `release-artifacts#resources`; `measure-optimize#concurrency-profile` |
| 4.3.3 | mixed | `sqs`, `sns`, `lambda`, `eventbridge` | `measure-optimize#messaging-ai` |
| 4.3.4 | mixed | `elasticache`, `dynamodb`, `cloudfront` | `measure-optimize#cache` |
| 4.3.5 | mixed | `cloudwatch`, `cloudwatch-logs`, `xray`, `lambda`, `dynamodb` | `observe-debug#trace`; `observe-debug#query`; `measure-optimize#log-bottlenecks` |
| 4.3.6 | mixed | `kiro`, `quick`, `cloudwatch`, `xray` | `measure-optimize#messaging-ai` |

## Important boundaries and gaps to check during integration

- All configuration/editor/practice statuses remain unassessed here; the new
  registry and scenario runner were being built concurrently. Do not replace
  this with a blanket "72 skills complete" label based on matching IDs.
- Skills 1.1.7, 3.2.3, 4.1.3 and 4.2.2 are explicitly code-oriented: serialization,
  event fixtures, log queries and custom metric emission need examples or
  exercises beyond a form. The current theory index points to candidate sections.
- SDK calls/retries/signing/pagination (1.1.3, 1.1.5, 2.1.3, 2.1.5) require code
  behavior and credential-resolution reasoning, not stored real credentials.
- IAM scenario evaluation must distinguish trust, identity and resource policies,
  request context and supported policy subsets. A selected policy name is not
  proof of effective AWS access (2.1.1–2.1.7).
- Certificate/SSH development work (2.2.5) is broader than an ACM picker. Use safe
  mock/review artifacts or clear instructions; do not generate/store real private
  keys as lesson fixtures.
- AI development/testing/CI/diagnosis/optimization skills need reviewable artifacts
  and evidence validation. Merely adding an AI-service node does not implement
  them (1.1.9, 3.2.5, 3.3.9, 4.1.5, 4.3.6).
- AI controls are application of access/privacy/input-output/tool/session/telemetry
  boundaries (2.3.1–2.3.5), not a claim that full FM selection, prompt engineering,
  RAG architecture or an AI governance framework is required by the target role.
- Source repositories, Docker tooling and Copilot appear as concepts/examples in
  the official skills but need not be invented as extra AWS canvas services.
- A live integration, application test environment or deployment remains distinct
  from a local deterministic preview and from theory-page navigation.
- AppSync and Q Developer remain legacy C02 graph compatibility. They are not
  substituted for the C03 managed-AI or Kiro mappings in this data.


## Follow-up: original scenario knowledge checks (2026-11-02)

`src/configurationKnowledgeChecks.ts` now supplies one original short question
for each of the72 mapped skills. These are study questions, not AWS exam items,
a copied PDF/exam dump, or proof of comprehensive skill mastery. Each question
has four distinct options, a correct-answer index, an explanation and an official
source URL. Correct answers are rotated deterministically:18 at each index0–3.

The four code-oriented skills have illustrative snippets: proxy-response JSON
serialization (1.1.7), a reduced SQS fixture (3.2.3), a Logs Insights aggregation
(4.1.3), and an EMF event (4.2.2). They are not executed against AWS. The fixture
and EMF comments explicitly state their learning boundaries.

Source checking included direct reading of official service references for core
contracts, IAM/JWT/presigned access, encryption/secrets, release controls and
telemetry. A58-URL HTTP check found all reachable; broad redirects for the SDK
pagination and private-CA examples were replaced with their specific current
pages. Reachability alone is not technical validation, and no source check is a
claim to cover every variant. Where the question concerns evidence/AI workflow
ownership rather than a specific API guarantee, its source is the matching C03
domain page and the scenario is original reasoning practice.

Strict standalone TypeScript and in-memory esbuild integrity checks verified72
unique skill IDs, four distinct choices per question, valid answer indexes,
nonempty explanations/sources, and all four required snippets. Actual UI grading,
per-service navigation and end-to-end Practice integration are owned by the
parent implementation and are not claimed by this data-authoring task.
