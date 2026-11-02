import {Children,type ReactNode} from 'react';
import ContextHelp from './ContextHelp';
import {networkEvidence} from './networkValidation';
export default function NetworkSettingLabel({children,className}:{children:ReactNode;className?:string}){
 const label=Children.toArray(children).filter(c=>typeof c==='string').join('').trim()||'Network assignment';
 const note=label==='Resource name'?'A local display name for this resource, up to 120 characters. This label is not an AWS ID or a claim that a resource exists.':label==='Owning frame'?'Declare the VPC or hosting subnet context. This selection supports local compatibility checks; it does not configure an AWS association.':'Choose a local frame, shared resource or assignment. Visual containment and resource references do not grant permissions or establish a route. Unknown context stays unknown.';
 return <div className="policy-setting-row"><label className={className}>{children}</label><ContextHelp label={label+' help'}><p>{note}</p><a href={networkEvidence.vpc} target="_blank" rel="noreferrer">AWS networking context ↗</a></ContextHelp></div>;
}
