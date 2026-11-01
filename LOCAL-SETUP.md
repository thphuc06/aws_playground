# Local setup (Windows + Ubuntu WSL)

The repository is at `C:\HCMUS\DVA\aws_playground`. Use Node 22. Native
Windows can build the frontend/backend, but its directory `fsync` fails the five
durable-ledger tests. Use Linux Node in Ubuntu WSL for the backend and complete
test suite. Do not skip these tests or weaken `fsync`.

## Install and verify

Use a Linux filesystem checkout, separate from Windows `node_modules`:

```bash
git clone https://github.com/thphuc06/aws_playground.git ~/aws_playground
cd ~/aws_playground
node --version  # must be Linux Node 22, not Windows npm through PATH
npm ci
npm test
npm run typecheck
npm run typecheck:backend
npm run build
npm run build:backend
npm run check:secrets
```

During setup on this machine a verified official Node 22 distribution was
installed without changing the system Node at:
`/home/phuc/.local/share/aws-playground-tools/node-v22.23.4-linux-x64/bin`.
In WSL, prepend that directory to PATH if Node is not otherwise installed:

```bash
export PATH=/home/phuc/.local/share/aws-playground-tools/node-v22.23.4-linux-x64/bin:$PATH
```

## Private local configuration

Only create `.env.local` if it does not exist. Never overwrite an existing file.
Use `backend/.env.example` as the template. `.env.local` is ignored by Git.
Enter secrets in your editor, never in chat or command arguments:

- `OPENAI_API_KEY`: your existing key, backend only.
- `REVIEW_ACCESS_TOKEN`: a DIFFERENT random value, at least 32 characters.
- `REVIEW_ENABLED=false` until you are ready for the approved live test.
- `REVIEW_ALLOWED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173`.
- `PORT=8787`.
- `REVIEW_LEDGER_PATH`: absolute path on the WSL Linux filesystem, for example
  `/home/phuc/.local/share/aws-playground/review-ledger.json`.
- `REVIEW_PERSISTENT_DISK_CONFIRMED=true` only after checking durable storage.
- `REVIEW_BUDGET_USD=1`: initial cumulative limit, never reset to repeat testing.
- `REVIEW_MODEL=gpt-5.4-mini-2026-03-17`.
- `REVIEW_BACKEND_URL=http://localhost:8787` and
  `REVIEW_SMOKE_ORIGIN=http://localhost:5173` for the optional live smoke.

Create the ledger parent directory first. Initialize only a genuinely new ledger
once; if one exists, preserve and use it. The initializer refuses overwrite:

```bash
mkdir -p /home/phuc/.local/share/aws-playground
npm run ledger:init:local
npm run start:backend:local
```

In another terminal at the project root:

```bash
npm run dev -- --port 5173 --strictPort
```

Open <http://127.0.0.1:5173>. In Builder, expand **Architecture review**, enter
the backend URL and the separate review token, then explicitly trust/connect.
`GET /health` proves liveness only. Review stays unavailable until enabled with
valid credentials, allowlist and durable ledger. The HTTPS hosted Site should
use an HTTPS Render backend, not this HTTP localhost address.

## Real-provider check: wait until the owner enters the key

After private key entry and owner confirmation, set `REVIEW_ENABLED=true`, restart
the backend, and run **one** `npm run smoke:live` from the same configured root.
It calls the application backend, not OpenAI directly. No automatic retry.
The command checks returned schema/proposal, preview, apply, JSON persistence
roundtrip and undo on synthetic in-memory data. An advice-only response is
reported honestly: no real-response Apply/Undo was exercised. This is not a
browser E2E test; inspect the browser separately. Stop if the outcome is unclear.

All attempts share the same ledger. Failed/timeout/invalid calls retain their
reservation. Never delete `.lock`, `.next` or ledger files to make a test pass.
Investigate stale locks only after stopping every writer. Undo is session-only
and rejects a graph changed after Apply.

The pinned model's standard text prices were checked on 2026-11-01: $0.75 per
million input tokens and $4.50 per million output tokens. The existing backend
reserves more conservatively ($2/$10 per million and a byte-based input bound).
See [OpenAI model documentation](https://developers.openai.com/api/docs/models/gpt-5.4-mini).
