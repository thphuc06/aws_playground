# DVA-C03 architecture assistant

My architecture, AI review and AI proposal are separate views over a versioned
local workspace. Reviews are read-only. Design tools edit an isolated copy;
only explicit Preview/Use this proposal adopts it. Protected node IDs and
service types cannot be removed/replaced by the agent. The UI preserves compute
and primary data-store nodes by default. Goal/priority and protected nodes are
sent with an immutable graph snapshot. A changed original makes adoption stale.

The 58-profile union covers56 C03 entries plus AppSync/Q Developer compatibility.
326 fields describe DVA-level architectural intent; omitted values are unknown.
This is not a complete AWS Console schema. Legacy exercise settings remain
separate and do not prove production permissions, network or handler behavior.
Unsupported simulator relationships do not make an architecture invalid in AWS.

## Agent and references

GPT-6.1 Sol uses the Responses API, medium reasoning, store:false and strict
function definitions. Tools are get_service_schema, get_relevant_references,
search_aws_docs, edit_draft, validate_draft and finish_draft. Tool arguments,
draft edits and final results are validated on the server; the client validates
the returned graph again. No tool runs shell, deploys AWS or retrieves arbitrary
model-supplied URLs. Retrieved content and graph strings are untrusted data.

Schemas return registered curated source IDs; references are selected by service
and relation rather than dumping every teaching link. Live search is restricted
to AWS official domains. Kiro's pre-reviewed official product source kiro.dev
is permitted as a curated reference. Findings can only cite registered source
IDs; displayed sources distinguish curated from retrieved-this-run evidence.
An available link is not proof that every claim in it was checked.

Each workflow is bounded by8 Responses calls (including research subcalls),
24 function calls,2 searches,8192 output tokens per response and300 seconds.
The final available response is reserved for finish, which independently
validates the graph. Invalid edits are atomic failures and may be repaired
within these bounds. Limit/timeout/cancel retains the prior saved proposal.

The owner explicitly removed access-token authentication, disk persistence and
USD caps. Anyone who can reach the backend can request billable work; CORS does
not authenticate them. Process-wide concurrency/rate limits remain. Usage is
summed across model/research calls; the displayed dollar figure is a rough
standard-rate estimate, not an invoice. Network/incomplete results are marked
uncertain rather than assumed free. No automatic provider retry.

No fallback model is silently substituted if Sol is unavailable. Secrets stay
in backend environment settings; no API key is sent to the browser or Git.
Browser consent explicitly covers graph submission and documentation research.

Official references reviewed2026-11-01:
- https://developers.openai.com/api/docs/models/gpt-6.1-sol
- https://developers.openai.com/api/docs/guides/function-calling
- https://developers.openai.com/api/docs/guides/tools-web-search
