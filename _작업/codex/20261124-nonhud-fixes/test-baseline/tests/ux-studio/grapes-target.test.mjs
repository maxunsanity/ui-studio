import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as bridge from '../../src/tools/uxStudio/grapes-bridge.mjs';
const source=JSON.parse(readFileSync('tests/ux-studio/fixtures/lobby-v1.json','utf8'));
test('destination edit changes only the selected connection and preserves source',()=>{
 assert.equal(typeof bridge.applyGrapesTargets,'function');
 const d=structuredClone(source), s=d.screens[0];
 d.screens.push({...structuredClone(s),id:'another-page',elements:[]});
 d.transitions=[{id:'target-test',fromScreen:s.id,fromElement:s.elements[0].id,event:'click',action:'navigate',condition:'always',targetScreen:s.id,payload:{value:'keep'},label:'keep',returnPolicy:'keep'}];
 const expected=structuredClone(d);expected.transitions[0].targetScreen='another-page';
 assert.deepEqual(bridge.applyGrapesTargets(d,[{id:'target-test',targetScreen:'another-page'}]),expected);
 assert.equal(d.transitions[0].targetScreen,s.id);
 assert.deepEqual(bridge.applyGrapesTargets(d,[]),d);
});
test('destination editor rejects missing connections, invalid kinds and non-target actions',()=>{
 assert.equal(typeof bridge.applyGrapesTargets,'function');
 const d=structuredClone(source),s=d.screens[0];d.screens.push({id:'popup',name:'Popup',kind:'modal',elements:[]});
 d.transitions=[{id:'target-test',fromScreen:s.id,fromElement:s.elements[0].id,event:'click',action:'navigate',condition:'always',targetScreen:s.id}];
 for(const edits of [[{id:'absent',targetScreen:s.id}],[{id:'target-test',targetScreen:'absent'}],[{id:'target-test',targetScreen:'popup'}],[{id:'target-test',targetScreen:s.id},{id:'target-test',targetScreen:s.id}]])assert.throws(()=>bridge.applyGrapesTargets(d,edits));
 d.transitions[0].action='open';d.transitions[0].targetScreen='popup';assert.throws(()=>bridge.applyGrapesTargets(d,[{id:'target-test',targetScreen:s.id}]));
 assert.equal(bridge.applyGrapesTargets(d,[{id:'target-test',targetScreen:'popup'}]).transitions[0].targetScreen,'popup');
 d.transitions[0].action='back';assert.throws(()=>bridge.applyGrapesTargets(d,[{id:'target-test',targetScreen:s.id}]));
});
