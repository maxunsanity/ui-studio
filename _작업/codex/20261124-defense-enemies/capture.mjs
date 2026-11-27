import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const stage=fileURLToPath(new URL('.',import.meta.url));
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-first-run','--user-data-dir='+stage+'chrome-model-final','--remote-debugging-pipe'],{stdio:['ignore','ignore','ignore','pipe','pipe']});
let count=0,buffer='';const pending=new Map();
chrome.stdio[4].on('data',chunk=>{buffer+=chunk;for(;;){const end=buffer.indexOf('\0');if(end<0)break;const msg=JSON.parse(buffer.slice(0,end));buffer=buffer.slice(end+1);if(!msg.id)continue;const p=pending.get(msg.id);pending.delete(msg.id);msg.error?p.reject(Error(JSON.stringify(msg.error))):p.resolve(msg.result);}});
const command=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++count;pending.set(id,{resolve,reject});chrome.stdio[3].write(JSON.stringify({id,method,params,sessionId})+'\0');});
const timeout=setTimeout(()=>{chrome.kill();process.exit(2)},90000);
const workspace='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba';
const origin='http://127.0.0.1:7018';
const base=origin+'/ui-studio/';
const hud='import-6604270d', build='kpop-build-ui';
const preview=(project,screen)=>'preview.html?'+new URLSearchParams({workspace,project,screen});
const dirs={evidence:'/Users/max/projest_max/ui-studio/docs/planning/_검수캡쳐/20261124_단이_디펜스게이지두상태/',assets:'/Users/max/projest_max/ui-studio/src/tools/uxStudio/guide/reference/kpop-planning/snapshot/assets/'};
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
 throw Error(expr+' timeout '+JSON.stringify(await evalPage('({url:location.href,text:document.body?.innerText.slice(0,450),screens:[...document.querySelectorAll("[data-screen]")].map(e=>e.dataset.screen)})')));
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



const project='/Users/max/projest_max/kpopmonsters/';
const manifest=JSON.parse(readFileSync(project+'data/res/defense_motion_v01/manifest.json'));
mkdirSync(stage+'images',{recursive:true});
try{
 const {targetId}=await command('Target.createTarget',{url:'about:blank'});
 ({sessionId:sid}=await command('Target.attachToTarget',{targetId,flatten:true}));await command('Page.enable',{},sid);
 await viewport(1000,780);
 await command('Page.navigate',{url:'http://127.0.0.1:7007/docs/planning/defense-resource-lab.html'},sid);
 await when('window.__DEFENSE_RESOURCE_LAB__?.metrics.ready');
 for(const category of ['enemies','boss']){
  await evalPage(`window.__DEFENSE_RESOURCE_LAB__.select('${category}');true`);
  await when(`window.__DEFENSE_RESOURCE_LAB__.metrics.mode==='${category}' && window.__DEFENSE_RESOURCE_LAB__.metrics.ready`);
  for(const row of manifest.characters.filter(r=>r.category===category)){
   const id=JSON.stringify(row.asset_id);
   await evalPage(`(()=>{const select=document.querySelector('#asset-select');select.value=${id};if(!select.value)throw Error('Unknown asset');select.dispatchEvent(new Event('change')); return true;})()`);
   await when(`window.__DEFENSE_RESOURCE_LAB__.state.asset===${id} && window.__DEFENSE_RESOURCE_LAB__.metrics.ready`);
   await evalPage(`(()=>{const stage=document.querySelector('#stage');let s=document.querySelector('#studio-asset-shot');if(!s){s=document.createElement('style');s.id='studio-asset-shot';s.textContent='#stage{width:360px!important;height:260px!important;min-height:260px!important}#stage > :not(canvas){visibility:hidden!important}';document.head.append(s);} stage.scrollIntoView({block:'nearest'});return true;})()`);
   const idle=category==='boss'?'idle_hover':'idle';
   await evalPage(`(()=>{const sel=document.querySelector('#clip-select');if(sel&&[...sel.options].some(o=>o.value==='${idle}')){sel.value='${idle}';sel.dispatchEvent(new Event('change'));}return true;})()`);
   if(category==='boss'){
    const point=await evalPage(`(()=>{const b=document.querySelector('#stage canvas').getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2};})()`);
    for(let i=0;i<4;i++)await command('Input.dispatchMouseEvent',{type:'mouseWheel',...point,deltaX:0,deltaY:130},sid);
   }
   await delay(550);
   const clip=await evalPage(`(()=>{const e=document.querySelector('#stage canvas');const b=e.getBoundingClientRect();return {x:b.x+scrollX,y:b.y+scrollY,width:b.width,height:b.height,scale:1};})()`);
   if(category==='enemies'){
    clip.x+=55;clip.y+=25;clip.width-=110;clip.height-=50;
   }
   const picture=await command('Page.captureScreenshot',{format:'png',clip,captureBeyondViewport:true},sid);
   writeFileSync(stage+'images/'+row.asset_id+'.png',Buffer.from(picture.data,'base64'));
   console.log(row.asset_id,clip.width,clip.height);
  }
 }
}finally{clearTimeout(timeout);chrome.kill();}
