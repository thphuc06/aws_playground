import {describe,it,expect} from 'vitest';
import {readWorkspace,saveWorkspace,workspaceKey,legacyGraphKey,createWorkspace,isDraftStale} from './architectureWorkspace';
import {fingerprintGraph} from './architectureReview';
describe('independent architecture workspaces',()=>{
 const storage=()=>{const data=new Map<string,string>();return {data,getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v)}}};
 it('migrates by copy and keeps legacy data intact across reload',()=>{const s=storage(),base=createWorkspace().original;s.setItem(legacyGraphKey,JSON.stringify(base));const w=readWorkspace(s);w.purpose='Study API integrations';w.draft=structuredClone(base);w.draft.nodes.push({id:'ai',service:'bedrock',label:'Inference',position:{x:0,y:0}});saveWorkspace(s,w);expect(readWorkspace(s).draft?.nodes).toHaveLength(1);expect(readWorkspace(s).original.nodes).toHaveLength(0);expect(s.getItem(legacyGraphKey)).toBe(JSON.stringify(base))});
 it('does not silently overwrite corrupt stored data',()=>{const s=storage();s.setItem(workspaceKey,'broken');expect(()=>readWorkspace(s)).toThrow();expect(s.getItem(workspaceKey)).toBe('broken')});
 it('detects original edits while a draft is being generated',()=>{const w=createWorkspace();w.draft=structuredClone(w.original);w.draftBase=fingerprintGraph(w.original);expect(isDraftStale(w)).toBe(false);w.original.nodes.push({id:'x',service:'ec2',label:'New edit',position:{x:0,y:0}});expect(isDraftStale(w)).toBe(true)});
 it('propagates quota failures instead of pretending a save succeeded',()=>{expect(()=>saveWorkspace({setItem(){throw new Error('quota')}},createWorkspace())).toThrow('quota')});
});
