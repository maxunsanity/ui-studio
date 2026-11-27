import test from 'node:test';
import assert from 'node:assert/strict';
import { renderLayout } from '../../src/tools/uxStudio/layout-view.mjs';
import { createControl, attachControls } from '../../src/tools/uxStudio/controls.mjs';
import {mountDesignConsumer} from '../../src/tools/uxStudio/consumer.mjs';
import {createButtonState} from '../../src/tools/uxStudio/button-state.mjs';
import {createSkin} from '../../src/tools/uxStudio/skins.mjs';

// Renderer fixture only; CSS painting remains part of the parent's browser acceptance.
class Node extends EventTarget {
    constructor(tag, doc) {
        super(); this.tagName = tag.toUpperCase(); this.ownerDocument = doc; this.children = []; this.dataset = {}; this.style = {}; this.attributes = {}; this.className = '';
        this.classList = { contains: name => this.className.split(' ').includes(name), add: name => { this.className += ' ' + name; }, toggle: (name, on) => { this.className = this.className.split(' ').filter(s => s !== name).concat(on ? [name] : []).join(' '); } };
    }
    append(...nodes) { for (const n of nodes) { n.parentNode = this; this.children.push(n); } }
    replaceChildren(...nodes) {for(const node of this.children)node.parentNode=null;this.children=[];this.append(...nodes);}
    insertBefore(n, anchor) { n.remove(); const index=this.children.indexOf(anchor); n.parentNode=this; if(index<0)this.children.push(n);else this.children.splice(index,0,n); return n; }
    prepend(n) { n.parentNode = this; this.children.unshift(n); }
    remove() { if (this.parentNode) this.parentNode.children = this.parentNode.children.filter(n => n !== this); this.parentNode = null; }
    setAttribute(k, v) { this.attributes[k] = String(v); if (k === 'class') this.className = String(v); }
    getAttribute(k) { return this.attributes[k] ?? null; }
    removeAttribute(k) { delete this.attributes[k]; }
    get firstElementChild() { return this.children[0]; }
    get lastElementChild() { return this.children.at(-1); }
    matches(selector) { if(selector.includes(','))return selector.split(',').some(value=>this.matches(value));if(/^(button|input|select|textarea):not\(:disabled\)$/.test(selector))return this.tagName.toLowerCase()===selector.split(':')[0]&&!this.disabled;if(selector==='a[href]')return this.tagName==='A'&&this.getAttribute('href')!==null;if(selector==='[tabindex]:not([tabindex="-1"])')return Number.isInteger(this.tabIndex)&&this.tabIndex!==-1;if(selector==='[inert]')return !!this.inert||this.getAttribute('inert')!==null;if(selector==='[data-ui-control]')return !!this.dataset.uiControl;if(selector.startsWith('.ui-element[role=button]'))return this.classList.contains('ui-element')&&this.getAttribute('role')==='button'&&this.tagName!=='BUTTON';return selector.startsWith('.')?this.classList.contains(selector.slice(1)):this.tagName.toLowerCase()===selector; }
    closest(selector) { return this.matches(selector) ? this : this.parentNode?.closest(selector) || null; }
    getClientRects() { return this.hidden ? [] : [{}]; }
    focus() { if(this.disabled||this.closest('[inert]'))return;const previous=this.ownerDocument.activeElement;if(previous===this)return;if(previous)fire(previous,'blur');this.ownerDocument.activeElement=this;fire(this,'focus'); }
    click(){if(!this.disabled)fire(this,'click',{detail:0},true);}
    querySelectorAll(selector) {
        const direct = selector.startsWith(':scope > '), simple = direct ? selector.slice(9) : selector;
        const matches = n => n.matches(simple);
        return this.children.flatMap(n => [...(matches(n) ? [n] : []), ...(direct ? [] : n.querySelectorAll(selector))]);
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    contains(n) { return n === this || this.children.some(child => child.contains(n)); }
}
function fire(node,type,values={},bubble=false){const event=new Event(type,{cancelable:true});for(const [key,value]of Object.entries({target:node,...values}))Object.defineProperty(event,key,{value,configurable:true});for(let current=node;current;current=bubble?current.parentNode:null){current.dispatchEvent(event);if(event.cancelBubble)break;}return event;}
function fixture(t) {
    const previous = globalThis.document;
    const doc = { createElement: tag => new Node(tag, doc), createElementNS: (_ns, tag) => new Node(tag, doc) };
    globalThis.document = doc;
    t.after(() => { if (previous === undefined) delete globalThis.document; else globalThis.document = previous; });
    return doc.createElement('section');
}

test('actual consumer opens one transparent fullscreen modal, blocks the base, closes by Escape/action and keeps internal scroll',t=>{
 const root=fixture(t),create=document.createElement;
 document.createElement=tag=>{const node=create(tag);node.style.setProperty=(key,value)=>{node.style[key]=value;};node.focus=()=>{document.activeElement=node;};return node;};
 const e=(id,kind='button')=>({id,name:id,kind,x:0,y:0,w:50,h:20}),design={schemaVersion:4,projectId:'fullscreen-consumer',name:'Fullscreen consumer',revision:1,entryScreen:'main',screens:[
  {id:'main',name:'Main',kind:'page',logicalSize:{w:551,h:984},elements:[e('open'),{...e('list','list'),overflow:'scroll-y'}]},
  {id:'wins',name:'Wins',kind:'modal',logicalSize:{w:551,h:984},skin:createSkin('modal'),presentation:{type:'modal',effect:'fade',durationMs:240,autoCloseMs:0,dim:true,rootMode:'fullscreen'},elements:[e('close')]}
 ],transitions:[{id:'open-link',fromScreen:'main',fromElement:'open',event:'click',action:'open',condition:'always',targetScreen:'wins'},{id:'close-link',fromScreen:'wins',fromElement:'close',event:'click',action:'close',condition:'always'}],fixtures:{balance:0,items:[]}},before=structuredClone(design);
 const consumer=mountDesignConsumer(root,design),page=root.children[0],overlays=root.children[1],open=page.querySelectorAll('.ui-element').find(n=>n.dataset.element==='open'),list=page.querySelectorAll('.ui-element').find(n=>n.dataset.element==='list');list.scrollTop=141;
 fire(root,'click',{target:open,detail:0});assert.equal(overlays.children.length,1);let panel=overlays.children[0].children[0];
 assert.equal(panel.dataset.overlayRoot,'fullscreen');assert.equal(panel.style.width,'100%');assert.equal(panel.style.height,'100%');assert.equal(panel.style.background,'transparent');assert.equal(panel.classList.contains('game-skin'),false);assert.equal(page.inert,true);assert.equal(list.scrollTop,141);
 const count=consumer.getState().events.length;fire(root,'click',{target:open,detail:0});assert.equal(consumer.getState().events.length,count);
 fire(root,'keydown',{target:panel,key:'Escape'});assert.equal(overlays.children.length,0);assert.equal(page.inert,false);assert.equal(list.scrollTop,141);
 fire(root,'click',{target:open,detail:0});panel=overlays.children[0].children[0];fire(root,'click',{target:panel.querySelector('.ui-element'),detail:0});assert.equal(overlays.children.length,0);assert.equal(list.scrollTop,141);assert.deepEqual(design,before);consumer.dispose();
});

const stateDesign=()=>({schemaVersion:3,projectId:'ux-state-render',name:'Button states',revision:1,entryScreen:'main',screens:[{id:'main',name:'Main',kind:'page',elements:[
 {id:'state-button',name:'Button',kind:'button',component:'image-frame',x:0,y:0,w:40,h:20,buttonState:{...createButtonState(),enabled:true,targetGraphic:'state-icon',selectable:true}},
 {id:'state-icon',parentId:'state-button',name:'Icon',kind:'image',x:0,y:0,w:64,h:64,image:{src:'',asset:'icon',alt:'Icon',fit:'contain'},interaction:{mode:'parent',enabled:true,shape:'rectangle',reason:''}},
 {id:'state-label',parentId:'state-button',name:'Label',kind:'text',x:0,y:70,w:100,h:30,text:'Keep text',interaction:{mode:'parent',enabled:true,shape:'rectangle',reason:''}}
]}],transitions:[{id:'state-click',fromScreen:'main',fromElement:'state-button',event:'click',action:'feedback',condition:'always',payload:{message:'Clicked'}}],fixtures:{balance:0,items:[]}});

function modalButtonConsumer(t) {
 const root=fixture(t),create=document.createElement;
 document.createElement=tag=>{const node=create(tag);node.style.setProperty=(key,value)=>{node.style[key]=value;};return node;};
 const element=(id,kind='button',more={})=>({id,name:id,kind,x:0,y:0,w:20,h:10,...more}),button=id=>element(id,'button',{buttonState:{...createButtonState(),enabled:true}});
 const nav=['wins','build','album','friends'],design={schemaVersion:4,projectId:'modal-button-return',name:'Modal buttons',revision:1,entryScreen:'main',fixtures:{balance:0,items:[]},screens:[
  {id:'main',name:'Main',kind:'page',logicalSize:{w:551,h:984},elements:[element('hud','panel'),...nav.flatMap(id=>[
   {...button(id),parentId:'hud',buttonState:{...createButtonState(),enabled:true,targetGraphic:id+'-icon'}},
   element(id+'-icon','image',{parentId:id,image:{src:'',asset:'icon',alt:id,fit:'contain'},interaction:{mode:'parent',enabled:true,shape:'rectangle',reason:''}})
  ]),element('legacy'),{...button('authored-disabled'),interaction:{mode:'action',enabled:false,shape:'rectangle',reason:'Unavailable'}},element('list','list',{overflow:'scroll-y'})]},
  {id:'modal',name:'Modal',kind:'modal',logicalSize:{w:551,h:984},presentation:{type:'modal',effect:'fade',durationMs:240,autoCloseMs:0,dim:true,rootMode:'fullscreen'},elements:[button('close'),button('nested-open')]},
  {id:'nested',name:'Nested',kind:'modal',logicalSize:{w:551,h:984},elements:[button('nested-close')]}
 ],transitions:[
  ['open','main','wins','open','modal'],['close','modal','close','close'],['nested-open','modal','nested-open','open','nested'],['nested-close','nested','nested-close','close'],['feedback','main','build','feedback']
 ].map(([id,fromScreen,fromElement,action,targetScreen])=>({id,fromScreen,fromElement,event:'click',action,condition:'always',...(targetScreen?{targetScreen}:{})}))};
 const before=structuredClone(design),consumer=mountDesignConsumer(root,design),find=id=>root.querySelectorAll('.ui-element').find(node=>node.dataset.element===id);
 t.after(()=>consumer.dispose());return {root,consumer,find,nav,design,before};
}

for(const close of ['action','Escape'])test('consumer restores four state buttons and opener focus after modal '+close,t=>{
 const {root,consumer,find,nav,design,before}=modalButtonConsumer(t),page=root.children[0],list=find('list'),opener=find('wins');
 list.scrollTop=141;opener.focus();
 for(const id of nav)assert.equal(find(id).getAttribute('aria-disabled'),'false');
 fire(root,'click',{target:opener,detail:0});assert.equal(page.inert,true);assert.deepEqual(consumer.getState().overlays,['modal']);
 const closeButton=find('close');assert.equal(document.activeElement,closeButton);
 if(close==='action')fire(root,'click',{target:closeButton,detail:0});else fire(root,'keydown',{target:closeButton,key:'Escape'});
 assert.deepEqual(consumer.getState().overlays,[]);assert.equal(page.inert,false);
 for(const id of nav)assert.equal(find(id).getAttribute('aria-disabled'),'false',id+' must recover after closing');
 assert.equal(find('authored-disabled').getAttribute('aria-disabled'),'true');assert.equal(find('legacy').getAttribute('aria-disabled'),'false');
 assert.equal(document.activeElement,opener);assert.equal(list.scrollTop,141);assert.deepEqual(design,before);
 const count=consumer.getState().events.length;fire(find('build'),'keydown',{key:'Enter'},true);fire(find('build'),'keyup',{key:'Enter'},true);assert.equal(consumer.getState().events.length,count+1);
 fire(opener,'keydown',{key:' '},true);fire(opener,'keyup',{key:' '},true);assert.deepEqual(consumer.getState().overlays,['modal']);
});

test('consumer releases both inert ancestors before restoring nested modal button state and focus',t=>{
 const {root,consumer,find}=modalButtonConsumer(t),page=root.children[0];find('wins').focus();fire(root,'click',{target:find('wins'),detail:0});
 const parentPanel=root.children[1].children[0].firstElementChild,nestedOpener=find('nested-open');nestedOpener.focus();fire(root,'click',{target:nestedOpener,detail:0});
 assert.equal(parentPanel.inert,true);assert.equal(parentPanel.parentNode.inert,true);
 fire(root,'click',{target:find('nested-close'),detail:0});assert.deepEqual(consumer.getState().overlays,['modal']);
 assert.equal(page.inert,true);assert.equal(parentPanel.inert,false);assert.equal(parentPanel.parentNode.inert,false);
 assert.equal(nestedOpener.getAttribute('aria-disabled'),'false');assert.equal(document.activeElement,nestedOpener);
 assert.equal(find('wins').getAttribute('aria-disabled'),'true');
 fire(root,'click',{target:find('close'),detail:0});assert.equal(find('wins').getAttribute('aria-disabled'),'false');assert.equal(document.activeElement,find('wins'));
});

test('consumer tint targets only its chosen image; pointer, cancel, selected and disabled use actual runtime',t=>{
 const root=fixture(t),design=stateDesign(),before=structuredClone(design),consumer=mountDesignConsumer(root,design),find=id=>root.querySelectorAll('.ui-element').find(n=>n.dataset.element===id),button=find('state-button'),icon=find('state-icon'),label=find('state-label');
 assert.equal(button.dataset.buttonState,'normal');assert.match(icon.style.filter,/ui-button-tint/);assert.equal(label.style.filter,undefined);
 fire(button,'pointerenter');assert.equal(button.dataset.buttonState,'hover');
 fire(button,'pointerdown',{button:0,pointerId:1});assert.equal(button.dataset.buttonState,'pressed');
 fire(button,'pointercancel',{pointerId:1});assert.equal(button.dataset.buttonState,'normal');
 fire(root,'click',{target:icon,detail:0});assert.equal(consumer.getState().buttonSelections.main['state-button'],true);assert.equal(button.dataset.buttonState,'selected');assert.equal(label.querySelector('.element-text').textContent,'Keep text');
 const disabled=structuredClone(design);disabled.revision=2;disabled.screens[0].elements[0].interaction={mode:'action',enabled:false,shape:'rectangle',reason:'Disabled'};consumer.updateDesign(disabled);
 assert.equal(button.dataset.buttonState,'disabled');assert.equal(button.getAttribute('aria-disabled'),'true');
 fire(button,'pointerdown',{button:0,pointerId:2});assert.equal(button.dataset.buttonState,'disabled');fire(root,'click',{target:icon,detail:0});assert.equal(consumer.getState().buttonSelections.main['state-button'],true);
 assert.deepEqual(design,before);consumer.dispose();
});

test('keyboard press activates once at release; Escape, blur, repeat and disabled never activate',t=>{
 const root=fixture(t),design=stateDesign(),consumer=mountDesignConsumer(root,design),button=root.querySelectorAll('.ui-element')[0];
 fire(button,'focus');fire(button,'keydown',{key:' ',repeat:false},true);assert.equal(button.dataset.buttonState,'pressed');assert.equal(consumer.getState().events.length,0);
 fire(button,'keydown',{key:' ',repeat:true},true);fire(button,'keyup',{key:' '},true);assert.equal(consumer.getState().events.length,1);assert.equal(consumer.getState().buttonSelections.main['state-button'],true);
 fire(button,'keydown',{key:'Enter'},true);fire(button,'blur');fire(button,'keyup',{key:'Enter'},true);assert.equal(consumer.getState().events.length,1);
 fire(button,'keydown',{key:'Enter'},true);fire(button,'keydown',{key:'Escape'},true);fire(button,'keyup',{key:'Enter'},true);assert.equal(consumer.getState().events.length,1);
 fire(button,'keydown',{key:'Enter'},true);fire(button,'keyup',{key:'Enter'},true);assert.equal(consumer.getState().events.length,2);
 const disabled=structuredClone(design);disabled.revision=2;disabled.screens[0].elements[0].interaction={mode:'action',enabled:false,shape:'rectangle',reason:''};consumer.updateDesign(disabled);
 fire(button,'keydown',{key:'Enter'},true);fire(button,'keyup',{key:'Enter'},true);assert.equal(consumer.getState().events.length,2);assert.equal(button.dataset.buttonState,'disabled');
 consumer.dispose();
});

test('touch enter and tap focus cannot leave sticky hover; pointer release and cancellation return normally',t=>{
 const root=fixture(t),design=stateDesign();design.screens[0].elements[0].buttonState.selectable=false;
 const consumer=mountDesignConsumer(root,design),button=root.querySelectorAll('.ui-element')[0];
 fire(button,'pointerenter',{pointerType:'touch'});assert.equal(button.dataset.buttonState,'normal');
 fire(button,'pointerdown',{button:0,pointerId:9,pointerType:'touch'});fire(button,'focus');assert.equal(button.dataset.buttonState,'pressed');
 fire(button,'pointerup',{pointerId:9,pointerType:'touch'});assert.equal(button.dataset.buttonState,'normal');
 fire(button,'pointerdown',{button:0,pointerId:9,pointerType:'touch'});fire(button,'pointercancel',{pointerId:9});assert.equal(button.dataset.buttonState,'normal');
 consumer.dispose();assert.equal(button._buttonStateController,undefined);
});

test('state image swaps reuse renderer and restore original region, text and IDs when config is removed',t=>{
 const root=fixture(t),design=stateDesign(),config=design.screens[0].elements[0].buttonState;config.mode='image';config.images={pressed:{src:'data:image/png;base64,YWJj',alt:'Pressed',fit:'contain',sourceSize:[64,64],region:[0,0,32,32]}};
 const consumer=mountDesignConsumer(root,design),find=id=>root.querySelectorAll('.ui-element').find(n=>n.dataset.element===id),button=find('state-button'),icon=find('state-icon'),label=find('state-label'),normal=icon.querySelector('.image-content');
 fire(button,'pointerdown',{button:0,pointerId:1});assert.notEqual(icon.querySelector('.image-content'),normal);assert.equal(icon.querySelector('.sprite-region-image').getAttribute('viewBox'),'0 0 32 32');
 fire(button,'pointerup',{pointerId:1});assert.equal(icon.querySelector('.sprite-region-image'),null);assert.ok(icon.querySelector('img'));
 const next=structuredClone(design);next.revision=2;delete next.screens[0].elements[0].buttonState;next.screens[0].elements[1].image={src:'data:image/png;base64,cmVwbGFjZWQ=',alt:'Replacement',fit:'contain'};consumer.updateDesign(next);
 assert.equal(button._buttonStateController,undefined);assert.equal(icon.style.filter,'');assert.equal(find('state-label'),label);assert.equal(label.querySelector('.element-text').textContent,'Keep text');assert.equal(find('state-icon'),icon);
 assert.equal(icon.querySelector('img').src,'data:image/png;base64,cmVwbGFjZWQ=');
 consumer.dispose();
});

test('real layout applies art shadows and removes them in structure, ancestor shells and after deletion',t=>{
    const root=fixture(t),create=document.createElement;
    document.createElement=tag=>{const node=create(tag);node.style.setProperty=(key,value)=>{node.style[key]=value;};node.style.removeProperty=key=>{delete node.style[key];};node.classList.remove=name=>node.classList.toggle(name,false);return node;};
    const part={id:'shadow-part',name:'Shadow',kind:'panel',x:10,y:20,w:30,h:40,effects:{shadow:{enabled:true,color:'#000000',opacity:.4,x:2,y:3,blur:4}}},screen={id:'main',elements:[part]};
    renderLayout(screen,root,{assetView:'art'});const node=root.children[0];
    assert.equal(node.classList.contains('has-ui-shadow'),true);assert.equal(node.style['--ui-shadow'],'drop-shadow(2px 3px 4px rgba(0,0,0,0.4))');
    assert.equal(node.style.cssText,'left:10%;top:20%;width:30%;height:40%;font-size:16px;');
    renderLayout(screen,root,{assetView:'wire'});assert.equal(node.classList.contains('has-ui-shadow'),false);assert.equal(node.style['--ui-shadow'],undefined);
    renderLayout(screen,root,{assetView:'art',shell:()=>true});assert.equal(node.classList.contains('has-ui-shadow'),false);
    renderLayout(screen,root,{assetView:'art'});delete part.effects;renderLayout(screen,root,{assetView:'art'});
    assert.equal(node.classList.contains('has-ui-shadow'),false);assert.equal(node.style['--ui-shadow'],undefined);
});

test('notification rendering restores legacy content and uses defaults in editor previews',t=>{
    const root=fixture(t),part={id:'badge',name:'Badge',kind:'panel',partRole:'badge',x:65,y:0,w:35,h:30,text:'NEW'},screen={id:'main',elements:[part]};
    renderLayout(screen,root);const node=root.children[0];assert.equal(node.querySelector('.element-text').textContent,'NEW');
    part.notification={enabled:true,mode:'count',value:5,hideZero:true,maxDisplay:99,valueKey:'nav.buildCount'};
    renderLayout(screen,root);assert.equal(node.querySelector('.element-text').textContent,'5');assert.equal(node.hidden,false);
    part.notification.value=0;renderLayout(screen,root);assert.equal(node.hidden,true);
    part.notification.value=4;renderLayout(screen,root);assert.equal(node.hidden,false);assert.equal(node.querySelector('.element-text').textContent,'4');
    delete part.notification;renderLayout(screen,root);assert.equal(node.hidden,false);assert.equal(node.querySelector('.element-text').textContent,'NEW');
});

test('consumer state changes nested badge counts live without mutating defaults, preserving state after invalid input',t=>{
    const root=fixture(t),part={id:'badge',parentId:'menu',name:'Badge',kind:'panel',partRole:'badge',x:65,y:0,w:35,h:30,text:'NEW',notification:{enabled:true,mode:'count',value:5,hideZero:true,maxDisplay:99,valueKey:'nav.buildCount'}},design={schemaVersion:3,projectId:'ux-notify',name:'Notify',revision:1,entryScreen:'main',screens:[{id:'main',name:'Main',kind:'page',elements:[{id:'menu',name:'Menu',kind:'panel',x:0,y:0,w:50,h:50},part]}],transitions:[],fixtures:{balance:0,items:[]}};
    const consumer=mountDesignConsumer(root,design),node=root.children[0].children[0].children.find(child=>child.dataset.element==='badge');
    consumer.updateState({'nav.buildCount':100});assert.equal(node.querySelector('.element-text').textContent,'99+');assert.equal(node.hidden,false);
    consumer.updateState({'nav.buildCount':0});assert.equal(node.hidden,true);
    consumer.updateState({'nav.buildCount':4});assert.equal(node.hidden,false);assert.equal(node.querySelector('.element-text').textContent,'4');
    assert.throws(()=>consumer.updateState({'nav.buildCount':'invalid'}),/알림|배지/);assert.equal(node.querySelector('.element-text').textContent,'4');
    consumer.updateState({});assert.equal(node.querySelector('.element-text').textContent,'5');assert.equal(consumer.getDesign().screens[0].elements[1].notification.value,5);assert.equal(part.notification.value,5);consumer.dispose();
});
const element = (id, type, variant = type) => ({ id, name: id, kind: 'panel', x: 0, y: 0, w: 50, h: 10, text: 'Label', appearance: { shape: 'capsule', fill: '#eeeeee', stroke: '#123456', textColor: '#243549', variant }, control: createControl(type) });

test('native controls suppress static control adornments and restore them when control config is removed', t => {
    const root = fixture(t), screen = { id: 'main', elements: [['toggle', 'toggle'], ['slider', 'slider'], ['tabs', 'tabs'], ['slider', 'progress']].map(([type, variant]) => element(variant, type, variant)) };
    renderLayout(screen, root);
    const nodes = [...root.children], surfaces = nodes.map(node => node.querySelector(':scope > .unit-surface'));
    for (const [index, node] of nodes.entries()) {
        assert.equal(node.classList.contains('variant-' + screen.elements[index].appearance.variant), false);
        assert.ok(node.querySelector(':scope > .ui-control'));
        assert.ok(surfaces[index]);
        assert.equal(surfaces[index].lastElementChild.getAttribute('stroke'), '#123456');
    }
    for (const e of screen.elements) delete e.control;
    renderLayout(screen, root);
    for (const [index, node] of nodes.entries()) {
        assert.equal(root.children[index], node);
        assert.equal(node.classList.contains('variant-' + screen.elements[index].appearance.variant), true);
        assert.equal(node.querySelector(':scope > .ui-control'), null);
        assert.equal(node.querySelector(':scope > .unit-surface'), surfaces[index]);
        assert.equal(node.querySelector(':scope > .element-text').hidden, false);
    }
});
test('native control rendering preserves an explicit frame and noncontrol progress decoration', t => {
    const root = fixture(t), frame = { ...element('frame', 'slider'), partRole: 'frame' }, progress = element('progress', 'slider', 'progress');
    delete progress.control;
    renderLayout({ id: 'main', elements: [frame, progress] }, root);
    assert.equal(root.children[0].querySelector(':scope > .unit-surface').lastElementChild.getAttribute('fill'), 'none');
    assert.equal(root.children[1].classList.contains('variant-progress'), true);
});

test('text labels have transparent surfaces while text styling, selection and separate painted parts survive', t => {
    const root = fixture(t), appearance = { shape: 'rectangle', fill: '#ffffff', stroke: '#123456', textColor: '#654321' };
    const label = { id: 'label', name: 'Amount', kind: 'text', partRole: 'label', x: 0, y: 0, w: 40, h: 10, text: '1,234', fontSize: 20, appearance, interaction: { mode: 'parent', enabled: true, shape: 'rectangle', reason: '' } };
    const screen = { id: 'main', elements: [label, { ...label, id: 'legacy', partRole: undefined }, { ...label, id: 'background', kind: 'panel', partRole: 'background' }, { ...label, id: 'frame', kind: 'panel', partRole: 'frame' }] };
    renderLayout(screen, root);
    assert.equal(root.children[0].querySelector(':scope > .unit-surface'), null);
    assert.equal(root.children[0].querySelector(':scope > .element-text').textContent, '1,234');
    assert.equal(root.children[0].style.color, '#654321');
    assert.match(root.children[0].style.cssText, /font-size:20px/);
    assert.equal(root.children[0].dataset.inputMode, 'parent');
    for (const index of [1, 2]) assert.equal(root.children[index].querySelector(':scope > .unit-surface').lastElementChild.getAttribute('fill'), '#ffffff');
    assert.equal(root.children[3].querySelector(':scope > .unit-surface').lastElementChild.getAttribute('fill'), 'none');
    renderLayout(screen, root, { mode: 'edit', selectedScreen: 'main', selectedElement: 'label' });
    const surfaces = root.children[0].querySelectorAll(':scope > .unit-surface');
    assert.equal(surfaces.length, 1);
    assert.equal(surfaces[0].classList.contains('selection-hatch'), true);
});

test('the same text node drops its painted surface on becoming a label and restores it on leaving that role', t => {
    const root = fixture(t), e = { id: 'amount', name: 'Amount', kind: 'text', x: 0, y: 0, w: 40, h: 10, text: '1,234', appearance: { shape: 'rectangle', fill: '#ffffff' } }, screen = { id: 'main', elements: [e] };
    renderLayout(screen, root); const node = root.children[0];
    assert.ok(node.querySelector(':scope > .unit-surface'));
    e.partRole = 'label'; renderLayout(screen, root);
    assert.equal(root.children[0], node); assert.equal(node.querySelector(':scope > .unit-surface'), null);
    delete e.partRole; renderLayout(screen, root);
    assert.equal(root.children[0], node); assert.ok(node.querySelector(':scope > .unit-surface'));
});

test('changing sibling paint order moves existing nodes once and preserves child content', t => {
    const root=fixture(t), a={id:'hud',name:'HUD',kind:'panel',x:0,y:0,w:100,h:10}, b={id:'back',name:'3D',kind:'panel',x:0,y:0,w:100,h:100}, child={id:'cash',parentId:'hud',name:'Cash',kind:'text',x:0,y:0,w:10,h:10,text:'13,075'};
    const screen={id:'main',elements:[a,b,child]};
    renderLayout(screen,root);
    const hud=root.children[0],back=root.children[1],cash=hud.querySelector('.ui-element'),text=cash.querySelector('.element-text');
    let moves=0;const insert=root.insertBefore.bind(root);root.insertBefore=(node,anchor)=>{moves++;return insert(node,anchor);};
    screen.elements=[b,a,child];renderLayout(screen,root);
    assert.deepEqual(root.children.map(n=>n.dataset.element),['back','hud']);
    assert.equal(root.children[0],back);assert.equal(root.children[1],hud);
    assert.equal(hud.querySelector('.ui-element'),cash);assert.equal(cash.querySelector('.element-text'),text);
    assert.equal(text.textContent,'13,075');assert.equal(moves,1);
    renderLayout(screen,root);assert.equal(moves,1,'unchanged rendering must not move existing focused subtrees');
});

const compoundNotificationDesign = () => ({schemaVersion:3,projectId:'ux-compound-notify',name:'Compound notification',revision:1,entryScreen:'main',screens:[{id:'main',name:'Main',kind:'page',elements:[
    {id:'menu',name:'Menu',kind:'panel',x:0,y:0,w:80,h:80},
    {id:'badge',parentId:'menu',name:'Badge_Notification',kind:'panel',component:'image-frame',partRole:'badge',x:60,y:0,w:30,h:30,text:'ROOT_OLD',notification:{enabled:true,mode:'count',value:5,hideZero:true,maxDisplay:99,valueKey:'nav.buildCount'}},
    {id:'badge-bg',parentId:'badge',name:'Img_Notification_BG',kind:'image',partRole:'image',x:0,y:0,w:100,h:100,image:{src:'',asset:'icon',fit:'contain',alt:'Notification background'}},
    {id:'badge-count',parentId:'badge',name:'Txt_Notification_Count',kind:'text',partRole:'label',x:0,y:0,w:100,h:100,text:'OLD_COUNT',fontSize:18}
]}],transitions:[],fixtures:{balance:0,items:[]}});
const renderedPart = (root,id) => root.querySelectorAll('.ui-element').find(node=>node.dataset.element===id);
const ownText = node => node.querySelector(':scope > .element-text').textContent;

test('compound badge uses one direct count label while dots, cleared config and unrelated labels retain their contracts',t=>{
    const root=fixture(t),design=compoundNotificationDesign(),screen=design.screens[0],badge=screen.elements[1];
    screen.elements.push(
        {id:'nested-label',parentId:'badge-count',name:'Nested',kind:'text',partRole:'label',x:0,y:0,w:20,h:20,text:'NESTED'},
        {id:'ordinary',name:'Ordinary',kind:'text',partRole:'label',x:0,y:0,w:20,h:20,text:'ORDINARY'},
        {id:'legacy',name:'Legacy',kind:'panel',partRole:'badge',x:0,y:0,w:20,h:20,text:'NEW',notification:{...badge.notification}},
        {id:'legacy-child',parentId:'legacy',name:'Legacy child',kind:'text',partRole:'label',x:0,y:0,w:20,h:20,text:'LEGACY_CHILD'}
    );
    const before=structuredClone(design);
    renderLayout(screen,root);
    const node=renderedPart(root,'badge'),count=renderedPart(root,'badge-count'),background=renderedPart(root,'badge-bg');
    assert.equal(ownText(node),'');assert.equal(ownText(count),'5');assert.equal(node.hidden,false);
    assert.equal(ownText(renderedPart(root,'legacy')),'5');assert.equal(ownText(renderedPart(root,'legacy-child')),'LEGACY_CHILD');
    assert.equal(ownText(renderedPart(root,'ordinary')),'ORDINARY');assert.equal(ownText(renderedPart(root,'nested-label')),'NESTED');
    assert.equal(screen.elements[2].notification,undefined);assert.equal(screen.elements[3].notification,undefined);
    assert.deepEqual(design,before);
    badge.notification.mode='dot';renderLayout(screen,root);
    assert.equal(ownText(node),'');assert.equal(ownText(count),'');assert.equal(node.hidden,false);
    badge.notification.value=0;renderLayout(screen,root);assert.equal(node.hidden,true);assert.notEqual(count.hidden,true);
    delete badge.notification;renderLayout(screen,root,{text:part=>'bound:'+part.text});
    assert.equal(node.hidden,false);assert.equal(ownText(node),'');assert.equal(ownText(count),'bound:OLD_COUNT');
    assert.equal(renderedPart(root,'badge-count'),count);assert.equal(renderedPart(root,'badge-bg'),background);
});

test('consumer updates compound count child to 99+, hides its parent at zero and restores the same child and original label',t=>{
    const root=fixture(t),design=compoundNotificationDesign(),before=structuredClone(design),consumer=mountDesignConsumer(root,design);
    try{
        const node=renderedPart(root,'badge'),count=renderedPart(root,'badge-count'),background=renderedPart(root,'badge-bg');
        assert.equal(ownText(node),'');assert.equal(ownText(count),'5');
        consumer.updateState({'nav.buildCount':100});assert.equal(ownText(count),'99+');assert.equal(ownText(node),'');assert.equal(node.hidden,false);
        consumer.updateState({'nav.buildCount':0});assert.equal(node.hidden,true);assert.notEqual(count.hidden,true);
        consumer.updateState({'nav.buildCount':4});assert.equal(node.hidden,false);assert.equal(ownText(count),'4');
        assert.equal(renderedPart(root,'badge-count'),count);assert.equal(renderedPart(root,'badge-bg'),background);
        assert.throws(()=>consumer.updateState({'nav.buildCount':'invalid'}),/알림|배지/);assert.equal(ownText(count),'4');
        consumer.updateState({});assert.equal(ownText(count),'5');assert.deepEqual(design,before);
        consumer.updateState({'nav.buildCount':0});
        const cleared=consumer.getDesign();delete cleared.screens[0].elements[1].notification;consumer.updateDesign(cleared);
        assert.equal(node.hidden,false);assert.equal(ownText(node),'');assert.equal(ownText(count),'OLD_COUNT');
        assert.equal(renderedPart(root,'badge-count'),count);assert.equal(consumer.getDesign().screens[0].elements[3].text,'OLD_COUNT');
    }finally{consumer.dispose();}
});

test('native tabs paint normal/selected three-slice assets in the workspace and inherit authored typography',t=>{
 const root=fixture(t),create=document.createElement;
 document.createElement=tag=>{const node=create(tag);node.style.setProperty=(k,v)=>node.style[k]=v;return node;};
 const tabSkin=createSkin('button'),ref='sha256-'+ 'a'.repeat(64)+'.png';
 tabSkin.textures={normal:{src:'',assetRef:ref,w:128,h:64},selected:{src:'',assetRef:ref.replace('aaaa','bbbb'),w:128,h:64}};
 const tabs={...element('tabs','tabs'),fontSize:27,typography:{weight:900,lineHeight:30},control:{...createControl('tabs'),tabSkin}},screen={id:'main',elements:[tabs]};
 renderLayout(screen,root,{assetView:'art',workspaceId:'ws-tabs'});
 attachControls(root,screen,{},{});
 const fields=root.querySelectorAll('button');assert.equal(fields.length,2);
 assert.equal(fields[0].dataset.skinState,'selected');assert.equal(fields[1].dataset.skinState,'normal');
 assert.match(fields[0].style['--skin-source'],/workspace=ws-tabs/);assert.match(fields[1].style['--skin-source'],/aaaaaaaa/);
 assert.equal(fields[0].style.fontSize,'27px');assert.equal(fields[0].style.fontWeight,'900');assert.equal(fields[0].style.color,'#243549');
 assert.equal(fields[0].style.flex,'1 1 0px');assert.equal(fields[1].style.flex,'1 1 0px');
 fire(fields[1],'click');assert.equal(fields[1].dataset.skinState,'selected');assert.equal(fields[0].dataset.skinState,'normal');
 delete tabs.control.tabSkin;renderLayout(screen,root);assert.equal(fields[0].classList.contains('game-skin'),false);
});

test('fresh consumers retain each explicit workspace in page and modal native-tab resource requests',t=>{
 const rootA=fixture(t),rootB=document.createElement('section'),create=document.createElement;
 document.createElement=tag=>{const node=create(tag);node.style.setProperty=(key,value)=>node.style[key]=value;return node;};
 const oldImage=globalThis.Image,oldLocation=globalThis.location,requests=[];
 globalThis.Image=class {set src(value){requests.push(value);}};
 globalThis.location={pathname:'/ui-studio/preview.html',search:'?workspace=ws-unrelated-default'};
 t.after(()=>{if(oldImage===undefined)delete globalThis.Image;else globalThis.Image=oldImage;if(oldLocation===undefined)delete globalThis.location;else globalThis.location=oldLocation;});
 const normal='sha256-'+ 'a'.repeat(64)+'.png',selected='sha256-'+ 'b'.repeat(64)+'.png',tabSkin=createSkin('button');
 tabSkin.textures={normal:{src:'',assetRef:normal,w:128,h:64},selected:{src:'',assetRef:selected,w:128,h:64}};
 const tabs=id=>({id,name:id,kind:'panel',x:0,y:0,w:100,h:10,control:{type:'tabs',value:'a',options:[{value:'a',label:'A'},{value:'b',label:'B'}],tabSkin:structuredClone(tabSkin)}});
 const design={schemaVersion:3,projectId:'native-tab-namespace',name:'Native tab namespace',revision:1,entryScreen:'main',fixtures:{balance:0,items:[]},screens:[
  {id:'main',name:'Main',kind:'page',elements:[tabs('page-tabs'),{id:'open',name:'Open',kind:'button',x:0,y:20,w:20,h:10}]},
  {id:'modal',name:'Modal',kind:'modal',elements:[tabs('modal-tabs')]}
 ],transitions:[{id:'open-link',fromScreen:'main',fromElement:'open',event:'click',action:'open',condition:'always',targetScreen:'modal'}]};
 for(const [root,workspaceId]of [[rootA,'ws-consumer-a'],[rootB,'ws-consumer-b']]){
  const consumer=mountDesignConsumer(root,design,{workspaceId,assetView:'art'});t.after(()=>consumer.dispose());
  const check=id=>{const node=root.querySelectorAll('.ui-element').find(n=>n.dataset.element===id),buttons=node.querySelectorAll('button');
   assert.equal(buttons.length,2);assert.equal(buttons[0].dataset.skinView,'art');
   for(const field of buttons){const url=new URL(field.style['--skin-source'].slice(5,-2),'http://local.test');assert.equal(url.searchParams.get('workspace'),workspaceId);assert.equal(url.pathname,'/api/ux-studio/asset');}
  };
  check('page-tabs');const opener=root.querySelectorAll('.ui-element').find(n=>n.dataset.element==='open');fire(root,'click',{target:opener,detail:0});check('modal-tabs');
 }
 assert.ok(requests.length>=8);assert.equal(requests.some(url=>url.includes('ws-unrelated-default')),false);
 assert.deepEqual([...new Set(requests.map(url=>new URL(url,'http://local.test').searchParams.get('workspace')))].sort(),['ws-consumer-a','ws-consumer-b']);
});

const groupNotificationDesign=()=>{
 const design=compoundNotificationDesign(),badge=design.screens[0].elements[1];
 delete badge.component;badge.isGroup=true;badge.text='';badge.notification={enabled:true,mode:'dot',value:1,hideZero:true,maxDisplay:99,valueKey:'menu.shopCount'};
 design.screens[0].elements[3].text='1';return design;
};
test('group badge dots clear the direct count label and counts share the compound contract without changing artwork or data',t=>{
 const root=fixture(t),design=groupNotificationDesign(),screen=design.screens[0],badge=screen.elements[1],before=structuredClone(design);
 renderLayout(screen,root);const node=renderedPart(root,'badge'),count=renderedPart(root,'badge-count'),background=renderedPart(root,'badge-bg');
 assert.equal(ownText(node),'');assert.equal(ownText(count),'');assert.equal(node.hidden,false);assert.deepEqual(design,before);
 badge.notification.mode='count';badge.notification.value=7;renderLayout(screen,root);
 assert.equal(ownText(node),'');assert.equal(ownText(count),'7');assert.equal(node.hidden,false);
 badge.notification.value=0;renderLayout(screen,root);assert.equal(node.hidden,true);
 delete badge.notification;renderLayout(screen,root);assert.equal(node.hidden,false);assert.equal(ownText(node),'');assert.equal(ownText(count),'1');
 assert.equal(renderedPart(root,'badge-count'),count);assert.equal(renderedPart(root,'badge-bg'),background);assert.equal(screen.elements[2].notification,undefined);assert.equal(screen.elements[3].notification,undefined);
});
test('consumer group badge updates dots/counts, zero hiding and invalid live values through the same native children',t=>{
 const root=fixture(t),design=groupNotificationDesign(),before=structuredClone(design),consumer=mountDesignConsumer(root,design);
 try{
  const node=renderedPart(root,'badge'),count=renderedPart(root,'badge-count'),background=renderedPart(root,'badge-bg');
  assert.equal(ownText(node),'');assert.equal(ownText(count),'');assert.equal(node.hidden,false);
  consumer.updateState({'menu.shopCount':0});assert.equal(node.hidden,true);
  consumer.updateState({'menu.shopCount':3});assert.equal(node.hidden,false);assert.equal(ownText(count),'');
  const counted=consumer.getDesign();counted.screens[0].elements[1].notification.mode='count';consumer.updateDesign(counted);
  consumer.updateState({'menu.shopCount':100});assert.equal(ownText(node),'');assert.equal(ownText(count),'99+');
  assert.throws(()=>consumer.updateState({'menu.shopCount':-1}),/알림|배지/);assert.equal(ownText(count),'99+');
  consumer.updateState({'menu.shopCount':0});assert.equal(node.hidden,true);consumer.updateState({'menu.shopCount':4});assert.equal(node.hidden,false);assert.equal(ownText(count),'4');
  assert.equal(renderedPart(root,'badge-count'),count);assert.equal(renderedPart(root,'badge-bg'),background);assert.deepEqual(design,before);assert.equal(consumer.getDesign().screens[0].elements[3].text,'1');
 }finally{consumer.dispose();}
});


test('runtime decorative image and text pass pointers through while edit selection and explicit descendant input stay active',t=>{
 const root=fixture(t),interaction=mode=>({mode,enabled:true,shape:'rectangle',reason:''});
 const e=(id,kind,mode,extra={})=>({id,name:id,kind,x:0,y:0,w:100,h:100,text:'',interaction:interaction(mode),...extra});
 const image={src:'',asset:'icon',alt:'Decoration',fit:'contain'};
 const screen={id:'main',name:'Main',kind:'page',elements:[
  e('tabs','panel','action',{control:createControl('tabs')}),
  e('icon','image','none',{image}),e('label','text','none',{text:'Decoration'}),
  e('blocked-icon','image','block',{image}),e('blocked-label','text','block',{text:'Block'}),
  e('action-child','button','action',{parentId:'icon'}),
  e('parent-child','image','parent',{parentId:'icon',image}),
  e('layout-panel','panel','none')
 ]},before=structuredClone(screen),changes=[];
 renderLayout(screen,root,{mode:'view',assetView:'art'});
 attachControls(root,screen,{}, {onChange:change=>changes.push(change)});
 assert.equal(renderedPart(root,'icon').style.pointerEvents,'none');
 assert.equal(renderedPart(root,'label').style.pointerEvents,'none');
 for(const id of ['tabs','blocked-icon','blocked-label','action-child','parent-child','layout-panel'])assert.equal(renderedPart(root,id).style.pointerEvents,'auto',id);
 const tabs=renderedPart(root,'tabs').querySelector('.ui-control');tabs._fields[1].click();
 assert.equal(changes.length,1);assert.equal(changes[0].value,screen.elements[0].control.options[1].value);
 renderLayout(screen,root,{mode:'edit'});
 assert.equal(renderedPart(root,'icon').style.pointerEvents,'auto');
 assert.equal(renderedPart(root,'label').style.pointerEvents,'auto');
 renderLayout(screen,root,{mode:'play',assetView:'art'});
 assert.equal(renderedPart(root,'icon').style.pointerEvents,'none');
 assert.equal(renderedPart(root,'label').style.pointerEvents,'none');
 assert.deepEqual(screen,before);
});

test('overlay visibility keeps authored DOM and scroll alive while selected base roots hide and restore',t=>{
 const root=fixture(t),screen={id:'main',elements:[{id:'world',name:'World',kind:'panel',x:0,y:0,w:100,h:100},{id:'hud',name:'HUD',kind:'list',x:0,y:0,w:100,h:20},{id:'label',parentId:'hud',name:'Label',kind:'text',x:0,y:0,w:50,h:50,text:'Keep'}]},before=structuredClone(screen);
 renderLayout(screen,root);const world=root.children[0],hud=root.children[1],label=hud.querySelector('.ui-element');hud.scrollTop=87;
 renderLayout(screen,root,{suppressedElements:new Set(['hud'])});assert.equal(hud.style.visibility,'hidden');assert.equal(world.style.visibility,'');assert.equal(root.children[1],hud);assert.equal(hud.querySelector('.ui-element'),label);assert.equal(hud.scrollTop,87);
 renderLayout(screen,root);assert.equal(hud.style.visibility,'');assert.equal(hud.scrollTop,87);assert.deepEqual(screen,before);
});
test('consumer applies nested base-layer suppression and restores the same base controls after close',t=>{
 const root=fixture(t),create=document.createElement;
 document.createElement=tag=>{const n=create(tag);n.style.setProperty=(k,v)=>{n.style[k]=v;};n.focus=()=>{document.activeElement=n;};return n;};
 const e=(id,kind='button')=>({id,name:id,kind,x:0,y:0,w:50,h:20}),p=hide=>({type:'modal',effect:'none',durationMs:0,autoCloseMs:0,dim:false,hideBaseElements:hide}),d={schemaVersion:3,projectId:'hidden-base',revision:1,name:'Hidden base',entryScreen:'main',fixtures:{balance:0,items:[]},screens:[{id:'main',name:'Main',kind:'page',elements:[e('open'),e('world','panel'),e('hud','list')]},{id:'a',name:'A',kind:'modal',presentation:p(['hud']),elements:[e('next'),e('close-a')]},{id:'b',name:'B',kind:'modal',presentation:p(['open']),elements:[e('close-b')]}],transitions:[['open','main','open','open','a'],['next','a','next','open','b'],['close-a','a','close-a','close'],['close-b','b','close-b','close']].map(([id,fromScreen,fromElement,action,targetScreen])=>({id,fromScreen,fromElement,action,targetScreen,event:'click',condition:'always'}))};
 const c=mountDesignConsumer(root,d),page=root.children[0],find=(where,id)=>where.querySelectorAll('.ui-element').find(n=>n.dataset.element===id),open=find(page,'open'),hud=find(page,'hud'),world=find(page,'world');hud.scrollTop=91;
 fire(root,'click',{target:open,detail:0});assert.equal(hud.style.visibility,'hidden');assert.equal(world.style.visibility,'');
 fire(root,'click',{target:find(root.children[1],'next'),detail:0});assert.equal(open.style.visibility,'hidden');assert.equal(hud.style.visibility,'hidden');
 fire(root,'click',{target:find(root.children[1],'close-b'),detail:0});assert.equal(open.style.visibility,'');assert.equal(hud.style.visibility,'hidden');
 fire(root,'click',{target:find(root.children[1],'close-a'),detail:0});assert.equal(hud.style.visibility,'');assert.equal(find(page,'hud'),hud);assert.equal(hud.scrollTop,91);assert.equal(page.inert,false);c.dispose();
});

test('press front moves with its label while fixed rim and authored input geometry stay unchanged; release, cancel and keyboard restore',t=>{
 const root=fixture(t),design=stateDesign(),s=design.screens[0],buttonData=s.elements[0];
 buttonData.buttonState.selectable=false;buttonData.buttonState.pressFeedback={enabled:true,target:'state-front',distance:3,shadow:{enabled:true,color:'#000000',opacity:.12,x:0,y:1,blur:1}};
 s.elements.push({id:'state-front',name:'Front',kind:'panel',isGroup:true,interaction:{mode:'parent',enabled:true,shape:'rectangle',reason:''},parentId:buttonData.id,x:0,y:0,w:100,h:100},{id:'state-rim',name:'Rim',kind:'image',parentId:buttonData.id,x:0,y:0,w:100,h:100});
 s.elements[1].parentId=s.elements[2].parentId='state-front';const before=structuredClone(design),consumer=mountDesignConsumer(root,design),find=id=>root.querySelectorAll('.ui-element').find(n=>n.dataset.element===id),button=find('state-button'),front=find('state-front'),rim=find('state-rim'),icon=find('state-icon'),label=find('state-label');
 button.getBoundingClientRect=()=>({left:0,top:0,width:100,height:100});
 // A real pointer lands on the nested label, so every intermediate front group must forward input.
 fire(button,'pointerdown',{target:label,button:0,pointerId:1,clientX:50,clientY:50});assert.equal(front.style.translate,'0 3px');assert.ok(icon.style.filter.includes('drop-shadow(0px 1px 1px rgba(0,0,0,0.12))'));assert.equal(rim.style.translate,undefined);assert.equal(label.parentNode,front);assert.equal(button.style.translate,undefined);
 fire(button,'pointerleave');assert.equal(front.style.translate,'');assert.notEqual(button.dataset.buttonState,'pressed');
 fire(button,'pointerenter',{pointerType:'mouse'});assert.equal(front.style.translate,'0 3px');
 fire(button,'pointermove',{pointerId:1,clientX:150,clientY:50});assert.equal(front.style.translate,'');
 fire(button,'pointermove',{pointerId:1,clientX:50,clientY:50});assert.equal(front.style.translate,'0 3px');
 fire(button,'pointerup',{pointerId:1});assert.equal(front.style.translate,'');assert.equal(icon.style.filter.includes('drop-shadow(0px 1px'),false);
 fire(button,'keydown',{key:'Enter'},true);assert.equal(front.style.translate,'0 3px');fire(button,'keyup',{key:'Enter'},true);assert.equal(front.style.translate,'');assert.equal(consumer.getState().events.length,1);
 fire(button,'keydown',{key:' '},true);fire(button,'blur');assert.equal(front.style.translate,'');fire(button,'keyup',{key:' '},true);assert.equal(consumer.getState().events.length,1);
 fire(button,'pointerdown',{button:0,pointerId:2,pointerType:'touch',clientX:50,clientY:50});fire(button,'pointermove',{pointerId:2,clientX:150,clientY:50});assert.equal(front.style.translate,'');fire(button,'pointercancel',{pointerId:2});assert.equal(front.style.translate,'');
 assert.deepEqual(design,before);consumer.dispose();assert.equal(front.style.translate,'');
});
