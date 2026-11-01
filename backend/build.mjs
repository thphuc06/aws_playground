import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
await build({entryPoints:[resolve(root,'backend/server.ts'),resolve(root,'backend/init-ledger.ts'),resolve(root,'backend/live-smoke.ts')],outdir:resolve(root,'backend/dist'),outExtension:{'.js':'.mjs'},bundle:true,platform:'node',target:'node22',format:'esm',sourcemap:false,logLevel:'info'});
