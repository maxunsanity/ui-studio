import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const stage=fileURLToPath(new URL('.',import.meta.url));
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless','--disable-gpu','--no-first-run','--user-data-dir='+stage+'chrome-retake-final','--remote-debugging-pipe'],{stdio:['ignore','ignore','ignore','pipe','pipe']});
let count=0,buffer='';const pending=new Map();
chrome.stdio[4].on('data',chunk=>{buffer+=chunk;for(;;){const end=buffer.indexOf('\0');if(end<0)break;const msg=JSON.parse(buffer.slice(0,end));buffer=buffer.slice(end+1);if(!msg.id)continue;const p=pending.get(msg.id);pending.delete(msg.id);msg.error?p.reject(Error(JSON.stringify(msg.error))):p.resolve(msg.result);}});
const command=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++count;pending.set(id,{resolve,reject});chrome.stdio[3].write(JSON.stringify({id,method,params,sessionId})+'\0');});
const timeout=setTimeout(()=>{chrome.kill();process.exit(2)},150000);
const workspace='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba';
const origin='http://127.0.0.1:7018';
const base=origin+'/ui-studio/';
const docs='source/guide/reference/kpop-planning/';
const hud='import-6604270d', build='kpop-build-ui';
const preview=(project,screen)=>'preview.html?'+new URLSearchParams({workspace,project,screen});
const dirs={evidence:'/Users/max/projest_max/ui-studio/docs/planning/_검수캡쳐/20261124_단이_HUD제외_UI보완/',assets:'/Users/max/projest_max/ui-studio/src/tools/uxStudio/guide/reference/kpop-planning/snapshot/assets/'};
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
 throw Error(expr+' timeout '+JSON.stringify(await evalPage('({url:location.href,text:document.body.innerText.slice(0,450),screens:[...new Set([...document.querySelectorAll("[data-screen]")].map(e=>e.dataset.screen))]})')));
}
const checkScreen=id=>when(`[...document.querySelectorAll('[data-screen="${id}"]')].some(e=>e.getClientRects().length)`);
const go=relative=>command('Page.navigate',{url:base+relative},sid);
async function click(id,next){
 const selector='[data-element="'+id+'"]';
 const q=JSON.stringify(selector);
 await delay(170);
 const p=await when(`(()=>{const e=document.querySelector(${q});if(!e?.getClientRects().length)return null;e.scrollIntoView({block:'nearest'});const b=e.getBoundingClientRect();const x=b.left+b.width/2,y=b.top+b.height/2;const hitNode=document.elementFromPoint(x,y)?.closest('[data-element]');return hitNode&&e.contains(hitNode)?{x,y,hit:e.dataset.element}:null;})()`);
 assert(p.hit===id||p.hit?.startsWith(id+'.'),id+' click hit '+JSON.stringify(p));
 for(const type of ['mouseMoved','mousePressed','mouseReleased'])await command('Input.dispatchMouseEvent',{type,x:p.x,y:p.y,button:'left',clickCount:1},sid);
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



const modal=id=>when(`document.querySelector('[data-overlay-key="${id}"]')`);
const gone=id=>when(`!document.querySelector('[data-overlay-key="${id}"]')`);
async function start(id,screen){await go(preview(id,screen));await checkScreen(screen);}
async function escape(){for(const type of ['keyDown','keyUp'])await command('Input.dispatchKeyEvent',{type,key:'Escape',code:'Escape',windowsVirtualKeyCode:27},sid);}
const value=(id,tag)=>evalPage(`document.querySelector('[data-element="${id}"] ${tag}')?.value`);
try{
 const {targetId}=await command('Target.createTarget',{url:'about:blank'});
 ({sessionId:sid}=await command('Target.attachToTarget',{targetId,flatten:true}));await command('Page.enable',{},sid);
 for(const [w,h] of [[430,932],[1440,900]]){
  await viewport(w,h);
  await go(docs+'followup-nonhud/index.html'); await when('document.querySelectorAll("main > section").length===10');
  assert.equal(await evalPage('document.documentElement.scrollWidth>innerWidth'),false);
  for(const k of ['build','mission','relation','profile']) {
   await go(docs+'index.html?doc=P265#'+k);
   const href=await when(`(()=>{const d=document.querySelector('#paper')?.contentDocument;const e=d?.querySelector('#${k} .followup-current a');return e?.getClientRects().length?e.getAttribute('href'):null;})()`);
   assert(href.includes('#followup-nonhud'));
  }
  console.log('DOCS PASS',w);

  try {
  await start('kpop-build-ui','city');await click('city.tile-dance','facility-detail');await click('facility-detail.primary','facility-confirm-one');await click('facility-confirm-one.back','facility-detail');
    console.log('PASS',w,'kpop-build-ui');
  } catch(e) { console.log('FAIL',w,'kpop-build-ui',e.message);process.exitCode=1; }
  try {
  await start('kpop-schedule-ui','home');await click('home.part-4');await modal('collection');await click('collection.codex-open-3');await modal('collection-ready');await click('collection-ready.match');await modal('collection-puzzle');await click('collection-puzzle.tray-3');await modal('puzzle-selected-3');await click('puzzle-selected-3.grid-cell-3');await modal('puzzle-step-1');await click('puzzle-step-1.part-11');await gone('puzzle-step-1');await modal('collection');await checkScreen('home');
    console.log('PASS',w,'kpop-schedule-ui');
  } catch(e) { console.log('FAIL',w,'kpop-schedule-ui',e.message);process.exitCode=1; }
  try {
  await start('kpop-relationship-ui','relationship-main');await click('relationship-main.map-tab');await modal('relationship-map');
  await click('relationship-map.portrait-card-10-A');await modal('relationship-map-member');
  const masked=await evalPage(`[...document.querySelectorAll('[data-overlay-key="relationship-map"] [data-overlay-hidden="true"]')].length`);
  const hidden=await evalPage(`[...document.querySelectorAll('[data-overlay-key="relationship-map"] .ui-element')].filter(n=>getComputedStyle(n).visibility==='hidden').length`);
  assert(Math.max(masked,hidden)>0,JSON.stringify({masked,hidden}));
    console.log('PASS',w,'kpop-relationship-ui');
  } catch(e) { console.log('FAIL',w,'kpop-relationship-ui',e.message);process.exitCode=1; }
  try {
  await start('kpop-mission-ui','daily-fifth');await click('daily-fifth.part-102');await modal('chart-reward');await escape();await modal('chart-reward');await click('chart-reward.part-44','daily-claimed');
    await start('kpop-mission-ui','daily'); await click('daily.locked-pack-hint'); await modal('reward-hint-card');
    await click('reward-hint-card.pack-detail'); await modal('pack-detail-0-0');
    await click('pack-detail-0-0.close'); await modal('reward-hint-card');
    console.log('PASS',w,'kpop-mission-ui');
  } catch(e) { console.log('FAIL',w,'kpop-mission-ui',e.message);process.exitCode=1; }
  try {
  await start('kpop-mons-ui','mons-storage');await click('mons-storage.attribute');await modal('mons-attribute');
  for(const index of [3,4])await evalPage(`document.querySelector('[data-element="mons-attribute.check-${index}"] input').click();true`);
  await click('mons-attribute.apply');await gone('mons-attribute');
  await when(`document.querySelector('[data-element="mons-storage.attribute.label"] .element-text')?.textContent.includes('화·금')`);
  const visible=await evalPage(`[...document.querySelectorAll('[data-element="mons-storage.inventory-scroll"] > .ui-element[data-element^="mons-storage.card-"]')].filter(e=>getComputedStyle(e).display!=='none').length`);
  assert.equal(visible,2);
    console.log('PASS',w,'kpop-mons-ui');
  } catch(e) { console.log('FAIL',w,'kpop-mons-ui',e.message);process.exitCode=1; }
  try {
  await start('kpop-crew-ui','member');await click('member.menu-mission','crew-mission');await click('crew-mission.stage-2');await modal('crew-mission-reward');await click('crew-mission-reward.confirm','crew-mission-stage-claimed');await click('crew-mission-stage-claimed.back','member');
    console.log('PASS',w,'kpop-crew-ui');
  } catch(e) { console.log('FAIL',w,'kpop-crew-ui',e.message);process.exitCode=1; }
  try {
  await start('kpop-profile-ui','closet-shoes');await click('closet-shoes.preset-0');await modal('outfit-presets');await click('outfit-presets.save-1');await modal('outfit-preset-save');await click('outfit-preset-save.confirm-1');await gone('outfit-preset-save');
  assert.equal(await value('outfit-presets.status-1','input'),'저장됨');
    console.log('PASS',w,'kpop-profile-ui');
  } catch(e) { console.log('FAIL',w,'kpop-profile-ui',e.message);process.exitCode=1; }
  try {
  await start('kpop-shop-ui','featured');await click('featured.part-23');await modal('purchase-confirm');await click('purchase-confirm.part-45');await modal('need-ruby');await gone('purchase-confirm');await click('need-ruby.part-28');await gone('need-ruby');await checkScreen('featured');
    await start('kpop-shop-ui','cosmetics-preview'); await click('cosmetics-preview.preview-acquired'); await modal('cosmetics-acquired'); await click('cosmetics-acquired.wear'); await modal('cosmetics-target');
    await click('cosmetics-target.choose-1','closet-hanseoa-fit');
    await click('closet-hanseoa-fit.acquired-back'); await modal('cosmetics-target'); await click('cosmetics-target.close'); await modal('cosmetics-acquired');
    console.log('PASS',w,'kpop-shop-ui');
  } catch(e) { console.log('FAIL',w,'kpop-shop-ui',e.message);process.exitCode=1; }
  try {
  await start('import-6b577b09','list');await click('list.packs','packs');await click('packs.pack.1.1');await modal('pack-detail');await click('pack-detail.open','pack-opening');await click('pack-opening.continue');await modal('pack-result');await escape();await modal('pack-result');await click('pack-result.done','list');
    console.log('PASS',w,'import-6b577b09');
  } catch(e) { console.log('FAIL',w,'import-6b577b09',e.message);process.exitCode=1; }
  try {
  await start('kpop-defense-ui','defense-battle');
  const text=()=>evalPage(`document.querySelector('[data-element="defense-battle.next-skill"] .element-text')?.textContent`);
  const first=await text();await delay(1150);assert.notEqual(await text(),first);await modal('defense-skills');
    console.log('PASS',w,'kpop-defense-ui');
  } catch(e) { console.log('FAIL',w,'kpop-defense-ui',e.message);process.exitCode=1; }
 }
}finally{clearTimeout(timeout);chrome.kill();}
