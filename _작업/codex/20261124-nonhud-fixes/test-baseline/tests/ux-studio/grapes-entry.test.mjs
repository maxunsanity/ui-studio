import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {applyGrapesEntry} from '../../src/tools/uxStudio/grapes-bridge.mjs';
const source=JSON.parse(readFileSync('tests/ux-studio/fixtures/lobby-v1.json','utf8'));
source.screens.push({...structuredClone(source.screens[0]),id:'entry-test-page',name:'시험 시작 페이지',elements:[]});
test('entry bridge changes only start page and preserves source',()=>{
 const before=structuredClone(source),page=source.screens.find(s=>s.kind==='page'&&s.id!==source.entryScreen);
 assert.ok(page);const result=applyGrapesEntry(source,page.id);
 assert.deepEqual(result,{...source,entryScreen:page.id});assert.deepEqual(source,before);
 assert.deepEqual(applyGrapesEntry(source,source.entryScreen),source);
});
test('entry rejects overlay, missing and invalid IDs',()=>{
 const modal=source.screens.find(s=>s.kind!=='page');assert.ok(modal);
 for(const id of [modal.id,'missing',null,42])assert.throws(()=>applyGrapesEntry(source,id));
});
