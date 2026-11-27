import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {applyCanvasPositions,restoreGrapesSvg} from '../../src/tools/uxStudio/grapes-bridge.mjs';
const source=JSON.parse(await readFile('tests/ux-studio/fixtures/lobby-v1.json','utf8'));
const positions=()=>source.screens.map((s,i)=>({id:s.id,x:i*450+24,y:40}));
test('canvas identity preserves absent metadata, moves only selected screen, saves roundtrip',()=>{
 assert.deepEqual(applyCanvasPositions(source,positions()),source);const p=positions();p[1].x=24;p[1].y=940;
 const result=applyCanvasPositions(source,p),expected=structuredClone(source);expected.screens[1].canvasPosition={x:24,y:940};assert.deepEqual(result,expected);assert.equal(source.screens[1].canvasPosition,undefined);
 assert.deepEqual(applyCanvasPositions(JSON.parse(JSON.stringify(result)),p),result);
});
test('invalid/missing/duplicate canvas coordinates reject',()=>{
 for(const n of [-1,Infinity,NaN,10001]){const p=positions();p[0].x=n;assert.throws(()=>applyCanvasPositions(source,p));}
 assert.throws(()=>applyCanvasPositions(source,[]));const p=positions();p[1]=p[0];assert.throws(()=>applyCanvasPositions(source,p));
});
test('legacy board stages regain board model without changing persisted object',()=>{
 const data={pages:[{frames:[{component:{uxBoard:'one',tagName:'section',style:{left:'24px'}}}]}]};const restored=restoreGrapesSvg(data);assert.equal(restored.pages[0].frames[0].component.type,'ux-board');assert.equal(data.pages[0].frames[0].component.type,undefined);
});
