import {useId,useRef,useState,type ReactNode} from 'react';
import type {ConfigField,JsonValue} from './configurationTypes';
import {hasMeaningfulValue} from './configurationRepair';
import './compactConfigurationRows.css';
type Row=Record<string,JsonValue>;
const short=(value:unknown):string=>{const text=typeof value==='string'||typeof value==='number'?String(value):value&&typeof value==='object'&&!Array.isArray(value)&&'id' in value?String(value.id):'';return text.length>70?text.slice(0,67)+'...':text};
const icmpValue=(value:unknown)=>value===-1?'all':value===undefined?'not set':short(value);
/** Summaries describe declared values, not validity; never display arbitrary secret/document payloads. */
export function configurationRowSummary(field:ConfigField,row:Row):string {
 if(!hasMeaningfulValue(row))return 'New row - no values yet';
 const protocol=String(row.protocol??'').toLowerCase();
 if(['securityRules','inbound','outbound','networkAclRules'].includes(field.key)){
  const direction=String(row.direction??(field.key==='inbound'?'ingress':field.key==='outbound'?'egress':''));
  const peer=short(row.peer??row.cidr)||'peer not set';
  let transport=protocol?protocol.toUpperCase():'Protocol not set';
  if(protocol==='all')transport='ALL protocols';
  else if(protocol==='icmp'||protocol==='icmpv6'){
   transport=protocol==='icmpv6'?'ICMPv6':'ICMP';
   transport+=row.ports!==undefined||row.portRange!==undefined?' type/code '+short(row.ports??row.portRange):' type '+icmpValue(row.fromPort)+' / code '+icmpValue(row.toPort);
  }else if(protocol==='tcp'||protocol==='udp'){
   const range=row.ports??row.portRange??(row.fromPort!==undefined&&row.toPort!==undefined?(row.fromPort===row.toPort?row.fromPort:String(row.fromPort)+'-'+row.toPort):undefined);
   transport+=' '+(range!==undefined?short(range):'ports not set');
  }
  return [direction?direction[0].toUpperCase()+direction.slice(1):'',row.action?short(row.action):'',transport,direction==='egress'?'to':'from',peer].filter(Boolean).join(' ');
 }
 const keys=['name','id','routeKey','pathPattern','event','subnetId','hostname','key','type','kind','provider','availabilityZone','region','image','source','target'];
 const parts=keys.filter(key=>hasMeaningfulValue(row[key])).map(key=>short(row[key])).filter(Boolean).slice(0,3);
 const count=Object.values(row).filter(hasMeaningfulValue).length;return parts.length?parts.join(' - '):count+(count===1?' field entered':' fields entered');
}
function CompactRow({field,row,index,rowPath,onRemove,children}:{field:ConfigField;row:Row;index:number;rowPath:string;onRemove:()=>void;children:ReactNode}){
 const [open,setOpen]=useState(()=>!hasMeaningfulValue(row));
 return <details className="compact-configuration-row" data-field-path={rowPath} open={open} onToggle={event=>setOpen(event.currentTarget.open)}>
  <summary><span className="compact-row-heading">{field.label} {index+1}</span><span className="compact-row-description">{configurationRowSummary(field,row)}</span></summary>
  <div className="compact-row-content"><button type="button" className="compact-row-remove" aria-label={'Remove '+field.label+' row '+(index+1)} onClick={onRemove}>Remove row</button>{children}</div>
 </details>;
}
export default function CompactConfigurationRows({field,rows,path,onChange,renderRow}:{field:ConfigField;rows:Row[];path:string;onChange:(rows:Row[])=>void;renderRow:(row:Row,index:number)=>ReactNode}){
 const instanceId=useId(),sequence=useRef(0),keys=useRef<string[]>([]);
 const nextKey=()=>instanceId+'-row-'+sequence.current++;
 // Keys are editor-only. Own add/remove actions retain surviving row component state,
 // including invalid raw document drafts, without adding UI metadata to saved AWS values.
 while(keys.current.length<rows.length)keys.current.push(nextKey());
 if(keys.current.length>rows.length)keys.current.length=rows.length;
 return <div className="config-repeatable compact-configuration-table">
  {rows.map((row,index)=><CompactRow key={keys.current[index]} field={field} row={row} index={index} rowPath={path+field.key+'-'+index} onRemove={()=>{keys.current.splice(index,1);onChange(rows.filter((_,i)=>i!==index))}}>{renderRow(row,index)}</CompactRow>)}
  <button type="button" disabled={rows.length>=100} onClick={()=>{keys.current.push(nextKey());onChange([...rows,{}])}}>Add {field.label.toLowerCase()} row</button>
  <small>Up to 100 rows is an app guardrail, not the AWS quota.</small>
 </div>;
}
