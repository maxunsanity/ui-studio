import { encodeTransform } from './rect-transform.mjs';
import { resolveRect } from './model.mjs';
import { isContainer, moveInto } from './layers.mjs';
export function wrapMenu(screen, ids, id, width, height) {
    const selected = screen.elements.filter(e => ids.includes(e.id));
    if (selected.some(e => e.binding?.type === 'content-slot'))
        throw Error('게임 콘텐츠 자리는 메뉴로 묶지 않습니다.');
    if (new Set(selected.map(e => e.parentId || null)).size > 1)
        throw Error('같은 부모 안의 메뉴를 선택하세요.');
    const parentId = selected[0]?.parentId, parent = parentId ? resolveRect(screen, parentId, width, height) : {
        x: 0, y: 0, w: width, h: height
    };
    const rects = selected.map(e => resolveRect(screen, e.id, width, height)), x = rects.length ? Math.min(...rects.map(r => r.x)) - 8 : parent.x + parent.w * .1, y = rects.length ? Math.min(...rects.map(r => r.y)) - 44 : parent.y + parent.h * .2;
    const w = rects.length ? Math.max(...rects.map(r => r.x + r.w)) - x + 8 : parent.w * .8, h = rects.length ? Math.max(...rects.map(r => r.y + r.h)) - y + 8 : parent.h * .3;
    const menu = {
        id, name: '접이식 메뉴', kind: 'panel', x: (x - parent.x) / parent.w * 100, y: (y - parent.y) / parent.h * 100, w: w / parent.w * 100, h: h / parent.h * 100, text: '메뉴', menu: {
            defaultOpen: true, headerHeight: 36
        }, appearance: {
            shape: 'rectangle', fill: '#e8edf2', stroke: '#71839a', strokeWidth: 1
        }
    };
    if (parentId)
        menu.parentId = parentId;
    screen.elements.push(menu);
    moveInto(screen, ids, id, width, height);
    return id;
}
function setBounds(element, rect, base) {
    if (element.rectTransform) {
        const {min, max, pivot} = element.rectTransform;
        element.rectTransform = encodeTransform(base, rect, min, max, pivot);
    } else if (element.inset) {
        const x = rect.x - base.x, y = rect.y - base.y;
        element.inset = [y, base.w - x - rect.w, base.h - y - rect.h, x];
    } else {
        Object.assign(element, {x:(rect.x-base.x)/base.w*100, y:(rect.y-base.y)/base.h*100, w:rect.w/base.w*100, h:rect.h/base.h*100});
    }
}
/** Change positions and container bounds, keeping each child's pixel size. */
export function arrangeChildren(screen, id, direction, gap, width, height) {
    const parent = screen.elements.find(e => e.id === id);
    if (!isContainer(parent) || !['row', 'column'].includes(direction) || !Number.isFinite(gap) || gap < 0 || gap > 500)
        throw Error('그룹·메뉴와 간격(0~500px)을 확인하세요.');
    const children = screen.elements.filter(e => e.parentId === id), rects = children.map(e => resolveRect(screen, e.id, width, height));
    if (!children.length)
        throw Error('먼저 기존 요소를 이 그룹·메뉴 안에 넣어주세요.');
    const padding = 8, header = parent.menu?.headerHeight || 0;
    let cursor = padding;
    const positions = rects.map(r => {
        const p = {
            x: direction === 'row' ? cursor : padding, y: header + (direction === 'column' ? cursor : padding), w: r.w, h: r.h
        };
        cursor += (direction === 'row' ? r.w : r.h) + gap;
        return p;
    });
    const w = direction === 'row' ? cursor - gap + padding : Math.max(...rects.map(r => r.w)) + padding * 2, h = header + (direction === 'column' ? cursor - gap + padding : Math.max(...rects.map(r => r.h)) + padding * 2);
    const base = parent.parentId ? resolveRect(screen, parent.parentId, width, height) : {
        x: 0, y: 0, w: width, h: height
    };
    const parentRect = { ...resolveRect(screen, id, width, height), w, h };
    setBounds(parent, parentRect, base);
    children.forEach((e, i) => {
        setBounds(e, {...positions[i], x:parentRect.x+positions[i].x, y:parentRect.y+positions[i].y}, parentRect);
    });
    parent.layout = {
        direction, gap
    };
    return children.length;
}
