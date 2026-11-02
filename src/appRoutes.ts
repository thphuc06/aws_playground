import {chapters} from './content';
import {canvasCatalog} from './serviceCatalog';
import type {ExamVersionId} from './examVersions';
export type AppView='home'|'learn'|'services'|'bookmarks'|'practice'|'coverage'|'builder';
export interface AppRoute {view:AppView;exam:ExamVersionId;mission:'serverless'|'queue'|'deployment';chapter?:string;service?:string;section?:string}
export const supportsExam=(chapter:typeof chapters[number],exam:ExamVersionId)=>(chapter.examVersions??['DVA-C02']).includes(exam);
/** Keep old chapter links, but never render one chapter while advertising another. */
export function parseAppRoute(url:URL):AppRoute {
 const p=url.searchParams,raw=p.get('chapter');
 const exam:ExamVersionId=p.get('exam')==='DVA-C02'||!p.has('exam')&&['iam','serverless','cicd'].includes(raw??'')?'DVA-C02':'DVA-C03';
 const requested=p.get('view'),view:AppView=requested==='explore'?'builder':['home','learn','services','bookmarks','practice','coverage','builder'].includes(requested??'')?requested as AppView:'home';
 const mission=p.get('mission')==='queue'?'queue':p.get('mission')==='deployment'?'deployment':'serverless';
 const candidate=chapters.find(c=>c.id===raw&&supportsExam(c,exam));
 const chapter=raw?(candidate??chapters.find(c=>supportsExam(c,exam)))?.id:undefined;
 const requestedService=p.get('service'),service=canvasCatalog.some(s=>s.id===requestedService)?requestedService!:undefined;
 let section:string|undefined;try{const hash=decodeURIComponent(url.hash.slice(1));if(chapter&&chapters.find(c=>c.id===chapter)?.sections.some(s=>s.id===hash))section=hash}catch{}
 return {view,exam,mission,...(chapter?{chapter}:{}),...(service&&view==='services'?{service}:{}),...(section&&view==='learn'?{section}:{})};
}
export function routeUrl(route:AppRoute,base=window.location.href):URL {
 const url=new URL(base);url.search=new URLSearchParams({view:route.view,exam:route.exam,mission:route.mission,...(route.chapter?{chapter:route.chapter}:{}),...(route.service&&route.view==='services'?{service:route.service}:{})}).toString();url.hash=route.section&&route.view==='learn'?route.section:'';return url;
}
export function normalizeRoute(route:AppRoute):AppRoute {return parseAppRoute(routeUrl(route,'https://playground.invalid/'))}
