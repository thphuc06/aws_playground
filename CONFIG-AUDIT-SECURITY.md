# Security and AI configuration audit — 2026-11-01

This data contribution expands 14 service profiles (12 C03 named services plus
legacy AppSync/Q Developer) into structured DVA-level configuration definitions.
It contains 245 definitions counting nested table columns. Sources/objectives
are attached to every definition. No secret values, AWS requests, deployments,
real IAM evaluation or paid model calls were performed.

## Coverage decisions

| Service | Configuration coverage | Important learning checks/limits |
| --- | --- | --- |
| IAM | Principal/role context; trust; managed attachments; inline identity policy table; identity/resource JSON; boundary/session restriction; condition examples; session context; tags; external restrictions; audit | Trust is separate from execution permission. Boundaries/session policies restrict rather than grant. Unknown organization/resource/session context cannot establish Allow. User/group administration remains outside developer scope. |
| STS | Operation, role reference, session name/duration, external/source identity, session/transitive tags, inline/managed restrictions, MFA assertion, chaining, endpoint and refresh | Operation and role/chaining duration constraints differ. Temporary credentials are never entered, stored or logged. Trust and caller permissions must match the selected operation. |
| Cognito | User/identity/both, sign-up, identifiers/MFA, password policy, per-app OAuth client/grants/PKCE/redirects/scopes/lifetimes, IdPs, token claims, identity roles/mappings, triggers, revocation | User pools issue tokens; identity pools can issue AWS credentials. Public browser clients cannot keep a secret. Login is not application authorization. Public self-registration contradicts owner-only enrollment unless deliberately controlled. MFA delivery/feature-plan support is conditional. |
| KMS | Ownership/spec/usage/alias, key policy/grants, encryption context, rotation/state/deletion, material origin, multi-Region notes, cross-account, endpoint, audit | Key policy authorization is not replaceable with a generic IAM allow. Rotation does not re-encrypt old ciphertext. Key type/origin affects rotation; no universal quota or rotation period is fabricated. The key-spec picker is a DVA-relevant subset, not every KMS algorithm. |
| Secrets Manager | Purpose/reference, key/role/resource policy, staging label, cache strategy/TTL, managed/Lambda rotation, schedule, replicas, endpoint, failure behavior and redaction | Managed rotation may not use Lambda. Lambda rotation must update/test the dependent service too. Customer-key access and secret access are separate. Cache/security behavior depends on implementation. No plaintext secret field exists. |
| ACM | Certificate source, names, validation, algorithms, Region/consumer, CA reference, validation records, renewal and expiry | Imported/manual renewal differs from managed-eligible renewal. Algorithm and Region support depend on issuance/import/consumer. A declared DNS record does not prove validation. No certificate/private-key upload. |
| Private CA | CA type/mode, subject/algorithm, issuance policy/template/validity, revocation, CRL bucket, audit and client trust | Private certificates need client trust. Issuance validity depends on parent/mode/template. Full PKI architecture and CA administration are beyond this slice. |
| WAF | Scope/resource, default action, ordered rule table/JSON, managed groups, rate aggregation, count-first rollout, logging/redaction/sampling and capacity notes | Resource/API variant compatibility must be checked. Allow/Block can terminate evaluation; Count does not. Rate protection is not a precise spending cap. Capacity/body-inspection limits depend on feature/resource. |
| Bedrock | Inference operation/model/Region, role/policy, parameter table, deadlines/attempts, privacy/guardrail reference, tool boundary/output validation, history, endpoint, telemetry/quota notes | Converse requires InvokeModel permission; streaming requires the stream action. Model/API/Region capabilities differ. Fields apply existing controls; selecting/training FMs or designing a full RAG/governance platform is outside DVA scope. |
| AgentCore | Workload purpose, inbound auth/runtime role/JWT, outbound tool identity/actions/approval, session/memory isolation, idle intent, networking, safe telemetry and failure policy | Model output does not grant tool authority. Inbound and outbound authorization are distinct. Hosted agent runtime is not automatically needed for simple model inference. No agent is executed. |
| Amazon Quick | Use case/source/admin management, knowledge role, user/group sharing, connection sharing, privacy, citation/output review, telemetry | Owner/co-owner and source-connection sharing are restricted to supported admin-managed SharePoint/Google Drive sources. Viewer can query; sharing does not grant unrestricted underlying data access. |
| Kiro | Workflow, steering table/inclusion, requirements, context/tool/action boundaries, environment variable names, checks/diff review, synthetic fixtures and failures | Developer-tool planning, not application traffic. Review output/tests; do not treat generated code as verified. Secret values are not entered. |
| AppSync | Legacy API/auth modes, additional auth, schema artifact, resolver/data source table/runtime, service role, caching/logging | Retained for C02 graph compatibility. GraphQL SDL is an artifact, not JSON. Client authorization differs from data-source role permission. No GraphQL execution or complete resolver schema. |
| Q Developer | Legacy development use, approved identity/context, actions/approval, verification and telemetry | Compatibility only. No actual Q invocation or promise of universal privacy/retention behavior. |

## AWS managed-policy snapshots

Eight public reference pages were opened and their default-version JSON documents
transcribed structurally without changing Action, Resource, Sid, Version or
Statement contents. Whitespace is not retained. Metadata includes original ARN,
source URL and the version observed on the verification date.

| Policy | Observed default version | Important interpretation |
| --- | --- | --- |
| AWSLambdaBasicExecutionRole | v1 | Writes CloudWatch Logs; does not grant application-data access. |
| AWSLambdaVPCAccessExecutionRole | v3 | Includes network-interface operations and logs; VPC placement itself does not grant application permissions or internet routing. |
| AWSLambdaSQSQueueExecutionRole | v1 | Receive/Delete/GetQueueAttributes plus logs; not producer SendMessage. |
| AWSLambdaDynamoDBExecutionRole | v1 | DynamoDB **Streams reads** plus logs; not table PutItem. |
| AWSXRayDaemonWriteAccess | v2 | Trace/telemetry writes plus sampling-data reads. |
| AmazonECSTaskExecutionRolePolicy | v1 | Image pulls and log delivery for execution; not the application task role. |
| AmazonEC2ContainerRegistryReadOnly | v3 | Repository/image/read metadata access; not push. |
| AmazonS3ReadOnlyAccess | v3 | Broad Get/List/Describe access and Object Lambda read/list; not a scoped bucket-only policy. |

All eight use wildcard resources in the checked documents. The picker must not
present them as least-privilege recommendations. AWS may update managed policy
versions; offline snapshots do not claim to be live account policy state.

## Source verification boundaries

Directly opened official docs cover IAM policy types/trust/boundaries; STS
AssumeRole; Cognito user pools, clients, identity pools and MFA; KMS key policies,
rotation and deletion; Secrets access/rotation/cache; ACM overview/integrations;
Private CA overview; WAF ACL/actions; Bedrock Converse; AgentCore inbound/outbound
auth; Quick sharing; Kiro steering; AppSync authorization and Q security. Sources
are recorded alongside fields; the broad guide is context, not proof that every
possible field combination is implemented or that AWS operations were run.

The candidate Private CA `ca-options.html` URL was inaccessible and was not added
as a field source. Algorithm/template/certificate consumer compatibility needs
service-specific validation rather than treating the picker union as universally
valid. No arbitrary numeric quota was introduced for these conditional fields.

## Expected local scenarios for the main configuration framework

- Allow/explicit-deny/implicit-deny; trust versus identity permissions; unsupported
  conditions/session/cross-account contexts return Not evaluated.
- Cognito public client with secret, owner-only app with self-sign-up, missing
  required issuer/audience/scopes, unauthenticated identity with broad role.
- KMS IAM allow without appropriate key authorization; rotation on ineligible
  key context; dependent ciphertext after disable/delete.
- Secret retrieval without KMS access, incompatible rotation/cache plan and
  secret logging; managed rotation without an unnecessary Lambda requirement.
- WAF with unsupported API/resource variant, Count mistaken for Block, unsafe
  logging and mismatched resource scope.
- Bedrock API/model/Region unknown, missing correct invocation action, unsafe
  prompt/log retention, unbounded retries; AgentCore tool actions without identity
  or approval/isolation controls.

These cases describe validation requirements; they are not claims that this
data-only contribution implements the parent-owned evaluator or all scenarios.
