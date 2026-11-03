// @vitest-environment jsdom
import React from 'react';
import {afterEach,it,expect} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {IDBFactory} from 'fake-indexeddb';
import {openLocalRepository} from '../workspaceDatabase';
import PracticePage from './PracticePage';
import {LEARNING_RECORD_KEY,LEARNING_PROGRESS_CHANGED_EVENT,saveLearningProgress} from './learningRepository';
import {questionBank} from './questionRegistry';
import {createLearningSession,submitSessionAnswer,advanceSession} from './sessionEngine';
import {emptyLearningProgress} from './questionTypes';
import type {LearningProgress} from './questionTypes';
afterEach(()=>{cleanup();localStorage.clear()});
it('persists an explicit answer and resumes its pinned session after remount',async()=>{
 const idb=new IDBFactory(),factory=()=>openLocalRepository(idb,'page-resume');
 const first=render(<PracticePage exam="DVA-C03" onOpenChapter={()=>{}} repositoryFactory={factory}/>);
 await screen.findByText('Practice progress is saved in this browser.');
 fireEvent.click(screen.getByRole('button',{name:'Start a new practice session'}));
 await screen.findByText('Practice saved in this browser.');
 const choices=[...screen.queryAllByRole('radio'),...screen.queryAllByRole('checkbox')];expect(choices.length).toBeGreaterThan(1);fireEvent.click(choices[0]);
 const inspector=await factory();expect((await inspector.read<LearningProgress>(LEARNING_RECORD_KEY))!.value.attempts).toHaveLength(0);
 fireEvent.click(screen.getByRole('button',{name:'Submit answer'}));
 await waitFor(async()=>expect((await inspector.read<LearningProgress>(LEARNING_RECORD_KEY))!.value.attempts).toHaveLength(1));
 const saved=(await inspector.read<LearningProgress>(LEARNING_RECORD_KEY))!.value,question=saved.sessions[0].items[0].question.prompt;
 first.unmount();render(<PracticePage exam="DVA-C03" onOpenChapter={()=>{}} repositoryFactory={factory}/>);
 await screen.findByRole('heading',{name:question});expect(screen.queryByRole('button',{name:'Submit answer'})).toBeNull();await waitFor(()=>expect((screen.getByRole('button',{name:'Next question'}) as HTMLButtonElement).disabled).toBe(false));inspector.close();
});
it('keeps temporary sessions visible after quota failure and never reports a successful save',async()=>{
 const idb=new IDBFactory();const factory=async()=>{const repo=await openLocalRepository(idb,'page-quota');let writes=0;return {...repo,commit:async(...args:Parameters<typeof repo.commit>)=>{writes++;if(writes>1)throw new DOMException('Quota exceeded','QuotaExceededError');return repo.commit(...args);}}};
 const dirty:boolean[]=[];
 render(<PracticePage exam="DVA-C03" onOpenChapter={()=>{}} onDirtyChange={value=>dirty.push(value)} repositoryFactory={factory}/>);await screen.findByText('Practice progress is saved in this browser.');fireEvent.click(screen.getByRole('button',{name:'Start a new practice session'}));expect(dirty.at(-1)).toBe(true);
 await screen.findByText('Quota exceeded');expect(screen.getByRole('alert').textContent).toContain('not saved');expect(screen.queryAllByRole('radio').length+screen.queryAllByRole('checkbox').length).toBeGreaterThan(1);expect(screen.queryByText('Practice saved in this browser.')).toBeNull();expect(screen.getByRole('button',{name:'Export current practice'})).toBeTruthy();expect(dirty.at(-1)).toBe(true);const unload=new Event('beforeunload',{cancelable:true});window.dispatchEvent(unload);expect(unload.defaultPrevented).toBe(true);const stored=await openLocalRepository(idb,'page-quota');expect((await stored.read<LearningProgress>(LEARNING_RECORD_KEY))!.value.sessions).toEqual([]);stored.close();
});
it('preserves corrupt legacy data for raw recovery instead of replacing it',async()=>{
 localStorage.setItem('aws-playground-progress','{corrupt');const idb=new IDBFactory(),factory=()=>openLocalRepository(idb,'page-corrupt');render(<PracticePage exam="DVA-C03" onOpenChapter={()=>{}} repositoryFactory={factory}/>);
 await screen.findByRole('button',{name:'Export original recovery data'});expect(localStorage.getItem('aws-playground-progress')).toBe('{corrupt');const stored=await factory();expect(await stored.read(LEARNING_RECORD_KEY)).toBeNull();stored.close();
});
it('lets the route owner accept or cancel a chapter change without changing the filter first',async()=>{
 const idb=new IDBFactory(),factory=()=>openLocalRepository(idb,'chapter-routing'),requested:string[]=[];
 const props={exam:'DVA-C03' as const,onOpenChapter:()=>{},repositoryFactory:factory,onChapterChange:(id:string)=>{requested.push(id);return false}};
 const view=render(<PracticePage {...props}/>);await screen.findByText('Practice progress is saved in this browser.');fireEvent.change(screen.getByLabelText('Chapter'),{target:{value:'dev-lambda'}});expect(requested).toEqual(['dev-lambda']);expect((screen.getByLabelText('Chapter') as HTMLSelectElement).value).toBe('');view.rerender(<PracticePage {...props} initialChapter="dev-lambda"/>);await waitFor(()=>expect((screen.getByLabelText('Chapter') as HTMLSelectElement).value).toBe('dev-lambda'));
});
it('refreshes clean practice after a bookmark write instead of failing the next session save',async()=>{
 const idb=new IDBFactory(),factory=()=>openLocalRepository(idb,'page-reading-refresh');render(<PracticePage exam="DVA-C03" onOpenChapter={()=>{}} repositoryFactory={factory}/>);await screen.findByText('Practice progress is saved in this browser.');const repo=await factory(),current=(await repo.read<LearningProgress>(LEARNING_RECORD_KEY))!;
 await saveLearningProgress(repo,current,{...current.value,bookmarks:['external-bookmark']});
 // Give the read-only event refresh an observable completion before a new user action.
 await waitFor(async()=>{const latest=(await repo.read<LearningProgress>(LEARNING_RECORD_KEY))!;expect(latest.value.bookmarks).toEqual(['external-bookmark'])});
 fireEvent.click(screen.getByRole('button',{name:'Start a new practice session'}));await screen.findByText('Practice saved in this browser.');expect(screen.queryByRole('alert')).toBeNull();expect((await repo.read<LearningProgress>(LEARNING_RECORD_KEY))!.value.bookmarks).toEqual(['external-bookmark']);repo.close();
});
it('records a new actual exposure when opening completed feedback and clears dirty only after saving',async()=>{
 const idb=new IDBFactory(),factory=()=>openLocalRepository(idb,'page-reveal');const repo=await factory(),oldDate=new Date('2026-01-01T00:00:00.000Z'),question=questionBank.find(q=>q.examVersions.includes('DVA-C03'))!;
 let p:LearningProgress={...emptyLearningProgress(),sessions:[createLearningSession([question],'DVA-C03','mixed',5,'old-session',oldDate)]};p=advanceSession(submitSessionAnswer(p,'old-session',question.correctOptionIds,oldDate),'old-session',oldDate);await repo.commit([{key:LEARNING_RECORD_KEY,value:p,expectedRevision:null}]);
 const dirty:boolean[]=[];let changed=0;const listener=()=>changed++;window.addEventListener(LEARNING_PROGRESS_CHANGED_EVENT,listener);
 render(<PracticePage exam="DVA-C03" onOpenChapter={()=>{}} onDirtyChange={value=>dirty.push(value)} repositoryFactory={factory}/>);await screen.findByText('Practice progress is saved in this browser.');const before=Date.now();fireEvent.change(screen.getByLabelText('Saved practice session'),{target:{value:'old-session'}});
 await waitFor(async()=>{const value=(await repo.read<LearningProgress>(LEARNING_RECORD_KEY))!.value;expect(value.feedbackExposures.some(e=>Date.parse(e.revealedAt)>=before)).toBe(true)});await waitFor(()=>expect(dirty.at(-1)).toBe(false));expect(dirty).toContain(true);expect(changed).toBeGreaterThan(0);const unload=new Event('beforeunload',{cancelable:true});window.dispatchEvent(unload);expect(unload.defaultPrevented).toBe(false);window.removeEventListener(LEARNING_PROGRESS_CHANGED_EVENT,listener);repo.close();
});
