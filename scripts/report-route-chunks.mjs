import {readFileSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

// Build with: node node_modules/vite/bin/vite.js build --manifest
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const manifest = JSON.parse(readFileSync(resolve(dist, '.vite/manifest.json'), 'utf8'));
function closure(id, seen = new Set()) {
  if (seen.has(id)) return seen;
  if (!manifest[id]) throw new Error('Missing manifest entry: ' + id);
  seen.add(id);
  for (const dependency of manifest[id].imports ?? []) closure(dependency, seen);
  return seen;
}
function measure(ids) {
  const files = [...new Set([...ids].map(id => manifest[id].file))];
  return {files, bytes: files.reduce((sum, file) => sum + readFileSync(resolve(dist, file)).length, 0), gzipBytes: files.reduce((sum, file) => sum + gzipSync(readFileSync(resolve(dist, file))).length, 0)};
}
const initial = closure('index.html');
console.log(JSON.stringify({meaning: 'Static JavaScript import closures from this production build; not browser timing or a simulated network result.', initial: measure(initial), deferred: Object.entries(manifest).filter(([, entry]) => entry.isDynamicEntry).map(([id]) => ({entry: id, additionalAfterHome: measure(new Set([...closure(id)].filter(dependency => !initial.has(dependency))))}))}, null, 2));
