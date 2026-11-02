import type {ConfigField} from './configurationTypes';
import ContextHelp from './ContextHelp';
export default function ConfigurationHelp({field}:{field:ConfigField}){
 return <ContextHelp label={field.label+' help'}><p>{field.documentation?.purpose??field.help}</p>
 {field.semantics&&<p>Meaning: {field.semantics.replaceAll('-',' ')}.</p>}
 {field.documentation?.whenToUse&&<p>When to use: {field.documentation.whenToUse}</p>}
 {field.documentation?.omission&&<p>When omitted: {field.documentation.omission}</p>}
 {field.documentation?.effects?.map(effect=><p key={effect}>{effect}</p>)}
 {field.documentation?.examples?.map((example,index)=><div key={index}><b>{example.valid===false?'Counterexample':'Example'}</b><code>{JSON.stringify(example.value)}</code><p>{example.explanation}</p></div>)}
 {field.evidence&&<p>Evidence: {field.evidence.status.replaceAll('-',' ')}{field.evidence.operation?' | '+field.evidence.operation:''}{field.evidence.apiPath?' | '+field.evidence.apiPath:''}. {field.evidence.scope}</p>}
 {field.kind==='number'&&<p>{field.integer?'Whole numbers. ':'Numeric value. '}{field.allowedNumbers?'Allowed values: '+field.allowedNumbers.join(', '):field.min!==undefined||field.max!==undefined?'Declared range: '+(field.min??'not specified')+' to '+(field.max??'not specified'):''}{field.unit?' '+field.unit:''}.</p>}
 {field.when&&<p>Available when {field.when.field} is {field.when.values.map(String).join(' or ')}.</p>}
 {field.defaultValue!==undefined&&<p>Documented default: <code>{JSON.stringify(field.defaultValue)}</code>. Defaults are copied only when you request them.</p>}
 {field.awsLimit&&<p>{field.awsLimit.kind==='hard'?'Hard limit':field.awsLimit.kind==='adjustable'?'Adjustable quota':'Context-dependent limit'}: {field.awsLimit.description} <a href={field.awsLimit.sourceUrl} target="_blank" rel="noreferrer">Limit reference ↗</a></p>}
 {field.audit?<p>Checked {field.audit.checked}: {field.audit.scope}</p>:<p>Reference-backed study guidance. A field-level AWS compatibility audit is not recorded for this setting; a saved value does not prove deployment validity.</p>}
 {field.source&&<a href={field.source.url} target="_blank" rel="noreferrer">{field.source.title} ↗</a>}
 </ContextHelp>;
}
