# Workspace backup and recovery — implementation batch 1

The architecture remains workspace v3 / graph v1 in this batch. Canonical resource
migration is a separate follow-up, after this backup path is integrated and checked.

## Delivered behavior

- Portable JSON envelope v1 with an explicit workspace facet, optional learning
  facet and separate raw editor-recovery facet. Reports are opt-in. Original,
  proposal and checkpoint stay independent; policy/document text and edge geometry
  are retained. No browser authentication or arbitrary localStorage export.
- Import parses and previews before creating a new named workspace. Existing
  copies remain available. Unknown future versions, unsafe keys, invalid graph
  shape and malformed report collections are rejected before persistence.
- Native IndexedDB `aws-playground-data`, schema 1, `records` store, key path `key`.
  Each record has `value`, monotonic `revision` and `updatedAt`. The active pointer
  and optional learning mutations commit in the same readwrite transaction.
- Import/replace conflicts abort all writes. A stale tab cannot silently overwrite
  newer content. Legacy localStorage source bytes are not rewritten by IDB saves.
- Corrupt source bytes are downloadable. An import can recover to a new record
  without deleting the unreadable old record. Active-pointer recovery records are
  retained as well. In-memory work remains exportable after a failed save.
- Import and workspace switching are disabled during an AI run or unsaved editor
  state. Canvas mounts after hydration. Save failures and pending saves propagate
  to the outer route guard through `onConfigurationDirtyChange`.

## Integration seams

`workspaceDatabase.ts` owns the shared store. The learning lane uses `learning-v2`
and supplies mutations with expected revisions; it must not create a second DB.

`LearningArchiveAdapter` supplies `export`, `validate`, `prepareImport` and optional
`onImported` UI refresh. `prepareImport` returns mutations including learning's
before-replacement backup. It performs no writes itself. The shared transaction
commits them together with the architecture copy.

`EditorRecoveryFacet` is `{version:1,entries:[{scope,nodeId?,fieldPath,format,raw}]}`.
Scope is original/draft/checkpoint; format is json/yaml/text. Invalid JSON is allowed
inside `raw`, which is never applied automatically. This batch accepts/preserves
that facet but does not yet collect all inspector text itself. The UI explicitly
calls a dirty-editor export a saved-diagram export. Wire inspector snapshots through
Builder before claiming unsaved raw-editor recovery is complete.

`CanvasProps.onRequestConsumed(kind, nonce)` is a passthrough contract for the UI
lane's one-shot example/service routing. The UI lane owns its Builder effects.

## Checks performed

- 53 archive/repository/Studio/transfer and existing workspace tests passed.
- Full suite: 719/720 passed under concurrent host load; one existing
  BuilderKeyboard test hit its 5-second timeout. Its focused rerun passed with
  all 33 tests in the selected set. No timeout was increased.
- TypeScript and production build checked; the existing large-main-bundle warning
  remains. Recheck the final integrated build after merging all lanes.
- Repository tests use native IndexedDB APIs backed by fake-indexeddb 6.2.7, including
  separate connections, rollback, stale revisions and optional-facet conflicts.
  Quota is fault-injected at the object-store write boundary; this is not a real
  browser disk-quota measurement.

## Verification still required in the integrated browser

Export/download, file upload preview, import/cancel, retained-copy switching,
refresh, corruption recovery, concurrent tabs, optional learning refresh,
keyboard/mobile/light/dark presentation and the inspector snapshot bridge.
No AWS resources or paid model calls were used for this batch.

## App limits and persistence notes

Archives have a 32 MiB import/export app limit; omit reports for a smaller backup.
This is not an AWS quota. Graph/document limits remain the existing shared checks.
Recovery copies are not automatically pruned. If IndexedDB is absent, legacy
browser storage remains usable and export is available, while portable import
requires transactional storage. Browser eviction/clearing can still remove local
data; downloaded backups are the portable recovery path.
