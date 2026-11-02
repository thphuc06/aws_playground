import type {ReactNode} from 'react';
import {CircleHelp} from 'lucide-react';
import './focusWorkspace.css';
export default function ContextHelp({label='Help',children}:{label?:string;children:ReactNode}){return <details className="context-help" onKeyDown={e=>{if(e.key==='Escape'){e.currentTarget.open=false;e.currentTarget.querySelector('summary')?.focus();e.preventDefault();e.stopPropagation()}}}><summary aria-label={label} title={label}><CircleHelp size={16} strokeWidth={1.6} aria-hidden="true"/><span>{label}</span></summary><div className="context-help-content">{children}</div></details>}
