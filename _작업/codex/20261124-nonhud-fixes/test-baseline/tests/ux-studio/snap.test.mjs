import test from 'node:test';
import assert from 'node:assert/strict';
import { snapPanel, dockTarget } from '../../src/tools/uxStudio/snap.mjs';
test('floating panel snaps flush to dock outside edge and aligns top', () => {
    const r = snapPanel({
        x: 570, y: 105, w: 320, h: 500
    }, [{
            x: 900, y: 100, w: 400, h: 700
        }], 1440, 900);
    assert.equal(r.x + r.w, 900);
    assert.equal(r.y, 100);
    assert.equal(r.snapped, true);
});
test('distant panels do not jump and magnetic edges stay on viewport', () => {
    const a = {
        x: 300, y: 200, w: 320, h: 400
    }, t = [{
            x: 900, y: 100, w: 400, h: 700
        }];
    assert.deepEqual(snapPanel(a, t, 1440, 900), {
        ...a, snapped: false
    });
    const b = snapPanel({
        x: 9, y: 100, w: 320, h: 400
    }, [{
            x: 0, y: 100, w: 320, h: 400
        }], 1440, 900);
    assert.ok(b.x >= 8);
});
test('docking accepts nearby edge, rejects distant point and chooses nearest dock', () => {
    const zones = [{
            side: 'left', rect: {
                x: 40, y: 80, w: 220, h: 700
            }
        }, {
            side: 'right', rect: {
                x: 1000, y: 80, w: 400, h: 700
            }
        }];
    assert.equal(dockTarget(980, 100, zones).side, 'right');
    assert.equal(dockTarget(800, 100, zones), null);
    assert.equal(dockTarget(250, 100, zones).side, 'left');
});
