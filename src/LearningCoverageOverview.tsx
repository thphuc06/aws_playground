import {useMemo,useState} from 'react';
import type {ExamVersionId} from './examVersions';
import {buildCoverageOverview,filterCoverageRows} from './learning/coverageOverview';
import './learningCoverageOverview.css';

export interface LearningCoverageNavigation {
 onService?:(serviceId:string)=>void;
 onPractice?:(serviceId:string)=>void;
 onLab?:(labId:string)=>void;
}
export default function LearningCoverageOverview({exam,onService,onPractice,onLab}:{exam:ExamVersionId}&LearningCoverageNavigation) {
 const overview=useMemo(()=>buildCoverageOverview(exam),[exam]);
 const [query,setQuery]=useState(''),[namedOnly,setNamedOnly]=useState(false);
 const rows=filterCoverageRows(overview.rows,query,namedOnly),t=overview.totals;
 return <section className="learning-coverage-overview" aria-labelledby="learning-coverage-heading">
  <header><h2 id="learning-coverage-heading">What this workspace contains</h2><p>These counts describe available learning material. They do not measure your knowledge, AWS accuracy or deployment readiness.</p></header>
  <dl className="learning-coverage-stats">
   <div><dt>Service study guides</dt><dd>{t.structuredBriefs} / {t.services}<p>Structured guides in the full catalog, including legacy references.</p></dd></div>
   <div><dt>Scoped field decision guides</dt><dd>{t.scopedGuides} / {t.fieldPaths}<p>{t.rootFields} top-level settings; the total also counts table columns. Notes explain choices and limits.</p></dd></div>
   <div><dt>Questions for {exam}</dt><dd>{t.selectedExamQuestions}<p>{t.selectedExamMultipleResponse} multiple-response questions. The versioned bank contains {t.questionBank} records across both guides.</p></dd></div>
   <div><dt>Direct C03 skill scenarios</dt><dd>{t.c03PrimaryQuestions}<p>{t.c03SkillsWithPrimaryQuestions} of {t.c03Skills} C03 skills have primary questions. Direct mapping is separate from chapter mentions.</p></dd></div>
   <div><dt>Standalone service exercises</dt><dd>{t.standaloneExercises}<p>{t.standaloneConfigurationExercises} bounded configuration exercises and {t.standaloneDecisionExercises} decision exercises across the full catalog.</p></dd></div>
   <div><dt>Isolated labs for {exam}</dt><dd>{t.selectedExamLabs}<p>{t.labs} lab definitions across both guides. Synthetic fixtures do not execute AWS operations or modify your architecture.</p></dd></div>
  </dl>
  <details className="learning-coverage-explanation"><summary>How to interpret coverage and source review</summary>
   <p>{t.classifiedFields} of {t.fieldPaths} field paths have an explicit meaning category. Classifying a setting as an AWS setting does not verify its API mapping or every supported variant.</p>
   <p>{t.priorAuditScopes} field paths retain earlier scoped-audit metadata. There are {t.reviewedClaims} independently reviewed claim records in the new evidence registry. Local checks also exist outside that registry, so neither number is a count of all valid AWS rules.</p>
   <p>The {t.editorConfigurationCases} editor configuration cases are a separate set from the {t.standaloneExercises} standalone service exercises. The {t.legacyLessonSlices} C02-origin local lesson slices below retain their original limited scope; they are not the current catalog size.</p>
   <p>Field guides require purpose, when-to-use, omission, effects, an explained example, a lesson link, a source reference and explicit scope. Structural presence does not establish factual completeness. No service is marked as a complete AWS API surface.</p>
   <p>Lab links identify service/chapter relevance. Labs do not currently assert a direct numbered skill mapping, so a related lab is not counted as proof that an entire skill is covered.</p>
  </details>
  <div className="learning-coverage-controls"><label>Find a service or field<input type="search" aria-label="Search learning coverage" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Lambda, retention, access policy…"/></label><label className="learning-coverage-check"><input type="checkbox" checked={namedOnly} onChange={event=>setNamedOnly(event.target.checked)}/>Only {exam} named services</label></div>
  <p role="status">{rows.length} of {t.services} services shown · question and lab counts follow {exam}</p>
  <div className="learning-coverage-table-scroll" role="region" aria-label="Service learning coverage matrix" tabIndex={0}><table>
   <caption>Service guides, field notes and practice are independent coverage dimensions.</caption>
   <thead><tr><th scope="col">Service</th><th scope="col">Guide and field notes</th><th scope="col">Practice opportunities</th><th scope="col">Related labs</th><th scope="col">Review evidence</th></tr></thead>
   <tbody>{rows.map(row=><tr key={row.serviceId}>
    <th scope="row">{onService?<button className="text-button" onClick={()=>onService(row.serviceId)}>{row.name}</button>:<a href={`?view=services&exam=${exam}&service=${encodeURIComponent(row.serviceId)}`}>{row.name}</a>}<small>{row.category}</small><small>{row.namedForExam?`${exam} named service`:'Additional / legacy reference'}</small></th>
    <td><strong>{row.briefPresent?'Structured guide present':'Guide not recorded'}</strong>{row.briefGaps.length>0&&<small>Missing sections: {row.briefGaps.join(', ')}</small>}<p>{row.guideCount} / {row.fieldCount} scoped field guides</p><small>{row.classifiedCount} fields classified; full API scope not assessed</small></td>
    <td><p>{row.standaloneExercises.length} standalone exercise{row.standaloneExercises.length===1?'':'s'}</p>{row.standaloneExercises.map(exercise=><small key={exercise.id}>{exercise.kind}{exercise.scopeLabel?' · '+exercise.scopeLabel:''}</small>)}<small>{row.editorCaseIds.length} separate editor cases</small><p>{row.questionIds.length} questions for {exam}</p>{onPractice&&row.questionIds.length>0&&<button onClick={()=>onPractice(row.serviceId)}>Practice {row.name}</button>}</td>
    <td>{row.labs.length?<details><summary>{row.labs.length} related lab{row.labs.length===1?'':'s'}</summary><ul>{row.labs.map(lab=><li key={lab.id}>{onLab?<button onClick={()=>onLab(lab.id)}>{lab.title}</button>:lab.title}</li>)}</ul></details>:<span>No lab linked for this guide</span>}</td>
    <td><p>{row.priorAuditCount} earlier field audit scopes</p><small>{row.reviewedClaimCount} new claim-review records</small><small>Reference links and classifications are not independent verification.</small></td>
   </tr>)}</tbody>
  </table></div>
  {!rows.length&&<p>No matching services. <button onClick={()=>{setQuery('');setNamedOnly(false)}}>Clear coverage filters</button></p>}
  <details className="learning-coverage-skills"><summary>Direct evidence for {t.c03Skills} DVA-C03 skills</summary><p>This map always refers to C03. A task-level reference is not expanded automatically to every child skill, and a question is not a mastery result.</p><div className="learning-coverage-table-scroll" role="region" aria-label="DVA-C03 skill evidence matrix" tabIndex={0}><table><caption>Exact skill references in the current registries</caption><thead><tr><th scope="col">Skill</th><th scope="col">Primary questions</th><th scope="col">Other mapped questions</th><th scope="col">Theory links</th><th scope="col">Exact field mappings</th></tr></thead><tbody>{overview.skills.map(skill=><tr key={skill.id}><th scope="row"><a href={skill.source.url} target="_blank" rel="noreferrer">{skill.id} · {skill.title}</a></th><td>{skill.primarySkillQuestionIds.length}</td><td>{skill.questionIds.filter(id=>!skill.primarySkillQuestionIds.includes(id)).length}</td><td>{skill.theoryLinks.filter(link=>link.resolves).length}</td><td>{skill.fieldMappings.length}</td></tr>)}</tbody></table></div></details>
 </section>;
}
