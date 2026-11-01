# PDF-informed theory branch verification

Read/research started2026-11-01; final verification2026-11-02. Worktree: `C:\HCMUS\DVA\aws_playground_theory_pdf`.
Branch: `codex/theory-pdf-dva-c03`. Starting commit: `1d89116`.

## Source read and limitations

- The supplied file is a40-page DVA-C02 preview by Jon Bonso and Carlo Acebedo,
  titled Tutorials Dojo Study Guide and Cheat Sheets. Input SHA-256 is
  `92e8cf28db92d7d6e7bfba7ff27a9755e87e223344b7d68ad447fc89de357aa4`.
- All40 physical pages were text-extracted with PyMuPDF, rendered at1.35 scale
  and visually inspected on10 labelled contact sheets, including table layout,
  JSON/code blocks and figures. No wholly scanned/unextractable page needed OCR.
- Actual printed content is1–6 and11–43 plus the cover. Printed7–10 are absent;
  the later chapters advertised through printed211 are index entries only.
- Some code is visibly clipped on PDF25–27. Its missing characters were not
  guessed or silently attributed to the publisher; new examples are independent.
- Extracted text/rendered pages were kept outside the Git checkout under
  `C:\HCMUS\DVA\pdf-theory-review`, not packaged into the app or commit.
- The PDF was treated as research data. Its commands/advice were not executed as
  agent instructions. No PDF page, publisher illustration or full scenario table
  was redistributed. New explanations, examples and15 questions are original.

## Before-code map and resulting changes

PDF-THEORY-MAP.md was written before implementation. It distinguishes existing
coverage, missing nuance, duplicated topics, corrections and index-only material.

- Nine existing chapters receive13 targeted sections. A new6-section
  source-literacy chapter explains how to use an older preview in C03 study.
- English teaching content covers explanations, comparisons, failure scenarios,
  key distinctions, code and explained multiple-choice checks.
- Physical PDF and printed-book page locators are attached to each new section
  and chapter coverage notes; the library exposes a source-reading guide.
-28 dated official source records were added. Directly reviewed material includes
  IAM conditions/principals/evaluation/cross-account/PassRole, STS APIs/Regional
  endpoints/session constraints, S3 action/resource types, Lambda limits/retries/
  mappings/filtering, REST/HTTP quotas, Cognito, EC2 dry-run, TTL and GSI throttling.
- Corrections include StringLike case sensitivity, account-root delegation,
  object-prefix ARNs, PassRole versus AssumeRole, STS endpoint scope, old async
  payload quota, API timeout overgeneralization, cache invalidation, Cognito
  purpose, delayed TTL and source-specific event-filter outcomes.
- Historical service names in the contents are not treated as required C03
  coverage. The official guide, rather than the preview, controls version scope.

## Compatibility and verification

| Check | Observed result |
| --- | --- |
| Original curriculum compatibility |22 original chapter IDs/order, original section IDs/order and63 original questions/positions preserved by a stored compatibility manifest.|
| New curriculum |23 total chapters and78 total questions; one new chapter,13 appended sections and15 appended/new questions.|
| Related tests |16/16 pass across theory, content and PDF-review tests.|
| Full repository fixture suite |515/515 pass across29 files; no paid calls.|
| Typecheck |`npm run typecheck` passed.|
| Production build |`npm run build` passed; existing >500KB chunk warning remains.|
| Sources/snippets |All section source IDs resolve; JSON snippets parse; question answer/explanation structure passes.|
| UI verification |Static React rendering checks reading-guide boundaries, locators, source links and existing read-state props. Browser visual/E2E was not performed.|
| Real AWS/model requests |Not performed; examples are not proof of permissions, account access or runtime success.|

No backend, Builder, ArchitectureStudio, registry, service catalog, config
inspector, policy engine, `main.tsx`, `style.css`, `examVersions.ts`, package or
lockfile was edited. No environment/hosting identity/sharing changes were made.
No progress/bookmark storage keys were changed. No main merge, remote push or
Sites publication is part of this branch handoff.

## Merge handoff

Merge/cherry-pick the final branch commit only after coordinating with the config
worktree. `content.ts` adds two imports and wraps the aggregate chapter export;
that is the only curriculum integration point. `TheoryIndex.tsx` adds one
reading-guide import/component. Resolve any simultaneous edits by preserving
both sets of chapter imports, the existing IDs and the source-guide insertion.
No shared-app integration commit is required because shared entrypoints and
dependency files were not changed. Run the same theory tests/typecheck/build
again after merging; this report does not claim merged or hosted verification.
