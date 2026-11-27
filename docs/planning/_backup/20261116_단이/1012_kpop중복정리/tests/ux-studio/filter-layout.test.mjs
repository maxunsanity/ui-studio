import test from 'node:test';
import assert from 'node:assert/strict';
import {filteredRowY} from '../../src/tools/uxStudio/model.mjs';
test('filtered rows stack actual mixed heights within their own parent without mutating layout',()=>{
 const s={elements:[{id:'p',x:0,y:0,w:100,h:50},
 {id:'a',parentId:'p',itemId:'a',x:0,y:0,w:10,h:1,rectTransform:{min:[0,1],max:[0,1],pivot:[0,1],position:[0,0],sizeDelta:[100,40]}},
 {id:'b',parentId:'p',itemId:'b',x:0,y:80,w:10,h:1,inset:[0,0,300,0]},
 {id:'other',itemId:'o',x:0,y:0,w:10,h:10},
 {id:'c',parentId:'p',itemId:'c',x:0,y:90,w:10,h:20}]};
 const items=['a','b','c','o'].map(id=>({id,category:'one'})), before=JSON.stringify(s);
 assert.equal(filteredRowY(s,s.elements[1],items,'one',400,800),2);
 assert.equal(filteredRowY(s,s.elements[2],items,'one',400,800),15);
 assert.equal(filteredRowY(s,s.elements[4],items,'one',400,800),43);
 assert.equal(filteredRowY(s,s.elements[3],items,'one',400,800),2);
 for(const e of s.elements)assert.equal(filteredRowY(s,e,items,'all',400,800),undefined);
 assert.equal(filteredRowY(s,s.elements[1],items,'missing',400,800),undefined);
 assert.equal(JSON.stringify(s),before);
});
test('uniform percent rows retain existing 2 percent origin and 3 percent gap',()=>{
 const s={elements:['a','b','c'].map(id=>({id,itemId:id,x:0,y:0,w:10,h:10}))};
 const items=s.elements.map(e=>({id:e.id,category:'one'}));
 assert.deepEqual(s.elements.map(e=>filteredRowY(s,e,items,'one',390,844)),[2,15,28]);
});
