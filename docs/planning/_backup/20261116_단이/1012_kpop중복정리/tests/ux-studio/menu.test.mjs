import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { wrapMenu, arrangeChildren } from '../../src/tools/uxStudio/menu-layout.mjs';
import { menuIsOpen, hiddenByMenu, wheelValue } from '../../src/tools/uxStudio/menu-state.mjs';
import { validateDocument, resolveRect, createRuntime, activate, replayScenario } from '../../src/tools/uxStudio/model.mjs';
import { saveDocument } from '../../src/tools/uxStudio/save-plugin.mjs';
const sample = JSON.parse(await readFile('src/tools/uxStudio/sample.json', 'utf8'));
function make() {
    const d = structuredClone(sample), s = d.screens[0];
    wrapMenu(s, ['lobby-shop'], 'menu', 390, 844);
    return d;
}
function same(a, b) {
    for (const k of ['x', 'y', 'w', 'h'])
        assert.ok(Math.abs(a[k] - b[k]) < 1e-7, k);
}
test('wrap existing menu keeps absolute geometry, transition IDs and supports nesting', () => {
    const d = structuredClone(sample), s = d.screens[0], r = resolveRect(s, 'lobby-shop', 390, 844), links = structuredClone(d.transitions);
    wrapMenu(s, ['lobby-shop'], 'menu', 390, 844);
    same(resolveRect(s, 'lobby-shop', 390, 844), r);
    wrapMenu(s, ['menu'], 'outer', 390, 844);
    same(resolveRect(s, 'lobby-shop', 390, 844), r);
    assert.deepEqual(d.transitions, links);
    validateDocument(d);
});
test('group layout makes exactly equal pixel gaps without changing child sizes', () => {
    for (const direction of ['row', 'column']) {
        const s = {
            elements: [{
                    id: 'g', kind: 'panel', x: 0, y: 0, w: 90, h: 80
                }, ...Array.from({
                    length: 3
                }, (_, i) => ({
                    id: 'b' + i, parentId: 'g', kind: 'button', x: i * 10, y: i * 11, w: 10 + i * 5, h: 5 + i
                }))]
        };
        const before = s.elements.slice(1).map(e => resolveRect(s, e.id, 390, 844));
        arrangeChildren(s, 'g', direction, 12, 390, 844);
        const after = s.elements.slice(1).map(e => resolveRect(s, e.id, 390, 844));
        after.forEach((r, i) => {
            assert.ok(Math.abs(r.w - before[i].w) < 1e-7);
            assert.ok(Math.abs(r.h - before[i].h) < 1e-7);
            if (i)
                assert.ok(Math.abs((direction === 'row' ? r.x - after[i - 1].x - after[i - 1].w : r.y - after[i - 1].y - after[i - 1].h) - 12) < 1e-7);
        });
    }
});
test('menu toggle blocks hidden children, keeps design clean and reopens linked action', () => {
    const d = make(), before = structuredClone(d);
    let r = activate(d, createRuntime(d), 'lobby', 'menu');
    assert.equal(r.menuOpen.menu, false);
    r = activate(d, r, 'lobby', 'lobby-shop');
    assert.equal(r.page, 'lobby');
    r = activate(d, r, 'lobby', 'menu');
    r = activate(d, r, 'lobby', 'lobby-shop');
    assert.equal(r.page, 'shop');
    assert.deepEqual(d, before);
});
test('nested menu defaults and parent closure independently control visibility', () => {
    const d = make(), s = d.screens[0];
    wrapMenu(s, ['menu'], 'outer', 390, 844);
    assert.equal(hiddenByMenu(s, 'lobby-shop', {
        outer: false
    }), true);
    assert.equal(hiddenByMenu(s, 'lobby-shop', {
        outer: true, menu: false
    }), true);
    assert.equal(hiddenByMenu(s, 'lobby-shop', {}), false);
    assert.equal(menuIsOpen({
        id: 'x', menu: {
            defaultOpen: false
        }
    }), false);
});
test('invalid menu geometry/defaults and invalid gaps fail before mutation', () => {
    for (const config of [{
            defaultOpen: 1, headerHeight: 36
        }, {
            defaultOpen: true, headerHeight: Infinity
        }, {
            defaultOpen: true, headerHeight: 0
        }]) {
        const d = make();
        d.screens[0].elements.at(-1).menu = config;
        assert.throws(() => validateDocument(d));
    }
    const d = make(), before = structuredClone(d);
    assert.throws(() => arrangeChildren(d.screens[0], 'menu', 'column', -1, 390, 844));
    assert.deepEqual(d, before);
});
test('wheel supports pixel/percent, coarse/fine and direction', () => {
    assert.equal(wheelValue(100, -1, 'px'), 101);
    assert.equal(wheelValue(100, 1, 'px', true), 90);
    assert.equal(wheelValue(100, -1, 'px', false, true), 100.1);
    assert.equal(wheelValue(20, 1, '%'), 19.75);
});
test('menu hierarchy and spacing survive atomic save/reopen', async () => {
    const temp = await mkdtemp(resolve('_작업/codex/ux-studio/menu-test-'));
    try {
        const d = make();
        arrangeChildren(d.screens[0], 'menu', 'column', 16, 390, 844);
        const saved = await saveDocument(process.cwd(), temp, d, null), r = JSON.parse(await readFile(join(temp, 'lobby-demo.json'), 'utf8'));
        assert.deepEqual(r, saved);
        assert.equal(r.screens[0].elements.at(-1).layout.gap, 16);
    }
    finally {
        await rm(temp, {
            recursive: true, force: true
        });
    }
});
