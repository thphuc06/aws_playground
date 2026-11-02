# Readable diagrams and immersive canvas

2026-11-02

- Connection labels default to hover/selection instead of displaying every fixed-screen-size label at overview zoom. The toolbar supports All and Hidden. Editing still works when labels are hidden. Routes use rounded orthogonal segments with lane offsets. Selecting a service/edge dims unrelated paths; declared observability paths are subdued in the overview.
- Arrange diagram deterministically packs direct member cards and nested frames with padding and sibling spacing. It preserves IDs, service types, memberships, connections and configuration. Undo layout is available while geometry/membership remains unchanged. A visual arrangement alone no longer counts as an architectural change.
- New AI network updates and completed changed proposals use the same packer. No AWS subnet choice is inferred by the layout code. VPC-inside-subnet placements receive a review warning. Incorrect semantic membership in an old draft still needs correction through its frame selector or a new AI review; visual layout does not silently redesign AWS placement.
- Drag/drop membership checks the whole card, using measured dimensions when available, rather than a center point. Frame metadata edits no longer recompute unrelated memberships. Nested frames are rendered with parents behind children.
- Full screen removes the wide header/footer/tool bands. The canvas covers the viewport; controls and optional resource/configuration drawers float over it. Saved drawers close on entry; unsaved configuration remains open. Native Fullscreen API is requested on the user click, with the viewport mode retained if the browser/host declines. Escape/browser fullscreen exit synchronize the UI and restore focus.

Verification includes crowded20-node/nested-frame packing, containment, non-overlap, stable repeated layout, unchanged semantic configuration, metadata edits preserving membership, label hover modes and fullscreen host-rejection fallback. These are deterministic and JSDOM fixtures, not real-browser pointer or native-fullscreen E2E. Routing is not a general obstacle-avoidance engine and cannot eliminate every crossing in an arbitrary graph.

For an existing crowded draft, use Arrange diagram once and keep Labels on On hover. It repairs geometry according to the currently declared memberships. Existing model, usage limits, checkpoints and environment remain compatible.
