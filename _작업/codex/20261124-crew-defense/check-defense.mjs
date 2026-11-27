import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const stage=fileURLToPath(new URL('.',import.meta.url));
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless','--disable-gpu','--no-first-run','--user-data-dir='+stage+'chrome-defense','--remote-debugging-pipe'],{stdio:['ignore','ignore','ignore','pipe','pipe']});
let count=0,buffer='';const pending=new Map();
chrome.stdio[4].on('data',chunk=>{buffer+=chunk;for(;;){const end=buffer.indexOf('\0');if(end<0)break;const msg=JSON.parse(buffer.slice(0,end));buffer=buffer.slice(end+1);if(!msg.id)continue;const p=pending.get(msg.id);pending.delete(msg.id);msg.error?p.reject(Error(JSON.stringify(msg.error))):p.resolve(msg.result);}});
const command=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++count;pending.set(id,{resolve,reject});chrome.stdio[3].write(JSON.stringify({id,method,params,sessionId})+'\0');});
const timeout=setTimeout(()=>{chrome.kill();process.exit(2)},55000);
const workspace='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba';
const origin='http://127.0.0.1:7018';
const base=origin+'/ui-studio/';
const hud='import-6604270d', build='kpop-build-ui';
const preview=(project,screen)=>'preview.html?'+new URLSearchParams({workspace,project,screen});
const dirs={evidence:'/Users/max/projest_max/ui-studio/docs/planning/_검수캡쳐/20261124_단이_크루미션과디펜스분리/',assets:'/Users/max/projest_max/ui-studio/src/tools/uxStudio/guide/reference/kpop-planning/snapshot/assets/'};
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
const defense='kpop-defense-ui';
try {
 const {targetId}=await command('Target.createTarget',{url:'about:blank'});
 ({sessionId:sid}=await command('Target.attachToTarget',{targetId,flatten:true}));
 await command('Page.enable',{},sid);
 for(const [w,h] of [[430,932],[1440,900]]){
  await viewport(w,h);
  await go(preview(hud,'defense-full'));await checkScreen('defense-full');
  await click('defense-full.rail0.1','defense-warning');
  await when('location.search.includes("project=kpop-defense-ui")');
  await visibleAudit();
  if(w===430)await screenshot('defense-full','defense-r2-warning');
  await click('defense-warning.close','defense-full');
  await when('location.search.includes("project=import-6604270d")');
  await click('defense-full.rail0.1','defense-warning');
  await click('defense-warning.formation','defense-formation');
  const select = await evalPage(`(()=>{const e=document.querySelector('[data-element="defense-formation.slot-1"] select');if(!e)return null;const css=getComputedStyle(e);const old=e.value;e.value='empty';e.dispatchEvent(new Event('change',{bubbles:true}));return {control:e.tagName,value:e.value,padding:css.paddingTop,old};})()`);
  assert(select && select.control==='SELECT' && select.value==='empty' && select.padding==='0px');
  if(w===430)await screenshot('defense-full','defense-r2-formation');
  await click('defense-formation.auto','defense-formation-auto');
  await click('defense-formation-auto.confirm','defense-formation');
  await click('defense-formation.confirm','defense-warning');
  await when('!document.querySelector(\'[data-screen="defense-formation"]\')');
  await click('defense-warning.defend','defense-battle');
  await click('defense-battle.skill','defense-skills');
  await click('defense-skills.card-0','defense-battle');
  await when('!document.querySelector(\'[data-screen="defense-skills"]\')');
  await click('defense-battle.boss-view','defense-boss');
  if(w===430)await screenshot('defense-boss','defense-r2-boss');
  await click('defense-boss.cleanup','defense-cleanup');
  await click('defense-cleanup.failed','defense-failed');
  if(w===430)await screenshot('defense-failed','defense-r2-failed');
  await click('defense-failed.repair','facility-repair-defense');
  await click('facility-repair-defense.back','defense-failed');
  await click('defense-failed.back-board','main');
  await go(preview(hud,'defense-full'));await checkScreen('defense-full');
  await click('defense-full.roll','defense-ignore');
  await click('defense-ignore.back-board','main');
  if(w===1440){
   await go(preview(defense,'defense-cleanup'));await checkScreen('defense-cleanup');
   await click('defense-cleanup.success','defense-success');
   await click('defense-success.back-board','main');
  }
  await go('source/guide/reference/kpop-planning/index.html?doc=P265#defense');
  await when('document.querySelector("#paper")?.contentDocument?.querySelector("#defense")?.getClientRects().length');
  const p=await evalPage(`(()=>{const d=document.querySelector('#paper').contentDocument;return {tabs:d.querySelectorAll('.tabs a').length,folds:d.querySelectorAll('#defense details').length}})()`);
  assert.equal(p.folds,9);
  assert.equal(p.tabs,11);
  await go('source/guide/reference/kpop-defense/index.html');await when('document.querySelector("#formation")?.getClientRects().length');await visibleAudit();
  console.log('defense viewport passed',w,h);
 }
}finally{clearTimeout(timeout);chrome.kill();}
