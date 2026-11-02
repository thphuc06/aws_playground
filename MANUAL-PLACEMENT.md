# Preserve manual placement

2026-11-02

Dragging or resizing no longer triggers global connection rerouting. Existing automatic tracks remain cached; only endpoint attachment geometry follows moved services. Moving both endpoints together translates the track, and moving a frame also translates manual bends of connections whose two endpoints belong to it. Existing service/frame coordinates are not packed by a drag/drop event. Containment updates remain metadata-only.

Adding/dropping a frame no longer requests Fit view. The React Flow automatic fit prop is removed: only one initial fit for an existing loaded diagram is allowed, plus explicit navigation, Fit, examples, Arrange/Undo actions. A first item dropped into an empty canvas stays at the dropped viewport position. New wires and explicit Reset route can calculate their own route without changing existing tracks.

Arrange diagram explicitly resets the manual route cache and runs global placement/routing. Runtime automatic tracks may be recalculated when reopening a diagram; saved node/frame positions and explicitly edited wire bends remain persisted.

The backend also no longer silently packs geometry after network edits or at finish. AI can still use the explicit layout_draft tool when a requested design includes arrangement; configuration-only work is instructed to preserve manual placement. Placement conflicts are surfaced as considerations.

Tests cover unrelated-node drops leaving tracks untouched, common translation of endpoints, moving saved bends with frame members and preserving backend geometry. Browser pointer E2E remains unverified. No env changes.
