import {ArrowUpRight, CircleCheck, Compass, Coins, Route, TriangleAlert} from 'lucide-react';
import {canvasCatalog} from './serviceCatalog';
import type {ServiceDeepDive} from './serviceDeepDiveTypes';

export default function ServiceDeepDivePanel({guide, onService}: {
  guide: ServiceDeepDive; onService: (id: string) => void;
}) {
  return <div className="service-deep-dive">
    <section className="guide-section" aria-labelledby="guide-decision">
      <div className="guide-section-heading"><span className="guide-number">01</span><div><span className="guide-kicker">UNDERSTAND THE TRADE-OFF</span><h2 id="guide-decision" tabIndex={-1}>How to think about it</h2></div><Compass size={22} aria-hidden="true"/></div>
      <p className="guide-mental-model">{guide.mentalModel}</p>
      <div className="guide-decision-grid">
        <div className="guide-decision-card"><h3><CircleCheck size={18} aria-hidden="true"/> A good fit when</h3><p>{guide.decision.useWhen}</p></div>
        <div className="guide-decision-card caution"><h3><TriangleAlert size={18} aria-hidden="true"/> Reconsider when</h3><p>{guide.decision.avoidWhen}</p></div>
      </div>
      {guide.decision.alternativeIds.length > 0 && <div className="guide-alternatives"><span>Also evaluate</span>{guide.decision.alternativeIds.map(id => <button key={id} onClick={() => onService(id)}>{canvasCatalog.find(s => s.id === id)?.name ?? id}<ArrowUpRight size={14} aria-hidden="true"/></button>)}</div>}
    </section>
    <section className="guide-section" aria-labelledby="guide-scenario">
      <div className="guide-section-heading"><span className="guide-number">02</span><div><span className="guide-kicker">FOLLOW A CONCRETE SCENARIO</span><h2 id="guide-scenario" tabIndex={-1}>{guide.walkthrough.title}</h2></div><Route size={22} aria-hidden="true"/></div>
      <p className="guide-caption">Illustrative walkthrough · no AWS resources are created.</p>
      <ol className="guide-steps">{guide.walkthrough.steps.map((step, index) => <li key={index}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol>
      <div className="guide-result"><h3>What success looks like</h3><p>{guide.walkthrough.expectedOutcome}</p></div>
      <div className="guide-failure"><h3><TriangleAlert size={17} aria-hidden="true"/> If it fails, investigate</h3><p>{guide.walkthrough.failureMode}</p></div>
    </section>
    <section className="guide-section" aria-labelledby="guide-cost">
      <div className="guide-section-heading"><span className="guide-number">03</span><div><span className="guide-kicker">PLAN BEYOND THE DIAGRAM</span><h2 id="guide-cost" tabIndex={-1}>Cost & operational checks</h2></div><Coins size={22} aria-hidden="true"/></div>
      <div className="guide-operations-grid"><div><h3>What drives cost</h3><ul>{guide.costDrivers.map((item, index) => <li key={index}>{item}</li>)}</ul><p className="guide-caption">Cost dimensions, not a quote. Check current pricing for your Region and configuration.</p></div><div><h3>Before using it in production</h3><ul>{guide.productionChecks.map((item, index) => <li key={index}>{item}</li>)}</ul></div></div>
    </section>
    <section className="guide-sources" aria-labelledby="guide-sources"><h2 id="guide-sources" tabIndex={-1}>Sources for these field notes</h2><p>These notes supplement the technical reference below. Source checks do not establish deployment readiness.</p><ul>{guide.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<ArrowUpRight size={14} aria-hidden="true"/></a><small>Checked {source.verified}</small></li>)}</ul></section>
  </div>;
}
