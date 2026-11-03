import type {HandbookNote, ServiceHandbook} from './serviceHandbookTypes';

const note = (title: string, detail: string, ...sourceIds: string[]): HandbookNote => ({title, detail, sourceIds});
const setting = (name: string, choice: string, tradeoff: string, ...sourceIds: string[]) => ({name, choice, tradeoff, sourceIds});
const issue = (symptom: string, likelyCause: string, check: string, resolution: string, ...sourceIds: string[]) => ({symptom, likelyCause, check, resolution, sourceIds});
const source = (id: string, title: string, url: string) => ({id, title, url, verified: '2026-11-03'});

export const securityNetworkHandbooks: ServiceHandbook[] = [
  {
    serviceId: 'acm',
    operatingModel: [
      note('Certificate issuance and serving are different steps', 'ACM can manage a certificate, while a supported integrated service presents it to clients. An exportable public certificate extends deployment to other targets, but that target must receive and install renewed material through its deployment workflow.', 'integrations', 'export'),
      note('DNS validation proves domain control', 'ACM supplies CNAME name/value pairs for domain validation. Place them in the authoritative public DNS and retain the required validation records for eligible renewal; a record in an unrelated private zone does not prove public domain ownership.', 'dns'),
      note('Renewal depends on the certificate path', 'Eligible ACM-issued certificates can receive managed renewal. Imported certificates and certificates issued directly through the Private CA IssueCertificate API have different renewal responsibility; do not label every certificate visible in an AWS console as automatically renewed by ACM.', 'renewal'),
    ],
    setup: [
      note('Inventory endpoint names and integration', 'List every hostname clients actually use and identify the serving endpoint. Confirm the supported certificate type and Region for that integration; CloudFront viewer certificates require us-east-1.', 'integrations'),
      note('Publish validation records correctly', 'Add the exact ACM-generated CNAME pairs using the DNS provider\'s naming convention. Check whether the provider appends the zone automatically so the requested name is not duplicated.', 'dns'),
      note('Attach or securely deploy the certificate', 'For an integrated service, select the intended certificate on its TLS configuration. For an exportable workflow, protect the exported private key and install the certificate chain with the server\'s supported procedure.', 'export', 'integrations'),
      note('Test renewal through the serving endpoint', 'Monitor renewal eligibility and status, then verify the certificate actually presented by the client-facing TLS endpoint. For exported certificates, rehearse notification, retrieval, secure installation and reload as one process.', 'renewal', 'export'),
    ],
    configuration: [
      setting('Public, imported or exportable certificate', 'Choose the certificate workflow that matches the endpoint and private-key custody requirement.', 'Imported certificates are not eligible for ACM managed renewal. Exportable issuance adds deployment responsibility; an ACM renewal event alone does not update an independently managed server.', 'renewal', 'export'),
      setting('Domain-validation CNAME records', 'Keep the correct validation records in the authoritative DNS while the certificate is in service.', 'Deleting a validation CNAME after initial issuance can break future renewal. Reusing domain validation does not mean Regional certificate resources are the same object.', 'dns', 'renewal'),
      setting('Region and supported integration', 'Provision the certificate where the actual serving service expects it, including CloudFront\'s viewer-side us-east-1 requirement.', 'A same-name certificate in another Region may be perfectly valid but unavailable to the intended association. Confirm integration support rather than copying an ARN from another environment.', 'integrations'),
    ],
    security: [
      note('Protect exported private keys', 'Limit export permission, secure transport and storage of the key, and keep it out of build logs and source control. The deployment system that can install a key becomes part of the endpoint identity trust boundary.', 'export'),
      note('Check the hostname the user sees', 'Verify the served chain and hostname coverage through the actual public endpoint after deployment. An issued certificate in ACM does not establish that DNS points at the endpoint currently serving that certificate.', 'integrations', 'dns'),
    ],
    example: {
      title: 'A certificate deployment evidence record', language: 'text',
      code: 'Endpoint: app.example.com\nServing service: selected load balancer or distribution\nACM ARN: certificate in the integration-required Region\nValidation: authoritative CNAME resolves correctly\nRenewal: eligible status and responsible deployment owner\nClient check: served hostname, issuer, chain and expiry match expectations',
      explanation: 'This worksheet follows the certificate from DNS validation to a real TLS connection. For exported material, add the renewed certificate installation timestamp and served fingerprint. It records public metadata only and must never contain a private key or export passphrase.',
      checks: ['The real endpoint serves the intended certificate for the requested hostname.', 'A renewal rehearsal updates externally installed material before the previous certificate expires.'], sourceIds: ['dns', 'renewal', 'export', 'integrations'],
    },
    troubleshooting: [
      issue('Validation remains pending', 'The generated CNAME is missing or incorrectly named in authoritative DNS.', 'Query the exact validation name publicly and inspect provider handling of trailing zone names.', 'Correct the DNS record and retain it for the supported renewal path.', 'dns'),
      issue('A certificate cannot be selected for CloudFront', 'The certificate is in the wrong Region or does not meet the integration requirements.', 'Inspect the certificate ARN Region and the selected viewer certificate workflow.', 'Use a supported certificate in us-east-1 and verify its intended domain coverage.', 'integrations'),
      issue('ACM renewed but the external server still expires', 'The exported certificate was not reinstalled on the serving target.', 'Compare ACM renewal metadata with the certificate presented during a fresh TLS connection.', 'Repair renewal notification and secure deployment/reload automation for that endpoint.', 'export', 'renewal'),
    ],
    pitfalls: [
      note('Certificate renewal is not DNS failover', 'Renewing a certificate does not change the application hostname destination or repair a broken listener. Verify naming, serving configuration and TLS separately.', 'integrations', 'dns'),
      note('Do not generalize across issuance APIs', 'An ACM-managed private certificate, a directly issued Private CA certificate and an imported certificate do not share identical renewal semantics. Record how the certificate was issued.', 'renewal'),
    ],
    sources: [
      source('dns', 'ACM DNS validation and reusable CNAMEs', 'https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html'),
      source('renewal', 'ACM managed-renewal eligibility', 'https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html'),
      source('export', 'Exportable public certificate deployment responsibility', 'https://docs.aws.amazon.com/acm/latest/userguide/acm-exportable-certificates.html'),
      source('integrations', 'ACM integrated services and certificate placement', 'https://docs.aws.amazon.com/acm/latest/userguide/acm-services.html'),
    ],
  },
  {
    serviceId: 'private-ca',
    operatingModel: [
      note('A private hierarchy needs distributed trust', 'A root or subordinate CA issues certificates within your organization\'s trust design. Clients must trust the appropriate chain and validate the presented identity. Creating a CA does not install its trust anchor in every browser, device or application.', 'purpose', 'lifecycle'),
      note('Issuance templates constrain certificate purpose', 'Private CA uses templates for CA and end-entity certificates. Select the intended template and control who can request it; ordinary service identities should not be able to issue subordinate CA certificates merely because they can request a certificate.', 'templates'),
      note('Revocation requires a relying-client decision', 'CRLs and OCSP communicate certificate status, but clients must obtain and enforce that status. Short-lived certificates reduce the validity window through frequent replacement instead; they shift operational dependency toward reliable issuance and installation.', 'revocation', 'mode'),
    ],
    setup: [
      note('Define hierarchy and lifetime', 'Choose root/subordinate responsibilities, certificate purpose and the required trust distribution. Plan child validity within the issuing hierarchy\'s validity so an expiring parent does not unexpectedly invalidate otherwise current endpoints.', 'lifecycle'),
      note('Choose the CA mode', 'Select general-purpose or short-lived-certificate mode from the actual client lifecycle. Confirm issuance integration support; ACM cannot issue certificates signed by a short-lived-mode CA.', 'mode'),
      note('Constrain issuance', 'Use template-specific permission conditions where supported and define which identity names can be requested through the enrollment system. Keep administrative CA operations separate from ordinary leaf-certificate issuance.', 'templates'),
      note('Test the complete trust lifecycle', 'Install a synthetic leaf certificate and chain, verify an intended client, then test an expired, wrong-identity or revoked certificate. Confirm network access to the chosen revocation status source and document its propagation behavior.', 'revocation', 'lifecycle'),
    ],
    configuration: [
      setting('CA hierarchy and validity', 'Plan issuing-CA succession before its lifetime constrains renewal of dependent leaf certificates.', 'Replacing a CA rotates its key and can require trust/issuance changes; reissuing its CA certificate preserves key material. ACM cannot automatically renew an existing private certificate through a replacement CA, so plan new issuance and deployment when changing the issuer.', 'lifecycle'),
      setting('TemplateArn', 'Select the intended end-entity template and restrict allowed templates through policy conditions.', 'Template choice controls certificate capabilities. A permissive issuance interface can produce identities or CA capabilities beyond the intended application contract.', 'templates'),
      setting('CRL, OCSP or short-lived design', 'Choose the status-checking mechanism supported by your clients, or a sufficiently short issuance/install cycle.', 'Revocation status has propagation and caching delay. Short-lived certificates still require timely replacement and do not remove the need to protect the private key while valid.', 'revocation', 'mode'),
    ],
    security: [
      note('Control who can request which identity', 'Restrict CA issuance and template use, then validate requested names in the enrollment workflow. A correctly signed certificate for an unauthorized internal hostname can still undermine the trust system.', 'templates'),
      note('Exercise compromised-key recovery', 'Prepare issuance of a replacement, installation on the endpoint and rejection of the old identity by real clients. Do not close the incident merely because the revocation API accepted the request.', 'revocation'),
    ],
    example: {
      title: 'A private service-identity rollout contract', language: 'text',
      code: 'Issuer: organization issuing CA\nIdentity: orders.internal.example.com\nCertificate purpose: approved end-entity server template\nTrust distribution: client trust store contains the intended CA chain\nReplacement: issue -> install -> verify served identity\nRevocation test: relying client rejects the old certificate after status propagation',
      explanation: 'This is a design contract, not a certificate request or a public-trust guarantee. It keeps issuance, endpoint installation and relying-client enforcement visible as separate tasks. Adapt the template and name checks to the actual TLS client and enrollment service.',
      checks: ['An intended client accepts the correct identity and rejects an unrelated one.', 'The renewal/revocation drill measures the real client behavior, including cached status and offline clients.'], sourceIds: ['templates', 'lifecycle', 'revocation'],
    },
    troubleshooting: [
      issue('A freshly issued certificate is untrusted', 'The client lacks the intended root/intermediate chain or rejects the identity/purpose.', 'Inspect the presented chain, client trust store and expected hostname or certificate purpose.', 'Distribute the approved trust chain and issue an identity/purpose compatible with the client.', 'lifecycle', 'templates'),
      issue('Issuance fails near a CA expiration date', 'The requested certificate validity exceeds the issuing CA\'s remaining lifetime.', 'Compare requested NotAfter with the relevant parent hierarchy.', 'Apply the planned CA succession/renewal procedure rather than repeatedly requesting the same invalid validity.', 'lifecycle'),
      issue('A revoked certificate still connects', 'The client does not enforce the configured status mechanism or sees cached status.', 'Test CRL/OCSP reachability, client checking behavior and status propagation time.', 'Repair the relying-client configuration and verify rejection after the documented propagation interval.', 'revocation'),
    ],
    pitfalls: [
      note('Private CA is not public browser trust', 'An organization-controlled hierarchy requires an explicit trust relationship with its clients. A public website normally needs a publicly trusted certificate rather than distributing a new private root to visitors.', 'purpose'),
      note('Short-lived mode is not automatic deployment', 'Frequent expiration only helps if issuance and installation keep working. Monitor replacement completion and confirm the chosen integration supports the CA mode.', 'mode'),
    ],
    sources: [
      source('lifecycle', 'Private CA validity and hierarchy succession', 'https://docs.aws.amazon.com/privateca/latest/userguide/ca-lifecycle.html'),
      source('purpose', 'Private and public certificate service trust boundaries', 'https://docs.aws.amazon.com/privateca/latest/userguide/service-options.html'),
      source('templates', 'Private CA issuance templates and restrictions', 'https://docs.aws.amazon.com/privateca/latest/userguide/UsingTemplates.html'),
      source('revocation', 'CRL, OCSP and revocation propagation', 'https://docs.aws.amazon.com/privateca/latest/userguide/revocation-setup.html'),
      source('mode', 'General-purpose and short-lived CA modes', 'https://docs.aws.amazon.com/privateca/latest/userguide/short-lived-certificates.html'),
    ],
  },
  {
    serviceId: 'glacier',
    operatingModel: [
      note('Glacier is not one access contract', 'S3 Glacier Instant Retrieval supports online object reads; Flexible Retrieval and Deep Archive require restoration before access. Identify the exact storage class from object metadata rather than assuming every archive named Glacier has the same retrieval behavior.', 'classes', 'restore'),
      note('A restored copy has a lifecycle', 'For Flexible Retrieval and Deep Archive, restoration makes a temporary readable copy available for the requested period while the underlying archive remains. An Intelligent-Tiering archive restore instead moves the object back to its Frequent Access tier.', 'restore'),
      note('Legacy vaults are a separate service', 'The original standalone Glacier vault service uses different APIs from S3 object storage and is closed to new customers. Existing vault data remains supported; a new archival design should evaluate the S3 Glacier storage classes rather than copying a vault tutorial.', 'legacy'),
    ],
    setup: [
      note('Start from the recovery requirement', 'Measure how quickly users need the archive, how often it is read and how long it must remain accessible. Select an online or restore-required class based on those requirements before optimizing storage price.', 'classes'),
      note('Design selective lifecycle transitions', 'Scope lifecycle rules by the intended objects and review size, minimum-duration and replication-state constraints. Small-object transition request costs can defeat expected savings; historical lifecycle configurations can have different default size behavior.', 'lifecycle'),
      note('Build an asynchronous restore flow', 'For a restore-required class, submit the supported request and expose a pending state to users. Track completion using object restore metadata or the configured event path before presenting a download link.', 'api'),
      note('Rehearse a real recovery plan', 'Use authorized test data to measure request, waiting and download phases. Record version identity, restore expiry and whether a permanent copy in another class is required; this guide itself creates no AWS objects.', 'restore', 'api'),
    ],
    configuration: [
      setting('Storage class', 'Choose Instant Retrieval, Flexible Retrieval or Deep Archive from the application\'s access latency and retention needs.', 'A lower storage rate can add retrieval work, waiting time and minimum-duration economics. Compare the complete access pattern instead of storage cost alone.', 'classes', 'lifecycle'),
      setting('Restore tier and Days', 'Select a tier supported by the current class and a temporary-access duration appropriate to the recovery task.', 'Expedited retrieval is not available for Deep Archive. The Days parameter for a temporary restored copy is not the retention period of the original archived object.', 'api'),
      setting('Lifecycle filters and minimum sizes', 'Use deliberate object filters and review the effective transition behavior before editing existing rules.', 'Changing a legacy configuration can change default handling of small objects. Transitioning too early or moving many tiny objects can introduce charges without the expected benefit.', 'lifecycle'),
    ],
    security: [
      note('Separate restoration from broad data administration', 'Grant the intended restore capability only for the approved archive scope and retain normal object-read authorization. A restore should not require permission to delete unrelated archives or change the whole bucket lifecycle.', 'api'),
      note('Verify recovered identity and access', 'Keep the exact bucket, key and object version in the recovery request. Test the intended reader\'s download path after restoration and protect any new permanent copy with the required destination controls.', 'api', 'restore'),
    ],
    example: {
      title: 'A temporary S3 archival restore request', language: 'json',
      code: '{\n  "Days": 3,\n  "GlacierJobParameters": {\n    "Tier": "Standard"\n  }\n}',
      explanation: 'This is the RestoreRequest object used by an SDK or the CLI restore-request input for a suitable S3 Glacier archived object, not the complete REST XML request. Bucket, key and optional version are supplied separately. Three days is an illustrative access window, not a recommended retention policy.',
      checks: ['The application waits for restore completion before offering the archived object.', 'After the temporary-copy window ends, the original archive remains according to its separate lifecycle policy.'], sourceIds: ['restore', 'api'],
    },
    troubleshooting: [
      issue('GetObject fails on an archived file', 'The object is in a restore-required class and no completed readable copy is available.', 'Inspect the storage class and restore status for the exact object version.', 'Initiate an authorized restore and wait for completion; do not retry immediate reads indefinitely.', 'api'),
      issue('An archive is still in the original class after restoration', 'Temporary restoration was mistaken for permanent class conversion.', 'Check object storage class separately from restored-copy availability.', 'If permanent online access is needed, perform the approved copy into the intended class after restoration.', 'restore'),
      issue('Lifecycle savings are lower than expected', 'Small-object transitions, minimum durations or retrieval patterns dominate the workload.', 'Inspect object size distribution, transition eligibility and the real access frequency.', 'Adjust selective lifecycle rules and class choice from measured recovery and billing dimensions.', 'lifecycle', 'classes'),
    ],
    pitfalls: [
      note('Do not mix S3 objects with vault archives', 'S3 bucket/key workflows and legacy vault/archive IDs have different APIs. Keep examples and recovery automation aligned with the storage interface actually holding the data.', 'legacy'),
      note('Restore completion is not a guaranteed recovery-time objective', 'Documented retrieval expectations are not an end-to-end application deadline. Include request preparation, permissions, download volume and downstream restoration in the recovery exercise.', 'api'),
    ],
    sources: [
      source('classes', 'S3 storage classes and access characteristics', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html'),
      source('restore', 'Archived-object restoration and temporary copies', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects.html'),
      source('lifecycle', 'Lifecycle transition eligibility and cost constraints', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html'),
      source('api', 'RestoreObject tiers, status and object versions', 'https://docs.aws.amazon.com/AmazonS3/latest/API/API_RestoreObject.html'),
      source('legacy', 'Standalone Glacier vault service scope', 'https://docs.aws.amazon.com/amazonglacier/latest/dev/introduction.html'),
    ],
  },
  {
    serviceId: 'cloudtrail',
    operatingModel: [
      note('Event history has a bounded purpose', 'The built-in history shows recent management activity for one account and Region. It is independent of trails and event data stores, and does not provide the full object-level data-event history an application audit may require.', 'history'),
      note('Data-plane coverage must be selected', 'Data events include resource operations such as S3 object access and Lambda invocation. Trails and event data stores do not log data events by default; select the relevant resource types and operations intentionally because activity volume can be high.', 'data'),
      note('Delivered logs are auditable evidence', 'A trail delivers records to S3; the delivery filename time is not necessarily every contained event\'s occurrence time. Integrity validation uses signed digest information to detect post-delivery modification or deletion, but does not prove you selected every required event.', 'records', 'integrity'),
    ],
    setup: [
      note('Write the audit questions', 'Specify which operator, account, Region, API action and data resource must be investigated later. Separate management changes from application data access before selecting a collection path.', 'history', 'data'),
      note('Configure durable coverage', 'Choose the appropriate trail or event-data-store coverage for retention and organizational needs. Confirm the effective selectors rather than assuming the console Event history view is a durable organization-wide archive.', 'history'),
      note('Narrow data selectors deliberately', 'Use advanced event selectors for the exact resource types, resource ARNs and relevant event names where supported. Keep an explicit list of events excluded to reduce volume so investigators know the resulting blind spots.', 'selectors', 'data'),
      note('Prove delivery and investigate a fixture', 'Perform an independently authorized harmless test action, locate its record and correlate event time, actor and resource. For S3 trail archives, retain digest files and practice validation against the delivered location.', 'records', 'integrity'),
    ],
    configuration: [
      setting('Management versus data events', 'Enable the categories needed by the audit use case rather than searching Event history for all operations.', 'Object access can be absent even when resource creation is present. Additional data-event coverage introduces volume and cost that should be measured.', 'history', 'data'),
      setting('Advanced event selectors', 'Use supported FieldSelectors such as eventCategory and resources.type, then narrow by resource or event where appropriate.', 'A trail cannot use basic and advanced event selectors simultaneously. Switching modes requires reviewing the complete resulting coverage, not appending one isolated rule.', 'selectors'),
      setting('Log-file integrity validation', 'Enable and preserve the digest chain for trail files when tamper-evidence is required.', 'Enabling validation creates supporting digest evidence; it does not by itself run a verification process or prevent an authorized actor from deleting stored files.', 'integrity'),
    ],
    security: [
      note('Protect collection and storage separately', 'Restrict who can modify trail/selectors and who can read or delete the archive and digest objects. An intact archive is still incomplete if collection was disabled or important operations were filtered out.', 'data', 'integrity'),
      note('Interpret actor and result together', 'Review the identity/session context, event action, resource and any recorded error. An attempted API call is not necessarily a successful business operation, and delivery order should not be used as causal ordering.', 'records'),
    ],
    example: {
      title: 'An advanced selector for one bucket\'s object events', language: 'json',
      code: '{\n  "Name": "Invoice object activity",\n  "FieldSelectors": [\n    {"Field": "eventCategory", "Equals": ["Data"]},\n    {"Field": "resources.type", "Equals": ["AWS::S3::Object"]},\n    {"Field": "resources.ARN", "StartsWith": ["arn:aws:s3:::example-invoice-audit/"]}\n  ]\n}',
      explanation: 'This is one AdvancedEventSelector using a synthetic bucket, not a complete trail configuration. Review it together with all other required selectors before applying changes; replacing an existing selector set can unintentionally remove management or other data-event coverage.',
      checks: ['A selected object operation appears with the expected event category and resource.', 'Coverage outside this bucket is explicitly configured elsewhere or documented as excluded.'], sourceIds: ['selectors', 'data'],
    },
    troubleshooting: [
      issue('An S3 object read is missing from Event history', 'The investigation expects a data event in the management-only history view.', 'Check the event category and whether a trail/data store selected that bucket at the time.', 'Query the configured data-event destination; enable prospective coverage if it was absent.', 'history', 'data'),
      issue('A new selector causes older audit coverage to disappear', 'The change replaced the effective selector set or switched selector modes.', 'Compare the complete before/after selector configuration and required resource categories.', 'Restore the intended coverage and document the collection gap without claiming missing events were backfilled.', 'selectors'),
      issue('A delivered file fails integrity validation', 'The file or digest chain was changed, removed or validated from the wrong location/context.', 'Check the delivered object and corresponding signed digest chain for the interval.', 'Preserve evidence and follow the incident process; do not regenerate altered logs and call them original evidence.', 'integrity'),
    ],
    pitfalls: [
      note('No matching record is not proof nothing happened', 'The wrong Region, time range, event category or selector can produce an empty result. Record the collection scope and query boundaries with an investigation conclusion.', 'history', 'data'),
      note('An API audit is not an application trace', 'CloudTrail records supported AWS activity; it does not automatically explain each application function call or complete transaction. Correlate with application logs and durable business state.', 'records'),
    ],
    sources: [
      source('history', 'CloudTrail Event history scope and limitations', 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html'),
      source('data', 'Opt-in data-event coverage', 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html'),
      source('selectors', 'Advanced event selector fields and modes', 'https://docs.aws.amazon.com/awscloudtrail/latest/APIReference/API_AdvancedEventSelector.html'),
      source('integrity', 'CloudTrail signed digest integrity validation', 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html'),
      source('records', 'CloudTrail record and delivery examples', 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-examples.html'),
    ],
  },
  {
    serviceId: 'cloudwatch',
    operatingModel: [
      note('Metric identity includes its dimensions', 'A namespace, metric name and dimension combination identify a time series. Publishing the same name with different dimensions creates different series, so an alarm or dashboard must select the exact intended combination rather than merely matching the label.', 'metrics'),
      note('An alarm evaluates a defined signal', 'A metric alarm evaluates a metric or math result against its threshold and time-window settings. Composite alarms combine other alarm states. The alarm state and successful delivery of its configured notification/action are separate operational outcomes.', 'alarms'),
      note('Logs can produce metrics asynchronously', 'Embedded metric format lets CloudWatch extract metrics from structured log events. This links diagnostic context with numeric monitoring, but unique high-cardinality dimensions can generate many separate custom metrics and increase usage.', 'emf'),
    ],
    setup: [
      note('Define a user-impact signal', 'Write what should be measured, its unit and useful aggregation: failed requests, processing latency or oldest work age. Choose dimensions that answer operational questions without creating a separate metric for every request.', 'metrics', 'emf'),
      note('Verify the emitted series', 'Publish through the application\'s supported telemetry path and locate the exact namespace, dimensions, timestamp and unit. Confirm representative healthy and failing cases before adding an alarm.', 'metrics'),
      note('Specify sparse-data behavior', 'Choose how the alarm treats missing points from the actual emission contract. A heartbeat that stops and an error counter emitted only on failures require different interpretation.', 'missing'),
      note('Test both evaluation and notification', 'Exercise a harmless test signal or an authorized alarm-state test and confirm the intended recipient/action. Check alarm history and the downstream notification configuration; creating an alarm does not validate its action destination.', 'alarms'),
    ],
    configuration: [
      setting('Statistic and period', 'Choose Sum for appropriate event counts, a useful percentile for latency, and a period matching publication resolution and response needs.', 'Averages can conceal a long tail; short periods can amplify sparse samples. Compare the chosen statistic against representative raw observations before treating it as user impact.', 'metrics'),
      setting('TreatMissingData', 'Choose missing, ignore, breaching or notBreaching from the metric\'s expected reporting behavior.', 'Filling a telemetry outage with healthy assumptions can hide failure. Missing-data evaluation also considers available real points, so test gaps instead of predicting behavior from the label alone.', 'missing'),
      setting('Metric math', 'Align numerator, denominator, dimensions and periods before deriving a rate such as errors divided by requests.', 'A percentage calculated from incompatible series is misleading. Handle no-traffic intervals intentionally and avoid treating division-by-zero gaps as successful service.', 'math'),
    ],
    security: [
      note('Use low-sensitivity metric dimensions', 'Keep request IDs and personal identifiers in controlled logs when needed for investigation, rather than as metric dimensions. Cardinality can reveal identifiers and create an unbounded family of billable custom series.', 'emf'),
      note('Review automated actions as changes', 'An alarm that stops compute or triggers another automation has permissions and availability consequences. Test the destination and recovery path, and restrict who can silently disable actions or change thresholds.', 'alarms'),
    ],
    example: {
      title: 'A bounded embedded metric event', language: 'json',
      code: '{\n  "_aws": {\n    "Timestamp": 1793718000000,\n    "CloudWatchMetrics": [{\n      "Namespace": "Example/Invoices",\n      "Dimensions": [["Service", "Environment"]],\n      "Metrics": [{"Name": "ProcessingLatency", "Unit": "Milliseconds"}]\n    }]\n  },\n  "Service": "invoice-worker",\n  "Environment": "test",\n  "ProcessingLatency": 142,\n  "requestId": "synthetic-request-17"\n}',
      explanation: 'This illustrative EMF log event uses a fixed example timestamp; real emission must supply the event\'s current valid timestamp. requestId remains log context and is deliberately absent from Dimensions. Send valid JSON through the approved log pipeline rather than printing an extra prefix around it.',
      checks: ['The latency metric appears under the intended Service/Environment dimension set.', 'Different request IDs remain searchable log context without creating a separate metric series per request.'], sourceIds: ['spec', 'emf'],
    },
    troubleshooting: [
      issue('The dashboard shows a metric but the alarm has no data', 'The alarm selects different dimensions, period or unit from the published series.', 'Compare the full metric identity and timestamps, not just the display name.', 'Align the alarm with the intended series and test a new representative datapoint.', 'metrics'),
      issue('An alarm is green during a telemetry outage', 'Its missing-data policy treats gaps as non-breaching or retains an earlier state.', 'Inspect missing points and the signal\'s expected publication schedule.', 'Choose an appropriate gap policy or add separate telemetry-health monitoring.', 'missing'),
      issue('ALARM appears but nobody is notified', 'Actions are disabled or the configured destination is invalid/unusable.', 'Inspect action settings, alarm history and the downstream notification subscription/permissions.', 'Repair and test delivery independently of the threshold evaluation.', 'alarms'),
    ],
    pitfalls: [
      note('Do not alarm on an unvalidated ratio', 'Check that error and request series describe the same population and interval. A mathematically valid expression can still tell the wrong operational story.', 'math'),
      note('Detailed logs and stable metrics serve different purposes', 'Keep high-cardinality context in searchable events and a bounded dimension set for long-lived alarms. EMF does not make every log field a sensible metric dimension.', 'emf'),
    ],
    sources: [
      source('metrics', 'CloudWatch metric identity and statistics', 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html'),
      source('alarms', 'Alarm state, actions and destination verification', 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Alarms.html'),
      source('missing', 'Alarm missing-data evaluation', 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarms-and-missing-data.html'),
      source('emf', 'Embedded metrics and cardinality costs', 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html'),
      source('spec', 'Embedded metric format JSON specification', 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html'),
      source('math', 'Metric math and derived time series', 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html'),
    ],
  },
  {
    serviceId: 'cloudwatch-logs',
    operatingModel: [
      note('A group is a retention and access boundary', 'Log streams represent sources, while a log group shares retention, monitoring and access settings. Group related events according to operational ownership and handling requirements instead of placing unrelated sensitive workloads into one convenient global group.', 'groups'),
      note('A query has a selected evidence scope', 'Logs Insights evaluates the chosen groups and time interval. Structured events make filtering and aggregation useful, but an empty result can mean the wrong scope, missing delivery or absent fields rather than absence of the incident.', 'query'),
      note('Subscriptions are downstream delivery', 'A subscription filters incoming events for a destination such as Kinesis, Firehose or Lambda. Delivery uses a compressed/encoded envelope and has documented retry behavior; a stored source event does not prove its downstream processor accepted it.', 'subscriptions'),
    ],
    setup: [
      note('Define a safe event schema', 'Choose timestamp, severity, operation and a non-secret correlation identifier. Log the outcome of important boundaries without storing authorization headers, passwords or full personal payloads as routine diagnostic context.', 'masking', 'query'),
      note('Create the right group and class', 'Select a class that supports the required querying and real-time features, then set explicit retention and access ownership. Verify feature support before choosing Infrequent Access solely from ingestion price.', 'classes', 'groups'),
      note('Verify ingestion and a narrow query', 'Generate a synthetic event through the actual log path, locate its stream and query a short interval. Confirm structured fields are discoverable and clocks put events in the expected incident window.', 'groups', 'query'),
      note('Test any subscription destination', 'Configure the supported destination permission and capacity, then verify a matching event arrives and is decoded correctly. Monitor delivery errors and avoid routing a processor\'s own logs back into itself.', 'subscriptions'),
    ],
    configuration: [
      setting('Retention policy', 'Choose the log-group retention period from incident investigation and data-handling needs.', 'Never-expiring logs accumulate storage and exposure; short retention can remove evidence before an investigation begins. Retention is a separate decision from the time range of a query.', 'groups'),
      setting('Log class', 'Use Standard when required features such as subscription filters or Live Tail are needed; verify the current capability matrix.', 'Infrequent Access supports a subset of features and the group class cannot be changed after creation. Plan a new destination/migration if requirements later change.', 'classes'),
      setting('Query groups and interval', 'Select only relevant log groups and the shortest useful investigation interval.', 'Repeated broad scans and frequently refreshed query dashboards increase usage. A small output limit does not substitute for appropriately narrowing the scanned evidence.', 'query'),
    ],
    security: [
      note('Masking is an additional control', 'Data-protection masking supports Standard and Infrequent Access log groups. Viewing unmasked data requires logs:Unmask and a supported retrieval path; Logs Insights QL does not support its unmask command for Infrequent Access. Prevent sensitive logging at the application because detection cannot guarantee recognition of every custom secret.', 'masking', 'classes', 'query'),
      note('Account for older events and readers', 'A newly applied data-protection policy does not retroactively mask events ingested before it. Review existing logs and reader permissions separately when responding to accidental sensitive logging.', 'masking'),
    ],
    example: {
      title: 'Find a synthetic failed request with Logs Insights QL', language: 'text',
      code: 'fields @timestamp, operation, requestId, status, @message\n| filter requestId = "synthetic-request-17"\n| sort @timestamp asc\n| limit 100',
      explanation: 'Run this query only against the intended application groups and incident interval. It assumes the emitted structured JSON contains the named fields. The ordered events explain observations; compare a logged completion with the durable business record before replaying a side effect.',
      checks: ['The synthetic request produces the expected operation sequence without exposing credentials.', 'A deliberately missing completion is recorded as uncertainty and investigated, not automatically treated as success.'], sourceIds: ['query'],
    },
    troubleshooting: [
      issue('A query returns no events for a known request', 'The group, Region, interval or structured field differs from the investigation assumptions.', 'Inspect the raw synthetic event and ingestion path, then compare query scope and field names.', 'Correct the collection/query mismatch before concluding that the request never ran.', 'query', 'groups'),
      issue('Logs are stored but the consumer receives nothing', 'The subscription filter, destination permission or capacity blocks delivery.', 'Inspect matching rules, delivery errors and the destination\'s supported payload decoding.', 'Repair destination access/capacity and use the documented retry/recovery behavior without assuming indefinite redelivery.', 'subscriptions'),
      issue('Sensitive values remain visible after masking is enabled', 'The records predate the policy, the value is not matched, or the reader can unmask.', 'Compare ingestion time, selected data identifiers and logs:Unmask permissions.', 'Stop source leakage, correct the policy/permissions and handle historical data through the approved retention/incident procedure.', 'masking'),
    ],
    pitfalls: [
      note('A log message is not transactional truth', 'A message emitted before a database commit can survive even if the operation fails later. Use durable state to confirm the outcome before retrying financial or other non-idempotent work.', 'groups'),
      note('Log-class savings are not universal savings', 'Ingestion features and costs differ by class, while query/storage dimensions must still be considered. Compare the actual investigation and streaming requirements before moving a workload.', 'classes'),
    ],
    sources: [
      source('query', 'Logs Insights QL and bounded query scope', 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html'),
      source('groups', 'Log groups, streams and retention', 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html'),
      source('masking', 'Sensitive-log masking and historical-event limits', 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html'),
      source('subscriptions', 'Subscription delivery format and failure behavior', 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Subscriptions.html'),
      source('classes', 'Log-class feature matrix and immutability', 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch_Logs_Log_Classes.html'),
    ],
  },
  {
    serviceId: 'eks',
    operatingModel: [
      note('Cluster administration and pod access differ', 'An EKS access entry associates an IAM principal with permissions to use the Kubernetes API. Pod Identity associates a workload service account with an IAM role for AWS API calls. Giving a developer kubectl access does not grant that developer\'s pods AWS permissions.', 'access', 'pods'),
      note('Endpoint reachability precedes Kubernetes authorization', 'The cluster API endpoint can expose public and/or private access. A private-only endpoint requires a reachable network path from the administration environment. IAM credentials cannot repair a DNS or TCP timeout before the API server is reached.', 'endpoint'),
      note('Managed control plane does not remove compatibility work', 'A Kubernetes version change affects clients, APIs, add-ons and workloads. Node lifecycle behavior differs for Auto Mode and other compute choices. Review the current supported update and recovery process rather than assuming all components upgrade together.', 'upgrades'),
    ],
    setup: [
      note('Define the cluster access plan', 'Name the administrator, deployment automation and read-only operator roles. Use supported access entries and scoped policies or Kubernetes groups, and document migration of existing aws-auth mappings where relevant.', 'access'),
      note('Choose an endpoint path', 'Set public/private endpoint access according to the operators and nodes that must connect. For private resolution, verify the VPC DNS attributes and AmazonProvidedDNS prerequisites from the intended administration host.', 'endpoint'),
      note('Associate workload identity', 'Choose a supported Pod Identity setup, including its agent/compute prerequisites and SDK support. Associate the role with the exact cluster, namespace and service-account name, then run the workload under that account.', 'pods'),
      note('Prepare upgrade evidence', 'Inventory Kubernetes APIs, add-ons, node versions and available subnet addresses before changing the control plane. Test application behavior on the target version and record the documented recovery options for that version and compute mode.', 'upgrades', 'rollback'),
    ],
    configuration: [
      setting('Cluster authentication mode', 'Enable the supported access-entry mode deliberately when creating or migrating the cluster.', 'Existing custom aws-auth entries are not all automatically migrated. Review each operator and automation role before removing a legacy access path.', 'access'),
      setting('Public endpoint access and CIDRs', 'Limit public API access to the required clients or use a private-only administration path.', 'Restricting the endpoint without a working private route can lock operators out at the network layer. Keep a tested operational access path.', 'endpoint'),
      setting('Service-account identity association', 'Bind one workload role to its namespace/service account with the required AWS permissions.', 'An association is not a container security boundary. Unrestricted node metadata and privileged/host-network workloads need separate isolation review.', 'pods'),
    ],
    security: [
      note('Separate Kubernetes and AWS permission reviews', 'Grant deployment automation only the Kubernetes capabilities it needs, while restricting the pod\'s IAM role to its actual data operations. Review who can change the workload service account or deploy code under that identity.', 'access', 'pods'),
      note('Prevent unintended credential fallback', 'Inspect the workload credential chain and metadata exposure. A correct Pod Identity association does not make static credentials in environment variables safe or guarantee that node-level credentials are inaccessible.', 'pods'),
    ],
    example: {
      title: 'Declare the service account used by an identity association', language: 'yaml',
      code: 'apiVersion: v1\nkind: ServiceAccount\nmetadata:\n  name: invoice-reader\n  namespace: finance\n---\n# Fragment under a Deployment pod template:\n# spec:\n#   serviceAccountName: invoice-reader',
      explanation: 'This manifest creates a Kubernetes service account only if separately applied in an existing finance namespace. It does not create the IAM role or EKS Pod Identity association. Configure those through the supported EKS/IAM workflow, then ensure the pod template names this account.',
      checks: ['The pod uses finance/invoice-reader and obtains the intended workload role.', 'An unrelated service account cannot read the protected AWS data through that association.'], sourceIds: ['pods', 'pod-config'],
    },
    troubleshooting: [
      issue('kubectl times out before authentication', 'The operator cannot reach the configured public/private cluster endpoint.', 'Resolve the endpoint from the actual host and inspect permitted CIDRs or private network connectivity.', 'Restore the intended endpoint path before modifying Kubernetes RBAC.', 'endpoint'),
      issue('kubectl reaches the cluster but is forbidden', 'The IAM principal lacks the intended access entry/policy or Kubernetes group permission.', 'Confirm the current AWS identity and compare it with cluster access entries and scope.', 'Grant the narrow operator capability and verify namespace-level negative tests.', 'access'),
      issue('A pod uses the wrong AWS identity', 'Service-account association, SDK support or credential-chain precedence differs from the design.', 'Inspect namespace/account names, association and available credential providers without logging secrets.', 'Correct the workload identity setup and restrict unintended node/static credentials.', 'pods'),
    ],
    pitfalls: [
      note('A cluster endpoint is not an EKS PrivateLink API endpoint', 'The Kubernetes API private endpoint is managed by EKS and is distinct from an interface endpoint used to call the AWS EKS management API.', 'endpoint'),
      note('Rollback has a limited window and scope', 'An eligible in-place upgrade can be rolled back to the previous minor version within seven days, subject to the documented version, status and feature checks. This does not undo workload data or add-on changes. Auto Mode manages its node rollback; other compute needs the documented preparation, including replacing incompatible Fargate pods. Verify current prerequisites before relying on rollback as the recovery plan.', 'rollback', 'upgrades'),
    ],
    sources: [
      source('access', 'EKS access entries and Kubernetes permissions', 'https://docs.aws.amazon.com/eks/latest/userguide/access-entries.html'),
      source('pods', 'EKS Pod Identity operation and limitations', 'https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html'),
      source('pod-config', 'Pod service-account configuration and identity checks', 'https://docs.aws.amazon.com/eks/latest/userguide/pod-id-configure-pods.html'),
      source('endpoint', 'EKS cluster API endpoint access', 'https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html'),
      source('upgrades', 'EKS version update planning and components', 'https://docs.aws.amazon.com/eks/latest/userguide/update-cluster.html'),
      source('rollback', 'EKS version rollback eligibility and compute preparation', 'https://docs.aws.amazon.com/eks/latest/userguide/rollback-cluster.html'),
    ],
  },
  {
    serviceId: 'secrets-manager',
    operatingModel: [
      note('A secret has versions and staging labels', 'GetSecretValue returns a selected version; without a version selector it returns AWSCURRENT. A rotation can involve pending and previous versions, so an incident must identify the requested version instead of treating the secret name as one immutable password.', 'get'),
      note('Rotation changes two systems', 'A credential rotation must update the secret and the database or external service that accepts it. The mechanism depends on secret type: managed rotation and Lambda-based rotation have different ownership and troubleshooting paths.', 'rotation'),
      note('Cross-account access has three policy surfaces', 'A cross-account reader needs an identity policy, an appropriate secret resource policy and access to the customer-managed KMS key. The AWS-managed aws/secretsmanager key cannot supply this cross-account sharing path.', 'cross'),
    ],
    setup: [
      note('Name the actual consumer', 'Identify the runtime role, secret ARN, Region and credential schema expected by the application. Keep ordinary non-secret settings separate so a deployment can reference the secret without embedding its value.', 'get', 'retrieval'),
      note('Authorize retrieval narrowly', 'Grant GetSecretValue for the intended secret and required customer-managed-key decryption. For cross-account use, review the resource policy and key policy as a single capability rather than testing only the reader role.', 'get', 'cross'),
      note('Design cache freshness', 'Use a supported client-side cache where appropriate to reduce retrieval latency and calls. Document refresh behavior and how a rejected stale credential triggers a bounded refresh rather than an endless authentication retry loop.', 'get'),
      note('Rehearse rotation recovery', 'For Lambda rotation, inspect create/set/test/finish stages and both Secrets Manager and database network access. Verify the current credential works before promoting or rolling back version labels through the approved recovery procedure.', 'troubleshoot'),
    ],
    configuration: [
      setting('VersionStage or VersionId', 'Use the current version for ordinary retrieval; specify another version only for a controlled diagnostic or recovery workflow.', 'If both selectors are supplied they must refer to the same version. Pinning an old version indefinitely defeats the application\'s intended rotation behavior.', 'get'),
      setting('Rotation mechanism and window', 'Select the supported managed or Lambda rotation method for the secret and target service.', 'A schedule alone does not prove the target accepted the new credential. Custom Lambda rotation adds code, execution permissions and network dependencies that require maintenance.', 'rotation', 'troubleshoot'),
      setting('Resource-policy administration', 'Limit who can modify the secret resource policy and use public-policy protection where appropriate.', 'A principal with PutResourcePolicy can expand access, so treating policy administration as ordinary secret reading creates an escalation path.', 'cross'),
    ],
    security: [
      note('Never log the retrieved value', 'Log secret identifiers, version metadata and retrieval outcome rather than SecretString, SecretBinary or database passwords. Also avoid putting secret material into request parameters that can appear in audit records.', 'get', 'retrieval'),
      note('Protect rotation independently', 'The rotation function may need to update a database credential while the application only needs to retrieve it. Keep those roles separate and investigate unexpected concurrent modifications during a failed rotation.', 'troubleshoot'),
    ],
    example: {
      title: 'A version-aware retrieval request', language: 'json',
      code: '{\n  "SecretId": "arn:aws:secretsmanager:us-east-1:111122223333:secret:invoice-db-AbCdEf",\n  "VersionStage": "AWSCURRENT"\n}',
      explanation: 'This illustrates a GetSecretValue request using a synthetic full ARN. The service response contains sensitive data and must not be printed. A real caller needs the appropriate retrieval and, when applicable, KMS permissions; this page does not execute the request.',
      checks: ['The application can connect using the retrieved current version without logging the credential.', 'After a controlled rotation, cache refresh obtains the intended new version and old pooled connections are handled deliberately.'], sourceIds: ['get', 'rotation'],
    },
    troubleshooting: [
      issue('The application fails after a successful rotation', 'Its cache or connection pool still uses an older credential.', 'Compare safe version metadata and refresh timing with the target\'s current credential state.', 'Refresh through the supported path and replace stale connections without printing passwords.', 'get', 'troubleshoot'),
      issue('Cross-account retrieval is denied', 'Secret identity/resource policies or customer-managed KMS permissions are incomplete.', 'Inspect all three authorization surfaces and verify the complete secret ARN.', 'Repair the scoped policies and use a supported customer-managed encryption key.', 'cross'),
      issue('Rotation stops before testing the new credential', 'The Lambda rotation path has a network, schema or target-login error.', 'Read the failing stage and CloudWatch diagnostic logs; inspect endpoint/database connectivity.', 'Fix that stage and follow the recovery procedure; avoid concurrent secret mutation that obscures the state.', 'troubleshoot'),
    ],
    pitfalls: [
      note('Retrieval success is not database success', 'Secrets Manager can return a valid version whose value the target does not accept. Test a narrow target connection as part of the rotation result.', 'rotation', 'troubleshoot'),
      note('A secret ARN is not secret material', 'The application may safely reference an identifier in configuration, while access to the returned credential needs stronger handling. Protect identifiers when they expose sensitive naming, but do not confuse them with the credential itself.', 'get'),
    ],
    sources: [
      source('get', 'GetSecretValue versions, caching and permissions', 'https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html'),
      source('retrieval', 'Secrets retrieval integrations and auditing', 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/retrieving-secrets.html'),
      source('rotation', 'Managed and Lambda-based secret rotation', 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html'),
      source('cross', 'Cross-account secret and KMS authorization', 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_examples_cross.html'),
      source('troubleshoot', 'Troubleshooting rotation stages and connectivity', 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/troubleshoot_rotation.html'),
    ],
  },
  {
    serviceId: 'waf',
    operatingModel: [
      note('Associate protection with the real ingress', 'A web ACL evaluates HTTP(S) requests reaching a supported associated resource. The resource type and scope matter: protecting an ALB does not protect an unrelated direct endpoint that clients can also call.', 'acl'),
      note('Rules need traffic-specific tuning', 'A managed rule group supplies detection logic, not knowledge of every legitimate payload your application accepts. Count-mode observations and narrowly justified exceptions are part of deployment, particularly for uploads, rich text and unusual API bodies.', 'testing'),
      note('Inspection has component boundaries', 'The hosting service forwards only supported portions of large bodies, headers or cookies for inspection. When a request proceeds, the application receives the whole request, including content WAF did not inspect; configure oversize handling deliberately.', 'oversize'),
    ],
    setup: [
      note('Inventory reachable endpoints', 'Identify the exact CloudFront distribution or supported Regional resource and all bypass paths. Choose the web ACL scope appropriate to that resource before adding rules.', 'acl'),
      note('Establish a legitimate-request sample', 'Capture safe examples of login, checkout, file upload and administrative traffic in a test environment. Introduce the candidate protections in Count mode and inspect which rule matched each example.', 'testing'),
      note('Choose rate aggregation', 'Define whether abuse should be counted by IP or another supported grouping, then narrow the rule to the relevant request family where appropriate. Consider shared NAT users before treating one address as one person.', 'rate'),
      note('Roll out with evidence', 'Enable useful logging and privacy controls, compare legitimate and unwanted traffic, then promote selected rules to their intended action. Allow for propagation and retain a reviewed way to revert an overly broad rule.', 'logging', 'testing'),
    ],
    configuration: [
      setting('Rule action and priority', 'Start new protections with observation and choose the final allow/block/challenge behavior after reviewing real matches.', 'A rule that terminates processing can affect later checks. Measure actual requests and the matching rule instead of assuming a configured rule always sees every request.', 'acl', 'testing'),
      setting('Rate rule aggregation and scope-down', 'Choose grouping criteria and the evaluation window/limit from the application\'s abuse model.', 'A rule is not a precise billing quota. Shared addresses or inappropriate aggregation can punish many legitimate users together, while distinct rule instances track separately.', 'rate', 'rate-caveats'),
      setting('Oversize component handling', 'Select CONTINUE, MATCH or NO_MATCH according to the rule\'s security and availability purpose.', 'Ignoring the uninspected suffix can leave a gap; automatically matching every oversized request can break legitimate uploads. Coordinate application size validation with the edge policy.', 'oversize'),
    ],
    security: [
      note('Retain application authorization', 'A request allowed by WAF is not an authenticated or tenant-authorized request. Continue validating identity, ownership and data formats in the application.', 'acl'),
      note('Review every telemetry path', 'Logging redaction does not automatically redact request sampling or Security Lake collection. Configure the appropriate data-protection controls for each enabled path and avoid collecting bearer credentials unnecessarily.', 'logging'),
    ],
    example: {
      title: 'A safe rollout worksheet for a checkout rule', language: 'text',
      code: 'Protected resource: the production ingress used by checkout\nCandidate action: Count\nTest cases: normal cart, escaped rich text, oversized body, repeated requests\nEvidence: matched rule, action, safe request identifier\nException: only the documented legitimate field/path\nPromotion: enable blocking after false-positive review',
      explanation: 'This is a rollout worksheet rather than a web ACL definition. It makes the expected legitimate behavior explicit before blocking traffic. Use the exact supported rule statement and resource scope when implementing it, and preserve safe diagnostic identifiers.',
      checks: ['Valid checkout examples remain usable after the final action is enabled.', 'The unwanted request pattern is observed on the actual associated resource without leaking sensitive fields into telemetry.'], sourceIds: ['acl', 'testing', 'logging'],
    },
    troubleshooting: [
      issue('Legitimate uploads are blocked', 'A body rule or oversize-handling decision matches the application\'s normal payload.', 'Inspect the exact rule, inspected component and request size without exposing the file contents.', 'Tune the narrow rule/exception and application limits, then retest in Count mode.', 'oversize', 'testing'),
      issue('A configured rule records no matching traffic', 'The web ACL is associated with a different ingress or requests bypass it.', 'Compare the client hostname path with the protected resource and its logging.', 'Attach protection to the intended supported ingress and close unintended bypass paths.', 'acl'),
      issue('Sensitive data is hidden in logs but visible in samples', 'Log redaction was assumed to cover all collection mechanisms.', 'Review sampling, Security Lake and web ACL data-protection configuration separately.', 'Apply the correct protections and reduce source-side sensitive logging.', 'logging'),
    ],
    pitfalls: [
      note('Rule updates do not propagate atomically everywhere', 'Allow a short transition interval when testing changes and distinguish propagation inconsistency from a permanently wrong rule. Avoid rapid contradictory edits that make evidence impossible to interpret.', 'testing'),
      note('Rate limiting is an abuse control', 'Use application-side accounting for exact per-customer quotas or financial limits. WAF aggregation follows request attributes and operational rate evaluation, not the customer\'s contractual allowance.', 'rate', 'rate-caveats'),
    ],
    sources: [
      source('acl', 'Web ACL association and supported protection', 'https://docs.aws.amazon.com/waf/latest/developerguide/web-acl.html'),
      source('testing', 'WAF testing, tuning and propagation', 'https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-testing.html'),
      source('rate', 'Rate-based rule grouping and evaluation', 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based.html'),
      source('rate-caveats', 'Approximate rate enforcement and configuration changes', 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based-caveats.html'),
      source('logging', 'WAF logging and separate sampling privacy', 'https://docs.aws.amazon.com/waf/latest/developerguide/logging.html'),
      source('oversize', 'Oversize request inspection and handling', 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-oversize-request-components.html'),
    ],
  },
  {
    serviceId: 'privatelink',
    operatingModel: [
      note('An interface endpoint introduces private interfaces', 'For each selected subnet, the service creates an endpoint network interface with an address from that subnet. A workload connects to those addresses through the supported service endpoint; this does not create general-purpose peering between every network behind the service.', 'create', 'dns'),
      note('DNS chooses which path the client uses', 'With supported private DNS enabled, the usual service hostname can resolve to the endpoint interfaces inside the VPC. A client using a different endpoint hostname or resolver path may still use public addresses despite the interface endpoint existing.', 'dns'),
      note('Endpoint policy is an additional restriction', 'Where supported, an endpoint policy restricts use of the AWS service through the endpoint. It does not replace identity or resource authorization, and not every service supports customizable endpoint policies.', 'policy'),
    ],
    setup: [
      note('Confirm service and Region support', 'Identify the exact service name, service Region and endpoint type. For a provider-owned endpoint service, confirm allowed consumers, acceptance requirements and common Availability Zones.', 'create', 'provider'),
      note('Choose interface placement', 'Select subnets with available addresses in the required Availability Zones and attach an endpoint security group allowing the intended client traffic, typically HTTPS for AWS APIs.', 'create'),
      note('Verify private resolution', 'Enable the required VPC DNS attributes and the supported private-DNS option. Resolve the actual SDK hostname from a workload and compare the answer with endpoint interfaces before removing another egress path.', 'dns', 'create'),
      note('Test network and authorization separately', 'Check connection establishment, then perform a permitted API operation and a deliberately denied operation. For cross-account provider services, validate connection acceptance as well as application-level authentication.', 'policy', 'provider'),
    ],
    configuration: [
      setting('Endpoint subnets and Availability Zones', 'Place interface endpoints according to workload failure domains and the service\'s supported zones.', 'Every selected zone introduces endpoint capacity and cost. A single-zone choice may create a dependency on that zone even when compute is spread more widely.', 'create', 'dns'),
      setting('Private DNS enabled', 'Use the normal service hostname only after verifying the supported private-DNS configuration and resolver behavior.', 'Custom DNS and on-premises clients need their own forwarding design. DNS success outside the affected VPC does not prove the intended endpoint is used.', 'dns'),
      setting('Endpoint policy', 'For services supporting it, allow only required principals, actions and resources through the endpoint.', 'The default endpoint policy is permissive at this layer. Tightening it can deny otherwise valid IAM requests, but permitting an action here does not grant it elsewhere.', 'policy'),
    ],
    security: [
      note('Constrain the endpoint interface', 'Limit inbound application traffic to the intended sources and verify subnet ACL return traffic. Private addressing is not a substitute for identifying which workloads should connect.', 'create'),
      note('Authenticate provider-service consumers', 'Permission to create a connection and provider acceptance establish connectivity, not every business entitlement. Provider applications must still identify and authorize tenants; review source-address handling before building audit logic around client IP.', 'provider'),
    ],
    example: {
      title: 'A layer-by-layer private request trace', language: 'text',
      code: 'SDK hostname -> VPC resolver -> endpoint private IP\nClient interface -> endpoint security group -> service connection\nAWS request -> endpoint policy (if supported)\nAWS request -> identity/resource policies -> service operation\nFailure classification: DNS | connect timeout | API AccessDenied',
      explanation: 'This trace is a diagnostic model for an interface endpoint, not a route-table configuration. It prevents an IAM change from being used to solve a connectivity timeout and prevents endpoint-policy allows from being mistaken for complete service permission.',
      checks: ['The actual client resolves and reaches the intended endpoint interfaces.', 'The authorized request succeeds while a request outside the permitted service/resource scope remains denied.'], sourceIds: ['dns', 'create', 'policy'],
    },
    troubleshooting: [
      issue('The SDK still connects to a public address', 'Private DNS is disabled, unsupported for that name, or bypassed by the client resolver/endpoint override.', 'Inspect the exact request hostname and DNS answer inside the workload environment.', 'Correct the hostname/resolver/private-DNS configuration before removing required egress.', 'dns'),
      issue('The endpoint is available but requests time out', 'The endpoint security group or subnet ACL blocks the connection.', 'Check client-to-interface protocol/port and response-path rules.', 'Allow the narrow required flow and retry the actual SDK request rather than relying on ping.', 'create'),
      issue('The request reaches AWS but returns AccessDenied', 'Endpoint, identity or resource policies deny the operation.', 'Compare the actual principal/action/resource with all applicable policies and service policy support.', 'Repair the specific restrictive layer without replacing the complete endpoint policy with unrestricted access.', 'policy'),
    ],
    pitfalls: [
      note('An interface endpoint is not a gateway endpoint', 'Endpoint types have different implementation and routing models. Do not copy interface security-group or DNS assumptions into an S3/DynamoDB gateway-endpoint design.', 'dns'),
      note('Zone names are account-relative', 'For provider/consumer accounts, use Availability Zone IDs when matching physical zones. The same zone name can refer to different physical zones in different accounts.', 'provider'),
    ],
    sources: [
      source('create', 'Interface endpoint prerequisites and interfaces', 'https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html'),
      source('policy', 'Endpoint policy support and authorization limits', 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-access.html'),
      source('dns', 'PrivateLink DNS and endpoint access paths', 'https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-access-aws-services.html'),
      source('provider', 'Provider endpoint services and consumer connections', 'https://docs.aws.amazon.com/vpc/latest/privatelink/create-endpoint-service.html'),
    ],
  },
  {
    serviceId: 'api',
    operatingModel: [
      note('Select a product before selecting features', 'REST APIs and HTTP APIs both expose HTTP endpoints, but their management and authorization capabilities differ. Private API endpoints, usage plans, request validation and direct WAF integration are REST API considerations; native JWT authorizers are an HTTP API feature.', 'products'),
      note('Follow the request through three decisions', 'The route and authorizer decide whether a client can invoke the API. The integration needs its own permission to invoke the backend. The backend still checks domain ownership and downstream permissions; an accepted token is not evidence that an order belongs to the caller.', 'jwt', 'products'),
      note('Browser policy is separate from access control', 'HTTP API CORS controls browser cross-origin behavior. It can generate preflight responses and configured response headers, but it does not authenticate a caller. A command-line client is not constrained by the browser CORS enforcement model.', 'cors'),
    ],
    setup: [
      note('Write the feature checklist', 'Choose REST or HTTP API from required endpoint type, authorization, validation and client-management features. Document the decision so a later requirement does not silently assume the other API product is configured.', 'products'),
      note('Build one protected route', 'For an HTTP API JWT example, configure the issuer, audience and token identity source, then require the intended scope on a route. Use a backend that returns a harmless synthetic record first.', 'jwt'),
      note('Test the browser request separately', 'Configure only the origins, methods and headers needed by the frontend. Test OPTIONS and the actual method; inspect the special handling needed when a protected $default route catches preflight requests.', 'cors'),
      note('Add diagnostic evidence', 'Configure access logging with request identifiers, status and integration context appropriate to the chosen API type. For REST APIs, distinguish access logging from execution logging and verify the Regional CloudWatch role setup.', 'logging', 'products'),
    ],
    configuration: [
      setting('JWT issuer, audience and route scopes', 'Set the exact identity-provider issuer and intended audience, then declare the scope required by each route.', 'A valid token without the needed access scope should not reach a privileged route. A generic JWT authorizer does not inherently distinguish every provider\'s ID token from access tokens.', 'jwt'),
      setting('HTTP API CORS configuration', 'Allow explicit frontend origins and required headers such as authorization.', 'When API Gateway CORS is configured, its generated headers take precedence over integration CORS headers. Debugging only backend headers can therefore miss the effective policy.', 'cors'),
      setting('REST access and execution logging', 'Use structured access logs for request outcomes and selectively enable execution detail when troubleshooting.', 'More detail may expose sensitive application context and increase log volume. Keep payload collection deliberate and verify log delivery permissions independently of API invocation.', 'logging'),
    ],
    security: [
      note('Do not use API keys as user authentication', 'Choose an actual authorization mechanism for protected data. API keys and usage plans address API management requirements; they are not a replacement for validating identity and checking application permissions.', 'usage', 'jwt'),
      note('Test negative authorization paths', 'Exercise missing credentials, another issuer/client, insufficient scopes and an authenticated request for someone else\'s resource. Keep authorizer denial separate from backend permission errors in incident evidence.', 'jwt'),
    ],
    example: {
      title: 'An HTTP API browser-access configuration', language: 'json',
      code: '{\n  "AllowOrigins": ["https://app.example.com"],\n  "AllowMethods": ["GET", "OPTIONS"],\n  "AllowHeaders": ["authorization", "content-type"],\n  "MaxAge": 300\n}',
      explanation: 'This is the AWS CLI --cors-configuration JSON input for an HTTP API, not a complete API definition or raw REST API payload. It allows the named browser origin to request the listed methods; attach the intended route authorization and backend integration separately.',
      checks: ['A preflight from the allowed origin gets the expected method/header response.', 'A direct GET without a valid authorized token remains rejected regardless of its Origin header.'], sourceIds: ['cors', 'cli-cors', 'jwt'],
    },
    troubleshooting: [
      issue('The API works with curl but fails in the browser', 'The preflight or effective CORS configuration does not match the frontend request.', 'Inspect the browser OPTIONS response, Origin and requested headers rather than changing IAM.', 'Correct the explicit CORS rules and $default-route preflight handling for this HTTP API.', 'cors'),
      issue('Valid sign-in is followed by API rejection', 'Issuer, audience or route scope differs from the token claims.', 'Compare authorizer configuration and non-secret claim metadata with the route requirement.', 'Align the token acquisition and route scope; retain backend object-ownership checks.', 'jwt'),
      issue('A planned capability is missing in the console', 'The project selected HTTP API for a requirement supported by REST API.', 'Check the official feature matrix for private endpoints, usage plans, validation and WAF.', 'Reassess the API product and migration work before building unsupported assumptions into clients.', 'products'),
    ],
    pitfalls: [
      note('A private integration is not a private API endpoint', 'A public client endpoint can integrate with a private backend. Decide who can reach the API itself separately from the route used by API Gateway to reach the application.', 'products'),
      note('An API response is not a durable workflow result', 'Keep synchronous response status distinct from business processing when the integration hands work to another service. Log correlation identifiers that let an operator follow the next boundary.', 'logging'),
    ],
    sources: [
      source('products', 'REST API and HTTP API feature comparison', 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html'),
      source('usage', 'Usage plans, API keys and best-effort quotas', 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html'),
      source('jwt', 'HTTP API JWT authorizers and scopes', 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html'),
      source('cors', 'HTTP API CORS and preflight behavior', 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html'),
      source('cli-cors', 'AWS CLI HTTP API CORS input structure', 'https://docs.aws.amazon.com/cli/latest/reference/apigatewayv2/update-api.html'),
      source('logging', 'REST API access and execution logging', 'https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html'),
    ],
  },
  {
    serviceId: 'cloudfront',
    operatingModel: [
      note('Cache identity is application correctness', 'A cache policy determines which request headers, cookies and query strings distinguish cached responses. Two viewers whose requests share a key can share the cached object, so every input that changes a reusable response must be deliberately modeled.', 'cache'),
      note('Origin forwarding is a separate contract', 'An origin request policy can forward additional request data without adding it to the cache key. Values already included in the key are forwarded automatically. Forwarding a personalization input without varying or disabling the cache can return the wrong response.', 'origin'),
      note('Origin protection does not authenticate viewers', 'Origin access control authorizes CloudFront to a supported S3 origin; it does not decide which viewer should read an object. Keep S3 origin access, viewer authorization and cache reuse as separate reviews.', 'oac'),
    ],
    setup: [
      note('Classify response families', 'Separate versioned static assets, public variable content and personalized responses. For each path family, document the origin, required request inputs and whether sharing a response is safe.', 'cache', 'origin'),
      note('Configure cache and forwarding together', 'Choose the minimum useful cache-key inputs and the additional data the origin needs. Replay alternating request variants to verify the policy instead of using hit ratio as the only success metric.', 'cache', 'origin'),
      note('Protect the S3 origin', 'For an ordinary S3 bucket origin, configure OAC and the intended bucket policy. Review KMS permissions if applicable. A bucket website endpoint is a custom origin and does not support that OAC/OAI arrangement.', 'oac'),
      note('Validate delivery and freshness', 'Test the actual viewer hostname, certificate coverage and response cache headers. Compare an updated object before and after the chosen freshness/versioning strategy so the release process accounts for existing cached copies.', 'tls', 'ttl'),
    ],
    configuration: [
      setting('Cache-policy TTLs', 'Choose minimum, default and maximum TTLs consistent with the response family and origin directives.', 'A positive minimum TTL can cause caching despite private, no-cache or no-store origin directives. For personalized paths, explicitly select a caching strategy that does not override the required privacy behavior.', 'ttl'),
      setting('Origin request policy', 'Forward only headers, cookies and query strings actually required by the origin.', 'Forwarding everything increases exposure and backend variability. Forwarding a varying field without including it in a reusable cache key creates a correctness risk.', 'origin'),
      setting('Viewer TLS certificate', 'For an ACM certificate used between viewers and CloudFront, request or import it in us-east-1 and cover the configured hostname.', 'Viewer-side certificate placement differs from origin-side certificate placement. A certificate existing in the application Region alone does not satisfy CloudFront\'s viewer integration.', 'tls'),
    ],
    security: [
      note('Test origin bypass', 'Confirm a private S3 object is reachable through the intended distribution while an unauthenticated direct bucket request is denied. Scope the bucket/KMS authorization to the intended distribution rather than publishing the bucket to fix a 403.', 'oac'),
      note('Exercise two-user cache isolation', 'Request the same path with two user contexts and inspect both cache status and payload ownership. Where the response is private, prove that the configured behavior cannot reuse another user\'s content.', 'cache', 'ttl'),
    ],
    example: {
      title: 'A cache-contract matrix for a document portal', language: 'text',
      code: '/assets/app.<digest>.js : public, immutable release asset\n/catalog?language=en   : public, key includes language\n/account/documents     : personalized, caching disabled\nAnalytics-only header : forwarded only if origin needs it\nTest order            : user A, user B, then user A again',
      explanation: 'This is an application design matrix, not a distribution API payload. It identifies which differences belong in cache identity before selecting actual policies. The personalized path must use an effective caching-disabled configuration, not merely a hopeful origin header.',
      checks: ['Alternating languages never returns a different language\'s cached document.', 'User B cannot receive User A\'s account response from an edge cache.'], sourceIds: ['cache', 'origin', 'ttl'],
    },
    troubleshooting: [
      issue('Users see another response variant', 'The origin varies on a field absent from the cache key.', 'Compare effective cache policy, origin forwarding and the field that changes the response.', 'Correct the key or disable caching for that response family, then remove affected cached objects through the release process.', 'cache', 'origin'),
      issue('S3 requests through CloudFront return 403', 'OAC, bucket policy, ownership or required KMS permissions do not align.', 'Verify the actual origin type and distribution identity before changing public-access settings.', 'Repair the scoped origin authorization; website endpoints require a different design.', 'oac'),
      issue('A no-store response is still reused', 'The behavior has a positive minimum TTL.', 'Inspect the effective TTL settings and response directives for the exact matching path.', 'Use suitable caching-disabled settings for private content and verify the behavior with repeated requests.', 'ttl'),
    ],
    pitfalls: [
      note('More key fields can hide a design problem', 'An ever-growing cache key reduces reuse without necessarily making authorization correct. Classify which content can be shared before adding cookies or headers indiscriminately.', 'cache'),
      note('TLS has two connections', 'Viewer-to-edge and edge-to-origin HTTPS have separate certificate requirements. A valid browser padlock does not establish the origin connection configuration.', 'tls'),
    ],
    sources: [
      source('cache', 'CloudFront cache policies and key identity', 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html'),
      source('origin', 'Origin request policies and forwarded values', 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html'),
      source('oac', 'Restricting access to an S3 origin with OAC', 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html'),
      source('ttl', 'Cache expiration and minimum-TTL behavior', 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html'),
      source('tls', 'Viewer and origin certificate requirements', 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html'),
    ],
  },
  {
    serviceId: 'elb',
    operatingModel: [
      note('ELB is a family of different request boundaries', 'An Application Load Balancer evaluates application-layer listener rules and forwards matching requests to target groups. A Network Load Balancer handles supported connection/transport protocols. Choose from the client protocol and routing need rather than treating ALB and NLB as interchangeable sizes.', 'rules', 'nlb'),
      note('The target group defines backend reachability', 'Target type, protocol and port determine how the load balancer reaches an application. Health checks belong to target groups, and target registration alone does not prove the application listens on the expected address and port.', 'targets'),
      note('Health is a configured observation', 'An ALB checks the configured path and success criteria. A healthy check can be too shallow to represent business readiness. If all registered targets are unhealthy, the documented ALB fail-open behavior means health checks are not a guaranteed traffic-blocking control.', 'health'),
    ],
    setup: [
      note('Choose protocol and routing', 'Write whether clients need HTTP host/path routing or transport-level connections, then choose the load-balancer family. Identify the external endpoint and the application port independently.', 'rules', 'nlb'),
      note('Create a representative target group', 'Use the correct target type for the deployment and register a small, known target set. Verify the backend protocol and port from the load-balancer path, not just from localhost on the instance.', 'targets'),
      note('Design useful health checks', 'Choose a stable endpoint that reports the readiness contract you actually require. Test its response code and timeout behavior under startup and dependency failure before sending normal requests.', 'health'),
      note('Test rule precedence', 'For ALB, send requests with representative hostnames and paths, including an unmatched request. Confirm the lowest-numbered matching rule and the final default action route traffic intentionally.', 'rules'),
    ],
    configuration: [
      setting('Listener-rule priorities', 'Assign explicit priority bands to ALB host/path conditions and retain a deliberate default action.', 'A broad early condition can shadow a more specific later rule. Reordering changes behavior even if every individual rule appears correct.', 'rules'),
      setting('Health-check path, timeout and matcher', 'Use the endpoint and success codes that express the target\'s readiness for real traffic.', 'An overly strict check can remove usable capacity; an always-200 endpoint may conceal a broken dependency. Check interpretation and all-unhealthy behavior must be in the runbook.', 'health'),
      setting('Target type and protocol', 'Match instance/IP/Lambda target choices and supported protocol versions to the actual application deployment.', 'The target group is not a generic URL list. A mismatched target model or port can fail before application routing or authentication begins.', 'targets'),
    ],
    security: [
      note('Keep backend exposure intentional', 'Design target connectivity around the intended load-balancer path and restrict direct application access through the applicable network controls. Verify this with a denied direct-access test, not just a working load-balanced request.', 'targets'),
      note('Do not authorize through health checks', 'Keep request authentication and application authorization on the serving path. A health endpoint or a healthy target state is operational evidence, not proof that a caller may read protected data.', 'health', 'rules'),
    ],
    example: {
      title: 'An ALB routing acceptance table', language: 'text',
      code: 'Priority 10: host api.example.com + path /orders/* -> orders targets\nPriority 20: host api.example.com + path /catalog/* -> catalog targets\nDefault: explicit fixed response for unmatched requests\nOrders check: GET /ready on the configured target port\nNegative case: unknown host must not reach the orders application',
      explanation: 'This table describes desired listener behavior, not an API request. Translate the conditions and terminal actions into actual ALB rules, then test precedence with requests that might match more than one rule. Test target health separately from routing.',
      checks: ['Each representative request reaches its intended application.', 'A failing readiness check has the expected target status and reason code, including the documented all-unhealthy case.'], sourceIds: ['rules', 'targets', 'health'],
    },
    troubleshooting: [
      issue('A target stays unhealthy although localhost works', 'The health-check port, path, response matcher or network path differs from the local test.', 'Read the target-health reason code and probe the exact configured readiness endpoint from the permitted path.', 'Correct the mismatch and confirm recovery without merely broadening the acceptable status-code range.', 'health'),
      issue('A valid URL reaches the wrong application', 'A higher-priority ALB rule matches before the intended rule.', 'List rules in evaluation order and compare request host/path with their conditions.', 'Narrow or reorder the conflicting rule and add an overlapping-condition test.', 'rules'),
      issue('HTTP routing rules are unavailable', 'The load balancer is an NLB rather than an ALB.', 'Inspect the load-balancer family and listener protocol against the routing requirement.', 'Use the suitable family or move application routing to a deliberately chosen proxy layer.', 'nlb', 'rules'),
    ],
    pitfalls: [
      note('All unhealthy does not necessarily mean no traffic', 'For ALB, include fail-open behavior in incident planning. Never rely on intentionally failing every health check as an access-control or maintenance mechanism.', 'health'),
      note('A target can be healthy and still reject a real request', 'Readiness checks often omit authentication, payload validation and business dependencies. Keep synthetic end-to-end request tests alongside target-health monitoring.', 'health', 'targets'),
    ],
    sources: [
      source('targets', 'Application Load Balancer target-group model', 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html'),
      source('health', 'ALB health checks and fail-open behavior', 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html'),
      source('rules', 'ALB listener conditions and rule ordering', 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-rules.html'),
      source('nlb', 'Network Load Balancer components and protocols', 'https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html'),
    ],
  },
  {
    serviceId: 'route53',
    operatingModel: [
      note('DNS chooses an answer, not an application response', 'A routing policy affects answers to DNS queries. Clients and recursive resolvers may reuse cached answers, so a weighted record is not a precise per-HTTP-request traffic splitter and changing a record does not terminate existing connections.', 'routing', 'ttl'),
      note('Aliases are Route 53-specific integration', 'An alias can point a record at supported AWS resources or an appropriate record in the same hosted zone. Unlike a CNAME, an alias can be used at the zone apex; it is not an unrestricted redirect to any URL.', 'alias'),
      note('Private resolution has its own namespace', 'An associated private hosted zone can override matching public names inside a VPC. If a matching private zone has no record of the requested name/type, the resolver can return NXDOMAIN instead of falling back to the public zone.', 'private'),
    ],
    setup: [
      note('Identify the authoritative zone', 'Record the exact domain, public/private scope and resolver used by the clients. Confirm the intended public delegation or private VPC association before editing records that clients never consult.', 'private', 'alias'),
      note('Choose a record and routing policy', 'Use the correct A/AAAA/CNAME/alias form for the destination, then select simple, weighted, failover or another policy from the business behavior required. Name the intended primary/secondary or weighted targets.', 'routing', 'alias'),
      note('Design health evidence', 'For failover, identify whether health comes from an endpoint, other health checks or a supported CloudWatch alarm. Test the health signal independently of the DNS record so a false healthy status is visible.', 'health'),
      note('Rehearse a controlled change', 'Inspect answers through representative recursive resolvers and from associated VPCs. Account for the existing TTL before cutover and verify both address families where clients can use IPv4 and IPv6.', 'ttl', 'private'),
    ],
    configuration: [
      setting('TTL for non-alias records', 'Choose a TTL that balances normal resolver caching with the planned recovery or cutover window.', 'Lowering TTL immediately before a change does not erase the previously cached longer value. Alias TTL behavior follows its supported target rather than an arbitrary user-entered TTL.', 'ttl', 'alias'),
      setting('Routing policy', 'Use weighted routing for answer proportions or failover for an active/passive DNS design.', 'Recursive caching and connection reuse mean DNS weights are not exact application-request percentages. Health-based routing also depends on how the health association is configured.', 'routing', 'health'),
      setting('Private hosted-zone association', 'Associate only the intended VPCs and enable the required DNS support/hostname attributes.', 'An overlapping private zone changes resolution for its namespace. Missing private records can produce NXDOMAIN even when public records exist.', 'private'),
    ],
    security: [
      note('Treat DNS changes as service ownership changes', 'Restrict record and zone administration to the responsible deployment path and review destination changes. Correct DNS can direct users to the wrong application if the target hostname or alias is changed unexpectedly.', 'alias', 'routing'),
      note('Keep private naming separate from authorization', 'Private resolution limits where a name is answered, but a resolvable private service still needs network controls and application authorization. Do not put credentials into record values or internal naming conventions.', 'private'),
    ],
    example: {
      title: 'Explain an internal NXDOMAIN', language: 'text',
      code: 'Public zone example.com: app.example.com A -> public application\nPrivate zone example.com: associated with the worker VPC\nPrivate zone: no app.example.com A record\nWorker query: app.example.com, type A\nExpected investigation: matching private zone, then NXDOMAIN\nDo not assume: automatic fallback to the public record',
      explanation: 'This synthetic resolution trace shows why a public DNS test and a VPC test can disagree. Resolve from the affected workload and inspect zone association, most-specific matching namespace and requested record type before changing network permissions.',
      checks: ['The intended private record resolves inside the associated VPC.', 'Public and private answers match the documented split-view design rather than accidentally masking each other.'], sourceIds: ['private'],
    },
    troubleshooting: [
      issue('A changed record still returns the old address', 'A recursive resolver retains an earlier answer for its TTL.', 'Compare authoritative and recursive answers, their remaining TTLs and the time of the change.', 'Wait for the relevant cache lifetime or use the approved cutover plan; do not repeatedly change correct records.', 'ttl'),
      issue('The name works outside the VPC but not inside', 'A private hosted zone or resolver rule changes the effective namespace.', 'Check the matching private zone, record type, VPC association and resolver-rule precedence.', 'Repair the private record or association to match the intended split-view design.', 'private'),
      issue('DNS failover does not choose the expected target', 'The health signal or policy association does not express the failure being tested.', 'Inspect the health-check state and record routing configuration independently.', 'Correct the health model and rerun a controlled failure exercise while accounting for cached answers.', 'health', 'routing'),
    ],
    pitfalls: [
      note('A CNAME is not an HTTP redirect', 'DNS returns naming information; it does not change a browser URL path or perform a 301 response. Use the appropriate application/CDN endpoint for URL redirects.', 'alias'),
      note('DNS health is only the chosen signal', 'A passing health check proves its configured observation, not every tenant, dependency or transaction. Make the check meaningful for the failover decision and test the alternate application too.', 'health'),
    ],
    sources: [
      source('routing', 'Route 53 routing-policy choices', 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html'),
      source('alias', 'Alias records versus CNAME records', 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html'),
      source('private', 'Private hosted-zone precedence and NXDOMAIN', 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zone-private-considerations.html'),
      source('health', 'Health-check signals and DNS failover', 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html'),
      source('ttl', 'Record TTL and recursive caching', 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-values-basic.html'),
    ],
  },
  {
    serviceId: 'vpc',
    operatingModel: [
      note('Routing and permission answer different questions', 'A subnet route table selects a target for the destination address; it does not grant an application API permission. Each subnet has an effective route table, explicitly associated or inherited from the main table, and the most specific matching route normally wins.', 'routes'),
      note('Security groups accumulate allowed traffic', 'Security groups attach to resources and contain allow rules. When several groups apply, their rules are combined rather than processed as ordered deny/allow entries. Stateful response handling differs from subnet network ACL evaluation.', 'groups', 'acl'),
      note('Network ACLs evaluate both directions', 'An ACL acts at the subnet boundary using ordered allow/deny rules and is stateless. A permitted request still needs an allowed return path, including relevant ephemeral ports. ACLs do not replace application identity or security-group design.', 'acl'),
    ],
    setup: [
      note('Draw the actual connection', 'Identify source network interface, destination hostname/address, protocol and port. Resolve the hostname from the affected workload before deciding whether the connection should use a private endpoint, local network or internet path.', 'dns', 'routes'),
      note('Inspect the effective subnet routes', 'Check the route-table association and the winning destination route on each relevant segment. Review IPv4 and IPv6 separately; an IPv4 default route does not create an IPv6 route.', 'routes'),
      note('Apply narrow traffic rules', 'Allow only the required protocol/port between the intended sources and destinations. When using a source security-group reference, verify the supported relationship rather than assuming it creates routing between networks.', 'groups'),
      note('Test forward and return behavior', 'Compare a successful connection with a deliberately denied source. For restrictive ACLs, trace both request and response ports. Record DNS, route and policy findings separately so an API denial is not confused with a timeout.', 'acl', 'groups', 'dns'),
    ],
    configuration: [
      setting('Subnet route-table association', 'Use explicit associations where different tiers need different paths and review the main table for inherited behavior.', 'A correct-looking route in an unused table changes nothing. Broad defaults can be superseded by a more specific route, so inspect the destination actually returned by DNS.', 'routes'),
      setting('Security-group sources and destinations', 'Prefer the narrow source group or CIDR and application port appropriate to the relationship.', 'Adding another group can widen access because allow rules aggregate. A security-group reference does not itself authorize every resource or create a network route.', 'groups'),
      setting('DNS support and hostnames', 'Configure the VPC DNS attributes required by the chosen private-name and endpoint design.', 'Disabling DNS or using a custom resolver without the needed forwarding can break otherwise reachable services. Diagnose resolution before repeatedly changing firewalls.', 'dns'),
    ],
    security: [
      note('Keep administrative access separate', 'Define a deliberate administrative path with narrow source and port rules. Do not temporarily expose all ingress as a generic connectivity test; compare the specific connection against its expected route and allow rule.', 'groups'),
      note('Understand reserved-service exceptions', 'Security groups and ACLs are not universal packet filters for every VPC service. For example, their documented limitations include traffic to AmazonProvidedDNS; use the service-specific control when DNS filtering is required.', 'groups', 'acl'),
    ],
    example: {
      title: 'A private worker-to-database connection worksheet', language: 'text',
      code: 'Source: worker network interface, source security group\nDestination: database hostname -> resolved private address\nProtocol/port: the configured database listener\nRoute: effective table selects the intended private path\nSecurity groups: permitted worker-to-database connection\nNetwork ACLs: request and response paths allowed\nApplication: authenticate separately after TCP/TLS succeeds',
      explanation: 'This worksheet identifies the observable boundary at each layer. It deliberately avoids assuming that a subnet name such as private proves its routing. Populate it from the deployed interface, associated tables and actual DNS answer.',
      checks: ['The intended worker reaches the database listener and authenticates using its separate application credentials.', 'An unrelated source remains blocked, and permitted return traffic is not accidentally denied by a stateless ACL.'], sourceIds: ['routes', 'groups', 'acl', 'dns'],
    },
    troubleshooting: [
      issue('A route was added but connectivity did not change', 'The subnet uses a different table or a more specific destination route.', 'Inspect the actual subnet association and longest-prefix match for the resolved destination.', 'Correct the intended table/route and validate both address families used by clients.', 'routes'),
      issue('Connection setup works only after removing the ACL', 'The ordered ACL rules omit required return traffic or an earlier deny wins.', 'Trace inbound and outbound ports and the first matching rule in each direction.', 'Add the precise needed return-path rules while retaining deliberate subnet restrictions.', 'acl'),
      issue('A private hostname does not resolve', 'DNS attributes, custom resolver behavior or forwarding do not match the name source.', 'Check VPC DNS support and query through the resolver actually used by the workload.', 'Restore the intended DNS configuration before modifying application IAM permissions.', 'dns'),
    ],
    pitfalls: [
      note('A public-subnet label is not a complete connection', 'Review the route target, interface addressing and applicable traffic rules. A friendly subnet name is metadata and does not prove the network path used by a packet.', 'routes', 'groups'),
      note('A successful network test is not authorization', 'A TCP connection or TLS handshake only reaches the service boundary. Database credentials, IAM signatures and object-level permissions remain independent checks.', 'groups'),
    ],
    sources: [
      source('routes', 'Subnet route associations and destination matching', 'https://docs.aws.amazon.com/vpc/latest/userguide/subnet-route-tables.html'),
      source('groups', 'Security-group rule aggregation and limitations', 'https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html'),
      source('acl', 'Network ACL ordering and stateless behavior', 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html'),
      source('dns', 'VPC DNS support attributes', 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns-updating.html'),
    ],
  },
  {
    serviceId: 'iam',
    operatingModel: [
      note('Evaluate a request, not a policy in isolation', 'Authorization depends on the caller, action, resource and request context. An explicit deny in an applicable policy defeats an allow. Resource policies, organization controls and session restrictions mean a single attached policy is not a complete explanation of effective access.', 'evaluation'),
      note('Separate trust from permission', 'A role trust policy controls who can obtain a session. Its permissions policies control what that session can attempt afterward. For a cross-account operator, review the caller permission to assume the role as well as the destination trust relationship.', 'trust'),
      note('Boundaries constrain delegated administration', 'A permissions boundary limits what identity policies can grant; attaching one does not grant an action. Resource-policy grants to particular principals or sessions have distinct evaluation rules, so do not model every request as a simple intersection of every policy document.', 'boundaries'),
      note('The named principal changes resource-policy evaluation', 'Within one account, a resource-policy grant directly to a user ARN is not constrained by an implicit deny in that user\'s identity policy or boundary. A grant directly to a role-session ARN is not constrained by implicit denies in identity, boundary or session policies; a grant to a role ARN remains limited by boundary and session policies. Applicable explicit denies still prevail. Evaluate the actual principal and policy form before applying these exceptions.', 'boundaries', 'evaluation'),
    ],
    setup: [
      note('Describe one capability', 'Write the actual API actions, resource identifiers and legitimate caller for a small workflow. Separate reading configuration, changing resources and passing a role into different requirements before writing policy statements.', 'evaluation'),
      note('Choose the role relationship', 'Identify the workload service or federated operator that will assume the role. For a third-party operator serving multiple customers, agree on its customer-specific external ID and place the condition in the role trust policy.', 'trust'),
      note('Validate before attachment', 'Use IAM Access Analyzer policy validation to find grammar problems and security warnings. Examine the changed access, then run allowed and intentionally denied requests in an authorized test environment; validation alone does not execute that scenario.', 'validation'),
      note('Capture the full denial context', 'Keep the role ARN, operation, resource and policy versions with the test result. Ask the organization administrator to inspect applicable controls when an otherwise plausible permission remains denied.', 'evaluation', 'boundaries'),
    ],
    configuration: [
      setting('Resource and condition scope', 'Choose explicit resource ARNs and documented condition keys for the API being authorized.', 'A broad resource pattern is easy to maintain but may include future resources. An excessively narrow condition can break service-mediated calls whose context differs from direct calls.', 'evaluation'),
      setting('Permissions boundary', 'Use a reviewed boundary when delegating creation or management of roles to a team.', 'The boundary supplies a ceiling, not access. The administrator must also prevent users from replacing or removing that ceiling through their delegated permissions.', 'boundaries'),
      setting('ExternalId in third-party trust', 'Require the unique value assigned to your customer relationship when the third party assumes your role.', 'The external ID addresses confused-deputy access. It is not a password, and publishing it is not equivalent to publishing an AWS access key.', 'trust'),
    ],
    security: [
      note('Review trust principals independently', 'Reject trust changes that merely fix AccessDenied by admitting arbitrary accounts. Confirm that the trusted provider identifies your tenant and that the role permissions cover only the service operations it needs.', 'trust'),
      note('Review policy deltas', 'Resolve Access Analyzer security findings and use its custom checks where appropriate to compare a proposed policy against the existing policy. A syntactically valid policy can still grant substantially more access than intended.', 'validation'),
    ],
    example: {
      title: 'A capability review before granting access', language: 'text',
      code: 'Caller: deployment role in the application account\nRequested action: assume a named release role\nTrust review: caller account, principal and required conditions\nPermission review: only the release operations and resources\nNegative test: the same caller cannot assume the production-admin role\nEvidence: caller ARN, target role ARN, decision and policy revision',
      explanation: 'This is a review worksheet, not an IAM policy. It forces the team to assess the role-assumption boundary separately from the operations performed after assumption, before translating the requirement into service-specific statements.',
      checks: ['The approved role can be assumed only through the intended trust relationship.', 'A denied action is investigated across applicable controls instead of adding a blanket administrator policy.'], sourceIds: ['trust', 'evaluation', 'validation'],
    },
    troubleshooting: [
      issue('An Allow statement still produces AccessDenied', 'An applicable deny, boundary, session restriction or organization control may limit the request.', 'Record the actual caller and resource; inspect all relevant policy layers and condition values.', 'Change the narrow policy or condition that conflicts with the intended capability, with the appropriate administrator.', 'evaluation', 'boundaries'),
      issue('A vendor cannot assume its role', 'The trusted principal, external ID or caller-side permission does not match the request.', 'Compare the destination trust policy with the vendor account and exact external ID sent.', 'Repair the specific trust/caller configuration; do not remove the tenant condition as a shortcut.', 'trust'),
      issue('A boundary unexpectedly denies a resource-policy user', 'A resource policy uses Deny with NotPrincipal against an identity that has a boundary.', 'Inspect NotPrincipal statements and the boundary attachment before rewriting identity permissions.', 'Use the documented principal-condition approach after reviewing the intended deny semantics.', 'boundaries'),
    ],
    pitfalls: [
      note('A policy simulator is not the deployment', 'Treat policy validation and reasoning as preflight evidence. Actual service context, current resource policies and organization controls still determine the authorized request.', 'validation', 'evaluation'),
      note('Account trust does not mean every operation', 'Trusting another account delegates a role-assumption relationship; it does not independently define the resulting role permissions. Keep both documents in the same review.', 'trust'),
    ],
    sources: [
      source('evaluation', 'IAM request and policy evaluation', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html'),
      source('boundaries', 'Permissions boundaries and resource-policy exceptions', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html'),
      source('validation', 'IAM Access Analyzer policy validation', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-policy-validation.html'),
      source('trust', 'Third-party access and external IDs', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_third-party.html'),
    ],
  },
  {
    serviceId: 'sts',
    operatingModel: [
      note('A session is a complete credential tuple', 'Temporary credentials contain an access key, secret key and session token with an expiry. The token is required when signing requests. After expiry, obtain a new session; editing the local expiry timestamp cannot extend the credentials.', 'credentials'),
      note('AssumeRole has two authorization boundaries', 'Cross-account assumption requires permission from the originating identity and trust in the destination role. An optional session policy narrows permissions granted through the role\'s identity policies; resource-policy grants to the actual principal still require their own evaluation.', 'assume', 'evaluation'),
      note('Session identity supports investigation', 'A role session name labels an assumption, while source identity can preserve the originating identity through role chaining. Require and validate that context where supported so audit records can distinguish multiple operators sharing a role.', 'identity'),
    ],
    setup: [
      note('Choose the federation operation', 'Identify whether the caller is already an AWS principal or presents an external identity token. This guide illustrates AssumeRole; web-identity and SAML federation have different request inputs and trust conditions.', 'assume'),
      note('Wire the credential provider', 'Use the supported SDK provider chain for the workload instead of copying credentials into a configuration file. Verify which provider wins when environment variables, local profiles and runtime role credentials coexist.', 'credentials'),
      note('Plan the STS network path', 'For an interface endpoint, configure the SDK to use the matching Regional STS endpoint and verify DNS and HTTPS reachability from the actual workload. Merely creating the endpoint does not reroute every STS hostname.', 'endpoint'),
      note('Test across session replacement', 'Keep a test worker running beyond one credential cycle and record whether a newly obtained session is used. Capture role/session identifiers and expiry times in diagnostic metadata without recording secret keys or tokens.', 'credentials', 'identity'),
    ],
    configuration: [
      setting('DurationSeconds', 'Select a requested session duration supported by the operation, role configuration and any role-chaining restrictions.', 'Longer sessions reduce assumption traffic but keep issued credentials useful longer if stolen. A role maximum does not erase the separate rules for chained sessions.', 'assume'),
      setting('Session policies', 'Pass a restrictive policy when a single operation needs less authority than the complete role.', 'Session policies cannot grant additional role permissions. Remember their size and packing constraints when adding policies or session tags.', 'assume'),
      setting('SourceIdentity and session naming', 'Define a stable, non-secret operator or workload identifier and enforce it through compatible trust controls.', 'Source identity requires corresponding permissions and persists through chaining. Do not put email-sensitive or secret payload data into an audit identifier.', 'identity'),
    ],
    security: [
      note('Use narrow destination trust', 'Trust only the intended originating principal or identity provider and apply required conditions. Keep the ability to assume a role separate from the ability to modify its trust or attached permissions.', 'assume'),
      note('Treat temporary credentials as secrets', 'Avoid logging the AssumeRole response. Rotate the session through the provider, restrict access to runtime credential sources and use audit identity fields to investigate behavior without exposing bearer material.', 'credentials', 'identity'),
    ],
    example: {
      title: 'Trace a session without printing its credentials', language: 'text',
      code: 'Assumption A: release worker -> application-reader role\nRecord: assumed role ARN, source identity, expiry timestamp\nRead A: permitted application object succeeds\nRead B: unrelated data remains denied\nAfter refresh: newly issued credentials, same intended role and scope\nNever record: SecretAccessKey or SessionToken',
      explanation: 'The trace separates credential renewal from a permission expansion. Reusing the same role-session name can produce the same assumed-role ARN, so confirm provider refresh and credential expiry rather than requiring an ARN change. The refreshed provider must preserve the intended role and access scope without falling back to a developer profile.',
      checks: ['A request after renewal uses the intended assumed role.', 'Expired or missing-session-token credentials fail without triggering an insecure long-lived-key fallback.'], sourceIds: ['credentials', 'assume', 'identity'],
    },
    troubleshooting: [
      issue('ExpiredToken appears after hours of successful work', 'The application cached an old credential tuple instead of obtaining a replacement.', 'Compare the active credentials expiry with the provider refresh behavior and process configuration.', 'Repair the provider lifecycle and retry eligible operations with a newly issued session.', 'credentials'),
      issue('AssumeRole fails before any application request', 'The role trust and caller permission do not both authorize a cross-account assumption.', 'Inspect the principal ARN, target role ARN, conditions and requested duration.', 'Correct the trust/caller mismatch or request duration; changing the target application policy will not fix assumption.', 'assume'),
      issue('Private workers time out only while acquiring credentials', 'STS calls use the wrong hostname or cannot reach the interface endpoint.', 'Resolve the Regional STS hostname inside the worker subnet and inspect endpoint connectivity.', 'Configure the supported Regional endpoint and network rules, then retry credential acquisition.', 'endpoint'),
    ],
    pitfalls: [
      note('A session policy is not a grant', 'A policy passed during assumption cannot add permissions to the role\'s identity-policy grants. Do not assume it universally caps resource-policy permissions granted directly to a session; check the principal-specific IAM evaluation rules and applicable explicit denies.', 'assume', 'evaluation'),
      note('Expiry and revocation are different concerns', 'Design for expiring credentials and investigate the documented role-session controls when emergency access removal is required. Deleting a locally cached token does not recall copies held elsewhere.', 'credentials', 'identity'),
    ],
    sources: [
      source('credentials', 'Using temporary AWS credentials', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_use-resources.html'),
      source('assume', 'AssumeRole request and permission semantics', 'https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html'),
      source('evaluation', 'Principal-specific resource-policy and boundary evaluation', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html'),
      source('identity', 'Source identity and assumed-role audit context', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_control-access_monitor.html'),
      source('endpoint', 'Regional STS interface endpoints', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sts_vpc_endpoint_create.html'),
    ],
  },
  {
    serviceId: 'kms',
    operatingModel: [
      note('The key and encrypted data are separate assets', 'A KMS key is a managed cryptographic resource with identity, policy and lifecycle. In envelope encryption, a data key protects application data while KMS protects that data key. Losing access to the wrapping key can make otherwise intact data unusable.', 'concepts', 'rotation'),
      note('Key policy participates in every design', 'A KMS key has one key policy. IAM allows do not independently authorize use unless the key policy enables the corresponding authorization path. Account identity, grants and key policy must be evaluated together rather than attaching kms:* until a call succeeds.', 'policy'),
      note('Encryption context binds meaning to ciphertext', 'Symmetric encryption operations can bind non-secret context to ciphertext; decryption requires the matching context. It is authenticated data, not a hidden label, and can appear in CloudTrail. Asymmetric and HMAC operations do not accept this mechanism.', 'context'),
    ],
    setup: [
      note('Choose the exact key requirement', 'Record whether the application needs symmetric encryption, signing or a MAC, and whether the integrated service accepts the chosen key type. Choose customer-managed control only where its ownership and administration requirements are justified.', 'concepts'),
      note('Separate administration and use', 'List the team that can change policy or lifecycle and the workload allowed to perform the required cryptographic operations. Review the key policy without accidentally removing the administrative recovery path.', 'policy'),
      note('Define non-secret context', 'For a custom symmetric encryption flow, agree on stable context keys such as application and data category. Persist the context needed for decryption alongside the encrypted record; do not place credentials or personal data there.', 'context'),
      note('Test lifecycle effects', 'Rehearse decrypting older ciphertext after an eligible key-material rotation. Inventory dependencies before disabling or scheduling deletion, including backups and old objects that may need the original logical key later.', 'rotation'),
    ],
    configuration: [
      setting('Key ownership', 'Compare AWS-owned, AWS-managed and customer-managed keys against auditing, lifecycle and policy-control requirements.', 'Customer-managed keys give policy/lifecycle control with additional operational responsibility. Do not assume an AWS-managed key can be shared across accounts.', 'concepts'),
      setting('Rotation mechanism', 'Automatic rotation supports symmetric encryption keys with AWS_KMS origin. On-demand rotation supports symmetric encryption keys with AWS_KMS or EXTERNAL origin; asymmetric keys, HMAC keys and custom-key-store keys require manual replacement.', 'Rotating material in the same KMS key preserves its identity and does not re-encrypt application data or rotate existing data keys. Manual replacement creates a different key and requires a migration plan for historical ciphertext.', 'rotation'),
      setting('Encryption-context policy conditions', 'Restrict supported cryptographic use with documented context conditions when the application reliably supplies them.', 'A context mismatch can break decryption even for an authorized caller. Context is public metadata and must never become a secret-storage workaround.', 'context'),
    ],
    security: [
      note('Scope the complete authorization path', 'Review key policy, relevant IAM permissions and grants for the application and integrated service. A workload that only decrypts a narrow dataset should not receive lifecycle operations or permission to edit its own key policy.', 'policy'),
      note('Retain recoverable historical data', 'Treat key deletion as a data-availability change. Identify old ciphertext and backups, verify owners and recovery requirements, and distinguish a new key or alias change from rotation of existing key material.', 'rotation'),
    ],
    example: {
      title: 'A non-secret encryption context contract', language: 'json',
      code: '{\n  "application": "invoice-worker",\n  "recordType": "invoice-export",\n  "environment": "test"\n}',
      explanation: 'This is an EncryptionContext map for an illustrative symmetric KMS operation, not a key policy. Supply the same case-sensitive context during decryption. Store only classification labels here; context may be visible in audit logs and does not replace authorization.',
      checks: ['A permitted decrypt with the original context recovers the expected test data.', 'Changing a bound context value fails decryption, and audit logs contain no secret payload.'], sourceIds: ['context'],
    },
    troubleshooting: [
      issue('IAM permits Decrypt but the request is denied', 'The key policy does not enable that authorization path, or another applicable control denies it.', 'Check the exact key ARN, principal, grants and key policy in the correct Region.', 'Repair the narrowly scoped key authorization instead of widening only the identity policy.', 'policy'),
      issue('Decrypt fails for one class of records', 'The ciphertext context or key differs from the application assumptions.', 'Compare recorded context, ciphertext provenance and logical key identity with the original encryption operation.', 'Use the matching metadata and original key; do not remove context from a cryptographically bound record.', 'context'),
      issue('A rotation project leaves old data unchanged', 'The team expected KMS material rotation to rewrite stored ciphertext.', 'Inspect whether the same logical key was rotated or a new key was introduced.', 'Plan an explicit application/service re-encryption workflow if data-key replacement is the actual requirement.', 'rotation'),
    ],
    pitfalls: [
      note('An alias is not historical key material', 'Pointing an alias at a new key directs future lookups but does not migrate encrypted data. Preserve access to the logical keys required by existing ciphertext until a verified migration completes.', 'rotation'),
      note('Region is part of key authorization', 'A key policy applies to its Regional key. Do not assume that a policy edit on one key authorizes unrelated keys in another Region merely because naming conventions match.', 'policy'),
    ],
    sources: [
      source('policy', 'KMS key policies and IAM delegation', 'https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html'),
      source('concepts', 'KMS key ownership and control models', 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html'),
      source('context', 'Encryption context and authenticated metadata', 'https://docs.aws.amazon.com/kms/latest/developerguide/encrypt_context.html'),
      source('rotation', 'Key rotation and ciphertext lifecycle', 'https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html'),
    ],
  },
  {
    serviceId: 'cognito',
    operatingModel: [
      note('User pools issue application identity', 'A user pool is an OIDC identity provider and user directory. It authenticates users and issues tokens for applications; your backend must still decide whether the authenticated subject owns the requested order, tenant or document.', 'user-pools', 'verify'),
      note('Identity pools issue AWS access', 'An identity pool exchanges supported federated identities for temporary AWS credentials under IAM roles. This is a separate purpose from a user-pool access token; use it when the client needs appropriately scoped, signed AWS API calls.', 'identity-pools'),
      note('A valid signature is only one check', 'Token verification must validate the expected issuer, signing key, expiration, token use and intended client, with scopes where needed. Decoding a JWT payload does not prove who created it or whether the application should accept it.', 'verify'),
    ],
    setup: [
      note('Define the client trust boundary', 'Separate browser/native public clients from server-side confidential clients. Select the user-pool sign-in experience and allowed callback URLs; do not place a confidential client secret in downloadable frontend code.', 'authorize'),
      note('Use an explicit sign-in flow', 'For interactive OAuth sign-in, prefer the authorization-code flow and PKCE where applicable. Bind the redirect to an exact registered callback and validate the returned state against the initiating browser session.', 'authorize'),
      note('Implement API token validation', 'Use a maintained verifier configured for the exact pool, client and token purpose. Cache signing keys safely and support their refresh; test an expired token, another pool and a token intended for a different client.', 'verify'),
      note('Specify logout semantics', 'Document the difference between removing local browser state, revoking refresh-token families and ending other sessions. Test the real resource server because an offline JWT verifier can continue accepting a revoked token until its own checks reject it.', 'revoke'),
    ],
    configuration: [
      setting('Allowed callback URLs and OAuth scopes', 'Register only required redirects and request the scopes the application actually uses.', 'A broad scope request complicates consent and authorization. Callback mismatches cause sign-in failures; loosely handling redirect input can create a separate application vulnerability.', 'authorize'),
      setting('Token type at the API boundary', 'Explicitly require the token purpose and client claims appropriate to the API.', 'ID tokens describe identity; access tokens carry access context. Accepting any signed token without checking its intended purpose can authorize an unintended client flow.', 'verify'),
      setting('Identity-pool role mapping', 'Map authenticated and optional guest identities to narrowly scoped IAM roles.', 'Enabling unauthenticated identities creates an access path for unsigned-in clients. Treat that role as public capability and grant only the resources deliberately exposed.', 'identity-pools'),
    ],
    security: [
      note('Enforce resource ownership server-side', 'Use validated claims as inputs to authorization, not a client-supplied owner ID. Successful login must not let one user read another user\'s objects by changing a URL parameter.', 'verify', 'user-pools'),
      note('Plan for revoked self-contained tokens', 'Cognito rejects revoked tokens for Cognito APIs that require them, but signature/expiry-only JWT libraries do not automatically query revocation state. Choose an API session strategy that matches your required removal-of-access time.', 'revoke'),
    ],
    example: {
      title: 'A token-verification acceptance matrix', language: 'text',
      code: 'Expected issuer: the configured user pool\nExpected client: the application client\nExpected token use: access for this protected API\nExpected scope: orders/read\nAccept: valid token + required scope + owned order\nReject: expired token, wrong client, wrong pool, unowned order',
      explanation: 'This worksheet describes API acceptance tests, not a JWT to paste into an application. Ownership is an application check after token verification. Test revocation behavior separately instead of assuming a cryptographically valid token reflects current session state.',
      checks: ['A valid user can read only a record authorized by the backend.', 'Wrong-purpose and wrong-client tokens fail, and logout behavior matches the documented revocation strategy.'], sourceIds: ['verify', 'revoke'],
    },
    troubleshooting: [
      issue('Login returns a redirect mismatch', 'The authorization request callback differs from the registered app-client value.', 'Compare scheme, hostname, path and redirect_uri encoding against the configured callback.', 'Correct the intended callback registration/request without accepting arbitrary return URLs.', 'authorize'),
      issue('A signed token is rejected by the API', 'Issuer, client, expiry, token use or scope differs from the verifier contract.', 'Inspect non-secret token metadata and verifier diagnostics; do not log the bearer token.', 'Fix the app-client/authorizer agreement or obtain the correct token type.', 'verify'),
      issue('A logged-out user can still call an application API', 'The API verifies JWT signature and expiry but does not apply a revocation-aware session policy.', 'Compare Cognito revocation with the independent resource-server decision path.', 'Implement the chosen access-removal strategy and test all affected devices/token families.', 'revoke'),
    ],
    pitfalls: [
      note('Login is not IAM federation by itself', 'A user-pool token and an AWS credential tuple are different artifacts. Add an identity-pool exchange only when the client needs the corresponding AWS access model.', 'identity-pools'),
      note('Self-registration is an access decision', 'Enabling public sign-up lets internet users create accounts. Decide whether the product needs self-service registration or an administrator-controlled onboarding process.', 'user-pools'),
    ],
    sources: [
      source('user-pools', 'Cognito user pools and sign-up behavior', 'https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html'),
      source('identity-pools', 'Cognito identity pools and AWS credentials', 'https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html'),
      source('verify', 'Verifying Cognito JSON web tokens', 'https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html'),
      source('revoke', 'Revocation and independent JWT verification', 'https://docs.aws.amazon.com/cognito/latest/developerguide/token-revocation.html'),
      source('authorize', 'Authorization endpoint, redirects and PKCE', 'https://docs.aws.amazon.com/cognito/latest/developerguide/authorization-endpoint.html'),
    ],
  },
];
