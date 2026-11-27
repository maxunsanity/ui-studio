import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
test('selected part, board and nested decoration synchronize screen without changing design',()=>{
 const text=readFileSync(new URL('../../src/tools/uxStudio/grapes-pilot.mjs',import.meta.url),'utf8');
 const start=text.indexOf(" editor.on('component:selected'");
 const code=text.slice(start,text.indexOf(" document.querySelector('#board-place')",start));
 let select,updates=0;const picker={value:'lobby'};
 vm.runInNewContext(code,{editor:{on:(_name,cb)=>select=cb},source:{screens:[{id:'lobby'},{id:'shop'}]},screenPicker:picker,boardFields:()=>updates++});
 const node=(props,parent=null)=>({get:key=>props[key],parent:()=>parent});
 select(node({uxScreen:'shop'}));assert.equal(picker.value,'shop');
 select(node({},node({uxBoard:'lobby'})));assert.equal(picker.value,'lobby');
 select(node({uxBoard:'shop'}));assert.equal(picker.value,'shop');
 select(node({uxScreen:'unknown'}));select(null);assert.equal(updates,3);assert.equal(picker.value,'shop');
});
