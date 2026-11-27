// Local file/model verification only. No browser, HTTP, or design mutation.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../..');
const load=async p=>JSON.parse(await readFile(resolve(root,p),'utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const designPath='samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json';
const designBytes=await readFile(resolve(root,designPath));const doc=JSON.parse(designBytes);
const baseline=await load('docs/planning/_backup/20261117_단이/0219_explicit_resume/'+designPath);
const sm=await load('_작업/codex/ux-studio/shop08-assembly-quick-sheet.json');
const {validateDocument,resolveRect}=await import(pathToFileURL(resolve(root,'src/tools/uxStudio/model.mjs')));
const {documentAssetImages}=await import(pathToFileURL(resolve(root,'src/tools/uxStudio/asset-reference.mjs')));
const result={checkedAt:new Date().toISOString(),revision:doc.revision,baselineRevision:baseline.revision,designSHA256:hash(designBytes),scope:'Intermediate local file/model verification only',usageGuard:{ordinaryUsageAllowed:true,source:'mcp__codex_app__get_usage_limits during this verification; no new percentage cap'},checks:[],pending:['Carousel dots','Header layout and visual verification','Scroll and anchors at actual viewport sizes','Shop entrance links','Browser, HTTP, input/purchase behavior and visual equivalence'],limitations:['Pending items are excluded from pass counts. Source test483 was not rerun. No design/source/shared report modified.']};
const check=(name,pass,detail)=>result.checks.push({name,pass:Boolean(pass),...(detail===undefined?{}:{detail})});
try{validateDocument(doc);check('actual model validateDocument',true);}catch(e){check('actual model validateDocument',false,e.message);}
check('baseline seven screens exactly preserved',baseline.screens.length>=7&&isDeepStrictEqual(doc.screens.slice(0,7),baseline.screens.slice(0,7)));
check('baseline 630 parts preserved',baseline.screens.slice(0,7).reduce((n,s)=>n+s.elements.length,0)===630);
check('baseline thirteen transitions preserved',baseline.transitions.length>=13&&baseline.transitions.slice(0,13).every(t=>doc.transitions.some(e=>isDeepStrictEqual(e,t))));
const shop=doc.screens.find(s=>s.name==='Page_Shop_Offers');
result.baselineContainsShopScaffold={parts:baseline.screens[7]?.elements.length,transitions:baseline.transitions.length,note:'r153 already includes Shop26 and Back; preservation checks target first7 screens and first13 edges.'};
check('all baseline transitions including existing Shop Back preserved',baseline.transitions.every(t=>doc.transitions.some(e=>isDeepStrictEqual(e,t))));
check('one Shop page exists',doc.screens.length===8&&shop?.kind==='page'&&doc.screens.slice(7).length===1,{screenId:shop?.id,parts:shop?.elements.length,transitions:doc.transitions.length});
const byName=new Map(shop.elements.map(e=>[e.name,e]));
const record=e=>({id:e?.id,name:e?.name,parentId:e?.parentId,parentName:shop.elements.find(p=>p.id===e?.parentId)?.name});
const rect=e=>resolveRect(shop,e.id,551,984);const near=(a,b)=>Math.abs(a-b)<0.02;
const products=[];
for(let i=0;i<6;i++){
 const number=String(i+1).padStart(2,'0');const prefix='Shop_Product'+number;const group=byName.get('Group_'+prefix);const fill=byName.get('BG_'+prefix);const frame=byName.get('Frame_'+prefix);const buy=byName.get('Btn_'+prefix+'_Buy');
 const groupRect=rect(group),fillRect=rect(fill),frameRect=rect(frame);
 check('Product'+number+' group156.27x224.98',near(groupRect.w,156.27)&&near(groupRect.h,224.98),groupRect);
 check('Product'+number+' fill/frame148.19x224.98',[fillRect,frameRect].every(r=>near(r.w,148.19)&&near(r.h,224.98)),{fill:fillRect,frame:frameRect});
 const fields=[['Quantity','quantity'],['More','percentLabel'],['Bonus','bonus'],['Price','price']];const observed=sm.observations.products[i];
 const parts=fields.map(([suffix,key])=>{const e=byName.get('Txt_'+prefix+'_'+suffix);check('Product'+number+' '+suffix+' observed text',e?.kind==='text'&&e.text===(observed[key]??''),{expected:observed[key]??'',actual:e?.text});check('Product'+number+' '+suffix+' parent',e?.parentId===(suffix==='Price'?buy?.id:group?.id),record(e));return record(e);});
 check('Product'+number+' card parts owned by group',[fill,frame,buy,byName.get('Img_'+prefix+'_Dice'),byName.get('BG_'+prefix+'_BonusRibbon')].every(e=>e?.parentId===group?.id),{group:record(group),fill:record(fill),frame:record(frame),buyer:record(buy)});
 check('Product'+number+' native fill and frame',fill?.kind==='panel'&&frame?.kind==='panel'&&fill.skin?.mode==='9'&&frame.skin?.mode==='9');
 products.push({group:record(group),fill:record(fill),frame:record(frame),buyer:record(buy),parts});
}
result.products=products;
const buyers=shop.elements.filter(e=>e.name==='Btn_Shop_Offer_Buy'||/^Btn_Shop_Product0[1-6]_Buy$/.test(e.name));
check('seven buyer effects native shadow',buyers.length===7&&buyers.every(e=>e.kind==='button'&&e.effects?.shadow?.enabled===true&&e.effects.shadow.color==='#000000'&&e.effects.shadow.opacity===0.25&&e.effects.shadow.x===0&&e.effects.shadow.y===3&&e.effects.shadow.blur===3),buyers.map(e=>({...record(e),shadow:e.effects?.shadow})));
const checkedFiles=new Set();const checkFile=async(path,expected)=>{if(!path||!expected||checkedFiles.has(path))return;checkedFiles.add(path);try{check('local SHA '+path,hash(await readFile(resolve(root,path)))===expected);}catch(e){check('local SHA '+path,false,e.message);}};
for(const [name,expectedCount] of [['shop-art-assets.json',2],['shop-ui-assets.json',5]]){
 const manifest=await load('_작업/codex/ux-studio/'+name);check(name+' count',manifest.assets.length===expectedCount);
 const ref=manifest.reference;await checkFile(ref.relativePath??ref.path,ref.sha256);
 for(const a of manifest.assets){await checkFile(a.relativePath,a.sha256);await checkFile(a.stagingPath,a.sha256);for(const file of Object.values(a.files??{}))await checkFile(file.path,file.sha256);for(const [pk,hk] of [['originalPath','originalSha256'],['rawCropRgbaPath','rawCropRgbaSha256'],['productionRgbaPath','productionRgbaSha256']])await checkFile(a.source?.[pk],a.source?.[hk]);await checkFile(a.prompt?.path,a.prompt?.sha256);}
}
const refs=[...new Set(documentAssetImages({screens:[shop]}).map(image=>image.assetRef))];result.shopUniqueAssetRefs=refs.length;
for(const ref of refs)await checkFile('samples/monopoly-go/ui-studio/assets/'+ref,ref.match(/^sha256-([a-f0-9]{64})\./)?.[1]);
check('all Shop image refs are local',documentAssetImages({screens:[shop]}).every(image=>/^sha256-[a-f0-9]{64}\.(webp|png|jpg)$/.test(image.assetRef)));
result.checkedLocalFiles=checkedFiles.size;result.pass=result.checks.every(c=>c.pass);result.passed=result.checks.filter(c=>c.pass).length;result.total=result.checks.length;
const latest=await readFile(resolve(root,designPath));result.savedRevisionStillSame=hash(latest)===result.designSHA256;
await writeFile(new URL('./shop08-intermediate-verify.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({revision:result.revision,baselineRevision:result.baselineRevision,pass:result.pass,passed:result.passed,total:result.total,localFiles:result.checkedLocalFiles,refs:refs.length,savedRevisionStillSame:result.savedRevisionStillSame,failed:result.checks.filter(c=>!c.pass)},null,2));if(!result.pass)process.exitCode=1;
