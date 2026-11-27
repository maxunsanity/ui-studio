import { constructGameUI } from './skins.mjs';
import { createUnit, overlayTemplate, applyWireframeStyle } from './units.mjs';
import { moduleBinding, bindFeature } from './bindings.mjs';
export function createLobbyDesign(catalog, projectId) {
    const { common } = catalog, w = common.layout.width, h = common.layout.height, els = [], source = 'data/simulator/mobile-frame.json';
    const add = (id, name, x, y, width, height, text, kind = 'panel') => {
        const e = createUnit(kind === 'button' ? 'button-rounded' : kind === 'text' ? 'body' : 'panel-rounded', id);
        Object.assign(e, {
            name, kind, x: x / w * 100, y: y / h * 100, w: width / w * 100, h: height / h * 100, text, purpose: name, info: '공통 설정 기반 편집용 배치 초안 · 현재 로비 실측 확정값 아님', sourceRef: source
        });
        els.push(e);
        return e;
    };
    const footer = common.layout.bottomMenu, menus = common.menus, rows = Math.max(...menus.map(m => m.row || 1)), menuHeight = footer.rowHeight * rows + footer.rowGap * (rows - 1) + footer.paddingTop + footer.paddingBottom + footer.borderWidth;
    const fillerHeight = common.layout.review.fillerHeight, actionsHeight = common.layout.review.actionsHeight, header = 54, gauges = 60, info = 40, boardHeight = h - header - gauges - info - fillerHeight - actionsHeight - menuHeight;
    if (boardHeight <= 0)
        throw Error('공통 화면 높이를 확인하세요.');
    add('lobby-title', '로비 제목', 10, 3, w - 20, 20, '로비 · 공통 UI 설계', 'text');
    common.currencies.forEach((q, i) => add('currency-' + q.key, q.label, 10 + i * (w - 20) / 3, 28, (w - 26) / 3, 22, q.label + '  —'));
    common.gauges.forEach((q, i) => add('gauge-' + q.key, q.label, 10 + i * (w - 20) / 3, header + 4, (w - 26) / 3, gauges - 8, q.label + '\n값 연결 영역'));
    common.information.forEach((q, i) => add('info-' + q.key, q.label, 10 + i * (w - 20) / 3, header + gauges + 4, (w - 26) / 3, info - 8, q.label, 'button'));
    let y = header + gauges + info;
    const world = add('slot-world', '3D 도시·보드 영역', 0, y, w, boardHeight, '3D 도시·보드 자리\n편집기에서는 3D를 읽지 않습니다');
    world.binding = {
        type: 'content-slot', slot: 'world'
    };
    world.appearance.fill = '#e3e8ed';
    y += boardHeight;
    const filler = add('slot-filler', '필러·대사 연출 영역', 0, y, w, fillerHeight, '필러 · 대사 · 결과 연출 자리');
    filler.binding = {
        type: 'content-slot', slot: 'filler'
    };
    y += fillerHeight;
    add('record', '기록장', 10, y + 5, 80, 24, '기록장', 'button');
    add('news', '소식', 100, y + 5, 80, 24, '소식', 'button');
    add('roll', '굴리기', 20, y + 34, w - 40, actionsHeight - 40, '굴리기 · 동작 연결 정의', 'button');
    y += actionsHeight;
    const columns = footer.columns;
    for (let row = 1; row <= rows; row++) {
        let column = 0;
        for (const m of menus.filter(m => (m.row || 1) === row)) {
            const width = w * (m.columnSpan || 1) / columns;
            const e = add('menu-' + m.id, m.label, column / columns * w, y + footer.paddingTop + (row - 1) * (footer.rowHeight + footer.rowGap), width, footer.rowHeight, m.label, 'button');
            column += m.columnSpan || 1;
            const feature = catalog.modules.find(q => q.id === m.moduleId || q.aliases.includes(m.moduleId));
            if (feature)
                e.binding = moduleBinding(feature);
        }
    }
    const d = {
        schemaVersion: 1, projectId, revision: 0, name: '로비 · 공통 UI 설계', entryScreen: 'lobby-common', screens: [{
                id: 'lobby-common', moduleId: 'simulator_module_dice', name: '로비', kind: 'page', purpose: '현재 공통 화면 구성을 사용한 UI 배치 초안.3D/게임 상태를 불러오지 않습니다.', elements: els
            }], transitions: [], fixtures: {
            balance: 0, items: []
        }, sourceRefs: catalog.sourceRefs, designBasis: {
            type: 'common-frame-config', logicalSize: {
                width: w, height: h
            }, status: 'draft-layout-not-measured-lobby', notes: '필러/진행/하단메뉴 높이는 공통 설정,상단/정보/도시 잔여배치는 편집용 제안. 실제 게임 원본 복사 아님.'
        }
    };
    const modal = overlayTemplate('modal', 'common-info');
    modal.name = '공통 정보';
    d.screens.push(modal);
    d.transitions.push({
        id: 'info-close', fromScreen: modal.id, fromElement: modal.elements.at(-1).id, event: 'click', action: 'close', condition: 'always', label: '닫기', returnPolicy: '화면 유지'
    });
    for (const e of els) {
        if (e.binding?.type === 'simulator-module') {
            const f = catalog.modules.find(q => q.id === e.binding.moduleId);
            bindFeature(d, 'lobby-common', e.id, f);
        }
        else if (e.id.startsWith('info-'))
            d.transitions.push({
                id: 'open-' + e.id, fromScreen: 'lobby-common', fromElement: e.id, event: 'click', action: 'open', condition: 'always', targetScreen: modal.id, label: e.name + ' 보기', returnPolicy: '원래 화면 유지'
            });
        else if (e.kind === 'button')
            e.intentionalNoAction = true;
    }
    return constructGameUI(applyWireframeStyle(d), d.entryScreen);
}
