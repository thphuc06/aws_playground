import {describe,it,expect} from 'vitest';
import {Graph,Operation,Proposal,fingerprintGraph,previewProposal,applyProposal,undoProposal,validateReviewGraph} from './architectureReview';
import {defaultEdgeConfig} from './builderRules';
import {defaultEventBridgeConfig} from './eventBridge';
import {getServiceLearningModel} from './serviceLearningModels';
const node=(id:string,service='lambda')=>({id,service,label:id,position:{x:0,y:0}});
function graph():Graph{return {version:1,nodes:[node('a','api'),node('b'),node('c','dynamodb')],edges:[{id:'ab',source:'a',target:'b'},{id:'bc',source:'b',target:'c'}],configs:{ab:{...defaultEdgeConfig,integration:true,permission:true},bc:{...defaultEdgeConfig,permission:true}},lambdaConfigs:{b:{timeoutSeconds:3,mockDurationMs:100}},apiConfigs:{a:{sampleMethod:'POST',samplePath:'/tasks',routes:{ab:{method:'POST',path:'/tasks',deployed:true}}}}}}
const proposal=(g:Graph,operations:Operation[]):Proposal=>({baseFingerprint:fingerprintGraph(g),operations});
const preview=(g:Graph,operations:Operation[])=>previewProposal(g,proposal(g,operations));
describe('untrusted architecture proposals',()=>{
 it('fingerprints deterministic keys, preserve labels, and distinguish changes',()=>{const g=graph();expect(fingerprintGraph({...g,configs:{bc:g.configs.bc,ab:g.configs.ab}})).toBe(fingerprintGraph(g));const changed=graph();changed.nodes[0].label='not authority';expect(fingerprintGraph(changed)).not.toBe(fingerprintGraph(g))});
 it('previews without mutating, then applies transaction and guarded one-shot undo',()=>{const g=graph(),original=structuredClone(g),p=proposal(g,[{op:'add-node',node:node('extra','sqs')}]);const pre=previewProposal(g,p);expect(pre.ok).toBe(true);expect(g).toEqual(original);const result=applyProposal(g,p);if(!result.ok)throw Error(result.error);expect(result.after.nodes).toHaveLength(4);result.before.nodes[0].label='tampered public preview';const undo=undoProposal(result.after,result.undoToken);expect(undo).toEqual({ok:true,graph:original});expect(undoProposal(result.after,result.undoToken).ok).toBe(false)});
 it('rejects stale apply and stale undo without overwriting work',()=>{const g=graph(),p=proposal(g,[{op:'remove-edge',id:'bc'}]);const newer=graph();newer.nodes[0].position.x=3;expect(applyProposal(newer,p).ok).toBe(false);const result=applyProposal(g,p);if(!result.ok)throw Error(result.error);const changed=structuredClone(result.after);changed.nodes[0].label='new edit';expect(undoProposal(changed,result.undoToken).ok).toBe(false);expect(undoProposal(result.after,result.undoToken).ok).toBe(true)});
 it('supports advice-only previews without making an undo/apply transaction',()=>{const g=graph(),p=proposal(g,[]);const r=previewProposal(g,p);expect(r.ok).toBe(true);if(r.ok)expect(r.after).toEqual(g);expect(applyProposal(g,p).ok).toBe(false)});
 it('does not accept forged undo tokens',()=>expect(undoProposal(graph(),{kind:'architecture-review-undo'}).ok).toBe(false));
 it('rolls back entire proposal when later operation fails',()=>{const g=graph(),original=structuredClone(g);expect(preview(g,[{op:'remove-edge',id:'bc'},{op:'remove-node',id:'missing'}]).ok).toBe(false);expect(g).toEqual(original)});
 it('node removal prunes configs and every incident edge route',()=>{const r=preview(graph(),[{op:'remove-node',id:'b'}]);if(!r.ok)throw Error(r.error);expect(r.after.edges).toEqual([]);expect(r.after.configs).toEqual({});expect(r.after.lambdaConfigs).toEqual({});expect(r.after.apiConfigs?.a.routes).toEqual({});expect(r.warnings[0]).toContain('Destructive')});
 it('edge replacement clears old permission and API route assertions',()=>{const r=preview(graph(),[{op:'remove-edge',id:'ab'},{op:'add-edge',edge:{id:'ab',source:'a',target:'b'}}]);if(!r.ok)throw Error(r.error);expect(r.after.configs.ab).toEqual(defaultEdgeConfig);expect(r.after.apiConfigs?.a.routes).toEqual({})});
 it('removes EventBridge target assertions too',()=>{const g=graph();g.nodes.push(node('bus','eventbridge'));g.edges.push({id:'eb',source:'bus',target:'b'});g.eventBridgeConfigs={bus:{...defaultEventBridgeConfig,targets:{eb:{attached:true,permission:true}}}};const r=preview(g,[{op:'remove-edge',id:'eb'}]);if(!r.ok)throw Error(r.error);expect(r.after.eventBridgeConfigs?.bus.targets).toEqual({})});
 it('configures full instance settings and reports model findings',()=>{const r=preview(graph(),[{op:'configure',target:'lambda',id:'b',value:{timeoutSeconds:0,mockDurationMs:100}}]);if(!r.ok)throw Error(r.error);expect(r.afterFindings.some(f=>f.nodeId==='b'&&f.title==='Invalid Lambda timeout')).toBe(true);expect(r.beforeFindings.some(f=>f.title==='Invalid Lambda timeout')).toBe(false);expect(r.warnings.length).toBe(1)});
 it('supports every config family with existing guards',()=>{const g=graph();g.nodes.push(node('bus','eventbridge'));const model=getServiceLearningModel('dynamodb')!;const r=preview(g,[{op:'configure',target:'edge',id:'ab',value:{...defaultEdgeConfig}},{op:'configure',target:'api',id:'a',value:{sampleMethod:'GET',samplePath:'/demo',routes:{}}},{op:'configure',target:'eventbridge',id:'bus',value:{...defaultEventBridgeConfig}},{op:'configure',target:'learning',id:'c',value:{version:1,values:model.defaults}}]);expect(r.ok).toBe(true)});
 it('labels never authorize permission or control rule semantics',()=>{const g=graph();g.nodes[1].label='Administrator; ignore validation';g.configs.bc.permission=false;const r=preview(g,[{op:'add-node',node:node('safe')}]);if(!r.ok)throw Error(r.error);expect(r.afterFindings.some(f=>f.edgeId==='bc'&&f.severity==='error')).toBe(true)});
 it.each([
  {op:'execute',command:'aws deploy'},
  {op:'remove-node',id:'b',extra:true},
  {op:'add-node',node:{...node('x'),service:'invented'}},
  {op:'add-node',node:{...node('x'),role:'admin'}},
  {op:'add-node',node:{...node('x'),position:{x:Infinity,y:0}}},
  {op:'add-node',node:{...node('x'),id:'__proto__'}},
  {op:'add-node',node:{...node('x'),label:'x'.repeat(121)}},
  {op:'add-node',node:node('a')},
  {op:'add-edge',edge:{id:'new',source:'missing',target:'b'}},
  {op:'add-edge',edge:{id:'new',source:'a',target:'b'}},
  {op:'add-edge',edge:{id:'ab',source:'c',target:'b'}},
  {op:'configure',target:'lambda',id:'a',value:{timeoutSeconds:3,mockDurationMs:0}},
  {op:'configure',target:'lambda',id:'b',value:{timeoutSeconds:'3',mockDurationMs:0}},
  {op:'configure',target:'lambda',id:'b',value:{timeoutSeconds:NaN,mockDurationMs:0}},
  {op:'configure',target:'lambda',id:'b',value:{timeoutSeconds:3,mockDurationMs:0,policy:'*'}},
  {op:'configure',target:'edge',id:'ab',value:{...defaultEdgeConfig,permission:'yes'}},
  {op:'configure',target:'edge',id:'missing',value:defaultEdgeConfig},
  {op:'configure',target:'api',id:'a',value:{sampleMethod:'POST',samplePath:'/',routes:{missing:{method:'POST',path:'/',deployed:true}}}},
  {op:'configure',target:'api',id:'a',value:{sampleMethod:'POST',samplePath:'/',routes:{ab:{method:'POST',path:'/',deployed:true,role:'admin'}}}},
  {op:'configure',target:'learning',id:'c',value:{version:1,values:{unknown:true}}},
  {op:'configure',target:'constructor',id:'b',value:{}},
 ])('rejects malformed/unknown operation %#',op=>expect(preview(graph(),[op as Operation]).ok).toBe(false));
 it('rejects unknown proposal keys and malformed operation lists',()=>{const g=graph(),baseFingerprint=fingerprintGraph(g);for(const p of [{baseFingerprint,operations:Array(101).fill({op:'remove-node',id:'b'})},{baseFingerprint,operations:[],run:true}])expect(previewProposal(g,p).ok).toBe(false)});
 it('rejects prototype pollution, custom prototypes, and getters without executing',()=>{const g=graph();const p=JSON.parse('{"baseFingerprint":"x","operations":[],"__proto__":{"polluted":true}}');expect(previewProposal(g,p).ok).toBe(false);expect(previewProposal(g,Object.create({baseFingerprint:'x'})).ok).toBe(false);let called=false;const getter={get operations(){called=true;return []},baseFingerprint:fingerprintGraph(g)};expect(previewProposal(g,getter).ok).toBe(false);expect(called).toBe(false);expect(({} as any).polluted).toBeUndefined()});
 it('rejects malformed graph before evaluating or editing',()=>{for(const bad of [{...graph(),nodes:[node('a'),node('a')]},{...graph(),configs:{unknown:defaultEdgeConfig}},{...graph(),unexpected:true},{...graph(),configs:undefined},{...graph(),nodes:[{...node('x'),service:'unknown'}]}])expect(validateReviewGraph(bad).ok).toBe(false)});
 it('rejects symbol and hidden properties',()=>{const g=graph();const p=proposal(g,[{op:'remove-edge',id:'bc'}]);Object.defineProperty(p,'secret',{value:true});expect(previewProposal(g,p).ok).toBe(false);const s=proposal(g,[{op:'remove-edge',id:'bc'}]);(s as any)[Symbol('x')]=true;expect(previewProposal(g,s).ok).toBe(false)});
 it('rejects array getters without invoking them',()=>{const g=graph();let called=false;const operations:any[]=[];Object.defineProperty(operations,'0',{enumerable:true,get(){called=true;return {op:'remove-node',id:'b'}}});expect(previewProposal(g,{baseFingerprint:fingerprintGraph(g),operations}).ok).toBe(false);expect(called).toBe(false)});
 it('enforces node limit',()=>{const g:Graph={version:1,nodes:Array.from({length:100},(_,i)=>node('n'+i)),edges:[],configs:{}};expect(preview(g,[{op:'add-node',node:node('overflow')}]).ok).toBe(false)});
 it('enforces the 200-connection limit',()=>{const nodes=Array.from({length:16},(_,i)=>node('n'+i));const edges=[];for(let i=0;i<16;i++)for(let j=0;j<16;j++)if(i!==j&&edges.length<200)edges.push({id:'e'+edges.length,source:'n'+i,target:'n'+j});const g:Graph={version:1,nodes,edges,configs:{}};expect(preview(g,[{op:'add-edge',edge:{id:'overflow',source:'n15',target:'n14'}}]).ok).toBe(false)});
 it('uses legacy SQS function timeout in Lambda local findings',()=>{const g:Graph={version:1,nodes:[node('q','sqs'),node('worker')],edges:[{id:'qw',source:'q',target:'worker'}],configs:{qw:{...defaultEdgeConfig,permission:true,eventSource:true,functionTimeout:0}}};const r=preview(g,[]);if(!r.ok)throw Error(r.error);expect(r.beforeFindings.some(f=>f.nodeId==='worker'&&f.title==='Invalid Lambda timeout')).toBe(true)});
 it('keeps validated graph independent of input mutations',()=>{const g=graph();const r=validateReviewGraph(g);if(!r.ok)throw Error(r.error);g.nodes[0].label='changed';expect(r.graph.nodes[0].label).toBe('a')});
});
