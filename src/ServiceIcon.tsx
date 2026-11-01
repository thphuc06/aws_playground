import {useEffect,useState} from 'react';
import {Box} from 'lucide-react';
import {serviceIcons} from './serviceIcons';
/** Icons supplement, never replace, visible instance names and capability labels. */
export default function ServiceIcon({serviceId,name,size=28}:{serviceId:string;name:string;size?:number}){
 const entry=serviceIcons[serviceId];const [failed,setFailed]=useState(false);useEffect(()=>setFailed(false),[serviceId]);const fallback=failed||!entry||entry.kind==='fallback';
 return <span className={'service-icon '+(fallback?'service-icon-fallback':'')} style={{width:size,height:size}} title={fallback?`${name}: generic service symbol (official service icon unavailable)`:`${name} — ${entry.officialName} artwork`}>{fallback?<Box size={Math.round(size*.72)} role="img" aria-label={`Generic service symbol for ${name}; official service icon unavailable`}/>:<img src={entry.path} width={size} height={size} alt={`${name} — ${entry.officialName} icon`} draggable={false} onError={()=>setFailed(true)}/>}</span>
}
