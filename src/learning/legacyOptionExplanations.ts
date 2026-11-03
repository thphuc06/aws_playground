import type {ConfigurationKnowledgeCheck} from '../configurationKnowledgeChecks';
import type {codePracticeCases} from '../configurationPractice';
type CodePracticeCheck=(typeof codePracticeCases)[number];
type LegacyCheck={id:string;question:string;choices:string[];answer:number;explanation:string;sourceUrl:string;skillId?:string;snippet?:string;code?:string};

/** Original per-distractor rationales, author-reviewed 2026-11-03 against each frozen check and its source context.
 * Tuples follow the original distractor order BEFORE the correct answer was inserted.
 * Existing prompts, choices, answers, snippets and grading revisions are not changed.
 */
const configurationWrong:Record<string,readonly [string,string,string]>={
 '1.1.1':[
  'A longer synchronous wait preserves the direct availability dependency on fulfillment; it does not create durable asynchronous acceptance.',
  'Repeating the synchronous call keeps the same dependency and can duplicate business effects instead of buffering work safely.',
  'Moving the address changes configuration placement, not the synchronous coupling or ownership of pending fulfillment work.',
 ],
 '1.1.2':[
  'A queue name or label cannot provide a response channel back to the original HTTP request.',
  'A resource policy authorizes access; it does not turn asynchronous consumer output into the waiting browser response.',
  'Retention controls how long messages can remain available, not whether the queue returns the final function result synchronously.',
 ],
 '1.1.3':[
  'A fresh identifier makes each retry look like a new business operation, defeating deduplication of the uncertain original request.',
  'A timeout leaves the commit outcome uncertain. Unlimited retries can duplicate effects and exhaust resources rather than establish correctness.',
  'Removing timeout handling does not guarantee success and leaves the caller without bounded failure or recovery behavior.',
 ],
 '1.1.4':[
  'Additional IAM access cannot supply the event fields that the handler expects from another payload version.',
  'More memory does not repair parsing against the wrong request envelope; the contract mismatch remains.',
  'An empty-object fallback hides malformed or incompatible input and can let invalid data reach business logic.',
 ],
 '1.1.5':[
  'Without the continuation token, the code can repeatedly retrieve the same first page rather than advance through the result set.',
  'Pagination is part of the API response contract; a broader permission does not require the service to return all pages at once.',
  'The success status describes this request. The returned continuation token is separate evidence that more results may remain.',
 ],
 '1.1.6':[
  'Adding consumers changes consumption capacity, not the producer key that determines record placement in the stream.',
  'Retention extends the replay window; it does not redistribute writes concentrated under the same partition key.',
  'Checkpoints track consumer progress. Removing them can cause replay or lost progress without increasing producer write capacity.',
 ],
 '1.1.7':[
  'A status-code string discards the explicit proxy-response structure and the intended JSON business payload.',
  'Base64 encoding has a separate response contract. Encoding ordinary JSON without the matching indicator does not fix its representation.',
  'IAM controls permission, not serialization. Removing the status field is not a substitute for a correctly represented explicit response body.',
 ],
 '1.1.8':[
  'Matching selects an eligible event; target attachment, invocation permission and delivery success still require separate evidence.',
  'A descriptive label cannot repair a disabled rule, missing target permission or unhealthy downstream target.',
  'Duplicate-handling concerns belong to delivery and processing; the rule pattern determines whether the event matches.',
 ],
 '1.1.9':[
  'Generated tests can repeat the same mistaken assumption as generated code, so their origin does not make them independent evidence.',
  'Removing useful repository constraints does not check the implementation against its requirements and can erase important project context.',
  'A confident explanation is not observation of the actual diff, required behavior or failure-path tests.',
 ],
 '1.1.10':[
  'An API method does not grant resource access or establish model availability across Regions; the workload still needs applicable permission.',
  'Logging and model inference are different operations. Permission to record events does not authorize the model call.',
  'This scenario calls Bedrock Runtime directly. AgentCore hosting is not a prerequisite for every Converse request.',
 ],
 '1.2.1':[
  'A public-subnet label does not assign the VPC-attached function a public IP or establish its internet egress path.',
  'The execution role governs API permissions; an allow statement does not configure routing, endpoint connectivity or DNS.',
  'Reserved concurrency limits execution capacity. It does not create a route or permit traffic to the missing destination.',
 ],
 '1.2.2':[
  'Allocation alone does not establish total cost: duration and the actual workload response to the resource setting also matter.',
  'Timeout changes the allowed execution duration, not the CPU allocation or whether the work finishes faster.',
  'The playground duration is a supplied teaching input; it is not a measurement of the production function.',
 ],
 '1.2.3':[
  'Direct synchronous calls, direct asynchronous calls and event-source mappings have different retry owners and failure contracts.',
  'The execution role grants workload permissions; browser retry timing is application/client behavior.',
  'The asynchronous function DLQ contract does not automatically capture every error returned to a synchronous caller.',
 ],
 '1.2.4':[
  'FIFO ordering does not delete a failed record or replace the handler/mapping batch-response contract.',
  'An HTTP-looking success string does not identify failed SQS records under the partial-batch response format.',
  'Removing the DLQ does not stop duplicate delivery or whole-batch retries and removes a planned failure-handling destination.',
 ],
 '1.3.1':[
  'The bucket name does not select lifecycle actions for noncurrent versions or account for retention protections.',
  'A Lambda execution deadline does not expire stored S3 object versions or define their lifecycle policy.',
  'DynamoDB index consistency is unrelated to retention of historical versions in this S3 bucket.',
 ],
 '1.3.2':[
  'Storage price alone ignores whether the store can perform the required reads, atomic updates and transaction behavior.',
  'An API interface does not make different stores share the same query model, consistency or transaction guarantees.',
  'Different applications have different access patterns and constraints; one default database choice cannot establish their requirements.',
 ],
 '1.3.3':[
  'A cache does not universally strengthen read consistency; its documented freshness and access behavior must match the requirement.',
  'Cached data still needs authorization and correct separation of user/resource context before it is returned.',
  'A longer TTL can increase stale-data exposure; its suitability depends on the specific freshness contract.',
 ],
 '1.3.4':[
  'The flag cannot add a consistency mode that GSIs do not support.',
  'Changing Query to Scan does not change the consistency options available for the same GSI.',
  'An index name identifies the resource; its length does not control the index read-consistency model.',
 ],
 '2.1.1':[
  'A user password is not an AWS signing secret, and distributing it to an SDK request is not a federation exchange.',
  'A user-pool token and an AWS temporary access-key set have different formats and purposes; one is not the other.',
  'Public access would bypass the requested scoped authorization rather than provide the authenticated user an appropriate temporary role.',
 ],
 '2.1.2':[
  'A caller can supply plausible-looking decoded claims; their appearance does not verify the issuer or signature.',
  'Token length does not establish a valid signature, expected audience, expiry or authorized scope.',
  'HTTPS protects transport but does not verify that an arbitrary submitted JWT was issued for this API and operation.',
 ],
 '2.1.3':[
  'A comment does not keep committed credentials private; repository history and readers can still expose the secret values.',
  'A user password is not an AWS access-key secret and cannot replace supported credential-provider resolution.',
  'Omitting the Region neither protects the keys nor creates an appropriate identity; it can instead target the wrong configuration.',
 ],
 '2.1.4':[
  'The URL uses the issued signing credentials; it does not renew the role session that produced them.',
  'TLS does not remove expiration or signer-credential checks from a presigned request.',
  'A presigned request delegates bounded access through the signer; it is not a permanent public bucket-policy change.',
 ],
 '2.1.5':[
  'Network reachability establishes a path to the service, not permission for the requested action and resource.',
  'The Console URL is a user interface, not a repair for the SDK API request identity or authorization.',
  'An application/browser API key does not replace the AWS SDK credential and request-authorization mechanisms.',
 ],
 '2.1.6':[
  'Policy attachment order does not turn an applicable explicit deny into an allow.',
  'Policy statements are not votes: additional allows do not cancel an applicable explicit deny.',
  'Naming a resource identifies the permission scope; it does not bypass an applicable deny on that request.',
 ],
 '2.1.7':[
  'A role name is not evidence that its trust policy accepts this caller and the required request conditions.',
  'API Gateway integration deadlines do not determine whether STS authorizes this role-assumption request.',
  'A local success log written before the call does not prove that STS accepted the caller or trust conditions.',
 ],
 '2.2.1':[
  'Encryption of stored database data does not configure the client TLS handshake or validate the network peer certificate.',
  'Removing at-rest encryption weakens a different boundary and does not eliminate the requirement to protect the connection.',
  'A label in a connection string is not TLS configuration or evidence of certificate verification.',
 ],
 '2.2.2':[
  'Disabling hostname checks hides the identity mismatch instead of making the certificate valid for the requested endpoint.',
  'DNS TTL affects cached name resolution, not the subject names signed into the served certificate.',
  'Data-access permissions do not change the endpoint certificate or repair its hostname coverage.',
 ],
 '2.2.3':[
  'Encryption performed by the storage service after receiving data does not meet the stated requirement to encrypt before arrival.',
  'An object prefix changes naming and scope, not whether the uploaded bytes are plaintext.',
  'Base64 is an encoding, not key-based confidentiality protection; it does not meet the encryption requirement.',
 ],
 '2.2.4':[
  'Ordinary logs expose the working plaintext key to a broader access/retention surface and do not provide the intended protected-key recovery design.',
  'The encrypted payload is not a mechanism for reconstructing its missing data key.',
  'A key alias is a reference to a KMS key, not the generated data-key material required for this payload.',
 ],
 '2.2.5':[
  'The public key is intentionally represented in the certificate request; the corresponding private key is the secret to protect.',
  'Subject names describe the requested certificate identity; they are not the private signing/decryption key material.',
  'The public certificate chain helps establish trust and is distinct from the private key that must remain protected.',
 ],
 '2.2.6':[
  'Longer retention extends how long sensitive values remain exposed and does not prevent unnecessary collection.',
  'Encoding the token does not remove its sensitive capability; readers can decode the logged value.',
  'A private log group limits some access but does not establish that every captured payload or credential is necessary.',
 ],
 '2.2.7':[
  'Disabling rotation avoids one symptom by abandoning the intended credential lifecycle instead of fixing how the application receives updates.',
  'Printing both values leaks credentials and does not update the function through a controlled retrieval mechanism.',
  'A string copied into an artifact is a snapshot; it does not automatically follow later secret versions.',
 ],
 '2.3.1':[
  'Loading a browser page does not establish the application role or its permission to invoke the selected inference resource.',
  'An unrelated logging permission does not grant the inference action and resource access needed by this caller.',
  'A diagram label neither selects a verified live model resource nor grants permission to invoke it.',
 ],
 '2.3.2':[
  'The private endpoint defines a connectivity path, not every provider retention, training-use or application telemetry policy.',
  'An icon color provides no evidence about the data sent, who receives it or how it is retained.',
  'DNS selection does not classify sensitive content or decide whether its transfer and later use are approved.',
 ],
 '2.3.3':[
  'Input filtering does not prove that a generated privileged action is valid or authorized for the caller.',
  'Parsing JSON establishes syntax, not allowed operations, resource ownership or permission to execute them.',
  'Untrusted generated output must not replace the trusted caller identity used for authorization.',
 ],
 '2.3.4':[
  'Authentication establishes session identity; permission for each sensitive tool action still needs evaluation.',
  'A natural-language tool description cannot override the application policy that denies an operation.',
  'Sharing a session identifier does not establish per-user data or capability isolation and can mix their contexts.',
 ],
 '2.3.5':[
  'Useful audit evidence does not require plaintext credentials, and indefinite collection increases unnecessary exposure.',
  'Eliminating every observation prevents useful diagnosis; safe metadata can preserve evidence without retaining sensitive payloads.',
  'Moving sensitive text into metric dimensions still exports it and can also create unsuitable metric cardinality.',
 ],
 '3.1.1':[
  'A dependency declaration in the repository does not prove the required compatible files are present in the deployed package.',
  'A green status badge does not identify the artifact contents or prove every runtime dependency was included.',
  'Deployment uses the supplied artifact; it does not automatically import dependencies from the developer laptop.',
 ],
 '3.1.2':[
  'A short tag name does not prevent the tag from moving to different image content.',
  'A separate production build can produce different bytes, so it cannot simply inherit approval for the earlier artifact.',
  'Changing the repository name does not preserve the exact approved image identity without a controlled content reference.',
 ],
 '3.1.3':[
  'The mismatch concerns source and artifact identity, not a loss of the general ability to attach a service role.',
  'A branch can point to a new commit; the shared branch name does not make A and B the same tested revision.',
  'A longer branch name remains a label and does not make its referenced commit immutable.',
 ],
 '3.1.4':[
  'Committing a plaintext secret introduces exposure and does not provide validated gradual configuration rollout or monitoring-based rollback.',
  'Changing DNS names is not the requested configuration-validation and release mechanism.',
  'An image tag without validation or rollout controls does not satisfy the independent configuration-release requirement.',
 ],
 '3.1.5':[
  'SQS long polling affects message receives, not which REST API deployment snapshot an API stage serves.',
  'A method label does not update the deployment associated with the stage.',
  'REST API and HTTP API deployment behavior differ; the selected product and stage configuration determine what is live.',
 ],
 '3.2.1':[
  'Automatically accepting a changed baseline can preserve the missing encryption property as the new expected output.',
  'Synthesis provides a template, not proof of deployed permissions, runtime connectivity or all application behavior.',
  'A canvas image does not assert the required encryption property in the generated template or test the deployment behavior.',
 ],
 '3.2.2':[
  'A fake supplies controlled local behavior; its success is not observation of the real payment integration.',
  'An IAM policy does not change a local fake into a real external call or validate the integration contract.',
  'Mirroring private implementation details can repeat the same mistaken assumptions without checking the required public outcomes.',
 ],
 '3.2.3':[
  'That fixture bypasses the Records envelope and body-string decoding that the SQS handler is meant to exercise.',
  'An API Gateway request envelope has different fields and cannot stand in for the declared SQS boundary.',
  'JavaScript accepting an object does not establish that its structure represents the selected AWS event source.',
 ],
 '3.2.4':[
  'Unqualified latest code can change independently of the version for which test evidence was collected.',
  'A report filename does not select the function version that test clients invoke.',
  'A UI label does not create a Lambda alias or make callers use its qualified function reference.',
 ],
 '3.2.5':[
  'Line coverage records exercised code; it does not establish that required authorization rejections were asserted.',
  'Removing a security requirement changes the acceptance target instead of testing whether the implementation satisfies it.',
  'A larger screenshot does not exercise the missing denial behavior or inspect the generated assertions.',
 ],
 '3.3.1':[
  'A general-purpose image may not implement Lambda runtime requirements or match the selected architecture and dependencies.',
  'An image tag identifies content but does not supply a correct entry point or runtime interface inside it.',
  'A container can still omit dependencies or include incompatible binaries; packaging does not eliminate artifact checks.',
 ],
 '3.3.2':[
  'Registry storage proves image availability, not that the running application is ready to serve requests.',
  'A task description is metadata and does not evaluate container or load-balancer health.',
  'Process existence can precede initialization and dependency readiness, so it is insufficient as a traffic-readiness signal.',
 ],
 '3.3.3':[
  'Creating a change set previews proposed changes; execution is the separate operation that applies them.',
  'A preview does not remove the need to assess replacement, retained data and migration consequences before execution.',
  'The proposed change set neither executes immediately nor guarantees that the eventual update will succeed.',
 ],
 '3.3.4':[
  'The AppSpec target resources and lifecycle-hook contract depend on the selected CodeDeploy compute platform.',
  'Putting a secret in a hook name exposes it and does not repair the platform-specific AppSpec structure.',
  'An alarm threshold controls an operational signal, not which YAML/JSON fields the AppSpec format accepts.',
 ],
 '3.3.5':[
  'Test evidence applies to the artifact actually tested; a new build cannot automatically inherit it.',
  'Additional stages do not guarantee that each consumer receives the same approved artifact.',
  'Approval alone does not restore a missing connection between approved content and the bytes deployed.',
 ],
 '3.3.6':[
  'Combining every rollout strategy does not define the health evidence or decision rule missing from this canary.',
  'A small traffic share still serves real requests and can produce real failures for those users.',
  'Process count alone can miss errors and latency regressions in an application that is technically running.',
 ],
 '3.3.7':[
  'Redeploying a prior code revision does not inherently undo database changes or external business side effects.',
  'CodeDeploy rollback creates a new deployment of a prior revision; it does not reuse the earlier deployment ID.',
  'Recovery still needs accessible artifacts, appropriate permissions and successful deployment/health outcomes.',
 ],
 '3.3.8':[
  'A more descriptive label remains insufficient evidence of the exact source and artifact that were promoted.',
  'Mutable branch/tag references can move, so their names alone do not pin the tested content.',
  'Deleting build evidence removes provenance needed to compare the tested and deployed revisions.',
 ],
 '3.3.9':[
  'A failed deployment is not authority for an AI tool to expand its own provisioning permissions.',
  'Generated infrastructure still needs review of its actual changes, assumptions and permission impact.',
  'An AI summary is not a substitute for observing the deployed revision and its post-release behavior.',
 ],
 '4.1.1':[
  'No database operation occurred, so indexing does not explain the earlier module-import failure.',
  'API throttling is not the stated failure: the function logs identify an import problem before handler execution.',
  'More concurrent environments do not place a missing or incompatible dependency into the deployment artifact.',
 ],
 '4.1.2':[
  'The trace locates time in a database boundary; it does not prove function memory is the cause or the complete remedy.',
  'One observed request is not a latency distribution and cannot establish identical timing for every request.',
  'A slow database subsegment identifies an investigation target, not a specific missing index without query/connection evidence.',
 ],
 '4.1.3':[
  'The stats aggregation produces grouped counts instead of returning every individual matching log line.',
  'The filter selects ERROR and the time bin supplies the grouping; the query does not count every level by request ID.',
  'The query reads existing logs in the selected scope; it does not reconfigure future application log emission.',
 ],
 '4.1.4':[
  'A later missing-artifact message can be a consequence of the earlier build failure rather than its root cause.',
  'An application health URL cannot explain why this revision failed to produce its deployment artifact.',
  'Successful source download establishes only that earlier step, not dependency installation, tests or packaging.',
 ],
 '4.1.5':[
  'The recommendation does not establish root cause, and broad access can conceal the actual identity/resource mismatch.',
  'Hiding the evidence prevents diagnosis without repairing the request or its authorization boundary.',
  'Confidence of wording is not evidence that the caller, action and relevant policies were correctly identified.',
 ],
 '4.2.1':[
  'One repeated success message removes the distinctions needed to locate errors and correlate actual operations.',
  'Credential values are sensitive and unnecessary for request correlation; safe identifiers provide a more appropriate diagnostic link.',
  'Inconsistent field names make cross-service correlation harder even if each service logs an identifier.',
 ],
 '4.2.2':[
  'A prose statement alone does not provide the numeric metric field and matching EMF metadata required for extraction.',
  'A per-request dimension creates many distinct metric identities; it is not required to extract the declared Service dimension.',
  'Declaring a metric names the value to extract; it does not create a numeric observation that is absent from the event.',
 ],
 '4.2.3':[
  'The display name does not define evaluation periods, missing-data behavior or the intended operational response.',
  'Missing data can mean inactivity or missing instrumentation; its interpretation depends on the metric and workload.',
  'A threshold alone omits timing, evaluation and missing-data choices as well as what should happen after the alarm.',
 ],
 '4.2.4':[
  'A shared log-group name does not propagate trace context through the request path.',
  'Service labels describe components; identical labels do not establish that arbitrary operations belong to one trace.',
  'Metric units describe measurements and do not connect distributed trace identities across calls.',
 ],
 '4.2.5':[
  'A process may exist before it can serve traffic, so liveness alone does not satisfy the stated readiness requirement.',
  'Repository documentation is not a live observation of the deployed application health or initialized dependencies.',
  'Sending traffic before the stated initialization requirement is met exposes users to a known unready application.',
 ],
 '4.3.1':[
  'Caller scaling does not establish unlimited database connections or downstream capacity.',
  'Adding callers can intensify connection exhaustion unless concurrency and connection usage are coordinated with the dependency.',
  'Provisioned concurrency pre-initializes function environments; it is not a database connection-pooling mechanism.',
 ],
 '4.3.2':[
  'The configured memory value alone does not measure execution duration, billed usage or error behavior.',
  'A larger resource setting does not establish whether the workload became faster enough to change total cost favorably.',
  'Workloads respond differently to memory/compute changes, so a universal improvement factor is not evidence.',
 ],
 '4.3.3':[
  'Removing message identifiers does not reduce empty receives and can impair correct message tracking.',
  'Retention governs how long messages remain, not how a receive request waits for new work.',
  'Removing idempotency weakens correctness without changing the empty-receive polling behavior.',
 ],
 '4.3.4':[
  'A longer TTL extends reuse of the same insufficiently distinguished entry and can prolong the wrong-user response risk.',
  'A cache does not automatically know or enforce the application ownership policy for arbitrary payloads.',
  'A display name does not add user/context values to the key used to select cached responses.',
 ],
 '4.3.5':[
  'More unrelated function memory does not address the observed throttled data-access operation without supporting evidence.',
  'One successful request does not rule out throttling elsewhere in the workload or time window.',
  'Removing metrics hides the symptom; it does not repair the data-access bottleneck or latency.',
 ],
 '4.3.6':[
  'A generated prediction is a hypothesis; only a measured comparison can establish the actual outcome.',
  'A cache node on a diagram does not demonstrate correct cache behavior or measured performance improvement.',
  'Freshness and other correctness requirements remain part of the acceptance contract even when latency is being optimized.',
 ],
};

// The three frozen code questions have THREE options, hence two distractors each.
const codeWrong:Record<string,readonly [string,string]>={
 serialization:[
  'The original quantity is the numeric JSON value 2, not a quoted string, so this roundtrip preserves its numeric type.',
  'The quantity property exists in the serialized object and is restored by parsing; this snippet does not remove it.',
 ],
 'logs-query':[
  'The selected log groups/time range constrain the query, and limit 20 bounds its returned events; it is not an all-account search.',
  'A Logs Insights query reads and orders existing events; this query neither creates an alarm nor blocks application requests.',
 ],
 'custom-metric':[
  'A unique request-ID dimension creates a distinct metric series for each value instead of a bounded environment aggregation.',
  'A raw email exposes personal information in telemetry and is not an appropriate bounded environment dimension.',
 ],
};

/** Deterministic editorial drift guard, not a cryptographic authenticity or security mechanism. */
export function legacyOptionExplanationFingerprint(check:LegacyCheck):string {
 const text=JSON.stringify([check.id,check.skillId??'',check.question,check.choices,check.answer,check.explanation,check.sourceUrl,check.snippet??check.code??'']);
 let hash=0x811c9dc5;for(let i=0;i<text.length;i++)hash=Math.imul(hash^text.charCodeAt(i),0x01000193)>>>0;
 return text.length+':'+hash.toString(16).padStart(8,'0');
}

export const legacyOptionExplanationFingerprints:{configuration:Record<string,string>;code:Record<string,string>}={
  "configuration": {
    "1.1.1": "795:81f5d60b",
    "1.1.2": "897:385442d4",
    "1.1.3": "743:deb04690",
    "1.1.4": "776:cda1b268",
    "1.1.5": "880:3d11e91e",
    "1.1.6": "797:488081b1",
    "1.1.7": "1054:e4b57046",
    "1.1.8": "742:612045fb",
    "1.1.9": "800:65d0965c",
    "1.1.10": "825:561d2dc4",
    "1.2.1": "787:c2b4d44b",
    "1.2.2": "788:0afc7a79",
    "1.2.3": "818:6a4bcf20",
    "1.2.4": "817:5f1e30cd",
    "1.3.1": "658:ec22d969",
    "1.3.2": "877:d540e4e8",
    "1.3.3": "788:2b42b870",
    "1.3.4": "819:8202a70c",
    "2.1.1": "857:346b6a5e",
    "2.1.2": "791:49a4b370",
    "2.1.3": "820:0f1c592a",
    "2.1.4": "790:aed5c65c",
    "2.1.5": "775:f9c8f954",
    "2.1.6": "745:e96d40e5",
    "2.1.7": "767:cbbc48a7",
    "2.2.1": "777:154a9e8e",
    "2.2.2": "787:aa5b2215",
    "2.2.3": "777:72f45a02",
    "2.2.4": "810:835de1e0",
    "2.2.5": "754:7f900f08",
    "2.2.6": "777:0a2c0240",
    "2.2.7": "801:16dfc478",
    "2.3.1": "769:f1d1dbd5",
    "2.3.2": "845:08034c48",
    "2.3.3": "864:5e7a13a7",
    "2.3.4": "875:064f40ce",
    "2.3.5": "899:ed3db9ba",
    "3.1.1": "769:d601deb0",
    "3.1.2": "783:ce4aba24",
    "3.1.3": "685:22518529",
    "3.1.4": "807:8efeb706",
    "3.1.5": "748:84fbaee5",
    "3.2.1": "780:124bd3be",
    "3.2.2": "793:0a5e6500",
    "3.2.3": "1066:04697bde",
    "3.2.4": "771:1e5cf09d",
    "3.2.5": "753:86fc6fd1",
    "3.3.1": "796:47a26265",
    "3.3.2": "760:7d791501",
    "3.3.3": "799:f5b8528c",
    "3.3.4": "795:0a2197c7",
    "3.3.5": "754:4c57159c",
    "3.3.6": "784:c689593a",
    "3.3.7": "812:59805345",
    "3.3.8": "716:f54e85e7",
    "3.3.9": "817:898cac05",
    "4.1.1": "738:75783f6f",
    "4.1.2": "789:33a5570b",
    "4.1.3": "819:4d88660e",
    "4.1.4": "836:9e3e1897",
    "4.1.5": "854:6f4ea1d2",
    "4.2.1": "834:74fbb07f",
    "4.2.2": "1260:a90c65f1",
    "4.2.3": "835:9d6f2137",
    "4.2.4": "722:1fb10f85",
    "4.2.5": "765:4700c30f",
    "4.3.1": "798:d8e67ef0",
    "4.3.2": "749:9d020623",
    "4.3.3": "779:3d47f676",
    "4.3.4": "835:c2e3e115",
    "4.3.5": "878:a0e9b460",
    "4.3.6": "848:5aa422c1"
  },
  "code": {
    "serialization": "417:00d3dace",
    "logs-query": "498:ed63e638",
    "custom-metric": "703:adbe5def"
  }
}; // Frozen 2026-11-03; updates require editorial review.

function align(check:LegacyCheck,wrong:readonly string[]|undefined,expectedFingerprint:string|undefined):string[] {
 if(!wrong||!expectedFingerprint)throw new Error('No reviewed option explanations for legacy question '+check.id);
 if(!Number.isInteger(check.answer)||check.answer<0||check.answer>=check.choices.length||wrong.length!==check.choices.length-1||legacyOptionExplanationFingerprint(check)!==expectedFingerprint)throw new Error('Legacy question changed; review option explanations before adapting '+check.id);
 return check.choices.map((_,index)=>index===check.answer?check.explanation:wrong[index<check.answer?index:index-1]);
}
export function getConfigurationOptionExplanations(check:ConfigurationKnowledgeCheck):string[] {
 return align(check,configurationWrong[check.skillId],legacyOptionExplanationFingerprints.configuration[check.skillId]);
}
export function getCodeOptionExplanations(check:CodePracticeCheck):string[] {
 return align(check,codeWrong[check.id],legacyOptionExplanationFingerprints.code[check.id]);
}
export const legacyOptionExplanationCoverage={configurationChecks:Object.keys(configurationWrong).length,codeChecks:Object.keys(codeWrong).length,authoredDistractorRationales:Object.values(configurationWrong).reduce((n,items)=>n+items.length,0)+Object.values(codeWrong).reduce((n,items)=>n+items.length,0),reviewed:'2026-11-03'};
