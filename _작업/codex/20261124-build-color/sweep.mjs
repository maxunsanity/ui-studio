import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const stage=fileURLToPath(new URL('.',import.meta.url));
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless','--disable-gpu','--no-first-run','--disable-background-timer-throttling','--disable-renderer-backgrounding','--user-data-dir='+stage+'chrome-nonhud-final','--remote-debugging-pipe'],{stdio:['ignore','ignore','ignore','pipe','pipe']});
let count=0,buffer='';const pending=new Map();
chrome.stdio[4].on('data',chunk=>{buffer+=chunk;for(;;){const end=buffer.indexOf('\0');if(end<0)break;const msg=JSON.parse(buffer.slice(0,end));buffer=buffer.slice(end+1);if(!msg.id)continue;const p=pending.get(msg.id);pending.delete(msg.id);msg.error?p.reject(Error(JSON.stringify(msg.error))):p.resolve(msg.result);}});
const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++count;pending.set(id,{resolve,reject});chrome.stdio[3].write(JSON.stringify({id,method,params,sessionId})+'\0');});
const timeout=setTimeout(()=>{chrome.kill();process.exit(2)},220000);
const workspace='workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba', origin='http://127.0.0.1:7018';
const registry=JSON.parse(readFileSync('/Users/max/projest_max/ui-studio/src/tools/uxStudio/planning-documents.json'));
const entries=registry.projects.filter(r=>r.workspaceId===workspace&&r.planningTab==='build');
const out=[];
const specs=JSON.parse(readFileSync(stage+'followup.json'));
const thumbnails=stage+'captures/';
mkdirSync(thumbnails,{recursive:true});
const evalAt=async(id,expression)=>{
 const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},id);
 if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description??r.exceptionDetails.text);
 return r.result.value;
};
const auditScript=String.raw`async (screen) => {
 const select=document.querySelector('#sample-select');select.value=screen;select.dispatchEvent(new Event('change'));
 const host=document.querySelector('#sample-board');
 const images=[...host.querySelectorAll('img')];
 await Promise.race([Promise.all(images.map(img=>img.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,280))]);
 const bad=images.filter(img=>img.complete&&!img.naturalWidth).map(img=>[img.closest('[data-element]')?.dataset.element,img.getAttribute('src')?.slice(0,230)]);
 const pending=images.filter(img=>!img.complete).map(img=>img.closest('[data-element]')?.dataset.element);
 const missing=[...host.querySelectorAll('.image-missing,.image-content small')].map(node=>[node.closest('[data-element]')?.dataset.element,node.textContent]).filter((e,i,a)=>a.findIndex(x=>x[0]===e[0])===i);
 const text=[...host.querySelectorAll('.element-text')].filter(e=>e.textContent.trim()&&e.getClientRects().length&&e.clientWidth>8&&e.clientHeight>6&&(e.scrollWidth>e.clientWidth+3||e.scrollHeight>e.clientHeight+4)).map(e=>[e.closest('[data-element]')?.dataset.element,e.textContent.slice(0,80),e.scrollWidth-e.clientWidth,e.scrollHeight-e.clientHeight]);
 const color=images.filter(img=>img.parentElement.classList.contains('preserve-color')).map(img=>getComputedStyle(img).filter);
 return {screen,images:images.length,color,overflow:document.documentElement.scrollWidth>innerWidth,bad,pending,missing,text};
}`;
const evidence='/Users/max/projest_max/ui-studio/docs/planning/_검수캡쳐/20261124_단이_HUD제외_UI보완/';
mkdirSync(evidence,{recursive:true});
async function sweep(entry){
 const {targetId}=await send('Target.createTarget',{url:'about:blank'});
 const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
 await send('Page.enable',{},sessionId);
 try{
 const saved=await (await fetch(origin+'/api/ux-studio/project?workspace='+workspace+'&id='+entry.projectId)).json();
 const d=saved.document; assert(d.screens.length);
 const row={projectId:d.projectId,name:d.name,revision:d.revision,checks:[]};
 for(const [width,height] of [[430,932],[1440,900]]){
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false},sessionId);
  await send('Page.navigate',{url:origin+'/ui-studio/source/sample-preview.html?'+new URLSearchParams({workspace,project:d.projectId,view:'detailed-wireframe'})},sessionId);
  let ready=false;
  for(let n=0;n<80;n++){if(await evalAt(sessionId,`document.querySelector('#sample-select')?.options.length===${d.screens.length} && document.querySelector('#sample-status')?.textContent.includes('r${d.revision} ')`)){ready=true;break;}await delay(75);}
  if(!ready)throw Error('선택창 로드 실패 '+d.projectId+' '+await evalAt(sessionId,`document.querySelector('#sample-status')?.textContent`));
  for(const screen of d.screens){
   const check=await evalAt(sessionId,'('+auditScript+')('+JSON.stringify(screen.id)+')');
   if(['defense-enemy-models','defense-enemy-boss-fx'].includes(screen.id)){
    assert.equal(check.color.length,screen.id==='defense-enemy-models'?12:7);
    assert(check.color.every(filter=>filter==='none'),JSON.stringify(check.color));
   }
   const expected=screen.elements.filter(e=>e.image?.preserveColor).length;
   assert.equal(check.color.length,expected,screen.id);
   assert(check.color.every(filter=>filter==='none'),screen.id);
   assert(!check.overflow && !check.bad.length && !check.missing.length && !check.text.length,screen.id);
   row.checks.push({width,height,...check});
   if(width===1440&&['city','facility-detail','facility-confirm-one','construction-parts','facility-repair-defense'].includes(screen.id)){
    const clip=await evalAt(sessionId,`(()=>{const r=document.querySelector('#sample-stage').getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1};})()`);
    if(clip.width>0&&clip.height>0){
     const shot=await send('Page.captureScreenshot',{format:'png',clip,captureBeyondViewport:true},sessionId);
     writeFileSync(thumbnails+entry.planningTab+'-'+screen.id+'.png',Buffer.from(shot.data,'base64'));
    }
   }
   if(width===1440&&['defense-enemy-models','defense-enemy-boss-fx'].includes(screen.id)){
    const shot=await send('Page.captureScreenshot',{format:'png'},sessionId);
    writeFileSync(evidence+screen.id+'.png',Buffer.from(shot.data,'base64'));
   }
  }
 }
 console.log(row.projectId,row.revision,row.checks.length);
 out.push(row);
 writeFileSync(stage+'browser.json',JSON.stringify(out,null,2));
 }finally{await send('Target.closeTarget',{targetId});}
}
try {
 const tasks=[...entries],failures=[];
 await Promise.all(Array.from({length:4},async()=>{while(tasks.length){const task=tasks.shift();try{await sweep(task);}catch(e){console.error(task.projectId,e);failures.push([task.projectId,String(e)]);}}}));
 writeFileSync(stage+'browser-failures.json',JSON.stringify(failures,null,2));
 assert(!failures.length);
}finally{clearTimeout(timeout);chrome.kill();}
