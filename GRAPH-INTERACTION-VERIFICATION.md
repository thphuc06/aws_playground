# Agent layout, editable connections and report navigation

2026-11-02. Supersedes the fixed-row arrangement and simple smooth-step routing notes in CANVAS-LAYOUT-VERIFICATION.md.

## Behavior

- AI can call layout_draft with explicit service/frame coordinates and connection presentation. The batch is validated atomically for graph shape, overlaps and frame containment. Valid custom layout is preserved at finish. edit_draft remains the tool for creating/removing actual connections. Layout-only changes do not count as architecture/configuration improvements.
- Automatic Arrange diagram follows directed connectivity: strongly connected groups are condensed into flow layers, branches are ordered by predecessors, and disconnected items use a compact secondary area. Frame membership is preserved. This is graph-based placement, not an inferred AWS design.
- Automatic orthogonal routing uses a bounded24-unit Manhattan grid, excludes expanded service rectangles and penalizes track reuse. At most60000 grid cells and200000 search iterations are used per routing pass. Dense/oversized/unroutable cases fall back to the standard renderer. Shared endpoints and crossings cannot be eliminated in every arbitrary graph. Frame borders are visual boundaries, not route obstacles.
- Click a connection to open its Configuration panel. Orthogonal style supports Add bend or double-clicking the line, draggable square handles, arrow-key movement, Delete to remove a handle and Reset to automatic route. Up to16 bends persist in edgeLayouts. Curved style follows its endpoints with an adjustable0.1–0.8 curvature value. Manual bends remain world-coordinate anchors when nodes move; manual geometry may cross other objects and can be reset.
- Connection styles/bends survive save/reload and AI checkpoints; deleted connections remove their layout records. They are visual properties and do not grant network/IAM access.
- Findings and service explanations expose Show on diagram. It targets the original or proposal canvas, scrolls/fits relevant services and emphasizes them with connected/explicit edges for7 seconds. The pulse is slow and finite; reduced-motion users receive a static highlight. Missing services from historical snapshots are not invented. This action makes no model request.

## Verification boundaries

Tests exercise obstacle avoidance, orthogonal manual bends, layout persistence/validation, atomic agent layout rejection, preserving custom agent positions, report link scopes/endpoints and keyboard bend controls. Prior regression coverage includes frame deletion, metadata/membership preservation, checkpoint resume and focus-mode fallback. Browser pointer/layout E2E and a new paid model workflow have not been run for this change. The router reduces congestion but is not a proof of zero crossings or a full drawing-editor routing engine.

GitHub is canonical. Publish the existing public Site and let Render auto-deploy after CI. No environment changes are required. Existing crowded drafts can use Arrange diagram locally; newly generated drafts may use the agent layout tool.
