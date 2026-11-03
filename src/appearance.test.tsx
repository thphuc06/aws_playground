// @vitest-environment jsdom
import React from 'react';
import {readFileSync} from 'node:fs';
import {afterEach, beforeEach, expect, it, vi} from 'vitest';
import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import ThemeControl from './ThemeControl';
import {palettes, paletteStorageKey, themeStorageKey} from './appearance';

let systemDark = false;
const listeners = new Set<() => void>();
beforeEach(() => {
  localStorage.clear();
  systemDark = false;
  listeners.clear();
  document.head.innerHTML = '<meta name="theme-color" content="#f5f7fb">';
  for (const key of ['theme', 'themePreference', 'palette']) delete document.documentElement.dataset[key];
  vi.stubGlobal('matchMedia', () => ({get matches() {return systemDark;}, addEventListener: (_: string, cb: () => void) => listeners.add(cb), removeEventListener: (_: string, cb: () => void) => listeners.delete(cb)}));
});
afterEach(() => {cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks();});

it('gives mode-only saved users the neutral Slate palette without losing their dark preference', () => {
  localStorage.setItem(themeStorageKey, 'dark');
  render(<ThemeControl/>);
  expect(document.documentElement.dataset).toMatchObject({theme: 'dark', palette: 'slate'});
  expect((screen.getByLabelText('Color theme') as HTMLSelectElement).value).toBe('dark');
  expect((screen.getByLabelText('Color palette') as HTMLSelectElement).options).toHaveLength(3);
});

it('persists palette separately and follows system changes without resetting the selected palette', () => {
  const view = render(<ThemeControl/>);
  fireEvent.change(screen.getByLabelText('Color palette'), {target: {value: 'plum'}});
  expect(localStorage.getItem(paletteStorageKey)).toBe('plum');
  act(() => {systemDark = true; listeners.forEach(listener => listener());});
  expect(document.documentElement.dataset).toMatchObject({theme: 'dark', palette: 'plum'});
  expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe('#231e29');
  view.unmount();
  render(<ThemeControl/>);
  expect((screen.getByLabelText('Color palette') as HTMLSelectElement).value).toBe('plum');
});

it('synchronizes palette changes and preference clearing from another tab', () => {
  render(<ThemeControl/>);
  act(() => {localStorage.setItem(paletteStorageKey, 'forest'); window.dispatchEvent(new StorageEvent('storage', {key: paletteStorageKey}));});
  expect(document.documentElement.dataset.palette).toBe('forest');
  act(() => {localStorage.clear(); window.dispatchEvent(new StorageEvent('storage', {key: null}));});
  expect(document.documentElement.dataset).toMatchObject({palette: 'slate', themePreference: 'system'});
});

it('recovers from invalid saved values and unavailable storage while keeping controls usable', () => {
  localStorage.setItem(paletteStorageKey, 'not-a-palette');
  localStorage.setItem(themeStorageKey, 'not-a-mode');
  render(<ThemeControl/>);
  expect(document.documentElement.dataset).toMatchObject({palette: 'slate', themePreference: 'system'});
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {throw new Error('blocked');});
  fireEvent.change(screen.getByLabelText('Color palette'), {target: {value: 'forest'}});
  expect(document.documentElement.dataset.palette).toBe('forest');
});

it('uses the same palette and browser-chrome color before React loads and after it mounts', () => {
  const bootstrap = readFileSync('public/theme-init.js', 'utf8');
  for (const palette of palettes) for (const mode of ['light', 'dark', 'system'] as const) {
    systemDark = true;
    localStorage.setItem(paletteStorageKey, palette.id);
    localStorage.setItem(themeStorageKey, mode);
    new Function('window', 'document', 'localStorage', bootstrap)(window, document, localStorage);
    const before = {...document.documentElement.dataset};
    const meta = document.querySelector('meta[name="theme-color"]');
    const color = meta?.getAttribute('content');
    const view = render(<ThemeControl/>);
    expect({...document.documentElement.dataset}).toEqual(before);
    expect(meta?.getAttribute('content')).toBe(color);
    expect(color).toBe(palette[mode === 'system' ? 'dark' : mode]);
    view.unmount();
  }
});
