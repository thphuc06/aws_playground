/** Public AWS documentation snapshots checked 2026-11-02.
 * A limit is meaningful only with its scope. In particular:
 * - inline aggregate limits are not per-document limits;
 * - adjustable defaults are not the account's confirmed quota;
 * - documented KB must not be silently converted to UTF-8 bytes;
 * - character limits and byte limits are different dimensions.
 */
export type PolicyLimitUnit='characters-no-whitespace'|'characters'|'utf8-bytes'|'attachments'|'kilobytes-as-documented';
export interface PolicyLimitDatum {
 id:string;service:string;field:string;limit:number;unit:PolicyLimitUnit;
 kind:'hard'|'adjustable'|'dependent';scope:string;maximum?:number;sourceUrl:string;verified:string;
}
export interface PolicyLimitNote {service:string;field:string;note:string;sourceUrl:string;verified:string}
const verified='2026-11-02';
const iam='https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html';
const lambda='https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html';
const sqs='https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/quotas-policies.html';
const s3='https://docs.aws.amazon.com/AmazonS3/latest/userguide/add-bucket-policy.html';
const kms='https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-overview.html';
const item=(id:string,service:string,field:string,limit:number,unit:PolicyLimitUnit,kind:PolicyLimitDatum['kind'],scope:string,sourceUrl:string,maximum?:number):PolicyLimitDatum=>({id,service,field,limit,unit,kind,scope,sourceUrl,verified,...(maximum===undefined?{}:{maximum})});

export const policyLimitData:PolicyLimitDatum[]=[
 item('iam-customer-managed-document','iam','identityPolicy',6144,'characters-no-whitespace','hard','Per customer-managed policy document only. Do not apply this as the limit of every inline identityPolicy or AWS-managed snapshot.',iam),
 item('iam-role-inline-aggregate','iam','inlinePolicies',10240,'characters-no-whitespace','hard','Sum of all inline policy documents attached to ONE ROLE; not 10,240 per statement or per policy. Count every inline document associated with that role.',iam),
 item('iam-user-inline-aggregate','iam','inlinePolicies',2048,'characters-no-whitespace','hard','Sum of all inline policy documents attached to ONE USER. Applies only when the entity is a user, not a role.',iam),
 item('iam-role-managed-attachments','iam','managedPolicyIds',20,'attachments','adjustable','Default number of managed policies attached to ONE ROLE. Verify the account quota; both AWS-managed and customer-managed attachments count.',iam,25),
 item('iam-user-managed-attachments','iam','managedPolicyIds',10,'attachments','adjustable','Default number of managed policies attached to ONE USER. Verify the account quota; this is not the role attachment quota.',iam,20),
 item('iam-role-trust-document','iam','trustPolicy',2048,'characters-no-whitespace','adjustable','Default role trust-policy length, excluding whitespace. Maximum adjustable length is 8,192 characters. Exceeding the default does not prove rejection if an increase is already approved.',iam,8192),
 item('sts-session-combined-characters','sts','sessionPolicy',2048,'characters','hard','Combined characters of the passed inline JSON session policy AND all passed managed-policy ARNs. This row does not independently limit a standalone policy while ignoring the ARN strings.',iam),
 item('sts-session-managed-arns','sts','managedSessionPolicyArns',10,'attachments','hard','Maximum managed policy ARN references passed when creating a role session; not the number of policies attached permanently to the target role.',iam),
 item('iam-role-session-combined-characters','iam','sessionPolicy',2048,'characters','hard','For the session restriction scenario: combined inline session JSON plus managed-policy ARN characters. Do not apply as the generic IAM role inline aggregate limit.',iam),
 item('kms-key-policy-document','kms','keyPolicy',32768,'utf8-bytes','hard','Per KMS key policy document. The source explicitly states 32 kilobytes (32,768 bytes); whitespace is not excluded by this rule.',kms),
 item('sqs-queue-policy-document','sqs','accessPolicy',8192,'utf8-bytes','hard','Per queue policy document: source quota is Bytes=8,192. Measure the policy document, not an entire HTTP request or its escaped JSON envelope.',sqs),
 item('s3-bucket-policy-document','s3','bucketPolicy',20,'kilobytes-as-documented','hard','Per S3 bucket policy. Source says 20 KB; preserve this documented unit. Do not invent an exact UTF-8 byte threshold from this row.',s3),
 item('lambda-resource-policy-document','lambda','resourcePolicy',20,'kilobytes-as-documented','hard','Per function resource-based policy: Lambda quota says 20 KB. This documented-KB row is informational rather than an inferred exact byte conversion.',lambda),
 item('lambda-put-resource-policy-string','lambda','resourcePolicy',20480,'characters','hard','PutResourcePolicy Policy string input has maximum length 20,480. Keep this API string-length constraint distinct from the quota page\'s 20 KB wording.', 'https://docs.aws.amazon.com/lambda/latest/api/API_PutResourcePolicy.html'),
 item('dynamodb-resource-policy-document','dynamodb','resourcePolicy',20,'kilobytes-as-documented','hard','Maximum policy attached to a DynamoDB table/stream is documented as 20 KB. No exact byte multiplier is asserted here.', 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/access-control-resource-based.html'),
 item('secrets-resource-policy-document','secrets-manager','resourcePolicy',20480,'characters','hard','Maximum number of characters in ONE resource-based permissions policy attached to a secret; do not use the separate secret-value Bytes quota.', 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_limits.html'),
 item('vpc-endpoint-policy-document','privatelink','endpointPolicy',20480,'characters','hard','Characters per VPC endpoint policy, INCLUDING whitespace. This is not a whitespace-stripped IAM managed-policy quota.', 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-limits-endpoints.html'),
 item('ecr-repository-policy-string','ecr','repositoryPolicy',10240,'characters','hard','SetRepositoryPolicy policyText String has maximum length 10,240; applies to the repository policy, not the lifecycle policy JSON.', 'https://docs.aws.amazon.com/AmazonECR/latest/APIReference/API_SetRepositoryPolicy.html'),
 item('efs-filesystem-policy-document','efs','filesystemPolicy',20000,'characters','hard','EFS FileSystemPolicy has a 20,000 CHARACTER limit; it must not be treated as a 20 KiB/20,480-byte limit.', 'https://docs.aws.amazon.com/efs/latest/APIReference/API_PutFileSystemPolicy.html'),
 item('sns-topic-policy-document','sns','accessPolicy',30,'kilobytes-as-documented','hard','SNS policy-quota table labels the Bytes row as 30 kb. Preserve the source wording and one-topic scope; no exact byte multiplier is asserted.', 'https://docs.aws.amazon.com/sns/latest/dg/sns-access-policy-language-api-permissions-reference.html'),
];

export const policyLimitNotes:PolicyLimitNote[]=[
 {service:'iam',field:'inlinePolicies',note:'IAM also lists GROUP inline-policy aggregate 5,120 non-whitespace characters. Group administration is not modeled by this role/user configuration, so do not silently apply it to a role.',sourceUrl:iam,verified},
 {service:'iam',field:'trustPolicy',note:'The Access Analyzer POLICY_SIZE_EXCEEDS_ROLE_TRUST_POLICY_QUOTA warning explicitly says the role-trust characters exclude whitespace. Preserve policy string values and never alter a policy merely to compute its displayed size.',sourceUrl:'https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-reference-policy-checks.html',verified},
 {service:'iam',field:'managedPolicyIds',note:'The current IAM quota table gives ROLE default20/max25, USER default10/max20 and GROUP10/max10. Old tutorials may give earlier role defaults. Account quota is not known from this offline canvas.',sourceUrl:iam,verified},
 {service:'sts',field:'sessionPolicy',note:'Session policies and session tags also consume a separate packed session-token-size limit. The current IAM page documents SessionTokenUtilization and marks PackedPolicySize deprecated. Plain JSON/ARN character counts do not prove the packed request will fit.',sourceUrl:iam,verified},
 {service:'sts',field:'sessionTags',note:'Up to50 session tags; tag key128 characters and value256 characters. These also contribute to the separate packed token-size limit. This is not a policy attachment quota.',sourceUrl:iam,verified},
 {service:'sqs',field:'accessPolicy',note:'Additional queue-policy maxima from the same table:10 conditions,50 principals,20 statements,7 actions per statement. A policy fitting8,192 bytes can still exceed these limits.',sourceUrl:sqs,verified},
 {service:'sns',field:'accessPolicy',note:'The SNS page separately lists100 statements,1–200 principals, and exactly1 resource matching the topic ARN, plus unique policy Id and statement Sid requirements. Its table wording refers to policy-statement quotas; interpret and display the documented scope instead of importing SQS counts.',sourceUrl:'https://docs.aws.amazon.com/sns/latest/dg/sns-access-policy-language-api-permissions-reference.html',verified},
 {service:'kms',field:'keyPolicy',note:'KMS explicitly defines32KB as32,768 bytes and restricts permitted document characters. Its Sid may contain spaces; generic IAM-policy Sid restrictions must not be copied blindly.',sourceUrl:kms,verified},
 {service:'lambda',field:'resourcePolicy',note:'Lambda documentation now distinguishes complete JSON PutResourcePolicy from individual Allow-only AddPermission statements. PutResourcePolicy replaces the existing policy; input string length20,480 and documented20KB quota are kept as separate metadata dimensions.',sourceUrl:'https://docs.aws.amazon.com/lambda/latest/dg/access-control-resource-based.html',verified},
 {service:'s3',field:'bucketPolicy',note:'The official S3 console and General Reference pages confirm a non-adjustable20KB bucket-policy quota, but the reviewed pages do not spell out an exact byte conversion. Do not turn an assumed1024 multiplier into a hard local rejection.',sourceUrl:'https://docs.aws.amazon.com/general/latest/gr/s3.html',verified},
 {service:'efs',field:'filesystemPolicy',note:'The EFS API and quota pages say20,000 characters, not20,480 bytes. No whitespace exemption is documented on these reviewed pages.',sourceUrl:'https://docs.aws.amazon.com/efs/latest/ug/limits.html',verified},
];
