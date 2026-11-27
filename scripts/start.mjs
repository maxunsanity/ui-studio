import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {createServer} from 'vite';
import {uiStudioMount,uiStudioFiles} from '../tools/ux-studio/mount.mjs';
import uxSavePlugin from '../src/tools/uxStudio/save-plugin.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const server=await createServer({root,configFile:false,publicDir:false,cacheDir:resolve(root,'_작업/codex/ux-studio/vite-cache'),optimizeDeps:{noDiscovery:true,entries:[]},plugins:[uiStudioMount(root),uxSavePlugin(root,resolve(root,'_작업/codex/ux-studio/projects'))],server:{host:'127.0.0.1',port:7018,strictPort:true,open:false,fs:{allow:uiStudioFiles(root),deny:['.env','**/.git/**','**/_backup/**','**/play.html']},watch:{ignored:['**/_작업/**','**/docs/planning/_backup/**','**/docs/reference/**','**/tests/**']}}});
await server.listen();server.printUrls();
console.log('UI Studio: http://127.0.0.1:7018/ui-studio/');
