// @vitest-environment jsdom
import React from 'react';
import {render,screen,fireEvent,cleanup,waitFor} from '@testing-library/react';
import {it,expect,vi,beforeEach,afterEach} from 'vitest';
vi.mock('@xyflow/react',()=>({ReactFlowProvider:({children}:any)=>children,ReactFlow:({nodes,edges,onNodeClick,onEdgeClick,children}:any)=><div>{nodes.map((n:any)=><button key={n.id} onClick={()=>onNodeClick({},n)}>{n.type==='networkFrame'?n.data.label:n.id}</button>)}{edges?.map((e:any)=><button key={e.id} onClick={()=>onEdgeClick({},e)}>edge-{e.id}</button>)}{children}</div>,useViewport:()=>({zoom:1,x:0,y:0}),useReactFlow:()=>({fitView:()=>Promise.resolve(),screenToFlowPosition:(p:any)=>p}),NodeResizer:()=>null,Background:()=>null,Controls:()=>null,MarkerType:{ArrowClosed:'arrowclosed'},Position:{Right:'right',Left:'left'}}));
import {App} from './main';
beforeEach(()=>{localStorage.clear();history.replaceState({},'','/?view=builder&exam=DVA-C03');vi.stubGlobal('matchMedia',()=>({matches:false,addEventListener:()=>{},removeEventListener:()=>{}}));vi.stubGlobal('scrollTo',vi.fn());vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new Error('offline synthetic fixture')));vi.stubGlobal('confirm',vi.fn(()=>false));Element.prototype.scrollIntoView=vi.fn()});
afterEach(()=>{cleanup();vi.unstubAllGlobals()});
const saved=()=>JSON.parse(localStorage.getItem('aws-playground-workspace-v3')!).original;
it('consumes example requests once so returning to Builder preserves later saved work',()=>{
 render(<App/>);fireEvent.click(screen.getByRole('button',{name:/01 Serverless request/}));fireEvent.click(screen.getByRole('button',{name:'Add Amazon EC2'}));expect(saved().nodes.some((n:any)=>n.service==='ec2')).toBe(true);
 fireEvent.click(screen.getByRole('button',{name:'Service library'}));fireEvent.click(screen.getByRole('button',{name:'Architecture builder'}));expect(saved().nodes.some((n:any)=>n.service==='ec2')).toBe(true);expect(window.confirm).not.toHaveBeenCalled();
});
it('protects dirty configuration from sidebar and search navigation until the user explicitly discards it',()=>{
 render(<App/>);fireEvent.click(screen.getByRole('button',{name:'Add AWS Lambda'}));fireEvent.click(screen.getByRole('button',{name:saved().nodes[0].id}));fireEvent.click(screen.getByRole('button',{name:'Use documented defaults for this section'}));expect(screen.getByText('Unsaved changes')).toBeDefined();
 fireEvent.click(screen.getByRole('button',{name:'Service library'}));expect(window.confirm).toHaveBeenCalledTimes(1);expect(screen.queryByRole('heading',{name:'Service reference library'})).toBeNull();expect(screen.getByText('Unsaved changes')).toBeDefined();
 const search=screen.getByRole('combobox',{name:'Search lessons, sections and services'});fireEvent.change(search,{target:{value:'PrivateLink'}});fireEvent.click(screen.getByRole('option',{name:/service AWS PrivateLink/}));expect(window.confirm).toHaveBeenCalledTimes(2);expect(screen.getByText('Unsaved changes')).toBeDefined();
 vi.mocked(window.confirm).mockReturnValue(true);fireEvent.click(screen.getByRole('button',{name:'Service library'}));expect(screen.getByRole('heading',{name:'Service reference library'})).toBeDefined();expect(saved().architecture?.nodes[saved().nodes[0].id]?.values?.memoryMb).toBeUndefined();
});
it('acknowledges a canceled example request so a later return cannot replay it',()=>{
 render(<App/>);fireEvent.click(screen.getByRole('button',{name:'Add AWS Lambda'}));const id=saved().nodes[0].id;fireEvent.click(screen.getByRole('button',{name:id}));fireEvent.click(screen.getByRole('button',{name:'Use documented defaults for this section'}));fireEvent.click(screen.getByRole('button',{name:/01 Serverless request/}));expect(window.confirm).toHaveBeenCalledTimes(1);expect(saved().nodes).toHaveLength(1);fireEvent.click(screen.getByRole('button',{name:'Cancel edits'}));fireEvent.click(screen.getByRole('button',{name:'Service library'}));fireEvent.click(screen.getByRole('button',{name:'Architecture builder'}));expect(saved().nodes).toHaveLength(1);expect(saved().nodes[0].id).toBe(id);
});
it('keeps practice selection shareable and restores it from history',async()=>{
 history.replaceState({},'','/?view=practice&exam=DVA-C03&chapter=dev-lambda');render(<App/>);fireEvent.change(screen.getByLabelText('Practice chapter'),{target:{value:'dev-application'}});expect(new URL(location.href).searchParams.get('chapter')).toBe('dev-application');history.back();await waitFor(()=>expect((screen.getByLabelText('Practice chapter') as HTMLSelectElement).value).toBe('dev-lambda'));history.forward();await waitFor(()=>expect((screen.getByLabelText('Practice chapter') as HTMLSelectElement).value).toBe('dev-application'));
});
