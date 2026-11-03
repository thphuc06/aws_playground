import {build} from 'esbuild';
import {createRequire} from 'node:module';
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {dirname, resolve, relative} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
if (args.some(arg => !['--check','--summary'].includes(arg))||args.includes('--check')&&args.includes('--summary')) throw new Error('Use --check to compare artifacts, or --summary to validate and print counts without writing.');
const built = await build({stdin: {contents: "export * from './src/learning/serviceSurfaceManifest'; export * from './src/learning/evidenceRegistry'; export * from './src/learning/coverageOverview';", resolveDir: root}, absWorkingDir: root, bundle: true, platform: 'node', format: 'cjs', write: false, metafile: true, logLevel: 'silent'});
const compiled = {exports: {}};
new Function('module', 'exports', 'require', built.outputFiles[0].text)(compiled, compiled.exports, createRequire(import.meta.url));
const {validateServiceSurfaceManifest, claimEvidenceRegistry,currentCoverageInputs,buildCoverageOverview} = compiled.exports;
const inputsData=currentCoverageInputs(),{services,skills}=inputsData,overview=buildCoverageOverview('DVA-C03',inputsData);
const errors = [...validateServiceSurfaceManifest(services), ...skills.flatMap(skill => skill.theoryLinks.filter(link => !link.resolves).map(link => `${skill.id}: unresolved theory ${link.chapter}#${link.section}`))];
if (errors.length) throw new Error(errors.join('\n'));
// A dependency junction can resolve outside this worktree. Hash project inputs
// and the lockfile, never host-specific absolute dependency paths.
const inputs = [...new Set([...Object.keys(built.metafile.inputs).filter(path => path !== '<stdin>').map(path => relative(root, resolve(root, path)).replaceAll('\\', '/')).filter(path => !path.startsWith('../') && !/(^|\/)node_modules\//.test(path)), 'scripts/audit-learning-surface.mjs', 'package-lock.json'])].sort();
const digest = createHash('sha256');
for (const path of inputs) digest.update(path).update('\0').update(readFileSync(resolve(root, path))).update('\0');
const fields = services.flatMap(service => service.fields), count = predicate => fields.filter(predicate).length;
const totals = {
  catalogServices: services.length, c03NamedServices: services.filter(service => service.catalogScope === 'C03-named-service').length,
  rootFields: services.reduce((sum, service) => sum + service.rootFieldCount, 0), fieldPaths: fields.length,
  missingHelp: count(field => !field.help.trim()), missingReference: count(field => !field.reference?.url),
  importedAuditScopes: count(field => !!field.existingAudit), independentlyReviewedClaims: claimEvidenceRegistry.filter(claim => claim.review.status === 'reviewed').length,
  registeredLocalRules: claimEvidenceRegistry.filter(claim => claim.enforcement === 'local-rule').length,
  unclassifiedFields: count(field => field.disposition === 'unclassified'), fieldsWithoutApiBinding: count(field => field.apiBinding.status === 'not-mapped'), declaredAwsSettingsWithoutApiBinding: count(field => field.disposition === 'aws-setting' && field.apiBinding.status === 'not-mapped'),
  structuredServiceBriefs: services.filter(service => service.study.structuredBrief).length,
  servicesWithConfigurationCases: services.filter(service => service.practice.configurationCaseIds.length > 0).length,
  c03SkillRecords: skills.length, skillsWithTheoryLinks: skills.filter(skill => skill.theoryLinks.some(link => link.resolves)).length,
  skillsWithKnowledgeChecks: skills.filter(skill => skill.knowledgeCheckIds.length > 0).length,
  skillsWithConfigurationCases: skills.filter(skill => skill.configurationCaseIds.length > 0).length,
  skillsWithCodeCases: skills.filter(skill => skill.codeCaseIds.length > 0).length,
  scopedDecisionGuides:overview.totals.scopedGuides,
  questionBankRecords:overview.totals.questionBank,c03QuestionRecords:overview.totals.selectedExamQuestions,
  c03PrimarySkillQuestions:overview.totals.c03PrimaryQuestions,c03SkillsWithPrimaryQuestions:overview.totals.c03SkillsWithPrimaryQuestions,
  standaloneServiceExercises:overview.totals.standaloneExercises,standaloneConfigurationExercises:overview.totals.standaloneConfigurationExercises,standaloneDecisionExercises:overview.totals.standaloneDecisionExercises,
  editorConfigurationCases:overview.totals.editorConfigurationCases,legacyC02LessonSlices:overview.totals.legacyLessonSlices,
  isolatedLabs:overview.totals.labs,c03Labs:overview.totals.selectedExamLabs,
};
const documentationGaps = services.flatMap(service => service.fields.map(field => ({serviceId: service.serviceId, path: field.path, disposition: field.disposition, missingStructuredNotes: Object.entries(field.documentation).filter(([, present]) => !present).map(([key]) => key)})).filter(field => field.missingStructuredNotes.length));
const sourceReuse = services.map(service => {
  const counts = new Map();
  for (const field of service.fields) if (field.reference) counts.set(field.reference.url, (counts.get(field.reference.url) ?? 0) + 1);
  return {serviceId: service.serviceId, reusedReferences: [...counts.entries()].filter(([, fields]) => fields > 1).map(([url, fields]) => ({url, fields}))};
});
const report = {
  formatVersion: 2, sourceDigest: digest.digest('hex'), sourceInputs: inputs,
  meaning: 'Repository-derived inventory, not an AWS accuracy, exam-readiness or release-completion score. Missing structured notes may exist in prose and require editorial review. Existing validators without registered claim evidence still exist; their rule coverage is not quantified here.',
  totals, ruleCoverage: {status: 'not-assessed', registeredClaims: claimEvidenceRegistry.length, explanation: 'Imported per-field audit scopes are counted separately. They are not converted to one rule per field or independently reviewed claims.'},
  services, skills, claims: claimEvidenceRegistry, documentationGaps, sourceReuse,
  practiceInventories:{
    questionBank:inputsData.questions.map(({id,revision,examVersions,skillRefs,serviceIds,chapterIds,kind,origin})=>({id,revision,examVersions,skillRefs,serviceIds,chapterIds,kind,origin})),
    standaloneServiceExercises:inputsData.exercises.map(({id,serviceId,kind,scopeLabel})=>({id,serviceId,kind,scopeLabel})),
    editorConfigurationCases:inputsData.editorCases.map(({id,serviceIds})=>({id,serviceIds})),
    legacyC02LessonSlices:inputsData.legacySlices.map(({serviceId,status})=>({serviceId,status})),
    isolatedLabs:inputsData.labs.map(({id,title,examVersions,serviceIds})=>({id,title,examVersions,serviceIds,skillMapping:'No direct numbered skill mapping asserted.'})),
  },
};
const cell = value => String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
const lines = [
  '# Learning surface and delivery evidence', '',
  'Generated by `node scripts/audit-learning-surface.mjs`; check freshness with `node scripts/audit-learning-surface.mjs --check`.', '',
  'Source digest: `' + report.sourceDigest + '`. This artifact follows repository content, not a manually entered completion percentage.', '',
  '**An editor field, reference link, reviewed claim, local rule, lesson and practice case are separate evidence dimensions. None proves production AWS validity or exam readiness.**', '',
  '| Dimension | Current repository evidence |', '|---|---:|',
  ...Object.entries(totals).map(([key, value]) => `| ${key} | ${value} |`), '',
  '## Service delivery matrix', '',
  '“Audit scope” means existing metadata, not independent review. Standalone exercises, editor configuration cases and historical C02 slices are separate sets. Question and lab references can overlap across services. No service is marked API-complete.', '',
  '| Service | Root / all fields | Scoped guides | Brief | Standalone exercises | Editor cases | Bank question refs | Linked labs | Audit scopes | Reviewed claims |', '|---|---:|---:|---|---:|---:|---:|---:|---:|---:|',
  ...services.map(service => `| ${cell(service.name)} | ${service.rootFieldCount} / ${service.fields.length} | ${overview.rows.find(row=>row.serviceId===service.serviceId).guideCount} | ${service.study.structuredBrief ? (service.study.sectionsMissing.length ? 'Present, incomplete sections' : 'Structured sections present') : 'Missing structured brief'} | ${service.practice.standaloneExercises.length} | ${service.practice.configurationCaseIds.length} | ${service.practice.questionIds.length} | ${service.labIds.length} | ${service.fields.filter(field => field.existingAudit).length} | ${claimEvidenceRegistry.filter(claim => claim.serviceId === service.serviceId && claim.review.status === 'reviewed').length} |`), '',
  '## C03 skill evidence', '',
  'Exact skill IDs only; a task-level field mapping does not automatically cover every child skill. Absent configuration cases can be appropriate for code/concept skills. Presence still needs a quality review.', '',
  '| Skill | Mode | Exact field mappings | Theory links | Original knowledge checks | Primary bank questions | All exact-skill questions | Editor cases | Code cases |', '|---|---|---:|---:|---:|---:|---:|---:|---:|',
  ...skills.map(skill => `| ${skill.id} — ${cell(skill.title)} | ${skill.learningMode} | ${skill.fieldMappings.length} | ${skill.theoryLinks.length} | ${skill.knowledgeCheckIds.length} | ${skill.primarySkillQuestionIds.length} | ${skill.questionIds.length} | ${skill.configurationCaseIds.length} | ${skill.codeCaseIds.length} |`), '',
  '## Practice sets and scope', '',
  `- ${totals.questionBankRecords} versioned question records across both guides; ${totals.c03QuestionRecords} eligible for C03. Of these, ${totals.c03PrimarySkillQuestions} explicitly target one C03 skill each. Chapter mentions are not converted into numbered skill mappings.`,
  `- ${totals.standaloneServiceExercises} standalone service exercises (${totals.standaloneConfigurationExercises} configuration, ${totals.standaloneDecisionExercises} decision). Their original scope labels remain in the JSON inventory.`,
  `- ${totals.editorConfigurationCases} schema2 editor configuration cases remain separately counted. Generic type/option exercises are not counted as dedicated domain cases.`,
  `- ${totals.legacyC02LessonSlices} C02-origin local lesson slices are a historical inventory, not the expanded catalog size or an exam-mastery claim.`,
  `- ${totals.isolatedLabs} isolated lab definitions (${totals.c03Labs} for C03). Lab service/chapter relevance is not a direct numbered skill mapping or live AWS execution.`, '',
  '## Work remaining before factual sign-off', '',
  totals.unclassifiedFields?`- Classify ${totals.unclassifiedFields} unclassified fields; do not infer an AWS setting from a field name or source URL.`:'- Meaning categories are present; independently review their correctness rather than treating classification as verification.',
  '- Bind AWS settings to explicitly scoped operations/properties; document variants, omissions and unsupported properties before claiming a complete API surface.',
  documentationGaps.length?`- Review ${documentationGaps.length} structured-note gaps in LEARNING-SURFACE-INVENTORY.json. They are editorial work items, not automatically missing facts or mandatory defaults.`:'- Structured note dimensions are present. Factual correctness, variant coverage and teaching quality still require independent review.',
  '- Add claim-level sources and independent review records. Existing audit scope metadata must retain its original provenance.',
  '- Register meaningful positive/negative/boundary/context test evidence for local rules; a test filename alone does not prove a test ran.',
  '- Review lesson depth, distractors and case reasoning independently. Structural presence is not content-quality acceptance.',
  '- Record actual merged-SHA test, browser and deployment outcomes separately. This generator performs no cloud operations and gives no release approval.', '',
  'See [factual review workflow](docs/learning-evidence-review.md) and [release verification matrix](docs/release-verification-matrix.md).', '',
];
const outputs = {'LEARNING-SURFACE-INVENTORY.json': JSON.stringify(report, null, 2) + '\n', 'LEARNING-SURFACE-REPORT.md': lines.join('\n')};
for (const [path, text] of Object.entries(outputs)) {
  if(args.includes('--summary'))continue;
  const target = resolve(root, path);
  if (args.includes('--check')) {
    if (!existsSync(target) || readFileSync(target, 'utf8') !== text) throw new Error(path + ' is missing or stale. Run node scripts/audit-learning-surface.mjs after merging content/schema changes.');
  } else writeFileSync(target, text);
}
console.log(JSON.stringify({mode: args.includes('--check') ? 'checked' : args.includes('--summary')?'summary':'generated', ...totals}));
