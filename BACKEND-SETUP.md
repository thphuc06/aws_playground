# Architecture review: local setup, then Render

The frontend stays a static app (local Vite or the private ChatGPT Site). A separate Node backend holds the OpenAI API key and calls OpenAI. The browser receives **only your backend URL and a separate review access token**. This is a personal, single-operator deployment—not a multi-user authentication service.

**Verification boundary:** All 33 backend fixture tests use fake provider responses and passed independently, as did backend typecheck/build and a real local HTTP health check with review disabled and no credentials. No OpenAI key was retrieved or created, no paid provider call was made, and no Render service was deployed during preparation. The optional live step below is for you to run after reviewing the transmitted data and budget.

## 1. Keep the two secrets separate

- `OPENAI_API_KEY`: enter manually into an ignored local environment file or Render's secret environment settings. **Never** put it in the frontend, a `VITE_` variable, the review access-token field, Git, a screenshot, or this chat.
- `REVIEW_ACCESS_TOKEN`: a different, randomly generated value of at least 32 characters. It authorizes spending through this one backend. Keep it private and rotate it if exposed. Use a password manager to generate/store it.
- The browser sends the review token as an `Authorization: Bearer …` header. It is transient browser state, not an OpenAI credential. Reloading/clearing the connection requires entering it again.
- Configure exact allowed frontend **origins**: scheme + host + port, without a route or trailing path. CORS restricts cooperating browsers; **CORS is not authentication**. Non-browser clients can forge an Origin header, so the bearer token is mandatory.

The source ZIP must exclude `.env`, `.env.*` except checked-in examples, credential files, usage ledgers, lock files, `node_modules`, and `.git`. Keep the source lockfiles: they pin dependencies, not usage budgets.

## 2. Install and verify locally without spending

Use Node.js 22 and npm on macOS/Linux, or a Linux environment such as WSL on Windows. Native Windows durable-directory fsync behavior is not verified; do not weaken persistence checks to bypass an error. From the extracted project root:

```sh
npm ci
npm run build:backend
npm test
npm run typecheck:backend
npm run build
```

The backend build bundles the shared architecture rules. Do not upload only `backend/` without the shared source/build inputs. Start the frontend separately:

```sh
npm run dev -- --host 127.0.0.1
```

Open the URL Vite reports. Its port is normally 5173, but use the actual port in the allowed-origin setting. For initial setup use local frontend + local backend; an HTTPS hosted Site should not be expected to call an HTTP localhost server reliably, especially on a phone where localhost means the phone itself.

## 3. Configure the backend manually

Copy `backend/.env.example` to **project-root `.env.local`**, then edit it locally. Do not paste secret values into command arguments or shell history. Keep review disabled while preparing:

| Variable | Local value / purpose |
| --- | --- |
| `PORT` | `8787` |
| `OPENAI_API_KEY` | Your manually entered OpenAI API key; server only |
| `REVIEW_ACCESS_TOKEN` | Separate random 32+ character review token |
| `REVIEW_ALLOWED_ORIGINS` | Exact local origin, e.g. `http://localhost:5173`; comma-separated if needed |
| `REVIEW_ENABLED` | `false` initially; change to `true` only for an intentional live review |
| `REVIEW_BUDGET_USD` | At most `1` for this initial authorization; may be smaller |
| `REVIEW_LEDGER_PATH` | An absolute path under the ignored `backend/data/` directory |
| `REVIEW_PERSISTENT_DISK_CONFIRMED` | Required `true` after verifying durable storage: an existing local directory for local use, or the actual attached Render disk with the ledger path inside its mount |

Use an absolute ledger path for your own machine, not the development worker's path. Example shape: `/home/YOU/aws-developer-playground/backend/data/review-ledger.json`. Windows users running WSL should use the Linux environment’s absolute path. Never store the ledger inside the published frontend `dist/` directory.

Create the parent directory first (for the suggested local location, `mkdir -p backend/data` on macOS/Linux). Set `REVIEW_PERSISTENT_DISK_CONFIRMED=true` only after verifying the chosen path persists. Initialize a **new** ledger exactly once with the configured budget:

```sh
node --env-file=.env.local backend/dist/init-ledger.mjs
```

Then start the backend with the same file:

```sh
node --env-file=.env.local backend/dist/server.mjs
```

Do not rerun initialization to recover from an error or reset spending. A missing, corrupt, unwritable or already-locked ledger is a safety stop, not an invitation to delete state. Normal startup must not manufacture a fresh budget.

## 4. Understand the initial $1 guard before enabling reviews

The app reserves a conservative maximum for each allowed request **before** making the outbound call and persists that reservation. Failed calls, timeouts and malformed provider replies retain their reservation: they may have incurred provider work, and blindly refunding could allow repeated spending. The remaining allowance is therefore deliberately conservative and is **not an OpenAI billing balance**.

The initial budget applies to this backend and its retained ledger, at the documented model rates and request bounds. It does not constrain unrelated API keys, other applications, taxes, hosting charges, or a user manually changing/deleting the ledger. Keep your own OpenAI project/account controls and inspect actual usage. Pricing changes require reviewing the server's reservation calculation before continuing.

Only one process may use the ledger. Do not run multiple replicas, cluster workers, a second server, or an independently initialized copy. An exclusive lock blocks concurrent use. A crash can leave a lock behind; first stop every process that could use the ledger, preserve the files, inspect recorded reservations and reconcile uncertain calls. Remove a stale lock only after that investigation. Never remove it merely because startup reports it.

## 5. Optional intentional real-provider check

1. Confirm that your API account has access to the configured model and that you accept a billable call. ChatGPT subscription status alone is not proof of API access or credits.
2. Inspect the review preview. Use synthetic service names and labels; do not include credentials, customer records, private endpoints, or confidential architecture details you are not allowed to send.
3. Set `REVIEW_ENABLED=true` in `.env.local`, restart the backend, and connect the frontend to `http://localhost:8787` with the separate review token.
4. Submit **one** small review. Check whether the UI reports a validated result or an explicit provider/authentication/budget failure. Do not describe a mock result as a real OpenAI response.
Alternatively, after the backend is running, use the supplied **user-run** command from the project root:

```sh
node --env-file=.env.local backend/dist/live-smoke.mjs --live-approved
```

This command was **not run against OpenAI during preparation**. Set `REVIEW_BACKEND_URL=http://localhost:8787` and `REVIEW_SMOKE_ORIGIN=http://localhost:5173` in the same private environment file, or use your exact HTTPS Render backend and allowed Site origin. Without `--live-approved`, it sends no request. With the flag, it checks authenticated status and a remaining allowance no greater than $1, then submits one synthetic Lambda graph through the regular backend and ledger—not directly to OpenAI. It checks preview/apply/JSON-roundtrip/undo only on a synthetic in-memory graph; no browser graph or AWS resources change. If the provider returns advice without edits, the output explicitly says that real-response Apply/Undo was not exercised. Running both this command and the UI review makes two intentional attempts, not one.

5. Check the retained reservation and OpenAI usage separately. Disable review again when finished. A timeout can leave the provider outcome uncertain; do not repeatedly click retry as if no work occurred.

The model is pinned to `gpt-5.4-mini-2026-03-17`. The implementation uses the Responses API with a strict structured-output contract. A schema constrains shape, not truth: refusal, incomplete output, invalid references and unsupported claims still need handling. Architecture advice is educational; it does not certify security or execute AWS changes. Apply requires your explicit preview/confirmation. Undo is a live-session capability: applied graph data can persist across page reloads, but the undo token does not survive a full reload. A graph changed after Apply also blocks Undo to protect newer work. [OpenAI model documentation](https://developers.openai.com/api/docs/models/gpt-5.4-mini), [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs).

## 6. Deploy the backend to Render yourself

This is a deployment recipe, not authorization for the assistant to create a repository, subscription or service. Keep the code in a private repository you choose; do not include local secrets or ledger data in Git. Render web services accept a linked repository or supported image deployment. Use a **paid single-instance web service with a persistent disk** for this file-backed budget design; do not substitute ephemeral storage. [Render web services](https://render.com/docs/web-services), [Persistent disks](https://render.com/docs/disks).

Suggested repository-root configuration:

| Render setting | Value |
| --- | --- |
| Runtime | Node |
| Root directory | Repository root (leave empty), not `backend` |
| Build command | `npm ci && npm run build:backend` |
| Start command | `npm run start:backend` |
| Health check path | `/health` (process liveness only, not proof live reviews are enabled) |
| `NODE_VERSION` | `22` (pin the supported major rather than relying on Render's changing default) |
| Disk mount path | `/var/data` |
| `REVIEW_LEDGER_PATH` | `/var/data/review-ledger.json` |
| `REVIEW_PERSISTENT_DISK_CONFIRMED` | `true`, after attaching and verifying the disk |
| `REVIEW_ENABLED` | `false` during deployment and ledger preparation |
| `REVIEW_ALLOWED_ORIGINS` | The exact HTTPS origin where the Site actually runs; add other trusted origins individually |
| Secrets | Enter `OPENAI_API_KEY` and the separate `REVIEW_ACCESS_TOKEN` in Render's Environment settings |

Render supplies `PORT`; the server must listen on that value on `0.0.0.0`. Do not force the local port on Render. Pinning the Node version avoids an unreviewed major-version change. Secret values belong in Render's settings, not committed YAML. [Port binding](https://render.com/docs/web-services), [Node version](https://render.com/docs/node-version), [Environment variables](https://render.com/docs/configure-environment-variables).

**Ledger setup occurs at runtime, not in the build command.** Render disks are not available during build; only files under the mounted directory persist. Use the service's authorized runtime shell/admin workflow to initialize a genuinely new ledger or transfer the existing one. Keep startup fail-closed until that step succeeds. A disk supports a single service instance; this design is not horizontally scalable. [Render disk limitations](https://render.com/docs/disks).

### Preserve the same allowance when moving from local to Render

If you already made local live calls, stop the local backend and preserve its ledger. Transfer that ledger securely to the configured disk rather than creating another $1 ledger. The ledger contains accounting state, not your OpenAI key; nevertheless do not publish it. Do not copy an active process's lock as if it were a portable permission to run. Check the migration with review disabled. If exact transfer cannot be completed safely, remain disabled and reconcile the consumed reservations before choosing a reduced remaining allowance—do not silently reset the cap.

Once runtime state is healthy, enable review in Render, deploy/restart as required, and connect the Site to the backend's HTTPS origin using the review token. Verify unauthorized requests fail and the intended Site origin is accepted before attempting a billable review. The static Site never needs the OpenAI key.

## 7. Failure checklist

- **Unauthorized:** use the backend review token, not an OpenAI key; check rotation and exact token entry. Do not loosen authentication.
- **Origin denied:** use the actual page origin, not a share-link URL with a path. Do not replace the allowlist with `*`.
- **Review disabled / missing ledger:** verify the enabled setting, absolute path, disk mount and explicit initialization. Preserve state.
- **Budget exhausted:** stop. Failed calls can consume reservations. Do not delete the ledger or create a second allowance.
- **Locked ledger after a crash:** stop all writers and investigate; a lock protects against duplicate spending.
- **Provider 401/403 or model unavailable:** inspect your own API account/key/project access securely. Do not print the key or swap models without reviewing price and compatibility.
- **Timeout/refusal/incomplete response:** no architecture result should be invented. Preserve the reservation and examine safe metadata before retrying.
- **HTTPS frontend cannot reach backend:** use a public HTTPS Render URL, exact allowed origin and valid bearer token. A Render private service is not directly reachable by a normal public browser.

`store:false` reduces Responses application-state retention but does **not** promise zero provider retention or override abuse-monitoring controls. Review applicable account data controls before submitting sensitive content. [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data).

Official deployment/API references checked **2026-11-01**. See `AI-REVIEW.md` for the review contract and security boundaries. See the final verification report for what was actually tested versus left for your live setup.
