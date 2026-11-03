const equal=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const record=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value);
const identified=(items:unknown[]):items is (Record<string,unknown>&{id:string})[]=>items.every(item=>record(item)&&typeof item.id==='string')&&new Set(items.map(item=>(item as {id:string}).id)).size===items.length;

/** Merge independent edits; an ambiguous change remains in the editor for explicit review. */
export function mergeEditorDraft<T>(base:T,draft:T,current:T,path='configuration'):{value:T;conflicts:string[]}{
 const conflicts:string[]=[];
 const merge=(before:unknown,edited:unknown,latest:unknown,at:string):unknown=>{
  if(equal(before,edited))return latest;
  if(equal(before,latest)||equal(edited,latest))return edited;
  if(record(before)&&record(edited)&&record(latest)){
   const result:Record<string,unknown>={};
   for(const key of new Set([...Object.keys(before),...Object.keys(edited),...Object.keys(latest)])){
    const value=merge(before[key],edited[key],latest[key],at+'.'+key);if(value!==undefined)result[key]=value;
   }
   return result;
  }
  // Resource/frame/policy collections have stable identities. Merge their records,
  // while scalar/reference/rule arrays remain indivisible edits.
  if(['network.frames','network.resources','network.registry.resources','securityLibrary.policies','securityLibrary.roles'].includes(at)&&Array.isArray(before)&&Array.isArray(edited)&&Array.isArray(latest)&&identified(before)&&identified(edited)&&identified(latest)){
   const baseIds=before.map(item=>item.id),draftIds=edited.map(item=>item.id),currentIds=latest.map(item=>item.id);
   const shared=baseIds.filter(id=>draftIds.includes(id)&&currentIds.includes(id));
   const order=(ids:string[])=>ids.filter(id=>shared.includes(id));
   const draftReordered=!equal(order(baseIds),order(draftIds)),currentReordered=!equal(order(baseIds),order(currentIds));
   if(draftReordered&&currentReordered&&!equal(order(draftIds),order(currentIds))){conflicts.push(at+' (order)');return latest;}
   const ids=draftReordered?[...draftIds,...currentIds]:[...currentIds,...draftIds];
   const result:unknown[]=[];
   for(const id of new Set([...ids,...baseIds])){
    const value=merge(before.find(item=>item.id===id),edited.find(item=>item.id===id),latest.find(item=>item.id===id),at+'['+id+']');if(value!==undefined)result.push(value);
   }
   return result;
  }
  conflicts.push(at);return latest;
 };
 return {value:merge(base,draft,current,path) as T,conflicts};
}
