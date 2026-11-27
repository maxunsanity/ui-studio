import {createUIHelpers} from './browser-ui-helpers.mjs';
export function main05Helpers(){
 const u=createUIHelpers();
 const tprop='텍스트 · 크기와 줄맞춤';
 u.typo=async(t,id,{size,weight,line,align='가운데',vertical='가운데',color,stroke=0,strokeColor='#000000'})=>{
  await u.props(t,id);
  for(const [name,v] of [['텍스트 크기 px',size],['글자 굵기 1~1000',weight],['줄높이 px',line],['글자 외곽선 두께 px',stroke]])if(v!==undefined)await u.num(t,name,v,'.typography-panel');
  await u.details(t,'.typography-panel');await t.playwright.getByRole('combobox',{name:'글자 가로 정렬',exact:true}).selectOption({label:align});
  await u.details(t,'.typography-panel');await t.playwright.getByRole('combobox',{name:'글자 세로 정렬',exact:true}).selectOption({label:vertical});
  if(color){await u.details(t,'.appearance-panel');await u.edit(t,'글자 색',color);}
  if(stroke){await u.details(t,'.typography-panel');await u.edit(t,'글자 외곽선 색',strokeColor);}
 };
 u.art=async(t,id,asset,label)=>{
  await u.props(t,id);if(label)await u.edit(t,'이미지 이름',label);
  await u.edit(t,'프로젝트 이미지 경로',asset.path);
  await t.playwright.locator('.ui-element[data-element="'+id+'"] img[src*="'+asset.sha+'"]').waitFor({state:'attached',timeout:6000});
 };
 u.frame=async(t,id,asset,mode,slices,edges)=>{
  await u.props(t,id);
  await t.playwright.getByRole('combobox',{name:'프레임 방식 · 선택 부품',exact:true}).selectOption({label:mode==='9'?'정보 백판 · 9슬라이스':'버튼 · 3슬라이스'});
  await u.edit(t,'프레임 프로젝트 이미지 경로',asset.path);
  await t.playwright.locator('img[alt$="분할 원본"][src*="'+asset.sha+'"]').waitFor({state:'attached',timeout:6000});
  await u.skinArrays(t,[slices,edges,[0,0,0,0]]);
 };
 u.label=async(t,template,parent,name,text,rect,W,H,style={size:18,weight:700,line:21})=>{
  const id=await u.duplicate(t,template);await u.props(t,id);await u.edit(t,'요소 이름',name);await u.edit(t,'화면에 표시할 글',text);
  await u.parent(t,id,parent);await u.rectPx(t,id,rect,W,H);await u.typo(t,id,style);return id;
 };
 u.node=async(t,template,parent,name,rect,W,H)=>{
  const id=await u.duplicate(t,template);await u.props(t,id);await u.edit(t,'요소 이름',name);await u.parent(t,id,parent);await u.rectPx(t,id,rect,W,H);return id;
 };
 u.shadow=async(t,id,{x=0,y=2,blur=3,opacity=.25}={})=>{
  await u.props(t,id);await u.details(t,'.shadow-inspector');
  const c=t.playwright.getByRole('checkbox',{name:'그림자 켜기',exact:true});
  if(!await c.evaluate(e=>e.checked)){try{await c.check();}catch(error){if(!/selector|deadline|found/.test(error.message))throw error;}}
  for(const [name,value] of [['가로 이동 px',x],['세로 이동 px',y],['흐림 px',blur],['불투명도',opacity]]){
   await u.details(t,'.shadow-inspector');const state=await u.state(t),section=state.slice(state.indexOf('button (expanded) 그림자 효과'));
   const line=section.split('\n').find(s=>/stepper/.test(s)&&s.includes(' '+name+','));
   if(!line)throw Error('Missing shadow field '+name);
   await t.ax.setValue(Number(line.match(/^\s*(\d+)/)[1]),String(value));await t.ax.pressKey(null,'Tab');
  }
 };
 return u;
}
