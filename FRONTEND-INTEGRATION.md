# Frontend integration — 2026-11-01

The default review backend is https://aws-playground-review.onrender.com. A valid saved backend URL remains selected instead of being silently overwritten. This URL is public configuration, not a credential.

Connect performs only a readiness request after explicit trust confirmation. When the server explicitly reports `authentication: "none"`, the frontend permits review without a token and does not send an Authorization header. Protected backends retain the separate reviewer-token flow; a missing/unknown authentication declaration is not interpreted as public access. No OpenAI key belongs in the frontend.

Graph transmission still requires consent and a deliberate Request AI review click. Proposed changes still require preview and Apply; stale guards, local validation and Undo are retained. Public access does not make model calls free or guarantee abuse/spending protection. Server security, model selection and spending policies belong to the backend operator.

## Verified without provider charges

Using the exact private Site origin, the deployed backend returned HTTP200 for GET /api/review/status with a matching Access-Control-Allow-Origin, enabled:true and authentication:none. It advertised architectureAssistant1, streaming support, model gpt-6.1-sol, exam DVA-C03 and budget scope:none. OPTIONS /api/review returned204 and allowed POST plus Content-Type and X-Architecture-Review. These checks do not call a model.

The restored user-maintained repository already includes ArchitectureStudio with streaming review/design through /api/architecture-assistant, alongside the older /api/review JSON contract. This integration preserves that existing Studio and its workflow; it does not introduce or expand the streaming feature. OPTIONS /api/architecture-assistant also returned204 with the exact Site origin and required POST headers. No backend files were modified for this integration.

The user-owned assistant currently permits up to8 model responses,8192 output tokens per response,2 searches and a300-second deadline, without a USD cap. These are not the original v14 backend budget controls. The archive preserves the latest user source rather than reverting it to the older bundled backend.

No paid graph review was performed during integration. Status/preflight success verifies readiness and CORS, not model-output quality or a complete live review. The private production Site still requires its owner's ChatGPT session for browser verification.

## Release verification

500 tests across27 files passed, including explicit-public/legacy-protected/unknown-auth guards and current Studio no-auto-fetch/default-URL tests. Frontend typecheck, production build and sensitive-file check passed. Browser preview confirmed the default Render URL appears in the actual DVA-C03 ArchitectureStudio, Connect becomes enabled after trust without entering a token, and paid Review stays disabled until connection and graph consent. Preview-origin requests are not allowlisted by the backend, so live connection was checked using the actual production Site Origin via HTTP rather than faking a browser origin. Production authenticated browser verification and live generation were not claimed.

The update starts from user source commit7022b406e36d5bbe18f91e5ef3688690d8e43f82 (Site18). Only the two frontend connection components, their tests and this note change. Existing user backend, streaming assistant, C03 canvas, configurations and CI files are preserved. Node24 was available in the cloud despite package recommending Node22; tests/build passed with an engine warning. Existing large frontend chunk warning remains.
