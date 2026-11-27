import test from 'node:test';
import assert from 'node:assert/strict';
import { renderLayout } from '../../src/tools/uxStudio/layout-view.mjs';
import { createControl } from '../../src/tools/uxStudio/controls.mjs';

// Renderer fixture only; CSS painting remains part of the parent's browser acceptance.
class Node extends EventTarget {
    constructor(tag, doc) {
        super(); this.tagName = tag.toUpperCase(); this.ownerDocument = doc; this.children = []; this.dataset = {}; this.style = {}; this.attributes = {}; this.className = '';
        this.classList = { contains: name => this.className.split(' ').includes(name), add: name => { this.className += ' ' + name; }, toggle: (name, on) => { this.className = this.className.split(' ').filter(s => s !== name).concat(on ? [name] : []).join(' '); } };
    }
    append(...nodes) { for (const n of nodes) { n.parentNode = this; this.children.push(n); } }
    prepend(n) { n.parentNode = this; this.children.unshift(n); }
    remove() { if (this.parentNode) this.parentNode.children = this.parentNode.children.filter(n => n !== this); this.parentNode = null; }
    setAttribute(k, v) { this.attributes[k] = String(v); if (k === 'class') this.className = String(v); }
    getAttribute(k) { return this.attributes[k] ?? null; }
    removeAttribute(k) { delete this.attributes[k]; }
    get lastElementChild() { return this.children.at(-1); }
    closest(selector) { return selector === 'button' && this.tagName === 'BUTTON' ? this : this.parentNode?.closest(selector) || null; }
    querySelectorAll(selector) {
        const direct = selector.startsWith(':scope > '), simple = direct ? selector.slice(9) : selector;
        const matches = n => simple.startsWith('.') ? n.classList.contains(simple.slice(1)) : n.tagName.toLowerCase() === simple;
        return this.children.flatMap(n => [...(matches(n) ? [n] : []), ...(direct ? [] : n.querySelectorAll(selector))]);
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    contains(n) { return n === this || this.children.some(child => child.contains(n)); }
}
function fixture(t) {
    const previous = globalThis.document;
    const doc = { createElement: tag => new Node(tag, doc), createElementNS: (_ns, tag) => new Node(tag, doc) };
    globalThis.document = doc;
    t.after(() => { if (previous === undefined) delete globalThis.document; else globalThis.document = previous; });
    return doc.createElement('section');
}
const element = (id, type, variant = type) => ({ id, name: id, kind: 'panel', x: 0, y: 0, w: 50, h: 10, text: 'Label', appearance: { shape: 'capsule', fill: '#eeeeee', stroke: '#123456', textColor: '#243549', variant }, control: createControl(type) });

test('native controls suppress static control adornments and restore them when control config is removed', t => {
    const root = fixture(t), screen = { id: 'main', elements: [['toggle', 'toggle'], ['slider', 'slider'], ['tabs', 'tabs'], ['slider', 'progress']].map(([type, variant]) => element(variant, type, variant)) };
    renderLayout(screen, root);
    const nodes = [...root.children], surfaces = nodes.map(node => node.querySelector(':scope > .unit-surface'));
    for (const [index, node] of nodes.entries()) {
        assert.equal(node.classList.contains('variant-' + screen.elements[index].appearance.variant), false);
        assert.ok(node.querySelector(':scope > .ui-control'));
        assert.ok(surfaces[index]);
        assert.equal(surfaces[index].lastElementChild.getAttribute('stroke'), '#123456');
    }
    for (const e of screen.elements) delete e.control;
    renderLayout(screen, root);
    for (const [index, node] of nodes.entries()) {
        assert.equal(root.children[index], node);
        assert.equal(node.classList.contains('variant-' + screen.elements[index].appearance.variant), true);
        assert.equal(node.querySelector(':scope > .ui-control'), null);
        assert.equal(node.querySelector(':scope > .unit-surface'), surfaces[index]);
        assert.equal(node.querySelector(':scope > .element-text').hidden, false);
    }
});
test('native control rendering preserves an explicit frame and noncontrol progress decoration', t => {
    const root = fixture(t), frame = { ...element('frame', 'slider'), partRole: 'frame' }, progress = element('progress', 'slider', 'progress');
    delete progress.control;
    renderLayout({ id: 'main', elements: [frame, progress] }, root);
    assert.equal(root.children[0].querySelector(':scope > .unit-surface').lastElementChild.getAttribute('fill'), 'none');
    assert.equal(root.children[1].classList.contains('variant-progress'), true);
});
