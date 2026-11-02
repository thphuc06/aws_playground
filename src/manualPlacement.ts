import type {Graph} from './architectureReview';
import {manualRoute,routeConnections,type Point} from './connectionRouting';
type Sizes=Record<string,{width:number;height:number}>;
type Anchors={source:Point;target:Point};
type SavedRoute=Anchors&{points:Point[];last:Anchors};
/** Preserve routes during manual placement. Only explicit arrangement recomputes all tracks. */
export class PlacementRoutes {
 private saved=new Map<string,SavedRoute>();
 invalidate(id?:string){if(id)this.saved.delete(id);else this.saved.clear();}
 update(graph:Graph,sizes:Sizes,automatic:boolean):Record<string,Point[]>{
  const anchors=(edge:Graph['edges'][number])=>{const a=graph.nodes.find(n=>n.id===edge.source),b=graph.nodes.find(n=>n.id===edge.target);if(!a||!b)return null;return {source:{x:a.position.x+(sizes[a.id]?.width??150),y:a.position.y+(sizes[a.id]?.height??180)/2},target:{x:b.position.x,y:b.position.y+(sizes[b.id]?.height??180)/2}};};
  const routed=graph.edges.filter(e=>graph.edgeLayouts?.[e.id]?.style!=='curved'&&!graph.edgeLayouts?.[e.id]?.waypoints?.length);
  for(const id of this.saved.keys())if(!routed.some(e=>e.id===id))this.saved.delete(id);
  const needed=automatic?routed:routed.filter(e=>!this.saved.has(e.id));const generated=needed.length?routeConnections({...graph,edges:needed},sizes):{};const result:Record<string,Point[]>={};
  for(const e of routed){const current=anchors(e);if(!current)continue;let prior=this.saved.get(e.id);if(generated[e.id])prior={points:generated[e.id],...current,last:current};if(!prior)prior={points:manualRoute(current.source,current.target,[]),...current,last:current};
   // Only a shared translation moves the saved track. Endpoint elbows are rendered
   // from this stable baseline, never fed back as new bends on the next pointer move.
   const dx=current.source.x-prior.last.source.x,dy=current.source.y-prior.last.source.y,tx=current.target.x-prior.last.target.x,ty=current.target.y-prior.last.target.y;
   const shift=(p:Point)=>({x:p.x+dx,y:p.y+dy});
   if(Math.abs(dx-tx)<.000001&&Math.abs(dy-ty)<.000001&&(dx!==0||dy!==0))prior={...prior,points:prior.points.map(shift),source:shift(prior.source),target:shift(prior.target)};
   const unchanged=current.source.x===prior.source.x&&current.source.y===prior.source.y&&current.target.x===prior.target.x&&current.target.y===prior.target.y;
   result[e.id]=unchanged?prior.points:manualRoute(current.source,current.target,prior.points.slice(1,-1));
   this.saved.set(e.id,{...prior,last:current});
  }return result;
 }
}
