import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {validateDocument,screenById,resolveRect} from '../../src/tools/uxStudio/model.mjs';
import {validateParts,inputMode,inputOwner,componentRoot,PART_ROLES,INPUT_MODES,insideHit,readImageFile} from '../../src/tools/uxStudio/parts.mjs';
import {pushSnapshot} from '../../src/tools/uxStudio/history.mjs';
import {assetSource,assetUrl} from '../../src/tools/uxStudio/asset-reference.mjs';
import {applyDesignGuideChange} from '../../src/tools/uxStudio/design-guide-edit.mjs';
import {applyGrapesEdits} from '../../src/tools/uxStudio/grapes-bridge.mjs';
import {buildHandoff} from '../../src/tools/uxStudio/handoff.mjs';
import {saveDocument} from '../../src/tools/uxStudio/save-plugin.mjs';
const main=readFileSync('src/tools/uxStudio/main.mjs','utf8'),layout=readFileSync('src/tools/uxStudio/layout-view.mjs','utf8');
const image=()=>({src:'data:image/png;base64,iVBORw0KGgo=',alt:'Scene',fit:'cover',sourceSize:[700,467]});
function fixture(version=3){return {schemaVersion:version,projectId:'image-top-arch',revision:0,name:'Arch',entryScreen:'main',screens:[{id:'main',kind:'page',name:'Main',...(version===4?{logicalSize:{w:551,h:984}}:{}),elements:[
 {id:'panel',kind:'panel',name:'Panel',isGroup:true,x:0,y:0,w:100,h:100},
 {id:'scene',kind:'image',name:'Scene',parentId:'panel',x:2,y:3,w:90,h:30,image:image(),interaction:{mode:'none',enabled:true,shape:'rectangle',reason:''}},
 {id:'child',kind:'text',name:'Child',parentId:'scene',x:2,y:3,w:20,h:10,text:'Keep child'}
 ]}],transitions:[],fixtures:{balance:0,items:[]}};}
class Node {
 constructor(tag='div',namespaceURI='http://www.w3.org/1999/xhtml'){
  this.tagName=tag.toUpperCase();this.namespaceURI=namespaceURI;this.children=[];this.dataset={};this.attrs={};this.className='';this.innerHTML='';
  this.style={getPropertyValue(key){return this[key.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]||'';},*[Symbol.iterator](){for(const key of Object.keys(this))if(typeof this[key]!=='function')yield key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase());}};
  this.classList={add:name=>{this.className+=' '+name;}};
 }
 get attributes(){return Object.entries(this.attrs).map(([name,value])=>({name,value}));}
 append(...nodes){for(const node of nodes){node.parentNode=this;this.children.push(node);}}
 remove(){this.parentNode.children=this.parentNode.children.filter(n=>n!==this);}
 setAttribute(key,value){this.attrs[key]=String(value);}
 addEventListener(){}
 querySelector(selector){return selector===':scope > .image-content'?this.children.find(n=>n.className.split(' ').includes('image-content'))||null:null;}
}
function renderer(){
 const c={NS:'http://www.w3.org/2000/svg',SKIN_ASSETS:{},assetSource,document:{createElement:tag=>new Node(tag),createElementNS:(ns,tag)=>new Node(tag,ns),createTextNode:text=>Object.assign(new Node('#text'),{textContent:text})}};
 vm.createContext(c);vm.runInContext(layout.slice(layout.indexOf('function renderImagePart(')),c);return c.renderImagePart;
}
function editor(){
 const notices=[],c={doc:fixture(),selectedScreen:'main',selectedElement:'scene',expectedRevision:0,undo:[],redo:[],dirty:false,clone:structuredClone,screenById,pushSnapshot,validateDocument,inputMode,inputOwner,componentRoot,PART_ROLES,INPUT_MODES,workspaceAssets:[],editingComponent:null,esc:String,render(){},notify:message=>notices.push(message),skinInspector:()=>'',skinEditTarget:(_s,e)=>e,shadowInspector:()=>'',notificationInspector:()=>'',buttonStateInspector:()=>'',imageRegionInspector:()=>''};
 c.selection=()=>c.doc.screens[0].elements.find(e=>e.id==='scene');vm.createContext(c);
 let start=main.indexOf("    if (input.matches('[data-part-field]')) {");vm.runInContext('function change(input){'+main.slice(start,main.indexOf("    if (input.matches('[data-transform-unit]'))",start))+'}',c);
 start=main.indexOf('function partsPanel(');vm.runInContext(main.slice(start,main.indexOf("app.addEventListener('keydown'",start)),c);
 start=main.indexOf("        case 'undo':");vm.runInContext('function history(action){switch(action){'+main.slice(start,main.indexOf("        case 'grid':",start))+'}}',c);
 c.set=value=>c.change({dataset:{partField:'image.topArchHeight'},value,type:'number',matches:s=>s==='[data-part-field]'});return {c,notices};
}
test('arch height validates a finite bounded number while absent and zero leave every legacy schema unchanged',()=>{
 for(const version of [1,2,3,4]){const doc=fixture(version),before=structuredClone(doc);validateDocument(doc);assert.deepEqual(doc,before);for(const value of [0,64,96,10000]){doc.screens[0].elements[1].image.topArchHeight=value;validateDocument(doc);}}
 for(const value of [-1,10001,Infinity,NaN,'64',null,{},[]])assert.throws(()=>validateParts({kind:'image',image:{...image(),topArchHeight:value}}),/아치|이미지/);
});
test('normal art image clips only its own visual wrapper and keeps source fit, parent, child and rectangular hit bounds',()=>{
 const doc=fixture(),part=doc.screens[0].elements[1];part.image.topArchHeight=96;const before=structuredClone(doc),rect=resolveRect(doc.screens[0],'scene',551,984),node=new Node();node.style.left='2%';node.append(new Node('span'));const child=node.children[0];
 renderer()(node,part,'art',false,null);const box=node.querySelector(':scope > .image-content');assert.equal(box.style.borderRadius,'50% 50% 0 0 / min(100%, 96px) min(100%, 96px) 0 0');assert.equal(box.children[0].style.objectFit,'cover');assert.equal(box.children[0].src,image().src);assert.equal(node.style.borderRadius,undefined);assert.equal(node.style.left,'2%');assert.equal(node.children[0],child);assert.equal(insideHit(part,.01,.01),true);assert.deepEqual(resolveRect(doc.screens[0],'scene',551,984),rect);assert.deepEqual(doc,before);
});
test('source-region SVG uses the same visual arch without changing crop coordinates or aspect fitting',()=>{
 const part={kind:'image',name:'Cropped',image:{...image(),region:[10,20,400,300],topArchHeight:64}},before=structuredClone(part),node=new Node();renderer()(node,part,'art',false,null);const box=node.querySelector(':scope > .image-content'),svg=box.children[0];assert.equal(box.style.borderRadius,'50% 50% 0 0 / min(100%, 64px) min(100%, 64px) 0 0');assert.equal(svg.attrs.viewBox,'10 20 400 300');assert.equal(svg.attrs.preserveAspectRatio,'xMidYMid slice');assert.equal(svg.children[0].attrs.href,image().src);assert.deepEqual(part,before);
});
test('wire, unregistered art and disabling arch never retain a previous visual clip',()=>{
 const render=renderer(),part={kind:'image',name:'Scene',image:{...image(),topArchHeight:96}},node=new Node();render(node,part,'art',false,null);assert.ok(node.children[0].style.borderRadius);
 render(node,part,'wire',false,null);assert.equal(node.children[0].style.borderRadius,undefined);
 for(const value of [0,undefined]){part.image.topArchHeight=value;render(node,part,'art',false,null);assert.equal(node.children[0].style.borderRadius,undefined);}
 part.image={src:'',alt:'Missing',fit:'contain',topArchHeight:64};render(node,part,'art',false,null);assert.equal(node.children[0].style.borderRadius,undefined);
});
test('native inspector writes numeric arch height once, retains Undo, and atomically rejects invalid edits',()=>{
 const {c,notices}=editor(),before=structuredClone(c.doc);const html=c.partsPanel(c.doc.screens[0],c.selection());assert.match(html,/type="number"[^>]*data-part-field="image.topArchHeight"|data-part-field="image.topArchHeight"[^>]*type="number"/);assert.deepEqual(c.doc,before);
 c.set('64');assert.equal(c.selection().image.topArchHeight,64);assert.equal(c.undo.length,1);assert.equal(c.dirty,true);const clipped=structuredClone(c.doc);c.history('undo');assert.deepEqual(c.doc,before);c.history('redo');assert.deepEqual(c.doc,clipped);
 for(const value of ['', '-1','10001','NaN','Infinity','bad']){const count=c.undo.length,stable=structuredClone(c.doc);c.set(value);assert.deepEqual(c.doc,stable);assert.equal(c.undo.length,count);}assert.equal(notices.length,6);
 c.set('0');assert.equal(c.selection().image.topArchHeight,0);validateDocument(c.doc);
});
test('native upload, saved-resource and project-path replacements retain local arch while replacing image source safely',async()=>{
 for(const selector of ['[data-image-file]','[data-workspace-image]','[data-project-image]']){
  const {c,notices}=editor();c.selection().image.topArchHeight=96;const before=structuredClone(c.doc),ref='sha256-'+'b'.repeat(64)+'.png',file={type:'image/png',size:8,arrayBuffer:async()=>Uint8Array.from([137,80,78,71,13,10,26,10]).buffer};
  Object.assign(c,{workspaceId:null,readImageFile,assetUrl,TextEncoder,AbortSignal,Image:class {naturalWidth=1;naturalHeight=1;async decode(){}},uploadImageAsset:async()=>({assetRef:ref,width:1,height:1}),fetch:async()=>({ok:true,blob:async()=>file})});
  const start=main.indexOf("    if ((input.matches('[data-image-file]')"),end=main.indexOf("    if (input.matches('[data-part-field]'))",start);vm.runInContext('async function replaceImage(input){'+main.slice(start,end)+'}',c);
  await c.replaceImage({files:selector==='[data-image-file]'?[file]:[],value:selector==='[data-project-image]'?'/ui-studio/source/assets/new.png':ref,matches:s=>s===selector});assert.deepEqual(notices,[]);assert.equal(c.selection().image.topArchHeight,96);assert.equal(c.selection().image.assetRef,ref);assert.deepEqual(structuredClone(c.selection().image.sourceSize),[1,1]);assert.equal(c.selection().image.fit,'cover');assert.equal(c.undo.length,1);assert.deepEqual(c.undo[0],before);assert.deepEqual(c.doc.screens[0].elements[2],before.screens[0].elements[2]);validateDocument(c.doc);
 }
});
test('guide image replacement preserves arch, permits explicit zero override, and explicit removal clears the image',()=>{
 const source=fixture();source.screens[0].elements[1].image.topArchHeight=96;const before=structuredClone(source),replacement={...image(),alt:'Replacement'};
 const next=applyDesignGuideChange(source,'main','scene',{type:'image',image:replacement});assert.equal(next.screens[0].elements[1].image.topArchHeight,96);assert.equal(next.screens[0].elements[1].image.alt,'Replacement');assert.deepEqual(source,before);
 assert.equal(applyDesignGuideChange(next,'main','scene',{type:'image',image:{...replacement,topArchHeight:0}}).screens[0].elements[1].image.topArchHeight,0);assert.equal(applyDesignGuideChange(next,'main','scene',{type:'image',image:null}).screens[0].elements[1].image,undefined);
});
test('Grapes decoration/data, exported handoff and disk JSON roundtrip retain the authored visual arch',async t=>{
 const source=fixture();source.screens[0].elements[1].image.topArchHeight=64;const before=structuredClone(source),node=new Node();renderer()(node,source.screens[0].elements[1],'art',false,null);const box=node.children[0];assert.ok(box.style.borderRadius);
 const pilot=readFileSync('src/tools/uxStudio/grapes-pilot.mjs','utf8'),start=pilot.indexOf(' function component(node,sid){'),end=pilot.indexOf(" editor.DomComponents.addType('ux-board'",start),ctx={originals:new Map(),partKey:(sid,id)=>JSON.stringify([sid,id])};vm.createContext(ctx);vm.runInContext(pilot.slice(start,end),ctx);assert.equal(ctx.component(box,'main').style['border-radius'],'50% 50% 0 0 / min(100%, 64px) min(100%, 64px) 0 0');
 const edits=source.screens[0].elements.map(e=>({id:e.id,parentId:e.parentId||null,name:e.name,text:e.text||'',...(e.image?{image:structuredClone(e.image)}:{})})),fromCanvas=applyGrapesEdits(source,'main',edits);assert.deepEqual(fromCanvas,source);assert.equal(buildHandoff(fromCanvas).screens[0].elements[1].image.topArchHeight,64);
 const dir=await mkdtemp(join(process.cwd(),'_작업/codex/ux-studio/image-arch-save-'));t.after(()=>rm(dir,{recursive:true,force:true}));const saved=await saveDocument(process.cwd(),dir,fromCanvas,null),reopened=validateDocument(JSON.parse(await readFile(join(dir,source.projectId+'.json'),'utf8')));assert.deepEqual(reopened,saved);assert.equal(reopened.screens[0].elements[1].image.topArchHeight,64);assert.deepEqual(source,before);
});
