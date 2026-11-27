import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {validateDocument} from '/Users/max/projest_max/ui-studio/src/tools/uxStudio/model.mjs';
import {shape,text,btn,attach,get,tone} from './shared.mjs';
const read=name=>JSON.parse(readFileSync(new URL(name+'.json',import.meta.url)));
const previous=read('build-base'),hud=read('hud-base');
const build={...previous,revision:5,screens:[],transitions:[]};
hud.revision=18;
const assetSizes=read('assets-sizes'),assets={};
const entries=[
 ['production','프로듀싱 스튜디오','facility-production',null,''],
 ['hq','사옥','facility-complete',30,'완공'],
 ['academy','아카데미','facility-academy',null,''],
 ['vocal','보컬 녹음실','facility-vocal',null,''],
 ['dance','댄스 연습실','facility-detail',24,'증설 가능'],
 ['rap','콘서트장','facility-funds',null,''],
 ['fanshop','팬샵','facility-fanshop',null,''],
 ['broadcast','예능 방송국','facility-repair-battle',20,'수리 필요'],
 ['visual','뷰티 스튜디오','facility-empty',0,'짓기 가능']
];
const moduleId='simulator_module_building';
const surface='#f4f4f4',ink='#292929',muted='#666666',pale='#e9e9e9';
const textAt=(s,key,value,x,y,w,h,opts={})=>text(s,key,value,x,y,w,h,{size:13,color:ink,...opts});
const strong=(s,key,value,x,y,w,h,opts={})=>textAt(s,key,value,x,y,w,h,{weight:790,...opts});
const note=(s,key,value,x,y,w,h,opts={})=>textAt(s,key,value,x,y,w,h,{color:muted,size:12,...opts});
const box=(s,k,x,y,w,h,fill)=>shape(s,k,k,'panel',x,y,w,h,{frame:fill||tone.white});
const plate=(s,k,x,y,w,h,fill,radius=0)=>shape(s,k,k,'panel',x,y,w,h,{fill,radius});
const imageRef=(key,label)=>{
 const name=key+'.jpg';
 const url=new URL('art/'+name,import.meta.url);
 const sha=createHash('sha256').update(readFileSync(url)).digest('hex');
 const ref='sha256-'+sha+'.jpg';assets[ref]=decodeURIComponent(url.pathname);
 return {src:'',assetRef:ref,sourceSize:assetSizes[name],alt:label,fit:'contain'};
};
function image(s,key,label,art,x,y,w,h,fit='contain'){
 const e=shape(s,key,label,'image',x,y,w,h,{role:'image'});
 e.image={...imageRef(art,label),fit};
 return e;
}
function inside(e,p){
 const {x,y,w,h}=e;
 Object.assign(e,{parentId:p.id,x:(x-p.x)*100/p.w,y:(y-p.y)*100/p.h,w:w*100/p.w,h:h*100/p.h,interaction:{mode:'parent',enabled:true,shape:'rectangle',reason:''}});
}
const open=(d,s,k,label,x,y,w,h,to,fill)=>btn(d,s,k,label,x,y,w,h,{to,fill});
function disable(s,k,label,x,y,w,h,reason){
 const e=btn(build,s,k,label,x,y,w,h,{link:false,fill:pale});
 e.interaction.enabled=false;e.interaction.reason=reason;e.intentionalNoAction=true;
}
function screen(id,name,col,row){
 const s={id,name,kind:'page',purpose:name,logicalSize:{w:390,h:844},wireframeReview:true,canvasPosition:{x:24+col*426,y:44+row*894},elements:[]};
 build.screens.push(s);return s;
}
function clone(from,to,predicate=()=>true){
 const ren=id=>id.replace(from.id+'.',to.id+'.');
 to.elements.push(...from.elements.filter(predicate).map(e=>({...structuredClone(e),id:ren(e.id),...(e.parentId?{parentId:ren(e.parentId)}:{})})));
}
function carry(from,to,source=previous,dest=build, predicate=()=>true){
 const ren=id=>id.replace(from.id+'.',to.id+'.');
 dest.transitions.push(...source.transitions.filter(t=>t.fromScreen===from.id&&predicate(t)).map(t=>({...structuredClone(t),fromScreen:to.id,fromElement:ren(t.fromElement),id:ren(t.id)})));
}
const city0=previous.screens.find(s=>s.id==='city');
function city(id,title,col,row,variant='regular'){
 const s=screen(id,title,col,row);
 const baseParts=['backdrop','header','dock','balance','shield'];
 clone(city0,s,e=>baseParts.some(key=>e.id===city0.id+'.'+key||e.id.startsWith(city0.id+'.'+key+'.'))||e.parentId===city0.id+'.header'||['profile','power','ruby','fans','settings'].some(key=>e.id.startsWith(city0.id+'.'+key+'.')));
 carry(city0,s,previous,build,t=>t.fromElement.startsWith('city.dock.')||['profile','power','ruby','fans','settings'].some(k=>t.fromElement==='city.'+k));
 strong(s,'title','건설 현황',13,103,212,39,{size:21});
 note(s,'facility-count','전체 9곳',274,109,101,29,{align:'right'});
 for(const [i,[k,name,initial,level,status]] of entries.entries()){
  const x=10+i%3*124,y=150+Math.floor(i/3)*195;
  const target=k==='dance'?(variant==='damage'?'facility-repair-defense':variant==='restore'?'facility-detail':variant==='levelup'?'facility-next':initial):
   k==='broadcast'&&variant==='restore-battle'?'facility-broadcast-active':
   k==='visual'&&variant==='built'?'facility-new-active':initial;
  const tag=k==='dance'?(variant==='damage'?'수리 필요':variant==='restore'?'증설 가능':status):
   k==='broadcast'&&variant==='restore-battle'?'수리 완료':k==='visual'&&variant==='built'?'':status;
  const n=k==='dance'&&variant==='levelup'?25:k==='visual'&&variant==='built'?1:level;
  const primary=k==='dance'||tag==='수리 필요';
  const a=open(build,s,'tile-'+k,'',x,y,121,188,target,primary?'#e3e3e3':'#ffffff');
  a.name=name;
  inside(image(s,'tile-'+k+'.photo',name+' 외관','card-'+k,x+2,y+2,117,144,'cover'),a);
  if(tag){
   const filled=tag==='증설 가능'||tag==='수리 필요';
   inside(plate(s,'tile-'+k+'.badge',x+7,y+7,74,22,filled?ink:'#ffffff',6),a);
   inside(strong(s,'tile-'+k+'.badge-text',tag==='증설 가능'?'↑ '+tag:tag,x+7,y+7,74,22,{align:'center',size:10,color:filled?'#ffffff':ink}),a);
  }
  inside(strong(s,'tile-'+k+'.name-label',name,x+3,y+147,115,20,{align:'center',size:name.length>8?11:13}),a);
  inside(note(s,'tile-'+k+'.stage',`${n??'—'} / 30`,x+4,y+166,113,18,{align:'center',size:12,weight:700}),a);
 }
 return s;
}
city('city','① 건설 현황 · 9곳 한 화면',0,0);
city('city-damaged','건설 현황 · 디펜스 파손',1,3,'damage');
city('city-grown','건설 현황 · 증설 반영',2,3,'levelup');
city('city-repaired','건설 현황 · 연습실 수리 반영',3,3,'restore');
city('city-repaired-broadcast','건설 현황 · 방송국 수리 반영',4,3,'restore-battle');
city('city-built','건설 현황 · 첫 건설 반영',5,3,'built');

function focus(id,label,key,col,row,exit='city',art='focus-'+key){
 const s=screen(id,label,col,row);
 plate(s,'background',0,0,390,844,surface);
 box(s,'head',0,0,390,58);
 strong(s,'title',label,14,8,307,42,{size:19});
 btn(build,s,'back','×',334,9,42,41,{to:exit,size:19});
 image(s,'map',label+' · 같은 마을에서 건물로 카메라 이동',art,10,72,370,318,'cover');
 box(s,'details',0,396,390,448);
 return s;
}
function stage(s,total,target){
 box(s,'progress',14,418,362,65,'#f1f1f1');
 strong(s,'progress-label','시설 전체 단계',24,425,165,27);
 strong(s,'stage',target?`${total} → ${target} / 30`:`${total??'—'} / 30`,200,425,166,27,{align:'right',size:17});
 plate(s,'progress-track',24,462,342,7,'#dbdbdb',3);
 if(total)plate(s,'progress-fill',24,462,342*total/30,7,'#464646',3);
}
function values(s,rows,top=500){
 for(const [i,[label,value]] of rows.entries()){
  const y=top+i*52;
  box(s,'value-'+i,14,y,362,46,'#f0f0f0');
  strong(s,'value-'+i+'.label',label,23,y+1,160,44);
  note(s,'value-'+i+'.data',value,178,y+1,186,44,{align:'right',weight:720});
 }
}
function actions(s,a,b){
 const y=763;
 if(a)open(build,s,'primary',a[0],14,y,b?176:362,54,a[1],'#d1d1d1');
 if(b)open(build,s,'secondary',b[0],200,y,176,54,b[1]);
}
function detail(k,name,id,n,col,row,mode){
 const s=focus(id,name,k,col,row,mode==='repair-defense'?'city-damaged':'city',mode==='empty'?'focus-empty':undefined);
 stage(s,n);
 const exit=build.transitions.find(t=>t.fromElement===s.id+'.back');
 Object.assign(exit,{action:'back',targetScreen:null});
 if(mode.startsWith('repair')){
  values(s,[['파손 사유', mode==='repair-defense'?'나쁜 기운 디펜스':'출연권 대전 공격'],['시설 영향',mode==='repair-defense'?'연습 중단 · 도착 보상 감소':'도착 보상 감소'],['수리비','마지막 건설비의 50%'],['현재 보유금','—']]);
  actions(s,['수리하기',mode==='repair-defense'?'facility-restored':'facility-restored-battle']);
 } else if(mode==='empty'){
  values(s,[['현재 상태','빈 부지 · 위는 건설 예정 모습'],['첫 건설 비용','—'],['시설 효과','건설 후 적용']]);
  actions(s,['짓기','facility-confirm-new']);
 } else if(mode==='funds'){
  values(s,[['증설 비용','—'],['보유금','—'],['부족한 돈','—']]);
  disable(s,'insufficient','돈이 부족해요',14,763,362,54,'증설 견적보다 보유금이 적음');
 } else if(mode==='complete'){
  values(s,[['시설 상태','완공'],['현재 시설 효과','—']]);
  disable(s,'complete','최대 단계',14,763,362,54,'시설 30단계 완공');
 } else {
  values(s,[['레슨 효과','—'],['칸 도착 보상','—'],['엔터파워','—'],['다음 증설비 · 보유금','— / —']]);
  if(k==='dance')actions(s,['+1 단계 증설','facility-confirm-one'],['최대 증설','facility-confirm']);
  else disable(s,'quote-wait','증설비 연결 대기',14,763,362,54,'검수용 비용 미연결');
 }
 return s;
}
for(const [i,[k,name,id,n]] of entries.entries()){
 const mode={hq:'complete',visual:'empty',broadcast:'repair-battle',rap:'funds'}[k]||'normal';
 detail(k,name,id,n,1+i%5,Math.floor(i/5),mode);
}
detail('dance','댄스 연습실 · 파손','facility-repair-defense',24,5,1,'repair-defense');
detail('broadcast','예능 방송국','facility-broadcast-active',20,3,4,'normal');
const next=focus('facility-next','댄스 연습실','dance',0,2,'city-grown');
stage(next,25);
values(next,[['레슨 효과','—'],['칸 도착 보상','—'],['엔터파워','—'],['다음 증설비 · 보유금','— / —']]);
disable(next,'pending','다음 단계 견적 연결 대기',14,763,362,54,'25단계 이후의 비용과 판정 연결 대기');
const newlyActive=focus('facility-new-active','뷰티 스튜디오','visual',1,4,'city-built');
stage(newlyActive,1);
values(newlyActive,[['시설 상태','건설 완료'],['다음 증설 비용','—']]);
disable(newlyActive,'pending','다음 단계 견적 연결 대기',14,763,362,54,'비용과 판정 연결 대기');

function confirm(id,label,key,c,r,total,target,mode){
 const s=focus(id,label,key,c,r);
 // Keep cancel in the facility zoom sequence; closing goes back to the entry surface.
 stage(s,total,target);
 values(s,[
  ['목표 단계',mode==='max'?'현재 보유금으로 가능한 단계':`${target} / 30`],
  [mode==='max'?'총비용':'건설 비용','—'],
  ['보유금 · 예상 잔액','— / —'],
  ['시설 효과 · 엔터재화','— → — · + —']
 ]);
 actions(s,[mode==='max'?'최대 증설 검수':'진행하기',mode==='new'?'construction-new':mode==='max'?'construction-assembly-max':'construction-assembly']);
 btn(build,s,'cancel','취소',14,763,164,54,{action:'back'});
 const primary=get(s,'primary');primary.x=190/3.9;primary.w=186/3.9;
 return s;
}
confirm('facility-confirm-one','댄스 연습실 · 한 단계 증설','dance',0,1,24,25,'one');
confirm('facility-confirm','댄스 연습실 · 최대 증설','dance',2,1,24,'—','max');
confirm('facility-confirm-new','뷰티 스튜디오 · 건설 견적','visual',3,1,0,1,'new');
for(const [id,title,col,target,exit,shown] of [
 ['construction-assembly','댄스 연습실 · 증설 중',0,'construction-result','city-grown','24 → 25'],
 ['construction-assembly-max','댄스 연습실 · 최대 증설 중',1,'construction-result-max','city','24 → —']
]){
 const s=focus(id,title,'dance',col,3,exit);
 stage(s,24);values(s,[['증설 단계',shown],['장면','같은 맵의 건물이 자라는 연출']]);
 actions(s,['연출 건너뛰기',target]);
}
function result(id,label,key,c,r,n,exit,continueTo,mode){
 const s=focus(id,label,key,c,r,exit);
 stage(s,n);
 values(s,mode==='repair'?[['수리 결과','파손 표시 해제'],['시설 단계','기존 단계 유지']]:
  [['시설 효과 · 엔터파워','— → —'],['엔터재화 · 문턱 보상','해당 시 표시']]);
 actions(s,continueTo?['이 시설 계속 증설',continueTo]:null);
 btn(build,s,'return','돌아가기',continueTo?200:14,763,continueTo?176:362,54,{to:exit});
 return s;
}
result('construction-result','댄스 연습실 · 증설 완료','dance',2,2,25,'city-grown','facility-next','build');
result('construction-result-max','댄스 연습실 · 최대 증설 완료','dance',3,2,null,'city',null,'build');
result('construction-new','뷰티 스튜디오 · 첫 건설 완료','visual',4,2,1,'city-built','facility-new-active','build');
result('facility-restored','댄스 연습실 · 수리 완료','dance',5,2,24,'city-repaired',null,'repair');
result('facility-restored-battle','예능 방송국 · 수리 완료','broadcast',0,4,20,'city-repaired-broadcast',null,'repair');
const parts=screen('construction-parts','건설 공통 부품 · 카드·지붕 표식',2,4);
plate(parts,'backdrop',0,0,390,844,surface);
strong(parts,'title','건설 공통 부품',16,9,345,49,{size:20});
for(const [i,[asset,label]] of [['hq','완공'],['dance','증설 가능'],['broadcast','수리 필요']].entries()){
 const x=15+122*i;
 image(parts,'card-'+asset,label,'card-'+asset,x,89,112,144,'cover');
 strong(parts,'state-'+asset,label,x,240,112,35,{align:'center'});
}
stage(parts,24);
strong(parts,'touch','로비 지붕 표식 · 전체 단계 바',16,540,350,43,{size:17});
note(parts,'notes','시설 ID·현재 단계·파손·보유금으로 결정',16,598,350,31);
const mapEntries={
 'production':[.165,.42],'hq':[.50,.14],'academy':[.83,.18],
 'vocal':[.18,.16],'dance':[.50,.39],'rap':[.83,.41],
 'fanshop':[.18,.70],'broadcast':[.50,.73],'visual':[.82,.70]
};
for(const s of hud.screens.filter(s=>['main','main-solo','arrived','defense-full'].includes(s.id))){
 const world=get(s,'world');
 const w=world.w*3.9;
 const h=w*.75;
 const x=world.x*3.9,y=world.y*8.44+(world.h*8.44-h)*.49;
 const map=image(s,'village-map','기획사 마을 전체 9개 시설','village',x,y,w,h);
 map.name='흑백 기획사 마을 · 전체 보드';
 for(const [k,name] of entries){
  const [u,v]=mapEntries[k];const cx=x+w*u,cy=y+h*v;
  const e=btn(hud,s,'village-'+k,'',cx-22,cy-18,44,40,{action:'module',payload:{moduleId,label:name,context:{facility:k,source:'hud-map'}}});
  e.name=name+' 선택';
  delete e.skin;
  e.appearance={shape:'rounded',fill:'#ffffff',strokeWidth:0,radius:7,opacity:0};
 }
 for(const [k,label,dy] of [['dance','↑ 증설 가능',-38],['broadcast','수리 필요',-26]]){
  const [u,v]=mapEntries[k];const cx=x+w*u,cy=y+h*v;
  const name=entries.find(e=>e[0]===k)[1];
  const tag=btn(hud,s,'village-'+k+'.badge',label,cx-37,cy+dy,74,22,{fill:'#676767',size:10,action:'module',payload:{moduleId,label:name,context:{facility:k,source:'hud-map'}}});
  delete tag.skin;
  tag.appearance={shape:'rounded',fill:'#2b2b2b',stroke:'#ffffff',strokeWidth:1,radius:7};
  get(s,'village-'+k+'.badge.label').appearance.textColor='#ffffff';
 }
}
for(const [file,design] of [['build-village',build],['hud-village',hud]]){
 validateDocument(design);
 writeFileSync(new URL(file+'.json',import.meta.url),JSON.stringify(design,null,2)+'\n');
 writeFileSync(new URL(file+'-assets.json',import.meta.url),JSON.stringify(assets));
}
writeFileSync(new URL('entries.json',import.meta.url),JSON.stringify(entries));
