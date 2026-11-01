import {policyLimitData,policyLimitNotes,type PolicyLimitDatum} from './configurationPolicyLimits';
import type {JsonValue,SecurityLibrary} from './configurationTypes';
export function policySize(text:string,unit:PolicyLimitDatum['unit']):number|undefined {if(unit==='utf8-bytes')return new TextEncoder().encode(text).byteLength;if(unit==='characters')return [...text].length;if(unit==='characters-no-whitespace')return [...text.replace(/[ \t\r\n]/g,'')].length;return undefined;}
export function policyFieldQuotaIssues(service:string,field:string,text:string):string[]{
 return policyLimitData.filter(q=>q.service===service&&q.field===field&&q.kind==='hard'&&!q.scope.includes('Combined')&&!q.scope.includes('combined')&&!q.scope.includes('aggregate')&&!q.scope.includes('customer-managed')).flatMap(q=>{const n=policySize(text,q.unit);return n!==undefined&&n>q.limit?[q.scope+' Measured '+n+' '+q.unit+' exceeds '+q.limit+'.']:[]});
}
export function securityQuotaIssues(library:SecurityLibrary):{errors:string[];warnings:string[]}{
 const errors:string[]=[],warnings:string[]=[];const size=(id:string)=>policySize(library.policies.find(p=>p.id===id)?.document??'','characters-no-whitespace')??0;
 for(const p of library.policies){if(p.attachment==='customer-managed'&&size(p.id)>6144)errors.push(p.name+': customer-managed policy document exceeds6144 non-whitespace characters.');if(p.kind==='trust'&&size(p.id)>2048)warnings.push(p.name+': above the default2048-character role trust quota. Confirm the approved account quota (documented maximum8192).');}
 for(const r of library.roles){const inline=r.policyIds.filter(id=>{const p=library.policies.find(p=>p.id===id);return p&&!p.managedPolicyId&&p.attachment!=='customer-managed'});const n=inline.reduce((sum,id)=>sum+size(id),0);if(n>10240)errors.push(r.name+': combined inline policies exceed10240 non-whitespace characters for one role.');const managed=r.policyIds.length-inline.length;if(managed>20)warnings.push(r.name+': '+managed+' managed attachments exceed the default20. Account-approved quota may differ (documented maximum25).');}
 return {errors,warnings};
}
export {policyLimitData,policyLimitNotes};
