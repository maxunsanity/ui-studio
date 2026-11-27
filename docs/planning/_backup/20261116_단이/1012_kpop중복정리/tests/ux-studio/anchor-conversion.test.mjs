import test from 'node:test';
import assert from 'node:assert/strict';
import {changeAnchors} from '../../src/tools/uxStudio/layers.mjs';
import {resolveRect} from '../../src/tools/uxStudio/model.mjs';
for(const inset of [false,true])test(`constraint changes preserve geometry from ${inset?'inset':'percent'} including child and percent return`,()=>{
 const e={id:'e',parentId:'p',x:10,y:15,w:30,h:20};if(inset)e.inset=[10,20,30,40];
 const s={elements:[{id:'p',x:10,y:10,w:80,h:70},e,{id:'c',parentId:'e',x:10,y:10,w:50,h:50}]};
 const before=['e','c'].map(id=>resolveRect(s,id,400,800));
 const presets=[{min:[0,1],max:[0,1],pivot:[0,1]},{min:[0,0],max:[1,1],pivot:[.5,.5]},null];
 for(const preset of presets){
  changeAnchors(s,e,preset,400,800);
  ['e','c'].forEach((id,i)=>{const actual=resolveRect(s,id,400,800);for(const key of ['x','y','w','h'])assert.ok(Math.abs(actual[key]-before[i][key])<1e-8);});
  assert.equal(Boolean(e.rectTransform),preset!==null);assert.equal(e.inset,undefined);
 }
});
test('invalid anchor conversion leaves original data untouched',()=>{
 const e={id:'e',x:10,y:10,w:30,h:20,inset:[10,20,30,40]},s={elements:[e]},before=structuredClone(s);
 assert.throws(()=>changeAnchors(s,e,{min:[1,1],max:[0,0],pivot:[.5,.5]},400,800));assert.deepEqual(s,before);
});
