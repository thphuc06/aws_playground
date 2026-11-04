import {manualRoute,simplifyRoute,type Point} from './connectionRouting';
import type {BuilderEdge} from './builderRules';
import type {Graph} from './architectureReview';
import {moveOrthogonalBend} from './edgeGeometry';
import {normalizeEditedWire} from './orthogonalEditing';
export function anchorRoute(source:Point,target:Point,route?:Point[]):Point[]{
 if(!route?.length)return manualRoute(source,target,[]);
 const a=route[0],b=route.at(-1)!;
 if(a.x===source.x&&a.y===source.y&&b.x===target.x&&b.y===target.y)return route;
 if(route.length<4)return manualRoute(source,target,[]);
 // Node borders/handle measurements can differ by fractions of a pixel from
 // routing bounds. Adjust the end segments instead of inserting tiny U-turns.
 const points=route.map(p=>({...p}));points[0]=source;points[points.length-1]=target;
 if(route[1].y===a.y)points[1].y=source.y;else points[1].x=source.x;
 if(route.at(-2)!.y===b.y)points[points.length-2].y=target.y;else points[points.length-2].x=target.x;
 return points.slice(1).every((p,i)=>p.x===points[i].x||p.y===points[i].y)?simplifyRoute(points):manualRoute(source,target,points.slice(1,-1));
}
export function connectionCandidate(source:string,target:string,edges:readonly BuilderEdge[],replacingId?:string):boolean {
 return !!source&&!!target&&source!==target&&!edges.some(e=>e.id!==replacingId&&e.source===source&&e.target===target);
}
export function reconnectCandidate(edge:Pick<BuilderEdge,'source'|'target'>,fixedHandle:'source'|'target',nodeId:string){return fixedHandle==='source'?{source:edge.source,target:nodeId}:{source:nodeId,target:edge.target};}
export function droppedService(event:MouseEvent|TouchEvent,root:HTMLElement|null,nodeIds:readonly string[]):string|undefined {
 if(!root||event.type.endsWith('cancel'))return;
 const point='changedTouches'in event?event.changedTouches[0]:event;if(!point)return;
 return serviceAtPoint(point,root,nodeIds);
}
export function serviceAtPoint(point:{clientX:number;clientY:number},root:HTMLElement|null,nodeIds:readonly string[]):string|undefined {
 if(!root)return;
 const elements=root.ownerDocument.elementsFromPoint(point.clientX,point.clientY);
 if(elements[0]&&!root.contains(elements[0]))return;
 for(const element of elements){const node=element.closest<HTMLElement>('.react-flow__node');const id=node?.dataset.id;if(node&&root.contains(node)&&id&&nodeIds.includes(id))return id;}
}
type Delta={x:number;y:number};
const nodeDelta=(before:Graph,after:Graph,id:string):Delta=>{const a=before.nodes.find(n=>n.id===id),b=after.nodes.find(n=>n.id===id);return {x:(b?.position.x??0)-(a?.position.x??0),y:(b?.position.y??0)-(a?.position.y??0)}};
function followEdge(points:Point[],source:Delta,target:Delta):Point[]{
 if(source.x===target.x&&source.y===target.y)return points.map(p=>({x:p.x+source.x,y:p.y+source.y}));
 let next=points;if(source.x||source.y)next=moveOrthogonalBend(next,0,{x:next[0].x+source.x,y:next[0].y+source.y});
 if(target.x||target.y){const last=next.length-1;next=moveOrthogonalBend(next,last,{x:next[last].x+target.x,y:next[last].y+target.y});}
 return next;
}
/** Move terminal legs with their services while retaining deliberately shaped inner bends. */
export function followMovedEndpoints(before:Graph,after:Graph):Graph {
 let layouts=after.edgeLayouts,changed=false;
 for(const edge of after.edges){const layout=layouts?.[edge.id],old=before.edgeLayouts?.[edge.id],points=old?.waypoints;if(!layout||layout.style==='curved'||!points?.length||points.length<2)continue;
  // Frame movement may already have translated the complete manual wire.
  if(JSON.stringify(layout.waypoints)!==JSON.stringify(points))continue;
  const source=nodeDelta(before,after,edge.source),target=nodeDelta(before,after,edge.target);if(!source.x&&!source.y&&!target.x&&!target.y)continue;
  layouts={...layouts,[edge.id]:{...layout,waypoints:followEdge(points,source,target)}};changed=true;
 }
 return changed?{...after,edgeLayouts:layouts}:after;
}
/**
 * Pointer drags re-derive manual wires from the drag-start shape, so passing a
 * service across another segment never permanently captures that segment.
 */
export function followDraggedEndpoints(start:Graph,after:Graph):Graph {
 let layouts=after.edgeLayouts,changed=false;
 for(const edge of after.edges){const layout=layouts?.[edge.id],points=start.edgeLayouts?.[edge.id]?.waypoints;if(!layout||layout.style==='curved'||!points?.length||points.length<2)continue;
  const next=followEdge(points,nodeDelta(start,after,edge.source),nodeDelta(start,after,edge.target));
  if(JSON.stringify(next)!==JSON.stringify(layout.waypoints)){layouts={...layouts,[edge.id]:{...layout,waypoints:next}};changed=true;}
 }
 return changed?{...after,edgeLayouts:layouts}:after;
}
const EPSILON=1e-6;
/**
 * While one service is dragged, pull it onto the offset that makes the short
 * jog beside its manual wire vanish (screen-pixel threshold, like segment snapping).
 */
export function snapNodeToWires(start:Graph,id:string,position:Point,zoom=1,threshold=8):{position:Point;snapped:boolean}{
 const node=start.nodes.find(n=>n.id===id);if(!node)return {position,snapped:false};
 const scale=Number.isFinite(zoom)&&zoom>0?zoom:1,delta={x:position.x-node.position.x,y:position.y-node.position.y},best:Partial<Delta>={};
 for(const edge of start.edges){
  if(edge.source===edge.target||edge.source!==id&&edge.target!==id)continue;
  const layout=start.edgeLayouts?.[edge.id],points=layout?.waypoints;if(!layout||layout.style==='curved'||!points||points.length<2)continue;
  const index=edge.source===id?0:points.length-1,step=edge.source===id?1:-1,p=points[index];
  for(const axis of ['x','y'] as const){
   // The run sharing this coordinate moves with the service; the first point off that run closes the jog.
   let i=index;while(points[i+step]&&Math.abs(points[i+step][axis]-p[axis])<EPSILON)i+=step;
   // Handles leave horizontally, so a vertical run needs a real corner before an x-snap means anything.
   const end=points[i+step],other=axis==='x'?'y':'x';if(!end||axis==='x'&&i===index||Math.abs(points[i][other]-end[other])>=EPSILON)continue;
   const needed=end[axis]-p[axis],distance=Math.abs(delta[axis]-needed)*scale,current=best[axis];
   if(distance<=threshold&&(current===undefined||distance<Math.abs(delta[axis]-current)*scale))best[axis]=needed;
  }
 }
 if(best.x===undefined&&best.y===undefined)return {position,snapped:false};
 return {position:{x:best.x===undefined?position.x:node.position.x+best.x,y:best.y===undefined?position.y:node.position.y+best.y},snapped:true};
}
/** On release, merge the segments a service drag folded onto each other. */
export function mergeDraggedWires(start:Graph,after:Graph):Graph {
 let layouts=after.edgeLayouts,changed=false;
 for(const edge of after.edges){const layout=layouts?.[edge.id],points=layout?.waypoints;if(!layout||layout.style==='curved'||!points?.length||JSON.stringify(points)===JSON.stringify(start.edgeLayouts?.[edge.id]?.waypoints))continue;
  const aligned=points.map(p=>({...p}));for(let i=1;i<aligned.length;i++)for(const axis of ['x','y'] as const)if(Math.abs(aligned[i][axis]-aligned[i-1][axis])<.01)aligned[i][axis]=aligned[i-1][axis];
  const merged=normalizeEditedWire(aligned);
  if(JSON.stringify(merged)!==JSON.stringify(points)){layouts={...layouts,[edge.id]:{...layout,waypoints:merged}};changed=true;}
 }
 return changed?{...after,edgeLayouts:layouts}:after;
}
