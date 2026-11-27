import { SKINS, createSkin } from './skins.mjs';
import { createControl } from './controls.mjs';
export const SHAPES = {
    rectangle: '네모', rounded: '둥근 네모', circle: '동그라미', ellipse: '타원', capsule: '캡슐', hexagon: '육각형', triangle: '세모', diamond: '마름모'
};
export const EFFECTS = {
    none: '즉시', fade: '서서히', scale: '작게 → 크게', slide: '아래에서 위로'
};
const base = {
    fill: '#e8edf2', stroke: '#71839a', textColor: '#243549', strokeWidth: 1.5, radius: 12, opacity: 1, shape: 'rounded'
};
const unit = (id, name, group, kind, w, h, text, extra = {}) => ({
    id, name, group, kind, w, h, text, appearance: {
        ...base, ...extra
    }
});
export const UNITS = [
    ...Object.entries(SKINS).map(([id, p]) => ({
        ...unit('skin-' + id, p.name, '게임 UI', id === 'button' ? 'button' : 'panel', id === 'button' ? 50 : 85, id === 'button' ? 8 : id === 'topMenu' ? 9 : 30, p.name, {
            shape: 'rectangle'
        }), skin: createSkin(id)
    })),
    {
        ...unit('framed-image', '이미지 + 프레임', '복합 유닛', 'panel', 65, 26, '이미지 설명', {
            shape: 'rectangle'
        }), compound: true
    },
    {
        ...unit('framed-image-button', '이미지 + 프레임 버튼', '복합 유닛', 'button', 45, 20, '버튼 이름', {
            shape: 'rectangle'
        }), compound: true
    },
    {
        ...unit('menu', '접이식 메뉴', '목록·탐색', 'panel', 80, 30, '메뉴', {
            shape: 'rectangle'
        }), menu: {
            defaultOpen: true, headerHeight: 36
        }
    },
    ...Object.entries(SHAPES).map(([id, n]) => unit('panel-' + id, n + ' 백판', '백판·도형', 'panel', id === 'rectangle' ? 80 : 25, id === 'rectangle' ? 25 : 12, '', {
        shape: id
    })),
    ...Object.entries(SHAPES).map(([id, n]) => unit('button-' + id, n + ' 버튼', '버튼', 'button', id === 'circle' ? 20 : 35, id === 'circle' ? 9 : 8, '버튼', {
        shape: id
    })),
    unit('primary', '강조 버튼', '버튼', 'button', 65, 8, '확인', {
        fill: '#415c76', textColor: '#ffffff'
    }),
    unit('outline', '외곽선 버튼', '버튼', 'button', 65, 8, '선택', {
        fill: '#ffffff', strokeWidth: 2
    }),
    unit('icon', '아이콘 버튼', '버튼', 'button', 14, 6.5, '＋', {
        shape: 'circle'
    }),
    unit('title', '제목', '텍스트·정보', 'text', 80, 6, '제목', {
        fill: '#ffffff', strokeWidth: 0, variant: 'title'
    }),
    unit('body', '본문', '텍스트·정보', 'text', 80, 12, '설명 내용을 입력하세요', {
        fill: '#ffffff', strokeWidth: 0
    }),
    unit('badge', '배지', '텍스트·정보', 'panel', 22, 4, 'NEW', {
        shape: 'capsule', fill: '#d4e6e3'
    }),
    unit('avatar', '프로필 자리', '텍스트·정보', 'image', 22, 10, '프로필', {
        shape: 'circle'
    }),
    unit('image', '이미지 자리', '텍스트·정보', 'image', 80, 24, '이미지', {
        variant: 'image'
    }),
    unit('divider', '구분선', '텍스트·정보', 'panel', 80, 0.4, '', {
        shape: 'rectangle', fill: '#9baaba', strokeWidth: 0
    }),
    unit('input', '입력창', '입력·선택', 'panel', 80, 7, '내용 입력', {
        fill: '#ffffff', variant: 'input'
    }),
    unit('search', '검색창', '입력·선택', 'panel', 80, 7, '⌕  검색', {
        fill: '#ffffff', shape: 'capsule'
    }),
    unit('checkbox', '체크박스', '입력·선택', 'button', 65, 6, '□  선택 항목', {
        fill: '#ffffff', strokeWidth: 0
    }),
    unit('radio', '라디오 버튼', '입력·선택', 'button', 65, 6, '◯  선택 항목', {
        fill: '#ffffff', strokeWidth: 0
    }),
    unit('toggle', '토글', '입력·선택', 'button', 22, 5, '', {
        shape: 'capsule', variant: 'toggle'
    }),
    unit('dropdown', '드롭다운', '입력·선택', 'button', 70, 7, '선택하세요  ▾', {
        fill: '#ffffff'
    }),
    unit('stepper', '수량 선택', '입력·선택', 'button', 55, 7, '−     1     ＋', {
        fill: '#ffffff'
    }),
    unit('slider', '슬라이더', '입력·선택', 'panel', 80, 5, '', {
        variant: 'slider', strokeWidth: 0, fill: '#ffffff'
    }),
    unit('scrollbar', '스크롤바', '입력·선택', 'panel', 80, 5, '', { strokeWidth: 0, fill: '#ffffff' }),
    unit('toggle-group', '토글 그룹', '입력·선택', 'panel', 90, 7, '', { fill: '#ffffff' }),
    unit('tabs', '탭 메뉴', '목록·탐색', 'panel', 90, 7, '탭 1      탭 2      탭 3', {
        variant: 'tabs'
    }),
    unit('nav', '하단 메뉴', '목록·탐색', 'panel', 100, 9, '홈       성장       상점       설정', {
        shape: 'rectangle'
    }),
    unit('list', '스크롤 목록', '목록·탐색', 'list', 85, 35, '', {
        variant: 'list'
    }),
    unit('card', '콘텐츠 카드', '목록·탐색', 'card', 80, 22, '카드 제목\n내용 설명', {
        fill: '#ffffff'
    }),
    unit('progress', '진행 표시', '상태 표시', 'panel', 80, 4, '', {
        variant: 'progress', shape: 'capsule'
    }),
    unit('loading', '로딩 표시', '상태 표시', 'panel', 20, 9, '◌', {
        shape: 'circle', fill: '#ffffff'
    }),
    unit('resource', '재화 표시', '상태 표시', 'panel', 40, 5, '◇  수치', {
        shape: 'capsule'
    }),
    unit('tooltip', '설명 말풍선', '상태 표시', 'panel', 70, 10, '설명', {
        fill: '#415c76', textColor: '#ffffff'
    })
];
export function createUnit(id, elementId, x = 10, y = 30) {
    const p = UNITS.find(p => p.id === id);
    if (!p)
        throw Error('알 수 없는 유닛입니다.');
    const controlType = { input: 'input', search: 'input', checkbox: 'toggle', radio: 'toggle', toggle: 'toggle', dropdown: 'dropdown', slider: 'slider', scrollbar: 'scrollbar', tabs: 'tabs', 'toggle-group': 'toggle-group' }[id];
    return {
        id: elementId, name: p.name, kind: p.kind, x, y, w: p.w, h: p.h, text: p.text, purpose: '', info: '와이어프레임 유닛 · 기능은 연결·조건에서 지정', appearance: {
            ...p.appearance
        }, ...(controlType ? { control: { ...createControl(controlType), ...(id === 'radio' ? { group: 'radio' } : {}), ...(id === 'search' ? { placeholder: '검색' } : {}) } } : {}), ...(p.skin ? {
            skin: structuredClone(p.skin)
        } : {}), ...(p.menu ? {
            menu: {
                ...p.menu
            }
        } : {})
    };
}
export function validateAppearance(a) {
    if (a === undefined)
        return;
    if (!a || typeof a !== 'object' || Array.isArray(a))
        throw Error('유닛 모양 설정 오류');
    if (a.shape !== undefined && !Object.hasOwn(SHAPES, a.shape))
        throw Error('지원하지 않는 도형');
    for (const k of ['fill', 'stroke', 'textColor'])
        if (a[k] !== undefined && !/^#[0-9a-f]{6}$/i.test(a[k]))
            throw Error('색상은 6자리 HEX로 입력하세요.');
    for (const [k, min, max] of [['strokeWidth', 0, 12], ['radius', 0, 100], ['opacity', 0, 1]])
        if (a[k] !== undefined && (!Number.isFinite(a[k]) || a[k] < min || a[k] > max))
            throw Error('유닛 스타일 숫자 범위를 확인하세요.');
    if (a.variant !== undefined && !['title', 'image', 'input', 'toggle', 'slider', 'tabs', 'list', 'progress'].includes(a.variant))
        throw Error('유닛 표시 유형 오류');
}
export function validatePresentation(p) {
    if (p === undefined)
        return;
    if(p?.hideBaseElements!==undefined&&(!Array.isArray(p.hideBaseElements)||p.hideBaseElements.length>400||p.hideBaseElements.some(id=>typeof id!=='string'||!/^[a-zA-Z0-9_.-]{1,160}$/.test(id))||new Set(p.hideBaseElements).size!==p.hideBaseElements.length))throw Error('공통 연출의 숨길 레이어 ID 목록을 확인하세요.');
    if(p?.rootMode!==undefined&&!['window','fullscreen'].includes(p.rootMode))throw Error('공통 연출의 내용 루트는 기본 창 또는 화면 전체로 선택하세요.');
    if (!p || !['modal', 'sheet', 'toast', 'popover', 'top'].includes(p.type) || !Object.hasOwn(EFFECTS, p.effect) || !Number.isFinite(p.durationMs) || p.durationMs < 0 || p.durationMs > 2000 || !Number.isFinite(p.autoCloseMs) || p.autoCloseMs < 0 || p.autoCloseMs > 30000 || typeof p.dim !== 'boolean')
        throw Error('공통 연출 설정 범위를 확인하세요.');
    if (['blocking', 'dismissOnEscape', 'dismissOnBackdrop', 'blankBackdrop'].some(k => p[k] !== undefined && typeof p[k] !== 'boolean') || p.closePolicy !== undefined && !['allow', 'prevent'].includes(p.closePolicy) || p.toastPolicy !== undefined && !['dedupe', 'queue'].includes(p.toastPolicy))
        throw Error('공통 연출 차단·닫기·토스트 정책을 확인하세요.');
}
export function dropPosition(clientX, clientY, rect, parent) {
    if (rect.width <= 0 || rect.height <= 0)
        throw Error('편집 화면 크기를 확인하세요.');
    const x = (clientX - rect.left) / rect.width * 100, y = (clientY - rect.top) / rect.height * 100;
    return {
        x: Math.max(0, Math.min(100 - parent.w, x - parent.w / 2)), y: Math.max(0, Math.min(100 - parent.h, y - parent.h / 2))
    };
}
export function overlayTemplate(kind, id) {
    const title = {
        modal: '공통 모달', sheet: '공통 바텀시트', toast: '공통 토스트', popover: '공통 도움말', top: '공통 탑창'
    }[kind];
    if (!title)
        throw Error('지원하지 않는 공통 UI');
    const e = (suffix, name, k, x, y, w, h, text) => ({
        id: id + '-' + suffix, name, kind: k, x, y, w, h, text, purpose: '공통 UI 시험', info: '', ...(k === 'button' ? {
            skin: createSkin('button')
        } : {})
    });
    return {
        id, name: title, kind: ['popover', 'top'].includes(kind) ? 'modal' : kind, skin: createSkin(kind === 'sheet' ? 'sheet' : kind === 'top' ? 'top' : 'modal'), purpose: '현재 화면 위에서 공통 출현·닫힘을 시험합니다.', presentation: {
            type: kind, effect: kind === 'sheet' ? 'slide' : 'fade', durationMs: 240, autoCloseMs: kind === 'toast' ? 2400 : 0, dim: !['toast', 'popover'].includes(kind), blocking: !['toast', 'popover'].includes(kind), dismissOnEscape: kind !== 'toast', closePolicy: 'allow', ...(kind === 'toast' ? { toastPolicy: 'queue' } : {})
        }, elements: [e('title', '제목', 'text', 8, 8, 75, 15, title), e('body', '안내 내용', 'text', 8, 28, 84, 37, '표시할 내용을 편집하세요'), e('close', '닫기', 'button', 10, 76, 80, 16, '닫기')]
    };
}
export function flowData(doc) {
    const pages = doc.screens.filter(s => s.kind === 'page');
    const pairs = new Map();
    for (const t of doc.transitions) {
        if (!t.targetScreen || !pages.some(p => p.id === t.fromScreen) || !pages.some(p => p.id === t.targetScreen))
            continue;
        const key = t.fromScreen + '>' + t.targetScreen;
        if (!pairs.has(key))
            pairs.set(key, []);
        pairs.get(key).push(t);
    }
    return {
        nodes: pages.map((s, i) => ({
            id: s.id, label: s.name, x: i * 290, y: 0
        })), edges: [...pairs.values()].map(ts => ({
            id: ts[0].id, from: ts[0].fromScreen, to: ts[0].targetScreen, label: ts.length > 1 ? ts.length + '개 이동' : ts[0].label, transitions: ts.map(t => t.id)
        }))
    };
}
export function applyWireframeStyle(d) {
    for (const s of d.screens)
        for (const e of s.elements) {
            const clickable = (e.kind === 'button' && !e.intentionalNoAction) || d.transitions.some(t => t.fromScreen === s.id && t.fromElement === e.id);
            if (e.isGroup || e.component || e.partRole)
                continue;
            e.appearance = {
                ...base, ...e.appearance, shape: clickable ? 'ellipse' : 'rectangle', radius: 0, stroke: '#8c9aa8', strokeWidth: e.kind === 'text' && !clickable ? 0 : 1
            };
        }
    return d;
}

/** Apply overlay settings independently of trigger bindings, preserving authored close policy. */
export function updateOverlayPresentation(document,screenId,config) {
    validatePresentation(config);
    const next=structuredClone(document),target=next.screens.find(s=>s.id===screenId);
    if(!target||target.kind==='page')throw Error('공통 연출 화면을 선택하세요.');
    target.presentation={...target.presentation,...structuredClone(config)};
    if(config.rootMode===undefined)delete target.presentation.rootMode;
    validatePresentation(target.presentation);
    return next;
}
