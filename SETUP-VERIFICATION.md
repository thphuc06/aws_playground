# Current update — disk requirement removed (2026-11-01)

At the owner's request, this version uses a per-process memory budget. The
disk-based setup below records the initial import and is historical, not current
deployment guidance. Use LOCAL-SETUP.md and DEPLOY-RENDER.md for the current flow.

The new memory guard tests cover concurrent reservations, exhaustion, invalid
amounts/budgets and reset on a new instance. Configuration regression tests cover
startup without disk settings, ignored old disk fields, missing credentials and
truthful status metadata. On Windows: 478 tests pass; both typechecks and both
builds pass. No paid OpenAI call was made for this change. Existing local ledger
data was preserved and the prior live-test allowance was not used again.

---

# Setup verification — 2026-11-01

Scope: source ZIP imported into the owner's initially empty
`thphuc06/aws_playground` repository, without overwriting prior project files.
Archive entries were checked for traversal, symlinks and collisions before
extraction. There was no `AGENTS.md` in the archive or workspace ancestors.

## Changes from the ZIP

- Rename `ConfigurationCoverage.tsx` to `ConfigurationCoveragePanel.tsx` and
  update its import. Original frontend typecheck/build failed on Windows because
  TypeScript resolved the component against `configurationCoverage.ts`.
- Update Vitest from locked 3.2.7 to 4.1.12. The original audit reported three
  dependency vulnerabilities (one moderate, two critical). The final lockfile
  reports zero. npm's normal update encountered an `edgesOut` peer-resolution
  error; the lockfile was resolved using `--legacy-peer-deps`, then independently
  installed successfully with **plain `npm ci`**, without a persistent bypass.
- Add Node 22 engine guidance, loopback-only frontend development default,
  local backend scripts, sensitive-file index check and GitHub CI with an
  always-run strict success aggregator.
- Add default Free-compute, review-disabled Render bootstrap plus a separate
  inactive paid persistent-disk template. No ledger bootstrap in builds/boot.
- Add local/deployment documentation and a private, ignored blank `.env.local`.
- Existing provider transport, validation, proposal engine, ledger, learning
  content, Apply/Undo and frontend hosted deployment remain unchanged.

## Observed checks

| Check | Actual result |
| --- | --- |
| Original tests on Windows Node 22.15.1 | 469 pass / 5 ledger failures: directory `fsync` returns `EPERM` |
| Original frontend typecheck/build on Windows | Failed on component/data filename collision; corrected |
| Final tests on Ubuntu WSL, native Linux Node 22.23.4 | **474 / 474 pass, 24 files**, including all 5 durable-ledger tests |
| Frontend and backend typechecks | Passed on Windows and Linux |
| Frontend and backend production builds | Passed on Windows and Linux |
| Final Linux `npm ci` and `npm audit` | Passed; zero reported vulnerabilities |
| Render YAMLs | Both validate against `https://render.com/schema/render.yaml.json` |
| Workflow YAML | Parses; required job always runs and fails on non-success dependency results |
| Actual local HTTP backend process, AI disabled | `/health` 200; missing token 401; unknown Origin 403; allowed preflight 204; authenticated status disabled; POST review 503 |
| Mock provider integration | Tests cover graph -> handler -> proposal -> preview/apply -> serialized graph reload -> undo; no paid request |
| Live OpenAI | **Not run**; waiting for owner key entry and confirmation. $0 spent by this setup |
| Browser E2E | **Not run**: browser tool's localhost permission gate denied access; no alternative browser workaround attempted |
| Production Render | No service URL supplied or verified; repository connection alone is not deployment evidence |
| Hosted Sites frontend | Not modified or redeployed; existing backend URL/token controls can be configured by the owner |

The UI production bundle emits the existing >500 kB chunk warning (about
1.11 MB minified / 345 kB gzip). Build passes; code splitting was not part of
this setup. Native Windows ledger support has not been weakened or claimed.
Fixture serialization tests do not establish browser localStorage E2E, and
mock provider responses do not establish actual account/model access.

## Local handoff

- Canonical Git checkout: `C:\HCMUS\DVA\aws_playground`.
- Linux verification copy: `/home/phuc/aws-playground-20261101` in Ubuntu-24.04.
  This is a separate snapshot; keep later code changes in the canonical checkout
  and refresh deliberately, excluding credentials, dependencies and ledger data.
- Private entry file: `C:\HCMUS\DVA\aws_playground\.env.local` (ignored).
- Native Linux Node: `/home/phuc/.local/share/aws-playground-tools/node-v22.23.4-linux-x64/bin`.
- Planned shared local ledger: `/home/phuc/.local/share/aws-playground/review-ledger.json`.
  No live ledger was initialized and no budget was consumed during fixture tests.
- Read `LOCAL-SETUP.md` and `DEPLOY-RENDER.md` for remaining live, runtime disk,
  migration, production health/auth and frontend connection steps.
