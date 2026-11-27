import { applySkin } from './skins.mjs';
import { acceptsEvent } from './parts.mjs';
import { validateDocument, createRuntime, activate, changeControl, screenById, clone } from './model.mjs';
import { renderLayout } from './layout-view.mjs';
import { attachControls } from './controls.mjs';
/** Lightweight consumer: engine and resources are supplied by a host, never imported here. */
export function mountDesignConsumer(root, initialDesign, { onAction = () => {
}, slots = new Map(), assetView = 'art' } = {}) {
    let design = clone(validateDocument(initialDesign)), runtime = createRuntime(design), disposed = false, values = {};
    const page = document.createElement('div');
    page.className = 'preview-screen';
    const overlays = document.createElement('div');
    overlays.className = 'consumer-overlays';
    const feedback = document.createElement('div');
    feedback.className = 'consumer-feedback';
    feedback.setAttribute('role', 'status');
    root.replaceChildren(page, overlays, feedback);
    const focusable = panel => [...panel.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')].filter(n => n.tabIndex >= 0 && n.getAttribute('aria-disabled') !== 'true' && n.getClientRects().length && !n.closest('[inert]'));
    let activeModal = null;
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
        const previousFocus = focusedNode?.closest('.ui-element')?.dataset.element, previousModal = activeModal;
        renderLayout(screenById(design, runtime.page), page, {
            mode: 'view', assetView, transitions: design.transitions, slots, menuState: runtime.menuOpen, text: e => String(e.text || '').replace(/\{\{([a-zA-Z0-9_.-]+)\}\}/g, (_, key) => String(values[key] ?? '—'))
        });
        attachControls(page, screenById(design, runtime.page), runtime, { onChange: controlChange });
        const existing = new Map([...overlays.children].map(node => [node.dataset.overlayKey, node]));
        for (const [index, id] of runtime.overlays.entries()) {
            const s = screenById(design, id);
            if (!s)
                continue;
            const key = index + ':' + id;
            let backdrop = existing.get(key), panel = backdrop?.firstElementChild;
            existing.delete(key);
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.className = 'modal-backdrop';
                backdrop.dataset.overlayKey = key;
                panel = document.createElement('div');
                backdrop.append(panel);
                overlays.append(backdrop);
            }
            panel.className = 'preview-overlay ' + (s.presentation?.type || s.kind) + ' effect-' + (s.presentation?.effect || 'none');
            panel.style.setProperty('--motion-ms', (s.presentation?.durationMs || 0) + 'ms');
            panel.setAttribute('role', 'dialog');
            panel.setAttribute('aria-label', s.name);
            applySkin(panel, s.skin, {
                live: true
            });
            renderLayout(s, panel, {
                assetView, transitions: design.transitions, menuState: runtime.menuOpen
            });
            attachControls(panel, s, runtime, { onChange: controlChange });
        }
        for (const backdrop of existing.values()) backdrop.remove();
        // Match the runtime's blocking rule; toast/popover remain non-modal.
        const blockingId = runtime.overlays.filter(id => !['toast', 'popover'].includes(screenById(design, id)?.presentation?.type)).at(-1);
        const blockingIndex = runtime.overlays.indexOf(blockingId);
        activeModal = blockingId ? overlays.children[blockingIndex]?.firstElementChild : null;
        page.inert = !!activeModal;
        [...overlays.children].forEach((backdrop, index) => { backdrop.inert = !!activeModal && index < blockingIndex; });
        if (activeModal) {
            activeModal.setAttribute('aria-modal', 'true');
            activeModal.tabIndex = -1;
            if (activeModal !== previousModal || !activeModal.contains(focusedNode)) {
                const candidates = focusable(activeModal);
                (candidates.find(n => n.closest('.ui-element')?.dataset.element === previousFocus) || candidates[0] || activeModal).focus();
            }
        } else if (!page.contains(focusedNode) && (previousFocus || runtime.focusReturn)) {
            const targetId = previousFocus && [...page.querySelectorAll('[data-element]')].some(n => n.dataset.element === previousFocus) ? previousFocus : runtime.focusReturn;
            const target = [...page.querySelectorAll('[data-element]')].find(n => n.dataset.element === targetId);
            (target?.querySelector('input:not(:disabled),select:not(:disabled),button:not(:disabled)') || target)?.focus();
        }
        feedback.textContent = runtime.message || '';
        feedback.hidden = !runtime.message;
    }
    const click = event => {
        if (event.target.closest('[data-ui-control]')) return;
        const n = event.target.closest('.ui-element');
        if (!n || !root.contains(n))
            return;
        if (!acceptsEvent(screenById(design, n.dataset.screen), design.transitions, n, event, root))
            return;
        runtime = activate(design, runtime, n.dataset.screen, n.dataset.element);
        paint();
        notifyAction();
    };
    const key = event => {
        if (event.key === 'Tab' && activeModal) {
            const items = focusable(activeModal), first = items[0] || activeModal, last = items.at(-1) || activeModal;
            if (!activeModal.contains(document.activeElement) || document.activeElement === activeModal || (event.shiftKey ? document.activeElement === first : document.activeElement === last)) {
                event.preventDefault();
                (event.shiftKey ? last : first).focus();
            }
        }
        if (['Enter', ' '].includes(event.key) && event.target.matches('.ui-element[role=button]:not(button)')) {
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
            design = clone(next);
            if (!screenById(design, runtime.page))
                runtime.page = design.entryScreen;
            runtime.overlays = runtime.overlays.filter(id => screenById(design, id));
            paint();
        }, updateState(next) {
            if (!next || typeof next !== 'object' || Array.isArray(next) || Object.values(next).some(v => !['string', 'number', 'boolean'].includes(typeof v)))
                throw Error('표시 값 형식 오류');
            values = {
                ...next
            };
            paint();
        }, getState: () => clone(runtime), getDesign: () => clone(design), dispose() {
            disposed = true;
            root.removeEventListener('click', click);
            root.removeEventListener('keydown', key);
            root.replaceChildren();
        }
    };
}
