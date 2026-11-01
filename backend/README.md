# Architecture review backend

Node 22, no disk or ledger initialization. See [local setup](../LOCAL-SETUP.md)
and [Render setup](../DEPLOY-RENDER.md). Install/build from repository root because
the backend imports shared graph validation and learning references from `src/`.

```sh
npm ci
npm run build:backend
npm run start:backend:local
```

The local script loads ignored `.env.local`; Render uses `npm run start:backend`
with its environment settings. OpenAI keys stay server-side. A distinct 32+
character `REVIEW_ACCESS_TOKEN` and exact origin allowlist are mandatory.

## API and limits

- `GET /health`: process liveness only.
- `GET /api/review/status`: bearer token and allowed Origin required; reports
  enabled/reason, limits, and budget with `scope:process`, `resetsOnRestart:true`.
- `POST /api/review`: same auth, JSON content type, `X-Architecture-Review:1`,
  body `{graph,baseFingerprint,consent:true}`. Result contains guarded proposal
  or advice only. Safe errors do not expose raw provider responses.
- Model fixed to `gpt-5.4-mini-2026-03-17`; strict Responses schema, no tools,
  `store:false`, 1,600 output tokens, no automatic retries.
- 64 KiB request cap, 256 KiB provider response cap, 35-second provider timeout,
  10-second body-read deadline, one in-flight review, three starts/minute.
- Conservative reservations use $2/M input and $10/M output with byte-based
  input estimate plus framing. Never refund uncertain results during a process.
- **Memory allowance resets on restart/deploy/spin-down and is per instance.
  It is not cumulative or account-wide billing enforcement.**

Labels/configs are untrusted data under fixed instructions. Server and client
validate edits, reject stale snapshots and require explicit Preview/Apply.
Undo protects newer edits and is session-only. No real AWS operation executes.

`npm test` uses fixtures and consumes no API credits. `npm run smoke:live` is an
explicit, separately authorized paid synthetic review through this backend. It
checks JSON roundtrip and Undo in memory, not browser localStorage E2E.
