import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, mkdir, symlink, rm, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { clone, validateDocument, resolveRect, adjustRect, createRuntime, activate, settlePurchase, replayScenario, audit } from '../../src/tools/uxStudio/model.mjs';
import { saveDocument } from '../../src/tools/uxStudio/save-plugin.mjs';
const root = process.cwd();
const sample = JSON.parse(await readFile(resolve(root, 'src/tools/uxStudio/sample.json'), 'utf8'));
function run() {
    return createRuntime(sample);
}
const click = (r, s, e) => activate(sample, r, s, e);
test('sample references and unique IDs are valid', () => assert.equal(validateDocument(sample), sample));
test('parent percentage rect remains correct at different sizes', () => {
    const s = sample.screens.find(s => s.id === 'shop');
    const r = resolveRect(s, 'product-1', 390, 844);
    assert.ok(Math.abs(r.w - 390 * .9 * .96) < 1e-8);
    const x = resolveRect(s, 'product-1', 780, 1688);
    assert.equal(x.w, r.w * 2);
    assert.equal(x.y, r.y * 2);
});
test('drag translates actual logical deltas into parent percentages and resize keeps positive bounds', () => {
    const e = {
        x: 10, y: 10, w: 50, h: 20
    };
    assert.equal(adjustRect(e, 10, 0, 200, 400, false, 0).x, 15);
    assert.equal(adjustRect(e, -1000, -1000, 200, 400, true).w, 1);
});
test('invalid cyclic parents and missing targets rejected', () => {
    const d = clone(sample);
    d.screens[0].elements[0].parentId = d.screens[0].elements[0].id;
    assert.throws(() => validateDocument(d), /循環|순환/);
    const bad = clone(sample);
    bad.transitions[0].targetScreen = 'absent';
    assert.throws(() => validateDocument(bad), /대상/);
});
test('nonfinite coordinates, duplicate elements and arbitrary action rejected', () => {
    for (const mutate of [d => d.screens[0].elements[0].w = NaN, d => d.screens[0].elements.push(clone(d.screens[0].elements[0])), d => d.transitions[0].action = 'eval']) {
        const d = clone(sample);
        mutate(d);
        assert.throws(() => validateDocument(d));
    }
});
test('lobby -> shop -> modal -> cancel restores selected item, list scroll and opening focus', () => {
    let r = click(run(), 'lobby', 'lobby-shop');
    r.filter = 'material';
    r.scroll['shop-list'] = 200;
    r = click(r, 'shop', 'product-2');
    assert.deepEqual(r.overlays, ['product']);
    assert.equal(r.selection, 'item-2');
    r = click(r, 'product', 'product-close');
    assert.equal(r.page, 'shop');
    assert.equal(r.filter, 'material');
    assert.equal(r.scroll['shop-list'], 200);
    assert.equal(r.focusReturn, 'product-2');
    assert.equal(r.overlays.length, 0);
});
test('modal blocks underlying screen inputs', () => {
    let r = click(click(run(), 'lobby', 'lobby-shop'), 'shop', 'product-1');
    r = click(r, 'shop', 'shop-back');
    assert.equal(r.page, 'shop');
    assert.equal(r.overlays.length, 1);
});
test('successful mock request decrements fixture once and returns to shop', () => {
    let r = click(click(run(), 'lobby', 'lobby-shop'), 'shop', 'product-1');
    r = click(r, 'product', 'product-buy');
    assert.equal(r.pending, true);
    r = click(r, 'product', 'product-buy');
    assert.equal(r.pending, true);
    r = settlePurchase(sample, r);
    assert.equal(r.balance, 400);
    assert.equal(r.overlays.length, 0);
    assert.equal(r.focusReturn, 'product-1');
    assert.equal(settlePurchase(sample, r).balance, 400);
});
test('insufficient funds, response failure and timeout preserve modal and fixture balance', () => {
    for (const state of [{
            balance: 0, response: 'success'
        }, {
            balance: 500, response: 'failure'
        }, {
            balance: 500, response: 'timeout'
        }]) {
        let r = click(click(run(), 'lobby', 'lobby-shop'), 'shop', 'product-1');
        Object.assign(r, state);
        r = settlePurchase(sample, click(r, 'product', 'product-buy'));
        assert.equal(r.balance, state.balance);
        assert.deepEqual(r.overlays, ['product']);
        assert.equal(r.pending, false);
    }
});
test('unknown condition stops rather than choosing another branch', () => {
    const d = clone(sample);
    d.transitions[0].condition = 'unknown';
    const r = activate(d, createRuntime(d), 'lobby', 'lobby-shop');
    assert.equal(r.page, 'lobby');
    assert.match(r.message, /미정/);
});
test('back retains preceding page and return source', () => {
    let r = click(run(), 'lobby', 'lobby-shop');
    r = click(r, 'shop', 'shop-back');
    assert.equal(r.page, 'lobby');
    assert.equal(r.focusReturn, 'lobby-shop');
});
test('audit finds unconnected button and modal close omissions', () => {
    const d = clone(sample);
    d.transitions = d.transitions.filter(t => t.fromElement !== 'product-close');
    const notes = audit(d);
    assert.ok(notes.some(n => n.element === 'product-close'));
    assert.ok(notes.some(n => n.screen === 'product' && n.text.includes('복귀')));
});
test('atomic save, reopen equivalence, backup and concurrent revision conflict', async () => {
    const temp = await mkdtemp(resolve(root, '_작업/codex/ux-studio/tests-'));
    try {
        const d = clone(sample);
        const first = await saveDocument(root, join(temp, 'projects'), d, null);
        assert.equal(first.revision, 1);
        assert.deepEqual(JSON.parse(await readFile(join(temp, 'projects/lobby-demo.json'), 'utf8')), first);
        const outcomes = await Promise.allSettled([saveDocument(root, join(temp, 'projects'), first, 1), saveDocument(root, join(temp, 'projects'), first, 1)]);
        assert.equal(outcomes.filter(r => r.status === 'fulfilled').length, 1);
        assert.equal(outcomes.filter(r => r.status === 'rejected' && r.reason.status === 409).length, 1);
        const latest = JSON.parse(await readFile(join(temp, 'projects/lobby-demo.json'), 'utf8'));
        assert.equal(latest.revision, 2);
        assert.equal((await readdir(join(temp, 'projects/backups'))).length, 1);
        await assert.rejects(() => saveDocument(root, join(temp, 'projects'), first, 1));
        assert.equal(JSON.parse(await readFile(join(temp, 'projects/lobby-demo.json'), 'utf8')).revision, 2);
    }
    finally {
        await rm(temp, {
            recursive: true, force: true
        });
    }
});
test('symlink save root and traversal ID rejected', async () => {
    const temp = await mkdtemp(resolve(root, '_작업/codex/ux-studio/tests-'));
    try {
        await mkdir(join(temp, 'actual'));
        await symlink(join(temp, 'actual'), join(temp, 'linked'));
        await assert.rejects(() => saveDocument(root, join(temp, 'linked'), sample, null), /심볼릭/);
        const bad = clone(sample);
        bad.projectId = '../escape';
        await assert.rejects(() => saveDocument(root, join(temp, 'actual'), bad, null));
    }
    finally {
        await rm(temp, {
            recursive: true, force: true
        });
    }
});
test('scenario replay follows saved events and rejects another revision', () => {
    let r = click(click(run(), 'lobby', 'lobby-shop'), 'shop', 'product-1');
    r = settlePurchase(sample, click(r, 'product', 'product-buy'));
    const scenario = {
        projectId: sample.projectId, revision: sample.revision, result: r
    };
    const replay = replayScenario(sample, scenario);
    assert.equal(replay.balance, r.balance);
    assert.equal(replay.page, r.page);
    assert.deepEqual(replay.overlays, r.overlays);
    scenario.revision = 9;
    assert.throws(() => replayScenario(sample, scenario));
});
