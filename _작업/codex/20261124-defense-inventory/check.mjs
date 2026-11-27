import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const stage=fileURLToPath(new URL('.',import.meta.url));
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless','--disable-gpu','--no-first-run','--user-data-dir='+stage+'chrome-r9','--remote-debugging-pipe'],{stdio:['ignore','ignore','ignore','pipe','pipe']});
let count=0,buffer='';const pending=new Map();
chrome.stdio[4].on('data',chunk=>{buffer+=chunk;for(;;){const end=buffer.indexOf('\0');if(end<0)break;const msg=JSON.parse(buffer.slice(0,end));buffer=buffer.slice(end+1);if(!msg.id)continue;const p=pending.get(msg.id);pending.delete(msg.id);msg.error?p.reject(Error(JSON.stringify(msg.error))):p.resolve(msg.result);}});
const command=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++count;pending.set(id,{resolve,reject});chrome.stdio[3].write(JSON.stringify({id,method,params,sessionId})+'\0');});
const timeout=setTimeout(()=>{chrome.kill();process.exit(2)},60000);
const workspace='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba';
const origin='http://127.0.0.1:7018';
const base=origin+'/ui-studio/';
const hud='import-6604270d', build='kpop-build-ui';
const preview=(project,screen)=>'preview.html?'+new URLSearchParams({workspace,project,screen});
const dirs={evidence:'/Users/max/projest_max/ui-studio/docs/planning/_검수캡쳐/20261124_단이_디펜스보관함과스킬오버레이/',assets:'/Users/max/projest_max/ui-studio/src/tools/uxStudio/guide/reference/kpop-planning/snapshot/assets/'};
mkdirSync(dirs.evidence,{recursive:true});
let sid;
async function evalPage(expression){
 const res=await command('Runtime.evaluate',{expression,returnByValue:true},sid);
 if(res.exceptionDetails)throw Error(res.exceptionDetails.text);
 return res.result.value;
}
async function when(expr){
 for(let i=0;i<130;i++){
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
try {
 const {targetId}=await command('Target.createTarget',{url:'about:blank'});
 ({sessionId:sid}=await command('Target.attachToTarget',{targetId,flatten:true}));await command('Page.enable',{},sid);
 for(const [w,h] of [[430,932],[1440,900]]){
  await viewport(w,h);
  await go(preview(hud,'defense-full'));await checkScreen('defense-full');
  await click('defense-full.rail0.1','defense-warning');
  await when('location.search.includes("clock=")');
  const nodes='[data-element^="defense-warning.pick-"] input[type="checkbox"]';
  const count=()=>evalPage(`document.querySelectorAll('${nodes}:checked').length`);
  const checked=()=>evalPage(`[...document.querySelectorAll('${nodes}:checked')].map(e=>e.getAttribute('aria-label'))`);
  await when(`document.querySelectorAll('${nodes}').length===12`);
  assert.equal(await count(),4);
  assert.equal(await evalPage(`document.querySelectorAll('[data-element^="defense-warning.card-"][data-element$=".mood-track"]').length`),12);
  assert.equal(await evalPage(`[...document.querySelectorAll('[data-element^="defense-warning.pick-"] .ui-control label span')].some(e=>e.textContent.trim())`),false);
  const options=await evalPage(`[...document.querySelectorAll('${nodes}:not(:checked):not(:disabled)')].slice(0,2).map(e=>e.closest('[data-element]').dataset.element)`);
  const select=id=>evalPage(`document.querySelector('[data-element="${id}"] input').click();true`);
  await select(options[0]);
  assert.equal(await count(),5);
  const five=await checked();
  await select(options[1]);
  assert.equal(await count(),5);
  assert.deepEqual(await checked(),five);
  assert.match(await evalPage(`document.querySelector('[data-element="defense-warning.capacity"]').textContent`),/5 \/ 5/);
  const geometry=await evalPage(`[...document.querySelectorAll('[data-element^="defense-warning.slot-"][data-element$=".frame"]')].map(e=>Math.round(e.getBoundingClientRect().top))`);
  assert.equal(geometry.length,5);assert.equal(new Set(geometry).size,1);
  await visibleAudit();
  if(w===430)await screenshot('defense-warning','defense-r9-inventory');
  await evalPage(`[...document.querySelectorAll('${nodes}:checked')].forEach(e=>e.click());true`);
  assert.equal(await count(),0);assert.equal(await evalPage(`document.querySelector('[data-element="defense-warning.defend"]').inert`),true);
  await select(options[1]);assert.equal(await count(),1);
  await evalPage(`[...document.querySelectorAll('${nodes}:not(:checked):not(:disabled)')].slice(0,4).forEach(e=>e.click());true`);assert.equal(await count(),5);
  await click('defense-warning.defend','defense-battle');
  const border=await evalPage(`JSON.stringify(document.querySelector('[data-element="defense-battle.world"]').getBoundingClientRect().toJSON())`);
  const name=await evalPage(`document.querySelector('[data-element="defense-battle.fighter-0.name"]').textContent`);
  assert(name&&!name.includes('빈칸'));
  if(w===430)await screenshot('defense-battle','defense-r9-battle');
  assert.equal(await evalPage(`document.querySelectorAll('[data-element="defense-battle.skills"],[data-element="defense-battle.finisher"],[data-element="defense-battle.success"],[data-element="defense-battle.failed"]').length`),0);
  await when(`document.querySelector('[data-overlay-key="defense-skills"]')`);
  assert.equal(await evalPage(`document.querySelector('.preview-screen').inert`),true);
  assert.equal(await evalPage(`JSON.stringify(document.querySelector('[data-element="defense-battle.world"]').getBoundingClientRect().toJSON())`),border);
  assert.equal(await evalPage(`document.querySelectorAll('[data-element^="defense-skills.card-"][data-element$=".name"]').length`),3);
  if(w===430)await screenshot('defense-battle','defense-r9-overlay');
  await click('defense-skills.card-1');
  await when(`!document.querySelector('[data-overlay-key="defense-skills"]')`);
  assert.equal(await evalPage(`document.querySelector('.preview-screen').inert`),false);
  await click('defense-battle.common-skill');
  await when(`document.querySelector('.consumer-feedback')?.textContent.includes('연습실 보호막 발동')`);
  await evalPage(`document.querySelector('.consumer-feedback button').click()`);
  await go(preview(D,'defense-battle')+'&overlay=defense-failed');
  await when(`document.querySelector('[data-overlay-key="defense-failed"]')`);
  assert.equal(await evalPage(`document.querySelector('.preview-screen').inert`),true);
  assert.equal(await evalPage(`!!document.querySelector('[data-element="defense-battle.world"]')`),true);
  await when(`[...document.querySelectorAll('[data-element^="defense-failed.mon-"] img')].filter(e=>e.getClientRects().length).length===4`);
  assert.equal(await evalPage(`document.querySelector('[data-element="defense-failed.earned-quantity"]')?.textContent`),'+240');
  await visibleAudit();
  if(w===430)await screenshot('defense-battle','defense-r9-failed');
  await click('defense-failed.repair','facility-repair-defense');
  await click('facility-repair-defense.back','defense-battle');
  await when(`document.querySelector('[data-overlay-key="defense-failed"]')`);
  await go(preview(D,'defense-battle')+'&overlay=defense-success');await checkScreen('defense-battle');
  await when(`document.querySelector('[data-overlay-key="defense-success"]')`);
  assert.equal(await evalPage(`document.querySelector('[data-element="defense-success.earned-icon"] img')?.alt`),'돈');
  if(w===430)await screenshot('defense-battle','defense-r9-success');
  await click('defense-success.back-board','main');
  await go(preview(D,'defense-warning'));await checkScreen('defense-warning');
  await click('defense-warning.ignore');await when(`document.querySelector('[data-overlay-key="defense-ignore"]')`);
  assert.match(await evalPage(`document.querySelector('[data-element="defense-ignore.earned-empty"]')?.textContent`),/받은 보상이 없어요/);
  console.log('viewport passed',w,h);
 }
}finally{clearTimeout(timeout);chrome.kill();}
