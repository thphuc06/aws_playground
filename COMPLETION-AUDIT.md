# Requirement coverage and completion audit

The previous run in the user's screenshot completed at 20 Responses and 2 searches,
below the configured 32/6 limits. It returned through `finish_draft`. This does not
show budget exhaustion. The previous unknown-settings counter only tested whether
the configuration object had any keys, and finish validated structure/schema rather
than coverage of the user's purpose.

## Behavior

- The server derives stable coverage items from every sentence/newline in System
  purpose. Items are included in initial model context and `validate_draft`.
- Design completion requires validation of the latest graph. Edits invalidate it.
- `finish_draft` must assess every coverage item exactly once as implemented,
  partial, missing, or needing verification. Implemented/partial items require
  existing draft references; specified field references must resolve to real values.
- Every frame with no descendant service must be explained as intentionally empty,
  represented by a shared service, or missing. Merely assigning a route table does
  not make an empty workload frame disappear from this checklist.
- Shared-service representation must cite configuration containing that frame's or
  a descendant's ID, CIDR, or explicit AZ value. A service name or unrelated memory
  setting cannot establish multi-subnet placement. This does not certify that the
  service supports the asserted deployment model.
- Configuration inventory lists specified and unspecified top-level fields. Empty
  strings/objects/arrays and unknown/unspecified strings are not configured values;
  false and zero remain legitimate recorded values. Conditional fields whose
  controlling setting is unknown remain in the inventory. Optional settings are
  not presented as universally mandatory.
- Partial work can be saved with visible gaps. There is no new cost limit or retry.
  The result and activity distinguish gaps, verification, and assessed requirements.
- Actual function-call counts are reported separately from activity counts.
- Old reports remain readable, explicitly without the new assessment. Editing the
  draft makes the assessment visibly stale. Neither reports nor audits rearrange it.

## Limits

The checklist is server-owned but its semantic judgments are model-authored.
Sentence splitting cannot prove every clause of a compound requirement was met.
Object/field existence is not proof that a claim follows from it, that nested
configuration is complete, or that AWS authorization/network/runtime will work.
Unavailable catalog capabilities must be disclosed as gaps rather than fabricated.
No deployment or production-readiness certification is introduced.

Existing saved canvases are not silently regenerated or reclassified. A new assistant
run is needed for a new assessment. Limits and Render environment values stay unchanged;
the new backend advertises `completionAudit: 1`.

## Verification

Regression fixtures cover omitted/duplicate requirements, empty parent/child frames,
invented object/field evidence, irrelevant versus explicit shared-service references,
one-field configuration, stale validation, premature-finish repair, honest partial
results, and tool-call accounting. UI tests cover legacy reports, missing requirements,
configuration inventories and changed drafts. HTTP/SSE smoke uses a local synthetic
provider and checks that partial results remain labeled as gaps.

No paid model generation or AWS execution was used for this change. Real-browser
pointer/E2E verification was not performed. Live Terra design quality remains a
separate evaluation from these deterministic contract tests.

## Response language

Agent explanations follow the natural language of System purpose or an explicit
response-language preference. Vietnamese/mixed Vietnamese-English requests receive
Vietnamese prose; unclear language defaults to Vietnamese. AWS names, diagram labels,
configuration keys/values, identifiers, enums, policies, code, search queries and source
titles retain English/original syntax. Localization never rewrites saved configuration.
Static application/activity labels keep their existing language. New runs use this
behavior; existing saved reports are not translated automatically.
