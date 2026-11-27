/** Resolve a selected fixture's plain text without interpreting its content as markup. */
export function bindSelectedCopy(text, fixtures, selection) {
    const source = String(text || '');
    if (!source.includes('{{selection.')) return source;
    const item = fixtures?.items?.find(row => row.id === selection);
    return source.replace(/\{\{selection\.([a-zA-Z0-9_-]+)\}\}/g, (_, key) => {
        const value = key === 'name' ? item?.name
            : item?.copy && Object.hasOwn(item.copy, key) ? item.copy[key] : undefined;
        return typeof value === 'string' || Number.isFinite(value) ? String(value) : '—';
    });
}

/** Compose a reusable screen from the selected record without changing its authoring data. */
export function bindSelectedImages(screen, fixtures, selection) {
    if (!screen.elements.some(e => e.image?.selectionKey)) return screen;
    const images = fixtures?.items?.find(item => item.id === selection)?.images;
    if (!images) return screen;
    return {...screen, elements: screen.elements.map(element => {
        const key = element.image?.selectionKey;
        const image = key && Object.hasOwn(images, key) && images[key];
        return image ? {...element, image} : element;
    })};
}

export const GROUP_LABELS = {
    primary: '게임 기능', growth_tools: '성장·능력', auxiliary: '제작·보조'
};
export function validateBinding(b) {
    if (b === undefined)
        return;
    if (!b || typeof b !== 'object' || Array.isArray(b))
        throw Error('기능 연결 형식 오류');
    if (b.type === 'content-slot') {
        if (Object.keys(b).some(k => !['type', 'slot'].includes(k)) || !['world', 'filler'].includes(b.slot))
            throw Error('지원하지 않는 콘텐츠 영역');
        return;
    }
    if (b.type !== 'simulator-module' || !/^simulator_module_[a-z_]+$/.test(b.moduleId) || b.action !== 'open' || typeof b.label !== 'string' || typeof b.docId !== 'string')
        throw Error('지원하지 않는 게임 기능 연결');
}
export function moduleBinding(feature) {
    if (!feature)
        throw Error('등록 기능이 없습니다.');
    return {
        type: 'simulator-module', moduleId: feature.id, action: 'open', label: feature.label, docId: feature.docId || ''
    };
}
export function bindFeature(document, screenId, elementId, feature) {
    const s = document.screens.find(s => s.id === screenId), e = s?.elements.find(e => e.id === elementId);
    if (e?.kind !== 'button')
        throw Error('연결할 버튼을 선택하세요.');
    e.binding = moduleBinding(feature);
    const target = document.screens.find(s => s.kind === 'page' && s.moduleId === feature.id);
    document.transitions = document.transitions.filter(t => t.fromElement !== e.id);
    document.transitions.push({
        id: 'module-' + e.id, fromScreen: screenId, fromElement: e.id, event: 'click', condition: 'always', action: target ? 'navigate' : 'module', ...(target ? {
            targetScreen: target.id
        } : {}), payload: {
            moduleId: feature.id, label: feature.label
        }, label: feature.label + ' 열기', returnPolicy: '현재 게임 진행 유지'
    });
}
export function requestFromTransition(t) {
    if (t.action !== 'module')
        return null;
    if (!/^simulator_module_[a-z_]+$/.test(t.payload?.moduleId || ''))
        throw Error('등록 기능 요청 형식 오류');
    return {
        type: 'ui.action', action: 'module.open', moduleId: t.payload.moduleId, elementId: t.fromElement, screenId: t.fromScreen
    };
}
