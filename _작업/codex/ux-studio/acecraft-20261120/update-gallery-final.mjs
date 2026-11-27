#!/usr/bin/env node
// Documentation-only helper. Do not run until root has saved all 20 boards.
// The saved design and aliases are read-only. Only --apply writes the two named galleries + backups.
import {readFile,readdir,lstat,realpath,mkdir,copyFile,writeFile} from 'node:fs/promises';
import {join,basename,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {validateDocument} from '../../../../src/tools/uxStudio/model.mjs';
import {inspectAsset} from '../../../../src/tools/uxStudio/asset-store.mjs';

const ROOT='/Users/max/projest_max/ui-studio';
const WORK=join(ROOT,'_작업/codex/ux-studio/acecraft-20261120');
const DESIGN=join(ROOT,'samples/acecraft/ui-studio/designs/ux-96eff1ad.json');
const MAPS='/Users/max/Documents/Codex/2026-11-11/new-chat';
const STAGING=join(ROOT,'src/tools/uxStudio/assets/import-staging/acecraft-20261120');
const CANONICAL=join(ROOT,'docs/reference/acecraft/data.json');
const SERVED=join(ROOT,'src/tools/uxStudio/guide/reference/acecraft-video-20261120/data.json');
const PROJECT='ux-96eff1ad';
const WORKSPACE='workspace-457652ed-0c01-4aec-bd2d-060a999c1178';
const sha=b=>createHash('sha256').update(b).digest('hex');
const fmt=v=>JSON.stringify(v,null,2)+'\n';
const kst=()=>new Date(Date.now()+9*3600000).toISOString().replace('Z','+09:00');
async function exactFile(path){
 if(resolve(path)!==path||await realpath(path)!==path||(await lstat(path)).isSymbolicLink())throw Error('Moved/symlink path is not accepted: '+path);
 return readFile(path);
}
function normalizedGallery(d){
 const value=structuredClone(d);
 for(const a of value.assets||[])a.image=basename(a.image);
 return value;
}
function refsOf(screen){
 const refs=new Set();
 const add=image=>{if(image?.assetRef)refs.add(image.assetRef);};
 for(const image of Object.values(screen.skin?.textures||{}))add(image);
 for(const e of screen.elements||[]){
  add(e.image);
  for(const images of [e.skin?.textures,e.buttonState?.images,e.control?.tabSkin?.textures])for(const image of Object.values(images||{}))add(image);
 }
 return refs;
}
function countsOf(screen,document){
 const es=screen.elements||[],byKind={};
 for(const e of es)byKind[e.kind]=(byKind[e.kind]||0)+1;
 return {total:es.length,byKind,rootUnits:es.filter(e=>!e.parentId).length,
  inputRoots:es.filter(e=>e.interaction?.mode==='action'&&e.interaction?.enabled!==false).length,
  parentInputParts:es.filter(e=>e.interaction?.mode==='parent').length,
  buttonStates:es.filter(e=>e.buttonState?.enabled).length,
  sliced3:es.filter(e=>String(e.skin?.mode)==='3').length,
  sliced9:es.filter(e=>String(e.skin?.mode)==='9').length,
  outgoingLinks:document.transitions.filter(t=>t.fromScreen===screen.id).length};
}
async function readAliasNotes(screens){
 const byName=new Map(screens.map(s=>[s.name,s])),notes=new Map();
 for(const name of (await readdir(MAPS)).filter(n=>/^acecraft-.*-ui-map\.json$/.test(n)).sort()){
  const file=join(MAPS,name),log=JSON.parse((await exactFile(file)).toString('utf8'));
  if(!/^(?:Page|Modal)_ACE_/.test(log.family?.name||''))continue;
  const screen=byName.get(log.family.name);if(!screen)continue;
  if(log.sid!==screen.id)throw Error('Alias screen differs: '+name);
  const ids=new Set(screen.elements.map(e=>e.id));
  const missing=Object.entries(log.map||{}).filter(([,id])=>!ids.has(id)).map(([key])=>key);
  const items=notes.get(screen.id)||[];
  items.push({file,completedActions:log.i??null,recipeActions:log.family.actions?.length??null,mappedKeys:Object.keys(log.map||{}).length,missingMappedKeys:missing,pendingActionKeys:(log.family.actions||[]).filter(a=>!ids.has(log.map?.[a.key])).map(a=>a.key)});notes.set(screen.id,items);
 }
 return notes;
}
async function prepare(){
 const designBytes=await exactFile(DESIGN),document=JSON.parse(designBytes.toString('utf8'));
 if(document.projectId!==PROJECT)throw Error('Unexpected saved design identity');
 validateDocument(structuredClone(document));
 const canonicalBytes=await exactFile(CANONICAL),servedBytes=await exactFile(SERVED);
 const gallery=JSON.parse(canonicalBytes.toString('utf8')),served=JSON.parse(servedBytes.toString('utf8'));
 if(JSON.stringify(normalizedGallery(gallery))!==JSON.stringify(normalizedGallery(served)))throw Error('Gallery data differ beyond asset URL prefixes; inspect first');
 if(gallery.kind!=='reference-analysis-gallery-not-game'||gallery.game!=='ACECRAFT'||gallery.entries?.length!==20)throw Error('Unexpected gallery identity/entry count');
 const screens=document.screens||[],names=new Set(screens.map(s=>s.name));
 if(screens.length!==20||names.size!==20||gallery.entries.some(e=>!names.has(e.boardNameProposal)))throw Error('Final update requires all exact 20 gallery board names in the saved design');
 if(screens.some(s=>!s.elements?.length||s.logicalSize?.w!==420||s.logicalSize?.h!==924))throw Error('A saved board is empty or differs from 420x924');
 const byName=new Map(screens.map(s=>[s.name,s])),byId=new Map(screens.map(s=>[s.id,s]));
 const aliasNotes=await readAliasNotes(screens),usedRefs=new Map(screens.map(s=>[s.id,refsOf(s)]));
 for(const screen of screens)if(!(aliasNotes.get(screen.id)||[]).some(a=>a.recipeActions>0&&a.completedActions>=a.recipeActions))throw Error('No complete alias instruction log for final board: '+screen.name);
 const manifest=JSON.parse((await exactFile(join(WORK,'art-lobby-icons/resource-manifest.json'))).toString('utf8'));
 if(manifest.production!==join(STAGING,'acecraft-lobby-icons-atlas-v001.webp'))throw Error('Unexpected lobby atlas manifest path');
 if(!gallery.assets.some(a=>basename(a.image)==='acecraft-lobby-icons-atlas-v001.webp'))gallery.assets.push({
  name:'로비 역할 아이콘16종 아틀라스',category:'새 로비 원화',image:'../../../src/tools/uxStudio/assets/import-staging/acecraft-20261120/acecraft-lobby-icons-atlas-v001.webp',
  size:[600,600],bytes:manifest.productionBytes,note:'4×4·셀150×150의 새 역할 그림입니다. 원본 아이콘과 세부 모양·색이 다릅니다. 시계와 메뉴 캐비닛의 작은 물리 다이얼 눈금 및 우주 얼굴의 문자처럼 보일 수 있는 무늬가 남아 있어 문자 흔적 전무를 주장하지 않습니다. 하단 네 번째 메뉴 목적지는 미확인입니다.',
  status:'새 제작 제안',screenshotPixelsReused:false,limitations:manifest.knownLimitations||[]});
 if(gallery.assets.length!==15)throw Error('Expected exactly 15 gallery art records');
 for(const asset of gallery.assets){
  const name=basename(asset.image);if(!/^acecraft[-_][A-Za-z0-9_.-]+\.(png|webp|jpg)$/.test(name))throw Error('Unexpected art filename');
  const bytes=await exactFile(join(STAGING,name)),mime=name.endsWith('.png')?'image/png':name.endsWith('.jpg')?'image/jpeg':'image/webp';
  const info=inspectAsset(bytes,mime);
  asset.size=[info.width,info.height];asset.bytes=info.bytes;asset.sha256=sha(bytes);asset.assetRef=info.assetRef;
  asset.usedByNativeBoards=screens.filter(s=>usedRefs.get(s.id).has(info.assetRef)).map(s=>s.id);
  asset.status=asset.usedByNativeBoards.length?'새 제작 자산 · 저장본 사용 확인':'새 제작 자산 · 문서 예시';
 }
 const assetByRef=new Map(gallery.assets.map(a=>[a.assetRef,a]));
 const stamp=kst();
 for(const entry of gallery.entries){
  const s=byName.get(entry.boardNameProposal);if(entry.kind!==s.kind)throw Error('Gallery kind differs: '+s.name);
  const c=countsOf(s,document),aliases=aliasNotes.get(s.id)||[];
  entry.nativeBoardId=s.id;entry.status='정상 UI 저장본 확인 · 검수 대기';entry.nativeStored=true;
  entry.componentCounts=c;entry.nativeStoredRevision=document.revision;entry.nativeSavedAt=document.savedAt;
  entry.nativeAliasInstructions=aliases;
  const actionCount=Math.max(0,...aliases.map(a=>a.recipeActions||0));if(actionCount)entry.recipeActionCount=actionCount;
  entry.actualVerification={...entry.actualVerification,nativeStored:true};
  if(entry.actualVerification.savedAndReopened==='본체확인대기')entry.actualVerification.savedAndReopened='저장본 확인 · 재열기 본체확인대기';
  const knownArt=[...usedRefs.get(s.id)].map(ref=>assetByRef.get(ref)).filter(Boolean).map(a=>a.name);
  entry.nativeAssemblyNotes=[`저장 r${document.revision}: ${c.total}개 native 부품, 입력 대상 ${c.inputRoots}개, 3분할 ${c.sliced3}개, 9분할 ${c.sliced9}개, 출발 연결 ${c.outgoingLinks}개.`,
   '420×924 논리 화면의 실제 저장본을 읽은 기록입니다. 화면 표시·입력·저장 후 재열기 통과는 별도 본체 검수 기록을 따릅니다.',
   '갤러리 예시 자산 중 저장본 사용: '+(knownArt.join(', ')||'없음')+'.'];
  entry.nativeLinks=document.transitions.filter(t=>t.fromScreen===s.id).map(t=>({id:t.id,fromElement:t.fromElement,action:t.action,condition:t.condition,label:t.label,targetScreen:t.targetScreen||null,targetBoardName:byId.get(t.targetScreen)?.name||null}));
  entry.recipeNotes=(entry.recipeNotes||[]).filter(n=>n!=='본체 별도 조립 중; 실제 board 이름/부품 구성/그림 차이는 본체확인대기.');
  if(knownArt.includes('상점 상품6종 아틀라스'))entry.differences=(entry.differences||[]).map(n=>n==='v004에서 지정 그림 슬롯만 새 상품 아틀라스 셀로 교체하는 제안입니다. 실제 제작 반영은 본체확인대기입니다.'?'지정 그림 슬롯에 새 상품 아틀라스를 사용한 저장본을 확인했습니다. 원본 품목의 외형·이름 동일성은 주장하지 않습니다.':n);
  if(s.name==='Page_ACE_Lobby')entry.differences=[...(entry.differences||[]).filter(n=>!n.startsWith('로비16종 아이콘은')), '로비16종 아이콘은 새4×4 아틀라스이며 원본 그림과 다릅니다. 시계·캐비닛 다이얼의 작은 눈금과 문자처럼 보일 수 있는 우주 무늬를 보존한 제안입니다.'];
 }
 const total=screens.reduce((n,s)=>n+s.elements.length,0);
 gallery.status='20보드 정상 UI 저장본 확인 · 최종 검수 대기';gallery.preparedAtKst=stamp;
 gallery.sampleProject={...gallery.sampleProject,designId:PROJECT,workspaceId:WORKSPACE,boardMapping:'20개 대표 보드의 실제 저장 ID 매핑 완료 · 표시·입력 검수는 개별 기록 참조',actualAssembly:'20보드 저장본 확인',storedRevision:document.revision,storedAt:document.savedAt};
 gallery.summary={...gallery.summary,nativeBoards:screens.length,nativePages:screens.filter(s=>s.kind==='page').length,nativeModals:screens.filter(s=>s.kind==='modal').length,nativeElements:total,nativeLinks:document.transitions.length,artRecords:gallery.assets.length,completionClaim:false};
 gallery.guideNotes=gallery.guideNotes.map(n=>n==='20은 로비를 포함한 대표 보드 예정 수입니다. 생성·저장·재열기·입력·실제 화면 검수는 모두 본체확인대기입니다.'?'20은 로비를 포함한 실제 저장 보드 수입니다. 저장본 검사와 정상 UI의 표시·입력·재열기 검수는 구분하며, 개별 검수 기록을 따릅니다.':n);
 gallery.verification.nativeSnapshot={designPath:DESIGN,projectId:PROJECT,revision:document.revision,savedAt:document.savedAt,sha256:sha(designBytes),checkedAtKst:stamp,canonicalModelValidation:true,boardNamesMatched:20,sourceOnly:true,browserUsed:false,scope:'실제 저장본의 ID·논리 크기·부품·연결·새 자산 참조를 읽었습니다. 이 도우미는 브라우저를 실행하지 않았으며 실제 표시·입력·재열기 검수 여부는 개별 기록을 보존합니다.'};
 gallery.verification.imagePathCheck={...gallery.verification.imagePathCheck,currentReferenceImages:gallery.entries.length,newAssetImages:15,currentLocalFilesExist:gallery.entries.length+15,newAssetHeadersInspected:15,previousDecodeRecord:'기존 localFilesExistAndDecode 값은 이전 정적 검사 기록이며 이번 실행의 전체 재디코드 수가 아닙니다.'};
 gallery.recipeReview={...gallery.recipeReview,version:'lists-shops-v007 / modals-v004 / recruits-v002 + 정상 UI 보정',status:'실제 저장 ID·부품수와 alias 조립 지침을 대조',sources:['recipes-lists-shops.reviewed-v007.json','recipes-modals.reviewed-v004.json','recipes-recruits.reviewed-v002.json'].map(n=>join(WORK,n)),actualUiApplied:true,applicationEvidence:'Complete normal UI alias instructions and saved native boards; actual visual/input verification stays separate'};
 const servedOutput=structuredClone(gallery);for(const a of servedOutput.assets)a.image='/ui-studio/source/assets/import-staging/acecraft-20261120/'+basename(a.image);
 if(sha(await exactFile(DESIGN))!==sha(designBytes))throw Error('Design saved during preparation; rerun after the final UI save settles');
 return {gallery,servedOutput,canonicalBytes,servedBytes,designSHA256:sha(designBytes),report:{kind:'documentation-gallery-update-not-design',revision:document.revision,screens:screens.length,elements:total,links:document.transitions.length,assets:gallery.assets.length,designSHA256:sha(designBytes),actualUiVerifiedByHelper:false}};
}
async function main(){
 const args=process.argv.slice(2);if(args.some(a=>!['--apply','--help'].includes(a)))throw Error('Usage: node update-gallery-final.mjs [--apply]');
 if(args.includes('--help')){console.log('Run only after root saves the final20 boards. Default: JSON preview, no writes. --apply: back up and update only both ACE gallery data.json files. No browser verification claim.');return;}
 const result=await prepare();
 if(!args.includes('--apply')){console.log(fmt({...result.report,mode:'preview-no-writes',outputs:[CANONICAL,SERVED]}));return;}
 // Read stability is checked before any backup/write. A concurrent edit must never be overwritten.
 if(sha(await exactFile(CANONICAL))!==sha(result.canonicalBytes)||sha(await exactFile(SERVED))!==sha(result.servedBytes)||sha(await exactFile(DESIGN))!==result.designSHA256)throw Error('Input changed before apply; no files written');
 const stamp=kst().replace(/[-:]/g,'');const backup=join(ROOT,'docs/planning/_backup',stamp.slice(0,8)+'_단이',stamp.slice(9,15)+'_acecraft_gallery_data');
 await mkdir(backup,{recursive:true});await copyFile(CANONICAL,join(backup,'canonical-data.json'));await copyFile(SERVED,join(backup,'served-data.json'));
 await writeFile(CANONICAL,fmt(result.gallery));await writeFile(SERVED,fmt(result.servedOutput));
 console.log(fmt({...result.report,mode:'applied-docs-only',backup,outputs:[CANONICAL,SERVED],designUnchanged:sha(await exactFile(DESIGN))===result.designSHA256}));
}
main().catch(error=>{console.error(fmt({kind:'documentation-gallery-update-not-design',error:error.message}));process.exitCode=1;});
