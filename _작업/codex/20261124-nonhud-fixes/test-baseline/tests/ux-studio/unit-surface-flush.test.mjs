import test from 'node:test';
import assert from 'node:assert/strict';
import { unitSurface } from '../../src/tools/uxStudio/layout-view.mjs';

// The rectangle outline must sit on the part's own edge, not a %-of-size inset.
class El { constructor(t){this.tag=t;this.attrs={};this.children=[];this.style={};} setAttribute(k,v){this.attrs[k]=String(v);} append(n){this.children.push(n);} }
globalThis.document ??= { createElementNS: (_ns, t) => new El(t) };
const rectOf = a => unitSurface(a).children[0];

test('rectangle surfaces span the full viewBox so the edge is flush for any size', () => {
    for (const shape of ['rectangle', 'rounded', 'capsule', undefined]) {
        const r = rectOf({ shape });
        assert.equal(r.tag, 'rect');
        assert.deepEqual([r.attrs.x, r.attrs.y, r.attrs.width, r.attrs.height], ['0', '0', '100', '100']);
        assert.equal(r.attrs['vector-effect'], 'non-scaling-stroke');
    }
});
test('stroke is doubled so the clipped inner half keeps the authored px width', () => {
    assert.equal(rectOf({ shape: 'rectangle' }).attrs['stroke-width'], '3');
    assert.equal(rectOf({ shape: 'rectangle', strokeWidth: 2 }).attrs['stroke-width'], '4');
    assert.equal(rectOf({ shape: 'rectangle', strokeWidth: 0 }).attrs['stroke-width'], '0');
    assert.equal(unitSurface({ shape: 'rectangle' }).style.overflow, 'hidden', 'outer half of the stroke is clipped at the part edge');
    assert.notEqual(unitSurface({ shape: 'hexagon' }).style.overflow, 'hidden');
});
test('non-rectangle shapes keep their geometry', () => {
    assert.equal(rectOf({ shape: 'hexagon' }).attrs.points, '25,2 75,2 98,50 75,98 25,98 2,50');
    assert.equal(rectOf({ shape: 'hexagon' }).attrs['stroke-width'], '1.5');
});
