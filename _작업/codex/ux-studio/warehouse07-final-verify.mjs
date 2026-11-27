// Read-only verification; writes only its adjacent JSON result. HTTP restricted to localhost:7018.
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const readJSON = async path => JSON.parse(await readFile(resolve(root, path), 'utf8'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const { validateDocument, resolveRect } = await import(pathToFileURL(resolve(root, 'src/tools/uxStudio/model.mjs')));
const { documentAssetImages, assetUrl } = await import(pathToFileURL(resolve(root, 'src/tools/uxStudio/asset-reference.mjs')));
const current = await readJSON('samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json');
const baseline = await readJSON('docs/planning/_backup/20261117_단이/0100_warehouse07/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json');
const httpOnly = process.argv.includes('--http-only');
const workspace = 'workspace-8e0f09e7-4699-4ac6-81b3-d545c7046ef6';
const result = httpOnly ? await readJSON('_작업/codex/ux-studio/warehouse07-final-verify.json') : { checkedAt: new Date().toISOString(), revision: current.revision, baselineRevision: baseline.revision, usageGuard: { observedBefore: 89, stopThreshold: 90, source: 'mcp__codex_app__get_usage_limits; parent owns final guard' }, checks: [], limitations: ['Source/model/local asset SHA and HTTP7018 checks only; no browser/visual equivalence, game policy, or acceptance claim.'] };
if (httpOnly) {
 result.priorHttpAttempts ??= [];
 result.priorHttpAttempts.push({ workspace: result.httpWorkspace ?? null, checkedAt: result.checkedAt, checks: result.checks.filter(c=>c.name.startsWith('HTTP7018:')) });
 result.checks = result.checks.filter(c=>!c.name.startsWith('HTTP7018:'));
 result.checkedAt = new Date().toISOString();
}
result.httpWorkspace = workspace;
const screen = current.screens.find(s => s.name === 'Page_Showroom_Shields');
const refs=[...new Set(documentAssetImages({screens:[screen]}).map(i=>i.assetRef))];
const check = (name, pass, detail) => result.checks.push({ name, pass: Boolean(pass), ...(detail === undefined ? {} : { detail }) });
if (!httpOnly) {
try { validateDocument(current); check('actualModel.validateDocument', true); } catch(error) { check('actualModel.validateDocument', false, error.message); }
check('firstSixScreensPreserved', baseline.screens.length === 6 && isDeepStrictEqual(current.screens.slice(0,6), baseline.screens));
check('baselineTenTransitionsPreserved', baseline.transitions.length === 10 && baseline.transitions.every(t => current.transitions.some(c => isDeepStrictEqual(t,c))));
check('counts', current.screens.length === 7 && screen?.elements.length === 89 && current.screens.reduce((n,s) => n+s.elements.length,0) === 630 && current.transitions.length === 13 && current.screens.filter(s=>s.kind==='page').length===4 && current.screens.filter(s=>s.kind==='modal').length===3, { screens:current.screens.length, parts:current.screens.reduce((n,s)=>n+s.elements.length,0), warehouseParts:screen?.elements.length, transitions:current.transitions.length });
const newEdges = current.transitions.filter(t => !baseline.transitions.some(b=>b.id===t.id));
check('threeAlwaysEdges', newEdges.length===3 && newEdges.every(t=>t.condition==='always') && newEdges.filter(t=>t.action==='navigate'&&t.targetScreen===screen.id).length===2 && newEdges.filter(t=>t.action==='back'&&t.fromScreen===screen.id).length===1, newEdges.map(t=>({label:t.label,action:t.action,condition:t.condition})));
const near = (a,b) => Math.abs(a-b)<0.02;
for (const [prefix,count,w,h] of [['Btn_Showroom_EquippedSlot',4,101.2,139],['Group_Showroom_Shelf',3,455.42,165.24]]) {
 const items=screen.elements.filter(e=>new RegExp('^'+prefix+'0[1-9]$').test(e.name));
 const rects=items.map(e=>({name:e.name,...resolveRect(screen,e.id,551,984)}));
 check(prefix+'EqualGeometry',items.length===count&&rects.every(r=>near(r.w,w)&&near(r.h,h)),rects);
}
const tabs=screen.elements.find(e=>e.name==='Control_Showroom_CategoryTabs')?.control;
check('fourNativeIconTabsNamedShieldOnlyPanel',tabs?.type==='tabs'&&tabs.labelMode==='icon'&&tabs.options?.length===4&&tabs.options.every(o=>typeof o.label==='string'&&o.label.trim())&&tabs.options.filter(o=>o.panelId).length===1&&tabs.options.find(o=>o.panelId)?.label==='방패'&&tabs.value==='category02',tabs?.options);
const manifests=[];
for(const [name,expected] of [['warehouse-art-assets.json',7],['warehouse-ui-assets.json',12],['warehouse-products-assets.json',4]]){
 const m=await readJSON('_작업/codex/ux-studio/'+name);check(name+'Count',m.assets.length===expected,m.assets.length);
 for(const a of m.assets){const prod=a.files?.production?.path??a.relativePath;const mirror=a.files?.importMirror?.path??a.stagingPath;const expectedHash=a.files?.production?.sha256??a.sha256;const bytes=await readFile(resolve(root,prod));const mirrorBytes=await readFile(resolve(root,mirror));const actualHash=sha(bytes);check('localSHA:'+a.role,actualHash===expectedHash&&sha(mirrorBytes)===expectedHash,{production:prod,mirror,sha256:actualHash});manifests.push({role:a.role,sha256:actualHash,path:prod});}
}
const newHashes=new Set(manifests.map(a=>a.sha256));
const usedNew=refs.filter(ref=>newHashes.has(ref.slice(7,-5)));
const reused=refs.filter(ref=>!newHashes.has(ref.slice(7,-5)));
check('warehouseUsedRefs20New5Reused',usedNew.length===20&&reused.length===5,{total:refs.length,new:usedNew.length,reused:reused.length,reusedRefs:reused,unusedNewAssets:manifests.filter(a=>!usedNew.some(ref=>ref.includes(a.sha256))).map(a=>a.role)});
}
await Promise.all(refs.map(async ref=>{const url=new URL(assetUrl(ref,workspace),'http://127.0.0.1:7018');try{const response=await fetch(url,{signal:AbortSignal.timeout(10000)});const hash=sha(Buffer.from(await response.arrayBuffer()));check('HTTP7018:'+ref,response.ok&&ref.includes(hash),{status:response.status,sha256:hash});}catch(error){check('HTTP7018:'+ref,false,error.message);}}));
result.pass=result.checks.every(c=>c.pass);result.passed=result.checks.filter(c=>c.pass).length;result.total=result.checks.length;
await writeFile(new URL('./warehouse07-final-verify.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({revision:result.revision,baselineRevision:result.baselineRevision,pass:result.pass,passed:result.passed,total:result.total,failed:result.checks.filter(c=>!c.pass)},null,2));
if(!result.pass)process.exitCode=1;
