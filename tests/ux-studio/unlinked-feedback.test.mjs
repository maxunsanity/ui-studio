import test from 'node:test';
import assert from 'node:assert/strict';
import {createRuntime,activate} from '../../src/tools/uxStudio/model.mjs';
import {mountDesignConsumer} from '../../src/tools/uxStudio/consumer.mjs';
import {mountSampleScreen} from '../../src/tools/uxStudio/sample-preview.mjs';
import {fixture,fire} from './dom-fixture.mjs';
const message='아직 연결된 화면이 없습니다.';
const design=()=>({schemaVersion:4,projectId:'missing-link',name:'Test',revision:1,entryScreen:'main',fixtures:{balance:0,items:[]},screens:[{id:'main',name:'Main',kind:'page',logicalSize:{w:390,h:844},elements:[{id:'button',name:'Button',kind:'button',x:0,y:0,w:20,h:10,text:'Open'},{id:'label',name:'Label',kind:'text',x:0,y:0,w:100,h:100,parentId:'button',text:'Icon',interaction:{mode:'parent',enabled:true,shape:'rectangle',reason:''}}]}],transitions:[]});
test('unlinked action and delegated child receive the same plain message without navigation',()=>{
 const d=design(),before=structuredClone(d),r=createRuntime(d);for(const id of ['button','label']){const next=activate(d,r,'main',id);assert.equal(next.message,message);assert.equal(next.page,'main');assert.deepEqual(next.overlays,[]);assert.deepEqual(next.history,[]);}assert.deepEqual(d,before);
});
test('linked actions and explicitly disabled or display-only inputs do not get the fallback',()=>{
 const d=design();d.transitions=[{id:'known',fromScreen:'main',fromElement:'button',action:'feedback',condition:'always',event:'click',payload:{message:'Known'}}];assert.equal(activate(d,createRuntime(d),'main','button').message,'Known');d.transitions=[];
 d.screens[0].elements[0].interaction={mode:'none'};assert.equal(activate(d,createRuntime(d),'main','button').message,'');
 d.screens[0].elements[0].interaction={mode:'action',enabled:false,reason:'Locked'};assert.equal(activate(d,createRuntime(d),'main','button').message,'Locked');
});
test('consumer unlinked click opens a confirmable notice; dismiss preserves page and design',t=>{
 const root=fixture(t),d=design(),before=structuredClone(d),viewer=mountDesignConsumer(root,d);t.after(()=>viewer.dispose());
 fire(root.querySelector('.ui-element'),'click',{detail:0},true);const notice=root.querySelector('.consumer-feedback');assert.equal(notice.hidden,false);assert.equal(notice.querySelector('span').textContent,message);
 const close=notice.querySelector('button');assert.equal(close.textContent,'확인');fire(close,'click');assert.equal(viewer.getState().message,'');assert.equal(viewer.getState().page,'main');assert.deepEqual(viewer.getDesign(),before);
});
test('sample screen acknowledges unlinked clicks but keeps linked destinations static',t=>{
 const root=fixture(t),d=design(),viewer=mountSampleScreen(root,d);t.after(()=>viewer.dispose());fire(root.querySelector('.ui-element'),'click',{detail:0},true);assert.equal(root.querySelector('.sample-feedback')?.querySelector('span')?.textContent,message);
 const close=root.querySelector('.sample-feedback').querySelector('button');fire(close,'click');assert.equal(root.querySelector('.sample-feedback').hidden,true);assert.equal(viewer.getScreen().id,'main');
});

test('sample leaves linked clicks alone and pointer click inside an unlinked button gets feedback',t=>{
 const root=fixture(t),d=design();d.screens[0].elements.push({id:'linked',name:'Linked',kind:'button',x:30,y:0,w:20,h:10,text:'Linked'});d.transitions=[{id:'known',fromScreen:'main',fromElement:'linked',action:'feedback',event:'click',condition:'always',payload:{message:'Known'}}];const viewer=mountSampleScreen(root,d);t.after(()=>viewer.dispose());
 const find=id=>root.querySelectorAll('.ui-element').find(n=>n.dataset.element===id);fire(find('linked'),'click',{detail:0},true);assert.equal(root.querySelector('.sample-feedback'),null);
 find('button').getBoundingClientRect=()=>({left:0,top:0,width:100,height:100});fire(find('button'),'click',{detail:1,clientX:20,clientY:20},true);assert.equal(root.querySelector('.sample-feedback').querySelector('span').textContent,message);assert.equal(viewer.getScreen().id,'main');
});
test('a linked sample click clears an earlier missing-link notice',t=>{
 const root=fixture(t),d=design();d.screens[0].elements.push({id:'linked',name:'Linked',kind:'button',x:30,y:0,w:20,h:10,text:'Linked'});d.transitions=[{id:'known',fromScreen:'main',fromElement:'linked',action:'feedback',event:'click',condition:'always',payload:{message:'Known'}}];const viewer=mountSampleScreen(root,d);t.after(()=>viewer.dispose());const find=id=>root.querySelectorAll('.ui-element').find(n=>n.dataset.element===id);fire(find('button'),'click',{detail:0},true);assert.equal(root.querySelector('.sample-feedback').hidden,false);fire(find('linked'),'click',{detail:0},true);assert.equal(root.querySelector('.sample-feedback').hidden,true);
});
test('notice inside a blocking modal remains keyboard-accessible and Escape leaves modal open',t=>{
 const root=fixture(t),d=design();d.screens.push({id:'modal',name:'Modal',kind:'modal',logicalSize:{w:390,h:844},elements:[{id:'missing',name:'Missing',kind:'button',x:0,y:0,w:50,h:20,text:'Missing'}]});d.transitions=[{id:'open',fromScreen:'main',fromElement:'button',action:'open',event:'click',condition:'always',targetScreen:'modal'}];const viewer=mountDesignConsumer(root,d);t.after(()=>viewer.dispose());const find=id=>root.querySelectorAll('.ui-element').find(n=>n.dataset.element===id);fire(find('button'),'click',{detail:0},true);fire(find('missing'),'click',{detail:0},true);const notice=root.querySelector('.consumer-feedback');assert.equal(notice.closest('.preview-overlay')?.contains(find('missing')),true);const key=fire(find('missing'),'keydown',{key:'Escape'},true);assert.equal(key.defaultPrevented,true);assert.equal(viewer.getState().message,'');assert.deepEqual(viewer.getState().overlays,['modal']);
});
