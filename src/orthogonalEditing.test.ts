import {it,expect} from 'vitest';
import {wireControls,moveWireControl,removeWireControl} from './orthogonalEditing';
import {manualRoute} from './connectionRouting';
import {snapWireControl,normalizeEditedWire} from './orthogonalEditing';
it('puts exactly one control at every nonzero segment midpoint, including short legs',()=>{const route=[{x:0,y:0},{x:24,y:0},{x:24,y:10},{x:200,y:10},{x:200,y:100}];const controls=wireControls(route);expect(controls.map(c=>[c.kind,c.index,c.point])).toEqual([['segment',0,{x:12,y:0}],['segment',1,{x:24,y:5}],['segment',2,{x:112,y:10}],['segment',3,{x:200,y:55}]]);expect(wireControls([{x:0,y:0},{x:0,y:0}])).toEqual([])});
it('creates editable doglegs from a straight segment and retains fixed endpoints on subsequent edits',()=>{const source={x:0,y:0},target={x:300,y:0},straight=[source,target];const first=moveWireControl(straight,wireControls(straight)[0],{x:150,y:100});expect(manualRoute(source,target,first.slice(1,-1))).toEqual(first);expect(wireControls(first)).toHaveLength(5);const second=moveWireControl(first,wireControls(first)[1],{x:60,y:50});expect(second).toContainEqual({x:60,y:100});expect(second[0]).toEqual(source);expect(second.at(-1)).toEqual(target);for(let i=1;i<second.length;i++)expect(second[i].x===second[i-1].x||second[i].y===second[i-1].y).toBe(true);const third=moveWireControl(second,wireControls(second)[0],{x:30,y:-40});expect(wireControls(third)).toHaveLength(7);expect(third[0]).toEqual(source);expect(third.at(-1)).toEqual(target)});
it('moves internal vertical segments horizontally without following pointer motion along their length',()=>{const route=[{x:0,y:0},{x:100,y:0},{x:100,y:200},{x:400,y:200}];const segment=wireControls(route).find(c=>c.index===1)!;expect(moveWireControl(route,segment,{x:180,y:900})).toEqual([{x:0,y:0},{x:180,y:0},{x:180,y:200},{x:400,y:200}])});
it('removes a dogleg through its middle segment and preserves the endpoint connection',()=>{const route=moveWireControl([{x:0,y:0},{x:300,y:0}],{kind:'segment',index:0,point:{x:150,y:0}},{x:150,y:100});expect(removeWireControl(route,wireControls(route)[2])).toEqual([{x:0,y:0},{x:300,y:0}])});
const bump=[{x:0,y:0},{x:80,y:0},{x:80,y:-80},{x:180,y:-80},{x:180,y:0},{x:300,y:0}];
it('snaps a raised segment to the height shared by its left and right arms',()=>{
 const control=wireControls(bump)[2],snapped=snapWireControl(bump,control,{x:130,y:-5},1);
 expect(snapped).toEqual({point:{x:130,y:0},alignment:{axis:'y',value:0}});
 const merged=moveWireControl(bump,control,snapped.point);
 expect(merged).toEqual([{x:0,y:0},{x:300,y:0}]);expect(wireControls(merged)).toHaveLength(1);
 expect(manualRoute(merged[0],merged[1],[{x:150,y:0}])).toEqual(merged);
});
it('uses screen-pixel entry/release bands without oscillating near the alignment',()=>{
 const control=wireControls(bump)[2];
 for(const zoom of [.25,.5,1,1.5]){
  const entry=snapWireControl(bump,control,{x:130,y:5/zoom},zoom);expect(entry.point.y).toBe(0);
  expect(snapWireControl(bump,control,{x:130,y:9/zoom},zoom,entry.alignment).point.y).toBe(0);
  expect(snapWireControl(bump,control,{x:130,y:11/zoom},zoom,entry.alignment).alignment).toBeUndefined();
  expect(snapWireControl(bump,control,{x:130,y:7/zoom},zoom).alignment).toBeUndefined();
 }
});
it('snaps vertical segments to another vertical leg and removes the doubled-back excursion',()=>{
 const route=[{x:0,y:0},{x:100,y:0},{x:100,y:80},{x:200,y:80},{x:200,y:0},{x:300,y:0}];
 const snapped=snapWireControl(route,wireControls(route)[1],{x:196,y:40},1);
 expect(snapped.alignment).toEqual({axis:'x',value:200});
 expect(moveWireControl(route,wireControls(route)[1],snapped.point)).toEqual([{x:0,y:0},{x:300,y:0}]);
});
it('merges a bump but preserves an unrelated final vertical offset',()=>{
 const route=[...bump.slice(0,-1),{x:280,y:0},{x:280,y:100},{x:300,y:100}];
 expect(moveWireControl(route,wireControls(route)[2],{x:130,y:0})).toEqual([{x:0,y:0},{x:280,y:0},{x:280,y:100},{x:300,y:100}]);
});
it('removes redundant return paths without mutating the input or changing endpoints',()=>{
 const route=[{x:0,y:0},{x:100,y:0},{x:100,y:100},{x:50,y:100},{x:50,y:0},{x:150,y:0}],original=structuredClone(route);
 const result=normalizeEditedWire(route);expect(result).toEqual([{x:0,y:0},{x:150,y:0}]);expect(route).toEqual(original);expect(normalizeEditedWire(result)).toEqual(result);
});
