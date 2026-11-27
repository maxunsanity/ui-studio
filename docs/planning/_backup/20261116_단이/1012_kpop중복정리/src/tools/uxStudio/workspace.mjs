export const PANEL_IDS = ['layer', 'features', 'overlays', 'properties', 'flow'];
export const PANEL_NAMES = {
    layer: '선택 레이어', features: '게임 기능', overlays: '공통 연출', properties: '속성', flow: '화면 관계'
};
export const groupsFor = mode => mode === '2' ? [['layer', 'properties'], ['features', 'overlays', 'flow']] : mode === '4' ? [['layer'], ['features'], ['overlays'], ['properties', 'flow']] : [[...PANEL_IDS]];
export function clampPanel(rect, width, height) {
    const w = Math.min(Math.max(240, Number(rect?.w) || 360), Math.max(240, width - 24)), h = Math.min(Math.max(150, Number(rect?.h) || 420), Math.max(150, height - 32));
    return {
        x: Math.max(8, Math.min(Number.isFinite(rect?.x) ? rect.x : Math.max(8, width - w - 24), width - w - 8)), y: Math.max(8, Math.min(Number.isFinite(rect?.y) ? rect.y : 120, height - h - 8)), w, h
    };
}
export function cleanWorkspace(value = {}) {
    if (!value || typeof value !== 'object' || Array.isArray(value))
        value = {};
    const mode = ['tabs', '2', '4'].includes(value.mode) ? value.mode : 'tabs', floats = {};
    for (const id of PANEL_IDS)
        if (value.floats?.[id])
            floats[id] = clampPanel(value.floats[id], 4000, 3000);
    const leftPanels = Array.isArray(value.leftPanels) ? [...new Set(value.leftPanels.filter(id => PANEL_IDS.includes(id)))] : [];
    const bottomPanels = Array.isArray(value.bottomPanels) ? [...new Set(value.bottomPanels.filter(id => PANEL_IDS.includes(id) && !leftPanels.includes(id)))] : [];
    let savedGroups = value.groups;
    if (Array.isArray(savedGroups) && savedGroups.every(Array.isArray) && !savedGroups.flat().includes('layer') && !leftPanels.includes('layer') && !bottomPanels.includes('layer'))
        savedGroups = savedGroups.map((g, i) => i === 0 ? ['layer', ...g] : g);
    const valid = Array.isArray(savedGroups) && savedGroups.length >= 1 && savedGroups.length <= 4 && savedGroups.every(Array.isArray) && [...leftPanels, ...bottomPanels, ...savedGroups.flat()].length === PANEL_IDS.length && new Set([...leftPanels, ...bottomPanels, ...savedGroups.flat()]).size === PANEL_IDS.length && savedGroups.flat().every(id => PANEL_IDS.includes(id));
    const groups = valid ? savedGroups : groupsFor(mode).map(g => g.filter(id => !leftPanels.includes(id) && !bottomPanels.includes(id)));
    return {
        version: 4, guides: value.guides === true, stageColor: /^#[0-9a-f]{6}$/i.test(value.stageColor) ? value.stageColor : '#e5e5e5', canvasColor: /^#[0-9a-f]{6}$/i.test(value.canvasColor) ? value.canvasColor : '#ffffff', frame: value.frame && Number.isFinite(value.frame.w) && Number.isFinite(value.frame.h) ? {
            w: Math.max(760, Math.min(10000, value.frame.w)), h: Math.max(500, Math.min(10000, value.frame.h))
        } : null, mode, left: Math.max(160, Math.min(480, Number.isFinite(value.left) ? value.left : 220)), right: Math.max(260, Math.min(760, Number.isFinite(value.right) ? value.right : 340)), bottomPanels, bottomActive: bottomPanels.includes(value.bottomActive) ? value.bottomActive : bottomPanels[0], bottomHeight: Math.max(150, Math.min(700, Number.isFinite(value.bottomHeight) ? value.bottomHeight : 260)), leftPanels, leftActive: leftPanels.includes(value.leftActive) ? value.leftActive : 'project', groups, active: groups.map((g, i) => g.includes(value.active?.[i]) ? value.active[i] : g[0]), weights: groups.map((g, i) => Number.isFinite(value.weights?.[i]) && value.weights[i] > 0 ? Math.min(100000, value.weights[i]) : 1), floats
    };
}
export function paneWidths(width, left, right) {
    const usable = Math.max(720, width) - 60, minCenter = 260;
    left = Math.max(160, Math.min(480, left));
    right = Math.max(260, Math.min(760, right));
    const excess = Math.max(0, left + right + minCenter - usable);
    if (excess) {
        const cut = Math.min(left - 160, excess);
        left -= cut;
        right = Math.max(260, right - (excess - cut));
    }
    return {
        left, right
    };
}
export function movePanel(groups, id, row) {
    if (!PANEL_IDS.includes(id) || !groups[row])
        throw Error('패널 대상 오류');
    const next = groups.map(g => g.filter(n => n !== id));
    next[row].push(id);
    return next;
}
export function dockSide(layout, id, side, row = 0) {
    if (!PANEL_IDS.includes(id) || !['left', 'right', 'bottom'].includes(side))
        throw Error('도킹 대상 오류');
    const next = {
        ...layout, leftPanels: (layout.leftPanels || []).filter(n => n !== id), bottomPanels: (layout.bottomPanels || []).filter(n => n !== id), groups: layout.groups.map(g => g.filter(n => n !== id)), floats: {
            ...layout.floats
        }, active: [...(layout.active || [])]
    };
    delete next.floats[id];
    if (side === 'left') {
        next.leftPanels.push(id);
        next.leftActive = id;
        next.left = Math.max(420, next.left);
    }
    else if (side === 'bottom') {
        next.bottomPanels.push(id);
        next.bottomActive = id;
        if (next.leftActive === id)
            next.leftActive = 'project';
    }
    else {
        if (!next.groups[row])
            throw Error('도킹 행 오류');
        next.groups[row].push(id);
        next.active[row] = id;
        if (next.leftActive === id)
            next.leftActive = 'project';
    }
    return next;
}
