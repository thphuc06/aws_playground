import type {RecoveryPayload} from './workspaceRepository';
import {downloadWorkspaceText} from './WorkspaceTransfer';
import './workspaceTransfer.css';
export default function WorkspaceRecovery({message,payloads,onRetry}:{message:string;payloads:RecoveryPayload[];onRetry?:()=>void}){
 return <section className="workspace-recovery" aria-label="Workspace recovery"><h2>Workspace recovery needed</h2><p role="alert">{message}</p><p>Your existing data has not been cleared or replaced. Download the readable original bytes before attempting a repair. A raw recovery file can contain invalid JSON; exporting it does not fix it.</p><div>{payloads.map((payload,i)=><button key={payload.label} onClick={()=>downloadWorkspaceText(payload.raw,'workspace-recovery-'+i+'.json')}>Download raw backup: {payload.label}</button>)}</div>{!payloads.length&&<p>No stored bytes could be read. Browser storage may be blocked; retry after restoring access.</p>}{onRetry&&<button onClick={onRetry}>Retry reading workspace</button>}<p>Use “Preview a backup” below to import a known-good file as a separate workspace. A failed import never overwrites the old record.</p></section>;
}
