// Static/local-model verification only; no browser or HTTP and no design/source writes.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual as equal} from 'node:util';
import {dirname,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../..');
const hash=b=>createHash('sha256').update(b).digest('hex');
const local=p=>resolve(root,p),load=async p=>JSON.parse(await readFile(local(p),'utf8'));
const designPath='samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json';
const bytes=await readFile(local(designPath)),doc=JSON.parse(bytes);
const backup='docs/planning/_backup/20261117_단이/0835_shop_popup_resume/'+designPath;
const baseline=await load(backup);
const sm=await load('_작업/codex/ux-studio/shop08-assembly-quick-sheet.json');
const {validateDocument,resolveRect,createRuntime,activate}=await import(pathToFileURL(local('src/tools/uxStudio/model.mjs')));
const {documentAssetImages}=await import(pathToFileURL(local('src/tools/uxStudio/asset-reference.mjs')));
const {inspectAsset}=await import(pathToFileURL(local('src/tools/uxStudio/asset-store.mjs')));
const result={checkedAt:new Date().toISOString(),revision:doc.revision,baselineRevision:baseline.revision,designPath,backup,designSHA256:hash(bytes),authority:'AGENTS.md latest 2026-11-17 08:35 manual approval; no new cap or automation changes',checks:[],limitations:['Static model/file checks only. No browser/HTTP/visual equivalence/real focus or scroll verification.','Current checks are independent of old r170 132 checks and old source suite counts.','Native cash/dice display-only contract is interpreted as interaction.mode none.']};
const check=(name,pass,detail)=>result.checks.push({name,pass:Boolean(pass),...(detail===undefined?{}:{detail})});
try{validateDocument(doc);check('actual validateDocument',true);}catch(e){check('actual validateDocument',false,e.message);}
const oldShop=baseline.screens.find(s=>s.name==='Page_Shop_Offers');
const shop=doc.screens.find(s=>s.id===oldShop.id),menu=doc.screens.find(s=>s.name==='Modal_Main_Menu');
const get=name=>shop.elements.find(e=>e.name===name);
check('original seven screens exactly preserved',equal(doc.screens.slice(0,7),baseline.screens.slice(0,7)));
const removed=oldShop.elements.filter(e=>!shop.elements.some(n=>n.id===e.id)).map(e=>e.name).sort();
check('only duplicate Shop board group and image removed',equal(removed,['Group_Shop_BoardBackdrop','Img_Shop_BoardBackdrop'].sort()),removed);
const mainBackdrop=doc.screens[0].elements.filter(e=>/backdrop|background/i.test(e.name));result.originalMainBackgrounds=mainBackdrop.map(e=>({name:e.name,id:e.id}));
check('Main elements preserved including original background',equal(doc.screens[0].elements,baseline.screens[0].elements));
check('same Shop ID fullscreen blocking modal',shop.id===oldShop.id&&shop.name==='Modal_Shop_Store'&&shop.kind==='modal'&&shop.presentation?.type==='modal'&&shop.presentation.rootMode==='fullscreen'&&shop.presentation.dim===false&&shop.presentation.blocking===true&&shop.presentation.dismissOnEscape===true&&shop.presentation.closePolicy==='allow',shop.presentation);
const dim=get('Overlay_Shop_BackdropDim');check('separate full Shop dim retained',dim?.x===0&&dim?.y===0&&dim?.w===100&&dim?.h===100&&dim?.appearance?.fill==='#000000'&&dim?.appearance?.opacity===0.72&&dim?.interaction?.mode==='none',{id:dim?.id,appearance:dim?.appearance});
for(const name of ['Group_Shop_Cash','Group_Shop_Dice']){const e=get(name);check(name+' display-only interaction',e?.interaction?.mode==='none',{id:e?.id,interaction:e?.interaction,buttonState:e?.buttonState});}
check('old thirteen edges preserved',baseline.transitions.slice(0,13).every(t=>doc.transitions.some(n=>equal(t,n))));
const close=doc.transitions.find(t=>t.fromScreen===shop.id&&t.fromElement===oldShop.elements.find(e=>e.name==='Btn_Shop_Back').id);
const opens=doc.transitions.filter(t=>t.targetScreen===shop.id&&t.action==='open');
check('sixteen edges and Shop Close',doc.transitions.length===16&&close?.action==='close'&&close.condition==='always',{total:doc.transitions.length,close});
const cash=opens.find(t=>t.fromScreen==='main'),menuShop=opens.find(t=>t.fromScreen===menu.id);
check('MainCash and MenuShop always open',opens.length===2&&cash?.condition==='always'&&menuShop?.condition==='always',{cash,menuShop});
const menuOpen=doc.transitions.find(t=>t.fromScreen==='main'&&t.targetScreen===menu.id&&t.action==='open');
const brief=r=>({page:r.page,overlays:r.overlays.map(o=>typeof o==='string'?o:o.screen??o.id??o.screenId),focusReturn:r.focusReturn});
try{
 const cashRun=activate(doc,createRuntime(doc),cash.fromScreen,cash.fromElement);const cashClosed=activate(doc,cashRun,shop.id,close.fromElement);
 check('model MainCash open and close return Main',cashRun.overlays.some(o=>o.screen===shop.id||o.screenId===shop.id||o.id===shop.id||o===shop.id)&&cashClosed.page==='main'&&cashClosed.overlays.length===0,{opened:brief(cashRun),closed:brief(cashClosed)});
 const menuRun=activate(doc,createRuntime(doc),menuOpen.fromScreen,menuOpen.fromElement);const menuShopRun=activate(doc,menuRun,menuShop.fromScreen,menuShop.fromElement);const menuReturned=activate(doc,menuShopRun,shop.id,close.fromElement);
 check('model nested Shop close returns Menu',menuShopRun.overlays.length===2&&menuReturned.overlays.length===1&&menuReturned.overlays.some(o=>o.screen===menu.id||o.screenId===menu.id||o.id===menu.id||o===menu.id),{opened:brief(menuShopRun),returned:brief(menuReturned)});
}catch(e){check('model popup transitions',false,e.message);}
const near=(a,b)=>Math.abs(a-b)<0.02;
for(let i=1;i<=6;i++){
 const n=String(i).padStart(2,'0'),group=get('Group_Shop_Product'+n),r=resolveRect(shop,group.id,551,984),t=group.rectTransform;
 check('Product'+n+' fixed156.27x224.98',near(r.w,156.27)&&near(r.h,224.98)&&equal(t?.min,[0,1])&&equal(t?.max,[0,1])&&equal(t?.pivot,[0,1])&&near(t?.sizeDelta?.[0],156.27)&&near(t?.sizeDelta?.[1],224.98),{id:group.id,rect:r,rectTransform:t});
 for(const [suffix,key] of [['Quantity','quantity'],['More','percentLabel'],['Bonus','bonus'],['Price','price']]){const e=get('Txt_Shop_Product'+n+'_'+suffix);check('Product'+n+' native '+suffix,e?.kind==='text'&&e.text===(sm.observations.products[i-1][key]??''),{id:e?.id,value:e?.text});}
}
const refs=[...new Set(documentAssetImages({screens:[shop]}).map(i=>i.assetRef))];
for(const ref of refs){const p='samples/monopoly-go/ui-studio/assets/'+ref;try{const b=await readFile(local(p)),mime=ref.endsWith('.webp')?'image/webp':ref.endsWith('.png')?'image/png':'image/jpeg';const asset=inspectAsset(b,mime);check('local registered asset '+ref,asset.assetRef===ref,{path:p,bytes:b.length,width:asset.width,height:asset.height,sha256:hash(b)});}catch(e){check('local registered asset '+ref,false,e.message);}}
result.screens=doc.screens.length;result.shopParts=shop.elements.length;result.totalParts=doc.screens.reduce((n,s)=>n+s.elements.length,0);result.transitions=doc.transitions.length;result.uniqueShopAssetRefs=refs.length;result.savedFileUnchanged=hash(await readFile(local(designPath)))===result.designSHA256;
result.pass=result.checks.every(c=>c.pass);result.passed=result.checks.filter(c=>c.pass).length;result.total=result.checks.length;
await writeFile(new URL('./shop-popup-static-verify.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({revision:result.revision,shopParts:result.shopParts,totalParts:result.totalParts,transitions:result.transitions,refs:refs.length,passed:result.passed,total:result.total,pass:result.pass,savedFileUnchanged:result.savedFileUnchanged,failed:result.checks.filter(c=>!c.pass)},null,2));if(!result.pass)process.exitCode=1;
