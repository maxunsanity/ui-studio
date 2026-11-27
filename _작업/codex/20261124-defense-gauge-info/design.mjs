import {readFileSync,writeFileSync} from 'node:fs';
import {shape,text,btn,get,readDesign} from '../20261124-defense-simple/shared.mjs';
import {validateDocument} from '../../../src/tools/uxStudio/model.mjs';
const h=JSON.parse(readFileSync(new URL('../../../docs/planning/_backup/20261124_단이/HUD_r26_9분할전/import-6604270d-r27.json',import.meta.url))),d=readDesign('kpop-defense-ui');
const liveHud=readDesign('import-6604270d');
const old=h.screens.find(s=>s.id==='defense-gauge-help');
const normal=structuredClone(old);
normal.name='나쁜 기운 정보 · 미충전 · 모달';
normal.purpose='현재 수치와 게이지가 차는 조건을 확인하는 모달입니다.';
get(normal,'hint').text='가득 차면 자동 굴리기가 멈추고 5분 카운트가 시작돼요.';
Object.assign(old,normal);
function copyScreen(source,id){
 const screen=structuredClone(source);
 for(const el of screen.elements){
  el.id=el.id.replace(source.id+'.',id+'.');
  if(el.parentId)el.parentId=el.parentId.replace(source.id+'.',id+'.');
 }
 screen.id=id;
 return screen;
}
const full=copyScreen(normal,'defense-gauge-full');
full.name='나쁜 기운 정보 · 만충 · 모달';
full.purpose='자동 굴리기가 멈춘 상태입니다. 남은 습격 시간을 확인하고 방어 준비로 이동합니다.';
full.presentation.dismissOnEscape=false;
full.presentation.closePolicy='prevent';
get(full,'value').text='100%';
get(full,'meter.value').w=get(full,'meter.track').w;
get(full,'row-2.title').text='자동 굴리기';
get(full,'row-2.detail').text='멈춤';
get(full,'hint').y=77.3;
get(full,'hint').text='습격 대상과 출격 몬스를 확인할 수 있어요.';
text(full,'timer-label','습격까지 남은 시간',53,577,157,52,{size:14,weight:760});
text(full,'countdown','05:00',214,577,116,52,{size:22,weight:820,align:'right'});
shape(full,'timer-rule','카운트 구분선','panel',32,633,326,1,{fill:'#d6dee4'});
get(full,'done.label').text='방어 준비';
get(full,'done').name='방어 준비';
const originalTransitions=h.transitions.filter(t=>t.fromScreen===normal.id);
d.screens=d.screens.filter(screen=>![normal.id,full.id].includes(screen.id));
d.transitions=d.transitions.filter(t=>![normal.id,full.id].includes(t.fromScreen));
for(const overlay of [normal,full])overlay.presentation.hideBaseElements=d.screens.find(screen=>screen.id==='defense-warning').elements.map(e=>e.id);
d.screens.unshift(normal,full);
for(const [index,screen] of d.screens.entries())screen.canvasPosition={x:24+index%4*424,y:44+Math.floor(index/4)*898};
d.transitions.push(...originalTransitions);
const done=originalTransitions.find(t=>t.fromElement===normal.id+'.done');
const close=originalTransitions.find(t=>t.fromElement===normal.id+'.close');
d.transitions.push({...done,id:full.id+'.done.link',fromScreen:full.id,fromElement:full.id+'.done',action:'navigate',targetScreen:'defense-warning',label:'방어 준비'});
d.transitions.push({...close,id:full.id+'.close.link',fromScreen:full.id,fromElement:full.id+'.close',action:'module',payload:{moduleId:'simulator_module_hud',label:'보드로 돌아가기',context:{screen:'defense-full'}}});
for(const id of ['main','main-solo','lobby-rapport','lobby-gift']){
 const screen=liveHud.screens.find(s=>s.id===id);
 const icon=get(screen,'event-icon6'),caption=get(screen,'event-label6');
 const neighboring=get(screen,'event5');
 const target=id+'.event6';
 if(screen.elements.some(e=>e.id===target))throw Error('HUD 나쁜 기운 버튼의 최신 연결을 확인하세요.');
 screen.elements.push({...neighboring,id:target,name:'나쁜 기운 정보',x:caption.x,y:icon.y,w:caption.w,h:caption.y+caption.h-icon.y});
 liveHud.transitions.push({id:target+'.info',fromScreen:id,fromElement:target,event:'click',condition:'always',action:'module',targetScreen:null,label:'나쁜 기운 정보',payload:{moduleId:'simulator_module_bad_energy',label:'나쁜 기운 정보'}});
}
for(const [name,doc] of [['hud',liveHud],['defense',d]]){
 validateDocument(doc);
 writeFileSync(new URL(name+'.json',import.meta.url),JSON.stringify(doc));
 writeFileSync(new URL(name+'-assets.json',import.meta.url),'{}');
}
