// @vitest-environment jsdom
import React from 'react';
import {act,cleanup,configure,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,beforeEach,expect,it,vi} from 'vitest';

const download=vi.hoisted(()=>{
 let release!:()=>void,loaded!:()=>void;
 return {pending:new Promise<void>(resolve=>{release=resolve}),imported:new Promise<void>(resolve=>{loaded=resolve}),release:()=>release(),loaded:()=>loaded()};
});
// Delay the actual import, not an eager test-only substitute for the lazy route.
vi.mock('./BuilderRoute',async()=>{
 await download.pending;
 const module=await vi.importActual<typeof import('./BuilderRoute')>('./BuilderRoute');
 download.loaded();
 return module;
});
vi.mock('@xyflow/react',()=>({ReactFlowProvider:({children}:any)=>children,ReactFlow:({nodes,children}:any)=><div>{nodes.map((node:any)=><span key={node.id}>{node.id}</span>)}{children}</div>,useViewport:()=>({zoom:1,x:0,y:0}),useReactFlow:()=>({fitView:()=>Promise.resolve(),screenToFlowPosition:(point:any)=>point}),NodeResizer:()=>null,Background:()=>null,Controls:()=>null,MarkerType:{ArrowClosed:'arrowclosed'},Position:{Right:'right',Left:'left'}}));
import {App} from './main';

configure({asyncUtilTimeout:10000});
beforeEach(()=>{
 localStorage.clear();history.replaceState({},'','/?view=home&exam=DVA-C03');
 vi.stubGlobal('matchMedia',()=>({matches:false,addEventListener:()=>{},removeEventListener:()=>{}}));
 vi.stubGlobal('scrollTo',vi.fn());vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new Error('offline fixture')));vi.stubGlobal('confirm',vi.fn(()=>false));
 Element.prototype.scrollIntoView=vi.fn();
 localStorage.setItem('aws-playground-workspace-v3',JSON.stringify({version:3,original:{version:1,nodes:[{id:'saved-sentinel',service:'ec2',label:'My saved node',position:{x:0,y:0}}],edges:[],configs:{}},draft:null,draftBase:null,purpose:'',priority:'balanced',protectedNodeIds:[],review:null,proposal:null}));
});
afterEach(()=>{download.release();cleanup();vi.unstubAllGlobals()});

it('cancels both example and add-service requests when leaving Builder before its module mounts',async()=>{
 render(<App/>);
 fireEvent.click(screen.getByRole('button',{name:/01 Serverless request/}));
 expect(screen.getByText('Loading this page…')).toBeDefined();
 fireEvent.click(screen.getByRole('button',{name:'Service library'}));
 fireEvent.change(await screen.findByLabelText('Search service references'),{target:{value:'Lambda'}});
 fireEvent.click(screen.getByRole('button',{name:/AWS Lambda/}));
 fireEvent.click(screen.getByRole('button',{name:'Add or select in architecture'}));
 expect(screen.getByText('Loading this page…')).toBeDefined();
 history.back();
 await screen.findByRole('heading',{level:1,name:'AWS Lambda'});
 await act(async()=>{download.release();await download.imported;});
 fireEvent.click(screen.getByRole('button',{name:'Architecture builder'}));
 await screen.findByRole('button',{name:'Add AWS Lambda'});
 const workspace=JSON.parse(localStorage.getItem('aws-playground-workspace-v3')!);
 expect(workspace.original.nodes.map((node:{id:string})=>node.id)).toEqual(['saved-sentinel']);
 expect(screen.getByText('saved-sentinel')).toBeDefined();
 expect(window.confirm).not.toHaveBeenCalled();
},20000);
