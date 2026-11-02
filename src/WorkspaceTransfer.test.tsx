// @vitest-environment jsdom
import React from 'react';
import {IDBFactory} from 'fake-indexeddb';
import {it,expect,vi,beforeEach,afterEach} from 'vitest';
import {render,screen,fireEvent,waitFor,cleanup} from '@testing-library/react';
import ArchitectureStudio from './ArchitectureStudio';
import WorkspaceTransfer from './WorkspaceTransfer';
import {createWorkspace,workspaceKey} from './architectureWorkspace';
import {createWorkspaceArchive,serializeWorkspaceArchive} from './workspaceArchive';
import {openLocalRepository} from './workspaceDatabase';
import {ACTIVE_WORKSPACE_KEY,listWorkspaceCopies} from './workspaceRepository';
beforeEach(()=>{vi.stubGlobal('indexedDB',new IDBFactory());vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(JSON.stringify({enabled:true,authentication:'none',capabilities:{networkTopology:1,configurationSchema:2,architectureAssistant:1,model:'fixture'}}))));});
afterEach(()=>{cleanup();localStorage.clear();vi.unstubAllGlobals();});
it('hydrates a legacy diagram then persists edits transactionally without rewriting legacy storage',async()=>{
 const w=createWorkspace();w.original.nodes=[{id:'worker',service:'lambda',label:'Before',position:{x:0,y:0}}];const raw=JSON.stringify(w);localStorage.setItem(workspaceKey,raw);
 render(<ArchitectureStudio Canvas={({value,onChange})=><div><span>{value?.nodes[0]?.label}</span><button onClick={()=>onChange?.({...value!,nodes:value!.nodes.map(n=>({...n,label:'After'}))})}>Edit fixture</button></div>}/>);
 expect(screen.queryByText('Edit fixture')).toBeNull();await screen.findByRole('button',{name:'Edit fixture'});fireEvent.click(screen.getByText('Edit fixture'));
 const db=await openLocalRepository();try{await waitFor(async()=>{const active=await db.read<{id:string}>(ACTIVE_WORKSPACE_KEY);const record=await db.read<{workspace:{original:{nodes:{label:string}[]}}}>('workspace:'+active!.value.id);expect(record?.value.workspace.original.nodes[0].label).toBe('After');});expect(localStorage.getItem(workspaceKey)).toBe(raw);}finally{db.close();}
});
it('shows raw recovery for corrupt storage and imports a known-good file into a new record',async()=>{
 localStorage.setItem(workspaceKey,'{broken');render(<ArchitectureStudio Canvas={()=> <div>Restored diagram</div>}/>);
 await screen.findByRole('button',{name:'Download raw backup: '+workspaceKey});await waitFor(()=>expect((screen.getByLabelText('Choose workspace backup') as HTMLInputElement).disabled).toBe(false));
 const w=createWorkspace();w.purpose='Recovered fixture';const file=new File([serializeWorkspaceArchive(createWorkspaceArchive(w))],'recovery.json',{type:'application/json'});fireEvent.change(screen.getByLabelText('Choose workspace backup'),{target:{files:[file]}});
 await screen.findByRole('region',{name:'Workspace import preview'});expect(screen.queryByText('Restored diagram')).toBeNull();fireEvent.click(screen.getByRole('button',{name:'Import as new workspace'}));await screen.findByText('Restored diagram');expect(localStorage.getItem(workspaceKey)).toBe('{broken');
 const db=await openLocalRepository();try{expect((await listWorkspaceCopies(db))[0].value.workspace.purpose).toBe('Recovered fixture');}finally{db.close();}
});
it('disables importing during an AI request or dirty inspector while explicitly offering saved-only export',()=>{
 const props={workspace:createWorkspace(),storageReady:true,onImport:vi.fn(),busy:true,dirty:false};const {rerender}=render(<WorkspaceTransfer {...props}/>);expect((screen.getByLabelText('Choose workspace backup') as HTMLInputElement).disabled).toBe(true);expect(screen.getByText(/An AI request is active/)).toBeDefined();rerender(<WorkspaceTransfer {...props} busy={false} dirty/>);expect(screen.getByRole('button',{name:'Export saved diagram JSON'})).toBeDefined();expect(screen.getByText(/those editor changes are not included/)).toBeDefined();expect((screen.getByLabelText('Choose workspace backup') as HTMLInputElement).disabled).toBe(true);
});
it('rejects an invalid import in preview without invoking the write callback',async()=>{
 const onImport=vi.fn();render(<WorkspaceTransfer workspace={createWorkspace()} storageReady busy={false} dirty={false} onImport={onImport}/>);fireEvent.change(screen.getByLabelText('Choose workspace backup'),{target:{files:[new File(['{not-json'],'bad.json',{type:'application/json'})]}});await screen.findByText(/This file is not valid JSON/);expect(onImport).not.toHaveBeenCalled();expect(screen.queryByRole('button',{name:'Import as new workspace'})).toBeNull();
});
it('reports aggregate dirty state to the outer learning-route guard',async()=>{
 const dirty=vi.fn();render(<ArchitectureStudio onConfigurationDirtyChange={dirty} Canvas={({onConfigurationDirtyChange})=><button onClick={()=>onConfigurationDirtyChange?.(true)}>Start unsaved edit</button>}/>);await screen.findByText('Start unsaved edit');fireEvent.click(screen.getByText('Start unsaved edit'));expect(dirty).toHaveBeenLastCalledWith(true);expect((screen.getByLabelText('Choose workspace backup') as HTMLInputElement).disabled).toBe(true);
});
