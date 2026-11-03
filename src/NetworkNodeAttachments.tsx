import CanonicalServiceNetwork from './CanonicalServiceNetwork';
import type {NetworkTopology} from './networkTopology';
import {ownerVpc,networkEvidence} from './networkValidation';
import ContextHelp from './ContextHelp';
export const supportsSecurityGroups=(service:string)=>['ec2','lambda','ecs','eks','elb','rds','aurora','elasticache','efs','opensearch'].includes(service);
export default function NetworkNodeAttachments({nodeId,topology,onChange}:{nodeId:string;topology:NetworkTopology;onChange:(next:NetworkTopology)=>void}){
 if(topology.registry)return <CanonicalServiceNetwork nodeId={nodeId} topology={topology} onChange={onChange}/>;
 const vpc=ownerVpc(topology,topology.membership[nodeId]),groups=topology.resources.filter(r=>r.kind==='security-group');
 return <section className="configuration-field"><header><b>Shared security groups</b><ContextHelp label="Shared security groups help"><p>Select existing shared groups for this component. Rules remain on the shared resource, so editing a group affects all its assignments. Inline security-rule notes below do not create or modify these groups.</p><p>This is an architecture-level assignment. Multiple network interfaces, AWS Security Group VPC Associations and service-specific deployment details require additional review. Unknown VPC ownership is not proof of compatibility.</p><a href={networkEvidence.sg} target="_blank" rel="noreferrer">AWS security group rules ↗</a></ContextHelp></header>
 {!groups.length&&<p>Create a security group under Resources → Network & resources. It will then appear here.</p>}
 {groups.map(group=>{const selected=group.assignedTo.includes(nodeId),owner=ownerVpc(topology,group.frameId),different=!!vpc&&!!owner&&vpc!==owner;return <label className="config-check" key={group.id}><input type="checkbox" aria-label={'Attach '+group.name} checked={selected} disabled={different&&!selected} onChange={e=>onChange({...topology,resources:topology.resources.map(r=>r.id===group.id?{...r,assignedTo:e.target.checked?[...r.assignedTo.filter(id=>id!==nodeId),nodeId]:r.assignedTo.filter(id=>id!==nodeId)}:r)})}/><span>{group.name}{different?' — different VPC; explicit VPC association is not modeled':!owner?' — VPC ownership unspecified':''}</span></label>})}
 <small>Saved together with this configuration. Cancel restores the previous assignments.</small></section>;
}
