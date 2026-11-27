import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {applyGrapesScreenDescription} from '../../src/tools/uxStudio/grapes-bridge.mjs';
const source=JSON.parse(readFileSync('tests/ux-studio/fixtures/lobby-v1.json','utf8'));
test('screen description preserves components, connections and source',()=>{
 const before=structuredClone(source),id=source.screens[0].id,expected=structuredClone(source);
 expected.screens[0].purpose='화면 역할\n진입 조건';assert.deepEqual(applyGrapesScreenDescription(source,id,expected.screens[0].purpose),expected);assert.deepEqual(source,before);
 expected.screens[0].purpose='';assert.deepEqual(applyGrapesScreenDescription(source,id,''),expected);
 const absent=structuredClone(source);delete absent.screens[0].purpose;assert.deepEqual(applyGrapesScreenDescription(absent,id,''),absent);
});
test('unknown screen and malformed descriptions reject',()=>{
 assert.throws(()=>applyGrapesScreenDescription(source,'missing','text'));
 for(const text of [null,42,'x'.repeat(10001)])assert.throws(()=>applyGrapesScreenDescription(source,source.screens[0].id,text));
});
