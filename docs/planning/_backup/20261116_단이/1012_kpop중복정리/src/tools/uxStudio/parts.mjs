export const PART_ROLES = {
    container: '구성 전체', background: '바탕', frame: '프레임', image: '이미지', label: '텍스트', badge: '배지'
};
export const INPUT_MODES = {
    action: '자체 동작', parent: '부모에 전달', none: '표시 전용', block: '입력 차단'
};
export const IMAGE_BYTES = 300000;
export function inputMode(e, transitions = []) {
    return e?.interaction?.mode || (e?.menu || (e?.kind === 'button' && !e.intentionalNoAction) || transitions.some(t => t.fromElement === e?.id) ? 'action' : 'none');
}
export function inputOwner(screen, id, transitions = []) {
    const seen = new Set();
    let e = screen?.elements.find(e => e.id === id);
    while (e && !seen.has(e.id)) {
        seen.add(e.id);
        if (inputMode(e, transitions) !== 'parent')
            return inputMode(e, transitions) === 'action' ? e : null;
        e = screen.elements.find(n => n.id === e.parentId);
    }
    return null;
}
export function componentRoot(screen, id) {
    let e = screen?.elements.find(e => e.id === id);
    const seen = new Set();
    while (e && !seen.has(e.id)) {
        if (['image-frame', 'game-ui'].includes(e.component))
            return e;
        seen.add(e.id);
        e = screen.elements.find(n => n.id === e.parentId);
    }
    return null;
}
export function editTarget(screen, id, inside = null) {
    const root = componentRoot(screen, id);
    return root && root.id !== inside ? root.id : id;
}
export function validateImageRegion(image) {
    if (image.sourceSize !== undefined && (!Array.isArray(image.sourceSize) || image.sourceSize.length !== 2 || image.sourceSize.some(v => !Number.isInteger(v) || v < 1 || v > 4096)))
        throw Error('이미지 원본 크기는1~4096px 정수입니다.');
    if (image.region === undefined) return;
    const r = image.region, size = image.sourceSize;
    if (!image.src || image.asset || !size || !Array.isArray(r) || r.length !== 4 || r.some(v => !Number.isInteger(v)) || r[0] < 0 || r[1] < 0 || r[2] < 1 || r[3] < 1 || r[0] + r[2] > size[0] || r[1] + r[3] > size[1])
        throw Error('이미지 영역은 원본 안의 X/Y/W/H 정수로 지정하세요.');
}
export const FONT_FAMILIES = {
    system: '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif',
    arial: 'Arial, sans-serif', georgia: 'Georgia, serif', mono: 'ui-monospace, monospace'
};
export function validateTypography(e) {
    if (e.fontSize !== undefined && (!Number.isFinite(e.fontSize) || e.fontSize < 1 || e.fontSize > 256))
        throw Error('글자 크기는1~256px입니다.');
    const t = e.typography;
    if (t === undefined) return;
    if (!t || typeof t !== 'object' || Array.isArray(t) || Object.keys(t).some(k => !['family','weight','lineHeight','letterSpacing','align','vertical','wrap','overflow'].includes(k)))
        throw Error('텍스트 속성 형식 오류');
    const enums = {family:Object.keys(FONT_FAMILIES), align:['left','center','right'], vertical:['top','middle','bottom'], wrap:['wrap','nowrap'], overflow:['visible','clip','ellipsis']};
    for (const [k,values] of Object.entries(enums))
        if (t[k] !== undefined && !values.includes(t[k])) throw Error('지원하지 않는 텍스트 '+k);
    for (const [k,min,max] of [['weight',1,1000],['lineHeight',1,512],['letterSpacing',-10,64]])
        if (t[k] !== undefined && (!Number.isFinite(t[k]) || t[k] < min || t[k] > max)) throw Error('텍스트 '+k+' 범위를 확인하세요.');
    if (t.overflow === 'ellipsis' && t.wrap !== 'nowrap') throw Error('말줄임표는 한 줄 모드에서 사용하세요.');
}
export function typographyStyles(e) {
    const t = e.typography || {};
    return {
        fontFamily: t.family ? FONT_FAMILIES[t.family] : '', fontWeight:t.weight === undefined ? '' : String(t.weight),
        lineHeight:t.lineHeight === undefined ? '' : t.lineHeight+'px', letterSpacing:t.letterSpacing === undefined ? '' : t.letterSpacing+'px',
        textAlign:t.align || '', whiteSpace:t.wrap === 'nowrap' ? 'nowrap' : t.wrap === 'wrap' ? 'pre-wrap' : '',
        overflowWrap:t.wrap === 'wrap' ? 'anywhere' : '', overflow:t.overflow && t.overflow !== 'visible' ? 'hidden' : '',
        textOverflow:t.overflow === 'ellipsis' ? 'ellipsis' : '', width:e.typography ? '100%' : '', maxHeight:e.typography ? '100%' : ''
    };
}
export function validateParts(e) {
    validateTypography(e);
    if (e.component !== undefined && !['image-frame', 'game-ui'].includes(e.component))
        throw Error('지원하지 않는 복합 유닛');
    if (e.partRole !== undefined && !Object.hasOwn(PART_ROLES, e.partRole))
        throw Error('부품 역할 오류');
    if (e.component && ['image', 'text'].includes(e.kind))
        throw Error('복합 전체는 이미지/텍스트 부품과 분리해야 합니다.');
    if (e.partRole === 'image' && e.kind !== 'image' || e.partRole === 'label' && e.kind !== 'text' || ['background', 'frame'].includes(e.partRole) && e.kind !== 'panel')
        throw Error('부품 역할과 UI 종류가 다릅니다. 이미지/텍스트/영역 종류를 먼저 확인하세요.');
    const i = e.interaction;
    if (i !== undefined && (!i || !Object.hasOwn(INPUT_MODES, i.mode) || typeof i.enabled !== 'boolean' || !['rectangle', 'ellipse'].includes(i.shape) || typeof i.reason !== 'string' || i.reason.length > 1000))
        throw Error('입력 역할·도형·상태를 확인하세요.');
    const a = e.image;
    if (a !== undefined && (!a || !['image', 'panel', 'button', 'card'].includes(e.kind) || typeof a.alt !== 'string' || a.alt.length > 1000 || !['contain', 'cover', 'fill'].includes(a.fit) || a.asset !== undefined && a.asset !== 'icon' || a.compact !== undefined && typeof a.compact !== 'boolean' || typeof a.src !== 'string' || (a.src !== '' && (!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(a.src) || a.src.length > 400100))))
        throw Error('이미지는 PNG/JPEG/WebP 300KB 이하로 넣어 주세요.');
    if (a) validateImageRegion(a);
}
export function decomposeImageFrame(screen, root, transitions = []) {
    if (!root || root.component || root.menu || root.isGroup || root.binding?.type === 'content-slot' || screen.elements.some(e => e.parentId === root.id))
        throw Error('하위 요소가 없는 일반 이미지·버튼·판을 선택하세요.');
    if (screen.elements.length + 4 > 400)
        throw Error('화면 요소는400개까지 추가할 수 있습니다.');
    const originalMode = inputMode(root, transitions), action = ['action', 'parent'].includes(originalMode), text = root.text || root.name, appearance = root.appearance || {}, originalImage = root.image;
    const ids = new Set(screen.elements.map(e => e.id));
    const makeId = suffix => {
        let id = root.id.slice(0, 85) + '-' + suffix;
        while (ids.has(id))
            id = root.id.slice(0, 70) + '-' + suffix + '-' + crypto.randomUUID().slice(0, 8);
        ids.add(id);
        return id;
    };
    if (['image', 'text'].includes(root.kind))
        root.kind = 'panel';
    root.component = 'image-frame';
    root.partRole = 'container';
    root.interaction = {
        mode: originalMode, enabled: root.interaction?.enabled !== false, shape: root.interaction?.shape || 'rectangle', reason: root.interaction?.reason || ''
    };
    root.text = '';
    delete root.image;
    const part = (role, kind, x, y, w, h, extra = {}) => ({
        id: makeId(role), parentId: root.id, partRole: role, kind, name: root.name + ' · ' + PART_ROLES[role], x, y, w, h, text: '', purpose: PART_ROLES[role] + ' 부품', info: action ? '게임 입력은 부모 전체에 전달합니다.' : '표시 전용입니다. 게임 기능을 실행하지 않습니다.', interaction: {
            mode: originalMode === 'none' ? 'none' : 'parent', enabled: true, shape: 'rectangle', reason: ''
        }, ...extra
    });
    const bg = part('background', 'panel', 0, 0, 100, 100, {
        appearance: {
            ...appearance, shape: 'rectangle', fill: appearance.fill || '#eef1f4', strokeWidth: 0
        }
    });
    const image = part('image', 'image', 8, 7, 84, 65, {
        image: originalImage || {
            src: '', alt: root.name + ' 이미지', fit: 'contain'
        }, appearance: {
            shape: 'rectangle', fill: '#f4f5f7', stroke: '#a2acb5', strokeWidth: 1, radius: 0
        }
    });
    const label = part('label', 'text', 8, 76, 84, 18, {
        text, fontSize: 14, appearance: {
            shape: 'rectangle', fill: '#ffffff', strokeWidth: 0
        }
    });
    const frame = part('frame', 'panel', 0, 0, 100, 100, {
        appearance: {
            ...appearance, shape: 'rectangle', stroke: appearance.stroke || '#71839a', strokeWidth: appearance.strokeWidth || 2, radius: 0
        }
    });
    screen.elements.push(bg, image, label, frame);
    return root;
}
export function insideHit(e, x, y) {
    return x >= 0 && x <= 1 && y >= 0 && y <= 1 && (e.interaction?.shape !== 'ellipse' || ((x - .5) / .5) ** 2 + ((y - .5) / .5) ** 2 <= 1);
}
export function acceptsEvent(screen, transitions, node, event, container) {
    const owner = inputOwner(screen, node?.dataset.element, transitions);
    if (!owner)
        return true;
    const target = [...container.querySelectorAll('.ui-element')].find(n => n.dataset.screen === screen.id && n.dataset.element === owner.id);
    if (!target)
        return false;
    if (event.detail === 0)
        return true;
    const r = target.getBoundingClientRect();
    return insideHit(owner, (event.clientX - r.left) / r.width, (event.clientY - r.top) / r.height);
}
export async function readImageFile(file) {
    if (!file || file.size > IMAGE_BYTES || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type))
        throw Error('PNG/JPEG/WebP 300KB 이하 파일을 선택하세요.');
    const b = new Uint8Array(await file.arrayBuffer());
    const valid = file.type === 'image/png' ? b.slice(0, 8).join(',') === '137,80,78,71,13,10,26,10' : file.type === 'image/jpeg' ? b[0] === 255 && b[1] === 216 && b[2] === 255 : b.length >= 12 && String.fromCharCode(...b.slice(0, 4)) === 'RIFF' && String.fromCharCode(...b.slice(8, 12)) === 'WEBP';
    if (!valid)
        throw Error('파일 내용과 이미지 종류가 일치하지 않습니다.');
    return 'data:' + file.type + ';base64,' + btoa(Array.from(b, v => String.fromCharCode(v)).join(''));
}
export function createPartsDemo(id) {
    const screen = {
        id: 'parts-lobby', name: '이미지와 프레임', kind: 'page', purpose: '부품 선택과 입력 구분 시험', elements: [
            {
                id: 'intro', kind: 'text', name: '안내', x: 6, y: 3, w: 88, h: 9, text: '이미지 + 프레임\n전체 선택 → 부품 안으로', purpose: '선택 방법', info: '', interaction: {
                    mode: 'none', enabled: true, shape: 'rectangle', reason: ''
                }
            },
            {
                id: 'display-card', kind: 'panel', name: '표시 전용 이미지판', x: 10, y: 15, w: 80, h: 28, text: '이미지판 · 게임 입력 없음', purpose: '표시 전용 예제', info: ''
            },
            {
                id: 'action-card', kind: 'button', name: '상점 이미지 버튼', x: 20, y: 51, w: 60, h: 25, text: '상점 열기', purpose: '부품을 눌러도 전체 버튼 동작', info: ''
            },
            {
                id: 'hint', kind: 'text', name: '시험 안내', x: 8, y: 82, w: 84, h: 13, text: '부품은 편집에서 각각 선택\n동작 시험: 위는 표시, 아래는 버튼', purpose: '동작 구분', info: ''
            }
        ]
    };
    const transitions = [{
            id: 'open-example', fromScreen: screen.id, fromElement: 'action-card', event: 'click', action: 'feedback', condition: 'always', label: '상점 열기 시험', payload: {
                message: '상점 버튼의 입력을 받았습니다 · 실제 게임 실행 없음'
            }
        }];
    decomposeImageFrame(screen, screen.elements[1], transitions);
    decomposeImageFrame(screen, screen.elements[2], transitions);
    return {
        schemaVersion: 2, projectId: id, revision: 0, name: '세부 와이어프레임 · 이미지와 프레임', entryScreen: screen.id, screens: [screen], transitions, fixtures: {
            balance: 0, items: []
        }
    };
}
