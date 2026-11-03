import {useEffect, useState} from 'react';
import {Monitor, Moon, Sun} from 'lucide-react';
import {applyAppearance, palettes, paletteStorageKey, readPalette, readThemePreference, themeStorageKey, type PaletteId, type ThemePreference} from './appearance';
export {readThemePreference, themeStorageKey} from './appearance';
export type {ThemePreference} from './appearance';

export default function ThemeControl() {
  const [preference, setPreference] = useState<ThemePreference>(readThemePreference);
  const [palette, setPalette] = useState<PaletteId>(readPalette);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => applyAppearance(preference, palette, media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [preference, palette]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === null || event.key === themeStorageKey) setPreference(readThemePreference());
      if (event.key === null || event.key === paletteStorageKey) setPalette(readPalette());
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const Icon = preference === 'dark' ? Moon : preference === 'light' ? Sun : Monitor;
  return <div className="theme-control" role="group" aria-label="Appearance">
    <label className="palette-choice"><span className="palette-swatch" aria-hidden="true"/><span className="theme-label">Palette</span>
      <select aria-label="Color palette" title={palettes.find(item => item.id === palette)!.description} value={palette} onChange={event => {
        const value = event.target.value as PaletteId;
        setPalette(value);
        try {localStorage.setItem(paletteStorageKey, value);} catch {}
      }}>{palettes.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
    </label>
    <label className="mode-choice"><Icon size={17} aria-hidden="true"/><span className="theme-label">Mode</span>
      <select aria-label="Color theme" title="Light, Dark or follow your system" value={preference} onChange={event => {
        const value = event.target.value as ThemePreference;
        setPreference(value);
        try {localStorage.setItem(themeStorageKey, value);} catch {}
      }}><option value="light">Light</option><option value="dark">Dark</option><option value="system">System</option></select>
    </label>
  </div>;
}
