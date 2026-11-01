import {parseDocument,visit} from 'yaml';
import type {JsonValue} from './configurationTypes';
export const documentByteLimit=262144;
export function parseConfigurationDocument(text:string,format:'json'|'yaml'='json'):{value?:JsonValue;errors:string[]}{
 if(new TextEncoder().encode(text).byteLength>documentByteLimit)return {errors:['Document exceeds the 256 KiB app guardrail. This is not an AWS quota.']};
 try{
  const doc=parseDocument(text,{schema:format==='json'?'json':'core',uniqueKeys:true,strict:true});
  visit(doc,{Node(_key,node){const tag=(node as {tag?:string}).tag;if(tag&&!['tag:yaml.org,2002:str','tag:yaml.org,2002:int','tag:yaml.org,2002:float','tag:yaml.org,2002:bool','tag:yaml.org,2002:null','tag:yaml.org,2002:map','tag:yaml.org,2002:seq','!Ref','!Sub','!GetAtt','!Join','!Select','!Split','!FindInMap','!If','!Equals','!And','!Or','!Not','!ImportValue','!GetAZs','!Base64','!Cidr','!Condition','!Length','!ToJsonString'].includes(tag))throw new Error('Unsupported YAML tag. No tagged content is executed.');}});
  if(doc.errors.length)return {errors:doc.errors.map(e=>e.message)};
  if(format==='json')JSON.parse(text);
  const value=doc.toJS({maxAliasCount:0});const stack:{v:unknown;depth:number}[]=[{v:value,depth:0}];let entries=0;
  while(stack.length){const {v,depth}=stack.pop()!;if(depth>32||++entries>20000)throw new Error('Document exceeds app nesting/item limits.');
   if(v===null||typeof v==='string'||typeof v==='boolean')continue;
   if(typeof v==='number'){if(!Number.isFinite(v))throw new Error('Non-finite values are not supported.');continue;}
   if(!v||typeof v!=='object')throw new Error('Only JSON-compatible values are supported.');
   for(const [key,x]of Object.entries(v)){if(['__proto__','prototype','constructor'].includes(key))throw new Error('Unsafe document key.');stack.push({v:x,depth:depth+1});}
  }
  return {value,errors:[]};
 }catch(e){return {errors:[e instanceof Error?(/alias/i.test(e.message)?'YAML aliases are unsupported by this local editor (app guardrail). Raw text is retained.':e.message):'Invalid document.']}}
}
