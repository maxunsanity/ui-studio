import test from 'node:test';
import assert from 'node:assert/strict';
import {controlContainerIds} from '../../src/tools/uxStudio/controls.mjs';
import {audit} from '../../src/tools/uxStudio/model.mjs';
test('native control containers include every button ancestor without capturing siblings',()=>{
 const screen={elements:[{id:'outer',kind:'button'},{id:'inner',kind:'button',parentId:'outer'},{id:'input',parentId:'inner',control:{type:'input',value:''}},{id:'sibling'}]};
 assert.deepEqual([...controlContainerIds(screen)].sort(),['inner','input','outer']);
});
test('a real control is an intentional action without a click transition',()=>{
 const d={entryScreen:'main',screens:[{id:'main',name:'Main',kind:'page',elements:[{id:'toggle',name:'Toggle',kind:'button',control:{type:'toggle',value:false}}]}],transitions:[]};
 assert.equal(audit(d).some(x=>x.element==='toggle'),false);
});
