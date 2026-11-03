import {chapterNavigation as chapters} from './chapterNavigation';
import {supportsExam} from './appRoutes';
import type {ExamVersionId} from './examVersions';
export const readerStorageKey='aws-playground-reader-v1';
export interface ReadingPosition {chapter:string;section?:string}
export type ReaderState={version:1;positions:Partial<Record<ExamVersionId,ReadingPosition>>};
export function readReaderState(storage:Pick<Storage,'getItem'>):ReaderState {
 try{const value=JSON.parse(storage.getItem(readerStorageKey)??'null');if(value?.version!==1)return {version:1,positions:{}};const positions:ReaderState['positions']={};for(const exam of ['DVA-C02','DVA-C03'] as const){const p=value.positions?.[exam],c=chapters.find(c=>c.id===p?.chapter&&supportsExam(c,exam));if(c)positions[exam]={chapter:c.id,...(c.sections.some(s=>s.id===p.section)?{section:p.section}:{})}}return {version:1,positions}}catch{return {version:1,positions:{}}}
}
export function saveReadingPosition(storage:Pick<Storage,'getItem'|'setItem'>,exam:ExamVersionId,position:ReadingPosition){const state=readReaderState(storage);state.positions[exam]=position;storage.setItem(readerStorageKey,JSON.stringify(state));return state}
