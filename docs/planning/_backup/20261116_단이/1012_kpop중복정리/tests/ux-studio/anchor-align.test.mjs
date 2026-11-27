import test from 'node:test';
import assert from 'node:assert/strict';
import {alignElement} from '../../src/tools/uxStudio/layers.mjs';
import {resolveRect} from '../../src/tools/uxStudio/model.mjs';
import {encodeTransform} from '../../src/tools/uxStudio/rect-transform.mjs';
for(const type of ['percent','anchor','inset'])test(`${type} alignment preserves size, vertical position and descendants`,()=>{
 const p={id:'p',x:10,y:10,w:80,h:70};const e={id:'e',parentId:'p',x:10,y:10,w:25,h:20};
 const s={elements:[p,e,{id:'c',parentId:'e',x:10,y:10,w:50,h:50}]};
 const base=resolveRect(s,'p',400,800),before=resolveRect(s,'e',400,800);
 if(type==='anchor')e.rectTransform=encodeTransform(base,before,[0,1],[1,1],[.5,1]);
 if(type==='inset')e.inset=[56,208,392,32];
 for(const [direction,x] of [['left',40],['center',160],['right',280]]){
  alignElement(s,e,direction,400,800);const r=resolveRect(s,'e',400,800);
  for(const [key,value] of Object.entries({x,y:before.y,w:before.w,h:before.h}))assert.ok(Math.abs(r[key]-value)<1e-8);
  assert.ok(Math.abs(resolveRect(s,'c',400,800).x-(x+8))<1e-8);
 }
 assert.equal(Boolean(e.rectTransform),type==='anchor');assert.equal(Boolean(e.inset),type==='inset');
 const saved=structuredClone(e);assert.throws(()=>alignElement(s,e,'bad',400,800));assert.deepEqual(e,saved);
});
