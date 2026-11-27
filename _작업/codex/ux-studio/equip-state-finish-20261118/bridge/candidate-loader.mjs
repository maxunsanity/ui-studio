import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const target=pathToFileURL(process.cwd()+'/src/tools/uxStudio/layout-view.mjs').href;
export async function load(url,context,nextLoad){return url===target?{format:'module',source:readFileSync(new URL('./modified-layout-view.mjs',import.meta.url),'utf8'),shortCircuit:true}:nextLoad(url,context);}
