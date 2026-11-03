# Independent handbook and appearance UI review

Reviewed 2026-11-03. No release-blocking UI or behavior issue found within the scope below.

## Inspected implementation

- Read `AGENTS.md` and the UI/UX Pro Max accessibility, focus, responsive, and color guidance.
- Reviewed `src/appearance.ts`, `src/ThemeControl.tsx`, `src/theme.css`, `public/theme-init.js`, and `index.html`, including CSS import order in `src/main.tsx`.
- Reviewed `src/ServiceHandbookPanel.tsx`, `src/ServiceLibrary.tsx`, the handbook styles in `src/serviceLibrary.css`, and the surrounding `ServiceDeepDivePanel` composition.
- Read the appearance and handbook component tests and the browser verification script. The main agent owns execution of the full automated suite and build; this review did not rerun them.

Mode-only preferences retain Light/Dark and receive Slate. Palette and mode use separate storage keys; invalid values resolve to Slate/System. Runtime and pre-React initialization agree on palette, resolved mode, and browser theme color. Media and storage listeners have cleanup. A service change remounts the containing keyed guide, clearing example-copy status. Copy failures produce a nearby live status while leaving the example available for manual selection. Citations have source-specific accessible names and safe external-link attributes.

## Independently exercised in Chromium

Used the existing local preview at `http://127.0.0.1:4173`, installed Chrome, and the existing Playwright installation. All `/api/` traffic was intercepted with synthetic failures or aborted; no provider requests or AWS operations were made.

- At 375 x 812 with reduced motion, fresh storage selected Slate/System and resolved to the emulated dark preference.
- Both appearance controls remained inside the viewport, were 44 CSS pixels high, and received a visible 2-pixel focus ring through keyboard traversal. Their measured widths were 76 and 81 pixels.
- A second real browser tab restored Plum/Light, then changes to Forest/Dark propagated to the first tab. Clearing storage in the second tab restored Slate/System in the first.
- Emulated system changes switched the System mode between light and dark.
- Enter on the two new contents buttons moved focus to the correct visible handbook heading at the mobile viewport.
- A deliberately denied clipboard operation produced the expected manual-copy message. The code block remained selectable, keyboard-focusable, and internally scrollable. Its wide code did not overflow the page.
- Enter expanded the primary-reference disclosure. The Lambda handbook rendered five source links and 18 inline citation links, all with HTTPS URLs, source-specific names, and safe external-link attributes.
- No page errors or page-level horizontal overflow occurred during this pass.

An additional pre-React pass blocked application scripts while allowing `theme-init.js`. With an empty React root, all three cases produced the expected document attributes and browser color: legacy dark-only preference to Slate/Dark, Plum/System on a light system to Plum/Light, and invalid saved values on a dark system to Slate/Dark.

## Recorded evidence reviewed

Inspected `artifacts/service-handbooks/browser-checks.json`: 96 responsive cases across four routes, six appearance combinations, and four widths; 156 enumerated contrast checks; 58 rendered guides; zero reported errors. These are existing verification results, not independently rerun counts. The contrast checks use separate thresholds for normal text and non-text indicators.

Visually inspected `handbook-mobile-dark.jpg`, `example-light.jpg`, `home-plum-light.jpg`, and `handbook-forest-dark.jpg`. Text hierarchy, section separation, code presentation, and the revised dark surfaces were legible in these captures.

## Limits

Approval covers the inspected code, recorded evidence, and the fresh Chromium checks described above. It is not a complete accessibility certification, screen-reader audit, Safari/Firefox verification, or verification of every rendered element's contrast. This review checked citation rendering and navigation rather than independently validating every AWS claim or external source. Deployment and full-suite results remain the main agent's responsibility.
