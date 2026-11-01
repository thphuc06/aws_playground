export const c03AdditionalServices = [
  ['firehose','Amazon Data Firehose','Analytics','Deliver streaming records to managed destinations.'],
  ['bedrock','Amazon Bedrock','Machine Learning and Artificial Intelligence','Integrate managed foundation-model inference into applications.'],
  ['agentcore','Amazon Bedrock AgentCore','Machine Learning and Artificial Intelligence','Run agent workloads with identity, isolation and observability controls.'],
  ['quick','Amazon Quick','Machine Learning and Artificial Intelligence','Use managed business AI with governed access to organizational data.'],
  ['kiro','Kiro','Machine Learning and Artificial Intelligence','Develop and test software with AI-assisted specifications and workflows.'],
  ['cloudwatch-logs','Amazon CloudWatch Logs','Management and Governance','Collect, query and protect application log events.'],
  ['sam','AWS SAM','Management and Governance','Build, test and deploy serverless application templates.'],
  ['privatelink','AWS PrivateLink','Networking and Content Delivery','Connect privately to supported services through VPC endpoints.'],
  ['acm','AWS Certificate Manager (ACM)','Security, Identity, and Compliance','Manage TLS certificates for supported application endpoints.'],
  ['private-ca','AWS Private CA','Security, Identity, and Compliance','Issue and manage private certificates for application trust.'],
  ['glacier','Amazon S3 Glacier','Storage','Choose archival object storage and retrieval behavior.'],
].map(([id,name,category,purpose])=>({id,name,category,purpose,relevance:'DVA-C03 application integration, access, deployment and operational tradeoffs.',modeled:false}));
