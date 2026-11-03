import {useId,useState} from 'react';
import type {LearningResult,LearningValues} from '../learningModel';
import {scoreQuestion} from './practiceEngine';
import {createServiceExerciseValues,evaluateServiceExercise,getServiceExercise,type ServiceExercise,type ServiceConfigurationExercise,type ServiceDecisionExercise} from './serviceExercises';
import './servicePractice.css';

export interface ServicePracticePanelProps {serviceId:string;onOpenLab?:(serviceId:string)=>void}
function References({exercise}:{exercise:ServiceExercise}) {
 return <>
  <details className="service-practice-boundaries"><summary>Scope, assumptions and limitations</summary><ul>{exercise.limitations.map((text,index)=><li key={index}>{text}</li>)}</ul></details>
  <details className="service-practice-sources"><summary>Sources and review dates</summary><p>Dates describe the source review retained by this lesson. They do not attest a live AWS account.</p><ul>{exercise.sources.map((source,index)=><li key={source.url+index}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a><small>Reviewed {source.verified}</small></li>)}</ul></details>
 </>;
}
function ConfigurationExercise({exercise}:{exercise:ServiceConfigurationExercise}) {
 const prefix=useId();
 const [values,setValues]=useState<LearningValues>(()=>createServiceExerciseValues(exercise));
 const [result,setResult]=useState<LearningResult|null>(null);
 const [showReasoning,setShowReasoning]=useState(false);
 const update=(key:string,value:string|number|boolean)=>{setValues(old=>({...old,[key]:value}));setResult(null)};
 return <>
  <p>{exercise.scope}</p>
  <p className="service-practice-instruction">Start with the supplied failure. Identify the failing boundary, edit this isolated example, then check the local explanation.</p>
  <p className="service-practice-note">Checkboxes are supplied assertions; checking one does not grant an AWS permission. Numeric bounds here belong to the declared lesson slice.</p>
  <fieldset className="service-practice-fields"><legend>Exercise values</legend>{exercise.model.fields.map(field=>{
   const id=prefix+'-'+field.key,helpId=id+'-help';
   return <div className={'service-practice-field '+(field.kind==='textarea'?'wide':'')} key={field.key}>
    <label htmlFor={id}>{field.label}{field.unit&&<span> ({field.unit})</span>}</label>
    {field.kind==='boolean'?<input id={id} aria-describedby={helpId} type="checkbox" checked={values[field.key]===true} onChange={event=>update(field.key,event.target.checked)}/>:
     field.kind==='select'?<select id={id} aria-describedby={helpId} value={String(values[field.key]??'')} onChange={event=>update(field.key,event.target.value)}>{field.options?.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select>:
     field.kind==='textarea'?<textarea id={id} aria-describedby={helpId} value={String(values[field.key]??'')} spellCheck={false} maxLength={10000} onChange={event=>update(field.key,event.target.value)}/>:
     <input id={id} aria-describedby={helpId} type={field.kind==='number'?'number':'text'} value={typeof values[field.key]==='boolean'?'':String(values[field.key]??'')} min={field.min} max={field.max} step="any" maxLength={10000} onChange={event=>update(field.key,field.kind==='number'&&event.target.value!==''?Number(event.target.value):event.target.value)}/>}
    <small id={helpId}>{field.help}</small>
   </div>;
  })}</fieldset>
  <div className="service-practice-actions">
   <button type="button" onClick={()=>setResult(evaluateServiceExercise(exercise,values))}>Check this example</button>
   <button type="button" onClick={()=>{setValues(createServiceExerciseValues(exercise));setResult(null);setShowReasoning(false)}}>Reset exercise</button>
   <button type="button" aria-expanded={showReasoning} aria-controls={prefix+'-reasoning'} onClick={()=>setShowReasoning(value=>!value)}>{showReasoning?'Hide worked reasoning':'Show worked reasoning'}</button>
  </div>
  {result&&<section className="service-practice-result" role="status" aria-live="polite">
   <h4>{result.findings.some(f=>f.level==='error')?'The local example needs a repair':result.findings.some(f=>f.level==='warning')?'Review the lesson’s qualifications':'No blocking finding within this lesson'}</h4>
   {result.findings.map((finding,index)=><div className={'service-practice-finding '+finding.level} key={index}><strong>{finding.title}</strong><p>{finding.detail}</p></div>)}
   {result.trace.length>0&&<><h5>Local reasoning trace</h5><ol>{result.trace.map((step,index)=><li key={index}>{step}</li>)}</ol></>}
   <p>This is a supplied local scenario, not an AWS execution result or a mastery score.</p>
  </section>}
  {showReasoning&&<section id={prefix+'-reasoning'} className="service-practice-reasoning"><h4>Worked reasoning for the supplied case</h4><ol>{exercise.expectedReasoning.map((text,index)=><li key={index}>{text}</li>)}</ol><p>The worked repair restores the supplied assumptions. It is not the only possible real-world design.</p><button type="button" onClick={()=>{setValues(structuredClone(exercise.repairValues));setResult(null)}}>Load worked repair into this exercise</button></section>}
 </>;
}
function DecisionExercise({exercise}:{exercise:ServiceDecisionExercise}) {
 const prefix=useId(),question=exercise.question;
 const [selected,setSelected]=useState<string[]>([]);
 const [submitted,setSubmitted]=useState(false);
 const multiple=question.kind==='multiple-response';
 const choose=(id:string,checked:boolean)=>{setSubmitted(false);setSelected(old=>multiple?(checked?[...old.filter(value=>value!==id),id]:old.filter(value=>value!==id)):[id])};
 return <>
  <p>{question.prompt}</p>{question.snippet&&<pre className="service-practice-snippet"><code>{question.snippet}</code></pre>}
  <fieldset className="service-practice-options"><legend>{multiple?'Choose the complete answer set':'Choose one answer'}</legend>{question.options.map(option=><label key={option.id} htmlFor={prefix+'-'+option.id} className={selected.includes(option.id)?'selected':''}><input id={prefix+'-'+option.id} type={multiple?'checkbox':'radio'} name={prefix+'-answer'} checked={selected.includes(option.id)} onChange={event=>choose(option.id,event.target.checked)}/><span>{option.text}</span></label>)}</fieldset>
  <div className="service-practice-actions"><button type="button" disabled={!selected.length} onClick={()=>setSubmitted(true)}>Check answer</button><button type="button" onClick={()=>{setSelected([]);setSubmitted(false)}}>Reset exercise</button></div>
  {submitted&&<section className="service-practice-result" role="status" aria-live="polite"><h4>{scoreQuestion(question,selected)==='correct'?'Correct for the stated scenario':'Review the deciding distinction'}</h4><p>{question.explanation}</p><h5>Reason through every choice</h5><ul>{question.options.map(option=><li key={option.id}><strong>{question.correctOptionIds.includes(option.id)?'Supported choice: ':'Not supported: '}{option.text}</strong><p>{option.explanation}</p></li>)}</ul><p>This answer is local to this exercise. It is not saved as an independent practice attempt.</p></section>}
 </>;
}

/** The component has no graph or storage dependency. Opening it cannot add nodes or change saved work. */
export default function ServicePracticePanel({serviceId,onOpenLab}:ServicePracticePanelProps) {
 const exercise=getServiceExercise(serviceId);
 if(!exercise)return <section className="service-practice-panel"><h3>Practice unavailable</h3><p>No standalone exercise is registered for this service.</p></section>;
 return <section className="service-practice-panel" aria-label={exercise.title}>
  <header><span className="service-practice-scope">{exercise.scopeLabel}</span><h3>{exercise.title}</h3><p className="service-practice-isolation">Isolated practice · your canvas and saved work stay unchanged.</p></header>
  {exercise.kind==='configuration'?<ConfigurationExercise key={exercise.id} exercise={exercise}/>:<DecisionExercise key={exercise.id} exercise={exercise}/>}
  <References exercise={exercise}/>
  {onOpenLab&&<div className="service-practice-lab"><button type="button" onClick={()=>onOpenLab(serviceId)}>Open architecture lab</button><small>This navigation does not apply the exercise answers or values to your canvas.</small></div>}
 </section>;
}
