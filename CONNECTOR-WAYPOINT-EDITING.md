# Regenerated connector corners and segment editing

2026-11-02

Official behavior references reviewed:
- draw.io: https://www.drawio.com/docs/manual/connectors/waypoints-connectors/ — dragging a connector can create new waypoints; orthogonal paths retain right-angle bends.
- FigJam: https://help.figma.com/hc/en-us/articles/1500004414542-Create-diagrams-and-flows-with-connectors-in-FigJam — bent and curved connectors can be reshaped, with endpoints attached to objects.

Original implementation changes:
- Derive all corner and segment controls from the actual orthogonal polyline, including elbows introduced by a previous edit. Stored waypoint constraints are no longer the only visible handles.
- Segment grips move perpendicular to the segment. Endpoint anchors remain fixed; new elbows are inserted near them when needed. Corner grips can then reshape the newly created corners.
- Keep the captured DOM handle stable during a pointer gesture, then regenerate handles on release. This avoids losing capture as the number/order of corners changes. The active segment grip remains centered along its segment axis.
- Canonical manual paths do not get duplicate endpoint stubs injected. A finite64-waypoint bound replaces16; existing paths remain readable. Additional midpoint controls are view-only until manipulated.
- Curved on-path grips and keyboard controls remain available. No external editor implementation or licensed Pro code was copied.

Validation: geometry tests create a right-angle detour from a straight line, then edit one of the generated corners. A JSDOM PointerEvent/capture fixture performs the same sequence across React rerenders. Tests also cover vertical-segment movement, endpoint preservation and axis-aligned geometry. This is not a claim of complete draw.io/FigJam parity or real-browser pointer E2E.

No environment/model change is required. New waypoint limits require the updated backend, delivered through the normal CI/Render workflow.
