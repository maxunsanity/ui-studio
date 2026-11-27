import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {validateDocument} from '../../src/tools/uxStudio/model.mjs';
import {commitDocumentEdit} from '../../src/tools/uxStudio/history.mjs';

const source=await readFile('src/tools/uxStudio/main.mjs','utf8');
function setup(){
 const doc={schemaVersion:3,projectId:'shadow-editor',revision:0,name:'Shadow',entryScreen:'main',screens:[{id:'main',name:'Main',kind:'page',elements:[
  {id:'root',name:'Root',kind:'panel',component:'image-frame',x:0,y:0,w:100,h:100},
  {id:'frame',name:'Frame',parentId:'root',kind:'panel',x:0,y:0,w:100,h:100}
 ]}],transitions:[],fixtures:{balance:0,items:[]}};
 const ctx={doc,selectedScreen:'main',selectedElement:'frame',mode:'edit',undo:[],redo:[],dirty:false,wheelRun:null,status:'',render(){},esc:String,validateDocument,commitDocumentEdit};
 ctx.selection=()=>ctx.doc.screens[0].elements.find(e=>e.id===ctx.selectedElement);
 vm.createContext(ctx);
 const helper=source.indexOf('function shadowConfig(');if(helper>=0)vm.runInContext(source.slice(helper,source.indexOf('function partsPanel(',helper)),ctx);
 const edited=source.indexOf('function edited(fn)');vm.runInContext(source.slice(edited,source.indexOf('let baselineItems',edited)),ctx);
 const start=source.indexOf('    const input = event.target;',source.indexOf("app.addEventListener('change'"));
 vm.runInContext('async function change(event){'+source.slice(start,source.indexOf("    if (input.matches('[data-asset-view]'))",start))+'}',ctx);
 ctx.apply=(key,value,checked)=>ctx.change({target:{dataset:{shadowField:key},value,checked,type:key==='enabled'?'checkbox':'number',files:[],matches:selector=>selector==='[data-shadow-field]'}});
 return ctx;
}
test('shadow controls show uncommitted view defaults without changing design data',()=>{
 const c=setup(),before=structuredClone(c.doc);
 assert.equal(typeof c.shadowInspector,'function');
 const html=c.shadowInspector(c.selection());
 assert.match(html,/그림자 효과/);
 for(const key of ['enabled','color','opacity','x','y','blur'])assert.match(html,new RegExp('data-shadow-field="'+key+'"'));
 assert.doesNotMatch(html,/type="checkbox"[^>]*checked/);assert.deepEqual(c.doc,before);
});
test('shadow checkbox edits the selected frame only and makes one Undo snapshot',async()=>{
 const c=setup(),before=structuredClone(c.doc);await c.apply('enabled','on',true);
 assert.deepEqual(JSON.parse(JSON.stringify(c.selection().effects.shadow)),{enabled:true,color:'#000000',opacity:.2,x:0,y:2,blur:2});
 assert.equal(c.doc.screens[0].elements[0].effects,undefined);assert.deepEqual(c.undo,[before]);assert.equal(c.dirty,true);
});
test('color and numeric controls save typed values while preserving geometry and other effects values',async()=>{
 const c=setup(),before=structuredClone(c.doc.screens[0].elements);
 for(const [key,value] of [['color','#6543ba'],['opacity','0.4'],['x','-4'],['y','6'],['blur','8']])await c.apply(key,value);
 assert.deepEqual(JSON.parse(JSON.stringify(c.selection().effects.shadow)),{enabled:false,color:'#6543ba',opacity:.4,x:-4,y:6,blur:8});
 const after=structuredClone(c.doc.screens[0].elements);delete after[1].effects;assert.deepEqual(after,before);assert.equal(c.undo.length,5);
});
test('empty or nonfinite shadow values and nonboolean checkbox data leave the design and history unchanged',async()=>{
 const c=setup(),before=structuredClone(c.doc);
 for(const raw of ['', ' ', 'bad','Infinity'])await c.apply('blur',raw);
 await c.apply('enabled','on','false');await c.apply('unknown','2');
 assert.deepEqual(c.doc,before);assert.equal(c.undo.length,0);assert.equal(c.dirty,false);assert.match(c.status,/변경하지 못했습니다/);
});
test('play mode cannot write a selected part shadow',async()=>{
 const c=setup(),before=structuredClone(c.doc);c.mode='play';await c.apply('enabled','on',true);
 assert.deepEqual(c.doc,before);assert.equal(c.undo.length,0);assert.equal(c.dirty,false);
});
test('model shadow validation rolls back out-of-range or malformed editor values before Undo',async()=>{
 for(const [key,value] of [['color','#bad'],['opacity','1.1'],['x','-97'],['y','97'],['blur','-1']]){
  const c=setup(),before=structuredClone(c.doc);await c.apply(key,value);
  assert.deepEqual(c.doc,before);assert.equal(c.undo.length,0);assert.equal(c.dirty,false);assert.match(c.status,/변경하지 못했습니다/);
 }
});
