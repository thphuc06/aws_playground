import {useEffect,useRef} from 'react';
import {EditorView,basicSetup} from 'codemirror';
import {EditorState} from '@codemirror/state';
import {json} from '@codemirror/lang-json';
import {yaml} from '@codemirror/lang-yaml';
export default function ConfigurationDocumentEditor({value,onChange,format='json',label='Configuration document',readOnly=false}:{value:string;onChange:(value:string)=>void;format?:'json'|'yaml';label?:string;readOnly?:boolean}){
 const host=useRef<HTMLDivElement|null>(null),editor=useRef<EditorView|null>(null),callback=useRef(onChange);callback.current=onChange;
 useEffect(()=>{if(!host.current)return;const view=new EditorView({parent:host.current,state:EditorState.create({doc:value,extensions:[basicSetup,format==='yaml'?yaml():json(),EditorView.lineWrapping,EditorState.readOnly.of(readOnly),EditorView.contentAttributes.of({'aria-label':label}),EditorView.updateListener.of(update=>{if(update.docChanged)callback.current(update.state.doc.toString())})]})});editor.current=view;return()=>{editor.current=null;view.destroy()}},[format,readOnly,label]);
 useEffect(()=>{const view=editor.current;if(view&&view.state.doc.toString()!==value)view.dispatch({changes:{from:0,to:view.state.doc.length,insert:value}})},[value]);
 return <div className="config-document-editor" ref={host}/>;
}
