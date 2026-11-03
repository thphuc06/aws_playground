# Practical service handbooks and appearance choices

This update responds to two concrete problems: the green dark theme was hard to
read, and short service decision notes did not provide enough implementation or
diagnostic guidance.

## Appearance

The top bar now offers a palette selector and an independent Light / Dark / System
selector. Both preferences persist, synchronize across tabs and apply before
React loads. Existing mode-only preferences keep their mode and start with Slate.

| Palette | Light background / action | Dark background / action |
| --- | --- | --- |
| Slate (default) | `#F5F7FB` / `#284FB3` | `#141B27` / `#A9CCFF` |
| Plum | `#FAF5F5` / `#803D6A` | `#231E29` / `#F2B9DB` |
| Forest | `#F3F0E7` / `#245849` | `#1B2424` / `#C1DEB7` |

Slate and Plum are the two new choices. Forest dark has brighter, less saturated
surfaces, stronger separators and near-white body text. Shared semantic tokens
carry the selection into the library, Home and builder. Primary button labels
use a matching foreground token in every palette. The uiuxpromax workflow was
used for readable contrast, focus visibility, control sizes and responsive review.

## Added reading content

All 58 service IDs retain their existing field notes, technical reference and
practice entry points. Each English implementation handbook adds:

- Three operating-model explanations and a four-step implementation path.
- Three concrete configuration decisions with the consequences of each choice.
- Two service-specific security boundaries.
- A labeled, copyable code/configuration example and expected verification checks.
- Three symptom / likely cause / evidence / next action diagnostic playbooks.
- Common misconceptions with references beside the relevant claims.

The guide index links directly to **Build & configure** and **Example &
troubleshooting**. Search includes configuration names and failure symptoms.
Examples are reading material: copying or opening a guide does not execute AWS
operations or change a saved architecture. JSON/YAML syntax checks do not claim
that an example is a complete deployment or validates every AWS API constraint.

Data is split across `serviceHandbookComputeData.ts`,
`serviceHandbookSecurityNetwork.ts` and `serviceHandbookDeliveryAI.ts`, using
`serviceHandbookTypes.ts`. The existing service-library route loads these modules;
they are not added to the initial Home bundle. `ServiceHandbookPanel.tsx` renders
the implementation and diagnostic sections and their local source references.

The final inventory contains **46,194 words** of new explanations and examples,
**232 setup steps**, **174 configuration decisions**, **174 diagnostic playbooks**
and **58 examples**. It links **303 source references across 302 unique primary
URLs**. Word counts include headings and example text, exclude reference metadata,
and are a size measure rather than proof of quality. The per-service inventory is
in `artifacts/service-handbooks/content-inventory.json`.

## Research and accuracy review

Research notes record the actual primary pages opened during authoring:

- [Compute and data research](handbook-research-compute-data.md)
- [Security and network research](handbook-research-security-network.md)
- [Delivery and AI research](handbook-research-delivery-ai.md)

Three separate reviewers then read all 58 new handbooks and the corresponding
58 earlier field notes, independently opening primary references and checking
example semantics, product variants and permission boundaries:

- [Compute and data review](handbook-review-compute-data.md)
- [Security and network review](handbook-review-security-network.md)
- [Delivery and AI review](handbook-review-delivery-ai.md)

All three approved the corrected material within the documented instructional
scope. Corrections include SQS side-effect reconciliation, Step Functions task
errors versus returned JSON, Aurora reader-endpoint fallback, EFS mount-policy
enforcement, cache refill races, Bedrock API-specific tool execution and AgentCore
compute/persistence options. Existing overview notes were corrected as well,
including KMS read authorization and Classic ELB billing dimensions.

The research reports preserve their authoring-pass inventories; the content
inventory above includes subsequent review corrections and added references.
A dated source check is evidence of documentary
review, not a live integration test or a guarantee that AWS documentation will
remain unchanged. No paid provider requests or AWS provisioning are used by the
verification workflow.

## Browser verification

- All 58 handbook routes rendered with the setup, configuration, example and
  diagnostic sections present, alongside their retained older walkthroughs.
- 96 route / palette / mode / viewport combinations passed without horizontal
  document overflow across Home, library, Lambda detail and builder.
- 156 token-pair contrast checks and six actual Home primary buttons passed.
  The minimum checked normal-text contrast was 4.58:1. This is a scoped contrast
  check, not a full accessibility certification.
- Palette/mode controls retain 44px targets, visible keyboard focus and persistent
  selection. System-mode changes and reload preservation passed.

Screenshots and the exact checked pairs are recorded in
`artifacts/service-handbooks/browser-checks.json` and its adjacent images.

A separate [UI review](handbook-ui-independent-review.md) inspected the code and
screenshots and exercised mobile keyboard navigation, real cross-tab changes,
blocked clipboard behavior and pre-React initialization in a fresh Chromium pass.
It found no blocker within its recorded scope.

## Application checks

Final validation used Node 22.23.4:

| Check | Result |
| --- | --- |
| Full unit/integration suite, two workers | 1,024 tests passed across 113 files |
| Frontend TypeScript and production build | Passed |
| Backend TypeScript and production build | Passed |
| HTTP/SSE provider-fixture smoke | Passed; no paid-provider or AWS calls |

The service-library production chunk is 552.6 kB (166.9 kB gzip), reflecting the
added reading content. It remains behind the existing lazy service-library route.
The build reports its normal large-chunk advisory; it does not fail the build.
Commit, CI and deployment identity are checked separately when publishing.

## Reproduce the browser checks

With Node 22, the project dependencies, an installed Chrome/Edge and the optional
local Playwright tooling from the earlier preview instructions:

```powershell
npm run dev -- --port 4173 --strictPort
node scripts/preview-service-handbooks.mjs
```

`PREVIEW_CHROME_PATH` can override the browser executable and `PREVIEW_URL` the
local URL. Browser evidence and the content inventory are saved under
`artifacts/service-handbooks/`. The browser script covers all six palette/mode
combinations at 375, 768, 1440 and 1920 pixels, plus every handbook route. Provider
API calls are replaced with local unavailable fixtures.
