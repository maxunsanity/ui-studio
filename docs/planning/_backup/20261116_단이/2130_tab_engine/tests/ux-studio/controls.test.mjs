import test from 'node:test';
import assert from 'node:assert/strict';
import { createUnit } from '../../src/tools/uxStudio/units.mjs';
import * as model from '../../src/tools/uxStudio/model.mjs';
import * as controls from '../../src/tools/uxStudio/controls.mjs';

const element = (id, control) => ({ id, kind: 'panel', name: id, x: 0, y: 0, w: 30, h: 10, text: '', ...(control ? { control } : {}) });
function design(elements = []) {
    return { schemaVersion: 3, projectId: 'control-test', revision: 0, name: 'Controls', entryScreen: 'page', screens: [{ id: 'page', name: 'Page', kind: 'page', elements }], transitions: [], fixtures: { balance: 0, items: [] } };
}
const options = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C', disabled: true }];

test('save rejects malformed typed control config instead of persisting unknown input behavior', () => {
    for (const control of [null, [], {}, { type: 'eval' }, { type: 'toggle', value: 'true' }, { type: 'input', value: null }, { type: 'input', required: 1 }, { type: 'input', readonly: 'yes' }, { type: 'input', validation: 'script' }, { type: 'input', maxLength: -1 }, { type: 'input', maxLength: 2, value: 'abc' }, { type: 'toggle', unknown: 'field' }]) {
        const e = element('field'); e.control = control;
        assert.throws(() => model.validateDocument(design([e])), /컨트롤|입력/);
    }
});
test('numeric control config rejects inverted ranges, invalid steps and off-grid defaults', () => {
    for (const control of [{ type: 'slider', min: 10, max: 1 }, { type: 'slider', min: 0, max: 10, step: 0 }, { type: 'slider', min: 0, max: 10, value: 11 }, { type: 'scrollbar', min: 0, max: 10, step: 2, defaultValue: 3 }, { type: 'slider', step: Infinity }])
        assert.throws(() => model.validateDocument(design([element('range', control)])), /컨트롤/);
});
test('option controls reject empty or duplicate options and unknown selected values', () => {
    for (const control of [{ type: 'dropdown', options: [] }, { type: 'tabs', options: [{ value: 'x', label: 'X' }, { value: 'x', label: 'Again' }] }, { type: 'toggle-group', options, value: 'absent' }, { type: 'dropdown', options: ['a'] }])
        assert.throws(() => model.validateDocument(design([element('choice', control)])), /컨트롤/);
});
test('exclusive toggles reject ambiguous initial state but screen groups stay independent', () => {
    const d = design([element('one', { type: 'toggle', group: 'mode', value: true }), element('two', { type: 'toggle', group: 'mode', defaultValue: true })]);
    assert.throws(() => model.validateDocument(d), /그룹/);
    d.screens[0].elements[1].control.value = false;
    d.screens.push({ id: 'other', name: 'Other', kind: 'page', elements: [element('three', { type: 'toggle', group: 'mode', value: true })] });
    model.validateDocument(d);
});
test('input presets create independent executable configs and legacy documents remain unchanged', () => {
    for (const [unit, type] of [['input', 'input'], ['search', 'input'], ['checkbox', 'toggle'], ['radio', 'toggle'], ['toggle', 'toggle'], ['dropdown', 'dropdown'], ['slider', 'slider'], ['scrollbar', 'scrollbar'], ['tabs', 'tabs'], ['toggle-group', 'toggle-group']]) {
        const a = createUnit(unit, 'first'), b = createUnit(unit, 'second');
        assert.equal(a.control?.type, type);
        a.control.value = type === 'toggle' ? true : 'changed';
        assert.notEqual(a.control.value, b.control.value);
    }
    for (const schemaVersion of [1, 2, 3]) {
        const d = design([element('legacy')]); d.schemaVersion = schemaVersion;
        const before = JSON.stringify(d);
        model.validateDocument(d); model.createRuntime(d);
        assert.equal(JSON.stringify(d), before);
    }
});

test('runtime separates typed values from defaults and exclusive changes stay inside their screen', () => {
    const d = design([element('one', { type: 'toggle', group: 'mode', defaultValue: true }), element('two', { type: 'toggle', group: 'mode' }), element('range', { type: 'slider', min: -1, max: 1, step: .25, defaultValue: .5 })]);
    d.screens.push({ id: 'other', name: 'Other', kind: 'page', elements: [element('other-toggle', { type: 'toggle', group: 'mode', value: true })] });
    const before = structuredClone(d), r = model.createRuntime(d);
    assert.equal(r.controlValues?.page?.range, .5);
    const next = model.changeControl(d, r, 'page', 'two', true);
    assert.deepEqual(next.controlValues.page, { one: false, two: true, range: .5 });
    assert.equal(next.controlValues.other['other-toggle'], true);
    assert.equal(r.controlValues.page.one, true);
    assert.deepEqual(d, before);
});
test('typed change notifies host with previous value, validation result and replayable event', () => {
    const d = design([element('email', { type: 'input', required: true, validation: 'email' })]);
    let r = model.changeControl(d, model.createRuntime(d), 'page', 'email', 'bad', { event: 'input' });
    assert.deepEqual(r.lastAction, { type: 'control-change', screen: 'page', element: 'email', controlType: 'input', value: 'bad', previousValue: '', event: 'input', valid: false, message: '이메일 형식을 확인하세요.' });
    assert.equal(r.controlValidity.page.email.valid, false);
    r = model.changeControl(d, r, 'page', 'email', 'a@example.com', { event: 'change' });
    assert.equal(r.lastAction.valid, true);
    const replay = model.replayScenario(d, { projectId: d.projectId, revision: d.revision, result: r });
    assert.equal(replay.controlValues.page.email, 'a@example.com');
    assert.equal(replay.controlValidity.page.email.valid, true);
    assert.equal(r.events.length, 2);
});
test('disabled, readonly, inactive screens, pending and collapsed controls reject injected changes', () => {
    for (const extra of [{ control: { type: 'toggle', disabled: true } }, { control: { type: 'toggle', readonly: true } }, { interaction: { mode: 'action', enabled: false, shape: 'rectangle', reason: '' } }, { interaction: { mode: 'none', enabled: true, shape: 'rectangle', reason: '' } }]) {
        const e = { ...element('blocked', { type: 'toggle' }), ...extra }, d = design([e]), r = model.changeControl(d, model.createRuntime(d), 'page', e.id, true);
        assert.equal(r.controlValues.page.blocked, false);
        assert.equal(r.lastAction, null);
        assert.equal(r.events.length, 0);
    }
    const d = design([element('field', { type: 'toggle' })]);
    d.screens.push({ id: 'modal', name: 'Modal', kind: 'modal', elements: [] });
    for (const patch of [{ pending: true }, { overlays: ['modal'] }, { page: 'other' }]) {
        const r = model.changeControl(d, { ...model.createRuntime(d), ...patch }, 'page', 'field', true);
        assert.equal(r.controlValues.page.field, false);
        assert.equal(r.lastAction, null);
    }
    const menu = { ...element('menu'), menu: { defaultOpen: false, headerHeight: 30 } };
    d.screens[0].elements.push(menu); d.screens[0].elements[0].parentId = 'menu';
    assert.equal(model.changeControl(d, model.createRuntime(d), 'page', 'field', true).controlValues.page.field, false);
});
test('runtime rejects wrong value types, disabled options and out-of-step changes', () => {
    for (const [control, bad] of [[{ type: 'toggle' }, 'true'], [{ type: 'input', maxLength: 2 }, 'long'], [{ type: 'slider', min: 0, max: 10, step: 2 }, 3], [{ type: 'dropdown', options }, 'c'], [{ type: 'tabs', options }, 'missing']]) {
        const d = design([element('field', control)]);
        assert.throws(() => model.changeControl(d, model.createRuntime(d), 'page', 'field', bad), /컨트롤/);
    }
});
test('empty required text retains an invalid value and group runtime keys cannot alter prototypes', () => {
    const d = design([element('__proto__', { type: 'input', required: true, defaultValue: 'before' }), element('toggle', { type: 'toggle', group: '__proto__' })]);
    const r = model.changeControl(d, model.createRuntime(d), 'page', '__proto__', '');
    assert.equal(r.controlValues.page.__proto__, '');
    assert.equal(r.controlValidity.page.__proto__.valid, false);
    assert.equal(Object.getPrototypeOf(r.controlValues.page), Object.prototype);
    assert.equal({}.valid, undefined);
});

// No browser package: this fixture supplies only DOM primitives used by the attachment helper.
class TestNode extends EventTarget {
    constructor(tag, doc) { super(); this.tagName = tag.toUpperCase(); this.ownerDocument = doc; this.children = []; this.dataset = {}; this.style = {}; this.attributes = {}; this.className = ''; this.value = ''; this.hidden = false; this.disabled = false; this.tabIndex = 0; }
    append(...nodes) { for (const node of nodes) { node.parentNode = this; this.children.push(node); } }
    remove() { if (this.parentNode) this.parentNode.children.splice(this.parentNode.children.indexOf(this), 1); this.parentNode = null; }
    setAttribute(key, value) { this.attributes[key] = String(value); }
    removeAttribute(key) { delete this.attributes[key]; }
    getAttribute(key) { return this.attributes[key] ?? null; }
    contains(node) { return node === this || this.children.some(n => n.contains(node)); }
    closest(selector) { if (selector === 'button' && this.tagName === 'BUTTON' || selector === '[inert]' && this.inert) return this; return this.parentNode?.closest(selector) || null; }
    querySelectorAll(selector) {
        const match = n => selector === '.ui-element' ? n.className.split(' ').includes('ui-element') : selector.startsWith(':scope > .') ? n.className.split(' ').includes(selector.slice(10)) : n.tagName.toLowerCase() === selector;
        const direct = this.children.filter(match);
        return selector.startsWith(':scope') ? direct : this.children.flatMap(n => [...(match(n) ? [n] : []), ...n.querySelectorAll(selector)]);
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    focus() { this.ownerDocument.activeElement = this; }
    setCustomValidity(message) { this.validationMessage = message; }
}
function dom(screen) {
    const doc = { createElement: tag => new TestNode(tag, doc), activeElement: null }, root = doc.createElement('section');
    for (const e of screen.elements) {
        const node = doc.createElement('div'); node.className = 'ui-element'; node.dataset = { screen: screen.id, element: e.id };
        const text = doc.createElement('span'); text.className = 'element-text'; node.append(text); root.append(node);
    }
    return root;
}
test('attachment uses native input values, emits real changes and preserves text node identity/caret', () => {
    const d = design([element('text', { type: 'input', value: 'start', maxLength: 20, required: true })]), screen = d.screens[0], root = dom(screen), events = [];
    let runtime = model.createRuntime(d);
    const settings = { onChange: change => { events.push(change); runtime = model.changeControl(d, runtime, change.screen, change.element, change.value, { event: change.event }); return runtime; } };
    controls.attachControls(root, screen, runtime, settings);
    const field = root.querySelector('input');
    assert.equal(field.value, 'start'); assert.equal(field.maxLength, 20); assert.equal(field.required, true);
    field.value = 'typed'; field.selectionStart = 2; field.selectionEnd = 4; field.focus();
    field.dispatchEvent(new Event('input'));
    controls.attachControls(root, screen, runtime, settings);
    assert.equal(root.querySelector('input'), field);
    assert.equal(field.value, 'typed'); assert.equal(field.selectionStart, 2); assert.equal(field.selectionEnd, 4);
    assert.equal(events[0].previousValue, 'start'); assert.equal(events[0].value, 'typed'); assert.equal(events[0].event, 'input');
    assert.equal(d.screens[0].elements[0].control.value, 'start');
});
test('native exclusive options reflect group state and tabs support keyboard selection', () => {
    const d = design([element('tabs', { type: 'tabs', options, value: 'a' }), element('one', { type: 'toggle', group: 'g', value: true }), element('two', { type: 'toggle', group: 'g' })]), s = d.screens[0], root = dom(s);
    controls.attachControls(root, s, model.createRuntime(d));
    const buttons = root.querySelectorAll('button');
    assert.equal(buttons[0].getAttribute('aria-selected'), 'true');
    buttons[0].dispatchEvent(Object.assign(new Event('keydown', { cancelable: true }), { key: 'ArrowRight' }));
    assert.equal(buttons[1].getAttribute('aria-selected'), 'true'); assert.equal(buttons[0].getAttribute('aria-selected'), 'false');
    assert.equal(root.ownerDocument.activeElement, buttons[1]); assert.equal(buttons[2].disabled, true);
    const radios = root.querySelectorAll('input');
    assert.equal(radios[0].type, 'radio'); assert.equal(radios[0].name, radios[1].name);
    radios[1].checked = true; radios[1].dispatchEvent(new Event('change'));
    assert.equal(radios[0].checked, false); assert.equal(radios[1].checked, true);
});
test('native readonly/edit fields and disabled choices ignore synthetic value changes', () => {
    for (const mode of ['view', 'edit']) {
        const d = design([element('input', { type: 'input', value: 'kept', readonly: mode === 'view' }), element('choice', { type: 'dropdown', options, value: 'a', disabled: true })]), s = d.screens[0], root = dom(s), changes = [];
        controls.attachControls(root, s, model.createRuntime(d), { mode, onChange: c => changes.push(c) });
        const input = root.querySelector('input'), select = root.querySelector('select');
        assert.equal(input.readOnly, mode === 'view'); assert.equal(input.disabled, mode === 'edit'); assert.equal(select.disabled, true);
        input.value = 'injected'; input.dispatchEvent(new Event('input'));
        select.value = 'b'; select.dispatchEvent(new Event('change'));
        assert.equal(changes.length, 0); assert.equal(input.value, 'kept'); assert.equal(select.value, 'a');
    }
});
test('native ranges and dropdown use typed values and input hotkeys stop before editor listeners', () => {
    const d = design([element('slider', { type: 'scrollbar', min: 2, max: 10, step: 2, value: 4, orientation: 'vertical' }), element('choice', { type: 'dropdown', options, value: 'b' })]), s = d.screens[0], root = dom(s), changes = [];
    controls.attachControls(root, s, model.createRuntime(d), { onChange: c => changes.push(c) });
    const field = root.querySelector('input'), select = root.querySelector('select');
    assert.equal(field.type, 'range'); assert.equal(field.min, '2'); assert.equal(field.max, '10'); assert.equal(field.step, '2'); assert.equal(field.getAttribute('aria-orientation'), 'vertical');
    field.value = '8'; field.dispatchEvent(new Event('change')); assert.equal(changes[0].value, 8); assert.equal(field.value, '8');
    assert.equal(select.value, 'b'); assert.equal(select.children[2].disabled, true);
    const key = Object.assign(new Event('keydown', { cancelable: true }), { key: 'Delete' });
    field.dispatchEvent(key); assert.equal(key.cancelBubble, true); assert.equal(key.defaultPrevented, false);
});
test('removed native fields cannot dispatch stale changes after a screen is replaced', () => {
    const d = design([element('text', { type: 'input' })]), root = dom(d.screens[0]), changes = [];
    controls.attachControls(root, d.screens[0], model.createRuntime(d), { onChange: c => changes.push(c) });
    const field = root.querySelector('input');
    root.children[0].remove(); field.value = 'stale'; field.dispatchEvent(new Event('input'));
    assert.equal(changes.length, 0);
});
test('group changes safely deselect newly introduced elements with special property names', () => {
    const d = design([element('__proto__', { type: 'toggle', group: 'g', value: true }), element('two', { type: 'toggle', group: 'g' })]);
    const r = model.createRuntime(d); r.controlValues.page = {};
    const next = model.changeControl(d, r, 'page', 'two', true);
    assert.equal(controls.controlValue(d.screens[0], d.screens[0].elements[0], next), false);
    assert.equal(Object.hasOwn(next.controlValues.page, '__proto__'), true);
});
test('attaching controls preserves noncontrol menu and content-slot visibility', () => {
    const d = design([element('legacy')]), root = dom(d.screens[0]), text = root.querySelector(':scope > .element-text') || root.children[0].children[0];
    text.hidden = true;
    controls.attachControls(root, d.screens[0], model.createRuntime(d));
    assert.equal(text.hidden, true);
});
