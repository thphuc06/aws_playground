/** Exact JSON snapshots from AWS managed-policy reference pages, checked 2026-11-01.
 * These policies often use Resource:"*". Selecting one is not a least-privilege recommendation.
 * AWS can change a default policy version; this offline learning snapshot does not auto-refresh.
 */
export interface ManagedPolicySnapshot {id:string;name:string;arn:string;document:unknown;sourceUrl:string;verified:string;version:string}
const policy=(name:string,version:string,actions:string[],serviceRole=false,sid?:string,resourceArray=false):ManagedPolicySnapshot=>({
 id:name,name,version,arn:'arn:aws:iam::aws:policy/'+(serviceRole?'service-role/':'')+name,
 document:{Version:'2012-10-17',Statement:[{...(sid?{Sid:sid}:{}),Effect:'Allow',Action:actions,Resource:resourceArray?['*']:'*'}]},
 sourceUrl:'https://docs.aws.amazon.com/aws-managed-policy/latest/reference/'+name+'.html',verified:'2026-11-01',
});
export const managedPolicySnapshots:ManagedPolicySnapshot[]=[
 policy('AWSLambdaBasicExecutionRole','v1',['logs:CreateLogGroup','logs:CreateLogStream','logs:PutLogEvents'],true),
 policy('AWSLambdaVPCAccessExecutionRole','v3',['logs:CreateLogGroup','logs:CreateLogStream','logs:PutLogEvents','ec2:CreateNetworkInterface','ec2:DescribeNetworkInterfaces','ec2:DescribeSubnets','ec2:DeleteNetworkInterface','ec2:AssignPrivateIpAddresses','ec2:UnassignPrivateIpAddresses'],true,'AWSLambdaVPCAccessExecutionPermissions'),
 policy('AWSLambdaSQSQueueExecutionRole','v1',['sqs:ReceiveMessage','sqs:DeleteMessage','sqs:GetQueueAttributes','logs:CreateLogGroup','logs:CreateLogStream','logs:PutLogEvents'],true),
 policy('AWSLambdaDynamoDBExecutionRole','v1',['dynamodb:DescribeStream','dynamodb:GetRecords','dynamodb:GetShardIterator','dynamodb:ListStreams','logs:CreateLogGroup','logs:CreateLogStream','logs:PutLogEvents'],true),
 policy('AWSXRayDaemonWriteAccess','v2',['xray:PutTraceSegments','xray:PutTelemetryRecords','xray:GetSamplingRules','xray:GetSamplingTargets','xray:GetSamplingStatisticSummaries'],false,'AWSXRayDaemonWriteAccess',true),
 policy('AmazonECSTaskExecutionRolePolicy','v1',['ecr:GetAuthorizationToken','ecr:BatchCheckLayerAvailability','ecr:GetDownloadUrlForLayer','ecr:BatchGetImage','logs:CreateLogStream','logs:PutLogEvents'],true),
 policy('AmazonEC2ContainerRegistryReadOnly','v3',['ecr:GetAuthorizationToken','ecr:BatchCheckLayerAvailability','ecr:GetDownloadUrlForLayer','ecr:GetRepositoryPolicy','ecr:DescribeRepositories','ecr:ListImages','ecr:DescribeImages','ecr:BatchGetImage','ecr:GetLifecyclePolicy','ecr:GetLifecyclePolicyPreview','ecr:ListTagsForResource','ecr:DescribeImageScanFindings']),
 policy('AmazonS3ReadOnlyAccess','v3',['s3:Get*','s3:List*','s3:Describe*','s3-object-lambda:Get*','s3-object-lambda:List*']),
];
