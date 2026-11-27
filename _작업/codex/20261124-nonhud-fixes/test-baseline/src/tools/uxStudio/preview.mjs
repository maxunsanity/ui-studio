import {planningPreviewTarget,readPlanningIndex} from './planning-panel.mjs';
import {projectContext} from './project-context.mjs';
import {normalizePresentationMode} from './presentation.mjs';
import { scopeURL } from './project-manager.mjs';
import './styles.css';
import { mountDesignConsumer } from './consumer.mjs';
import { assetSource } from './asset-reference.mjs';
const params = new URL(location.href).searchParams;
const workspaceId = params.get('workspace') || null;
const id = params.get('project'), status = document.querySelector('#consumer-status'), host = document.querySelector('#consumer-phone');
const previewToken = 'simulator_module_preview_return';
const projectIdPattern = /^[a-z][a-z0-9-]{0,47}$/;
let look = params.get('look');
let boardLocked = params.get('board')==='1';
function returnURL(raw) {
    if (!workspaceId || !raw || raw.length>2800) return null;
    try {
        const url = new URL(raw, location.href);
        return url.origin===location.origin && url.pathname===location.pathname
            && url.searchParams.get('workspace')===workspaceId
            && projectIdPattern.test(url.searchParams.get('project') || '') ? url : null;
    } catch { return null; }
}
const origin = returnURL(params.get('return'));
let consumer, loading = false, requestedRevision = 0, channel, dirtyRequest = false, folderProject, previewPage = null;
const incomingClock = Number(params.get('clock'));
let clockStarted = Number.isSafeInteger(incomingClock) && incomingClock > 0 && incomingClock <= Date.now() ? incomingClock : 0;
let clockTimer, overlayTimer, overlayBasePage;
function updatePreviewClock(elements, screen) {
    const elementId = elements?.[screen];
    if (!elementId) return;
    const label = Array.from(host.querySelectorAll('[data-element]'))
        .find(node => node.dataset.element===elementId)?.querySelector(':scope > .element-text');
    if (!label) return;
    clockStarted ||= Date.now();
    const seconds = Math.max(0, Math.ceil((300000 - (Date.now() - clockStarted)) / 1000));
    const toTwo = value => String(value).padStart(2,'0');
    label.textContent = toTwo(Math.floor(seconds/60))+':'+toTwo(seconds%60);
}
async function load() {
    if (loading) {
        dirtyRequest = true;
        return;
    }
    loading = true;
    try {
        if (!/^[a-z][a-z0-9-]{0,47}$/.test(id || ''))
            throw Error('설계 ID를 확인하세요.');
        const response = await fetch(scopeURL('/api/ux-studio/project?id=' + encodeURIComponent(id), workspaceId), {
            cache: 'no-store'
        });
        if (!response.ok)
            throw Error('저장한 설계를 읽지 못했습니다.');
        const { document: d } = await response.json();
        const index = workspaceId ? await readPlanningIndex() : null;
        const review = index?.costumePreview?.workspaceId===workspaceId ? index.costumePreview : null;
        const definition = review?.projects?.[id];
        function applyLook() {
            const knownLook = review?.looks && Object.hasOwn(review.looks,look) ? review.looks[look] : null;
            if (!knownLook || !definition) return;
            for (const screen of d.screens) {
                for (const element of screen.elements) {
                    const slot=definition.current?.[element.id], image=slot && knownLook[slot];
                    if (image && element.image) element.image={...image,fit:element.image.fit};
                    const textSlot=definition.copy?.[element.id];
                    if (textSlot && typeof knownLook[textSlot]==='string') element.text=knownLook[textSlot];
                }
            }
        }
        applyLook();
        if (boardLocked && definition?.lockedOverlays) {
            for (const transition of d.transitions) {
                if (transition.action==='open' && Object.hasOwn(definition.lockedOverlays,transition.targetScreen)) {
                    transition.targetScreen=definition.lockedOverlays[transition.targetScreen];
                }
            }
        }
        const requested = params.get('screen');
        const startScreen = (boardLocked && definition?.lockedEntries?.[requested]) || requested;
        const backModule = params.get('back');
        const previewEntry = index?.projects?.find(entry => entry.workspaceId === workspaceId && entry.projectId === id);
        const formation = previewEntry?.previewFormation;
        const overlays = previewEntry?.previewOverlays;
        const requestedOverlay = params.get('overlay');
        const timedOverlay = previewEntry?.previewTimedOverlay;
        function tickPreviewClock() {
            const countdowns = previewEntry?.previewCountdown || {};
            for (const screen of Object.keys(countdowns)) updatePreviewClock(countdowns,screen);
        }
        const selectedMons = (runtime) => formation.cards.filter(card => runtime.controlValues[formation.screen]?.[card.toggle] ?? card.initial);
        const nodeFor = (id) => host.querySelector(`[data-element="${id}"]`);
        function formationText(id, value) {
            const label = nodeFor(id)?.querySelector(':scope > .element-text');
            if (label) label.textContent = value;
        }
        function syncFormation() {
            if (!formation || !consumer) return;
            const chosen = selectedMons(consumer.getState());
            formationText(formation.count, '출격 편성 ' + chosen.length + ' / ' + formation.limit);
            formationText(formation.hint, chosen.length === formation.limit ? '다섯 칸이 모두 찼어요' : chosen.length ? '카드 체크로 추가 · 해제' : '출격할 몬스를 골라 주세요');
            const defend = nodeFor(formation.defend);
            if (defend) {
                defend.disabled = !chosen.length;
                defend.inert = !chosen.length;
                defend.setAttribute('aria-disabled', String(!chosen.length));
                defend.style.opacity = chosen.length ? '' : '.45';
            }
            for (const card of formation.cards) {
                const node = nodeFor(card.card);
                if (node) node.style.outline = chosen.includes(card) ? '2px solid #678398' : '';
            }
            const renderSlot = (slot, index) => {
                const card = chosen[index], box = nodeFor(slot.image)?.querySelector('.image-content');
                if (slot.name) formationText(slot.name, card?.name ?? '빈칸');
                if (!box) return;
                box.style.display = card ? '' : 'none';
                if (!card) return;
                let image = box.querySelector('img');
                if (!image) {
                    image = document.createElement('img');
                    image.style.objectFit = 'contain';
                    box.replaceChildren(image);
                }
                const source = assetSource(card.image, workspaceId);
                if (image.getAttribute('src') !== source) image.src = source;
                image.alt = card.name;
            };
            formation.slots.forEach(renderSlot);
            formation.battleSlots.forEach(renderSlot);
            formation.resultSlots?.forEach(slot => renderSlot(slot, slot.index));
        }
        const originExits = previewEntry?.previewOriginExits;
        if (origin && originExits?.entries?.includes(startScreen)) {
            const elements = new Set(originExits.elements);
            for (const transition of d.transitions) {
                if (elements.has(transition.fromElement)) Object.assign(transition, {
                    action:'module', targetScreen:null, payload:{moduleId:previewToken,label:'진입 화면으로 돌아가기'}
                });
            }
        }

        if (workspaceId && startScreen && d.screens.some(screen => screen.id===startScreen && screen.kind==='page')) {
            d.entryScreen = startScreen;
            const fallback = backModule && planningPreviewTarget(index,{workspaceId,projectId:id,moduleId:backModule});
            if (origin || fallback) {
                const dedicatedExit = definition?.returnExits?.[startScreen];
                const exits = d.transitions.filter(t =>
                    t.fromScreen===startScreen && (t.action==='back' && (!t.condition || t.condition==='always') ||
                        t.fromElement===startScreen+'.back' && ['navigate','module'].includes(t.action)) ||
                    origin && dedicatedExit===t.fromElement);
                for (const back of exits) Object.assign(back,{action:'module',targetScreen:null,payload:{moduleId:origin?previewToken:backModule,label:'이전 화면'}});
            }
        }
        if(workspaceId&&!folderProject){const meta=await fetch(scopeURL('/api/ux-studio/workspace',workspaceId),{cache:'no-store'});if(!meta.ok)throw Error('프로젝트 폴더 정보를 읽지 못했습니다.');folderProject=(await meta.json()).workspace;}
        const context=projectContext({workspaceId,workspace:folderProject,document:d});
        document.querySelector('#preview-project').textContent=context.label+' · '+context.name+' · '+context.directory;
        const firstMount = !consumer;
        if (consumer)
            consumer.updateDesign(d);
        else
            consumer = mountDesignConsumer(host, d, {
                simulatePurchases: true,
                presentationMode: normalizePresentationMode('ui', workspaceId),
                workspaceId,
                allowControlChange(change, runtime) {
                    return !formation || change.screen !== formation.screen || !change.value
                        || selectedMons(runtime).length < formation.limit;
                },
                onRender: page => {
                    tickPreviewClock();
                    if (overlayBasePage !== page.id) {
                        overlayBasePage = page.id;
                        clearTimeout(overlayTimer);
                        if (requestedOverlay && overlays?.[requestedOverlay] === page.id) {
                            queueMicrotask(() => consumer?.showOverlay(requestedOverlay));
                        } else if (timedOverlay?.page === page.id) {
                            overlayTimer = setTimeout(() => consumer?.showOverlay(timedOverlay.id), timedOverlay.delayMs);
                        }
                    }
                    if (formation) queueMicrotask(syncFormation);
                    const applied=definition?.commits?.[page.id];
                    if (applied && applied!==look) {
                        look=applied;
                        queueMicrotask(() => {
                            applyLook();
                            consumer?.updateDesign(d);
                        });
                    }
                    const mode=definition?.boardPages?.[page.id];
                    if (mode) boardLocked=mode==='locked';
                },
                onAction: async e => {
                    if (e.type === 'control-change' && e.screen === formation?.screen) syncFormation();
                    if (workspaceId && e.type === 'ui.action' && e.action === 'module.open') {
                        if(origin && e.moduleId===previewToken){
                            if(look && review?.looks?.[look])origin.searchParams.set('look',look);
                            if(boardLocked)origin.searchParams.set('board','1');
                            else origin.searchParams.delete('board');
                            location.assign(origin.href);
                            return;
                        }
                        const target = planningPreviewTarget(index, {workspaceId, projectId:id, moduleId:e.moduleId, elementId:e.elementId});
                        if (target) {
                            const url = new URL(location.href);
                            url.search = new URLSearchParams({workspace:workspaceId, project:target.projectId}).toString();
                            if(target.screenId)url.searchParams.set('screen',target.screenId);
                            if(target.overlay)url.searchParams.set('overlay',target.overlay);
                            if(target.carryClock && clockStarted)url.searchParams.set('clock',String(clockStarted));
                            if(target.backModule)url.searchParams.set('back',target.backModule);
                            if(look && review?.looks?.[look])url.searchParams.set('look',look);
                            if(boardLocked)url.searchParams.set('board','1');
                            if(target.rememberOrigin){
                                const backURL=new URL(location.href);
                                const runtime = consumer?.getState();
                                if (runtime?.page) backURL.searchParams.set('screen',runtime.page);
                                const currentOverlay = runtime?.overlays.at(-1);
                                if (overlays?.[currentOverlay] === runtime?.page) backURL.searchParams.set('overlay',currentOverlay);
                                else backURL.searchParams.delete('overlay');
                                if(target.carryClock && clockStarted)backURL.searchParams.set('clock',String(clockStarted));
                                const path=backURL.pathname+backURL.search;
                                if(path.length<=2800)url.searchParams.set('return',path);
                            }
                            location.assign(url.href);
                            return;
                        }
                    }
                    document.querySelector('#action-output').textContent = e.type === 'control-change' ? e.element + ' · 값 ' + String(e.value) + (e.valid ? '' : ' · ' + e.message) : e.moduleId + ' · 연결 요청 수신 (게임 실행 없음)';
                    fit();
                }
            });
        const size = d.screens.find(screen => screen.id === d.entryScreen)?.logicalSize || d.designBasis?.logicalSize || {w:390,h:844};
        host.style.width = (size.w ?? size.width ?? 390) + 'px';
        host.style.height = (size.h ?? size.height ?? 844) + 'px';
        status.textContent = d.name + ' · r' + d.revision + ' · 공통 UI 설계 반영됨';
        fit();syncPreviewPage();
        clearInterval(clockTimer);
        if (previewEntry?.previewCountdown) {
            clockTimer = setInterval(tickPreviewClock,250);
        }
        if (firstMount) {
            const entry = index?.projects?.find(project => project.workspaceId===workspaceId && project.projectId===id);
            const action = entry?.previewEntryActions?.[d.entryScreen];
            if (d.transitions.some(transition => transition.fromScreen===d.entryScreen && transition.fromElement===action && transition.action==='open')) {
                Array.from(host.querySelectorAll('[data-element]'))
                    .find(element => element.dataset.element===action)?.click();
            }
        }
        requestedRevision = Math.max(requestedRevision, d.revision);
    }
    catch (e) {
        status.textContent = e.message;
    }
    finally {
        loading = false;
        if (dirtyRequest) {
            dirtyRequest = false;
            load();
        }
    }
}
document.querySelector('#refresh-design').onclick = load;
if ('BroadcastChannel' in window) {
    channel = new BroadcastChannel('ux-studio-design');
    channel.onmessage = e => {
        if (e.data?.type === 'design.saved' && (e.data.workspace || null) === workspaceId && e.data.projectId === id && Number.isSafeInteger(e.data.revision) && e.data.revision > requestedRevision) {
            requestedRevision = e.data.revision;
            load();
        }
    };
}
window.addEventListener('pagehide', () => {
    channel?.close();
    pageObserver?.disconnect();
    consumer?.dispose();
}, {
    once: true
});
load();
function fit() {
    const width = parseFloat(host.style.width) || 390, height = parseFloat(host.style.height) || 844, stage = document.querySelector('#consumer-stage'), viewport = document.documentElement;
    let heightScale=1;
    if(Number.isFinite(viewport.clientHeight)&&viewport.clientHeight>0){
        const rect=stage.getBoundingClientRect(),footer=document.querySelector('#action-output'),footerRect=footer.getBoundingClientRect(),px=value=>parseFloat(value)||0;
        const bottom=Math.max(0,footerRect.bottom-rect.bottom)+px(window.getComputedStyle(footer).marginBottom)+px(window.getComputedStyle(document.body).paddingBottom);
        const available=viewport.clientHeight-(rect.top+(window.scrollY||0))-bottom;
        heightScale=Math.max(1,available)/height;
    }
    const scale=Math.max(.001,Math.min(1,(viewport.clientWidth-36)/width,heightScale));
    host.style.transform = 'scale(' + scale + ')';
    stage.style.width = width * scale + 'px';
    stage.style.height = height * scale + 'px';
}
window.addEventListener('resize', fit);
function syncPreviewPage(){
    if(!consumer)return;
    const page=consumer.getState().page;
    if(previewPage!==null&&page!==previewPage)window.scrollTo({left:0,top:0,behavior:'instant'});
    previewPage=page;
}
// Observe the public page state after the consumer paints; overlay/list updates keep outer scroll.
const pageObserver=typeof MutationObserver==='function'?new MutationObserver(syncPreviewPage):null;
pageObserver?.observe(host,{childList:true,subtree:true,attributes:true,attributeFilter:['data-screen']});
