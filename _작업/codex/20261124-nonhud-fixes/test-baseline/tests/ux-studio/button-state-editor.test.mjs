import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createButtonState,buttonStateOwner,buttonMotionTargets,BUTTON_STATES} from '../../src/tools/uxStudio/button-state.mjs';
import {validateDocument,screenById} from '../../src/tools/uxStudio/model.mjs';
import {commitDocumentEdit} from '../../src/tools/uxStudio/history.mjs';
const source=readFileSync('src/tools/uxStudio/main.mjs','utf8');
function fixture(){
 const doc={schemaVersion:3,projectId:'ux-button-editor',revision:1,name:'Buttons',entryScreen:'main',screens:[{id:'main',name:'Main',kind:'page',elements:[{id:'button',name:'Button',kind:'button',component:'image-frame',x:0,y:0,w:80,h:80},{id:'image',name:'Image',parentId:'button',kind:'image',x:0,y:0,w:64,h:64,interaction:{mode:'parent',enabled:true,shape:'rectangle',reason:''}},{id:'label',name:'Label',parentId:'button',kind:'text',x:0,y:80,w:100,h:20,text:'Keep label'}]}],transitions:[],fixtures:{balance:0,items:[]}};
 const c={doc,selectedScreen:'main',selectedElement:'button',mode:'edit',undo:[],redo:[],dirty:false,status:'',buttonPreview:'normal',workspaceId:'ws-button',screenById,createButtonState,buttonStateOwner,buttonMotionTargets,BUTTON_STATES,validateDocument,commitDocumentEdit,esc:String,render(){},notify(){}};
 c.selection=()=>c.doc.screens[0].elements.find(e=>e.id===c.selectedElement);vm.createContext(c);
 const edited=source.indexOf('function edited(fn)');vm.runInContext(source.slice(edited,source.indexOf('let baselineItems',edited)),c);
 const helper=source.indexOf('function buttonStateInspector(');vm.runInContext(source.slice(helper,source.indexOf('function partsPanel(',helper)),c);
 const start=source.indexOf("    if (input.matches('[data-button-preview]'))"),end=source.indexOf("    if (input.matches('[data-notification-field]'))",start);vm.runInContext('async function change(input){'+source.slice(start,end)+'}',c);
 c.changeField=(key,value,checked)=>c.change({dataset:{buttonField:key},value,checked,matches:selector=>selector==='[data-button-field]'});
 return c;
}
test('button inspector offers both modes and only actual descendant images without editing defaults',()=>{
 const c=fixture(),before=structuredClone(c.doc),html=c.buttonStateInspector(c.doc.screens[0],c.selection());
 for(const label of ['버튼 상태 효과','기본 색 변화','상태별 이미지','버튼 전체','이미지 · Image','처음 선택됨'])assert.ok(html.includes(label));
 assert.doesNotMatch(html.match(/<select data-button-field="targetGraphic"[^>]*>(.*?)<\/select>/)[1],/<option value="label"/);assert.deepEqual(c.doc,before);
});
test('explicit configuration edits keep dirty, one-step Undo, source geometry and validation rollback',async()=>{
 const c=fixture(),before=structuredClone(c.doc);await c.changeField('mode','image');assert.equal(c.undo.length,0);
 await c.changeField('enabled',undefined,true);assert.equal(c.undo.length,1);assert.equal(c.dirty,true);assert.equal(c.selection().buttonState.selectable,false);
 await c.changeField('targetGraphic','image');await c.changeField('mode','image');await c.changeField('selectable',undefined,true);
 const stable=JSON.stringify(c.doc),count=c.undo.length;await c.changeField('targetGraphic','label');assert.equal(JSON.stringify(c.doc),stable);assert.equal(c.undo.length,count);
 const stripped=structuredClone(c.doc);delete stripped.screens[0].elements[0].buttonState;assert.deepEqual(stripped,before);assert.deepEqual(c.undo[0],before);
});
test('view state preview stays outside Undo and a late state image never applies after selection changes',async()=>{
 const c=fixture();await c.changeField('enabled',undefined,true);await c.changeField('mode','image');const count=c.undo.length;
 await c.change({value:'pressed',matches:s=>s==='[data-button-preview]'});assert.equal(c.buttonPreview,'pressed');assert.equal(c.undo.length,count);
 c.importGuideImage=async()=>{c.selectedElement='image';return {src:'',asset:'icon',alt:'state',fit:'contain'};};
 await c.change({dataset:{buttonImage:'path'},value:'/ui-studio/source/assets/test.png',matches:s=>s==='[data-button-image]'});
 assert.equal(c.doc.screens[0].elements[0].buttonState.images,undefined);assert.equal(c.undo.length,count);
});

test('native press controls keep defaults unchanged until enabled and validate each edit through Undo',async()=>{
 const c=fixture();await c.changeField('enabled',undefined,true);await c.changeField('targetGraphic','image');
 const count=c.undo.length,original=structuredClone(c.doc);assert.ok(c.buttonStateInspector(c.doc.screens[0],c.selection()).includes('눌림 깊이'));
 await c.changeField('pressFeedback.enabled',undefined,true);assert.equal(c.undo.length,count+1);assert.equal(c.selection().buttonState.pressFeedback.target,'image');
 await c.changeField('pressFeedback.distance','4');assert.equal(c.selection().buttonState.pressFeedback.distance,4);
 await c.changeField('pressFeedback.shadow.y','1');assert.equal(c.selection().buttonState.pressFeedback.shadow.y,1);
 const stable=JSON.stringify(c.doc),n=c.undo.length;await c.changeField('pressFeedback.distance','17');assert.equal(JSON.stringify(c.doc),stable);assert.equal(c.undo.length,n);
 const stripped=structuredClone(c.doc);delete stripped.screens[0].elements[0].buttonState.pressFeedback;assert.deepEqual(stripped,original);
});
