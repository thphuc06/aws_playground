export type ThemePreference = 'light' | 'dark' | 'system';
export type PaletteId = 'slate' | 'plum' | 'forest';
export const themeStorageKey = 'aws-playground-theme';
export const paletteStorageKey = 'aws-playground-palette';
export const palettes = [
  {id: 'slate', name: 'Slate', description: 'Cool neutrals and clear blue accents', light: '#f5f7fb', dark: '#141b27'},
  {id: 'plum', name: 'Plum', description: 'Warm linen and soft berry accents', light: '#faf5f5', dark: '#231e29'},
  {id: 'forest', name: 'Forest', description: 'Cream paper and restrained sage accents', light: '#f3f0e7', dark: '#1b2424'},
] as const;

export function readThemePreference(): ThemePreference {
  try {const value = localStorage.getItem(themeStorageKey); if (value === 'light' || value === 'dark') return value;} catch {}
  return 'system';
}
export function readPalette(): PaletteId {
  try {const value = localStorage.getItem(paletteStorageKey); if (value === 'forest' || value === 'plum') return value;} catch {}
  return 'slate';
}
export function applyAppearance(preference: ThemePreference, palette: PaletteId, systemDark: boolean) {
  const resolved = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.dataset.themePreference = preference;
  root.dataset.palette = palette;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', palettes.find(item => item.id === palette)![resolved]);
}
