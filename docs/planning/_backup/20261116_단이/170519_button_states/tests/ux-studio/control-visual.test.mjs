import test from 'node:test';
import assert from 'node:assert/strict';
import { renderLayout } from '../../src/tools/uxStudio/layout-view.mjs';
import { createControl } from '../../src/tools/uxStudio/controls.mjs';
import {mountDesignConsumer} from '../../src/tools/uxStudio/consumer.mjs';

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
    get lastElementChild() { return this.children.at(-1); }
    closest(selector) { return selector === 'button' && this.tagName === 'BUTTON' ? this : this.parentNode?.closest(selector) || null; }
    querySelectorAll(selector) {
        const direct = selector.startsWith(':scope > '), simple = direct ? selector.slice(9) : selector;
        const matches = n => simple.startsWith('.') ? n.classList.contains(simple.slice(1)) : n.tagName.toLowerCase() === simple;
        return this.children.flatMap(n => [...(matches(n) ? [n] : []), ...(direct ? [] : n.querySelectorAll(selector))]);
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    contains(n) { return n === this || this.children.some(child => child.contains(n)); }
}
function fixture(t) {
    const previous = globalThis.document;
    const doc = { createElement: tag => new Node(tag, doc), createElementNS: (_ns, tag) => new Node(tag, doc) };
    globalThis.document = doc;
    t.after(() => { if (previous === undefined) delete globalThis.document; else globalThis.document = previous; });
    return doc.createElement('section');
}

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
