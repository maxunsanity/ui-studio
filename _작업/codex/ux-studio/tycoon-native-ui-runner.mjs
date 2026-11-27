import {main05Helpers} from './main05-ui-assembly.mjs';
import {operations,assets} from './tycoon10-native-recipe.mjs';

// UI orchestration only. The supplied elements are read-only ID evidence, never a document setter.
export function createTycoonRunner({elements,seeds,rootId,dimId,groupTemplate}){
 const ui=main05Helpers(), ids={ROOT:rootId,dim:dimId,'panel-fill':seeds.bg,'panel-frame':seeds.frame,close:seeds.close,'close-glyph':seeds.text}, names={ROOT:'Group_Tycoon_Content'}, log=[];
 for(const id of [rootId,dimId,groupTemplate,...Object.values(seeds)])if(!elements.some(e=>e.id===id))throw Error('Missing native seed '+id);
 for(const op of operations){names[op.key]=op.name;const e=elements.find(e=>e.name===op.name);if(e)ids[op.key]=e.id;}
 ui.screen=async(tab,name)=>{await tab.playwright.getByRole('button',{name:'화면',exact:true}).click();await tab.playwright.getByRole('button',{name:new RegExp('^[▣▱] '+name+' ')}).click();};
 ui.save=async tab=>{await tab.playwright.getByRole('button',{name:'파일에 저장',exact:true}).click();await tab.playwright.getByRole('button',{name:'파일에 저장',exact:true}).waitFor({state:'visible',timeout:10000});};
 const anchor=async(tab,id,label)=>{await ui.props(tab,id);await tab.playwright.getByRole('button',{name:'배치',exact:true}).click();await ui.details(tab,'.responsive-inspector');await tab.playwright.getByRole('combobox',{name:'앵커',exact:true}).selectOption({label});};
 const place=async(tab,id,op,parent)=>{await ui.props(tab,id);await ui.edit(tab,'요소 이름',op.name);await ui.parent(tab,id,parent);await ui.rectPx(tab,id,op.rect,...op.parentSize);};
 const art=async(tab,id,asset,label)=>{
  await ui.art(tab,id,asset,label);const full=[0,0,...asset.sourceSize];
  if(asset.imageRegion?.some((v,i)=>v!==full[i])){for(const [i,n] of ['X','Y','W','H'].entries())await ui.num(tab,'영역 '+n,asset.imageRegion[i]);await tab.playwright.getByRole('button',{name:'이미지 영역 적용',exact:true}).click();}
 };
 const frame=async(tab,id,op)=>{
  await ui.props(tab,id);await tab.playwright.getByRole('combobox',{name:'프레임 방식 · 선택 부품',exact:true}).selectOption({label:op.frameMode==='9'?'정보 백판 · 9슬라이스':'버튼 · 3슬라이스'});
  await ui.skinArrays(tab,[[0,0,0,0],[0,0,0,0],[0,0,0,0]]);
  await ui.edit(tab,'프레임 프로젝트 이미지 경로',assets[op.assetRole].path);
  await tab.playwright.locator('img[alt$="분할 원본"][src*="'+assets[op.assetRole].sha+'"]').waitFor({state:'attached',timeout:6000});
  await ui.skinArrays(tab,[op.slices,op.edges,op.padding||[0,0,0,0]]);
 };
 const run=async(tab,index)=>{
  const op=operations[index];if(!op)throw Error('Unknown checkpoint '+index);
  if(!ids[op.parentKey])throw Error('Native parent is not created '+op.parentKey);
  let id=ids[op.key];const parent=names[op.parentKey];
  if(op.op==='group'&&op.cloneFromKey){
   if(!ids[op.cloneFromKey])throw Error('Missing clone source');
   if(!id)id=await ui.duplicate(tab,ids[op.cloneFromKey]);
   await place(tab,id,op,parent);const kids=await ui.children(tab,id),changes=[];
   for(const v of op.descendantOverrides){
    const hits=kids.slice(1).filter(k=>k.name===v.name||k.name.replace(/ 복사$/,'')===v.originalName);
    if(hits.length!==1)throw Error('Ambiguous native descendant '+v.originalName);
    const cid=hits[0].id;await ui.props(tab,cid);await ui.edit(tab,'요소 이름',v.name);
    if(Object.hasOwn(v,'nativeText'))await ui.edit(tab,'화면에 표시할 글',v.nativeText);
    if(v.assetRole)await art(tab,cid,assets[v.assetRole],'새로 그린 '+v.name);
    changes.push({id:cid,name:v.name});
   }
   log.push({index,key:op.key,id,changes});
  }else{
   if(!id)id=await ui.duplicate(tab,op.op==='group'?groupTemplate:op.op==='panel'?seeds.bg:op.op==='solid'?dimId:seeds.text);
   await place(tab,id,op,parent);
   if(op.op==='group'){
    if(op.kind==='button'){await ui.props(tab,id);await tab.playwright.getByRole('combobox',{name:'UI 종류',exact:true}).selectOption({label:'버튼'});await tab.playwright.getByRole('combobox',{name:'게임 입력',exact:true}).selectOption({label:op.interaction==='action'?'자체 동작':'표시 전용'});}
   }else if(op.op==='panel'){
    await ui.props(tab,id);await tab.playwright.getByRole('combobox',{name:'부품 역할',exact:true}).selectOption({label:op.partRole==='frame'?'프레임':'바탕'});await frame(tab,id,op);
   }else if(op.op==='image'){
    await ui.props(tab,id);await tab.playwright.getByRole('combobox',{name:'부품 역할',exact:true}).selectOption({label:'이미지'});await ui.edit(tab,'화면에 표시할 글','');await tab.playwright.getByRole('combobox',{name:'게임 입력',exact:true}).selectOption({label:'표시 전용'});
    await art(tab,id,assets[op.assetRole],'새로 그린 '+op.name);
    if(op.fit&&op.fit!=='contain')await tab.playwright.getByRole('combobox',{name:'이미지 맞춤',exact:true}).selectOption({label:op.fit==='cover'?'가득 채우기 · 잘림':'영역에 늘이기'});
   }else if(op.op==='text'){
    await ui.props(tab,id);await ui.edit(tab,'화면에 표시할 글',op.nativeText);await ui.typo(tab,id,op.style);await ui.props(tab,id);await tab.playwright.getByRole('combobox',{name:'게임 입력',exact:true}).selectOption({label:op.interaction==='parent'?'부모에 전달':'표시 전용'});
   }else if(op.op==='solid'){
    await ui.props(tab,id);await tab.playwright.getByRole('combobox',{name:'백판 모양',exact:true}).selectOption({label:{rectangle:'네모',circle:'동그라미',capsule:'캡슐'}[op.geometry]||'둥근 네모'});
    await ui.edit(tab,'백판 색',op.style.fill);await ui.edit(tab,'테두리 색',op.style.strokeColor||'#ffffff');await ui.num(tab,'테두리 두께',op.style.strokeWidth??0,'.appearance-panel');await ui.num(tab,'불투명도',op.style.opacity??1,'.appearance-panel');
   }
   if(op.interaction==='parent'&&op.op!=='text'){await ui.props(tab,id);await tab.playwright.getByRole('combobox',{name:'게임 입력',exact:true}).selectOption({label:'부모에 전달'});}
   log.push({index,key:op.key,id});
  }
  ids[op.key]=id;
  if(op.anchorUi==='top-left-fixed-size')await anchor(tab,id,'왼쪽 위 고정');
  if(op.overflow){await ui.props(tab,id);await tab.playwright.getByRole('button',{name:'배치',exact:true}).click();await ui.details(tab,'.responsive-inspector');await tab.playwright.getByRole('combobox',{name:'영역 넘침',exact:true}).selectOption({label:op.overflow==='scroll-y'?'세로 스크롤':'영역 밖 표시'});}
  return {index,name:op.name,id};
 };
 return {ui,ids,names,run,art,anchor,snapshot:()=>({ids:{...ids},log:[...log]})};
}
