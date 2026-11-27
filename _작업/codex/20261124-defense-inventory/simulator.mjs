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
const dirs={unused:'/Users/max/projest_max/ui-studio/docs/planning/_검수캡쳐/20261124_단이_디펜스5분과5칸/',assets:'/Users/max/projest_max/ui-studio/src/tools/uxStudio/guide/reference/kpop-planning/snapshot/assets/'};
mkdirSync(stage,{recursive:true});
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

try{
 const {targetId}=await command('Target.createTarget',{url:'about:blank'});
 ({sessionId:sid}=await command('Target.attachToTarget',{targetId,flatten:true}));await command('Page.enable',{},sid);
 await viewport(1440,900);
 await command('Page.navigate',{url:'http://127.0.0.1:7007/docs/planning/bad-energy-defense.html'},sid);
 await when('window.__BAD_ENERGY__?.state?.mode');
 console.log(await evalPage('[...document.querySelectorAll("button")].filter(b=>b.textContent.includes("디펜스 테스트")).map(b=>[b.id,b.textContent]).slice(0,5)'));
 await evalPage('document.querySelector("#world-panel").scrollIntoView({block:"center"});window.__BAD_ENERGY__.quickStart();true');
 await when('!document.querySelector("#be-choice")?.hidden');
 await evalPage('document.querySelector("#be-defend").click();true');
 await when('!document.querySelector("#be-hud")?.hidden');
 await delay(2500);
 async function grab(name){const r=await command('Page.captureScreenshot',{format:'png'},sid);writeFileSync(stage+name+'.png',Buffer.from(r.data,'base64'));}
 await grab('sim-battle');
 console.log(await evalPage('[...document.querySelectorAll("#be-hud,#be-right-rail,#be-camera-toolbar,#be-shared-special,#be-growth-countdown")].map(e=>[e.id,e.hidden,e.innerText.slice(0,180)])'));
 for(let i=0;i<145;i++){if(await evalPage('!document.querySelector("#be-cards").hidden')){await grab('sim-skills'); console.log('skill overlay captured');break;}await delay(135);}
}finally{clearTimeout(timeout);chrome.kill();}
