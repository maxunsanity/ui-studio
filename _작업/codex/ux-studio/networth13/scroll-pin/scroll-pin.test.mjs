import test from 'node:test';
import assert from 'node:assert/strict';

const pin = await import('./scroll-pin.mjs').catch(() => ({}));

test('optional scroll pin rejects malformed saved values without changing an absent property', () => {
    assert.equal(typeof pin.validateScrollPin, 'function');
    assert.equal(pin.validateScrollPin(undefined), undefined);
    const value = {top: 219};
    assert.equal(pin.validateScrollPin(value), value);
    assert.doesNotThrow(() => pin.validateScrollPin({top: 0}));
    for (const value of [null, false, [], {}, {top: '219'}, {top: -1}, {top: 10001}, {top: NaN}, {top: Infinity}, {top: 2, left: 0}]) {
        assert.throws(() => pin.validateScrollPin(value));
    }
});

test('vertical pin follows natural content until its threshold and restores on reverse scroll', () => {
    assert.equal(typeof pin.scrollPinOffset, 'function');
    const geometry = {top: 219, naturalTop: 671, height: 90, parentBottom: 1700};
    for (const [scrollTop, want] of [[0, 0], [200, 0], [452, 0], [500, 48], [800, 348], [200, 0], [-20, 0]]) {
        assert.equal(pin.scrollPinOffset({...geometry, scrollTop}), want);
    }
});

test('parent end wins over the pin threshold and an undersized parent never pushes content upward', () => {
    assert.equal(typeof pin.scrollPinOffset, 'function');
    assert.equal(pin.scrollPinOffset({top: 219, naturalTop: 671, height: 90, parentBottom: 1000, scrollTop: 900}), 239);
    assert.equal(pin.scrollPinOffset({top: 219, naturalTop: 671, height: 90, parentBottom: 700, scrollTop: 900}), 0);
    assert.throws(() => pin.scrollPinOffset({top: 0, naturalTop: NaN, height: 90, parentBottom: 1000, scrollTop: 0}));
});

// A DOM boundary double: layout coordinates stay logical under CSS transforms, as in the tool.
class LayoutNode extends EventTarget {
    constructor(id, {top = 0, height = 100, overflowY = 'visible', overflowX = 'visible', screen = 'screen'} = {}) {
        super();
        this.dataset = {element: id, screen};
        this.style = {top: top + 'px', height: height + 'px', translate: '', transform: ''};
        this.children = [];
        this.scrollTop = this.scrollLeft = this.clientTop = 0;
        this.clientHeight = this.scrollHeight = height;
        this.overflowY = overflowY;
        this.overflowX = overflowX;
    }
    append(child) {
        child.parentElement = child.offsetParent = this;
        child.ownerDocument = this.ownerDocument;
        this.children.push(child);
        return child;
    }
    get offsetTop() { return numericTop(this.style.top); }
    get offsetHeight() { return Number.parseFloat(this.style.height); }
    querySelectorAll() { return this.children.flatMap(child => [child, ...child.querySelectorAll()]); }
    contains(node) { return node === this || this.querySelectorAll().includes(node); }
}
function numericTop(value) {
    if (!value.startsWith('calc(')) return Number.parseFloat(value);
    const values = [...value.matchAll(/-?\d+(?:\.\d+)?/g)].map(match => Number(match[0]));
    return values.reduce((total, item) => total + item, 0);
}
function fixture({nested = false, horizontal = false} = {}) {
    const view = new EventTarget();
    const observers = [];
    view.getComputedStyle = node => ({top: numericTop(node.style.top) + 'px', height: node.style.height, boxSizing: 'border-box', overflowY: node.overflowY, overflowX: node.overflowX});
    view.ResizeObserver = class {
        constructor(callback) { this.callback = callback; this.nodes = []; observers.push(this); }
        observe(node) { this.nodes.push(node); }
        disconnect() { this.nodes = []; }
    };
    const root = new LayoutNode('root', {height: 984});
    root.ownerDocument = {defaultView: view};
    const outer = root.append(new LayoutNode('outer', {top: 100, height: 600, overflowY: 'auto'}));
    outer.scrollHeight = 2200;
    const scrollport = nested ? outer.append(new LayoutNode('inner', {top: 80, height: 500, overflowY: 'auto'})) : outer;
    scrollport.scrollHeight = 1800;
    const parent = scrollport.append(new LayoutNode('content', {height: 1700}));
    const horizontalPort = horizontal ? parent.append(new LayoutNode('horizontal', {top: 10, height: 1200, overflowX: 'auto', overflowY: 'hidden'})) : parent;
    const node = horizontalPort.append(new LayoutNode('card', {top: horizontal ? 661 : 671, height: 90}));
    const screen = {id: 'screen', elements: [{id: 'card', scrollPin: {top: 219}}]};
    return {root, outer, scrollport, parent, horizontalPort, node, screen, view, observers};
}

test('scope changes only top, keeps press translation, and reapplies after the renderer resets styles', () => {
    assert.equal(typeof pin.attachScrollPins, 'function');
    const f = fixture();
    f.node.style.translate = '0 3px';
    f.node.style.transform = 'scale(1)';
    pin.attachScrollPins(f.root, f.screen);
    f.scrollport.scrollTop = 500;
    f.scrollport.dispatchEvent(new Event('scroll'));
    assert.equal(f.node.offsetTop, 719);
    assert.equal(f.node.style.translate, '0 3px');
    assert.equal(f.node.style.transform, 'scale(1)');
    f.node.style.top = '671px';
    pin.attachScrollPins(f.root, f.screen);
    assert.equal(f.node.offsetTop, 719);
    f.scrollport.scrollTop = 100;
    f.scrollport.dispatchEvent(new Event('scroll'));
    assert.equal(f.node.style.top, '671px');
    pin.disposeScrollPins(f.root);
});

test('nearest vertical port owns nested scrolling and horizontal scroll does not change the vertical result', () => {
    assert.equal(typeof pin.attachScrollPins, 'function');
    const f = fixture({nested: true, horizontal: true});
    pin.attachScrollPins(f.root, f.screen);
    f.scrollport.scrollTop = 500;
    f.scrollport.dispatchEvent(new Event('scroll'));
    assert.equal(f.node.offsetTop, 709);
    f.outer.scrollTop = 300;
    f.outer.dispatchEvent(new Event('scroll'));
    f.horizontalPort.scrollLeft = 250;
    f.horizontalPort.dispatchEvent(new Event('scroll'));
    assert.equal(f.node.offsetTop, 709);
    pin.disposeScrollPins(f.root);
});

test('logical pin coordinates are stable at device scale and recompute on resize', () => {
    assert.equal(typeof pin.attachScrollPins, 'function');
    const f = fixture();
    f.root.style.transform = 'scale(0.5)';
    f.node.style.top = '671.25px';
    pin.attachScrollPins(f.root, f.screen);
    f.scrollport.scrollTop = 500.5;
    f.scrollport.dispatchEvent(new Event('scroll'));
    assert.equal(f.node.offsetTop, 719.5);
    f.root.style.transform = 'scale(1.25)';
    f.view.dispatchEvent(new Event('resize'));
    assert.equal(f.node.offsetTop, 719.5);
    f.parent.clientHeight = 750;
    for (const observer of f.observers) observer.callback();
    assert.equal(f.node.offsetTop, 671.25);
    pin.disposeScrollPins(f.root);
});

test('direct child of a scrollport uses its full content end rather than its viewport height', () => {
    assert.equal(typeof pin.attachScrollPins, 'function');
    const f = fixture();
    f.parent.children = [];
    f.scrollport.append(f.node);
    pin.attachScrollPins(f.root, f.screen);
    f.scrollport.scrollTop = 1200;
    f.scrollport.dispatchEvent(new Event('scroll'));
    assert.equal(f.node.offsetTop, 1419);
    pin.disposeScrollPins(f.root);
});

test('missing pin metadata is inert and removing a pin restores authored top', () => {
    assert.equal(typeof pin.attachScrollPins, 'function');
    const f = fixture();
    pin.attachScrollPins(f.root, {id: 'screen', elements: [{id: 'card'}]});
    assert.equal(f.observers.length, 0);
    assert.equal(f.node.style.top, '671px');
    pin.attachScrollPins(f.root, f.screen);
    f.scrollport.scrollTop = 500;
    f.scrollport.dispatchEvent(new Event('scroll'));
    pin.attachScrollPins(f.root, {id: 'screen', elements: [{id: 'card'}]});
    assert.equal(f.node.style.top, '671px');
    f.scrollport.scrollTop = 800;
    f.scrollport.dispatchEvent(new Event('scroll'));
    assert.equal(f.node.style.top, '671px');
});

test('disposing a removed screen detaches events and observers without overwriting a later render', () => {
    assert.equal(typeof pin.disposeScrollPins, 'function');
    const f = fixture();
    pin.attachScrollPins(f.root, f.screen);
    f.scrollport.scrollTop = 500;
    f.scrollport.dispatchEvent(new Event('scroll'));
    f.node.style.top = '700px';
    pin.disposeScrollPins(f.root);
    f.scrollport.scrollTop = 800;
    f.scrollport.dispatchEvent(new Event('scroll'));
    f.view.dispatchEvent(new Event('resize'));
    assert.equal(f.node.style.top, '700px');
    assert.ok(f.observers.every(observer => observer.nodes.length === 0));
    pin.disposeScrollPins(f.root);
});
