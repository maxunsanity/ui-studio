import test from 'node:test';
import assert from 'node:assert/strict';
import * as overlay from '../../src/tools/uxStudio/overlay-runtime.mjs';
import {validatePresentation} from '../../src/tools/uxStudio/units.mjs';
const p=more=>({type:'modal',effect:'none',durationMs:0,autoCloseMs:0,dim:false,...more});
test('base visibility validates stable unique bounded IDs while older empty metadata stays valid',()=>{
 validatePresentation(p({}));validatePresentation(p({hideBaseElements:[]}));validatePresentation(p({hideBaseElements:['hud-top','event.1']}));
 for(const value of ['hud',[1],['hud','hud'],['<script>'],Array.from({length:401},(_,i)=>'e'+i)])assert.throws(()=>validatePresentation(p({hideBaseElements:value})),/연출|레이어/);
});
test('active overlay visibility unions nested masks, restores remaining masks and never mutates design',()=>{
 assert.equal(typeof overlay.overlayBaseHiddenElements,'function');
 const d={screens:[{id:'a',presentation:p({hideBaseElements:['hud','menu']})},{id:'b',presentation:p({hideBaseElements:['menu','event']})},{id:'plain',presentation:p({})}]},before=structuredClone(d);
 assert.deepEqual([...overlay.overlayBaseHiddenElements(d,[])],[]);
 assert.deepEqual([...overlay.overlayBaseHiddenElements(d,['a','b','missing'])],['hud','menu','event']);
 assert.deepEqual([...overlay.overlayBaseHiddenElements(d,['a'])],['hud','menu']);
 assert.deepEqual([...overlay.overlayBaseHiddenElements(d,['plain'],p({hideBaseElements:['preview']}))],['preview']);
 assert.deepEqual([...overlay.overlayBaseHiddenElements(d,[])],[]);assert.deepEqual(d,before);
});
test('common overlay settings apply without creating a trigger edge and preserve other screens and close policy',async()=>{
 const units=await import('../../src/tools/uxStudio/units.mjs');assert.equal(typeof units.updateOverlayPresentation,'function');
 const d={screens:[{id:'main',kind:'page',elements:[]},{id:'modal',kind:'modal',elements:[{id:'label'}],presentation:p({blocking:false,closePolicy:'prevent',rootMode:'fullscreen'})}],transitions:[{id:'keep'}]},before=structuredClone(d);
 const next=units.updateOverlayPresentation(d,'modal',p({hideBaseElements:['hud']}));
 assert.deepEqual(next.transitions,d.transitions);assert.deepEqual(next.screens[0],d.screens[0]);assert.deepEqual(next.screens[1].elements,d.screens[1].elements);assert.equal(next.screens[1].presentation.blocking,false);assert.equal(next.screens[1].presentation.closePolicy,'prevent');assert.equal(next.screens[1].presentation.rootMode,undefined);assert.deepEqual(next.screens[1].presentation.hideBaseElements,['hud']);assert.deepEqual(d,before);
 assert.throws(()=>units.updateOverlayPresentation(d,'main',p({})));assert.throws(()=>units.updateOverlayPresentation(d,'absent',p({})));
});
