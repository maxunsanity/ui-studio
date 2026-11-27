import test from 'node:test';
import assert from 'node:assert/strict';
import { PANEL_IDS, groupsFor, cleanWorkspace, clampPanel, paneWidths, movePanel } from '../../src/tools/uxStudio/workspace.mjs';
test('combined, two-row and four-row layouts include each panel once', () => {
    for (const mode of ['tabs', '2', '4']) {
        const groups = groupsFor(mode);
        assert.equal(groups.length, mode === 'tabs' ? 1 : Number(mode));
        assert.deepEqual([...groups.flat()].sort(), [...PANEL_IDS].sort());
    }
});
test('moving a tab between rows preserves unique ownership', () => {
    const groups = movePanel(groupsFor('2'), 'flow', 0);
    assert.deepEqual(groups[0], ['layer', 'properties', 'flow']);
    assert.deepEqual(groups[1], ['features', 'overlays']);
    assert.throws(() => movePanel(groups, 'unknown', 0));
});
test('saved workspace restores valid groups and row sizes, rejects malformed ownership', () => {
    const original = {
        mode: '2', groups: [['features', 'flow'], ['layer', 'overlays', 'properties']], weights: [300, 200], floats: {
            flow: {
                x: 100, y: 90, w: 380, h: 420
            }
        }
    };
    const clean = cleanWorkspace(original);
    assert.deepEqual(clean.groups, original.groups);
    assert.deepEqual(clean.weights, [300, 200]);
    assert.equal(clean.floats.flow.w, 380);
    const invalid = cleanWorkspace({
        mode: '4', groups: [['features', 'features']]
    });
    assert.deepEqual(invalid.groups, groupsFor('4'));
});
test('floating rectangle stays on-screen with usable minimum size', () => {
    const rect = clampPanel({
        x: -500, y: 4000, w: 10000, h: 10000
    }, 1440, 900);
    assert.ok(rect.x >= 8 && rect.y >= 8);
    assert.ok(rect.x + rect.w <= 1440);
    assert.ok(rect.y + rect.h <= 900);
    assert.ok(rect.w >= 240 && rect.h >= 150);
});
test('pane widths leave a usable canvas and sanitize narrow preferences', () => {
    const widths = paneWidths(1440, 480, 760);
    assert.ok(widths.left + widths.right + 260 <= 1440 - 56);
    assert.ok(widths.left >= 160 && widths.right >= 260);
    const small = cleanWorkspace({
        left: -10, right: -100, mode: 'bad'
    });
    assert.equal(small.left, 160);
    assert.equal(small.right, 260);
    assert.equal(small.mode, 'tabs');
});
test('right-to-left docking opens a wide left tab and preserves global unique ownership', async () => {
    const { dockSide } = await import('../../src/tools/uxStudio/workspace.mjs');
    let p = dockSide(cleanWorkspace(), 'features', 'left');
    assert.equal(p.leftActive, 'features');
    assert.ok(p.left >= 420);
    assert.ok(!p.groups.flat().includes('features'));
    assert.deepEqual(cleanWorkspace(p).leftPanels, ['features']);
    p = dockSide(p, 'features', 'right', 0);
    assert.equal(p.leftPanels.length, 0);
    assert.equal(p.groups.flat().filter(id => id === 'features').length, 1);
    assert.deepEqual([...p.groups.flat()].sort(), [...PANEL_IDS].sort());
});
test('all tabs may move left without losing their saved docking ownership', async () => {
    const { dockSide } = await import('../../src/tools/uxStudio/workspace.mjs');
    let p = cleanWorkspace();
    for (const id of PANEL_IDS)
        p = dockSide(p, id, 'left');
    const reread = cleanWorkspace(p);
    assert.equal(reread.leftPanels.length, PANEL_IDS.length);
    assert.equal(reread.groups.flat().length, 0);
});
test('old four-panel workspace migrates selection panel without moving existing owners', () => {
    const saved = {
        version: 2, mode: '2', leftPanels: ['features'], leftActive: 'features', groups: [['overlays'], ['properties', 'flow']], active: ['overlays', 'flow'], floats: {
            flow: {
                x: 200, y: 90, w: 300, h: 350
            }
        }
    };
    const next = cleanWorkspace(saved);
    assert.deepEqual(next.groups, [['layer', 'overlays'], ['properties', 'flow']]);
    assert.equal(next.leftActive, 'features');
    assert.ok(next.floats.flow);
    assert.equal(next.version, 4);
});
test('bottom docking moves ownership exactly once and restores saved bottom height', async () => {
    const { dockSide } = await import('../../src/tools/uxStudio/workspace.mjs');
    let p = dockSide(cleanWorkspace(), 'flow', 'bottom');
    p.bottomHeight = 300;
    assert.deepEqual(p.bottomPanels, ['flow']);
    assert.ok(!p.groups.flat().includes('flow'));
    let next = cleanWorkspace(p);
    assert.equal(next.bottomHeight, 300);
    assert.equal(next.bottomActive, 'flow');
    next = dockSide(next, 'flow', 'right', 0);
    assert.equal(next.bottomPanels.length, 0);
    assert.equal(next.groups.flat().filter(id => id === 'flow').length, 1);
});
test('whole studio frame preferences stay separate, bounded and optional', () => {
    assert.equal(cleanWorkspace({
        frame: {
            w: Infinity, h: 900
        }
    }).frame, null);
    assert.deepEqual(cleanWorkspace({
        frame: {
            w: 100, h: 10
        }
    }).frame, {
        w: 760, h: 500
    });
    assert.deepEqual(cleanWorkspace({
        frame: {
            w: 1200, h: 800
        }
    }).frame, {
        w: 1200, h: 800
    });
});
test('editor guides are opt-in and canvas colors reject arbitrary CSS', () => {
    const p = cleanWorkspace({
        stageColor: 'url(x)', canvasColor: '#aabbcc'
    });
    assert.equal(p.guides, false);
    assert.equal(p.stageColor, '#e5e5e5');
    assert.equal(p.canvasColor, '#aabbcc');
    assert.equal(cleanWorkspace({
        guides: true
    }).guides, true);
});
