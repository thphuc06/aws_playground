// @vitest-environment jsdom
import React from 'react';
import {IDBFactory} from 'fake-indexeddb';
import {render,screen,fireEvent,waitFor,cleanup,within} from '@testing-library/react';
import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import {App} from './main';
import {parseAppRoute,routeUrl} from './appRoutes';
import {labDefinitions} from './learning/labs/definitions';
import {openLocalRepository} from './workspaceDatabase';
import {LEARNING_RECORD_KEY} from './learning/learningRepository';
import type {LearningProgress} from './learning/questionTypes';

beforeEach(()=>{vi.stubGlobal('indexedDB',new IDBFactory());localStorage.clear();vi.stubGlobal('matchMedia',()=>({matches:false,addEventListener:()=>{},removeEventListener:()=>{}}));vi.stubGlobal('scrollTo',vi.fn());vi.stubGlobal('confirm',vi.fn(()=>false));Element.prototype.scrollIntoView=vi.fn();});
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
it('roundtrips version-qualified practice and isolated lab links without leaking filter state into other views',()=>{
 const practice=parseAppRoute(new URL('https://study.example/?view=practice&exam=DVA-C03&skill=DVA-C03%3A2.1.5&service=ecs'));
 expect(parseAppRoute(routeUrl(practice,'https://study.example/'))).toEqual(practice);expect(practice).toMatchObject({skill:'DVA-C03:2.1.5',service:'ecs'});
 expect(parseAppRoute(new URL('https://study.example/?view=practice&exam=DVA-C02&skill=DVA-C03%3A2.1.5')).skill).toBeUndefined();
 expect(parseAppRoute(new URL('https://study.example/?view=labs&lab=api-authorization&service=lambda'))).toMatchObject({view:'labs',lab:'api-authorization',service:'lambda'});
 expect(parseAppRoute(new URL('https://study.example/?view=labs&lab=../../invalid')).lab).toBeUndefined();
 expect(parseAppRoute(new URL('https://study.example/?view=home&skill=DVA-C03%3A2.1.5&service=ecs&lab=api-authorization'))).not.toHaveProperty('skill');
});
it('keeps pinned question and selection while shareable practice filters change',async()=>{
 history.replaceState({},'','/?view=practice&exam=DVA-C03');render(<App/>);
 const skills=await screen.findByLabelText('Practice skill',{}, {timeout:10000});fireEvent.change(skills,{target:{value:'DVA-C03:2.1.5'}});
 expect(new URL(location.href).searchParams.get('skill')).toBe('DVA-C03:2.1.5');
 fireEvent.change(screen.getByLabelText('Practice service'),{target:{value:'ecs'}});expect(new URL(location.href).searchParams.get('service')).toBe('ecs');
 fireEvent.click(screen.getByRole('button',{name:'Start a new practice session'}));
 const question=await screen.findByRole('region',{name:'Practice question'}),heading=within(question).getByRole('heading').textContent;
 await waitFor(()=>expect(screen.queryByText('Practice saved in this browser.')).toBeTruthy());
 const answer=[...within(question).queryAllByRole('radio'),...within(question).queryAllByRole('checkbox')][0];fireEvent.click(answer);
 fireEvent.change(screen.getByLabelText('Practice service'),{target:{value:'lambda'}});
 expect(within(screen.getByRole('region',{name:'Practice question'})).getByRole('heading').textContent).toBe(heading);
 expect((answer as HTMLInputElement).checked).toBe(true);
 const repository=await openLocalRepository();try{expect((await repository.read<LearningProgress>(LEARNING_RECORD_KEY))?.value.attempts).toHaveLength(0);}finally{repository.close();}
},15000);
it('guards dirty lab navigation and leaves architecture storage unchanged',async()=>{
 const lab=labDefinitions.find(item=>item.id==='api-authorization')!;
 const original='{"private":"untouched architecture fixture"}';localStorage.setItem('aws-playground-builder-v1',original);
 history.replaceState({},'','/?view=labs&exam=DVA-C03&lab='+lab.id);render(<App/>);
 await screen.findByRole('heading',{name:lab.title});await screen.findByText('Lab saved locally');
 const field=lab.fields.find(item=>item.kind==='json')!,input=screen.getByLabelText(field.label) as HTMLTextAreaElement;
 fireEvent.change(input,{target:{value:input.value+' '}});await screen.findByText('Unsaved lab changes');
 fireEvent.click(screen.getByRole('button',{name:'Home overview'}));expect(window.confirm).toHaveBeenCalledTimes(1);expect(new URL(location.href).searchParams.get('lab')).toBe(lab.id);
 fireEvent.click(screen.getByRole('button',{name:'Save lab session'}));await screen.findByText('Lab saved locally');
 fireEvent.click(screen.getByRole('button',{name:'Home overview'}));await screen.findByRole('heading',{name:'Know the scope. Build understanding.'});
 expect(window.confirm).toHaveBeenCalledTimes(1);expect(localStorage.getItem('aws-playground-builder-v1')).toBe(original);
 const repository=await openLocalRepository();try{expect(await repository.list('workspace:')).toEqual([]);expect(await repository.list('lab-session:')).toHaveLength(1);}finally{repository.close();}
},15000);
