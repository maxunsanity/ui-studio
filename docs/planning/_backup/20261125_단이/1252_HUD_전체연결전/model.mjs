import {UNLINKED_MESSAGE} from './feedback-notice.mjs';
import {canOverlayInput,openOverlay,closeOverlay,blockingOverlayIndex} from './overlay-runtime.mjs';
import { adjustTransform } from './rect-transform.mjs';
import {validateResponsiveScreen,resolveResponsiveRect} from './responsive-layout.mjs';
import { validateSkin } from './skins.mjs';
import { validateParts, inputOwner } from './parts.mjs';
import { validateMenu, menuIsOpen, hiddenByMenu } from './menu-state.mjs';
import { validateBinding, requestFromTransition } from './bindings.mjs';
import { validateAppearance, validatePresentation } from './units.mjs';
import { validateControl, validateControlGroups, createControlState, updateControlValue, controlInteractive, hiddenByTabs } from './controls.mjs';
import {validateEffects} from './visual-effects.mjs';
import {validateNotification} from './notification.mjs';
import {validateButtonStates,createButtonSelections,toggleButtonSelection} from './button-state.mjs';
export const MAX_DOCUMENT_BYTES = 2000000;
export async function readDesignFile(file) {
    if (!file || !Number.isFinite(file.size) || file.size < 0 || file.size > MAX_DOCUMENT_BYTES)
        throw Error('설계 파일은 2MB 이하로 가져오세요.');
    return validateDocument(JSON.parse(await file.text()));
}
export const clone = value => structuredClone(value);
export const CONDITIONS = ['always', 'hasSelection', 'hasFunds', 'noFunds', 'responseSuccess', 'responseFailure', 'responseTimeout', 'unknown'];
export const ACTIONS = ['navigate', 'back', 'open', 'close', 'select', 'filter', 'purchase', 'feedback', 'module'];
export const KINDS = ['panel', 'text', 'button', 'list', 'card', 'image'];
const safeId = id => typeof id === 'string' && /^[\p{L}\p{N}_.:-]{1,128}$/u.test(id);
export function validateDocument(d) {
    const fail = message => {
        throw new Error(message);
    };
    if (!d || ![1, 2, 3, 4].includes(d.schemaVersion) || !/^[a-z][a-z0-9-]{0,47}$/.test(d.projectId || ''))
        fail('설계 버전 또는 프로젝트 ID가 올바르지 않습니다.');
    if (!Number.isSafeInteger(d.revision) || d.revision < 0 || typeof d.name !== 'string' || !d.name.trim())
        fail('이름·저장 버전을 확인해 주세요.');
    if (!Array.isArray(d.screens) || d.screens.length < 1 || d.screens.length > 60 || !Array.isArray(d.transitions) || d.transitions.length > 4000)
        fail('화면/연결 목록 범위를 확인해 주세요.');
    const screens = new Map(), elements = new Set();
    for (const s of d.screens) {
        if (!safeId(s.id) || screens.has(s.id) || !['page', 'modal', 'toast', 'sheet'].includes(s.kind) || typeof s.name !== 'string')
            fail('화면 ID·이름·종류를 확인해 주세요.');
        if(s.canvasPosition!==undefined && (!s.canvasPosition || !['x','y'].every(k=>Number.isFinite(s.canvasPosition[k])&&s.canvasPosition[k]>=0&&s.canvasPosition[k]<=10000)))fail('캔버스 화면 위치가 올바르지 않습니다.');
        validatePresentation(s.presentation);
        validateSkin(s.skin);
        screens.set(s.id, s);
        if (!Array.isArray(s.elements) || s.elements.length > 400)
            fail('요소 목록 범위를 확인해 주세요.');
        const local = new Map(), slots = new Set();
        for (const e of s.elements) {
            if (!safeId(e.id) || elements.has(e.id) || !KINDS.includes(e.kind) || typeof e.name !== 'string')
                fail('요소 ID 중복 또는 종류 오류입니다.');
            if (e.rectTransform !== undefined && d.schemaVersion !== 4)
                fail('앵커 편집 연결이 준비 중입니다. 현재 형식에서는 앵커 설계를 가져오거나 저장할 수 없습니다.');
            validateMenu(e.layout?.type!==undefined?{...e,layout:undefined}:e);
            validateParts(e);
            validateSkin(e.skin);
            if (e.inset !== undefined && (!Array.isArray(e.inset) || e.inset.length !== 4 || e.inset.some(n => !Number.isFinite(n) || Math.abs(n) > 10000)))
                fail('부모 맞춤 여백 형식 오류');
            validateAppearance(e.appearance);
            validateEffects(e.effects);
            validateNotification(e.notification);
            validateControl(e.control);
            validateBinding(e.binding);
            if (e.binding?.type === 'content-slot') {
                if (slots.has(e.binding.slot))
                    fail('같은 콘텐츠 영역은 화면에 한 개만 연결할 수 있습니다.');
                slots.add(e.binding.slot);
            }
            elements.add(e.id);
            local.set(e.id, e);
            for (const key of ['x', 'y', 'w', 'h'])
                if (!Number.isFinite(e[key]) || Math.abs(e[key]) > 10000 || (['w', 'h'].includes(key) && e[key] <= 0))
                    fail('위치·크기는 유효한 숫자여야 합니다.');
            for (const key of ['name', 'text', 'purpose', 'info'])
                if (e[key] != null && (typeof e[key] !== 'string' || e[key].length > 10000))
                    fail('요소 설명 형식이 올바르지 않습니다.');
        }
        validateControlGroups(s);
        validateButtonStates(s,d.transitions);
        for (const e of s.elements) {
            const seen = new Set([e.id]);
            let p = e.parentId;
            while (p) {
                if (!local.has(p) || seen.has(p))
                    fail('부모 요소 누락 또는 순환입니다.');
                seen.add(p);
                p = local.get(p).parentId;
            }
        }
        if(d.schemaVersion!==4&&(s.safeArea!==undefined||s.elements.some(e=>e.useSafeArea!==undefined||e.layout?.type!==undefined||e.overflow!==undefined||e.scrollPin!==undefined||e.scrollbar!==undefined)))fail('응답형 배치는 설계 버전 4에서 지원합니다.');
        validateResponsiveScreen(s,{requireLogicalSize:d.schemaVersion===4});
    }
    if (!screens.has(d.entryScreen) || screens.get(d.entryScreen).kind !== 'page')
        fail('처음 열 화면이 없습니다.');
    const ids = new Set(), timedScreens = new Set();
    for (const t of d.transitions) {
        if (!safeId(t.id) || ids.has(t.id) || !screens.has(t.fromScreen) || !screens.get(t.fromScreen).elements.some(e => e.id === t.fromElement))
            fail('연결의 출발 요소 또는 ID가 올바르지 않습니다.');
        ids.add(t.id);
        if (t.event !== 'click' || !ACTIONS.includes(t.action) || !CONDITIONS.includes(t.condition))
            fail('지원하지 않는 행동·조건입니다.');
        if (t.autoAfterMs !== undefined) {
            if (!Number.isInteger(t.autoAfterMs) || t.autoAfterMs < 100 || t.autoAfterMs > 30000
                || timedScreens.has(t.fromScreen) || t.condition !== 'always' || !['navigate','open','close'].includes(t.action)
                || t.targetScreen === t.fromScreen) fail('자동 연결의 시간과 대상을 확인해 주세요.');
            timedScreens.add(t.fromScreen);
        }
        if ((['navigate', 'open'].includes(t.action) || (t.action === 'feedback' && t.targetScreen)) && !screens.has(t.targetScreen) && !(t.condition === 'unknown' && !t.targetScreen))
            fail('연결 대상 화면이 없습니다.');
        if (t.action === 'purchase' && t.targetScreen && (!screens.has(t.targetScreen) || screens.get(t.targetScreen).kind === 'page'))
            fail('구매 완료 창을 확인해 주세요.');
        if (t.action === 'module')
            requestFromTransition(t);
        if (t.payload != null && (typeof t.payload !== 'object' || Array.isArray(t.payload)))
            fail('전달값은 객체여야 합니다.');
        for (const [key, action] of [['replaceOverlay', 'open'], ['replacePage', 'navigate'], ['closeAllOverlays', 'close']]) {
            if (t.payload?.[key] !== undefined && (t.action !== action || typeof t.payload[key] !== 'boolean')) fail('화면 교체 행동을 확인해 주세요.');
        }
        if (t.payload?.replaceOverlay && (screens.get(t.fromScreen).kind === 'page' || screens.get(t.targetScreen)?.kind === 'page'))
            fail('교체하는 창의 출발과 도착 유형을 확인해 주세요.');
        if (t.payload?.pageAfter !== undefined && (t.action !== 'open' || screens.get(t.payload.pageAfter)?.kind !== 'page'))
            fail('창을 열면서 표시할 페이지를 확인해 주세요.');
        if (t.payload?.filterControls !== undefined) {
            const filters = t.payload.filterControls;
            const dialog = screens.get(t.action === 'open' ? t.targetScreen : t.fromScreen);
            if (!['open','close'].includes(t.action) || !filters || typeof filters !== 'object' || Array.isArray(filters) ||
                !Object.keys(filters).length || Object.entries(filters).some(([id,label]) =>
                    typeof label !== 'string' || !label || !dialog?.elements.some(e => e.id === id && e.control?.type === 'toggle')))
                fail('적용할 속성 체크 규칙을 확인해 주세요.');
        }
        if (t.payload?.controlUpdates !== undefined) {
            const updates = t.payload.controlUpdates;
            if (!updates || typeof updates !== 'object' || Array.isArray(updates))
                fail('연결에서 갱신할 컨트롤 값을 확인해 주세요.');
            for (const [id, fields] of Object.entries(updates)) {
                const target = screens.get(id);
                if (!target || !fields || typeof fields !== 'object' || Array.isArray(fields))
                    fail('갱신 대상 화면과 컨트롤 목록을 확인해 주세요.');
                for (const [elementId, value] of Object.entries(fields)) {
                    const element = target.elements.find(e => e.id === elementId && e.control);
                    if (!element || !updateControlValue(target, {}, element, value, 'change', {authored:true}))
                        fail('갱신할 컨트롤의 값을 확인해 주세요.');
                }
            }
        }
        if (t.payload?.initialControls !== undefined) {
            const initial = t.payload.initialControls;
            if (t.action !== 'open' || !initial || typeof initial !== 'object' || Array.isArray(initial))
                fail('창을 열 때의 초기 컨트롤 값을 확인해 주세요.');
            const target = screens.get(t.targetScreen);
            for (const [id, value] of Object.entries(initial)) {
                const control = target?.elements.find(e => e.id === id && e.control);
                if (!control || !updateControlValue(target, {}, control, value))
                    fail('창의 초기 컨트롤을 확인해 주세요.');
            }
        }

    }
    if (!d.fixtures || !Array.isArray(d.fixtures.items) || (!Number.isFinite(d.fixtures.balance) || d.fixtures.balance < 0))
        fail('시험 데이터가 없습니다.');
    const itemIds = new Set();
    for (const i of d.fixtures.items) {
        if (typeof i.id !== 'string' || itemIds.has(i.id) || typeof i.name !== 'string' || !Number.isFinite(i.price) || i.price < 0)
            fail('시험 상품 데이터를 확인해 주세요.');
        if (i.images !== undefined) {
            if (!i.images || typeof i.images !== 'object' || Array.isArray(i.images) || Object.keys(i.images).length > 12)
                fail('시험 이미지 목록 형식 오류');
            for (const [key, image] of Object.entries(i.images)) {
                if (!/^[a-z][a-z0-9_-]{0,39}$/.test(key)) fail('선택 자원 키 형식 오류');
                if (!image?.assetRef) fail('시험 이미지는 프로젝트 자원을 사용하세요.');
                validateParts({kind:'image',image});
            }
        }
        itemIds.add(i.id);
    }
    return d;
}
// Legacy draft entry accepts explicit per-screen validation sizes; public v4 uses screen.logicalSize.
export function validateAnchorDraft(d, screenSizes) {
    if (d?.schemaVersion !== 4)
        throw Error('앵커 초안은 설계 버전 4여야 합니다.');
    const copy = clone(d);
    for (const screen of copy.screens || []) {
        const size = screenSizes?.[screen.id];
        if (!size || ![size.w, size.h].every(n => Number.isFinite(n) && n > 0))
            throw Error('각 화면의 실제 검증 크기를 지정하세요.');
        screen.logicalSize = {...size};
    }
    validateDocument(copy);
    return d;
}
export function screenById(d, id) {
    return d.screens.find(s => s.id === id);
}
export function resolveRect(s, id, width, height) {
    return resolveResponsiveRect(s,id,width,height);
}
export function adjustRect(e, dx, dy, parentW, parentH, resize = false, snap = 1) {
    const quant = v => snap ? Math.round(v / snap) * snap : v;
    const result = {
        ...e
    };
    if (e.rectTransform) {
        result.rectTransform = adjustTransform({x:0,y:0,w:parentW,h:parentH}, e.rectTransform, quant(dx), quant(dy), resize);
        return result;
    }
    if (e.inset) {
        const [t, r, b, l] = e.inset;
        result.inset = resize ? [t, r - dx, b - dy, l] : [t + dy, r - dx, b - dy, l + dx];
        return result;
    }
    if (resize) {
        result.w = Math.max(1, quant(e.w + dx / parentW * 100));
        result.h = Math.max(1, quant(e.h + dy / parentH * 100));
    }
    else {
        result.x = quant(e.x + dx / parentW * 100);
        result.y = quant(e.y + dy / parentH * 100);
    }
    return result;
}
export function audit(d) {
    const notes = [];
    const reachable = new Set([d.entryScreen]);
    let changed = true;
    while (changed) {
        changed = false;
        for (const t of d.transitions)
            if (reachable.has(t.fromScreen) && t.targetScreen && !reachable.has(t.targetScreen)) {
                reachable.add(t.targetScreen);
                changed = true;
            }
    }
    for (const s of d.screens) {
        if (!reachable.has(s.id))
            notes.push({
                screen: s.id, text: s.name + '에 진입 연결이 없습니다.'
            });
        for (const e of s.elements)
            if (inputOwner(s, e.id, d.transitions)?.id === e.id && !e.control && !e.menu && !e.intentionalNoAction && !d.transitions.some(t => t.fromElement === e.id))
                notes.push({
                    screen: s.id, element: e.id, text: e.name + '의 행동이 없습니다.'
                });
        if (['modal', 'sheet'].includes(s.kind) && !d.transitions.some(t => t.fromScreen === s.id && t.action === 'close'))
            notes.push({
                screen: s.id, text: s.name + '의 닫기/복귀가 없습니다.'
            });
    }
    for (const t of d.transitions)
        if (['navigate', 'open'].includes(t.action) && !t.targetScreen)
            notes.push({
                screen: t.fromScreen, element: t.fromElement, text: (t.label || t.id) + ' 대상 UI가 미정입니다.'
            });
    for (const t of d.transitions)
        if (t.condition === 'unknown')
            notes.push({
                screen: t.fromScreen, element: t.fromElement, text: (t.label || t.id) + ' 조건이 미정입니다.'
            });
    return notes;
}
export function createRuntime(d) {
    return {
        ...createControlState(d.screens), ...createButtonSelections(d.screens), menuOpen: {}, page: d.entryScreen, overlays: [], overlayQueue: [], focusStack: [], history: [], contexts: {}, selection: null, filter: 'all', scroll: {}, balance: d.fixtures.balance, response: 'success', pending: false, lastAction: null, message: '', focusReturn: null, trace: [], events: [], visits: [d.entryScreen]
    };
}
export function changeControl(d, r, screenId, elementId, value, { event = 'change' } = {}) {
    const next = clone(r);
    next.lastAction = null;
    const screen = screenById(d, screenId), element = screen?.elements.find(e => e.id === elementId);
    if (!element?.control || !controlInteractive(element) || next.pending || hiddenByMenu(screen, elementId, next.menuOpen) || hiddenByTabs(screen,elementId,next)) return next;
    if (!canOverlayInput(d,next,screenId)) return next;
    const result = updateControlValue(screen, next, element, value, event);
    if (!result) return next;
    Object.assign(next, result);
    next.events.push({ ...next.lastAction, balance: r.balance, response: r.response });
    if (next.events.length > 300) next.events.shift();
    log(next, element.name + ' 값 변경', { screen: screenId, element: elementId, value, event });
    return next;
}
export function conditionResult(condition, r, d) {
    const item = d.fixtures.items.find(i => i.id === r.selection);
    return ({
        always: true, hasSelection: !!item, hasFunds: !!item && r.balance >= item.price, noFunds: !!item && r.balance < item.price, responseSuccess: r.response === 'success', responseFailure: r.response === 'failure', responseTimeout: r.response === 'timeout', unknown: null
    })[condition];
}
function log(r, text, extra = {}) {
    r.trace.push({
        step: r.trace.length + 1, text, ...extra
    });
    if (r.trace.length > 150)
        r.trace.shift();
}
export function activate(d, r, screenId, elementId) {
    const next = clone(r);
    next.lastAction = null;
    if (hiddenByTabs(screenById(d,screenId),elementId,next)) return next;
    const owner = inputOwner(screenById(d, screenId), elementId, d.transitions);
    if (!owner)
        return next;
    elementId = owner.id;
    if (owner.control && !controlInteractive(owner)) return next;
    if (owner.interaction?.enabled === false) {
        next.message = owner.interaction.reason || '현재 사용할 수 없습니다.';
        return next;
    }
    next.events.push({
        screen: screenId, element: elementId, balance: r.balance, response: r.response
    });
    if (next.events.length > 300)
        next.events.shift();
    if (next.pending) {
        log(next, '처리 중이어서 중복 입력을 막았습니다.');
        return next;
    }
    if (!canOverlayInput(d,next,screenId)) {
        log(next, '뒤에 있는 UI의 입력을 막았습니다.');
        return next;
    }
    const screen = screenById(d, screenId), element = screen?.elements.find(e => e.id === elementId);
    if (hiddenByMenu(screen, elementId, next.menuOpen)) {
        log(next, '접힌 메뉴 안의 입력을 막았습니다.');
        return next;
    }
    toggleButtonSelection(screen,element,next);
    if (element?.menu) {
        next.menuOpen ||= {};
        next.menuOpen[elementId] = !menuIsOpen(element, next.menuOpen);
        next.message = '';
        log(next, element.name + (next.menuOpen[elementId] ? ' 열기' : ' 닫기'));
        return next;
    }
    const links = d.transitions.filter(t => t.fromScreen === screenId && t.fromElement === elementId);
    let chosen;
    for (const t of links) {
        const result = conditionResult(t.condition, next, d);
        log(next, (t.label || t.id) + ' · 조건 ' + t.condition + ': ' + (result === null ? '미정' : result ? '참' : '거짓'), {
            transitionId: t.id
        });
        if (result === null) {
            next.message = '조건이 미정입니다. 연결·조건 탭에서 확인해 주세요.';
            return next;
        }
        if (result) {
            chosen = t;
            break;
        }
    }
    if (!chosen) {
        next.message = links.length ? '조건에 맞는 결과가 없습니다.' : UNLINKED_MESSAGE;
        log(next, next.message);
        return next;
    }
    const t = chosen;
    next.message = '';
    next.lastAction = null;
    next.focusReturn = elementId;
    if (t.payload?.itemId)
        next.selection = t.payload.itemId;
    switch (t.action) {
        case 'navigate':
            if (!t.payload?.replacePage) next.history.push({
                page: next.page, selection: next.selection, filter: next.filter, focusReturn: elementId
            });
            next.page = t.targetScreen;
            next.overlays = []; next.overlayQueue=[]; next.focusStack=[];
            next.visits.push(t.targetScreen);
            break;
        case 'back': {
            const before = next.history.pop();
            if (before) {
                Object.assign(next, before);
                next.overlays = []; next.overlayQueue=[]; next.focusStack=[];
            }
            else
                next.message = '돌아갈 화면이 없습니다.';
            break;
        }
        case 'open': {
            const wasOpen = next.overlays.includes(t.targetScreen);
            Object.assign(next,openOverlay(d,next,t.targetScreen,{trigger:elementId,replaceTop:t.payload?.replaceOverlay ? screenId : null}));
            if (!wasOpen && next.overlays.includes(t.targetScreen) && t.payload?.pageAfter) {
                next.page = t.payload.pageAfter;
                next.visits.push(next.page);
            }
            if (!wasOpen && next.overlays.includes(t.targetScreen) && t.payload?.initialControls) {
                const target = screenById(d,t.targetScreen);
                for (const control of target.elements.filter(e => e.control && Object.hasOwn(t.payload.initialControls,e.id))) {
                    const updated = updateControlValue(target,next,control,t.payload.initialControls[control.id]);
                    if (updated) {
                        next.controlValues = updated.controlValues;
                        next.controlValidity = updated.controlValidity;
                    }
                }
            }
            break;
        }
        case 'close':
            Object.assign(next,closeOverlay(d,next,screenId));
            if (t.payload?.closeAllOverlays && r.overlays.at(-1) === screenId && !next.overlays.includes(screenId)) {
                next.overlays = []; next.overlayQueue = []; next.focusStack = [];
                next.focusReturn = r.focusStack[0] ?? null;
            }
            break;
        case 'module':
            next.lastAction = requestFromTransition(t);
            next.message = (t.payload?.label || '게임 기능') + ' 연결 요청 · UI 시험 모드 (게임 실행 없음)';
            break;
        case 'select': break;
        case 'filter':
            next.filter = t.payload?.value || 'all';
            break;
        case 'feedback':
            next.message = t.payload?.message || '시험 안내';
            break;
        case 'purchase':
            if (!next.selection) {
                next.message = '선택한 상품이 없습니다.';
            }
            else {
                next.pending = true;
                if (t.targetScreen) next.purchaseResult = t.targetScreen;
                next.message = '시험 요청 처리 중…';
                log(next, '시험 요청 대기 · 실제 결제는 실행하지 않습니다.');
            }
            break;
    }
    const completed = t.action === 'open' ? next.overlays.includes(t.targetScreen) && !r.overlays.includes(t.targetScreen)
        : t.action === 'close' ? r.overlays.includes(screenId) && !next.overlays.includes(screenId)
        : t.action === 'back' ? r.history.length > next.history.length : true;
    const filters = completed && t.payload?.filterControls;
    if (filters && t.action === 'close') {
        next.attributeFilter = [...new Set(Object.entries(filters)
            .filter(([elementId]) => next.controlValues?.[screenId]?.[elementId])
            .map(([,label]) => label))];
    }
    if (filters && t.action === 'open') {
        const target = screenById(d,t.targetScreen);
        for (const [elementId,label] of Object.entries(filters)) {
            const element = target.elements.find(e => e.id === elementId);
            const updated = updateControlValue(target,next,element,next.attributeFilter?.includes(label) ?? false,'change',{authored:true});
            next.controlValues = updated.controlValues;
            next.controlValidity = updated.controlValidity;
        }
    }
    if (completed) for (const [id, fields] of Object.entries(t.payload?.controlUpdates || {})) {
        const target = screenById(d,id);
        for (const [elementId,value] of Object.entries(fields)) {
            const element = target.elements.find(e => e.id === elementId);
            const updated = updateControlValue(target,next,element,value,'change',{authored:true});
            next.controlValues = updated.controlValues;
            next.controlValidity = updated.controlValidity;
        }
    }
    return next;
}
export function settlePurchase(d, r) {
    const next = clone(r);
    if (!next.pending)
        return next;
    next.pending = false;
    const resultScreen = next.purchaseResult;
    delete next.purchaseResult;
    const item = d.fixtures.items.find(i => i.id === next.selection);
    if (!item)
        next.message = '선택한 상품이 없습니다.';
    else if (next.balance < item.price)
        next.message = '시험 잔액이 부족합니다.';
    else if (next.response === 'failure')
        next.message = '시험 요청 실패 · 다시 시도할 수 있습니다.';
    else if (next.response === 'timeout')
        next.message = '시험 요청 시간 초과 · 다시 시도할 수 있습니다.';
    else {
        next.balance -= item.price;
        next.message = item.name + ' 시험 완료';
        const blockingIndex=blockingOverlayIndex(d,next);
        if(blockingIndex>=0)Object.assign(next,closeOverlay(d,next,next.overlays[blockingIndex]));
        if (resultScreen) {
            next.message = '';
            Object.assign(next,openOverlay(d,next,resultScreen));
        }
    }
    log(next, next.message, {
        result: next.response, itemId: next.selection
    });
    return next;
}
export function replayScenario(d, scenario) {
    if (scenario.projectId !== d.projectId || scenario.revision !== d.revision || !Array.isArray(scenario.result?.events) || scenario.result.events.length > 300)
        throw Error('설계 ID·저장 버전 또는 시험 기록이 맞지 않습니다.');
    let r = createRuntime(d);
    for (const e of scenario.result.events) {
        if (!Number.isFinite(e.balance) || e.balance < 0 || !['success', 'failure', 'timeout'].includes(e.response) || !screenById(d, e.screen)?.elements.some(n => n.id === e.element))
            throw Error('시험 사건 형식이 잘못되었습니다.');
        r.balance = e.balance;
        r.response = e.response;
        r = e.type === 'control-change' ? changeControl(d, r, e.screen, e.element, e.value, { event: e.event }) : activate(d, r, e.screen, e.element);
        if (r.pending)
            r = settlePurchase(d, r);
    }
    return r;
}

// Filtered rows temporarily own vertical position; saved layout remains unchanged.
export function filteredRowY(screen, element, items, filter, width, height) {
    if (!element.itemId || filter === 'all' || screen.elements.find(parent=>parent.id===element.parentId)?.layout?.type) return undefined;
    const categories = new Map(items.map(item => [item.id, item.category]));
    const rows = screen.elements.filter(e => e.parentId === element.parentId && e.itemId && categories.get(e.itemId) === filter);
    const index = rows.findIndex(e => e.id === element.id);
    if (index < 0) return undefined;
    const parentHeight = element.parentId ? resolveRect(screen, element.parentId, width, height).h : height;
    return 2 + rows.slice(0,index).reduce((sum,e) => sum + resolveRect(screen,e.id,width,height).h / parentHeight * 100 + 3, 0);
}
