import {useEffect,useRef,useState} from 'react';
interface Request {message:string;confirmLabel:string;action:()=>void}
/**
 * In-app replacement for window.confirm. Native dialogs make browsers leave
 * full screen, so unsaved-edit prompts render inside the focused workspace.
 *
 * guard() runs the action immediately when nothing needs confirming and
 * returns true; otherwise it asks, returns false, and runs the action only
 * after the user confirms. Guards reached while a confirmed action runs pass,
 * so nested checks do not ask twice.
 */
export function useConfirmGuard(){
 const [request,setRequest]=useState<Request|null>(null),approving=useRef(false);
 const guard=(needed:boolean,message:string,action:()=>void,confirmLabel='Discard changes'):boolean=>{
  if(!needed||approving.current){action();return true}
  setRequest({message,confirmLabel,action});return false;
 };
 const confirm=()=>{const current=request;setRequest(null);if(!current)return;approving.current=true;try{current.action()}finally{approving.current=false}};
 const dialog=request?<ConfirmDialog message={request.message} confirmLabel={request.confirmLabel} onConfirm={confirm} onCancel={()=>setRequest(null)}/>:null;
 return {guard,dialog,approving};
}
export default function ConfirmDialog({message,confirmLabel,onConfirm,onCancel}:{message:string;confirmLabel:string;onConfirm:()=>void;onCancel:()=>void}){
 const keep=useRef<HTMLButtonElement>(null),root=useRef<HTMLDivElement>(null);
 useEffect(()=>{const previous=document.activeElement as HTMLElement|null;keep.current?.focus({preventScroll:true});return()=>{if(previous?.isConnected)previous.focus({preventScroll:true})}},[]);
 return <div className="confirm-backdrop" onPointerDown={e=>{if(e.target===e.currentTarget)onCancel()}}>
  <div ref={root} className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-message"
   onKeyDown={e=>{
    // Handle Escape here so the workspace does not also leave full screen.
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();onCancel();return;}
    if(e.key==='Tab'){const buttons=Array.from(root.current?.querySelectorAll('button')??[]);const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}
   }}>
   <p id="confirm-dialog-message">{message}</p>
   <div className="confirm-actions"><button ref={keep} onClick={onCancel}>Keep editing</button><button className="confirm-danger" onClick={onConfirm}>{confirmLabel}</button></div>
  </div>
 </div>;
}
