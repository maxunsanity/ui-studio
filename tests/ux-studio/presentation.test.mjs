import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture, fire} from './dom-fixture.mjs';
import {renderLayout, applyOverlayRoot} from '../../src/tools/uxStudio/layout-view.mjs';
import {createSkin} from '../../src/tools/uxStudio/skins.mjs';
import {createButtonState} from '../../src/tools/uxStudio/button-state.mjs';
import {resolveResponsiveRect} from '../../src/tools/uxStudio/responsive-layout.mjs';
const api = await import('../../src/tools/uxStudio/presentation.mjs').catch(error => {
    if (error.code === 'ERR_MODULE_NOT_FOUND' && error.url?.endsWith('/presentation.mjs')) return {};
    throw error;
});
const part = (id, extra = {}) => ({id, name: id, kind: 'panel', x: 0, y: 0, w: 100, h: 100, text: '', ...extra});
const ref = 'sha256-' + 'a'.repeat(64) + '.webp';
const image = {src: '', assetRef: ref, sourceSize: [180, 80], alt: 'Native sprite', fit: 'fill'};
function sourceScreen() {
    const frame = createSkin('backplate');
    frame.textures = {normal: {...image, w: 180, h: 80}};
    return {id: 'screen', name: 'Main', kind: 'page', logicalSize: {w: 400, h: 800}, safeArea: [20, 10, 30, 10], elements: [
        part('coordinate', {isGroup: true}),
        part('navigation', {parentId: 'coordinate', h: 10, skin: frame, component: 'game-ui', interaction: {mode: 'action', enabled: true, shape: 'rectangle', reason: ''}}),
        part('logo', {parentId: 'navigation', kind: 'image', w: 15, image}),
        part('heading', {parentId: 'navigation', kind: 'text', x: 20, w: 70, text: '상점 Café 日本語 42', fontSize: 21, typography: {family: 'georgia', weight: 650, lineHeight: 28, letterSpacing: 1.2, align: 'left', wrap: 'wrap'}}),
        part('body', {parentId: 'coordinate', y: 12, h: 70, layout: {type: 'vertical', gap: 8, padding: [8, 10, 12, 10], itemSize: [180, 100]}, overflow: 'scroll-y'}),
        part('card', {parentId: 'body', kind: 'card', skin: frame}),
        part('card-image', {parentId: 'card', kind: 'image', image: {...image, region: [10, 10, 40, 50]}}),
        part('button', {parentId: 'coordinate', kind: 'button', y: 85, h: 12, text: '구매 900', skin: createSkin('button'), buttonState: {...createButtonState(), enabled: true, mode: 'image', images: {normal: image, pressed: {...image, assetRef: 'sha256-' + 'b'.repeat(64) + '.webp'}}}}),
        part('field', {parentId: 'body', kind: 'button', text: '검색', control: {type: 'input', value: '한글 input', placeholder: 'Name'}, interaction: {mode: 'action', enabled: true, shape: 'rectangle', reason: ''}}),
        part('frame', {parentId: 'coordinate', partRole: 'frame', skin: frame}),
        part('background', {parentId: 'coordinate', partRole: 'background', image})
    ]};
}
function dom(t) {
    const root = fixture(t), doc = root.ownerDocument;
    const create = doc.createElement;
    const patch = node => {
        let cssText = '';
        Object.defineProperty(node.style, 'cssText', {enumerable: true, get: () => cssText, set: value => {
            for (const key of Object.keys(node.style)) if (key !== 'cssText' && typeof node.style[key] !== 'function') delete node.style[key];
            cssText = value;
        }});
        node.style.setProperty = (name, value) => {node.style[name] = value;};
        node.style.removeProperty = name => {delete node.style[name];};
        node.classList.remove = name => node.classList.toggle(name, false);
        return node;
    };
    patch(root);
    doc.createElement = tag => patch(create(tag));
    doc.createElementNS = (_ns, tag) => doc.createElement(tag);
    return root;
}
const unit = (root, id) => root.querySelectorAll('.ui-element').find(node => node.dataset.element === id);
function snapshot(node) {
    return {tag: node.tagName, class: node.className, dataset: {...node.dataset}, attributes: {...node.attributes}, style: Object.fromEntries(Object.entries(node.style).filter(([, value]) => typeof value !== 'function')), text: node.textContent, value: node.value, children: node.children.map(snapshot)};
}

// Catches invalid/legacy view tokens falling into resource-free mode accidentally.
test('normalization accepts three declared modes and falls back to current UI', () => {
    assert.equal(typeof api.normalizePresentationMode, 'function', 'presentation normalization is not implemented');
    assert.deepEqual(api.PRESENTATION_MODES.map(mode => mode.id), ['wireframe', 'detailed-wireframe', 'ui']);
    for (const mode of api.PRESENTATION_MODES) assert.equal(api.normalizePresentationMode(mode.id), mode.id);
    for (const value of [null, undefined, '', 'wire', 'art', '__proto__', {}, 2]) assert.equal(api.normalizePresentationMode(value), 'ui');
});

// Catches saved-document conversion, asset references leaking into the wire view,
// and stripping responsive coordinate properties while hiding painting.
test('wire projection strips resource and product payloads while preserving responsive hierarchy', () => {
    assert.equal(typeof api.presentationScreen, 'function', 'wire projection is not implemented');
    const screen = sourceScreen(), before = structuredClone(screen), projected = api.presentationScreen(screen, 'wireframe');
    assert.notEqual(projected, screen);
    assert.deepEqual(screen, before);
    assert.equal(projected.skin, undefined);
    assert.deepEqual(projected.logicalSize, {w: 400, h: 800});
    for (const element of projected.elements) {
        for (const key of ['image', 'skin', 'control', 'buttonState', 'binding', 'notification', 'effects']) assert.equal(element[key], undefined, element.id + ' ' + key);
        assert.equal(element.text, '');
        const original = screen.elements.find(source => source.id === element.id);
        assert.equal(element.parentId, original.parentId);
        assert.deepEqual(resolveResponsiveRect(projected, element.id, 430, 900), resolveResponsiveRect(screen, element.id, 430, 900));
    }
    assert.equal(api.presentationScreen(screen, 'ui'), screen);
    assert.equal(api.presentationScreen(screen, 'detailed-wireframe'), screen);
});

// Catches wire renders accidentally invoking skins, built-in image icons,
// native controls, dynamic text callbacks, external slots, or original child maps.
test('wire v2 adds action boxes, image slots and text rows without resources or native controls', t => {
    assert.equal(typeof api.renderPresentation, 'function', 'presentation renderer is not implemented');
    const root = dom(t), screen = sourceScreen(), before = structuredClone(screen), probes = [], oldImage = globalThis.Image;
    globalThis.Image = class {set src(value) {probes.push(value);}};
    t.after(() => {if (oldImage === undefined) delete globalThis.Image; else globalThis.Image = oldImage;});
    const provider = document.createElement('div'); provider.append(document.createElement('img'));
    screen.elements[4].binding = {type: 'content-slot', slot: 'remote'};
    const children = new Map([[null, screen.elements.filter(element => !element.parentId)]]);
    api.renderPresentation(screen, root, {presentationMode: 'wireframe', workspaceId: 'isolated', assetView: 'art', text: () => {throw Error('product text must not be evaluated');}, slots: new Map([['remote', provider]]), children});
    assert.deepEqual(probes, []);
    assert.equal(root.querySelectorAll('img').length, 0);
    assert.equal(root.querySelectorAll('image').length, 0);
    assert.equal(root.querySelectorAll('.image-content').length, 0);
    assert.equal(root.querySelectorAll('.ui-control').length, 0);
    assert.equal(root.querySelectorAll('.game-skin').length, 0);
    const zones = root.querySelectorAll('.presentation-zone');
    assert.deepEqual(zones.map(node => node.dataset.element), ['navigation', 'body']);
    assert.deepEqual(root.querySelectorAll('.presentation-zone-label').map(node => node.textContent), ['navigation', 'body']);
    assert(root.querySelectorAll('.element-text').every(node => !node.textContent));
    assert.deepEqual(root.querySelectorAll('.presentation-action').map(node => node.dataset.element), ['navigation', 'field', 'button']);
    assert.deepEqual(root.querySelectorAll('.presentation-image-slot').map(node => node.dataset.element), ['logo']);
    assert.deepEqual(root.querySelectorAll('.presentation-text-slot').map(node => node.dataset.element), ['heading', 'field', 'button']);
    assert.equal(root.querySelectorAll('.presentation-image-placeholder').length, 1);
    assert.equal(root.querySelectorAll('.presentation-text-placeholder').length, 3);
    assert.equal(root.querySelectorAll('.presentation-zone-label').length, 2, 'only major zones have editor names');
    assert(root.querySelectorAll('.ui-element').filter(node => node.className.includes('presentation-action') || node.className.includes('presentation-image-slot') || node.className.includes('presentation-text-slot') || node.className.includes('presentation-zone')).length > 4, 'wire view shows more than four coarse roots');
    assert.equal(unit(root, 'coordinate').classList.contains('presentation-zone'), false);
    assert.equal(unit(root, 'card'), undefined, 'full-bleed card painting does not leave an empty nested outline');
    assert.equal(unit(root, 'frame'), undefined);
    assert.equal(unit(root, 'background'), undefined);
    delete screen.elements[4].binding;
    assert.deepEqual(screen, before);
});

// Catches a fullscreen/decoration coordinate wrapper being drawn as the only zone.
test('wire zones descend neutral wrappers and omit decorative subtrees', t => {
    const root = dom(t);
    const screen = {id: 'generic', elements: [part('outer', {isGroup: true}), part('inner', {parentId: 'outer', isGroup: true}), part('left', {parentId: 'inner', w: 40}), part('right', {parentId: 'inner', x: 45, w: 55}), part('decor', {parentId: 'inner', partRole: 'background'}), part('paint-child', {parentId: 'decor'})]};
    api.renderPresentation(screen, root, {presentationMode: 'wireframe'});
    assert.deepEqual(root.querySelectorAll('.presentation-zone').map(node => node.dataset.element), ['left', 'right']);
});

// Catches geometry being recomputed by a presentation-specific coordinate engine.
test('all three modes keep anchored root, inset children and auto layout rectangles', t => {
    const screen = sourceScreen();
    screen.elements[0].rectTransform = {min: [0, 1], max: [1, 1], pivot: [0, 1], position: [10, -20], sizeDelta: [-20, 700]};
    screen.elements[1].inset = [3, 7, 11, 13];
    const keys = ['cssText', 'left', 'top', 'width', 'height', 'overflowX', 'overflowY'];
    const outputs = [];
    for (const mode of ['ui', 'detailed-wireframe', 'wireframe']) {
        const root = dom(t); api.renderPresentation(screen, root, {presentationMode: mode, assetView: 'art', workspaceId: 'geometry'});
        outputs.push(['coordinate', 'navigation', 'body', 'logo', 'heading', 'button', 'field'].map(id => keys.map(key => unit(root, id).style[key])));
    }
    assert.deepEqual(outputs[1], outputs[0]);
    assert.deepEqual(outputs[2], outputs[0]);
});

// Catches flattening text to screenshots/replacements or changing native typography.
test('detailed wire preserves native multilingual text, control values, sprite crop and 9-slice resources', t => {
    const root = dom(t), screen = sourceScreen(), before = structuredClone(screen);
    api.renderPresentation(screen, root, {presentationMode: 'detailed-wireframe', assetView: 'art', workspaceId: 'workspace-one'});
    const text = unit(root, 'heading').querySelector('.element-text');
    assert.equal(text.textContent, '상점 Café 日本語 42');
    assert.equal(text.style.fontFamily, 'Georgia, serif');
    assert.equal(text.style.fontWeight, '650');
    assert.equal(text.style.lineHeight, '28px');
    assert.equal(text.style.letterSpacing, '1.2px');
    assert.equal(unit(root, 'field').querySelector('input').value, '한글 input');
    assert.equal(unit(root, 'field').tagName, 'DIV');
    const crop = unit(root, 'card-image').querySelector('.sprite-region-image');
    assert.equal(crop.getAttribute('viewBox'), '10 10 40 50');
    assert.equal(crop.querySelector('image').getAttribute('href'), '/api/ux-studio/asset?ref=' + ref + '&workspace=workspace-one');
    const navigation = unit(root, 'navigation');
    assert.equal(navigation.style['--skin-slices'], '12 12 12 12 fill');
    assert.equal(navigation.style['--skin-edges'], '6px 6px 6px 6px');
    assert.equal(navigation.style['--skin-source'], 'url("/api/ux-studio/asset?ref=' + ref + '&workspace=workspace-one")');
    assert.deepEqual(screen, before);
});

// Catches a grayscale filter that loses alpha shape and a filter per image/board part.
test('detailed wire uses one shared alpha morphology filter per root', t => {
    const root = dom(t), otherRoot = dom(t), screen = sourceScreen();
    api.renderPresentation(screen, root, {presentationMode: 'detailed-wireframe', assetView: 'art', workspaceId: 'alpha-shapes'});
    api.renderPresentation(screen, otherRoot, {presentationMode: 'detailed-wireframe', assetView: 'art', workspaceId: 'alpha-shapes'});
    assert.equal(root.querySelectorAll('.presentation-filter-defs').length, 1);
    const filter = root.querySelector('filter');
    assert.equal(filter.querySelector('femorphology').getAttribute('in'), 'SourceAlpha');
    assert.equal(filter.querySelector('femorphology').getAttribute('operator'), 'dilate');
    assert.equal(filter.querySelector('fecomposite').getAttribute('in2'), 'SourceAlpha');
    assert.equal(filter.querySelector('fedropshadow').getAttribute('dy'), '1');
    assert.notEqual(filter.getAttribute('id'), otherRoot.querySelector('filter').getAttribute('id'));
    api.applyPresentation(root, 'detailed-wireframe');
    assert.equal(root.querySelectorAll('.presentation-filter-defs').length, 1);
});

// Catches state replacement dropping 3-slice caps or modifying authored state resources.
test('detailed wire keeps existing 3-slice button state rendering and input root', t => {
    const root = dom(t), screen = sourceScreen(), before = structuredClone(screen);
    api.renderPresentation(screen, root, {presentationMode: 'detailed-wireframe', mode: 'play', assetView: 'art', workspaceId: 'workspace-two'});
    const node = unit(root, 'button');
    assert.equal(node.tagName, 'BUTTON');
    fire(node, 'pointerdown', {button: 0, pointerId: 9});
    assert.equal(node.style['--skin-slices'], '0 16 0 16 fill');
    assert.equal(node.style['--skin-edges'], '0px 12px 0px 12px');
    assert.equal(node.style['--skin-source'], 'url("/api/ux-studio/asset?ref=sha256-' + 'b'.repeat(64) + '.webp&workspace=workspace-two")');
    assert.equal(node.dataset.buttonState, 'pressed');
    assert.deepEqual(screen, before);
});

// Catches stale wire labels/effects and an incomplete revert to the current renderer.
test('switching through all modes restores exact current renderer UI nodes and resources', t => {
    const root = dom(t), reference = dom(t), screen = sourceScreen(), options = {assetView: 'art', workspaceId: 'workspace-one'};
    renderLayout(screen, reference, options);
    api.renderPresentation(screen, root, {...options, presentationMode: 'detailed-wireframe'});
    api.renderPresentation(screen, root, {...options, presentationMode: 'wireframe'});
    api.renderPresentation(screen, root, {...options, presentationMode: 'ui'});
    assert.equal(root.querySelectorAll('.presentation-zone-label').length, 0);
    assert.equal(root.querySelectorAll('.presentation-filter-defs').length, 0);
    assert.deepEqual(root.children.map(snapshot), reference.children.map(snapshot));
});

// Catches screen-level custom skins being requested by the overlay preparation step.
test('wire projection is safe for existing overlay root preparation', t => {
    const root = dom(t), screen = sourceScreen(), probes = [], oldImage = globalThis.Image;
    globalThis.Image = class {set src(value) {probes.push(value);}};
    t.after(() => {if (oldImage === undefined) delete globalThis.Image; else globalThis.Image = oldImage;});
    screen.kind = 'overlay'; screen.skin = createSkin('modal'); screen.skin.textures = {normal: {...image, w: 180, h: 80}};
    const projected = api.presentationScreen(screen, 'wireframe');
    applyOverlayRoot(root, projected, {workspaceId: 'wire-overlay', view: 'art'});
    api.renderPresentation(projected, root, {presentationMode: 'wireframe'});
    assert.deepEqual(probes, []);
    assert.equal(root.classList.contains('game-skin'), false);
});

// Catches stripping a background coordinate parent together with a real content child.
test('wire v2 preserves real image/text descendants through invisible paint ancestors', t => {
    const root=dom(t), screen={id:'nested',logicalSize:{w:400,h:800},elements:[
        part('major-left',{w:45}), part('major-right',{x:50,w:50}),
        part('paint',{parentId:'major-left',partRole:'background',inset:[3,7,11,13],image}),
        part('icon',{parentId:'paint',kind:'image',x:10,y:20,w:25,h:30,image}),
        part('caption',{parentId:'paint',kind:'text',x:40,y:20,w:50,h:30,text:'PRODUCT COPY',typography:{wrap:'wrap'}})
    ]}, before=structuredClone(screen);
    api.renderPresentation(screen,root,{presentationMode:'wireframe'});
    assert.equal(unit(root,'paint').classList.contains('presentation-image-slot'),false,'background painting stays invisible');
    assert.equal(unit(root,'icon').classList.contains('presentation-image-slot'),true);
    assert.equal(unit(root,'caption').classList.contains('presentation-text-slot'),true);
    assert.equal(unit(root,'caption').classList.contains('presentation-text-multiline'),true);
    assert.equal(unit(root,'icon').parentNode,unit(root,'paint'));
    assert.deepEqual(resolveResponsiveRect(api.presentationScreen(screen,'wireframe'),'icon',430,900),{x:30.35,y:180.2,w:43.375,h:265.8});
    assert.equal(root.querySelectorAll('.image-content').length,0);
    assert(root.querySelectorAll('.element-text').every(node=>node.textContent===''));
    assert.deepEqual(screen,before);
});

// Catches a literal-backslash-n check accidentally replacing actual native line breaks.
test('wire text rows recognize native line breaks without typography wrap',t=>{
    const root=dom(t),screen={id:'line-breaks',elements:[
        part('region'),part('native',{parentId:'region',kind:'text',y:10,h:20,text:'One\nTwo'}),
        part('literal',{parentId:'region',kind:'text',y:40,h:20,text:'One\\nTwo'})
    ]};
    api.renderPresentation(screen,root,{presentationMode:'wireframe'});
    assert.equal(unit(root,'native').classList.contains('presentation-text-multiline'),true);
    assert.equal(unit(root,'literal').classList.contains('presentation-text-multiline'),false);
    assert(root.querySelectorAll('.element-text').every(node=>node.textContent===''));
});

const action = {mode:'action',enabled:true,shape:'rectangle',reason:''};
// Catches treating background/rim/state/badge layers as independent basic content slots.
test('basic wire chooses one real icon per action and hides full-bleed, thin and badge layers',t=>{
    const root=dom(t),screen={id:'generic-structure',logicalSize:{w:400,h:800},elements:[
        part('canvas',{isGroup:true}),part('left',{parentId:'canvas',w:50}),part('right',{parentId:'canvas',x:50,w:50}),
        part('wallpaper',{parentId:'canvas',kind:'image',image}),
        part('unit',{parentId:'left',kind:'button',x:10,y:10,w:60,h:20,interaction:action}),
        part('unit-face',{parentId:'unit',kind:'image',image}),
        part('disc',{parentId:'unit',kind:'image',x:10,y:10,w:40,h:60,image}),
        part('actual-icon',{parentId:'unit',kind:'image',x:18,y:20,w:24,h:40,image}),
        part('rim',{parentId:'unit',kind:'image',x:10,y:10,w:40,h:60,image}),
        part('shine',{parentId:'unit',kind:'image',x:10,y:80,w:70,h:3,image}),
        part('caption',{parentId:'unit',kind:'text',x:5,y:65,w:90,h:25,text:'native\nlabel'}),
        part('badge',{parentId:'unit',partRole:'badge',x:85,y:0,w:10,h:10}),
        part('badge-picture',{parentId:'badge',kind:'image',image}),
        part('badge-text',{parentId:'badge',kind:'text',text:'7'}),
        part('nested-action',{parentId:'unit',kind:'button',x:70,y:10,w:25,h:30,interaction:action}),
        part('nested-icon',{parentId:'nested-action',kind:'image',x:5,y:20,w:50,h:50,image})
    ]},before=structuredClone(screen);
    api.renderPresentation(screen,root,{presentationMode:'wireframe'});
    assert.deepEqual(root.querySelectorAll('.presentation-action').map(n=>n.dataset.element),['unit','nested-action']);
    assert.deepEqual(root.querySelectorAll('.presentation-image-slot').map(n=>n.dataset.element),['actual-icon','nested-icon']);
    assert.deepEqual(root.querySelectorAll('.presentation-text-slot').map(n=>n.dataset.element),['caption']);
    assert.equal(unit(root,'caption').classList.contains('presentation-text-multiline'),true);
    for(const id of ['wallpaper','unit-face','disc','rim','shine','badge-picture','badge-text'])assert.equal(unit(root,id),undefined,id+' must not add a duplicate basic shape');
    const reference=dom(t);renderLayout(screen,reference,{assetView:'art',workspaceId:'geometry-v3'});
    for(const id of ['unit','actual-icon','nested-action','nested-icon','caption']){
        assert.equal(unit(root,id).dataset.element,id);
        assert.equal(unit(root,id).style.cssText,unit(reference,id).style.cssText);
    }
    assert.deepEqual(resolveResponsiveRect(screen,'actual-icon',400,800),{x:41.6,y:112,w:28.8,h:64});
    assert.deepEqual(screen,before,'all representative choices remain transient view data');
    assert.equal(root.querySelectorAll('img').length,0);assert.equal(root.querySelectorAll('image').length,0);assert.equal(root.querySelectorAll('.ui-control').length,0);
});

// Catches collapsing separate standalone icons into one slot just because they share a region.
test('basic wire collapses overlapping standalone layers but preserves separate icon positions',t=>{
    const root=dom(t),screen={id:'standalone',logicalSize:{w:400,h:800},elements:[
        part('region'),part('circle',{parentId:'region',kind:'image',x:10,y:10,w:20,h:10,image}),
        part('inside',{parentId:'region',kind:'image',x:14,y:12,w:12,h:6,image}),
        part('outline',{parentId:'region',kind:'image',x:10,y:10,w:20,h:10,image}),
        part('separate',{parentId:'region',kind:'image',x:70,y:40,w:20,h:10,image}),
        part('large-backdrop',{parentId:'region',kind:'image',x:0,y:0,w:100,h:65,image}),
        part('real-action',{parentId:'region',kind:'button',x:35,y:25,w:30,h:20,interaction:action})
    ]};
    api.renderPresentation(screen,root,{presentationMode:'wireframe'});
    assert.deepEqual(root.querySelectorAll('.presentation-image-slot').map(n=>n.dataset.element),['inside','separate']);
    assert.equal(unit(root,'large-backdrop'),undefined,'a region-spanning image over a descendant action is background paint');
    assert.equal(unit(root,'inside').style.cssText,'left:14%;top:12%;width:12%;height:6%;font-size:16px;');
    assert.equal(unit(root,'separate').style.cssText,'left:70%;top:40%;width:20%;height:10%;font-size:16px;');
});

// Catches adding an image cross/edge on top of the identical actionable box.
test('basic wire does not double the boundary when the action itself owns a full-box image',t=>{
    const root=dom(t),screen={id:'single-image-action',logicalSize:{w:400,h:800},elements:[part('button-image',{kind:'button',x:10,y:10,w:30,h:10,image,interaction:action,text:'Actual text'})]},before=structuredClone(screen);
    api.renderPresentation(screen,root,{presentationMode:'wireframe'});
    assert.equal(root.querySelectorAll('.presentation-action').length,1);
    assert.equal(root.querySelectorAll('.presentation-image-placeholder').length,0);
    assert.equal(root.querySelectorAll('.presentation-text-placeholder').length,1);
    assert.deepEqual(screen,before);
});

// Catches width/height aliases reaching the shared resolver as undefined logical dimensions.
test('wire geometry accepts w/h, width/height aliases and legacy default sizes',t=>{
    for(const size of [{w:400,h:800},{width:400,height:800},undefined]){
        const root=dom(t),screen={id:'size-shapes',...(size?{logicalSize:size}:{}),elements:[
            part('region'),part('background-paint',{parentId:'region',kind:'image',image}),
            part('action',{parentId:'region',kind:'button',x:10,y:10,w:80,h:20,interaction:action}),
            part('icon',{parentId:'action',kind:'image',x:10,y:20,w:30,h:50,image})
        ]},before=structuredClone(screen);
        api.renderPresentation(screen,root,{presentationMode:'wireframe'});
        assert.deepEqual(root.querySelectorAll('.presentation-image-slot').map(n=>n.dataset.element),['icon']);
        assert.deepEqual(screen,before);
    }
});

test('HUD review boards expose only frame regions in wireframe and full gray art in detailed view', t => {
    const root = dom(t), original = sourceScreen();
    const review = {...original, wireframeReview: true};
    api.renderPresentation(review, root, {presentationMode: 'wireframe', assetView: 'art', workspaceId: 'review'});
    assert.deepEqual(root.querySelectorAll('.presentation-zone-label').map(node => node.textContent), ['navigation', 'body']);
    assert.equal(root.querySelectorAll('.presentation-placeholder').length, 0);
    api.renderPresentation(review, root, {presentationMode: 'detailed-wireframe', assetView: 'art', workspaceId: 'review'});
    assert.equal(root.dataset.wireframeReview, 'true');
    assert.equal(unit(root, 'heading').querySelector('.element-text').textContent, '상점 Café 日本語 42');
    api.renderPresentation(original, root, {presentationMode: 'detailed-wireframe', assetView: 'art', workspaceId: 'review'});
    assert.equal(root.dataset.wireframeReview, undefined);
});

test('review filler uses one logical pixel radius on both axes of a wide card', t => {
    const root = dom(t);
    const screen = {id:'page', name:'HUD', kind:'page', wireframeReview:true, logicalSize:{w:400,h:800},
        elements:[part('card',{h:7,w:92.5,partRole:'background',appearance:{shape:'rounded',radius:6}})]};
    api.renderPresentation(screen, root, {presentationMode:'detailed-wireframe', assetView:'art'});
    const surface=unit(root,'card').querySelector('.unit-surface');
    assert.equal(surface.getAttribute('viewBox'),'0 0 370 56');
    assert.equal(surface.lastElementChild.getAttribute('rx'),'6');
    assert.equal(surface.lastElementChild.getAttribute('ry'),'6');
});
