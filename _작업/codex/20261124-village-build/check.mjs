import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const stage=fileURLToPath(new URL('.',import.meta.url));
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless','--disable-gpu','--no-first-run','--user-data-dir='+stage+'chrome','--remote-debugging-pipe'],{stdio:['ignore','ignore','ignore','pipe','pipe']});
let count=0,buffer='';const pending=new Map();
chrome.stdio[4].on('data',chunk=>{buffer+=chunk;for(;;){const end=buffer.indexOf('\0');if(end<0)break;const msg=JSON.parse(buffer.slice(0,end));buffer=buffer.slice(end+1);if(!msg.id)continue;const p=pending.get(msg.id);pending.delete(msg.id);msg.error?p.reject(Error(JSON.stringify(msg.error))):p.resolve(msg.result);}});
const command=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++count;pending.set(id,{resolve,reject});chrome.stdio[3].write(JSON.stringify({id,method,params,sessionId})+'\0');});
const timeout=setTimeout(()=>{chrome.kill();process.exit(2)},55000);
const workspace='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba';
const origin='http://127.0.0.1:7018';
const base=origin+'/ui-studio/';
const hud='import-6604270d', build='kpop-build-ui';
const preview=(project,screen)=>'preview.html?'+new URLSearchParams({workspace,project,screen});
const dirs={evidence:'/Users/max/projest_max/ui-studio/docs/planning/_검수캡쳐/20261124_단이_마을건설현황/',assets:'/Users/max/projest_max/ui-studio/src/tools/uxStudio/guide/reference/kpop-planning/snapshot/assets/'};
mkdirSync(dirs.evidence,{recursive:true});
let sid;
async function evalPage(expression){
 const res=await command('Runtime.evaluate',{expression,returnByValue:true},sid);
 if(res.exceptionDetails)throw Error(res.exceptionDetails.text);
 return res.result.value;
}
async function when(expr){
 for(let i=0;i<66;i++){
  const v=await evalPage(expr);
  if(v)return v;
  await delay(90);
 }
 throw Error(expr+' timeout '+JSON.stringify(await evalPage('({url:location.href,text:document.body.innerText.slice(0,450),screens:[...document.querySelectorAll("[data-screen]")].map(e=>e.dataset.screen)})')));
}
const checkScreen=id=>when(`[...document.querySelectorAll('[data-screen="${id}"]')].some(e=>e.getClientRects().length)`);
const go=relative=>command('Page.navigate',{url:base+relative},sid);
async function click(id,next){
 const selector='[data-element="'+id+'"]';
 const q=JSON.stringify(selector);
 const p=await when(`(()=>{const e=document.querySelector(${q});if(!e?.getClientRects().length)return null;e.scrollIntoView({block:'nearest'});const b=e.getBoundingClientRect();const x=b.left+b.width/2,y=b.top+b.height/2;return {x,y,hit:document.elementFromPoint(x,y)?.closest('[data-element]')?.dataset.element};})()`);
 assert(p.hit===id||p.hit?.startsWith(id+'.'),id+' click hit '+JSON.stringify(p));
 for(const type of ['mousePressed','mouseReleased'])await command('Input.dispatchMouseEvent',{type,x:p.x,y:p.y,button:'left',clickCount:1},sid);
 if(next){await checkScreen(next);console.log('click',id,'→',next);}
}
async function screenshot(clipId,file){
 await delay(330);
 const p=await when(`(()=>{const e=document.querySelector('[data-screen="${clipId}"]');if(!e?.getClientRects().length || [...e.querySelectorAll('img')].some(i=>!i.complete))return null;const b=e.getBoundingClientRect();return {x:b.x+scrollX,y:b.y+scrollY,width:b.width,height:b.height,scale:1};})()`);
 const result=await command('Page.captureScreenshot',{format:'png',clip:p,captureBeyondViewport:true},sid);
 const bytes=Buffer.from(result.data,'base64');
 for(const dir of Object.values(dirs))writeFileSync(dir+file+'.png',bytes);
 console.log('capture',file,Math.round(p.width),Math.round(p.height));
}
async function viewport(width,height){await command('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false},sid);}
async function visibleAudit(){
 const v=await evalPage(`({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.querySelectorAll('img')].filter(e=>e.complete&&!e.naturalWidth).map(e=>e.src).slice(0,5)})`);
 assert.equal(v.overflow,false,JSON.stringify(v));assert.deepEqual(v.broken,[]);
}
try{
 const {targetId}=await command('Target.createTarget',{url:'about:blank'});
 ({sessionId:sid}=await command('Target.attachToTarget',{targetId,flatten:true}));
 await command('Page.enable',{},sid);
 for(const [w,h] of [[430,932],[1440,900]]){
  await viewport(w,h);
  await go(preview(hud,'main'));await checkScreen('main');await visibleAudit();
  if(w===430)await screenshot('main','hud-r19-village');
  await click('main.village-dance.badge','facility-detail');
  await click('facility-detail.primary','facility-confirm-one');
  await click('facility-confirm-one.cancel','facility-detail');
  await click('facility-detail.secondary','facility-confirm');
  await click('facility-confirm.cancel','facility-detail');
  if(w===430)await screenshot('facility-detail','build-r6-zoom');
  await click('facility-detail.back','main');
  await click('main.dock.hammer','city');
  await visibleAudit();
  await delay(220);
  const ready=await evalPage(`(()=>{const root=document.querySelector('[data-screen="city"]');const tags=[...document.querySelectorAll('[data-element]')];const tiles=tags.filter(el=>['production','hq','academy','vocal','dance','rap','fanshop','broadcast','visual'].some(k=>el.dataset.element==='city.tile-'+k));const d=root.getBoundingClientRect();return {tiles:tiles.length,visible:tiles.filter(t=>{const b=t.getBoundingClientRect();return b.bottom<=d.bottom+1&&b.right<=d.right+1&&b.width>0;}).length};})()`);
  if(w===430)await screenshot('city','build-r6-overview');
  assert.equal(ready.visible,9,JSON.stringify(ready));
  await click('city.tile-dance','facility-detail');
  await click('facility-detail.primary','facility-confirm-one');
  await click('facility-confirm-one.primary','construction-assembly');
  await click('construction-assembly.primary','construction-result');
  await click('construction-result.return','city-grown');
  await when(`document.querySelector('[data-element="city-grown.tile-dance.stage"]').textContent.includes('25')`);
  await click('city-grown.tile-broadcast','facility-repair-battle');
  if(w===430)await screenshot('facility-repair-battle','build-r6-repair');
  await click('facility-repair-battle.primary','facility-restored-battle');
  await click('facility-restored-battle.return','city-repaired-broadcast');
  await click('city-repaired-broadcast.tile-visual','facility-empty');
  await click('facility-empty.primary','facility-confirm-new');
  await click('facility-confirm-new.primary','construction-new');
  await click('construction-new.return','city-built');
  await when(`document.querySelector('[data-element="city-built.tile-visual.stage"]').textContent.includes('1 / 30')`);
  await go(preview(hud,'defense-failed'));await checkScreen('defense-failed');
  await click('defense-failed.repair','facility-repair-defense');
  await click('facility-repair-defense.primary','facility-restored');
  await click('facility-restored.return','defense-failed');
  console.log('viewport passed',w,h);
 }
}finally{clearTimeout(timeout);chrome.kill();}
