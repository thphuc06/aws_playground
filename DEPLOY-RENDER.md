# Render: DVA-C03 architecture assistant

Latest Terra and extended workflow settings: see [TERRA-WORKFLOW.md](TERRA-WORKFLOW.md). These supersede the earlier workflow defaults below.

Configuration schema2 requires the latest backend commit: status must advertise
`configurationSchema:2` and `workspaceSchema:3`. The updated frontend deliberately
asks for a backend deployment if those capabilities are missing. No environment
change is needed for this upgrade. See CONFIGURATION-VERIFICATION.md.

Repository: https://github.com/thphuc06/aws_playground (`main`). The Blueprint
defines the existing `aws-playground-review` backend and an
`aws-playground-frontend` Static Site alongside the existing GPT Sites frontend.

## Enable the Render frontend

In [Render Blueprints](https://dashboard.render.com/blueprints), sync the
existing Blueprint from `main` once CI passes. If the repository has no linked
Blueprint yet, create one from `render.yaml` in the workspace that owns
`aws-playground-review`. Confirm the plan updates the existing backend rather
than creating another one. The frontend builds with
`npm ci --include=dev && npm run build` and publishes `dist`.

Open the Static Site URL shown by Render. The Blueprint passes the assigned URL
to the backend as `REVIEW_RENDER_FRONTEND_ORIGIN`. Both this origin and the GPT
Sites origin are allowed. The browser uses the existing review backend URL.
Keep the OpenAI key on the backend service only.

For a Static Site created manually, use the same build command and `dist`
publish directory, then set `REVIEW_RENDER_FRONTEND_ORIGIN` on the backend to
the actual HTTPS frontend origin without a trailing slash. For any additional
custom domains, add their exact origins to the comma-separated
`REVIEW_ALLOWED_ORIGINS` list.

Once both deploys are live, open `/?view=learn&exam=DVA-C03&mission=serverless&chapter=dev-application`
on the new domain. In Architecture Builder, the AI connection status should be
available without submitting a review. A read-only check is:

```sh
curl -i -H 'Origin: https://YOUR-FRONTEND.onrender.com' https://aws-playground-review.onrender.com/api/review/status
```

Expect HTTP 200, `enabled: true`, and `Access-Control-Allow-Origin` equal to
the frontend origin. Workspaces saved in the browser are scoped to each domain.
Use Workspace backup & recovery to export from GPT Sites and import on Render
if you want to move a saved diagram.

## Runtime and environment

Use Node 22, Free compute, repository root (Root Directory empty),
build `npm ci --include=dev && npm run build:backend`, start
`npm run start:backend`, and health `/health`. Render supplies PORT.
Shared source in `src/` is required by the backend build.

| Environment | Value/action |
| --- | --- |
| NODE_VERSION | 22 |
| OPENAI_API_KEY | Existing valid key, backend only |
| REVIEW_MODEL | **gpt-6.1-terra** |
| REVIEW_ENABLED | true |
| REVIEW_ALLOWED_ORIGINS | https://aws-developer-playground-phuc.pointykayak.chatgpt.site |
| REVIEW_BUDGET_USD | Remove; ignored by the new version |
| REVIEW_ACCESS_TOKEN | Remove; ignored |
| REVIEW_LEDGER_PATH | Remove; ignored |
| REVIEW_PERSISTENT_DISK_CONFIRMED | Remove; ignored |

No additional search key is needed; official-document search uses OpenAI's
built-in web_search. The Blueprint keeps the OpenAI key `sync:false`; add/keep
it privately in an existing service's Environment settings. Do not create a new
service or reset account billing as part of this update.

The service has no caller authentication and no USD cap by the owner's choice.
Anyone reaching it can consume API usage; CORS is not authentication. One shared
workflow gate covers both new and legacy endpoints: one active request and
three starts/minute. Free compute can sleep and restart; limits are in memory.
No AWS resources are created by assistant tools.

## Deploy and verify

Sync the existing Blueprint after the GitHub CI Required checks job succeeds.
Auto-deploy is After CI Checks Pass; if that deploy is already running, do not
trigger a second deploy. `/health` only establishes process liveness.
With the allowed Site Origin, `/api/review/status` must return enabled:true,
model gpt-6.1-terra, capabilities.architectureAssistant=1 and streaming:true.
Unknown Origin must return403. Status does not require an access token.

The new frontend detects the capability and asks for a Render update when it is
missing. Its new workflow POSTs to `/api/architecture-assistant` and consumes SSE
progress/result/error events. `/api/review` remains for compatibility; it is not
the new design workflow. A successful Git push does not prove Render deployed.

## Rollback

Roll back frontend and backend to compatible commits. Existing saved workspace
data should be retained/exported, never deleted to resolve a compatibility issue.
The legacy graph key remains intact. Older disk-required revisions need their
original storage setup; prefer rollback to a known diskless version.

References: https://render.com/docs/blueprint-spec,
https://render.com/docs/deploys, https://render.com/docs/free.
