# Security, networking and observability handbook research

Research date: 2026-11-03. This report covers the 19 entries in `src/serviceHandbookSecurityNetwork.ts`: `eks`, `api`, `cloudfront`, `elb`, `route53`, `vpc`, `cognito`, `iam`, `kms`, `secrets-manager`, `sts`, `waf`, `privatelink`, `acm`, `private-ca`, `glacier`, `cloudtrail`, `cloudwatch`, and `cloudwatch-logs`.

The linked AWS documentation was actually opened during this writing pass. The handbooks add original practical explanations, deployment decisions, diagnostic evidence and outcome checks to the existing service field notes. Sources are attached to individual notes and examples, with entry-local IDs. Examples are illustrative JSON, YAML or diagnostic worksheets; they were not submitted to an AWS account. Synthetic identifiers and non-secret metadata are used throughout.

## Findings and corrections that shaped the content

| Service ID | Findings incorporated into the handbook |
| --- | --- |
| `eks` | Separate cluster operator access entries from workload Pod Identity. Existing custom `aws-auth` mappings do not all migrate automatically. A private Kubernetes API endpoint is different from an EKS management interface endpoint. Plan node, add-on and application validation around upgrades; current documentation describes recovery options, so the entry avoids an obsolete blanket statement that control-plane rollback is impossible. |
| `api` | Keep REST API and HTTP API capabilities distinct. A private integration does not make an HTTP API endpoint private. JWT checks and route scopes do not replace application ownership checks. HTTP API CORS handling can override backend CORS headers; an authenticated default route requires attention to preflight. REST API usage keys are not user authentication, and quotas are best effort. |
| `cloudfront` | Distinguish cache-key inputs from origin-forwarded values. A positive minimum TTL can cache responses despite origin cache restrictions. S3 OAC applies to supported bucket origins, not S3 website endpoints, and does not itself authenticate viewers. CloudFront viewer ACM certificates must be in `us-east-1`; origin TLS is a separate relationship. |
| `elb` | Distinguish ALB HTTP routing from NLB transport balancing without an unnecessarily fixed protocol inventory. Evaluate ALB listener rules in priority order. Health checks use a separate request path and are not authorization. An ALB with only unhealthy registered targets can fail open, so failing health is not a security barrier. |
| `route53` | DNS responses and resolver caches do not directly control existing HTTP sessions. Alias records support appropriate apex use cases but do not redirect URLs. A matching private hosted zone without the requested record can return NXDOMAIN instead of falling back to the public zone; applicable Resolver rules can take precedence. Weighted DNS is not an exact per-request traffic ratio. |
| `vpc` | Trace the subnet's actual route-table association and longest-prefix choice, then security groups and ACLs. Security-group allows combine and are stateful; ACLs are ordered and stateless, including return traffic. IPv4 and IPv6 paths require their own consideration. Network reachability does not grant IAM permission, and DNS behavior has documented exceptions to ordinary packet-filter assumptions. |
| `cognito` | User pools issue application tokens; identity pools supply AWS credentials through federation. Verify token signature, issuer, expiry, intended client and token use, then application permissions. Use authorization-code PKCE and controlled callbacks where appropriate. Revocation does not cause a generic offline JWT signature/expiry verifier to reject every previously issued token automatically. |
| `iam` | Explicit denies and policy type interactions matter. A permissions boundary limits permissions and grants none itself; resource-policy behavior depends on the exact principal form, so a universal intersection shortcut is misleading. A `NotPrincipal` deny has a documented boundary interaction. External IDs address a confused-deputy relationship and are not secrets or a replacement for role trust. |
| `kms` | Account/key policy authority and IAM permissions must be evaluated together; an identity policy alone is not a universal key-access grant. Encryption context is non-secret authenticated metadata, logged in relevant operations, with exact matching requirements. Rotation changes key material for future operations without automatically re-encrypting stored data or rotating application data keys. Rotation support depends on key type and origin. |
| `secrets-manager` | Reads default to the current staged version unless another selection is made. Cache freshness affects rotation adoption. Cross-account retrieval needs the appropriate identity, resource and customer-managed KMS permissions; the AWS managed Secrets Manager key is unsuitable for that sharing path. Rotation staging and actual backend credential state must both be diagnosed. Resource-policy modification authority can itself enable escalation. |
| `sts` | Temporary credentials are a complete access-key, secret-key and session-token set with expiration. A new session replaces credentials rather than extending the old tuple. Cross-account assume-role requires the appropriate caller permission and target trust; session policies can narrow effective access. Source identity improves attribution. Regional STS endpoint selection matters when using an interface endpoint. |
| `waf` | Associate the web ACL with the actual supported ingress resource and use Count plus request evidence before blocking. Rate enforcement is approximate and is unsuitable for exact financial/customer quotas. Oversize handling is an explicit decision about partially inspected requests. Log redaction does not automatically cover every sampling or other logging path. Rule propagation is not instantaneous. |
| `privatelink` | Interface endpoints create private network interfaces with their own network and DNS considerations; this is different from gateway endpoints and VPC peering. Endpoint policies are an additional supported boundary, not a substitute for service IAM, and not every service supports them. Provider authorization/acceptance is separate from application access. Compare Availability Zone IDs across accounts rather than assuming matching zone letters. |
| `acm` | Issuance, endpoint association and the certificate actually served are separate evidence points. Retain DNS validation CNAMEs for the eligible renewal workflow. Imported certificates and direct Private CA issuance do not have identical ACM-managed renewal behavior. Exportable public certificates exist; an independently managed server still needs renewed material installed. Region constraints belong to the integration. |
| `private-ca` | Private issuance requires explicit trust distribution to clients and does not create public browser trust. Certificate templates and issuing permissions constrain purpose. Parent lifetime constrains the hierarchy. CRL/OCSP availability does not guarantee that a relying client enforces revocation. Short-lived-mode CAs have integration limitations, including ACM issuance support, so the choice must follow the certificate deployment lifecycle. |
| `glacier` | Separate S3 Glacier storage classes from the legacy vault service, whose current documentation says new customers are no longer accepted. Instant Retrieval reads differ from the restore workflow of Flexible Retrieval and Deep Archive. An S3 archive restore creates temporary access without changing the archived storage class; Intelligent-Tiering archive behavior differs. Deep Archive does not support expedited retrieval. Existing lifecycle rules can retain older transition behavior, so inspect the actual rule rather than assuming current defaults. |
| `cloudtrail` | Event history is limited management-event history for the selected account/Region; it is not a complete data-event archive. Object data events need appropriate selectors. Basic and advanced selector configuration is mutually exclusive. Digest validation detects covered log changes but does not prove that omitted event categories were collected. Delivery metadata and an individual event's timestamp are distinct evidence. |
| `cloudwatch` | Metric identity includes namespace and dimensions. Sparse error metrics and continuously expected heartbeats need different missing-data choices. Match populations and units when deriving rates with metric math. Configure and test the alarm destination separately. EMF examples use a bounded dimension set; a unique request ID remains a log attribute to avoid creating a metric series per request. |
| `cloudwatch-logs` | Plan class, retention, access and structured fields before ingestion. Current documentation supports data-protection masking in both Standard and Infrequent Access, while subscription and other feature support differs by class. A new protection policy does not retroactively mask previously ingested events. `logs:Unmask` is privileged. Subscription delivery has retry/error boundaries rather than an unlimited delivery guarantee. Query row limits do not replace narrowing time and log-group scope. |

## Validation and limits

The author checked all entry-local source references, required section counts and the TypeScript data shape. The parent integration pass also checks supported JSON and YAML examples. This is documentation validation, not live infrastructure testing: actual account policies, permissions, quotas, DNS, TLS presentation, delivery behavior and service configuration must be checked in the target environment.

Pricing amounts, universal performance guarantees and mutable quota tables are intentionally excluded. Regional support and integration capabilities can change, so the handbook links directly to the relevant service documentation and uses an explicit verification date. Diagnostic worksheets are operational checklists, not deployable resource definitions. The EKS YAML includes a separate commented Deployment fragment and is not a complete application deployment.

No unresolved factual blocker was identified during the authoring pass. A separate reviewer is still required to audit these entries and the older field notes; this report does not claim that independent review has already completed.

## Opened primary sources by service

The following list is generated from the handbook's source records so source IDs and URLs stay aligned with the shipped content. Every listed page was opened during the research pass on 2026-11-03.

### `eks`

- `access`: [EKS access entries and Kubernetes permissions](https://docs.aws.amazon.com/eks/latest/userguide/access-entries.html) — opened 2026-11-03.
- `pods`: [EKS Pod Identity operation and limitations](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html) — opened 2026-11-03.
- `endpoint`: [EKS cluster API endpoint access](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) — opened 2026-11-03.
- `upgrades`: [EKS version update planning and components](https://docs.aws.amazon.com/eks/latest/userguide/update-cluster.html) — opened 2026-11-03.

### `api`

- `products`: [REST API and HTTP API feature comparison](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) — opened 2026-11-03.
- `usage`: [Usage plans, API keys and best-effort quotas](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html) — opened 2026-11-03.
- `jwt`: [HTTP API JWT authorizers and scopes](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html) — opened 2026-11-03.
- `cors`: [HTTP API CORS and preflight behavior](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html) — opened 2026-11-03.
- `logging`: [REST API access and execution logging](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html) — opened 2026-11-03.

### `cloudfront`

- `cache`: [CloudFront cache policies and key identity](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html) — opened 2026-11-03.
- `origin`: [Origin request policies and forwarded values](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html) — opened 2026-11-03.
- `oac`: [Restricting access to an S3 origin with OAC](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html) — opened 2026-11-03.
- `ttl`: [Cache expiration and minimum-TTL behavior](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) — opened 2026-11-03.
- `tls`: [Viewer and origin certificate requirements](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html) — opened 2026-11-03.

### `elb`

- `targets`: [Application Load Balancer target-group model](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html) — opened 2026-11-03.
- `health`: [ALB health checks and fail-open behavior](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html) — opened 2026-11-03.
- `rules`: [ALB listener conditions and rule ordering](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-rules.html) — opened 2026-11-03.
- `nlb`: [Network Load Balancer components and protocols](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html) — opened 2026-11-03.

### `route53`

- `routing`: [Route 53 routing-policy choices](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html) — opened 2026-11-03.
- `alias`: [Alias records versus CNAME records](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html) — opened 2026-11-03.
- `private`: [Private hosted-zone precedence and NXDOMAIN](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zone-private-considerations.html) — opened 2026-11-03.
- `health`: [Health-check signals and DNS failover](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html) — opened 2026-11-03.
- `ttl`: [Record TTL and recursive caching](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-values-basic.html) — opened 2026-11-03.

### `vpc`

- `routes`: [Subnet route associations and destination matching](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-route-tables.html) — opened 2026-11-03.
- `groups`: [Security-group rule aggregation and limitations](https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html) — opened 2026-11-03.
- `acl`: [Network ACL ordering and stateless behavior](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html) — opened 2026-11-03.
- `dns`: [VPC DNS support attributes](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns-updating.html) — opened 2026-11-03.

### `cognito`

- `user-pools`: [Cognito user pools and sign-up behavior](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html) — opened 2026-11-03.
- `identity-pools`: [Cognito identity pools and AWS credentials](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html) — opened 2026-11-03.
- `verify`: [Verifying Cognito JSON web tokens](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html) — opened 2026-11-03.
- `revoke`: [Revocation and independent JWT verification](https://docs.aws.amazon.com/cognito/latest/developerguide/token-revocation.html) — opened 2026-11-03.
- `authorize`: [Authorization endpoint, redirects and PKCE](https://docs.aws.amazon.com/cognito/latest/developerguide/authorization-endpoint.html) — opened 2026-11-03.

### `iam`

- `evaluation`: [IAM request and policy evaluation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html) — opened 2026-11-03.
- `boundaries`: [Permissions boundaries and resource-policy exceptions](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) — opened 2026-11-03.
- `validation`: [IAM Access Analyzer policy validation](https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-policy-validation.html) — opened 2026-11-03.
- `trust`: [Third-party access and external IDs](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_third-party.html) — opened 2026-11-03.

### `kms`

- `policy`: [KMS key policies and IAM delegation](https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html) — opened 2026-11-03.
- `concepts`: [KMS key ownership and control models](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html) — opened 2026-11-03.
- `context`: [Encryption context and authenticated metadata](https://docs.aws.amazon.com/kms/latest/developerguide/encrypt_context.html) — opened 2026-11-03.
- `rotation`: [Key rotation and ciphertext lifecycle](https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html) — opened 2026-11-03.

### `secrets-manager`

- `get`: [GetSecretValue versions, caching and permissions](https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html) — opened 2026-11-03.
- `retrieval`: [Secrets retrieval integrations and auditing](https://docs.aws.amazon.com/secretsmanager/latest/userguide/retrieving-secrets.html) — opened 2026-11-03.
- `rotation`: [Managed and Lambda-based secret rotation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html) — opened 2026-11-03.
- `cross`: [Cross-account secret and KMS authorization](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_examples_cross.html) — opened 2026-11-03.
- `troubleshoot`: [Troubleshooting rotation stages and connectivity](https://docs.aws.amazon.com/secretsmanager/latest/userguide/troubleshoot_rotation.html) — opened 2026-11-03.

### `sts`

- `credentials`: [Using temporary AWS credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_use-resources.html) — opened 2026-11-03.
- `assume`: [AssumeRole request and permission semantics](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html) — opened 2026-11-03.
- `identity`: [Source identity and assumed-role audit context](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_control-access_monitor.html) — opened 2026-11-03.
- `endpoint`: [Regional STS interface endpoints](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sts_vpc_endpoint_create.html) — opened 2026-11-03.

### `waf`

- `acl`: [Web ACL association and supported protection](https://docs.aws.amazon.com/waf/latest/developerguide/web-acl.html) — opened 2026-11-03.
- `testing`: [WAF testing, tuning and propagation](https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-testing.html) — opened 2026-11-03.
- `rate`: [Rate-based rule grouping and evaluation](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based.html) — opened 2026-11-03.
- `rate-caveats`: [Approximate rate enforcement and configuration changes](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based-caveats.html) — opened 2026-11-03.
- `logging`: [WAF logging and separate sampling privacy](https://docs.aws.amazon.com/waf/latest/developerguide/logging.html) — opened 2026-11-03.
- `oversize`: [Oversize request inspection and handling](https://docs.aws.amazon.com/waf/latest/developerguide/waf-oversize-request-components.html) — opened 2026-11-03.

### `privatelink`

- `create`: [Interface endpoint prerequisites and interfaces](https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html) — opened 2026-11-03.
- `policy`: [Endpoint policy support and authorization limits](https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-access.html) — opened 2026-11-03.
- `dns`: [PrivateLink DNS and endpoint access paths](https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-access-aws-services.html) — opened 2026-11-03.
- `provider`: [Provider endpoint services and consumer connections](https://docs.aws.amazon.com/vpc/latest/privatelink/create-endpoint-service.html) — opened 2026-11-03.

### `acm`

- `dns`: [ACM DNS validation and reusable CNAMEs](https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html) — opened 2026-11-03.
- `renewal`: [ACM managed-renewal eligibility](https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html) — opened 2026-11-03.
- `export`: [Exportable public certificate deployment responsibility](https://docs.aws.amazon.com/acm/latest/userguide/acm-exportable-certificates.html) — opened 2026-11-03.
- `integrations`: [ACM integrated services and certificate placement](https://docs.aws.amazon.com/acm/latest/userguide/acm-services.html) — opened 2026-11-03.

### `private-ca`

- `lifecycle`: [Private CA validity and hierarchy succession](https://docs.aws.amazon.com/privateca/latest/userguide/ca-lifecycle.html) — opened 2026-11-03.
- `purpose`: [Private and public certificate service trust boundaries](https://docs.aws.amazon.com/privateca/latest/userguide/service-options.html) — opened 2026-11-03.
- `templates`: [Private CA issuance templates and restrictions](https://docs.aws.amazon.com/privateca/latest/userguide/UsingTemplates.html) — opened 2026-11-03.
- `revocation`: [CRL, OCSP and revocation propagation](https://docs.aws.amazon.com/privateca/latest/userguide/revocation-setup.html) — opened 2026-11-03.
- `mode`: [General-purpose and short-lived CA modes](https://docs.aws.amazon.com/privateca/latest/userguide/short-lived-certificates.html) — opened 2026-11-03.

### `glacier`

- `classes`: [S3 storage classes and access characteristics](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html) — opened 2026-11-03.
- `restore`: [Archived-object restoration and temporary copies](https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects.html) — opened 2026-11-03.
- `lifecycle`: [Lifecycle transition eligibility and cost constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html) — opened 2026-11-03.
- `api`: [RestoreObject tiers, status and object versions](https://docs.aws.amazon.com/AmazonS3/latest/API/API_RestoreObject.html) — opened 2026-11-03.
- `legacy`: [Standalone Glacier vault service scope](https://docs.aws.amazon.com/amazonglacier/latest/dev/introduction.html) — opened 2026-11-03.

### `cloudtrail`

- `history`: [CloudTrail Event history scope and limitations](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html) — opened 2026-11-03.
- `data`: [Opt-in data-event coverage](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html) — opened 2026-11-03.
- `selectors`: [Advanced event selector fields and modes](https://docs.aws.amazon.com/awscloudtrail/latest/APIReference/API_AdvancedEventSelector.html) — opened 2026-11-03.
- `integrity`: [CloudTrail signed digest integrity validation](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html) — opened 2026-11-03.
- `records`: [CloudTrail record and delivery examples](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-examples.html) — opened 2026-11-03.

### `cloudwatch`

- `metrics`: [CloudWatch metric identity and statistics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html) — opened 2026-11-03.
- `alarms`: [Alarm state, actions and destination verification](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Alarms.html) — opened 2026-11-03.
- `missing`: [Alarm missing-data evaluation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarms-and-missing-data.html) — opened 2026-11-03.
- `emf`: [Embedded metrics and cardinality costs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html) — opened 2026-11-03.
- `spec`: [Embedded metric format JSON specification](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html) — opened 2026-11-03.
- `math`: [Metric math and derived time series](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html) — opened 2026-11-03.

### `cloudwatch-logs`

- `query`: [Logs Insights QL and bounded query scope](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) — opened 2026-11-03.
- `groups`: [Log groups, streams and retention](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html) — opened 2026-11-03.
- `masking`: [Sensitive-log masking and historical-event limits](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html) — opened 2026-11-03.
- `subscriptions`: [Subscription delivery format and failure behavior](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Subscriptions.html) — opened 2026-11-03.
- `classes`: [Log-class feature matrix and immutability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch_Logs_Log_Classes.html) — opened 2026-11-03.
