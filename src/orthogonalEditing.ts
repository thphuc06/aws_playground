import {manualRoute,type Point} from './connectionRouting';
import {moveOrthogonalBend} from './edgeGeometry';
export interface WireControl {kind:'corner'|'segment';index:number;point:Point}
/** Pick the actual part of the wire being held, without displaying a grip at every bend. */
export function wireControlAt(route:Point[],point:Point,cornerRadius:number):WireControl|undefined {
 const distance=(p:Point)=>(p.x-point.x)**2+(p.y-point.y)**2;
 const corner=route.slice(1,-1).map((p,i)=>({kind:'corner' as const,index:i+1,point:p})).sort((a,b)=>distance(a.point)-distance(b.point))[0];
 if(corner&&distance(corner.point)<=cornerRadius**2)return corner;
 return route.slice(1).map((_,i)=>({kind:'segment' as const,index:i,point:closestPointOnWire(route.slice(i,i+2),point)})).sort((a,b)=>distance(a.point)-distance(b.point))[0];
}
const limit=(v:number)=>Math.max(-100000,Math.min(100000,v));
export interface WireAlignment {axis:'x'|'y';value:number}
/** Screen-pixel hysteresis makes alignment feel the same at every zoom level. */
export function snapWireControl(route:Point[],control:WireControl,point:Point,zoom=1,locked?:WireAlignment):{point:Point;alignment?:WireAlignment}{
 const a=route[control.index],b=route[control.index+1];
 if(control.kind!=='segment'||!a||!b)return {point};
 const axis=a.y===b.y?'y':'x',scale=Number.isFinite(zoom)&&zoom>0?zoom:1;
 const candidates=[...new Set(route.slice(1).flatMap((p,index)=>route[index][axis]===p[axis]?[p[axis]]:[]))];
 if(axis==='y')candidates.push(route[0].y,route.at(-1)!.y);
 if(locked?.axis===axis&&candidates.includes(locked.value)&&Math.abs(point[axis]-locked.value)*scale<=10)return {point:{...point,[axis]:locked.value},alignment:locked};
 const value=candidates.sort((x,y)=>Math.abs(point[axis]-x)-Math.abs(point[axis]-y))[0];
 if(value!==undefined&&Math.abs(point[axis]-value)*scale<=6)return {point:{...point,[axis]:value},alignment:{axis,value}};
 return {point};
}
const same=(a:Point,b:Point)=>a.x===b.x&&a.y===b.y;
const onSegment=(p:Point,a:Point,b:Point)=>(a.x===b.x&&p.x===a.x||a.y===b.y&&p.y===a.y)&&p.x>=Math.min(a.x,b.x)&&p.x<=Math.max(a.x,b.x)&&p.y>=Math.min(a.y,b.y)&&p.y<=Math.max(a.y,b.y);
/** Remove only redundant geometry on this wire; source/target identities never change. */
export function normalizeEditedWire(points:Point[]):Point[]{
 const out:Point[]=[];
 for(const point of points){
  if(out.length&&same(out.at(-1)!,point))continue;
  // Returning to an earlier part of the same wire closes a redundant excursion.
  if(out.length>2){
   const from=out.at(-1)!;
   for(let i=0;i<out.length-2;i++){
    const a=out[i],b=out[i+1];let intersection:Point|undefined;
    if(from.x===point.x&&a.y===b.y){const candidate={x:from.x,y:a.y};if(onSegment(candidate,from,point)&&onSegment(candidate,a,b))intersection=candidate;}
    else if(from.y===point.y&&a.x===b.x){const candidate={x:a.x,y:from.y};if(onSegment(candidate,from,point)&&onSegment(candidate,a,b))intersection=candidate;}
    else if(onSegment(point,a,b))intersection=point;
    else if(onSegment(a,from,point))intersection=a;
    else if(onSegment(b,from,point))intersection=b;
    if(intersection){out.splice(i+1);if(!same(out.at(-1)!,intersection))out.push(intersection);break;}
   }
  }
  while(out.length>=2){const a=out[out.length-2],b=out.at(-1)!;if(a.x===b.x&&b.x===point.x||a.y===b.y&&b.y===point.y)out.pop();else break;}
  if(!out.length||!same(out.at(-1)!,point))out.push({...point});
 }
 return out;
}
/** One visible control at the exact midpoint of every nonzero straight segment. */
export function wireControls(route:Point[]):WireControl[]{const segments:WireControl[]=[];for(let i=0;i<route.length-1;i++){const a=route[i],b=route[i+1];if((a.x===b.x||a.y===b.y)&&(a.x!==b.x||a.y!==b.y))segments.push({kind:'segment',index:i,point:{x:(a.x+b.x)/2,y:(a.y+b.y)/2}});}return segments;}
export function closestPointOnWire(route:Point[],p:Point):Point{let best=Infinity,result=route[0]??p;for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i],point={x:Math.max(Math.min(a.x,b.x),Math.min(Math.max(a.x,b.x),p.x)),y:Math.max(Math.min(a.y,b.y),Math.min(Math.max(a.y,b.y),p.y))},distance=(point.x-p.x)**2+(point.y-p.y)**2;if(distance<best){best=distance;result=point;}}return result;}
/** Moving a segment inserts endpoint elbows as needed; moving a corner retains orthogonality. */
export function moveWireControl(route:Point[],control:WireControl,p:Point,independent=false):Point[]{if(route.length<2)return route;const next={x:limit(p.x),y:limit(p.y)},source=route[0],target=route.at(-1)!;
 if(control.kind==='corner')return manualRoute(source,target,moveOrthogonalBend(route.slice(1,-1),control.index-1,next,independent));
 const i=control.index,a=route[i],b=route[i+1];if(!a||!b)return route;const horizontal=a.y===b.y,axis=horizontal?'x':'y',perp=horizontal?'y':'x',direction=Math.sign(b[axis]-a[axis])||1,offset=Math.min(24,Math.abs(b[axis]-a[axis])/3);const moved=route.map(v=>({...v}));
 if(i>0)moved[i][perp]=next[perp];if(i+1<route.length-1)moved[i+1][perp]=next[perp];
 const output:Point[]=[];for(let j=0;j<moved.length;j++){output.push(moved[j]);if(j===i&&i===0){const stub={...a,[axis]:a[axis]+direction*offset};output.push(stub,{...stub,[perp]:next[perp]});}if(j===i&&i+1===route.length-1){const stub={...b,[axis]:b[axis]-direction*offset};output.push({...stub,[perp]:next[perp]},stub);}}
 return normalizeEditedWire(output);
}
export function removeWireControl(route:Point[],control:WireControl):Point[]{const source=route[0],target=route.at(-1)!;const removed=control.kind==='corner'?new Set([control.index]):new Set([control.index,control.index+1]);return manualRoute(source,target,route.slice(1,-1).filter((_,i)=>!removed.has(i+1)));}
