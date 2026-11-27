import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {nudgeGrapesRect,applyGrapesEdits,restoreGrapesSvg,grapesStageKey,validateGrapesStage} from '../../src/tools/uxStudio/grapes-bridge.mjs';
const source=JSON.parse(await readFile('tests/ux-studio/fixtures/lobby-v1.json','utf8'));
const screen=source.screens[0];
const edits=()=>screen.elements.map(e=>({id:e.id,parentId:e.parentId||null,name:e.name,text:e.text||''}));
test('identity bridge preserves complete original design including absent fields',()=>{assert.deepEqual(applyGrapesEdits(source,screen.id,edits()),source);});
test('name/text edits preserve IDs, images, transitions and source without mutation',()=>{
 const before=structuredClone(source),changes=edits();changes[0].name='edited';changes[0].text='<safe text>';
 const result=applyGrapesEdits(source,screen.id,changes),expected=structuredClone(source);expected.screens[0].elements[0].name='edited';expected.screens[0].elements[0].text='<safe text>';
 assert.deepEqual(result,expected);assert.deepEqual(source,before);
});
test('missing, duplicate, changed parent and invalid text reject instead of losing fields',()=>{
 for(const change of [a=>a.pop(),a=>a[1]=a[0],a=>a[0].parentId='unknown',a=>a[0].text=42,a=>a[0].text='x'.repeat(10001)]){
 const list=edits();change(list);assert.throws(()=>applyGrapesEdits(source,screen.id,list));}
});

test('percent geometry changes preserve other fields and reject invalid sizes',()=>{
 const a=edits();a[0].rect={x:5,y:6,w:20,h:10};const result=applyGrapesEdits(source,screen.id,a);
 for(const k of ['x','y','w','h'])assert.equal(result.screens[0].elements[0][k],a[0].rect[k]);
 for(const w of [0,-1,Infinity,NaN]){a[0].rect.w=w;assert.throws(()=>applyGrapesEdits(source,screen.id,a));}
});
test('constraint geometry cannot silently become percent layout',()=>{
 const d=structuredClone(source);d.screens[0].elements[0].inset=[1,2,3,4];const a=edits();a[0].rect={x:5,y:6,w:20,h:10};assert.throws(()=>applyGrapesEdits(d,screen.id,a),/여백/);
});

test('legacy SVG restoration preserves saved data and is idempotent',()=>{
 const project={pages:[{frames:[{component:{tagName:'div',uxId:'parent',components:[{tagName:'svg',type:'svg',components:[{tagName:'rect',type:'default',attributes:{fill:'#f4edcc'}}]},{tagName:'div',type:'default',uxText:'12345',uxW:20}]}}]}]};
 const before=structuredClone(project),result=restoreGrapesSvg(project);
 assert.equal(result.pages[0].frames[0].component.components[0].components[0].type,'svg-in');
 assert.deepEqual(result.pages[0].frames[0].component.components[1],before.pages[0].frames[0].component.components[1]);
 assert.deepEqual(project,before);assert.deepEqual(restoreGrapesSvg(result),result);
});
test('SVG foreignObject HTML descendants keep HTML types',()=>{
 const project={pages:[{frames:[{component:{tagName:'svg',components:[{tagName:'foreignObject',type:'default',components:[{tagName:'div',type:'default'}]}]}}]}]};
 const c=restoreGrapesSvg(project).pages[0].frames[0].component.components[0];
 assert.equal(c.type,'svg-in');assert.equal(c.components[0].type,'default');
});

test('stage storage separates projects and revisions and rejects mismatched sources',()=>{
 const other={...source,projectId:'other'},next={...source,revision:source.revision+1};
 assert.notEqual(grapesStageKey(source,'W'),grapesStageKey(other,'W'));
 assert.notEqual(grapesStageKey(source,'W'),grapesStageKey(next,'W'));
 assert.notEqual(grapesStageKey(source,'W'),grapesStageKey(source,'P'));
 const saved={source:structuredClone(source),project:{pages:[]}};
 assert.deepEqual(validateGrapesStage(saved,source),{pages:[]});
 assert.throws(()=>validateGrapesStage(saved,other));
 assert.throws(()=>validateGrapesStage(saved,next));
 assert.throws(()=>grapesStageKey(source,'unknown'));
 assert.throws(()=>validateGrapesStage({...saved,project:{}},source));
});

test('nudge keeps percent geometry precise and immutable; rejects constraints and invalid sizes',()=>{
 const e={x:1,y:2,w:10,h:20},before=structuredClone(e);
 assert.deepEqual(nudgeGrapesRect(e,e,'x',0.1),{...e,x:1.1});assert.deepEqual(e,before);
 assert.deepEqual(nudgeGrapesRect(e,e,'h',5),{...e,h:25});
 for(const [original,axis,delta] of [[{...e,inset:[0,0,0,0]},'x',1],[{...e,rectTransform:{}},'x',1],[e,'w',-10],[e,'x',Infinity],[e,'z',1],[e,'x',10000]])assert.throws(()=>nudgeGrapesRect(original,e,axis,delta));
});
