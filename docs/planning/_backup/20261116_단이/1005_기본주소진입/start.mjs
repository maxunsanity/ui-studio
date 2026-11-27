import {fileURLToPath,pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import uxSavePlugin from '../src/tools/uxStudio/save-plugin.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
let vite;try{vite=await import('vite');}catch{vite=await import(pathToFileURL(resolve(root,'../kpopmonsters/node_modules/vite/dist/node/index.js')).href);}
const server=await vite.createServer({root,configFile:false,publicDir:false,cacheDir:resolve(root,'_작업/codex/ux-studio/vite-cache'),plugins:[uxSavePlugin(root,resolve(root,'_작업/codex/ux-studio/projects'))],server:{host:'127.0.0.1',port:7018,strictPort:true,open:false,fs:{deny:['.env','**/.git/**','**/_backup/**','**/play.html']}}});
await server.listen();server.printUrls();
