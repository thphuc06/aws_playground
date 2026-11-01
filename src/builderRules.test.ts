import {describe,it,expect} from 'vitest';
import {defaultEdgeConfig,getIntegrationRule,validateGraph,simulateGraph,builderSources,integrationRules,type BuilderNode,type BuilderEdge,type EdgeConfig} from './builderRules';
const nodes: BuilderNode[] = [{id:'api',service:'api',label:'API'},{id:'fn',service:'lambda',label:'Handler'},{id:'db',service:'dynamodb',label:'Table'}];
const edges: BuilderEdge[] = [{id:'invoke',source:'api',target:'fn'},{id:'write',source:'fn',target:'db'}];
const good = (): Record<string,EdgeConfig> => ({invoke:{...defaultEdgeConfig,integration:true,permission:true},write:{...defaultEdgeConfig,permission:true}});
const errors = (n=nodes,e=edges,c=good()) => validateGraph(n,e,c).filter(f=>f.severity==='error');
const queueNodes: BuilderNode[] = [{id:'q',service:'sqs',label:'Queue'},{id:'consumer',service:'lambda',label:'Consumer'}];
const queueEdges: BuilderEdge[] = [{id:'poll',source:'q',target:'consumer'}];
const queueConfig = (patch: Partial<EdgeConfig> = {}) => ({poll:{...defaultEdgeConfig,permission:true,eventSource:true,...patch}});
describe('bounded architecture rules',()=>{
 it('accepts configured API Lambda DynamoDB chain',()=>{expect(errors()).toEqual([]);expect(simulateGraph(nodes,edges,good()).valid).toBe(true)});
 it('distinguishes resource permission from execution role',()=>{const c=good();c.invoke.permission=false;expect(errors(nodes,edges,c)[0].detail).toContain('resource policy')});
 it('requires deployed route integration separately',()=>{const c=good();c.invoke.integration=false;expect(errors(nodes,edges,c)[0].title).toContain('route')});
 it('requires target table scoped execution permission',()=>{const c=good();c.write.permission=false;expect(errors(nodes,edges,c)[0].detail).toContain('dynamodb:PutItem on this table')});
 it('missing config denies instead of silently allowing',()=>expect(errors(nodes,edges,{}).length).toBe(3));
 it('labels unsupported directions without claiming AWS impossibility',()=>{expect(getIntegrationRule('api','dynamodb')).toBeUndefined();expect(errors(nodes,[{id:'x',source:'api',target:'db'}],{})[0].detail).toContain('not necessarily impossible')});
 it('requires queue consumer mapping separately',()=>expect(errors(queueNodes,queueEdges,queueConfig({eventSource:false}))[0].title).toContain('mapping'));
 it('requires all modeled consumer actions',()=>expect(errors(queueNodes,queueEdges,queueConfig({permission:false}))[0].detail).toContain('sqs:DeleteMessage'));
 it('rejects visibility shorter than function timeout',()=>expect(errors(queueNodes,queueEdges,queueConfig({visibility:4}))[0].title).toContain('Visibility'));
 it('warns but permits under-sixfold visibility',()=>{const c=queueConfig({visibility:10});expect(errors(queueNodes,queueEdges,c)).toEqual([]);expect(validateGraph(queueNodes,queueEdges,c).some(f=>f.severity==='warning')).toBe(true)});
 it('rejects non-finite or nonpositive timeouts',()=>{for(const value of [NaN,Infinity,0,-1]) expect(errors(queueNodes,queueEdges,queueConfig({visibility:value}))).toHaveLength(1)});
 it('explains partial batch handler requirement',()=>expect(validateGraph(queueNodes,queueEdges,queueConfig({partialBatch:true})).some(f=>f.detail.includes('handler code'))).toBe(true));
 it('models producer SendMessage permission',()=>{expect(getIntegrationRule('lambda','sqs')?.permissionLabel).toContain('sqs:SendMessage')});
 it('rejects cycles, even on otherwise supported edges',()=>{const es=[...queueEdges,{id:'send',source:'consumer',target:'q'}];expect(errors(queueNodes,es,{...queueConfig(),send:{...defaultEdgeConfig,permission:true}}).some(f=>f.title==='Cycle not modeled')).toBe(true)});
 it('rejects dangling, duplicate, and self connections',()=>{expect(errors(nodes,[{id:'x',source:'api',target:'gone'}],{}).some(f=>f.title==='Missing endpoint')).toBe(true);expect(errors(nodes,[...edges,edges[0]],good()).some(f=>f.title.includes('Duplicate'))).toBe(true);expect(errors(nodes,[{id:'s',source:'fn',target:'fn'}],{}).some(f=>f.title.includes('Self'))).toBe(true)});
 it('rejects empty or oversized canvases',()=>{expect(errors([],[],{}).length).toBe(2);expect(errors(Array.from({length:101},(_,i)=>({id:String(i),service:'lambda',label:'Fn'})),[],{}).some(f=>f.title.includes('limit'))).toBe(true)});
 it('detects duplicate node ids',()=>expect(errors([...nodes,nodes[0]],edges,good()).some(f=>f.title.includes('node ID'))).toBe(true));
 it('blocks simulation on any validation error',()=>expect(simulateGraph(nodes,edges,{})).toMatchObject({valid:false,events:[]}));
 it('is deterministic and does not mutate its inputs',()=>{const c=good(),before=JSON.stringify({nodes,edges,c});expect(simulateGraph(nodes,edges,c)).toEqual(simulateGraph(nodes,edges,c));expect(JSON.stringify({nodes,edges,c})).toBe(before);expect(simulateGraph(nodes,edges,c).events.map(e=>e.nodeId)).toEqual(['api','fn','db'])});
 it('permits independent multiple roots and warns on isolated nodes',()=>{const ns=[...nodes,...queueNodes,{id:'alone',service:'dynamodb' as const,label:'Unused'}],es=[...edges,...queueEdges],cs={...good(),...queueConfig()};expect(simulateGraph(ns,es,cs).valid).toBe(true);expect(validateGraph(ns,es,cs).some(f=>f.nodeId==='alone'&&f.severity==='warning')).toBe(true)});
 it('provides official source metadata and objective mapping for every rule',()=>{expect(builderSources.every(s=>s.url.startsWith('https://docs.aws.amazon.com/')&&s.verified==='2026-11-01')).toBe(true);expect(integrationRules.every(r=>r.examSkills.length>0)).toBe(true)});
});

describe('fan-in / fan-out and descriptive labels',()=>{
 const n:BuilderNode[]=[{id:'a',service:'lambda',label:'Lambda A'},{id:'b',service:'lambda',label:'Lambda B'},{id:'db',service:'dynamodb',label:'Shared table'},{id:'q',service:'sqs',label:'Queue'}];
 const e:BuilderEdge[]=[{id:'a-db',source:'a',target:'db',label:'Write orders'},{id:'b-db',source:'b',target:'db',label:'Write audit'},{id:'a-q',source:'a',target:'q',label:'Send jobs'}];
 const c=Object.fromEntries(e.map(edge=>[edge.id,{...defaultEdgeConfig,permission:true}]));
 it('supports same-type nodes sharing target and one source with several targets',()=>{expect(errors(n,e,c)).toEqual([]);expect(simulateGraph(n,e,c).events.filter(event=>event.edgeId).map(event=>event.edgeId).sort()).toEqual(['a-db','a-q','b-db'])});
 it('does not let descriptive labels override modeled actions or permissions',()=>{const labeled=e.map(edge=>({...edge,label:'reads anything'}));expect(simulateGraph(n,labeled,c).events).toEqual(simulateGraph(n,e,c).events);const missing={...c,'b-db':{...defaultEdgeConfig,permission:false}};expect(errors(n,labeled,missing).map(f=>f.edgeId)).toEqual(['b-db'])});
 it('removing one shared-target edge preserves its sibling connection',()=>{const remaining=e.filter(edge=>edge.id!=='a-db');expect(errors(n,remaining,c)).toEqual([]);expect(simulateGraph(n,remaining,c).events.some(event=>event.edgeId==='b-db')).toBe(true)});
 it('labels survive JSON persistence and endpoint updates',()=>{const stored:BuilderEdge=JSON.parse(JSON.stringify(e[0]));const changed={...stored,target:'q'};expect(changed.label).toBe('Write orders');expect(changed.target).toBe('q')});
});

describe('reference-only catalog safety',()=>{
 it('permits catalog storage but blocks unmodeled runtime execution',()=>{const n:BuilderNode[]=[{id:'bus',service:'eventbridge',label:'EventBridge'},{id:'fn',service:'lambda',label:'Lambda'}];const e:BuilderEdge[]=[{id:'event',source:'bus',target:'fn',label:'OrderCreated'}];const result=simulateGraph(n,e,{event:{...defaultEdgeConfig,permission:true}});expect(result.valid).toBe(false);expect(result.events).toEqual([]);expect(result.findings.some(f=>f.title==='EventBridge has a separate rule preview')).toBe(true);expect(result.findings.some(f=>f.title==='Use EventBridge target preview'&&f.edgeId==='event')).toBe(true);expect(result.findings.some(f=>f.title==='Unknown service')).toBe(false)});
 it('does not imply a fully modeled service pair supports every integration direction',()=>{const n:BuilderNode[]=[{id:'db',service:'dynamodb',label:'Table'},{id:'fn',service:'lambda',label:'Lambda'}];const result=simulateGraph(n,[{id:'stream',source:'db',target:'fn',label:'stream events'}],{});expect(result.valid).toBe(false);expect(result.findings[0].detail).toContain('not necessarily impossible in AWS')});
});
