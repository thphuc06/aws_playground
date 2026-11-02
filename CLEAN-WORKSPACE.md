# Clean Workspace

Selected by the user from the three visual proposals on 2026-11-02.

The app uses white panels, a cool off-white page, a bright dotted canvas, neutral
text/borders and a restrained amber action color. Resources stay on the left and
configuration stays on the right. Existing drag/drop, panel resizing, full-screen
geometry, wire editing and manual-placement behavior are preserved.

`src/cleanWorkspace.css` defines shared semantic roles and the final shell styling.
Existing stylesheets now consume those roles instead of retaining a parallel dark
palette. Status information retains text labels as well as red/green/blue/purple
accents. Body copy and secondary text use contrasting neutral colors. Old tiny
metadata labels were raised to 12px. The code editor uses its standard light theme;
JSON/YAML syntax, editing and validation behavior are unchanged. Official AWS SVG
assets are untouched. No API model, environment or saved workspace changes are needed.

The design follows the chosen Clean Workspace mockup and UI UX Pro Max's verified
Minimalism & Swiss Style guidance. The search tool's FAQ landing-page recommendation
was inappropriate for an editor and was not applied. Existing React/CSS structure
and interaction behavior remain the implementation basis.

Verification: existing interaction/data regression suite, frontend/backend typechecks
and builds, local HTTP/SSE fixture, semantic-variable scan and palette contrast checks.
Real-browser layout/interaction and screen-reader E2E have not been verified in this
session. In particular, visual comparison at each breakpoint needs browser inspection;
unit tests cannot certify pixel layout. Color contrast checks cover semantic palette
pairs, not every translucent/composited pixel or third-party SVG artwork.
