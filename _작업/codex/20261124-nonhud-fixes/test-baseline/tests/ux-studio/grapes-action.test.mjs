import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as bridge from '../../src/tools/uxStudio/grapes-bridge.mjs';
const source=JSON.parse(readFileSync('tests/ux-studio/fixtures/lobby-v1.json','utf8'));
function fixture(){const d=structuredClone(source),s=d.screens[0];d.screens.push({id:'popup',name:'Popup',kind:'modal',elements:[]});d.transitions=[{id:'link',fromScreen:s.id,fromElement:s.elements[0].id,event:'click',action:'open',condition:'always',targetScreen:'popup',payload:{itemId:'kept'},label:'kept',returnPolicy:'kept'}];return d;}
test('four basic actions update only action and destination without mutating the source',()=>{
 assert.equal(typeof bridge.applyGrapesActions,'function');
 const d=fixture();
 for(const action of ['navigate','open','back','close']){
  const targetScreen=action==='navigate'?d.screens[0].id:'popup',expected=structuredClone(d);
  expected.transitions[0].action=action;
  if(['back','close'].includes(action))delete expected.transitions[0].targetScreen;else expected.transitions[0].targetScreen=targetScreen;
  assert.deepEqual(bridge.applyGrapesActions(d,[{id:'link',action,targetScreen}]),expected);
 }
 assert.deepEqual(d,fixture());
});
test('action editor rejects unsupported actions, duplicate edits, wrong destinations and missing links',()=>{
 assert.equal(typeof bridge.applyGrapesActions,'function');const d=fixture();
 for(const edit of [{id:'absent',action:'back'},{id:'link',action:'purchase'},{id:'link',action:'open',targetScreen:d.screens[0].id},{id:'link',action:'navigate',targetScreen:'popup'}])assert.throws(()=>bridge.applyGrapesActions(d,[edit]));
 assert.throws(()=>bridge.applyGrapesActions(d,[{id:'link',action:'back'},{id:'link',action:'close'}]));
 d.transitions[0].action='purchase';assert.throws(()=>bridge.applyGrapesActions(d,[{id:'link',action:'back'}]));
});
