import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveTransform as resolve,encodeTransform as encode,adjustTransform,transformStyles,validateTransform} from '../../src/tools/uxStudio/rect-transform.mjs';
const p={x:0,y:0,w:390,h:844};
function same(a,b){for(const k of ['x','y','w','h'])assert.ok(Math.abs(a[k]-b[k])<1e-8,k);}
test('top-left anchored fixed-size HUD survives parent resize',()=>{
 const t={min:[0,1],max:[0,1],pivot:[0,1],position:[16,-24],sizeDelta:[100,40]};
 same(resolve(p,t),{x:16,y:24,w:100,h:40});same(resolve({...p,w:768,h:1024},t),{x:16,y:24,w:100,h:40});
});
test('center anchor keeps size while moving by half parent delta',()=>{
 const t={min:[.5,.5],max:[.5,.5],pivot:[.5,.5],position:[0,0],sizeDelta:[100,40]};
 same(resolve(p,t),{x:145,y:402,w:100,h:40});same(resolve({...p,w:490,h:944},t),{x:195,y:452,w:100,h:40});
});
test('stretch anchors preserve four pixel edges',()=>{
 const t=encode(p,{x:10,y:20,w:350,h:784},[0,0],[1,1],[.5,.5]);
 same(resolve({...p,w:490,h:944},t),{x:10,y:20,w:450,h:884});
});
test('bottom-right anchors use Unity upward Y with web downward Y',()=>{
 const t={min:[1,0],max:[1,0],pivot:[1,0],position:[-12,18],sizeDelta:[100,40]};
 same(resolve(p,t),{x:278,y:786,w:100,h:40});
});
test('inverse conversion preserves nested rectangles for different pivots and anchors',()=>{
 const parent={x:39,y:84.4,w:312,h:590.8},rect={x:60,y:96.4,w:276,h:560.8};
 for(const pivot of [[0,0],[.5,.5],[1,1]])for(const [min,max] of [[[0,0],[1,1]],[[.5,.5],[.5,.5]],[[0,1],[0,1]]])same(resolve(parent,encode(parent,rect,min,max,pivot)),rect);
});
test('unsupported invalid geometry is rejected instead of silently clamped',()=>{
 const t={min:[0,0],max:[0,0],pivot:[.5,.5],position:[0,0],sizeDelta:[100,40]};
 for(const bad of [{...t,sizeDelta:[-1,40]},{...t,min:[1,0],max:[0,1]},{...t,pivot:[NaN,0]},{...t,position:[0]}])assert.throws(()=>resolve(p,bad));
});

test('drag and southeast resize preserve anchors and do not mutate original',()=>{
 const t=encode(p,{x:30,y:40,w:120,h:80},[.5,.5],[.5,.5],[.25,.75]),before=JSON.stringify(t);
 same(resolve(p,adjustTransform(p,t,12,-8)),{x:42,y:32,w:120,h:80});
 same(resolve(p,adjustTransform(p,t,20,10,true)),{x:30,y:40,w:140,h:90});
 assert.equal(JSON.stringify(t),before);assert.throws(()=>adjustTransform(p,t,-121,0,true));
});
test('CSS coefficients agree with numerical bounds for three parent sizes and all pivots',()=>{
 const evaluate=(text,size)=>{const m=/^calc\(([-+0-9.e]+)% ([+-]) ([-+0-9.e]+)px\)$/.exec(text);assert.ok(m,text);return Number(m[1])*size/100+(m[2]==='-'?-1:1)*Number(m[3]);};
 for(const pivot of [[0,0],[.5,.5],[1,1]])for(const parent of [p,{x:25,y:50,w:768,h:1024},{x:0,y:0,w:430,h:844}]){
  const t={min:[.1,.2],max:[.8,.9],pivot,position:[12,-8],sizeDelta:[-20,40]},r=resolve(parent,t),css=transformStyles(t);
  same({x:parent.x+evaluate(css.left,parent.w),y:parent.y+evaluate(css.top,parent.h),w:evaluate(css.width,parent.w),h:evaluate(css.height,parent.h)},r);
 }
});
test('encoding has no array aliases and missing/invalid parents are rejected',()=>{
 const min=[0,0],max=[1,1],pivot=[.5,.5],t=encode(p,{x:10,y:20,w:300,h:600},min,max,pivot);
 min[0]=1;max[0]=0;pivot[0]=0;assert.deepEqual(t.min,[0,0]);assert.deepEqual(t.max,[1,1]);assert.deepEqual(t.pivot,[.5,.5]);
 for(const parent of [{w:390,h:844},{x:0,y:0,w:0,h:10},{x:0,y:0,w:Infinity,h:10}])assert.throws(()=>resolve(parent,t));
 assert.throws(()=>validateTransform(null));assert.throws(()=>encode(p,{x:0,y:0,w:20,h:20},null,[1,1],[.5,.5]));
});
