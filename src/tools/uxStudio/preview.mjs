// Optional Studio preview input for the authored roll-control fixture.
let removeRollPreviewControl;

function installRollPreviewControl(host, config, getState) {
    removeRollPreviewControl?.();
    removeRollPreviewControl = undefined;
    if (!config) return;
    const controller = new AbortController();
    const listener = {capture: true, signal: controller.signal};
    let timer;
    let activePointer = null;
    let multiplier = config.defaultMultiplier;
    const clearHold = () => {
        clearTimeout(timer);
        activePointer = null;
    };
    const eligible = () => {
        const state = getState();
        return state?.page === config.screen && !state.overlays.length;
    };
    const sourceId = event => event.target.closest?.('[data-element]')?.dataset.element;
    host.addEventListener('click', event => {
        if (!eligible() || sourceId(event) !== config.multiplier) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        const label = host.querySelector(`[data-element="${config.multiplierText}"] > .element-text`);
        if (!label) return;
        const shown = Number(label.textContent.replace('×',''));
        const next = config.allowed.indexOf(Number.isFinite(shown) ? shown : multiplier) + 1;
        multiplier = config.allowed[next % config.allowed.length];
        label.textContent = '×' + multiplier;
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches)
            label.animate([{transform:'translateY(6px)',opacity:.35},{transform:'translateY(0)',opacity:1}],120);
    }, listener);
    host.addEventListener('pointerdown', event => {
        if (!eligible() || event.button !== 0 || !event.isPrimary || sourceId(event) !== config.roll) return;
        clearHold();
        activePointer = event.pointerId;
        timer = setTimeout(() => {
            if (!eligible()) return;
            const url = new URL(location.href);
            url.searchParams.set('project',config.autoProject);
            url.searchParams.set('screen',config.autoScreen);
            url.searchParams.delete('overlay');
            location.assign(url.href);
        }, config.holdMs);
    }, listener);
    for (const name of ['pointerup','pointercancel','lostpointercapture'])
        window.addEventListener(name,event => {
            if (event.pointerId === activePointer) clearHold();
        }, listener);
    window.addEventListener('blur',clearHold,listener);
    removeRollPreviewControl = () => {
        controller.abort();
        clearHold();
    };
}

import {planningPreviewTarget,readPlanningIndex} from './planning-panel.mjs';
import {applyArrivalScenario,lobbyArrivalDesign} from './arrival-preview.mjs';
import {projectContext} from './project-context.mjs';
import {normalizePresentationMode} from './presentation.mjs';
import {isMenuSheetPage} from './overlay-runtime.mjs';
import { scopeURL } from './project-manager.mjs';
import './styles.css';
import './presentation.css';
import { mountDesignConsumer } from './consumer.mjs';
import { assetSource } from './asset-reference.mjs';
import {createTeamOutfitReview} from './team-outfit-review.mjs';
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
if (origin) {
    const returnLink = document.createElement('a');
    returnLink.href = origin.href;
    returnLink.textContent = '이전 화면으로';
    document.querySelector('#refresh-design')?.before(returnLink);
}
let consumer, teamOutfitReview, loading = false, requestedRevision = 0, channel, dirtyRequest = false, folderProject, previewPage = null;
const incomingClock = Number(params.get('clock'));
let clockStarted = Number.isSafeInteger(incomingClock) && incomingClock > 0 && incomingClock <= Date.now() ? incomingClock : 0;
let clockTimer, overlayTimer, overlayBasePage, skillOfferAt = 0, skillOfferShown = false;
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
                    if (image && element.image) element.image={...image,fit:element.image.fit,...(element.image.preserveColor ? {preserveColor:true} : {})};
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
        const quickLinkEntry = previewEntry?.previewQuickLinks ? previewEntry : index?.projects?.find(
            entry => entry.workspaceId === workspaceId && entry.projectId === origin?.searchParams.get('project')
        );
        const refreshButton = document.querySelector('#refresh-design');
        if (previewEntry?.planningDocument === 'P265' && refreshButton && !document.querySelector('[data-kpop-preview-index]')) {
            const guide = document.createElement('a');
            guide.href = '/ui-studio/source/guide/reference/kpop-planning/common-ui-finish/all-previews.html';
            guide.textContent = '전체 미리보기';
            guide.dataset.kpopPreviewIndex = '';
            refreshButton.before(guide);
        }
        const arrivalKey=params.get('arrival');
        const arrivalScenarios=previewEntry?.previewArrivalScenarios;
        if(arrivalKey&&Object.hasOwn(arrivalScenarios||{},arrivalKey))applyArrivalScenario(d,arrivalScenarios[arrivalKey]);
        const weeklyKey = params.get('weekly');
        const weeklyOptions = previewEntry?.previewWeeklyFestival;
        const weekly = weeklyKey && Object.hasOwn(weeklyOptions || {},weeklyKey) ? weeklyOptions[weeklyKey] : null;
        if (weekly) for(const screen of d.screens){
            const clock = screen.elements.find(part => part.id === screen.id+'.fest-clock');
            const fuel = screen.elements.find(part => part.id === screen.id+'.fest-fuel-value');
            if (clock) clock.text = weekly.badge;
            if (fuel) fuel.text = weekly.fuel;
        }
        const focusTiles = (params.get('tiles') || '').split(',').slice(0,9).filter(tile=>/^([1-9]|[1-3][0-9]|40)$/.test(tile));
        function markFocusedTiles(page) {
            for (const tile of focusTiles) {
                const element=host.querySelector(`[data-element="${page.id}.board-tile-${tile.padStart(2,'0')}-surface"]`);
                if (!element) continue;
                element.style.outline = '3px solid #ffffff';
                element.style.filter = 'drop-shadow(0 0 4px #4f3664)';
            }
        }
        if (quickLinkEntry?.previewQuickLinks && refreshButton && !document.querySelector('[data-preview-quick-link]')) {
            for (const {screenId, label} of quickLinkEntry.previewQuickLinks) {
                const url = new URL(location.pathname, location.origin);
                url.search = new URLSearchParams({workspace:workspaceId, project:quickLinkEntry.projectId, screen:screenId});
                const link = document.createElement('a');
                link.href = url.href;
                link.textContent = label;
                link.dataset.previewQuickLink = screenId;
                refreshButton.before(link);
            }
        }
        const teamOutfit=previewEntry?.previewTeamOutfit;
        teamOutfitReview=teamOutfit&&createTeamOutfitReview(teamOutfit,{
            host, getRuntime:()=>consumer?.getState(),assetURL:assetSource,
            storage:sessionStorage,workspaceId,
            detailSize:origin?.searchParams.get('screen')==='team-info-ten'?10:
                origin?.searchParams.get('screen')==='team-info'?5:null
        });
        if(teamOutfit&&startScreen===teamOutfit.outfit){
            for(const transition of d.transitions){
                if(transition.fromElement===teamOutfit.outfit+'.back')
                    Object.assign(transition,{action:'navigate',targetScreen:'team-info'});
                if(transition.fromElement===teamOutfit.confirm+'.confirm')
                    Object.assign(transition,{action:'navigate',targetScreen:teamOutfit.appliedPage});
            }
        }
        installRollPreviewControl(host, previewEntry?.previewRollControl, () => consumer?.getState());
        const formation = previewEntry?.previewFormation;
        const deployment = previewEntry?.previewCityDeployment;
        let lastDeployment = 'city-deploy';
        const deploymentStage = (screen) => deployment?.screens[screen];
        const deploymentLimit = (screen) => deployment.stageLimits[deploymentStage(screen)];
        const deployedCount = (runtime, screen) => Object.values(runtime.controlValues[screen] || {}).filter(value => value === true).length;
        const attributeFilter = previewEntry?.previewAttributeFilter;
        const requestedOverlay = params.get('overlay');
        const inspectedOverlay = params.get('inspect') === '1' && startScreen &&
            d.screens.some(s => s.id === startScreen && s.kind === 'page') &&
            d.screens.some(s => s.id === requestedOverlay && s.kind !== 'page');
        const overlays = inspectedOverlay ? {...previewEntry?.previewOverlays,[requestedOverlay]:startScreen} : previewEntry?.previewOverlays;
        const returnOnOverlayDismiss = origin && previewEntry?.previewReturnOnOverlayDismiss
            && requestedOverlay && overlays?.[requestedOverlay] === startScreen;
        let returnAfterRequestedOverlay = false;
        const variant = params.get('variant');
        const variants = previewEntry?.previewVariants?.[startScreen];
        if (variant && variants && Object.hasOwn(variants,variant)) {
            const screen = d.screens.find(s => s.id === startScreen);
            for (const [elementId,value] of Object.entries(variants[variant])) {
                const element = screen?.elements.find(e => e.id === elementId);
                if (element?.control) element.control.value = value;
            }
        }
        const timedOverlay = previewEntry?.previewTimedOverlay;
        function tickPreviewClock() {
            const countdowns = previewEntry?.previewCountdown || {};
            for (const screen of Object.keys(countdowns)) updatePreviewClock(countdowns,screen);
            if (timedOverlay?.label && overlayBasePage === timedOverlay.page) {
                const label = host.querySelector(`[data-element="${timedOverlay.label}"] .element-text`);
                if (label) {
                    const seconds = Math.max(0,Math.ceil((skillOfferAt-Date.now())/1000));
                    label.textContent = skillOfferShown ? '첫 스킬 선택 시간' : '다음 스킬 선택 '+seconds+'초';
                }
            }
        }
        const selectedMons = (runtime) => formation.cards.filter(card => runtime.controlValues[formation.screen]?.[card.toggle] ?? card.initial);
        const nodeFor = (id) => host.querySelector(`[data-element="${id}"]`);
        function formationText(id, value) {
            const label = nodeFor(id)?.querySelector(':scope > .element-text');
            if (label) label.textContent = value;
        }
        function syncCityDeployment(page) {
            if (!deployment || !consumer) return;
            const stage = deploymentStage(page);
            if (stage) lastDeployment = page;
            const runtime = consumer.getState();
            const count = deployedCount(runtime, lastDeployment);
            for (const visible of [page, ...runtime.overlays]) {
                const report = deployment.reports[visible];
                if (report) formationText(report, count + '마리');
            }
            if (!stage) {
                const stagePreview = /^city-(?:stage|auto)-([1-9])$/.exec(page);
                if (stagePreview) formationText(page + '.capacity-preview-label', '최대 ' + deployment.stageLimits[stagePreview[1]] + '마리');
                return;
            }
            const limit = deploymentLimit(page);
            formationText(page + '.capacity', '출격 ' + count + ' / ' + limit);
            formationText(page + '.hint', count === limit ? '출격 상한에 도달했어요. 해제하면 다시 고를 수 있어요.' : '체크해서 추가하거나 해제할 수 있어요.');
            const launch = nodeFor(page + '.launch');
            if (launch) {
                launch.disabled = count === 0;
                launch.setAttribute('aria-disabled', String(count === 0));
            }
            for (const pick of host.querySelectorAll('[data-element^="' + page + '.pick-"] input[type="checkbox"]')) {
                pick.disabled = count === limit && !pick.checked;
                pick.setAttribute('aria-disabled', String(pick.disabled));
            }
        }
        function syncAttributeFilter(page) {
            if (!attributeFilter || attributeFilter.page !== page || !consumer) return;
            const selected = consumer.getState().attributeFilter || [];
            const visible = attributeFilter.cards.filter(card => !selected.length || selected.includes(card.attribute));
            formationText(attributeFilter.label,'속성 '+(selected.length ? selected.join('·') : '전체')+' ▾');
            formationText(attributeFilter.count,selected.length ? '선택한 몬스 '+visible.length+'마리' : '보유 몬스 '+visible.length+'마리');
            for (const card of attributeFilter.cards) {
                const node = nodeFor(card.id);
                if (!node) continue;
                const index = visible.indexOf(card);
                node.style.display = index < 0 ? 'none' : '';
                if (index >= 0) {
                    const {x,y} = attributeFilter.cards[index];
                    node.style.left = x+'%';
                    node.style.top = y+'%';
                }
            }
        }
        function syncFormation() {
            if (!formation || !consumer) return;
            const chosen = selectedMons(consumer.getState());
            formationText(formation.count, '출격 편성 ' + chosen.length + ' / ' + formation.limit);
            const emptyHint = formation.allowEmpty ? '건물 보석으로 방어할 수 있어요.' : '출격할 몬스를 골라 주세요';
            formationText(formation.hint, chosen.length === formation.limit ? '출격 상한에 도달했어요.' : chosen.length ? '카드 체크로 추가 · 해제' : emptyHint);
            const defend = nodeFor(formation.defend);
            if (defend) {
                const blocked = !chosen.length && !formation.allowEmpty;
                defend.disabled = blocked;
                defend.inert = blocked;
                defend.setAttribute('aria-disabled', String(blocked));
                defend.style.opacity = blocked ? '.45' : '';
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
                if (origin && isMenuSheetPage(d.screens.find(screen => screen.id === startScreen))) {
                    for (const transition of d.transitions) {
                        if (transition.fromScreen === startScreen) continue;
                        const source = d.screens.find(screen => screen.id === transition.fromScreen);
                        if (isMenuSheetPage(source) && (transition.action === 'back' || transition.fromElement === source.id + '.back')) exits.push(transition);
                    }
                }
                for (const back of exits) Object.assign(back,{action:'module',targetScreen:null,payload:{moduleId:origin?previewToken:backModule,label:'이전 화면'}});
            }
        }
        if(workspaceId&&!folderProject){const meta=await fetch(scopeURL('/api/ux-studio/workspace',workspaceId),{cache:'no-store'});if(!meta.ok)throw Error('프로젝트 폴더 정보를 읽지 못했습니다.');folderProject=(await meta.json()).workspace;}
        const context=projectContext({workspaceId,workspace:folderProject,document:d});
        document.querySelector('#preview-project').textContent=context.label+' · '+context.name+' · '+context.directory;
        const lobbyPages = arrivalScenarios && !arrivalKey ? new Set(d.transitions.filter(t=>
            t.fromElement===t.fromScreen+'.start' && t.action==='navigate' && t.targetScreen==='flow-01'
        ).map(t=>t.fromScreen)) : null;
        const turnParam=params.get('rollTurn');
        const resumeArrival = lobbyPages && d.entryScreen==='flow-01' && /^\d{1,6}$/.test(turnParam || '');
        let rollTurn = resumeArrival ? Number(turnParam) : 0;
        let playedArrival = resumeArrival ? lobbyArrivalDesign(d,arrivalScenarios,rollTurn) : null;
        let lastArrivalPage;
        const completedArrivalPages = new Set([
            'flow-12','flow-13','flow-14','flow-15','chance-board-08','chance-board-03','concert-arrival','concert-send','concert-result'
        ]);
        if(id==='kpop-flow-battle' && origin?.searchParams.has('rollTurn') && params.get('arrivalTile')==='26'){
            for(const element of d.screens.find(s=>s.id==='arrival')?.elements || []){
                if(element.text==='6번 쟁탈전 도착')element.text='26번 쟁탈전 도착';
            }
        }
        const firstMount = !consumer;
        if (consumer)
            consumer.updateDesign(d);
        else
            consumer = mountDesignConsumer(host, playedArrival?.design || d, {
                simulatePurchases: true,
                presentationMode: normalizePresentationMode('ui', workspaceId),
                workspaceId,
                allowControlChange(change, runtime) {
                    if (deploymentStage(change.screen) && change.value)
                        return deployedCount(runtime, change.screen) < deploymentLimit(change.screen);
                    return !formation || change.screen !== formation.screen || !change.value
                        || selectedMons(runtime).length < formation.limit;
                },
                onRender: page => {
                    if(lobbyPages && lastArrivalPage!==page.id){
                        const from=lastArrivalPage;
                        lastArrivalPage=page.id;
                        if(page.id==='flow-01' && (lobbyPages.has(from) || (playedArrival && completedArrivalPages.has(from)))){
                            rollTurn=lobbyPages.has(from)?0:rollTurn+1;
                            playedArrival=lobbyArrivalDesign(d,arrivalScenarios,rollTurn);
                            queueMicrotask(() => consumer?.updateDesign(playedArrival.design));
                        }
                    }
                    if (focusTiles.length) queueMicrotask(() => markFocusedTiles(page));
                    if (returnOnOverlayDismiss && page.id === startScreen) {
                        queueMicrotask(() => {
                            const runtime = consumer?.getState();
                            if (!runtime || runtime.page !== startScreen) return;
                            if (runtime.overlays.includes(requestedOverlay)) returnAfterRequestedOverlay = true;
                            if (returnAfterRequestedOverlay && !runtime.overlays.length) {
                                returnAfterRequestedOverlay = false;
                                location.assign(origin.href);
                            }
                        });
                    }
                    if (origin && previewEntry?.previewOriginReturnPages?.includes(page.id)) {
                        queueMicrotask(() => location.assign(origin.href));
                        return;
                    }
                    if(teamOutfitReview)queueMicrotask(teamOutfitReview);
                    if (overlayBasePage !== page.id) {
                        overlayBasePage = page.id;
                        clearTimeout(overlayTimer);
                        skillOfferAt = 0;
                        skillOfferShown = false;
                        if (requestedOverlay && overlays?.[requestedOverlay] === page.id) {
                            skillOfferShown = true;
                            queueMicrotask(() => {
                                const behind = previewEntry.canvasReview?.contexts?.[requestedOverlay]?.behind;
                                const parents = behind?.[0] === page.id ? behind.slice(1) : [];
                                consumer?.showOverlay(requestedOverlay, { parents });
                            });
                        } else if (timedOverlay?.page === page.id) {
                            skillOfferAt = Date.now()+timedOverlay.delayMs;
                            overlayTimer = setTimeout(() => {
                                skillOfferShown = true;
                                consumer?.showOverlay(timedOverlay.id);
                                tickPreviewClock();
                            },timedOverlay.delayMs);
                        }
                    }
                    tickPreviewClock();
                    if (formation) queueMicrotask(syncFormation);
                    if (deployment) queueMicrotask(() => syncCityDeployment(page.id));
                    if (attributeFilter) queueMicrotask(()=>syncAttributeFilter(page.id));
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
                    if (e.type === 'control-change' && teamOutfitReview)teamOutfitReview();
                    if (e.type === 'control-change' && e.screen === formation?.screen) syncFormation();
                    if (e.type === 'control-change' && deploymentStage(e.screen)) queueMicrotask(() => syncCityDeployment(e.screen));
                    if (workspaceId && e.type === 'ui.action' && e.action === 'module.open') {
                        if(origin && e.moduleId===previewToken){
                            if(look && review?.looks?.[look])origin.searchParams.set('look',look);
                            if(boardLocked)origin.searchParams.set('board','1');
                            else origin.searchParams.delete('board');
                            location.assign(origin.href);
                            return;
                        }
                        const registeredTarget = planningPreviewTarget(index, {workspaceId, projectId:id, moduleId:e.moduleId, elementId:e.elementId});
                        const target = weekly && e.elementId?.endsWith('.event5') && registeredTarget?.projectId === 'kpop-weekly-festival-ui'
                            ? {...registeredTarget,screenId:weekly.screenId} : registeredTarget;
                        if (target) {
                            const url = new URL(location.href);
                            url.search = new URLSearchParams({workspace:workspaceId, project:target.projectId}).toString();
                            if(target.screenId)url.searchParams.set('screen',target.screenId);
                            if(target.overlay)url.searchParams.set('overlay',target.overlay);
                            if(target.variant)url.searchParams.set('variant',target.variant);
                            if(target.arrivalScenario)url.searchParams.set('arrival',target.arrivalScenario);
                            if(Array.isArray(target.focusTiles))url.searchParams.set('tiles',target.focusTiles.join(','));
                            if(target.carryClock && clockStarted)url.searchParams.set('clock',String(clockStarted));
                            if(target.backModule)url.searchParams.set('back',target.backModule);
                            if(look && review?.looks?.[look])url.searchParams.set('look',look);
                            if(boardLocked)url.searchParams.set('board','1');
                            if(target.rememberOrigin){
                                const backURL=new URL(location.href);
                                const runtime = consumer?.getState();
                                if (target.returnScreen || runtime?.page) backURL.searchParams.set('screen',target.returnScreen || runtime.page);
                                const currentOverlay = runtime?.overlays.at(-1);
                                if (!target.returnScreen && overlays?.[currentOverlay] === runtime?.page) backURL.searchParams.set('overlay',currentOverlay);
                                else backURL.searchParams.delete('overlay');
                                if(target.carryClock && clockStarted)backURL.searchParams.set('clock',String(clockStarted));
                                if(playedArrival?.scenario.terminal && e.elementId===playedArrival.scenario.terminal+'.review-next'){
                                    backURL.searchParams.set('rollTurn',String(rollTurn+1));
                                    url.searchParams.set('arrivalTile',String(playedArrival.scenario.tile));
                                }
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
        if (previewEntry?.previewCountdown || timedOverlay) {
            clockTimer = setInterval(tickPreviewClock,250);
        }
        if (firstMount && !(requestedOverlay && overlays?.[requestedOverlay] === d.entryScreen)) {
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
