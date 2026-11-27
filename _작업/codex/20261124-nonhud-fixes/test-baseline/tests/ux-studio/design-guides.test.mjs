import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDesignGuide} from '../../src/tools/uxStudio/design-guides.mjs';
const node=(id,parentId,x,y,w,h,kind='panel')=>({id,name:id,kind,parentId,x,y,w,h,text:''});
const fixture=()=>({schemaVersion:3,entryScreen:'page',screens:[{id:'page',name:'Page',kind:'page',elements:[
 node('unit',null,10,20,50,40),node('child','unit',20,25,30,25,'text')
]}]});
test('nested unit reports parent-relative and screen-relative coordinates without rounding',()=>{
 const d=fixture(),before=JSON.stringify(d),g=buildDesignGuide(d,'page','child',{width:1000,height:800});
 assert.deepEqual(g.unit.rect,{x:200,y:240,w:150,h:80});
 assert.deepEqual(g.unit.relative,{x:100,y:80,w:150,h:80});
 assert.deepEqual(g.unit.parentPercent,{x:20,y:25,w:30,h:25});
 assert.deepEqual(g.unit.screenPercent,{x:20,y:30,w:15,h:10});
 assert.deepEqual(g.unit.margins,{top:80,right:250,bottom:160,left:100});
 assert.deepEqual(g.ancestors.map(e=>e.id),['unit']);assert.equal(g.parent.id,'unit');
 assert.equal(JSON.stringify(d),before);
});
test('a parent guide includes descendants and positive nearest sibling spacing',()=>{
 const d=fixture(),s=d.screens[0];s.elements=[node('unit',null,10,10,80,60),node('icon','unit',5,10,10,20,'image'),node('title','unit',20,10,50,15,'text'),node('body','unit',20,35,50,15,'text'),node('button','unit',80,20,15,40,'button'),node('unrelated',null,0,90,10,5)];
 const g=buildDesignGuide(d,'page','unit',{width:1000,height:800});
 assert.deepEqual(g.children.map(e=>e.id),['icon','title','body','button']);
 assert.deepEqual(g.elements.map(e=>e.id),['unit','icon','title','body','button']);
 assert.ok(g.dimensions.some(d=>d.kind==='gap'&&d.axis==='x'&&d.valuePx===40));
 assert.ok(g.dimensions.some(d=>d.kind==='gap'&&d.axis==='y'&&d.valuePx===48));
 assert.ok(g.dimensions.every(d=>Number.isFinite(d.valuePx)&&Number.isFinite(d.valuePercent)));
});
test('guide resolves v4 anchors in logical pixels rather than stored fallback percentages',()=>{
 const d=fixture();d.schemaVersion=4;d.screens[0].logicalSize={w:1000,h:800};
 d.screens[0].elements[1].rectTransform={min:[0,1],max:[1,1],pivot:[.5,1],position:[0,-10],sizeDelta:[-20,40]};
 const g=buildDesignGuide(d,'page','child');
 assert.deepEqual(g.unit.rect,{x:110,y:170,w:480,h:40});
 assert.equal(g.unit.parentPercent.w,96);
 assert.equal(g.screen.width,1000);assert.equal(g.screen.height,800);
});
test('font metadata distinguishes an explicit authored setting from renderer default',()=>{
 const d=fixture(),e=d.screens[0].elements[1];e.fontSize=17;e.typography={family:'arial',weight:700,lineHeight:21,align:'left'};
 let g=buildDesignGuide(d,'page','child',{width:1000,height:800});
 assert.equal(g.unit.font.sizePx,17);assert.equal(g.unit.font.source,'explicit');assert.equal(g.unit.font.lineHeight,21);assert.equal(g.unit.font.weight,700);
 delete e.fontSize;g=buildDesignGuide(d,'page','child',{width:1000,height:800});
 assert.equal(g.unit.font.source,'renderer-default');assert.equal(g.unit.font.sizePx,16);
});
test('screen-root guide exposes roots and rejects missing IDs, invalid size and parent cycle',()=>{
 const d=fixture(),g=buildDesignGuide(d,'page',null,{width:1000,height:800});
 assert.equal(g.unit.id,null);assert.deepEqual(g.children.map(e=>e.id),['unit']);assert.equal(g.parent,null);
 assert.throws(()=>buildDesignGuide(d,'missing','child'),/screen|화면/i);
 assert.throws(()=>buildDesignGuide(d,'page','missing'),/unit|부품/i);
 assert.throws(()=>buildDesignGuide(d,'page','child',{width:0,height:800}),/size|크기/i);
 d.screens[0].elements[0].parentId='child';assert.throws(()=>buildDesignGuide(d,'page','child',{width:1000,height:800}),/cycle|순환/i);
});
test('background and frame painting does not masquerade as sibling spacing',()=>{
 const d=fixture(),s=d.screens[0];s.elements=[node('unit',null,0,0,100,100),{...node('bg','unit',0,0,100,100),partRole:'background'},node('a','unit',10,10,20,20),node('b','unit',40,10,20,20),{...node('frame','unit',0,0,100,100),partRole:'frame'}];
 const g=buildDesignGuide(d,'page','unit',{width:1000,height:800});
 assert.equal(g.dimensions.filter(d=>d.kind==='gap'&&d.axis==='x').length,1);
 assert.equal(g.dimensions.find(d=>d.kind==='gap'&&d.axis==='x').valuePx,100);
});
