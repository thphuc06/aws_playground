import type {StudyQuestion} from './questionTypes';

/** Original scenarios reviewed against the linked primary documentation on 2026-11-03.
 * Author review, not independent certification or a claim of AWS execution.
 * Each question has one primary C03 skill; two different contexts per skill.
 */
type Choice={text:string;explanation:string;correct:boolean};
const yes=(text:string,explanation:string):Choice=>({text,explanation,correct:true});
const no=(text:string,explanation:string):Choice=>({text,explanation,correct:false});
function q(skill:string,variant:'a'|'b',chapter:string,serviceIds:string[],prompt:string,choices:Choice[],explanation:string,sourceUrls:string[],snippet?:string):StudyQuestion {
 const labeled=choices.map((c,i)=>({...c,id:'option-'+(i+1)}));
 const offset=(Number(skill.split('.').at(-1))+(variant==='b'?2:0))%labeled.length;
 const ordered=[...labeled.slice(offset),...labeled.slice(0,offset)];
 const correctOptionIds=labeled.filter(c=>c.correct).map(c=>c.id);
 return {id:`authored-c03-${skill.replaceAll('.','-')}-${variant}`,revision:1,examVersions:['DVA-C03'],skillRefs:[`DVA-C03:${skill}`],chapterIds:[chapter],serviceIds,kind:correctOptionIds.length>1?'multiple-response':'single-choice',prompt,options:ordered.map(({id,text,explanation})=>({id,text,explanation})),correctOptionIds,explanation,sourceUrls,...(snippet?{snippet}:{}),origin:'authored'};
}
const D={
 messaging:'https://docs.aws.amazon.com/decision-guides/latest/decision-guides/sns-or-sqs-or-eventbridge.html',
 workflow:'https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html',
 invoke:'https://docs.aws.amazon.com/lambda/latest/api/API_Invoke.html',
 retry:'https://docs.aws.amazon.com/sdkref/latest/guide/feature-retry-behavior.html',
 proxy:'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html',
 apiVariants:'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html',
 providers:'https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html',
 query:'https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html',
 stream:'https://docs.aws.amazon.com/streams/latest/dev/develop-kcl-consumers-java.html',
 firehose:'https://docs.aws.amazon.com/firehose/latest/dev/data-transformation-failure-handling.html',
 wire:'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.LowLevelAPI.html',
 sqs:'https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html',
 s3Event:'https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html',
 snsScope:'https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering-scope.html',
 specs:'https://kiro.dev/docs/specs/',steering:'https://kiro.dev/docs/steering/',
 converse:'https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html',
 tools:'https://docs.aws.amazon.com/bedrock/latest/userguide/tool-use.html',
 vpc:'https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html',
 endpoint:'https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html',
 image:'https://docs.aws.amazon.com/lambda/latest/dg/images-create.html',
 concurrency:'https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html',
 asyncConfig:'https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-configuring.html',
 destinations:'https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-retain-records.html',
 batch:'https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html',
 filtering:'https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventfiltering.html',
 ttl:'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html',
 restore:'https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects.html',
 rds:'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html',
 search:'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html',
 cacheKey:'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html',
 dax:'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.consistency.html',
 batchWrite:'https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html',
 saml:'https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithSAML.html',
 roleMapping:'https://docs.aws.amazon.com/cognito/latest/developerguide/role-based-access-control.html',
 jwt:'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html',
 sso:'https://docs.aws.amazon.com/sdkref/latest/guide/feature-sso-credentials.html',
 temporary:'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_use-resources.html',
 presign:'https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html',
 signedContent:'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-choosing-signed-urls-cookies.html',
 ecsTask:'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html',
 ecsExecution:'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html',
 s3Permission:'https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-with-s3-policy-actions.html',
 conditions:'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html',
 assume:'https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html',
 tls:'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html',
 clientEncryption:'https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingClientSideEncryption.html',
 bucketPolicy:'https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html',
 acm:'https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html',
 renewal:'https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html',
 dataKeys:'https://docs.aws.amazon.com/kms/latest/developerguide/data-keys.html',
 context:'https://docs.aws.amazon.com/kms/latest/developerguide/encrypt_context.html',
 ssh:'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html',
 csr:'https://docs.aws.amazon.com/privateca/latest/APIReference/API_IssueCertificate.html',
 sensitiveLogs:'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html',
 ecsSecret:'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/secrets-envvar-secrets-manager.html',
 secret:'https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html',
 bedrockIam:'https://docs.aws.amazon.com/bedrock/latest/userguide/security-iam.html',
 privacy:'https://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html',
 quickSecurity:'https://docs.aws.amazon.com/quick/latest/userguide/sec-agentic-security.html',
 guardrail:'https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-use-converse-api.html',
 injection:'https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-injection.html',
 identity:'https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html',
 telemetry:'https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html',
};

const development:StudyQuestion[]=[
 q('1.1.1','a','dev-events',['sns','sqs'],'Billing and analytics must each process every OrderAccepted event and recover independently after an outage. Both currently consume one standard SQS queue. Which redesign best matches this requirement?',[
  yes('Publish to a fan-out topic with a separate queue and consumer for each workload.','Separate queues retain independent pending work; a topic can distribute each publication to both subscriptions.'),
  no('Keep one queue and double the number of consumers for each workload.','More competing consumers divide the queue workload; they do not give every event to each business consumer.'),
  no('Keep one queue and increase visibility timeout until analytics recovers.','Visibility changes when received messages can be seen again, not which independent workloads receive each event.'),
  no('Switch the shared queue to FIFO and use one message group per order.','Ordering groups do not convert competing consumption into independent fan-out.')
 ],'Choose delivery topology from who must receive each logical event; durability and consumer idempotency remain separate concerns.',[D.messaging]),
 q('1.1.1','b','dev-events',['step-functions'],'A checkout process reserves inventory, then charges a payment provider. A permanent payment rejection must release that reservation, and operators need to see which step failed. Which approach most directly expresses this coordination?',[
  yes('Use an explicit workflow with error classification and a compensating release task.','A workflow can represent dependency order and a deliberate recovery action after a failed task.'),
  no('Publish reserve, charge and release requests simultaneously to three subscribers.','Parallel notification does not express that release is conditional on the charge outcome.'),
  no('Put every action behind one long HTTP timeout and rely on disconnect to undo it.','A disconnected caller does not atomically undo remote side effects.'),
  no('Retry the entire checkout unconditionally whenever payment is rejected.','A permanent rejection is not repaired by repetition, which can also duplicate earlier side effects.')
 ],'Compensation is an explicit business action, not automatic database-style rollback across services.',[D.workflow]),
 q('1.1.2','a','dev-lambda',['lambda'],'An application invokes Lambda with InvocationType=Event and receives an acceptance response. The UI immediately marks a document conversion complete. Which change fixes the contract?',[
  yes('Record a pending job and obtain completion from a separate correlated result/status path.','Asynchronous acceptance does not carry the completed function result.'),
  no('Parse the acceptance response body as the converted document.','The asynchronous invocation response is not the function’s business output.'),
  no('Raise the function timeout and continue treating acceptance as completion.','A larger execution deadline does not change what the caller’s acceptance response establishes.'),
  no('Poll the same Invoke request until its original response becomes a result.','A completed acceptance request does not later change its response; design a separate completion mechanism.')
 ],'Represent accepted and completed as different states with one operation identifier.',[D.invoke]),
 q('1.1.2','b','dev-events',['sqs','lambda'],'An engineer says that because the business workflow uses SQS asynchronously, Lambda’s event-source poller invokes the function using the Event asynchronous API and ignores its response. Which explanation is correct?',[
  yes('The SQS event-source mapping polls and invokes the function synchronously; the response affects message handling.','Business-level asynchronous processing and the managed poller’s invocation contract describe different boundaries.'),
  no('The statement is correct, so asynchronous destinations replace SQS batch error handling.','SQS mappings have their own polling/batch contract, not the function’s direct asynchronous queue contract.'),
  no('SQS sends the producer’s HTTP connection through the function and waits for its response.','The producer is decoupled from consumer execution; its connection is not forwarded.'),
  no('The poller deletes every received record before invoking the function.','Receiving a batch is not successful processing; the documented result handling matters.')
 ],'Name the boundary before classifying a call as synchronous or asynchronous.',[D.sqs]),
 q('1.1.3','a','dev-application',['lambda','cli'],'A caller has a two-second deadline. Its application retries a downstream operation three times; each attempt uses an SDK already configured for three attempts. Under throttling, the work continues after the caller gives up. What is the best first repair?',[
  yes('Coordinate the application and SDK attempt budgets under one end-to-end deadline.','Nested retries multiply work; the total budget must account for all layers and their waiting time.'),
  no('Increase both retry counts because the SDK already uses backoff.','Backoff does not prevent a multiplied retry budget from exceeding the caller deadline.'),
  no('Remove only the caller deadline while retaining every retry layer.','That avoids one visible timeout without bounding resource use or meeting the response requirement.'),
  no('Switch every service client to adaptive mode without reviewing resource sharing.','Retry mode has workload-specific behavior and is not a substitute for a total deadline budget.')
 ],'A retry policy must fit the whole request, not merely look reasonable at each layer. SDK version/configuration affects the details.',[D.retry]),
 q('1.1.3','b','dev-events',['step-functions'],'A workflow task reports either TemporaryUnavailable or AccountSuspended. The former may recover; the latter requires an operator. Which TWO changes best express resilient behavior? Select two.',[
  yes('Retry TemporaryUnavailable with bounded attempts and delay.','The declared transient class has a plausible recovery path and still needs a limit.'),
  yes('Catch AccountSuspended and route it to an explicit non-retry resolution path.','The permanent business condition requires handling rather than repeated execution.'),
  no('Use an unlimited retry policy for both errors to preserve workflow continuity.','Repeated permanent failures consume resources without changing the reason for failure.'),
  no('Treat a caught failure as a completed business operation without recording its outcome.','Error handling must preserve the actual outcome, not silently assert success.'),
  no('Retry the earlier successful charge before inspecting the failing task’s error.','Replaying unrelated side effects can introduce duplicates and does not address the classified error.')
 ],'Error classification selects recovery behavior; a catch path is not automatically a success path.',[D.workflow]),
 q('1.1.4','a','dev-application',['api','lambda'],'An API Gateway HTTP API receives JSON bodies. A new requirement says the gateway itself must reject bodies that do not match a request model before Lambda runs. Which proposal correctly identifies the product decision?',[
  yes('Evaluate REST API request validation, or explicitly revise the requirement to validate in application code.','Gateway request-model validation is a product feature; keeping HTTP API with handler validation changes the enforcement boundary.'),
  no('Attach a REST request validator to the existing HTTP API without changing its product.','A REST-only control cannot be assumed available on HTTP API.'),
  no('Enable a JWT authorizer and consider body-schema validation complete.','Token validation does not validate arbitrary application body fields.'),
  no('Set the integration payload version to 2.0 so invalid JSON business objects are rejected.','Payload format controls event/response shape, not the complete business schema.')
 ],'A requirement about where validation happens must be matched to the selected API product.',[D.apiVariants]),
 q('1.1.4','b','dev-application',['api','lambda'],'A Lambda proxy handler detects an invalid quantity but returns the response below. Clients treat the request as successful. Which response contract best repairs this?',[
  yes('Return an explicit client-error status with a serialized safe error body and correlation identifier.','The HTTP status and body should express the actual invalid-input outcome without exposing internals.'),
  no('Keep statusCode 200 and add an error field that every generic client must discover.','That retains a success transport contract and can mislead clients, caches and monitoring.'),
  no('Throw the complete internal exception object so clients see every diagnostic field.','A raw internal exception is not a deliberate, safe public error contract.'),
  no('Return only a correlation identifier and omit all status/body decisions.','A correlation ID is useful evidence but does not itself define invalid-input semantics.')
 ],'For an explicit proxy response, status, headers and the serialized body form one reviewed contract.',[D.proxy],'return { statusCode: 200, body: JSON.stringify({error: "quantity must be positive"}) };'),
 q('1.1.5','a','dev-application',['cli','lambda'],'The SDK reports ResourceNotFound for a table that a developer can see in the console. The diagnostic record shows the SDK client is configured for a different Region. What should be investigated first?',[
  yes('Align the client Region/endpoint and resource identity with the intended environment.','The request is reaching a different resource context; console visibility elsewhere does not prove that target exists there.'),
  no('Add broad table permissions before checking the endpoint.','Permission expansion does not make the intended resource exist in another Region.'),
  no('Retry the unchanged request until regional replication is guaranteed to create the table.','The scenario declares no replication mechanism; retries cannot assume one.'),
  no('Create an empty replacement table in the configured Region and count the next successful request as a completed migration.','That can conceal the wrong environment and omits the required data and deployment-context review.')
 ],'Inspect the actual request configuration and identity before treating every SDK failure as IAM or transient availability.',[D.query,D.providers]),
 q('1.1.5','b','dev-dynamodb',['dynamodb','cli'],'A DynamoDB Query response contains Items: [] and a nonempty LastEvaluatedKey because the page’s items were filtered out. The application is collecting all matching results. What should its SDK loop do?',[
  yes('Continue with the returned key until the pagination contract indicates completion.','An empty filtered page does not imply the underlying query has no subsequent pages.'),
  no('Stop whenever Items is empty, even if a continuation key exists.','That loses matching items that can occur on later pages.'),
  no('Repeat the first request without ExclusiveStartKey and append results.','That revisits the same page instead of progressing.'),
  no('Remove the filter and return all items as equivalent business results.','That changes the requested result set rather than fixing pagination.')
 ],'Use continuation state rather than item count as the termination signal for this operation.',[D.query],'const page = {Items: [], LastEvaluatedKey: {pk: {S:"customer-7"}, sk: {S:"order-100"}}};'),
 q('1.1.6','a','dev-events',['kinesis','dynamodb'],'A custom stream consumer records a checkpoint for sequence S before committing S’s business result. It crashes between those operations and restarts after S. What is the central correctness issue?',[
  yes('The checkpoint claims work is complete before its durable result exists.','Restarting after the advanced position can skip the uncommitted business operation.'),
  no('The stream retention setting guarantees the consumer will automatically reprocess every checkpointed record.','Retained data can support replay, but the consumer’s checkpoint decides its normal restart position.'),
  no('Increasing the number of consumers makes this ordering atomic.','Parallelism does not make an individual checkpoint and external commit one transaction.'),
  no('Changing the partition key after the crash repairs the already advanced checkpoint.','A new producer distribution does not restore the skipped result.')
 ],'Coordinate checkpoint advancement with durable processing and safe replay; the external commit design belongs to the application.',[D.stream]),
 q('1.1.6','b','dev-events',['firehose','lambda','s3'],'A Firehose transformation returns ProcessingFailed for several malformed records. Producers received acceptance responses, but those records are absent from the intended destination. What evidence should the operator inspect next?',[
  yes('The transformation failure output and its associated error records in the configured S3 failure location.','Firehose’s documented transformation-failure path separates these records from successfully transformed delivery.'),
  no('Only the producer’s successful send count, because acceptance proves destination completion.','Acceptance does not prove transformation or destination success.'),
  no('The Kinesis consumer checkpoint even though this is a Firehose transformation case.','That is not the declared failure ownership in this delivery path.'),
  no('All destination rows, then resend the entire input without examining failure evidence.','Blind replay can duplicate successful records and obscures the actual malformed inputs.')
 ],'Locate the failing stage before choosing a replay set and preserve logical record identity during repair.',[D.firehose]),
 q('1.1.7','a','dev-dynamodb',['dynamodb'],'A low-level DynamoDB client receives a Number attribute encoded as a decimal string. The application’s chosen native numeric type cannot exactly represent the supplied identifier. Which handling preserves the contract?',[
  yes('Keep the exact decimal representation or use a suitable arbitrary-precision type before round-tripping it.','The wire format preserves numeric text; lossy native conversion would change the identifier.'),
  no('Convert immediately to the nearest native number and serialize that value.','Rounding changes the data even if the request remains syntactically valid.'),
  no('Remove the Number type descriptor and assume DynamoDB treats the bare JSON number identically.','The low-level AttributeValue contract includes explicit type descriptors.'),
  no('Base64-encode the rounded value to recover the original digits.','Encoding cannot restore information already lost during numeric conversion.')
 ],'Serialization correctness includes exact value preservation, not merely valid JSON.',[D.wire],'{"sequence": {"N": "9007199254740993"}}\n// Assumption: this application uses a numeric type that cannot exactly represent this integer.'),
 q('1.1.7','b','dev-application',['sqs','lambda'],'An SQS handler is being updated for an optional currency field in the application payload. Which TWO tests best check the declared serialization boundary? Select two.',[
  yes('Supply a Records envelope whose body is a JSON string containing the older required fields.','This checks compatibility through the actual nested serialization boundary.'),
  yes('Supply a malformed body string and assert that no business write occurs.','A decoding failure must not be converted into a plausible default business operation.'),
  no('Pass only a top-level application object and claim the SQS envelope parser was tested.','That bypasses the envelope/body decoding boundary.'),
  no('Replace body with an object in every fixture because JSON.parse accepts objects without changing behavior.','The documented body is a string; an object fixture can hide an incorrect decoder.'),
  no('Assert only that JSON.stringify returns a string for any object.','That does not test the handler’s envelope, schema evolution or rejection behavior.')
 ],'Test both envelope decoding and application-schema compatibility; these are different from a generic serializer smoke test.',[D.sqs]),
 q('1.1.8','a','dev-events',['s3','lambda'],'An image processor is triggered by uploads and writes resized images back into the same bucket. The design will retain that bucket. Which TWO coordinated changes prevent its output from matching its input trigger? Select two.',[
  yes('Restrict the notification to the input prefix incoming/.','A prefix-specific notification narrows which object creations trigger the processor.'),
  yes('Write generated images under a separate output prefix such as resized/.','Outputs must remain outside the selected input prefix for that filter to prevent the loop.'),
  no('Increase function timeout so recursive invocations finish sooner.','A longer deadline does not change which object events match.'),
  no('Write outputs under incoming/ but add a display label saying generated.','A display label does not remove the object from the configured prefix match.'),
  no('Grant the function more S3 permissions without changing event selection.','Access permissions do not resolve a trigger that includes its own outputs.')
 ],'The event contract must separate inputs from outputs; these two changes form one consistent same-bucket design.',[D.s3Event]),
 q('1.1.8','b','dev-events',['sns','sqs'],'A subscription filter is intended to select the JSON body field kind=invoice. The publisher sends that field only in the body, with no message attributes. The subscription uses the default filter scope. What is the direct correction?',[
  yes('Set FilterPolicyScope to MessageBody and verify the body-based policy against representative messages.','The default scope evaluates attributes, so it does not read the intended body field.'),
  no('Increase SQS visibility timeout so SNS can discover the body field.','Visibility governs consumer processing, not SNS subscription-filter scope.'),
  no('Nest the filter under a body key while leaving FilterPolicyScope as MessageAttributes.','Changing the filter shape does not change which part of the publication the subscription evaluates.'),
  no('Disable filtering and assert that every delivered message satisfies kind=invoice.','Delivery without the filter does not meet the selection requirement.')
 ],'Match filter scope to the part of the publication containing the field.',[D.snsScope]),
 q('1.1.9','a','layered-testing',['kiro'],'An AI-generated endpoint and its tests both allow user A to edit user B’s record. The spec explicitly forbids cross-user edits, yet the suite passes. What review action best addresses the shared mistake?',[
  yes('Derive an independent ownership-denial test from the spec, observe it fail, then repair the implementation.','The generated implementation and tests share an incorrect acceptance assumption; requirements-based evidence exposes it.'),
  no('Raise the coverage target without changing the expected authorization outcome.','More exercised lines can preserve the same incorrect assertion.'),
  no('Accept the implementation because two generated artifacts agree.','Agreement is not independence when both encode the same misunderstanding.'),
  no('Change the requirement to match the generated test without product approval.','That silently changes the intended access boundary rather than fixing the defect.')
 ],'Review generated artifacts against observable requirements, especially negative and security behavior.',[D.specs]),
 q('1.1.9','b','dev-application',['kiro'],'Kiro is asked to change a package in a monorepo. Its proposal edits an obsolete directory named in old steering guidance, while the current task names the migrated package. Which TWO actions best restore a reviewable workflow? Select two.',[
  yes('Reconcile the steering guidance with the actual package structure and current requirement.','Project guidance should reflect the repository and must not silently override the requested target.'),
  yes('Review the proposed file diff and run the target package’s relevant checks.','The concrete diff and correct package checks establish what was changed and verified.'),
  no('Run only the obsolete package’s tests because they are listed in the old guidance.','Those tests do not establish the intended package behavior.'),
  no('Disable all repository guidance permanently to avoid future inconsistencies.','Removing useful context does not replace correcting the specific stale guidance.'),
  no('Treat completion of generated tasks as proof that the right package was modified.','Task status is not evidence of correct file ownership or behavior.')
 ],'Specifications, repository guidance, actual files and validation targets must describe the same change.',[D.steering,D.specs]),
 q('1.1.10','a','dev-ai-integration',['bedrock','lambda'],'A streaming inference UI appends partial text as it arrives. The connection then fails before the operation completes. The product requires a distinguishable incomplete state. What should the integration do?',[
  yes('Preserve partial output as incomplete and use the stream’s actual completion/error contract to determine final state.','Receiving content is not itself proof of successful completion of the whole operation.'),
  no('Mark the request complete when the first text fragment arrives.','That loses the distinction between partial and completed output.'),
  no('Append a new full retry to the existing text without identifying a new attempt.','That can duplicate or combine unrelated generated output and misrepresent completion.'),
  no('Treat every connection close as successful completion, whether or not the API reported a normal end.','A disconnect can represent failure rather than the API’s normal completion contract.')
 ],'Streaming needs application states for partial, complete and failed outcomes, using the selected API’s response contract.',[D.converse]),
 q('1.1.10','b','dev-ai-integration',['bedrock'],'An application uses client-side model tool use. It receives a request for lookupShipment with a valid JSON shape but an unrecognized shipment identifier. Which action best handles that result?',[
  yes('Validate the identifier and caller access, then return a bounded tool error without inventing shipment data.','A well-formed tool request still needs application validation and authorization.'),
  no('Assume the model already verified existence because it selected a registered tool.','Tool selection is not a repository lookup or authorization decision.'),
  no('Pass the identifier into an unrestricted SQL expression to maximize successful answers.','That promotes untrusted generated data into executable behavior.'),
  no('Fabricate a plausible delivery date so the model can finish its response.','That replaces a known missing-data condition with unsupported business information.')
 ],'In the stated client-side mode, application code owns tool execution and the truthfulness of its returned result.',[D.tools]),
 q('1.2.1','a','security-sensitive-data',['lambda','vpc','privatelink','secrets-manager'],'A VPC-attached function reaches a private database, but requests to Secrets Manager time out. Its identity permission is confirmed for the intended secret. The design uses an interface endpoint without NAT. Which TWO checks target the remaining path? Select two.',[
  yes('Verify private DNS behavior and the VPC DNS prerequisites for the endpoint.','The SDK hostname must resolve through the intended endpoint path.'),
  yes('Verify endpoint security-group traffic from the function and any applicable network ACL path.','Endpoint network access is separate from secret retrieval authorization.'),
  no('Add secretsmanager:* because database connectivity proves every network destination is reachable.','Reaching one private dependency does not establish another endpoint path; the stated permission is already confirmed.'),
  no('Remove the function from its VPC even though the database requires that private connection.','That discards a required dependency path instead of repairing the endpoint.'),
  no('Keep the endpoint rule restricted to the database security group because the function can already reach the database.','The endpoint must allow the actual function traffic; a rule for a different caller does not establish this path.')
 ],'Check the destination’s actual network path after ruling out the stated identity permission issue.',[D.endpoint,D.vpc]),
 q('1.2.1','b','dev-lambda',['lambda','vpc','rds'],'A Lambda function moved from security group old-app to new-app. The database permits its port only from old-app. DNS resolves and the database remains healthy, but new connections from the function time out. What is the most targeted repair?',[
  yes('Review the database inbound rule for new-app and the function’s corresponding outbound path.','The changed source security-group identity is directly relevant to the permitted traffic.'),
  no('Add database read actions to the function execution role and leave network rules unchanged.','API or database authorization cannot create the blocked network connection.'),
  no('Change the database password before checking the connection path.','The stated timeout occurs before an established connection can evaluate that password.'),
  no('Allow the database port from every IPv4 address as the permanent fix.','That expands access beyond the identified application boundary unnecessarily.')
 ],'Use the smallest network rule consistent with the intended caller, and keep authentication verification separate.',[D.vpc]),
 q('1.2.2','a','release-artifacts',['lambda','ecr'],'A team packages a standard web-server image as a Lambda function image. The image starts locally but does not implement the Lambda runtime interface. What remains necessary?',[
  yes('Provide a Lambda-compatible runtime interface and verify image/architecture requirements.','A running general-purpose container is not automatically a valid Lambda function runtime.'),
  no('Set a ZIP-style handler string and assume Lambda rewrites the web server.','The deployment package must implement the required runtime contract itself.'),
  no('Add a conventional HTTP health endpoint and assume Lambda will call it as the function handler.','A web-server health check does not implement Lambda’s runtime invocation protocol.'),
  no('Increase ephemeral storage so Lambda can infer the HTTP application contract.','Storage allocation does not transform the invocation protocol.')
 ],'Packaging changes the delivery format, not the required execution contract.',[D.image]),
 q('1.2.2','b','dev-lambda',['lambda'],'A function has reserved concurrency 10. The team wants faster cold-start behavior and assumes adding provisioned concurrency 10 raises the function’s maximum simultaneous executions to 20. Which statement is correct?',[
  yes('Reserved concurrency still bounds the function; provisioned concurrency pre-initializes capacity rather than adding to that cap.','The two controls address different responsibilities and cannot simply be summed.'),
  no('The maximum becomes 20 because both numbers represent independent request slots.','Provisioned capacity is not additional capacity outside the reserved function limit.'),
  no('Provisioned concurrency replaces the timeout, so pre-initialized requests can execute without a deadline.','Initialization readiness does not remove the function execution-timeout contract.'),
  no('Reserved concurrency controls only cold-start latency and has no upper-bound effect.','Reserved concurrency also limits how far the function can scale.')
 ],'Separate execution capacity limits from initialization latency.',[D.concurrency]),
 q('1.2.3','a','dev-lambda',['lambda','sqs'],'An asynchronous function’s events expire before successful processing. Operators need the invocation record, including request/response context, for a recovery workflow. Which configuration area best matches that evidence requirement?',[
  yes('Review the asynchronous on-failure destination, its permissions and event-age/retry settings.','A destination can retain invocation records; expiration and destination delivery each need review.'),
  no('Use only an SQS source mapping’s batch size, although this function is invoked directly with Event.','A source-mapping setting does not configure the direct asynchronous invocation queue.'),
  no('Assume a function DLQ always includes the same response context as a destination record.','DLQ event content and destination invocation records have different contracts.'),
  no('Raise the synchronous caller timeout to extend every queued event’s maximum age.','The asynchronous queue’s event-age setting is independent of that caller timeout.')
 ],'Choose the failure artifact you actually need, then verify its delivery rather than assuming configuration proves retention.',[D.asyncConfig,D.destinations]),
 q('1.2.3','b','dev-events',['sqs','lambda'],'A FIFO SQS batch contains messages A, B and C from the ordered processing path. A succeeds, B fails, and C has not been processed. Partial batch responses are enabled. What should the handler do to preserve ordering?',[
  yes('Stop after B and report both failed B and unprocessed C in batchItemFailures.','The documented FIFO guidance includes failed and unprocessed messages after the first failure.'),
  no('Process C successfully and report only B because partial responses always remove ordering concerns.','Partial responses do not waive FIFO processing-order requirements.'),
  no('Report only A so the successful item is retried before B.','That misidentifies the failure and does not implement the documented contract.'),
  no('Return an empty failure list while logging B for later manual review.','An empty list would assert successful handling for records that were not successfully processed.')
 ],'Partial-batch logic must respect the source variant; standard-queue examples cannot be copied blindly into FIFO.',[D.batch]),
 q('1.2.4','a','dev-lambda',['lambda','s3','iam'],'An S3 bucket notification references a Lambda function, but invocation is denied. The function’s execution role already allows reading the bucket. Which permission boundary must be reviewed?',[
  yes('The function resource policy allowing the intended S3 source to invoke it.','Permission for S3 to invoke Lambda is distinct from permission for function code to read S3.'),
  no('Only the execution role’s s3:GetObject statement, because it authorizes both directions.','That statement grants downstream object access, not inbound function invocation.'),
  no('The upload client’s ability to assume the function execution role.','The event source invokes the function; the client need not become the function’s workload identity.'),
  no('An InvokeFunction allow on the function execution role, which S3 automatically inherits for notification delivery.','The S3 service caller does not inherit the invoked function’s execution-role permissions.')
 ],'Draw and authorize the inbound invocation and downstream data request as separate arrows.',[D.s3Event]),
 q('1.2.4','b','dev-events',['lambda','sqs'],'A shared SQS queue contains type-A and type-B work. One Lambda event-source mapping filters for type A. The team expects nonmatching type-B messages to remain for a different consumer. What must be reconsidered?',[
  yes('Lambda filtering can remove nonmatching SQS messages; use a routing/queue design that preserves each consumer’s work.','Filtering on this source is not a nondestructive subscription view for another competing consumer.'),
  no('Only the type-B handler’s timeout, because nonmatching messages are guaranteed to wait untouched.','The premise about retaining nonmatching SQS messages is incorrect.'),
  no('Switch the shared queue to FIFO and assume nonmatching records become nondestructive subscription views.','FIFO ordering does not turn Lambda SQS filtering into a separate durable subscription for another consumer.'),
  no('Whether type A has more concurrency; fewer invocations automatically restore removed type-B work.','Concurrency does not undo the filter’s source-specific message handling.')
 ],'Source-specific discard behavior belongs in the integration contract before enabling a filter.',[D.filtering]),
 q('1.3.1','a','dev-data-safety',['dynamodb'],'A session item has a valid TTL timestamp in the past but still appears in DynamoDB. The application must reject the session immediately at expiry. Which TWO actions fit that requirement? Select two.',[
  yes('Enforce the session expiry in the application’s authorization/read path.','Strict access expiry must not wait for asynchronous storage cleanup.'),
  yes('Keep TTL for eventual removal while treating expired-but-present items as expired.','TTL cleanup and the business validity rule can serve complementary purposes.'),
  no('Treat the session as valid until DynamoDB physically removes the item.','That violates the stated immediate expiry requirement.'),
  no('Use a strongly consistent read to force the TTL worker to delete it.','Read consistency does not schedule TTL deletion.'),
  no('Convert the TTL Number to an ISO date string so deletion becomes synchronous.','That does not enable synchronous deletion and does not match the TTL timestamp contract.')
 ],'Data retention and authorization expiry are different clocks.',[D.ttl]),
 q('1.3.1','b','dev-objects',['s3','glacier'],'A Flexible Retrieval object was restored for three days. After that window the user can no longer download the temporary copy and assumes the archive was deleted. What is the correct explanation?',[
  yes('Temporary restored availability expired; the archived object remains unless separately deleted.','Restore duration governs the temporary copy, not automatic deletion of the archival object.'),
  no('Every restore permanently converts Flexible Retrieval objects into Standard objects.','A permanent copy/storage-class change is a separate action.'),
  no('The failed download proves the bucket’s entire lifecycle policy removed every version.','The observation does not establish that independent deletion event.'),
  no('The user can permanently extend availability by reusing the old download response.','A previous response does not preserve a temporary restored copy indefinitely.')
 ],'Communicate restore state and access-window expiry separately from archive retention.',[D.restore]),
 q('1.3.2','a','dev-data-safety',['rds','dynamodb'],'An existing PostgreSQL application relies on multi-table SQL joins and transactions. The team needs a managed database migration with minimal data-access rewrites. Which candidate should be evaluated first?',[
  yes('A compatible managed relational deployment, with engine/version and application behavior verified.','It aligns with the stated relational access contract and migration constraint.'),
  no('DynamoDB solely because it is managed, assuming the SQL joins run unchanged.','Managed operation does not make different query and data models interchangeable.'),
  no('An object bucket solely because it provides durable storage.','Durability alone does not supply the application’s SQL transaction interface.'),
  no('A cache as the only store without defining persistence or transaction semantics.','The proposal has not established the required system-of-record contract.')
 ],'Select from the operations the application depends on, not from the shared adjective managed.',[D.rds]),
 q('1.3.2','b','dev-data-safety',['opensearch','dynamodb'],'A catalog needs full-text search, while its authoritative product update is stored elsewhere. A search index is updated asynchronously. What must the application design make explicit?',[
  yes('The indexing/freshness contract and how failures or stale search results relate to the authoritative record.','A secondary search projection can lag or fail independently of the accepted business write.'),
  no('That a successful source write proves the search index already contains the new document.','The declared asynchronous boundary means those observations are separate.'),
  no('That every search miss should create a replacement authoritative product.','An index miss is not proof the source record does not exist.'),
  no('That making search read-only eliminates all indexing recovery requirements.','Client write permissions do not repair a failed ingestion/update path.')
 ],'Match search to the query requirement while preserving explicit ownership of the underlying business data.',[D.search]),
 q('1.3.3','a','measure-optimize',['cloudfront'],'An origin returns tenant-specific content for the same URL based on a trusted tenant header. CloudFront forwards the header to the origin but omits it from the cache key. What is the important risk?',[
  yes('Requests with different response identities can share a cache entry; revise the cache key or disable caching for that personalized response.','Forwarding a value to the origin and including it in cache identity are different decisions.'),
  no('Forwarding the header automatically makes every cached object tenant-specific.','The cache key determines reuse; forwarding alone does not establish separation.'),
  no('A longer TTL guarantees the cached content belongs to the current tenant.','TTL changes reuse duration, not response identity.'),
  no('Origin authentication alone necessarily re-runs for every cache hit.','A hit can be served at the edge without fetching the personalized response from the origin.')
 ],'Cache keys must distinguish every input that changes reusable response identity, within the chosen access design.',[D.cacheKey]),
 q('1.3.3','b','measure-optimize',['dynamodb'],'A workload sends strongly consistent reads through DAX and expects them all to become cache hits. Measured load on DynamoDB remains. Which explanation matches the documented behavior?',[
  yes('DAX passes strongly consistent reads through to DynamoDB instead of satisfying them from its item cache.','The requested consistency mode does not use the eventually consistent cache-hit path.'),
  no('DAX silently downgrades every strong read to eventual consistency to increase its hit ratio.','That would violate the requested read contract.'),
  no('Increasing cache TTL makes strongly consistent reads independent of DynamoDB.','TTL does not change the documented pass-through behavior.'),
  no('Writing directly to DynamoDB makes later strong reads become DAX cache hits.','The write path does not change the documented pass-through behavior of strongly consistent reads.')
 ],'Evaluate whether the workload’s read semantics can benefit from the proposed cache before claiming a performance gain.',[D.dax]),
 q('1.3.4','a','dev-dynamodb',['dynamodb'],'A Query selects every order for a customer, then filters a non-key status field to keep only pending orders. Few items are returned, but capacity use remains high. What should guide the next design step?',[
  yes('Review an access path whose key condition narrows the required items, such as a suitable index, with its write/cost tradeoffs.','Filtering occurs after reading and is not equivalent to key-based selection.'),
  no('Assume a FilterExpression reduces read capacity in direct proportion to returned items.','Returned-item count does not describe all items read before the filter.'),
  no('Return fewer attributes with ProjectionExpression and assume that reduces the items read for this same query.','Projection changes returned attributes, not the key selection or the capacity calculation for items read.'),
  no('Switch to Scan with the same filter to guarantee fewer reads.','Scanning a broader dataset does not establish a narrower key access pattern.')
 ],'Use KeyConditionExpression and the data/index model to select work; a post-read filter is not an indexing strategy.',[D.query]),
 q('1.3.4','b','dev-dynamodb',['dynamodb'],'BatchWriteItem returns a successful response containing three UnprocessedItems. The importer marks the whole batch complete. Which repair follows the operation contract?',[
  yes('Retry the unprocessed subset with appropriate backoff and retain progress until that subset is resolved.','A successful response can report individual operations that were not processed.'),
  no('Treat HTTP success as proof that every put/delete committed.','That ignores the explicit UnprocessedItems evidence.'),
  no('Replay every successful and unsuccessful operation indefinitely without tracking results.','Unbounded whole-batch replay adds avoidable work and can repeat effects unnecessarily.'),
  no('Convert the response into a transaction success record because every batch is atomic.','BatchWriteItem is not atomic as a whole.')
 ],'Inspect the per-operation result contract even when transport/service status is successful.',[D.batchWrite]),
];

const security:StudyQuestion[]=[
 q('2.1.1','a','security-iam-sts',['sts','iam'],'A company has an approved SAML identity provider and a standard IAM federation role, not an IAM Identity Center managed role. A command-line application receives a valid SAML assertion and needs short-lived AWS signing credentials. Which integration fits?',[
  yes('Use the approved AssumeRoleWithSAML flow with the role/provider trust and consume the returned temporary credentials.','This API exchanges the SAML authentication response for a scoped AWS role session.'),
  no('Put the SAML assertion into AWS_SECRET_ACCESS_KEY and call the resource directly.','An assertion is not an AWS secret access key; the federation exchange produces the signing credentials.'),
  no('Create a permanent IAM user key for each assertion so the application can sign requests.','That discards the intended temporary federation flow and adds unnecessary long-lived credentials.'),
  no('Use a console federation sign-in URL as the SDK service endpoint.','A browser sign-in URL is not a resource API endpoint or SDK credential set.')
 ],'Federated authentication and signed AWS resource access are connected through the documented temporary-session exchange.',[D.saml]),
 q('2.1.1','b','security-cognito',['cognito','iam'],'A Cognito identity pool supports guests and signed-in customers. A review finds the guest role can access customer-private objects and the role trust is not restricted to the intended pool. Which TWO changes address these independent boundaries? Select two.',[
  yes('Reduce the unauthenticated role to the explicitly allowed guest operations/resources.','Guest credentials still carry IAM permissions; their scope must match the guest contract.'),
  yes('Constrain the role trust to the intended identity pool and authentication context.','Trust determines which pool/context can obtain the role; it is separate from the role’s resource permissions.'),
  no('Leave the role policies unchanged and hide the guest button in the web page.','UI visibility is not an authorization boundary for requests made outside that page.'),
  no('Assign the authenticated role to every session because all sessions have an identity ID.','An identity identifier does not establish authenticated customer status.'),
  no('Let the browser submit any desired role ARN after sign-in without validating the mapping.','Client choice cannot replace the approved claim/role mapping and trust controls.')
 ],'Review who can receive a role and what that role can do as separate decisions.',[D.roleMapping]),
 q('2.1.2','a','security-cognito',['api','cognito'],'An HTTP API JWT authorizer verifies the token signature, issuer, audience and expiry. A POST route requires orders.write, but this token has only orders.read. What should the developer conclude?',[
  yes('The token’s identity validity does not satisfy the route’s required authorization scope.','Route scope checks add an authorization requirement after token validation.'),
  no('Any valid token from the expected issuer must be allowed on every route.','Issuer validity does not grant every application operation.'),
  no('Extending token expiry automatically adds the missing orders.write scope.','A longer lifetime does not change the token’s granted scopes.'),
  no('The integration execution role can supply the caller’s missing JWT scope.','The backend workload identity and the API caller’s token authorization are separate boundaries.')
 ],'Validate a token and authorize the requested operation; do not equate those steps.',[D.jwt]),
 q('2.1.2','b','security-cognito',['cognito','api'],'An authenticated user A sends PATCH /profiles/B with body.ownerId=A. The application currently checks only that body.ownerId matches the verified token subject. Which repair actually protects profile ownership?',[
  yes('Resolve the target profile and authorize its owner against the trusted caller before applying the update.','The protected resource is profile B; comparing the caller to a client-controlled body field does not establish ownership of that target.'),
  no('Continue trusting body.ownerId after checking that the request uses HTTPS.','Transport protection does not make a client-supplied ownership assertion authoritative.'),
  no('Allow the request whenever the JWT signature is valid, regardless of the target record.','Valid authentication alone does not authorize editing another user’s profile.'),
  no('Move ownerId from the body into a query parameter and use the same comparison.','Changing the location of client-controlled data does not create an ownership check.')
 ],'The application must bind a verified principal to the actual requested resource, beyond the authorizer’s token checks.',[D.jwt]),
 q('2.1.3','a','security-iam-sts',['cli','iam','sts'],'A developer uses an approved IAM Identity Center profile locally. After the sign-in session expires, new SDK requests cannot obtain credentials. Which response preserves the intended credential model?',[
  yes('Renew the approved sign-in session and confirm the SDK uses the intended supported profile/provider.','The configured federation workflow obtains temporary credentials; session renewal belongs to that workflow.'),
  no('Commit the last returned temporary credential set so the SDK can keep using it indefinitely.','Temporary credentials expire and source control is not a secure credential-refresh mechanism.'),
  no('Pin the last credential snapshot as explicit SDK credentials so the provider never needs to renew again.','A copied snapshot remains temporary and loses the intended provider lifecycle.'),
  no('Disable the credential provider and assume a successful browser login signs every SDK request.','The SDK must resolve usable credentials through its supported provider, not infer them from browser state.')
 ],'Diagnose provider selection and session lifetime before introducing a different long-lived identity.',[D.sso,D.providers]),
 q('2.1.3','b','security-iam-sts',['cli','sts'],'A temporary credential export contains access key ID, secret access key and session token. A local script copies only the first two fields, although the session is still valid. What is missing?',[
  yes('The session token must accompany the temporary access key and secret in the supported credential configuration.','Temporary credentials are a set; omitting the token prevents their proper authentication.'),
  no('A longer session duration, because any tokenless request becomes valid if the session lasts longer.','Lifetime does not remove the token requirement.'),
  no('A session token copied from another role session while retaining this session’s key pair.','The token and key values must belong to the same issued temporary credential set.'),
  no('A fallback to permanent-credential mode using the same temporary access-key pair.','Changing the configuration label does not change the authentication format of issued temporary credentials.')
 ],'Carry the complete credential set without logging or committing its values.',[D.temporary]),
 q('2.1.4','a','dev-objects',['s3'],'An upload portal issues an S3 presigned PUT URL for key uploads/current.pdf. The same still-valid URL is used twice with different file contents. The product expected the first upload to be immutable. Which design assumption is wrong?',[
  yes('A presigned PUT URL is not inherently single-use; the key and upload contract must enforce the intended overwrite/identity behavior.','A reusable signed request to the same key can replace the object; URL expiry alone does not enforce a one-use business rule.'),
  no('HTTPS forces every successful PUT to create a distinct object key.','Transport encryption does not rewrite the request’s object key.'),
  no('The second upload must automatically use the uploader’s username as a new key.','The signed request identifies its target; such an application naming scheme is not automatic.'),
  no('A presigned URL permanently removes the need to review signer permissions.','The request still relies on signer permissions and its other access conditions.')
 ],'Use an intentional authorized key/overwrite strategy rather than treating a time-limited URL as a one-time token.',[D.presign]),
 q('2.1.4','b','dev-objects',['cloudfront'],'A subscriber uses a cookie-capable browser to watch a protected video made of many HLS files. Existing file URLs should remain unchanged. Which CloudFront signed-access mechanism is the most direct fit?',[
  yes('Signed cookies scoped to the intended protected content and access conditions.','Signed cookies can authorize multiple restricted files without modifying every URL.'),
  no('A separate signed URL is mandatory for each segment even when cookies are supported.','Signed URLs are one option, but the stated multi-file and unchanged-URL requirements fit signed cookies.'),
  no('Make the origin public and rely only on obscurity of the playlist URL.','An obscure URL does not implement the requested subscriber access control.'),
  no('Sign only the playlist URL and assume that signature automatically authorizes all separate segment URLs.','A signature on one requested URL does not become signed-cookie authorization for the other restricted files.')
 ],'Choose URL or cookie signing from client support and the scope of content access.',[D.signedContent]),
 q('2.1.5','a','security-iam-sts',['ecs','iam','s3'],'An ECS task pulls its ECR image and writes startup logs successfully. Its application then receives AccessDenied for S3 GetObject. Only executionRoleArn has S3 permission; taskRoleArn lacks it. Which correction targets the application call?',[
  yes('Review the task role’s scoped S3 access; the application does not inherit the agent’s execution-role permissions.','ECS task credentials serve container application calls, while the execution role serves ECS/Fargate agent operations.'),
  no('Add another copy of the same S3 statement only to executionRoleArn.','Repeating a permission on the wrong identity does not grant it to the application task role.'),
  no('Remove taskRoleArn so the task automatically inherits every execution-role permission.','Those role responsibilities are distinct; omitting one is not a documented union mechanism.'),
  no('Assume image-pull success proves every application dependency is authorized.','Startup access is a different operation by a different caller boundary.')
 ],'Interpret execution-role terminology per service rather than importing Lambda’s terminology unchanged into ECS.',[D.ecsTask,D.ecsExecution]),
 q('2.1.5','b','security-iam-sts',['ec2','iam','cli'],'An EC2 application reads instance-role credentials once at startup and stores them as a fixed credential object. Hours later requests fail after expiry, even though the instance can obtain current credentials. What should change?',[
  yes('Use the SDK’s supported refreshing instance-role provider rather than freezing a credential snapshot.','Provider-based resolution can obtain current credentials; a copied static value loses that lifecycle behavior.'),
  no('Increase only request retries while sending the expired credential values unchanged.','Retries do not renew the credential set.'),
  no('Refresh only when the process restarts, even though the requirement is uninterrupted operation across credential expirations.','That leaves the long-running process with expired snapshots between restarts.'),
  no('Assume attaching another resource policy changes the expiry timestamp of the old credential set.','Authorization policies do not extend already issued temporary credentials.')
 ],'Use identity providers as providers, not as one-time sources of values to cache forever.',[D.temporary,D.providers]),
 q('2.1.6','a','security-iam-sts',['iam','s3'],'A policy statement allows s3:GetObject with Resource arn:aws:s3:::example-docs. The request reads example-docs/reports/a.pdf. Other policy restrictions are outside this isolated statement exercise. Why does this statement not grant that object operation?',[
  yes('The statement names the bucket ARN rather than an appropriate object ARN/prefix for GetObject.','S3 action/resource matching distinguishes bucket operations from object operations.'),
  no('The statement must use s3:ListBucket instead because listing grants all object reads.','Listing a bucket and reading an object require different permissions.'),
  no('Every bucket ARN implicitly includes all object ARNs for every action.','That assumption ignores the action-specific resource types.'),
  no('Adding an extra identical GetObject action changes the resource type match.','Repeating the action does not correct its resource scope.')
 ],'Match action and resource type before broadening the permission.',[D.s3Permission],'{"Effect":"Allow","Action":"s3:GetObject","Resource":"arn:aws:s3:::example-docs"}'),
 q('2.1.6','b','security-iam-sts',['iam'],'A statement uses StringLike on aws:PrincipalTag/Team with value Platform*. The trusted request context contains Team=platform-core. What can you conclude about this condition alone?',[
  yes('It does not match because StringLike uses case-sensitive matching.','The wildcard covers the suffix; it does not make Platform and platform equivalent.'),
  no('It matches because every StringLike comparison is case-insensitive.','Case-insensitive equality has a different operator; this is not its behavior.'),
  no('It matches because IAM lowercases every tag value before comparison.','The declared string comparison does not perform that normalization.'),
  no('The condition is ignored whenever the principal is a role session.','A role session does not automatically bypass applicable request-context conditions.')
 ],'Assess the exact condition operator and values; this one statement does not establish the result of a complete account policy evaluation.',[D.conditions],'{"Condition":{"StringLike":{"aws:PrincipalTag/Team":"Platform*"}}}'),
 q('2.1.7','a','security-iam-sts',['sts','iam'],'A role’s identity policy allows only reading a particular table. The caller passes a session policy allowing writes to the same table and expects the session to gain write access. Which statement is correct?',[
  yes('The session policy cannot add permissions beyond those allowed by the role’s identity policy.','For the stated role/session-policy boundary, session permissions are constrained by their intersection.'),
  no('A session policy is newer, so it overrides the role policy by attachment time.','Policy evaluation is not a last-write-wins configuration rule.'),
  no('Writing the exact table ARN in the session policy makes the missing role permission unnecessary.','Resource specificity does not make the session policy a privilege-expansion mechanism.'),
  no('Successful AssumeRole proves every action in the session policy is allowed.','Issuing the session is separate from authorizing each later resource request.')
 ],'Use session policies to scope a session, not to elevate it beyond the assumed role’s permissions.',[D.assume]),
 q('2.1.7','b','security-iam-sts',['sts','iam'],'An application already uses an assumed-role session, then calls AssumeRole for another role with DurationSeconds=7200. The target role allows a 12-hour maximum. Why can this chained request still fail?',[
  yes('Role chaining limits the requested API role session to one hour despite the target role’s larger maximum.','The chaining context imposes an additional duration constraint.'),
  no('The target’s maximum always overrides every role-chaining restriction.','The role maximum is not the only applicable limit.'),
  no('Set the console federation SessionDuration to two hours while leaving the chained AssumeRole API request unchanged.','Console sign-in duration and the AssumeRole API duration are separate parameters; this does not repair the failing chained API request.'),
  no('Adding the target role’s own ARN to the session policy extends the requested duration.','Permission policy content does not change the chaining duration rule.')
 ],'Evaluate session duration using both the operation and the actual caller context.',[D.assume]),
 q('2.2.1','a','security-sensitive-data',['rds','acm'],'A database client encrypts its RDS connection but has server-certificate verification disabled. The requirement includes proving that it reached the intended database endpoint. Which change addresses the missing property?',[
  yes('Configure the appropriate CA trust and server-identity verification for the selected database client/engine.','Encryption and verification of the peer identity are separate TLS properties that must both meet the requirement.'),
  no('Enable only storage encryption on the database and leave the TLS client unchanged.','Encryption at rest does not verify the network peer.'),
  no('Increase database connection timeout to allow the client to infer the certificate name.','Waiting longer does not enable certificate validation.'),
  no('Treat successful TCP connection establishment as proof of the server’s certificate identity.','A connected socket alone does not establish the required TLS identity verification.')
 ],'Verify the intended server identity rather than equating any encrypted channel with the correct peer.',[D.tls]),
 q('2.2.1','b','security-sensitive-data',['s3','iam'],'An application’s S3 data is encrypted at rest. A review still finds a direct application client configured to send HTTP requests. The policy requires rejecting non-TLS application access. What must be added or corrected?',[
  yes('Use HTTPS in the client and enforce the intended secure-transport condition in the applicable access policy.','Transport and storage encryption protect different boundaries; the access rule must match the stated direct-client scope.'),
  no('Leave HTTP enabled because encryption at rest also encrypts every request in transit.','Storage encryption does not encrypt the connection used to send or retrieve data.'),
  no('Switch only from SSE-S3 to SSE-KMS while keeping the same HTTP request path.','Changing the at-rest key-management mechanism does not enable TLS on that connection.'),
  no('Rotate the storage KMS key as the only change to the HTTP client’s transport.','Key rotation does not change the HTTP/TLS request path.')
 ],'Test both an allowed TLS request and a denied non-TLS control request within the selected policy scope.',[D.bucketPolicy]),
 q('2.2.2','a','security-sensitive-data',['acm','cloudfront'],'A CloudFront distribution serves a custom viewer hostname. The team requested the correct ACM certificate in us-west-2 because the origin is there, but cannot use it as the distribution’s viewer certificate. What should be reviewed?',[
  yes('Request or import the viewer certificate in us-east-1 and meet the documented name/validation requirements.','CloudFront’s ACM viewer-certificate Region requirement is distinct from the origin’s location.'),
  no('Move the origin to us-east-1 and assume the existing certificate changes Region automatically.','Moving an origin does not relocate a Regional certificate resource.'),
  no('Attach the us-west-2 certificate to the origin load balancer and assume that makes its ARN eligible at the viewer boundary.','Origin TLS configuration does not remove CloudFront’s viewer-certificate placement requirement.'),
  no('Grant the origin an ACM wildcard policy and assume Region compatibility is bypassed.','IAM permission does not remove the documented integration requirement.')
 ],'Match a certificate to its consuming TLS boundary, not just to a nearby workload Region.',[D.acm]),
 q('2.2.2','b','security-sensitive-data',['acm','elb'],'A third-party certificate was imported into ACM and attached to a load balancer. It is nearing expiry. The team expects ACM managed renewal to replace it automatically. What responsibility remains?',[
  yes('Arrange renewal with the issuer and the supported replacement/import process, then verify the endpoint.','Imported certificates are not eligible for ACM managed renewal.'),
  no('Wait until expiry because association with a load balancer makes every imported certificate eligible.','Service association does not remove the imported-certificate exception.'),
  no('Renew the third-party certificate only at the issuer and assume the existing ACM import fetches the new material automatically.','The imported-certificate lifecycle still needs the supported replacement/import step.'),
  no('Remove hostname verification from clients so the same expired certificate counts as renewed.','Bypassing validation does not renew the certificate or meet the security requirement.')
 ],'Determine renewal ownership from issuance type, not only from the existence of an ACM record.',[D.renewal]),
 q('2.2.3','a','security-kms',['s3','kms'],'A publisher changes from server-side-only encryption to client-side encryption before uploading objects. A downstream worker previously read plaintext with an ordinary S3 GET and has no application decryption path. Which integration change must be planned?',[
  yes('Give the authorized worker an appropriate client-side decryption/key-management path and validate that new data contract.','S3 stores the client-encrypted object; server-side handling alone does not remove the application’s encryption layer.'),
  no('Assume S3 automatically recognizes and decrypts arbitrary client-side ciphertext on every ordinary GET.','The client-side encryption layer belongs to the client/application contract.'),
  no('Keep an ordinary GET and assume permission for server-side KMS decryption also removes the client encryption layer.','The application encryption layer requires its own compatible decryption operation and key access.'),
  no('Remove the encryption metadata and key references to preserve the old worker interface.','Discarding necessary decryption context can make authorized recovery impossible.')
 ],'Changing where plaintext exists also changes which components need an explicit decryption responsibility.',[D.clientEncryption]),
 q('2.2.3','b','security-kms',['kms','s3'],'An application must encrypt a large file before upload. A proposed design sends the whole file as the plaintext of a KMS Encrypt operation. Which design better matches envelope encryption?',[
  yes('Use a data key to encrypt the file in the client and protect/store the encrypted data-key copy with required metadata.','Data keys are intended for encryption outside KMS, including large amounts of data.'),
  no('Split the file into arbitrary KMS requests and discard ordering and encryption metadata.','That is not a complete authenticated file-encryption and recovery design.'),
  no('Store the plaintext data key beside the ciphertext so readers never need authorization.','Exposing the key with the data defeats the intended protection.'),
  no('Base64-encode the file and treat the resulting larger plaintext as cryptographic encryption.','Encoding is reversible without a key and does not meet the encryption requirement.')
 ],'Use an appropriate encryption client/library and preserve the data/key relationship; KMS does not encrypt bulk content with data keys on the application’s behalf.',[D.dataKeys]),
 q('2.2.4','a','security-kms',['kms'],'An application encrypted data with a symmetric KMS key and encryption context {project: P7}. Decrypt uses {project: p7}, and the operation fails. Permissions and the key are otherwise correct for this exercise. What should be checked?',[
  yes('Supply the same encryption context used during encryption, including the intended key/value spelling.','The context is authenticated additional data bound to the ciphertext; a changed value is not equivalent.'),
  no('Add broader kms:Decrypt permissions so any context value is accepted.','Permission breadth does not change the cryptographic binding.'),
  no('Remove the encryption context from every decrypt request without checking the encryption operation.','Omitting required authenticated context does not reproduce the original context.'),
  no('Put a password into the context to prove the caller knows a secret.','Encryption context is nonsecret metadata, not a password field.')
 ],'Maintain the exact nonsecret context contract and keep sensitive values out of it.',[D.context]),
 q('2.2.4','b','security-kms',['kms'],'GenerateDataKey returns a plaintext key and an encrypted copy. An application uses the plaintext key to encrypt a document. Which TWO lifecycle actions support later authorized decryption without unnecessarily retaining plaintext key material? Select two.',[
  yes('Store the encrypted data-key copy with the ciphertext and required encryption metadata.','That preserves the protected key material needed to recover the document later.'),
  yes('Remove plaintext key material from application memory when no longer needed, using the selected library’s safe handling.','The plaintext key is useful for the operation but should not become a persistent log or configuration secret.'),
  no('Discard the encrypted copy because KMS automatically tracks every data key by document name.','KMS does not store or track the application’s data keys that way.'),
  no('Log the plaintext key to make future incident recovery easier.','Logs would expose the key and expand its access/retention surface.'),
  no('Store only a KMS key alias and assume it reconstructs the unique data key.','A wrapping-key reference is not the generated data key required to decrypt this document.')
 ],'Retain protected recovery material while minimizing the lifetime and exposure of the working plaintext key.',[D.dataKeys]),
 q('2.2.5','a','security-sensitive-data',['ec2'],'A developer loses the private SSH key for a Linux EC2 development instance. The public key remains installed. Which response respects the key-pair model?',[
  yes('Use an approved access/recovery method to install a new authorized public key and secure its corresponding private key.','The public key does not let the developer recover the lost private key; access recovery requires an authorized path.'),
  no('Download the original private key again from the public key stored on the instance.','The public key is not a reversible copy of the private key.'),
  no('Broaden the security group to every address so SSH no longer requires the private key.','Network reachability does not replace SSH authentication.'),
  no('Rename a newly generated key pair to the old name and assume the installed public key changes.','Matching names do not make different cryptographic key material equivalent.')
 ],'Recover access deliberately; changing connectivity or labels does not recover a private key.',[D.ssh]),
 q('2.2.5','b','security-sensitive-data',['private-ca','acm'],'A development tool generates a private key and a CSR for an internal TLS identity. It is preparing an AWS Private CA IssueCertificate request. Which TWO checks belong at this boundary? Select two.',[
  yes('Submit the CSR in the Csr parameter and retain the corresponding private key securely at its intended owner.','The API takes a certificate signing request, not a replacement for secure private-key custody.'),
  yes('Review the requested identity names and the certificate/template/CA compatibility before relying on the issued identity.','Issuance must describe the intended identity and supported certificate requirements.'),
  no('Place the private-key PEM into Csr because private keys contain all public information.','That is the wrong request artifact and exposes secret material unnecessarily.'),
  no('Assume certificate issuance automatically adds the CA to every client’s trust store.','Client trust configuration is a separate deployment responsibility.'),
  no('Treat the returned certificate ARN as the private key to install in the TLS server.','An ARN identifies the certificate resource; it is not cryptographic private-key material.')
 ],'Keep request artifact, issued certificate, private key and relying-client trust as distinct objects.',[D.csr]),
 q('2.2.6','a','security-sensitive-data',['lambda','cloudwatch-logs'],'A request handler normally redacts an access token, but its exception handler logs the entire request object. Which TWO changes close the actual exposure path? Select two.',[
  yes('Use an allowlisted safe error event rather than serializing the full request in the exception path.','The failing path must obey the same data-minimization contract as the normal path.'),
  yes('Test success and failure paths with synthetic secret markers and inspect captured telemetry.','Negative-path tests can expose leaks that a normal-path-only test misses.'),
  no('Increase log retention so the exposed token becomes easier to investigate.','Longer retention extends exposure without preventing collection.'),
  no('Rely only on encryption at rest and keep every developer’s log access unchanged.','Storage encryption does not remove sensitive content from authorized readers’ logs.'),
  no('Redact the token only in the browser log viewer while continuing to export the raw exception event.','The collection/export path still carries the secret even if one display hides it.')
 ],'Review every telemetry path, including exceptions, and retain useful safe identifiers instead of secrets.',[D.sensitiveLogs]),
 q('2.2.6','b','security-sensitive-data',['api','lambda'],'An account endpoint returns an internal database record containing displayName, passwordHash and internalRiskNotes. Only displayName is in the public response contract. Which response design is best?',[
  yes('Construct an explicit response object containing only approved public fields.','An allowlisted data-transfer object prevents accidental exposure when internal records gain new fields.'),
  no('Serialize the whole record because HTTPS authorizes every field for the client.','Transport encryption does not determine which data the caller should receive.'),
  no('Hide the sensitive fields in the browser after returning them over the network.','The client already received the fields; UI hiding does not undo disclosure.'),
  no('Base64-encode passwordHash and internalRiskNotes and return them as debug metadata.','Encoding does not remove their sensitive meaning or authorize disclosure.')
 ],'Validate output scope as deliberately as input scope; internal storage shape is not a public API contract.',[D.proxy,D.privacy]),
 q('2.2.7','a','security-sensitive-data',['ecs','secrets-manager'],'An ECS service injects a Secrets Manager value as an environment variable when containers start. The secret rotates successfully, but existing tasks continue using the old value. What is the expected recovery consideration?',[
  yes('Launch fresh tasks through the supported service deployment flow, or separately design runtime retrieval/refresh.','Startup injection does not automatically replace environment-variable values in already running containers.'),
  no('Assume every environment variable changes instantly whenever its referenced secret rotates.','The documented injection point is container startup.'),
  no('Reopen the database connection pool using the unchanged environment value and assume it now contains the rotated secret.','Reusing the same old process value does not fetch or inject the new secret version.'),
  no('Grant the task execution role the same permission again and assume its old environment value is replaced.','Permission to retrieve a value is different from refreshing an already injected value.')
 ],'The secret delivery mechanism determines how the application receives a new version.',[D.ecsSecret]),
 q('2.2.7','b','security-sensitive-data',['secrets-manager','kms','lambda'],'A runtime calls GetSecretValue for an intended secret encrypted with a customer-managed KMS key. Its identity allows GetSecretValue, but the relevant decrypt authorization is absent. Which permission chain should be reviewed?',[
  yes('Secret retrieval authorization and the necessary kms:Decrypt access to the actual encryption key.','Retrieving a customer-key-encrypted secret can require both service retrieval and key-use authorization.'),
  no('Only secretsmanager:ListSecrets, because discovering the secret automatically grants decryption.','Listing metadata is not retrieval or cryptographic permission.'),
  no('Only a larger local cache TTL, because cached secret references decrypt themselves.','A reference or cache policy does not grant missing key access.'),
  no('A plaintext copy of the secret committed to the deployment package to bypass the missing permission.','That introduces an exposed secret instead of repairing the authorized retrieval path.')
 ],'Identify the secret and key involved in the actual request, then scope the necessary access rather than granting unrelated broad permissions.',[D.secret]),
 q('2.3.1','a','security-ai-controls',['bedrock','iam'],'A workload successfully calls Converse on an approved resource. After changing to ConverseStream, it receives an authorization failure. Its policy allows bedrock:InvokeModel but not the streaming invocation action. Which change should be reviewed?',[
  yes('Scoped permission for bedrock:InvokeModelWithResponseStream on the intended supported inference resource.','ConverseStream requires the streaming invocation permission; nonstreaming access alone does not supply it.'),
  no('Only a longer response timeout, because streaming never changes the required action.','A timeout does not authorize the distinct streaming action.'),
  no('Permission to create an AgentCore runtime even though this remains a direct Bedrock call.','Runtime creation is not the invocation permission for this direct integration.'),
  no('Model logging permission as a substitute for model invocation permission.','Recording an invocation and being allowed to invoke a model are different operations.')
 ],'Match the IAM action to the actual inference API, then review its resource scope and other applicable controls.',[D.converse]),
 q('2.3.1','b','security-ai-controls',['bedrock','iam'],'An organization approved models A and B. A workload role is scoped to A, but a configuration update selects B. B is available in the intended Region. What does organizational approval and availability establish?',[
  yes('They do not establish that this workload role is authorized to invoke B; inspect the request’s actual resource/action policy context.','Approval and availability are prerequisites distinct from effective IAM permission for the selected caller.'),
  no('Approval automatically rewrites every workload policy to allow both models.','A governance decision is not itself a policy mutation.'),
  no('Availability means every authenticated account principal can invoke B.','A service offering being available does not grant each principal access.'),
  no('A successful earlier call to A proves B uses the same authorization decision.','The target resource changed and must be evaluated in the actual request context.')
 ],'Identify caller, action and selected inference resource rather than inferring access from a catalog or prior successful model.',[D.bedrockIam]),
 q('2.3.2','a','security-ai-controls',['bedrock','privatelink','vpc'],'An AI integration uses a private network endpoint. A review claims this alone proves prompts are never stored in application logs and all data-use requirements are met. Which TWO additional reviews are necessary? Select two.',[
  yes('Review which sensitive fields the application actually sends and whether they are required and approved.','Private transport does not minimize or authorize the contents of a request.'),
  yes('Review applicable service/data-use settings and application logging, destinations, access and retention.','The network route does not establish storage or telemetry handling across those boundaries.'),
  no('Skip payload review because a private IP address makes every input non-sensitive.','Sensitivity is a property of the data and use, not the address type.'),
  no('Infer that all downstream providers and destinations have identical retention rules.','A private route is not evidence about every separate data-handling contract.'),
  no('Disable TLS verification because private connectivity establishes all peer identity requirements.','Private networking does not replace the required transport authentication controls.')
 ],'Privacy analysis includes content, authorized recipients and persistence, in addition to connectivity.',[D.privacy,D.endpoint]),
 q('2.3.2','b','security-ai-controls',['quick','iam'],'A Quick-connected workflow is proposed to summarize a restricted personnel document for a general team. The connector can technically retrieve it using a service account. What must be established before using that document in the result?',[
  yes('The request’s authorized data scope and intended audience permit that document and the resulting disclosure.','Technical connector reachability is not a sufficient user/audience authorization decision.'),
  no('A service account can fetch it, so every requester may receive its contents.','Connector privileges must not be treated as universal user permission.'),
  no('Adding a source citation grants the general team access to the restricted material.','Attribution is not authorization to disclose the content.'),
  no('Removing the file’s name from the answer makes all of its sensitive facts safe to publish.','Hiding an identifier does not necessarily remove sensitive information from the answer.')
 ],'Grounding an answer in a source and having authority to disclose that source’s information are different requirements.',[D.quickSecurity,D.privacy]),
 q('2.3.3','a','security-ai-controls',['bedrock'],'A team created and reviewed a Bedrock guardrail, but its Converse calls omit guardrail configuration. The release claims the reviewed guardrail is enforcing the interaction. Which TWO checks directly test that claim? Select two.',[
  yes('Verify each intended inference path supplies the correct guardrail identifier/version and assessment scope.','Creating a resource is different from attaching it to the actual requests and selected content.'),
  yes('Test representative allowed and disallowed content and inspect the actual intervention/result handling.','Behavioral evidence must cover both enforcement and the application’s response to it.'),
  no('Treat the guardrail’s existence in the account as automatic attachment to every Converse request.','The request configuration still determines use in this API path.'),
  no('Test only an unrelated model endpoint and assume the production request uses the same configuration.','Evidence must correspond to the actual path being released.'),
  no('Remove error handling because filtered output is guaranteed to have the normal successful business shape.','The application must handle the actual intervention/outcome contract deliberately.')
 ],'Verify the control at its enforcement point and the behavior that follows, not only its configuration inventory entry.',[D.guardrail]),
 q('2.3.3','b','dev-ai-integration',['bedrock','lambda'],'A model returns syntactically valid JSON for an application action. The object contains a valid-looking accountId but an unsupported action value and a resource owned by another user. Which validation is still required?',[
  yes('Validate the allowed action schema and authorize the actual resource against trusted caller context.','JSON syntax does not establish permitted enum values, ownership or operation permission.'),
  no('Execute it because the JSON parser succeeded and the field names look correct.','Parsing establishes structure at one level, not the full business/security contract.'),
  no('Ask the model to promise the action is safe and use that promise as authorization.','A generated assurance cannot replace deterministic access checks.'),
  no('Remove accountId from the log but still execute the unsupported cross-user action.','Telemetry minimization does not repair the invalid or unauthorized operation.')
 ],'Output controls must cover semantics and authority as well as formatting.',[D.tools,D.injection]),
 q('2.3.4','a','security-ai-controls',['agentcore','bedrock'],'A user approves an agent’s proposed transfer of a report to project A. Before execution, another planning step changes the destination to project B but retains the approval flag. What should the execution boundary do?',[
  yes('Reject the changed action under that approval and require approval for the actual authorized payload.','Approval must bind to the reviewed operation and destination, not merely to a mutable boolean.'),
  no('Execute because any approval in the session authorizes all future tool arguments.','A session-level flag does not preserve the scope of the reviewed action.'),
  no('Let the model decide whether the two project names are close enough to share approval.','The model’s judgment is not an authorization binding for a changed destination.'),
  no('Hide the destination in the audit record so the existing approval appears consistent.','Removing evidence conceals the mismatch without making the action authorized.')
 ],'This is an application approval contract: validate the exact action at execution and keep it tied to trusted identity and permission.',[D.tools,D.identity]),
 q('2.3.4','b','security-ai-controls',['agentcore','iam'],'An agent API accepts a client-supplied conversationId. User B submits the identifier of user A’s memory/session and asks to continue it. Which TWO controls address this boundary? Select two.',[
  yes('Check session/memory ownership against the authenticated server-side caller before reading it.','A client-provided identifier does not establish the right to that session’s data.'),
  yes('Test cross-user session reuse and ensure it reveals neither prior content nor tool credentials.','An isolation test must cover both contextual data and capabilities associated with the session.'),
  no('Trust any conversationId whose format matches the expected UUID pattern.','Format validation does not establish ownership.'),
  no('Ask the model to infer the owner from the conversation’s natural-language content.','Identity must come from the trusted authentication context, not generated interpretation.'),
  no('Use one shared privileged outbound credential and assume session names isolate all tool access.','Session labels alone do not constrain downstream credential authority.')
 ],'Session isolation and outbound tool authority need explicit application controls even when platform components provide supporting mechanisms.',[D.identity,D.injection]),
 q('2.3.5','a','security-ai-controls',['bedrock','cloudwatch-logs','s3'],'An operator enables model invocation logging to investigate latency. The destination may now receive supported request/response content, including confidential prompts. Which TWO checks belong before treating the change as routine metrics collection? Select two.',[
  yes('Review the actual content captured and select only the logging needed for the approved investigation.','Model invocation logging can include more than timing metadata.'),
  yes('Review destination access, encryption and retention alongside the data’s sensitivity.','Collecting sensitive payloads creates a separate stored-data access and lifetime responsibility.'),
  no('Assume no prompt content is collected because the dashboard is named monitoring.','A UI label does not define the logging payload.'),
  no('Grant all application users log-read access because they can submit inference requests.','Permission to submit one request does not authorize reading other users’ captured content.'),
  no('Treat deleting the producer’s logging configuration as proof all previously stored destination data was deleted.','Stopping collection and deleting retained destination data are different operations.')
 ],'Inspect the real telemetry payload and its destination policy instead of equating every observability change with harmless counters.',[D.telemetry,D.privacy]),
 q('2.3.5','b','security-ai-controls',['agentcore','xray','cloudwatch-logs'],'An agent tool client redacts prompt text, but its tracing exporter still records an Authorization header from the tool HTTP request. Which repair addresses the leak while preserving useful diagnostics?',[
  yes('Remove/redact sensitive header attributes before export and retain safe operation IDs, timings and outcome categories.','The sensitive value is in a different telemetry path from the already redacted prompt.'),
  no('Keep the header because the trace destination encrypts data at rest.','Authorized trace readers could still access the secret; encryption at rest does not minimize the payload.'),
  no('Move the full header value from span attributes into a trace event and keep exporting it.','Changing the telemetry container does not remove the secret from the exported data.'),
  no('Redact only the user-visible transcript and assume exporter data is identical.','The captured span attributes must be tested directly because they follow a separate path.')
 ],'Inspect raw telemetry from every path, including tool spans and exceptions, using synthetic secret markers in tests.',[D.privacy,D.identity]),
];
export const authoredDevelopmentSecurityQuestions:StudyQuestion[]=[...development,...security];
export const authoredDevelopmentSecurityReview={
 reviewed:'2026-11-03',
 scope:'Two original scenarios for each of the 37 DVA-C03 development/security skill mappings. Primary sources support the deciding service distinctions; scenario requirements and application contracts are synthetic.',
 limitations:['Author-reviewed content; independent editorial review remains a separate gate.','No examples were executed against AWS, no policies were evaluated in a real account and no model calls were made.','Tests establish registry/scoring integrity, not comprehensive factual correctness or exam readiness.','Only the named variant and stated assumptions determine each answer; current account permissions, quotas and availability were not queried.'],
};
