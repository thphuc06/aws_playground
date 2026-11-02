// @vitest-environment jsdom
import React from 'react';
import {afterEach,it,expect} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {IDBFactory} from 'fake-indexeddb';
import {openLocalRepository} from '../workspaceDatabase';
import PracticePage from './PracticePage';
import {LEARNING_RECORD_KEY} from './learningRepository';
import type {LearningProgress} from './questionTypes';
afterEach(()=>{cleanup();localStorage.clear()});
it('persists an explicit answer and resumes its pinned session after remount',async()=>{
 const idb=new IDBFactory(),factory=()=>openLocalRepository(idb,'page-resume');
 const first=render(<PracticePage exam="DVA-C03" onOpenChapter={()=>{}} repositoryFactory={factory}/>);
 await screen.findByText('Practice progress is saved in this browser.');
 fireEvent.click(screen.getByRole('button',{name:'Start a new practice session'}));
 await screen.findByText('Practice saved in this browser.');
 const radios=screen.getAllByRole('radio');fireEvent.click(radios[0]);
 const inspector=await factory();expect((await inspector.read<LearningProgress>(LEARNING_RECORD_KEY))!.value.attempts).toHaveLength(0);
 fireEvent.click(screen.getByRole('button',{name:'Submit answer'}));
 await waitFor(async()=>expect((await inspector.read<LearningProgress>(LEARNING_RECORD_KEY))!.value.attempts).toHaveLength(1));
 const saved=(await inspector.read<LearningProgress>(LEARNING_RECORD_KEY))!.value,question=saved.sessions[0].items[0].question.prompt;
 first.unmount();render(<PracticePage exam="DVA-C03" onOpenChapter={()=>{}} repositoryFactory={factory}/>);
 await screen.findByText('Practice progress is saved in this browser.');expect(screen.getByRole('heading',{name:question})).toBeTruthy();expect(screen.queryByRole('button',{name:'Submit answer'})).toBeNull();expect(screen.getByRole('button',{name:'Next question'})).toBeTruthy();inspector.close();
});
it('keeps temporary sessions visible after quota failure and never reports a successful save',async()=>{
 const idb=new IDBFactory();const factory=async()=>{const repo=await openLocalRepository(idb,'page-quota');let writes=0;return {...repo,commit:async(...args:Parameters<typeof repo.commit>)=>{writes++;if(writes>1)throw new DOMException('Quota exceeded','QuotaExceededError');return repo.commit(...args);}}};
 render(<PracticePage exam="DVA-C03" onOpenChapter={()=>{}} repositoryFactory={factory}/>);await screen.findByText('Practice progress is saved in this browser.');fireEvent.click(screen.getByRole('button',{name:'Start a new practice session'}));
 await screen.findByText('Quota exceeded');expect(screen.getByRole('alert').textContent).toContain('not saved');expect(screen.getAllByRole('radio').length).toBeGreaterThan(1);expect(screen.queryByText('Practice saved in this browser.')).toBeNull();expect(screen.getByRole('button',{name:'Export current practice'})).toBeTruthy();const stored=await openLocalRepository(idb,'page-quota');expect((await stored.read<LearningProgress>(LEARNING_RECORD_KEY))!.value.sessions).toEqual([]);stored.close();
});
it('preserves corrupt legacy data for raw recovery instead of replacing it',async()=>{
 localStorage.setItem('aws-playground-progress','{corrupt');const idb=new IDBFactory(),factory=()=>openLocalRepository(idb,'page-corrupt');render(<PracticePage exam="DVA-C03" onOpenChapter={()=>{}} repositoryFactory={factory}/>);
 await screen.findByRole('button',{name:'Export original recovery data'});expect(localStorage.getItem('aws-playground-progress')).toBe('{corrupt');const stored=await factory();expect(await stored.read(LEARNING_RECORD_KEY)).toBeNull();stored.close();
});
