import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {mountDesignConsumer} from '/Users/max/projest_max/ui-studio/src/tools/uxStudio/consumer.mjs';
import {createButtonState} from '/Users/max/projest_max/ui-studio/src/tools/uxStudio/button-state.mjs';
import {createSkin} from '/Users/max/projest_max/ui-studio/src/tools/uxStudio/skins.mjs';
const root='/Users/max/projest_max/ui-studio';
const source=readFileSync(root+'/tests/ux-studio/control-visual.test.mjs','utf8');
const scope={EventTarget,Event,createButtonState};vm.createContext(scope);
// Reuse only the existing DOM fixture. Production consumer, state resolver and renderer stay real.
vm.runInContext(source.slice(source.indexOf('class Node extends'),source.indexOf('function fixture(t)'))+'\nthis.Node=Node;this.fire=fire;'+source.slice(source.indexOf('const stateDesign='),source.indexOf('function modalButtonConsumer(t)'))+'\nthis.stateDesign=stateDesign;',scope);
const off={src:'data:image/png;base64,b2Zm',alt:'Off',fit:'contain',sourceSize:[180,80]},on={src:'data:image/png;base64,b24=',alt:'On',fit:'contain',sourceSize:[180,80]},hover={src:'data:image/png;base64,aG92ZXI=',alt:'Hover',fit:'contain',sourceSize:[180,80]};
function fixture(t,{selected=true,slice,explicitHover=false}={}){
 const oldDocument=globalThis.document,doc={};
 doc.createElement=tag=>{const node=new scope.Node(tag,doc);node.style.setProperty=(key,value)=>{node.style[key]=value;};node.style.removeProperty=key=>{delete node.style[key];};return node;};doc.createElementNS=(_ns,tag)=>doc.createElement(tag);globalThis.document=doc;
 t.after(()=>{if(oldDocument===undefined)delete globalThis.document;else globalThis.document=oldDocument;});
 const rootNode=doc.createElement('section'),design=scope.stateDesign(),data=design.screens[0].elements[0],config=data.buttonState;
 Object.assign(config,{mode:'image',selected,images:{normal:off,pressed:off,selected:on}});
 if(explicitHover)config.images.hover=hover;
 if(slice){config.targetGraphic='self';data.skin=createSkin(slice==='3'?'button':'backplate');design.screens[0].elements=[data];}
 const before=JSON.stringify(design),consumer=mountDesignConsumer(rootNode,design);t.after(()=>consumer.dispose());
 const button=rootNode.querySelectorAll('.ui-element')[0],graphic=slice?button:rootNode.querySelectorAll('.ui-element')[1];
 const src=()=>slice?graphic.style['--skin-source']:graphic.querySelector('img').src;
 return {rootNode,design,config,before,consumer,button,graphic,src,want:image=>slice?'url("'+image.src+'")':image.src};
}
for(const trigger of ['pointerenter','focus'])test('selected image remains the base when hover image is missing: '+trigger,t=>{
 const f=fixture(t);assert.equal(f.button.getAttribute('aria-pressed'),'true');assert.equal(f.src(),f.want(on));
 scope.fire(f.button,trigger,{pointerType:'mouse'});assert.equal(f.button.dataset.buttonState,'hover');assert.equal(f.button.getAttribute('aria-pressed'),'true');
 assert.equal(f.src(),f.want(on),'selected image must be the base when no hover image was authored');
 assert.equal(JSON.stringify(f.design),f.before);
});
test('runtime selection repaints the visible icon while the pointer remains over the button',t=>{
 const f=fixture(t,{selected:false});scope.fire(f.button,'pointerenter',{pointerType:'mouse'});
 scope.fire(f.button,'pointerdown',{button:0,pointerId:1});assert.equal(f.src(),f.want(off));scope.fire(f.button,'pointerup',{pointerId:1});scope.fire(f.rootNode,'click',{target:f.graphic,detail:0});
 assert.equal(f.consumer.getState().buttonSelections.main['state-button'],true);assert.equal(f.button.getAttribute('aria-pressed'),'true');assert.equal(f.button.dataset.buttonState,'hover');
 assert.equal(f.src(),f.want(on),'runtime selected=true must reach the visible image while hovered');
 scope.fire(f.rootNode,'click',{target:f.graphic,detail:0});assert.equal(f.button.getAttribute('aria-pressed'),'false');assert.equal(f.src(),f.want(off));assert.equal(JSON.stringify(f.design),f.before);
});
for(const slice of ['3','9'])test(slice+'-slice selected button retains its selected image and slices while hovered',t=>{
 const f=fixture(t,{slice});assert.equal(f.src(),f.want(on));const slices=f.graphic.style['--skin-slices'],edges=f.graphic.style['--skin-edges'];scope.fire(f.button,'pointerenter',{pointerType:'mouse'});
 assert.equal(f.src(),f.want(on),'sliced frame must receive the selected fallback');
 for(const state of ['normal','highlighted','pressed','selected','disabled'])assert.equal(f.graphic.style['--skin-'+state+'-source'],f.want(on));
 assert.equal(f.graphic.style['--skin-slices'],slices);assert.equal(f.graphic.style['--skin-edges'],edges);assert.equal(JSON.stringify(f.design),f.before);
});
test('an explicitly authored hover image keeps priority over selected',t=>{
 const f=fixture(t,{explicitHover:true});scope.fire(f.button,'pointerenter',{pointerType:'mouse'});assert.equal(f.src(),f.want(hover));
});
test('an explicitly authored pressed image keeps priority over selected',t=>{
 const f=fixture(t);scope.fire(f.button,'pointerenter',{pointerType:'mouse'});scope.fire(f.button,'pointerdown',{button:0,pointerId:1});assert.equal(f.button.dataset.buttonState,'pressed');assert.equal(f.src(),f.want(off));
});
test('unselected buttons still fall back to normal while hovered',t=>{
 const f=fixture(t,{selected:false});scope.fire(f.button,'pointerenter',{pointerType:'mouse'});assert.equal(f.button.getAttribute('aria-pressed'),'false');assert.equal(f.src(),f.want(off));
});
