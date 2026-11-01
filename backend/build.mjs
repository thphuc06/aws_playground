import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
await build({entryPoints:[resolve(root,'backend/server.ts'),resolve(root,'backend/live-smoke.ts'),resolve(root,'backend/live-assistant-smoke.ts')],outdir:resolve(root,'backend/dist'),outExtension:{'.js':'.mjs'},bundle:true,platform:'node',target:'node22',format:'esm',banner:{js:"import {createRequire as createNodeRequire} from 'node:module'; const require=createNodeRequire(import.meta.url);"},sourcemap:false,logLevel:'info'});
