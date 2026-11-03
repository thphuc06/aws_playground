# Independent service-library review

Reviewed on 2026-11-03 in `feat/service-library-preview`, based on `d4d3c17`.
The reviewer was separate from the two content authors and UI implementer.
This review does not authorize merging or publishing the preview.

## Scope and verdict

Read all 58 supplemental service guides and the library, field-note panel,
English-only glossary integration and theme changes. Checked for distinct,
useful scenarios, internally consistent service boundaries, valid alternatives,
cost qualifications and separation from canvas mutation.

**Verdict: no remaining blocking issue identified in the reviewed changes.**
Every new guide contains a decision explanation, illustrative walkthrough,
expected outcome, failure investigation, cost dimensions, operational checks and
dated primary references. This is a bounded editorial review, not a claim that
every sentence or every linked page received an independent full audit.

## Independent source spot checks

The reviewer opened current official pages and compared the following claims:

| Area | Claim checked | Primary evidence |
| --- | --- | --- |
| Cognito | Offline JWT signature/expiration verification does not establish that a token has not been revoked. | [Token revocation](https://docs.aws.amazon.com/cognito/latest/developerguide/token-revocation.html) |
| ACM | Exportable public certificates have issuance/renewal and applicable API charges; renewed exports still need installation on their serving endpoint. | [Exportable certificates](https://docs.aws.amazon.com/acm/latest/userguide/acm-exportable-certificates.html), [pricing](https://aws.amazon.com/certificate-manager/pricing/) |
| Q Developer | The April 30, 2027 support notice applies to IDE plugins, not a blanket retirement of every Q Developer surface. | [Product overview and notice](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/what-is.html) |
| X-Ray | The maintenance notice concerns SDKs/daemon; new instrumentation guidance recommends OpenTelemetry. | [Instrumentation migration](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-migration.html) |
| Beanstalk | Immutable deployments are scoped to Beanstalk Standard. | [Deployment policies](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.deploy-existing-version.html) |
| ECS | Managed Instances have a management fee in addition to underlying EC2 charges. | [ECS pricing](https://aws.amazon.com/ecs/pricing/) |
| ALB | All-unhealthy registered targets can produce fail-open routing; health checks are not an authorization boundary. | [Target health checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html) |
| IAM | Some Access Analyzer capabilities are separately charged. | [Access Analyzer capabilities and pricing](https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html) |
| CloudFormation | Third-party registry extensions and hooks can incur handler-operation charges. | [CloudFormation pricing](https://aws.amazon.com/cloudformation/pricing/) |
| Quick | Quick includes analytics and action capabilities; connected-content and action permissions need distinct review. | [Product identity](https://docs.aws.amazon.com/quick/latest/userguide/what-is.html), [agent security](https://docs.aws.amazon.com/quick/latest/userguide/sec-agentic-security.html) |
| Kiro | Credit use varies with request complexity and length. | [Billing](https://kiro.dev/docs/billing/) |

Existing-brief boundary checks also confirmed that [ElastiCache public
endpoints](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/connecting-public-endpoint.html)
exist and that [DynamoDB MRSC does not make GSI reads strongly
consistent](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html).
These checks helped avoid reintroducing older blanket descriptions.

## Findings and resolution

- **Resolved citation gap:** The Cognito entry cited the JWT verification page
  for a revocation limitation that the page did not discuss. The author added
  the dedicated token-revocation page and renamed the original source. The
  reviewer opened the added page and confirmed its explicit limitation.
- **Resolved English-only presentation:** The service-library glossary uses an
  explicit English-only mode while retaining compatibility with the existing
  standalone bilingual glossary.
- **Visual observations:** Initial library screenshots showed a prominent
  automatically focused heading outline and several small metadata labels.
  The implementer subsequently adjusted initial-library focus and raised small
  labels. The tests retain focus checks when opening/changing a service,
  returning to the list and using the table of contents.

## Automated evidence

The reviewer authored and ran:

```text
npx vitest run src/serviceDeepDives.test.ts src/ServiceLibraryPreview.test.tsx
```

Result: **2 files passed, 7 tests passed**. The final focused rerun also passed
after the Cognito source correction and UI focus changes.

Coverage includes:

- Exactly 58 unique guides matching current and legacy catalog IDs.
- Resolvable, non-self alternatives; complete scenarios and dated primary-source
  contracts. URL shape checks are not factual verification.
- Search/category/scope behavior, 56 C03 and 47 C02 named-service counts, the two
  C03 additional references, empty-state recovery and filter restoration.
- Heading and section focus, service switching, and alternative navigation.
- English-only glossary output in the library and selected guide.
- Reading preserves a saved architecture fixture; only the explicit canvas
  action invokes the add/select callback.

These focused checks used the available local Node runtime. The main agent's
separate Node 22 full-suite/build results belong in the delivery report and are
not claimed as this reviewer's execution evidence.

## Visual and contrast evidence

Inspected these generated screenshots under `artifacts/service-library-preview/`:

- `library-light.jpg`
- `library-dark.jpg`
- `lambda-cost-dark.jpg`
- `lambda-mobile-light.jpg`

No obvious clipping or blocking reading-layout issue was identified in these
images. Screenshots are observations of those captured states, not exhaustive
browser or assistive-technology testing.

Independently calculated WCAG contrast for the new light/dark primary,
secondary and muted text/surface pairs, accent panels, amber panels and primary
button text. All tested text pairs exceeded 4.5:1. The lowest was **4.68:1** for
light muted text `#626c86` on subtle surface `#f0f2f9`.

## Limits

No live AWS operations, paid AI requests or deployments were performed by the
reviewer. Walkthroughs remain illustrative and have not been executed against
AWS. Source checks do not establish production readiness, current account
permissions, complete exam coverage or every Region/variant's behavior.
JSDOM tests do not establish real-browser layout or screen-reader behavior;
the main agent owns the separate browser checks and final build evidence.

The reviewer made no commit, push, merge or publication.
