import {useCallback,useEffect,useState} from 'react';
import {normalizeRoute,parseAppRoute,routeUrl,type AppRoute} from './appRoutes';
export default function useAppRoute(){
 const [route,setRoute]=useState(()=>parseAppRoute(new URL(window.location.href)));
 useEffect(()=>{const read=()=>{const next=parseAppRoute(new URL(window.location.href));const url=routeUrl(next);if(url.href!==location.href)history.replaceState(history.state,'',url);setRoute(next)};read();window.addEventListener('popstate',read);window.addEventListener('hashchange',read);return()=>{window.removeEventListener('popstate',read);window.removeEventListener('hashchange',read)}},[]);
 const navigate=useCallback((next:AppRoute,replace=false)=>{const normalized=normalizeRoute(next),url=routeUrl(normalized);if(url.href!==location.href){if(replace)history.replaceState(history.state,'',url);else history.pushState({},'',url)}setRoute(normalized)},[]);
 return [route,navigate] as const;
}
