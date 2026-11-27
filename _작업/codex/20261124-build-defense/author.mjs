import {readFileSync} from 'node:fs';
import {readDesign,saveDraft,shape,text,btn,attach,get,tone} from './shared.mjs';
const hud=readDesign('import-6604270d');
const skipHud=process.argv.includes('--build-only');
const mons=readDesign('kpop-mons-ui').screens.find(s=>s.id==='mons-storage');
const base=hud.screens[0];
const build={schemaVersion:4,projectId:'kpop-build-ui',revision:3,name:'건설 · 2차 세부 와이어프레임',entryScreen:'city',screens:[],transitions:[],fixtures:{balance:0,items:[]}};
const surface='#f2f4f6', dark='#273746', soft='#5a6874', warning='#7b3e31';
const M='simulator_module_building', H='simulator_module_hud';
const facilities=[['production','프로듀싱 스튜디오'],['hq','사옥'],['academy','아카데미'],['vocal','보컬 녹음실'],['dance','댄스 연습실'],['rap','콘서트장'],['fanshop','팬샵'],['broadcast','예능 방송국'],['visual','뷰티 스튜디오']];
const art=id=>({src:'data:image/png;base64,'+readFileSync(new URL('art/'+id+'.png',import.meta.url)).toString('base64'),alt:id,fit:'contain'});
const image=(s,id,label,src,x,y,w,h,fit='contain')=>{
 const e=shape(s,id,label,'image',x,y,w,h,{role:'image'});
 e.image={...(typeof src==='string'?art(src):structuredClone(src)),alt:label,fit};
 return e;
};
const panel=(s,id,x,y,w,h,frame=tone.white)=>shape(s,id,id,'panel',x,y,w,h,{frame});
const fill=(s,id,x,y,w,h,color,radius=0)=>shape(s,id,id,'panel',x,y,w,h,{fill:color,radius});
const txt=(s,id,label,x,y,w,h,o={})=>text(s,id,label,x,y,w,h,{size:13,weight:650,...o});
const title=(s,id,label,x,y,w,h,o={})=>txt(s,id,label,x,y,w,h,{size:19,weight:800,...o});
const caption=(s,id,label,x,y,w,h,o={})=>txt(s,id,label,x,y,w,h,{size:12,color:soft,...o});
const pub=(d,s,id,label,x,y,w,h,act={})=>btn(d,s,id,label,x,y,w,h,act);
const nav=(d,s,id,label,x,y,w,h,to,fill)=>pub(d,s,id,label,x,y,w,h,{to,fill});
const moduleLink=(d,s,id,label,x,y,w,h,moduleId,context={})=>pub(d,s,id,label,x,y,w,h,{action:'module',payload:{moduleId,label,context}});
const blocked=(d,s,id,label,x,y,w,h,reason)=>{
 const e=pub(d,s,id,label,x,y,w,h,{link:false,fill:tone.soft});
 e.interaction={mode:'action',enabled:false,reason,shape:'rectangle'};e.intentionalNoAction=true;
 return e;
};
const bar=(s,id,x,y,w,h,ratio,color=dark)=>{
 fill(s,id+'.track',x,y,w,h,'#d9dfe5',4);
 if(ratio>0)fill(s,id+'.value',x,y,w*ratio,h,color,4);
};
const cloneParts=(source,target,predicate)=>{
 const rename=str=>str?.startsWith(source.id+'.')?target.id+str.slice(source.id.length):str;
 for(const e of source.elements.filter(predicate)){
  const n=structuredClone(e); n.id=rename(n.id);if(n.parentId)n.parentId=rename(n.parentId);
  target.elements.push(n);
 }
};
const is=(e,s,key)=>e.id===s.id+'.'+key||e.id.startsWith(s.id+'.'+key+'.');
function shot(d,id,name,col,row,kind='page',purpose=name){
 const s={id,name,kind,purpose,logicalSize:{w:390,h:844},wireframeReview:true,
  canvasPosition:{x:24+col*424,y:(d===hud?1900:48)+row*910},elements:[]};
 if(kind!=='page')s.presentation={type:kind,rootMode:'fullscreen',effect:kind==='sheet'?'slide':'fade',durationMs:180,autoCloseMs:0,dim:true,blocking:true,dismissOnEscape:true};
 d.screens.push(s);return s;
}
function bg(s){fill(s,'backdrop',0,0,390,844,surface);}
function top(s,label){
 bg(s);panel(s,'header',0,0,390,52);title(s,'header.title',label,16,0,280,52);
}
function window(d,s,label,kind){
 const x=8,y=kind==='sheet'?96:48,w=374,h=748;
 const f=panel(s,'window',x,y,w,h);
 if(kind==='sheet')fill(s,'handle',173,y+7,44,4,'#a4aeb8',3);
 title(s,'window.title',label,23,y+18,290,38);
 pub(d,s,'close','×',330,y+16,39,39,{action:'close',size:20});
 return f;
}
function route(d,s,key,action,to,payload){
 const e=get(s,key);
 if(!e)throw Error(s.id+'.'+key);
 Object.assign(e,{interaction:{mode:'action',enabled:true,shape:'rectangle',reason:''},intentionalNoAction:false});
 d.transitions=d.transitions.filter(t=>!(t.fromScreen===s.id&&t.fromElement===e.id));
 attach(d,s,e,action,to,payload);
}
function dockAndHeader(s,{list=false}={}){
 bg(s);
 cloneParts(base,s,e=>is(e,base,'header')||is(e,base,'dock')||['profile','power','ruby','fans','settings'].some(k=>is(e,base,k)));
 const links={cards:'simulator_module_photocard',calendar:'simulator_module_schedule',check:'simulator_module_mission',shop:'simulator_module_shop',person:H};
 route(build,s,'dock.hammer','module',null,{moduleId:H,label:'이전 화면',context:{}});
 for(const [id,moduleId] of Object.entries(links))if(get(s,'dock.'+id))route(build,s,'dock.'+id,'module',null,{moduleId,label:get(s,'dock.'+id).name,context:{}});
 get(s,'dock.hammer').skin={...get(s,'dock.hammer').skin,tone:tone.mid};
 const headerActions={profile:{moduleId:'simulator_module_profile'},settings:{moduleId:H},power:{moduleId:H},ruby:{moduleId:'simulator_module_shop'},fans:{moduleId:H}};
 for(const [id,payload] of Object.entries(headerActions))if(get(s,id))route(build,s,id,'module',null,{...payload,label:get(s,id).name,context:{source:'build',entry:id}});
 for(const [id,l,v,x] of [['balance','돈','—',10],['shield','대전 방패','— / 3',137]]){
  panel(s,id,x,60,118,38);caption(s,id+'.label',l,x+8,60,71,38);txt(s,id+'.value',v,x+77,60,33,38,{align:'right'});
 }
 nav(build,s,'toggle',list?'지도 보기':'목록 보기',264,60,116,38,list?'city':'facilities');
}
const city=shot(build,'city','① 도시 지도 · 3×3',0,0);
dockAndHeader(city);
title(city,'title','건설',12,115,135,28);
caption(city,'count','시설 9곳',260,115,115,28,{align:'right'});
const detailIds={dance:'facility-detail',visual:'facility-empty',rap:'facility-funds',broadcast:'facility-repair-battle',hq:'facility-complete'};
const facilityAssets={};
for(const [i,[id,name]] of facilities.entries()){
 const x=10+(i%3)*125,y=148+Math.floor(i/3)*143;
 const artId=id==='academy'?null:id;
 const target=detailIds[id]??'facility-'+id;
 const badge=id==='broadcast'?'파손':id==='dance'?'증설 가능':id==='visual'?'빈 부지':id==='hq'?'완공':'';
 const card=nav(build,city,'tile-'+id,'',x,y,120,135,target,id==='broadcast'?'#f3e0da':tone.white);
 card.name=name;
 fill(city,'tile-'+id+'.back',x+7,y+7,106,73,'#eaf0f3',6);
 if(artId&&id!=='visual') image(city,'tile-'+id+'.art',name+' 쿼터뷰',artId,x+5,y+8,110,72);
 else if(id==='visual'){
  const e=image(city,'tile-'+id+'.empty-icon','빈 부지 짓기',get(base,'dock.hammer.img').image,x+42,y+29,36,36);
  e.interaction={mode:'none',enabled:false,shape:'rectangle',reason:''};
 } else image(city,'tile-'+id+'.missing','아카데미 · 임시 시설 아이콘',get(base,'dock.hammer.img').image,x+44,y+27,32,32);
 txt(city,'tile-'+id+'.label',name,x+5,y+81,110,20,{align:'center',size:11,weight:790});
 caption(city,'tile-'+id+'.level',id==='visual'?'0 / 30':id==='hq'?'30 / 30':id==='dance'?'24 / 30':'— / 30',x+8,y+99,104,17,{align:'center'});
 if(badge)txt(city,'tile-'+id+'.state',badge,x+6,y+115,108,17,{align:'center',size:11,color:id==='broadcast'?warning:dark});
 // Keep the complete card the hit target.
 for(const e of city.elements.filter(e=>e!==card&&e.id.startsWith(card.id+'.'))){
  const p={x:e.x,y:e.y,w:e.w,h:e.h};
  Object.assign(e,{parentId:card.id,x:(p.x-card.x)*100/card.w,y:(p.y-card.y)*100/card.h,w:p.w*100/card.w,h:p.h*100/card.h,interaction:{mode:'parent',enabled:true,shape:'rectangle',reason:''}});
 }
 facilityAssets[id]=artId;
}
title(city,'quick-title','시설 바로 관리',12,586,260,31,{size:15});
for(const [i,[id,label,status,target]] of [
 ['dance','댄스 연습실','증설 가능','facility-detail'],['broadcast','예능 방송국','수리 필요','facility-repair-battle'],['visual','뷰티 스튜디오','새로 짓기','facility-empty']
].entries()){
 const x=10+i*125,y=625;
 const e=pub(build,city,'quick-'+id,'',x,y,120,137,{action:'open',to:target});
 e.name=label+' '+status;
 const glyph=image(city,'quick-'+id+'.art',label,id==='visual'?get(base,'dock.hammer.img').image:id,0,0,106,64);
 Object.assign(glyph,{parentId:e.id,x:4,y:7,w:92,h:48,interaction:{mode:'parent',enabled:true,shape:'rectangle',reason:''}});
 text(city,'quick-'+id+'.name',label,2,56,96,17,{size:12,weight:800,align:'center',parentId:e.id,percent:true});
 text(city,'quick-'+id+'.status',status,3,76,94,18,{size:12,weight:750,align:'center',parentId:e.id,percent:true,color:id==='broadcast'?warning:dark});
}
const list=shot(build,'facilities','② 시설 목록',1,0);
dockAndHeader(list,{list:true});
title(list,'title','시설 목록',13,113,205,35);
for(const [i,[id,name]] of facilities.entries()){
 const x=11+(i%2)*187,y=158+Math.floor(i/2)*107;
 const e=nav(build,list,'card-'+id,'',x,y,181,98,detailIds[id]??'facility-'+id);
 e.name=name;
 if(facilityAssets[id])image(list,'card-'+id+'.art',name,facilityAssets[id],x+4,y+8,63,69);
 txt(list,'card-'+id+'.name',name,x+70,y+20,105,22,{size:11});
 caption(list,'card-'+id+'.level',id==='broadcast'?'파손':id==='hq'?'30 / 30':id==='visual'?'0 / 30':'— / 30',x+70,y+47,105,20);
 for(const child of list.elements.filter(n=>n.id.startsWith(e.id+'.'))){
  Object.assign(child,{parentId:e.id,x:(child.x-e.x)*100/e.w,y:(child.y-e.y)*100/e.h,w:child.w*100/e.w,h:child.h*100/e.h,interaction:{mode:'parent',enabled:true,shape:'rectangle',reason:''}});
 }
}
for(const s of [city,list])for(const t of build.transitions.filter(t=>t.fromScreen===s.id&&/^facility-/.test(t.targetScreen??'')))t.action='open';
function detail(id,name,col,row,facility,state='normal'){
 const s=shot(build,id,name,col,row,'sheet');
 window(build,s,name,'sheet');
 const rep=facility&&facilityAssets[facility];
 if(rep)image(s,'building',name+' · 삼동 쿼터뷰',state==='normal'&&facility==='dance'?'dance-up':state==='complete'?'hq-max':rep,35,166,320,174);
 else if(facility==='visual')image(s,'building','빈 부지 짓기',get(base,'dock.hammer.img').image,152,206,86,86);
 else caption(s,'building.source','아카데미 모델 연결 대기',36,170,318,150,{align:'center'});
 const modelState=state==='normal'&&facility==='dance';
 if(modelState)image(s,'building.current','현재 시설 · 세 동','dance',34,178,145,130);
 if(modelState)Object.assign(get(s,'building'),{x:210/3.9,y:178/8.44,w:145/3.9,h:130/8.44});
 if(modelState){caption(s,'building.before','현재',42,307,130,22,{align:'center'});caption(s,'building.after','증설 후',219,307,126,22,{align:'center'});title(s,'arrow','→',176,207,39,53,{align:'center'});}
 const labels=['본관','부속 A','부속 B'];
 if(modelState){
  title(s,'total','시설 24 / 30단계',25,327,162,23,{size:14});
  caption(s,'grow','다음 · 부속 B',208,327,157,23,{align:'right'});
 }

 for(const [i,k] of labels.entries()){
  const x=22+117*i;
  panel(s,'wing-'+i,x,354,111,70,i===2&&modelState?tone.mid:tone.white);
  txt(s,'wing-'+i+'.name',k,x+4,356,103,23,{align:'center'});
  caption(s,'wing-'+i+'.stage',state==='complete'?'10 / 10':state==='empty'?'0 / 10':modelState?['10 / 10','10 / 10','4 → 5'][i]:'— / 10',x+4,378,103,22,{align:'center'});
  if(modelState||state==='complete'||state==='empty')bar(s,'wing-'+i+'.bar',x+8,408,95,6,state==='empty'?0:state==='complete'||i<2?1:.4);

 }
 const features=state==='repair-defense'?[
  ['파손 사유','나쁜 기운 방어 실패 · 그냥 두기'],['시설 영향','연습 중단 · 칸 도착 보상 감소'],['수리비','정본 확인 중']
 ]:state==='repair-battle'?[
  ['파손 사유','출연권 대전 피격'],['시설 영향','칸 도착 보상 감소'],['수리비','마지막 건설비 × 0.5']
 ]:state==='complete'?[
  ['시설 단계','30 / 30'],['건물 상태','세 동 완공'],['시설 효과','현재 효과 적용 중']
 ]:state==='funds'?[
  ['증설비','—'],['보유금','—'],['부족한 돈','—']
 ]:[['시설 효과','현재 → 다음'],['엔터재화','+ —'],['비용 · 남은 돈','— → —']];
 for(const [i,[label,value]] of features.entries()){
  const y=436+i*54;panel(s,'info-'+i,22,y,346,49);
  txt(s,'info-'+i+'.label',label,32,y,115,49);
  txt(s,'info-'+i+'.value',value,150,y,206,49,{align:'right',size:12});
 }
 if(state==='complete')blocked(build,s,'maxed','최대 단계',22,768,346,54,'완공');
 else if(state==='funds')blocked(build,s,'too-poor','돈이 부족해요',22,768,346,54,'재화 부족');
 else if(state.includes('repair')){
  if(state==='repair-defense')pub(build,s,'repair','수리 검수',22,768,346,54,{action:'navigate',to:'facility-restored'});
  else pub(build,s,'repair','수리하기',22,768,346,54,{action:'navigate',to:'facility-restored'});
 } else if(state==='empty')pub(build,s,'purchase','짓기',22,768,346,54,{action:'open',to:'facility-confirm-new'});
 else if(modelState){
  panel(s,'next-step',22,624,346,68,tone.soft);
  txt(s,'next-step.head','다음 단계 · 부속 B',32,633,195,25);
  caption(s,'next-step.amount','24 → 25단계',234,632,123,24,{align:'right'});
  caption(s,'next-step.cost','증설비 — · 보유금 —',32,657,318,23);
  pub(build,s,'upgrade','+1 단계 증설',22,768,168,54,{action:'navigate',to:'construction-assembly',fill:tone.mid});
  pub(build,s,'max','최대 증설',200,768,168,54,{action:'open',to:'facility-confirm'});
 } else blocked(build,s,'purchase','증설하기',22,768,346,54,'시설별 비용과 현재 단계 연결 대기');
 return s;
}
detail('facility-detail','댄스 연습실 · 증설',2,0,'dance');
detail('facility-empty','뷰티 스튜디오 · 빈 부지',3,0,'visual','empty');
detail('facility-funds','콘서트장 · 돈 부족',4,0,'rap','funds');
detail('facility-repair-battle','예능 방송국 · 파손·수리',0,1,'broadcast','repair-battle');
detail('facility-repair-defense','댄스 연습실 · 디펜스 파손',1,1,'dance','repair-defense');
detail('facility-complete','사옥 · 완공',2,1,'hq','complete');
for(const [i,[id,name]] of facilities.filter(([id])=>!detailIds[id]).entries())detail('facility-'+id,name,i,3,id);
const confirm=shot(build,'facility-confirm','증설 확인 · 모달',3,1,'modal');
window(build,confirm,'건설 확인','modal');
image(confirm,'art','증설할 시설','dance-up',50,174,290,190);
title(confirm,'text','최대 증설을 진행할까요?',25,404,340,47,{align:'center'});
caption(confirm,'bill','24 → — 단계 · 총비용 — · 잔액 —',25,456,340,43,{align:'center'});
pub(build,confirm,'cancel','돌아가기',22,702,165,54,{action:'close'});
nav(build,confirm,'confirm','진행하기',198,702,170,54,'construction-assembly');
const confirmNew=shot(build,'facility-confirm-new','짓기 확인 · 모달',4,3,'modal');
window(build,confirmNew,'뷰티 스튜디오 짓기','modal');
image(confirmNew,'art','뷰티 스튜디오', 'visual',50,180,290,203);
caption(confirmNew,'cost','비용 — · 건설 후 잔액 —',22,446,346,43,{align:'center'});
pub(build,confirmNew,'cancel','돌아가기',22,702,165,54,{action:'close'});
nav(build,confirmNew,'confirm','진행하기',198,702,170,54,'construction-new');
const newBuilt=shot(build,'construction-new','뷰티 스튜디오 건설 완료',0,4);
top(newBuilt,'건설 완료');
image(newBuilt,'visual','뷰티 스튜디오', 'visual',22,140,346,360);
title(newBuilt,'summary','뷰티 스튜디오를 지었어요',22,543,346,46,{align:'center'});
nav(build,newBuilt,'next','도시 지도로',12,766,366,56,'city');
for(const [id,name,artId,next,col] of [['construction-assembly','건설 조립','dance-arena','construction-result',4],['construction-result','건설 완료','dance-up','city',0],['facility-restored','수리 완료','dance', 'city',1]]){
 const s=shot(build,id,name,col,col===4?1:2);
 top(s,name);
 image(s,'visual','기존 건물 모델 대표 컷',artId,12,96,366,438,id.includes('assembly')?'cover':'contain');
 title(s,'status',name,28,560,334,63,{align:'center'});
 caption(s,'values',id==='construction-result'?'댄스 연습실 24 → 25 · 엔터재화 + —':id==='facility-restored'?'시설 정상 이용 가능':'부속 B 증설 · 본관과 부속 A 유지',28,628,334,36,{align:'center'});
 nav(build,s,'next',id.includes('assembly')?'연출 건너뛰기':'도시 지도로',12,766,366,56,next);
}
const buildParts=shot(build,'construction-parts','건설 공통 부품',3,2);
top(buildParts,'건설 공통 부품');
for(const [i,k] of ['production','hq','vocal','dance','rap','fanshop','broadcast','visual'].entries()){
 const x=12+(i%3)*123,y=86+Math.floor(i/3)*126;
 panel(buildParts,k,x,y,120,112);
 image(buildParts,k+'.art','시설 쿼터뷰',k,x+4,y+4,112,78);
 caption(buildParts,k+'.name',facilities.find(f=>f[0]===k)[1],x,y+82,120,25,{align:'center',size:11});
}
panel(buildParts,'window-shape',12,490,366,194);
title(buildParts,'window-legend','3동 비교 · 9슬라이스',22,504,346,31);
caption(buildParts,'window-types','시설 상세는 바텀시트 · 건설 확인은 모달',22,549,346,37);
caption(buildParts,'window-size','공통 374 × 748 · 390 × 844 기준',22,591,346,37);
const cityDamaged=shot(build,'city-damaged','③ 도시 지도 · 디펜스 파손',4,2);
cloneParts(city,cityDamaged,()=>true);
get(cityDamaged,'quick-dance.status').text='수리 필요';
get(cityDamaged,'quick-dance.status').appearance.textColor=warning;
get(cityDamaged,'tile-dance.state').text='나쁜 기운 · 파손';
get(cityDamaged,'tile-dance.state').appearance.textColor=warning;
get(cityDamaged,'tile-dance').skin.tone='#f3e0da';
for(const t of build.transitions.filter(t=>t.fromScreen==='city')){
 const e=cityDamaged.elements.find(e=>e.id===t.fromElement.replace(/^city\./,'city-damaged.'));
 attach(build,cityDamaged,e,t.action,['city.tile-dance','city.quick-dance'].includes(t.fromElement)?'facility-repair-defense':t.targetScreen,t.payload);
}

function gauge(s,full){
 const first=get(s,'rail0.1');const oldChildren=s.elements.filter(e=>e.id.startsWith(first.id+'.'));
 s.elements=s.elements.filter(e=>!oldChildren.includes(e));
 first.name=full?'나쁜 기운 가득 · 방어 경고':'나쁜 기운 게이지';
 const child=(e,x,y,w,h)=>{
  Object.assign(e,{parentId:first.id,x,y,w,h,interaction:{mode:'parent',enabled:true,shape:'rectangle',reason:''}});return e;
 };
 child(image(s,'rail0.1.gauge',first.name,full?'gauge-100':'gauge-62',0,0,38,38),23,1,54,57);
 child(txt(s,'rail0.1.title','나쁜 기운',0,0,50,18,{align:'center',size:10}),0,57,100,20);
 child(txt(s,'rail0.1.value',full?'가득':'62%',0,0,48,16,{align:'center',size:11,color:full?warning:dark}),0,77,100,22);
 route(hud,s,'rail0.1','open',full?'defense-warning':'defense-gauge-help');
 route(hud,s,'dock.hammer','module',null,{moduleId:M,label:'건설',context:{source:'hud'}});
}
const full=shot(hud,'defense-full','디펜스 · 게이지 가득 / 자동 멈춤',0,0);
cloneParts(base,full,()=>true);
for(const t of hud.transitions.filter(t=>t.fromScreen==='main')){
 const e=full.elements.find(e=>e.id===t.fromElement.replace(/^main\./,'defense-full.'));
 attach(hud,full,e,t.action,t.targetScreen,t.payload);
}
for(const s of hud.screens.filter(s=>['main','arrived','main-solo'].includes(s.id)))gauge(s,false);
gauge(full,true);
const rollStatus=get(full,'roll.status');rollStatus.text='자동 굴리기 멈춤 · 나쁜 기운 가득';rollStatus.name=rollStatus.text;
route(hud,full,'roll','open','defense-ignore');
const power=shot(hud,'build-power-detail','엔터파워 상세 · 건설 바로 가기',5,0,'modal');
window(hud,power,'엔터파워 상세','modal');
image(power,'icon','엔터파워',get(base,'power.image').image,150,165,90,90);
title(power,'label','엔터파워',22,278,346,37,{align:'center'});
caption(power,'summary','건물 증설로 엔터재화를 얻을 수 있어요.',22,329,346,32,{align:'center'});
moduleLink(hud,power,'go-build','건설 바로 가기',22,700,346,54,M,{source:'power'});
for(const s of [base,hud.screens.find(s=>s.id==='main-solo'),hud.screens.find(s=>s.id==='arrived'),full]){
 route(hud,s,'power','open','build-power-detail');
}
const help=shot(hud,'defense-gauge-help','디펜스 · 게이지 설명',1,0,'modal');
window(hud,help,'나쁜 기운','modal');
image(help,'visual','나쁜 기운 고리 게이지','gauge-62',141,168,108,108);
title(help,'value','62%',25,291,340,44,{align:'center'});
bar(help,'meter',32,352,326,12,.62);
for(const [i,[heading,desc]] of [['주사위 굴리기','나쁜 기운 +1'],['루머','나쁜 기운 +15'],['가득 차면','자동 굴리기 멈춤']].entries()){
 const y=399+i*61;
 panel(help,'row-'+i,23,y,344,52);
 txt(help,'row-'+i+'.title',heading,36,y,156,52);
 caption(help,'row-'+i+'.detail',desc,198,y,155,52,{align:'right'});
}
caption(help,'hint','게이지가 차면 눌러 방어를 시작할 수 있어요.',23,606,344,33,{align:'center'});
pub(hud,help,'done','확인',22,714,346,54,{action:'close'});
const warn=shot(hud,'defense-warning','디펜스 · 습격 경고',2,0,'modal');
window(hud,warn,'연습실에 악귀가 몰려와요','modal');
image(warn,'art','댄스 연습실 습격 · 3D 대표 컷','dance-arena',22,132,346,210,'cover');
panel(warn,'loss',22,364,346,170,'#f0e0d9');
title(warn,'loss.heading','댄스 연습실 습격',34,373,300,29);
for(const [i,l] of ['시설 파손','칸 도착 보상 감소','댄스 연습 중단'].entries()){
 const y=408+i*33;fill(warn,'loss.dot-'+i,37,y+12,8,8,warning,4);txt(warn,'loss.item-'+i,l,55,y,290,30);
}
caption(warn,'roster','출격 몬스 · 시설 보석',24,548,345,32);
const monsKeys=['card-axolotl-art','card-capybara-art','card-chinchilla-art'];
for(const [i,key] of monsKeys.entries())image(warn,'mons-'+i,'출격 몬스',get(mons,key).image,25+i*63,579,55,48);
nav(hud,warn,'ignore','그냥 두기',22,707,166,58,'defense-ignore');
nav(hud,warn,'defend','방어하기',201,707,167,58,'defense-battle',tone.mid);
function battle(id,name,c,r,state){
 const s=shot(hud,id,'디펜스 · '+name,c,r);
 top(s,'나쁜 기운 디펜스');
 title(s,'mode',name,15,62,205,30);
 pub(hud,s,'pause','일시정지',289,59,86,37,{action:'open',to:'defense-pause'});
 const health=state==='boss'?[.56,.43,.37]:[.78,.62,.68];
 for(const [i,l] of ['본관','부속 A','부속 B'].entries()){
  const x=13+i*123;
  panel(s,'health-'+i,x,108,118,62);
  caption(s,'health-'+i+'.label',l,x+6,113,102,22);
  bar(s,'health-'+i+'.bar',x+7,142,103,10,health[i],i?soft:dark);
 }
 image(s,'arena','디펜스 3D 전장 · 기존 시설 대표 컷','dance-arena',10,184,370,438,'cover');
 if(state==='boss'){
  panel(s,'boss',20,197,350,58,'#f1e8e2');
  txt(s,'boss.name','공중 용 · 보스',31,201,158,24,{color:warning});
  for(let i=0;i<3;i++)bar(s,'boss.hp-'+i,32+i*109,232,103,8,i===2?.45:1,warning);
 }
 const enemyPositions=state==='boss'?[[157,258,78],[63,347,36],[286,362,40]]:[[79,309,40],[184,329,44],[279,300,35],[292,393,40]];
 for(const [i,[x,y,w]] of enemyPositions.entries())image(s,'enemy-'+i,state==='boss'&&i===0?'보스 검수 아이콘':'악귀 검수 아이콘',state==='boss'&&i===0?'boss-mark':'enemy-mark',x,y,w,w);
 const positions=[[55,430],[163,492],[262,427]];
 for(const [i,key] of monsKeys.entries())image(s,'mons-'+i,'전투 중 몬스',get(mons,key).image,positions[i][0],positions[i][1]+42,58,48);
 const badge=state==='boss'?'건물 포격 준비':state==='cleanup'?'새 악귀 출현 종료':'악귀 무리 접근';
 panel(s,'banner',20,562,350,43,tone.soft);
 txt(s,'banner.label',badge,28,565,333,36,{align:'center'});
 if(state==='battle'){
  pub(hud,s,'skill','스킬 고르기',12,649,180,52,{action:'open',to:'defense-skills'});
  nav(hud,s,'boss-view','보스 경고 상태 보기',199,649,178,52,'defense-boss');
  caption(s,'hint','스킬 선택 중에도 전투가 계속돼요.',15,737,360,35,{align:'center'});
 }
 if(state==='boss'){
  nav(hud,s,'finish','팀 피니시 · 함께 발동',12,649,366,53,'defense-cleanup',tone.mid);
  caption(s,'hint','보스 체력 · 3구간',16,733,358,37,{align:'center'});
 }
 if(state==='cleanup'){
  nav(hud,s,'success','성공 결과',12,649,180,53,'defense-success');
  nav(hud,s,'failed','실패 결과',198,649,180,53,'defense-failed');
  caption(s,'hint','마지막 악귀까지 물리치면 방어 성공',14,736,362,33,{align:'center'});
 }
 return s;
}
battle('defense-battle','자동 전투',3,0,'battle');
battle('defense-boss','보스 등장',0,1,'boss');
battle('defense-cleanup','잔여 악귀 정리',1,1,'cleanup');
const skill=shot(hud,'defense-skills','디펜스 · 스킬 선택',2,1,'sheet');
window(hud,skill,'스킬을 골라 주세요','sheet');
caption(skill,'continuing','선택 중에도 전투가 계속돼요.',22,169,343,29);
for(const [i,[l,icon]] of [['몬스 스킬 배분',0],['몬스 스킬 강화',1],['팀 피니시 습득',2]].entries()){
 const y=231+i*131;
 pub(hud,skill,'card-'+i,'',22,y,346,114,{action:'close'});
 const card=get(skill,'card-'+i);card.name=l;
 const glyph=image(skill,'card-'+i+'.img',l,'skill-'+icon,0,0,50,50);
 Object.assign(glyph,{parentId:card.id,x:5,y:12,w:22,h:75,interaction:{mode:'parent',enabled:true,shape:'rectangle',reason:''}});
 text(skill,'card-'+i+'.title',l,31,14,63,69,{size:16,weight:800,parentId:card.id,percent:true});
}
caption(skill,'timing','3장 중 1장 · 8초 안에 선택',24,682,342,33,{align:'center'});
const pause=shot(hud,'defense-pause','디펜스 · 일시정지',3,1,'modal');
window(hud,pause,'전투 일시정지','modal');
title(pause,'state','잠시 쉬는 중이에요',20,334,350,54,{align:'center'});
pub(hud,pause,'resume','계속하기',22,704,167,56,{action:'close'});
pub(hud,pause,'leave','포기하기',198,704,170,56,{action:'open',to:'defense-quit'});
const quit=shot(hud,'defense-quit','디펜스 · 포기 확인',4,1,'modal');
window(hud,quit,'방어를 포기할까요?','modal');
caption(quit,'impact','포기하면 방어 실패로 처리돼요.',23,316,344,35,{align:'center'});
pub(hud,quit,'resume','계속 방어',22,704,167,56,{action:'close'});
nav(hud,quit,'confirm','포기하기',198,704,170,56,'defense-failed');
function result(id,name,c,state){
 const s=shot(hud,id,'디펜스 · '+name,c,2);
 top(s,'나쁜 기운 디펜스');
 image(s,'art','댄스 연습실 대표 컷','dance-arena',11,78,368,276,'cover');
 panel(s,'banner',30,274,330,62,state==='success'?tone.white:'#f0e0d9');
 title(s,'status',name,39,281,312,47,{align:'center',color:state==='success'?dark:warning});
 if(state==='success'){
  const chips=[['퇴치 보상',get(base,'power.image').image],['지킴 보너스',get(mons,monsKeys[0]).image],['희귀 몬스',get(mons,'card-snow_leopard-art').image]];
  for(const [i,[l,ico]] of chips.entries()){
   const x=12+i*123;
   panel(s,'reward-'+i,x,383,118,110);
   image(s,'reward-'+i+'.icon',l,ico,x+30,394,58,47);
   txt(s,'reward-'+i+'.label',l,x+4,446,110,34,{align:'center'});
  }
  caption(s,'hint','획득 보상은 전투 결과에 따라 표시돼요.',15,525,356,36,{align:'center'});
 }else{
  panel(s,'damage',12,379,366,135,'#f3e0da');
  title(s,'damage.title','댄스 연습실 파손',24,393,341,33);
  caption(s,'damage.impact','연습 일시 중단 · 칸 도착 보상 감소',24,436,341,36);
  moduleLink(hud,s,'repair','수리하러 가기',12,683,366,55,M,{source:'bad-energy',facilityId:'dance'});
 }
 nav(hud,s,'back-board','보드로 돌아가기',12,763,366,54,'main');
 return s;
}
result('defense-success','방어 성공',0,'success');
result('defense-failed','방어 실패',1,'failed');
result('defense-ignore','그냥 두기 · 시설 파손',2,'ignore');
const parts=shot(hud,'defense-parts','HUD 부속 · 디펜스 공통 부품',3,2);
top(parts,'나쁜 기운 디펜스 부품');
for(const [i,[n,name]] of [[62,'평상시 · 62%'],[100,'가득 · 자동 멈춤']].entries()){
 const x=14+i*183;
 panel(parts,'gauge-'+i,x,84,177,141);
 image(parts,'gauge-'+i+'.ico',name,'gauge-'+n,x+52,96,72,74);
 txt(parts,'gauge-'+i+'.label',name,x+4,178,169,34,{align:'center'});
}
title(parts,'battle-bar','시설 내구도 · 보스 체력',16,255,355,34);
bar(parts,'facility',17,303,351,13,.78);
for(let i=0;i<3;i++)bar(parts,'boss-'+i,17+i*118,335,112,10,i===2?.54:1,warning);
title(parts,'window-rule','공통 창 · 9슬라이스',16,402,355,40);
caption(parts,'window-modal','가운데 모달 · 경고 / 일시정지 / 종료 확인',16,453,355,35);
caption(parts,'window-sheet','하단 바텀시트 · 스킬 카드',16,494,355,35);
caption(parts,'window-size','공통 외곽 374 × 748 · 390 × 844 기준',16,535,355,35);
saveDraft('build',build);
if(!skipHud)saveDraft('hud-defense',hud);
