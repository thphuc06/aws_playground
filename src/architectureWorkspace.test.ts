import {describe,it,expect} from 'vitest';
import {readWorkspace,saveWorkspace,workspaceKey,legacyGraphKey,createWorkspace,isDraftStale,acceptAssistantResult,completionNotice,graphChanges} from './architectureWorkspace';
import type {AssistantResult} from './assistantContract';
import {fingerprintGraph} from './architectureReview';
describe('independent architecture workspaces',()=>{
 it('ignores node positioning in the architecture diff and detects actual configuration changes',()=>{const g=createWorkspace().original;g.nodes.push({id:'web',service:'ec2',label:'Web server',position:{x:0,y:0}});const after=structuredClone(g);after.nodes[0].position={x:500,y:300};expect(graphChanges(g,after)).toEqual([]);after.architecture={nodes:{web:{exposure:'private'}},relationships:{}};expect(graphChanges(g,after)).toEqual(['Configure Web server: exposure'])});
 it('stores reviews separately and only a design result creates the proposal canvas',()=>{
  const w=createWorkspace();const result:AssistantResult={mode:'review',baseFingerprint:fingerprintGraph(w.original),summary:'Review done',assumptions:[],findings:[],sources:[],draft:null,usage:{inputTokens:1,outputTokens:1,responses:1,searches:0,estimatedUsd:0,incomplete:false}};
  const reviewed=acceptAssistantResult(w,result);expect(reviewed.review).toEqual(result);expect(reviewed.proposal).toBeNull();expect(reviewed.draft).toBeNull();expect(completionNotice('review',false)).toContain('Review & build proposal');
  const draft={...w.original,nodes:[{id:'new',service:'ec2',label:'AI web server',position:{x:0,y:0}}]};const designed=acceptAssistantResult(reviewed,{...result,mode:'design',draft});expect(designed.draft?.nodes).toHaveLength(1);expect(designed.original.nodes).toHaveLength(0);expect(designed.review).toEqual(result);expect(acceptAssistantResult(designed,result).draft).toEqual(draft);expect(completionNotice('design',false)).toContain('editable diagram');
 });
 const storage=()=>{const data=new Map<string,string>();return {data,getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v)}}};
 it('migrates by copy and keeps legacy data intact across reload',()=>{const s=storage(),base=createWorkspace().original;s.setItem(legacyGraphKey,JSON.stringify(base));const w=readWorkspace(s);w.purpose='Study API integrations';w.draft=structuredClone(base);w.draft.nodes.push({id:'ai',service:'bedrock',label:'Inference',position:{x:0,y:0}});saveWorkspace(s,w);expect(readWorkspace(s).draft?.nodes).toHaveLength(1);expect(readWorkspace(s).original.nodes).toHaveLength(0);expect(s.getItem(legacyGraphKey)).toBe(JSON.stringify(base))});
 it('does not silently overwrite corrupt stored data',()=>{const s=storage();s.setItem(workspaceKey,'broken');expect(()=>readWorkspace(s)).toThrow();expect(s.getItem(workspaceKey)).toBe('broken')});
 it('detects original edits while a draft is being generated',()=>{const w=createWorkspace();w.draft=structuredClone(w.original);w.draftBase=fingerprintGraph(w.original);expect(isDraftStale(w)).toBe(false);w.original.nodes.push({id:'x',service:'ec2',label:'New edit',position:{x:0,y:0}});expect(isDraftStale(w)).toBe(true)});
 it('propagates quota failures instead of pretending a save succeeded',()=>{expect(()=>saveWorkspace({setItem(){throw new Error('quota')}},createWorkspace())).toThrow('quota')});
});
