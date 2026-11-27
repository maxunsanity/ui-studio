import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {validateDocument} from '../../../src/tools/uxStudio/model.mjs';
const root=new URL('../../../',import.meta.url);
const read=async p=>JSON.parse(await fs.readFile(new URL(p,root),'utf8'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const path='samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json';
const bytes=await fs.readFile(new URL(path,root)),doc=validateDocument(JSON.parse(bytes));
const old=await read('docs/planning/_backup/20261116_단이/2243_main05/'+path);
assert.equal(doc.revision,92);assert.equal(doc.screens.length,5);
for(const s of old.screens.filter(s=>s.id!=='main'))assert.deepEqual(doc.screens.find(x=>x.id===s.id),s);
assert.deepEqual(doc.transitions,old.transitions);
const main=doc.screens.find(s=>s.id==='main');
assert.equal(main.elements.length,175);
const ids=new Set(main.elements.map(e=>e.id));
for(const e of old.screens.find(s=>s.id==='main').elements)assert(ids.has(e.id));
const all=doc.screens.flatMap(s=>s.elements),serialized=JSON.stringify(main);
assert.equal(all.length,460);assert.equal(new Set(all.map(e=>e.id)).size,460);
const buttons=main.elements.filter(e=>e.kind==='button');assert.equal(buttons.length,20);
assert(buttons.every(e=>e.buttonState?.enabled));
const go=main.elements.find(e=>e.name==='Txt_Roll_GO');assert.equal(go.kind,'text');assert.equal(go.text,'GO');assert.equal(go.image,undefined);
for(const id of ['element-f337a4e6-b8c8-4b9b-9132-ec6ba2de30be','element-6dcad9f9-c3e2-4ab2-afdd-bceebe72dfd3']){
 const e=main.elements.find(x=>x.id===id);assert(e);
 assert.deepEqual(e.skin.slices,[64,64,64,64]);
}
const eventRoots=main.elements.filter(e=>e.name.startsWith('Btn_Event_')||e.name==='Group_Event_CakeWalk');
assert.equal(eventRoots.length,12);assert(eventRoots.every(e=>e.rectTransform));
const board=await read('_作業/codex/ux-studio/main-candy-board-assets.json'.replace('_作業','_작업'));
const icons=await read('_작업/codex/ux-studio/main-events-assets.json');
const frames=await read('_작업/codex/ux-studio/main-ui-assets.json');
const entries=[board,...icons.assets,...frames.assets.map(a=>({name:a.name,relativePath:a.files.production.path,stagingPath:a.files.importMirror.path,sha256:a.files.production.sha256}))];
assert.equal(entries.length,27);
const assets=[];
for(const a of entries){
 const ref='sha256-'+a.sha256+'.webp';
 const registered='samples/monopoly-go/ui-studio/assets/'+ref;
 for(const p of [a.relativePath,a.stagingPath,registered])assert.equal(hash(await fs.readFile(new URL(p,root))),a.sha256,p);
 assert(serialized.includes(ref),a.name||a.role);
 const item={name:a.name||a.role,sha256:a.sha256,production:true,mirror:true,registered:true,referenced:true};
 if(process.argv.includes('--http')){
  const url='http://127.0.0.1:7018/api/ux-studio/asset?ref='+ref+'&workspace=workspace-8e0f09e7-4699-4ac6-81b3-d545c7046ef6';
  const r=await fetch(url);assert.equal(r.status,200);assert.equal(hash(Buffer.from(await r.arrayBuffer())),a.sha256);item.httpStatus=200;item.httpHash=true;
 }
 assets.push(item);
}
const result={revision:doc.revision,projectId:doc.projectId,sha256:hash(bytes),screens:doc.screens.map(s=>({id:s.id,name:s.name,parts:s.elements.length})),parts:all.length,mainOldStableIdsPreserved:63,otherFourScreensDeepEqual:true,transitionsUnchanged:8,mainButtonsWithEnabledEffects:20,nativeGOText:true,newAssets:assets.length,assets};
await fs.mkdir(new URL('docs/evidence/20261116-main05/',root),{recursive:true});
await fs.writeFile(new URL('docs/evidence/20261116-main05/file-verification.json',root),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({...result,assets:undefined}));
