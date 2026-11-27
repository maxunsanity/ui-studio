import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolveRect,adjustRect,validateDocument} from '../../src/tools/uxStudio/model.mjs';
const t={min:[1,1],max:[1,1],pivot:[1,1],position:[-12,-18],sizeDelta:[100,40]};
function close(a,b){for(const k of ['x','y','w','h'])assert.ok(Math.abs(a[k]-b[k])<1e-8,k);}
test('common model resolves anchor child under percent parent and percent grandchild',()=>{
 const s={elements:[{id:'p',x:10,y:10,w:80,h:70},{id:'a',parentId:'p',x:0,y:0,w:1,h:1,rectTransform:structuredClone(t)},{id:'c',parentId:'a',x:10,y:20,w:50,h:50}]};
 close(resolveRect(s,'a',390,844),{x:239,y:102.4,w:100,h:40});
 close(resolveRect(s,'c',390,844),{x:249,y:110.4,w:50,h:20});
 close(resolveRect(s,'a',490,944),{x:329,y:112.4,w:100,h:40});
});
test('common adjustment moves and resizes anchors without mutating source',()=>{
 const e={id:'a',x:0,y:0,w:1,h:1,rectTransform:structuredClone(t)},before=JSON.stringify(e);
 const moved=adjustRect(e,10,5,390,844,false,0),resized=adjustRect(e,20,10,390,844,true,0);
 close(resolveRect({elements:[moved]},'a',390,844),{x:288,y:23,w:100,h:40});
 close(resolveRect({elements:[resized]},'a',390,844),{x:278,y:18,w:120,h:50});
 assert.equal(JSON.stringify(e),before);
});
test('public document validation keeps unfinished anchor format out of current saved designs',async()=>{
 const sample=JSON.parse(await readFile('src/tools/uxStudio/sample.json','utf8'));
 for(const version of [1,2,3]){const d=structuredClone(sample);d.schemaVersion=version;validateDocument(d);d.screens[0].elements[0].rectTransform=structuredClone(t);assert.throws(()=>validateDocument(d),/준비 중/);}
 const d=structuredClone(sample);d.schemaVersion=4;assert.throws(()=>validateDocument(d),/버전/);
});

import {moveInto,transformValue} from '../../src/tools/uxStudio/layers.mjs';
import {groupSelection,ungroupSelection,copySelection,pasteSelection} from '../../src/tools/uxStudio/commands.mjs';
function design(){return {schemaVersion:4,transitions:[],screens:[{id:'s',elements:[
 {id:'p',name:'parent',kind:'panel',x:10,y:10,w:80,h:70},
 {id:'a',name:'anchor',kind:'panel',parentId:'p',x:0,y:0,w:1,h:1,rectTransform:structuredClone(t)},
 {id:'b',name:'plain',kind:'button',parentId:'p',x:10,y:20,w:20,h:10},
 {id:'child',name:'child',kind:'text',parentId:'a',x:10,y:20,w:50,h:20}
]}]};}
test('anchor reparent roundtrip preserves bounds, anchor values and descendants',()=>{
 const d=design(),s=d.screens[0],before=resolveRect(s,'a',390,844),child=resolveRect(s,'child',390,844);
 moveInto(s,['a'],'',390,844);close(resolveRect(s,'a',390,844),before);close(resolveRect(s,'child',390,844),child);
 moveInto(s,['a'],'p',390,844);close(resolveRect(s,'a',390,844),before);assert.deepEqual(s.elements[1].rectTransform.min,t.min);
});
test('anchor manual px/percent edits update actual position and size',()=>{
 const d=design(),s=d.screens[0],e=s.elements[1];
 transformValue(s,e,'x',24,'px',390,844);assert.equal(resolveRect(s,'a',390,844).x,63);
 transformValue(s,e,'w',50,'%',390,844);assert.equal(resolveRect(s,'a',390,844).w,156);
 transformValue(s,e,'y',10,'%',390,844);assert.ok(Math.abs(resolveRect(s,'a',390,844).y-143.48)<1e-8);
});
test('group/ungroup mixed anchor and percent siblings preserve geometry',()=>{
 const d=design(),s=d.screens[0],ids=['a','b','child'],before=ids.map(id=>resolveRect(s,id,390,844));
 groupSelection(d,'s',['a','b'],'g',390,844);ids.forEach((id,i)=>close(resolveRect(s,id,390,844),before[i]));
 ungroupSelection(d,'s',['g'],390,844);ids.forEach((id,i)=>close(resolveRect(s,id,390,844),before[i]));assert.ok(s.elements.find(e=>e.id==='a').rectTransform);
});
test('copy normalizes selected anchor root but preserves anchored descendants',()=>{
 const d=design(),s=d.screens[0];let n=0;const before=resolveRect(s,'a',390,844);
 const clip=copySelection(d,'s',['a'],390,844);assert.equal(clip.elements[0].rectTransform,undefined);
 const [id]=pasteSelection(d,'s',clip,()=>`copy-${++n}`,0);close(resolveRect(s,id,390,844),before);
 const tree=copySelection(d,'s',['p'],390,844);assert.ok(tree.elements.find(e=>e.id==='a').rectTransform);
});

import {transformDisplayValue} from '../../src/tools/uxStudio/layers.mjs';
test('property values use resolved local anchor bounds and roundtrip edited units',()=>{
 const d=design(),s=d.screens[0],e=s.elements[1];
 assert.equal(transformDisplayValue(s,e,'x','px',390,844),200);
 assert.ok(Math.abs(transformDisplayValue(s,e,'y','px',390,844)-18)<1e-8);
 assert.equal(transformDisplayValue(s,e,'w','px',390,844),100);
 transformValue(s,e,'x',210,'px',390,844);
 assert.equal(transformDisplayValue(s,e,'x','px',390,844),210);
 transformValue(s,e,'w',50,'%',390,844);
 assert.equal(transformDisplayValue(s,e,'w','%',390,844),50);
 assert.equal(transformDisplayValue(s,e,'w','px',390,844),156);
});
test('property values resolve inset geometry rather than stale percentage fallback',()=>{
 const s={elements:[{id:'p',x:10,y:10,w:80,h:70},{id:'i',parentId:'p',x:99,y:99,w:1,h:1,inset:[10,20,30,40]}]};
 const e=s.elements[1];
 assert.equal(transformDisplayValue(s,e,'x','px',400,800),40);
 assert.equal(transformDisplayValue(s,e,'y','px',400,800),10);
 assert.equal(transformDisplayValue(s,e,'w','px',400,800),260);
 assert.equal(transformDisplayValue(s,e,'h','px',400,800),520);
});
