/** Nearby floating and dock edges are magnetic; distant panels never jump. */
export function snapPanel(rect, targets, width, height, threshold = 14) {
    let x = rect.x, y = rect.y, bestX = threshold + 1, bestY = threshold + 1;
    for (const t of targets) {
        if (rect.y <= t.y + t.h && rect.y + rect.h >= t.y)
            for (const v of [t.x - rect.w, t.x + t.w, t.x, t.x + t.w - rect.w]) {
                const distance = Math.abs(v - rect.x);
                if (distance <= threshold && distance < bestX && v >= 8 && v + rect.w <= width - 8) {
                    x = v;
                    bestX = distance;
                }
            }
        if (x <= t.x + t.w && x + rect.w >= t.x)
            for (const v of [t.y - rect.h, t.y + t.h, t.y, t.y + t.h - rect.h]) {
                const distance = Math.abs(v - rect.y);
                if (distance <= threshold && distance < bestY && v >= 8 && v + rect.h <= height - 8) {
                    y = v;
                    bestY = distance;
                }
            }
    }
    return {
        ...rect, x, y, snapped: bestX <= threshold || bestY <= threshold
    };
}
export function dockTarget(x, y, zones, threshold = 24) {
    let best = null, distance = Infinity;
    for (const z of zones) {
        const r = z.rect, dx = Math.max(r.x - x, 0, x - r.x - r.w), dy = Math.max(r.y - y, 0, y - r.y - r.h), d = Math.hypot(dx, dy);
        if (d <= threshold && d < distance) {
            best = z;
            distance = d;
        }
    }
    return best;
}
