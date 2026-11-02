import assert from 'node:assert/strict';
import {createServer} from 'node:net';
import {once} from 'node:events';
const probe=createServer();probe.listen(0,'127.0.0.1');await once(probe,'listening');const port=probe.address().port;await new Promise(r=>probe.close(r));
Object.assign(process.env,{PORT:String(port),OPENAI_API_KEY:'fixture-no-provider-network',REVIEW_MODEL:'gpt-6.1-sol',REVIEW_ENABLED:'true',REVIEW_ALLOWED_ORIGINS:'https://study.example'});
const {start}=await import('../backend/dist/server.mjs');let calls=0;
const fn=(name,args,id)=>({type:'function_call',call_id:id,name,arguments:JSON.stringify(args)});
const output=[fn('get_service_schema',{serviceIds:['lambda']},'schema'),fn('configure_resources',{updates:[{service:'lambda',nodeId:'worker',values:{memoryMb:512,timeoutSeconds:30},clearFields:[]}]},'configure'),fn('validate_draft',{},'validate'),fn('finish_draft',{requirementChecks:[{requirementId:'requirement-1',status:'partial',explanation:'Memory and timeout are recorded; event source and application implementation remain unspecified.',evidence:[{kind:'node',id:'worker',fields:['memoryMb','timeoutSeconds']}]}],emptyFrameChecks:[],summary:'The worker now has explicit timeout and memory settings.',assumptions:['Synthetic workflow only.'],findings:[{scope:'proposal',nodeIds:['worker'],edgeIds:[],severity:'info',title:'Explicit settings',detail:'Review these educational settings before adoption.',sourceIds:['source-1']}],serviceExplanations:[]},'finish')];
const server=await start({transport:async()=>{assert(calls<output.length,'Unexpected extra provider attempt');return new Response(JSON.stringify({status:'completed',output:[output[calls++]],usage:{input_tokens:10,output_tokens:10}}))}});
if(!server.listening)await once(server,'listening');
try{
 const base='http://127.0.0.1:'+port,headers={Origin:'https://study.example','Content-Type':'application/json','X-Architecture-Review':'1'};
 assert.equal((await fetch(base+'/health')).status,200);
 const status=await(await fetch(base+'/api/review/status',{headers})).json();assert.equal(status.capabilities.configurationSchema,2);assert.equal(status.enabled,true);
 assert.equal((await fetch(base+'/api/architecture-assistant',{method:'OPTIONS',headers})).status,204);
 assert.equal((await fetch(base+'/api/review/status',{headers:{Origin:'https://denied.example'}})).status,403);
 const graph={version:1,nodes:[{id:'worker',service:'lambda',label:'Worker',position:{x:0,y:0}}],edges:[],configs:{}};
 const canonical=v=>Array.isArray(v)?'['+v.map(canonical).join(',')+']':v&&typeof v==='object'?'{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}':JSON.stringify(v);
 const response=await fetch(base+'/api/architecture-assistant',{method:'POST',headers,body:JSON.stringify({mode:'design',graph,baseFingerprint:'graph-v1:'+canonical(graph),purpose:'Process synthetic application events',priority:'balanced',protectedNodeIds:['worker'],consent:true})});
 assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/text\/event-stream/);const text=await response.text();const lines=text.split('\n\n').filter(block=>block.startsWith('event: result'));assert.equal(lines.length,1);const result=JSON.parse(lines[0].split('\ndata: ')[1]);assert.equal(result.draft.architecture.nodes.worker.schemaVersion,2);assert.equal(result.draft.architecture.nodes.worker.values.memoryMb,512);assert.equal(result.proposalStatus,'changed');assert.equal(calls,4);assert.equal(result.usage.toolCalls,4);assert.equal(result.completion.status,'gaps');assert.match(text,/event: activity/);console.log('HTTP/SSE schema2 smoke PASS; no OpenAI/AWS network calls.');
}finally{await new Promise(r=>server.close(r));}
