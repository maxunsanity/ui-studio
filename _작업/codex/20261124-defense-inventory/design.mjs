import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {readDesign,shape,text,btn,get} from '../20261124-defense-simple/shared.mjs';
import {validateDocument} from '../../../src/tools/uxStudio/model.mjs';

const d=JSON.parse(readFileSync(new URL('../../../docs/planning/_backup/20261124_단이/디펜스보관함과스킬오버레이/kpop-defense-ui-r3.json',import.meta.url)));
d.revision=readDesign(d.projectId).revision;
const mons=readDesign('kpop-mons-ui');
const storage=mons.screens.find(screen=>screen.id==='mons-storage');
const moodScreen=mons.screens.find(screen=>screen.id==='mons-guard');
const moodValues=new Map(moodScreen.elements.filter(e=>/^mons-guard\.guard-\d+-name$/.test(e.id)).map(e=>[e.text,Number(moodScreen.elements.find(part=>part.id===e.id.replace(/-name$/,'-status'))?.text.match(/기분 (\d+)/)?.[1])]));
const find=id=>d.screens.find(screen=>screen.id===id);
const prep=find('defense-warning'), battle=find('defense-battle'), parts=find('defense-parts');
const frame=(s,k,x,y,w,h,fill='#ffffff')=>shape(s,k,k,'panel',x,y,w,h,{frame:fill});
const label=(s,k,value,x,y,w,h,o={})=>text(s,k,value,x,y,w,h,{size:12,weight:740,...o});
const art=(s,k,image,x,y,w,h,fit='contain')=>{
 const e=shape(s,k,image.alt,'image',x,y,w,h,{role:'image'});
 e.image={...image,fit};
 return e;
};
function clear(s,keep){s.elements=s.elements.filter(e=>keep(e.id.slice(s.id.length+1)));d.transitions=d.transitions.filter(t=>t.fromScreen!==s.id||s.elements.some(e=>e.id===t.fromElement));}
const oldWorld=get(battle,'building').image;
const overlayPresentation={type:'modal',rootMode:'fullscreen',dim:false,autoCloseMs:0,blocking:true,dismissOnEscape:true,effect:'fade',durationMs:160};
const schedule=readDesign('kpop-schedule-ui');
const scheduleResult=schedule.screens.find(screen=>screen.id==='result');
const scheduleEmpty=schedule.screens.find(screen=>screen.id==='result-failed');
const rewardTile=get(scheduleResult,'reward-tile-2');
const rewardCoin=get(scheduleResult,'reward-image-2').image;
const emptyTile=get(scheduleEmpty,'empty-reward');
const existingOptions=['homing_burst','ice_homing','chain_lightning'].map(key=>get(parts,key+'.image').image);
const oldGuardians=battle.elements.filter(e=>e.id.startsWith('defense-battle.guardian-')).map(e=>e.image);
const targetArt=get(prep,'building');
Object.assign(targetArt,{x:14/3.9,y:66/8.44,w:362/3.9,h:160/8.44});
for(const key of ['target','target.name','countdown']){
 const el=get(prep,key);el.y-=93/8.44;
}
clear(prep,k=>['background','head','title','back','back.label','building','target','target.name','countdown','ignore','ignore.label','defend','defend.label'].includes(k));
prep.purpose='습격 시설과 보관함 카드 체크, 최대 5마리 출격 슬롯을 한 전체 화면에서 확인합니다.';
label(prep,'pick-title','출격 몬스 선택',14,230,210,30,{size:16});
label(prep,'order','단계 높은 순',236,231,139,29,{align:'right',color:'#556575'});
const keys=['capybara','axolotl','sugar_glider','pygmy_hippo','chinchilla','rat','red_panda','sloth','snow_leopard','quokka','tiger','rabbit'];
const cards=[];
for(const key of keys){
 const a=get(storage,'card-'+key+'-art'),name=get(storage,'card-'+key+'-name'),stage=get(storage,'card-'+key+'-stage'),state=get(storage,'card-'+key+'-state');
 if(a&&name&&stage)cards.push({key,name:name.text,stage:stage.text,availability:state?.text||'',image:a.image});
}
let selected=0;
for(const [i,c] of cards.entries()){
 const x=14+i%3*122,y=267+Math.floor(i/3)*92;
 c.initial=selected<4;
 if(c.initial)selected++;
 const base=frame(prep,'card-'+c.key,x,y,116,87,'#ffffff');
 art(prep,'card-'+c.key+'.art',c.image,x+24,y+17,68,36);
 label(prep,'card-'+c.key+'.stage',c.stage,x+6,y+3,70,16,{size:10,color:'#566775'});
 label(prep,'card-'+c.key+'.name',c.name,x+6,y+52,104,18,{align:'center'});
 if(c.availability)label(prep,'card-'+c.key+'.availability',c.availability,x+68,y+37,42,14,{size:9,align:'right',color:'#5b6874'});
 const feeling=moodValues.get(c.name);
 const meterX=x+30,meterY=y+77;
 label(prep,'card-'+c.key+'.mood','기분',x+6,y+70,24,15,{size:9,color:'#526779'});
 shape(prep,'card-'+c.key+'.mood-track','기분 게이지','panel',meterX,meterY,55,3,{fill:'#d7dee4',radius:2});
 if(Number.isFinite(feeling))shape(prep,'card-'+c.key+'.mood-fill','기분 '+feeling,'panel',meterX,meterY,55*feeling/100,3,{fill:'#526f85',radius:2});
 label(prep,'card-'+c.key+'.mood-value',Number.isFinite(feeling)?String(feeling):'—',x+89,y+70,21,15,{size:9,align:'right',color:'#526779'});
 c.toggle=shape(prep,'pick-'+c.key,c.name+' 출격 선택','panel',x+90,y+4,22,22).id;
 const toggle=get(prep,'pick-'+c.key);
 toggle.text=" ";
 toggle.control={type:'toggle',value:c.initial,choiceShape:'square',choiceSize:18,choiceColor:'#324c63'};
 toggle.interaction={mode:'action',enabled:true,shape:'rectangle',reason:''};
 c.card=base.id;
}
const rowY=267+Math.ceil(cards.length/3)*92;
const chosen=cards.filter(c=>c.initial);
label(prep,'capacity','출격 편성 '+chosen.length+' / 5',14,rowY,145,25,{size:15});
label(prep,'hint','카드 체크로 추가 · 해제',154,rowY,222,25,{align:'right',color:'#566775'});
const slots=[],battleSlots=[],resultSlots=[];
const blank={src:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=',alt:'빈칸'};
for(let i=0;i<5;i++){
 const x=14+i*73,k='slot-'+(i+1),c=chosen[i];
 frame(prep,k+'.frame',x,rowY+26,70,62,c?'#edf3f7':'#ffffff');
 const image=art(prep,k+'.art',c?.image??blank,x+18,rowY+30,34,30);
 const name=label(prep,k+'.name',c?.name??'빈칸',x+2,rowY+61,66,20,{align:'center',size:10});
 slots.push({image:image.id,name:name.id});
}
for(const key of ['ignore','defend'])get(prep,key).y=767/8.44;
d.transitions.find(t=>t.fromElement===prep.id+'.ignore').action='open';

clear(battle,()=>false);
battle.purpose='화면 전체에서 전투 · 시설 내구도와 남은 시간은 상단 · 몬스와 보유 스킬, 피니시는 하단';
const stageURL=new URL('battlefield.png',import.meta.url), assets={};
let world=oldWorld;
try{
 const bytes=readFileSync(stageURL);
 const ref='sha256-'+createHash('sha256').update(bytes).digest('hex')+'.png';
 world={assetRef:ref,src:'',sourceSize:[bytes.readUInt32BE(16),bytes.readUInt32BE(20)],alt:'게임 시뮬레이터의 디펜스 전장',fit:'cover'};
 assets[ref]=decodeURIComponent(stageURL.pathname);
}catch(error){if(error.code!=='ENOENT')throw error;}
art(battle,'world',world,0,0,390,844,'cover');
for(const [i,name] of ['전체','건물','몬스'].entries()){
 btn(d,battle,'camera-'+i,name,12+i*61,12,55,34,{action:'feedback',fill:i===1?'#d4e0e9':undefined,payload:{message:name+' 카메라 상태 예시입니다.'}});
}
btn(d,battle,'pause','멈춤',319,12,58,34,{action:'feedback',payload:{message:'전투를 일시정지했습니다.'}});
frame(battle,'hud',12,53,366,115,'#e7edf3');
label(battle,'title','댄스 연습실 방어',24,60,205,30,{size:17});
label(battle,'time','02:41',298,60,64,30,{align:'right',size:15});
label(battle,'status','웨이브 2 · 남은 악귀 18',24,91,340,22,{size:11,color:'#546676'});
label(battle,'durability','시설 내구도',24,115,80,23,{size:11});
shape(battle,'hp-track','시설 내구도 바탕','panel',111,122,202,6,{fill:'#c4cfd8',radius:3});
shape(battle,'hp','시설 내구도 80%','panel',111,122,162,6,{fill:'#354e63',radius:3});
label(battle,'hp-count','80%',320,115,43,23,{align:'right'});
label(battle,'next-skill','다음 스킬 선택 8초',24,141,340,18,{size:11,color:'#425e76'});
if(world===oldWorld)oldGuardians.forEach((image,i)=>art(battle,'guardian-'+i,image,48+i*108,503,78,81));
frame(battle,'owned',12,687,366,144,'#e7edf3');
label(battle,'owned-label','출격 몬스',24,695,117,22);
label(battle,'reward','처치 12 · 보상 240',151,695,213,22,{align:'right'});
for(const [i,c] of [...chosen,null].entries()){
 const x=24+i*67;
 frame(battle,'fighter-'+i,x,720,61,58,c?'#ffffff':'#e4e9ed');
 const image=art(battle,'fighter-'+i+'.portrait',c?.image??blank,x+10,723,41,38);
 const name=label(battle,'fighter-'+i+'.name',c?.name??'빈칸',x+2,760,57,15,{size:9,align:'center'});
 battleSlots.push({image:image.id,name:name.id});
}
const common=btn(d,battle,'common-skill','',24,785,342,36,{action:'feedback',fill:'#d4e0e9',payload:{message:'공통 스킬 · 연습실 보호막 발동'}});
common.name='공통 스킬 · 연습실 보호막 발동';
const commonIcon=art(battle,'common-skill.icon',get(parts,'building_barrier.image').image,0,0,27,27);
Object.assign(commonIcon,{parentId:common.id,x:2,y:8,w:8,h:84,interaction:{mode:'parent',enabled:true,shape:'rectangle',reason:''}});
label(battle,'common-skill.title','공통 스킬',12,0,40,100,{parentId:common.id,percent:true,size:13});
label(battle,'common-skill.status','연습실 보호막 · 발동 가능',48,0,48,100,{parentId:common.id,percent:true,align:'right',size:11,color:'#415973'});

const overlay={id:'defense-skills',kind:'modal',name:'②-1 전투 위 스킬 선택 · 오버레이',purpose:'같은 전장 하단에 스킬 카드 3장이 떠 있습니다. 한 장을 고르면 오버레이가 닫힙니다.',logicalSize:{w:390,h:844},wireframeReview:true,canvasPosition:{x:24+3*424,y:44},presentation:{...overlayPresentation,hideBaseElements:['defense-battle.next-skill']},elements:[]};
d.screens.splice(d.screens.indexOf(battle)+1,0,overlay);
frame(overlay,'body',16,465,358,192,'#eff4f8');
label(overlay,'title','스킬을 골라 주세요',28,474,334,26,{align:'center',size:19});
label(overlay,'hint','후보 3장 중 한 장을 선택하세요',28,501,334,18,{align:'center',color:'#506879'});
const skills=[['유도 미사일','표적 추적'],['빙결탄','빙결 · 둔화'],['연쇄 번개','인접 적 연쇄']];
for(const [i,[name,role]] of skills.entries()){
 const x=27+i*113;
 const card=btn(d,overlay,'card-'+i,'',x,524,110,122,{action:'close'});
 card.name=name+' 선택';
 const icon=art(overlay,'card-'+i+'.icon',existingOptions[i],0,0,50,50);
 Object.assign(icon,{parentId:card.id,x:28,y:8,w:44,h:37,interaction:{mode:'parent',enabled:true,shape:'rectangle',reason:''}});
 label(overlay,'card-'+i+'.kind','아홀로틀 · 신규',2,45,96,15,{parentId:card.id,percent:true,align:'center',size:10,color:'#4d6577'});
 label(overlay,'card-'+i+'.name',name,2,60,96,16,{parentId:card.id,percent:true,align:'center',size:13});
 label(overlay,'card-'+i+'.role',role,2,78,96,14,{parentId:card.id,percent:true,align:'center',size:10,color:'#4d6577'});
}
for(const result of ['defense-success','defense-failed','defense-ignore'].map(find)){
 result.elements=result.elements.filter(e=>!e.id.startsWith(result.id+'.guard-'));
 result.kind='modal';
 result.presentation={...overlayPresentation,dim:true,dismissOnEscape:false};
 result.purpose='같은 전장 위에서 시설과 참여 몬스, 결과와 다음 동작을 보여 줍니다.';
 result.elements=result.elements.filter(e=>!['background','head','title'].includes(e.id.slice(result.id.length+1)));
 const won=result.id==='defense-success';
 const skipped=result.id==='defense-ignore';
 const footerY=won?645:693;
 result.elements=result.elements.filter(e=>e.id!==result.id+'.reward'&&!e.id.startsWith(result.id+'.reward.'));
 label(result,'earned-title','받은 보상',25,489,342,16,{size:13});
 const tile=frame(result,'earned-tile',24,507,342,60);
 tile.skin=structuredClone((skipped?emptyTile:rewardTile).skin);
 if(skipped){
  const emptyDisc=frame(result,'earned-empty-mark',37,519,34,34);
  emptyDisc.skin=structuredClone(get(scheduleEmpty,'empty-reward-disc').skin);
  label(result,'earned-empty-dash','—',37,519,34,34,{align:'center',size:17,color:'#41556b'});
  label(result,'earned-empty','받은 보상이 없어요',83,519,270,34);
 }else{
  art(result,'earned-icon',rewardCoin,37,518,37,38);
  label(result,'earned-name','돈',85,515,128,17,{size:11});
  label(result,'earned-quantity','+240',85,535,124,25,{size:17});
  label(result,'earned-note',won?'처치 보상 · 지킴 덤 포함':'처치 보상',190,515,165,44,{size:11,align:'right',color:'#445f75'});
 }
 for(const key of ['building','facade-state'])Object.assign(get(result,key),{y:136/8.44,h:260/8.44});
 const rows=won?['facility']:['facility','repair-cost'];
 for(const [i,key] of rows.entries()){
  const baseline=582+i*49;
  Object.assign(get(result,key),{x:24/3.9,w:342/3.9,y:baseline/8.44});
  const name=get(result,key+'.name'),value=get(result,key+'.value');
  Object.assign(name,{x:34/3.9,y:baseline/8.44});
  Object.assign(value,{w:(value.w*3.9-10)/3.9,y:baseline/8.44});
 }
 Object.assign(get(result,'back-board'),{x:24/3.9,w:(won?342:167)/3.9,y:footerY/8.44,h:44/8.44});
 if(!won)Object.assign(get(result,'repair'),{w:164/3.9,y:footerY/8.44,h:44/8.44});
 frame(result,'result-panel',14,402,362,footerY+56-402,'#f0f4f7');
 const panel=result.elements.pop();
 result.elements.unshift(panel);
 const at=result.elements.indexOf(get(result,'caption'));
 const entries=[];
 for(let i=0;i<5;i++){
  const image=art(result,'mon-'+i,chosen[i]?.image??blank,30+i*67,319,61,76);
  entries.push(result.elements.pop());
  resultSlots.push({image:image.id,index:i});
 }
 result.elements.splice(at,0,...entries);
}
for(const [index,screen] of d.screens.entries())screen.canvasPosition={x:24+index%4*424,y:44+Math.floor(index/4)*898};
console.log('inventory',cards.length,'screens',d.screens.length);
validateDocument(d);
for(const [name,value] of [['defense',d],['defense-assets',assets],['selection',{screen:prep.id,limit:5,count:prep.id+'.capacity',hint:prep.id+'.hint',defend:prep.id+'.defend',slots,battleSlots,resultSlots,cards:cards.map(({name,key,toggle,card,image,initial})=>({name,key,toggle,card,image,initial}))}]]){
 writeFileSync(new URL(name+'.json',import.meta.url),JSON.stringify(value,null,2));
}
