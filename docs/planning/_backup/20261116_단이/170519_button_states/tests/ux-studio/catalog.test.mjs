import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { readFeatureCatalog } from '../../src/tools/uxStudio/catalog.mjs';
import { createLobbyDesign } from '../../src/tools/uxStudio/lobby.mjs';
import { validateBinding, bindFeature } from '../../src/tools/uxStudio/bindings.mjs';
import { validateDocument, createRuntime, activate } from '../../src/tools/uxStudio/model.mjs';
import { saveDocument } from '../../src/tools/uxStudio/save-plugin.mjs';
const root = process.cwd(), fixtureRoot = resolve(root, 'tests/ux-studio/fixtures/kpop-catalog'), catalog = await readFeatureCatalog(fixtureRoot);
test('metadata mirrors registry, merges aliases, supplies doc IDs and excludes executable source paths', () => {
    assert.equal(catalog.registeredCount, catalog.modules.length + catalog.modules.reduce((n, m) => n + m.aliases.length, 0));
    assert.equal(new Set(catalog.modules.map(m => m.id)).size, catalog.modules.length);
    assert.ok(catalog.modules.find(m => m.id === 'simulator_module_shop').docId);
    assert.ok(catalog.modules.find(m => m.id === 'simulator_module_stage_battle').aliases.includes('simulator_module_casting_battle'));
    const text = JSON.stringify(catalog);
    assert.doesNotMatch(text, /entry_path|source_path|control_path|overlay_path|\.glb|\.gltf/);
});
test('lobby common-layout draft uses exact configured logical size and menus without importing game state', () => {
    const d = createLobbyDesign(catalog, 'lobby-catalog-test');
    validateDocument(d);
    assert.equal(d.designBasis.logicalSize.width, catalog.common.layout.width);
    assert.equal(d.screens[0].elements.filter(e => !e.parentId && e.id.startsWith('menu-')).length, catalog.common.menus.length);
    assert.equal(d.screens[0].elements.find(e => e.id === 'slot-filler').h, catalog.common.layout.review.fillerHeight / catalog.common.layout.height * 100);
    assert.equal(d.fixtures.items.length, 0);
    assert.equal(d.designBasis.status, 'draft-layout-not-measured-lobby');
});
test('world and filler are opaque content slots, never asset URLs', () => {
    const d = createLobbyDesign(catalog, 'lobby-slot-test'), slots = d.screens[0].elements.filter(e => e.binding?.type === 'content-slot');
    assert.deepEqual(slots.map(e => e.binding.slot), ['world', 'filler']);
    assert.throws(() => validateBinding({
        type: 'content-slot', slot: 'world', url: '/secret.glb'
    }));
});
test('registered feature assignment produces mock request and does not navigate or reset state', () => {
    const d = createLobbyDesign(catalog, 'lobby-action-test');
    let r = createRuntime(d);
    r.balance = 123;
    r.scroll['list'] = 200;
    const after = activate(d, r, d.entryScreen, 'menu-shop');
    assert.equal(after.lastAction.moduleId, 'simulator_module_shop');
    assert.equal(after.page, d.entryScreen);
    assert.equal(after.balance, 123);
    assert.equal(after.scroll.list, 200);
    assert.match(after.message, /게임 실행 없음/);
    const again = activate(d, after, d.entryScreen, 'lobby-title');
    assert.equal(again.lastAction, null);
});
test('binding selects an existing matching design page when it exists', () => {
    const d = createLobbyDesign(catalog, 'lobby-route-test');
    d.screens.push({
        id: 'shop', moduleId: 'simulator_module_shop', name: '상점', kind: 'page', elements: []
    });
    bindFeature(d, d.entryScreen, 'menu-shop', catalog.modules.find(m => m.id === 'simulator_module_shop'));
    validateDocument(d);
    const r = activate(d, createRuntime(d), d.entryScreen, 'menu-shop');
    assert.equal(r.page, 'shop');
    assert.equal(r.lastAction, null);
});
test('malformed module actions rejected rather than evaluated', () => {
    const d = createLobbyDesign(catalog, 'lobby-bad-test');
    const t = d.transitions.find(t => t.action === 'module');
    t.payload.moduleId = 'javascript:alert(1)';
    assert.throws(() => validateDocument(d));
});
test('bindings, slots and layout provenance survive atomic save', async () => {
    const tmp = await mkdtemp(resolve(root, '_작업/codex/ux-studio/catalog-test-'));
    try {
        const d = createLobbyDesign(catalog, 'lobby-save-test'), saved = await saveDocument(root, tmp, d, null), r = JSON.parse(await readFile(join(tmp, d.projectId + '.json'), 'utf8'));
        assert.deepEqual(r, saved);
        assert.equal(r.screens[0].elements.find(e => e.id === 'slot-world').binding.slot, 'world');
    }
    finally {
        await rm(tmp, {
            recursive: true, force: true
        });
    }
});
test('consumer dependency closure excludes editor, graph viewer, simulator engine and 3D assets', async () => {
    const seen = new Set();
    async function visit(path) {
        if (seen.has(path))
            return;
        seen.add(path);
        const text = await readFile(path, 'utf8');
        assert.doesNotMatch(text, /from\s+['"](?:three|.*simulator\/)|import\s*\(.*simulator|\.glb|\.gltf|\bMoveable\b|\bSelecto\b|vis-network/);
        for (const m of text.matchAll(/(?:import|export)\s+(?:[^;]*?\s+from\s+)?['"](\.[^'"]+)['"]/g)) {
            if (m[1].endsWith('.mjs'))
                await visit(resolve(dirname(path), m[1]));
        }
    }
    await visit(resolve(root, 'src/tools/uxStudio/consumer.mjs'));
    assert.deepEqual([...seen].sort(), ['asset-reference.mjs','bindings.mjs','consumer.mjs','controls.mjs','layout-view.mjs','menu-state.mjs','model.mjs','notification.mjs','overlay-runtime.mjs','parts.mjs','rect-transform.mjs','responsive-layout.mjs','skins.mjs','units.mjs','visual-effects.mjs'].map(name => resolve(root, 'src/tools/uxStudio', name)).sort());
});
