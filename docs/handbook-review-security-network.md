# Independent handbook review: security, networking and observability

Review date: 2026-11-03. Reviewer: `audit_security_network`, separate from the author. Scope: every section and example in all 19 entries of `src/serviceHandbookSecurityNetwork.ts`, and their existing field notes in `src/serviceDeepDiveCore.ts` and `src/serviceDeepDiveTools.ts`. The author report was read as context, not accepted as verification evidence. Official AWS pages were independently opened and their relevant content checked, including the example shapes and operational boundaries below.

Disposition: approved for integration after the corrections recorded here. No unresolved factual blocker was found in these 19 entries. This is a documentation and example review, not evidence of an AWS deployment or a guarantee about a particular account's effective configuration.

## Coverage

Every row includes review of the full operating model, setup, configuration, security, example, troubleshooting, pitfalls and corresponding older field notes. The source register below records the exact official URLs opened; there are at least four relevant documentation pages for every service, including example support.

| Service | Semantic/example checks and consequential boundaries | Review result |
| --- | --- | --- |
| `eks` | ServiceAccount YAML only creates the account in an existing namespace; pod template, association, role, agent and supported SDK remain prerequisites. Operator access entries differ from pod AWS identity. Kubernetes private endpoint differs from EKS management PrivateLink. Checked upgrade versus rollback, worker/add-on compatibility and Fargate limitations. | Approved; added concrete rollback scope and direct example source. |
| `api` | Checked REST versus HTTP feature matrix, native JWT and scope checks, usage keys/quotas, private integration versus private API, CORS preflight and authorized default routes. PascalCase CORS properties are valid CLI input, whereas the raw management REST payload has a different representation. | Approved after example is explicitly labeled as CLI JSON. |
| `cloudfront` | Cache-key inputs differ from origin forwarding; positive minimum TTL can override origin no-cache directives. Personalization worksheet avoids shared caching. OAC supports ordinary S3 origins, not S3 website endpoints; viewer TLS placement and origin access are separate. | Approved; no handbook change required. |
| `elb` | Listener worksheet uses ordered ALB rules and target health. Verified ALB all-targets-unhealthy fail-open behavior without generalizing every ELB family. Health checks are limited evidence, not full dependency or authorization tests. | Approved; parent corrected older Classic Load Balancer pricing scope. |
| `route53` | Split-view example is valid for the matching associated private hosted zone: a missing record does not fall back to public DNS. Checked alias/apex semantics, cached TTLs, weighted routing and health/failover limits. | Approved; no change required. |
| `vpc` | Connectivity worksheet follows DNS, effective subnet route, security groups, network ACLs and application authorization. Checked longest-prefix routing, IPv4/IPv6 separation, stateful allow-only groups and stateless ordered ACL return paths. | Approved; no change required. |
| `cognito` | Token worksheet distinguishes user pools from identity pools, ID versus access token client claims and application permissions. Verified public-client PKCE/callback handling and that revoked Cognito tokens can still pass independent offline JWT signature/expiry checks. | Approved; no change required. |
| `iam` | Permission worksheet separates trust from post-assumption permissions. Checked same-account resource grants to user ARN, role ARN and role-session ARN, implicit versus explicit deny, boundaries and NotPrincipal/Deny behavior. External IDs are not secrets. | Approved; expanded principal-specific exceptions. |
| `kms` | Non-secret encryption-context JSON is valid for symmetric encryption and must match on decrypt. Verified policy delegation/grants, key identity versus material/data keys, rotation origin/type eligibility, aliases and historical ciphertext. | Approved; explicit rotation eligibility added; parent fixed older encrypted-read wording. |
| `secrets-manager` | GetSecretValue request uses a full SecretId and valid AWSCURRENT stage; simultaneous stage/version selectors must agree. Checked cross-account identity/resource/key authorization, caching, staged rotation and target connectivity. | Approved; no change required. |
| `sts` | Trace covers complete credential tuple, expiration and provider refresh. Checked cross-account trust/caller permissions, role-chain duration, Regional endpoint use, source identity and session-policy exceptions. Same role-session name can yield the same assumed-role ARN after refresh. | Approved after refresh evidence and policy wording corrections. |
| `waf` | Count-to-enforcement worksheet respects rule ordering and propagation. Rate rules are approximate controls, not exact business quotas. Checked oversize handling and that logging redaction does not automatically protect sampled requests. | Approved; no change required. |
| `privatelink` | Diagnostic worksheet checks service DNS, endpoint interfaces, network controls and request authorization separately. Verified private-DNS prerequisites, endpoint policy limits, provider acceptance and AZ identity considerations. | Approved; no change required. |
| `acm` | Certificate evidence worksheet follows issuance, DNS, integration/Region, served identity and renewal installation. Verified exportable certificates need deployment of renewed material; imported/direct-PCA issuance differs from ACM managed renewal; CloudFront viewer certificates require us-east-1. | Approved; no change required. |
| `private-ca` | Certificate contract distinguishes issuing a private leaf from distributing client trust and enforcing revocation. Checked templates, issuer lifetime, CA replacement versus certificate reissuance, short-lived mode and ACM integration limits. | Approved; made replacement-CA renewal limitation explicit. |
| `glacier` | RestoreRequest JSON is valid SDK/CLI input for an appropriate S3 archived object, not the REST XML body. Checked class-specific restoration, Days as temporary access, Intelligent-Tiering differences, lifecycle transition constraints and legacy vault closure to new customers. | Approved; no change required. |
| `cloudtrail` | Advanced selector example uses Data category, S3 object resource type and object ARN prefix. Checked selection/replacement semantics, management-only Event history, collection gaps, record timestamps and digest validation limits. | Approved; no change required. |
| `cloudwatch` | EMF JSON has the correct root metadata, dimension references and numeric metric. Its timestamp is illustrative; high-cardinality request IDs stay outside dimensions. Verified metric identity, statistics, missing-data behavior, M-of-N alarms and math denominators. | Approved; no change required. |
| `cloudwatch-logs` | Insights query filters the intended request identifier and sorts/limits output; its output limit is not a scan bound. Checked group/class immutability, retention, subscription retry gaps and data-protection history/class support. | Approved after distinguishing supported IA masking from unsupported IA Insights unmask. |

## Substantive corrections

1. API Gateway: labeled the existing PascalCase example as AWS CLI `--cors-configuration` input and added the CLI reference. This prevents copying a valid SDK/CLI structure into a different wire representation.
2. STS: replaced “new session identity” with newly issued credentials. Refresh verification now uses provider behavior and expiration rather than requiring the assumed-role ARN to change. Narrowed session-policy wording to account for direct resource-policy grants.
3. IAM: stated the different same-account evaluation behavior of direct user, role and role-session grants, while retaining applicable explicit-deny precedence.
4. KMS: documented automatic rotation for symmetric AWS_KMS keys, on-demand rotation for symmetric AWS_KMS/EXTERNAL keys, and manual replacement for unsupported types/stores. Distinguished same-key material rotation from creating a replacement key.
5. CloudWatch Logs: current AWS documentation supports data-protection masking in both Standard and Infrequent Access. Logs Insights QL still excludes its `unmask` command for Infrequent Access; `logs:Unmask` permission alone does not enable that unsupported command.
6. EKS: added the current seven-day, previous-minor-version rollback boundary, compatibility prerequisites and distinct treatment of add-ons/data/compute. Added a direct source for the service-account example. This avoids perpetuating obsolete blanket claims that EKS versions cannot roll back.
7. Private CA: made explicit that replacing the issuer CA does not allow ACM to automatically renew an existing certificate through that replacement. New issuance/deployment must be planned.

Two corrections were handed to the parent for the shared older file; the parent confirmed both were applied in `src/serviceDeepDiveCore.ts`:

- KMS `walkthrough.failureMode`: distinguish possessing object-read permission from successfully retrieving an encrypted object when KMS authorization is missing.
- ELB first cost driver: scope capacity-unit billing to Application, Network and Gateway Load Balancers; Classic Load Balancer uses running time and processed data. The parent separately corroborated the KMS read boundary and ELB pricing.

All other reviewed older field notes remain consistent with the checked documentation. Pricing review covered billing dimensions and product distinctions, not a quoted bill estimate or a promise that listed dimensions exhaust every optional feature.

## Verification and limits

- Executed the edited module locally with the provided Node binary and TypeScript stripping: all 19 expected unique service IDs loaded, every source ID resolved and all six JSON examples parsed.
- Semantically checked all examples against the official references, including the YAML fragment and the textual review worksheets. A worksheet is intentionally not a complete deployable policy, stack or manifest.
- No AWS calls, account changes, paid resources or live credentials were used. Parent owns integrated TypeScript/tests, JSON/YAML checks, commit, deployment and release verification.
- Current documentation is time-sensitive, particularly EKS recovery, KMS rotation, Logs class capabilities, certificate workflows and pricing. Region/account support, quotas and actual policy evaluation still require validation for a real deployment. No blanket availability, confidentiality, recovery-time or exact-cost guarantee was added.

## Official pages opened during the independent review

The service sections below list the exact documentation URLs opened and read for this review. Repeated URLs across services are intentional when a boundary applies to both. The additional pricing register records the official pages used to check the older notes' cost claims.

### acm

- [ACM DNS validation and reusable CNAMEs](https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html)
- [ACM managed-renewal eligibility](https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html)
- [Exportable public certificate deployment responsibility](https://docs.aws.amazon.com/acm/latest/userguide/acm-exportable-certificates.html)
- [ACM integrated services and certificate placement](https://docs.aws.amazon.com/acm/latest/userguide/acm-services.html)

### private-ca

- [Private CA validity and hierarchy succession](https://docs.aws.amazon.com/privateca/latest/userguide/ca-lifecycle.html)
- [Private and public certificate service trust boundaries](https://docs.aws.amazon.com/privateca/latest/userguide/service-options.html)
- [Private CA issuance templates and restrictions](https://docs.aws.amazon.com/privateca/latest/userguide/UsingTemplates.html)
- [CRL, OCSP and revocation propagation](https://docs.aws.amazon.com/privateca/latest/userguide/revocation-setup.html)
- [General-purpose and short-lived CA modes](https://docs.aws.amazon.com/privateca/latest/userguide/short-lived-certificates.html)

### glacier

- [S3 storage classes and access characteristics](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html)
- [Archived-object restoration and temporary copies](https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects.html)
- [Lifecycle transition eligibility and cost constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html)
- [RestoreObject tiers, status and object versions](https://docs.aws.amazon.com/AmazonS3/latest/API/API_RestoreObject.html)
- [Standalone Glacier vault service scope](https://docs.aws.amazon.com/amazonglacier/latest/dev/introduction.html)

### cloudtrail

- [CloudTrail Event history scope and limitations](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html)
- [Opt-in data-event coverage](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html)
- [Advanced event selector fields and modes](https://docs.aws.amazon.com/awscloudtrail/latest/APIReference/API_AdvancedEventSelector.html)
- [CloudTrail signed digest integrity validation](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html)
- [CloudTrail record and delivery examples](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-examples.html)

### cloudwatch

- [CloudWatch metric identity and statistics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html)
- [Alarm state, actions and destination verification](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Alarms.html)
- [Alarm missing-data evaluation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarms-and-missing-data.html)
- [Embedded metrics and cardinality costs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html)
- [Embedded metric format JSON specification](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html)
- [Metric math and derived time series](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html)

### cloudwatch-logs

- [Logs Insights QL and bounded query scope](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)
- [Log groups, streams and retention](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html)
- [Sensitive-log masking and historical-event limits](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html)
- [Subscription delivery format and failure behavior](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Subscriptions.html)
- [Log-class feature matrix and immutability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch_Logs_Log_Classes.html)

### eks

- [EKS access entries and Kubernetes permissions](https://docs.aws.amazon.com/eks/latest/userguide/access-entries.html)
- [EKS Pod Identity operation and limitations](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html)
- [Pod service-account configuration and identity checks](https://docs.aws.amazon.com/eks/latest/userguide/pod-id-configure-pods.html)
- [EKS cluster API endpoint access](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html)
- [EKS version update planning and components](https://docs.aws.amazon.com/eks/latest/userguide/update-cluster.html)
- [EKS version rollback eligibility and compute preparation](https://docs.aws.amazon.com/eks/latest/userguide/rollback-cluster.html)

### secrets-manager

- [GetSecretValue versions, caching and permissions](https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html)
- [Secrets retrieval integrations and auditing](https://docs.aws.amazon.com/secretsmanager/latest/userguide/retrieving-secrets.html)
- [Managed and Lambda-based secret rotation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html)
- [Cross-account secret and KMS authorization](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_examples_cross.html)
- [Troubleshooting rotation stages and connectivity](https://docs.aws.amazon.com/secretsmanager/latest/userguide/troubleshoot_rotation.html)

### waf

- [Web ACL association and supported protection](https://docs.aws.amazon.com/waf/latest/developerguide/web-acl.html)
- [WAF testing, tuning and propagation](https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-testing.html)
- [Rate-based rule grouping and evaluation](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based.html)
- [Approximate rate enforcement and configuration changes](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based-caveats.html)
- [WAF logging and separate sampling privacy](https://docs.aws.amazon.com/waf/latest/developerguide/logging.html)
- [Oversize request inspection and handling](https://docs.aws.amazon.com/waf/latest/developerguide/waf-oversize-request-components.html)

### privatelink

- [Interface endpoint prerequisites and interfaces](https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html)
- [Endpoint policy support and authorization limits](https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-access.html)
- [PrivateLink DNS and endpoint access paths](https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-access-aws-services.html)
- [Provider endpoint services and consumer connections](https://docs.aws.amazon.com/vpc/latest/privatelink/create-endpoint-service.html)

### api

- [REST API and HTTP API feature comparison](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)
- [Usage plans, API keys and best-effort quotas](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html)
- [HTTP API JWT authorizers and scopes](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html)
- [HTTP API CORS and preflight behavior](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html)
- [AWS CLI HTTP API CORS input structure](https://docs.aws.amazon.com/cli/latest/reference/apigatewayv2/update-api.html)
- [REST API access and execution logging](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html)

### cloudfront

- [CloudFront cache policies and key identity](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html)
- [Origin request policies and forwarded values](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html)
- [Restricting access to an S3 origin with OAC](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
- [Cache expiration and minimum-TTL behavior](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html)
- [Viewer and origin certificate requirements](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html)

### elb

- [Application Load Balancer target-group model](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html)
- [ALB health checks and fail-open behavior](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html)
- [ALB listener conditions and rule ordering](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-rules.html)
- [Network Load Balancer components and protocols](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html)

### route53

- [Route 53 routing-policy choices](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html)
- [Alias records versus CNAME records](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html)
- [Private hosted-zone precedence and NXDOMAIN](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zone-private-considerations.html)
- [Health-check signals and DNS failover](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html)
- [Record TTL and recursive caching](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-values-basic.html)

### vpc

- [Subnet route associations and destination matching](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-route-tables.html)
- [Security-group rule aggregation and limitations](https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html)
- [Network ACL ordering and stateless behavior](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html)
- [VPC DNS support attributes](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns-updating.html)

### iam

- [IAM request and policy evaluation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html)
- [Permissions boundaries and resource-policy exceptions](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html)
- [IAM Access Analyzer policy validation](https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-policy-validation.html)
- [Third-party access and external IDs](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_third-party.html)

### sts

- [Using temporary AWS credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_use-resources.html)
- [AssumeRole request and permission semantics](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html)
- [Principal-specific resource-policy and boundary evaluation](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html)
- [Source identity and assumed-role audit context](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_control-access_monitor.html)
- [Regional STS interface endpoints](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sts_vpc_endpoint_create.html)

### kms

- [KMS key policies and IAM delegation](https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html)
- [KMS key ownership and control models](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html)
- [Encryption context and authenticated metadata](https://docs.aws.amazon.com/kms/latest/developerguide/encrypt_context.html)
- [Key rotation and ciphertext lifecycle](https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html)

### cognito

- [Cognito user pools and sign-up behavior](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html)
- [Cognito identity pools and AWS credentials](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html)
- [Verifying Cognito JSON web tokens](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html)
- [Revocation and independent JWT verification](https://docs.aws.amazon.com/cognito/latest/developerguide/token-revocation.html)
- [Authorization endpoint, redirects and PKCE](https://docs.aws.amazon.com/cognito/latest/developerguide/authorization-endpoint.html)

### Additional official pricing and charge references

- [EKS pricing](https://aws.amazon.com/eks/pricing/)
- [API Gateway pricing](https://aws.amazon.com/api-gateway/pricing/)
- [CloudFront pricing plans](https://aws.amazon.com/cloudfront/pricing/)
- [CloudFront pay-as-you-go pricing](https://aws.amazon.com/cloudfront/pricing/pay-as-you-go/)
- [ELB pricing by load balancer family](https://aws.amazon.com/elasticloadbalancing/pricing/)
- [Route 53 pricing](https://aws.amazon.com/route53/pricing/)
- [VPC pricing](https://aws.amazon.com/vpc/pricing/)
- [Cognito pricing](https://aws.amazon.com/cognito/pricing/)
- [IAM FAQ and core service charge boundary](https://aws.amazon.com/iam/faqs/)
- [KMS pricing](https://aws.amazon.com/kms/pricing/)
- [Secrets Manager pricing](https://aws.amazon.com/secrets-manager/pricing/)
- [WAF pricing](https://aws.amazon.com/waf/pricing/)
- [PrivateLink pricing](https://aws.amazon.com/privatelink/pricing/)
- [ACM pricing by certificate workflow](https://aws.amazon.com/certificate-manager/pricing/)
- [Private CA pricing](https://aws.amazon.com/private-ca/pricing/)
- [S3 pricing and archive dimensions](https://aws.amazon.com/s3/pricing/)
- [CloudTrail pricing](https://aws.amazon.com/cloudtrail/pricing/)
- [CloudWatch and Logs pricing](https://aws.amazon.com/cloudwatch/pricing/)

The CLI CORS page was initially opened at https://awscli.amazonaws.com/v2/documentation/api/latest/reference/apigatewayv2/update-api.html and redirected to the canonical docs.aws.amazon.com URL listed above.
