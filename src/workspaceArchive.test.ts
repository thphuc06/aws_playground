import {describe,it,expect} from 'vitest';
import {createWorkspace} from './architectureWorkspace';
import {fingerprintGraph} from './architectureReview';
import {ARCHIVE_FORMAT,ARCHIVE_MAX_BYTES,createWorkspaceArchive,prepareWorkspaceImport,serializeWorkspaceArchive} from './workspaceArchive';

function fixture(){
 const w=createWorkspace();w.purpose='Review a synthetic queue worker';w.original.nodes=[{id:'queue',service:'sqs',label:'Queue',position:{x:10,y:30}},{id:'worker',service:'lambda',label:'Worker',position:{x:400,y:30}}];w.original.edges=[{id:'delivery',source:'queue',target:'worker',label:'jobs'}];w.original.edgeLayouts={delivery:{style:'orthogonal',waypoints:[{x:220,y:70}]}};
 w.original.architecture={nodes:{worker:{schemaVersion:2,values:{timeoutSeconds:30},legacyNotes:{executionRole:'Review this role before declaring it'}}},relationships:{delivery:'data'}};
 w.original.securityLibrary={version:1,roles:[{id:'role',name:'Worker role',policyIds:['read'],sessionPolicyIds:[]}],policies:[{id:'read',name:'Read messages',kind:'identity',document:'{\n "Version": "2012-10-17",\n "Statement": [{"Effect":"Allow","Action":"sqs:ReceiveMessage","Resource":"arn:aws:sqs:us-east-1:123456789012:jobs"}]\n}'}]};
 w.original.network={version:1,frames:[{id:'vpc',kind:'vpc',name:'VPC',x:0,y:0,width:800,height:600,cidr:'10.0.0.0/16'}],membership:{worker:'vpc'},resources:[{id:'sg',kind:'security-group',name:'Worker SG',frameId:'vpc',assignedTo:['worker'],values:{inbound:[]}}]};
 w.draft=structuredClone(w.original);w.draft.nodes[1].label='Proposed worker';w.draftBase=fingerprintGraph(w.original);w.checkpoint={draft:structuredClone(w.draft),baseFingerprint:w.draftBase,purpose:w.purpose,priority:w.priority,protectedNodeIds:[],summary:'Unfinished review',updatedAt:'2026-11-02T00:00:00Z',usage:{inputTokens:0,outputTokens:0,responses:0,searches:0,estimatedUsd:0,incomplete:true}};
 return w;
}
describe('portable workspace backup',()=>{
 it('roundtrips independent graphs, exact policy text, geometry, resources, notes and unfinished checkpoint',()=>{
  const w=fixture(),text=serializeWorkspaceArchive(createWorkspaceArchive(w)),preview=prepareWorkspaceImport(text);
  expect(preview.archive.facets.workspace).toEqual(w);expect(preview.counts.original).toEqual({nodes:2,connections:1,resources:1});
  preview.archive.facets.workspace.draft!.nodes[0].label='Edited copy';expect(preview.archive.facets.workspace.original.nodes[0].label).toBe('Queue');expect(w.draft!.nodes[0].label).toBe('Queue');
 });
 it('excludes report bodies by default without inventing a new review fingerprint',()=>{
  const w=fixture();w.proposal={mode:'design',baseFingerprint:w.draftBase!,summary:'Historical result',assumptions:[],findings:[],sources:[],draft:w.draft,usage:{inputTokens:0,outputTokens:0,responses:0,searches:0,estimatedUsd:0,incomplete:false}};
  const lean=createWorkspaceArchive(w);expect(lean.facets.workspace.proposal).toBeNull();expect(lean.facets.workspace.draftBase).toBe(w.draftBase);expect(createWorkspaceArchive(w,{reportsIncluded:true}).facets.workspace.proposal).toEqual(w.proposal);
 });
 it('does not export unrelated authentication properties from the workspace root',()=>{
  const w=Object.assign(fixture(),{apiKey:'fixture-not-a-key',backend:'private'});const text=serializeWorkspaceArchive(createWorkspaceArchive(w));expect(text).not.toContain('fixture-not-a-key');expect(text).not.toContain('"backend"');
 });
 it('retains invalid editor text separately without applying it to saved configuration',()=>{
  const raw='{ "Statement": [ invalid';const archive=createWorkspaceArchive(fixture(),{editorRecovery:{version:1,entries:[{scope:'original',nodeId:'worker',fieldPath:'policy',format:'json',raw}]}});const preview=prepareWorkspaceImport(serializeWorkspaceArchive(archive));expect(preview.archive.facets.editorRecovery?.entries[0].raw).toBe(raw);expect(preview.archive.facets.workspace.original.architecture!.nodes.worker.values).toEqual({timeoutSeconds:30});expect(preview.warnings.join(' ')).toContain('never applied');
 });
 it('retains an optional learning facet without claiming to have restored learning progress',()=>{
  const value={version:2,attempts:[]};const preview=prepareWorkspaceImport(serializeWorkspaceArchive(createWorkspaceArchive(fixture(),{learning:value})));expect(preview.archive.facets.learning).toEqual(value);expect(preview.warnings.join(' ')).toContain('will not replace');
 });
 it('rejects invalid learning data when its owner supplies validation',()=>{
  const text=serializeWorkspaceArchive(createWorkspaceArchive(fixture(),{learning:{invalid:true}}));expect(()=>prepareWorkspaceImport(text,{export:async()=>({}),validate(){throw new Error('Invalid learning payload');},prepareImport:async()=>[]})).toThrow('Invalid learning payload');
 });
 it('migrates a v2 copy and preserves prose without changing the input or review evidence',()=>{
  const w={...createWorkspace(),version:2};w.original.nodes=[{id:'worker',service:'lambda',label:'Worker',position:{x:0,y:0}}];w.original.architecture={nodes:{worker:{timeoutSeconds:20,executionRole:'Review permissions'}},relationships:{}};const text=JSON.stringify(w),preview=prepareWorkspaceImport(text);expect(JSON.stringify(w)).toBe(text);expect(preview.archive.facets.workspace.original.architecture!.nodes.worker).toEqual({schemaVersion:2,values:{timeoutSeconds:20},legacyNotes:{executionRole:'Review permissions'}});expect(preview.sourceVersion).toBe(2);
 });
 it('accepts a bounded legacy graph without manufacturing a proposal',()=>{
  const result=prepareWorkspaceImport(JSON.stringify(fixture().original));expect(result.sourceVersion).toBe(1);expect(result.archive.facets.workspace.draft).toBeNull();
 });
 it.each(['{broken','{"format":"'+ARCHIVE_FORMAT+'","archiveVersion":99}','{"__proto__":{"polluted":true}}','{"version":3,"original":{}}'])('rejects corrupt/unsupported data: %s',text=>expect(()=>prepareWorkspaceImport(text)).toThrow());
 it('checks file size before parsing and rejects missing referenced nodes',()=>{
  expect(()=>prepareWorkspaceImport(' '.repeat(ARCHIVE_MAX_BYTES+1))).toThrow('32 MiB');const w=fixture();w.original.nodes=[];expect(()=>prepareWorkspaceImport(JSON.stringify(w))).toThrow();
 });
});
