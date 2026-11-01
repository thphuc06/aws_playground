# Local setup — no disk required

Use Node 22 on Windows, Linux or macOS. WSL is optional. The project is at
`C:\HCMUS\DVA\aws_playground` on the owner's machine.

```sh
npm ci
npm test
npm run typecheck
npm run typecheck:backend
npm run build
npm run build:backend
```

If `.env.local` does not exist, copy `backend/.env.example` there. Preserve any
existing file. Enter your existing `OPENAI_API_KEY` privately. It does not belong in Git,
chat, screenshots or frontend variables. `.env.local` is ignored.

Set `REVIEW_ENABLED=true`, `REVIEW_BUDGET_USD=1`,
`REVIEW_MODEL=gpt-5.4-mini-2026-03-17`, `PORT=8787`, and
`REVIEW_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173`.
No ledger path, disk assertion or initialization command is needed. Old
`REVIEW_LEDGER_PATH` and `REVIEW_PERSISTENT_DISK_CONFIRMED` values are ignored.

Start the backend, then the frontend in a second terminal:

```sh
npm run start:backend:local
npm run dev
```

Open the URL Vite reports (normally http://127.0.0.1:5173). In Builder ->
Architecture review, enter `http://localhost:8787`,
explicitly trust/connect, then consent to submitting the synthetic graph.
Inspect Preview before Apply. Undo is available in the same browser session
only while the graph has not changed after Apply.

## Public endpoint and budget behavior

No access token is required. Anyone who can reach the backend can request paid
reviews; CORS is a browser policy, not authentication, and Origin can be forged.
The process-wide budget and rate limits are shared by all callers.


The allowance lives only in process memory. It resets on restart, deployment,
idle spin-down or a new instance. It is NOT a cumulative $1 or account-wide
billing cap. One running process is recommended; instances do not share limits.
Failed/timeout/invalid requests keep their conservative reservation for that
process's lifetime. Output/body limits, CORS, one concurrent
review, three starts per minute and no automatic retry remain enforced.

## Optional paid smoke

Only with owner authorization, `npm run smoke:live` sends one synthetic review
through the running application backend. Configure `REVIEW_BACKEND_URL` and
`REVIEW_SMOKE_ORIGIN` in `.env.local`. It validates Preview/Apply/JSON roundtrip/
Undo; advice-only responses are reported as not exercising Apply/Undo.
This is not browser E2E. Restarting does not authorize more paid tests.
No paid calls were made while implementing the diskless change.
