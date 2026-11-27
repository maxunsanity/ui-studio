import test from 'node:test';
import assert from 'node:assert/strict';
import { UNITS, SHAPES, createUnit, validateAppearance, validatePresentation, dropPosition, overlayTemplate, flowData } from '../../src/tools/uxStudio/units.mjs';
import { validateDocument, createRuntime, activate } from '../../src/tools/uxStudio/model.mjs';
import { saveDocument } from '../../src/tools/uxStudio/save-plugin.mjs';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
const sample = JSON.parse(await readFile('src/tools/uxStudio/sample.json', 'utf8'));
test('all wireframe presets have unique IDs and valid styles; all shapes have panels and buttons', () => {
    assert.equal(new Set(UNITS.map(p => p.id)).size, UNITS.length);
    assert.ok(UNITS.length >= 40);
    for (const p of UNITS)
        validateAppearance(createUnit(p.id, 'test').appearance);
    for (const shape of Object.keys(SHAPES)) {
        assert.ok(UNITS.some(p => p.id === 'panel-' + shape));
        assert.ok(UNITS.some(p => p.id === 'button-' + shape));
    }
});
test('preset creation never mutates the library', () => {
    const a = createUnit('button-hexagon', 'a'), b = createUnit('button-hexagon', 'b');
    a.appearance.fill = '#123456';
    assert.notEqual(b.appearance.fill, a.appearance.fill);
});
test('unsafe colors, unsupported shape and invalid motion are rejected at save boundary', () => {
    for (const bad of [{
            fill: 'url(https://test)'
        }, {
            shape: 'script'
        }, {
            opacity: 2
        }, {
            strokeWidth: -1
        }]) {
        const d = structuredClone(sample);
        d.screens[0].elements[0].appearance = bad;
        assert.throws(() => validateDocument(d));
    }
    assert.throws(() => validatePresentation({
        type: 'sheet', effect: 'slide', durationMs: Infinity, dim: true, autoCloseMs: 0
    }));
});
test('drop converts scaled bounding rectangle and clamps inside visible root', () => {
    const r = {
        left: 20, top: 40, width: 195, height: 422
    }, unit = {
        w: 20, h: 10
    };
    assert.deepEqual(dropPosition(117.5, 251, r, unit), {
        x: 40, y: 45
    });
    assert.deepEqual(dropPosition(-10, -10, r, unit), {
        x: 0, y: 0
    });
});
test('overlay templates have common close button and can open above either page without replacing it', () => {
    for (const type of ['modal', 'sheet', 'toast', 'popover']) {
        const d = structuredClone(sample), o = overlayTemplate(type, 'common');
        d.screens.push(o);
        d.transitions.push({
            id: 'open-common', fromScreen: 'shop', fromElement: 'shop-back', event: 'click', action: 'open', condition: 'always', targetScreen: o.id
        });
        d.transitions.unshift(d.transitions.pop());
        d.transitions.push({
            id: 'close-common', fromScreen: o.id, fromElement: o.elements.at(-1).id, event: 'click', action: 'close', condition: 'always'
        });
        validateDocument(d);
        let r = createRuntime(d);
        r.page = 'shop';
        r.scroll['shop-list'] = 321;
        r = activate(d, r, 'shop', 'shop-back');
        assert.equal(r.page, 'shop');
        assert.equal(r.overlays.at(-1), 'common');
        r = activate(d, r, 'common', o.elements.at(-1).id);
        assert.equal(r.page, 'shop');
        assert.equal(r.overlays.length, 0);
        assert.equal(r.scroll['shop-list'], 321);
    }
});
test('toast lets the underlying page run while modal blocks it', () => {
    for (const type of ['toast', 'modal']) {
        const d = structuredClone(sample), o = overlayTemplate(type, 'common');
        d.screens.push(o);
        let r = createRuntime(d);
        r.overlays = ['common'];
        r = activate(d, r, 'lobby', 'lobby-shop');
        assert.equal(r.page, type === 'toast' ? 'shop' : 'lobby');
    }
});
test('page relation graph excludes presentation library and never invents return targets', () => {
    const view = flowData(sample);
    assert.deepEqual(view.nodes.map(n => n.id), ['lobby', 'shop']);
    assert.equal(view.edges.length, 1);
    assert.equal(view.edges[0].from, 'lobby');
    assert.equal(view.edges[0].to, 'shop');
});
test('appearance and shared presentation survive real atomic save and reread', async () => {
    const root = process.cwd(), temp = await mkdtemp(resolve(root, '_작업/codex/ux-studio/units-test-'));
    try {
        const d = structuredClone(sample);
        d.screens[0].elements.push(createUnit('button-triangle', 'triangle'));
        d.screens.find(s => s.id === 'help').presentation = {
            type: 'sheet', effect: 'slide', durationMs: 240, dim: true, autoCloseMs: 0
        };
        const saved = await saveDocument(root, temp, d, null), r = JSON.parse(await readFile(join(temp, 'lobby-demo.json'), 'utf8'));
        assert.deepEqual(r, saved);
        assert.equal(r.screens[0].elements.at(-1).appearance.shape, 'triangle');
        assert.equal(r.screens.find(s => s.id === 'help').presentation.type, 'sheet');
    }
    finally {
        await rm(temp, {
            recursive: true, force: true
        });
    }
});
test('wireframe convention changes only appearance and distinguishes linked controls from display areas', async () => {
    const { applyWireframeStyle } = await import('../../src/tools/uxStudio/units.mjs');
    const d = structuredClone(sample), before = structuredClone(d);
    applyWireframeStyle(d);
    assert.equal(d.screens.find(s => s.id === 'lobby').elements.find(e => e.id === 'lobby-shop').appearance.shape, 'ellipse');
    assert.equal(d.screens.find(s => s.id === 'lobby').elements.find(e => e.kind === 'panel').appearance.shape, 'rectangle');
    for (let i = 0; i < d.screens.length; i++)
        for (let j = 0; j < d.screens[i].elements.length; j++) {
            const a = {
                ...d.screens[i].elements[j]
            }, b = {
                ...before.screens[i].elements[j]
            };
            delete a.appearance;
            delete b.appearance;
            assert.deepEqual(a, b);
        }
    assert.deepEqual(d.transitions, before.transitions);
});
