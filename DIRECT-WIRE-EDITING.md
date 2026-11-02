# Direct connection editing and resizable configuration

2026-11-02

- An unobstructed forward connection uses a straight/simple two-bend route before grid search. Candidate two-bend routes favor less shared length; grid turn penalties were increased and congestion penalties reduced so congestion alone does not produce unnecessary rectangular detours.
- Selecting an orthogonal wire immediately reveals editable points on the current line. No Add bend step or automatic panel is needed. Dragging an automatic point creates persistent manual waypoints. Small on-line controls switch line style, reset routing or delete the connection.
- The bottom selection/action bar is removed. Node actions remain available in the explicit service inspector and keyboard controls. Clicking the background clears selection. Configuration opens only when requested for a wire; service/resource/wire panels are rendered exclusively.
- Right-side configuration starts at320 CSS pixels and is resizable from240 to640 pixels (bounded by the viewport). Drag its left edge, use arrow keys on the separator, or double-click to reset. Width is stored locally. Expanded editors retain their full-screen behavior.

Regression tests cover aligned straight routing, direct on-line bend editing, exclusive panels, no automatic wire panel, absence of the bottom bar and persisted keyboard panel resizing. Real-browser pointer E2E is still unverified. Shared endpoints/crossings remain possible; no zero-overlap claim is made. No backend model, usage limit or environment change is required.
