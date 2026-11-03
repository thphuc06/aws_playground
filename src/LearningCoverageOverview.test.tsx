// @vitest-environment jsdom
import React from 'react';
import {cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import LearningCoverageOverview from './LearningCoverageOverview';
import {labDefinitions} from './learning/labs/definitions';

beforeEach(()=>{localStorage.clear();localStorage.setItem('aws-playground-workspace-v3','personal-architecture-sentinel')});
afterEach(()=>{cleanup();vi.restoreAllMocks()});
it('shows independent inventories, filters the service matrix and only invokes requested navigation callbacks',()=>{
 const onService=vi.fn(),onPractice=vi.fn(),onLab=vi.fn();
 render(<LearningCoverageOverview exam="DVA-C03" onService={onService} onPractice={onPractice} onLab={onLab}/>);
 expect(screen.getByText(/58 of 58 services shown/)).toBeDefined();
 expect(screen.getByText(/bank contains 297 records/)).toBeDefined();
 expect(screen.getByText(/47 bounded configuration exercises and 11 decision exercises/)).toBeDefined();
 expect(screen.getByText(/18 editor configuration cases/)).toBeDefined();
 expect(screen.getByText(/not the current catalog size/)).toBeDefined();
 expect(onService).not.toHaveBeenCalled();expect(onPractice).not.toHaveBeenCalled();expect(onLab).not.toHaveBeenCalled();
 fireEvent.change(screen.getByRole('searchbox',{name:'Search learning coverage'}),{target:{value:'AWS Lambda'}});
 const matrix=within(screen.getByRole('region',{name:'Service learning coverage matrix'}));
 fireEvent.click(matrix.getByRole('button',{name:'AWS Lambda'}));expect(onService).toHaveBeenCalledWith('lambda');
 fireEvent.click(matrix.getByRole('button',{name:'Practice AWS Lambda'}));expect(onPractice).toHaveBeenCalledWith('lambda');
 const lab=labDefinitions.find(item=>item.serviceIds.includes('lambda')&&item.examVersions.includes('DVA-C03'))!;
 const labButton=matrix.getByRole('button',{name:lab.title,hidden:true});
 const disclosure=labButton.closest('details')!;fireEvent.click(disclosure.querySelector('summary')!);fireEvent.click(labButton);expect(onLab).toHaveBeenCalledWith(lab.id);
 expect(localStorage.getItem('aws-playground-workspace-v3')).toBe('personal-architecture-sentinel');
});

it('has real read-only service links when callbacks are unavailable and reports an empty filter without fake actions',()=>{
 render(<LearningCoverageOverview exam="DVA-C02"/>);
 fireEvent.click(screen.getByRole('checkbox',{name:'Only DVA-C02 named services'}));
 expect(screen.getByText(/47 of 58 services shown/)).toBeDefined();
 const matrix=within(screen.getByRole('region',{name:'Service learning coverage matrix'}));
 expect(matrix.getByRole('link',{name:'AWS Lambda'}).getAttribute('href')).toBe('?view=services&exam=DVA-C02&service=lambda');
 expect(matrix.queryByRole('button',{name:/Practice /})).toBeNull();
 fireEvent.change(screen.getByRole('searchbox',{name:'Search learning coverage'}),{target:{value:'no-such-service-fixture'}});
 expect(screen.getByText(/No matching services/)).toBeDefined();
 fireEvent.click(screen.getByRole('button',{name:'Clear coverage filters'}));
 expect(screen.getByText(/58 of 58 services shown/)).toBeDefined();
 expect(localStorage.getItem('aws-playground-workspace-v3')).toBe('personal-architecture-sentinel');
});
