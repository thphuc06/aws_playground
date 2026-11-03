import {chapterNavigation as chapters} from './chapterNavigation';
import {canvasCatalog} from './serviceCatalog';
import type {ExamVersionId} from './examVersions';
export type AppView='home'|'learn'|'services'|'bookmarks'|'practice'|'labs'|'coverage'|'builder';
export interface AppRoute {view:AppView;exam:ExamVersionId;mission:'serverless'|'queue'|'deployment';chapter?:string;service?:string;skill?:string;lab?:string;section?:string}
export const supportsExam=(chapter:{examVersions?:readonly ExamVersionId[]},exam:ExamVersionId)=>(chapter.examVersions??['DVA-C02']).includes(exam);
/** Keep old chapter links, but never render one chapter while advertising another. */
export function parseAppRoute(url:URL):AppRoute {
 const p=url.searchParams,raw=p.get('chapter');
 const exam:ExamVersionId=p.get('exam')==='DVA-C02'||!p.has('exam')&&['iam','serverless','cicd'].includes(raw??'')?'DVA-C02':'DVA-C03';
 const requested=p.get('view'),view:AppView=requested==='explore'?'builder':['home','learn','services','bookmarks','practice','labs','coverage','builder'].includes(requested??'')?requested as AppView:'home';
 const mission=p.get('mission')==='queue'?'queue':p.get('mission')==='deployment'?'deployment':'serverless';
 const candidate=chapters.find(c=>c.id===raw&&supportsExam(c,exam));
 const chapter=raw?(candidate??chapters.find(c=>supportsExam(c,exam)))?.id:undefined;
 const requestedService=p.get('service'),service=canvasCatalog.some(s=>s.id===requestedService)?requestedService!:undefined;
 const requestedSkill=p.get('skill')??'',skill=requestedSkill.startsWith(exam+':')&&/^DVA-C0[23]:\d+\.\d+\.\d+$/.test(requestedSkill)?requestedSkill:undefined;
 const requestedLab=p.get('lab')??'',lab=/^[a-z0-9][a-z0-9-]{0,79}$/.test(requestedLab)?requestedLab:undefined;
 let section:string|undefined;try{const hash=decodeURIComponent(url.hash.slice(1));if(chapter&&chapters.find(c=>c.id===chapter)?.sections.some(s=>s.id===hash))section=hash}catch{}
 return {view,exam,mission,...(chapter?{chapter}:{}),...(service&&['services','practice','labs'].includes(view)?{service}:{}),...(skill&&view==='practice'?{skill}:{}),...(lab&&view==='labs'?{lab}:{}),...(section&&view==='learn'?{section}:{})};
}
export function routeUrl(route:AppRoute,base=window.location.href):URL {
 const url=new URL(base);url.search=new URLSearchParams({view:route.view,exam:route.exam,mission:route.mission,...(route.chapter?{chapter:route.chapter}:{}),...(route.service&&['services','practice','labs'].includes(route.view)?{service:route.service}:{}),...(route.skill&&route.view==='practice'?{skill:route.skill}:{}),...(route.lab&&route.view==='labs'?{lab:route.lab}:{})}).toString();url.hash=route.section&&route.view==='learn'?route.section:'';return url;
}
export function normalizeRoute(route:AppRoute):AppRoute {return parseAppRoute(routeUrl(route,'https://playground.invalid/'))}
