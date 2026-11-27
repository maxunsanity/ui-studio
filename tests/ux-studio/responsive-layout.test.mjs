import test from 'node:test';
import assert from 'node:assert/strict';
import {validateDocument,resolveRect} from '../../src/tools/uxStudio/model.mjs';
const layout=await import('../../src/tools/uxStudio/responsive-layout.mjs').catch(()=>({}));
const inspector=await import('../../src/tools/uxStudio/responsive-inspector.mjs').catch(()=>({}));
const element=(id,extra={})=>({id,name:id,kind:'panel',x:10,y:10,w:50,h:20,...extra});
const fixture=()=>({schemaVersion:3,projectId:'ux-responsive',name:'Responsive',revision:0,entryScreen:'main',screens:[{id:'main',name:'Main',kind:'page',elements:[element('parent'),element('child',{parentId:'parent'})]}],transitions:[],fixtures:{balance:0,items:[]}});

test('public v4 requires explicit positive logical size and validates stretched sizes while legacy stays unchanged',()=>{
 const d=fixture(),before=structuredClone(d);assert.equal(validateDocument(d),d);assert.deepEqual(d,before);
 d.schemaVersion=4;d.screens[0].elements[0].rectTransform={min:[0,1],max:[1,1],pivot:[0,1],position:[10,-20],sizeDelta:[-20,60]};
 assert.throws(()=>validateDocument(d),/크기|버전/);
 d.screens[0].logicalSize={w:390,h:844};assert.equal(validateDocument(d),d);
 assert.deepEqual(resolveRect(d.screens[0],'parent',430,900),{x:10,y:20,w:410,h:60});
 d.screens[0].logicalSize.w=20;assert.throws(()=>validateDocument(d),/양수|크기/);
 d.screens[0].logicalSize.w=0;assert.throws(()=>validateDocument(d),/크기/);
 d.schemaVersion=3;assert.throws(()=>validateDocument(d),/준비 중/);
});

test('safe area is the same basis for model and CSS and follows actual parent resize',()=>{
 assert.equal(typeof layout.responsiveStyles,'function');
 const s={logicalSize:{w:390,h:844},safeArea:[24,10,34,20],elements:[element('safe',{x:0,y:0,w:100,h:100,useSafeArea:true})]};
 assert.deepEqual(resolveRect(s,'safe',390,844),{x:20,y:24,w:360,h:786});
 assert.deepEqual(resolveRect(s,'safe',768,1024),{x:20,y:24,w:738,h:966});
 const css=layout.responsiveStyles(s,s.elements[0]);
 assert.deepEqual(css,{left:'calc(0% + 20px)',top:'calc(0% + 24px)',width:'calc(100% - 30px)',height:'calc(100% - 58px)'});
 s.elements[0].rectTransform={min:[0,1],max:[1,1],pivot:[0,1],position:[0,-8],sizeDelta:[0,40]};
 assert.deepEqual(resolveRect(s,'safe',390,844),{x:20,y:32,w:360,h:40});
 assert.equal(layout.responsiveStyles(s,s.elements[0]).top,'calc(0% + 32px)');
});

test('authored horizontal vertical and fixed-column grid positions preserve saved child geometry',()=>{
 assert.equal(typeof layout.responsiveStyles,'function');
 const d=fixture(),s=d.screens[0],p=s.elements[0];d.schemaVersion=4;s.logicalSize={w:400,h:800};p.x=0;p.y=0;p.w=100;p.h=100;
 s.elements.push(element('next',{parentId:'parent'}),element('third',{parentId:'parent'}));
 p.layout={type:'horizontal',gap:8,padding:[10,12,14,16],itemSize:[80,30]};
 const before=structuredClone(s.elements[1]);validateDocument(d);
 assert.deepEqual(resolveRect(s,'next',400,800),{x:104,y:10,w:80,h:30});
 assert.deepEqual(layout.responsiveStyles(s,s.elements[2]),{left:'104px',top:'10px',width:'80px',height:'30px'});
 p.layout.type='vertical';assert.deepEqual(resolveRect(s,'third',400,800),{x:16,y:86,w:80,h:30});
 p.layout.type='grid';p.layout.columns=2;assert.deepEqual(resolveRect(s,'third',400,800),{x:16,y:48,w:80,h:30});
 delete p.layout;assert.deepEqual(s.elements[1],before);assert.deepEqual(resolveRect(s,'child',400,800),{x:40,y:80,w:200,h:160});
});

test('layout boundaries reject malformed rules, conflicting anchors and nested safe bases',()=>{
 for(const bad of [{type:'grid',gap:0,padding:[0,0,0,0],itemSize:[40,20],columns:0},{type:'horizontal',gap:-1,padding:[0,0,0,0],itemSize:[40,20]},{type:'vertical',gap:0,padding:[0,0,0,0],itemSize:[0,20]}]){
  const d=fixture();d.schemaVersion=4;d.screens[0].logicalSize={w:390,h:844};d.screens[0].elements[0].layout=bad;assert.throws(()=>validateDocument(d));
 }
 const d=fixture();d.schemaVersion=4;const s=d.screens[0];s.logicalSize={w:390,h:844};s.elements[1].useSafeArea=true;assert.throws(()=>validateDocument(d),/직속/);
 delete s.elements[1].useSafeArea;s.safeArea=[500,0,500,0];assert.throws(()=>validateDocument(d),/안전/);
 s.safeArea=[0,0,0,0];s.elements[0].layout={type:'vertical',gap:0,padding:[0,0,0,0],itemSize:[40,20]};s.elements[1].inset=[1,1,1,1];assert.throws(()=>validateDocument(d),/자동/);
});

test('clip and scrolling use the rendered element as the native drawing and pointer clipping box',()=>{
 assert.equal(typeof layout.responsiveStyles,'function');
 for(const [overflow,want] of [['clip',{overflowX:'clip',overflowY:'clip'}],['scroll-x',{overflowX:'auto',overflowY:'hidden'}],['scroll-y',{overflowX:'hidden',overflowY:'auto'}],['scroll-both',{overflowX:'auto',overflowY:'auto'}],['visible',{overflowX:'visible',overflowY:'visible'}]]){
  assert.deepEqual(layout.responsiveStyles({elements:[]},element('e',{overflow})),want);
 }
});

test('inspector edits explicitly upgrade a copy, preserve geometry and reject invalid edits without mutation',()=>{
 assert.equal(typeof inspector.applyResponsiveEdit,'function');
 const d=fixture(),before=structuredClone(d),size={w:400,h:800};
 const anchored=inspector.applyResponsiveEdit(d,'main','parent','anchor.preset','top-left',size);
 assert.equal(anchored.schemaVersion,4);assert.deepEqual(anchored.screens[0].logicalSize,size);assert.deepEqual(d,before);
 assert.deepEqual(resolveRect(anchored.screens[0],'parent',400,800),{x:40,y:80,w:200,h:160});
 const wider=inspector.applyResponsiveEdit(anchored,'main','parent','rectTransform.sizeDelta.0','240',size);
 assert.equal(resolveRect(wider.screens[0],'parent',400,800).w,240);
 assert.throws(()=>inspector.applyResponsiveEdit(anchored,'main','parent','rectTransform.sizeDelta.0','0',size));assert.deepEqual(d,before);
 assert.deepEqual(inspector.applyResponsiveEdit(d,'main','parent','layout.type','none',size),d);
 assert.deepEqual(inspector.applyResponsiveEdit(d,'main','parent','useSafeArea',false,size),d);
 assert.deepEqual(inspector.applyResponsiveEdit(d,'main','parent','overflow','default',size),d);
 assert.match(inspector.responsiveInspectorHTML(anchored.screens[0],anchored.screens[0].elements[0]),/data-responsive-field/);
});

test('real renderer applies automatic child bounds and native overflow to the same element nodes',async t=>{
 const {renderLayout}=await import('../../src/tools/uxStudio/layout-view.mjs');
 class Node {
  constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this.style={};this.className='';this.attributes={};this.classList={contains:name=>this.className.split(' ').includes(name),add:name=>{this.className+=' '+name;},toggle:(name,on)=>{this.className=this.className.split(' ').filter(x=>x!==name).concat(on?[name]:[]).join(' ');}};}
  append(...nodes){for(const node of nodes){node.parent=this;this.children.push(node);}}
  querySelector(selector){const name=selector.split('.').pop();return this.children.find(node=>node.classList.contains(name))||null;}
  querySelectorAll(selector){const node=this.querySelector(selector);return node?[node]:[];}
  remove(){this.parent.children=this.parent.children.filter(node=>node!==this);}
  setAttribute(name,value){this.attributes[name]=value;}
  removeAttribute(name){delete this.attributes[name];}
 }
 const previous=globalThis.document;t.after(()=>{if(previous===undefined)delete globalThis.document;else globalThis.document=previous;});
 globalThis.document={createElement:tag=>new Node(tag)};
 const d=fixture(),s=d.screens[0];s.elements[0].overflow='scroll-y';s.elements[0].layout={type:'vertical',gap:6,padding:[8,8,8,8],itemSize:[100,44]};
 const root=new Node();renderLayout(s,root);
 const parent=root.children[0],child=parent.children.find(node=>node.dataset.element==='child');
 assert.equal(parent.style.overflowX,'hidden');assert.equal(parent.style.overflowY,'auto');
 assert.equal(child.style.left,'8px');assert.equal(child.style.top,'8px');assert.equal(child.style.width,'100px');assert.equal(child.style.height,'44px');
});

test('public import and atomic save reopen v4 metadata without touching legacy originals',async t=>{
 const {mkdir,mkdtemp,readFile,rm}=await import('node:fs/promises'),{resolve,join}=await import('node:path');
 const {saveDocument}=await import('../../src/tools/uxStudio/save-plugin.mjs'),{readDesignFile}=await import('../../src/tools/uxStudio/model.mjs');
 const root=resolve('.'),scratch=join(root,'_작업/codex/responsive-tests');await mkdir(scratch,{recursive:true});const directory=await mkdtemp(join(scratch,'save-'));t.after(()=>rm(directory,{recursive:true,force:true}));
 const original=fixture(),before=JSON.stringify(original),d=inspector.applyResponsiveEdit(original,'main','parent','anchor.preset','stretch',{w:390,h:844});
 const text=JSON.stringify(d),imported=await readDesignFile({size:Buffer.byteLength(text),text:async()=>text});
 const saved=await saveDocument(root,directory,imported,null),reopened=JSON.parse(await readFile(join(directory,d.projectId+'.json'),'utf8'));
 assert.equal(reopened.schemaVersion,4);assert.deepEqual(reopened.screens[0].logicalSize,{w:390,h:844});assert.deepEqual(reopened.screens[0].elements[0].rectTransform,d.screens[0].elements[0].rectTransform);assert.equal(reopened.revision,saved.revision);assert.equal(JSON.stringify(original),before);
});

test('legacy one-time group arrangement records remain valid and never become responsive layout',()=>{
 const d=fixture();d.screens[0].elements[0].layout={direction:'row',gap:8};const before=structuredClone(d);validateDocument(d);assert.deepEqual(d,before);
 assert.deepEqual(resolveRect(d.screens[0],'child',400,800),{x:60,y:96,w:100,h:32});
 assert.deepEqual(layout.responsiveStyles(d.screens[0],d.screens[0].elements[1]),{});
});

test('automatic content extent includes trailing right and bottom padding for real scrolling',()=>{
 assert.equal(typeof layout.responsiveContentSize,'function');
 const s={elements:[element('p',{layout:{type:'horizontal',gap:8,padding:[10,12,14,16],itemSize:[80,30]}}),element('a',{parentId:'p'}),element('b',{parentId:'p'}),element('c',{parentId:'p'})]};
 assert.deepEqual(layout.responsiveContentSize(s,s.elements[0]),{w:284,h:54});
 s.elements[0].layout.type='vertical';assert.deepEqual(layout.responsiveContentSize(s,s.elements[0]),{w:108,h:130});
 s.elements[0].layout.type='grid';s.elements[0].layout.columns=2;assert.deepEqual(layout.responsiveContentSize(s,s.elements[0]),{w:196,h:92});
});
