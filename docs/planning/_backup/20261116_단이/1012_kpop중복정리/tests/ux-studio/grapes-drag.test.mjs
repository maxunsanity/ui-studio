import test from 'node:test';
import assert from 'node:assert/strict';
import {startPartDrag} from '../../src/tools/uxStudio/grapes-drag.mjs';
function fixture(){
 const original={x:5,y:10,w:40,h:20},el={offsetParent:{clientWidth:300,clientHeight:200},style:{left:'5%',top:'10%'},ownerDocument:{}},values={uxX:5,uxY:10,uxW:40,uxH:20,name:'child'};
 let options,commits=0;
 const component={getEl:()=>el,get:k=>values[k],set:v=>{commits++;Object.assign(values,v);}};
 const editor={select(){},Utils:{Dragger:class{constructor(o){options=o;}start(){}}}};
 const event={button:0,target:{closest:()=>el},preventDefault(){},stopPropagation(){}};
 return {original,el,values,component,editor,event,get options(){return options;},get commits(){return commits;}};
}
test('drag previews parent-percent coordinates and commits only at release',()=>{
 const f=fixture();startPartDrag(f.editor,f.component,f.original,f.event);
 f.options.setPosition({x:30,y:20});assert.equal(f.el.style.left,'15%');assert.equal(f.el.style.top,'20%');assert.equal(f.commits,0);
 f.options.onEnd(null,null,{cancelled:false});assert.equal(f.values.uxX,15);assert.equal(f.values.uxY,20);assert.equal(f.commits,1);assert.equal(f.original.x,5);
});
test('cancel and invalid geometry never commit; unsupported constraints and nested target refuse',()=>{
 const f=fixture();startPartDrag(f.editor,f.component,f.original,f.event);f.options.setPosition({x:30,y:20});f.options.onEnd(null,null,{cancelled:true});assert.equal(f.commits,0);assert.equal(f.el.style.left,'5%');
 f.options.setPosition({x:Infinity,y:0});f.options.onEnd(null,null,{cancelled:false});assert.equal(f.commits,0);
 assert.equal(startPartDrag(f.editor,f.component,{...f.original,inset:[0,0,0,0]},f.event),false);
 f.event.target.closest=()=>({});assert.equal(startPartDrag(f.editor,f.component,f.original,f.event),false);
});

test('board title drag commits canvas pixels only and Escape does not commit',async()=>{
 const {startBoardDrag}=await import('../../src/tools/uxStudio/grapes-drag.mjs');const f=fixture();f.values.boardX=24;f.values.boardY=40;f.event.target.closest=()=>({parentElement:f.el});
 startBoardDrag(f.editor,f.component,f.event);f.options.setPosition({x:124,y:90});assert.equal(f.commits,0);f.options.onEnd(null,null,{cancelled:false});assert.equal(f.values.boardX,124);assert.equal(f.values.uxX,5);
 startBoardDrag(f.editor,f.component,f.event);f.options.setPosition({x:-1,y:20000});assert.equal(f.el.style.left,'0px');assert.equal(f.el.style.top,'10000px');f.options.onEnd(null,null,{cancelled:true});assert.equal(f.commits,1);
});

test('canvas pan is view-only and cancelled motion restores the view',async()=>{
 const {startCanvasPan}=await import('../../src/tools/uxStudio/grapes-drag.mjs');const f=fixture();let coords={x:10,y:20};
 f.editor.Canvas={getCoords:()=>coords,setCoords:(x,y)=>{coords={x,y};}};
 f.event.currentTarget={ownerDocument:{}};f.event.stopImmediatePropagation=()=>{};
 startCanvasPan(f.editor,f.event);f.options.setPosition({x:110,y:70});assert.deepEqual(coords,{x:110,y:70});assert.equal(f.commits,0);
 f.options.onEnd(null,null,{cancelled:true});assert.deepEqual(coords,{x:10,y:20});
 f.options.setPosition({x:Infinity,y:0});assert.deepEqual(coords,{x:10,y:20});
 f.event.button=2;assert.equal(startCanvasPan(f.editor,f.event),false);
});
