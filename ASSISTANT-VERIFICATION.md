# DVA-C03 assistant verification — 2026-11-01

## Implemented and checked

- Three Builder tabs with independent original and AI draft state, purpose,
  priority, protected services, source-linked review, graph/config diff, adoption
  and session-only Undo. Existing graph key is retained as a migration backup.
- 58 architectural profiles / 326 fields: 56 C03 entries plus two legacy services.
  Fields represent DVA-level design intent, not complete AWS Console schemas.
  Type, enum, range, graph-reference and tool validation do not certify AWS runtime.
- Eleven new catalog/icon entries. Ten use official artwork; SAM has an explicit
  generic fallback because a matching official SAM asset was not available.
- Sol Responses function loop with isolated draft edits, curated/live AWS sources,
  strict tool schemas, SSE progress, bounded loops and final server/client checks.
- No disk, reviewer token or USD cap. A shared gate covers legacy/new POST routes.
  Technical limits remain 8 Responses,24 function calls,2 searches,8192 output
  tokens/response,300 seconds,one active workflow and3 starts/minute.

## Automated/local evidence

**493 tests pass across27 files**, plus frontend/backend typechecks and builds.
Tests include registry validity for every service, migration/reload, independent
graphs, stale detection, UI tabs/consent, SSE framing/failures, protected nodes,
atomic rejection, source-ID validation/domain filtering, API–EC2 regression,
provider failure without retry, uncertain usage and bounded loops. Icon hash and
active-content checks pass. Builds retain the existing large-chunk warning.

These are unit/fixture/HTTP-stream checks. Browser E2E was not run: the browser
permission gate previously denied localhost and no alternate browser workaround
was used. JSON persistence/adoption checks are not browser localStorage evidence.

## Real OpenAI tests through the application backend

All inputs were synthetic and used the application endpoint, never AWS resources.
Private raw evidence is kept in ignored `backend/data/assistant-live-*.json`.

| Scenario | Observed result |
| --- | --- |
| API Gateway -> two EC2 instances | Passed;4-node proposal retained protected EC2 nodes; validation/JSON roundtrip/restoration passed;7 model responses,1 search;30,168 input and2,200 output tokens; estimated $0.092336 |
| Serverless/queue | First attempt reached step limit without publishing. After reducing redundant reference calls and reserving the final step for validated finish, passed with7 nodes,6 model responses,1 search;41,999 input and3,852 output tokens; estimated $0.132518 |
| C03 Lambda/Bedrock/logging | Initial attempt reached step limit. Follow-up tests encountered provider transport ECONNRESET before obtaining usage; no completed live result verified |

Three workflow attempts ended in transport failures while checking the revised loop.
They were not silently retried inside the app. Unknown billing outcomes are not
assumed free; token totals above cover only the successful runs, not the entire
test bill. Estimates use standard rates and are not invoices. The latest code
reports transport failure codes safely and marks incomplete usage; no raw keys
or upstream error bodies are logged. No production review was triggered.

The C03/AI case is covered by deterministic configuration/tool tests but still
needs a successful live check after network conditions recover. The successful
cases do not guarantee every future AI proposal is correct.

## Deployment handoff

Render URL supplied by owner: https://aws-playground-review.onrender.com.
Before this update, health returned200 and status still showed the old budget
contract. Verify the new capabilities after deployment; health alone is not
proof the assistant/model is available. See DEPLOY-RENDER.md for exact env changes.
Sites source is synchronized separately while preserving its hosting identity
and audience. GitHub push, CI, Sites publication and Render readiness must be
reported separately in the handoff.
