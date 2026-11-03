import {useState,useRef,useEffect} from 'react';
import {Search,X} from 'lucide-react';
import type {LearningSearchResult} from './learningSearch';
import type {ExamVersionId} from './examVersions';
export default function GlobalLearningSearch({exam,onOpen}:{exam:ExamVersionId;onOpen:(result:LearningSearchResult)=>void}){
 const [query,setQuery]=useState(''),[active,setActive]=useState(-1),[open,setOpen]=useState(false);const input=useRef<HTMLInputElement>(null);
 const key=exam+'\0'+query;
 const [searchState,setSearchState]=useState<{key:string;results:LearningSearchResult[];error:boolean}>({key:'',results:[],error:false});
 const results=searchState.key===key?searchState.results:[],loading=!!query.trim()&&searchState.key!==key;
 useEffect(()=>setActive(-1),[exam]);
 useEffect(()=>{
  let current=true;
  if(query.trim())void import('./learningSearch').then(module=>{if(current)setSearchState({key,results:module.searchLearning(query,exam),error:false});}).catch(()=>{if(current)setSearchState({key,results:[],error:true});});
  return()=>{current=false;};
 },[query,exam,key]);
 const choose=(result:LearningSearchResult)=>{setQuery('');setOpen(false);setActive(-1);onOpen(result)};
 return <div className="search-wrap learning-global-search" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false)}}><Search size={16}/><input ref={input} role="combobox" aria-label="Search lessons, sections and services" aria-expanded={open&&!!query.trim()} aria-controls="learning-search-results" aria-autocomplete="list" aria-activedescendant={active>=0&&results[active]?'search-result-'+results[active].id:undefined} placeholder="Search lessons or services…" value={query} onFocus={()=>setOpen(true)} onChange={e=>{setQuery(e.target.value);setActive(-1);setOpen(true)}} onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);setActive(-1);e.stopPropagation()}else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();setOpen(true);setActive(i=>results.length?(i+(e.key==='ArrowDown'?1:-1)+results.length)%results.length:-1)}else if(e.key==='Enter'&&open&&active>=0&&results[active]){e.preventDefault();choose(results[active])}}}/>{query&&<button className="icon-button" aria-label="Clear search" onClick={()=>{setQuery('');setActive(-1);input.current?.focus()}}><X size={13}/></button>}{open&&query.trim()&&<div className="search-results"><div id="learning-search-results" role="listbox" aria-label="Search results" aria-busy={loading}>{results.map((r,i)=><button id={'search-result-'+r.id} role="option" aria-selected={active===i} tabIndex={-1} key={r.id} onMouseDown={e=>e.preventDefault()} onClick={()=>choose(r)}><span><small>{r.kind}</small><strong>{r.title}</strong><small>{r.context}</small></span></button>)}</div><p role="status">{loading?'Loading search…':searchState.key===key&&searchState.error?'Search could not load. Check your connection and try another search.':results.length?`${results.length} results · ${exam} lessons and all service references`:'No matches. Try a service name, IAM or retries.'}</p></div>}</div>;
}
