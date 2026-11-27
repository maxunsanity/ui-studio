import {bindSelectedCopy,bindSelectedImages} from './bindings.mjs';
import {renderFeedbackNotice} from './feedback-notice.mjs';
import {buildHandoff,handoffMarkdown} from './handoff.mjs';
import {overlayBaseHiddenElements,overlayPolicy,overlayMotion,overlayRootSize,closeOverlay,escapeOverlay,createOverlayTimers,syncOverlayFocus,trapOverlayFocus} from './overlay-runtime.mjs';
import {attachControls} from './controls.mjs';
import {DEVICE_PROFILES as profiles,canvasDevicePreview} from './canvas-device-preview.mjs';
import {BUTTON_STATES,createButtonState,buttonStateOwner,buttonMotionTargets} from './button-state.mjs';
import {changeControl} from './model.mjs';
import {projectContext,designURL} from './project-context.mjs';
import {presentationModesFor,normalizePresentationMode,presentationScreen,renderPresentation} from './presentation.mjs';
import {mountSampleScreen,mountSamplePreview,sampleSize,sampleFit} from './sample-preview.mjs';
import {assetSource, assetUrl} from './asset-reference.mjs';
import {uploadImageAsset, copyDocumentAssets} from './asset-client.mjs';
import {applyControlConfig,controlInspectorHTML,applyTabTexture} from './control-inspector.mjs';
import {createNotification} from './notification.mjs';
import {convertPageToModal} from './screen-conversion.mjs';
// Canonical source: independent UI스튜디오 project.
import { scopeURL, scopedKey, emptyDesign, openProjectManager } from './project-manager.mjs';
import { openManual } from './manual.mjs';
import {openDesignGuide} from './design-guide-view.mjs';
import {applyDesignGuideChange,importGuideImage} from './design-guide-edit.mjs';
import {responsiveInspectorHTML,applyResponsiveEdit} from './responsive-inspector.mjs';
import {percentRectEditable,isAutoLayoutChild,responsiveStyles} from './responsive-layout.mjs';
import { SKINS, SKIN_ASSETS, SKIN_STATES, skinSource, createSkin, applySkin, constructGameUI } from './skins.mjs';
import { PART_ROLES, INPUT_MODES, inputMode, inputOwner, componentRoot, editTarget, decomposeImageFrame, validateImageRegion, readImageFile, createPartsDemo, acceptsEvent } from './parts.mjs';
import { createFlowView } from './graph-view.mjs';
import { pushSnapshot, commitDocumentEdit } from './history.mjs';
import { snapPanel, dockTarget } from './snap.mjs';
import { wrapMenu, arrangeChildren } from './menu-layout.mjs';
import { wheelValue } from './menu-state.mjs';
import './styles.css';
import './presentation.css';
import { nudgeSelection, removeSelection, copySelection, pasteSelection, groupSelection, ungroupSelection, removeScreen } from './commands.mjs';
import { indexLayers, matchingLayers, isContainer, descendants, isolationSets, moveInto, parentSize, transformValue, transformDisplayValue, alignElement, reorderSiblings } from './layers.mjs';
import { PANEL_IDS, PANEL_NAMES, groupsFor, clampPanel, cleanWorkspace, paneWidths, movePanel, dockSide } from './workspace.mjs';
import { renderLayout,applyOverlayRoot } from './layout-view.mjs';
import {attachScrollPins,disposeScrollPins} from './scroll-pin.mjs';
import { GROUP_LABELS, bindFeature } from './bindings.mjs';
import { createLobbyDesign } from './lobby.mjs';
import { UNITS, SHAPES, EFFECTS, updateOverlayPresentation, createUnit, overlayTemplate, dropPosition, flowData, applyWireframeStyle } from './units.mjs';
import { attachEditor } from './editor.mjs';
import { selectionDescriptionHTML } from './inspector-description.mjs';
import {mountPlanningPanel,mountPlanningActions} from './planning-panel.mjs';
import { readDesignFile, clone, validateDocument, screenById, resolveRect, filteredRowY, adjustRect, audit, createRuntime, activate, settlePurchase, replayScenario, CONDITIONS, ACTIONS, KINDS } from './model.mjs';
const workspaceId = new URLSearchParams(location.search).get('workspace') || null;
let presentationMode = normalizePresentationMode(new URLSearchParams(location.search).get('view'),workspaceId);
const lastProjectKey = scopedKey('ux-studio.last-project', workspaceId);
let folderProject = null, projectSwitchAllowed = false, studioSettings = {catalogEnabled: false};
const $ = s => document.querySelector(s), esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));
const actionNames = {
    module: '게임 기능 연결', navigate: '화면 이동', back: '이전 화면', open: '겹쳐 열기', close: '닫기', select: '선택값 변경', filter: '목록 필터', purchase: '시험 요청', feedback: '안내 표시'
};
const conditionNames = {
    always: '항상', hasSelection: '상품 선택됨', hasFunds: '시험 잔액 충분', noFunds: '시험 잔액 부족', responseSuccess: '응답 성공', responseFailure: '응답 실패', responseTimeout: '시간 초과', unknown: '미정'
};
const kinds = {
    panel: '영역', text: '텍스트', button: '버튼', list: '스크롤 목록', card: '카드', image: '이미지 자리'
};
let doc, expectedRevision = null, selectedScreen = 'lobby', selectedElement = null, tab = 'general', mode = 'edit', profile = 'design', zoom = 'fit', grid = false, snap = true, dirty = false, undo = [], redo = [], runtime, saveBusy = false, flowOpen = false, flowFull = false, status = '', projects = [], search = '', timer = null, runEpoch = 0, glossary = [], showGlossary = false;
let spaceDown = false, handTool = false, viewMemory = null, resetView = false, zoomAnchor = null;
let overlayAutoTimer, overlayAutoKey = '', leaving = false;
let demoRootMode = 'window';
let demoHideBase = [];
let activeRuntimeModal=null;
const runtimeOverlayTimers=createOverlayTimers({getDesign:()=>doc,getRuntime:()=>runtime,onChange:next=>{runtime=next;followRuntime();render();}});
let internalClipboard = null, showShortcuts = false;
let palette = 'features', unitGroup = '전체', unitSearch = '', treeTab = 'screens', selectedIds = [], previewBase = 'lobby', overlayChoice = 'help', demoKind = 'modal', demoEffect = 'fade', demoDuration = 240, demoDim = true, demoAuto = 0, demoOverlay = null, demoTimer, disposeEditor = () => {
};
let featureCatalog = null, featureLoading = false, featureError = '', featureSearch = '';
const designChannel = 'BroadcastChannel' in window ? new BroadcastChannel('ux-studio-design') : null;
let menuState = {}, wheelRun = null, wheelFrame = 0;
let cachedLayerBrowser = null;
let skinState = 'normal';
let buttonPreview = 'normal';
let editingComponent = null, assetView = 'art', inspectInput = true;
let workspaceAssets = [];
let activeTool = 'select', toolGroup = null, transformUnit = 'px', isolated = [], insertParentId = null;
const collapsedLayers = new Set();
let workspacePrefs;
try {
    workspacePrefs = cleanWorkspace(JSON.parse(localStorage.getItem('ux-studio.workspace') || '{}'));
}
catch {
    workspacePrefs = cleanWorkspace();
}
let floatingZ = 170;
grid = workspacePrefs.guides;
const app = $('#app');
function disposePreviewPins(){for(const node of app.querySelectorAll('.preview-screen,.preview-overlay'))disposeScrollPins(node);}
function focusPanel(id) {
    palette = id;
    if (workspacePrefs.bottomPanels.includes(id))
        workspacePrefs.bottomActive = id;
    else if (workspacePrefs.leftPanels.includes(id))
        workspacePrefs.leftActive = id;
    else
        workspacePrefs.groups.forEach((g, i) => {
            if (g.includes(id))
                workspacePrefs.active[i] = id;
        });
    if (workspacePrefs.floats[id])
        workspacePrefs.floats[id].z = ++floatingZ;
}
function showLayerPanel() {
    focusPanel('layer');
}
function selection() {
    return screenById(doc, selectedScreen)?.elements.find(e => e.id === selectedElement);
}
function checkpoint() {
    wheelRun = null;
    pushSnapshot(undo, clone(doc));
    redo = [];
}
function edited(fn) {
    try {
        commitDocumentEdit(() => doc, value => { doc = value; }, fn, undo, redo);
    } catch (error) {
        status = `변경하지 못했습니다: ${error.message}`;
        render();
        return false;
    }
    wheelRun = null;
    dirty = true;
    status = '';
    render();
    return true;
}
let baselineItems = [], baselineStage = 'W', baselineBusy = false;
const baselineLabels = {W: '와이어프레임', P: '프로토타입', U: '완성 UI'};
function setDoc(d, revision) {
    baselineItems = [];
    wheelRun = null;
    menuState = {};
    editingComponent = null;
    validateDocument(d);
    doc = clone(d);
    expectedRevision = revision;
    selectedScreen = d.entryScreen;
    isolated = [];
    insertParentId = null;
    activeTool = 'select';
    resetView = true;
    previewBase = d.entryScreen;
    selectedElement = null;
    selectedIds = [];
    overlayChoice = d.screens.find(s => s.kind !== 'page')?.id || 'builtin:modal';
    loadOverlaySettings(screenById(doc,overlayChoice));
    undo = [];
    redo = [];
    dirty = false;
    if (d.screens.find(s => s.id === d.entryScreen)?.elements.some(e => e.component === 'game-ui')) {
        const screen = screenById(doc, d.entryScreen);
        selectedElement = screen.elements.find(e => e.id === 'menu-shop')?.id || screen.elements.find(e => e.component === 'game-ui').id;
        selectedIds = [selectedElement];
        treeTab = 'layers';
        mode = 'edit';
        showLayerPanel();
        for (const e of screen.elements.filter(e => e.component === 'game-ui'))
            if (e.id !== selectedElement)
                collapsedLayers.add(e.id);
    }
    resetRuntime();
}
function resetRuntime() {
    runtimeOverlayTimers.reset();
    clearTimeout(overlayAutoTimer);
    overlayAutoKey = '';
    leaving = false;
    clearTimeout(timer);
    clearTimeout(demoTimer);
    demoOverlay = null;
    runEpoch++;
    runtime = createRuntime(doc);
}
function notify(text) {
    status = text;
    render();
}
async function api(path, options, targetWorkspaceId = workspaceId) {
    const response = await fetch(scopeURL('/api/ux-studio/' + path, targetWorkspaceId), {
        cache: 'no-store', ...options
    });
    let body;
    try {
        body = await response.json();
    }
    catch {
        throw Error('저장 서버의 응답을 읽지 못했습니다. 실행 주소를 확인해 주세요.');
    }
    if (!response.ok)
        throw Error(body.error || '요청 실패');
    return body;
}
async function loadProjects() {
    try {
        projects = (await api('projects')).projects;
    }
    catch (e) {
        status = e.message;
    }
}
async function save() {
    if (saveBusy || baselineBusy)
        return false;
    let saved = false;
    wheelRun = null;
    saveBusy = true;
    status = '파일 저장 중…';
    render();
    const snapshot = clone(doc), before = JSON.stringify(doc);
    try {
        validateDocument(snapshot);
        const result = await api('project', {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                document: snapshot, expectedRevision
            })
        });
        const sameProject = doc.projectId === snapshot.projectId;
        if (sameProject) {
            expectedRevision = result.document.revision;
            if (JSON.stringify(doc) === before) {
                doc = result.document;
                dirty = false;
            }
            else {
                doc.revision = expectedRevision;
                dirty = true;
            }
            try {
                localStorage.setItem(lastProjectKey, doc.projectId);
            }
            catch {
            }
        }
        designChannel?.postMessage({
            type: 'design.saved', workspace: workspaceId, projectId: snapshot.projectId, revision: result.document.revision
        });
        status = (sameProject ? '파일 저장·재읽기 확인 완료 · r' : '이전 설계 파일 저장 완료 · r') + result.document.revision;
        await loadProjects();
        saved = doc.projectId === snapshot.projectId && expectedRevision === result.document.revision && !dirty;
    }
    catch (e) {
        status = e.message + ' 작업 중인 수정은 유지했습니다.';
    }
    finally {
        saveBusy = false;
        render();
    }
    return saved;
}
async function copyDesignToWorkspace(targetWorkspaceId) {
    if (!doc || !targetWorkspaceId) throw Error('현재 설계와 대상 프로젝트 폴더를 확인하세요.');
    const before = JSON.stringify(doc), copied = clone(doc);
    copied.projectId = 'ux-' + crypto.randomUUID().slice(0, 8);
    copied.revision = 0;
    copied.name += ' · 사본';
    validateDocument(copied);
    const hasAssets = copied.screens.some(screen => Object.values(screen.skin?.textures || {}).some(t => t.assetRef) || screen.elements.some(element => element.image?.assetRef || Object.values(element.buttonState?.images || {}).some(t=>t.assetRef) || Object.values(element.control?.tabSkin?.textures || {}).some(t=>t.assetRef) || Object.values(element.skin?.textures || {}).some(t => t.assetRef)));
    if (hasAssets) await copyDocumentAssets(copied, workspaceId, targetWorkspaceId);
    const result = await api('project', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({document: copied, expectedRevision: null})
    }, targetWorkspaceId);
    validateDocument(result.document);
    if (result.document.projectId !== copied.projectId) throw Error('사본 저장 응답의 설계 ID가 다릅니다.');
    if (JSON.stringify(doc) !== before) throw Error('저장 중 현재 설계가 바뀌었습니다. 대상 폴더의 사본 ' + copied.projectId + '을 확인하세요.');
    return result.document;
}
function showProjectManager() {
    return openProjectManager({workspaceId, isDirty: () => dirty, save,
        copyToWorkspace: doc ? copyDesignToWorkspace : null,
        guide: () => openManual({workspaceId}),
        navigate: id => {
            const url = new URL(location.href);
            if (id) url.searchParams.set('workspace', id);
            else url.searchParams.delete('workspace');
            url.searchParams.delete('project');
            projectSwitchAllowed = true;
            location.assign(url.href);
        }});
}
async function refreshBaselines() {
    const projectId = doc.projectId;
    try {
        const result = await api('baselines?id=' + encodeURIComponent(projectId));
        if (doc.projectId !== projectId) return;
        baselineItems = result.baselines;
        notify(baselineItems.length ? '단계별 기준판 목록을 읽었습니다.' : '아직 보존한 기준판이 없습니다.');
    } catch (e) {
        if (doc.projectId === projectId) notify(e.message);
    }
}
async function captureBaseline() {
    if (saveBusy || baselineBusy) return;
    if (dirty || expectedRevision === null) return notify('먼저 현재 설계를 파일에 저장해 주세요.');
    const projectId = doc.projectId, revision = expectedRevision, stage = baselineStage;
    baselineBusy = true;
    render();
    try {
        await api('baseline', {method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({projectId, stage, expectedRevision: revision})});
        if (doc.projectId === projectId) await refreshBaselines();
    } catch (e) {
        if (doc.projectId === projectId) notify(e.message + ' 현재 설계는 유지했습니다.');
    } finally {
        baselineBusy = false;
        render();
    }
}
async function restoreBaseline(value) {
    if (saveBusy || baselineBusy) return;
    if (dirty || expectedRevision === null) return notify('현재 수정을 먼저 저장한 뒤 기준판을 불러오세요.');
    const [stage, revisionText] = value.split(':');
    const revision = Number(revisionText);
    if (!baselineItems.some(b => b.stage === stage && b.revision === revision)) return;
    if (!confirm(baselineLabels[stage] + ' r' + revision + '을 편집 화면에 불러올까요? 파일은 자동으로 덮어쓰지 않으며 되돌리기로 복원할 수 있습니다.')) return;
    const before = JSON.stringify(doc), projectId = doc.projectId, currentRevision = expectedRevision;
    baselineBusy = true;
    render();
    try {
        const result = await api('baseline?id=' + encodeURIComponent(projectId) + '&stage=' + stage + '&revision=' + revision);
        if (JSON.stringify(doc) !== before || expectedRevision !== currentRevision || dirty)
            throw Error('요청 중 설계가 바뀌어 기준판을 적용하지 않았습니다.');
        validateDocument(result.document);
        if (result.document.projectId !== projectId || result.document.revision !== revision)
            throw Error('기준판의 설계·저장 버전이 다릅니다.');
        checkpoint();
        const previousUndo = undo;
        setDoc({...result.document, revision: currentRevision}, currentRevision);
        undo = previousUndo;
        dirty = true;
        status = baselineLabels[stage] + ' r' + revision + '을 불러왔습니다. 확인 후 파일에 저장하세요.';
    } catch (e) {
        status = e.message + ' 현재 설계는 유지했습니다.';
    } finally {
        baselineBusy = false;
        render();
    }
}
async function openSaved(id) {
    if (dirty && !confirm('저장하지 않은 수정이 있습니다. 파일을 열면 현재 수정을 바꿉니다. 계속할까요?'))
        return;
    try {
        const result = await api('project?id=' + encodeURIComponent(id));
        setDoc(result.document, result.document.revision);
        try {
            localStorage.setItem(lastProjectKey, id);
        }
        catch {
        }
        status = '저장 파일을 다시 읽었습니다.';
        render();
    }
    catch (e) {
        notify(e.message);
    }
}
function download(name, value, type = 'application/json') {
    const blob = new Blob([typeof value === 'string' ? value : JSON.stringify(value, null, 2)], {
        type
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function field(label, name, value, type = 'text', extra = '') {
    return `<label>${label}<input ${extra} type="${type}" data-field="${name}" value="${esc(value)}"></label>`;
}
function textarea(label, name, value) {
    return `<label>${label}<textarea data-field="${name}" rows="3">${esc(value)}</textarea></label>`;
}
function select(label, name, value, choices) {
    return `<label>${label}<select data-field="${name}">${choices.map(([id, title]) => `<option value="${esc(id)}" ${value === id ? 'selected' : ''}>${esc(title)}</option>`).join('')}</select></label>`;
}
function rememberPresentation() {
    const url = new URL(location.href);
    url.searchParams.set('editor','detail');
    url.searchParams.set('project',doc.projectId);
    url.searchParams.set('screen',selectedScreen);
    url.searchParams.set('view',presentationMode);
    if(workspaceId)url.searchParams.set('workspace',workspaceId);else url.searchParams.delete('workspace');
    if(doc.screens.find(screen=>screen.id===selectedScreen)?.elements.some(element=>element.id===selectedElement))url.searchParams.set('element',selectedElement);else url.searchParams.delete('element');
    if(url.href!==location.href)history.replaceState(null,'',url);
}
function openCurrentPreview({screenId = selectedScreen,elementId = selectedElement,presentationMode:view = presentationMode} = {}) {
    const snapshot = clone(doc), screen = screenById(snapshot,screenId), opener = document.activeElement;
    if (!screen) return notify('미리 볼 화면을 찾지 못했습니다.');
    const dialog = document.createElement('dialog'); dialog.className = 'studio-screen-preview';
    const heading = document.createElement('header'), info = document.createElement('div'), title = document.createElement('h2'), detail = document.createElement('p');
    title.id = 'screen-preview-' + crypto.randomUUID(); title.textContent = screen.name + ' · 미리보기';
    dialog.setAttribute('aria-labelledby',title.id);
    const selected = screen.elements.find(item => item.id === elementId);
    detail.textContent = (folderProject?.name || '공용 저장공간') + ' · ' + snapshot.name + ' · 현재 설계' + (dirty ? ' · 미저장 수정 포함' : expectedRevision === null ? ' · 파일 저장 전' : ' · 저장된 내용과 같음') + (selected ? ' · 선택 ' + selected.name : '');
    info.append(title,detail);
    const close = document.createElement('button'); close.type = 'button'; close.textContent = '편집으로 돌아가기'; close.onclick = () => dialog.close();
    heading.append(info,close);
    // 기기 화면 크기: 설계 폭은 유지하고 기기 비율로 논리 높이만 바꿔 다시 그립니다(저장 설계는 그대로).
    const devicePicker = document.createElement('select'); devicePicker.className = 'studio-screen-preview-device'; devicePicker.setAttribute('aria-label','미리보기 기기 화면 크기');
    for (const [id, p] of Object.entries(profiles)) { const ref = canvasDevicePreview(screen,{profile:'design'}).reference; const option = document.createElement('option'); option.value = id; option.textContent = `${p.name} ${id==='design'?ref.w:p.w}×${id==='design'?ref.h:p.h}`; option.selected = id === profile; devicePicker.append(option); }
    const deviceLabel = document.createElement('label'); deviceLabel.className = 'inline'; const deviceName = document.createElement('span'); deviceName.textContent = '기기 '; deviceLabel.append(deviceName, devicePicker);
    const deviceInfo = document.createElement('small'); deviceInfo.className = 'subtle';
    let shownSize = sampleSize(snapshot,screen);
    const deviceDesign = id => { const p = canvasDevicePreview(screen,{profile:id}), shown = clone(snapshot); for(const target of shown.screens)if(target.kind==='page'||target.id===screenId){const size=canvasDevicePreview(screenById(snapshot,target.id),{profile:id}).logical;target.logicalSize={w:Math.round(size.w),h:Math.round(size.h)};}const target=screenById(shown,screenId);deviceInfo.textContent = ` 기기 ${p.device.w}×${p.device.h} · 설계 폭 ${p.reference.w} 유지 · 논리 ${target.logicalSize.w}×${target.logicalSize.h}`; return shown; };
    info.append(deviceLabel, deviceInfo);
    const viewport = document.createElement('div'); viewport.className = 'studio-screen-preview-viewport';
    const stage = document.createElement('div'), host = document.createElement('div'); stage.className = 'studio-screen-preview-stage'; host.className = 'studio-screen-preview-host'; stage.append(host); viewport.append(stage);
    dialog.append(heading,viewport); document.body.append(dialog);
    let viewer, observer;
    const fit = () => {
        if (!viewer) return;
        const size = shownSize, scale = sampleFit(size,viewport.clientWidth,viewport.clientHeight);
        host.style.width = size.w + 'px'; host.style.height = size.h + 'px'; host.style.transform = `scale(${scale})`;
        stage.style.width = size.w * scale + 'px'; stage.style.height = size.h * scale + 'px';
    };
    dialog.addEventListener('keydown',event => event.stopPropagation());
    dialog.addEventListener('close',() => { observer?.disconnect(); viewer?.dispose(); dialog.remove(); if(opener?.isConnected)opener.focus(); },{once:true});
    try {
        dialog.showModal();
        const mountDevice = id => { const shown = deviceDesign(id); shownSize = sampleSize(shown,screenById(shown,screenId)); viewer?.dispose(); viewer = mountSamplePreview(host,shown,{screenId,workspaceId,presentationMode:normalizePresentationMode(view),onScreenChange:(current,size)=>{shownSize=size;title.textContent=current.name+' · 미리보기';fit();}}); fit(); };
        devicePicker.onchange = () => { try { mountDevice(devicePicker.value || profile); } catch(error) { notify(error.message); } };
        mountDevice(devicePicker.value || profile);
        if (typeof ResizeObserver === 'function') { observer = new ResizeObserver(fit); observer.observe(viewport); }
        fit(); close.focus();
    } catch(error) { dialog.close(); notify(error.message); }
}
function header() {
    const context = projectContext({workspaceId,workspace:folderProject,document:doc,dirty});
    const current = screenById(doc,selectedScreen), navigation = {workspaceId,projectId:doc.projectId,screenId:selectedScreen,elementId:selectedElement,presentationMode};
    return `<header class="studio-header"><div class="project-context" aria-label="현재 프로젝트"><div><a class="studio-home-link" href="/ui-studio/" aria-label="UI 스튜디오 시작 화면">UI 스튜디오</a><span class="project-label">${esc(context.label)} · ${esc(context.name)}</span></div><div class="studio-current-screen">${esc(current.name)}</div><small>${esc(context.design)}</small><div class="project-directory" title="${esc(context.directory)}">${esc(context.directory)}</div></div><div class="save-controls"><span id="save-status" class="${dirty ? 'dirty' : ''}">${dirty ? '● 미저장 수정' : expectedRevision === null ? '파일 저장 전' : '저장됨 · r' + expectedRevision}</span><button data-action="save" ${saveBusy ? 'disabled' : ''}>${saveBusy ? '저장 중' : '파일에 저장'}</button><details class="file-menu"><summary>파일 · 공유</summary><div><button data-action="project-folders">프로젝트 폴더</button><button data-action="manual">가이드</button>${expectedRevision !== null ? `<a class="consumer-link" target="_blank" rel="noopener" href="${esc(designURL('sample',navigation))}">저장 샘플 보기 ↗</a>` : ''}<label>설계 이름<input data-project-field="name" value="${esc(doc.name)}"></label><label>저장한 설계<select data-open-project><option value="">선택해서 열기</option>${projects.map(p => `<option value="${esc(p.id)}">${esc(p.name)} · r${p.revision}</option>`).join('')}</select></label><button data-action="reopen" ${expectedRevision === null ? 'disabled' : ''}>현재 파일 다시 열기</button><button data-action="new-project">새 설계</button><fieldset><legend>제작 단계 기준판</legend><label>보존할 단계<select data-baseline-stage>${Object.entries(baselineLabels).map(([key, label]) => `<option value="${key}" ${baselineStage === key ? 'selected' : ''}>${esc(label)}</option>`).join('')}</select></label><button data-action="baseline-capture" ${dirty || expectedRevision === null || saveBusy || baselineBusy ? 'disabled' : ''}>현재 저장판을 기준판으로 보존</button><button data-action="baseline-list" ${baselineBusy ? 'disabled' : ''}>기준판 목록 읽기</button><label>기준판 불러오기<select data-open-baseline ${dirty || saveBusy || baselineBusy ? 'disabled' : ''}><option value="">단계 · 버전 선택</option>${baselineItems.map(b => `<option value="${b.stage}:${b.revision}">${esc(baselineLabels[b.stage])} · r${b.revision} · ${esc(b.name)}</option>`).join('')}</select></label><small>현재 수정을 먼저 저장하세요. 기준판 불러오기는 자동 저장하지 않습니다.</small></fieldset><button data-action="wireframe-style">클릭 타원 · 표시 직각으로 정리</button>${workspaceId || studioSettings.catalogEnabled === false ? '' : '<button data-action="lobby-design">공통 설정으로 로비 설계 만들기</button>'}<label class="file-label">설계 JSON 불러오기<input type="file" id="import-file" accept=".json,application/json"></label><button data-action="export">설계 JSON 내보내기</button>${expectedRevision !== null ? `<a class="consumer-link" target="_blank" rel="noopener" href="${esc(designURL('preview',navigation))}">동작 시험 보기 ↗</a>` : ''}<button data-action="context">선택 정보 공유 파일</button><button data-action="export-plan">기획·연결 설명 내보내기</button><button data-action="export-handoff">AI 연결 명세 JSON</button><button data-action="glossary">UI 용어 찾아보기</button><button data-action="manual">툴 기획·설명서</button></div></details></div></header>
 <div class="toolbar studio-navigation"><nav class="studio-stage-nav" aria-label="제작 단계"><a href="${esc(designURL('canvas',navigation))}">전체 캔버스</a><span aria-hidden="true">›</span><button data-action="edit" aria-current="step">상세 편집</button><span aria-hidden="true">›</span><button data-action="design-guide" ${mode === 'play' ? 'disabled' : ''}>디자인 가이드</button></nav><label class="inline">표현<select data-presentation-mode aria-label="표현">${presentationModesFor(workspaceId).map(({id,label,disabled}) => `<option value="${id}" ${disabled ? 'disabled' : ''} ${presentationMode === id ? 'selected' : ''}>${label}</option>`).join('')}</select></label><button data-action="preview-current">미리보기</button><span data-planning-actions></span><label class="inline">기기<select data-setting="profile">${Object.entries(profiles).map(([id, p]) => `<option value="${id}" ${id === profile ? 'selected' : ''}>${p.name} ${id==='design'?detailDevicePreview(screenById(doc,selectedScreen),'design').reference.w:p.w}×${id==='design'?detailDevicePreview(screenById(doc,selectedScreen),'design').reference.h:p.h}</option>`).join('')}</select></label><details class="file-menu studio-tools"><summary>편집 도구</summary><div><button data-action="unit-library">유닛 추가</button><button data-action="play">동작 시험</button>${workspaceId || studioSettings.catalogEnabled === false ? '' : '<button data-action="build-current-ui">현재 로비 UI 구조 적용</button>'}<button data-action="shortcuts">단축키 ?</button>${[['copy', '복사'], ['cut', '잘라내기'], ['paste', '붙여넣기'], ['duplicate', '복제'], ['delete', '삭제'], ['all', '전체 선택'], ['group', '그룹'], ['ungroup', '그룹 해제'], ['layer-back', '맨 뒤로'], ['layer-front', '맨 앞으로']].map(([id, n]) => `<button data-edit-command="${id}">${n}</button>`).join('')}<label class="inline">확대<select data-setting="zoom">${[['fit', '화면 맞춤'], ['0.25', '25%'], ['0.5', '50%'], ['0.75', '75%'], ['1', '100%'], ['1.5', '150%'], ['2', '200%'], ['3', '300%'], ...(!['fit', '0.25', '0.5', '0.75', '1', '1.5', '2', '3'].includes(String(zoom)) ? [[String(zoom), Math.round(Number(zoom) * 100) + '%']] : [])].map(([id, n]) => `<option value="${id}" ${id === zoom ? 'selected' : ''}>${n}</option>`).join('')}</select></label><button data-action="zoom-out" aria-label="캔버스 축소">−</button><button data-action="zoom-in" aria-label="캔버스 확대">＋</button><button data-action="canvas-fit">화면 맞춤</button><button data-action="hand" aria-pressed="${handTool}">손 도구 H</button><button data-action="grid" aria-pressed="${grid}">선택 가이드</button><button data-action="snap" aria-pressed="${snap}">1% 스냅</button><button data-action="show-flow">화면 관계</button><p>모서리를 끌어 전체 작업 영역 크기를 바꿉니다.</p><label>너비 px<input data-frame-size="w" type="number" min="760" value="${workspacePrefs.frame?.w || innerWidth}"></label><label>높이 px<input data-frame-size="h" type="number" min="500" value="${workspacePrefs.frame?.h || innerHeight}"></label><button data-action="apply-frame">크기 적용</button><button data-action="frame-fit">창에 맞춤</button><label>작업 배경색<input type="color" data-editor-color="stageColor" value="${workspacePrefs.stageColor}"></label><label>캔버스색<input type="color" data-editor-color="canvasColor" value="${workspacePrefs.canvasColor}"></label></div></details></div>
 ${status ? `<div class="notice" role="status">${esc(status)}</div>` : ''}`;
}
function layerBrowserKey() {
    const current = screenById(doc, selectedScreen);
    return JSON.stringify([doc.projectId, selectedScreen, current?.name, current?.kind, current?.elements, search, [...collapsedLayers]]);
}
function restoreLayerBrowser() {
    const marker = app.querySelector('[data-cached-layer-browser]');
    if (marker && cachedLayerBrowser) {
        marker.replaceWith(cachedLayerBrowser.node);
        for (const n of cachedLayerBrowser.node.querySelectorAll('.layer-select')) {
            const active = n.dataset.element === selectedElement || selectedIds.includes(n.dataset.element);
            n.classList.toggle('active', active);
            n.closest('[role=treeitem]')?.setAttribute('aria-selected', String(active));
        }
        for (const n of cachedLayerBrowser.node.querySelectorAll('[data-isolate-layer]'))
            n.setAttribute('aria-pressed', String(isolated.includes(n.dataset.isolateLayer)));
    }
    else {
        const node = app.querySelector('.project-browser:has(.layer-tree)');
        cachedLayerBrowser = node ? {
            node, key: layerBrowserKey()
        } : null;
    }
}
function projectTree() {
    if (treeTab === 'layers' && cachedLayerBrowser?.key === layerBrowserKey())
        return '<section data-cached-layer-browser></section>';
    const current = screenById(doc, selectedScreen), s = current.kind === 'page' ? current : screenById(doc, previewBase) || screenById(doc, doc.entryScreen);
    const conversionEnabled = mode === 'edit' && current.kind === 'page' && current.id !== doc.entryScreen;
    const conversionForm = `<fieldset><legend>현재 화면 · ${esc(current.name)}</legend><label>화면 종류<select id="convert-screen-kind" ${conversionEnabled ? '' : 'disabled'}><option value="page" ${current.kind === 'page' ? 'selected' : ''}>페이지</option><option value="modal" ${current.kind === 'modal' ? 'selected' : ''}>팝업 · 화면 전체</option>${!['page', 'modal'].includes(current.kind) ? `<option selected>${esc(current.kind)}</option>` : ''}</select></label><label>전환 후 이름 (선택)<input id="convert-screen-name" placeholder="${esc(current.name)}" ${conversionEnabled ? '' : 'disabled'}></label><button data-action="convert-screen" ${conversionEnabled ? '' : 'disabled'}>화면 종류 적용</button><p class="subtle">${current.id === doc.entryScreen ? '시작 페이지는 팝업으로 바꿀 수 없습니다.' : current.kind === 'page' ? '팝업을 선택하면 같은 부품을 현재 페이지 위에 띄웁니다. 이름을 비우면 유지합니다.' : '팝업에서 페이지로 복원할 때는 전환 직후 되돌리기를 사용하세요.'}</p></fieldset>`;
    return `<section class="project-browser"><h2>프로젝트</h2><div class="seg tree-tabs"><button data-tree="screens" aria-pressed="${treeTab === 'screens'}">화면</button><button data-tree="layers" aria-pressed="${treeTab === 'layers'}">레이어</button></div>${treeTab === 'units' ? `<div class="asset-library">${paletteBody()}</div>` : `<label class="search-label">찾기<input id="tree-search" placeholder="${treeTab === 'screens' ? '화면 이름' : '요소 이름'}" value="${esc(search)}"></label>${conversionForm}${treeTab === 'screens' ? `<div class="screen-list">${doc.screens.filter(n => ['page', 'modal'].includes(n.kind) && (!search || n.name.includes(search))).map(n => `<button data-screen="${esc(n.id)}" class="${n.id === current.id ? 'active' : ''}"><span>${n.kind === 'page' ? '▣' : '▱'} ${esc(n.name)}</span><small>${n.kind === 'page' ? '페이지' : '팝업'} · ${n.elements.length}개 요소</small></button>`).join('')}</div><details><summary>＋ 게임 화면 추가</summary><div class="create-row"><input id="new-screen-name" placeholder="화면 이름"><input id="new-screen-kind" type="hidden" value="page"><button data-action="new-screen">추가</button></div></details><p class="subtle">팝업은 목록에서 배치를 편집하고 오른쪽 ‘공통 연출’에서 현재 페이지 위로 시험합니다.</p>` : `<button data-action="page-layers">${esc(s.name)} 레이어</button><div class="layer-tree" role="tree" aria-label="레이어 계층">${layerRows(current)}</div><button class="root-drop" data-root-drop="true">화면 최상위로 이동</button><p class="subtle">빈 공간을 드래그하면 여러 요소를 선택합니다. 같은 부모 안에서 함께 이동합니다.</p>`}`}</section>`;
}
function unitPalette() {
    return `<div class="palette-tabs"><button data-palette="features" aria-pressed="${palette === 'features'}">게임 기능</button><button data-palette="overlays" aria-pressed="${palette === 'overlays'}">공통 연출</button><button data-palette="properties" aria-pressed="${palette === 'properties'}">속성</button><button data-palette="flow" aria-pressed="${palette === 'flow'}">화면 관계</button></div>`;
}
function paletteBody() {
    return `<h3>와이어프레임 유닛 <small>${UNITS.length}종</small></h3><p class="subtle">화면에 끌어 넣거나 눌러 추가하세요. 실행 가능한 입력·선택 유닛은 동작 시험에서 값을 조작할 수 있습니다. 게임 기능 연결은 별도로 지정합니다.</p><label>유닛 검색<input id="unit-search" value="${esc(unitSearch)}" placeholder="육각형 · 버튼 · 목록"></label><div class="unit-groups">${['전체', ...new Set(UNITS.map(u => u.group))].map(g => `<button data-unit-group="${g}" aria-pressed="${g === unitGroup}">${g}</button>`).join('')}</div><div class="unit-grid">${UNITS.filter(u => (unitGroup === '전체' || u.group === unitGroup) && u.name.includes(unitSearch)).map(u => `<button draggable="true" aria-label="${esc(u.name)}" data-unit="${u.id}" title="누르거나 게임 화면에 끌어 넣기"><span class="unit-thumb">${surface(u.appearance)}<span>${esc(u.text || '')}</span></span><span>${esc(u.name)}</span></button>`).join('')}</div>`;
}
function surface(a = {}) {
    const shape = a.shape || 'rounded', fill = a.fill || '#e8edf2', stroke = a.stroke || '#71839a', width = a.strokeWidth ?? 1.5;
    const attrs = `fill="${fill}" stroke="${stroke}" stroke-width="${width}" vector-effect="non-scaling-stroke"`;
    let path = shape === 'hexagon' ? `<polygon points="25,2 75,2 98,50 75,98 25,98 2,50" ${attrs}/>` : shape === 'triangle' ? `<polygon points="50,2 98,98 2,98" ${attrs}/>` : shape === 'diamond' ? `<polygon points="50,2 98,50 50,98 2,50" ${attrs}/>` : ['circle', 'ellipse'].includes(shape) ? `<ellipse cx="50" cy="50" rx="48" ry="48" ${attrs}/>` : `<rect x="1" y="1" width="98" height="98" rx="${shape === 'rectangle' ? 0 : shape === 'capsule' ? 49 : a.radius ?? 12}" ${attrs}/>`;
    return `<svg class="unit-surface" viewBox="0 0 100 100" preserveAspectRatio="${shape === 'circle' ? 'xMidYMid meet' : 'none'}" aria-hidden="true">${path}</svg>`;
}
function appearancePanel(e) {
    const a = e.appearance || {};
    return `<details open class="appearance-panel"><summary>모양·색상</summary>${select('백판 모양', 'appearance.shape', a.shape || 'rounded', Object.entries(SHAPES))}<div class="color-fields">${[['fill', '백판 색', '#e8edf2'], ['stroke', '테두리 색', '#71839a'], ['textColor', '글자 색', '#243549']].map(([k, n, v]) => field(n, 'appearance.' + k, a[k] || v, 'color')).join('')}</div><div class="field-grid">${field('테두리 두께', 'appearance.strokeWidth', a.strokeWidth ?? 1.5, 'number', 'min="0" max="12" step="0.5"')}${field('모서리 둥글기', 'appearance.radius', a.radius ?? 12, 'number', 'min="0" max="100"')}${field('불투명도', 'appearance.opacity', a.opacity ?? 1, 'number', 'min="0" max="1" step="0.05"')}</div></details>`;
}
function overlayPanel() {
    const roots=(screenById(doc,previewBase)||screenById(doc,doc.entryScreen)).elements.filter(e=>!e.parentId);
    const hiddenPicker=`<details><summary>배후 화면에서 숨길 레이어 · ${demoHideBase.length}개</summary><p class="subtle">그림·컨트롤은 유지하고 선택한 레이어만 잠시 숨깁니다. 닫으면 표시와 입력 상태가 복원됩니다.</p>${roots.map(e=>`<label class="inline"><input type="checkbox" data-demo-hide-base="${esc(e.id)}" ${demoHideBase.includes(e.id)?'checked':''}>숨김 · ${esc(e.name)}</label>`).join('')}</details>`;
    return `<h3>현재 화면 위 공통 연출</h3><p class="subtle">${esc(screenById(doc, previewBase)?.name || '현재 화면')}을 유지하며 띄웁니다. 미리보기는 저장되지 않습니다. 공통 설정에 적용한 뒤 파일 저장으로 보존하세요. 버튼 연결은 별도로 지정합니다.</p><label>공통 내용<select data-demo="choice">${doc.screens.filter(s => s.kind !== 'page').map(s => `<option value="${esc(s.id)}" ${overlayChoice === s.id ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}${[['modal', '기본 모달'], ['sheet', '기본 바텀시트'], ['toast', '기본 토스트'], ['popover', '기본 도움말'], ['top', '기본 탑창']].map(([k, n]) => `<option value="builtin:${k}" ${overlayChoice === 'builtin:' + k ? 'selected' : ''}>${n}</option>`).join('')}</select></label><label>어떤 형태로 띄울까요?<select data-demo="kind">${[['modal', '모달 · 가운데 창'], ['sheet', '바텀시트 · 아래에서'], ['toast', '토스트 · 짧은 안내'], ['popover', '도움말 · 작은 창'], ['top', '탑창 · 위에서']].map(([k, n]) => `<option value="${k}" ${k === demoKind ? 'selected' : ''}>${n}</option>`).join('')}</select></label><label>내용 루트<select data-demo="rootMode"><option value="window" ${demoRootMode === 'window' ? 'selected' : ''}>기본 창</option><option value="fullscreen" ${demoRootMode === 'fullscreen' ? 'selected' : ''}>화면 전체 · 투명 UI 루트</option></select></label><label>나타나기<select data-demo="effect">${Object.entries(EFFECTS).map(([k, n]) => `<option value="${k}" ${k === demoEffect ? 'selected' : ''}>${n}</option>`).join('')}</select></label><div class="field-grid"><label>연출 시간 (ms)<input type="number" min="0" max="2000" data-demo="duration" value="${demoDuration}"></label><label>자동 닫힘 (ms, 0은 유지)<input type="number" min="0" max="30000" data-demo="auto" value="${demoAuto}"></label></div><label class="inline"><input type="checkbox" data-demo="dim" ${demoDim ? 'checked' : ''}>뒤 화면 어둡게</label>${hiddenPicker}<button data-action="apply-overlay-settings" ${overlayChoice.startsWith('builtin:')?'disabled':''}>공통 설정에 적용</button><div class="button-row"><button data-action="demo-open">▶ 화면 위에 띄우기</button><button data-action="demo-close">닫기</button></div><button data-action="bind-overlay" ${selection()?.kind === 'button' ? '' : 'disabled'}>선택 버튼 동작을 이 연출로 지정</button><p class="subtle">연결할 버튼을 화면에서 고른 뒤 적용하세요. 그다음 동작 시험에서 버튼을 누릅니다.</p><button data-action="overlay-content">공통 내용·배치 편집</button>`;
}
function typographyPanel(e) {
    const t = e.typography || {};
    const selectType = (label,key,choices) => `<label>${label}<select data-field="typography.${key}"><option value="">기본 유지</option>${choices.map(([v,n])=>`<option value="${v}" ${t[key] === v ? 'selected' : ''}>${n}</option>`).join('')}</select></label>`;
    return `<details class="typography-panel"><summary>텍스트 · 크기와 줄맞춤</summary>${field('텍스트 크기 px','fontSize',e.fontSize || 16,'number','min="1" max="256" step="0.1"')}${selectType('글꼴','family',[['system','시스템 UI'],['arial','Arial'],['georgia','Georgia'],['mono','고정폭']])}<p class="subtle">해당 글꼴이 없으면 대체 글꼴로 표시됩니다. 원본 게임의 폰트가 확인되었다는 뜻은 아닙니다.</p>${field('글자 굵기 1~1000','typography.weight',t.weight ?? '','number','min="1" max="1000" placeholder="기본 유지"')}${field('줄높이 px','typography.lineHeight',t.lineHeight ?? '','number','min="1" max="512" step="0.1" placeholder="기본 유지"')}${field('자간 px','typography.letterSpacing',t.letterSpacing ?? '','number','min="-10" max="64" step="0.1" placeholder="기본 유지"')}${field('글자 외곽선 두께 px','typography.strokeWidth',t.strokeWidth ?? '','number','min="0" max="12" step="0.1" placeholder="기본 유지"')}${field('글자 외곽선 색','typography.strokeColor',t.strokeColor || '#000000','color')}${selectType('글자 가로 정렬','align',[['left','왼쪽'],['center','가운데'],['right','오른쪽']])}${selectType('글자 세로 정렬','vertical',[['top','위'],['middle','가운데'],['bottom','아래']])}${selectType('글자 줄바꿈','wrap',[['wrap','여러 줄'],['nowrap','한 줄']])}${selectType('글자 넘침','overflow',[['visible','영역 밖 표시'],['clip','영역에서 자르기'],['ellipsis','한 줄 말줄임표']])}<p class="subtle">빈 값은 기존 기본값을 유지합니다. 말줄임표는 한 줄 모드에서 사용합니다. 수치는 캔버스 논리 px이며 편집 확대율과 별개입니다.</p></details>`;
}
function generalPanel(s, e) {
    return e ? `${partsPanel(s, e)}${controlInspectorHTML(e,s)}${field('요소 이름', 'name', e.name)}${e.binding ? `<div class="binding-note"><b>${e.binding.type === 'content-slot' ? '콘텐츠 영역 · ' + esc(e.binding.slot) : '게임 기능 · ' + esc(e.binding.label)}</b><p class="subtle">${e.binding.type === 'content-slot' ? '여기서는 자리 표시만 합니다. 게임 화면에서는 같은 영역에 실제 콘텐츠를 표시합니다.' : '기능 연결 정의입니다. 실제 게임 코드는 이 편집기에서 실행하지 않습니다.'}</p></div>` : ''}${e.skin ? '' : appearancePanel(e)}${select('UI 종류', 'kind', e.kind, Object.entries(kinds))}${textarea('어떤 기능인가요?', 'purpose', e.purpose)}${textarea('표시할 정보 / 설명', 'info', e.info)}${textarea('화면에 표시할 글', 'text', e.text)}${typographyPanel(e)}<div class="source-note"><b>가능한 행동</b>${doc.transitions.filter(t => t.fromElement === e.id).map(t => `<button data-edge="${esc(t.id)}">${esc(t.label || actionNames[t.action])} → ${esc(screenById(doc, t.targetScreen)?.name || actionNames[t.action])}</button>`).join('') || '<p>연결·조건 탭에서 행동을 추가하세요.</p>'}</div><details><summary>식별자 · 출처</summary><code>${esc(e.id)}</code><p>${esc(e.sourceRef || 'T04 첫 판 · 시험용 제안')}</p></details><button class="danger" data-action="delete-element">요소와 하위 요소 삭제</button>` : `${field('화면 이름', 'screen.name', s.name)}${textarea('이 화면은 무엇을 하나요?', 'screen.purpose', s.purpose)}<p class="subtle">화면 안의 요소를 선택하면 그 요소의 기능을 작성할 수 있습니다.</p><button class="danger" data-action="delete-screen" ${s.id === doc.entryScreen ? 'disabled' : ''}>이 화면 삭제</button>`;
}
function connectionPanel(s, e) {
    if (!e)
        return '<p>행동을 설정할 버튼이나 요소를 먼저 선택하세요.</p>';
    const ts = doc.transitions.filter(t => t.fromElement === e.id);
    return `<p class="subtle">위에서부터 조건을 확인하고 처음 참인 행동 하나를 실행합니다. 미정 조건은 실행을 멈춥니다.</p>${ts.map(t => `<fieldset class="edge-form" data-edge-form="${esc(t.id)}"><legend>${esc(t.label || '행동')}</legend><label>행동 이름<input data-edge-field="label" value="${esc(t.label)}"></label><label>실행 조건<select data-edge-field="condition">${CONDITIONS.map(c => `<option value="${c}" ${c === t.condition ? 'selected' : ''}>${conditionNames[c]}</option>`).join('')}</select></label><label>무엇을 하나요?<select data-edge-field="action">${ACTIONS.map(a => `<option value="${a}" ${a === t.action ? 'selected' : ''}>${actionNames[a]}</option>`).join('')}</select></label><label>대상 UI<select data-edge-field="targetScreen"><option value="">대상 없음</option>${doc.screens.map(n => `<option value="${esc(n.id)}" ${n.id === t.targetScreen ? 'selected' : ''}>${esc(n.name)}</option>`).join('')}</select></label><label>전달할 시험 상품<select data-edge-field="itemId"><option value="">전달 없음</option>${doc.fixtures.items.map(i => `<option value="${esc(i.id)}" ${i.id === t.payload?.itemId ? 'selected' : ''}>${esc(i.name)}</option>`).join('')}</select></label><label>닫기 후 복귀<input data-edge-field="returnPolicy" value="${esc(t.returnPolicy || '미정')}"></label><div class="button-row"><button data-target="${esc(t.targetScreen || s.id)}">대상 보기</button><button data-remove-edge="${esc(t.id)}">연결 삭제</button></div></fieldset>`).join('')}<button data-action="add-edge">행동 · 연결 추가</button>`;
}
function layoutPanel(s, e) {
    const responsive=responsiveInspectorHTML(s,e);
    if (!e)return responsive;
    const manual=percentRectEditable(s,e);
    return `${responsive}${manual?`<p class="subtle">부모 영역 기준 %입니다. 미리보기 확대와 저장 좌표는 분리됩니다.</p><div class="field-grid">${['x','y','w','h'].map((n,i)=>field(['가로 위치 X','세로 위치 Y','너비 W','높이 H'][i],n,e[n],'number','step="0.25"')).join('')}</div>`:'<p class="subtle">이 부품의 배치는 위의 응답형 속성에서 조절하세요.</p>'}${select('기준 부모','parentId',e.parentId||'',[['','전체 화면'],...s.elements.filter(n=>n.id!==e.id&&['panel','list','card'].includes(n.kind)).map(n=>[n.id,n.name])])}${!isAutoLayoutChild(s,e)?'<div class="button-row"><button data-align="left">왼쪽 정렬</button><button data-align="center">가운데</button><button data-align="right">오른쪽</button></div>':''}${typographyPanel(e)}<p class="subtle">자동 배치 자식은 선택과 속성 편집을 유지하며 위치·크기는 부모가 정합니다. 방향키 이동은 수동 배치 부품에만 적용합니다.</p>`;
}
function panelBody(id) {
    const screen = screenById(doc, selectedScreen), e = selection();
    if (id === 'layer')
        return mode === 'edit' && e ? quickTransform(screen, e) : '<p class="subtle">캔버스나 레이어 목록에서 요소를 선택하세요.</p>';
    if (id === 'features')
        return featurePalette();
    if (id === 'overlays')
        return overlayPanel() + fixturePanel();
    if (id === 'flow') {
        flowOpen = true;
        return flow();
    }
    return `<div class="tabs">${[['general', '설명·기능'], ['connections', '연결·조건'], ['layout', '배치'], ['motion', '연출']].map(([key, n]) => `<button data-tab="${key}" aria-pressed="${tab === key}">${n}</button>`).join('')}</div>${tab === 'general' ? generalPanel(screen, e) : tab === 'connections' ? connectionPanel(screen, e) : tab === 'layout' ? layoutPanel(screen, e) : '<p>공통 연출에서 현재 화면 위 출현을 시험하세요.</p><button data-palette="overlays">공통 연출 열기</button>'}`;
}
function panelTabs(ids, activeId = palette) {
    return `<div class="dock-tabstrip">${ids.filter(id => !workspacePrefs.floats[id]).map(id => `<div class="dock-tab"><button draggable="false" data-panel-tab="${id}" data-palette="${id}" aria-pressed="${activeId === id}">${PANEL_NAMES[id]}${workspacePrefs.floats[id] ? ' ↗' : ''}</button><button data-float-panel="${id}" aria-label="${PANEL_NAMES[id]} 패널 분리" title="독립 패널로 분리">↗</button></div>`).join('')}</div>`;
}
function dockRows() {
    const groups = workspacePrefs.groups;
    return `<div class="dock-rows" style="grid-template-rows:${groups.map((g, i) => (i ? '8px ' : '') + 'minmax(80px,' + (workspacePrefs.weights[i] || 1) + 'fr)').join(' ')}">${groups.map((ids, i) => {
        const available = ids.filter(id => !workspacePrefs.floats[id]);
        let active = available.includes(workspacePrefs.active[i]) ? workspacePrefs.active[i] : available[0];
        workspacePrefs.active[i] = active;
        return `${i ? `<div class="dock-row-splitter" data-row-split="${i - 1}" role="separator" aria-orientation="horizontal" aria-label="패널 행 높이 조절"></div>` : ''}<section class="dock-row" data-dock-row="${i}">${panelTabs(ids, active)}<div class="dock-panel-body">${active ? panelBody(active) : '<p class="subtle">분리된 패널을 다시 붙이거나 여기에 탭을 놓으세요.</p>'}</div></section>`;
    }).join('')}</div>`;
}
function inspector() {
    const screen = screenById(doc, selectedScreen), e = selection();
    return `<aside class="inspector" data-dock-side="right"><div class="dock-zone-heading">오른쪽 패널</div><div class="inspector-title"><small>${e ? '선택한 레이어' : '선택한 화면'}</small><h2>${esc(e?.name || screen.name)}</h2>${selectionDescriptionHTML(screen, e)}</div><div data-planning-host></div><div class="workspace-controls"><span>패널 배치</span>${[['tabs', '합침'], ['2', '2줄'], ['4', '4줄']].map(([id, n]) => `<button data-workspace-mode="${id}" aria-pressed="${workspacePrefs.mode === id}">${n}</button>`).join('')}<button data-action="dock-all">모두 붙이기</button></div>${dockRows()}</aside>`;
}
function floatingPanels() {
    return Object.entries(workspacePrefs.floats).map(([id, r]) => {
        const rect = clampPanel(r, innerWidth, innerHeight);
        return `<section class="floating-panel" data-floating-panel="${id}" style="left:${rect.x}px;top:${rect.y}px;width:${rect.w}px;height:${rect.h}px;z-index:${r.z || 170}" aria-label="독립 ${PANEL_NAMES[id]} 패널"><header data-float-move="${id}"><b>${PANEL_NAMES[id]}</b><button data-dock-panel="${id}">다시 붙이기</button></header><div class="floating-panel-body">${panelBody(id)}</div><span class="floating-resize" data-float-resize="${id}" aria-label="${PANEL_NAMES[id]} 패널 크기 조절"></span></section>`;
    }).join('');
}
function rememberWorkspace() {
    try {
        localStorage.setItem('ux-studio.workspace', JSON.stringify(workspacePrefs));
    }
    catch {
    }
}
function undockPanel(id, x, y) {
    if (!PANEL_IDS.includes(id))
        return;
    workspacePrefs.floats[id] = {
        ...clampPanel(workspacePrefs.floats[id] || {
            x: x || innerWidth - 390, y: y || 140, w: 360, h: 430
        }, innerWidth, innerHeight), z: ++floatingZ
    };
    rememberWorkspace();
    render();
}
function dockPanel(id) {
    delete workspacePrefs.floats[id];
    palette = id;
    workspacePrefs.groups.forEach((g, i) => {
        if (g.includes(id))
            workspacePrefs.active[i] = id;
    });
    if (workspacePrefs.leftPanels.includes(id))
        workspacePrefs.leftActive = id;
    if (workspacePrefs.bottomPanels.includes(id))
        workspacePrefs.bottomActive = id;
    rememberWorkspace();
    render();
}
function binding(text) {
    const item = doc.fixtures.items.find(i => i.id === runtime.selection);
    return bindSelectedCopy(text, doc.fixtures, runtime.selection).replaceAll('{{selected}}', item?.name || '선택한 상품 없음').replaceAll('{{price}}', item ? '가격 ' + item.price + ' (시험값)' : '').replaceAll('{{message}}', runtime.message);
}
function renderElements(screen, container, suppressedElements = new Set()) {
    const filter = mode === 'edit' && isolated.length ? isolationSets(screen, isolated) : null;
    renderPresentation(mode === 'play' ? bindSelectedImages(screen, doc.fixtures, runtime.selection) : screen, container, {
        presentationMode,
        suppressedElements,runtime,buttonPreview:mode==='edit'?buttonPreview:undefined,buttonElement:buttonStateOwner(screen,screen.elements.find(e=>e.id===selectedElement),doc.transitions)?.id,
        workspaceId, assetView, skinState, skinElement: skinEditTarget(screen, screen.elements.find(e => e.id === selectedElement))?.id || selectedElement, transitions: doc.transitions, inspectInput, menuState: mode === 'play' ? runtime.menuOpen : menuState, mode, selectedScreen, selectedElement, selectedIds, grid, text: e => mode === 'play' ? binding(e.text) : e.text, shell: e => !!filter && !filter.shown.has(e.id), visible: e => (!filter || filter.keep.has(e.id)) && !(mode === 'play' && e.itemId && runtime.filter !== 'all' && doc.fixtures.items.find(i => i.id === e.itemId)?.category !== runtime.filter), rowY: e => mode === 'play' ? filteredRowY(screen, e, doc.fixtures.items, runtime.filter, rootSize(screen).w, rootSize(screen).h) : undefined
    });
    if(presentationMode!=='wireframe')attachControls(container,screen,runtime,{mode:mode === 'play'?'view':'edit',onChange:change=>{runtime=changeControl(doc,runtime,change.screen,change.element,change.value,{event:change.event});return runtime;},onInvalid:error=>{status=error.message;}});
}
async function loadCatalog() {
    if (workspaceId || studioSettings.catalogEnabled === false) {featureError = '프로젝트별 게임 기능 연결은 연결 명세에 등록한 뒤 적용합니다. 유닛 패널에서 독립 UI를 구성하세요.';return;}
    if (featureCatalog || featureLoading)
        return;
    featureLoading = true;
    featureError = '';
    try {
        featureCatalog = (await api('catalog')).catalog;
    }
    catch (e) {
        featureError = e.message;
    }
    finally {
        featureLoading = false;
    }
}
function featurePalette() {
    if (workspaceId || studioSettings.catalogEnabled === false) return '<p>이 프로젝트는 독립 UI 설계를 사용합니다. 유닛 추가로 화면을 구성하고, 게임 기능 연결은 프로젝트 연결 명세를 확인하세요.</p>';
    if (!featureCatalog)
        return `<p>${featureError ? esc(featureError) : '게임 코드 없이 등록 목록을 읽습니다…'}</p><button data-action="catalog-retry">다시 읽기</button>`;
    const list = featureCatalog.modules.filter(f => (f.label + ' ' + f.description + ' ' + f.docId).includes(featureSearch));
    const rank = g => g === 'primary' ? 0 : g === 'growth_tools' ? 1 : g === 'auxiliary' ? 9 : 2;
    const groups = [...new Set(list.map(f => f.group))].sort((a, b) => rank(a) - rank(b));
    return `<h3>게임 기능 <small>${featureCatalog.registeredCount}개 등록 · ${featureCatalog.modules.length}개 묶음</small></h3><p class="subtle">화면에 넣으면 버튼과 연결 정의를 만듭니다. 여기는 UI 시험 모드이며 게임 엔진·3D를 실행하지 않습니다.</p><label>기능 찾기<input id="feature-search" value="${esc(featureSearch)}" placeholder="상점 · 카드 · 로비"></label><button data-action="lobby-design">로비 공통 구성으로 새 설계</button>${groups.map((g, i) => `<details class="feature-group" ${i === 0 || featureSearch ? 'open' : ''}><summary>${esc(GROUP_LABELS[g] || g)} · ${list.filter(f => f.group === g).length}개</summary>${list.filter(f => f.group === g).map(f => `<article class="feature-card"><b>${esc(f.label)}</b><p>${esc(f.description)}</p><div class="button-row"><button draggable="true" data-feature-add="${esc(f.id)}">화면에 넣기</button><button data-feature-bind="${esc(f.id)}" ${selection()?.kind === 'button' ? '' : 'disabled'}>선택 버튼에 지정</button></div>${f.docId ? `<button data-action="manual">툴 기획·설명서</button>` : ''}</article>`).join('')}</details>`).join('') || '<p>검색 결과가 없습니다.</p>'}`;
}
function addFeature(id, position) {
    const feature = featureCatalog?.modules.find(f => f.id === id);
    if (!feature)
        return notify('등록 기능을 확인해 주세요.');
    const e = createUnit('button-rounded', 'element-' + crypto.randomUUID());
    e.name = feature.label;
    e.text = feature.label;
    e.appearance.shape = 'ellipse';
    e.appearance.strokeWidth = 1;
    e.sourceRef = feature.sourceRef;
    if (position)
        Object.assign(e, position);
    if (insertParentId && screenById(doc, selectedScreen).elements.some(n => n.id === insertParentId)) {
        e.parentId = insertParentId;
        if (!position) {
            e.x = 10;
            e.y = 10;
        }
    }
    edited(() => {
        screenById(doc, selectedScreen).elements.push(e);
        bindFeature(doc, selectedScreen, e.id, feature);
        selectedElement = e.id;
        selectedIds = [e.id];
        if (treeTab !== 'units')
            treeTab = 'layers';
        status = '게임 기능 연결 정의를 추가했습니다. 동작 시험에서 연결 요청을 확인할 수 있습니다.';
    });
}
function renderPreview(previousCanvas) {
    const basisScreen = screenById(doc, mode === 'edit' ? selectedScreen : runtime?.page || doc.entryScreen)||screenById(doc,doc.entryScreen);
    const device = detailDevicePreview(basisScreen),p = {...profiles[profile],...device.logical}, host = $('#preview-host');
    if (!host)
        return;
    let editorScale = zoom === 'fit' ? Math.min(1, (host.clientWidth - 48) / device.device.w, Math.max(1, host.clientHeight - 48) / device.device.h) : Number(zoom);
    editorScale = Math.max(zoom === 'fit' ? .05 : .15, editorScale);
    const scale=editorScale*device.scale;
    const box = document.createElement('div');
    box.className = 'preview-sizing';
    box.style.cssText = `width:${p.w * scale}px;height:${p.h * scale}px`;
    const current = mode === 'edit' ? screenById(doc, selectedScreen) : screenById(doc, runtime.page);
    const reuse = mode === 'edit' && current.kind === 'page' && previousCanvas?.dataset.renderMode === 'edit' && previousCanvas.dataset.renderScreen === current.id && previousCanvas.dataset.hasDemo === 'false';
    const canvas = reuse ? previousCanvas : document.createElement('div');
    canvas.dataset.renderMode = mode;
    canvas.dataset.renderScreen = current.id;
    canvas.dataset.hasDemo = String(mode === 'play' && !!demoOverlay);
    canvas.querySelector(':scope > .canvas-frame-name')?.remove();
    canvas.id = 'preview-canvas';
    canvas.className = 'preview-canvas ' + (mode === 'edit' ? 'editing-canvas' : '');
    if (mode === 'edit') {
        const label = document.createElement('span');
        label.className = 'canvas-frame-name';
        label.textContent = p.name + ' · ' + device.device.w + ' × ' + device.device.h;
        label.style.transform=`scale(${1/device.scale})`;label.style.transformOrigin='top left';label.style.top=-25/device.scale+'px';
        canvas.append(label);
    }
    canvas.style.cssText = `width:${p.w}px;height:${p.h}px;transform:scale(${scale})`;
    canvas.dataset.scale = String(scale);
    canvas.dataset.zoom=String(editorScale);canvas.dataset.deviceScale=String(device.scale);
    const previewScreen = reuse ? canvas.querySelector(':scope > .preview-screen') : document.createElement('div');
    previewScreen.className = 'preview-screen';
    const hiddenBase=overlayBaseHiddenElements(doc,mode==='play'?runtime.overlays:[],mode==='play'?demoOverlay?.presentation:undefined);
    if (mode === 'edit' && current.kind !== 'page') {
        const panel = document.createElement('div'), size = overlayRootSize(current,p);
        panel.className = 'preview-overlay ' + (current.presentation?.type || current.kind);
        panel.style.cssText = `position:absolute;width:${size.w}px;height:${size.h}px;left:${(p.w-size.w)/2}px;top:${(p.h-size.h)/2}px;bottom:auto;right:auto`;
        applyOverlayRoot(panel,presentationScreen(current,presentationMode),{view:assetView,workspaceId});
        renderElements(current, panel);
        previewScreen.append(panel);
    } else renderElements(current, previewScreen,hiddenBase);
    canvas.append(previewScreen);
    if (mode === 'play') {
        for (const [index,id] of runtime.overlays.entries()) {
            const s = screenById(doc, id);
            drawOverlay(s, s.presentation || {
                type: s.kind, effect: 'fade', durationMs: 200, dim: true, autoCloseMs: 0
            }, canvas, false, overlayBaseHiddenElements(doc,runtime.overlays.slice(index+1),demoOverlay?.presentation));
        }
        if (runtime.message) {
            const notice = document.createElement('div');
            notice.className = 'game-feedback';
            renderFeedbackNotice(notice,runtime.message,()=>{runtime.message='';render();});
            canvas.append(notice);
        }
    }
    if (mode === 'play' && demoOverlay)
        drawOverlay(demoOverlay.screen, demoOverlay.presentation, canvas, true);
    const plane = document.createElement('div');
    plane.className = 'canvas-plane';
    const planeW = Math.max(host.clientWidth, p.w * scale) + 1200, planeH = Math.max(host.clientHeight, p.h * scale) + 1200;
    plane.style.cssText = `width:${planeW}px;height:${planeH}px`;
    box.style.left = (planeW - p.w * scale) / 2 + 'px';
    box.style.top = (planeH - p.h * scale) / 2 + 'px';
    box.append(canvas);
    plane.append(box);
    host.append(plane);
    for(const panel of canvas.querySelectorAll('.preview-screen,.preview-overlay')){
        const screen=screenById(doc,panel.querySelector('.ui-element')?.dataset.screen);
        if(screen)attachScrollPins(panel,screen);
    }
    if (zoomAnchor) {
        host.scrollLeft = parseFloat(box.style.left) + zoomAnchor.x * scale - zoomAnchor.screenX;
        host.scrollTop = parseFloat(box.style.top) + zoomAnchor.y * scale - zoomAnchor.screenY;
        zoomAnchor = null;
    }
    else if (viewMemory) {
        host.scrollLeft = parseFloat(box.style.left) + viewMemory.x * scale - host.clientWidth / 2;
        host.scrollTop = parseFloat(box.style.top) + viewMemory.y * scale - host.clientHeight / 2;
    }
    else {
        host.scrollLeft = (planeW - host.clientWidth) / 2;
        host.scrollTop = (planeH - host.clientHeight) / 2;
    }
    host.classList.toggle('hand-mode', handTool || spaceDown);
    $('#scale-readout').textContent = Math.round(editorScale * 100) + '% 확대 · ' + device.device.w + '×' + device.device.h + ' · ' + Math.round(device.scale*100) + '% 비례 · ' + (mode === 'play' ? [runtime.page, ...runtime.overlays].map(id => screenById(doc, id)?.name).join(' → ') : current.name);
    if (mode === 'edit') {
        const editorSize = current.kind === 'page' ? p : overlayRootSize(current,p);
        disposeEditor = attachEditor({
            canvas, host, screen: current, ids: selectedIds.length ? selectedIds : [selectedElement].filter(Boolean), width: editorSize.w, height: editorSize.h, snap, selectable: id => editTarget(current, id, editingComponent) === id, onSelect: ids => {
                selectedIds = [...new Set(ids.map(id => editTarget(current, id, editingComponent)))];
                selectedElement = selectedIds[0] || null;
                treeTab = 'layers';
                render();
            }, onCommit: (elements, changed) => {
                if (changed) {
                    const before = clone(doc);
                    screenById(before, current.id).elements = elements;
                    pushSnapshot(undo, before);
                    redo = [];
                    dirty = true;
                }
                render();
            }
        });
    }
    const restoreScroll = () => {
        for (const n of canvas.querySelectorAll('.kind-list'))
            if (runtime.scroll[n.dataset.element] !== undefined)
                n.scrollTop = runtime.scroll[n.dataset.element];
    };
    restoreScroll();
    if (mode === 'play') {
        const panels=new Map([...canvas.querySelectorAll('[data-overlay-id]')].map(panel=>[panel.dataset.overlayId,panel]));
        activeRuntimeModal=syncOverlayFocus(doc,runtime,canvas.querySelector('.preview-screen'),panels,{previousModal:activeRuntimeModal,previousFocus:document.activeElement});
        const feedback=canvas.querySelector('.game-feedback');if(feedback&&activeRuntimeModal){activeRuntimeModal.append(feedback);feedback.querySelector('button')?.focus();}
    }
}
function flow() {
    const current = screenById(doc, selectedScreen), page = current.kind === 'page' ? current : screenById(doc, previewBase), overlayLinks = doc.transitions.filter(t => t.fromScreen === page?.id && screenById(doc, t.targetScreen)?.kind !== 'page' && t.targetScreen);
    return `<section class="flow-panel ${flowFull ? 'full' : ''}"><div class="flow-title"><button data-action="toggle-flow">${flowOpen ? '▾' : '▸'} 화면 이동 관계</button><button data-action="graph-fit">전체 맞춤</button><button data-action="flow-full">${flowFull ? '닫기' : '크게 보기'}</button></div>${flowOpen ? `<div id="ui-network" aria-label="게임 화면 이동 관계도"></div><div class="overlay-links"><b>${esc(page?.name)}에서 띄우는 공통 UI</b>${overlayLinks.map(t => `<button data-edge="${esc(t.id)}">${esc(t.label)} · ${esc(screenById(doc, t.targetScreen)?.name)}</button>`).join('') || '<span class="subtle">오른쪽 공통 연출에서 버튼에 연결하세요.</span>'}</div><details class="audit-list"><summary>누락 점검 ${audit(doc).length}건</summary>${audit(doc).map(n => `<button data-audit-screen="${esc(n.screen)}" data-audit-element="${esc(n.element || '')}">${esc(n.text)}</button>`).join('')}</details><details class="trace"><summary>시험 기록 ${runtime.trace.length}개</summary><ol>${runtime.trace.map(t => `<li>${esc(t.text)}</li>`).join('')}</ol><button data-action="export-scenario">현재 시험 기록 저장</button></details>` : ''}</section>`;
}
const flowView = createFlowView({
    onSelect: params => {
        if (params.nodes.length) {
            selectedScreen = params.nodes[0];
            previewBase = selectedScreen;
            selectedElement = null;
            selectedIds = [];
            mode = 'edit';
            render();
        }
        else if (params.edges.length) {
            const t = doc.transitions.find(t => t.id === params.edges[0]);
            selectedScreen = t.fromScreen;
            previewBase = selectedScreen;
            selectedElement = t.fromElement;
            selectedIds = [selectedElement];
            tab = 'connections';
            focusPanel('properties');
            render();
        }
    }
});
function mountGraph() {
    const container = $('#ui-network');
    if (!container)
        return flowView.release();
    flowView.mount(container, flowData(doc), selectedScreen);
}
function presentation() {
    return {
        type: demoKind, effect: demoEffect, durationMs: demoDuration, autoCloseMs: demoAuto, dim: demoDim,hideBaseElements:[...demoHideBase],...(demoRootMode==='fullscreen'?{rootMode:'fullscreen'}:{})
    };
}
function loadOverlaySettings(screen) {
    const p=screen?.presentation;
    demoKind=p?.type||screen?.kind||'modal';
    demoRootMode=p?.rootMode||'window';
    demoEffect=p?.effect||'fade';demoDuration=p?.durationMs??200;
    demoAuto=p?.autoCloseMs??0;demoDim=p?.dim??!['toast','popover'].includes(demoKind);
    demoHideBase=[...(p?.hideBaseElements||[])];
}
function chosenOverlay() {
    return overlayChoice.startsWith('builtin:') ? overlayTemplate(overlayChoice.split(':')[1], 'demo-overlay') : screenById(doc, overlayChoice) || doc.screens.find(s => s.kind !== 'page') || overlayTemplate('modal', 'demo-overlay');
}
function drawOverlay(s, p, canvas, isDemo, suppressedElements = new Set()) {
    const policy=overlayPolicy({...s,presentation:p}),motion=overlayMotion({...s,presentation:p},matchMedia('(prefers-reduced-motion: reduce)').matches);
    p={...p,...motion,dim:policy.dim};
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop ' + (p.dim ? '' : 'no-dim') + ' type-' + p.type;
    if(!policy.blocking)backdrop.style.pointerEvents='none';
    const panel = document.createElement('div');
    panel.className = 'preview-overlay ' + p.type + ' effect-' + p.effect;
    panel.style.setProperty('--motion-ms', p.durationMs + 'ms');
    panel.setAttribute('role', p.type === 'toast' ? 'status' : 'dialog');
    panel.setAttribute('aria-label', s.name);
    panel.tabIndex = -1;
    panel.style.pointerEvents='auto';
    if(!isDemo)panel.dataset.overlayId=s.id;
    if (isDemo)
        panel.dataset.demoPanel = 'true';
    applyOverlayRoot(panel,presentationScreen({...s,presentation:p},presentationMode),{
        workspaceId, view: assetView, live: mode === 'play'
    });
    renderElements({...s,presentation:p}, panel,suppressedElements);
    if (isDemo) {
        const close = document.createElement('button');
        close.className = 'demo-dismiss';
        close.dataset.action = 'demo-close';
        close.textContent = '×';
        close.setAttribute('aria-label', '공통 연출 닫기');
        panel.append(close);
    }
    backdrop.append(panel);
    canvas.append(backdrop);
}
function openDemo() {
    clearTimeout(demoTimer);
    const base = screenById(doc, selectedScreen);
    if (base?.kind === 'page')
        previewBase = base.id;
    if (mode === 'play')
        runtime.page = previewBase;
    demoOverlay = {
        screen: clone(chosenOverlay()), presentation: presentation()
    };
    render();
    if (demoAuto > 0)
        demoTimer = setTimeout(() => {
            demoOverlay = null;
            render();
        }, demoAuto);
}
function addUnit(id, position) {
    const extra = UNITS.find(u => u.id === id)?.compound ? 5 : 1;
    if (screenById(doc, selectedScreen).elements.length + extra > 400)
        return notify('화면 요소는400개까지 추가할 수 있습니다.');
    const e = createUnit(id, 'element-' + crypto.randomUUID());
    if (position)
        Object.assign(e, position);
    if (insertParentId && screenById(doc, selectedScreen).elements.some(n => n.id === insertParentId)) {
        e.parentId = insertParentId;
        if (!position) {
            e.x = 10;
            e.y = 10;
        }
    }
    edited(() => {
        const screen = screenById(doc, selectedScreen);
        screen.elements.push(e);
        if (UNITS.find(u => u.id === id)?.skin)
            constructGameUI(doc, selectedScreen, e.id);
        if (UNITS.find(u => u.id === id)?.compound) {
            decomposeImageFrame(screen, e, doc.transitions);
            doc.schemaVersion = Math.max(doc.schemaVersion, 2);
        }
        selectedElement = e.id;
        selectedIds = [e.id];
        if (treeTab !== 'units')
            treeTab = 'layers';
    });
}
function glossaryPanel() {
    return showGlossary ? `<section class="glossary-panel"><div><h2>UI 용어 · 분류 초안</h2><button data-action="glossary">닫기</button></div><p>기획 자료 기반 분류이며 상세 정의는 계속 보완합니다.</p><input id="term-search" placeholder="모달 · 토스트 팝업 · 뱃지"><div id="term-list">${termRows('')}</div></section>` : '';
}
function termRows(q) {
    return glossary.filter(t => (t.name + ' ' + t.aliases.join(' ')).includes(q)).map(t => `<article><b>${esc(t.name)}</b><small>${esc(t.category)} · ${esc(t.aliases.join(', '))}</small><p>${esc(t.reviewNote)}</p></article>`).join('') || '<p>일치하는 용어가 없습니다.</p>';
}
function render() {
    if (!doc)
        return;
    isolated = isolated.filter(id => screenById(doc, selectedScreen)?.elements.some(e => e.id === id));
    if (!screenById(doc, selectedScreen)) {
        selectedScreen = doc.entryScreen;
        selectedElement = null;
        selectedIds = [];
    }
    if(mode==='edit')rememberPresentation();
    const oldHost = $('#preview-host'), oldCanvas = $('#preview-canvas');
    if (resetView) {
        viewMemory = null;
        resetView = false;
    }
    else if (oldHost && oldCanvas) {
        const box = oldCanvas.parentElement, z = Number(oldCanvas.dataset.scale);
        viewMemory = {
            x: (oldHost.scrollLeft + oldHost.clientWidth / 2 - parseFloat(box.style.left)) / z, y: (oldHost.scrollTop + oldHost.clientHeight / 2 - parseFloat(box.style.top)) / z
        };
    }
    disposeEditor();
    disposeEditor = () => {
    };
    disposePreviewPins();
    app.innerHTML = header() + `<div class="workspace">${toolRail()}${tree()}<div class="pane-splitter" data-pane-split="left" role="separator" tabindex="0" aria-orientation="vertical" aria-label="레이어 패널 폭 조절"></div><main class="preview-main"><div class="preview-heading">${isolated.length ? `<button data-action="clear-isolation">전체 레이어 보기</button>` : ''}${insertParentId ? `<span class="insertion-note">${esc(screenById(doc, selectedScreen).elements.find(e => e.id === insertParentId)?.name || '')} 안에 추가</span>` : ''}<b>${mode === 'edit' ? '배치를 선택·조절하세요' : '버튼을 눌러 흐름을 시험하세요'}</b><small id="scale-readout"></small></div><div id="preview-host" class="preview-host"></div><p class="preview-note">Space + 드래그: 이동 · Ctrl/Cmd + 휠: 확대/축소 · V: 선택 · H: 손 도구</p></main><div class="pane-splitter" data-pane-split="right" role="separator" tabindex="0" aria-orientation="vertical" aria-label="오른쪽 패널 폭 조절"></div>${inspector()}${bottomDock()}</div>` + glossaryPanel() + shortcutPanel() + toolFlyout() + floatingPanels() + '<div class="studio-frame-resize" data-frame-resize role="button" aria-label="전체 작업 영역 크기 조절" title="끌기: 전체 작업 영역 크기 조절 · 더블클릭: 창에 맞춤">↘</div>';
    void mountPlanningActions(app.querySelector('[data-planning-actions]'), {workspaceId,projectId:doc.projectId,screenId:selectedScreen});
    void mountPlanningPanel(app.querySelector('[data-planning-host]'), {workspaceId, projectId:doc.projectId, screenId:selectedScreen, elementId:selectedElement, elements:screenById(doc,selectedScreen).elements});
    applyWorkspaceWidths();
    restoreLayerBrowser();
    renderPreview(oldCanvas);
    mountGraph();
    scheduleOverlayAutoClose();
}
function collectScroll() {
    for (const n of document.querySelectorAll('.kind-list'))
        runtime.scroll[n.dataset.element] = n.scrollTop;
}
function followRuntime() {
    selectedScreen = runtime.overlays.at(-1) || runtime.page;
    selectedElement = screenById(doc, selectedScreen)?.elements.some(e => e.id === runtime.focusReturn) ? runtime.focusReturn : null;
    tab = 'general';
}
function runElement(screen, element) {
    if (leaving)
        return;
    element = inputOwner(screenById(doc, screen), element, doc.transitions)?.id || element;
    const close = doc.transitions.find(t => t.fromScreen === screen && t.fromElement === element && t.action === 'close' && t.condition === 'always'), p = screenById(doc, screen)?.presentation;
    if (close && p?.durationMs && p.effect !== 'none') {
        leaving = true;
        const panel = [...document.querySelectorAll('#preview-canvas .preview-overlay')].at(-1);
        panel?.classList.add('leaving');
        timer = setTimeout(() => {
            leaving = false;
            runtime = activate(doc, runtime, screen, element);
            followRuntime();
            render();
        }, p.durationMs);
        return;
    }
    collectScroll();
    runtime = activate(doc, runtime, screen, element);
    followRuntime();
    render();
    if (runtime.pending) {
        const epoch = runEpoch;
        timer = setTimeout(() => {
            if (epoch !== runEpoch)
                return;
            collectScroll();
            runtime = settlePurchase(doc, runtime);
            followRuntime();
            render();
        }, 350);
    }
}
app.addEventListener('click', async (event) => {
    const clearButtonImage=event.target.closest('[data-button-clear]');
    if(clearButtonImage){const owner=buttonStateOwner(screenById(doc,selectedScreen),selection(),doc.transitions);if(mode==='edit'&&owner?.buttonState)edited(()=>{delete owner.buttonState.images?.[clearButtonImage.dataset.buttonClear];validateDocument(doc);});return;}
    const menu = event.target.closest('[data-menu-toggle]');
    if (menu) {
        if (mode === 'play') {
            runElement(menu.dataset.screen, menu.dataset.menuToggle);
        }
        else {
            const e = screenById(doc, menu.dataset.screen).elements.find(e => e.id === menu.dataset.menuToggle);
            menuState[e.id] = !(menuState[e.id] ?? e.menu.defaultOpen);
            selectedElement = e.id;
            selectedIds = [e.id];
            render();
        }
        return;
    }
    const graphEdge = event.target.closest('[data-graph-edge]'), graphScreen = event.target.closest('[data-graph-screen]');
    if (graphEdge) {
        const t = doc.transitions.find(t => t.id === graphEdge.dataset.graphEdge);
        selectedScreen = t.fromScreen;
        selectedElement = t.fromElement;
        tab = 'connections';
        mode = 'edit';
        render();
        return;
    }
    if (graphScreen) {
        selectedScreen = graphScreen.dataset.graphScreen;
        selectedElement = null;
        mode = 'edit';
        render();
        return;
    }
    const b = event.target.closest('button');
    if (event.target.closest('[data-demo-panel]')) {
        if (event.target.closest('button')) {
            clearTimeout(demoTimer);
            demoOverlay = null;
            render();
        }
        return;
    }
    if (mode === 'play' && event.target.closest('#preview-canvas')) {
        const backdrop = event.target.closest('.modal-backdrop');
        const panel = backdrop?.firstElementChild;
        const overlayId = panel?.dataset.overlayId;
        if (overlayId && (event.target === backdrop || event.target === panel && screenById(doc,overlayId)?.presentation?.rootMode === 'fullscreen')) {
            runtime = closeOverlay(doc,runtime,overlayId,{reason:'backdrop'});
            followRuntime();
            render();
            return;
        }
    }
    if (b?.dataset.tree) {
        treeTab = b.dataset.tree;
        search = '';
        render();
        return;
    }
    if (b?.dataset.leftProject) {
        workspacePrefs.leftActive = 'project';
        rememberWorkspace();
        render();
        return;
    }
    if (b?.dataset.palette) {
        focusPanel(b.dataset.palette);
        flowFull = false;
        if (palette === 'flow')
            flowOpen = true;
        if (palette === 'features') {
            render();
            await loadCatalog();
        }
        render();
        rememberWorkspace();
        return;
    }
    if (b?.dataset.workspaceMode) {
        workspacePrefs.mode = b.dataset.workspaceMode;
        workspacePrefs.groups = groupsFor(workspacePrefs.mode).map(g => g.filter(id => !workspacePrefs.leftPanels.includes(id) && !workspacePrefs.bottomPanels.includes(id)));
        workspacePrefs.weights = workspacePrefs.groups.map(() => 1);
        rememberWorkspace();
        render();
        return;
    }
    if (b?.dataset.floatPanel) {
        undockPanel(b.dataset.floatPanel);
        return;
    }
    if (b?.dataset.dockPanel) {
        dockPanel(b.dataset.dockPanel);
        return;
    }
    if (b?.dataset.toolGroup) {
        toolGroup = toolGroup === b.dataset.toolGroup ? null : b.dataset.toolGroup;
        render();
        return;
    }
    if (b?.dataset.toolUnit) {
        activeTool = b.dataset.toolUnit;
        handTool = false;
        toolGroup = null;
        status = '도구 선택: ' + (UNITS.find(u => u.id === activeTool)?.name || '') + ' · 캔버스를 드래그해 그리세요. V는 선택 도구입니다.';
        render();
        return;
    }
    if (b?.dataset.tool) {
        activeTool = b.dataset.tool;
        handTool = activeTool === 'hand';
        toolGroup = null;
        render();
        return;
    }
    if (b?.dataset.collapseLayer) {
        const id = b.dataset.collapseLayer;
        collapsedLayers.has(id) ? collapsedLayers.delete(id) : collapsedLayers.add(id);
        render();
        return;
    }
    if (b?.dataset.isolateLayer) {
        selectedElement = b.dataset.isolateLayer;
        selectedIds = [selectedElement];
        isolated = isolated.length === 1 && isolated[0] === selectedElement ? [] : [selectedElement];
        activeTool = 'select';
        render();
        return;
    }
    if (b?.dataset.editCommand) {
        performEdit(b.dataset.editCommand);
        return;
    }
    if (b?.dataset.featureAdd) {
        addFeature(b.dataset.featureAdd);
        return;
    }
    if (b?.dataset.featureBind) {
        const feature = featureCatalog?.modules.find(f => f.id === b.dataset.featureBind);
        if (!feature || selection()?.kind !== 'button')
            return;
        edited(() => {
            bindFeature(doc, selectedScreen, selectedElement, feature);
            status = '선택 버튼의 연결 정의를 변경했습니다. 되돌리기로 복원할 수 있습니다.';
        });
        return;
    }
    if (b?.dataset.unitGroup) {
        unitGroup = b.dataset.unitGroup;
        render();
        return;
    }
    if (b?.dataset.unit) {
        addUnit(b.dataset.unit);
        return;
    }
    const ui = event.target.closest('.ui-element');
    if (ui) {
        if (mode === 'edit' && activeTool !== 'select' && activeTool !== 'hand')
            return;
        if (mode === 'play') {
            const screen = screenById(doc, ui.dataset.screen);
            if (acceptsEvent(screen, doc.transitions, ui, event, $('#preview-canvas')))
                runElement(ui.dataset.screen, ui.dataset.element);
        }
        else {
            selectedScreen = ui.dataset.screen;
            selectedElement = editTarget(screenById(doc, selectedScreen), ui.dataset.element, event.altKey ? componentRoot(screenById(doc, selectedScreen), ui.dataset.element)?.id : editingComponent);
            if (event.altKey)
                editingComponent = componentRoot(screenById(doc, selectedScreen), ui.dataset.element)?.id || null;
            if (event.shiftKey) {
                const e = selection(), s = screenById(doc, selectedScreen);
                selectedIds = selectedIds.filter(id => (s.elements.find(n => n.id === id)?.parentId || null) === (e.parentId || null));
                selectedIds = selectedIds.includes(e.id) ? selectedIds.filter(id => id !== e.id) : [...selectedIds, e.id];
            }
            else
                selectedIds = [selectedElement];
            treeTab = 'layers';
            showLayerPanel();
            render();
        }
        return;
    }
    if (!b)
        return;
    if (b.dataset.screen) {
        isolated = [];
        insertParentId = null;
        activeTool = 'select';
        selectedScreen = b.dataset.screen;
        const chosen = screenById(doc, selectedScreen);
        if (chosen.kind === 'page') previewBase = selectedScreen;
        else {
            if (screenById(doc, previewBase)?.kind !== 'page') previewBase = doc.entryScreen;
            overlayChoice = chosen.id;
            loadOverlaySettings(chosen);
        }
        selectedElement = null;
        selectedIds = [];
        demoOverlay = null;
        mode = 'edit';
        render();
        return;
    }
    if (b.dataset.element) {
        activeTool = 'select';
        handTool = false;
        insertParentId = null;
        const id = b.dataset.element, screen = screenById(doc, selectedScreen), element = screen.elements.find(e => e.id === id);
        if (event.shiftKey || event.metaKey || event.ctrlKey) {
            selectedIds = selectedIds.filter(key => (screen.elements.find(e => e.id === key)?.parentId || null) === (element.parentId || null));
            selectedIds = selectedIds.includes(id) ? selectedIds.filter(key => key !== id) : [...selectedIds, id];
        }
        else
            selectedIds = [id];
        selectedElement = id;
        editingComponent = componentRoot(screen, id)?.id || null;
        showLayerPanel();
        render();
        return;
    }
    if (b.dataset.tab) {
        focusPanel('properties');
        tab = b.dataset.tab;
        render();
        return;
    }
    if (b.dataset.target) {
        selectedScreen = b.dataset.target;
        selectedElement = null;
        mode = 'edit';
        flowFull = false;
        render();
        return;
    }
    if (b.dataset.edge) {
        focusPanel('properties');
        const t = doc.transitions.find(t => t.id === b.dataset.edge);
        selectedScreen = t.fromScreen;
        selectedElement = t.fromElement;
        tab = 'connections';
        mode = 'edit';
        render();
        return;
    }
    if (b.dataset.auditScreen) {
        selectedScreen = b.dataset.auditScreen;
        selectedElement = b.dataset.auditElement || null;
        tab = 'connections';
        mode = 'edit';
        render();
        return;
    }
    if (b.dataset.removeEdge) {
        edited(() => doc.transitions = doc.transitions.filter(t => t.id !== b.dataset.removeEdge));
        return;
    }
    if (b.dataset.add) {
        const s = screenById(doc, selectedScreen);
        edited(() => {
            const e = {
                id: 'element-' + crypto.randomUUID(), name: '새 ' + kinds[b.dataset.add], kind: b.dataset.add, x: 10, y: 30, w: 80, h: 10, text: '새 ' + kinds[b.dataset.add], purpose: '', info: ''
            };
            s.elements.push(e);
            selectedElement = e.id;
        });
        return;
    }
    if (b.dataset.align) {
        const e = selection();
        if (e)
            edited(() => {
                const screen = screenById(doc, selectedScreen), size = rootSize(screen);
                alignElement(screen, e, b.dataset.align, size.w, size.h);
            });
        return;
    }
    switch (b.dataset.action) {
        case 'project-folders':
            await showProjectManager();
            break;
        case 'preview-current':
            openCurrentPreview();
            break;
        case 'design-guide': {
            const screenId = selectedScreen, size = rootSize(screenById(doc,screenId));
            const selectGuidePart = id => {
                const screen = screenById(doc,screenId);
                if(id!==null&&!screen.elements.some(e=>e.id===id))return;
                selectedScreen=screenId;selectedElement=id;selectedIds=id?[id]:[];
                editingComponent=id?componentRoot(screen,id)?.id||null:null;
                mode='edit';focusPanel('properties');tab='layout';render();
            };
            try { openDesignGuide({document:clone(doc),screenId,elementId:selectedElement,workspaceId,size,presentationMode,context:{projectName:folderProject?.name || '공용 저장공간',dirty},onNavigate:selection=>{
                presentationMode=selection.presentationMode;
                if(selection.stage==='overview') location.assign(designURL('canvas',{workspaceId,projectId:doc.projectId,...selection}));
                else selectGuidePart(selection.elementId);
            },onPreview:selection=>openCurrentPreview(selection),onPresentationChange:value=>{presentationMode=value;rememberPresentation();render();},onChange:change=>{
                if(!edited(()=>{doc=applyDesignGuideChange(doc,screenId,change.elementId,change,size);}))throw Error(status||'가이드 변경을 적용하지 못했습니다.');
                assetView='art';return clone(doc);
            },onImportImage:input=>importGuideImage(input,workspaceId),onSelect:selectGuidePart,onEdit:selectGuidePart}); }
            catch(error){notify(error.message);}
            break;
        }
        case 'manual':
            await openManual({workspaceId});
            break;
        case 'build-current-ui':
            if (!screenById(doc, 'lobby-common'))
                return notify('파일·공유에서 기존 로비 설계를 열어 주세요.');
            selectedScreen = 'lobby-common';
            previewBase = selectedScreen;
            mode = 'edit';
            try {
                const before = clone(doc);
                constructGameUI(doc, selectedScreen);
                validateDocument(doc);
                pushSnapshot(undo, before);
                redo = [];
                dirty = true;
                assetView = 'art';
                treeTab = 'layers';
                selectedElement = 'menu-shop';
                selectedIds = [selectedElement];
                showLayerPanel();
                render();
            }
            catch (err) {
                notify(err.message);
            }
            break;
        case 'parts-demo':
            if (dirty && !confirm('미저장 수정이 있습니다. 부품 예제로 바꿀까요?'))
                return;
            setDoc(createPartsDemo('parts-' + crypto.randomUUID().slice(0, 8)), null);
            dirty = true;
            treeTab = 'layers';
            selectedElement = 'action-card';
            selectedIds = [selectedElement];
            showLayerPanel();
            mode = 'edit';
            render();
            break;
        case 'decompose-parts': {
            const s = screenById(doc, selectedScreen), e = selection();
            const before = clone(doc);
            try {
                decomposeImageFrame(s, e, doc.transitions);
                doc.schemaVersion = Math.max(doc.schemaVersion, 2);
                validateDocument(doc);
                pushSnapshot(undo, before);
                redo = [];
                dirty = true;
                editingComponent = null;
                treeTab = 'layers';
                render();
            }
            catch (err) {
                doc = before;
                notify(err.message);
            }
            break;
        }
        case 'parts-enter':
            editingComponent = componentRoot(screenById(doc, selectedScreen), selectedElement)?.id || null;
            treeTab = 'layers';
            render();
            break;
        case 'parts-exit':
            selectedElement = componentRoot(screenById(doc, selectedScreen), selectedElement)?.id || selectedElement;
            selectedIds = [selectedElement];
            editingComponent = null;
            render();
            break;
        case 'image-assets-load':
            try { workspaceAssets = (await api('assets')).assets; render(); }
            catch (error) { notify(error.message); }
            break;
        case 'image-region-apply':
            try {
                const e = selection();
                if (!e?.image?.sourceSize) break;
                const values = [...app.querySelectorAll('[data-image-region]')].map(n => n.value === '' ? NaN : Number(n.value));
                const image = {...e.image, region: values};
                validateImageRegion(image);
                edited(() => { e.image = image; });
            } catch (err) { notify(err.message); }
            break;
        case 'image-region-reset':
            if (selection()?.image) edited(() => { delete selection().image.region; });
            break;
        case 'image-clear':
            if (selection()?.image)
                edited(() => {
                    selection().image.src = '';
                    delete selection().image.asset;
                    delete selection().image.assetRef;
                    delete selection().image.region;
                    delete selection().image.sourceSize;
                });
            break;
        case 'wireframe-style':
            edited(() => {
                applyWireframeStyle(doc);
                status = '클릭 요소는 타원, 표시/영역은 직각·1px 선으로 정리했습니다.';
            });
            break;
        case 'frame-fit':
            workspacePrefs.frame = null;
            resetView = true;
            rememberWorkspace();
            render();
            break;
        case 'apply-frame': {
            const w = Number(document.querySelector('[data-frame-size=w]').value), h = Number(document.querySelector('[data-frame-size=h]').value);
            if (!Number.isFinite(w) || !Number.isFinite(h) || w < 760 || h < 500)
                return notify('작업 영역은 최소 760×500px입니다.');
            workspacePrefs.frame = {
                w, h
            };
            resetView = true;
            rememberWorkspace();
            render();
            break;
        }
        case 'dock-all':
            workspacePrefs.floats = {};
            rememberWorkspace();
            render();
            break;
        case 'create-menu':
            createMenu();
            break;
        case 'arrange-children':
            arrangeMenu();
            break;
        case 'apply-transform':
            applyQuickTransform();
            break;
        case 'unit-library':
            toolGroup = toolGroup ? '' : '전체';
            render();
            break;
        case 'show-flow':
            focusPanel('flow');
            flowOpen = true;
            flowFull = false;
            render();
            break;
        case 'clear-isolation':
            isolated = [];
            render();
            break;
        case 'isolate-selection':
            isolated = isolated.length ? [] : picked();
            render();
            break;
        case 'add-child':
            if (isContainer(selection())) {
                insertParentId = selectedElement;
                toolGroup = '전체';
                render();
            }
            break;
        case 'clear-insertion':
            insertParentId = null;
            render();
            break;
        case 'layer-root':
            nestPicked('');
            break;
        case 'shortcuts':
            showShortcuts = !showShortcuts;
            render();
            break;
        case 'catalog-retry':
            featureCatalog = null;
            await loadCatalog();
            render();
            break;
        case 'lobby-design': {
            await loadCatalog();
            if (!featureCatalog)
                return notify(featureError || '기능 목록을 먼저 읽어주세요.');
            if (dirty && !confirm('현재 미저장 수정이 있습니다. 먼저 저장하거나 내보낸 뒤 새 로비 설계로 전환해 주세요. 계속할까요?'))
                break;
            const d = createLobbyDesign(featureCatalog, 'lobby-' + crypto.randomUUID().slice(0, 8));
            setDoc(d, null);
            dirty = true;
            palette = 'features';
            status = '공통 설정 기반 로비 배치 초안입니다. 3D 없이 영역만 표시합니다.';
            render();
            break;
        }
        case 'zoom-out':
            zoom = String(Math.max(.15, Number($('#preview-canvas').dataset.zoom) / 1.2));
            render();
            break;
        case 'zoom-in':
            zoom = String(Math.min(4, Number($('#preview-canvas').dataset.zoom) * 1.2));
            render();
            break;
        case 'canvas-fit':
            zoom = 'fit';
            resetView = true;
            render();
            break;
        case 'hand':
            activeTool = 'select';
            handTool = !handTool;
            render();
            break;
        case 'page-layers':
            selectedScreen = previewBase;
            selectedElement = null;
            selectedIds = [];
            render();
            break;
        case 'graph-fit':
            flowView.fit();
            break;
        case 'demo-open':
            openDemo();
            break;
        case 'demo-close':
            clearTimeout(demoTimer);
            demoOverlay = null;
            render();
            break;
        case 'apply-overlay-settings': {
            if(overlayChoice.startsWith('builtin:'))break;
            edited(()=>{
                doc=updateOverlayPresentation(doc,overlayChoice,presentation());
                status='공통 설정을 적용했습니다. 파일 저장으로 보관하세요.';
            });
            break;
        }
        case 'bind-overlay': {
            const e = selection();
            if (e?.kind !== 'button')
                break;
            const source = selectedScreen;
            if (screenById(doc, source).kind !== 'page')
                return notify('기준 게임 화면의 버튼을 선택하세요.');
            edited(() => {
                let target = chosenOverlay();
                if (overlayChoice.startsWith('builtin:') || !doc.screens.some(s => s.id === target.id)) {
                    target = overlayTemplate(demoKind, 'common-' + crypto.randomUUID());
                    if(doc.schemaVersion===4)target.logicalSize={...screenById(doc,source).logicalSize};
                    doc.screens.push(target);
                    doc.transitions.push({
                        id: 'edge-' + crypto.randomUUID(), fromScreen: target.id, fromElement: target.elements.at(-1).id, event: 'click', action: 'close', condition: 'always', label: '닫고 원래 화면 유지', returnPolicy: '선택/스크롤 유지'
                    });
                    overlayChoice = target.id;
                }
                doc=updateOverlayPresentation(doc,target.id,presentation());
                doc.transitions = doc.transitions.filter(t => t.fromElement !== e.id);
                doc.transitions.push({
                    id: 'edge-' + crypto.randomUUID(), fromScreen: source, fromElement: e.id, event: 'click', action: 'open', condition: 'always', targetScreen: target.id, label: e.name + ' → ' + target.name, returnPolicy: '원래 화면 선택/스크롤 유지'
                });
                status = '이 버튼의 동작을 공통 연출로 지정했습니다. 이전 동작은 되돌리기로 복원할 수 있습니다.';
            });
            break;
        }
        case 'overlay-content': {
            if (overlayChoice.startsWith('builtin:'))
                return notify('먼저 화면의 버튼에 연결하면 공통 내용을 편집할 수 있습니다.');
            const target = chosenOverlay();
            if (screenById(doc, selectedScreen)?.kind === 'page')
                previewBase = selectedScreen;
            selectedScreen = target.id;
            selectedElement = null;
            selectedIds = [];
            treeTab = 'layers';
            mode = 'edit';
            demoOverlay = null;
            focusPanel('properties');
            render();
            break;
        }
        case 'baseline-capture':
            await captureBaseline();
            break;
        case 'baseline-list':
            await refreshBaselines();
            break;
        case 'save':
            await save();
            break;
        case 'reopen':
            await openSaved(doc.projectId);
            break;
        case 'edit':
            mode = 'edit';
            resetRuntime();
            render();
            break;
        case 'play':
            isolated = [];
            activeTool = 'select';
            handTool = false;
            mode = 'play';
            resetRuntime();
            if (screenById(doc, selectedScreen).kind === 'page')
                runtime.page = selectedScreen;
            render();
            break;
        case 'restart-test':
            resetRuntime();
            mode = 'play';
            render();
            break;
        case 'undo':
            wheelRun = null;
            if (undo.length) {
                pushSnapshot(redo, clone(doc));
                doc = undo.pop();
                doc.revision = expectedRevision ?? 0;
                dirty = true;
                render();
            }
            break;
        case 'redo':
            wheelRun = null;
            if (redo.length) {
                pushSnapshot(undo, clone(doc));
                doc = redo.pop();
                doc.revision = expectedRevision ?? 0;
                dirty = true;
                render();
            }
            break;
        case 'grid':
            grid = !grid;
            workspacePrefs.guides = grid;
            rememberWorkspace();
            render();
            break;
        case 'snap':
            snap = !snap;
            render();
            break;
        case 'toggle-flow':
            flowOpen = !flowOpen;
            render();
            break;
        case 'flow-full':
            flowFull = !flowFull;
            flowOpen = true;
            render();
            break;
        case 'add-edge': {
            const e = selection();
            if (e)
                edited(() => doc.transitions.push({
                    id: 'edge-' + crypto.randomUUID(), fromScreen: selectedScreen, fromElement: e.id, event: 'click', action: 'feedback', condition: 'unknown', label: '새 행동', payload: {
                        message: '시험 안내'
                    }, returnPolicy: '미정'
                }));
            break;
        }
        case 'delete-screen': {
            const trial = clone(doc), removed = selectedScreen;
            removeScreen(trial, removed);
            validateDocument(trial);
            edited(() => {
                doc = trial; selectedScreen = doc.entryScreen;
                selectedElement = null; selectedIds = []; isolated = []; demoOverlay = null;
                if (previewBase === removed) previewBase = doc.entryScreen;
                if (overlayChoice === removed) overlayChoice = 'builtin:modal';
                treeTab = 'screens';
            });
            break;
        }
        case 'delete-element':
            deletePicked();
            break;
        case 'convert-screen': {
            if (mode !== 'edit') break;
            if ($('#convert-screen-kind').value !== 'modal')
                return notify('팝업 · 화면 전체를 선택한 뒤 적용하세요.');
            const name = $('#convert-screen-name').value;
            edited(() => {
                doc = convertPageToModal(doc, selectedScreen, {name});
                if (screenById(doc, previewBase)?.kind !== 'page') previewBase = doc.entryScreen;
                overlayChoice = selectedScreen;
                const p = screenById(doc, selectedScreen).presentation;
                demoKind = p.type; demoRootMode = p.rootMode; demoEffect = p.effect;
                demoDuration = p.durationMs; demoAuto = p.autoCloseMs; demoDim = p.dim;
                demoHideBase=[...(p.hideBaseElements||[])];
                resetRuntime();
            });
            break;
        }
        case 'new-screen': {
            const name = $('#new-screen-name').value.trim(), kind = $('#new-screen-kind').value;
            if (!name)
                return notify('새 화면의 이름을 입력하세요.');
            edited(() => {
                const s = {
                    id: 'screen-' + crypto.randomUUID(), name, kind, purpose: '', elements: []
                };
                if(doc.schemaVersion===4){
                    const selected=screenById(doc,selectedScreen),basis=selected?.kind==='page'?selected:screenById(doc,doc.entryScreen);
                    s.logicalSize={w:basis.logicalSize.w,h:basis.logicalSize.h};
                }
                doc.screens.push(s);
                selectedScreen = s.id;
                selectedElement = null;
            });
            break;
        }
        case 'new-project': {
            if (dirty && !confirm('현재 수정을 보관하려면 먼저 저장하세요. 새 설계로 바꿀까요?'))
                break;
            setDoc({
                schemaVersion: 1, projectId: 'ux-' + crypto.randomUUID().slice(0, 8), revision: 0, name: '새 UX 설계', entryScreen: 'main', screens: [{
                        id: 'main', name: '첫 화면', kind: 'page', purpose: '', elements: []
                    }], transitions: [], fixtures: {
                    balance: 0, items: []
                }
            }, null);
            dirty = true;
            render();
            break;
        }
        case 'export':
            download(doc.projectId + '.json', JSON.stringify(doc));
            break;
        case 'context':
            download(doc.projectId + '-선택정보.json', {
                projectId: doc.projectId, revision: expectedRevision, hasUnsavedChanges: dirty, profile: profiles[profile], screenId: selectedScreen, elementId: selectedElement, element: selection(), component: componentRoot(screenById(doc, selectedScreen), selectedElement), parts: screenById(doc, selectedScreen).elements.filter(e => e.parentId === componentRoot(screenById(doc, selectedScreen), selectedElement)?.id), inputOwner: inputOwner(screenById(doc, selectedScreen), selectedElement, doc.transitions)?.id || null, transitions: doc.transitions.filter(t => t.fromElement === selectedElement), document: doc
            });
            notify('선택 정보 파일을 만들었습니다. 이 파일과 변경 요청을 같은 채팅에 전달하세요.');
            break;
        case 'export-plan':
            download(doc.projectId + '-UI기획.md', handoffMarkdown(doc,{workspaceId,workspaceName:folderProject?.name||null,directory:folderProject?.directory||null,dirty}), 'text/markdown;charset=utf-8');
            break;
        case 'export-handoff':
            download(doc.projectId + '-UI연결명세.json',buildHandoff(doc,{workspaceId,workspaceName:folderProject?.name||null,directory:folderProject?.directory||null,dirty}));
            break;
        case 'export-scenario':
            download(doc.projectId + '-동작시험.json', {
                projectId: doc.projectId, revision: expectedRevision, profile: profiles[profile], result: runtime
            });
            break;
        case 'glossary':
            showGlossary = !showGlossary;
            render();
            break;
    }
});
app.addEventListener('change', async (event) => {
    if (event.target.matches('[data-control-field]')) {
        const e = selection();
        if (e) edited(() => {const next=applyControlConfig(e,event.target.dataset.controlField,event.target.type === 'checkbox' ? event.target.checked : event.target.value); if(next.control)e.control=next.control;else delete e.control;});
        return;
    }
    const input = event.target;
    if(input.matches('[data-tab-project-image]') || input.matches('[data-tab-image]') && input.files[0]){
        const design=doc,screenId=selectedScreen,id=selectedElement,element=selection(),control=element?.control,state=input.dataset.tabProjectImage || input.dataset.tabImage;
        if(mode!=='edit'||control?.type!=='tabs')return;
        const current=()=>doc===design&&selectedScreen===screenId&&selectedElement===id&&mode==='edit'&&selection()===element&&element.control===control;
        try{
            let texture,asset;
            if(input.matches('[data-tab-project-image]')){
                const image=await importGuideImage({path:input.value.trim()},workspaceId);
                texture={src:'',assetRef:image.assetRef,w:image.sourceSize[0],h:image.sourceSize[1]};
            }else{
                const src=await readImageFile(input.files[0]),image=new Image();image.src=src;await image.decode();
                if(image.naturalWidth>4096||image.naturalHeight>4096)throw Error('프레임 이미지는4096px 이하입니다.');
                if(!current())return;
                asset=await uploadImageAsset(input.files[0],workspaceId);
                if(asset.width!==image.naturalWidth||asset.height!==image.naturalHeight)throw Error('프레임 이미지 원본 크기가 다릅니다.');
                texture={src:'',assetRef:asset.assetRef,w:asset.width,h:asset.height};
            }
            if(!current())return notify('선택 또는 설계가 바뀌어 탭 이미지 교체를 취소했습니다.');
            const next=applyTabTexture(element,state,texture);
            edited(()=>{element.control=next.control;});
            if(asset)workspaceAssets=[...workspaceAssets.filter(item=>item.assetRef!==asset.assetRef),asset];
        }catch(error){notify(error.message);}
        return;
    }
    if(input.matches('[data-responsive-field]')){
        const screen=screenById(doc,selectedScreen);
        edited(()=>doc=applyResponsiveEdit(doc,selectedScreen,selection()?.id,input.dataset.responsiveField,input.type==='checkbox'?input.checked:input.value,rootSize(screen)));
        return;
    }
    if (input.matches('[data-skin-image]') && input.files[0] || input.matches('[data-skin-project-image]')) {
        const design = doc, screenId = selectedScreen, id = selectedElement, screen = screenById(doc, screenId), root = skinEditTarget(screen, selection()), skin = root?.skin, state = skinState;
        if (mode !== 'edit' || !skin)
            return;
        const current = () => doc === design && selectedScreen === screenId && selectedElement === id && mode === 'edit' && screen.elements.includes(root) && root.skin === skin && skinEditTarget(screen, selection()) === root;
        try {
            let texture, asset;
            if (input.matches('[data-skin-project-image]')) {
                const image = await importGuideImage({path:input.value.trim()}, workspaceId);
                texture = {src:'',assetRef:image.assetRef,w:image.sourceSize[0],h:image.sourceSize[1]};
            } else {
                const src = await readImageFile(input.files[0]), img = new Image();
                img.src = src;
                await img.decode();
                if (img.naturalWidth > 4096 || img.naturalHeight > 4096)
                    throw Error('프레임 이미지는4096px 이하입니다.');
                if (!current()) return;
                asset = await uploadImageAsset(input.files[0], workspaceId);
                if (asset.width !== img.naturalWidth || asset.height !== img.naturalHeight) throw Error('프레임 이미지 원본 크기가 다릅니다.');
                texture = {src:'',assetRef:asset.assetRef,w:asset.width,h:asset.height};
            }
            if (!current()) return notify('선택 또는 설계가 바뀌어 프레임 이미지 교체를 취소했습니다.');
            if (asset) workspaceAssets = [...workspaceAssets.filter(item => item.assetRef !== asset.assetRef), asset];
            const before = clone(doc);
            skin.textures = {...skin.textures, [state]:texture};
            try {
                validateDocument(doc);
                if (new TextEncoder().encode(JSON.stringify(doc)).length > 2000000)
                    throw Error('전체 설계는2MB 이하입니다.');
            }
            catch (err) {
                doc = before;
                throw err;
            }
            pushSnapshot(undo, before);
            redo = [];
            dirty = true;
            render();
        }
        catch (err) {
            notify(err.message);
        }
        return;
    }
    if (input.matches('[data-inset]')) {
        const e = selection();
        if (!e?.inset)
            return;
        const before = clone(doc);
        e.inset[Number(input.dataset.inset)] = Number(input.value);
        try {
            validateDocument(doc);
            pushSnapshot(undo, before);
            redo = [];
            dirty = true;
            render();
        }
        catch (err) {
            doc = before;
            notify(err.message);
        }
        return;
    }
    if (input.matches('[data-skin-mode]')) {
        const selected = selection();
        if (mode !== 'edit' || selected?.kind !== 'panel') return;
        edited(() => {
            if (input.value === 'none') delete selected.skin;
            else {
                if (!['backplate','button'].includes(input.value)) throw Error('프레임 방식을 확인하세요.');
                selected.skin = createSkin(input.value);
                doc.schemaVersion = Math.max(doc.schemaVersion, 3);
            }
            validateDocument(doc);
        });
        return;
    }
    if (input.matches('[data-skin-state]')) {
        skinState = input.value;
        render();
        return;
    }
    if (input.matches('[data-skin-field]')) {
        const root = skinEditTarget(screenById(doc, selectedScreen), selection());
        if (mode !== 'edit' || !root?.skin)
            return;
        const before = clone(doc), key = input.dataset.skinField;
        try {
            if (key === 'preset')
                root.skin = createSkin(input.value);
            else if (key.includes('.')) {
                const [k, i] = key.split('.');
                root.skin[k][Number(i)] = Number(input.value);
            }
            else
                root.skin[key] = input.value;
            if (key.startsWith('padding.')) {
                const face = screenById(doc, selectedScreen).elements.find(e => e.parentId === root.id && e.partRole === 'background');
                if (face)
                    face.inset = root.skin.padding.slice();
            }
            doc.schemaVersion = Math.max(doc.schemaVersion, 3);
            validateDocument(doc);
            pushSnapshot(undo, before);
            redo = [];
            dirty = true;
            render();
        }
        catch (err) {
            doc = before;
            notify(err.message);
        }
        return;
    }
    if (input.matches('[data-button-preview]')) {
        if(Object.hasOwn(BUTTON_STATES,input.value)){buttonPreview=input.value;render();}return;
    }
    if (input.matches('[data-button-field]')) {
        const owner=buttonStateOwner(screenById(doc,selectedScreen),selection(),doc.transitions);
        if(mode!=='edit'||!owner)return;
        const key=input.dataset.buttonField;
        if(!owner.buttonState&&!(key==='enabled'&&input.checked))return;
        edited(()=>{
            const config=owner.buttonState||createButtonState();owner.buttonState=config;
            if(key.startsWith('pressFeedback.')){
                const candidates=buttonMotionTargets(screenById(doc,selectedScreen),owner,doc.transitions);
                if(!candidates.length)throw Error('먼저 버튼 안에 비입력 앞면 그룹 또는 이미지·글자를 만드세요.');
                const depth=config.pressFeedback||{enabled:false,target:candidates.find(e=>e.id===config.targetGraphic)?.id||candidates[0].id,distance:3,shadow:{enabled:true,color:'#000000',opacity:.12,x:0,y:1,blur:1}};
                config.pressFeedback=depth;
                if(key==='pressFeedback.enabled')depth.enabled=input.checked;
                else if(key==='pressFeedback.target')depth.target=input.value;
                else if(key==='pressFeedback.distance')depth.distance=input.value.trim()?Number(input.value):NaN;
                else if(key.startsWith('pressFeedback.shadow.')){
                    const field=key.slice('pressFeedback.shadow.'.length);
                    if(!['enabled','color','opacity','x','y','blur'].includes(field))throw Error('눌림 그림자 항목을 확인하세요.');
                    depth.shadow={enabled:true,color:'#000000',opacity:.12,x:0,y:1,blur:1,...depth.shadow,[field]:field==='enabled'?input.checked:field==='color'?input.value:input.value.trim()?Number(input.value):NaN};
                }else throw Error('눌림 깊이 항목을 확인하세요.');
            }
            else if(key.startsWith('tints.'))config.tints={...config.tints,[key.slice(6)]:input.value};
            else config[key]=['enabled','selectable','selected'].includes(key)?input.checked:input.value;
            validateDocument(doc);
        });return;
    }
    if (input.matches('[data-button-image]')) {
        const source=doc,screenId=selectedScreen,selectedId=selectedElement,owner=buttonStateOwner(screenById(doc,screenId),selection(),doc.transitions),config=owner?.buttonState,state=buttonPreview;
        if(mode!=='edit'||!config?.enabled||config.mode!=='image')return;
        const signature=JSON.stringify(config);
        try{
            const image=await importGuideImage(input.dataset.buttonImage==='path'?{path:input.value.trim()}:{file:input.files?.[0]},workspaceId);
            if(doc!==source||selectedScreen!==screenId||selectedElement!==selectedId||buttonPreview!==state||JSON.stringify(owner.buttonState)!==signature||mode!=='edit')return notify('선택 또는 상태가 바뀌어 버튼 이미지 교체를 취소했습니다.');
            edited(()=>{config.images={...config.images,[state]:image};validateDocument(doc);});
        }catch(error){notify(error.message);}return;
    }
    if (input.matches('[data-notification-field]')) {
        const selected=selection();
        if(mode!=='edit'||selected?.partRole!=='badge')return;
        const key=input.dataset.notificationField;
        if(!selected.notification&&key==='enabled'&&input.checked===false)return;
        edited(()=>{
            if(key!=='enabled'&&!selected.notification?.enabled)throw Error('먼저 알림 배지를 켜세요.');
            const notification=notificationConfig(selected);
            if(['enabled','hideZero'].includes(key)){
                if(typeof input.checked!=='boolean')throw Error('알림 배지의 체크 값을 확인하세요.');
                notification[key]=input.checked;
            }else if(key==='mode')notification.mode=input.value;
            else if(['value','maxDisplay'].includes(key)){
                if(typeof input.value!=='string'||!input.value.trim()||!Number.isFinite(Number(input.value)))throw Error('알림 배지 수치를 입력하세요.');
                notification[key]=Number(input.value);
            }else if(key==='valueKey'){
                const value=input.value.trim();if(value)notification.valueKey=value;else delete notification.valueKey;
            }else throw Error('알림 배지 항목을 확인하세요.');
            selected.notification=notification;validateDocument(doc);
        });
        return;
    }
    if (input.matches('[data-shadow-field]')) {
        const selected = selection();
        if (mode !== 'edit' || !selected) return;
        edited(() => {
            const key = input.dataset.shadowField, shadow = shadowConfig(selected);
            if (key === 'enabled') {
                if (typeof input.checked !== 'boolean') throw Error('그림자 켜짐 값을 확인하세요.');
                shadow.enabled = input.checked;
            } else if (key === 'color') shadow.color = input.value;
            else if (['opacity','x','y','blur'].includes(key)) {
                if (typeof input.value !== 'string' || !input.value.trim() || !Number.isFinite(Number(input.value))) throw Error('그림자 수치를 입력하세요.');
                shadow[key] = Number(input.value);
            } else throw Error('그림자 항목을 확인하세요.');
            selected.effects = {...selected.effects, shadow};
            validateDocument(doc);
        });
        return;
    }
    if (input.matches('[data-presentation-mode]')) {
        presentationMode = normalizePresentationMode(input.value,workspaceId);
        rememberPresentation();
        render();
        return;
    }
    if (input.matches('[data-asset-view]')) {
        assetView = input.value;
        render();
        return;
    }
    if ((input.matches('[data-image-file]') && input.files[0]) || input.matches('[data-project-image]') || input.matches('[data-workspace-image]')) {
        const design = doc, screenId = selectedScreen, id = selectedElement;
        try {
            let file = input.files?.[0];
            if (input.matches('[data-workspace-image]')) {
                if (!input.value) return;
                const response = await fetch(assetUrl(input.value, workspaceId), {cache:'no-store', redirect:'error'});
                if (!response.ok) throw Error('저장된 이미지 자원 파일을 읽지 못했습니다.');
                file = await response.blob();
            }
            if (input.matches('[data-project-image]')) {
                const path = input.value.trim();
                if (!/^\/ui-studio\/source\/assets\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|webp)$/.test(path))
                    throw Error('이 프로젝트 UI 자원의 PNG/JPEG/WebP 경로만 넣으세요.');
                const response = await fetch(path, { redirect: 'error', signal: AbortSignal.timeout(10000) });
                if (!response.ok) throw Error('프로젝트 이미지를 읽지 못했습니다.');
                file = await response.blob();
            }
            const src = await readImageFile(file), img = new Image();
            img.src = src;
            await img.decode();
            if (img.naturalWidth > 4096 || img.naturalHeight > 4096) throw Error('이미지는4096px 이하입니다.');
            if (doc !== design) return notify('설계가 바뀌어 이미지 교체를 취소했습니다.');
            const asset = await uploadImageAsset(file, workspaceId);
            if (asset.width !== img.naturalWidth || asset.height !== img.naturalHeight) throw Error('이미지 원본 크기가 다릅니다.');
            if (doc !== design) return notify('설계가 바뀌어 이미지 교체를 취소했습니다.');
            workspaceAssets = [...workspaceAssets.filter(item => item.assetRef !== asset.assetRef), asset];
            const e = screenById(doc, screenId)?.elements.find(e => e.id === id);
            if (!e || !['image', 'panel', 'button', 'card'].includes(e.kind))
                return;
            const before = clone(doc);
            doc.schemaVersion = Math.max(doc.schemaVersion, 2);
            e.image = {
                ...(e.image?.topArchHeight !== undefined ? {topArchHeight: e.image.topArchHeight} : {}),
                ...(e.image?.preserveColor ? {preserveColor: true} : {}),
                src: '', assetRef: asset.assetRef, sourceSize: [asset.width, asset.height], alt: e.image?.alt || e.name, fit: e.image?.fit || 'contain'
            };
            try {
                validateDocument(doc);
                if (new TextEncoder().encode(JSON.stringify(doc)).length > 2000000)
                    throw Error('전체 설계는2MB 이하여야 합니다.');
            }
            catch (err) {
                doc = before;
                throw err;
            }
            pushSnapshot(undo, before);
            redo = [];
            dirty = true;
            assetView = 'art';
            render();
        }
        catch (err) {
            notify(err.message);
        }
        return;
    }
    if (input.matches('[data-part-field]')) {
        const e = selection();
        if (!e)
            return;
        const before = clone(doc);
        try {
            doc.schemaVersion = Math.max(doc.schemaVersion, 2);
            const key = input.dataset.partField;
            if (key === 'partRole')
                changePartType(e, key, input.value);
            else if (key.startsWith('image.'))
                e.image = {
                    src: '', alt: e.name, fit: 'contain', ...e.image, [key.slice(6)]: key === 'image.topArchHeight' ? (input.value.trim() ? Number(input.value) : NaN) : key === 'image.preserveColor' ? input.checked : input.value
                };
            else
                e.interaction = {
                    mode: inputMode(e, doc.transitions), enabled: true, shape: 'rectangle', reason: '', ...e.interaction, [key]: input.type === 'checkbox' ? input.checked : input.value
                };
            if (key === 'mode' && input.value !== 'action') delete e.buttonState;
            if (key === 'image.asset') {
                delete e.image.assetRef;
                delete e.image.region;
                delete e.image.sourceSize;
                if (!input.value)
                    delete e.image.asset;
                else
                    e.image.src = '';
            }
            validateDocument(doc);
            pushSnapshot(undo, before);
            redo = [];
            dirty = true;
            render();
        }
        catch (err) {
            doc = before;
            notify(err.message);
        }
        return;
    }
    if (input.matches('[data-transform-unit]')) {
        transformUnit = input.value;
        render();
        return;
    }
    if (input.matches('[data-quick-shape]')) {
        const e = selection();
        if (e && Object.hasOwn(SHAPES, input.value))
            edited(() => {
                e.appearance = {
                    ...e.appearance, shape: input.value, ...(input.value === 'rounded' ? {
                        radius: e.appearance?.radius || 12
                    } : {})
                };
            });
        return;
    }
    if (input.matches('[data-menu-default]')) {
        const e = selection();
        if (e?.menu)
            edited(() => {
                e.menu.defaultOpen = input.checked;
                delete menuState[e.id];
            });
        return;
    }
    if (input.matches('[data-transform-field]')) {
        const e = selection();
        if (!e||!percentRectEditable(screenById(doc,selectedScreen),e))
            return;
        try {
            const trial = clone(doc), screen = screenById(trial, selectedScreen), element = screen.elements.find(n => n.id === e.id), size = rootSize(screen);
            transformValue(screen, element, input.dataset.transformField, Number(input.value), transformUnit, size.w, size.h);
            validateDocument(trial);
            edited(() => doc = trial);
        }
        catch (err) {
            notify(err.message);
        }
        return;
    }
    if (input.matches('[data-layer-parent]')) {
        nestPicked(input.value);
        return;
    }
    if(input.matches('[data-demo-hide-base]')){
        const ids=new Set(demoHideBase);
        input.checked?ids.add(input.dataset.demoHideBase):ids.delete(input.dataset.demoHideBase);
        demoHideBase=[...ids];render();return;
    }
    if (input.matches('[data-demo]')) {
        const key = input.dataset.demo;
        if (key === 'choice') {
            overlayChoice = input.value;
            loadOverlaySettings(chosenOverlay());
        }
        if(key==='rootMode'&&['window','fullscreen'].includes(input.value))demoRootMode=input.value;
        if (key === 'kind') {
            demoKind = input.value;
            demoAuto = demoKind === 'toast' ? 2400 : 0;
            demoDim = !['toast', 'popover'].includes(demoKind);
        }
        if (key === 'effect')
            demoEffect = input.value;
        if (key === 'duration')
            demoDuration = Math.max(0, Math.min(2000, Number(input.value) || 0));
        if (key === 'auto')
            demoAuto = Math.max(0, Math.min(30000, Number(input.value) || 0));
        if (key === 'dim')
            demoDim = input.checked;
        render();
        return;
    }
    if (input.matches('[data-setting]')) {
        if (input.dataset.setting === 'profile') {
            if(!Object.hasOwn(profiles,input.value))return;
            try{detailDevicePreview(screenById(doc,selectedScreen),input.value);}catch(error){notify(error.message);return;}
            profile = input.value;
            resetView = true;
        }
        else {
            zoom = input.value;
            if (zoom === 'fit')
                resetView = true;
        }
        render();
        return;
    }
    if (input.matches('[data-baseline-stage]')) {
        if (baselineLabels[input.value]) baselineStage = input.value;
        return;
    }
    if (input.matches('[data-open-baseline]') && input.value) {
        await restoreBaseline(input.value);
        return;
    }
    if (input.matches('[data-open-project]') && input.value) {
        await openSaved(input.value);
        return;
    }
    if (input.matches('[data-project-field]')) {
        edited(() => doc.name = input.value.trim() || doc.name);
        return;
    }
    if (input.matches('[data-runtime]')) {
        if (input.dataset.runtime === 'balance')
            runtime.balance = Math.max(0, Number(input.value) || 0);
        else
            runtime.response = input.value;
        render();
        return;
    }
    if (input.id === 'scenario-file' && input.files[0]) {
        try {
            if (dirty)
                throw Error('먼저 설계 파일을 저장해 주세요.');
            if (input.files[0].size > 2000000)
                throw Error('시험 파일이 너무 큽니다.');
            resetRuntime();
            runtime = replayScenario(doc, JSON.parse(await input.files[0].text()));
            mode = 'play';
            followRuntime();
            status = '저장한 시험 기록을 재생했습니다.';
            render();
        }
        catch (e) {
            notify(e.message);
        }
        return;
    }
    if (input.id === 'import-file' && input.files[0]) {
        try {
            const d = await readDesignFile(input.files[0]);
            if (dirty && !confirm('현재 미저장 수정을 불러온 설계로 바꿀까요?'))
                return;
            d.projectId = 'import-' + crypto.randomUUID().slice(0, 8);
            d.revision = 0;
            setDoc(d, null);
            dirty = true;
            status = '새 프로젝트로 가져왔습니다. 파일에 저장해 주세요.';
            render();
        }
        catch (e) {
            notify('불러오기 실패: ' + e.message);
        }
        return;
    }
    if (input.matches('[data-field]') && input.dataset.field === 'parentId') {
        nestPicked(input.value);
        return;
    }
    if (input.matches('[data-field]')) {
        const key = input.dataset.field, s = screenById(doc, selectedScreen), e = selection();
        const before = clone(doc);
        checkpoint();
        try {
            if (key.startsWith('screen.'))
                s[key.slice(7)] = input.value;
            else if (e) {
                if(['x','y','w','h'].includes(key)&&!percentRectEditable(s,e))throw Error('이 부품의 배치는 응답형 속성에서 조절하세요.');
                if (key.startsWith('typography.')) {
                    e.typography = {...e.typography};
                    const prop = key.slice(11);
                    if (input.value === '') delete e.typography[prop];
                    else e.typography[prop] = input.type === 'number' ? Number(input.value) : input.value;
                    if (!Object.keys(e.typography).length) delete e.typography;
                }
                else if (key.startsWith('appearance.')) {
                    e.appearance = {
                        ...e.appearance, [key.slice(11)]: input.type === 'number' ? Number(input.value) : input.value
                    };
                }
                else if (key === 'kind')
                    changePartType(e, key, input.value);
                else
                    e[key] = input.type === 'number' ? Number(input.value) : input.value;
            }
            if (e && key === 'parentId' && !input.value)
                delete e.parentId;
            validateDocument(doc);
            dirty = true;
            status = '';
            render();
        }
        catch (err) {
            doc = before;
            undo.pop();
            notify(err.message);
        }
        return;
    }
    if (input.matches('[data-edge-field]')) {
        const id = input.closest('[data-edge-form]').dataset.edgeForm, t = doc.transitions.find(t => t.id === id), key = input.dataset.edgeField;
        const before = clone(doc);
        checkpoint();
        try {
            if (key === 'itemId') {
                t.payload = {
                    ...t.payload
                };
                if (input.value)
                    t.payload.itemId = input.value;
                else
                    delete t.payload.itemId;
            }
            else
                t[key] = input.value;
            if (key === 'action' && ['navigate', 'open'].includes(input.value) && !t.targetScreen) {
                t.condition = 'unknown';
                status = '대상 UI를 고른 뒤 실행 조건을 지정해 주세요.';
            }
            validateDocument(doc);
            dirty = true;
            render();
        }
        catch (err) {
            doc = before;
            undo.pop();
            notify(err.message);
        }
        return;
    }
});
app.addEventListener('input', event => {
    if (event.target.id === 'tree-search') {
        search = event.target.value;
        const caret = event.target.selectionStart;
        render();
        $('#tree-search').focus();
        $('#tree-search').setSelectionRange(caret, caret);
    }
    if (event.target.id === 'feature-search') {
        featureSearch = event.target.value;
        const caret = event.target.selectionStart;
        render();
        $('#feature-search').focus();
        $('#feature-search').setSelectionRange(caret, caret);
    }
    if (event.target.id === 'unit-search') {
        unitSearch = event.target.value;
        const caret = event.target.selectionStart;
        render();
        $('#unit-search').focus();
        $('#unit-search').setSelectionRange(caret, caret);
    }
    if (event.target.id === 'term-search')
        $('#term-list').innerHTML = termRows(event.target.value);
});
window.addEventListener('keydown', event => {
    if(mode==='play'&&runtime.message&&event.key==='Escape'&&event.target.closest('#preview-canvas')){event.preventDefault();event.stopPropagation();document.querySelector('#preview-canvas .game-feedback button')?.click();return;}
    if(mode==='play'&&event.defaultPrevented&&event.target._buttonStateController&&['Enter',' '].includes(event.key))return;
    if(mode==='play'&&runtime.overlays.length&&event.target.closest('#preview-canvas')){if(event.key==='Escape'){event.preventDefault();runtime=escapeOverlay(doc,runtime);followRuntime();render();return;}if(event.key==='Tab'){trapOverlayFocus(event,activeRuntimeModal);return;}}
    if (event.target.matches('input,textarea,select'))
        return;
    if (event.code === 'Space') {
        event.preventDefault();
        spaceDown = true;
        $('#preview-host')?.classList.add('hand-mode');
        return;
    }
    if (!event.metaKey && !event.ctrlKey && event.key.toLowerCase() === 'h') {
        activeTool = 'hand';
        handTool = true;
        $('#preview-host')?.classList.add('hand-mode');
        return;
    }
    if (!event.metaKey && !event.ctrlKey && event.key.toLowerCase() === 'v') {
        activeTool = 'select';
        handTool = false;
        $('#preview-host')?.classList.remove('hand-mode');
        return;
    }
    if (event.key === 'Escape' && toolGroup) {
        toolGroup = null;
        render();
        return;
    }
    if (event.key === 'Escape' && activeTool !== 'select') {
        activeTool = 'select';
        handTool = false;
        render();
        return;
    }
    if (event.key === 'Escape' && showShortcuts) {
        showShortcuts = false;
        render();
        return;
    }
    if (event.key === 'Escape' && demoOverlay) {
        clearTimeout(demoTimer);
        demoOverlay = null;
        render();
        return;
    }
    const preview = event.target.closest('#preview-canvas');
    if (mode !== 'edit')
        return;
    if (['Delete', 'Backspace'].includes(event.key)) {
        if (picked().length) {
            event.preventDefault();
            deletePicked();
        }
        return;
    }
    const command = event.metaKey || event.ctrlKey, key = event.key.toLowerCase();
    if (command && ['c', 'x', 'v', 'd', 'a', 'g'].includes(key)) {
        event.preventDefault();
        performEdit({
            c: 'copy', x: 'cut', v: 'paste', d: 'duplicate', a: 'all', g: event.shiftKey ? 'ungroup' : 'group'
        }[key]);
        return;
    }
    if (!command && event.key === '?') {
        event.preventDefault();
        showShortcuts = !showShortcuts;
        render();
        return;
    }
    if (!command && !event.altKey && !event.shiftKey && ['r', 'o', 't', 'l'].includes(key)) {
        event.preventDefault();
        activeTool = {
            r: 'panel-rectangle', o: 'panel-circle', t: 'body', l: 'divider'
        }[key];
        handTool = false;
        toolGroup = null;
        render();
        return;
    }
    if (!command && ['+', '=', '-'].includes(event.key)) {
        event.preventDefault();
        const current = Number($('#preview-canvas').dataset.zoom);
        zoom = String(Math.max(.15, Math.min(4, current * (event.key === '-' ? 1 / 1.2 : 1.2))));
        render();
        return;
    }
    if (!command && event.shiftKey && event.code === 'Digit0') {
        event.preventDefault();
        zoom = '1';
        render();
        return;
    }
    if (!command && event.shiftKey && event.code === 'Digit2') {
        event.preventDefault();
        fitPicked();
        return;
    }
    if ((event.metaKey || event.ctrlKey) && ['z', 'y'].includes(event.key.toLowerCase())) {
        event.preventDefault();
        const forward = event.shiftKey || event.key.toLowerCase() === 'y';
        if (forward && redo.length) {
            pushSnapshot(undo, clone(doc));
            doc = redo.pop();
            dirty = true;
        }
        else if (!forward && undo.length) {
            pushSnapshot(redo, clone(doc));
            doc = undo.pop();
            dirty = true;
        }
        wheelRun = null;
        doc.revision = expectedRevision ?? 0;
        selectedIds = [];
        selectedElement = null;
        render();
        return;
    }
    if (event.shiftKey && event.key === '!') {
        event.preventDefault();
        zoom = 'fit';
        resetView = true;
        render();
        return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        void save();
        return;
    }
    if (preview && selection() && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
        const e = selection(), amount = event.shiftKey ? 1 : .25;
        const screen = screenById(doc, selectedScreen), size = rootSize(screen);
        const dx = event.key === 'ArrowLeft' ? -amount : event.key === 'ArrowRight' ? amount : 0;
        const dy = event.key === 'ArrowUp' ? -amount : event.key === 'ArrowDown' ? amount : 0;
        const movable=picked().filter(id=>!isAutoLayoutChild(screen,screen.elements.find(item=>item.id===id)));
        if(movable.length)edited(() => nudgeSelection(doc, selectedScreen, movable, dx, dy, size.w, size.h));
        $('#preview-canvas [data-element="' + CSS.escape(e.id) + '"]')?.focus();
    }
});
window.addEventListener('beforeunload', event => {
    if (dirty && !projectSwitchAllowed) {
        event.preventDefault();
        event.returnValue = '';
    }
});
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        collectScroll();
        render();
    }, 100);
});
async function init() {
    try {
        const settingsResponse = await fetch('/ui-studio/source/studio-config.json');
        if (settingsResponse.ok) studioSettings = await settingsResponse.json();
        if (workspaceId) folderProject = (await api('workspace')).workspace;
        await loadProjects();
        await loadCatalog();
        let preferred = new URLSearchParams(location.search).get('project');
        try { preferred ||= localStorage.getItem(lastProjectKey); } catch {}
        if (!workspaceId) preferred ||= studioSettings.defaultDocument;
        const id = projects.some(p => p.id === preferred) ? preferred : workspaceId ? projects[0]?.id : projects.filter(p => p.id.startsWith('lobby-') && p.id !== 'lobby-demo').at(-1)?.id;
        if (id) {
            const r = await api('project?id=' + encodeURIComponent(id));
            setDoc(r.document, r.document.revision);
        } else if (workspaceId) {
            setDoc(emptyDesign(folderProject.name + ' UI', 'ux-' + crypto.randomUUID().slice(0, 8)), null);
            status = '새 프로젝트의 빈 설계입니다. 유닛을 추가하고 파일에 저장하세요.';
        } else if (featureCatalog) {
            setDoc(createLobbyDesign(featureCatalog, 'lobby-' + crypto.randomUUID().slice(0, 8)), null);
            dirty = true;
            status = '공통 설정 기반 로비 배치 초안 · 3D 자리 표시';
        } else {
            const r = await fetch('/ui-studio/source/sample.json');
            setDoc(await r.json(), null);
            status = featureError;
        }
        const requested = new URLSearchParams(location.search), requestedScreen = requested.has('screen') ? screenById(doc,requested.get('screen')) : null;
        if(requestedScreen){selectedScreen=requestedScreen.id;previewBase=requestedScreen.kind==='page'?requestedScreen.id:doc.entryScreen;mode='edit';const requestedElement=requestedScreen.elements.find(e=>e.id===requested.get('element'));if(requestedElement){selectedElement=requestedElement.id;selectedIds=[selectedElement];treeTab='layers';showLayerPanel();}}
        palette = workspaceId ? 'properties' : 'features';
        render();
        if (folderProject?.conversionDecision === 'pending') await showProjectManager();
        if (!workspaceId) fetch('/ui-studio/source/glossary.json').then(r => r.ok ? r.json() : null).then(d => {
            glossary = d?.terms || [];
        }).catch(() => {});
    } catch (e) {
        disposePreviewPins();
        app.innerHTML = '<main class="boot-error"><h1>설계를 열지 못했습니다</h1><p>' + esc(e.message) + '</p><button data-recover-folder>프로젝트 폴더</button> <button data-recover-guide>가이드</button></main>';
        app.querySelector('[data-recover-folder]').onclick = showProjectManager;
        app.querySelector('[data-recover-guide]').onclick = () => openManual({workspaceId});
    }
}
void init();
app.addEventListener('dragstart', event => {
    const panelTab = event.target.closest('[data-panel-tab]');
    if (panelTab) {
        app.classList.add('dragging-panel');
        event.dataTransfer.setData('application/x-ux-panel', panelTab.dataset.panelTab);
        event.dataTransfer.effectAllowed = 'move';
        return;
    }
    const layer = event.target.closest('[data-layer-source]');
    if (layer) {
        event.dataTransfer.setData('application/x-ux-layer', layer.dataset.layerSource);
        event.dataTransfer.effectAllowed = 'move';
        return;
    }
    const f = event.target.closest('[data-feature-add]');
    if (f) {
        event.dataTransfer.setData('application/x-ux-feature', f.dataset.featureAdd);
        event.dataTransfer.effectAllowed = 'copy';
        return;
    }
    const u = event.target.closest('[data-unit]');
    if (!u)
        return;
    event.dataTransfer.setData('application/x-ux-unit', u.dataset.unit);
    event.dataTransfer.effectAllowed = 'copy';
});
app.addEventListener('dragover', event => {
    if ([...event.dataTransfer.types].includes('application/x-ux-panel')) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        return;
    }
    if ([...event.dataTransfer.types].includes('application/x-ux-layer') && event.target.closest('[data-layer-drop],[data-root-drop]')) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        return;
    }
    if (mode === 'edit' && event.target.closest('#preview-canvas') && [...event.dataTransfer.types].some(t => ['application/x-ux-unit', 'application/x-ux-feature'].includes(t))) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }
});
app.addEventListener('drop', event => {
    const panelId = event.dataTransfer.getData('application/x-ux-panel');
    if (PANEL_IDS.includes(panelId)) {
        event.preventDefault();
        app.classList.remove('dragging-panel');
        const side = event.target.closest('[data-dock-side]')?.dataset.dockSide, row = event.target.closest('[data-dock-row]');
        if (side) {
            workspacePrefs = dockSide(workspacePrefs, panelId, side, row ? Number(row.dataset.dockRow) : 0);
            palette = panelId;
            rememberWorkspace();
            render();
        }
        else
            undockPanel(panelId, event.clientX - 90, event.clientY - 20);
        return;
    }
    const layer = event.dataTransfer.getData('application/x-ux-layer'), target = event.target.closest('[data-layer-drop],[data-root-drop]');
    if (layer && target) {
        event.preventDefault();
        selectedElement = layer;
        selectedIds = [layer];
        nestPicked(target.dataset.layerDrop || '');
        return;
    }
    const canvas = event.target.closest('#preview-canvas'), featureId = event.dataTransfer.getData('application/x-ux-feature');
    if (canvas && featureId && mode === 'edit') {
        event.preventDefault();
        const button = event.target.closest('.kind-button');
        if (button) {
            selectedScreen = button.dataset.screen;
            selectedElement = button.dataset.element;
            const f = featureCatalog?.modules.find(f => f.id === featureId);
            if (f)
                edited(() => bindFeature(doc, selectedScreen, selectedElement, f));
        }
        else
            addFeature(featureId, dropPosition(event.clientX, event.clientY, canvas.getBoundingClientRect(), {
                w: 35, h: 8
            }));
        return;
    }
    const id = event.dataTransfer.getData('application/x-ux-unit');
    if (!canvas || !id || mode !== 'edit')
        return;
    event.preventDefault();
    const p = UNITS.find(u => u.id === id);
    if (!p)
        return;
    const panel = event.target.closest('.preview-overlay') || canvas;
    addUnit(id, dropPosition(event.clientX, event.clientY, panel.getBoundingClientRect(), p));
});
function scheduleOverlayAutoClose() {
    if(mode==='play')runtimeOverlayTimers.sync();else runtimeOverlayTimers.reset();
}
window.addEventListener('pagehide',event=>{if(event.persisted)return;disposePreviewPins();runtimeOverlayTimers.dispose();});

window.addEventListener('keyup', event => {
    if (event.code === 'Space') {
        spaceDown = false;
        if (!handTool)
            $('#preview-host')?.classList.remove('hand-mode');
    }
});
window.addEventListener('blur', () => {
    spaceDown = false;
    if (!handTool)
        $('#preview-host')?.classList.remove('hand-mode');
});
app.addEventListener('pointerdown', event => {
    const host = event.target.closest('#preview-host');
    if (!host || !(spaceDown || handTool || event.button === 1))
        return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const x = event.clientX, y = event.clientY, left = host.scrollLeft, top = host.scrollTop;
    host.setPointerCapture(event.pointerId);
    host.classList.add('panning');
    const move = e => {
        host.scrollLeft = left - (e.clientX - x);
        host.scrollTop = top - (e.clientY - y);
    };
    const end = () => {
        host.removeEventListener('pointermove', move);
        host.removeEventListener('pointerup', end);
        host.removeEventListener('pointercancel', end);
        host.classList.remove('panning');
    };
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerup', end);
    host.addEventListener('pointercancel', end);
}, true);
app.addEventListener('click', event => {
    if (event.target.closest('#preview-host') && (handTool || spaceDown)) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }
}, true);
app.addEventListener('wheel', event => {
    const host = event.target.closest('#preview-host');
    if (!host || !(event.ctrlKey || event.metaKey))
        return;
    event.preventDefault();
    const canvas = $('#preview-canvas'), c = canvas.getBoundingClientRect(), h = host.getBoundingClientRect(), scale = Number(canvas.dataset.scale),editorScale=Number(canvas.dataset.zoom);
    zoomAnchor = {
        x: (event.clientX - c.left) / scale, y: (event.clientY - c.top) / scale, screenX: event.clientX - h.left, screenY: event.clientY - h.top
    };
    zoom = String(Math.max(.15, Math.min(4, editorScale * Math.exp(-event.deltaY * .002))));
    render();
}, {
    passive: false
});
function picked() {
    return selectedIds.length ? selectedIds.filter(id => screenById(doc, selectedScreen).elements.some(e => e.id === id)) : [selectedElement].filter(Boolean);
}
function selectionNode() {
    return $('#preview-canvas [data-element="' + CSS.escape(selectedElement || '') + '"]');
}
function deletePicked() {
    const ids = picked();
    if (!ids.length)
        return;
    edited(() => {
        removeSelection(doc, selectedScreen, ids);
        selectedIds = [];
        selectedElement = null;
    });
}
function shortcutPanel() {
    return showShortcuts ? `<section class="glossary-panel shortcut-panel" role="dialog" aria-label="편집 단축키"><div><h2>편집 단축키</h2><button data-action="shortcuts">닫기</button></div><p>입력칸 안에서는 글 편집을 우선합니다. 복사·붙여넣기는 현재 편집기 안에서 동작합니다.</p><table><tbody>${[['삭제', 'Delete / Backspace'], ['되돌리기 / 다시하기', 'Ctrl/Cmd Z / Shift Z'], ['복사 / 잘라내기 / 붙여넣기', 'Ctrl/Cmd C / X / V'], ['복제 / 현재 화면 전체 선택', 'Ctrl/Cmd D / A'], ['그룹 / 그룹 해제', 'Ctrl/Cmd G / Shift G'], ['선택 / 손 도구', 'V / H'], ['작업 공간 이동', 'Space + 드래그'], ['확대 / 축소', '+ / − 또는 Ctrl/Cmd + 휠'], ['화면 맞춤 / 선택 보기 / 100%', 'Shift 1 / Shift 2 / Shift 0'], ['네모 / 동그라미 / 텍스트 / 선', 'R / O / T / L'], ['미세 이동 / 크게 이동', '방향키 / Shift + 방향키'], ['저장 / 창 닫기', 'Ctrl/Cmd S / Escape']].map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</tbody></table><p class="subtle">벡터 펜·협업 등 피그마 전체 기능을 제공한다는 뜻은 아닙니다.</p></section>` : '';
}
function performEdit(command) {
    try {
        const screen = screenById(doc, selectedScreen);
        const size = rootSize(screen);
        if (command === 'layer-front' || command === 'layer-back') {
            const trial=clone(doc);reorderSiblings(screenById(trial,selectedScreen),picked(),command==='layer-front'?'front':'back');
            validateDocument(trial);edited(()=>doc=trial);return;
        }
        if (command === 'delete') {
            deletePicked();
            return;
        }
        if (command === 'all') {
            selectedIds = screen.elements.filter(e => !e.parentId).map(e => e.id);
            selectedElement = selectedIds[0] || null;
            render();
            return;
        }
        if (command === 'copy' || command === 'cut') {
            internalClipboard = copySelection(doc, selectedScreen, picked(), size.w, size.h);
            if (command === 'cut')
                deletePicked();
            else
                notify('선택 요소를 복사했습니다. 현재 편집기에서 붙여넣을 수 있습니다.');
            return;
        }
        if (command === 'paste' || command === 'duplicate') {
            const clip = command === 'duplicate' ? copySelection(doc, selectedScreen, picked(), size.w, size.h) : internalClipboard;
            if (!clip?.elements.length)
                return notify('먼저 요소를 복사하세요.');
            const trial = clone(doc), ids = pasteSelection(trial, selectedScreen, clip, () => 'element-' + crypto.randomUUID());
            validateDocument(trial);
            edited(() => {
                doc = trial;
                selectedIds = [...new Set(ids.map(id => editTarget(screenById(doc, selectedScreen), id, editingComponent)))];
                selectedElement = selectedIds[0] || null;
            });
            return;
        }
        if (command === 'group' || command === 'ungroup') {
            const trial = clone(doc), ids = command === 'ungroup' ? ungroupSelection(trial, selectedScreen, picked(), size.w, size.h) : [groupSelection(trial, selectedScreen, picked(), 'group-' + crypto.randomUUID(), size.w, size.h)];
            validateDocument(trial);
            edited(() => {
                doc = trial;
                selectedIds = [...new Set(ids.map(id => editTarget(screenById(doc, selectedScreen), id, editingComponent)))];
                selectedElement = selectedIds[0] || null;
            });
        }
    }
    catch (e) {
        notify(e.message);
    }
}
function fitPicked() {
    const ids = picked();
    if (!ids.length)
        return;
    const screen = screenById(doc, selectedScreen), p = rootSize(screen), rects = ids.map(id => resolveRect(screen, id, p.w, p.h)), x = Math.min(...rects.map(r => r.x)), y = Math.min(...rects.map(r => r.y)), w = Math.max(...rects.map(r => r.x + r.w)) - x, h = Math.max(...rects.map(r => r.y + r.h)) - y, host = $('#preview-host');
    const deviceScale=detailDevicePreview(screen).scale;
    zoom = String(Math.min(4, Math.max(.15, Math.min((host.clientWidth - 60) / (w*deviceScale), (host.clientHeight - 60) / (h*deviceScale)))));
    zoomAnchor = {
        x: x + w / 2, y: y + h / 2, screenX: host.clientWidth / 2, screenY: host.clientHeight / 2
    };
    render();
}
function detailDevicePreview(screen,profileId=profile){
    const basis=mode==='edit'||screen.kind==='page'?screen:screenById(doc,runtime?.page)||screenById(doc,doc.entryScreen);
    return canvasDevicePreview(basis,{profile:profileId});
}
function rootSize(screen) {
    const p = detailDevicePreview(screen).logical;
    if (screen.kind === 'page')
        return {
            w: p.w, h: p.h
        };
    return overlayRootSize(screen,p);
}
function quickTransform(screen, e) {
    const size=rootSize(screen),blocked=descendants(screen,[e.id]),options=screen.elements.filter(n=>isContainer(n)&&!blocked.has(n.id));
    const geometry=percentRectEditable(screen,e)?`<div class="quick-title"><b>레이어 위치 · 크기</b><select aria-label="레이어 수치 단위" data-transform-unit><option value="px" ${transformUnit==='px'?'selected':''}>px</option><option value="%" ${transformUnit==='%'?'selected':''}>%</option></select><button data-action="apply-transform">수치 적용</button></div><div class="transform-fields">${['x','y','w','h'].map(key=>{const v=transformDisplayValue(screen,e,key,transformUnit,size.w,size.h);return `<label>${key.toUpperCase()}<input aria-label="레이어 ${key.toUpperCase()}" type="number" data-transform-field="${key}" value="${Number(v.toFixed(2))}" step="${transformUnit==='px'?1:.25}" ${['w','h'].includes(key)?'min="0.01"':''}></label>`;}).join('')}</div>`:'<p class="subtle">앵커·여백·안전 영역·부모 자동 배치 부품입니다. 아래 응답형 속성에서 배치를 조절하세요.</p>';
    return partsPanel(screen,e)+`<section class="quick-transform">${geometry}<div class="button-row"><button data-action="isolate-selection" aria-pressed="${isolated.length>0}">${isolated.length?'전체 보기':'이 레이어만 보기'}</button><button data-action="add-child" ${isContainer(e)?'':'disabled'}>하위 레이어 추가</button></div><label>부모 레이어<select data-layer-parent><option value="">화면 최상위</option>${options.map(n=>`<option value="${esc(n.id)}" ${e.parentId===n.id?'selected':''}>${esc(n.name)}</option>`).join('')}</select></label>${e.layout?.type||isAutoLayoutChild(screen,e)?'<p class="subtle">지속 자동 배치 설정은 아래에서 조절합니다.</p>':menuControls(e)}${responsiveInspectorHTML(screen,e)}${insertParentId?'<button data-action="clear-insertion">하위 추가 종료</button>':''}</section>`;
}
function layerRows(screen, parentId = null, depth = 0, index = null, matched = null) {
    index ??= indexLayers(screen);
    if (search && !matched)
        matched = matchingLayers(screen, search, index);
    return (index.children.get(parentId) || []).map(e => {
        const kids = index.children.get(e.id) || [], matching = !search || matched.has(e.id);
        if (!matching)
            return '';
        return `<div class="layer-item" role="treeitem" aria-expanded="${!collapsedLayers.has(e.id)}"><div class="layer-row" draggable="true" data-layer-source="${esc(e.id)}" ${isContainer(e) ? `data-layer-drop="${esc(e.id)}"` : ''}><button class="layer-expand" data-collapse-layer="${esc(e.id)}" aria-label="${esc(e.name)} 하위 레이어 ${collapsedLayers.has(e.id) ? '펼치기' : '접기'}" ${kids.length ? '' : 'disabled'}>${kids.length ? (collapsedLayers.has(e.id) ? '▸' : '▾') : '·'}</button><button class="layer-select ${selectedElement === e.id || selectedIds.includes(e.id) ? 'active' : ''}" data-element="${esc(e.id)}"><span class="layer-thumbnail">${surface(e.appearance || {})}</span><span>${esc(e.name)}<small>${esc(PART_ROLES[e.partRole] || (kids.length ? '하위 ' + kids.length + '개' : kinds[e.kind]))} · ${INPUT_MODES[inputMode(e, doc.transitions)]}</small></span></button><button class="layer-isolate" data-isolate-layer="${esc(e.id)}" title="${esc(e.name)}만 보기" aria-label="${esc(e.name)}만 보기" aria-pressed="${isolated.includes(e.id)}">◎</button></div>${kids.length && (!collapsedLayers.has(e.id) || search) ? `<div class="layer-children" role="group">${layerRows(screen, e.id, depth + 1, index, matched)}</div>` : ''}</div>`;
    }).join('');
}
function nestPicked(parentId) {
    try {
        const trial = clone(doc), screen = screenById(trial, selectedScreen), size = rootSize(screen);
        const ids = moveInto(screen, picked(), parentId, size.w, size.h);
        validateDocument(trial);
        edited(() => {
            doc = trial;
            selectedIds = ids;
            selectedElement = ids[0] || null;
            treeTab = 'layers';
            if (parentId)
                collapsedLayers.delete(parentId);
        });
    }
    catch (e) {
        notify(e.message);
    }
}
function toolRail() {
    return `<nav class="tool-rail" aria-label="UI 도구"><button data-tool="select" aria-label="선택 도구 V" title="선택 V" aria-pressed="${activeTool === 'select'}">↖</button><button data-tool="hand" aria-label="손 도구 H" title="손 H" aria-pressed="${handTool}">✋</button><span></span>${[['게임 UI', '▦', '게임 UI 종류'], ['복합 유닛', '▧', '이미지·프레임'], ['백판·도형', '□', '도형'], ['버튼', '◯', '버튼'], ['텍스트·정보', 'T', '텍스트·정보'], ['입력·선택', '☑', '입력·선택'], ['목록·탐색', '▤', '목록·탐색'], ['상태 표시', '◉', '상태 표시']].map(([id, icon, label]) => `<button data-tool-group="${id}" aria-label="${label} 도구 모음" title="${label}" aria-pressed="${toolGroup === id || UNITS.find(u => u.id === activeTool)?.group === id}">${icon}<small>▸</small></button>`).join('')}<span></span><button data-action="create-menu" title="선택을 접이식 메뉴로 묶기" aria-label="접이식 메뉴 만들기">☰</button><button data-action="shortcuts" title="단축키" aria-label="단축키 도움말">?</button></nav>`;
}
function toolFlyout() {
    return toolGroup ? `<section class="tool-flyout" aria-label="유닛 도구 선택"><div class="flyout-heading"><b>${esc(toolGroup === '전체' ? '유닛 도구' : toolGroup)}</b><button data-action="unit-library" aria-label="유닛 도구 닫기">×</button></div><p>도구를 고른 뒤 캔버스에 드래그하세요.</p><div class="unit-grid">${UNITS.filter(u => toolGroup === '전체' || u.group === toolGroup).map(u => `<button data-tool-unit="${u.id}" aria-label="${esc(u.name)} 도구"><span class="unit-thumb">${surface(u.appearance)}<span>${esc(u.text || '')}</span></span><span>${esc(u.name)}</span></button>`).join('')}</div></section>` : '';
}
app.addEventListener('pointerdown', event => {
    if (event.target.closest('[data-menu-toggle]') || mode !== 'edit' || handTool || spaceDown || !UNITS.some(u => u.id === activeTool) || event.button !== 0)
        return;
    const canvas = event.target.closest('#preview-canvas');
    if (!canvas)
        return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const host = $('#preview-host'), container = insertParentId ? canvas.querySelector('[data-element="' + CSS.escape(insertParentId) + '"]') : canvas.querySelector('.preview-overlay') || canvas;
    if (!container)
        return;
    const rect = container.getBoundingClientRect(), start = {
        x: event.clientX, y: event.clientY
    };
    const ghost = document.createElement('div');
    ghost.className = 'drawing-ghost';
    container.append(ghost);
    host.setPointerCapture(event.pointerId);
    const draw = e => {
        ghost.style.left = (Math.min(start.x, e.clientX) - rect.left) / rect.width * 100 + '%';
        ghost.style.top = (Math.min(start.y, e.clientY) - rect.top) / rect.height * 100 + '%';
        ghost.style.width = Math.max(1, Math.abs(e.clientX - start.x)) / rect.width * 100 + '%';
        ghost.style.height = Math.max(1, Math.abs(e.clientY - start.y)) / rect.height * 100 + '%';
    };
    const finish = e => {
        host.removeEventListener('pointermove', draw);
        host.removeEventListener('pointerup', finish);
        host.removeEventListener('pointercancel', cancel);
        ghost.remove();
        const moved = Math.abs(e.clientX - start.x) + Math.abs(e.clientY - start.y) > 6;
        const unit = UNITS.find(u => u.id === activeTool), position = moved ? {
            x: (Math.min(start.x, e.clientX) - rect.left) / rect.width * 100, y: (Math.min(start.y, e.clientY) - rect.top) / rect.height * 100, w: Math.max(1, Math.abs(e.clientX - start.x)) / rect.width * 100, h: Math.max(1, Math.abs(e.clientY - start.y)) / rect.height * 100
        } : dropPosition(e.clientX, e.clientY, rect, unit);
        addUnit(activeTool, position);
    };
    const cancel = () => {
        host.removeEventListener('pointermove', draw);
        host.removeEventListener('pointerup', finish);
        host.removeEventListener('pointercancel', cancel);
        ghost.remove();
    };
    host.addEventListener('pointermove', draw);
    host.addEventListener('pointerup', finish);
    host.addEventListener('pointercancel', cancel);
    draw(event);
}, true);
function applyQuickTransform() {
    const e = selection();
    if (!e||!percentRectEditable(screenById(doc,selectedScreen),e))
        return;
    try {
        const trial = clone(doc), screen = screenById(trial, selectedScreen), element = screen.elements.find(n => n.id === e.id), size = rootSize(screen);
        for (const input of document.querySelectorAll('[data-transform-field]'))
            transformValue(screen, element, input.dataset.transformField, Number(input.value), transformUnit, size.w, size.h);
        validateDocument(trial);
        if (JSON.stringify(trial) !== JSON.stringify(doc))
            edited(() => doc = trial);
    }
    catch (err) {
        notify(err.message);
    }
}
app.addEventListener('keydown', event => {
    if (event.key === 'Enter' && event.target.matches('[data-transform-field]')) {
        event.preventDefault();
        applyQuickTransform();
    }
});
function bottomDock() {
    const available = workspacePrefs.bottomPanels.filter(id => !workspacePrefs.floats[id]), active = available.includes(workspacePrefs.bottomActive) ? workspacePrefs.bottomActive : available[0];
    return available.length ? `<div class="bottom-splitter" data-bottom-split role="separator" tabindex="0" aria-label="하단 패널 높이 조절"></div><aside class="bottom-dock" data-dock-side="bottom"><div class="dock-zone-heading">하단 패널</div>${panelTabs(available, active)}<div class="dock-panel-body">${panelBody(active)}</div></aside>` : '<div class="bottom-drop-target" data-dock-side="bottom">하단에 패널 붙이기</div>';
}
function applyWorkspaceWidths() {
    app.style.setProperty('--studio-stage', workspacePrefs.stageColor);
    app.style.setProperty('--studio-canvas', workspacePrefs.canvasColor);
    const frame = workspacePrefs.frame, custom = innerWidth > 760 && frame;
    app.classList.toggle('custom-frame', !!custom);
    app.style.width = custom ? Math.min(innerWidth, frame.w) + 'px' : '';
    app.style.height = custom ? Math.min(innerHeight, frame.h) + 'px' : '';
    app.classList.toggle('has-bottom-dock', workspacePrefs.bottomPanels.some(id => !workspacePrefs.floats[id]));
    app.style.setProperty('--bottom-height', Math.min(workspacePrefs.bottomHeight, Math.max(150, (app.clientHeight || innerHeight) * .6)) + 'px');
    const widths = paneWidths(app.clientWidth || innerWidth, workspacePrefs.left, workspacePrefs.right);
    app.style.setProperty('--tree-width', widths.left + 'px');
    app.style.setProperty('--inspector-width', widths.right + 'px');
}
app.addEventListener('pointerdown', event => {
    const splitter = event.target.closest('[data-pane-split]'), floatingMove = event.target.closest('[data-float-move]'), floatingResize = event.target.closest('[data-float-resize]'), rowSplit = event.target.closest('[data-row-split]');
    if (!splitter && !floatingMove && !floatingResize && !rowSplit)
        return;
    if (floatingMove && event.target.closest('button'))
        return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const handle = splitter || floatingMove || floatingResize || rowSplit, start = {
        x: event.clientX, y: event.clientY, left: workspacePrefs.left, right: workspacePrefs.right
    };
    handle.setPointerCapture(event.pointerId);
    let rect, panel, id, rows, oldHeights, magneticTargets = [], magneticZones = [], magneticHint = null;
    if (floatingMove) {
        magneticTargets = [...app.querySelectorAll('[data-dock-side],.floating-panel')].filter(n => n !== handle.closest('.floating-panel')).map(n => {
            const r = n.getBoundingClientRect();
            return {
                x: r.x, y: r.y, w: r.width, h: r.height
            };
        });
        magneticZones = [...app.querySelectorAll('[data-dock-side]')].sort((a, b) => (b.dataset.dockSide === 'bottom') - (a.dataset.dockSide === 'bottom')).map(n => {
            const r = n.getBoundingClientRect();
            return {
                node: n, side: n.dataset.dockSide, rect: {
                    x: r.x, y: r.y, w: r.width, h: r.height
                }
            };
        });
        magneticHint = document.createElement('div');
        magneticHint.className = 'magnetic-hint';
        magneticHint.hidden = true;
        app.append(magneticHint);
    }
    if (floatingMove || floatingResize) {
        id = (floatingMove || floatingResize).dataset[floatingResize ? 'floatResize' : 'floatMove'];
        panel = handle.closest('.floating-panel');
        rect = panel.getBoundingClientRect();
    }
    if (rowSplit) {
        rows = [...rowSplit.parentElement.querySelectorAll(':scope>.dock-row')];
        oldHeights = rows.map(n => n.getBoundingClientRect().height);
    }
    const move = e => {
        if (splitter) {
            const value = splitter.dataset.paneSplit === 'left' ? start.left + e.clientX - start.x : start.right - (e.clientX - start.x), widths = paneWidths(innerWidth, splitter.dataset.paneSplit === 'left' ? value : start.left, splitter.dataset.paneSplit === 'right' ? value : start.right);
            workspacePrefs.left = widths.left;
            workspacePrefs.right = widths.right;
            applyWorkspaceWidths();
        }
        else if (panel) {
            let next = clampPanel(floatingResize ? {
                x: rect.x, y: rect.y, w: rect.width + e.clientX - start.x, h: rect.height + e.clientY - start.y
            } : {
                x: rect.x + e.clientX - start.x, y: rect.y + e.clientY - start.y, w: rect.width, h: rect.height
            }, innerWidth, innerHeight);
            if (floatingMove && !e.altKey) {
                next = snapPanel(next, magneticTargets, innerWidth, innerHeight);
                panel.classList.toggle('magnet-snapped', next.snapped);
                const target = dockTarget(e.clientX, e.clientY, magneticZones);
                magneticHint.hidden = !target;
                if (target) {
                    const r = target.rect;
                    Object.assign(magneticHint.style, {
                        left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px'
                    });
                    magneticHint.textContent = '여기에 붙이기';
                }
            }
            else if (magneticHint)
                magneticHint.hidden = true;
            delete next.snapped;
            Object.assign(workspacePrefs.floats[id], next);
            Object.assign(panel.style, {
                left: next.x + 'px', top: next.y + 'px', width: next.w + 'px', height: next.h + 'px'
            });
        }
        else if (rowSplit) {
            const i = Number(rowSplit.dataset.rowSplit), sum = oldHeights[i] + oldHeights[i + 1], top = Math.max(80, Math.min(sum - 80, oldHeights[i] + e.clientY - start.y)), heights = [...oldHeights];
            heights[i] = top;
            heights[i + 1] = sum - top;
            workspacePrefs.weights = heights;
            rowSplit.parentElement.style.gridTemplateRows = heights.map((v, n) => (n ? '8px ' : '') + 'minmax(80px,' + v + 'fr)').join(' ');
        }
    };
    const end = event => {
        if (floatingMove && event?.type === 'pointerup') {
            const target = !event.altKey && dockTarget(event.clientX, event.clientY, magneticZones);
            if (target) {
                const hit = document.elementsFromPoint(event.clientX, event.clientY).find(n => n.closest?.('[data-dock-row]'));
                workspacePrefs = dockSide(workspacePrefs, id, target.side, Number(hit?.closest('[data-dock-row]')?.dataset.dockRow || 0));
                palette = id;
                workspacePrefs.groups.forEach((g, i) => {
                    if (g.includes(id))
                        workspacePrefs.active[i] = id;
                });
            }
        }
        magneticHint?.remove();
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', end);
        handle.removeEventListener('pointercancel', end);
        rememberWorkspace();
        render();
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
}, true);
app.addEventListener('keydown', event => {
    const handle = event.target.closest('[data-pane-split]');
    if (!handle || !['ArrowLeft', 'ArrowRight'].includes(event.key))
        return;
    event.preventDefault();
    event.stopPropagation();
    const change = (event.key === 'ArrowRight' ? 1 : -1) * 10;
    if (handle.dataset.paneSplit === 'left')
        workspacePrefs.left += change;
    else
        workspacePrefs.right -= change;
    const widths = paneWidths(app.clientWidth || innerWidth, workspacePrefs.left, workspacePrefs.right);
    Object.assign(workspacePrefs, widths);
    rememberWorkspace();
    render();
});
app.addEventListener('dblclick', event => {
    const header = event.target.closest('[data-float-move]');
    if (header && !event.target.closest('button'))
        dockPanel(header.dataset.floatMove);
});
function fixturePanel() {
    return `<details class="fixture-settings"><summary>동작 시험 조건</summary><label>시험 잔액<input type="number" min="0" data-runtime="balance" value="${runtime.balance}"></label><label>요청 결과<select data-runtime="response">${[['success', '성공'], ['failure', '요청 실패'], ['timeout', '시간 초과']].map(([v, n]) => `<option value="${v}" ${runtime.response === v ? 'selected' : ''}>${n}</option>`).join('')}</select></label><button data-action="restart-test">처음부터 시험</button><label>저장한 시험 기록 재생<input type="file" id="scenario-file" accept=".json,application/json"></label><p class="subtle">실제 게임 값이나 결제를 사용하지 않습니다.</p></details>`;
}
function tree() {
    const id = workspacePrefs.leftActive, active = id !== 'project' && workspacePrefs.leftPanels.includes(id) && !workspacePrefs.floats[id] ? id : 'project';
    return `<aside class="tree left-dock" data-dock-side="left"><div class="dock-zone-heading">왼쪽 패널</div><div class="left-bookmarks"><button class="project-bookmark" data-left-project="true" aria-pressed="${active === 'project'}">프로젝트</button>${panelTabs(workspacePrefs.leftPanels, active)}</div><div class="left-dock-content">${active === 'project' ? projectTree() : workspacePrefs.floats[active] ? `<p>이 패널은 분리되어 있습니다.</p><button data-dock-panel="${active}">여기에 다시 붙이기</button>` : panelBody(active)}</div></aside>`;
}
app.addEventListener('dragend', () => {
    app.classList.remove('dragging-panel');
});
let suppressPanelClick = false;
app.addEventListener('pointerdown', event => {
    const tab = event.target.closest('[data-panel-tab]');
    if (!tab || event.button !== 0)
        return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const id = tab.dataset.panelTab, start = {
        x: event.clientX, y: event.clientY
    };
    tab.setPointerCapture(event.pointerId);
    let moved = false, ghost;
    const move = e => {
        if (!moved && Math.abs(e.clientX - start.x) + Math.abs(e.clientY - start.y) < 6)
            return;
        if (!moved) {
            moved = true;
            app.classList.add('dragging-panel');
            ghost = document.createElement('div');
            ghost.className = 'tab-drag-ghost';
            ghost.textContent = PANEL_NAMES[id];
            app.append(ghost);
        }
        ghost.style.left = e.clientX + 14 + 'px';
        ghost.style.top = e.clientY + 12 + 'px';
        for (const zone of app.querySelectorAll('[data-dock-side]'))
            zone.classList.remove('dock-hover');
        const zone = nearDock(e.clientX, e.clientY)?.node;
        zone?.classList.add('dock-hover');
    };
    const clean = () => {
        tab.removeEventListener('pointermove', move);
        tab.removeEventListener('pointerup', end);
        tab.removeEventListener('pointercancel', cancel);
        ghost?.remove();
        app.classList.remove('dragging-panel');
        for (const zone of app.querySelectorAll('.dock-hover'))
            zone.classList.remove('dock-hover');
    };
    const end = e => {
        clean();
        if (!moved)
            return;
        suppressPanelClick = true;
        const hit = document.elementsFromPoint(e.clientX, e.clientY).find(n => n.closest?.('[data-dock-side]')), zone = nearDock(e.clientX, e.clientY)?.node;
        if (zone) {
            const row = hit?.closest('[data-dock-row]');
            workspacePrefs = dockSide(workspacePrefs, id, zone.dataset.dockSide, row ? Number(row.dataset.dockRow) : 0);
            palette = id;
            rememberWorkspace();
            render();
        }
        else
            undockPanel(id, e.clientX - 90, e.clientY - 20);
        setTimeout(() => suppressPanelClick = false, 0);
    };
    const cancel = () => clean();
    tab.addEventListener('pointermove', move);
    tab.addEventListener('pointerup', end);
    tab.addEventListener('pointercancel', cancel);
}, true);
app.addEventListener('click', event => {
    if (suppressPanelClick) {
        event.preventDefault();
        event.stopImmediatePropagation();
        suppressPanelClick = false;
    }
}, true);
function menuControls(e) {
    return `<label>유닛 모양<select data-quick-shape aria-label="선택 유닛 모양" ${e.isGroup || e.skin ? 'disabled' : ''}>${Object.entries(SHAPES).map(([id, name]) => `<option value="${id}" ${(e.appearance?.shape || 'rectangle') === id ? 'selected' : ''}>${name}</option>`).join('')}</select></label><button data-action="create-menu">선택을 접이식 메뉴로 묶기</button>${isContainer(e) ? `<fieldset class="menu-controls"><legend>하위 요소 같은 간격 정렬</legend><select data-arrange-direction aria-label="정렬 방향"><option value="column" ${e.layout?.direction === 'column' ? 'selected' : ''}>세로</option><option value="row" ${e.layout?.direction === 'row' ? 'selected' : ''}>가로</option></select><label>간격 px<input type="number" data-arrange-gap aria-label="그룹 간격" min="0" max="500" value="${e.layout?.gap ?? 8}"></label><button data-action="arrange-children">같은 간격 정렬</button><small>하위 요소 크기는 유지하고 그룹 외곽을 맞춥니다.</small>${e.menu ? `<label><input type="checkbox" data-menu-default ${e.menu.defaultOpen ? 'checked' : ''}>처음부터 펼치기</label><small>캔버스의 메뉴 제목을 클릭하면 열고 닫습니다.</small>` : ''}</fieldset>` : ''}`;
}
function createMenu() {
    try {
        const trial = clone(doc), s = screenById(trial, selectedScreen), size = rootSize(s), id = wrapMenu(s, picked(), 'menu-' + crypto.randomUUID(), size.w, size.h);
        validateDocument(trial);
        edited(() => {
            doc = trial;
            selectedElement = id;
            selectedIds = [id];
            activeTool = 'select';
            treeTab = 'layers';
            showLayerPanel();
        });
    }
    catch (e) {
        notify(e.message);
    }
}
function arrangeMenu() {
    try {
        const trial = clone(doc), s = screenById(trial, selectedScreen), size = rootSize(s);
        arrangeChildren(s, selectedElement, document.querySelector('[data-arrange-direction]').value, Number(document.querySelector('[data-arrange-gap]').value), size.w, size.h);
        validateDocument(trial);
        edited(() => doc = trial);
    }
    catch (e) {
        notify(e.message);
    }
}
app.addEventListener('wheel', event => {
    const input = event.target.closest('[data-transform-field]');
    if (!input || input.disabled || mode !== 'edit' || !event.deltaY)
        return;
    event.preventDefault();
    event.stopPropagation();
    const e = selection();
    if (!e||!percentRectEditable(screenById(doc,selectedScreen),e))
        return;
    const screen = screenById(doc, selectedScreen), size = rootSize(screen), key = input.dataset.transformField, p = parentSize(screen, e, size.w, size.h), px = ['x', 'w'].includes(key) ? p.w : p.h, current = transformDisplayValue(screen, e, key, transformUnit, size.w, size.h), next = wheelValue(current, event.deltaY, transformUnit, event.shiftKey, event.altKey);
    if (['w', 'h'].includes(key) && next <= 0 || Math.abs(next) > 10000)
        return;
    const now = Date.now(), token = doc.projectId + ':' + e.id + ':' + key;
    try {
        const value = transformUnit === 'px' ? next / px * 100 : next;
        if (Math.abs(value) > 10000)
            return;
        if (!wheelRun || wheelRun.token !== token || now - wheelRun.time > 500) {
            checkpoint();
            wheelRun = {
                token, time: now
            };
        }
        else
            wheelRun.time = now;
        transformValue(screen, e, key, next, transformUnit, size.w, size.h);
        input.value = Number(next.toFixed(4));
        const node = document.querySelector('#preview-canvas [data-element="' + CSS.escape(e.id) + '"]');
        if(node){node.style[{x:'left',y:'top',w:'width',h:'height'}[key]]=value+'%';Object.assign(node.style,responsiveStyles(screen,e));}
        dirty = true;
        status = '';
        const saved = document.querySelector('#save-status');
        if (saved) {
            saved.textContent = '● 미저장 수정';
            saved.className = 'dirty';
        }
        document.querySelector('[data-action="undo"]')?.removeAttribute('disabled');
        document.querySelector('[data-action="redo"]')?.setAttribute('disabled', '');
        if (!wheelFrame)
            wheelFrame = requestAnimationFrame(() => {
                wheelFrame = 0;
                disposeEditor.update?.();
            });
    }
    catch (err) {
        status = err.message;
    }
}, {
    passive: false
});
app.addEventListener('pointerdown', event => {
    const h = event.target.closest('[data-bottom-split]');
    if (!h || event.button !== 0)
        return;
    event.preventDefault();
    const startY = event.clientY, startHeight = workspacePrefs.bottomHeight;
    h.setPointerCapture(event.pointerId);
    const move = e => {
        workspacePrefs.bottomHeight = Math.max(150, Math.min(innerHeight * .6, startHeight + startY - e.clientY));
        app.style.setProperty('--bottom-height', workspacePrefs.bottomHeight + 'px');
    };
    const end = () => {
        h.removeEventListener('pointermove', move);
        h.removeEventListener('pointerup', end);
        h.removeEventListener('pointercancel', end);
        rememberWorkspace();
        render();
    };
    h.addEventListener('pointermove', move);
    h.addEventListener('pointerup', end);
    h.addEventListener('pointercancel', end);
}, true);
function nearDock(x, y) {
    const zones = [...app.querySelectorAll('[data-dock-side]')].sort((a, b) => (b.dataset.dockSide === 'bottom') - (a.dataset.dockSide === 'bottom')).map(node => {
        const r = node.getBoundingClientRect();
        return {
            node, side: node.dataset.dockSide, rect: {
                x: r.x, y: r.y, w: r.width, h: r.height
            }
        };
    });
    return dockTarget(x, y, zones);
}
app.addEventListener('pointerdown', event => {
    const h = event.target.closest('[data-frame-resize]');
    if (!h || event.button !== 0 || innerWidth <= 760)
        return;
    event.preventDefault();
    event.stopPropagation();
    const r = app.getBoundingClientRect(), start = {
        x: event.clientX, y: event.clientY, w: r.width, h: r.height
    };
    h.setPointerCapture(event.pointerId);
    let moved = false;
    const move = e => {
        if (e.clientX === start.x && e.clientY === start.y)
            return;
        moved = true;
        workspacePrefs.frame = {
            w: Math.max(760, Math.min(innerWidth, start.w + e.clientX - start.x)), h: Math.max(500, Math.min(innerHeight, start.h + e.clientY - start.y))
        };
        applyWorkspaceWidths();
    };
    const end = () => {
        h.removeEventListener('pointermove', move);
        h.removeEventListener('pointerup', end);
        h.removeEventListener('pointercancel', end);
        if (!moved)
            return;
        resetView = true;
        rememberWorkspace();
        render();
    };
    h.addEventListener('pointermove', move);
    h.addEventListener('pointerup', end);
    h.addEventListener('pointercancel', end);
}, true);
app.addEventListener('dblclick', event => {
    if (event.target.closest('[data-frame-resize]')) {
        workspacePrefs.frame = null;
        resetView = true;
        rememberWorkspace();
        render();
    }
});
app.addEventListener('input', event => {
    const key = event.target.dataset.editorColor;
    if (!['stageColor', 'canvasColor'].includes(key) || !/^#[0-9a-f]{6}$/i.test(event.target.value))
        return;
    workspacePrefs[key] = event.target.value;
    app.style.setProperty(key === 'stageColor' ? '--studio-stage' : '--studio-canvas', event.target.value);
    rememberWorkspace();
});
function imageRegionInspector(image) {
    if ((!image?.src && !image?.assetRef) || !image.sourceSize) return '';
    const [w,h] = image.sourceSize, r = image.region || [0,0,w,h];
    return `<fieldset><legend>원본 이미지 영역</legend><p>원본 ${w}×${h}px · 그림 파일은 보존하고 표시할 부분만 지정합니다. 배치와 입력 영역은 바뀌지 않습니다.</p><div class="image-region-preview"><img src="${esc(assetSource(image, workspaceId))}" alt="원본 이미지 영역 미리보기"><span style="left:${r[0]/w*100}%;top:${r[1]/h*100}%;width:${r[2]/w*100}%;height:${r[3]/h*100}%"></span></div><div class="field-grid">${r.map((v,i) => `<label>영역 ${['X','Y','W','H'][i]}<input type="number" step="1" data-image-region="${i}" value="${v}"></label>`).join('')}</div><button data-action="image-region-apply">이미지 영역 적용</button><button data-action="image-region-reset" ${image.region ? '' : 'disabled'}>원본 전체 보기</button></fieldset>`;
}
function skinEditTarget(screen, selected) {
    return selected?.skin ? selected : componentRoot(screen, selected?.id) || selected;
}
function shadowConfig(selected) {
    return {enabled:false,color:'#000000',opacity:.2,x:0,y:2,blur:2,...selected.effects?.shadow};
}
function shadowInspector(selected) {
    const shadow = shadowConfig(selected);
    return `<details class="shadow-inspector"><summary>그림자 효과</summary><label class="inline"><input type="checkbox" data-shadow-field="enabled" ${shadow.enabled ? 'checked' : ''}>그림자 켜기</label><label>그림자 색<input type="color" data-shadow-field="color" value="${esc(shadow.color)}"></label>${[['opacity','불투명도',0,1,.05],['x','가로 이동 px',-96,96,1],['y','세로 이동 px',-96,96,1],['blur','흐림 px',0,96,1]].map(([key,label,min,max,step]) => `<label>${label}<input type="number" data-shadow-field="${key}" min="${min}" max="${max}" step="${step}" value="${esc(shadow[key])}"></label>`).join('')}<p class="subtle">선택 부품의 게임 보기에서만 표시합니다. 원본 이미지·배치·입력 영역을 바꾸지 않습니다. 초기 입력값은 실제로 조작할 때 저장합니다.</p></details>`;
}
function notificationConfig(selected){
    return {...createNotification(),...selected.notification};
}
function notificationInspector(selected){
    if(selected.partRole!=='badge')return '';
    const notification=notificationConfig(selected),disabled=notification.enabled?'':'disabled';
    return `<details class="notification-inspector"><summary>알림 배지</summary><label class="inline"><input type="checkbox" data-notification-field="enabled" ${notification.enabled?'checked':''}>알림 배지 켜기</label><label>표시 방식<select data-notification-field="mode" ${disabled}><option value="count" ${notification.mode==='count'?'selected':''}>숫자</option><option value="dot" ${notification.mode==='dot'?'selected':''}>점</option></select></label><label>기본 알림 수<input type="number" min="0" step="1" data-notification-field="value" value="${notification.value}" ${disabled}></label><label class="inline"><input type="checkbox" data-notification-field="hideZero" ${notification.hideZero?'checked':''} ${disabled}>0이면 숨김</label><label>최대 표시 수<input type="number" min="1" max="999" step="1" data-notification-field="maxDisplay" value="${notification.maxDisplay}" ${disabled}></label><label>실행 값 키<input data-notification-field="valueKey" maxlength="128" placeholder="nav.buildCount" value="${esc(notification.valueKey||'')}" ${disabled}></label><p class="subtle">‘0이면 숨김’을 켜면 숫자와 점 모두 0에서 숨깁니다. 최대 표시 수가 99이면 100부터 99+로 표시합니다. 실행 값 키는 게임에서 전달하는 값 이름이며 기본 알림 수와 별도로 바뀝니다. 배지의 모양·색·글꼴은 기존 부품 설정을 사용합니다.</p></details>`;
}
function buttonStateInspector(screen,selected){
    const owner=buttonStateOwner(screen,selected,doc.transitions);if(!owner)return '';
    const c={...createButtonState(),...owner.buttonState},disabled=c.enabled?'':'disabled';
    const images=screen.elements.filter(e=>{if(e.kind!=='image')return false;let p=e.parentId;const seen=new Set();while(p&&!seen.has(p)){if(p===owner.id)return true;seen.add(p);p=screen.elements.find(n=>n.id===p)?.parentId;}return false;});
    const targets=buttonMotionTargets(screen,owner,doc.transitions),depth=c.pressFeedback||{},shadow={enabled:true,color:'#000000',opacity:.12,x:0,y:1,blur:1,...depth.shadow},motionDisabled=c.enabled&&targets.length?'':'disabled',depthDisabled=c.enabled&&depth.enabled?'':'disabled';
    const motion=`<details class="press-depth-inspector"><summary>눌림 깊이 · 앞면과 그림자</summary><label class="inline"><input type="checkbox" data-button-field="pressFeedback.enabled" ${depth.enabled?'checked':''} ${motionDisabled}>눌림 깊이 켜기</label><label>움직일 앞면 묶음<select data-button-field="pressFeedback.target" ${depthDisabled}>${targets.map(e=>`<option value="${esc(e.id)}" ${depth.target===e.id?'selected':''}>앞면 · ${esc(e.name)}</option>`).join('')}</select></label><label>누를 때 내려갈 거리 px<input type="number" min="0" max="16" step=".5" data-button-field="pressFeedback.distance" value="${depth.distance??3}" ${depthDisabled}></label><label class="inline"><input type="checkbox" data-button-field="pressFeedback.shadow.enabled" ${shadow.enabled?'checked':''} ${depthDisabled}>눌림 그림자 사용</label><label>눌림 그림자 색<input type="color" data-button-field="pressFeedback.shadow.color" value="${esc(shadow.color)}" ${depthDisabled}></label>${[['opacity','눌림 불투명도',0,1,.05],['x','눌림 가로 이동 px',-96,96,1],['y','눌림 세로 이동 px',-96,96,1],['blur','눌림 흐림 px',0,96,1]].map(([k,label,min,max,step])=>`<label>${label}<input type="number" data-button-field="pressFeedback.shadow.${k}" value="${shadow[k]}" min="${min}" max="${max}" step="${step}" ${depthDisabled}></label>`).join('')}<p class="subtle">입력 영역·고정 림·배지는 움직이지 않습니다. 그림·글자·비용을 앞면 그룹 하나에 묶어 지정하세요. 눌림 그림자는 위 ‘효과 대상’ 그래픽에만 적용하고 해제하면 원래 그림자로 돌아갑니다.</p></details>`;
    return `<details class="button-state-inspector"><summary>버튼 상태 효과</summary><p class="subtle">버튼: ${esc(owner.name)} · 기본 문서는 효과를 직접 켤 때까지 바뀌지 않습니다.</p><label class="inline"><input type="checkbox" data-button-field="enabled" ${c.enabled?'checked':''}>효과 켜기</label><label>효과 방식<select data-button-field="mode" ${disabled}><option value="tint" ${c.mode==='tint'?'selected':''}>기본 색 변화</option><option value="image" ${c.mode==='image'?'selected':''}>상태별 이미지</option></select></label><label>효과 대상<select data-button-field="targetGraphic" ${disabled}><option value="self" ${c.targetGraphic==='self'?'selected':''}>버튼 전체</option>${images.map(e=>`<option value="${esc(e.id)}" ${c.targetGraphic===e.id?'selected':''}>이미지 · ${esc(e.name)}</option>`).join('')}</select></label><label class="inline"><input type="checkbox" data-button-field="selectable" ${c.selectable?'checked':''} ${disabled}>선택 유지 · 누를 때 전환</label><label class="inline"><input type="checkbox" data-button-field="selected" ${c.selected?'checked':''} ${disabled}>처음 선택됨</label><label>상태 미리보기<select data-button-preview>${Object.entries(BUTTON_STATES).map(([id,label])=>`<option value="${id}" ${buttonPreview===id?'selected':''}>${label}</option>`).join('')}</select></label>${c.mode==='tint'?`<label>${esc(BUTTON_STATES[buttonPreview])} 색<input type="color" data-button-field="tints.${buttonPreview}" value="${esc(c.tints[buttonPreview])}" ${disabled}></label>`:`<label>현재 상태 이미지 넣기<input type="file" data-button-image="file" accept="image/png,image/jpeg,image/webp" ${disabled}></label><label>현재 상태 프로젝트 이미지 경로<input data-button-image="path" placeholder="/ui-studio/source/assets/…/image.png" ${disabled}></label><button data-button-clear="${buttonPreview}" ${!c.images?.[buttonPreview]?'disabled':''}>현재 상태 이미지 해제</button><p class="subtle">${c.images?.[buttonPreview]?'현재 상태 이미지가 있습니다.':'현재 상태 이미지가 없으면 기본 상태 이미지, 그다음 기존 이미지를 사용합니다.'} PNG/JPEG/WebP 300KB 이하. 글자는 별도 텍스트 부품으로 유지합니다.</p>`}${motion}<p class="subtle">게임 보기에서 기본·가리킴/초점·눌림·선택·비활성을 표시합니다. 미리보기 상태는 보기 설정입니다. 선택 유지만 시험 실행 중 별도 상태로 남고 설계 기본값과 게임 수치는 바뀌지 않습니다. 사용 불가는 기존 ‘사용 가능’ 설정을 따릅니다.</p></details>`;
}
function changePartType(e, field, value) {
    const roleKinds = {image: 'image', label: 'text', background: 'panel', frame: 'panel'};
    if (field === 'partRole') {
        e.partRole = value;
        if (roleKinds[value]) e.kind = roleKinds[value];
    } else {
        e.kind = value;
        if (value === 'image' || value === 'text') e.partRole = value === 'image' ? 'image' : 'label';
        else if (roleKinds[e.partRole] && roleKinds[e.partRole] !== value) e.partRole = 'container';
    }
    if (e.kind === 'text') { delete e.image; if(e.appearance?.variant==='image')delete e.appearance.variant; }
}
function partsPanel(screen, e) {
    const root = componentRoot(screen, e.id), im = inputMode(e, doc.transitions), owner = inputOwner(screen, e.id, doc.transitions);
    const children = root ? screen.elements.filter(n => n.parentId === root.id || screen.elements.find(p => p.id === n.parentId)?.parentId === root.id) : [];
    const actions = owner ? doc.transitions.filter(t => t.fromScreen === screen.id && t.fromElement === owner.id) : [];
    const inputSelect = (label, key, value, choices) => `<label>${label}<select data-part-field="${key}">${Object.entries(choices).map(([v, n]) => `<option value="${v}" ${v === value ? 'selected' : ''}>${n}</option>`).join('')}</select></label>`;
    return skinInspector(skinEditTarget(screen, e), e) + shadowInspector(e) + notificationInspector(e) + buttonStateInspector(screen,e) + `<section class="parts-inspector"><h3>부품 구조 · 입력 설명</h3><p>${root ? esc(root.name) + ' › ' + esc(PART_ROLES[e.partRole] || e.name) : esc(e.name)}</p><p class="part-input-note"><b>${INPUT_MODES[im]}</b> · ${owner ? '입력 대상: ' + esc(owner.name) : im === 'block' ? '뒤의 입력을 차단합니다.' : '게임 기능을 실행하지 않습니다.'}</p>${actions.length ? `<ul class="part-actions">${actions.map(t => `<li><button data-edge="${esc(t.id)}">탭 → ${esc(t.label || actionNames[t.action])}</button><small>조건: ${esc(conditionNames[t.condition])}${t.targetScreen ? ' · 대상: ' + esc(screenById(doc, t.targetScreen)?.name || '미정') : ''}</small></li>`).join('')}</ul>` : e.control ? '<p class="subtle">이 부품의 값은 입력·선택 동작에서 설정하고 동작 시험에서 조작합니다.</p>' : owner ? '<p class="subtle">동작 연결을 지정해야 합니다.</p>' : ''}${root ? `<div class="button-row"><button data-action="parts-enter" ${editingComponent === root.id ? 'disabled' : ''}>부품 안으로</button><button data-action="parts-exit">전체 선택</button></div><p class="subtle">전체는 한 번 클릭, 내부는 ‘부품 안으로’ 후 클릭 또는 Alt+클릭. 아래 이름으로 정확히 고를 수 있습니다.</p><div class="part-list"><button data-element="${esc(root.id)}">▣ 전체 · ${esc(root.name)}</button>${children.map(n => `<button data-element="${esc(n.id)}" aria-pressed="${n.id === e.id}">${esc(PART_ROLES[n.partRole] || n.kind)} · ${esc(n.name)}</button>`).join('')}</div>` : `<button data-action="decompose-parts" ${screen.elements.some(n => n.parentId === e.id) || e.binding?.type === 'content-slot' || e.isGroup || e.menu ? 'disabled' : ''}>이미지 + 프레임으로 분해</button><p class="subtle">기존 ID·배치·행동 연결을 유지하고 바탕/이미지/텍스트/프레임을 나눕니다.</p>`}
    ${e.inset ? `<fieldset><legend>부모에 맞춤 · 여백 px</legend><div class="field-grid">${e.inset.map((v, i) => `<label>${['상', '우', '하', '좌'][i]}<input type="number" data-inset="${i}" value="${v}"></label>`).join('')}</div></fieldset>` : ''}${inputSelect('부품 역할', 'partRole', e.partRole || (e.kind === 'image' ? 'image' : e.kind === 'text' ? 'label' : 'container'), PART_ROLES)}
    ${inputSelect('게임 입력', 'mode', im, INPUT_MODES)}
    ${im === 'action' ? `<label class="inline"><input type="checkbox" data-part-field="enabled" ${e.interaction?.enabled !== false ? 'checked' : ''}>사용 가능</label><label>비활성 이유<input data-part-field="reason" maxlength="1000" value="${esc(e.interaction?.reason || '')}"></label>${inputSelect('실제 입력 도형', 'shape', e.interaction?.shape || 'rectangle', {
        rectangle: '사각형', ellipse: '타원'
    })}<small>입력 범위는 이 요소의 X/Y/W/H입니다. 점선은 선택 사선과 다른 입력 범위입니다.</small>` : ''}
    ${e.kind === 'image' || e.partRole === 'background' ? `<fieldset><legend>이미지 내용</legend><p>프레임은 별도 부품입니다. 이미지를 교체해도 프레임·입력·배치를 유지합니다.</p><label class="inline"><input type="checkbox" data-part-field="image.preserveColor" ${e.image?.preserveColor ? 'checked' : ''}>3D 원본 색상 유지</label><label>이미지 이름<input data-part-field="image.alt" maxlength="1000" value="${esc(e.image?.alt || e.name)}"></label>${inputSelect('이미지 맞춤', 'image.fit', e.image?.fit || 'contain', {
        contain: '전체 맞춤', cover: '가득 채우기 · 잘림', fill: '영역에 늘이기'
    })}<label>상단 아치 높이 · 논리 px (0은 끔)<input type="number" data-part-field="image.topArchHeight" min="0" max="10000" step="1" value="${esc(e.image?.topArchHeight ?? 0)}"></label><small>이미지 표시만 자릅니다. 선택·입력 범위는 기존 사각형을 유지합니다.</small>${inputSelect('등록 이미지 자원', 'image.asset', e.image?.asset || '', {
        '': '미지정 · 직접 파일 사용', icon: '공통 아이콘 이미지'
    })}<label>실제 이미지 넣기<input data-image-file type="file" accept="image/png,image/jpeg,image/webp"></label><small>PNG/JPEG/WebP 최대300KB. 선택 프로젝트의 자원 폴더에 보존하며 설계는 참조를 저장합니다. 전체 설계2MB.</small><label>저장된 이미지 재사용<select data-workspace-image><option value="">이미지 선택</option>${workspaceAssets.map(asset => `<option value="${esc(asset.assetRef)}" ${asset.assetRef === e.image?.assetRef ? 'selected' : ''}>${esc(asset.assetRef.slice(0,20))}… · ${asset.width}×${asset.height}</option>`).join('')}</select></label><button data-action="image-assets-load">이미지 목록 새로 읽기</button><label>프로젝트 이미지 경로<input data-project-image type="text" placeholder="/ui-studio/source/assets/…/image.png"></label><small>프로젝트 자원 경로를 입력하고 Tab으로 적용합니다. 외부 주소는 지원하지 않습니다.</small>${imageRegionInspector(e.image)}<button data-action="image-clear" ${e.image?.src || e.image?.assetRef || e.image?.asset ? '' : 'disabled'}>대체 이미지로 복원</button></fieldset>` : ''}
    <p class="subtle">편집 선택과 게임 입력은 별개입니다. 바탕도 편집할 수 있지만 입력을 지정하지 않으면 기능이 실행되지 않습니다.</p></section>`;
}
app.addEventListener('keydown', event => {
    if (mode === 'play' && !event.target._buttonStateController && ['Enter', ' '].includes(event.key) && event.target.matches('.ui-element[role=button]:not(button)')) {
        event.preventDefault();
        event.target.click();
    }
});
function skinInspector(e, selected = e) {
    const mode = selected.skin ? selected.skin.mode === '3' ? 'button' : 'backplate' : 'none';
    const frame = selected.kind === 'panel' ? `<label>프레임 방식 · 선택 부품<select data-skin-mode>${[['none','없음'],['backplate','정보 백판 · 9슬라이스'],['button','버튼 · 3슬라이스']].map(([id,name]) => `<option value="${id}" ${mode === id ? 'selected' : ''}>${name}</option>`).join('')}</select></label>` : '';
    if (!e.skin)
        return frame ? `<section class="skin-inspector">${frame}</section>` : '';
    const s = e.skin, a = skinSource(s, skinState), labels = ['상', '우', '하', '좌'];
    const lines = [['top', s.slices[0] / a.h * 100], ['right', s.slices[1] / a.w * 100], ['bottom', s.slices[2] / a.h * 100], ['left', s.slices[3] / a.w * 100]];
    return `<section class="skin-inspector">${frame}<p class="subtle">프레임 대상: ${esc(e.name)}</p><h3>UI 구조 설계 · ${esc(s.name)}</h3><p>${s.mode}슬라이스 · ${esc(SKINS[s.preset].name)} · <span class="tone-chip" style="background:${s.tone}"></span>${s.tone}</p><label>UI 종류<select data-skin-field="preset">${Object.entries(SKINS).map(([id, p]) => `<option value="${id}" ${s.preset === id ? 'selected' : ''}>${p.name}</option>`).join('')}</select></label><label>상태 미리보기<select data-skin-state>${Object.entries(SKIN_STATES).map(([id, n]) => `<option value="${id}" ${skinState === id ? 'selected' : ''}>${n}</option>`).join('')}</select></label><p class="subtle">미리보기 상태는 게임 입력 설정과 별개입니다. 같은 프레임 이미지를 재사용합니다.</p><div class="slice-source" style="aspect-ratio:${a.w}/${a.h};background:${s.tone}"><img src="${esc(assetSource(a, workspaceId))}" alt="${esc(s.name)} 분할 원본">${lines.filter(([, n]) => n > 0).map(([side, n]) => `<i class="slice-line line-${side}" style="${side}:${n}%"></i>`).join('')}</div><label>현재 상태의 프레임 이미지 교체<input type="file" data-skin-image accept="image/png,image/jpeg,image/webp"></label><label>프레임 프로젝트 이미지 경로<input type="text" data-skin-project-image placeholder="/ui-studio/source/assets/…/frame.png"></label><small>경로를 입력하고 Tab으로 적용합니다. 현재 상태의 프레임만 교체합니다.</small><small>PNG/JPEG/WebP300KB · 최대4096px. 프로젝트 자원 폴더에 보존하고 현재 미리보기 상태가 참조합니다.</small><small>원본 ${a.w}×${a.h}px · ${esc(s.asset)}.svg · 빨간 선 안쪽을 늘리거나 반복합니다.</small><div class="skin-metrics">${[['slices', '원본 분할 px'], ['edges', '화면 고정폭 px'], ['padding', '내용 여백 px']].map(([key, name]) => `<fieldset><legend>${name} (상·우·하·좌)</legend><div>${s[key].map((v, i) => `<label>${labels[i]}<input type="number" min="0" max="96" data-skin-field="${key}.${i}" value="${v}"></label>`).join('')}</div></fieldset>`).join('')}</div><label>테두리·중앙 확장<select data-skin-field="repeat">${['stretch', 'repeat', 'round'].map(v => `<option value="${v}" ${s.repeat === v ? 'selected' : ''}>${{
        stretch: '늘리기', repeat: '반복', round: '반복 · 개수 맞춤'
    }[v]}</option>`).join('')}</select></label><p>위치·크기 W/H를 바꿔도 고정폭은 유지됩니다. 아이콘과 문자는 아래 부품 목록에서 고릅니다.</p><p class="subtle">${s.preset === 'background' ? '진한 배경 · 게임 입력 없음' : '종류별 파스텔 · 입력 여부는 부품 설명에서 별도 확인'}</p></section>`;
}
