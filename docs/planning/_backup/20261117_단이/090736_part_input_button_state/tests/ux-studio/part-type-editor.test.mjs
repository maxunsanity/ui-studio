import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {validateDocument,screenById,createRuntime,activate} from '../../src/tools/uxStudio/model.mjs';
import {pushSnapshot,commitDocumentEdit} from '../../src/tools/uxStudio/history.mjs';
import {inputMode} from '../../src/tools/uxStudio/parts.mjs';
const source=readFileSync('src/tools/uxStudio/main.mjs','utf8');
const id='element-cc087ad4-f830-4fb8-85bb-1c71c9996f7e-label';
function setup(part={}) {
 const c={doc:{schemaVersion:3,projectId:'part-type-editor',revision:76,name:'Role conversion',entryScreen:'main',screens:[{id:'main',name:'Main',kind:'page',elements:[{id:'roll',name:'Roll',kind:'button',component:'image-frame',partRole:'container',x:10,y:70,w:40,h:25},{id,parentId:'roll',name:'Txt_Roll_GO',kind:'image',partRole:'image',x:27,y:26,w:45,h:28,text:'GO',image:{src:'data:image/png;base64,AAAA',alt:'Old GO image',fit:'contain'},typography:{weight:700},interaction:{mode:'parent',enabled:true,shape:'rectangle',reason:''},...part}]}],transitions:[{id:'roll-action',fromScreen:'main',fromElement:'roll',event:'click',action:'feedback',condition:'always',payload:{message:'Roll retained'}}],fixtures:{balance:0,items:[]}},selectedScreen:'main',expectedRevision:76,undo:[],redo:[],dirty:false,wheelRun:null,status:'',clone:structuredClone,screenById,pushSnapshot,commitDocumentEdit,validateDocument,inputMode,render(){},notify(){}};
 c.selection=()=>c.doc.screens[0].elements.find(e=>e.id===id);vm.createContext(c);
 let start=source.indexOf('function checkpoint(');vm.runInContext(source.slice(start,source.indexOf('let baselineItems',start)),c);
 start=source.indexOf('function changePartType(');if(start>=0)vm.runInContext(source.slice(start,source.indexOf('function partsPanel(',start)),c);
 start=source.indexOf("    if (input.matches('[data-part-field]')) {");vm.runInContext('function partChange(input){'+source.slice(start,source.indexOf("    if (input.matches('[data-transform-unit]'))",start))+'}',c);
 start=source.indexOf("    if (input.matches('[data-field]')) {");vm.runInContext('function kindChange(input){'+source.slice(start,source.indexOf("    if (input.matches('[data-edge-field]'))",start))+'}',c);
 start=source.indexOf("        case 'image-clear':");vm.runInContext('function clearImage(){switch("image-clear"){'+source.slice(start,source.indexOf("        case 'wireframe-style':",start))+'}}',c);
 start=source.indexOf("        case 'undo':");vm.runInContext('function history(action){switch(action){'+source.slice(start,source.indexOf("        case 'grid':",start))+'}}',c);
 c.apply=(field,value)=>c[field==='kind'?'kindChange':'partChange']({dataset:field==='kind'?{field}:{partField:field},value,type:'select-one',matches:s=>s===(field==='kind'?'[data-field]':'[data-part-field]')});validateDocument(c.doc);return c;
}
for(const field of ['partRole','kind'])test(`${field} image-to-text conversion clears image data and preserves identity, layout, action and Undo`,()=>{
 const c=setup();c.clearImage();assert.equal(c.selection().image.src,'');const before=structuredClone(c.doc),wanted={...structuredClone(c.selection()),kind:'text',partRole:'label'};delete wanted.image;
 c.apply(field,field==='kind'?'text':'label');assert.equal(c.selection().kind,'text');assert.equal(c.selection().partRole,'label');assert.equal(c.selection().image,undefined);assert.deepEqual(c.selection(),wanted);assert.deepEqual(c.doc.transitions,before.transitions);assert.equal(c.undo.length,2);assert.equal(c.dirty,true);validateDocument(c.doc);
 assert.equal(activate(c.doc,createRuntime(c.doc),'main',id).message,'Roll retained');const converted=structuredClone(c.doc);c.history('undo');assert.deepEqual(c.doc,before);c.history('redo');assert.deepEqual(c.doc,converted);
});
test('direct kind-to-text conversion removes an existing source so the real image renderer removes prior art',()=>{
 const c=setup();c.apply('kind','text');assert.equal(c.selection().image,undefined);
 const layout=readFileSync('src/tools/uxStudio/layout-view.mjs','utf8'),start=layout.indexOf('function renderImagePart('),end=layout.indexOf('\nfunction ',start+1);let removed=false,added=false;
 const ctx={document:{createElement(){throw Error('Text conversion must not create image or placeholder content');}}};vm.createContext(ctx);vm.runInContext(layout.slice(start,end<0?undefined:end),ctx);ctx.renderImagePart({querySelector:()=>({remove(){removed=true;}}),append(){added=true;}},c.selection(),'art',false);assert.equal(removed,true);assert.equal(added,false);
});
for(const field of ['partRole','kind'])test(`${field} text-to-image conversion synchronizes the role without changing native text`,()=>{
 const c=setup({kind:'text',partRole:'label',image:undefined});c.apply(field,'image');assert.equal(c.selection().kind,'image');assert.equal(c.selection().partRole,'image');assert.equal(c.selection().text,'GO');assert.equal(c.selection().parentId,'roll');validateDocument(c.doc);assert.equal(c.undo.length,1);
});
test('background/frame roles use panel kind and container role changes retain image content',()=>{
 for(const role of ['background','frame']){const c=setup(),image=structuredClone(c.selection().image);c.apply('partRole',role);assert.equal(c.selection().kind,'panel');assert.equal(c.selection().partRole,role);assert.deepEqual(c.selection().image,image);validateDocument(c.doc);}
 const c=setup(),image=structuredClone(c.selection().image);c.apply('partRole','container');assert.equal(c.selection().kind,'image');assert.deepEqual(c.selection().image,image);
 const label=setup({kind:'text',partRole:'label',image:undefined});label.apply('kind','panel');assert.equal(label.selection().partRole,'container');validateDocument(label.doc);
});
test('compound roots remain protected from image/text conversion without deleting their structure',()=>{
 for(const field of ['kind','partRole']){const c=setup();c.selection=()=>c.doc.screens[0].elements[0];const before=structuredClone(c.doc);c.apply(field,field==='kind'?'text':'label');assert.deepEqual(c.doc,before);assert.equal(c.undo.length,0);}
});
