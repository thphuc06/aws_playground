import {parseConfigurationDocument} from './configurationDocuments';
import type {ConfigurationFinding,JsonValue} from './configurationTypes';
const record=(v:unknown):v is Record<string,any>=>!!v&&typeof v==='object'&&!Array.isArray(v);
export function documentConfigurationFindings(service:string,values:Record<string,JsonValue>):ConfigurationFinding[]{
 const out:ConfigurationFinding[]=[];const add=(field:string,title:string,detail:string,level:'error'|'info'='error')=>out.push({field,title,detail,level,category:'design'});
 if(service==='step-functions'&&typeof values.definition==='string'){
  const parsed=parseConfigurationDocument(values.definition);if(!parsed.errors.length){const inspect=(machine:unknown,label='workflow',depth=0)=>{if(depth>8){add('definition','ASL app inspection limit','Nested workflow depth exceeds this local checker; no execution was attempted.');return;}if(!record(machine)||!record(machine.States)||typeof machine.StartAt!=='string'||!machine.States[machine.StartAt]){add('definition','ASL entry point invalid',label+' needs States and a StartAt referencing an existing state.');return;}
   const target=(value:unknown,from:string)=>{if(typeof value!=='string'||!Object.hasOwn(machine.States,value))add('definition','ASL transition target missing',from+' refers to a missing state.');};
   for(const [name,state]of Object.entries(machine.States)){
    if(!record(state)||!['Task','Pass','Wait','Choice','Parallel','Map','Succeed','Fail'].includes(state.Type)){add('definition','State type not checked',name+' is outside the supported static ASL state-type checker.','info');continue;}
    if(state.Next!==undefined)target(state.Next,name);
    if(['Succeed','Fail'].includes(state.Type)){if(state.Next!==undefined||state.End!==undefined)add('definition','Terminal state transition invalid',name+' is terminal and must not specify Next/End.');}
    else if(state.Type==='Choice'){if(state.Next!==undefined)add('definition','Choice transition shape invalid','Choice states use Choices/Default rather than a top-level Next.');if(state.End!==undefined)add('definition','Choice End unsupported','Choice states use branch/default transitions.');if(!Array.isArray(state.Choices)||!state.Choices.length)add('definition','Choice branches missing',name+' needs a nonempty Choices array.');else for(const c of state.Choices)target(c?.Next,name);if(state.Default!==undefined)target(state.Default,name);}
    else if((state.Next===undefined)===(state.End!==true))add('definition','State exit invalid',name+' must choose either Next or End:true.');
    if(state.Type==='Map'&&!record(state.ItemProcessor)&&!record(state.Iterator))add('definition','Map processor missing',name+' needs an ItemProcessor or supported legacy Iterator.');if(state.Type==='Parallel'&&(!Array.isArray(state.Branches)||!state.Branches.length))add('definition','Parallel branches missing',name+' needs nonempty Branches.');
    if(state.Type==='Wait'&&['Seconds','SecondsPath','Timestamp','TimestampPath'].filter(k=>state[k]!==undefined).length!==1)add('definition','Wait choice invalid',name+' needs exactly one supported wait selector.');
    if(state.Type==='Task'&&typeof state.Resource!=='string')add('definition','Task Resource missing',name+' needs a task integration/activity resource.');
    for(const kind of ['Retry','Catch'])if(Array.isArray(state[kind]))for(const [i,h]of state[kind].entries()){if(!record(h)||!Array.isArray(h.ErrorEquals))add('definition','Error handler shape invalid',name+' '+kind+' needs ErrorEquals.');else if(h.ErrorEquals.includes('States.ALL')&&(h.ErrorEquals.length!==1||i!==state[kind].length-1))add('definition','States.ALL placement invalid','States.ALL must appear alone in the last '+kind+' handler.');if(kind==='Catch')target(h?.Next,name+' Catch');}
    if(Array.isArray(state.Branches))state.Branches.forEach((b:unknown)=>inspect(b,name+' branch',depth+1));
    if(state.ItemProcessor||state.Iterator)inspect(state.ItemProcessor??state.Iterator,name+' map item',depth+1);
   }
  };inspect(parsed.value);out.push({field:'definition',level:'info',title:'Static ASL checks only',detail:'Entry/state references and selected control-flow rules were inspected. Task calls, data transforms, JSONPath/JSONata, quotas and runtime behavior were not executed.',category:'unknown'});}
 }
 for(const key of ['template','templateJson','buildspec','appSpec','appSpecJson'])if(typeof values[key]==='string'){
  const parsed=parseConfigurationDocument(values[key] as string,key.endsWith('Json')?'json':'yaml');if(parsed.errors.length)continue;const doc=parsed.value as Record<string,any>;
  if(['cloudformation','sam'].includes(service)&&key.startsWith('template')){
   if(!record(doc)||!record(doc.Resources))add(key,'Template Resources missing','CloudFormation/SAM templates need a Resources section. Intrinsic functions are preserved but not resolved or deployed.');
   else if(service==='sam'&&doc.Transform!=='AWS::Serverless-2016-10-31'&&!(Array.isArray(doc.Transform)&&doc.Transform.includes('AWS::Serverless-2016-10-31')))add(key,'SAM transform not declared','Verify the intended Transform before treating serverless resource syntax as a processed template.','info');
  }
  if(service==='codebuild'&&key==='buildspec'&&(!record(doc)||!['0.1','0.2'].includes(String(doc.version))))add(key,'Buildspec version missing/unsupported','Declare the buildspec language version; shell/build commands are not executed by this app.');
  if(service==='codedeploy'&&key.startsWith('appSpec')){
   if(!record(doc)||!['0','0.0'].includes(String(doc.version)))add(key,'AppSpec version invalid','The modeled AppSpec format declares version0.0.');
   else if(values.computePlatform==='Server'&&!['linux','windows'].includes(doc.os))add(key,'Server AppSpec OS missing','EC2/on-premises AppSpec needs its supported operating-system declaration.');
  }
 }
 return out;
}
