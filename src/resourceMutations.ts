import type {Graph} from './architectureReview';
import {validateReviewGraph} from './architectureReview';
import {assessConfigurationMutation} from './configurationRepair';
import {prepareResourceMigration,resolveMigrationConflict} from './resourceMigration';
import {withResourceRegistry} from './resourceProjection';
import {cloneRegistryResource,deleteRegistryResource,setServiceResourceBinding,upsertRegistryResource,rewriteGraphResourceReferences} from './resourceRegistry';
import type {CanonicalResource,ResourceRef,ServiceResourceBinding} from './resourceTypes';
export type CanonicalResourceMutation={op:'migrate'}|{op:'upsert';resource:CanonicalResource}|{op:'bind-service';nodeId:string;binding:ServiceResourceBinding}|{op:'bind-frame';frameId:string;resource:ResourceRef|null}|{op:'clone';id:string;newId:string}|{op:'delete';id:string;mode:'unlink'|'remap'|'cancel';replacement?:ResourceRef}|{op:'resolve-conflict';id:string;choice:'keep-separate'|'attach-inline'|ResourceRef};
const object=(v:unknown):v is Record<string,any>=>!!v&&typeof v==='object'&&!Array.isArray(v);
export function applyCanonicalResourceMutations(before:Graph,input:unknown):{graph:Graph;changes:string[]}{
 const baseline=validateReviewGraph(before,'stored-editable');if(!baseline.ok)throw new Error(baseline.error);
 if(!Array.isArray(input)||!input.length||input.length>100)throw new Error('Use 1–100 canonical resource operations.');
 if(input.some(op=>!object(op)||typeof op.op!=='string'))throw new Error('Invalid canonical operation.');
 if(input.some(op=>op.op==='migrate')){
  if(input.length!==1||Object.keys(input[0]).some(k=>k!=='op'))throw new Error('Migration is a separate, reviewable operation.');
  if(before.version===2)throw new Error('This graph already has a canonical resource registry.');
  const result=prepareResourceMigration(before),valid=validateReviewGraph(result.graph,'stored-editable');if(!valid.ok)throw new Error(valid.error);
  return {graph:valid.graph,changes:['Migrated by copy: '+result.registry.resources.length+' canonical resources; '+result.conflicts.length+' unresolved review decisions; original snapshot preserved.']};
 }
 if(!before.network?.registry)throw new Error('Preview and migrate this graph before canonical resource edits.');
 let registry=structuredClone(before.network.registry),workingGraph=structuredClone(before);const touched:string[]=[],changes:string[]=[];
 const keys=(op:Record<string,unknown>,allowed:string[])=>{if(Object.keys(op).some(k=>!allowed.includes(k)))throw new Error('Unknown canonical operation property.');};
 for(const op of input){
  if(op.op==='upsert'){keys(op,['op','resource']);if(!object(op.resource))throw new Error('Supply the complete typed resource.');registry=upsertRegistryResource(registry,op.resource as CanonicalResource);touched.push(op.resource.id);changes.push('Save canonical resource '+op.resource.name);}
  else if(op.op==='bind-service'){keys(op,['op','nodeId','binding']);if(!before.nodes.some(n=>n.id===op.nodeId)||!object(op.binding))throw new Error('Select an existing service and provide explicit network bindings.');registry=setServiceResourceBinding(registry,op.nodeId,op.binding as ServiceResourceBinding);touched.push(op.nodeId);changes.push('Update explicit placement for '+op.nodeId);}
  else if(op.op==='bind-frame'){keys(op,['op','frameId','resource']);if(!before.network.frames.some(f=>f.id===op.frameId))throw new Error('Select an existing visual frame.');if(op.resource===null)delete registry.frameBindings[op.frameId];else registry.frameBindings[op.frameId]=op.resource;changes.push('Update visual resource binding '+op.frameId);}
  else if(op.op==='clone'){keys(op,['op','id','newId']);registry=cloneRegistryResource(registry,op.id,op.newId);touched.push(op.newId);changes.push('Duplicate resource '+op.id+' as '+op.newId+' without assignments');}
  else if(op.op==='delete'){keys(op,['op','id','mode','replacement']);if(!['unlink','remap','cancel'].includes(op.mode))throw new Error('Select unlink, remap or cancel.');registry=deleteRegistryResource(registry,op.id,op.mode,op.replacement);if(op.mode!=='cancel'){workingGraph=rewriteGraphResourceReferences(workingGraph,op.id,op.mode==='remap'?op.replacement:undefined);touched.push(op.id);changes.push('Delete resource '+op.id+' with '+op.mode);}}
  else if(op.op==='resolve-conflict'){keys(op,['op','id','choice']);registry=resolveMigrationConflict(registry,op.id,op.choice);changes.push('Record migration decision '+op.id);}
  else throw new Error('Unsupported canonical operation.');
 }
 const graph=withResourceRegistry(workingGraph,registry),valid=validateReviewGraph(graph,'stored-editable');if(!valid.ok)throw new Error(valid.error);
 const assessment=assessConfigurationMutation(before,graph,touched);if(assessment.blocking.length)throw new Error(assessment.blocking.map(f=>f.detail).join(' '));
 return {graph:valid.graph,changes:changes.length?changes:['No canonical resource change (deletion canceled).']};
}
