// @vitest-environment jsdom
import React, {useState} from 'react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {canvasCatalog} from './serviceCatalog';
import {getServiceDeepDive} from './serviceDeepDives';
import ServiceLibrary from './ServiceLibrary';

// Exercise the actual reference navigation and new field notes; these independent
// configuration/exercise components have their own integration tests.
vi.mock('./ServiceConfigurationReference', () => ({default: () => <div>Configuration reference fixture</div>}));
vi.mock('./learning/ServicePracticePanel', () => ({default: () => <div>Practice fixture</div>}));

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('scrollTo', vi.fn());
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => {cleanup(); vi.unstubAllGlobals();});

describe('service reference preview interactions', () => {
  it('restores filters and focus after opening a guide and returning without touching saved architecture', () => {
    const add = vi.fn();
    const sentinel = JSON.stringify({original: 'saved architecture fixture'});
    localStorage.setItem('aws-playground-workspace-v3', sentinel);
    function LibraryHarness() {
      const [selected, setSelected] = useState<string>();
      return <ServiceLibrary exam="DVA-C03" selected={selected} onOpen={setSelected} onAdd={add} onChapter={() => {}}/>;
    }
    render(<LibraryHarness/>);
    fireEvent.change(screen.getByLabelText('Category'), {target: {value: 'Compute'}});
    fireEvent.change(screen.getByLabelText('Search service references'), {target: {value: 'Lambda'}});
    expect(screen.getByRole('status').textContent).toContain('1 service');
    fireEvent.click(screen.getByRole('button', {name: 'Read AWS Lambda guide'}));
    expect(document.activeElement).toBe(screen.getByRole('heading', {level: 1, name: 'AWS Lambda'}));
    expect(screen.getByText(getServiceDeepDive('lambda')!.mentalModel)).toBeDefined();
    expect(localStorage.getItem('aws-playground-workspace-v3')).toBe(sentinel);
    expect(add).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', {name: 'All service references'}));
    expect((screen.getByLabelText('Category') as HTMLSelectElement).value).toBe('Compute');
    expect((screen.getByLabelText('Search service references') as HTMLInputElement).value).toBe('Lambda');
    expect(document.activeElement).toBe(screen.getByRole('heading', {level: 1}));
    fireEvent.click(screen.getByRole('button', {name: 'Clear filters'}));
    expect(screen.getByText('58 services')).toBeDefined();
    expect(localStorage.getItem('aws-playground-workspace-v3')).toBe(sentinel);
  });

  it('separates selected-exam services from additional references and resets an empty search', () => {
    const props = {onOpen: vi.fn(), onAdd: vi.fn(), onChapter: vi.fn()};
    const {rerender} = render(<ServiceLibrary exam="DVA-C03" {...props}/>);
    fireEvent.change(screen.getByLabelText('Exam scope'), {target: {value: 'exam'}});
    expect(screen.getByText('56 services')).toBeDefined();
    rerender(<ServiceLibrary exam="DVA-C02" {...props}/>);
    expect(screen.getByText('47 services')).toBeDefined();
    rerender(<ServiceLibrary exam="DVA-C03" {...props}/>);
    fireEvent.change(screen.getByLabelText('Exam scope'), {target: {value: 'additional'}});
    expect(screen.getByText('2 services')).toBeDefined();
    expect(screen.getByRole('button', {name: 'Read AWS AppSync guide'})).toBeDefined();
    expect(screen.getByRole('button', {name: 'Read Amazon Q Developer guide'})).toBeDefined();
    fireEvent.change(screen.getByLabelText('Search service references'), {target: {value: 'no-such-service-fixture'}});
    expect(screen.getByRole('heading', {name: 'No matching services'})).toBeDefined();
    fireEvent.click(screen.getAllByRole('button', {name: 'Clear filters'})[0]);
    expect(screen.getByText('58 services')).toBeDefined();
    expect(props.onAdd).not.toHaveBeenCalled();
  });

  it('navigates alternatives and section headings but only adds a service after the explicit canvas action', () => {
    const open = vi.fn(), add = vi.fn();
    const {rerender} = render(<ServiceLibrary exam="DVA-C03" selected="lambda" onOpen={open} onAdd={add} onChapter={() => {}}/>);
    const decision = screen.getByRole('region', {name: 'How to think about it'});
    const alternativeId = getServiceDeepDive('lambda')!.decision.alternativeIds[0];
    const alternativeName = canvasCatalog.find(service => service.id === alternativeId)!.name;
    fireEvent.click(within(decision).getByRole('button', {name: alternativeName}));
    expect(open).toHaveBeenCalledWith(alternativeId);
    expect(add).not.toHaveBeenCalled();
    fireEvent.click(within(screen.getByRole('navigation', {name: 'On this service page'})).getByRole('button', {name: /Cost & operations/}));
    expect(document.activeElement).toBe(screen.getByRole('heading', {name: 'Cost & operational checks'}));
    rerender(<ServiceLibrary exam="DVA-C03" selected="sqs" onOpen={open} onAdd={add} onChapter={() => {}}/>);
    expect(document.activeElement).toBe(screen.getByRole('heading', {level: 1, name: 'Amazon Simple Queue Service (Amazon SQS)'}));
    expect(screen.getByText(getServiceDeepDive('sqs')!.mentalModel)).toBeDefined();
    expect(screen.queryByText(getServiceDeepDive('lambda')!.mentalModel)).toBeNull();
    fireEvent.click(screen.getByRole('button', {name: 'Add or select in architecture'}));
    expect(add).toHaveBeenCalledTimes(1);
    expect(add).toHaveBeenCalledWith('sqs');
  });

  it('shows English-only glossary definitions in both the library and selected service', () => {
    const props = {onOpen: vi.fn(), onAdd: vi.fn(), onChapter: vi.fn()};
    const {container, rerender} = render(<ServiceLibrary exam="DVA-C03" {...props}/>);
    fireEvent.click(screen.getByRole('button', {name: 'English glossary'}));
    expect(screen.getByRole('heading', {name: 'English glossary'})).toBeDefined();
    expect(screen.queryByLabelText('Glossary language')).toBeNull();
    expect(container.querySelector('dd[lang="vi"]')).toBeNull();
    expect(container.querySelector('dd[lang="en"]')).not.toBeNull();
    fireEvent.change(screen.getByLabelText('Search glossary'), {target: {value: 'authentication'}});
    expect(screen.getByText('Authentication')).toBeDefined();
    rerender(<ServiceLibrary exam="DVA-C03" selected="lambda" {...props}/>);
    fireEvent.click(screen.getByText('English terminology'));
    expect(container.querySelector('dd[lang="vi"]')).toBeNull();
    expect(container.querySelector('dd[lang="en"]')).not.toBeNull();
    expect(props.onAdd).not.toHaveBeenCalled();
  });
});
