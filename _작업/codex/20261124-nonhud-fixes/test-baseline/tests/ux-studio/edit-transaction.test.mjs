import test from 'node:test';
import assert from 'node:assert/strict';
import {commitDocumentEdit, HISTORY_LIMIT} from '../../src/tools/uxStudio/history.mjs';
function setup(){let doc={elements:[{id:'a',text:'before'}]};const undo=[],redo=[{redo:true}];return {read:()=>doc,write:d=>{doc=d;},undo,redo,run(fn){commitDocumentEdit(this.read,this.write,fn,undo,redo);}};}
test('captured element mutation commits one independent undo snapshot',()=>{
 const s=setup(),e=s.read().elements[0];s.run(()=>{e.text='after';});
 assert.equal(s.read().elements[0],e);assert.equal(s.undo.length,1);assert.equal(s.undo[0].elements[0].text,'before');assert.deepEqual(s.redo,[]);
 e.text='later';assert.equal(s.undo[0].elements[0].text,'before');
});
test('failed partial mutation preserves document and full undo/redo history',()=>{
 const s=setup();for(let i=0;i<HISTORY_LIMIT;i++)s.undo.push({i});
 const before=structuredClone(s.read()),undo=structuredClone(s.undo),redo=structuredClone(s.redo);
 const error=new Error('invalid anchor');assert.throws(()=>s.run(()=>{s.read().elements[0].text='partial';s.read().extra=true;throw error;}),e=>e===error);
 assert.deepEqual(s.read(),before);assert.deepEqual(s.undo,undo);assert.deepEqual(s.redo,redo);
});
test('whole document replacement commits and can restore original snapshot',()=>{
 const s=setup();s.run(()=>s.write({elements:[],schemaVersion:3}));
 assert.deepEqual(s.read(),{elements:[],schemaVersion:3});s.write(s.undo.pop());assert.equal(s.read().elements[0].text,'before');
});
test('failed replacement restores document without destroying redo',()=>{
 const s=setup();assert.throws(()=>s.run(()=>{s.write({elements:[]});throw new Error('validation');}));
 assert.equal(s.read().elements[0].text,'before');assert.deepEqual(s.undo,[]);assert.deepEqual(s.redo,[{redo:true}]);
});
