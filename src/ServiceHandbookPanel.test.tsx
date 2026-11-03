// @vitest-environment jsdom
import React from 'react';
import {afterEach, beforeEach, expect, it, vi} from 'vitest';
import {cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import ServiceHandbookPanel from './ServiceHandbookPanel';
import ServiceLibrary from './ServiceLibrary';
import {getServiceHandbook} from './serviceHandbooks';

vi.mock('./ServiceConfigurationReference', () => ({default: () => <div>Configuration reference fixture</div>}));
vi.mock('./learning/ServicePracticePanel', () => ({default: () => <div>Practice fixture</div>}));
beforeEach(() => {localStorage.clear(); vi.stubGlobal('scrollTo', vi.fn()); Element.prototype.scrollIntoView = vi.fn();});
afterEach(() => {cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks();});

it('exposes setup, settings and diagnostic evidence with links to their own sources', () => {
  const guide = getServiceHandbook('lambda')!;
  render(<ServiceHandbookPanel handbook={guide}/>);
  const region = screen.getByRole('region', {name: 'Build & configure'});
  expect(within(region).getByText(guide.configuration[0].choice)).toBeDefined();
  expect(screen.getByText(guide.troubleshooting[0].check)).toBeDefined();
  for (const source of guide.sources) {
    const links = screen.getAllByRole('link', {name: 'Primary reference: ' + source.title});
    expect(links.every(link => link.getAttribute('href') === source.url)).toBe(true);
  }
});

it('copies only the example text and reports an unavailable clipboard without losing the example', async () => {
  const guide = getServiceHandbook('lambda')!;
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', {...navigator, clipboard: {writeText}});
  render(<ServiceHandbookPanel handbook={guide}/>);
  fireEvent.click(screen.getByRole('button', {name: 'Copy handbook example'}));
  await waitFor(() => expect(screen.getByRole('status').textContent).toContain('copied'));
  expect(writeText).toHaveBeenCalledWith(guide.example.code);
  writeText.mockRejectedValueOnce(new Error('denied'));
  fireEvent.click(screen.getByRole('button', {name: 'Copy handbook example'}));
  await waitFor(() => expect(screen.getByRole('status').textContent).toContain('Clipboard unavailable'));
  expect(screen.getByLabelText('Illustrative service example').textContent).toBe(guide.example.code);
});

it('finds implementation settings and focuses handbook sections without modifying architecture', () => {
  const add = vi.fn(), open = vi.fn();
  const props = {exam: 'DVA-C03' as const, onAdd: add, onOpen: open, onChapter: vi.fn()};
  const {rerender} = render(<ServiceLibrary {...props}/>);
  fireEvent.change(screen.getByLabelText('Search service references'), {target: {value: 'ReportBatchItemFailures'}});
  fireEvent.click(screen.getByRole('button', {name: 'Read AWS Lambda guide'}));
  expect(open).toHaveBeenCalledWith('lambda');
  rerender(<ServiceLibrary {...props} selected="lambda"/>);
  fireEvent.click(screen.getByRole('button', {name: /02 Build & configure/}));
  expect(document.activeElement).toBe(screen.getByRole('heading', {name: 'Build & configure'}));
  fireEvent.click(screen.getByRole('button', {name: /03 Example & troubleshoot/}));
  expect(document.activeElement).toBe(screen.getByRole('heading', {name: 'Example & troubleshooting'}));
  expect(add).not.toHaveBeenCalled();
});
