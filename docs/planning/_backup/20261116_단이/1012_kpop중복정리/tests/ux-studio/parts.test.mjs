import { saveDocument } from '../../src/tools/uxStudio/save-plugin.mjs';
import { join } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { createPartsDemo, decomposeImageFrame, inputOwner, editTarget, validateParts, readImageFile, insideHit } from '../../src/tools/uxStudio/parts.mjs';
import { validateDocument, createRuntime, activate } from '../../src/tools/uxStudio/model.mjs';
import { copySelection, pasteSelection } from '../../src/tools/uxStudio/commands.mjs';
const demo = () => createPartsDemo('parts-test');
test('image/frame decomposition preserves root ID, layout and action; leaves legacy documents unchanged', async () => {
    const d = demo(), s = d.screens[0], root = s.elements.find(e => e.id === 'action-card');
    validateDocument(d);
    assert.deepEqual([root.x, root.y, root.w, root.h], [20, 51, 60, 25]);
    assert.equal(d.transitions[0].fromElement, root.id);
    assert.deepEqual(s.elements.filter(e => e.parentId === root.id).map(e => e.partRole), ['background', 'image', 'label', 'frame']);
    const legacy = JSON.parse(await readFile('src/tools/uxStudio/sample.json', 'utf8'));
    const before = structuredClone(legacy);
    validateDocument(legacy);
    assert.deepEqual(legacy, before);
    const bad = demo();
    bad.screens[0].elements.push({
        id: 'child', parentId: 'hint', kind: 'text', name: 'child', x: 0, y: 0, w: 10, h: 10
    });
    assert.throws(() => decomposeImageFrame(bad.screens[0], bad.screens[0].elements.find(e => e.id === 'hint')));
});
test('parts inherit exactly one parent action; display/block never trigger; disabled preserves button role', () => {
    const d = demo(), s = d.screens[0], start = createRuntime(d), part = s.elements.find(e => e.parentId === 'action-card' && e.partRole === 'image');
    const r = activate(d, start, s.id, part.id);
    assert.equal(r.message, '상점 버튼의 입력을 받았습니다 · 실제 게임 실행 없음');
    assert.equal(r.events.length, 1);
    assert.equal(r.events[0].element, 'action-card');
    for (const e of s.elements.filter(e => e.parentId === 'display-card')) {
        const r = activate(d, start, s.id, e.id);
        assert.equal(r.events.length, 0);
        assert.equal(r.message, '');
    }
    part.interaction.mode = 'block';
    assert.equal(inputOwner(s, part.id, d.transitions), null);
    assert.equal(activate(d, start, s.id, part.id).message, '');
    part.interaction.mode = 'parent';
    const owner = inputOwner(s, part.id, d.transitions);
    owner.interaction.enabled = false;
    owner.interaction.reason = '조건 미충족';
    assert.equal(activate(d, start, s.id, part.id).message, '조건 미충족');
    assert.equal(start.message, '');
});
test('whole selection and direct part editing are distinct without guessing from image shape', () => {
    const d = demo(), s = d.screens[0], part = s.elements.find(e => e.parentId === 'action-card');
    assert.equal(editTarget(s, part.id), 'action-card');
    assert.equal(editTarget(s, part.id, 'action-card'), part.id);
    assert.equal(editTarget(s, 'hint'), 'hint');
});
test('image, fit, roles and interaction survive JSON roundtrip and copied parent IDs', () => {
    const d = demo(), s = d.screens[0], e = s.elements.find(e => e.kind === 'image');
    e.image = {
        src: 'data:image/png;base64,iVBORw0KGgo=', alt: '아이콘', fit: 'cover'
    };
    const r = validateDocument(JSON.parse(JSON.stringify(d)));
    assert.deepEqual(r.screens[0].elements, s.elements);
    let n = 0;
    const ids = pasteSelection(d, s.id, copySelection(d, s.id, ['action-card']), () => `copy-${++n}`);
    validateDocument(d);
    assert.equal(inputOwner(s, s.elements.find(e => e.parentId === ids[0] && e.partRole === 'frame').id, d.transitions).id, ids[0]);
});
test('image import rejects oversized/type-forged/SVG before document storage', async () => {
    let read = false;
    await assert.rejects(() => readImageFile({
        size: 300001, type: 'image/png', arrayBuffer() {
            read = true;
        }
    }));
    assert.equal(read, false);
    await assert.rejects(() => readImageFile({
        size: 10, type: 'image/svg+xml'
    }));
    await assert.rejects(() => readImageFile({
        size: 3, type: 'image/png', arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer
    }));
    const png = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
    assert.equal(await readImageFile({
        size: 8, type: 'image/png', arrayBuffer: async () => png.buffer
    }), 'data:image/png;base64,iVBORw0KGgo=');
    for (const src of ['javascript:alert(1)', 'https://example.com/x.png', 'data:image/svg+xml;base64,AAAA'])
        assert.throws(() => validateParts({
            kind: 'image', image: {
                src, alt: '', fit: 'contain'
            }
        }));
});
test('actual hit shape distinguishes rectangle/ellipse boundary and outside', () => {
    const e = {
        interaction: {
            shape: 'ellipse'
        }
    };
    assert.equal(insideHit(e, .5, .5), true);
    assert.equal(insideHit(e, 0, .5), true);
    assert.equal(insideHit(e, 0, 0), false);
    assert.equal(insideHit(e, 1.01, .5), false);
    assert.equal(insideHit({
        interaction: {
            shape: 'rectangle'
        }
    }, 0, 0), true);
});
test('version2 and explicit parts are validated, unsupported versions and malformed roles fail', () => {
    const d = demo();
    assert.equal(d.schemaVersion, 2);
    validateDocument(d);
    for (const change of [d => d.schemaVersion = 4, d => d.screens[0].elements[0].partRole = 'unknown', d => d.screens[0].elements[0].interaction = {
            mode: 'action', enabled: 'yes', shape: 'rectangle', reason: ''
        }]) {
        const c = demo();
        change(c);
        assert.throws(() => validateDocument(c));
    }
    const c = demo();
    c.transitions[0].targetScreen = 'missing';
    assert.throws(() => validateDocument(c));
});
test('version2 parts and image survive atomic save without changing their action owner', async () => {
    const dir = await mkdtemp(join(process.cwd(), '_작업/codex/ux-studio/parts-test-'));
    try {
        const d = demo(), image = d.screens[0].elements.find(e => e.kind === 'image');
        image.image.src = 'data:image/png;base64,iVBORw0KGgo=';
        const saved = await saveDocument(process.cwd(), dir, d, null), read = JSON.parse(await readFile(join(dir, d.projectId + '.json'), 'utf8'));
        assert.deepEqual(read, saved);
        assert.equal(read.schemaVersion, 2);
        assert.equal(read.screens[0].elements.find(e => e.id === image.id).image.src, image.image.src);
        assert.equal(inputOwner(read.screens[0], 'action-card-image', read.transitions).id, 'action-card');
    }
    finally {
        await rm(dir, {
            recursive: true, force: true
        });
    }
});
test('decomposing an image keeps its source on the child and preserves inherited input', () => {
    const s = {
        elements: [{
                id: 'parent', kind: 'button', name: '부모', x: 0, y: 0, w: 100, h: 100
            }, {
                id: 'picture', kind: 'image', name: '사진', parentId: 'parent', x: 5, y: 5, w: 80, h: 80, text: '사진 설명', image: {
                    src: 'data:image/png;base64,iVBORw0KGgo=', alt: '사진', fit: 'cover'
                }, interaction: {
                    mode: 'parent', enabled: true, shape: 'rectangle', reason: ''
                }
            }]
    };
    const root = s.elements[1];
    decomposeImageFrame(s, root);
    assert.equal(root.kind, 'panel');
    assert.equal(root.image, undefined);
    assert.equal(s.elements.find(e => e.parentId === 'picture' && e.kind === 'image').image.fit, 'cover');
    assert.equal(inputOwner(s, 'picture-image').id, 'parent');
    assert.throws(() => validateParts({
        kind: 'panel', partRole: 'image'
    }));
    assert.throws(() => validateParts({
        kind: 'image', partRole: 'container', component: 'image-frame'
    }));
});

test('sprite region validates bounds and JSON roundtrip independently of layout and action', async () => {
    const d = demo(), s = d.screens[0], e = s.elements.find(e => e.kind === 'image');
    e.image = {src:'data:image/png;base64,AAAA', alt:'icon', fit:'contain', sourceSize:[511,73], region:[4,18,38,37]};
    validateDocument(d);
    const before = structuredClone(e);
    const copy = JSON.parse(JSON.stringify(d));
    validateDocument(copy);
    assert.deepEqual(copy.screens[0].elements.find(n => n.id === e.id), before);
    for (const region of [[-1,0,4,4],[0,0,0,4],[500,0,20,4],[0,70,4,4],[0,0,NaN,4],[0,0,1.5,4],null,[0,0,4]]) {
        e.image.region = region;
        assert.throws(() => validateParts(e));
    }
    e.image.region = [0,0,511,73];
    validateParts(e);
    e.image.sourceSize = [5000,73];
    assert.throws(() => validateParts(e));
    delete e.image.sourceSize;
    assert.throws(() => validateParts(e));
    delete e.image.region;
    validateParts(e); // Old designs remain readable without metadata.
    assert.deepEqual([e.x,e.y,e.w,e.h,e.parentId], [before.x,before.y,before.w,before.h,before.parentId]);
});

test('typography rejects invalid numbers, CSS values and incompatible wrapping without mutating legacy data', () => {
    const d = demo(), e = d.screens[0].elements.find(e => e.kind === 'text');
    const original = structuredClone(d);
    validateDocument(d);
    assert.deepEqual(d, original);
    const invalid = [null, [], {unknown:1}, {family:'url(https://bad)'}, {family:'constructor'}, {align:'justify'}, {weight:NaN}, {weight:1001}, {lineHeight:0}, {letterSpacing:Infinity}, {letterSpacing:-11}, {overflow:'ellipsis',wrap:'wrap'}];
    for (const typography of invalid) {
        e.typography = typography;
        assert.throws(() => validateDocument(d));
    }
    delete e.typography;
    for (const fontSize of [0,-1,257,NaN,'16',Infinity]) {
        e.fontSize = fontSize;
        assert.throws(() => validateDocument(d));
    }
    e.fontSize = 9.5;
    validateDocument(d);
});
test('text style overrides clear on restore and do not change input, parent or geometry', async () => {
    const {typographyStyles} = await import('../../src/tools/uxStudio/parts.mjs');
    const d = demo(), e = d.screens[0].elements.find(e => e.kind === 'text'), before = structuredClone(e);
    e.typography = {family:'system',weight:650,lineHeight:20.5,letterSpacing:.25,align:'left',vertical:'top',wrap:'nowrap',overflow:'ellipsis'};
    validateDocument(d);
    const style = typographyStyles(e);
    assert.equal(style.lineHeight,'20.5px');
    assert.equal(style.letterSpacing,'0.25px');
    assert.equal(style.textOverflow,'ellipsis');
    assert.equal(style.overflow,'hidden');
    const restored = {...style,...typographyStyles(before)};
    assert.ok(Object.values(restored).every(v => v === ''));
    delete e.typography;
    assert.deepEqual(e,before);
});
test('precise text properties survive atomic save with the same parent and action owner', async () => {
    const dir = await mkdtemp(join(process.cwd(),'_작업/codex/ux-studio/typography-test-'));
    try {
        const d = demo(), e = d.screens[0].elements.find(e => e.id === 'action-card-label');
        e.fontSize=18.5;
        e.typography={family:'arial',weight:700,lineHeight:24,letterSpacing:-.2,align:'center',vertical:'middle',wrap:'wrap',overflow:'clip'};
        const before=structuredClone(e);
        const saved = await saveDocument(process.cwd(),dir,d,null);
        const read=JSON.parse(await readFile(join(dir,d.projectId+'.json'),'utf8'));
        assert.deepEqual(read,saved);
        assert.deepEqual(read.screens[0].elements.find(n=>n.id===e.id),before);
        assert.equal(inputOwner(read.screens[0],e.id,read.transitions).id,'action-card');
    } finally {await rm(dir,{recursive:true,force:true});}
});
