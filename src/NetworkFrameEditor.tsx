import {useEffect,useState} from 'react';
import type {Graph} from './architectureReview';
import type {NetworkFrame,NetworkTopology} from './networkTopology';
import type {ConfigField,JsonValue} from './configurationTypes';
import ConfigurationField from './ConfigurationField';
import {networkFindings,networkEvidence} from './networkValidation';
export function frameFields(frame:NetworkFrame):ConfigField[]{
 const field=(key:string,label:string,kind:ConfigField['kind'],help:string,url=networkEvidence.vpc):ConfigField=>({key,label,kind,section:'networking',help,source:{title:label+' reference',url,verified:'2026-11-02'}});
 return [field('name','Name','text','Diagram display name, up to 120 characters. It is not an AWS resource identifier.'),
 ...(['vpc','subnet','on-premises'].includes(frame.kind)?[field('cidr','CIDR','text',frame.kind==='on-premises'?'Enter an IPv4 or IPv6 network range. AWS VPC allocation sizes are not imposed on an on-premises network.':'IPv4 uses /16–/28. Subnets must fit their VPC and cannot overlap siblings. IPv6 allocation sizes depend on source; this single-range frame cannot represent a complete dual-stack allocation.',frame.kind==='vpc'?networkEvidence.vpc:networkEvidence.subnet)]:[]),
 ...(['vpc','region'].includes(frame.kind)?[field('region','Region','text','Declare the AWS Region. Availability of resources in an account is not queried.')]:[]),
 ...(['subnet','availability-zone'].includes(frame.kind)?[field('availabilityZone','Availability Zone','text','A subnet belongs to one Availability Zone. This logical label is not validated against a live account.',networkEvidence.subnet)]:[]),
 ...(frame.kind==='vpc'?[
 field('dnsSupport','DNS resolution','boolean','Whether the Amazon-provided DNS resolver is enabled. Unknown does not imply enabled.','https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns-updating.html'),
 field('dnsHostnames','DNS hostnames','boolean','Controls assignment of public DNS hostnames to eligible instances; some private DNS features require both DNS attributes.','https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns-updating.html')]:frame.kind==='subnet'?[field('autoAssignPublicIpv4','Auto-assign public IPv4','boolean','Subnet launch preference; public addressing alone does not establish an internet route.','https://docs.aws.amazon.com/vpc/latest/userguide/subnet-public-ip.html')]:[]),
 ].map(f=>({...f,...(f.key==='name'?{maxLength:120}:{}),...(f.key==='cidr'?{audit:{checked:'2026-11-02',scope:'CIDR syntax, modeled allocation prefix bounds, containment and overlap are checked.'}}:{})}));
}
export default function NetworkFrameEditor({frame,graph,onSave,onDirtyChange}:{frame:NetworkFrame;graph:Graph;onSave:(network:NetworkTopology)=>boolean;onDirtyChange:(dirty:boolean)=>void}){
 const [draft,setDraft]=useState(frame),dirty=JSON.stringify(frame)!==JSON.stringify(draft);
 useEffect(()=>{onDirtyChange(dirty);return()=>onDirtyChange(false)},[dirty,onDirtyChange]);
 const network={...graph.network!,frames:graph.network!.frames.map(f=>f.id===frame.id?draft:f)},findings=networkFindings(network,graph.nodes),errors=findings.filter(f=>f.level==='error');
 return <div className="configuration-inspector">{frameFields(frame).map(field=><ConfigurationField key={field.key} field={field} value={draft[field.key as keyof NetworkFrame] as JsonValue|undefined} values={draft as unknown as Record<string,JsonValue>} onChange={value=>setDraft(d=>{const next={...d};if(value===undefined)delete (next as any)[field.key];else (next as any)[field.key]=value;return next})}/>)}
 {findings.map((f,i)=><p key={i} className={'config-'+f.level}>{f.detail} <a href={f.sourceUrl} target="_blank" rel="noreferrer">AWS reference ↗</a></p>)}
 <button disabled={!dirty||errors.length>0||!draft.name?.trim()} onClick={()=>onSave(network)}>Save frame</button><button disabled={!dirty} onClick={()=>setDraft(frame)}>Cancel frame edits</button><small>{dirty?'Unsaved frame changes':'Saved frame settings'}</small></div>;
}
