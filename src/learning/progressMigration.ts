import {legacyQuestionAliases} from './legacyQuestionAliases';
import {emptyLearningProgress,type LearningProgress} from './questionTypes';
export const LEGACY_PROGRESS_KEY='aws-playground-progress';
export function migrateLegacyProgress(raw:string|null):LearningProgress {
 const empty=emptyLearningProgress();if(raw===null)return empty;
 let parsed:unknown;try{parsed=JSON.parse(raw);}catch{throw new Error('Saved learning progress is not valid JSON. Export the raw data before recovery.');}
 if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw new Error('Saved learning progress has an unsupported shape.');
 const p=parsed as Record<string,unknown>;
 if(p.version!==1||!['read','bookmarks','missions','checks'].every(k=>Array.isArray(p[k])&&(p[k] as unknown[]).every(v=>typeof v==='string')))throw new Error('Saved learning progress uses an unsupported version or value.');
 return {...empty,read:[...new Set(p.read as string[])],bookmarks:[...new Set(p.bookmarks as string[])],missions:[...new Set(p.missions as string[])],legacyRaw:raw,
 legacyAcknowledgements:[...new Set(p.checks as string[])].map(legacyKey=>({legacyKey,questionId:legacyQuestionAliases.find(a=>a.legacyKey===legacyKey)?.questionId,provenance:'exam-and-time-unknown'}))};
}
