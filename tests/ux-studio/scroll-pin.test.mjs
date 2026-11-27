import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const pin = await import('../../src/tools/uxStudio/scroll-pin.mjs').catch(() => ({}));
import {validateDocument,readDesignFile} from '../../src/tools/uxStudio/model.mjs';
import {applyResponsiveEdit,responsiveInspectorHTML} from '../../src/tools/uxStudio/responsive-inspector.mjs';

test('optional scroll pin rejects malformed saved values without changing an absent property', () => {
    assert.equal(typeof pin.validateScrollPin, 'function');
    assert.equal(pin.validateScrollPin(undefined), undefined);
    const value = {top: 219};
    assert.equal(pin.validateScrollPin(value), value);
    assert.doesNotThrow(() => pin.validateScrollPin({top: 0}));
    for (const value of [null, false, [], {}, {top: '219'}, {top: -1}, {top: 10001}, {top: NaN}, {top: Infinity}, {top: 2, left: 0}]) {
        assert.throws(() => pin.validateScrollPin(value));
    }
});

test('vertical pin follows natural content until its threshold and restores on reverse scroll', () => {
    assert.equal(typeof pin.scrollPinOffset, 'function');
    const geometry = {top: 219, naturalTop: 671, height: 90, parentBottom: 1700};
    for (const [scrollTop, want] of [[0, 0], [200, 0], [452, 0], [500, 48], [800, 348], [200, 0], [-20, 0]]) {
        assert.equal(pin.scrollPinOffset({...geometry, scrollTop}), want);
    }
});

test('parent end wins over the pin threshold and an undersized parent never pushes content upward', () => {
    assert.equal(typeof pin.scrollPinOffset, 'function');
    assert.equal(pin.scrollPinOffset({top: 219, naturalTop: 671, height: 90, parentBottom: 1000, scrollTop: 900}), 239);
    assert.equal(pin.scrollPinOffset({top: 219, naturalTop: 671, height: 90, parentBottom: 700, scrollTop: 900}), 0);
    assert.throws(() => pin.scrollPinOffset({top: 0, naturalTop: NaN, height: 90, parentBottom: 1000, scrollTop: 0}));
});

// A DOM boundary double: layout coordinates stay logical under CSS transforms, as in the tool.
class LayoutNode extends EventTarget {
    constructor(id, {top = 0, height = 100, overflowY = 'visible', overflowX = 'visible', screen = 'screen'} = {}) {
        super();
        this.dataset = {element: id, screen};
        this.style = {top: top + 'px', height: height + 'px', translate: '', transform: ''};
        this.children = [];
        this.scrollTop = this.scrollLeft = this.clientTop = 0;
        this.clientHeight = this.scrollHeight = height;
        this.overflowY = overflowY;
        this.overflowX = overflowX;
    }
    append(child) {
        child.parentElement = child.offsetParent = this;
        child.ownerDocument = this.ownerDocument;
        this.children.push(child);
        return child;
    }
    get offsetTop() { return numericTop(this.style.top, this.offsetParent?.clientHeight); }
    get offsetHeight() { return Number.parseFloat(this.style.height); }
    querySelectorAll() { return this.children.flatMap(child => [child, ...child.querySelectorAll()]); }
    contains(node) { return node === this || this.querySelectorAll().includes(node); }
}
function numericTop(value, basis = 0) {
    const values = [...value.matchAll(/-?\d+(?:\.\d+)?(?:px|%)?/g)].map(match => match[0].endsWith('%') ? Number.parseFloat(match[0]) * basis / 100 : Number.parseFloat(match[0]));
    return values.reduce((total, item) => total + item, 0);
}
function fixture({nested = false, horizontal = false} = {}) {
    const view = new EventTarget();
    const observers = [];
    view.getComputedStyle = node => ({top: numericTop(node.style.top, node.offsetParent?.clientHeight) + 'px', height: node.offsetHeight+'px', boxSizing: 'border-box', overflowY: node.style.overflowY||node.overflowY, overflowX: node.style.overflowX||node.overflowX});
    view.ResizeObserver = class {
        constructor(callback) { this.callback = callback; this.nodes = []; observers.push(this); }
        observe(node) { this.nodes.push(node); }
        disconnect() { this.nodes = []; }
    };
    const root = new LayoutNode('root', {height: 984});
    root.ownerDocument = {defaultView: view};
    const outer = root.append(new LayoutNode('outer', {top: 100, height: 600, overflowY: 'auto'}));
    outer.scrollHeight = 2200;
    const scrollport = nested ? outer.append(new LayoutNode('inner', {top: 80, height: 500, overflowY: 'auto'})) : outer;
    scrollport.scrollHeight = 1800;
    const parent = scrollport.append(new LayoutNode('content', {height: 1700}));
    const horizontalPort = horizontal ? parent.append(new LayoutNode('horizontal', {top: 10, height: 1200, overflowX: 'auto', overflowY: 'hidden'})) : parent;
    const node = horizontalPort.append(new LayoutNode('card', {top: horizontal ? 661 : 671, height: 90}));
    const screen = {id: 'screen', elements: [{id: 'card', scrollPin: {top: 219}}]};
    return {root, outer, scrollport, parent, horizontalPort, node, screen, view, observers};
}

test('scope changes only top, keeps press translation, and reapplies after the renderer resets styles', () => {
    assert.equal(typeof pin.attachScrollPins, 'function');
    const f = fixture();
    f.node.style.translate = '0 3px';
    f.node.style.transform = 'scale(1)';
    pin.attachScrollPins(f.root, f.screen);
    f.scrollport.scrollTop = 500;
    f.scrollport.dispatchEvent(new Event('scroll'));
    assert.equal(f.node.offsetTop, 719);
    assert.equal(f.node.style.translate, '0 3px');
    assert.equal(f.node.style.transform, 'scale(1)');
    f.node.style.top = '671px';
    pin.attachScrollPins(f.root, f.screen);
    assert.equal(f.node.offsetTop, 719);
    f.scrollport.scrollTop = 100;
    f.scrollport.dispatchEvent(new Event('scroll'));
    assert.equal(f.node.style.top, '671px');
    pin.disposeScrollPins(f.root);
});

test('nearest vertical port owns nested scrolling and horizontal scroll does not change the vertical result', () => {
    assert.equal(typeof pin.attachScrollPins, 'function');
    const f = fixture({nested: true, horizontal: true});
    pin.attachScrollPins(f.root, f.screen);
    f.scrollport.scrollTop = 500;
    f.scrollport.dispatchEvent(new Event('scroll'));
    assert.equal(f.node.offsetTop, 709);
    f.outer.scrollTop = 300;
    f.outer.dispatchEvent(new Event('scroll'));
    f.horizontalPort.scrollLeft = 250;
    f.horizontalPort.dispatchEvent(new Event('scroll'));
    assert.equal(f.node.offsetTop, 709);
    pin.disposeScrollPins(f.root);
});

test('logical pin coordinates are stable at device scale and recompute on resize', () => {
    assert.equal(typeof pin.attachScrollPins, 'function');
    const f = fixture();
    f.root.style.transform = 'scale(0.5)';
    f.node.style.top = '671.25px';
    pin.attachScrollPins(f.root, f.screen);
    f.scrollport.scrollTop = 500.5;
    f.scrollport.dispatchEvent(new Event('scroll'));
    assert.equal(f.node.offsetTop, 719.5);
    f.root.style.transform = 'scale(1.25)';
    f.view.dispatchEvent(new Event('resize'));
    assert.equal(f.node.offsetTop, 719.5);
    f.parent.clientHeight = 750;
    for (const observer of f.observers) observer.callback();
    assert.equal(f.node.offsetTop, 671.25);
    pin.disposeScrollPins(f.root);
});

test('direct child of a scrollport uses its full content end rather than its viewport height', () => {
    assert.equal(typeof pin.attachScrollPins, 'function');
    const f = fixture();
    f.parent.children = [];
    f.scrollport.append(f.node);
    pin.attachScrollPins(f.root, f.screen);
    f.scrollport.scrollTop = 1200;
    f.scrollport.dispatchEvent(new Event('scroll'));
    assert.equal(f.node.offsetTop, 1419);
    pin.disposeScrollPins(f.root);
});

test('missing pin metadata is inert and removing a pin restores authored top', () => {
    assert.equal(typeof pin.attachScrollPins, 'function');
    const f = fixture();
    pin.attachScrollPins(f.root, {id: 'screen', elements: [{id: 'card'}]});
    assert.equal(f.observers.length, 0);
    assert.equal(f.node.style.top, '671px');
    pin.attachScrollPins(f.root, f.screen);
    f.scrollport.scrollTop = 500;
    f.scrollport.dispatchEvent(new Event('scroll'));
    pin.attachScrollPins(f.root, {id: 'screen', elements: [{id: 'card'}]});
    assert.equal(f.node.style.top, '671px');
    f.scrollport.scrollTop = 800;
    f.scrollport.dispatchEvent(new Event('scroll'));
    assert.equal(f.node.style.top, '671px');
});

test('disposing a removed screen detaches events and observers without overwriting a later render', () => {
    assert.equal(typeof pin.disposeScrollPins, 'function');
    const f = fixture();
    pin.attachScrollPins(f.root, f.screen);
    f.scrollport.scrollTop = 500;
    f.scrollport.dispatchEvent(new Event('scroll'));
    f.node.style.top = '700px';
    pin.disposeScrollPins(f.root);
    f.scrollport.scrollTop = 800;
    f.scrollport.dispatchEvent(new Event('scroll'));
    f.view.dispatchEvent(new Event('resize'));
    assert.equal(f.node.style.top, '700px');
    assert.ok(f.observers.every(observer => observer.nodes.length === 0));
    pin.disposeScrollPins(f.root);
});

test('unsupported empty or auto inline top safely skips without writing an invalid calc or keeping observers', () => {
    assert.equal(typeof pin.attachScrollPins, 'function');
    for (const top of ['', 'auto', 'inherit', '2rem']) {
        const f = fixture(); f.node.style.top = top;
        pin.attachScrollPins(f.root, f.screen);
        f.scrollport.scrollTop = 500; f.scrollport.dispatchEvent(new Event('scroll'));
        assert.equal(f.node.style.top, top);
        assert.equal(f.observers.length, 0);
        pin.disposeScrollPins(f.root);
    }
    const f = fixture();pin.attachScrollPins(f.root, f.screen);
    f.node.style.top = 'auto';f.scrollport.scrollTop = 500;f.scrollport.dispatchEvent(new Event('scroll'));
    assert.equal(f.node.style.top, 'auto');pin.disposeScrollPins(f.root);
});

test('detached serialization roots stay inert and can attach after mounting', () => {
    const f=fixture();f.root.isConnected=false;
    pin.attachScrollPins(f.root,f.screen);assert.equal(f.observers.length,0);
    f.scrollport.scrollTop=500;f.scrollport.dispatchEvent(new Event('scroll'));assert.equal(f.node.style.top,'671px');
    f.root.isConnected=true;pin.attachScrollPins(f.root,f.screen);assert.equal(f.node.offsetTop,719);
    pin.disposeScrollPins(f.root);
});

test('percent top preserves its authored expression across parent resize and reverse scrolling', () => {
    assert.equal(typeof pin.attachScrollPins, 'function');
    const f = fixture();f.parent.clientHeight = 3350;f.scrollport.clientHeight = 912;f.node.style.top = '20%';
    pin.attachScrollPins(f.root, f.screen);f.scrollport.scrollTop = 500;f.scrollport.dispatchEvent(new Event('scroll'));
    assert.equal(f.node.offsetTop, 719);
    f.parent.clientHeight = 3000;for (const observer of f.observers) observer.callback();
    assert.equal(f.node.offsetTop, 719);
    f.scrollport.scrollTop = 0;f.scrollport.dispatchEvent(new Event('scroll'));
    assert.equal(f.node.style.top, '20%');pin.disposeScrollPins(f.root);
});

const part = (id, more = {}) => ({id, name:id, kind:'panel', x:0,y:0,w:100,h:100,...more});
function documentFixture() {
    return {schemaVersion:4,projectId:'scroll-pin',name:'Scroll pin',revision:1,entryScreen:'screen',screens:[{id:'screen',name:'Screen',kind:'page',logicalSize:{w:551,h:984},elements:[
        part('viewport',{h:912/984*100,overflow:'scroll-y'}),
        part('content',{parentId:'viewport',h:3350/912*100,isGroup:true}),
        part('marker',{parentId:'content',x:399/551*100,y:671/3350*100,w:141/551*100,h:89/3350*100,scrollPin:{top:219}})
    ]}],transitions:[],fixtures:{balance:0,items:[]}};
}

test('public import accepts bounded v4 optional pin and rejects legacy, missing vertical owner and ancestor pin combinations', async () => {
    const d = documentFixture(), before = structuredClone(d);validateDocument(d);assert.deepEqual(d,before);
    const text = JSON.stringify(d), imported = await readDesignFile({size:Buffer.byteLength(text),text:async()=>text});
    assert.deepEqual(imported.screens[0].elements[2].scrollPin,{top:219});
    for (const change of [
        next=>next.schemaVersion=3,
        next=>next.screens[0].elements[0].overflow='scroll-x',
        next=>next.screens[0].elements[2].scrollPin={top:-1},
        next=>next.screens[0].elements[2].scrollPin={top:10001},
        next=>next.screens[0].elements[1].scrollPin={top:0},
        next=>delete next.screens[0].elements[2].parentId
    ]) {const next=structuredClone(d);change(next);assert.throws(()=>validateDocument(next));}
    const legacy=structuredClone(d);delete legacy.screens[0].elements[2].scrollPin;delete legacy.screens[0].elements[0].overflow;legacy.schemaVersion=3;
    const original=structuredClone(legacy);validateDocument(legacy);assert.deepEqual(legacy,original);
    const legacyPin=structuredClone(d);legacyPin.schemaVersion=3;delete legacyPin.screens[0].elements[0].overflow;legacyPin.screens[0].elements[0].kind='list';
    assert.throws(()=>validateDocument(legacyPin),/버전 4/);
});

test('inspector explicitly enables, edits and removes pin on immutable copies with no-op OFF preserving legacy documents', () => {
    const d=documentFixture();delete d.screens[0].elements[2].scrollPin;const before=structuredClone(d),size={w:551,h:984};
    const enabled=applyResponsiveEdit(d,'screen','marker','scrollPin.mode','enabled',size);
    assert.deepEqual(enabled.screens[0].elements[2].scrollPin,{top:0});
    const edited=applyResponsiveEdit(enabled,'screen','marker','scrollPin.top','219',size);
    assert.deepEqual(edited.screens[0].elements[2].scrollPin,{top:219});
    const disabled=applyResponsiveEdit(edited,'screen','marker','scrollPin.mode','none',size);
    assert.deepEqual(disabled,d);assert.deepEqual(d,before);
    assert.throws(()=>applyResponsiveEdit(enabled,'screen','marker','scrollPin.top','-1',size));
    assert.throws(()=>applyResponsiveEdit(enabled,'screen','marker','scrollPin.top','',size));
    const legacy=structuredClone(d);delete legacy.screens[0].elements[0].overflow;legacy.schemaVersion=3;
    assert.deepEqual(applyResponsiveEdit(legacy,'screen','marker','scrollPin.mode','none',size),legacy);
    const html=responsiveInspectorHTML(edited.screens[0],edited.screens[0].elements[2]);
    assert.match(html,/data-responsive-field="scrollPin.mode"/);assert.match(html,/data-responsive-field="scrollPin.top"/);
});

test('the authored 912 viewport and 3350 content hold the 671 marker at 219 through the native scroll range', () => {
    assert.equal(typeof pin.attachScrollPins,'function');
    const f=fixture();f.scrollport.clientHeight=912;f.scrollport.scrollHeight=3350;f.parent.clientHeight=3350;f.node.style.height='89px';
    pin.attachScrollPins(f.root,f.screen);
    for (const [scrollTop,want] of [[0,671],[452,219],[500,219],[2438,219],[200,471],[0,671]]) {
        f.scrollport.scrollTop=scrollTop;f.scrollport.dispatchEvent(new Event('scroll'));
        assert.equal(f.node.offsetTop-scrollTop,want);
    }
    pin.disposeScrollPins(f.root);
});

class RenderNode extends LayoutNode {
    constructor(tag, doc) {
        super('', {height:984});this.tagName=tag.toUpperCase();this.ownerDocument=doc;this.className='';this.attributes={};this.style.height='100%';
        this.classList={contains:name=>this.className.split(' ').includes(name),add:name=>{this.className+=' '+name;},toggle:(name,on)=>{this.className=this.className.split(' ').filter(value=>value!==name).concat(on?[name]:[]).join(' ');}};
        this.style.setProperty=(key,value)=>{this.style[key]=value;};
        Object.defineProperty(this.style,'cssText',{set:value=>{for(const key of Object.keys(this.style))if(key!=='setProperty')delete this.style[key];for(const field of value.split(';')){const at=field.indexOf(':');if(at>0)this.style[field.slice(0,at).replace(/-([a-z])/g,(_all,char)=>char.toUpperCase())]=field.slice(at+1);}}});
        Object.defineProperty(this,'clientHeight',{get:()=>numericTop(this.style.height||'100%',this.parentElement?.clientHeight??984)});
        Object.defineProperty(this,'scrollHeight',{get:()=>Math.max(this.clientHeight,...this.children.filter(node=>node.classList?.contains('ui-element')).map(node=>node.offsetTop+node.offsetHeight))});
    }
    get offsetHeight(){return this.clientHeight;}
    get isConnected(){return this._connected===true||this.parentElement?.isConnected===true;}
    querySelectorAll(selector='*'){const all=this.children.flatMap(child=>[child,...child.querySelectorAll('*')]);if(selector==='*')return all;const names=[...selector.matchAll(/\.([\w-]+)/g)].map(match=>match[1]);return names.length?all.filter(node=>names.some(name=>node.classList.contains(name))):[];}
    querySelector(selector){const name=selector.match(/\.([\w-]+)/)?.[1];return (selector.startsWith(':scope')?this.children:this.querySelectorAll('*')).find(node=>node.classList.contains(name))||null;}
    setAttribute(key,value){this.attributes[key]=String(value);}
    getAttribute(key){return this.attributes[key]??null;}
    removeAttribute(key){delete this.attributes[key];}
    get firstElementChild(){return this.children[0]||null;}
    replaceChildren(...nodes){for(const child of this.children)child.parentElement=child.offsetParent=null;this.children=[];this.append(...nodes);}
    append(...nodes){for(const node of nodes){if(node.parentElement)node.remove();super.append(node);}return nodes[0];}
    remove(){if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(node=>node!==this);this.parentElement=this.offsetParent=null;}
}
function rendererFixture(t) {
    const f=fixture(),doc=f.root.ownerDocument;doc.activeElement=null;doc.createElement=tag=>new RenderNode(tag,doc);
    const previous=globalThis.document;globalThis.document=doc;t.after(()=>{if(previous===undefined)delete globalThis.document;else globalThis.document=previous;});
    const root=doc.createElement('section');root.style.height='984px';root._connected=true;return {root,doc,observers:f.observers,view:f.view};
}

for(const mode of ['edit','view'])test(`shared renderer applies optional pin in ${mode} mode and retains authored geometry`,async t=>{
    const {renderLayout}=await import('../../src/tools/uxStudio/layout-view.mjs'),f=rendererFixture(t),d=documentFixture(),before=structuredClone(d);
    renderLayout(d.screens[0],f.root,{mode});
    const nodes=new Map(f.root.querySelectorAll('.ui-element').map(node=>[node.dataset.element,node])),viewport=nodes.get('viewport'),marker=nodes.get('marker');
    viewport.scrollTop=500;viewport.dispatchEvent(new Event('scroll'));
    assert.ok(Math.abs(marker.offsetTop-500-219)<1e-8);assert.deepEqual(d,before);
    pin.disposeScrollPins(f.root);
});

test('consumer update and dispose remove live scroll pin effects and detach observers',async t=>{
    const {mountDesignConsumer}=await import('../../src/tools/uxStudio/consumer.mjs'),f=rendererFixture(t),d=documentFixture(),consumer=mountDesignConsumer(f.root,d);
    const page=f.root.firstElementChild,lookup=()=>new Map(page.querySelectorAll('.ui-element').map(node=>[node.dataset.element,node]));
    let nodes=lookup();const viewport=nodes.get('viewport');viewport.scrollTop=500;viewport.dispatchEvent(new Event('scroll'));
    assert.ok(Math.abs(nodes.get('marker').offsetTop-500-219)<1e-8);
    const off=structuredClone(d);off.revision++;delete off.screens[0].elements[2].scrollPin;consumer.updateDesign(off);
    nodes=lookup();assert.ok(Math.abs(nodes.get('marker').offsetTop-671)<1e-8);
    viewport.scrollTop=800;viewport.dispatchEvent(new Event('scroll'));assert.ok(Math.abs(nodes.get('marker').offsetTop-671)<1e-8);
    d.revision+=2;consumer.updateDesign(d);nodes=lookup();const marker=nodes.get('marker');assert.ok(Math.abs(marker.offsetTop-800-219)<1e-8);
    consumer.dispose();const top=marker.style.top;viewport.scrollTop=1000;viewport.dispatchEvent(new Event('scroll'));f.view.dispatchEvent(new Event('resize'));
    assert.equal(marker.style.top,top);assert.ok(f.observers.every(observer=>observer.nodes.length===0));
});

test('detail preview attaches pins only after its screen is mounted and cleans every preview root',async t=>{
    const {renderLayout}=await import('../../src/tools/uxStudio/layout-view.mjs'),{screenById}=await import('../../src/tools/uxStudio/model.mjs'),{overlayBaseHiddenElements}=await import('../../src/tools/uxStudio/overlay-runtime.mjs');
    const source=await readFile('src/tools/uxStudio/main.mjs','utf8'),f=rendererFixture(t),d=documentFixture(),host=f.root;host.clientWidth=1000;
    const scope={doc:d,mode:'edit',selectedScreen:'screen',previewBase:'screen',profile:'design',profiles:{design:{}},detailDevicePreview:()=>({logical:{w:551,h:984},device:{w:551,h:984},scale:1}),screenById,overlayBaseHiddenElements,zoom:'1',selectedIds:[],selectedElement:null,demoOverlay:null,zoomAnchor:null,viewMemory:null,handTool:false,spaceDown:false,snap:false,editingComponent:null,runtime:{page:'screen',overlays:[],scroll:{}},document:f.doc,$:id=>id==='#preview-host'?host:{},renderElements:(screen,container)=>renderLayout(screen,container,{mode:'edit'}),attachEditor:()=>()=>{},attachScrollPins:pin.attachScrollPins,disposeScrollPins:pin.disposeScrollPins};
    vm.createContext(scope);const start=source.indexOf('function renderPreview(');vm.runInContext(source.slice(start,source.indexOf('function flow(',start)),scope);scope.renderPreview();
    const nodes=new Map(host.querySelectorAll('.ui-element').map(node=>[node.dataset.element,node])),viewport=nodes.get('viewport'),marker=nodes.get('marker');
    viewport.scrollTop=500;viewport.dispatchEvent(new Event('scroll'));assert.ok(Math.abs(marker.offsetTop-500-219)<1e-8);assert.equal(f.observers.length,1);
    scope.app=host;const helper=source.indexOf('function disposePreviewPins(');vm.runInContext(source.slice(helper,source.indexOf('\n',helper))+'\ndisposePreviewPins();',scope);
    assert.ok(Math.abs(marker.offsetTop-671)<1e-8);viewport.scrollTop=800;viewport.dispatchEvent(new Event('scroll'));assert.ok(Math.abs(marker.offsetTop-671)<1e-8);
    assert.ok(f.observers.every(observer=>observer.nodes.length===0));
});
