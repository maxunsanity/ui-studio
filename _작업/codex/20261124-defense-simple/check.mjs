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
const dirs={evidence:'/Users/max/projest_max/ui-studio/docs/planning/_검수캡쳐/20261124_단이_디펜스5분과5칸/',assets:'/Users/max/projest_max/ui-studio/src/tools/uxStudio/guide/reference/kpop-planning/snapshot/assets/'};
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
 const p=await when(`(()=>{const e=document.querySelector(${q});if(!e?.getClientRects().length)return null;e.scrollIntoView({block:'nearest'});const b=e.getBoundingClientRect();const x=b.left+b.width/2,y=b.top+b.height/2;const hit=document.elementFromPoint(x,y)?.closest('[data-element]')?.dataset.element;return hit===e.dataset.element||hit?.startsWith(e.dataset.element+'.')?{x,y,hit}:null;})()`);
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
const D='kpop-defense-ui';
const readClock=id=>evalPage(`document.querySelector('[data-element="${id}"] .element-text')?.textContent`);
const secs=t=>t?.split(':').reduce((n,p)=>n*60+Number(p),0);
try {
 const {targetId}=await command('Target.createTarget',{url:'about:blank'});
 ({sessionId:sid}=await command('Target.attachToTarget',{targetId,flatten:true}));await command('Page.enable',{},sid);
 for(const [w,h] of [[430,932],[1440,900]]){
  await viewport(w,h);
  await go(preview(hud,'defense-full'));await checkScreen('defense-full');
  await when(`document.querySelector('[data-element="defense-full.rail0.1.value"] .element-text')?.textContent?.match(/^[0-9]{2}:[0-9]{2}$/)?.[0]`);
  const start=secs(await readClock('defense-full.rail0.1.value'));assert(start>=298&&start<=300);
  await delay(1300);
  const before=secs(await readClock('defense-full.rail0.1.value'));assert(before<start);
  if(w===430)await screenshot('defense-full','hud-r21-countdown');
  await click('defense-full.rail0.1','defense-warning');
  await when('location.search.includes("clock=")');
  const then=secs(await readClock('defense-warning.countdown'));assert(then<=before&&then>285);
  const slots=await evalPage(`(()=>{const e=[...document.querySelectorAll('[data-element^="defense-warning.slot-"] select')];return [e.length,...e.map(s=>Math.round(s.getBoundingClientRect().top))];})()`);
  assert(slots[0]===5&&new Set(slots.slice(1)).size===1,JSON.stringify(slots));await visibleAudit();
  const changed=await evalPage(`(()=>{const s=document.querySelector('[data-element="defense-warning.slot-1"] select');const v=s.options[2];s.value=v.value;s.dispatchEvent(new Event('change',{bubbles:true}));const img=document.querySelector('[data-element="defense-warning.slot-1.initial-art"] img');return {match:img.alt===v.textContent,valid:!img.hidden};})()`);
  assert(changed.match&&changed.valid,JSON.stringify(changed));
  if(w===430)await screenshot('defense-warning','defense-r3-setup');
  await click('defense-warning.back','defense-full');
  assert(secs(await readClock('defense-full.rail0.1.value'))<=then);
  await click('defense-full.rail0.1','defense-warning');await click('defense-warning.defend','defense-battle');
  if(w===430)await screenshot('defense-battle','defense-r3-battle');
  await click('defense-battle.skill-0','defense-battle');
  assert(await when(`document.querySelector('.consumer-feedback button')?.textContent`));
  await evalPage(`document.querySelector('.consumer-feedback button').click()`);
  await click('defense-battle.failed','defense-failed');
  if(w===430)await screenshot('defense-failed','defense-r3-failed');
  await click('defense-failed.repair','facility-repair-defense');
  await click('facility-repair-defense.back','defense-failed');
  await click('defense-failed.back-board','main');
  await go(preview(D,'defense-battle'));await checkScreen('defense-battle');
  await click('defense-battle.success','defense-success');
  if(w===430)await screenshot('defense-success','defense-r3-success');
  await click('defense-success.back-board','main');
  await go(preview(D,'defense-parts'));await checkScreen('defense-parts');
  await visibleAudit();
  const n=await evalPage(`[...document.querySelectorAll('[data-element^="defense-parts."] img')].length`);
  assert.equal(n,15);
  if(w===430)await screenshot('defense-parts','defense-r3-parts');
  console.log('viewport passed',w,h);
 }
}finally{clearTimeout(timeout);chrome.kill();}
