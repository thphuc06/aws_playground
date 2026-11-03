# Forest & Parchment theme

Historical record of the first Forest palette. The later
[handbook and appearance update](service-handbooks-and-appearance.md) adds Slate
and Plum and revises Forest dark for readability; its tokens supersede this table.

The selected theme pairs warm paper surfaces with forest-green navigation and
actions, plus restrained copper highlights. Dark mode uses deep forest surfaces
and pale sage actions. This replaces the indigo service-library preview and
applies through the shared application tokens, including Home and the builder.
The 58 English service guides and their reviewed content are retained.

The uiuxpromax workflow informed the palette exploration, contrast checks and
responsive review. Existing AWS artwork and semantic success/error colors remain
recognizable. The user's selected palette was adjusted slightly for readable
muted text and copper headings on tinted surfaces.

| Role | Light | Dark |
| --- | --- | --- |
| Page | `#F3F0E7` | `#111B18` |
| Card | `#FFFEFA` | `#1B2924` |
| Subtle surface | `#EDF0E8` | `#22332B` |
| Primary text | `#20322C` | `#E6EDE7` |
| Secondary text | `#465E50` | `#BDCCC0` |
| Muted text | `#55665B` | `#AFBFB4` |
| Primary action | `#245849` | `#BDD8B0` |
| Primary-action label | `#FFFFFF` | `#111B18` |
| Copper highlight | `#A6542C` | `#F0B38E` |

The shared run/adopt/save buttons now use paired action-background and label
tokens, so dark-mode labels remain legible on pale sage. Browser chrome uses
the corresponding page color both before React loads and after theme changes.
Light, Dark and System preferences continue to work.

## Verification

- Independent source and calculated-contrast review: no blocking findings.
- Primary-button text contrast: 8.18:1 light and 11.40:1 dark.
- Muted text on the selected light surface: 4.58:1.
- Actual-browser checks: 24 combinations across Home, library, Lambda detail and
  builder at 375, 768 and 1440 pixels in both modes; no document overflow.
- 52 token contrast checks and four rendered primary-button checks passed.
  The lowest checked normal-text contrast was 4.55:1. This measures the listed
  pairs, not every possible application state or a full accessibility audit.
- Theme selector focus, System preference changes and pre-React theme-color
  checks passed. Provider API requests were replaced with local fixtures.
- Existing theme, library and service-guide tests: 10/10 passed with Node 22.23.4.
- Frontend production build and TypeScript checks passed.

Evidence is in `artifacts/forest-parchment-theme/`: light/dark library and Lambda
screenshots, mobile Lambda screenshots, and the browser-check results. The
earlier [service-library review](service-library-preview.md) retains its original
screenshots and broader content-validation evidence. CI and deployment results
are verified separately for the published commit.
