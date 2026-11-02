# Current release verification matrix

This is the current delivery process for expansion work. Earlier verification
documents describe their own milestones and may mention superseded models,
capabilities or audiences. They are not overwritten to imply new checks passed.

## Targets and compatibility

| Target | Current baseline / required action |
|---|---|
| Source | GitHub `origin`, branch `main`; record pushed SHA and successful Required checks |
| Backend | Existing Render `aws-playground-review`; allow After CI Checks Pass auto-deploy, avoid duplicate manual deploy |
| Model | Expected configured default `gpt-6.1-terra`; verify current read-only status, never silently replace owner settings |
| Frontend | Existing Site `appgprj_6ae6d23d455c8191a15136a750889334` |
| Live URL | https://aws-developer-playground-phuc.pointykayak.chatgpt.site |
| Audience | Last observed public on 2026-11-02; refresh `get_site` and preserve returned audience at publication |
| Site source | Separate Sites checkout and its `.openai/hosting.json`; preserve Git metadata and Site identity |

Schema expansion needs explicit read/write capability negotiation for workspace,
resource model and mutation protocol. Deploy an additive compatible backend
before a dependent frontend. Test old frontend/new backend and new frontend/old
backend. Unsupported editing or resume must fail safely while local reading and
export remain available. A green health response alone is not a release check.

## Baseline and required checks

The parent integration audit reported 691 tests across 55 files passing before
expansion on 2026-11-02. This is a historical baseline, not approval of later
changes. Record new outcomes against the actual integrated candidate SHA.

Existing CI sequence:

```text
npm run check:secrets
npm ci
npm test
npm run typecheck
npm run typecheck:backend
npm run build
npm run build:backend
node scripts/http-smoke.mjs
```

Also regenerate and check the learning evidence inventory after merged changes:

```text
node scripts/audit-learning-surface.mjs
node scripts/audit-learning-surface.mjs --check
```

The sensitive-file check examines the Git index. Stage the reviewed release
source before the final scan. Never print secret values. The HTTP/SSE smoke uses
an injected local provider fixture; it does not need OpenAI or AWS network calls.
Do not run paid `smoke:live`/`smoke:assistant` merely to verify a release.

## Acceptance matrix

| Gate | Required evidence |
|---|---|
| Workspace recovery | Denied/quota storage, corrupt data, incompatible future versions, usable raw/in-memory export, old keys preserved |
| IndexedDB migration, when implemented | Abort/blocked/versionchange handling, atomic records and marker, read-back, idempotence, no silent fallback to stale localStorage, concurrent-tab conflict handling |
| Import/export | Preview, size/schema validation, same-transaction related records, no overwrite on failure, all original/draft/resource/policy/geometry data preserved |
| Unsaved editor | Saved data versus optional editorRecovery explicit; invalid JSON retained for recovery, never automatically applied; stale/orphan buffer handled visibly |
| Progress | Frozen chapter/index aliases, version-specific skill IDs, stable question/options, attempts and history not fabricated from old success bits |
| Canonical resources | Shared edit/delete/remap, explicit conflicts, external unknowns, no ownership change from visual drag/arrange/clone |
| Mutation parity | Same UI/backend fixtures: unrelated existing errors permit repair, introduced dependent errors reject, invalid batches remain atomic |
| AI draft | Original isolation, stale evidence rejection, context/fingerprint compatibility, migration invalidation, cancellation/checkpoint/adopt/undo |
| Content | Claim/source review separate from structural counts; new hard errors and defaults checked against correct variant; no unsupported mastery score |
| Practice | Single/multiple-answer scoring, stable option identity, interruption/reload, isolated sandbox, explanation correctness |
| Browser | 390/720–768/1024/1440 widths, keyboard, text zoom, all themes, reduced motion, focus/dialog/dirty navigation, real CodeMirror |
| Performance | Compare identical production-build fixtures before/after: small and 100-node/200-edge graphs, large tables/documents, full catalog and long history |
| Publication | Pushed SHA, CI status, matching backend buildRevision/capabilities, Site terminal success and version, read-only production smoke |

JSDOM and local HTTP tests are not browser E2E. CodeMirror textarea mocks do not
prove keyboard/focus behavior. A screenshot is not a full accessibility audit.
Set performance budgets after measuring a baseline; investigate regressions
instead of claiming a bundle-size advisory alone proves the UI slow.

## Multi-agent review and release ownership

At most six workers plus the integrating owner run concurrently. Each lane owns
its assigned files and reports contract changes, acceptance results and unresolved
limits. Shared types, aggregate exports, application routing, package/lockfile and
release operations have one designated owner. A dependency change is coordinated
before another lane builds against it.

After implementers free slots, fresh reviewers inspect the integrated SHA across
data/migration, configuration/contracts, AWS/content, learning/practice, browser
UX/accessibility and performance/release. Use relevant reviewers on small waves
and all six for foundational migrations or full-scope sign-off. Reviewers report
reproducible findings; fixes return to the owner and affected checks are rerun.

Never publish with unresolved data loss, unsafe migration, atomicity failure,
incorrect authorization guarantees or incompatible deployment. Lower-severity
limits need explicit scope and ownership. “No findings” includes what was examined.

## Publication and rollback

1. Record previous known-good backend SHA and Site version. Keep a recoverable
   old-format backup before migrations; never delete storage to clear an error.
2. Validate a coherent integrated wave and the staged source; push GitHub and
   verify Required checks on that SHA.
3. Observe the existing Render deployment. Confirm matching `buildRevision` and
   advertised capabilities through read-only status; do not duplicate auto-deploy.
4. Sync sanitized source into the separate Sites checkout. Preserve its metadata,
   use the supported source workflow, retain the current audience, and record the
   resulting Site source commit, saved version and deployment ID.
5. Wait for terminal deployment success, then perform a read-only production smoke
   without paid model requests. Report literal URL, SHA/revisions and actual checks.

Rollback must use compatible frontend/backend revisions. Test rollback after a
user has saved the new schema, not only before migration. Newer records cannot be
silently downgraded or discarded. If old code cannot read them, keep a compatible
recovery reader or ship a forward fix. Optional imported reports remain historical;
do not rebase their fingerprints to make old review evidence appear fresh.

An archive allowlist prevents unrelated localStorage export, but user-entered
free text may itself contain secrets. Describe exported categories accurately,
allow optional reports/recovery buffers, and do not promise automatic secret-free
archives or silently redact the only local copy.
