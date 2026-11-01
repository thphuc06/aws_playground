import {mkdir,writeFile} from 'node:fs/promises';
import {fingerprintGraph,validateReviewGraph,type Graph} from '../src/architectureReview';
const scenarios=[
 {name:'api-ec2',services:['api','ec2','ec2'],links:[[0,1],[0,2]],purpose:'Serve a public HTTPS orders API from the existing EC2 application fleet. Preserve EC2. Explain routing and availability choices within DVA-C03. Do not assume a database dependency.'},
 {name:'serverless-queue',services:['api','lambda','sqs','dynamodb'],links:[[0,1],[1,2],[1,3]],purpose:'Accept orders using an API and Lambda, persist order state, and buffer background processing with SQS. Review idempotency, retries and access within DVA-C03.'},
 {name:'c03-ai',services:['lambda','bedrock','cloudwatch-logs'],links:[[0,1],[0,2]],purpose:'A Lambda application invokes an approved Bedrock model for text summarization and records redacted operational logs. Preserve the application intent; apply DVA-C03 AI access/privacy/observability controls.'},
];
async function main(){
 if(!process.argv.includes('--live-approved'))throw new Error('No live call made: explicit --live-approved required.');
 const origin=process.env.REVIEW_SMOKE_ORIGIN||'http://localhost:5173',base=process.env.REVIEW_BACKEND_URL||'http://localhost:8787';
 await mkdir('backend/data',{recursive:true});
 const selected=process.argv.find(x=>x.startsWith('--scenario='))?.slice(11);
 for(const scenario of scenarios.filter(s=>!selected||s.name===selected)){
  const graph:Graph={version:1,nodes:scenario.services.map((service,i)=>({id:'node'+i,service,label:'Synthetic '+service+' '+i,position:{x:i*200,y:0}})),edges:scenario.links.map(([a,b],i)=>({id:'edge'+i,source:'node'+a,target:'node'+b})),configs:{}};
  const protectedNodeIds=graph.nodes.filter(n=>['ec2','lambda','dynamodb'].includes(n.service)).map(n=>n.id);
  const evidence:any={scenario:scenario.name,started:new Date().toISOString(),result:null,events:[]};
  try{const response=await fetch(base+'/api/architecture-assistant',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','X-Architecture-Review':'1'},body:JSON.stringify({mode:'design',graph,baseFingerprint:fingerprintGraph(graph),purpose:scenario.purpose,priority:'balanced',protectedNodeIds,consent:true}),signal:AbortSignal.timeout(330000)});
   if(!response.ok)throw new Error('Backend HTTP '+response.status);
   const reader=response.body!.getReader(),decoder=new TextDecoder();let buffer='';
   while(true){const {done,value}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});let i;while((i=buffer.indexOf('\n\n'))>=0){const block=buffer.slice(0,i);buffer=buffer.slice(i+2);const event=block.split('\n').find(l=>l.startsWith('event: '))?.slice(7),line=block.split('\n').find(l=>l.startsWith('data: '));if(!line)continue;const data=JSON.parse(line.slice(6));if(event==='result')evidence.result=data;if(event==='error')evidence.error=data.reason;if(event==='usage')evidence.usage=data;if(event==='tool_error'){evidence.events.push({toolError:data});console.log(scenario.name+': tool rejected '+data.tool+' - '+data.reason);}if(event==='progress'){evidence.events.push(data);console.log(scenario.name+': '+data.stage);}}}
   if(!evidence.result)throw new Error(evidence.error||'No completed result');
   const checked=validateReviewGraph(evidence.result.draft);if(!checked.ok)throw new Error('Returned draft failed local validation.');
   for(const id of protectedNodeIds)if(!checked.graph.nodes.some(n=>n.id===id&&n.service===graph.nodes.find(n=>n.id===id)!.service))throw new Error('Protected service changed.');
   const saved=JSON.parse(JSON.stringify(checked.graph));if(!validateReviewGraph(saved).ok)throw new Error('JSON persistence failed.');
   // Adoption and Undo are independent snapshots; this is not a browser-localStorage test.
   let original=structuredClone(graph);const undo=structuredClone(original);original=saved;original=undo;if(fingerprintGraph(original)!==fingerprintGraph(graph))throw new Error('Undo failed.');
   evidence.passed=true;console.log(JSON.stringify({scenario:scenario.name,passed:true,nodes:checked.graph.nodes.length,usage:evidence.result.usage}));
  }catch(e){evidence.error=e instanceof Error?e.message:'Failed';evidence.passed=false;process.exitCode=1;console.log(JSON.stringify({scenario:scenario.name,passed:false,error:evidence.error}));}
  await writeFile('backend/data/assistant-live-'+scenario.name+'-'+Date.now()+'.json',JSON.stringify(evidence,null,2),{mode:0o600});
 }
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/live-assistant-smoke.mjs'))main().catch(()=>{console.error('Live assistant smoke stopped. Inspect local configuration.');process.exitCode=1});
