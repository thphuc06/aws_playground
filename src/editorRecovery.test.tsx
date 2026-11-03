// @vitest-environment jsdom
import React,{useCallback,useState} from 'react';
import {IDBFactory} from 'fake-indexeddb';
import NetworkFrameEditor from './NetworkFrameEditor';
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor,within} from '@testing-library/react';
import {EditorRecoveryProvider,recoveryEntryContext,recoverySignature} from './editorRecovery';
import {createWorkspace,workspaceKey} from './architectureWorkspace';
import type {Graph} from './architectureReview';
import {createWorkspaceArchive,prepareWorkspaceImport,serializeWorkspaceArchive,type EditorRecoveryEntry} from './workspaceArchive';
import ArchitectureStudio,{type CanvasProps} from './ArchitectureStudio';
import ConfigurationInspector from './ConfigurationInspector';
import PolicyLibraryEditor from './PolicyEditor';
import CanonicalNetworkPanel from './CanonicalNetworkPanel';
import NetworkPanel from './NetworkPanel';
import {prepareResourceMigration} from './resourceMigration';
import {emptySecurityLibrary} from './configurationTypes';

vi.mock('./ConfigurationDocumentEditor',()=>({default:({value,onChange,label}:any)=><textarea aria-label={label} value={value} onChange={e=>onChange(e.target.value)}/>}));
beforeEach(()=>{vi.stubGlobal('indexedDB',undefined);vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(JSON.stringify({enabled:false,reason:'Local fixture'}))));});
afterEach(()=>{cleanup();localStorage.clear();vi.unstubAllGlobals();vi.restoreAllMocks();});
const graph=(service='lambda'):Graph=>({version:1,nodes:[{id:'same-node',service:service as any,label:'Fixture',position:{x:0,y:0}}],edges:[],configs:{}});
function InspectorCanvas({value,onChange,onConfigurationDirtyChange,title}:CanvasProps){if(!value?.nodes.length)return <p>Empty fixture</p>;return <div data-testid={title??'original'}><ConfigurationInspector service={value!.nodes[0].service} nodeId="same-node" graph={value} values={value!.architecture?.nodes['same-node']??{}} onDirtyChange={onConfigurationDirtyChange} onChange={(configuration,securityLibrary,network)=>onChange?.({...value!,architecture:{nodes:{'same-node':configuration},relationships:{}},securityLibrary,network})}/></div>;}
function Capture({children,source=graph()}:{children:React.ReactNode;source?:Graph}){
 const [entries,setEntries]=useState<Record<string,EditorRecoveryEntry>>({});
 const publish=useCallback((key:string,entry:EditorRecoveryEntry|null)=>setEntries(previous=>{const next={...previous};if(entry)next[key]=entry;else delete next[key];return next}),[]);
 return <EditorRecoveryProvider scope="original" workspaceId="fixture-workspace" baseRevision={7} graph={source} publish={publish}>{children}<output data-testid="capture">{JSON.stringify(Object.values(entries))}</output></EditorRecoveryProvider>;
}
const captured=()=>JSON.parse(screen.getByTestId('capture').textContent!) as EditorRecoveryEntry[];
it('exports invalid document text from original, draft and checkpoint with separate bound identities and preserves the dirty guard',async()=>{
 const w=createWorkspace(graph('step-functions'));w.draft=structuredClone(w.original);w.checkpoint={draft:structuredClone(w.original),baseFingerprint:'fixture',purpose:w.purpose,priority:w.priority,protectedNodeIds:[],summary:'Pending',updatedAt:new Date().toISOString(),usage:{inputTokens:0,outputTokens:0,responses:0,searches:0,estimatedUsd:0,incomplete:true}};localStorage.setItem(workspaceKey,JSON.stringify(w));
 let blob:Blob|undefined;vi.stubGlobal('URL',Object.assign(URL,{createObjectURL:vi.fn((b:Blob)=>{blob=b;return 'blob:fixture'}),revokeObjectURL:vi.fn()}));vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(()=>{});
 render(<ArchitectureStudio Canvas={InspectorCanvas}/>);
 const editors=await screen.findAllByLabelText('Amazon States Language definition');
 for(const [i,editor] of editors.entries())fireEvent.change(editor,{target:{value:'{invalid '+i}});
 await waitFor(()=>expect(screen.getByLabelText('Editor recovery snapshots').querySelectorAll('details')).toHaveLength(3));
 const event=new Event('beforeunload',{cancelable:true});window.dispatchEvent(event);expect(event.defaultPrevented).toBe(true);
 fireEvent.click(screen.getByRole('button',{name:'Export saved diagram JSON'}));await waitFor(()=>expect(blob).toBeDefined());
 const text=await new Promise<string>(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.readAsText(blob!)});
 const imported=prepareWorkspaceImport(text),entries=imported.archive.facets.editorRecovery!.entries;
 expect(entries.map(e=>e.scope).sort()).toEqual(['checkpoint','draft','original']);
 expect(entries.every(e=>e.nodeId==='same-node'&&e.workspaceId==='legacy'&&e.baseRevision===0&&e.graphSchema===1&&e.configurationSchema===2)).toBe(true);
 expect(entries.map(e=>JSON.parse(e.raw).configuration.values.definition).sort()).toEqual(['{invalid 0','{invalid 1','{invalid 2']);
 expect(imported.archive.facets.workspace.original.architecture).toBeUndefined();
 fireEvent.click(within(screen.getByTestId('original')).getByRole('button',{name:'Cancel edits'}));
 await waitFor(()=>expect(screen.getByLabelText('Editor recovery snapshots').querySelectorAll('details')).toHaveLength(2));
});
it('clears typed buffers after save/cancel and gives each editor its own label targets',()=>{
 function Harness(){const [g,setG]=useState(graph());return <Capture source={g}><div data-testid="one"><InspectorCanvas value={g} onChange={setG}/></div><div data-testid="two"><InspectorCanvas value={graph()}/></div></Capture>}
 render(<Harness/>);const one=within(screen.getByTestId('one')),two=within(screen.getByTestId('two'));
 const first=one.getByLabelText(/^Timeout/,{selector:'input'}),second=two.getByLabelText(/^Timeout/,{selector:'input'});expect(first.id).not.toBe(second.id);
 expect(document.getElementById(first.id)).toBe(first);expect(document.getElementById(second.id)).toBe(second);
 expect(first.closest('[data-field-path]')?.getAttribute('data-field-path')).toBe('timeoutSeconds');
 fireEvent.change(first,{target:{value:'12'}});expect(captured()).toHaveLength(1);fireEvent.click(one.getByRole('button',{name:'Save configuration'}));expect(captured()).toHaveLength(0);
 fireEvent.change(first,{target:{value:'13'}});fireEvent.click(one.getByRole('button',{name:'Cancel edits'}));expect(captured()).toHaveLength(0);expect((first as HTMLInputElement).value).toBe('12');
});
it('captures unfinished invalid IAM policy text and roles before saving to the library, and clears canceled buffers',async()=>{
 const dirty=vi.fn();function Harness(){const [library,setLibrary]=useState(emptySecurityLibrary());return <Capture><PolicyLibraryEditor library={library} onChange={setLibrary} onDirtyChange={dirty}/></Capture>}
 render(<Harness/>);fireEvent.change(await screen.findByLabelText('identity policy JSON'),{target:{value:'{broken policy'}});
 expect(JSON.parse(captured()[0].raw).text).toBe('{broken policy');expect(dirty).toHaveBeenLastCalledWith(true);
 fireEvent.click(screen.getByRole('button',{name:'Cancel policy and role edits'}));expect(captured()).toHaveLength(0);expect(dirty).toHaveBeenLastCalledWith(false);
 fireEvent.click(screen.getByRole('button',{name:'roles'}));fireEvent.change(screen.getByLabelText('Role name'),{target:{value:'Draft role'}});expect(captured()[0].fieldPath).toBe('securityLibrary.roleDraft');fireEvent.click(screen.getByRole('button',{name:'Save role to draft library'}));expect(captured()).toHaveLength(0);
});
it.each([false,true])('captures and clears %s canonical network drafts',canonical=>{
 function Harness(){const [g,setG]=useState(canonical?prepareResourceMigration(graph()).graph:graph());return <Capture source={g}>{canonical?<CanonicalNetworkPanel graph={g} onChange={setG} selectedFrame="" onSelectFrame={()=>{}}/>:<NetworkPanel graph={g} onChange={setG} selectedFrame="" onSelectFrame={()=>{}} resourceRequest={{kind:'security-group',nonce:1}}/>}</Capture>}
 render(<Harness/>);
 if(canonical){fireEvent.click(screen.getByRole('button',{name:'Create canonical resource'}));fireEvent.change(screen.getByLabelText('Canonical resource name'),{target:{value:'Unsaved VPC'}});}else fireEvent.change(screen.getByLabelText('Resource name'),{target:{value:'Unsaved SG'}});
 expect(captured()).toHaveLength(1);expect(captured()[0].resourceId).toBeTruthy();expect(JSON.parse(captured()[0].raw).name).toBe(canonical?'Unsaved VPC':'Unsaved SG');
 fireEvent.click(screen.getByRole('button',{name:canonical?'Cancel resource edits':'Cancel edits'}));expect(captured()).toHaveLength(0);
});
it('imports historical recovery without applying it and labels stale, orphaned and unbound snapshots',()=>{
 const w=createWorkspace(graph()),entry:EditorRecoveryEntry={scope:'original',nodeId:'same-node',fieldPath:'configuration',raw:'{broken',format:'json',workspaceId:'old',baseRevision:4,graphSchema:1,configurationSchema:2,baseSignature:recoverySignature(w.original)};
 const imported=prepareWorkspaceImport(serializeWorkspaceArchive(createWorkspaceArchive(w,{editorRecovery:{version:1,entries:[entry]}})));
 expect(imported.archive.facets.workspace).toEqual(w);expect(imported.archive.facets.editorRecovery!.entries[0].raw).toBe('{broken');expect(recoveryEntryContext(entry,w,'new')).toMatch(/another workspace/);
 expect(recoveryEntryContext({...entry,baseSignature:'old'},w,'old')).toMatch(/Stale/);expect(recoveryEntryContext({...entry,nodeId:'missing'},w)).toMatch(/Orphaned/);
 expect(recoveryEntryContext({scope:'original',fieldPath:'text',raw:'bad',format:'text'},w)).toMatch(/Legacy/);
});

it('retains imported recovery for inspection while loading only saved configuration into the live editor',async()=>{
 vi.stubGlobal('indexedDB',new IDBFactory());const saved=graph();saved.architecture={nodes:{'same-node':{schemaVersion:2,values:{timeoutSeconds:12},legacyNotes:{}}},relationships:{}};
 const entry:EditorRecoveryEntry={scope:'original',nodeId:'same-node',fieldPath:'configuration',raw:'{invalid from old editor',format:'json',workspaceId:'old-copy',baseRevision:2,graphSchema:1,configurationSchema:2,baseSignature:'old-snapshot'};
 const archive=createWorkspaceArchive(createWorkspace(saved),{editorRecovery:{version:1,entries:[entry]}});
 render(<ArchitectureStudio Canvas={InspectorCanvas}/>);
 await waitFor(()=>expect((screen.getByLabelText('Choose workspace backup') as HTMLInputElement).disabled).toBe(false));
 fireEvent.change(screen.getByLabelText('Choose workspace backup'),{target:{files:[new File([serializeWorkspaceArchive(archive)],'recovery.json',{type:'application/json'})]}});
 await screen.findByRole('region',{name:'Workspace import preview'});fireEvent.click(screen.getByRole('button',{name:'Import as new workspace'}));
 await waitFor(()=>expect((screen.getByLabelText(/^Timeout/,{selector:'input'}) as HTMLInputElement).value).toBe('12'));
 expect(screen.getByText(/Historical recovery from another workspace/)).toBeDefined();expect(screen.getByText('{invalid from old editor')).toBeDefined();expect(screen.getByRole('button',{name:'Download editor recovery JSON'})).toBeDefined();
 expect((screen.getByRole('button',{name:'Save configuration'}) as HTMLButtonElement).disabled).toBe(true);
});
it('captures frame edits and clears their recovery after saving or canceling',()=>{
 const initial={...graph(),network:{version:1 as const,resources:[],membership:{},frames:[{id:'frame',name:'Frame',kind:'region' as const,x:0,y:0,width:700,height:500}]}};
 function Harness(){const [g,setG]=useState(initial);return <Capture source={g}><NetworkFrameEditor frame={g.network.frames[0]} graph={g} onDirtyChange={()=>{}} onSave={network=>{setG({...g,network} as typeof initial);return true}}/></Capture>}
 render(<Harness/>);fireEvent.change(screen.getByLabelText('Name'),{target:{value:'Draft frame'}});expect(captured()[0].resourceId).toBe('frame');fireEvent.click(screen.getByRole('button',{name:'Save frame'}));expect(captured()).toHaveLength(0);
 fireEvent.change(screen.getByLabelText('Name'),{target:{value:'Discard me'}});fireEvent.click(screen.getByRole('button',{name:'Cancel frame edits'}));expect(captured()).toHaveLength(0);expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('Draft frame');
});
it('keeps a maximum-size raw document exportable inside its typed recovery snapshot',()=>{
 const raw=JSON.stringify({configuration:{values:{definition:'{'+ 'x'.repeat(262143)}}});const w=createWorkspace(graph());
 const archive=createWorkspaceArchive(w,{editorRecovery:{version:1,entries:[{scope:'original',fieldPath:'configuration',format:'json',raw}]}});
 expect(prepareWorkspaceImport(serializeWorkspaceArchive(archive)).archive.facets.editorRecovery!.entries[0].raw).toBe(raw);
});

it('keeps unfinished policy text when switching inspector tabs and includes the draft library until configuration is saved',async()=>{
 const dirty=vi.fn();render(<Capture><ConfigurationInspector service="lambda" nodeId="same-node" graph={graph()} values={{}} onChange={()=>{}} onDirtyChange={dirty}/></Capture>);
 fireEvent.click(screen.getByRole('tab',{name:'Permissions'}));fireEvent.change(await screen.findByLabelText('identity policy JSON'),{target:{value:'{unfinished'}});
 fireEvent.click(screen.getByRole('tab',{name:'Configuration'}));expect(JSON.parse(captured()[0].raw).text).toBe('{unfinished');expect(dirty).toHaveBeenLastCalledWith(true);
 expect((screen.getByRole('button',{name:'Save configuration'}) as HTMLButtonElement).disabled).toBe(true);
 fireEvent.click(screen.getByRole('tab',{name:'Permissions'}));expect((screen.getByLabelText('identity policy JSON') as HTMLTextAreaElement).value).toBe('{unfinished');
 fireEvent.click(screen.getByRole('button',{name:'Cancel edits'}));expect(captured()).toHaveLength(0);
 fireEvent.change(await screen.findByLabelText('identity policy JSON'),{target:{value:JSON.stringify({Version:'2012-10-17',Statement:[{Effect:'Allow',Action:'s3:GetObject',Resource:'arn:aws:s3:::example/*'}]})}});
 fireEvent.click(screen.getByRole('button',{name:'Save policy to draft library'}));expect(captured()).toHaveLength(1);expect(JSON.parse(captured()[0].raw).securityLibrary.policies).toHaveLength(1);
 fireEvent.click(screen.getByRole('button',{name:'Save configuration'}));expect(captured()).toHaveLength(0);
});
