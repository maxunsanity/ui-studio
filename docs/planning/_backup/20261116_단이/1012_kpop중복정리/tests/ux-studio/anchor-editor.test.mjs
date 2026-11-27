import test from 'node:test';
import assert from 'node:assert/strict';
import {attachEditor} from '../../src/tools/uxStudio/editor.mjs';
import {resolveRect} from '../../src/tools/uxStudio/model.mjs';
import {transformStyles} from '../../src/tools/uxStudio/rect-transform.mjs';
// Actual editor handlers with stubbed Moveable/Selecto, not a browser interaction test.
function run(t, element, action, dx, dy) {
 const oldWindow=globalThis.window; let moveable;const commits=[];
 class Control {handlers={};on(name,fn){this.handlers[name]=fn;return this;}destroy(){}updateRect(){}}
 globalThis.window={Moveable:class extends Control {constructor(){super();moveable=this;}},Selecto:Control};
 t.after(()=>{if(oldWindow===undefined)delete globalThis.window;else globalThis.window=oldWindow;});
 const parent={id:'p',x:10,y:10,w:80,h:70};
 const screen={id:'s',elements:[parent,element]};const node={dataset:{screen:'s',element:element.id},style:{}};
 const canvas={dataset:{scale:'0.5'},querySelectorAll:()=>[node]};
 const before=structuredClone(screen.elements);
 const dispose=attachEditor({canvas,host:{},screen,ids:[element.id],width:400,height:800,snap:false,onSelect(){},onCommit:(...args)=>commits.push(args)});
 moveable.handlers[action+'Start']({clientX:100,clientY:100});
 moveable.handlers[action]({clientX:100+dx*.5,clientY:100+dy*.5});
 moveable.handlers[action+'End']();dispose();
 assert.deepEqual(commits,[[before,true]]);
 return {rect:resolveRect(screen,element.id,400,800),style:node.style};
}
function anchor(){return {id:'a',parentId:'p',x:0,y:0,w:1,h:1,rectTransform:{min:[1,1],max:[1,1],pivot:[1,1],position:[-12,-18],sizeDelta:[100,40]}};}
test('editor drag updates anchor CSS and model at editor scale, preserving undo snapshot',t=>{
 const e=anchor(),result=run(t,e,'drag',20,10);
 assert.deepEqual(result.rect,{x:268,y:108,w:100,h:40});
 assert.deepEqual(result.style,transformStyles(e.rectTransform));
});
test('editor circular anchor resize keeps pixel sides equal under nonsquare parent',t=>{
 const e=anchor();e.appearance={shape:'circle'};
 const result=run(t,e,'resize',20,10);
 assert.deepEqual(result.rect,{x:248,y:98,w:120,h:120});
 assert.deepEqual(result.style,transformStyles(e.rectTransform));
});
test('editor retains percent circle sizing and percent style path',t=>{
 const e={id:'a',parentId:'p',x:10,y:10,w:25,h:10,appearance:{shape:'circle'}};
 const result=run(t,e,'resize',16,8);
 assert.equal(result.rect.w,96);assert.equal(result.rect.h,96);
 assert.equal(result.style.width,'30%');assert.equal(result.style.left,'10%');
});
