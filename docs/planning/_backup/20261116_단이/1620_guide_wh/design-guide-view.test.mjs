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

const input = (root,label) => all(root,node => node.getAttribute('aria-label') === label)[0];

test('guide position fields commit parent logical pixels once and refresh from the returned design', async () => {
    const {openDesignGuide} = await import('../../src/tools/uxStudio/design-guide-view.mjs');
    const {doc} = dom(), previous = globalThis.document; globalThis.document = doc;
    try {
        const design = fixture(), before = structuredClone(design), changes = [];
        const dialog = openDesignGuide({document:design,screenId:'page',elementId:'child',onChange:change => {
            changes.push(change);
            const next = structuredClone(design);
            Object.assign(next.screens[0].elements[1],{x:30,y:12.5,w:46.875,h:40});
            return next;
        }});
        for (const [key,value] of Object.entries({x:96,y:20,w:150,h:64})) input(dialog,'가이드 '+key+' px').value=String(value);
        button(dialog,'위치·크기 적용').dispatchEvent(new Event('click'));
        assert.deepEqual(changes,[{type:'rect',screenId:'page',elementId:'child',rect:{x:96,y:20,w:150,h:64}}]);
        assert.equal(input(dialog,'가이드 w px').value,'150');
        assert.ok(dialog.textContent.includes('편집 가능'));
        input(dialog,'가이드 w px').value='0';
        button(dialog,'위치·크기 적용').dispatchEvent(new Event('click'));
        assert.equal(changes.length,1);
        assert.ok(dialog.textContent.includes('0보다 큰'));
        assert.deepEqual(design,before); dialog.close();
    } finally { globalThis.document = previous; }
});

test('automatic-layout children keep geometry locked while text edits and callback failures stay in the dialog', async () => {
    const {openDesignGuide} = await import('../../src/tools/uxStudio/design-guide-view.mjs');
    const {doc} = dom(), previous = globalThis.document; globalThis.document = doc;
    try {
        const design = fixture(), changes = [];
        design.screens[0].elements[0].layout={type:'horizontal',gap:0,padding:[0,0,0,0],itemSize:[100,40]};
        const dialog = openDesignGuide({document:design,screenId:'page',elementId:'child',onChange:change => {changes.push(change);throw Error('저장 전 검증 실패');}});
        assert.equal(button(dialog,'위치·크기 적용').disabled,true);
        assert.equal(input(dialog,'가이드 x px').disabled,true);
        assert.ok(dialog.textContent.includes('자동 배치'));
        input(dialog,'가이드 글자').value='changed'; input(dialog,'가이드 글자 크기 px').value='24';
        button(dialog,'글자 적용').dispatchEvent(new Event('click'));
        assert.deepEqual(changes,[{type:'text',screenId:'page',elementId:'child',text:'changed',fontSize:24}]);
        assert.ok(dialog.textContent.includes('저장 전 검증 실패'));
        assert.equal(dialog.isConnected,true); dialog.close();
    } finally { globalThis.document = previous; }
});

test('late image import cannot apply to a different selected unit and image removal commits null', async () => {
    const {openDesignGuide} = await import('../../src/tools/uxStudio/design-guide-view.mjs');
    const {doc} = dom(), previous = globalThis.document; globalThis.document = doc;
    try {
        const design = fixture(), changes = [], requests = [];
        design.screens[0].elements[0].image={src:'data:image/png;base64,old'};
        let finish;
        const dialog = openDesignGuide({document:design,screenId:'page',elementId:'group',onImportImage:request => {requests.push(request);return new Promise(resolve=>{finish=resolve;});},onChange:change => {changes.push(change);const next=structuredClone(design);next.screens[0].elements[0].image=change.image;return next;}});
        input(dialog,'프로젝트 이미지 경로').value='assets/new.png';
        button(dialog,'경로 이미지 넣기').dispatchEvent(new Event('click'));
        assert.deepEqual(requests,[{path:'assets/new.png'}]);
        button(dialog,'Txt_<img src=x onerror=bad()>').dispatchEvent(new Event('click'));
        finish({src:'data:image/png;base64,new'}); await Promise.resolve(); await Promise.resolve();
        assert.deepEqual(changes,[]);
        button(dialog,'Group').dispatchEvent(new Event('click'));
        button(dialog,'이미지 빼기').dispatchEvent(new Event('click'));
        assert.deepEqual(changes,[{type:'image',screenId:'page',elementId:'group',image:null}]);
        dialog.close();
    } finally { globalThis.document = previous; }
});

test('guide edge drag converts pointer pixels through zoom and clamps crossed edges without moving the opposite side', async () => {
    const {guideDragRect} = await import('../../src/tools/uxStudio/design-guide-view.mjs');
    const rect={x:10,y:20,w:100,h:60};
    assert.deepEqual(guideDragRect(rect,'right',40,0,2),{x:10,y:20,w:120,h:60});
    assert.deepEqual(guideDragRect(rect,'left',400,0,2),{x:109,y:20,w:1,h:60});
    assert.deepEqual(guideDragRect(rect,'top',0,-20,2),{x:10,y:10,w:100,h:70});
    assert.deepEqual(guideDragRect(rect,'move',20,40,2),{x:20,y:40,w:100,h:60});
    assert.deepEqual(rect,{x:10,y:20,w:100,h:60});
});

test('read-only fallback and initial display controls keep editing disabled and detailed measurements collapsed', async () => {
    const {openDesignGuide} = await import('../../src/tools/uxStudio/design-guide-view.mjs');
    const {doc} = dom(), previous = globalThis.document; globalThis.document = doc;
    try {
        const dialog = openDesignGuide({document:fixture(),screenId:'page',elementId:'child'});
        assert.equal(input(dialog,'가이드 x px').disabled,true);
        assert.equal(input(dialog,'치수 표시').checked,false);
        assert.equal(input(dialog,'하위 경계 표시').checked,false);
        const details = all(dialog,node=>node.tagName==='DETAILS');
        assert.equal(details.length,2);
        assert.ok(details.every(node=>!node.open));
        assert.ok(details.some(node=>node.children[0].textContent==='상세 수치·폰트 명세'));
        dialog.close();
    } finally { globalThis.document = previous; }
});

test('image file import applies to its captured selected ID and reports a failed import without closing', async () => {
    const {openDesignGuide} = await import('../../src/tools/uxStudio/design-guide-view.mjs');
    const {doc} = dom(), previous = globalThis.document; globalThis.document = doc;
    try {
        const design = fixture(), changes = [], requests = [], file={name:'ui.png'}, image={src:'data:image/png;base64,new'};
        const dialog = openDesignGuide({document:design,screenId:'page',elementId:'child',onImportImage:async request=>{
            requests.push(request); if (request.path) throw Error('이미지 경로 없음'); return image;
        },onChange:change=>{changes.push(change);const next=structuredClone(design);next.screens[0].elements[1].image=change.image;return next;}});
        const upload = input(dialog,'가이드 이미지 파일'); upload.files=[file];
        upload.dispatchEvent(new Event('change')); await Promise.resolve(); await Promise.resolve();
        assert.deepEqual(requests,[{file}]);
        assert.deepEqual(changes,[{type:'image',screenId:'page',elementId:'child',image}]);
        assert.equal(upload.value,'');
        input(dialog,'프로젝트 이미지 경로').value='assets/missing.png';
        button(dialog,'경로 이미지 넣기').dispatchEvent(new Event('click')); await Promise.resolve(); await Promise.resolve();
        assert.ok(dialog.textContent.includes('이미지 경로 없음'));
        assert.equal(button(dialog,'경로 이미지 넣기').disabled,false);
        assert.equal(dialog.isConnected,true); dialog.close();
    } finally { globalThis.document = previous; }
});

test('rounded coordinate fields preserve untouched precise values when another field is applied', async () => {
    const {openDesignGuide} = await import('../../src/tools/uxStudio/design-guide-view.mjs');
    const {doc} = dom(), previous = globalThis.document; globalThis.document = doc;
    try {
        const design = fixture(), changes = [];
        design.screens[0].elements[0].x=10.1234567;
        const dialog = openDesignGuide({document:design,screenId:'page',elementId:'group',onChange:change=>{changes.push(change);return design;}});
        assert.equal(input(dialog,'가이드 x px').value,'40.49');
        input(dialog,'가이드 w px').value='300'; button(dialog,'위치·크기 적용').dispatchEvent(new Event('click'));
        assert.equal(changes[0].rect.x,40.4938268);
        assert.equal(changes[0].rect.w,300); dialog.close();
    } finally { globalThis.document = previous; }
});

test('selected guide line changes its actual edge while line colors persist only as scoped editor preferences', async () => {
    const {openDesignGuide} = await import('../../src/tools/uxStudio/design-guide-view.mjs');
    const {doc} = dom(), previous = globalThis.document;
    const preferences = new Map();
    doc.defaultView={localStorage:{getItem:key=>preferences.get(key)??null,setItem:(key,value)=>preferences.set(key,value)}};
    globalThis.document = doc;
    try {
        const design = fixture(), changes = [], options={document:design,screenId:'page',elementId:'child',workspaceId:'one',onChange:change=>{changes.push(change);return design;}};
        let dialog = openDesignGuide(options);
        const select = input(dialog,'가이드 선 선택'); select.value='right'; select.dispatchEvent(new Event('change'));
        assert.equal(input(dialog,'가이드 선 위치 px').value,'240');
        input(dialog,'가이드 선 위치 px').value='260'; button(dialog,'선 위치 적용').dispatchEvent(new Event('click'));
        assert.deepEqual(changes[0],{type:'rect',screenId:'page',elementId:'child',rect:{x:80,y:16,w:180,h:80}});
        const color = input(dialog,'가이드 선 색상'); color.value='#bb22aa'; color.dispatchEvent(new Event('change'));
        assert.equal(changes.length,1); assert.equal(preferences.size,1); dialog.close();
        dialog = openDesignGuide(options); input(dialog,'가이드 선 선택').value='right'; input(dialog,'가이드 선 선택').dispatchEvent(new Event('change'));
        assert.equal(input(dialog,'가이드 선 색상').value,'#bb22aa'); dialog.close();
        dialog = openDesignGuide({...options,workspaceId:'two'}); input(dialog,'가이드 선 선택').value='right'; input(dialog,'가이드 선 선택').dispatchEvent(new Event('change'));
        assert.notEqual(input(dialog,'가이드 선 색상').value,'#bb22aa'); dialog.close();
    } finally {
        globalThis.document = previous;
    }
});

test('outline colors remain stable for the same IDs and avoid duplicate sibling colors', async () => {
    const {guideOutlineColors} = await import('../../src/tools/uxStudio/design-guide-view.mjs');
    const colors=guideOutlineColors(['cash','shield','menu','avatar','token']);
    assert.equal(new Set(colors.values()).size,5);
    assert.deepEqual([...colors.entries()],[...guideOutlineColors(['token','avatar','menu','shield','cash']).entries()]);
});
