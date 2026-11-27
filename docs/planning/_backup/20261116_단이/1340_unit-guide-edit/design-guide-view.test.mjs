import test from 'node:test';
import assert from 'node:assert/strict';

// The DOM boundary is small; iframe rendering is exercised in the real browser.
class Node extends EventTarget {
    constructor(tag, ownerDocument) {
        super(); this.tagName = tag.toUpperCase(); this.ownerDocument = ownerDocument;
        this.children = []; this.dataset = {}; this.style = {}; this.attributes = {};
        this._text = ''; this.contentDocument = null; this.disabled = false;
    }
    set innerHTML(value) { throw Error('Design data must never enter an HTML parser'); }
    set textContent(value) { this._text = String(value); this.children = []; }
    get textContent() { return this._text + this.children.map(child => child.textContent).join(''); }
    append(...nodes) { for (const node of nodes) { node.parentNode = this; this.children.push(node); } }
    replaceChildren(...nodes) { this.children = []; this._text = ''; this.append(...nodes); }
    setAttribute(key, value) { this.attributes[key] = String(value); }
    getAttribute(key) { return this.attributes[key] ?? null; }
    remove() { if (this.parentNode) this.parentNode.children.splice(this.parentNode.children.indexOf(this), 1); this.parentNode = null; }
    get isConnected() { return this === this.ownerDocument.body || !!this.parentNode?.isConnected; }
    focus() { this.ownerDocument.activeElement = this; }
    showModal() { this.open = true; }
    close() { this.open = false; this.dispatchEvent(new Event('close')); }
}
function dom() {
    const doc = {createElement: tag => new Node(tag, doc), activeElement: null};
    doc.body = new Node('body', doc);
    const opener = doc.createElement('button'); doc.body.append(opener); opener.focus();
    return {doc, opener};
}
function all(root, predicate) { return root.children.flatMap(child => [...(predicate(child) ? [child] : []), ...all(child, predicate)]); }
const button = (root, text) => all(root, node => node.tagName === 'BUTTON' && node.textContent === text)[0];
const fixture = () => ({schemaVersion:4, projectId:'guide-view', revision:2, screens:[{
    id:'page', name:'Page <script>bad()</script>', kind:'page', logicalSize:{width:400,height:800}, elements:[
        {id:'group',name:'Group',kind:'panel',x:10,y:20,w:80,h:20},
        {id:'child',parentId:'group',name:'Txt_<img src=x onerror=bad()>',kind:'text',text:'safe',x:25,y:10,w:50,h:50,fontSize:20}
    ]
}]});

test('child selection rebuilds read-only geometry and the edit callback receives the selected stable ID', async () => {
    const {openDesignGuide} = await import('../../src/tools/uxStudio/design-guide-view.mjs');
    const {doc,opener} = dom(), previous = globalThis.document;
    globalThis.document = doc;
    try {
        const design = fixture(), before = structuredClone(design), selections = [], edits = [];
        const dialog = openDesignGuide({document:design,screenId:'page',elementId:'group',onSelect:id=>selections.push(id),onEdit:id=>{
            assert.equal(dialog.isConnected,false); assert.equal(doc.activeElement,opener); edits.push(id);
        }});
        assert.equal(doc.activeElement,button(dialog,'닫기'));
        assert.ok(dialog.textContent.includes('400 × 800'));
        assert.ok(dialog.textContent.includes('A · 유닛 너비 · 320 px (100%)'));
        assert.ok(dialog.textContent.includes('B · 유닛 높이 · 160 px (100%)'));
        assert.ok(dialog.textContent.includes('Txt_<img src=x onerror=bad()>'));
        button(dialog,'Txt_<img src=x onerror=bad()>').dispatchEvent(new Event('click'));
        assert.deepEqual(selections,['child']);
        assert.equal(dialog.dataset.element,'child');
        assert.ok(dialog.textContent.includes('20 px'));
        button(dialog,'선택 부품 세부 편집').dispatchEvent(new Event('click'));
        assert.deepEqual(edits,['child']);
        assert.deepEqual(design,before);
    } finally { globalThis.document = previous; }
});

test('screen root disables element editing and Escape removes the dialog and restores focus', async () => {
    const {openDesignGuide} = await import('../../src/tools/uxStudio/design-guide-view.mjs');
    const {doc,opener} = dom(), previous = globalThis.document;
    globalThis.document = doc;
    try {
        const dialog = openDesignGuide({document:fixture(),screenId:'page',elementId:null});
        assert.equal(button(dialog,'선택 부품 세부 편집').disabled,true);
        const event = new Event('keydown',{cancelable:true}); Object.defineProperty(event,'key',{value:'Escape'});
        dialog.dispatchEvent(event);
        assert.equal(event.defaultPrevented,true);
        assert.equal(dialog.isConnected,false);
        assert.equal(doc.activeElement,opener);
    } finally { globalThis.document = previous; }
});

test('diagram hides zero content padding without hiding values or renumbering the remaining redlines', async () => {
    const {openDesignGuide,guideDiagramDimensions} = await import('../../src/tools/uxStudio/design-guide-view.mjs');
    const {doc} = dom(), previous = globalThis.document;
    globalThis.document = doc;
    try {
        const design = fixture();
        Object.assign(design.screens[0].elements[1],{x:0,y:0,w:100,h:100});
        const dialog = openDesignGuide({document:design,screenId:'page',elementId:'group'});
        assert.ok(dialog.textContent.includes('C · 내용 왼쪽 여백 · 0 px (0%)'));
        const dimensions = [
            {key:'size',kind:'size',axis:'x',x1:0,y1:0,x2:100,y2:0,valuePx:100,valuePercent:100,label:'너비'},
            {key:'padding-zero',kind:'padding',axis:'x',x1:0,y1:0,x2:0,y2:0,valuePx:0,valuePercent:0,label:'여백'},
            {key:'gap',kind:'gap',axis:'x',x1:0,y1:0,x2:12,y2:0,valuePx:12,valuePercent:12,label:'간격'},
            {key:'padding-nonzero',kind:'padding',axis:'x',x1:0,y1:0,x2:8,y2:0,valuePx:8,valuePercent:8,label:'여백'},
            {key:'size-zero',kind:'size',axis:'y',x1:0,y1:0,x2:0,y2:0,valuePx:0,valuePercent:0,label:'높이'}
        ];
        const before = structuredClone(dimensions);
        assert.deepEqual(guideDiagramDimensions(dimensions).map(([index,item])=>[index,item.key]),[[0,'size'],[2,'gap'],[3,'padding-nonzero'],[4,'size-zero']]);
        assert.deepEqual(dimensions,before);
        dialog.close();
    } finally { globalThis.document = previous; }
});
