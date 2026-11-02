import {learningPaths} from './learning/services';
import type {ExamVersionId} from './examVersions';
export const learningPathStorageKey='aws-playground-learning-path-v1';
export function chooseLearningPath(storage:Pick<Storage,'getItem'|'setItem'>,exam:ExamVersionId,pathId:string){
 if(!learningPaths.some(p=>p.id===pathId&&p.examVersions.includes(exam)))return;
 let paths:Record<string,string>={};try{const prior=JSON.parse(storage.getItem(learningPathStorageKey)??'null');for(const key of ['DVA-C02','DVA-C03'])if(typeof prior?.paths?.[key]==='string')paths[key]=prior.paths[key]}catch{}
 storage.setItem(learningPathStorageKey,JSON.stringify({version:1,paths:{...paths,[exam]:pathId}}));
}
export function currentLearningPath(storage:Pick<Storage,'getItem'>,exam:ExamVersionId,chapterId:string){
 const candidates=learningPaths.filter(p=>p.examVersions.includes(exam)&&p.steps.some(s=>s.lessonId===chapterId));
 try{const saved=JSON.parse(storage.getItem(learningPathStorageKey)??'null');if(saved?.version===1)return candidates.find(p=>p.id===saved.paths?.[exam])??candidates[0]}catch{}
 return candidates[0];
}
