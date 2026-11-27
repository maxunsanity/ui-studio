export function validateMenu(e) {
    if (e.layout !== undefined && (!e.layout || !['row', 'column'].includes(e.layout.direction) || !Number.isFinite(e.layout.gap) || e.layout.gap < 0 || e.layout.gap > 500))
        throw Error('그룹 정렬 설정 오류');
    if (e.menu === undefined)
        return;
    const m = e.menu;
    if (e.kind !== 'panel' || !m || typeof m.defaultOpen !== 'boolean' || !Number.isFinite(m.headerHeight) || m.headerHeight < 20 || m.headerHeight > 200)
        throw Error('접이식 메뉴 설정 오류');
}
export function menuIsOpen(e, state = {}) {
    return Object.hasOwn(state, e.id) ? state[e.id] : e.menu?.defaultOpen !== false;
}
export function hiddenByMenu(screen, id, state = {}) {
    const byId = new Map(screen.elements.map(e => [e.id, e]));
    let e = byId.get(id);
    while (e?.parentId) {
        e = byId.get(e.parentId);
        if (e?.menu && !menuIsOpen(e, state))
            return true;
    }
    return false;
}
export function wheelValue(value, delta, unit, shift = false, alt = false) {
    return Math.round((value - Math.sign(delta) * (unit === 'px' ? 1 : .25) * (shift ? 10 : alt ? .1 : 1)) * 10000) / 10000;
}
