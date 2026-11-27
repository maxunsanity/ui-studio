import { applySkin } from './skins.mjs';
import { acceptsEvent } from './parts.mjs';
import { validateDocument, createRuntime, activate, changeControl, screenById, clone } from './model.mjs';
import { renderLayout,applyOverlayRoot } from './layout-view.mjs';
import { attachControls } from './controls.mjs';
import { overlayPolicy, overlayMotion, blockingOverlayIndex, canOverlayInput, escapeOverlay, createOverlayTimers, syncOverlayFocus, trapOverlayFocus } from './overlay-runtime.mjs';
import {formatNotification} from './notification.mjs';
import {disposeButtonStates} from './button-state.mjs';
/** Lightweight consumer: engine and resources are supplied by a host, never imported here. */
export function mountDesignConsumer(root, initialDesign, { onAction = () => {
}, slots = new Map(), assetView = 'art', workspaceId } = {}) {
    let design = clone(validateDocument(initialDesign)), runtime = createRuntime(design), disposed = false, values = {};
    const checkBadgeValues=(document,next)=>{for(const screen of document.screens)for(const part of screen.elements)if(part.partRole==='badge')formatNotification(part.notification,next);};
    const page = document.createElement('div');
    page.className = 'preview-screen';
    const overlays = document.createElement('div');
    overlays.className = 'consumer-overlays';
    const feedback = document.createElement('div');
    feedback.className = 'consumer-feedback';
    feedback.setAttribute('role', 'status');
    root.replaceChildren(page, overlays, feedback);
    let activeModal = null;
    const timers = createOverlayTimers({ getDesign: () => design, getRuntime: () => runtime, onChange: next => { runtime = next; paint(); } });
    const notifyAction = () => {
        if (runtime.lastAction) onAction({ ...runtime.lastAction, projectId: design.projectId, revision: design.revision });
    };
    const controlChange = change => {
        runtime = changeControl(design, runtime, change.screen, change.element, change.value, { event: change.event });
        notifyAction();
        return runtime;
    };
    function paint() {
        if (disposed)
            return;
        const focusedNode = document.activeElement;
        const previousModal = activeModal;
        // Button visuals read ancestor inert state while rendering, before focus restoration.
        const blockingIndex = blockingOverlayIndex(design, runtime);
        page.inert = blockingIndex >= 0;
        renderLayout(screenById(design, runtime.page), page, {
            mode: 'view', workspaceId, assetView, transitions: design.transitions, slots, menuState: runtime.menuOpen, values, runtime, text: e => String(e.text || '').replace(/\{\{([a-zA-Z0-9_.-]+)\}\}/g, (_, key) => String(values[key] ?? '—'))
        });
        attachControls(page, screenById(design, runtime.page), runtime, { onChange: controlChange });
        const existing = new Map([...overlays.children].map(node => [node.dataset.overlayKey, node]));
        const panels = new Map();
        for (const id of runtime.overlays) {
            const s = screenById(design, id);
            if (!s)
                continue;
            const key = id, policy = overlayPolicy(s), motion = overlayMotion(s, !!root.ownerDocument.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
            let backdrop = existing.get(key), panel = backdrop?.firstElementChild;
            existing.delete(key);
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.dataset.overlayKey = key;
                panel = document.createElement('div');
                backdrop.append(panel);
                overlays.append(backdrop);
            }
            backdrop.inert = panel.inert = runtime.overlays.lastIndexOf(id) < blockingIndex;
            backdrop.className = 'modal-backdrop type-' + policy.type + (policy.dim ? '' : ' no-dim');
            backdrop.style.pointerEvents = policy.blocking ? 'auto' : 'none';
            panel.className = 'preview-overlay ' + policy.type + ' effect-' + motion.effect;
            panel.style.setProperty('--motion-ms', motion.durationMs + 'ms');
            panel.style.pointerEvents = 'auto';
            panel.setAttribute('aria-label', s.name);
            applyOverlayRoot(panel, s, {
                live: true, workspaceId
            });
            renderLayout(s, panel, {
                workspaceId, assetView, transitions: design.transitions, menuState: runtime.menuOpen, values, runtime
            });
            attachControls(panel, s, runtime, { onChange: controlChange });
            panels.set(id, panel);
        }
        for (const backdrop of existing.values()) {disposeButtonStates(backdrop.firstElementChild);backdrop.remove();}
        activeModal = syncOverlayFocus(design, runtime, page, panels, { previousModal, previousFocus: focusedNode });
        feedback.textContent = runtime.message || '';
        feedback.hidden = !runtime.message;
        timers.sync();
    }
    const click = event => {
        if (event.target.closest('[data-ui-control]')) return;
        const n = event.target.closest('.ui-element');
        if (!n || !root.contains(n))
            return;
        if (!canOverlayInput(design, runtime, n.dataset.screen)) return;
        if (!acceptsEvent(screenById(design, n.dataset.screen), design.transitions, n, event, root))
            return;
        runtime = activate(design, runtime, n.dataset.screen, n.dataset.element);
        paint();
        notifyAction();
    };
    const key = event => {
        trapOverlayFocus(event, activeModal);
        if (event.key === 'Escape' && runtime.overlays.length) {
            event.preventDefault(); event.stopPropagation();
            runtime = escapeOverlay(design, runtime); paint();
        }
        if (!event.target._buttonStateController && ['Enter', ' '].includes(event.key) && event.target.matches('.ui-element[role=button]:not(button)')) {
            event.preventDefault();
            event.target.click();
        }
    };
    root.addEventListener('click', click);
    root.addEventListener('keydown', key);
    paint();
    return {
        updateDesign(next) {
            validateDocument(next);
            if (next.projectId !== design.projectId || next.revision < design.revision)
                throw Error('다른 설계 또는 오래된 버전');
            checkBadgeValues(next,values);
            timers.reset();
            design = clone(next);
            if (!screenById(design, runtime.page))
                runtime.page = design.entryScreen;
            const retained = runtime.overlays.map((id, index) => ({ id, trigger: runtime.focusStack[index] })).filter(({ id }) => screenById(design, id));
            runtime.overlays = retained.map(({ id }) => id);
            runtime.focusStack = retained.map(({ trigger }) => trigger);
            runtime.overlayQueue = (runtime.overlayQueue || []).filter(({ screenId }) => screenById(design, screenId));
            paint();
        }, updateState(next) {
            if (!next || typeof next !== 'object' || Array.isArray(next) || Object.values(next).some(v => !['string', 'number', 'boolean'].includes(typeof v)))
                throw Error('표시 값 형식 오류');
            checkBadgeValues(design,next);
            values = {
                ...next
            };
            paint();
        }, getState: () => clone(runtime), getDesign: () => clone(design), dispose() {
            disposed = true;
            timers.dispose();
            root.removeEventListener('click', click);
            root.removeEventListener('keydown', key);
            disposeButtonStates(page);for(const backdrop of overlays.children)disposeButtonStates(backdrop.firstElementChild);
            root.replaceChildren();
        }
    };
}
