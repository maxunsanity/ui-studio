import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {validateDocument,resolveRect} from '../../../src/tools/uxStudio/model.mjs';
const root=new URL('../../../',import.meta.url),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=async p=>JSON.parse(await fs.readFile(new URL(p,root),'utf8'));
const file='samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json';
const bytes=await fs.readFile(new URL(file,root)),d=validateDocument(JSON.parse(bytes));
const old=await read('docs/planning/_backup/20261117_단이/0013_menu06/'+file);
assert.equal(d.revision,107);assert.equal(d.screens.length,6);
for(const s of old.screens)assert.deepEqual(d.screens.find(x=>x.id===s.id),s);
for(const t of old.transitions)assert.deepEqual(d.transitions.find(x=>x.id===t.id),t);
assert.equal(d.transitions.length,10);
const menu=d.screens.find(s=>s.name==='Modal_Main_Menu');assert(menu);assert.equal(menu.elements.length,81);
assert.equal(d.screens.reduce((n,s)=>n+s.elements.length,0),541);
assert.equal(menu.presentation.rootMode,'fullscreen');assert.equal(menu.presentation.dim,false);assert.equal(menu.presentation.blocking,true);
const rows=menu.elements.filter(e=>e.name.startsWith('Btn_Menu_')&&e.name!=='Btn_Menu_Close');assert.equal(rows.length,9);
for(const e of rows){const r=resolveRect(menu,e.id,551,984);assert(Math.abs(r.w-307.15)<.001);assert(Math.abs(r.h-56.21)<.001);assert.equal(e.buttonState.enabled,true);const im=menu.elements.find(x=>x.id===e.buttonState.targetGraphic);assert(im&&im.kind==='image'&&im.parentId===e.id);}
const badges=menu.elements.filter(e=>e.partRole==='badge');assert.equal(badges.length,9);assert.equal(badges.filter(e=>e.notification.value===1).length,3);assert(badges.every(e=>e.notification.enabled&&e.notification.mode==='dot'&&e.notification.hideZero));
const close=menu.elements.find(e=>e.name==='Btn_Menu_Close');assert.equal(close.kind,'button');assert.equal(close.skin,undefined);assert.equal(close.buttonState.enabled,true);
assert.deepEqual(menu.elements.find(e=>e.name==='Img_Menu_Profile').image.region,[60,75,1111,1111]);
const manifest=await read('_작업/codex/ux-studio/menu-ui-assets.json'),flat=await read('_작업/codex/ux-studio/menu-flat-assets.json');
const fresh=[...manifest.assets.map(a=>({name:a.name,path:a.files.production.path,staging:a.files.importMirror.path,sha256:a.files.production.sha256})),...flat.assets];assert.equal(fresh.length,11);
const refs=[...new Set([...JSON.stringify(menu).matchAll(/sha256-([0-9a-f]{64})\.webp/g)].map(x=>x[0]))];assert.equal(refs.length,18);
for(const a of fresh){for(const p of [a.path,a.staging,'samples/monopoly-go/ui-studio/assets/sha256-'+a.sha256+'.webp'])assert.equal(hash(await fs.readFile(new URL(p,root))),a.sha256,p);assert(refs.includes('sha256-'+a.sha256+'.webp'));}
const assets=await Promise.all(refs.map(async ref=>{const sha=ref.slice(7,-5);assert.equal(hash(await fs.readFile(new URL('samples/monopoly-go/ui-studio/assets/'+ref,root))),sha);const out={ref,registered:true,new:fresh.some(a=>a.sha256===sha)};if(process.argv.includes('--http')){const r=await fetch('http://127.0.0.1:7018/api/ux-studio/asset?ref='+ref+'&workspace=workspace-8e0f09e7-4699-4ac6-81b3-d545c7046ef6');assert.equal(r.status,200);assert.equal(hash(Buffer.from(await r.arrayBuffer())),sha);out.httpStatus=200;out.httpHash=true;}return out;}));
const result={revision:d.revision,projectId:d.projectId,sha256:hash(bytes),screens:6,parts:541,menuParts:81,oldFiveScreensDeepEqual:true,oldEightEdgesPreserved:true,edges:10,equalRows:{count:9,size:[307.15,56.21]},badgeParents:9,visibleDots:3,hiddenZero:6,nativeProfileRegion:[60,75,1111,1111],closeWithoutLegacySkin:true,newAssets:11,usedUniqueAssets:18,assets};
await fs.mkdir(new URL('docs/evidence/20261117-menu06/',root),{recursive:true});await fs.writeFile(new URL('docs/evidence/20261117-menu06/file-verification.json',root),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,assets:undefined}));
