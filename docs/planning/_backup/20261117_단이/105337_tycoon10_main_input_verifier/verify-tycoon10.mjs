// Read-only Tycoon saved-file checks. No browser, HTTP, UI mutation, evidence writes or design writes.
// Pending snapshot: node _작업/codex/ux-studio/verify-tycoon10.mjs --completed-through=45
// Final snapshot:   node _작업/codex/ux-studio/verify-tycoon10.mjs --final [--json]
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual as equal} from 'node:util';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../..');
const local=p=>resolve(root,p), sha=b=>createHash('sha256').update(b).digest('hex');
const args=process.argv.slice(2), final=args.includes('--final'), full=args.includes('--json');
const stageArg=args.find(x=>x.startsWith('--completed-through='));
const completedThrough=final?69:stageArg?Number(stageArg.split('=')[1]):45;
if(!Number.isInteger(completedThrough)||completedThrough < -1||completedThrough > 69) throw Error('completed-through must be -1..69.');
if(args.some(x=>!['--final','--json'].includes(x)&&!x.startsWith('--completed-through='))) throw Error('Unknown argument.');
const designPath='samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json';
const backupPath='docs/planning/_backup/20261117_단이/0953_tycoon10_native/'+designPath;
const recipePath='_작업/codex/ux-studio/tycoon10-native-recipe.mjs';
const [bytes,baselineBytes]=await Promise.all([readFile(local(designPath)),readFile(local(backupPath))]);
const doc=JSON.parse(bytes),old=JSON.parse(baselineBytes);
const {operations,assets,metadata}=await import(pathToFileURL(local(recipePath)));
const {resolveRect,validateDocument}=await import(pathToFileURL(local('src/tools/uxStudio/model.mjs')));
const {inspectAsset}=await import(pathToFileURL(local('src/tools/uxStudio/asset-store.mjs')));
const checks=[],diffs=[],color=x=>String(x??'').toLowerCase(),near=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=0.04;
const check=(name,ok,detail,{pending=false}={})=>{
  const status=ok?'pass':pending&&!final?'expectedPending':'fail';
  checks.push({name,status,...(detail===undefined?{}:{detail})});
};
const unitCheck=(unit,name,ok,detail)=>check(name,ok,detail,{pending:unit.index>completedThrough});
const finalCheck=(name,ok,detail)=>check(name,ok,detail,{pending:true});
const result={
  checkedAt:new Date().toISOString(),mode:final?'final':'in-progress',completedThrough,
  revision:doc.revision,baselineRevision:old.revision,designPath,backupPath,recipePath,
  designSHA256:sha(bytes),counts:{screens:doc.screens.length,parts:doc.screens.reduce((n,s)=>n+s.elements.length,0),transitions:doc.transitions.length},
  intendedRecipeDifferences:[{key:'scene',recipeFit:'contain',savedFitExpected:'cover',topArchHeightExpected:64,reason:'Owner intentional crop proposal. This is a saved configuration check, not visual crop equivalence.'}],
  limits:[
    'Read-only local saved-model/asset verification only: no browser/HTTP/nativeAX calls, no writes or actual UI input/visual QA.',
    'Style fields are saved results expected from native AX editing; this script cannot prove how the edits were performed.',
    'Default completedThrough45 is the assigned historical checkpoint, not a completion inference. Use --completed-through=N for an intermediate snapshot, --final for strict final checks.',
    'Assertion counts and recipe/checkpoint counts are not UI completion rates or original-screen equivalence.',
    'Native font/pixel equality, exact original species/person, game/ranking/reward/countdown APIs and unknown Info body remain unverified.',
    'Intentional source cover+64px arch crop differs from recipe contain. Saved clipping setting alone does not prove actual rendered clip quality.'
  ]
};
try{validateDocument(doc);check('saved model validateDocument',true);}catch(e){check('saved model validateDocument',false,e.message);}
check('baseline is r200 nine screens eighteen transitions',old.revision===200&&old.screens.length===9&&old.transitions.length===18);
const originalIds=new Set(old.screens.map(s=>s.id));
check('previous nine screens deep equal by stable ID',old.screens.every(s=>equal(doc.screens.find(n=>n.id===s.id),s)),old.screens.map(s=>({id:s.id,name:s.name,unchanged:equal(doc.screens.find(n=>n.id===s.id),s)})));
check('previous nine screen order preserved',equal(doc.screens.filter(s=>originalIds.has(s.id)).map(s=>s.id),old.screens.map(s=>s.id)));
check('previous eighteen transitions exactly preserved',old.transitions.every(t=>doc.transitions.some(n=>equal(t,n))));
check('entry project fixtures unchanged',doc.projectId===old.projectId&&doc.entryScreen===old.entryScreen&&equal(doc.fixtures,old.fixtures));
const added=doc.screens.filter(s=>!originalIds.has(s.id));
check('one added Tycoon screen only',added.length===1&&added[0]?.name==='Modal_Event_TycoonExpress',added.map(s=>({id:s.id,name:s.name})));
const screen=added.find(s=>s.name==='Modal_Event_TycoonExpress');
if(screen){
  result.screenId=screen.id; result.counts.tycoonParts=screen.elements.length;
  const elements=screen.elements,byName=new Map();
  for(const e of elements){if(!byName.has(e.name))byName.set(e.name,[]);byName.get(e.name).push(e);}
  const get=name=>byName.get(name)?.length===1?byName.get(name)[0]:undefined;
  const content=get('Group_Tycoon_Content'),dim=get('Dim_Tycoon_Backdrop');
  const units=[];
  for(let index=0;index<operations.length;index++){
    const operation=operations[index],unit={...operation,index};
    units.push(unit);
    if(operation.cloneFromKey){
      const children=operations.filter(v=>v.parentKey===operation.cloneFromKey);
      const overrides=operation.descendantOverrides??[];
      check('recipe clone contract '+operation.key,children.length===13&&overrides.length===13&&new Set(overrides.map(v=>v.originalName)).size===13&&overrides.every(v=>Object.keys(v).every(k=>['originalName','sourceRole','name','nativeText','assetRole'].includes(k))&&children.some(c=>c.name===v.originalName&&c.sourceRole===v.sourceRole)));
      for(const child of children){
        const override=overrides.find(v=>v.originalName===child.name&&v.sourceRole===child.sourceRole);
        if(!override)continue;
        const {originalName,...changes}=override;
        const expanded={...child,...changes,key:operation.key+'::'+child.sourceRole,parentKey:operation.key,index,clonedFromKey:child.key};
        if(changes.assetRole)expanded.imageRegion=assets[changes.assetRole].imageRegion;
        units.push(expanded);
      }
    }
  }
  result.expected={recipeOps:operations.length,expandedUnits:units.length,cloneChildren:units.length-operations.length,extraRootAndDim:2,tycoonParts:units.length+2,totalParts:old.screens.reduce((n,s)=>n+s.elements.length,0)+units.length+2,transitions:old.transitions.length+2};
  check('recipe seventy ops plus twenty-six clone children',operations.length===70&&metadata.operationCount===70&&units.length===96&&new Set(units.map(u=>u.name)).size===96);
  const expectedNames=new Set([...units.map(u=>u.name),'Group_Tycoon_Content','Dim_Tycoon_Backdrop']);
  check('no duplicated Tycoon names',[...byName.values()].every(v=>v.length===1),[...byName].filter(([,v])=>v.length!==1).map(([name,v])=>({name,count:v.length})));
  finalCheck('only recipe units plus ROOT and Dim; template/oldClose removed',elements.length===98&&elements.every(e=>expectedNames.has(e.name)),elements.filter(e=>!expectedNames.has(e.name)).map(e=>({id:e.id,name:e.name})));
  finalCheck('no temporary or foreign copied names',elements.every(e=>!(/template|temp|복사|_Shop_/i.test(e.name))),elements.filter(e=>/template|temp|복사|_Shop_/i.test(e.name)).map(e=>e.name));
  finalCheck('fullscreen modal engine dim disabled',screen.kind==='modal'&&equal(screen.logicalSize,{w:551,h:984})&&screen.presentation?.rootMode==='fullscreen'&&screen.presentation?.dim===false&&screen.presentation?.blocking===true&&screen.presentation?.dismissOnEscape===true&&screen.presentation?.closePolicy==='allow',screen.presentation);
  finalCheck('single full-screen black0.7 native dim',Boolean(dim)&&elements.filter(e=>/dim|backdrop/i.test(e.name)).length===1&&!dim.parentId&&dim.kind==='panel'&&!dim.image&&!dim.skin&&dim.appearance?.shape==='rectangle'&&color(dim.appearance?.fill)==='#000000'&&near(dim.appearance.opacity,0.7)&&near(dim.appearance.strokeWidth??0,0)&&equal(dim.rectTransform?.min,[0,0])&&equal(dim.rectTransform?.max,[1,1])&&equal(dim.rectTransform?.position,[0,0])&&equal(dim.rectTransform?.sizeDelta,[0,0]),dim&&{id:dim.id,appearance:dim.appearance,rectTransform:dim.rectTransform});
  finalCheck('centered551x984 native ROOT outside dim',Boolean(content)&&!content.parentId&&content.isGroup===true&&equal(content.rectTransform?.min,[0.5,0.5])&&equal(content.rectTransform?.max,[0.5,0.5])&&equal(content.rectTransform?.pivot,[0.5,0.5])&&equal(content.rectTransform?.position,[0,0])&&equal(content.rectTransform?.sizeDelta,[551,984]),content?.rectTransform);
  const unitMap=new Map(units.map(u=>[u.key,u])),actualFor=u=>get(u.name);
  // Reused Close is a native button compound; parentId owns its glyph without isGroup.
  const validReusedClose=e=>{
    if(!e||e.kind!=='button')return false;
    const children=elements.filter(child=>child.parentId===e.id);
    const glyph=children[0];
    return children.length===1&&glyph.name==='Txt_Tycoon_CloseGlyph'&&glyph.kind==='text'&&glyph.partRole==='label'&&glyph.text==='×'&&glyph.interaction?.mode==='parent'&&e.interaction?.mode==='action'&&e.interaction?.enabled===true&&e.interaction?.shape==='rectangle'&&e.buttonState?.enabled===true&&e.buttonState?.mode==='tint'&&e.buttonState?.targetGraphic==='self';
  };
  const align={가운데:'center',왼쪽:'left',오른쪽:'right'},vertical={가운데:'middle',위:'top',아래:'bottom'};
  // Native visual adjustment after r242 render: source font is unknown, geometry remains recipe-exact.
  const nativeFontCorrections=new Map([
    ['Txt_Tycoon_Timer',18],
    ...[1,2,3,4].flatMap(rank=>['Dice','Cash'].map(role=>['Txt_Tycoon_Rank0'+rank+'_'+role+'Qty',17])),
    ['Txt_Tycoon_SelfRank_CashQty',17]
  ]);
  result.intendedRecipeDifferences.push({key:'native-fallback-font-fit',savedRevisionObserved:245,reason:'Actual r242 render wrapped the final timer syllable and made Rank01 dice/cash text touch. Native UI reduced timer20→18 and reward quantities19→17, all nowrap; source font unknown. Original recipe/geometry/text/counters remain unchanged.',fields:[...nativeFontCorrections].map(([name,fontSize])=>({name,fontSize,wrap:'nowrap',recipeFontSize:name==='Txt_Tycoon_Timer'?20:19}))});

  const checkAsset=async(unit,e)=>{
    const a=assets[unit.assetRole],im=unit.op==='image'?e.image:e.skin?.textures?.normal;
    if(!a){unitCheck(unit,'known asset role '+unit.key,false,unit.assetRole);return;}
    const expectedRef='sha256-'+a.sha+'.webp',source=unit.op==='image'?im?.sourceSize:[im?.w,im?.h];
    unitCheck(unit,'assetRef and sourceSize '+unit.key,im?.assetRef===expectedRef&&equal(source,a.sourceSize),{actualRef:im?.assetRef,actualSourceSize:source,expectedRef,expectedSourceSize:a.sourceSize});
    if(unit.op==='image'){
      const region=im?.region??[0,0,...(im?.sourceSize??[])],fit=unit.key==='scene'?'cover':unit.fit;
      unitCheck(unit,'image region fit ownership '+unit.key,e.kind==='image'&&e.interaction?.mode===unit.interaction&&equal(region,unit.imageRegion)&&im?.fit===fit,{actualRegion:region,expectedRegion:unit.imageRegion,actualFit:im?.fit,expectedFit:fit});
      if(unit.key==='scene')unitCheck(unit,'intentional scene cover top arch64',im?.fit==='cover'&&im?.topArchHeight===64,{recipeFit:unit.fit,actualFit:im?.fit,topArchHeight:im?.topArchHeight});
    }
    if(unit.frameMode)unitCheck(unit,'native9/3 slices edges pad '+unit.key,e.kind==='panel'&&e.skin?.mode===unit.frameMode&&equal(e.skin.slices,unit.slices)&&equal(e.skin.edges,unit.edges)&&equal(e.skin.padding,unit.padding),e.skin&&{mode:e.skin.mode,slices:e.skin.slices,edges:e.skin.edges,padding:e.skin.padding});
  };
  for(const unit of units){
    const e=actualFor(unit);
    if(!e){unitCheck(unit,'present '+unit.key,false,{name:unit.name});continue;}
    const parent=unit.parentKey==='ROOT'?content:actualFor(unitMap.get(unit.parentKey)??{name:''});
    let rect,error;
    try{
      const actual=resolveRect(screen,e.id,551,984),pr=parent?resolveRect(screen,parent.id,551,984):{x:0,y:0};
      rect=[actual.x-pr.x,actual.y-pr.y,actual.w,actual.h];
    }catch(err){error=err.message;}
    unitCheck(unit,'native parent and px rect '+unit.key,Boolean(parent)&&e.parentId===parent.id&&Boolean(rect)&&rect.every((v,i)=>near(v,unit.rect[i])),{id:e.id,name:e.name,parentId:e.parentId,expectedParent:parent?.id,actualRect:rect,expectedRect:unit.rect,...(error?{error}:{})});
    if(unit.op==='group'){
      unitCheck(unit,'native group kind '+unit.key,e.kind===unit.kind&&(unit.key==='close'?validReusedClose(e):e.isGroup===true),{kind:e.kind,isGroup:e.isGroup,...(unit.key==='close'?{reusedNativeButton:true,children:elements.filter(child=>child.parentId===e.id).map(child=>({name:child.name,parentId:child.parentId})),interaction:e.interaction,buttonState:e.buttonState}:{})});
      if(unit.overflow)unitCheck(unit,'native overflow '+unit.key,e.overflow===unit.overflow,{actual:e.overflow,expected:unit.overflow});
    }
    if(unit.nativeText!==undefined){
      const correctedSize=nativeFontCorrections.get(unit.name);
      const st=correctedSize===undefined?unit.style:{...unit.style,size:correctedSize},ty=e.typography??{},ap=e.appearance??{};
      if(correctedSize!==undefined)unitCheck(unit,'native visual fit nowrap '+unit.key,ty.wrap==='nowrap',{wrap:ty.wrap,expected:'nowrap',recipeFontSize:unit.style.size,expectedNativeFontSize:correctedSize});
      unitCheck(unit,'native text '+unit.key,e.kind==='text'&&e.partRole==='label'&&e.text===unit.nativeText,{text:e.text,expected:unit.nativeText});
      unitCheck(unit,'saved nativeAX typography '+unit.key,near(e.fontSize,st.size)&&near(ty.weight,st.weight)&&near(ty.lineHeight,st.line)&&ty.align===(align[st.align]??st.align)&&ty.vertical===(vertical[st.vertical]??st.vertical)&&color(ap.textColor)===color(st.color)&&near(ty.strokeWidth??0,st.stroke)&&(!st.stroke||color(ty.strokeColor)===color(st.strokeColor)),{fontSize:e.fontSize,typography:ty,textColor:ap.textColor,expected:st});
    }
    if(unit.op==='solid'){
      const ap=e.appearance??{},st=unit.style;
      unitCheck(unit,'native solid style '+unit.key,e.kind==='panel'&&!e.image&&!e.skin&&ap.shape===unit.geometry&&color(ap.fill)===color(st.fill)&&near(ap.opacity??1,st.opacity)&&near(ap.strokeWidth??0,st.strokeWidth)&&(!st.strokeWidth||color(ap.stroke)===color(st.strokeColor)),{actual:ap,expected:st,geometry:unit.geometry});
    }
    if(unit.assetRole)await checkAsset(unit,e);
  }
  for(const key of ['rank-2','rank-3']){
    const u=unitMap.get(key),g=actualFor(u),expected=units.filter(v=>v.parentKey===key);
    const children=g?elements.filter(e=>e.parentId===g.id):[];
    unitCheck(u,'thirteen clone children preserved '+key,Boolean(g)&&children.length===13&&expected.length===13&&expected.every(v=>children.some(e=>e.name===v.name)),{actualChildren:children.map(e=>e.name),expectedChildren:expected.map(v=>v.name)});
  }
  const rows=['rank-1','rank-2','rank-3','rank-4','self-row'];
  finalCheck('all five rows share normalized486.87x75.88 geometry',rows.every(key=>{
    const e=actualFor(unitMap.get(key));if(!e)return false;
    const r=resolveRect(screen,e.id,551,984);return near(r.w,metadata.geometry.rowSize[0])&&near(r.h,metadata.geometry.rowSize[1]);
  }));
  for(const [groupKey,columns] of [['rank-2',['avatar','name','score-bg','score-pet','score','pack','dice','dice-qty','cash','cash-qty']],['rank-3',['avatar','name','score-bg','score-pet','score','pack','dice','dice-qty','cash','cash-qty']]]){
    const n=groupKey.at(-1),g=actualFor(unitMap.get(groupKey));
    finalCheck('same ranking columns '+groupKey,Boolean(g)&&columns.every(column=>{
      const source=operations.find(u=>u.key==='r1-'+column),override=operations.find(u=>u.key===groupKey)?.descendantOverrides.find(v=>v.originalName===source?.name);
      const e=override&&get(override.name);if(!source||!e)return false;
      const r=resolveRect(screen,e.id,551,984),pr=resolveRect(screen,g.id,551,984);
      return [r.x-pr.x,r.y-pr.y,r.w,r.h].every((v,i)=>near(v,source.rect[i]));
    }));
  }
  const self=actualFor(unitMap.get('self-row')),viewport=actualFor(unitMap.get('rank-viewport')),panel=actualFor(unitMap.get('panel'));
  finalCheck('fixed self sibling outside scroll viewport',Boolean(self&&viewport&&panel)&&self.parentId===panel.id&&viewport.parentId===panel.id&&elements.indexOf(self)>elements.indexOf(viewport));
  finalCheck('rank4 unknown values blank and avatar absent',['r4-score','r4-dice-qty','r4-cash-qty'].every(k=>actualFor(unitMap.get(k))?.text==='')&&!elements.some(e=>e.name==='Img_Tycoon_Rank04_Avatar'));
  finalCheck('575 departure and own22/현중/104/40K exact',[['departure-suffix','575에서 출발합니다.'],['self-rank','22'],['self-name','현중'],['self-score','104'],['self-cash-qty','40K']].every(([k,v])=>actualFor(unitMap.get(k))?.text===v));
  const close=actualFor(unitMap.get('close')),info=actualFor(unitMap.get('info'));
  for(const key of ['close','info']){
    const e=actualFor(unitMap.get(key));let r;
    if(e)r=resolveRect(screen,e.id,551,984);
    finalCheck('44 square native '+key,Boolean(e)&&e.kind==='button'&&(key==='close'?validReusedClose(e):e.isGroup===true)&&near(r.w,44)&&near(r.h,44)&&!e.skin,{name:e?.name,kind:e?.kind,rect:r,hasLegacySkin:Boolean(e?.skin)});
  }
  const addedEdges=doc.transitions.filter(t=>!old.transitions.some(n=>equal(t,n)));
  const incoming=addedEdges.filter(t=>t.fromScreen==='main'&&t.targetScreen===screen.id&&t.action==='open');
  const outgoing=addedEdges.filter(t=>t.fromScreen===screen.id);
  finalCheck('only Main entry and native Close always edges',addedEdges.length===2&&incoming.length===1&&incoming[0].condition==='always'&&outgoing.length===1&&outgoing[0].action==='close'&&outgoing[0].fromElement===close?.id&&outgoing[0].condition==='always',addedEdges);
  finalCheck('native Close edge label identifies Tycoon',outgoing.length===1&&/타이쿤|tycoon|발자국|익스프레스/i.test(outgoing[0].label??'')&&!/shop|상점/i.test(outgoing[0].label??''),outgoing.map(t=>({id:t.id,label:t.label})));
  finalCheck('Info has no unseen target or invented body',Boolean(info)&&!doc.transitions.some(t=>t.fromScreen===screen.id&&t.fromElement===info.id));
  const seen=new Set();
  for(const unit of units){
    const e=actualFor(unit);if(!e||!unit.assetRole)continue;
    const a=assets[unit.assetRole],im=unit.op==='image'?e.image:e.skin?.textures?.normal,ref=im?.assetRef;
    if(!ref||seen.has(ref))continue;seen.add(ref);
    try{
      if(!/^sha256-[a-f0-9]{64}\.webp$/.test(ref))throw Error('Unexpected registered reference format');
      const registeredPath='samples/monopoly-go/ui-studio/assets/'+ref,registered=await readFile(local(registeredPath)),info=inspectAsset(registered,'image/webp');
      check('actual registered asset SHA and dimensions '+ref,sha(registered)===a.sha&&info.assetRef===ref&&equal([info.width,info.height],a.sourceSize),{path:registeredPath,sourceSize:[info.width,info.height],bytes:registered.length});
    }catch(err){unitCheck(unit,'registered asset readable '+ref,false,err.message);}
  }
  result.uniqueRegisteredAssetRefsChecked=seen.size;
  for(const [role,a] of Object.entries(assets)){
    try{
      const stagingPath=a.path.replace(/^\/ui-studio\/source\//,'src/tools/uxStudio/');
      if(!stagingPath.startsWith('src/tools/uxStudio/assets/import-staging/'))throw Error('Unexpected local staging path');
      const productionPath=stagingPath.replace('src/tools/uxStudio/assets/import-staging/','samples/monopoly-go/ui-studio/assets/production/');
      const [staging,production]=await Promise.all([readFile(local(stagingPath)),readFile(local(productionPath))]);
      const info=inspectAsset(staging,'image/webp');
      check('local production staging SHA sourceSize '+role,sha(staging)===a.sha&&sha(production)===a.sha&&staging.equals(production)&&equal([info.width,info.height],a.sourceSize),{productionPath,stagingPath,sourceSize:[info.width,info.height]});
    }catch(err){check('local production staging readable '+role,false,err.message);}
  }
  finalCheck('final ten screens899parts20edges',doc.screens.length===10&&result.counts.parts===result.expected.totalParts&&doc.transitions.length===result.expected.transitions,{actual:result.counts,expected:result.expected});
}
result.snapshotUnchangedAtEnd=sha(await readFile(local(designPath)))===result.designSHA256;
result.summary={passed:checks.filter(c=>c.status==='pass').length,expectedPending:checks.filter(c=>c.status==='expectedPending').length,failed:checks.filter(c=>c.status==='fail').length,assertionCount:checks.length};
result.summary.savedChecksPass=result.summary.failed===0&&(final?result.summary.expectedPending===0:true)&&result.snapshotUnchangedAtEnd;
result.checks=checks;
const output=full?result:{...result,checks:undefined,failed:checks.filter(c=>c.status==='fail'),expectedPending:checks.filter(c=>c.status==='expectedPending')};
console.log(JSON.stringify(output,null,2));
if(!result.snapshotUnchangedAtEnd)process.exitCode=2;
else if(!result.summary.savedChecksPass)process.exitCode=1;
