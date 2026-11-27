// Install after acecraft-native-fast.install(). All edits use its normal UI helpers/selectors.
// No saved-design/model access, API calls, DOM mutations, browser storage, or filesystem writes.
// Call t.invalidateCopy() immediately after any copy/cut performed outside this wrapper.
export async function installCopy(t,th,fs,write){
 const base=t.action;
 if(typeof base!=='function')throw Error('Install the native action helpers before installCopy.');
 for(const name of ['screen','pick','command','names','name','abs','parent','rect','tab','pane','set','text','addText','remove','metrics','shadow','openFor'])if(typeof t[name]!=='function')throw Error('Missing normal UI helper: '+name);
 const cwd='/Users/max/Documents/Codex/2026-11-11/new-chat';
 const read=async file=>{
  const log=JSON.parse(await fs.readFile(cwd+'/'+file,'utf8'));
  if(!/^Page_ACE_/.test(log.family?.name||'')||!Array.isArray(log.family.actions)||typeof log.sid!=='string'||!log.map)throw Error('Invalid ACE normal UI alias log: '+file);
  return log;
 };
 const hm=await read('acecraft-honk-ui-map.json');
 const rm=await read('acecraft-RadiantPact-ui-map.json');
 const om=await read('acecraft-OverdriveRecruit-ui-map.json');
 const tm=new Map(),sp=new Map();
 const explicitChildren=(family,key)=>family.actions.some(a=>a.parent===key);
 const template=(log,key,n)=>{
  const a=log.family.actions.find(a=>a.key===key),id=log.map[key];
  if(!a?.skin||typeof id!=='string'||explicitChildren(log.family,key)||n===2&&(a.op!=='button'||!a.text))throw Error('Unsafe or incomplete copy template '+log.family.id+'/'+key);
  return {sid:log.sid,id,n,skin:a.skin,key,family:log.family.id};
 };
 for(const [log,key] of [[hm,'RecruitOnce'],[hm,'RecruitTen'],[om,'Help'],[rm,'History']]){const x=template(log,key,2);tm.set(x.skin,x);}
 for(const log of [hm,rm,om])for(const a of log.family.actions){
  if(a.op!=='panel'||!a.skin||explicitChildren(log.family,a.key)||!log.map[a.key]||sp.has(a.skin))continue;
  const x=template(log,a.key,1);sp.set(x.skin,x);
 }
 let clipboardKey=null;
 t.invalidateCopy=()=>{clipboardKey=null;};
 const currentScreen=async()=>new URL(await th.url()).searchParams.get('screen');
 const targetNames=async sid=>{
  if(await currentScreen()!==sid)await t.screen(sid);
  await t.p.getByRole('button',{name:'레이어',exact:true}).click();
  const filter=t.p.locator('#tree-search');
  if(await filter.count()&&await filter.evaluate(e=>e.value))throw Error('레이어 검색을 비운 뒤 복사 조립을 다시 실행하세요.');
  // Hidden rows defeat both duplicate-name and new-ID checks. Fail closed rather than duplicating.
  if(await t.p.locator('.layer-item[aria-expanded="false"] > .layer-row > button.layer-expand:not([disabled])').count())throw Error('대상 화면의 접힌 레이어를 펼친 뒤 복사 조립을 다시 실행하세요.');
  return t.names();
 };
 const setPx=async()=>{await t.pane('layer');if(await t.p.locator('[data-transform-unit]').count())await t.set('[data-transform-unit]','px');};
 const rootInput=async(id,a)=>{
  await t.pick(id);await t.tab('general');
  await t.set('[data-part-field="partRole"]','background');
  if(a.op==='button'){
   await t.set('[data-part-field="mode"]','action');
   const enabled=t.p.locator('[data-part-field="enabled"]');await t.openFor(enabled);await enabled.setChecked(true);
   await t.set('[data-part-field="reason"]','');
   const state=t.p.locator('[data-button-field="enabled"]');await t.openFor(state);await state.setChecked(true);
  }else await t.set('[data-part-field="mode"]',a.inputMode||'none');
 };
 t.action=async raw=>{
  const a={...raw,weight:raw.weight==='bold'?700:raw.weight,transparent:raw.transparent||raw.hitAreaOnly,skinMetrics:raw.skinMetrics||raw.skinMetrics4};
  if(!['panel','button'].includes(a.op))return base(a);
  if(!t.job?.sid||!t.job.map||!t.job.family?.actions)throw Error('A normal UI job with sid/map/family.actions is required.');
  if(typeof a.name!=='string'||!a.name||!a.key)throw Error('Copy action requires a unique name and key.');
  if(!a.rect||!['x','y','w','h'].every(k=>Number.isFinite(a.rect[k]))||a.rect.w<=0||a.rect.h<=0||a.text&&a.rect.w<=8)throw Error('Invalid ABS rectangle for '+a.key);
  if(a.opacity!==undefined&&(!Number.isFinite(a.opacity)||a.opacity<0||a.opacity>1))throw Error('Invalid opacity for '+a.key);
  if(a.op==='button'&&!a.transparent&&a.skin&&a.inputMode&&a.inputMode!=='action')throw Error('Copy button roots require action mode with buttonState. Check this recipe before any UI edit.');
  const sid=t.job.sid,parent=a.parent?t.job.map[a.parent]:null;
  if(a.parent&&!parent)throw Error('Parent alias is not built: '+a.parent);
  const captionName=a.name.replace(/^Btn_/,'Txt_')+'_Caption';
  const before=await targetNames(sid);
  if(before.some(e=>e.name===a.name||a.text&&e.name===captionName))throw Error('같은 이름의 부품이 이미 있습니다. 자동 복제하지 않습니다: '+a.name+' · 기존 부분 작업을 수동 확인하세요.');
  // A source-less X/backdrop button must not become a white skin backplate.
  if(a.op==='button'&&(a.transparent||!a.skin))return base({...a,transparent:true});
  // Copying a buttonState-bearing template into mode=none violates the canonical validator.
  const source=a.op==='panel'?sp.get(a.skin):(tm.get(a.skin)||sp.get(a.skin));
  if(!source)return base(a);
  const ownKey=source.n+'|'+a.skin;
  let newIds=[];
  try{
   if(clipboardKey!==ownKey){
    await t.screen(source.sid);await t.pick(source.id);await t.command('copy');
    clipboardKey=ownKey;
   }
   const immediatelyBefore=await targetNames(sid),beforeNamesSet=new Set(immediatelyBefore.map(e=>e.id));
   if(immediatelyBefore.some(e=>e.name===a.name||a.text&&e.name===captionName))throw Error('대상 이름이 이미 생겼습니다. 중복 생성 전에 수동 확인: '+a.name);
   await t.command('paste');
   const after=await t.names();newIds=after.filter(e=>!beforeNamesSet.has(e.id)).map(e=>e.id);
   const selected=t.p.locator('button.layer-select.active[data-element]');
   if(await selected.count()!==1)throw Error('붙여넣은 root 선택이 1개가 아닙니다.');
   const id=await selected.getAttribute('data-element');
   if(newIds.length!==source.n||!newIds.includes(id))throw Error('복사 부품 수/root ID가 다릅니다: expected='+source.n+' actual='+newIds.length+' selected='+id);
   let captionId=source.n===2?newIds.find(x=>x!==id):null;
   await t.name(a.name);await setPx();await t.abs(id,a.rect,parent);
   await rootInput(id,a);
   if(captionId){
    await t.pick(captionId);await t.tab('general');
    const kind=t.p.locator('[data-field="kind"]');
    if(await kind.evaluate(e=>e.value)!=='text')throw Error('두 번째 복사 부품이 caption text가 아닙니다: '+captionId);
   }
   if(!a.text){if(captionId)await t.remove(captionId);captionId=null;}
   else{
    if(!captionId)captionId=await t.addText(captionName,a.text,{x:a.rect.x+4,y:a.rect.y,w:a.rect.w-8,h:a.rect.h},a.size||16,a.weight||700,a.color||'#493329',id,a.align||'center');
    await t.pick(captionId);await t.name(captionName);await t.parent(id);await setPx();
    await t.rect({x:4,y:0,w:a.rect.w-8,h:a.rect.h});
    await t.text(a.text,a.size||16,a.weight||700,a.align||'center');
    await t.set('[data-field="appearance.textColor"]',a.color||'#493329');
    await t.set('[data-part-field="partRole"]','label');
    await t.set('[data-part-field="mode"]','parent');
   }
   await t.metrics(id,a.skinMetrics);await t.shadow(id);
   await t.pick(id);await t.tab('general');await t.set('[data-field="appearance.opacity"]',a.opacity??1);
   if(a.anchorPreset&&a.anchorPreset!=='percent'){await t.tab('layout');await t.set('[data-responsive-field="anchor.preset"]',a.anchorPreset);}
   if(a.overflow){await t.pick(id);await t.tab('layout');await t.set('[data-responsive-field="overflow"]',a.overflow);await t.set('[data-responsive-field="scrollbar"]','hidden');}
   t.job.map[a.key]=id;
   // Only a two-part button with no explicit recipe descendants may become another template.
   if(a.op==='button'&&a.text&&captionId&&!explicitChildren(t.job.family,a.key))tm.set(a.skin,{sid,id,n:2,skin:a.skin,key:a.key,family:t.job.family.id});
   write?.({kind:'normal-ui-copy-result',family:t.job.family.id,key:a.key,id,captionId,copiedParts:source.n,source:{sid:source.sid,id:source.id},clipboardKey:ownKey});
   return id;
  }catch(error){
   clipboardKey=null;
   throw Error('정상 UI copy 중단; 자동 재시도/정리는 하지 않았습니다. 대상='+sid+' key='+a.key+' 새ID='+newIds.join(',')+' · '+error.message);
  }
 };
 write?.({kind:'normal-ui-copy-installed',twoPartSkins:[...tm.keys()],singlePartSkins:[...sp.keys()],note:'After external manual copy/cut call t.invalidateCopy(). UI validation remains root responsibility.'});
 return t;
}
