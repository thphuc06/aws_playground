import {serviceCatalog} from './serviceCatalog';
import type {ExamVersionId} from './examVersions';
export const homeVerified='2026-11-01';
export const examOverviewUrl='https://aws.amazon.com/certification/certified-developer-associate/';
export const homeScoring={minimum:720,scale:[100,1000],scored:50,unscored:15,total:65,overviewMinutes:130};
export interface HomeService {id:string;name:string;category:string;canvas:boolean}
const added:HomeService[]=[
 ['firehose','Amazon Data Firehose','Analytics'],['bedrock','Amazon Bedrock','Machine Learning and Artificial Intelligence'],['agentcore','Amazon Bedrock AgentCore','Machine Learning and Artificial Intelligence'],['quick','Amazon Quick','Machine Learning and Artificial Intelligence'],['kiro','Kiro','Machine Learning and Artificial Intelligence'],['cloudwatch-logs','Amazon CloudWatch Logs','Management and Governance'],['sam','AWS SAM','Management and Governance'],['privatelink','AWS PrivateLink','Networking and Content Delivery'],['acm','AWS Certificate Manager (ACM)','Security, Identity, and Compliance'],['private-ca','AWS Private CA','Security, Identity, and Compliance'],['glacier','Amazon S3 Glacier','Storage']
].map(([id,name,category])=>({id,name,category,canvas:true}));
export const homeServices:Record<ExamVersionId,HomeService[]>={
 'DVA-C02':serviceCatalog.map(s=>({id:s.id,name:s.name,category:s.category,canvas:true})),
 'DVA-C03':[...serviceCatalog.filter(s=>!['appsync','q-developer'].includes(s.id)).map(s=>({id:s.id,name:s.name,category:s.category,canvas:true})),...added]
};
export const homeTasks:Record<ExamVersionId,{id:string;title:string;chapter:string}[]>={
 'DVA-C03':[
 {id:'1.1',title:'Build applications and integrate AWS services, including managed AI',chapter:'dev-application'},
 {id:'1.2',title:'Develop and integrate Lambda functions',chapter:'dev-lambda'},
 {id:'1.3',title:'Use storage, data models and caching appropriately',chapter:'dev-dynamodb'},
 {id:'2.1',title:'Authenticate callers and authorize application access',chapter:'security-iam-sts'},
 {id:'2.2',title:'Encrypt and protect sensitive application data',chapter:'security-sensitive-data'},
 {id:'2.3',title:'Apply access, privacy and action controls to AI usage',chapter:'security-ai-controls'},
 {id:'3.1',title:'Prepare artifacts, images and environment configuration',chapter:'release-artifacts'},
 {id:'3.2',title:'Test code and automate evidence collection',chapter:'layered-testing'},
 {id:'3.3',title:'Deploy approved code using AWS delivery services',chapter:'progressive-release'},
 {id:'4.1',title:'Investigate failures using evidence and diagnostic tools',chapter:'observe-debug'},
 {id:'4.2',title:'Instrument applications with useful logs, metrics and traces',chapter:'observe-debug'},
 {id:'4.3',title:'Measure and improve application performance',chapter:'measure-optimize'}],
 'DVA-C02':[
 {id:'1.1',title:'Develop application code with AWS services',chapter:'dev-application'},
 {id:'1.2',title:'Develop Lambda functions',chapter:'dev-lambda'},
 {id:'1.3',title:'Use application data stores',chapter:'dev-dynamodb'},
 {id:'2.1',title:'Implement authentication and authorization',chapter:'security-iam-sts'},
 {id:'2.2',title:'Encrypt data in transit and at rest',chapter:'security-kms'},
 {id:'2.3',title:'Manage sensitive application data',chapter:'security-sensitive-data'},
 {id:'3.1',title:'Prepare deployable application artifacts',chapter:'release-artifacts'},
 {id:'3.2',title:'Test in development environments',chapter:'layered-testing'},
 {id:'3.3',title:'Automate deployment testing',chapter:'layered-testing'},
 {id:'3.4',title:'Deploy with AWS CI/CD services',chapter:'progressive-release'},
 {id:'4.1',title:'Assist root-cause investigation',chapter:'observe-debug'},
 {id:'4.2',title:'Implement useful observability',chapter:'observe-debug'},
 {id:'4.3',title:'Optimize application behavior',chapter:'measure-optimize'}]
};
