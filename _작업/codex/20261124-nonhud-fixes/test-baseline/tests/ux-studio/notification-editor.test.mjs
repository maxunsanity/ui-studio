import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createNotification} from '../../src/tools/uxStudio/notification.mjs';
import {validateDocument} from '../../src/tools/uxStudio/model.mjs';
import {commitDocumentEdit} from '../../src/tools/uxStudio/history.mjs';
const source=readFileSync(new URL('../../src/tools/uxStudio/main.mjs',import.meta.url),'utf8');
const fixture=()=>({schemaVersion:3,projectId:'ux-notif-editor',revision:1,name:'Notify',entryScreen:'main',screens:[{id:'main',name:'Main',kind:'page',elements:[{id:'parent',name:'Parent',kind:'panel',x:0,y:0,w:100,h:100},{id:'badge',parentId:'parent',partRole:'badge',name:'Badge',kind:'panel',x:65,y:0,w:35,h:30,text:'NEW',fontSize:14}]}],transitions:[],fixtures:{balance:0,items:[]}});
function setup(){
 const context={doc:fixture(),undo:[],redo:[],dirty:false,status:'',mode:'edit',wheelRun:null,createNotification,validateDocument,commitDocumentEdit,esc:String,render(){}};
 context.selection=()=>context.doc.screens[0].elements[1];vm.createContext(context);
 const helpers=source.indexOf('function notificationConfig('),panels=source.indexOf('function partsPanel(',helpers);
 if(helpers>=0)vm.runInContext(source.slice(helpers,panels),context);
 const edited=source.indexOf('function edited(fn)');vm.runInContext(source.slice(edited,source.indexOf('let baselineItems',edited)),context);
 const handler=source.indexOf("    if (input.matches('[data-notification-field]'))"),end=source.indexOf("    if (input.matches('[data-shadow-field]'))",handler);
 if(handler>=0)vm.runInContext('function change(input){'+source.slice(handler,end)+'}',context);
 return context;
}
const input=(field,value,checked)=>({dataset:{notificationField:field},value,checked,matches:selector=>selector==='[data-notification-field]'});

test('badge settings appear only for a badge and reading the defaults never changes the legacy element',()=>{
 const context=setup(),before=JSON.stringify(context.doc);assert.equal(typeof context.notificationInspector,'function');
 assert.equal(context.notificationInspector(context.doc.screens[0].elements[0]),'');
 const html=context.notificationInspector(context.selection());assert.match(html,/알림 배지/);assert.match(html,/data-notification-field="value"/);assert.match(html,/disabled/);assert.equal(JSON.stringify(context.doc),before);
});

test('explicit enable and notification edits use existing dirty Undo and validation while preserving the part',()=>{
 const context=setup(),before=structuredClone(context.doc);assert.equal(typeof context.change,'function');
 context.change(input('value','5'));assert.equal(context.undo.length,0);assert.equal(context.selection().notification,undefined);
 context.change(input('enabled',undefined,true));assert.equal(context.undo.length,1);assert.equal(context.undo[0].screens[0].elements[1].notification,undefined);assert.equal(context.dirty,true);
 context.change(input('value','5'));context.change(input('valueKey','nav.buildCount'));context.change(input('mode','dot'));
 assert.equal(context.selection().notification.value,5);assert.equal(context.selection().notification.mode,'dot');assert.equal(context.selection().notification.valueKey,'nav.buildCount');
 const stable=JSON.stringify(context.doc),undos=context.undo.length;context.change(input('value','-1'));assert.equal(JSON.stringify(context.doc),stable);assert.equal(context.undo.length,undos);
 context.change(input('valueKey',''));assert.equal(context.selection().notification.valueKey,undefined);
 const stripped=structuredClone(context.doc);delete stripped.screens[0].elements[1].notification;assert.deepEqual(stripped,before);
 context.doc=context.undo[0];assert.deepEqual(context.doc,before);
});
