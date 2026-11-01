# AWS architecture icon provenance

Verified: 2026-11-01. Package release: 2026-07-31.

Source: [AWS architecture icons](https://aws.amazon.com/architecture/icons/).

Downloaded package: [https://d1.awsstatic.com/onedam/marketing-channels/website/public/shared/architecture-icon-release/Icon-package_07312026.5846e92413caa21490223536cc97f1269e44fa92.zip](https://d1.awsstatic.com/onedam/marketing-channels/website/public/shared/architecture-icon-release/Icon-package_07312026.5846e92413caa21490223536cc97f1269e44fa92.zip).

## Use and handling

The official page describes use of its assets for architecture diagrams and related materials. This app uses them to identify AWS services in a learning diagram. No separate README, license, terms or usage-guidelines document was present in the ZIP (only image files and macOS metadata); consult the official page for current guidance. This note is provenance, not a claim of a broader license or AWS endorsement. AWS names and artwork belong to their respective owners.

All selected official SVG files are copied byte-for-byte, without recoloring, cropping or redrawing. `src/serviceIcons.ts` records original archive paths and SHA-256 hashes. Files are hosted locally under `public/aws-icons/`; there are no icon hotlinks. Only the selected assets are bundled, not archive metadata. Generic fallback artwork is separately app-authored and is never labeled official.

## Coverage and exceptions

The 47 legacy catalog entries retain their official artwork. 45 map to the named service icon; AWS STS uses the official STS resource icon under IAM. Amazon Q Developer uses the official Amazon Q family icon because the package has no separately named Q Developer SVG. The manifest labels that family mapping explicitly. There are no generic fallbacks among the 47 catalog mappings; a separate generic placeholder handles unknown IDs or load errors.

All selected official assets parsed as SVG. Verification checks reject scripts, foreign objects, event-handler attributes and external resource references; local gradient references are allowed.

## Mapping

| Catalog ID | Official artwork | Original package file |
|---|---|---|
| `athena` | Amazon Athena | `Architecture-Service-Icons_07312026/Arch_Analytics/48/Arch_Amazon-Athena_48.svg` |
| `kinesis` | Amazon Kinesis | `Architecture-Service-Icons_07312026/Arch_Analytics/48/Arch_Amazon-Kinesis_48.svg` |
| `opensearch` | Amazon OpenSearch Service | `Architecture-Service-Icons_07312026/Arch_Analytics/48/Arch_Amazon-OpenSearch-Service_48.svg` |
| `appsync` | AWS AppSync | `Architecture-Service-Icons_07312026/Arch_Application-Integration/48/Arch_AWS-AppSync_48.svg` |
| `eventbridge` | Amazon EventBridge | `Architecture-Service-Icons_07312026/Arch_Application-Integration/48/Arch_Amazon-EventBridge_48.svg` |
| `sns` | Amazon Simple Notification Service | `Architecture-Service-Icons_07312026/Arch_Application-Integration/48/Arch_Amazon-Simple-Notification-Service_48.svg` |
| `sqs` | Amazon Simple Queue Service | `Architecture-Service-Icons_07312026/Arch_Application-Integration/48/Arch_Amazon-Simple-Queue-Service_48.svg` |
| `step-functions` | AWS Step Functions | `Architecture-Service-Icons_07312026/Arch_Application-Integration/48/Arch_AWS-Step-Functions_48.svg` |
| `ec2` | Amazon EC2 | `Architecture-Service-Icons_07312026/Arch_Compute/48/Arch_Amazon-EC2_48.svg` |
| `elastic-beanstalk` | AWS Elastic Beanstalk | `Architecture-Service-Icons_07312026/Arch_Compute/48/Arch_AWS-Elastic-Beanstalk_48.svg` |
| `lambda` | AWS Lambda | `Architecture-Service-Icons_07312026/Arch_Compute/48/Arch_AWS-Lambda_48.svg` |
| `ecr` | Amazon Elastic Container Registry | `Architecture-Service-Icons_07312026/Arch_Containers/48/Arch_Amazon-Elastic-Container-Registry_48.svg` |
| `ecs` | Amazon Elastic Container Service | `Architecture-Service-Icons_07312026/Arch_Containers/48/Arch_Amazon-Elastic-Container-Service_48.svg` |
| `eks` | Amazon Elastic Kubernetes Service | `Architecture-Service-Icons_07312026/Arch_Containers/48/Arch_Amazon-Elastic-Kubernetes-Service_48.svg` |
| `aurora` | Amazon Aurora | `Architecture-Service-Icons_07312026/Arch_Databases/48/Arch_Amazon-Aurora_48.svg` |
| `dynamodb` | Amazon DynamoDB | `Architecture-Service-Icons_07312026/Arch_Databases/48/Arch_Amazon-DynamoDB_48.svg` |
| `elasticache` | Amazon ElastiCache | `Architecture-Service-Icons_07312026/Arch_Databases/48/Arch_Amazon-ElastiCache_48.svg` |
| `rds` | Amazon RDS | `Architecture-Service-Icons_07312026/Arch_Databases/48/Arch_Amazon-RDS_48.svg` |
| `amplify` | AWS Amplify | `Architecture-Service-Icons_07312026/Arch_Front-End-Web-Mobile/48/Arch_AWS-Amplify_48.svg` |
| `cloudshell` | AWS CloudShell | `Architecture-Service-Icons_07312026/Arch_Developer-Tools/48/Arch_AWS-CloudShell_48.svg` |
| `codeartifact` | AWS CodeArtifact | `Architecture-Service-Icons_07312026/Arch_Developer-Tools/48/Arch_AWS-CodeArtifact_48.svg` |
| `codebuild` | AWS CodeBuild | `Architecture-Service-Icons_07312026/Arch_Developer-Tools/48/Arch_AWS-CodeBuild_48.svg` |
| `codedeploy` | AWS CodeDeploy | `Architecture-Service-Icons_07312026/Arch_Developer-Tools/48/Arch_AWS-CodeDeploy_48.svg` |
| `codepipeline` | AWS CodePipeline | `Architecture-Service-Icons_07312026/Arch_Developer-Tools/48/Arch_AWS-CodePipeline_48.svg` |
| `xray` | AWS X Ray | `Architecture-Service-Icons_07312026/Arch_Developer-Tools/48/Arch_AWS-X-Ray_48.svg` |
| `q-developer` | Amazon Q (family icon for Q Developer) | `Architecture-Service-Icons_07312026/Arch_Artificial-Intelligence/48/Arch_Amazon-Q_48.svg` |
| `appconfig` | AWS AppConfig | `Architecture-Service-Icons_07312026/Arch_Management-Tools/48/Arch_AWS-AppConfig_48.svg` |
| `cdk` | AWS Cloud Development Kit | `Architecture-Service-Icons_07312026/Arch_Developer-Tools/48/Arch_AWS-Cloud-Development-Kit_48.svg` |
| `cloudformation` | AWS CloudFormation | `Architecture-Service-Icons_07312026/Arch_Management-Tools/48/Arch_AWS-CloudFormation_48.svg` |
| `cloudtrail` | AWS CloudTrail | `Architecture-Service-Icons_07312026/Arch_Management-Tools/48/Arch_AWS-CloudTrail_48.svg` |
| `cloudwatch` | Amazon CloudWatch | `Architecture-Service-Icons_07312026/Arch_Management-Tools/48/Arch_Amazon-CloudWatch_48.svg` |
| `cli` | AWS Command Line Interface | `Architecture-Service-Icons_07312026/Arch_Developer-Tools/48/Arch_AWS-Command-Line-Interface_48.svg` |
| `systems-manager` | AWS Systems Manager | `Architecture-Service-Icons_07312026/Arch_Management-Tools/48/Arch_AWS-Systems-Manager_48.svg` |
| `api` | Amazon API Gateway | `Architecture-Service-Icons_07312026/Arch_Networking-Content-Delivery/48/Arch_Amazon-API-Gateway_48.svg` |
| `cloudfront` | Amazon CloudFront | `Architecture-Service-Icons_07312026/Arch_Networking-Content-Delivery/48/Arch_Amazon-CloudFront_48.svg` |
| `elb` | Elastic Load Balancing | `Architecture-Service-Icons_07312026/Arch_Networking-Content-Delivery/48/Arch_Elastic-Load-Balancing_48.svg` |
| `route53` | Amazon Route 53 | `Architecture-Service-Icons_07312026/Arch_Networking-Content-Delivery/48/Arch_Amazon-Route-53_48.svg` |
| `vpc` | Amazon Virtual Private Cloud | `Architecture-Service-Icons_07312026/Arch_Networking-Content-Delivery/48/Arch_Amazon-Virtual-Private-Cloud_48.svg` |
| `cognito` | Amazon Cognito | `Architecture-Service-Icons_07312026/Arch_Security-Identity/48/Arch_Amazon-Cognito_48.svg` |
| `iam` | AWS Identity and Access Management | `Architecture-Service-Icons_07312026/Arch_Security-Identity/48/Arch_AWS-Identity-and-Access-Management_48.svg` |
| `kms` | AWS Key Management Service | `Architecture-Service-Icons_07312026/Arch_Security-Identity/48/Arch_AWS-Key-Management-Service_48.svg` |
| `secrets-manager` | AWS Secrets Manager | `Architecture-Service-Icons_07312026/Arch_Security-Identity/48/Arch_AWS-Secrets-Manager_48.svg` |
| `sts` | AWS STS (IAM resource icon) | `Resource-Icons_07312026/Res_Security-Identity/Res_AWS-Identity-Access-Management_AWS-STS_48.svg` |
| `waf` | AWS WAF | `Architecture-Service-Icons_07312026/Arch_Security-Identity/48/Arch_AWS-WAF_48.svg` |
| `ebs` | Amazon Elastic Block Store | `Architecture-Service-Icons_07312026/Arch_Storage/48/Arch_Amazon-Elastic-Block-Store_48.svg` |
| `efs` | Amazon EFS | `Architecture-Service-Icons_07312026/Arch_Storage/48/Arch_Amazon-EFS_48.svg` |
| `s3` | Amazon Simple Storage Service | `Architecture-Service-Icons_07312026/Arch_Storage/48/Arch_Amazon-Simple-Storage-Service_48.svg` |

## DVA-C03 canvas additions (checked 2026-11-01)

The official AWS icon page still links package release 2026-07-31. Nine new mappings come directly from that archive. Kiro uses its own official product-site SVG, downloaded from the icon link on https://kiro.dev/; it is not claimed to come from the AWS architecture package. All downloaded SVG bytes are preserved unchanged and hosted locally. The union canvas has 58 entries (56 C03 plus two retained legacy entries): 57 official mappings and one honest fallback.

AWS SAM has no specifically named icon in the official package checked. The AWS SAM product page and official project README did not expose a suitable standalone icon in this check. Its mapping uses the app generic fallback and is labeled nonofficial; the Serverless Application Repository icon is deliberately not substituted because that is a different product.

| ID | Artwork | Source | SHA-256 |
| --- | --- | --- | --- |
| `firehose` | Amazon Data Firehose | `Architecture-Service-Icons_07312026/Arch_Analytics/48/Arch_Amazon-Data-Firehose_48.svg` | `8bba0a1b04c3953d6a2dd45326dc5b13117aad63b10367e48a7cce6642e4b180` |
| `bedrock` | Amazon Bedrock | `Architecture-Service-Icons_07312026/Arch_Artificial-Intelligence/48/Arch_Amazon-Bedrock_48.svg` | `01c39972d595d848ffc91d31aa6087b033c65279f8416c7c9a6659bc54406182` |
| `agentcore` | Amazon Bedrock AgentCore | `Architecture-Service-Icons_07312026/Arch_Artificial-Intelligence/48/Arch_Amazon-Bedrock-AgentCore_48.svg` | `c715fe6dbc4b661c3cb9b57f8d2ea2176218cdf57b8298901c36c808d96b52e8` |
| `quick` | Amazon Quick | `Architecture-Service-Icons_07312026/Arch_Business-Applications/48/Arch_Amazon-Quick_48.svg` | `e225ca66260d8b8333548b3cf7b47adc325284080622aa3e3d3df2028726b722` |
| `cloudwatch-logs` | Amazon CloudWatch Logs (official resource icon) | `Resource-Icons_07312026/Res_Management-Governance/Res_Amazon-CloudWatch_Logs_48.svg` | `d395fbcdfe2a524b8cb8ea1f157be8f8cb02e29e635607acbfa9644a31ff4e12` |
| `privatelink` | AWS PrivateLink | `Architecture-Service-Icons_07312026/Arch_Networking-Content-Delivery/48/Arch_AWS-PrivateLink_48.svg` | `e7573e18201c71158c44dec11251f46894a3d26b895eb4c4e006aa630997db2d` |
| `acm` | AWS Certificate Manager | `Architecture-Service-Icons_07312026/Arch_Security-Identity/48/Arch_AWS-Certificate-Manager_48.svg` | `ceb602bb370f14c8238d717054c32ae5ab2ef12025d1a2215a910234be69972c` |
| `private-ca` | AWS Private Certificate Authority | `Architecture-Service-Icons_07312026/Arch_Security-Identity/48/Arch_AWS-Private-Certificate-Authority_48.svg` | `3fbe1cde23507a3516279d9fc833af0c1fc8b7f30ccd50d023856a5ee630004d` |
| `glacier` | Amazon Simple Storage Service Glacier | `Architecture-Service-Icons_07312026/Arch_Storage/48/Arch_Amazon-Simple-Storage-Service-Glacier_48.svg` | `4195e1b649e95369dec28f81de8fe15918ca241d0d9b075f5e81ea25ace651c5` |
| `kiro` | Kiro (official product website icon) | `https://kiro.dev/icon.svg?fe599162bb293ea0` | `774cbc1c7ecec8c935a6091595583d7a92fc8289d6f1db3f071c0f50c61c369f` |
| `sam` | AWS SAM generic placeholder (not an AWS icon) | `App-authored geometric fallback; official package has no SAM-specific asset` | `38c8e251affc99c1037b06dc2b9d76178e21659c6994ba26f083ddb253610a17` |

Icon usage follows the existing AWS architecture icon guidance. The Kiro product icon is used solely to identify Kiro; its use is not an assertion of a blanket logo license or AWS endorsement. Public documentation sources: https://aws.amazon.com/architecture/icons/, https://kiro.dev/, https://aws.amazon.com/serverless/sam/, https://github.com/aws/serverless-application-model.
