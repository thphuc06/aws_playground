# Backend setup

The backend now runs without a persistent disk, at the owner's request.

- [Local setup](LOCAL-SETUP.md): Node 22, private `.env.local`, build/start.
- [Render deployment](DEPLOY-RENDER.md): Free compute, environment fields and Sites connection.
- [Review boundaries](AI-REVIEW.md): model, validation and costs.

There is no ledger initialization command. `REVIEW_LEDGER_PATH` and
`REVIEW_PERSISTENT_DISK_CONFIRMED` are obsolete and ignored. The old accounting
file is preserved outside Git but no longer used.

`REVIEW_BUDGET_USD` is a per-process reservation allowance, not a cumulative
billing cap: it resets on restart, deployment, spin-down or a new instance.
Review endpoints now have no token authentication. Anyone reaching the URL can
request paid reviews; CORS is not authentication. Existing payload/time/output
limits, process-wide rate limit, validation and explicit
Preview -> Apply -> Undo remain in place. Do not use a restart as authorization
for additional paid tests.
