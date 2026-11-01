import {developmentChapters,developmentSources} from './theoryDevelopment';
import {securityChapters,securitySources} from './theorySecurity';
import {deliveryChapters,deliverySources} from './theoryDelivery';
import {withPdfSupplements,pdfReviewSources} from './theoryPdfUpdates';
import {sourceLiteracyChapter} from './theorySourceLiteracy';
/** Original study material. Official sources checked 2026-11-01; examples are not AWS-tested. */
export type Source = { id: string; title: string; url: string; verified: string };
export type Chapter = { domain?: 'development'|'security'|'deployment'|'troubleshooting'; taskIds?:string[]; versionTaskIds?:Partial<Record<'DVA-C02'|'DVA-C03',string[]>>; serviceIds?:string[]; coverageNotes?:string[]; examVersions?:('DVA-C02'|'DVA-C03')[]; id: string; title: string; kicker: string; summary: string; objectives: string[]; sections: { id: string; title: string; body: string[]; code?: string; language?: string; sourceIds: string[] }[]; checks: { question: string; options: string[]; answer: number; explanations: string[] }[]; relatedMission: string };
const verified = '2026-11-01';
const foundationSources: Source[] = [
  ['guide','DVA-C02 official exam guide','https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02.html'],
  ['domain1','Development: tasks and skills','https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain1.html'],
  ['domain2','Security: tasks and skills','https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain2.html'],
  ['domain3','Deployment: tasks and skills','https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain3.html'],
  ['domain4','Troubleshooting: tasks and skills','https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain4.html'],
  ['scope','In-scope AWS services','https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/dva-02-in-scope-services.html'],
  ['iam','IAM policy evaluation','https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html'],
  ['iam-practices','IAM security best practices','https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html'],
  ['role','Lambda execution roles','https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html'],
  ['sts','Temporary AWS credentials','https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html'],
  ['secrets','Secrets Manager best practices','https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html'],
  ['jwt','HTTP API JWT authorizers','https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html'],
  ['lambda','Lambda development best practices','https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html'],
  ['query','DynamoDB Query','https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html'],
  ['scan','DynamoDB Scan','https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Scan.html'],
  ['consistency','DynamoDB read consistency','https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html'],
  ['boto-query','Boto3 Query API','https://docs.aws.amazon.com/boto3/latest/reference/services/dynamodb/table/query.html'],
  ['package','SAM package command','https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-package.html'],
  ['validate','SAM validate command','https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-validate.html'],
  ['put','Boto3 conditional PutItem','https://docs.aws.amazon.com/boto3/latest/reference/services/dynamodb/table/put_item.html'],
  ['sqs','Lambda with SQS','https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html'],
  ['batch','SQS partial batch errors','https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html'],
  ['dlq','SQS dead-letter queues','https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html'],
  ['sam','SAM function reference','https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html'],
  ['canary','SAM gradual deployments','https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/automating-updates-to-serverless-apps.html'],
  ['alias','Lambda aliases','https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html'],
  ['build','CodeBuild buildspec reference','https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html']
].map(([id,title,url]) => ({id,title,url,verified}));

const foundationChapters: Chapter[] = [
{
 id:'iam', title:'IAM for application developers', kicker:'SECURITY · 26%', relatedMission:'serverless',
 summary:'Follow an identity from the API boundary to a database write. Learn which permission belongs to the caller, the service, and your application.',
 objectives:['Prerequisites: HTTP requests, JSON, and basic AWS service concepts.','Map to 2.1.3–2.1.7: programmatic access, authenticated calls, role assumption, principal permissions, and application authorization.','Explain trust versus permissions policies, temporary credentials, and why a valid token does not authorize every data operation.','Use the serverless mission to predict and repair an AccessDenied failure.'],
 sections:[
 {id:'identity',title:'1. Start with “who is making this call?”',body:[
 'Authentication establishes identity; authorization decides whether that identity may perform an operation. Our example is a task API. A student submits a task, API Gateway checks a token, Lambda runs application code, and DynamoDB stores the task. There are multiple identities along this path, not one permission that follows the user everywhere.',
 'An HTTP API JWT authorizer checks the configured issuer and audience, token validity, and any route scopes. It passes validated claims to the integration. Require appropriate access-token scopes; merely decoding a JWT in browser code does not verify it. Application code must still enforce ownership, such as ensuring a caller reads only their own task.',
 'Diagram: client → [token check at API Gateway] → Lambda → [AWS permission check] → Tasks table. The first failed check blocks entry. The second can fail even when the first succeeds. The playground models the database permission gate; it does not implement a real identity provider.'
 ],sourceIds:['jwt','domain2']},
 {id:'roles',title:'2. Trust answers “who?”; permissions answer “what?”',body:[
 'A role is an assumable identity. Its trust policy identifies principals that may assume it. Its permissions policies describe actions and resources the resulting session may access. Lambda assumes an execution role trusted by the Lambda service. Adding DynamoDB actions to a trust policy is not how you authorize database writes.',
 'The execution role grants the function access to AWS resources, such as a table or logs. Separately, permission for API Gateway to invoke a function is a different concern. Lambda manages assumption of its own execution role; ordinary function code should not manually assume that same role.',
 'Exercise: on paper, label the three checks: API caller → route; API Gateway → function; function execution role → table. In the simulation, remove the table write permission and predict the result before running.'
 ],code:`{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "lambda.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}`,language:'json',sourceIds:['role']},
 {id:'least-privilege',title:'3. Give one operation one narrow permission',body:[
 'For the create-task operation, start with dynamodb:PutItem on the exact Tasks table ARN. A list-task operation using Query needs a different action. Avoid granting all DynamoDB actions on every table just to make a failing request succeed.',
 'Use temporary role credentials for workloads rather than embedding a developer access key in the source repository. Review unused privileges and use policy validation and access analysis to refine access. A least-privilege policy is tied to the actual workload, not a memorized universal template.',
 'The example below grants only a write. It intentionally omits logging and any read/index permissions. Replace the example account and resource for a real lab, then review every required action. This site never needs those credentials.'
 ],code:`{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "dynamodb:PutItem",
    "Resource": "arn:aws:dynamodb:us-east-1:123456789012:table/Tasks"
  }]
}`,language:'json',sourceIds:['iam-practices']},
 {id:'evaluation',title:'4. Diagnose denial without guessing',body:[
 'Begin with the caller identity, API action, target ARN, and request conditions. Check for a matching permission and for applicable explicit denies. An explicit deny overrides an allow. Permissions boundaries and organizational controls can restrict effective permissions; adding another allow is not a reliable repair for an explicit deny.',
 'Identity and resource policies interact differently across scenarios. Same-account resource grants, assumed-role sessions, cross-account access, boundaries, and organization controls require careful evaluation. The playground deliberately implements only a tiny allow/deny teaching gate, not the complete IAM evaluation system.',
 'Debugging checklist: confirm the function is using the intended role; compare the action and ARN; inspect relevant policy conditions; identify applicable guardrails; retest the smallest operation. Do not delete safeguards to silence an error.'
 ],sourceIds:['iam']},
 {id:'temporary',title:'5. Temporary credentials and secret handling',body:[
 'AWS STS issues credentials with limited lifetimes. Once they expire, requests made with them stop being authorized. Role sessions avoid distributing permanent credentials inside the app. SDK credential-provider support should handle the environment appropriately; hardcoded keys and a manual copy of an old session are fragile.',
 'AWS access credentials and an application database password are different kinds of secrets. Use a secret-management service for sensitive values, restrict retrieval access, and plan rotation. Secrets Manager supports encrypted storage and retrieval over TLS. Caching can reduce repeated retrievals, but cache duration must fit rotation behavior.',
 'Never log tokens, passwords, or complete request bodies merely to debug identity problems. Record request IDs and safe error categories. Encryption is not authorization: a caller still needs permission to retrieve or decrypt protected data.'
 ],sourceIds:['sts','secrets']},
 {id:'iam-practice',title:'6. Practice and common traps',body:[
 'Try the serverless mission with permission disabled. Write a hypothesis: “The request reaches Lambda, but no database mutation should occur.” Step through the events, find the denied call, restore the narrow permission, and replay.',
 'Common traps: treating a JWT as AWS credentials; confusing the execution role with the API caller; interpreting a trust policy as a database permission; assuming an Allow can defeat a Deny; putting long-lived credentials in frontend code.',
 'Supporting material versus exam focus: managing application permissions is relevant here. Administering IAM users and groups is not a target job task in this exam guide. This chapter is partial preparation, not complete Security-domain coverage.'
 ],sourceIds:['guide','domain2']}
 ],
 checks:[
 {"question": "The API accepts the token, but Lambda receives AccessDenied on PutItem. What should you check first?", "options": ["The Lambda execution role permission for the target table", "Add dynamodb:PutItem to the role trust policy", "Give the API client a new token with a longer expiration", "Increase the Lambda function timeout"], "answer": 0, "explanations": ["Correct: the function’s database call uses its execution-role permissions for that action and table.", "The trust policy determines who can assume a role; it does not grant a session database access.", "The API already accepted the token. Its lifetime does not supply the Lambda execution role with missing permissions.", "A larger timeout cannot authorize a denied AWS action."]},
 {"question": "A matching explicit Deny applies to an action. What does adding another Allow do?", "options": ["Overrides the Deny if the Allow names a more specific resource", "Does not override the Deny", "Overrides the Deny after the role session is refreshed", "Overrides the Deny when the new Allow appears later in the policy"], "answer": 1, "explanations": ["Specificity does not make an applicable Allow defeat an explicit Deny.", "Correct: inspect why the deny applies; another allow does not repair it.", "Refreshing credentials does not remove an applicable policy denial.", "Policy statement order is not a last-match-wins authorization rule."]}
 ]
},
{
 id:'serverless', title:'Develop a resilient serverless API', kicker:'DEVELOPMENT · 32%', relatedMission:'serverless',
 summary:'Trace a task from request to durable state, then add a queue without turning retries into duplicate work.',
 objectives:['Prerequisites: Python functions, HTTP status codes, and the IAM chapter.','Map to 1.1.4–1.1.9, 1.2.2–1.2.5, 1.3.2–1.3.4: APIs, SDKs, messaging, Lambda behavior, reads and keys.','Explain Query versus Scan, consistency, duplicate delivery, and partial batch responses.','Run the serverless and queue missions, then explain the failure path without relying on animation.'],
 sections:[
 {id:'request',title:'1. Follow one request, preserve one identity',body:[
 'Our task application has a simple boundary: an authenticated client submits a task to an HTTP API. A configured JWT authorizer checks the token and route scopes before passing claims to Lambda. The handler derives the owner from trusted claims, validates the payload, then writes a task record.',
 'Diagram: client → API Gateway [token/route] → Lambda [validation, ownership] → DynamoDB [conditional write]. A validation failure returns a client error without writing. A permission or dependency failure belongs to a different diagnostic path; do not mask all failures as “bad input.”',
 'This architecture is a teaching example. Describing and using patterns is relevant to the exam; designing a complete architecture is supporting practice. The mission uses simulated requests rather than making real AWS calls.'
 ],sourceIds:['jwt','guide','domain1']},
 {id:'handler',title:'2. Make the handler small and testable',body:[
 'Reuse an SDK client outside the handler, but keep user-specific mutable state out of shared process memory. Validate types and lengths before persistence. Use a request identifier for safe structured logging. A warm execution environment may be reused, so memory is neither a durable database nor a safe place for another user’s data.',
 'The focused snippet below performs a conditional write. The caller must supply a validated, stable task ID and owner derived from trusted identity. The condition prevents overwriting an existing item with the same key. Full API response mapping, authorization, dependency packaging, and tests are still required around it.',
 'This example has not been executed against AWS. A conditional-write failure is not automatically a successful retry: read or compare the existing request’s identity and payload before deciding whether it is a legitimate duplicate or a conflict.'
 ],code:`import os
import boto3

# SDK uses the runtime credential provider; no keys in source.
table = boto3.resource("dynamodb").Table(os.environ["TABLE_NAME"])

def create_task(owner: str, task_id: str, title: str):
    if not isinstance(title, str) or not 1 <= len(title.strip()) <= 200:
        raise ValueError("title must contain 1–200 characters")
    table.put_item(
        Item={"pk": f"USER#{owner}", "sk": f"TASK#{task_id}",
              "title": title.strip(), "status": "pending"},
        ConditionExpression="attribute_not_exists(pk)"
    )`,language:'python',sourceIds:['lambda','put']},
 {id:'reads',title:'3. Match reads to access patterns',body:[
 'Query selects a single partition-key value and can further constrain the sort key. For this example, “list my tasks” can use pk = USER#<owner> with a TASK# sort-key prefix. A table key and an index key are different access paths; choose the operation and permissions for the path you actually use.',
 'Scan reads through a table or index. A filter removes items after reading, so it does not make the scan equivalent to a selective Query or reduce the read capacity already consumed. Both operations may require pagination; a single response is not necessarily all results.',
 'An eventually consistent read can temporarily miss a recent write. Tables and local secondary indexes support optional strong reads; global secondary indexes do not. Strong consistency does not freeze an item against subsequent writes. The playground’s latency and visibility are illustrative, not performance guarantees.'
 ],code:`from boto3.dynamodb.conditions import Key

page = table.query(
    KeyConditionExpression=Key("pk").eq(f"USER#{owner}")
        & Key("sk").begins_with("TASK#"),
    ConsistentRead=True  # table query, not a GSI query
)
# Continue with ExclusiveStartKey when LastEvaluatedKey is present.
items = page["Items"]`,language:'python',sourceIds:['query','scan','consistency','boto-query']},
 {id:'queue',title:'4. Add asynchronous work deliberately',body:[
 'Use a queue when the caller need not wait for every downstream step. Diagram: producer → SQS [stored work] → Lambda worker [processing] → DynamoDB [result]. A successful enqueue means work was accepted, not that the worker completed it. Expose job state when the user needs an eventual result.',
 'With SQS event source mappings, Lambda polls messages and invokes the worker with a batch. Received messages remain in the queue but are hidden during visibility timeout. Successful processing leads to deletion. Default failed-batch behavior can make every record visible again, including records already processed.',
 'Duplicate processing is possible. An idempotent operation uses a stable business key and durable coordination so repeating the request does not repeat its effect. A process-local set is not enough across concurrent workers or restarts. Our mission’s in-memory ledger is a deliberately simplified stand-in for durable application logic.'
 ],sourceIds:['sqs','lambda']},
 {id:'batch',title:'5. Isolate poison records, not the whole batch',body:[
 'Enable ReportBatchItemFailures on the event source mapping and return failed message IDs to avoid retrying successful records unnecessarily. Returning the JSON shape without enabling the feature is incomplete. If the handler throws instead of returning normally, the batch fails. For FIFO queues, stop after the first failure and report failed plus unprocessed records to preserve order.',
 'A poison message repeatedly fails because its payload or requested operation cannot succeed. A redrive policy can move repeatedly received messages to a dead-letter queue. Investigate and repair the cause before redriving; a DLQ is not a successful processing outcome.',
 'Visibility timeout, retry behavior, concurrency and batch settings interact. Do not generalize SQS behavior to synchronous API requests or asynchronous Lambda invocations. The browser model uses a bounded virtual clock and a simplified receive/redrive cycle.'
 ],code:`def handler(event, context):
    failures = []
    for record in event["Records"]:  # standard-queue example
        try:
            process_idempotently(record["body"])
        except Exception:
            # Log safe diagnostics, not the complete body or secret values.
            failures.append({"itemIdentifier": record["messageId"]})
    return {"batchItemFailures": failures}

# process_idempotently is application logic to implement and test.
# Enable ReportBatchItemFailures on the event source mapping.`,language:'python',sourceIds:['batch','dlq']},
 {id:'serverless-lab',title:'6. Test the boundaries and observe the result',body:[
 'Create tests for invalid input, denied writes, duplicates with matching versus conflicting payloads, transient failures, and poison records. Keep business logic separate from SDK calls so unit tests can replace network dependencies. Integration tests are still needed to establish real permissions and service wiring.',
 'In the queue mission, turn partial failures off, then on. Predict which messages retry. Turn idempotency off and inject a duplicate; inspect the visible effect count. Repair the configuration and explain why avoiding an unnecessary retry differs from making a retry safe.',
 'For timeouts, inspect where time was spent and whether the downstream operation may already have succeeded. Blindly retrying after a client timeout can duplicate a side effect. Choose bounded retries only for appropriate failures and measure actual workload behavior before choosing production settings.'
 ],sourceIds:['domain1','lambda','batch']}
 ],checks:[
 {"question": "A filtered Scan returns only ten tasks. What does that prove about read work?", "options": ["Exactly ten items were evaluated because filters run before reads", "The filter was applied after reading; more items may have been read", "A partition-key filter converted the operation into a Query", "The page has all matching items because a small result cannot require pagination"], "answer": 1, "explanations": ["Scan filters are evaluated after the read, so returned count can be smaller than evaluated count.", "Correct: filtering reduces returned items, not work already performed.", "A Scan remains a Scan; a key filter does not select the Query API.", "A response can have few or even no matching items and still include LastEvaluatedKey."]},
 {"question": "One record fails in a standard SQS batch. How do you arrange for only failed records to be retried?", "options": ["Return failed IDs and enable ReportBatchItemFailures", "Return failed IDs without changing the event source mapping", "Throw an exception after all records have been attempted", "Shorten the visibility timeout so SQS identifies the failed record"], "answer": 0, "explanations": ["Correct: configure partial batch responses and return failed item identifiers without throwing.", "The response shape alone is insufficient when partial batch reporting is not enabled.", "An unhandled exception makes the batch fail rather than acknowledging its successful records.", "Visibility controls when messages can reappear; it does not identify which records succeeded."]}
 ]
},
{
 id:'cicd', title:'CI/CD and safe deployments', kicker:'DEPLOYMENT · 24% + TROUBLESHOOTING · 18%', relatedMission:'deployment',
 summary:'Treat a release as a controlled change: build an artifact, validate it, move traffic gradually, and use evidence to roll back.',
 objectives:['Prerequisites: Git, unit tests, the serverless chapter, and basic YAML.','Map to 3.1.1–3.1.2, 3.3.4, 3.4.5–3.4.11: artifacts, IaC, releases and rollback.','Map to 4.1.2–4.1.3 and 4.2.7: interpreting telemetry and structured logs.','Compare a canary with all-at-once deployment and explain when an alarm should stop a release.'],
 sections:[
 {id:'pipeline',title:'1. An artifact moves through environments',body:[
 'Teaching workflow: source commit → build → unit tests → package → staging → integration checks → approval when appropriate → production canary → observation → promote or roll back. Use one identified artifact instead of silently rebuilding different code for production. Keep configuration for development and production explicit.',
 'CodeBuild executes build instructions; a deployment workflow coordinates the stages; CodeDeploy can manage supported traffic-shifting deployments. This chapter’s full pipeline layout is supporting practical material. The exam emphasizes using workflows, packaging code, updating infrastructure definitions, configuring deployment strategies and rolling back; designing and creating pipelines is an out-of-scope target job task.',
 'A failed test should block promotion. A manual approval is a decision gate, not a substitute for tests. The browser mission simulates a release and telemetry; it does not start a cloud build.'
 ],sourceIds:['guide','domain3']},
 {id:'buildspec',title:'2. Make build inputs and outputs explicit',body:[
 'Example repository: app/handler.py and app/requirements.txt hold runtime code; tests/ contains unit tests; template.yaml describes resources; buildspec.yml describes the build; requirements-dev.txt pins test tooling. The chosen CodeBuild image must have a supported Python runtime and SAM CLI installed.',
 'A buildspec is YAML with ordered phases and artifact selection. Here tests run before SAM packages the application. PACKAGE_BUCKET is a configured artifact bucket, not a password. The build service role needs appropriate scoped access. The packaging command uploads artifacts and therefore belongs only in an explicitly authorized real lab, never in the browser simulation.',
 'Use a secret reference for sensitive build values and avoid printing them. Masking is not a guarantee for transformed secrets. This illustrative buildspec is not a complete pipeline and has not run in CodeBuild.'
 ],code:`version: 0.2
phases:
  install:
    commands:
      - python -m pip install -r requirements-dev.txt
  pre_build:
    commands:
      - python -m pytest tests/ -q
      - sam validate --lint
  build:
    commands:
      - sam build
      - sam package --s3-bucket "$PACKAGE_BUCKET" --output-template-file packaged.yaml
artifacts:
  files:
    - packaged.yaml`,language:'yaml',sourceIds:['build','sam','package','validate']},
 {id:'sam-template',title:'3. Read a deployment definition as a contract',body:[
 'SAM transforms serverless resources into CloudFormation resources. A function definition ties code location to runtime, handler, configuration and permissions. The excerpt below assumes an existing task application; it does not create its table, API, alarm or role.',
 'API integration must invoke the live alias to benefit from alias traffic shifting. Referencing an unqualified function separately can bypass the rollout path. Resource creation and deployment require review, correct dependencies and authorization; this lesson never deploys the snippet.',
 'In a complete template, define the referenced role and alarm, ensure the role can access the intended table, and connect the API to the alias. Validate syntax, inspect the transformed resources and test the staged application before production.'
 ],code:`# Fragment under Resources; not a complete deployable stack.
TaskFunction:
  Type: AWS::Serverless::Function
  Properties:
    CodeUri: app/
    Handler: handler.handler
    Runtime: python3.12
    Timeout: 10
    Role: !GetAtt TaskExecutionRole.Arn
    Environment:
      Variables:
        TABLE_NAME: !Ref TasksTable
    AutoPublishAlias: live
    DeploymentPreference:
      Type: Canary10Percent10Minutes
      Alarms:
        - !Ref NewVersionErrorsAlarm`,language:'yaml',sourceIds:['sam','canary']},
 {id:'release',title:'4. A version is not an alias',body:[
 'An alias provides a stable name pointing to a function version. It can route between two versions during a rollout. Callers use the alias ARN so the release mechanism can change traffic without every caller changing configuration.',
 'A canary initially sends a portion of traffic to the new version, observes it, then moves the remainder. Linear rollout moves equal increments over time. All-at-once moves the traffic in one step. With SAM gradual deployment, configured alarms and validation hooks can drive rollback. An alarm that is not connected to the deployment does not magically control it.',
 'The example canary setting is a real SAM option, but the playground compresses observation into virtual time and uses deterministic traffic. A real small request sample is not guaranteed to match a configured percentage exactly. The first gradual release also needs an existing prior version to shift away from.'
 ],sourceIds:['alias','canary']},
 {id:'diagnose',title:'5. Explain the failure with telemetry',body:[
 'Metrics show aggregate symptoms, such as error rate or latency. Logs record events and safe context. Traces help follow a request across components. Use a shared request or trace identifier to connect observations, while retaining the deployed version in diagnostics.',
 'In our release scenario, old-version requests succeed and new-version requests fail at a validation step. The useful hypothesis is version-specific code regression, not “AWS is down.” Compare equivalent requests across versions, inspect the failing operation and confirm whether the dependency was reached.',
 'A dashboard alone is not a root-cause analysis. State the evidence, a competing explanation and a test that separates them. Avoid logging sensitive payloads. After rollback, check that traffic is actually on the prior version and that the symptom has recovered.'
 ],code:`{
  "event": "task_write_failed",
  "request_id": "demo-request-17",
  "function_version": "2",
  "error_category": "validation_regression",
  "duration_ms": 84
}`,language:'json',sourceIds:['domain4']},
 {id:'rollback-lab',title:'6. Rehearse recovery before it matters',body:[
 'Run the deployment mission with a healthy version, then inject a new-version failure. Predict whether the configured alarm and rollback setting will protect users. Inspect the timeline and distinguish “alarm observed,” “rollback triggered” and “traffic restored.” Those are separate states.',
 'A production rollback plan must consider data compatibility. Returning to old code does not automatically reverse database writes or schema changes. In a real lab, use non-production data and practice forward-compatible changes; never assume deleting an application stack erases all retained data.',
 'Optional real-lab checklist: separate sandbox account, reviewed IAM permissions, budget alerts, and an inventory of billable resources. After the lab, remove the stack and explicitly inspect retained tables, log groups and artifact objects before removing them. No real lab is run by this site; all examples remain unverified against an AWS account.'
 ],sourceIds:['domain3','canary']}
 ], checks:[
 {"question": "A new version is deployed, but clients call the unqualified function instead of the live alias. What should you investigate?", "options": ["Whether traffic bypasses the configured alias rollout", "Whether publishing a version automatically redirects every unqualified invocation", "Whether changing the alias weight also changes the unqualified function ARN", "Whether the alias name must be included in each request body"], "answer": 0, "explanations": ["Correct: check the actual invocation target and configure it to follow the alias routing path.", "Publication does not make every unqualified invocation use the live alias.", "An alias has its own qualified ARN; changing its routing does not rewrite a caller’s unqualified target.", "The alias is part of invocation targeting, not an application payload field."]},
 {"question": "Errors appear only in version 2 after a canary starts. Which next step is most useful?", "options": ["Increase the canary to 100% immediately to make the sample larger", "Correlate failing requests and logs by version, then use the configured rollback strategy", "Disable the error alarm because unit tests already passed", "Roll back only the API stage without checking the Lambda alias target"], "answer": 1, "explanations": ["Increasing exposure before diagnosing the regression can affect more users.", "Correct: use version-specific evidence and a controlled recovery path, then verify traffic and health.", "Passing unit tests does not prove runtime integration or release health; disabling the guardrail hides the symptom.", "A stage-only change may leave the same failing alias/version in use. Verify the actual deployment target."]}
 ]
}
];

export const roadmap = [
 {title:'API requests, Lambda configuration, DynamoDB access patterns',domain:'Development · 32%',status:'Partial: chapter + serverless mission'},
 {title:'SQS retries, duplicate delivery, partial failures and DLQ',domain:'Development · 32%',status:'Partial: chapter + queue mission'},
 {title:'IAM application permissions, roles and authorization',domain:'Security · 26%',status:'Partial: chapter + permission failure scenario'},
 {title:'Artifacts, safe releases and rollback',domain:'Deployment · 24%',status:'Partial: chapter + deployment mission'},
 {title:'Correlated logs, metrics and traces',domain:'Troubleshooting · 18%',status:'Partial: deployment investigation'},
 {title:'Cognito federation, STS cross-account scenarios, KMS and secrets',domain:'Security · 26%',status:'Roadmap: dedicated labs not implemented'},
 {title:'S3, SNS, EventBridge, streams and caching',domain:'Development · 32%',status:'Roadmap: dedicated chapters not implemented'},
 {title:'Packaging variants, AppConfig, SAM/CloudFormation and integration testing',domain:'Deployment · 24%',status:'Roadmap: expanded labs not implemented'},
 {title:'Concurrency, profiling, bottlenecks and cache behavior',domain:'Troubleshooting · 18%',status:'Roadmap: dedicated labs not implemented'},
 {title:'Additional current exam skills and emerging-topic awareness',domain:'All domains',status:'Read the official guide; this app is not complete exam preparation'}
];

export const glossary = [
 {term:'Principal',definition:'An identity making a request, such as an IAM role session. Identify it before debugging permissions.'},
 {term:'Trust policy',definition:'A role policy describing who may assume the role; distinct from what its session may do.'},
 {term:'Execution role',definition:'The IAM role used by Lambda code to access other AWS resources.'},
 {term:'Idempotency',definition:'Repeating an operation with the same logical request identity does not repeat its intended effect.'},
 {term:'Visibility timeout',definition:'The period during which a received SQS message is hidden from other receives; it is not deletion.'},
 {term:'Dead-letter queue',definition:'A queue for messages that repeatedly fail processing, used for diagnosis and controlled recovery.'},
 {term:'Query',definition:'A DynamoDB read using a partition-key value and optional sort-key condition.'},
 {term:'Scan',definition:'A DynamoDB operation that reads through table or index items; filtering happens after reading.'},
 {term:'Alias',definition:'A stable Lambda name pointing to a published function version, optionally with weighted routing.'},
 {term:'Canary',definition:'A rollout that initially exposes a portion of traffic to a new version before moving the remainder.'},
 {term:'Artifact',definition:'A built, identified package of code and dependencies promoted through a release workflow.'},
 {term:'Trace',definition:'A connected view of a request across operations and services, used alongside logs and metrics.'}
];

export const sources:Source[]=[...foundationSources,...developmentSources,...securitySources,...deliverySources,...pdfReviewSources];
export const chapters:Chapter[]=[...withPdfSupplements([...foundationChapters,...developmentChapters,...securityChapters,...deliveryChapters]),sourceLiteracyChapter];
