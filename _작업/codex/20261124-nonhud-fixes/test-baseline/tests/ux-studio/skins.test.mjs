import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SKINS, SKIN_ASSETS, createSkin, validateSkin, applySkin, constructGameUI, skinSource } from '../../src/tools/uxStudio/skins.mjs';
import { validateDocument, createRuntime, activate, resolveRect, adjustRect } from '../../src/tools/uxStudio/model.mjs';
import { copySelection } from '../../src/tools/uxStudio/commands.mjs';
import { createUnit, overlayTemplate } from '../../src/tools/uxStudio/units.mjs';
const before = JSON.parse(await readFile(new URL('./fixtures/lobby-v1.json', import.meta.url), 'utf8'));
function legacy() {
    const d = structuredClone(before);
    const s = d.screens[0];
    s.elements = s.elements.filter(e => !e.parentId);
    for (const e of s.elements) {
        if (e.component) {
            e.text = e.name;
            delete e.component;
            delete e.skin;
            delete e.interaction;
            delete e.partRole;
        }
    }
    d.schemaVersion = 1;
    return d;
}
test('constructs real lobby parent/face/content hierarchy preserving IDs, geometry, bindings and transitions', () => {
    const d = legacy(), old = structuredClone(d);
    constructGameUI(d, d.entryScreen);
    validateDocument(d);
    for (const e of old.screens[0].elements) {
        const n = d.screens[0].elements.find(n => n.id === e.id);
        assert.deepEqual([n.x, n.y, n.w, n.h], [e.x, e.y, e.w, e.h]);
        assert.deepEqual(n.binding, e.binding);
    }
    assert.deepEqual(d.transitions, old.transitions);
    const s = d.screens[0], face = s.elements.find(e => e.id === 'menu-shop-ui-background');
    assert.equal(face.parentId, 'menu-shop');
    assert.equal(s.elements.find(e => e.id === 'menu-shop-ui-label').parentId, face.id);
    const once = JSON.stringify(d);
    constructGameUI(d, d.entryScreen);
    assert.equal(JSON.stringify(d), once);
    assert.equal(s.elements.filter(e => e.binding?.type === 'content-slot').length, 2);
});
test('adding a skinned unit keeps an existing v4 anchor design valid and editable', () => {
    const d = legacy();
    d.schemaVersion = 4;
    for (const screen of d.screens)
        screen.logicalSize = {w: 390, h: 844};
    d.screens[0].elements[0].rectTransform = {
        min: [0, 1], max: [0, 1], pivot: [0, 1], position: [12, -16], sizeDelta: [160, 32]
    };
    validateDocument(d);
    const old = structuredClone(d), screen = d.screens[1], plate = createUnit('skin-backplate', 'new-info');
    screen.elements.push(plate);
    constructGameUI(d, screen.id, plate.id);
    assert.doesNotThrow(() => validateDocument(d));
    assert.equal(d.schemaVersion, 4);
    for (const original of old.screens) {
        const current = d.screens.find(s => s.id === original.id);
        assert.deepEqual(current.logicalSize, original.logicalSize);
        for (const element of original.elements)
            assert.deepEqual(current.elements.find(e => e.id === element.id), element);
    }
    assert.deepEqual(d.transitions, old.transitions);
    assert.equal(plate.component, 'game-ui');
    assert.equal(screen.elements.filter(e => e.id.startsWith('new-info-ui-')).length, 3);
    d.screens[0].elements[0].name = 'Renamed anchor';
    Object.assign(d.screens[0].elements[0], adjustRect(d.screens[0].elements[0], 8, 4, 390, 844));
    validateDocument(d);
    assert.deepEqual(resolveRect(d.screens[0], d.screens[0].elements[0].id, 390, 844), {x: 20, y: 20, w: 160, h: 32});
});
test('deep child input resolves exactly once to original action; display layers do not execute', () => {
    const d = constructGameUI(legacy(), before.entryScreen), s = d.screens[0];
    let r = activate(d, createRuntime(d), s.id, 'menu-shop-ui-image');
    assert.equal(r.lastAction.moduleId, 'simulator_module_shop');
    assert.equal(r.events.length, 1);
    assert.equal(r.events[0].element, 'menu-shop');
    const idle = activate(d, createRuntime(d), s.id, 'currency-dice-ui-background');
    assert.equal(idle.events.length, 0);
});
test('all seven UI families share tiny image resources and independent valid pastel definitions', async () => {
    assert.equal(Object.keys(SKINS).length, 7);
    for (const p of Object.keys(SKINS)) {
        const s = createSkin(p);
        validateSkin(s);
        const clone = createSkin(p);
        s.edges[1]++;
        assert.notEqual(s.edges[1], clone.edges[1]);
    }
    let bytes = 0;
    for (const a of Object.values(SKIN_ASSETS))
        bytes += (await readFile(new URL(a.src))).length;
    assert.ok(bytes < 2048, bytes);
    assert.equal(createSkin('button').mode, '3');
    assert.equal(createSkin('modal').mode, '9');
});
test('invalid slice geometry, unsafe colors and unregistered assets fail before rendering', () => {
    for (const alter of [s => s.slices = [96, 12, 1, 12], s => s.asset = 'https://evil', s => s.tone = 'red;display:none', s => s.edges = [1, NaN, 2, 3], s => s.repeat = 'script']) {
        const s = createSkin('modal');
        alter(s);
        assert.throws(() => validateSkin(s));
    }
    const s = createSkin('button');
    s.slices[0] = 1;
    assert.throws(() => validateSkin(s));
});
test('image state swaps reuse same component geometry and preserve normal fallback', () => {
    const s = createSkin('button'), png = 'data:image/png;base64,iVBORw0KGgo=';
    s.textures = {
        pressed: {
            src: png, w: 96, h: 48
        }
    };
    validateSkin(s);
    assert.equal(skinSource(s, 'pressed').src, png);
    assert.equal(skinSource(s, 'normal'), SKIN_ASSETS.button);
    s.textures.pressed.w = 1;
    assert.throws(() => validateSkin(s));
});
test('native image assembly keeps fixed cap widths and exposes pressed texture without nine DOM fragments', () => {
    const props = new Map(), node = {
        classList: {
            toggle() {
            }
        }, dataset: {}, style: {
            setProperty(k, v) {
                props.set(k, v);
            }
        }
    };
    const s = createSkin('button');
    applySkin(node, s, {
        live: true
    });
    assert.equal(props.get('--skin-edges'), '0px 12px 0px 12px');
    assert.match(props.get('--skin-source'), /button.svg/);
    assert.equal(props.get('--skin-pressed-source'), props.get('--skin-normal-source'));
    assert.equal(node.dataset.skinState, 'normal');
});
test('stretched background resolves inset pixels, moves without changing size and detaches correctly on copy', () => {
    const d = constructGameUI(legacy(), before.entryScreen), s = d.screens[0], face = s.elements.find(e => e.id === 'menu-shop-ui-background'), root = resolveRect(s, 'menu-shop', 390, 844), rect = resolveRect(s, face.id, 390, 844);
    assert.equal(rect.w, root.w - face.inset[1] - face.inset[3]);
    const moved = adjustRect(face, 3, 4, root.w, root.h);
    assert.equal(moved.inset[3], face.inset[3] + 3);
    assert.equal(moved.inset[1] + moved.inset[3], face.inset[1] + face.inset[3]);
    const copied = copySelection(d, s.id, [face.id]).elements.find(e => e.id === face.id);
    assert.equal(copied.inset, undefined);
    assert.equal(copied.parentId, undefined);
});
test('top/modal/bottom common windows have actual skin definitions and close controls', () => {
    for (const kind of ['top', 'modal', 'sheet']) {
        const s = overlayTemplate(kind, 'window-' + kind);
        assert.equal(s.skin.preset, kind === 'sheet' ? 'sheet' : kind === 'top' ? 'top' : 'modal');
        validateSkin(s.skin);
        assert.equal(s.elements.at(-1).skin.preset, 'button');
    }
});
