// One-time provenance-preserving migration, not a runtime dependency.
import fs from 'node:fs/promises';
import {resolve,dirname,relative,join} from 'node:path';
import {createHash} from 'node:crypto';
const source='/Users/max/projest_max/kpopmonsters',target=process.cwd();
const lock=JSON.parse(await fs.readFile(resolve(source,'package-lock.json'),'utf8'));
const pkg=JSON.parse(await fs.readFile(resolve(target,'package.json'),'utf8'));
const selected=new Map();
function depKey(parent,name){let at=parent;for(;;){const key=(at?at+'/':'')+'node_modules/'+name;if(lock.packages[key])return key;if(!at)throw Error('Missing lock dependency '+name);const i=at.lastIndexOf('/node_modules/');at=i<0?'':at.slice(0,i);}}
function collect(key){if(selected.has(key))return;const meta=lock.packages[key];if(!meta)throw Error('Missing '+key);selected.set(key,meta);for(const name of Object.keys({...meta.dependencies,...meta.optionalDependencies}))collect(depKey(key,name));}
collect('node_modules/vite');
const copied=[],omitted=[];
async function digestTree(base){let count=0,bytes=0;const hash=createHash('sha256');async function visit(dir){const entries=await fs.readdir(dir,{withFileTypes:true});entries.sort((a,b)=>a.name.localeCompare(b.name));for(const e of entries){if(e.name==='node_modules')continue;const p=join(dir,e.name);if(e.isDirectory())await visit(p);else{const data=await fs.readFile(p);count++;bytes+=data.length;hash.update(relative(base,p)).update(data);}}}await visit(base);return {count,bytes,sha256:hash.digest('hex')};}
for(const [key,meta]of selected){const from=resolve(source,key),to=resolve(target,key);let stat;try{stat=await fs.stat(from);}catch(e){if(e.code==='ENOENT'&&meta.optional){omitted.push({path:key,version:meta.version,reason:'optional platform package not installed on this Mac'});continue;}throw e;}
 const actual=JSON.parse(await fs.readFile(join(from,'package.json'),'utf8'));if(actual.version!==meta.version)throw Error('Installed/lock mismatch '+key);
 await fs.mkdir(dirname(to),{recursive:true});await fs.cp(from,to,{recursive:true,dereference:true,errorOnExist:true,force:false,filter:path=>!relative(from,path).split('/').includes('node_modules')});
 const a=await digestTree(from),b=await digestTree(to);if(JSON.stringify(a)!==JSON.stringify(b))throw Error('Copy mismatch '+key);
 copied.push({path:key,version:actual.version,license:actual.license,integrity:meta.integrity,...b});
}
const packages={'':{name:pkg.name,version:pkg.version,devDependencies:pkg.devDependencies},...Object.fromEntries(selected)};
await fs.writeFile('package-lock.json',JSON.stringify({name:pkg.name,version:pkg.version,lockfileVersion:3,requires:true,packages},null,2)+'\n');
await fs.mkdir('node_modules/.bin',{recursive:true});await fs.symlink('../vite/bin/vite.js','node_modules/.bin/vite');
await fs.writeFile('_작업/codex/ux-studio/standalone-dependencies.json',JSON.stringify({note:'Exact previously installed npm distributions copied into this project; no external runtime symlinks. Source path is historical provenance only.',copied,omitted},null,2)+'\n');
console.log(JSON.stringify({copiedPackages:copied.length,lockedPackages:selected.size,bytes:copied.reduce((n,p)=>n+p.bytes,0)}));
