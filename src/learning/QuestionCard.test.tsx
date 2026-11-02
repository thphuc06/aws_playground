// @vitest-environment jsdom
import React from 'react';
import {afterEach,it,expect,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import QuestionCard from './QuestionCard';
import type {StudyQuestion} from './questionTypes';
afterEach(cleanup);
const question:StudyQuestion={id:'ui:multi',revision:1,examVersions:['DVA-C03'],skillRefs:[],chapterIds:[],serviceIds:[],kind:'multiple-response',prompt:'Choose both permissions.',options:[{id:'a',text:'Trust policy'},{id:'b',text:'Caller policy'},{id:'c',text:'No policy'}],correctOptionIds:['a','b'],explanation:'Both boundaries matter.',sourceUrls:[],origin:'authored'};
it('uses accessible checkboxes and submits the selected set only on explicit Submit',()=>{const submit=vi.fn();render(<QuestionCard question={question} optionOrder={['c','b','a']} busy={false} reveal onSubmit={submit}/>);fireEvent.click(screen.getByLabelText('Trust policy'));fireEvent.click(screen.getByLabelText('Caller policy'));expect(submit).not.toHaveBeenCalled();fireEvent.click(screen.getByRole('button',{name:'Submit answer'}));expect(submit).toHaveBeenCalledWith(['a','b']);expect(screen.getAllByRole('checkbox')).toHaveLength(3)});
it('hides mixed-mode explanations after submission and keeps the recorded choices',()=>{render(<QuestionCard question={question} optionOrder={['c','b','a']} busy={false} reveal={false} onSubmit={()=>{}} attempt={{id:'s:0',sessionId:'s',exam:'DVA-C03',questionId:question.id,questionRevision:1,skillRefs:[],selectedOptionIds:['c'],optionOrder:['c','b','a'],submittedAt:new Date().toISOString(),outcome:'incorrect',assistance:'none'}}/>);expect(screen.queryByText('Both boundaries matter.')).toBeNull();expect((screen.getByLabelText('No policy') as HTMLInputElement).checked).toBe(true);expect(screen.queryByRole('button',{name:'Submit answer'})).toBeNull();expect(screen.getByRole('status').textContent).toContain('finish')});
