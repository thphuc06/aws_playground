# Local DVA-C03 assistant setup

The configuration upgrade uses workspace version3 and configuration schema2.
Old local keys remain as migration backups; old prose appears under Legacy notes.
See CONFIGURATION-VERIFICATION.md and CONFIG-COVERAGE-MATRIX.md for the editor,
IAM library, limits and test evidence. No additional environment variables.

Use Node 22. From the repository root:

```sh
npm ci
npm test
npm run typecheck
npm run typecheck:backend
npm run build
npm run build:backend
```

Copy `backend/.env.example` to `.env.local` only if the file does not exist.
Enter your OpenAI key privately. Keep `.env.local` ignored and never print it.
Set REVIEW_MODEL=gpt-6.1-sol, REVIEW_ENABLED=true, PORT=8787 and
REVIEW_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173.
There is no access token, disk setup or USD budget variable.

```sh
npm run start:backend:local
```

In another terminal, `npm run dev`. Open the reported local URL. Connect the
backend using http://localhost:8787, enter System purpose and explicitly consent.
Use Review & build proposal for one combined assessment, service explanation
and independent editable canvas. Review assumptions, sources and exact diff before
Use this proposal. Undo is session-only and blocked after a newer original edit.

Both graphs, purpose and reports persist separately under
`aws-playground-workspace-v2`. The legacy graph key remains as a migration backup.
Invalid saved data is not overwritten. Storage failures are shown to the user.

## Optional paid checks

Only with explicit authorization: `npm run smoke:assistant` runs three synthetic
design workflows through the backend. Direct command also accepts
`--scenario=api-ec2`, `--scenario=serverless-queue`, or `--scenario=c03-ai`.
Evidence is saved under ignored `backend/data/`. Do not interpret JSON roundtrip
checks as browser-localStorage E2E. The old `smoke:live` checks only the retained
legacy endpoint and is not the primary assistant test.

No dollar cap exists. Technical limits apply per workflow and process, and
provider errors do not trigger automatic retries. Incomplete usage or transport
failures have an uncertain billing outcome; do not assume they are free.
