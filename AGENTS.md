# Project delivery instructions

## User preference recorded 2026-11-02

After each completed change batch, run the relevant checks, commit and push the
project changes, and deploy the complete frontend and backend update. Do not
leave a completed implementation local-only unless the user explicitly asks.
Plan/observation requests do not authorize implementing all proposed features;
publish any already-authorized completed work and report the plan separately.

## Deployment targets and verification

- GitHub source: `origin`, branch `main`.
- Backend: existing Render `aws-playground-review`; auto-deploy after GitHub
  Required checks. Avoid duplicate manual deployment while auto-deploy is running.
- Frontend: existing Site `appgprj_6ae6d23d455c8191a15136a750889334`.
  Use the Sites source workflow and preserve the audience returned by `get_site`.
- Retain the separate Sites checkout and its `.openai/hosting.json`; never
  overwrite its Git metadata or copy local credentials into the published source.
- Verify the pushed SHA, CI result, backend `buildRevision` and Sites deployment
  terminal status. A Git push or a health response alone does not establish release.
- Final handoff includes the commit, live URL, verification outcome and remaining
  limitations. Report actual blockers rather than claiming an incomplete release.
- Use synthetic fixtures for checks. Do not make paid AI calls or provision AWS
  merely to verify deployment; read-only status and local provider fixtures suffice.

## Configuration work

Consult `CONFIGURATION-AUDIT-2026-11-02.md`, `CONFIG-AUDIT-MATRIX.md` and
`CONFIGURATION-NEXT-PLAN.md`. Distinguish AWS settings, application intent and
legacy exercise inputs. Source-backed metadata is not complete AWS validation.
Preserve saved workspaces and explain model limits separately from AWS errors.
