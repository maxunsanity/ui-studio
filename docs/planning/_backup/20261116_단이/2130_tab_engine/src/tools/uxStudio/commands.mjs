import { descendants, moveInto, parentSize } from './layers.mjs';
import { clone, resolveRect, adjustRect } from './model.mjs';
import {isAutoLayoutChild} from './responsive-layout.mjs';
export const selectionIds = descendants;
export function removeSelection(document, screenId, ids) {
    const screen = document.screens.find(s => s.id === screenId), found = selectionIds(screen, ids);
    screen.elements = screen.elements.filter(e => !found.has(e.id));
    document.transitions = document.transitions.filter(t => !found.has(t.fromElement));
    return found.size;
}
export function copySelection(document, screenId, ids, width = 100, height = 100) {
    const screen = document.screens.find(s => s.id === screenId), found = selectionIds(screen, ids), elements = screen.elements.filter(e => found.has(e.id)).map(e => {
        const item = clone(e);
        if (!found.has(e.parentId)) {
            const rect = resolveRect(screen, e.id, width, height);
            Object.assign(item, {x: rect.x / width * 100, y: rect.y / height * 100, w: rect.w / width * 100, h: rect.h / height * 100});
            delete item.parentId;
            delete item.inset;
            delete item.rectTransform;
            delete item.useSafeArea;
        }
        return item;
    });
    return {
        elements, transitions: document.transitions.filter(t => found.has(t.fromElement)).map(clone)
    };
}
export function pasteSelection(document, screenId, clipboard, makeId, offset = 2) {
    const screen = document.screens.find(s => s.id === screenId);
    if (!clipboard?.elements.length)
        return [];
    if (screen.elements.length + clipboard.elements.length > 400)
        throw Error('화면 요소는400개까지 추가할 수 있습니다.');
    if (clipboard.elements.some(e => e.component || e.partRole || e.image || e.interaction))
        document.schemaVersion = Math.max(document.schemaVersion, 2);
    if (clipboard.elements.some(e => e.rectTransform)) document.schemaVersion = Math.max(document.schemaVersion, 4);
    const map = new Map(clipboard.elements.map(e => [e.id, makeId()]));
    const roots = [];
    for (const original of clipboard.elements) {
        const e = clone(original);
        e.id = map.get(e.id);
        if(e.buttonState&&e.buttonState.targetGraphic!=='self')e.buttonState.targetGraphic=map.get(e.buttonState.targetGraphic);
        if (e.parentId)
            e.parentId = map.get(e.parentId);
        else {
            e.x += offset;
            e.y += offset;
            roots.push(e.id);
        }
        e.name += ' 복사';
        if (e.binding?.type === 'content-slot' && screen.elements.some(n => n.binding?.type === 'content-slot' && n.binding.slot === e.binding.slot)) {
            delete e.binding;
            e.name += ' 자리 표시';
        }
        screen.elements.push(e);
    }
    for (const t of clipboard.transitions)
        document.transitions.push({
            ...clone(t), id: makeId(), fromScreen: screenId, fromElement: map.get(t.fromElement)
        });
    return roots;
}
export function groupSelection(document, screenId, ids, id, width = 100, height = 100) {
    const screen = document.screens.find(s => s.id === screenId), items = screen.elements.filter(e => ids.includes(e.id));
    if (items.length < 2)
        throw Error('같은 부모의 요소를2개 이상 선택하세요.');
    const parent = items[0].parentId;
    if (items.some(e => e.parentId !== parent))
        throw Error('같은 부모의 요소끼리 묶어주세요.');
    const bounds = items.map(e => resolveRect(screen, e.id, width, height));
    const p = parent ? resolveRect(screen, parent, width, height) : {x:0,y:0,w:width,h:height};
    const left = Math.min(...bounds.map(r => r.x)), top = Math.min(...bounds.map(r => r.y));
    const x = (left-p.x)/p.w*100, y = (top-p.y)/p.h*100;
    const w = (Math.max(...bounds.map(r => r.x+r.w))-left)/p.w*100;
    const h = (Math.max(...bounds.map(r => r.y+r.h))-top)/p.h*100;
    const group = {
        id, name: '그룹', kind: 'panel', x, y, w, h, text: '', purpose: '요소 그룹', info: '', isGroup: true, ...(parent ? {
            parentId: parent
        } : {}), appearance: {
            shape: 'rectangle', fill: '#ffffff', stroke: '#71839a', strokeWidth: 0, opacity: 1, textColor: '#243549'
        }
    };
    screen.elements.push(group);
    moveInto(screen, items.map(e => e.id), id, width, height);
    return id;
}
export function ungroupSelection(document, screenId, ids, width = 100, height = 100) {
    const screen = document.screens.find(s => s.id === screenId), result = [];
    for (const id of ids) {
        const group = screen.elements.find(e => e.id === id);
        if (!group?.isGroup)
            continue;
        const children = screen.elements.filter(e => e.parentId === id).map(e => e.id);
        result.push(...moveInto(screen, children, group.parentId || '', width, height));
        screen.elements = screen.elements.filter(e => e.id !== id);
        document.transitions = document.transitions.filter(t => t.fromElement !== id);
    }
    return result;
}

export function nudgeSelection(document, screenId, ids, dxPercent, dyPercent, width, height) {
    const screen = document.screens.find(s => s.id === screenId);
    const selected = new Set(ids), byId = new Map(screen.elements.map(e => [e.id,e]));
    const roots = screen.elements.filter(e => {
        if (!selected.has(e.id)) return false;
        let parent = e.parentId;
        while (parent) {
            if (selected.has(parent)) return false;
            parent = byId.get(parent)?.parentId;
        }
        return true;
    });
    for (const e of roots) {
        if(isAutoLayoutChild(screen,e))continue;
        const p = parentSize(screen,e,width,height);
        Object.assign(e,adjustRect(e,dxPercent*p.w/100,dyPercent*p.h/100,p.w,p.h,false,0));
    }
}
