import test from 'node:test';
import assert from 'node:assert/strict';
import {createButtonState,validateButtonStates} from '../../src/tools/uxStudio/button-state.mjs';
import {validateDocument,createRuntime,activate} from '../../src/tools/uxStudio/model.mjs';
import {copySelection,pasteSelection} from '../../src/tools/uxStudio/commands.mjs';
import {applyGrapesEdits} from '../../src/tools/uxStudio/grapes-bridge.mjs';
const fixture=()=>({schemaVersion:3,projectId:'ux-button-state',name:'Buttons',revision:1,entryScreen:'main',screens:[{id:'main',name:'Main',kind:'page',elements:[
 {id:'button',name:'Button',kind:'button',component:'image-frame',x:0,y:0,w:40,h:20,text:''},
 {id:'icon',parentId:'button',name:'Icon',kind:'image',x:0,y:0,w:60,h:60,image:{src:'',asset:'icon',alt:'Icon',fit:'contain'},interaction:{mode:'parent',enabled:true,shape:'rectangle',reason:''}},
 {id:'label',parentId:'button',name:'Label',kind:'text',x:0,y:70,w:100,h:30,text:'Label',interaction:{mode:'parent',enabled:true,shape:'rectangle',reason:''}},
 {id:'other',name:'Other',kind:'image',x:60,y:0,w:20,h:20}
]}],transitions:[{id:'feedback',fromScreen:'main',fromElement:'button',event:'click',action:'feedback',condition:'always',payload:{message:'Clicked'}}],fixtures:{balance:0,items:[]}});

test('legacy documents and runtime stay unchanged until a button explicitly opts in',()=>{
 const doc=fixture(),before=structuredClone(doc);validateDocument(doc);assert.deepEqual(doc,before);
 assert.equal(createRuntime(doc).buttonSelections,undefined);const config=createButtonState();assert.equal(config.enabled,false);assert.equal(config.selectable,false);
});
test('opt-in validation requires real descendant images and valid colors, images and typed states',()=>{
 const doc=fixture(),button=doc.screens[0].elements[0];button.buttonState={...createButtonState(),enabled:true,targetGraphic:'icon'};
 validateDocument(doc);const stable=structuredClone(doc);
 for(const field of ['other','label','missing']){button.buttonState.targetGraphic=field;assert.throws(()=>validateDocument(doc));}
 for(const invalid of [{mode:'other'},{selected:'yes'},{enabled:1},{tints:{normal:'red'}},{images:{pressed:{src:'https://unsafe/a.png',alt:'bad',fit:'contain'}}}]){
  button.buttonState={...structuredClone(stable.screens[0].elements[0].buttonState),...invalid};assert.throws(()=>validateDocument(doc));
 }
 assert.throws(()=>validateButtonStates({...doc.screens[0],elements:[{...button,buttonState:{...createButtonState(),targetGraphic:'self'},control:{type:'toggle'}}]},[]));
});
test('selection toggles only for explicit selectable buttons and respects disabled, pending and parent forwarding',()=>{
 const doc=fixture(),button=doc.screens[0].elements[0];button.buttonState={...createButtonState(),enabled:true,selectable:true};validateDocument(doc);
 const initial=createRuntime(doc),selected=activate(doc,initial,'main','icon');assert.equal(initial.buttonSelections.main.button,false);assert.equal(selected.buttonSelections.main.button,true);assert.equal(selected.message,'Clicked');
 const restored=activate(doc,selected,'main','button');assert.equal(restored.buttonSelections.main.button,false);
 button.interaction={mode:'action',enabled:false,shape:'rectangle',reason:'Disabled'};
 assert.equal(activate(doc,initial,'main','label').buttonSelections.main.button,false);
 button.interaction.enabled=true;assert.equal(activate(doc,{...initial,pending:true},'main','button').buttonSelections.main.button,false);
 button.buttonState.selectable=false;assert.equal(activate(doc,initial,'main','button').buttonSelections.main.button,false);
});

test('duplicate and cross-screen paste remap the graphic reference without changing the original button or assets',()=>{
 const doc=fixture(),screen=doc.screens[0],button=screen.elements[0];button.buttonState={...createButtonState(),enabled:true,targetGraphic:'icon',mode:'image',images:{normal:{src:'',asset:'icon',fit:'contain',alt:'normal'}}};const before=structuredClone(button);
 const clip=copySelection(doc,'main',['button']);let sequence=0;
 const [id]=pasteSelection(doc,'main',clip,()=>'copy-'+(++sequence));validateDocument(doc);const copied=screen.elements.find(e=>e.id===id);
 assert.notEqual(copied.buttonState.targetGraphic,'icon');assert.equal(screen.elements.find(e=>e.id===copied.buttonState.targetGraphic).parentId,copied.id);assert.deepEqual(button,before);
 doc.screens.push({id:'second',name:'Second',kind:'page',elements:[]});const [otherId]=pasteSelection(doc,'second',clip,()=>'cross-'+(++sequence));validateDocument(doc);
 const other=doc.screens[1].elements.find(e=>e.id===otherId);assert.equal(doc.screens[1].elements.find(e=>e.id===other.buttonState.targetGraphic).parentId,otherId);assert.deepEqual(other.buttonState.images,before.buttonState.images);
});

test('Grapes edit and JSON stage source roundtrip preserve target IDs, state image refs and authored settings',()=>{
 const source=fixture();source.screens[0].elements[0].buttonState={...createButtonState(),enabled:true,targetGraphic:'icon'};const original=structuredClone(source);
 const list=source.screens[0].elements.map(e=>({id:e.id,parentId:e.parentId||null,name:e.name,text:e.text||'',rect:{x:e.x,y:e.y,w:e.w,h:e.h}}));
 const stage=JSON.parse(JSON.stringify({source,edits:list}));stage.edits[0].name='Renamed';const result=applyGrapesEdits(stage.source,'main',stage.edits);
 assert.deepEqual(result.screens[0].elements[0].buttonState,source.screens[0].elements[0].buttonState);assert.equal(result.screens[0].elements[0].buttonState.targetGraphic,'icon');assert.deepEqual(source,original);validateDocument(result);
});
