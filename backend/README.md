# Optional user-hosted architecture-review backend

**Disabled by default. No API request or secret setup was performed by the app builder.** This is a separate Node 22+ service, not part of the static private Site. The user configures an existing OpenAI key privately and hosts this service locally or on a single Render instance with an attached persistent disk. See the root `BACKEND-SETUP.md` for setup steps.

## Build and run (repository root)

Install root dependencies with `npm ci`, then `npm run build:backend`. The bundle includes the same graph validators, settings models and dated teaching references as the frontend. No runtime TypeScript loader or OpenAI SDK is required.

Copy `backend/.env.example` to an ignored private repository-root `.env.local` and edit values yourself. Never paste credentials into chat, the canvas, source, build commands or frontend bundles. `OPENAI_API_KEY` stays on this server. `REVIEW_ACCESS_TOKEN` is a separate strong random 32+ character secret; enter only this second token transiently into the UI. Do not save it in browser localStorage. Configure exact frontend origins; CORS is not authentication.

With an existing persistent directory, explicitly initialize **once** from the repository root:

```
node --env-file=.env.local backend/dist/init-ledger.mjs
node --env-file=.env.local backend/dist/server.mjs
```

Initialization refuses to overwrite an existing ledger. The default local port is **8787**; Render supplies `PORT`. The public `/health` endpoint exposes only `{ok:true}`. Authenticated readiness is `/api/review/status`. A live request requires `REVIEW_ENABLED=true`, the configured token and key, an exact allowed Origin, a supported model and a usable durable ledger. `REVIEW_PERSISTENT_DISK_CONFIRMED=true` is required for enabled operation locally too: confirm the directory is genuinely persistent first. On Render, use an attached disk's mounted path, not an ephemeral filesystem; free/ephemeral-only deployments must remain disabled.

## Request contract

- `GET /api/review/status`: `Authorization: Bearer <review access token>` and allowed `Origin`.
- `POST /api/review`: same headers plus `Content-Type: application/json` and `X-Architecture-Review: 1`.
- Body: `{graph,baseFingerprint,consent:true}`. Fingerprint is the frontend's exact canonical snapshot, not a hash. The duplicated snapshot means larger graphs can hit the 64 KiB transport cap; this is reported, not truncated silently.
- Success: `{review:{summary,findings:string[],proposal:Proposal|null},sources,omittedServices}`. Proposals pass the shared local validator server-side; the client still previews and requires a separate apply action. Advice-only results return `proposal:null`.
- Error: `{error,reason}` with safe descriptions and no provider response body. All JSON responses use `Cache-Control: no-store`.

The model receives the graph, per-node effective settings/defaults and app-maintained teaching summaries with official source URLs, not live website retrieval. Detailed reference summaries are limited to the first 12 distinct services, with omitted service IDs disclosed. All other services' effective settings remain in context. No arbitrary remote URLs, AWS APIs, tools, shell commands or model-proposed actions are executed. Labels/config strings remain untrusted data under fixed instructions. Schema validity does not establish production AWS correctness.

## Controls and honest limits

- Exact allowlisted model: `gpt-5.4-mini-2026-03-17`; no client model override.
- Responses API structured JSON, `store:false`, output cap 1,600 tokens, text only, no tools, no automatic retries, fixed HTTPS provider endpoint, redirects rejected.
- 64 KiB actual streamed request cap irrespective of dishonest Content-Length; unsupported compression rejected. Absolute body-read deadline 10 seconds. Provider payload cap 256 KiB and total fetch deadline 35 seconds. Node limits header bytes to 8 KiB and receipt time to 10 seconds.
- One in-flight request and three starts/minute for the configured access token, in process memory. These rate limits reset on restart; they are **not** a distributed persistent rate limiter. The durable spend reservation does not reset.
- Explicit initial budget above zero and at most **$1**. No budget means disabled. Before each provider call, the server reserves a conservative cost in integer microdollars and fsyncs state using atomic rename. It never refunds a reservation, including timeouts or provider errors, because the billing outcome may be uncertain.
- Reservation assumes up to one input token per UTF-8 serialized request byte plus 8,192 framing tokens, and the full output cap. Rates are intentionally higher than the reviewed snapshot's standard rates: **$2/M input and $10/M output**; no cache discount. This is a conservative application guard, **not a guaranteed OpenAI billing cap**, token-metering proof, or account-wide budget. Other applications using the key are outside this ledger; taxes/pricing changes are outside it. Monitor provider usage separately and recheck pricing before use.
- The ledger uses POSIX-oriented file/directory fsync: use Linux/macOS or Windows via WSL; native Windows is not verified and may fail closed. The ledger is single-process/single-instance. An exclusive `.lock` prevents concurrent use. A crash leaves the lock in place and the next boot fails closed. Never casually delete/reset the ledger to fix a startup issue. Verify no previous process is live, preserve the budget/reservations and investigate `.next` interrupted-write state before an authorized operator removes a stale lock. Do not run replicas, reset state on deploy, or put the ledger on ephemeral storage.
- `store:false` does not mean zero provider retention: API abuse-monitoring/data-control policies still apply. No raw graph, prompts, responses, tokens or secrets are logged by this server. The operator must also review proxy/platform logging.

## Explicit user-run real-call smoke

This command is provided, **not executed here**. After the service is running and the user has approved its budget and data flow, from the repository root:

```
node --env-file=.env.local backend/dist/live-smoke.mjs --live-approved
```

Without `--live-approved` it sends no request. It checks authenticated backend status and remaining budget (<= $1), then submits one small synthetic Lambda graph through the normal backend and ledger. It does not call OpenAI directly. It validates a returned proposal, previews/applies it locally, serializes/reloads the mock graph and checks undo. If the provider returns advice only, it explicitly reports that apply/undo were not exercised on real output. It never modifies browser localStorage or AWS resources. Errors do not trigger retries. This verifies only that one configuration/account/model response, not every future architecture.

## Verification

`npm test` at repository root includes backend fixture tests. `npm run typecheck:backend` checks Node and shared TypeScript. Fixtures inject a fake transport; they do not consume API credits. Coverage includes auth/CORS, body/header limits, disabled/no-ledger cases, conservative reservation persistence and lock contention, rate/concurrency, timeout, refusal/incomplete/error/malformed output, invalid proposals, and an HTTP-shaped review→preview→apply→serialized reload→undo smoke.

Official references checked 2026-11-01:
- https://developers.openai.com/api/docs/models/gpt-5.4-mini
- https://developers.openai.com/api/docs/guides/structured-outputs
- https://developers.openai.com/api/docs/guides/your-data
- https://render.com/docs/disks (deployment storage prerequisite; verify selected plan before enabling)
