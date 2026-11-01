# AI architecture review

The frontend remains a private static ChatGPT Site. The optional Node backend in `backend/` runs locally or on the owner's Render service. It is disabled until the owner privately configures an existing OpenAI key, an allowed frontend origin and the per-process memory allowance. See **BACKEND-SETUP.md** for exact setup and verification commands.

## Boundaries

- The OpenAI key belongs only in the backend's private `.env.local` or Render secret environment. Never enter it in the frontend. No key or live backend is bundled.
- At the owner's request, reviewer authentication and the access-token field were removed. Anyone who can reach the backend can request paid reviews. CORS restricts browsers but clients can forge Origin; it is not authentication. Limits apply to the process, not a user. The OpenAI key remains server-only.
- A user-entered backend origin is public configuration. Only connect to a backend you control. Graph submission is explicit; no background review. Labels, sample events and settings are transmitted with the graph, so use fictional study data and never enter secrets or real production payloads.
- The provider receives a bounded structured graph, relevant source-reviewed learning context and fixed instructions. User text is untrusted data. No AWS credentials, deployments, code execution, provider tools or arbitrary URL retrieval are involved.
- Model responses are untrusted proposals. Strict local and server-side validators reject unknown services, fields, malformed configs, dangling/duplicate relationships and unsafe object keys. Model advice is not a comprehensive AWS security audit or proof of best practice.
- Preview shows changes and deterministic before/after findings. Apply is explicit and atomic. A stale snapshot is rejected; Undo only restores while the canvas still matches the applied result, avoiding loss of newer edits. Permission checkboxes remain learning assertions, never actual IAM policies.
- Existing four-integration walkthrough and 47 local lessons remain bounded. Advice does not magically add execution support for other relationships or new C03 services.

## Provider and budget

Only the server-owned allowlisted model is used; the browser cannot select models, endpoints, tools or token limits. Requests use structured outputs and `store:false`, bounded time/output and no automatic retries. `store:false` does not promise zero provider retention.

Official model reference checked 2026-11-01: `gpt-5.4-mini-2026-03-17`, standard
text prices $0.75/M input and $4.50/M output. The backend reserves conservatively
before every attempt, retaining failed/uncertain calls in the current process.

At the owner's request, the disk requirement was removed. The allowance now
lives in memory and **resets on restart, deploy, idle spin-down or a new instance**.
`REVIEW_BUDGET_USD` is not a cumulative $1 or account-wide billing cap. No file
initialization or disk migration is needed; old local accounting files are left
untouched as historical records. No paid calls were made for this change.

The earlier local live test made two real requests: one invalid proposal was
rejected; the next passed Preview/Apply/JSON roundtrip/Undo on synthetic data.
This does not prove all future proposals will be valid or verify browser E2E.

## Official references

- https://developers.openai.com/api/docs/models/gpt-5.4-mini
- https://developers.openai.com/api/docs/guides/structured-outputs
- https://developers.openai.com/api/docs/guides/migrate-to-responses

See BACKEND-SETUP.md for Render's official deployment references and explicit test limitations.
