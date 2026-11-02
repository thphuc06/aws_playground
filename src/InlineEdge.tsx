import {curveControls,cubicPoint,moveCurveGrip,cubicPath} from './edgeGeometry';
import {wireControls,wireControlAt,moveWireControl,removeWireControl,closestPointOnWire,type WireControl} from './orthogonalEditing';
import {anchorRoute} from './connectionInteraction';
import {manualRoute,routePath,MAX_EDGE_BENDS,type Point} from './connectionRouting';
import {useEffect,useRef,useState} from 'react';
import {BaseEdge,EdgeLabelRenderer,useReactFlow,useViewport,useStore,EdgeProps,Edge} from '@xyflow/react';
export type InlineEdgeData={text:string;editing:boolean;onSelect?:(id:string)=>boolean;onReconnect?:(id:string,end:'source'|'target',point:Point)=>void;onPickEndpoint?:(id:string,end:'source'|'target')=>void;showLabel?:boolean;hideLabel?:boolean;muted?:boolean;lane?:number;route?:Point[];waypoints?:Point[];curve?:boolean;curvature?:number;curveOffsets?:Point[];onCurve?:(id:string,offsets:Point[]|undefined)=>void;onBends?:(id:string,points:Point[])=>void;onStyle?:(id:string,curve:boolean)=>void;onDelete?:(id:string)=>void;onEdit:(id:string)=>void;onChange:(id:string,value:string)=>void;onCommit:(id:string,restoreFocus?:boolean)=>void;onCancel:(id:string)=>void};

type Grip={key:number;point:Point;control?:WireControl;curveIndex?:number};
type Gesture={grip:Grip;route:Point[];controls:[Point,Point];mode:'pointer'|'keyboard';pointerId?:number;offset?:Point};
type EndpointGesture={end:'source'|'target';pointerId:number;start:Point;moved:boolean};
export default function InlineEdge(props:EdgeProps<Edge<InlineEdgeData>>){
 const data=props.data!,source={x:props.sourceX,y:props.sourceY},target={x:props.targetX,y:props.targetY};
 const [hovered,setHovered]=useState(false),[activeGrip,setActiveGrip]=useState<Grip|null>(null);
 const [endpointPreview,setEndpointPreview]=useState<{end:'source'|'target';point:Point}|null>(null);
 const endpointGesture=useRef<EndpointGesture|null>(null),suppressEndpointClick=useRef(false);
 const gesture=useRef<Gesture|null>(null),input=useRef<HTMLInputElement>(null);
 const viewport=useViewport(),{screenToFlowPosition}=useReactFlow(),width=useStore(s=>s.width),height=useStore(s=>s.height);
 const controls=curveControls(source,target,data.curvature,data.curveOffsets);
 const route=data.waypoints?.length?manualRoute(source,target,data.waypoints):anchorRoute(source,target,data.route);
 const {path,labelX,labelY}=data.curve?cubicPath(source,target,controls):routePath(route);
 const grips:Grip[]=data.curve?[1/3,2/3].map((t,i)=>({key:i,point:cubicPoint(source,target,controls,t),curveIndex:i})):wireControls(route).map((control,i)=>({key:i,point:control.point,control}));
 // Preserve the captured DOM handle while topology changes. Rebuild every corner after release.
 const visible=activeGrip?[activeGrip]:grips;
 const finish=()=>{gesture.current=null;setActiveGrip(null)};
 const finishEndpoint=()=>{endpointGesture.current=null;setEndpointPreview(null)};
 const begin=(grip:Grip,mode:'pointer'|'keyboard',pointerId?:number)=>{let selected=grip;
  if(gesture.current&&grip.control){const same=wireControls(route).filter(c=>c.kind===grip.control!.kind);const nearest=same.sort((a,b)=>{const distance=(c:WireControl)=>{const q=c.kind==='segment'?closestPointOnWire(route.slice(c.index,c.index+2),grip.point):c.point;return (q.x-grip.point.x)**2+(q.y-grip.point.y)**2};return distance(a)-distance(b)})[0];if(nearest)selected={...grip,control:nearest};}
  gesture.current={grip:selected,route:route.map(p=>({...p})),controls,mode,pointerId};setActiveGrip(selected);
 };
 const move=(point:Point,independent=false)=>{const g=gesture.current;if(!g)return;
  if(data.curve){const offsets=moveCurveGrip(source,target,g.controls,g.grip.curveIndex!,point);data.onCurve?.(props.id,offsets);const cp=curveControls(source,target,data.curvature,offsets);setActiveGrip({...g.grip,point:cubicPoint(source,target,cp,(g.grip.curveIndex!+1)/3)});}
  else if(g.grip.control){const moved=moveWireControl(g.route,g.grip.control,point,independent),waypoints=moved.slice(1,-1);if(waypoints.length>MAX_EDGE_BENDS)return;data.onBends?.(props.id,waypoints);const c=g.grip.control,a=g.route[c.index],b=g.route[c.index+1],preferred=c.kind==='segment'?(a.y===b.y?{x:g.grip.point.x,y:point.y}:{x:point.x,y:g.grip.point.y}):point;setActiveGrip({...g.grip,point:closestPointOnWire(moved,preferred)});}
 };
 useEffect(()=>{if(data.editing){input.current?.focus({preventScroll:true});input.current?.select()}},[data.editing]);
 useEffect(()=>{if(!props.selected){finish();finishEndpoint()}},[props.selected]);
 useEffect(()=>{const stop=()=>{suppressEndpointClick.current=true;finish();finishEndpoint()};const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'&&(gesture.current||endpointGesture.current)){event.preventDefault();event.stopPropagation();stop()}};window.addEventListener('blur',stop);document.addEventListener('keydown',escape,true);return()=>{window.removeEventListener('blur',stop);document.removeEventListener('keydown',escape,true)}},[]);
 const screenX=labelX*viewport.zoom+viewport.x,screenY=labelY*viewport.zoom+viewport.y,editorWidth=Math.min(220,Math.max(150,width-24));
 const anchorX=data.editing?(Math.max(editorWidth/2+8,Math.min(width-editorWidth/2-8,screenX))-viewport.x)/viewport.zoom:labelX;
 const anchorY=data.editing?(Math.max(36,Math.min(height-42,screenY))-viewport.y)/viewport.zoom:labelY-24/viewport.zoom;
 const renderedPath=endpointPreview?`M ${endpointPreview.end==='source'?endpointPreview.point.x:source.x} ${endpointPreview.end==='source'?endpointPreview.point.y:source.y} L ${endpointPreview.end==='target'?endpointPreview.point.x:target.x} ${endpointPreview.end==='target'?endpointPreview.point.y:target.y}`:path;
 return <>
 {props.selected&&!endpointPreview&&<EdgeLabelRenderer>{visible.map(grip=><button key={grip.key}
  className={'edge-bend-handle nodrag nopan '+(data.curve?'curve-grip':grip.control?.kind==='segment'?'edge-segment-grip':'')}
  data-handle-kind={data.curve?'curve':grip.control?.kind}
  data-active={activeGrip?.key===grip.key?true:undefined}
  aria-label={(data.curve?'Shape curve ':'Move bend ')+(grip.key+1)}
  title={data.curve?'Drag to shape curve':grip.control?.kind==='segment'?'Drag this segment to create right-angle corners':'Drag corner; Alt moves only this corner; Delete removes'}
  style={{cursor:grip.control?.kind==='segment'?((gesture.current?.route??route)[grip.control.index]?.y===(gesture.current?.route??route)[grip.control.index+1]?.y?'ns-resize':'ew-resize'):'move',transform:`translate(${grip.point.x}px,${grip.point.y}px) scale(${1/viewport.zoom}) translate(-50%,-50%)`}}
  onPointerDown={e=>{e.preventDefault();e.stopPropagation();begin(grip,'pointer',e.pointerId);e.currentTarget.setPointerCapture(e.pointerId)}}
  onPointerMove={e=>{if(gesture.current?.mode==='pointer'&&gesture.current.pointerId===e.pointerId){e.stopPropagation();move(screenToFlowPosition({x:e.clientX,y:e.clientY}),e.altKey)}}}
  onPointerUp={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);finish()}}
  onPointerCancel={finish} onLostPointerCapture={()=>{if(gesture.current?.mode==='pointer')finish()}}
  onBlur={()=>{if(gesture.current?.mode==='keyboard')finish()}} onClick={e=>e.stopPropagation()}
  onKeyDown={e=>{const delta:Record<string,Point>={ArrowLeft:{x:-10,y:0},ArrowRight:{x:10,y:0},ArrowUp:{x:0,y:-10},ArrowDown:{x:0,y:10}};
   if(e.key==='Escape'){e.preventDefault();e.stopPropagation();finish();return;}
   if(['Delete','Backspace'].includes(e.key)){e.preventDefault();e.stopPropagation();finish();if(data.curve)data.onCurve?.(props.id,undefined);else if(grip.control)data.onBends?.(props.id,removeWireControl(route,grip.control).slice(1,-1));return;}
   if(delta[e.key]){e.preventDefault();e.stopPropagation();if(!gesture.current)begin(grip,'keyboard');const base=activeGrip?.point??grip.point;move({x:base.x+delta[e.key].x,y:base.y+delta[e.key].y},e.altKey);}
  }}/>)}</EdgeLabelRenderer>}
 {props.selected&&!data.editing&&data.onReconnect&&<EdgeLabelRenderer>{(['source','target'] as const).map(end=>{const point=end==='source'?source:target;return <button key={end} className="edge-endpoint-grip nodrag nopan" aria-label={'Reconnect '+end} title={'Drag to another service, or click then select a service'} data-dragging={endpointPreview?.end===end?true:undefined} style={{transform:`translate(${point.x}px,${point.y}px) scale(${1/viewport.zoom}) translate(-50%,-50%)`}}
  onPointerDown={event=>{if(event.button!==0)return;event.preventDefault();event.stopPropagation();if(data.onSelect?.(props.id)===false){suppressEndpointClick.current=true;return;}finish();suppressEndpointClick.current=false;endpointGesture.current={end,pointerId:event.pointerId,start:{x:event.clientX,y:event.clientY},moved:false};setEndpointPreview({end,point});event.currentTarget.setPointerCapture(event.pointerId)}}
  onPointerMove={event=>{const g=endpointGesture.current;if(!g||g.pointerId!==event.pointerId)return;event.stopPropagation();if(Math.hypot(event.clientX-g.start.x,event.clientY-g.start.y)>3)g.moved=true;setEndpointPreview({end:g.end,point:screenToFlowPosition({x:event.clientX,y:event.clientY})})}}
  onPointerUp={event=>{const g=endpointGesture.current;if(!g||g.pointerId!==event.pointerId)return;event.stopPropagation();suppressEndpointClick.current=g.moved;finishEndpoint();if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);if(g.moved)data.onReconnect?.(props.id,g.end,{x:event.clientX,y:event.clientY})}}
  onPointerCancel={()=>{suppressEndpointClick.current=true;finishEndpoint()}} onLostPointerCapture={finishEndpoint}
  onClick={event=>{event.stopPropagation();if(!suppressEndpointClick.current)data.onPickEndpoint?.(props.id,end);suppressEndpointClick.current=false}}
 >{end==='target'?'›':'○'}</button>})}</EdgeLabelRenderer>}
 {props.selected&&!data.editing&&!endpointPreview&&(!activeGrip||gesture.current?.mode==='keyboard')&&<EdgeLabelRenderer><div className="edge-inline-tools nodrag nopan" style={{transform:`translate(${labelX}px,${labelY-40/viewport.zoom}px) scale(${1/viewport.zoom}) translate(-50%,-100%)`}} onPointerDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()}>
 <button aria-label="Use orthogonal line" title="Orthogonal" aria-pressed={!data.curve} onClick={()=>{finish();data.onStyle?.(props.id,false)}}>⌜</button>
 <button aria-label="Use curved line" title="Curved" aria-pressed={!!data.curve} onClick={()=>{finish();data.onStyle?.(props.id,true)}}>∿</button>
 <button aria-label="Reset connection route" title="Automatic route" onClick={()=>{finish();data.onBends?.(props.id,[]);if(data.curve)data.onCurve?.(props.id,undefined)}}>↶</button>
 <button aria-label="Delete connection" title="Delete connection" onClick={()=>data.onDelete?.(props.id)}>×</button>
 </div></EdgeLabelRenderer>}
 <g className="wire-shape-hit" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
  onPointerDown={event=>{if(event.button!==0||data.editing)return;const point=screenToFlowPosition({x:event.clientX,y:event.clientY});if(Math.min(Math.hypot(point.x-source.x,point.y-source.y),Math.hypot(point.x-target.x,point.y-target.y))*viewport.zoom<20)return;if(data.onSelect?.(props.id)===false)return;
   let grip:Grip|undefined;if(data.curve)grip=[...grips].sort((a,b)=>Math.hypot(a.point.x-point.x,a.point.y-point.y)-Math.hypot(b.point.x-point.x,b.point.y-point.y))[0];else {const control=wireControlAt(route,point,8/viewport.zoom);if(control)grip={key:control.kind==='corner'?control.index-1:route.length+control.index,control,point:control.point};}if(!grip)return;
   event.preventDefault();event.stopPropagation();begin(grip,'pointer',event.pointerId);if(gesture.current)gesture.current.offset={x:grip.point.x-point.x,y:grip.point.y-point.y};event.currentTarget.setPointerCapture(event.pointerId);
  }}
  onPointerMove={event=>{const g=gesture.current;if(g?.mode!=='pointer'||g.pointerId!==event.pointerId)return;event.stopPropagation();const point=screenToFlowPosition({x:event.clientX,y:event.clientY});move({x:point.x+(g.offset?.x??0),y:point.y+(g.offset?.y??0)},event.altKey)}}
  onPointerUp={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);finish()}}
  onPointerCancel={finish} onLostPointerCapture={()=>{if(gesture.current?.mode==='pointer')finish()}}
 ><BaseEdge id={props.id} path={renderedPath} markerEnd={props.markerEnd} markerStart={props.markerStart} style={endpointPreview?{...props.style,strokeDasharray:'5 4'}:props.style} interactionWidth={Math.min(80,18/viewport.zoom)}/></g>
 {(data.editing||(!activeGrip&&!endpointPreview&&!data.hideLabel&&(props.selected||hovered||data.showLabel&&!data.muted)&&!!data.text.trim()))&&<EdgeLabelRenderer><div className={'inline-edge-label nodrag nopan '+(data.editing?'editing':'')} style={{transform:`translate(${anchorX}px,${anchorY}px) scale(${1/viewport.zoom}) translate(-50%, -50%)`,width:data.editing?editorWidth:undefined}} onPointerDown={event=>event.stopPropagation()} onClick={event=>event.stopPropagation()} onDoubleClick={event=>event.stopPropagation()} onWheel={event=>event.stopPropagation()}>{data.editing?<><input ref={input} aria-label="Edit connection label" maxLength={60} value={data.text} placeholder="Name this relationship…" onChange={event=>data.onChange(props.id,event.target.value)} onBlur={()=>data.onCommit(props.id)} onKeyDown={event=>{event.stopPropagation();if(event.key==='Enter'){event.preventDefault();data.onCommit(props.id,true)}else if(event.key==='Escape'){event.preventDefault();data.onCancel(props.id)}}}/><small>Enter to save · Esc to cancel · {data.text.length}/60</small></>:<button className="inline-edge-label-button" aria-label={`Edit label for connection ${props.source} to ${props.target}${data.text?`: ${data.text}`:''}`} title={data.text||"Click to edit this connection label"} onClick={()=>data.onEdit(props.id)}>{data.text.trim()||'Add label'}</button>}</div></EdgeLabelRenderer>}</>;
}
