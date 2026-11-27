import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {applyGrapesEdits} from '../../src/tools/uxStudio/grapes-bridge.mjs';
const source=JSON.parse(readFileSync('tests/ux-studio/fixtures/lobby-v1.json','utf8'));
const screen=source.screens[0];
const edits=()=>screen.elements.map(e=>({id:e.id,parentId:e.parentId||null,name:e.name,text:e.text||''}));
test('description changes preserve display text, actions, geometry and source',()=>{
 const before=structuredClone(source),list=edits();list[0].purpose='이 버튼의 역할';list[0].info='표시할 정보\n추가 설명';
 const result=applyGrapesEdits(source,screen.id,list),expected=structuredClone(source);
 expected.screens[0].elements[0].purpose=list[0].purpose;expected.screens[0].elements[0].info=list[0].info;
 assert.deepEqual(result,expected);assert.deepEqual(source,before);
 list[0].purpose='';assert.equal(applyGrapesEdits(source,screen.id,list).screens[0].elements[0].purpose,'');
});
test('missing description edits preserve original and invalid values reject',()=>{
 assert.deepEqual(applyGrapesEdits(source,screen.id,edits()),source);
 for(const key of ['purpose','info'])for(const value of [42,null,'x'.repeat(10001)]){const list=edits();list[0][key]=value;assert.throws(()=>applyGrapesEdits(source,screen.id,list));}
});
