# Configuration schema2 handoff

Snapshot: 2026-11-02. This document describes the configuration upgrade; earlier
assistant and coverage reports remain historical records of their milestones.

## Delivered behavior

- 56 current C03 services and2 legacy service IDs share typed frontend/backend
  metadata:925 root settings,1405 fields including table columns, with dated
  official sources, objectives, units, documented defaults and quota context.
- The760px inspector expands to a full editor, with Overview, Configuration,
  Permissions, Networking, Reliability, Monitoring, Deployment and Practice tabs
  where relevant. Structured tables, key/value inputs, references and lazy-loaded
  JSON/YAML CodeMirror editors replace free-form prose for supported settings.
- Draft edits require Save configuration. Cancel preserves saved diagram values.
  Unsaved changes guard selection, tab/graph changes and leaving the page.
- Each graph owns an independent security library. Eight exact AWS-managed policy
  snapshots can be selected read-only or copied to a custom policy. Identity,
  trust, resource, endpoint, session, boundary and KMS concepts stay distinct.
  Basic policies have a visual editor; unsupported JSON stays intact in JSON mode.
- The bounded local policy evaluator reports explicit deny, implicit deny,
  allowed-within-this-model or not-evaluated. It is not the AWS IAM simulator.
  Unsupported conditions/context, cross-account and complete KMS authorization
  are not asserted. Boundaries restrict permissions rather than granting them.
- Shared schemas, atomic configure_resources and update_security_library tools
  let the AI configure its isolated draft. Strict function schemas are dynamically
  loaded within provider property/enum/depth limits. The original graph remains
  separate. No new tools deploy AWS or run arbitrary code.
- All72 skill IDs have an original sourced knowledge check, including snippets
  for the4 code-focused skills. There are18 domain valid/invalid configuration
  exercises plus3 code-reading exercises. Other services offer explicitly labeled
  schema exercises. Forms are not a substitute for application-code/runtime labs.

## Data compatibility

Workspace version3 uses aws-playground-workspace-v3. Reading version2 or the old
builder graph copies data; old storage keys remain intact as backups. Compatible
non-text values migrate into typed configuration schema2; old prose is retained
in Legacy notes rather than treated as configured IAM or verified AWS state.
Original and AI diagrams, security libraries, purposes and reports remain separate.
Old reports can describe an older snapshot and must be rerun before adoption.

## Limits and scope

- JSON/YAML documents:256KiB UTF-8, depth32,20000 parsed entries; YAML aliases and
  unsafe keys are rejected. Known CloudFormation tags are preserved as raw text;
  intrinsics, shell commands, ASL tasks and application code are not executed.
- Tables and multi-selects:100 rows/items; text fields:2000 characters. These are
  application guardrails. They must not be described as AWS service quotas.
- AWS policy quotas distinguish bytes, characters, whitespace, aggregation and
  adjustable account quotas. The quota panel preserves documented KB without
  inventing a conversion. KMS has an explicit32768-byte source-backed check.
- Graph bounds remain100 nodes/200 edges. Workflow defaults remain8 Responses,
  24 function calls,2 searches,8192 output tokens per Response,300 seconds, one
  simultaneous workflow and3 starts/minute per process. No provider auto-retry.
- Assistant body limit is1MiB; the legacy review endpoint retains its own bounds.
  No disk, mandatory caller token, database or USD ledger was introduced.
- No finite form models the entire AWS Console. Field/source associations and
  knowledge checks do not establish complete mastery of an exam skill. Consult
  CONFIG-AUDIT-CORE/PLATFORM/DELIVERY/SECURITY.md and CONFIG-SKILL-AUDIT.md for gaps.

## Verification

- Plain npm ci succeeded on Node22 after stopping the project's existing Vite
  process that held esbuild.exe open. No dependency workaround is required by CI.
- Automated checks cover schema generation/runtime agreement, atomic tool edits,
  source/skill metadata, policy snapshots and bounded evaluation, document safety,
  draft Save/Cancel, invalid JSON retention, migrations and isolated workspaces.
- JSDOM interaction tests mock the document editor as a textarea. SSR/JSDOM are
  not real-browser layout, keyboard or CodeMirror verification. Browser E2E was
  not performed because browser preview access was unavailable in this session.
- Real HTTP/SSE smoke tests use an injected local provider fixture: they check
  capability negotiation, CORS and a typed configuration roundtrip without paid
  OpenAI calls or AWS requests. No new live Sol/AWS validation is claimed.
- Full merged test/typecheck/build results and deployment commits are recorded in
  the final handoff. Vite's existing main-bundle size advisory remains; the editor
  is lazy-loaded. Source URL reachability is not runtime feature verification.

## Deployment

Deploy the latest main commit on Render. Frontend capability negotiation requires
configurationSchema:2; an old backend produces an explicit deployment message.
The status endpoint also advertises workspaceSchema:3. No new environment fields:
keep REVIEW_MODEL=gpt-6.1-sol, REVIEW_ENABLED=true, Node22, the valid backend key
and the exact allowed Site origin. Keep removed disk/token/USD-ledger variables
removed. Do not paste secrets into source, chat or screenshots.

Publish the same frontend source to the existing owner-private Site. Auto-deploy
on Render should be allowed to finish rather than triggering a duplicate deploy.
