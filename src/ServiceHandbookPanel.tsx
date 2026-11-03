import {ArrowUpRight, BookOpen, Bug, Check, Copy, ShieldCheck, Wrench} from 'lucide-react';
import {useState} from 'react';
import type {HandbookNote, ServiceHandbook} from './serviceHandbookTypes';

function References({ids, handbook}: {ids: string[]; handbook: ServiceHandbook}) {
  return <span className="handbook-citations" aria-label="Supporting references">{ids.map(id => {
    const source = handbook.sources.find(item => item.id === id);
    return source ? <a key={id} href={source.url} target="_blank" rel="noreferrer" aria-label={'Primary reference: ' + source.title} title={source.title}>[{handbook.sources.indexOf(source) + 1}]</a> : null;
  })}</span>;
}
function Notes({items, handbook, ordered = false}: {items: HandbookNote[]; handbook: ServiceHandbook; ordered?: boolean}) {
  const Tag = ordered ? 'ol' : 'ul';
  return <Tag className={'handbook-notes' + (ordered ? ' handbook-setup' : '')}>{items.map((item, index) => <li key={item.title}>
    {ordered && <span className="handbook-step" aria-hidden="true">{index + 1}</span>}
    <div><h4>{item.title}</h4><p>{item.detail} <References ids={item.sourceIds} handbook={handbook}/></p></div>
  </li>)}</Tag>;
}

export default function ServiceHandbookPanel({handbook}: {handbook: ServiceHandbook}) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const copy = async () => {
    try {await navigator.clipboard.writeText(handbook.example.code); setCopyState('copied');}
    catch {setCopyState('failed');}
  };
  return <div className="service-handbook">
    <section className="guide-section handbook-build" aria-labelledby="guide-build">
      <div className="guide-section-heading"><span className="guide-number">02</span><div><span className="guide-kicker">FROM CONCEPT TO IMPLEMENTATION</span><h2 id="guide-build" tabIndex={-1}>Build & configure</h2></div><Wrench size={22} aria-hidden="true"/></div>
      <div className="handbook-subsection"><h3><BookOpen size={18} aria-hidden="true"/> How it works</h3><Notes items={handbook.operatingModel} handbook={handbook}/></div>
      <div className="handbook-subsection"><h3>Implementation path</h3><Notes items={handbook.setup} handbook={handbook} ordered/></div>
      <div className="handbook-subsection"><h3>Configuration decisions</h3><div className="handbook-settings">{handbook.configuration.map(setting => <article key={setting.name}>
        <h4>{setting.name}</h4><p>{setting.choice}</p><p><strong>Trade-off:</strong> {setting.tradeoff} <References ids={setting.sourceIds} handbook={handbook}/></p>
      </article>)}</div></div>
      <div className="handbook-subsection"><h3><ShieldCheck size={18} aria-hidden="true"/> Security boundaries</h3><Notes items={handbook.security} handbook={handbook}/></div>
    </section>
    <section className="guide-section handbook-diagnose" aria-labelledby="guide-diagnose">
      <div className="guide-section-heading"><span className="guide-number">03</span><div><span className="guide-kicker">READ THE EXAMPLE. FOLLOW THE EVIDENCE.</span><h2 id="guide-diagnose" tabIndex={-1}>Example & troubleshooting</h2></div><Bug size={22} aria-hidden="true"/></div>
      <div className="handbook-example"><h3>{handbook.example.title}</h3><p>{handbook.example.explanation} <References ids={handbook.example.sourceIds} handbook={handbook}/></p>
        <div className="handbook-code"><div><span>{handbook.example.language} · illustrative example</span><button onClick={copy} aria-label="Copy handbook example">{copyState === 'copied' ? <Check size={15} aria-hidden="true"/> : <Copy size={15} aria-hidden="true"/>}{copyState === 'copied' ? 'Copied' : 'Copy'}</button></div><pre tabIndex={0} aria-label="Illustrative service example"><code>{handbook.example.code}</code></pre></div>
        <p className="handbook-copy-status" role="status">{copyState === 'failed' ? 'Clipboard unavailable. Select and copy the example text.' : copyState === 'copied' ? 'Example copied to clipboard.' : ''}</p>
        <h4>What to verify</h4><ul className="handbook-checks">{handbook.example.checks.map(check => <li key={check}>{check}</li>)}</ul>
      </div>
      <div className="handbook-subsection"><h3>Diagnose a failure</h3><div className="handbook-diagnostics">{handbook.troubleshooting.map((item, index) => <article key={item.symptom}>
        <div className="handbook-diagnostic-title"><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h4>{item.symptom}</h4></div>
        <dl><div><dt>Likely cause</dt><dd>{item.likelyCause}</dd></div><div><dt>Check the evidence</dt><dd>{item.check}</dd></div><div><dt>Next action</dt><dd>{item.resolution}</dd></div></dl><References ids={item.sourceIds} handbook={handbook}/>
      </article>)}</div></div>
      <div className="handbook-subsection"><h3>Common misconceptions</h3><Notes items={handbook.pitfalls} handbook={handbook}/></div>
      <details className="handbook-sources"><summary>Primary references for this handbook ({handbook.sources.length})</summary><ol>{handbook.sources.map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<ArrowUpRight size={13} aria-hidden="true"/></a><small>Checked {source.verified}</small></li>)}</ol></details>
    </section>
  </div>;
}
