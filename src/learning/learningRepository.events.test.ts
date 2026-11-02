// @vitest-environment jsdom
import {it,expect} from 'vitest';
import type {LocalRepository} from '../workspaceDatabase';
import {LEARNING_PROGRESS_CHANGED_EVENT,LEARNING_RECORD_KEY,saveLearningProgress} from './learningRepository';
import {emptyLearningProgress} from './questionTypes';
it('announces only successful durable writes to reading controls in the same page',async()=>{
 const progress=emptyLearningProgress(),current={key:LEARNING_RECORD_KEY,value:progress,revision:1,updatedAt:new Date().toISOString()};let fail=false,events=0;
 const repository:LocalRepository={read:async()=>null,list:async()=>[],close:()=>{},commit:async()=>{if(fail)throw new Error('Quota exceeded');return [{...current,revision:2}]}};
 const listener=()=>events++;window.addEventListener(LEARNING_PROGRESS_CHANGED_EVENT,listener);
 try{await saveLearningProgress(repository,current,progress);expect(events).toBe(1);fail=true;await expect(saveLearningProgress(repository,current,progress)).rejects.toThrow('Quota exceeded');expect(events).toBe(1)}finally{window.removeEventListener(LEARNING_PROGRESS_CHANGED_EVENT,listener)}
});
