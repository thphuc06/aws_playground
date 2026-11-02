import {useCallback,useEffect,useRef,useState} from 'react';
import {normalizeRoute,parseAppRoute,routeUrl,type AppRoute} from './appRoutes';
const historyIndexKey='awsPlaygroundRouteIndex';
const indexOf=(state:unknown)=>state&&typeof state==='object'&&Number.isSafeInteger((state as Record<string,unknown>)[historyIndexKey])?(state as Record<string,number>)[historyIndexKey]:undefined;
const stamped=(index:number)=>({...((history.state&&typeof history.state==='object')?history.state:{}),[historyIndexKey]:index});
export default function useAppRoute(beforeNavigate?:(next:AppRoute,current:AppRoute)=>boolean){
 const [route,setRoute]=useState(()=>parseAppRoute(new URL(window.location.href)));
 const guard=useRef(beforeNavigate);guard.current=beforeNavigate;
 const current=useRef({route,url:routeUrl(route).href,index:indexOf(history.state)??0}),restoring=useRef<number|null>(null);
 useEffect(()=>{
  history.replaceState(stamped(current.current.index),'',current.current.url);
  const read=()=>{
   const next=parseAppRoute(new URL(window.location.href)),url=routeUrl(next),index=indexOf(history.state);
   if(restoring.current!==null){if(index===restoring.current){restoring.current=null;history.replaceState(stamped(current.current.index),'',current.current.url)}return;}
   if(url.href!==current.current.url&&guard.current&&!guard.current(next,current.current.route)){
    const delta=index===undefined?0:current.current.index-index;
    if(delta){restoring.current=current.current.index;history.go(delta)}else history.replaceState(stamped(current.current.index),'',current.current.url);
    return;
   }
   const nextIndex=index??current.current.index+1;history.replaceState(stamped(nextIndex),'',url);current.current={route:next,url:url.href,index:nextIndex};setRoute(next);
  };
  window.addEventListener('popstate',read);window.addEventListener('hashchange',read);return()=>{window.removeEventListener('popstate',read);window.removeEventListener('hashchange',read)};
 },[]);
 const navigate=useCallback((next:AppRoute,replace=false)=>{
  const normalized=normalizeRoute(next),url=routeUrl(normalized);
  if(url.href!==current.current.url&&guard.current&&!guard.current(normalized,current.current.route))return false;
  const index=current.current.index+(replace||url.href===current.current.url?0:1);
  if(url.href!==location.href){if(replace)history.replaceState(stamped(index),'',url);else history.pushState({[historyIndexKey]:index},'',url)}
  current.current={route:normalized,url:url.href,index};setRoute(normalized);return true;
 },[]);
 return [route,navigate] as const;
}
