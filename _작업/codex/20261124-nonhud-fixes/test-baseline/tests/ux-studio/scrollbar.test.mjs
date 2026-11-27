import test from 'node:test';
import assert from 'node:assert/strict';
import {validateDocument,readDesignFile} from '../../src/tools/uxStudio/model.mjs';
import {responsiveStyles} from '../../src/tools/uxStudio/responsive-layout.mjs';
import {applyResponsiveEdit,responsiveInspectorHTML} from '../../src/tools/uxStudio/responsive-inspector.mjs';
const fixture=()=>({schemaVersion:4,projectId:'scrollbar',name:'Scrollbars',revision:1,entryScreen:'main',screens:[{id:'main',name:'Main',kind:'page',logicalSize:{w:551,h:984},elements:[{id:'view',name:'View',kind:'panel',x:0,y:0,w:100,h:90,overflow:'scroll-y'}]}],transitions:[],fixtures:{balance:0,items:[]}});
test('hidden browser chrome keeps scroll overflow and default remains untouched',()=>{
 const d=fixture(),s=d.screens[0],e=s.elements[0],before=structuredClone(d);
 assert.equal(responsiveStyles(s,e).scrollbarWidth,undefined);
 e.scrollbar='hidden';assert.deepEqual(responsiveStyles(s,e),{overflowX:'hidden',overflowY:'auto',scrollbarWidth:'none'});
 assert.doesNotThrow(()=>validateDocument(d));delete e.scrollbar;assert.deepEqual(d,before);
});
test('saved optional scrollbar value is validated and requires v4',async()=>{
 const d=fixture();d.screens[0].elements[0].scrollbar='hidden';
 const text=JSON.stringify(d),loaded=await readDesignFile({size:Buffer.byteLength(text),text:async()=>text});assert.equal(loaded.screens[0].elements[0].scrollbar,'hidden');
 for(const value of [null,false,{},'none','visible',1]){const bad=structuredClone(d);bad.screens[0].elements[0].scrollbar=value;assert.throws(()=>validateDocument(bad));}
 const old=structuredClone(d);old.schemaVersion=3;delete old.screens[0].elements[0].overflow;assert.throws(()=>validateDocument(old),/버전 4/);
});
test('native inspector enables and removes browser chrome on immutable copies, no-op default keeps legacy version',()=>{
 const d=fixture(),before=structuredClone(d),size={w:551,h:984};
 const hidden=applyResponsiveEdit(d,'main','view','scrollbar','hidden',size);assert.equal(hidden.screens[0].elements[0].scrollbar,'hidden');assert.deepEqual(d,before);
 const off=applyResponsiveEdit(hidden,'main','view','scrollbar','default',size);assert.deepEqual(off,d);
 assert.throws(()=>applyResponsiveEdit(d,'main','view','scrollbar','wat',size));
 const old=structuredClone(d);old.schemaVersion=3;delete old.screens[0].elements[0].overflow;
 assert.deepEqual(applyResponsiveEdit(old,'main','view','scrollbar','default',size),old);
 const html=responsiveInspectorHTML(hidden.screens[0],hidden.screens[0].elements[0]);assert.match(html,/data-responsive-field="scrollbar"/);assert.match(html,/숨김 · 스크롤 유지/);
});
