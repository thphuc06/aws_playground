import {useEffect,useRef,useState} from 'react';
import type {Graph} from './architectureReview';
import {previewVpcConversion,convertVpcNode,type VpcConversionPreview} from './vpcFrameConversion';
const kindLabel={'route-table':'Route table','security-group':'Security group','network-acl':'Network ACL'} as const;
/**
 * Shown for a legacy Amazon VPC service node. Nothing changes until the user
 * reviews the preview and converts; the dialog stays inside the workspace so
 * it never makes the browser leave full screen.
 */
export default function LegacyVpcBanner({graph,nodeId,onConvert}:{graph:Graph;nodeId:string;onConvert:(next:Graph,frameId:string)=>void}){
 const [open,setOpen]=useState(false),[target,setTarget]=useState('');
 return <section className="legacy-vpc-banner" aria-label="Legacy VPC node">
  <p><b>Legacy VPC node.</b> Amazon VPC is a network boundary, so the canvas now models it as a frame that contains subnets and services. This node keeps working until you convert it.</p>
  <button onClick={()=>{setTarget('');setOpen(true)}}>Convert to VPC frame…</button>
  {open&&<ConversionDialog graph={graph} nodeId={nodeId} target={target} onTarget={setTarget} onCancel={()=>setOpen(false)} onConvert={(next,frameId)=>{setOpen(false);onConvert(next,frameId)}}/>}
 </section>;
}
function ConversionDialog({graph,nodeId,target,onTarget,onCancel,onConvert}:{graph:Graph;nodeId:string;target:string;onTarget:(id:string)=>void;onCancel:()=>void;onConvert:(next:Graph,frameId:string)=>void}){
 const cancel=useRef<HTMLButtonElement>(null),[error,setError]=useState('');
 let preview:VpcConversionPreview|undefined,previewError='';try{preview=previewVpcConversion(graph,nodeId,target?{frameId:target}:undefined)}catch(e){previewError=(e as Error).message}
 useEffect(()=>{const previous=document.activeElement as HTMLElement|null;cancel.current?.focus({preventScroll:true});return()=>{if(previous?.isConnected)previous.focus({preventScroll:true})}},[]);
 const convert=()=>{try{const next=convertVpcNode(graph,nodeId,target?{frameId:target}:undefined);const before=new Set(graph.network?.frames.map(f=>f.id)??[]);onConvert(next,target||next.network?.frames.find(f=>f.kind==='vpc'&&!before.has(f.id))?.id||'')}catch(e){setError((e as Error).message)}};
 const blocked=!preview||preview.conflicts.length>0;
 return <div className="confirm-backdrop" onPointerDown={e=>{if(e.target===e.currentTarget)onCancel()}}>
  <div className="confirm-dialog vpc-conversion-dialog" role="dialog" aria-modal="true" aria-labelledby="vpc-conversion-title" onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();onCancel()}}}>
   <h3 id="vpc-conversion-title">Convert “{preview?.label??'VPC'}” to a VPC frame</h3>
   {preview&&<>
    {preview.existingCandidates.length>0&&<fieldset><legend>Destination</legend>
     <label><input type="radio" name="vpc-target" checked={!target} onChange={()=>onTarget('')}/> Create a new VPC frame</label>
     {preview.existingCandidates.map(c=><label key={c.id}><input type="radio" name="vpc-target" checked={target===c.id} onChange={()=>onTarget(c.id)}/> Use the existing frame “{c.name}” (only empty settings are filled)</label>)}
    </fieldset>}
    <h4>{preview.target.kind==='new'?'New VPC frame':'Settings added to “'+preview.target.name+'”'}</h4>
    <ul>{Object.entries(preview.frame).filter(([k])=>k!=='name').map(([k,v])=><li key={k}><code>{k}</code>: {typeof v==='object'?String((v as {id:string}).id):String(v)}</li>)}{Object.keys(preview.frame).length===1&&<li>No VPC settings are configured on the node.</li>}</ul>
    {preview.subnets.length>0&&<><h4>Subnet frames inside it</h4><ul>{preview.subnets.map((s,i)=><li key={i}>{s.name}{s.cidr?' · '+s.cidr:''}{s.availabilityZone?' · '+s.availabilityZone:''}</li>)}</ul></>}
    {preview.resources.length>0&&<><h4>Network resources to review</h4><ul>{preview.resources.map((r,i)=><li key={i}><b>{kindLabel[r.kind]}</b> “{r.name}”: {r.detail}</li>)}</ul></>}
    {preview.references.length>0&&<><h4>References repointed to the frame</h4><ul>{preview.references.map((r,i)=><li key={i}>{r.label} · <code>{r.field}</code></li>)}</ul></>}
    {preview.removedConnections.length>0&&<><h4>Connections removed</h4><ul>{preview.removedConnections.map((c,i)=><li key={i}>{c}</li>)}</ul></>}
    {preview.notes.map((n,i)=><p key={i} className="vpc-conversion-note">{n}</p>)}
    {preview.conflicts.length>0&&<div role="alert" className="vpc-conversion-conflicts"><b>Cannot merge yet</b><ul>{preview.conflicts.map((c,i)=><li key={i}>{c}</li>)}</ul></div>}
   </>}
   {(error||previewError)&&<p role="alert" className="vpc-conversion-conflicts">{error||previewError}</p>}
   <div className="confirm-actions"><button ref={cancel} onClick={onCancel}>Cancel</button><button className="confirm-primary" disabled={blocked} onClick={convert}>Convert</button></div>
  </div>
 </div>;
}
