import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {parentSize,transformValue,alignElement} from '../../src/tools/uxStudio/layers.mjs';
import {nudgeSelection} from '../../src/tools/uxStudio/commands.mjs';
import {resolveRect} from '../../src/tools/uxStudio/model.mjs';
import {attachEditor} from '../../src/tools/uxStudio/editor.mjs';
import {applyGrapesEdits,nudgeGrapesRect} from '../../src/tools/uxStudio/grapes-bridge.mjs';
import {responsiveInspectorHTML,applyResponsiveEdit} from '../../src/tools/uxStudio/responsive-inspector.mjs';
import * as responsive from '../../src/tools/uxStudio/responsive-layout.mjs';
const part=(id,extra={})=>({id,name:id,kind:'panel',x:0,y:0,w:50,h:20,...extra});
function fixture(){return {schemaVersion:4,projectId:'ux-responsive-edit',name:'Edit',revision:0,entryScreen:'main',screens:[{id:'main',name:'Main',kind:'page',logicalSize:{w:390,h:844},safeArea:[24,10,34,20],elements:[part('safe',{useSafeArea:true}),part('layout',{x:50,layout:{type:'vertical',gap:4,padding:[8,8,8,8],itemSize:[40,20]}}),part('auto',{parentId:'layout'})]}],transitions:[],fixtures:{balance:0,items:[]}};}

test('legacy transforms and keyboard nudge use the safe parent basis, while auto children cannot be manually moved',()=>{
 const d=fixture(),s=d.screens[0],safe=s.elements[0],auto=s.elements[2];
 assert.deepEqual(parentSize(s,safe,390,844),{x:20,y:24,w:360,h:786});
 transformValue(s,safe,'x',12,'px',390,844);assert.equal(resolveRect(s,'safe',390,844).x,32);
 nudgeSelection(d,'main',['safe'],1,0,390,844);assert.ok(Math.abs(resolveRect(s,'safe',390,844).x-35.6)<1e-8);
 alignElement(s,safe,'right',390,844);assert.equal(resolveRect(s,'safe',390,844).x,200);
 const before=structuredClone(auto);nudgeSelection(d,'main',['auto'],1,1,390,844);assert.deepEqual(auto,before);
 assert.throws(()=>transformValue(s,auto,'x',10,'px',390,844),/자동/);assert.throws(()=>alignElement(s,auto,'left',390,844),/자동/);assert.deepEqual(auto,before);
});

test('editor keeps auto children selectable but excludes them from Moveable manipulation targets',t=>{
 const previous=globalThis.window;t.after(()=>{if(previous===undefined)delete globalThis.window;else globalThis.window=previous;});
 let moveableOptions,selectoOptions,selecto,selected;class Control{handlers={};on(name,fn){this.handlers[name]=fn;return this;}destroy(){}updateRect(){}}
 globalThis.window={Moveable:class extends Control{constructor(_host,options){super();moveableOptions=options;}},Selecto:class extends Control{constructor(options){super();selectoOptions=options;selecto=this;}}};
 const s=fixture().screens[0],node={dataset:{screen:'main',element:'auto'},style:{}},canvas={dataset:{scale:'1'},querySelectorAll:()=>[node]};
 const dispose=attachEditor({canvas,host:{},screen:s,ids:['auto'],width:390,height:844,snap:false,onSelect:ids=>selected=ids,onCommit(){throw Error('must not commit');}});
 assert.deepEqual(moveableOptions.target,[]);assert.deepEqual(selectoOptions.selectableTargets,[node]);selecto.handlers.selectEnd({selected:[node]});assert.deepEqual(selected,['auto']);dispose();
});

test('canvas bridge preserves names but refuses geometry changes for safe-area and auto-layout children',()=>{
 const d=fixture(),s=d.screens[0],edits=()=>s.elements.map(e=>({id:e.id,parentId:e.parentId||null,name:e.name,text:e.text||''}));
 for(const id of ['safe','auto']){
  const list=edits(),edit=list.find(e=>e.id===id),e=s.elements.find(e=>e.id===id);edit.rect={x:e.x+1,y:e.y,w:e.w,h:e.h};assert.throws(()=>applyGrapesEdits(d,'main',list),/상세|배치/);
  assert.throws(()=>nudgeGrapesRect(e,{x:e.x,y:e.y,w:e.w,h:e.h},'x',1,s),/상세|배치|자동/);
 }
 const list=edits();list.find(e=>e.id==='auto').name='Renamed';const updated=applyGrapesEdits(d,'main',list);assert.equal(updated.screens[0].elements[2].name,'Renamed');assert.equal(d.screens[0].elements[2].name,'auto');
});

test('actual layout and quick panels show responsive fields and hide manual geometry for constrained selection',async()=>{
 const source=await readFile('src/tools/uxStudio/main.mjs','utf8'),d=fixture(),s=d.screens[0];
 const context={...responsive,responsiveInspectorHTML,parentSize,rootSize:()=>({w:390,h:844}),partsPanel:()=>'',menuControls:()=>'',typographyPanel:()=>'',descendants:()=>new Set(),isContainer:()=>true,transformUnit:'px',isolated:[],insertParentId:null,esc:String,
  field:(_label,name)=>`<input data-field="${name}">`,select:()=>'',transformDisplayValue:()=>0};
 vm.createContext(context);const layout=source.slice(source.indexOf('function layoutPanel('),source.indexOf('function panelBody('));const quick=source.slice(source.indexOf('function quickTransform('),source.indexOf('function layerRows('));vm.runInContext(layout+'\n'+quick,context);
 assert.match(context.layoutPanel(s,null),/data-responsive-field="screen.safeArea.0"/);
 for(const e of [s.elements[0],s.elements[2],part('anchor',{rectTransform:{min:[0,1],max:[0,1],pivot:[0,1],position:[0,0],sizeDelta:[20,20]}})]){
  assert.doesNotMatch(context.layoutPanel(s,e),/data-field="[xywh]"/);assert.doesNotMatch(context.quickTransform(s,e),/data-transform-field=/);assert.match(context.quickTransform(s,e),/data-responsive-field=/);
 }
});

test('actual responsive change handler applies screen fields without an element and rejects invalid edits without new Undo',async()=>{
 const source=await readFile('src/tools/uxStudio/main.mjs','utf8'),{commitDocumentEdit}=await import('../../src/tools/uxStudio/history.mjs');
 const scope={doc:fixture(),undo:[],redo:[],commitDocumentEdit,wheelRun:null,dirty:false,status:'',render(){},selectedScreen:'main',selection:()=>undefined,screenById:(d,id)=>d.screens.find(s=>s.id===id),rootSize:()=>({w:390,h:844}),applyResponsiveEdit,
  event:{target:{dataset:{responsiveField:'screen.safeArea.0'},value:'44',matches:selector=>selector==='[data-responsive-field]'}}};
 vm.createContext(scope);const start=source.indexOf('function edited(fn)'),end=source.indexOf('let baselineItems',start);vm.runInContext(source.slice(start,end),scope);
 const begin=source.indexOf('    const input = event.target;',source.indexOf("app.addEventListener('change'")),finish=source.indexOf("    if (input.matches('[data-skin-image]')",begin);
 vm.runInContext('function change(){'+source.slice(begin,finish)+'}',scope);
 scope.change();assert.equal(scope.doc.screens[0].safeArea[0],44);assert.equal(scope.undo.length,1);assert.equal(scope.undo[0].screens[0].safeArea[0],24);assert.equal(scope.dirty,true);
 const before=JSON.stringify(scope.doc);scope.event.target.value='invalid';scope.change();assert.equal(JSON.stringify(scope.doc),before);assert.equal(scope.undo.length,1);assert.match(scope.status,/수치/);
});

test('actual canvas part gesture selects constrained parts without starting a manual drag',async()=>{
 const source=await readFile('src/tools/uxStudio/grapes-pilot.mjs','utf8'),begin=source.indexOf(" editor.DomComponents.addType('ux-part'"),end=source.indexOf(' const traitsFor=',begin);
 let view,selected,drags=0,editable=false;const part={};const scope={editor:{select:value=>selected=value,DomComponents:{addType:(_name,type)=>view=type.view}},originalFor:()=>part,canEditRect:()=>editable,startPartDrag:()=>drags++,status:{}};
 vm.runInNewContext(source.slice(begin,end),scope);const model={};view.dragPart.call({model},{});assert.equal(selected,model);assert.equal(drags,0);
 editable=true;view.dragPart.call({model},{});assert.equal(drags,1);
});

test('safe-area root copy and reparent preserve actual geometry without carrying an invalid nested safe basis',async()=>{
 const {copySelection}=await import('../../src/tools/uxStudio/commands.mjs'),{moveInto}=await import('../../src/tools/uxStudio/layers.mjs');
 const d=fixture(),s=d.screens[0],before=resolveRect(s,'safe',390,844),copy=copySelection(d,'main',['safe'],390,844);
 assert.equal(copy.elements[0].useSafeArea,undefined);for(const [key,value] of Object.entries(before))assert.ok(Math.abs(resolveRect({elements:copy.elements},'safe',390,844)[key]-value)<1e-8);
 const target=part('target',{x:0,y:0,w:100,h:100});s.elements.push(target);moveInto(s,['safe'],'target',390,844);for(const [key,value] of Object.entries(before))assert.ok(Math.abs(resolveRect(s,'safe',390,844)[key]-value)<1e-8);assert.equal(s.elements[0].useSafeArea,undefined);
});

test('safe-area editor drag and circular resize reuse the same basis and CSS while retaining Undo snapshots',t=>{
 const previous=globalThis.window;t.after(()=>{if(previous===undefined)delete globalThis.window;else globalThis.window=previous;});
 let moveable;class Control{handlers={};on(name,fn){this.handlers[name]=fn;return this;}destroy(){}updateRect(){}}
 globalThis.window={Moveable:class extends Control{constructor(){super();moveable=this;}},Selecto:Control};
 for(const action of ['drag','resize']){
  const s=fixture().screens[0],e=s.elements[0],node={dataset:{screen:'main',element:'safe'},style:{}},snapshots=[];e.appearance={shape:'circle'};const before=structuredClone(s.elements);
  const dispose=attachEditor({canvas:{dataset:{scale:'1'},querySelectorAll:()=>[node]},host:{},screen:s,ids:['safe'],width:390,height:844,snap:false,onSelect(){},onCommit:value=>snapshots.push(value)});
  moveable.handlers[action+'Start']({clientX:0,clientY:0});moveable.handlers[action]({clientX:36,clientY:0});moveable.handlers[action+'End']();dispose();
  const rect=resolveRect(s,'safe',390,844);
  if(action==='drag'){assert.equal(rect.x,56);assert.equal(node.style.left,'calc(10% + 17px)');}
  else{assert.ok(Math.abs(rect.w-216)<1e-8);assert.ok(Math.abs(rect.h-216)<1e-8);assert.equal(rect.x,20);}
  assert.deepEqual(snapshots,[before]);
 }
});
