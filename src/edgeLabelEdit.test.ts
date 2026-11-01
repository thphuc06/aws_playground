import {describe,it,expect} from 'vitest';
import {updateEdgeLabel,commitEdgeLabel} from './edgeLabelEdit';
describe('edge label transactions',()=>{const edges=[{id:'a',source:'one',target:'two',label:'Original'},{id:'b',source:'two',target:'three'}];
 it('live edits affect only the selected label and preserve graph semantics',()=>{const next=updateEdgeLabel(edges,'a','Draft');expect(next[0]).toEqual({...edges[0],label:'Draft'});expect(next[1]).toBe(edges[1]);expect(edges[0].label).toBe('Original')});
 it('commits normalized bounded text',()=>{expect(commitEdgeLabel(updateEdgeLabel(edges,'a','  Saved  '),'a')[0].label).toBe('Saved');expect(updateEdgeLabel(edges,'a','x'.repeat(70))[0].label?.length).toBe(60)});
 it('cancel restores original persisted graph label exactly',()=>{const draft=updateEdgeLabel(edges,'a','New');expect(updateEdgeLabel(draft,'a',edges[0].label)).toEqual(edges);expect(updateEdgeLabel(updateEdgeLabel(edges,'b','New'),'b',undefined)).toEqual(edges)});
 it('empty remains empty for a display fallback; removed IDs stay removed',()=>{expect(commitEdgeLabel(updateEdgeLabel(edges,'a','  '),'a')[0].label).toBe('');expect(updateEdgeLabel([], 'deleted','Draft')).toEqual([])});
});
