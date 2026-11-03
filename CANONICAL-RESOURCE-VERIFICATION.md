# Canonical resource model — implementation and compatibility

## Authoritative records

Legacy graphs remain `Graph.version:1` and `network.version:1`. Explicit migration
produces Graph 2 / network 2 with `network.registry.version:1`. The registry owns
VPCs, subnets and all previously supported shared network kinds. Stable IDs,
declared context, local/external typed references, service bindings and visual
frame bindings are separate.

`network.frames` and `membership` remain visual layout. Dragging, arranging and
removing a frame never reassign canonical placement or delete its resource.
`network.resources` and bound frame metadata are derived compatibility views;
the parser rejects divergent copies. The authoritative resource values are edited
once in the library and reused by all bindings.

Service placement supports multiple explicit subnet, security-group and interface
references, independent of the single visual parent. These are declared design
bindings, not evidence that an AWS interface was attached. Existing bounded network
checks are reused. Service/platform attachment behavior outside their scope is
reported as needing context rather than being described as an AWS error.

## Migration and recovery

- Migration is a pure, deterministic preview. Node/frame/table identities are not
  merged by name or CIDR. Possible duplicates and contradictory placement become
  explicit decisions. Unclassified or unsupported legacy rows remain in the
  preserved source graph and are identified in the review ledger.
- The complete Graph 1 source is retained in `registry.migration.sourceGraph`.
  Migrating through Studio also creates a new IndexedDB workspace copy, leaving
  the previous workspace record and legacy keys intact. A stale preview or an
  active AI/editor transaction cannot replace the workspace.
- Shared SG assignments are retained. Inline SG rules become separate unattached
  groups until reviewed. VPC inline route/NACL notes become reviewable resources;
  missing subnet associations are never invented. Fields moved to the registry
  also remain in `legacyNotes` for traceability.
- Migrated service references can point directly to canonical VPC identities.
  Usage/deletion covers typed references in both registry records and service
  configuration. Embedded ARN strings in policy documents still need manual
  review; they are not claimed as parsed dependencies.
- Unlink and remap are distinct deletion actions with a dependency preview.
  Rename keeps IDs; duplication creates a fresh ID and does not copy assignments.

## UI integration

Network & resources offers migration preview, then the canonical library with
search, create/edit, declared context, ownership, typed references, usage, clone,
deletion preview and conflict decisions. VPC/subnet resources can be displayed as
frames. Unbound group/Region/on-premises annotations remain editable separately.

The ordinary service configuration inspector edits canonical placement atomically
with other service settings. VPC service nodes select or create their authoritative
VPC record. Legacy node fields owned by the registry are hidden and rejected at the
Graph 2 mutation boundary, preventing a second active source of network settings.

## Backend and release ordering

- Parser reads Graph 1 and 2. Fingerprints retain `graph-v1:` for legacy graphs and
  use `graph-v2:` for canonical graphs. Historical report/checkpoint fingerprints
  are never rewritten, so migration makes prior evidence stale naturally.
- Status adds `resourceRegistry:1` and `graphVersions:[1,2]` while retaining legacy
  capabilities. Studio blocks sending Graph 2 to a backend lacking that capability.
- `update_canonical_resources` accepts bounded atomic operations. It uses the same
  mutation assessment as the frontend; unrelated pre-existing errors remain
  repairable, while introduced errors roll back the whole batch.
- The request/checkpoint read boundary accepts well-typed legacy values that are
  outside current numeric bounds so they can be repaired. Wrong types remain
  rejected. `validate_draft` and `finish_draft` remain strict: a repair that leaves
  another declared error is retained as an unfinished checkpoint, not a finished
  adoptable proposal. A synthetic provider regression exercises that complete
  path, including client checkpoint acceptance and resume parsing.
- Historical/imported proposals must pass the current bounded validation again
  at adoption time. A previously recorded report cannot bypass newly applicable
  checks. Unknown context remains distinct from a known invalid declaration.
- Completion evidence resolves canonical VPC/subnet resources, their declared
  owner/context, and explicit service bindings. Node inventory no longer reports
  hidden legacy network fields as active configuration.
- Legacy clients are not automatically upgraded by the assistant: default tools
  offer canonical mutation only after a browser migration. A Graph 1 request cannot
  unexpectedly receive a Graph 2 response. Full topology replacement cannot modify
  the immutable recovery snapshot.
- Deploy the dual-read backend before enabling the new frontend writer. Root owns
  production deployment and must verify revision/capability parity.

## Tests and remaining integration verification

Focused tests cover deterministic/conflict-preserving migration, original snapshot
retention, explicit inline-SG adoption, rename, clone, nested usage/remap, multiple
subnets, visual dragging/arranging/frame removal, backend atomicity, immutable
snapshots, report/checkpoint staleness, Graph 2 archive roundtrip, real inspector
controls, workspace forking and old-backend submission guards.

The final related run passed 179 tests across 18 files. The migration subset was
rerun after a port-label formatting adjustment and passed 6 tests. Frontend and
backend typechecks/builds passed; the existing large-main-bundle warning remains.
Native browser testing of the merged UI and final integrated release checks are
still required. No real AWS or paid AI calls were made.

App limits: existing canvas limits remain; registry at most 1,000 records; migration
at most 500 explicit decisions; reference identifiers at most 512 characters. These
are app guardrails, not AWS quotas. The recovery snapshot increases archive size;
the existing 32 MiB archive limit remains explicit. This is not a deployment tool,
full route evaluator or complete account/Region compatibility validator.

The raw-inspector recovery bridge must include the new canonical resource editor's
unsaved values when root integrates its shared draft-snapshot API. Current dirty
notifications and saved-only export wording remain in effect until that bridge is
connected.

## Independent-review corrections — 2026-11-03

- VPN customer/target gateways and VPN route targets now migrate through exact
  legacy identity aliases. Unknown gateway kinds remain explicit ledger decisions.
- Lambda's old `networkInterfaces` table is migrated to subnet/security-group
  bindings and archived in legacy notes. No managed ENI resource is invented.
- Generic assignments use a separate `resource.associations` array. The existing
  transit-gateway `values.attachments` table remains a distinct schema; known IDs
  become tracked references, unknown identities remain review decisions. Earlier
  generic Graph 2 attachment lists are backward-read and normalized when edited.
- Clones clear consumer associations and transit attachment rows. The UI opens a
  new unsaved copy for review instead of attempting to persist duplicate subnet
  CIDRs or assignments. Ordinary configuration/dependency references remain visible.
- External reference identity is encoded distinctly in the temporary legacy-check
  projection, so an external SG cannot collide with a local prefix list's ID.
- Backend repair edits accept a typed-but-invalid before state. Delete, layout and
  security edits use delta assessment; final validation/adoption remain strict.
- Virtual geometry stays bounded at the full 1,000-resource app limit.
- Migration-decision-only changes are included in the semantic diff and can produce
  a changed proposal without inventing a configuration or layout modification.

The correction suite includes exact reviewer reproductions, source immutability,
tracked deletion, EIP/route-table clones, old generic-association compatibility,
the 1,000-resource boundary and a conflict-only finished proposal. Seven targeted
test files passed 112 tests; frontend/backend typechecks passed. Independent
recheck and integrated browser verification remain root-owned.
