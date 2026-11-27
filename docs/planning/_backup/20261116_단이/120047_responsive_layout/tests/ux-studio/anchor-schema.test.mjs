import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateAnchorDraft,validateDocument,resolveRect} from '../../src/tools/uxStudio/model.mjs';
const sample=JSON.parse(await readFile('src/tools/uxStudio/sample.json','utf8'));
function fixture(){const d=structuredClone(sample);d.schemaVersion=4;const s=d.screens[0],e=s.elements[0];delete e.inset;e.rectTransform={min:[0,1],max:[1,1],pivot:[.5,1],position:[0,-10],sizeDelta:[-20,40]};const sizes=Object.fromEntries(d.screens.map(s=>[s.id,{w:390,h:844}]));return {d,s,e,sizes};}
test('draft validates without mutation and preserves anchor geometry through JSON roundtrip',()=>{
 const {d,s,e,sizes}=fixture(),before=structuredClone(d);assert.equal(validateAnchorDraft(d,sizes),d);assert.deepEqual(d,before);
 const copy=JSON.parse(JSON.stringify(d));validateAnchorDraft(copy,sizes);assert.deepEqual(resolveRect(copy.screens[0],e.id,390,844),resolveRect(s,e.id,390,844));assert.throws(()=>validateDocument(copy),/버전/);
});
test('draft rejects nonfinite values, invalid anchors and conflicting inset',()=>{
 for(const change of [e=>e.rectTransform.position[0]=Infinity,e=>e.rectTransform.pivot[0]=-1,e=>e.rectTransform.min[0]=2,e=>e.inset=[0,0,0,0],e=>e.rectTransform=null]){
 const {d,e,sizes}=fixture();change(e);assert.throws(()=>validateAnchorDraft(d,sizes));}
});
test('draft requires explicit root sizes and detects negative stretched size at actual viewport',()=>{
 const {d,e,sizes,s}=fixture();assert.throws(()=>validateAnchorDraft(d,{}),/크기/);
 sizes[s.id].w=10;assert.throws(()=>validateAnchorDraft(d,sizes),/양수/);
 sizes[s.id].w=NaN;assert.throws(()=>validateAnchorDraft(d,sizes),/크기/);
});
test('draft retains common hierarchy validation and rejects missing or cyclic parents',()=>{
 for(const parent of ['missing',null]){const {d,e,sizes}=fixture();e.parentId=parent||e.id;assert.throws(()=>validateAnchorDraft(d,sizes),/부모/);}
});
