// @vitest-environment jsdom
import React from 'react';
import {afterEach,describe,it,expect,vi} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import ServicePracticePanel from './ServicePracticePanel';
import {getServiceExercise,serviceExercises} from './serviceExercises';

afterEach(()=>{cleanup();vi.restoreAllMocks();localStorage.clear()});
describe('standalone service practice panel',()=>{
 it('checks and repairs a synthetic function case without writing storage or opening the canvas',()=>{
  const saved='{"sentinel":"personal architecture"}';localStorage.setItem('aws-playground-workspace-v3',saved);
  const writes=vi.spyOn(Storage.prototype,'setItem'),open=vi.fn();
  render(<ServicePracticePanel serviceId="lambda" onOpenLab={open}/>);
  expect(open).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button',{name:'Check this example'}));expect(screen.getByRole('heading',{name:'The local example needs a repair'})).toBeTruthy();
  fireEvent.click(screen.getByLabelText('Function role may write the example table'));
  expect(screen.queryByRole('status')).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'Check this example'}));expect(screen.getByRole('heading',{name:'No blocking finding within this lesson'})).toBeTruthy();
  expect(writes).not.toHaveBeenCalled();expect(localStorage.getItem('aws-playground-workspace-v3')).toBe(saved);expect(open).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button',{name:'Open architecture lab'}));expect(open).toHaveBeenCalledExactlyOnceWith('lambda');
 });
 it('resets local values and results when navigating between services',()=>{
  const {rerender}=render(<ServicePracticePanel serviceId="lambda"/>);
  fireEvent.change(screen.getByLabelText('Function timeout (seconds)'),{target:{value:'9'}});
  fireEvent.click(screen.getByRole('button',{name:'Check this example'}));
  rerender(<ServicePracticePanel serviceId="api"/>);expect(screen.queryByRole('status')).toBeNull();expect((screen.getByLabelText('Sample request path') as HTMLInputElement).value).toBe('/practice');
  rerender(<ServicePracticePanel serviceId="lambda"/>);expect((screen.getByLabelText('Function timeout (seconds)') as HTMLInputElement).value).toBe('3');expect((screen.getByLabelText('Function role may write the example table') as HTMLInputElement).checked).toBe(false);
 });
 it('keeps malformed local drafts editable and exposes bounded findings',()=>{
  render(<ServicePracticePanel serviceId="lambda"/>);
  fireEvent.change(screen.getByLabelText('Function timeout (seconds)'),{target:{value:''}});
  fireEvent.click(screen.getByRole('button',{name:'Check this example'}));expect(screen.getByText('Check Function timeout')).toBeTruthy();
  expect((screen.getByLabelText('Function timeout (seconds)') as HTMLInputElement).value).toBe('');
  fireEvent.click(screen.getByRole('button',{name:'Reset exercise'}));expect(screen.queryByRole('status')).toBeNull();
 });
 it('reveals worked reasoning separately and loads a repair only into the local exercise',()=>{
  render(<ServicePracticePanel serviceId="cloudwatch"/>);
  expect((screen.getByLabelText('Notification destination permitted') as HTMLInputElement).checked).toBe(false);
  fireEvent.click(screen.getByRole('button',{name:'Show worked reasoning'}));expect(screen.getByRole('heading',{name:'Worked reasoning for the supplied case'})).toBeTruthy();
  expect((screen.getByLabelText('Notification destination permitted') as HTMLInputElement).checked).toBe(false);
  fireEvent.click(screen.getByRole('button',{name:'Load worked repair into this exercise'}));expect((screen.getByLabelText('Notification destination permitted') as HTMLInputElement).checked).toBe(true);
  expect(screen.queryByRole('status')).toBeNull();
 });
 it('requires the complete multiple-response set and resets answer state on service changes',()=>{
  const exercise=getServiceExercise('private-ca')!;if(exercise.kind!=='decision')throw new Error('Expected decision exercise');
  const {question}=exercise,{rerender}=render(<ServicePracticePanel serviceId="private-ca"/>);
  const correct=question.options.filter(option=>question.correctOptionIds.includes(option.id));
  fireEvent.click(screen.getByLabelText(correct[0].text));fireEvent.click(screen.getByRole('button',{name:'Check answer'}));expect(screen.getByRole('heading',{name:'Review the deciding distinction'})).toBeTruthy();
  fireEvent.click(screen.getByLabelText(correct[1].text));expect(screen.queryByRole('status')).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'Check answer'}));expect(screen.getByRole('heading',{name:'Correct for the stated scenario'})).toBeTruthy();
  rerender(<ServicePracticePanel serviceId="sam"/>);expect(screen.queryByRole('status')).toBeNull();expect((screen.getByRole('button',{name:'Check answer'}) as HTMLButtonElement).disabled).toBe(true);
 });
 it('renders and explains an answer for every additional service without needing a graph',()=>{
  for(const exercise of serviceExercises){if(exercise.kind!=='decision')continue;
   const {unmount}=render(<ServicePracticePanel serviceId={exercise.serviceId}/>);
   for(const id of exercise.question.correctOptionIds)fireEvent.click(screen.getByLabelText(exercise.question.options.find(option=>option.id===id)!.text));
   fireEvent.click(screen.getByRole('button',{name:'Check answer'}));expect(screen.getByRole('heading',{name:'Correct for the stated scenario'})).toBeTruthy();
   expect(screen.getByText('This answer is local to this exercise. It is not saved as an independent practice attempt.')).toBeTruthy();unmount();
  }
 });
 it('reports an unknown service without offering an invented exercise',()=>{render(<ServicePracticePanel serviceId="unknown"/>);expect(screen.getByRole('heading',{name:'Practice unavailable'})).toBeTruthy();expect(screen.queryByRole('button')).toBeNull()});
});
