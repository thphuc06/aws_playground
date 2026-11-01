# Verification report

## Current release: full catalog and reviewed service briefs

- 59 unit tests, strict TypeScript and production build.
- Reconciled all 47 entries / 10 categories in the current published DVA-C02 list; each has exactly one sourced study brief and explicit limitations.
- 123 source references / 120 unique official AWS URLs, dated 2026-11-01. Research workers opened official sources per service.
- Browser checked search, category counts, EventBridge placement and labeled diagram-only connection, model-limit simulation blocking, reference-node/label reload persistence, expandable sourced detail sections, desktop workbench and narrow 500px layout.
- Physical phone/touch hardware and authenticated production UI remain unverified. Private deployment confirmation establishes publication; interactive QA uses identical local source.
- Historical checks below describe earlier stages; current README is authoritative for product behavior.


Date: 2026-11-01.

## Passed

- TypeScript strict type checking (`npm run typecheck`).
- 43 Vitest tests across mission engines, builder integration/graph validation, and curriculum integrity.
- Production Vite build (`npm run build`).
- Browser desktop smoke checks: stepping; denied DynamoDB permission; pause/reset; theory navigation; chapter-read state; bookmarks; copy-code feedback; quiz selection; browser Back; progress/bookmark persistence after reload.
- Browser end-to-end queue poison-message scenario reaches the DLQ after the configured receives.
- Browser end-to-end faulty canary scenario raises the modeled alarm and restores alias traffic to 100% stable version.
- Python example AST syntax and YAML example parsing, not actual AWS execution.

- Redesigned UI actual browser checks: 500px narrow viewport, readable theory layout without horizontal page overflow, settings drawer, mobile navigation focus/Escape restoration, scenario presets and permission-error feedback.
- Builder actual browser checks: visible nodes/edges on desktop and 500px viewport after fixing controlled-node measurement initialization; drag/drop palette, visual handle connection, accessible connection form, unsupported integration feedback, disconnect/remove, local graph reload persistence; working trace, broken resource-policy permission blocks simulation, and repairing permission enables the trace.

## Limits

- Narrow desktop-browser window checked at 500 CSS px; no physical phone or mobile-browser engine testing. Device emulation was unavailable.
- No full automated browser suite or formal accessibility audit. Keyboard labels/focus and reduced-motion styling are implemented, but broad assistive-technology coverage remains future work.
- No lint task is configured. Type checking and tests are the executed code checks.
- No examples were deployed or executed against AWS. Simulations deliberately simplify policy evaluation, timing, routing and retries; in-app assumption panels state these differences.
- Progress is local to one browser. The curriculum is partial; the coverage page identifies roadmap topics.

## Unified workspace / editing follow-up

- Verified default landing is Builder; separate Explore page/navigation removed.
- Browser verified default-example node Backspace removes incident edges and persists after reload; arrow Delete removes only the edge; Backspace in search edits text without graph deletion.
- Narrow browser verified editable queue template, touch Delete selected, invalid reconnect preserves original arrow and valid endpoint change resets scoped settings.
- Source-backed graph rules remain tested. Prior detailed mission UI checks above describe the earlier release; those engines are now retained in source/tests, not separate pages.
- Authenticated production browser inspection was blocked by the private Site login gate. Deployment service confirmation establishes the published commit; interactive QA was on the same local source build.

## Direct-manipulation follow-up

- Removed all builder select dropdowns; retained palette Add as an accessible alternative to dragging.
- Narrow browser verified selecting Lambda, contextual Connect to…, selecting SQS creates an edge; inspector shows correct execution-role permission.
- Contextual invalid Move target preserves the edge; Cancel connection edit leaves graph unchanged.
- Previous visual-handle drag/drop and deletion checks still apply; physical touch hardware remains untested.
- Browser verified Return on focused Lambda node selects it for contextual actions.

## Fan-in / fan-out and labels

- 47 unit tests pass, including supported multi-instance fan-in/fan-out, independent per-edge permission failure, labels not changing semantics, sibling-edge preservation and serialization.
- Browser verified shared-table / queue example trace, editable arrow label visible and retained after reload, duplicate reconnect rejection, valid reconnect retaining label/resetting permissions, and deleting only one of the shared-target edges.
- EventBridge is explicitly unimplemented, not inferred from generic fan-out support.

## Left sidebar layout update

- Desktop catalog collapse increased measured canvas width from 583px to 883px; hiding learning navigation expanded it to 1103px. Graph node count stayed unchanged.
- Catalog and learning-navigation desktop preferences survived reload. Reopening preserved catalog search while mounted.
- At 500px viewport, catalog opens from the left as a drawer; Tab enters its controls, Escape closes it, focus returns to Show catalog and body scrolling is restored.
- Native pointer drag from desktop palette after collapse/reopen placed a node at the exact intended canvas coordinates. Narrow drawer-to-visible-canvas drop also succeeded, closed the drawer, restored scrolling and retained the new node.
- Fit View remained operable after resizing and drops. Physical touch hardware is still untested.

## Learning-menu boundary update

- Native desktop pointer resized220→300 px, then dragged below140 to collapse. Reload retained hidden state; Show menu restored300 px. ArrowRight changed width320; Home collapsed.
- Learn navigation and return to Builder worked; all8 QA graph nodes remained. Catalog scope/content unchanged by menu resizing.
- Final catalog at1180×745 viewport:721px tall sticky pane,492px service list, five complete entries visible in All categories; pane top12px after page scroll. Search worked. Analytics correctly remains three entries.
- At500px viewport:495px list, five complete entries shown, no horizontal document overflow. Native Athena drop onto visible canvas succeeded at exact screen-to-flow position (428,565 CSS pixels), drawer closed, node count8→9. Escape closes/reopens catalog correctly; mobile learning-menu X returns focus and restores page scrolling.

## Official service icon update

- All 47 catalog images loaded in desktop and 500px narrow browser views. Mapping tests check all catalog IDs, safe local SVGs and unchanged upstream SHA-256 bytes.
- Native drag beginning directly on the Athena icon created an Athena node, closed the narrow drawer, and retained all four nodes/icons after reload.
- Desktop icon-led Lambda selection opened its existing theory/config inspector; clicking its arrow selected connection settings, preserved PutItem permission and accepted a descriptive relationship label.
- Temporarily removing the local Athena SVG triggered the honest generic fallback in both catalog and canvas. Original asset was restored and all icon tests rerun before packaging.
- 66 unit/integrity/render tests pass; typecheck and production build pass. Physical touch hardware and authenticated live-site UI remain untested.

## Inline arrow-label update

- Desktop browser verified immediate focus, live typing, Enter save, blur commit through reconnect control, and label persistence after reload.
- Backspace/Delete inside input left all3 nodes and2 edges intact. Escape restored original saved label after subsequent reload. Keyboard Enter on focused edge opened inline editing.
- Reconnecting target preserved the committed label. At500px viewport, input remained14px and its204px width stayed inside453px canvas. Long label wrapped; empty labels use selected-edge hint rather than persistent clutter.
- No duplicate Relationship label input remains in bottom Connection settings; modeled IAM controls remain.

## EventBridge rule/target preview

- Browser verified default matching, filtered event after changing status, numeric-pattern explicit rejection, invalidJSON draft persistence with graph retained, custom bus persistence, missing Lambda resource permission error, and independent Lambda+SQS target readiness.
- Both attached/permission settings and custom bus restored after reload. All actions remained browser-only; no AWS API calls or credentials.
- Final contextual drawer verified390px on1180px desktop (nonmodal) and420px within500px mobile (dialog, body scroll lock). Close/Escape restored page scrolling and Configure EventBridge reopened it.
- Disabled rule produced disabled/no-delivery result. Separate second EventBridge started default; changing then deleting it did not affect first bus or target settings.
- Reconnecting a configured Lambda target to reference-only DynamoDB reset old target assertions; disconnect/reload left only the still-attached SQS target. Arrow label was retained through reconnect.
-89 tests pass (19 EventBridge), plus typecheck. Production build checked during packaging. Physical phone input and authenticated live UI remain untested; no real EventBridge/IAM behavior was invoked.

## All-service configuration release — 2026-11-01

- All 47 published-list entries reconciled: 44 typed local lessons and 3 focused API Gateway/Lambda/EventBridge inspectors. 45 registry/coverage assertions verify identity, coherent defaults, actionable broken examples, official sources, dates and explicit boundaries.
- Independent semantic review of all 44 lessons; corrected stale SQS receipt handling, Secrets Manager cache/rotation distinctions, CloudTrail data-event retention, Athena scan limits and misleading blocked-operation traces. Full suite: 383 tests across 16 files; TypeScript clean.
- Actual local Chromium desktop browser: added each of all 44 generic services, loaded working and failure examples, ran each preview, and observed correct success/trade-off versus actionable failure feedback (44/44). S3 failure survived reload. New instances retain independent defaults/settings; shared persistence guard tests cover pruning/version/bad values.
- Core browser checks: Lambda timed-out/completed/missing-role states; API no route, deployment invalidation after path edit, permission reset, 30-second integration deadline without Lambda cancellation, and successful POST /orders selecting only one Lambda.
- Actual narrow browser viewport 500×745: no horizontal document overflow, S3 field change and successful preview, Lambda selection/edit/completion, API route fields and successful preview, visible drawer close. This is narrow desktop pointer/keyboard testing, not physical phone/touch certification.
- CSS review corrected inherited checkbox-column layout and preview-button contrast. All configuration controls use explicit labels, keyboard editing and native controls. Existing canvas typing/deletion guards remain covered.
- Scope: lessons are local reasoning models, not all AWS console settings, a full exam course, deployable infrastructure or real policy evaluation. All47 local previews do not extend the four global graph integrations. Sources and gaps are in CONFIGURATION-COVERAGE.md and the app's coverage page.
- Hosted production UI requires owner authentication not available in the QA browser; no access bypass attempted. Private deployment receipt establishes publication, while interactive tests above use the same local source. Physical touch and live AWS behavior were not tested.

## Dual-version theory release — 2026-11-01

- 22 total chapters (19 new + 3 preserved foundations), 134 sections, approximately 23,300 explanatory words, 63 original explained four-choice questions, 32 illustrative snippets. C02 selector shows 20 lessons; C03 shows 19. Counts describe artifacts, not exam readiness.
- Independent editorial audit maps 101 C02 and 72 C03 numbered official skills to actual section IDs in THEORY-COVERAGE.md. A regression check resolves all 173 rows to real sections. Supporting knowledge lists, full product coverage and real hands-on competency are not asserted exhaustive.
- Six GitHub repositories researched with license/commit/provenance evidence; no community prose, code or questions imported. Original synthesis links official documentation; one official Kiro documentation source is deliberately allowed alongside AWS docs. Technical cross-review corrected MFA/certification workflow depth, certificate hostname expectations, EventBridge retry terminology, OpenSearch worked request, dashboard examples and log-percentile analysis.
- Actual local Chromium desktop QA opened every 22 chapter and verified rendered sections/code; separate C02/C03 counts, AI-only visibility, search/domain controls and correct metadata observed. C03 AI-security question shows all four explanations; chapter read progress and C03 deep link survived reload.
- Related Amazon VPC lesson opened an existing instance without replacing or adding to the 66-node QA graph. No user AWS infrastructure was accessed. Existing runtime behavior is unchanged except the non-destructive lesson-selection entry point.
- Actual 500×745 browser QA: mobile navigation, version selection, body search, chapter reading, code copy and quiz layout; no horizontal document overflow. The code block remains scrollable within its column. Not physical-touch/device certification.
- Existing source/test contracts remain valid; full final suite 389 tests, typecheck and production build are required for the packaged release. Final production publication is verified by native private Sites receipt; hosted UI still requires owner authentication unavailable in this QA browser.
- All code snippets are instructional and were not executed against AWS. JSON snippets and TypeScript source parse in tests; examples are not certified deployable or production-safe. Current docs and source dates must be rechecked when AWS changes.

## Home overview release — 2026-11-01

- Official C03/C02 guides, current certification overview and C03 named list reopened. Independent reviewer confirmed scoring/format, qualified duration, all 56 named entries and category counts.
- Three new tests reconcile C03 56/11 and C02 47/10, preserve the 47-service canvas, validate all version-specific task/chapter links and distinguish scoring/count data. Final suite: 392 tests plus typecheck/build.
- Actual desktop browser: bare URL opens Home with C03, 56 services, correct weights/tasks; Bedrock search returns two theory-only entries. C02 switch renders 47 services, 13 tasks and 32/26/24/18 weights. C03 AI task opens the correct AI-security chapter; AI category shows Bedrock, AgentCore, Quick and Kiro.
- Actual 500×745 browser: clear Home layout without horizontal overflow; category/search work, Builder CTA preserves the 66-node QA graph, browser Back returns Home. Legacy IAM chapter URL without exam parameter still opens IAM under C02. Physical touch not tested.
- Live publication is verified through the private Sites receipt; interactive QA remains local because production needs owner authentication. No external PDF content, AWS operations or paid APIs used.

## Optional AI review + user-hosted backend — 2026-11-01

- Frontend remains private/static and disconnected by default. No server URL or token is preconfigured, no automatic provider request, and no OpenAI credential is bundled.
- 474 tests across 24 files passed, including 42 shared patch-engine tests, 6 frontend guards and 34 backend tests. Frontend and backend TypeScript checks and production builds passed.
- Backend fixture coverage: auth independent of CORS, exact origins, explicit consent, disabled mode, size/absolute read deadlines, provider timeout/refusal/incomplete/malformed output, strict proposal validation, fixed model, no retry, persistent pre-call reservation and lock contention. A discovered stalled-body cancellation race was fixed and its regression passes.
- Injected-transport integration tests cover graph → handler → structured provider-shaped reply → validator → preview → explicit apply → serialized graph roundtrip → in-session undo. Invalid/stale proposals preserve newer work. Fixtures are NOT real model calls.
- Actual disabled Node HTTP process `/health` returned200 without an API key. Server, ledger initializer and user-only real-call smoke bundles build successfully. Smoke refuses without `--live-approved`; its fixtures exercise the paid-call gate without provider access.
- Browser QA on managed preview: review disconnected/disabled controls, explicit Apply checkbox, disconnected-node sample preview66→67 nodes, Apply, Undo67→66, applied-node persistence after actual page reload, and normal node deletion cleanup back to66. Undo capability is intentionally session-only, not restored by page reload.
- Final desktop1180px and narrow500px review layouts are readable without horizontal overflow. Snapshot changes show original/proposed values; exact operations and deterministic findings remain expandable. Physical touch hardware was not tested.
- Live OpenAI response quality, account/model access, actual API billing and Render deployment remain UNVERIFIED because the user will privately configure their existing key and host the backend. The supplied one-call smoke command goes through the same authenticated backend/ledger, not directly around spending controls.
- Initial testing ledger is capped at$1 total, single-instance, conservative reservations rather than actual invoice accounting. Render requires persistent storage; no hosting purchase/deployment occurred. Local→Render migration must retain the same ledger, never reset an allowance.
- Existing Vite large-chunk warning remains (about1.11MB JS /345KB gzip); not a build failure. All prior theory, Home, configuration and canvas tests remain green.

Final audit regressions: advice-only explicit null is preserved in the UI; provider grounding and deterministic findings now share the canvas legacy-SQS-timeout fallback and explicit Lambda override.
