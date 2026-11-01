# Render backend and Sites frontend

Repository: <https://github.com/thphuc06/aws_playground>, branch `main`.
Frontend stays at <https://aws-developer-playground-phuc.pointykayak.chatgpt.site>.
No frontend hosting or sharing permissions need to change.

## First push and Blueprint bootstrap

The root `render.yaml` is a **Free compute bootstrap with AI disabled**. It
does not create a ledger or offer live review. It lets the already-connected
Blueprint build the backend and expose `/health` before a paid storage decision.
No OpenAI key is required at this stage. It is not a substitute for persistent
storage and must not be used for paid reviews on an ephemeral filesystem.

In the connected Blueprint, sync `render.yaml` from `main`. Use repository root
(leave Root Directory empty), Node 22, build
`npm ci --include=dev && npm run build:backend`, start `npm run start:backend`,
health path `/health`. Render supplies `PORT`; the server binds `0.0.0.0`.
Do not upload only `backend/`: its build imports shared source from `src/`.

`autoDeployTrigger: checksPass` requests **After CI Checks Pass**. Confirm that
setting in the actual Render service after initial sync. GitHub Actions runs
fixtures, both typechecks and both builds, plus a tracked-sensitive-file check.
The always-run `Required checks` job fails when verification is anything except
success, including skipped/canceled. If using branch protection, require that
job. No OpenAI secret or paid call is needed by CI, and no deploy hook runs.
The first Blueprint provisioning is separate from subsequent CI-gated deploys;
do not treat initial sync as evidence that GitHub CI has completed.

## Paid storage decision, before enabling AI

`deploy/render.persistent.yaml` is an **inactive, reviewable template**, not the
Blueprint's default path. It proposes one `0.5c-512mb` paid instance and a 1 GB
persistent disk at `/var/data`, with no replicas. Confirm the current compute,
disk, bandwidth/build charges and account/service in the Render dashboard before
applying it. No paid service has been authorized by committing this template.
The current public pricing page did not expose a reliable numeric price to the
documentation fetch; use the dashboard's actual quote rather than a stale price.
Even Free compute has usage limits and possible bandwidth/build overages.

After cost approval, update the **existing** root Blueprint to the persistent
template and sync; do not create a second independently budgeted backend.
Keep `REVIEW_ENABLED=false` during setup. `sync:false` values are entered by
the owner; for an existing service, add them explicitly in Environment because
Blueprint sync does not supply missing secret values automatically:

| Variable | Value/purpose |
| --- | --- |
| `OPENAI_API_KEY` | Existing key, backend secret only |
| `REVIEW_ACCESS_TOKEN` | Separate random 32+ character secret |
| `REVIEW_ALLOWED_ORIGINS` | Exact Site origin above; no wildcard or trailing slash |
| `REVIEW_ENABLED` | `false` until runtime ledger is prepared |
| `REVIEW_PERSISTENT_DISK_CONFIRMED` | `true` only after verifying the attached mount |
| `REVIEW_LEDGER_PATH` | `/var/data/architecture-review-ledger.json` |
| `REVIEW_BUDGET_USD` | `1`, must match the preserved ledger |
| `REVIEW_MODEL` | `gpt-5.4-mini-2026-03-17` |
| `NODE_VERSION` | `22` |
| `PORT` | Supplied by Render; do not set a local port here |

## Runtime ledger bootstrap or migration

Disks are unavailable during build and pre-deploy. Do not put initialization in
either command or the normal start command. Use the **running paid service's
Shell** with reviews disabled:

- If no paid calls have occurred anywhere and no ledger exists, initialize once
  with `node backend/dist/init-ledger.mjs`. It uses the configured environment
  and refuses overwrite. The mounted parent directory must already exist.
- If local tests already used a ledger, stop the local backend cleanly, securely
  transfer that exact ledger to the mounted path, and preserve its `reserved`
  count and original budget. Do not initialize a second $1 allowance. Do not
  copy an active lock or run both servers against independent copies.
- If transfer/reconciliation is not complete, remain disabled. An uncertain
  paid result retains its reservation. Never reset accounting for a deploy.

Then set `REVIEW_ENABLED=true` and restart/deploy. A missing/corrupt/locked ledger
keeps review disabled. A disk permits one instance and causes downtime during
deploys; this configuration does not promise zero downtime.

## Verify and connect the Site

Use the actual HTTPS URL Render assigns (not a guessed subdomain). Verify:

1. `GET /health` -> 200, only a liveness check.
2. `/api/review/status` with the allowed Site Origin and no token -> 401.
3. An unknown Origin -> 403; allowed preflight -> 204 with the exact origin.
4. Authenticated status -> `enabled:true` and the preserved remaining allowance.
5. Only then run an approved synthetic live review within the shared $1 cap.

The existing UI supports this without a Sites redeploy: Builder -> **Architecture
review** -> **Connect your review backend**. Enter the HTTPS backend URL and
`REVIEW_ACCESS_TOKEN`, check the trust box, then **Connect backend**. Review the
graph consent before requesting AI; inspect Preview, explicitly Apply, then Undo.
Only the public URL is saved; the token stays in tab memory. Never enter the
OpenAI key here or in any `VITE_` setting. If the hosted Site lacks these controls,
report that separately and publish the matching frontend through Sites; pushing
to GitHub alone does not update a ChatGPT Site.

## Rollback without resetting spend

Disable reviews, stop any active request, preserve the current ledger, then
roll back code to a compatible known-good commit in Render. Keep the same
persistent disk and environment. Do not restore an older disk snapshot or
ledger along with old code: that would erase already reserved spending. If a
crash leaves a lock, stop all writers and reconcile uncertain calls before any
manual recovery. Do not delete state automatically on boot or deployment.

## Official references checked 2026-11-01

- [Blueprint fields and validation](https://render.com/docs/blueprint-spec)
- [Deploys and CI integration](https://render.com/docs/deploys)
- [Persistent disk lifecycle and limitations](https://render.com/docs/disks)
- [Free instance limits](https://render.com/docs/free)
- [Current pricing](https://render.com/pricing)
- [GitHub workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
