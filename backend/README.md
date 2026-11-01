# Backend API

Build at repository root with npm run build:backend. Run npm run start:backend
on Render or npm run start:backend:local with private .env.local locally.

- GET /health: liveness.
- GET /api/review/status: exact allowed Origin required; returns model/readiness,
  no-auth/no-USD-cap status and architectureAssistant capability1.
- POST /api/architecture-assistant: JSON + X-Architecture-Review:1 + allowed Origin.
  Body: mode(review/design), graph, baseFingerprint, purpose, priority,
  protectedNodeIds and consent:true. Request body capped256KiB. Returns SSE
  progress, tool_error, usage, result or error. No result means no completed draft.
- POST /api/review: retained legacy review compatibility contract.

See ../AI-REVIEW.md for tools, limits and privacy. Server closes/aborts work on
disconnect, cancellation or deadline. A single gate covers both POST endpoints.
Sources and graph are validated; tool errors may be repaired within the bounded
loop, but provider failures are never automatically retried. Unknown model access
does not fall back. The server holds no durable graph or budget database.
