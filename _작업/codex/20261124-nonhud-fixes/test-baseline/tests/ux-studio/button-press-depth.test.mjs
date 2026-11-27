
import test from 'node:test';
import assert from 'node:assert/strict';
import {createButtonState} from '../../src/tools/uxStudio/button-state.mjs';
import {validateDocument} from '../../src/tools/uxStudio/model.mjs';
import {copySelection,pasteSelection,removeSelection,ungroupSelection} from '../../src/tools/uxStudio/commands.mjs';
const fixture=()=>({schemaVersion:3,projectId:'press-depth',name:'Press',revision:1,entryScreen:'main',fixtures:{balance:0,items:[]},transitions:[],screens:[{id:'main',name:'Main',kind:'page',elements:[
 {id:'button',name:'Button',kind:'button',component:'image-frame',x:0,y:0,w:50,h:30,buttonState:{...createButtonState(),enabled:true,targetGraphic:'face',pressFeedback:{enabled:true,target:'front',distance:3,shadow:{enabled:true,color:'#000000',opacity:.12,x:0,y:1,blur:1}}}},
 {id:'rim',parentId:'button',name:'Rim',kind:'image',x:0,y:0,w:100,h:100},
 {id:'front',parentId:'button',name:'Front',kind:'panel',isGroup:true,x:0,y:0,w:100,h:90},
 {id:'face',parentId:'front',name:'Face',kind:'image',x:0,y:0,w:100,h:100},
 {id:'label',parentId:'front',name:'Label',kind:'text',x:0,y:0,w:100,h:100,text:'GO'},
 {id:'other',name:'Other',kind:'panel',x:0,y:0,w:10,h:10}
]}]});
test('press feedback validates bounded logical distance, non-input descendant target and existing shadow schema',()=>{
 const d=fixture(),c=d.screens[0].elements[0].buttonState;assert.doesNotThrow(()=>validateDocument(d));delete c.pressFeedback.shadow;assert.doesNotThrow(()=>validateDocument(d));
 const original=structuredClone(c.pressFeedback);
 for(const patch of [{target:'button'},{target:'other'},{target:'missing'},{distance:-1},{distance:17},{distance:'3'},{distance:NaN},{enabled:'yes'},{shadow:{enabled:true,color:'red',opacity:1,x:0,y:1,blur:1}},{unexpected:1}]){
  c.pressFeedback={...original,...patch};assert.throws(()=>validateDocument(d));
 }
 c.pressFeedback=original;d.screens[0].elements[2].control={type:'input'};assert.throws(()=>validateDocument(d));
});
test('copy and cross-screen paste remap both front group and graphic independently; source remains unchanged',()=>{
 const d=fixture(),before=structuredClone(d),clip=copySelection(d,'main',['button']);d.screens.push({id:'other-page',name:'Other page',kind:'page',elements:[]});let n=0;
 const [id]=pasteSelection(d,'other-page',clip,()=>'copy-'+(++n));validateDocument(d);const s=d.screens[1],c=s.elements.find(e=>e.id===id).buttonState,front=s.elements.find(e=>e.id===c.pressFeedback.target),face=s.elements.find(e=>e.id===c.targetGraphic);
 assert.equal(front.parentId,id);assert.equal(face.parentId,front.id);assert.notEqual(front.id,'front');assert.deepEqual(d.screens[0],before.screens[0]);
});
test('deleting or ungrouping a front group clears only its optional motion reference and keeps normal graphic state valid',()=>{
 for(const action of ['delete','ungroup']){
  const d=fixture(),s=d.screens[0];s.elements[0].buttonState.targetGraphic='self';
  if(action==='delete')removeSelection(d,'main',['front']);else ungroupSelection(d,'main',['front'],551,984);
  assert.equal(s.elements[0].buttonState.pressFeedback,undefined);assert.equal(s.elements[0].buttonState.enabled,true);validateDocument(d);
 }
});
