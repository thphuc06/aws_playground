# Render deployment — Free compute, no disk

Repository: https://github.com/thphuc06/aws_playground, branch `main`.
Frontend stays at https://aws-developer-playground-phuc.pointykayak.chatgpt.site.
Sync the existing Blueprint with the root `render.yaml`. No persistent disk,
ledger initialization, migration or WSL setup is required.

| Setting | Value |
| --- | --- |
| Runtime | Node 22 |
| Plan | Free |
| Root Directory | Empty (repository root) |
| Build | `npm ci --include=dev && npm run build:backend` |
| Start | `npm run start:backend` |
| Health | `/health` |
| Auto Deploy | After CI Checks Pass (`autoDeployTrigger: checksPass`) |

The build needs shared `src/` modules, so do not set root to `backend/`.
Render supplies `PORT`; the backend binds `0.0.0.0`. CI includes fixture tests,
both typechecks/builds and sensitive-file checks, with an always-run required
job that fails unless all required verification succeeded. No deploy hook or
paid API test runs in CI.

## Environment: seven values

| Variable | Value |
| --- | --- |
| `NODE_VERSION` | `22` |
| `OPENAI_API_KEY` | Your existing backend-only key |
| `REVIEW_ACCESS_TOKEN` | Different random secret, 32+ characters |
| `REVIEW_ALLOWED_ORIGINS` | `https://aws-developer-playground-phuc.pointykayak.chatgpt.site` |
| `REVIEW_MODEL` | `gpt-5.4-mini-2026-03-17` |
| `REVIEW_BUDGET_USD` | `1`, per-process reservation allowance |
| `REVIEW_ENABLED` | `true` |

The Blueprint uses `sync:false` for secrets. On an existing service, enter/keep
them directly in Environment; do not assume Blueprint sync creates missing
secret values. Remove obsolete `REVIEW_LEDGER_PATH` and
`REVIEW_PERSISTENT_DISK_CONFIRMED` fields if desired; this code ignores them.
Missing credentials or invalid budget still disable review. Do not put the
OpenAI key in frontend `VITE_` variables or in the review token field.

## What changed about the budget

**The counter is in memory and resets whenever Render restarts, redeploys or
wakes a new process after idle spin-down. It is not a cumulative $1 billing cap.**
Each instance has its own allowance. Failed/ambiguous calls keep their reservation
only for that process's lifetime. Use one instance and monitor provider usage.
The previous durable local ledger is preserved as historical evidence but is
not read, migrated or used by this version. No additional paid tests were run
for this change; the earlier testing authorization was not reset.

Free Render services can sleep while idle and have bandwidth/build limits.
Free compute is not a promise of free OpenAI usage or no Render usage overages.

## Verify and connect

After Render reports Live, use its actual HTTPS backend URL:

1. `/health` returns 200 (liveness only).
2. Status with the allowed Origin but no token returns 401; foreign Origin 403.
3. Authenticated `/api/review/status` reports `enabled:true`,
   `budget.scope="process"` and `budget.resetsOnRestart=true`.
4. On the existing Site, Builder -> Architecture review -> Connect your review
   backend: enter that HTTPS URL and the separate review token; trust/connect.
5. Submit a review only intentionally. Preview, Apply and Undo affect the local
   learning graph, never AWS resources.

Pushing GitHub code does not redeploy the Sites frontend. Existing connection
controls already accept the backend URL; a Sites publish is only needed to show
new frontend text. The source UI now explains the reset behavior on connection.

For rollback, choose a known-good diskless commit. Older disk-backed code will
require its former storage setup. A deploy/rollback resets memory accounting.
No production URL or deployment success is inferred from a successful push.

Official references checked 2026-11-01:
- https://render.com/docs/blueprint-spec
- https://render.com/docs/deploys
- https://render.com/docs/free
