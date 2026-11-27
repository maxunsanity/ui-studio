import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {applyGrapesEdits} from '../../src/tools/uxStudio/grapes-bridge.mjs';
import {applyDesignGuideChange} from '../../src/tools/uxStudio/design-guide-edit.mjs';

const pilot=readFileSync(new URL('../../src/tools/uxStudio/grapes-pilot.mjs',import.meta.url),'utf8');
const vendor=readFileSync(new URL('../../src/tools/uxStudio/vendor/grapesjs-0.23.9/grapes.min.js',import.meta.url),'utf8');
function excerpt(start,end){const from=pilot.indexOf(start),to=pilot.indexOf(end,from);assert.ok(from>=0&&to>from,'Live pilot test boundary exists');return pilot.slice(from,to);}
function fixture(){
 const module={exports:{}};
 vm.runInNewContext(vendor,{module,exports:module.exports,console,setTimeout,clearTimeout,setInterval,clearInterval});
 const editor=module.exports.init({headless:true,storageManager:false,telemetry:false,undoManager:{trackSelection:false}});
 const source={schemaVersion:4,projectId:'ux-vendor-undo',name:'Undo',revision:1,entryScreen:'main',screens:[{id:'main',name:'Main',kind:'page',logicalSize:{w:400,h:800},elements:[{id:'image',name:'Image',kind:'image',x:10,y:10,w:50,h:20}]}],transitions:[],fixtures:{balance:0,items:[]}};
 let model,node;
 const design=()=>applyGrapesEdits(source,'main',[{id:'image',parentId:null,name:model.get('name'),text:model.get('uxText'),rect:Object.fromEntries(['x','y','w','h'].map(key=>[key,model.get('ux'+key.toUpperCase())])),guideGeometry:model.get('uxGuideGeometry')||undefined}]);
 // Only the browser DOM renderer is replaced; models, collections, refresh function and UndoManager are real.
 const scope={editor,originalFor:()=>source.screens[0].elements[0],canEditRect:()=>true,escape:String,design,workspaceId:null,document:{createElement:()=>({get firstElementChild(){return node;}})},renderLayout:screen=>{
  const element=screen.elements[0],style={left:element.x+'%',top:element.y+'%',width:element.w+'%',height:element.h+'%'};
  node={style:{*[Symbol.iterator](){yield*Object.keys(style);},getPropertyValue:key=>style[key]},classList:['ui-element','image-part','image-filled'],children:[{dataset:{},tagName:'DIV'}]};
 },attachControls(){},component:()=>({tagName:'div',attributes:{class:'image-content'}})};
 vm.runInNewContext(excerpt(' function refreshPartAppearance('," document.querySelector('#studio-save').onclick="),scope);
 vm.runInNewContext(excerpt(" editor.DomComponents.addType('ux-part'",' const traitsFor='),scope);
 model=editor.addComponents({type:'ux-part',uxId:'image',uxScreen:'main',uxX:10,uxY:10,uxW:50,uxH:20,name:'Image',uxText:'',style:{width:'50%'},components:[{tagName:'div',attributes:{class:'image-content'}}]})[0];
 editor.UndoManager.clear();
 return {editor,source,model,design};
}

test('vendored Grapes guide geometry reverts its model fields and bridge document with one undo',()=>{
 const {editor,model,design}=fixture();
 try{
  const before=design();
  const next=applyDesignGuideChange(design(),'main','image',{type:'rect',rect:{x:40,y:80,w:40,h:160}}),element=next.screens[0].elements[0];
  model.set({uxGuideGeometry:Object.fromEntries(['x','y','w','h'].map(key=>[key,element[key]])),...Object.fromEntries(['x','y','w','h'].map(key=>['ux'+key.toUpperCase(),element[key]]))});
  assert.equal(model.get('uxW'),10);assert.equal(editor.UndoManager.getStack().length,1);
  assert.equal(design().screens[0].elements[0].w,10);
  editor.UndoManager.undo();
  assert.equal(model.get('uxW'),50);assert.equal(model.get('uxGuideGeometry'),false);assert.equal(model.getStyle().width,'50%');assert.deepEqual(design(),before);
  editor.UndoManager.redo();assert.equal(model.get('uxW'),10);assert.equal(design().screens[0].elements[0].w,10);
 }finally{editor.destroy();}
});

test('vendored default custom component tracks position size display text and name without a selective array',()=>{
 const {editor,model}=fixture();
 try{
  assert.equal(model.get('_undo'),true);
  model.set({uxX:12,uxY:14,uxW:30,uxH:40,uxText:'Updated',name:'New name'});
  editor.UndoManager.undo();
  assert.deepEqual(['uxX','uxY','uxW','uxH','uxText','name'].map(key=>model.get(key)),[10,10,50,20,'','Image']);
 }finally{editor.destroy();}
});
