import {expect,it} from 'vitest';
import {mergeEditorDraft} from './editorDraftMerge';

it('merges canonical settings and newer geometry by resource identity without dropping concurrent additions',()=>{
 const base={frames:[{id:'frame',x:0,y:0,cidr:'10.0.0.0/16'}],registry:{resources:[{id:'vpc',values:{cidr:'10.0.0.0/16'}}],serviceBindings:{app:{subnets:[]}}}};
 const draft=structuredClone(base);draft.frames[0].cidr='10.1.0.0/16';draft.registry.resources[0].values.cidr='10.1.0.0/16';
 const current=structuredClone(base);current.frames[0].x=150;current.frames[0].y=75;current.registry.resources.push({id:'another',values:{cidr:'10.2.0.0/16'}});
 const merged=mergeEditorDraft(base,draft,current,'network');expect(merged.conflicts).toEqual([]);expect(merged.value.frames[0]).toMatchObject({x:150,y:75,cidr:'10.1.0.0/16'});expect(merged.value.registry.resources.map(r=>r.id)).toEqual(['vpc','another']);
 expect(current.frames[0].cidr).toBe('10.0.0.0/16');
});
it('blocks concurrent edits to the same scalar, reference array, or deleted resource',()=>{
 expect(mergeEditorDraft({cidr:'before'},{cidr:'draft'},{cidr:'current'},'network').conflicts).toEqual(['network.cidr']);
 expect(mergeEditorDraft({subnets:[] as {id:string}[]},{subnets:[{id:'a'}]},{subnets:[{id:'b'}]},'network.registry.serviceBindings.app').conflicts).toEqual(['network.registry.serviceBindings.app.subnets']);
 expect(mergeEditorDraft({resources:[{id:'a',name:'before'}]},{resources:[{id:'a',name:'draft'}]},{resources:[]},'network').conflicts).toEqual(['network.resources[a]']);
});
it('merges independent policy changes but reports edits to the same policy document',()=>{
 const base={policies:[{id:'one',document:'original'},{id:'two',document:'original'}]};
 const draft={policies:[{id:'one',document:'draft'},{id:'two',document:'original'}]};
 const current={policies:[{id:'one',document:'original'},{id:'two',document:'concurrent'}]};
 expect(mergeEditorDraft(base,draft,current,'securityLibrary').value.policies.map(p=>p.document)).toEqual(['draft','concurrent']);
 current.policies[0].document='conflict';expect(mergeEditorDraft(base,draft,current,'securityLibrary').conflicts).toEqual(['securityLibrary.policies[one].document']);
});
