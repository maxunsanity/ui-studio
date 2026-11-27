import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const root=process.env.UI_STUDIO_ROOT||process.cwd();
const source=readFileSync(process.env.MAIN_SOURCE||root+'/src/tools/uxStudio/main.mjs','utf8');
const deps={};for(const name of ['controls','asset-reference','responsive-layout','skins','parts','menu-state','visual-effects','notification','button-state','scroll-pin','overlay-runtime','canvas-device-preview','model','project-manager','presentation','project-context'])Object.assign(deps,await import(pathToFileURL(root+'/src/tools/uxStudio/'+name+'.mjs')));
const layout=readFileSync(root+'/src/tools/uxStudio/layout-view.mjs','utf8'),fixture=readFileSync(root+'/tests/ux-studio/control-visual.test.mjs','utf8');
function setup({mode='edit',kind='modal',fullscreen=false,profile='design',demo=false}={}){
 const e=(id)=>({id,name:id,kind:'text',x:0,y:0,w:50,h:20,text:id});
 const doc={schemaVersion:4,projectId:'standalone-editor',name:'Editor',revision:1,entryScreen:'main',transitions:[],fixtures:{balance:0,items:[]},screens:[{id:'main',name:'Base',kind:'page',logicalSize:{w:551,h:984},elements:[e('base-only')]},{id:'selected',name:'Selected',kind,logicalSize:{w:700,h:500},presentation:{rootMode:fullscreen?'fullscreen':'window',dim:true},elements:[e('own-only')]},{id:'other',name:'Other',kind:'page',logicalSize:{w:440,h:900},elements:[e('other-only')]}]};
 const c={...deps,EventTarget,Event,console,crypto,doc,mode,presentationMode:'ui',profile,profiles:deps.DEVICE_PROFILES,selectedScreen:'selected',selectedElement:'own-only',selectedIds:['own-only'],previewBase:'main',zoom:'1',zoomAnchor:null,viewMemory:null,handTool:false,spaceDown:false,snap:false,editingComponent:null,assetView:'art',workspaceId:'monopoly-go',demoOverlay:demo?{screen:doc.screens[2],presentation:{type:'modal',dim:true}}:null,runtime:{page:'main',overlays:mode==='play'?['selected']:[],scroll:{}},activeRuntimeModal:null,matchMedia:()=>({matches:false}),attachEditor:options=>{c.editorOptions=options;return ()=>{};}};vm.createContext(c);
 vm.runInContext(fixture.slice(fixture.indexOf('class Node extends'),fixture.indexOf('function fixture(t)'))+'\nthis.Node=Node;',c);
 const document={};document.createElement=tag=>{const n=new c.Node(tag,document);const style={setProperty(k,v){style[k]=v;},removeProperty(k){delete style[k];}};Object.defineProperty(style,'cssText',{get:()=>style._text||'',set:text=>{style._text=text;for(const piece of text.split(';')){const i=piece.indexOf(':');if(i>0)style[piece.slice(0,i)]=piece.slice(i+1);}}});n.style=style;n.classList.remove=k=>n.classList.toggle(k,false);const matches=n.matches.bind(n);n.matches=selector=>selector==='[data-overlay-id]'?!!n.dataset.overlayId:matches(selector);const append=n.append.bind(n);n.append=(...nodes)=>{for(const node of nodes)node.remove();append(...nodes);};return n;};document.createElementNS=(_ns,tag)=>document.createElement(tag);c.document=document;
 const host=document.createElement('main');host.clientWidth=1200;host.clientHeight=1000;c.$=id=>id==='#preview-host'?host:{};
 vm.runInContext(layout.replace(/^import .*;\n/gm,'').replace(/^export /gm,''),c);
 c.renderElements=(screen,node)=>c.renderLayout(screen,node,{mode:c.mode,assetView:'art',runtime:c.runtime});
 const helper=source.indexOf('function detailDevicePreview(');vm.runInContext(source.slice(helper,source.indexOf('function quickTransform(',helper)),c);
 const render=source.indexOf('function renderPreview(');vm.runInContext(source.slice(render,source.indexOf('function flow(',render)),c);
 const draw=source.indexOf('function drawOverlay(');vm.runInContext(source.slice(draw,source.indexOf('function openDemo(',draw)),c);
 return {c,doc,host,before:structuredClone(doc),canvas:()=>host.querySelector('.preview-canvas')};
}
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} ~= ${b}`);
for(const kind of ['page','modal','sheet','toast'])test('edit '+kind+' renders only its selected screen without a backdrop or runtime overlay',()=>{
 const f=setup({kind}),{c}=f;c.renderPreview();const canvas=f.canvas();assert.deepEqual(Array.from(canvas.querySelectorAll('.ui-element'),n=>n.dataset.element),['own-only']);assert.equal(canvas.querySelector('.modal-backdrop'),null);assert.equal(canvas.querySelector('[data-overlay-id]'),null);assert.deepEqual(f.doc,f.before);assert.equal(c.selectedScreen,'selected');assert.deepEqual(c.selectedIds,['own-only']);
});
for(const fullscreen of [false,true])test('selected modal uses its own design/phone basis and consistent self-root geometry '+fullscreen,()=>{
 for(const profile of ['design','phone']){
  const f=setup({fullscreen,profile}),{c}=f,current=f.doc.screens[1],device={logical:{w:700,h:profile==='design'?500:844*700/390}},expected=fullscreen?device.logical:{w:630,h:device.logical.h*.48};c.renderPreview();const canvas=f.canvas();near(parseFloat(canvas.style.width),device.logical.w);near(parseFloat(canvas.style.height),device.logical.h);near(c.rootSize(current).w,expected.w);near(c.rootSize(current).h,expected.h);near(c.editorOptions.width,expected.w);near(c.editorOptions.height,expected.h);const panel=canvas.querySelector('.preview-overlay');assert.ok(panel);assert.equal(panel.dataset.overlayRoot,fullscreen?'fullscreen':'window');if(fullscreen){assert.equal(panel.style.width,'100%');assert.equal(panel.style.height,'100%');}else{near(parseFloat(panel.style.width),expected.w);near(parseFloat(panel.style.height),expected.h);near(parseFloat(panel.style.left),35);near(parseFloat(panel.style.top),(device.logical.h-expected.h)/2);}assert.deepEqual(f.doc,f.before);
 }
});
test('stale edit demo state cannot compose another screen or fake dim layer',()=>{const f=setup({demo:true});f.c.renderPreview();const canvas=f.canvas();assert.deepEqual(Array.from(canvas.querySelectorAll('.ui-element'),n=>n.dataset.element),['own-only']);assert.equal(canvas.querySelector('.modal-backdrop'),null);assert.ok(f.c.editorOptions);});
test('play keeps runtime backing page, actual dim backdrop and overlay identities',()=>{
 const f=setup({mode:'play'});f.c.renderPreview();const canvas=f.canvas();assert.deepEqual(Array.from(canvas.querySelectorAll('.ui-element'),n=>n.dataset.element),['base-only','own-only']);assert.ok(canvas.querySelector('.modal-backdrop'));assert.equal(canvas.querySelector('.preview-screen').inert,true);assert.equal(canvas.querySelector('[data-overlay-id]').dataset.overlayId,'selected');assert.equal(f.c.editorOptions,undefined);assert.deepEqual(f.doc,f.before);assert.equal(f.c.detailDevicePreview(f.doc.screens[1]).logical.w,551);
});
test('header sample URL carries selected screen/workspace while the runtime preview remains explicitly labelled',()=>{
 const f=setup(),c=f.c;Object.assign(c,{projectContext:()=>({label:'Project',name:'Test',directory:'Dir',design:'Design'}),folderProject:null,dirty:false,expectedRevision:1,saveBusy:false,projects:[],baselineLabels:{W:'W'},baselineStage:'W',baselineItems:[],baselineBusy:false,studioSettings:{catalogEnabled:false},undo:[],redo:[],grid:false,workspacePrefs:{frame:{w:1200,h:900}},innerWidth:1200,innerHeight:900,status:'',esc:String});
 const start=source.indexOf('function header()');vm.runInContext(source.slice(start,source.indexOf('function layerBrowserKey(',start)),c);const html=c.header();const sample=html.match(/href="([^"]+)"[^>]*>저장 샘플 보기 ↗<\/a>/);assert.ok(sample,'saved sample link exists');const url=new URL(sample[1],'http://localhost');assert.equal(url.pathname,'/ui-studio/source/sample-preview.html');assert.equal(url.searchParams.get('project'),'standalone-editor');assert.equal(url.searchParams.get('screen'),'selected');assert.equal(url.searchParams.get('workspace'),'monopoly-go');assert.match(html,/href="[^"]*preview\.html[^\"]*"[^>]*>동작 시험 보기 ↗<\/a>/);
});

test('page preview reuses its own unchanged canvas and nodes but never reuses another selected screen',()=>{
 const f=setup({kind:'page'});f.c.renderPreview();const first=f.canvas(),own=first.querySelector('.ui-element');f.host.replaceChildren();f.c.renderPreview(first);assert.equal(f.canvas(),first);assert.equal(f.canvas().querySelector('.ui-element'),own);assert.equal(f.canvas().querySelectorAll('.preview-screen').length,1);
 f.host.replaceChildren();f.c.selectedScreen='other';f.c.renderPreview(first);assert.notEqual(f.canvas(),first);assert.deepEqual(Array.from(f.canvas().querySelectorAll('.ui-element'),n=>n.dataset.element),['other-only']);assert.deepEqual(f.doc,f.before);
});
