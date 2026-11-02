// @vitest-environment jsdom
import {afterEach,it,expect} from 'vitest';
import {act,cleanup,renderHook,waitFor} from '@testing-library/react';
import {IDBFactory} from 'fake-indexeddb';
import {openLocalRepository} from '../workspaceDatabase';
import {LEARNING_RECORD_KEY,loadLearningProgress,saveLearningProgress} from './learningRepository';
import {questionBank} from './questionRegistry';
import {createLearningSession,submitSessionAnswer} from './sessionEngine';
import {useLearningPreferences,applyPreferenceChange,preferenceChange,preferencesFromLearning} from './useLearningPreferences';
import {emptyLearningProgress,type LearningProgress} from './questionTypes';
afterEach(()=>{cleanup();localStorage.clear()});
it('retries a concurrent practice save and preserves its attempts while adding a bookmark',async()=>{
 const idb=new IDBFactory(),external=await openLocalRepository(idb,'preferences-race');await loadLearningProgress(external,{getItem:()=>null});let raced=false;
 const factory=async()=>{const repo=await openLocalRepository(idb,'preferences-race');return {...repo,commit:async(mutations:Parameters<typeof repo.commit>[0])=>{
  if(!raced&&mutations.some(m=>(m.value as LearningProgress).bookmarks?.includes('dev-lambda'))){raced=true;const current=(await external.read<LearningProgress>(LEARNING_RECORD_KEY))!;const question=questionBank.find(q=>q.examVersions.includes('DVA-C03'))!;let learning:LearningProgress={...current.value,sessions:[createLearningSession([question],'DVA-C03','learn',5,'concurrent-practice')]};learning=submitSessionAnswer(learning,'concurrent-practice',question.correctOptionIds);await saveLearningProgress(external,current,learning);}
  return repo.commit(mutations);
 }}};
 const {result}=renderHook(()=>useLearningPreferences({repositoryFactory:factory}));await waitFor(()=>expect(result.current.loading).toBe(false));
 act(()=>result.current.setProgress(p=>({...p,bookmarks:[...p.bookmarks,'dev-lambda']})));
 await waitFor(()=>{expect(result.current.dirty).toBe(false);expect(result.current.progress.bookmarks).toContain('dev-lambda')});
 const stored=(await external.read<LearningProgress>(LEARNING_RECORD_KEY))!.value;expect(raced).toBe(true);expect(stored.attempts).toHaveLength(1);expect(stored.sessions).toHaveLength(1);expect(stored.feedbackExposures).toHaveLength(1);expect(stored.bookmarks).toEqual(['dev-lambda']);expect(result.current.error).toBe('');external.close();
});
it('serializes rapid reading changes and leaves raw legacy data untouched',async()=>{
 const raw=JSON.stringify({version:1,read:['iam'],bookmarks:[],missions:[],checks:['iam0']});localStorage.setItem('aws-playground-progress',raw);const idb=new IDBFactory(),factory=()=>openLocalRepository(idb,'preferences-rapid');
 const {result}=renderHook(()=>useLearningPreferences({repositoryFactory:factory}));await waitFor(()=>expect(result.current.loading).toBe(false));
 act(()=>{result.current.setProgress(p=>({...p,bookmarks:[...p.bookmarks,'dev-lambda']}));result.current.setProgress(p=>({...p,read:[...p.read,'dev-objects']}));result.current.setProgress(p=>({...p,missions:[...p.missions,'queue']}));});
 await waitFor(()=>expect(result.current.dirty).toBe(false));expect(result.current.progress).toEqual({version:1,read:['iam','dev-objects'],bookmarks:['dev-lambda'],missions:['queue'],checks:['iam0']});expect(localStorage.getItem('aws-playground-progress')).toBe(raw);
});
it('retains failed reading changes, guards unload, exports them and retries without losing practice',async()=>{
 const idb=new IDBFactory();let fail=false;const factory=async()=>{const repo=await openLocalRepository(idb,'preferences-quota');return {...repo,commit:async(mutations:Parameters<typeof repo.commit>[0])=>{if(fail)throw new Error('Quota exceeded');return repo.commit(mutations)}}};
 const {result}=renderHook(()=>useLearningPreferences({repositoryFactory:factory}));await waitFor(()=>expect(result.current.loading).toBe(false));fail=true;
 act(()=>result.current.setProgress(p=>({...p,bookmarks:['unsaved-bookmark']})));await waitFor(()=>expect(result.current.error).toBe('Quota exceeded'));expect(result.current.pending).toBe(false);expect(result.current.dirty).toBe(true);expect(JSON.parse(result.current.exportRecovery()).learning.bookmarks).toEqual(['unsaved-bookmark']);
 const event=new Event('beforeunload',{cancelable:true});window.dispatchEvent(event);expect(event.defaultPrevented).toBe(true);const repo=await openLocalRepository(idb,'preferences-quota');expect((await repo.read<LearningProgress>(LEARNING_RECORD_KEY))!.value.bookmarks).toEqual([]);fail=false;
 await act(async()=>{await result.current.retry()});await waitFor(()=>expect(result.current.dirty).toBe(false));expect(result.current.error).toBe('');expect((await repo.read<LearningProgress>(LEARNING_RECORD_KEY))!.value.bookmarks).toEqual(['unsaved-bookmark']);repo.close();
});
it('refreshes external changes on the shared event and window focus',async()=>{
 const idb=new IDBFactory(),factory=()=>openLocalRepository(idb,'preferences-refresh'),{result}=renderHook(()=>useLearningPreferences({repositoryFactory:factory}));await waitFor(()=>expect(result.current.loading).toBe(false));const repo=await factory();let record=(await repo.read<LearningProgress>(LEARNING_RECORD_KEY))!;
 await act(async()=>{await saveLearningProgress(repo,record,{...record.value,bookmarks:['event-bookmark']})});await waitFor(()=>expect(result.current.progress.bookmarks).toEqual(['event-bookmark']));record=(await repo.read<LearningProgress>(LEARNING_RECORD_KEY))!;await repo.commit([{key:LEARNING_RECORD_KEY,value:{...record.value,read:['focus-read']},expectedRevision:record.revision}]);
 act(()=>window.dispatchEvent(new Event('focus')));await waitFor(()=>expect(result.current.progress.read).toEqual(['focus-read']));repo.close();
});
it('applies only reading deltas, keeping concurrent flags and historical evidence through reset',()=>{
 const before={...emptyLearningProgress(),read:['old'],bookmarks:['old-bookmark'],legacyAcknowledgements:[{legacyKey:'iam0',questionId:'chapter:iam:001',provenance:'exam-and-time-unknown' as const}]};const question=questionBank.find(q=>q.examVersions.includes('DVA-C03'))!;let learning:LearningProgress={...before,sessions:[createLearningSession([question],'DVA-C03','learn',5,'history')]};learning=submitSessionAnswer(learning,'history',question.correctOptionIds);
 const preferences=preferencesFromLearning(before),change=preferenceChange(preferences,{version:1,read:[],bookmarks:[],missions:[],checks:[]});const merged=applyPreferenceChange({...learning,bookmarks:['old-bookmark','concurrent-bookmark']},change);
 expect(merged.read).toEqual([]);expect(merged.bookmarks).toEqual(['concurrent-bookmark']);expect(merged.attempts).toEqual(learning.attempts);expect(merged.legacyAcknowledgements).toEqual(before.legacyAcknowledgements);
});
it('preserves corrupt legacy data and exports pending flags without creating replacement progress',async()=>{
 localStorage.setItem('aws-playground-progress','{broken');const idb=new IDBFactory(),factory=()=>openLocalRepository(idb,'preferences-corrupt'),{result}=renderHook(()=>useLearningPreferences({repositoryFactory:factory}));await waitFor(()=>expect(result.current.loading).toBe(false));expect(result.current.error).toContain('not valid JSON');
 act(()=>result.current.setProgress(p=>({...p,read:['pending-read']})));await waitFor(()=>expect(result.current.pending).toBe(false));expect(result.current.dirty).toBe(true);const recovery=JSON.parse(result.current.exportRecovery());expect(recovery.legacyRaw).toBe('{broken');expect(recovery.pendingReadingChanges[0].read.add).toEqual(['pending-read']);const repo=await factory();expect(await repo.read(LEARNING_RECORD_KEY)).toBeNull();expect(localStorage.getItem('aws-playground-progress')).toBe('{broken');repo.close();
});
