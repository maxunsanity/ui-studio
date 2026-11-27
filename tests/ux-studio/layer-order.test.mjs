import test from 'node:test';
import assert from 'node:assert/strict';
import * as layers from '../../src/tools/uxStudio/layers.mjs';
test('sibling paint order changes without changing any geometry, ID or child hierarchy',()=>{
 const s={elements:[{id:'child',parentId:'hud',x:1,y:2,w:3,h:4},{id:'hud',x:5,y:6,w:90,h:10},{id:'background',x:0,y:0,w:100,h:100}]};
 const before=new Map(s.elements.map(e=>[e.id,JSON.stringify(e)]));
 layers.reorderSiblings(s,['background'],'back');
 assert.deepEqual(s.elements.filter(e=>!e.parentId).map(e=>e.id),['background','hud']);
 assert.equal(s.elements[0].id,'child');
 for(const e of s.elements)assert.equal(JSON.stringify(e),before.get(e.id));
 layers.reorderSiblings(s,['background'],'front');
 assert.deepEqual(s.elements.filter(e=>!e.parentId).map(e=>e.id),['hud','background']);
});
test('mixed-parent and unknown selection is rejected without partially changing order',()=>{
 const s={elements:[{id:'a'},{id:'child',parentId:'a'},{id:'b'}]},before=JSON.stringify(s);
 assert.throws(()=>layers.reorderSiblings(s,['a','child'],'back'),/부모|parent/);
 assert.equal(JSON.stringify(s),before);
 assert.throws(()=>layers.reorderSiblings(s,['missing'],'back'),/부품|layer/);
 assert.equal(JSON.stringify(s),before);
});

test('paint-order commands cannot silently rearrange auto-layout children',()=>{
 const s={elements:[{id:'row',kind:'panel',layout:{type:'horizontal',gap:10,padding:[0,0,0,0],itemSize:[40,40]}},{id:'a',parentId:'row'},{id:'b',parentId:'row'}]},before=JSON.stringify(s);
 assert.throws(()=>layers.reorderSiblings(s,['a'],'front'),/자동/);
 assert.equal(JSON.stringify(s),before);
});
