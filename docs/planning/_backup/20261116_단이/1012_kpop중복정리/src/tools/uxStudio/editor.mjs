import { clone, adjustRect, resolveRect } from './model.mjs';
import { resolveTransform, encodeTransform, transformStyles } from './rect-transform.mjs';
export function attachEditor({ canvas, host, screen, ids, width, height, snap, onSelect, onCommit, selectable = () => true }) {
    if (!window.Moveable || !window.Selecto)
        return () => {
        };
    const nodes = [...canvas.querySelectorAll('.ui-element')].filter(n => n.dataset.screen === screen.id && selectable(n.dataset.element));
    const targets = nodes.filter(n => ids.includes(n.dataset.element));
    let before, originals, start;
    const begin = e => {
        before = clone(screen.elements);
        originals = targets.map(n => clone(screen.elements.find(e => e.id === n.dataset.element)));
        start = {
            x: e.clientX, y: e.clientY
        };
    };
    const update = (e, resize) => {
        if (!start)
            return;
        const scale = Number(canvas.dataset.scale);
        targets.forEach((n, i) => {
            const original = originals[i], element = screen.elements.find(e => e.id === original.id), parent = element.parentId ? resolveRect(screen, element.parentId, width, height) : {
                w: width, h: height
            };
            const next = adjustRect(original, (e.clientX - start.x) / scale, (e.clientY - start.y) / scale, parent.w, parent.h, resize, snap ? 1 : 0);
            if (resize && element.appearance?.shape === 'circle') {
                if (next.rectTransform) {
                    const local = { x: 0, y: 0, w: parent.w, h: parent.h }, t = next.rectTransform;
                    const rect = resolveTransform(local, t);
                    next.rectTransform = encodeTransform(local, { ...rect, h: rect.w }, t.min, t.max, t.pivot);
                } else {
                    next.h = next.w * parent.w / parent.h;
                }
            }
            Object.assign(element, next);
            if (element.rectTransform) {
                Object.assign(n.style, transformStyles(element.rectTransform));
                return;
            }
            if (element.inset) {
                const [t, r, b, l] = element.inset;
                Object.assign(n.style, {
                    left: l + 'px', top: t + 'px', width: `calc(100% - ${l + r}px)`, height: `calc(100% - ${t + b}px)`
                });
                return;
            }
            for (const [key, css] of Object.entries({
                x: 'left', y: 'top', w: 'width', h: 'height'
            }))
                n.style[css] = element[key] + '%';
        });
    };
    const end = () => {
        if (before) {
            const changed = JSON.stringify(before) !== JSON.stringify(screen.elements);
            const old = before;
            before = null;
            start = null;
            if (changed)
                onCommit(old, true);
        }
    };
    const moveable = new window.Moveable(host, {
        target: targets.length === 1 ? targets[0] : targets, draggable: true, resizable: targets.length === 1, rotatable: false, origin: false, renderDirections: ['se'], snappable: false, preventClickEventOnDrag: true
    });
    moveable.on('dragStart', begin).on('drag', e => update(e, false)).on('dragEnd', end).on('resizeStart', begin).on('resize', e => update(e, true)).on('resizeEnd', end).on('dragGroupStart', begin).on('dragGroup', e => update(e, false)).on('dragGroupEnd', end);
    moveable.on('clickGroup', event => {
        const point = event.inputEvent;
        const node = event.targets[event.targetIndex] || document.elementsFromPoint(point.clientX, point.clientY).map(n => n.closest?.('.ui-element')).find(n => nodes.includes(n));
        if (node) {
            const id = node.dataset.element;
            onSelect(point.shiftKey ? (ids.includes(id) ? ids.filter(n => n !== id) : [...ids, id]) : [id]);
        }
    });
    const selecto = new window.Selecto({
        container: host, dragContainer: host, selectableTargets: nodes, hitRate: 10, selectByClick: false, selectFromInside: false, toggleContinueSelect: ['shift'], preventDefault: true, dragCondition: e => !e.inputEvent.target.closest('.ui-element,.moveable-control-box')
    });
    selecto.on('selectEnd', e => {
        if (!e.isDragStartEnd && !e.selected.length)
            return;
        const picked = e.selected.map(n => screen.elements.find(e => e.id === n.dataset.element)).filter(Boolean);
        const parent = picked[0]?.parentId || null;
        onSelect(picked.filter(e => (e.parentId || null) === parent).map(e => e.id));
    });
    const dispose = () => {
        moveable.destroy();
        selecto.destroy();
    };
    dispose.update = () => moveable.updateRect();
    return dispose;
}
