// Optional normal UI text copy accelerator. Install after installCopy; root decides when.
// No model/design reads, filesystem writes, network calls, storage or DOM mutations.
export async function installTextCopy(t,th,fs,write){
 const base=t.addText,command=t.command,invalidate=t.invalidateCopy;
 if(t.__normalTextCopyInstalled)throw Error('Text copy wrapper is already installed.');
 for(const key of ['addText','command','screen','pick','names','name','abs','pane','tab','set'])if(typeof t[key]!=='function')throw Error('Missing normal UI helper: '+key);
 const cwd='/Users/max/Documents/Codex/2026-11-11/new-chat';
 const templates=new Map(),blocked=new Set();
 const style=(size,weight,color,align)=>({fontSize:Number(size),'typography.weight':Number(weight),'typography.lineHeight':Math.ceil(Number(size)*1.2),'typography.align':align,'appearance.textColor':String(color).toLowerCase()});
 const signature=value=>JSON.stringify(value);
 for(const file of ['acecraft-honk-ui-map.json','acecraft-RadiantPact-ui-map.json','acecraft-OverdriveRecruit-ui-map.json','acecraft-ACE04-ui-map.json','acecraft-ACE05-ui-map.json','acecraft-ACE10L-ui-map.json']){
  const log=JSON.parse(await fs.readFile(cwd+'/'+file,'utf8'));
  if(!/^(?:Page|Modal)_ACE_/.test(log.family?.name||'')||!Array.isArray(log.family.actions)||typeof log.sid!=='string'||!log.map)throw Error('Invalid known ACE alias log: '+file);
  for(const a of log.family.actions){
   if(a.op!=='text'||!log.map[a.key]||log.family.actions.some(b=>b.parent===a.key)||a.inputMode&&a.inputMode!=='none')continue;
   const wanted=style(a.size===undefined?22:a.size,a.weight===undefined?500:a.weight==='bold'?700:a.weight,a.color===undefined?'#32597c':a.color,a.align===undefined?'left':a.align);
   const key=signature(wanted),items=templates.get(key)||[];
   items.push({sid:log.sid,id:log.map[a.key],key:a.key,family:log.family.id,wanted});templates.set(key,items);
  }
 }
 let clipboardKey=null;
 // Both wrappers share the real editor clipboard. Any copy/cut invalidates both private caches.
 t.invalidateCopy=()=>{clipboardKey=null;invalidate?.();};
 t.command=async(...args)=>{if(args[0]==='copy'||args[0]==='cut')t.invalidateCopy();return command(...args);};
 const currentScreen=async()=>new URL(await th.url()).searchParams.get('screen');
 const targetNames=async sid=>{
  if(await currentScreen()!==sid)await t.screen(sid);
  await t.p.getByRole('button',{name:'레이어',exact:true}).click();
  const filter=t.p.locator('#tree-search');
  if(await filter.count()&&await filter.evaluate(e=>e.value))throw Error('Clear the layer search before copying text.');
  if(await t.p.locator('.layer-item[aria-expanded="false"] > .layer-row > button.layer-expand:not([disabled])').count())throw Error('Expand all target layers before copying text.');
  return t.names();
 };
 const fields=async()=>t.p.locator('[data-field],[data-part-field]').evaluateAll(es=>Object.fromEntries(es.map(e=>[e.getAttribute('data-field')||'part.'+e.getAttribute('data-part-field'),e.value])));
 const matches=(values,wanted)=>Object.entries(wanted).every(([k,v])=>typeof v==='number'?Number(values[k])===v:String(values[k]).toLowerCase()===String(v).toLowerCase());
 // addText has no options for these styles; never inherit a styled caption by accident.
 const neutral=values=>['typography.family','typography.vertical','typography.wrap','typography.overflow'].every(k=>values[k]==='')
  &&['typography.letterSpacing','typography.strokeWidth'].every(k=>values[k]===''||Number(values[k])===0)
  &&Number(values['appearance.opacity'])===1;
 const setPx=async()=>{await t.pane('layer');if(await t.p.locator('[data-transform-unit]').count())await t.set('[data-transform-unit]','px');};
 t.addText=async(name,text,r,size=22,weight=500,color='#32597c',parent,align='left')=>{
  const wanted=style(size,weight,color,align),key=signature(wanted),candidates=(templates.get(key)||[]).filter(x=>!blocked.has(x.id));
  if(!candidates.length)return base(name,text,r,size,weight,color,parent,align);
  if(!r||!['x','y','w','h'].every(k=>Number.isFinite(r[k]))||r.w<=0||r.h<=0)throw Error('Invalid ABS text rectangle: '+name);
  if(!Number.isFinite(wanted.fontSize)||!Number.isFinite(wanted['typography.weight'])||typeof name!=='string'||!name)throw Error('Invalid text name/style.');
  const sid=t.job?.sid||await currentScreen();if(!sid)throw Error('No target screen for text copy.');
  const before=await targetNames(sid);
  if(before.some(e=>e.name===name))throw Error('Text name already exists; recover the partial action manually: '+name);
  let source=candidates[0],newIds=[];
  try{
   if(clipboardKey!==key){
    source=null;
    for(const candidate of candidates){
     await t.screen(candidate.sid);await t.pick(candidate.id);await t.tab('general');
     const values=await fields();
     if(values.kind==='text'&&values['part.partRole']==='label'&&matches(values,wanted)&&neutral(values)){source=candidate;break;}
     blocked.add(candidate.id);
    }
    if(!source){await t.screen(sid);return base(name,text,r,size,weight,color,parent,align);}
    await t.command('copy');clipboardKey=key;
   }
   const immediatelyBefore=await targetNames(sid),oldIds=new Set(immediatelyBefore.map(e=>e.id));
   if(immediatelyBefore.some(e=>e.name===name))throw Error('Text name appeared before paste: '+name);
   await t.command('paste');
   const after=await t.names();newIds=after.filter(e=>!oldIds.has(e.id)).map(e=>e.id);
   const active=t.p.locator('button.layer-select.active[data-element]');
   if(newIds.length!==1||await active.count()!==1)throw Error('Text paste must create exactly one selected leaf; actual='+newIds.length);
   const id=await active.getAttribute('data-element');
   if(!newIds.includes(id))throw Error('Selected text is not the newly pasted ID.');
   await t.tab('general');const pasted=await fields();
   if(pasted.kind!=='text'||!neutral(pasted))throw Error('Pasted source is not a neutral native text leaf.');
   await t.name(name);await setPx();await t.abs(id,r,parent);await t.tab('general');
   // t.set is the existing ASCII-aware normal UI key setter (including Space/Enter/+).
   await t.set('[data-field="text"]',text);
   const actual=await fields();
   for(const [field,value]of Object.entries(wanted)){
    const same=typeof value==='number'?Number(actual[field])===value:String(actual[field]).toLowerCase()===String(value).toLowerCase();
    if(!same)await t.set('[data-field="'+field+'"]',value);
   }
   if(actual['part.partRole']!=='label')await t.set('[data-part-field="partRole"]','label');
   if(actual['part.mode']!=='none')await t.set('[data-part-field="mode"]','none');
   write?.({kind:'normal-ui-text-copy-result',name,id,source:{sid:source.sid,id:source.id},copiedParts:1,typographyReused:true});
   return id;
  }catch(error){
   t.invalidateCopy();
   throw Error('Normal UI text copy stopped; no automatic retry/cleanup. screen='+sid+' name='+name+' newIDs='+newIds.join(',')+' / '+error.message);
  }
 };
 t.__normalTextCopyInstalled=true;
 write?.({kind:'normal-ui-text-copy-installed',typographySignatures:templates.size,note:'Same addText signature. Actual neutral style must match; otherwise original addText. Call t.invalidateCopy after external keyboard/menu clipboard changes. Root UI validation is pending.'});
 return t;
}
