import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {validateDocument} from '/Users/max/projest_max/ui-studio/src/tools/uxStudio/model.mjs';
import {shape,text,btn,get,tone} from './shared.mjs';
const URLfor=name=>new URL(name,import.meta.url);
const read=name=>JSON.parse(readFileSync(URLfor(name+'.json')));
const before=read('defense-base'),hud=read('hud-base'),build=read('build-base');
const d={...before,entryScreen:'defense-warning',screens:[],transitions:[],fixtures:{balance:0,items:[]}};
const fonts={ink:'#24303a',muted:'#566775'};
const white='#ffffff',light='#eef1f3',dark='#313d48';
const assets={};
const find=(doc,id)=>doc.screens.find(s=>s.id===id);
const original=get(find(build,'facility-detail'),'map').image;
const roster=find(before,'defense-formation').elements.filter(e=>e.id.endsWith('-portrait')).map(e=>[e.image.alt,e.image]);
const gl=(name,label)=>{
 const url=URLfor('art/'+name+'.png');
 const bytes=readFileSync(url);
 const ref='sha256-'+createHash('sha256').update(bytes).digest('hex')+'.png';
 assets[ref]=decodeURIComponent(url.pathname);
 return {assetRef:ref,src:'',sourceSize:[bytes.readUInt32BE(16),bytes.readUInt32BE(20)],alt:label,fit:'contain'};
};
const pic=(s,k,img,x,y,w,h,fit='contain')=>{
 const e=shape(s,k,img.alt,'image',x,y,w,h,{role:'image'});e.image={...img,fit};return e;
};
const txt=(s,k,v,x,y,w,h,o={})=>text(s,k,v,x,y,w,h,{size:13,color:fonts.ink,...o});
const strong=(s,k,v,x,y,w,h,o={})=>txt(s,k,v,x,y,w,h,{weight:820,...o});
const meta=(s,k,v,x,y,w,h,o={})=>txt(s,k,v,x,y,w,h,{size:11,color:fonts.muted,...o});
const frame=(s,k,x,y,w,h,c=white)=>shape(s,k,k,'panel',x,y,w,h,{frame:c});
const rect=(s,k,x,y,w,h,c,radius=0)=>shape(s,k,k,'panel',x,y,w,h,{fill:c,radius});
const open=(s,k,v,x,y,w,h,to,fill)=>btn(d,s,k,v,x,y,w,h,{to,fill});
const module=(s,k,v,x,y,w,h,id,context={})=>btn(d,s,k,v,x,y,w,h,{action:'module',payload:{moduleId:id,label:v,context}});
const H='simulator_module_hud',B='simulator_module_building';
function board(id,name,purpose,index){
 const s={id,name,purpose,kind:'page',logicalSize:{w:390,h:844},wireframeReview:true,canvasPosition:{x:24+index%3*424,y:44+Math.floor(index/3)*898},elements:[]};
 d.screens.push(s);
 rect(s,'background',0,0,390,844,light);
 return s;
}
function head(s,title){
 frame(s,'head',0,0,390,56);
 strong(s,'title',title,14,5,270,44,{size:19});
}
function rule(s,k,label,v,y){
 frame(s,k,14,y,362,44,white);
 strong(s,k+'.name',label,24,y,115,44);
 meta(s,k+'.value',v,125,y,239,44,{align:'right',size:12});
}
function meter(s,k,x,y,w,h,value){
 rect(s,k+'.track',x,y,w,h,'#d3dae0',4);
 rect(s,k+'.value',x,y,w*value/100,h,dark,4);
}
const prep=board('defense-warning','① 습격 건물 · 출격 편성','건물 한 곳의 경고와 최대 5마리 한 줄 편성을 한 화면에 표시합니다.',0);
head(prep,'나쁜 기운 디펜스');
module(prep,'back','×',334,8,41,38,H,{screen:'defense-full',gauge:360});
pic(prep,'building',{...original,alt:'건설과 같은 댄스 연습실 외관'},14,72,362,254,'cover');
frame(prep,'target',22,259,346,56);
strong(prep,'target.name','습격 대상 · 댄스 연습실',32,266,255,40,{size:16});
strong(prep,'countdown','05:00',287,265,69,40,{align:'right',size:17});
strong(prep,'formation-title','출격 편성',14,343,170,31,{size:16});
meta(prep,'capacity','최대 5마리',242,343,132,31,{align:'right',size:13,weight:760});
const selection=[[0,8],[2,6],[4,10],[1,7],[5,3]];
for(const [i,choices] of selection.entries()){
 const x=14+i*73,k='slot-'+(i+1);
 frame(prep,k+'.frame',x,382,70,120);
 meta(prep,k+'.label',`출격 ${i+1}`,x+2,386,66,19,{align:'center'});
 pic(prep,k+'.initial-art',{...roster[choices[0]][1],alt:'자동 편성 예시 '+roster[choices[0]][0]},x+8,410,54,49);
 const e=shape(prep,k,'출격 '+(i+1)+' 몬스 선택','panel',x+2,461,66,34);
 e.control={type:'dropdown',value:String(choices[0]),options:[{value:'empty',label:'빈칸'},...choices.map(n=>({value:String(n),label:roster[n][0]}))]};
 e.interaction={mode:'action',enabled:true,shape:'rectangle',reason:''};
}
meta(prep,'hint','자동 편성 예시 · 슬롯을 눌러 이번 출격만 변경',14,511,363,32,{size:12});
rule(prep,'loss','방어 실패','한 단계 전 외형이 파손 상태로 표시',565);
rule(prep,'mood','몬스 기분','한 발 피해에 반영되며 전투 뒤 유지',617);
open(prep,'ignore','그냥 두기',14,760,174,56,'defense-ignore');
open(prep,'defend','방어하기',202,760,174,56,'defense-battle','#d2d9de');

const list=[
 ['homing_burst','유도 미사일','표적 추적'],
 ['ice_homing','빙결탄','빙결·둔화'],
 ['frost_split','분열탄','명중 후 분열'],
 ['fire_explosive','화염 지대','범위 지속 피해'],
 ['fire_arc','곡사 포격','지상 범위 폭발'],
 ['chain_lightning','연쇄 번개','인접 적 연쇄'],
 ['pierce_burst','관통 연타','직선 관통'],
 ['bounce_pulse','튕기는 구체','적 사이 반사'],
 ['laser_beam','지속 레이저','경로 지속 피해'],
 ['spawn_slow','감속장','출현 지역 감속'],
 ['sweep_arc','회전 미사일','전방위 발사'],
 ['ground_slam','지상 내려찍기','지상 충격파'],
 ['building_barrier','연습실 보호막','피해 흡수'],
 ['ice_wave','빙결 파동','범위 빙결'],
 ['electric_discharge','번개 방전','범위 피해·기절']
];
const battle=board('defense-battle','② 전투 HUD · 대표 화면','시설 내구도 하나와 전장, 스킬 선택·피니시를 한 화면에서 설명합니다.',1);
head(battle,'댄스 연습실 방어');
btn(d,battle,'pause','멈춤',315,8,60,38,{action:'feedback',payload:{message:'일시정지는 전투를 멈추고 계속 또는 포기를 선택하는 상태입니다.'}});
frame(battle,'battle-status',14,67,362,44);
strong(battle,'wave','웨이브 2',24,69,132,41);
meta(battle,'time','2:41 · 남은 악귀 18',191,69,174,41,{align:'right',size:12});
frame(battle,'health',14,122,362,58);
strong(battle,'health.name','시설 내구도',24,124,145,26);
strong(battle,'health.value','80%',227,124,137,26,{align:'right'});
meter(battle,'health.bar',24,154,342,9,80);
pic(battle,'building',{...original,alt:'댄스 연습실 한 채를 방어하는 전장 참조'},14,193,362,278,'cover');
for(const [j,id] of [0,2,6].entries())pic(battle,'guardian-'+j,roster[id][1],46+j*110,401,77,62);
frame(battle,'notice',14,480,362,37);
meta(battle,'notice.text','새로운 길목이 열립니다',24,480,340,37,{align:'center',size:12,weight:750});
strong(battle,'skill-heading','스킬 카드',14,523,180,31,{size:16});
meta(battle,'skill-meta','예시 · 한 장 선택',211,523,163,31,{align:'right'});
for(const [i,n] of [0,1,5].entries()){
 const [key,label]=list[n],x=14+i*121;
 const e=btn(d,battle,'skill-'+i,'',x,561,116,98,{action:'feedback',payload:{message:label+' · 선택 완료'}});
 e.name=label+' 선택';
 const icon=pic(battle,'skill-'+i+'.icon',gl(key,label),0,0,54,54);
 Object.assign(icon,{parentId:e.id,x:29,y:6,w:42,h:57,interaction:{mode:'parent',enabled:true,shape:'rectangle',reason:''}});
 text(battle,'skill-'+i+'.name',label,4,64,92,31,{size:12,weight:800,align:'center',percent:true,parentId:e.id});
}
frame(battle,'finish',14,671,362,45,'#dce5ec');
pic(battle,'finish.icon',gl('building_barrier','연습실 보호막'),25,676,35,35);
strong(battle,'finish.copy','팀 피니시 · 함께 발동',70,673,221,40);
meta(battle,'finish.ready','준비 상태',272,673,93,40,{align:'right'});
meta(battle,'result-qa','결과 검수',14,733,140,24);
open(battle,'success','성공 보기',14,762,174,52,'defense-success');
open(battle,'failed','실패 보기',202,762,174,52,'defense-failed');

function result(id,name,index,mode){
 const s=board(id,name,'같은 연습실 한 채와 몬스의 결과 연출을 표시합니다.',index);
 head(s,name);
 pic(s,'building',{...original,alt:'건설과 같은 댄스 연습실'},14,72,362,318,'cover');
 const hit=mode!=='success';
 pic(s,'facade-state',gl(hit?'damage':'guard-glow',hit?'건물 파손 균열':'방어 성공 빛 효과'),14,72,362,318,'fill');
 for(const [j,n] of [0,6,2].entries())pic(s,'guard-'+j,roster[n][1],47+j*103,314,78,86);
 frame(s,'caption',24,410,342,75,white);
 strong(s,'caption.main',hit?(mode==='ignore'?'연습실이 파손됐어요':'몬스들이 끝까지 방어했어요'):'몬스들이 연습실을 지켰어요!',33,415,324,38,{align:'center',size:17});
 meta(s,'caption.sub',hit?'23단계 외형으로 파손 표시 · 예시':'몬스 보호 성공 · 시설 유지',33,452,324,23,{align:'center'});
 if(hit){
  rule(s,'facility','시설 상태','도착 보상 감소 · 연습 중단',507);
  rule(s,'repair-cost','수리비','마지막 건설비의 50%',561);
  rule(s,'reward','결과',mode==='ignore'?'게이지 0부터 다시':'처치 보상만 지급',615);
 }else{
  rule(s,'reward','받은 보상','처치 보상 + 지킴 덤',507);
  rule(s,'facility','시설 상태','연습실 정상 이용',561);
 }
 module(s,'back-board','보드로 돌아가기',14,760,hit?173:362,56,H,{screen:'main',gauge:0});
 if(hit)module(s,'repair','수리하러 가기',202,760,174,56,B,{screen:'facility-repair-defense',facilityId:'dance',gauge:0});
}
result('defense-success','③ 결과 · 방어 성공',2,'success');
result('defense-failed','③ 결과 · 방어 실패',3,'failed');
result('defense-ignore','③ 결과 · 그냥 두기',4,'ignore');

const parts=board('defense-parts','④ 스킬과 전투 부품','일반 스킬 10개와 팀 피니시 5개의 이미지·이름·역할을 한 보드에 둡니다.',5);
head(parts,'디펜스 스킬과 전투 부품');
strong(parts,'skills.heading','일반 스킬 10종',14,70,350,31,{size:16});
strong(parts,'finisher.heading','팀 피니시 5종',14,449,350,31,{size:16});
for(const [i,[id,name,role]] of list.entries()){
 const x=10+i%5*74.5;
 const y=i<10?111+Math.floor(i/5)*164:488;
 frame(parts,id,x,y,71,149,i<10?white:'#e7edf2');
 pic(parts,id+'.image',gl(id,name),x+10,y+11,51,51);
 strong(parts,id+'.name',name,x+1,y+72,69,34,{align:'center',size:11,wrap:'nowrap'});
 meta(parts,id+'.role',role,x+2,y+111,67,27,{align:'center',size:10,wrap:'nowrap'});
}
rule(parts,'facility-meter','시설 내구도','습격 시설 하나의 남은 내구도',666);
rule(parts,'boss','보스 경고','공격 예고와 체력은 전투 줄에서 표시',720);
rule(parts,'skills','전투 조작','스킬 선택 · 팀 피니시 · 멈춤',774);

const full=find(hud,'defense-full');
const repair=find(build,'facility-repair-defense');
const oldImage=get(repair,'map');
const crack=pic(repair,'facade-state',gl('damage','한 단계 전 외형에 파손 표시'),oldImage.x*3.9,oldImage.y*8.44,oldImage.w*3.9,oldImage.h*8.44,'fill');
rect(repair,'damaged-stage-tag',20,348,350,29,'#f2f2f2',6);
strong(repair,'damaged-stage','23단계 외형 · 파손 상태 예시',28,351,330,23,{size:12,align:'center'});
const value=get(full,'rail0.1.value');
value.text=value.name='05:00';
const status=get(full,'roll.status');
status.text=status.name='자동 굴리기 멈춤 · 게이지에서 방어 준비';
const hudGuide=find(hud,'defense-gauge-help');
const hint=get(hudGuide,'hint');
if(hint)hint.text=hint.name='가득 차면 5분 카운트 · 게이지를 눌러 방어 준비';
for(const [file,design,resources] of [['defense-simple',d,assets],['hud-countdown',hud,{}],['build-damage',build,{ }]]){
 validateDocument(design);
 writeFileSync(URLfor(file+'.json'),JSON.stringify(design,null,2)+'\n');
 writeFileSync(URLfor(file+'-assets.json'),JSON.stringify(resources));
}
assert.equal(prep.elements.filter(e=>e.control?.type==='dropdown').length,5);
assert.equal(parts.elements.filter(e=>e.image).length,15);
console.log(d.screens.length,d.transitions.length,Object.keys(assets).length);
const previewImages=Object.fromEntries(selection.map((choices,i)=>[
 'defense-warning.slot-'+(i+1),
 {element:'defense-warning.slot-'+(i+1)+'.initial-art',options:Object.fromEntries(choices.map(index=>[index,roster[index][1]]))}
]));
writeFileSync(URLfor('portrait-binding.json'),JSON.stringify(previewImages));
