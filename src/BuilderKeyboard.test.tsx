// @vitest-environment jsdom
import React,{useState} from 'react';
import {it,expect,vi,beforeEach,afterEach} from 'vitest';
import {render,screen,fireEvent,cleanup,waitFor,act} from '@testing-library/react';
import type {Graph} from './architectureReview';
vi.mock('./ArchitectureStudio',()=>({default:({Canvas,...props}:any)=><Canvas {...props}/>}));
const flow=vi.hoisted(()=>({current:null as any}));
vi.mock('@xyflow/react',()=>({ReactFlowProvider:({children}:any)=>children,ReactFlow:(props:any)=>{flow.current=props;const {nodes,edges,onNodeClick,onEdgeClick,children}=props;return <div>{nodes.map((n:any)=><button key={n.id} onClick={()=>onNodeClick({},n)}>{n.type==='networkFrame'?n.data.label:n.id}</button>)}{edges?.map((e:any)=><button key={e.id} onClick={()=>onEdgeClick({},e)}>edge-{e.id}</button>)}{children}</div>},useViewport:()=>({zoom:1,x:0,y:0}),useReactFlow:()=>({fitView:()=>Promise.resolve(),screenToFlowPosition:(p:any)=>p,getZoom:()=>1}),NodeResizer:()=>null,Background:()=>null,Controls:()=>null,MarkerType:{ArrowClosed:'arrowclosed'},Position:{Right:'right',Left:'left'}}));
import Builder from './Builder';
beforeEach(()=>vi.stubGlobal('matchMedia',()=>({matches:false,addEventListener:()=>{},removeEventListener:()=>{}})));
afterEach(()=>{cleanup();localStorage.clear();vi.unstubAllGlobals()});
it('selects a wire without opening a panel and keeps explicit configuration panels exclusive and resizable',async()=>{render(<Builder value={{version:1,nodes:[{id:'fn',service:'lambda',label:'Worker',position:{x:0,y:0}},{id:'queue',service:'sqs',label:'Jobs',position:{x:400,y:0}}],edges:[{id:'call',source:'fn',target:'queue'}],configs:{}}} onChange={()=>{}}/>);fireEvent.click(screen.getByRole('button',{name:'fn'}));expect(screen.getAllByRole('separator',{name:'Resize configuration panel'})).toHaveLength(1);fireEvent.click(screen.getByRole('button',{name:'edge-call'}));expect(screen.queryByRole('separator',{name:'Resize configuration panel'})).toBeNull();expect(document.querySelector('.builder-selection-bar')).toBeNull();fireEvent.click(screen.getByRole('button',{name:'Configuration'}));expect(screen.getByLabelText('Connection configuration')).toBeDefined();const grip=screen.getByRole('separator',{name:'Resize configuration panel'});fireEvent.keyDown(grip,{key:'ArrowRight'});expect(grip.getAttribute('aria-valuenow')).toBe('300');await waitFor(()=>expect(localStorage.getItem('aws-playground-config-panel-width-v1')).toBe('300'));fireEvent.click(screen.getByRole('button',{name:'fn'}));expect(screen.queryByLabelText('Connection configuration')).toBeNull();expect(screen.getAllByRole('separator',{name:'Resize configuration panel'})).toHaveLength(1)});
it('requests native fullscreen and retains the focused canvas fallback when the host declines it',async()=>{const old=Object.getOwnPropertyDescriptor(HTMLElement.prototype,'requestFullscreen'),request=vi.fn().mockRejectedValue(new Error('Host declined'));Object.defineProperty(HTMLElement.prototype,'requestFullscreen',{configurable:true,value:request});try{render(<Builder value={{version:1,nodes:[],edges:[],configs:{}}} onChange={()=>{}}/>);fireEvent.click(screen.getByRole('button',{name:'Full screen'}));await waitFor(()=>expect(request).toHaveBeenCalledWith({navigationUI:'hide'}));expect(screen.getByRole('button',{name:'Exit full screen'}).closest('.builder-page')?.classList.contains('is-focused')).toBe(true);fireEvent.keyDown(window,{key:'Escape'});expect(screen.getByRole('button',{name:'Full screen'})).toBeDefined()}finally{if(old)Object.defineProperty(HTMLElement.prototype,'requestFullscreen',old);else delete (HTMLElement.prototype as any).requestFullscreen}});
it.each(['Backspace','Delete'])('removes the selected frame with %s while retaining its services and nested frames',key=>{let latest:Graph;function Harness(){const [g,set]=useState<Graph>({version:1,nodes:[{id:'app',service:'ec2',label:'App',position:{x:80,y:100}}],edges:[],configs:{},network:{version:1,frames:[{id:'vpc',kind:'vpc',name:'Outer frame',x:0,y:0,width:700,height:500},{id:'subnet',kind:'subnet',name:'Inner frame',x:30,y:60,width:300,height:250,parentId:'vpc'}],membership:{app:'subnet'},resources:[]}});latest=g;return <Builder value={g} onChange={set}/>;}render(<Harness/>);fireEvent.click(screen.getByRole('button',{name:'Outer frame'}));const canvas=screen.getByLabelText(/Editable architecture canvas/);expect(document.activeElement).toBe(canvas);fireEvent.keyDown(screen.getByLabelText('Name'),{key});expect(latest!.network!.frames).toHaveLength(2);fireEvent.keyDown(canvas,{key});expect(latest!.network!.frames.map(f=>f.id)).toEqual(['subnet']);expect(latest!.network!.frames[0].parentId).toBeUndefined();expect(latest!.nodes[0].position).toEqual({x:80,y:100});expect(latest!.network!.membership.app).toBe('subnet')});

it('keeps catalog control targets unique across original and draft canvases',()=>{
 const graph:Graph={version:1,nodes:[],edges:[],configs:{}};
 const {container}=render(<><Builder value={graph} onChange={()=>{}}/><Builder value={graph} title="Draft" onChange={()=>{}}/></>);
 const controls=Array.from(container.querySelectorAll<HTMLButtonElement>('.builder-canvas-toolbar button[aria-controls]'));
 expect(controls).toHaveLength(2);const targets=controls.map(control=>control.getAttribute('aria-controls')!);
 expect(new Set(targets).size).toBe(2);for(const target of targets)expect(container.querySelectorAll('[id="'+target+'"]').length).toBe(1);const ids=Array.from(container.querySelectorAll('[id]')).map(el=>el.id);expect(new Set(ids).size).toBe(ids.length);for(const control of container.querySelectorAll('[aria-controls]'))expect(container.querySelectorAll('[id="'+control.getAttribute('aria-controls')+'"]').length).toBe(1);
});

it('preserves a frame drag when saving an already-open Lambda configuration draft',()=>{
 let latest:Graph;
 function Harness(){const [g,setG]=useState<Graph>({version:1,nodes:[{id:'fn',service:'lambda',label:'Worker',position:{x:900,y:20}}],edges:[],configs:{},network:{version:1,frames:[{id:'frame',kind:'region',name:'Frame',x:0,y:0,width:700,height:500}],membership:{},resources:[]}});latest=g;return <Builder value={g} onChange={setG}/>}
 render(<Harness/>);fireEvent.click(screen.getByRole('button',{name:'fn'}));fireEvent.change(screen.getByLabelText(/^Timeout/,{selector:'input'}),{target:{value:'12'}});
 act(()=>flow.current.onNodesChange([{id:'frame',type:'position',position:{x:150,y:75}}]));expect(latest!.network!.frames[0]).toMatchObject({x:150,y:75});
 fireEvent.click(screen.getByRole('button',{name:'Save configuration'}));expect(latest!.network!.frames[0]).toMatchObject({x:150,y:75});expect((latest!.architecture!.nodes.fn.values as any).timeoutSeconds).toBe(12);
});
it('changes only the selected service icon and restores the default size',()=>{
 const changed=vi.fn();
 function Harness(){
  const [graph,setGraph]=useState<Graph>({
   version:1,
   nodes:[
    {id:'fn',service:'lambda',label:'Worker',position:{x:0,y:0}},
    {id:'queue',service:'sqs',label:'Jobs',position:{x:400,y:0}},
   ],
   edges:[{id:'call',source:'fn',target:'queue'}],
   configs:{},
  });
  return <Builder value={graph} onChange={next=>{setGraph(next);changed(next)}}/>;
 }
 render(<Harness/>);
 fireEvent.click(screen.getByRole('button',{name:'fn'}));
 const size=screen.getByLabelText('Icon size') as HTMLSelectElement;
 expect(size.value).toBe('48');
 fireEvent.change(size,{target:{value:'80'}});
 expect(size.value).toBe('80');
 expect(changed.mock.lastCall?.[0].nodes.map((node: Graph['nodes'][number])=>node.iconSize)).toEqual([80,undefined]);
 expect(changed.mock.lastCall?.[0].edges).toEqual([{id:'call',source:'fn',target:'queue'}]);
 fireEvent.change(size,{target:{value:'48'}});
 expect(size.value).toBe('48');
 expect(changed.mock.lastCall?.[0].nodes[0].iconSize).toBeUndefined();
});

it('snaps a dragged service onto its folding wire and merges the segments on release',()=>{
 let latest:Graph;
 function Harness(){const [g,setG]=useState<Graph>({version:1,nodes:[{id:'fn',service:'lambda',label:'Worker',position:{x:0,y:0}},{id:'queue',service:'sqs',label:'Jobs',position:{x:300,y:0}}],edges:[{id:'call',source:'fn',target:'queue'}],configs:{},edgeLayouts:{call:{style:'orthogonal',waypoints:[{x:24,y:50},{x:24,y:150},{x:276,y:150},{x:276,y:50}]}}});latest=g;return <Builder value={g} onChange={setG}/>}
 render(<Harness/>);
 act(()=>flow.current.onNodeDragStart({},{id:'fn'},[]));
 act(()=>flow.current.onNodesChange([{id:'fn',type:'position',position:{x:0,y:130},dragging:true}]));
 expect(latest!.edgeLayouts!.call.waypoints).toEqual([{x:24,y:180},{x:24,y:150},{x:276,y:150},{x:276,y:50}]);
 act(()=>flow.current.onNodesChange([{id:'fn',type:'position',position:{x:0,y:97},dragging:false}]));
 expect(latest!.nodes[0].position).toEqual({x:0,y:100});
 act(()=>flow.current.onNodeDragStop({},{id:'fn'},[]));
 expect(latest!.edgeLayouts!.call.waypoints).toEqual([{x:24,y:150},{x:276,y:150},{x:276,y:50}]);
});

it('gives frame nodes their stored size so resizing starts from the frame instead of collapsing it',()=>{
 render(<Builder value={{version:1,nodes:[],edges:[],configs:{},network:{version:1,frames:[{id:'vpc',kind:'vpc',name:'Main VPC',x:0,y:0,width:910,height:640}],membership:{},resources:[]}}} onChange={()=>{}}/>);
 const frame=flow.current.nodes.find((n:any)=>n.id==='vpc');expect(frame.measured).toEqual({width:910,height:640});
});
it('asks to discard unsaved settings inside the workspace instead of a native dialog that leaves full screen',()=>{
 const native=vi.fn(()=>true);vi.stubGlobal('confirm',native);
 render(<Builder value={{version:1,nodes:[{id:'fn',service:'lambda',label:'Worker',position:{x:0,y:0}}],edges:[],configs:{}}} onChange={()=>{}}/>);
 fireEvent.click(screen.getByRole('button',{name:'fn'}));fireEvent.change(screen.getByLabelText(/^Timeout/,{selector:'input'}),{target:{value:'12'}});
 fireEvent.click(screen.getByRole('button',{name:'Close settings'}));
 const dialog=screen.getByRole('alertdialog');expect(dialog.textContent).toContain('Discard unsaved configuration edits');expect(document.activeElement?.textContent).toBe('Keep editing');
 // Escape cancels the prompt and is marked handled, so focus mode does not also exit.
 expect(fireEvent.keyDown(dialog,{key:'Escape'})).toBe(false);
 expect(screen.queryByRole('alertdialog')).toBeNull();expect(screen.getByLabelText(/^Timeout/,{selector:'input'})).toBeDefined();
 fireEvent.click(screen.getByRole('button',{name:'Close settings'}));fireEvent.click(screen.getByRole('button',{name:'Discard changes'}));
 expect(screen.queryByRole('alertdialog')).toBeNull();expect(screen.queryByLabelText(/^Timeout/,{selector:'input'})).toBeNull();expect(native).not.toHaveBeenCalled();
});
it('links a subnet dropped into a VPC and gives an empty subnet a CIDR from the VPC range',()=>{
 let latest:Graph;
 function Harness(){const [g,setG]=useState<Graph>({version:1,nodes:[],edges:[],configs:{},network:{version:1,frames:[{id:'vpc',kind:'vpc',name:'Main VPC',x:0,y:0,width:900,height:600,cidr:'10.0.0.0/16'},{id:'used',kind:'subnet',name:'Existing',x:40,y:60,width:300,height:200,cidr:'10.0.0.0/24',parentId:'vpc'},{id:'subnet',kind:'subnet',name:'App subnet',x:1200,y:0,width:300,height:200}],membership:{},resources:[]}});latest=g;return <Builder value={g} onChange={setG}/>}
 render(<Harness/>);
 act(()=>flow.current.onNodeDragStart({},{id:'subnet'},[]));act(()=>flow.current.onNodesChange([{id:'subnet',type:'position',position:{x:420,y:80},dragging:true}]));act(()=>flow.current.onNodeDragStop({},{id:'subnet'},[]));
 const subnet=latest!.network!.frames.find(f=>f.id==='subnet')!;expect(subnet.parentId).toBe('vpc');expect(subnet.cidr).toBe('10.0.1.0/24');
 expect(flow.current.nodes.find((n:any)=>n.id==='subnet').data.vpc).toBe('Main VPC');
});
