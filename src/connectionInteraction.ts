import {manualRoute,simplifyRoute,type Point} from './connectionRouting';
import type {BuilderEdge} from './builderRules';
import type {Graph} from './architectureReview';
import {moveOrthogonalBend} from './edgeGeometry';
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
/** Move terminal legs with their services while retaining deliberately shaped inner bends. */
export function followMovedEndpoints(before:Graph,after:Graph):Graph {
 let layouts=after.edgeLayouts,changed=false;
 for(const edge of after.edges){const layout=layouts?.[edge.id],old=before.edgeLayouts?.[edge.id],points=old?.waypoints;if(!layout||layout.style==='curved'||!points?.length||points.length<2)continue;
  // Frame movement may already have translated the complete manual wire.
  if(JSON.stringify(layout.waypoints)!==JSON.stringify(points))continue;
  const delta=(id:string)=>{const a=before.nodes.find(n=>n.id===id),b=after.nodes.find(n=>n.id===id);return {x:(b?.position.x??0)-(a?.position.x??0),y:(b?.position.y??0)-(a?.position.y??0)}};
  const source=delta(edge.source),target=delta(edge.target);if(!source.x&&!source.y&&!target.x&&!target.y)continue;
  let next=points;
  if(source.x===target.x&&source.y===target.y)next=points.map(p=>({x:p.x+source.x,y:p.y+source.y}));
  else {if(source.x||source.y)next=moveOrthogonalBend(next,0,{x:next[0].x+source.x,y:next[0].y+source.y});if(target.x||target.y){const last=next.length-1;next=moveOrthogonalBend(next,last,{x:next[last].x+target.x,y:next[last].y+target.y});}}
  layouts={...layouts,[edge.id]:{...layout,waypoints:next}};changed=true;
 }
 return changed?{...after,edgeLayouts:layouts}:after;
}
