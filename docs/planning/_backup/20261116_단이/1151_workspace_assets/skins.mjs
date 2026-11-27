const asset = name => new URL('./assets/ui-skins/' + name, import.meta.url).href;
export const SKIN_ASSETS = Object.freeze({
    frame: {
        src: asset('frame.svg'), w: 128, h: 96
    }, button: {
        src: asset('button.svg'), w: 96, h: 48
    }, icon: {
        src: asset('icon.svg'), w: 24, h: 24
    }
});
export const SKIN_STATES = {
    normal: '기본', pressed: '눌림', selected: '선택', disabled: '비활성'
};
export const SKINS = Object.freeze({
    button: {
        name: '버튼', mode: '3', asset: 'button', tone: '#dcefe8', slices: [0, 16, 0, 16], edges: [0, 12, 0, 12], padding: [5, 12, 5, 12]
    },
    backplate: {
        name: '정보 백판', mode: '9', asset: 'frame', tone: '#dbe2e9', slices: [12, 12, 12, 12], edges: [6, 6, 6, 6], padding: [6, 8, 6, 8]
    },
    modal: {
        name: '모달창', mode: '9', asset: 'frame', tone: '#e8e1f3', slices: [12, 12, 12, 12], edges: [10, 10, 10, 10], padding: [16, 16, 16, 16]
    },
    sheet: {
        name: '바텀창', mode: '9', asset: 'frame', tone: '#f5e5d6', slices: [12, 12, 12, 12], edges: [8, 8, 8, 8], padding: [14, 14, 14, 14]
    },
    top: {
        name: '탑창', mode: '9', asset: 'frame', tone: '#dceaf5', slices: [12, 12, 12, 12], edges: [8, 8, 8, 8], padding: [12, 12, 12, 12]
    },
    topMenu: {
        name: '탑 메뉴', mode: '9', asset: 'frame', tone: '#f4edcc', slices: [12, 12, 12, 12], edges: [6, 6, 6, 6], padding: [6, 8, 6, 8]
    },
    background: {
        name: '비조작 배경', mode: '9', asset: 'frame', tone: '#56616f', slices: [12, 12, 12, 12], edges: [4, 4, 4, 4], padding: [8, 8, 8, 8]
    }
});
export const createSkin = preset => {
    if (!Object.hasOwn(SKINS, preset))
        throw Error('UI 종류 오류');
    return {
        preset, version: 1, ...structuredClone(SKINS[preset]), defaultState: 'normal', repeat: 'stretch'
    };
};
export function validateSkin(s) {
    if (s === undefined)
        return;
    if (!s || s.version !== 1 || !Object.hasOwn(SKINS, s.preset) || !['3', '9'].includes(s.mode) || !['frame', 'button'].includes(s.asset) || !/^#[a-f0-9]{6}$/i.test(s.tone) || !Object.hasOwn(SKIN_STATES, s.defaultState) || !['stretch', 'repeat', 'round'].includes(s.repeat))
        throw Error('UI 이미지 조립 설정 오류');
    for (const key of ['slices', 'edges', 'padding'])
        if (!Array.isArray(s[key]) || s[key].length !== 4 || s[key].some(n => !Number.isFinite(n) || n < 0 || n > 96))
            throw Error('분할/고정폭/여백은 상·우·하·좌의 유효한 숫자여야 합니다.');
    for (const [state, t] of Object.entries(s.textures || {})) {
        if (!Object.hasOwn(SKIN_STATES, state) || !t || !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(t.src) || t.src.length > 400100 || !Number.isInteger(t.w) || !Number.isInteger(t.h) || t.w < 1 || t.h < 1 || t.w > 4096 || t.h > 4096 || s.slices[0] + s.slices[2] >= t.h || s.slices[1] + s.slices[3] >= t.w)
            throw Error('프레임 이미지/크기 오류');
    }
    const a = skinSource(s, s.defaultState);
    if (s.slices[0] + s.slices[2] >= a.h || s.slices[1] + s.slices[3] >= a.w || (s.mode === '3' && (s.slices[0] !== 0 || s.slices[2] !== 0 || s.edges[0] !== 0 || s.edges[2] !== 0)))
        throw Error('이미지 중앙 영역과3슬라이스 상하값을 확인하세요.');
}
export function applySkin(node, skin, { view = 'art', state, live = false } = {}) {
    node.classList.toggle('game-skin', !!skin);
    node.classList.toggle('skin-live', !!skin && live);
    if (!skin)
        return;
    const current = state || skin.defaultState, p = skinSource(skin, current);
    node.classList.toggle('custom-skin-image', !!(skin.textures?.[current] || skin.textures?.normal));
    node.dataset.skinPreset = skin.preset;
    node.dataset.skinState = current;
    node.dataset.skinView = view;
    for (const stateName of Object.keys(SKIN_STATES))
        node.style.setProperty('--skin-' + stateName + '-source', `url("${skinSource(skin, stateName).src}")`);
    node.classList.toggle('structure-unit', view === 'wire' && state !== undefined);
    node.style.setProperty('--skin-source', `url("${p.src}")`);
    node.style.setProperty('--skin-tone', skin.tone);
    node.style.setProperty('--skin-slices', skin.slices.join(' ') + ' fill');
    node.style.setProperty('--skin-edges', skin.edges.map(n => n + 'px').join(' '));
    node.style.setProperty('--skin-repeat', skin.repeat);
    node.style.setProperty('--skin-padding', skin.padding.map(n => n + 'px').join(' '));
    node.style.setProperty('--skin-text', skin.preset === 'background' ? '#f7f8fa' : '#34424f');
}
export function constructGameUI(d, screenId, onlyId) {
    const screen = d.screens.find(s => s.id === screenId);
    if (!screen)
        throw Error('로비 화면을 선택하세요.');
    const roots = screen.elements.filter(e => (!onlyId || e.id === onlyId) && !e.parentId && !e.component && e.kind !== 'text' && (!e.skin || e.id === onlyId));
    if (screen.elements.length + roots.filter(e => e.binding?.type !== 'content-slot').length * 2 > 400)
        throw Error('부품 추가 뒤400개를 넘습니다.');
    const ids = new Set(d.screens.flatMap(s => s.elements.map(e => e.id)));
    const childId = (id, suffix) => {
        let n = id.slice(0, 90) + '-ui-' + suffix;
        while (ids.has(n))
            n = id.slice(0, 75) + '-' + crypto.randomUUID().slice(0, 8) + '-' + suffix;
        ids.add(n);
        return n;
    };
    for (const e of roots) {
        if (screen.elements.some(n => n.parentId === e.id))
            continue;
        if (e.binding?.type === 'content-slot') {
            e.skin = createSkin('background');
            e.interaction = {
                mode: 'none', enabled: true, shape: 'rectangle', reason: ''
            };
            continue;
        }
        const original = e.text, button = e.kind === 'button', linked = d.transitions.some(t => t.fromElement === e.id), nav = e.id.startsWith('menu-'), inline = e.id.startsWith('currency-') || e.id.startsWith('info-') || ['record', 'news', 'roll'].includes(e.id);
        e.skin ||= createSkin(button ? 'button' : 'backplate');
        e.component = 'game-ui';
        e.partRole = 'container';
        e.text = '';
        e.appearance = {
            ...e.appearance, shape: 'rectangle', strokeWidth: 0
        };
        e.interaction = {
            mode: button ? 'action' : 'none', enabled: !button || linked, shape: 'rectangle', reason: button && !linked ? '기능 연결 정의가 아직 없습니다.' : ''
        };
        const part = (role, kind, rect, extra) => ({
            id: childId(e.id, role), parentId: e.id, partRole: role, kind, name: e.name + ' · ' + (role === 'image' ? '아이콘' : '텍스트'), x: rect[0], y: rect[1], w: rect[2], h: rect[3], text: '', purpose: e.name + '의 ' + role, info: role === 'image' ? '실제 아이콘을 교체하는 이미지 부품' : '표시 문구·수치. 입력은 전체 버튼에 전달합니다.', interaction: {
                mode: button ? 'parent' : 'none', enabled: true, shape: 'rectangle', reason: ''
            }, ...extra
        });
        screen.elements.push(part('image', 'image', nav ? [30, 7, 40, 46] : inline ? [5, 17, 14, 66] : [7, 12, 18, 35], {
            image: {
                src: '', asset: 'icon', alt: e.name + ' 아이콘', fit: 'contain', compact: true
            }
        }), part('label', 'text', nav ? [2, 57, 96, 34] : inline ? [23, 4, 72, 92] : [8, 50, 84, 43], {
            text: original, fontSize: nav ? 11 : e.id === 'roll' ? 16 : 12
        }));
    }
    for (const s of d.screens)
        if (s.kind !== 'page' && !s.skin)
            s.skin = createSkin(s.presentation?.type === 'sheet' ? 'sheet' : s.presentation?.type === 'top' ? 'top' : 'modal');
    nestBackgrounds(d, screen);
    d.schemaVersion = 3;
    return d;
}
export function skinSource(s, state = 'normal') {
    return s.textures?.[state] || s.textures?.normal || SKIN_ASSETS[s.asset];
}
function nestBackgrounds(d, screen) {
    const ids = new Set(d.screens.flatMap(s => s.elements.map(e => e.id)));
    for (const root of screen.elements.filter(e => e.component === 'game-ui' && e.skin)) {
        root.appearance = {
            ...root.appearance, shape: 'rectangle', strokeWidth: 0
        };
        if (screen.elements.some(e => e.parentId === root.id && e.partRole === 'background'))
            continue;
        if (screen.elements.length >= 400)
            throw Error('바탕 추가 뒤400개를 넘습니다.');
        let id = root.id.slice(0, 85) + '-ui-background';
        while (ids.has(id))
            id = root.id.slice(0, 70) + '-bg-' + crypto.randomUUID().slice(0, 8);
        ids.add(id);
        const inset = root.skin.mode === '3' ? [2, root.skin.edges[1], 3, root.skin.edges[3]] : [root.skin.edges[0], root.skin.edges[1], root.skin.edges[2], root.skin.edges[3]];
        const face = {
            id, parentId: root.id, partRole: 'background', kind: 'panel', name: root.name + ' · 바탕 이미지', x: 0, y: 0, w: 100, h: 100, inset, text: '', purpose: '프레임 안쪽 바탕. 이미지 등록 시 임시 색판을 숨깁니다.', info: '입력은 전체 버튼에 전달합니다. 아이콘·텍스트는 이 바탕의 자식입니다.', interaction: {
                mode: root.interaction.mode === 'action' ? 'parent' : 'none', enabled: true, shape: 'rectangle', reason: ''
            }, image: {
                src: '', alt: root.name + ' 바탕', fit: 'fill'
            }, appearance: {
                shape: 'rectangle', fill: root.skin.tone, strokeWidth: 0, opacity: 1
            }
        };
        for (const child of screen.elements.filter(e => e.parentId === root.id))
            child.parentId = id;
        screen.elements.push(face);
    }
}
