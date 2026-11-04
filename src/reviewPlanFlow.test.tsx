// @vitest-environment jsdom
import {it,expect,afterEach,vi} from 'vitest';
import {render,screen,fireEvent,cleanup,waitFor} from '@testing-library/react';
import ArchitectureStudio from './ArchitectureStudio';
import {createWorkspace,workspaceKey,parseWorkspaceValue,latestReport,acceptCheckpoint} from './architectureWorkspace';
import {approvedPlanFrom,parseApprovedPlan} from './assistantPlan';
import {fingerprintGraph} from './architectureReview';
import type {AssistantResult,PlannedChange} from './assistantContract';
afterEach(()=>{cleanup();localStorage.clear();vi.unstubAllGlobals()});
const usage={inputTokens:10,cachedInputTokens:6,outputTokens:2,responses:2,searches:0,estimatedUsd:0,incomplete:false};
const change=(id:string,sourceIds:string[]=[]):PlannedChange=>({id,title:'Change '+id,rationale:'Why '+id+'; tradeoff noted.',kind:'configure',nodeIds:['web'],serviceIds:[],sourceIds});
const sources=[{id:'source-1',title:'EC2 security',url:'https://docs.aws.amazon.com/ec2/sg',verified:'2026-11-01',kind:'curated' as const},{id:'source-2',title:'Unused',url:'https://docs.aws.amazon.com/other',verified:'2026-11-01',kind:'curated' as const}];
function workspace(){const w=createWorkspace();w.purpose='Serve an HTTP application on EC2';w.original.nodes=[{id:'web',service:'ec2',label:'Application',position:{x:0,y:0}}];w.protectedNodeIds=['web'];return w}
it('reviews and plans only, then builds just the selected changes with only the sources they cite',async()=>{
 const w=workspace(),fingerprint=fingerprintGraph(w.original);localStorage.setItem(workspaceKey,JSON.stringify(w));vi.stubGlobal('confirm',()=>true);
 const review={mode:'review',baseFingerprint:fingerprint,summary:'Application is directly exposed.',assumptions:[],findings:[],sources,draft:null,usage,plan:[change('private-web',['source-1']),change('add-alarm')]};
 const bodies:any[]=[];
 vi.stubGlobal('fetch',vi.fn(async(url:string,init?:RequestInit)=>{if(String(url).endsWith('/status'))return new Response(JSON.stringify({enabled:true,authentication:'none',capabilities:{networkTopology:1,configurationSchema:2,architectureAssistant:1,reviewPlan:1,model:'gpt-6.1-terra'},budget:{scope:'none'}}));const body=JSON.parse(String(init?.body));bodies.push(body);return new Response(body.mode==='review'?'event: result\ndata: '+JSON.stringify(review)+'\n\n':'event: progress\ndata: {"stage":"working"}\n\n',{headers:{'Content-Type':'text/event-stream'}})}));
 render(<ArchitectureStudio Canvas={({title})=><div>{title??'Original diagram'}</div>}/>);
 fireEvent.click(screen.getByText('✦ AI review & proposal'));await waitFor(()=>expect(screen.getByText('● AI connected')).toBeDefined());
 fireEvent.click(screen.getByLabelText(/Send this diagram and purpose/));fireEvent.click(screen.getByRole('button',{name:'Review & plan only'}));
 await waitFor(()=>expect(screen.getByRole('region',{name:'Proposed change plan'})).toBeDefined());
 expect(bodies[0]).toMatchObject({mode:'review'});expect(bodies[0].approvedPlan).toBeUndefined();
 expect(screen.getByText('2 of 2 selected')).toBeDefined();
 fireEvent.click(screen.getByRole('checkbox',{name:/Change add-alarm/}));
 fireEvent.click(screen.getByRole('button',{name:'Build selected changes (1)'}));
 await waitFor(()=>expect(bodies).toHaveLength(2));
 expect(bodies[1].mode).toBe('design');expect(bodies[1].approvedPlan.changes.map((c:PlannedChange)=>c.id)).toEqual(['private-web']);expect(bodies[1].approvedPlan.sources.map((s:any)=>s.id)).toEqual(['source-1']);
});
it('hides the review-only action for a backend without plan support',async()=>{
 localStorage.setItem(workspaceKey,JSON.stringify(workspace()));
 vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({enabled:true,authentication:'none',capabilities:{networkTopology:1,configurationSchema:2,architectureAssistant:1},budget:{scope:'none'}}))));
 render(<ArchitectureStudio Canvas={()=><div/>}/>);fireEvent.click(screen.getByText('✦ AI review & proposal'));await waitFor(()=>expect(screen.getByText('● AI connected')).toBeDefined());
 expect(screen.queryByRole('button',{name:'Review & plan only'})).toBeNull();expect(screen.getByRole('button',{name:'Review & build proposal'})).toBeDefined();
});
it('stores plans safely, shows the newest result and keeps plan citations consistent',()=>{
 const w=workspace(),fingerprint=fingerprintGraph(w.original);
 const old:AssistantResult={mode:'design',baseFingerprint:fingerprint,summary:'Old',assumptions:[],findings:[],sources:[],draft:w.original,usage,requestContext:{purpose:w.purpose,priority:'balanced',protectedNodeIds:[],completedAt:'2026-11-01T00:00:00Z'}};
 const newer:AssistantResult={...old,mode:'review',draft:null,plan:[change('a')],requestContext:{...old.requestContext!,completedAt:'2026-11-02T00:00:00Z'}};
 expect(latestReport(newer,old)).toBe(newer);expect(latestReport(null,old)).toBe(old);expect(latestReport({...newer,requestContext:{...newer.requestContext!,completedAt:'2026-10-01T00:00:00Z'}},old)).toBe(old);
 expect(parseWorkspaceValue({...w,review:newer}).review?.plan).toHaveLength(1);
 expect(()=>parseWorkspaceValue({...w,review:{...newer,plan:[{...change('a'),kind:'deploy'}]}})).toThrow('cannot be read');
 const plan=approvedPlanFrom([change('a',['source-1'])],sources);expect(plan.sources.map(s=>s.id)).toEqual(['source-1']);expect(parseApprovedPlan(plan)).toEqual(plan);
 expect(()=>parseApprovedPlan({changes:[change('a',['source-9'])],sources})).toThrow('unknown source');
 expect(()=>parseApprovedPlan({changes:[],sources:[{...sources[0],url:'javascript:alert(1)'}]})).toThrow('sources');
 const checkpoint={draft:w.original,baseFingerprint:fingerprint,purpose:w.purpose,priority:'balanced' as const,protectedNodeIds:['web'],updatedAt:'2026-11-02T00:00:00Z',summary:'Edited',usage,plan};
 expect(acceptCheckpoint(w,checkpoint).checkpoint?.plan).toEqual(plan);expect(()=>acceptCheckpoint(w,{...checkpoint,plan:{changes:'x',sources:[]} as any})).toThrow();
});
