# Current DVA-C03 assistant update

Delivery preference and release checks: [AGENTS.md](AGENTS.md).
Next implementation batches from browser/code observations:
[CONFIGURATION-NEXT-PLAN.md](CONFIGURATION-NEXT-PLAN.md).

Configuration fidelity audit (2026-11-02): see
[detailed findings and fixes](CONFIGURATION-AUDIT-2026-11-02.md),
[the 58-service review matrix](CONFIG-AUDIT-MATRIX.md), and
[per-field metadata](CONFIG-FIELD-INVENTORY.json). New checks cover documented
network constraints, resource selection and several service-specific ranges and
incompatibilities. Remaining gaps are explicit; this is not complete AWS Console
or runtime validation.

See [TERRA-WORKFLOW.md](TERRA-WORKFLOW.md) for the Terra migration, extended workflow limits and resumable checkpoints.

The Builder has **My architecture** and **AI review & proposal**, with one
**Review & build proposal** action. Live activity shows actual tools/searches;
the report explains the current design, services and proposed configuration changes.
Use System purpose, priority and protected services to guide the configured model (GPT-6.1 Terra by default).
An isolated editable draft supports Preview/adoption/Undo; both diagrams persist
independently. Architecture settings are separate from legacy simulation lessons.

The canvas includes56 C03 services plus2 legacy IDs. Configuration schema2 now has
925 top-level fields (1405 including table columns), a tabbed expandable editor,
JSON/YAML documents, shared IAM roles/policies and bounded local checks. See
[CONFIG-COVERAGE-MATRIX.md](CONFIG-COVERAGE-MATRIX.md) for service/skill evidence,
[CONFIGURATION-VERIFICATION.md](CONFIGURATION-VERIFICATION.md) for validation and limits,
and [ICONS.md](ICONS.md) for official artwork and the explicit SAM fallback.
The older DVA-ARCHITECTURE-COVERAGE.md describes the preceding326-field milestone.
The OpenAI key stays backend-side. No disk, reviewer token or USD cap is used.
See LOCAL-SETUP.md, DEPLOY-RENDER.md and ASSISTANT-VERIFICATION.md for current setup.

Earlier milestone descriptions below document the original learning lessons;
their47-service and original-provider notes do not describe the new assistant.

---

# AWS Developer Playground

A private, browser-only AWS Developer Associate learning workspace: an editable architecture canvas, 47-entry C02 service catalog, 47 source-reviewed study briefs and bounded configuration lessons, plus a separately versioned C02/C03 theory library. It is not a complete exam course or a production AWS design validator.

## Run locally

Start with **[LOCAL-SETUP.md](LOCAL-SETUP.md)** for Windows/WSL and private
configuration, **[DEPLOY-RENDER.md](DEPLOY-RENDER.md)** for the connected Render
Blueprint, and **[SETUP-VERIFICATION.md](SETUP-VERIFICATION.md)** for this setup's
observed results. The Blueprint uses Free compute without disk; configure private secrets to enable AI.

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
```

React 19, TypeScript, Vite, React Flow and Lucide. The learning canvas remains browser-local with no AWS operations. An optional, separately user-hosted Node backend now supports AI architecture review; it is disconnected by default and may incur OpenAI API charges only after private owner setup and explicit requests. The default page is the C03-first Home overview; old `?view=explore` links still resolve to Builder. Explicit C02 links and legacy foundation chapter links are preserved.

## Build and study

- Search/filter the categorized catalog. All 47 entries from AWS's published in-scope list are draggable/placeable; AWS explicitly calls that list non-exhaustive and changeable. Snapshot verified 2026-11-01.
- Drag service cards to the canvas, or use Add. Desktop has a collapsible left catalog sidebar and an independent learning-navigation toggle. The canvas expands when either panel is hidden. On narrow screens the catalog opens as a left drawer with Escape dismissal and focus management, not an inline expanding section. Sidebar preferences persist locally without changing the graph.
- Drag between node handles. Touch/keyboard alternatives: select a node, choose Connect to…, then select the destination. Enter/Space activates a focused node/arrow.
- Select arrows to inspect configuration or type a descriptive relationship label. Labels do not change actual integration semantics. Move source/target actions or endpoint dragging reconnect arrows; invalid/canceled changes preserve the original. Valid endpoint changes retain labels and reset permissions for review.
- Backspace/Delete applies only to selected canvas items, never text/configuration editing. Delete selected is available for touch. Removing a node removes incident edges/settings; deleting an arrow preserves sibling connections.
- Multiple instances, fan-in and fan-out are supported. Duplicate arrows for the same ordered pair are not modeled. Canvas bounds: 100 nodes / 200 edges.
- Select a service to read its reviewed study brief, source dates and explicit coverage gaps. Configuration/reliability/security notes are educational, not automatically enforced by the graph engine.

## Honest coverage levels

1. **Reference placement:** all 47 published-list entries. Includes EventBridge, IAM, S3 and other services not simulated here. Reference relationships are allowed and dashed, but unvalidated/non-executable.
2. **Checked integration/configuration:** API Gateway → Lambda, Lambda → DynamoDB, Lambda → SQS, SQS → Lambda. Resource invocation policy is distinguished from execution-role permissions; SQS mapping/timeouts are modeled explicitly.
3. **Simulated walkthrough:** only graphs fully within those supported rules, without cycles or validation errors. It is a deterministic dependency trace, not timing, distributed processing, exactly-once delivery or a deployment guarantee.

Reference-only nodes/edges block the whole simulated walkthrough, not drawing or saving. “Model limit” does not mean an AWS architecture is invalid. The four teaching rules assume same account/Region and omit network, KMS, cross-account and complete IAM evaluation. Permission switches are assertions, not a JSON policy evaluator. Detailed assumptions and official references appear in the app.

All 47 study briefs include purpose, use cases, exam relevance, configuration, security, reliability, observability, an educational example, misconceptions, caveats and source provenance. Their 123 source references represent 120 unique official AWS URLs. Review means a bounded sourced brief, not exhaustive facts or prediction of exam questions. New product features are distinguished from confirmed exam scope.

## Source map

- `src/Builder.tsx`, `builder.css`: canvas, catalog, direct manipulation, inspector and local graph persistence.
- `src/builderRules.ts` and tests: typed graph validation and bounded simulation.
- `src/serviceCatalog.ts` and tests: official 47-entry snapshot, categories/counts and scope sources.
- `src/serviceDetails*.ts`, `serviceDetailTypes.ts`, `ServiceDetailPanel.tsx`: three researched data groups, aggregate, integrity tests and expandable study panels.
- `src/content.ts`: three original theory chapters, examples, questions and curriculum sources.
- `src/main.tsx`, `style.css`: navigation, theory, practice, progress and layout.
- `src/engine.ts` and tests: original detailed serverless/queue/canary teaching engines retained for future integration, not separate fixed-diagram pages.

## Privacy, accessibility and limits

Graph/progress data stays in versioned localStorage, separately keyed. Changing browsers or clearing storage loses it. Source examples are not executed against AWS. External references open official AWS pages; fonts may load from Google Fonts with system fallback. Keyboard labels/focus, reduced motion and mobile layouts are provided; this is not a formal accessibility certification. See `VERIFICATION.md` for actual checks and limits.

## Future roadmap

Optional grounded AI tutoring and deeper service integration models are not implemented. No API keys, paid model requests, billing integration or automatic documentation refresh exists. Future updates require new verification of changed official sources.

## App menu sizing

On desktop, drag the far-left learning menu’s right edge to resize it (220–360 px). Drag below 140 px and release to hide it; Show menu restores the remembered width. The edge highlights on hover/focus. Arrow keys resize, Home or Enter hides, and Escape cancels an active drag. Visible Hide menu / Show menu buttons offer an alternative. Phone navigation continues to use its menu button and X. Menu preferences persist without changing the saved architecture.

The service catalog uses a viewport-height sticky desktop sidebar with compact controls; source metadata and review counts are under “Catalog scope”. The actual list shows about five entries at a745px viewport (variable with names and available height). Mobile keeps a left drawer with its own scrollable service list. Full service descriptions remain in each selected node’s inspector.

## AWS service icons

All 47 catalog entries use locally bundled artwork from the official AWS Architecture Icons package dated 2026-07-31, verified 2026-11-01. Catalog rows pair icons with service names; canvas nodes use larger icons with compact instance names and modeled/reference status. STS uses an official IAM resource icon; Q Developer uses the official Amazon Q family icon, explicitly identified in accessible image text. Unknown IDs or failed image loads show an honest generic symbol. See `ICONS.md` for usage/provenance, exact mappings, archive paths and integrity hashes. The artwork is unchanged and not hotlinked.

## Inline connection labels

Click an arrow or its label to type directly on the canvas. Changes are saved live in this browser. Enter or leaving the input commits; Escape restores the text from before that editing session, including its saved state. Labels are limited to 60 characters and remain descriptive: they never change permissions or integration behavior. Keyboard users can focus an edge and press Enter/Space, or use Edit label in the selection bar. Backspace/Delete while typing edits text, not the graph. The input stays readable when zoomed out. IAM and integration controls remain in Connection settings; the duplicate label form is removed.

## EventBridge: bounded node-specific rule preview

Select EventBridge to configure one Classic rule on the default bus or a named custom bus. Its persisted pattern and reduced sample event are evaluated locally: fields combine with AND, alternatives within arrays use OR, nested exact strings/booleans/null and scalar event-array intersection are supported. Strings are case-sensitive; missing differs from null. Numeric predicates, operators, dotted/duplicate keys, object arrays and unsupported envelope fields are explicitly rejected, not approximated. JSON limits are 10,000 characters and depth10.

Connect outgoing arrows to Lambda and/or standard SQS, attach up to five targets, and assert the correctly scoped target resource policies. This teaching path uses the events.amazonaws.com principal and lambda:InvokeFunction or sqs:SendMessage with a rule-ARN scope, without an EventBridge target execution role. Current AWS also supports execution-role paths; those are not Lambda function execution roles. Settings change match/configuration/readiness results; they do not actually deliver events or verify AWS authorization. Invalid JSON drafts persist without discarding the graph. Arrow labels do not affect matching.

The four-direction whole-graph walkthrough remains separate and explicitly refuses EventBridge execution. No retries, DLQ delivery, FIFO, encryption-policy evaluation, cross-account behavior, Scheduler, Pipes, publisher authentication or downstream Lambda processing is simulated. The brief remains available for broader theory. Sources verified2026-11-01: [patterns](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-pattern.html), [array matching](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns-arrays.html), [resource permissions](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-use-resource-based.html), [rule targets](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutTargets.html), [bus names](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_CreateEventBus.html), [DVA-C02 development objectives](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html).

EventBridge settings open on selection in a compact390px desktop drawer; mobile uses a dismissible modal drawer. Close settings preserves selection and configuration; Configure EventBridge reopens it. Each EventBridge instance stores independent settings. Changing an arrow’s endpoints clears its previous target assertions; deleting/disconnecting prunes obsolete target settings.

## Configuration learning across all 47 catalog entries

Select or tap any service instance to open its compact settings drawer. All 47 entries now have an exam-oriented configuration slice: API Gateway, Lambda and EventBridge use focused inspectors; the other 44 use typed, explained controls with working/broken examples, local checks, preview traces, source dates and explicit boundaries. Values persist independently per instance in this browser. CLI, CDK, Q Developer and similar tools use planning/configuration lessons: no shell, deployment or AI request is executed.

HTTP API preview supports literal GET/POST routes, route deployment, Lambda proxy integration and invocation grants. Route changes invalidate deployment and grant assertions. One matching route selects one target, never graph fan-out. Lambda previews compare mock handler duration with function timeout and distinguish downstream execution-role permissions from API invocation resource policies. HTTP integration timeout does not cancel Lambda. REST APIs, authorizers, full payload/runtime behavior and many other settings remain outside this slice.

The Exam coverage page and `CONFIGURATION-COVERAGE.md` reconcile all 47 entries against settings, instructional exam mappings, working/failure examples, checks, dated official sources and remaining gaps. Source-reviewed means a bounded documented lesson, not every AWS console setting, exhaustive exam readiness or a production security assessment. Each lesson states its precise assumptions.

Local configuration previews are separate from the four-direction whole-graph walkthrough. Adding a lesson does not make arbitrary diagram edges executable. Passing a lesson is not proof of real AWS permissions or deployment readiness. The interface distinguishes these levels.

Implementation: `learningModel.ts` shared contract/guards, `learningModelsData.ts` (11), `learningModelsPlatform.ts` (15), `learningModelsTools.ts` (18), `LearningConfigInspector.tsx`, `learningConfigPersistence.ts`, and `configurationCoverage.ts`. Official documentation was reviewed on 2026-11-01; no automatic refresh or guarantee of future accuracy.

## Expanded C02 / C03 theory library

The Theory library contains 22 original chapters (~23,000 explanatory words), 63 original explained questions and 32 illustrative code examples. C02 shows 20 chapters; C03 shows 19, including two dedicated AI chapters. Shared lessons explicitly label version-specific extensions. The selected guide changes task mappings and domain weights, not canvas runtime capabilities. C02 testing ends 2026-11-30; C03 begins 2026-12-01 according to AWS's official comparison. Check AWS before booking.

Search chapter bodies, filter domains, use the reading table of contents, bookmark/mark chapters, copy educational snippets, and practice one selected chapter at a time. Reading/quiz progress remains browser-local. Related configuration buttons open an existing service instance or add one without replacing the architecture. New C03-only services remain theory references; the canvas retains 47 entries and the same bounded engines.

`THEORY-COVERAGE.md` independently maps all 101 C02 and 72 C03 numbered published skills to actual explanations and worked scenarios/code/review exercises. This is traceability, not a claim of hands-on mastery, all possible questions, every product option or exhaustive supporting knowledge lists. The official guide itself is not an exhaustive question specification. Sources are dated 2026-11-01 and may change.

Research reviewed six community repositories, recorded exact provenance and licenses in `LICENSE-RESEARCH.md`, and used none of their prose/questions/code in the app. Unlicensed or ambiguously licensed notes were not bulk rehosted; even permissively licensed leads were kept as optional links with provenance caveats. All new lesson text and questions are original syntheses using official AWS and Kiro documentation (191 source records, 168 unique URLs). No exam dumps, pirated course content or live exam questions are included.

Implementation: `theoryDevelopment.ts`, `theorySecurity.ts`, `theoryDelivery.ts`, `examVersions.ts`, `TheoryIndex.tsx`, `theoryResearch.ts`. The original three foundation chapters and prior progress IDs remain intact. C03 changed/new topics include managed AI integration, developer tooling, AI security/tool authorization/privacy, AI-supported testing/CI/diagnosis, containers, and presigned access; moved skills have version-specific task mappings. The 11 added named C03 service references are not silently claimed as new app simulators.

Examples are illustrative and not run against AWS. Before optional real-cloud work, independently review permissions, cost, region/service support and cleanup. This app never asks for credentials or creates resources.

## Exam Home overview

Home is the new entry page, with DVA-C03 selected unless a URL explicitly selects C02 (legacy foundation chapter links retain C02). It presents the guide dates, scaled passing score, question format, current overview duration, domain weights and task-to-theory links. The searchable grouped service list reconciles 56 C03 entries in 11 categories and 47 C02 entries in 10 categories. It distinguishes existing bounded local lessons from 11 C03 theory-only references, without changing the canvas catalog or simulations.

720 is a scaled threshold on 100–1,000, not 72% correct. Domain weights describe scored content, not per-domain pass marks. Duration is labeled as the current AWS certification overview (130 minutes); learners must confirm their booked version/accommodations. No readiness or question-frequency prediction is made. See HOME-GUIDE.md for evidence and review limits.

## Optional AI architecture review

See **BACKEND-SETUP.md** for local setup, the separate Render backend, secret handling, the per-process memory allowance (resets on restart), and the user-run real-provider smoke command. **AI-REVIEW.md** explains trust boundaries. The existing private Site hosts only the frontend; no API key/backend is supplied or activated.

- `backend/`: Node server, public review route (no access token), bounded Responses API transport, in-memory reservation guard and live-smoke command.
- `src/architectureReview.ts`: shared strict proposal validator, atomic Apply, exact-snapshot stale guard and in-session Undo.
- `src/ArchitectureReviewPanel.tsx`: explicit backend trust/graph consent, source-aware advice, before/after preview and user-controlled Apply.
- `npm run build:backend`, `npm run typecheck:backend`, `npm run start:backend`: optional server commands. Start with private environment settings as documented; the plain start command does not auto-load `.env.local`.

No real provider call was made during preparation. Fixture tests are explicitly not evidence of account/model access or live output quality. Undo is session-only; saved graph changes survive reload, but Undo tokens do not. The backend is single-operator, single-instance, not a multi-user service.
