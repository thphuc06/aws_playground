/** Local, unmodified official AWS icon artwork; see ICONS.md for provenance and mapping notes. */
export interface ServiceIconAsset {path:string;officialName:string;sourceFile:string;kind:'official'|'fallback';sha256?:string}
export const iconSource = {
  "title": "AWS architecture icons",
  "url": "https://aws.amazon.com/architecture/icons/",
  "packageUrl": "https://d1.awsstatic.com/onedam/marketing-channels/website/public/shared/architecture-icon-release/Icon-package_07312026.5846e92413caa21490223536cc97f1269e44fa92.zip",
  "verified": "2026-11-01",
  "release": "2026-07-31"
};
export const serviceIcons:Record<string,ServiceIconAsset> = {
  "athena": {
    "path": "/aws-icons/athena.svg",
    "officialName": "Amazon Athena",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Analytics/48/Arch_Amazon-Athena_48.svg",
    "kind": "official",
    "sha256": "5644ca441ec8fea1519218ac70d998c97358855d9f28598f7db5910d625ba4bc"
  },
  "kinesis": {
    "path": "/aws-icons/kinesis.svg",
    "officialName": "Amazon Kinesis",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Analytics/48/Arch_Amazon-Kinesis_48.svg",
    "kind": "official",
    "sha256": "c9a1573c77bfbf7c8b99f44fb216e24910d45b00e37f4e30fa346daae4759445"
  },
  "opensearch": {
    "path": "/aws-icons/opensearch.svg",
    "officialName": "Amazon OpenSearch Service",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Analytics/48/Arch_Amazon-OpenSearch-Service_48.svg",
    "kind": "official",
    "sha256": "459225008be72208cb484436b4c0c0eef19935a255ca197bf51f4ed718dd818f"
  },
  "appsync": {
    "path": "/aws-icons/appsync.svg",
    "officialName": "AWS AppSync",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Application-Integration/48/Arch_AWS-AppSync_48.svg",
    "kind": "official",
    "sha256": "8df85575847a65452bf6cc85a32755e144a68830e8ce983466e1fda018fabd88"
  },
  "eventbridge": {
    "path": "/aws-icons/eventbridge.svg",
    "officialName": "Amazon EventBridge",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Application-Integration/48/Arch_Amazon-EventBridge_48.svg",
    "kind": "official",
    "sha256": "78f7fead59316ad6ac38cc262582bec81fc6649d0f6fdd5327708c08bede65e9"
  },
  "sns": {
    "path": "/aws-icons/sns.svg",
    "officialName": "Amazon Simple Notification Service",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Application-Integration/48/Arch_Amazon-Simple-Notification-Service_48.svg",
    "kind": "official",
    "sha256": "f0fbc241cafdf4d6d06b0f46a7bba9325339480c61fd5f62195e3db63c7582b9"
  },
  "sqs": {
    "path": "/aws-icons/sqs.svg",
    "officialName": "Amazon Simple Queue Service",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Application-Integration/48/Arch_Amazon-Simple-Queue-Service_48.svg",
    "kind": "official",
    "sha256": "5b3f5beb065cd76e4a6ac65a24437aee2bd51000f6b749bce69bbaba45d73b75"
  },
  "step-functions": {
    "path": "/aws-icons/step-functions.svg",
    "officialName": "AWS Step Functions",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Application-Integration/48/Arch_AWS-Step-Functions_48.svg",
    "kind": "official",
    "sha256": "c1bb81d6504d283c6b31cbd9516fa6b8364010ea3c30ae614507114ca34192ad"
  },
  "ec2": {
    "path": "/aws-icons/ec2.svg",
    "officialName": "Amazon EC2",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Compute/48/Arch_Amazon-EC2_48.svg",
    "kind": "official",
    "sha256": "099dff32b3f795f3fa8ed97f0466708502a7fd6500136679899a0cec5a5a2473"
  },
  "elastic-beanstalk": {
    "path": "/aws-icons/elastic-beanstalk.svg",
    "officialName": "AWS Elastic Beanstalk",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Compute/48/Arch_AWS-Elastic-Beanstalk_48.svg",
    "kind": "official",
    "sha256": "79d0808e006ccae23af10b2862407af43962383ab874f2f03a73264c4704eabe"
  },
  "lambda": {
    "path": "/aws-icons/lambda.svg",
    "officialName": "AWS Lambda",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Compute/48/Arch_AWS-Lambda_48.svg",
    "kind": "official",
    "sha256": "4a376abd2d67f8916791458810f3640b12fcfa71079154e0aed0974b92e58cdb"
  },
  "ecr": {
    "path": "/aws-icons/ecr.svg",
    "officialName": "Amazon Elastic Container Registry",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Containers/48/Arch_Amazon-Elastic-Container-Registry_48.svg",
    "kind": "official",
    "sha256": "bf829eab882165f4fb850bab032e5c81312cb579e2ad880372f206936db4a2be"
  },
  "ecs": {
    "path": "/aws-icons/ecs.svg",
    "officialName": "Amazon Elastic Container Service",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Containers/48/Arch_Amazon-Elastic-Container-Service_48.svg",
    "kind": "official",
    "sha256": "7f8b2883cd6171a42bdcafab2d20d17c3cf886d306c62846c6c555ad26463b04"
  },
  "eks": {
    "path": "/aws-icons/eks.svg",
    "officialName": "Amazon Elastic Kubernetes Service",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Containers/48/Arch_Amazon-Elastic-Kubernetes-Service_48.svg",
    "kind": "official",
    "sha256": "83125d0b8a7920b7a13381a8645aacb4efa5ea7a0af3049949e4530491b46ca8"
  },
  "aurora": {
    "path": "/aws-icons/aurora.svg",
    "officialName": "Amazon Aurora",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Databases/48/Arch_Amazon-Aurora_48.svg",
    "kind": "official",
    "sha256": "d222f2a71889a437005b20291a5eb6f59de02b74e3f0ec836e0f58bb7ad3ec3b"
  },
  "dynamodb": {
    "path": "/aws-icons/dynamodb.svg",
    "officialName": "Amazon DynamoDB",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Databases/48/Arch_Amazon-DynamoDB_48.svg",
    "kind": "official",
    "sha256": "c336f941abcb25012c6e36fd884123a868d0727cf916d6f2348b0fb0a053f2f0"
  },
  "elasticache": {
    "path": "/aws-icons/elasticache.svg",
    "officialName": "Amazon ElastiCache",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Databases/48/Arch_Amazon-ElastiCache_48.svg",
    "kind": "official",
    "sha256": "13613f97e4b57b0ad79ffacb9def422cae3e8cdc5aaa302b1452828fc8ff4915"
  },
  "rds": {
    "path": "/aws-icons/rds.svg",
    "officialName": "Amazon RDS",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Databases/48/Arch_Amazon-RDS_48.svg",
    "kind": "official",
    "sha256": "5ef651fae418df2ceade6bf9cbf779d8c8f2ec35c6ff47b23934b10722b6790e"
  },
  "amplify": {
    "path": "/aws-icons/amplify.svg",
    "officialName": "AWS Amplify",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Front-End-Web-Mobile/48/Arch_AWS-Amplify_48.svg",
    "kind": "official",
    "sha256": "d429ca12d0e36f4ecd342b30303e2b205af92bb10114b0ae66ca39e67cda8561"
  },
  "cloudshell": {
    "path": "/aws-icons/cloudshell.svg",
    "officialName": "AWS CloudShell",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Developer-Tools/48/Arch_AWS-CloudShell_48.svg",
    "kind": "official",
    "sha256": "5c2cb5a3f5cff41777e2a7fa02f7f99670aa05f26b2891c39205b85f9af449e6"
  },
  "codeartifact": {
    "path": "/aws-icons/codeartifact.svg",
    "officialName": "AWS CodeArtifact",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Developer-Tools/48/Arch_AWS-CodeArtifact_48.svg",
    "kind": "official",
    "sha256": "b569ee504727e096ed22d147de3920f8c70b3478d912728fd562364a03a894b5"
  },
  "codebuild": {
    "path": "/aws-icons/codebuild.svg",
    "officialName": "AWS CodeBuild",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Developer-Tools/48/Arch_AWS-CodeBuild_48.svg",
    "kind": "official",
    "sha256": "bde1dd403aca780551e984a45ebbfdb0332de1ff5509687c4b1134f516827c48"
  },
  "codedeploy": {
    "path": "/aws-icons/codedeploy.svg",
    "officialName": "AWS CodeDeploy",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Developer-Tools/48/Arch_AWS-CodeDeploy_48.svg",
    "kind": "official",
    "sha256": "73d353f2527dc65dd33b9b9f55e6d1649a718d1e41394fa40a1ad5de29daa603"
  },
  "codepipeline": {
    "path": "/aws-icons/codepipeline.svg",
    "officialName": "AWS CodePipeline",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Developer-Tools/48/Arch_AWS-CodePipeline_48.svg",
    "kind": "official",
    "sha256": "b443f1ef8b5926b8fe5236766938ceb040e422e21bc5f584cac6c442052120ef"
  },
  "xray": {
    "path": "/aws-icons/xray.svg",
    "officialName": "AWS X Ray",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Developer-Tools/48/Arch_AWS-X-Ray_48.svg",
    "kind": "official",
    "sha256": "49c3a0c3f4e8a4e774492dfbc8c86869c593e33060b2f58a7ec4e483e52b161f"
  },
  "q-developer": {
    "path": "/aws-icons/q-developer.svg",
    "officialName": "Amazon Q (family icon for Q Developer)",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Artificial-Intelligence/48/Arch_Amazon-Q_48.svg",
    "kind": "official",
    "sha256": "12bd00db4740582545cbeefb88f3b4f67babd62c44bacbf9a23579e974f183aa"
  },
  "appconfig": {
    "path": "/aws-icons/appconfig.svg",
    "officialName": "AWS AppConfig",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Management-Tools/48/Arch_AWS-AppConfig_48.svg",
    "kind": "official",
    "sha256": "6729845dfa8f80a693451f7ac6a409da53f2a8b4257130f3f73c34fefcfa430f"
  },
  "cdk": {
    "path": "/aws-icons/cdk.svg",
    "officialName": "AWS Cloud Development Kit",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Developer-Tools/48/Arch_AWS-Cloud-Development-Kit_48.svg",
    "kind": "official",
    "sha256": "041ef5763cd53be49cb19a09f77cf7727579344f01252cc8c953dcd817f9b8d8"
  },
  "cloudformation": {
    "path": "/aws-icons/cloudformation.svg",
    "officialName": "AWS CloudFormation",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Management-Tools/48/Arch_AWS-CloudFormation_48.svg",
    "kind": "official",
    "sha256": "37a07518c8163299a791387f613cf399ed3a6beb3c52158eff1a45c78726b5d0"
  },
  "cloudtrail": {
    "path": "/aws-icons/cloudtrail.svg",
    "officialName": "AWS CloudTrail",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Management-Tools/48/Arch_AWS-CloudTrail_48.svg",
    "kind": "official",
    "sha256": "f7d90eab5dd0fd668a515cc0d5d20df075bd01940549a28b4c26116fa22ffb18"
  },
  "cloudwatch": {
    "path": "/aws-icons/cloudwatch.svg",
    "officialName": "Amazon CloudWatch",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Management-Tools/48/Arch_Amazon-CloudWatch_48.svg",
    "kind": "official",
    "sha256": "9920f2db47fed7e2437c329e8b231edcb0f55db82f02413afa3f2d546c30d552"
  },
  "cli": {
    "path": "/aws-icons/cli.svg",
    "officialName": "AWS Command Line Interface",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Developer-Tools/48/Arch_AWS-Command-Line-Interface_48.svg",
    "kind": "official",
    "sha256": "570a8e14c8d4a23f88497b306b476abba63736add7823f3fddaaecb98111c6ac"
  },
  "systems-manager": {
    "path": "/aws-icons/systems-manager.svg",
    "officialName": "AWS Systems Manager",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Management-Tools/48/Arch_AWS-Systems-Manager_48.svg",
    "kind": "official",
    "sha256": "b03519f1080a84cc183f7d24d48ee84114834b06f788c6f6459c717527d4df13"
  },
  "api": {
    "path": "/aws-icons/api.svg",
    "officialName": "Amazon API Gateway",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Networking-Content-Delivery/48/Arch_Amazon-API-Gateway_48.svg",
    "kind": "official",
    "sha256": "08f0cb8f93f8d390425d3925054004c17422cabb7eee14edbabe238e678278af"
  },
  "cloudfront": {
    "path": "/aws-icons/cloudfront.svg",
    "officialName": "Amazon CloudFront",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Networking-Content-Delivery/48/Arch_Amazon-CloudFront_48.svg",
    "kind": "official",
    "sha256": "bdea6b292bb1b482f96b788d955adc2d84ce987ad1c2b7d6c719ae31ca7dbb94"
  },
  "elb": {
    "path": "/aws-icons/elb.svg",
    "officialName": "Elastic Load Balancing",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Networking-Content-Delivery/48/Arch_Elastic-Load-Balancing_48.svg",
    "kind": "official",
    "sha256": "8eca01663c238c8685ce5b397d2b0ef49c00ca963023ba7ee80866ed5a620b74"
  },
  "route53": {
    "path": "/aws-icons/route53.svg",
    "officialName": "Amazon Route 53",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Networking-Content-Delivery/48/Arch_Amazon-Route-53_48.svg",
    "kind": "official",
    "sha256": "624f55ebfca201a7a69a4037baabed2fafac0a99ea05d5089efb5b6bf1819f5b"
  },
  "vpc": {
    "path": "/aws-icons/vpc.svg",
    "officialName": "Amazon Virtual Private Cloud",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Networking-Content-Delivery/48/Arch_Amazon-Virtual-Private-Cloud_48.svg",
    "kind": "official",
    "sha256": "7b842e6a64b2238b159d2470e9dc2389f0d1d373a2236abe20aed971b1f69ded"
  },
  "cognito": {
    "path": "/aws-icons/cognito.svg",
    "officialName": "Amazon Cognito",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Security-Identity/48/Arch_Amazon-Cognito_48.svg",
    "kind": "official",
    "sha256": "66a89c507aced4afefe99d39fa7d5b7bd22e3f6bed03f511a031bf44f57f34ce"
  },
  "iam": {
    "path": "/aws-icons/iam.svg",
    "officialName": "AWS Identity and Access Management",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Security-Identity/48/Arch_AWS-Identity-and-Access-Management_48.svg",
    "kind": "official",
    "sha256": "81954dcfb86d5f410f7084345e459cd5c7ca1d76032d34f771ad379c94e062b6"
  },
  "kms": {
    "path": "/aws-icons/kms.svg",
    "officialName": "AWS Key Management Service",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Security-Identity/48/Arch_AWS-Key-Management-Service_48.svg",
    "kind": "official",
    "sha256": "5655b1815bdfe9ea75a26c702efaac8d884884cccb3b306f75e54d6f542a325e"
  },
  "secrets-manager": {
    "path": "/aws-icons/secrets-manager.svg",
    "officialName": "AWS Secrets Manager",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Security-Identity/48/Arch_AWS-Secrets-Manager_48.svg",
    "kind": "official",
    "sha256": "0258cbde7033b45683db4e814980f5871d3e88fd8490ad9e9f3f531049fffe40"
  },
  "sts": {
    "path": "/aws-icons/sts.svg",
    "officialName": "AWS STS (IAM resource icon)",
    "sourceFile": "Resource-Icons_07312026/Res_Security-Identity/Res_AWS-Identity-Access-Management_AWS-STS_48.svg",
    "kind": "official",
    "sha256": "2cb69b0aba7a9c1e0a24e9213bba31841d9302af532c1a3945dbf1514a6c0154"
  },
  "waf": {
    "path": "/aws-icons/waf.svg",
    "officialName": "AWS WAF",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Security-Identity/48/Arch_AWS-WAF_48.svg",
    "kind": "official",
    "sha256": "e67f918f21cf5fab0846faea3dfa703c9f167275da408c3b4e5f423e3e4ec24a"
  },
  "ebs": {
    "path": "/aws-icons/ebs.svg",
    "officialName": "Amazon Elastic Block Store",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Storage/48/Arch_Amazon-Elastic-Block-Store_48.svg",
    "kind": "official",
    "sha256": "6d816e4b5d90ff8930cecb63a8951cc3287328fcd4c43cd44c7d2f915ef87452"
  },
  "efs": {
    "path": "/aws-icons/efs.svg",
    "officialName": "Amazon EFS",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Storage/48/Arch_Amazon-EFS_48.svg",
    "kind": "official",
    "sha256": "82f8c32b68799a33b3c6737920d492493e6d293ba58caca65cfd6f4056a80e68"
  },
  "s3": {
    "path": "/aws-icons/s3.svg",
    "officialName": "Amazon Simple Storage Service",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Storage/48/Arch_Amazon-Simple-Storage-Service_48.svg",
    "kind": "official",
    "sha256": "bb0df5b7ca52da7323888ed588baefa1c68a23b5776f325bc8ec29825c185a31"
  },
  "firehose": {
    "path": "/aws-icons/firehose.svg",
    "officialName": "Amazon Data Firehose",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Analytics/48/Arch_Amazon-Data-Firehose_48.svg",
    "kind": "official",
    "sha256": "8bba0a1b04c3953d6a2dd45326dc5b13117aad63b10367e48a7cce6642e4b180"
  },
  "bedrock": {
    "path": "/aws-icons/bedrock.svg",
    "officialName": "Amazon Bedrock",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Artificial-Intelligence/48/Arch_Amazon-Bedrock_48.svg",
    "kind": "official",
    "sha256": "01c39972d595d848ffc91d31aa6087b033c65279f8416c7c9a6659bc54406182"
  },
  "agentcore": {
    "path": "/aws-icons/agentcore.svg",
    "officialName": "Amazon Bedrock AgentCore",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Artificial-Intelligence/48/Arch_Amazon-Bedrock-AgentCore_48.svg",
    "kind": "official",
    "sha256": "c715fe6dbc4b661c3cb9b57f8d2ea2176218cdf57b8298901c36c808d96b52e8"
  },
  "quick": {
    "path": "/aws-icons/quick.svg",
    "officialName": "Amazon Quick",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Business-Applications/48/Arch_Amazon-Quick_48.svg",
    "kind": "official",
    "sha256": "e225ca66260d8b8333548b3cf7b47adc325284080622aa3e3d3df2028726b722"
  },
  "cloudwatch-logs": {
    "path": "/aws-icons/cloudwatch-logs.svg",
    "officialName": "Amazon CloudWatch Logs (official resource icon)",
    "sourceFile": "Resource-Icons_07312026/Res_Management-Governance/Res_Amazon-CloudWatch_Logs_48.svg",
    "kind": "official",
    "sha256": "d395fbcdfe2a524b8cb8ea1f157be8f8cb02e29e635607acbfa9644a31ff4e12"
  },
  "privatelink": {
    "path": "/aws-icons/privatelink.svg",
    "officialName": "AWS PrivateLink",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Networking-Content-Delivery/48/Arch_AWS-PrivateLink_48.svg",
    "kind": "official",
    "sha256": "e7573e18201c71158c44dec11251f46894a3d26b895eb4c4e006aa630997db2d"
  },
  "acm": {
    "path": "/aws-icons/acm.svg",
    "officialName": "AWS Certificate Manager",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Security-Identity/48/Arch_AWS-Certificate-Manager_48.svg",
    "kind": "official",
    "sha256": "ceb602bb370f14c8238d717054c32ae5ab2ef12025d1a2215a910234be69972c"
  },
  "private-ca": {
    "path": "/aws-icons/private-ca.svg",
    "officialName": "AWS Private Certificate Authority",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Security-Identity/48/Arch_AWS-Private-Certificate-Authority_48.svg",
    "kind": "official",
    "sha256": "3fbe1cde23507a3516279d9fc833af0c1fc8b7f30ccd50d023856a5ee630004d"
  },
  "glacier": {
    "path": "/aws-icons/glacier.svg",
    "officialName": "Amazon Simple Storage Service Glacier",
    "sourceFile": "Architecture-Service-Icons_07312026/Arch_Storage/48/Arch_Amazon-Simple-Storage-Service-Glacier_48.svg",
    "kind": "official",
    "sha256": "4195e1b649e95369dec28f81de8fe15918ca241d0d9b075f5e81ea25ace651c5"
  },
  "kiro": {
    "path": "/aws-icons/kiro.svg",
    "officialName": "Kiro (official product website icon)",
    "sourceFile": "https://kiro.dev/icon.svg?fe599162bb293ea0",
    "kind": "official",
    "sha256": "774cbc1c7ecec8c935a6091595583d7a92fc8289d6f1db3f071c0f50c61c369f"
  },
  "sam": {
    "path": "/aws-icons/sam.svg",
    "officialName": "AWS SAM generic placeholder (not an AWS icon)",
    "sourceFile": "App-authored geometric fallback; official package has no SAM-specific asset",
    "kind": "fallback",
    "sha256": "38c8e251affc99c1037b06dc2b9d76178e21659c6994ba26f083ddb253610a17"
  }
};
export const genericFallbackIcon:ServiceIconAsset = {
  "path": "/aws-icons/generic.svg",
  "officialName": "Generic service placeholder (not an AWS icon)",
  "sourceFile": "App-authored geometric fallback",
  "kind": "fallback"
};
