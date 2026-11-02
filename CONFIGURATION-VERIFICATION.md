# Configuration schema2 handoff

## Compact help controls and agentic expansion plan — 2026-11-02

- Shared ContextHelp now uses a 16px Lucide icon inside a 24px desktop target
  (32px for coarse pointers), with transparent background, small inline spacing,
  hover/open styling and preserved accessible names/focus/Escape behavior.
- In-app browser measured 16×16px visual bounds and 24×24px target bounds beside
  Architecture assistant; popup opening and keyboard Escape dismissal were checked.
  Local preview cannot use the production-only backend CORS origin and displays
  disconnected there; no model call was made for UI verification.
- Existing 678 tests across 52 files passed; frontend and backend typechecks/builds
  and fixture HTTP/SSE smoke passed. Existing Vite bundle warning remains.
- AGENTIC-COMPONENTS-PLAN.md is a researched implementation plan, not a delivered
  AgentCore component pack. Catalog/schema counts remain unchanged in this release.

## Publication and observation follow-up — 2026-11-02

The owner authorized commit/push and complete frontend/backend deployment after
each completed change batch; this preference is recorded in AGENTS.md.
CONFIGURATION-NEXT-PLAN.md records the new browser/code observations and the
proposed next batches, without claiming those features are implemented.

Before publication, the inspector repair path was adjusted so pre-existing errors
on unrelated nodes do not block repairing the current node; new dependency errors
still block Save. Regression tests cover both cases. Backend status now returns a
validated Render buildRevision and configurationAudit capability for release checks.

Final local verification for this follow-up: **678 tests / 52 files passed**,
frontend build/typecheck, backend typecheck/build and fixture HTTP/SSE smoke passed.
The existing Vite bundle-size advisory remains. Production release evidence is
reported in the publication handoff rather than inferred from these local checks.

## Configuration fidelity audit — 2026-11-02

See [the detailed audit](CONFIGURATION-AUDIT-2026-11-02.md),
[all-service matrix](CONFIG-AUDIT-MATRIX.md) and
[field inventory](CONFIG-FIELD-INVENTORY.json). The inventory covers 58 service
profiles, 925 root fields and 1405 including table columns. 112 fields have new,
explicitly scoped audit metadata; this is not a claim that every field or AWS
behavior has been independently verified.

- Added CIDR parsing/allocation/containment/overlap checks; protocol-specific
  SG/NACL validation and selected network resource compatibility checks.
- EC2 can choose a declared subnet/VPC frame and existing shared security groups.
  SG assignments and configuration save/cancel together; external references
  remain explicitly unresolved. Shared group rules are not copied into inline notes.
- Added source-backed bounds and variant/cross-resource checks across compute,
  storage, messaging, IAM/STS/KMS, monitoring, WAF and delivery profiles.
- Field help now includes applicable constraints, sources and audit scope. Network
  frame settings and IAM controls have question-mark help. Invalid frame edits
  remain editable and require Save; invalid values are not silently clamped.
- Numeric/text-bound-invalid historical configuration can be reopened for correction
  through the storage-only editable reader; type/shape guards and strict mutation
  validation remain enabled. The original persisted values are preserved.
- Final automated suite: **675 tests passed / 52 files**. Frontend TypeScript and
  production build passed; backend TypeScript and production build passed.
- HTTP/SSE schema2 fixture smoke passed with an injected provider transport;
  no live OpenAI or AWS request was made. Sensitive-file scanner passed for the
  indexed files. New audit artifacts contain metadata, synthetic fixtures and public
  references only.
- Real in-app browser: opened local Builder, added synthetic EC2, opened field
  help, found and fixed popup clipping at 320 px panel width, verified source/range
  readability, entered IMDS hop limit 65 and observed Save disabled, then canceled
  and inspected Networking selectors. The screenshot is
  `artifacts/configuration-audit/field-help.jpg`. The complete subnet/SG Save/Cancel
  workflow is covered by interaction tests, not claimed as a full browser E2E.
- Browser console showed React Flow nodeTypes/edgeTypes warnings during hot reload;
  no captured browser error was observed in those interactions. Vite still reports
  the existing large main-bundle advisory. No mobile/device matrix or AWS deployment
  verification is claimed.
- Changes are local source changes. No commit, push, frontend publication or backend
  deployment was performed for this audit.

The historical handoff below describes the previous milestone.

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
- Merged with theory commit cfa310c653597c087325b731c3a7da98632155d3
  (cherry-picked as185a5dc):550 tests passed across36 files. Both TypeScript
  checks, frontend/backend production builds, HTTP/SSE smoke and the sensitive-file
  check passed. npm audit --omit=dev reported0 vulnerabilities.
  Vite's existing main-bundle size advisory remains; the editor
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
