# AI architecture review

The frontend remains a private static ChatGPT Site. The optional Node backend in `backend/` runs locally or on the owner's Render service. It is disabled until the owner privately configures an existing OpenAI key, a separate reviewer access token, an allowed frontend origin and the bounded spend ledger. See **BACKEND-SETUP.md** for exact setup and verification commands.

## Boundaries

- The OpenAI key belongs only in the backend's private `.env.local` or Render secret environment. Never enter it in the frontend. No key or live backend is bundled.
- The separate reviewer access token authenticates requests. The frontend retains it only in component memory, not localStorage. It is a bearer credential: protect it, use HTTPS and rotate it if exposed. CORS is an additional browser restriction, not authentication.
- A user-entered backend origin is public configuration. Only connect to a backend you control. Graph submission is explicit; no background review. Labels, sample events and settings are transmitted with the graph, so use fictional study data and never enter secrets or real production payloads.
- The provider receives a bounded structured graph, relevant source-reviewed learning context and fixed instructions. User text is untrusted data. No AWS credentials, deployments, code execution, provider tools or arbitrary URL retrieval are involved.
- Model responses are untrusted proposals. Strict local and server-side validators reject unknown services, fields, malformed configs, dangling/duplicate relationships and unsafe object keys. Model advice is not a comprehensive AWS security audit or proof of best practice.
- Preview shows changes and deterministic before/after findings. Apply is explicit and atomic. A stale snapshot is rejected; Undo only restores while the canvas still matches the applied result, avoiding loss of newer edits. Permission checkboxes remain learning assertions, never actual IAM policies.
- Existing four-integration walkthrough and 47 local lessons remain bounded. Advice does not magically add execution support for other relationships or new C03 services.

## Provider and budget

Only the server-owned allowlisted model is used; the browser cannot select models, endpoints, tools or token limits. Requests use structured outputs and `store:false`, bounded time/output and no automatic retries. `store:false` does not promise zero provider retention.

Official model reference checked 2026-11-01: `gpt-5.4-mini-2026-03-17`, standard text prices $0.75/M input and $4.50/M output. The backend uses more conservative reservation rates and permanently reserves a worst-case amount before each attempt, including failed or ambiguous attempts. This ledger is a local spending guard, not the provider invoice or a guarantee against account-wide spending by other apps. Do not reset it or create another allowance when moving from local to Render; transfer the same ledger and stop the old backend. Persistent storage and one active instance are required.

The initial authorized testing ceiling is **$1 total**, not the user's entire account credit balance. No top-ups, production budget, Render purchases or deployment were performed by the assistant. The supplied real-call smoke command is for the user to run with their privately configured key; no live provider response was available during implementation.

## Official references

- https://developers.openai.com/api/docs/models/gpt-5.4-mini
- https://developers.openai.com/api/docs/guides/structured-outputs
- https://developers.openai.com/api/docs/guides/migrate-to-responses

See BACKEND-SETUP.md for Render's official deployment/storage references and explicit test limitations.
