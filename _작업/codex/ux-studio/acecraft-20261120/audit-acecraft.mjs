#!/usr/bin/env node
// Read-only snapshot auditor. It never saves designs, writes reports, starts servers, or calls APIs.
import assert from 'node:assert/strict';
import {readFile,lstat,realpath,readdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {validateDocument,resolveRect,audit,MAX_DOCUMENT_BYTES} from '../../../../src/tools/uxStudio/model.mjs';
import {createAssetStore,inspectAsset} from '../../../../src/tools/uxStudio/asset-store.mjs';
import {documentAssetImages,validateAssetRef,MAX_ASSET_BYTES,MAX_ASSET_DIMENSION} from '../../../../src/tools/uxStudio/asset-reference.mjs';
import {validateImageRegion} from '../../../../src/tools/uxStudio/parts.mjs';

const ROOT='/Users/max/projest_max/ui-studio';
const GAME=join(ROOT,'samples/acecraft');
const DESIGN=join(GAME,'ui-studio/designs/ux-96eff1ad.json');
const ASSETS=join(GAME,'ui-studio/assets');
const PROJECT=join(GAME,'ui-studio/project.json');
const PROJECT_ID='ux-96eff1ad';
const WORKSPACE_ID='workspace-457652ed-0c01-4aec-bd2d-060a999c1178';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const knownGameArt=new Set([
 'sha256-62dddcfe1cc89c11c7777cc90ab9dc05606b4f3a80bff37e75045342a1a4e878.webp',
 'sha256-341b84f68fddf460b82bf95ee61312b34bec8d24216e79ea4bf6bd377191f592.webp',
 'sha256-0f1a97fc89f6ef642f248963a907fc5816cdeb1a58db11b64185f074bddc5432.webp',
 'sha256-7b8669522265f215fbaedd282ca6fbf9bf56971312e49de1b27e091078902677.webp',
 'sha256-68644947648134b9d547cf9495829481ae5ad42e7810f7b6c48587a75584b908.webp'
]);
const issue=(code,screen,element,detail)=>({code,screen,element,detail});
const rounded=n=>Math.round(n*10)/10;

export function auditStructure(document) {
 const errors=[],warnings=[],screenIds=new Set(),elementIds=new Set(),edgeIds=new Set(),globalNames=new Map();
 const repeatedRoles=[],bounds=[],modalGameImages=[],emptyImages=[];
 let parentChecks=0,regionChecks=0;
 for(const screen of document.screens||[]){
  if(screenIds.has(screen.id))errors.push(issue('duplicate-screen-id',screen.id,null,screen.id));
  screenIds.add(screen.id);
  if(screen.logicalSize?.w!==420||screen.logicalSize?.h!==924)errors.push(issue('logical-size',screen.id,null,screen.logicalSize||null));
  const local=new Map((screen.elements||[]).map(e=>[e.id,e])),names=new Set(),roles=new Map();
  const clippedAncestor=e=>{const seen=new Set();let p=local.get(e.parentId);while(p&&!seen.has(p.id)){seen.add(p.id);if(p.overflow&&p.overflow!=='visible'||p.kind==='list')return p.id;p=local.get(p.parentId);}return null;};
  for(const e of screen.elements||[]){
   if(elementIds.has(e.id))errors.push(issue('duplicate-element-id',screen.id,e.id,e.name));
   elementIds.add(e.id);
   if(!e.name?.trim())errors.push(issue('empty-name',screen.id,e.id,e.name));
   if(names.has(e.name))warnings.push(issue('duplicate-name-in-screen',screen.id,e.id,e.name));
   names.add(e.name);globalNames.set(e.name,[...(globalNames.get(e.name)||[]),{screen:screen.id,id:e.id}]);
   const chain=new Set([e.id]);let parent=e.parentId,bad=false;
   while(parent){parentChecks++;if(!local.has(parent)){errors.push(issue('missing-parent',screen.id,e.id,parent));bad=true;break;}if(chain.has(parent)){errors.push(issue('parent-cycle',screen.id,e.id,[...chain,parent]));bad=true;break;}chain.add(parent);parent=local.get(parent).parentId;}
   if(e.image?.region){try{validateImageRegion(e.image);regionChecks++;}catch(error){errors.push(issue('atlas-region',screen.id,e.id,error.message));}}
   if(e.kind==='image'&&!e.image?.assetRef&&!e.image?.src&&!e.image?.asset)emptyImages.push({screen:screen.id,id:e.id,name:e.name,parent:e.parentId||null});
   if(screen.kind!=='page'){
    const refs=[e.image?.assetRef,...Object.values(e.skin?.textures||{}).map(t=>t.assetRef)];
    if(refs.some(ref=>knownGameArt.has(ref))||(e.image?.assetRef||e.image?.src||refs.some(Boolean))&&/(?:Backdrop|UnderlyingJoey|Canyon|Lobby_Scene|HonkWingman|SilvannaBoard|JoeyDrill)/i.test(e.name||''))modalGameImages.push({screen:screen.id,id:e.id,name:e.name,refs:refs.filter(Boolean)});
   }
   if(bad)continue;
   try{
    const r=resolveRect(screen,e.id,420,924),clip=clippedAncestor(e);
    if(r.x<-.25||r.y<-.25||r.x+r.w>420.25||r.y+r.h>924.25){const item={screen:screen.id,id:e.id,name:e.name,rect:r,clippedBy:clip};bounds.push(item);if(!clip)warnings.push(issue('outside-authored-viewport',screen.id,e.id,r));}
    // Compare only digit-indexed names inside each screen; different named variants stay separate.
    if(/\d+(?=_|$)/.test(e.name||'')){
     const role=e.name.replace(/\d+(?=_|$)/g,'#')+'|'+e.kind+'|'+(e.partRole||'');
     const signature=JSON.stringify({w:rounded(r.w),h:rounded(r.h),font:e.fontSize??null,weight:e.typography?.weight??null});
     const group=roles.get(role)||new Map();group.set(signature,[...(group.get(signature)||[]),e.id]);roles.set(role,group);
    }
   }catch(error){errors.push(issue('resolve-rect',screen.id,e.id,error.message));}
  }
  for(const [role,variants] of roles){const count=[...variants.values()].reduce((n,ids)=>n+ids.length,0);if(count>1){const item={screen:screen.id,role,count,variants:[...variants].map(([signature,ids])=>({metrics:JSON.parse(signature),ids})),uniform:variants.size===1};repeatedRoles.push(item);if(!item.uniform)warnings.push(issue('repeated-role-variant',screen.id,null,item));}}
 }
 const byScreen=new Map((document.screens||[]).map(s=>[s.id,s]));
 for(const edge of document.transitions||[]){
  if(edgeIds.has(edge.id))errors.push(issue('duplicate-edge-id',edge.fromScreen,edge.fromElement,edge.id));edgeIds.add(edge.id);
  const source=byScreen.get(edge.fromScreen);
  if(!source?.elements?.some(e=>e.id===edge.fromElement))errors.push(issue('missing-link-source',edge.fromScreen,edge.fromElement,edge.id));
  if(edge.targetScreen&&!byScreen.has(edge.targetScreen))errors.push(issue('missing-link-target',edge.fromScreen,edge.fromElement,edge.targetScreen));
  if(['navigate','open'].includes(edge.action)&&!edge.targetScreen)warnings.push(issue('unresolved-link-target',edge.fromScreen,edge.fromElement,edge.id));
  if(edge.condition==='unknown')warnings.push(issue('unknown-link-condition',edge.fromScreen,edge.fromElement,edge.id));
 }
 for(const item of modalGameImages)errors.push(issue('modal-game-image',item.screen,item.id,item));
 return {errors,warnings,counts:{screens:screenIds.size,elements:elementIds.size,links:edgeIds.size,parentChecks,regionChecks},identity:{screenIds:[...screenIds].sort(),elementIdsDigest:sha([...elementIds].sort().join('\n')),edgeIdsDigest:sha([...edgeIds].sort().join('\n')),duplicateNamesAcrossScreens:[...globalNames].filter(([,v])=>v.length>1).map(([name,locations])=>({name,locations}))},repeatedRoles,bounds,modalGameImages,emptyImages};
}

function imageUsages(document){
 const uses=[];const add=(location,image)=>{if(image)uses.push({location,image});};
 for(const s of document.screens||[]){
  for(const [state,image] of Object.entries(s.skin?.textures||{}))add(s.id+'/skin/'+state,image);
  for(const e of s.elements||[]){add(s.id+'/'+e.id+'/image',e.image);for(const [kind,images] of [['skin',e.skin?.textures],['buttonState',e.buttonState?.images],['tabSkin',e.control?.tabSkin?.textures]])for(const [state,image] of Object.entries(images||{}))add(s.id+'/'+e.id+'/'+kind+'/'+state,image);}
 }
 for(const item of document.fixtures?.items||[])for(const [key,image] of Object.entries(item.images||{}))add('fixture/'+item.id+'/'+key,image);
 return uses;
}
function imageSizeErrors(image,asset,location){
 const errors=[],declared=image.sourceSize||(image.w!==undefined||image.h!==undefined?[image.w,image.h]:null);
 if(declared&&(declared[0]!==asset.width||declared[1]!==asset.height))errors.push(issue('image-source-size',null,null,{location,declared,actual:[asset.width,asset.height]}));
 const r=image.region;
 if(r&&(!Array.isArray(r)||r.length!==4||!r.every(Number.isInteger)||r[0]<0||r[1]<0||r[2]<=0||r[3]<=0||r[0]+r[2]>asset.width||r[1]+r[3]>asset.height))errors.push(issue('region-vs-actual-asset',null,null,{location,region:r,actual:[asset.width,asset.height]}));
 return errors;
}
async function exactPath(path,expected){
 if(resolve(path)!==expected)throw Error('This audit accepts only the exact ACE target path: '+expected);
 const info=await lstat(path);if(info.isSymbolicLink())throw Error('Symbolic link is not accepted: '+path);
 if(await realpath(path)!==expected)throw Error('A parent path contains a link or move: '+path);
 return path;
}
async function auditTarget(designPath,assetPath){
 await exactPath(designPath,DESIGN);await exactPath(assetPath,ASSETS);await exactPath(PROJECT,PROJECT);
 const bytes=await readFile(designPath),document=JSON.parse(bytes.toString('utf8'));
 if(document.projectId!==PROJECT_ID)throw Error('The file is not the allowed ACE design '+PROJECT_ID);
 const meta=JSON.parse(await readFile(PROJECT,'utf8'));
 if(meta.id!==WORKSPACE_ID||meta.conversionDecision!=='independent')throw Error('ACE workspace identity/independent mode changed; inspect before proceeding.');
 const report=auditStructure(document),before=sha(bytes),snapshot=JSON.stringify(document);
 try{validateDocument(structuredClone(document));}catch(error){report.errors.push(issue('canonical-validator',null,null,error.message));}
 const exportBytes=Buffer.byteLength(snapshot);
 if(bytes.length>MAX_DOCUMENT_BYTES||exportBytes>MAX_DOCUMENT_BYTES)report.errors.push(issue('document-byte-limit',null,null,{stored:bytes.length,export:exportBytes,max:MAX_DOCUMENT_BYTES}));
 const store=createAssetStore(GAME,assetPath),refs=[...new Set(documentAssetImages(document).map(i=>i.assetRef))],assets=[];
 try{await store.validateDocument(structuredClone(document));}catch(error){report.errors.push(issue('canonical-asset-validator',null,null,error.message));}
 for(const ref of refs){try{validateAssetRef(ref);assets.push((await store.read(ref)).asset);}catch(error){report.errors.push(issue('asset-reference',null,null,{ref,message:error.message}));}}
 const assetByRef=new Map(assets.map(a=>[a.assetRef,a]));let regionChecks=0,inlineImages=0;
 for(const {location,image} of imageUsages(document)){
  if(image.assetRef){const asset=assetByRef.get(image.assetRef);if(asset){const errors=imageSizeErrors(image,asset,location);report.errors.push(...errors);if(image.region&&!errors.length)regionChecks++;}}
  if(image.src){inlineImages++;try{const match=/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(image.src);if(!match)throw Error('Unsupported inline source');const asset=inspectAsset(Buffer.from(match[2],'base64'),match[1]);const errors=imageSizeErrors(image,asset,location);report.errors.push(...errors);if(image.region&&!errors.length)regionChecks++;}catch(error){report.errors.push(issue('inline-image',null,null,{location,message:error.message}));}}
 }
 const unused=[];let otherNames=0;
 for(const entry of await readdir(assetPath,{withFileTypes:true})){
  try{validateAssetRef(entry.name);}catch{otherNames++;continue;}
  if(refs.includes(entry.name))continue;
  const info=await lstat(join(assetPath,entry.name));unused.push({assetRef:entry.name,bytes:info.size,symbolicLink:info.isSymbolicLink(),regularFile:info.isFile()});
 }
 let canonicalNotes=[];try{canonicalNotes=audit(structuredClone(document));}catch(error){report.warnings.push(issue('canonical-diagnostic-notes',null,null,error.message));}
 const after=sha(await readFile(designPath));
 if(after!==before)report.warnings.push(issue('concurrent-save-during-audit',null,null,'The design file changed while being read; rerun after the normal UI save settles.'));
 assert.equal(JSON.stringify(document),snapshot,'Audit must never mutate its in-memory source document');
 return {kind:'acecraft-readonly-design-audit',status:report.errors.length?'structural-errors-diagnostic-only':'structural-checks-clear-ui-verification-still-pending',at:new Date().toISOString(),target:{design:designPath,projectId:document.projectId,revision:document.revision,workspaceId:meta.id,assets:assetPath},limits:{documentBytes:MAX_DOCUMENT_BYTES,assetBytes:MAX_ASSET_BYTES,assetDimension:MAX_ASSET_DIMENSION,logicalSize:[420,924]},counts:report.counts,readOnly:{writesPerformed:0,networkCalls:0,sha256Before:before,sha256After:after,sameSavedSnapshot:before===after,inMemoryDocumentUnchanged:true},bytes:{storedDesign:bytes.length,serializedExport:exportBytes,referencedAssetTotal:assets.reduce((n,a)=>n+a.bytes,0),unusedByThisDesignTotal:unused.reduce((n,a)=>n+a.bytes,0)},assets:{referenceOccurrences:documentAssetImages(document).length,uniqueReferences:refs.length,checked:assets,regionsCheckedAgainstActualSize:regionChecks,legacyInlineImages:inlineImages,unusedByThisDesign:unused,otherNamesIgnored:otherNames,unusedCaveat:'Unused means unreferenced by this design only; no deletion recommendation and no other design files were read.'},...report,canonicalUnlinkedDiagnostics:canonicalNotes,limitations:['A single snapshot checks ID uniqueness and records ID digests; stable IDs across edits require comparing two saved reports.','Image inspection validates the project binary/size/hash contract; it does not decode pixels or prove HTTP/browser display.','Modal game-art detection uses exact known ACE scene/hero asset hashes plus element names; a zero count is not a visual comparison.','Repeated-role differences are diagnostics; partial rows, content variants and clips can be intentional.','No input, focus, contrast, overflow screenshots, original-video equivalence or game API behavior was verified.','npm test was not run: product source was unchanged; product baseline tests and this new UI snapshot audit are separate.']};
}
function selfTest(){
 const e=(id,name='Row1',extra={})=>({id,name,kind:'panel',x:0,y:0,w:10,h:10,...extra});
 const d=elements=>({screens:[{id:'s',name:'Page',kind:'page',logicalSize:{w:420,h:924},elements}],transitions:[]});
 assert.equal(auditStructure(d([e('one')])).errors.length,0);
 assert(auditStructure(d([e('same'),e('same')])).errors.some(x=>x.code==='duplicate-element-id'));
 assert(auditStructure(d([e('one','Row1',{parentId:'missing'})])).errors.some(x=>x.code==='missing-parent'));
 assert(auditStructure(d([e('one','Row1',{parentId:'two'}),e('two','Row2',{parentId:'one'})])).errors.some(x=>x.code==='parent-cycle'));
 const links=d([e('one')]);links.transitions=[{id:'edge',fromScreen:'s',fromElement:'one',targetScreen:'absent'}];assert(auditStructure(links).errors.some(x=>x.code==='missing-link-target'));
 const wrong=d([e('one')]);wrong.screens[0].logicalSize.h=923;assert(auditStructure(wrong).errors.some(x=>x.code==='logical-size'));
 assert(auditStructure(d([e('one','Row1'),e('two','Row2',{w:11})])).warnings.some(x=>x.code==='repeated-role-variant'));
 const modal=d([e('one','Img_Backdrop',{kind:'image',image:{assetRef:[...knownGameArt][0]}})]);modal.screens[0].kind='modal';assert(auditStructure(modal).errors.some(x=>x.code==='modal-game-image'));
 const matte=d([e('one','Panel_Backdrop')]);matte.screens[0].kind='modal';assert(!auditStructure(matte).errors.some(x=>x.code==='modal-game-image'),'plain modal matte is not a game image');
 assert(imageSizeErrors({sourceSize:[100,100],region:[50,50,10,10]},{width:10,height:10},'inline').some(x=>x.code==='region-vs-actual-asset'),'inline region must use actual image size');
 const base=d([e('one')]),before=JSON.stringify(base);auditStructure(base);assert.equal(JSON.stringify(base),before);
 console.log(JSON.stringify({kind:'audit-script-self-test-only',checks:11,result:'passed',realDesignRead:false,uiVerified:false}));
}
const usage=`node ${fileURLToPath(import.meta.url)} --design ${DESIGN} --assets ${ASSETS}\nJSON report is stdout only. Redirect it to an explicit scratch report path after normal UI saving.\n--self-test reads no actual design. --help reads no files.`;
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const args=process.argv.slice(2);
  if(args.length===1&&args[0]==='--self-test')selfTest();
  else if(args.length===1&&args[0]==='--help')console.log(usage);
  else{
   if(args.length!==4||args[0]!=='--design'||args[2]!=='--assets')throw Error(usage);
   const report=await auditTarget(args[1],args[3]);console.log(JSON.stringify(report,null,2));if(report.errors.length)process.exitCode=1;
  }
 }catch(error){console.error(JSON.stringify({kind:'acecraft-readonly-audit-error',message:error.message}));process.exitCode=2;}
}
