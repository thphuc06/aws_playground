# Learning content and configuration evidence

This document describes the current review process. Historical audit documents
remain historical records; this process does not retroactively certify them.

## Reproduce the inventory

```text
node scripts/audit-learning-surface.mjs
node scripts/audit-learning-surface.mjs --check
node scripts/audit-learning-surface.mjs --summary
```

The generator reads the current catalog, configuration registry, service briefs,
theory links, skills and practice data. It writes `LEARNING-SURFACE-INVENTORY.json`
and the readable `LEARNING-SURFACE-REPORT.md`. A deterministic digest covers the
bundled application-source inputs and generator. Run it after integrating other
lanes, not only before a merge. `--check` fails for stale or missing artifacts
without changing files. No dependency install, AWS request or AI call is made.
`--summary` validates and renders the report in memory and prints current counts
without writing artifacts. It is useful while other lanes are still integrating;
it does not claim that checked-in artifacts are current.

The report separately inventories the versioned question bank, exact primary C03
skill scenarios, standalone service exercises, editor configuration cases,
historical C02-origin slices and isolated labs. These sets overlap in topic and
sometimes source material; do not add them into a supposed mastery score. Labs
currently declare service/chapter relevance rather than numbered skill coverage.

The November 2 baseline contains 58 catalog services and 1,405 field paths,
including table columns. New fields must be inventoried too; these numbers are
not a target for AWS completeness. The separately versioned C03 skill inventory
contains 72 records. C02 skill IDs are not interchangeable with C03 IDs.

## Separate evidence dimensions

| Dimension | What it establishes | What it does not establish |
|---|---|---|
| Catalog entry | A service can be represented | A complete AWS implementation |
| Editor field | A typed input exists | Correct API binding or all valid variants |
| Reference URL | A reading source is associated | That the source supports every field claim |
| Existing audit scope | Earlier metadata records a bounded check | A new independent review or one rule per field |
| Reviewed claim | A reviewer records a statement, scope and supporting section | Automatic full-service validity |
| Local rule and tests | Specified local behavior has evidence | Account state, cloud reachability or complete authorization |
| Lesson mapping | A section addresses a topic | Exhaustive skill mastery |
| Question/case | A practice opportunity exists | Quality, difficulty or exam readiness |
| Structural brief | Named teaching sections exist | Sufficient depth or factual completeness |

No report should calculate “AWS accuracy” from any of these counts. Missing
structured documentation can mean information remains in help prose. Missing
configuration exercises can be appropriate for a code-focused skill. A missing
default is not a defect when behavior depends on the service variant or account.

## Field disposition and scoped API surfaces

Each field is `aws-setting`, `application-intent`, `exercise-input`,
`observed-output` or `unclassified`. Missing metadata stays unclassified. A small
explicit editorial list identifies clear application/developer decisions in
existing help (for example reviewing a generated diff); it does not assert a
corresponding AWS API property. Declared metadata takes precedence over that list.

The current manifest deliberately says `editor-inventory-only` and API
completeness `not-assessed`. Before elevating a service surface, specify:

1. API operation or artifact schema, version, deployment variant and context.
2. Every request property in the chosen surface, with a form mapping, explicit
   unsupported disposition or reason it does not apply. Include nested variants.
3. Read-only outputs separately from inputs; never invent an ARN or deployment
   status from a saved design value.
4. Unknown/account-dependent behavior and where the editor stops checking.
5. Semantic resource references versus visual placement or free-text intent.

The `ConfigField` additive documentation/evidence metadata can declare an
operation/property, but the manifest keeps it `declared-unreviewed` until the
claim review workflow is completed. A metadata flag alone does not certify an API
binding. Existing default/limit metadata and independent rule registries must be
reviewed together; one source is not assumed to be exhaustive.

## Claim review workflow

Add records to `src/learning/evidenceRegistry.ts`. The initial registry is empty
on purpose. Do not bulk convert existing URLs, `reviewStatus` labels or audit
dates into freshly reviewed claims.

For each claim, record stable ID, service, field paths, exact assertion,
applicability, assumptions, exceptions, official source URL and relevant section.
Record the actual reviewer and date only after reading the source. A link that
merely provides background stays `reference`; supporting evidence is explicitly
`claim-support`. Automated shape validation is not factual verification.

For a local rule, record its stable rule ID and positive, negative, boundary and
unknown-context cases. If a case category does not apply, explain why. Reference
the specific test file and case, then execute the relevant tests; merely naming
a test does not prove it exists or passes. Review frontend and backend against
the same mutation fixtures. Compare baseline versus introduced diagnostics by
stable identity, not human-readable text or error count.

Independent reviewer checks:

- Is a recommendation being incorrectly turned into a hard error?
- Is an adjustable quota/default being treated as a universal maximum?
- Do variants, units, date/Region, caller identity and context change the claim?
- Does the referenced section actually support the assertion?
- Does an unsupported feature remain unknown instead of invalid or verified?
- Does the example exercise the behavior rather than mirror a validator branch?
- Does the learner see what is being asserted and what remains outside scope?

Do not execute downloaded commands or deploy resources to prove a prose claim.
Runtime/cloud verification is a separate explicitly authorized activity.

## Teaching review

A service brief should help a learner choose the service, explain its important
boundaries, recognize permissions and failures, and investigate a concrete case.
Review examples and each distractor independently of word/section counts. Keep
technical identifiers stable across translated prose. Preserve chapter, section,
question and option IDs. Freeze legacy question aliases before reordering old
questions; historical “ever correct” bits cannot become invented attempts.

For each C03 skill, track theory, exact field mappings, configuration cases,
code/log/policy cases and question evidence independently. Topic-level IDs do not
automatically cover every numbered subskill. The inventory is an editorial queue;
human quality review and release verification remain separate gates.
