const scopes = new WeakMap();
const inlineTop = value => typeof value === 'string' && /^(?:-?(?:\d+(?:\.\d*)?|\.\d+)(?:px|%)|calc\(.+\))$/.test(value.trim());

export function validateScrollPin(value) {
    if (value === undefined) return value;
    if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length !== 1 || !Object.hasOwn(value, 'top') || !Number.isFinite(value.top) || value.top < 0 || value.top > 10000) {
        throw Error('세로 스크롤 고정은 0~10000 논리 px의 top 값 하나가 필요합니다.');
    }
    return value;
}

/** All positions are unscaled CSS layout pixels in the nearest vertical scrollport's content. */
export function scrollPinOffset({top, naturalTop, height, parentBottom, scrollTop}) {
    validateScrollPin({top});
    if (![naturalTop, height, parentBottom, scrollTop].every(Number.isFinite) || height < 0) throw Error('스크롤 고정 배치 수치가 올바르지 않습니다.');
    return Math.max(0, Math.min(Math.max(0, scrollTop) + top - naturalTop, parentBottom - height - naturalTop));
}

export function disposeScrollPins(root) {
    scopes.get(root)?.();
    scopes.delete(root);
}

/** Call after authoritative layout styles are painted; dispose before removing the screen root. */
export function attachScrollPins(root, screen) {
    disposeScrollPins(root);
    const elements = screen.elements.filter(element => element.scrollPin !== undefined);
    if (!elements.length || root.isConnected === false) return;
    const view = root.ownerDocument?.defaultView;
    if (!view?.getComputedStyle) return;
    const nodes = new Map([...root.querySelectorAll('.ui-element')].filter(node => node.dataset.screen === screen.id).map(node => [node.dataset.element, node]));
    const records = [];
    for (const element of elements) {
        validateScrollPin(element.scrollPin);
        const node = nodes.get(element.id);
        if (!node || !inlineTop(node.style.top)) continue;
        let scrollport = node.parentElement;
        while (scrollport && root.contains(scrollport) && !['auto', 'scroll'].includes(view.getComputedStyle(scrollport).overflowY)) {
            if (scrollport === root) { scrollport = null; break; }
            scrollport = scrollport.parentElement;
        }
        if (!scrollport || !root.contains(scrollport)) continue;
        records.push({node, scrollport, parent: node.parentElement, top: element.scrollPin.top, baseTop: node.style.top, written: node.style.top, offset: 0});
    }
    if (!records.length) return;

    // Reading layout offsets ignores scale/press transforms and retains fractional resolved top values.
    const layoutTop = (node, ancestor) => {
        let total = 0;
        while (node && node !== ancestor) {
            const parent = node.offsetParent;
            if (!parent) return null;
            const top = Number.parseFloat(view.getComputedStyle(node).top);
            total += Number.isFinite(top) ? top : node.offsetTop;
            if (parent !== ancestor) total += parent.clientTop - parent.scrollTop;
            node = parent;
        }
        return node === ancestor ? total : null;
    };
    let disposed = false;
    const refresh = () => {
        if (disposed) return;
        for (const record of records) {
            const {node, scrollport, parent, top} = record;
            if (!root.contains(node)) continue;
            if (node.style.top !== record.written) { record.baseTop = node.style.top; record.offset = 0; }
            if (!inlineTop(record.baseTop)) { record.written = node.style.top; continue; }
            const currentTop = layoutTop(node, scrollport), parentTop = layoutTop(parent, scrollport);
            if (currentTop === null || parentTop === null) continue;
            const computed = view.getComputedStyle(node), resolvedHeight = Number.parseFloat(computed.height);
            const height = computed.boxSizing === 'border-box' && Number.isFinite(resolvedHeight) ? resolvedHeight : node.offsetHeight;
            const parentBottom = parent === scrollport ? scrollport.scrollHeight : parentTop + parent.clientTop + parent.clientHeight;
            const offset = scrollPinOffset({top, naturalTop: currentTop - record.offset, height, parentBottom, scrollTop: scrollport.scrollTop});
            node.style.top = offset ? `calc(${record.baseTop} + ${offset}px)` : record.baseTop;
            record.written = node.style.top;
            record.offset = offset;
        }
    };
    const ports = new Set(records.map(record => record.scrollport));
    for (const port of ports) port.addEventListener('scroll', refresh, {passive: true});
    view.addEventListener('resize', refresh);
    const observer = typeof view.ResizeObserver === 'function' ? new view.ResizeObserver(refresh) : null;
    for (const node of new Set([root, ...records.flatMap(record => [record.node, record.parent, record.scrollport])])) observer?.observe(node);
    scopes.set(root, () => {
        disposed = true;
        for (const port of ports) port.removeEventListener('scroll', refresh);
        view.removeEventListener('resize', refresh);
        observer?.disconnect();
        for (const record of records) if (record.node.style.top === record.written) record.node.style.top = record.baseTop;
    });
    refresh();
}
