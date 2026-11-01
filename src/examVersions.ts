/** Official exam metadata reviewed 2026-11-01; UI scope selector, not an exam-readiness claim. */
export type ExamVersionId='DVA-C02'|'DVA-C03';
export interface ExamVersion {id:ExamVersionId;label:string;guideUrl:string;scopeUrl:string;verified:string;domains:{id:number;name:string;weight:number}[];availability:string;scopeChanges:string[];limitations:string[]}
export const examComparisonUrl='https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/dva-03-comparison.html';
export const c03AddedServiceReferences=['Amazon Data Firehose','Amazon Bedrock','Amazon Bedrock AgentCore','Amazon Quick','Kiro','Amazon CloudWatch Logs','AWS SAM','AWS PrivateLink','AWS Certificate Manager (ACM)','AWS Private CA','Amazon S3 Glacier'];
export const c03AbsentFromNamedList=['AWS AppSync','Amazon Q Developer'];
const commonLimits=[
 'AWS calls its in-scope service lists non-exhaustive and subject to change. Being named does not imply every feature is examined; absence alone does not prove exclusion.',
 'Changing the selected guide does not add runtime capabilities. The existing 47-service canvas and its bounded lessons are not a complete implementation of either exam guide.',
 'The 11 newly named C03 references are research/theory references only, not newly implemented canvas services or simulators.',
 'Skill IDs are version-specific: matching numbers across C02 and C03 can describe different objectives. Chapter counts and checklist counts do not establish exhaustive exam coverage.',
];
export const examVersions:ExamVersion[]=[
 {id:'DVA-C02',label:'DVA-C02 · through November 30, 2026',guideUrl:'https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02.html',scopeUrl:'https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/dva-02-in-scope-services.html',verified:'2026-11-01',domains:[{id:1,name:'Development with AWS Services',weight:32},{id:2,name:'Security',weight:26},{id:3,name:'Deployment',weight:24},{id:4,name:'Troubleshooting and Optimization',weight:18}],availability:'AWS states November 30, 2026 is the last day for DVA-C02. Verify appointment availability with AWS before booking.',scopeChanges:['The reviewed C02 named-service list has 47 entries, including AppSync and Q Developer. This count is not a completeness guarantee.','Current C02 also mentions AI-related emerging pretest topics; do not assume all AI-related study belongs exclusively to C03.','C02 has separate encryption and sensitive-data tasks, and separates development-environment testing from deployment-test automation.'],limitations:[...commonLimits]},
 {id:'DVA-C03',label:'DVA-C03 · from December 1, 2026',guideUrl:'https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/developer-associate-03.html',scopeUrl:'https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/dva-03-in-scope-services.html',verified:'2026-11-01',domains:[{id:1,name:'Development with AWS Services',weight:30},{id:2,name:'Security',weight:26},{id:3,name:'Testing and Deployment',weight:22},{id:4,name:'Troubleshooting and Optimization',weight:22}],availability:'DVA-C03 testing begins December 1, 2026 and is upcoming as of this November 1 review. Verify current registration and appointment availability with AWS.',scopeChanges:[
  'Weights change from 32/26/24/18 to 30/26/22/22; Domain 3 is renamed Testing and Deployment.',
  'New dedicated AI-security task 2.3 covers access, privacy, input/output controls, agent tool authorization and isolation, human approval, and sensitive telemetry.',
  'AI-assisted development, managed AI integration, AI-supported tests, CI/CD, troubleshooting, and optimization are explicit objectives. Presigned access and container build/deployment receive explicit treatment.',
  'Unit-testing objectives move into Domain 3; Lambda tuning moves into Domain 4; serialization moves to application-code objectives. Testing tasks are consolidated, so IDs must not be copied across versions.',
  `The named-service list adds: ${c03AddedServiceReferences.join('; ')}. These are references, not added app simulators.`,
  'AppSync and Q Developer are absent from the reviewed C03 named-service list. That non-exhaustive list alone does not establish that either service is forbidden or impossible to encounter.',
  'After normalizing expanded names and acronyms, the named lists contain 47 C02 entries and 56 C03 entries: 11 additions and 2 omissions.',
 ],limitations:[...commonLimits,'The target role excludes designing foundation-model selection, prompt/RAG architectures, and AI safety/governance frameworks; learning to apply existing controls must not be presented as exhaustive AI-system design coverage.']},
];
