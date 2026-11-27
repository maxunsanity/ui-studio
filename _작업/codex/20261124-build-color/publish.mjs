import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import path from 'node:path';
import {validateDocument} from '/Users/max/projest_max/ui-studio/src/tools/uxStudio/model.mjs';
const origin='http://127.0.0.1:7018';
const workspace='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba';
const url=origin+'/api/ux-studio/project?workspace='+workspace;
const backup=process.argv[2];
if(!backup)throw Error('백업 경로 필요');
await mkdir(backup,{recursive:true});
for(const file of process.argv.slice(3)){
 const doc=validateDocument(JSON.parse(await readFile(new URL(file+'.json',import.meta.url))));
 if(file!=='hud'){
  const assets=JSON.parse(await readFile(new URL(file+'-assets.json',import.meta.url)));
  for(const [ref,p] of Object.entries(assets)){
   const res=await fetch(origin+'/api/ux-studio/asset?workspace='+workspace,{method:'POST',headers:{origin,'Content-Type':ref.endsWith('.webp')?'image/webp':ref.endsWith('.jpg')?'image/jpeg':'image/png'},body:await readFile(p)});
   if(!res.ok)throw Error(await res.text());
   assert.equal((await res.json()).asset.assetRef,ref);
  }
 }
 const savedURL=url+'&id='+doc.projectId;
 const status=await fetch(savedURL,{cache:'no-store'});
 let before=null;
 if(status.ok){before=(await status.json()).document;const target=path.join(backup,doc.projectId+'-r'+before.revision+'.json');const bytes=JSON.stringify(before,null,2)+'\n';try{await writeFile(target,bytes,{flag:'wx'});}catch(e){if(e.code!=='EEXIST')throw e;assert.equal(await readFile(target,'utf8'),bytes);}}
 else if(status.status!==404)throw Error(await status.text());
 assert.equal(doc.revision,before?.revision??0);
 const res=await fetch(url,{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify({document:doc,expectedRevision:before?.revision??null})});
 if(!res.ok)throw Error(await res.text());
 const saved=validateDocument((await res.json()).document);
 const reopened=await fetch(savedURL,{cache:'no-store'});
 assert(reopened.ok);
 assert.deepEqual((await reopened.json()).document,saved);
 await writeFile(new URL(file+'-saved.json',import.meta.url),JSON.stringify(saved,null,2)+'\n');
 console.log(saved.projectId,saved.revision,saved.screens.length,saved.transitions.length);
}
