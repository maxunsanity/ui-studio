import { encodeTransform } from './rect-transform.mjs';
import { resolveRect } from './model.mjs';
import {responsiveParentRect,isAutoLayoutChild} from './responsive-layout.mjs';
export const isContainer = e => !!e && (e.isGroup || ['image-frame', 'game-ui'].includes(e.component) || ['panel', 'card', 'list'].includes(e.kind));
export function indexLayers(screen) {
    const byId = new Map(), children = new Map();
    for (const e of screen.elements) {
        byId.set(e.id, e);
        const key = e.parentId || null;
        if (!children.has(key))
            children.set(key, []);
        children.get(key).push(e);
    }
    return {
        byId, children
    };
}
export function descendants(screen, ids, index = indexLayers(screen)) {
    const found = new Set(ids), pending = [...ids];
    while (pending.length)
        for (const child of index.children.get(pending.pop()) || []) {
            if (!found.has(child.id)) {
                found.add(child.id);
                pending.push(child.id);
            }
        }
    return found;
}
export function matchingLayers(screen, search, index = indexLayers(screen)) {
    const found = new Set();
    for (const e of screen.elements)
        if (e.name.includes(search)) {
            let current = e;
            while (current && !found.has(current.id)) {
                found.add(current.id);
                current = index.byId.get(current.parentId);
            }
        }
    return found;
}
export function isolationSets(screen, ids) {
    const index = indexLayers(screen), shown = descendants(screen, ids, index), keep = new Set(shown);
    for (const id of ids) {
        let e = index.byId.get(id);
        while (e?.parentId && !keep.has(e.parentId)) {
            keep.add(e.parentId);
            e = index.byId.get(e.parentId);
        }
    }
    return {
        shown, keep
    };
}
export function moveInto(screen, ids, parentId, width, height) {
    const index = indexLayers(screen), selected = new Set(ids);
    const items = screen.elements.filter(e => {
        if (!selected.has(e.id))
            return false;
        let p = e.parentId;
        while (p) {
            if (selected.has(p))
                return false;
            p = index.byId.get(p)?.parentId;
        }
        return true;
    });
    const target = parentId ? index.byId.get(parentId) : null;
    if (parentId && !isContainer(target))
        throw Error('백판·영역·목록·그룹 안으로 넣어주세요.');
    if (parentId && descendants(screen, items.map(e => e.id), index).has(parentId))
        throw Error('자기 자신이나 하위 레이어 안으로 옮길 수 없습니다.');
    if(target?.layout?.type&&items.some(e=>e.rectTransform||e.inset||e.useSafeArea))throw Error('자동 배치 부모로 옮기기 전에 앵커·여백·안전 영역을 해제하세요.');
    const rects = items.map(e => resolveRect(screen, e.id, width, height));
    const parent = target ? resolveRect(screen, parentId, width, height) : {
        x: 0, y: 0, w: width, h: height
    };
    items.forEach((e, i) => {
        const rect = rects[i];
        if(target)delete e.useSafeArea;
        const basis=target?parent:responsiveParentRect(screen,{...e,parentId:undefined},width,height);
        if (e.rectTransform) {
            const {min,max,pivot} = e.rectTransform;
            e.rectTransform = encodeTransform(basis, rect, min, max, pivot);
        }
        if (e.inset) {
            e.inset = [rect.y - basis.y, basis.x + basis.w - rect.x - rect.w,
                basis.y + basis.h - rect.y - rect.h, rect.x - basis.x];
        }
        e.x = (rect.x - basis.x) / basis.w * 100;
        e.y = (rect.y - basis.y) / basis.h * 100;
        e.w = rect.w / basis.w * 100;
        e.h = rect.h / basis.h * 100;
        if (target)
            e.parentId = parentId;
        else
            delete e.parentId;
    });
    return items.map(e => e.id);
}
export function parentSize(screen, element, width, height) {
    return responsiveParentRect(screen,element,width,height);
}
export function transformDisplayValue(screen, element, key, unit, width, height) {
    const p = parentSize(screen, element, width, height), size = ['x', 'w'].includes(key) ? p.w : p.h;
    const rect = resolveRect(screen, element.id, width, height);
    const value = rect[key] - (key === 'x' ? p.x : key === 'y' ? p.y : 0);
    return unit === 'px' ? value : value / size * 100;
}
export function transformValue(screen, element, key, value, unit, width, height) {
    if(isAutoLayoutChild(screen,element))throw Error('자동 배치 자식의 위치·크기는 부모에서 조절하세요.');
    if (!['x', 'y', 'w', 'h'].includes(key) || !Number.isFinite(value) || (['w', 'h'].includes(key) && value <= 0))
        throw Error('크기는0보다 큰 숫자로 입력하세요.');
    const p = parentSize(screen, element, width, height), size = ['x', 'w'].includes(key) ? p.w : p.h;
    if (element.rectTransform) {
        const rect = resolveRect(screen,element.id,width,height);
        rect[key] = (unit === 'px' ? value : value*size/100) + (key === 'x' ? p.x : key === 'y' ? p.y : 0);
        const {min,max,pivot} = element.rectTransform;
        element.rectTransform = encodeTransform(p,rect,min,max,pivot);
        return;
    }
    element[key] = unit === 'px' ? value / size * 100 : value;
}

export function alignElement(screen, element, direction, width, height) {
    if(isAutoLayoutChild(screen,element))throw Error('자동 배치 자식은 수동 정렬할 수 없습니다.');
    if (!['left', 'center', 'right'].includes(direction)) throw Error('정렬 방향을 확인하세요.');
    const p = parentSize(screen, element, width, height), rect = resolveRect(screen, element.id, width, height);
    const x = direction === 'left' ? 0 : (p.w - rect.w) / (direction === 'right' ? 1 : 2);
    if (element.inset) {
        const [top, , bottom] = element.inset;
        element.inset = [top, p.w - x - rect.w, bottom, x];
    } else {
        transformValue(screen, element, 'x', x, 'px', width, height);
    }
}

// Change constraints without moving the current rectangle; no implicit document migration.
export function changeAnchors(screen, element, anchors, width, height) {
    if(isAutoLayoutChild(screen,element))throw Error('자동 배치 자식의 앵커는 부모에서 조절하세요.');
    const base = parentSize(screen, element, width, height), rect = resolveRect(screen, element.id, width, height);
    if (anchors !== null) {
        const next = encodeTransform(base, rect, anchors.min, anchors.max, anchors.pivot);
        element.rectTransform = next;
        delete element.inset;
    } else {
        Object.assign(element, {x:(rect.x-base.x)/base.w*100, y:(rect.y-base.y)/base.h*100, w:rect.w/base.w*100, h:rect.h/base.h*100});
        delete element.rectTransform;
        delete element.inset;
    }
}
