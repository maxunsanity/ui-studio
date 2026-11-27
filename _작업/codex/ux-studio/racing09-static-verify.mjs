// Read-only saved-model verification and bounded Racing asset GETs. Writes only assigned evidence JSONs.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual as equal} from 'node:util';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../..'),local=p=>resolve(root,p);
const load=async p=>JSON.parse(await readFile(local(p),'utf8')),hash=b=>createHash('sha256').update(b).digest('hex');
const designPath='samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json';
const bytes=await readFile(local(designPath)),doc=JSON.parse(bytes);
const backup='docs/planning/_backup/20261117_단이/0920_racing09_native/'+designPath,old=await load(backup);
const {validateDocument,resolveRect,createRuntime,activate}=await import(pathToFileURL(local('src/tools/uxStudio/model.mjs')));
const {documentAssetImages,assetSource}=await import(pathToFileURL(local('src/tools/uxStudio/asset-reference.mjs')));
const {inspectAsset}=await import(pathToFileURL(local('src/tools/uxStudio/asset-store.mjs')));
const {operations,assets}=await import(pathToFileURL(local('_작업/codex/ux-studio/racing09-native-recipe.mjs')));
const screen=doc.screens.find(s=>s.id==='screen-05d68f0a-4c51-4c9a-b764-a6ec3a7245d1');
const get=name=>screen.elements.find(e=>e.name===name),content=get('Group_Racing_Content'),panel=get('Group_Racing_OfferPanel'),close=get('Btn_Racing_Close');
const result={checkedAt:new Date().toISOString(),revision:doc.revision,baselineRevision:old.revision,designPath,backup,designSHA256:hash(bytes),screens:doc.screens.length,totalParts:doc.screens.reduce((n,s)=>n+s.elements.length,0),racingParts:screen.elements.length,transitions:doc.transitions.length,checks:[],limitations:['Local file/model and actual Racing asset bytes only; no browser/design API/app-state API or visual equivalence claim.','Source recipe is compared against actual saved IDs, parent IDs and geometry; recipe operations alone are not counted as UI.','Purchase/bonus/countdown APIs, original fonts, SALE version/entrance policy remain unverified. Source full494 is historical and was not rerun.']};
const check=(name,pass,detail)=>result.checks.push({name,pass:Boolean(pass),...(detail===undefined?{}:{detail})});
try{validateDocument(doc);check('actual model validateDocument',true);}catch(e){check('actual model validateDocument',false,e.message);}
check('original eight screens deep equal',equal(doc.screens.slice(0,8),old.screens));
check('original sixteen edges preserved',old.transitions.length===16&&old.transitions.every(t=>doc.transitions.some(n=>equal(t,n))));
check('saved counts nine screens801parts18edges Racing35',result.screens===9&&result.totalParts===801&&result.transitions===18&&result.racingParts===35);
check('fullscreen modal presentation',screen.name==='Modal_Event_RacingStarter'&&screen.kind==='modal'&&screen.presentation?.rootMode==='fullscreen'&&screen.presentation.dim===false&&screen.presentation.blocking===true&&screen.presentation.dismissOnEscape===true&&screen.presentation.closePolicy==='allow',screen.presentation);
const dim=get('Dim_Racing_Backdrop');
check('one flat black0.7 screen-stretch dim',screen.elements.filter(e=>/dim|backdrop/i.test(e.name)).length===1&&dim.appearance?.fill==='#000000'&&dim.appearance.opacity===0.7&&!dim.image&&!dim.skin&&!dim.parentId&&equal(dim.rectTransform?.min,[0,0])&&equal(dim.rectTransform?.max,[1,1])&&equal(dim.rectTransform?.sizeDelta,[0,0]));
check('center551x984 wrapper',!content.parentId&&equal(content.rectTransform?.min,[0.5,0.5])&&equal(content.rectTransform?.max,[0.5,0.5])&&equal(content.rectTransform?.pivot,[0.5,0.5])&&equal(content.rectTransform?.sizeDelta,[551,984]));
const roots=['Group_Racing_OfferPanel','Group_Racing_Title','Group_Racing_Boost','Btn_Racing_Close'];
check('panel title boost close fixed siblings',roots.every(name=>{const e=get(name);return e.parentId===content.id&&equal(e.rectTransform?.min,[0,1])&&equal(e.rectTransform?.max,[0,1]);}));
const actualNames=screen.elements.map(e=>e.name);
check('33 actual recipe units plus wrapper and road only',operations.length===33&&operations.every(op=>actualNames.includes(op.name))&&actualNames.every(name=>operations.some(op=>op.name===name)||['Group_Racing_Content','Img_Racing_RewardRoadBand'].includes(name))&&new Set(actualNames).size===35);
check('no template names left',actualNames.every(name=>/^(Dim|Img|BG|Group|Btn|Txt|Frame)_Racing_/.test(name)),actualNames);
const map=new Map(operations.map(op=>[op.key,get(op.name)]));
const near=(a,b)=>Math.abs(a-b)<0.03;
for(const op of operations){
 const e=get(op.name),expectedParent=op.parentKey==='ROOT'?(op.key==='dim'?undefined:content.id):map.get(op.parentKey)?.id;
 const r=resolveRect(screen,e.id,551,984),parent=e.parentId?resolveRect(screen,e.parentId,551,984):{x:0,y:0};
 const actual=[r.x-parent.x,r.y-parent.y,r.w,r.h];
 check('actual unit '+op.key,e.parentId===expectedParent&&actual.every((v,i)=>near(v,op.rect[i])),{id:e.id,name:e.name,parentId:e.parentId,localRect:actual});
 if(op.nativeText!==undefined)check('native text '+op.key,e.kind==='text'&&e.text===op.nativeText,{id:e.id,value:e.text});
 if(op.op==='image'){
  const a=assets[op.assetRole],region=e.image?.region??[0,0,...(e.image?.sourceSize??[])];
  check('image ownership/source '+op.key,e.kind==='image'&&e.interaction?.mode===op.interaction&&e.image?.assetRef?.includes(a.sha)&&equal(region,op.imageRegion)&&e.image.fit===op.fit,{id:e.id,interaction:e.interaction?.mode,assetRef:e.image?.assetRef,region});
 }
 if(op.frameMode&&op.key!=='dim')check('native slice '+op.key,e.skin?.mode===op.frameMode&&equal(e.skin.slices,op.slices)&&equal(e.skin.edges,op.edges)&&equal(e.skin.padding,op.padding));
}
const siblingOrder=screen.elements.filter(e=>e.parentId===content.id).map(e=>e.id),closeChildren=screen.elements.filter(e=>e.parentId===close.id).map(e=>e.id);
check('Close after Panel; glyph after disc',siblingOrder.indexOf(close.id)>siblingOrder.indexOf(panel.id)&&closeChildren.indexOf(get('Txt_Racing_Close').id)>closeChildren.indexOf(get('Img_Racing_CloseDisc').id),{siblingOrder,closeChildren});
const road=get('Img_Racing_RewardRoadBand'),roadManifest=await load('_작업/codex/ux-studio/racing-road-band-assets.json'),roadAsset=roadManifest.assets[0];
const roadHash=roadAsset.files?.production?.sha256??roadAsset.sha256;
check('new road separate image',road.kind==='image'&&road.parentId===panel.id&&road.interaction?.mode==='none'&&road.image.assetRef.includes(roadHash),{id:road.id,assetRef:road.image.assetRef});
const incoming=doc.transitions.find(t=>t.targetScreen===screen.id),closing=doc.transitions.find(t=>t.fromScreen===screen.id&&t.action==='close');
check('Main SALE demo open and copied Close always',incoming?.fromScreen==='main'&&incoming.action==='open'&&incoming.condition==='always'&&/시연|미확인/.test(incoming.label)&&closing?.fromElement===close.id&&closing.condition==='always',{incoming,closing});
check('no invented purchase or bonus API edges',doc.transitions.filter(t=>t.fromScreen===screen.id).length===1);
try{const opened=activate(doc,createRuntime(doc),'main',incoming.fromElement),closed=activate(doc,opened,screen.id,close.id);check('model SALE open Close Main return',opened.overlays.some(o=>o===screen.id||o.screen===screen.id||o.screenId===screen.id||o.id===screen.id)&&closed.page==='main'&&closed.overlays.length===0,{focusReturn:closed.focusReturn});}catch(e){check('model SALE open Close Main return',false,e.message);}
const checked=new Set();
const localCheck=async(path,expected)=>{if(!path||!expected||checked.has(path))return;checked.add(path);try{check('local manifest SHA '+path,hash(await readFile(local(path)))===expected);}catch(e){check('local manifest SHA '+path,false,e.message);}};
for(const name of ['racing-event-assets.json','racing-ui-assets.json','racing-road-band-assets.json']){
 const manifest=await load('_작업/codex/ux-studio/'+name);await localCheck(manifest.reference?.path??manifest.reference?.relativePath,manifest.reference?.sha256);
 for(const a of manifest.assets){await localCheck(a.relativePath,a.sha256);await localCheck(a.stagingPath,a.sha256);for(const f of Object.values(a.files??{}))await localCheck(f.path,f.sha256);}
}
const refs=[...new Set(documentAssetImages({screens:[screen]}).map(i=>i.assetRef))];result.uniqueRacingAssetRefs=refs.length;
const http={checkedAt:new Date().toISOString(),revision:doc.revision,screenId:screen.id,workspace:'workspace-8e0f09e7-4699-4ac6-81b3-d545c7046ef6',scope:'Only actual Racing screen asset resources at normal approved7018',checks:[]};
for(const ref of refs){
 const path='samples/monopoly-go/ui-studio/assets/'+ref,b=await readFile(local(path)),expected=ref.match(/^sha256-([a-f0-9]{64})\./)?.[1],mime=ref.endsWith('.webp')?'image/webp':ref.endsWith('.png')?'image/png':'image/jpeg';
 try{const info=inspectAsset(b,mime);check('actual registered asset '+ref,info.assetRef===ref,{path,bytes:b.length,width:info.width,height:info.height});}catch(e){check('actual registered asset '+ref,false,e.message);}
 const url=new URL(assetSource({assetRef:ref},http.workspace),'http://127.0.0.1:7018');
 if(url.origin!=='http://127.0.0.1:7018'||url.pathname!=='/api/ux-studio/asset')throw Error('Unexpected asset URL; stopped.');
 const response=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(10000)}),remote=Buffer.from(await response.arrayBuffer());
 const h={assetRef:ref,url:url.href,status:response.status,localBytes:b.length,responseBytes:remote.length,localSHA256:hash(b),responseSHA256:hash(remote),expectedSHA256:expected};h.pass=response.status===200&&h.localSHA256===expected&&h.responseSHA256===expected&&b.equals(remote);http.checks.push(h);
 if([401,403].includes(response.status))throw Error('Approved resource access denied; stopped without retry or bypass.');
}
result.manifestFilesChecked=checked.size;result.savedFileUnchanged=hash(await readFile(local(designPath)))===result.designSHA256;result.pass=result.checks.every(c=>c.pass);result.passed=result.checks.filter(c=>c.pass).length;result.total=result.checks.length;
http.total=http.checks.length;http.passed=http.checks.filter(c=>c.pass).length;http.pass=http.checks.every(c=>c.pass);
await writeFile(local('docs/evidence/20261117-racing09/file-verification.json'),JSON.stringify(result,null,2)+'\n');
await writeFile(local('docs/evidence/20261117-racing09/asset-http-checks.json'),JSON.stringify(http,null,2)+'\n');
console.log(JSON.stringify({revision:result.revision,counts:{screens:result.screens,parts:result.totalParts,racing:result.racingParts,edges:result.transitions},static:{passed:result.passed,total:result.total},http:{passed:http.passed,total:http.total},savedFileUnchanged:result.savedFileUnchanged,failed:result.checks.filter(c=>!c.pass)},null,2));if(!result.pass||!http.pass)process.exitCode=1;
