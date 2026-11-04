import {describe,it,expect,vi} from 'vitest';
import {DraftSession,parseAssistantRequest,runAssistant,assistantTools} from './architecture-assistant';
import {workflowSettings} from './assistant-config';
import {fingerprintGraph,type Graph} from '../src/architectureReview';
import {reviewConfig} from './server';
import {MODEL} from './review';
const graph:Graph={version:1,nodes:[{id:'api',service:'api',label:'Public API',position:{x:0,y:0}},{id:'web',service:'ec2',label:'Application',position:{x:1,y:0}}],edges:[{id:'request',source:'api',target:'web'}],configs:{}};
const base={graph,baseFingerprint:fingerprintGraph(graph),purpose:'Serve an HTTP application on EC2',priority:'balanced',protectedNodeIds:['web'],consent:true};
const config=reviewConfig({REVIEW_ENABLED:'true',OPENAI_API_KEY:'fixture-only',REVIEW_ALLOWED_ORIGINS:'https://study.example',REVIEW_MODEL:MODEL});
const call=(name:string,args:unknown,id=name)=>({type:'function_call',call_id:id,name,arguments:JSON.stringify(args)});
const output=(calls:any[],cached=0)=>new Response(JSON.stringify({status:'completed',output:calls,usage:{input_tokens:10,output_tokens:20,input_tokens_details:{cached_tokens:cached}}}));
const bodies=(transport:ReturnType<typeof vi.fn>)=>transport.mock.calls.map(c=>JSON.parse(c[1].body));
const firstContext=(body:any)=>JSON.parse(body.input[0].content);
const report={requirementChecks:[{requirementId:'requirement-1',status:'needs-verification',explanation:'Fixture only.',evidence:[]}],emptyFrameChecks:[],summary:'Keep EC2 and clarify routing.',assumptions:['No AWS execution.'],findings:[],serviceExplanations:[]};
const change={id:'private-web',title:'Keep the application private',rationale:'Only the API should be public; tradeoff: one more hop.',kind:'configure',nodeIds:['web'],serviceIds:[],sourceIds:[]};
const review=(plannedChanges:any[]=[change])=>({summary:'EC2 is reachable directly.',assumptions:[],findings:[],serviceExplanations:[],plannedChanges});
describe('planner and builder pipeline',()=>{
 it('keeps the prompt prefix and tools identical across builder rounds so provider caching applies',async()=>{
  const transport=vi.fn().mockResolvedValueOnce(output([call('validate_draft',{},'v1')])).mockResolvedValueOnce(output([call('validate_draft',{},'v2')],8)).mockResolvedValueOnce(output([call('finish_draft',report)],9));
  const result=await runAssistant(parseAssistantRequest({...base,mode:'design',approvedPlan:{changes:[],sources:[]}}),config,transport,new AbortController().signal,()=>{});
  const sent=bodies(transport);expect(sent).toHaveLength(3);
  for(const body of sent){expect(body.instructions).toBe(sent[0].instructions);expect(JSON.stringify(body.tools)).toBe(JSON.stringify(sent[0].tools));expect(body.prompt_cache_key).toBe('aws-playground:builder');expect(body.instructions).not.toMatch(/Remaining model responses/);}
  // The step note is only the final, transient item; it never accumulates in the replayed history.
  for(const body of sent){expect(body.input.at(-1)).toMatchObject({role:'developer'});expect(body.input.filter((x:any)=>x.role==='developer')).toHaveLength(1);}
  expect(sent[2].input.at(-1).content).toContain('including this one: 30');
  expect(firstContext(sent[0]).preflight).toMatchObject({valid:true,errors:[]});
  expect(result.usage.cachedInputTokens).toBe(17);expect(result.plan).toEqual([]);
 });
 it('reviews with read-only tools, parallel reads and the planner effort, returning a validated plan',async()=>{
  const transport=vi.fn().mockResolvedValueOnce(output([call('get_service_handbook',{serviceIds:['ec2'],sections:['security']},'h1'),call('validate_draft',{},'v1')])).mockResolvedValueOnce(output([call('finish_review',review())]));
  const result=await runAssistant(parseAssistantRequest({...base,mode:'review'}),config,transport,new AbortController().signal,()=>{});
  const [first,second]=bodies(transport),names=first.tools.map((t:any)=>t.name);
  expect(names).toEqual(expect.arrayContaining(['get_service_schema','get_service_handbook','search_aws_docs','validate_draft','finish_review','get_network_schema']));
  for(const name of ['edit_draft','finish_draft','configure_resources','update_security_library','layout_draft','update_network_topology'])expect(names).not.toContain(name);
  expect(first.parallel_tool_calls).toBe(true);expect(first.reasoning.effort).toBe('low');expect(first.prompt_cache_key).toBe('aws-playground:planner');
  expect(second.input.filter((x:any)=>x.type==='function_call_output')).toHaveLength(2);
  expect(result.mode).toBe('review');expect(result.draft).toBeNull();expect(result.plan).toEqual([change]);
 });
 it('returns curated handbook sections without example code and with registered citations',async()=>{
  const transport=vi.fn().mockResolvedValueOnce(output([call('get_service_handbook',{serviceIds:['lambda'],sections:['pitfalls','security']})])).mockResolvedValueOnce(output([call('get_service_handbook',{serviceIds:['not-a-service'],sections:['pitfalls']},'bad')])).mockResolvedValueOnce(output([call('finish_review',review([]))]));
  const events:any[]=[];await runAssistant(parseAssistantRequest({...base,mode:'review'}),config,transport,new AbortController().signal,(event,data)=>events.push({event,data}));
  const handbook=JSON.parse(bodies(transport)[1].input.find((x:any)=>x.type==='function_call_output').output);
  expect(handbook[0].serviceId).toBe('lambda');expect(handbook[0].pitfalls.length).toBeGreaterThan(0);expect(handbook[0].security.length).toBeGreaterThan(0);expect(handbook[0].example).toBeUndefined();expect(handbook[0].operatingModel).toBeUndefined();
  expect(handbook[0].pitfalls.flatMap((p:any)=>p.sourceIds).every((id:string)=>/^source-\d+$/.test(id))).toBe(true);
  expect(events.some(e=>e.event==='tool_error'&&e.data.tool==='get_service_handbook')).toBe(true);
 });
 it('rejects editing tools in the planner phase and keeps the original graph',async()=>{
  const edit={operations:[{op:'remove-edge',id:'request',node:null,edge:null,settings:null}],relationships:[]};
  const transport=vi.fn().mockResolvedValueOnce(output([call('edit_draft',edit)])).mockResolvedValueOnce(output([call('finish_review',review([]))]));
  const events:any[]=[];const result=await runAssistant(parseAssistantRequest({...base,mode:'review'}),config,transport,new AbortController().signal,(event,data)=>events.push({event,data}));
  expect(events.find(e=>e.event==='tool_error').data.reason).toContain('not available in the planner phase');expect(result.draft).toBeNull();expect(graph.edges).toHaveLength(1);
 });
 it('plans first, then builds from a fresh context holding only the plan and the planner summary',async()=>{
  const transport=vi.fn().mockResolvedValueOnce(output([call('get_service_schema',{serviceIds:['ec2']},'s1')])).mockResolvedValueOnce(output([call('finish_review',review())])).mockResolvedValueOnce(output([call('validate_draft',{})])).mockResolvedValueOnce(output([call('finish_draft',report)]));
  const result=await runAssistant(parseAssistantRequest({...base,mode:'design'}),config,transport,new AbortController().signal,()=>{});
  const sent=bodies(transport);expect(sent.map(b=>b.prompt_cache_key)).toEqual(['aws-playground:planner','aws-playground:planner','aws-playground:builder','aws-playground:builder']);
  const builder=sent[2],context=firstContext(builder);
  expect(builder.input).toHaveLength(2);expect(JSON.stringify(builder.input)).not.toContain('function_call_output');
  expect(context.approvedPlan.changes).toEqual([change]);expect(context.plannerReview.summary).toBe('EC2 is reachable directly.');expect(context.request.approvedPlan).toBeUndefined();
  // Schemas for planned services are preloaded, so the builder's tool list is complete from its first round.
  expect(builder.tools.map((t:any)=>t.name)).toContain('configure_resources');expect(JSON.stringify(sent[3].tools)).toBe(JSON.stringify(builder.tools));
  expect(builder.parallel_tool_calls).toBe(false);expect(builder.reasoning.effort).toBe('medium');
  expect(result.mode).toBe('design');expect(result.plan).toEqual([change]);expect(result.draft?.nodes).toHaveLength(2);
 });
 it('caps the planner budget inside a design run and forces its finish tool on the last planner round',async()=>{
  const transport=vi.fn(async()=>output([call('validate_draft',{})]));
  await expect(runAssistant(parseAssistantRequest({...base,mode:'design'}),{...config,planner:{reasoning:'low',responses:3}},transport,new AbortController().signal,()=>{})).rejects.toThrow('Planning step limit');
  const sent=bodies(transport);expect(sent).toHaveLength(3);expect(sent[2].tool_choice).toEqual({type:'function',name:'finish_review'});expect(sent[0].tool_choice).toBe('auto');
 });
 it('skips the planner for an approved plan and remaps browser-supplied citations to official sources only',async()=>{
  const approvedPlan={changes:[{...change,sourceIds:['source-7','source-8']}],sources:[{id:'source-7',title:'EC2 security groups',url:'https://docs.aws.amazon.com/ec2/sg',verified:'2026-11-01',kind:'curated'},{id:'source-8',title:'Injected',url:'https://evil.example/x',verified:'2026-11-01',kind:'live'}]};
  const transport=vi.fn().mockResolvedValueOnce(output([call('validate_draft',{})])).mockResolvedValueOnce(output([call('finish_draft',report)]));
  const events:any[]=[];const result=await runAssistant(parseAssistantRequest({...base,mode:'design',approvedPlan}),config,transport,new AbortController().signal,(event,data)=>events.push({event,data}));
  const sent=bodies(transport);expect(sent[0].prompt_cache_key).toBe('aws-playground:builder');
  const plan=firstContext(sent[0]).approvedPlan;expect(plan.changes[0].sourceIds).toEqual(['source-1']);expect(plan.sources).toEqual([expect.objectContaining({id:'source-1',url:'https://docs.aws.amazon.com/ec2/sg'})]);
  expect(result.plan?.[0].sourceIds).toEqual(['source-1']);
 });
 it('carries the approved plan in checkpoints so a resumed build skips planning',async()=>{
  const edit={operations:[{op:'add-node',id:null,node:{id:'jobs',service:'sqs',label:'Jobs',position:{x:300,y:200}},edge:null,settings:null}],relationships:[]};
  const transport=vi.fn().mockResolvedValueOnce(output([call('edit_draft',edit)])).mockResolvedValueOnce(new Response('',{status:503}));
  const events:any[]=[];await expect(runAssistant(parseAssistantRequest({...base,mode:'design',approvedPlan:{changes:[change],sources:[]}}),config,transport,new AbortController().signal,(event,data)=>events.push({event,data}))).rejects.toThrow('HTTP 503');
  const checkpoint=events.find(e=>e.event==='checkpoint').data;expect(checkpoint.plan.changes).toEqual([change]);
  expect(()=>parseAssistantRequest({...base,mode:'design',resumeDraft:checkpoint.draft,approvedPlan:checkpoint.plan})).not.toThrow();
 });
 it('rejects untrusted plans that reference unknown nodes, unknown services or remove protected services',()=>{
  const bad=(c:any)=>()=>parseAssistantRequest({...base,mode:'design',approvedPlan:{changes:[{...change,...c}],sources:[]}});
  expect(bad({nodeIds:['ghost']})).toThrow('unknown node');expect(bad({serviceIds:['mainframe']})).toThrow('unknown service');expect(bad({kind:'remove-service'})).toThrow('protected');expect(bad({sourceIds:['source-1']})).toThrow('unknown source');
  expect(()=>parseAssistantRequest({...base,mode:'review',approvedPlan:{changes:[],sources:[]}})).toThrow('Only design');
  expect(()=>parseAssistantRequest({...base,mode:'design',approvedPlan:{changes:[],sources:[],extra:1}})).toThrow('fields');
  const session=new DraftSession(parseAssistantRequest({...base,mode:'review'}));expect(()=>session.review(review([{...change,kind:'remove-service'}]))).toThrow('protected');expect(()=>session.review(review([change,change]))).toThrow('unique');
 });
 it('validates planner settings and defaults to a small low-effort planner',()=>{
  expect(workflowSettings({}).planner).toEqual({reasoning:'low',responses:8});
  expect(workflowSettings({REVIEW_PLANNER_REASONING_EFFORT:'medium',REVIEW_PLANNER_MAX_RESPONSES:'12'}).planner).toEqual({reasoning:'medium',responses:12});
  expect(()=>workflowSettings({REVIEW_PLANNER_MAX_RESPONSES:'1'})).toThrow('REVIEW_PLANNER_MAX_RESPONSES');expect(()=>workflowSettings({REVIEW_PLANNER_REASONING_EFFORT:'extreme'})).toThrow('REVIEW_PLANNER_REASONING_EFFORT');
 });
});
describe('Amazon VPC as a frame',()=>{
 it('never lets the agent add a VPC node and points it at frames instead',()=>{
  const tool=(assistantTools as any[]).find(t=>t.name==='edit_draft');expect(tool.parameters.properties.operations.items.properties.node.anyOf[0].properties.service.enum).not.toContain('vpc');
  const session=new DraftSession(parseAssistantRequest({...base,mode:'design',approvedPlan:{changes:[],sources:[]}}));
  expect(()=>session.edit({operations:[{op:'add-node',id:null,node:{id:'net',service:'vpc',label:'VPC',position:{x:0,y:0}},edge:null,settings:null}],relationships:[]})).toThrow('modeled as a frame');
  expect(session.draft.nodes).toHaveLength(2);
 });
});
