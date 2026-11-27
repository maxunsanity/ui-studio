import test from 'node:test';
import assert from 'node:assert/strict';
import { moveInto, descendants, isolationSets, transformValue } from '../../src/tools/uxStudio/layers.mjs';
import { resolveRect } from '../../src/tools/uxStudio/model.mjs';
const make = () => ({
    elements: [{
            id: 'a', kind: 'panel', x: 10, y: 10, w: 80, h: 70
        }, {
            id: 'b', kind: 'panel', x: 10, y: 10, w: 50, h: 50, parentId: 'a'
        }, {
            id: 'c', kind: 'button', x: 55, y: 55, w: 20, h: 10
        }, {
            id: 'd', kind: 'text', x: 2, y: 2, w: 30, h: 20, parentId: 'b'
        }]
});
function same(a, b) {
    for (const key of ['x', 'y', 'w', 'h'])
        assert.ok(Math.abs(a[key] - b[key]) < 1e-8, key);
}
test('reparent into nested layer preserves absolute bounds and can return to root', () => {
    const s = make(), before = resolveRect(s, 'c', 390, 844);
    moveInto(s, ['c'], 'b', 390, 844);
    assert.equal(s.elements[2].parentId, 'b');
    same(resolveRect(s, 'c', 390, 844), before);
    moveInto(s, ['c'], '', 390, 844);
    assert.equal(s.elements[2].parentId, undefined);
    same(resolveRect(s, 'c', 390, 844), before);
});
test('cycle and non-container targets are rejected without mutation', () => {
    for (const [ids, target] of [[['a'], 'b'], [['c'], 'd'], [['a'], 'a']]) {
        const s = make(), before = structuredClone(s);
        assert.throws(() => moveInto(s, ids, target, 390, 844));
        assert.deepEqual(s, before);
    }
});
test('moving a parent and child selection only reparents the top selected root', () => {
    const s = make();
    const ids = moveInto(s, ['b', 'd'], '', 390, 844);
    assert.deepEqual(ids, ['b']);
    assert.equal(s.elements[3].parentId, 'b');
});
test('isolation retains selected subtree and structural ancestors, excluding siblings', () => {
    const s = make(), v = isolationSets(s, ['b']);
    assert.deepEqual([...v.shown].sort(), ['b', 'd']);
    assert.deepEqual([...v.keep].sort(), ['a', 'b', 'd']);
    assert.deepEqual([...descendants(s, ['a'])].sort(), ['a', 'b', 'd']);
});
test('manual pixel width converts against actual parent and percent edit stays percent', () => {
    const s = make(), e = s.elements[3], parent = resolveRect(s, 'b', 390, 844);
    transformValue(s, e, 'w', 78, 'px', 390, 844);
    assert.equal(e.w, 78 / parent.w * 100);
    transformValue(s, e, 'x', 12.5, '%', 390, 844);
    assert.equal(e.x, 12.5);
    assert.throws(() => transformValue(s, e, 'h', 0, 'px', 390, 844));
});

test('inset reparent preserves bounds, descendant position and pixel edges through root roundtrip', () => {
    const s = make(), e = s.elements.find(e => e.id === 'b');
    e.inset = [12, 15, 18, 21];
    const before = resolveRect(s, 'b', 390, 844), child = resolveRect(s, 'd', 390, 844);
    moveInto(s, ['b','d'], '', 390, 844);
    same(resolveRect(s, 'b', 390, 844), before);
    same(resolveRect(s, 'd', 390, 844), child);
    assert.ok(e.inset);
    const bigger = resolveRect(s, 'b', 490, 944);
    same(bigger, {...before, w:before.w+100, h:before.h+100});
    moveInto(s, ['b'], 'a', 390, 844);
    same(resolveRect(s, 'b', 390, 844), before);
    same(resolveRect(s, 'd', 390, 844), child);
    for (let i=0;i<4;i++) assert.ok(Math.abs(e.inset[i]-[12,15,18,21][i])<1e-8);
});
