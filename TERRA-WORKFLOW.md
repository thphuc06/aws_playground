# Terra and resumable design workflows

2026-11-02. Replaces the earlier8-Response/5-minute default. No USD cap, disk, caller token or database was introduced.

## Render settings

Set these after deploying the new backend. Existing Sol remains supported during migration.

| Environment | Value |
|---|---|
| REVIEW_MODEL | gpt-6.1-terra |
| REVIEW_REASONING_EFFORT | medium |
| REVIEW_MAX_RESPONSES | 32 |
| REVIEW_MAX_TOOL_CALLS | 100 |
| REVIEW_MAX_SEARCHES | 6 |
| REVIEW_MAX_OUTPUT_TOKENS | 12288 |
| REVIEW_TIMEOUT_SECONDS | 1200 |

Keep OPENAI_API_KEY, REVIEW_ENABLED=true, the exact Site REVIEW_ALLOWED_ORIGINS and Node22. No new secret is needed. These are code defaults as well as Blueprint/example settings. The actual model comes from the env; no silent model fallback occurs.

Finite override ranges:4–64 Responses,8–200 function calls,0–12 searches,2048–32768 output tokens per Response,60–1800 seconds. Invalid settings disable AI with a configuration error. Search Responses count toward the provider-response budget. Tools execute sequentially and mutations stay atomic. Topology batches allow up to50 operations. One simultaneous workflow and3 starts/minute per process remain.

## Recovery

Successful edit/configuration/network/security tools emit a checkpoint. The browser keeps it separately from the original and the last completed proposal, persists it in workspace storage and reports storage failures. It is incomplete, never labeled final or directly adoptable. A failed/canceled run retains its latest checkpoint. Continue unfinished draft is enabled when the original fingerprint, purpose, priority and protected-node list still match. Checkpoint inspection is enabled once the current run stops.

Continuation starts a new bounded workflow using the checkpoint graph, with the original graph retained as the review/adoption base. It does not reuse hidden provider reasoning or stale citations; schemas/references can be fetched again. Server and client validate graph shape and protected nodes. A successful final result clears the checkpoint. Starting a new proposal asks before replacing an existing unfinished checkpoint.

The browser deadline follows the advertised server timeout plus30 seconds. Total SSE bytes are bounded at128MiB, incomplete buffered events at6MiB, and assistant request bodies at4MiB. These are app transport guardrails, not AWS quotas.

## Model and cost

Terra uses Responses, strict function schemas, store:false and the selected reasoning effort. Sol remains an explicit supported alternative. Standard token estimates use the chosen model, reported cached tokens and per-request long-context thresholds. Search calls are estimated separately. Estimates are not invoices and exclude cache-write/region-specific adjustments.

Official references checked2026-11-02:
- https://developers.openai.com/api/docs/models/gpt-6.1-terra
- https://developers.openai.com/api/docs/models/gpt-6.1-sol

## Verification

The existing local key returned Terra model metadata successfully (HTTP200); no paid generation was made. Tests cover configurable finite limits, model selection/pricing, checkpoint emission before provider failure, protected-node resume rejection, persistence/reload and UI continuation sending the checkpoint with the original graph. Provider behavior uses local fixtures; real Terra enterprise-design quality and20-minute Render connectivity are not established by these tests. Browser E2E was not performed.
