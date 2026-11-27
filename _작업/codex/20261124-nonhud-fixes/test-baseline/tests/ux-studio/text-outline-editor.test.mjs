import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {validateDocument,screenById} from '../../src/tools/uxStudio/model.mjs';
import {pushSnapshot} from '../../src/tools/uxStudio/history.mjs';
const source=readFileSync('src/tools/uxStudio/main.mjs','utf8');
function fixture(){
 const c={doc:{schemaVersion:4,projectId:'outline-editor',name:'Outline',revision:1,entryScreen:'main',screens:[{id:'main',name:'Main',kind:'page',logicalSize:{w:551,h:984},elements:[{id:'title',name:'Title',kind:'text',x:0,y:0,w:50,h:20,text:'퀵 승리'}]}],transitions:[],fixtures:{balance:0,items:[]}},selectedScreen:'main',undo:[],redo:[],dirty:false,wheelRun:null,status:'',clone:structuredClone,screenById,pushSnapshot,validateDocument,esc:String,render(){},notify(){},field:(_label,name,value,type)=>`<input data-field="${name}" type="${type}" value="${value}">`};c.selection=()=>c.doc.screens[0].elements[0];vm.createContext(c);
 let start=source.indexOf('function typographyPanel(');vm.runInContext(source.slice(start,source.indexOf('function generalPanel(',start)),c);
 start=source.indexOf('function checkpoint(');vm.runInContext(source.slice(start,source.indexOf('function edited(',start)),c);
 start=source.indexOf("    if (input.matches('[data-field]')) {");vm.runInContext('function change(input){'+source.slice(start,source.indexOf("    if (input.matches('[data-edge-field]'))",start))+'}',c);
 c.apply=(name,value,type='number')=>c.change({dataset:{field:'typography.'+name},value,type,matches:selector=>selector==='[data-field]'});return c;
}
test('text outline controls read defaults without creating typography fields and save typed values with Undo',()=>{
 const c=fixture(),before=structuredClone(c.doc),html=c.typographyPanel(c.selection());assert.match(html,/typography.strokeWidth/);assert.match(html,/typography.strokeColor/);assert.deepEqual(c.doc,before);
 c.apply('strokeWidth','4');c.apply('strokeColor','#126bff','color');assert.equal(c.selection().typography.strokeWidth,4);assert.equal(c.selection().typography.strokeColor,'#126bff');assert.equal(c.undo.length,2);assert.deepEqual(c.undo[0],before);assert.equal(c.dirty,true);
 const stable=JSON.stringify(c.doc),count=c.undo.length;c.apply('strokeWidth','13');assert.equal(JSON.stringify(c.doc),stable);assert.equal(c.undo.length,count);
 c.apply('strokeWidth','');assert.equal(c.selection().typography.strokeWidth,undefined);c.apply('strokeColor','','color');assert.equal(c.selection().typography,undefined);
});
