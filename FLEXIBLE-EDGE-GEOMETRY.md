# Flexible wire geometry and attached controls

2026-11-02

Root causes reproduced: simplifyRoute removed a collinear extremum even when the path reversed direction, so the saved control point could disappear from the visible path. Handle positioning also lacked an explicit zero transform origin/top/left and could inherit margins. Both are corrected.

- Orthogonal paths only remove redundant points that lie between neighbors. Every declared bend stays on the visible path. Elbows alternate with the incoming direction; short gaps use smaller endpoint stubs.
- Dragging a square moves its contiguous aligned run. Alt-drag (or Alt + arrow keys) moves only that point. Automatic paths expose corners/midpoints, including short straight wires.
- Curves use a cubic with two draggable on-curve grips at1/3 and2/3. Moving one grip solves for both cubic control points while preserving the other grip and endpoints. Internal offsets are stored relative to each service endpoint, so they follow moved services. Reset returns automatic shape. The automatic strength setting visibly affects aligned endpoints as well.
- Control overlays explicitly use left/top zero, no inherited margins and transform-origin0 0, maintaining alignment under pan/zoom. Custom curve offsets persist and are validated by the shared graph boundary.

References consulted; implementation is original, without copying the licensed React Flow Pro example:
- https://reactflow.dev/learn/customization/custom-edges
- https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorials/SVG_from_scratch/Paths

Tests cover the screenshot's reversing-bend case, aligned-run movement, control points on the actual path, cubic interpolation/inverse fitting, endpoint-relative movement, persistence validation and a component rerender after moving a curve grip. Browser pointer E2E remains unverified. No model or environment changes are needed.
