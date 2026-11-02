# Assistant result integrity and interrupted runs

2026-11-02

Evidence: the user screenshot explicitly reports a workflow without a completed result and shows an older-snapshot report. The server initializes each DraftSession from the submitted graph and sends the current purpose/priority to Responses. No cached response, previous_response_id or fixed personal-summarizer graph is used in the production assistant. The summarization scenario in live-assistant-smoke.ts is a standalone test case, not imported into the server workflow.

Confirmed defects fixed:
- The 300-second deadline aborted the controller; the SSE emitter suppressed all events after abort, including the error. Clients could receive clean EOF without a final result or explanation. Deadline now emits a terminal workflow_timeout event before aborting. Client disconnect remains separate. Provider failures still do not retry.
- The UI switched to the draft and scrolled upward while retaining old data. The original diagram now stays in place; question, progress and result are ordered in the same assistant disclosure below it, with no automatic upward scroll.
- Prior results default to a clearly labeled closed history disclosure after a failed/canceled/interrupted attempt, on unknown legacy provenance, or when the graph/purpose/priority/protected nodes no longer match. Adoption is gated. The previous draft is preserved.
- Completed results include actual request context and completion time. Latest-attempt status persists on reload. Historical explanations and diffs use the original canonical snapshot rather than relabeling it with the current graph.
- The end-of-run automatic layout now preserves positions when frames exist, instead of moving nodes away from declared frame membership.
- SSE parsing accepts CRLF, multiline data and a complete final event without a trailing delimiter. Missing terminal results remain failures.

Verification:570 tests passed, including a JSDOM request/EOF/history regression, real handler timeout fixture, framed-layout preservation, stale goal/priority detection and SSE parsing. Frontend/backend typechecks, builds and HTTP/SSE local-provider smoke checks pass. No paid provider call was made; the exact reason for the user's historical run cannot be determined without its server trace. The known silent-timeout path is reproduced and corrected, not assumed to be the only possible disconnect cause.

Limits remain8 provider Responses,24 function calls,2 searches,8192 output tokens per Response and300 seconds. A large enterprise design may exceed these limits; this change does not claim complete production architecture generation or AWS validation.

No environment changes. Deploy the new backend for explicit deadline events; frontend handles both explicit errors and unexpected stream termination. Existing saved diagrams remain available as history.
