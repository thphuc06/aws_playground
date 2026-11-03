import {useDeferredValue, useEffect, useRef, useState} from 'react';
import {ArrowLeft, ArrowRight, BookOpen, Check, GitCompareArrows, Layers, Search, SlidersHorizontal} from 'lucide-react';
import {getServiceLearningMetadata} from './learning/services';
import {LearningGlossary, ServiceComparisons} from './LearningReferenceTools';
import {canvasCatalog, serviceCatalog, c03CanvasCatalog} from './serviceCatalog';
import {chapters} from './content';
import {supportsExam} from './appRoutes';
import type {ExamVersionId} from './examVersions';
import ServiceIcon from './ServiceIcon';
import ServiceDetailPanel from './ServiceDetailPanel';
import ServicePracticePanel from './learning/ServicePracticePanel';
import ServiceConfigurationReference from './ServiceConfigurationReference';
import ServiceDeepDivePanel from './ServiceDeepDivePanel';
import {getServiceDeepDive} from './serviceDeepDives';
import ServiceHandbookPanel from './ServiceHandbookPanel';
import {getServiceHandbook, getServiceHandbookSearchText} from './serviceHandbooks';
import './serviceLibrary.css';

interface Props {
  exam: ExamVersionId; selected?: string; onOpen: (id?: string) => void;
  onAdd: (id: string) => void; onChapter: (id: string) => void;
  onPractice?: (serviceId: string) => void; onOpenLab?: (serviceId: string) => void;
}
const categories = [...new Set(canvasCatalog.map(s => s.category))];
const tools = [{id: 'browse', label: 'Browse services', Icon: Layers}, {id: 'compare', label: 'Compare choices', Icon: GitCompareArrows}, {id: 'glossary', label: 'English glossary', Icon: BookOpen}] as const;

export default function ServiceLibrary({exam, selected, onOpen, onAdd, onChapter, onPractice, onOpenLab}: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [scope, setScope] = useState('all');
  const [tool, setTool] = useState<'browse' | 'compare' | 'glossary'>('browse');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const heading = useRef<HTMLHeadingElement>(null);
  const previousSelection = useRef(selected);
  const service = canvasCatalog.find(s => s.id === selected);
  const examIds = new Set((exam === 'DVA-C02' ? serviceCatalog : c03CanvasCatalog).map(s => s.id));
  const metadata = service ? getServiceLearningMetadata(service.id) : undefined;
  const guide = service ? getServiceDeepDive(service.id) : undefined;
  const handbook = service ? getServiceHandbook(service.id) : undefined;
  const filtered = canvasCatalog.filter(s => {
    const extra = getServiceDeepDive(s.id);
    const text = [s.id, s.name, s.purpose, extra?.mentalModel, extra?.decision.useWhen, getServiceHandbookSearchText(s.id)].join(' ').toLowerCase();
    return (category === 'all' || s.category === category) && (scope === 'all' || (scope === 'exam' ? examIds.has(s.id) : !examIds.has(s.id))) && text.includes(deferredQuery);
  });
  const hasFilters = !!query || category !== 'all' || scope !== 'all';
  const clearFilters = () => {setQuery(''); setCategory('all'); setScope('all');};
  useEffect(() => {
    if (selected || previousSelection.current) heading.current?.focus({preventScroll: true});
    previousSelection.current = selected;
    window.scrollTo?.(0, 0);
  }, [selected]);
  const jumpTo = (id: string) => {const target = document.getElementById(id); target?.scrollIntoView({block: 'start'}); target?.focus({preventScroll: true});};

  if (service) {
    const lessons = chapters.filter(c => supportsExam(c, exam) && (metadata?.lessonIds.includes(c.id) || c.serviceIds?.includes(service.id)));
    return <section className="service-study atlas-study">
      <button className="atlas-back" onClick={() => onOpen()}><ArrowLeft size={16} aria-hidden="true"/> All service references</button>
      <header className="atlas-detail-hero">
        <div className="atlas-detail-icon"><ServiceIcon serviceId={service.id} name={service.name} size={64}/></div>
        <div><span className="atlas-eyebrow">{service.category}</span><h1 tabIndex={-1} ref={heading}>{service.name}</h1><p>{service.purpose}</p><div className="atlas-detail-meta"><span>{examIds.has(service.id) ? exam + ' named service' : 'Additional / legacy reference'}</span><span>Implementation handbook</span>{handbook && <span>{handbook.troubleshooting.length} diagnostic playbooks</span>}</div></div>
      </header>
      <div className="atlas-reading-layout">
        <aside className="atlas-toc"><span className="atlas-eyebrow">IN THIS GUIDE</span><nav aria-label="On this service page">{[
          ['guide-decision', '01', 'Service decisions'], ['guide-build', '02', 'Build & configure'], ['guide-diagnose', '03', 'Example & troubleshoot'],
          ['guide-scenario', '04', 'Worked scenario'], ['guide-cost', '05', 'Cost & operations'],
          ['guide-reference', '06', 'Technical reference'], ['guide-configuration', '07', 'Configuration reference'], ['guide-practice', '08', 'Practice & compare'],
        ].map(([id, number, label]) => <button key={id} onClick={() => jumpTo(id)}><span>{number}</span>{label}</button>)}</nav><div className="atlas-toc-note"><BookOpen size={19} aria-hidden="true"/><p>Read first. Then connect the ideas in your architecture.</p><small>Reading leaves your saved canvas unchanged.</small></div><button className="atlas-add" onClick={() => onAdd(service.id)}>Add or select in architecture</button></aside>
        <div className="atlas-reading-main">
          {guide && <ServiceDeepDivePanel key={service.id} guide={guide} onService={onOpen}>{handbook && <ServiceHandbookPanel handbook={handbook}/>}</ServiceDeepDivePanel>}
          <section className="atlas-reference-section"><div className="guide-section-heading"><span className="guide-number">06</span><div><span className="guide-kicker">GO DEEPER</span><h2 id="guide-reference" tabIndex={-1}>Technical reference</h2></div></div><ServiceDetailPanel serviceId={service.id}/></section>
          <section className="atlas-reference-section"><div className="guide-section-heading"><span className="guide-number">07</span><div><span className="guide-kicker">CONNECT THE SETTINGS</span><h2 id="guide-configuration" tabIndex={-1}>Configuration reference</h2></div></div><ServiceConfigurationReference key={service.id} serviceId={service.id}/></section>
          <section className="atlas-reference-section"><div className="guide-section-heading"><span className="guide-number">08</span><div><span className="guide-kicker">CHECK YOUR UNDERSTANDING</span><h2 id="guide-practice" tabIndex={-1}>Practice & compare</h2></div></div>
            <details className="service-study-practice"><summary>Try a standalone service exercise</summary><ServicePracticePanel key={service.id} serviceId={service.id} onOpenLab={onOpenLab}/>{onPractice && <p>These preview exercises have separate local state. <button onClick={() => onPractice(service.id)}>Practice with saved history</button></p>}</details>
            {metadata && <section className="service-learning-outcomes"><h3>Apply this service</h3><p>{metadata.focus}</p><ul>{metadata.learningOutcomes.map(outcome => <li key={outcome}>{outcome}</li>)}</ul></section>}
            <ServiceComparisons serviceId={service.id} onService={onOpen}/>
            <details className="service-terminology"><summary>English terminology</summary><LearningGlossary serviceId={service.id} englishOnly/></details>
            <section className="service-related-lessons"><h3>Related lessons</h3>{lessons.map(c => <button key={c.id} onClick={() => onChapter(c.id)}>{c.title}<ArrowRight size={15} aria-hidden="true"/></button>)}{!lessons.length && <p>No dedicated lesson link is recorded for this service yet. Use the references above.</p>}</section>
          </section>
        </div>
      </div>
    </section>;
  }

  return <section className="service-library atlas-library">
    <header className="atlas-hero">
      <div><span className="atlas-eyebrow"><span/> THE AWS FIELD GUIDE</span><h1 ref={heading} tabIndex={-1} aria-label="Service reference library">Service reference<br/><span>library</span></h1><p>Understand how each service works, choose its settings, and trace failures with practical examples.</p><div className="atlas-hero-footnote"><BookOpen size={16} aria-hidden="true"/> Read. Compare. Put the pieces together.</div></div>
      <div className="atlas-index-card"><div className="atlas-index-heading"><span>YOUR REFERENCE SHELF</span><Layers size={20} aria-hidden="true"/></div><div className="atlas-index-count"><strong>{canvasCatalog.length}</strong><span>service guides<br/>in one place</span></div><div className="atlas-index-topics"><span><Check size={15} aria-hidden="true"/> Setup & settings</span><span><Check size={15} aria-hidden="true"/> Code examples</span><span><Check size={15} aria-hidden="true"/> Troubleshooting</span></div><small>{categories.length} categories · {examIds.size} named in {exam}</small></div>
    </header>
    <div className="atlas-library-tools"><div className="reference-tool-tabs atlas-tabs" role="group" aria-label="Service library tools">{tools.map(({id, label, Icon}) => <button key={id} aria-pressed={tool === id} onClick={() => setTool(id)}><Icon size={17} aria-hidden="true"/>{label}</button>)}</div><span className="atlas-reading-note">Reading does not change your architecture.</span></div>
    {tool === 'compare' ? <ServiceComparisons onService={onOpen}/> : tool === 'glossary' ? <LearningGlossary englishOnly/> : <>
      <div className="service-library-filters atlas-filters">
        <label className="atlas-search-label">Find a service<div><Search size={19} aria-hidden="true"/><input type="search" aria-label="Search service references" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search a service, setting, or symptom…"/></div></label>
        <label>Category<select value={category} onChange={e => setCategory(e.target.value)}><option value="all">All categories</option>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
        <label>Exam scope<select value={scope} onChange={e => setScope(e.target.value)}><option value="all">All {canvasCatalog.length} references</option><option value="exam">{exam} named services</option><option value="additional">Additional references</option></select></label>
      </div>
      <div className="atlas-results-heading"><p role="status" aria-atomic="true"><strong>{filtered.length} {filtered.length === 1 ? 'service' : 'services'}</strong><span>{category === 'all' ? 'Across all categories' : category}</span></p>{hasFilters && <button className="atlas-clear" onClick={clearFilters}><SlidersHorizontal size={15} aria-hidden="true"/> Clear filters</button>}</div>
      <div className="service-library-grid atlas-grid">{filtered.map((s, index) => <button className="atlas-service-card" key={s.id} onClick={() => onOpen(s.id)} aria-label={'Read ' + s.name + ' guide'}>
        <span className="atlas-card-top"><span className="atlas-icon-well"><ServiceIcon serviceId={s.id} name={s.name} size={38}/></span><span className="atlas-card-index">{String(index + 1).padStart(2, '0')}</span></span>
        <span className="atlas-card-category">{s.category}</span><strong>{s.name}</strong><span className="atlas-card-purpose">{s.purpose}</span>
        <span className="atlas-card-bottom"><span>{examIds.has(s.id) ? exam + ' named service' : 'Additional / legacy reference'}</span><ArrowRight size={18} aria-hidden="true"/></span>
      </button>)}</div>
      {!filtered.length && <div className="atlas-empty"><Search size={30} aria-hidden="true"/><h2>No matching services</h2><p>Try a different name or use case, or broaden your filters.</p><button onClick={clearFilters}>Clear filters</button></div>}
      <p className="atlas-scope-note">The named exam list is a scope reference, not a completeness guarantee. Guides describe bounded learning scenarios and link to primary documentation.</p>
    </>}
  </section>;
}
