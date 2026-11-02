import {Children,type ReactNode} from 'react';
import ContextHelp from './ContextHelp';
const base='https://docs.aws.amazon.com/IAM/latest/UserGuide/';
const guidance:Record<string,[string,string]>={
 Effect:['Choose Allow or Deny for this statement. Effective authorization depends on all applicable policies and request context.','reference_policies_elements_effect.html'],
 'Actions (one per line)':['AWS API permission actions, typically service:Action. This visual editor writes the Action element; action/resource compatibility is not exhaustively validated.','reference_policies_elements_action.html'],
 'Resources (one per line)':['Resource ARNs or a supported wildcard. Some actions do not support resource-level permissions. Consult the service authorization reference.','reference_policies_elements_resource.html'],
 'Principal type':['Identity category for this resource/trust policy. A service principal differs from an IAM principal ARN.','reference_policies_elements_principal.html'],
 'Principal ARN / service':['The principal allowed or denied by this statement. Avoid wildcard principals unless the complete policy design justifies them.','reference_policies_elements_principal.html'],
 Operator:['Comparison operator for a request-context condition. The visual editor exposes a subset; unsupported syntax is preserved in JSON.','reference_policies_elements_condition.html'],
 'Condition key':['Global or service-specific request-context key. Whether the key is present depends on the actual request.','reference_policies_elements_condition.html'],
 'Condition values (one per line)':['Expected values evaluated by the selected condition operator. An absent context key is not the same as an empty string.','reference_policies_elements_condition.html'],
 'Condition context JSON':['Synthetic request context for the local evaluator. Unsupported operators/context return Not evaluated; this is not an AWS authorization decision.','reference_policies_elements_condition.html'],
 'Permissions boundary':['A supported managed policy limiting identity permissions. A boundary does not independently grant access.','access_policies_boundaries.html'],
 'Trust policy':['Select the role resource policy controlling which principals may assume it. Application API permissions belong in identity policies.','id_roles_terms-and-concepts.html'],
 'Policy type':['Choose the policy purpose. Identity, resource, trust, endpoint, session and boundary policies have different evaluation roles.','access_policies.html'],
 'Attachment model':['Inline policies belong to one identity; managed policies are reusable attachments. The app stores a learning representation only.','access_policies_managed-vs-inline.html'],
 'Role name':['Local display name for a shared learning role. No IAM role or instance profile is provisioned.','id_roles.html'],
 Name:['Local library display name. Document syntax and quotas are checked separately from this label.','access_policies.html'],
 action:['The API action to evaluate in this synthetic scenario, such as s3:GetObject.','reference_policies_elements_action.html'],
 resource:['The synthetic resource ARN requested by the action.','reference_policies_elements_resource.html'],
 principal:['The synthetic calling principal. Trust/resource policies require an appropriate principal and full request context.','reference_policies_elements_principal.html'],
};
export default function PolicySettingLabel({children,className}:{children:ReactNode;className?:string}){
 const title=Children.toArray(children).filter(c=>typeof c==='string').join('').trim()||'Policy selection';
 const [note,path]=guidance[title]??['Choose a local policy or role for this learning scenario. Selection does not grant permissions in AWS. The local evaluator supports only its documented policy subset.','access_policies.html'];
 return <div className="policy-setting-row"><label className={className}>{children}</label><ContextHelp label={title+' help'}><p>{note}</p><a href={base+path} target="_blank" rel="noreferrer">AWS IAM reference ↗</a></ContextHelp></div>;
}
