import {overlayBaseHiddenElements} from '../../src/tools/uxStudio/overlay-runtime.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {DEVICE_PROFILES,canvasDevicePreview} from '../../src/tools/uxStudio/canvas-device-preview.mjs';
import {resolveResponsiveRect} from '../../src/tools/uxStudio/responsive-layout.mjs';
import {attachEditor} from '../../src/tools/uxStudio/editor.mjs';
import {applyDesignGuideChange} from '../../src/tools/uxStudio/design-guide-edit.mjs';
import {commitDocumentEdit} from '../../src/tools/uxStudio/history.mjs';
import {overlayRootSize} from '../../src/tools/uxStudio/overlay-runtime.mjs';
const source=await readFile('src/tools/uxStudio/main.mjs','utf8');
const fixture=()=>({schemaVersion:4,projectId:'detail-device',name:'Detail device',revision:1,entryScreen:'main',transitions:[],fixtures:{balance:0,items:[]},screens:[{id:'main',kind:'page',name:'Main',logicalSize:{w:551,h:984},elements:[
 {id:'top',name:'Top',kind:'panel',x:0,y:0,w:100,h:10,rectTransform:{min:[0,1],max:[0,1],pivot:[0,1],position:[9,-12],sizeDelta:[536,94]}},
 {id:'bottom',name:'Bottom',kind:'panel',x:0,y:0,w:100,h:10,rectTransform:{min:[0,0],max:[0,0],pivot:[0,0],position:[0,0],sizeDelta:[551,280]}},
 {id:'icon',name:'Icon',parentId:'bottom',kind:'image',x:0,y:0,w:64/551*100,h:64/280*100}
 ]},{id:'modal',name:'Modal',kind:'modal',logicalSize:{w:551,h:984},elements:[]}]});
const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-7,`${actual} ~= ${expected}`);
function scope(){
 const context={presentationMode:'ui',folderProject:null,doc:fixture(),profile:'design',profiles:DEVICE_PROFILES,canvasDevicePreview,overlayRootSize,mode:'edit',previewBase:'main',runtime:{page:'main',overlays:[],scroll:{}},screenById:(d,id)=>d.screens.find(s=>s.id===id)};
 vm.createContext(context);const helper=source.indexOf('function detailDevicePreview('),start=helper<0?source.indexOf('function rootSize('):helper;
 vm.runInContext(source.slice(start,source.indexOf('function quickTransform(',start)),context);return context;
}
test('detail device profiles reflow the logical viewport and retain the authored width and fixed square groups',()=>{
 const c=scope(),screen=c.doc.screens[0],before=structuredClone(c.doc);
 assert.equal(c.rootSize(screen).w,551);assert.equal(c.rootSize(screen).h,984);
 c.profile='phone';const size=c.rootSize(screen),preview=canvasDevicePreview(screen,{profile:'phone'});
 assert.equal(size.w,551);near(size.h,844*551/390);
 const top=resolveResponsiveRect(screen,'top',size.w,size.h),bottom=resolveResponsiveRect(screen,'bottom',size.w,size.h),icon=resolveResponsiveRect(screen,'icon',size.w,size.h);
 near(top.w*preview.scale,536*390/551);near((bottom.y+bottom.h)*preview.scale,844);near(bottom.w*preview.scale,390);near(icon.w,icon.h);
 near(c.rootSize(c.doc.screens[1]).h,size.h*.48);assert.deepEqual(c.doc,before);
});
test('fullscreen modal uses the entire actual backing page viewport in design and phone modes',()=>{
 const c=scope(),modal=c.doc.screens[1];modal.presentation={rootMode:'fullscreen'};
 assert.equal(c.rootSize(modal).w,551);assert.equal(c.rootSize(modal).h,984);
 c.profile='phone';assert.equal(c.rootSize(modal).w,551);near(c.rootSize(modal).h,844*551/390);
});

class Node{
 constructor(){this.dataset={};this.children=[];this.className='';const style={};Object.defineProperty(style,'cssText',{get:()=>style._text||'',set:text=>{style._text=text;for(const entry of text.split(';')){const split=entry.indexOf(':');if(split>0)style[entry.slice(0,split)]=entry.slice(split+1);}}});this.style=style;this.classList={add:name=>{this.className+=' '+name;},toggle(){}};}
 append(node){node.parentElement=this;this.children.push(node);}
 querySelector(selector){return this.children.find(n=>n.className.split(' ').includes(selector.split('.').at(-1)))||null;}
 querySelectorAll(){return [];}
}
test('detail renderer separates editor zoom and device scale, passing the combined scale to pointer editing',()=>{
 for(const zoom of ['1','2','fit']){
  const c=scope(),before=structuredClone(c.doc),host=new Node(),readout={};host.clientWidth=1000;host.clientHeight=1000;
  Object.assign(c,{profile:'phone',zoom,selectedScreen:'main',selectedElement:'icon',selectedIds:['icon'],demoOverlay:null,viewMemory:null,zoomAnchor:null,handTool:false,spaceDown:false,snap:false,editingComponent:null,document:{createElement:()=>new Node()},$:id=>id==='#preview-host'?host:readout,overlayBaseHiddenElements,renderElements(){},editTarget:(_s,id)=>id,attachEditor:options=>{c.editorOptions=options;return ()=>{};}});
  const start=source.indexOf('function renderPreview(');vm.runInContext(source.slice(start,source.indexOf('function flow(',start)),c);c.renderPreview();
  const canvas=c.editorOptions.canvas,magnification=zoom==='2'?2:1,total=390/551*magnification;
  assert.equal(canvas.style.width,'551px');near(parseFloat(canvas.style.height),844*551/390);near(Number(canvas.dataset.scale),total);near(Number(canvas.dataset.zoom),magnification);
  near(parseFloat(canvas.parentElement.style.width),390*magnification);near(parseFloat(canvas.parentElement.style.height),844*magnification);
  assert.equal(c.editorOptions.width,551);near(c.editorOptions.height,844*551/390);assert.deepEqual(c.doc,before);assert.equal(c.selectedElement,'icon');
 }
});

test('pointer edits at device scale and editor zoom use logical parent dimensions and commit once',t=>{
 const previous=globalThis.window;t.after(()=>{if(previous===undefined)delete globalThis.window;else globalThis.window=previous;});let moveable;
 class Control{handlers={};on(name,fn){this.handlers[name]=fn;return this;}destroy(){}}
 globalThis.window={Moveable:class extends Control{constructor(){super();moveable=this;}},Selecto:Control};
 const c=scope();c.profile='phone';const screen=c.doc.screens[0],size=c.rootSize(screen),total=390/551*2,node={dataset:{screen:'main',element:'icon'},style:{}},snapshots=[];
 const dispose=attachEditor({canvas:{dataset:{scale:String(total)},querySelectorAll:()=>[node]},host:{},screen,ids:['icon'],width:size.w,height:size.h,snap:false,onSelect(){},onCommit:(before,changed)=>snapshots.push({before,changed})});
 moveable.handlers.dragStart({clientX:0,clientY:0});moveable.handlers.drag({clientX:39*2,clientY:0});assert.equal(snapshots.length,0);near(screen.elements[2].x,10);
 moveable.handlers.dragEnd();assert.equal(snapshots.length,1);assert.equal(snapshots[0].changed,true);assert.equal(snapshots[0].before[2].x,0);assert.deepEqual(screen.logicalSize,{w:551,h:984});dispose();
});

test('wheel zoom preserves logical pointer coordinates and changes editor zoom without multiplying device scale twice',()=>{
 const deviceScale=390/551,canvas={dataset:{zoom:'1',scale:String(deviceScale)},getBoundingClientRect:()=>({left:200,top:150})},host={getBoundingClientRect:()=>({left:100,top:100})};let wheel,prevented=0,renders=0;
 const c={app:{addEventListener:(_name,fn)=>wheel=fn},$:()=>canvas,zoom:'1',zoomAnchor:null,render:()=>renders++};vm.createContext(c);
 const start=source.indexOf("app.addEventListener('wheel', event => {\n    const host =");vm.runInContext(source.slice(start,source.indexOf('function picked(',start)),c);
 const event={target:{closest:()=>host},ctrlKey:true,clientX:400,clientY:350,deltaY:-Math.log(1.2)/.002,preventDefault:()=>prevented++};wheel(event);
 near(Number(c.zoom),1.2);near(c.zoomAnchor.x,200/deviceScale);near(c.zoomAnchor.y,200/deviceScale);assert.equal(renders,1);assert.equal(prevented,1);
 wheel({...event,ctrlKey:false});assert.equal(renders,1);assert.equal(prevented,1);
});

test('zoom toolbar and keyboard use editor zoom while selected-unit fit accounts for device scale',()=>{
 const canvas={dataset:{zoom:'1',scale:String(390/551)}},c=scope();Object.assign(c,{$:()=>canvas,zoom:'1',render(){canvas.dataset.zoom=c.zoom;}});
 const start=source.indexOf("        case 'zoom-out':"),end=source.indexOf("        case 'canvas-fit':",start);vm.runInContext('function zoomAction(id){switch(id){'+source.slice(start,end)+'}}',c);
 c.zoomAction('zoom-in');near(Number(c.zoom),1.2);c.zoomAction('zoom-out');near(Number(c.zoom),1);
 const keyStart=source.indexOf("    if (!command && ['+', '=', '-'].includes(event.key))");vm.runInContext('function keyZoom(event){const command=false;'+source.slice(keyStart,source.indexOf("    if (!command && event.shiftKey",keyStart))+'}',c);
 c.keyZoom({key:'+',preventDefault(){}});near(Number(c.zoom),1.2);
 c.profile='phone';c.selectedScreen='main';c.selectedElement='icon';c.picked=()=>['bottom'];c.resolveRect=resolveResponsiveRect;const host={clientWidth:400,clientHeight:500};c.$=()=>host;
 const fitStart=source.indexOf('function fitPicked(');vm.runInContext(source.slice(fitStart,source.indexOf('function detailDevicePreview(',fitStart)),c);c.fitPicked();near(Number(c.zoom),340/390);
});

test('design guide uses the same logical device viewport and saves one edit with source size and selection intact',()=>{
 const c=scope();let opened;Object.assign(c,{profile:'phone',selectedScreen:'main',selectedElement:'icon',selectedIds:['icon'],workspaceId:null,undo:[],redo:[],dirty:false,status:'',wheelRun:null,clone:structuredClone,commitDocumentEdit,applyDesignGuideChange,openDesignGuide:options=>opened=options,render(){},notify:message=>assert.fail(message)});
 const editedStart=source.indexOf('function edited(fn)');vm.runInContext(source.slice(editedStart,source.indexOf('let baselineItems',editedStart)),c);
 const guideStart=source.indexOf("        case 'design-guide':");vm.runInContext('function guideAction(){switch("design-guide"){'+source.slice(guideStart,source.indexOf("        case 'manual':",guideStart))+'}}',c);c.guideAction();
 assert.equal(opened.size.w,551);near(opened.size.h,844*551/390);
 const before=structuredClone(c.doc);opened.onChange({type:'rect',screenId:'main',elementId:'icon',rect:{x:55.1,y:0,w:64,h:64}});
 near(c.doc.screens[0].elements[2].x,10);assert.equal(c.undo.length,1);assert.deepEqual(c.undo[0],before);assert.equal(c.dirty,true);assert.equal(c.selectedElement,'icon');assert.deepEqual(c.doc.screens[0].logicalSize,{w:551,h:984});
});
