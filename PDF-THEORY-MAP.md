# Supplied preview → existing theory map (before implementation)

Prepared2026-11-01 on branch `codex/theory-pdf-dva-c03`, base `1d89116`.
Input: Tutorials Dojo DVA-C02 study-guide preview by Jon Bonso and Carlo Acebedo.
SHA-256: `92e8cf28db92d7d6e7bfba7ff27a9755e87e223344b7d68ad447fc89de357aa4`.

## Read boundary

All40 actual PDF pages were text-extracted, rendered and visually inspected.
Page1 is the cover. PDF2–6 are the table of contents (printed1–5). PDF7 is
printed6. PDF8–40 correspond to printed11–43; printed7–10 are not supplied.
The table of contents extends to printed211, but those pages are not in this
file. Headings in the table of contents are an index, not evidence of read text.

There are no wholly scanned/unextractable pages; OCR was not necessary. Diagrams
and tables were checked against rendered pages, including policy evaluation,
cross-account examples, PassRole, invocation and event filtering. Some JSON
examples are visibly clipped across PDF25–27; missing characters are not
reconstructed as if they had been read. New examples will be original and
validated against official documentation. No PDF pages/artwork are redistributed.

## Existing coverage and editorial decisions

| Actual PDF | Printed | Material present | Existing destination | Decision before code |
| --- | --- | --- | --- | --- |
|1|cover|C02 title and authors|Theory source inventory|Label as C02 preview, not a C03 guide.|
|2–6|1–5|Book contents only|Existing full theory library|Record index-only chapters as unavailable; do not add fabricated summaries.|
|7|6|Cloud introduction and study caveat|Existing foundations|Already covered; omit career/marketing claims.|
|8–10|11–13|Study advice, release-phase illustration, references|`layered-testing`, `build-pipelines`, new source-reading lesson|Extend evidence-based study method; no exam-frequency predictions or course promotion.|
|11–13|14–16|Service study list, start of scenario table|Existing development/data/release chapters|Mostly duplicate; preserve existing detailed lessons and add targeted failure reasoning.|
|13|16|Lambda packaging, configuration, temporary files, reuse and CPU examples|`release-artifacts`, `dev-lambda`|Extend troubleshooting: warm reuse is conditional, temporary files are not durable storage, memory tuning needs measurement.|
|14|17|API, DynamoDB and SAM scenario table|`dev-application`, `dev-dynamodb`, existing SAM lessons|Correct universal29-second timeout, cache shorthand, delayed TTL and oversimplified throttling diagnosis.|
|15–16|18–19|Release/security/CLI and role scenarios|`security-cognito`, `security-iam-sts`, `progressive-release`, `layered-testing`|Clarify token versus AWS credentials, PassRole versus AssumeRole, command-specific dry-run and duplicate queue delivery.|
|17–18|20–21|IAM identities and trusted-entity illustration|`security-iam-sts#principal`, `#assume`|Already covered; add identity-versus-session comparison without teaching user administration as a core C03 task.|
|19–21|22–24|Managed/inline policy, JSON/condition operators|`security-iam-sts#policies`, `#conditions`|Extend exact/wildcard/case/missing-key examples; correct StringLike and dated policy-type enumeration.|
|22–24|25–27|Identity/resource-policy comparison and simplified evaluation diagram|`security-iam-sts`, `dev-objects`|Correct object-prefix ARN and avoid treating the simplified flowchart as a complete permission engine.|
|25–28|28–31|Cross-account identity/resource access, role trust and delegation|`security-iam-sts#assume`|Extend two-stage reasoning; correct account-root principal explanation and mislabeled role-permission policy.|
|28–30|31–33|PassRole escalation diagram and scoped role example|`security-iam-sts`|Missing detailed treatment: add developer/service/workload permission separation and same-account passing constraint.|
|31–32|34–35|STS operation comparison and decoded failure messages|`security-iam-sts`|Add API-choice comparison, regional endpoints, session token/expiry and safe diagnostics.|
|33–35|36–38|Lambda resources and synchronous request illustration|`dev-lambda`|Extend invocation contract and upstream versus function deadlines; scope numeric limits to documented execution model.|
|35–37|38–40|Async queue/202/retries/DLQ illustration|`dev-lambda#dev-lambda-s3`, `#dev-lambda-s4`|Correct old256KB async payload claim; explain202≠business success and different retry failure classes.|
|38–40|41–43|Poller/batching illustration and filtering example/diagram|`dev-lambda`, `dev-events`|Add batch-envelope sizing and source-specific filtering outcomes; do not copy the simplified sensor handler as a real Kinesis decoder.|

## Important corrections to verify with primary sources

- StringLike is case-sensitive wildcard matching, not case-insensitive equality.
- A `...:root` AWS account principal does not exclude the account root user.
- An S3 object-prefix permission requires the intended object ARN pattern; a
  bare prefix name is not permission for every object below it.
- Identity-policy examples must not be mislabeled bucket policies; role
  assumption and later resource access are separate requests.
- PassRole is not an STS credential operation or a standalone PassRole API.
- STS is not limited to one global endpoint. Session duration varies by API,
  principal and role/session constraints; no universal expiry shortcut.
- Lambda async payload quotas, API integration deadlines and service limits
  require dated checks; old fixed numbers cannot be generalized across products.
- API Gateway REST and HTTP features differ; cache invalidation must use the
  complete supported header/value and authorization behavior.
- Cognito social sign-in and identity-pool AWS-credential exchange are different
  requirements. CLI dry-run exists only on commands that document it.
- SQS visibility is not an exactly-once guarantee. TTL is not immediate deletion.

## Planned content shape and compatibility

Add a source-literacy chapter and focused supplementary sections to existing
lessons, rather than duplicate every topic as another service chapter. New
questions and examples are original, not copied publisher questions/code.
Every added section carries physical PDF and printed-book locators plus official
source IDs. A theory-library reading guide exposes the map and corrections.
All prior chapter/section IDs and progress/bookmark storage remain unchanged.
Only theory-owned files/modules/tests and coverage documents may change.
