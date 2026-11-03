# Service-library preview — 2026-11-03

Review branch: `feat/service-library-preview`, based on `origin/main` at `d4d3c17`.
The original preview was prepared without changing the local `main` checkout.
On 2026-11-03, the user approved pushing and merging this batch, with author and
committer name `hungkhuu404`. The preview evidence below records the reviewed
implementation; publication and CI results are verified separately at handoff.

## Open the preview

From this checkout, with Node 22:

```powershell
npm ci
npm run dev -- --port 4173 --strictPort
```

- Library: <http://127.0.0.1:4173/?view=services&exam=DVA-C03>
- Lambda field notes: <http://127.0.0.1:4173/?view=services&exam=DVA-C03&service=lambda>
- Bedrock field notes: <http://127.0.0.1:4173/?view=services&exam=DVA-C03&service=bedrock>
- Change Light / Dark / System in the existing top-bar theme control.

The preview uses the real application routes and service data. Reading a guide
does not submit an assistant request or modify a saved architecture. The existing
explicit **Add or select in architecture** action remains available.

## Added information

All **58 service references**, including the two legacy IDs, now have an English
field-note supplement. Existing technical briefs, configuration references,
practice exercises and comparisons remain available below it.

Each supplement contains:

1. A concrete mental model and when the service is or is not a good fit.
2. Links to relevant alternatives, without implying that adjacent services are interchangeable.
3. A four-step illustrative scenario, expected result and failure investigation.
4. Cost drivers without hardcoded prices or billing guarantees.
5. Operational checks and dated primary references.

There are **232 scenario steps**, **123 source references** and **119 unique
primary URLs** across the new notes. The authors opened the referenced sources
on 2026-11-03. A separate reviewer read all 58 entries and independently checked
selected high-risk/current claims; this is not a live AWS validation of the scenarios.
See [the independent review](service-library-independent-review.md).

Content lives in `src/serviceDeepDiveCore.ts` and `src/serviceDeepDiveTools.ts`,
using `ServiceDeepDive` in `src/serviceDeepDiveTypes.ts`. These data modules are
loaded with the existing service-library route, not added to the initial Home route.

The new service-library glossary is English-only. Existing bilingual glossary
usage elsewhere in the application remains compatible.

## Color and interface decisions

Applied the **uiuxpromax** skill using `developer documentation learning library`
with `--design-system` and the detected React stack. Its documentation-first,
minimal grid and indigo direction were adapted to the existing application.
The existing system font stack is retained. Official AWS artwork is unchanged.

| Role | Light | Dark |
| --- | --- | --- |
| Page | `#F5F6FB` | `#101321` |
| Surface | `#FFFFFF` | `#181D30` |
| Primary text | `#20243C` | `#EDF0FF` |
| Secondary text | `#4C5571` | `#BBC4E0` |
| Muted text | `#626C86` | `#A3AECB` |
| Primary action | `#4F46E5` | `#A49AFF` |
| Accent text | `#4338CA` | `#B8AFFF` |
| Caution text | `#98400D` | `#FFBD82` |

Shared semantic colors update the application shell and existing screens.
The new library/card/reading layouts are scoped to `serviceLibrary.css`.
The service page has a keyboard-accessible section index, explicit alternative
links, readable decision panels and separate scenario outcomes/failures.
Controls retain visible focus; smaller metadata was raised to 12px.
The independent token check found a minimum normal-text contrast of **4.68:1**
among the tested pairs. Reduced motion is respected.

## Screenshots and verification

Screenshots are in `artifacts/service-library-preview/`:

- `library-light.jpg`, `library-dark.jpg`: library and theme overview.
- `library-cards-light.jpg`, `library-cards-dark.jpg`: service cards.
- `lambda-light.jpg`, `lambda-dark.jpg`: new decision guidance.
- `lambda-cost-light.jpg`, `lambda-cost-dark.jpg`: cost and operational checks.
- `lambda-mobile-light.jpg`, `lambda-mobile-dark.jpg`: small-screen reading.
- `browser-checks.json`: actual browser results.

Optional local browser reproduction, using an installed Chrome/Edge:

```powershell
npm install --prefix .preview --no-save --package-lock=false playwright
node scripts/preview-service-library.mjs
```

The `.preview/` tools and runtime logs are ignored and are not app dependencies.
The browser script checks all 58 guide routes, 12 light/dark/viewport combinations,
filter restoration, section focus, English-only terminology, and unchanged saved
architecture. It does not trigger a paid AI workflow or provision AWS resources.

Seven new regression tests cover the content contract and library interactions.
Final checks used **Node 22.23.4**:

| Check | Result |
| --- | --- |
| `vitest run --maxWorkers=2` | **1,012 / 1,012 tests pass across 110 files** |
| Frontend typecheck and production build | Pass |
| Backend typecheck and production build | Pass |
| Local HTTP/SSE provider-fixture smoke | Pass; no paid requests |
| Browser guide sweep | **58 / 58 routes render** |
| Browser responsive checks | **12 / 12 pass**, 375/768/1440px, light and dark |
| Sensitive-file check | Pass, 485 indexed files |
| UTF-8 check | Pass, 406 tracked text files |
| Independent new regression tests | **7 / 7 pass** |

The first unconstrained test run had timing failures under parallel build/test
load. Limiting workers exposed one actual compatibility issue: the restyled
heading no longer had the exact accessible name expected by the existing dirty
navigation test. The heading now retains **Service reference library**; the
complete bounded run above passes without increasing test timeouts or weakening
assertions. Test tooling was installed locally; app dependency inputs are unchanged.

## Scope limits

- The original preview stage did not merge or deploy. Push and merge were
  subsequently authorized by the user; infrastructure and backend behavior are
  outside this implementation change.
- Examples are illustrative, not commands executed against AWS.
- No claim of complete AWS Console coverage, exam mastery or production approval.
- Existing large Builder/configuration bundle advisories remain outside this change.
- Source checks are dated; references and provider offerings can change.
