import test from 'node:test';
import assert from 'node:assert/strict';
import {applyGrapesEdits} from '../../src/tools/uxStudio/grapes-bridge.mjs';
import {applyDesignGuideChange} from '../../src/tools/uxStudio/design-guide-edit.mjs';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const part=(id,extra={})=>({id,name:id,kind:'panel',x:10,y:10,w:50,h:20,...extra});
const fixture=()=>({schemaVersion:4,projectId:'ux-grapes-guide',name:'Guide',revision:3,entryScreen:'main',screens:[{id:'main',name:'Main',kind:'page',logicalSize:{w:400,h:800},elements:[part('parent'),part('child',{parentId:'parent',kind:'image'})]}],transitions:[],fixtures:{balance:0,items:[]}});
const edits=doc=>doc.screens[0].elements.map(e=>({id:e.id,parentId:e.parentId||null,name:e.name,text:e.text||''}));

test('canvas guide image and font fields roundtrip without losing IDs or changing the original',()=>{
 const source=fixture(),before=structuredClone(source),list=edits(source),image={src:'',asset:'icon',alt:'Cash',fit:'contain'};
 Object.assign(list[1],{image,fontSize:18,text:'13,075'});
 const result=applyGrapesEdits(source,'main',list);
 assert.deepEqual(result.screens[0].elements[1].image,image);assert.equal(result.screens[0].elements[1].fontSize,18);assert.equal(result.screens[0].elements[1].text,'13,075');
 assert.equal(result.screens[0].elements[1].parentId,'parent');assert.deepEqual(source,before);
 Object.assign(list[1],{image:null,fontSize:null});const removed=applyGrapesEdits(result,'main',list);
 assert.equal(removed.screens[0].elements[1].image,undefined);assert.equal(removed.screens[0].elements[1].fontSize,undefined);
});

test('guide geometry persists anchored and inset edits while retaining the constraint contract',()=>{
 for(const constraint of [{inset:[1,2,3,4]},{rectTransform:{min:[1,1],max:[1,1],pivot:[1,1],position:[0,0],sizeDelta:[30,40]}}]){
  const source=fixture();Object.assign(source.screens[0].elements[1],constraint);
  const changed=applyDesignGuideChange(source,'main','child',{type:'rect',rect:{x:20,y:10,w:80,h:30}}),e=changed.screens[0].elements[1],list=edits(source);
  list[1].guideGeometry=Object.fromEntries(['x','y','w','h','inset','rectTransform'].filter(key=>Object.hasOwn(e,key)).map(key=>[key,e[key]]));
  assert.deepEqual(applyGrapesEdits(source,'main',list),changed);
  list[1].guideGeometry.parentId='other';assert.throws(()=>applyGrapesEdits(source,'main',list));
 }
});

test('canvas guide upgrades only image-bearing legacy edits and rejects invalid images or fonts',()=>{
 const source=fixture();source.schemaVersion=1;delete source.screens[0].logicalSize;const list=edits(source);
 list[1].image={src:'',asset:'icon',alt:'Cash',fit:'contain'};
 assert.equal(applyGrapesEdits(source,'main',list).schemaVersion,2);
 list[1].image={src:'https://unsafe.example/a.png'};assert.throws(()=>applyGrapesEdits(source,'main',list));
 delete list[1].image;list[1].fontSize=-1;assert.throws(()=>applyGrapesEdits(source,'main',list));
});

test('live canvas guide changes enter one model set and roundtrip through the persisted design',()=>{
 const source=fixture(),text=readFileSync(new URL('../../src/tools/uxStudio/grapes-pilot.mjs',import.meta.url),'utf8');
 const start=text.indexOf(" document.querySelector('#unit-guide').onclick="),end=text.indexOf(" document.querySelector('#project-folders').onclick=",start);
 let opened,selected,sets=0;
 const models=source.screens[0].elements.map(e=>{let values={uxScreen:'main',uxId:e.id,name:e.name,uxText:e.text||'',uxImage:false,uxFontSize:false,uxGuideGeometry:false,...Object.fromEntries(['x','y','w','h'].map(k=>['ux'+k.toUpperCase(),e[k]]))};const history=[];return {get:key=>values[key],set:change=>{history.push({...values});values={...values,...change};sets++;},undo:()=>{values=history.pop();}};});
 selected=models[1];
 const design=()=>applyGrapesEdits(source,'main',models.map((model,i)=>({id:model.get('uxId'),parentId:source.screens[0].elements[i].parentId||null,name:model.get('name'),text:model.get('uxText'),rect:Object.fromEntries(['x','y','w','h'].map(k=>[k,model.get('ux'+k.toUpperCase())])),...(model.get('uxGuideGeometry')!==false?{guideGeometry:model.get('uxGuideGeometry')}:{}),...(model.get('uxImage')!==false?{image:model.get('uxImage')}:{}),...(model.get('uxFontSize')!==false?{fontSize:model.get('uxFontSize')}:{})})));
 const button={},context={document:{querySelector:()=>button},editor:{getSelected:()=>selected,select:part=>selected=part},screenPicker:{value:'main'},workspaceId:'workspace-one',design,parts:()=>models,openDesignGuide:options=>opened=options,applyDesignGuideChange,importGuideImage(){},leaveForDetail(){},status:{}};
 vm.runInNewContext(text.slice(start,end),context);button.onclick();
 assert.equal(typeof opened.onChange,'function');
 const before=design(),changed=opened.onChange({type:'rect',elementId:'child',screenId:'main',rect:{x:20,y:10,w:80,h:30}});
 assert.deepEqual(changed,design());assert.equal(changed.screens[0].elements[1].x,10);assert.equal(changed.screens[0].elements[1].w,40);assert.equal(sets,1);
 models[1].undo();assert.deepEqual(design(),before);
 const image={src:'',asset:'icon',alt:'Cash',fit:'contain'};opened.onChange({type:'image',elementId:'child',image});assert.deepEqual(design().screens[0].elements[1].image,image);
 opened.onSelect('parent');opened.onChange({type:'text',elementId:'child',text:'Amount',fontSize:18});assert.equal(design().screens[0].elements[1].text,'Amount');assert.equal(design().screens[0].elements[0].text,undefined);
 assert.throws(()=>opened.onChange({type:'image',elementId:'missing',image}));
});

test('canvas guide appearance refresh replaces decorations while preserving the actual child model',()=>{
 const source=fixture(),text=readFileSync(new URL('../../src/tools/uxStudio/grapes-pilot.mjs',import.meta.url),'utf8');
 const start=text.indexOf(' function refreshPartAppearance('),end=text.indexOf(" document.querySelector('#studio-save').onclick=",start);
 const child={get:key=>key==='uxId'?'child':null},oldDecoration={get:()=>null},items=[oldDecoration,child];let style,classes,skips=0,controls=0;
 const collection={filter:fn=>items.filter(fn),remove:item=>items.splice(items.indexOf(item),1),add:(added,{at})=>items.splice(at,0,...added)};
 const model={get:key=>({uxScreen:'main',uxId:'parent'})[key],components:()=>collection,setStyle:value=>style=value,setClass:value=>classes=value};
 const domStyle={*[Symbol.iterator](){yield 'left';yield 'width';},getPropertyValue:key=>({left:'10%',width:'50%'})[key]},node={style:domStyle,classList:['ui-element','image-filled'],children:[{dataset:{},tagName:'img'}]};
 const scope={design:()=>source,workspaceId:null,document:{createElement:()=>({firstElementChild:node})},renderLayout:(screen,_host,options,parent)=>{assert.equal(screen,source.screens[0]);assert.equal(options.visible(screen.elements[0]),true);assert.equal(options.visible(screen.elements[1]),false);assert.equal(parent,null);},attachControls:(_host,_screen,_state,options)=>{assert.equal(options.mode,'edit');controls++;},editor:{UndoManager:{skip:fn=>{skips++;fn();}}},component:(dom,sid)=>({decoration:dom.tagName,screen:sid,get:()=>null})};
 vm.runInNewContext(text.slice(start,end),scope);scope.refreshPartAppearance(model);
 assert.equal(items.length,2);assert.equal(items[1],child);assert.equal(items.includes(oldDecoration),false);assert.equal(items[0].decoration,'img');
 assert.equal(style.left,'10%');assert.equal(style.width,'50%');assert.deepEqual([...classes],['ui-element','image-filled']);assert.equal(skips,1);assert.equal(controls,1);
});
