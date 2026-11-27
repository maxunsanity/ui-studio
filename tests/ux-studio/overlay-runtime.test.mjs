import test from 'node:test';
import assert from 'node:assert/strict';
import { createRuntime, activate } from '../../src/tools/uxStudio/model.mjs';
import { validatePresentation, overlayTemplate } from '../../src/tools/uxStudio/units.mjs';

const e = id => ({ id, name: id, kind: 'button', x: 0, y: 0, w: 20, h: 10, text: id });
const presentation = (type, more = {}) => ({ type, effect: 'fade', durationMs: 200, autoCloseMs: 0, dim: type === 'modal', ...more });
function fixture() {
    return { schemaVersion: 3, projectId: 'overlay-test', revision: 0, name: 'Overlays', entryScreen: 'page', fixtures: { balance: 0, items: [] }, screens: [
        { id: 'page', kind: 'page', name: 'Page', elements: [e('open'), e('page-action')] },
        { id: 'modal', kind: 'modal', name: 'Modal', presentation: presentation('modal'), elements: [e('close'), e('toast-open'), e('nested-open')] },
        { id: 'nested', kind: 'modal', name: 'Nested', presentation: presentation('sheet'), elements: [e('nested-close')] },
        { id: 'toast', kind: 'toast', name: 'Toast', presentation: presentation('toast', { autoCloseMs: 100 }), elements: [e('toast-close')] },
        { id: 'toast-two', kind: 'toast', name: 'Second toast', presentation: presentation('toast', { autoCloseMs: 100, toastPolicy: 'queue' }), elements: [] }
    ], transitions: [
        ['open', 'page', 'open', 'open', 'modal'], ['toast-open', 'modal', 'toast-open', 'open', 'toast'], ['close', 'modal', 'close', 'close'], ['nested-open', 'modal', 'nested-open', 'open', 'nested'], ['nested-close', 'nested', 'nested-close', 'close'], ['toast-close', 'toast', 'toast-close', 'close'], ['page-action', 'page', 'page-action', 'feedback']
    ].map(([id, fromScreen, fromElement, action, targetScreen]) => ({ id, fromScreen, fromElement, action, targetScreen, event: 'click', condition: 'always' })) };
}
test('modal close removes its own overlay when a nonmodal toast is above it', () => {
    const d = fixture(); let r = createRuntime(d);
    r = activate(d, r, 'page', 'open'); r = activate(d, r, 'modal', 'toast-open');
    assert.deepEqual(r.overlays, ['modal', 'toast']);
    r = activate(d, r, 'modal', 'close');
    assert.deepEqual(r.overlays, ['toast']);
    assert.equal(r.focusReturn, 'open');
});
test('presentation validates independent blocking, dismissal and toast policies', () => {
    for (const more of [{ blocking: 'yes' }, { dismissOnEscape: 1 }, { closePolicy: 'script' }, { toastPolicy: 'unknown' }])
        assert.throws(() => validatePresentation(presentation('modal', more)), /연출/);
    validatePresentation(presentation('modal', { blocking: false, dim: true, dismissOnEscape: false, closePolicy: 'prevent' }));
    assert.equal(overlayTemplate('toast', 'new-toast').presentation.toastPolicy, 'queue');
});
test('blocking follows explicit policy and screen kind independently from dim and visual type', async () => {
    const o = await import('../../src/tools/uxStudio/overlay-runtime.mjs');
    assert.equal(o.overlayPolicy({ kind: 'toast' }).blocking, false);
    assert.equal(o.overlayPolicy({ kind: 'modal', presentation: presentation('modal', { dim: false }) }).blocking, true);
    assert.equal(o.overlayPolicy({ kind: 'modal', presentation: presentation('modal', { blocking: false, dim: true }) }).blocking, false);
    assert.deepEqual(o.overlayMotion({ presentation: presentation('sheet') }, true), { effect: 'none', durationMs: 0 });
});
test('nonmodal input above the current modal is allowed while lower modal and page stay blocked', async () => {
    const o = await import('../../src/tools/uxStudio/overlay-runtime.mjs'), d = fixture(), r = { ...createRuntime(d), overlays: ['modal', 'nested', 'toast'] };
    assert.equal(o.canOverlayInput(d, r, 'page'), false); assert.equal(o.canOverlayInput(d, r, 'modal'), false);
    assert.equal(o.canOverlayInput(d, r, 'nested'), true); assert.equal(o.canOverlayInput(d, r, 'toast'), true);
    assert.equal(o.canOverlayInput(d, r, 'absent'), false);
});
test('closing an exact overlay preserves other overlays and aligned return focus', async () => {
    const o = await import('../../src/tools/uxStudio/overlay-runtime.mjs'), d = fixture();
    let r = o.openOverlay(d, createRuntime(d), 'modal', { trigger: 'open' });
    r = o.openOverlay(d, r, 'toast', { trigger: 'toast-open' });
    const next = o.closeOverlay(d, r, 'modal');
    assert.deepEqual(next.overlays, ['toast']); assert.deepEqual(next.focusStack, ['toast-open']); assert.equal(next.focusReturn, 'open');
    assert.deepEqual(r.overlays, ['modal', 'toast']);
});
test('Escape respects locked/top modal policy and close veto without dismissing lower dialogs', async () => {
    const o = await import('../../src/tools/uxStudio/overlay-runtime.mjs'), d = fixture();
    let r = o.openOverlay(d, createRuntime(d), 'modal', { trigger: 'open' }); r = o.openOverlay(d, r, 'nested', { trigger: 'nested-open' });
    d.screens.find(s => s.id === 'nested').presentation.dismissOnEscape = false;
    assert.deepEqual(o.escapeOverlay(d, r).overlays, ['modal', 'nested']);
    d.screens.find(s => s.id === 'nested').presentation.dismissOnEscape = true;
    assert.deepEqual(o.escapeOverlay(d, r, { canClose: () => false }).overlays, ['modal', 'nested']);
    const next = o.escapeOverlay(d, r); assert.deepEqual(next.overlays, ['modal']); assert.equal(next.focusReturn, 'nested-open');
    d.screens.find(s => s.id === 'modal').presentation.closePolicy = 'prevent';
    assert.deepEqual(o.closeOverlay(d, next, 'modal').overlays, ['modal']);
    assert.deepEqual(o.closeOverlay(d, r, 'modal').overlays, ['modal', 'nested']);
});
test('toasts dedupe active/queued IDs and queue only shows the next toast after the current closes', async () => {
    const o = await import('../../src/tools/uxStudio/overlay-runtime.mjs'), d = fixture();
    let r = o.openOverlay(d, createRuntime(d), 'modal', { trigger: 'open' });
    r = o.openOverlay(d, r, 'toast'); r = o.openOverlay(d, r, 'toast'); r = o.openOverlay(d, r, 'toast-two'); r = o.openOverlay(d, r, 'toast-two');
    assert.deepEqual(r.overlays, ['modal', 'toast']); assert.equal(r.overlayQueue.length, 1);
    r = o.closeOverlay(d, r, 'toast', { reason: 'timeout' });
    assert.deepEqual(r.overlays, ['modal', 'toast-two']); assert.equal(r.overlayQueue.length, 0);
    assert.equal(r.focusReturn, 'open');
});
function scheduler() {
    const callbacks = new Map(), cleared = []; let seq = 0;
    return { callbacks, cleared, setTimeout: callback => { callbacks.set(++seq, callback); return seq; }, clearTimeout: id => cleared.push(id) };
}
test('timer closes only its toast and stale callbacks cannot close a reopened instance or survive reset/dispose', async () => {
    const o = await import('../../src/tools/uxStudio/overlay-runtime.mjs'), d = fixture(), clock = scheduler();
    let r = o.openOverlay(d, createRuntime(d), 'modal', { trigger: 'open' }); r = o.openOverlay(d, r, 'toast');
    const timer = o.createOverlayTimers({ getDesign: () => d, getRuntime: () => r, onChange: next => { r = next; }, ...clock });
    timer.sync(); timer.sync(); assert.equal(clock.callbacks.size, 1);
    const stale = clock.callbacks.get(1);
    r = o.closeOverlay(d, r, 'toast', { reason: 'timeout' }); timer.sync(); r = o.openOverlay(d, r, 'toast'); timer.sync();
    stale(); assert.deepEqual(r.overlays, ['modal', 'toast']);
    clock.callbacks.get(2)(); assert.deepEqual(r.overlays, ['modal']);
    r = o.openOverlay(d, r, 'toast'); timer.sync(); const afterReset = [...clock.callbacks.values()].at(-1); timer.reset(); afterReset(); assert.deepEqual(r.overlays, ['modal', 'toast']);
    timer.sync(); const afterDispose = [...clock.callbacks.values()].at(-1); timer.dispose(); afterDispose(); assert.deepEqual(r.overlays, ['modal', 'toast']);
});
test('vetoed auto close fires once instead of endlessly rescheduling', async () => {
    const o = await import('../../src/tools/uxStudio/overlay-runtime.mjs'), d = fixture(), clock = scheduler();
    const r = o.openOverlay(d, createRuntime(d), 'toast');
    const timer = o.createOverlayTimers({ getDesign: () => d, getRuntime: () => r, onChange: () => assert.fail('close vetoed'), canClose: () => false, ...clock });
    timer.sync(); clock.callbacks.get(1)(); timer.sync(); assert.equal(clock.callbacks.size, 1); timer.dispose();
});
test('buttonless modal traps both Tab directions on its own panel', async () => {
    const o = await import('../../src/tools/uxStudio/overlay-runtime.mjs');
    const doc = {}, panel = { ownerDocument: doc, tabIndex: 0, querySelectorAll: () => [], contains: n => n === panel, focus() { doc.activeElement = panel; } };
    for (const shiftKey of [false, true]) {
        let prevented = false; doc.activeElement = null;
        o.trapOverlayFocus({ key: 'Tab', shiftKey, preventDefault() { prevented = true; } }, panel);
        assert.equal(prevented, true); assert.equal(doc.activeElement, panel); assert.equal(panel.tabIndex, -1);
    }
});
test('nested focus returns to its opener and ordinary paints preserve the current field', async () => {
    const o = await import('../../src/tools/uxStudio/overlay-runtime.mjs'), d = fixture(), doc = {};
    function panel(ids) {
        const p = { ownerDocument: doc, parentNode: {}, inert: false, attributes: {}, tabIndex: -1, setAttribute(k, v) { this.attributes[k] = v; }, removeAttribute(k) { delete this.attributes[k]; }, contains(n) { return n === p || p.items.includes(n); }, querySelectorAll() { return p.items; }, focus() { doc.activeElement = p; } };
        p.items = ids.map(id => ({ dataset: { element: id }, tabIndex: 0, getAttribute: () => null, getClientRects: () => [1], closest: selector => selector === '[inert]' ? p.inert || p.parentNode.inert ? p : null : null, focus() { doc.activeElement = this; } }));
        return p;
    }
    const page = panel(['open']), modal = panel(['close', 'nested-open']), nested = panel(['nested-close']), panels = new Map([['modal', modal], ['nested', nested]]);
    let r = o.openOverlay(d, createRuntime(d), 'modal', { trigger: 'open' });
    o.syncOverlayFocus(d, r, page, new Map([['modal', modal]])); assert.equal(page.inert, true); assert.equal(doc.activeElement, modal.items[0]);
    r = o.openOverlay(d, r, 'nested', { trigger: 'nested-open' });
    o.syncOverlayFocus(d, r, page, panels, { previousModal: modal, previousFocus: modal.items[1] }); assert.equal(modal.inert, true); assert.equal(doc.activeElement, nested.items[0]);
    r = o.closeOverlay(d, r, 'nested');
    o.syncOverlayFocus(d, r, page, new Map([['modal', modal]]), { previousModal: nested, previousFocus: nested.items[0] }); assert.equal(doc.activeElement, modal.items[1]);
    o.syncOverlayFocus(d, r, page, new Map([['modal', modal]]), { previousModal: modal, previousFocus: modal.items[1] }); assert.equal(doc.activeElement, modal.items[1]);
    r = o.closeOverlay(d, r, 'modal');
    o.syncOverlayFocus(d, r, page, new Map(), { previousModal: modal, previousFocus: modal.items[1] }); assert.equal(page.inert, false); assert.equal(doc.activeElement, page.items[0]);
});
test('model uses explicit nonblocking modal policy and kind-only toast without blocking page actions', () => {
    for (const mutate of [d => { d.screens.find(s => s.id === 'modal').presentation.blocking = false; }, d => { const s = d.screens.find(s => s.id === 'modal'); s.kind = 'toast'; delete s.presentation; }]) {
        const d = fixture(); mutate(d); let r = activate(d, createRuntime(d), 'page', 'open');
        r = activate(d, r, 'page', 'page-action'); assert.equal(r.message, '시험 안내');
    }
});

test('replacing a nested overlay keeps the base, the lower dialog and the original opener', () => {
    const d = fixture();
    d.screens[2].elements.push(e('replace'));
    d.screens.push({id:'result',kind:'modal',name:'Result',presentation:presentation('modal'),elements:[e('result-close')]});
    d.transitions.push(
        {id:'replace',fromScreen:'nested',fromElement:'replace',event:'click',condition:'always',action:'open',targetScreen:'result',payload:{replaceOverlay:true}},
        {id:'result-close',fromScreen:'result',fromElement:'result-close',event:'click',condition:'always',action:'close'}
    );
    let r=activate(d,createRuntime(d),'page','open');
    r=activate(d,r,'modal','nested-open');
    r=activate(d,r,'nested','replace');
    assert.deepEqual(r.overlays,['modal','result']);
    assert.deepEqual(r.focusStack,['open','nested-open']);
    r=activate(d,r,'result','result-close');
    assert.deepEqual(r.overlays,['modal']);
    assert.equal(r.focusReturn,'nested-open');
});

test('backdrop lock leaves the dialog open and preserves explicit close', async () => {
    const d=fixture(), {closeOverlay}=await import('../../src/tools/uxStudio/overlay-runtime.mjs');
    d.screens[1].presentation.dismissOnBackdrop=false;
    const r=activate(d,createRuntime(d),'page','open');
    assert.deepEqual(closeOverlay(d,r,'modal',{reason:'backdrop'}).overlays,['modal']);
    assert.deepEqual(activate(d,r,'modal','close').overlays,[]);
});

test('a claim opens an overlay on the updated page, and commits a readonly sample value only on confirmation', async () => {
    const d=fixture(), {validateDocument,changeControl}=await import('../../src/tools/uxStudio/model.mjs');
    const after={id:'after',name:'After',kind:'page',elements:[{...e('saved'),kind:'panel',control:{type:'input',value:'비어 있음',readonly:true}}]};
    d.screens.push(after);
    d.transitions[0].payload={pageAfter:'after'};
    const close=d.transitions.find(t=>t.id==='close');
    close.payload={controlUpdates:{after:{saved:'저장됨'}}};
    validateDocument(d);
    const r=activate(d,createRuntime(d),'page','open');
    assert.equal(r.page,'after');
    assert.deepEqual(r.history,[]);
    assert.equal(r.controlValues.after.saved,'비어 있음');
    const locked=structuredClone(d);
    locked.screens[1].presentation.closePolicy='prevent';
    assert.equal(activate(locked,r,'modal','close').controlValues.after.saved,'비어 있음');
    const done=activate(d,r,'modal','close');
    assert.equal(done.controlValues.after.saved,'저장됨');
    assert.equal(changeControl(d,done,'after','saved','직접 입력').controlValues.after.saved,'저장됨');
});
