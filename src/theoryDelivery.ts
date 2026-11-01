/** Original exam-scoped lessons. Official documentation checked 2026-11-01; no examples execute AWS operations. */
import type {Chapter,Source} from "./content";
export const deliverySources:Source[] = [
  {
    "id": "ops-d3",
    "title": "DVA-C02 Deployment skills",
    "url": "https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain3.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-d4",
    "title": "DVA-C02 Troubleshooting skills",
    "url": "https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02-domain4.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-sam",
    "title": "SAM build workflow",
    "url": "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli-build.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-zip",
    "title": "Python Lambda ZIP packaging",
    "url": "https://docs.aws.amazon.com/lambda/latest/dg/python-package.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-image",
    "title": "Lambda container images",
    "url": "https://docs.aws.amazon.com/lambda/latest/dg/images-create.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-cdk",
    "title": "CDK assertions and tests",
    "url": "https://docs.aws.amazon.com/cdk/v2/guide/testing.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-change",
    "title": "CloudFormation change sets",
    "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-testing",
    "title": "Serverless testing strategies",
    "url": "https://docs.aws.amazon.com/lambda/latest/dg/testing-guide.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-build",
    "title": "CodeBuild buildspec reference",
    "url": "https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-pipeline",
    "title": "CodePipeline action reference",
    "url": "https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-structure",
    "title": "CodePipeline structure",
    "url": "https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-strategy",
    "title": "CodeDeploy deployment configurations",
    "url": "https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-appspec",
    "title": "CodeDeploy AppSpec reference",
    "url": "https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-rollback",
    "title": "CodeDeploy rollback behavior",
    "url": "https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-config",
    "title": "AppConfig deployment strategies",
    "url": "https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-deployment-strategy.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-validator",
    "title": "AppConfig validators",
    "url": "https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-configuration-and-profile-validators.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-stage",
    "title": "REST API Gateway stages",
    "url": "https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-stages.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-variables",
    "title": "REST API Gateway stage variables",
    "url": "https://docs.aws.amazon.com/apigateway/latest/developerguide/stage-variables.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-domain",
    "title": "API Gateway custom domains",
    "url": "https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-custom-domains.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-branch",
    "title": "Amplify feature-branch workflow",
    "url": "https://docs.aws.amazon.com/amplify/latest/userguide/multi-environments.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-q",
    "title": "Q Developer code and test generation",
    "url": "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/explain-update-code.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-alias",
    "title": "Lambda version aliases",
    "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-xray",
    "title": "X-Ray concepts and annotations",
    "url": "https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-otel",
    "title": "X-Ray instrumentation migration",
    "url": "https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-migration.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-logs",
    "title": "CloudWatch Logs Insights QL",
    "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-emf",
    "title": "Metrics extracted from logs",
    "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-emfspec",
    "title": "EMF document specification",
    "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-metric",
    "title": "Publishing custom metrics",
    "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-alarm",
    "title": "CloudWatch alarms",
    "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Alarms.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-memory",
    "title": "Lambda memory and CPU",
    "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-concurrency",
    "title": "Lambda reserved concurrency",
    "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-best",
    "title": "Lambda runtime best practices",
    "url": "https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-headers",
    "title": "CloudFront header-based caching",
    "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/header-caching.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-cache",
    "title": "Application caching strategies",
    "url": "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-sns",
    "title": "SNS subscription filters",
    "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-health",
    "title": "ECS container health checks",
    "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/healthcheck.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-cfnfailure",
    "title": "CloudFormation failure diagnosis",
    "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/troubleshooting.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-c03-d3",
    "title": "DVA-C03 Testing and Deployment skills",
    "url": "https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/developer-associate-03-domain3.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-c03-d4",
    "title": "DVA-C03 Troubleshooting skills",
    "url": "https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/developer-associate-03-domain4.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-comparison",
    "title": "Official DVA-C02/C03 comparison",
    "url": "https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/dva-03-comparison.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-ecs",
    "title": "ECS task definitions",
    "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-rolling",
    "title": "ECS rolling updates",
    "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-ecr",
    "title": "ECR lifecycle policies",
    "url": "https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-eks",
    "title": "EKS deployment and service manifests",
    "url": "https://docs.aws.amazon.com/eks/latest/userguide/sample-deployment.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-provisioned",
    "title": "Lambda provisioned concurrency",
    "url": "https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-dax",
    "title": "DynamoDB Accelerator",
    "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-qsecurity",
    "title": "Q Developer security responsibilities",
    "url": "https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/security.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-mock",
    "title": "REST API mock integrations",
    "url": "https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-mock-integration.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-parameters",
    "title": "Parameter Store configuration selection",
    "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-rotation",
    "title": "Secrets Manager rotation",
    "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-scaling",
    "title": "EC2 Auto Scaling capacity and policies",
    "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-dashboards",
    "title": "CloudWatch dashboard composition",
    "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html",
    "verified": "2026-11-01"
  },
  {
    "id": "ops-stats",
    "title": "Logs Insights statistical aggregation",
    "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax-Stats.html",
    "verified": "2026-11-01"
  }
];
export const deliveryChapters:Chapter[] = [
  {
    "id": "release-artifacts",
    "title": "Package an application and review its infrastructure",
    "kicker": "DEPLOYMENT · C02 24% / C03 22%",
    "summary": "Follow source, dependencies, build output and infrastructure changes without confusing a successful build with a safe deployment.",
    "objectives": [
      "Prerequisites: basic application code, IAM roles, and the serverless chapter.",
      "Explain decisions and diagnose the worked failures before checking the answers.",
      "DVA-C02 mapping: 3.1.1–3.1.4, 3.3.4, 3.4.1, 3.4.3. Examples are original teaching snippets, not deployed or AWS-tested.",
      "DVA-C03 mapping: 3.1.1–3.1.3, 3.3.1, 3.3.3. The C03 task numbers are not assumed equivalent to C02."
    ],
    "sections": [
      {
        "id": "artifact-contract",
        "title": "1. Treat the artifact as a contract",
        "body": [
          "A release starts with a precise question: what bytes will run, with which dependencies, on which runtime? A repository contains more than executable code: lockfiles, tests, build instructions and infrastructure definitions explain how that code becomes an artifact. Keep those inputs versioned together. A developer’s installed package or uncommitted configuration must not silently become a production dependency. Identify a source revision before building; record the artifact digest afterward. A branch name alone moves over time and is not an immutable release identifier.",
          "Our example is a Python order handler. The source tree separates app.py, a pinned requirements file, tests and template.yaml. A clean build installs declared dependencies into the deployment output rather than copying a laptop’s virtual environment. Native packages must match the chosen runtime architecture and operating environment. A package that imports successfully on a developer workstation can still fail in Lambda. The practical diagnostic is to inspect the built artifact and its target compatibility, not to add retries around a missing import."
        ],
        "sourceIds": [
          "ops-sam",
          "ops-zip"
        ]
      },
      {
        "id": "zip-image",
        "title": "2. ZIP archives and images solve packaging, not authorization",
        "body": [
          "A Lambda ZIP places handler code and dependencies where the runtime can import them. For the Python example app.handler, app.py must be at the expected archive root rather than hidden under an accidental extra project folder. Layers can separate supported shared dependencies, but the function still needs compatible versions. Package inspection should answer whether the handler exists and whether every import resolves in the target environment.",
          "A container image is an alternative Lambda package, not an ordinary web server that Lambda automatically understands. It must satisfy Lambda’s runtime requirements, including a runtime interface client when the selected base image does not provide one. Build for the intended architecture, store the image in the supported ECR location, and record a digest. A mutable tag such as latest is convenient for humans but weak release evidence. Neither a ZIP nor an image grants database access; the execution role remains an independent security boundary."
        ],
        "sourceIds": [
          "ops-zip",
          "ops-image"
        ]
      },
      {
        "id": "sam-build",
        "title": "3. Read the SAM template and build output together",
        "body": [
          "AWS SAM gives serverless resources a compact infrastructure description. The example declares where the code lives, which runtime loads it, its entry point and a memory/timeout budget. It deliberately omits an event source and application data permissions: a function resource alone is not an entire API. Read each property as a runtime contract. A correct Handler with an incorrect CodeUri can still package the wrong directory; a generous Timeout does not repair an invalid dependency.",
          "sam build prepares build output for later local invocation or deployment. It is not the deployment step. A containerized build can help align dependency compilation with the target environment; it does not prove managed-service integrations work. After building, inspect the generated template and artifact path. Rebuild when dependencies or compilation inputs change. During review, explain which files should change and which should remain identical, then compare the actual output against that prediction."
        ],
        "sourceIds": [
          "ops-sam"
        ],
        "code": "Transform: AWS::Serverless-2016-10-31\nResources:\n  OrderFunction:\n    Type: AWS::Serverless::Function\n    Properties:\n      CodeUri: orders/\n      Handler: app.handler\n      Runtime: python3.12\n      MemorySize: 512\n      Timeout: 10\n# Teaching fragment: no API, application policy or deployment is supplied.",
        "language": "yaml"
      },
      {
        "id": "resources",
        "title": "4. Match resource settings to observed work",
        "body": [
          "Memory and compute requirements belong in the release decision, not in an unrelated performance checklist. For Lambda, increasing configured memory also increases available CPU proportionally. A CPU-bound JSON transformation may improve when memory increases even if its maximum memory use was modest. An application waiting on a slow dependency may benefit much less. For containers, distinguish the application’s actual resource demand from the task or platform settings used to accommodate it.",
          "Use a repeatable workload and compare duration, errors, memory use and cost-related resource consumption. For a teaching experiment, compare the same 1,000 synthetic orders at two memory settings while holding dependencies constant. Do not conclude that the smallest setting is cheapest or the largest is fastest without measurement. A deployment artifact should carry enough release metadata to associate a performance change with the code and configuration that produced it. These experiments are described here, not run against AWS."
        ],
        "sourceIds": [
          "ops-memory",
          "ops-best"
        ]
      },
      {
        "id": "iac-review",
        "title": "5. Synthesis is a proposal, not proof",
        "body": [
          "CDK code synthesizes CloudFormation templates; SAM templates also participate in CloudFormation deployment. These are different authoring approaches, not competing permission systems. Review the resulting resource changes. A fine-grained CDK assertion can check that a synthesized function has the intended timeout or that a storage resource retains a protective property. A snapshot can reveal broad changes, but blindly accepting a new snapshot turns a regression test into a record of whatever happened.",
          "A CloudFormation change set shows a proposed update before execution. Pay particular attention to replacements and deletions involving durable data. Preparing a change set does not execute it, and the preview does not guarantee that every runtime quota, permission or dependency check will succeed. Separate code rollback from data recovery. Replacing a table and then redeploying old application code does not reconstruct deleted customer records. Review backups and retention deliberately rather than assuming infrastructure rollback is a universal undo button."
        ],
        "sourceIds": [
          "ops-cdk",
          "ops-change"
        ]
      },
      {
        "id": "artifact-exercise",
        "title": "6. Worked failure: the build passed, the import failed",
        "body": [
          "Suppose unit tests pass locally, the build reports success, and the deployed function immediately reports an import error. First locate the exact deployed revision. Inspect its package layout and dependency contents. Compare the native dependency architecture with the Lambda architecture. Check the handler module path. Only after those checks should you investigate unrelated IAM or networking settings; an import failure can occur before the handler makes any AWS call.",
          "Repair the packaging input, rebuild a new artifact, and retest that artifact rather than patching an untracked deployment manually. Preserve the failed artifact identifier and the successful replacement identifier in release evidence. As a paper exercise, list what proves each claim: source control proves a reviewed revision exists; build logs show commands ran; an archive listing shows files are present; a target-environment test shows the package can load there. No single green check proves all four. This evidence ladder is reusable across ZIP, image and infrastructure releases."
        ],
        "sourceIds": [
          "ops-zip",
          "ops-image",
          "ops-sam"
        ]
      },
      {
        "id": "container-artifact",
        "title": "7. C03 extension: build and retain deployable images",
        "body": [
          "DVA-C03 explicitly adds container image management. A Dockerfile describes a reproducible build recipe; the resulting image is the artifact. Keep dependency lockfiles in the build context, avoid copying credentials, and distinguish build-time tooling from runtime requirements. A multi-stage build can keep compilers out of the final image when the application permits it. These design choices reduce accidental contents, but they do not replace vulnerability review or runtime authorization.",
          "ECR image tags help humans organize releases; record the exact digest promoted into an ECS task definition or another consumer. Lifecycle policies govern image retention, so preview a proposed policy before applying it. An aggressive cleanup rule can remove an image needed for rollback even though today’s running tasks appear healthy. For the exercise, retain candidate and last-known-good digests while allowing disposable build images to age out. Then explain what happens if a release process tries to start a fresh task using a removed image. A running old task is not evidence that the artifact remains available for a new deployment. Image creation, registry retention and workload updates therefore need a shared release record."
        ],
        "sourceIds": [
          "ops-image",
          "ops-ecr",
          "ops-c03-d3"
        ]
      }
    ],
    "checks": [
      {
        "question": "Tests pass on a laptop, but Lambda cannot import a native dependency. What is the best first investigation?",
        "options": [
          "Inspect the built dependency’s platform/architecture and archive layout",
          "Increase API Gateway throttling limits",
          "Grant the function administrator access",
          "Reissue the same package without inspecting it"
        ],
        "answer": 0,
        "explanations": [
          "Correct: the failure is at package loading, so inspect the actual target artifact.",
          "Request throttling does not change binary compatibility.",
          "Broader IAM access cannot make an incompatible library import.",
          "Repeating an unchanged incompatible artifact does not identify or repair the cause."
        ]
      },
      {
        "question": "A change set exists and shows a stateful resource replacement. What does that establish?",
        "options": [
          "The replacement has already completed",
          "Old application code can always restore deleted data",
          "The preview grants every runtime permission",
          "A proposal is available for review, not that data is protected or execution succeeded"
        ],
        "answer": 3,
        "explanations": [
          "Creating the proposal is distinct from executing it.",
          "Application rollback is not a backup or data reconstruction mechanism.",
          "A change set is not an authorization grant.",
          "Correct: review replacement impact and the separate data-protection plan."
        ]
      },
      {
        "question": "Why record an image digest rather than only the tag latest?",
        "options": [
          "The digest guarantees all tests passed",
          "A tag and digest are always equally immutable",
          "The digest identifies the specific image content being promoted",
          "The digest grants ECR permissions"
        ],
        "answer": 2,
        "explanations": [
          "Content identity is not test evidence.",
          "Tags can move; the digest identifies content.",
          "Correct: a moving tag alone can refer to different content later.",
          "Repository access is a separate authorization concern."
        ]
      }
    ],
    "relatedMission": "deployment",
    "taskIds": [
      "3.1",
      "3.3",
      "3.4"
    ],
    "serviceIds": [
      "lambda",
      "cdk",
      "cloudformation",
      "ecr",
      "codeartifact"
    ],
    "domain": "deployment",
    "coverageNotes": [
      "DVA-C02: Substantive reading and worked examples for skills 3.1.1–3.1.4, 3.3.4, 3.4.1, 3.4.3; not a claim of complete service documentation or tested cloud behavior.",
      "Official sources checked 2026-11-01. Exam task coverage is distinguished from newer product features; no question-frequency claim.",
      "Commands and infrastructure snippets are for inspection only. Running them elsewhere requires your own account authorization, cost review, complete permissions, and cleanup plan.",
      "DVA-C03 reading and worked examples: 3.1.1–3.1.3, 3.3.1, 3.3.3. C03-specific extensions are labeled; shared foundations remain relevant to both versions."
    ],
    "examVersions": [
      "DVA-C02",
      "DVA-C03"
    ],
    "versionTaskIds": {
      "DVA-C02": [
        "3.1",
        "3.3",
        "3.4"
      ],
      "DVA-C03": [
        "3.1",
        "3.3"
      ]
    }
  },
  {
    "id": "layered-testing",
    "title": "Test logic, boundaries and event-driven outcomes",
    "kicker": "DEPLOYMENT · C02 24% / C03 22%",
    "summary": "Choose unit, integration and end-to-end evidence deliberately; local mocks do not certify cloud permissions.",
    "objectives": [
      "Prerequisites: basic application code, IAM roles, and the serverless chapter.",
      "Explain decisions and diagnose the worked failures before checking the answers.",
      "DVA-C02 mapping: 3.2.1–3.2.5, 3.3.1, 3.3.6. Examples are original teaching snippets, not deployed or AWS-tested.",
      "DVA-C03 mapping: 3.2.1–3.2.3, 3.2.5. The C03 task numbers are not assumed equivalent to C02."
    ],
    "sections": [
      {
        "id": "test-contract",
        "title": "1. Start with an observable business contract",
        "body": [
          "A useful test describes a behavior that matters, not simply that a function returned without throwing. For an order endpoint, the contract might be: a valid new request creates one durable order; repeating its idempotency key does not create another; an invalid quantity never reaches the storage adapter. Write the expected outcomes before choosing a testing tool. This makes it easier to distinguish an application defect from an incorrectly constructed event fixture.",
          "Unit tests isolate decision logic and run quickly. Integration tests exercise a real boundary such as an SDK call against a test table or an API integration in a separate environment. End-to-end tests follow a larger user journey. These categories overlap in practice, but their evidence differs. A fake storage adapter can prove that validation rejects zero quantity; it cannot prove the Lambda execution role has PutItem permission. Conversely, a successful live write does not cover every validation branch."
        ],
        "sourceIds": [
          "ops-testing"
        ]
      },
      {
        "id": "unit-example",
        "title": "2. A small dependency seam makes tests honest",
        "body": [
          "The example separates validation from the persistence function. Its fake records calls, allowing the test to assert both the returned value and the attempted side effect. For invalid input, assert that the fake received no call. For a duplicate, supply an adapter behavior that matches the application’s documented duplicate handling rather than making every call succeed. An explicit seam is easier to reason about than mocking arbitrary internals of an SDK implementation.",
          "Mocks are models of dependencies. They can become misleading when they accept argument shapes the real API rejects, return impossible values, or omit errors the application must handle. Keep a small set of integration checks to verify those assumptions. Avoid asserting incidental implementation details such as the exact sequence of private helper calls unless that sequence is itself the safety property. The desired claim is that the order contract holds, not that the current code structure can never change."
        ],
        "sourceIds": [
          "ops-testing"
        ],
        "code": "def submit_order(payload, save):\n    quantity = payload.get(\"quantity\")\n    if type(quantity) is not int or quantity <= 0:\n        raise ValueError(\"quantity must be a positive integer\")\n    order = {\"id\": payload[\"id\"], \"quantity\": quantity}\n    save(order)\n    return order\n\ncalls = []\nassert submit_order({\"id\": \"demo-7\", \"quantity\": 2}, calls.append)[\"id\"] == \"demo-7\"\nassert calls == [{\"id\": \"demo-7\", \"quantity\": 2}]\n# Add cases for zero, negative, boolean, missing id and adapter failure.\n# This fragment does not implement storage or idempotency.",
        "language": "python"
      },
      {
        "id": "fixtures",
        "title": "3. Events are versioned interfaces",
        "body": [
          "A Lambda console test event, a SAM local invocation and an actual API integration may use different envelopes. An HTTP body may be a JSON string inside a request object, while a queue event contains a collection of records. Build fixtures from the integration contract actually selected, including the version where applicable. A handler that expects event.quantity will not necessarily work when quantity is inside a parsed body. Keep malformed fixtures to test error reporting as well as valid fixtures to test success.",
          "For an event-driven flow, assert eventual effects with a bounded polling strategy rather than a fixed sleep that is accidentally long enough today. Include duplicate delivery, out-of-order arrivals where permitted, partial batch failure and a dependency error. Assign unique test identifiers and clean up only the test’s own resources or records. Never point an integration test at production merely because those endpoints are easiest to find. This website provides study examples; it does not execute the polling or cleanup."
        ],
        "sourceIds": [
          "ops-testing",
          "ops-sam"
        ]
      },
      {
        "id": "local-limit",
        "title": "4. Local tools shorten feedback, not replace integration",
        "body": [
          "SAM local tools are useful for invoking a handler with an event and exploring request translation. They do not recreate every behavior of IAM, service quotas, network policies, managed event delivery and remote APIs. A local pass should increase confidence in the tested code path, not become a declaration that the deployed system is correct. Document which boundaries are mocked, which are local and which were verified in a real isolated environment.",
          "Imagine the same function passes its local test but receives AccessDenied in staging. Preserve the local test: it still verifies business logic. Add an integration test or deployment check that exposes the authorization requirement. Do not weaken production security merely to make the test green. The corrective action might be a narrowly scoped execution-role change, a corrected resource ARN or a fixed environment setting. The failure tells you the existing evidence was incomplete, not that unit testing was pointless."
        ],
        "sourceIds": [
          "ops-testing",
          "ops-sam"
        ]
      },
      {
        "id": "deployed-tests",
        "title": "5. Test the environment that will be promoted",
        "body": [
          "Deploy the candidate to an explicitly named test stack and use its outputs to discover endpoints and resource identifiers. A hardcoded old endpoint can make a test validate yesterday’s release while today’s release is broken. Record the candidate revision, configuration version and test environment together. When updating an existing stack, inspect the proposed changes and preserve isolation between the test and production resources. A smoke test should cover a meaningful path, not just an unauthenticated health response.",
          "IaC assertions complement runtime tests. A CDK test can check a synthesized property before deployment; a cloud integration test checks the behavior after deployment. Neither substitutes for the other. For an asynchronous order workflow, a useful release gate verifies that a submitted test order eventually reaches the expected terminal state, then checks that replaying its event does not duplicate the durable effect. Include a timeout with a helpful diagnostic containing safe correlation IDs, not secrets or complete customer payloads."
        ],
        "sourceIds": [
          "ops-testing",
          "ops-cdk",
          "ops-change"
        ]
      },
      {
        "id": "q-tests",
        "title": "6. Review generated tests instead of outsourcing judgment",
        "body": [
          "DVA-C02 names Amazon Q Developer specifically for generated tests; C03 uses the broader AWS AI tools objective. Amazon Q Developer can generate tests for selected code. Treat the output as a draft: verify the imports, fixtures, assertions and unsupported assumptions before accepting it. Ask for boundary and failure cases, not simply “more tests.” For the quantity example, a generated test that only uses quantity two leaves negative values, booleans and missing identifiers unexamined. A test that mocks submit_order itself and asserts the mock’s return value tests the mock, not the implementation.",
          "An original review exercise is to deliberately change the validation condition and predict which test should fail. If no test detects that mutation, investigate whether the suite asserts the intended contract. Do not send secrets or unauthorized repository context to an AI tool. This lesson makes no AI requests and claims no automatic correctness guarantee. The final release decision remains grounded in reviewed tests, reproducible results and the scope of the environment actually exercised."
        ],
        "sourceIds": [
          "ops-q",
          "ops-testing"
        ]
      },
      {
        "id": "ai-workflow",
        "title": "7. C03 extension: automate tests without trusting unsupported conclusions",
        "body": [
          "C03 broadens AI-assisted testing beyond generating a few unit-test files. An approved workflow can ask an AWS AI assistant to propose regression cases, summarize failed test output or identify untested branches. Keep the actual test runner and its exit status as the evidence of execution. A generated summary saying “all passed” cannot override a failing run or invent a missing integration environment. Review any suggested command before allowing a tool to execute it.",
          "For an external API, a controlled mock endpoint can return representative success, malformed response and error cases without depending on a third party’s availability. API Gateway supports mock integrations for appropriate API types; use the actual response contract rather than an arbitrary always-successful stub. Then retain a separately authorized integration check for the real dependency. As a worked review, give an assistant the quantity-validation code and a redacted failure report, ask for a boolean-input regression case, and independently verify that it fails before the repair and passes afterward. The AI assists test design; it does not become the oracle for correct business behavior."
        ],
        "sourceIds": [
          "ops-q",
          "ops-qsecurity",
          "ops-c03-d3",
          "ops-testing",
          "ops-mock"
        ]
      }
    ],
    "checks": [
      {
        "question": "A mocked PutItem succeeds in unit tests. What remains unverified?",
        "options": [
          "Whether the fake returned its configured response",
          "Whether the local assertion executed",
          "Whether the mock returned its predefined success value",
          "The deployed caller’s real table authorization"
        ],
        "answer": 3,
        "explanations": [
          "That narrow behavior is exactly what the unit test can show.",
          "A passing test runner can show that the assertion ran, not cloud access.",
          "The local test can observe the configured fake response; it cannot establish real table authorization.",
          "Correct: a mock does not evaluate AWS IAM or the actual target table."
        ]
      },
      {
        "question": "An asynchronous integration test sometimes fails after a fixed one-second sleep. What improves the test?",
        "options": [
          "Use production messages because they already exist",
          "Treat the first missing result as permanent data loss",
          "Poll for the expected state with a bounded deadline and useful correlation evidence",
          "Remove every assertion"
        ],
        "answer": 2,
        "explanations": [
          "Production data introduces safety and isolation problems.",
          "An asynchronous flow needs an explicit bounded wait and diagnosis.",
          "Correct: test eventual behavior without an arbitrary timing assumption.",
          "Removing assertions removes the business guarantee."
        ]
      },
      {
        "question": "Generated tests mock the function under test and assert the configured mock response. What should you do?",
        "options": [
          "Delete failing cases so the generated suite passes",
          "Replace them with tests exercising the real function and controlled dependencies",
          "Accept them because they increase coverage-file length",
          "Assume Q verified the live cloud environment"
        ],
        "answer": 1,
        "explanations": [
          "Removing the evidence of defects weakens the suite.",
          "Correct: the present test does not exercise the application behavior.",
          "Test volume is not meaningful behavioral evidence.",
          "Test generation does not establish deployment or cloud integration success."
        ]
      }
    ],
    "relatedMission": "deployment",
    "taskIds": [
      "3.2",
      "3.3"
    ],
    "serviceIds": [
      "lambda",
      "api",
      "sqs",
      "q-developer",
      "cdk"
    ],
    "domain": "deployment",
    "coverageNotes": [
      "DVA-C02: Substantive reading and worked examples for skills 3.2.1–3.2.5, 3.3.1, 3.3.6; not a claim of complete service documentation or tested cloud behavior.",
      "Official sources checked 2026-11-01. Exam task coverage is distinguished from newer product features; no question-frequency claim.",
      "Commands and infrastructure snippets are for inspection only. Running them elsewhere requires your own account authorization, cost review, complete permissions, and cleanup plan.",
      "DVA-C03 reading and worked examples: 3.2.1–3.2.3, 3.2.5. C03-specific extensions are labeled; shared foundations remain relevant to both versions."
    ],
    "examVersions": [
      "DVA-C02",
      "DVA-C03"
    ],
    "versionTaskIds": {
      "DVA-C02": [
        "3.2",
        "3.3"
      ],
      "DVA-C03": [
        "3.2"
      ]
    }
  },
  {
    "id": "release-environments",
    "title": "Promote approved versions across environments",
    "kicker": "DEPLOYMENT · C02 24% / C03 22%",
    "summary": "Keep API stages, function aliases, branch deployments and configuration boundaries understandable and reproducible.",
    "objectives": [
      "Prerequisites: basic application code, IAM roles, and the serverless chapter.",
      "Explain decisions and diagnose the worked failures before checking the answers.",
      "DVA-C02 mapping: 3.1.3, 3.1.5, 3.2.3–3.2.4, 3.3.2–3.3.5, 3.4.2–3.4.4, 3.4.9–3.4.10. Examples are original teaching snippets, not deployed or AWS-tested.",
      "DVA-C03 mapping: 3.1.3–3.1.5, 3.2.4, 3.3.3, 3.3.8. The C03 task numbers are not assumed equivalent to C02."
    ],
    "sections": [
      {
        "id": "identity",
        "title": "1. Name the release and the environment separately",
        "body": [
          "A release identifier answers which application version is intended; an environment answers where it runs and which configuration and dependencies it uses. Confusing these concepts creates subtle promotion bugs. If a build is repeated independently for test and production, even the same source branch can produce different dependencies or assets. Prefer a traceable artifact and deliberate environment-specific configuration. Where rebuilding is unavoidable, record why and compare the resulting outputs rather than assuming equivalence.",
          "Our example has development, staging and production. Each environment has its own table and API endpoint. The release manifest records a source revision, artifact digest, function version and configuration version. It does not contain credentials. A reviewer should be able to answer which exact candidate passed integration tests and whether production will receive that candidate. Labels such as stable are useful navigation aids, but without a recorded immutable identifier they cannot establish what ran at a past point in time."
        ],
        "sourceIds": [
          "ops-d3",
          "ops-alias"
        ]
      },
      {
        "id": "stages",
        "title": "2. A REST API stage points to a deployment",
        "body": [
          "For API Gateway REST APIs, a stage is a named reference to an API deployment snapshot. Stage settings can include logging, throttling and stage variables. Editing a resource definition and expecting an existing stage to immediately reflect a new snapshot is a common source of confusion. Check what deployment the stage actually references. This chapter uses REST API semantics explicitly; do not transfer every stage feature unchanged to HTTP APIs.",
          "Suppose staging returns the new response shape but production returns the old one. First compare the stage deployment identifiers and backend targets. Do not immediately assume browser caching or a Lambda race. A custom domain adds another mapping layer: verify DNS, certificate and API/base-path mapping as well as the underlying stage. A friendly hostname does not itself select the correct revision. Testing both the direct stage endpoint and the intended custom-domain route can isolate mapping problems without changing business logic."
        ],
        "sourceIds": [
          "ops-stage",
          "ops-domain"
        ]
      },
      {
        "id": "variables",
        "title": "3. Configuration is not a secret container",
        "body": [
          "REST API stage variables can parameterize supported integration settings, such as selecting an environment-specific backend. They are not a secret-management mechanism. A variable naming a Lambda alias still requires the relevant invocation permission; naming a target does not authorize the gateway to invoke it. Keep the configuration vocabulary narrow and documented so a typo cannot silently redirect a test to production.",
          "The manifest below is an original release-planning document, not an AWS API payload. It shows the information a team might review together. The staging table is deliberately different from the production table, and the artifact digest stays constant. Real applications must also define how their runtime reads configuration and how a change is refreshed. AppConfig is useful when configuration rollout needs validation and controlled exposure; an ordinary environment variable may be adequate for a static nonsecret value. Select the mechanism from the change requirements, not from a habit of putting every setting in one place."
        ],
        "sourceIds": [
          "ops-variables",
          "ops-config"
        ],
        "code": "{\n  \"revision\": \"reviewed-commit-demo\",\n  \"artifactDigest\": \"sha256:illustrative-not-a-real-image\",\n  \"staging\": {\"alias\": \"candidate\", \"table\": \"OrdersStaging\", \"configVersion\": \"18\"},\n  \"production\": {\"alias\": \"live\", \"table\": \"OrdersProduction\", \"configVersion\": \"17\"}\n}",
        "language": "json"
      },
      {
        "id": "aliases",
        "title": "4. Version pinning makes approval meaningful",
        "body": [
          "A Lambda alias points to a published function version and can be updated to another version; supported weighted aliases can split traffic between two versions. An alias is therefore a stable application-facing name with a controlled target, not an immutable version itself. Record the version behind candidate when testing and the version behind live when releasing. If a caller invokes an unqualified function instead, it may bypass the intended alias-based promotion path.",
          "Container release tags serve a related human workflow, but tag mutability must be considered. An approved digest is stronger evidence than “whatever staging currently points at.” Amplify Hosting can create separate deployments from connected branches, which supports feature previews and integration workflows. Branch deployment does not automatically guarantee isolated data, approved secrets or identical backend configuration. Review those dependencies explicitly. The exam also names other environment tools; this chapter teaches the version-isolation decision rather than implying every tool has identical commands or lifecycle semantics."
        ],
        "sourceIds": [
          "ops-alias",
          "ops-branch",
          "ops-image"
        ]
      },
      {
        "id": "stack-update",
        "title": "5. Update an existing environment without losing its identity",
        "body": [
          "A staging stack update should be a deliberate update to the intended stack, not an accidental creation of a second environment with different data. Confirm account, Region, stack name and parameter values before any real operation. Inspect the proposed infrastructure change and distinguish a harmless property update from replacement of a durable resource. Ensure the test runner consumes current stack outputs after deployment instead of a copied endpoint from an earlier run.",
          "Work through a failure: a new test deployment succeeds, but integration tests continue to exercise the old API. The likely repair is not a new application release. Inspect how test configuration obtains the endpoint, whether an old output file was reused and which stage the URL includes. Add a release assertion that records or checks the expected revision in safe diagnostic metadata. This makes the next stale-target failure visible without relying on a person to notice a surprising response body."
        ],
        "sourceIds": [
          "ops-change",
          "ops-stage",
          "ops-testing"
        ]
      },
      {
        "id": "promotion-exercise",
        "title": "6. Use an explicit promotion checklist",
        "body": [
          "Before promotion, answer six concrete questions: which revision passed; which artifact will deploy; which configuration changes; which dependencies are isolated; which traffic entry point will move; and how a failed release will be detected and reversed. These questions connect branches, aliases, stages and infrastructure rather than treating them as separate vocabulary flashcards. A correct release plan can still be blocked by missing permissions, invalid certificates or resource limits, so preserve service-specific evidence as well.",
          "For the paper exercise, move candidate version twelve into live while keeping production’s table separate from staging. Decide whether configuration version eighteen is part of the same release or a later controlled change. Then describe rollback: restore the previous application target and, if necessary, the previous compatible configuration. Explain why rolling back code cannot automatically reverse database writes already accepted by the new version. The goal is a reproducible decision record, not memorization of a particular console button sequence."
        ],
        "sourceIds": [
          "ops-alias",
          "ops-rollback",
          "ops-config"
        ]
      },
      {
        "id": "config-selection",
        "title": "7. C03 configuration-service selection",
        "body": [
          "C03 names several environment-configuration mechanisms explicitly. Parameter Store can hold named configuration values and supports SecureString where encrypted values are needed; Secrets Manager is appropriate when the requirement includes managed secret lifecycle such as rotation. AppConfig adds validation and controlled configuration rollout. A Lambda environment setting and a REST API stage variable have their own update and exposure semantics. They are not interchangeable just because all can influence behavior.",
          "For the release manifest, keep a parameter name or secret reference rather than copying the secret value into source. Define which runtime identity retrieves the value and whether its cache can tolerate rotation. A successful stack update does not prove that a long-lived application cache refreshed. Test that boundary using safe sentinel values in an isolated environment. The selection exercise is to explain the required lifecycle—static setting, named lookup, rotating credential or progressive feature release—before choosing the service."
        ],
        "sourceIds": [
          "ops-config",
          "ops-variables",
          "ops-c03-d3",
          "ops-parameters",
          "ops-rotation"
        ]
      }
    ],
    "checks": [
      {
        "question": "A Lambda alias named candidate passed tests yesterday. Is the alias name alone enough release evidence?",
        "options": [
          "Yes; an alias grants all downstream permissions",
          "Yes; aliases prevent every data migration problem",
          "No; record the published version it targeted during testing",
          "Yes; aliases can never change"
        ],
        "answer": 2,
        "explanations": [
          "Aliases do not replace the execution role or resource policies.",
          "Traffic pointers do not guarantee schema compatibility.",
          "Correct: a mutable pointer must be tied to an immutable tested version.",
          "Aliases are updateable references."
        ]
      },
      {
        "question": "A REST API stage variable selects a backend function but invocation is denied. What is missing from the assumption?",
        "options": [
          "Stage variables replace the function execution role",
          "Target selection does not itself supply invocation permission",
          "Stage variables automatically encrypt all secrets",
          "Increasing the variable name length grants permission"
        ],
        "answer": 1,
        "explanations": [
          "The runtime role is a separate permission boundary.",
          "Correct: verify the separate authorization path.",
          "Stage variables are not intended as a secret store.",
          "Names do not authorize actions."
        ]
      },
      {
        "question": "Staging tests pass, but logs show yesterday’s revision. What should you inspect first?",
        "options": [
          "The endpoint, stage and stack-output discovery used by the tests",
          "The number of assertions in unrelated unit tests",
          "The color of the deployment dashboard",
          "Publish the same candidate again without checking the target"
        ],
        "answer": 0,
        "explanations": [
          "Correct: the test may have targeted an old deployment.",
          "Assertion count does not explain a stale target.",
          "Presentation does not establish release identity.",
          "Repetition can leave the stale test URL unchanged."
        ]
      }
    ],
    "relatedMission": "deployment",
    "taskIds": [
      "3.1",
      "3.2",
      "3.3",
      "3.4"
    ],
    "serviceIds": [
      "api",
      "lambda",
      "amplify",
      "appconfig",
      "cloudformation",
      "systems-manager",
      "secrets-manager"
    ],
    "domain": "deployment",
    "coverageNotes": [
      "DVA-C02: Substantive reading and worked examples for skills 3.1.3, 3.1.5, 3.2.3–3.2.4, 3.3.2–3.3.5, 3.4.2–3.4.4, 3.4.9–3.4.10; not a claim of complete service documentation or tested cloud behavior.",
      "Official sources checked 2026-11-01. Exam task coverage is distinguished from newer product features; no question-frequency claim.",
      "Commands and infrastructure snippets are for inspection only. Running them elsewhere requires your own account authorization, cost review, complete permissions, and cleanup plan.",
      "DVA-C03 reading and worked examples: 3.1.3–3.1.5, 3.2.4, 3.3.3, 3.3.8. C03-specific extensions are labeled; shared foundations remain relevant to both versions."
    ],
    "examVersions": [
      "DVA-C02",
      "DVA-C03"
    ],
    "versionTaskIds": {
      "DVA-C02": [
        "3.1",
        "3.2",
        "3.3",
        "3.4"
      ],
      "DVA-C03": [
        "3.1",
        "3.2",
        "3.3"
      ]
    }
  },
  {
    "id": "build-pipelines",
    "title": "Build, test and hand off the right artifact",
    "kicker": "DEPLOYMENT · C02 24% / C03 22%",
    "summary": "Read buildspec phases, artifact boundaries and pipeline evidence instead of treating CI/CD as a single green button.",
    "objectives": [
      "Prerequisites: basic application code, IAM roles, and the serverless chapter.",
      "Explain decisions and diagnose the worked failures before checking the answers.",
      "DVA-C02 mapping: 3.1.1–3.1.3, 3.4.6–3.4.7, 3.4.9, 4.1.6. Examples are original teaching snippets, not deployed or AWS-tested.",
      "DVA-C03 mapping: 3.1.1, 3.1.3, 3.3.5, 3.3.8–3.3.9, 4.1.4. The C03 task numbers are not assumed equivalent to C02."
    ],
    "sections": [
      {
        "id": "chain",
        "title": "1. Trace one revision through the release chain",
        "body": [
          "A pipeline is an orchestrated sequence of actions, not one program that automatically understands the application. A source action produces an artifact; a build action consumes it and may produce another; tests and deployment actions operate on named inputs. Preserve the source revision across that chain. If the build independently downloads the moving main branch instead of consuming its pipeline input, the deployed output might no longer match the revision that triggered the execution.",
          "Draw the teaching flow as SourceArtifact → Build → ReleaseArtifact → Staging → Verification → Approval → Production. The names are illustrative but the handoffs are real concepts. Ask which action owns each transformation and which evidence it emits. A manual approval is a decision gate, not a replacement for tests. An automatically triggered pipeline still requires configured source events, authorized service roles, valid provider settings and a meaningful failure policy. A repository commit alone does not prove any downstream action completed."
        ],
        "sourceIds": [
          "ops-structure",
          "ops-pipeline"
        ]
      },
      {
        "id": "buildspec",
        "title": "2. Read buildspec as a program with outputs",
        "body": [
          "A CodeBuild buildspec describes commands and related settings in YAML. In the example, install prepares locked dependencies, build runs checks and creates the distribution, and post_build records a message. The artifact rule collects files beneath dist. If the project produces build instead, a successful command sequence can still fail to provide the artifact the next action expects. Review the output directory and files pattern together rather than treating either as cosmetic metadata.",
          "This example assumes the repository defines the named npm scripts and a compatible build image. It is not a universal template for every language. Do not append a command that hides a failing test exit status merely to reach packaging. If the application publishes test reports, configure the appropriate report format and path separately from deployable artifacts. Reports help explain failures; they should not accidentally become the production website. The displayed commands are not run by this playground."
        ],
        "sourceIds": [
          "ops-build"
        ],
        "code": "version: 0.2\nphases:\n  install:\n    commands:\n      - npm ci\n  build:\n    commands:\n      - npm run test:ci\n      - npm run build\n  post_build:\n    commands:\n      - echo \"Inspect test results and artifact metadata\"\nartifacts:\n  base-directory: dist\n  files:\n    - '**/*'\n# Requires a repository that defines test:ci and build and produces dist.",
        "language": "yaml"
      },
      {
        "id": "secrets-artifacts",
        "title": "3. Separate build identity, secrets and deliverables",
        "body": [
          "The build service role needs the actions required by the build, such as reading source artifacts, writing output and accessing explicitly approved secret references. It should not receive unrestricted access because one download failed. Dependency authentication and deployment authorization are separate checks. A CodeArtifact token can authorize package tooling only within the permissions and lifetime involved; placing it in a frontend artifact is still a disclosure.",
          "Use supported secret references rather than committing plaintext values to buildspec or source. A secret made available to a build can still leak if a command prints it or bundles it into client code. Inspect the output, not just the input settings. The artifact store has its own access and encryption requirements, so a later action may fail to read a perfectly valid ZIP. Debug the caller, object location and relevant key permissions instead of rebuilding identical bytes repeatedly. A new artifact cannot repair an unchanged authorization denial."
        ],
        "sourceIds": [
          "ops-build",
          "ops-pipeline"
        ]
      },
      {
        "id": "ordering",
        "title": "4. Handoffs and order express dependencies",
        "body": [
          "Within a pipeline, action ordering determines which work can proceed together and which waits for earlier work. Actions at the same run order can execute in parallel when their prerequisites permit it; later run orders express sequencing. Ensure input artifact names refer to actual producer outputs. Do not place a verification action in parallel with the deployment it must inspect and then assume the result validates that deployment.",
          "For a worked failure, a deploy action expects ReleaseArtifact but the build publishes WebBundle. Compare the action definitions first. A successful build does not create every artifact name a consumer happens to request. Repair the producer-consumer contract and rerun the affected candidate. Then consider concurrency between pipeline executions: a queued release, a superseded waiting execution and parallel releases have different ordering risks. The site’s mode selector illustrates those choices; it does not emulate the full scheduler or guarantee safety when two executions modify the same environment."
        ],
        "sourceIds": [
          "ops-pipeline",
          "ops-structure"
        ]
      },
      {
        "id": "failure-evidence",
        "title": "5. Find the first failed boundary",
        "body": [
          "A top-level pipeline failure is only the entry point for investigation. Follow the action execution into CodeBuild logs, deployment events or CloudFormation resource events. Record the first actionable error and the exact artifact revision. A missing command, invalid YAML, failed test, absent artifact, denied key access and application health failure require different fixes. Treating all of them as “deployment failed” discards the evidence needed to choose a repair.",
          "Imagine a build successfully creates a bundle, but deployment reports an access denial reading it. The source code need not change. Confirm the deployment action’s role and artifact permissions, including encryption if applicable. Conversely, a compiler error in the build phase is not repaired by altering the deployment role. After a fix, rerun with a traceable input and retain enough logs to compare the failure with success. Do not paste secrets into an incident report just because the relevant error appeared near a credential-setting command."
        ],
        "sourceIds": [
          "ops-build",
          "ops-cfnfailure"
        ]
      },
      {
        "id": "ai-ci",
        "title": "6. C03 extension: AI-assisted gates remain accountable",
        "body": [
          "DVA-C03 explicitly adds AWS AI assistance to CI/CD workflows. A safe learning design supplies a redacted deployment summary, known acceptance criteria and test output to an approved assistant, then asks for anomalies or missing checks. The assistant might identify that no rollback evidence exists or propose a post-deployment smoke test. Its suggestion is supporting evidence, not an authorization to provision resources or bypass an approval gate. Tool permissions and release policy must remain independently enforced.",
          "For a paper exercise, an AI summary says “safe to release” while the integration-test artifact is absent. The correct response is to stop and obtain the missing evidence, not to reinterpret the summary as a passing test. If policy allows automated approval for a bounded class of changes, encode and audit those rules rather than delegating unrestricted judgment to free-form text. Review generated infrastructure and tests before use. This app does not call an AI service, create environments, or approve a real deployment; the workflow is an examined design pattern."
        ],
        "sourceIds": [
          "ops-q",
          "ops-qsecurity",
          "ops-c03-d3"
        ]
      }
    ],
    "checks": [
      {
        "question": "CodeBuild creates dist, but the buildspec collects build. What should you inspect?",
        "options": [
          "Only the display label of the pipeline",
          "The artifact base directory and files rules",
          "Only the Lambda timeout",
          "Only the API authorization header"
        ],
        "answer": 1,
        "explanations": [
          "A cosmetic label does not change collected files.",
          "Correct: the build output and packaging contract disagree.",
          "Runtime timeout does not choose the build artifact directory.",
          "API client authentication does not repair artifact selection."
        ]
      },
      {
        "question": "A test action must verify a newly deployed environment. Which ordering mistake matters?",
        "options": [
          "Running it in parallel with the deployment it must verify",
          "Giving the action a descriptive name",
          "Recording the source revision",
          "Using a distinct artifact name for the build output"
        ],
        "answer": 0,
        "explanations": [
          "Correct: the test can race ahead of its prerequisite.",
          "A clear name improves diagnosis.",
          "Revision evidence is useful and does not cause this race.",
          "Distinct names are useful when producer and consumer agree."
        ]
      },
      {
        "question": "An AI deployment summary recommends release but test evidence is missing. What is appropriate?",
        "options": [
          "Treat the recommendation as an executed test",
          "Grant the assistant unrestricted deployment permissions",
          "Ignore the missing artifact because the source commit exists",
          "Require the actual evidence under the release policy"
        ],
        "answer": 3,
        "explanations": [
          "A summary cannot establish unperformed testing.",
          "Broader permissions do not repair missing evidence and increase risk.",
          "A source revision alone does not establish test execution.",
          "Correct: generated text is not proof a gate passed."
        ]
      }
    ],
    "relatedMission": "deployment",
    "taskIds": [
      "3.1",
      "3.4",
      "4.1"
    ],
    "serviceIds": [
      "codebuild",
      "codepipeline",
      "codeartifact",
      "cloudformation",
      "q-developer"
    ],
    "domain": "deployment",
    "coverageNotes": [
      "DVA-C02: Substantive reading and worked examples for skills 3.1.1–3.1.3, 3.4.6–3.4.7, 3.4.9, 4.1.6; not a claim of complete service documentation or tested cloud behavior.",
      "Official sources checked 2026-11-01. Exam task coverage is distinguished from newer product features; no question-frequency claim.",
      "Commands and infrastructure snippets are for inspection only. Running them elsewhere requires your own account authorization, cost review, complete permissions, and cleanup plan.",
      "DVA-C03 reading and worked examples: 3.1.1, 3.1.3, 3.3.5, 3.3.8–3.3.9, 4.1.4. C03-specific extensions are labeled; shared foundations remain relevant to both versions."
    ],
    "examVersions": [
      "DVA-C02",
      "DVA-C03"
    ],
    "versionTaskIds": {
      "DVA-C02": [
        "3.1",
        "3.4",
        "4.1"
      ],
      "DVA-C03": [
        "3.1",
        "3.3",
        "4.1"
      ]
    }
  },
  {
    "id": "progressive-release",
    "title": "Choose rollout and rollback mechanisms deliberately",
    "kicker": "DEPLOYMENT · C02 24% / C03 22%",
    "summary": "Compare traffic shifts, instance updates and configuration releases; inspect AppSpec and health gates before moving users.",
    "objectives": [
      "Prerequisites: basic application code, IAM roles, and the serverless chapter.",
      "Explain decisions and diagnose the worked failures before checking the answers.",
      "DVA-C02 mapping: 3.1.5, 3.4.5, 3.4.8, 3.4.11. Examples are original teaching snippets, not deployed or AWS-tested.",
      "DVA-C03 mapping: 3.1.4, 3.3.2, 3.3.4, 3.3.6–3.3.7. The C03 task numbers are not assumed equivalent to C02."
    ],
    "sections": [
      {
        "id": "strategy-contract",
        "title": "1. Define what changes and what must remain healthy",
        "body": [
          "A deployment strategy controls how a new revision becomes active, but the unit of change depends on the platform. Updating files on EC2 instances, shifting a Lambda alias between versions and replacing ECS tasks are not the same operation. Start with the target platform, the current revision, the candidate revision and the health signal that will decide whether to continue. A strategy name without those details is not a complete release plan.",
          "All-at-once minimizes transition complexity but exposes the full traffic or fleet more quickly. Canary release starts with a smaller exposure before the remainder moves; linear release increases exposure in repeated increments. Blue/green separates old and new environments or resource sets so traffic can move between them. Rolling release replaces portions gradually. Availability, capacity, session behavior and data compatibility influence the choice. These are tradeoffs, not a universal ranking where one strategy is always safest or cheapest."
        ],
        "sourceIds": [
          "ops-strategy"
        ]
      },
      {
        "id": "platforms",
        "title": "2. Platform-specific configuration matters",
        "body": [
          "For CodeDeploy’s Lambda platform, traffic shifting works with published function versions and an alias. ECS blue/green deployment uses task-set and load-balancing concepts. EC2/on-premises deployment configuration reasons about healthy hosts and the installation lifecycle. Do not paste a Lambda AppSpec into an EC2 deployment and expect a generic parser to infer the desired behavior. The file format and resource properties must match the platform.",
          "The Lambda fragment identifies an alias and the current and target versions. Its validation hooks are placeholders for functions that must implement the deployment lifecycle contract; writing their names in YAML does not create them. Before traffic movement, verify the application can read data produced by both revisions during the overlap. A canary cannot make an incompatible schema migration harmless. If version twelve writes data that version eleven cannot read, “send traffic back to eleven” is not a sufficient recovery plan."
        ],
        "sourceIds": [
          "ops-appspec",
          "ops-alias"
        ],
        "code": "version: 0.0\nResources:\n  - OrdersFunction:\n      Type: AWS::Lambda::Function\n      Properties:\n        Name: Orders\n        Alias: live\n        CurrentVersion: \"11\"\n        TargetVersion: \"12\"\nHooks:\n  - BeforeAllowTraffic: ValidateCandidate\n  - AfterAllowTraffic: ValidateLive\n# Teaching fragment: versions, alias, hooks and roles must already be valid.",
        "language": "yaml"
      },
      {
        "id": "health-rollout",
        "title": "3. Tie exposure to a measurable release hypothesis",
        "body": [
          "For a worked canary, imagine sending a small fraction of requests to version twelve while watching error rate and latency compared with the stable version. Record the expected traffic volume and the evaluation window. A tiny canary may receive too few requests to reveal a defect, so “no alarms” is not equivalent to “proven correct.” Include functional validation and inspect whether telemetry is arriving. Missing data can hide a problem as easily as a poorly chosen threshold.",
          "Choose signals that reflect the changed behavior. A healthy process can still reject every business request; a low average latency can conceal a slow tail. Keep the deployment identifier and version in safe observability metadata so failures can be attributed to the candidate. Do not use an unrestricted customer identifier as a high-cardinality metric dimension merely to make correlation easier. Logs and traces are better places for detailed request context, subject to privacy controls."
        ],
        "sourceIds": [
          "ops-strategy",
          "ops-alarm",
          "ops-xray"
        ]
      },
      {
        "id": "rollback",
        "title": "4. Rollback is another operation with prerequisites",
        "body": [
          "CodeDeploy rollback redeploys a previously deployed revision as a new deployment, with its own deployment identifier. Configure the relevant failure or alarm conditions if automatic rollback is desired; do not assume attaching a dashboard creates recovery behavior. A manual rollback is also a deliberate action, not an erasure of history. Preserve the failed candidate and the recovery record so investigators can explain what happened.",
          "Rollback may restore application behavior while leaving data changes, external side effects or incompatible configuration untouched. In the order example, customers might already have submitted new-format orders. Plan compatible readers, staged migrations and separate data recovery where necessary. A rollback can itself fail because of permissions, unavailable artifacts or broken hooks. Test recovery procedures in an authorized isolated environment instead of discovering these dependencies during an incident. In this browser lesson, toggling rollback only models a decision path; it does not perform a deployment."
        ],
        "sourceIds": [
          "ops-rollback",
          "ops-change"
        ]
      },
      {
        "id": "appconfig",
        "title": "5. Configuration releases need validation and observation",
        "body": [
          "AppConfig separates application, environment and configuration-profile concepts. Validators can catch structural or semantic problems before configuration is used: a JSON Schema can restrict a free-form document’s shape, while a Lambda validator can perform application-specific checks. Validation is not a prediction that every business effect will be desirable. A syntactically valid discount threshold can still cause an unexpected revenue change.",
          "Deployment strategy controls how configuration exposure grows and how long it is observed, including a final bake period. Associate appropriate monitoring and rollback behavior rather than shipping every feature flag to everyone instantly. Current documentation includes newer entity-based rollout capabilities; learn the underlying validation, exposure and observation concepts without assuming those newer details are all required by the exam. Runtime retrieval is another boundary: the application must obtain and refresh the configuration correctly. A completed control-plane release does not prove every process is reading the new value."
        ],
        "sourceIds": [
          "ops-config",
          "ops-validator"
        ]
      },
      {
        "id": "containers-c03",
        "title": "6. C03 extension: container orchestration is not image storage",
        "body": [
          "DVA-C03 explicitly calls out container deployment. ECR stores images; ECS task definitions describe how containers should run, including the image, resource settings, ports and roles. An ECS service manages the desired running tasks and deployment progression. Fargate is a compute option, not an image repository or an automatic replacement for task configuration. A new image in ECR does not by itself update every running service.",
          "An EKS workload uses Kubernetes manifests and its orchestration semantics; it is not configured with an ECS task definition. For a rolling update, consider how readiness affects traffic and how many old and new instances can coexist. A process that has started is not necessarily ready to serve. Verify the candidate image digest and health behavior before replacing the stable workload. The practical exam-scoped comparison is image artifact versus workload specification versus orchestration versus traffic health, not administration of an entire Kubernetes cluster. The playground does not provision either platform.",
          "Worked ECS capacity example: desired count four, minimumHealthyPercent fifty and maximumPercent two hundred permit a lower bound of two healthy tasks and an upper bound of eight tasks during the rolling update, subject to actual capacity and health. The lower bound rounds up and the upper bound rounds down. With desired count three and maximumPercent one hundred twenty-five, the upper bound rounds down to three, so there is no extra task slot from that setting. This arithmetic explains why a rollout can stall when neither stopping nor starting a task is allowed; it does not emulate scheduling or replace the full service configuration."
        ],
        "sourceIds": [
          "ops-strategy",
          "ops-health",
          "ops-ecs",
          "ops-rolling",
          "ops-eks",
          "ops-c03-d3"
        ]
      }
    ],
    "checks": [
      {
        "question": "Why is a Lambda AppSpec not interchangeable with an EC2 AppSpec?",
        "options": [
          "They describe different platform resources and lifecycle requirements",
          "YAML is supported only for Lambda",
          "An EC2 deployment has no health considerations",
          "The file name alone selects every platform behavior"
        ],
        "answer": 0,
        "explanations": [
          "Correct: the target platform determines the required schema and lifecycle.",
          "YAML is not unique to Lambda deployments.",
          "Host availability and installation health matter for EC2.",
          "The content and target configuration must match the platform."
        ]
      },
      {
        "question": "CodeDeploy rolls back a failed candidate. What happens conceptually?",
        "options": [
          "Every database write is automatically reversed",
          "The failed deployment record disappears",
          "The old revision no longer needs artifact access",
          "A previous revision is deployed again as a new deployment"
        ],
        "answer": 3,
        "explanations": [
          "Application rollback does not undo arbitrary data mutations.",
          "History remains important for diagnosis and audit.",
          "Recovery still depends on deployable artifacts and authorization.",
          "Correct: rollback has its own deployment execution and identity."
        ]
      },
      {
        "question": "A container image was pushed to ECR. What does that prove?",
        "options": [
          "The image’s readiness checks passed under live traffic",
          "The image is guaranteed to have no vulnerabilities",
          "The artifact is available there, not that a service is running the new revision",
          "All ECS and EKS workloads automatically updated"
        ],
        "answer": 2,
        "explanations": [
          "Image availability is not observed health.",
          "Pushing an artifact does not establish security review.",
          "Correct: storage, orchestration and runtime verification are separate.",
          "Running workloads need their own deployment process."
        ]
      }
    ],
    "relatedMission": "deployment",
    "taskIds": [
      "3.1",
      "3.4"
    ],
    "serviceIds": [
      "codedeploy",
      "lambda",
      "ecs",
      "appconfig",
      "cloudformation",
      "ecr",
      "eks"
    ],
    "domain": "deployment",
    "coverageNotes": [
      "DVA-C02: Substantive reading and worked examples for skills 3.1.5, 3.4.5, 3.4.8, 3.4.11; not a claim of complete service documentation or tested cloud behavior.",
      "Official sources checked 2026-11-01. Exam task coverage is distinguished from newer product features; no question-frequency claim.",
      "Commands and infrastructure snippets are for inspection only. Running them elsewhere requires your own account authorization, cost review, complete permissions, and cleanup plan.",
      "DVA-C03 reading and worked examples: 3.1.4, 3.3.2, 3.3.4, 3.3.6–3.3.7. C03-specific extensions are labeled; shared foundations remain relevant to both versions."
    ],
    "examVersions": [
      "DVA-C02",
      "DVA-C03"
    ],
    "versionTaskIds": {
      "DVA-C02": [
        "3.1",
        "3.4"
      ],
      "DVA-C03": [
        "3.1",
        "3.3"
      ]
    }
  },
  {
    "id": "observe-debug",
    "title": "Use logs and traces to isolate the failing boundary",
    "kicker": "TROUBLESHOOTING · C02 18% / C03 22%",
    "summary": "Build a causal explanation from structured events, trace spans and deployment evidence instead of collecting random screenshots.",
    "objectives": [
      "Prerequisites: basic application code, IAM roles, and the serverless chapter.",
      "Explain decisions and diagnose the worked failures before checking the answers.",
      "DVA-C02 mapping: 4.1.1–4.1.3, 4.1.5–4.1.7, 4.2.1–4.2.2, 4.2.4, 4.2.6–4.2.8. Examples are original teaching snippets, not deployed or AWS-tested.",
      "DVA-C03 mapping: 4.1.1–4.1.5, 4.2.1, 4.2.4–4.2.5. The C03 task numbers are not assumed equivalent to C02."
    ],
    "sections": [
      {
        "id": "signals",
        "title": "1. Different signals answer different questions",
        "body": [
          "Logging records events and context. Monitoring tracks selected measurements and conditions over time. Observability is the ability to reason about internal behavior from emitted evidence, especially when the question was not anticipated in advance. A dashboard can show that latency increased; logs and traces can help explain which requests and dependencies contributed. None is sufficient alone. A green dashboard may simply omit the failing path.",
          "Begin a root-cause investigation with a narrow symptom, time window, affected environment and release identifier. Write competing hypotheses: application validation changed, a dependency slowed, permissions changed, or the request reached a different backend. Then identify what evidence would distinguish them. This is more efficient than changing timeouts and permissions simultaneously. Preserve an incident timeline so a later improvement can be associated with the actual intervention rather than a coincidental traffic drop.",
          "Worked dashboard review: create a study layout with request volume, error rate and p95 duration widgets beside a narrowly scoped recent-errors log widget. Compare candidate and baseline releases over the same time interval. Confirm each widget uses the intended account, Region, dimensions and statistic; a one-minute sum and a five-minute average are not directly interchangeable evidence. If the candidate has lower volume, a lower raw error count may conceal a worse error rate. A log-query widget can link the aggregate change to representative request IDs, but frequent refreshes run further queries. Record the selected time range in the incident note so another reviewer can reproduce the view. A dashboard is an organized investigation surface, not proof that all application paths are healthy or that an alarm has an authorized response action."
        ],
        "sourceIds": [
          "ops-d4",
          "ops-xray",
          "ops-dashboards"
        ]
      },
      {
        "id": "structured",
        "title": "2. Make logs queryable and safe",
        "body": [
          "A structured log event uses consistent fields for operation, outcome, duration and correlation. Choose stable names and types. Record a request identifier and a safe release identifier so the same operation can be followed across components. Avoid logging passwords, authorization headers or full customer documents. Redaction should be part of the logging design, not a manual cleanup after an incident. A debug switch that suddenly prints every payload can turn a performance investigation into a data incident.",
          "The example intentionally includes an error category rather than a raw secret-bearing request. A timeout is distinct from an authorization denial; preserve that distinction in application error handling. Keep stack traces where appropriate, but ensure they do not expose sensitive arguments. Set retention and access rules consistent with the data recorded. More logs are not automatically better evidence: duplicated noise can hide the first failure, increase query volume and make a routine incident harder to understand."
        ],
        "sourceIds": [
          "ops-logs",
          "ops-best"
        ],
        "code": "{\"level\":\"ERROR\",\"operation\":\"CreateOrder\",\"requestId\":\"demo-r17\",\n \"release\":\"candidate-12\",\"dependency\":\"OrdersTable\",\n \"errorType\":\"AccessDenied\",\"durationMs\":42,\"environment\":\"staging\"}\n# Illustrative JSON event; no credentials or customer payload are included.",
        "language": "text"
      },
      {
        "id": "query",
        "title": "3. Query a hypothesis, then inspect representative events",
        "body": [
          "CloudWatch Logs Insights QL supports filtering, field selection and aggregation. Start with the relevant log groups and a narrow time range. The query below counts failures by error category and release, which can reveal whether a regression aligns with a candidate deployment. It does not prove causality: a release might coincide with a downstream outage. Follow the aggregate with representative request-level events and compare a successful request using the same dependency.",
          "For a worked exercise, imagine candidate twelve has twenty AccessDenied events and stable eleven has none. Check whether both revisions use the same execution role and table ARN, then inspect the changed policy or environment setting. Do not first raise the timeout: permission denial is not a slow operation. If the query returns no data, verify the log group, Region, time window and logging path before concluding the application is healthy. A missing log is an evidence gap, not proof of success."
        ],
        "sourceIds": [
          "ops-logs"
        ],
        "code": "fields @timestamp, requestId, release, errorType, durationMs\n| filter operation = \"CreateOrder\" and level = \"ERROR\"\n| stats count(*) as failures by release, errorType\n| sort failures desc\n# Logs Insights QL example over the structured fields used in this lesson.",
        "language": "text"
      },
      {
        "id": "trace",
        "title": "4. Follow latency through segments and downstream work",
        "body": [
          "X-Ray groups related segments into traces and can represent downstream operations with subsegments. A trace helps distinguish time spent inside the application from time waiting on another service. Propagate context across supported boundaries and configure instrumentation/export correctly. Sampling means not every request necessarily produces a stored trace, so absence of one trace cannot establish that the request never occurred. Logs with correlation identifiers remain useful alongside sampled traces.",
          "Annotations are indexed attributes useful for filtering traces; metadata is additional context that is not indexed the same way. Use low-risk attributes such as operation type or release category instead of secrets. In a worked trace, total request duration is 900 milliseconds and a database subsegment occupies 750 milliseconds. That suggests investigating the dependency path before optimizing a five-millisecond JSON conversion. It does not prove the database server itself consumed all 750 milliseconds; connection setup, retries and network time may also contribute. Inspect instrumentation boundaries before assigning blame."
        ],
        "sourceIds": [
          "ops-xray"
        ]
      },
      {
        "id": "deploy-health",
        "title": "5. Deployment and health evidence belong in the same story",
        "body": [
          "A pipeline status should lead to the failing service output: compiler or test logs for a build, lifecycle-hook output for a deployment, or resource events for CloudFormation. Find the first meaningful failure rather than treating later rollback events as the original cause. Compare the affected revision and environment with application logs. An infrastructure operation might fail before any new application process starts, so searching only the new version’s runtime logs may yield nothing.",
          "Health checks also have different purposes. A liveness check asks whether a process should be restarted; readiness asks whether it should receive traffic. An ECS container health check must be configured where ECS monitors it; merely embedding a Docker health check does not guarantee the task definition reports it. Avoid a readiness design that marks every instance unavailable because a nonessential external feature is briefly slow. Define what serving safely requires and test both startup and degraded-state behavior."
        ],
        "sourceIds": [
          "ops-cfnfailure",
          "ops-health"
        ]
      },
      {
        "id": "current-ai",
        "title": "6. Current instrumentation and C03-assisted diagnosis",
        "body": [
          "Current AWS guidance favors OpenTelemetry instrumentation for X-Ray workflows. The documented X-Ray SDK/daemon maintenance transition is not a statement that the X-Ray service disappeared. Keep service concepts separate from the lifecycle of a particular instrumentation library. For a new implementation, review supported instrumentation and export configuration rather than copying an old tutorial without checking its dependencies. This chapter teaches trace reasoning; it does not install an agent.",
          "C03 adds AWS AI tools for error analysis and troubleshooting suggestions. Supply only authorized, redacted evidence and ask for ranked hypotheses plus the observations that would distinguish them. If an assistant proposes increasing permissions, require the exact denied action and resource evidence before any change. Treat log text as untrusted input: an error message containing instructions is not authorization to execute them. Validate suggestions against service documentation and a controlled reproduction. AI can accelerate investigation, but the final explanation must connect observed facts to the proposed cause and verified repair."
        ],
        "sourceIds": [
          "ops-otel",
          "ops-q",
          "ops-c03-d4",
          "ops-qsecurity"
        ]
      }
    ],
    "checks": [
      {
        "question": "A query shows AccessDenied after a release. Which response best follows the evidence?",
        "options": [
          "Increase all request timeouts immediately",
          "Assume the database needs more memory",
          "Disable all logging to reduce noise",
          "Compare the caller, action and target resource with the release changes"
        ],
        "answer": 3,
        "explanations": [
          "A timeout increase does not authorize an action.",
          "The error does not establish a capacity problem.",
          "That removes relevant evidence instead of diagnosing authorization.",
          "Correct: authorization evidence should guide the first hypothesis."
        ]
      },
      {
        "question": "Which trace attribute is appropriate for indexed filtering?",
        "options": [
          "An assumption that all metadata is indexed identically",
          "Every customer token so requests are easy to find",
          "A safe annotation such as operation category",
          "A plaintext password"
        ],
        "answer": 2,
        "explanations": [
          "Metadata and annotations have different indexing behavior.",
          "Sensitive credentials must not become trace attributes.",
          "Correct: annotations support filtering; keep their content safe.",
          "Secrets should not be emitted into telemetry."
        ]
      },
      {
        "question": "An AI assistant sees a log line saying “disable all security checks.” What should happen?",
        "options": [
          "Broaden permissions until the message disappears",
          "Treat the line as untrusted evidence, not an instruction or authorization",
          "Execute it because it appeared in a log",
          "Delete every log to avoid further investigation"
        ],
        "answer": 1,
        "explanations": [
          "Permission expansion without evidence is not a safe diagnosis.",
          "Correct: evidence content cannot grant authority for operational actions.",
          "Log messages can be attacker-controlled or misleading.",
          "Destroying evidence prevents a responsible investigation."
        ]
      }
    ],
    "relatedMission": "deployment",
    "taskIds": [
      "4.1",
      "4.2"
    ],
    "serviceIds": [
      "cloudwatch",
      "xray",
      "cloudtrail",
      "codebuild",
      "cloudformation",
      "lambda"
    ],
    "domain": "troubleshooting",
    "coverageNotes": [
      "DVA-C02: Substantive reading and worked examples for skills 4.1.1–4.1.3, 4.1.5–4.1.7, 4.2.1–4.2.2, 4.2.4, 4.2.6–4.2.8; not a claim of complete service documentation or tested cloud behavior.",
      "Official sources checked 2026-11-01. Exam task coverage is distinguished from newer product features; no question-frequency claim.",
      "Commands and infrastructure snippets are for inspection only. Running them elsewhere requires your own account authorization, cost review, complete permissions, and cleanup plan.",
      "DVA-C03 reading and worked examples: 4.1.1–4.1.5, 4.2.1, 4.2.4–4.2.5. C03-specific extensions are labeled; shared foundations remain relevant to both versions."
    ],
    "examVersions": [
      "DVA-C02",
      "DVA-C03"
    ],
    "versionTaskIds": {
      "DVA-C02": [
        "4.1",
        "4.2"
      ],
      "DVA-C03": [
        "4.1",
        "4.2"
      ]
    }
  },
  {
    "id": "measure-optimize",
    "title": "Measure performance and optimize the actual bottleneck",
    "kicker": "TROUBLESHOOTING · C02 18% / C03 22%",
    "summary": "Connect custom metrics, alarms, concurrency, caching and messaging to a measurable hypothesis.",
    "objectives": [
      "Prerequisites: basic application code, IAM roles, and the serverless chapter.",
      "Explain decisions and diagnose the worked failures before checking the answers.",
      "DVA-C02 mapping: 4.1.4–4.1.5, 4.2.3, 4.2.5, 4.3.1–4.3.9. Examples are original teaching snippets, not deployed or AWS-tested.",
      "DVA-C03 mapping: 4.2.2–4.2.3, 4.3.1–4.3.6. The C03 task numbers are not assumed equivalent to C02."
    ],
    "sections": [
      {
        "id": "metric-contract",
        "title": "1. A useful metric has a stable meaning",
        "body": [
          "A metric needs a namespace, name, dimensions, unit and interpretation. For an order service, OrderLatency in milliseconds is different from FailedOrders as a count. Decide whether the value represents an individual operation, a period total or another statistic before choosing an alarm. An average can hide slow outliers; a raw failure count can rise simply because traffic rose. Compare error rate and request volume when evaluating a release.",
          "Custom metrics can be published directly or extracted from logs using embedded metric format. EMF combines a structured log event with metric metadata so detailed context and a numerical signal can originate together. Use low-cardinality dimensions such as service and environment. A request ID used as a dimension can create a separate metric series for each request; keep detailed correlation fields outside the dimension set. Current documentation also recommends OpenTelemetry for new custom-metric implementations. Learn the metric contract rather than assuming one transport is always required."
        ],
        "sourceIds": [
          "ops-metric",
          "ops-emf"
        ]
      },
      {
        "id": "emf-example",
        "title": "2. Inspect the EMF document, not just the log line",
        "body": [
          "The example embeds OrderLatency under a study namespace and defines Service as its dimension. The Timestamp is an illustrative epoch-millisecond value; a real emitter should use the actual event time. The numeric metric field is present at the document root, and the metadata declares its unit. Merely printing a JSON field named latency does not automatically make it a custom metric without the appropriate extraction path.",
          "A worked troubleshooting case: logs arrive, but the expected metric is absent. Inspect the EMF structure, metric name and dimension values before changing an alarm threshold. Confirm the log delivery and relevant extraction behavior. With EMF, log-ingestion permission is central; a separate direct PutMetricData call is not implied. Also avoid treating extracted counts as a perfectly deduplicated transaction ledger: current EMF documentation notes at-least-once extraction and possible duplicates. Financial or durable business truth belongs in an appropriate system of record."
        ],
        "sourceIds": [
          "ops-emf",
          "ops-emfspec"
        ],
        "code": "{\n  \"_aws\": {\n    \"Timestamp\": 1793494800000,\n    \"CloudWatchMetrics\": [{\n      \"Namespace\": \"Study/Orders\", \"Dimensions\": [[\"Service\"]],\n      \"Metrics\": [{\"Name\": \"OrderLatency\", \"Unit\": \"Milliseconds\"}]\n    }]\n  },\n  \"Service\": \"orders\", \"OrderLatency\": 42,\n  \"requestId\": \"demo-r17\"\n}",
        "language": "json"
      },
      {
        "id": "alarm",
        "title": "3. An alarm needs a response and a missing-data policy",
        "body": [
          "Define the statistic, period, threshold and evaluation rule together. In a simple complete-window example, a two-of-three alarm with a strict greater-than-five threshold sees values two, eight and nine: two periods breach, so the example is ALARM. Values five, five and five do not breach a strict greater-than comparison. This arithmetic is not the full CloudWatch evaluation algorithm, which also has missing-data behavior and other options.",
          "Choose how absent data should be interpreted for the signal. A sparse error metric and a heartbeat metric have different meanings when nothing arrives. An alarm state alone does not guarantee a person was notified or a rollback occurred: configure the action and verify its destination permissions and operational ownership. Notifications about deployment completion or quota pressure can also come from appropriate event-driven workflows. Every alert should answer who acts, what they inspect and what safe next step is expected. Otherwise more alarms may simply produce ignored noise."
        ],
        "sourceIds": [
          "ops-alarm"
        ]
      },
      {
        "id": "concurrency-profile",
        "title": "4. Profile before changing capacity",
        "body": [
          "Concurrency is simultaneous work, not requests per second. As a rough steady-state estimate, fifty requests per second lasting two-tenths of a second imply about ten concurrent requests, before bursts and variability. Lambda reserved concurrency both reserves a share of concurrency and caps that function; it does not itself preinitialize warm execution environments. Provisioned concurrency addresses initialized capacity and has its own configuration and cost considerations. A larger concurrency limit can overwhelm a downstream database if connection capacity is ignored.",
          "Profile where time is spent: CPU computation, dependency calls, connection setup, serialization or retries. Compare the same workload across memory settings; Lambda CPU allocation changes with memory. Reuse suitable SDK clients and connections across invocations when safe, but do not retain one user’s sensitive state for another request. For threaded or pooled applications, bound thread and connection pools to downstream capacity. Collect duration distributions, errors and resource consumption rather than optimizing one isolated benchmark number.",
          "C03 also names EC2 Auto Scaling and pool management. Changing desired instance capacity is not the same as changing the number of requests a single process can handle. Scale-out takes time for instances and applications to become ready; a policy must use a signal related to demand and capacity. In a paper comparison, two instances with ten safe database connections each permit at most twenty such pooled connections before other limits, whereas doubling thread count without changing the pool can merely increase waiting. Measure queueing and downstream pressure before deciding which capacity boundary to change."
        ],
        "sourceIds": [
          "ops-concurrency",
          "ops-memory",
          "ops-best",
          "ops-provisioned",
          "ops-scaling"
        ]
      },
      {
        "id": "cache",
        "title": "5. Cache the right key and preserve correctness",
        "body": [
          "Application-level cache-aside checks a cache, loads missing data from the source and stores it with a chosen lifetime. It can reduce repeated reads but introduces stale-data and invalidation decisions. Write-through updates the cache as part of the write path, with different latency and failure tradeoffs. A TTL limits age but does not guarantee immediate consistency. Plan what happens when the cache is unavailable and when many callers miss the same key simultaneously.",
          "CloudFront cache behavior can vary by selected request headers. If the origin returns different language variants, the cache key must distinguish the intended variants; including every possible header can fragment the cache and reduce reuse. Never mix private responses across users through an unsafe key. DAX is a DynamoDB-specific acceleration choice, not a replacement for understanding read consistency or access patterns. Choose the cache location from the measured repeated work, then test correctness as well as hit rate and latency."
        ],
        "sourceIds": [
          "ops-cache",
          "ops-headers",
          "ops-dax"
        ]
      },
      {
        "id": "messaging-ai",
        "title": "6. Reduce unnecessary work and verify optimization claims",
        "body": [
          "SNS subscription filter policies can select messages by supported attributes or body content, depending on the configured scope. This reduces delivery to consumers that do not need an event instead of forcing every consumer to discard it afterward. A filter is not authorization and does not replace a dead-letter or retry strategy. For queue workers, inspect backlog age, processing time and downstream capacity before increasing concurrency or batch size. Faster consumption is not useful if it only creates more throttling and retries.",
          "C03 adds AWS AI assistance for finding optimization opportunities. Ask an approved tool to explain a redacted profile or suggest a measurable experiment, not to declare that a rewrite is faster without evidence. Compare before and after under the same workload and retain correctness tests. If a proposed cache improves latency but serves stale authorization-sensitive data, reject it. Optimization is a constrained experiment: define the target, preserve business and security invariants, measure the result and keep a rollback path. This site offers calculations and reasoning, not live performance measurements."
        ],
        "sourceIds": [
          "ops-sns",
          "ops-q",
          "ops-c03-d4",
          "ops-qsecurity"
        ]
      },
      {
        "id": "log-bottlenecks",
        "title": "7. Find a bottleneck in recorded durations",
        "body": [
          "Use a log query to compare duration distributions by release and dependency rather than relying only on error counts. The example assumes each completion event records a nonnegative numeric durationMs and a consistent dependency field. A p95 of eight hundred milliseconds for the payment dependency versus forty for the table suggests where to investigate next. Confirm sample counts: a percentile from two records is weak evidence, and missing completion logs can bias the result.",
          "In the worked experiment, compare the same workload before and after a connection-reuse change. If the payment p95 falls but total request p95 does not, another dependency or queueing stage may dominate the end-to-end path. Logs identify a candidate bottleneck; traces and profiling help explain it. Preserve correctness tests and do not infer that a correlation proves a remote service was at fault."
        ],
        "sourceIds": [
          "ops-logs",
          "ops-stats"
        ],
        "code": "fields release, dependency, durationMs\n| filter operation = \"CreateOrder\" and ispresent(durationMs)\n| stats count(*) as samples, avg(durationMs) as meanMs,\n        pct(durationMs, 95) as p95Ms by release, dependency\n| sort p95Ms desc\n# Compare a consistent event type and time window; this does not run here.",
        "language": "text"
      }
    ],
    "checks": [
      {
        "question": "Why keep requestId out of an EMF dimension set for ordinary latency monitoring?",
        "options": [
          "It automatically disables encryption",
          "Request IDs are forbidden in all logs",
          "It can create a separate metric series per request",
          "It is required to be the only dimension"
        ],
        "answer": 2,
        "explanations": [
          "Dimension selection is not an encryption switch.",
          "They can be useful safe correlation fields outside metric dimensions.",
          "Correct: high-cardinality dimensions can create excessive metric series and cost.",
          "Dimensions should reflect useful bounded aggregations, not this invented requirement."
        ]
      },
      {
        "question": "Reserved concurrency is increased, but database throttling worsens. What does that suggest?",
        "options": [
          "The database can never limit Lambda workloads",
          "The downstream capacity may be the bottleneck",
          "Concurrency means only average request rate",
          "More concurrent calls always reduce total load"
        ],
        "answer": 1,
        "explanations": [
          "Downstream limits can constrain otherwise scalable callers.",
          "Correct: admitting more simultaneous work can overload a dependency.",
          "Concurrency is in-flight work, not simply requests per second.",
          "Retries and contention can increase load."
        ]
      },
      {
        "question": "A cache makes requests faster but sometimes returns another user’s private response. What is the right conclusion?",
        "options": [
          "The cache-key/security design is incorrect despite the speedup",
          "The improvement is acceptable because average latency fell",
          "Increase TTL so the result is more stable",
          "Remove correctness tests before measuring the cache"
        ],
        "answer": 0,
        "explanations": [
          "Correct: correctness and isolation are nonnegotiable optimization constraints.",
          "Performance does not justify cross-user disclosure.",
          "A longer TTL can prolong the incorrect exposure.",
          "Correctness tests must remain part of the optimization experiment."
        ]
      }
    ],
    "relatedMission": "deployment",
    "taskIds": [
      "4.1",
      "4.2",
      "4.3"
    ],
    "serviceIds": [
      "cloudwatch",
      "lambda",
      "cloudfront",
      "elasticache",
      "dynamodb",
      "sns",
      "sqs",
      "ec2"
    ],
    "domain": "troubleshooting",
    "coverageNotes": [
      "DVA-C02: Substantive reading and worked examples for skills 4.1.4–4.1.5, 4.2.3, 4.2.5, 4.3.1–4.3.9; not a claim of complete service documentation or tested cloud behavior.",
      "Official sources checked 2026-11-01. Exam task coverage is distinguished from newer product features; no question-frequency claim.",
      "Commands and infrastructure snippets are for inspection only. Running them elsewhere requires your own account authorization, cost review, complete permissions, and cleanup plan.",
      "DVA-C03 reading and worked examples: 4.2.2–4.2.3, 4.3.1–4.3.6. C03-specific extensions are labeled; shared foundations remain relevant to both versions."
    ],
    "examVersions": [
      "DVA-C02",
      "DVA-C03"
    ],
    "versionTaskIds": {
      "DVA-C02": [
        "4.1",
        "4.2",
        "4.3"
      ],
      "DVA-C03": [
        "4.2",
        "4.3"
      ]
    }
  }
];
