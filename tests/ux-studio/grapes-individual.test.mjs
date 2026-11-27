import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as bridge from '../../src/tools/uxStudio/grapes-bridge.mjs';

test('zoom keeps the same parent-space point under the pointer and clamps the usable range',()=>{
 assert.equal(typeof bridge.zoomGrapesViewport,'function');
 const view={zoom:50,coords:{x:-100,y:20},width:800,height:600};
 assert.deepEqual(bridge.zoomGrapesViewport(view,100,{x:600,y:100}),{zoom:100,x:-400,y:240});
 assert.deepEqual(bridge.zoomGrapesViewport(view,100),{zoom:100,x:-200,y:40});
 assert.deepEqual(bridge.zoomGrapesViewport({...view,zoom:100,coords:{x:-400,y:240}},50,{x:600,y:100}),{zoom:50,x:-100,y:20});
 assert.equal(bridge.zoomGrapesViewport(view,10000).zoom,400);
 assert.equal(bridge.zoomGrapesViewport(view,1).zoom,10);
 assert.throws(()=>bridge.zoomGrapesViewport(view,NaN));
 assert.deepEqual(view.coords,{x:-100,y:20});
});

test('read-only parent never steals a nested child mousedown, while its own hit remains selectable',()=>{
 const source=readFileSync(new URL('../../src/tools/uxStudio/grapes-pilot.mjs',import.meta.url),'utf8');
 const code=source.slice(source.indexOf(" editor.DomComponents.addType('ux-part'"),source.indexOf(' const traitsFor='));
 let part,selected=null,prevented=0,stopped=0,drags=0;
 const editor={DomComponents:{addType:(_name,type)=>part=type},select:model=>selected=model};
 vm.runInNewContext(code,{editor,originalFor:()=>({inset:[0,0,0,0]}),canEditRect:()=>false,startPartDrag:()=>drags++,status:{}});
 const parentEl={},childEl={},model={getEl:()=>parentEl};
 const event={button:0,target:{closest:()=>childEl},preventDefault:()=>prevented++,stopPropagation:()=>stopped++};
 part.view.dragPart.call({model},event);
 assert.equal(selected,null);assert.equal(drags,0);
 event.target.closest=()=>parentEl;
 part.view.dragPart.call({model},event);
 assert.equal(selected,model);assert.equal(prevented,1);assert.equal(stopped,1);
});

test('iframe wheel coordinates preserve the pointer and ordinary wheel leaves the view alone',()=>{
 const source=readFileSync(new URL('../../src/tools/uxStudio/grapes-pilot.mjs',import.meta.url),'utf8');
 const code=source.slice(source.indexOf(' const wheelZoom='),source.indexOf(" editor.Canvas.getElement().addEventListener('wheel'"));
 let changed,prevented=0,iframePrevented=0;
 const context={editor:{Canvas:{getElement:()=>({getBoundingClientRect:()=>({left:200,top:100,width:800,height:600})}),getFrameEl:()=>({getBoundingClientRect:()=>({left:300,top:180})}),getZoom:()=>50}},zoomTo:(zoom,point)=>changed={zoom,point}};
 vm.runInNewContext(code+';globalThis.wheelZoom=wheelZoom;',context);
 const event={clientX:100,clientY:200,deltaY:1,deltaMode:1,preventDefault:()=>prevented++};
 context.wheelZoom(event);assert.equal(changed,undefined);
 context.wheelZoom({...event,ctrlKey:true,_parentEvent:{preventDefault:()=>iframePrevented++}});
 assert.equal(changed.point.x,150);assert.equal(changed.point.y,180);assert.equal(changed.zoom,50*Math.exp(-.032));
 assert.equal(prevented,1);assert.equal(iframePrevented,1);
 context.wheelZoom({...event,metaKey:true,clientX:800,clientY:600,deltaMode:0});
 assert.equal(changed.point.x,600);assert.equal(changed.point.y,500);
 context.wheelZoom({...event,ctrlKey:true},true);
 assert.equal(changed.point.x,150);assert.equal(changed.point.y,180);
});

test('nested part path and direct children choose individual models without rewriting their parent',()=>{
 const source=readFileSync(new URL('../../src/tools/uxStudio/grapes-pilot.mjs',import.meta.url),'utf8');
 const code=source.slice(source.indexOf(' const syncSelection='),source.indexOf(' const leaveForDetail='));
 const node=(id,parent=null)=>({get:key=>({uxId:id,name:id,uxScreen:'page'})[key],parent:()=>parent,children:[],components(){return this.children;}});
 const parent=node('HUD_Top'),child=node('Currency_Cash',parent),leaf=node('Txt_Amount',child);parent.children=[child];child.children=[leaf];
 let selected=leaf;const dom=new Map();
 const element=()=>({dataset:{},children:[],replaceChildren(){this.children=[];},append(button){this.children.push(button);},setAttribute(key,value){this[key]=value;}});
 const context={editor:{getSelected:()=>selected,select:part=>selected=part},originalFor:()=>({}),canEditRect:()=>true,workspaceId:null,savedCopy:null,source:{projectId:'original'},screenPicker:{value:'page'},designURL:()=>'/detail',document:{querySelector:id=>{if(!dom.has(id))dom.set(id,element());return dom.get(id);},querySelectorAll:()=>[],createElement:element}};
 vm.runInNewContext(code+';globalThis.syncSelection=syncSelection;',context);context.syncSelection();
 assert.deepEqual(dom.get('#selection-path').children.map(button=>button.dataset.selectPart),['HUD_Top','Currency_Cash','Txt_Amount']);
 dom.get('#selection-path').children[1].onclick();context.syncSelection();
 assert.equal(selected,child);assert.equal(child.parent(),parent);
 assert.deepEqual(dom.get('#selection-children').children.map(button=>button.dataset.selectPart),['Txt_Amount']);
 dom.get('#selection-children').children[0].onclick();assert.equal(selected,leaf);assert.equal(leaf.parent(),child);
});

test('canvas unit guide reads the live design and routes child editing through the existing guarded navigation',()=>{
 const source=readFileSync(new URL('../../src/tools/uxStudio/grapes-pilot.mjs',import.meta.url),'utf8');
 const begin=source.indexOf(" document.querySelector('#unit-guide').onclick="),end=source.indexOf(" document.querySelector('#project-folders').onclick=",begin);
 let opened,edited=0;const button={},snapshot={projectId:'live',screens:[]};
 const node=id=>({get:key=>({uxId:id,uxScreen:'page'})[key]});const parent=node('parent'),child=node('child'),other={get:key=>({uxId:'other',uxScreen:'elsewhere'})[key]};let selected=parent;
 const context={document:{querySelector:()=>button},editor:{getSelected:()=>selected,select:part=>selected=part},screenPicker:{value:'page'},workspaceId:'workspace-one',design:()=>snapshot,canvasDevicePreview:()=>({logical:{w:390,h:844}}),previewSettings:{},parts:()=>[parent,child,other],openDesignGuide:options=>opened=options,leaveForDetail:()=>edited++,status:{}};
 if(begin>=0)vm.runInNewContext(source.slice(begin,end),context);
 assert.equal(typeof button.onclick,'function');button.onclick();
 assert.equal(opened.document,snapshot);assert.equal(opened.screenId,'page');assert.equal(opened.elementId,'parent');assert.equal(opened.workspaceId,'workspace-one');
 opened.onSelect('child');assert.equal(selected,child);opened.onSelect(null);assert.equal(selected,child);
 opened.onEdit('parent');assert.equal(selected,parent);assert.equal(edited,1);
 opened.onEdit('other');assert.equal(selected,parent);assert.equal(edited,1);
});
