// Match appearance.ts before React loads, including old mode-only preferences.
(() => {
  let preference = 'system', palette = 'slate';
  try {
    const savedMode = localStorage.getItem('aws-playground-theme');
    const savedPalette = localStorage.getItem('aws-playground-palette');
    if (savedMode === 'light' || savedMode === 'dark') preference = savedMode;
    if (savedPalette === 'forest' || savedPalette === 'plum') palette = savedPalette;
  } catch {}
  const dark = preference === 'dark' || preference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const colors = {slate: ['#f5f7fb', '#141b27'], plum: ['#faf5f5', '#231e29'], forest: ['#f3f0e7', '#1b2424']};
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.dataset.themePreference = preference;
  document.documentElement.dataset.palette = palette;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', colors[palette][dark ? 1 : 0]);
})();
